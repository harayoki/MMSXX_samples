// 重い音源を、鳴らす前に波形へ焼く(プロシージャルな PCM 音源)。
//
// 4 オペ FM のように計算の重いものを、先に波形にしておいて
// あとは鳴らすだけにする。鳴らす側は AudioBufferSource 一本になるので、
// いちばん遅い機械でも通る。
//
// 配るのは作り方(音色の定義)だけ。波形は持ち歩かず、要るときに焼く。
// ルール 4(全部テキスト)を壊さない。
//
// ---- 継ぎ目をゼロにする ----
//
// 生の録音ではなくプロシージャルなので、継ぎ目は作れる。
// FM の出す波は、変調側の比が整数なら基本周期でぴったり繰り返す。
// だから伸ばすところを基本周期の整数倍で切れば、輪の継ぎ目に段差が出ない。
//
// ただし「1 周期ぶんのサンプル数」はふつう整数にならない(44100Hz の 440Hz は
// 100.227 サンプル)。そこでサンプル数のほうを整数に丸め、
// 焼けた実際の高さを覚えておく。ずれは再生速度で戻す。
//
// 周期を長くとるほど丸めの誤差は小さくなるので、最低の長さを決めておく。

/**
 * 輪の最短の長さ(サンプル)。
 *
 * 繰り返す音では、短いほど丸めの誤差が音程のずれになるので下げすぎない。
 * 繰り返さない音をわざと輪にするときは、これがつまみになる —
 * 継ぎ目の段差が輪の回転数で鳴るので、`sampleRate / minLoop` がその雑音の高さ。
 */
export const MIN_LOOP = 1024;

/**
 * 音色が基本周期で繰り返すかを調べる。
 *
 * 比が全部整数なら 1 周期。3.5 のように半端でも、2 倍すれば整数になるなら 2 周期。
 * どうやっても整数にならないもの(7.01 など)は繰り返さないので、輪にできない。
 *
 * @param {number[]} ratios オペレータの周波数比
 * @param {number} [maxM=8] ここまで試す
 * @returns {number} 何周期で繰り返すか。0 なら繰り返さない
 */
export function periodMultiple(ratios, maxM = 8) {
  for (let m = 1; m <= maxM; m++) {
    let ok = true;
    for (const r of ratios) {
      const v = r * m;
      if (Math.abs(v - Math.round(v)) > 1e-6) { ok = false; break; }
    }
    if (ok) return m;
  }
  return 0;
}

/**
 * 輪の長さを決める。
 *
 * 基本周期の整数倍で、かつ `MIN_LOOP` 以上になる長さを選ぶ。
 * サンプル数は整数に丸めるので、焼けた高さは狙いから少しずれる。
 * そのぶんは再生速度で戻すので、返り値の `bakedFreq` を覚えておくこと。
 *
 * @param {number} freq 狙いの高さ(Hz)
 * @param {number} sampleRate
 * @param {number} m 何周期で繰り返すか(periodMultiple の値)
 */
export function loopPlan(freq, sampleRate, m = 1, minLoop = MIN_LOOP) {
  const one = sampleRate * m / freq;              // m 周期ぶんのサンプル数(小数)
  const times = Math.max(1, Math.ceil(minLoop / one));
  const samples = Math.round(one * times);
  return {
    samples,
    // 丸めたあと、この波形が実際に持っている高さ
    bakedFreq: sampleRate * m * times / samples,
    cents: 1200 * Math.log2(sampleRate * m * times / samples / freq),
  };
}

/**
 * MIDI 番号 → Hz。69 が A4 = 440Hz
 * @param {number} n MIDI のノート番号
 * @returns {number} Hz
 */
export const midiToFreq = (n) => 440 * Math.pow(2, (n - 69) / 12);

/**
 * 焼く高さの一覧を作る。
 *
 * 既定は 12 音ぜんぶ。オクターブを絞れば数が減る。
 * ここに無い高さは、いちばん近いものを再生速度で寄せて出す
 * (数半音までなら気にならない。離れると別の音になるが、そこは許容)。
 *
 * @param {{octaves?:number[], step?:number}} [o]
 *   octaves = 焼くオクターブ(既定 2..6)。step = 何半音おきか(既定 1 = 全部)
 * @returns {number[]} MIDI 番号
 */
