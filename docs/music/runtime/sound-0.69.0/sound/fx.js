// 全体に掛けるエフェクト(マスターエフェクト)。曲の出口の手前に、並べた順に通す。
//
// ---- 何があるか ----
//
// - フィルタ。定義は `sound/filter.js` の FILTER_FX(lowpass・highpass など)。
//   `@f` と同じ処理器で回す。全体だけ BiquadFilterNode にすると、同じ設定でも
//   置き場所で鳴り方が変わる(docs/FILTER.md の「置き場所と並べ方」)
// - echo。返りがループの中のローパスを毎回通るので、返るたびに暗くなる。
//   `analog` のパッチの delay と同じ計算
// - reverb。部屋の響き。響きの波形はその場で作る(ノイズが少しずつ小さくなるもの)。
//   録音した響きを持たないので、外部依存ゼロのまま。種を決めてあるので、
//   鳴らすときも書き出すときも同じ響きになる
// - wavestep と bitcrusher。波形を刻んで粗くする(2026-10-19)。下の CHIP_CODE を見る
// - tube・transformer・tape。古い機材を通したような色付け(2026-10-20)。
//   中身はそれぞれ sound/fxtube.js・sound/fxtransformer.js・sound/fxtape.js
// - compressor・limiter・saturator。曲の仕上げ(2026-10-20)。名前つきの組み合わせは
//   MASTER_PRESETS。効果音のあいだ BGM を下げるダッキングはゲームの側のもので、
//   エフェクトの並びには入れない(DUCKING)
// - spring・plate・gatedreverb。reverb と色の違う響き(2026-10-26)。どれも畳み込まず、
//   遅れ線の輪を回す。中身はそれぞれ sound/fxspring.js・sound/fxplate.js・sound/fxgatedreverb.js
// - rotary widener ringmod comb exciter multitap stutter tapestop radio vocoder(2026-10-26)。
//   中身はそれぞれ sound/fx<名前>.js。stutter と tapestop は `on` を書き替えて曲の途中で効かせる。
//   vocoder は sidechain と同じく、キー(`#sidechain`)を聞く
// - fuzz。saturator や tube よりずっと強い歪み(2026-10-26)。中身は sound/fxfuzz.js
// - autogain。聴く人が音量を下げたら、低音と高音を持ち上げる(2026-10-19)。
//   昔のアンプのラウドネスボタンを、音量に合わせて自動で効かせるもの。
//   下の AUTOGAIN を見る
//
// ---- どこから掛けるか ----
//
// MML なら指示行の `#fx`(`#fx echo @l 8 @feedback 0.5`)。曲が名乗るものなので、
// 曲を替えればその曲のものになる。JS からは `setMasterEffects()`。
// 2 つは別に持ち、両方を通す。曲の `#fx` が先で、JS のぶんがあと。
// JS のぶんは曲を替えても残る(2026-10-17)。

