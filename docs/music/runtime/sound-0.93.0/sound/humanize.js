// 揺らぎ(`@humanize`)。機械的なベタ打ちを避けて、1 音ずつ小さくばらす(2026-11-16)。
//
// ---- 何をするところか ----
//
// 値を引くだけのところ。音符を書き替えるのは `sound/audio.js` の `_scheduleTrack`、
// MML を読むのは `sound/mml.js`。ここは「名前と時刻から、いつも同じ値が出る」ことだけを受け持つ。
//
// ---- 引き方 ----
//
// 名前と時刻のハッシュで引く。走る数えあげ(カウンタ)にしない。
// くり返しと頭出しがあるので、カウンタだと途中から鳴らしたときにずれて、別の揺らぎになる。
// 時刻で引けば、頭から鳴らしても、途中から鳴らしても、書き出しても同じ値が出る。
//
// 時刻は、揺らぎで動かす前のものを渡す。動かしたあとの時刻で引くと、
// 自分の値で自分が変わる。
//
// 名前は、書かなければチャンネルの番号。`@humanize{… @seed pad}` と書くと、
// 同じ名前のチャンネルが同じ値を引く。和音を揃えたいときに使う。
//
// ---- タイミングだけ、引く場所が違う ----
//
// 音程と音量は音符 1 つにつき 1 回引く(音符の頭の時刻で引く)。
// タイミングは切れ目で引く。音符の始まりと終わりで 1 回ずつ、合わせて 2 回。
//
// 前の音符の終わりと、次の音符の始まりは同じ時刻なので、同じ値が出る。
// だから続いている音符は、何もしなくても切れ目を共有する。隙間も重なりも出ない。
// 休符が挟まれば前後の切れ目が別なので、休符が差を吸う。
//
// どの切れ目も正しい時刻に釘付けなので、ずれが積もらない。
// 長さだけが、隣り合う 2 つの差ぶん伸び縮みする。
//
// ---- 時刻は 1 マイクロ秒へ丸めてから引く ----
//
// 音符の終わり(`t + dur`)と、次の音符の始まり(`t`)は、コンパイルの中で
// 同じ足し算から出るので、いまはビットまで同じになる。それでも丸めておく。
// 切れ目を共有できないと揺らぎが成り立たないので、1 ビットの違いで割れないようにする。
//
// ---- 長さの揺らぎは持たない ----
//
// DAW には音の長さを振るものもあるが、こちらでは持たない。
// 早く離す(隙間)だけでは奏者の離し方にならず、遅く離す(重なり)も要る。
// 重なりは声を 1 本余分に使うので、1 チャンネルの中に収まらない。
// 重なりが要るなら 2 チャンネル書く、という話で、乱数の仕事ではない(2026-11-16)。

/** 時刻を丸める細かさ。1 秒をこの数で割ったところまで見る */
const TICK = 1e6;

/** 2 の 32 乗。32 ビットの上と下を分けるのに使う */
const WRAP = 4294967296;

/**
 * 揺らぎの種類と、書ける値。
 *
 * 幅は、書いた数をそのまま振れ幅にする。符号を書くと片側だけになる
 * (`timing 12` は前後へ 12ms、`timing +20` は遅れる側だけ 20ms)。
 * 下と上に直すのは MML を読むところ(`sound/mml.js`)で、ここへは直した値が来る。
 */
export const HUMANIZE = {
  version: '1.00',
  desc: 'Humanize: small, random differences from note to note, so that a part does not sound typed in. Each kind is written as one amount, the width of the sway. A plain number sways both ways, a signed one only that way (timing 12 is 12ms either side, timing +20 is up to 20ms late). The values are drawn from the name and the time, so a tune sounds the same every time it is played or rendered, and the same from any point in it. Written per channel, so a drum part can stay exact while the played parts sway.',
  params: {
    velocity: { unit: 'v', min: 0, max: 15, default: 0, desc: 'How far the loudness of each note sways, on the 0 to 15 scale of v. Fractions are allowed. Voices that only take whole steps of volume round it, so a chip part needs a wider sway than an analog one to be heard.' },
    pitch: { unit: 'cent', min: 0, max: 100, default: 0, desc: 'How far the pitch of each note sways, in cents. This is the out-of-tune of a player, not the out-of-tune of a chip; the steps a chip rounds its pitch to are its own and are left alone.' },
    timing: { unit: 'ms', min: 0, max: 200, default: 0, desc: 'How far the boundary between notes sways, in milliseconds. Each boundary is drawn from where it ought to be, so the sway never piles up and the tune never runs ahead or falls behind. A note and the one after it share their boundary, so no gap or overlap appears; only the length between two swayed boundaries stretches or shrinks.' },
    seed: { desc: 'A name shared with other channels that should sway together, for a chord spread over several parts. Left out, a channel sways on its own.' },
  },
};

