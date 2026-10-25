// 波形を持たない音源(モーダル。共振器の束)。
//
// ---- 何をするか ----
//
// 波形を保存しない。波形を作る仕組みを保存する(docs/ENGINE_TODO.md の 2h)。
//
// ```
// 頭(計算で作る励起)→ 2 極共振器 × N(それぞれ 周波数・振幅・減衰)→ 足す
// ```
//
// 時間の軸は表に持たない。共振器の状態が自分で進む。
// 高さは共振周波数を何倍するかの数 1 つ、強さは頭の傾き(ローパス)と長さで入る。
// 周波数はどこへ置いてもよいので、倍音列に縛られない。
//
// ---- 握りは頭に集める ----
//
// 頭は 1 音ごとに計算で作る。生音は使わない。焼いてもいない
// (焼くかどうかは聞いて決める。2h の「決まっていないこと」)。
// 種を固定すれば毎回同じ頭になるので、焼く理由の 1 つ目はこれで足りている。
//
// ---- 回し方 ----
//
// - AudioWorklet のノードは 1 つ。声ごとにノードを作らない
// - 状態は平らな Float64Array。声ごとのオブジェクトにしない
// - 128 サンプルの塊で回す。塊の中では確保しない
// - 共振器を外側、サンプルを内側で回す。内側の変数がレジスタに乗る
// - 減った共振器は外す。尾がただになる。外すと非正規化数も踏まない
// - 係数は音の頭で 1 回だけ作る。離したときだけ減衰を作り直す
//
// 響板・部屋・共鳴はここに入れない。混ぜたあとに 1 回掛ければ済むので、
// 声ごとに持つと重ねて掛かる(2h の「声の外へ出せるものは出す」)。
//
// ---- いまの音色の形には並べていない ----
//
// エンジンの音色は「波形 + エンベロープ」で、音ごとの状態を持たない。
// こちらは音ごとに状態を持つ。MML や `ChipTuneSound` からどう呼ぶかは
// まだ決めていない(2h の「決まっていないこと」)。いまは `ModalSynth` を
// 直に叩いて鳴らす。

export const MODAL_NODE = 'mmsxx-modal';

/** 1 つのノードが同時に持てる声の数 */
export const MODAL_VOICES = 24;
/** 1 声が持てる共振器の数 */
// ピーキーな設定で違う音を探すために、実用より大きくしてある。重さは本数にほぼ比例する。
// 確保するのは声の数 × これ × 8 個の数で、1024 本でも 1.5MB
export const MODAL_MODES = 1024;
/** 1 声が持てる導波管の弦の数(低い弦を導波管で鳴らすとき) */
export const MODAL_STRINGS = 3;

// ---- 処理器と余韻の長さ(modalTail)で使う計算 ----
//
// 処理器は文字列(MODAL_CODE)なので、同じ計算を外にも書くと 2 つになって、そのうちずれる。
// ここに 1 つだけ書き、文字列には `const sourOf = \${sourOf};` の形で埋め込む。
// だから、ここの関数は外の名前を使わない(引数だけで閉じている)

/** 音ごとの調律のくるい。音の高さと種から決めるので、同じ鍵盤は毎回同じだけずれる */
function sourOf(def, f0) {
  if (!def.sour) return f0;
  let hh = (Math.round(f0 * 100) | 0) ^ Math.imul(def.sourSeed | 0, 0x9e3779b1);
  hh = Math.imul(hh ^ (hh >>> 15), 2246822507); hh = Math.imul(hh ^ (hh >>> 13), 3266489909); hh ^= hh >>> 16;
  return f0 * Math.pow(2, def.sour * ((hh >>> 0) / 4294967296 * 2 - 1) / 1200);
}

/**
 * 失敗・崩れ。起きるかどうかは、音符の番号・音の高さ・前の音の高さ・種から決める。
 * 番号は、鳴らす側が付ける k(書いた音符の番号。繰り返しを数えない)。#looptimes の 2 周目も、
 * エコーの写しや和音のように 1 つの音符から作ったイベントも、同じところで起きる
 * (焼いた WAV が毎回同じになり、気に入った失敗を掴んで残せる。2026-10-07)。
 * k が無いとき(聞くページ、テスト)は、鳴らす側がパッチごとに鳴らした順の数を cnt に渡す。
 * 前の音の高さ last は、k が無いときだけ使う。
 * 返すもの: 大きさ・減り方・明るさの倍率、当たりどころ(0 なし、1 縁、2 カップ)、びびり、
 * 頭の上書き(無ければ null)、足す音符(となりの鍵盤、二度打ち。nf 付き)
 */
function modalFlaws(def, ev, vel, cnt, last) {
  const out = { amp: 1, t60k: 1, fcK: 1, spot: 0, buzz: 0, head: null, extra: [] };
  const fz = ev.f || def.base;
  let hs = Math.imul(cnt, 0x9e3779b1) ^ Math.imul(Math.round(fz * 10) | 0, 0x85ebca6b)
    ^ Math.imul(ev.k == null ? Math.round(last * 10) | 0 : 0, 0xc2b2ae35) ^ Math.imul((def.flawSeed | 0) + 1, 0x27d4eb2f);
  const u = () => { hs = Math.imul(hs ^ (hs >>> 15), 2246822507); hs = Math.imul(hs ^ (hs >>> 13), 3266489909); hs ^= hs >>> 16; return (hs >>> 0) / 4294967296; };
  // どの失敗も毎回同じ数だけ種を使う。ある失敗の値を変えても、ほかの失敗の起きる場所は動かない
  const roll = (c) => { const a = u(), b = u(), d = u(); return [c > 0 && a < c, b, d]; };
  const head = ev.h ? Object.assign({}, def.head, ev.h) : (def.head || {});
  // となりの鍵盤も一緒に押す。弱く、少し遅れて。上か下かは種で
  const [nb, nb1, nb2] = roll(def.neighbor || 0);
  if (nb && ev.f) out.extra.push({ t: ev.t + 0.006 + 0.02 * nb1, p: ev.p, f: ev.f * Math.pow(2, (nb2 < 0.5 ? -1 : 1) / 12), v: vel * (0.45 + 0.25 * nb2), d: ev.d, k: ev.k, nf: 1 });
  // ハンマーの二度打ち。調整の悪い鍵盤で、同じ音を、すぐ弱くもう一度。
  // 弾き方の失敗ではなく楽器の状態なので、音ごとの乱数では起こさない(2026-10-13)。
  // どの鍵盤が悪いかは、鍵盤と doubleSeed から決まる(楽器ごとに固定)。悪い鍵盤は、強く弾いたとき
  // (0.75 以上)に跳ね返ってもう一度当たる。本物は、受け止め不良なら強く、離れ方不良ならごく弱く
  // 弾いたときに起きるが、二度打った音は同じなので分けない(2026-10-13)。
  // 種の数を揃えるため、使わなくなった乱数も引いておく(ほかの失敗の起きる場所を動かさない)
  roll(0);
  if (def.double > 0 && ev.f) {
    let kh = Math.imul(Math.round(12 * Math.log2(ev.f / 440)) + 69, 0x9e3779b1) ^ Math.imul((def.doubleSeed | 0) + 1, 0x85ebca6b);
    const ku = () => { kh = Math.imul(kh ^ (kh >>> 15), 2246822507); kh = Math.imul(kh ^ (kh >>> 13), 3266489909); kh ^= kh >>> 16; return (kh >>> 0) / 4294967296; };
    const bad = ku() < def.double, k1 = ku(), k2 = ku();
    if (bad && vel >= 0.75) {
      out.extra.push({ t: ev.t + 0.012 + 0.025 * k1, p: ev.p, f: ev.f, v: vel * (0.4 + 0.2 * k2), d: ev.d == null ? undefined : Math.max(0.02, ev.d - 0.03), k: ev.k, nf: 1 });
    }
  }
  // びびり。弦がフレットや指板に触れる。弦高が低い、フレットが不揃い、といった楽器の状態なので、
  // 音ごとの乱数では起こさない(2026-10-13。ギターで、乱数で一部の音だけ激しく鳴り、乱数の要素は
  // 無いのでは、と言われた)。どの音がびびるかは、音の高さと buzzSeed から決まる(楽器ごとに固定)。
  // びびる音は、強く弾いたとき(0.6 以上)だけ鳴り、強いほど大きい。
  // 種の数を揃えるため、使わなくなった乱数も引いておく(ほかの失敗の起きる場所を動かさない)
  roll(0);
  if (def.buzz > 0 && ev.f && vel >= 0.6) {
    let kh = Math.imul(Math.round(12 * Math.log2(ev.f / 440)) + 69, 0x27d4eb2f) ^ Math.imul((def.buzzSeed | 0) + 1, 0x165667b1);
    kh = Math.imul(kh ^ (kh >>> 15), 2246822507); kh = Math.imul(kh ^ (kh >>> 13), 3266489909); kh ^= kh >>> 16;
    if ((kh >>> 0) / 4294967296 < def.buzz) out.buzz = (def.buzzLevel ?? 0.4) * Math.min(1, 0.4 + 1.5 * (vel - 0.6));
  }
  // 指のすべり。頭が弱く、こすれた雑音が多い
  const [sl] = roll(def.slip || 0);
  if (sl) { out.amp *= 0.5; out.head = { noise: Math.max(head.noise || 0, 0.85), bright: (head.bright ?? 0.6) - 0.1 }; }
  // 鳴らしそこね(ゴースト)。音程がほとんど無く、すぐ止まる。弱いほど起きやすい
  const [gh] = roll((def.ghost || 0) * (1.3 - vel));
  // 2 段で減る弦(after)は、2 本目が after 倍長く残る。そのぶんも縮める(2026-10-14。ベースを 2 段にしたら残った)
  if (gh) { out.t60k *= 0.05 / Math.sqrt((def.strings > 1 && def.after > 1) ? def.after : 1); out.amp *= 0.7; out.head = Object.assign({}, out.head, { noise: Math.max(head.noise || 0, 0.6) }); }
  // ワイヤーのばらけ。粒がまとまらずに、広くばらばらに当たる。
  // 粒の重なりが減るぶん小さく聞こえるので、少し持ち上げる
  const [sp] = roll(def.splay || 0);
  if (sp && head.grains > 0) { out.head = Object.assign({}, out.head, { scatter: (head.scatter || 0) * 3.5 + 6 }); out.amp *= 1.5; }
  // 当たりどころのずれ。縁寄り(太く荒く、長い)か、カップ寄り(鐘の音)
  const [st, st1] = roll((def.spot || 0) * (0.5 + vel));
  if (st) {
    if (st1 < 0.6) { out.spot = 1; out.t60k *= 1.3; out.fcK = 0.6; out.amp *= 1.15; } else out.spot = 2;
  }
  return out;
}

/**
 * 押さえる手の位置を推し量る(ギター)。普通の調弦(E2・A2・D3・G3・B3・E4)で、
 * その音をどの弦の何フレットで弾いたか、手がどれだけ動いたかを返す。
 *
 * 手は 4 フレットの幅(pos〜pos+3)をカバーしていて、その中なら指を入れ替えるだけで手は動かない。
 * アルペジオもたいていこの中で弾く(2026-10-13。キュッが鳴るのは指が届かないときだけでは、と言われた)。
 *
 * - 開放弦で弾ける音は開放弦で弾く。手は要らないので動かない
 * - 手の幅の中で押さえられる弦があれば、手は動かない。前と同じ弦があればそれ
 * - 届かないときだけ手を動かす。動く量がいちばん少ない弦を選び、並んだら前と同じ弦、
 *   その次は低い弦。手は、新しいフレットが幅の端に来るところまでしか動かさない
 * - 19 フレットより上と、E2 より下は扱わない(手は動かさない)
 *
 * 押さえ方は譜面から分からないので、これは見当。ギター譜のように押さえ方を書けば決められるが、やらない
 *
 * @param {{pos:number, s:number}} hand いまの手の位置と、前の音の弦
 * @param {number} f 音の高さ(Hz)
 * @returns {{pos:number, s:number, fret:number, moved:number}|null} 扱えない音は null
 */
function guitarHand(hand, f) {
  const OPEN = [40, 45, 50, 55, 59, 64];
  const m = Math.round(69 + 12 * Math.log2(f / 440));
  const cands = [];
  for (let s = 0; s < 6; s++) { const fr = m - OPEN[s]; if (fr >= 0 && fr <= 19) cands.push([s, fr]); }
  if (!cands.length) return null;
  const open = cands.find((c) => c[1] === 0);
  if (open) return { pos: hand.pos, s: open[0], fret: 0, moved: 0 };
  const inside = cands.filter((c) => c[1] >= hand.pos && c[1] <= hand.pos + 3);
  if (inside.length) {
    const c = inside.find((x) => x[0] === hand.s) || inside[0];
    return { pos: hand.pos, s: c[0], fret: c[1], moved: 0 };
  }
  let best = null;
  for (const [s, fr] of cands) {
    const pos = fr < hand.pos ? fr : fr - 3;
    const moved = Math.abs(pos - hand.pos);
    const better = !best || moved < best.moved || (moved === best.moved && s === hand.s && best.s !== hand.s);
    if (better) best = { pos, s, fret: fr, moved };
  }
  return best;
}

/**
 * 弦を押さえ替えるときのノイズ(ギター)。差し込む音符の並びを返す(無ければ空)。乱数は使わない。
 *
 * 押さえる手の位置を guitarHand で推し量り、手が届かない場所へ移るとき(ポジション移動)だけ
 * キュッを鳴らす。手の幅の中で指を入れ替えるだけなら滑らない(2026-10-13。前は音の高さが変われば
 * 鳴らしていて、アルペジオでも鳴っていた)。
 *
 * 移るとき、指は力を抜いて弦に軽く触れたまま滑るか、持ち上げて移る。
 * 力を抜くと弦はフレットから浮き、触れている指で揺れが止まるので、前の音は一瞬で消える
 * (音程は動かない)。どれも前の音を離したところで鳴る。弦をはじいたときではない
 * (2026-10-13 に、YouTube で本物を聞いた人に言われた。前は次の音の直前に置いていた)。
 *
 * - 滑るキュッ: 手が動くとき、指が巻き線の段差をなぞる音。前の音か次の音が巻き弦(低い 3 本)のときだけ。
 *   高さは滑る速さ(段差を通る速さ)で決まる(Pakarinen ほか 2007 の要約では、高さも大きさも速さに
 *   比例する)。高さは一定で、終わりで切れる。遠くへ動くほど速く滑るので、高く、少し大きく、長くなる。
 *   12 フレットで頭打ち
 * - 離すときのポツ: 巻き弦を押さえていた指を持ち上げたときの短い音。手が動かなくても、違う音へ移れば鳴る
 * - 離したときの開放弦の鳴り: 押さえていた指を持ち上げた反動で、その弦の開放弦が鳴る
 *
 * どれになるかは弾く人の癖(lift。0 で付けたまま滑らせる、1 でしっかり持ち上げる)。
 * 大きさは弦の起こりやすさ(stringNoise。弦の種類と新しさ)と、ていねいさ(care)で決まる。
 * 鳴るか鳴らないかに乱数は使わない。同じ譜面なら毎回同じところで同じように鳴る
 * (2026-10-13。起こりやすさは弦の性質で、ランダムに揺れるものではないと言われた)。
 * 消えるのは stringNoise 0(と開放弦の鳴りは openRing 0)のときだけ。lift と care は小さくするだけで、20dB 下で止まる。
 * 次の音をはじく 5 ミリ秒前に滑り終える。滑れる長さが 15 ミリ秒に満たなければキュッは鳴らさない。
 * 和音は、ほぼ同時(1 つ前の音から 30 ミリ秒以内)に鳴る音をひとまとまりにして、いちばん低い音で見る。
 *
 * 音は、巻き線の山を越えるたびの乾いたカチの並び。間隔は 1.9〜2.3kHz ほど(遠くへ移るほど速く滑るので詰まる)。
 * 前の音を離して移りはじめた瞬間に短く(20〜50 ミリ秒)。付けたまま移る(lift が小さい)と、移るあいだずっと(80〜140 ミリ秒)。
 * 大きさの係数も含めて値は見当で、録音には合わせていない
 *
 * @param {object} def パッチ
 * @param {{t:number, f:number, p:string}} cur 次のまとまり(いちばん低い音の高さ)
 * @param {{t:number, f:number, end:number|null, pos:number, s:number, fret:number}|null} prev 前のまとまり。
 *   はじいた時刻、いちばん低い音の高さ、離した時刻、手の位置、弦、フレット
 * @param {number} n まとまりの番号(雑音の種にだけ使う)
 * @param {number} now いまの時刻。離した時刻がもう過ぎていれば、いまから鳴らす
 * @param {Function} handOf guitarHand。名前で呼ばずに受け取る。処理器の文字列へ埋めると、
 *   縮めた JS では関数の名前が変わって、名前で呼ぶと見つからない
 * @returns {{ev:object[], hand:object}} 差し込む音符と、この音のあとの手(次の prev に使う)
 */
function modalHandling(def, cur, prev, n, now, handOf) {
  const out = [];
  const h = handOf(prev || { pos: 1, s: -1 }, cur.f);
  const hand = h ? { pos: h.pos, s: h.s, fret: h.fret } : (prev ? { pos: prev.pos, s: -1, fret: 0 } : { pos: 1, s: -1, fret: 0 });
  if (!prev || !h || !prev.f) return { ev: out, hand };
  const same = Math.abs(12 * Math.log2(cur.f / prev.f)) < 0.5;
  if (same) return { ev: out, hand };
  const t0 = Math.max(prev.end != null && prev.end < cur.t ? prev.end : cur.t - 0.1, now);
  const lift = Math.min(1, Math.max(0, def.lift ?? 0.3));
  const care = Math.min(1, Math.max(0, def.care || 0));
  // 消すのは stringNoise 0 と openRing 0 だけ。弾き方(lift・care)は、小さく目立たなくするだけで、
  // 出たり出なかったりにはしない。どれも 20dB 下(0.1 倍)で止める。
  // 上級者がていねいに弾いても、小さくはなれど鳴らないことはない、と言われた(2026-10-14)。
  // 前は care 1 や lift の端で消え、0.02 に届かない小さいものも鳴らさなかった
  const careK = Math.max(0.1, 1 - care);
  const liftK = Math.max(0.1, lift), slideK = Math.max(0.1, 1 - lift);
  // 前の音を指で押さえていたか(開放弦や、扱えない高さでなかったか)
  const fretted = prev.s >= 0 && prev.fret > 0;
  // 離したときの開放弦の鳴り。指を持ち上げると、その反動で弦が少しはじかれ(プリングオフと同じ)、
  // その弦の開放弦の高さで鳴る。付けたまま滑らせれば指が止めるので鳴らない。
  // ていねいな人は、ほかの指や右手で止める(2026-10-13。動画の解説で、離すときに反動で別の音が
  // 鳴るので別の指でミュートする、と言っていたと聞いた。エレキで目立つが、アコギでも小さく鳴る)。
  // 鳴るのは次の音まで。次を押さえる指や右手が止める、とみなす。巻き弦に限らない
  const ring = (def.openRing ?? 0) * liftK * careK;
  if (ring > 0 && fretted && cur.t - t0 > 0.03) {
    const open = 440 * Math.pow(2, ([40, 45, 50, 55, 59, 64][prev.s] - 69) / 12);
    out.push({ t: t0, p: cur.p, f: open, v: Math.min(1, 0.6 * ring), d: cur.t - t0, nf: 1,
      h: { sharp: 2.5, bright: 0.7, noise: 0.1 } });
  }
  const amt = (def.stringNoise || 0) * careK;
  if (!(amt > 0)) return { ev: out, hand };
  // 離すときのポツ。巻き弦を押さえていた指を持ち上げたとき。
  // 前は 12 ミリ秒・2.6kHz で、一度も聞き取れなかった(2026-10-13)。少し長く(20 ミリ秒)低く(1.2kHz)した。
  // 既定では控えめのまま。本物を聞くと、目立つのは圧倒的にキュのほうだと言われた。
  // ただ、パラメータを最大にしたらはっきり分かるようにしたい、と言われた(2026-10-14)。
  // 起こりやすさの 1.7 乗にして、既定(0.1 ほど)はほぼそのまま、最大で 14dB 大きくした。
  // そのあと、ポツもキュも主張が激しいと言われ、どちらも 10dB 下げた(2026-10-14。下のキュの大きさを見る)
  // click は、ポツだけの大きさ。本物の音が分からないので、ギターの既定は 0(調整中。2026-10-14)
  const tick = amt * liftK * Math.min(1, Math.max(0, def.click ?? 1));
  if (fretted && prev.s <= 2 && tick > 0) {
    out.push({ t: t0, p: cur.p, sq: 1, nf: 1, sqLen: 0.02, sqF: 0, sqB: 1200, sqN: 0.5,
      sqSeed: n * 31 + 3, v: 0.47 * Math.pow(tick, 1.7) });
  }
  // 滑るキュッ。手が動くときだけ。前の音か次の音が巻き弦のとき。
  // 次の音をはじく前(5 ミリ秒前)に滑り終える。あいだが短ければ、そのぶん短く速く滑る。
  // 前は長さを移った量だけで決めていて、あいだの短いフレーズで次の音のはじきに重なった(2026-10-13)。
  // 大きさは動いた量に引っぱられすぎないようにする。比例させていたころは、いちばん大きく動いた
  // ところだけが鳴り、ほかはほとんど聞こえず不自然だった(2026-10-13)。いまは 1 フレットで 12 フレットの 6 割
  const wound = (fretted && prev.s <= 2) || (h.fret > 0 && h.s <= 2);
  const slide = amt * slideK;
  // いつ鳴るか(2026-10-14。Web で調べ直した。下の 2 つは教則の複数のページで一致する)。
  // ふつうは、移りはじめに短く 1 回(20〜50 ミリ秒)。指が離れきる前に手が動きはじめた瞬間がいちばん大きく、
  // 指が離れたあとの移動中は鳴らない。
  // 付けたまま移る(ガイドフィンガー、グリッサンド)と、移るあいだずっと鳴る(80〜140 ミリ秒)。
  // どちらになるかは lift で決める。lift 0.05 以下で付けたまま、0.25 以上で移りはじめだけ、あいだはまぜる。
  // 前は lift によらず、前の音を離してから次の音の直前まで、あいだを埋めるように鳴らしていた。
  // 合いの手のように聞こえると言われた。
  // 着地で滑り込んで次の音の直前に鳴ることもあるらしいが、根拠が弱いので入れていない。
  // 急ぐ人(rush)は、付けたまま移るときに、足りないぶんを前の音が鳴っているあいだから滑りはじめる。
  // 前の音の頭から 50 ミリ秒は待つ(2026-10-13。鳴っている最中に動かす人もいるのでは、と言われた)
  const sp = Math.min(1, h.moved / 12);
  const glide = 1 - Math.min(1, Math.max(0, (lift - 0.05) / 0.2));
  const want = glide * (0.08 + 0.06 * sp) + (1 - glide) * (0.02 + 0.03 * sp);
  const short = Math.max(0, want - (cur.t - 0.005 - (t0 + 0.005)));
  const rush = Math.min(1, Math.max(0, def.rush || 0));
  const st = Math.max(now, prev.t != null ? prev.t + 0.05 : -Infinity, t0 + 0.005 - rush * short);
  const room = cur.t - 0.005 - st;
  if (h.moved > 0 && wound && room >= 0.015) {
    // 押さえていた前の音は、指といっしょに動く。動いたフレットの数だけ、半音ずつ(2026-10-13)。
    // 動くのは付けたまま移るときだけ。持ち上げて移れば、指が離れた時点で前の音は止まる
    const bend = fretted && glide >= 0.5 ? Math.sign(h.pos - prev.pos) * h.moved : 0;
    // 大きさは 10dB 下げた(2026-10-14)。主張が激しいと言われた。音量を測った資料は見つからなかったが、
    // 録音を編集する人は、キュを 8〜10dB 下げるとよいと言う。キュは 2kHz あたりで、耳がいちばん敏感な
    // 帯なので、波形の大きさ(ピーク)で比べると小さく見えても、聞くと目立つ。低い弦の音は逆に、
    // 波形で大きく見えても耳には小さい
    // 1 回ずつのばらつき。滑りはじめの遅れ(0〜10 ミリ秒)・長さ(0.7〜1.2 倍)・高さ(0.88〜1.12 倍)・
    // 大きさ(0.65〜1.2 倍)。毎回同じ形で、機械的に入っている感じが強いと言われた(2026-10-14)。
    // 種(flawSeed)とまとまりの番号から決めるので、同じ曲は毎回同じに鳴る
    const hs = (k) => {
      let x = (((def.flawSeed ?? 1) | 0) * 2654435761 ^ Math.imul(n | 0, 40503) ^ Math.imul(k, 0x9e3779b1)) >>> 0;
      x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d) >>> 0; x ^= x >>> 12; x = Math.imul(x, 0x297a2d39) >>> 0; x ^= x >>> 15;
      return (x >>> 0) / 4294967296;
    };
    const s2 = st + Math.min(0.01 * hs(1), Math.max(0, room - 0.015));
    out.push({ t: s2, p: cur.p, sq: 1, nf: 1, sqLen: Math.min(want * (0.7 + 0.5 * hs(2)), cur.t - 0.005 - s2),
      sqF: (1900 + 400 * sp) * (0.88 + 0.24 * hs(3)), sqB: 0, sqN: 0.2, sqSeed: n * 31 + 7,
      v: 0.4 * slide * (0.6 + 0.4 * sp) * (0.65 + 0.55 * hs(4)), bend });
  }
  return { ev: out, hand };
}

/**
 * 1 音の共振器と導波管の弦を並べ、それぞれの高さと減り方(−60dB までの秒)を決める。
 * 導波管の弦は onString(何本目, Hz, 秒, damp, 硬さ)、共振器は onMode(何本目, Hz, 秒, 振幅) で渡す。
 * max は共振器の、maxStrings は導波管の弦の、1 声あたりの上限
 * 返すのは導波管の弦の本数(導波管を使わなければ 0)
 */
function modalModes(def, f0, t60k, spot, sr, max, maxStrings, onString, onMode) {
  const kr = def.pitched ? f0 / 261.63 : 1;
  // 高いほど弦が硬く、早く消える
  const t60 = def.t60 * Math.pow(kr, -(def.decayKey || 0)) * t60k;
  // 5 弦ベースの低い B 弦(bStretch)。E1(41.2Hz)より低い音は B 弦で鳴らす。太いわりに張りが弱いので、
  // 倍音が高くずれやすい。硬さは弦の太さの 4 乗と張りの逆数で効くので、E 弦の 3 倍ほどになる(太さ 1.24 倍、張り 3/4)
  const bb = def.bStretch > 0 && def.pitched && f0 < 40.5 ? def.bStretch : (def.stretch || 0) * Math.pow(kr, def.stretchKey || 0);
  const damp = def.damp;
  // 低い弦は導波管で鳴らす。共振器 1 本で倍音 1 本だと、低い音ほど倍音が足りない
  const guide = def.guide > 0 && f0 < def.guide;
  let ns = 0;
  if (guide) {
    ns = Math.max(1, Math.min(maxStrings, def.strings | 0 || 1));
    for (let s = 0; s < ns; s++) {
      const c = ns === 1 ? 0 : (def.detune || 0) * (s / (ns - 1) - 0.5) * 2;
      onString(s, f0 * Math.pow(2, c / 1200), t60 * (s === 0 ? 1 : (def.after || 1)), damp, bb);
    }
  }
  const tb = def.table;
  // ハーモニクス。弦の 1/hn のところに触れているので、hn の倍数の倍音だけが鳴る
  const hn = def.pitched && def.harmonic >= 2 ? def.harmonic | 0 : 0;
  // ピックアップの位置を変えても大きさが跳ねないように、1〜12 倍音で揃える。並みは h 倍音が 1/h^1.25。
  // 基音だけで揃えるとブリッジ寄りで 5dB 大きくなり、表の大きさで揃えると(表は平らに近い)7〜10dB 小さくなった。
  // 音色と高さで並みが違うので揃いきらない。ブリッジ寄り(0.06)で −5〜+6dB、ほかの位置は +2dB ほど
  let pkNorm = 1;
  if (def.pickupAt > 0) {
    let e = 0, e0 = 0;
    for (let k = 1; k <= 12; k++) {
      const a = Math.pow(k, -1.25), w = a * Math.pow(Math.abs(Math.sin(Math.PI * k * def.pickupAt)), def.pickupDepth ?? 1);
      e += w * w; e0 += a * a;
    }
    pkNorm = Math.sqrt(e0 / e);
  }
  let n = 0;
  for (let i = 0; i < tb.length && n < max; i += 4) {
    const h = tb[i + 3];
    if (hn && h > 0 && h % hn) continue;
    // 導波管で鳴らすときは、弦の倍音を共振器に載せない。木の音だけ残す
    if (guide && h >= 0) continue;
    let f, tt;
    if (h < 0) {
      // 高さに付いてこない共振器(鍵盤やハンマーの木の音)。減衰も秒で持っている
      f = tb[i];
      tt = tb[i + 2];
    } else {
      // 弦の硬さで上の倍音ほど高くずれる。h は何番目の倍音か
      f = tb[i] * f0 * (h > 0 && bb > 0 ? Math.sqrt(1 + bb * h * h) : 1);
      tt = t60 * tb[i + 2] / (1 + damp * (f / 1000) * (f / 1000));
      // ミュート。手のひらで弦を押さえたぶんの減り(dB/秒)を足す。Rickenbacker 4001 のミュートの録音から。
      // 165Hz で 45dB/秒、周波数の 1.5 乗で増える(録音では 2 乗より合う)。
      // 録音は 2〜5 倍音が強く、そこが速く消えて全体が 1 秒で 25〜30dB 落ちる。基音の強い音色では倍音の減りだけ
      // 合わせても全体が落ちないので、高さによらない 20dB/秒を足して、全体の落ち方を録音に揃えた。
      // 数はここにじかに書く。外に定数を置くと、縮めた JS では処理器の文字列の中で名前が合わなくなる
      if (def.mute > 0) tt = 60 / (60 / tt + def.mute * (45 * Math.pow(f / 165, 1.5) + 20));
    }
    if (f <= 20 || f >= sr * 0.45) continue;
    // 当たりどころのずれ。縁寄りは低い共振器が強く、カップ寄りは最初の数本だけが強く長く鳴る
    let ga = 1;
    // 胴(ギター)。弦の倍音 1 本ずつに、その高さで胴がどれだけ鳴らすかを掛ける。
    // 弦も胴も足し算でつながっているので、胴を後ろに掛けても、倍音ごとに掛けても同じ大きさになる。
    // 後ろに掛けるフィルタにしないのは、エンジンが声の外のフィルタを掛けないから
    // (金管の胴は聞くページでしか効いていない)。ここなら MML からも焼いた WAV でも効く。
    // 導波管の弦(guide)には掛からない。倍音を 1 本ずつ持っていないので。
    // 山は 2 次のピーキング、低いほうは 4 次のハイパス。どちらもアナログの式で大きさだけ出す。
    // ほかの関数を呼ばずにここへ書く。処理器の文字列へ埋めると、縮めた JS では名前が合わなくなる
    if (h >= 0 && (def.body || def.bodyLow)) {
      let g2 = 1;
      for (const pk of def.body || []) {
        const A = Math.pow(10, pk.gain / 40), q = 1 / (2 - 2 * Math.min(0.95, pk.resonance));
        const x = f / pk.freq, d = (1 - x * x) * (1 - x * x);
        g2 *= (d + x * x * A * A / (q * q)) / (d + x * x / (A * A * q * q));
      }
      if (def.bodyLow > 0) { const x4 = Math.pow(f / def.bodyLow, 4); g2 *= x4 / (1 + x4); }
      ga = Math.sqrt(g2);
    }
    // エレキのピックアップの位置(pickupAt。ブリッジからの弦の長さの割合)。磁石は置かれた場所の弦の揺れを拾うので、
    // そこが節に近い倍音ほど小さい。h 倍音は |sin(π h p)| 倍。
    // 位置を変えても大きさが跳ねないように、1〜12 倍音の大きさで揃える(pkNorm)。
    // 基音で揃えると、ブリッジ寄りで上の倍音が持ち上がって 5dB 大きくなった
    // pickupDepth で重みを累乗して差を大げさにする(1 で式どおり、0 で差なし)。
    // 磁石とケーブルの共鳴の山(pickupPeak・pickupPeakGain)も、位置を決めたときだけ掛ける。山は胴と同じ 2 次のピーキング
    if (h > 0 && def.pickupAt > 0) {
      ga *= Math.pow(Math.abs(Math.sin(Math.PI * h * def.pickupAt)), def.pickupDepth ?? 1) * pkNorm;
      if (def.pickupPeakGain > 0 && def.pickupPeak > 0) {
        const A = Math.pow(10, def.pickupPeakGain / 40), q = 1, x = f / def.pickupPeak, d = (1 - x * x) * (1 - x * x);
        ga *= Math.sqrt((d + x * x * A * A / (q * q)) / (d + x * x / (A * A * q * q)));
      }
    }
    if (spot === 1 && n < tb.length / 12) ga *= 1.3;
    else if (spot === 2) { if (n < 8) { ga *= 3; tt *= 2; } else ga *= 0.4; }
    onMode(n, f, tt, tb[i + 1] * ga, h >= 0);
    n++;
  }
  return ns;
}

