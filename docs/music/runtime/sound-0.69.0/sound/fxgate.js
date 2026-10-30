// ゲート(トランスゲート)。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 音量を拍に合わせて刻む。伸ばしたパッドが、16 分の刻みのように聞こえるようになる。
// 刻みは on と off の並び(pattern)で、1 つぶんの長さが time 秒。
//
// - 長さは `@l 16` のように音長でも書ける。秒に直すテンポは echo と同じ決め方
//   (`#tempo`、無ければ本文の最初の `t`、それも無ければ 120)。曲の途中でテンポが変わっても
//   ついてこない
// - 並びは 0 と 1 を並べた数で書く(`@pattern 1011`)。MML では書いた桁の数がそのまま
//   steps になるので、頭の 0 も数える。JS から渡すときは steps も渡す
//   (数にすると頭の 0 が消えるため。桁が steps より少なければ、頭に 0 を足して読む)
// - 刻みは曲の頭に揃える。曲の頭の時刻は AudioParam(`origin`)で受ける。
//   鳴らす側が、周の始まりや跳んだ先ごとに書き込む(sound/audio.js の `_fxOrigin`)。
//   書き込まれなければ、時計の 0 を曲の頭とみなす
// - on と off の境目は smooth ms でならす。0 にするとプツッと鳴る

/** gate の処理器の名前 */
export const GATE_NODE = 'mmsxx-gate';

/** 並びの長さの上限。数で持つので、桁が正確に収まる 16 まで */
export const GATE_MAX_STEPS = 16;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const GATE_FX = {
  gate: {
    tags: ['dynamics', 'rhythm'], dev: [], version: '1.00',
    desc: 'Trance gate. The level is chopped in time with the tune by a pattern of on and off steps, so a held pad plays as a rhythm. The steps line up with the start of the tune. From MML, the step length can be a note length (@l 16), worked out from the tempo of the tune; it does not follow tempo changes inside a tune.',
    params: {
      time: { live: false, unit: 's', min: 0.01, max: 2, default: 0.125, desc: 'Length of one step in seconds. It does not follow the tempo, so work it out from the tempo, or write @l 16 in MML: a sixteenth note at 120 BPM is 0.125.' },
      pattern: { live: false, min: 0, max: 1111111111111111, default: 1010101010101010, desc: 'The steps as a row of 1 (on) and 0 (off), read from the left, e.g. 1011. In MML the number of digits you write sets steps, leading zeros included. From JS, pass steps too: a number loses its leading zeros, which are put back to make steps digits.' },
      steps: { live: false, min: 1, max: GATE_MAX_STEPS, default: 16, desc: 'How many steps the pattern has before it repeats. 16 steps of a sixteenth note make one bar of 4/4.' },
      depth: { live: false, min: 0, max: 1, default: 1, desc: 'How far the off steps are turned down, from 0 (not at all) to 1 (silence). 0.5 keeps the off steps at half level, a softer chop.' },
      smooth: { live: false, unit: 'ms', min: 0, max: 50, default: 2, desc: 'How long each edge between on and off takes, in milliseconds. 0 cuts sharply and clicks; around 2 is crisp without clicks; 20 and more makes the chop soft and swelling.' },
          mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
};

/**
 * gate の処理器。入口 1 つ、出口 1 つ。
 * AudioParam `origin` は曲の頭の時刻(AudioContext の時計の秒)。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const GATE_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(GATE_FX.gate.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// 並びの数を、steps 個の on/off にする。頭に 0 を足して steps 桁に揃え、
// 長ければ左から steps 桁を使う。0 でない桁が on
const gateSteps = (pattern, steps) => {
  const n = Math.max(1, Math.min(${GATE_MAX_STEPS}, Math.round(steps) || 1));
  let s = String(Math.max(0, Math.round(Number(pattern) || 0)));
  s = s.length < n ? s.padStart(n, '0') : s.slice(0, n);
  return [...s].map((d) => (d === '0' ? 0 : 1));
};

class Gate extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'origin', defaultValue: 0, automationRate: 'k-rate' }];
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.time = v('time', 0.01, 2);
    this.on = gateSteps(v('pattern', 0, 1111111111111111), v('steps', 1, ${GATE_MAX_STEPS}));
    this.floor = 1 - v('depth', 0, 1);
    const ms = v('smooth', 0, 50);
    this.a = ms > 0 ? Math.exp(-1 / (ms / 1000 * sampleRate)) : 0;
    this.g = null;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs, parameters) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, sr = sampleRate;
    const origin = parameters && parameters.origin ? parameters.origin[0] : 0;
    const t0 = currentTime - origin;
    const on = this.on, n = on.length, T = this.time, floor = this.floor, a = this.a;
    const gs = this.gs || (this.gs = new Float32Array(len));
    let g = this.g;
    for (let i = 0; i < len; i++) {
      const k = Math.floor((t0 + i / sr) / T);
      const target = on[((k % n) + n) % n] ? 1 : floor;
      g = g === null ? target : target + (g - target) * a;
      gs[i] = g;
    }
    this.g = g;
    for (let c = 0; c < out.length; c++) {
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      if (!x) { y.fill(0); continue; }
      for (let i = 0; i < len; i++) y[i] = x[i] * gs[i];
    }
    return true;
  }
}
registerProcessor('${GATE_NODE}', Gate);
`;
