// 書き出した音の大きさを測る。数の並びだけを扱うので、どこでも動く。
//
// 測るのは 3 つ。
//
// | | 何を言うか |
// | --- | --- |
// | Integrated ラウドネス(LUFS) | 曲ぜんぶをならして、人の耳の重みを掛けた大きさ |
// | サンプルピーク(dBFS) | 標本の中でいちばん大きかったところ |
// | true peak(dBTP) | 標本と標本のあいだを含めた、本当の山 |
//
// なぜ 3 つとも要るか。LUFS だけでは天井に当たるかが分からず、
// サンプルピークだけでは聞いた大きさが分からない。true peak を別に測るのは、
// mp3 や AAC へ変換するときに山が 1〜3dB 伸びるので、
// サンプルピークで 0 まで詰めたものは変換後に歪むため。
//
// ---- 何に合わせるのか ----
//
// 配信は −14 LUFS あたりを見ていて、true peak は −1 dBTP までに収める。
// 放送(ARIB TR-B32 / EBU R128)の −24 LKFS / −23 LUFS とは 10dB 違うので、
// 数字を混ぜない。
//
// ---- 出どころ ----
//
// ITU-R BS.1770-4。K 重み付けのフィルタは、48kHz の係数を書き写すのではなく
// その場で作る。44.1kHz でも 48kHz でも同じ道が通るようにするため。
//
// 確かめ方は test/loudness.test.js にある。規格が言う「1kHz を −20 dBFS で
// 左右に入れると −20 LKFS」を留めてある。

/** ITU-R BS.1770-4 の 1 つめ(高いほうを持ち上げるシェルビング)*/
const SHELF = { f0: 1681.974450955533, gainDb: 3.999843853973347, q: 0.7071752369554196 };
/** 同じく 2 つめ(低いほうを削るハイパス。もとは RLB 重み付け)*/
const HIGHPASS = { f0: 38.13547087602444, q: 0.5003270373238773 };

/** シェルビングの係数を、その標本化周波数のぶんだけ作る */
function shelfCoeffs(rate) {
  const k = Math.tan(Math.PI * SHELF.f0 / rate);
  const vh = Math.pow(10, SHELF.gainDb / 20);
  const vb = Math.pow(vh, 0.4996667741545416);
  const a0 = 1 + k / SHELF.q + k * k;
  return {
    b0: (vh + vb * k / SHELF.q + k * k) / a0,
    b1: 2 * (k * k - vh) / a0,
    b2: (vh - vb * k / SHELF.q + k * k) / a0,
    a1: 2 * (k * k - 1) / a0,
    a2: (1 - k / SHELF.q + k * k) / a0,
  };
}

/** ハイパスの係数 */
function highpassCoeffs(rate) {
  const k = Math.tan(Math.PI * HIGHPASS.f0 / rate);
  const a0 = 1 + k / HIGHPASS.q + k * k;
  return {
    b0: 1, b1: -2, b2: 1,
    a1: 2 * (k * k - 1) / a0,
    a2: (1 - k / HIGHPASS.q + k * k) / a0,
  };
}

/** 2 次フィルタを 1 本通す */
function biquad(x, c) {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = c.b0 * x[i] + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v;
    y[i] = v;
  }
  return y;
}

/** 平均二乗から LKFS を出す。−0.691 は規格が決めている下駄 */
const lkfs = (z) => (z > 0 ? -0.691 + 10 * Math.log10(z) : -Infinity);

const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;

/**
 * Integrated ラウドネス(LUFS)。
 *
 * 400ms の範囲を 100ms ずつずらして測り、静かなところを外してからならす。
 * 外し方は 2 つ。まず −70 LUFS より下を捨て(絶対)、
 * 残りの平均から 10 LU 下を境にもう一度捨てる(相対)。
 * 曲の前後の無音や間が、大きさを引き下げないようにするため。
 *
 * 左右の重みは 1.0。囲む音(サラウンド)の重みは持たない。
 *
 * @param {Float32Array[]} channels チャンネルごとの標本(-1〜1)
 * @param {number} rate 標本化周波数
 * @returns {number} LUFS。測れるところが無ければ -Infinity
 */