/**
 * 処理器の中身(文字列から作るのでファイルは増えない)。
 *
 * 表(共振器ごとの 倍率・振幅・減衰の倍率・何番目の倍音か)は表の側で作って渡す。
 * こちらは音の高さを掛けて係数にし、回すだけ。
 */
export const MODAL_CODE = `
const V = ${MODAL_VOICES};
const M = ${MODAL_MODES};
const B = 128;
// 共振器 1 本の持ち物: a1 a2 b y1 y2 cos sin t60
// 共振器 1 本の持ち物。a1 a2 b y1 y2 cos sin t60 と、音の高さに付いていくか(1 か 0)
const S = 9;
// 声の持ち物(平らな配列の中の位置)
const ON = 0, POS = 1, LEN = 2, LP1 = 3, LP2 = 4, COMB = 5, AMP = 6, LPC = 7,
  NOISE = 8, DIRECT = 9, RATTLE = 10, RENV = 11, NM = 12, REL = 13, RELT = 14,
  LEVEL = 15, OFF = 16, BORN = 17, NORM = 18, VARY = 19, HPOS = 20, RHP = 21,
  WG = 22, WGAIN = 23, FELT = 24, TL1 = 25, TL2 = 26, TC = 27, TA1 = 28, TA2 = 29,
  GN = 30, GL = 31, BZ = 32, BP = 33, PK = 34, PO = 35, PV = 36, PD = 37,
  WD = 38, TD = 39, TR = 40,
  // 押さえ替えのノイズ(キュッとチッ)。大きさ・巻き線をなぞる位相・経った数・長さ・キュッの高さ・チッの高さ・低いほうを抜く状態
  SQ = 41, SQP = 42, SQT = 43, SQL = 44, SQF = 45, SQB = 46, SQH = 47,
  // びびりが止まる揺れの大きさ(揺れの山に対する割合)
  BG = 48,
  // 押さえ替えのノイズに混ぜる雑音の割合
  SQN = 49,
  // 鳴っている音を押さえたまま滑らせる。動く半音の数(符号付き)・いま動いている数・経った数・長さ(サンプル)
  BNS = 50, BNC = 51, BNT = 52, BNL = 53,
  // 押さえ替えのノイズと鍵盤の音の、低いほうを抜く高さ(Hz。0 なら 400Hz)
  SQC = 54,
  // あとから膨らむ高音(ドラ)。大きさ・立ち上がり・減り(サンプル)・経った数・ハイパスの係数と 2 段の状態
  BLA = 55, BLR = 56, BLF = 57, BLP = 58, BLC = 59, BH1 = 60, BH2 = 61,
  // 膨らむあいだに低い揺れから抜く量(1 サンプルあたり、ネーパー)と、膨らみが入る高さ(cos ω)、
  // 抜く高さ(cos ω)
  BLD = 62, BLK = 63, BLDK = 64,
  // ビブラフォンのモーター。揺れの深さと速さ
  MO = 65, MR = 66,
  // びびりが音程の周期で脈打つ量(1 で脈打つ、0 でなめらかな雑音)
  BZR = 67,
  // なめらかなびびりの包絡(揺れの大きさを、音程の周期より長くならしたもの)
  BZS = 68,
  // 鳴っている音を滑らせるとき、半音ずつ段で動かす(0、フレット)か、なめらかに動かす(1、フレットの無い指板)か
  BNF = 69,
  // チッ(押さえ替えのノイズ・鍵盤の音・スナップ)の高いほうを丸める高さ(Hz。0 なら 4kHz)
  SQLP = 70,
  // びびりを 1 塊ごとに減らす割合(1 なら減らさない)。引っぱる音のびびり(pullBuzz)は、振れが大きい頭のうちだけ鳴らす
  BZD = 71,
  // ビブラート(MML の @m)。深さ(半音)・速さ(1 サンプルあたりのラジアン)・遅れ(サンプル)・経った数・いま掛けている量(半音)
  VBD = 72, VBR = 73, VBY = 74, VBT = 75, VBC = 76,
  // ビブラートの揺れの位相(ラジアン)・いまの 1 往復の速さと深さの倍率・何往復目か・フレットのある弦か(1 なら上へだけ揺れる)
  VBP = 77, VBM = 78, VBA = 79, VBN = 80, VBF = 81,
  // 振れの大きさで決める、弾いた直後の高さ(bendFollow)。はじめの量(半音)・はじめのエネルギー・いま掛けている量・経った塊の数
  EBA = 82, EBE = 83, EBC = 84, EBN = 85;
const K = 86;
// 頭の粒。1 声に 32 粒まで。粒ごとに 始まり(サンプル)と大きさ
const G = 32;
// 導波管(低い弦)。1 声に弦 3 本まで。遅延線のほかに、1 本ずつ持つもの:
// N(遅延の整数ぶん) η(端数のオールパス) c(硬さのオールパス) g a(損失) lp
// t1 t2(端数のオールパスの状態) wp(書く位置) t60 L(1 周の長さ) と、硬さのオールパス 6 段の状態
const WS = ${MODAL_STRINGS}, AP = 6, WK = 25;
const WN = 0, WETA = 1, WC = 2, WGG = 3, WA = 4, WLP = 5, WT1 = 6, WT2 = 7, WP = 8,
  WT60 = 9, WL = 10, WAPS = 11, WQ = 23, WLV = 24;
// 遅延線の長さ。20Hz の 1 周より長くする
const WR = Math.ceil(sampleRate / 20) + 8;
// 導波管の出口の大きさを、共振器の束と揃える数。C5 のあたりで段差が出ないように
// 測って決めた。導波管は低いほど小さく出る(頭が 1 周に占める割合が減る)ので、
// 周期の 0.73 乗で持ち上げる。導波管にも tilt を効かせて低音が暗くなったので、
// 録音の C2〜C4 の大きさの差に合わせて決めた(2026-10-05。前は 0.35)
// 頭の長さの補正(NORM)も共振器の束と同じに掛ける。掛けないと、ハンマーを
// 鋭くしたときに導波管だけ小さくなって、境目で段差が出る
const GUIDE_GAIN = 45, GUIDE_REF = 523;
// 頭の櫛に使う遅延。いちばん低い音(およそ 30Hz)の半周期より長くする
const R = 1024;
const TAU = Math.PI * 2;
// 6.9078 = ln(1000)。60dB 落ちるまでの時間から 1 サンプルあたりの減り方を出す
const LN1000 = 6.907755278982137;
// これを割った共振器は外す。-100dB
const QUIET = 1e-5;

// 名前を書いて受け取る。縮めた JS(esbuild --minify)では関数の名前が変わるので、
// 中身だけ埋めると、文字列の中の呼び出し(sourOf(…))と名前が食い違って無音になる
const sourOf = ${sourOf};
const modalFlaws = ${modalFlaws};
const modalModes = ${modalModes};
const guitarHand = ${guitarHand};
const modalHandling = ${modalHandling};

// ピックアップの入口の大きさ。pickup 1、ff の真ん中の音で、振れが磁石までの距離の 7 割ほどに届く
const PICKUP_SCALE = 1.2;

/**
 * 磁石からの距離 1 − u で見た磁束(1 / 距離² から、止まっているときのぶんを引いたもの)。
 * 磁石に当たらないよう、u は 0.9 の手前でなめらかに頭打ちにする
 */
function pickup(u) {
  const c = 0.9 * Math.tanh(u / 0.9);
  const d = 1 - c;
  return (1 / (d * d) - 1) / 2;
}
function pickupSlope(u) {
  const c = 0.9 * Math.tanh(u / 0.9);
  const d = 1 - c;
  return 1 / (d * d * d);
}

class ModalBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.modes = new Float64Array(V * M * S);
    this.voice = new Float64Array(V * K);
    this.ring = new Float64Array(V * R);
    this.wg = new Float64Array(V * WS * WK);
    this.grain = new Float64Array(V * G * 2);
    this.wring = new Float64Array(V * WS * WR);
    this.seed = new Uint32Array(V);       // 種を固定した雑音
    this.free = 0x9e3779b9;               // 毎回違う雑音(全部の声で 1 本)
    this.hb = new Float64Array(B);        // 頭の塊
    this.bb = new Float64Array(B);        // あとから膨らむ高音の塊(bloomFrom より高い共振器にだけ入る)
    this.vb = new Float64Array(B);        // 声の塊
    this.tb = new Float64Array(B);        // 導波管へ入れる頭(tilt を掛けたもの)
    this.ob = new Float32Array(B);        // 出口が 1 本のとき、右へ行く束を置く
    this.sqLp = new Float64Array(V);      // キュッの高いほうを丸める状態
    this.sqBp = new Float64Array(V);      // キュッのカチの残り
    this.vpat = new Array(V).fill(null);  // 声ごとの、共鳴弦へ流すパッチの名前
    this.sym = {};                        // パッチごとの共鳴弦
    this.ped = {};                        // パッチごとの右ペダル(1 で踏んでいる)
    this.pedIv = {};                      // パッチごとの、右ペダルを踏む区間(時計の秒)
    this.vname = new Array(V).fill(null); // 声ごとの、パッチの名前(ペダルで止めるかを見る)
    this.patch = p.patches || {};
    this.events = [];
    this.at = 0;
    this.born = 0;
    this.cutAt = -1;
    // 失敗・崩れの種に使う、パッチごとの音の数と前の音の高さ
    this.count = {};
    this.lastF = {};
    // 押さえ替えのキュッを決めるための、受け取った順の数・前の音の高さ・前にキュッを鳴らした時刻
    this.sqCount = {};
    this.rollCount = {};
    // スラーの続き(sl)が動かす弦。MML のつながりの番号 → { 声, 生まれた番号, いまの高さ }
    this.ties = new Map();
    this.sqLast = {};
    this.add(p.events || []);
    this.port.onmessage = (e) => {
      const d = e.data || {};
      if (d.patch) this.patch[d.patch] = d.def;
      // MML の #voice で作ったパッチ。音符より先に入れる(sound/audio.js の MML_PATCHES)
      if (d.patches) Object.assign(this.patch, d.patches);
      if (d.add) this.add(d.add);
      if (d.cut) { this.events = []; this.at = 0; this.cutAt = 0; this.pedIv = {}; }
    };
  }

  /** 音符を足す。時刻順に並べ直して、済んだぶんは捨てる */
  add(list) {
    if (!list.length) return;
    // 押さえ替えのノイズ(modalHandling)。前の音を離したところで鳴るので、次の音を受け取ったときに
    // 決めて差し込む。和音はほぼ同時の音をひとまとまりにして、いちばん低い音で見る
    const sq = [];
    const cand = list.filter((ev) => { const d = this.patch[ev.p]; return d && (d.stringNoise > 0 || d.openRing > 0) && !ev.nf && !ev.sq && ev.f; })
      .sort((a, b) => a.t - b.t);
    // 前の音を離した時刻が、もう過ぎていることがある(リアルタイムは 0.5 秒先までしか積まない)。
    // そのときは、いまから鳴らす
    const now = typeof currentTime === 'number' ? currentTime : 0;
    for (let i = 0; i < cand.length;) {
      const p = cand[i].p, t = cand[i].t;
      let f = Infinity, end = null, j = i;
      const group = [];
      // かき鳴らした和音は少しずつずれて届くので、1 つ前の音から 30 ミリ秒以内ならつなげる
      for (; j < cand.length && cand[j].p === p && (j === i || cand[j].t - cand[j - 1].t < 0.03); j++) {
        f = Math.min(f, cand[j].f);
        group.push(cand[j]);
        if (cand[j].d != null) end = Math.max(end ?? -Infinity, cand[j].t + cand[j].d);
      }
      const n = this.sqCount[p] = (this.sqCount[p] || 0) + 1;
      const prev = this.sqLast[p] || null;
      const r = modalHandling(this.patch[p], { t, f, p }, prev, cand[i].k ?? n, now, guitarHand);
      // 次の音から見た「前」。いちばん低い音の高さ、離した時刻、手の位置と弦
      this.sqLast[p] = { t, f, end, ...r.hand, evs: group };
      // 滑らせる前の音。声を探すのは鳴らすときなので、音符そのものを持たせる
      for (const e of r.ev) { if (e.bend && prev) e.from = prev.evs; sq.push(e); }
      i = j;
    }
    // 鍵盤の音(keyNoise)。押して鍵盤が底に当たるコトッと、離して戻るコト。弦は関係しないので、
    // 消音ペダルでも鳴る(2026-10-14。消音でも鍵盤を押す音がするという動画を見た、と言われた)。
    // 音が鳴るのとほぼ同時に底に当たる(Goebl ほか 2014、OFAI の報告)。どちらも鈍い木の音(低い山)に、
    // 短いカチを重ねる。鍵盤ごとに木の長さが違うので、山の高さを鍵ごとに少しずらす(乱数ではなく鍵で決まる)。
    // 指が鍵盤の上面を叩く音(音の 20〜30 ミリ秒前)は、弾き方で変わるので、まだ入れていない。
    // 値は見当で、録音には合わせていない(鍵盤の音だけの録音が見つからなかった)
    for (const ev of list) {
      const d = this.patch[ev.p];
      if (!d || !(d.keyNoise > 0) || ev.nf || ev.sq || !ev.f) continue;
      const m = Math.round(12 * Math.log2(ev.f / 440) + 69);
      let x = Math.imul(m + 1, 0x27d4eb2f) >>> 0; x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d) >>> 0; x ^= x >>> 13;
      const kh = (x >>> 0) / 4294967296;
      const vel = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
      const g = d.keyNoise * Math.pow(vel, 1.5);
      const fb = 170 * (0.85 + 0.3 * kh);
      sq.push({ t: ev.t + 0.003, p: ev.p, sq: 1, nf: 1, sqLen: 0.022, sqF: 0, sqB: fb, sqN: 0.45, sqHp: 50, sqSeed: m * 7 + 1, v: 0.5 * g });
      sq.push({ t: ev.t + 0.003, p: ev.p, sq: 1, nf: 1, sqLen: 0.004, sqF: 0, sqB: 2600, sqN: 0.8, sqHp: 800, sqSeed: m * 7 + 2, v: 0.25 * g });
      // 放したとき。鍵盤が落ちる音と、ハンマーが元の位置(ハンマーレールの緑のフェルト)に落ちる音。
      // 調律師の解説では、カタカタ・コトコトは主にこちらで、パーツが着地する音。いつも鳴っているが、
      // 弦の音に消されて気にならない。消音にすると目立つ(2026-10-14、解説の動画と文を見せてもらった)。
      // ハンマーはフェルトに落ちるので、鍵盤より柔らかく少し遅れる
      if (ev.d != null) {
        const r = d.keyNoise * 0.6;
        sq.push({ t: ev.t + ev.d, p: ev.p, sq: 1, nf: 1, sqLen: 0.018, sqF: 0, sqB: fb * 1.2, sqN: 0.45, sqHp: 50, sqSeed: m * 7 + 3, v: 0.5 * r });
        sq.push({ t: ev.t + ev.d, p: ev.p, sq: 1, nf: 1, sqLen: 0.003, sqF: 0, sqB: 3000, sqN: 0.8, sqHp: 800, sqSeed: m * 7 + 4, v: 0.2 * r });
        sq.push({ t: ev.t + ev.d + 0.012 + 0.006 * kh, p: ev.p, sq: 1, nf: 1, sqLen: 0.025, sqF: 0, sqB: fb * 1.6, sqN: 0.6, sqHp: 80, sqSeed: m * 7 + 5, v: 0.35 * r });
      }
    }
    // ロール(roll、1 秒に何打)。1 つの音符を、左右交互に打ち続けるものにする。2 打目からは
    // 1 打目の声を叩き直す(start の ev.rs)。間隔と強さは種で決まるぶんだけばらつかせる。
    // 左右の手の差は付けない(録音で 1dB 未満だった。2026-10-14)
    for (const ev of list) {
      const d = this.patch[ev.p];
      if (!d || !(d.roll > 0) || ev.nf || ev.sq || ev.rs) continue;
      const n = this.rollCount[ev.p] = (this.rollCount[ev.p] || 0) + 1;
      const k = ((ev.k ?? n) + 1) * 7919 + (d.rollSeed | 0) * 104729;
      const u = (i) => { let x = Math.imul(k + i * 2654435761, 0x27d4eb2f) >>> 0; x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d) >>> 0; x ^= x >>> 13; return (x >>> 0) / 4294967296; };
      const vel = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
      const end = ev.t + (ev.d == null ? 1 : ev.d);
      const step = 1 / d.roll, jit = d.rollJitter ?? 0.15, vary = d.rollVary ?? 3;
      let t = ev.t;
      for (let i = 1; ; i++) {
        t += step * (1 + jit * (2 * u(2 * i) - 1));
        if (t >= end - 0.01) break;
        // 強弱(v2、MML の @to)。強さを始まりから終わりまで真っ直ぐ動かす
        const vt = ev.v2 == null ? vel : vel + (Math.max(0, Math.min(1, ev.v2)) - vel) * (t - ev.t) / (end - ev.t);
        // 大きさは強さの 1.5 乗なので、±vary dB にするには強さを 1/30 で動かす
        const vi = Math.min(1, vt * Math.pow(10, vary * (2 * u(2 * i + 1) - 1) / 30));
        sq.push({ t, p: ev.p, f: ev.f, v: vi, nf: 1, rs: ev, h: ev.h });
      }
    }
    // スナップ(snap)。弦を指板から引き離して放すと、戻った弦が指板に当たってパチッと鳴る
    // (ロカビリーのスラップ。2026-10-14)。録音が手に入らず、見当で作った。高さによらない短い雑音
    for (const ev of list) {
      const d = this.patch[ev.p];
      if (!d || !(d.snap > 0) || ev.nf || ev.sq || ev.rs || !ev.f) continue;
      const vel = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
      const m = Math.round(12 * Math.log2(ev.f / 440) + 69);
      const g = d.snap * Math.pow(vel, 1.5);
      // 親指(thumbBelow より低い音)。親指の骨で弦を叩く「ベン」。叩いた弦が指板に当たるが、引っぱって放すより
      // 当たり方が鈍い。エレキのスラップの低い音(E1)では、パチッが 1.3kHz ほどで、20〜30 ミリ秒残った
      // (こちらは 1.8kHz ほど、15 ミリ秒ほど。木の指板とガット弦なので、それより長くは残さない)。
      // 頭は少し長く、明るさは控えめにする(指の腹より硬いが、爪や引っかけた指ほどではない)。
      // 高い音は指で引っぱって放す「ペキッ」。チョッパーの定番(親指で低い音、指で 1 オクターブ上)が、
      // 書き分けなくてもそのまま鳴る(2026-10-14)
      // 手のひら(palm)。手のひらで弦を指板に叩きつける、音程の無い音。
      // 雑音と鈍い山(190Hz)で作ったら、スネアドラムにしか聞こえなかった(2026-10-14)。それはスネアの作り方そのもの。
      // 手のひらは 4 本の弦をまとめて指板へ押しつけるので、4 本の開放弦(E1 A1 D2 G2)がごく短く鳴って止まる。
      // それを鳴らし、木の「コッ」は一瞬だけにする。書いた音そのものは鳴らさない(4 本で代える)
      if (d.palm > 0) {
        for (const [k, om] of [28, 33, 38, 43].entries()) {
          sq.push({ t: ev.t + 0.0015 * k, p: ev.p, f: 440 * Math.pow(2, (om - 69) / 12), v: vel * 0.8, nf: 1, d: 0.06, h: { sharp: 1.2, bright: 0.95, noise: 0.15 } });
        }
        sq.push({ t: ev.t + 0.001, p: ev.p, sq: 1, nf: 1, sqLen: 0.004, sqF: 0, sqB: 900, sqN: 1, sqHp: 400, sqLp: 2000, sqSeed: m * 11 + 11, v: 0.8 * g });
        ev.palmMain = 1;
        continue;
      }
      if (d.thumbBelow > 0 && ev.f < d.thumbBelow) {
        // 親指で叩いた音を止めたあとは、ゆっくり消す(thumbRelease)。録音の親指の音は、止めてから 250 ミリ秒ほどかけて
        // 24dB ほど落ちる。引っぱる音のようにすぐ止めない(2026-10-20)
        if (d.thumbRelease > 0) ev.relT = d.thumbRelease;
        // 親指の音だけを明るくする(thumbBright、thumbBrightFreq あたりを持ち上げる)。こもった 300Hz あたりは thumbBox で下げる。
        // 録音の親指の音は、こちらより 1kHz から上が 6〜22dB 多く、250〜355Hz が 5〜10dB 少ない。
        // 胴の山(body)で親指の音だけを変えて聞き比べ、1.8kHz +16dB と 300Hz −10dB で近づいたと言われた(2026-10-23)
        if (d.thumbBright || d.thumbBox) ev.tbody = [d.thumbBrightFreq, d.thumbBright, 0.2, 300, d.thumbBox, 0.5];
        // 頭は音色の頭から決める。thumbDull が 1 で、長さ +10 ミリ秒、明るさ −0.2、雑音 2 割。
        // 親指の腹は弦に数ミリ秒触れるので、それより速い揺れ(上の倍音)が出にくい。長さは掛けずに足す。
        // 掛けると、頭の短い音色(エレキのスラップ、0.57 ミリ秒)では 2 ミリ秒にもならず、E1 の倍音に効かなかった。
        // ウッドベース(sharp 2.5、bright 0.92、noise 0.3、thumbDull 0.075)では 3.25、0.905、0.28 になる
        const dull = d.thumbDull;
        ev.h = Object.assign({ sharp: d.head.sharp + 10 * dull, bright: d.head.bright - 0.2 * dull, noise: d.head.noise * (1 - 0.8 * dull) }, ev.h || {});
        sq.push({ t: ev.t + 0.002, p: ev.p, sq: 1, nf: 1, sqLen: 0.025, sqF: 0, sqB: 1100, sqN: 1, sqHp: 350, sqLp: 1800, sqSeed: m * 11 + 9, v: 0.7 * g });
        sq.push({ t: ev.t + 0.002, p: ev.p, sq: 1, nf: 1, sqLen: 0.018, sqF: 0, sqB: 280, sqN: 0.5, sqHp: 100, sqSeed: m * 11 + 10, v: 0.8 * g });
        // 親指が弦を打った瞬間の「ドン」(thump)。録音では叩いた直後の 50 ミリ秒だけ 120〜600Hz が 4dB ほど大きく、
        // そのあとは平らに鳴り続ける。弦の鳴りそのものを速く消したら、三味線のようになった(2026-10-17)。
        // 弦はそのままにして、1 オクターブ上で同じ弦をごく短く鳴らして重ねる。基音を含まないので低いほうは膨らまず、
        // 音の高さに付いてくるので、別の楽器が鳴っているようにも聞こえない
        // 音符で切るとリリースのぶん残るので、弦の減り方そのものを速くして thumpLen で消えるようにする
        // 重ねるのは 1/4 周期あと。叩かれた弦がいちばん大きく振れて、フレットに当たるころ。
        // 同時に鳴らすと頭の山がそのまま重なり、ピークが 1.5 倍になった(割れないように下げると、全体が小さくなる)。
        // 1/4 周期ずらすと、ピークは足す前とほぼ同じまま、120〜600Hz の頭が持ち上がる(2026-10-17)
        if (d.thump > 0) sq.push({ t: ev.t + 0.25 / ev.f, p: ev.p, f: ev.f * 2, v: vel, ampK: d.thump, nf: 1, d: d.thumpLen, t60k: d.thumpLen / d.t60, h: ev.h, tbody: ev.tbody });
        continue;
      }
      // 引っぱる音だけの大きさ(pullLevel)と、高い倍音の消え方(pullDamp)。録音のスラップは、引っぱる音が親指より
      // 3〜6dB 小さいだけで明るい。こちらは 10dB ほど小さく暗かった。聞き比べで、+3dB と damp 0.5 がよいと言われた(2026-10-18)。
      // 前に弦だけを 12dB 上げたときは不自然と言われた(pullBoost、2026-10-16)。今度は 3dB で、パチッも一緒に上げる
      // (聞き比べたときは、引っぱる音を level ごと上げた別の音色で鳴らしていた)
      // 低い引っぱる音(D2 E2 あたり)は、頭が短いぶん低い倍音が出にくく、親指より 13dB ほど小さかった。
      // 録音では D2 の引っぱる音は親指とほぼ同じ大きさ(2026-10-18)。thumbBelow のところで pullLow dB 上げ、
      // 1.5 オクターブ上で 0 になるようにする
      const lw = d.thumbBelow > 0 ? Math.max(0, 1 - Math.log2(ev.f / d.thumbBelow) / 1.5) : 0;
      const low = d.pullLow * lw;
      const pk = d.pullLevel * Math.pow(10, low / 20);
      // 低い引っぱる音の頭(pullLowDull)。録音の D2 の引っぱる音は 1・2 倍音が強く、3 倍音 −10dB、5 倍音から上は −30dB の
      // 丸い音。こちらは 20 倍音まで平らで、薄く明るかった。雑音だけのごく短い頭は、低い倍音を叩けず、毎回ばらつく
      // (同じ D2 で −19〜−26dB)。親指(thumbDull)と同じ形で、低いほど頭を長く・暗く・なめらかにする(2026-10-18)
      // 頭は 1 オクターブ上で元に戻す。1.5 オクターブだと、E3 の引っぱる音まで丸く大きくなった(聞き比べで決めた明るさが崩れる)
      const lw1 = d.thumbBelow > 0 ? Math.max(0, 1 - Math.log2(ev.f / d.thumbBelow)) : 0;
      if (d.pullLowDull > 0 && lw1 > 0) {
        const dull = d.pullLowDull * lw1;
        ev.h = Object.assign({ sharp: d.head.sharp + 10 * dull, bright: d.head.bright - 0.2 * dull, noise: d.head.noise * (1 - 0.8 * dull) }, ev.h || {});
      }
      if (pk !== 1) ev.ampK = pk;
      // 強く引っぱった弦(2026-10-20)。「ぺけっ」は弦が強く引っぱられているから、と言われた。
      // 大きく引っぱるほど、離した直後は張りが増えて高く鳴り(pullBend、attackBend の代わり)、
      // 戻った弦が大きく振れてフレットに当たる(pullBuzz、びびりの大きさ)
      if (d.pullBend > 0) ev.bend = d.pullBend;
      // 低い引っぱる音(親指のすぐ上、D2 E2 あたり)には付けない。0:08 あたりで不自然と言われた。強い引っぱる音(1 オクターブ上)で
      // いっぱいに鳴らす(2026-10-20)
      if (d.pullBuzz > 0 && lw1 < 1) { ev.buzz = d.pullBuzz * (1 - lw1); ev.buzzT = d.pullBuzzTime; }
      // 引っぱる音は左手ですぐ止める(pullStop)。録音の E3 の引っぱる音は、100 ミリ秒ほど鳴って 130 ミリ秒で消える。
      // こちらは 8 分音符の長さいっぱい(220 ミリ秒)鳴っていた。もっと短い音に聞こえる、と言われた(2026-10-20)
      // ハンマリングやスライドでつなぐ音(tie、gs)は止めない。止めると、つないだ先がぶつ切りに聞こえた。
      // 弾く人も、続けて鳴らすところでは止めない(2026-10-20)
      if (d.pullStop > 0 && ev.d != null && ev.d > d.pullStop && ev.tie == null && !ev.gs) ev.d = d.pullStop;
      if (d.pullDamp !== d.damp) ev.damp = d.pullDamp;
      // 高さの決まった波を混ぜると、どの音でも同じ高さの「タタタン」が鳴り、別の楽器が一緒に鳴っているように
      // 聞こえた(2026-10-14)。雑音だけにして、高いほうを丸めて暗さを出す
      sq.push({ t: ev.t + 0.002, p: ev.p, sq: 1, nf: 1, sqLen: 0.006, sqF: 0, sqB: 1700, sqN: 1, sqHp: 500, sqLp: 2500, sqSeed: m * 11 + 7, v: g * pk });
      // 指板の木が鳴る鈍い音。上のパチッはエレキのスラップ(1.3〜3.3kHz)より暗めの 1.9kHz ほど
      sq.push({ t: ev.t + 0.002, p: ev.p, sq: 1, nf: 1, sqLen: 0.012, sqF: 0, sqB: 350, sqN: 0.5, sqHp: 120, sqSeed: m * 11 + 8, v: 0.6 * g * pk });
      // 引っぱった弦が指板に当たるときの「ドッ」(pullKnock)。録音の引っぱる音は、頭の 8 ミリ秒だけ 60〜250Hz が
      // そのあとより 20〜28dB 大きい。弦の基音より下まで出ているので、弦の音ではなく打撃の音。
      // 迫力は音色よりも最初の短いところにある、と言われた(2026-10-20)。短い低い山を 1 つ足す
      if (d.pullKnock > 0) sq.push({ t: ev.t + 0.001, p: ev.p, sq: 1, nf: 1, sqLen: d.pullKnockLen, sqF: 0, sqB: 180, sqN: 0.15, sqHp: 30, sqLp: 1200, sqSeed: m * 11 + 12, v: d.pullKnock * g * pk });
    }
    if (sq.length) list = list.concat(sq);
    // 右ペダルの区間(MML の生音の区間の @ped)。音符が持ってくる。同じ区間は何度来ても 1 つ
    for (const ev of list) {
      if (!ev.pd) continue;
      const iv = this.pedIv[ev.p] || (this.pedIv[ev.p] = new Map());
      for (const [a, b] of ev.pd) iv.set(a.toFixed(4) + '|' + b.toFixed(4), [a, b]);
    }
    // 鳴りはじめる時刻(s0)を先に決めておく。align のある音色は、頭のいちばん大きい
    // ところが音符の時刻に来るように、そのぶん早く鳴りはじめる
    for (const ev of list) ev.s0 = ev.t - this.lead(ev);
    const rest = this.events.slice(this.at).concat(list);
    rest.sort((a, b) => a.s0 - b.s0);
    this.events = rest;
    this.at = 0;
  }

  /** 山 1 つ(粒があるときは粒 1 つ)の長さ(サンプル)。強さで短く、高い音ほどハンマーが硬いぶん短くなる */
  bumpLen(def, h, vel, f0) {
    const hk = def.pitched ? Math.pow(Math.max(1, f0 / (h.hardFrom || 261.63)), h.hardKey || 0) : 1;
    return Math.max(2, Math.round(h.sharp * 0.001 * sampleRate * (1.4 - 0.6 * vel) / hk));
  }

  /** 頭の長さ(サンプル)。粒があるときは、散らばる幅のぶん長くなる */
  headLen(def, h, vel, f0) {
    const b = this.bumpLen(def, h, vel, f0);
    return h.grains > 0 ? b + Math.round((h.scatter || 0) * 0.001 * sampleRate) : b;
  }

  /**
   * 音符の時刻より何秒早く鳴りはじめるか。頭の山は長さの半分のところにある。
   * 遅らせる側は持たない。後ろに置くノリは、拍を基準にすべてのパートへ効く演奏の層の
   * 話で、音色の補正とは役目が違う(2026-10-05)
   */
  lead(ev) {
    const def = this.patch[ev.p];
    if (!def) return 0;
    const h = ev.h ? Object.assign({}, def.head, ev.h) : def.head;
    if (!(h.align > 0)) return 0;
    const vel = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
    return h.align * this.headLen(def, h, vel, ev.f || def.base) / 2 / sampleRate;
  }

  /** 空いている声。無ければいちばん古い声を取る */
  pick() {
    const vo = this.voice;
    let best = 0, oldest = Infinity;
    for (let v = 0; v < V; v++) {
      const o = v * K;
      if (!vo[o + ON]) return v;
      if (vo[o + BORN] < oldest) { oldest = vo[o + BORN]; best = v; }
    }
    return best;
  }

  start(ev, off) {
    const def = this.patch[ev.p];
    if (!def) return;
    // 手のひらの音(palm)は、書いた音を鳴らさず、4 本の開放弦で代える(add で足してある)
    if (ev.palmMain) return;
    const sr = sampleRate;
    const vo = this.voice;
    // ロールの 2 打目から(ev.rs が 1 打目の音符)。新しい声を取らず、1 打目の声を叩き直す。
    // 鳴っている膜を叩くので、共振器の揺れは消さずに、打った力を足す。
    // 1 打目の声がもう別の音に取られていたら、打たない
    // スラーの続き(MML の c&e)。弦の楽器(neck が 1 か 2)では、鳴っている弦の高さを変えて、
    // 指で叩いた(ハンマリング)か引っかけた(プリング)ぶんだけ小さく叩き直す。弾き直さない
    if (ev.sl != null) {
      const tv = this.ties.get(ev.p + '|' + ev.sl);
      if (!tv || !(def.neck > 0) || !ev.f) return;
      const w = tv.v * K;
      if (vo[w + ON] !== 1 || vo[w + BORN] !== tv.born) return;
      const steps = 12 * Math.log2(ev.f / tv.f);
      if (Math.abs(steps) < 0.01) return;
      vo[w + BNS] = steps; vo[w + BNC] = 0; vo[w + BNT] = -off;
      // 指が弦を押さえる(離す)のは一瞬。3 ミリ秒で移る
      vo[w + BNL] = Math.max(1, Math.round(0.003 * sr)); vo[w + BNF] = 1;
      tv.f = ev.f;
      // 叩き直す強さ。弾いたときの 4 割ほど(指で叩く・引っかけるのは、はじくより弱い)。見当で、録音には合わせていない
      ev.rs = { vx: tv.v, born: tv.born };
      ev.v = (ev.v == null ? 0.8 : ev.v) * 0.4;
    }
    const rs = ev.rs;
    const re = !!rs && rs.vx != null && vo[rs.vx * K + ON] === 1 && vo[rs.vx * K + BORN] === rs.born;
    if (rs && !re) return;
    const v = re ? rs.vx : this.pick();
    const o = v * K;
    ev.vx = v;
    if (ev.sq) { this.vpat[v] = null; this.vname[v] = null; this.squeak(v, def, ev, off); return; }
    this.vname[v] = ev.p;
    // 消音(silent)。弦を鳴らさない。鍵盤の音や押さえ替えのノイズは、弦の外なので鳴る(2026-10-14)
    if (def.silent) return;
    // 共鳴弦へ流すのに、どのパッチの声かを覚えておく
    this.vpat[v] = this.symBank(ev.p) ? ev.p : null;
    vo[o + SQ] = 0;
    let h = ev.h ? Object.assign({}, def.head, ev.h) : def.head;
    const vel = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
    // 失敗・崩れ。起きるかどうかは、音符の番号・音の高さ・前の音の高さ・種から決める。
    // 番号は、鳴らす側が付ける k(書いた音符の番号。繰り返しを数えない)。#looptimes の 2 周目も、
    // エコーの写しや和音のように 1 つの音符から作ったイベントも、同じところで起きる
    // (焼いた WAV が毎回同じになり、気に入った失敗を掴んで残せる。2026-10-07)。
    // k が無いとき(聞くページ、テスト)は、パッチごとに鳴らした順の数で代わりにする。
    // 失敗で足した音(nf)からは起こさない
    let amp = Math.pow(vel, 1.5), t60k = 1, fcK = 1, spot = 0, buzz = 0;
    if (!ev.nf) {
      this.count[ev.p] = (this.count[ev.p] || 0) + 1;
      const last = this.lastF[ev.p] || 0;
      this.lastF[ev.p] = ev.f || def.base;
      const fl = modalFlaws(def, ev, vel, ev.k ?? this.count[ev.p], last);
      amp *= fl.amp; t60k = fl.t60k; fcK = fl.fcK; spot = fl.spot; buzz = fl.buzz;
      if (fl.head) h = Object.assign({}, h, fl.head);
      if (fl.extra.length) this.add(fl.extra);
    }
    // 音そのものに決めた減り方と大きさの倍率(親指の「ドン」のように、足した音をすぐ消すとき)
    if (ev.t60k > 0) t60k *= ev.t60k;
    if (ev.ampK > 0) amp *= ev.ampK;
    // ハーモニクス(harmonic)。書いた高さは聞こえる高さ。弦は 1/n の高さの開放弦で、触れた節で
    // n の倍数でない倍音が止まる(modalModes で飛ばす)。弾く位置の谷も弦の長さのまま効く
    const f0 = sourOf(def, ev.f || def.base) / (def.pitched && def.harmonic >= 2 ? def.harmonic : 1);
    // 強さで頭が短く、明るくなる。波形は差し替えない
    // 音域で変わるもの。真ん中の C を基準にする
    const kr = def.pitched ? f0 / 261.63 : 1;
    // 高い音ほどハンマーが硬い。頭が短く、明るくなる。
    // hardFrom より低い側には効かせない。効かせると低音のハンマーが柔らかくなりすぎて、丸くなる。
    // 既定は真ん中の C。ベースのように低い楽器は、もっと下から効かせる
    const hk = def.pitched ? Math.pow(Math.max(1, f0 / (h.hardFrom || 261.63)), h.hardKey || 0) : 1;
    const len = this.headLen(def, h, vel, f0);
    // 強さで頭が明るくなる。velo は強さ 0〜1 で何オクターブ動くか
    const fc = Math.min(sr * 0.45, 100 * Math.pow(2, h.bright * 8 + (h.velo ?? 1.5) * (vel - 1)) * hk * fcK);
    vo[o + ON] = 1;
    vo[o + POS] = 0;
    vo[o + LEN] = len;
    vo[o + LP1] = 0;
    vo[o + LP2] = 0;
    vo[o + LPC] = 1 - Math.exp(-TAU * fc / sr);
    // 端数まで持つ。整数に丸めると、周期の短い高い音ほど叩く位置がずれて、
    // 櫛の山が出るはずのない倍音に来る(C6 で 12 番目が立っていた)
    vo[o + COMB] = Math.min(R - 2, h.comb * sr / f0);
    vo[o + AMP] = amp;
    vo[o + NOISE] = h.noise;
    vo[o + VARY] = h.vary;
    // フェルトは強く叩くほど硬くなり、力の形が尖る。山を何乗するかで持つ
    vo[o + FELT] = 1 + (h.felt || 0) * vel * vel;
    // あとから膨らむ高音(head の bloom)。弱く叩くと起きないので、強さの bloomVelo 乗で効かせる
    vo[o + BLA] = (h.bloom || 0) * Math.pow(vel, h.bloomVelo ?? 4);
    vo[o + BLR] = Math.max(1, (h.bloomRise ?? 0.3) * sr);
    vo[o + BLF] = Math.max(1, (h.bloomFall ?? 1) * sr);
    vo[o + BLP] = 0;
    vo[o + BLC] = Math.exp(-TAU * (h.bloomFrom ?? 1000) / sr);
    vo[o + BH1] = 0; vo[o + BH2] = 0;
    vo[o + BLD] = (h.bloomDrain || 0) / 8.686 / sr * Math.pow(vel, h.bloomVelo ?? 4);
    vo[o + BLK] = Math.cos(TAU * Math.min(sr * 0.45, h.bloomFrom ?? 1000) / sr);
    vo[o + BLDK] = Math.cos(TAU * Math.min(sr * 0.45, h.bloomDrainBelow ?? 300) / sr);
    vo[o + DIRECT] = def.direct || 0;
    vo[o + RATTLE] = def.rattle || 0;
    vo[o + RENV] = 0;
    vo[o + RHP] = 0;
    // ゆるんだ金具や上に置いた物の共鳴(loose)。弾き方の失敗ではなく楽器の状態なので、乱数を使わない。
    // 揺れやすい高さ(looseFreq)の近くに倍音があり、強く弾くほど揺さぶられる。揺さぶりが
    // looseFrom を越えた音だけが鳴らし、減って下回ると止まる。同じ音を同じ強さで弾けば毎回同じ
    // (2026-10-13。前はピアノのびびりを buzz の乱数で起こしていて、ときどき鳴るのはおかしいと言われた)
    let bg = 0.35;
    if (def.loose > 0 && def.pitched) {
      const lf = def.looseFreq || 233, tb = def.table;
      let top = 0;
      for (let i = 0; i < tb.length; i += 4) if (tb[i + 3] >= 0 && tb[i + 1] > top) top = tb[i + 1];
      let drive = 0;
      for (let i = 0; i < tb.length && top > 0; i += 4) {
        if (tb[i + 3] < 0) continue;
        const f = tb[i] * f0;
        // 揺れやすさは Q 10 の山。頭の明るさ(2 段のローパス)で上の倍音は弱く入る
        const x = (f - lf) / (lf / 10), y = f / fc;
        drive += tb[i + 1] / top / (1 + x * x) / (1 + y * y);
      }
      drive *= Math.pow(vel, 1.5);
      const from = def.looseFrom ?? 0.3;
      if (drive > from) {
        // 越えた分だけ大きく。2 倍で頭打ち。止まるのは、揺れが山の from / drive まで減ったところ
        const lz = def.loose * Math.min(1, (drive - from) / Math.max(1e-6, from));
        if (lz > buzz) { buzz = lz; bg = from / drive; }
      }
    }
    // 音そのものに決めたびびり(引っぱる音が戻ってフレットに当たる pullBuzz)。強く引っぱるほど大きく(強さの 2 乗)、
    // 頭のうちだけ鳴らして pullBuzzTime で消す。音色のびびりと同じ「揺れの山に対する割合」で止めると、頭の山
    // (pullKnock)の大きい音ではすぐ止まり、山の小さい音ほど長く「ざざー」と残った(2026-10-20)
    let bzd = 1;
    if (ev.buzz > 0 && ev.buzz * vel * vel > buzz) {
      buzz = ev.buzz * vel * vel; bg = 0.05;
      bzd = Math.exp(-B / (Math.max(0.005, ev.buzzT || 0.04) * sr));
    }
    vo[o + BZD] = bzd;
    vo[o + BZ] = buzz;
    vo[o + BZR] = def.buzzRasp ?? 1;
    vo[o + BZS] = 0;
    vo[o + BG] = bg;
    vo[o + BP] = 0;
    vo[o + PK] = def.pickup || 0;
    vo[o + PO] = def.pickupOffset || 0;
    vo[o + PV] = 0;
    // 振れの速さを出す(ティン)。コイルが拾うのは磁束の変化の速さで、生音で空気へ出るのも
    // 振れの速さなので、ピックアップの有る無しによらない。1 サンプルの差をとり、基音で
    // 2 sin(πf/sr) 倍になるぶんを割って基音の大きさを揃える。上の倍音は、高さに比例して強くなる。
    // ピックアップの量で切り替えると、Smart を 0 から少し上げたところでキンが 16dB 跳ねる
    vo[o + PD] = def.speed ? 1 / (2 * Math.sin(Math.PI * Math.min(f0, sr * 0.45) / sr)) : 0;
    vo[o + WD] = def.width || 0;
    vo[o + TD] = def.tremolo || 0;
    vo[o + TR] = def.tremoloRate || 0;
    vo[o + MO] = def.motor || 0;
    vo[o + MR] = def.motorRate || 0;
    // 高い音を持ち上げる。中央の C から上へ 1 オクターブごとに trebleGain dB。
    // 本物のピアノは高音でも出だしの大きさがあまり落ちない(録音で測った)
    const tg = def.trebleGain ? Math.pow(10, def.trebleGain * Math.max(0, Math.log2(kr)) / 20) : 1;
    vo[o + LEVEL] = (def.level == null ? 0.5 : def.level) * tg;
    vo[o + OFF] = off;
    if (!re) {
      vo[o + BORN] = ev.born = ++this.born;
      vo[o + BNS] = 0; vo[o + BNC] = 0;
      vo[o + REL] = ev.d == null ? -1 : ev.t + ev.d;
      // 音ごとに決めた離したあとの長さ(親指の thumbRelease)。無ければ音色の release
      vo[o + RELT] = ev.relT > 0 ? ev.relT : (def.release || 0.15);
      vo[o + HPOS] = 0;
    }
    // 頭が長いほど低い共振器へ多く入るので、そのぶん割る。
    // 鋭さは明るさだけを変え、大きさは変えない
    // フェルトで山が尖ると面積が減るので、その面積で割る。割らないと、フェルトを
    // 硬くしただけで音が小さくなる(明るさだけを変えたいパラメータ)
    let area = 0;
    for (let i = 0; i < 32; i++) area += Math.pow(Math.sin(Math.PI * (i + 0.5) / 32), vo[o + FELT]);
    area /= 32;
    // 粒。頭を 1 つの山ではなく、少しずつずれて当たる細かい山の集まりにする
    // (ブラシの線が何十本もずれて当たる「パシャ」)。時刻と大きさは種で決め、
    // vary のぶんだけ毎回ずらす。面積は粒の大きさの合計で数える
    const gn = Math.max(0, Math.min(G, h.grains | 0));
    vo[o + GN] = gn;
    if (gn > 0) {
      const gl = this.bumpLen(def, h, vel, f0);
      const span = Math.max(0, len - gl);
      vo[o + GL] = gl;
      let gs = ((h.seed | 0) * 747796405 + 2891336453) >>> 0 || 1;
      const u = () => { gs ^= gs << 13; gs >>>= 0; gs ^= gs >>> 17; gs ^= gs << 5; gs >>>= 0; return gs / 4294967296; };
      let sum = 0;
      for (let k = 0; k < gn; k++) {
        const t = (1 - h.vary) * u() + h.vary * Math.random();
        const a = 0.4 + 0.6 * ((1 - h.vary) * u() + h.vary * Math.random());
        this.grain[(v * G + k) * 2] = Math.round(t * span);
        this.grain[(v * G + k) * 2 + 1] = a / Math.sqrt(gn);
        sum += a / Math.sqrt(gn);
      }
      vo[o + NORM] = 1 / Math.max(1, area * gl * sum);
    } else {
      vo[o + NORM] = 1 / Math.max(1, area * len);
    }
    // 叩き直すときは、ここまで(頭の形と大きさ)だけを決め直す
    if (re) return;
    this.ring.fill(0, v * R, v * R + R);
    this.seed[v] = (h.seed | 0) * 2654435761 + 1 >>> 0 || 1;
    // 係数を作る。ナイキストに近いものは載せない
    const tb = def.table;
    const md = this.modes;
    // 共振器と導波管の弦の並びと減り方は modalModes で決める(余韻の長さ modalTail と同じ道)
    vo[o + WG] = 0;
    vo[o + NM] = 0;
    // 音ごとの高い倍音の消え方(引っぱる音の pullDamp)。無ければ音色のまま
    const mdef = ev.damp != null ? Object.assign({}, def, { damp: ev.damp }) : def;
    const ns = modalModes(mdef, f0, t60k, spot, sr, M, WS, (s, f, t60s, damp, bb) => {
      this.string(v, s, f, t60s, damp, bb);
      this.wg[(v * WS + s) * WK + WLV] = s === 0 ? 1 : (def.afterLevel ?? 1);
    }, (n, f, tt, a, follow) => {
      // 親指の音だけの明るさ(thumbBright・thumbBox)。胴の山と同じ 2 次のピーキングを、倍音 1 本ずつに掛ける
      if (ev.tbody) {
        let g2 = 1;
        for (let i = 0; i < ev.tbody.length; i += 3) {
          const A = Math.pow(10, ev.tbody[i + 1] / 40), q = 1 / (2 - 2 * Math.min(0.95, ev.tbody[i + 2]));
          const x = f / ev.tbody[i], d = (1 - x * x) * (1 - x * x);
          g2 *= (d + x * x * A * A / (q * q)) / (d + x * x / (A * A * q * q));
        }
        a *= Math.sqrt(g2);
      }
      const w = TAU * f / sr;
      const r = Math.exp(-LN1000 / (Math.max(0.005, tt) * sr));
      const c = Math.cos(w), s = Math.sin(w);
      const m = (v * M + n) * S;
      md[m] = 2 * r * c;
      md[m + 1] = r * r;
      md[m + 2] = a * s;
      md[m + 3] = 0;
      md[m + 4] = 0;
      md[m + 5] = c;
      md[m + 6] = s;
      md[m + 7] = tt;
      md[m + 8] = follow ? 1 : 0;
      vo[o + NM] = n + 1;
    });
    vo[o + WG] = ns;
    // ポルタメント(MML の c*e)。弦の楽器だけ。音符の長さをかけて滑らせる
    let fNow = ev.f || def.base;
    if (ev.gs && def.neck > 0) {
      vo[o + BNS] = ev.gs; vo[o + BNC] = 0; vo[o + BNT] = -off;
      vo[o + BNL] = Math.max(1, Math.round((ev.gl || 0.1) * sr)); vo[o + BNF] = def.neck === 2 ? 1 : 0;
      fNow *= Math.pow(2, ev.gs / 12);
    }
    // 強く叩いた弦の、弾いた直後の音程の揺れ(attackBend)。大きく揺れるあいだは弦の張りが増えて高く鳴り、
    // 揺れが落ちると元の高さに戻る。Rickenbacker のスラップの録音で、強く叩くと弾いた直後に +10〜+73 セント、
    // 20〜30 ミリ秒で半分、50 ミリ秒でほぼ戻る。指弾きでは 3 セントもない(2026-10-15)。
    // 鳴りはじめに上げておき、attackBendTime 秒でなめらかに下げる。量は強さの 2 乗
    // (録音では強さ 5 と 3 で 4 倍ほど違う)。滑らせる音・失敗の音・叩き直しには掛けない
    vo[o + EBA] = 0;
    // 振れで決めるのは引っぱる音(pullBend のある音)だけ。親指の音は、頭の暗い太い音で上の倍音が少なく、低い倍音は長く鳴るので、
    // エネルギーがなかなか減らず高いまま残った。録音の親指は 50 ミリ秒ほどで戻るので、決まった曲線のままにする
    if (def.attackBend > 0 && def.bendFollow && ev.bend != null && !ev.gs && !ev.nf && !re) {
      // 振れの大きさで決める(bendFollow)。はじめに上げておき、そのあとは弦の伸びのエネルギー(倍音ごとの振れの 2 乗に
      // 高さの 2 乗を掛けて足したもの)に比例して戻す。上の倍音ほど弦を伸ばし、速く消えるので、頭で高く、すぐ戻る。
      // 止めた音は振れが落ちるので、すぐ戻る(2026-10-20、生音全体での考え直しの 2 番目)
      const ab = (ev.bend != null ? ev.bend : def.attackBend) * vel * vel / 100;
      this.shift(v, Math.pow(2, ab / 12));
      vo[o + EBA] = ab; vo[o + EBC] = ab; vo[o + EBE] = 0; vo[o + EBN] = 0;
    } else if (def.attackBend > 0 && !ev.gs && !ev.nf && !re && vo[o + BNS] === 0) {
      const ab = (ev.bend != null ? ev.bend : def.attackBend) * vel * vel / 100;
      vo[o + BNS] = ab; vo[o + BNC] = 0; vo[o + BNT] = 0; vo[o + BNL] = 1; vo[o + BNF] = 1;
      this.bend(v);
      vo[o + BNS] = -ab; vo[o + BNC] = 0; vo[o + BNT] = -off;
      vo[o + BNL] = Math.max(1, Math.round((def.attackBendTime || 0.05) * sr)); vo[o + BNF] = 1;
    }
    // ビブラート(@m)。深さはセント、速さは Hz、遅れは秒で届く
    if (ev.vb && ev.vb[0] > 0) {
      vo[o + VBD] = ev.vb[0] / 100; vo[o + VBR] = TAU * (ev.vb[1] || 5.5) / sr;
      vo[o + VBY] = Math.max(0, (ev.vb[2] || 0) * sr); vo[o + VBT] = -off; vo[o + VBC] = 0;
      vo[o + VBP] = 0; vo[o + VBM] = 1; vo[o + VBA] = 1; vo[o + VBN] = 0; vo[o + VBF] = def.neck === 1 ? 1 : 0;
    } else {
      vo[o + VBD] = 0; vo[o + VBC] = 0;
    }
    if (ev.tie != null) this.ties.set(ev.p + '|' + ev.tie, { v, born: vo[o + BORN], f: fNow });
    if (ns) {
      // 上の倍音を弱める量(tilt)を、導波管にも同じ意味で効かせる。共振器の束は表の振幅で
      // 1/n^tilt にしているが、導波管には表が無い。基音のところで切れる 1 次のローパスを
      // 頭に掛けて近づける(1 段で 1/n、2 段目を混ぜて 2 まで)。効かせないと、頭を
      // 明るくしたときに導波管だけ上の倍音が増え、境目(B4 と C5)で段差が出る
      const tl = def.tilt == null ? 1 : def.tilt;
      vo[o + TC] = 1 - Math.exp(-TAU * f0 / sr);
      vo[o + TA1] = Math.min(1, Math.max(0, tl));
      vo[o + TA2] = Math.min(1, Math.max(0, tl - 1));
      vo[o + TL1] = 0;
      vo[o + TL2] = 0;
      // 2 本目から下げたぶん(afterLevel)を足し戻す。弦の数と残る弦の大きさで、全体の大きさは変えない
      const share = 1 + (ns - 1) * (def.afterLevel ?? 1);
      vo[o + WGAIN] = GUIDE_GAIN / share * Math.pow(GUIDE_REF / f0, 0.73) * vo[o + NORM];
    }
  }

  /**
   * 導波管の弦を 1 本張る。
   *
   * ループは 遅延線 → 損失(1 次のローパス)→ 硬さ(1 次のオールパス 6 段)→
   * 端数(1 次のオールパス)→ 遅延線。1 周の長さが基音の周期になるように、
   * 損失と硬さが食う遅れを差し引いて遅延の長さを決める。
   *
   * 硬さは、上の倍音ほど 1 周を短くして高くずらす。何番目かの倍音が
   * 共振器の束と同じ高さ(n f sqrt(1 + B n^2))に来るまで、オールパスの係数を二分法で探す
   */
  string(v, s, f, t60, damp, bb) {
    const sr = sampleRate, wg = this.wg;
    const wi = (v * WS + s) * WK;
    const L0 = sr / f;
    const w0 = TAU * f / sr;
    // 損失。基音で t60、2kHz で共振器の束と同じ減り方になるように
    const g = Math.pow(10, -3 * L0 / (sr * t60));
    let a = 0;
    const f1 = Math.min(2000, 0.35 * sr);
    if (f1 > 1.5 * f && damp > 0) {
      const t1 = t60 / (1 + damp * (f1 / 1000) * (f1 / 1000));
      const r = Math.pow(10, -3 * L0 / sr * (1 / t1 - 1 / t60));
      const q = r * r, c1 = Math.cos(TAU * f1 / sr);
      if (q < 1) a = ((1 - q * c1) - Math.sqrt(Math.max(0, (1 - q * c1) ** 2 - (1 - q) ** 2))) / (1 - q);
    }
    const ap = (c, w) => -(Math.atan2(-Math.sin(w), c + Math.cos(w))
      - Math.atan2(-c * Math.sin(w), 1 + c * Math.cos(w))) / w;
    const lossD = (w) => a === 0 ? 0 : Math.atan2(a * Math.sin(w), 1 - a * Math.cos(w)) / w;
    // 係数 c のときの遅延の長さと端数。短すぎて組めなければ null
    const fit = (c) => {
      const rest = L0 - lossD(w0) - AP * ap(c, w0);
      const N = Math.floor(rest - 0.5);
      if (N < 2 || N >= WR - 1) return null;
      const d = rest - N;
      return { N, eta: (1 - d) / (1 + d) };
    };
    let c = 0;
    const nt = Math.max(2, Math.min(12, Math.floor(0.3 * sr / f)));
    if (bb > 0) {
      const ft = nt * f * Math.sqrt(1 + bb * nt * nt);
      const wt = TAU * ft / sr;
      const err = (c) => {
        const z = fit(c);
        if (!z) return -1;
        return z.N + lossD(wt) + AP * ap(c, wt) + ap(z.eta, wt) - nt * sr / ft;
      };
      if (err(0) > 0) {
        let lo = -0.95, hi = 0;
        for (let k = 0; k < 28; k++) {
          const mid = (lo + hi) / 2;
          if (err(mid) > 0) hi = mid; else lo = mid;
        }
        c = hi;
      }
    }
    const z = fit(c) || fit(0);
    wg.fill(0, wi, wi + WK);
    wg[wi + WN] = z.N;
    wg[wi + WETA] = z.eta;
    wg[wi + WC] = c;
    wg[wi + WGG] = g;
    wg[wi + WA] = a;
    wg[wi + WT60] = t60;
    wg[wi + WL] = L0;
    this.wring.fill(0, (v * WS + s) * WR, (v * WS + s + 1) * WR);
  }

  /**
   * 押さえ替えのノイズ(modalHandling)を鳴らす声を張る。共振器も導波管も頭も持たない。
   * キュッは、指が巻き弦の上を滑り、巻き線の段差を 1 つずつなぞる音。段差を通る速さが高さになるので、
   * 滑っているあいだの速さはほぼ一定とみて、高さは動かさない。
   * チッは、高さを動かさずに雑音を多めにした短いもの
   */
  squeak(v, def, ev, off) {
    const vo = this.voice, o = v * K, sr = sampleRate;
    vo[o + ON] = 1;
    vo[o + NM] = 0; vo[o + WG] = 0;
    // 頭は無い。head() がすぐ終わるよう、尽きたところから始める
    vo[o + LEN] = 0; vo[o + POS] = R;
    vo[o + DIRECT] = 0; vo[o + RATTLE] = 0; vo[o + BZ] = 0; vo[o + RENV] = 0;
    vo[o + PK] = 0; vo[o + PD] = 0; vo[o + WD] = 0; vo[o + TD] = 0; vo[o + TR] = 0;
    vo[o + LEVEL] = def.level == null ? 0.5 : def.level;
    vo[o + OFF] = off;
    vo[o + BORN] = ++this.born;
    vo[o + REL] = -1;
    vo[o + SQ] = ev.v;
    // 塊の途中から始める。OFF は頭の処理(head)が先に読んで 0 に戻すので、こちらは
    // 経った数を負から始めて数える。OFF を使うと、塊の頭まで最大 128 サンプル早く鳴った
    vo[o + SQP] = 0; vo[o + SQT] = -off; vo[o + SQH] = 0; this.sqLp[v] = 0; this.sqBp[v] = 0;
    vo[o + SQL] = Math.max(1, Math.round(ev.sqLen * sr));
    vo[o + SQF] = ev.sqF; vo[o + SQB] = ev.sqB; vo[o + SQN] = ev.sqN ?? 0.15; vo[o + SQC] = ev.sqHp || 0; vo[o + SQLP] = ev.sqLp || 0;
    this.seed[v] = (ev.sqSeed | 0) * 2654435761 + 1 >>> 0 || 1;
    // 押さえていた前の音を、滑るあいだに同じだけ動かす。前の音がまだ同じ声で鳴っているときだけ
    if (ev.bend && ev.from) {
      for (const e of ev.from) {
        if (e.vx == null || e.vb == null) continue;
        const w = e.vx * K;
        if (!vo[w + ON] || vo[w + BORN] !== e.vb) continue;
        vo[w + BNS] = ev.bend; vo[w + BNC] = 0; vo[w + BNT] = -off; vo[w + BNL] = vo[o + SQL]; vo[w + BNF] = 0;
      }
    }
  }

  /** 押さえ替えのノイズを vb へ足す。終わったら大きさを 0 にする */
  squeakRender(v) {
    const vo = this.voice, vb = this.vb, o = v * K, sr = sampleRate;
    const amp = vo[o + SQ], len = vo[o + SQL], fpk = vo[o + SQF], fb = vo[o + SQB], nm = vo[o + SQN];
    let t = vo[o + SQT], ph = vo[o + SQP], hp = vo[o + SQH], lp = this.sqLp[v], sd = this.seed[v], b1 = this.sqBp[v];
    // 低いほうを抜く(1 次)。指が弦を押す鈍い音は要らない。鍵盤の音は、鈍い音そのものなので低く抜く
    const a = Math.exp(-TAU * (vo[o + SQC] || 400) / sr);
    // 高いほうを少し丸める(1 次)。のこぎりのままだとジッパーのように聞こえた。
    // 1.8kHz まで丸めると、今度は音程が埋もれて雑音に聞こえた。本物は音程のはっきりしたキュッ(2026-10-13)
    // キュッは高いので 8kHz まで通す(2026-10-13。1kHz あたりでは低い、と言われた)
    const c = 1 - Math.exp(-TAU * Math.min(vo[o + SQLP] || (fpk > 0 ? 8000 : 4000), sr * 0.4) / sr);
    for (let i = 0; i < B && t < len; i++, t++) {
      if (t < 0) continue;
      const u = t / len;
      let f, env;
      if (fpk > 0) {
        // キュー。高さは一定(sqF)で、大きさはほぼ平らで、終わりだけ切る。
        // 前は上がって下がる形(滑る速さの山)で、大きさも同じ山にしていた。ジーと聞こえた(2026-10-13)。
        // その次は頭で一気に上がる形にしたが、短く減っていくように聞こえた。本物は抑揚が少ない(2026-10-13)。
        // 高さを上げていくと、カモメが鳴いているように聞こえた(2026-10-14)。
        // 高さは滑る速さで決まり、滑っているあいだの速さはほぼ一定なので、動かさない
        f = fpk;
        // 短いキュッ(20 ミリ秒ほど)でも形が残るよう、終わりの切り方は長さの 4 割までにする
        env = Math.min(1, t / (0.004 * sr)) * Math.min(1, (len - t) / Math.min(0.012 * sr, 0.4 * len));
      } else {
        // チッ。高さは動かない
        f = fb;
        env = Math.sin(Math.PI * u);
      }
      const pp = ph;
      ph += f / sr;
      if (ph >= 1) ph -= 1;
      sd ^= sd << 13; sd >>>= 0; sd ^= sd >>> 17; sd ^= sd << 5; sd >>>= 0;
      const z = sd / 2147483648 - 1;
      let x;
      if (fpk > 0) {
        // キュッは、巻き線の山を 1 つ越えるたびの小さなカチの並び。山を越える間隔はそろわないので、
        // 1 つずつ少しずらし(次までを最大 3 割のばす)、強さも揺らす。カチは 0.1 ミリ秒ほどで消える。
        // 響かせない(乾いた音)。
        // 前は音程の波と、その高さのまわりを通した雑音(Q 2)の半々で、もっと乾いた音だと言われた(2026-10-14)。
        // その前は、音程の波だけでカモメ、雑音を細かく揺らしてざらつき、ホワイトノイズでザーザーと言われた
        if (ph < pp) {
          b1 += 1 + 0.4 * z;
          ph -= 0.3 * (0.5 + 0.5 * z);
        }
        const cl = b1;
        b1 *= 0.55;
        x = (1 - nm) * cl * 2.2 + nm * z * 0.5;
      } else {
        // チッは、倍音の少ない丸い波に雑音を多めに混ぜる
        const w = Math.sin(TAU * ph) + 0.25 * Math.sin(2 * TAU * ph);
        x = (1 - nm) * w + nm * z;
      }
      lp += c * (x - lp);
      const y = lp - hp;
      hp = lp + a * (hp - lp);
      vb[i] += amp * env * y;
    }
    vo[o + SQT] = t; vo[o + SQP] = ph; vo[o + SQH] = hp; this.sqLp[v] = lp; this.seed[v] = sd; this.sqBp[v] = b1;
    if (t >= len) vo[o + SQ] = 0;
  }

  /** 導波管の弦を回して vb へ足す。まだ鳴っている弦の数を返す */
  strings(v, live) {
    const vo = this.voice, wg = this.wg, ring = this.wring, vb = this.vb;
    const o = v * K;
    // 頭に tilt のローパスを掛けたもの。基音での大きさは変えない(√2 を掛け戻す)
    const hb = this.tb;
    if (live) {
      const c = vo[o + TC], a1 = vo[o + TA1], a2 = vo[o + TA2];
      let l1 = vo[o + TL1], l2 = vo[o + TL2];
      for (let i = 0; i < B; i++) {
        const x = this.hb[i];
        l1 += c * (x - l1);
        const y1 = (1 - a1) * x + a1 * 1.4142 * l1;
        l2 += c * (y1 - l2);
        hb[i] = (1 - a2) * y1 + a2 * 1.4142 * l2;
      }
      vo[o + TL1] = l1; vo[o + TL2] = l2;
    }
    const ns = vo[o + WG];
    const gin = vo[o + WGAIN];
    let alive = 0;
    for (let s = 0; s < ns; s++) {
      const wi = (v * WS + s) * WK;
      const N = wg[wi + WN];
      if (!N) continue;
      const rb = (v * WS + s) * WR;
      const eta = wg[wi + WETA], c = wg[wi + WC], a = wg[wi + WA];
      const gg = wg[wi + WGG] * (1 - a);
      const gl = gin * wg[wi + WLV];
      let lp = wg[wi + WLP], t1 = wg[wi + WT1], t2 = wg[wi + WT2], wp = wg[wi + WP];
      let e = 0;
      for (let i = 0; i < B; i++) {
        let rd = wp - N;
        if (rd < 0) rd += WR;
        const x = ring[rb + rd];
        lp = gg * x + a * lp;
        let u = lp;
        for (let k = 0; k < AP; k++) {
          const j = wi + WAPS + 2 * k;
          const y = c * u + wg[j] - c * wg[j + 1];
          wg[j] = u; wg[j + 1] = y; u = y;
        }
        const yt = eta * u + t1 - eta * t2;
        t1 = u; t2 = yt;
        ring[rb + wp] = live ? yt + hb[i] : yt;
        if (++wp >= WR) wp = 0;
        vb[i] += x * gl;
        e += x * x;
      }
      wg[wi + WLP] = lp; wg[wi + WT1] = t1; wg[wi + WT2] = t2; wg[wi + WP] = wp;
      // 減りきった弦は止める。読む位置は書く位置の N サンプル後ろなので、
      // 1 周ぶん静かなのを見てからにする。でないと頭が回ってくる前に止めてしまう
      if (!live && e < B * QUIET * QUIET) wg[wi + WQ] += B;
      else wg[wi + WQ] = 0;
      if (wg[wi + WQ] > N + B) wg[wi + WN] = 0;
      else alive++;
    }
    return alive;
  }

  /**
   * 押さえたまま滑らせる。フレットを 1 つ越えるごとに半音ずつ、音の高さに付いていく共振器を
   * ずらす。滑る速さは一定なので、越える時刻は等しく並ぶ。
   * 振れの大きさと位相はそのまま、高さだけを変える(y2 を新しい高さで作り直す)
   */
  bend(v) {
    const vo = this.voice, md = this.modes, o = v * K;
    const steps = vo[o + BNS], len = vo[o + BNL];
    const t = vo[o + BNT] + B;
    vo[o + BNT] = t;
    const u = Math.min(1, Math.max(0, t / len));
    // フレットのある弦は半音ずつ段で、無い弦はなめらかに動く
    const want = vo[o + BNF] ? steps * u : Math.sign(steps) * Math.min(Math.abs(steps), Math.floor(u * Math.abs(steps) + 1e-9));
    const d = want - vo[o + BNC];
    if (d) {
      this.shift(v, Math.pow(2, d / 12));
      vo[o + BNC] = want;
    }
    if (u >= 1) vo[o + BNS] = 0;
  }

  /** 鳴っている共振器の高さを ratio 倍にする。振れの大きさと位相は保つ(滑らせる・ビブラート・弾いた直後の揺れ) */
  shift(v, ratio) {
    const vo = this.voice, md = this.modes, o = v * K;
    for (let k = 0; k < vo[o + NM]; k++) {
      const m = (v * M + k) * S;
      if (!md[m + 8]) continue;
      const c = md[m + 5], s = md[m + 6], y1 = md[m + 3], y2 = md[m + 4];
      const w = Math.atan2(s, c) * ratio;
      if (w >= Math.PI * 0.9) { md[m + 3] = 0; md[m + 4] = 0; md[m + 2] = 0; continue; }
      const c2 = Math.cos(w), s2 = Math.sin(w);
      const ac = (y1 * c - y2) / s;
      md[m + 4] = y1 * c2 - ac * s2;
      md[m] = 2 * Math.sqrt(md[m + 1]) * c2;
      md[m + 2] = md[m + 2] / s * s2;
      md[m + 5] = c2; md[m + 6] = s2;
    }
  }

  /**
   * ビブラート(MML の @m)。1 塊ごとに、揺れのいまの値まで高さを動かす。遅れのあいだは真っ直ぐで、
   * そのあと 0.08 秒で深くなる(チップの @m と同じ形)。2026-10-20
   *
   * 手で弦を揺らす形にする(2026-10-20、そういう感じで、と言われた)。
   * - フレットのある弦(neck 1)は、押さえた弦を横へ押して張りを上げるので、押さえた高さより上へだけ揺れる。
   *   押さえた高さと、深さのぶん上のあいだを行き来する。下へは行けない
   * - フレットの無い指板(neck 2)やほかの楽器は、指を転がすので上下に揺れる
   * - 手なので 1 往復ごとに速さと深さが少しずつ違う(速さ ±8%、深さ ±15%)。声ごと・往復ごとに決まる数で揺らすので、
   *   同じ曲は毎回同じに鳴る
   */
  vibrato(v) {
    const vo = this.voice, o = v * K, sr = sampleRate;
    const t = vo[o + VBT] + B;
    vo[o + VBT] = t;
    const since = t - vo[o + VBY];
    if (since <= 0) return;
    const fade = Math.min(1, since / (0.08 * sr));
    let ph = vo[o + VBP] + vo[o + VBR] * vo[o + VBM] * Math.min(B, since);
    if (ph >= TAU) {
      ph -= TAU;
      // 次の 1 往復の速さと深さ。声の生まれた数と往復の数から決める
      const n = vo[o + VBN] + 1;
      vo[o + VBN] = n;
      let h = Math.imul((vo[o + BORN] | 0) + 1, 0x9e3779b1) ^ Math.imul(n | 0, 0x85ebca6b);
      h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16;
      const u1 = (h & 0xffff) / 65535, u2 = (h >>> 16) / 65535;
      vo[o + VBM] = 1 + 0.08 * (2 * u1 - 1);
      vo[o + VBA] = 1 + 0.15 * (2 * u2 - 1);
    }
    vo[o + VBP] = ph;
    const depth = vo[o + VBD] * vo[o + VBA] * fade;
    const want = vo[o + VBF] ? depth * 0.5 * (1 - Math.cos(ph)) : depth * Math.sin(ph);
    const d = want - vo[o + VBC];
    if (Math.abs(d) > 1e-5) { this.shift(v, Math.pow(2, d / 12)); vo[o + VBC] = want; }
  }

  /** 弦の伸びのエネルギー。倍音ごとの振れの 2 乗に、高さ(1 サンプルあたりのラジアン)の 2 乗を掛けて足したもの */
  stretchEnergy(v) {
    const vo = this.voice, md = this.modes;
    let e = 0;
    for (let k = 0; k < vo[v * K + NM]; k++) {
      const m = (v * M + k) * S;
      if (!md[m + 8]) continue;
      const c = md[m + 5], sn = md[m + 6], y1 = md[m + 3], y2 = md[m + 4];
      const a2 = (y1 * y1 + y2 * y2 - 2 * y1 * y2 * c) / (sn * sn);
      const w = Math.atan2(sn, c);
      e += w * w * a2;
    }
    return e;
  }

  /** 振れの大きさで決める、弾いた直後の高さ(bendFollow)。はじめのエネルギーは頭を叩き終えるまでの山で取る */
  followBend(v) {
    const vo = this.voice, o = v * K;
    const n = ++vo[o + EBN];
    const e = this.stretchEnergy(v);
    // はじめのエネルギーは、叩き終えて振れがいちばん大きくなるところ(最初の 10 塊、27 ミリ秒まで)の山。
    // 親指のドンのように、少し遅れて足される振れもあるので、すぐには決めない
    if (n <= 10 && e > vo[o + EBE]) vo[o + EBE] = e;
    const e0 = vo[o + EBE];
    const r = e0 > 0 ? Math.min(1, e / e0) : 1;
    // エネルギーに比例させる(1 乗、張りの式のまま)と、録音より戻りが遅かった(E3 で 50 ミリ秒たっても半分残る)。
    // 録音は 20〜30 ミリ秒で半分、50 ミリ秒でほぼ戻る。2.5 乗で合わせた(E3 で 26 ミリ秒に 3 割、50 ミリ秒に 1 割)
    const want = vo[o + EBA] * Math.pow(r, 2.5);
    const d = want - vo[o + EBC];
    if (Math.abs(d) > 1e-5) { this.shift(v, Math.pow(2, d / 12)); vo[o + EBC] = want; }
    if (n > 10 && want < 0.002 * vo[o + EBA]) {
      if (vo[o + EBC]) this.shift(v, Math.pow(2, -vo[o + EBC] / 12));
      vo[o + EBA] = 0; vo[o + EBC] = 0;
    }
  }

  /** 離す。減衰を縮めるだけで、鳴っている形は崩さない */
  release(v) {
    const vo = this.voice, md = this.modes, sr = sampleRate;
    const o = v * K;
    const rt = vo[o + RELT];
    vo[o + REL] = -1;
    for (let s = 0; s < vo[o + WG]; s++) {
      const wi = (v * WS + s) * WK;
      if (this.wg[wi + WT60] <= rt) continue;
      this.wg[wi + WGG] = Math.pow(10, -3 * this.wg[wi + WL] / (sr * rt));
      this.wg[wi + WT60] = rt;
    }
    for (let k = 0; k < vo[o + NM]; k++) {
      const m = (v * M + k) * S;
      if (md[m + 7] <= rt) continue;
      const r = Math.exp(-LN1000 / (rt * sr));
      md[m] = 2 * r * md[m + 5];
      md[m + 1] = r * r;
      md[m + 7] = rt;
    }
  }

  /** 頭の塊を作る。終わっていたら false */
  head(v) {
    const vo = this.voice, hb = this.hb, ring = this.ring;
    const o = v * K;
    hb.fill(0);
    let pos = vo[o + POS];
    const len = vo[o + LEN];
    const comb = vo[o + COMB];
    const ci = Math.floor(comb), cf = comb - ci;
    const lpc = vo[o + LPC];
    const nz = vo[o + NOISE], vary = vo[o + VARY], amp = vo[o + AMP], felt = vo[o + FELT];
    const gn = vo[o + GN], gl = vo[o + GL], gb = v * G * 2, gr = this.grain;
    let lp1 = vo[o + LP1], lp2 = vo[o + LP2];
    let hp = vo[o + HPOS];
    let sd = this.seed[v], fr = this.free;
    const base = v * R;
    const off = vo[o + OFF];
    vo[o + OFF] = 0;
    // あとから膨らむ高音(bloom)。強く叩いたドラは、叩いた力が低い揺れから高い揺れへ少しずつ移り、
    // 0.3〜1 秒遅れて高い音が膨らむ(録音で、fff の 6kHz より上が叩いた瞬間より 34dB 大きくなった)。
    // 共振器は足し算でしかつながっていないので、移るところは作れない。代わりに、高いほうだけを通した
    // 雑音を、遅れて立ち上がる形で頭に足し続ける。低い共振器にはほとんど入らない
    const bla = vo[o + BLA], bb = this.bb;
    let blive = false;
    bb.fill(0);
    if (bla > 0) {
      const rise = vo[o + BLR], fall = vo[o + BLF], c = vo[o + BLC];
      let t = vo[o + BLP], h1 = vo[o + BH1], h2 = vo[o + BH2], fr2 = this.free;
      for (let i = off; i < B; i++) {
        const env = (1 - Math.exp(-t / rise)) * Math.exp(-t / fall);
        fr2 ^= fr2 << 13; fr2 >>>= 0; fr2 ^= fr2 >>> 17; fr2 ^= fr2 << 5; fr2 >>>= 0;
        const x = (fr2 / 2147483648 - 1) * env * bla;
        // 2 段のハイパス(1 次を 2 つ)
        const y1 = x - h1; h1 = c * h1 + (1 - c) * x;
        const y2 = y1 - h2; h2 = c * h2 + (1 - c) * y1;
        bb[i] = y2;
        t++;
      }
      this.free = fr2;
      vo[o + BLP] = t; vo[o + BH1] = h1; vo[o + BH2] = h2;
      // 60dB 下がったら止める
      if (t > fall * 6.9) vo[o + BLA] = 0;
      blive = true;
      this.bloomOn = true;
    }
    // 頭が尽きても、ローパスと櫛の尾が R サンプル残る
    if (pos >= len + R) return blive;
    for (let i = off; i < B; i++) {
      let x = 0;
      if (pos < len) {
        let env;
        if (gn > 0) {
          // 粒の山を足し合わせる
          env = 0;
          for (let k = 0; k < gn; k++) {
            const q = pos - gr[gb + k * 2];
            if (q >= 0 && q < gl) env += gr[gb + k * 2 + 1] * Math.pow(Math.sin(Math.PI * q / gl), felt);
          }
        } else {
          env = Math.pow(Math.sin(Math.PI * pos / len), felt);
        }
        sd ^= sd << 13; sd >>>= 0; sd ^= sd >>> 17; sd ^= sd << 5; sd >>>= 0;
        fr ^= fr << 13; fr >>>= 0; fr ^= fr >>> 17; fr ^= fr << 5; fr >>>= 0;
        const a = sd / 2147483648 - 1, b = fr / 2147483648 - 1;
        // 衝撃(滑らかな山)と雑音を混ぜる。擦る ↔ 叩く
        x = env * amp * ((1 - nz) + nz * 1.7 * ((1 - vary) * a + vary * b));
      }
      // 2 段のローパス。木 ↔ 金属
      lp1 += lpc * (x - lp1);
      lp2 += lpc * (lp1 - lp2);
      // 櫛。叩く位置で、その位置に節がある共振器が鳴らなくなる
      // 端数は前後 2 つのあいだを直線で埋める
      const y = comb > 0
        ? lp2 - ((1 - cf) * ring[base + ((hp - ci + R) % R)] + cf * ring[base + ((hp - ci - 1 + R) % R)])
        : lp2;
      ring[base + hp] = lp2;
      hp = (hp + 1) % R;
      hb[i] += y;
      pos++;
    }
    vo[o + POS] = pos; vo[o + LP1] = lp1; vo[o + LP2] = lp2; vo[o + HPOS] = hp;
    this.seed[v] = sd; this.free = fr;
    return true;
  }

  /**
   * 1 声ぶんを 2 本の出口(a と b)へ足す。鳴り終わっていたら声を空ける。
   * a は左へ行く束、b は右へ行く束。どこに置くかはエンジンが決める(@p{…} の両側)。
   * 畳むときは足し算なので、a + b がいつも声そのものになるように分ける
   */
  render(v, a, b, t0) {
    const vo = this.voice, md = this.modes, hb = this.hb, vb = this.vb;
    const o = v * K;
    const live = this.head(v);
    const norm = vo[o + NORM];
    vb.fill(0);
    if (vo[o + BNS]) this.bend(v);
    if (vo[o + EBA]) this.followBend(v);
    if (vo[o + VBD]) this.vibrato(v);
    // 膨らむ高音へ移った力のぶん、低い揺れを減らす(bloomDrain)。膨らみと同じ形で効かせる
    let gd = 1;
    const cth = vo[o + BLK], dth = vo[o + BLDK];
    if (vo[o + BLD] > 0 && vo[o + BLA] > 0) {
      const t = vo[o + BLP];
      const env = (1 - Math.exp(-t / vo[o + BLR])) * Math.exp(-t / vo[o + BLF]);
      gd = Math.exp(-vo[o + BLD] * env * B);
    }
    // 膨らむ高音は、bloomFrom より高い共振器にだけ入れる。低い共振器は長く鳴るので、
    // 雑音の裾を受けて少しずつ積み上がり、低い帯域まで膨らんでしまった(2026-10-14)
    const bon = this.bloomOn, bb = this.bb;
    this.bloomOn = false;
    let n = vo[o + NM];
    for (let k = 0; k < n; k++) {
      const m = (v * M + k) * S;
      const a1 = md[m], a2 = md[m + 1], b = md[m + 2] * norm;
      let y1 = md[m + 3], y2 = md[m + 4];
      if (gd < 1 && md[m + 5] > dth) { y1 *= gd; y2 *= gd; }
      if (bon && md[m + 5] <= cth) {
        for (let i = 0; i < B; i++) {
          const y = a1 * y1 - a2 * y2 + b * (hb[i] + bb[i]);
          y2 = y1; y1 = y; vb[i] += y;
        }
      } else if (live) {
        for (let i = 0; i < B; i++) {
          const y = a1 * y1 - a2 * y2 + b * hb[i];
          y2 = y1; y1 = y; vb[i] += y;
        }
      } else {
        for (let i = 0; i < B; i++) {
          const y = a1 * y1 - a2 * y2;
          y2 = y1; y1 = y; vb[i] += y;
        }
        // 振幅の 2 乗 × sin^2 は y1^2 + y2^2 - 2cos y1 y2 で、位相によらない
        const s = md[m + 6];
        const e = y1 * y1 + y2 * y2 - 2 * md[m + 5] * y1 * y2;
        if (e < QUIET * QUIET * s * s) {
          // 外す。最後の共振器をここへ持ってきて、数を 1 つ減らす
          n--;
          const last = (v * M + n) * S;
          for (let j = 0; j < S; j++) md[m + j] = md[last + j];
          k--;
          continue;
        }
      }
      md[m + 3] = y1; md[m + 4] = y2;
    }
    vo[o + NM] = n;
    const wgAlive = vo[o + WG] ? this.strings(v, live) : 0;
    if (vo[o + SQ] > 0) this.squeakRender(v);
    // ピックアップ(エレピ)。磁石に近づくほど磁束が急に増える(1/距離²)ので、振れ幅が大きいほど
    // 歪み、偶数倍音が増える(バーク)。小さい振れでは素通りになるよう、傾きで割ってある。
    // 歪みの量は振れ幅だけで決まるので、強く弾けば歪み、減るにつれて丸くなる。
    // 出すのは磁束ではなく、その変化の速さ(コイルに起きる電圧)。磁束は片側へ大きく振れるので、
    // そのまま出すと直流が乗り、和音で同じ向きに積み上がっていた(ff の C4 で実効値の 0.38 倍)
    const pk = vo[o + PK], pd = vo[o + PD];
    if (pk > 0) {
      const off = vo[o + PO], g = PICKUP_SCALE * pk;
      const p0 = pickup(off), d0 = pickupSlope(off);
      for (let i = 0; i < B; i++) vb[i] = (pickup(off + g * vb[i]) - p0) / (d0 * g);
    }
    if (pd > 0) {
      let pv = vo[o + PV];
      for (let i = 0; i < B; i++) {
        const q = vb[i];
        vb[i] = (q - pv) * pd;
        pv = q;
      }
      vo[o + PV] = pv;
    }
    // 響き線(スネアの裏の線)。胴の揺れの大きさで雑音を開く。
    // びびり(失敗)も同じ包絡を使う。揺れが大きいうちだけ、弦が何かに当たって雑音が乗る。
    // 揺れの山の 35% を切ると止まり、揺れの山の向きに合わせて開くので、音程の周期で脈打つ
    const rt = vo[o + RATTLE], bzl = vo[o + BZ], bg = vo[o + BG] || 0.35, rasp = vo[o + BZR];
    const pullBz = vo[o + BZD] < 1;
    let renv = vo[o + RENV], sm = vo[o + BZS];
    if (rt || bzl) {
      let fr = this.free, hp = vo[o + RHP], bp = vo[o + BP];
      for (let i = 0; i < B; i++) {
        const a = vb[i] < 0 ? -vb[i] : vb[i];
        renv += (a > renv ? 0.2 : 0.0015) * (a - renv);
        if (renv > bp) bp = renv;
        fr ^= fr << 13; fr >>>= 0; fr ^= fr >>> 17; fr ^= fr << 5; fr >>>= 0;
        const z = fr / 2147483648 - 1;
        // 1 つ前との差で低いほうを抜く。線の音は高い
        let add = rt * renv;
        // 脈打たせる(rasp 1)ときは、揺れの山の向きのときだけ開く。0 では、揺れの大きさを
        // 20 ミリ秒ほどでならしたもので開く(音程の周期で揺れない、白い雑音に近いもの)
        sm += 0.001 * (renv - sm);
        if (bzl && !pullBz) {
          const pulse = renv > bg * bp && a > 0.5 * renv ? renv - bg * bp : 0;
          const smooth = sm > bg * bp ? 0.5 * (sm - bg * bp) : 0;
          add += bzl * 3 * (rasp * pulse + (1 - rasp) * smooth);
        }
        vb[i] += add * (z - hp);
        hp = z;
        if (bzl && pullBz) {
          // 引っぱる音のびびり(pullBuzz)は、雑音ではなく、弦そのものが片側でフレットに当たって形が欠ける音にする。
          // 雑音にすると 16kHz あたりの「ざざー」になり、暗い低い音でだけ目立った(2026-10-20)。
          // 振れの片側を、振れの大きさの 6 割のところで押さえる。欠けた形が、音の高さに付いた金属の「ビリッ」になる
          const th = 0.6 * renv;
          if (vb[i] > th) vb[i] -= Math.min(1, bzl * 2) * (vb[i] - th);
        }
      }
      this.free = fr; vo[o + RHP] = hp; vo[o + BP] = bp; vo[o + BZS] = sm;
      if (bzl && vo[o + BZD] < 1) { vo[o + BZ] = bzl * vo[o + BZD]; if (vo[o + BZ] < 1e-4) vo[o + BZ] = 0; }
      if (renv < 1e-6) renv = 0;
      vo[o + RENV] = renv;
    }
    // 頭をそのまま聞かせるぶん。響き線より後に足すので、線はこれに反応しない
    if (live) {
      const dr = vo[o + DIRECT];
      if (dr) for (let i = 0; i < B; i++) vb[i] += dr * hb[i];
    }
    const lv = vo[o + LEVEL];
    // 2 本へ分ける。揺れが無ければ半分ずつ。
    // トレモロは、スーツケースのアンプが同じ音を 2 チャンネルへ配って、片方を大きく、もう片方を
    // 小さくする形。位相は逆にしないので、足せば揺れは消えて元の音に戻る。
    // 揺れの位相は文脈の時計(currentTime)から出す。ノードを作った時刻を起点にすると、
    // 同じ曲でも鳴らし方で揺れ方が変わる。時計から出せば、同じノードの声は 1 台のアンプのように揃う
    // ビブラフォンのモーター。共鳴管の口で羽根が回り、開くと響き、閉じると響かない。
    // 音量だけが揺れるので、左右へは振らない。位相はトレモロと同じく文脈の時計から出す
    const mo = vo[o + MO], mr = vo[o + MR];
    if (mo > 0 && mr > 0) {
      const ph = TAU * ((mr * t0) % 1), step = TAU * mr / sampleRate;
      for (let i = 0; i < B; i++) vb[i] *= 1 - mo * (0.5 - 0.5 * Math.cos(ph + step * i));
    }
    const sw = vo[o + WD] * vo[o + TD], rate = vo[o + TR];
    if (sw > 0 && rate > 0) {
      const ph = TAU * ((rate * t0) % 1), step = TAU * rate / sampleRate;
      for (let i = 0; i < B; i++) {
        const y = vb[i] * lv * 0.5, m = sw * Math.sin(ph + step * i);
        a[i] += y * (1 + m);
        b[i] += y * (1 - m);
      }
    } else {
      for (let i = 0; i < B; i++) {
        const y = vb[i] * lv * 0.5;
        a[i] += y;
        b[i] += y;
      }
    }
    // 共鳴弦へ流す(左右を足した声そのもの)
    const pn = this.vpat[v];
    if (pn) { const sb = this.sym[pn].buf; for (let i = 0; i < B; i++) sb[i] += vb[i] * lv; }
    if (!live && n === 0 && renv === 0 && wgAlive === 0 && !(vo[o + SQ] > 0)) vo[o + ON] = 0;
  }

  /**
   * 共鳴弦。弾いていない弦が、高さの合う音につられて鳴る(3 弦 2 フレットの A で、5 弦の開放 A が鳴る)。
   * 弦を倍音ずつの共振器にして、そのパッチの声を足したものを流し込む。高さの合う倍音だけが、
   * ゆっくり大きくなって長く残る。パッチごとに 1 組なので、声が増えても重くならない。
   * sympathetic が 0 なら作らない(2026-10-14。重くなってよいので、オフにできること、と言われた)。
   *
   * 弦の並び(symTuning):
   * - guitar: 開放弦 6 本 × 倍音 10 本。ダンパーは無い。調弦は標準(E A D G B E)だけ
   * - bass: 4 弦ベースの開放弦 4 本(E A D G)× 倍音 10 本。左手で止めたあとに残る小さな響き(2026-10-20)
   * - piano: 88 鍵 × 倍音 3 本。ダンパーのある弦(F6 より下)は、右ペダルを踏んでいるあいだだけ鳴る。
   *   放すとダンパーが 0.12 秒で止める。いちばん上の 20 本ほどはダンパーが無いので、いつも鳴る
   *   (調律師の解説。2026-10-14)。踏んでいないあいだ、止まった弦は回さない
   * 弾いている弦がそのまま共鳴弦としても鳴るのは、まだ止めていない
   */
  symBank(p) {
    const def = this.patch[p];
    if (!def || !(def.sympathetic > 0) || !def.pitched) return null;
    let s = this.sym[p];
    if (s && s.def === def) return s;
    const sr = sampleRate;
    const strings = def.symTuning === 'piano'
      ? Array.from({ length: 88 }, (_, i) => [21 + i, 3, 21 + i < 89])
      : def.symTuning === 'bass'
        ? [28, 33, 38, 43].map((m) => [m, 10, false])
        : [40, 45, 50, 55, 59, 64].map((m) => [m, 10, false]);
    const list = [];
    for (const [m, hs, damper] of strings) {
      const f0 = 440 * Math.pow(2, (m - 69) / 12), kr = f0 / 261.63;
      const t60 = (def.t60 || 2) * Math.pow(kr, -(def.decayKey || 0));
      const bb = (def.stretch || 0) * Math.pow(kr, def.stretchKey || 0);
      for (let h = 1; h <= hs; h++) {
        const f = h * f0 * Math.sqrt(1 + bb * h * h);
        if (f >= sr * 0.45) break;
        const tt = t60 / (1 + (def.damp || 0) * (f / 1000) * (f / 1000));
        const w = TAU * f / sr;
        const r = Math.exp(-LN1000 / (Math.max(0.005, tt) * sr)), rd = Math.exp(-LN1000 / (0.12 * sr));
        // 山の高さが 1 になるように入口を絞る。倍音が上ほど弱いのは、弦の振れ方(1/h)で
        list.push(2 * r * Math.cos(w), r * r, 2 * rd * Math.cos(w), rd * rd, 2 * (1 - r) * Math.sin(w) / h, damper ? 1 : 0);
      }
    }
    const n = list.length / 6;
    if (!s || s.n !== n) s = this.sym[p] = { def: null, n, c: null, y: new Float64Array(n * 2), buf: new Float64Array(B), quiet: 0, since: 1e9 };
    s.c = Float64Array.from(list);
    s.def = def;
    return s;
  }

  /** 右ペダル。踏んでいるあいだは、離した音を止めず、ダンパーのある共鳴弦も鳴らす。踏む・放すでシュッと鳴る */
  pedalTo(p, down, off) {
    const was = !!this.ped[p];
    this.ped[p] = down ? 1 : 0;
    const s = this.sym[p];
    if (s) s.since = 0;
    const def = this.patch[p];
    // ダンパーのフェルトが弦と擦れるシュッ。グランドで分かりやすい(調律師の解説)。大きさは keyNoise に揃える。
    // 値は見当で、録音には合わせていない
    if (def && was !== !!down && def.keyNoise > 0) {
      this.start({ p, sq: 1, nf: 1, sqLen: down ? 0.09 : 0.07, sqF: 0, sqB: 3200, sqN: 0.95, sqHp: 700,
        sqSeed: (this.born | 0) + 11, v: def.keyNoise * (down ? 0.12 : 0.09) }, off);
    }
  }

  /** 共鳴弦を回して出口へ足す。入ってくる音が無く、鳴りも消えていれば回さない */
  symRender(a, b) {
    for (const p in this.sym) {
      const s = this.symBank(p);
      if (!s) continue;
      // ピアノは 88 本ぶんつられるので、ギター(6 本)と同じ係数では響きが音より大きくなった(2026-10-14)。
      // 4 分の 1 にして、踏んで 1 秒後に鳴っている音より 10dB ほど下に置く
      const buf = s.buf, c = s.c, y = s.y, g = s.def.sympathetic * (s.def.symTuning === 'piano' ? 0.25 : 1);
      const pedal = !!this.ped[p];
      // ペダルを放して 0.4 秒たてば、ダンパーのある弦は止まりきっている。回さない
      const skipDamped = !pedal && s.since > 0.4 * sampleRate;
      s.since += B;
      let inE = 0;
      for (let i = 0; i < B; i++) inE += buf[i] * buf[i];
      if (inE === 0 && s.quiet) { buf.fill(0); continue; }
      let e = 0;
      for (let k = 0; k < s.n; k++) {
        const j = 6 * k, damped = c[j + 5] && !pedal;
        if (damped && skipDamped) { y[2 * k] = 0; y[2 * k + 1] = 0; continue; }
        const a1 = damped ? c[j + 2] : c[j], a2 = damped ? c[j + 3] : c[j + 1], bk = c[j + 4];
        let y1 = y[2 * k], y2 = y[2 * k + 1];
        for (let i = 0; i < B; i++) {
          const v = a1 * y1 - a2 * y2 + bk * buf[i];
          y2 = y1; y1 = v;
          const o = g * v;
          a[i] += o; b[i] += o;
        }
        y[2 * k] = y1; y[2 * k + 1] = y2;
        e += y1 * y1 + y2 * y2;
      }
      s.quiet = e < 1e-14 ? 1 : 0;
      if (s.quiet) y.fill(0);
      buf.fill(0);
    }
  }

  process(inputs, outputs) {
    const chs = outputs[0];
    // 出口は 2 本(左へ行く束と右へ行く束)。1 本しか無ければ、右の束は脇へ置いて最後に足す
    const out = chs[0], rb = chs.length > 1 ? chs[1] : this.ob;
    out.fill(0);
    rb.fill(0);
    const sr = sampleRate;
    const t0 = currentTime;
    const tEnd = t0 + B / sr;
    const vo = this.voice;
    // 右ペダルの区間を見て、踏む・放す。ずれは塊の長さ(2.7 ミリ秒)まで
    for (const p in this.pedIv) {
      const iv = this.pedIv[p];
      let down = false;
      for (const [k, [a, b]] of iv) {
        if (b < t0 - 1) { iv.delete(k); continue; }
        if (a <= t0 && t0 < b) down = true;
      }
      if (down !== !!this.ped[p]) this.pedalTo(p, down, 0);
    }
    // 離すのは塊の境目で。ずれは 2.9 ミリ秒まで
    for (let v = 0; v < V; v++) {
      const o = v * K;
      // 右ペダルを踏んでいるあいだは止めない。放したら、離す時刻の過ぎた音をここで止める
      if (vo[o + ON] && vo[o + REL] >= 0 && vo[o + REL] < tEnd && !this.ped[this.vname[v]]) this.release(v);
    }
    while (this.at < this.events.length && this.events[this.at].s0 < tEnd) {
      const ev = this.events[this.at++];
      if (ev.ped != null) { this.pedalTo(ev.p, ev.ped, Math.max(0, Math.min(B - 1, Math.round((ev.s0 - t0) * sr)))); continue; }
      this.start(ev, Math.max(0, Math.min(B - 1, Math.round((ev.s0 - t0) * sr))));
      // どの声で鳴ったか。あとで押さえたまま滑らせるときに、その声を探す
      if (ev.vx != null) ev.vb = this.voice[ev.vx * K + BORN];
    }
    for (let v = 0; v < V; v++) if (vo[v * K + ON]) this.render(v, out, rb, t0);
    this.symRender(out, rb);
    // 止めている最中なら、ぷつっと鳴らないよう 10 ミリ秒で落とす
    if (this.cutAt >= 0) {
      const len = Math.max(1, Math.round(sr * 0.01));
      for (let i = 0; i < out.length; i++) {
        const k = Math.max(0, 1 - this.cutAt / len);
        out[i] *= k;
        rb[i] *= k;
        this.cutAt++;
      }
      if (this.cutAt >= len) { vo.fill(0); this.cutAt = -1; this.ped = {}; this.pedIv = {}; for (const p in this.sym) this.sym[p].y.fill(0); }
    }
    if (chs.length === 1) for (let i = 0; i < out.length; i++) out[i] += rb[i];
    // 3 本目から先は使わない
    for (let c = 2; c < chs.length; c++) chs[c].fill(0);
    return true;
  }
}
registerProcessor('${MODAL_NODE}', ModalBank);
`;

