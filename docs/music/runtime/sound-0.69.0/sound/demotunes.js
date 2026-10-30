// 音を確かめるための曲と、最初から入っている SE。
// **サウンド側に持つ**(ゲームの素材ではなく、道具のため)。
// サウンドテストの「音色」欄などから鳴らす。
//
//   import { demoFor, scaleDemo } from './engine/demotunes.js';
//   mmsxx.audio.defineBGM('tone_saw', demoFor('saw'));
//   mmsxx.audio.defineBGM('scale', scaleDemo(['pulse(50)', 'saw']));
//
// **打楽器の音色にドレミを鳴らしても何も分からない**ので、
// 名前が打楽器のもの(fmDrum...)には、代わりにリズムの曲を鳴らす。
// どちらを鳴らすかは `demoFor()` が名前を見て決める。

import { isDrumTone } from './fmpresets.js';
import { WAVEFORMS } from './mml.js';

// ---- 最初から入っている SE ----
//
// **どのゲームでも同じであってほしい音**だけを置く。見本の曲と同じ扱いで、
// ゲームの素材ではなくサウンド側の持ち物。名前に `.` を入れてあるのは、
// ゲームが `defineSE()` で登録する名前と**絶対にぶつからない**ようにするため。

/**
 * ポーズの出入りで鳴る音。
 *
 * 初期のコナミのファミコン作品を手本にした、「ぽろろん」と鳴る短いジングル。
 * **矩形波(50%)で C の和音を分散させた 3 音**。
 * e → g → 1 オクターブ上の c と少しずつずらして重ね、
 * 鳴らしっぱなしにして**最後は和音として響かせる**。
 *
 * 和音の音だけを下から順に積むので、鳴らしているものが**和音だと分かる**。
 * 締めを root(c) にしてあるのがきもで、3rd や 5th で終わると
 * 途中で切れたように聞こえ、合図として落ち着かない。
 *
 * 3 音を順に切り替えるとハープを弾いたようにはならず、
 * ただの上昇音 = 効果音に聞こえる。**声を分けて、あとの音が入っても
 * 前の音を切らない**のがジングルらしさの正体。
 * 音を伸ばしたいので、切れのよい percussive ではなく余韻の残る piano。
 * ゲートは q6。音の枠の終わりまで鳴らしきる(q8)と切れ際が詰まるので、
 * **うしろに余白を残して**鳴り終わらせる。
 *
 * **輪郭を立てようとして flat にしてはいけない。** 鳴っているあいだ
 * 音量が落ちなくなるぶん 3 声が対等に鳴りつづけ、うるさくなる。
 * ここは減衰させて、あとの音ほど前の音に埋もれていくのが正しい。
 * 全体で 0.6 秒ほど。ポーズは**ゲームが止まる合図**なので、
 * これより長くすると止まったことが分かりにくくなる。
 */
export const SE_SYS_PAUSE = 'sys.pause';

/** 最初から `defineSE()` しておくもの。ChipTuneSound が作られるときに入る */
export const SYSTEM_SE = {
  [SE_SYS_PAUSE]: [
    '@{pulse(50)} @e{piano} @s{8,6} q6 t200 v12 o5 l16 e4.',
    '@{pulse(50)} @e{piano} @s{8,6} q6 t200 v10 o5 l16 r g4.',
    '@{pulse(50)} @e{piano} @s{8,7} q6 t200 v8  o5 l16 r r > c4.',
  ],
};

/**
 * 音階 1 回ぶん。`w` の音色で上って下りる。
 * **音の高さの並びはドレミのまま**で、譜割りだけ工夫して曲に聞こえるようにした
 * (上りは付点で跳ね、頂上を伸ばし、下りは走って最後に落ち着く)
 */
const SCALE_RUN = (w) => `@{${w}} o4 c8. d16 e8 f8 g4 a8 b8 `
  + '> c4. < b8 a8 g8 f8 e8 d4 c4 r4 ';

/**
 * 音色を次々に替えながらドレミを鳴らす 1 本の曲。聞き比べ用。
 * @param {string[]} names 順に鳴らす音色の名前
 */
export function scaleDemo(names) {
  // **打楽器は音程が無いので、この曲からは外す。**
  // **ロールで見る** — 名前で見ると、`fmDrum` で始まらない打楽器
  // (合成音色の `layerKickAir` など)がドレミを鳴らすことになる
  const tuned = names.filter((w) => roleFor(w) !== 'perc');
  // **頭で @e{soft} を着せるのをやめた。**音色を書くとエンベロープはその音色の
  // ものへ戻るので、1 回書いても最初の音色にしか効かない。
  // **聞き比べる曲なので、そのほうが正しい** — どの音色も自分の姿で鳴る
  return ['t150 q7 v12 l8 ' + tuned.map(SCALE_RUN).join('')];
}

