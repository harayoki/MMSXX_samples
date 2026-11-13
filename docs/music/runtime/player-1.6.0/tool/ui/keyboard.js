// 押すと鳴るだけの小さな鍵盤。中身はここ 1 か所。
//
// ---- なぜ画面から切り出すか ----
//
// プレイヤー(`tool/ui/player.js`)と同じ理由。置き場所が 2 つある —
// 道具の画面(`tool/ui/keyboard.html`)と、配るページ。配るページは中身を
// 埋めて渡すので、こちらの HTML を開けない。同じものを 2 か所に書くと、
// 片方だけ直したときに食い違う。
//
// ---- 見た目もここが持つ ----
//
// 色は `--ink` `--line` のような名前で引く。明暗は置く側が決める。
// 使う形は `KEYBOARD_CSS` に持たせて、どちらに置いても同じ顔にする。
//
// ---- 鳴らし方 ----
//
// 鳴らすのは `tool/core/live-keys.js` の口(`LiveKeys`)。1 音ずつ効果音として
// 鳴らすので、曲を鳴らしている最中でも触れる。押しているあいだ鳴らし続け、
// 離すと止まる。組み立てる MML と上限の決まりはあちらにある。
//
// ここは、押すところを描くこと、計算機の鍵盤から音へ割り当てること、
// 押したところに色を付けることをする。MIDI キーボードからも同じ
// `press` と `lift` を通る(`tool/ui/midi-in.js`)。
//
// ---- 区間 ----
//
// 鍵盤を切って、区間ごとに別の音色を鳴らせる。切れ目はオクターブの境目に
// 置く(弾きながら境目が分かるように)。押した鍵がどの区間かで音色が決まる。
// 区間に音色を決めていなければ、覚えている音色で鳴る。
//
// 長さの上限は `hold` 秒。押したままでもここで消える。音色のほうが先に
// 減りきることもある(減る音色は書いたとおりに減る)。

import { LiveKeys } from '../core/live-keys.js';

/** 画面に出す名前。英語で出す */
const LABELS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
/** 黒鍵かどうか */
const BLACK = [false, true, false, true, false, false, true, false, true, false, true, false];

/**
 * 計算機の鍵盤から音へ。DAW でよくある並びに合わせてある。
 *
 * **4 段ぜんぶ使う。**下の 2 段(zxcv と asdf)が下のオクターブ、
 * 上の 2 段(qwerty と数)がその 1 つ上。白鍵が下の段、黒鍵が上の段に来る。
 *
 * ```
 *    2 3   5 6 7      ← 上のオクターブの黒鍵
 *   q w e r t y u i o p
 *    s d   g h j       ← 下のオクターブの黒鍵
 *   z x c v b n m , . /
 * ```
 *
 * 前は 2 段(asdf と数の下)だけで 18 半音しか出せなかった。1 オクターブ半では
 * 和音を探るにも足りない。いまは 29 半音(2 オクターブ半)出る(2026-10-24)。
 *
 * 2 段の境目は 5 か所重なる。下の段の `, l . ; /` と上の段の `q 2 w 3 e` が
 * 同じ 12〜16(1 つ上の C から E)で、DAW も同じ重なり方をしている。
 * 続けて弾くときに段を移るのが楽になる
 */
const TYPE_KEYS = {
  // 下のオクターブ。白鍵が zxcv の段、黒鍵が asdf の段
  z: 0, s: 1, x: 2, d: 3, c: 4, v: 5, g: 6, b: 7, h: 8, n: 9, j: 10, m: 11,
  ',': 12, l: 13, '.': 14, ';': 15, '/': 16,
  // 1 つ上のオクターブ。白鍵が qwerty の段、黒鍵が数の段
  q: 12, 2: 13, w: 14, 3: 15, e: 16, r: 17, 5: 18, t: 19, 6: 20, y: 21,
  7: 22, u: 23, i: 24, 9: 25, o: 26, 0: 27, p: 28,
};

