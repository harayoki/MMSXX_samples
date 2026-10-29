// フェイザー。全体かチャンネルに掛けるエフェクト(2026-10-26)。
//
// 位相だけをずらすフィルタ(1 次のオールパス)を何段か重ね、元の音と混ぜる。
// ずれが半周になる高さで打ち消し合い、谷ができる。オールパスの折れ目を揺らすと、
// 谷が上下に動いて、音がうねる。MXR Phase 90 や Electro-Harmonix Small Stone にならった。
//
// - 谷の数は段の数の半分(4 段で 2 つ)
// - 折れ目は freq を真ん中に、上下へ depth × 2 オクターブずつ動く。揺れは正弦
// - feedback は最後の段の出口を入口へ戻す。谷のあいだに山が立ち、谷も広がって、癖が強くなる。
//   負にすると、谷が埋まり、谷のそばに小さな山が残る。うねりは穏やかになる
// - mix は DAW の Dry/Wet。0 で元の音だけ、1 でずらした音だけ。谷は元の音と
//   ずらした音が打ち消し合ってできるので、いちばん深いのは 0.5。1 にすると谷は消え、
//   位相だけが揺れる(わずかにビブラートのように聞こえる)
// - 折れ目の計算(tan)は 16 サンプルに 1 回だけ。揺れは遅いので、その間は変えなくても聞き分けられない

/** phaser の処理器の名前 */
export const PHASER_NODE = 'mmsxx-phaser';

/** 折れ目を計算し直す間隔(サンプル) */
export const PHASER_STEP = 16;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const PHASER_FX = {
  phaser: {
    tags: ['modulation'], dev: ['wip'], version: '0.1',
    desc: 'Phaser, after the MXR Phase 90 and the Small Stone. A chain of all-pass stages shifts the phase of a copy; mixed with the dry sound it cancels in a few notches, which sweep up and down to give a slow, swirling whoosh. Suits electric pianos, pads and clean guitars.',
    params: {
      rate: { live: false, unit: 'Hz', min: 0.02, max: 8, default: 0.5, desc: 'How fast the notches sweep up and down. Around 0.5 is a slow swirl; above 4 it bubbles.' },
      depth: { live: false, min: 0, max: 1, default: 0.8, desc: 'How far the notches sweep, from 0 (they stand still) to 1 (two octaves above and below freq).' },
      freq: { live: false, unit: 'Hz', min: 100, max: 4000, default: 700, desc: 'The middle of the sweep. Lower values work on the body of the sound; higher values on its brightness.' },
      feedback: { live: false, min: -0.9, max: 0.9, default: 0, desc: 'How much of the shifted sound is fed back into the chain. 0 is the plain Phase 90. Higher values raise a peak between the notches and widen them, a more vocal, resonant sweep. Negative values fill the notches in and leave small peaks beside them, a gentler, hazier sweep.' },
      stages: { live: false, min: 2, max: 12, default: 4, desc: 'How many all-pass stages are chained. Every two stages add one notch: 4 gives the two notches of the classic pedals, 12 gives six and a denser sweep.' },
      mix: { live: false, min: 0, max: 1, default: 0.5, desc: 'How much of the sound is the shifted copy, from 0 (the dry sound alone) to 1 (the copy alone). The notches are deepest at 0.5; at 1 they vanish and only a slight wobble is left.' },
    },
  },
};

/**
 * phaser の処理器。入口 1 つ、出口 1 つ。チャンネルごとに段の状態を持ち、揺れは共にする。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const PHASER_CODE = `
const STEP = ${PHASER_STEP};
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(PHASER_FX.phaser.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

class Phaser extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.rate = v('rate', 0.02, 8);
    this.oct = v('depth', 0, 1) * 2;
    this.freq = v('freq', 100, 4000);
    this.fb = v('feedback', -0.9, 0.9);
    this.stages = Math.round(v('stages', 2, 12));
    this.mix = v('mix', 0, 1);
    // チャンネルごとの状態。{ s: 段ごとの溜め, last: 最後の段の出口 }
    this.st = [];
    this.ph = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, sr = sampleRate, K = this.stages;
    const mix = this.mix, fb = this.fb;
    // 折れ目の係数は STEP ごとに 1 つ。左右で同じ
    const nk = Math.ceil(len / STEP);
    const as = this.as || (this.as = new Float32Array(nk));
    let ph = this.ph;
    const dph = this.rate / sr * STEP;
    for (let k = 0; k < nk; k++) {
      const f = Math.min(sr * 0.45, this.freq * Math.pow(2, this.oct * Math.sin(2 * Math.PI * ph)));
      const t = Math.tan(Math.PI * f / sr);
      as[k] = (t - 1) / (t + 1);
      ph += dph; if (ph >= 1) ph -= 1;
    }
    this.ph = ph;
    for (let c = 0; c < out.length; c++) {
      const st = this.st[c] || (this.st[c] = { s: new Float64Array(K), last: 0 });
      const s = st.s;
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      let last = st.last;
      for (let i = 0; i < len; i++) {
        const a = as[(i / STEP) | 0];
        const xi = x ? x[i] : 0;
        // 1 次のオールパス(転置直接形 II)。y = a·u + s、s ← u − a·y
        let u = xi + fb * last;
        for (let j = 0; j < K; j++) {
          const o = a * u + s[j];
          s[j] = u - a * o;
          u = o;
        }
        last = u;
        y[i] = xi * (1 - mix) + u * mix;
      }
      // 小さすぎる値は 0 にする(非正規化数で重くならないように)
      st.last = Math.abs(last) < 1e-20 ? 0 : last;
      for (let j = 0; j < K; j++) if (Math.abs(s[j]) < 1e-20) s[j] = 0;
    }
    return true;
  }
}
registerProcessor('${PHASER_NODE}', Phaser);
`;
