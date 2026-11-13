// 生音のまねと、電気で拾う楽器(`acoustic(…)` `electric(…)`)をエンジンへ入れる。
//
// 中身は 2 つに分かれている。共振器を回すもの(`modal.js`)と、息の式を回すもの
// (`brass.js`)で、処理器が別。名前の上ではどちらも `acoustic` / `electric` で、
// 曲を書く側はその区別を知らなくてよい。
//
// このファイルを読み込むと使えるようになる。読み込まなければエンジンには入らない
// (docs/SOUND_TOOL.md「音源ごとに分けて配る」)。縮めて 180KB ある。

import { registerModal, registerBrass, registerFamily, registerVoiceSyntax,
  registerVoiceDetail, registerAccentMaker, sealPresets, warn, VIB_SPEED } from './mml.js';
import { TONE_FRAME } from './tones.js';
import { registerDefaultLayers } from './layerpresets.js';
import { MODAL_CODE, MODAL_NODE, MODAL_PATCHES, MODAL_VOICES, MODAL_PARAMS, compileModal, applyMacro } from './modal.js';
import { BRASS_CODE, BRASS_NODE, BRASS_PATCHES, BRASS_VOICES, BRASS_PARAMS, compileBrass } from './brass.js';
import { buildInstrument, describeInstrument } from './modalspec.js';
import { presetKnob, resolveKnobs, setPath } from './knobpreset.js';
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
 * 外から足した共振器のパッチ(registerModalPatch)。名前 → 中身(畳む前)。
 *
 * MML_PATCHES と分けて持つ。あちらは曲の中の一時利用で、音符を流すたびに全部渡す。
 * こちらはパラメータの値ごとにパッチが増えるので、処理器ごとにまだ渡していないものだけを渡す
 * (sound/analog.js の USER_PATCHES と同じ形。2026-10-30)
 */
const USER_MODAL = {};
/** USER_MODAL の版。入れ直すたびに上がる */
const USER_MODAL_VER = {};
/** 処理器ごとに、どの版まで渡したか。node → (名前 → 版) */
const MODAL_SENT = new WeakMap();
/** パラメータ。音色の名前 → パラメータの名前 → `{min, max, default, unit, desc, apply}` */
const MODAL_KNOBS = {};

/** ほかの音源セットの名前空間。共振器の音色がここへ入ると、名前と鳴り方が食い違う */
const MODAL_OTHER_SETS = ['opll', 'opl', 'opm', 'opn', 'opna', 'analog', 'acoustic', 'electric'];

/**
 * 共振器で鳴らす音色を、外から足す(アドオン用)。
 *
 * 中身の形は `MODAL_PATCHES` と同じ。名前はアドオン自身の名前空間で名乗る(`tr909::openHihat`)。
 * 同じ名前がもうあれば止まる。わざと差し替えるときは `overwrite: true`。
 *
 * `knobs` を渡すと、呼ぶときに値を渡せる(`@{tr909::openHihat(decay: 0.4)}`)。
 * 書き方は registerAnalogPatch と同じで、`apply(patch, value)` がパッチの写しを受け取り、値を入れたパッチを返す。
 * 値の組み合わせごとにパッチを 1 つ作って覚えておく。
 *
 * 鳴らしている最中に足してもよい。処理器へは音符と一緒に届く。
 *
 * `choke` にグループの名前(文字列)を入れると、同じグループの別の音色が同じチャンネルで鳴ったとき、
 * 鳴っている声が 10ms で落ちる(閉じたハイハットで開いたハイハットを止める。`tr909hat`)。
 * 同じ音色どうし(パラメータの値だけ違うものも)は落とさない。違うチャンネルにも効かない。
 * 無ければ何もしない
 *
 * @param {string} name 音色の名前
 * @param {object} def パッチの中身(`MODAL_PATCHES` と同じ形)
 * @param {{role?:string, desc?:string, version?:string, tags?:string[], knobs?:object, overwrite?:boolean}} [opts]
 * @returns {number} 音色の番号
 */
