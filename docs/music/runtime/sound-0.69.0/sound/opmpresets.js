// 最初から入っている 4 オペ FM の音色(OPM = YM2151)。
//
// **チップそのものを鳴らす。**2026-09-27 に作り直した。
// 前は「FM らしい音」を寄せて作る仕掛け(`sound/fm4.js`)で鳴らしていて、
// 数値も耳で置いたものだった。いまは実機のレジスタの値をそのまま持ち、
// 演算は ymfm(BSD)と突き合わせてサンプル単位で一致している。
//
// 名前の頭は、どの音源のための音色かで分ける(2026-10-04 に `fm4*` から改めた)。
// `opn*` は PC-88 / PC-98(YM2203 / YM2608)のための音色で、OPN で出せない DT2 と
// LFO を使わない。`opm*` は X68000 とアーケード(YM2151)のための音色。どちらも
// 鳴らすのは同じ OPM のチップ(sound/ym2151.js の `opnPatch`)。前の 9 つのうち、
// DT2 を使っていない 6 つを `opn*` に、使っている 3 つを `opm*` にした。
//
// ---- どうやって写したか ----
//
// 前の音色は 0〜1 の線形で持っていたので、実機の目盛りへ直す必要があった。
//
// | 前 | 実機 | 写し方 |
// | --- | --- | --- |
// | 深さ(0〜1) | TL(0 がいちばん大きく 0.75dB きざみ) | dB へ直す。**揺らす側は 17 段足す** — OPM の変調は前の作りより 4.18 倍深い |
// | 秒 | AR / D1R / RR(0〜31 の速さ) | **鳴らして測った。**段ごとに何秒かかるかを実際に数え、いちばん近い段を選んだ |
// | 比(1 / 2 / 3.5 …) | MUL(0.5 と 1〜15)+ DT2(4 段) | 整数でない比は DT2 で作る。3.5 は MUL 2 × DT2 3(= 3.46) |
// | 段の高さ(0〜1) | D1L(3dB きざみ) | dB へ直して 3 で割る |
// | 帰還(0〜1.6) | FB(0〜7) | 位相を何回転ずらすかで合わせた。前の 1.0 が FB 5 |
//
// **セントのデチューンは DT1 に潰れる。**実機の DT1 は音の高さで効き方が変わる
// 表なので、±5〜14 セントという書き方ができない。近いほうの段を当てている。
//
// ---- まだ決めていないこと ----
//
// **`@e{…}` は効かない。**実機の音色が自分でエンベロープを持っているので、
// その外側にもう一枚かけると音色が変わってしまう。前の作りでは外から掛けて
// いたが、チップそのものになったのでやめた(`sound/audio.js`)。
//
// **音量は TL へ足している。**出口に出ているオペレータだけに足す。
// 揺らす側に足すと、音量ではなく音色が変わる。

import { registerBaked, sealPresets } from './mml.js';
import { registerDefaultLayers } from './layerpresets.js';
import { registerOPM } from './ym2151.js';
import { opmPatch } from './ym2151.js';

