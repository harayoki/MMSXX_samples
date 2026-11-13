// レゾネーター。全体かチャンネルかバスに掛けるエフェクト(2026-10-30)。
//
// 決めた高さで鳴りやすい共振を何本か並べ、入ってきた音をその高さで響かせる。
// ドラムやノイズが和音の高さで鳴り、ベースや和音には和音やスケールに沿った倍音が加わる。
// 一般的な形として Ableton の Resonators(根音の高さ・Decay・Color・Width、共振を半音でずらして並べる)と、
// Lunacy Audio の Bismuth(鳴らす音名の集まり、Root、Octave、Spread、Attack、Decay、Tilt)の画面に見えた値を参考にした。
// どちらも仕様は確かめていない。
//
// - 共振 1 本は、comb(sound/fxcomb.js)と同じく、遅れを戻しながら回すくし形のフィルタ。
//   高さとその整数倍に山が立つので、弦のように倍音ごと響く。遅れは小数のサンプルまで読む(1 次の補間)
// - どの高さに並べるかは chord(和音かスケールの名前)。custom なら notes(音名の集まり)。
//   根音は root(音名)と octave。MML の o4c と同じ数え方で、`@root c @octave 4` が MIDI の 60
// - spread は何オクターブに広げて並べるか。和音の音名を 1 オクターブずつ上へくり返す
// - 共振は RESONATOR_MAX 本まで。5000Hz を超える高さは並べない(遅れが短すぎて、高さがずれる)
// - decay は、どの共振も同じ秒数で 60dB 下がるように、高さごとに戻りの量を決める
// - brightness は、ループの中の 2 点平均(Karplus-Strong の弦の減衰)の深さ。0 で高い倍音から先に消え、1 で消えない。
//   平均で遅れが延びるぶん、遅れを短くして高さを合わせる
// - attack は、音が入りはじめたときに共振へ入る量を、その時間をかけて上げる。音の大きさを追う 2 つの値
//   (すぐ上がるものと attack で上がるもの)の比を掛ける。0 なら掛けない
// - tilt は、根音から 1 オクターブ上がるごとに何 dB 変えるか。負で高い共振が小さくなる
// - 共振の山は、comb と同じく元の音と同じ 0dB に揃え(効いた音を 1 - 戻りの量 倍にする)、
//   本数の平方根で割る。width はステレオのときだけで、高さの順に左右へ交互に振る
// - 入口は左右を合わせて 1 本にして共振へ入れる。元の音は左右のまま mix で混ぜる
// - 値はどれも鳴らしながら動かせる(AudioParam)。和音を書き替えるときは、続けて鳴る共振の遅れを 5ms で寄せる。
//   新しく並んだ共振は、空の遅れ線から鳴りはじめる

/** resonator の処理器の名前 */
export const RESONATOR_NODE = 'mmsxx-resonator';

/** 並べる共振の上限 */
export const RESONATOR_MAX = 24;

/** 並べる高さの上限(Hz) */
export const RESONATOR_TOP = 5000;

/**
 * 和音とスケール。根音からの半音の並び。custom は notes を使う。
 * 名前は英字と数字だけ(MML で名前のまま書く)
 */
export const RESONATOR_CHORDS = [
  { name: 'unison', notes: [0], desc: 'The root alone.' },
  { name: 'fifth', notes: [0, 7], desc: 'Root and fifth, a power chord. Neither major nor minor.' },
  { name: 'major', notes: [0, 4, 7], desc: 'Major triad: root, major third and fifth.' },
  { name: 'minor', notes: [0, 3, 7], desc: 'Minor triad: root, minor third and fifth.' },
  { name: 'sus2', notes: [0, 2, 7], desc: 'Suspended second: root, second and fifth.' },
  { name: 'sus4', notes: [0, 5, 7], desc: 'Suspended fourth: root, fourth and fifth.' },
  { name: 'dom7', notes: [0, 4, 7, 10], desc: 'Dominant seventh: major triad with a minor seventh.' },
  { name: 'maj7', notes: [0, 4, 7, 11], desc: 'Major seventh: major triad with a major seventh.' },
  { name: 'min7', notes: [0, 3, 7, 10], desc: 'Minor seventh: minor triad with a minor seventh.' },
  { name: 'majorScale', notes: [0, 2, 4, 5, 7, 9, 11], desc: 'The seven notes of the major scale.' },
  { name: 'minorScale', notes: [0, 2, 3, 5, 7, 8, 10], desc: 'The seven notes of the natural minor scale.' },
  { name: 'pentatonic', notes: [0, 2, 4, 7, 9], desc: 'Major pentatonic: five notes, no half steps.' },
  { name: 'minorPentatonic', notes: [0, 3, 5, 7, 10], desc: 'Minor pentatonic: five notes, no half steps.' },
  { name: 'custom', notes: null, desc: 'The note names given in notes.' },
];

