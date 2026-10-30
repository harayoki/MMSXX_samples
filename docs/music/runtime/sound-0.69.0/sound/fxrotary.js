// ロータリースピーカー。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// オルガンのレスリーにならった。音を高い帯と低い帯に分け、高い帯はホーン、低い帯はドラムが回して鳴らす。
// 回るものがマイクへ近づくと音が高く大きく、遠ざかると低く小さくなる(ドップラーと音量の揺れ)。
//
// - 帯の境目は 800Hz。低い帯は 2 極のローパスで取り、高い帯は元の音から低い帯を引いて作る。
//   足すと元の音に戻るので、depth 0 では元の音がそのまま出る
// - 回る速さは speed で、0 が遅い回転(コラール)、1 が速い回転(トレモロ)。あいだの数は、そのあいだの速さ。
//   速さを変えると、ホーンは 0.5 秒、ドラムは 2 秒の時定数で追いつく(重いドラムほど遅れる)。
//   曲の途中で `@fx{leslie @speed 1}` と書いて、遅い回転から速い回転へ移せる(AudioParam で受ける)
// - 遅い回転はホーン 0.8Hz、ドラム 0.67Hz。速い回転はホーン 6.7Hz、ドラム 5.8Hz。
//   覚えている値で、実機と突き合わせてはいない
// - マイクは、モノラルでは 1 本(正面)、ステレオでは 2 本(左右の真横)。
//   入口は左右を合わせて 1 本にする(実物も 1 つのアンプから鳴らす)

/** rotary の処理器の名前 */
export const ROTARY_NODE = 'mmsxx-rotary';

/** 帯の境目(Hz) */
export const ROTARY_SPLIT = 800;

/** 回る速さ(Hz)。遅い回転と速い回転 */
export const ROTARY_RATES = { horn: [0.8, 6.7], drum: [0.67, 5.8] };

/** 速さを変えたときに追いつく時定数(秒) */
export const ROTARY_INERTIA = { horn: 0.5, drum: 2 };

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const ROTARY_FX = {
  rotary: {
    tags: ['modulation', 'stereo'], dev: ['wip'], version: '0.1',
    desc: 'Rotary speaker, as in the Leslie cabinet of an organ. The highs go to a spinning horn and the lows to a spinning drum. As each one turns towards the microphone the sound grows higher and louder, then lower and softer as it turns away. In stereo the two microphones sit on either side, so the sound also swirls between the speakers. Switching speed glides, the light horn quickly and the heavy drum slowly, as on the real cabinet.',
    params: {
      speed: { live: true, min: 0, max: 1, default: 0, desc: 'How fast the rotors turn, from 0 (slow, the chorale setting) to 1 (fast, the tremolo setting). It can change in the middle of a tune (@fx{name @speed 1}); the horn catches up in about a second and the drum in about four.' },
      depth: { live: false, min: 0, max: 1, default: 0.7, desc: 'How strongly the turning shows, both the pitch wobble and the rise and fall of the level. 0 leaves the sound as it is.' },
          mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
};

/**
 * rotary の処理器。入口 1 つ、出口 1 つ。出口が 2 本なら左右のマイク、1 本なら正面のマイク。
 * AudioParam `speed` は回る速さ(0〜1)。作るときの値は processorOptions にも入れる
 * (AudioParam を受けないところで回しても、その速さで始まるように)。
 *
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const ROTARY_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(ROTARY_FX.rotary.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const SPLIT = ${ROTARY_SPLIT};
const RATES = ${JSON.stringify(ROTARY_RATES)};
const INERTIA = ${JSON.stringify(ROTARY_INERTIA)};
// 遅れの揺れ幅(ms、片側)と、音量の揺れの深さ。ホーンは小さく速く回るので、どちらも大きい
const SWING = { horn: 0.4, drum: 0.25 };
const DIP = { horn: 0.6, drum: 0.3 };
const BUF = 512;
class Rotary extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'speed', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'k-rate' }];
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    const sr = sampleRate;
    this.speed0 = v('speed', 0, 1);
    this.depth = v('depth', 0, 1);
    // 2 極のローパス(Butterworth)。RBJ の形
    const w0 = 2 * Math.PI * SPLIT / sr, al = Math.sin(w0) / Math.SQRT2, c = Math.cos(w0), a0 = 1 + al;
    this.lp = { b0: (1 - c) / 2 / a0, b1: (1 - c) / a0, b2: (1 - c) / 2 / a0, a1: -2 * c / a0, a2: (1 - al) / a0 };
    this.z1 = 0; this.z2 = 0;
    this.rotors = ['horn', 'drum'].map((k, i) => {
      const s = this.speed0;
      return {
        rate: RATES[k][0] + s * (RATES[k][1] - RATES[k][0]),
        slow: RATES[k][0], fast: RATES[k][1],
        k: 1 - Math.exp(-1 / (INERTIA[k] * sr)),
        ph: i * Math.PI / 2,
        swing: SWING[k] / 1000 * sr * this.depth,
        dip: DIP[k] * this.depth,
        buf: new Float32Array(BUF),
      };
    });
    this.w = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs, params) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, sr = sampleRate;
    const speed = params && params.speed ? params.speed[0] : this.speed0;
    const lp = this.lp;
    // マイクの向き。モノラルは正面 1 本、ステレオは左右の真横
    const mics = out.length >= 2 ? [-Math.PI / 2, Math.PI / 2] : [0];
    const xl = inp && inp[0], xr = inp && inp[1];
    let z1 = this.z1, z2 = this.z2, w = this.w;
    const [horn, drum] = this.rotors;
    for (const r of this.rotors) r.target = r.slow + speed * (r.fast - r.slow);
    for (let i = 0; i < len; i++) {
      const x = xl ? (xr ? (xl[i] + xr[i]) * 0.5 : xl[i]) : 0;
      // 低い帯(直接形 II 転置)と、残りの高い帯
      const lo = lp.b0 * x + z1;
      z1 = lp.b1 * x - lp.a1 * lo + z2;
      z2 = lp.b2 * x - lp.a2 * lo;
      drum.buf[w] = lo;
      horn.buf[w] = x - lo;
      for (const r of this.rotors) {
        r.rate += (r.target - r.rate) * r.k;
        r.ph += 2 * Math.PI * r.rate / sr;
        if (r.ph > 2 * Math.PI) r.ph -= 2 * Math.PI;
      }
      for (let m = 0; m < mics.length; m++) {
        let y = 0;
        for (const r of this.rotors) {
          const a = r.ph - mics[m];
          // マイクへ向かうとき(cos が 1)に近く大きい。遅れは 0 から 2 × swing まで
          const d = r.swing * (1 - Math.cos(a));
          let at = w - d;
          if (at < 0) at += BUF;
          const i0 = Math.floor(at), f = at - i0;
          const s0 = r.buf[i0 % BUF], s1 = r.buf[(i0 + 1) % BUF];
          const s = d > 0 ? s0 + (s1 - s0) * f : r.buf[w];
          y += s * (1 - r.dip * 0.5 * (1 - Math.cos(a)));
        }
        out[m][i] = y;
      }
      w = (w + 1) % BUF;
    }
    for (let c = mics.length; c < out.length; c++) out[c].fill(0);
    this.z1 = z1; this.z2 = z2; this.w = w;
    return true;
  }
}
registerProcessor('${ROTARY_NODE}', Rotary);
`;