/** @type {Record<string, {patch:object, of:string}>} */
export const OPM_PRESETS = {
  'opn::brass': {
    descJa: '4 オペの金管。オペレータが増えたぶん、伸ばしているあいだに倍音が育つ。本物の金管と同じ動きで、2 オペにはできない',
    role: 'lead', desc: 'Four-operator brass. The extra operators let the harmonics build over the note the way a real horn does — the thing two operators cannot do.',
    of: '主役のブラス。結線 2 + 帰還。いちばん耳に残る役',
    patch: opmPatch({ alg: 2, fb: 5, ops: [
      { ar: 17, d1r: 8, d2r: 0, rr: 10, d1l: 1, tl: 29, ks: 0, mul: 1, dt1: 2, dt2: 0 },
      { ar: 17, d1r: 8, d2r: 0, rr: 10, d1l: 1, tl: 33, ks: 0, mul: 1, dt1: 6, dt2: 0 },
      { ar: 18, d1r: 9, d2r: 0, rr: 10, d1l: 2, tl: 37, ks: 0, mul: 2, dt1: 3, dt2: 0 },
      { ar: 17, d1r: 6, d2r: 0, rr: 9, d1l: 1, tl: 0, ks: 0, mul: 1, dt1: 5, dt2: 0 },
    ] }) },
  'opn::lead': {
    descJa: '4 オペのリード。明るく前へ出る。厚い編成の上に乗せるための音',
    role: 'lead', desc: 'Four-operator lead. Bright and cutting, meant to sit above a full arrangement.',
    of: '細めで前に出るリード',
    patch: opmPatch({ alg: 4, fb: 4, ops: [
      { ar: 25, d1r: 12, d2r: 0, rr: 10, d1l: 3, tl: 34, ks: 0, mul: 3, dt1: 2, dt2: 0 },
      { ar: 23, d1r: 7, d2r: 0, rr: 9, d1l: 2, tl: 0, ks: 0, mul: 1, dt1: 6, dt2: 0 },
      { ar: 25, d1r: 14, d2r: 0, rr: 10, d1l: 4, tl: 38, ks: 0, mul: 2, dt1: 3, dt2: 0 },
      { ar: 23, d1r: 6, d2r: 0, rr: 9, d1l: 2, tl: 4, ks: 0, mul: 1, dt1: 5, dt2: 0 },
    ] }) },
  'opn::bass': {
    descJa: '4 オペの低音。芯がしっかりしていて上の倍音もあるので、小さいスピーカーでも聞こえる',
    role: 'bass', desc: 'Four-operator bass. Solid fundamental with enough upper harmonics to be heard on small speakers.',
    of: '頭が立ってすぐ締まるベース。帰還を深めに',
    patch: opmPatch({ alg: 0, fb: 5, ops: [
      { ar: 27, d1r: 16, d2r: 0, rr: 11, d1l: 5, tl: 31, ks: 0, mul: 1, dt1: 1, dt2: 0 },
      { ar: 27, d1r: 15, d2r: 0, rr: 11, d1l: 5, tl: 33, ks: 0, mul: 2, dt1: 6, dt2: 0 },
      { ar: 27, d1r: 14, d2r: 0, rr: 11, d1l: 3, tl: 32, ks: 0, mul: 1, dt1: 1, dt2: 0 },
      { ar: 27, d1r: 11, d2r: 0, rr: 10, d1l: 3, tl: 0, ks: 0, mul: 1, dt1: 5, dt2: 0 },
    ] }) },
  'opn::ep': {
    descJa: 'エレクトリックピアノ。4 オペの FM がいちばん有名になった音',
    role: 'chord', desc: 'Electric piano. The sound four-operator FM is most famous for.',
    of: 'エレピ。高い比(11)で頭だけ鳴らして落とす',
    patch: opmPatch({ alg: 4, fb: 0, ops: [
      { ar: 27, d1r: 22, d2r: 0, rr: 9, d1l: 15, tl: 31, ks: 0, mul: 11, dt1: 2, dt2: 0 },
      { ar: 25, d1r: 8, d2r: 0, rr: 8, d1l: 5, tl: 0, ks: 0, mul: 1, dt1: 6, dt2: 0 },
      { ar: 27, d1r: 13, d2r: 0, rr: 10, d1l: 9, tl: 38, ks: 0, mul: 1, dt1: 2, dt2: 0 },
      { ar: 24, d1r: 7, d2r: 0, rr: 8, d1l: 4, tl: 3, ks: 0, mul: 2, dt1: 5, dt2: 0 },
    ] }) },
  'opm::bell': {
    descJa: '鐘。そろわない倍音で、長く減る',
    role: 'counter', desc: 'Bell. Inharmonic partials, long decay.',
    of: '鐘。**半端な比**(3.5 / 7)。整数でないと鐘にならない',
    patch: opmPatch({ alg: 4, fb: 3, ops: [
      { ar: 27, d1r: 14, d2r: 0, rr: 4, d1l: 15, tl: 32, ks: 0, mul: 2, dt1: 2, dt2: 3 },
      { ar: 27, d1r: 12, d2r: 0, rr: 3, d1l: 15, tl: 0, ks: 0, mul: 1, dt1: 6, dt2: 0 },
      { ar: 27, d1r: 15, d2r: 0, rr: 5, d1l: 15, tl: 40, ks: 0, mul: 7, dt1: 3, dt2: 0 },
      { ar: 27, d1r: 12, d2r: 0, rr: 4, d1l: 15, tl: 4, ks: 0, mul: 2, dt1: 5, dt2: 0 },
    ] }) },
  'opn::klang': {
    descJa: '金属を叩いた音。わざと倍音をそろえていないので、音というよりノイズに近い',
    role: 'perc', desc: 'Metallic hit. Deliberately inharmonic — closer to noise than to a note.',
    of: 'いかにも FM なリード。比 7 を頭だけ深くかけて落とす',
    patch: opmPatch({ alg: 0, fb: 5, ops: [
      { ar: 27, d1r: 23, d2r: 0, rr: 9, d1l: 15, tl: 19, ks: 0, mul: 7, dt1: 3, dt2: 0 },
      { ar: 27, d1r: 16, d2r: 0, rr: 11, d1l: 6, tl: 23, ks: 0, mul: 2, dt1: 6, dt2: 0 },
      { ar: 27, d1r: 12, d2r: 0, rr: 10, d1l: 3, tl: 26, ks: 0, mul: 1, dt1: 2, dt2: 0 },
      { ar: 25, d1r: 9, d2r: 0, rr: 9, d1l: 2, tl: 0, ks: 0, mul: 1, dt1: 5, dt2: 0 },
    ] }) },
  'opm::glass': {
    descJa: 'ガラスのように細く澄んだ音。頭は硬い',
    role: 'counter', desc: 'Glassy and thin, with a hard attack.',
    of: 'ガラスの鐘。比 4.7 と 9.1。**整数から外す**ほど金属になる',
    patch: opmPatch({ alg: 4, fb: 3, ops: [
      { ar: 27, d1r: 17, d2r: 0, rr: 6, d1l: 15, tl: 21, ks: 0, mul: 3, dt1: 2, dt2: 2 },
      { ar: 27, d1r: 13, d2r: 0, rr: 4, d1l: 15, tl: 0, ks: 0, mul: 1, dt1: 6, dt2: 0 },
      { ar: 27, d1r: 19, d2r: 0, rr: 7, d1l: 15, tl: 24, ks: 0, mul: 9, dt1: 3, dt2: 0 },
      { ar: 27, d1r: 13, d2r: 0, rr: 4, d1l: 15, tl: 3, ks: 0, mul: 2, dt1: 6, dt2: 0 },
    ] }) },
  'opn::slap': {
    descJa: 'スラップのベース。頭でほとんど決まる',
    role: 'bass', desc: 'Slapped bass. The attack carries most of the character.',
    of: '弾くベース。頭で比 5 が弾けて、すぐ芯だけ残る',
    patch: opmPatch({ alg: 0, fb: 6, ops: [
      { ar: 27, d1r: 24, d2r: 0, rr: 9, d1l: 15, tl: 20, ks: 0, mul: 5, dt1: 2, dt2: 0 },
      { ar: 27, d1r: 19, d2r: 0, rr: 11, d1l: 9, tl: 24, ks: 0, mul: 2, dt1: 6, dt2: 0 },
      { ar: 27, d1r: 14, d2r: 0, rr: 11, d1l: 4, tl: 29, ks: 0, mul: 1, dt1: 1, dt2: 0 },
      { ar: 27, d1r: 11, d2r: 0, rr: 10, d1l: 3, tl: 0, ks: 0, mul: 1, dt1: 5, dt2: 0 },
    ] }) },
  // ---- LFO を使うもの(2026-10-05)----
  //
  // どちらも `dev: wip`。LFO を入れたので、まず使える形を 2 つ置いた。
  // 吟味はこれから。揺れの速さと深さは、聞いて決め直す。
  //
  // ノイズの打楽器(ハイハット・シンバル)も作ったが、置かないことにした。
  // OPM のノイズは帯域が広く、短く切ると破裂音、伸ばすと波の音になる。
  // 金物に寄せるには倍音のほうを主役にすることになり、それならノイズは要らない。
  'opm::leadVib': {
    descJa: 'ビブラートの掛かったリード。LFO が高さを揺らす',
    role: 'lead', desc: 'Lead with vibrato: the LFO moves the pitch.',
    of: '揺れるリード。`opn::lead` に LFO を足したもの',
    dev: ['wip'],
    patch: opmPatch({ alg: 4, fb: 4, pms: 4, lfo: { rate: 196, pmd: 36, wf: 2 }, ops: [
      { ar: 25, d1r: 12, d2r: 0, rr: 10, d1l: 3, tl: 34, ks: 0, mul: 3, dt1: 2, dt2: 0 },
      { ar: 23, d1r: 7, d2r: 0, rr: 9, d1l: 2, tl: 0, ks: 0, mul: 1, dt1: 6, dt2: 0 },
      { ar: 25, d1r: 11, d2r: 0, rr: 10, d1l: 3, tl: 38, ks: 0, mul: 2, dt1: 1, dt2: 0 },
      { ar: 23, d1r: 7, d2r: 0, rr: 9, d1l: 2, tl: 4, ks: 0, mul: 1, dt1: 5, dt2: 0 },
    ] }) },
  'opm::brassTrem': {
    descJa: 'トレモロの掛かった金管。LFO が音量を揺らす',
    role: 'lead', desc: 'Brass with tremolo: the LFO moves the level.',
    of: '揺れる金管。`opn::brass` に LFO を足し、出口のオペだけで受ける。深く掛けると途切れて聞こえる',
    dev: ['wip'],
    patch: opmPatch({ alg: 2, fb: 5, ams: 1, lfo: { rate: 200, amd: 20, wf: 2 }, ops: [
      { ar: 17, d1r: 8, d2r: 0, rr: 10, d1l: 1, tl: 29, ks: 0, mul: 1, dt1: 2, dt2: 0 },
      { ar: 17, d1r: 8, d2r: 0, rr: 10, d1l: 1, tl: 33, ks: 0, mul: 1, dt1: 6, dt2: 0 },
      { ar: 17, d1r: 8, d2r: 0, rr: 10, d1l: 1, tl: 31, ks: 0, mul: 1, dt1: 1, dt2: 0 },
      { ar: 17, d1r: 7, d2r: 0, rr: 9, d1l: 1, tl: 0, ks: 0, mul: 1, dt1: 5, dt2: 0, ame: 1 },
    ] }) },
  'opm::tom': {
    descJa: '音程の落ちるタム',
    role: 'perc', desc: 'Tom with a pitch drop.',
    of: '打楽器。帰還を深く潰す',
    patch: opmPatch({ alg: 0, fb: 6, ops: [
      { ar: 27, d1r: 23, d2r: 0, rr: 9, d1l: 15, tl: 28, ks: 0, mul: 1, dt1: 1, dt2: 0 },
      { ar: 27, d1r: 22, d2r: 0, rr: 9, d1l: 15, tl: 29, ks: 0, mul: 1, dt1: 1, dt2: 1 },
      { ar: 27, d1r: 21, d2r: 0, rr: 8, d1l: 15, tl: 31, ks: 0, mul: 1, dt1: 1, dt2: 0 },
      { ar: 27, d1r: 18, d2r: 0, rr: 7, d1l: 15, tl: 0, ks: 0, mul: 1, dt1: 1, dt2: 0 },
    ] }) },
};

