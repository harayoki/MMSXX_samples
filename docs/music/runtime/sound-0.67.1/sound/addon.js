// アドオン(音色セットを外から足す)の口。
//
// 外で作った音色のまとまりを、1 ファイルで配れるようにする。読み込むと自分を
// 登録する(音源の pack と同じ作り)。
//
// ---- 名前空間がアドオンの名前 ----
//
// 音色の名前は `アドオンの名前::音色`。`id` がそのまま名前空間で、`::` を
// 含んでよい(`gamenotes::grdsSt1` の音色は `gamenotes::grdsSt1::lead`)。
//
// 頭 1 段だけを `id` にしない。同じ出し元がセットを増やしていくと、全部を
// 1 つのアドオンに入れることになり、版も依存もセットごとに持てない
// (2026-10-20 に決め直した)。
//
// 音源セットの名前空間(`analog::` `opll::`)とは別に立てる。1 つのアドオンが
// アナログと OPN の両方に頼ることがあるので、名前空間で音源を言えない。
// 何で鳴るのかは音色の `kind` に出る。曲を書く人には見えないが、書き出しと
// ドライバはそこを見る。
//
// ---- 依存を先に確かめる ----
//
// 要る音源が読み込まれていないまま音色を足すと、名前だけ並んで鳴らない。
// 読み込んだ時点で止めて、何が足りないかを言う。

import { findWave, WAVEFORMS, warn } from './mml.js';
import { hasChipKind } from './audio.js';
import { SOUND_VERSION } from './version.js';

/**
 * 音源セットの名前 → 読み込まれているかを見る `kind`。
 *
 * `core` はいつも付いてくるぶん(ファミコン・MSX の PSG と SCC・PC エンジン)。
 * `opn` と `opm` は同じ処理器で鳴るので、どちらの名前でも同じところを見る
 */
const SOURCES = {
  analog: ['analog'],
  acoustic: ['modal', 'brass'],
  electric: ['modal', 'brass'],
  opll: ['opll'],
  opl: ['opl'],
  opm: ['opm'],
  opn: ['opm'],
  opna: ['opnaRhythm'],
  // いつも付いてくるぶん。書いてよいが、確かめるものが無い
  core: [],
  ay: [],
  nes: [],
  fds: [],
  scc: [],
  pce: [],
};

/** 入っているアドオン。名前 → 覚え書き。名前がそのまま名前空間になる */
const ADDONS = new Map();

/** `>=0.41.0` の形だけ読む。版の比べ方は 1 つに絞る */
function engineOK(want) {
  if (!want) return true;
  const m = /^>=\s*(\d+)\.(\d+)\.(\d+)$/.exec(String(want).trim());
  if (!m) throw new Error(`[ChpTnSnd] アドオンの engine "${want}" は ">=0.41.0" の形で書きます`);
  const need = m.slice(1, 4).map(Number);
  const have = String(SOUND_VERSION).split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((have[i] || 0) !== need[i]) return (have[i] || 0) > need[i];
  }
  return true;
}

/**
 * アドオンを登録する。
 *
 * `install` の中で音色を足す(`registerAnalogPatch` `registerLayer` など)。
 * 足し終わったあとに、名乗った音色がそろっているかを突き合わせる。
 *
 * 音色の名前は `id::音色`。`id` で始まらないものを入れたら知らせる
 * (どのアドオンの音色なのかが名前から分からなくなるため)。
 *
 * ```js
 * registerAddon({
 *   id: 'gamenotes::grdsSt1',
 *   version: '1.0.0',
 *   desc: 'MGSDRV voices rebuilt on the subtractive synth.',
 *   needs: ['analog'],
 *   engine: '>=0.41.0',
 *   voices: ['gamenotes::grdsSt1::lead', 'gamenotes::grdsSt1::bass'],
 * }, () => {
 *   registerAnalogPatch('gamenotes::grdsSt1::lead', { … });
 *   registerAnalogPatch('gamenotes::grdsSt1::bass', { … });
 * });
 * ```
 *
 * @param {{id:string, version:string, desc?:string, needs?:string[],
 *          engine?:string, voices?:string[]}} spec アドオンの名乗り
 * @param {() => void} install 音色を足す関数
 * @returns {string[]} 入った音色の名前
 */
