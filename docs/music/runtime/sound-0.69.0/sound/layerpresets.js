// **合成音色。**いくつかの音色を同じ位置に重ねて、1 つの名前で呼べるようにしたもの。
//
// ---- なぜここにあるか ----
//
// 打楽器にノイズを添えて空気を足す、というのは**当時からの定番**で、
// うちのゲームの効果音も 31 個のうち 27 個が手で重ねたものになっている。
// 定番はシステムが持つ、というのが指針
// (docs/SOUND_TOOL.md の「演出と作曲を分ける」)。
//
// ---- 重ねられるのは同じリズムのものだけ ----
//
// 1 つの音符から全部が同時に鳴る。**別のリズムで鳴らしたいものは、
// いままでどおりトラックを分けて書く。**
// 例えば `beatTune()` のハットは 16 分で 8 回、重ねるノイズは 3 回しか
// 置いていないので、あれは合成音色にできない。
//
// ---- 枠の数え方 ----
//
// 合成音色は **1 音ではなく、重ねたもののぶんだけ枠を食う。**
// 下の `layerKickAir` なら「FM 1 + ノイズ 1」。
// 数えているのは `tool/core/machines.js` の `voiceCount()`
// (docs/ENGINE_TODO.md の「声の取り合い」)。
//
// ---- 何と何を重ねて何声かは、説明の頭に自分で入る ----
//
// `registerLayer()` が `desc` / `descJa` の頭へ書き足す。
// **手で書かせると層を変えたときに古くなる。**

import { registerLayer, registerFamily, findWave } from './mml.js';

/**
 * 最初から入れておく合成音色。
 *
 * **説明には音のことだけ書く。**何と何を重ねて何声かは
 * `registerLayer()` が頭へ足すので、ここでは繰り返さない。
 */
// ---- PSG どうしを重ねたもの ----
//
// **エフェクトの `@d`(ずらす)と `@s`(こだま)と同じことを、音色としてやる。**
//
// **違いは枠を食うこと。**エフェクトは鳴らす側の入 / 切で、切っても曲は
// 変わらないので**声の勘定には入らない**。こちらは 2 声を使うと宣言して
// 重ねるので、**声が足りなければ譲る側に回る**
// (docs/ENGINE_TODO.md の「声の取り合い」)。
// レジスタを直に書く道具へ渡すときも、**2 本ぶんとして渡る。**
//
// ---- 掛け合わせなので、表から作る ----
//
// ずらすのと遅らせるのは同時に掛かる。**8 通りを手で書くと、
// 同じ文が 8 回並んで、直すときに 1 つ書き忘れる。**
// 軸を 2 本置いて、説明もそこから組み立てる。
//
// **両方なしだけ置かない。**それはただの `pulse(50)`。
//
// **幅は 3 つ。**50% は AY-3-8910 でも鳴るが、細い幅は幅を持てるチップだけ。

/**
 * ずらす量。`c` はセント。
 *
 * **日本語は繋ぎ方が変わる**ので、単独で使う形(`alone`)と、
 * こだまと組にするときの前半(`lead`)を別に持つ。
 * 継ぎ足しで作ると「ずらしてたうえで」のような文になる。
 */
const DETUNE_STEPS = [
  { key: '', value: 'none', c: 0, en: 'no detune' },
  { key: 'Soft', value: 'soft', c: 8,
    alone: '8 セントずらして重ねたもの', lead: '8 セントずらしたうえで',
    tail: 'うねりがゆっくりで、厚みだけが付く',
    en: 'eight cents apart, slow enough that the beating reads as body and nothing else' },
  { key: 'Wide', value: 'wide', c: 20,
    alone: '20 セントずらして重ねたもの', lead: '20 セントずらしたうえで',
    tail: 'うねりが聞き取れて、2 本鳴っていると分かる',
    en: 'twenty cents apart, close enough to hear the beating and tell there are two of them' },
];

/** 遅らせる量。`f` はフレーム(60 分の 1 秒) */
const ECHO_STEPS = [
  { key: '', value: 'none', f: 0, en: 'no delayed copy' },
  { key: 'Near', value: 'near', f: 7,
    alone: '7 フレーム(0.12 秒)遅らせて小さく重ねたもの', mid: '7 フレーム(0.12 秒)遅らせたもの',
    tail: '声が 1 本しかないところに置くと、それだけで広く聞こえる',
    en: 'a quieter copy seven frames (0.12s) behind \u2014 on a part with nobody beside it, this alone opens up the space' },
  { key: 'Far', value: 'far', f: 12,
    alone: '12 フレーム(0.2 秒)遅らせて小さく重ねたもの', mid: '12 フレーム(0.2 秒)遅らせたもの',
    tail: 'はっきり返りとして聞こえるので、速い刻みでは前の音と当たる',
    en: 'a quieter copy twelve frames (0.2s) behind \u2014 clearly a return, so in fast passages it collides with the note before' },
];

