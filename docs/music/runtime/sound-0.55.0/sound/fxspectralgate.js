// ノイズを取るエフェクトの 2 つ目(spectralgate)。全体かチャンネルに掛ける。
//
// denoise(sound/fxdenoise.js)は帯ごとに絞るので、鳴っている帯のノイズは通す。
// こちらは細かいスペクトルを見て、山は残し、山のあいだの底だけを下げる。
// 鳴っている音の下のノイズも取れる。代わりに、音が SPECTRALGATE_SIZE サンプル遅れる
// (48kHz で 21ms)。ほかのチャンネルとの遅れはそろえない(tape と同じ)。
//
// ---- 何をするか ----
//
// 1. 元の音を SIZE サンプルずつ、SIZE / 4 ずらしながら切り出し、窓を掛けて FFT する
// 2. 細かい高さ(ビン)ごとに、いまの大きさをなめらかに追う
// 3. ビンごとに、まわりの高さ(前後 W ビン)のふだんの大きさを底とする。山は底から突き出て、
//    山のあいだは底の前後にいる。同じ瞬間のスペクトルだけで決めるので、覚える時間は要らない
// 4. 底の threshold dB 上より小さいビンを絞る。絞り方は、となりのビンとならし、
//    時間でもならす。ならさないと、絞り残りがぽつぽつ鳴る(ミュージカルノイズ)
// 5. 逆 FFT して窓を掛け、重ねて足す
//
// はじめは denoise と同じく、ビンごとに、音の隙間で聞いた底の大きさを覚えていた。
// テープのヒスのような、いつも鳴っているノイズには効いた。口笛の息や、フィルタに通したノイズの
// ように、音と一緒に鳴って音と一緒に止まるノイズには効かなかった。隙間では無音なので、
// 底が 0 のままになる。音の中の山と山のあいだを見る形にしたら、どちらにも効くようになった。
//
// シンバルのように、もともとノイズに近い音は、それ自体が削れる。低い音は倍音の間隔が
// ビンの幅に近いので、山のあいだが見えず、あまり削れない(2026-10-24)

/** spectralgate の処理器の名前 */
export const SPECTRALGATE_NODE = 'mmsxx-spectralgate';

/** 切り出す長さ(サンプル)。出てくる音は、このぶん遅れる */
export const SPECTRALGATE_SIZE = 1024;

/** 定義。MASTER_FX(sound/fx.js)と同じ形 */
export const SPECTRALGATE_FX = {
  spectralgate: {
    tags: ['noise', 'cleanup'], dev: ['wip'],
    desc: 'Noise reduction that looks at the fine spectrum. Each narrow slice of pitch is compared with the slices around it at the same moment: the peaks that stand out stay, and the slices that only reach the floor between them are turned down. So it takes the noise from under a note that is playing, including noise that comes and goes with the note, such as breath in a whistle. The sound comes out 1024 samples late (about 21 ms at 48 kHz), and other channels are not delayed to match. Sounds that are mostly noise, such as cymbals, are thinned along with it. denoise is the one without delay.',
    params: {
      amount: { live: false, unit: 'dB', min: 0, max: 40, default: 12, desc: 'How far the noise between the peaks is turned down, in dB. 0 leaves the sound as it is, only delayed; 12 is a clear clean-up; 30 or more can leave a watery, bubbling sound.' },
      threshold: { live: false, unit: 'dB', min: 0, max: 24, default: 6, desc: 'How far above the floor around it a slice must rise to count as a peak, in dB. Higher values clean more but may also eat the weaker partials of the sound.' },
      speed: { live: false, unit: 's', min: 0.01, max: 0.5, default: 0.05, desc: 'Seconds a slice takes to close again after the sound in it stops, roughly. It opens at once. Short times clean the tails tightly but can bubble; longer times sound smoother.' },
    },
  },
};

