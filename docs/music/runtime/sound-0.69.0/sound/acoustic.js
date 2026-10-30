// 生音のまねと、電気で拾う楽器(`acoustic(…)` `electric(…)`)をエンジンへ入れる。
//
// 中身は 2 つに分かれている。共振器を回すもの(`modal.js`)と、息の式を回すもの
// (`brass.js`)で、処理器が別。名前の上ではどちらも `acoustic` / `electric` で、
// 曲を書く側はその区別を知らなくてよい。
//
// このファイルを読み込むと使えるようになる。読み込まなければエンジンには入らない
// (docs/SOUND_TOOL.md「音源ごとに分けて配る」)。縮めて 180KB ある。

import { registerModal, registerBrass, registerFamily, registerVoiceSyntax,
  registerVoiceDetail, sealPresets, warn, VIB_SPEED } from './mml.js';
import { TONE_FRAME } from './tones.js';
import { registerDefaultLayers } from './layerpresets.js';
import { MODAL_CODE, MODAL_NODE, MODAL_PATCHES, MODAL_VOICES, compileModal } from './modal.js';
import { BRASS_CODE, BRASS_NODE, BRASS_PATCHES, BRASS_VOICES, compileBrass } from './brass.js';
import { buildInstrument, describeInstrument } from './modalspec.js';
import { registerChipKind } from './audio.js';

/**
 * MML の #voice で作った生音のパッチ。処理器の種類 → パッチの名前 → 定義(畳む前)。
 *
 * 既定の楽器(MODAL_PATCHES・BRASS_PATCHES)とは分けて持つ。あちらは楽器の一覧として
 * 仲間の値の並び・テスト・聞くページが読むので、曲の中の一時利用を混ぜない。
 * 処理器へは、作るときと、音符を流し込むたびの両方で渡す。処理器は一度作ると
 * 使い回されるので、あとから作ったパッチが届かないと無音になる
 */
const MML_PATCHES = { modal: {}, brass: {} };

/**
 * 波形を持たない音源の音色を入れる。
 *
 * 名前は作り分けの形(`acoustic::piano`)。`pulse(50)` や `noise(metal)` と同じで、
 * 楽器を足しても名前が掛け算で増えない。
 *
 * 家族の名前は、音の種類で付ける。チップチューンの音色は仕組みで名前が付いている
 * (`fm2Lead` `opll::piano` `ayEnvSaw(5bit)`)が、チップに無い音には仕組みの名前が
 * 意味を持たない。曲を書く側が選ぶのは「生音のまね」か「電気で拾う楽器」かで、
 * 中で共振器を回すか息の式を回すかではない(2026-10-13。前は仕組みで `model(…)` 1 つだった)。
 *
 * - `acoustic` 生音のまね。ピアノ、ウッドベース、ブラシ、ライド、管
 * - `electric` 生音を電気で拾う楽器。Rhodes。音の元は物の揺れで、そのあとに
 *   ピックアップやアンプが付く
 *
 * 役(`role`)はパッチごとに書く。音色から引くところ(書き出しの当て先)が
 * 旋律とベースと打楽器を取り違えないため。
 */
