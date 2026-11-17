/**
 * Analog drum machine voices in the manner of the TR-808.
 * Addon: tr808 (v1.0.0)
 * Built on the subtractive synth, so the analog source is required.
 *
 * Each voice follows how the original is usually described: decaying sine
 * resonators for the drums, filtered noise for the snares and shakers, and
 * stacked pulse waves for the cowbell and the hi-hats. The cymbal is the
 * strongest peaks of a recording laid out again as sines. The lengths, pitches,
 * brightness and the knob curves were matched to recordings of a real machine
 * (Michael Fischer, 1994); the way each voice is built is still a guess.
 */
import { registerAddon } from '#sound/addon.js';
import { registerAnalogPatch, registerAnalogPreset } from '#sound/analog.js';
import { registerLayer } from '#sound/mml.js';

// ---- 作りの方針 ----
//
// 実機のつまみ(LEVEL・TONE・DECAY・SNAPPY・TUNING)は、次のように置き換えた。
// - LEVEL は MML の v
// - TUNING は書いた音符の高さ(太鼓類は音符に従う)
// - TONE・DECAY・SNAPPY は、音色のつまみ(`@{tr808::bassDrum(decay: 2)}`)。
//   よく使う値には名前を付けてプリセットにした(`bassDrumLong` など)。
//   プリセットにも値を渡せる(`@{tr808::bassDrumLong(tone: 0.8)}`)。
//   つまみの既定は、つまみを作る前の音と同じになるように決めた(2026-10-22)
//
// 金属の音(カウベル・シンバル・ハイハット)は、実機では発振器 6 本(カウベルは 2 本)を
// 重ねている。高さは音符に従うので、実機の高さで鳴らすには o3 g+ あたりを書く
// (いちばん低い 1 本が約 213Hz)。6 本の高さは録音から測った(下の SIX)。
//
// 大きさは打楽器の決まりどおり、山を -6dBFS にそろえた(docs/FILTER.md)
//
// 長さ・高さ・明るさ・つまみの効き方は、実機の録音に合わせた(2026-10-22)。
// Michael Fischer が 1994 年に 1 台の実機から録ったもので、つまみを 0・2.5・5・7.5・10 の
// 5 か所に置いて録ってある。同じ物差し(-20dB・-40dB まで落ちる時間、最初の 30ms の
// スペクトルの重心、いちばん強い周波数)で、録音と書き出した音を並べて寄せた。
// 音の組み立て(サイン波・ノイズ・パルス波の重ね方)は、測ったものではない

/**
 * どの音色にも付ける印。耳で聞いて合格になったので、作業中(wip)は外した(2026-10-23)。
 * 録音に寄せたが、作りが実機と違うので approx。
 * 実機の録音と聞き比べて、人が耳で合わせたので byEar(2026-10-23)。
 * サブベースに使えるもの(バスドラムを長く伸ばして音程で鳴らす、いわゆる 808 ベース)には subbass
 */
// 版 1。長さ・高さ・明るさ・つまみの効き方を実機の録音に合わせてあるので、
// 使っていい音として名乗れる(2026-10-30)
const META = { version: '1.00', tags: ['approx', 'byEar'] };
const SUBBASS = { version: '1.00', tags: ['approx', 'byEar', 'subbass'] };

/** 減っていくサイン波の太鼓。parts は [何倍, 大きさ, 60dB 落ちるまでの秒] */
function drum(name, parts, level, desc, extra = {}, knobs = null) {
  registerAnalogPatch(name, {
    wave: 'partials', octave: 0,
    osc: { partials: parts.map(([ratio, lv, t60]) => ({ ratio, level: lv, attack: 0.0005, t60 })) },
    filter: { kind: 'lowpass', cutoff: 20000, resonance: 0, drive: 0 },
    amp: { attack: 0.0005, decay: 4, sustain: 1, release: 0.03 },
    level, ...extra,
  }, { role: 'perc', desc, genre: ['drum'], ...META, ...(knobs ? { knobs } : {}) });
}

/** フィルタを掛けたノイズ。filter2 を渡すと、そのあとに 2 台目のフィルタを置く */
function noise(name, filter, amp, level, desc, role = 'perc', knobs = null, filter2 = null, more = {}) {
  registerAnalogPatch(name, {
    wave: 'noise', octave: 0,
    ...(filter2 ? { filter2 } : {}),
    filter: { resonance: 0, drive: 0, ...filter },
    amp: { attack: 0.0005, sustain: 0, release: 0.02, ...amp },
    level, ...more,
  }, { role, desc, genre: ['drum'], ...META, ...(knobs ? { knobs } : {}) });
}

/** パルス波 1 本。金属の音の材料で、重ねて使う。more はパッチに足すもの(choke など) */
function metal(name, filter, amp, level, knobs = null, more = {}) {
  registerAnalogPatch(name, {
    wave: 'pulse', octave: 0, osc: { width: WIDTH },
    filter: { resonance: 0, drive: 0, ...filter },
    amp: { attack: 0.0005, sustain: 0, release: 0.02, ...amp },
    level, ...more,
  }, { role: 'perc', desc: 'One pulse wave of a metal stack. Use the stacked voices instead.', genre: ['drum'], ...META, ...(knobs ? { knobs } : {}) });
}