/**
 * spectralgate の処理器。入口 1 つ、出口 1 つ。チャンネルごとに入口の控え、出口の控え、
 * ビンごとの追従を持つ。
 *
 * 窓は、切り出しと戻しの両方にハン窓の平方根を掛ける。SIZE / 4 ずつずらして足すと、
 * 2 つの窓の積(ハン窓)の和がどこでも 2 になるので、最後に半分にする。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const SPECTRALGATE_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(SPECTRALGATE_FX.spectralgate.params).map(([k, v]) => [k, v.default])))};
const N = ${SPECTRALGATE_SIZE};
const HOP = N / 4;
const BINS = N / 2 + 1;
// 底を見る範囲。前後に何ビンずつ見るか(48kHz で 1 ビン 47Hz)
const W = 12;
// 山の目安。まわりの平均のこの倍より大きいビンは、底を出すときに数えない(山で底が上がらないように)
const CLIP = 2;
// まわりの大きさはノイズのふだんの大きさよりすこし下に出る。その差を埋める倍率(大きさの 2 乗で)
const BIAS = 2;
const TINY = 1e-20;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// FFT の下ごしらえ。ビットを逆にした並びと、回転の係数
const REV = new Uint32Array(N);
for (let i = 0, bits = Math.log2(N); i < N; i++) {
  let r = 0;
  for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b);
  REV[i] = r;
}
const COS = new Float64Array(N / 2), SIN = new Float64Array(N / 2);
for (let i = 0; i < N / 2; i++) { COS[i] = Math.cos(2 * Math.PI * i / N); SIN[i] = Math.sin(2 * Math.PI * i / N); }
const WIN = new Float64Array(N);
for (let i = 0; i < N; i++) WIN[i] = Math.sqrt(0.5 - 0.5 * Math.cos(2 * Math.PI * i / N));

/** その場で FFT する。inv なら逆向き(1 / N は掛けない) */
function fft(re, im, inv) {
  for (let i = 0; i < N; i++) {
    const j = REV[i];
    if (j > i) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
  }
  const sg = inv ? 1 : -1;
  for (let len = 2; len <= N; len <<= 1) {
    const half = len >> 1, step = N / len;
    for (let i = 0; i < N; i += len) {
      for (let k = 0; k < half; k++) {
        const c = COS[k * step], s = sg * SIN[k * step];
        const a = i + k, b = a + half;
        const tr = re[b] * c - im[b] * s, ti = re[b] * s + im[b] * c;
        re[b] = re[a] - tr; im[b] = im[a] - ti;
        re[a] += tr; im[a] += ti;
      }
    }
  }
}

/** x の前後 w ビンの平均を y に書く。足し引きしながら動かす */
function boxMean(x, y, w) {
  const n = x.length;
  let sum = 0;
  for (let j = 0; j <= w && j < n; j++) sum += x[j];
  for (let k = 0; k < n; k++) {
    const a = k - w, b = k + w;
    y[k] = sum / (Math.min(n - 1, b) - Math.max(0, a) + 1);
    if (b + 1 < n) sum += x[b + 1];
    if (a >= 0) sum -= x[a];
  }
}

