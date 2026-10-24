// 全体に掛けるエフェクト(マスターエフェクト)。曲の出口の手前に、並べた順に通す。
//
// ---- 何があるか ----
//
// - フィルタ。`sound/filter.js` の FILTERS と同じもの(lowpass・highpass など)。
//   `@f` と同じ処理器で回す。全体だけ BiquadFilterNode にすると、同じ設定でも
//   置き場所で鳴り方が変わる(docs/FILTER.md の「置き場所と並べ方」)
// - echo。返りがループの中のローパスを毎回通るので、返るたびに暗くなる。
//   `analog` のパッチの delay と同じ計算
// - reverb。部屋の響き。響きの波形はその場で作る(ノイズが少しずつ小さくなるもの)。
//   録音した響きを持たないので、外部依存ゼロのまま。種を決めてあるので、
//   鳴らすときも書き出すときも同じ響きになる
// - wavestep と crush。波形を刻んで粗くする(2026-10-19)。下の CHIP_CODE を見る
// - tube・transformer・tape。古い機材を通したような色付け(2026-10-20)。
//   中身はそれぞれ sound/fxtube.js・sound/fxtransformer.js・sound/fxtape.js
// - compressor・limiter・saturate。曲の仕上げ(2026-10-20)。名前つきの組み合わせは
//   MASTER_PRESETS。効果音のあいだ BGM を下げるダッキングはゲームの側のもので、
//   エフェクトの並びには入れない(DUCKING)
// - loudness。聴く人が音量を下げたら、低音と高音を持ち上げる(2026-10-19)。
//   昔のアンプのラウドネスボタンを、音量に合わせて自動で効かせるもの。
//   下の LOUDNESS を見る
//
// ---- どこから掛けるか ----
//
// MML なら指示行の `#fx`(`#fx echo @l 8 @feedback 0.5`)。曲が名乗るものなので、
// 曲を替えればその曲のものになる。JS からは `setMasterEffects()`。
// 2 つは別に持ち、両方を通す。曲の `#fx` が先で、JS のぶんがあと。
// JS のぶんは曲を替えても残る(2026-10-17)。

import { TUBE_FX, TUBE_NODE, TUBE_CODE } from './fxtube.js';
import { TRANSFORMER_FX, TRANSFORMER_NODE, TRANSFORMER_CODE } from './fxtransformer.js';
import { TAPE_FX, TAPE_NODE, TAPE_CODE } from './fxtape.js';
import { NOISEFILL_FX, NOISEFILL_NODE, NOISEFILL_CODE } from './fxnoisefill.js';
import { DENOISE_FX, DENOISE_NODE, DENOISE_CODE } from './fxdenoise.js';
import { SPECTRALGATE_FX, SPECTRALGATE_NODE, SPECTRALGATE_CODE } from './fxspectralgate.js';

/**
 * 古い機材の色付け(真空管・トランス・テープ)。1 つずつ別のファイルに持ち、
 * どれも処理器 1 つで、作るときに値を渡す。種類の名前 → 処理器(2026-10-20)
 */
export const COLOR_WORKLETS = {
  tube: { node: TUBE_NODE, code: TUBE_CODE },
  transformer: { node: TRANSFORMER_NODE, code: TRANSFORMER_CODE },
  tape: { node: TAPE_NODE, code: TAPE_CODE },
  // 色付けではないが、作るときに値を渡す処理器 1 つという形が同じなので、ここに並べる(2026-10-24)
  noisefill: { node: NOISEFILL_NODE, code: NOISEFILL_CODE },
  denoise: { node: DENOISE_NODE, code: DENOISE_CODE },
  spectralgate: { node: SPECTRALGATE_NODE, code: SPECTRALGATE_CODE },
};

/** echo の処理器の名前 */
export const ECHO_NODE = 'mmsxx-echo';

/** echo の間隔の上限(秒)。遅れ線はこの長さで取る */
const ECHO_MAX = 2;

/**
 * 全体に掛けるエフェクトのうち、フィルタでないもの。
 * フィルタは FILTERS(sound/filter.js)の種類をそのまま書く。
 *
 * どれも音色と同じく、絞り込みの語(tags)と開発の状態(dev)を持つ(2026-10-20)。
 * dev の語は sound/mml.js の DEV_MARKS。`wip` は作業中で、鳴るがまだ手を入れる。
 * 何も付けていないものは、まだ見直していない(確定の `done` とは限らない)
 */
