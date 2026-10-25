// 山のあいだの底を持ち上げるエフェクト(noisefill)。全体かチャンネルに掛ける。
//
// ノイズを取る処理(山を残して、山のあいだの底を下げる)の逆。山はそのままにして、
// 元の音の形に沿ったノイズを足す。一定のヒスを乗せるのとは違い、鳴っている帯にだけ、
// 鳴っているあいだだけノイズが出る。
//
// ---- 何をするか ----
//
// 1. 元の音を、高さごとに帯に分ける(2 極のバンドパスを並べる)
// 2. 帯ごとに、いまどれくらい鳴っているかを追う(包絡の追従)
// 3. 同じ帯に通したノイズを、2 の大きさで鳴らして、元の音に足す
//
// ノイズを鳴らす音源にしたボコーダーに近い。フィルタを並べるだけなので遅れは無い。
//
// TR-808 のシンバルを録音に合わせたとき、サイン波で山を並べただけでは山と底の差が
// 録音より 10〜15dB 大きく、金属っぽく聞こえた。帯ごとに、その帯の山と同じ減り方の
// ノイズを敷くと録音に近づいた(samples/addons/tr808)。それを、どの音にも掛けられる
// 形にしたもの(2026-10-24)

/** noisefill の処理器の名前 */
export const NOISEFILL_NODE = 'mmsxx-noisefill';

/** 定義。MASTER_FX(sound/fx.js)と同じ形 */
export const NOISEFILL_FX = {
  noisefill: {
    tags: ['noise', 'texture'], dev: ['wip'],
    desc: 'Noise fill, the opposite of noise reduction. The peaks of the sound are left as they are, and noise is laid in the gaps between them, shaped by the sound itself: each band of the sound gets noise of its own band, as loud as that band is playing and only while it plays. Silence stays silent. Use it to make clean, tonal sounds such as sines, FM bells or metallic stacks sound breathier, airier or less metallic. It adds no delay.',
    params: {
      amount: { live: false, unit: 'dB', min: -40, max: 0, default: -18, desc: 'How loud the noise is against each band of the sound, in dB. -18 is a light breath under the tone; -6 makes the sound hiss as much as it rings; 0 puts the noise level with the sound.' },
      bands: { live: false, min: 4, max: 24, default: 12, desc: 'How many bands the sound is split into, rounded to a whole number. More bands follow the shape of the sound more closely and cost more.' },
      speed: { live: false, unit: 's', min: 0.002, max: 0.5, default: 0.02, desc: 'Seconds the noise takes to follow the sound, roughly. Short times track every hit; longer times smear the noise into a smooth wash that lingers after the sound.' },
      tilt: { live: false, unit: 'dB/oct', min: -6, max: 6, default: 0, desc: 'Leans the noise towards the highs or the lows, in dB per octave around 2 kHz. Positive values add more air at the top; negative values keep the hiss down there.' },
      low: { live: false, unit: 'Hz', min: 50, max: 8000, default: 200, desc: 'Centre of the lowest band. The bands are spread from here up to 16 kHz, evenly in octaves. Raise it to leave the bass untouched.' },
    },
  },
};

/**
 * noisefill の処理器。入口 1 つ、出口 1 つ。チャンネルごとに帯のフィルタと追従を持つ。
 *
 * 帯の数だけ、元の音のバンドパスとノイズのバンドパスを 1 組ずつ回す。どちらも 2 極を 2 段重ねる。
 * ノイズのバンドパスの出力も同じ速さで追い、その大きさで割ってから、元の音の帯の大きさを掛ける。
 * こうすると、帯の幅によってノイズの大きさが変わらない。
 *
 * 乱数は種を決めた xorshift で作る(sound/fxtape.js と同じ)。左右で別のノイズにする。
 * 鳴らすときと書き出すときで、同じノイズになる。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const NOISEFILL_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(NOISEFILL_FX.noisefill.params).map(([k, v]) => [k, v.default])))};
// 帯のいちばん上の真ん中。サンプリング周波数の半分の手前で止める
const TOP = 16000;
// tilt の軸
const PIVOT = 2000;
// ノイズの追従の下限。始まったばかりで追従がまだ小さいとき、割り算で跳ねないように
const FLOOR = 1e-4;
const SEED = 0x51f1;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const warp = (fc, sr) => Math.tan(Math.PI * Math.min(Math.max(fc, 1), sr * 0.45) / sr);

/** xorshift32。-1〜1 を返す */
function rng(seed) {
  let x = seed >>> 0 || 1;
  return () => {
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5; x >>>= 0;
    return x / 4294967296 * 2 - 1;
  };
}

