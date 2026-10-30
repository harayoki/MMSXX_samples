// 最初から入っている FM 音色。MSX-MUSIC(FM-PAC などに載っていた YM2413 = OPLL)の
// **内蔵音色 15 種**の並びに合わせてある。
//
// **名前は `fm2` で始める**(2026-09 に `fm*` から改めた)。
// 4 オペのほうが `fm4*` だったので、2 オペだけ数が付かないと、どちらの作りか
// 名前から分からなかった(4 オペはいま `opm*` / `opn*`)。前の名前は残していない
// (いまは互換性を見ていない時期。`docs/RELEASE.md`)。
//
// **ことわり**: 実機の音色は 8 バイトのレジスタで決まり、
// 4 種類の波形・フィードバック・レベルの段など、ここで扱っていない要素が多い。
// なので**そっくり同じ音にはならない**。「その楽器を狙った 2 オペの近似」であり、
// 並びと名前を実機に合わせてある、という位置づけ。
//
// 自分で足すときは engine 側をさわらず、ゲームから呼ぶ:
//   mmsxx.audio.addFM('fm2Mine', { ratio: 2, depth: 5, decay: 0.2 });

import { registerFM, WAVE } from './mml.js';

/**
 * OPLL の内蔵音色の並び。
 * ratio = 変調側の比 / depth = 揺らしの深さ / decay = 倍音の減り方(秒) /
 * sustain = 減りきったあとに残る倍音
 */
export const FM_PRESETS = {
  // 1 バイオリン。弓のこすれを出すため、比を少しずらして倍音を残す
  // 2 ギター。はじいた瞬間だけ硬く、あとは丸くなる
  // 3 ピアノ。低い比で芯を作り、減りは中くらい
  // 4 フルート。倍音が少なく、息の立ち上がりがゆっくり
  // 5 クラリネット。奇数倍音が立つので比は 3
  // 6 オーボエ。細く鼻にかかった音。比を高めに取る
  // 7 トランペット。吹き込むほど倍音が増える(深さを大きく、残りも多め)
  // 8 オルガン。倍音が動かないので、減らさずそのまま持続させる
  // 9 ホルン。丸く、奥から鳴る。立ち上がりはゆっくり
  // 10 シンセ。作り物らしく、比をずらして濁らせる
  // 11 ハープシコード。はじく音。硬くて減りが速い
  // 12 ビブラフォン。金属らしく、比を半端にする
  // 13 シンセベース。低音でぶ厚く、アタックだけ硬い
  // 14 アコースティックベース。指ではじいた丸い低音
  // 15 エレキギター。歪んだ持続音。深さを保ったままにする

  // ---- このエンジン独自のもの(実機には無い) ----
  // 硬い金属質のリード。比を半端にして倍音を濁らせ、伸ばすほど澄んでいく
  fm2Lead: {
    gm: 'Lead 1 (square)',
    pitch: [-180, -110, -50, 0], vib: { depth: 83, speed: 6.5, delay: 18 },
    descJa: 'ぜんぶの上に乗せるための、独奏の音。4 フレームで滑り込んでから、18 フレーム後に深く揺れる。2 つ揃って初めて「弾いている」音になる',
    role: 'lead', desc: 'Solo voice meant to sit on top of everything else. Slides up into place over four frames, then wobbles deeply from eighteen. Both together are what makes a lead sound played rather than triggered.',
    ratio: 2.5, depth: 7, attack: 0.004, decay: 0.22, sustain: 0.25 },
  // 唸る低音。出だしだけ深く歪ませて、あとは芯だけ残す
  fm2Growl: {
    gm: 'Lead 8 (bass + lead)',
    vib: { depth: 97, speed: 9, delay: 6 },
    descJa: '深く揺らして、比も整数から大きく外してある。倍音がそろわないので唸る。この中でいちばん速く深く、ほとんど最初から揺れる。落ち着く前に唸る',
    role: 'bass', desc: 'Deep modulation with the ratio well off a whole number — inharmonic, so it snarls. The fastest and deepest wobble here, starting almost at once. It snarls before it settles.',
    ratio: 1.5, depth: 9, attack: 0.002, decay: 0.14, sustain: 0.12 },
  // 鐘のように響く合いの手。倍音が長く残る
  fm2Chime: {
    gm: 'Tubular Bells',
    vol: [15, 15, 14, 13, 12, 11, 10, 9, 8, 7, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1],
    descJa: '鐘のような音。高い倍音が長く残る。21 フレームかけてゆっくり落ちる。鐘は尻尾のほうが本体',
    role: 'counter', desc: 'Bell-like, high partials, long tail. Falls slowly over twenty-one frames. A bell is mostly its tail.',
    ratio: 4.7, depth: 5, attack: 0.002, decay: 0.6, sustain: 0.1 },

  // ---- リズム ----
  // 実機のリズム音源も、専用の回路ではなく**濁らせた FM を短く切って**作っていた。
  // 比を整数から外して音程感を消し、深さを大きく、減衰を極端に短くする。
  // ノイズを使わないので、**SE のノイズ枠を食わない**のも利点。
  //
  // 名前は **fmDrum で始める**。一覧に並んだときに打楽器だと分かるうえ、
  // 道具の側も名前だけで見分けられる(音色テストはこれを見て、
  // ドレミではなくリズムの曲を鳴らす)
  // バスドラム。**音程が落ちる**のがこの楽器の正体なので drop を使う。
  // 高いところから一瞬で落ちる「ドッ」があって、はじめて胴の音に聞こえる
  // スネアドラム。**胴の音と、裏に張った響き線のざらつき**が重なった楽器。
  // 2 オペでノイズは作れないので、比を整数から大きく外して深く揺らし、
  // 倍音をびっしり詰めて**ノイズに近い濁り**を作る。
  // そこへ短い落ち(drop)を足すと、皮を張った胴を叩いた感じになる
  // タムも少しだけ落ちる(バスドラムほどではない)
  // 手拍子。**胴が無いので落ちない。**スネアから drop を外して、
  // 比をさらに整数から離し、減衰をもっと短くしたもの。
  // 皮の音が無いぶん、濁りだけが一瞬鳴って消える
};

/** 打楽器として作ってある音色か(名前で見分ける) */
export const isDrumTone = (name) => String(name).startsWith('fmDrum');

/** 最初から使える FM 音色を登録する(このファイルを読み込んだ時点で入る) */
export function registerDefaultFM() {
  for (const [name, p] of Object.entries(FM_PRESETS)) {
    // **MIDI の希望も渡す。**OPLL の内蔵音色に合わせてあるので、
    // GM のどれに当たるかは元からはっきりしている
    registerFM(name, p, { overwrite: true, desc: p.desc, descJa: p.descJa, role: p.role,
      version: p.version ?? '1.00', gm: p.gm });
  }
}