export const MASTER_FX = {
  ...TUBE_FX,
  ...TRANSFORMER_FX,
  ...TAPE_FX,
  ...NOISEFILL_FX,
  ...DENOISE_FX,
  ...SPECTRALGATE_FX,
  echo: {
    tags: ['delay'], dev: [],
    desc: 'Echo. The sound comes back again and again, a little darker each time, like a tape or analog delay. From JS, l can stand in for time: a note length such as 8 or "8.", worked out from the tempo of the tune that is playing and again whenever the tune changes. It does not follow tempo changes inside a tune.',
    params: {
      time: { live: true, unit: 's', min: 0.01, max: ECHO_MAX, default: 0.25, desc: 'Seconds between repeats. It does not follow the tempo, so work it out from the tempo: an eighth note at 120 BPM is 0.25.' },
      feedback: { live: true, min: 0, max: 0.95, default: 0.4, desc: 'How much of each repeat goes round again. 0 gives a single repeat. Near 0.95 the repeats last a long time.' },
      mix: { live: true, min: 0, max: 1, default: 0.3, desc: 'How loud the repeats are against the dry sound. The dry sound stays at full level.' },
      tone: { live: true, unit: 'Hz', min: 200, max: 20000, default: 4000, desc: 'Cutoff of a gentle low-pass inside the loop. Every repeat passes it again, so the repeats grow darker one by one.' },
      cross: { live: false, min: 0, max: 1, default: 0, desc: 'How much of each repeat moves to the other side. 0 keeps every repeat where the sound was. 1 is a ping-pong echo: the repeats bounce left, right, left. The repeats keep the same loudness heard in stereo; summed to mono they get up to 3 dB quieter at 1. A mono sound is spread to both sides first. When the output is mono, it does nothing.' },
    },
  },
  reverb: {
    tags: ['space'], dev: [],
    desc: 'Reverb. The ring of a room after the sound, made from noise that fades away.',
    params: {
      time: { live: false, unit: 's', min: 0.1, max: 10, default: 1.5, desc: 'Seconds for the ring to fade by 60 dB. Small rooms are under 1, halls are 2 or more.' },
      mix: { live: true, min: 0, max: 1, default: 0.2, desc: 'How loud the ring is against the dry sound. The dry sound stays at full level.' },
      width: { live: false, min: 0, max: 1, default: 1, desc: 'How far the ring spreads to the left and right. 1 is the full spread, which makes even a centred tune sound wide; 0 keeps it where the sound is. It only shows when the player asks for stereo.' },
    },
  },
  wavestep: {
    tags: ['chip', 'lofi'], dev: ['wip'],
    desc: 'Makes any tone sound as if it came from a chip wave table, like the SCC, the Namco wave chips or the PC Engine. Each cycle of the note is cut into a few flat steps, and each step is rounded to a few levels. The steps follow the pitch of the note, so put it on a channel that plays one note at a time; chords and noise come out rough and blurred. The levels are measured against how loud the sound is, as on the chips, which hold the wave first and set the volume afterwards, so quiet notes stay as clean as loud ones. Pitch bends and vibrato inside a note are not followed. In #fx or setMasterEffects there is no note to follow, so only the levels apply.',
    params: {
      points: { live: false, min: 4, max: 64, default: 32, desc: 'Steps in one cycle, rounded to a whole number. The chips use 32. Fewer steps sound rougher and buzzier.' },
      bits: { live: false, min: 2, max: 8, default: 5, desc: 'Bits for each step, rounded to a whole number. 8 is the SCC (256 levels), 5 the PC Engine (32), 4 the Namco wave chips (16). Fewer bits sound grittier.' },
    },
  },
  loudness: {
    tags: ['eq', 'playback'], dev: ['wip'],
    desc: 'Loudness compensation. When the player turns the volume down, the ear hears the lows and highs fade before the middle. This lifts them back by how far the volume is below ref, so a quiet tune keeps its bass. It follows the volume property of the player, not the volume of the device, which the page cannot read. At ref or above it does nothing.',
    params: {
      amount: { live: false, min: 0, max: 2, default: 1, desc: 'How strongly it works. 1 follows the equal-loudness curves roughly, 0.5 gives half the lift and 0 turns it off. Above 1 it lifts more than the curves call for, which is easier to hear on small speakers; 2 gives twice the lift.' },
      ref: { live: false, min: 0.05, max: 8, default: 1, desc: 'The volume the tune was mixed at. Below this, the lift starts. Above it, nothing changes.' },
    },
  },
  compressor: {
    tags: ['dynamics', 'mastering'], dev: ['wip'],
    desc: 'Compressor. Turns down the parts that go above the threshold, so the loud and quiet parts sit closer together. Raise makeup to bring the whole tune back up afterwards; that is what makes a mix sound loud and dense. With a gentle ratio and no makeup it only smooths the peaks.',
    params: {
      threshold: { live: false, unit: 'dB', min: -60, max: 0, default: -18, desc: 'Level above which it starts to turn the sound down, in dB below full scale.' },
      ratio: { live: false, min: 1, max: 20, default: 4, desc: 'How hard it turns down above the threshold. 4 means 4 dB over the threshold comes out as 1 dB over. 1 does nothing; 20 is close to a limiter.' },
      attack: { live: false, unit: 's', min: 0.001, max: 0.5, default: 0.01, desc: 'Seconds it takes to turn down once the sound goes over. Short times catch the hits; longer times let the start of each hit through, which keeps drums punchy.' },
      release: { live: false, unit: 's', min: 0.01, max: 1, default: 0.25, desc: 'Seconds it takes to come back up after the sound falls under. Short times pump with the beat; long times sound smoother.' },
      makeup: { live: false, unit: 'dB', min: 0, max: 24, default: 0, desc: 'Gain added after the compression, in dB.' },
    },
  },
  limiter: {
    tags: ['dynamics', 'mastering'], dev: ['wip'],
    desc: 'Limiter. Never lets the sound go above the ceiling. It looks 5 ms ahead and turns down just before a peak, so it does not clip, at the cost of delaying the sound by 5 ms. Put it last. It works before #gain and the player volume, so a tune with #gain above 1, or a volume above 1, can still go over.',
    params: {
      ceiling: { live: false, unit: 'dB', min: -12, max: 0, default: -1, desc: 'The highest level let through, in dB below full scale.' },
      release: { live: false, unit: 's', min: 0.01, max: 1, default: 0.1, desc: 'Seconds it takes to come back up after a peak. Short times are louder but can sound rough.' },
    },
  },
  saturate: {
    tags: ['saturation'], dev: ['wip'],
    desc: 'Saturation. Rounds off the loud parts the way a tape or a tube amp does, adding warm harmonics. Quiet parts pass unchanged, so the peaks come down and the tune sounds denser; follow it with a compressor or a limiter to bring the level back up.',
    params: {
      drive: { live: false, min: 0, max: 1, default: 0.3, desc: 'How hard it rounds off. 0 is clean. At 1 even fairly quiet parts are rounded and the sound grows gritty.' },
    },
  },
  crush: {
    tags: ['lofi'], dev: ['wip'],
    desc: 'Bit crusher. Lowers the sample rate and the number of levels, like an old sampler. It does not follow the pitch, so it works on chords, noise and the whole mix. The levels are fixed against full scale, so quiet sounds grow grittier than loud ones.',
    params: {
      rate: { live: false, unit: 'Hz', min: 500, max: 48000, default: 8000, desc: 'How many times a second the sound is taken. Lower rates lose the highs and add metallic tones that do not follow the notes.' },
      bits: { live: false, min: 1, max: 16, default: 8, desc: 'Bits for each level, measured against full scale and rounded to a whole number. 8 gives 256 levels. Fewer bits add hiss and grit, most of all on quiet sounds.' },
    },
  },
};