/**
 * 幅。**細いほうから太いほうへ性格が変わる**ので、3 つとも要る。
 *
 * **50% だけは AY-3-8910 で鳴る。**細い幅は幅を持たないチップでは出せないので、
 * 12.5% と 25% は SCC やファミコンの側の音になる
 * (どこで鳴るかは `tool/core/machines.js` が音の作りから割り出す)。
 */
const DUTY_STEPS = [
  { key: '50', wave: 'pulse(50)', ja: '矩形波', en: 'squares' },
  { key: '25', wave: 'pulse(25)', ja: '幅 25% の矩形波', en: 'quarter-width pulses' },
  { key: '12', wave: 'pulse(12)', ja: '幅 12.5% の矩形波', en: 'eighth-width pulses' },
];

/**
 * 掛け合わせを作る。**両方なしは作らない**(ただの矩形波なので)。
 *
 * 3 幅 × (ずらし 3 × こだま 3 − 両方なし)= **24 個**。
 *
 * ---- 名前 ----
 *
 * **数字を並べない。**`layerDetuneEcho20e12` は、20 も 12 も単位が違うのに
 * 並んで見えて、どちらがどちらか読めなかった。
 * **幅だけ数字、あとは言葉**にする — `layerPair(50, wide, far)` なら
 * 「幅 50%・大きくずらして・遠くで返る」と読める。
 *
 * 軸は 3 本(`width` `detune` `echo`)で、仲間として登録する(`layerPairFamily`)。
 * `none` は ずらし にも こだま にもあるので、書くときは軸の名前を付ける
 * (`layerPair(25, detune: none, far)`)。両方 `none` は組み合わせとして断る。
 *
 * **効きの強いほうから並べる。**作り分けの札を左から押していくと
 * だんだん薄くなる。**いちばん左が既定**なので、押さずに聞こえるのは
 * いちばんはっきりしたもの — 何をする音色なのかが 1 回で分かる。
 */
function detuneEchoPresets() {
  const out = {};
  for (const w of DUTY_STEPS) {
    for (const d of [...DETUNE_STEPS].reverse()) {
      for (const e of [...ECHO_STEPS].reverse()) {
        if (!d.c && !e.f) continue;
        // 名前は仲間の決まった形(`none` だけ軸の名前を付ける)
        const name = `layerPair(${w.key}, ${d.c ? d.value : 'detune: none'}, ${e.f ? e.value : 'echo: none'})`;
        const both = d.c && e.f;
        const what = both ? '@d と @s' : d.c ? '@d' : '@s';
        out[name] = {
          layers: [
            { wave: w.wave },
            { wave: w.wave, gain: e.f ? 0.3 : 0.6, cents: d.c, delay: e.f },
          ],
          role: 'lead',
          tags: ['psg', 'layer'].concat(d.c ? ['detune'] : []).concat(e.f ? ['echo'] : []),
          descJa: w.ja + 'を '
                + (both ? `${d.lead}、${e.mid}。${d.tail}。${e.tail}` : `${d.alone || e.alone}。${d.tail || e.tail}`)
                + `。エフェクトの ${what} と同じことを、枠を食う側でやる`,
          desc: 'Two ' + w.en + ', ' + (both ? d.en + ', and ' + e.en : (d.en || e.en))
              + '. The same thing ' + (both ? '@d and @s do together' : d.c ? '@d does' : '@s does')
              + ', on the side that costs voices.',
        };
      }
    }
  }
  return out;
}

/**
 * `layerPair( )` の仲間。軸と値の説明は `describeVoice()` が返す。
 * 既定は、いちばん効きの強い `50, wide, far`
 */
export function layerPairFamily() {
  return {
    desc: 'Two pulses of the same width, the second detuned and/or delayed. '
        + 'The same thing @d and @s do, but as a voice that costs two channels.',
    params: [
      { name: 'width', default: '50', desc: 'Pulse width of both layers, in percent.',
        values: DUTY_STEPS.map((w) => ({ value: w.key, desc: `Two ${w.en}.` })) },
      { name: 'detune', default: 'wide', desc: 'How far apart the second layer is tuned.',
        values: [...DETUNE_STEPS].reverse().map((d) => ({ value: d.value, desc: d.en })) },
      { name: 'echo', default: 'far', desc: 'How far behind the second layer comes in, quieter.',
        values: [...ECHO_STEPS].reverse().map((e) => ({ value: e.value, desc: e.en })) },
    ],
    // 両方なしは、ただの矩形波(`pulse( )`)なので作らない
    forbid: [{ detune: 'none', echo: 'none' }],
  };
}

