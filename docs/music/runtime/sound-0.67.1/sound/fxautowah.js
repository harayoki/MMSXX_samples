// オートワウ(エンベロープフィルタ)。全体かチャンネルに掛けるエフェクト(2026-10-26)。
//
// 音の大きさを追いかけ、大きいほどフィルタを開ける。弾いた頭で開いて、減るにつれて閉じるので、
// 1 音ごとに「ワウ」と鳴る。Musitronics Mu-Tron III にならった。ファンクのベースやギターの色。
//
// - 大きさは、左右のうち大きいほうの振れ幅を attack と release でならして追う
// - 大きさに sensitivity の倍率(1〜100 倍)を掛けて 0〜1 に収めたものが開き具合。
//   カットオフは base から、開き具合 × range オクターブ上まで動く
// - フィルタは状態変数型(TPT の SVF)。mode でローパス・バンドパス・ハイパスを選ぶ(Mu-Tron III の切り替えと同じ 3 つ)。
//   ローパスは山の高さが Q 倍になる。バンドパスは山の高さを 1 に揃えてある(Web Audio の bandpass と同じ)
// - 係数(tan)は 16 サンプルに 1 回だけ計算する
// - mix は DAW の Dry/Wet。0 で元の音だけ、1 でフィルタを通した音だけ。既定は 1

/** autowah の処理器の名前 */
export const AUTOWAH_NODE = 'mmsxx-autowah';

/** 係数を計算し直す間隔(サンプル) */
export const AUTOWAH_STEP = 16;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const AUTOWAH_FX = {
  autowah: {
    tags: ['filter', 'modulation'], dev: ['wip'], version: '0.1',
    desc: 'Auto-wah, or envelope filter, after the Mu-Tron III. The louder the sound, the further a resonant filter opens, so each note quacks open on its attack and closes as it fades. The funk colour of bass and clavinet lines.',
    params: {
      sensitivity: { live: false, min: 0, max: 1, default: 0.5, desc: 'How strongly the level opens the filter, from 0 (the level is used as it is) to 1 (multiplied by 100). Raise it for quiet parts; lower it if every note opens the filter all the way.' },
      base: { live: false, unit: 'Hz', min: 50, max: 4000, default: 250, desc: 'Cutoff when the sound is silent, where the filter rests between notes.' },
      range: { live: false, unit: 'oct', min: 0, max: 6, default: 3, desc: 'How far above base the cutoff goes when the filter is fully open, in octaves. 3 sweeps from 250 Hz to 2 kHz.' },
      resonance: { live: false, min: 0, max: 1, default: 0.6, desc: 'Peak at the cutoff, from 0 (no peak, Q 0.5) to 1 (Q 15, a sharp vocal quack).' },
      mode: {
        live: false, min: 0, max: 2, default: 0,
        desc: 'Filter type: a number, rounded to a whole one, or the name of one of the choices (lowpass, bandpass, highpass).',
        choices: [
          { value: 0, name: 'lowpass', desc: 'Low-pass. Round and vocal.' },
          { value: 1, name: 'bandpass', desc: 'Band-pass. Thin and quacky.' },
          { value: 2, name: 'highpass', desc: 'High-pass. The lows fall away as the note opens.' },
        ],
      },
      attack: { live: false, unit: 'ms', min: 0.1, max: 100, default: 5, desc: 'How fast the filter opens when a note starts, in milliseconds. Short values quack sharply; longer ones swell.' },
      release: { live: false, unit: 'ms', min: 10, max: 2000, default: 150, desc: 'How fast the filter closes as a note fades, in milliseconds. Short values close within the note; long ones keep it open across fast notes.' },
      mix: { live: false, min: 0, max: 1, default: 1, desc: 'How much of the sound is the filtered sound, from 0 (the dry sound alone) to 1 (the filtered sound alone).' },
    },
  },
};

/**
 * autowah の処理器。入口 1 つ、出口 1 つ。大きさとカットオフは左右で共にし、
 * フィルタの状態はチャンネルごとに持つ。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const AUTOWAH_CODE = `
const STEP = ${AUTOWAH_STEP};
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(AUTOWAH_FX.autowah.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

class AutoWah extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.gain = Math.pow(10, v('sensitivity', 0, 1) * 2);
    this.base = v('base', 50, 4000);
    this.range = v('range', 0, 6);
    this.k = 1 / (0.5 * Math.pow(30, v('resonance', 0, 1)));
    this.mode = Math.round(v('mode', 0, 2));
    const coef = (ms) => Math.exp(-1 / (ms / 1000 * sampleRate));
    this.att = coef(v('attack', 0.1, 100));
    this.rel = coef(v('release', 10, 2000));
    this.mix = v('mix', 0, 1);
    this.env = 0;
    // チャンネルごとのフィルタの溜め [ic1, ic2]
    this.st = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, sr = sampleRate, nc = out.length;
    const nk = Math.ceil(len / STEP);
    // STEP ごとの係数 [a1, a2, a3]。大きさは 1 サンプルずつ追い、区切りの頭の値で決める
    const cs = this.cs || (this.cs = new Float32Array(nk * 3));
    let env = this.env;
    const att = this.att, rel = this.rel, k = this.k;
    const top = sr * 0.45;
    for (let i = 0; i < len; i++) {
      let m = 0;
      if (inp) for (let c = 0; c < nc; c++) { const x = inp[c] || inp[0]; if (x) { const a = Math.abs(x[i]); if (a > m) m = a; } }
      env = m > env ? m + (env - m) * att : m + (env - m) * rel;
      if (i % STEP === 0) {
        const open = Math.min(1, env * this.gain);
        const f = Math.min(top, this.base * Math.pow(2, this.range * open));
        const g = Math.tan(Math.PI * f / sr);
        const a1 = 1 / (1 + g * (g + k)), a2 = g * a1;
        const j = (i / STEP) * 3;
        cs[j] = a1; cs[j + 1] = a2; cs[j + 2] = g * a2;
      }
    }
    this.env = env < 1e-20 ? 0 : env;
    const mix = this.mix, mode = this.mode;
    for (let c = 0; c < nc; c++) {
      const st = this.st[c] || (this.st[c] = new Float64Array(2));
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      let ic1 = st[0], ic2 = st[1];
      for (let i = 0; i < len; i++) {
        const j = ((i / STEP) | 0) * 3;
        const a1 = cs[j], a2 = cs[j + 1], a3 = cs[j + 2];
        const xi = x ? x[i] : 0;
        const v3 = xi - ic2;
        const v1 = a1 * ic1 + a2 * v3;
        const v2 = ic2 + a2 * ic1 + a3 * v3;
        ic1 = 2 * v1 - ic1;
        ic2 = 2 * v2 - ic2;
        const w = mode === 0 ? v2 : mode === 1 ? k * v1 : xi - k * v1 - v2;
        y[i] = xi * (1 - mix) + w * mix;
      }
      st[0] = Math.abs(ic1) < 1e-20 ? 0 : ic1;
      st[1] = Math.abs(ic2) < 1e-20 ? 0 : ic2;
    }
    return true;
  }
}
registerProcessor('${AUTOWAH_NODE}', AutoWah);
`;