/**
 * 素通しの並びの名前。`@f0` と `@f2{off}` で移る先。
 *
 * 節を外すのではなく、素通しの脇道へ移す。外すと繋ぎ直しのところで音が切れる
 */
export const FX_BYPASS = '(off)';

/**
 * 動かせない値の組み合わせを 1 本の字にする。
 *
 * 同じ組み合わせなら同じ字が返るので、これを鍵にして並びを使い回せる。
 * 行ったり来たりするたびに作ると、同じものが山ほどできてしまう。
 *
 * 動く値(`live`)は入れない。あちらは 1 つの並びのまま動かせるので、
 * 値が違っても同じ並びで足りる(2026-10-23)。
 * @param {string} kind エフェクトの種類
 * @param {object} fx 値
 * @param {object} kinds `FX_KINDS`(フィルタと全体のエフェクトを合わせたもの)
 * @returns {string} 組み合わせの名前
 */
export function fxVariant(kind, fx, kinds) {
  const def = kinds[kind];
  if (!def) return kind;
  const out = [kind];
  for (const [name, p] of Object.entries(def.params)) {
    if (!p.live) out.push(`${name}=${fx[name]}`);
  }
  return out.join(' ');
}

/**
 * 番号ごとに、作ることになる並びの数を数える。
 *
 * 動かせない値を書き替えると、その組み合わせごとに並びが要る。
 * `@f0` と `@f2{off}` で素通しへ移るぶんも 1 つ数える
 * (フィルタは `mix` を 0 にして外すので数えない)。
 * @param {object[]} list コンパイルが出した `filters`
 * @param {object} kinds `FX_KINDS`
 * @param {object} filters `FILTERS`(`mix` で外せる種類)
 * @returns {Map<number,{kind:string,sigs:string[],bypass:boolean}>}
 */
export function fxVariants(list, kinds, filters) {
  const out = new Map();
  for (const f of list || []) {
    if (f.off || !f.kind) continue;
    const slot = f.slot ?? 1;
    let g = out.get(slot);
    if (!g) { g = { kind: f.kind, sigs: [], bypass: false }; out.set(slot, g); }
    if (f.kind !== g.kind) continue;          // 種類は 1 台に 1 つ
    const sig = fxVariant(g.kind, f, kinds);
    if (!g.sigs.includes(sig)) g.sigs.push(sig);
  }
  // 素通しへ移るぶん。書いた順は見ない(1 回でも書いてあれば並びが要る)
  for (const f of list || []) {
    if (!f.off) continue;
    for (const [slot, g] of out) {
      if (!f.all && (f.slot ?? 1) !== slot) continue;
      if (!filters[g.kind]) g.bypass = true;
    }
  }
  return out;
}