export function registerModalPatch(name, def, opts = {}) {
  const voice = String(name);
  const ns = voice.includes('::') ? voice.split('::')[0] : '';
  if (!ns || MODAL_OTHER_SETS.includes(ns)) {
    throw new Error(`[ChpTnSnd] "${name}" は自分の名前空間で名乗ってください(\`tr909::openHihat\` のように)`);
  }
  if (!def || typeof def !== 'object') {
    throw new Error(`[ChpTnSnd] ${voice} のパッチがありません(中身のオブジェクトを渡してください)`);
  }
  for (const [k, kn] of Object.entries(opts.knobs || {})) {
    if (!/^[a-z][A-Za-z0-9]*$/.test(k)) {
      throw new Error(`[ChpTnSnd] ${voice}: パラメータ "${k}" は英字で始まる英数字で名乗ります`);
    }
    if (!(Number.isFinite(kn.min) && Number.isFinite(kn.max) && Number.isFinite(kn.default))
      || kn.min > kn.default || kn.default > kn.max) {
      throw new Error(`[ChpTnSnd] ${voice}: パラメータ "${k}" には min ≦ default ≦ max の数が要ります`);
    }
    if (typeof kn.apply !== 'function') {
      throw new Error(`[ChpTnSnd] ${voice}: パラメータ "${k}" にはパッチを変える apply(patch, value) が要ります`);
    }
  }
  const { knobs, ...rest } = opts;
  const id = registerModal(voice, { patch: voice }, rest);
  USER_MODAL[voice] = def;
  USER_MODAL_VER[voice] = (USER_MODAL_VER[voice] || 0) + 1;
  if (knobs && Object.keys(knobs).length) {
    MODAL_KNOBS[voice] = knobs;
    try {
      registerFamily(voice, { desc: opts.desc ?? null, overwrite: true,
        params: Object.entries(knobs).map(([k, kn]) => ({ name: k, min: kn.min, max: kn.max, default: kn.default,
          ...(kn.unit ? { unit: kn.unit } : {}), desc: kn.desc ?? null })) });
    } catch (e) { /* すでに入っている */ }
  } else {
    delete MODAL_KNOBS[voice];
  }
  return id;
}

/**
 * 最初から入っている楽器のうち、呼ぶときに重さ(light)を渡せるもの。楽器の名前 → `{max, desc}`。
 *
 * 重い楽器にだけ持たせる(docs/TODO.md の 43 番)。既定はパッチの light。
 * 1 が元の音で、0〜1 が勧める範囲。1 より上は新しい音を作るための余地で、上限は楽器ごとに決める。
 * 値と重さの対応は modal.js の並べ方(modalTable)が持つので、ここでは範囲と説明だけを書く
 */
const HEAVY_MODAL = {
  // ドラは 1 で共振器 160 本。既定の 0.5 は 104 本で、light を逆の向きにする前(既定 0.5)と同じ音(2026-11-01)。
  // 1 より上は細かい倍音を増やす。ドラの細かい倍音は小さい(cloud 0.004)ので、2 で 267 本にしても、ずれは 0.5dB ほど。
  // それより上は重さに見合わないので、上限は 2
  gong: { max: 2, desc: 'How heavy the gong is to compute. 1 is the full measured sound, 160 resonators. 0.5 (the default) leaves out the weakest modes and thins the high cloud, 104 resonators; 0 keeps 48. 0 to 1 is the usual range. Above 1 the faint high cloud gets denser and smoother at the same level, a new sound rather than a closer one, 267 resonators at 2. Measured against light 1: 0.5 costs about 0.7 of it and differs by about 0.7 dB; 0.1 costs about 0.45 and differs by about 2 dB; 2 costs about 1.6 and differs by about 0.5 dB.' },
};

