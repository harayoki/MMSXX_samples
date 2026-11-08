/**
 * TR-808 voices rebuilt from what an MSX can play: the OPLL rhythm section and the PSG.
 * Addon: opllpsg808 (v0.1.0)
 * Needs the OPLL. The PSG is always there.
 *
 * Every voice sounds as chosen when written at o4c, so it can be laid straight into a drum
 * block (`@{drums 16}`). Other notes shift it by the same amount.
 *
 * Each voice is one or two OPLL rhythm drums with at most one or two PSG channels on top.
 * They were chosen by ear against the tr808 addon, one voice at a time; shorter won when the
 * two sounded equally good, so they get in each other's way less.
 *
 * The rim shot cuts the rhythm snare short with a volume table, so it needs an engine where
 * `@vol` reaches the OPLL rhythm volume registers.
 */
import { registerAddon } from '#sound/addon.js';
import { registerLayer } from '#sound/mml.js';
import { registerTone } from '#sound/tones.js';
import { registerOPLL } from '#sound/opllvoice.js';
// 層に使う OPLL の固定音色(`opll::kick` など)は、ここで登録される。
// ブラウザでは `sound/all.js` が読むが、Node で直に読むとき(`pack:js`)は誰も読まない
import '#sound/opllpresets.js';

// ---- 作りの方針 ----
//
// 2026-11-01 のセッションで、音色ごとに耳で選んだ。お手本は tr808 アドオンの音。
// 選んだときの MML は「リズム音源 v15 + PSG v12」のように別々のパートで書いていた。
// ここでは 1 つの音色(複合音色の層)にまとめ、o4c を書けば同じ音になるようにした。
//
// - 高さ: 層の `semi` で、o4c から選んだ高さまでずらす。1 つで鳴るリズム音源は、
//   層を 1 つしか持てないので、`registerOPLL` の `semi` でずらした音色を作る
// - 大きさ: PSG の v は、音量の表に掛けておく(`at(v, 表)`)。選んだときの `v12` は、表の値に
//   12/15 を掛けて鳴らしていた。層の `gain` で下げると、表の全部から同じ段数を引くことになり、
//   小さい値が先に 0 になって尾が早く消える(焼いて比べて分かった)。リズム音源のほうは `gain` で下げる
// - PSG のチャンネルの割り振りと、ぶつかったときの優先は入れない。エンジンは
//   空いたチャンネルへ自動で入れる。割り振りは Stave が持つ(2026-11-01 に決めた)
//
// 聞こえる高さは、リズム音源ごとに倍率が違う(測った)。キックは書いた高さ、
// スネアは 2 倍、タムは 5 倍で聞こえる

/** 選んだ音を、耳で選んだので byEar。808 に寄せたが作りが違うので approx */
const META = { tags: ['approx', 'byEar', 'msx'], version: '0.1' };
const OPLL_VOL = { vcurve: '3db', vsteps: 16 };

/** リズム音源の v を、v15 から何段下げるかの gain に直す(1 段 3dB) */
const oplGain = (v) => Math.pow(10, -3 * (15 - v) / 20);
/** PSG の音量の表に、選んだときの v を掛けておく */
const at = (v, tab) => tab.map((x) => Math.round(x * v / 15));

/** 音名(o4c からの半音)。o0c が 0 */
const NOTE = { c: 0, 'c+': 1, d: 2, 'd+': 3, e: 4, f: 5, 'f+': 6, g: 7, 'g+': 8, a: 9, 'a+': 10, b: 11 };
const semi = (n) => { const m = /^o(\d)([a-g]\+?)$/.exec(n); return Number(m[1]) * 12 + NOTE[m[2]] - 48; };

/** 部品の名前。音色の名前空間の中に置く */
const P = (s) => `opllpsg808::part::${s}`;

const VOICES = [
  'opllpsg808::bassDrum', 'opllpsg808::snareDrum',
  'opllpsg808::lowTom', 'opllpsg808::midTom', 'opllpsg808::hiTom',
  'opllpsg808::lowConga', 'opllpsg808::midConga', 'opllpsg808::hiConga',
  'opllpsg808::rimShot', 'opllpsg808::claves', 'opllpsg808::handclap', 'opllpsg808::maracas',
  'opllpsg808::cowbell', 'opllpsg808::cymbal', 'opllpsg808::openHihat', 'opllpsg808::closedHihat',
];

