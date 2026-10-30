// **声が足りないときに、どれを黙らせるか決める。**
//
// ---- 何をするところか ----
//
// 曲(コンパイル済みのトラック)とバーチャルチップ(`sound/chipset.js`)を
// 突き合わせて、**枠からあふれている音符を選ぶ**。
// 選ぶだけで、鳴らすことも書き換えることもしない。
//
// **決めるところと、効かせるところを分ける。**同じ選び方を
// 静的(曲を先に詰める)にも動的(効果音が割り込む)にも使うため。
//
// ---- 消すのではなく、黙らせる ----
//
// 返すのは**区間**(いつからいつまで黙るか)で、音符そのものではない。
// 音符を消すと後ろが詰まって曲が変わるし、**途中だけ黙らせる**ことができない。
// 実機の駆動系が音量レジスタに 0 を書いて、また戻すのと同じ形
// (docs/ENGINE_TODO.md の「マスクは音符を消すのではなく、音量を 0 にする」)。
//
// ---- まだやっていないこと ----
//
// **和音の中で誰を落とすかの規則は、途中まで。**いちばん下を守るところまでで、
// 「他で鳴っているものから落とす」と「度数の順」はまだ入っていない
// (どちらも根音の推定が要る。docs/ENGINE_TODO.md の「和音のどれを落とすか」)。

import { costOfEvent, rankOf, ROLE_RANK } from './chipset.js';

/** 音が出ているあいだ。**枠を食うのは鳴っているあいだだけ**(切ったあとは空く) */
const spanOf = (ev) => [ev.t, ev.t + Math.max(0.01, ev.gate)];

/**
 * 時間を、**中身が変わらない区切り**に割る。
 *
 * 音符の始まりと終わりを全部集めて並べれば、そのあいだは
 * 「鳴っているものの顔ぶれ」が変わらない。**変わらない区間の中では
 * 1 回数えれば足りる。**
 *
 * @param {Array} tracks コンパイル済みのトラック(`compileMML` の戻り)
 * @returns {Array<{from:number, to:number, live:Array}>}
 *   `live` は `{ track, index, ev }` の並び
 */
export function slices(tracks) {
  const marks = new Set();
  tracks.forEach((t) => t.events.forEach((ev) => {
    const [a, b] = spanOf(ev);
    marks.add(a); marks.add(b);
  }));
  const at = [...marks].sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i + 1 < at.length; i++) {
    const from = at[i], to = at[i + 1];
    const live = [];
    tracks.forEach((t, track) => t.events.forEach((ev, index) => {
      const [a, b] = spanOf(ev);
      // **区間の頭で鳴っていれば、その区間は鳴っている。**
      // 区切りは音符の端で入れてあるので、頭を見れば足りる
      if (a <= from && b > from) live.push({ track, index, ev });
    }));
    if (live.length) out.push({ from, to, live });
  }
  return out;
}

/** その顔ぶれが食う枠。**種類ごとに足す** */
export function useOf(live) {
  const use = {};
  for (const { ev } of live) {
    for (const [k, n] of Object.entries(costOfEvent(ev))) use[k] = (use[k] || 0) + n;
  }
  return use;
}

/**
 * いちばん混んでいるところ。**この曲を鳴らすのに何本要るか。**
 * @returns {Record<string, number>}
 */
export function peakUse(tracks) {
  const top = {};
  for (const s of slices(tracks)) {
    for (const [k, n] of Object.entries(useOf(s.live))) {
      if (!(top[k] >= n)) top[k] = n;
    }
  }
  return top;
}

/**
 * そのチップに載るか。**載らないなら、どこがどれだけあふれているか。**
 * @returns {{ok:boolean, over:Record<string, number>}}
 */
export function fitsOn(tracks, chipset) {
  const top = peakUse(tracks);
  const over = {};
  for (const [k, n] of Object.entries(top)) {
    const have = chipset[k] || 0;
    if (n > have) over[k] = n - have;
  }
  return { ok: Object.keys(over).length === 0, over };
}

/**
 * **どれから落とすか。**小さいほうが先に落ちる。
 *
 * 1. `?` が付いていれば真っ先に。`!` は最後まで残す
 * 2. 役の順(旋律 > ベース > 対旋律 > 打楽器 > 和音・分散 > ノイズ)。
 *    音色が持っている `role` から出る
 * 3. **和音のいちばん下は守る。**最低音は転回そのものなので、
 *    度数の話より先に来る(docs/ENGINE_TODO.md)
 * 4. 同じ強さなら、**あとに書いたトラックから落ちる。**
 *    MML の並びがそのまま順になる
 */