// ---- 表を作る(表の側) ----

/** 種から決まる乱数。同じ種なら毎回同じ表になる */
function rng(seed) {
  let a = (seed | 0) || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 丸い膜の共振の比(ベッセル関数の零点を、いちばん低いもので割ったもの) */
/**
 * ティンパニ(釜の上に張った膜)の共振器。[倍率, 大きさ, 減り方の倍率]。基音(1,1)を 1 とする。
 * 膜だけなら倍音はばらばらだが、釜の空気が押さえて (1,1) (2,1) (3,1) (4,1) (5,1) が 1 : 1.5 : 2 : 2.4 : 2.9 に
 * 寄る。だから高さが聞こえる。VCSL のティンパニ 2(太鼓 8 台、34 通りの高さ)を測って決めた(2026-10-14):
 * 1.0 1.45〜1.55 1.9〜2.05 2.35〜2.45 2.85 3.2〜3.3 3.7 あたりに山が集まる。
 * 大きさは叩いて 0.1〜0.35 秒の山で、基音に対して 1.5 が −10dB、1.98 が −19dB、2.42 が −25dB、2.86 が −21dB、
 * 3.25 が −18dB。基音のすぐ上(1.005〜1.05 倍)にもう 1 つ山があることが多い。張りが揃っていないので
 * 1 つの動きが 2 つに割れる。うなりになる。
 * 基音より下(0.6〜0.9 倍)は (0,1)。膜全体が上下する動きで、空気をよく押すのですぐ消える(鈍いドン)。
 * 減り方は、録音では上の倍音ほど長く測れた(部屋の響きと、測り方のせい)。そのまま使わず、
 * 基音 3 秒を 1 として、上ほど短くした
 */
/**
 * ドラ(タムタム)の共振器。[倍率, 大きさ, 減り方の倍率]。いちばん低い山(144Hz)を 1 とする。
 * VCSL のドラ 1 の mf から、3kHz までの山を拾った(2026-10-14)。減り方は 2 秒後までの減りで、基音を 1 とし、
 * 1.5 倍で頭打ちにした。大きさは、鳴らして 1/4 オクターブごとに録音と比べ、少しずつ寄せた値。
 * 山だけでなく山のあいだの響きも含めて合わせているので、測った山の大きさとは一致しない。
 * 倍音は整数倍に並ばない。表より上は細かい倍音(cloud)で埋め、ほとんど膨らむ高音(bloom)だけで鳴らす
 */
const GONG = [
  [0.851, 0.0201, 0.93],[1.0, 1.0, 1.0],[1.19, 0.0101, 1.0],[1.429, 0.0505, 0.6],[1.775, 0.0192, 1.5],[1.842, 0.0149, 0.43],
  [1.994, 0.3314, 0.61],[2.137, 0.1304, 0.61],[2.23, 0.2121, 0.99],[2.444, 0.4484, 1.5],[2.625, 0.057, 1.5],[2.801, 0.1512, 1.5],
  [2.959, 0.4411, 1.35],[3.138, 0.1143, 0.63],[3.208, 0.1217, 0.47],[3.38, 0.4639, 0.4],[3.449, 0.1993, 1.5],[3.649, 0.0656, 1.5],
  [3.765, 0.0649, 1.5],[4.006, 0.259, 1.5],[4.082, 0.2687, 1.47],[4.247, 0.0642, 1.18],[4.371, 0.0257, 0.33],[4.516, 0.0238, 1.5],
  [4.605, 0.0428, 0.38],[4.769, 0.0426, 1.5],[4.852, 0.0623, 0.89],[4.913, 0.0517, 0.75],[5.075, 0.0893, 1.5],[5.172, 0.0394, 1.09],
  [5.331, 0.0404, 1.38],[5.732, 0.0521, 1.5],[5.843, 0.1274, 0.86],[5.925, 0.0619, 1.36],[6.046, 0.0449, 1.5],[6.195, 0.1026, 0.82],
  [6.415, 0.082, 0.82],[6.839, 0.1818, 0.46],[6.997, 0.1211, 1.5],[7.189, 0.035, 0.49],[7.926, 0.0535, 0.85],[8.017, 0.0455, 1.5],
  [8.13, 0.0936, 1.5],[8.254, 0.1245, 0.95],[8.437, 0.0634, 0.92],[9.282, 0.1088, 1.29],[9.355, 0.1144, 1.47],[9.476, 0.1355, 1.5],
  [10.878, 0.1461, 1.5],[10.956, 0.1024, 1.5],[11.074, 0.3567, 1.0],[12.462, 0.1162, 0.49],[13.336, 0.2774, 0.62],
];

const KETTLE = [
  [0.76, 0.3, 0.12],[1, 1, 1],[1.006, 0.35, 1],[1.5, 0.55, 1.15],[1.32, 0.05, 0.25],
  [1.985, 0.25, 1],[2.44, 0.11, 0.8],[2.86, 0.18, 0.65],[3.25, 0.32, 0.5],[3.7, 0.27, 0.45],
  [4.15, 0.33, 0.4],[4.6, 0.22, 0.35],[5.05, 0.16, 0.3],
];

const MEMBRANE = [
  1, 1.594, 2.136, 2.296, 2.653, 2.918, 3.156, 3.501, 3.600, 3.652,
  4.060, 4.154, 4.230, 4.601, 4.651, 4.832, 5.061, 5.131, 5.412, 5.473,
];

/**
 * 共振器の並べ方。どれも周波数を倍率で返す。高さは鳴らすときに掛ける。
 * `warp` と `spread` はどの並べ方にも効く(下の MODAL_PARAMS)。
 */
export const MODAL_SERIES = {
  string: {
    desc: 'A stiff string. Partials at n times the pitch, pushed sharp by stiffness.',
  },
  membrane: {
    desc: 'A round drum head. Modes at the zeros of the Bessel functions, not a harmonic series.',
  },
  cymbal: {
    desc: 'A dense, random cloud of modes spread over a band, thicker towards the top.',
  },
  tine: {
    desc: 'An electric piano tine: a thin metal rod clamped at one end, with modes at 1, 6.27, 17.5 and 34.4 times the pitch. A tone bar tuned to the pitch rings beside it, longer.',
  },
  bar: {
    desc: 'A tuned bar, as on a marimba or vibraphone. The underside is cut away so the first three modes sit at 1, 4 and 10 times the pitch; a fourth, left untuned, sits near 15.5.',
  },
  freebar: {
    desc: 'A plain metal bar left uncut, as on a glockenspiel. Its modes fall at 1, 3.05, 5.9, 9.26 and 14.1 times the pitch, so the ring is bright and slightly clangy.',
  },
};

/**
 * パッチのパラメータ。`group` は どこに効くか。
 * `when` は効く条件。ほかのパラメータがこの値のときは、書いてあっても何も変えない
 * (`strings` が 1 なら `detune` は効かない、など)。`key` はパッチの中の場所で、
 * 頭のものは `head.` を付ける。条件は gt(より大きい)lt(より小さい)ne(等しくない)。
 * 頭(head)は「何か」を決め、共振器(modes)と減衰(decay)は「どう減るか」を決める。
 * `live` は、鳴っている音の途中で動かして効くか。いまはどれも効かない。係数は
 * 鳴りはじめに作り、パッチを差し替えても次の音から効く(2026-10-05。音を作りながら
 * 持たせておくと、あとで動かせるようにしたときに、どれが効いていなかったかが分かる)。
 * 既定の値はここには持たない。楽器ごとに違うので、パッチ(MODAL_PATCHES)が持つ。
 * ここに写すと 2 か所になって、そのうちずれる
 */
export const MODAL_PARAMS = {
  // 頭
  sharp:  { live: false, group: 'head', min: 0.2, max: 300, unit: 'ms',
    desc: 'Length of the strike. Short is a click, long is a thud or a sweep.' },
  bright: { live: false, group: 'head', min: 0, max: 1,
    desc: 'Low-pass on the strike, 100 Hz to 25 kHz. Wood at the bottom, metal at the top.' },
  comb:   { live: false, group: 'head', min: 0, max: 0.5,
    desc: 'Where it is struck, as a fraction of one period. Hollows out the modes that have a node there.' },
  noise:  { live: false, group: 'head', min: 0, max: 1,
    desc: 'Noise against a smooth bump. 0 knocks, 1 scrapes.' },
  vary:   { live: false, group: 'head', min: 0, max: 1, when: [{ key: 'head.noise', gt: 0 }],
    desc: 'How much the noise changes from note to note. 0 repeats the same strike every time.' },
  seed:   { live: false, group: 'head', min: 1, max: 9999, step: 1,
    when: [{ key: 'head.noise', gt: 0 }, { key: 'head.vary', lt: 1 }],
    desc: 'Seed for the repeatable part of the noise.' },
  felt:   { live: false, group: 'head', min: 0, max: 8,
    desc: 'How much the felt hardens on hard strikes. The strike gets peaked and sharp, so the upper partials come in. 0 keeps a smooth bump at every velocity.' },
  grains: { live: false, group: 'head', min: 0, max: 32, step: 1,
    desc: 'Splits the strike into this many small hits, each as long as sharp, scattered in time. 0 keeps one smooth bump. Many wires of a brush landing slightly apart.' },
  scatter: { live: false, group: 'head', min: 0, max: 40, unit: 'ms', when: [{ key: 'head.grains', gt: 0 }],
    desc: 'How widely the small hits are spread in time.' },
  align:  { live: false, group: 'head', min: 0, max: 1,
    desc: 'Starts a slow strike early so its loudest point lands on the beat. 0 starts on the beat; 1 puts the peak there. For soft swells such as a brush sweep.' },
  velo:   { live: false, group: 'head', min: 0, max: 6, unit: 'oct',
    desc: 'How far the brightness moves between the softest and the hardest note, in octaves.' },
  hardKey: { live: false, group: 'head', min: 0, max: 2,
    desc: 'How much harder and shorter the strike gets per doubling of pitch, as a power. Pitched patches only.' },
  bloom:  { live: false, group: 'head', min: 0, max: 400,
    desc: 'High sound that swells up a moment after a hard strike, as on a big gong or tam-tam. The strike slowly moves into the high modes. 0 has none.' },
  bloomVelo: { live: false, group: 'head', min: 1, max: 12, when: [{ key: 'head.bloom', gt: 0 }],
    desc: 'How much harder you must strike for the swell to come, as a power of the velocity. Higher keeps soft strikes clean.' },
  bloomRise: { live: false, group: 'head', min: 0.02, max: 2, unit: 's', when: [{ key: 'head.bloom', gt: 0 }],
    desc: 'How long the swell takes to grow.' },
  bloomFall: { live: false, group: 'head', min: 0.1, max: 6, unit: 's', when: [{ key: 'head.bloom', gt: 0 }],
    desc: 'How long the swell keeps feeding the high modes before it dies away.' },
  bloomFrom: { live: false, group: 'head', min: 200, max: 8000, unit: 'Hz', when: [{ key: 'head.bloom', gt: 0 }],
    desc: 'Lowest pitch the swell reaches. Below it the swell hardly adds anything.' },
  bloomDrain: { live: false, group: 'head', min: 0, max: 60, unit: 'dB/s', when: [{ key: 'head.bloom', gt: 0 }],
    desc: 'How fast the low modes give up their sound to the swell, at its peak on the hardest strike. The low hum fades as the high sound grows. 0 leaves the low modes alone.' },
  bloomDrainBelow: { live: false, group: 'head', min: 50, max: 2000, unit: 'Hz', when: [{ key: 'head.bloomDrain', gt: 0 }],
    desc: 'Modes below this pitch are the ones that give up their sound to the swell.' },
  hardFrom: { live: false, group: 'head', min: 20, max: 2000, unit: 'Hz', when: [{ key: 'head.hardKey', gt: 0 }],
    desc: 'The pitch where hardKey starts to act. Below it the strike is the same at every key. Middle C by default; lower for low instruments.' },
  // 共振器
  count:  { live: false, group: 'modes', min: 1, max: 1024, step: 1,
    desc: 'How many resonators per string or per drum.' },
  stretch: { live: false, group: 'modes', min: 0, max: 0.01,
    desc: 'Stiffness of a string at middle C. Pushes the upper partials sharp, as on a piano.' },
  pickupAt: { live: false, group: 'modes', min: 0, max: 0.5,
    desc: 'Electric bass and guitar: where the magnetic pickup sits, as a share of the string length from the bridge. A pickup hears each harmonic as strongly as the string swings right above it, so harmonics with a node near the pickup go quiet. Near the bridge (0.05, the bridge pickup of a jazz bass) the tone is thin, tight and nasal; further up (0.17, a precision bass) it is fat and round; at 0.25 and beyond, towards the neck, it gets hollow and soft. 0 leaves the tone as fitted to recordings.' },
  pickupDepth: { live: false, group: 'modes', min: 0, max: 3, when: [{ key: 'pickupAt', gt: 0 }],
    desc: 'How strongly the pickup position colours the tone. 1 is what the physics gives, a fairly subtle change on a bass played alone; above 1 the difference is exaggerated so it reads clearly; 0 removes it.' },
  pickupPeak: { live: false, group: 'modes', min: 500, max: 8000, unit: 'Hz', when: [{ key: 'pickupAt', gt: 0 }],
    desc: 'The resonant peak of a passive magnetic pickup and its cable, a bump in the upper mids that gives the tone its edge. Lower sounds warmer and more vintage, higher sounds brighter and more modern.' },
  pickupPeakGain: { live: false, group: 'modes', min: 0, max: 18, unit: 'dB', when: [{ key: 'pickupAt', gt: 0 }],
    desc: 'How tall the pickup resonance is. 0 removes it.' },
  attackBend: { live: false, group: 'modes', min: 0, max: 100, unit: 'cents',
    desc: 'How sharp a hard-struck string starts, in cents at full velocity. A string hit hard swings wide, which stretches it and raises its pitch for a moment; the pitch falls back as the swing dies. It is what makes a slap sound like a real string hit hard rather than a synth. Scales with the square of velocity. 0 keeps the pitch steady.' },
  attackBendTime: { live: false, group: 'modes', min: 0.005, max: 0.3, unit: 's', when: [{ key: 'attackBend', gt: 0 }],
    desc: 'How long the pitch takes to fall back after the strike.' },
  bendFollow: { live: false, group: 'modes', min: 0, max: 1, step: 1, when: [{ key: 'attackBend', gt: 0 }],
    desc: 'Slap bass: how the sharp start of a pulled note settles. 1 follows the string itself: the pitch comes down as the swing, above all of the upper harmonics, dies away, so it settles fast after a bright attack and at once when the note is stopped. 0 eases it down over attackBendTime. Thumbed notes always ease down over attackBendTime.' },
  bStretch: { live: false, group: 'modes', min: 0, max: 0.01,
    desc: 'Five-string bass: the stiffness of the low B string, used for every note below E1. The B string is thick but slack, so its upper partials run sharp, a little like the low strings of a piano. 0 plays those notes on the E string tuned down. Not fitted to recordings.' },
  stretchKey: { live: false, group: 'modes', min: 0, max: 3,
    desc: 'How much stiffer the strings get per doubling of pitch, as a power. 0 keeps it the same everywhere.' },
  strings: { live: false, group: 'modes', min: 1, max: 3, step: 1,
    desc: 'Strings per note. More than one beats against itself.' },
  detune: { live: false, group: 'modes', min: 0, max: 50, unit: 'cent', when: [{ key: 'strings', gt: 1 }],
    desc: 'Spread between the strings of one note.' },
  tilt:   { live: false, group: 'modes', min: 0, max: 3,
    desc: 'How fast the upper modes get quieter. Applied to the table, before the strike.' },
  warp:   { live: false, group: 'modes', min: 0.5, max: 1.5,
    desc: 'Raises every ratio to this power. 1 keeps the series; anything else bends it.' },
  spread: { live: false, group: 'modes', min: 0, max: 0.2,
    desc: 'Random offset of each ratio. Breaks a series into something that never existed.' },
  guide:  { live: false, group: 'modes', min: 0, max: 2000, unit: 'Hz',
    desc: 'Strings below this pitch are played as a waveguide, which has every partial up to the top. 0 never uses it.' },
  trebleGain: { live: false, group: 'out', min: 0, max: 12, unit: 'dB',
    desc: 'Lift for notes above middle C, in dB per octave. Pitched patches only.' },
  sour:   { live: false, group: 'modes', min: 0, max: 100, unit: 'cent',
    desc: 'How far each key is out of tune, at most. Every key gets its own offset, the same every time it is played.' },
  sourSeed: { live: false, group: 'modes', min: 1, max: 9999, step: 1, when: [{ key: 'sour', gt: 0 }],
    desc: 'Seed that decides which keys go out of tune and by how much.' },
  bodyLow: { live: false, group: 'modes', min: 0, max: 400, unit: 'Hz',
    desc: 'Below this pitch the body stops sounding the string, falling 24 dB per octave. A guitar body hardly radiates below its air resonance. 0 lets every partial through. Only on strings played as resonators, not on the waveguide.' },
  knock:  { live: false, group: 'modes', min: 0, max: 2,
    desc: 'Wooden knock of the key and hammer. A few short resonators that stay put whatever the pitch.' },
  lo:     { live: false, group: 'modes', min: 1, max: 40,
    desc: 'Lowest ratio of a cymbal cloud, or of the dense upper modes of a timpani.' },
  hi:     { live: false, group: 'modes', min: 2, max: 80,
    desc: 'Highest ratio of a cymbal cloud, or of the dense upper modes of a timpani.' },
  light:  { live: false, group: 'modes', min: 0, max: 1,
    desc: 'Makes a timpani or gong lighter to compute. Leaves out the weakest measured modes and thins the dense upper modes. 0 is the full sound; 1 keeps about a third of the resonators.' },
  cloud:  { live: false, group: 'modes', min: 0, max: 6,
    desc: 'Level of the dense upper modes of a timpani, above the measured table. They fill in the sound above about five times the pitch. How many there are is count minus the table. 0 leaves only the table.' },
  // 減衰
  t60:    { live: false, group: 'decay', min: 0.02, max: 60, unit: 's',
    desc: 'Time for the lowest mode to fall by 60 dB. For pitched patches this is at middle C.' },
  decayKey: { live: false, group: 'decay', min: 0, max: 2,
    desc: 'How much shorter notes ring per doubling of pitch, as a power. 0 rings the same in every register.' },
  afterLevel: { live: false, group: 'decay', min: 0, max: 1, when: [{ key: 'strings', gt: 1 }],
    desc: 'Level of every string after the first. Low values make the first, fast-falling string dominate, so the note drops quickly and leaves a quiet tail.' },
  after:  { live: false, group: 'decay', min: 1, max: 10, when: [{ key: 'strings', gt: 1 }],
    desc: 'Decay of every string after the first, as a multiple of t60. Above 1 the note falls fast, then lingers.' },
  sympathetic: { live: false, group: 'decay', min: 0, max: 1,
    desc: 'How much the strings that are not played ring along with notes that match them, like the open A of a guitar sounding under an A fretted on another string. A natural halo after each note. On a guitar the six open strings in standard tuning ring, on a bass the four. On a piano only the top strings, which have no dampers, ring, until the sustain pedal lifts all the dampers. 0 turns it off and saves the work.' },
  damp:   { live: false, group: 'decay', min: 0, max: 20,
    desc: 'Extra loss that grows with frequency squared. High modes die first.' },
  harmonic: { live: false, group: 'modes', min: 0, max: 6, step: 1,
    desc: 'Natural harmonic: a finger lightly touches the string at 1/n of its length and lets go as the string is plucked, so only every n-th harmonic rings, a pure, glassy tone. The written pitch is the pitch you hear; the string itself is tuned n times lower. 2 is the 12th fret (an octave above the open string), 3 the 7th fret, 4 the 5th fret, 5 near the 4th fret. 0 and 1 play normally. Not fitted to recordings.' },
  mute:   { live: false, group: 'decay', min: 0, max: 1,
    desc: 'Palm mute: the side of the hand rests on the strings by the bridge. The note starts as usual, but the upper harmonics die within a moment and the low ones soon after, leaving a short, round thump. 1 is a firm mute, fitted to recordings of a muted electric bass. 0 rings freely.' },
  release: { live: false, group: 'decay', min: 0.01, max: 8, unit: 's',
    desc: 'Decay after the note is let go. Only notes given a length are let go.' },
  // 声の外へ出さないもの
  direct: { live: false, group: 'out', min: 0, max: 1,
    desc: 'The strike itself, heard straight through. The sweep of a brush lives here.' },
  rattle: { live: false, group: 'out', min: 0, max: 4,
    desc: 'Snare wires. Noise opened by how hard the body is ringing.' },
  pickup: { live: false, group: 'out', min: 0, max: 2,
    desc: 'Electric piano pickup. How close the tine swings to the magnet. 0 is clean; higher values bark on loud notes and stay round on soft ones, since the distortion follows how wide the tine swings.' },
  pickupOffset: { live: false, group: 'out', min: -0.5, max: 0.5, when: [{ key: 'pickup', gt: 0 }],
    desc: 'Where the tine rests against the magnet. Towards the magnet the bark grows and gets more even harmonics; away from it the tone is rounder.' },
  // 棒の楽器
  strike: { live: false, group: 'modes', min: 0, max: 0.5,
    desc: 'Where the mallet lands on a bar, from the end (0) to the middle (0.5). The middle is a still point of the second and fourth modes, so the overtone at 4 times the pitch drops out there; towards the end every mode sounds. Only on bars.' },
  modeDecay: { live: false, group: 'decay', min: 0, max: 4,
    desc: 'How much faster the higher modes of a bar die. A mode at r times the pitch lasts 1 / r to this power as long as the fundamental. 0 keeps them all as long. Only on bars.' },
  tube: { live: false, group: 'modes', min: 0, max: 8,
    desc: 'The resonator tube under the bar, tuned to its pitch. It lifts the fundamental only, by 1 + this many times; the higher modes pass it by. 0 is a bare bar. Only on bars.' },
  motor: { live: false, group: 'out', min: 0, max: 1,
    desc: 'Vibraphone motor. Fans in the tubes open and close, so the level swells and dips. Depth of the dip: 0 is off, 1 closes the sound completely each turn. The level only, not left and right.' },
  motorRate: { live: false, group: 'out', min: 0.5, max: 12, unit: 'Hz', when: [{ key: 'motor', gt: 0 }],
    desc: 'Speed of the vibraphone motor. Every note on the same output swings together and follows the song clock.' },
  // 2 本の出口。左へ行く束と右へ行く束で、どこに置くかはエンジンが決める(@p{…} の両側)
  width: { live: false, group: 'out', min: 0, max: 1,
    desc: 'How far apart the two outputs may lean. 0 keeps every note centred; 1 lets a note move all the way into one output. Nothing moves unless something swings it, such as the tremolo. The two outputs always add back up to the plain note, so a mono mix loses the movement but keeps the sound.' },
  tremolo: { live: false, group: 'out', min: 0, max: 1, when: [{ key: 'width', gt: 0 }],
    desc: 'Suitcase amp tremolo. The amp feeds the same sound to two channels and swings it from one to the other, never flipping the phase. Depth of the swing; how far it can travel is width times this.' },
  tremoloRate: { live: false, group: 'out', min: 0.5, max: 12, unit: 'Hz', when: [{ key: 'tremolo', gt: 0 }],
    desc: 'Speed of the tremolo swing. Every note on the same output swings together, like one amp, and the swing follows the song clock, so a render is the same every time.' },
  // 失敗・崩れ。どれも 1 音ごとの起きやすさ(0〜1)。起きる場所は flawSeed と音の並びで決まる
  neighbor: { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'How often the next key is caught as well, softer and a little late. Above or below is up to the seed.' },
  double: { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'Share of keys whose action is out of regulation, so the hammer bounces and strikes the same note again at once, softly. Not random note by note: a bad key does it every time it is played hard (velocity 0.75 or more). Which keys are bad is up to doubleSeed.' },
  doubleSeed: { live: false, group: 'flaw', min: 1, max: 9999, step: 1, when: [{ key: 'double', gt: 0 }],
    desc: 'Seed that decides which keys are out of regulation. The same instrument always has the same bad keys.' },
  buzz:   { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'Share of notes where the string touches something and buzzes while it swings wide, like a string hitting a fret: low action or an uneven fret. Not random note by note: a buzzing note buzzes every time it is played hard (velocity 0.6 or more), louder the harder it is played, and stops as the note dies away. Which notes buzz is up to buzzSeed.' },
  buzzSeed: { live: false, group: 'flaw', min: 1, max: 9999, step: 1, when: [{ key: 'buzz', gt: 0 }],
    desc: 'Seed that decides which notes buzz. The same instrument always buzzes on the same notes.' },
  buzzLevel: { live: false, group: 'flaw', min: 0, max: 2, when: [{ key: 'buzz', gt: 0 }],
    desc: 'How loud the buzz is.' },
  buzzRasp: { live: false, group: 'flaw', min: 0, max: 1, when: [{ key: 'buzz', gt: 0 }],
    desc: 'How much the buzz pulses with the pitch. 1 opens the noise only as the string swings out, a rasp like a string slapping a fret. 0 is a smooth hiss that follows how wide the string swings.' },
  slip:   { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'How often the finger slips off the string: a weak, scratchy start.' },
  ghost:  { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'How often a note is muted by mistake and comes out as a dead thump with hardly any pitch. More likely on soft notes.' },
  splay:  { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'How often the wires splay and land spread out instead of together. Only for strikes made of grains.' },
  spot:   { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'How often the stick lands off the spot: towards the edge (louder, darker, longer) or on the bell (a few modes ring out like a bell). More likely on loud hits.' },
  loose:  { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'Something loose on the instrument, or resting on it, that rattles along: a loose screw, a pencil on the lid. Not a mistake of the player, so it is the same every time: the same note at the same velocity always rattles, or never does. How loud the rattle is. 0 is a sound instrument.' },
  looseFreq: { live: false, group: 'flaw', min: 40, max: 4000, unit: 'Hz', when: [{ key: 'loose', gt: 0 }],
    desc: 'The pitch the loose part shakes at most easily. Notes with a partial near it shake it hardest.' },
  looseFrom: { live: false, group: 'flaw', min: 0.02, max: 2, when: [{ key: 'loose', gt: 0 }],
    desc: 'How hard the part must be shaken before it rattles. Low values rattle on more notes and softer playing; the rattle stops once the note dies below it.' },
  stringNoise: { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'How easily the wound strings make noise under a moving finger: new or rough strings are high, worn, coated or flatwound strings are low. The noise comes when the finger leaves a note to move to the next one, on low notes only, and grows with how far it moves. Never random: the same part makes the same noise every time. 0 is silent.' },
  openRing: { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'How much the open string rings when a finger is lifted off it. Lifting the finger flicks the string, like a soft pull-off, and the open string sounds until the next note. Grows with lift; careful players make it quieter. Never random. 0 is silent, and only 0 is.' },
  click: { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'How loud the click is when a finger lets go of a wound string, on top of stringNoise and lift. 0 removes it; 1 is full. Not compared with a real guitar yet.' },
  rush: { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'How early the hand starts to move when the gap before the next note is too short for the slide. 0 waits until the note has stopped and squeezes the squeak into the gap. 1 starts sliding while the note still rings, so the squeak keeps its full length. A habit of the player, never random.' },
  lift: { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'How the player moves between notes. 0 keeps the finger on the string and slides, so the squeak is loud and the click and the open string are quiet. 1 lifts the finger off, so the click and the open string are loud and the squeak is quiet. Neither ever goes silent here; at the far end it is 20 dB down.' },
  care: { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'How carefully the player moves. 1 hovers just off the strings and mutes them, which makes every handling noise 20 dB quieter but never silent. Set stringNoise or openRing to 0 to remove them.' },
  flawSeed: { live: false, group: 'flaw', min: 1, max: 9999, step: 1,
    desc: 'Seed for where the flaws happen, and for how each squeak of a moving hand differs a little in timing, length, pitch and loudness. Played from the start, the same part always slips and squeaks the same way.' },
  silent: { live: false, group: 'out', min: 0, max: 1, step: 1,
    desc: 'Silences the strings, like the mute rail of a silent piano. 1 leaves only the sounds around them: the keys, and the handling noises of a guitar. 0 plays normally.' },
  snap:   { live: false, group: 'out', min: 0, max: 1,
    desc: 'How loud the click is when a string pulled away from the neck snaps back against the fingerboard, as in a slapped upright bass. A short burst of noise at the start of every note, the same at every pitch. Not fitted to recordings. 0 is silent.' },
  palm:   { live: false, group: 'out', min: 0, max: 1, step: 1, when: [{ key: 'snap', gt: 0 }],
    desc: 'Slap bass: 1 makes every note the palm hit, the hand smacking all four strings flat against the fingerboard. The open strings sound for a moment and stop at once, with only a tiny click of wood, so it does not turn into a snare drum. The written pitch is not used. 0 plucks.' },
  thumbBelow: { live: false, group: 'out', min: 0, max: 400, unit: 'Hz', when: [{ key: 'snap', gt: 0 }],
    desc: 'Slap bass: notes below this pitch are struck with the thumb, a duller, rounder thump; notes above are pulled and let go, the sharper click. The usual pattern of a low thumb and a pulled octave above plays without marking either. 0 pulls every note.' },
  thumbDull: { live: false, group: 'out', min: 0, max: 1, when: [{ key: 'snap', gt: 0 }, { key: 'thumbBelow', gt: 0 }],
    desc: 'Slap bass: how much rounder the thumb is than the pulled notes. The side of the thumb is wide and soft, so the strike is longer and darker, and the fundamental comes forward. 0 strikes like the pulled notes. 1 is a long, dark thump.' },
  thump: { live: false, group: 'out', min: 0, max: 4, when: [{ key: 'snap', gt: 0 }, { key: 'thumbBelow', gt: 0 }],
    desc: 'Slap bass: the punch of the thumb hitting the string. Thumbed notes get a brief extra burst in the low mids, the string itself sounding an octave up for a moment, while the note goes on ringing as before. It follows the pitch, so it never sounds like a separate drum. 0 leaves it out.' },
  thumpLen: { live: false, group: 'out', min: 0.01, max: 0.2, unit: 's', when: [{ key: 'thump', gt: 0 }],
    desc: 'Slap bass: how long the punch of the thumb takes to die away. Longer is a fuller, boomier hit; shorter is tighter.' },
  pullLevel: { live: false, group: 'out', min: 0, max: 4, when: [{ key: 'snap', gt: 0 }],
    desc: 'Slap bass: how loud the pulled notes (the ones above thumbBelow) are, as a multiple. The thumbed notes stay as they are. 1 leaves them as the rest of the patch makes them.' },
  pullLow: { live: false, group: 'out', min: 0, max: 24, unit: 'dB', when: [{ key: 'snap', gt: 0 }, { key: 'thumbBelow', gt: 0 }],
    desc: 'Slap bass: extra level for the lowest pulled notes, just above thumbBelow, fading to nothing an octave and a half higher. A short, sharp pull barely moves the low modes, so low pulled notes come out much quieter than the thumb, while on a real bass they are about as loud. 0 adds nothing.' },
  pullLowDull: { live: false, group: 'out', min: 0, max: 1, when: [{ key: 'snap', gt: 0 }, { key: 'thumbBelow', gt: 0 }],
    desc: 'Slap bass: how much rounder the lowest pulled notes are, fading out an octave above thumbBelow, like thumbDull for the thumb. A low string popped is a round boom with a little crack, not a thin, even buzz. 0 strikes them like the higher pulled notes.' },
  pullKnock: { live: false, group: 'out', min: 0, max: 20, when: [{ key: 'snap', gt: 0 }],
    desc: 'Slap bass: the thud of a pulled string slamming back onto the frets and fingerboard, a very short burst of low frequencies at the start of every pulled note, reaching below the note itself. It is where most of the punch of a pop comes from. 0 leaves it out.' },
  pullKnockLen: { live: false, group: 'out', min: 0.003, max: 0.03, unit: 's', when: [{ key: 'pullKnock', gt: 0 }],
    desc: 'Slap bass: how long the thud of a pulled note lasts. Shorter is a tighter knock; longer starts to sound like a drum.' },
  pullBend: { live: false, group: 'modes', min: 0, max: 400, unit: 'cents', when: [{ key: 'snap', gt: 0 }],
    desc: 'Slap bass: attackBend for the pulled notes only. A string pulled hard and let go swings wide and goes sharp for a moment before settling, which is much of the snap of a pop. 0 uses attackBend.' },
  pullBuzz: { live: false, group: 'out', min: 0, max: 1, when: [{ key: 'snap', gt: 0 }],
    desc: 'Slap bass: how hard a pulled string, swinging back wide, rattles against the frets just after it is let go. Harder pulls rattle more (with the square of the velocity), and it dies away within pullBuzzTime. It is the string itself clipping against a fret, so it is pitched and metallic, not a hiss. The lowest pulled notes, just above thumbBelow, hardly rattle; from an octave above, every pulled note does. 0 leaves it out.' },
  pullBuzzTime: { live: false, group: 'out', min: 0.005, max: 0.3, unit: 's', when: [{ key: 'pullBuzz', gt: 0 }],
    desc: 'Slap bass: how quickly the fret rattle of a pulled note dies away, while the string is still swinging wide. Longer sounds like a rougher, looser setup.' },
  thumbBright: { live: false, group: 'modes', min: -18, max: 18, unit: 'dB', when: [{ key: 'snap', gt: 0 }, { key: 'thumbBelow', gt: 0 }],
    desc: 'Slap bass: how much brighter the thumbed notes are, lifting their harmonics around thumbBrightFreq. A slapped low string rings bright and metallic, not only at the strike. 0 leaves them as the rest of the patch makes them.' },
  thumbBrightFreq: { live: false, group: 'modes', min: 500, max: 5000, unit: 'Hz', when: [{ key: 'thumbBright', ne: 0 }],
    desc: 'Slap bass: where thumbBright lifts the thumbed notes. The lift is broad, about an octave either side.' },
  thumbBox: { live: false, group: 'modes', min: -18, max: 18, unit: 'dB', when: [{ key: 'snap', gt: 0 }, { key: 'thumbBelow', gt: 0 }],
    desc: 'Slap bass: how much the boxy low mids of the thumbed notes, around 300 Hz, are turned down (negative) or up. 0 leaves them alone.' },
  thumbRelease: { live: false, group: 'decay', min: 0, max: 2, unit: 's', when: [{ key: 'snap', gt: 0 }, { key: 'thumbBelow', gt: 0 }],
    desc: 'Slap bass: release for the thumbed notes only, how long a thumbed note takes to die away after it ends. The thumb does not mute the string hard, so it fades rather than stops. 0 uses release.' },
  pullStop: { live: false, group: 'out', min: 0, max: 1, unit: 's', when: [{ key: 'snap', gt: 0 }],
    desc: 'Slap bass: the left hand stops a pulled note after this long, however long it is written, so pops stay short and dry. A written note shorter than this ends as written, and so does a note joined to the next by a slur or a slide. 0 lets pulled notes ring for their full length.' },
  pullDamp: { live: false, group: 'decay', min: 0, max: 20, when: [{ key: 'snap', gt: 0 }],
    desc: 'Slap bass: damp for the pulled notes only. Lower keeps their upper harmonics ringing longer, a brighter crack; higher dulls them sooner. The thumbed notes keep damp.' },
  keyNoise: { live: false, group: 'out', min: 0, max: 1,
    desc: 'How loud the action itself is: a dull knock as a key hits the bottom when the note starts, and, when it ends, the key falling back and the hammer dropping onto its felt rest a moment later. The strings have nothing to do with it, so it is there even on a silent piano. Not fitted to recordings. 0 is silent.' },
  neck:   { live: false, group: 'modes', min: 0, max: 2, step: 1,
    desc: 'What the left hand does with a slur (c&e in MML) or a portamento (c*e) on a ringing string. 0 ignores the new pitch. 1 is a fretted neck: the pitch steps a semitone at a time, and a slur is a hammer-on or pull-off. 2 is a fretless neck: the pitch glides smoothly.' },
  roll:   { live: false, group: 'out', min: 0, max: 24, unit: '/s',
    desc: 'Turns every note into a roll: strokes per second, alternating hands, for as long as the note lasts. Each stroke hits the head that is still ringing instead of starting a new voice. 0 plays one stroke.' },
  rollJitter: { live: false, group: 'out', min: 0, max: 0.5, when: [{ key: 'roll', gt: 0 }],
    desc: 'How unevenly the strokes of a roll are spaced, as a fraction of the gap. 0 is a machine.' },
  rollVary: { live: false, group: 'out', min: 0, max: 10, unit: 'dB', when: [{ key: 'roll', gt: 0 }],
    desc: 'How much the loudness of each stroke of a roll wanders, up or down.' },
  rollSeed: { live: false, group: 'out', min: 1, max: 9999, step: 1, when: [{ key: 'roll', gt: 0 }],
    desc: 'Seed for the spacing and loudness of the strokes of a roll. The same note rolls the same way every time.' },
  level:  { live: false, group: 'out', min: 0.01, max: 4,
    desc: 'Output level of this patch.' },
};

/**
 * 胴の共鳴の山(パッチの `body` に並べる。ギター)。弦の倍音 1 本ずつに、その高さでの山の大きさを掛ける。
 * 音程によらず、決まった高さに山が立つ。書き方は金管の胴(sound/brass.js の BRASS_BODY)に揃えた。
 * あちらは混ぜたあとに掛けるフィルタで、こちらは声の中で倍音に掛ける
 */
export const MODAL_BODY = {
  freq: { live: false, min: 40, max: 6000, unit: 'Hz',
    desc: 'Centre of the resonance.' },
  gain: { live: false, min: -18, max: 18, unit: 'dB',
    desc: 'How much it lifts or cuts the partials at the centre.' },
  resonance: { live: false, min: 0, max: 0.95,
    desc: 'How narrow the peak is. 0 is broad.' },
};

/**
 * はじめの 4 つ。ジャズのセッションに PSG を混ぜる的(2h)。
 * どれも生音を使っていない。頭も共振器も数字だけで書いてある。
 *
 * `macros` は、1 本で中のパラメータをいくつか同時に動かすもの(applyMacro)。
 *
 * `range` はその楽器で意味のある範囲(推奨範囲)。MODAL_PARAMS の min と max は
 * 計算が壊れない範囲で、楽器によらず 1 つしかない。推奨範囲は楽器ごとに違う
 * (ライドの damp は 0.02 でもう強いが、ベースは 9 が既定)。鳴らす側は使わない。
 * ランダム化はこの中だけで引き、手で動かすときは外へも出られる、という使い方をする。
 * キーはパッチの中の場所で、頭のものは `head.` を付ける。値はどれも見当で、聞いて決めたものではない
 */
export const MODAL_PATCHES = {
  brush: {
    desc: 'Wire brush on a snare. Mostly the sweep heard straight through, a short drum body and wires underneath.',
    series: 'membrane', pitched: false, base: 190,
    // 頭は 16 粒を 6ms に散らす。線が何十本もずれて当たる「パシャ」。前は 9ms の山 1 つで、
    // 大きさと帯域は同じまま、粒立ちだけが加わる(2026-10-05)。sharp は粒 1 つの長さ
    head: { sharp: 2, bright: 0.86, comb: 0.18, noise: 0.95, vary: 0.8, seed: 7, grains: 16, scatter: 6 },
    count: 20, tilt: 0.6, warp: 1, spread: 0.02, seed: 3,
    t60: 0.22, damp: 0.6, release: 0.1,
    direct: 0.32, rattle: 1.6, level: 0.9,
    // 失敗: ときどきワイヤーがばらけて当たる
    splay: 0.1, flawSeed: 1,
    range: {
      'head.sharp': [0.8, 4], 'head.bright': [0.7, 0.95], 'head.comb': [0, 0.4], 'head.noise': [0.7, 1],
      'head.vary': [0.3, 1], 'head.seed': [1, 9999], 'head.grains': [4, 32], 'head.scatter': [1, 14],
      count: [8, 60], tilt: [0.2, 1.2], warp: [0.85, 1.15], spread: [0, 0.08], seed: [1, 9999],
      t60: [0.08, 0.6], damp: [0, 3], release: [0.05, 0.3],
      direct: [0.1, 0.6], rattle: [0.5, 3], level: [0.3, 2],
      splay: [0, 0.4], flawSeed: [1, 9999],
    },
    macros: {
      fan: {
        desc: 'How wide the wires of the brush are fanned out. 0 is a narrow, gathered fan with a tight, focused tap. 2 is a wide fan whose wires land spread out, softer and splashier.',
        min: 0, max: 2,
        neutral: {
          'head.grains': 6, 'head.scatter': 2, 'head.sharp': 1.2, 'head.bright': 0.9,
        },
        levelDb: [-6.4, 2.6],
      },
    },
  },
  brushSweep: {
    desc: 'Wire brush swept in circles on a snare. A long, slightly muffled scrape heard straight through, centred near 3 kHz; the drum body and wires barely sound.',
    // ブラシの擦る音。叩く音(brush)と同じ作りで、頭だけが違う。前は聞くページの側で
    // 頭を上書きしていたので、頭のパラメータが効かず、MML からも呼べなかった(2026-10-05)。
    // 小さな櫛で低いところを削り、3kHz 前後を持ち上げている。削らないと 1kHz より下の
    // 「ゴー」が強く、曲の中で浮いた。前は 6kHz 前後に寄せていたが、きれいすぎて
    // こもった感じが無かった。櫛を少し長くし、明るさも下げた(2026-10-05)。
    // 大きさは測った値(RMS)では前より 3dB 小さい。耳は 3kHz あたりがいちばん敏感なので、
    // 下げた帯域へ寄せると同じ RMS でも大きく聞こえる。セッションの中で大きかった
    series: 'membrane', pitched: false, base: 190,
    // align 1: 頭が 260ms かけてふくらむので、そのままだと 0.1 秒以上遅れて聞こえる。
    // ドラマーは手を拍より前から動かして、いちばん鳴るところを拍に合わせる
    head: { sharp: 260, bright: 0.72, comb: 0.03, noise: 1, vary: 0.8, seed: 7, align: 1 },
    count: 20, tilt: 0.6, warp: 1, spread: 0.02, seed: 3,
    t60: 0.22, damp: 0.6, release: 0.1,
    direct: 0.32, rattle: 1.6, level: 0.9,
    range: {
      'head.sharp': [120, 300], 'head.bright': [0.6, 0.9], 'head.comb': [0.005, 0.04], 'head.noise': [0.85, 1],
      'head.vary': [0.3, 1], 'head.seed': [1, 9999], 'head.align': [0, 1],
      count: [8, 60], tilt: [0.2, 1.2], warp: [0.85, 1.15], spread: [0, 0.08], seed: [1, 9999],
      t60: [0.08, 0.6], damp: [0, 3], release: [0.05, 0.3],
      direct: [0.15, 0.6], rattle: [0.5, 3], level: [0.3, 2],
    },
  },
  bass: {
    desc: 'Upright bass, plucked. A finger strike with plenty of finger noise, heavy loss in the highs, a long ring, muted when let go. Fitted to recordings of a plucked double bass.',
    // 録音(アイオワ大学のコントラバスのピチカート、E1〜C4 を 3 つの強さ)に寄せた(2026-10-05)。
    // 前は 1 秒で 25dB 落ちていたが、録音は 10〜20dB。弱く弾いた C4 が録音より 17dB 小さかった。
    // 頭の山が長く(約 5ms)、その形が 300Hz あたりを打ち消していたため。
    // hardKey を 60Hz から効かせて、高い音ほど頭を短くしている。
    // 雑音が多いのは、録音に指の擦れが入っているぶん
    series: 'string', pitched: true,
    head: { sharp: 4, bright: 0.875, comb: 0.226, noise: 0.6, vary: 0.3, seed: 11, velo: 0, felt: 1.13, hardKey: 0.5, hardFrom: 60 },
    count: 35, stretch: 0.0006, strings: 2, detune: 0, after: 6, afterLevel: 0.35, tilt: 0.635, warp: 1, spread: 0,
    t60: 2, decayKey: 0.3, damp: 20, release: 0.09,
    // 胴。低い音は基音が出ない(E1 で 2 倍音より 15〜20dB 下、A1 で 4〜7dB 下)。C2 から上は基音がいちばん強い。
    // アイオワ大学と VSCO 2 CE の両方の録音でそうなっていた。60Hz あたりで急に切れ、65Hz あたりで胴が鳴る形。
    // 前は E1 も基音がいちばん強かった(2026-10-14)。
    // 200Hz あたりは広く凹ませる。C2〜C3 の 2 倍音が、こちらは録音より 8dB ほど強かった
    // (アイオワで −5〜−29dB、VSCO で −17〜−26dB。楽器ごとのばらつきが大きいので、平均に寄せた)
    body: [{ freq: 65, gain: 10, resonance: 0.6 }, { freq: 200, gain: -12, resonance: 0.3 }],
    bodyLow: 95,
    direct: 0, rattle: 0, level: 0.82,
    // 失敗: 強く弾くとときどきびびり、ときどき指がすべり、弱いときにときどき鳴らしそこねる。
    // びびりは脈打たせない(buzzRasp 0)。音程の周期で脈打つ「ジャー」が突然入って違和感がある、
    // もっと白い雑音に近いのでは、と言われた(2026-10-14)。
    // そのあと、もう少し小さく、と言われて buzzLevel 0.3 → 0.15(−6dB)。
    // びびりは製作途中。本物の録音と聞き比べていないので、既定では鳴らさない(buzz 0.08 → 0)
    buzz: 0, buzzSeed: 1, buzzLevel: 0.15, buzzRasp: 0, slip: 0.04, ghost: 0.03, flawSeed: 1,
    // スラー(c&e)とポルタメント(c*e)で鳴っている弦を動かす。フレットの無い指板なので、なめらかに(2026-10-14)
    neck: 2,
    range: {
      neck: [2, 2],
      'head.sharp': [2, 8], 'head.bright': [0.6, 0.95], 'head.comb': [0.1, 0.35], 'head.noise': [0.2, 0.8],
      'head.vary': [0, 0.6], 'head.seed': [1, 9999], 'head.velo': [0, 1.5], 'head.felt': [0, 3],
      'head.hardKey': [0, 1], 'head.hardFrom': [40, 120],
      count: [12, 60], stretch: [0, 0.001], strings: [1, 2], detune: [0, 3], tilt: [0.4, 1.2],
      warp: [0.95, 1.05], spread: [0, 0.02],
      t60: [1.5, 4], decayKey: [0.1, 0.5], damp: [8, 20], release: [0.05, 0.2],
      bodyLow: [60, 120], 'body.0.freq': [55, 80], 'body.0.gain': [4, 14], 'body.0.resonance': [0.4, 0.8],
      'body.1.freq': [150, 260], 'body.1.gain': [-16, -4], 'body.1.resonance': [0.1, 0.5], after: [3, 8], afterLevel: [0.2, 0.5],
      direct: [0, 0.1], rattle: [0, 0], level: [0.5, 1.2],
      buzz: [0, 0.4], buzzSeed: [1, 9999], buzzLevel: [0.05, 0.6], buzzRasp: [0, 0.5], slip: [0, 0.2], ghost: [0, 0.2], flawSeed: [1, 9999],
    },
    macros: {
      // 0 は録音に寄せる前の値。丸く短い音で、曲の中で邪魔をしない
      upright: {
        desc: 'How much it sounds like a plucked upright bass. 1 is the default, fitted to recordings. 0 is a soft, round, short thump with little finger noise, closer to a muted electric bass. Above 1 the finger noise, the brightness and the ring grow.',
        min: 0, max: 2,
        neutral: {
          'head.bright': 0.42, 'head.comb': 0.18, 'head.noise': 0.08, 'head.felt': 0, 'head.hardKey': 0,
          stretch: 0.00008, tilt: 0.7, t60: 2.6, decayKey: 0, damp: 9, 'body.0.gain': 0, 'body.1.gain': 0, bodyLow: 0, afterLevel: 0,
        },
        // 2 では雑音が増えて基音が細り、13dB 小さく聞こえる(胴の低い切れと凹みも倍になる)
        levelDb: [-7.3, 13.2],
      },
    },
  },
  fingerBass: {
    desc: 'Electric bass played with the fingers. Steel strings over a solid body, heard through a magnetic pickup: no body resonance, a strong low end, and a long, steady ring. Fitted to recordings of an electric bass.',
    // エレキベースの指弾き(2026-10-14)。FreePats の Finger Bass YR(Yamaha RBX、CC0)に寄せる。
    // Rickenbacker 4001(CC BY-NC-SA 3.0、聞き比べだけ)はずっと明るく、3〜5 倍音がいちばん強い。標準は Yamaha にした。
    // ウッドベース(bass)との違い: 胴が鳴らない(body も bodyLow も無し)、金属の弦なので長く残る
    // (1 秒で落ちるのは 3〜9dB。ウッドベースは 10〜17dB)、指の擦れが少ない。
    // 値は Yamaha の E1・A1・D2 と Rickenbacker の G2・G3 に寄せた。1〜8 倍音の差は平均 5dB、1 秒の減りの差は 2dB。
    // Yamaha の 3 音は明るさ(倍音の重心)が 3.1・2.6・2.3(録音 3.6・2.8・2.2)。Rickenbacker はずっと明るく、合わせていない。
    // 弾く位置(comb 0.22)で 4〜5 倍音が凹む。録音でも 5 倍音のあたりが凹んでいる(指とピックアップの位置)
    series: 'string', pitched: true,
    head: { sharp: 3, bright: 0.85, comb: 0.22, noise: 0.15, vary: 0.2, seed: 13, velo: 1, felt: 1, hardKey: 0.3, hardFrom: 60 },
    count: 40, stretch: 0.0002, bStretch: 0.0006, pickupAt: 0, pickupDepth: 1.6, pickupPeak: 2500, pickupPeakGain: 6, strings: 2, detune: 0, after: 3, afterLevel: 0.5, tilt: 0.8, warp: 1, spread: 0,
    t60: 8, decayKey: 0.3, damp: 4, mute: 0, release: 0.08,
    direct: 0, rattle: 0, level: 0.17,
    neck: 1, harmonic: 0,
    range: {
      neck: [1, 1], harmonic: [0, 6],
      'head.sharp': [1, 4], 'head.bright': [0.7, 0.98], 'head.comb': [0.08, 0.3], 'head.noise': [0, 0.4],
      'head.vary': [0, 0.5], 'head.seed': [1, 9999], 'head.velo': [0, 2], 'head.felt': [0, 3],
      'head.hardKey': [0, 0.8], 'head.hardFrom': [40, 120],
      count: [25, 60], stretch: [0, 0.0006], bStretch: [0, 0.002], pickupAt: [0, 0.3], pickupDepth: [0.5, 2.5], pickupPeak: [1200, 5000], pickupPeakGain: [0, 12], strings: [1, 2], detune: [0, 2], tilt: [0.3, 1], warp: [0.98, 1.02], spread: [0, 0.01],
      after: [1, 5], afterLevel: [0.2, 0.8], t60: [4, 16], decayKey: [0, 0.6], damp: [1, 10], mute: [0, 1], release: [0.04, 0.2],
      direct: [0, 0.05], rattle: [0, 0], level: [0.08, 0.4],
    },
  },
  pickBass: {
    desc: 'Electric bass played with a pick. The same bass as fingerBass, struck with a hard plastic edge instead of a fingertip: a sharper attack, much more of the upper harmonics, and the dips from where the string is struck are deeper. Fitted to recordings of an electric bass.',
    // エレキベースのピック弾き(2026-10-15)。fingerBass を土台にした。
    // ピックの録音は Rickenbacker 4001(CC BY-NC-SA 3.0、聞き比べだけ)にしか無い。Rickenbacker はもともと明るいので、
    // 録音そのものには寄せず、同じ楽器で測ったピックと指の差を、fingerBass の目標(Yamaha の指)に足したものに寄せた。
    // 差は 8〜12 倍音で 5〜10dB。ピックは当たるところが細いので、弾く位置の谷も深い。1 秒の減りはほとんど同じ。
    // E1・A1 はその目標、G2・G3 は Rickenbacker のピックそのものと比べた。1〜12 倍音の差は平均 7dB(fingerBass のままだと 9dB)。
    // 残る差は音ごとの谷の位置で、録音では弾くフレットで谷の倍音が動く。こちらは弾く位置を弦の長さの割合で持つので動かない。
    // 1 回目は倍音だけ合わせて、指と同じに聞こえると言われた。弾いた瞬間を 2ms ごとに測ると、1kHz より上の音が
    // 指では 1 周期に 1 回の塊になって、あいだが −40〜−55dB まで沈む。ピックはあいだも −20dB ほどで鳴り続ける。
    // 打つ面に雑音を多く混ぜ(noise 0.8)、細くして(sharp 0.7)、あいだを埋めた。倍音の差は平均 8dB に広がる。
    // G3 は録音より 4〜5dB 明るい。高い音ほど打つ面を短くする hardKey は、明るくする向きなので切った。
    // 雑音が多いぶん打つ力が基音に乗らず、18dB 小さくなるので、level を大きくして fingerBass と揃えた(1.7)
    series: 'string', pitched: true,
    head: { sharp: 0.7, bright: 0.92, comb: 0.21, noise: 0.8, vary: 0.2, seed: 13, velo: 1, felt: 1, hardKey: 0, hardFrom: 60 },
    count: 50, stretch: 0.0002, bStretch: 0.0006, pickupAt: 0, pickupDepth: 1.6, pickupPeak: 2500, pickupPeakGain: 6, strings: 2, detune: 0, after: 3, afterLevel: 0.5, tilt: 0.93, warp: 1, spread: 0,
    t60: 8, decayKey: 0.3, damp: 4, mute: 0, release: 0.08,
    direct: 0, rattle: 0, level: 1.7,
    neck: 1, harmonic: 0,
    range: {
      neck: [1, 1], harmonic: [0, 6],
      'head.sharp': [0.3, 3], 'head.bright': [0.8, 0.99], 'head.comb': [0.08, 0.3], 'head.noise': [0.3, 1],
      'head.vary': [0, 0.5], 'head.seed': [1, 9999], 'head.velo': [0, 2], 'head.felt': [0, 3],
      'head.hardKey': [0, 0.8], 'head.hardFrom': [40, 120],
      count: [25, 60], stretch: [0, 0.0006], bStretch: [0, 0.002], pickupAt: [0, 0.3], pickupDepth: [0.5, 2.5], pickupPeak: [1200, 5000], pickupPeakGain: [0, 12], strings: [1, 2], detune: [0, 2], tilt: [0.3, 1], warp: [0.98, 1.02], spread: [0, 0.01],
      after: [1, 5], afterLevel: [0.2, 0.8], t60: [4, 16], decayKey: [0, 0.6], damp: [1, 10], mute: [0, 1], release: [0.04, 0.2],
      direct: [0, 0.05], rattle: [0, 0], level: [0.8, 3],
    },
  },
  slapBass: {
    desc: 'Electric bass, slapped. Low notes are struck with the side of the thumb, a round, heavy thump; higher notes are hooked with a finger, pulled away and let go, so the string snaps back onto the frets with a bright crack. The strings ring bright and metallic for a moment after every note. Fitted to recordings of a slapped electric bass.',
    // エレキベースのスラップ(2026-10-15)。fingerBass を土台にした。比べた録音は Rickenbacker 4001 のスラップ
    // (CC BY-NC-SA 3.0、聞き比べだけ)。Slap1 と Slap2 の 2 つがあり、Slap2 は基音が強く暗いので親指、
    // Slap1 は明るいので引っぱる音と見た(ファイル名には書かれていない)。
    // スラップは指弾きより 2.5kHz のあたりが 15〜20dB 大きく、それが 200 ミリ秒ほどかけて消える。
    // 打った瞬間のパチッだけでなく、弦そのものが明るく鳴っている。打つ面を細く明るく、ほぼ雑音にした(sharp 0.57、noise 1)。
    // 低い音(E1 A1)は親指として、Yamaha の指の目標に Rickenbacker の(Slap2 − 指)を足したものに、
    // 高い音(G2 G3)は Slap1 そのものに寄せた。引っぱる音の高い音の減り方は 20 ミリ秒ごとにほぼ合う。
    // 親指は、頭を長く暗くして(thumbDull 0.59)基音を前に出し、上の倍音の並びを録音に寄せた。
    // 1〜12 倍音の差は平均 6dB、2.5kHz・5kHz の 20 ミリ秒ごとの差は 5dB
    // 弾いた直後の音程の揺れ(attackBend 100 セント、0.06 秒で戻る)。録音と同じ測り方(60 ミリ秒の範囲)で、
    // 強く叩いた G2 と A1 の 0〜50 ミリ秒が録音から平均 5 セント。揺れを入れる前は、シンセのようだと言われていた
    series: 'string', pitched: true,
    head: { sharp: 0.58, bright: 0.93, comb: 0.15, noise: 1, vary: 0.1, seed: 13, velo: 1, felt: 1, hardKey: 0, hardFrom: 60 },
    count: 60, stretch: 0.0002, bStretch: 0.0006, attackBend: 100, attackBendTime: 0.06, pickupAt: 0, pickupDepth: 1.6, pickupPeak: 2500, pickupPeakGain: 6, strings: 2, detune: 0, after: 3, afterLevel: 0.5, tilt: 0.83, warp: 1, spread: 0,
    t60: 8, decayKey: 0.3, damp: 2, mute: 0, release: 0.08,
    snap: 0.18,
    // 親指で叩く音と、指で引っぱる音の分かれ目。D2(73Hz)から上を引っぱる。
    // 定番の「親指で低い音、指で 1 オクターブ上」(E1 → E2、A1 → A2)が、そのまま親指と引っぱる音になる
    thumbBelow: 70, thumbDull: 0.43,
    // 2026-10-18、相手のスラップの録音と同じ譜面で聞き比べて決めた(.work/build-slapE.mjs の 6)。
    // 打つ位置 comb 0.24 → 0.15。0.24 では親指の E1 の 4 倍音が抜けていた(録音は 2〜4 倍音が揃って強い)。
    // 親指の「ドン」thump 3(録音は叩いた直後の 50 ミリ秒だけ 120〜600Hz が 4dB ほど大きい)。
    // ドンでピークが 1.3 倍になるので level 0.9 → 0.7 で戻した。
    // 引っぱる音は 3dB 大きく(pullLevel 1.41)、高い倍音を長く残して明るく(pullDamp 0.5)。
    // 録音は引っぱる音が親指より 3〜6dB 小さいだけで明るく、こちらは 10dB ほど小さく暗かった
    // 低い引っぱる音(D2 E2)は、雑音だけの短い頭で薄く小さく、毎回ばらついた。録音の D2 は丸く、親指とほぼ同じ大きさ。
    // 頭を親指のように丸くし(pullLowDull 0.35)、少し上げた(pullLow 3)。聞き比べで決めた(2026-10-18)
    // 引っぱる音の頭に、弦が指板に当たる「ドッ」(pullKnock 4)。迫力は音色ではなく最初の短いところ、と言われた。
    // 頭の山が高くなるぶん level 0.7 → 0.54。引っぱる音の雑音の毎回変わる割合は head の vary 0.2 → 0.1(ばらつき ±1dB)。
    // 聞き比べで決めた(2026-10-20)
    // 親指の音だけ明るく(thumbBright 16、1.8kHz あたり)、300Hz あたりのこもりを下げた(thumbBox -10)。
    // 録音の親指の音は、こちらより 1kHz から上が 6〜22dB 多く、250〜355Hz が 5〜10dB 少なかった。聞き比べで決めた(2026-10-23)
    thump: 3, thumpLen: 0.1, pullLevel: 1.41, pullLow: 3, pullLowDull: 0.35, pullKnock: 4, pullKnockLen: 0.008, thumbRelease: 0.3, thumbBright: 16, thumbBrightFreq: 1800, thumbBox: -10, bendFollow: 0, pullStop: 0, pullBend: 250, pullBuzz: 0.6, pullBuzzTime: 0.04, pullDamp: 0.5,
    // 強く引っぱった弦(2026-10-20)。「ぺけっ」は弦が強く引っぱられているから、と言われた。離した直後は張りが増えて
    // 高く鳴り(pullBend 250 セント。頭で +183 セント)、戻った弦がフレットに当たって欠ける(pullBuzz 0.6、40 ミリ秒で消える。
    // 低い引っぱる音には付けない)。聞き比べで決めた
    // 親指の音は止めたあと 0.3 秒かけて消す(thumbRelease)。録音は止めてから 250 ミリ秒ほどで 24dB 落ちる(2026-10-20)
    // 止めたあとに残る、弾いていない弦の小さな響き(共鳴弦。4 弦の開放弦)。弾く人が左手で止めた音は、止めたあとも
    // 小さな響きが残る(録音の引っぱる音で -27dB ほど)。共鳴弦が無いと、止めた音は無音まで落ちる。聞き比べで決めた(2026-10-20)
    sympathetic: 0.3, symTuning: 'bass',
    // 引っぱる音の弦だけを 12dB 上げてみたら(パチッはそのまま)、不自然になったと言われて戻した(2026-10-16)。
    // 別に足す雑音(パチッ)ではなく、弦の音の最初だけ倍音を多くするのがよいのでは、と言われた。録音でも 2.5kHz のあたりは
    // 弦の倍音で、200 ミリ秒で 15dB ほど落ちる。打つ面を明るく(bright 0.915 → 0.93、親指の暗さ 0.59 → 0.43、tilt 1.1 → 0.83)、
    // 高い倍音を早く消し(damp 1.2 → 2)、パチッを半分にした(snap 0.35 → 0.18)。録音との差 15.0 → 12.6。
    // 全体の釣り合いが悪い、ベースっぽくないと言われて、親指の 500Hz〜2kHz を録音に寄せた(暗さ 0.43 → 0.1)。
    // 音色はよいかもしれないが小さくて聞こえない、悪化だ、と言われて戻した。親指が 3dB 小さくなっていた(2026-10-16)
    // 弦がフレットに当たってびびる。どの音でも(buzz 1)、ごく小さく(0.02)。
    // 親指の録音は上の倍音が弱いのに、2.5kHz のあたりが 160 ミリ秒ほど残るので、びびりで出した(はじめ 0.13)。
    // 曲の中で、指弾きのあとに急に雑音が目立つと言われた。3kHz より上が録音のスラップより親指で 13dB、
    // 引っぱる音で 2〜6dB 多かった。びびり 0.13 → 0.02、パチッ 0.53 → 0.35 で、4 音とも録音から ±4dB。
    // 大きさは、指弾きと揃えると聞こえにくい(音量の多くを雑音が取っていた)と言われた。本物のスラップは指弾きより大きいので、
    // fingerBass より 2dB 大きくした。4dB では、曲の中で強く弾いた音のアタックが 1 を超えて割れた。
    // 力強い達人のスラップに寄せてよい、と言われた(2026-10-15)。引っぱる音の頭を雑音半分・鋭く明るくして、
    // 親指より 1dB 大きくなるようにしたら、迫力がまったく無くなった、悪化だ、と言われて戻した。
    // 測った釣り合い(親指が引っぱる音より 16dB 大きい)は、聞いた印象の迫力とは別のものだった
    buzz: 1, buzzSeed: 1, buzzLevel: 0.02, buzzRasp: 0.6,
    direct: 0, rattle: 0, level: 0.54,
    neck: 1,
    range: {
      neck: [1, 1],
      'head.sharp': [0.3, 1.5], 'head.bright': [0.85, 0.98], 'head.comb': [0.1, 0.3], 'head.noise': [0.5, 1],
      'head.vary': [0, 0.5], 'head.seed': [1, 9999], 'head.velo': [0, 2], 'head.felt': [0, 3],
      'head.hardKey': [0, 0.8], 'head.hardFrom': [40, 120],
      count: [40, 60], stretch: [0, 0.0006], bStretch: [0, 0.002], attackBend: [30, 100], attackBendTime: [0.03, 0.1], pickupAt: [0, 0.3], pickupDepth: [0.5, 2.5], pickupPeak: [1200, 5000], pickupPeakGain: [0, 12], strings: [1, 2], detune: [0, 2], tilt: [0.7, 1.3], warp: [0.98, 1.02], spread: [0, 0.01],
      after: [1, 5], afterLevel: [0.2, 0.8], t60: [4, 16], decayKey: [0, 0.6], damp: [0.5, 5], mute: [0, 1], release: [0.04, 0.2],
      snap: [0.1, 0.5], thumbBelow: [50, 100], thumbDull: [0.05, 0.6], thump: [0, 4], thumpLen: [0.05, 0.15], pullLevel: [0.7, 2], pullLow: [0, 12], pullLowDull: [0, 0.6], pullKnock: [0, 10], pullKnockLen: [0.005, 0.015], thumbRelease: [0, 1], thumbBright: [0, 18], thumbBrightFreq: [1000, 3500], thumbBox: [-14, 0], bendFollow: [0, 1], pullStop: [0, 0.2], pullBend: [0, 300], pullBuzz: [0, 1], pullBuzzTime: [0.02, 0.1], sympathetic: [0, 0.6], pullDamp: [0.2, 3],
      buzz: [0, 1], buzzSeed: [1, 9999], buzzLevel: [0, 0.4], buzzRasp: [0, 1],
      direct: [0, 0.05], rattle: [0, 0], level: [0.3, 3],
    },
  },
  bassSlap: {
    desc: 'Upright bass, slapped. Low notes are struck with the thumb, a round thump; higher notes are pulled away from the neck and let go, so the string snaps back against the fingerboard with a click. Brighter and shorter than a plain pluck. Made by ear from how the technique is described; not fitted to recordings.',
    // スラップ(ロカビリー)。弦を指板から引き離して放す。戻った弦が指板に当たってパチッと鳴る(snap)。
    // ふつうのピチカート(bass)をもとに、引っぱって放すので頭を短く明るく、指の擦れを減らし、短く切る。
    // 録音が手に入らず(自由に使える録音が見つからない、Freesound にこのコンテナから届かない)、見当で作った。
    // エレキのスラップ(Project16 Rickenbacker 4001、CC BY-NC-SA 3.0 で聞き比べだけ)と比べて寄せた。パチッの高さは
    // エレキで 1.3〜3.3kHz、こちらは 5〜6kHz で明るすぎたので 1.9kHz ほどに下げた(木の指板なのでエレキより暗め)。
    // パチッの大きさは A2 でエレキより 8dB ほど小さい。弦はピチカートより少し明るく(count 35 → 50、damp 20 → 10)。
    // エレキは 30〜50 ミリ秒後も高い音が残る(金属の弦)が、ガット弦はそうならないと見て、合わせていない。
    // 製作途中(2026-10-14)
    // 調整中。MML からは使えない(draft)。エレキベースを先に作ってから戻る、と言われた(2026-10-14)
    draft: true,
    series: 'string', pitched: true,
    head: { sharp: 2.5, bright: 0.92, comb: 0.226, noise: 0.3, vary: 0.3, seed: 11, velo: 0, felt: 1.13, hardKey: 0.5, hardFrom: 60 },
    count: 50, stretch: 0.0006, strings: 2, detune: 0, after: 4, afterLevel: 0.2, tilt: 0.635, warp: 1, spread: 0,
    t60: 1.4, decayKey: 0.3, damp: 10, release: 0.09,
    body: [{ freq: 65, gain: 10, resonance: 0.6 }, { freq: 200, gain: -12, resonance: 0.3 }],
    bodyLow: 95,
    snap: 0.5,
    // 親指で叩く音と、指で引っぱる音の分かれ目。E2(82Hz)より下を親指にする
    thumbBelow: 80, thumbDull: 0.075,
    direct: 0, rattle: 0, level: 0.69,
    buzz: 0, buzzSeed: 1, buzzLevel: 0.15, buzzRasp: 0, slip: 0.04, ghost: 0.03, flawSeed: 1,
    neck: 2,
    range: {
      neck: [2, 2],
      'head.sharp': [1.5, 5], 'head.bright': [0.6, 0.95], 'head.comb': [0.1, 0.35], 'head.noise': [0.1, 0.6],
      'head.vary': [0, 0.6], 'head.seed': [1, 9999], 'head.velo': [0, 1.5], 'head.felt': [0, 3],
      'head.hardKey': [0, 1], 'head.hardFrom': [40, 120],
      count: [30, 80], stretch: [0, 0.001], strings: [1, 2], detune: [0, 3], tilt: [0.4, 1.2],
      warp: [0.95, 1.05], spread: [0, 0.02],
      t60: [0.8, 3], decayKey: [0.1, 0.5], damp: [5, 20], release: [0.05, 0.2],
      bodyLow: [60, 120], 'body.0.freq': [55, 80], 'body.0.gain': [4, 14], 'body.0.resonance': [0.4, 0.8],
      'body.1.freq': [150, 260], 'body.1.gain': [-16, -4], 'body.1.resonance': [0.1, 0.5], after: [2, 6], afterLevel: [0.1, 0.4],
      snap: [0.3, 1], thumbBelow: [60, 120], thumbDull: [0, 0.3],
      direct: [0, 0.1], rattle: [0, 0], level: [0.4, 1],
      buzz: [0, 0.4], buzzSeed: [1, 9999], buzzLevel: [0.05, 0.6], buzzRasp: [0, 0.5], slip: [0, 0.2], ghost: [0, 0.2], flawSeed: [1, 9999],
    },
  },
  bassSlapHit: {
    desc: 'Slapped upright bass, the palm hit: the hand smacks all four strings flat against the fingerboard, so the open strings sound for a moment and stop at once. A short, low, pitchless thump between the plucked notes. The note you write is not used. Made by ear; not fitted to recordings.',
    // スラップの手のひらの「チャッ」。手のひらで弦を指板に叩きつける、音程の無い音(2026-10-14)。
    // 弦は手で押さえつけられて鳴らない(t60 をごく短く)。雑音で作るとスネアにしか聞こえなかったので、
    // 4 本の開放弦をまとめてごく短く鳴らし、木の音は一瞬だけにする(palm)。
    // 書いた高さは使わない(4 本の開放弦で鳴らす)。
    // ベースの専用の書き方ができるまでのつなぎ。見当で作った。製作途中
    // 調整中。MML からは使えない(draft)。エレキベースを先に作ってから戻る、と言われた(2026-10-14)
    draft: true,
    series: 'string', pitched: true,
    head: { sharp: 4, bright: 0.75, comb: 0.226, noise: 0.4, vary: 0.3, seed: 11, velo: 0, felt: 1.13, hardKey: 0.5, hardFrom: 60 },
    count: 30, stretch: 0.0006, strings: 1, detune: 0, after: 1, afterLevel: 0, tilt: 0.635, warp: 1, spread: 0,
    t60: 0.1, decayKey: 0, damp: 10, release: 0.03,
    body: [{ freq: 65, gain: 10, resonance: 0.6 }, { freq: 200, gain: -12, resonance: 0.3 }],
    bodyLow: 95,
    snap: 1,
    thumbBelow: 400, palm: 1,
    direct: 0, rattle: 0, level: 0.5,
    buzz: 0, buzzSeed: 1, buzzLevel: 0.15, buzzRasp: 0, slip: 0, ghost: 0, flawSeed: 1,
    neck: 0,
    range: {
      neck: [0, 0],
      'head.sharp': [2, 5], 'head.bright': [0.6, 0.9], 'head.comb': [0.1, 0.35], 'head.noise': [0.2, 0.7],
      'head.vary': [0, 0.6], 'head.seed': [1, 9999], 'head.velo': [0, 1.5], 'head.felt': [0, 3],
      'head.hardKey': [0, 1], 'head.hardFrom': [40, 120],
      count: [20, 50], stretch: [0, 0.001], strings: [1, 1], detune: [0, 3], tilt: [0.4, 1.2],
      warp: [0.95, 1.05], spread: [0, 0.02],
      t60: [0.05, 0.2], decayKey: [0, 0], damp: [5, 20], release: [0.02, 0.06],
      bodyLow: [60, 120], 'body.0.freq': [55, 80], 'body.0.gain': [4, 14], 'body.0.resonance': [0.4, 0.8],
      'body.1.freq': [150, 260], 'body.1.gain': [-16, -4], 'body.1.resonance': [0.1, 0.5], after: [1, 1], afterLevel: [0, 0],
      snap: [0.5, 1], thumbBelow: [400, 400], palm: [1, 1],
      direct: [0, 0.1], rattle: [0, 0], level: [0.25, 1],
      buzz: [0, 0.4], buzzSeed: [1, 9999], buzzLevel: [0.05, 0.6], buzzRasp: [0, 0.5], slip: [0, 0], ghost: [0, 0], flawSeed: [1, 9999],
    },
  },
  guitar: {
    desc: 'Classical guitar with nylon strings, plucked with the fingers. Each string swings in two directions that fall at different rates, and the body only sounds what it resonates with: the top plate near 210 Hz, little below it. Fitted to recordings of a classical guitar.',
    series: 'string', pitched: true,
    head: { sharp: 0.6, bright: 0.88, comb: 0.258, noise: 0.43, vary: 0.3, seed: 13, velo: 3.3, felt: 0.18, hardKey: 0.57 },
    count: 160, stretch: 0.000031, strings: 2, detune: 0.79, tilt: 0.41, warp: 1, spread: 0,
    body: [{ freq: 59, gain: 16.3, resonance: 0.95 }, { freq: 209, gain: 12.2, resonance: 0.6 }, { freq: 1087, gain: -16, resonance: 0.38 }],
    bodyLow: 202,
    t60: 3.52, decayKey: 0.29, after: 1.76, afterLevel: 0.55, damp: 0.021, release: 0.1,
    direct: 0, rattle: 0, level: 0.3,
    // 失敗: 指のすべり(slip)がごくたまに起きる(乱数。弾き方の崩れ)。鳴りそこね(ghost)は既定で起こさない。
    // びびり(buzz)は楽器の状態で、決まった音を強く弾いたときに毎回鳴る。既定は少なく小さく
    // (音の 5%、大きさ 0.05)。0.3 では音の 11dB 下で激しすぎた(2026-10-13)
    // 押さえ替えのノイズ(stringNoise・lift・care)と、離したときの開放弦の鳴り(openRing)は
    // 乱数を使わない。弦の性質と弾く人の癖で決まる。
    // 既定は、新しくも古くもない弦を、少し付けたまま移る人がそれなりに気をつけて弾く。値は見当
    buzz: 0.05, buzzSeed: 1, buzzLevel: 0.05, slip: 0.01, ghost: 0, flawSeed: 1,
    stringNoise: 0.5, openRing: 0.5, lift: 0.3, click: 0, rush: 0, care: 0.3, sympathetic: 0.5,
    // スラー(c&e)とポルタメント(c*e)で鳴っている弦を動かす。フレットがあるので、半音ずつ(2026-10-14)
    neck: 1,
    range: {
      neck: [1, 1],
      'head.sharp': [0.4, 3], 'head.bright': [0.75, 0.95], 'head.comb': [0.18, 0.3], 'head.noise': [0.2, 0.7],
      'head.vary': [0, 0.6], 'head.seed': [1, 9999], 'head.velo': [1.5, 4.5], 'head.felt': [0, 1.5], 'head.hardKey': [0.3, 0.9],
      count: [80, 240], stretch: [0, 0.00015], strings: [1, 2], detune: [0, 1.5], tilt: [0.2, 0.8],
      warp: [0.99, 1.01], spread: [0, 0.005], bodyLow: [140, 220],
      'body.0.freq': [50, 70], 'body.0.gain': [10, 20], 'body.0.resonance': [0.8, 0.95],
      'body.1.freq': [180, 240], 'body.1.gain': [6, 16], 'body.1.resonance': [0.5, 0.9],
      'body.2.freq': [800, 1400], 'body.2.gain': [-18, -8], 'body.2.resonance': [0, 0.5],
      t60: [2, 6], decayKey: [0.1, 0.6], after: [1.3, 3], afterLevel: [0.3, 0.8], damp: [0.005, 0.1], release: [0.05, 0.3],
      direct: [0, 0.05], rattle: [0, 0], level: [0.1, 0.8],
      buzz: [0, 0.4], buzzSeed: [1, 9999], buzzLevel: [0.03, 0.4], slip: [0, 0.2], ghost: [0, 0.2], flawSeed: [1, 9999], stringNoise: [0, 1], openRing: [0, 1], lift: [0, 1], click: [0, 1], rush: [0, 1], care: [0, 0.8], sympathetic: [0, 1],
    },
    macros: {
      // 3 本が動かす値は重ならないようにしてある。重なると、あとから当てたほうが勝つ
      classical: {
        desc: 'How much it sounds like a classical guitar. 1 is the default, fitted to recordings. 0 takes the body away and leaves the bare strings: no air below the top plate, no body peaks, a single steady decay. Above 1 the body peaks and the low cut grow.',
        min: 0, max: 2,
        neutral: {
          'body.0.gain': 0, 'body.1.gain': 0, 'body.2.gain': 0, bodyLow: 0, afterLevel: 0.2,
        },
        // 大きさの補正(dB)。E2・G3・E4 を強さ 0.4・0.7・1 で 1 秒ずつ鳴らした実効値を、1 と比べた(2026-10-13)
        levelDb: [0.1, 3.7],
      },
      pluck: {
        desc: 'Where the string is plucked. 1 is the default, over the sound hole. 0 is up over the fingerboard: round and soft. 2 is close to the bridge: thin, bright and metallic.',
        min: 0, max: 2,
        neutral: {
          'head.comb': 0.45, 'head.bright': 0.8, tilt: 0.55,
        },
        levelDb: [0.3, 1.8],
      },
      nail: {
        desc: 'What touches the string. 1 is the default, with nails. 0 is the flesh of the finger: a softer, darker attack with less scrape. 2 is more nail: a short, clicky, scratchy attack.',
        min: 0, max: 2,
        neutral: {
          'head.sharp': 1.4, 'head.noise': 0.15, 'head.felt': 0,
        },
        levelDb: [-1.2, 1.3],
      },
    },
  },
  piano: {
    desc: 'Piano-like. Stiff strings in pairs that beat and fall in two stages, a felt hammer whose brightness follows the velocity, and a wooden knock. Fitted to recordings of a grand piano.',
    series: 'string', pitched: true,
    head: { sharp: 0.74, bright: 0.68, comb: 0.125, noise: 0.05, vary: 0.2, seed: 5, velo: 4.1, hardKey: 0.22, felt: 3.1 },
    count: 100, stretch: 0.0007, stretchKey: 1.25, strings: 2, detune: 1.2, tilt: 0.63,
    warp: 1, spread: 0, guide: 523, knock: 0.25, sour: 0, sourSeed: 1,
    t60: 4.1, decayKey: 0.36, after: 4.8, afterLevel: 0.42, damp: 0.63, release: 0.25,
    direct: 0, rattle: 0, trebleGain: 3.5, level: 0.16, keyNoise: 0.3, silent: 0,
    // 共鳴弦。88 鍵ぶん。ダンパーのある弦は右ペダルを踏んだときだけ鳴る(2026-10-14)
    sympathetic: 0.5, symTuning: 'piano',
    // 失敗: ときどきとなりの鍵盤も押す(弾き方の失敗。乱数)。
    // 二度打ちは調整の悪い鍵盤で起きる(楽器の状態。鍵盤の 5% で、どれかは doubleSeed で決まる)。
    // 種 2 では C1・B♭2・A4・B4・B7 が、強く弾いたときに二度打つ
    // 乱数のびびり(buzz)は既定で起こさない。曲の中で鳴らすとハイハットかと思うほど目立ち、
    // ピアノでは弾き方で起きる音ではないと言われた(2026-10-13)。前は起きやすさ 0.02、大きさ 0.3 で、
    // 音の頭より 10〜13dB 下の高い雑音だった。ピアノのびびりは楽器の状態なので、下の loose で鳴らす
    neighbor: 0.03, double: 0.05, doubleSeed: 2, buzz: 0, buzzSeed: 1, buzzLevel: 0.1, flawSeed: 1,
    // どこかが少しゆるんでいる。233Hz(B♭3)の近くに倍音がある音を強く弾いたときだけ、かすかにびびる。
    // A3〜B3 と、その倍音が重なる A2〜B2 あたり。ff のいちばん鳴る音で、音の 23〜30dB 下。値は見当
    loose: 0.05, looseFreq: 233, looseFrom: 0.3,
    range: {
      'head.sharp': [0.5, 2.5], 'head.bright': [0.55, 0.8], 'head.comb': [0.1, 0.15], 'head.noise': [0, 0.12],
      'head.vary': [0, 0.5], 'head.seed': [1, 9999], 'head.velo': [2.5, 6], 'head.hardKey': [0.2, 1.2],
      'head.felt': [1, 5],
      count: [40, 160], stretch: [0.0002, 0.0015], stretchKey: [0.8, 2], strings: [2, 3], detune: [0.3, 3],
      tilt: [0.5, 1.6], warp: [0.98, 1.02], spread: [0, 0.005], guide: [300, 900], knock: [0.1, 0.5], sour: [0, 15], sourSeed: [1, 9999],
      t60: [2, 8], decayKey: [0.2, 0.8], after: [2, 8], afterLevel: [0.2, 0.8], damp: [0.2, 0.8],
      release: [0.12, 0.5], direct: [0, 0.05], rattle: [0, 0], trebleGain: [0, 8], level: [0.12, 0.8], keyNoise: [0, 1], silent: [0, 1], sympathetic: [0, 1],
      neighbor: [0, 0.2], double: [0, 0.2], doubleSeed: [1, 9999], buzz: [0, 0.1], buzzSeed: [1, 9999], buzzLevel: [0.03, 0.4], flawSeed: [1, 9999], loose: [0, 0.3], looseFreq: [100, 1000], looseFrom: [0.1, 1],
    },
    macros: {
      // ちゃんとしたピアノの中での違いを 3 本。どちらの端もピアノのまま、
      // 性格だけが変わる。ソロで聞いて分かる違いのうち、声の中で作れるもの(2026-10-05)。
      // 響板、ペダルの共鳴、部屋、マイクの距離は声の外なので入れない
      voicing: {
        desc: 'Voicing of the hammers, as a piano technician does it. 0 is soft and round, 2 is hard and bright.',
        min: 0, max: 2,
        neutral: {
          'head.felt': 0.5, 'head.bright': 0.55, 'head.hardKey': 0, knock: 0.15,
        },
        // 大きさの補正(dB)。0 のときと max のとき。1 では 0。測って決めた(C3・C4・C5 の平均)
        levelDb: [2.6, -1.2],
      },
      size: {
        desc: 'Size of the instrument. 0 is an upright with short, stiff strings and a shorter ring. 2 leans to a concert grand with long strings.',
        min: 0, max: 2,
        neutral: {
          stretch: 0.0016, t60: 2.2, after: 3,
        },
        levelDb: [1.7, -0.8],
      },
      unison: {
        desc: 'How the strings of one key agree. 0 is a single dry, pure string. 2 is a fuller sound from strings slightly apart.',
        min: 0, max: 2,
        neutral: {
          afterLevel: 0, detune: 0,
        },
        levelDb: [-0.3, 0.5],
      },
    },
  },
  rhodes: {
    desc: 'Electric piano with tines, like a Rhodes. A neoprene hammer strikes a thin tine; the metallic ping dies fast and the round tone of the tone bar stays. Played hard, the pickup barks.',
    // まだ録音に寄せていない。値は見当(2026-10-06)。
    // 頭はネオプレンのハンマー。強いほど短く明るくなり、ティンの上の倍音(キン)が出る。
    // 高い音ほど短く当てる(hardKey を C3 から効かせる)。前は C3 でしか「キン」が聞こえなかった。
    // 頭の山の形が 900Hz あたりを打ち消していて、C4 から上では 6.27 倍の倍音がそこへ入っていた
    // (C4 で基音より 37dB 下。いまは C3 から C5 まで 6〜13dB 下)
    series: 'tine', pitched: true,
    head: { sharp: 1.2, bright: 0.66, comb: 0.06, noise: 0.03, vary: 0.2, seed: 9, velo: 3.2, hardKey: 0.9, hardFrom: 130, felt: 2 },
    // tilt はティンの振れ(変位)の傾き。ピックアップが変化の速さを拾うので、上の倍音は高さの倍率ぶん
    // 強く出る。その 1 ぶんを足して、磁束のまま出していたとき(0.5)と同じ釣り合いにしてある
    count: 6, tilt: 1.5, warp: 1, spread: 0, seed: 1,
    // ティンとトーンバーで、1 音に 2 本鳴る。detune・after・afterLevel は strings が 2 以上で効く決まりなので 2 にする
    // (tine の並びは strings の数を読まない)
    strings: 2, detune: 0.8, after: 1.8, afterLevel: 0.6,
    t60: 5, decayKey: 0.5, damp: 0.15, release: 0.22,
    direct: 0, rattle: 0, pickup: 0.7, pickupOffset: 0.1, level: 0.23,
    // スーツケースのアンプのトレモロ。2 チャンネルへ配って交互に大きくする。値は見当(2026-10-07)
    width: 1, tremolo: 0.5, tremoloRate: 4.5,
    range: {
      'head.sharp': [0.8, 3], 'head.bright': [0.5, 0.8], 'head.comb': [0, 0.15], 'head.noise': [0, 0.1],
      'head.vary': [0, 0.5], 'head.seed': [1, 9999], 'head.velo': [2, 5], 'head.hardKey': [0.5, 1.3], 'head.hardFrom': [100, 200], 'head.felt': [0.5, 4],
      count: [3, 6], tilt: [1.2, 2], warp: [0.97, 1.03], spread: [0, 0.01], seed: [1, 9999],
      strings: [2, 2], detune: [0, 3], after: [1, 3], afterLevel: [0.15, 1],
      t60: [3, 9], decayKey: [0.2, 0.8], damp: [0, 0.5], release: [0.12, 0.4],
      direct: [0, 0.05], rattle: [0, 0], pickup: [0, 1.2], pickupOffset: [-0.2, 0.3], level: [0.1, 0.6],
      width: [0.5, 1], tremolo: [0, 1], tremoloRate: [2, 8],
    },
    macros: {
      // 0 はピックアップとトーンバーを抜いた音。金属の棒をハンマーで叩いて生音で聞く楽器で、
      // チェレスタ(鍵盤で鳴らす鉄琴)に近い。本物から取れる端なので、ここを 0 にした
      rhodes: {
        desc: 'How much it sounds like a Rhodes. 1 is the default. 0 takes away the pickup and most of the tone bar and hardens the hammer: a struck metal bar heard acoustically, close to a celesta. Above 1 the bark, the metallic ping and the ring of the tone bar all grow.',
        min: 0, max: 2,
        neutral: {
          pickup: 0, pickupOffset: 0, afterLevel: 0.15, after: 1, t60: 2.5,
          'head.sharp': 0.8, 'head.velo': 1.5, 'head.felt': 0.5, 'head.bright': 0.75,
        },
        // 0 はピックアップもトーンバーも抜けて 8dB 小さく、2 は 11dB 大きく出る。
        // C3・C4・C5 を強さ 0.4・0.7・1 で 1 秒ずつ鳴らした実効値を、1 と比べた(2026-10-07)
        levelDb: [7.9, -11.1],
      },
    },
  },
  timpani: {
    desc: 'Timpani. A calf or plastic head over a copper kettle, struck with felt mallets. The air in the kettle pulls the head modes into a near-harmonic row, so it has a clear pitch: the note you write is the principal tone. Fitted to recordings of orchestral timpani.',
    series: 'kettle', pitched: true,
    head: { sharp: 1.5, bright: 0.7, comb: 0, noise: 0.12, vary: 0.2, seed: 3, velo: 6, felt: 8, hardKey: 0 },
    count: 113, light: 0, lo: 3.5, hi: 40, cloud: 3, tilt: 0.5, warp: 1, spread: 0,
    t60: 3, decayKey: 0.3, damp: 0.02, release: 0.8,
    direct: 0, rattle: 0, level: 0.08,
    range: {
      'head.sharp': [0.8, 4], 'head.bright': [0.55, 0.85], 'head.comb': [0, 0], 'head.noise': [0, 0.4],
      'head.vary': [0, 0.5], 'head.seed': [1, 9999], 'head.velo': [4, 6], 'head.felt': [4, 8], 'head.hardKey': [0, 0.5],
      count: [60, 160], light: [0, 1], lo: [2.5, 5.5], hi: [25, 60], cloud: [1.5, 5], tilt: [0, 1], warp: [0.98, 1.02], spread: [0, 0.01],
      t60: [1.5, 6], decayKey: [0, 0.6], damp: [0, 0.1], release: [0.2, 2],
      direct: [0, 0.05], rattle: [0, 0], level: [0.04, 0.15],
    },
  },
  timpaniRoll: {
    desc: 'Timpani roll. One note is a roll for as long as it lasts: soft strokes, hand over hand, about 13 a second, each one hitting the head that is still ringing. Fitted to recordings of rolls on orchestral timpani.',
    series: 'kettle', pitched: true,
    head: { sharp: 1.5, bright: 0.75, comb: 0, noise: 0.12, vary: 0.2, seed: 3, velo: 6, felt: 8, hardKey: 0 },
    count: 113, light: 0, lo: 3.5, hi: 40, cloud: 3, tilt: 0.5, warp: 1, spread: 0,
    t60: 3, decayKey: 0.3, damp: 0.02, release: 0.8,
    roll: 13, rollJitter: 0.15, rollVary: 3, rollSeed: 1,
    direct: 0, rattle: 0, level: 0.04,
    range: {
      'head.sharp': [0.8, 4], 'head.bright': [0.6, 0.9], 'head.comb': [0, 0], 'head.noise': [0, 0.4],
      'head.vary': [0, 0.5], 'head.seed': [1, 9999], 'head.velo': [4, 6], 'head.felt': [4, 8], 'head.hardKey': [0, 0.5],
      count: [60, 160], light: [0, 1], lo: [2.5, 5.5], hi: [25, 60], cloud: [1.5, 5], tilt: [0, 1], warp: [0.98, 1.02], spread: [0, 0.01],
      t60: [1.5, 6], decayKey: [0, 0.6], damp: [0, 0.1], release: [0.2, 2],
      roll: [10, 16], rollJitter: [0.05, 0.3], rollVary: [1, 5], rollSeed: [1, 9999],
      direct: [0, 0.05], rattle: [0, 0], level: [0.02, 0.08],
    },
  },
  gong: {
    desc: 'Gong, a big flat tam-tam. A bronze plate struck with a soft beater. Its modes do not line up as harmonics, so it has a low pitch but no clear note: the note you write moves the lowest mode. Hit hard, the high sound swells up a moment later. Fitted to recordings of a large gong.',
    series: 'gong', pitched: true,
    head: { sharp: 1.2, bright: 0.6, comb: 0, noise: 0.1, vary: 0.2, seed: 5, velo: 3, felt: 8, hardKey: 0,
      bloom: 5, bloomVelo: 7, bloomRise: 0.3, bloomFall: 1.2, bloomFrom: 2500, bloomDrain: 25, bloomDrainBelow: 200 },
    count: 160, light: 0.5, lo: 14, hi: 45, cloud: 0.004, tilt: 1.5, warp: 1, spread: 0,
    t60: 25, decayKey: 0, damp: 0.01, release: 3,
    direct: 0, rattle: 0, level: 0.13,
    range: {
      'head.sharp': [0.8, 3], 'head.bright': [0.5, 0.8], 'head.comb': [0, 0], 'head.noise': [0, 0.3],
      'head.vary': [0, 0.5], 'head.seed': [1, 9999], 'head.velo': [1, 5], 'head.felt': [2, 8], 'head.hardKey': [0, 0],
      'head.bloom': [1, 15], 'head.bloomVelo': [4, 10], 'head.bloomRise': [0.15, 0.8], 'head.bloomFall': [0.5, 3], 'head.bloomFrom': [1000, 4000], 'head.bloomDrain': [0, 40], 'head.bloomDrainBelow': [150, 400],
      count: [100, 300], light: [0, 1], lo: [10, 25], hi: [30, 80], cloud: [0.001, 0.02], tilt: [0.5, 2], warp: [0.98, 1.02], spread: [0, 0.01],
      t60: [10, 40], decayKey: [0, 0], damp: [0, 0.05], release: [1, 6],
      direct: [0, 0.05], rattle: [0, 0], level: [0.08, 0.5],
    },
  },
  marimba: {
    desc: 'Marimba. Rosewood bars cut underneath so the overtones sit at 4 and 10 times the pitch, struck with yarn mallets over tuned tubes. Low notes are warm and ring a few seconds; high notes are short and dry. Fitted to recordings of a concert marimba.',
    // アイオワ大学のマリンバ(毛糸巻きのマレット、ff、C2〜C7)に寄せる(2026-10-14)。値はまだ見当
    series: 'bar', pitched: true,
    // 値は録音との差が小さくなるところを乱数で探した(250 回ずつ 2 回と 350 回)。差は山の強さ・基音と上の山の減り方・
    // 音域ごとの大きさを足したもの。高い音ほどマレットを硬く(hardKey を 100Hz から)、高い音を持ち上げる(trebleGain)。
    // どちらも無いと、C7 が録音より 28dB 小さかった。
    // 叩く場所(strike)はほぼ真ん中。録音の C2 は 4 倍の山が 32dB 弱く、真ん中を叩いた形だった
    head: { sharp: 0.64, bright: 0.6, comb: 0, noise: 0.02, vary: 0.2, seed: 7, velo: 2.22, felt: 0.3, hardKey: 0.11, hardFrom: 100 },
    count: 4, tilt: 0.06, warp: 1, spread: 0, tube: 0, trebleGain: 4.2, strike: 0.49,
    t60: 2.14, decayKey: 1.13, modeDecay: 1.25, damp: 0, release: 0.2,
    direct: 0, rattle: 0, level: 0.36,
    range: {
      'head.sharp': [0.6, 3], 'head.bright': [0.35, 0.8], 'head.comb': [0, 0.2], 'head.noise': [0, 0.1],
      'head.vary': [0, 0.5], 'head.seed': [1, 9999], 'head.velo': [1, 4], 'head.felt': [0, 3], 'head.hardKey': [0, 0.5],
      'head.hardFrom': [80, 300],
      count: [3, 4], tilt: [0, 1], warp: [0.99, 1.01], spread: [0, 0.005], tube: [0, 3], trebleGain: [0, 9], strike: [0.3, 0.5],
      t60: [1, 4], decayKey: [0.5, 1.5], modeDecay: [0.5, 1.6], damp: [0, 1], release: [0.1, 0.5],
      direct: [0, 0.05], rattle: [0, 0], level: [0.15, 0.6],
    },
  },
  vibraphone: {
    desc: 'Vibraphone. Aluminium bars tuned like a marimba, at 1, 4 and 10 times the pitch, struck with cord mallets over tubes. With the pedal down a note rings for many seconds, the overtones gone in the first moment. The motor, off by default, makes the level swell and dip. Fitted to recordings of a vibraphone with the motor off.',
    // アイオワ大学のビブラフォン(ペダルを踏んで伸ばした音、ff、F3〜F6)に寄せる(2026-10-14)。値はまだ見当
    series: 'bar', pitched: true,
    // 値は録音との差が小さくなるところを乱数で探した(300 回と 350 回)。差は山の強さ・基音と上の山の減り方・
    // 音域ごとの大きさを足したもの。叩く場所(strike)はほぼ真ん中に出た。共鳴管(tube)は 0 に出た
    head: { sharp: 0.43, bright: 0.63, comb: 0, noise: 0.01, vary: 0.2, seed: 13, velo: 0.51, felt: 0.47, hardKey: 0.08, hardFrom: 454 },
    count: 4, tilt: 0, warp: 1, spread: 0, tube: 0, trebleGain: 1.5, strike: 0.49,
    t60: 23, decayKey: 0.24, modeDecay: 1.16, damp: 0, release: 0.15,
    motor: 0, motorRate: 5,
    direct: 0, rattle: 0, level: 0.24,
    range: {
      'head.sharp': [0.2, 2], 'head.bright': [0.45, 0.8], 'head.comb': [0, 0.2], 'head.noise': [0, 0.05],
      'head.vary': [0, 0.5], 'head.seed': [1, 9999], 'head.velo': [0.5, 4], 'head.felt': [0, 3], 'head.hardKey': [0, 0.5],
      count: [3, 4], tilt: [0, 1], warp: [0.99, 1.01], spread: [0, 0.005], tube: [0, 2], trebleGain: [0, 9], strike: [0.3, 0.5],
      'head.hardFrom': [80, 600],
      t60: [8, 35], decayKey: [0, 0.4], modeDecay: [0.6, 1.6], damp: [0, 0.5], release: [0.08, 0.4],
      motor: [0, 0.8], motorRate: [2, 8],
      direct: [0, 0.03], rattle: [0, 0], level: [0.1, 0.4],
    },
  },
  glockenspiel: {
    desc: 'Glockenspiel. Plain steel bars, not cut, so the overtones fall between the harmonics and ring like small bells; struck with hard brass mallets. Bright, with a long, pure tail once the clang has gone. Fitted to recordings of orchestra bells.',
    // アイオワ大学のグロッケン(真鍮のマレット、ff、C6 と C7。C5 は山の並びが合わないので外した)に寄せる(2026-10-14)。値はまだ見当
    series: 'freebar', pitched: true,
    // 値は録音との差が小さくなるところを乱数で探した(300 回と 350 回)。差は山の強さ・基音と上の山の減り方・
    // 音域ごとの大きさを足したもの。物差しの録音が C6 と C7 の 2 音だけなので、ほかの音域はあてにならない
    head: { sharp: 0.2, bright: 0.94, comb: 0, noise: 0.02, vary: 0.2, seed: 17, velo: 1.8, felt: 4, hardKey: 0.28, hardFrom: 717 },
    count: 5, tilt: 0, warp: 1, spread: 0, trebleGain: 0, strike: 0.44,
    // 探した値は modeDecay 1.79、decayKey 0.42 だったが、C6 と C7 で基音まで速く消えた(1.5 秒で録音 -9dB、
    // こちら -17〜-22dB)。上の山は 5 本目(14.1 倍)だけ録音でも長く残り、1 本の modeDecay では揃わないので、間を取った
    t60: 9.7, decayKey: 0.1, modeDecay: 1.4, damp: 0, release: 0.3,
    direct: 0, rattle: 0, level: 0.21,
    range: {
      'head.sharp': [0.2, 1], 'head.bright': [0.7, 0.98], 'head.comb': [0, 0.2], 'head.noise': [0, 0.1],
      'head.vary': [0, 0.5], 'head.seed': [1, 9999], 'head.velo': [1, 4], 'head.felt': [0, 4], 'head.hardKey': [0, 1],
      count: [3, 5], tilt: [0, 1], warp: [0.98, 1.02], spread: [0, 0.01], trebleGain: [0, 9], strike: [0.1, 0.5],
      'head.hardFrom': [80, 1500],
      t60: [5, 18], decayKey: [0, 0.5], modeDecay: [0.6, 2.5], damp: [0, 0.2], release: [0.15, 0.6],
      direct: [0, 0.05], rattle: [0, 0], level: [0.08, 0.35],
    },
  },
  ride: {
    desc: 'Ride cymbal. A dense cloud of long, inharmonic modes struck by a stick tip.',
    series: 'cymbal', pitched: false, base: 300,
    head: { sharp: 0.5, bright: 0.84, comb: 0, noise: 0.25, vary: 0.4, seed: 19 },
    count: 140, lo: 1.1, hi: 38, tilt: 0.25, warp: 1, spread: 0, seed: 23,
    t60: 3.5, damp: 0.004, release: 0.6,
    direct: 0.04, rattle: 0, level: 0.06,
    // 失敗: ときどき縁寄りかカップ寄りに当たる
    spot: 0.1, flawSeed: 1,
    range: {
      'head.sharp': [0.3, 1.5], 'head.bright': [0.75, 0.95], 'head.comb': [0, 0.1], 'head.noise': [0.1, 0.5],
      'head.vary': [0.1, 0.8], 'head.seed': [1, 9999],
      count: [60, 200], lo: [1, 2], hi: [20, 45], tilt: [0.1, 0.5], warp: [0.9, 1.1], spread: [0, 0.05],
      seed: [1, 9999],
      t60: [2, 6], damp: [0, 0.02], release: [0.3, 1],
      direct: [0, 0.1], rattle: [0, 0], level: [0.03, 0.12],
      spot: [0, 0.4], flawSeed: [1, 9999],
    },
    macros: {
      ride: {
        desc: 'How much it sounds like a ride cymbal. 1 is the default ride. 0 leaves a short, dark, narrow cluster, closer to a small bell or a cowbell. Above 1 the wash grows longer and brighter. The number of resonators is set apart, by the steps.',
        min: 0, max: 2,
        neutral: {
          t60: 0.4, tilt: 1.5, hi: 6, lo: 1, damp: 0.1,
          'head.bright': 0.5, 'head.noise': 0,
        },
      },
    },
  },
};

/**
 * まとめて動かすパラメータ(マクロ)を当てる。パッチの `macros` に書いてあるものを使う。
 *
 * 1 本で中のパラメータをいくつか同時に動かす(2h の「外に出すパラメータ」)。
 * x = 0 で `neutral` の値、x = 1 でパッチの値、そのほかは直線で外へ伸ばす。
 * `levelDb` があれば、x = 0 と x = max での大きさの補正(dB)として、`macroLevel` に軸ごとに書く。
 * 音色を変えるための軸で、大きさまで変わってしまうのを打ち消すため。
 * 全体の範囲(MODAL_PARAMS の min と max)で止める。返すのは新しいパッチで、渡したものは変えない
 *
 * @param {object} def いまのパッチ。動かさないパラメータはここから持ってくる
 * @param {object} base 1 のときの値を持つパッチ(ふつうは MODAL_PATCHES のもの)
 * @param {string} name マクロの名前
 * @param {number} x 値
 */
export function applyMacro(def, base, name, x) {
  const m = base.macros && base.macros[name];
  const out = structuredClone(def);
  if (!m) return out;
  // 大きさの補正。軸ごとに持つので、ほかの軸の補正を消さない
  if (m.levelDb) {
    const db = x < 1 ? m.levelDb[0] * (1 - x) : m.levelDb[1] * (x - 1) / Math.max(1e-9, (m.max ?? 2) - 1);
    out.macroLevel = { ...(def.macroLevel || {}), [name]: Math.pow(10, db / 20) };
  }
  // 場所は `head.sharp` `body.1.gain` のように点で区切る。胴の山はスマートでも動かす(ギター)
  for (const [path, zero] of Object.entries(m.neutral)) {
    const ks = path.split('.');
    const key = ks[ks.length - 1];
    const one = ks.reduce((o, k) => o?.[k], base);
    const p = ks[0] === 'body' ? MODAL_BODY[key] : MODAL_PARAMS[key];
    let v = zero + x * (one - zero);
    if (p) v = Math.min(p.max, Math.max(p.min, v));
    let o = out;
    for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]];
    o[key] = v;
  }
  return out;
}