class NoiseFill extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    const sr = sampleRate;
    const n = Math.round(v('bands', 4, 24));
    const low = v('low', 50, 8000);
    const top = Math.max(low * 1.5, Math.min(TOP, sr * 0.42));
    // 帯の真ん中を、オクターブで等しい間隔に並べる。幅はとなりの帯と半分ずつ重なるくらい
    const r = Math.pow(top / low, 1 / (n - 1));
    const k = (r - 1) / Math.sqrt(r);
    this.n = n;
    this.k = k;
    this.fc = [];
    this.coef = [];
    this.gain = [];
    const tilt = v('tilt', -6, 6);
    const amount = Math.pow(10, v('amount', -40, 0) / 20);
    for (let i = 0; i < n; i++) {
      const fc = low * Math.pow(r, i);
      const g = warp(fc, sr);
      const a1 = 1 / (1 + g * (g + k));
      this.coef.push([a1, g * a1, g * g * a1]);
      this.gain.push(amount * Math.pow(10, tilt * Math.log2(fc / PIVOT) / 20));
    }
    // 追従の速さ。1 サンプルで目標へ寄る量(時定数 speed / 3)
    this.c = 1 - Math.exp(-1 / (sr * v('speed', 0.002, 0.5) / 3));
    this.chans = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  chan(c) {
    const n = this.n;
    return this.chans[c] || (this.chans[c] = {
      // 元の音のバンドパス、ノイズのバンドパス(どちらも 2 段で、状態 4 つずつ)、元の音の追従、ノイズの追従
      s: new Float64Array(n * 4), t: new Float64Array(n * 4),
      e: new Float64Array(n), ne: new Float64Array(n).fill(FLOOR),
      rand: rng(SEED + 0x9e37 * (c + 1)),
    });
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, n = this.n, k = this.k, cf = this.coef, gain = this.gain, c = this.c;
    for (let ch = 0; ch < out.length; ch++) {
      const st = this.chan(ch);
      const x = inp && (inp[ch] || inp[0]);
      const y = out[ch];
      const s = st.s, t = st.t, e = st.e, ne = st.ne, rand = st.rand;
      for (let i = 0; i < len; i++) {
        const xi = x ? x[i] : 0;
        const w = rand();
        let add = 0;
        for (let b = 0; b < n; b++) {
          const q = cf[b], a1 = q[0], a2 = q[1], a3 = q[2], j = b * 4;
          // 元の音の帯。2 極のバンドパス(sound/filter.js の BandPass と同じく、山の高さを 1 にそろえる)を
          // 2 段重ねる。1 段だと裾が緩く、離れた帯の音にもノイズが乗った
          let v3 = xi - s[j + 1];
          let v1 = a1 * s[j] + a2 * v3;
          let v2 = s[j + 1] + a2 * s[j] + a3 * v3;
          s[j] = 2 * v1 - s[j]; s[j + 1] = 2 * v2 - s[j + 1];
          let u = k * v1;
          v3 = u - s[j + 3];
          v1 = a1 * s[j + 2] + a2 * v3;
          v2 = s[j + 3] + a2 * s[j + 2] + a3 * v3;
          s[j + 2] = 2 * v1 - s[j + 2]; s[j + 3] = 2 * v2 - s[j + 3];
          const band = k * v1;
          e[b] += (Math.abs(band) - e[b]) * c;
          // ノイズの帯。同じく 2 段
          v3 = w - t[j + 1];
          v1 = a1 * t[j] + a2 * v3;
          v2 = t[j + 1] + a2 * t[j] + a3 * v3;
          t[j] = 2 * v1 - t[j]; t[j + 1] = 2 * v2 - t[j + 1];
          u = k * v1;
          v3 = u - t[j + 3];
          v1 = a1 * t[j + 2] + a2 * v3;
          v2 = t[j + 3] + a2 * t[j + 2] + a3 * v3;
          t[j + 2] = 2 * v1 - t[j + 2]; t[j + 3] = 2 * v2 - t[j + 3];
          const nb = k * v1;
          ne[b] += (Math.abs(nb) - ne[b]) * c;
          add += gain[b] * e[b] * nb / Math.max(ne[b], FLOOR);
        }
        y[i] = xi + add;
      }
    }
    return true;
  }
}
registerProcessor('${NOISEFILL_NODE}', NoiseFill);
`;
