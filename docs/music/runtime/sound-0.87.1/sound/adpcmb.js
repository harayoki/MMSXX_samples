// ADPCM-B の符号化と復号。Y8950(MSX-AUDIO)の ADPCM がこの方式。
//
// ---- なぜ要るか ----
//
// MSX-AUDIO の ADPCM で鳴らす音は、録音を持ち歩かずにプロシージャルに作る。
// 焼いた波形を一度ここで 4 ビットに符号化し、チップと同じ復号で鳴らすと、
// 粗さまで実機に寄る(docs/ENGINE_TODO.md の 2i)。
//
// OPNA のリズム(sound/opnarhythm.js)の ADPCM-A とは別の方式。
// A は刻みを 49 個の表から選ぶが、B は刻みを毎回掛け算で動かす。
//
// ---- 出どころ ----
//
// 復号は emu8950(Mitsutaka Okazaki、MIT)の update_output を読んで書き直した。
// https://github.com/digital-sound-antiques/emu8950
// 刻みに掛ける表は、emu8950 が ymdeltat.c(Tatsuyuki Satoh)から取ったもの。
// 符号化は復号を裏返して作った。どのエミュレータにも無い。
//
// ---- 決めたこと ----
//
// - 1 バイトに 2 サンプル。上位の 4 ビットが先(emu8950 が読む順)
// - 符号化は、チップと同じ復号をその場で回しながら次の 4 ビットを選ぶ。
//   誤差が積もらない
// - 復号の 1 歩は、処理器の中(文字列のコード)でもそのまま使えるように、
//   外のものを参照しない関数にしてある。`ADPCMB_CODE` がその文字列

/**
 * 復号の 1 歩。`st` は `{ out, diff }`(初めは `{ out: 0, diff: 127 }`)。
 * 4 ビットを 1 つ受け取って `st` を進め、新しい出力(-32768..32767)を返す。
 *
 * @param {{out:number, diff:number}} st
 * @param {number} n 4 ビット(0..15)。8 のビットが符号
 * @returns {number}
 */
export function adpcmbStep(st, n) {
  // 刻みに掛ける数(÷64)。下 3 ビットで引く。外を参照しないよう、中に持つ
  const SCALE = [57, 57, 57, 57, 77, 102, 128, 153];
  const d = (st.diff * ((n & 7) * 2 + 1)) >> 3;
  let out = (n & 8) ? st.out - d : st.out + d;
  out = out < -32768 ? -32768 : out > 32767 ? 32767 : out;
  let diff = (st.diff * SCALE[n & 7]) >> 6;
  diff = diff < 127 ? 127 : diff > 0x5fff ? 0x5fff : diff;
  st.out = out;
  st.diff = diff;
  return out;
}

/** 処理器の中へ埋めるときの文字列。`adpcmbStep` が定義される */
export const ADPCMB_CODE = adpcmbStep.toString();

/** 復号の初めの状態 */
export function adpcmbState() {
  return { out: 0, diff: 127 };
}

/**
 * 4 ビットの並び(1 バイトに 2 つ、上位が先)を、16 ビットの値へ戻す。
 *
 * @param {Uint8Array} bytes
 * @returns {Int16Array} バイト数の 2 倍の長さ
 */
export function decodeADPCMB(bytes) {
  const st = adpcmbState();
  const out = new Int16Array(bytes.length * 2);
  for (let i = 0; i < bytes.length; i++) {
    out[i * 2] = adpcmbStep(st, bytes[i] >> 4);
    out[i * 2 + 1] = adpcmbStep(st, bytes[i] & 15);
  }
  return out;
}

/**
 * 波形を 4 ビットに符号化する。
 *
 * 1 サンプルごとに、今の復号の状態から 16 通りのうち目標にいちばん近いものを選ぶ。
 * 刻みは選んだ 4 ビットで決まるので、選ぶたびに復号を 1 歩進めて状態を合わせる。
 * サンプル数が奇数なら、最後の下位 4 ビットは 0(上向きのいちばん小さい一歩)で埋める。
 *
 * @param {ArrayLike<number>} samples -1..1 の数
 * @returns {Uint8Array} サンプル数の半分(切り上げ)の長さ
 */
export function encodeADPCMB(samples) {
  const st = adpcmbState();
  const out = new Uint8Array(Math.ceil(samples.length / 2));
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    const target = Math.round(v * 32767);
    const n = pick(st, target);
    adpcmbStep(st, n);
    if (i & 1) out[i >> 1] |= n;
    else out[i >> 1] = n << 4;
  }
  return out;
}

/** 今の状態から、出力が `target` にいちばん近くなる 4 ビットを選ぶ */
function pick(st, target) {
  const sign = target < st.out ? 8 : 0;
  const want = Math.abs(target - st.out);
  // 一歩の大きさは diff × (2q + 1) ÷ 8。いちばん近い q を求めてから前後を比べる
  let q = Math.round((want * 8 / st.diff - 1) / 2);
  q = q < 0 ? 0 : q > 7 ? 7 : q;
  let best = q, err = Infinity;
  for (let k = Math.max(0, q - 1); k <= Math.min(7, q + 1); k++) {
    // 端で頭打ちになるぶんも含めて比べる
    const d = (st.diff * (k * 2 + 1)) >> 3;
    const e = Math.abs(want - Math.min(d, sign ? st.out + 32768 : 32767 - st.out));
    if (e < err) { err = e; best = k; }
  }
  return sign | best;
}
