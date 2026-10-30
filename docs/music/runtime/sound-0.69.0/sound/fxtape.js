// テープ(スタジオのオープンリール)に録って再生したときの音。全体かチャンネルに掛けるエフェクト。
//
// 真空管(tube)とトランス(transformer)は別のファイルで作っていて、
// あとで tube → transformer → tape の順に並べる。ここではテープのぶんだけを持つ。
//
// ---- 何を写したか ----
//
// 1 サンプルずつ、次の順に通す。
//
// 1. 録音のイコライザ(プリエンファシス)。高音を持ち上げてから磁気テープに書く
// 2. テープの飽和。磁性体が磁化しきれなくなって頭打ちになる。tanh で丸める
// 3. ヒス。テープの磁性体の粒から出る雑音。再生ヘッドが拾う
// 4. 再生のイコライザ(ディエンファシス)。1 で持ち上げた高音を元に戻す。
//    3 のヒスの高音もここで下がる(エンファシスはそのためにある)
// 5. ヘッドバンプ。再生ヘッドの幅とテープの上の波長が近くなる低音で、
//    応答に山ができる。その下は下がる
// 6. 高音の損失。速度が遅いほどテープの上の波長が短くなり、高音が早く落ちる
// 7. ワウとフラッター。テープの速さの揺れ。変調した遅れ線で写す
//
// 1 と 4 は互いにちょうど逆になる形にしてある。小さい音では打ち消し合い、
// 中音域はそのまま通る。大きい音では 2 で丸められるときに高音のほうが強く潰れるので、
// 立ち上がりの尖った音(高音を多く含む)ほど低く出てくる。テープで打楽器の
// 頭が丸くなるのを、これで写している。本物の磁化の履歴(ヒステリシス)と
// バイアスは解いていない。近似である。
//
// 数字はどれも、測った機械のものではない。速度ごとの周波数は覚えている範囲の
// おおまかな値から決めた。各所のコメントにそう書いてある。

/** tape の処理器の名前 */
export const TAPE_NODE = 'mmsxx-tape';

/**
 * 遅れ線の決まった遅れ(秒)。wow と flutter の値によらず、出てくる音はいつもこのぶん遅れる。
 * 揺らす量の上限(下の WOW_DEPTH と FLUTTER_DEPTH から出る約 8.6ms)より長く取ってある。
 * 実際の遅れはサンプル数に丸めたもの(48kHz なら 480 サンプル)。
 * 揺れの上限を 3 倍にしたときに、4ms から延ばした(2026-10-24)
 */