/**
 * 1 つあたりの重さ。1 ブロック(128 サンプル)を作るのにかかる時間が、
 * 締め切りの何 % か。モノラル 1 本ぶん。測ったものは tool/data/filter-cost.json に
 * 積んであり、ここに写したのは 4 回目(2026-10-14、docs/FILTER_COST.md)。
 *
 * 機械が違えば値も変わるので、桁を見るためのもの。重ね掛けの見積もりに使う
 * (`fxCost`)。処理器の計算だけで、節を 1 つ置くこと自体の手間は入っていない。
 *
 * reverb は響きの長さで変わるので、直線で近似した
 * (測った値は 0.5 秒 0.578、1.5 秒 0.853、4 秒 1.426)。
 * noisefill は帯の数で変わるので、同じく直線で近似した
 * (Node で 128 サンプルを回して、4 本 0.25、12 本 0.63、24 本 1.18。2026-10-24、この 1 回だけ)。
 * denoise も同じ形(4 本 0.17、12 本 0.56、24 本 1.08)
 * spectralgate は帯の数を持たないので 1 つの値(同じ測り方で 1.15。2026-10-24)
 */
export const FX_COST = {
  lowpass: 0.029,
  highpass: 0.045,
  bandpass: 0.129,
  notch: 0.192,
  ladder: 0.120,
  highpass4: 0.104,
  echo: 0.032,
  reverb: { base: 0.46, perSec: 0.24 },
  noisefill: { base: 0.064, perBand: 0.0465 },
  denoise: { base: 0.035, perBand: 0.0455 },
  spectralgate: 1.15,
};

/**
 * エフェクト 1 つの重さ(締め切りに対する %)。知らない種類は 0
 * @param {{kind:string,time?:number,bands?:number}} fx
 */
export function fxCost(fx) {
  const c = FX_COST[fx && fx.kind];
  if (c === undefined) return 0;
  if (typeof c === 'number') return c;
  if (c.perBand) return c.base + c.perBand * (Number(fx.bands) || 12);
  return c.base + c.perSec * (Number(fx.time) || 0);
}

/** 響きの波形を作る種。決めておくと、何度作っても同じ響きになる */
const REVERB_SEED = 0x5eed;

/**
 * 音長(`8` `8.` `16`)を秒にする。MML の `l8` と同じ数え方で、付点 1 つで 1.5 倍、
 * 2 つで 1.75 倍。小数は受けない(`8.` を小数として読むと、付点のつもりが 8 分になる)
 * @param {string|number} word 音長
 * @param {number} tempo テンポ
 * @returns {number|null} 秒。読めなければ null
 */
export function noteLenSec(word, tempo) {
  const m = /^(\d+)(\.*)$/.exec(String(word ?? '').trim());
  if (!m || +m[1] < 1) return null;
  return (240 / tempo) / +m[1] * (2 - 0.5 ** m[2].length);
}

/**
 * 値を範囲に収めて、書いていないものは既定で埋める。
 * @param {{params:object}} def MASTER_FX か FILTERS の 1 件
 * @param {object} fx 渡されたもの
 */
function fill(def, fx) {
  const out = { kind: fx.kind };
  for (const [name, p] of Object.entries(def.params)) {
    const x = Number(fx[name]);
    out[name] = Number.isFinite(x) ? Math.min(p.max, Math.max(p.min, x)) : p.default;
  }
  return out;
}

/**
 * 並びを確かめて、値を埋めたものを返す。知らない種類は投げる。
 *
 * echo は `time` の代わりに音長 `l`(`'8'` `'8.'`)でも渡せる。`tempo` で秒に直す
 * @param {object[]} list `{kind, ...}` の並び
 * @param {object} filters sound/filter.js の FILTERS
 * @param {number} [tempo] `l` を秒に直すテンポ(既定 120)
 */
export function normalizeFx(list, filters, tempo = 120) {
  if (!Array.isArray(list)) throw new Error('master effects: pass an array');
  return list.map((fx) => {
    const kind = fx && fx.kind;
    const def = MASTER_FX[kind] || filters[kind];
    if (!def) throw new Error(`master effects: unknown kind "${kind}"`);
    if (fx.l == null) return fill(def, fx);
    if (!def.params.time) throw new Error(`master effects: "${kind}" does not take l`);
    const time = noteLenSec(fx.l, tempo);
    if (time == null) {
      throw new Error(`master effects: l "${fx.l}" is a note length, `
        + 'a whole number with optional dots such as 8 or "8."');
    }
    return fill(def, { ...fx, time });
  });
}

/** 並びに音長(`l`)で渡したものがあるか。曲を替えたときに秒へ直し直すかを決める */
export function fxHasLength(list) {
  return Array.isArray(list) && list.some((fx) => fx && fx.l != null);
}

/**
 * 最後の音のあとに、響きが消えるまでの長さ(秒)。書き出しの後ろの余白に使う。
 * echo は戻りの量で 1000 分の 1 まで落ちる回数ぶん、reverb は time ぶん
 */
export function fxTail(list) {
  let sum = 0;
  for (const fx of list) {
    if (fx.kind === 'echo') {
      sum += fx.time * (1 + Math.ceil(Math.log(1e-3) / Math.log(Math.max(0.01, fx.feedback))));
    } else if (fx.kind === 'reverb') {
      sum += fx.time;
    }
  }
  return sum;
}

