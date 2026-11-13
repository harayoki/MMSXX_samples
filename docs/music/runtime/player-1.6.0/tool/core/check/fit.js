// 測った大きさから、曲に書く倍率(`#gain`)を決める。
//
// 曲ごとに 10dB ばらついているので、並べて聞くと音量が飛ぶ
// (→ docs/LOUDNESS.md)。配信の目安へ寄せる倍率を、焼いた音から計算する。
//
// ---- 人が数を決めない ----
//
// 掛ける量は焼いて測らないと出ない。人が耳で合わせると、曲が増えるたびに
// 全部を並べ直すことになる。測れば 1 つに決まる。
//
// ---- ラウドネスだけを見ない ----
//
// 目標のラウドネスまで上げると、クレストの大きい曲が天井を越える。
// 実測では 6 曲のうち 2 曲(p88 と sprint、クレスト 20dB)がそうなる。
// リミッターを入れると音が変わるので、入れずに天井までで止める。
// 目標へ届かない曲は届かないまま出して、配信側に上げてもらう。
//
// ---- `sound/` には置かない ----
//
// エンジンの外部依存はゼロのままにする。測るのも決めるのも書き出す側の用事。

/** 配信の目安。動くので、使うときに見直す(docs/LOUDNESS.md) */
export const FIT_TARGET = { lufs: -14, peak: -1 };

/**
 * このリポジトリの曲を揃える先(2026-10-15)。配信より 2dB 低い。
 * サイトに置いて聞くぶんにはこちらが安全で、配信は小さい曲を上げてくれる。
 * 収める帯はふつう −17 から −15(docs/LOUDNESS.md)
 */
export const SONG_TARGET = { lufs: -16, peak: -1 };

/** `audio.volume` と `#gain` の上限。倍率で書くので境目は 8 のまま */
export const MAX_GAIN = 8;

/**
 * 掛ける量を決める。
 *
 * ```
 * 掛ける量 = min(目標 LUFS − 実測 LUFS, 天井 − 実測 true peak)
 * ```
 *
 * 小さいほうを採るので、天井を越えない。1ch で測ったものを渡すこと —
 * 左右へ振り分けるとピークが 3dB 下がるので、2ch で決めると 1ch のときに潰れる。
 *
 * @param {{lufs:number, truePeakDb:number}} level `measureLoudness()` が返すもの
 * @param {{lufs?:number, peak?:number}} [target] 目標。省くと配信の目安
 * @returns {{gain:number, db:number, by:'lufs'|'peak', wantDb:number, roomDb:number}}
 *   gain = 書く倍率(0〜8)。db = その dB。by = どちらで決まったか。
 *   wantDb = ラウドネスだけで見た量。roomDb = 天井までの余裕
 */
export function fitGain(level, target = {}) {
  const wantLufs = target.lufs ?? FIT_TARGET.lufs;
  const wantPeak = target.peak ?? FIT_TARGET.peak;
  // 無音は測れない(-Infinity が出る)。触らない
  if (!Number.isFinite(level.lufs) || !Number.isFinite(level.truePeakDb)) {
    return { gain: 1, db: 0, by: 'peak', wantDb: 0, roomDb: 0 };
  }
  const wantDb = wantLufs - level.lufs;
  const roomDb = wantPeak - level.truePeakDb;
  const db = Math.min(wantDb, roomDb);
  const by = wantDb <= roomDb ? 'lufs' : 'peak';
  const gain = Math.min(MAX_GAIN, Math.max(0, 10 ** (db / 20)));
  return { gain, db, by, wantDb, roomDb };
}

/**
 * 書いてある `#gain` の行を読む。無ければ null。
 *
 * 2 語目の印で、人が書いた行と道具が書いた行を見分ける。道具は自分の行だけを
 * 差し替える(→ docs/LOUDNESS.md)。
 *
 * @param {string} mml
 * @returns {{value:number, by:string|null, at:number, text:string}|null}
 *   at = 何行目か(0 から)。text = その行そのもの
 */
export function readGainLine(mml) {
  const lines = String(mml ?? '').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = GAIN_LINE.exec(lines[i]);
    if (!m) continue;
    const words = m[1].trim().split(/[ \t]+/).filter(Boolean);
    const value = Number(words[0]);
    if (!Number.isFinite(value)) continue;
    return { value, by: words[1] ? words[1].toLowerCase() : null, at: i, text: lines[i] };
  }
  return null;
}
const GAIN_LINE = /^[ \t*]*(?:\/\/)?[ \t*]*#[ \t]*gain[ \t]+(.*)$/i;

