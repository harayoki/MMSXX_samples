// バーチャルチップ。「いま何本使えるか」を宣言して、曲をそこへ乗せる。
//
// ---- なぜ要るか ----
//
// ハドソンのスターソルジャーは、普通に曲を作ってから、被るところを
// 楽譜の上で目視で削っていった(動的には何もしていない)。
// これを機械にやらせるのがここ。音が少ないほうがビビッドになるので、
// 削るのは妥協ではなく、そういう音にするための手
// (docs/ENGINE_TODO.md の「声の取り合い」)。
//
// ---- 機械の構成とは別物 ----
//
// [tool/core/machines.js](../tool/core/machines.js) は
// 「この音色はどこで鳴るか」を引くところ。こちらは「いま何本使えるか」。
// 似ているが用が違うので、1 つにまとめない —
// あちらは道具の持ちもので、こちらは鳴らす側が要る。
//
// 外部依存ゼロ。ここは `sound/` なので、道具の側を見に行かない。
//
// ---- 枠は音源ごとに分かれている ----
//
// 制限はチップで決まるので、取り合いも音源の枠の中で起きる。
// PSG は PSG の中、波形メモリは波形メモリの中で取り合う。
// 1 本の MML の中で音色が変われば、使う枠も変わる。

import { WAVEFORMS, ROLES } from './mml.js';

/**
 * 枠の種類。音の作り方でまとめる(チップの名前ではない)。
 *
 * チップの名前で持つと、`AY` と `SN76489` のように同じ作りで別の名前の
 * ものが増えるたびに枠が増える。作り方でまとめておけば、
 * 「矩形波が 3 本」はどの機械でも同じ意味になる。
 */
export const FAMILIES = ['psg', 'noise', 'wave', 'fm', 'pcm', 'beep'];

/** 音色の作り(`kind`)から枠の種類へ。知らない作りは psg 扱い */
const FAMILY_OF_KIND = {
  pulse: 'psg', triangle: 'psg', saw: 'psg', sine: 'psg',
  noise: 'noise',
  wave: 'wave',
  fm: 'fm', opm: 'fm', opll: 'fm',
  // 焼いた音は、実機では標本を鳴らす声に載る。枠の名前は実機のほう
  baked: 'pcm',
  // OPNA のリズム音源も録音を鳴らす
  opnaRhythm: 'pcm',
  beep: 'beep',
};

/**
 * その音色が、どの枠を何本食うか。
 *
 * 合成音色は重ねたぶんだけ食う。`layerKickAir` なら FM 1 + ノイズ 1 で、
 * 枠が別なので足し算ではなく、種類ごとに分かれて返る。
 *
 * @param {number|object} wave 音色の番号か、音色そのもの
 * @returns {Record<string, number>} 例 `{ fm: 1, noise: 1 }`
 */
export function costOf(wave) {
  const w = typeof wave === 'number' ? WAVEFORMS[wave] : wave;
  if (!w) return {};
  if (w.kind === 'layer') {
    const out = {};
    for (const m of w.layers || []) {
      for (const [k, n] of Object.entries(costOf(m.wave))) out[k] = (out[k] || 0) + n;
    }
    return out;
  }
  // AY のチップで鳴らす音色は、トーンかノイズかで枠が分かれる
  if (w.kind === 'ay') return { [w.mode === 'noise' ? 'noise' : 'psg']: 1 };
  // ファミコンも同じ。矩形波と三角波は psg の枠、ノイズは noise の枠
  if (w.kind === 'nes') return { [w.mode === 'noise' ? 'noise' : 'psg']: 1 };
  // ディスクシステムは波形メモリの枠
  if (w.kind === 'fds' || w.kind === 'scc') return { wave: 1 };
  // PC エンジンは波形メモリの枠。ノイズは noise の枠(声 5・6 を使う)
  if (w.kind === 'pce') return { [w.noise ? 'noise' : 'wave']: 1 };
  return { [FAMILY_OF_KIND[w.kind] || 'psg']: 1 };
}

/**
 * 音符 1 つが食う枠。オクターブ重ねだけ数える。
 *
 * `@d`(ずらして重ねる)と `@s`(こだま)は実際に 2 本鳴らしているが、
 * 鳴らす側の入 / 切なので数えない — 切ったとたんに曲の形が変わってしまう。
 * `@o1` は下に 1 つ、`@o2` はさらにもう 1 つ声を増やしているので数える。
 *
 * 音量 0 の音符も数える。`p0` は定位であって、枠は食ったまま
 * (そう作ってある。docs/MML.md の `p`)。
 * 黙らせた音符(`masked`)だけは数えない — あれは枠を空けるためのもの。
 */
export function costOfEvent(ev) {
  // 黙らせた音符は席を空ける。ここが `p0`(音量 0)との違いで、
  // あちらは定位をいじっただけなので枠は食ったまま
  if (ev.masked) return {};
  // 1 音は 1 声。重ねものは無くなった(2026-09-16)ので、音色のぶんだけ数える
  return costOf(ev.wave);
}

/**
 * 持っている枠。書かなかった種類は 0 本(その音は鳴らせない)。
 *
 * 実機に寄せた組み合わせをいくつか置いておく。足りなければ自分で書く —
 * `{ psg: 3, noise: 1 }` のような素のオブジェクトでよい。
 */
export const CHIPSETS = {
  // MSX の本体だけ。AY-3-8910 は 3 声で、ノイズはそのうちの 1 本を使う
  psg: { psg: 3, noise: 1 },
  // MSX + SCC。波形メモリが 5 本増える
  'msx-scc': { psg: 3, noise: 1, wave: 5 },
  // MSX + MSX-MUSIC。FM が 9 本
  'msx-fm': { psg: 3, noise: 1, fm: 9 },
  // ファミコン本体。矩形波 2 + 三角波 + ノイズ + DPCM
  nes: { psg: 3, noise: 1, pcm: 1 },
  // PC エンジン。波形メモリ 6 本(うち 2 本はノイズにも回せる)
  pce: { wave: 6, noise: 2 },
  // ビープだけ
  beep: { beep: 1 },
};

/**
 * 役の強さ。大きいほうが残る。
 *
 * 数字は MML には書かない。音色が持っている `role` から出すので、
 * 音色を書き換えれば大事さも一緒に変わる
 * (docs/ENGINE_TODO.md「数字は振らない。役で決める」)。
 */
export const ROLE_RANK = {
  lead: 6,     // 旋律。いちばん前に出るもの
  bass: 5,     // 低音。抜けると曲の底が消える
  counter: 4,  // 対旋律
  perc: 3,     // 打楽器。抜けると走っている感じが消える
  arp: 2,      // 分散和音。和音の代わりなので、和音と同じあたり
  chord: 2,    // 和音・パッド。まず譲る側
  noise: 1,    // 楽器としてのノイズ
  se: 0,       // 曲の部品ではないもの
};

/** その音符の強さ。役が無ければいちばん弱い扱い */
export function rankOf(ev) {
  const w = WAVEFORMS[ev.wave];
  const role = w && w.role;
  const r = ROLE_RANK[role];
  return r === undefined ? 0 : r;
}

/** 役の言葉が全部そろっているか(足したときに気づけるように) */
export const ROLES_COVERED = ROLES.every((r) => ROLE_RANK[r] !== undefined);
