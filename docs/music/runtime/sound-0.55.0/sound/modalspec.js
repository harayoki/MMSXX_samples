// 生音の音色(`sound/modal.js` と `sound/brass.js`)を、数で書き換えて作る。
//
//   #voice myGuitar = @acoustic{ guitar, t60 4.2, head{ sharp 0.8 }, body{ 2{ freq 215 } }, smart{ classical 1.3 } }
//
// ---- 何をするか ----
//
// MML の `@acoustic{…}` `@electric{…}` で書いた中身(mml.js の readVoiceTree が読んだ木)から、
// 元にした楽器のパッチを写して書き換えたものを作る。登録と処理器へ渡すのは audio.js。
// ここは数を確かめて、パッチを組むだけ。
//
// パラメータの一覧(何があり、どこまで動くか)もここで作る。`describeVoice` の `detail` と、
// 書き間違えたときのエラーの文が同じものを出す。マニュアルを開かずに分かるようにするため
// (2026-10-13)。
//
// ---- 決まり ----
//
// - 最初に元にする楽器の名前を書く。書かなかった値は、その楽器の値のまま
// - 書けるのは、その楽器のパッチが持っているものだけ。聞くページのスライダーと同じ範囲
// - スマート(`smart{…}`)を先に当て、そのあとで直に書いた値を上書きする。書いた順によらない
// - 知らない名前と範囲の外の値はエラー。近い値に丸めない
// - 効く条件(`when`)が外れていて効かない値は、エラーにせず知らせる
// - 金管のベルと胴(`bell` `body`)は書けない。混ぜたあとに掛けるもので、エンジンは掛けない。
//   書いても効かないので、黙って通さない

import { MODAL_PATCHES, MODAL_PARAMS, MODAL_BODY, applyMacro } from './modal.js';
import { BRASS_PATCHES, BRASS_PARAMS, applyBrassMacro } from './brass.js';

/** 楽器の名前から、どちらの音源か */
export function instrumentKind(name) {
  if (MODAL_PATCHES[name]) return 'modal';
  if (BRASS_PATCHES[name]) return 'brass';
  return null;
}

const tableOf = (kind) => (kind === 'modal' ? MODAL_PATCHES : BRASS_PATCHES);
const paramsOf = (kind) => (kind === 'modal' ? MODAL_PARAMS : BRASS_PARAMS);

/** パラメータ 1 つの説明。範囲・推奨範囲・既定値・効く条件 */
function row(name, d, value, rec) {
  return {
    name, desc: d.desc ?? null, unit: d.unit ?? null, min: d.min, max: d.max,
    ...(d.step ? { step: d.step } : {}),
    default: value, recommended: rec || null,
    ...(d.when ? { when: d.when.map((c) => ({ ...c })) } : {}),
  };
}

/**
 * 楽器 1 つのパラメータの一覧。`describeVoice` の `detail` になる。
 *
 * 並べるのは、その楽器のパッチが持っているものだけ(聞くページと同じ)。
 * 全部の楽器に共通の一覧を並べると、ギターに `pickup` が出るように、効かないものが混ざる。
 *
 * @param {string} instrument 楽器の名前(MODAL_PATCHES か BRASS_PATCHES のキー)
 * @param {object} [def] いまの値。省くと楽器の既定値
 */
export function describeInstrument(instrument, def) {
  const kind = instrumentKind(instrument);
  if (!kind) return null;
  const base = tableOf(kind)[instrument];
  const cur = def || base;
  const P = paramsOf(kind);
  const rec = base.range || {};
  const top = Object.keys(P).filter((k) => P[k].group !== 'head' && typeof cur[k] === 'number')
    .map((k) => row(k, P[k], cur[k], rec[k]));
  const out = {
    instrument, kind,
    smart: Object.entries(base.macros || {}).map(([k, m]) => ({
      name: k, desc: m.desc ?? null, min: m.min, max: m.max, default: 1,
    })),
    params: top,
  };
  if (kind === 'modal') {
    out.head = Object.keys(P).filter((k) => P[k].group === 'head' && cur.head && typeof cur.head[k] === 'number')
      .map((k) => row(k, P[k], cur.head[k], rec['head.' + k]));
    out.body = (cur.body || []).map((pk, i) => Object.keys(MODAL_BODY)
      .map((k) => row(k, MODAL_BODY[k], pk[k], rec[`body.${i}.${k}`])));
  }
  return out;
}

