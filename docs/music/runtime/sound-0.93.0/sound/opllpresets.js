// OPLL(YM2413)の組み込み音色。MSX-MUSIC / FM-PAC に載っていた 15 個。
//
// **番号を渡すだけ。**音の作りはチップの側にある(`sound/opll.js`)。
// 音色を足すことはできない。実機がそうだから。ユーザー音色(0 番)は
// レジスタを直に書く道ができてから。
//
// `fm2*` とは別に並べる。あちらは寄せて作ったもので、こちらは実機と同じ演算。
// 聞き比べてから、どちらを残すか決める(2026-09-26)。
//
// 音色ごとの音量差は均さない。頭の山は 15 音色とも同じで、違うのは
// 減衰の速さと波形の薄さ。それは音色の性格なので、実機のまま出す。
// 全体の水平出しは別でやる
// (docs/ENGINE_TODO.md「OPLL の音色ごとの音量差は、均さない」)。
//
// 「一部の音色が明らかに小さい」と言われた件は、音色ではなく処理器が
// キーオフを書き落としていたのが原因だった(sound/opll.js、2026-09-27)。

import { registerFamily, sealPresets } from './mml.js';
import { registerDefaultLayers } from './layerpresets.js';
import { registerOPLL, registerOPLLVoice } from './opllvoice.js';

/** 実機の音色番号と、名前と、説明 */
export const OPLL_PRESETS = [
  [1, 'opll::violin', 'lead', 'バイオリン。細くて張りがある',
    'Violin. Thin and taut.'],
  [2, 'opll::guitar', 'lead', 'ギター。はじいたあと速く落ちる',
    'Guitar. Plucked, and it drops away fast.'],
  [3, 'opll::piano', 'lead', 'ピアノ。MSX の FM でいちばん使われた音',
    'Piano, and the one voice an MSX game was most likely to reach for.'],
  [4, 'opll::flute', 'lead', 'フルート。柔らかく立ち上がる',
    'Flute. A soft start.'],
  [5, 'opll::clarinet', 'lead', 'クラリネット。木管らしい奇数倍音',
    'Clarinet, with the odd harmonics of a reed.'],
  [6, 'opll::oboe', 'lead', 'オーボエ。鼻にかかる',
    'Oboe. Nasal and narrow.'],
  [7, 'opll::trumpet', 'lead', 'トランペット。前に出る',
    'Trumpet. It cuts through.'],
  [8, 'opll::organ', 'chord', 'オルガン。切るまで伸びる',
    'Organ. It holds until you stop it.'],
  [9, 'opll::horn', 'chord', 'ホルン。丸くて奥にいる',
    'Horn. Round, and it sits back.'],
  [10, 'opll::synth', 'lead', 'シンセ。この時代らしい作り物の音',
    'Synthesizer, artificial in the way the era liked.'],
  [11, 'opll::harpsichord', 'lead', 'チェンバロ。硬くて短い',
    'Harpsichord. Hard and short.'],
  [12, 'opll::vibraphone', 'lead', 'ビブラフォン。揺れながら伸びる',
    'Vibraphone, wavering as it rings on.'],
  [13, 'opll::synthBass', 'bass', 'シンセベース。低音の定番',
    'Synth bass, the usual choice down low.'],
  [14, 'opll::acousticBass', 'bass', 'アコースティックベース。指で弾いた低音',
    'Acoustic bass, plucked.'],
  [15, 'opll::electricGuitar', 'lead', 'エレキギター。硬めのアタック',
    'Electric guitar, with a harder attack.'],
];


/**
 * YMF281B(OPLLP)の音色。**パチンコ・パチスロ向けに差し替えられた表。**
 *
 * 演算器は YM2413 と同じで、15 個の中身だけが違う。名前は emu2413 の注記から。
 */