// ---- 打楽器の音色を聞くための曲 ----
// **同じ音色を高さ違いで 3 本**鳴らして、ひと組の太鼓に仕立てる。
// 低い = 胴の太鼓 / 中 = 締め太鼓 / 高い = 刻み。実機のリズム音源も
// これと同じ考えかたで、1 つの音を高さと長さで打ち分けていた。
//
// 1 小節 = 16 分音符 16 個ぶん。4 小節めと 8 小節めがオカズ(手数を増やす)。
const DRUM_LOW = ['c4 r4 c8 c16 c16 r4', 'c4 r4 c8 c16 c16 r4',
  'c4 r4 c8 c16 c16 r4', 'c4 r4 c8 c8 c8 c8'];
const DRUM_LOWMID = ['r4 c8 r8 r4 c8 r8', 'r4 c8 r8 r4 c8 r8',
  'r4 c8 r8 r4 c8 r8', 'r4 c8 r8 r2'];
const DRUM_MID = ['r4 c4 r4 c4', 'r4 c4 r4 c4',
  'r4 c4 r4 c4', 'r4 c4 r8 c16 c16 c16 c16 c16 c16'];
const DRUM_MIDTOP = ['r8 c8 r8 c8 r8 c8 r8 c8', 'r8 c8 r8 c8 r8 c8 r8 c8',
  'r8 c8 r8 c8 r8 c8 r8 c8', 'r8 c8 r8 c8 r8 c8 c16 c16 c8'];
const DRUM_TOP = ['c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16',
  'c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16',
  'c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16',
  'c8 c16 c16 c8 c16 c16 c4 r4'];

/**
 * **打楽器の音色**で作った小曲。ドレミの代わりにこちらを鳴らす。
 *
 * 高さを 5 つに分けて叩き分けるので、その音色が太鼓に向くかどうかが分かる。
 * **1 オクターブずつ上げる**(o2 から o6)。打楽器は高さがそのまま音色になるので、
 * 刻みを細かくするほど上へ置くと、同じ音色の受け持ちの幅が見える。
 *
 * 置き場を分けてある。低いほうは拍の頭、上へ行くほど裏と細かい刻みへ寄せる。
 * 全部が同じところで鳴ると、どの高さの音か聞き分けられない。
 *
 * @param {string} w 音色の名前
 * @returns {string[]} 5 本のトラック(低い / やや低い / 中くらい / やや高い / 高い)
 */
export function drumDemo(w) {
  const two = (list) => list.join(' ') + ' ' + list.join(' ');   // 8 小節にする
  const head = (v) => `t150 q8 v${v} l16 @{${w}} @e{percussive}`;
  return [
    `${head(13)} o2 ` + two(DRUM_LOW),
    `${head(12)} o3 ` + two(DRUM_LOWMID),
    `${head(11)} o4 ` + two(DRUM_MID),
    `${head(9)} o5 ` + two(DRUM_MIDTOP),
    `${head(7)} o6 ` + two(DRUM_TOP),
  ];
}

// ---- 打楽器を全部使った曲 ----
// **5 つの音色を 1 曲に組む**。それぞれの受け持ちは、ふつうのドラムセットと同じ。
//   キック = 土台 / スネア = 2 拍 4 拍 / タム = オカズ /
//   リム = 裏の刻み / シンバル = 刻みと決め
//
// 16 小節。導入 - たたき台 - オカズ - 手数を増やす - 抜き - 追い込み - 締め。
// 1 小節 = 16 分音符 16 個ぶん。どの声も 1 小節ぴったりに収める。
const KIT_KICK = [
  'r1',                                   // 1  導入(リムだけ)
  'c4 r4 c8 c16 c16 r4',                  // 2
  'c4 r4 c8 c16 c16 r4',                  // 3  たたき台
  'c8 c16 c16 r4 c8 r8 c8 r8',            // 4
  'c4 r4 c8 c16 c16 r4',                  // 5
  'c8 c16 c16 r4 c8 r8 c8 r8',            // 6
  'c4 r4 c8 c16 c16 r4',                  // 7
  'c4 r4 r2',                             // 8  オカズに場所をゆずる
  'c8 c16 c16 r4 c8 r8 c8 r8',            // 9  手数を増やす
  'c8 c16 c16 r4 c8 r8 c8 r8',            // 10
  'c8 c16 c16 r4 c8 r8 c8 r8',            // 11
  'c4 r4 c8 c8 c4',                       // 12
  'c4 r4 c4 r4',                          // 13 抜き(タムが歌う)
  'c4 r4 c4 r4',                          // 14
  'c8 c8 c8 c8 c8 c8 c8 c8',              // 15 追い込み
  'c4 r4 r2',                             // 16 締め
];

