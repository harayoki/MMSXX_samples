// リングモジュレーター。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 音に正弦波を掛ける。Moog のリングモジュレーターにならった。
// 元の音の高さ f に掛ける正弦の高さ c を掛けると、f + c と f - c の 2 つの音になり、元の f は消える。
// 倍音の並びが崩れるので、ベルや金属を叩いたような音、ロボットの声のような音になる。
//
// - 掛ける正弦の高さは freq(Hz)。曲の途中で動かせる(AudioParam。`@fx{ring @freq 880}`)
// - mix は DAW の Dry/Wet。既定は 1(掛けた音だけ。リングモジュレーターの出口はふつうそれだけ)
// - 正弦の位相は左右で同じ。曲の頭には揃えない

/** ringmod の処理器の名前 */
export const RINGMOD_NODE = 'mmsxx-ringmod';

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const RINGMOD_FX = {
  ringmod: {
    tags: ['modulation', 'sfx'], dev: [], version: '1.00',
    desc: 'Ring modulator, as in the Moog ring modulator. The sound is multiplied by a sine wave. Each tone of the sound splits into two, at the sum and the difference of the two pitches, and the tone itself is gone, so the harmonics no longer line up: bells, struck metal and robot voices. Low frequencies, below about 20 Hz, turn it into a fast tremolo instead.',
    params: {
      freq: { live: true, unit: 'Hz', min: 1, max: 5000, default: 440, desc: 'Pitch of the sine the sound is multiplied by. It can move in the middle of a tune (@fx{name @freq 880}). Near the pitch of the notes, the result is low and growling; far above them, it is bright and clangy.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the multiplied sound, from 0 (the dry sound alone) to 1 (the multiplied sound alone). A ring modulator usually puts out the multiplied sound alone, so the default is 1.' },
    },
  },
};

/**
 * ringmod の処理器。入口 1 つ、出口 1 つ。
 * AudioParam `freq` と `mix`。作るときの値は processorOptions にも入れる
 * (AudioParam を受けないところで回しても、その値で鳴るように)。
 *
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const RINGMOD_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(RINGMOD_FX.ringmod.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
class RingMod extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'freq', defaultValue: DEF.freq, minValue: 1, maxValue: 5000, automationRate: 'k-rate' },
      { name: 'mix', defaultValue: DEF.mix, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
    ];
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.freq0 = v('freq', 1, 5000);
    this.mix0 = v('mix', 0, 1);
    this.ph = 0;
    this.car = null;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs, params) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length;
    const freq = params && params.freq ? params.freq[0] : this.freq0;
    const mix = params && params.mix ? params.mix[0] : this.mix0;
    const car = this.car && this.car.length === len ? this.car : (this.car = new Float32Array(len));
    const step = 2 * Math.PI * freq / sampleRate;
    let ph = this.ph;
    for (let i = 0; i < len; i++) {
      car[i] = Math.sin(ph);
      ph += step;
    }
    this.ph = ph % (2 * Math.PI);
    for (let c = 0; c < out.length; c++) {
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      if (!x) { y.fill(0); continue; }
      if (mix === 0) { y.set(x); continue; }
      for (let i = 0; i < len; i++) y[i] = x[i] * (1 - mix) + x[i] * car[i] * mix;
    }
    return true;
  }
}
registerProcessor('${RINGMOD_NODE}', RingMod);
`;
