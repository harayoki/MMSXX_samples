// サイドチェイン。チャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// ほかのチャンネルかバス(キーと呼ぶ。キックが多い)が鳴るたびに、掛けた側の音量を下げる。
// ハウスやダンス曲の「ポンピング」に使う。DAW と同じく、下げる仕掛けは掛かる側に置き、
// 下げるかどうかを決める音(キー)は別の元から取る。キーの元は `#sidechain` の行で名指しする
// (sound/mml.js の `readSidechainLine` と `routeOf`、sound/audio.js の `_busWire`)。
//
// 作りは 2 つに分けてある。キーを聞いて「いまの音量の倍率」を出す処理器と、
// その倍率を gain に受けて音を通す GainNode。音そのものは処理器を通らないので、
// 左右の本数は掛かる側のまま変わらない。
//
// - キーの大きさは、立ち上がりは即座に、下がりは 10ms で追う(山を拾う)
// - threshold を超えた量を 6dB の幅でならして、0〜1 の「どれだけ超えたか」にする
// - それに depth を掛けたものが、下げる深さ。attack で深くなり、release で戻る
//
// キーがつながっていなければ、倍率は 1 のまま。元の音がそのまま出る

/** sidechain の処理器の名前 */
export const SIDECHAIN_NODE = 'mmsxx-sidechain';

/** キーの山を追うときの、下がりの速さ(秒) */
export const SIDECHAIN_HOLD = 0.01;

/** threshold を超えてから、下げきるまでの幅(dB) */
export const SIDECHAIN_KNEE = 6;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const SIDECHAIN_FX = {
  sidechain: {
    tags: ['dynamics', 'rhythm'], dev: ['wip'], version: '0.1',
    desc: 'Sidechain ducking, the "pumping" of house music. Each time another channel or bus (the key, usually the kick) plays, this sound is turned down, then swells back. The key is named with a "#sidechain <effect> = <channel or bus>" line. Without a key the sound passes untouched. It works on channels and buses, not on the whole tune.',
    params: {
      depth: { live: false, min: 0, max: 1, default: 0.7, desc: 'How far the sound is turned down while the key plays, from 0 (not at all) to 1 (silence). 0.7 leaves about a third of the level, a clear pump.' },
      attack: { live: false, unit: 'ms', min: 0.1, max: 100, default: 5, desc: 'How fast the sound is turned down once the key plays, in milliseconds. Short values duck at once; longer ones let the start of this sound through.' },
      release: { live: false, unit: 'ms', min: 10, max: 1000, default: 150, desc: 'How fast the sound swells back after the key stops, in milliseconds. Around a beat less a little gives the breathing pump; short values only punch a hole.' },
      threshold: { live: false, unit: 'dB', min: -60, max: 0, default: -30, desc: 'How loud the key must be before the sound is turned down, in dB. Lower values react to quieter keys. The ducking reaches its full depth 6 dB above this level.' },
    },
  },
};

/**
 * sidechain の処理器。入口 1 つ(キー。1 本に畳んでつなぐ)、出口 1 つ(音量の倍率)。
 * 出口は掛かる側の GainNode の gain へつなぐ。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const SIDECHAIN_CODE = `
const HOLD = ${SIDECHAIN_HOLD};
const KNEE = ${SIDECHAIN_KNEE};
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(SIDECHAIN_FX.sidechain.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

class Sidechain extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    const sr = sampleRate;
    this.depth = v('depth', 0, 1);
    this.ca = Math.exp(-1 / (v('attack', 0.1, 100) / 1000 * sr));
    this.cr = Math.exp(-1 / (v('release', 10, 1000) / 1000 * sr));
    this.ch = Math.exp(-1 / (HOLD * sr));
    this.thr = Math.pow(10, v('threshold', -60, 0) / 20);
    this.env = 0;
    this.duck = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const key = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const y = out[0], len = y.length;
    const depth = this.depth, ca = this.ca, cr = this.cr, ch = this.ch, thr = this.thr;
    let env = this.env, duck = this.duck;
    for (let i = 0; i < len; i++) {
      // キーの山。左右があれば大きいほう
      let k = 0;
      if (key) for (let c = 0; c < key.length; c++) { const a = Math.abs(key[c][i]); if (a > k) k = a; }
      env = k > env ? k : env * ch;
      if (env < 1e-9) env = 0;
      const over = env > thr ? Math.min(1, 20 * Math.log10(env / thr) / KNEE) : 0;
      const target = depth * over;
      duck = target + (duck - target) * (target > duck ? ca : cr);
      y[i] = 1 - duck;
    }
    for (let c = 1; c < out.length; c++) out[c].set(y);
    this.env = env; this.duck = duck;
    return true;
  }
}
registerProcessor('${SIDECHAIN_NODE}', Sidechain);
`;