const KIT_SNARE = [
  'r1',                                   // 1
  'r1',                                   // 2
  'r4 c4 r4 c4',                          // 3
  'r4 c4 r4 c4',                          // 4
  'r4 c4 r4 c4',                          // 5
  'r4 c4 r8 c8 c8 c8',                    // 6
  'r4 c4 r4 c4',                          // 7
  'c16 c16 c16 c16 c8 c8 c16 c16 c16 c16 c8 c8',  // 8  オカズ
  'r4 c4 r4 c4',                          // 9
  'r4 c4 r8 c8 c8 c8',                    // 10
  'r4 c4 r4 c4',                          // 11
  'r4 c4 r8 c8 c8 c8',                    // 12
  'r1',                                   // 13 抜き
  'r1',                                   // 14
  'c16 c16 c16 c16 c8 c8 c16 c16 c16 c16 c8 c8',  // 15
  'c4 r4 r2',                             // 16
];

// タムは高さを変えて打ち分ける(高いタム o4 / 低いタム o3)
const KIT_TOM = [
  'r1', 'r1', 'r1', 'r1', 'r1', 'r1', 'r1',
  'r2 o4 c8 c8 o3 c8 c8',                 // 8  スネアのオカズに続けて落とす
  'r1', 'r1', 'r1',
  'o4 c8 c8 c8 c8 o3 c8 c8 c8 c8',        // 12
  'o4 c8 c16 c16 o3 c8 c16 c16 o4 c8 o3 c8 c4',   // 13 抜き。タムが歌う
  'o4 c8 c16 c16 o3 c8 c16 c16 o4 c4 o3 c4',      // 14
  'o4 c8 c8 c8 c8 o3 c8 c8 c8 c8',        // 15
  'r1',                                   // 16
];

// リムは裏を刻む。導入では拍を数える役
const KIT_RIM = [
  'c8 c8 c8 c8 c8 c8 c8 c8',              // 1  数える
  'r8 c16 r16 r4 r8 c16 r16 r4',
  'r8 c16 r16 r4 r8 c16 r16 r4',
  'r8 c16 r16 r4 r8 c16 r16 r4',
  'r8 c16 r16 r4 r8 c16 r16 r4',
  'r8 c16 r16 r4 r8 c16 r16 r4',
  'r8 c16 r16 r4 r8 c16 r16 r4',
  'r1',                                   // 8  オカズのじゃまをしない
  'r8 c16 r16 r4 r8 c16 r16 r4',
  'r8 c16 r16 r4 r8 c16 r16 r4',
  'r8 c16 r16 r4 r8 c16 r16 r4',
  'r1',
  'r1', 'r1', 'r1',                       // 13-15 抜きと追い込みは休む
  'r1',
];

// シンバルは刻み(o6)と、決めの一発(o5 の長い音)を持ち替える
const KIT_CYM = [
  'o5 c4 r4 r2 o6',                       // 1  頭の一発
  'c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16',
  'c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16',
  'c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16',
  'c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16',
  'c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16',
  'c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16',
  'r1',                                   // 8
  'o5 c4 o6 r4 c8 c16 c16 c8 c16 c16',    // 9  ここから 16 分の刻み
  'c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16',
  'c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16',
  'c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16',
  'r1', 'r1',                             // 13-14 抜き
  'c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16',
  'o5 c4 r4 r2 o6',                       // 16 締めの一発
];

/**
 * **打楽器を全部使った曲**。5 つの音色がそれぞれの役を持つ。
 * 音色を確かめるだけでなく、組にしたときの鳴りを聞くためのもの。
 * @returns {string[]} 5 本のトラック(キック / スネア / タム / リム / シンバル)
 */
export function drumKitDemo() {
  // **@e は音色より後ろに書く。**前に書くと、音色を書いた時点で
  // その音色のエンベロープへ戻ってしまう
  const T = 't150 q8 l16';
  return [
    `${T} v13 @{opll::kick} @e{percussive} o4 ` + KIT_KICK.join(' '),
    `${T} v11 @{opll::snare} @e{percussive} o4 ` + KIT_SNARE.join(' '),
    `${T} v11 @{opll::tom} @e{percussive} o4 ` + KIT_TOM.join(' '),
    `${T} v8 @{opll::hat} @e{percussive} o5 ` + KIT_RIM.join(' '),
    `${T} v6 @{opll::cymbal} @e{percussive} o6 ` + KIT_CYM.join(' '),
  ];
}