/**
 * 響きの波形(インパルス応答)。左右で別のノイズにして広がりを出す。
 * 広がりは width で絞る。左右の和(中央)はそのままに差だけを縮めるので、0 なら左右が同じ響きになり、
 * 元の音のある場所で鳴る。既定は 1(広げる)。ステレオで出すかどうかは再生する側が決め、
 * モノラルなら出口で 1 本に畳まれる(2026-10-17、docs/STEREO.md)。
 * 大きさは、ノイズのような音を通したときに元の音と同じくらいになるように揃える
 * @param {BaseAudioContext} ctx
 * @param {number} time 60dB 落ちるまでの秒
 * @param {number} [width] 左右の広がり(0〜1、既定 1)
 */
export function reverbImpulse(ctx, time, width = 1) {
  const rate = ctx.sampleRate;
  const len = Math.max(1, Math.round(time * rate));
  const buf = ctx.createBuffer(2, len, rate);
  let x = REVERB_SEED;
  const rand = () => {
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5; x >>>= 0;
    return x / 4294967296 * 2 - 1;
  };
  // 60dB(1000 分の 1)落ちるまでが time。ln(1000) ≒ 6.91
  const k = -6.91 / len;
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    let sq = 0;
    for (let i = 0; i < len; i++) {
      d[i] = rand() * Math.exp(k * i);
      sq += d[i] * d[i];
    }
    const g = 1 / Math.sqrt(sq || 1);
    for (let i = 0; i < len; i++) d[i] *= g;
  }
  // 広がりを絞る。和はそのまま、差を width 倍にしてから、左右それぞれの大きさを揃え直す。
  // 1 なら何もしない(左右の別のノイズのまま)
  const w = Math.max(0, Math.min(1, Number.isFinite(Number(width)) ? Number(width) : 1));
  if (w < 1) {
    const l = buf.getChannelData(0), r = buf.getChannelData(1);
    let sl = 0, sr = 0;
    for (let i = 0; i < len; i++) {
      const m = (l[i] + r[i]) * 0.5, d = (l[i] - r[i]) * 0.5 * w;
      l[i] = m + d; r[i] = m - d;
      sl += l[i] * l[i]; sr += r[i] * r[i];
    }
    const gl = 1 / Math.sqrt(sl || 1), gr = 1 / Math.sqrt(sr || 1);
    for (let i = 0; i < len; i++) { l[i] *= gl; r[i] *= gr; }
  }
  return buf;
}

