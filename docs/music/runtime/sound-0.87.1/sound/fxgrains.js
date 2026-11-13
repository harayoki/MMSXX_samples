// グラニュラー。全体かチャンネルかバスに掛けるエフェクト(2026-10-30)。
//
// 入ってきた音を溜めておき、短いかけら(粒)を切り出して、エンベロープを掛けて重ねて鳴らす。
// DAW のグラニュラー(Ableton の Grain Delay、Lunacy Audio BEAM の Grains など)に見られる値の並びにした。
// BEAM の画面に見えた値は Rate、Size、Shape、Pitch、Spray、Width、Reverse、Detune(中身は確かめていない)。
//
// - 粒は 1 秒に rate 個、決まった間隔で切り出す。rate は Hz なので、MML の `@l 16` で間隔を音長にできる。
//   jitter は、その間隔を粒ごとに乱数でばらす量。1 で 0〜2 倍の範囲になる(平均の間隔は変わらない)
// - 粒の長さは size ms。粒ごとに shape のエンベロープを掛ける
// - 切り出す位置は、いまより spray ms までのどこか(粒ごとに乱数)。
//   高さを上げた粒は先を読むので、そのぶん前から切り出す(書く位置を追い越さないように)
// - 高さは pitch 半音。粒ごとに detune セントまでずらす。reverse は逆向きに読む粒の割合
// - pitchRandom は、粒ごとに高さを半音単位で上下へ散らす幅(Ableton の Grain Delay の Random Pitch にあたる)。
//   intervals は、決まった音程の組(octave なら 0 と +12)から粒ごとに 1 つ選んで跳ぶ。
//   pitch、pitchRandom、intervals を足した高さは ±36 半音で止める(先を読む粒が溜めた長さを越えないように)。
//   この 2 つの乱数は、ほかの乱数とは別の種から回す。前からある値の乱数の並びを変えないため(2026-10-30)
// - arp は、intervals の組から 1 つを取る順。random(既定)は乱数で選び、up down upDown は組を低いほうから順に回す(アルペジオ)。
//   組は「どの高さへ跳ぶか」、arp は「その組をどう回すか」で、同じことが 2 通りに書けないように分けた。
//   順は粒を出そうとするたびに 1 つ進む(2026-10-30)
// - jitter の乱数も、同じわけでさらに別の種から回す
// - gain は粒の音の大きさ(dB)。出口だけに掛け、feedback で戻すほうには掛けない
// - width はステレオのときだけ。粒ごとに左右の位置を乱数で決める
// - feedback は、粒を合わせた音を溜める側へ戻す。重ねるたびに粒の上に粒が溜まり、凍ったような伸びた音になる。
//   戻すところは tanh で丸め、際限なく大きくならないようにする
// - 同時に鳴る粒は GRAINS_MAX 個まで。いっぱいなら、その粒は出さない(重さを抑えるため)。
//   rate と size の上限で重なるのは 50 個なので、64 なら値の範囲では足りなくならない(2026-10-30 に 16 から上げた)。
//   粒を回すのは使っている枠のいちばん後ろまでなので、上限を上げても、粒の少ないときの重さは変わらない
// - 粒が重なるぶん、大きさを 1 / (重なりの数 × エンベロープの平均) で割る(1 を下回るときは割らない)。
//   pitch 0、spray 0、hann で size の半分ずつ重なると、元の音とほぼ同じになる
// - 乱数は決まった種から回す(xorshift)。作るたびに同じ並びになるので、鳴らすたびに、書き出しでも同じに鳴る。
//   粒 1 つで引く乱数の数は、値によらず同じにしてある(値を変えても、ほかの粒の乱数がずれない)
// - 溜めるのは左右を合わせた 1 本。粒は width で左右へ振る(真ん中で左右とも 1 になる等パワー)。
//   モノラルで出すときと溜める側へ戻すときは、振る前の粒を合わせたもの

/** grains の処理器の名前 */
export const GRAINS_NODE = 'mmsxx-grains';

/** 同時に鳴る粒の上限 */
export const GRAINS_MAX = 64;

/** 乱数の種。決めておくと、何度作っても同じ粒の並びになる */
export const GRAINS_SEED = 0x6a41;

/** 高さを散らす乱数(pitchRandom と intervals)の種。前からある値の乱数とは別に回す */
export const GRAINS_PITCH_SEED = 0x2545f491;

/** 粒の間隔をばらす乱数(jitter)の種。ほかの乱数とは別に回す */
export const GRAINS_JITTER_SEED = 0x1b873593;