export const TAPE_LATENCY = 0.01;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const TAPE_FX = {
  tape: {
    tags: ['saturation', 'vintage', 'modulation'], dev: [], version: '1.00',
    desc: 'Magnetic tape. Sounds as if the tune was recorded to a studio reel-to-reel machine and played back: loud parts and sharp hits are rounded off, the highs soften, a small bump appears in the bass, and the pitch wavers slightly as the tape moves unevenly. Optional hiss. The sound comes out 10 ms late.',
    params: {
      drive: { live: false, min: 0, max: 1, default: 0.18, desc: 'How hard the tape is driven. 0 is a clean recording; quiet parts always pass unchanged. Higher values round off loud parts and the attack of drums and plucks, and add warm harmonics. The highs are squashed first, as on real tape.' },
      speed: { live: false, unit: 'ips', min: 3.75, max: 30, default: 15, desc: 'Tape speed in inches per second. 3.75 is dull and muffled, losing everything above about 4.5 kHz; 7.5 is dark with a low, deep bass bump; 15 is the usual studio speed; 30 keeps nearly all the highs and moves the bass bump up to about 100 Hz.' },
      wow: { live: false, min: 0, max: 1, default: 0.017, desc: 'Slow pitch wobble, about once or twice a second, like a worn reel or a warped tape. At 1 the pitch swings by up to about half a semitone, which is clearly seasick; 0.3 is a tired cassette deck. The default is a well kept machine, barely heard.' },
      flutter: { live: false, min: 0, max: 1, default: 0.03, desc: 'Fast pitch wobble, about 7 to 11 times a second. It makes held notes sound rough or watery rather than out of tune. At 1 the pitch swings by up to about 17 cents, a warbling, broken machine.' },
      hiss: { live: false, min: 0, max: 1, default: 0, desc: 'Tape hiss: a soft, steady noise that goes on even when the tune is silent. Left and right get different noise. 1 is about 40 dB below full scale, which is far noisier than a studio machine; 0.3 is closer to real tape without noise reduction.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
};

/**
 * 揺らす量の上限。速さの比のずれ(0.01 は 1%)で持つ。
 * 遅れを D sin(2π f t) で動かすと、音の高さは 1 - 2π f D cos(2π f t) 倍になる。
 * 3% は約 51 セント(1200 log2(1.03))、1% は約 17 セント。
 * よく手入れした機械は合わせて 0.05% ほどと覚えているが、確かめてはいない。
 * 上限は効果として聞いて分かる大きさに取った。
 * 前は 1% と 0.3% だったが、動かしても違いが分かりにくいと言われて 3 倍にした(2026-10-24)
 */
const WOW_DEPTH = 0.03;
const FLUTTER_DEPTH = 0.01;

/**
 * 乱数と、揺れの強さの移り変わり。tape と vinyl(sound/fxvinyl.js)の処理器が使う(2026-10-26)
 */
export const TAPE_WOBBLE_CODE = `
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

/** 揺れの強さ。len サンプルごとに次の目標を引き、smoothstep でつなぐ。0〜1 */
class Drift {
  constructor(rand, len) { this.rand = rand; this.len = len; this.n = 0; this.from = 0.5; this.to = this.pick(); }
  pick() { return this.rand() * 0.5 + 0.5; }
  next() {
    if (this.n >= this.len) { this.n = 0; this.from = this.to; this.to = this.pick(); }
    const t = this.n++ / this.len;
    return this.from + (this.to - this.from) * t * t * (3 - 2 * t);
  }
}
`;

/**
 * tape の処理器。入口 1 つ、出口 1 つ。チャンネルごとにフィルタと遅れ線を持つ。
 * 揺れは左右で 1 つを共にする(1 本のテープが両方のトラックを運ぶので、
 * 左右が別々に揺れることはない)。ヒスだけは左右で別のものにする。
 *
 * 乱数は種を決めた xorshift で作る(sound/fx.js の reverbImpulse と同じ)。
 * 鳴らすときと書き出すときで、同じ揺れ、同じヒスになる。
 *
 * 重さは、Node で 128 サンプルを回して測ると締め切りの 0.26〜0.32%(モノラル 1 本、
 * 揺れを切ったときと既定のとき。2026-10-20、この 1 回だけ。FX_COST と同じ測り方ではない)。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const TAPE_CODE = `
const LATENCY = ${TAPE_LATENCY};
const WOW_DEPTH = ${WOW_DEPTH};
const FLUTTER_DEPTH = ${FLUTTER_DEPTH};
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(TAPE_FX.tape.params).map(([k, v]) => [k, v.default])))};

// drive 0〜1 を、飽和の手前で掛ける倍率 0〜30dB にする。前は 18dB で、
// 動かしても違いが分かりにくいと言われて延ばした(2026-10-24)。形は tanh(g x) / g で、
// 小さい音は傾き 1 のまま通る(sound/fx.js の saturator と同じ考え方)
const DRIVE_DB = 30;

// エンファシスの角。50μs(約 3.2kHz)は NAB の 15ips の時定数として覚えている値。
// 速度ごとに変えるのが本当だが、ここでは 1 つに固定した。
// 高音側の持ち上げは 1 + EMPH 倍(約 9.5dB)で止まる棚の形にした。
// 本物のイコライザは棚ではなく、ここは近似
const EMPH_HZ = 1 / (2 * Math.PI * 50e-6);
const EMPH = 2;

// ヘッドバンプの周波数は速度に比例させる。3.3 × ips で、7.5ips が約 25Hz、15ips が約 50Hz、
// 30ips が約 100Hz。覚えている範囲のおおまかな値で、機械や再生ヘッドで変わる。
// 本物は山のあとに細かい波が続くが、いちばん大きい山 1 つだけを写す。
// 高さは約 +2dB、その半分の周波数から下を 12dB/oct で落とす
const BUMP_PER_IPS = 3.3;
const BUMP_DB = 2;
const BUMP_K = 0.7;
const LOWCUT_RATIO = 0.5;

// 高音の損失。2 極のローパスで、角を速度に比例させる(1200 × ips。7.5ips で 9kHz、
// 15ips で 18kHz、30ips はサンプリング周波数の半分の手前で止まる)。
// 本物はヘッドの隙間とテープとの間の距離で決まり、落ち方はもっと急で波打つ。
// 角の値はおおまかに決めたもので、測っていない
const HF_PER_IPS = 1200;
const BUTTER_K = Math.SQRT2;

// 揺れの形。ワウは 0.5Hz と 0.83Hz、フラッターは 6.9Hz と 11.3Hz の正弦を重ねる。
// 周波数は聞いて決めたもので、特定の機械の数字ではない。
// 強さは一定の間隔ごとに乱数で決めた目標へなめらかに移る(本物の揺れは周期どおりでない)。
// 間隔はワウ 2 秒、フラッター 0.25 秒。強さが動くこと自体も速さのずれになるので、
// ワウの間隔を短くすると上限を越える(0.25 秒なら上限の 7 割ほど上乗せになる)
const WOW_F = [0.5, 0.83], WOW_A = [0.8, 0.2];
const FLUT_F = [6.9, 11.3], FLUT_A = [0.7, 0.3];
const WOW_DRIFT_SEC = 2, FLUT_DRIFT_SEC = 0.25;

// ヒス。hiss 1 で、再生のイコライザの手前で実効値 0.03。そのあとで高音が下がる。
// ほかの値といっしょに強めたが、もとから多すぎるくらいだと言われて戻した(2026-10-24)
const HISS_RMS = 0.03;

const SEED = 0x7a9e;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const warp = (fc, sr) => Math.tan(Math.PI * Math.min(Math.max(fc, 1), sr * 0.45) / sr);

${TAPE_WOBBLE_CODE}

/**
 * 2 極の SVF(sound/filter.js の FILTER_CORE と同じ TPT の形)。係数と状態だけを持つ。
 * 回す式は process の中にじかに書いてある。メソッドで回すより、手元で 1 割弱軽かった
 */
class Svf {
  constructor(g, k) {
    this.k = k;
    this.a1 = 1 / (1 + g * (g + k)); this.a2 = g * this.a1; this.a3 = g * this.a2;
    this.ic1 = 0; this.ic2 = 0;
  }
}

class Tape extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    const sr = sampleRate;
    const drive = v('drive', 0, 1), speed = v('speed', 1, 60);
    const wow = v('wow', 0, 1), flutter = v('flutter', 0, 1), hiss = v('hiss', 0, 1);
    this.g = Math.pow(10, drive * DRIVE_DB / 20);
    // 1 極の TPT。録音側は 1 + EMPH × ハイパス(角 ge)、再生側は (1 + EMPH × ローパス(角 ge / (1 + EMPH))) / (1 + EMPH)。
    // 同じ双一次変換の上で互いの逆になっているので、線形の範囲ではちょうど打ち消す
    const ge = warp(EMPH_HZ, sr);
    this.Ge = ge / (1 + ge);
    const gd = ge / (1 + EMPH);
    this.Gd = gd / (1 + gd);
    this.bumpG = warp(BUMP_PER_IPS * speed, sr);
    this.bumpA = Math.pow(10, BUMP_DB / 20) - 1;
    this.cutG = warp(BUMP_PER_IPS * speed * LOWCUT_RATIO, sr);
    this.hfG = warp(HF_PER_IPS * speed, sr);
    this.hissAmp = hiss * hiss * HISS_RMS * Math.sqrt(3);   // 一様乱数の実効値は 1/√3
    // 遅れ線。決まった遅れ base のまわりを揺らす
    this.base = Math.max(1, Math.round(LATENCY * sr));
    let n = 4;
    while (n < this.base * 2 + 4) n *= 2;
    this.size = n; this.mask = n - 1; this.w = 0;
    // 速さのずれの上限から遅れの振れ幅(サンプル)を出す。ずれ = 2π Σ a f D
    const sum = (F, A) => F.reduce((s, f, i) => s + f * A[i], 0);
    this.wowD = wow * WOW_DEPTH / (2 * Math.PI * sum(WOW_F, WOW_A)) * sr;
    this.flutD = flutter * FLUTTER_DEPTH / (2 * Math.PI * sum(FLUT_F, FLUT_A)) * sr;
    this.moving = this.wowD > 0 || this.flutD > 0;
    // 正弦は回転で進める(毎サンプル sin を呼ばない)。[cos, sin, 1 サンプルの cos, sin]
    this.osc = [...WOW_F, ...FLUT_F].map((f) => {
      const w = 2 * Math.PI * f / sr;
      return [1, 0, Math.cos(w), Math.sin(w)];
    });
    const rand = rng(SEED);
    this.wowDrift = new Drift(rand, Math.max(1, Math.round(WOW_DRIFT_SEC * sr)));
    this.flutDrift = new Drift(rand, Math.max(1, Math.round(FLUT_DRIFT_SEC * sr)));
    this.mod = new Float32Array(128);
    this.chans = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  chan(c) {
    return this.chans[c] || (this.chans[c] = {
      se: 0, sd: 0,
      bump: new Svf(this.bumpG, BUMP_K), cut: new Svf(this.cutG, BUTTER_K), hf: new Svf(this.hfG, BUTTER_K),
      buf: new Float32Array(this.size),
      rand: rng(SEED + 0x9e37 * (c + 1)),
    });
  }
  // このブロックの遅れ(サンプル)を、左右で共にするぶんとして先に作る
  modulate(len) {
    if (this.mod.length < len) this.mod = new Float32Array(len);
    const m = this.mod, base = this.base;
    if (!this.moving) { m.fill(base, 0, len); return; }
    const o = this.osc, wa = this.wowD, fa = this.flutD;
    for (let i = 0; i < len; i++) {
      for (let k = 0; k < 4; k++) {
        const q = o[k], c = q[0], s = q[1];
        q[0] = c * q[2] - s * q[3];
        q[1] = s * q[2] + c * q[3];
      }
      const wow = (WOW_A[0] * o[0][1] + WOW_A[1] * o[1][1]) * (0.6 + 0.4 * this.wowDrift.next());
      const flut = (FLUT_A[0] * o[2][1] + FLUT_A[1] * o[3][1]) * (0.6 + 0.4 * this.flutDrift.next());
      m[i] = base + wa * wow + fa * flut;
    }
    // 回転を続けると丸めで半径がずれていくので、ブロックごとに 1 へ戻す
    for (const q of o) { const r = 1.5 - 0.5 * (q[0] * q[0] + q[1] * q[1]); q[0] *= r; q[1] *= r; }
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length;
    this.modulate(len);
    const m = this.mod, g = this.g, ig = 1 / g, Ge = this.Ge, Gd = this.Gd;
    const bumpA = this.bumpA, hissAmp = this.hissAmp, mask = this.mask, size = this.size;
    const ed = 1 / (1 + EMPH);
    let w0 = this.w;
    for (let c = 0; c < out.length; c++) {
      const s = this.chan(c);
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      const buf = s.buf, bump = s.bump, cut = s.cut, hf = s.hf;
      const ba1 = bump.a1, ba2 = bump.a2, ba3 = bump.a3;
      const ca1 = cut.a1, ca2 = cut.a2, ca3 = cut.a3;
      const ha1 = hf.a1, ha2 = hf.a2, ha3 = hf.a3;
      let b1 = bump.ic1, b2 = bump.ic2, c1s = cut.ic1, c2s = cut.ic2, h1 = hf.ic1, h2 = hf.ic2;
      let se = s.se, sd = s.sd, w = w0;
      for (let i = 0; i < len; i++) {
        const xi = x ? x[i] : 0;
        // 1. プリエンファシス(1 極のハイパスを足す)
        let ve = (xi - se) * Ge; const lp = ve + se; se = lp + ve;
        const e = xi + EMPH * (xi - lp);
        // 2. 飽和 3. ヒス
        let u = Math.tanh(g * e) * ig;
        if (hissAmp > 0) u += s.rand() * hissAmp;
        // 4. ディエンファシス
        const vd = (u - sd) * Gd; const ld = vd + sd; sd = ld + vd;
        let z = (u + EMPH * ld) * ed;
        // 5. ヘッドバンプ(山)と、その下の低音の損失
        let v3 = z - b2, v1 = ba1 * b1 + ba2 * v3, v2 = b2 + ba2 * b1 + ba3 * v3;
        b1 = 2 * v1 - b1; b2 = 2 * v2 - b2;
        z += bumpA * BUMP_K * v1;
        v3 = z - c2s; v1 = ca1 * c1s + ca2 * v3; v2 = c2s + ca2 * c1s + ca3 * v3;
        c1s = 2 * v1 - c1s; c2s = 2 * v2 - c2s;
        z = z - BUTTER_K * v1 - v2;
        // 6. 高音の損失
        v3 = z - h2; v1 = ha1 * h1 + ha2 * v3; v2 = h2 + ha2 * h1 + ha3 * v3;
        h1 = 2 * v1 - h1; h2 = 2 * v2 - h2;
        z = v2;
        // 7. 遅れ線。4 点のエルミート補間で、端数の位置を読む
        buf[w] = z;
        const d = m[i];
        const di = Math.floor(d), f = d - di;
        const j = w - di + size;
        const y1 = buf[(j + 1) & mask], y0 = buf[j & mask], ym1 = buf[(j - 1) & mask], ym2 = buf[(j - 2) & mask];
        // 位置 w - d は y0(w - di)と ym1(w - di - 1)の間にある
        const c1 = 0.5 * (ym1 - y1);
        const c2 = y1 - 2.5 * y0 + 2 * ym1 - 0.5 * ym2;
        const c3 = 0.5 * (ym2 - y1) + 1.5 * (y0 - ym1);
        y[i] = ((c3 * f + c2) * f + c1) * f + y0;
        w = (w + 1) & mask;
      }
      s.se = se; s.sd = sd;
      bump.ic1 = b1; bump.ic2 = b2; cut.ic1 = c1s; cut.ic2 = c2s; hf.ic1 = h1; hf.ic2 = h2;
      if (c === out.length - 1) this.w = w;
    }
    return true;
  }
}
registerProcessor('${TAPE_NODE}', Tape);
`;