// 片持ちの棒(根元を固定した細い棒)の振動の比。ティンの倍音は整数比に乗らない
const TINE = [1, 6.267, 17.547, 34.386, 56.843, 84.913];
// 上の倍音ほど速く消える。叩いた瞬間の「キン」はここ
const TINE_DECAY = [1, 0.12, 0.05, 0.03, 0.02, 0.015];

// 削って揃えた棒(マリンバ、ビブラフォン)。裏を削って 1・4・10 倍に合わせてある。
// 4 本目は揃えていない。どれもアイオワ大学の録音で見えた位置(ビブラフォン F3 の 15.46 倍など。2026-10-14)
const TUNED_BAR = [1, 4, 10, 15.5];
// 削っていない金属の棒(グロッケン)。理屈の上の並び(1, 2.76, 5.40, 8.93)より上にずれていて、
// 録音の C6 と C7 の山の位置を、対数で真ん中に取った(C6: 3.15 6.26 9.80 14.13、C7: 2.95 5.57 8.75。2026-10-14)
const FREE_BAR = [1, 3.05, 5.9, 9.26, 14.1];
// 両端が自由な棒の、n 番目の振動の形の βL(曲げの振動)。叩いた場所でどの山がどれだけ鳴るかを決める
const BAR_BETA = [4.730, 7.853, 10.996, 14.137, 17.279];