// 金属の発振器のパルス幅。実機のカウベルの録音には 2 倍・4 倍の音がはっきり入っていて、
// 50% の矩形波(奇数倍だけ)では足りなかった。0.36 で倍音の並びがいちばん近かった
const WIDTH = 0.36;

/**
 * シンバルの山。実機の録音(DECAY・TONE とも真ん中)から、0〜0.6 秒の平均で強い山を 32 本拾い、
 * 山ごとに大きさ・立ち上がり・減り方を測った(2026-10-23)。
 * [周波数 Hz(o3 g+ で鳴らしたとき), 大きさ(いちばん強い山を 1), 立ち上がり 秒, 60dB 減るまで 秒]。
 * 低い帯(2.4〜3.5kHz)は 0.2 秒ほどかけて大きくなり、5 秒ほど残る。高い帯は頭がいちばん大きく、2 秒ほどで消える
 */
const CY_PEAKS = [
  [2471, 0.104, 0.186, 4.9], [2556, 0.123, 0.221, 4.87], [2792, 0.081, 0.197, 5.14], [2917, 0.085, 0.163, 4.97],
  [3153, 0.155, 0.221, 5.14], [3296, 0.135, 0.174, 4.88], [3351, 0.141, 0.058, 4.95], [3407, 0.18, 0.139, 4.8],
  [3455, 0.087, 0.221, 5.01], [3784, 0.093, 0.046, 4.58], [3891, 0.119, 0.058, 4.42], [4120, 0.157, 0.002, 3.81],
  [4260, 0.157, 0.002, 3.62], [4468, 0.145, 0.002, 3.21], [4943, 0.214, 0.012, 2.62], [5112, 0.219, 0.002, 2.31],
  [5585, 0.254, 0.002, 2.07], [5767, 0.269, 0.002, 2.24], [5834, 0.275, 0.002, 2.13], [5964, 0.403, 0.002, 2],
  [6218, 0.226, 0.035, 1.94], [6306, 0.473, 0.002, 1.72], [6591, 0.7, 0.002, 1.79], [6701, 0.525, 0.002, 1.8],
  [6813, 1, 0.002, 1.84], [6909, 0.275, 0.002, 2.01], [7257, 0.174, 0.002, 1.9], [7566, 0.359, 0.002, 1.79],
  [7668, 0.232, 0.002, 1.92], [7819, 0.193, 0.002, 1.97], [8238, 0.257, 0.002, 1.88], [8520, 0.245, 0.002, 1.91],
];
/**
 * 1.8kHz より下の山。響きの中に音程を感じさせるのはこのあたりで、長く残る。
 * 最初に拾った 32 本には入っていなかった(2026-10-23)。並びは CY_PEAKS と同じ
 */
const CY_LOW_PEAKS = [
  [1459, 0.035, 0.128, 5.16], [1675, 0.039, 0.093, 5.62], [1727, 0.033, 0.128, 4.47], [1892, 0.067, 0.104, 5.4],
  [1945, 0.038, 0.023, 4.99], [2072, 0.04, 0.139, 5.19], [2234, 0.052, 0.093, 4.72], [2430, 0.067, 0.104, 5.19],
];

/**
 * 山ごとの長さに掛ける数。つまみの decay 0.8 で、録音(DECAY 真ん中)の長さになるように決めた
 * (山の減り方を直線で当てはめたぶんの誤差と、頭のノイズの強さで変わる)
 */
const CY_T60 = 0.9;
/**
 * シンバルの TONE。低い音と高い音の傾きを変える。録音では、TONE を 0 から 10 にすると、
 * 1kHz が 6dB ほど下がり、8kHz が 6dB ほど上がった。5kHz を軸に、0.5 からのずれ 1 あたり、
 * 下は 1 オクターブ 2.6dB、上は 8kHz までで 8dB 傾ける。
 * 山にもノイズにも同じ傾きを掛ける(山だけ動かすと、TONE を上げるほどノイズが重く残った)。
 * 響き全体の大きさも CY_BODY だけ動かし、頭のノイズはそのぶん補う。耳の重み(A 特性)で測ると、
 * 録音は TONE 0 から 10 で響きが 10dB 下がり、頭はほとんど変わらなかった
 */
function cyTilt(f, v) {
  const o = Math.log2(f / 5000);
  const db = (o < 0 ? 2.6 * o : 8 * Math.min(1, o / 0.68)) - CY_BODY;
  return 10 ** ((v - 0.5) * db / 20);
}
/**
 * シンバルのノイズの減り方を decay つまみから決める。0.8 より上は同じ割合で伸ばす。
 * 下は、山と同じ絞り(CY_DK × v / (0.8 − v))を重ねる。2 つの減りを足すと、速さが足し算になる
 */
