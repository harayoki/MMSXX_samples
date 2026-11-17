// フォルマントフィルタ(トークボックス)。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 母音は、声の通り道が作る数本の山(フォルマント)で聞き分けられる。その山を 3 本の
// バンドパスで作り、元の音を通す。のこぎり波のような倍音の多い音を通すと、「アー」「イー」と
// 鳴る。ギターやシンセの音を口に通して鳴らす、トークボックスの代わりに使う。
//
// 2026-10-30 に、AudioThing の The Orb(User Guide v2.0)の作りに寄せて広げた。値の名前と働きは
// マニュアルに合わせ、数(範囲・既定・母音の表)は見当で決めた。どこが見当かは docs/FILTER.md に書いた。
//
// - 母音は輪に並べる(`vowel`)。0 ah、1 e、2 ee、3 u、4 o、5 i で、最後の次は最初へ戻る。
//   使う数は `vowels`(2〜6。先頭から)。あいだの数は、となりの 2 つを補間する
//   (周波数は対数で、帯の幅も対数で、大きさは dB で)
// - 母音の表は 3 つ(`voice`。male female child)。表は FORMANT_TABLES の 1 か所にあり、
//   F1〜F3(Hz)だけを持つ。差し替えるときはここを直す
// - 帯の鋭さは `emphasis`(フィルタのレゾナンスにあたる)
// - `drift`(-1〜1)× `driftRange`(Hz)を、3 本の山の周波数に足す。向きは `polarity`
// - `spread` は母音どうしの違いを広げるか縮める。`size` は山の高さ全体を半音で動かす
// - 3 本の山の大きさは `levelA` `levelB` `levelC`。0 でその本を切る
// - LFO は 3 つ(vowel emphasis drift)。それぞれ rate depth phase shape を持つ。
//   揺れは曲の頭に揃える(tremolo と同じく AudioParam `origin` で受ける)。phase は始まりの位相
// - `smooth` は、母音・emphasis・drift が変わるときに滑らかに移す時間
// - 出口は gain(dB)、softclip(tanh で丸める)、mix の順。width はステレオのとき右の LFO をずらす
// - 帯の係数は 16 サンプルに 1 回だけ作る(phaser と同じ)。値が変わらないあいだは作り直さない
// - mix は DAW の Dry/Wet。既定は 1(トークボックスは元の音を混ぜない)

/** formant の処理器の名前 */
export const FORMANT_NODE = 'mmsxx-formant';

/** 係数を作り直す間隔(サンプル) */
export const FORMANT_STEP = 16;

/** 輪に並べる母音。並びは、動画で見えた The Orb の円の並び(時計回り)に合わせた */
export const FORMANT_VOWEL_NAMES = ['ah', 'e', 'ee', 'u', 'o', 'i'];

/**
 * 母音の表。声の種類 → 母音 → [F1, F2, F3](Hz)。
 *
 * male の ah e ee u o は、前から使っていた表(男声・テノールのおおまかな値として出回っているもの)の
 * まま。既定の音を変えないため。male の i(bit の i)と、female と child は、成人男性・成人女性・子供の
 * 平均として広く引かれている表の値。どれも出典とは突き合わせていない。一般的な値として使う。
 * male だけ出どころが違うので、male から female へ移ると、母音によって動き方が揃わない
 */
export const FORMANT_TABLES = {
  male: {
    ah: [650, 1080, 2650], e: [400, 1700, 2600], ee: [290, 1870, 2800],
    u: [350, 600, 2700], o: [400, 800, 2600], i: [390, 1990, 2550],
  },
  female: {
    ah: [850, 1220, 2810], e: [610, 2330, 2990], ee: [310, 2790, 3310],
    u: [370, 950, 2670], o: [590, 920, 2710], i: [430, 2480, 3070],
  },
  child: {
    ah: [1030, 1370, 3170], e: [690, 2610, 3570], ee: [370, 3200, 3730],
    u: [430, 1170, 3260], o: [680, 1060, 3180], i: [530, 2730, 3600],
  },
};