/**
 * 両端が自由な棒の n 番目(0 から)の振動の形を、端から x(0〜1)のところで見た大きさ。端を 1 にそろえてある。
 * 真ん中(0.5)は 2 番目と 4 番目の節なので、そこを叩くと 4 倍の山(削って揃えた棒)が鳴らない
 */
function barShape(n, x) {
  const b = BAR_BETA[Math.min(n, BAR_BETA.length - 1)], bx = b * x;
  const sg = (Math.cosh(b) - Math.cos(b)) / (Math.sinh(b) - Math.sin(b));
  return Math.abs((Math.cosh(bx) + Math.cos(bx) - sg * (Math.sinh(bx) + Math.sin(bx))) / 2);
}

/** 棒の倍音の並び。録音と比べるときに、どこを測るかに使う(scripts/compare-refs.mjs) */
export const BAR_MODES = { bar: TUNED_BAR, freebar: FREE_BAR };

/** 鍵盤とハンマーの木の音。[Hz, 振幅, 秒]。高さに付いてこない */
const KNOCK = [[110, 1, 0.06], [290, 0.7, 0.04], [620, 0.5, 0.03], [1400, 0.35, 0.02]];

/**
 * パッチから表を作る。[倍率, 振幅, 減衰の倍率, 何番目の倍音か] が並んだ平らな配列。
 * 処理器へ渡すのはこれと、減衰などいくつかの数だけ。
 *
 * 弦の硬さ(stretch)は表に焼かない。音域で変わるので、鳴らすときに
 * 何番目の倍音かから計算する。そのために 4 つ目を持たせてある。
 * 4 つ目が負のものは高さに付いてこない共振器で、1 つ目が Hz、3 つ目が秒になる。
 */