registerAddon({
  id: 'opllpsg808',
  version: '0.1.0',
  desc: 'TR-808 voices rebuilt from the MSX sound chips: the OPLL rhythm section and the PSG.'
    + ' Each voice is one or two rhythm drums with a little PSG tone or noise on top, chosen by ear'
    + ' against the tr808 addon. Every voice sounds as chosen at o4c, so it drops straight into a drum block.',
  needs: ['opll'],
  engine: '>=0.69.0',
  voices: VOICES,
}, () => {
  // ---- 部品: PSG ----
  // 頭に少しだけ乗せるトーン。2 フレームで消える(バスドラムとタム)
  registerTone(P('toneHead'), { wave: 'ayTone', vol: at(10, [15, 8, 0]), role: 'perc',
    desc: 'A PSG square for two frames, laid on the front of a drum. A part; use the drums.', ...META });
  // スネアの響き線。周期 1、1 フレームに 0.75 段下げる(20 フレームで消える)
  registerTone(P('snareNoise'), { wave: 'ayNoise(period: 1)', baseArgs: { period: 1 },
    vol: at(12, [15, 14, 14, 13, 12, 11, 11, 10, 9, 8, 8, 7, 6, 5, 5, 4, 3, 2, 2, 1, 0]), role: 'noise',
    desc: 'Fine PSG noise dying over twenty frames: the snare wires. A part; use snareDrum.', ...META });
  // クラップ。周期 16、鳴り直さない
  registerTone(P('clapNoise'), { wave: 'ayNoise(period: 16)', baseArgs: { period: 16 },
    vol: at(13, [15, 13, 10, 10, 9, 9, 9, 8, 8, 8, 7, 7, 7, 6, 6, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 1, 0]), role: 'noise',
    desc: 'Coarse PSG noise with a quick drop and a short tail: the clap. A part; use handclap.', ...META });
  // シンバル。周期 1、1 フレームに 0.15 段下げる
  registerTone(P('cymbalNoise'), { wave: 'ayNoise(period: 1)', baseArgs: { period: 1 },
    vol: at(12, [15, 15, 15, 15, 14, 14, 14, 14, 14, 14, 14, 13, 13, 13, 13, 13, 13, 12, 12, 12, 12, 12, 12, 12,
      11, 11, 11, 11, 11, 11, 11, 10, 10, 10, 10, 10, 10, 9, 9, 9, 9, 9, 9, 9, 8, 8, 8, 8, 8, 8, 8,
      7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4,
      3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 0]), role: 'noise',
    desc: 'Fine PSG noise dying slowly over a second and a half. A part; use cymbal.', ...META });
  // オープンハイハット。周期 1、13 フレーム保ってから 1 フレームに 1 段
  registerTone(P('openHihatNoise'), { wave: 'ayNoise(period: 1)', baseArgs: { period: 1 },
    vol: at(12, [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]), role: 'noise',
    desc: 'Fine PSG noise held for thirteen frames, then let go. A part; use openHihat.', ...META });
  // カウベル。すぐ v9 まで落ちて、尾が残る
  const COWBELL = [15, 12, 10, 9, 8, 8, 8, 8, 7, 7, 7, 6, 6, 6, 5, 5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 0];
  registerTone(P('cowbellLow'), { wave: 'ayTone', vol: COWBELL, role: 'perc',
    desc: 'The lower PSG square of the cowbell: drops fast and leaves a tail. A part; use cowbell.', ...META });
  registerTone(P('cowbellHigh'), { wave: 'ayTone', vol: at(12, COWBELL), role: 'perc',
    desc: 'The higher, quieter PSG square of the cowbell. A part; use cowbell.', ...META });

  // ---- 部品: リズム音源 ----
  // 1 つで鳴る音は層を 1 つしか持てないので、高さをずらした音色を作る
  registerOPLL(P('clavesTom'), 16, { ...OPLL_VOL, drum: 'tom', semi: semi('o4a+'), role: 'perc',
    desc: 'The OPLL rhythm tom moved up to o4a+, where it sounds at 2330Hz. A part; use claves.', ...META });
  registerOPLL(P('rimSnare'), 16, { ...OPLL_VOL, drum: 'sd', semi: semi('o3a+'), role: 'perc',
    desc: 'The OPLL rhythm snare moved to o3a+, where it sounds at 466Hz. A part; use rimShot.', ...META });

  // ---- バスドラム ----
  // キック(o1a)の頭に、PSG のトーン(o1a)を 2 フレーム、v10。
  // 低い矩形波を長く鳴らすとジリジリするので、PSG は頭だけ
  registerLayer('opllpsg808::bassDrum', {
    layers: [{ wave: 'opll::kick', semi: semi('o1a') }, { wave: P('toneHead'), semi: semi('o1a') }],
    role: 'perc', desc: 'Bass drum: the OPLL rhythm kick at 55Hz, with two frames of PSG square on the front.', ...META });

  // ---- スネア ----
  // スネア(o2f、175Hz)に、周期 1 のノイズを v12
  registerLayer('opllpsg808::snareDrum', {
    layers: [{ wave: 'opll::snare', semi: semi('o2f') }, { wave: P('snareNoise') }],
    role: 'perc', desc: 'Snare: the OPLL rhythm snare at 175Hz, with fine PSG noise for the wires.', ...META });

  // ---- タム ----
  // タムに、同じ高さのキック v15 と、頭に PSG のトーンを 2 フレーム v10。
  // タムは 5 倍の高さで聞こえるので、キックと PSG は聞こえる高さ(87・139・185Hz)に合わせる
  for (const [v, tom, at, name] of [['lowTom', 'o0c+', 'o2f', 'Low'], ['midTom', 'o0a', 'o3c+', 'Mid'], ['hiTom', 'o1d', 'o3f+', 'High']]) {
    registerLayer(`opllpsg808::${v}`, {
      layers: [{ wave: 'opll::tom', semi: semi(tom) }, { wave: 'opll::kick', semi: semi(at) },
        { wave: P('toneHead'), semi: semi(at) }],
      role: 'perc', desc: `${name} tom: the OPLL rhythm tom with the kick at the same pitch, and two frames of PSG square on the front.`, ...META });
  }

  // ---- コンガ ----
  // タムと同じ作りで、PSG を乗せない。タムより後ろで鳴る
  for (const [v, tom, at, name] of [['lowConga', 'o1d+', 'o3g', 'Low'], ['midConga', 'o1a', 'o4c+', 'Mid'], ['hiConga', 'o2e', 'o4g+', 'High']]) {
    registerLayer(`opllpsg808::${v}`, {
      layers: [{ wave: 'opll::tom', semi: semi(tom) }, { wave: 'opll::kick', semi: semi(at) }],
      role: 'perc', desc: `${name} conga: the OPLL rhythm tom with the kick at the same pitch. No PSG, so it sits behind the toms.`, ...META });
  }

  // ---- リムショット ----
  // スネア(o3a+、466Hz)を、音量の表で 1 フレームで切る。PSG は使わない。
  // スネアの縁を叩く奏法なので、スネアと同時には鳴らない。取り合わない
  registerTone('opllpsg808::rimShot', { wave: P('rimSnare'), vol: [15, 0], role: 'perc',
    desc: 'Rim shot: the OPLL rhythm snare at 466Hz, cut after one frame with a volume table. No PSG.', ...META });

  // ---- クラベス ----
  registerTone('opllpsg808::claves', { wave: P('clavesTom'), role: 'perc',
    desc: 'Claves: the OPLL rhythm tom up at 2330Hz, on its own. No PSG.', ...META });

  // ---- ハンドクラップ ----
  // ハットを 1 フレーム遅らせ、周期 16 のノイズを重ねる。選んだときは全体を v13 で鳴らしていた
  registerLayer('opllpsg808::handclap', {
    layers: [{ wave: 'opll::hat', delay: 1, gain: oplGain(13) }, { wave: P('clapNoise') }],
    role: 'perc', desc: 'Handclap: coarse PSG noise with the OPLL rhythm hat one frame behind. Struck once, not as a burst.', ...META });

  // ---- マラカス ----
  // 周期 1 のノイズを 1 フレームだけ。選んだときは v13
  registerTone('opllpsg808::maracas', { wave: 'ayNoise(period: 1)', baseArgs: { period: 1 }, vol: at(13, [15, 0]), role: 'perc',
    desc: 'Maracas: one frame of fine PSG noise. No rhythm drum.', ...META });

  // ---- カウベル ----
  // PSG のトーン 2 本(540Hz と 800Hz)。リズム音源は使わない。
  // 音名に乗らないので、o5c+ と o5g からセントでずらす。2 本目は v12
  registerLayer('opllpsg808::cowbell', {
    layers: [{ wave: P('cowbellLow'), semi: semi('o5c+'), cents: -45 },
      { wave: P('cowbellHigh'), semi: semi('o5g'), cents: 35 }],
    role: 'perc', desc: 'Cowbell: two PSG squares at 540Hz and 800Hz that drop fast and leave a tail. Uses two PSG channels and no rhythm drum.', ...META });

  // ---- シンバル ----
  registerLayer('opllpsg808::cymbal', {
    layers: [{ wave: 'opll::cymbal' }, { wave: P('cymbalNoise') }],
    role: 'perc', desc: 'Cymbal: the OPLL rhythm top cymbal with fine PSG noise dying slowly over it.', ...META });

  // ---- ハイハット ----
  registerLayer('opllpsg808::openHihat', {
    layers: [{ wave: 'opll::hat' }, { wave: P('openHihatNoise') }],
    role: 'perc', desc: 'Open hi-hat: the OPLL rhythm hat with fine PSG noise held for a while.', ...META });
  // クローズは PSG のノイズだけ。周期 1、1 フレームに 3 段下げる(5 フレームで消える)
  registerTone('opllpsg808::closedHihat', { wave: 'ayNoise(period: 1)', baseArgs: { period: 1 }, vol: at(12, [15, 12, 9, 6, 3, 0]), role: 'perc',
    desc: 'Closed hi-hat: fine PSG noise gone in five frames. No rhythm drum.', ...META });
});
