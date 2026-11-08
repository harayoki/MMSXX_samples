// MSX-AUDIO(Y8950)の ADPCM で鳴らす音色。
//
// ---- 何をしているか ----
//
// ほかの音色を 1 音だけ焼き、4 ビットの ADPCM-B に符号化して戻す。
// 戻すときはチップと同じ読み方をする(前の値と今の値の平均を、次の値まで持ち続ける)。
// 録音は持ち歩かない。持つのは作り方だけ(docs/ENGINE_TODO.md の 2i)。
//
// 焼くところと鳴らすところは `registerBaked` の仕組みをそのまま使う。
// ここが渡すのは、焼けた波形をチップの方式へ落とす処理(`post`)だけ。
// だから、この音源を外すときはこのファイルの import を消せば済む。
// `mml.js` と `audio.js` は ADPCM のことを知らない。
//
// ---- 決めたこと ----
//
// - 既定のレートは 8kHz。実機でどのレートが多く使われたかは分からなかった。
//   変換の道具が 4 / 8 / 11kHz を選ばせていたこと、標準のサンプル RAM が 32KB
//   (16kHz では 4 秒しか入らない)であることから、仮に置いている(2026-10-09)
// - レートは 3kHz から 16kHz まで。16kHz は規格の上限。下は焼く側
//   (OfflineAudioContext)が受けつける細かさの下限
// - 音量は 256 段の直線。実機のレジスタ 12h と同じ
// - 焼いた音が ADPCM の端を超えたとき、どこまで縮めて収めるかを fit(0〜1、既定 1)で決める。
//   端は焼いた値の ±2(HEADROOM)に当ててある。
//   1 はちょうど収める(割れない)、0 は縮めない(超えたぶんが割れる)。割れるのも特徴に
//   なりうるので、選べるようにした。間の値は、超えた量(dB)のうちその割合だけ縮める(2026-10-13)
// - 焼く高さは o4c。o4c で書けば焼いたときの速さで鳴り、ほかの高さは比で速さを変える。
//   実機の Delta-N と同じこと。音程とテンポが一緒に動く(テープの早回しと同じ)
// - 中身は音色 1 つでも、MML のフレーズでもよい。実機の ADPCM は録ったものを鳴らすだけなので、
//   和音もフレーズも入る。MML の中では、フレーズはマクロで名前を付けて from $名前 で指す。
//   @oplpcm{…} の中に MML を入れ子で書かせないため(2026-10-11)
// - フレーズのテンポは @oplpcm{…} の側に書く(tempo、既定 120)。マクロの中に t を書くと、
//   本文でそのマクロを呼んだトラックのテンポまで変わってしまう
// - 音符が終われば止まる(実機も START を落とせば止まる)
// - エンベロープは既定で flat。録音を鳴らす音源なので、形は焼いた音が持っている

import { registerBaked, registerVoiceSyntax, WAVEFORMS, warn } from './mml.js';
import { encodeADPCMB, decodeADPCMB } from './adpcmb.js';
import { bakeSourceOf } from './pcmbake.js';

/** 既定のレート(Hz) */
export const OPLPCM_DEFAULT_RATE = 8000;

/** レートの範囲(Hz)。上は規格の上限、下は焼く側の下限 */
export const OPLPCM_RATE_MIN = 3000;
export const OPLPCM_RATE_MAX = 16000;

/**
 * ADPCM の端に当てる大きさ。焼いた値(v15 を 1 とする)のこの倍までは、縮めずに収まる。
 * OPLL の打楽器を焼くと 1 音でも 1 を少し超えるので、6dB の余裕を取った(2026-10-13)
 */
const HEADROOM = 2;

/** 戻した波形を持ち続けて、この細かさ以上にする(チップは 49716Hz で読んでいる) */
const HOLD_TO = 48000;

/**
 * 波形を ADPCM-B に落として、チップと同じ読み方で戻す。
 *
 * チップは前の値と今の値の平均を出し、次の値が来るまで持ち続ける。
 * 持ち続けるところを整数倍の細かさで写すので、返す波形はレートの整数倍になる。
 *
 * @param {Float32Array} data 焼いた波形(-1..1。超えていれば fit に従って縮める)
 * @param {number} rate その細かさ(Hz)
 * @param {number} [fit=1] ±1 を超えたときに縮める割合(0〜1)
 * @returns {{data:Float32Array, sampleRate:number, bytes:number}}
 *   bytes = ADPCM にしたときの大きさ(実機のサンプル RAM で数える量)
 */