/**
 * 母音ごとの、山の幅(male での Hz)と大きさ(dB)。[[幅, 大きさ] を 3 本]。
 *
 * ah e ee u o は前からの表のまま。i は e と ee のあいだの見当。
 * female と child は、male の同じ母音の Q(幅 / 周波数)と大きさをそのまま使う。
 * 表の欄を F1〜F3 だけにするため(The Orb の Custom の表も、名前と F1〜F3 だけを持つ)
 */
export const FORMANT_SHAPES = {
  ah: [[80, 0], [90, -6], [120, -7]],
  e: [[70, 0], [80, -14], [100, -12]],
  ee: [[40, 0], [90, -15], [100, -18]],
  u: [[40, 0], [60, -20], [100, -17]],
  o: [[40, 0], [80, -10], [100, -12]],
  i: [[50, 0], [90, -14], [100, -15]],
};

/** 声の種類の並び(`voice` の数の順) */
export const FORMANT_VOICES = ['male', 'female', 'child'];

/**
 * 帯を通ると、倍音の多い音でも大きさがかなり下がる。そのぶんを持ち上げる倍率(dB)。
 * 持ち上げないと、110Hz ののこぎり波を a e i o u に通して -13〜-11dB、220Hz で -12〜-8dB だった。
 * 平均で元の音に近くなるように決めた(2026-10-26、Node で処理器を回して測った)
 */
export const FORMANT_MAKEUP_DB = 11;

/**
 * emphasis で帯の幅が何倍まで動くか。幅は表の値の 2 × EMPHASIS_RANGE^(1 - 2 emphasis) 倍。
 * emphasis 0.5(既定)で 2 倍(前の幅)、0 で 8 倍、1 で 0.5 倍。
 *
 * 2 倍が既定なのは、表の幅のままだと、山に倍音が乗るかどうかで大きさが大きく変わるため。
 * 440Hz ののこぎり波で、母音ごとに -18〜-6dB だった。2 倍にすると -13〜-3dB に縮んだ
 */
export const FORMANT_EMPHASIS_RANGE = 4;

/**
 * emphasis で幅を変えたときに、大きさを戻す量(dB)。幅が 2 倍になるごとにこれだけ下げる。
 * 帯が広いほど多くの倍音を通して大きくなるため。110Hz と 220Hz ののこぎり波を 6 つの母音と 3 つの声に通して
 * 決めた(2026-10-30、Node で処理器を回して測った)。戻さないと、emphasis 0 で平均 +6dB、1 で -8dB だった。
 * 戻すと、どの声でも emphasis 0〜1 の平均が -2〜+0.2dB に入る。ただし emphasis 1 では、倍音が山に乗る母音で
 * +8dB まで出る(softclip で抑える)
 */
export const FORMANT_EMPHASIS_DB = 3.7;

/** drift の値の下限(Hz)。引いて山が 0Hz を下回らないように */
export const FORMANT_FMIN = 50;

/** smooth 1 のときの時定数(秒) */
export const FORMANT_SMOOTH_SEC = 0.25;

/** 乱数(LFO の random)の種。決めておくと、何度鳴らしても同じ並びになる */
export const FORMANT_SEED = 0x5eed;

/** LFO の形。tremolo と同じ 4 つに、段で跳ぶ random を加えた。どれも 1 周の頭が置いた値(0) */
const SHAPES = [
  { value: 0, name: 'sine', desc: 'Sine. A smooth sway, starting from the set value.' },
  { value: 1, name: 'triangle', desc: 'Triangle. Like the sine, with sharper turns.' },
  { value: 2, name: 'square', desc: 'Square. Jumps between the set value and the far end of the depth.' },
  { value: 3, name: 'saw', desc: 'Saw. Rises from the set value to the far end and snaps back. On the vowel, with vowelDepth equal to vowels, it goes round the ring without a jump.' },
  { value: 4, name: 'random', desc: 'Random steps, a sample and hold: a new value at the start of each cycle, held until the next. The same tune always gets the same steps.' },
];

