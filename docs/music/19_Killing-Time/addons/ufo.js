/**
 * Sound effect voices: metallic, wobbling ring-modulated tones for risers and falls.
 * Addon: ufo (v0.1.0)
 * Built on the subtractive synth, so the analog source is required.
 */
// 効果音っぽい音色をまとめるアドオン(2026-11-14)。名前は仮。
// はじめ analog の euroUfo として作った 2 つを、ユーロビートの音ではないので外へ出した。
// ユーロビートでよく使うつなぎはノイズの「シュワー」(euroRiser・euroDownlifter)で、
// こちらは SF の効果音に近い。どちらもリングモジュレーターの金属音を強く揺らす。
//
//   ufo::sweep    音の高さが 3 オクターブ鋭く動く。組なしは上から落ちて消える
//   ufo::machine  音の高さは動かさず、開き方と大きさでじわじわ上げ下げする。機械音のように聞こえる
//
// はじめは 1 つの音色の組だった(euroUfo の組 fall)。波形が同じで数だけ違うので組にしたが、
// 聞くと鋭く動く音と機械音で別のものなので分けた。音色の分け方は、値ではなく聞こえ方で決める。
// 大きさは docs/FILTER.md の決めごとどおり、o4 c を 3 小節(t160)伸ばして測り、
// −21.4 LUFS か、山が −6 dBFS に届くところで止めた
import { registerAddon } from '#sound/addon.js';
import { registerAnalogPatch } from '#sound/analog.js';

/** 2 つに共通する金属音。リングモジュレーターを強く揺らす */
const METAL = {
  wave: 'ring', octave: 0,
  filter: { kind: 'lowpass', cutoff: 300, resonance: 0.5, drive: 0 },
  lfo: { depth: 0.6, rate: 7, shape: 'sine' },
  osc: { ring: 1, ringRatio: 1.41 },
  chorus: { mix: 0.6, rate: 0.3, depth: 6 },
  reverb: { time: 4, mix: 0.4 },
};

const VOICES = ['ufo::sweep', 'ufo::machine'];

registerAddon({
  id: 'ufo',
  version: '0.1.0',
  desc: 'Sound effect voices for risers and falls: wobbling metallic ring-modulated tones, closer to science fiction than to eurobeat.'
    + ' sweep moves its pitch sharply over three octaves; machine keeps its pitch and rises and falls by opening and swelling, almost mechanical.',
  needs: ['analog'],
  engine: '>=0.89.0',
  voices: VOICES,
}, () => {
  // 組なしは 3 オクターブ上から鋭く落ちて消える音(はじめの euroUfo の組 fall)。
  // euroDownlifter の組 space の代わりにも使える
  registerAnalogPatch('ufo::sweep', {
    ...METAL,
    fenv: { amount: 5, attack: 0.001, decay: 1.2, sustain: 0 },
    amp: { attack: 0.005, decay: 1.6, sustain: 0, release: 0.4 },
    level: 0.53,
    pitch: { vibrato: 40, rate: 7, drop: 36, dropTime: 0.8, rise: 0, riseTime: 2, sink: 0, sinkTime: 2 },
  }, {
    role: 'noise', version: '1.00',
    desc: 'Sweeping fall: a sharp, wobbling metallic ring-modulated tone, starting three octaves above the note and sinking to it while it fades, over about 2 seconds. Two more settings over the same three octaves: climb, its reverse, rising from the note to three octaves above, and climbFall, which climbs and sinks back down.',
    presets: {
      // 組なしと同じ高さの幅を使う。組なしは書いた音の 3 オクターブ上から書いた音へ落ちるので、
      // こちらは書いた音から 3 オクターブ上へ上がる(octave 3 で上げて、pitch.rise で 3 オクターブ下から始める)。
      // はじめは書いた音の 3 オクターブ下から上がっていて、低いところで鳴るので別の音に聞こえた
      climb: {
        desc: 'The reverse of the plain setting, over the same three octaves: starts at the note and climbs three octaves above it over 2 seconds while it opens and swells, then holds',
        set: { octave: 3, 'fenv.attack': 2, 'fenv.decay': 1, 'fenv.sustain': 1, 'amp.attack': 2, 'amp.decay': 1, 'amp.sustain': 1, 'pitch.drop': 0, 'pitch.rise': 36, 'pitch.riseTime': 2, level: 0.231 },
      },
      climbFall: {
        desc: 'Climbs from the note to three octaves above it over 2 seconds while it swells, then sinks back to the note over 2 seconds while it fades. Hold the note for about 4 seconds',
        set: { octave: 3, 'fenv.attack': 2, 'fenv.decay': 2, 'fenv.sustain': 0, 'amp.attack': 2, 'amp.decay': 2, 'amp.sustain': 0, 'pitch.drop': 0, 'pitch.rise': 36, 'pitch.riseTime': 2, 'pitch.sink': 36, 'pitch.sinkTime': 2, level: 0.362 },
      },
    },
  });
  // 音の高さは動かさず、フィルターと音量で上がって聞かせる。機械音のように聞こえる
  registerAnalogPatch('ufo::machine', {
    ...METAL,
    fenv: { amount: 5, attack: 3, decay: 1, sustain: 1 },
    amp: { attack: 3, decay: 1, sustain: 1, release: 0.4 },
    level: 0.5,
    pitch: { vibrato: 40, rate: 7 },
  }, {
    role: 'noise', version: '1.00',
    desc: 'Metallic rise: a wobbling ring-modulated tone, almost mechanical, that opens and swells over about 3 seconds and then holds. The pitch stays on the note; for one that moves, see ufo::sweep. Two more settings: close, which starts open and closes and fades, and openClose, which goes up and comes back down.',
    presets: {
      close: {
        desc: 'Starts open and bright, then closes and fades over about 2 seconds, the reverse of the plain setting. The pitch does not move',
        set: { 'fenv.attack': 0.001, 'fenv.decay': 1.2, 'fenv.sustain': 0, 'amp.attack': 0.005, 'amp.decay': 1.6, 'amp.sustain': 0, level: 0.42 },
      },
      openClose: {
        desc: 'Opens and swells for 2 seconds, then closes and fades for 2 seconds, without the pitch moving. Hold the note for about 4 seconds',
        set: { 'fenv.attack': 2, 'fenv.decay': 2, 'fenv.sustain': 0, 'amp.attack': 2, 'amp.decay': 2, 'amp.sustain': 0, level: 0.446 },
      },
    },
  });
});