function registerModalVoices() {
  // `brass` を家族の名前にしない。曲を書く人がふつうに使う語で、
  // `#chord brass = …` がドキュメントの例にもある。家族にすると取り上げてしまう
  // 電気で拾う楽器。ほかは生音
  const ELECTRIC = new Set(['rhodes', 'fingerBass', 'pickBass', 'slapBass']);
  const MODAL_ROLE = {
    brush: 'perc', brushSweep: 'perc', ride: 'perc', conga: 'perc', cowbell: 'perc',
    bass: 'bass', fingerBass: 'bass', pickBass: 'bass', slapBass: 'bass', bassSlap: 'bass', bassSlapHit: 'perc', guitar: 'lead', piano: 'lead', rhodes: 'lead', timpani: 'perc', timpaniRoll: 'perc', gong: 'perc',
    marimba: 'lead', vibraphone: 'chord', glockenspiel: 'counter', woodblock: 'perc',
    trumpet: 'lead', trombone: 'counter', tuba: 'bass', bassoon: 'bass', bassClarinet: 'bass', cello: 'counter', contrabass: 'bass', tenor: 'lead',
  };
  // 調整中の音色(draft)は登録しない。値は残してあり、聞くページの道具からは鳴らせる
  const all = [
    ...Object.entries(MODAL_PATCHES).map(([name, def]) => ({ name, def, kind: 'modal' })),
    ...Object.entries(BRASS_PATCHES).map(([name, def]) => ({ name, def, kind: 'brass' })),
  ].filter(({ def }) => !def.draft);
  const acoustic = all.filter((x) => !ELECTRIC.has(x.name));
  const electric = all.filter((x) => ELECTRIC.has(x.name));
  // 家族は作らない。かっこの中は引数だけにする決まりなので、楽器を選ぶ軸は
  // 名前そのものになる(`acoustic::piano`。2026-10-18)。楽器の一覧は音色の
  // 一覧から引ける(`listVoices({ kind: 'modal' })`)
  for (const { name, def, kind } of all) {
    const family = ELECTRIC.has(name) ? 'electric' : 'acoustic';
    const reg = kind === 'modal' ? registerModal : registerBrass;
    // 作っている最中の印(dev)も渡す。音色の一覧で、仕上がったものと分けて見られる
    reg(`${family}::${name}`, { patch: name }, { role: MODAL_ROLE[name], desc: def.desc,
      // 版は楽器ごと。書いていなければ 0.1(開発中)が既定になる
      ...(def.version ? { version: def.version } : {}),
      dev: def.dev, devNote: def.devNote });
  }
  // #voice で数を書き換えて作る(`@acoustic{ guitar, t60 4.2 }`)。読み方は sound/modalspec.js
  for (const word of ['acoustic', 'electric']) {
    const electric = word === 'electric';
    registerVoiceSyntax(word, (name, tree, opts) => {
      const r = buildInstrument(tree, {
        word, name, allowed: (n) => ELECTRIC.has(n) === electric,
        others: electric ? 'acoustic' : 'electric',
      });
      for (const w of r.warnings) warn(w);
      // 処理器の中の名前。既定の楽器の名前とぶつからないよう、頭に `#` を付ける
      const patch = '#' + name;
      MML_PATCHES[r.kind][patch] = { ...r.def, from: r.instrument };
      const reg = r.kind === 'modal' ? registerModal : registerBrass;
      reg(name, { patch }, { role: opts.role ?? MODAL_ROLE[r.instrument], overwrite: true });
    }, { tree: true });
  }
  // describeVoice の detail。何を書けて、どこまで動くか
  for (const kind of ['modal', 'brass']) {
    registerVoiceDetail(kind, (w) => {
      const own = MML_PATCHES[kind][w.patch];
      return own ? describeInstrument(own.from, own) : describeInstrument(w.patch);
    });
  }
}

/** パッチの定義を、処理器が読む形へ畳む */
function patchesOf(table, compile) {
  const out = {};
  for (const [k, d] of Object.entries(table)) out[k] = compile(d);
  return out;
}

/**
 * 生音で鳴らす音符を、常駐の処理器へ渡す形にする。
 *
 * 音量は 0〜1 の強さで渡す。処理器の中で叩く強さとして使うので、振幅を渡すと
 * 二重に掛かる。タイでつないだ音は 1 つの音として渡す。別々に渡すと叩き直される。
 * 先頭(`legato` が立っていない)だけ出して、長さはつながり全体(`tieSpan`)
 */
/** `@m` の揺れ。チップと同じく、書いたもの(vib)が無ければ深さだけ(vibrato)。無ければ null */
function modalVib(ev) {
  const depth = ev.vib ? ev.vib.depth : ev.vibrato;
  if (!(depth > 0)) return null;
  return [depth, ev.vib && ev.vib.speed != null ? ev.vib.speed : VIB_SPEED, ev.vib && ev.vib.delay > 0 ? ev.vib.delay * TONE_FRAME : 0];
}