class SpectralGate extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    const fr = sampleRate / HOP;
    const coef = (sec) => 1 - Math.exp(-1 / (fr * sec / 3));
    this.lo = Math.pow(10, -v('amount', 0, 40) / 20);
    // 比べるのは大きさの 2 乗なので、しきい値も 2 乗にする。
    // 底からの比の対数を、これを掛けて 0〜1 にする。threshold 0 なら、底より上はすぐ開く
    this.lthr = 1 / Math.max(1e-6, Math.log(Math.pow(10, v('threshold', 0, 24) / 10)));
    // 大きさの追従は 1 回ぶん(SIZE / 4)よりすこし長く、閉じるのは speed
    this.cs = coef(0.06);
    this.cg = coef(v('speed', 0.01, 0.5));
    this.ca = coef(0.01);
    this.re = new Float64Array(N);
    this.im = new Float64Array(N);
    this.gt = new Float64Array(BINS);
    this.pw = new Float64Array(BINS);
    this.av = new Float64Array(BINS);
    this.cl = new Float64Array(BINS);
    this.fl = new Float64Array(BINS);
    this.chans = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  chan(c) {
    return this.chans[c] || (this.chans[c] = {
      inp: new Float64Array(N), out: new Float64Array(N), pos: 0,
      s: new Float64Array(BINS), g: new Float64Array(BINS).fill(1),
    });
  }
  /** 1 回ぶん切り出して、絞って、出口の控えへ重ねる */
  frame(st) {
    const re = this.re, im = this.im, inp = st.inp, s = st.s, g = st.g, gt = this.gt, pw = this.pw, av = this.av, cl = this.cl, fl = this.fl;
    for (let i = 0; i < N; i++) { re[i] = inp[i] * WIN[i]; im[i] = 0; }
    fft(re, im, false);
    const lo = this.lo, cs = this.cs, cg = this.cg, ca = this.ca;
    for (let k = 0; k < BINS; k++) pw[k] = re[k] * re[k] + im[k] * im[k];
    // ノイズの 1 ビンの大きさは回ごとに大きく揺れるので、となりと足して、時間でもならす
    for (let k = 0; k < BINS; k++) {
      const p3 = (pw[k > 0 ? k - 1 : k] + 2 * pw[k] + pw[k < BINS - 1 ? k + 1 : k]) / 4;
      s[k] += (p3 - s[k]) * cs;
    }
    // まわりの平均。そのあと、平均の CLIP 倍で山を頭打ちにして、もう一度平均を取ったものを底とする
    boxMean(s, av, W);
    for (let k = 0; k < BINS; k++) cl[k] = Math.min(s[k], av[k] * CLIP);
    boxMean(cl, fl, W);
    for (let k = 0; k < BINS; k++) {
      // 底より下なら amount いっぱいに絞り、底の thr 倍より上なら開く。その間は dB で等しく開いていく。
      // はじめは denoise と同じく、大きさの比で開いていた。ノイズの大きさは底の前後を行き来するので、
      // 底のところでもう 1 / 16 ほど開いてしまい、amount 30 でも 10dB しか下がらなかった
      const t = Math.log(s[k] / (fl[k] * BIAS + TINY) + TINY) * this.lthr;
      gt[k] = t >= 1 ? 1 : t <= 0 ? lo : Math.pow(lo, 1 - t);
    }
    for (let k = 0; k < BINS; k++) {
      // となりのビンとならす
      const want = (gt[k > 0 ? k - 1 : k] + 2 * gt[k] + gt[k < BINS - 1 ? k + 1 : k]) / 4;
      // 開くときは速く(10ms)、閉じるときは speed で。すぐ開くと、ノイズの揺れの山ごとに開いてしまった
      g[k] += (want - g[k]) * (want > g[k] ? ca : cg);
      re[k] *= g[k]; im[k] *= g[k];
      if (k > 0 && k < N / 2) { re[N - k] = re[k]; im[N - k] = -im[k]; }
    }
    fft(re, im, true);
    const out = st.out;
    // 戻しの窓と、逆 FFT の 1 / N と、重ねたぶんの 1 / 2
    const sc = 0.5 / N;
    for (let i = 0; i < N; i++) out[i] += re[i] * WIN[i] * sc;
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length;
    for (let ch = 0; ch < out.length; ch++) {
      const st = this.chan(ch);
      const x = inp && (inp[ch] || inp[0]);
      const y = out[ch];
      for (let i = 0; i < len; i++) {
        // 入口の控えは後ろへ足していく。出口の控えは前から読む
        st.inp[N - HOP + st.pos] = x ? x[i] : 0;
        y[i] = st.out[st.pos];
        if (++st.pos === HOP) {
          st.pos = 0;
          st.out.copyWithin(0, HOP);
          st.out.fill(0, N - HOP);
          this.frame(st);
          st.inp.copyWithin(0, HOP);
        }
      }
    }
    return true;
  }
}
registerProcessor('${SPECTRALGATE_NODE}', SpectralGate);
`;