/** 最初から入れておく(ChipTuneSound が読み込まれるときに走る) */
/**
 * 名前の頭で付けるタグ。**どの機械のための音色か**を引けるようにする。
 *
 * どちらも OPM のチップで鳴るので、`kind` では分けられない(2026-10-05)。
 * `opn` は OPN を積んだ機械ぜんぶで鳴るので、PC-88 だけの印にはしない。
 */
const PREFIX_TAGS = {
  opn: ['opn', 'pc88', 'pc98'],
  opm: ['opm', 'x68000', 'arcade'],
};

export function registerOPMPresets() {
  for (const [name, p] of Object.entries(OPM_PRESETS)) {
    // OPN(YM2203)の 6 つは版 1。OPM(YM2151)はまだ詰めているので 0.1 のまま
    // (書かなければ 0.1 が既定。2026-10-29)
    registerOPM(name, p.patch, { desc: p.desc, descJa: p.descJa, role: p.role,
      ...(name.startsWith('opn::') ? { version: '1.00' } : {}),
      tags: PREFIX_TAGS[name.slice(0, 3)], dev: p.dev });
  }
  // **焼いて使う例。** 中身は opn::brass と同じで、鳴らし方だけ違う。
  // 焼けるまでは元の音色で鳴り、焼き終わったら黙って差し替わる
  registerBaked('bakedBrass', {
    // 焼いたものの版は、焼いたもの自身の約束。元(`opn::brass`)は版 1
    version: '1.00',
    from: 'opn::brass', octaves: [3, 4, 5], step: 3, role: 'lead',
    descJa: 'opn::brass を 3 オクターブぶん焼いて波形にしたもの。場所は食うが計算は要らない — 実機がやっていた取り引きと同じ',
    desc: 'The four-operator brass rendered to samples across three octaves. '
      + 'Baking it costs memory but no CPU — the trade real hardware made.',
  });
}

// 読み込むと音色が並ぶ。エンジンのプリセットとして扱う
registerOPMPresets();
// 重ねる相手が増えたので、合成音色を並べ直す。組み合わせによっては、この音源が
// 入っていないと作れないものがある(`layerKickAir` は OPLL のバスドラを使う)
registerDefaultLayers();
// 分けて読み込んでも、エンジンのプリセットとして並ぶようにする
sealPresets();
