/**
 * GameNotes - A drum kit after the last Konami SCC driver on MSX.
 * Addon: gamenotes::manbowDrumkit (v1.0.0)
 *
 * コナミの MSX の SCC ドラムは作りが 4 つある(docs/STUDY_KONAMI_SCC.md)。
 * これは Ver.4 — スペースマンボウ(1989-12-21)、クォース(1990-03-09)、
 * SD スナッチャー(1990-04-27)、メタルギア2 ソリッドスネーク(1990-07-20)。
 *
 * Ver.2 と Ver.3 は「1 回落ちて止まる」エンベロープだが、Ver.4 は形 8(繰り返す鋸)に
 * 変わる。トーンを聞こえない高さへ逃がして、繰り返す鋸そのものを音にする。
 * バスドラムは 27Hz のうなりで、そのあとソフト音量とトーンの下がりで胴を作る。
 * 打の種類もいちばん多い。
 *
 * 実際のゲームの音の聞こえ方と、データ値の両方を参考にして作り直した。
 * PCM やエミュレートでの再現ではない。
 *
 * エンジンは 0.78.1 から(`@ay{ tp{…} }` と、打の頭でトーンの位相をそろえる直し)。
 */
import { registerAddon } from '#sound/addon.js';
import { registerVoice, AY_ENV_SHAPES } from '#sound/mml.js';

const ID = 'gamenotes::manbowDrumkit';
const v = (name) => `${ID}::${name}`;

/**
 * エンベロープ(R11〜R13)。長さはレジスタの値そのもので書く。
 *
 * 形 8 と形 10 で 1 段の長さの数え方が違う(鋸は 32 段、三角は 64 段)ので、
 * ms で書くと取り違える。実機から読んだ値をそのまま置く
 */
const env = (shape, ep) => ({ shape, r13: AY_ENV_SHAPES[shape].r13, ep });

/** 表の入れ物。`registerAY` が作るものと同じ形にそろえる */
const tone = (extra = {}) => ({
  arp: null, pitch: null, vol: null, duty: null, dutyLfo: null, slide: null, vib: null,
  loop: {}, ...extra,
});

/**
 * PSG の打楽器を 1 つ。`mix` が R7、`np` が R6、`tp` が R0・R1、
 * `vol` が R8、`env` が R11〜R13。どれも 1 フレームに 1 つで、音の頭から読む
 */
const perc = (name, { mix, np = [16], tp = null, vol, env: ev = [] }, desc) =>
  registerVoice(name, 'ay', {
    mode: 'tone',
    tone: tone({ mix, np, tp, ayVol: vol, ayEnv: ev }),
  }, { role: 'perc', tags: ['msx', 'preview'], vsteps: 16, vcurve: '3db', version: '0.1', desc });

/** 同じ値を n 個 */
const rep = (x, n) => Array(n).fill(x);