/** 打って出せるいちばん上の半音。鍵盤の本数の既定をここに揃える */
const TYPE_TOP = Math.max(...Object.values(TYPE_KEYS)) + 1;

/**
 * その高さがどの区間か。
 *
 * 切れ目は半音の位置で持つ。`[12, 24]` なら 0..11 が区間 0、12..23 が区間 1、
 * 24 から先が区間 2。
 *
 * @param {number} semi 半音
 * @param {number[]} splits 切れ目。小さい順
 * @returns {number} 区間の番号
 */
export function zoneOfSemi(semi, splits) {
  let n = 0;
  for (const at of (splits || [])) if (semi >= at) n++;
  return n;
}

/**
 * 切れ目を決める。オクターブの境目にだけ置く。
 *
 * @param {number} count 鍵盤の長さ(半音)
 * @param {('1'|'2low'|'2high'|'3')} how 1 区間 / 1:2 / 2:1 / 3 等分
 * @returns {number[]} 切れ目。置けないものは落とす
 */
export function splitsFor(count, how) {
  const edges = [];
  for (let i = 12; i < count; i += 12) edges.push(i);
  if (!edges.length || how === '1') return [];
  // 割りたいところに、いちばん近い境目を選ぶ。端の 1 鍵だけが余る切り方を
  // 避けるため、本数そのものではなく割合から選ぶ
  const near = (ratio) => edges.reduce((best, e) =>
    Math.abs(e - count * ratio) < Math.abs(best - count * ratio) ? e : best, edges[0]);
  if (how === '2low') return [near(1 / 3)];
  if (how === '2high') return [near(2 / 3)];
  // 同じ境目を選んだら 1 つにする(オクターブが 2 つしか無いときに起きる)
  if (how === '3') return [...new Set([near(1 / 3), near(2 / 3)])];
  return [];
}

export const KEYBOARD_CSS = `
.mmsxx-kbd{ display:flex; flex-direction:column; gap:8px;
  font-family:var(--mono, ui-monospace, Menlo, Consolas, monospace); font-size:12px; }
.mmsxx-kbd:focus{ outline:none; }
.mmsxx-kbd .keys{ position:relative; display:flex; height:120px; user-select:none;
  border:1px solid var(--line, #d4d0c7); background:var(--line, #d4d0c7);
  touch-action:none; overflow:hidden; }
.mmsxx-kbd:focus-visible .keys{ border-color:var(--amber, #96620f); }
.mmsxx-kbd .w{ flex:1 1 0; min-width:0; margin-right:1px; border:0; padding:0 0 6px;
  display:flex; align-items:flex-end; justify-content:center;
  background:var(--panel, #f7f6f3); color:var(--dim, #7b7970);
  font:inherit; font-size:10px; cursor:pointer; }
.mmsxx-kbd .w:last-child{ margin-right:0; }
.mmsxx-kbd .b{ position:absolute; top:0; height:62%; border:0; padding:0;
  background:var(--ink, #23252b); color:var(--panel, #f7f6f3);
  font:inherit; font-size:9px; cursor:pointer; z-index:2;
  display:flex; align-items:flex-end; justify-content:center; padding-bottom:4px; }
.mmsxx-kbd .w.edge{ box-shadow:inset 2px 0 0 var(--amber, #96620f); }
.mmsxx-kbd .b.edge{ box-shadow:inset 2px 0 0 var(--amber, #96620f); }
.mmsxx-kbd .w.on{ background:var(--amber, #96620f); color:var(--panel, #f7f6f3); }
.mmsxx-kbd .b.on{ background:var(--amber, #96620f); }
.mmsxx-kbd .bar{ display:flex; align-items:center; gap:10px; flex-wrap:wrap;
  color:var(--dim, #7b7970); }
.mmsxx-kbd .bar b{ color:var(--ink, #23252b); font-weight:600; }
@media (prefers-reduced-motion: reduce){ .mmsxx-kbd *{ transition:none !important; } }
`;