function weightOf(one, lowest) {
  const { ev, track } = one;
  const mark = ev.mark === '!' ? 2 : ev.mark === '?' ? 0 : 1;
  // **和音として書いてあるものは、和音として扱う。**
  // 音色の役より、そちらのほうが細かい — `'ceg'` を矩形波(役は lead)で
  // 書いても、それは旋律ではなく和音。**和音全体が譲る側**に回る
  const inChord = ev.chord !== undefined;
  const rank = inChord ? Math.min(rankOf(ev), ROLE_RANK.chord) : rankOf(ev);
  // 和音の中でいちばん低い音は、1 段ぶん強くする。
  // **最低音は転回そのもの**なので、度数の話より先に守る
  const bottom = inChord && lowest.get(ev.chord) === ev.freq ? 1 : 0;
  return [mark, rank + bottom, -track];
}
const cmp = (a, b) => (a[0] - b[0]) || (a[1] - b[1]) || (a[2] - b[2]);

/**
 * 枠からあふれているものを選ぶ。
 *
 * @param {Array} tracks コンパイル済みのトラック
 * @param {Record<string, number>} chipset 持っている枠(`sound/chipset.js` の CHIPSETS)
 * @returns {Array<{track:number, index:number, from:number, to:number}>}
 *   黙らせる区間。**同じ音符が何度も出ることがある**(隣り合うものは繋げてある)
 */
export function planMask(tracks, chipset) {
  // 和音ごとのいちばん低い音。**書いた順ではなく鳴る高さで見る**
  const lowest = new Map();
  tracks.forEach((t) => t.events.forEach((ev) => {
    if (ev.chord === undefined) return;
    const now = lowest.get(ev.chord);
    if (now === undefined || ev.freq < now) lowest.set(ev.chord, ev.freq);
  }));

  const hits = [];
  for (const s of slices(tracks)) {
    const use = useOf(s.live);
    // 種類ごとに、あふれているぶんだけ落とす
    for (const [family, n] of Object.entries(use)) {
      let over = n - (chipset[family] || 0);
      if (over <= 0) continue;
      // その枠を食っているものだけを、弱い順に並べる
      const mine = s.live
        .filter((one) => costOfEvent(one.ev)[family] > 0)
        .sort((a, b) => cmp(weightOf(a, lowest), weightOf(b, lowest)));
      for (const one of mine) {
        if (over <= 0) break;
        over -= costOfEvent(one.ev)[family];
        hits.push({ track: one.track, index: one.index, from: s.from, to: s.to });
      }
    }
  }
  return merge(hits);
}

/** 同じ音符の、隣り合う区間を繋げる。**細切れのまま返すと数えにくい** */
function merge(hits) {
  const by = new Map();
  for (const h of hits) {
    const key = h.track + ':' + h.index;
    if (!by.has(key)) by.set(key, []);
    by.get(key).push(h);
  }
  const out = [];
  for (const list of by.values()) {
    list.sort((a, b) => a.from - b.from);
    let now = null;
    for (const h of list) {
      if (now && Math.abs(h.from - now.to) < 1e-9) { now.to = h.to; continue; }
      now = { ...h };
      out.push(now);
    }
  }
  return out.sort((a, b) => a.from - b.from || a.track - b.track);
}

/**
 * **静的に詰める。**選んだところを音量 0 にした、新しいトラックを返す。
 * 元のトラックは触らない(鳴らしている最中に掛けることがあるため)。
 *
 * ---- 音符まるごと黙らせる ----
 *
 * 区間は音符より短いことのほうが多い。上の melody が `q7` で切れている
 * あいだは枠が空くので、**同じ音符が鳴ったり黙ったりする**区間として出てくる。
 * 静的に詰めるというのは**楽譜の上で音符を削る**ことなので、
 * 少しでも掛かった音符は**まるごと**黙らせる。
 *
 * **削りすぎたぶんは数えて返す。**`extra` が大きいなら、
 * 静的ではなく鳴らしながら音量を動かす側でやるほうが曲が残る。
 *
 * @returns {{tracks:Array, silenced:number, extra:number}}
 *   `extra` は「本当は鳴らせたのに黙らせた」秒数の合計
 */