export const OPLLP_PRESETS = [
  [1, 'opll::opllpStrings', 'lead', 'エレキストリングス', 'Electric strings.'],
  [2, 'opll::opllpBowWow', 'lead', 'バウワウ。うなる', 'Bow wow, and it growls.'],
  [3, 'opll::opllpGuitar', 'lead', 'エレキギター', 'Electric guitar.'],
  [4, 'opll::opllpOrgan', 'chord', 'オルガン', 'Organ.'],
  [6, 'opll::opllpSax', 'lead', 'サックス', 'Saxophone.'],
  [7, 'opll::opllpTrumpet', 'lead', 'トランペット', 'Trumpet.'],
  [8, 'opll::opllpStreetOrgan', 'chord', 'ストリートオルガン', 'Street organ.'],
  [9, 'opll::opllpSynthBrass', 'lead', 'シンセブラス', 'Synth brass.'],
  [10, 'opll::opllpEPiano', 'lead', 'エレピ', 'Electric piano.'],
  [11, 'opll::opllpBass', 'bass', 'ベース', 'Bass.'],
  [13, 'opll::opllpChimes', 'lead', 'チャイム', 'Chimes.'],
  [14, 'opll::opllpTomTom', 'perc', 'タムタム 2', 'Tom tom II.'],
  [15, 'opll::opllpNoise', 'noise', 'ノイズ', 'Noise.'],
];

/**
 * VRC7 の音色。コナミがファミコン用に作った VRC7 に入っていたもの。
 *
 * 実機の VRC7 は 6 声でリズム音源も無いが、ここでは音色表だけを借りている。
 * 使ったゲームは『ラグランジュポイント』1 本だけで、曲ごとにユーザー音色を
 * 差し替えて使っていた。名前は NESdev の一覧から。
 *
 * **5 番と 7 番は YM2413 と中身が同じ。**別の音色にせず、別名だけを足す。
 */
export const VRC7_PRESETS = [
  [1, 'opll::vrc7BuzzyBell', 'lead', 'バジーベル。濁った鐘', 'Buzzy bell, a bell with grit in it.'],
  [2, 'opll::vrc7Guitar', 'lead', 'ギター', 'Guitar.'],
  [3, 'opll::vrc7Wurly', 'lead', 'ウーリッツァー。電気ピアノ', 'Wurlitzer electric piano.'],
  [4, 'opll::vrc7Flute', 'lead', 'フルート', 'Flute.'],
  [6, 'opll::vrc7Synth', 'lead', 'シンセ', 'Synth.'],
  [8, 'opll::vrc7Organ', 'chord', 'オルガン', 'Organ.'],
  [9, 'opll::vrc7Bells', 'lead', 'ベル', 'Bells.'],
  [10, 'opll::vrc7Vibes', 'lead', 'バイブス', 'Vibes.'],
  [11, 'opll::vrc7Vibraphone', 'lead', 'ビブラフォン', 'Vibraphone.'],
  [12, 'opll::vrc7Tutti', 'chord', 'トゥッティ。合奏', 'Tutti, the whole band at once.'],
  [13, 'opll::vrc7Fretless', 'bass', 'フレットレスベース', 'Fretless bass.'],
  [14, 'opll::vrc7SynthBass', 'bass', 'シンセベース', 'Synth bass.'],
  [15, 'opll::vrc7Sweep', 'lead', 'スイープ', 'Sweep.'],
];

/**
 * 割り込まれても分からない音色(`steal: 'ok'`)。**番号で持つ。**
 *
 * ---- 式ではなく、測った結果 ----
 *
 * `steal` は書かなければレジスタから割り出される(`sound/opllvoice.js` の
 * `opllSteal`)。YM2413 の 15 音色だけは測ってあるので、そちらを使う。
 *
 * **1 つだけ食い違う。**トランペット(7)は EG=1 で AR=8(式では 8.3 ミリ秒)
 * なので式は `ok` と言うが、測ると 79 ミリ秒かけて上がる。ビブラートを
 * 持っていて、鳴り始めてからじわじわ育つためで、**レジスタの AR だけでは
 * 出ない**(→ docs/OPLL_ROM_TEST.md の「立ち上がりの速さ」)。
 * フルート(4)とホルン(9)は式でも `avoid` になる。
 *
 * 式が見ていないのはここで、変調する側のエンベロープが動いているあいだは
 * 音色が育ち続ける。測るまで分からない。
 *
 * ---- 境目の 20 ミリ秒 ----
 *
 * **聞いて決めた数ではない。**持続音のうち、立ち上がりが 20 ミリ秒より速い
 * ものを `ok` にした。オルガン(16.0)が入り、ホルン(26.0)が落ちる位置。
 * 耳で確かめる道が無いので、動かす見込みの数として置いてある
 * (→ docs/OPLL_ROM_TEST.md)。
 */