/**
 * echo の処理器。入口 1 つ、出口 1 つ。チャンネルごとに遅れ線を持つ。
 * 値は作るときに渡す(processorOptions)。
 *
 * 動かせる値(`live: true`)は AudioParam で持つ。時刻つきで積めるので、
 * 曲の途中でも書き出しでも同じに動く。`cross` だけは作るときに決まる。
 *
 * 遅れの控えは最初から上限いっぱい取ってあるので、`time` を動かしても取り直さない。
 *
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const ECHO_CODE = `
const ECHO_MAX = ${ECHO_MAX};
class Echo extends AudioWorkletProcessor {
  // 動かせる値は AudioParam で持つ。
  //
  // 前は processorOptions で渡して、動かすときは作り直していた。
  // 作り直すと溜まった返りが消えるので、曲の途中では変えられなかった。
  //
  // port で新しい値を送る形も試したが、書き出し(OfflineAudioContext)では
  // 届く前に鳴り終わる。AudioParam なら時刻つきで積めて、書き出しでも同じに鳴る
  // (2026-10-23)。
  //
  // k-rate にしてある。1 ブロック(128 サンプル)に 1 つの値で足りるものなので、
  // サンプルごとに読む必要が無い。内側の繰り返しも軽いままになる。
  //
  // cross は AudioParam にしない。出口の本数を作るときに決めるので、
  // 0 と 0 以外の行き来は作り直しになる。
  //
  // ここにバッククォートは書けない(縮めるときのコメント除去が、次の 1 つを
  // 文字列の終わりとして読む。scripts/lib/strip-code-comments.mjs)
  static get parameterDescriptors() {
    return [
      { name: 'time', defaultValue: 0.25, minValue: 0.01, maxValue: ECHO_MAX, automationRate: 'k-rate' },
      { name: 'feedback', defaultValue: 0.4, minValue: 0, maxValue: 0.95, automationRate: 'k-rate' },
      { name: 'mix', defaultValue: 0.3, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tone', defaultValue: 4000, minValue: 200, maxValue: 20000, automationRate: 'k-rate' },
    ];
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.cross = p.cross || 0;
    this.lift = this.cross * Math.SQRT1_2;
    // 控えは上限いっぱいで取る。time を動かしても取り直さずに済む
    this.n = Math.ceil(ECHO_MAX * sampleRate) + 4;
    this.bufs = [];
    this.zs = [];
    this.w = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs, params) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    const n = this.n;
    // 遅れは控えの中の読む位置。動かすとその場で飛ぶ(途中の値は別の遅れになる)
    const len = Math.max(1, Math.round(params.time[0] * sampleRate));
    const fb = params.feedback[0];
    const mix = params.mix[0];
    // ループの中の 1 次のローパス。1 サンプルで寄る量
    const g = 1 - Math.exp(-2 * Math.PI * params.tone[0] / sampleRate);
    // 反対側へ回すのは左右が揃っているときだけ。モノラルでは回す先が無い
    if (this.cross > 0 && out.length === 2) return this.pingPong(inp, out, len, fb, mix, g);
    let w = this.w;
    for (let c = 0; c < out.length; c++) {
      if (!this.bufs[c]) { this.bufs[c] = new Float32Array(n); this.zs[c] = 0; }
      const buf = this.bufs[c];
      const x = inp[c] || inp[0];
      const y = out[c];
      let z = this.zs[c];
      w = this.w;
      for (let i = 0; i < y.length; i++) {
        const xi = x ? x[i] : 0;
        const r = buf[(w - len + n) % n];
        z += (r - z) * g;
        buf[w] = xi + z * fb;
        y[i] = xi + z * mix;
        w = (w + 1) % n;
      }
      this.zs[c] = z;
    }
    this.w = w;
    return true;
  }
  // 左右の遅れ線を交差させる。入る音は cross のぶん左の線へ寄せ、
  // 返りは cross のぶん反対側の線へ渡す。cross が 1 なら最初の返りが左、
  // 次が右、と交互になる。
  //
  // 寄せるときは左右の和を √2 で割る。中央の音を片側へまとめると、
  // そのままでは返りが 3dB 大きく聞こえる。左右の和(モノラル)で揃えるか、
  // 左右で聞いたときの大きさで揃えるかの 2 択で、ステレオで聞くためのものなので後者にした。
  // そのぶんモノラルに畳むと、cross 1 で返りが 3dB 小さくなる
  pingPong(inp, out, len, fb, mix, g) {
    const n = this.n, k = this.cross;
    for (let c = 0; c < 2; c++) {
      if (!this.bufs[c]) { this.bufs[c] = new Float32Array(n); this.zs[c] = 0; }
    }
    const bl = this.bufs[0], br = this.bufs[1];
    const xl = inp[0], xr = inp[1] || inp[0];
    const yl = out[0], yr = out[1];
    let zl = this.zs[0], zr = this.zs[1];
    let w = this.w;
    for (let i = 0; i < yl.length; i++) {
      const a = xl ? xl[i] : 0, b = xr ? xr[i] : 0;
      const at = (w - len + n) % n;
      zl += (bl[at] - zl) * g;
      zr += (br[at] - zr) * g;
      bl[w] = a * (1 - k) + (a + b) * this.lift + (zl * (1 - k) + zr * k) * fb;
      br[w] = b * (1 - k) + (zr * (1 - k) + zl * k) * fb;
      yl[i] = a + zl * mix;
      yr[i] = b + zr * mix;
      w = (w + 1) % n;
    }
    this.zs[0] = zl; this.zs[1] = zr;
    this.w = w;
    return true;
  }
}
registerProcessor('${ECHO_NODE}', Echo);
`;

/**
 * ラウドネス補正(`loudness`)で、音量を下げたときに低音と高音を持ち上げる量。
 *
 * 等ラウドネス曲線(ISO 226:2003)をおおまかに写した。1kHz で 80 phon から 40 phon へ
 * 40dB 下げたとき、同じ大きさに聞こえるには 100Hz で 10dB ほど、それより下ではさらに
 * 余計に要る。下げた 1dB あたり、低音を 0.3dB 持ち上げる。高音は曲線の差が小さいので 0.1dB。
 * どちらも上限で止める。止めないと、音量 0 の近くで持ち上げる量が際限なく増える
 */
export const LOUDNESS = {
  bassHz: 120, bassPerDb: 0.3, bassMax: 15,
  trebleHz: 8000, treblePerDb: 0.1, trebleMax: 6,
};

/**
 * 音量 `volume` のときに持ち上げる量(dB)
 * @param {number} volume 聴く人の音量(`volume`)
 * @param {{amount:number, ref:number}} fx
 * @returns {{bass:number, treble:number}}
 */
export function loudnessGains(volume, fx) {
  const v = Math.max(1e-4, Number(volume) || 0);
  const down = Math.max(0, 20 * Math.log10(fx.ref / v));
  const L = LOUDNESS;
  return {
    bass: Math.min(L.bassMax, down * L.bassPerDb) * fx.amount,
    treble: Math.min(L.trebleMax, down * L.treblePerDb) * fx.amount,
  };
}

/**
 * 仕上げの設定。全体のエフェクトの並びに名前を付けたもの。
 * MML は `#master loud`、JS は `setMasterEffects('loud')`。
 * 値は測った大きさで決めた(2026-10-20)。Chrono etude #1(`#gain` を外したもの)で、
 * 何も掛けないときより平均(RMS)で loud が約 8dB、gentle が約 2dB 大きい。
 * 山と平均の差は、何も掛けないときの 16dB に対して loud が 9dB ほどで、山は上限の -1dB に
 * 届いている(リミッターが働いている)。耳ではまだ決めていない
 */