import { FILTER_FX, isFilter } from './filter.js';
import { TUBE_FX, TUBE_NODE, TUBE_CODE } from './fxtube.js';
import { TRANSFORMER_FX, TRANSFORMER_NODE, TRANSFORMER_CODE } from './fxtransformer.js';
import { TAPE_FX, TAPE_NODE, TAPE_CODE } from './fxtape.js';
import { NOISEFILL_FX, NOISEFILL_NODE, NOISEFILL_CODE } from './fxnoisefill.js';
import { DENOISE_FX, DENOISE_NODE, DENOISE_CODE } from './fxdenoise.js';
import { SPECTRALGATE_FX, SPECTRALGATE_NODE, SPECTRALGATE_CODE } from './fxspectralgate.js';
import { CHORUS_FX, CHORUS_NODE, CHORUS_CODE } from './fxchorus.js';
import { EQ_FX, EQ_NODE, EQ_CODE } from './fxeq.js';
import { SIDECHAIN_FX, SIDECHAIN_NODE, SIDECHAIN_CODE } from './fxsidechain.js';
import { GATE_FX, GATE_NODE, GATE_CODE } from './fxgate.js';
import { ENSEMBLE_FX, ENSEMBLE_NODE, ENSEMBLE_CODE } from './fxensemble.js';
import { PHASER_FX, PHASER_NODE, PHASER_CODE } from './fxphaser.js';
import { AUTOWAH_FX, AUTOWAH_NODE, AUTOWAH_CODE } from './fxautowah.js';
import { FLANGER_FX, FLANGER_NODE, FLANGER_CODE } from './fxflanger.js';
import { TREMOLO_FX, TREMOLO_NODE, TREMOLO_CODE } from './fxtremolo.js';
import { AUTOPAN_FX, AUTOPAN_NODE, AUTOPAN_CODE } from './fxautopan.js';
import { FORMANT_FX, FORMANT_NODE, FORMANT_CODE } from './fxformant.js';
import { SPRING_FX, SPRING_NODE, SPRING_CODE } from './fxspring.js';
import { PLATE_FX, PLATE_NODE, PLATE_CODE } from './fxplate.js';
import { GATEDREVERB_FX, GATEDREVERB_NODE, GATEDREVERB_CODE } from './fxgatedreverb.js';
import { VINYL_FX, VINYL_NODE, VINYL_CODE } from './fxvinyl.js';
import { ROTARY_FX, ROTARY_NODE, ROTARY_CODE } from './fxrotary.js';
import { WIDENER_FX, WIDENER_NODE, WIDENER_CODE } from './fxwidener.js';
import { RINGMOD_FX, RINGMOD_NODE, RINGMOD_CODE } from './fxringmod.js';
import { COMB_FX, COMB_NODE, COMB_CODE } from './fxcomb.js';
import { EXCITER_FX, EXCITER_NODE, EXCITER_CODE } from './fxexciter.js';
import { MULTITAP_FX, MULTITAP_NODE, MULTITAP_CODE } from './fxmultitap.js';
import { STUTTER_FX, STUTTER_NODE, STUTTER_CODE } from './fxstutter.js';
import { TAPESTOP_FX, TAPESTOP_NODE, TAPESTOP_CODE } from './fxtapestop.js';
import { RADIO_FX, RADIO_NODE, RADIO_CODE } from './fxradio.js';
import { SPEAKER_FX, SPEAKER_NODE, SPEAKER_CODE } from './fxspeaker.js';
import { VOCODER_FX, VOCODER_NODE, VOCODER_CODE } from './fxvocoder.js';
import { FUZZ_FX, FUZZ_NODE, FUZZ_CODE } from './fxfuzz.js';

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
  chorus: { node: CHORUS_NODE, code: CHORUS_CODE },
  eq: { node: EQ_NODE, code: EQ_CODE },
  // sidechain と gate は、ほかと違う組み方をする(sound/audio.js の `_fxChain`)。読み込みだけここに載せる
  // keyed は、キー(`#sidechain`)を何本目の入口で聞くか。sidechain は 1 本目(音は処理器を通らない)
  sidechain: { node: SIDECHAIN_NODE, code: SIDECHAIN_CODE, keyed: 0 },
  gate: { node: GATE_NODE, code: GATE_CODE, synced: true },
  ensemble: { node: ENSEMBLE_NODE, code: ENSEMBLE_CODE },
  phaser: { node: PHASER_NODE, code: PHASER_CODE },
  autowah: { node: AUTOWAH_NODE, code: AUTOWAH_CODE },
  flanger: { node: FLANGER_NODE, code: FLANGER_CODE },
  // synced は、曲の頭の時刻を AudioParam `origin` で受けるもの(`_fxOrigin` が書き込む)。
  // stereo は、ステレオで鳴らすときに出口を 2 本に決めるもの。入口が 1 本でも左右へ振れるように
  tremolo: { node: TREMOLO_NODE, code: TREMOLO_CODE, synced: true },
  autopan: { node: AUTOPAN_NODE, code: AUTOPAN_CODE, synced: true, stereo: true },
  formant: { node: FORMANT_NODE, code: FORMANT_CODE },
  // 響きのもの。入口が 1 本でも、ステレオで鳴らすときは左右に別の響きを出す
  spring: { node: SPRING_NODE, code: SPRING_CODE, stereo: true },
  plate: { node: PLATE_NODE, code: PLATE_CODE, stereo: true },
  gatedreverb: { node: GATEDREVERB_NODE, code: GATEDREVERB_CODE, stereo: true },
  vinyl: { node: VINYL_NODE, code: VINYL_CODE },
  // パラメータに `live` を立てたもの(rotary の speed など)は、処理器が同じ名前の AudioParam を持つ。
  // `_fxChain` がそれを拾って、書き替え(`@fx{…}`)と `tweakMasterEffects()` に渡す
  rotary: { node: ROTARY_NODE, code: ROTARY_CODE, stereo: true },
  widener: { node: WIDENER_NODE, code: WIDENER_CODE, stereo: true },
  ringmod: { node: RINGMOD_NODE, code: RINGMOD_CODE },
  comb: { node: COMB_NODE, code: COMB_CODE },
  exciter: { node: EXCITER_NODE, code: EXCITER_CODE },
  multitap: { node: MULTITAP_NODE, code: MULTITAP_CODE },
  // stutter と tapestop は、`on` を書き替えて曲の途中で効かせる
  stutter: { node: STUTTER_NODE, code: STUTTER_CODE },
  tapestop: { node: TAPESTOP_NODE, code: TAPESTOP_CODE },
  radio: { node: RADIO_NODE, code: RADIO_CODE },
  speaker: { node: SPEAKER_NODE, code: SPEAKER_CODE },
  // vocoder はキー(モジュレーター)を 2 本目の入口で聞く。1 本目は掛けた側の音(キャリア)。キーをつなぐのは `_busWire`
  vocoder: { node: VOCODER_NODE, code: VOCODER_CODE, stereo: true, keyed: 1 },
  fuzz: { node: FUZZ_NODE, code: FUZZ_CODE },
};

/** echo の処理器の名前 */
export const ECHO_NODE = 'mmsxx-echo';

/** echo の間隔の上限(秒)。遅れ線はこの長さで取る */
const ECHO_MAX = 2;