/** パラメータの値を入れたパッチの名前。値の組み合わせが同じなら同じ名前になる */
function modalKnobPatch(voice, vargs) {
  const kn = MODAL_KNOBS[voice];
  // 名前を付けた値の組(preset)を選んでいれば、書かなかった軸は組の値になる(sound/knobpreset.js)
  const { vals, set, same, key: pi } = resolveKnobs(kn, vargs);
  // どの値も、パッチがもともと持っている値(same)なら、元のパッチをそのまま鳴らす。
  // 特徴の強さの軸(smart)を全部の楽器で呼ぶときに渡せるようにしたので(2026-11-05)、
  // 何も渡さない音符まで値ごとのパッチに置き換わり、処理器へ渡すパッチが増えるのを避ける
  if (same) return voice;
  const key = `${voice}|${pi != null ? `preset=${pi},` : ''}${vals.map(([k, v]) => `${k}=${+v.toFixed(6)}`).join(',')}`;
  if (!USER_MODAL[key]) {
    // 外から足したパッチか、最初から入っている楽器
    let p = structuredClone(USER_MODAL[voice] ?? MODAL_PATCHES[voice]);
    for (const [k, v] of vals) p = kn[k].apply(p, v) || p;
    // 組の中の、軸でない場所(t60 など)は、軸を当てたあとに上書きする
    for (const [k, v] of Object.entries(set || {})) setPath(p, k, v);
    USER_MODAL[key] = p;
    USER_MODAL_VER[key] = 1;
  }
  return key;
}

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
  const ELECTRIC = new Set(['rhodes', 'fingerBass', 'pickBass', 'slapBass', 'cutting', 'twang']);
  const MODAL_ROLE = {
    brush: 'perc', brushSweep: 'perc', ride: 'perc', conga: 'perc', cowbell: 'perc',
    bass: 'bass', fingerBass: 'bass', pickBass: 'bass', slapBass: 'bass', bassSlap: 'bass', bassSlapHit: 'perc', guitar: 'lead', cutting: 'chord', twang: 'lead', piano: 'lead', rhodes: 'lead', timpani: 'perc', timpaniRoll: 'perc', gong: 'perc',
    marimba: 'lead', vibraphone: 'chord', glockenspiel: 'counter', woodblock: 'perc', kokyu: 'lead', cello: 'counter',
    trumpet: 'lead', trombone: 'counter', tuba: 'bass', bassoon: 'bass', bassClarinet: 'bass', contrabass: 'bass', tenor: 'lead', alto: 'lead', baritone: 'bass',
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
      // 印(preview など)も楽器ごと
      ...(def.tags ? { tags: def.tags } : {}),
      dev: def.dev, devNote: def.devNote });
    // 呼ぶときに渡せる値。重い楽器の重さ(`@{acoustic::gong(light: 0.3)}`)と、
    // 特徴の強さの軸(パッチの macros。`@{electric::twang(twang: 0.5)}`)。
    // 軸は #voice の smart{…} と同じもので、同じ意味になる。1 がパッチの値(docs/SOUND_TOOL.md の
    // 「お勧めと誇張」。2026-11-05。前は #voice でしか書けなかった)
    const knobs = {};
    const heavy = kind === 'modal' && HEAVY_MODAL[name];
    if (heavy) {
      knobs.light = { min: 0, max: heavy.max, default: def.light ?? 1, same: def.light ?? 1, desc: heavy.desc,
        apply: (p, v) => { p.light = v; return p; } };
    }
    if (kind === 'modal') {
      for (const [mk, m] of Object.entries(def.macros || {})) {
        knobs[mk] = { min: m.min ?? 0, max: m.max ?? 2, default: 1, same: 1, desc: m.desc ?? null,
          apply: (p, v) => applyMacro(p, def, mk, v) };
      }
    }
    // 名前を付けた値の組(パッチの presets)。`@{electric::twang(hot)}`。音色は増やさない
    const pk = kind === 'modal' ? presetKnob(`${family}::${name}`, def.presets, knobs, def) : null;
    if (pk) knobs.preset = pk;
    if (Object.keys(knobs).length) {
      MODAL_KNOBS[name] = knobs;
      try {
        registerFamily(`${family}::${name}`, { desc: def.desc, overwrite: true,
          params: Object.entries(knobs).map(([k, kn]) => ({ name: k, min: kn.min, max: kn.max, default: kn.default, desc: kn.desc,
            ...(kn.words ? { words: kn.words } : {}) })) });
      } catch (e) { /* すでに入っている */ }
    }
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
  // アクセント(`#accent`)で数を変えた音色を作る。元のパッチを写して、書いた数だけ変える
  for (const [kind, PARAMS, TABLE] of [['modal', MODAL_PARAMS, MODAL_PATCHES], ['brass', BRASS_PARAMS, BRASS_PATCHES]]) {
    registerAccentMaker(kind, (name, base, params) => {
      const own = MML_PATCHES[kind][base.patch];
      const from = own ? own.from : base.patch;
      const def = structuredClone(own || TABLE[base.patch] || {});
      for (const w of accentPatch(def, params, PARAMS)) warn(`[ChpTnSnd] MML: 音色 "${base.name}" の #accent: ${w}`);
      MML_PATCHES[kind]['#' + name] = { ...def, from };
      const reg = kind === 'modal' ? registerModal : registerBrass;
      reg(name, { patch: '#' + name }, { role: base.role, desc: `Accent of ${base.name}.`, overwrite: true });
    });
  }
  // describeVoice の detail。何を書けて、どこまで動くか
  for (const kind of ['modal', 'brass']) {
    registerVoiceDetail(kind, (w) => {
      const own = MML_PATCHES[kind][w.patch];
      return own ? describeInstrument(own.from, own) : describeInstrument(w.patch);
    });
  }
}

