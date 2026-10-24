// 最初から入っている波形メモリ。実機の SCC / PC エンジンにあたるもの。
// 名前は **wt で始める**(波形メモリだと見て分かるように)。
//
// どれも 1 周期 32 サンプル。実機もこの長さだった。
// bits は段階の細かさで、5 = 32 段階(PC エンジン風)、8 = 256 段階(SCC 風)。
// 粗いほど倍音が増えて、ジャリッとした古い音になる。
// **実機に無い深さも書ける**(下の waveSine(3) は 8 段しかない)。
//
// 自分で足すときは engine 側をさわらず、ゲームから呼ぶ:
//   mmsxx.audio.addWave('waveMine', [...32 個...], 5);

import { registerWave, registerFamily } from './mml.js';

const N = 32;
/** 0..N-1 の位置ごとに f(位相 0..1) を並べる */
const build = (f) => Array.from({ length: N }, (_, i) => f(i / N, i));
/**
 * **いちばん高いところを 1 に合わせる。**
 *
 * 倍音を足すと、山が重なったところで 1 を超える。`registerWave` は
 * -1..1 に切ってから丸めるので、**超えたぶんは平らに潰れる**。
 * オルガンは 32 点のうち 10 点が ±1 に張り付いていて、
 * 積んだ倍音ではなく**潰れた角**の音になっていた。
 * 見た目も、深さを変えても潰れたところは動かないので、
 * **8 ビットと 5 ビットが同じ形に見えていた。**
 */
const norm = (w) => {
  const top = Math.max(...w.map(Math.abs)) || 1;
  return w.map((v) => v / top);
};
/** 倍音を混ぜる(番号と大きさの組で指定)。**足したあとで 1 に収める** */
const harmonics = (list) => norm(build((p) => {
  let v = 0;
  for (const [n, a] of list) v += a * Math.sin(2 * Math.PI * n * p);
  return v;
}));

/**
 * ただのサイン波を波形メモリに載せたもの。
 * 作りつけの `sine` と形は同じでも、**32 段の階段**になるので
 * かすかに倍音が乗る。粗さのちがいを聞き比べる物差しにもなる
 */
export const WT_SINE = build((p) => Math.sin(2 * Math.PI * p));

/** 鐘・金属。奇数倍音を飛ばして混ぜると、澄んだ金属音になる */
export const WT_BELL = harmonics([[1, 1], [3, 0.5], [5, 0.35], [7, 0.2], [11, 0.12]]);

/** オルガン。基音 + 完全 5 度 + オクターブ。厚みがあってよく通る */
export const WT_ORGAN = harmonics([[1, 1], [2, 0.6], [3, 0.45], [4, 0.3], [6, 0.15]]);

/** ノコギリを階段に落としたもの。PC エンジンらしいジャリッとした音 */
export const WT_RAMP = build((p) => 1 - 2 * p);

/** 声。低い倍音を強めて、前半と後半で形を変える(「あー」に近い) */
export const WT_VOICE = norm(build((p) => {
  const base = Math.sin(2 * Math.PI * p);
  const form = 0.5 * Math.sin(2 * Math.PI * 2 * p) + 0.35 * Math.sin(2 * Math.PI * 3 * p);
  // 前半だけ倍音を強くして、左右非対称にする(声の共鳴に近づく)
  return base + (p < 0.5 ? form : form * 0.25);
}));

/**
 * **和音を敷くための形。**倍音を 3 本だけにして、上を空けてある。
 *
 * 和音は**旋律の下に敷くもの**なので、上が詰まっていると旋律とぶつかる。
 * 倍音を減らすと物足りなく聞こえるが、**それは 1 音で聞いたときの話**で、
 * 3 声重ねると足りる。
 */
export const WT_PAD_WARM = harmonics([[1, 1], [2, 0.45], [3, 0.22]]);

/**
 * **同じく和音を敷くための形。**こちらは奇数倍音だけで、中が空いている。
 * 温かいほうと重ねると、同じ和音でも別の色になる。
 */
export const WT_PAD_AIRY = harmonics([[1, 1], [3, 0.3], [5, 0.16]]);

/** 角を丸めた矩形。矩形より柔らかく、メロディに使いやすい */
export const WT_SQUARE_SOFT = build((p) => {
  const edge = 0.06;                    // 角のなまり具合
  const d = Math.min(p, Math.abs(p - 0.5), 1 - p) / edge;
  const s = p < 0.5 ? 1 : -1;
  return s * Math.min(1, d);
});

// ---- 4 つの形(2026-10-16) ----
//
// tomitaStringsAlt(analog)の波形のうち、形が 1 つに決まるものを、基本の音色にもした。
// 波形メモリ版(32 点・8 ビット、SCC 風)と、きれいな版(点を増やしたもの。
// 名前に wave を付けない)の両方を置く。幅が揺れる PWM は形が決まらないので置かない
//
// 幅 33% だけは、ここに置かない。波形メモリの矩形波には wavePulse( ) の作り分けがあるので、
// その 1 つ wavePulse(33) にした(extrawaves.js)。きれいな版は pulse(33)。
// PWM は analog::pwm にした(2026-10-17)

