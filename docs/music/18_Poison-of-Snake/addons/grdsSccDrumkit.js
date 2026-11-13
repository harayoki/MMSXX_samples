/**
 * GameNotes - A drum kit after the Konami SCC years on MSX.
 * Addon: gamenotes::grdsSccDrumkit (v1.0.0)
 *
 * MSX のコナミ作品が SCC 中期に使っていたドラムを再現した一式。目指したのは
 * グラディウスの SCC 版で、同じ作りが沙羅曼蛇やパロディウスにも入っている。
 * 実際のゲームの音の聞こえ方と、データ値の両方を参考にして作り直した。
 * PCM やエミュレートでの再現ではない。
 *
 * 打楽器は PSG の 1 声に収まる。頭がトーン、尾がノイズで、音量レジスタを
 * ハードウェアエンベロープとソフトで持ち替える(`@ay{ mix … vol … env … }`)。
 * タムタムだけ SCC の正弦波なので、PSG の 3 声を取らない。
 *
 * 調べた中身は docs/STUDY_KONAMI_SCC.md にある。
 */
import { registerAddon } from '#sound/addon.js';
import { registerVoice, AY_ENV_SHAPES } from '#sound/mml.js';
import { AY_CLOCK } from '#sound/ay.js';

const ID = 'gamenotes::grdsSccDrumkit';
const v = (name) => `${ID}::${name}`;

/** `env{hit 59.5ms}` と同じもの。32 段を落ちきるまでの ms をレジスタの値へ */
const hit = (ms) => {
  const s = AY_ENV_SHAPES.hit;
  return { shape: 'hit', r13: s.r13, ep: Math.round((AY_CLOCK * ms) / 1000 / s.div) };
};

/** 表の入れ物。`registerAY` が作るものと同じ形にそろえる */
const tone = (extra = {}) => ({
  arp: null, pitch: null, vol: null, duty: null, dutyLfo: null, slide: null, vib: null,
  loop: {}, ...extra,
});

/**
 * PSG の打楽器を 1 つ。`mix` が R7、`np` が R6、`vol` が R8、`env` が R11〜R13。
 * どれも 1 フレームに 1 つで、音の頭から読む
 */
const perc = (name, { mix, np = [16], vol, env = [], pitch = null, ver = '1.00' }, desc) =>
  registerVoice(name, 'ay', {
    mode: 'tone',
    tone: tone({ mix, np, ayVol: vol, ayEnv: env, pitch }),
  }, { role: 'perc', tags: ['msx'], vsteps: 16, vcurve: '3db', version: ver, desc });

/** 1 打が 6 フレームの正弦波。高さの下がりは片道の移動で持つ */
const SINE = [0, 25, 49, 71, 90, 106, 117, 125, 127, 125, 117, 106, 90, 71, 49, 25,
  0, -25, -49, -71, -90, -106, -117, -125, -128, -125, -117, -106, -90, -71, -49, -25];