/** 音色を名前で引く(大文字小文字は見ない) */
const waveByName = (w) =>
  WAVEFORMS.find((x) => String(x.name).toLowerCase() === String(w).toLowerCase());

/**
 * その音色のロール。**書いていなければ名前で見当をつける。**
 *
 * 名前で決めるのはやめたい — `opll::synthBass` が低音だと分かるのは
 * たまたま名前にそう書いてあるからで、自分で足した音色には効かない。
 * だからロールを見る。名前を見るのは、ロールの無い音色への逃げ道として残す
 */
function roleFor(w) {
  const wf = waveByName(w);
  if (wf && wf.role) return wf.role;
  return isDrumTone(w) ? 'perc' : 'lead';
}

/** フレームごとの表を持っているか(高さ・音量・幅・ビブラートのどれか) */
function hasTable(w) {
  const t = (waveByName(w) || {}).tone;
  return !!(t && (t.arp || t.pitch || t.vol || t.duty || t.vib));
}

/**
 * その音色に合う小曲を返す。**ロールで振り分ける。**
 *
 * | ロール | 鳴らすもの |
 * | --- | --- |
 * | `perc` `noise` | リズム。ドレミを鳴らしても何も分からない |
 * | `bass` | ベースの動き。低いところでしか出ない癖がある |
 * | `chord` | 和音。重ねたときの濁りが分かる |
 * | それ以外 | ドレミの上り下り |
 *
 * **表を持つ音色には、頭に伸ばした 1 音を足す。**
 * 表は音の長さで割らずに 1 フレームずつ進むので、8 分音符では
 * 1 段か 2 段しか鳴らない。**動きが本体の音色は、伸ばさないと何も分からない**
 * (幅の表は 24 フレーム = 0.4 秒で 1 周する)。
 *
 * @param {string} w 音色の名前
 */
export function demoFor(w) {
  const role = roleFor(w);
  // **カセットの音は、鳴らしかたを書かないと鳴らない。**
  // `=` の命令(パイロット / データ)を使ったときだけテープの音になるので、
  // ドレミを渡すと**長さだけ進んで無音**になる。読み込みの様子をそのまま置く
  // 区間を開けるのはカセットの音色だけ。ビープの効果音(beep(tar) など)は
  // ふつうの音符で鳴るので、こちらへ来ない
  if (role === 'se' && ((waveByName(w) || {}).special || []).includes('tape')) {
    return tapeDemo(w);
  }
  if (role === 'se') return seDemo(w);
  if (role === 'perc' || role === 'noise') return drumDemo(w);
  const body = role === 'bass' ? bassDemo(w)
    : role === 'chord' ? chordDemo(w)
      : toneDemo(w);
  return hasTable(w) ? withHold(w, body) : body;
}

/**
 * **曲の部品ではない音**で作った見本。
 *
 * 旋律を弾かせても意味が無く、リズムに並べても意味が無い。
 * **1 回鳴らして、間を置いて、高さを変えてもう一度** — 効果音の聞き方をする。
 * @param {string} w 音色の名前
 * @returns {string[]} 1 本のトラック
 */
/**
 * **カセットから読み込んでいる音**そのもの。
 *
 * 長いパイロット(連続音) → 見出しの記録 → 一息 → 短いパイロット → 中身、
 * という並びが実機の順番で、**この順番でないとテープに聞こえない**。
 * `?` は中身がでたらめなので、続けて置いたものどうしは違う音になる。
 *
 * @param {string} w 音色の名前(ビープ音源でないと鳴らない)
 * @returns {string[]} 1 本のトラック
 */
export function tapeDemo(w) {
  return [
    `t120 q8 v10 @e{flat} @{${w}}{ @baud 1200 @seed 1 `
    + '=3 '                              // 長いパイロット   ぴーーーー
    + '@bytes ff ?1 '                    // 見出しの頭       が！
    + '@bytes random ?4 '                // 見出しの中身     ががが
    + 'r2 '                              // FILE FOUND が出ていたところ
    + '=1 '                              // 中身の前の短いパイロット ぴー
    + '@bytes 00 ?1 @bytes random ?6 '   // 中身。途中で並びが変わる ががー
    + '@bytes 55 ?2 @bytes random ?4 '   //                         ぴぴー
    + '@bytes ff ?1 @bytes random ?6 '
    + '@bytes aa ?1 }',
  ];
}

