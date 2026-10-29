// エキサイター。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 高い帯だけを歪ませて倍音を作り、元の音に加える。Aphex の Aural Exciter にならった。
// EQ で高音を持ち上げるのと違って、元の音に無かった高い倍音が加わるので、こもった音でも前に出る。
//
// - 元の音を freq の 2 極のハイパスに通し、tanh で丸めて倍音を作る(奇数の倍音)。偶数の倍音も出るように、
//   丸めたもの t に 0.5 × 4 × t² を加える(4 は丸める強さ。t が 1/4 で頭打ちになるので、2 乗の項は t の半分まで)
// - 丸める前の h を引いて、丸めて出た倍音だけにする。EQ のように高い帯そのものを持ち上げはしない
// - 作ったものを、もう一度同じハイパスに通す(2 乗で出る直流と、低い帯へ落ちたものを外す)
// - それを amount 倍して、元の音に加える。元の音はそのまま残る(amount 0 で元の音だけ)
// - 丸めは tanh(4 h) / 4。小さい音はほとんど丸まらないので、倍音も小さい

/** exciter の処理器の名前 */
export const EXCITER_NODE = 'mmsxx-exciter';

/** 高い帯を丸める強さ。tanh(DRIVE h) / DRIVE */
export const EXCITER_DRIVE = 4;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const EXCITER_FX = {
  exciter: {
    tags: ['eq', 'saturation'], dev: ['wip'], version: '0.1',
    desc: 'Exciter, as in the Aphex Aural Exciter. Only the highs are driven into gentle distortion, which makes new harmonics above them, and those harmonics are added to the sound. Unlike raising the treble with an EQ, it adds brightness the sound did not have, so a dull sound comes forward. The dry sound is kept as it is.',
    params: {
      freq: { live: false, unit: 'Hz', min: 1000, max: 12000, default: 3000, desc: 'Lowest pitch that is excited. Only the part of the sound above this is driven and added.' },
      amount: { live: false, min: 0, max: 1, default: 0.3, desc: 'How much of the new harmonics is added, from 0 (nothing, the dry sound alone) to 1. Loud highs make many harmonics; quiet highs make few, so they change little.' },
          mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
};

/**
 * exciter の処理器。入口 1 つ、出口 1 つ。チャンネルごとに状態を持つ。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const EXCITER_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(EXCITER_FX.exciter.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const DRIVE = ${EXCITER_DRIVE};
class Exciter extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    const f = Math.min(v('freq', 1000, 12000), sampleRate * 0.45);
    this.amount = v('amount', 0, 1);
    // 2 極のハイパス(Butterworth)。RBJ の形
    const w0 = 2 * Math.PI * f / sampleRate, al = Math.sin(w0) / Math.SQRT2, c = Math.cos(w0), a0 = 1 + al;
    this.k = { b0: (1 + c) / 2 / a0, b1: -(1 + c) / a0, b2: (1 + c) / 2 / a0, a1: -2 * c / a0, a2: (1 - al) / a0 };
    this.st = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, k = this.k, amount = this.amount;
    for (let c = 0; c < out.length; c++) {
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      if (!x) { y.fill(0); continue; }
      if (amount === 0) { y.set(x); continue; }
      const s = this.st[c] || (this.st[c] = [0, 0, 0, 0]);
      let a1 = s[0], a2 = s[1], b1 = s[2], b2 = s[3];
      for (let i = 0; i < len; i++) {
        const xi = x[i];
        const h = k.b0 * xi + a1;
        a1 = k.b1 * xi - k.a1 * h + a2;
        a2 = k.b2 * xi - k.a2 * h;
        const t = Math.tanh(DRIVE * h) / DRIVE;
        // 丸めて出た倍音だけ。丸める前の h を引く
        const g = t - h + 0.5 * DRIVE * t * t;
        const e = k.b0 * g + b1;
        b1 = k.b1 * g - k.a1 * e + b2;
        b2 = k.b2 * g - k.a2 * e;
        y[i] = xi + amount * e;
      }
      s[0] = a1; s[1] = a2; s[2] = b1; s[3] = b2;
    }
    return true;
  }
}
registerProcessor('${EXCITER_NODE}', Exciter);
`;