export function pitchSet(o = {}) {
  const octaves = o.octaves ?? [2, 3, 4, 5, 6];
  const step = Math.max(1, o.step ?? 1);
  const out = [];
  for (const oct of octaves) {
    for (let i = 0; i < 12; i += step) out.push((oct + 1) * 12 + i);
  }
  return out;
}

/**
 * OPM のエンベロープの速さ(0〜31)から、端から端まで動く秒数のおよその値。
 *
 * 実機は 55930Hz で回り、3 サンプルごとにエンベロープを進める。速さ r(= 2 × 値)は
 * 4 上がるごとに倍の速さになる。r = 40 で約 0.11 秒、r = 16 で約 7 秒。
 * 段取りの長さを見積もるためのもので、鳴らす音には使わない
 */
function opmRateSec(v) {
  if (!(v > 0)) return Infinity;
  const r = Math.min(63, v * 2);
  return 1023 * 3 * Math.pow(2, 11 - r / 4) / 55930;
}

/** OPM の DT2(0〜3)が掛ける比。0 / 600 / 781 / 950 セント */
const OPM_DT2_RATIO = [1, Math.pow(2, 600 / 1200), Math.pow(2, 781.25 / 1200), Math.pow(2, 950 / 1200)];

/**
 * 音色の中身を、段取りが読める形(比と秒数)にそろえる。
 *
 * 2 オペの FM や手で書いた段取りは、はじめから `{ ratio, sl, ar, dr }` で持っている。
 * OPM の音色はレジスタの値(`mul` `ar` `d1r` `d1l` …)で持っているので、ここで読み替える。
 * 読み替えずに渡すと長さが NaN になり、焼けないまま元の音色で鳴り続けていた
 * (bakedBrass が一度も焼けていなかった。2026-10-10)。
 *
 * DT1 は比に入れない。わずかなずれなので、入れると繰り返さない波とみなして
 * 輪の継ぎ目を諦めることになる。
 *
 * @param {{ops:object[]}} patch
 * @returns {{ops:{ratio:number,sl:number,ar:number,dr:number}[]}}
 */
export function bakeOps(patch) {
  return { ops: patch.ops.map((x) => {
    if (x.ratio !== undefined) return x;
    const ratio = (x.mul > 0 ? x.mul : 0.5) * OPM_DT2_RATIO[(x.dt2 ?? 0) & 3];
    // 2 つめの減衰が無く、1 つめの減衰が底まで行かなければ、音は残る
    const sl = (x.d2r ?? 0) === 0 && (x.d1l ?? 0) < 15 ? 1 - (x.d1l ?? 0) / 15 : 0;
    // 上がりは減衰よりずっと速い。減衰の 1/8 で見積もる
    const ar = x.ar >= 31 ? 0 : Math.min(2, opmRateSec(x.ar) / 8);
    // 1 つめの減衰は、全体のうち d1l(1 段 3dB、96dB 中)のぶんだけ動く
    const dr = Math.min(4, opmRateSec(x.d1r) * Math.min(1, ((x.d1l ?? 0) * 3) / 96));
    return { ratio, sl, ar, dr };
  }) };
}

/**
 * 焼く段取りを立てる(まだ焼かない)。
 *
 * 何をどれだけ焼くかがここで全部決まるので、焼く前に大きさが分かる。
 *
 * @param {{ops:{ratio:number,sl:number,ar:number,dr:number}[]}} patch
 * @param {{sampleRate?:number, octaves?:number[], step?:number, tail?:number,
 *          loop?:boolean, length?:number, minLoop?:number}} [o]
 *   loop = 輪にするか(書かなければ、音が残るなら輪にする)。length = 頭の長さ(秒)
 */
