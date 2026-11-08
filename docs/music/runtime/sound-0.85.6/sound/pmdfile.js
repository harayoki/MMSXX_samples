// PMD の MML に書かれた FM の音色を読む(PC-88 / PC-98 の OPN・OPNA のもの)。
//
// PMD の音色は、MML の中に `@` で書く。1 音色が 5 行:
//
//   @ 番号 結線 帰還             (行頭の @。後ろに =名前 を付けてもよい)
//    AR DR SR RR SL TL KS ML DT AMS   (オペ 1)
//    (同じ 10 個)                     (オペ 2)
//    (同じ)                           (オペ 3)
//    (同じ)                           (オペ 4)
//
// 数は 1 行にまとめても、何行に分けてもよい(42 個そろうまで数だけの行を拾う)。
// `;` から行末までは注釈。
// オペは鎖の順(1 → 2 → 3 → 4)で並ぶので、`opnPatch()` へそのまま渡せる。
// AMS はオペごとの LFO の音量変調の入 / 切。
//
// 書き方は手元の知識で書いた。名前の `=` と、オペが鎖の順で並ぶことは、本物の資料や
// 音色ではまだ確かめていない(docs/OPM_IMPORT.md の「PMD の音色」)。
//
// PMD にはほかに `@%`(レジスタの値を直に並べる形)などもあるが、まだ読まない。
// 見つけたら知らせて飛ばす。

import { opnPatch } from './ym2151.js';

/**
 * PMD の MML を読んで、FM の音色の並びにする。
 *
 * 音色の定義だけを拾う。パートの行(`A l8 cde` など)は読み飛ばす。
 *
 * @param {string} text
 * @returns {{index:number, name:string|null, patch:object, raw:object}[]}
 */
export function parsePMD(text) {
  const out = [];
  let cur = null;
  const done = () => {
    if (!cur) return;
    const n = cur.nums;
    if (n.length < 2 + 40) {
      console.warn(`[ChpTnSnd] PMD の音色 @${cur.index} は数が足りません(${n.length} 個。42 個要る)`);
      cur = null;
      return;
    }
    const [alg, fb] = n;
    const ops = [0, 1, 2, 3].map((i) => {
      const [ar, dr, sr, rr, sl, tl, ks, ml, dt, am] = n.slice(2 + i * 10, 12 + i * 10);
      return { ar, dr, sr, rr, sl, tl, ks, ml, dt, am };
    });
    out.push({ index: cur.index, name: cur.name, raw: { alg, fb, ops },
      patch: opnPatch({ alg, fb, ops }) });
    cur = null;
  };
  for (const line of String(text).split(/\r?\n/)) {
    const s = line.replace(/;.*$/, '');
    if (!s.trim()) continue;
    // 行頭の @ が音色の始まり。@% などの別の形は読まない
    if (/^@/.test(s)) {
      done();
      const m = s.match(/^@\s*(\d+)\s*(.*)$/);
      if (!m) {
        console.warn(`[ChpTnSnd] PMD の音色 "${s.trim().slice(0, 12)}" の形はまだ読めません(読むのは @ 番号 結線 帰還 の形)`);
        continue;
      }
      let rest = m[2];
      let name = null;
      const eq = rest.indexOf('=');
      if (eq >= 0) { name = rest.slice(eq + 1).trim() || null; rest = rest.slice(0, eq); }
      cur = { index: Number(m[1]), name, nums: nums(rest) };
      continue;
    }
    // 数だけの行は、前の音色の続き。42 個そろうまで拾う。
    // それ以外(パートの行など)が来たら音色は終わり
    if (cur && cur.nums.length < 42 && /^[\s\d,]+$/.test(s)) { cur.nums.push(...nums(s)); continue; }
    done();
  }
  done();
  return out;
}

/** 行の中の数を拾う。区切りは空白と `,` */
function nums(s) {
  return s.split(/[\s,]+/).filter(Boolean).map(Number).filter((x) => Number.isFinite(x));
}

/**
 * 読んだ音色をまとめて登録する。
 *
 * 名前は `opn` + PMD に付いていた名前(英数字だけ残す)。名前が無ければ番号(`opnV12`)。
 *
 * @param {string} text PMD の MML
 * @param {(name:string, patch:object)=>void} register `registerOPM` を渡す
 * @param {{prefix?:string}} [o] 名前の前置き(既定 `opn`)
 * @returns {string[]} 登録した名前
 */
export function registerPmdFile(text, register, o = {}) {
  const prefix = o.prefix ?? 'opn';
  const names = [];
  for (const v of parsePMD(text)) {
    const tail = (v.name || '').replace(/[^\w]/g, '') || ('v' + v.index);
    const name = prefix + tail.charAt(0).toUpperCase() + tail.slice(1);
    register(name, v.patch);
    names.push(name);
  }
  return names;
}