export function registerAddon(spec = {}, install) {
  // 名前がそのまま名前空間になるので、名前空間に書ける形に限る。
  // `::` を含んでよい(`gamenotes::grdsSt1`)
  const id = String(spec.id ?? '');
  if (!/^[a-z][A-Za-z0-9]*(?:::[a-z][A-Za-z0-9]*)*$/.test(id)) {
    throw new Error(`[ChpTnSnd] アドオンの id "${spec.id}" は小文字の英数字と`
      + ' `::` で書きます(音色の名前の頭になるので、`-` や `_` は使えません)。'
      + '各段は小文字で始めます(`gamenotes::grdsSt1`)');
  }
  if (ADDONS.has(id)) {
    throw new Error(`[ChpTnSnd] アドオン "${id}" はもう入っています`);
  }
  // 頭が音源セットと同じだと、名前と鳴り方が食い違う
  const head = id.split('::')[0];
  if (SOURCES[head]) {
    throw new Error(`[ChpTnSnd] "${head}" は音源セットの名前です。`
      + 'アドオンは別の名前を使ってください');
  }
  // 入れ子は許す(`gamenotes::grdsSt1` と `gamenotes::grdsSt1::extra` が
  // どちらもアドオン)。音色の出どころは登録のときに付けるタグで持っているので、
  // 名前の前方一致には頼っていない
  if (typeof install !== 'function') {
    throw new Error(`[ChpTnSnd] アドオン "${id}" に音色を足す関数がありません`);
  }
  // 要る音源。読み込まれていなければ、ここで止める
  const needs = (spec.needs || []).map(String);
  const missing = [];
  for (const n of needs) {
    const kinds = SOURCES[n];
    if (!kinds) {
      throw new Error(`[ChpTnSnd] アドオン "${id}" が要ると言う "${n}" は音源セットの名前ではありません`
        + `(あるのは ${Object.keys(SOURCES).join(' / ')})`);
    }
    if (kinds.length && !kinds.some((k) => hasChipKind(k))) missing.push(n);
  }
  if (missing.length) {
    throw new Error(`[ChpTnSnd] アドオン "${id}" は ${missing.join(' / ')} を要ります。`
      + 'その音源を読み込んでから、このアドオンを読み込んでください');
  }
  if (!engineOK(spec.engine)) {
    throw new Error(`[ChpTnSnd] アドオン "${id}" は engine ${spec.engine} を要ります`
      + `(いまは ${SOUND_VERSION})`);
  }

  const before = WAVEFORMS.length;
  install();
  // 足された音色に出どころを付ける。一覧から引けるようにするため
  const added = [];
  for (let i = before; i < WAVEFORMS.length; i++) {
    WAVEFORMS[i].addon = id;
    added.push(WAVEFORMS[i].name);
  }
  // 名乗った音色がそろっているか。書いてあるのに無ければ言う(黙って通すと、
  // 鳴らない名前が一覧に並ぶ)
  for (const n of spec.voices || []) {
    if (findWave(n) < 0) warn(`[ChpTnSnd] アドオン "${id}" は ${n} を名乗っていますが、登録されていません`);
  }
  // 名前空間の外へ出した音色は言う。どのアドオンのものかが名前から分からなくなる
  for (const n of added) {
    if (!n.startsWith(`${id}::`)) {
      warn(`[ChpTnSnd] アドオン "${id}" が ${n} を入れました`
        + `(音色の名前は "${id}::" で始めます)`);
    }
  }
  ADDONS.set(id, { id, version: String(spec.version ?? ''),
    desc: spec.desc ?? null, needs, engine: spec.engine ?? null, voices: added });
  return added;
}

/**
 * 入っているアドオンの一覧。`id` がそのまま音色の名前空間。
 * @returns {{id:string, version:string, desc:string|null,
 *            needs:string[], engine:string|null, voices:string[]}[]}
 */
export function listAddons() {
  return [...ADDONS.values()].map((a) => ({ ...a, voices: [...a.voices] }));
}

/**
 * その音源セットが読み込まれているか。アドオンが自分で確かめるために開けてある。
 * @param {string} name 音源セットの名前(`analog` `opll` `acoustic` など)
 */
export function hasSource(name) {
  const kinds = SOURCES[String(name)];
  if (!kinds) return false;
  return kinds.length === 0 || kinds.some((k) => hasChipKind(k));
}

/** 名前の分かる音源セットの一覧。アドオンの `needs` に書ける語 */
export function sourceNames() {
  return Object.keys(SOURCES);
}