export function modalTable(def) {
  const out = [];
  const r = rng(def.seed || 1);
  const warp = def.warp == null ? 1 : def.warp;
  const spread = def.spread || 0;
  const tilt = def.tilt == null ? 1 : def.tilt;
  const count = Math.max(1, Math.min(MODAL_MODES, def.count | 0 || 1));
  const push = (ratio, amp, dec, h = 0) => {
    let x = Math.pow(ratio, warp);
    if (spread) x *= 1 + spread * (r() * 2 - 1);
    out.push(x, amp, dec, h);
  };
  if (def.series === 'string') {
    const strings = Math.max(1, def.strings | 0 || 1);
    const per = Math.max(1, Math.floor(count / strings));
    for (let s = 0; s < strings; s++) {
      // 弦どうしを左右へ振り分ける。真ん中の弦はずらさない
      const c = strings === 1 ? 0 : (def.detune || 0) * (s / (strings - 1) - 0.5) * 2;
      const k = Math.pow(2, c / 1200);
      // 2 本目からは長く残す。はじめ速く落ちて、あとからゆっくり減る(2 段の減り方)
      const dec = s === 0 ? 1 : (def.after || 1);
      // 2 本目から下げたぶんを、弦の合計で割って足し戻す。全体の大きさは変えない
      const lv = s === 0 ? 1 : (def.afterLevel ?? 1);
      const share = 1 + (strings - 1) * (def.afterLevel ?? 1);
      for (let n = 1; n <= per; n++) {
        push(n * k, lv / (Math.pow(n, tilt) * share), dec, n);
      }
    }
  } else if (def.series === 'membrane') {
    for (let n = 0; n < count; n++) {
      const ratio = n < MEMBRANE.length ? MEMBRANE[n] : MEMBRANE[MEMBRANE.length - 1] * (1 + 0.08 * (n - MEMBRANE.length + 1));
      push(ratio, (0.5 + 0.5 * r()) / Math.pow(n + 1, tilt), 1 / (1 + 0.15 * n));
    }
  } else if (def.series === 'bar' || def.series === 'freebar') {
    // 棒。上の倍音ほど小さく(tilt)、速く消える(damp が高さの 2 乗で効く)。
    // tube は下の共鳴管。基音にだけ合わせてあるので、基音だけが強くなる
    const T = def.series === 'bar' ? TUNED_BAR : FREE_BAR;
    // 上の倍音が速く消えるのは、高さではなく何倍のところかで決まる。録音では、4 倍と 10 倍の山の長さが
    // 基音のそれぞれ 4 と 10 の modeDecay 乗分の 1 に乗った(ビブラフォン 1.2、マリンバ 1.0。2026-10-14)
    // strike は叩く場所。書いていなければ、どの山も同じだけ鳴らす
    for (let n = 0; n < Math.min(count, T.length); n++) {
      const at = def.strike == null ? 1 : barShape(n, def.strike);
      push(T[n], at * (n === 0 ? 1 + (def.tube || 0) : 1) / Math.pow(T[n], tilt), Math.pow(T[n], -(def.modeDecay || 0)));
    }
  } else if (def.series === 'kettle' || def.series === 'gong') {
    // ティンパニ(KETTLE)とドラ(GONG)。表は測ったままで、tilt は下の細かい倍音にだけ効く
    const TABLE = def.series === 'gong' ? GONG : KETTLE;
    // 軽くする(light、0〜1)。表は弱くて短いものから省き、細かい倍音は数を減らす。
    // 1 で表は 4 割、細かい倍音は 4 分の 1 になる。減らしたぶん細かい倍音を大きくして、帯域の大きさを保つ
    // (2026-10-14。重くても書き出して使えるが、軽くする手段はあってよい、と言われた)
    const light = Math.max(0, Math.min(1, def.light || 0));
    const nt = Math.min(count, TABLE.length);
    // 1/4 オクターブごとにいちばん強いものは残す。強さだけで選ぶと、弱い山しかない帯域がまるごと消えた
    const strong = TABLE.slice(0, nt).map((x, i) => [x[1] * Math.sqrt(x[2]), i]).sort((a, b) => b[0] - a[0]);
    const want = Math.max(1, Math.round(nt * (1 - 0.6 * light)));
    const keep = new Set(), bins = new Set();
    for (const [, i] of strong) {
      const bin = Math.round(4 * Math.log2(TABLE[i][0]));
      if (!bins.has(bin)) { bins.add(bin); keep.add(i); }
    }
    for (const [, i] of strong) if (keep.size < want) keep.add(i);
    for (let n = 0; n < nt; n++) {
      if (!keep.has(n)) continue;
      const [ratio, amp, dec] = TABLE[n];
      push(ratio, amp, dec);
    }
    // 表より上の細かい倍音。録音では主音の 5 倍あたりから上に、測りきれないほど詰まって並ぶ。
    // 表の 13 本だけだと 600Hz より上が録音より 25〜50dB 小さかった(2026-10-14)。
    // 位置は種で決め、上ほど詰める。上ほど小さく、速く消える。
    // 向きも種で決める。膜の形が倍音ごとに違うので、叩いた点と聞く点で、揺れの向きが揃わない。
    // 揃えると、叩いた瞬間に全部が重なって、録音より 6dB ほど尖った(2026-10-14)
    const lo = def.lo || 3.5, hi = Math.max(lo * 1.01, def.hi || 40);
    const full = Math.max(0, count - TABLE.length), nc = Math.round(full * (1 - 0.75 * light));
    const gc = nc > 0 ? Math.sqrt(full / nc) : 0;
    for (let n = 0; n < nc; n++) {
      // 膜の倍音は、高さに比例して詰まる(2 次元なので)
      const ratio = Math.sqrt(lo * lo + (hi * hi - lo * lo) * r());
      const sign = r() < 0.5 ? -1 : 1;
      push(ratio, gc * sign * (def.cloud ?? 0) * (0.3 + 0.7 * r()) * Math.pow(lo / ratio, tilt), (0.3 + 0.3 * r()) * Math.sqrt(lo / ratio));
    }
  } else if (def.series === 'tine') {
    // ティンの倍音。h は 0(弦の硬さでずらさない)
    for (let n = 0; n < Math.min(count, TINE.length); n++) push(TINE[n], 1 / Math.pow(TINE[n], def.tilt ?? 1), TINE_DECAY[n]);
    // トーンバー。ティンと同じ高さにわずかにずらして合わせた、長く鳴るもう 1 本。
    // ピアノの 2 本目の弦と同じく、detune(セント)・after(減り方の倍率)・afterLevel(大きさ)で持つ
    if ((def.afterLevel ?? 0) > 0) push(Math.pow(2, (def.detune || 0) / 1200), def.afterLevel, def.after || 1);
  } else {
    const lo = def.lo || 1, hi = Math.max(lo * 1.01, def.hi || 40);
    for (let n = 0; n < count; n++) {
      // 上ほど詰める。シンバルは上のほうが混んでいる
      const u = Math.pow(r(), 0.6);
      const ratio = Math.exp(Math.log(lo) + (Math.log(hi) - Math.log(lo)) * u);
      push(ratio, (0.3 + 0.7 * r()) / Math.pow(ratio / lo, tilt), 0.5 + r());
    }
  }
  if (def.knock) for (const [f, a, t] of KNOCK) out.push(f, a * def.knock, t, -1);
  return out;
}

