// 音色やフレーズを、澄んだ PCM のまま焼いて使う音色(@dynpcm{…})。
//
// ---- 何のためにあるか ----
//
// @oplpcm{…}(sound/oplpcm.js)と同じ焼き方で、チップの方式へは落とさない。
// 音の粗さを足すためではなく、組み立てた音を 1 つの音として持つためのもの。
//
// - オーケストラヒットのように、何本も重ねた音を 1 つにまとめる
// - 打楽器を何本も重ね打ちした音を 1 つにする
// - 鳴らすときの重さを減らす。重ねた声の数だけ計算していたものが、波形 1 本の読み出しになる
//
// 声の数を気にせず作曲したいとき(機種の枠に縛られないとき)に使う。
//
// ---- 決めたこと ----
//
// - 書き方は @oplpcm{…} と同じ(from、rate、length、tempo)。from は音色の名前か $マクロ
// - 既定の細かさは 44100Hz。澄んだ音のため。下げれば軽くなる
// - o4c で焼いたとおりに鳴り、ほかの高さは読む速さを変える(音程とテンポが一緒に動く)
// - 焼いた値は 1.0 を超えてもそのまま持つ。重ねた音の和が大きくても、焼くところでは割れない
// - エンベロープは既定で flat。形は焼いた音が持っている
//
// 焼くところと鳴らすところは registerBaked の仕組みをそのまま使う(sound/audio.js)。

import { registerBaked, registerVoiceSyntax, WAVEFORMS, warn } from './mml.js';
import { bakeSourceOf } from './pcmbake.js';

/** 既定の細かさ(Hz) */
export const DYNPCM_DEFAULT_RATE = 44100;

/** 細かさの範囲(Hz)。下は焼く側(OfflineAudioContext)の下限 */
export const DYNPCM_RATE_MIN = 3000;
export const DYNPCM_RATE_MAX = 48000;

/**
 * 澄んだ PCM のまま焼く音色を登録する。
 *
 *     registerDynPCM('orchHit', { phrase: "v15 @{opn::brass} 'ceg'" });
 *     registerDynPCM('kickStack', { from: 'layerKickAir', length: 0.4, rate: 22050 });
 *
 * @param {string} name 名前
 * @param {{from?:string, phrase?:string, rate?:number, length?:number, tempo?:number,
 *          role?:string, note?:string}} opts
 *   from = 焼く元の音色の名前(o4c を 1 音焼く)。phrase = 代わりに焼く MML のフレーズ。
 *   rate = 細かさ(Hz、既定 44100、3000〜48000)。length = from のときに焼く長さ(秒、既定 1)。
 *   phrase の長さは書いた MML で決まる。tempo = phrase のテンポ(既定 120)。
 *   note = 説明(英語)。前に定型の説明が付く
 * @param {{overwrite?:boolean}} [flags]
 * @returns {number} 音色の番号
 */
export function registerDynPCM(name, opts = {}, flags = {}) {
  if (!opts.from && !opts.phrase) {
    throw new Error('[ChpTnSnd] ' + name + ': 焼く元の音色(from)か、フレーズ(phrase)がありません');
  }
  if (opts.from && opts.phrase) {
    throw new Error('[ChpTnSnd] ' + name + ': from と phrase はどちらか 1 つだけ書きます');
  }
  const want = opts.rate ?? DYNPCM_DEFAULT_RATE;
  const rate = Math.round(Math.max(DYNPCM_RATE_MIN, Math.min(DYNPCM_RATE_MAX, Number(want) || DYNPCM_DEFAULT_RATE)));
  if (rate !== want) {
    warn(`[ChpTnSnd] ${name}: @dynpcm の細かさは ${DYNPCM_RATE_MIN}〜${DYNPCM_RATE_MAX}Hz です(${want} → ${rate})`);
  }
  const length = opts.length > 0 ? Number(opts.length) : 1;
  const what = opts.phrase ? 'a phrase' : opts.from;
  const desc = `Baked from ${what} into clean PCM at ${rate}Hz, so a stacked sound plays as one `
    + 'and costs one voice. o4c plays it at the baked speed; other notes change the speed.'
    + (opts.desc ? ' ' + opts.desc : '');
  const id = registerBaked(name, {
    ...opts,
    desc,
    octaves: [4], step: 12,
    sampleRate: rate, loop: false, length,
    ...(opts.phrase ? { phrase: opts.phrase, tempo: opts.tempo } : {}),
  }, flags);
  WAVEFORMS[id].defaultEnv = 0;   // flat
  return id;
}

/**
 * MML の #voice で @dynpcm{…} と書けるようにする。
 *
 *     $hit = { v15 @{opn::brass} 'ceg' }
 *     #voice orchHit = @dynpcm{ from $hit }
 */
registerVoiceSyntax('dynpcm', (name, spec, opts) =>
  registerDynPCM(name, bakeSourceOf(name, spec, 'dynpcm'), opts));
