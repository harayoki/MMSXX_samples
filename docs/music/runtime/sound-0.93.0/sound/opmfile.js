// **`.opm` を読む**(VOPM の音色ファイル。YM2151 = X68000 やアーケードのもの)。
//
// テキストなので、そのまま読める。1 音色が 7 行:
//
//   @:0 名前
//   LFO: LFRQ AMD PMD WF NFRQ        (音色が揺らすときだけ読む。NFRQ はノイズの周波数)
//   CH:  PAN FL CON AMS PMS SLOT NE  (NE が 0 でなければオペ 4 がノイズ)
//   M1:  AR D1R D2R RR D1L TL KS MUL DT1 DT2 AME
//   C1:  (同じ 11 個)
//   M2:  (同じ)
//   C2:  (同じ)
//
// **並び順は M1 C1 M2 C2 = そのまま鎖の順。** レジスタの並び(M1 M2 C1 C2)とは
// 違うので取り違えやすいところだが、ファイルのほうは結線の順で並んでいる。
//
// ---- 翻訳が要らなくなった(2026-09-27) ----
//
// 前はここに近似が 3 つあった。レートを秒へ、DT1 をセントへ、
// D1L を 0〜1 へ。鳴らす側が実機の目盛りを持っていなかったので、
// 読むときに直すしかなかった。
//
// エンジンが OPM そのものになったので、**値をそのまま置くだけになった。**
// レジスタの並びが一致するので、読み違えようがない。
//
// 名前が `sound/opm.js` から変わっている。**`sound/ym2151.js` がチップ、
// こちらがファイルの読み。**同じ名前だとどちらの話か分からなくなる。

import { opmPatch } from './ym2151.js';

/**
 * `.opm` のテキストを読んで、音色の並びにする。
 *
 * @param {string} text
 * @returns {{name:string, index:number, patch:object, raw:object}[]}
 */
export function parseOPM(text) {
  const out = [];
  let cur = null;
  const push = () => {
    if (!cur || cur.ops.length < 4) return;
    out.push({
      name: cur.name,
      index: cur.index,
      raw: { fl: cur.fl, con: cur.con, pms: cur.pms, ams: cur.ams, ops: cur.ops },
      patch: opmPatch({
        alg: cur.con,
        fb: cur.fl,
        pms: cur.pms,
        ams: cur.ams,
        // LFO はチップ全体のものだが、音色が揺らすときだけ持たせる(揺らさないなら要らない)
        ...((cur.pms || cur.ams) && cur.lfo ? { lfo: cur.lfo } : {}),
        // ノイズを入れている音色(NE が 0 でない)だけ、ノイズの周波数を持たせる
        ...(cur.ne ? { noise: cur.nfrq } : {}),
        // 11 個の数値が、そのままレジスタの値になる
        ops: cur.ops.map(([ar, d1r, d2r, rr, d1l, tl, ks, mul, dt1, dt2, ame]) => ({
          ar, d1r, d2r, rr, d1l, tl, ks, mul, dt1, dt2, ame,
        })),
      }),
    });
    cur = null;
  };
  for (const line of String(text).split(/\r?\n/)) {
    const s = line.replace(/\/\/.*$/, '').trim();
    if (!s) continue;
    const m = s.match(/^@:\s*(\d+)\s*(.*)$/);
    if (m) {
      push();
      cur = { index: Number(m[1]), name: (m[2] || ('voice' + m[1])).trim(),
              ops: [], fl: 0, con: 0, pms: 0, ams: 0, lfo: null, ne: 0, nfrq: 0 };
      continue;
    }
    if (!cur) continue;
    const num = (s.split(':')[1] || '').trim().split(/\s+/).map(Number);
    if (/^LFO\s*:/i.test(s)) {
      // LFRQ AMD PMD WF NFRQ
      cur.lfo = { rate: num[0] | 0, amd: num[1] | 0, pmd: num[2] | 0, wf: num[3] | 0 };
      cur.nfrq = (num[4] | 0) & 31;
    } else if (/^CH\s*:/i.test(s)) {
      cur.fl = num[1] | 0;
      cur.con = (num[2] | 0) & 7;
      cur.ams = (num[3] | 0) & 3;
      cur.pms = (num[4] | 0) & 7;
      // PAN FL CON AMS PMS SLOT NE。NE が 0 でなければノイズ入り
      cur.ne = (num[6] | 0) !== 0;
    } else if (/^(M1|C1|M2|C2)\s*:/i.test(s)) cur.ops.push(num);
  }
  push();
  return out;
}

/**
 * 読んだ音色をまとめて登録する。
 *
 * @param {string} text `.opm` の中身
 * @param {(name:string, patch:object)=>void} register `registerOPM` を渡す
 * @param {{prefix?:string}} [o] 名前の前置き(既定 `opm`。PC-88 の音色集なら `opn` を渡す)
 * @returns {string[]} 登録した名前
 */
export function registerOpmFile(text, register, o = {}) {
  const prefix = o.prefix ?? 'opm';
  const names = [];
  for (const v of parseOPM(text)) {
    // 名前は英数字だけ残す(MML の @{...} で書けるように)
    const tail = v.name.replace(/[^\w]/g, '') || ('v' + v.index);
    const name = prefix + tail.charAt(0).toUpperCase() + tail.slice(1);
    register(name, v.patch);
    names.push(name);
  }
  return names;
}