/**
 * 1 音の余韻が −60dB まで落ちる秒。焼く側(renderBGM)が、どこまで焼けばよいかと、
 * ループの終わりをどれだけはみ出すかを知るためのもの。
 *
 * - released が true(d のある音): 離した時刻から数えた秒。離すと共振器は release 秒で落ちる
 * - released が false(d の無い音。ブラシやライド): 鳴らした時刻から数えた秒。共振器が自然に減りきるまで
 * - k(書いた音符の番号)と v を渡すと、その音符の値を返す。失敗(当たりどころのずれ、
 *   鳴らしそこね、となりの鍵盤など)が起きるかどうかを、鳴らすときと同じ計算で決めるので、
 *   焼いた WAV と鳴らした音の長さが同じになる。k が無いと、失敗でいちばん伸びる場合の上限を返す
 *
 * 焼く側で使うときの注意: ループの折り返しに要るのは最後の 1 音だけではない。
 * ループの終わりから tail ぶん手前より後に始まった音符を、ぜんぶ見ること
 * (早めに叩いたライドのように、手前で鳴り始めた長い音が、ループ点を越えて鳴っている)。
 *
 * 共振器の並びと減り方は、処理器と同じ modalModes で出す(計算は 1 つ)
 * @param {object} def パッチ(MODAL_PATCHES の形。compileModal を通す前でも後でもよい)
 * @param {number} [f] Hz。音程の無い楽器は省いてよい
 * @param {boolean} [released] d があるか
 * @param {number} [k] 書いた音符の番号
 * @param {number} [v] 強さ 0〜1(既定 0.8。鳴らすときと同じ)
 */