function modalEvent(ev, wf, freq, amp, t0, t1) {
  if (ev.legato) {
    // つながりの続き。先頭で出してある。弦の楽器では、高さの違う続き(スラー `c&e`)を
    // ハンマリング・プリングとして渡す。鳴っている弦の高さだけを変える(処理器の sl)
    if (wf.kind === 'modal' && ev.tieId != null) {
      return { t: t0, p: wf.patch, f: freq,
        v: Math.max(0, Math.min(1, (ev.vol ?? 0) / 15)), sl: ev.tieId, nf: 1 };
    }
    return null;
  }
  return {
    t: t0, p: wf.patch, f: freq,
    // スラーの続きが、どの弦を動かすかを探すための番号
    ...(wf.kind === 'modal' && ev.tieId != null ? { tie: ev.tieId } : {}),
    // ポルタメント(`c*e`)。鳴っている弦を、音符の長さ(gate)をかけて滑らせる。
    // 半音の数で渡す
    ...(wf.kind === 'modal' && ev.glide > 0
      ? { gs: 12 * Math.log2(ev.glide / ev.freq), gl: Math.max(0.01, ev.gate ?? (t1 - t0)) }
      : {}),
    // ビブラート(`@m`)。深さ(セント)・速さ(Hz)・遅れ(秒)。鳴っている弦の高さを揺らす(2026-10-20)
    ...(wf.kind === 'modal' && modalVib(ev) ? { vb: modalVib(ev) } : {}),
      v: Math.max(0, Math.min(1, (ev.vol ?? 0) / 15)),
      d: Math.max(0.001, ev.tieSpan ?? (t1 - t0)),
      // ロールの終わりの強さ(生音の区間の `@to`)。始まりの v から少しずつ変える
      ...(ev.rollTo != null ? { v2: Math.max(0, Math.min(1, ev.rollTo / 15)) } : {}),
      // 棒を叩く場所(生音の区間の `@strike`)。端が 0、真ん中が 0.5
      ...(wf.kind === 'modal' && ev.strike != null ? { st: ev.strike } : {}),
      // 右ペダルを踏んでいる区間(時計の秒)。生音の区間の `@ped`。同じパッチの声すべてに効く
      ...(ev.pedals && ev.pedBase != null ? { pd: ev.pedals.map(([a, b]) => [ev.pedBase + a, ev.pedBase + b]) } : {}),
      // サブチャンネルの番号。和音の中の何番目か(書いた順)。
      // フィルタをサブチャンネル 1 本につき 1 台持たせるのに使う。
      // 重ねたもの(オクターブ重ね・デチューン・エコーの写し)は元の音と
      // 同じ番号になる — 厚くするためのものなので、親と同じフィルタを通る
      sc: ev.sub | 0,
  };
}

/**
 * 処理器の登録に渡すもの。音符のほかにパッチ(鳴らし方の定義)を渡すので、
 * 作るときの引数を自分で組む `options` を持つ。
 * 止める合図(`{ cut: true }`)は chip と同じ名前。
 *
 * modal は出口を 2 本持つ(`buses`)。1 本目が左へ行く束、2 本目が右へ行く束で、
 * 足せばいつも声そのものに戻る。どこに置くかはエンジンが決める(`_panPair`)
 */
export const MODAL_CHIP = {
  kind: 'modal',
  node: MODAL_NODE,
  code: MODAL_CODE,
  voices: MODAL_VOICES,
  buses: 2,
  event: modalEvent,
  options: (list) => ({ numberOfInputs: 0, outputChannelCount: [2],
    processorOptions: { events: list,
      patches: patchesOf({ ...MODAL_PATCHES, ...MML_PATCHES.modal }, compileModal) } }),
  // MML で作ったパッチ。音符を流し込むたびに一緒に渡す(MML_PATCHES)
  extra: () => patchesOf(MML_PATCHES.modal, compileModal),
};

/** 管(息の式)。出口は 1 本 */
export const BRASS_CHIP = {
  kind: 'brass',
  node: BRASS_NODE,
  code: BRASS_CODE,
  voices: BRASS_VOICES,
  event: modalEvent,
  options: (list) => ({ numberOfInputs: 0, outputChannelCount: [1],
    processorOptions: { events: list,
      patches: patchesOf({ ...BRASS_PATCHES, ...MML_PATCHES.brass }, compileBrass) } }),
  extra: () => patchesOf(MML_PATCHES.brass, compileBrass),
};

registerChipKind(MODAL_CHIP.kind, MODAL_CHIP);
registerChipKind(BRASS_CHIP.kind, BRASS_CHIP);
registerModalVoices();
// 重ねる相手が増えたので、合成音色を並べ直す。組み合わせによっては、この音源が
// 入っていないと作れないものがある(`layerKickAir` は OPLL のバスドラを使う)
registerDefaultLayers();
// 分けて読み込んでも、エンジンのプリセットとして並ぶようにする
sealPresets();
