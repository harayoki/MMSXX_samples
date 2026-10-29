// フォルマントフィルタ(トークボックス)。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 母音は、声の通り道が作る数本の山(フォルマント)で聞き分けられる。その山を 3 本の
// バンドパスで作り、元の音を通す。のこぎり波のような倍音の多い音を通すと、「アー」「イー」と
// 鳴る。ギターやシンセの音を口に通して鳴らす、トークボックスの代わりに使う。
//
// - 母音は vowel で選ぶ。0 a、1 e、2 i、3 o、4 u。あいだの数は、となりの 2 つの母音の
//   あいだを補間する(周波数は対数で、帯の幅も対数で、大きさは dB で)。1.5 なら e と i の中ほど
// - rate と depth で母音を揺らす。vowel から vowel + depth まで、正弦で行き来する
//   (vowel 0、depth 4 なら a から u まで)。4 を超えたぶんは u で止まる
// - 山の表は、男声のおおまかな値として広く出回っているもの。どの測定のものかは確かめていない
// - 帯の係数は 16 サンプルに 1 回だけ作る(phaser と同じ)。揺らさないときは作るときの 1 回だけ
// - mix は DAW の Dry/Wet。既定は 1(トークボックスは元の音を混ぜない)

/** formant の処理器の名前 */
export const FORMANT_NODE = 'mmsxx-formant';

/** 係数を作り直す間隔(サンプル) */
export const FORMANT_STEP = 16;

/**
 * 母音ごとの山。[周波数 Hz, 帯の幅 Hz, 大きさ dB] を 3 本。並びは a e i o u。
 *
 * 男声(テノール)のおおまかな値として出回っている表から、低い 3 本を取った。
 * 出典と突き合わせてはいない。一般的な値として使う
 */
export const FORMANT_VOWELS = [
  [[650, 80, 0], [1080, 90, -6], [2650, 120, -7]],     // a
  [[400, 70, 0], [1700, 80, -14], [2600, 100, -12]],   // e
  [[290, 40, 0], [1870, 90, -15], [2800, 100, -18]],   // i
  [[400, 40, 0], [800, 80, -10], [2600, 100, -12]],    // o
  [[350, 40, 0], [600, 60, -20], [2700, 100, -17]],    // u
];

/**
 * 帯を通ると、倍音の多い音でも大きさがかなり下がる。そのぶんを持ち上げる倍率(dB)。
 * 持ち上げないと、110Hz ののこぎり波を a e i o u に通して -13〜-11dB、220Hz で -12〜-8dB だった。
 * 平均で元の音に近くなるように決めた(2026-10-26、Node で処理器を回して測った)
 */
export const FORMANT_MAKEUP_DB = 11;

/**
 * 帯の幅を、表の値の何倍にするか。表の幅のままだと、山に倍音が乗るかどうかで大きさが大きく変わる。
 * 440Hz ののこぎり波で、母音ごとに -18〜-6dB だった。2 倍にすると -13〜-3dB に縮んだ。
 * 耳では確かめていない
 */
export const FORMANT_WIDEN = 2;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const FORMANT_FX = {
  formant: {
    tags: ['filter', 'voice'], dev: ['wip'], version: '0.1',
    desc: 'Formant filter, a stand-in for a talk box. Three band-pass peaks shape the sound like the mouth shapes a vowel, so a bright tone such as a saw or a square seems to sing "ah", "ee" or "oo". Choose the vowel, or let it sway between two vowels. Works best on sounds rich in harmonics; a sine has little for the peaks to shape.',
    params: {
      vowel: {
        live: false, min: 0, max: 4, default: 0,
        desc: 'The vowel: a number from 0 to 4, or the name of one of the choices (a, e, i, o, u). Values in between blend the two neighbours; 1.5 is half way from e to i.',
        // 連続した値なので、名前は整数の点にだけ付ける
        choices: [
          { value: 0, name: 'a', desc: 'a, as in "father".' },
          { value: 1, name: 'e', desc: 'e, as in "bed".' },
          { value: 2, name: 'i', desc: 'i, as in "see".' },
          { value: 3, name: 'o', desc: 'o, as in "law".' },
          { value: 4, name: 'u', desc: 'u, as in "food".' },
        ],
      },
      depth: { live: false, min: 0, max: 4, default: 0, desc: 'How far the vowel sways, in vowel steps above vowel. 0 holds the vowel still. With vowel 0 and depth 4 it sweeps from a to u and back, a "wah-oo-wah".' },
      rate: { live: false, unit: 'Hz', min: 0.02, max: 10, default: 0.5, desc: 'How fast the vowel sways back and forth, in cycles per second. It does nothing while depth is 0. In MML, @l 2 sets one cycle to a half note of the tune.' },
      mix: { live: false, min: 0, max: 1, default: 1, desc: 'How much of the sound is the shaped sound, from 0 (the dry sound alone) to 1 (the shaped sound alone). A talk box is all shaped sound, so the default is 1.' },
    },
  },
};