/** LFO 1 つぶんの値。prefix は vowel emphasis drift */
const lfo = (prefix, what, depthMax, depthDesc) => ({
  [`${prefix}Rate`]: { live: false, unit: 'Hz', min: 0.01, max: 20, default: 0.5, desc: `How fast the LFO on ${what} cycles, in cycles per second. The cycles line up with the start of the tune.${prefix === 'vowel' ? ' In MML, @l 2 sets one cycle to a half note of the tune.' : ''}` },
  [`${prefix}Depth`]: { live: true, min: 0, max: depthMax, default: 0, desc: depthDesc },
  [`${prefix}Phase`]: { live: true, unit: 'deg', min: 0, max: 360, default: 0, desc: `Where in its cycle the LFO on ${what} starts, in degrees. 180 starts it half way, at the far end.` },
  [`${prefix}Shape`]: {
    live: true, min: 0, max: 4, default: 0,
    desc: `Shape of the LFO on ${what}: a number, rounded to a whole one, or the name of one of the choices (sine, triangle, square, saw, random).`,
    choices: SHAPES,
  },
});

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const FORMANT_FX = {
  formant: {
    tags: ['filter', 'voice'], version: '0.1',
    devNote: '母音を変えるたびに音符の前へ @fx{… @vowel e} を書くことになっている。1 音ずつ母音を並べて書ける専用の記法を作る予定(docs/TODO.md の 42。形はまだ決めていない)。範囲・既定値・female と child の表は見当で、まだ耳で詰めていない',
    // `@l` は vowel の LFO の 1 周の長さ
    lengthParam: 'vowelRate',
    desc: 'Formant filter, a stand-in for a talk box. Three band-pass peaks shape the sound like the mouth shapes a vowel, so a bright tone such as a saw or a square seems to sing "ah", "ee" or "oo". The vowels sit on a ring, and three LFOs can move the vowel, the sharpness of the peaks (emphasis) and the drift of the peaks. Works best on sounds rich in harmonics; a sine has little for the peaks to shape.',
    params: {
      vowel: {
        live: true, min: 0, max: 6, default: 0,
        desc: 'The vowel, a place on a ring: a number, or the name of one of the choices (ah, e, ee, u, o, i). Values in between blend the two neighbours. After the last vowel in use (see vowels) the ring comes back to ah, so with all six, 6 is ah again and 5.5 is half way from i to ah.',
        // 連続した値なので、名前は整数の点にだけ付ける
        choices: [
          { value: 0, name: 'ah', desc: 'ah, as in "father".' },
          { value: 1, name: 'e', desc: 'e, as in "bed".' },
          { value: 2, name: 'ee', desc: 'ee, as in "see".' },
          { value: 3, name: 'u', desc: 'u, as in "food".' },
          { value: 4, name: 'o', desc: 'o, as in "law".' },
          { value: 5, name: 'i', desc: 'i, as in "bit".' },
        ],
      },
      vowels: { live: true, min: 2, max: 6, default: 6, desc: 'How many vowels are on the ring, taken from the start of the list (ah, e, ee, u, o, i), rounded to a whole number. With 3 the ring is ah, e, ee and back to ah.' },
      voice: {
        live: true, min: 0, max: 2, default: 0,
        desc: 'Which table of vowels to use: a number, rounded to a whole one, or the name of one of the choices (male, female, child). The peaks sit higher from male to child.',
        choices: [
          { value: 0, name: 'male', desc: 'Adult male voice.' },
          { value: 1, name: 'female', desc: 'Adult female voice. The peaks are higher than male.' },
          { value: 2, name: 'child', desc: "A child's voice. The highest peaks." },
        ],
      },
      emphasis: { live: true, min: 0, max: 1, default: 0.5, desc: 'How sharp the peaks are, like the resonance of a filter. Higher values sound more like a voice, with a stronger, ringing character; lower values are broad and gentle. The level is kept about the same.' },
      drift: { live: true, min: -1, max: 1, default: 0, desc: 'Moves the three peaks up or down, as a share of driftRange, in the direction polarity allows. 0 leaves them where the vowel puts them.' },
      driftRange: { live: true, unit: 'Hz', min: 0, max: 1000, default: 300, desc: 'How many hertz drift 1 (or -1) moves the peaks. The same number of hertz goes to all three, so the low peak moves the most for its height.' },
      polarity: {
        live: true, min: 0, max: 2, default: 2,
        desc: 'Which way drift moves the peaks: a number, rounded to a whole one, or the name of one of the choices (up, down, both).',
        choices: [
          { value: 0, name: 'up', desc: 'Up only. drift 1 and -1 both add driftRange.' },
          { value: 1, name: 'down', desc: 'Down only. drift 1 and -1 both take driftRange off.' },
          { value: 2, name: 'both', desc: 'Either way. drift 1 adds driftRange, -1 takes it off.' },
        ],
      },
      smooth: { live: true, min: 0, max: 1, default: 0, desc: 'How smoothly the vowel, emphasis and drift glide when they change, from 0 (at once) to 1 (a quarter of a second to get most of the way). Turns the jumps of a square or random LFO into glides.' },
      levelA: { live: true, min: 0, max: 1, default: 1, desc: 'Level of the first (lowest) peak. 0 turns it off.' },
      levelB: { live: true, min: 0, max: 1, default: 1, desc: 'Level of the second peak. 0 turns it off.' },
      levelC: { live: true, min: 0, max: 1, default: 1, desc: 'Level of the third (highest) peak. 0 turns it off.' },
      spread: { live: true, min: -1, max: 1, default: 0, desc: 'How different the vowels are from each other. Below 0 they move toward their average and sound alike; above 0 the differences are exaggerated. At -1 the differences are halved, at 1 doubled.' },
      size: { live: true, unit: 'semitone', min: -12, max: 12, default: 0, desc: 'Moves all the peaks together, in semitones, to change how big the voice sounds. Below 0 is a bigger, lower voice; above 0 a smaller, brighter one. The pitch of the note does not change.' },
      width: { live: false, min: 0, max: 1, default: 0, desc: "How far the right side's LFOs run ahead of the left, from 0 (both alike) to 1 (half a cycle, moving in opposite ways). It only shows while an LFO moves and the player asks for stereo; a mono output ignores it." },
      gain: { live: true, unit: 'dB', min: -24, max: 24, default: 0, desc: 'Level of the shaped sound, in dB, before softclip. Raising it with softclip on drives the clip harder.' },
      softclip: { live: true, min: 0, max: 1, default: 0, desc: 'Switch. 1 rounds off the loud tops of the shaped sound, so sharp peaks do not jump out; quiet parts are left almost alone. 0 leaves the sound as it is.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the shaped sound, from 0 (the dry sound alone) to 1 (the shaped sound alone). A talk box is all shaped sound, so the default is 1.' },
      ...lfo('vowel', 'the vowel', 6, 'How far the LFO moves the vowel, in vowel steps along the ring above vowel. 0 holds the vowel still. With vowel 0 and vowelDepth 3 it sweeps from ah through e and ee to u and back.'),
      ...lfo('emphasis', 'emphasis', 1, 'How far the LFO raises emphasis above its set value. The sum stops at 1.'),
      ...lfo('drift', 'drift', 2, 'How far the LFO raises drift above its set value. The sum stops at 1, so from drift -1 a depth of 2 sweeps the whole way. With the random shape the peaks wander.'),
    },
  },
};

