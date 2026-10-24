// 鳴らすために組み立てたものを、MML の字へ戻す。
//
// ---- 何のためか ----
//
// 画面で AB リピートの範囲を決めて、「ここを別の曲へ持っていきたい」となる。
// 元の字を切り出す道もあるが、音符が元の何文字目から来たかを覚えていないので、
// いまは音符のほうから書き直す(2026-09-15)。
//
// ---- 書き直すと落ちるもの ----
//
// 注釈もマクロも残らない。同じ音は出るが、同じ字にはならない。
// 定位やビブラートのような着せるものも、いまは書かない。
// 音の高さ・長さ・音量・音色・エンベロープだけを写す。

const NAMES = ['c', 'c+', 'd', 'd+', 'e', 'f', 'f+', 'g', 'g+', 'a', 'a+', 'b'];
/** 1 つの音符で書ける長さ(16 分いくつぶんか → MML の数)。付点も持つ */
const LENS = [[16, '1'], [12, '2.'], [8, '2'], [6, '4.'], [4, '4'],
  [3, '8.'], [2, '8'], [1, '16']];

/** Hz を MIDI 番号へ。`compileMML()` は逆の式で Hz にしている */
const midiOf = (freq) => Math.round(69 + 12 * Math.log2(freq / 440));

/**
 * 16 分いくつぶん、を音符の字へ。1 つで書けなければタイでつなぐ。
 *
 * 例: 5 なら `c4&c16`。長さの数を並べるだけなので、休みでも同じ形になる
 */
function spell(head, cells) {
  const out = [];
  let left = cells;
  while (left > 0) {
    const hit = LENS.find(([n]) => n <= left);
    if (!hit) break;
    out.push(head + hit[1]);
    left -= hit[0];
  }
  return out.join('&');
}

/**
 * 組み立てた音符から MML を書く。
 *
 * @param {{name?:string, role?:string, events:object[]}[]} tracks チャンネルごとの音符
 * @param {{tempo?:number, from?:number, to?:number,
 *          waveName?:(n:number)=>string, envName?:(n:number)=>string}} [opts]
 *   tempo = 書き出す速さ(既定 120)。from / to = 秒で切る範囲。
 *   waveName / envName = 番号から名前を引くもの。省くと番号のまま書く
 * @returns {string} チャンネルを `#ch` で分けた 1 本のテキスト
 */
export function eventsToMML(tracks, opts = {}) {
  const tempo = opts.tempo || 120;
  const from = opts.from ?? 0;
  const to = opts.to ?? Infinity;
  // 16 分音符 1 つぶんの秒。これを 1 目盛りにして、時刻も長さも数える
  const unit = (60 / tempo) / 4;
  const cell = (sec) => Math.round(sec / unit);
  const wave = opts.waveName || ((n) => String(n));
  const env = opts.envName || ((n) => String(n));

  const out = [];
  let head = true;
  for (const t of tracks) {
    const notes = (t.events || [])
      .filter((e) => e.t >= from - 1e-6 && e.t < to - 1e-6)
      .sort((a, b) => a.t - b.t);
    if (!notes.length) continue;

    const L = [];
    if (t.name) L.push(`#ch ${t.name}`);
    if (t.role) L.push(`#role ${t.role}`);
    const body = [];
    if (head) { body.push(`t${tempo}`); head = false; }

    let at = cell(from);          // どこまで書いたか
    let oct = null, vol = null, wv = null, ev = null;
    for (const e of notes) {
      const start = cell(e.t);
      // 空いているところは休み。和音は同じ時刻から始まるので、戻らない
      if (start > at) body.push(spell('r', start - at));
      if (start < at) continue;   // 重なっている音(和音の 2 つ目から)は落とす
      if (e.wave !== wv) { body.push(`@{${wave(e.wave)}}`); wv = e.wave; }
      if (e.env !== ev) { body.push(`@e{${env(e.env)}}`); ev = e.env; }
      if (e.vol !== vol) { body.push(`v${e.vol}`); vol = e.vol; }
      const midi = midiOf(e.freq);
      const o = Math.floor(midi / 12) - 1;
      if (o !== oct) { body.push(`o${o}`); oct = o; }
      const cells = Math.max(1, cell(e.t + e.dur) - start);
      body.push(spell(NAMES[((midi % 12) + 12) % 12], cells));
      at = start + cells;
    }
    // 終わりまでの余りは休みで埋める。チャンネルの長さをそろえるため
    if (Number.isFinite(to) && cell(to) > at) body.push(spell('r', cell(to) - at));
    L.push(body.join(' '));
    out.push(L.join('\n'));
  }
  return out.join('\n\n');
}