/**
 * formant の処理器。入口 1 つ、出口 1 つ。チャンネルごとに帯の状態を持ち、揺れは共にする。
 *
 * 帯は 2 極の状態変数フィルタ(TPT。sound/filter.js と同じ形)のバンドパスで、
 * 山の高さが 1 になるように k を掛けて取り出す。3 本を表の大きさで合わせる。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const FORMANT_CODE = `
const STEP = ${FORMANT_STEP};
const VOWELS = ${JSON.stringify(FORMANT_VOWELS)};
const MAKEUP = ${Math.pow(10, FORMANT_MAKEUP_DB / 20)};
const WIDEN = ${FORMANT_WIDEN};
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(FORMANT_FX.formant.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

class Formant extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.vowel = v('vowel', 0, 4);
    this.depth = v('depth', 0, 4);
    this.rate = v('rate', 0.02, 10);
    this.mix = v('mix', 0, 1);
    this.moving = this.depth > 0;
    // 3 本ぶんの係数 [g, k, a1, a2, a3, 大きさ]。揺らさないときは、ここで作ったものを使い続ける
    this.cf = new Float64Array(18);
    this.coef(this.vowel);
    this.st = [];
    this.ph = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  // 母音の位置 pos(0〜4)の係数を cf に書く
  coef(pos) {
    pos = clamp(pos, 0, 4);
    const i = Math.min(3, Math.floor(pos)), t = pos - i;
    const A = VOWELS[i], B = VOWELS[i + 1], sr = sampleRate, cf = this.cf;
    for (let j = 0; j < 3; j++) {
      const f = Math.exp(Math.log(A[j][0]) * (1 - t) + Math.log(B[j][0]) * t);
      const bw = Math.exp(Math.log(A[j][1]) * (1 - t) + Math.log(B[j][1]) * t) * WIDEN;
      const db = A[j][2] * (1 - t) + B[j][2] * t;
      const g = Math.tan(Math.PI * Math.min(f, sr * 0.45) / sr);
      const k = bw / f;
      const a1 = 1 / (1 + g * (g + k)), a2 = g * a1, a3 = g * a2;
      const o = j * 6;
      cf[o] = g; cf[o + 1] = k; cf[o + 2] = a1; cf[o + 3] = a2; cf[o + 4] = a3;
      cf[o + 5] = Math.pow(10, db / 20) * k * MAKEUP;
    }
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, sr = sampleRate, mix = this.mix;
    // 揺らすときは、STEP ごとの係数をブロックの頭でまとめて作る(左右で同じ)
    const nk = Math.ceil(len / STEP);
    const tab = this.tab || (this.tab = new Float64Array(nk * 18));
    if (this.moving) {
      let ph = this.ph;
      const dph = this.rate / sr * STEP;
      for (let s = 0; s < nk; s++) {
        this.coef(this.vowel + this.depth * (0.5 - 0.5 * Math.cos(2 * Math.PI * ph)));
        tab.set(this.cf, s * 18);
        ph += dph; if (ph >= 1) ph -= 1;
      }
      this.ph = ph;
    } else if (!this.filled) {
      for (let s = 0; s < nk; s++) tab.set(this.cf, s * 18);
      this.filled = true;
    }
    for (let c = 0; c < out.length; c++) {
      const st = this.st[c] || (this.st[c] = new Float64Array(6));
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      for (let i = 0; i < len; i++) {
        const xi = x ? x[i] : 0;
        const o = ((i / STEP) | 0) * 18;
        let sum = 0;
        for (let j = 0; j < 3; j++) {
          const q = o + j * 6, s1 = j * 2;
          const ic1 = st[s1], ic2 = st[s1 + 1];
          const v3 = xi - ic2;
          const v1 = tab[q + 2] * ic1 + tab[q + 3] * v3;
          const v2 = ic2 + tab[q + 3] * ic1 + tab[q + 4] * v3;
          st[s1] = 2 * v1 - ic1; st[s1 + 1] = 2 * v2 - ic2;
          sum += v1 * tab[q + 5];
        }
        y[i] = xi * (1 - mix) + sum * mix;
      }
      // 小さすぎる値は 0 にする(非正規化数で重くならないように)
      for (let j = 0; j < 6; j++) if (Math.abs(st[j]) < 1e-20) st[j] = 0;
    }
    return true;
  }
}
registerProcessor('${FORMANT_NODE}', Formant);
`;