/** ステレオで鳴らすとき、出口を 2 本に決めるか。width が 0 でないときだけ */
export const formantStereo = (fx) => !!fx && Number(fx.width) > 0;

/** 処理器へ渡す表。[声][母音][山] = [周波数 Hz, 幅 Hz, 大きさ dB] */
const VOWEL_TABLE = FORMANT_VOICES.map((v) => FORMANT_VOWEL_NAMES.map((n) =>
  FORMANT_TABLES[v][n].map((f, j) => {
    const [bw, db] = FORMANT_SHAPES[n][j];
    // male はそのまま。ほかは male と同じ Q になる幅
    return [f, v === 'male' ? bw : bw * f / FORMANT_TABLES.male[n][j], db];
  })));

/**
 * formant の処理器。入口 1 つ、出口 1 つ。チャンネルごとに帯の状態を持つ。
 *
 * 帯は 2 極の状態変数フィルタ(TPT。sound/filter.js と同じ形)のバンドパスで、
 * 山の高さが 1 になるように k を掛けて取り出す。3 本を表の大きさで合わせる。
 *
 * 動かせる値(`live`)は同じ名前の AudioParam(k-rate)で受ける。rate の 3 つと width は
 * 作るときに決まる(揺れを曲の頭から数えるのと、出口の本数を決めるため)。
 * 作るときの値は processorOptions にも入れる(AudioParam を受けないところで回しても、その値で鳴るように)。
 * AudioParam `origin` は曲の頭の時刻(tremolo と同じ。書き込むのは sound/audio.js の `_fxOrigin`)。
 * 係数の表は、左右が揃っていれば 1 つ、width でずれていれば左右で 2 つ作る。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const FORMANT_CODE = `
const STEP = ${FORMANT_STEP};
const VOWELS = ${JSON.stringify(VOWEL_TABLE)};
const MAKEUP = ${Math.pow(10, FORMANT_MAKEUP_DB / 20)};
const ER = ${FORMANT_EMPHASIS_RANGE};
const EDB = ${FORMANT_EMPHASIS_DB};
const FMIN = ${FORMANT_FMIN};
const SMOOTH = ${FORMANT_SMOOTH_SEC};
const SEED = ${FORMANT_SEED};
const P = ${JSON.stringify(Object.fromEntries(Object.entries(FORMANT_FX.formant.params).map(([k, v]) => [k, [v.default, v.min, v.max, !!v.live]])))};
const NAMES = Object.keys(P);
const LFOS = ['vowel', 'emphasis', 'drift'];
// LFO ごとの値の名前。ブロックごとに名前を組み立てない
const LN = LFOS.map((k) => [k + 'Depth', k + 'Phase', k + 'Shape']);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// 声ごと、使う母音の数ごとの、山の周波数の対数の平均。spread の中心
const MEAN = VOWELS.map((T) => [0, 0, 2, 3, 4, 5, 6].map((n) => [0, 1, 2].map((j) => {
  let s = 0;
  for (let i = 0; i < n; i++) s += Math.log(T[i][j][0]);
  return n ? s / n : 0;
})));
// 整数 n から 0 以上 1 未満の数。random の段に使う。同じ n には同じ数
const hash = (n) => {
  let h = (Math.imul(n | 0, 0x9e3779b1) ^ SEED) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
// LFO の形。0〜1 を返し、0 が置いた値。c は曲の頭から数えた周(端数つき)
const wave = (shape, c) => {
  const n = Math.floor(c), ph = c - n;
  switch (shape) {
    case 1: return ph < 0.5 ? 2 * ph : 2 - 2 * ph;
    case 2: return ph < 0.5 ? 0 : 1;
    case 3: return ph;
    case 4: return hash(n);
    default: return 0.5 - 0.5 * Math.cos(2 * Math.PI * ph);
  }
};

class Formant extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'origin', defaultValue: 0, automationRate: 'k-rate' },
      ...NAMES.filter((n) => P[n][3]).map((n) => ({ name: n, defaultValue: P[n][0], minValue: P[n][1], maxValue: P[n][2], automationRate: 'k-rate' }))];
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.v0 = {};
    for (const n of NAMES) this.v0[n] = clamp(Number.isFinite(p[n]) ? p[n] : P[n][0], P[n][1], P[n][2]);
    this.rate = LFOS.map((k) => this.v0[k + 'Rate']);
    // 右の LFO を先へずらす量(周)
    this.lead = this.v0.width * 0.5;
    // 左右ぶんの係数(3 本 × 6 = 18)、それを作った値(key)、滑らかにした値(sm。母音・emphasis・drift)
    this.cf = [new Float64Array(18), new Float64Array(18)];
    this.key = [new Float64Array(10).fill(NaN), new Float64Array(10).fill(NaN)];
    this.sm = [null, null];
    this.m = new Float64Array(3);
    this.lv = new Float64Array(3);
    this.L = LFOS.map(() => new Float64Array(3));
    // emphasis から作る幅と持ち上げ。同じ emphasis なら作り直さない
    this.we = NaN; this.wide = 0; this.mk = 0;
    this.st = [];
    this.frames = 0;
    // 係数の表が、いまの値で埋まっているか(動かないあいだは作り直さない)
    this.full = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  // 係数を cf に書く。pos は母音の位置(0〜nv の輪)、drift は Hz、sp と sz は spread と size の倍率
  coef(cf, pos, nv, emph, drift, voice, spread, sp, size, sz, lv) {
    const i = Math.floor(pos) % nv, t = pos - Math.floor(pos);
    const T = VOWELS[voice], A = T[i], B = T[(i + 1) % nv], sr = sampleRate;
    if (emph !== this.we) {
      this.we = emph;
      this.wide = 2 * Math.pow(ER, 1 - 2 * emph);
      // 幅を広げたぶん大きくなるので、2 倍ごとに EDB 下げる(emphasis 0.5 で 0)
      this.mk = MAKEUP * Math.pow(10, -EDB * (1 - 2 * emph) * Math.log2(ER) / 20);
    }
    const wide = this.wide, mk = this.mk;
    for (let j = 0; j < 3; j++) {
      let f = Math.exp(Math.log(A[j][0]) * (1 - t) + Math.log(B[j][0]) * t);
      const bw = Math.exp(Math.log(A[j][1]) * (1 - t) + Math.log(B[j][1]) * t) * wide;
      const db = A[j][2] * (1 - t) + B[j][2] * t;
      // 幅は母音の表から決める(spread size drift で山を動かしても、Q は変えない)
      const k = bw / f;
      if (spread !== 0) { const m = MEAN[voice][nv][j]; f = Math.exp(m + (Math.log(f) - m) * sp); }
      if (size !== 0) f *= sz;
      if (drift !== 0) f = Math.max(FMIN, f + drift);
      const g = Math.tan(Math.PI * Math.min(f, sr * 0.45) / sr);
      const a1 = 1 / (1 + g * (g + k)), a2 = g * a1, a3 = g * a2;
      const o = j * 6;
      cf[o] = g; cf[o + 1] = k; cf[o + 2] = a1; cf[o + 3] = a2; cf[o + 4] = a3;
      cf[o + 5] = Math.pow(10, db / 20) * k * mk * lv[j];
    }
  }
  process(inputs, outputs, params) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, sr = sampleRate;
    const v = (n) => (params && params[n] ? clamp(params[n][0], P[n][1], P[n][2]) : this.v0[n]);
    const nv = Math.round(v('vowels')), voice = Math.round(v('voice'));
    const vowel = v('vowel'), emphasis = v('emphasis'), drift = v('drift');
    const range = v('driftRange'), polar = Math.round(v('polarity'));
    const smooth = v('smooth'), spread = v('spread'), size = v('size'), mix = v('mix');
    const sp = spread === 0 ? 1 : Math.pow(2, spread), sz = size === 0 ? 1 : Math.pow(2, size / 12);
    const lv = this.lv;
    lv[0] = v('levelA'); lv[1] = v('levelB'); lv[2] = v('levelC');
    const gdb = v('gain'), gl = gdb === 0 ? 1 : Math.pow(10, gdb / 20), clip = v('softclip') >= 0.5;
    // LFO ごとの [depth, 始まりの位相(周), 形]。depth 0 のものは回さない
    const L = this.L;
    let moving = false;
    for (let l = 0; l < 3; l++) {
      const k = LN[l];
      L[l][0] = v(k[0]); L[l][1] = v(k[1]) / 360; L[l][2] = Math.round(v(k[2]));
      if (L[l][0] > 0) moving = true;
    }
    // 曲の頭から数えた秒。AudioWorklet の外で回すとき(currentTime が無いとき)は、回したサンプルの数から
    const origin = params && params.origin ? params.origin[0] : 0;
    const t0 = (typeof currentTime === 'number' ? currentTime : this.frames / sr) - origin;
    this.frames += len;
    const sides = this.lead > 0 && moving && out.length > 1 ? 2 : 1;
    const nk = Math.ceil(len / STEP);
    if (!this.tab || this.tab[0].length < nk * 18) { this.tab = [new Float64Array(nk * 18), new Float64Array(nk * 18)]; this.full = 0; }
    const a = smooth > 0 ? Math.exp(-STEP / (sr * SMOOTH * smooth)) : 0;
    const m = this.m;
    // STEP ごとの係数を、ブロックのヘッダでまとめて作る。値が前と同じなら作り直さない。
    // 動かないあいだ(LFO が止まり、滑らかにし終え、値が前のブロックと同じ)は、表をそのまま使う
    let changed = moving || this.full < sides, late = false;
    for (let s = 0; s < nk; s++) {
      const ts = t0 + s * STEP / sr;
      for (let c = 0; c < sides; c++) {
        // LFO の値(0〜depth)。右(c 1)は width ぶん先から読む
        for (let l = 0; l < 3; l++) {
          m[l] = L[l][0] > 0 ? L[l][0] * wave(L[l][2], ts * this.rate[l] + L[l][1] + (c ? this.lead : 0)) : 0;
        }
        let pos = m[0] === 0 ? vowel : vowel + m[0];
        pos -= nv * Math.floor(pos / nv);
        let emph = m[1] === 0 ? emphasis : Math.min(1, emphasis + m[1]);
        const dv = m[2] === 0 ? drift : Math.min(1, drift + m[2]);
        let dhz = dv === 0 ? 0 : range * (polar === 0 ? Math.abs(dv) : polar === 1 ? -Math.abs(dv) : dv);
        // 滑らかにする。母音は輪の上の近いほうへ回る。寄りきったら揃える(係数を作り続けないように)
        let sm = this.sm[c];
        if (!sm) sm = this.sm[c] = [pos, emph, dhz];
        if (a === 0) { sm[0] = pos; sm[1] = emph; sm[2] = dhz; }
        else {
          let dp = pos - sm[0];
          dp -= nv * Math.round(dp / nv);
          sm[0] += (1 - a) * dp; sm[0] -= nv * Math.floor(sm[0] / nv);
          sm[1] += (1 - a) * (emph - sm[1]);
          sm[2] += (1 - a) * (dhz - sm[2]);
          if (Math.abs(dp) < 1e-5) sm[0] = pos;
          if (Math.abs(emph - sm[1]) < 1e-5) sm[1] = emph;
          if (Math.abs(dhz - sm[2]) < 1e-3) sm[2] = dhz;
          pos = sm[0]; emph = sm[1]; dhz = sm[2];
        }
        const key = this.key[c], cf = this.cf[c];
        if (key[0] !== pos || key[1] !== emph || key[2] !== dhz || key[3] !== voice || key[4] !== nv
          || key[5] !== spread || key[6] !== size || key[7] !== lv[0] || key[8] !== lv[1] || key[9] !== lv[2]) {
          this.coef(cf, pos, nv, emph, dhz, voice, spread, sp, size, sz, lv);
          key[0] = pos; key[1] = emph; key[2] = dhz; key[3] = voice; key[4] = nv;
          key[5] = spread; key[6] = size; key[7] = lv[0]; key[8] = lv[1]; key[9] = lv[2];
          changed = true;
          if (s > 0) late = true;
        }
        if (changed) this.tab[c].set(cf, s * 18);
      }
      // 頭の STEP で何も変わらず、LFO も止まっていれば、残りの STEP も同じ(表はもう埋まっている)
      if (!changed) break;
    }
    // 表のどの STEP も同じ係数なら、埋まっている。LFO が動いたか、途中で係数が変わったら埋まっていない
    if (changed) this.full = moving || late ? 0 : sides;
    for (let c = 0; c < out.length; c++) {
      const st = this.st[c] || (this.st[c] = new Float64Array(6));
      const tab = this.tab[c < sides ? c : 0];
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
        if (gl !== 1) sum *= gl;
        if (clip) sum = Math.tanh(sum);
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