/** 引ける種類。種を種類ごとに分けるので、同じ時刻でも音程と音量で別の値が出る */
export const KINDS = ['velocity', 'pitch', 'timing', 'steps'];

/**
 * 文字列を 32 ビットへ。FNV-1a。
 *
 * 外部依存ゼロなので自前で書く。短い名前しか来ないので、速さは問わない
 */
function hashName(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** 32 ビットをかき混ぜる。murmur3 の仕上げ。近い数を入れても離れた数が出る */
function mix(h) {
  h = (h ^ (h >>> 16)) >>> 0;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  h = Math.imul(h, 0xc2b2ae35) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

/** 種類ごとの種。名前から作るので、`KINDS` に足せばそのまま増やせる */
const KIND_SEED = new Map(KINDS.map((k) => [k, hashName('humanize:' + k)]));

/**
 * 名前と時刻から、0 以上 1 未満の値を引く。
 *
 * 同じ名前・同じ時刻・同じ種類なら、いつも同じ値が出る。
 *
 * @param {string|number} seed 名前。書かなければチャンネルの番号が来る
 * @param {number} t 時刻(秒)。揺らぎで動かす前のもの
 * @param {string} kind `KINDS` のどれか
 * @returns {number} 0 以上 1 未満
 */
export function pick(seed, t, kind) {
  const ks = KIND_SEED.get(kind);
  if (ks === undefined) throw new Error(`[ChpTnSnd] humanize: 知らない種類 "${kind}"`);
  // 時刻を 1 マイクロ秒へ丸めてから、32 ビット 2 つに割る。
  // 長い曲でも足りるように上と下へ分ける(1 時間で 36 億になり、32 ビットを越える)
  const tick = Math.round(t * TICK);
  const lo = tick >>> 0;
  const hi = Math.floor(tick / WRAP) >>> 0;
  let h = mix((hashName(String(seed)) ^ ks) >>> 0);
  h = mix((h ^ lo) >>> 0);
  h = mix((h ^ hi) >>> 0);
  return h / WRAP;
}

/**
 * 名前と時刻から、`lo` 以上 `hi` 以下の揺らぎを引く。
 *
 * 片側だけに振るときは、`lo` か `hi` のどちらかが 0 で来る。
 * 幅が無ければ 0 を返すので、書いていない曲はいままでと同じ音になる。
 *
 * @param {string|number} seed 名前
 * @param {number} t 時刻(秒)。揺らぎで動かす前のもの
 * @param {string} kind `KINDS` のどれか
 * @param {number} lo 下。書いた幅から MML を読むところが作る
 * @param {number} hi 上
 * @returns {number} `lo` から `hi` のあいだ
 */
export function sway(seed, t, kind, lo, hi) {
  if (!(hi > lo)) return 0;
  return lo + pick(seed, t, kind) * (hi - lo);
}

/**
 * 名前と時刻から、`lo` 以上 `hi` 以下の整数を引く。`@steps{random 3 9}` が使う。
 *
 * @param {string|number} seed 名前
 * @param {number} t 時刻(秒)
 * @param {string} kind `KINDS` のどれか
 * @param {number} lo 下(この数も出る)
 * @param {number} hi 上(この数も出る)
 * @returns {number} `lo` から `hi` の整数
 */
export function pickInt(seed, t, kind, lo, hi) {
  if (!(hi > lo)) return lo;
  return lo + Math.min(hi - lo, Math.floor(pick(seed, t, kind) * (hi - lo + 1)));
}

/**
 * 書いた幅を、下と上に直す。
 *
 * 符号を書けば片側だけ。`12` は前後へ 12、`+20` は上へ 20、`-2` は下へ 2。
 * MML を読むところが、書いた字に `+` か `-` があったかを `signed` で渡す。
 *
 * @param {number} amount 書いた数(0 以上。符号は `signed` と `amount` の向きで持つ)
 * @param {boolean} signed 書いた字に符号が付いていたか
 * @returns {[number, number]} 下と上
 */
export function rangeOf(amount, signed) {
  if (!amount) return [0, 0];
  if (!signed) {
    const w = Math.abs(amount);
    return [-w, w];
  }
  return amount > 0 ? [0, amount] : [amount, 0];
}