const STEAL_OK = new Set([
  1,   // Violin      持続音、11.5ms
  5,   // Clarinet    持続音、13.4ms
  6,   // Oboe        持続音、14.8ms
  8,   // Organ       持続音、16.0ms
  10,  // Synthesizer 持続音、2.3ms 以下
]);

/**
 * 3 組で中身が同じ音色。**別の音色にせず、別名にする。**
 *
 * 同じ音が 2 つ並んでいると、どちらを書いたかで音が違うのかと迷う。
 * 名前で呼べれば足りるので、別名を足すだけにした(2026-09-26)。
 */
export const OPLL_ALIASES = {
  'opll::clarinet': ['opll::opllpClarinet', 'opll::vrc7Clarinet'],  // 3 組とも同じ
  'opll::trumpet': ['opll::vrc7Trumpet'],                 // YM2413 と VRC7 が同じ
  'opll::vibraphone': ['opll::opllpVibraphone'],          // YM2413 と YMF281B が同じ
};

/**
 * リズム音源。R14 の bit5 を立てると、下 3 チャンネルが打楽器に変わる。
 *
 * **音のチャンネルが 9 本から 6 本に減る。**打楽器を 1 つでも使えばそうなる。
 * 実機がそうなので、こちらもそうする。
 *
 * 高さは実機のドライバと同じ値の決め打ち。スネアとハイハットが同じ
 * チャンネル、タムとシンバルも同じチャンネルなので、別々の高さは持てない。
 */
/**
 * リズム音源の 5 つ。
 *
 * **高さは MML から動かせる。**書いた高さが、そのままチャンネルの高さになる
 * (`sound/opll.js` の `drumHz`)。o4c のままなら、ドライバの値を
 * そのまま書く。割り当て(`#drum`)には `@o` を書けないので、
 * 高さを変えたものはバンドル音色の側で作る。
 *
 * スネアとハイハットはチャンネル 7 を、タムとシンバルはチャンネル 8 を分け合う。
 * 片方を動かすともう片方も動く。バスドラだけは自分のチャンネル(6)を持つ。
 */
export const OPLL_DRUMS = [
  ['bd', 'opll::kick', 'バスドラ。2 オペを両方使う、いちばん厚い打楽器',
    'Bass drum, the only one that gets both operators.'],
  ['sd', 'opll::snare', 'スネア。ノイズと矩形の組み合わせ',
    'Snare, noise crossed with a square.'],
  ['hh', 'opll::hat', 'ハイハット。金物の短いノイズ',
    'Hi-hat, built from the short metallic noise.'],
  ['tom', 'opll::tom', 'タム。素のサイン波に近い',
    'Tom, close to a plain sine.'],
  ['cym', 'opll::cymbal', 'シンバル。ハイハットと位相を分け合う',
    'Cymbal, sharing its phase with the hi-hat.'],
];

/**
 * ユーザー音色で作る打楽器。**リズム音源を使わずに、9 声のまま叩く。**
 *
 * ---- なぜ要るか ----
 *
 * リズム音源(`OPLL_DRUMS`)は、入れた時点でチャンネルが 9 本から 6 本に減る。
 * しかも音色は ROM の 3 つに固定で、減衰も変えられない。だから
 * 「短いハット」と「長いハット」が作り分けられず、タムの音程を動かすと
 * シンバルも道連れになる(スネアとハイハット、タムとシンバルが
 * チャンネルを分け合っているため)。
 *
 * こちらはふつうの音として鳴らすので、チャンネルは減らず、音程も減衰も
 * 音符ごとに書ける。代わりにノイズ源が使えない。
 *
 * ---- ノイズを重ねる前提で作ってある ----
 *
 * PSG のノイズは 3kHz から上を 7 割方うめる。だからこちらで同じところを
 * 作ると、重ねたときに取り合って濁るだけになる。**この 8 つが受け持つのは、
 * ノイズに出せないもの** — 低いところの芯と、叩いた瞬間の立ち上がりと、
 * 音程を持った金物の鳴り。
 *
 * 重ねて測ったときの数字で決めてある(2026-09-29)。
 * キックは重ねても 250Hz 以下が 79% 残り、スネアは単独で 75% が芯になる。
 * ハイハットは**ざらつきを足さないほうが強い** — 重ねたときに効くのは
 * 山と実効値の比で、15 対 13 の比のほうが 16.7 倍、丸い音は 10.8 倍だった。
 * 音色を丸くしたら悪くなったので、ハイハットは手を入れていない。
 *
 * ---- 音程がそのまま音色になる ----
 *
 * 打楽器といっても中身はただの FM 音色なので、**書く高さで音が決まる。**
 * 説明の `Play it at` がその高さ。ずらすと別の打楽器になるので、
 * 太いキックが欲しいなら下げるより `v` を上げるほうが早い。
 *
 * ---- 同時に 2 つは鳴らせない ----
 *
 * 実機のユーザー音色はレジスタ 1 組だけで、こちらもそれに合わせている。
 * **別のユーザー音色を鳴らすと、そのとき鳴っている音の音色まで変わる**
 * (`sound/opll.js` はレジスタ 0x00〜0x07 を書き直し、0 番を使っている
 * チャンネル全部に効く)。だからキックとハイハットを同じ拍に置くと、
 * あとから書いたほうの音色で両方が鳴る。
 *
 * 重なる組み合わせのために、**1 つで 2 役を兼ねる音色**を用意してある
 * (`opll::userKickHat` など)。高さを変えると別の打楽器に聞こえるように
 * 作ってあり、`scaleRate` を立てて高い音ほど短く落ちるようにしてある。
 */
