// コナミの K005289。グラディウス(1985)などのアーケード基板に載っている、波形メモリの 2 声。
//
// ---- SCC の処理器で鳴らす ----
//
// 計算が SCC(sound/scc.js)と同じなので、チップを別に持たない。
// MAME の k005289.cpp では、3.579545MHz で数えて、(n + 1) 回ごとに波形を 1 つ進める。
// 32 個で 1 周。SCC も同じクロックで、同じ数え方をする。
// 音量も同じで、(波形の値 − 8) × 4 ビットの音量の線形。
//
// 違うのは波形の深さだけ。K005289 は 4 ビット(16 段)で、SCC は 8 ビット。
// だから 16 段に寄せた形を、SCC の音色として登録する。
//
// ---- 実機の制約 ----
//
// - 2 声。波形はチャンネルごとに PROM の半分ずつ、8 種類ずつ持つ
// - 音程は 12 ビットの値を、書き込むアドレスで渡す(データバスが無い)
// - 波形と音量は、AY #2 のポート A / B から書く
//
// 声の数と、どちらのチャンネルの PROM に載っているかは、再生では気にしない。
// SCC と同じで、実機の制約は再生に持ち込まない。
//
// ---- 波形について ----
//
// 実機の PROM の中身は使っていない。ここにあるのは、録音を測った倍音の形から
// 起こしたものと、基本の形。

import { registerSCC } from './mml.js';

/** 0〜15 の 32 個を、SCC の音色の -128〜112 へ。中心は 8 */
export const k005289Wave = (list) => Array.from(list, (v) => (Math.max(0, Math.min(15, Math.round(v))) - 8) * 16);

/** -1..1 の 32 個を、0〜15 に寄せる */
const quantize = (list) => Array.from(list, (v) => Math.round((v + 1) / 2 * 15));

// 倍音の大きさ(基音を 1 として)から 1 周を作り、-1..1 に収める
function fromHarmonics(amps) {
  const raw = Array.from({ length: 32 }, (_, i) =>
    amps.reduce((s, a, k) => s + a * Math.sin(2 * Math.PI * (k + 1) * i / 32), 0));
  const peak = Math.max(...raw.map(Math.abs));
  return raw.map((v) => v / peak);
}

/**
 * 最初から入れておく音色。説明は英語だけ持つ(日本語はデータに入れない)。
 */
export const K005289_PRESETS = [
  ['k005289Pulse25', Array.from({ length: 32 }, (_, i) => (i < 8 ? 15 : 0)), 'arp',
    'A 25% pulse on the K005289: eight high steps out of thirty-two, at four bits. Every fourth '
    + 'harmonic is missing, which the AY next to it cannot do.'],
  ['k005289Square', Array.from({ length: 32 }, (_, i) => (i < 16 ? 15 : 0)), 'lead',
    'A 50% square on the K005289, at four bits. The same shape the AY plays, for comparing the two.'],
  // 録音から取り出した形。旋律を AY と重ねている声を、K005289 のちょうどの周期で
  // 169 の窓ぶん畳んで平均した。同じやり方で取った AY 側は、偶数次の倍音が -45dB 以下の
  // きれいな 50% 矩形になったので、取り出し方は効いている。窓ごとの形の相関は中央値 0.95。
  // 1 周の頭は、いちばん低いところに合わせてある(2026-10-19)
  ['k005289Lead', [0, 1, 4, 2, 2, 5, 7, 7, 6, 2, 0, 1, 4, 2, 2, 6, 8, 7, 4, 8, 13, 15, 14, 10, 8, 7, 4, 6, 8, 6, 2, 0], 'lead',
    'A lead for the K005289, measured from a 1985 arcade recording: the voice that doubles the AY '
    + 'melody, folded at its own period over many notes. Not the original PROM data.'],
  ['k005289Bass', quantize(fromHarmonics([1, 0.79, 0.35, 0.28, 0.22, 0.28, 0.16, 0.18])), 'bass',
    'A bass for the K005289, drawn from the harmonics measured on a 1985 arcade recording: a strong '
    + 'second harmonic over a slowly falling tail. Not the original PROM data.'],
];

/**
 * 最初から入れておく音色を登録する(エンジンが読み込まれるときに走る)。
 * 二度呼ばれても止まらない(ほかの register* と同じ)。
 */
export function registerK005289Presets() {
  for (const [name, wave, role, desc] of K005289_PRESETS) {
    try { registerSCC(name, { wave: k005289Wave(wave) }, { role, desc }); }
    catch (e) { /* すでに入っている */ }
  }
}