export const MASTER_PRESETS = {
  loud: {
    tags: ['mastering'], dev: ['wip'],
    desc: 'Loud and dense, like a modern pop master: rounded peaks, strong compression and a limiter. Good for small speakers and noisy places; the quiet and loud parts end up close together.',
    fx: [
      { kind: 'saturate', drive: 0.35 },
      { kind: 'compressor', threshold: -26, ratio: 4, attack: 0.005, release: 0.15, makeup: 18 },
      { kind: 'limiter', ceiling: -1, release: 0.08 },
    ],
  },
  gentle: {
    tags: ['mastering'], dev: ['wip'],
    desc: 'Light compression that keeps the loud and quiet parts apart, plus a limiter for safety. For tunes meant to be listened to closely.',
    fx: [
      { kind: 'compressor', threshold: -14, ratio: 2, attack: 0.02, release: 0.3, makeup: 4 },
      { kind: 'limiter', ceiling: -1, release: 0.15 },
    ],
  },
  safe: {
    tags: ['mastering'], dev: ['wip'],
    desc: 'Only a limiter. The tune sounds the same, but stacked notes can no longer clip.',
    fx: [
      { kind: 'limiter', ceiling: -1, release: 0.1 },
    ],
  },
};

/**
 * 効果音が鳴っているあいだ、BGM を下げる(ダッキング)。ゲームで使うもので、
 * 曲の仕上げではない。`setDucking()` で決める。depth が 0 なら何もしない
 */
export const DUCKING = {
  desc: 'Turns the BGM down while a sound effect plays, so the effect stands out, and brings it back afterwards. Jingles count as BGM. Effects played with duck: false do not turn it down.',
  params: {
    depth: { unit: 'dB', min: 0, max: 30, default: 0, desc: 'How far the BGM goes down while an effect plays. 0 turns ducking off; 6 is a gentle dip; 12 or more makes the effect clearly on top.' },
    attack: { live: false, unit: 's', min: 0.001, max: 1, default: 0.02, desc: 'Seconds it takes the BGM to go down when an effect starts.' },
    release: { live: false, unit: 's', min: 0.01, max: 3, default: 0.3, desc: 'Seconds it takes the BGM to come back after the last effect ends.' },
  },
};

/** 値を範囲に収めて、書いていないものは既定で埋める(ダッキング) */
export function normalizeDucking(opts = {}) {
  return fill(DUCKING, { ...opts, kind: undefined });
}

/** limiter と saturate の処理器の名前 */
export const DYN_NODE = 'mmsxx-dyn';

/** limiter の先読み(秒)。出てくる音はこのぶん遅れる */
export const LIMIT_AHEAD = 0.005;

/**
 * limiter と saturate の処理器。入口 1 つ、出口 1 つ。
 *
 * - saturate は 1 サンプルずつ tanh で丸める。形は tanh(g x) / g で、
 *   小さい音は傾き 1 のまま通る(sound/filter.js の drive と同じ考え方)。
 *   g は drive 0〜1 を 0〜24dB にしたもの
 * - limiter は LIMIT_AHEAD だけ遅らせて出す。そのあいだに来る山を見て、
 *   山に着くまでに絞りきる。要る倍率(上限 / 振れ幅)の窓の中の最小を取り、
 *   それを先読みと同じ長さで平均する。平均の窓の中は全部その山を見ているので、
 *   山の時刻には必ず上限より下まで絞れている。左右は同じ倍率で絞る
 *   (片方だけ絞ると、定位が動く)。戻るときだけ release の速さで戻す
 *
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const DYN_CODE = `
const AHEAD = ${LIMIT_AHEAD};
class Dyn extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.limit = p.kind === 'limiter';
    this.g = Math.pow(10, (p.drive || 0) * 24 / 20);
    this.ceil = Math.pow(10, (p.ceiling ?? -1) / 20);
    this.rel = 1 - Math.exp(-1 / ((p.release || 0.1) * sampleRate));
    // 遅らせるのは n サンプル。窓はそれより 1 つ長く取る。出ていく音(n 前の音)の
    // 要る倍率も、窓の中に残っていないといけない
    const n = Math.max(1, Math.round(AHEAD * sampleRate));
    this.n = n;
    this.req = new Float32Array(n + 1).fill(1);   // 先読みの窓の、要る倍率
    this.avg = new Float32Array(n + 1).fill(1);   // 平均の窓
    this.sum = n + 1;
    this.w = 0;     // 窓に書く位置
    this.dw = 0;    // 遅れ線に書く位置
    this.delay = [];
    this.gain = 1;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    const len = out[0].length;
    if (!this.limit) {
      const g = this.g;
      for (let c = 0; c < out.length; c++) {
        const x = inp[c] || inp[0], y = out[c];
        for (let i = 0; i < len; i++) y[i] = x ? Math.tanh(g * x[i]) / g : 0;
      }
      return true;
    }
    const n = this.n, req = this.req, avg = this.avg;
    for (let c = 0; c < out.length; c++) if (!this.delay[c]) this.delay[c] = new Float32Array(n);
    for (let i = 0; i < len; i++) {
      let peak = 0;
      for (let c = 0; c < out.length; c++) {
        const x = inp[c] || inp[0];
        const a = x ? Math.abs(x[i]) : 0;
        if (a > peak) peak = a;
      }
      req[this.w] = peak > this.ceil ? this.ceil / peak : 1;
      let m = 1;
      for (let k = 0; k <= n; k++) if (req[k] < m) m = req[k];
      this.sum += m - avg[this.w];
      avg[this.w] = m;
      const target = this.sum / (n + 1);
      this.gain = target < this.gain ? target : this.gain + (target - this.gain) * this.rel;
      for (let c = 0; c < out.length; c++) {
        const x = inp[c] || inp[0];
        const d = this.delay[c];
        out[c][i] = d[this.dw] * this.gain;
        d[this.dw] = x ? x[i] : 0;
      }
      this.w = (this.w + 1) % (n + 1);
      this.dw = (this.dw + 1) % n;
    }
    return true;
  }
}
registerProcessor('${DYN_NODE}', Dyn);
`;

/** wavestep と crush の処理器の名前 */
export const CHIP_NODE = 'mmsxx-chip';