function cyBedDecay(d, v) { return v >= 0.8 ? d * v / 0.8 : 1 / (1 / d + 1 / (CY_DK * v / (0.8 - v))); }
/** ノイズの部品の tone つまみ。帯の真ん中の高さで傾きを掛ける */
function cyToneAt(f) { return { ...K.cyTone, apply: (p, v) => { p.level *= cyTilt(f, v); return p; } }; }
/**
 * オープンハイハットの山。録音(DECAY 真ん中)の 0〜0.25 秒の平均で強い山を 32 本拾い、切れる前の 0.2 秒までで減り方を測った。並びはシンバルと同じ
 */
const OH_PEAKS = [
  [4942, 0.164, 0.002, 2.3], [5044, 0.157, 0.002, 1.93], [5526, 0.141, 0.002, 2.87], [5583, 0.216, 0.002, 2.04],
  [5766, 0.257, 0.002, 2.44], [5833, 0.266, 0.002, 2.36], [5963, 0.398, 0.002, 1.98], [6217, 0.216, 0.046, 1.72],
  [6304, 0.501, 0.002, 1.95], [6589, 0.813, 0.002, 2.23], [6700, 0.684, 0.002, 1.72], [6812, 1, 0.046, 1.57],
  [6907, 0.351, 0.002, 1.81], [7255, 0.269, 0.081, 0.72], [7413, 0.376, 0.002, 1.23], [7565, 0.462, 0.023, 2.18],
  [7666, 0.285, 0.035, 1.23], [7778, 0.335, 0.012, 1.17], [7818, 0.462, 0.002, 1.17], [7945, 0.168, 0.002, 2.27],
  [8236, 0.417, 0.002, 1.58], [8519, 0.343, 0.002, 3.18], [8752, 0.219, 0.023, 1.18], [8827, 0.285, 0.002, 6.71],
  [8934, 0.279, 0.002, 2.64], [9059, 0.207, 0.002, 2.53], [9371, 0.229, 0.023, 1.22], [9883, 0.237, 0.07, 0.82],
  [10221, 0.184, 0.058, 10.62], [11075, 0.184, 0.012, 1.14], [11348, 0.132, 0.002, 2.54], [11532, 0.186, 0.07, 0.91],
];
/** オープンハイハットの大きさ(山・底のノイズ)、底のノイズの下の端、保つあいだの減り方、頭の大きさ。山を -6dBFS にそろえた */
/**
 * 3〜4.5kHz の小さな山。最初に拾った 32 本には、数の上限で入らなかった。
 * これが無いと、音程が少し違って聞こえた(2026-10-23)。3782Hz だけ減り方が 8.6 秒と
 * 飛び抜けて測れたので、まわりに合わせて 2.5 秒にした。大きさは、鳴らすと録音より 2dB 強かったので 0.8 倍にした
 */
const OH_LOW_PEAKS = [
  [3294, 0.034, 0.046, 1.22], [3406, 0.050, 0.002, 2.19], [3782, 0.038, 0.058, 2.5], [3889, 0.034, 0.046, 1.7],
  [4118, 0.065, 0.002, 2.26], [4259, 0.093, 0.002, 2.01], [4413, 0.058, 0.012, 1.44], [4467, 0.085, 0.035, 1.73],
];
const OH_LEVEL = 0.0843, OH_BED = 0.1762, OH_BEDCUT = 4000, OH_HD = 2, OH_HEAD = 0.2643;
/** オープンハイハットの切れる速さ。録音の DECAY 0 は 0.1 秒ほどで消える */
const OCUT = 0.035;
/**
 * 8.6kHz より上の山に掛ける数。録音から測ったままだと、ここが録音より 3〜8dB 強く、
 * 音程が少し高く聞こえた(2026-10-23)
 */
const OH_TOPCUT = 0.56;
/** o3 g+ を octave 2 で鳴らしたときの高さ。山の周波数をこれで割って、何倍かにする */
const CY_BASE = 207.652 * 4;
/** シンバルの大きさ。山・上のノイズ・下のノイズ。既定のつまみで山を -6dBFS にそろえた */
const CY_LEVEL = 0.0588, CY_NOISE = 0.2050, CY_NOISE_LOW = 0.0065, CY_LOWCUT = 1500;
/** 山のあいだの底の大きさ(低い帯・高い帯)。録音とスペクトルの平らさがそろうところにした */
const CY_BED_LO = 0.0265, CY_BED_HI = 0.1125;
/** decay を短くするときの、保つ長さ(秒)と絞り方の強さ。録音の長さに合わせた */
const CY_HOLD = 0.1, CY_DK = 1.6;
/** TONE で頭のノイズをどれだけ強くするか(0.5 からのずれ 1 あたりの dB)。録音では、TONE を上げるほど頭が飛び出した */
const CY_TA = 12;
/** TONE で響き全体の大きさをどれだけ動かすか(dB)。録音では、TONE を上げるほど頭のあとの響きが小さくなった */
const CY_BODY = 9;
/**
 * 金属の発振器 6 本の高さ(o3 g+ = 207.652Hz からの半音)。録音から測った。
 * カウベルの 2 本(558.3・824Hz)は、カウベルの録音でじかに測れる。残りの 4 本は、
 * パルス波の倍音が録音のスペクトルの強いところに落ちるように探し、鳴らして詰めた。
 * よく知られた値(205.3・304.4・369.6・522.7・540・800Hz)のままでは、録音と山の並びが
 * まったく重ならなかった(全体の高さをずらしても重ならない)。1 台ずつ部品のばらつきがあるので、
 * これは録った 1 台の値
 */