/**
 * 鍵盤を置く。
 *
 * ```js
 * const kbd = mountKeyboard(document.getElementById('app'), {
 *   audio, voice: 'analog::seqBass', fx: 'reverb 2.5 @mix 0.3', keys: 25,
 * });
 * kbd.setVoice('opll::piano');
 * ```
 *
 * @param {HTMLElement} root 置き場所。中身は書き換わる
 * @param {{audio:object, voice?:string, fx?:string, keys?:number, octave?:number,
 *          hold?:number, release?:number, vol?:number, max?:number,
 *          labels?:boolean}} opts
 *   audio = `ChipTuneSound`。要る。
 *   voice = 音色の名前(既定 `pulse(50)`)。
 *   fx = チャンネルに掛けるエフェクト。`@fxchain{…} @fx{…}` の中身だけ書く(`reverb 2.5 @mix 0.3`)。
 *   keys = 鍵盤の長さ。半音の数で数える(既定は打って出せるぶんと同じ 29。
 *   2 オクターブと 5 音)。狭くすると、はみ出た字は押しても鳴らない。
 *   octave = 左端のオクターブ(既定 4)。
 *   hold = 押したままにできる長さの上限(秒。既定 8)。
 *   release = 離してから消えるまでの秒数(既定 0.03)。
 *   vol = 強さ 0〜15(既定 12)。max = 同時に鳴らせる数(既定はエンジンの `maxVoices`)。
 *   labels = 白鍵に音名を出すか(既定 true)
 *
 *   音色・エフェクト・強さ・オクターブ・長さの上限・同時に鳴らせる数は、
 *   そのまま口(`LiveKeys`)へ渡る
 * @returns {{el:HTMLElement, live:LiveKeys, setVoice:function, setFx:function,
 *            setHold:function, setKeys:function, keys:function, setOctave:function,
 *            octave:function, setSplits:function, splits:function, zoneCount:function,
 *            setZoneVoice:function, zoneVoices:function, zoneOf:function,
 *            press:function, lift:function, destroy:function}}
 *   live = 鳴らしている口。MIDI の欄(`tool/ui/midi-in.js`)がここを見る
 */