/** 粒の高さ(pitch + pitchRandom + intervals)の上限と下限(半音) */
export const GRAINS_PITCH_LIMIT = 36;

/**
 * intervals の組(半音)。数の順に choices と揃える。
 * 粒ごとにこの中から 1 つを取り、pitch に足す。arp が random なら同じ割合で選び、ほかは低いほうから順に回す。
 * 5 から後ろ(major minor pentatonic)は arp で回すために加えた(2026-10-30)
 */
export const GRAINS_INTERVALS = [[0], [0, 12], [0, 7, 12], [0, -12], [0, 12, 19], [0, 4, 7, 12], [0, 3, 7, 12], [0, 2, 4, 7, 9, 12]];

/**
 * 溜めておく長さ(秒)。spray の上限(1 秒)と、高さを上げた粒が先を読むぶん
 * (+36 半音で 8 倍、size 500ms なら 3.5 秒)が入る
 */
const GRAINS_BUF = 5;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const GRAINS_FX = {
  grains: {
    tags: ['texture', 'sfx'], version: '0.1',
    // 実験。正式に作るかもまだ決めていない(2026-10-30)
    dev: ['experiment'],
    desc: 'Granular effect. The incoming sound is kept in a short memory, and small pieces of it (grains) are cut out, shaped with a fade in and out, and laid over each other. Grains can be pitched, scattered in time, reversed and spread across the speakers, which turns a plain sound into a shimmering cloud, a glitchy texture or, with feedback, a frozen drone. The random choices start from a fixed seed, so it sounds the same every time and in an export. In MML the time between grains can be a note length (@l 16).',
    params: {
      rate: { live: true, unit: 'Hz', min: 1, max: 100, default: 20, desc: 'Grains started per second. In MML, @l 16 starts one grain every sixteenth note of the tune. Rate times size sets how many grains overlap; at most 64 sound at once, and the rest are skipped.' },
      jitter: { live: true, min: 0, max: 1, default: 0, desc: 'How unevenly the grains are timed. 0 starts them at a steady rate; 1 makes each gap anywhere from none to twice the usual, chosen at random for each grain, so the grains come in bursts and pauses like bubbles. The average rate stays the same.' },
      size: { live: true, unit: 'ms', min: 10, max: 500, default: 100, desc: 'Length of each grain in milliseconds. Short grains sound buzzy and grainy; long ones smooth and smeared.' },
      shape: {
        live: true, min: 0, max: 3, default: 0,
        desc: 'Shape of the fade in and out on each grain: a number, rounded to a whole one, or the name of one of the choices (hann, triangle, trapezoid, percussive).',
        choices: [
          { value: 0, name: 'hann', desc: 'Smooth rise and fall. The softest, with no clicks.' },
          { value: 1, name: 'triangle', desc: 'Straight rise and fall. A little more edge than hann.' },
          { value: 2, name: 'trapezoid', desc: 'Short ramps at each end and full level in between. Grains keep most of their attack and sound choppy.' },
          { value: 3, name: 'percussive', desc: 'A fast rise and a long fall, so each grain sounds like a short struck note.' },
        ],
      },
      pitch: { live: true, unit: 'semitone', min: -24, max: 24, default: 0, desc: 'Pitch of the grains in semitones. 12 is an octave up. Only the grains change pitch; their timing stays the same.' },
      spray: { live: true, unit: 'ms', min: 0, max: 1000, default: 0, desc: 'How far back in time each grain may be cut from, in milliseconds, chosen at random for each grain. 0 always takes the latest sound; larger values scatter the grains and blur the rhythm.' },
      detune: { live: true, unit: 'cent', min: 0, max: 100, default: 0, desc: 'How far each grain may stray from pitch, up or down, in cents, chosen at random for each grain. Small values thicken the sound like a chorus.' },
      pitchRandom: { live: true, unit: 'semitone', min: 0, max: 24, default: 0, desc: 'How far each grain may jump from pitch, up or down, in whole semitones, chosen at random for each grain. Where detune thickens, this scatters the grains over a range of notes and turns the sound into a cluster or a cloud.' },
      intervals: {
        live: true, min: 0, max: 7, default: 0,
        desc: 'A set of intervals in semitones; each grain takes one of them, picked as arp says, and adds it to pitch. A number, rounded to a whole one, or the name of one of the choices (off, octave, fifth, octaveDown, shimmer, major, minor, pentatonic). Works together with pitchRandom. Pitch, pitchRandom and intervals together stop at 36 semitones up or down.',
        choices: [
          { value: 0, name: 'off', desc: 'Every grain stays at pitch.' },
          { value: 1, name: 'octave', desc: 'Grains at pitch or an octave above (0, +12).' },
          { value: 2, name: 'fifth', desc: 'Grains at pitch, a fifth above or an octave above (0, +7, +12). A power chord.' },
          { value: 3, name: 'octaveDown', desc: 'Grains at pitch or an octave below (0, -12). Adds weight underneath.' },
          { value: 4, name: 'shimmer', desc: 'Grains at pitch, an octave above or an octave and a fifth above (0, +12, +19). The bright halo of a shimmer reverb.' },
          { value: 5, name: 'major', desc: 'The notes of a major chord up to the octave (0, +4, +7, +12).' },
          { value: 6, name: 'minor', desc: 'The notes of a minor chord up to the octave (0, +3, +7, +12).' },
          { value: 7, name: 'pentatonic', desc: 'The major pentatonic scale up to the octave (0, +2, +4, +7, +9, +12). Any order sounds in tune.' },
        ],
      },
      arp: {
        live: true, min: 0, max: 3, default: 0,
        desc: 'How each grain takes its interval from the set in intervals, like the modes of an arpeggiator: a number, rounded to a whole one, or the name of one of the choices (random, up, down, upDown). The order moves one step per grain, so with rate set to a note length the grains play the set as an arpeggio. Does nothing while intervals is off.',
        choices: [
          { value: 0, name: 'random', desc: 'Each grain picks an interval at random.' },
          { value: 1, name: 'up', desc: 'From the lowest interval to the highest, then over again.' },
          { value: 2, name: 'down', desc: 'From the highest interval to the lowest, then over again.' },
          { value: 3, name: 'upDown', desc: 'Up and then back down, without playing the top and bottom twice.' },
        ],
      },
      reverse: { live: true, min: 0, max: 1, default: 0, desc: 'Share of grains played backwards, from 0 (none) to 1 (all).' },
      width: { live: true, min: 0, max: 1, default: 0.5, desc: 'How far the grains are scattered between left and right, chosen at random for each grain. 0 keeps them in the middle. It only shows when the player asks for stereo.' },
      feedback: { live: true, min: 0, max: 0.95, default: 0, desc: 'How much of the grains is fed back into the memory they are cut from. Higher values pile grains on grains and stretch the sound into a long, frozen wash.' },
      gain: { live: true, unit: 'dB', min: -24, max: 24, default: 0, desc: 'Level of the grains, in dB. Overlapping grains are scaled down so that the cloud matches the dry sound, but grains at scattered pitches and times do not add up in step and come out quieter. Raise it for a bigger cloud. It does not change how much is fed back.' },
      mix: { live: true, min: 0, max: 1, default: 0.5, desc: 'How much of the sound is grains, from 0 (the dry sound alone) to 1 (the grains alone).' },
    },
  },
};