export function applyMask(tracks, spans) {
  const out = tracks.map((t) => ({ ...t, events: t.events.map((e) => ({ ...e })) }));
  const hit = new Map();
  for (const s of spans) {
    const key = s.track + ':' + s.index;
    hit.set(key, (hit.get(key) || 0) + (s.to - s.from));
  }
  let silenced = 0, extra = 0;
  for (const [key, covered] of hit) {
    const [track, index] = key.split(':').map(Number);
    const ev = out[track] && out[track].events[index];
    if (!ev) continue;
    const [a, b] = spanOf(ev);
    if (!ev.masked) silenced++;
    extra += Math.max(0, (b - a) - covered);
    // **音量 0 と、黙らせた印の両方。**音量だけだと `p0` と見分けが付かず、
    // 数え直したときに席が空いていないことになる
    ev.vol = 0;
    ev.masked = true;
  }
  return { tracks: out, silenced, extra: Math.round(extra * 1000) / 1000 };
}

/* ==================== 版と組(`#group`)====================
 *
 * **声が足りないときとは別の選び方。**あちらは枠からあふれたものを選ぶが、
 * こちらは人が書いた `#group` で選ぶ。黙らせ方は同じで、音量を 0 にする。
 *
 * `#group <版> [<組>]` の 2 段。版は排他で、組は重なる。
 * 書かないチャンネルはどの版にも属さないので、いつも鳴る
 * (docs/ENGINE_TODO.md の「`#machine` と `#group`」)。
 */

/**
 * 曲に書いてある版と、版ごとの組。**ファイルに出てきた順。**
 *
 * 組を書かないチャンネル(`#group nes` だけのもの)は、その版まるごと 1 組に
 * なるので `sets` には並ばない。並ぶものが 1 つも無ければ、選ぶところも要らない。
 *
 * @param {Array} tracks コンパイル済みのトラック(`compileMML` の戻り)
 * @returns {{name:string, sets:string[]}[]}
 */
export function groupsOf(tracks) {
  const out = [];
  for (const t of tracks ?? []) {
    if (!t || !t.group) continue;
    let at = out.find((g) => g.name === t.group);
    if (!at) { at = { name: t.group, sets: [] }; out.push(at); }
    if (t.groupSet && !at.sets.includes(t.groupSet)) at.sets.push(t.groupSet);
  }
  return out;
}

/**
 * 版と組を選んで、**黙るチャンネルを決める。**
 *
 * 既定は先に出てきた版で、組は全部 on。知らない版を渡されたときも先に出てきた
 * 版へ落とす。曲は鳴るべきで、選び方のために止めるものではない。
 *
 * **いま効いている機械も一緒に返す。**鳴っているチャンネルのうち、先に
 * 出てきたものの `#machine`。食い違っていてもエラーにしない。
 * 毎回数え直しているので、時間で変わるようになったら位置を足せる
 * (テイクの中に `#machine` を書けるので、いずれそうなる)。
 *
 * @param {Array} tracks コンパイル済みのトラック
 * @param {{group?:string|null, sets?:string[]|null}} [pick]
 *   group = 選ぶ版(省くと先に出てきた版)。sets = on にする組(省くと全部)
 * @returns {{group:string|null, sets:string[], silent:number[], machine:string|null}}
 *   `silent` は黙るチャンネルの番号(0 から)
 */
export function groupPick(tracks, pick = {}) {
  const list = groupsOf(tracks);
  const want = pick.group == null ? null : String(pick.group);
  const now = (want && list.find((g) => g.name === want)) || list[0] || null;
  const sets = now
    ? (pick.sets == null ? now.sets.slice() : now.sets.filter((s) => pick.sets.includes(s)))
    : [];
  const silent = [];
  (tracks ?? []).forEach((t, i) => {
    if (!t || !t.group) return;             // 無所属はいつも鳴る
    if (!now || t.group !== now.name) { silent.push(i); return; }
    // 組を書いていないチャンネルは、その版まるごとの 1 組。外れようがない
    if (t.groupSet && !sets.includes(t.groupSet)) silent.push(i);
  });
  const off = new Set(silent);
  let machine = null;
  (tracks ?? []).forEach((t, i) => {
    if (machine == null && !off.has(i) && t && t.machine) machine = t.machine;
  });
  return { group: now ? now.name : null, sets, silent, machine };
}