export const OPLL_USER_DRUMS = [
  ['opll::userKick', {
    mod: { ratio: 1, depth: 22, feedback: 4, attack: 15, decay: 15, sustain: 12,
      release: 15 },
    car: { ratio: 0, attack: 15, decay: 7, sustain: 0, release: 7 },
  }, 'Bass drum. The carrier runs an octave below what you write, so the body '
   + 'lands low while the modulator only clicks at the front. The click is kept '
   + 'small on purpose: with noise layered over it, this voice is the body. '
   + 'Play it at o2.'],
  ['opll::userSnare', {
    mod: { ratio: 4, depth: 18, feedback: 6, attack: 15, decay: 13, sustain: 2,
      release: 10, half: true },
    car: { ratio: 1, attack: 15, decay: 10, sustain: 0, release: 8 },
  }, 'Snare. The shell, not the wires: body around 250Hz and a woody crack above '
   + 'it. Lay PSG noise over the top for the snares. Play it at o3.'],
  ['opll::userHatClosed', {
    mod: { ratio: 15, depth: 6, feedback: 7, attack: 15, decay: 10, sustain: 0,
      release: 6, half: true },
    car: { ratio: 13, attack: 15, decay: 15, sustain: 0, release: 15, half: true },
  }, 'Closed hi-hat. Ratios of 15 against 13 give the metal its beating, and the '
   + 'carrier is cut off at once. Play it at o5.'],
  ['opll::userHatOpen', {
    mod: { ratio: 15, depth: 6, feedback: 7, attack: 15, decay: 10, sustain: 0,
      release: 6, half: true },
    car: { ratio: 13, attack: 15, decay: 8, sustain: 0, release: 5, half: true },
  }, 'Open hi-hat. The same metal as the closed one, held on instead of cut. '
   + 'Striking the closed hat chokes it, the way a foot on the pedal does. Play it at o5.'],
  ['opll::userTom', {
    mod: { ratio: 2, depth: 22, feedback: 5, attack: 15, decay: 14, sustain: 8,
      release: 12, half: true },
    car: { ratio: 1, attack: 15, decay: 8, sustain: 0, release: 7 },
  }, 'Tom. Pitched, so the note is the drum \u2014 write o3 for a floor tom and o4 '
   + 'for a rack tom.'],
  ['opll::userKickHat', {
    mod: { ratio: 15, depth: 4, feedback: 7, attack: 15, decay: 15, sustain: 10,
      release: 12, half: true, scaleRate: 1 },
    car: { ratio: 1, attack: 15, decay: 9, sustain: 0, release: 8, scaleRate: 1 },
  }, 'Kick and hi-hat in one voice, for when they fall on the same beat. '
   + 'Write o2 for the kick and o8 for the hat.'],
  ['opll::userKickSnare', {
    mod: { ratio: 3, depth: 16, feedback: 7, attack: 15, decay: 14, sustain: 4,
      release: 11, half: true, scaleRate: 1 },
    car: { ratio: 1, attack: 15, decay: 9, sustain: 0, release: 8, scaleRate: 1 },
  }, 'Kick and snare in one voice. Write o2 for the kick and o4 for the snare.'],
  ['opll::userSnareHat', {
    mod: { ratio: 11, depth: 10, feedback: 7, attack: 15, decay: 13, sustain: 0,
      release: 9, half: true, scaleRate: 1 },
    car: { ratio: 3, attack: 15, decay: 10, sustain: 0, release: 8, half: true,
      scaleRate: 1 },
  }, 'Snare and hi-hat in one voice. Write o4 for the snare and o6 for the hat.'],
];