export function integratedLoudness(channels, rate) {
  if (!channels.length || !channels[0].length) return -Infinity;
  const shelf = shelfCoeffs(rate);
  const hp = highpassCoeffs(rate);
  const weighted = channels.map((c) => biquad(biquad(c, shelf), hp));

  const block = Math.round(rate * 0.4);
  const step = Math.round(rate * 0.1);
  const n = weighted[0].length;
  if (n < block) return -Infinity;

  const zs = [];
  for (let start = 0; start + block <= n; start += step) {
    let z = 0;
    for (const w of weighted) {
      let sum = 0;
      for (let i = start; i < start + block; i++) sum += w[i] * w[i];
      z += sum / block;
    }
    zs.push(z);
  }

  const loud = zs.filter((z) => lkfs(z) > -70);
  if (!loud.length) return -Infinity;
  const gate = lkfs(mean(loud)) - 10;
  const used = loud.filter((z) => lkfs(z) > gate);
  if (!used.length) return -Infinity;
  return lkfs(mean(used));
}

/** true peak を測るときの補間の細かさ(4 倍。規格の下限)*/
const OVERSAMPLE = 4;
/** 補間に使う窓つき sinc の、片側の長さ */
const HALF_TAPS = 16;

/** 位相ごとの係数。標本化周波数に依らないので、1 度作って使い回す */
let taps = null;
function interpolationTaps() {
  if (taps) return taps;
  taps = [];
  for (let phase = 0; phase < OVERSAMPLE; phase++) {
    const h = new Float64Array(HALF_TAPS * 2 + 1);
    for (let k = -HALF_TAPS; k <= HALF_TAPS; k++) {
      const t = k - phase / OVERSAMPLE;
      const sinc = t === 0 ? 1 : Math.sin(Math.PI * t) / (Math.PI * t);
      // ブラックマン窓。端を落として、打ち切りの波紋を抑える
      const p = (k + HALF_TAPS) / (HALF_TAPS * 2);
      const win = 0.42 - 0.5 * Math.cos(2 * Math.PI * p) + 0.08 * Math.cos(4 * Math.PI * p);
      h[k + HALF_TAPS] = sinc * win;
    }
    taps.push(h);
  }
  return taps;
}

/**
 * true peak(標本と標本のあいだを含めた山)。
 *
 * 4 倍に補間して探す。サンプルピークより大きくなることがある —
 * 標本が山の頂上を踏み外していると、あいだに本当の頂上がある。
 *
 * 補間するのは大きいところの近くだけにしてある。全部の標本で係数を掛けると
 * 曲 1 本で数億回になり、書き出しのたびに待たされる。山の隣は必ず大きいので、
 * サンプルピークから 12dB 落ちたところで切っても頂上は逃さない。
 *
 * @param {Float32Array[]} channels
 * @returns {number} 0〜。1 を越えたら天井の上
 */
export function truePeak(channels) {
  const h = interpolationTaps();
  let peak = 0;
  for (const x of channels) for (let i = 0; i < x.length; i++) {
    const a = Math.abs(x[i]);
    if (a > peak) peak = a;
  }
  if (peak === 0) return 0;

  const near = peak * 0.25;                 // −12dB
  let found = peak;
  for (const x of channels) {
    for (let i = HALF_TAPS; i < x.length - HALF_TAPS; i++) {
      if (Math.abs(x[i]) < near) continue;
      for (let phase = 1; phase < OVERSAMPLE; phase++) {
        const t = h[phase];
        let v = 0;
        for (let k = -HALF_TAPS; k <= HALF_TAPS; k++) v += t[k + HALF_TAPS] * x[i + k];
        const a = Math.abs(v);
        if (a > found) found = a;
      }
    }
  }
  return found;
}

/** 0〜1 を dB に直す。0 は -Infinity */
export const toDb = (v) => (v > 0 ? 20 * Math.log10(v) : -Infinity);

/**
 * まとめて測る。
 * @param {Float32Array[]} channels チャンネルごとの標本(-1〜1)
 * @param {number} rate 標本化周波数
 * @returns {{lufs:number, peakDb:number, truePeakDb:number, clipped:number}}
 *   clipped = 天井(±1)に届いていた標本の数。0 でなければ歪んでいる
 */
export function measureLoudness(channels, rate) {
  let peak = 0, clipped = 0;
  for (const c of channels) {
    for (let i = 0; i < c.length; i++) {
      const a = Math.abs(c[i]);
      if (a > peak) peak = a;
      if (a >= 1) clipped++;
    }
  }
  return {
    lufs: integratedLoudness(channels, rate),
    peakDb: toDb(peak),
    truePeakDb: toDb(truePeak(channels)),
    clipped,
  };
}