/** 音名の数(c が 0)。root の名前 */
const ROOT_NAMES = ['c', 'cs', 'd', 'ds', 'e', 'f', 'fs', 'g', 'gs', 'a', 'as', 'b'];
const ROOT_SAY = ['C', 'C sharp', 'D', 'D sharp', 'E', 'F', 'F sharp', 'G', 'G sharp', 'A', 'A sharp', 'B'];

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const RESONATOR_FX = {
  resonator: {
    tags: ['filter', 'texture'], version: '0.1',
    // 実験。正式に作るかもまだ決めていない(2026-10-30)
    dev: ['experiment'],
    desc: 'Resonator. A set of tuned resonators, each ringing at one pitch and all its multiples like a string, is laid out on a chord or a scale. Whatever goes in rings at those pitches: drums and noise take on the chord, and a bass or a pad gains overtones that follow the harmony. Root, chord and every other value can change while the sound plays, so the chord can follow the tune.',
    params: {
      root: {
        live: true, min: 0, max: 11, default: 0, noteName: true,
        desc: 'Note name of the root, as a number from 0 (C) to 11 (B), as a note name such as e, f#, f+, bb or b- (sharp with # or +, flat with b or -), or as the name of one of the choices.',
        choices: ROOT_NAMES.map((name, value) => ({ value, name, desc: `${ROOT_SAY[value]}.` })),
      },
      octave: { live: true, min: 0, max: 7, default: 3, desc: 'Octave of the root, rounded to a whole number, counted as in MML: octave 4 with root c is middle C (MIDI note 60).' },
      chord: {
        live: true, min: 0, max: RESONATOR_CHORDS.length - 1, default: 1,
        desc: `Which notes the resonators are tuned to, counted up from the root: a number, rounded to a whole one, or the name of one of the choices (${RESONATOR_CHORDS.map((c) => c.name).join(', ')}).`,
        choices: RESONATOR_CHORDS.map((c, value) => ({ value, name: c.name, desc: c.desc })),
      },
      notes: {
        live: true, min: 0, max: 4095, default: 0, noteSet: true,
        desc: 'The note names used when chord is custom. In MML write the letters together, as in cegb or c+fg+ (sharp with # or +, flat with -); from JS also as a list. Each name stands for that note in every octave; they are laid out upward from the root. As a number, it is the sum of 2 to the power of each note (C is 1, C sharp 2 … B 2048). With none the root alone rings.',
      },
      spread: { live: true, unit: 'oct', min: 1, max: 4, default: 2, desc: 'How many octaves the notes are laid out over, rounded to a whole number. 1 keeps them within one octave above the root; 2 repeats them an octave higher. At most 24 resonators ring, and none above 5000 Hz.' },
      decay: { live: true, unit: 's', min: 0.05, max: 10, default: 1, desc: 'Seconds for each resonator to fade by 60 dB after the sound stops. Long values ring on like a struck string or a held pedal.' },
      brightness: { live: true, min: 0, max: 1, default: 0.5, desc: 'How long the high overtones ring compared with the pitch itself. 1 keeps them as long as the pitch, a bright metallic ring; 0 lets them die first, a soft string-like ring.' },
      attack: { live: true, unit: 's', min: 0, max: 2, default: 0, desc: 'Seconds over which the resonators fade in when a sound starts after a pause, so the ring swells instead of striking. 0 lets them answer at once.' },
      tilt: { live: true, unit: 'dB/oct', min: -12, max: 12, default: 0, desc: 'Level change for each octave above the root, in dB. Negative values make the high resonators quieter, positive values louder.' },
      gain: { live: true, unit: 'dB', min: -24, max: 36, default: 0, desc: 'Level of the ringing, in dB. Each resonator peaks at the level of the dry sound, so a pitched sound that hits the chord rings loud, while noise spreads its energy over all pitches and comes out much quieter, the more so the longer the decay. Raise it when feeding noise or soft drums.' },
      width: { live: true, min: 0, max: 1, default: 0.5, desc: 'How far the resonators are spread between left and right, alternating side by pitch. 0 keeps them in the middle. It only shows when the player asks for stereo.' },
      mix: { live: true, min: 0, max: 1, default: 0.5, desc: 'How much of the sound is the ringing, from 0 (the dry sound alone) to 1 (the ringing alone). The peaks of each resonator are scaled to the level of the dry sound.' },
    },
  },
};