const SIX = [212.66, 315.30, 372.22, 567.91, 558.3, 824].map((f) => 12 * Math.log2(f / 207.652));

/** 重ねものの名前を登録する。layers は [音色, 大きさ, 半音, 足すもの(shift など)] */
function stack(name, layers, desc, meta = META, knobs = null) {
  registerLayer(name, {
    role: 'perc', genre: ['drum'], desc, ...meta, ...(knobs ? { knobs } : {}),
    layers: layers.map(([wave, gain, semi, extra]) => {
      const s = Math.round(semi || 0);
      return { wave, gain, semi: s, cents: Math.round(((semi || 0) - s) * 100), ...extra };
    }),
  });
}

// ---- つまみの書き方 ----
// 重ねた音色は名前・範囲・既定・説明だけを持ち、値を部品へ渡す。
// 部品の側が同じ名前のつまみで、パッチのどこを動かすかを決める
const K = {
  bdTone: { min: 0, max: 1, default: 0.3, desc: 'Brightness and loudness of the click at the front. 0 is a soft thud; 1 is a sharp, bright click.' },
  bdDecay: { min: 0.1, max: 4, default: 0.9, unit: 's', desc: 'Seconds for the low boom to fade by 60 dB. Short is a tight kick; 3 or more is the long 808 boom used as a sub bass.' },
  sdTone: { min: 0, max: 1, default: 0.5, desc: 'Balance of the two pitched shell tones. 0 leans on the low one; 1 on the high one.' },
  sdSnappy: { min: 0, max: 1, default: 0.5, desc: 'How much of the wire noise comes in. 0 is the shell alone; below the middle the noise falls away quickly, and 1 is about 9 dB above the default.' },
  cyTone: { min: 0, max: 1, default: 0.5, desc: 'Balance of the two bands. 0 gives more of the low ring under the sizzle; 1 a thinner, higher sizzle. The change is small, as on the original; 0.5 is the recording.' },
  cyDecay: { min: 0.2, max: 4, default: 0.8, desc: 'How long the cymbal rings. 0.8 is the recording with the decay knob in the middle; the original goes from about 0.33 to 1.1. Every peak is stretched by the same ratio, so the low ring always outlasts the bright top.' },
  ohDecay: { min: 0.02, max: 1, default: 0.35, unit: 's', desc: 'Seconds the open hi-hat rings before it is cut off. It fades a little while it rings, then stops short, as on the original.' },
  // 名前の後ろの TR1000 は、実機の 808 に無く、TR-1000 で足されたつまみの印。
  // 既定は実機の音のまま。実機に寄せたいときは渡さない(docs/STUDY_TR1000.md)
  cbDetuneTR1000: { min: -7, max: 7, default: 0, unit: 'semitone', desc: 'TR-1000 extension, not on the original TR-808: like the DETUNE knob of the TR-1000. Moves the pitch of the higher of the two oscillators, in semitones. 0 is the original, about 6.7 semitones apart; -7 brings the two almost together.' },
  hcTailTR1000: { min: 0, max: 2, default: 1, desc: 'TR-1000 extension, not on the original TR-808: like the TAIL LVL knob of the TR-1000. How loud the tail after the claps is. 1 is the original; 0 leaves the claps alone; 2 is twice as loud.' },
};
const spec = (...names) => Object.fromEntries(names.map(([k, key]) => [k, K[key]]));

const VOICES = [
  'tr808::bassDrum', 'tr808::bassDrumLong', 'tr808::snareDrum', 'tr808::snareDrumSnappy',
  'tr808::lowTom', 'tr808::midTom', 'tr808::hiTom',
  'tr808::lowConga', 'tr808::midConga', 'tr808::hiConga',
  'tr808::claves', 'tr808::rimShot', 'tr808::maracas', 'tr808::handclap', 'tr808::cowbell',
  'tr808::cymbal', 'tr808::cymbalLong', 'tr808::openHihat', 'tr808::closedHihat',
];