/**
 * バスドラの高さ違い。**作り分けとして並べる**(`@{opll::kick(low)}`)。
 *
 * ---- なぜ並べるか ----
 *
 * 実機のドライバが決めた高さ(109.2Hz)は高めで、そのままだと軽い。
 * 1 オクターブ下げると腹に来る音になる。曲の側で `#bundle` に `@o` を
 * 書けば同じことができるが、よく使う 3 つは名前で呼べるほうが早い。
 *
 * ユーザー音色を使わないので、**ほかの音色と取り合わない。**
 * バスドラは自分のチャンネル(6)を持っているので、ほかの打楽器の高さにも
 * 影響しない。
 *
 * ---- 半音の数が o4c から数えた値になっている ----
 *
 * 書いた高さがそのままチャンネルの高さになるので(→ `sound/opll.js` の
 * `drumHz`)、ずらす量はドライバの高さからではなく o4c から数える。
 * `mid` だけは 0 にしてある。何も書かなければドライバの値が残るので、
 * そこがいちばん正確(109.2Hz ちょうど)。
 *
 * 半音は整数なので、`low` と `high` はドライバの高さのちょうど
 * 1 オクターブ上下にはならない。55.0Hz と 220.0Hz で、13 セントずれる。
 * バスドラでは聞き分けられない差なので、音名に乗るほうを取った
 * (2026-10-28)。
 */
const OPLL_KICK_VARIANTS = [
  ['low', -27, 'An octave below the driver, 55.0Hz. Heavy and slack; it sits under everything.'],
  ['mid', 0, 'The pitch the real driver used, 109.2Hz. Tight and light.'],
  ['high', -3, 'An octave above the driver, 220.0Hz. Hard and small. '
    + 'Lay noise over it and it reads as a snare.'],
];

/**
 * 矩形波に寄せたユーザー音色。**PSG の代わりに使う。**
 *
 * ---- なぜ要るか ----
 *
 * PSG のチャンネルをノイズのために空けたいことがある。旋律を OPLL へ移せば
 * 空く。そのときに「いつもの矩形波」で鳴ってほしい。
 *
 * ---- 寄せただけ ----
 *
 * **デューティー比そのものを作っているのではない。**OPLL の 2 オペで、
 * 矩形波の最初の 16 倍音の振幅に近い形を探したもの。位相と波形の形は
 * 合わせていないし、全音域で合わせたものでもない。
 *
 * ---- 音量が小さい ----
 *
 * 同じ `v` で鳴らすと、矩形波よりかなり小さい。鳴らして測った実効値の差
 * (持続音 C3/C4/E4/G4/C5 を `v12` で)。
 *
 * | | 差 | 振幅比 |
 * | --- | --- | --- |
 * | 12.5% | 16.7dB | 6.80 倍 |
 * | 25% | 12.2dB | 4.06 倍 |
 * | 50% | 7.3dB | 2.31 倍 |
 *
 * **この倍率を `v` の全域へそのまま当てられない。**OPLL は 1 段 3dB の減衰、
 * 矩形波は別の曲線なので、段ごとに差が変わる。出口のゲインで直すのは
 * 実機のレジスタを動かすのとは別の話で、実機のデータには乗らない
 * (→ [docs/LOUDNESS.md](../docs/LOUDNESS.md) の `#gain`)。
 *
 * ---- 同時に 1 種類 ----
 *
 * 実機のユーザー音色はレジスタ 1 組だけ。同じ音色なら何チャンネルでも
 * 鳴らせるが、**この 3 つを同時に別々には使えない**(ほかのユーザー音色と同じ)。
 */