export function mountKeyboard(root, opts = {}) {
  const audio = opts.audio;
  if (!audio) throw new Error('[ChpTnSnd] mountKeyboard: audio(ChipTuneSound)が要ります');
  // 鳴らすのは口。音色・エフェクト・強さ・オクターブ・長さの上限はあちらが覚える
  const live = new LiveKeys(audio, opts);
  // 既定は打って出せるぶんと同じ本数。出ている鍵盤より広く打てると、
  // 押しても鳴らない字があることになる(2026-10-24)
  let count = Math.max(1, Math.min(61, Math.round(Number(opts.keys) || TYPE_TOP)));
  /** 区間の切れ目(半音の位置)。空なら 1 区間 */
  let splits = (opts.splits || []).map(Number).filter((n) => n > 0).sort((a, b) => a - b);
  /** 区間ごとの音色。null なら口が覚えているもの */
  let zoneVoices = [];
  /** 区間ごとのオクターブのずらし。低音は下げて弾きたいことが多い */
  let zoneOcts = [];

  const labels = opts.labels !== false;

  root.classList.add('mmsxx-kbd');
  root.tabIndex = 0;
  root.setAttribute('role', 'group');
  root.setAttribute('aria-label', 'Keyboard. Click a key, or type when it has focus.');
  root.textContent = '';
  const keysEl = document.createElement('div');
  keysEl.className = 'keys';
  const bar = document.createElement('div');
  bar.className = 'bar';
  root.append(keysEl, bar);

  /** 半音の番号 → 押すところ。黒鍵は白鍵の上に置く */
  let cells = [];

  /** 押しているもの。半音の番号 → 口の番号 */
  const down = new Map();

  /**
   * 押す。鳴っているあいだは番号を覚えておく。
   *
   * 出ている鍵盤の外も鳴る(色を付けるところが無いだけ)。MIDI キーボードは
   * 画面に出ている本数より広いので、はみ出たぶんを捨てない。
   * 打って押すときと指で押すときは、呼ぶ側が範囲を見る。
   *
   * @param {number} semi 半音。0 = 左端のオクターブの c
   * @param {{vol?:number, voice?:string}} [how] この音だけ替えるとき
   */
  function press(semi, how = {}) {
    if (down.has(semi)) return;
    // 区間に音色を決めてあれば、それで鳴らす。決めていなければ口が覚えているもの。
    // 区間はずらす前の高さで決める(押した鍵がどの列かは動かない)
    const zone = zoneOfSemi(semi, splits);
    const voice = how.voice || zoneVoices[zone] || undefined;
    const shift = 12 * (zoneOcts[zone] || 0);
    const id = live.noteOn(semi + shift, voice ? { ...how, voice } : how);
    if (!id) return;
    down.set(semi, id);
    if (cells[semi]) cells[semi].classList.add('on');
  }

  /** 離す。切り方(少し落としてから止める)は口が持つ */
  function lift(semi) {
    if (!down.has(semi)) return;
    live.noteOff(down.get(semi));
    down.delete(semi);
    if (cells[semi]) cells[semi].classList.remove('on');
  }

  /** 全部離す。外を触ったときと、フォーカスが外れたとき */
  function liftAll() {
    for (const semi of [...down.keys()]) lift(semi);
  }

  /** 白鍵を並べ、黒鍵をその境目へ置く */
  function draw() {
    keysEl.textContent = '';
    cells = [];
    const whites = [];
    for (let i = 0; i < count; i++) if (!BLACK[i % 12]) whites.push(i);
    const wN = whites.length || 1;
    for (const i of whites) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'w';
      b.dataset.semi = String(i);
      if (splits.includes(i)) b.classList.add('edge');
      const oct = live.octave + Math.floor(i / 12);
      b.textContent = labels ? `${LABELS[i % 12]}${oct}` : '';
      b.setAttribute('aria-label', `${LABELS[i % 12]}${oct}`);
      keysEl.appendChild(b);
      cells[i] = b;
    }
    for (let i = 0; i < count; i++) {
      if (!BLACK[i % 12]) continue;
      // 左どなりの白鍵が何本目か。その境目に置く
      const left = whites.filter((w) => w < i).length;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'b';
      b.dataset.semi = String(i);
      if (splits.includes(i)) b.classList.add('edge');
      b.style.left = `calc(${(left / wN) * 100}% - ${100 / wN / 3.2}%)`;
      b.style.width = `calc(${100 / wN / 1.6}%)`;
      const oct = live.octave + Math.floor(i / 12);
      b.textContent = labels ? LABELS[i % 12] : '';
      b.setAttribute('aria-label', `${LABELS[i % 12]}${oct}`);
      keysEl.appendChild(b);
      cells[i] = b;
    }
    say();
  }

  /** 下の行。いまのオクターブと音色を出す */
  function say() {
    bar.textContent = '';
    const one = (t) => { const s = document.createElement('span'); s.textContent = t; return s; };
    const strong = (t) => { const s = document.createElement('b'); s.textContent = t; return s; };
    bar.append(one('Octave'), strong(String(live.octave)),
      one('← → to move'), one(`Voice ${live.voice}`));
    if (live.fx) bar.append(one(`Fx ${live.fx}`));
  }

  // ---- 押す ----
  //
  // 押したまま指を動かしても、離したのを取りこぼさないように、
  // そのポインタを鍵盤に捕まえておく
  const onDown = (ev) => {
    const b = ev.target.closest && ev.target.closest('[data-semi]');
    if (!b) return;
    ev.preventDefault();
    root.focus();
    try { keysEl.setPointerCapture(ev.pointerId); } catch (e) { /* 捕まえられなくてもよい */ }
    press(Number(b.dataset.semi));
  };
  const onUp = () => liftAll();
  keysEl.addEventListener('pointerdown', onDown);
  keysEl.addEventListener('pointerup', onUp);
  keysEl.addEventListener('pointercancel', onUp);
  root.addEventListener('blur', onUp);

  // ---- 打つ ----
  const onKey = (ev) => {
    if (ev.repeat || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
      setOctave(live.octave + (ev.key === 'ArrowRight' ? 1 : -1));
      ev.preventDefault();
      return;
    }
    const semi = TYPE_KEYS[ev.key.toLowerCase()];
    // 出ている鍵盤より広く打てるときは、はみ出た字は鳴らさない
    if (semi === undefined || semi >= count) return;
    ev.preventDefault();
    press(semi);
  };
  const onKeyUp = (ev) => {
    const semi = TYPE_KEYS[ev.key.toLowerCase()];
    if (semi === undefined) return;
    lift(semi);
  };
  root.addEventListener('keydown', onKey);
  root.addEventListener('keyup', onKeyUp);

  function setOctave(n) {
    // 左端が 1 から 7 まで。これより上は鍵盤の右端が 8 を超える
    const next = Math.max(1, Math.min(7, Math.round(n)));
    if (next === live.octave) return;
    live.setOctave(next);
    draw();
  }

  draw();

  return {
    el: root,
    live,
    /** 区間の切れ目を決め直す。半音の位置で渡す(`splitsFor()` が作る) */
    setSplits(list) {
      splits = (list || []).map(Number).filter((n) => n > 0 && n < count).sort((a, b) => a - b);
      liftAll();
      draw();
    },
    /** いまの切れ目 */
    splits: () => [...splits],
    /** 区間の数 */
    zoneCount: () => splits.length + 1,
    /**
     * 区間に音色を決める。null に戻すと、覚えている音色で鳴る。
     *
     * @param {number} i 区間の番号
     * @param {string|null} name 音色
     * @param {number} [oct=0] オクターブのずらし。-3..3
     */
    setZoneVoice(i, name, oct = 0) {
      zoneVoices[i] = name ? String(name) : null;
      zoneOcts[i] = Math.max(-3, Math.min(3, Math.round(Number(oct) || 0)));
      say();
    },
    /** 区間ごとのオクターブのずらし */
    zoneOcts: () => [...Array(splits.length + 1)].map((_, i) => zoneOcts[i] || 0),
    /** 区間ごとの音色。決めていないところは null */
    zoneVoices: () => [...Array(splits.length + 1)].map((_, i) => zoneVoices[i] || null),
    /** その高さがどの区間か */
    zoneOf: (semi) => zoneOfSemi(semi, splits),
    setVoice(n) { live.setVoice(n); say(); },
    setFx(s) { live.setFx(s); say(); },
    setHold(n) { live.setHold(n); },
    setKeys(n) {
      const next = Math.max(1, Math.min(61, Math.round(Number(n) || count)));
      if (next === count) return;
      count = next;
      // はみ出た切れ目は落とす。短くしたときに区間が端へ寄るのを避ける
      splits = splits.filter((at) => at < count);
      draw();
    },
    /** いまの鍵盤の長さ(半音) */
    keys: () => count,
    setOctave,
    octave: () => live.octave,
    press,
    lift,
    destroy() {
      liftAll();
      keysEl.removeEventListener('pointerdown', onDown);
      keysEl.removeEventListener('pointerup', onUp);
      keysEl.removeEventListener('pointercancel', onUp);
      root.removeEventListener('blur', onUp);
      root.removeEventListener('keydown', onKey);
      root.removeEventListener('keyup', onKeyUp);
      root.textContent = '';
      root.classList.remove('mmsxx-kbd');
    },
  };
}