export function seDemo(w) {
  return [
    `t120 q8 v13 @{${w}} @e{flat} `
    + 'o4 c2 r2  o5 c2 r2  o3 c2 r2  o4 c4 r4 o5 c4 r4  o4 c1',
  ];
}

/** 伸ばした 1 音を頭に足す。**ほかの声は同じ長さだけ休む**(ずれないように) */
function withHold(w, tracks) {
  const hold = `t138 q8 v12 @{${w}} @e{flat} o4 c1 c1 `;
  const rest = 't138 q8 r1 r1 ';
  return tracks.map((t, i) => (i === 0 ? hold : rest) + t);
}

/**
 * **ベースの音色**で作った小曲。低いところを走る線と、根音を伸ばす線。
 * 低音は上のほうと鳴りが違う(倍音が少ないので、形の差が出にくい)ので、
 * 実際に使う高さで聞けるようにしてある。
 * @param {string} w 音色の名前
 * @returns {string[]} 2 本のトラック(走る / 伸ばす)
 */
export function bassDemo(w) {
  return [
    `t150 q7 v12 l8 @{${w}} @e{flat} ` + BEAT_BASS,
    `t150 q8 v8 @{${w}} @e{soft} ` + BEAT_ROOT,
  ];
}

/**
 * **和音の音色**で作った小曲。3 声を重ねて C - Am - F - G を回す。
 * 前半は伸ばして響きを、後半は刻んで切れを聞く。
 * **1 声だけでは分からないこと**(重ねたときの濁り)がここで出る。
 * @param {string} w 音色の名前
 * @returns {string[]} 3 本のトラック(下 / 中 / 上)
 */
export function chordDemo(w) {
  const head = (v) => `t120 q7 v${v} @{${w}} @e{soft} `;
  return [
    head(11) + 'o3 c1 o3 a1 o3 f1 o3 g1 '
      + 'l4 o3 c c c c o3 a a a a o3 f f f f o3 g g g g ',
    head(9) + 'o3 e1 o4 c1 o3 a1 o3 b1 '
      + 'l4 o3 e e e e o4 c c c c o3 a a a a o3 b b b b ',
    head(8) + 'o3 g1 o4 e1 o4 c1 o4 d1 '
      + 'l4 o3 g g g g o4 e e e e o4 c c c c o4 d d d d ',
  ];
}

/**
 * **1 つの音色だけ**で作った小曲。音色そのものの表情を聞くためのもの。
 * ドレミの上り下りを土台にして、低いベースを敷き、後半は 3 度のハモリを重ねる。
 * どの音色でも同じ曲が鳴るので、音の違いだけを聞き比べられる。
 *
 * **最後に長く伸ばす。**刻んでいるあいだは分からないことが、
 * 伸ばすと出てくる — 減っていくのか、平らに続くのか、途中で揺れ出すのか。
 * 音色の表情のうち**いちばん長い時間の話**なので、短い音だけでは聞けない。
 * 3 本そろえて和音のまま伸ばすので、重なりの濁りもここで分かる。
 *
 * @param {string} w 音色の名前(`@{名前}` で呼べるもの)
 * @returns {string[]} 3 本のトラック(主旋律 / ベース / ハモリ)
 */
export function toneDemo(w) {
  // **伸ばすところは q8。**手前は q7 で切っているが、伸ばす音まで切ると
  // 終わりに隙間が空いて、余韻を聞きたいところで途切れる
  const HOLD = 'q8 l1 ';
  return [
    // 主旋律。前半はドレミの上り下り、後半は少し跳ねて終わる
    `t138 q7 v12 l8 @{${w}} @e{soft} `
    + 'o4 c8. d16 e8 f8 g4 a8 b8  > c4. < b8 a8 g8 f8 e8 d4 c4 '
    + 'o4 e8. f16 g8 a8 > c4 < b8 a8  g4. e8 g8 a8 g8 e8 d2 '
    // **主音へ落として伸ばす。**手前が d2(2 度)なので、ここで解決する
    + HOLD + 'o4 c&c ',
    // ベース。1 オクターブ下で拍を刻む(音色は主旋律と同じ)。
    // **最後の 1 小節は締め。**これが無いと主旋律より 1 小節短い
    `t138 q6 v10 l8 @{${w}} @e{flat} `
    + 'o2 c4 g4 c4 g4  c4 g4 c4 g4 '
    + 'o2 a4 e4 f4 c4  g4 > d4 < g4 g4 '
    + 'o2 c4 g4 c2 '
    + HOLD + 'o2 c&c ',
    // ハモリ。**後半だけ**鳴る(前半は休み)。主旋律の 3 度下。
    // **休みは 2 小節半。**主旋律が 1 つめの句を終えるのがそこ
    `t138 q7 v8 l8 @{${w}} @e{soft} `
    + 'r1 r1 r2 '
    + 'o3 c8. d16 e8 f8 a4 g8 f8  e4. c8 e8 f8 e8 c8 b2 '
    // 3 度。**和音のまま伸びる**ので、重なったときの濁りがここで出る
    + HOLD + 'o3 e&e ',
  ];
}