const num = (v) => (Math.abs(v) >= 100 ? String(Math.round(v * 10) / 10) : String(+Number(v).toPrecision(4)));

/** 一覧の 1 行。エラーの文と CLI で同じ形にする */
export function rowText(r) {
  const u = r.unit ? ' ' + r.unit : '';
  const rec = r.recommended ? `  推奨 ${num(r.recommended[0])}〜${num(r.recommended[1])}` : '';
  const when = r.when ? `  効く条件 ${r.when.map((c) => `${c.key} ${c.gt != null ? '> ' + c.gt : c.lt != null ? '< ' + c.lt : '≠ ' + c.ne}`).join(' かつ ')}` : '';
  return `${r.name.padEnd(12)} ${num(r.min)}〜${num(r.max)}${u}${rec}  既定 ${num(r.default)}${when}`;
}

/** 一覧を字にする。どこに書けるか(`smart{ }` `head{ }` など)ごとに並べる */
export function detailText(d) {
  const L = [];
  const put = (title, rows) => { if (rows.length) { L.push(title); for (const r of rows) L.push('  ' + rowText(r)); } };
  if (d.smart.length) {
    L.push('smart{ }');
    for (const m of d.smart) L.push(`  ${m.name.padEnd(12)} ${num(m.min)}〜${num(m.max)}  既定 1`);
  }
  if (d.head) put('head{ }', d.head);
  (d.body || []).forEach((rows, i) => put(`body{ ${i + 1}{ } }`, rows));
  put('(そのまま書くもの)', d.params);
  return L.join('\n');
}

/**
 * `@acoustic{…}` の木から、パッチを組む。
 *
 * @param {Array<{key:string, value:any}>} tree mml.js の readVoiceTree が読んだもの
 * @param {{word:string, name:string, allowed:(instrument:string)=>boolean, others:string}} ctx
 *   word = `acoustic` か `electric`。name = 作る音色の名前(エラーの文に出す)。
 *   allowed = その仲間に入っている楽器か。others = 入っていないときに勧める仲間の名前
 * @returns {{kind:string, instrument:string, def:object, warnings:string[]}}
 */