registerAddon({
  id: 'tr808',
  version: '1.0.0',
  desc: 'Analog drum machine voices in the manner of the TR-808: sine resonators for the drums,'
    + ' filtered noise for the snare and shakers, stacked pulse waves for the cowbell and the hi-hats,'
    + ' and the peaks of a recorded cymbal laid out again as sines.'
    + ' The drums follow the written note, which stands in for the tuning knob; tone, decay and'
    + ' snappy are knobs passed when the voice is called, with presets for common settings.'
    + ' Lengths, pitches, brightness and knob curves were matched to recordings of a real machine.',
  needs: ['analog'],
  engine: '>=0.85.0',
  voices: VOICES,
}, () => {
  // ---- バスドラム ----
  // 胴はサイン波 1 本。頭の短い 1.5 倍は、叩いた瞬間に高さが落ちる感じの代わり。
  // 音符に従うので、実機に近い 50Hz あたりは o1 g から a
  drum('tr808::bassDrumBody', [[1, 1, 0.9], [1.5, 0.35, 0.03]], 0.442,
    'Bass drum body on its own. Use bassDrum.', {},
    { decay: { ...K.bdDecay, apply: (p, v) => { p.osc.partials[0].t60 = v; return p; } } });
  // クリックは tone で明るさと大きさを動かす。0.3 で前の音(3000Hz、そのままの大きさ)
  noise('tr808::bassDrumClick', { kind: 'lowpass', cutoff: 3000 }, { decay: 0.004 }, 0.442,
    'Bass drum click on its own. Use bassDrum.', 'perc',
    { tone: { ...K.bdTone, apply: (p, v) => {
      p.filter.cutoff = 3000 * 2 ** (v - 0.3);
      p.level *= 1 + (v - 0.3) * 0.2;
      return p;
    } } });
  stack('tr808::bassDrum', [['tr808::bassDrumBody', 1], ['tr808::bassDrumClick', 0.3]],
    'Bass drum. A low sine that dies away with a soft click on the front. The pitch follows the note; around o1 a sounds like the original.',
    SUBBASS, spec(['tone', 'bdTone'], ['decay', 'bdDecay']));
  registerAnalogPreset('tr808::bassDrumLong', 'tr808::bassDrum', { decay: 3 }, {
    desc: 'Preset: bass drum with the decay turned up, the long booming tail used under hip-hop and trap. Played as a bass line it is the 808 sub bass. Around o1 a.',
    ...SUBBASS });

  // ---- スネア ----
  // 胴は 2 本のサイン波(1 : 2。録音では 172Hz と 345Hz)。響き線の音(SNAPPY)は高いほうだけ通したノイズ
  // tone は胴の 2 本の比。0.5 で前の音(低い 1、高い 0.6)
  drum('tr808::snareBody', [[1, 1, 0.18], [2, 0.6, 0.11]], 0.266,
    'Snare body on its own. Use snareDrum.', {},
    { tone: { ...K.sdTone, apply: (p, v) => {
      p.osc.partials[0].level = 1.3 - 0.6 * v;
      p.osc.partials[1].level = 0.3 + 0.6 * v;
      return p;
    } } });
  // snappy はノイズの大きさ。実機の録音を測ると、半分より下で急に小さくなり
  // (2.5 で -20dB)、上はゆるやかに増える(10 で +9dB)。そのとおりの曲線にした
  noise('tr808::snareNoise', { kind: 'bandpass', cutoff: 3500, resonance: 0 }, { decay: 0.12 }, 0.401,
    'Snare wires on their own. Use snareDrum.', 'perc',
    { snappy: { ...K.sdSnappy, apply: (p, v) => { p.level *= (v / 0.5) ** (v < 0.5 ? 3.3 : 1.55); return p; } } });
  stack('tr808::snareDrum', [['tr808::snareBody', 1], ['tr808::snareNoise', 0.5]],
    'Snare drum. Two short sines for the shell under a hiss of high noise for the wires. Around o3 f.',
    META, spec(['tone', 'sdTone'], ['snappy', 'sdSnappy']));
  registerAnalogPreset('tr808::snareDrumSnappy', 'tr808::snareDrum', { snappy: 1 }, {
    desc: 'Preset: snare drum with the snappy knob turned up, more wire noise on the shell. Around o3 f.' });

  // ---- タムとコンガ ----
  // タムは胴の響きが長く、少し上の音が乗る。コンガは短く澄んでいる。
  // 高さは音符で決める(実機の TUNING)。低いほど少し長く響く
  // 大きさは 1 本ずつ測ってそろえた(tl がタム、cl がコンガ)
  for (const [n, d, t, ct, note, cnote, tl, cl] of [
    ['low', 'Low', 0.62, 0.58, 'o2 f', 'o3 g', 0.531, 0.507],
    ['mid', 'Mid', 0.39, 0.28, 'o3 c+', 'o4 c+', 0.519, 0.525],
    ['hi', 'High', 0.32, 0.25, 'o3 f+', 'o4 g+', 0.507, 0.531],
  ]) {
    drum(`tr808::${n}Tom`, [[1, 1, t], [2.4, 0.1, 0.05]], tl,
      `${d} tom. A sine that rings for a while with a faint overtone. The pitch follows the note; around ${note}.`);
    drum(`tr808::${n}Conga`, [[1, 1, ct]], cl,
      `${d} conga. A short, clean sine. The pitch follows the note; around ${cnote}.`);
  }

  // ---- クラベスとリムショット ----
  drum('tr808::claves', [[1.031, 1, 0.05]], 0.589,
    'Claves. A very short, high sine like two sticks of wood. Around o7 d.');
  // 実機は 10ms ほど鳴ってすぐ切れる。倍音の t60 は 0.05 秒より短くできないので、音量で切る
  drum('tr808::rimBody', [[1, 1, 0.05], [1.95, 0.32, 0.05], [3.63, 0.4, 0.05]], 0.343, 'Rim shot body on its own. Use rimShot.',
    { amp: { attack: 0.0005, hold: 0.008, decay: 0.002, sustain: 0, release: 0.01 } });
  noise('tr808::rimClick', { kind: 'highpass', cutoff: 2000 }, { decay: 0.003 }, 0.343,
    'Rim shot click on its own. Use rimShot.');
  stack('tr808::rimShot', [['tr808::rimBody', 1], ['tr808::rimClick', 1.2]],
    'Rim shot. A very short knock with a crack on top. Around o4 a+.');

  // ---- マラカスと手拍子 ----
  noise('tr808::maracas', { kind: 'highpass', cutoff: 5000 }, { attack: 0.017, hold: 0.003, decay: 0.006 }, 0.457,
    'Maracas. A short shake of high noise.');
  // 手拍子。ノイズの音量を 11ms おきに 4 回かけ直し(何人かが少しずれて叩いた感じ)、
  // ゆっくり減る尾を足す。実機の説明に倣った(回路図は確かめていない)
  registerAnalogPatch('tr808::handclap', {
    wave: 'noise', octave: 0,
    filter: { kind: 'bandpass', cutoff: 1100, resonance: 0.35, drive: 0 },
    amp: { attack: 0.0005, decay: 0.006, sustain: 0, release: 0.08, repeat: 4, gap: 0.011, tail: 0.08, tailDecay: 0.5 },
    level: 1.454,
  }, { role: 'perc', desc: 'Hand clap. Band-passed noise struck four times about 11 ms apart, as if a few people clapped a little out of step, then a short tail like the ring of a room.', genre: ['drum'], ...META,
    knobs: { tailTR1000: { ...K.hcTailTR1000, apply: (p, v) => { p.amp.tail *= v; return p; } } } });

  // ---- カウベル ----
  // パルス波 2 本(558.3Hz と 824Hz)を帯域で切る。頭は強く、すぐ短い尾になる
  metal('tr808::cowbellSquare', { kind: 'bandpass', cutoff: 1100, resonance: 0.6 }, { decay: 0.03, tail: 0.25, tailDecay: 0.35 }, 0.7);
  // detuneTR1000 は高いほうの発振器だけを動かす(registerLayer の shift)
  stack('tr808::cowbell', [['tr808::cowbellSquare', 0.35], ['tr808::cowbellSquare', 1, SIX[5] - SIX[4], { shift: { detuneTR1000: 100 } }]],
    'Cowbell. Two pulse waves a fifth or so apart, band-passed. Around o5 c+ sounds like the original.',
    META, spec(['detuneTR1000', 'cbDetuneTR1000']));

  // ---- シンバルとハイハット ----
  // 実機の録音は、3 つとも 6.3〜6.8kHz に強い音が固まり、2kHz より下は約 21dB/oct で切れている。
  //
  // シンバルは、録音の強い山 32 本をサイン波で並べ直した(CY_PEAKS)。実機の回路をなぞるのはやめて、
  // 音を写している。帯が 2 つあり、高い帯ははじめに強く早く消え、低い帯(2.4〜3.5kHz)は
  // 0.2 秒ほどかけて大きくなって長く残る。
  // 前はパルス波 6 本を 2 つの帯に分けて作っていた。山の高さは合っても山ごとの強さが合わず、
  // 7〜9kHz と 2.8kHz が強く出て、高く聞こえた(2026-10-23)。
  // 1.8kHz より下の山 8 本(CY_LOW_PEAKS)も足し、40 本を 1 つの音色にする。鳴り始めの 8kHz から上と、山のあいだのザーという音はノイズで埋める。
  // サイン波だけでは山と底の差が録音より 10〜15dB 大きく、金属っぽく聞こえたので、
  // 山のあいだにもノイズを敷いた。声は 5 声
  //
  // 前は、山を 8 本ずつ 5 つの音色に分けて重ねていた(エンジンの partials が 8 本までだった)。
  // 音色ごとにフィルタが 1 台付くので、それだけで 1 台約 30ms 重かった。
  // エンジンを 48 本まで並べられるようにして、1 つにまとめた。オープンハイハットも同じ。
  // フィルタは開いたままのローパスで、どの山にも同じものが掛かっていたので、音は変わらない
  // (波形の差は山を 0dB として -141dB 以下。2026-11-01)。
  // 重さは、4 音を 48kHz で焼いてシンバル 572ms → 470ms、オープンハイハット 496ms → 374ms
  // (同じ回の analog::tomitaBell は 251ms)。エンジンでサイン波を回して進めるようにし、動かないカットオフの
  // 係数を毎標本作らないようにしたあとは、シンバル 181ms、オープンハイハット 146ms(tomitaBell 131ms。docs/TODO.md の 43 番)
  //
  // ハイハットは、パルス波 6 本を 4 極のハイパス(highpass4)で切る
  registerAnalogPatch('tr808::cymbalPeaks', {
    wave: 'partials', octave: 2,
    osc: { partials: CY_PEAKS.concat(CY_LOW_PEAKS).map(([f, lv, attack, t60]) => ({ ratio: f / CY_BASE, level: lv, attack, t60: t60 * CY_T60 })) },
    filter: { kind: 'lowpass', cutoff: 20000, resonance: 0, drive: 0 },
    amp: { attack: 0.0005, decay: 4, sustain: 1, release: 0.05 },
    level: CY_LEVEL,
  }, { role: 'perc', desc: 'The cymbal peaks on their own, without the noise. Use cymbal.', genre: ['drum'], ...META, knobs: {
    tone: { ...K.cyTone, apply: (p, v) => {
      for (const q of p.osc.partials) q.level = Math.min(1, q.level * cyTilt(q.ratio * CY_BASE, v));
      return p;
    } },
    // 0.8 で録音(DECAY 真ん中)の長さ。録音では DECAY を回しても最初の 150ms はほとんど変わらず、
    // そのあとの減り方だけが変わった。短くするときは、山の減り方はそのままにして、
    // 少し保ってから音量で絞る。長くするときは、山の減り方を同じ割合で伸ばす
    decay: { ...K.cyDecay, apply: (p, v) => {
      if (v < 0.8) {
        p.amp.hold = CY_HOLD;
        p.amp.sustain = 0;
        p.amp.decay = CY_DK * v / (0.8 - v);
      } else {
        for (const q of p.osc.partials) q.t60 = Math.min(60, q.t60 * v / 0.8);
      }
      return p;
    } },
  } });
  // 鳴り始めの明るさ。録音は頭だけ 12kHz まで強く、すぐ消える
  noise('tr808::cymbalNoise', { kind: 'highpass4', cutoff: 6000 }, { decay: 0.15 }, CY_NOISE * 2.5,
    'Cymbal top on its own. Use cymbal.', 'perc',
    { tone: { ...K.cyTone, apply: (p, v) => { p.level *= cyTilt(9000, v) * 10 ** ((v - 0.5) * (CY_TA + CY_BODY) / 20); return p; } } },
    { kind: 'lowpass', cutoff: 11000, resonance: 0 });
  // 山と山のあいだを埋める、低いほうのザーという音。録音では 1kHz あたりにも長く残っている
  noise('tr808::cymbalNoiseLow', { kind: 'bandpass', cutoff: CY_LOWCUT, resonance: 0.3 }, { attack: 0.1, decay: 2 }, CY_NOISE_LOW,
    'Cymbal hiss under the peaks, on its own. Use cymbal.', 'perc',
    { tone: cyToneAt(CY_LOWCUT), decay: { ...K.cyDecay, apply: (p, v) => { p.amp.decay = cyBedDecay(2, v); return p; } } });
  // 山のあいだの底。サイン波だけだと山ばかりで、録音より金属っぽく聞こえた。
  // 2 つの帯それぞれに、その帯の山と同じ減り方のノイズを敷く。
  // 高い帯は 4 極のハイパスで下を切り、2 台目のフィルタ(filter2)のローパスで上を丸める。
  // バンドパスだと裾が 1kHz まで漏れて音が重くなり、ハイパスだけだと 12kHz があとまで残った
  noise('tr808::cymbalBedLow', { kind: 'bandpass', cutoff: 3000, resonance: 0.6 }, { attack: 0.1, decay: 2.1 }, CY_BED_LO * 1.2,
    'Cymbal noise under the low band, on its own. Use cymbal.', 'perc',
    { tone: cyToneAt(3000), decay: { ...K.cyDecay, apply: (p, v) => { p.amp.decay = cyBedDecay(2.1, v); return p; } } });
  noise('tr808::cymbalBedHigh', { kind: 'highpass4', cutoff: 5500, resonance: 0.3 }, { decay: 0.78 }, CY_BED_HI * 1.2,
    'Cymbal noise under the high band, on its own. Use cymbal.', 'perc',
    { tone: cyToneAt(6500), decay: { ...K.cyDecay, apply: (p, v) => { p.amp.decay = cyBedDecay(0.78, v); return p; } } },
    { kind: 'lowpass', cutoff: 12000, resonance: 0 });
  // チョーク。クローズを鳴らすと、同じチャンネルで鳴っているオープンが 10ms で止まる(グループ tr808hat)。
  // 実機のサービスノートの説明どおり。オープンはクローズを止めず、オープンどうしも止めない。
  // 録音では確かめていない(Fischer の録音集は 1 音ずつ録ってあり、オープンのあとのクローズが無い)
  const CH_CHOKE = { chokes: 'tr808hat' }, OH_CHOKE = { choke: 'tr808hat' };
  metal('tr808::hatSquare', { kind: 'highpass4', cutoff: 6800, resonance: 0.7 }, { decay: 0.05 }, 0.363, null, CH_CHOKE);
  // パルス波だけでは上が減っていくが、実機のクローズは 16kHz まで平らに近い。高いノイズを重ねて埋める
  noise('tr808::hatNoise', { kind: 'highpass4', cutoff: 9000 }, { decay: 0.05 }, 0.363,
    'Closed hi-hat top on its own. Use closedHihat.', 'perc', null, null, CH_CHOKE);
  // オープンは、実機では鳴りながら少しずつ減り(300ms で 10dB ほど)、そのあと急に切れる。
  // 保つ長さ(amp.hold)をつまみにした。平らに保つだけでは、だらしなく伸びて聞こえた。
  // 中身はシンバルと同じく、録音の強い山 32 本をサイン波で並べ直し(OH_PEAKS)、
  // 山のあいだにノイズを敷いた(2026-10-23)。パルス波 6 本では、山の強さが録音と合わなかった
  const ohAmp = { attack: 0.0005, hold: 0.35, decay: OCUT, sustain: 0, release: 0.02 };
  registerAnalogPatch('tr808::openHihatPeaks', {
    wave: 'partials', octave: 2,
    osc: { partials: OH_PEAKS.concat(OH_LOW_PEAKS).map(([f, lv, attack, t60]) => ({ ratio: f / CY_BASE, level: f > 8600 ? lv * OH_TOPCUT : lv, attack, t60 })) },
    filter: { kind: 'lowpass', cutoff: 20000, resonance: 0, drive: 0 },
    amp: { ...ohAmp },
    level: OH_LEVEL, ...OH_CHOKE,
  }, { role: 'perc', desc: 'The open hi-hat peaks on their own, without the noise. Use openHihat.', genre: ['drum'], ...META, knobs: {
    // 保つ長さ。録音では DECAY を回しても、鳴っているあいだの減る速さはほとんど変わらず、
    // 切れるまでの長さだけが変わった(0.35 で録音の DECAY 真ん中)
    decay: { ...K.ohDecay, apply: (p, v) => { p.amp.hold = v; return p; } },
  } });
  noise('tr808::openHihatBed', { kind: 'highpass4', cutoff: OH_BEDCUT, resonance: 0.3 }, { ...ohAmp, holdDecay: OH_HD }, OH_BED,
    'Open hi-hat noise under the peaks, on its own. Use openHihat.', 'perc',
    { decay: { ...K.ohDecay, apply: (p, v) => { p.amp.hold = v; return p; } } }, null, OH_CHOKE);
  // 頭。耳の重み(A 特性)で測ると、山とノイズだけでは頭が録音より 1.5〜2.5dB 小さかった
  noise('tr808::openHihatHead', { kind: 'highpass4', cutoff: 6000 }, { decay: 0.04 }, OH_HEAD,
    'Open hi-hat attack on its own. Use openHihat.', 'perc', null, { kind: 'lowpass', cutoff: 12000, resonance: 0 }, OH_CHOKE);
  const six = (square) => SIX.map((semi) => [square, 1, semi]);
  stack('tr808::cymbal', [['tr808::cymbalPeaks', 1]].concat([['tr808::cymbalNoise', 1], ['tr808::cymbalNoiseLow', 1], ['tr808::cymbalBedLow', 1], ['tr808::cymbalBedHigh', 1]]),
    'Cymbal. The strongest peaks of a recorded TR-808 cymbal laid out again as sines, with a little high noise on top: a bright top that fades fast and a lower ring that lasts. Around o3 g+.',
    META, spec(['tone', 'cyTone'], ['decay', 'cyDecay']));
  registerAnalogPreset('tr808::cymbalLong', 'tr808::cymbal', { decay: 2.5 }, {
    desc: 'Preset: cymbal with the decay turned up. Around o3 g+.' });
  stack('tr808::openHihat', [['tr808::openHihatPeaks', 1]].concat([['tr808::openHihatBed', 1], ['tr808::openHihatHead', 1]]),
    'Open hi-hat. The strongest peaks of a recorded TR-808 open hi-hat laid out again as sines, over a bed of high noise; it fades a little while it rings, then stops short. Around o3 g+. A closed hi-hat on the same channel chokes it: it stops within 10 ms.',
    META, spec(['decay', 'ohDecay']));
  stack('tr808::closedHihat', [...six('tr808::hatSquare'), ['tr808::hatNoise', 1]],
    'Closed hi-hat. The six pulses cut very short, with a little high noise on top. Around o3 g+. Played on the same channel as an open hi-hat, it chokes the open one, which stops within 10 ms.');
});