/** 粒 1 つのエンベロープの平均(shape の数の順)。重なりで割るときに使う */
export const GRAINS_SHAPE_MEAN = [0.5, 0.5, 0.9, 0.2];

/**
 * 同時に鳴る粒の数の見込み(重さの見積もりに使う)。rate × size で、上限は GRAINS_MAX
 * @param {{rate?:number,size?:number}} fx
 */
export function grainsVoices(fx) {
  const d = GRAINS_FX.grains.params;
  const rate = Number.isFinite(Number(fx && fx.rate)) ? Number(fx.rate) : d.rate.default;
  const size = Number.isFinite(Number(fx && fx.size)) ? Number(fx.size) : d.size.default;
  return Math.min(GRAINS_MAX, Math.max(1, Math.ceil(rate * size / 1000)));
}

/**
 * grains の処理器。入口 1 つ、出口 1 つ。出口が 2 本なら粒を左右へ振る。
 * 動かせる値は同じ名前の AudioParam(k-rate)で受ける。作るときの値は processorOptions にも入れる。
 * 粒の値(高さ・長さ・形・位置・向き・左右)は、粒を出すときに決まる。
 *
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const GRAINS_CODE = `
const P = ${JSON.stringify(Object.fromEntries(Object.entries(GRAINS_FX.grains.params).map(([k, v]) => [k, [v.default, v.min, v.max]])))};
const MAX = ${GRAINS_MAX};
const SEED = ${GRAINS_SEED};
const BUF = ${GRAINS_BUF};
const PSEED = ${GRAINS_PITCH_SEED};
const PLIM = ${GRAINS_PITCH_LIMIT};
const JSEED = ${GRAINS_JITTER_SEED};
const IV = ${JSON.stringify(GRAINS_INTERVALS)};
// arp で順に回すときの組。低いほうから並べる
const IVS = IV.map((s) => s.slice().sort((a, b) => a - b));
const MEAN = ${JSON.stringify(GRAINS_SHAPE_MEAN)};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// エンベロープ。u は粒の中の位置(0〜1)。鳴らすときは表(TAB 点)を引く
const TAB = 1024;
const env = (s, u) => {
  if (s === 0) return 0.5 - 0.5 * Math.cos(2 * Math.PI * u);
  if (s === 1) return 1 - Math.abs(2 * u - 1);
  if (s === 2) return Math.min(1, u / 0.1, (1 - u) / 0.1);
  return u < 0.05 ? u / 0.05 : Math.exp(-4 * (u - 0.05) / 0.95) * (1 - u) / 0.95;
};
const ENV = MEAN.map((_, s) => Float32Array.from({ length: TAB + 2 }, (_, i) => (i <= TAB ? env(s, i / TAB) : 0)));
class Grains extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return Object.entries(P).map(([name, [d, lo, hi]]) => ({ name, defaultValue: d, minValue: lo, maxValue: hi, automationRate: 'k-rate' }));
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.init = {};
    for (const [k, [d, lo, hi]] of Object.entries(P)) this.init[k] = clamp(Number.isFinite(p[k]) ? p[k] : d, lo, hi);
    this.n = Math.ceil(BUF * sampleRate);
    this.buf = new Float32Array(this.n);
    this.w = 0;          // 書く位置(0〜n-1)
    this.next = 0;
    this.seed = SEED;
    this.pseed = PSEED;  // pitchRandom と intervals の乱数
    this.jseed = JSEED;  // jitter の乱数
    this.step = 0;       // arp の何番目か。粒を出そうとするたびに 1 つ進む
    this.top = 0;        // 使っている枠のいちばん後ろ + 1。粒を回すのはここまで
    this.grains = Array.from({ length: MAX }, () => ({ on: false, pos: 0, step: 1, u: 0, du: 0, tab: ENV[0], gain: 1, l: 1, r: 1 }));
    this.active = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  rand() {
    let x = this.seed;
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5; x >>>= 0;
    this.seed = x;
    return x / 4294967296;
  }
  prand() {
    let x = this.pseed;
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5; x >>>= 0;
    this.pseed = x;
    return x / 4294967296;
  }
  jrand() {
    let x = this.jseed;
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5; x >>>= 0;
    this.jseed = x;
    return x / 4294967296;
  }
  val(params, k) {
    const a = params && params[k];
    const [, lo, hi] = P[k];
    return a && a.length ? clamp(a[0], lo, hi) : this.init[k];
  }
  spawn(v) {
    const sr = sampleRate;
    // 乱数は粒 1 つで必ず 4 つ引く(値によらず、あとの粒の並びが変わらないように)
    const r1 = this.rand(), r2 = this.rand(), r3 = this.rand(), r4 = this.rand();
    // 高さを散らす乱数は別の種から、粒 1 つで必ず 2 つ引く
    const r5 = this.prand(), r6 = this.prand();
    // arp の順は、粒を出せなくても進める(上限で飛ばした粒のぶん、拍がずれないように)
    const k = this.step++;
    const gi = this.grains.findIndex((x) => !x.on);
    if (gi < 0) return;
    const g = this.grains[gi];
    if (gi >= this.top) this.top = gi + 1;
    const shape = Math.round(v.shape);
    const len = Math.max(2, Math.round(v.size / 1000 * sr));
    // 半音で跳ぶぶん。pitchRandom は -n〜+n の整数から同じ割合で、intervals は組から 1 つ
    // arp が random なら組から乱数で、ほかは組を低いほうから順に回す
    const n = Math.round(v.pitchRandom), arp = Math.round(v.arp), iv = Math.round(v.intervals);
    let pick;
    if (arp === 0) { const set = IV[iv]; pick = set[Math.min(set.length - 1, Math.floor(r6 * set.length))]; } else {
      const set = IVS[iv], L = set.length, per = L > 1 ? 2 * L - 2 : 1;
      const j = arp === 1 ? k % L : arp === 2 ? L - 1 - (k % L) : (L > 1 ? (k % per < L ? k % per : per - k % per) : 0);
      pick = set[j];
    }
    const jump = (n > 0 ? Math.min(2 * n, Math.floor(r5 * (2 * n + 1))) - n : 0) + pick;
    const semi = jump === 0 ? v.pitch : clamp(v.pitch + jump, -PLIM, PLIM);
    const ratio = Math.pow(2, (semi * 100 + v.detune * (2 * r1 - 1)) / 1200);
    const back = r2 < v.reverse;
    const spray = r3 * v.spray / 1000 * sr;
    // 先を読む粒は、書く位置を追い越さないぶん前から切り出す
    const off = spray + 2 + (back ? 0 : Math.max(0, (ratio - 1) * len));
    g.on = true; g.u = 0; g.du = TAB / len; g.tab = ENV[shape];
    // 読む位置は遅れ線の中の位置(0〜n)。端を越えたら回す
    g.pos = this.w - off; if (g.pos < 0) g.pos += this.n;
    g.step = back ? -ratio : ratio;
    this.active++;
    // 重なりで割る。重なりは rate × size、1 を下回るときは割らない
    g.gain = 1 / Math.max(1, v.rate * v.size / 1000 * MEAN[shape]);
    // 左右。真ん中で 1 になる等パワーの振り分け
    const pan = v.width * (2 * r4 - 1);
    const a = (pan + 1) * Math.PI / 4;
    g.l = Math.cos(a) * Math.SQRT2; g.r = Math.sin(a) * Math.SQRT2;
  }
  process(inputs, outputs, params) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const v = {};
    for (const k of Object.keys(P)) v[k] = this.val(params, k);
    const len = out[0].length, nc = out.length, n = this.n, buf = this.buf, grains = this.grains;
    const gap = sampleRate / v.rate;
    const fb = v.feedback, mix = v.mix;
    // gain は出口だけ。0dB なら 1 をちょうど掛ける(前と同じ音になる)
    const wet = v.gain === 0 ? mix : mix * Math.pow(10, v.gain / 20);
    const nin = inp ? inp.length : 0;
    const x0 = nin ? inp[0] : null, x1 = nin > 1 ? inp[1] : x0;
    const y0 = out[0], y1 = nc > 1 ? out[1] : null;
    const dry = 1 - mix;
    let w = this.w, next = this.next;
    for (let i = 0; i < len; i++) {
      const d0 = x0 ? x0[i] : 0, d1 = x1 ? x1[i] : 0;
      const x = nin > 1 ? (d0 + d1) * 0.5 : d0;
      if (next <= 0) {
        this.w = w; this.spawn(v);
        // jitter の乱数は粒 1 つで必ず 1 つ引く。0 なら前と同じく gap をちょうど足す
        const r = this.jrand();
        next += v.jitter === 0 ? gap : gap * (1 + v.jitter * (2 * r - 1));
      }
      next -= 1;
      let wl = 0, wr = 0, ws = 0;
      if (this.active) {
        const top = this.top;
        for (let k = 0; k < top; k++) {
          const g = grains[k];
          if (!g.on) continue;
          const e = g.tab[g.u | 0] * g.gain;
          let pos = g.pos;
          const i0 = pos | 0, f = pos - i0;
          const a = buf[i0], b = buf[i0 + 1 === n ? 0 : i0 + 1];
          const s = (a + (b - a) * f) * e;
          ws += s; wl += s * g.l; wr += s * g.r;
          pos += g.step;
          if (pos >= n) pos -= n; else if (pos < 0) pos += n;
          g.pos = pos;
          g.u += g.du;
          if (g.u >= TAB) { g.on = false; this.active--; }
        }
        while (this.top > 0 && !grains[this.top - 1].on) this.top--;
      }
      buf[w] = fb > 0 ? x + Math.tanh(fb * ws) : x;
      if (++w === n) w = 0;
      if (!y1) y0[i] = d0 * dry + ws * wet;
      else {
        y0[i] = d0 * dry + wl * wet;
        y1[i] = d1 * dry + wr * wet;
        // 3 本目からは、振る前の粒を合わせたもの
        for (let c = 2; c < nc; c++) out[c][i] = (inp && inp[c] ? inp[c][i] : d0) * dry + ws * wet;
      }
    }
    this.w = w; this.next = next;
    return true;
  }
}
registerProcessor('${GRAINS_NODE}', Grains);
`;