export function bakePlan(patch, o = {}) {
  const sampleRate = o.sampleRate ?? 22050;
  const m = periodMultiple(patch.ops.map((x) => x.ratio));
  const sustains = patch.ops.some((x) => x.sl > 0);

  // 輪にできない音を輪にしてもよい。断らない。
  // 繰り返さない波(半端な比、重ねた別々の音)を輪にすると継ぎ目に段差が出る。
  // その段差は輪の回転数で鳴る周期的な雑音になる — つまり
  // `sampleRate / 輪の長さ` の高さで唸る。それはそれで音源なので、
  // 何が起きるかだけ伝えて、選ぶのは作る人に任せる。
  //
  // 逃げ道は 2 つ。頭の中で減衰しきるようにすれば輪が要らない。
  // あるいは輪の長さで唸りの高さを決める(こちらは狙って使う道)。
  const notes = [];
  const loop = o.loop ?? sustains;          // 段が残るなら輪にする
  const clean = m > 0;                      // 継ぎ目が綺麗になるか
  const minLoop = o.minLoop ?? MIN_LOOP;
  if (loop && !clean) {
    notes.push('繰り返さない波を輪にします。継ぎ目の段差が '
      + (sampleRate / minLoop).toFixed(0) + 'Hz あたりで唸ります'
      + '(輪の長さで高さが変わります)。嫌なら sl を 0 にして頭の中で減衰しきってください');
  }
  if (!loop && sustains) {
    notes.push('段が残っているのに輪にしないので、途中で切れます');
  }

  // 頭 = いちばん遅い段が落ち着くまで。減衰しきる音なら、これで全部
  // 長さを言われたらそれに従う(録音のように 1 回鳴らしきる音は、エンベロープでは決まらない)
  const attack = o.length > 0 ? o.length
    : patch.ops.reduce((a, x) => Math.max(a, x.ar + x.dr), 0) + 0.02;
  const jobs = pitchSet(o).map((note) => {
    const freq = midiToFreq(note);
    // 繰り返さない波は 1 周期ぶんの基準が無いので、最短の長さで切る
    const plan = loop ? loopPlan(freq, sampleRate, clean ? m : 1, minLoop) : null;
    const attackSamples = Math.ceil(attack * sampleRate);
    return {
      note, freq,
      bakedFreq: plan ? plan.bakedFreq : freq,
      cents: plan ? plan.cents : 0,
      attackSamples,
      loopSamples: plan ? plan.samples : 0,
      totalSamples: attackSamples + (plan ? plan.samples : 0),
    };
  });
  const total = jobs.reduce((a, j) => a + j.totalSamples, 0);
  return {
    sampleRate, loop, clean, periods: m, attack, notes,
    seamHz: loop && !clean ? sampleRate / (o.minLoop ?? MIN_LOOP) : 0,
    jobs,
    bytes: total * 2,                 // 16 ビットにしたときの大きさ
    seconds: total / sampleRate,
  };
}

/**
 * #voice の @oplpcm{…} や @dynpcm{…} の中身を、焼く音色の指定へ直す。
 *
 * 書けるのは from、rate、length、tempo。from は音色の名前なら 1 音(o4c)を焼き、
 * $マクロならそのフレーズを焼く(mml.js が `{ macro, mml }` にして渡す)。
 * length は音色を焼くときだけ書ける。フレーズの長さは書いた MML で決まる。
 *
 * @param {string} name 音色の名前(知らせに使う)
 * @param {object} spec mml.js が読んだ中身
 * @param {string} word 書き方の語(oplpcm など。知らせに使う)
 * @param {string[]} [more] その書き方だけが受けるもの(@oplpcm の fit など)
 * @returns {{from?:string, phrase?:string, rate?:number, length?:number, tempo?:number}}
 */
export function bakeSourceOf(name, spec, word, more = []) {
  const { from, ...rest } = spec;
  for (const k of Object.keys(rest)) {
    const ok = ['rate', 'length', 'tempo', ...more];
    if (!ok.includes(k)) {
      throw new Error(`[ChpTnSnd] MML: 音色 "${name}" の @${word} に "${k}" は書けません(from ${ok.join(' ')})`);
    }
  }
  const src = (from && typeof from === 'object') ? { phrase: from.mml } : { from };
  if (src.phrase && rest.length !== undefined) {
    throw new Error(`[ChpTnSnd] MML: 音色 "${name}" の @${word} の length は、from に音色を書いたときだけです`
      + '(フレーズの長さは書いた MML で決まります)');
  }
  return { ...rest, ...src };
}