// ---- リズムの曲(打楽器の使いかたの見本) ----
// `drumKitDemo()` が「打楽器を 1 つずつ確かめる」ものなのに対して、
// こちらは**曲として組んだときの見本**。ゲームからも BGM として使える。
//
//   mmsxx.audio.defineBGM('beat', beatTune());
//
// ここで見せたいのは 2 つ。
//
// **ベースは 2 本重ねる。** 波形メモリ(SCC にあたるもの)が 8 分で走り回り、
// 三角波が根音を伸ばす。走るほうだけだと軽すぎ、伸ばすほうだけだと重い。
//
// **FM の打楽器はどれも線が細いので、ほかの音を重ねて厚みを出す。**
//   ノイズ … 低い音でバスドラの胴、中くらいでスネアの砂、高い音でシンバル
//   矩形波 … 16 分の裏に小さな粒を置いて、刻みを細かく聞かせる
// 重ねる音は**それだけ聞くと意味が無いくらい小さく**しておくこと。
// 前に出ると、打楽器の音色そのものが変わって聞こえてしまう。
//
// ---- 重ねはバンドル音色で書く(2026-09-18) ----
//
// 前はノイズを 1 本のチャンネルに分けて書いていた。バスドラとスネアと
// シンバルの位置へ、同じリズムをもう一度書き写す形になる。
// **書き写したほうがずれた。**フィルの小節でバスドラとスネアを書き換えたとき、
// ノイズの行を直し忘れて、バスドラの 8 発とスネアの 6 発が裸のまま鳴っていた。
//
// バンドル音色(`#bundle`)にすると、位置は 1 か所にしかないのでずれない。
// 重ねた音符には同じ通し番号が付くので、声が足りないときに添え物から落とせるし、
// 書き出し先でも「同じ楽器が 2 声を食う」と言える。
//
// **シンバルだけは合わせられない。**8 発のうち 3 発にしか空気を足していない。
// 全部に足すと音が変わるので、空気つきと素の 2 つを持って、打つたびに選ぶ。

/**
 * 小節を 2 つずつ 1 行にしてつなぐ。
 *
 * MML は空白も改行も読み飛ばすので、どこで折っても音は変わらない。
 * 1 行にまとめると横へ数百字伸びて、画面で読むのに横へ送ることになる。
 */
const wrap = (bars, per = 2) => {
  const out = [];
  for (let i = 0; i < bars.length; i += per) out.push(bars.slice(i, i + per).join(' '));
  return out.join('\n');
};

// ---- バンドル音色。1 か所にまとめて、いちばん上のチャンネルに置く ----
//
// 指示行はチャンネルをまたいで効く(`shareBundles`)ので、どこに書いても届く。
// 散らして書くと、どの音が何と重なっているのかを探して回ることになる。
//
// **添え物には `snap` を着せる。**重ねる音は本体と同じ長さになるが、
// 重ねる 2 つの長さが違うのはよくあることなので、長さではなく形で決める。
// `percussive` は 0.25 秒かけて落ちるので、本体が長いとそのぶん空気も伸びて
// 前へ出てくる。`snap` は 0.06 秒で落ちきるので、音符の長さに引きずられない。
// 合成音色の `layerKickAir` も同じ選び方をしている(2026-09-18)。
//
// **重ねないものも書く。**`@{opll::trumpet} @e{soft}` のような着せ替えに名前が付くと、
// 本文は `@{beatBrass}` だけになり、どのチャンネルが何を着ているかが
// ここ 1 か所で見渡せる。
const BEAT_BUNDLES = [
  '#bundle beatBass1  = @{waveRamp} @e{piano} @s{8,2}',
  '#bundle beatBass2  = @{triangle} @e{flat}',
  // **キックに @o+2 を足す。**トラックが書く o2 はノイズのため(低い胴)で、
  // リズム音源のキックはそれに付き合うと 2 オクターブ下がって底を打つ。
  // ここで戻しておくと、キックは実機のドライバの高さで鳴る
  '#bundle beatKick   = @{opll::kick} @e{percussive} @o+2,'
    + '   @{noise} v11 @e{snap}',
  '#bundle beatSnare  = @{opll::snare} @e{percussive},'
    + '  @{noise} v8 @o+1 @e{snap}',
  '#bundle beatHat    = @{opll::cymbal} @e{percussive}',
  '#bundle beatHatAir = @{opll::cymbal} @e{percussive},'
    + ' @{noise} v3 @e{percussive}',
  '#bundle beatTom    = @{opll::tom} @e{percussive}',
  '#bundle beatPulse  = @{pulse(12)} @e{percussive}',
  '#bundle beatBrass  = @{opll::trumpet} @e{soft}',
  '#bundle beatHorn   = @{opll::horn} @e{soft}',
].join('\n');