export function oplpcmRoundTrip(data, rate, fit = 1) {
  // ADPCM の端(±1)は、焼いた値の ±HEADROOM に当てる。焼いた値は v15 の大きさを 1 にしてあり、
  // チップの打楽器は 1 音でも 1 を少し超える。端を 1 に当てると、1 音だけで縮むか割れる
  let peak = 0;
  for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]) / HEADROOM);
  let g = 1 / HEADROOM;
  // 超えた量(peak 倍)のうち fit の割合だけ縮める。1 ならちょうど端に収まる
  if (peak > 1 && fit > 0) g *= Math.pow(peak, -Math.min(1, fit));
  const packed = encodeADPCMB(Float32Array.from(data, (v) => v * g));
  const dec = decodeADPCMB(packed);
  const hold = Math.max(1, Math.ceil(HOLD_TO / rate));
  const out = new Float32Array(data.length * hold);
  let prev = 0;
  for (let i = 0; i < data.length; i++) {
    const v = (dec[i] + prev) / 2 / 32768 * HEADROOM;
    prev = dec[i];
    out.fill(v, i * hold, (i + 1) * hold);
  }
  return { data: out, sampleRate: rate * hold, bytes: packed.length };
}

/**
 * ADPCM で鳴らす音色を登録する。
 *
 *     registerOPLPCM('oplpcmKick', { from: 'opll::kick(mid)', length: 0.3 });
 *     registerOPLPCM('oplpcmRiff', { phrase: 'l8 @{opll::piano} c d e', tempo: 150 });
 *
 * @param {string} name 名前
 * @param {{from?:string, phrase?:string, rate?:number, length?:number, tempo?:number,
 *          fit?:number, role?:string, note?:string}} opts
 *   from = 焼く元の音色の名前(o4c を 1 音焼く)。phrase = 代わりに焼く MML のフレーズ。
 *   rate = レート(Hz、既定 8000、3000〜16000)。length = from のときに焼く長さ(秒、既定 1)。
 *   phrase の長さは書いた MML で決まる。tempo = phrase のテンポ(既定 120)。
 *   fit = ±1 を超えたときに縮める割合(0〜1、既定 1)。0 なら縮めずに割れる
 *   note = 説明(英語)。前に定型の説明が付く
 * @param {{overwrite?:boolean}} [flags]
 * @returns {number} 音色の番号
 */
export function registerOPLPCM(name, opts = {}, flags = {}) {
  if (!opts.from && !opts.phrase) {
    throw new Error('[ChpTnSnd] ' + name + ': 焼く元の音色(from)か、フレーズ(phrase)がありません');
  }
  if (opts.from && opts.phrase) {
    throw new Error('[ChpTnSnd] ' + name + ': from と phrase はどちらか 1 つだけ書きます');
  }
  const want = opts.rate ?? OPLPCM_DEFAULT_RATE;
  const rate = Math.round(Math.max(OPLPCM_RATE_MIN, Math.min(OPLPCM_RATE_MAX, Number(want) || OPLPCM_DEFAULT_RATE)));
  if (rate !== want) {
    warn(`[ChpTnSnd] ${name}: ADPCM のレートは ${OPLPCM_RATE_MIN}〜${OPLPCM_RATE_MAX}Hz です(${want} → ${rate})`);
  }
  const length = opts.length > 0 ? Number(opts.length) : 1;
  const fit = opts.fit === undefined ? 1 : Math.max(0, Math.min(1, Number(opts.fit)));
  if (opts.fit !== undefined && fit !== Number(opts.fit)) {
    warn(`[ChpTnSnd] ${name}: @oplpcm の fit は 0〜1 です(${opts.fit} → ${fit})`);
  }
  const what = opts.phrase ? 'a phrase' : opts.from;
  const desc = `Baked from ${what} and played as 4-bit ADPCM-B at ${rate}Hz, `
    + 'the way the Y8950 (MSX-AUDIO) plays samples. o4c plays it at the baked speed; '
    + 'other notes change the speed.' + (opts.desc ? ' ' + opts.desc : '');
  const id = registerBaked(name, {
    ...opts,
    desc,
    octaves: [4], step: 12,
    sampleRate: rate, loop: false, length,
    ...(opts.phrase ? { phrase: opts.phrase, tempo: opts.tempo } : {}),
    vsteps: 256, vcurve: 'linear',
    post: (data, sr) => oplpcmRoundTrip(data, sr, fit),
  }, flags);
  WAVEFORMS[id].defaultEnv = 0;   // flat
  return id;
}

/**
 * MML の #voice で @oplpcm{…} と書けるようにする。
 *
 *     $hit = { @{opll::kick(mid)} c8 @{opll::snare} c8 }
 *     #voice hit = @oplpcm{ from $hit, tempo 150, rate 8000 }
 *     #voice kick8 = @oplpcm{ from opll::kick(mid), length 0.3 }
 *
 * from に音色の名前を書けば 1 音、$マクロを書けばそのフレーズを焼く。
 */
registerVoiceSyntax('oplpcm', (name, spec, opts) =>
  registerOPLPCM(name, bakeSourceOf(name, spec, 'oplpcm', ['fit']), opts));