/**
 * アクセントの数をパッチへ当てる。`head.velo` のように点でつないだ場所を、
 * 数だけならその値に、`+` `-` 付きならいまの値から動かす。範囲(PARAMS の min・max)で止める。
 *
 * 高さの目印(zones)がその場所を書いていれば、目印の値も同じように動かす。
 * 目印の値が勝つので、パッチの値だけ動かしても鳴り方が変わらない(コンガ)
 * @returns {string[]} 知らせ
 */
function accentPatch(def, params, PARAMS) {
  const said = [];
  const get = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const set = (o, path, v) => { const ks = path.split('.'); let a = o; for (let i = 0; i < ks.length - 1; i++) a = a[ks[i]] ??= {}; a[ks.at(-1)] = v; };
  for (const { path, rel, n } of params) {
    const p = PARAMS[path.split('.').at(-1)];
    if (!p) { said.push(`"${path}" というパラメータはありません。読み飛ばします`); continue; }
    if (p.group === 'head' && !path.startsWith('head.')) {
      said.push(`"${path}" は叩く頭のパラメータです。head.${path} と書きます。読み飛ばします`);
      continue;
    }
    const move = (now) => {
      const v = rel ? (typeof now === 'number' ? now : 0) + n : n;
      return Math.min(p.max ?? Infinity, Math.max(p.min ?? -Infinity, v));
    };
    set(def, path, move(get(def, path)));
    for (const z of def.zones || []) if (path in z.set) z.set[path] = move(z.set[path]);
  }
  return said;
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

/** 音色のパッチ(畳む前)。曲の中で作ったもの(#voice・アクセント)が先 */
function patchDef(wf) {
  return MML_PATCHES[wf.kind]?.[wf.patch] ?? (wf.kind === 'modal' ? MODAL_PATCHES : BRASS_PATCHES)[wf.patch];
}

function modalEvent(ev, wf, freq, amp, t0, t1) {
  // かき鳴らし(strum)。和音の音を、書いた順に 1 本ずつずらして鳴らす。下から書けばダウン、上から書けばアップ。
  // 終わりは動かさない(離すところは揃ったまま)。ギターの和音を同時に鳴らすと、ピアノのように聞こえた(2026-11-02、カッティング)
  const sd = ev.chord != null && ev.sub > 0 && !ev.legato ? patchDef(wf)?.strum : 0;
  if (sd > 0) t0 = Math.min(t1 - 0.005, t0 + sd * ev.sub);
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
    // パラメータを持つ音色は、値を入れたパッチを鳴らす(registerModalPatch)
    t: t0, p: wf.kind === 'modal' && MODAL_KNOBS[wf.patch] ? modalKnobPatch(wf.patch, ev.vargs) : wf.patch, f: freq,
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
      // 鳴らす長さ。余韻(`relTail`)は t1 の後ろへ足された飾りなので引く。
      // 引かないと、次が休符のときだけ離すのが遅れる(既定の `flat` で 10ms。2026-11-05)
      d: Math.max(0.001, (ev.tieSpan ?? (t1 - t0)) - (ev.relTail || 0)),
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
      patches: patchesOf({ ...MODAL_PATCHES, ...MML_PATCHES.modal, ...USER_MODAL }, compileModal) } }),
  // MML で作ったパッチ。音符を流し込むたびに一緒に渡す(MML_PATCHES)。
  // 外から足したパッチ(USER_MODAL)は、その処理器へまだ渡していないものだけ
  extra: (node) => {
    let sent = MODAL_SENT.get(node);
    if (!sent) { sent = new Map(); MODAL_SENT.set(node, sent); }
    const add = {};
    for (const [k, d] of Object.entries(USER_MODAL)) {
      if (sent.get(k) === USER_MODAL_VER[k]) continue;
      add[k] = d;
      sent.set(k, USER_MODAL_VER[k]);
    }
    return patchesOf({ ...MML_PATCHES.modal, ...add }, compileModal);
  },
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