export function modalTail(def, f, released = false, k, v = 0.8) {
  const c = def.table ? def : compileModal(def);
  const sr = 48000;
  const vel = Math.max(0, Math.min(1, v));
  const f0 = sourOf(c, f || c.base) / (c.pitched && c.harmonic >= 2 ? c.harmonic : 1);
  // 失敗。k があればその音符で決め、無ければ伸びる側の場合を全部試す
  let cases;
  let lag = 0;
  if (k != null) {
    const fl = modalFlaws(c, { t: 0, f, k, d: released ? 1 : undefined }, vel, k, 0);
    cases = [[fl.t60k, fl.spot]];
    // となりの鍵盤と二度打ちは、少し遅れて鳴りはじめる
    for (const e of fl.extra) lag = Math.max(lag, e.t);
  } else {
    cases = [[1, 0]];
    if (c.spot > 0) cases.push([1.3, 1], [1, 2]);
    if (c.neighbor > 0 || c.double > 0) lag = 0.037;
  }
  let longest = 0;
  for (const [t60k, spot] of cases) {
    modalModes(c, f0, t60k, spot, sr, MODAL_MODES, MODAL_STRINGS,
      (s, fs, t) => { longest = Math.max(longest, t); },
      (n, fm, tt) => { longest = Math.max(longest, Math.max(0.005, tt)); });
  }
  // 離した音は release 秒で落ちる(それより早く消える共振器は、そのまま)
  let tail = released ? Math.min(longest, c.release ?? 0.15) : longest;
  // 響き線とびびりは、揺れの包絡が落ちるのを待つ(およそ 0.1 秒)
  if (c.rattle > 0 || c.buzz > 0 || c.loose > 0) tail += 0.1;
  return tail + lag;
}

/** 処理器へ渡す形にする。表を作るのはパラメータが動いたときだけ */
export function compileModal(def) {
  const h = def.head || {};
  return {
    table: modalTable(def),
    base: def.base || 220,
    head: {
      sharp: h.sharp ?? 2, bright: h.bright ?? 0.6, comb: h.comb ?? 0,
      noise: h.noise ?? 0, vary: h.vary ?? 0, seed: h.seed ?? 1,
      velo: h.velo ?? 1.5, hardKey: h.hardKey ?? 0, hardFrom: h.hardFrom ?? 261.63, felt: h.felt ?? 0, align: h.align ?? 0,
      grains: h.grains ?? 0, scatter: h.scatter ?? 0,
      bloom: h.bloom ?? 0, bloomVelo: h.bloomVelo ?? 4, bloomDrain: h.bloomDrain ?? 0, bloomDrainBelow: h.bloomDrainBelow ?? 300, bloomRise: h.bloomRise ?? 0.3, bloomFall: h.bloomFall ?? 1, bloomFrom: h.bloomFrom ?? 1000,
    },
    pitched: !!def.pitched, trebleGain: def.trebleGain ?? 0, tilt: def.tilt ?? 1, sour: def.sour ?? 0, sourSeed: def.sourSeed ?? 1,
    guide: def.series === 'string' ? (def.guide ?? 0) : 0,
    body: (def.body || []).map((pk) => ({ freq: pk.freq, gain: pk.gain, resonance: pk.resonance })), bodyLow: def.bodyLow ?? 0,
    strings: def.strings ?? 1, detune: def.detune ?? 0, after: def.after ?? 1, afterLevel: def.afterLevel ?? 1,
    stretch: def.stretch ?? 0, stretchKey: def.stretchKey ?? 0, bStretch: def.bStretch ?? 0, attackBend: def.attackBend ?? 0, attackBendTime: def.attackBendTime ?? 0.05, pickupAt: def.pickupAt ?? 0, pickupDepth: def.pickupDepth ?? 1, pickupPeak: def.pickupPeak ?? 2500, pickupPeakGain: def.pickupPeakGain ?? 0, decayKey: def.decayKey ?? 0,
    t60: def.t60 ?? 2, damp: def.damp ?? 0, mute: def.mute ?? 0, harmonic: def.harmonic ?? 0, release: def.release ?? 0.15,
    direct: def.direct ?? 0, rattle: def.rattle ?? 0, pickup: def.pickup ?? 0, pickupOffset: def.pickupOffset ?? 0,
    // 振れではなく振れの速さを出す(ティン)。並びで決まるのでパラメータにはしない
    speed: def.series === 'tine',
    width: def.width ?? 0, tremolo: def.tremolo ?? 0, tremoloRate: def.tremoloRate ?? 0,
    motor: def.motor ?? 0, motorRate: def.motorRate ?? 0,
    neighbor: def.neighbor ?? 0, double: def.double ?? 0, doubleSeed: def.doubleSeed ?? 1, buzz: def.buzz ?? 0, buzzSeed: def.buzzSeed ?? 1, buzzLevel: def.buzzLevel ?? 0.4, buzzRasp: def.buzzRasp ?? 1,
    slip: def.slip ?? 0, ghost: def.ghost ?? 0, splay: def.splay ?? 0, spot: def.spot ?? 0, flawSeed: def.flawSeed ?? 1,
    stringNoise: def.stringNoise ?? 0, openRing: def.openRing ?? 0, lift: def.lift ?? 0.3, click: def.click ?? 1, rush: def.rush ?? 0, care: def.care ?? 0,
    loose: def.loose ?? 0, looseFreq: def.looseFreq ?? 233, looseFrom: def.looseFrom ?? 0.3,
    sympathetic: def.sympathetic ?? 0, symTuning: def.symTuning === 'piano' || def.symTuning === 'bass' ? def.symTuning : 'guitar', keyNoise: def.keyNoise ?? 0, silent: def.silent ? 1 : 0, neck: def.neck ?? 0, snap: def.snap ?? 0, thumbBelow: def.thumbBelow ?? 0, thumbDull: def.thumbDull ?? 0.075, thump: def.thump ?? 0, thumpLen: def.thumpLen ?? 0.1, pullLevel: def.pullLevel ?? 1, pullLow: def.pullLow ?? 0, pullLowDull: def.pullLowDull ?? 0, pullKnock: def.pullKnock ?? 0, pullKnockLen: def.pullKnockLen ?? 0.008, thumbRelease: def.thumbRelease ?? 0, thumbBright: def.thumbBright ?? 0, thumbBrightFreq: def.thumbBrightFreq ?? 1800, thumbBox: def.thumbBox ?? 0, bendFollow: def.bendFollow ? 1 : 0, pullStop: def.pullStop ?? 0, pullBend: def.pullBend ?? 0, pullBuzz: def.pullBuzz ?? 0, pullBuzzTime: def.pullBuzzTime ?? 0.04, pullDamp: def.pullDamp ?? def.damp ?? 0, palm: def.palm ?? 0,
    roll: def.roll ?? 0, rollJitter: def.rollJitter ?? 0.15, rollVary: def.rollVary ?? 3, rollSeed: def.rollSeed ?? 1,
    level: (def.level ?? 0.5) * Object.values(def.macroLevel || {}).reduce((a, b) => a * b, 1),
  };
}

/**
 * 鳴らすところ。ノード 1 つに全部の声を通す。
 *
 * ```js
 * const m = new ModalSynth(ctx);
 * await m.load();
 * m.note(ctx.currentTime + 0.1, 'piano', 261.63, 0.7, 1.5);
 * ```
 */
export class ModalSynth {
  /**
   * @param {BaseAudioContext} ctx
   * @param {AudioNode} [dest] 省くと ctx.destination。部屋や響板はこの先に置く
   */
  constructor(ctx, dest) {
    this.ctx = ctx;
    this.dest = dest || ctx.destination;
    this.defs = {};
    for (const [k, d] of Object.entries(MODAL_PATCHES)) this.defs[k] = structuredClone(d);
    this.node = null;
  }

  async load() {
    if (this.node) return;
    const url = URL.createObjectURL(new Blob([MODAL_CODE], { type: 'application/javascript' }));
    await this.ctx.audioWorklet.addModule(url);
    const patches = {};
    for (const [k, d] of Object.entries(this.defs)) patches[k] = compileModal(d);
    this.node = new AudioWorkletNode(this.ctx, MODAL_NODE, {
      numberOfInputs: 0, outputChannelCount: [2], processorOptions: { patches },
    });
    // 2 本をそのまま左と右へ出す。揺れの無い音は半分ずつ入っているので、2 倍して
    // 1 本で出していたときと同じ大きさにする(エンジンの道では、置き方はエンジンが決める)
    this.gain = this.ctx.createGain();
    this.gain.gain.value = 2;
    this.node.connect(this.gain).connect(this.dest);
  }

  /** パッチを差し替える。鳴っている音は変えず、次の音から効く */
  setPatch(name, def) {
    this.defs[name] = def;
    if (this.node) this.node.port.postMessage({ patch: name, def: compileModal(def) });
  }

  /**
   * 1 音。
   * @param {number} t 鳴らす時刻(ctx の時計)
   * @param {string} name パッチの名前
   * @param {number} [freq] Hz。音程の無いパッチは省いてよい(base が使われる)
   * @param {number} [vel] 0〜1
   * @param {number} [dur] 秒。書くとそこで離す。省くと自然に消えるまで鳴る
   * @param {object} [head] この音だけ頭を変える(sharp, bright, comb, noise, vary, seed)
   */
  note(t, name, freq, vel = 0.8, dur, head) {
    const ev = { t, p: name, f: freq || 0, v: vel };
    if (dur != null) ev.d = dur;
    if (head) ev.h = head;
    this.notes([ev]);
  }

  /**
   * 右ペダル(ダンパーペダル)を踏む・放す。踏んでいるあいだは、離した音を止めず、
   * 共鳴弦(sympathetic)のダンパーのある弦も鳴る。音符と同じ並びに {t, p, ped: 1 か 0} で混ぜてもよい
   * @param {number} t 時刻(ctx の時計)
   * @param {string} name パッチの名前
   * @param {boolean} down 踏むなら true
   */
  pedal(t, name, down) {
    this.notes([{ t, p: name, ped: down ? 1 : 0 }]);
  }

  /** まとめて渡す。{t, p, f, v, d, h} の並び。右ペダルは {t, p, ped} */
  notes(list) {
    if (this.node) this.node.port.postMessage({ add: list });
  }

  /** 全部止める。10 ミリ秒で落とす */
  cut() {
    if (this.node) this.node.port.postMessage({ cut: true });
  }
}
