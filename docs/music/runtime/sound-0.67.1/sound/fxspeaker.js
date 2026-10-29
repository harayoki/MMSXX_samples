// 小さいスピーカー。全体かチャンネルかバスに掛けるエフェクト(2026-10-29)。
//
// テレビの内蔵スピーカーやラジカセから鳴っているように聞かせる。
// チップチューンは実機のころ、良いヘッドフォンでは聞かれていなかった。
// 作るときにその側で確かめられるようにするためのもの。
//
// - 帯を狭める。2 極のハイパスと 2 極のローパス。低いほうは箱が鳴らせない帯、
//   高いほうはコーンが追えない帯
// - 箱とコーンの山を 1 つ足す。ピーキングの双二次で、`peak` の高さに `peakDb` だけ持ち上げる。
//   小さいスピーカーが中域に持つ癖で、これが無いと「ただ帯の狭い音」になる
// - 大きいところでコーンが割れる(`drive`)。saturator と同じ形(tanh(g x) / g)で、
//   帯を狭めたあとに掛ける。割れて出た倍音はそのまま出す(実物も出す)
//
// `box` で癖をまとめて選ぶ。中の 4 つ(`low` `high` `peak` `peakDb`)を書けば、そちらが勝つ。
//
// **測ったものではない。** 実物のスピーカーのインパルス応答を録ったわけではなく、
// 「それらしい音」になるように組んだフィルタの並び。本物に寄せるなら、
// 録音を測って `docs/CHECK.md` の物差しで合わせるところからになる。

/** speaker の処理器の名前 */
export const SPEAKER_NODE = 'mmsxx-speaker';

/**
 * 箱ごとの癖。`[low, high, peak, peakDb]`。
 *
 * どれも測った数ではない。小さいスピーカーの作りから見当を付けた値で、
 * 耳で聞いて決めた
 */
export const SPEAKER_BOXES = [
  [180, 7000, 800, 6],     // tv
  [120, 9000, 500, 4],     // boombox
  [500, 10000, 1200, 8],   // phone
  [350, 12000, 1000, 6],   // laptop
];

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const SPEAKER_FX = {
  speaker: {
    tags: ['lofi', 'filter', 'mixing'], dev: ['wip'], version: '0.1',
    desc: 'Small, cheap speaker. The sound is narrowed to the band such a speaker can move, given the mid-range bump that a small box and cone always have, and driven until the cone breaks up on the loud parts. Use it to hear the tune the way most people will, next to the clean version. It is not an impulse response of a real speaker: it is a filter chain built to sound like one.',
    params: {
      box: {
        live: false, min: 0, max: 3, default: 0,
        desc: 'Which speaker: a number, rounded to a whole one, or the name of one of the choices. It sets low, high, peak and peakDb together; write any of those to override it.',
        choices: [
          { value: 0, name: 'tv', desc: 'The speaker inside an old television: 180 Hz to 7 kHz with a bump at 800 Hz. What an MSX actually sounded like.' },
          { value: 1, name: 'boombox', desc: 'A portable cassette radio: 120 Hz to 9 kHz with a bump at 500 Hz. The widest of the four.' },
          { value: 2, name: 'phone', desc: 'The speaker in a phone: 500 Hz to 10 kHz with a strong bump at 1.2 kHz. No bass at all.' },
          { value: 3, name: 'laptop', desc: 'A laptop speaker: 350 Hz to 12 kHz with a bump at 1 kHz.' },
        ],
      },
      low: { live: false, unit: 'Hz', min: 0, max: 2000, default: 0, desc: 'Lowest pitch the speaker can move. 0 takes the value from box.' },
      high: { live: false, unit: 'Hz', min: 0, max: 20000, default: 0, desc: 'Highest pitch the speaker can follow. 0 takes the value from box.' },
      peak: { live: false, unit: 'Hz', min: 0, max: 8000, default: 0, desc: 'Where the box and the cone ring. 0 takes the value from box.' },
      peakDb: { live: false, unit: 'dB', min: -1, max: 18, default: -1, desc: 'How far that ring lifts the sound. -1, the default, takes the value from box; 0 removes the bump.' },
      drive: { live: false, min: 0, max: 1, default: 0.25, desc: 'How soon the cone breaks up, as in saturator. 0 is clean; at 1 the loud parts are harsh and the attack of drums is gone.' },
      mix: { live: false, min: 0, max: 1, default: 1, desc: 'How much of the sound goes through the speaker, from 0 (the dry sound alone) to 1 (the speaker alone).' },
    },
  },
};

