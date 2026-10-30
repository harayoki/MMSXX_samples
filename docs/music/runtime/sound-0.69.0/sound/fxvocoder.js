// ボコーダー。チャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// ある音(モジュレーター。ふつうは声)の帯ごとの大きさを、別の音(キャリア。ふつうは和音のシンセ)へ写す。
// Roland VP-330 のような、シンセが喋っているように聞こえる音。
//
// - 入口が 2 つ。掛けた側の音がキャリア、キーがモジュレーター。キーは sidechain と同じく
//   `#sidechain <名前> = <チャンネルかバス>` の行で名指しする(sound/audio.js の `_busWire`)。
//   DAW でも、ボコーダーのモジュレーターはサイドチェインの入口から入れることが多い
// - 帯は bands 本(8〜16)。100Hz から 8kHz までを対数で等しく分ける。
//   どの帯も 2 極のバンドパスを 2 つ重ねる(モジュレーターとキャリアの両方)
// - モジュレーターの帯ごとの大きさを、立ち上がり 2ms、下がり release ms で追い、
//   キャリアの同じ帯に掛けて、全部を足す
// - 足したものは 20 倍する(VOCODER_BOOST)。帯を通るとキャリアもモジュレーターも小さくなるため。
//   既定の 12 本で、110Hz ののこぎり波に 150Hz ののこぎり波を写したとき、出口がモジュレーターと 1dB の中に入る値にした
// - キーがつながっていなければ、キャリアがそのまま出る(sidechain と同じ)。
//   キーがつながっていて黙っていれば、無音になる
// - キーは左右を合わせて 1 本にする。キャリアは左右それぞれに掛ける

/** vocoder の処理器の名前 */
export const VOCODER_NODE = 'mmsxx-vocoder';

/** 帯の下の端と上の端(Hz) */
export const VOCODER_RANGE = [100, 8000];

/** 足したものに掛ける倍率 */
export const VOCODER_BOOST = 20;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const VOCODER_FX = {
  vocoder: {
    tags: ['filter', 'voice'], dev: ['wip'], version: '0.1',
    desc: 'Vocoder, as in the Roland VP-330. The shape of one sound, the modulator (usually a voice), is laid onto this sound, the carrier (usually a chord on a bright synth), band by band, so the synth seems to speak. The modulator is the key, named with a "#sidechain <effect> = <channel or bus>" line, as for the sidechain. Without a key the carrier passes untouched; with a silent key it is silent. It works on channels and buses, not on the whole tune.',
    params: {
      bands: { live: false, min: 8, max: 16, default: 12, desc: 'How many bands the sound is split into, rounded to a whole number, spread evenly from 100 Hz to 8 kHz. More bands speak more clearly and cost more.' },
      release: { live: false, unit: 'ms', min: 5, max: 200, default: 30, desc: 'How fast each band follows the modulator as it falls, in milliseconds. Short values are crisp and clear; long values blur the words into a smooth wash.' },
      mix: { live: false, min: 0, max: 1, default: 1, desc: 'How much of the sound is the vocoded sound, from 0 (the carrier alone) to 1 (the vocoded sound alone).' },
    },
  },
};

/**
 * vocoder の処理器。入口 2 つ(0 がキャリア、1 がキー)、出口 1 つ。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const VOCODER_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(VOCODER_FX.vocoder.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const RANGE = ${JSON.stringify(VOCODER_RANGE)};
const BOOST = ${VOCODER_BOOST};
class Vocoder extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    const sr = sampleRate;
    const nb = Math.round(v('bands', 8, 16));
    this.nb = nb;
    this.mix = v('mix', 0, 1);
    this.ca = Math.exp(-1 / (0.002 * sr));
    this.cr = Math.exp(-1 / (v('release', 5, 200) / 1000 * sr));
    // 帯の真ん中の高さと、幅(オクターブ)から Q を出す。RBJ のバンドパス(山の高さ 0dB)
    const span = Math.log2(RANGE[1] / RANGE[0]);
    const bw = span / (nb - 1);
    const q = Math.sqrt(Math.pow(2, bw)) / (Math.pow(2, bw) - 1);
    // 係数は帯ごとに [b0, a1, a2](b1 は 0、b2 は -b0)
    this.k = new Float64Array(nb * 3);
    for (let b = 0; b < nb; b++) {
      const f = Math.min(RANGE[0] * Math.pow(2, bw * b), sr * 0.45);
      const w0 = 2 * Math.PI * f / sr, al = Math.sin(w0) / (2 * q), a0 = 1 + al;
      this.k[b * 3] = al / a0;
      this.k[b * 3 + 1] = -2 * Math.cos(w0) / a0;
      this.k[b * 3 + 2] = (1 - al) / a0;
    }
    // 状態は 1 つのバンドパスにつき 2 つ。帯ごとに 2 段
    this.ms = new Float64Array(nb * 4);
    this.env = new Float64Array(nb);
    this.cs = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], key = inputs[1], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, nc = out.length, nb = this.nb, K = this.k, mix = this.mix;
    // キャリア。出口が 1 本で入口が 2 本なら、左右を合わせる
    const car = (c, i) => {
      if (!inp || !inp.length) return 0;
      if (nc === 1 && inp.length > 1) return (inp[0][i] + inp[1][i]) * 0.5;
      const x = inp[c] || inp[0];
      return x ? x[i] : 0;
    };
    if (!key || !key.length) {
      for (let c = 0; c < nc; c++) for (let i = 0; i < len; i++) out[c][i] = car(c, i);
      return true;
    }
    for (let c = 0; c < nc; c++) if (!this.cs[c]) this.cs[c] = new Float64Array(nb * 4);
    const ms = this.ms, env = this.env, ca = this.ca, cr = this.cr;
    const kl = key[0], kr = key[1];
    for (let i = 0; i < len; i++) {
      const m = kr ? (kl[i] + kr[i]) * 0.5 : kl[i];
      // モジュレーターの帯ごとの大きさ
      for (let b = 0; b < nb; b++) {
        const b0 = K[b * 3], a1 = K[b * 3 + 1], a2 = K[b * 3 + 2], o = b * 4;
        let y = b0 * m + ms[o];
        ms[o] = -a1 * y + ms[o + 1];
        ms[o + 1] = -b0 * m - a2 * y;
        const z = b0 * y + ms[o + 2];
        ms[o + 2] = -a1 * z + ms[o + 3];
        ms[o + 3] = -b0 * y - a2 * z;
        const a = z < 0 ? -z : z;
        env[b] = a + (env[b] - a) * (a > env[b] ? ca : cr);
      }
      for (let c = 0; c < nc; c++) {
        const x = car(c, i);
        const cs = this.cs[c];
        let sum = 0;
        for (let b = 0; b < nb; b++) {
          const b0 = K[b * 3], a1 = K[b * 3 + 1], a2 = K[b * 3 + 2], o = b * 4;
          const y = b0 * x + cs[o];
          cs[o] = -a1 * y + cs[o + 1];
          cs[o + 1] = -b0 * x - a2 * y;
          const z = b0 * y + cs[o + 2];
          cs[o + 2] = -a1 * z + cs[o + 3];
          cs[o + 3] = -b0 * y - a2 * z;
          sum += z * env[b];
        }
        out[c][i] = x * (1 - mix) + sum * BOOST * mix;
      }
    }
    return true;
  }
}
registerProcessor('${VOCODER_NODE}', Vocoder);
`;