const OPLL_PULSES = [
  ['12', [33, 33, 14, 30, 240, 240, 7, 7], 0.279,
    'Aimed at a 12.5% pulse: thin and nasal. Two operators matched against the first '
    + 'sixteen partials, not a real duty cycle. About 16.7dB quieter than pulse(12) at the '
    + 'same v, so raise it or lower the rest.'],
  ['25', [33, 33, 14, 29, 240, 240, 7, 7], 0.468,
    'Aimed at a 25% pulse: reedy, the common all-round chip voice. Two operators matched '
    + 'against the first sixteen partials, not a real duty cycle. About 12.2dB quieter than '
    + 'pulse(25) at the same v.'],
  ['50', [34, 33, 32, 7, 240, 240, 7, 7], 0.817,
    'Aimed at a square wave: hollow and even. Two operators matched against the first '
    + 'sixteen partials, not a real duty cycle. About 7.3dB quieter than pulse(50) at the '
    + 'same v.'],
];

/**
 * 最初から入れておく。**二度呼ばれても止まらない**(理由は tones.js の同じところ)
 */
/**
 * OPLL の音量の持ちかた。**1 段 3dB で 16 段。**
 *
 * チップの音量レジスタがそうなっている。書いた `v` はそのままレジスタへ行く
 * (`sound/audio.js` の opll のところ)ので、鳴りは変わらない。
 * 名乗るのは、音量を合わせる層が曲線を取り違えないようにするため
 * (`tool/core/volmap.js`)。名乗らないと、既定の `curve`((v/15)^1.8)として
 * 数えられて、低い `v` ほど実際より大きいものとして扱われる(2026-10-08)。
 */
// OPLL はどれも実機の 8 バイトから鳴らしているので、まとめて版 1
// (ユーザー音色のドラムだけは、下で `0.1` に戻している)
const OPLL_VOL = { vcurve: '3db', vsteps: 16, version: '1.00' };

/**
 * チョッパーベース。**高さを変えても質が変わらない。**
 *
 * ---- どこから来たか ----
 *
 * MARBLE SHIFT の HOOK を OPN(`fm2Lead` + `tap`)から OPLL へ移すときに
 * 作ったもの(2026-10-09)。側波の並びを 220Hz きざみで 18kHz まで見て合わせた。
 *
 * ---- KSR を切ってある ----
 *
 * **変調側だけ KSR を立てると、オクターブごとに別の音になる。**
 * 立てていたときは o3 と o4 だけ 1.5 と 3.5 の倍音が立ち、4.0 と 6.0 が
 * 下がっていた。高さを上げるとねじれて聞こえるのがこれで、どちらも 0 に
 * すると o2 から o5 までほぼ同じ質になる(測った)。
 *
 * ---- 書く高さは 1 オクターブ下 ----
 *
 * 比 2.5(mod ML 5 / car ML 2)で、キャリアが 2 倍。だから `o3 a` と書くと
 * 440Hz で鳴る。
 */
const OPLL_CHOP_BASS = [5, 2, 19, 0, 176, 182, 3, 89];