/** 半分のサイン波(OPLL の half)。下半分を平らにする。基音と偶数の倍音だけ */
const halfSine = (p) => Math.max(0, Math.sin(2 * Math.PI * p)) * 2 - 1;
/** シンク。聞こえる側を 2.5 倍で回し、1 周ごとに頭へ戻す */
const syncSaw = (p) => { const q = (p * 2.5) % 1; return 1 - 2 * q; };
/**
 * オクターブ重ねのこぎり波。1 周が下のオクターブの長さで、のこぎり波 2 周と、
 * 半分の大きさの 1 オクターブ下を重ねる。鳴らすときに 1 オクターブ下げる(octave: -1)
 */
const octaveSaw = (p) => ((1 - 2 * ((p * 2) % 1)) + 0.5 * (1 - 2 * p)) / 1.5;
/** 点を増やして作る(きれいな版)。512 点あれば 255 倍音まで出る */
const fine = (f) => Array.from({ length: 512 }, (_, i) => f(i / 512));

/** 最初から使えるものを登録する(このファイルを読み込んだ時点で入る) */
export function registerDefaultWaves() {
  // ---- 粗さの聞き比べは、サイン波でやる ----
  //
  // **丸めた段が音になるのは、もとの形がなめらかなときだけ。**
  // オルガンや矩形波はもともと角があって倍音を持っているので、
  // 段をいくつか減らしても、そこに埋もれて聞き分けられない。
  // **サイン波には倍音が 1 本も無いので、増えたぶんが全部そのまま聞こえる。**
  //
  // 深さは 3 つ。**8 と 5 の差は薄いので、3 ビットまで落としたものを置く**
  // (実機に 3 ビットの波形メモリがあったわけではなく、
  // **何が起きているのかを耳で分かるための端**)
  registerFamily('waveSine', {
    desc: 'A sine held in wavetable memory. The only thing that changes is the bit depth, '
        + 'so it is the clearest way to hear what depth does.',
    params: [{
      name: 'bits', default: '5', desc: 'Bit depth of each sample. Fewer bits, coarser steps, more buzz.',
      values: [
        { value: '8', desc: 'Eight bits (256 steps), the depth of an SCC. The steps all but disappear.' },
        { value: '5', desc: 'Five bits (32 steps), the depth of a PC Engine. Reads as a chip, not a synth.' },
        { value: '3', desc: 'Three bits (8 steps). Not on any real chip; the corners make the sine buzz.' },
      ],
    }],
  });
  registerWave('waveSine(8)', WT_SINE, 8,
    { role: 'chord',
      descJa: '同じサイン波を 8 ビット(256 段)で。SCC に載せたときの粗さで、'
            + 'ここまで細かいとほとんど段が聞こえない。粗さの端として、これがいちばんきれいなほう',
      desc: 'The same sine at eight bits (256 steps), the depth of an SCC. Fine enough that the steps '
          + 'all but disappear — the clean end of the range.' });
  registerWave('waveSine(5)', WT_SINE, 5,
    { role: 'chord',
      descJa: '波形メモリに載せたサイン波。5 ビット(32 段)。'
            + '階段にしてあるのはわざとで、その粗さが「シンセではなくチップの音」に聞こえる正体。'
            + 'PC エンジンに載せたときの粗さ',
      desc: 'Wavetable sine at five bits (32 steps) — the depth of a PC Engine. The staircase is '
          + 'deliberate: that coarseness is what makes it read as a chip and not a synth.' });
  registerWave('waveSine(3)', WT_SINE, 3,
    { role: 'chord',
      descJa: '同じサイン波を 3 ビット(8 段)まで落としたもの。段の角から倍音が生えて、'
            + 'サイン波なのにジリジリ鳴る。ここまで来ると、深さが何をしているのかが一度で分かる',
      desc: 'The same sine crushed to three bits (8 steps). The corners of the staircase grow harmonics, '
          + 'so a sine ends up buzzing — at this depth you hear what bit depth does in one listen.' });
  registerWave('waveBell', WT_BELL, 8,
    { role: 'counter',
      descJa: '上の倍音を強く持たせた波形メモリ。立ち上がりが金属的で、鐘やチャイムに向く',
      desc: 'Wavetable with strong upper partials. Metallic attack, good for bells and chimes.' });
  // **粗さの違いを聞き比べられるように、同じ形を 2 つの深さで持つ。**
  // SCC は 8 ビット(256 段)、PC エンジンは 5 ビット(32 段)。
  // 丸めは登録のときに 1 回やるので、**音符の途中では変わらない**
  // (実機もそうで、深さは音源の作りであって演奏の指定ではない)
  registerFamily('waveOrgan', {
    desc: 'Stacked octaves in one wavetable cycle, like pulling an organ stop. Two bit depths to compare.',
    params: [{
      name: 'bits', default: '8', desc: 'Bit depth of each sample.',
      values: [
        { value: '8', desc: 'Eight bits (256 steps), the coarseness of an SCC.' },
        { value: '5', desc: 'Five bits (32 steps), the coarseness of a PC Engine. Grittier.' },
      ],
    }],
  });
  registerWave('waveOrgan(8)', WT_ORGAN, 8,
    { role: 'chord',
      descJa: '1 周期の中にオクターブを積んである。1 つの音というより、オルガンの音栓を引いたように聞こえる。'
            + '8 ビット(256 段)なので、SCC に載せたときの粗さ',
      desc: 'Stacked octaves in one cycle, so it reads as an organ register rather than a single note. '
          + 'Eight bits (256 steps) \u2014 the coarseness you get on an SCC.' });
  registerWave('waveOrgan(5)', WT_ORGAN, 5,
    { role: 'chord',
      descJa: '同じ形を 5 ビット(32 段)で丸めたもの。PC エンジンに載せたときの粗さ。'
            + '段が粗いぶん高い倍音が増えて、同じ形でもざらつく',
      desc: 'The same shape rounded to five bits (32 steps) \u2014 the coarseness you get on a PC Engine. '
          + 'The coarser steps add upper harmonics, so the same shape comes out grittier.' });
  registerWave('waveRamp', WT_RAMP, 5,
    { role: 'lead',
      descJa: 'のこぎり波を波形メモリで持ったもの。わざと粗く(5 ビット)してある',
      desc: 'Sawtooth held in the wavetable, kept coarse (5-bit) on purpose.' });        // わざと粗く
  registerWave('waveVoice', WT_VOICE, 5,
    { role: 'lead',
      descJa: '共鳴の山を作った形。粗い。楽器というより母音に聞こえる',
      desc: 'Formant-ish shape, coarse. Reads as a vowel more than an instrument.' });      // わざと粗く
  // ---- 和音を敷くための 2 つ ----
  //
  // **エンベロープを連れてくる。**形だけでは楽器にならない —
  // 立ち上がりが速いままだと、和音なのに旋律と同じ勢いで前へ出てしまう。
  // **全音符くらい置く前提**なので、ゆっくり入ってちょうどよい
  registerWave('wavePadWarm', WT_PAD_WARM, 8,
    { role: 'chord', env: 'pad',
      descJa: '和音を敷くための形。倍音を 3 本だけにして上を空けてある。'
            + 'ゆっくり入るエンベロープを連れてくるので、置いただけで旋律の下に回る',
      desc: 'A shape for laying chords under things: only three partials, with the top left empty. '
          + 'It brings a slow envelope with it, so it sits under the melody without being told to.' });
  registerWave('wavePadAiry', WT_PAD_AIRY, 8,
    { role: 'chord', env: 'swell',
      descJa: '同じく和音のための形だが、奇数倍音だけで中が空いている。'
            + '温かいほうと重ねると、同じ和音でも別の色になる。立ち上がりはさらに遅い',
      desc: 'Also for chords, but odd partials only, hollow in the middle. Layered against the warm one '
          + 'the same chord changes colour. Slower to arrive again.' });
  registerWave('waveSquareSoft', WT_SQUARE_SOFT, 8,
    { role: 'lead',
      descJa: '角を丸めた矩形波。中が空いた感じは残したまま、きつさだけ取れる',
      desc: 'Square with the corners rounded off. Less harsh than a hard pulse while keeping the hollow character.' });
  // 3 つの形の波形メモリ版。SCC 風(32 点・8 ビット)。幅 33% は wavePulse(33)(extrawaves.js)
  registerWave('waveHalfSine', build(halfSine), 8, { role: 'lead',
    desc: 'Half a sine in wavetable memory, the bottom flattened as on the OPLL. The note plus its even harmonics only: round but fuller than a sine, with the 32-step grain of an SCC.' });
  registerWave('waveSync', build(syncSaw), 8, { role: 'lead',
    desc: 'A hard-synced sawtooth in wavetable memory, the audible saw running 2.5 times the note. The harmonics bunch into a peak, a vocal edge, with the grain of an SCC.' });
  registerWave('waveOctaveSaw', build(octaveSaw), 8, { role: 'lead', octave: -1,
    desc: 'A sawtooth with another an octave below at half the level, in wavetable memory. Full and warm at the bottom like a string machine, with the grain of an SCC. The table holds two cycles of the upper saw, so each is only 16 steps.' });
  // 4 つの形のきれいな版(点を増やしたもの)。pulse(33) は矩形波の仲間に置いた
  registerWave('halfSine', fine(halfSine), 16, { role: 'lead',
    desc: 'Half a sine, the bottom flattened as on the OPLL. The note plus its even harmonics only: round but fuller than a sine.' });
  registerWave('syncSaw', fine(syncSaw), 16, { role: 'lead',
    desc: 'A hard-synced sawtooth, the audible saw running 2.5 times the note. The harmonics bunch into a peak, giving a vocal, nasal edge.' });
  registerWave('octaveSaw', fine(octaveSaw), 16, { role: 'lead', octave: -1,
    desc: 'A sawtooth with another an octave below at half the level. Full and warm at the bottom, like a string machine.' });
}