export const LAYER_PRESETS = {
  // **バスドラムに空気を足す。**FM の 2 オペで作った胴の音は線が細く、
  // 単体だと「コッ」で終わってしまう。高いところへノイズを薄く重ねると、
  // 皮が鳴ったあとの空気が付いて「ドッ」になる。
  //
  // **ノイズは小さく。**それだけ聞くと意味が無いくらいの量でよく、
  // 大きくすると胴ではなくシンバルに聞こえ始める。
  //
  // **`@e{snap}` で早く消す。**打楽器に添えるものは伸ばす意味が無いうえ、
  // **鳴り終われば枠を返せる**。声が足りないところでは、
  // 添え物が席を握ったままでいるのがいちばん困る
  layerKickAir: {
    layers: [
      { wave: 'opll::kick' },
      { wave: 'noise', gain: 0.34, semi: 24, follow: false, env: 'snap' },
    ],
    role: 'perc',
    tags: ['drum', 'kick', 'layer'],
    descJa: 'バスドラムに、高いノイズを薄く重ねたもの。FM だけの胴は線が細くて「コッ」で終わるが、'
          + '空気が付くと「ドッ」になる',
    desc: 'A kick with a thin layer of high noise over it. The FM body alone stops at a click; '
        + 'the air on top turns it into a thud.',
  },
  // ---- PSG どうしを重ねたものは、下で作って混ぜる ----

  // **FM の頭に PSG を短く足す。**FM の 2 オペは立ち上がりが丸く、
  // 前へ出したいときに音量を上げると、伸びているところまで一緒に大きくなる。
  //
  // **頭だけ矩形波を重ねると、輪郭が立って音量は変わらない。**
  // `@e{tap}` を着せてあるので、**強く立ち上がって、少し残ってから消える**。
  //
  // **0.12 秒で落ちきる。**`pluck` のように伸ばしっぱなしにすると、
  // 音符が長いあいだずっと 2 声めが乗ったままになり、
  // **頭が立つのではなく全体が大きくなる**。少し残ってから消えるほうが、
  // FM へ引き継いだように聞こえるし、**枠も早く返せる**
  //
  // **1 オクターブ上に重ねる。**同じ高さで重ねると FM とほとんど同じ音になり、
  // 「厚くなった」ではなく「大きくなった」に聞こえる。上へ置くと倍音の並びが
  // 別になるので、頭が立ったことが音の高さの側で分かる
  //
  // **幅は 50%。**AY-3-8910 は幅を持たないので、細い矩形波にすると
  // **SCC が挿さっている MSX でしか鳴らなくなる**。50% なら
  // MSX + MSX-MUSIC で鳴る — FM は拡張、PSG は本体にあるので、
  // **足すぶんに元手が要らない**という、実機でよくやっていた形になる
  layerBrassBite: {
    layers: [
      { wave: 'opll::trumpet' },
      { wave: 'pulse(50)', gain: 0.6, semi: 12, follow: false, env: 'tap' },
    ],
    role: 'lead',
    tags: ['brass', 'attack', 'layer'],
      descJa: 'FM のブラスの頭に、1 オクターブ上の矩形波を強く重ねたもの。はじいたように立ち上がってすぐ落ち、'
          + 'わずかに残ってから FM に引き継ぐ',
    desc: 'FM brass with a square wave an octave above struck hard over the attack. It snaps up, drops away and leaves '
        + 'a trace behind before the FM takes over.',
  },
};

/**
 * 最初から入れておく(`ChipTuneSound` が読み込まれるときに走る)。
 * **二度呼ばれても止まらない**(理由は tones.js の同じところ)。
 *
 * **重ねる相手が先に居ること**が要るので、ほかの音色を登録したあとに呼ぶ。
 */
export function registerDefaultLayers() {
  registerFamily('layerPair', layerPairFamily());
  const has = (n) => findWave(n) >= 0;
  const all = { ...LAYER_PRESETS, ...detuneEchoPresets() };
  for (const [name, spec] of Object.entries(all)) {
    if (has(name)) continue;
    // 重ねる相手がまだ居ないものは飛ばす。音源を分けて読み込むので、
    // OPLL を重ねたものは OPLL が入ってから並ぶ(`opllpresets.js` が呼び直す。
    // 2026-10-18)
    if ((spec.layers || []).some((m) => !has(m.wave))) continue;
    // 重ねたものの版は、重ねたもの自身の約束。中身の版は registerLayer が
    // 層ごとに記録する(`ver`)。どれも中身が版 1 なので、こちらも版 1
    registerLayer(name, { version: '1.00', ...spec });
  }
}