export function registerOPLLPresets() {
  for (const [inst, name, role, descJa, desc] of OPLL_PRESETS) {
    try {
      registerOPLL(name, inst, { ...OPLL_VOL, role, tags: ['msx'],
        descJa: `${descJa}。YM2413 の ${inst} 番`, desc,
        steal: STEAL_OK.has(inst) ? 'ok' : 'avoid',
        alias: OPLL_ALIASES[name] });
    } catch (e) { /* すでに入っている */ }
  }
  // VRC7 は OPLL と同じ 2 オペレータだが、載っていたのはファミコンのカセット。
  // 機種のタグは `nes` になる
  for (const [set, list, machine] of [[2, OPLLP_PRESETS, 'msx'], [1, VRC7_PRESETS, 'nes']]) {
    for (const [inst, name, role, descJa, desc] of list) {
      // `steal` は書かない。`registerOPLL` が 8 バイトから割り出す
      try { registerOPLL(name, inst, { ...OPLL_VOL, role, set, tags: [machine], descJa, desc }); }
      catch (e) { /* すでに入っている */ }
    }
  }
  for (const [drum, name, descJa, desc] of OPLL_DRUMS) {
    // バスドラは高さ違いを並べる。名前は作り分けの形(`opll::kick(low)` など)
    if (drum === 'bd') {
      try {
        registerFamily(name, {
          desc: 'The OPLL rhythm bass drum, at three pitches. The chip holds one pitch per '
            + 'channel, but the bass drum has channel 6 to itself, so moving it leaves the '
            + 'other drums alone.',
          params: [{
            name: 'pitch', default: 'mid',
            desc: 'How far from the pitch the real driver used.',
            values: OPLL_KICK_VARIANTS.map(([value, , vn]) => ({ value, desc: vn })),
          }],
        });
      } catch (e) { /* すでに入っている */ }
      for (const [value, semi, vn] of OPLL_KICK_VARIANTS) {
        try {
          registerOPLL(`${name}(${value})`, 16, { ...OPLL_VOL, role: 'perc', drum, semi,
            tags: ['msx'],
            descJa: `${descJa}。使うと音のチャンネルが 9 本から 6 本に減る`,
            desc: `${desc} ${vn}` });
        } catch (e) { /* すでに入っている */ }
      }
      continue;
    }
    try {
      registerOPLL(name, 16, { ...OPLL_VOL, role: 'perc', drum, tags: ['msx'],
        descJa: `${descJa}。使うと音のチャンネルが 9 本から 6 本に減る`, desc });
    } catch (e) { /* すでに入っている */ }
  }
  // 矩形波に寄せたもの。作り分けの形(`opll::pulse(25)`)で並べる。
  // `pulse(12|25|50)` と同じ幅の書き方にしてあるので、差し替えるときに
  // 幅をそのまま書ける
  try {
    registerFamily('opll::pulse', {
      desc: 'The OPLL standing in for a pulse wave, so a PSG channel can be freed for noise. '
        + 'Two operators matched against the first sixteen partials of a pulse; the duty '
        + 'cycle itself is not reproduced. Quieter than the real pulse at the same v \u2014 '
        + 'how much is in each width. The chip holds one user voice at a time, so these '
        + 'three cannot sound independently at once.',
      params: [{
        name: 'width', default: '50',
        desc: 'Which pulse width it aims at, in percent. The same values pulse() takes.',
        values: OPLL_PULSES.map(([value, , , vn]) => ({ value, desc: vn })),
      }],
    });
  } catch (e) { /* すでに入っている */ }
  for (const [width, bytes, gain, desc] of OPLL_PULSES) {
    try { registerOPLLVoice(`opll::pulse(${width})`, { bytes },
      { ...OPLL_VOL, gain, role: 'lead', tags: ['msx'], desc }); }
    catch (e) { /* すでに入っている */ }
  }
  // チョッパーベース。ユーザー音色をひとつ。
  try {
    registerOPLLVoice('opll::chopBass', { bytes: OPLL_CHOP_BASS }, { ...OPLL_VOL, role: 'bass',
      tags: ['msx'],
      desc: 'A chopper bass: a short biting pluck that keeps the same tone across octaves. '
        + 'Modulator ML 5 against carrier ML 2, a 2.5 ratio, so the written pitch sounds an '
        + 'octave higher. KSR is off on both operators, which is what keeps o2 and o5 the '
        + 'same as o3 and o4. Matched against a 2-operator OPN lead, sidebands read every '
        + '220Hz up to 18kHz. The chip holds one user voice at a time.' });
  } catch (e) { /* すでに入っている */ }
  // 日本語の説明は持たせない。データの中に置かず、外で突き合わせる
  // (CLAUDE.md、2026-09-28)
  // **まだ聞き込んでいない。**8 つとも 2026-09-29 に足したもので、重ねて測った
  // 数字では決めてあるが、曲の中で鳴らして選び直していない。実際、タムは
  // 内蔵の `opll::opllpTomTom` と比べて実効値が半分以下だった(2026-09-30 に測った)。
  // `check` を立てて、一覧の絞り込みから引けるようにしておく
  for (const [name, spec, desc] of OPLL_USER_DRUMS) {
    try { registerOPLLVoice(name, spec, { ...OPLL_VOL, role: 'perc', tags: ['msx'], desc,
      // まだ聞き込んでいないので、版は上げない(上の覚え書き)
      version: '0.1', dev: ['check'] }); }
    catch (e) { /* すでに入っている */ }
  }
}

// 読み込むと音色が並ぶ。エンジンのプリセットとして扱う
registerOPLLPresets();
// OPLL を重ねた合成音色(layerKickAir など)は、OPLL が入ってから並ぶ
registerDefaultLayers();
sealPresets();