// 8 小節の流れ: Dm Dm B- C Dm Dm Gm A
// 走るベース(8 分)。根音 - 5 度 - 8 度 - 5 度 を軸に、3 度と 7 度で崩す
const BEAT_BASS = wrap([
  'o2 d a o3 d o2 a f a d o3 c',
  'o2 d a o3 d o2 a f a d o3 c',
  'o2 b- f o3 b- o2 f d f b- a',
  'o2 c g o3 c o2 g e g c b-',
  'o2 d a o3 d o2 a f a d o3 c',
  'o2 d a o3 d o2 a f a d o3 c',
  'o2 g d g d b- d g f',
  'o2 a e a e o3 c o2 e a g',
]);

// 伸ばすベース。1 小節に 1 つ、根音だけ
const BEAT_ROOT = wrap([
  'o2 d1', 'o2 d1', 'o2 b-1', 'o2 c1',
  'o2 d1', 'o2 d1', 'o2 g1', 'o2 a1',
], 4);

// バスドラ。1 拍目と、2 拍目の裏から食い込む 2 発
const BEAT_KICK_A = 'c8 r8 r8 c16 r16 c8 r8 r4';
const BEAT_KICK_B = 'c8 r8 c16 r16 r8 c8 r8 c8 r8';
const BEAT_KICK = wrap([
  BEAT_KICK_A, BEAT_KICK_A, BEAT_KICK_A, BEAT_KICK_B,
  BEAT_KICK_A, BEAT_KICK_A, BEAT_KICK_A, BEAT_KICK_B,
]);

// スネアは 2 拍目 4 拍目の表。8 小節目だけ 16 分で追い込む
const BEAT_SNARE_A = 'r4 c8 r8 r4 c8 r8';
const BEAT_SNARE_B = 'r4 c8 r8 r4 c16 c16 c16 c16';
const BEAT_SNARE = wrap([
  BEAT_SNARE_A, BEAT_SNARE_A, BEAT_SNARE_A, BEAT_SNARE_A,
  BEAT_SNARE_A, BEAT_SNARE_A, BEAT_SNARE_A, BEAT_SNARE_B,
]);

// シンバル(ハイハット)。8 分の刻みを通しで。
// **8 発のうち 3 発だけ空気を足す。**全部に足すと、刻みではなく地鳴りになる。
// `$a` が空気つき、`$h` が素。どちらもバンドル音色が形まで持っているので、
// 音色を替えてもエンベロープは戻らない。マクロはチャンネル 1 本の中でしか
// 見えないので、バンドル音色と違ってここに置く
const BEAT_HAT_MACROS = [
  '$h = { @{beatHat} c8 }',
  '$a = { @{beatHatAir} c8 }',
].join('\n');
const BEAT_HAT_A = '$h $a $h $h $h $a $h $a';
const BEAT_HAT = wrap(new Array(8).fill(BEAT_HAT_A));

// タム。ふだんは休み、4 小節目と 8 小節目のおしまいでオカズ
const BEAT_TOM_FILL = 'r2 c16 c16 o3 c16 c16 o4 c8 o3 c8';
const BEAT_TOM = wrap([
  'r1', 'r1', 'r1', BEAT_TOM_FILL,
  'r1', 'r1', 'r1', BEAT_TOM_FILL,
]);

// 矩形波の粒。16 分の**裏だけ**に置く。
// 8 小節どこも同じなので、マクロとくり返しで書く。字にすると 559 字が 73 字になる
const BEAT_BLIP_DEF = '$p = { [r16 c16]8 }';   // 1 小節
const BEAT_BLIP = '[$p]8';