registerAddon({
  id: ID,
  version: '0.1.0',
  desc: 'A drum kit rebuilt after the last Konami SCC driver on MSX, the one in Space Manbow, '
    + 'Quarth, SD Snatcher and Metal Gear 2. Its envelope repeats instead of falling once: the '
    + 'tone is parked where it cannot be heard and the repeating saw itself becomes the sound, '
    + 'so the bass drum is a twenty-seven hertz buzz with a long body. Rebuilt by ear against '
    + 'the data, not sampled and not emulated.',
  needs: ['ay'],
  engine: '>=0.78.1',
  voices: [
    v('kick'), v('kickBig'),
    v('snare'), v('snareSoft'), v('snareBig'),
    v('hat'), v('hatLight'), v('crash'),
  ],
}, () => {
  // バスドラム。頭はトーンもノイズも閉じて、繰り返す鋸(36.6ms = 27Hz)だけを出す。
  // 実機はトーンを周期 1(111kHz)へ逃がしているが、閉じるのと同じことで、
  // そちらだとナイキストの関所に当たって黙る。
  // 胴はソフト音量とトーンの下がり。109 → 97 → 87Hz を 2 回くり返す
  perc(v('kick'), {
    mix: ['-', ...rep('t', 10), '-'],
    tp: [1, 1024, 1152, 1280, 1280, 1280, 1280, 1024, 1152, 1280, 1536],
    vol: [16, 8, 7, 6, 2, 2, 2, 2, 2, 2, 2, 0],
    env: [env('saw', 256)],
  }, 'Bass drum. The gate is shut for the attack, so the repeating saw itself is the sound: a '
   + 'twenty-seven hertz buzz. The body is a tone falling from 109Hz to 87Hz twice over ten '
   + 'frames. The written note does not change it; the periods come from the chip.');

  // 太いバスドラム。SD スナッチャーとメタルギア2 のほう。鋸が 54.9ms へ伸びて、
  // 頭の 2 フレームが聞こえる高さ(62 → 55Hz)になる。そのあとは同じ胴
  perc(v('kickBig'), {
    mix: [...rep('t', 6), '-'],
    tp: [1792, 2048, 1024, 1152, 1280, 1280],
    vol: [16, 16, 8, 7, 6, 2, 0],
    env: [env('saw', 384)],
  }, 'The bigger bass drum from SD Snatcher and Metal Gear 2. The saw stretches to fifty-five '
   + 'milliseconds and the attack sits at an audible 62Hz falling to 55Hz before the same body.');

  // スネア。頭は閉じて、三角の繰り返し(16.0ms = 62Hz)。尾はノイズ周期 4 を
  // ソフトで 5 フレーム下げる
  perc(v('snare'), {
    mix: ['-', ...rep('n', 5), '-'], np: [4], tp: [1],
    vol: [16, 9, 8, 7, 6, 5, 0], env: [env('tri', 112)],
  }, 'Snare. A shut-gate attack on the repeating triangle at sixty-two hertz, then five frames '
   + 'of noise faded in software.');

  // 弱打。同じ頭で、尾が 2 フレームだけ。実機はこちらのほうが多い
  perc(v('snareSoft'), {
    mix: ['-', 'n', 'n', '-'], np: [4], tp: [1],
    vol: [16, 9, 8, 0], env: [env('tri', 112)],
  }, 'The quieter snare: the same attack with only two frames of tail. The driver uses this one '
   + 'more often than the full snare.');

  // 強打。実機には無い。同じ頭で、胴を太く長くしたもの
  perc(v('snareBig'), {
    mix: ['-', ...rep('n', 8), '-'], np: [4], tp: [1],
    vol: [16, 11, 10, 9, 8, 7, 6, 5, 4, 0], env: [env('tri', 112)],
  }, 'A fuller snare: the same attack with a louder, longer tail. Not on the original driver.');

  // ハイハット。スペースマンボウだけが持っている、Ver.2 のままの刻み。
  // 頭の 1 フレームがトーン 259Hz、尾がノイズ周期 8 を 5 フレーム
  perc(v('hat'), {
    mix: ['t', ...rep('n', 5), '-'], np: [8], tp: [432],
    vol: [16, 10, 9, 8, 7, 6, 0], env: [env('tri', 66)],
  }, 'Hi-hat. Space Manbow still carries the older driver\'s hat: one frame of tone at 259Hz, '
   + 'then five frames of noise.');

  // 軽いハイハット。打の尾に足されている短い飾り。
  // 高いトーン(10kHz あたり)とノイズを重ねて 2 フレーム
  perc(v('hatLight'), {
    mix: ['tn', 'tn', '-'], np: [1], tp: [11, 10], vol: [9, 7, 0],
  }, 'A light tick: a high tone around ten kilohertz with noise over two frames. The driver '
   + 'hangs it on the end of other hits.');

  // シンバル。スペースマンボウの長い打。頭がトーン 109Hz、尾が 23 フレーム。
  // ノイズの粗さが 8 → 10 → 11 と下がっていくので、消えぎわが暗くなる
  perc(v('crash'), {
    mix: ['t', ...rep('n', 23), '-'],
    np: [...rep(8, 6), ...rep(10, 14), ...rep(11, 4)], tp: [1024],
    vol: [16, 11, 10, 9, 8, 7, 8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 3, 3, 3, 3, 0],
    env: [env('tri', 18)],
  }, 'Cymbal. The long hit from Space Manbow: twenty-three frames of noise whose period walks '
   + 'from eight to eleven, so it darkens as it dies.');
});