/**
 * wavestep と crush の処理器。入口 1 つ、出口 1 つ。チャンネルごとに状態を持つ。
 *
 * どちらも、ときどき入口の値を取って、次に取るまで同じ値を出し続ける(横の刻み)。
 * 取った値は決まった段数に丸める(縦の刻み)。
 *
 * - wavestep は、1 周期に points 回取る。周期は `pitch` で受け取る。
 *   音符の高さはエンジンが音符の頭で書き込む(sound/audio.js の `_scheduleFilters`)。
 *   SCC・ナムコ・PCE は 1 周期を 32 点で持つので、同じ刻みが音の高さについてくる。
 *   段は、いま鳴っている大きさ(ピークを追う値)を最大として割る。チップは波形を
 *   先に持ち、音量はあとで掛けるので、小さい音でも段の数は変わらない。それに寄せた。
 *   `pitch` が 0(音符を受け取らない置き場所)のときは、毎サンプル取る
 * - crush は、1 秒に rate 回取る。段はいっぱいの振れ幅(±1)を割る。
 *   小さい音ほど使える段が減って、ざらつく
 *
 * 値は作るときに渡す(processorOptions)。`pitch` だけ AudioParam。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const CHIP_CODE = `
// ピークを追う値。1 周期のあいだは保ち、そのあと FOLLOW_SEC の速さで戻る。
// 保たないと周期の途中で下がり、同じ音でも周期ごとに段の位置がずれる
const FOLLOW_SEC = 0.05;
// 高さを受け取っていないときに保つ長さ(秒)
const HOLD_SEC = 0.02;
const QUIET = 1e-6;
class Chip extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'pitch', defaultValue: 0, minValue: 0, maxValue: 20000, automationRate: 'a-rate' }];
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.crush = p.kind === 'crush';
    this.points = Math.max(1, Math.round(p.points || 32));
    this.rate = p.rate || 8000;
    // 0 を挟んで上下に 2^(bits-1) 段ずつ
    this.half = 2 ** (Math.max(1, Math.round(p.bits || 8)) - 1);
    this.rel = Math.exp(-1 / (FOLLOW_SEC * sampleRate));
    this.chans = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs, params) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    const pitch = params.pitch;
    const pFix = pitch.length === 1;
    const sr = sampleRate;
    const half = this.half, rel = this.rel;
    for (let c = 0; c < out.length; c++) {
      const s = this.chans[c] || (this.chans[c] = { ph: 1, held: 0, env: 0, hold: 0 });
      const x = inp[c] || inp[0];
      const y = out[c];
      let ph = s.ph, held = s.held, env = s.env, hold = s.hold;
      for (let i = 0; i < y.length; i++) {
        const xi = x ? x[i] : 0;
        let take;
        if (this.crush) {
          ph += this.rate / sr;
          take = ph >= 1;
        } else {
          const f = pFix ? pitch[0] : pitch[i];
          const a = xi < 0 ? -xi : xi;
          if (a >= env) { env = a; hold = f > 0 ? sr / f : HOLD_SEC * sr; }
          else if (hold > 0) hold--;
          else env *= rel;
          if (f > 0) { ph += f * this.points / sr; take = ph >= 1; } else take = true;
        }
        if (take) {
          ph -= Math.floor(ph);
          if (this.crush) held = Math.round(xi * half) / half;
          else if (env > QUIET) held = Math.round(xi / env * half) / half * env;
          else held = xi;
        }
        y[i] = held;
      }
      s.ph = ph; s.held = held; s.env = env; s.hold = hold;
    }
    return true;
  }
}
registerProcessor('${CHIP_NODE}', Chip);
`;