/**
 * エフェクトの表。フィルタもほかのエフェクトも、ここに 1 つにまとめる。
 * `@fxchain` `@fx` `#fx` のどこにでも同じ名前で書け、使う側は区別していない。
 * 前はフィルタの表と全体用の表に分けていたが、分かれていたのは作った順のせいだけ
 * だったので、1 つにした(2026-10-26)。
 * フィルタだけ振る舞いが違うところは `isFilter`(sound/filter.js)で見分ける。
 *
 * どれも音色と同じく、絞り込みの語(tags)と開発の状態(dev)を持つ(2026-10-20)。
 * dev の語は sound/mml.js の DEV_MARKS。`wip` は作業中で、鳴るがまだ手を入れる。
 * 何も付けていないものは、まだ見直していない(確定の `done` とは限らない)
 */
export const EFFECTS = {
  ...FILTER_FX,
  ...TUBE_FX,
  ...TRANSFORMER_FX,
  ...TAPE_FX,
  ...NOISEFILL_FX,
  ...DENOISE_FX,
  ...SPECTRALGATE_FX,
  ...CHORUS_FX,
  ...EQ_FX,
  ...SIDECHAIN_FX,
  ...GATE_FX,
  ...ENSEMBLE_FX,
  ...PHASER_FX,
  ...AUTOWAH_FX,
  ...FLANGER_FX,
  ...TREMOLO_FX,
  ...AUTOPAN_FX,
  ...FORMANT_FX,
  ...SPRING_FX,
  ...PLATE_FX,
  ...GATEDREVERB_FX,
  ...VINYL_FX,
  ...ROTARY_FX,
  ...WIDENER_FX,
  ...RINGMOD_FX,
  ...COMB_FX,
  ...EXCITER_FX,
  ...MULTITAP_FX,
  ...STUTTER_FX,
  ...TAPESTOP_FX,
  ...RADIO_FX,
  ...SPEAKER_FX,
  ...VOCODER_FX,
  ...FUZZ_FX,
  echo: {
    tags: ['delay'], dev: [], version: '1.00',
    desc: 'Echo. The sound comes back again and again, a little darker each time, like a tape or analog delay. From JS, l can stand in for time: a note length such as 8 or "8.", worked out from the tempo of the tune that is playing and again whenever the tune changes. It does not follow tempo changes inside a tune.',
    params: {
      time: { live: true, unit: 's', min: 0.01, max: ECHO_MAX, default: 0.25, desc: 'Seconds between repeats. It does not follow the tempo, so work it out from the tempo: an eighth note at 120 BPM is 0.25.' },
      feedback: { live: true, min: 0, max: 0.95, default: 0.4, desc: 'How much of each repeat goes round again. 0 gives a single repeat. Near 0.95 the repeats last a long time.' },
      mix: { live: true, min: 0, max: 1, default: 0.3, desc: 'How much of the sound is repeats, from 0 (the dry sound alone) to 1 (the repeats alone). 0.3 keeps 70% of the dry sound and adds 30% of the repeats. Set 1 when the echo sits on a send, where the dry sound reaches the tune by its own path.' },
      highcut: { live: true, unit: 'Hz', min: 200, max: 20000, default: 4000, desc: 'Cutoff of a gentle low-pass inside the loop. Every repeat passes it again, so the repeats grow darker one by one.' },
      pingpong: { live: false, min: 0, max: 1, default: 0, desc: 'How much of each repeat moves to the other side. 0 keeps every repeat where the sound was. 1 is a ping-pong echo: the repeats bounce left, right, left. The repeats keep the same loudness heard in stereo; summed to mono they get up to 3 dB quieter at 1. A mono sound is spread to both sides first. When the output is mono, it does nothing.' },
    },
  },
  reverb: {
    tags: ['space'], dev: [], version: '1.00',
    desc: 'Reverb. The ring of a room after the sound, made from noise that fades away.',
    params: {
      decay: { live: false, unit: 's', min: 0.1, max: 10, default: 1.5, desc: 'Seconds for the ring to fade by 60 dB. Small rooms are under 1, halls are 2 or more.' },
      mix: { live: true, min: 0, max: 1, default: 0.2, desc: 'How much of the sound is ring, from 0 (the dry sound alone) to 1 (the ring alone). 0.2 keeps 80% of the dry sound and adds 20% of the ring. Set 1 when the reverb sits on a send, where the dry sound reaches the tune by its own path.' },
      width: { live: false, min: 0, max: 1, default: 1, desc: 'How far the ring spreads to the left and right. 1 is the full spread, which makes even a centred tune sound wide; 0 keeps it where the sound is. It only shows when the player asks for stereo.' },
    },
  },
  wavestep: {
    tags: ['chip', 'lofi'], dev: [], version: '1.00',
    desc: 'Makes any tone sound as if it came from a chip wave table, like the SCC, the Namco wave chips or the PC Engine. Each cycle of the note is cut into a few flat steps, and each step is rounded to a few levels. The steps follow the pitch of the note, so put it on a channel that plays one note at a time; chords and noise come out rough and blurred. The levels are measured against how loud the sound is, as on the chips, which hold the wave first and set the volume afterwards, so quiet notes stay as clean as loud ones. Pitch bends and vibrato inside a note are not followed. In #fx or setMasterEffects there is no note to follow, so only the levels apply.',
    params: {
      points: { live: false, min: 4, max: 64, default: 32, desc: 'Steps in one cycle, rounded to a whole number. The chips use 32. Fewer steps sound rougher and buzzier.' },
      bits: { live: false, min: 2, max: 8, default: 5, desc: 'Bits for each step, rounded to a whole number. 8 is the SCC (256 levels), 5 the PC Engine (32), 4 the Namco wave chips (16). Fewer bits sound grittier.' },
          mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
  autogain: {
    tags: ['eq', 'playback'], dev: ['wip'], version: '0.1',
    desc: 'Loudness compensation. When the player turns the volume down, the ear hears the lows and highs fade before the middle. This lifts them back by how far the volume is below ref, so a quiet tune keeps its bass. It follows the volume property of the player, not the volume of the device, which the page cannot read. At ref or above it does nothing.',
    params: {
      amount: { live: false, min: 0, max: 2, default: 1, desc: 'How strongly it works. 1 follows the equal-loudness curves roughly, 0.5 gives half the lift and 0 turns it off. Above 1 it lifts more than the curves call for, which is easier to hear on small speakers; 2 gives twice the lift.' },
      ref: { live: false, min: 0.05, max: 8, default: 1, desc: 'The volume the tune was mixed at. Below this, the lift starts. Above it, nothing changes.' },
    },
  },
  compressor: {
    tags: ['dynamics', 'mastering'], dev: ['wip'], version: '0.1',
    desc: 'Compressor. Turns down the parts that go above the threshold, so the loud and quiet parts sit closer together. Raise makeup to bring the whole tune back up afterwards; that is what makes a mix sound loud and dense. With a gentle ratio and no makeup it only smooths the peaks.',
    params: {
      threshold: { live: false, unit: 'dB', min: -60, max: 0, default: -18, desc: 'Level above which it starts to turn the sound down, in dB below full scale.' },
      ratio: { live: false, min: 1, max: 20, default: 4, desc: 'How hard it turns down above the threshold. 4 means 4 dB over the threshold comes out as 1 dB over. 1 does nothing; 20 is close to a limiter.' },
      attack: { live: false, unit: 's', min: 0.001, max: 0.5, default: 0.01, desc: 'Seconds it takes to turn down once the sound goes over. Short times catch the hits; longer times let the start of each hit through, which keeps drums punchy.' },
      release: { live: false, unit: 's', min: 0.01, max: 1, default: 0.25, desc: 'Seconds it takes to come back up after the sound falls under. Short times pump with the beat; long times sound smoother.' },
      makeup: { live: false, unit: 'dB', min: 0, max: 24, default: 0, desc: 'Gain added after the compression, in dB.' },
          mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
  limiter: {
    tags: ['dynamics', 'mastering'], dev: [], version: '1.00',
    desc: 'Limiter. Never lets the sound go above the ceiling. It looks 5 ms ahead and turns down just before a peak, so it does not clip, at the cost of delaying the sound by 5 ms. Put it last. It works before #gain and the player volume, so a tune with #gain above 1, or a volume above 1, can still go over.',
    params: {
      ceiling: { live: false, unit: 'dB', min: -12, max: 0, default: -1.5, desc: 'The highest level let through, in dB below full scale. It is measured on the samples themselves, so the peaks that hide between samples still rise above it: on the sample tunes the true peak came out 0.1 to 1.3 dB higher. The default leaves room for that, but it is not a guarantee; what keeps a tune under -1 dBTP is the gain that render-wav --fit works out.' },
      release: { live: false, unit: 's', min: 0.01, max: 1, default: 0.1, desc: 'Seconds it takes to come back up after a peak. Short times are louder but can sound rough.' },
          mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
  saturator: {
    tags: ['saturation'], dev: ['wip'], version: '0.1',
    desc: 'Saturation. Rounds off the loud parts the way a tape or a tube amp does, adding warm harmonics. Quiet parts pass unchanged, so the peaks come down and the tune sounds denser; follow it with a compressor or a limiter to bring the level back up.',
    params: {
      drive: { live: false, min: 0, max: 1, default: 0.3, desc: 'How hard it rounds off. 0 is clean. At 1 even fairly quiet parts are rounded and the sound grows gritty.' },
          mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
  bitcrusher: {
    tags: ['lofi'], dev: [], version: '1.00',
    desc: 'Bit crusher. Lowers the sample rate and the number of levels, like an old sampler. It does not follow the pitch, so it works on chords, noise and the whole mix. The levels are fixed against full scale, so quiet sounds grow grittier than loud ones.',
    params: {
      rate: { live: false, unit: 'Hz', min: 500, max: 48000, default: 8000, desc: 'How many times a second the sound is taken. Lower rates lose the highs and add metallic tones that do not follow the notes.' },
      bits: { live: false, min: 1, max: 16, default: 8, desc: 'Bits for each level, measured against full scale and rounded to a whole number. 8 gives 256 levels. Fewer bits add hiss and grit, most of all on quiet sounds.' },
          mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
};

/**
 * 素通しの並びの名前。`@f0` と `@f2{off}` で移る先。
 *
 * 節を外すのではなく、素通しの脇道へ移す。外すと繋ぎ直しのところで音が切れる
 */
/**
 * Dry/Wet を外から挟む種類。
 *
 * `mix` を処理器の中に持つもの(echo・reverb・フィルタなど)は、そちらが
 * 混ぜる。ここに挙げたものは処理器が混ぜないので、`_fxChain` が節を 4 つ
 * (元の音・通した音・足すところ・量)挟んで混ぜる。
 *
 * 混ぜ方は線形の交差。`mix 0` で元の音がそのまま通り、レベルも変わらない。
 * 等パワーの交差にすると真ん中が平らになるが、両端で元の音が通り抜けない。
 * 両端が大事なので線形を取った(2026-10-29)。
 *
 * 遅れて出てくる段は、元の音のほうを同じだけ遅らせる(`FX_DELAY`)。
 * 遅らせないと、2 つの音がずれて混ざって櫛形になる。
 *
 * `sidechain` と `autogain` は入れていない。前者は `depth` が同じ働きをし、
 * 後者は音量つまみに紐づいた補正で、混ぜる意味が無い
 */
export const MIX_OUTSIDE = new Set([
  'tube', 'transformer', 'tape', 'noisefill', 'denoise', 'spectralgate', 'eq',
  'gate', 'tremolo', 'autopan', 'vinyl', 'rotary', 'widener', 'exciter',
  'stutter', 'tapestop', 'wavestep', 'compressor', 'limiter', 'saturator', 'bitcrusher',
]);

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
 * @returns {string} 組み合わせの名前
 */
export function fxVariant(kind, fx) {
  const def = EFFECTS[kind];
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
 * @returns {Map<number,{kind:string,sigs:string[],bypass:boolean}>}
 */
export function fxVariants(list) {
  const out = new Map();
  for (const f of list || []) {
    if (f.off || !f.kind) continue;
    const slot = f.slot ?? 1;
    let g = out.get(slot);
    if (!g) { g = { kind: f.kind, sigs: [], bypass: false }; out.set(slot, g); }
    if (f.kind !== g.kind) continue;          // 種類は 1 台に 1 つ
    const sig = fxVariant(g.kind, f);
    if (!g.sigs.includes(sig)) g.sigs.push(sig);
  }
  // 素通しへ移るぶん。書いた順は見ない(1 回でも書いてあれば並びが要る)
  for (const f of list || []) {
    if (!f.off) continue;
    for (const [slot, g] of out) {
      if (!f.all && (f.slot ?? 1) !== slot) continue;
      if (!isFilter(g.kind)) g.bypass = true;
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
  // chorus と eq は、同じ測り方でこの 1 回だけ(2026-10-26。eq は 3 つの帯を全部動かしたとき)
  chorus: 0.15,
  // eq は、gain が 0 でない帯の数で変わる。gain 0 の帯は回さないため。直線で近似した
  // (同じ測り方で 0 本 0.020、1 本 0.042、2 本 0.060、3 本 0.078、4 本 0.095。2026-10-26、この 1 回だけ)
  eq: { base: 0.021, perGain: 0.019 },
  // sidechain と gate も同じ測り方で、この 1 回だけ(2026-10-26)。
  // sidechain はキーを鳴らし続けたとき。chorus と eq を測り直すと 0.13〜0.15 と 0.043 だった
  sidechain: 0.094,
  gate: 0.040,
  // ensemble から autopan も同じ測り方で、この 1 回だけ(2026-10-26)。
  // phaser は段の数で変わるので直線で近似した(2 段 0.049、4 段 0.064、8 段 0.098、12 段 0.131)。
  // autopan は左右を作るとき(ステレオ)。モノラルでは写すだけ。
  // 同じ回に chorus と gate を測り直すと 0.146 と 0.038 だった
  ensemble: 0.26,
  phaser: { base: 0.031, perStage: 0.0083 },
  autowah: 0.075,
  flanger: 0.068,
  tremolo: 0.081,
  autopan: 0.17,
  // formant から vinyl も同じ測り方で、この 1 回だけ(2026-10-26)。
  // formant は母音を揺らすとき(揺らさなければ 0.066)。spring plate gatedreverb は左右を作るとき。
  // 響きの長さでは変わらない(輪を回すだけで、畳み込まない)。同じ回に chorus を測り直すと 0.148 だった
  formant: 0.17,
  spring: 0.67,
  plate: 0.51,
  gatedreverb: 0.70,
  vinyl: 0.165,
  // rotary から vocoder も同じ測り方で、この 1 回だけ(2026-10-26)。
  // rotary と widener は左右を作るとき。stutter と tapestop は効かせているとき。
  // vocoder は帯の数で変わるので直線で近似した(8 本 0.32、12 本 0.50、16 本 0.70。キーをつないだとき)。
  // 同じ回に chorus と gate を測り直すと 0.15 と 0.031 だった
  rotary: 0.46,
  widener: 0.024,
  ringmod: 0.043,
  comb: 0.037,
  exciter: 0.080,
  multitap: 0.066,
  stutter: 0.056,
  tapestop: 0.070,
  radio: 0.102,
  // speaker は radio と同じ作り(双二次 2 つ + 丸め)に山を 1 つ足したもの。
  // まだ測っていないので、radio に 1 段ぶんを足した見込みの数(2026-10-29)
  speaker: 0.13,
  vocoder: { base: 0, perBand: 0.042 },
  // fuzz も同じ測り方で、この 1 回だけ(2026-10-26。既定の値で)。同じ回に chorus を測り直すと 0.147 だった
  fuzz: 0.19,
};

/**
 * エフェクト 1 つの重さ(締め切りに対する %)。知らない種類は 0
 * eq は gain が 0 でない帯(`gainA` 〜 `gainD`)を数える。書いていない gain は既定の 0
 * @param {{kind:string,decay?:number,bands?:number,stages?:number}} fx
 */
export function fxCost(fx) {
  const c = FX_COST[fx && fx.kind];
  if (c === undefined) return 0;
  if (typeof c === 'number') return c;
  if (c.perGain) {
    const on = Object.keys(fx).filter((k) => /^gain[A-Z]$/.test(k) && Number(fx[k]) !== 0).length;
    return c.base + c.perGain * on;
  }
  if (c.perBand) return c.base + c.perBand * (Number(fx.bands) || 12);
  if (c.perStage) return c.base + c.perStage * (Number(fx.stages) || 4);
  // reverb は響きの長さ(decay)で重くなる
  return c.base + c.perSec * (Number(fx.decay) || 0);
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
 * 名前で選べる値(`choices` を持つパラメータ)の名前を、数に直す。
 * 大文字と小文字は区別しない(`'Bell'` も `'bell'` も 1)。名前でなければ null
 * @param {{choices?:{value:number,name:string}[]}} p パラメータの定義
 * @param {*} word 書いたもの
 * @returns {number|null}
 */
export function fxChoice(p, word) {
  if (!p || !p.choices || typeof word !== 'string') return null;
  const low = word.trim().toLowerCase();
  const hit = p.choices.find((c) => c.name.toLowerCase() === low);
  return hit ? hit.value : null;
}

/**
 * 渡された値を数にする。名前で選べる値は名前でも受け、中では数に直して持つ(2026-10-26)。
 * 知らない名前は投げて、使える名前を並べる。数でも名前でもないものは NaN(既定になる)
 * @param {string} kind エフェクトの種類(知らせに出す)
 * @param {string} name パラメータの名前
 * @param {object} p パラメータの定義
 * @param {*} v 渡された値
 * @returns {number}
 */
export function fxValue(kind, name, p, v) {
  if (p && p.choices && typeof v === 'string' && v.trim() !== '' && !Number.isFinite(Number(v))) {
    const c = fxChoice(p, v);
    if (c == null) {
      throw new Error(`master effects: ${kind} ${name} "${v}" is not a choice `
        + `(use a number or one of ${p.choices.map((x) => x.name).join(', ')})`);
    }
    return c;
  }
  return Number(v);
}

/**
 * 値を範囲に収めて、書いていないものは既定で埋める。
 * @param {{params:object}} def EFFECTS の 1 件
 * @param {object} fx 渡されたもの
 */
function fill(def, fx) {
  // 名前は呼び名。書かなければ種類がそのまま名前になる。
  // 同じ種類を 2 つ並べるときに、どちらを動かすのか決めるのに要る(2026-10-25)
  const out = { name: String(fx.name ?? fx.kind), kind: fx.kind };
  for (const [name, p] of Object.entries(def.params)) {
    const x = fxValue(fx.kind, name, p, fx[name]);
    out[name] = Number.isFinite(x) ? Math.min(p.max, Math.max(p.min, x)) : p.default;
  }
  return out;
}

/**
 * 並びを確かめて、値を埋めたものを返す。知らない種類は投げる。
 *
 * echo は `time` の代わりに音長 `l`(`'8'` `'8.'`)でも渡せる。`tempo` で秒に直す。
 * reverb などの響きは `decay` の代わりに渡せる。
 * 揺らすもの(tremolo など)は `rate` の代わりに渡せて、1 周の長さとして Hz に直す(`fxLengthParam`)。
 * 名前で選べる値(eq の `typeA` など)は、数の代わりに名前でも渡せる(`fxValue`)
 * @param {object[]} list `{kind, ...}` の並び
 * @param {number} [tempo] `l` を秒に直すテンポ(既定 120)
 */
export function normalizeFx(list, tempo = 120) {
  if (!Array.isArray(list)) throw new Error('master effects: pass an array');
  const out = list.map((fx) => {
    const kind = fx && fx.kind;
    const def = EFFECTS[kind];
    if (!def) throw new Error(`master effects: unknown kind "${kind}"`);
    if (fx.l == null) return fill(def, fx);
    const to = fxLengthParam(def);
    if (!to) throw new Error(`master effects: "${kind}" does not take l`);
    const sec = noteLenSec(fx.l, tempo);
    if (sec == null) {
      throw new Error(`master effects: l "${fx.l}" is a note length, `
        + 'a whole number with optional dots such as 8 or "8."');
    }
    return fill(def, { ...fx, [to]: to === 'rate' ? 1 / sec : sec });
  });
  // 名前がぶつかったら止める。どちらを動かすのか決まらない。
  // 名前を書かなければ種類が名前になるので、同じ種類を 2 つ並べるときに起きる
  const seen = new Set();
  for (const fx of out) {
    const low = fx.name.toLowerCase();
    if (seen.has(low)) {
      throw new Error(`master effects: two effects are both named "${fx.name}". `
        + 'Give each one a name (e.g. { name: "slap", kind: "echo" })');
    }
    seen.add(low);
  }
  return out;
}

/**
 * 音長(`l`)で書けるパラメータの名前。無ければ null。
 *
 * `time`(秒)を持つもの(echo・gate など)はその長さ。`time` が無く、響きの長さ
 * `decay`(秒)を持つもの(reverb・spring・plate・gatedreverb)はその長さ。
 * 前は響きの長さも `time` だったので、音長で書けた。名前を変えても書けるままにした(2026-10-26)。
 * multitap の `decay` は秒ではない(`time` が先に当たる)。
 * どちらも無く、速さ `rate`(Hz)を持つもの(tremolo・autopan・chorus など揺らすもの)は、
 * 1 周の長さとして読んで、Hz に直す(2026-10-26)。拍に合わせて揺らしたいときに要る
 * @param {{params:object}} def EFFECTS の 1 件
 * @returns {'time'|'decay'|'rate'|null}
 */
export function fxLengthParam(def) {
  if (!def || !def.params) return null;
  if (def.params.time) return 'time';
  if (def.params.decay && def.params.decay.unit === 's') return 'decay';
  if (def.params.rate && def.params.rate.unit === 'Hz') return 'rate';
  return null;
}

/** 並びに音長(`l`)で渡したものがあるか。曲を替えたときに秒へ直し直すかを決める */
export function fxHasLength(list) {
  return Array.isArray(list) && list.some((fx) => fx && fx.l != null);
}

/**
 * 最後の音のあとに、響きが消えるまでの長さ(秒)。書き出しの後ろの余白に使う。
 * echo は戻りの量で 1000 分の 1 まで落ちる回数ぶん、reverb は decay ぶん。
 * spring と plate は predelay と decay のぶん。gatedreverb は、ゲートが閉じきるまで(hold と release)と
 * decay の短いほう(2026-10-26)。
 * vinyl のパチパチと雑音は数えない。いつまでも鳴るもので、tape の hiss と同じ扱い。
 * multitap は返りの並び 1 回ぶんと、feedback で並びがくり返すぶん。comb は遅れが 1000 分の 1 まで落ちるまで
 */
export function fxTail(list) {
  let sum = 0;
  for (const fx of list) {
    if (fx.kind === 'echo') {
      sum += fx.time * (1 + Math.ceil(Math.log(1e-3) / Math.log(Math.max(0.01, fx.feedback))));
    } else if (fx.kind === 'reverb') {
      sum += fx.decay;
    } else if (fx.kind === 'spring' || fx.kind === 'plate') {
      sum += fx.decay + (fx.predelay || 0) / 1000;
    } else if (fx.kind === 'gatedreverb') {
      sum += Math.min(fx.decay, (fx.hold + fx.release) / 1000);
    } else if (fx.kind === 'multitap') {
      // 並び 1 回ぶん(taps × time)。戻すなら、echo と同じく 1000 分の 1 まで落ちる回数ぶん
      const row = fx.time * Math.round(fx.taps);
      const fb = fx.feedback * Math.pow(fx.decay, Math.round(fx.taps) - 1);
      sum += fb > 0.001 ? row * (1 + Math.ceil(Math.log(1e-3) / Math.log(Math.min(0.99, fb)))) : row;
    } else if (fx.kind === 'comb') {
      // 遅れ 1 つぶんを、1000 分の 1 まで落ちる回数だけ
      const fb = Math.abs(fx.feedback);
      if (fb > 0.001) sum += Math.ceil(Math.log(1e-3) / Math.log(fb)) / fx.freq;
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
 * @param {number} decay 60dB 落ちるまでの秒
 * @param {number} [width] 左右の広がり(0〜1、既定 1)
 */
export function reverbImpulse(ctx, decay, width = 1) {
  const rate = ctx.sampleRate;
  const len = Math.max(1, Math.round(decay * rate));
  const buf = ctx.createBuffer(2, len, rate);
  let x = REVERB_SEED;
  const rand = () => {
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5; x >>>= 0;
    return x / 4294967296 * 2 - 1;
  };
  // 60dB(1000 分の 1)落ちるまでが decay。ln(1000) ≒ 6.91
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
 * 曲の途中でも書き出しでも同じに動く。`pingpong` だけは作るときに決まる。
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
  // pingpong は AudioParam にしない。出口の本数を作るときに決めるので、
  // 0 と 0 以外の行き来は作り直しになる。
  //
  // ここにバッククォートは書けない(縮めるときのコメント除去が、次の 1 つを
  // 文字列の終わりとして読む。scripts/lib/strip-code-comments.mjs)
  static get parameterDescriptors() {
    return [
      { name: 'time', defaultValue: 0.25, minValue: 0.01, maxValue: ECHO_MAX, automationRate: 'k-rate' },
      { name: 'feedback', defaultValue: 0.4, minValue: 0, maxValue: 0.95, automationRate: 'k-rate' },
      { name: 'mix', defaultValue: 0.3, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'highcut', defaultValue: 4000, minValue: 200, maxValue: 20000, automationRate: 'k-rate' },
    ];
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.pingpong = p.pingpong || 0;
    this.lift = this.pingpong * Math.SQRT1_2;
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
    const g = 1 - Math.exp(-2 * Math.PI * params.highcut[0] / sampleRate);
    // 反対側へ回すのは左右が揃っているときだけ。モノラルでは回す先が無い
    if (this.pingpong > 0 && out.length === 2) return this.pingPong(inp, out, len, fb, mix, g);
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
        // 元の音と返りの割合。DAW の Dry/Wet と同じ。前は元の音をそのまま残して返りを足していた(2026-10-26)
        y[i] = xi * (1 - mix) + z * mix;
        w = (w + 1) % n;
      }
      this.zs[c] = z;
    }
    this.w = w;
    return true;
  }
  // 左右の遅れ線を交差させる。入る音は pingpong のぶん左の線へ寄せ、
  // 返りは pingpong のぶん反対側の線へ渡す。pingpong が 1 なら最初の返りが左、
  // 次が右、と交互になる。
  //
  // 寄せるときは左右の和を √2 で割る。中央の音を片側へまとめると、
  // そのままでは返りが 3dB 大きく聞こえる。左右の和(モノラル)で揃えるか、
  // 左右で聞いたときの大きさで揃えるかの 2 択で、ステレオで聞くためのものなので後者にした。
  // そのぶんモノラルに畳むと、pingpong 1 で返りが 3dB 小さくなる
  pingPong(inp, out, len, fb, mix, g) {
    const n = this.n, k = this.pingpong;
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
      yl[i] = a * (1 - mix) + zl * mix;
      yr[i] = b * (1 - mix) + zr * mix;
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
 * ラウドネス補正(`autogain`)で、音量を下げたときに低音と高音を持ち上げる量。
 *
 * 等ラウドネス曲線(ISO 226:2003)をおおまかに写した。1kHz で 80 phon から 40 phon へ
 * 40dB 下げたとき、同じ大きさに聞こえるには 100Hz で 10dB ほど、それより下ではさらに
 * 余計に要る。下げた 1dB あたり、低音を 0.3dB 持ち上げる。高音は曲線の差が小さいので 0.1dB。
 * どちらも上限で止める。止めないと、音量 0 の近くで持ち上げる量が際限なく増える
 */
export const AUTOGAIN = {
  bassHz: 120, bassPerDb: 0.3, bassMax: 15,
  trebleHz: 8000, treblePerDb: 0.1, trebleMax: 6,
};

/**
 * 音量 `volume` のときに持ち上げる量(dB)
 * @param {number} volume 聴く人の音量(`volume`)
 * @param {{amount:number, ref:number}} fx
 * @returns {{bass:number, treble:number}}
 */
export function autogainGains(volume, fx) {
  const v = Math.max(1e-4, Number(volume) || 0);
  const down = Math.max(0, 20 * Math.log10(fx.ref / v));
  const L = AUTOGAIN;
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
      { kind: 'saturator', drive: 0.35 },
      { kind: 'compressor', threshold: -26, ratio: 4, attack: 0.005, release: 0.15, makeup: 18 },
      { kind: 'limiter', release: 0.08 },
    ],
  },
  gentle: {
    tags: ['mastering'], dev: ['wip'],
    desc: 'Light compression that keeps the loud and quiet parts apart, plus a limiter for safety. For tunes meant to be listened to closely.',
    fx: [
      { kind: 'compressor', threshold: -14, ratio: 2, attack: 0.02, release: 0.3, makeup: 4 },
      { kind: 'limiter', release: 0.15 },
    ],
  },
  safe: {
    tags: ['mastering'], dev: ['wip'],
    desc: 'Only a limiter. The tune sounds the same, but stacked notes can no longer clip.',
    fx: [
      { kind: 'limiter', release: 0.1 },
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

/** limiter と saturator の処理器の名前 */
export const DYN_NODE = 'mmsxx-dyn';

/** limiter の先読み(秒)。出てくる音はこのぶん遅れる */
export const LIMIT_AHEAD = 0.005;

/**
 * 出てくる音が遅れる段と、その秒数。元の音と混ぜるときに、元の音をこのぶん遅らせる。
 *
 * 書いてあるものは、それぞれの `desc` が「このぶん遅れて出る」と言っている量。
 * 書いていない段は遅れない
 */
export const FX_DELAY = {
  tape: 0.010,
  vinyl: 0.010,
  limiter: LIMIT_AHEAD,
  spectralgate: 1024 / 48000,
  // 作りつけの DynamicsCompressor が持っている遅れ。インパルスを通して測ったら
  // ちょうど 6ms だった(48kHz で 288 標本。2026-10-29)
  compressor: 0.006,
};


/**
 * limiter と saturator の処理器。入口 1 つ、出口 1 つ。
 *
 * - saturator は 1 サンプルずつ tanh で丸める。形は tanh(g x) / g で、
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
    this.ceil = Math.pow(10, (p.ceiling ?? -1.5) / 20);
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

/** wavestep と bitcrusher の処理器の名前 */
export const CHIP_NODE = 'mmsxx-chip';

/**
 * wavestep と bitcrusher の処理器。入口 1 つ、出口 1 つ。チャンネルごとに状態を持つ。
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
 * - bitcrusher は、1 秒に rate 回取る。段はいっぱいの振れ幅(±1)を割る。
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
    this.bitcrusher = p.kind === 'bitcrusher';
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
        if (this.bitcrusher) {
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
          if (this.bitcrusher) held = Math.round(xi * half) / half;
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