export function buildInstrument(tree, ctx) {
  const head = `[ChpTnSnd] MML: 音色 "${ctx.name}" の @${ctx.word}`;
  const fail = (msg) => { throw new Error(`${head}${msg}`); };
  const first = tree[0];
  const names = [...Object.keys(MODAL_PATCHES), ...Object.keys(BRASS_PATCHES)].filter(ctx.allowed);
  if (!first || first.value !== null) {
    fail(` は、最初に元にする楽器の名前を書きます(${names.join(' ')})`);
  }
  const instrument = first.key;
  const kind = instrumentKind(instrument);
  if (!kind) fail(` の "${instrument}" という楽器はありません(${names.join(' ')})`);
  if (!ctx.allowed(instrument)) fail(` に ${instrument} は書けません。@${ctx.others}{…} で書きます`);
  const base = tableOf(kind)[instrument];
  const P = paramsOf(kind);
  const list = () => '\n' + instrument + ' で書けるもの:\n' + detailText(describeInstrument(instrument));
  const seen = new Set();
  const once = (path) => {
    if (seen.has(path)) fail(` に ${path} が 2 度書いてあります`);
    seen.add(path);
  };
  // 数を確かめる。範囲の外は丸めずに止める
  const check = (path, d, v, rec) => {
    if (typeof v !== 'number') fail(` の ${path} は数で書きます\n  ${rowText(row(path, d, getAt(base, path), rec))}`);
    if (v < d.min || v > d.max) {
      fail(` の ${path} ${num(v)} は範囲の外です\n  ${rowText(row(path, d, getAt(base, path), rec))}`);
    }
    if (d.step && Math.abs(v / d.step - Math.round(v / d.step)) > 1e-9) {
      fail(` の ${path} ${num(v)} は ${d.step} きざみで書きます\n  ${rowText(row(path, d, getAt(base, path), rec))}`);
    }
    return v;
  };
  const rec = base.range || {};
  const smart = [];
  const direct = [];
  for (const it of tree.slice(1)) {
    if (it.value === null) {
      if (instrumentKind(it.key)) fail(` の楽器の名前は最初に 1 つだけ書きます("${it.key}")`);
      fail(` の "${it.key}" に値がありません` + list());
    }
    if (it.key === 'smart') {
      if (!Array.isArray(it.value)) fail(' の smart は smart{…} で書きます');
      const ms = base.macros || {};
      for (const s of it.value) {
        const m = ms[s.key];
        if (!m) {
          fail(` の smart に "${s.key}" はありません`
            + (Object.keys(ms).length ? `(${instrument} の smart: ${Object.keys(ms).join(' ')})` : `(${instrument} には smart がありません)`));
        }
        once('smart.' + s.key);
        if (typeof s.value !== 'number' || s.value < m.min || s.value > m.max) {
          fail(` の smart の ${s.key} は ${num(m.min)}〜${num(m.max)} の数で書きます(既定 1)`);
        }
        smart.push([s.key, s.value]);
      }
      continue;
    }
    if ((it.key === 'bell' || it.key === 'body') && kind === 'brass') {
      fail(` の ${it.key} は書けません。金管のベルと胴は混ぜたあとに掛けるもので、エンジンは掛けません`
        + '(聞くページだけが掛けています)。書いても鳴りが変わらないので止めます');
    }
    if (it.key === 'head' && kind === 'modal') {
      if (!Array.isArray(it.value)) fail(' の head は head{…} で書きます' + list());
      for (const h of it.value) {
        const d = P[h.key];
        if (!d || d.group !== 'head' || typeof base.head[h.key] !== 'number') {
          fail(` の head に "${h.key}" は書けません` + list());
        }
        once('head.' + h.key);
        direct.push(['head.' + h.key, check('head.' + h.key, d, h.value, rec['head.' + h.key])]);
      }
      continue;
    }
    if (it.key === 'body' && kind === 'modal') {
      const n = (base.body || []).length;
      if (!n) fail(` の body は書けません(${instrument} には胴の山がありません)`);
      if (!Array.isArray(it.value)) fail(` の body は body{ 1{freq …} } のように番号で書きます(1〜${n})`);
      for (const pk of it.value) {
        const i = Number(pk.key);
        if (!Number.isInteger(i) || i < 1 || i > n || !Array.isArray(pk.value)) {
          fail(` の body の "${pk.key}" は読めません。山は 1〜${n} の番号で、${n > 1 ? '2' : '1'}{freq 215} のように書きます`);
        }
        for (const f of pk.value) {
          const d = MODAL_BODY[f.key];
          if (!d) fail(` の body の ${i} に "${f.key}" は書けません(freq gain resonance)`);
          const path = `body.${i - 1}.${f.key}`;
          once(path);
          direct.push([path, check(path, d, f.value, rec[path])]);
        }
      }
      continue;
    }
    const d = P[it.key];
    if (!d || d.group === 'head' || typeof base[it.key] !== 'number') {
      fail(` に "${it.key}" は書けません` + list());
    }
    once(it.key);
    direct.push([it.key, check(it.key, d, it.value, rec[it.key])]);
  }
  // スマートを先に。楽器が並べた順で当てる(書いた順によらない)
  let def = structuredClone(base);
  const apply = kind === 'modal' ? applyMacro : applyBrassMacro;
  for (const k of Object.keys(base.macros || {})) {
    const s = smart.find((x) => x[0] === k);
    if (s) {
      const next = apply(def, base, k, s[1]);
      def = { ...def, ...next, head: next.head ?? def.head };
    }
  }
  for (const [path, v] of direct) setAt(def, path, v);
  // 効く条件が外れているもの。止めずに知らせる
  const warnings = [];
  for (const [path] of direct) {
    const key = path.split('.').pop();
    const d = path.startsWith('body.') ? MODAL_BODY[key] : P[key];
    const off = (d.when || []).filter((c) => {
      const v = getAt(def, c.key);
      return !(c.gt != null ? v > c.gt : c.lt != null ? v < c.lt : v !== c.ne);
    });
    if (off.length) {
      warnings.push(`${head} の ${path} は効きません(${off.map((c) => `${c.key} が ${c.gt != null ? c.gt + ' より大きい' : c.lt != null ? c.lt + ' より小さい' : c.ne + ' でない'}`).join('、')}ときだけ効きます)`);
    }
  }
  delete def.range;
  delete def.macros;
  return { kind, instrument, def, warnings };
}

function getAt(o, path) {
  return path.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
}
function setAt(o, path, v) {
  const ks = path.split('.');
  const last = ks.pop();
  ks.reduce((x, k) => x[k], o)[last] = v;
}