registerAddon({
  id: ID,
  version: '2.0.0',
  desc: 'A drum kit rebuilt after the Konami SCC years on MSX, aimed at the SCC Gradius sound. '
    + 'Each drum fits one PSG channel: a tone attack on the chip envelope, then a noise tail on '
    + 'software volume. The tom is an SCC sine, so it leaves all three PSG channels free. '
    + 'Rebuilt by ear against the data, not sampled and not emulated.',
  needs: ['ay', 'scc'],
  engine: '>=0.76.0',
  voices: [
    v('kick'), v('kickBig'),
    v('snare'), v('snareSoft'), v('snareBig'),
    v('hat'), v('hatLight'),
    v('tom'),
  ],
}, () => {
  // バスドラム。トーンだけをエンベロープで落としながら、高さを 4 半音下げる。
  // 書く音は落ちはじめの高さ。実機は 73Hz から 54.6Hz へ落ちるので o2 d と書く
  perc(v('kick'), {
    mix: ['t', 't', 't', '-'], vol: [16], env: [hit(59.5)], pitch: [0, -267, -498],
    ver: '2.00',
  }, 'Bass drum. The tone falls four semitones while the chip envelope takes it down over sixty '
   + 'milliseconds, then the channel closes. Write the note at the pitch the fall starts from.');

  // 太いバスドラム。落ちきるまでを 100ms に伸ばしたもの。音量は上げられない
  // (エンベロープが握っていて、必ず最大から落ちる)ので、長さで太くする
  perc(v('kickBig'), {
    mix: ['t', 't', 't', 't', 't', 't', '-'], vol: [16], env: [hit(100)], pitch: [0, -267, -498],
    ver: '2.00',
  }, 'The same bass drum with the envelope stretched to a hundred milliseconds. Volume cannot go '
   + 'higher than the envelope already is, so length is what makes it bigger.');

  // スネア。頭の 1 フレームがトーンでエンベロープ、そのあとノイズをソフトで下げる。
  // ノイズの粗さを 7 から 3 へ変えると、尾のほうが明るくなる
  perc(v('snare'), {
    mix: ['t', 'n', 'n', 'n', 'n', '-'], np: [7, 7, 7, 3, 3], vol: [16, 8, 8, 7, 6, 0],
    env: [hit(29.8)],
  }, 'Snare. One frame of tone on the chip envelope, then a noise tail faded in software. The '
   + 'noise period moves from seven to three, so the tail is brighter than the attack.');

  // 弱打。同じ形で、頭もソフト音量。実機は強打と交互に使っていた
  perc(v('snareSoft'), {
    mix: ['t', 'n', 'n', 'n', 'n', '-'], np: [3, 7, 7, 3, 3], vol: [8, 8, 8, 6, 6, 0],
  }, 'The same snare without the chip envelope, so the attack is as quiet as the tail. A ghost '
   + 'note to put between the louder ones.');

  // 強打。胴を太くしたもの。頭は変えない(エンベロープがすでに最大)。
  // 胴を 13 より上から始めると頭より大きくなって、音量が下がらずに上がる
  perc(v('snareBig'), {
    mix: ['t', 'n', 'n', 'n', 'n', 'n', '-'], np: [7, 7, 7, 3, 3, 3],
    vol: [16, 13, 12, 11, 10, 9, 0], env: [hit(29.8)],
  }, 'A fuller snare: the same attack with a louder, longer tail. The attack cannot go higher, so '
   + 'only the tail changes.');

  // ハイハット。ノイズをソフトで 5 フレーム下げる
  perc(v('hat'), {
    mix: ['n', 'n', 'n', 'n', 'n', '-'], np: [8], vol: [10, 9, 8, 7, 6, 0],
  }, 'Hi-hat. Noise faded over five frames in software, with no chip envelope.');

  // 軽いハイハット。同じ作りで 2 フレームだけ。刻みに使う
  perc(v('hatLight'), {
    mix: ['n', 'n', '-'], np: [1], vol: [9, 7, 0],
  }, 'A lighter hi-hat: the same thing over two frames, for the off-beats.');

  // タムタム。SCC の正弦波。高さを 3 半音半ぶん落としながら音量も落とす。
  // 表ではなく片道の移動で持つので、どの高さでも同じ割合で落ちる。
  // 書く音は落ちはじめの高さ。`@slide` は書いた高さより上から落ちてくるので、
  // 同じだけ下げてから落とす
  registerVoice(v('tom'), 'scc', {
    wave: SINE.slice(),
    tone: tone({ pitch: [-360], slide: { cents: 360, frames: 6, curve: 2 },
      vol: [15, 13, 12, 11, 10, 9, 0] }),
  }, { role: 'perc', tags: ['msx'], vsteps: 16, vcurve: 'linear', version: '2.00',
    desc: 'Tom. An SCC sine whose pitch falls three and a half semitones over six frames while '
      + 'the volume fades. Write the note at the pitch the fall starts from. It uses an SCC '
      + 'channel, so all three PSG channels stay free.' });
});