/**
 * speaker の処理器。入口 1 つ、出口 1 つ。チャンネルごとに状態を持つ。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const SPEAKER_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(SPEAKER_FX.speaker.params).map(([k, v]) => [k, v.default])))};
const BOX = ${JSON.stringify(SPEAKER_BOXES)};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// 2 極(Butterworth)の係数。RBJ の形
const biquad = (hp, f) => {
  const w0 = 2 * Math.PI * Math.min(f, sampleRate * 0.45) / sampleRate;
  const al = Math.sin(w0) / Math.SQRT2, c = Math.cos(w0), a0 = 1 + al;
  const b = hp ? [(1 + c) / 2, -(1 + c), (1 + c) / 2] : [(1 - c) / 2, 1 - c, (1 - c) / 2];
  return { b0: b[0] / a0, b1: b[1] / a0, b2: b[2] / a0, a1: -2 * c / a0, a2: (1 - al) / a0 };
};
// ピーキング(山)の係数。RBJ の形。Q は 1.2 で固定(箱の鳴りはこのくらい)
const peaking = (f, db) => {
  const A = Math.pow(10, db / 40);
  const w0 = 2 * Math.PI * Math.min(f, sampleRate * 0.45) / sampleRate;
  const al = Math.sin(w0) / (2 * 1.2), c = Math.cos(w0), a0 = 1 + al / A;
  return { b0: (1 + al * A) / a0, b1: -2 * c / a0, b2: (1 - al * A) / a0,
    a1: -2 * c / a0, a2: (1 - al / A) / a0 };
};
// 直接形 II 転置で 1 サンプル。s は [z1, z2]
const step = (k, s, x) => {
  const y = k.b0 * x + s[0];
  s[0] = k.b1 * x - k.a1 * y + s[1];
  s[1] = k.b2 * x - k.a2 * y;
  return y;
};
class Speaker extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    const box = BOX[clamp(Math.round(v('box', 0, 3)), 0, BOX.length - 1)];
    // 0(peakDb は負)なら箱の値を使う。書いてあればそちらが勝つ
    const low = v('low', 0, 2000) || box[0];
    const high = v('high', 0, 20000) || box[1];
    const peak = v('peak', 0, 8000) || box[2];
    const peakDb = v('peakDb', -1, 18) < 0 ? box[3] : v('peakDb', -1, 18);
    const drive = v('drive', 0, 1);
    this.g = drive > 0 ? Math.pow(10, drive * 24 / 20) : 0;
    // 丸めると大きい音が下がるので、半分ほど戻す(radio と同じ)
    this.up = this.g ? Math.sqrt(this.g) : 1;
    this.mix = v('mix', 0, 1);
    this.hp = biquad(true, low);
    this.lp = biquad(false, Math.max(low * 2, high));
    this.pk = peakDb > 0 ? peaking(peak, peakDb) : null;
    this.st = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, g = this.g, up = this.up, mix = this.mix;
    const hp = this.hp, lp = this.lp, pk = this.pk;
    for (let c = 0; c < out.length; c++) {
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      if (!x) { y.fill(0); continue; }
      if (mix === 0) { y.set(x); continue; }
      const s = this.st[c] || (this.st[c] = [[0, 0], [0, 0], [0, 0]]);
      for (let i = 0; i < len; i++) {
        let z = step(lp, s[1], step(hp, s[0], x[i]));
        if (pk) z = step(pk, s[2], z);
        if (g) z = Math.tanh(g * z) / g * up;
        y[i] = x[i] * (1 - mix) + z * mix;
      }
    }
    return true;
  }
}
registerProcessor('${SPEAKER_NODE}', Speaker);
`;
