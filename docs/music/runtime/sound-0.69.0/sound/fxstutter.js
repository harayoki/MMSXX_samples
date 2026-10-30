// スタッター。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 曲の切れ目の飾り。効かせたところから短い長さを録って、切るまでくり返す
// (「ダダダダ」と刻む)。Ableton Live の Beat Repeat のように、効かせた瞬間から録りはじめる形にした。
//
// - 効かせるのは on。0 で素通し、1 にしたところから録って、0 に戻すまでくり返す。
//   曲の途中で `@fx{stut @on 1}` … `@fx{stut @on 0}` と書く(AudioParam。サンプル単位で切り替わる)。
//   もう一度録り直すときは、0 に戻してから 1 にする
// - くり返す長さは time 秒。`@l 16` のように音長で書くと拍に合う。書かなければその曲の 16 分音符
// - 1 回目は、録りながら元の音をそのまま出す。2 回目から録ったものをくり返す
// - くり返しの継ぎ目は 2ms でならす(長さが短いときは、長さの 4 分の 1 まで)。
//   切ったときも 2ms かけて元の音へ戻す

/** stutter の処理器の名前 */
export const STUTTER_NODE = 'mmsxx-stutter';

/** 継ぎ目をならす長さ(ms) */
export const STUTTER_FADE = 2;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const STUTTER_FX = {
  stutter: {
    tags: ['rhythm', 'sfx'], dev: ['wip'], version: '0.1',
    desc: 'Stutter, a fill for the end of a phrase. While on is 1, a short slice is taken from the moment it was switched on and repeated over and over until on goes back to 0, like Beat Repeat in a DAW. The first pass plays the sound as it comes while it is taken. Switch it in the middle of a tune with @fx{name @on 1} and @fx{name @on 0}. In MML the slice length can be a note length (@l 16), and without one it is a sixteenth note of the tune.',
    params: {
      on: { live: true, min: 0, max: 1, default: 0, desc: 'Switch. 0 lets the sound through; 1 takes a slice from that moment and repeats it until it goes back to 0. To take a new slice, go back to 0 first.' },
      time: { live: false, unit: 's', min: 0.01, max: 2, default: 0.125, desc: 'Length of the slice in seconds. In MML write a note length such as @l 16 to keep it on the beat; without one it is a sixteenth note of the tune (0.125 at 120 BPM).' },
          mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
};

/**
 * stutter の処理器。入口 1 つ、出口 1 つ。チャンネルごとに録ったものを持つ。
 * AudioParam `on`(a-rate)。作るときの値は processorOptions にも入れる。
 *
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const STUTTER_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(STUTTER_FX.stutter.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
class Stutter extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'on', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'a-rate' }];
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.on0 = v('on', 0, 1);
    this.len = Math.max(4, Math.round(v('time', 0.01, 2) * sampleRate));
    this.fade = Math.max(1, Math.min(Math.round(${STUTTER_FADE} / 1000 * sampleRate), Math.floor(this.len / 4)));
    this.caps = [];
    this.was = false;
    this.active = false;
    this.pos = 0;
    this.rel = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs, params) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const n = out[0].length, L = this.len, F = this.fade;
    const on = params && params.on ? params.on : null;
    const nc = out.length;
    for (let c = 0; c < nc; c++) if (!this.caps[c]) this.caps[c] = new Float32Array(L);
    let was = this.was, active = this.active, pos = this.pos, rel = this.rel;
    for (let i = 0; i < n; i++) {
      const v = on ? (on.length > 1 ? on[i] : on[0]) : this.on0;
      const up = v >= 0.5;
      if (up && !was) { active = true; pos = 0; rel = 0; }
      else if (!up && was && active) { active = false; rel = F; }
      was = up;
      const busy = active || rel > 0;
      const p = pos % L, pass = Math.floor(pos / L);
      // くり返しの継ぎ目。2 回目からの頭で上げ、どの回も終わりで下げる
      let g = 1;
      if (pass > 0 && p < F) g = p / F;
      if (p >= L - F) g = Math.min(g, (L - p) / F);
      // 切ったあとは、くり返しを下げながら元の音を上げる
      const k = active ? 1 : rel / F;
      for (let c = 0; c < nc; c++) {
        const x = inp && (inp[c] || inp[0]);
        const xi = x ? x[i] : 0;
        if (!busy) { out[c][i] = xi; continue; }
        const cap = this.caps[c];
        if (pass === 0 && active) cap[p] = xi;
        // 1 回目は元の音のまま(録りきる前に切ったときも)
        const s = pass === 0 ? xi : cap[p];
        out[c][i] = s * g * k + xi * (1 - k);
      }
      if (busy) pos++;
      if (!active && rel > 0) rel--;
    }
    this.was = was; this.active = active; this.pos = pos; this.rel = rel;
    return true;
  }
}
registerProcessor('${STUTTER_NODE}', Stutter);
`;