/** 音名 1 つの読み。文字のあとに # か + でシャープ、b か - でフラット */
const LETTER = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

/**
 * 音名 1 つ(`e` `f#` `bb` `e-`)を 0〜11 にする。読めなければ null
 * @param {*} word
 * @returns {number|null}
 */
export function pitchClassOf(word) {
  const m = /^([a-g])([#+b-]?)$/i.exec(String(word ?? '').trim());
  if (!m) return null;
  const acc = m[2] === '#' || m[2] === '+' ? 1 : m[2] ? -1 : 0;
  return (LETTER[m[1].toLowerCase()] + acc + 12) % 12;
}

/**
 * 音名の集まり(`cegb` `c+fg+` `'c e g'` `['c','e','g']`)を、音名ごとのビットにする(C が 1、B が 2048)。
 * フラットは - だけ(b は音名の B と区別がつかない)。読めなければ null
 * @param {*} word
 * @returns {number|null}
 */
export function pitchSetOf(word) {
  const s = Array.isArray(word) ? word.join(' ') : String(word ?? '');
  const body = s.replace(/[\s,]+/g, '').toLowerCase();
  if (!body) return null;
  let mask = 0;
  for (let i = 0; i < body.length;) {
    const pc = LETTER[body[i]];
    if (pc === undefined) return null;
    i++;
    let acc = 0;
    if (body[i] === '#' || body[i] === '+') { acc = 1; i++; } else if (body[i] === '-') { acc = -1; i++; }
    mask |= 1 << ((pc + acc + 12) % 12);
  }
  return mask;
}

/**
 * 並べる共振の高さ(MIDI 番号)の並び。処理器と重さの見積もりが同じ計算を使う
 * @param {{root?:number,octave?:number,chord?:number,notes?:number,spread?:number}} fx
 * @returns {number[]}
 */
export function resonatorPitches(fx) {
  const d = RESONATOR_FX.resonator.params;
  const num = (k) => {
    const v = Number(fx && fx[k]);
    return Math.round(Math.min(d[k].max, Math.max(d[k].min, Number.isFinite(v) ? v : d[k].default)));
  };
  const root = num('root'), octave = num('octave'), chord = num('chord'), mask = num('notes'), spread = num('spread');
  let steps = RESONATOR_CHORDS[chord].notes;
  if (!steps) {
    steps = [];
    for (let k = 0; k < 12; k++) if (mask & (1 << ((root + k) % 12))) steps.push(k);
    if (!steps.length) steps = [0];
  }
  const base = (octave + 1) * 12 + root;
  const out = [];
  for (let o = 0; o < spread; o++) {
    for (const s of steps) {
      const m = base + 12 * o + s;
      if (440 * Math.pow(2, (m - 69) / 12) > RESONATOR_TOP || out.length >= RESONATOR_MAX) continue;
      out.push(m);
    }
  }
  return out;
}

/**
 * resonator の処理器。入口 1 つ、出口 1 つ。出口が 2 本なら共振を左右へ振る。
 * 値はどれも同じ名前の AudioParam(k-rate)で受ける。作るときの値は processorOptions にも入れる。
 *
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const RESONATOR_CODE = `
// 小さすぎる値は 0 にする(非正規化数で重くならないように)。
// 入口が黙ると状態は 0 へ減り続け、非正規化数に入ると計算が何十倍も遅くなる。
// 見るのは区切りの終わりに 1 回だけ(sound/filter.js と同じ)
const fz = (x) => (x > -1e-20 && x < 1e-20 ? 0 : x);
const P = ${JSON.stringify(Object.fromEntries(Object.entries(RESONATOR_FX.resonator.params).map(([k, v]) => [k, [v.default, v.min, v.max]])))};
const CHORDS = ${JSON.stringify(RESONATOR_CHORDS.map((c) => c.notes))};
const MAX = ${RESONATOR_MAX};
const TOP = ${RESONATOR_TOP};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// 大きさを追う値が下がる速さ(秒)。attack の比を取る 2 つの値で同じ
const FOLLOW = 0.05;
// 和音を書き替えたとき、遅れを寄せる時定数(秒)
const GLIDE = 0.005;
const pitches = (v) => {
  const root = Math.round(v.root), octave = Math.round(v.octave), chord = Math.round(v.chord);
  const mask = Math.round(v.notes), spread = Math.round(v.spread);
  let steps = CHORDS[chord];
  if (!steps) {
    steps = [];
    for (let k = 0; k < 12; k++) if (mask & (1 << ((root + k) % 12))) steps.push(k);
    if (!steps.length) steps = [0];
  }
  const base = (octave + 1) * 12 + root;
  const out = [];
  for (let o = 0; o < spread; o++) {
    for (const s of steps) {
      const m = base + 12 * o + s;
      if (440 * Math.pow(2, (m - 69) / 12) > TOP || out.length >= MAX) continue;
      out.push(m);
    }
  }
  return out;
};
class Resonator extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return Object.entries(P).map(([name, [d, lo, hi]]) => ({ name, defaultValue: d, minValue: lo, maxValue: hi, automationRate: 'k-rate' }));
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.init = {};
    for (const [k, [d, lo, hi]] of Object.entries(P)) this.init[k] = clamp(Number.isFinite(p[k]) ? p[k] : d, lo, hi);
    // 遅れ線は、いちばん低い根音(octave 0 の c)が入る長さで取る。動かしても取り直さない
    this.n = Math.ceil(sampleRate / (440 * Math.pow(2, (12 - 69) / 12))) + 4;
    this.lines = [];
    this.count = 0;
    this.key = '';
    this.w = 0;
    this.ef = 0; this.es = 0;
    this.glide = 1 - Math.exp(-1 / (GLIDE * sampleRate));
    this.rel = Math.exp(-1 / (FOLLOW * sampleRate));
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  val(params, k) {
    const a = params && params[k];
    const [, lo, hi] = P[k];
    return a && a.length ? clamp(a[0], lo, hi) : this.init[k];
  }
  // 並びを作り直す。続けて鳴る共振は遅れを寄せ、新しく並んだ共振は空の遅れ線から鳴らす
  layout(v) {
    const key = [v.root, v.octave, v.chord, v.notes, v.spread].map(Math.round).join(',');
    if (key === this.key) return;
    this.key = key;
    const list = pitches(v);
    const base = (Math.round(v.octave) + 1) * 12 + Math.round(v.root);
    for (let k = 0; k < list.length; k++) {
      const hz = 440 * Math.pow(2, (list[k] - 69) / 12);
      const target = sampleRate / hz;
      let L = this.lines[k];
      if (!L) L = this.lines[k] = { buf: new Float32Array(this.n), d: target, z: 0, hz };
      else if (k >= this.count) { L.buf.fill(0); L.d = target; L.z = 0; }
      L.target = target; L.hz = hz; L.oct = (list[k] - base) / 12;
    }
    this.count = list.length;
  }
  process(inputs, outputs, params) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const v = {};
    for (const k of Object.keys(P)) v[k] = this.val(params, k);
    this.layout(v);
    const len = out[0].length, nc = out.length, n = this.n, cnt = this.count, lines = this.lines;
    const sr = sampleRate, mix = v.mix;
    // 2 点平均の深さ。0 で素通し、0.5 でいちばん暗い。平均で延びる遅れ(s サンプル)は、読む遅れから引く
    const s = (1 - v.brightness) * 0.5;
    const att = v.attack > 0 ? 1 - Math.exp(-1 / (v.attack * sr)) : 0;
    const norm = 1 / Math.sqrt(Math.max(1, cnt));
    for (let k = 0; k < cnt; k++) {
      const L = lines[k];
      // 60dB 下がるまでが decay。1 周(遅れ 1 つぶん)の倍率
      L.fb = Math.pow(10, -3 * L.target / (v.decay * sr));
      L.g = (1 - L.fb) * norm * Math.pow(10, (v.tilt * L.oct + v.gain) / 20);
      // 高さの順に左右へ交互。外ほど広く
      const pan = cnt > 1 ? v.width * (k % 2 ? 1 : -1) * (0.5 + 0.5 * k / (cnt - 1)) : 0;
      const a = (pan + 1) * Math.PI / 4;
      L.l = Math.cos(a) * Math.SQRT2; L.r = Math.sin(a) * Math.SQRT2;
    }
    const nin = inp ? inp.length : 0;
    const x0 = nin ? inp[0] : null, x1 = nin > 1 ? inp[1] : x0;
    // 共振へ入れる音(左右を合わせた 1 本)を、ブロックぶん先に作る。共振どうしはつながっていないので、
    // 1 本ずつブロックを回して加える(サンプルごとに全部の共振を回すより軽い)
    const ex = this.ex && this.ex.length === len ? this.ex : (this.ex = new Float32Array(len));
    const sl = this.sl && this.sl.length === len ? this.sl : (this.sl = new Float32Array(len));
    const sr2 = this.sr2 && this.sr2.length === len ? this.sr2 : (this.sr2 = new Float32Array(len));
    const sm = this.sm && this.sm.length === len ? this.sm : (this.sm = new Float32Array(len));
    let ef = this.ef, es = this.es;
    const rel = this.rel, gk = this.glide;
    for (let i = 0; i < len; i++) {
      const x = !x0 ? 0 : nin > 1 ? (x0[i] + x1[i]) * 0.5 : x0[i];
      // attack。すぐ上がる値 ef と、attack で上がる値 es の比を掛ける
      if (att > 0) {
        const m = x < 0 ? -x : x;
        ef = m > ef ? m : ef * rel;
        // es は ef を attack の速さで追う。m を直に追うと、ノイズのように山がばらつく音では
        // ef の山に届く前に下がってしまい、比がいつまでも 1 に近づかなかった(2026-10-30)
        es = ef > es ? es + (ef - es) * att : ef;
        ex[i] = ef > 1e-9 ? x * Math.min(1, es / ef) : x;
      } else ex[i] = x;
    }
    this.ef = ef; this.es = es;
    sl.fill(0); sr2.fill(0); sm.fill(0);
    const w0 = this.w;
    for (let k = 0; k < cnt; k++) {
      const L = lines[k], buf = L.buf, fb = L.fb, g = L.g, gl = g * L.l, gr = g * L.r, target = L.target;
      let d = L.d, z = L.z, w = w0;
      for (let i = 0; i < len; i++) {
        d += (target - d) * gk;
        const rd = d - s;
        const di = rd | 0, f = rd - di;
        let ia = w - di; if (ia < 0) ia += n;
        const ib = ia === 0 ? n - 1 : ia - 1;
        const ra = buf[ia];
        const r = ra + (buf[ib] - ra) * f;
        // 2 点平均。いま読んだものと、1 つ前に読んだもの
        const y = (1 - s) * r + s * z;
        z = r;
        const o = ex[i] + fb * y;
        buf[w] = o;
        sm[i] += o * g; sl[i] += o * gl; sr2[i] += o * gr;
        if (++w === n) w = 0;
      }
      L.d = d; L.z = fz(z);
    }
    this.w = (w0 + len) % n;
    const dry = 1 - mix;
    const y0 = out[0], y1 = nc > 1 ? out[1] : null;
    for (let i = 0; i < len; i++) {
      const d0 = x0 ? x0[i] : 0;
      if (!y1) { y0[i] = d0 * dry + sm[i] * mix; continue; }
      y0[i] = d0 * dry + sl[i] * mix;
      y1[i] = (x1 ? x1[i] : 0) * dry + sr2[i] * mix;
      // 3 本目からは、振る前の共振を合わせたもの
      for (let c = 2; c < nc; c++) out[c][i] = (inp && inp[c] ? inp[c][i] : d0) * dry + sm[i] * mix;
    }
    return true;
  }
}
registerProcessor('${RESONATOR_NODE}', Resonator);
`;