/**
 * 道具が書く行を作る。小数 2 桁で足りる —
 * 8 ビットの段より細かいので、書き方の刻みで音は変わらない。
 * @param {number} gain
 * @returns {string}
 */
export function gainLine(gain) {
  return `#gain ${round2(gain)} measured`;
}

/**
 * `#gain` を外した MML を返す。**測るときは外す。**
 * 外さないと、書いてある倍率の上にもう一度掛けることになる。
 * @param {string} mml
 * @returns {string}
 */
export function stripGain(mml) {
  return String(mml ?? '').split('\n').filter((l) => !GAIN_LINE.test(l)).join('\n');
}

/**
 * 道具の行を書き入れる。人が書いた行(印なし)には触らない。
 *
 * @param {string} mml
 * @param {number} gain 書く倍率
 * @returns {{mml:string, did:'added'|'changed'|'same'|'kept', was:number|null}}
 *   did = 何をしたか。kept = 人の行があったので触らなかった。
 *   was = 差し替える前の値(added と kept では null)
 */
export function putGain(mml, gain) {
  const src = String(mml ?? '');
  const got = readGainLine(src);
  if (got && got.by !== 'measured') return { mml: src, did: 'kept', was: null };
  const line = gainLine(gain);
  const lines = src.split('\n');
  if (!got) {
    // 頭に置く。指示行はどこに書いてもよいが、曲ぜんぶに掛かるものなので
    // 目に入るところへ置く
    lines.unshift(line);
    return { mml: lines.join('\n'), did: 'added', was: null };
  }
  const was = got.value;
  if (round2(gain) === round2(was)) return { mml: src, did: 'same', was };
  lines[got.at] = line;
  return { mml: lines.join('\n'), did: 'changed', was };
}

/**
 * 人が書いた値だと潰れるかを見る。
 *
 * 好みで小さめに書いてあるぶんには黙る。潰れるなら好みではなく間違いなので、
 * 強く言う(→ docs/LOUDNESS.md)。
 *
 * @param {number} value 人が書いた倍率
 * @param {{truePeakDb:number}} level `#gain` を外して測った大きさ
 * @param {number} [peak] 天井。省くと −1 dBTP
 * @returns {{over:boolean, atDb:number, safe:number}}
 *   over = 越えるか。atDb = その倍率での true peak。safe = 安全な上限
 */
export function checkGain(value, level, peak = FIT_TARGET.peak) {
  const atDb = level.truePeakDb + 20 * Math.log10(Math.max(1e-9, value));
  const safe = Math.min(MAX_GAIN, 10 ** ((peak - level.truePeakDb) / 20));
  return { over: atDb > peak, atDb, safe };
}

/**
 * `#gain` が書いてある曲を、実機のデータへ出そうとしているときの知らせ。
 *
 * ---- なぜ要るか ----
 *
 * `#gain` は出口の掛け算なので、書き出したデータには乗らない。入るのは `v` が
 * 出した値だけ。だから `#gain 4` と書いた曲を MGS へ出すと、警告も出ずに
 * 4 分の 1 の大きさのデータができる。**書いた人は気づけない。**
 *
 * 乗せる道も無い。MGS は MML テキストなので、乗せるとしたら全トラックの `v` を
 * 上げることになるが、`v` は 0〜15 で上限を越えられず、音源ごとに曲線も段数も
 * 違うので釣り合いが変わる。それが `#gain` を作った理由そのもの。
 *
 * 実機のデータごと持ち上げたいときは `@v+1`(書いた `v` に足す)を使う。
 *
 * @param {string[]} tracks 曲の MML(トラックごと)
 * @param {string} [where] 行き先の名前。知らせの中に出す
 * @returns {string|null} 知らせ 1 行。`#gain` が無ければ null
 */
export function gainNotice(tracks, where = 'the target data') {
  const got = (tracks || []).map(readGainLine).find(Boolean);
  if (!got || !(got.value > 0) || got.value === 1) return null;
  return `#gain ${got.value} does not reach ${where} (only v does). `
    + 'To lift the data itself, use @v+1';
}

/** 小数 2 桁。倍率はこれで足りる */
function round2(v) { return Math.round(v * 100) / 100; }