// ブラスの短い和音。**和音は 1 本では鳴らせない**ので、3 音ぶんのトラックを
// 別々に持ち、同じ位置で同じ長さだけ鳴らす。
// 入れるのは小節の切れ目や、間が空くところだけ。鳴らしすぎると
// リズムの隙間が埋まって、走るベースが聞こえなくなる。
// % のところに音名が入る(和音の何番目かで差し替える)
const ST_REST = 'r1';
// 小節末の 2 発は次の小節へ食い込む合いの手なので**短いまま**。
// 置きにいく 3 つは 4 分にして、和音として聞こえる長さを持たせる
const ST_TAIL = 'r2 r4 r8 %16 %16';   // 小節のおしまいに 16 分 2 発
const ST_BACK = 'r2 r4 %4';           // 4 拍目に 1 発
const ST_TWO = 'r2 %4 %4';            // 後半に 2 発
const ST_HEAD = '%4 r4 r2';           // 小節の頭に 1 発
const stab = (pattern, note) => pattern.split('%').join(note);

// 1・3・5 小節目は休んで、走るベースを聞かせる
const BEAT_STAB_RHYTHM = [ST_REST, ST_TAIL, ST_REST, ST_BACK, ST_REST, ST_TAIL, ST_TWO, ST_HEAD];
// 和音の積み方(上 / 中 / 下)
const BEAT_STAB_VOICES = [
  ['o4 a', 'o4 a', 'o4 f', 'o4 g', 'o4 a', 'o4 a', 'o5 d', 'o5 e'],
  ['o4 f', 'o4 f', 'o4 d', 'o4 e', 'o4 f', 'o4 f', 'o4 b-', 'o5 c+'],
  ['o4 d', 'o4 d', 'o3 b-', 'o4 c', 'o4 d', 'o4 d', 'o4 g', 'o4 a'],
];
const beatStabTrack = (voice) =>
  wrap(BEAT_STAB_RHYTHM.map((r, i) => stab(r, voice[i])));

/**
 * ベースと FM 打楽器で組んだリズムの曲。8 小節を 2 回。
 * @returns {string[]} 11 本のトラック
 */
export function beatTune() {
  const T = 't152';
  return [
    // 走るベース(波形メモリ = SCC)。
    // **piano で頭を立てる**。flat だと平らに続いて 8 分が団子になるが、
    // pluck では 0.12 秒で消えてしまい、8 分(0.2 秒)が鳴り終わる前に落ちる。
    // piano は落ちきるまで 0.4 秒あるので、頭が立ったまま胴が残る
    BEAT_BUNDLES + '\n#name ベース1\n'
      + `${T} q7 v13 l8 @{beatBass1} [` + BEAT_BASS + ']2',
    // 根音を伸ばすベース(三角波)
    '#name ベース2\n'
      + `${T} q8 v10 l1 @{beatBass2} [` + BEAT_ROOT + ']2',
    // バスドラ。低いノイズを重ねて胴を足す(バンドル音色)
    '#name バスドラ\n'
      + `${T} q8 v13 l16 @{beatKick} o2 [` + BEAT_KICK + ']2',
    // スネア。1 オクターブ上のノイズを重ねて砂を足す
    '#name スネア\n'
      + `${T} q8 v11 l16 @{beatSnare} o4 [` + BEAT_SNARE + ']2',
    // シンバル(刻み)。8 発のうち 3 発だけ空気つき
    BEAT_HAT_MACROS + '\n#name ハイハット\n'
      + `${T} q8 v6 l16 o6 [` + BEAT_HAT + ']2',
    // タム(オカズ)
    '#name タム\n'
      + `${T} q8 v10 l16 @{beatTom} o4 [` + BEAT_TOM + ']2',
    // 16 分の裏を埋める粒
    BEAT_BLIP_DEF + '\n#name パルス\n'
      + `${T} q8 v4 l16 @{beatPulse} o6 [` + BEAT_BLIP + ']2',
    // ブラスの和音(上 / 中 / 下)。
    // **音量は控えめに、長さは少し伸ばす**。短く切ると打楽器に紛れるが、
    // 伸ばしたぶん大きいままだとリズムより前に出てしまう
    '#name ブラス上\n'
      + `${T} q8 v7 l16 @{beatBrass} [` + beatStabTrack(BEAT_STAB_VOICES[0]) + ']2',
    '#name ブラス中\n'
      + `${T} q8 v6 l16 @{beatBrass} [` + beatStabTrack(BEAT_STAB_VOICES[1]) + ']2',
    '#name ブラス下\n'
      + `${T} q8 v6 l16 @{beatHorn} [` + beatStabTrack(BEAT_STAB_VOICES[2]) + ']2',
  ];
}
