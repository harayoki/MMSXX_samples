// ファミコン(2A03)の APU。チップそのものを持って鳴らす。
//
// ---- なぜチップそのものを持つか ----
//
// AY と同じ(sound/ay.js の頭)。矩形波の幅 4 通り、三角波の 32 段の階段と
// 音量つまみが無いこと、ノイズの 2 つの並び、声を足すところが直線でないこと。
// どれもチップが持っているので、持てば実機と同じになる(docs/ENGINE_TODO.md の「1b」)。
//
// ---- 出どころ ----
//
// どのエミュレータも移していない。NESdev Wiki の資料を読んで書いた。
// https://www.nesdev.org/wiki/APU
// NSFPlay はライセンスがはっきりしない。MAME の nes_apu は GPL で使えない。
//
// 確かめるときは、同じ書き込みを VGM にして libvgm の NSFPlay と MAME のコアで鳴らす。
//
// ---- まだ無いもの ----
//
// - DPCM(録音の再生)
// - スイープ。音程を自分で書き直すので使わない。鳴らさないように止めてある
// - 本体の出口のフィルタ(90Hz と 440Hz の高域通過、14kHz の低域通過)。
//   直流を抜くだけにしてある(AY と同じ 20Hz)

import { registerNES, registerFamily } from './mml.js';

/** CPU のクロック(NTSC)。APU はこれで数える */
export const NES_CLOCK = 1789773;

/** ノイズの周期の表(NTSC)。CPU のクロックで何回数えると 1 回進むか */
export const NES_NOISE_PERIODS = [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068];

/** 矩形波の幅。$4000 の上 2 ビットに書く番号の順 */
export const NES_DUTIES = [0.125, 0.25, 0.5, 0.75];

/**
 * 出口の割り算。矩形波 1 本を音量 15 で鳴らしたときの実効値が、
 * `pulse(50)` を `v15` で鳴らしたときと揃う数(鳴らして測った。2026-10-04)。
 */
export const NES_OUT_GAIN = 1.876;

/**
 * 音の高さから、矩形波のタイマー($4002/$4003)。11 ビット。
 * 8 より小さいとチップが黙らせるので、そこで止める。
 * @param {number} freq 高さ(Hz)
 */
export function nesPulseTimer(freq) {
  if (!(freq > 0)) return 2047;
  return Math.max(8, Math.min(2047, Math.round(NES_CLOCK / (16 * freq) - 1)));
}

/**
 * 音の高さから、三角波のタイマー($400A/$400B)。11 ビット。
 * 同じ値なら矩形波より 1 オクターブ低い(32 段で 1 周するため)。
 * 2 より小さいと超音波になるので、そこで止める。
 * @param {number} freq 高さ(Hz)
 */
export function nesTriangleTimer(freq) {
  if (!(freq > 0)) return 2047;
  return Math.max(2, Math.min(2047, Math.round(NES_CLOCK / (32 * freq) - 1)));
}

/**
 * 音の高さから、ノイズの周期の番号($400E の下 4 ビット)。
 *
 * 長い並び(白いノイズ)は音程が無いので、書いた高さで粗さを選ぶ。o4a が
 * まん中あたり(254)に来るよう、CPU / (16 × 高さ) に近い周期を選ぶ。
 * 短い並び(93 段で 1 周)は音程として聞こえるので、その高さに近い周期を選ぶ。
 * @param {number} freq 高さ(Hz)
 * @param {boolean} short 短い並びか
 */
export function nesNoisePeriod(freq, short) {
  if (!(freq > 0)) return 15;
  const want = short ? NES_CLOCK / (93 * freq) : NES_CLOCK / (16 * freq);
  let best = 0;
  for (let i = 1; i < 16; i++) {
    if (Math.abs(Math.log(NES_NOISE_PERIODS[i] / want)) < Math.abs(Math.log(NES_NOISE_PERIODS[best] / want))) best = i;
  }
  return best;
}

/** いちばん近い幅の番号 */
export function nesDutyIndex(duty) {
  let best = 0;
  for (let i = 1; i < 4; i++) if (Math.abs(NES_DUTIES[i] - duty) < Math.abs(NES_DUTIES[best] - duty)) best = i;
  return best;
}

/**
 * 最初から入れておく音色。説明は英語だけ持つ(日本語はデータに入れない)。
 */
export const NES_PRESETS = [
  ['nesPulse(12)', { mode: 'pulse', duty: 0.125 }, 'lead',
    'NES APU pulse at 12.5% duty, from the chip itself. Thin and nasal. Volume is the 4-bit value as '
    + 'amplitude, and the two pulses share one nonlinear mixer.'],
  ['nesPulse(25)', { mode: 'pulse', duty: 0.25 }, 'lead',
    'NES APU pulse at 25% duty, from the chip itself. The classic NES lead.'],
  ['nesPulse(50)', { mode: 'pulse', duty: 0.5 }, 'lead',
    'NES APU pulse at 50% duty, from the chip itself. A plain square.'],
  ['nesTriangle', { mode: 'triangle' }, 'bass',
    'NES APU triangle, from the chip itself: a 32-step staircase, an octave below a pulse with the '
    + 'same timer. It has no volume control; v0 silences it and anything else plays full.'],
  ['nesNoise(long)', { mode: 'noise' }, 'noise',
    'NES APU noise in its long mode: the 15-bit shift register, heard as white noise. The note picks '
    + 'one of the sixteen periods; o4a lands mid-range, lower notes are coarser.'],
  ['nesNoise(short)', { mode: 'noise', short: true }, 'noise',
    'NES APU noise in its short mode: the register loops every 93 steps, so it comes out as a metallic '
    + 'buzz with a pitch. The note picks the nearest of the sixteen periods.'],
];

/**
 * 最初から入れておく音色を登録する(エンジンが読み込まれるときに走る)。
 * 二度呼ばれても止まらない(ほかの register* と同じ)。
 */
export function registerNESPresets() {
  try {
    registerFamily('nesPulse', {
      desc: 'The NES APU pulse channel, from the chip itself.',
      params: [{
        name: 'duty', default: '50', desc: 'Share of each cycle spent high, in percent (rounded down).',
        values: [
          { value: '12', desc: '12.5%. Thin and nasal.' },
          { value: '25', desc: '25%. The classic NES lead.' },
          { value: '50', desc: '50%. A plain square.' },
        ],
      }],
    });
    registerFamily('nesNoise', {
      desc: 'The NES APU noise channel, from the chip itself.',
      params: [{
        name: 'mode', default: 'long', desc: 'Which loop the shift register runs.',
        values: [
          { value: 'long', desc: 'The full 32767-step loop: white noise. Drums and effects.' },
          { value: 'short', desc: 'A 93-step loop, heard as a metallic buzz with a pitch.' },
        ],
      }, {
        // 周期の番号($400E の下 4 ビット)。**実機が持つ 16 段だけ。**
        // 書かなければ、書いた音の高さから選ぶ(`nesNoisePeriod`)
        name: 'period', min: 0, max: 15, unit: 'index',
        desc: 'The noise period index ($400E low 4 bits), 0 to 15 — the sixteen steps the chip has, '
            + 'no values in between. 0 is the fastest and brightest, 15 the slowest. '
            + 'Left out, it is chosen from the written pitch instead.',
      }],
    });
  } catch (e) { /* すでに入っている */ }
  // **タグは人のためのもの。**`kind` は書き出しが見るもので、一覧を眺めている
  // 人には見えない。接頭語を `nes` にしたときに付け忘れていた(2026-10-18)
  for (const [name, params, role, desc] of NES_PRESETS) {
    try { registerNES(name, params, { role, desc, tags: ['nes'], version: '1.00' }); }
    catch (e) { /* すでに入っている */ }
  }
}

/**
 * 処理器の中身(文字列から作るのでファイルは増えない)。
 *
 * 音符の側(`sound/audio.js`)が、フレームごとのタイマーと音量をレジスタの値に
 * 直して渡す。ここは声へ割り当てて、時刻が来たら書くだけ。
 */
export const NES_CODE = `
const CLK = ${NES_CLOCK};
const NOISE = ${JSON.stringify(NES_NOISE_PERIODS)};
const OUT_GAIN = ${NES_OUT_GAIN};
const DUTY = [
  [0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 0, 0, 0],
  [1, 0, 0, 1, 1, 1, 1, 1],
];
const TRI = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const LENGTH = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14,
  12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30];
/** フレームカウンタの 1/4 フレーム(4 段のモード)。CPU のクロックで数える */
const QUARTER = CLK / 240;

/** 音量エンベロープ(矩形波とノイズ)。一定の音量にしていれば値をそのまま出す */
function newEnv() {
  return { start: false, div: 0, decay: 0, loop: false, constant: true, vol: 0 };
}
function clockEnv(e) {
  if (e.start) { e.start = false; e.decay = 15; e.div = e.vol; return; }
  if (e.div > 0) { e.div--; return; }
  e.div = e.vol;
  if (e.decay > 0) e.decay--;
  else if (e.loop) e.decay = 15;
}
const envOut = (e) => (e.constant ? e.vol : e.decay);

/**
 * チップ 1 個。矩形波 2 本・三角波・ノイズ。
 *
 * 出口のサンプルごとに CPU のクロックを数えて進め、そのあいだの各声の値を
 * 時間で平均してから混ぜる(点で拾うと高い音で折り返しが出るため)。
 * 混ぜ方は NESdev の式(声を足すところが直線でない)。
 */
class APU {
  constructor(rate) {
    this.step = CLK / rate;    // 出口 1 サンプルあたりの CPU のクロック
    this.frac = 0;
    this.quarter = 0;
    this.half = false;
    this.reg = new Uint8Array(0x18);
    this.pulse = [0, 1].map(() => ({ duty: 0, seq: 0, timer: 0, count: 2, len: 0, halt: false,
      env: newEnv(), sweepNeg: false, sweepShift: 0, on: false }));
    this.tri = { seq: 0, timer: 0, count: 1, len: 0, halt: false, lin: 0, linLoad: 0, linReload: false, on: false };
    this.noise = { shift: 1, short: false, period: 4, count: 4, len: 0, halt: false, env: newEnv(), on: false };
  }

  writeReg(r, v) {
    if (r > 0x17) return;
    this.reg[r] = v;
    if (r < 8) {
      const p = this.pulse[r >> 2];
      switch (r & 3) {
        case 0:
          p.duty = v >> 6; p.halt = !!(v & 0x20); p.env.loop = p.halt;
          p.env.constant = !!(v & 0x10); p.env.vol = v & 15;
          break;
        case 1:
          p.sweepNeg = !!(v & 8); p.sweepShift = v & 7;
          break;
        case 2:
          p.timer = (p.timer & 0x700) | v;
          break;
        case 3:
          p.timer = (p.timer & 0xff) | ((v & 7) << 8);
          if (p.on) p.len = LENGTH[v >> 3];
          // 上の桁を書くと、波の頭からやり直す(実機と同じ。だから高さを滑らせる
          // ときは、変わらなければ書かない)
          p.seq = 0; p.env.start = true;
          break;
      }
      return;
    }
    const t = this.tri, n = this.noise;
    switch (r) {
      case 0x08: t.halt = !!(v & 0x80); t.linLoad = v & 0x7f; break;
      case 0x0a: t.timer = (t.timer & 0x700) | v; break;
      case 0x0b:
        t.timer = (t.timer & 0xff) | ((v & 7) << 8);
        if (t.on) t.len = LENGTH[v >> 3];
        t.linReload = true;
        break;
      case 0x0c:
        n.halt = !!(v & 0x20); n.env.loop = n.halt; n.env.constant = !!(v & 0x10); n.env.vol = v & 15;
        break;
      case 0x0e: n.short = !!(v & 0x80); n.period = NOISE[v & 15]; break;
      case 0x0f: if (n.on) n.len = LENGTH[v >> 3]; n.env.start = true; break;
      case 0x15:
        this.pulse[0].on = !!(v & 1); this.pulse[1].on = !!(v & 2);
        t.on = !!(v & 4); n.on = !!(v & 8);
        if (!this.pulse[0].on) this.pulse[0].len = 0;
        if (!this.pulse[1].on) this.pulse[1].len = 0;
        if (!t.on) t.len = 0;
        if (!n.on) n.len = 0;
        break;
    }
  }

  /** 1/4 フレーム。エンベロープと三角波の線形カウンタ。半分ごとに長さカウンタ */
  clockQuarter() {
    clockEnv(this.pulse[0].env); clockEnv(this.pulse[1].env); clockEnv(this.noise.env);
    const t = this.tri;
    if (t.linReload) t.lin = t.linLoad;
    else if (t.lin > 0) t.lin--;
    if (!t.halt) t.linReload = false;
    this.half = !this.half;
    if (this.half) {
      for (const p of this.pulse) if (!p.halt && p.len > 0) p.len--;
      if (!t.halt && t.len > 0) t.len--;
      if (!this.noise.halt && this.noise.len > 0) this.noise.len--;
    }
  }

  /** 矩形波を n クロック進めて、そのあいだの値の合計を返す */
  runPulse(p, n) {
    // 黙らせる条件(実機と同じ)。8 より小さいタイマーと、スイープの先が桁あふれするとき
    const target = p.sweepNeg ? 0 : p.timer + (p.timer >> p.sweepShift);
    const muted = p.timer < 8 || target > 0x7ff || p.len === 0;
    const vol = muted ? 0 : envOut(p.env);
    const per = 2 * (p.timer + 1);
    let sum = 0;
    while (n >= p.count) {
      sum += (DUTY[p.duty][p.seq] ? vol : 0) * p.count;
      n -= p.count;
      p.seq = (p.seq + 1) & 7;
      p.count = per;
    }
    sum += (DUTY[p.duty][p.seq] ? vol : 0) * n;
    p.count -= n;
    return sum;
  }

  /** 三角波。カウンタが 0 なら段は進まず、いまの値を出しつづける(実機と同じ) */
  runTri(n) {
    const t = this.tri;
    const go = t.lin > 0 && t.len > 0;
    const per = t.timer + 1;
    let sum = 0;
    if (!go) return TRI[t.seq] * n;
    while (n >= t.count) {
      sum += TRI[t.seq] * t.count;
      n -= t.count;
      t.seq = (t.seq + 1) & 31;
      t.count = per;
    }
    sum += TRI[t.seq] * n;
    t.count -= n;
    return sum;
  }

  /** ノイズ。15 ビットの並び。短い並びは 6 番目のビットで帰す */
  runNoise(n) {
    const z = this.noise;
    const vol = z.len === 0 ? 0 : envOut(z.env);
    let sum = 0;
    while (n >= z.count) {
      sum += (z.shift & 1 ? 0 : vol) * z.count;
      n -= z.count;
      const fb = (z.shift & 1) ^ ((z.shift >> (z.short ? 6 : 1)) & 1);
      z.shift = (z.shift >> 1) | (fb << 14);
      z.count = z.period;
    }
    sum += (z.shift & 1 ? 0 : vol) * n;
    z.count -= n;
    return sum;
  }

  /** 出口の 1 サンプル。0 から上(実機の DAC と同じ)。直流は外で抜く */
  calc() {
    this.frac += this.step;
    const n = Math.floor(this.frac);
    this.frac -= n;
    this.quarter += n;
    if (this.quarter >= QUARTER) { this.quarter -= QUARTER; this.clockQuarter(); }
    if (n <= 0) return this.out || 0;
    const p1 = this.runPulse(this.pulse[0], n) / n;
    const p2 = this.runPulse(this.pulse[1], n) / n;
    const tr = this.runTri(n) / n;
    const no = this.runNoise(n) / n;
    // NESdev の混ぜ方。0 で割らないように分けて書く
    const ps = p1 + p2;
    const pulseOut = ps > 0 ? 95.88 / (8128 / ps + 100) : 0;
    const tnd = tr / 8227 + no / 12241;
    const tndOut = tnd > 0 ? 159.79 / (1 / tnd + 100) : 0;
    this.out = pulseOut + tndOut;
    return this.out;
  }
}

/** 声の種類と、チップの中の番号。矩形波 2 本・三角波 1 本・ノイズ 1 本 */
const SLOTS = { pulse: [0, 1], triangle: [2], noise: [3] };

/**
 * 行き先 1 つぶんの処理器。中にチップを何個でも持つ(sound/ay.js と同じ考え方)。
 * 声が足りなければチップを足す。実機で何台要るかは、書き出しのときに見る。
 */
class NesBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    this.pool = [];
    this.log = !!q.log;
    this.logNow = 0;
    this.dcX = 0;
    this.dcY = 0;
    // **直流を抜く仕掛けの出発点を、最初の 1 標本で合わせる。**
    // チップの出口は 0 を中心にしていない(実機の DAC が片側だけ)ので、
    // dcX が 0 のまま 1 標本目を通すと、その段差がそのまま出口へ出る。
    // 20Hz で抜くので 8ms ほど残り、プチッという低い音になる。
    // 曲の頭で三角波が出たときに 1 回鳴っていた(2026-10-12 に言われた)
    this.dcInit = false;
    this.dcR = 1 - 2 * Math.PI * 20 / sampleRate;   // 20Hz
    this.cutAt = -1;
    this.cutLen = Math.max(1, Math.round(sampleRate * 0.01));
    this.alive = true;
    this.port.onmessage = (e) => {
      // 片付けの合図。つないでいない処理器も、true を返すあいだ回り続けるので、
      // 外しただけでは止まらない(sound/filter.js と同じ決めごと)
      if (e.data && e.data.stop) { this.alive = false; return; }
      if (e.data && e.data.cut) { this.cut(); return; }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      this.cutAt = -1;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
    };
  }

  grow() {
    const c = new APU(sampleRate);
    const chip = { c, log: null, v: [0, 1, 2, 3].map(() => ({ end: 0, vs: null, ps: null, ds: null })) };
    // 記録はチップごとに分ける(sound/ay.js と同じ)。番号は $4000 からの差
    if (this.log) {
      const raw = c.writeReg.bind(c);
      chip.log = [];
      c.writeReg = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    // 4 声とも使えるようにして、スイープは止めておく(負の向きにすると桁あふれで黙らない)
    c.writeReg(0x15, 0x0f);
    c.writeReg(0x01, 0x08);
    c.writeReg(0x05, 0x08);
    c.writeReg(0x00, 0x30);
    c.writeReg(0x04, 0x30);
    c.writeReg(0x08, 0x80);
    c.writeReg(0x0c, 0x30);
    // 黙っているチップが出す直流を、抜く仕掛けの出発点へ織り込む。
    // 織り込まないと、チップが増えた瞬間にその直流がまるごと段差になって
    // プチッと鳴る。1 台目は最初の音符より少し遅れてできるので、
    // 1 度目の再生のときだけ、音の出はじめで鳴っていた(2026-10-12 に言われた)
    this.dcX += c.calc() * OUT_GAIN;
    this.pool.push(chip);
    return chip;
  }

  cut() {
    this.events.length = 0;
    this.at = 0;
    for (const chip of this.pool) for (let s = 0; s < 4; s++) this.silence(chip, s);
    if (this.cutAt < 0) this.cutAt = 0;
  }

  /** その声を黙らせる */
  silence(chip, s) {
    const c = chip.c;
    const v = chip.v[s];
    v.end = 0; v.vs = null; v.ps = null; v.ds = null;
    if (s < 2) c.writeReg(s * 4, (c.reg[s * 4] & 0xc0) | 0x30);
    else if (s === 2) { c.writeReg(0x08, 0x80); c.writeReg(0x0b, c.reg[0x0b]); }
    else c.writeReg(0x0c, 0x30);
  }

  pick(kind, now) {
    const want = SLOTS[kind];
    for (const chip of this.pool) {
      for (const s of want) if (chip.v[s].end <= now) return { chip, s };
    }
    return { chip: this.grow(), s: want[0] };
  }

  /** 矩形波のタイマーを書く。上の桁は変わったときだけ(書くと波の頭に戻るため) */
  pulseTimer(c, s, t, force) {
    const lo = t & 0xff, hi = (t >> 8) & 7;
    if (force || c.reg[s * 4 + 2] !== lo) c.writeReg(s * 4 + 2, lo);
    if (force || (c.reg[s * 4 + 3] & 7) !== hi) c.writeReg(s * 4 + 3, 0xf8 | hi);
  }

  /** 三角波のタイマーを書く */
  triTimer(c, t) {
    const lo = t & 0xff, hi = (t >> 8) & 7;
    if (c.reg[0x0a] !== lo) c.writeReg(0x0a, lo);
    if ((c.reg[0x0b] & 7) !== hi) c.writeReg(0x0b, 0xf8 | hi);
  }

  /** 音量(と幅)を書く。三角波は鳴らすか止めるかだけ */
  level(c, s, vol, duty) {
    if (s < 2) {
      const val = ((duty & 3) << 6) | 0x30 | (vol & 15);
      if (c.reg[s * 4] !== val) c.writeReg(s * 4, val);
    } else if (s === 2) {
      // 線形カウンタで止める。0 を読み込ませると、次の 1/4 フレームで段が止まる
      const val = vol > 0 ? 0xff : 0x80;
      if (c.reg[0x08] !== val) { c.writeReg(0x08, val); c.writeReg(0x0b, c.reg[0x0b]); }
    } else {
      const val = 0x30 | (vol & 15);
      if (c.reg[0x0c] !== val) c.writeReg(0x0c, val);
    }
  }

  start(ev, now) {
    const { chip, s } = this.pick(ev.ch, now);
    const c = chip.c;
    if (chip.v[s].end > 0) this.silence(chip, s);
    const v = chip.v[s];
    if (s < 2) {
      this.level(c, s, ev.v, ev.duty);
      c.writeReg(s * 4 + 1, 0x08);
      this.pulseTimer(c, s, ev.p, true);
    } else if (s === 2) {
      c.writeReg(0x0a, ev.p & 0xff);
      c.writeReg(0x08, ev.v > 0 ? 0xff : 0x80);
      c.writeReg(0x0b, 0xf8 | ((ev.p >> 8) & 7));
    } else {
      this.level(c, s, ev.v, 0);
      c.writeReg(0x0e, (ev.short ? 0x80 : 0) | (ev.p & 15));
      c.writeReg(0x0f, 0xf8);
    }
    v.end = ev.t + ev.dur;
    v.duty = ev.duty | 0;
    v.short = !!ev.short;
    v.vs = ev.vs && ev.vs.length ? { list: ev.vs, at: 0 } : null;
    v.ps = ev.ps && ev.ps.length ? { list: ev.ps, at: 0 } : null;
    v.ds = ev.ds && ev.ds.length ? { list: ev.ds, at: 0 } : null;
    v.vol = ev.v;
  }

  step(now) {
    for (const chip of this.pool) {
      const c = chip.c;
      for (let s = 0; s < 4; s++) {
        const v = chip.v[s];
        if (v.end <= 0) continue;
        if (v.end <= now) { this.silence(chip, s); continue; }
        let lv = false;
        if (v.ds) {
          const f = v.ds;
          while (f.at < f.list.length && f.list[f.at][0] <= now) { v.duty = f.list[f.at++][1]; lv = true; }
          if (f.at >= f.list.length) v.ds = null;
        }
        if (v.vs) {
          const f = v.vs;
          while (f.at < f.list.length && f.list[f.at][0] <= now) { v.vol = f.list[f.at++][1]; lv = true; }
          if (f.at >= f.list.length) v.vs = null;
        }
        if (lv) this.level(c, s, v.vol, v.duty);
        if (v.ps) {
          const f = v.ps;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            const p = f.list[f.at++][1];
            if (s < 2) this.pulseTimer(c, s, p, false);
            else if (s === 2) this.triTimer(c, p);
            else c.writeReg(0x0e, (v.short ? 0x80 : 0) | (p & 15));
          }
          if (f.at >= f.list.length) v.ps = null;
        }
      }
    }
  }

  live(chip) {
    return chip.v[0].end > 0 || chip.v[1].end > 0 || chip.v[2].end > 0 || chip.v[3].end > 0;
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const n = out.length;
    const base = currentTime;
    const next = this.at < this.events.length ? this.events[this.at].t : Infinity;
    if (!this.pool.some((c) => this.live(c)) && next >= base + n / sampleRate
      && Math.abs(this.dcY) < 1e-6) {
      out.fill(0);
      // dcX は残す。止めた三角波が保っている値で、鳴らし直したときの出発点になる
      this.dcY = 0;
      return true;
    }
    for (let i = 0; i < n; i++) {
      const now = base + i / sampleRate;
      if (this.log) this.logNow = now;
      this.step(now);
      while (this.at < this.events.length && this.events[this.at].t <= now) {
        this.start(this.events[this.at++], now);
      }
      // 黙っているチップも回す。三角波は止めた位置の値を出しつづける(実機と同じ)。
      // 回さずに 0 にすると、止めた瞬間と鳴らし直した瞬間に出口が跳んでプチッと鳴る。
      // 前はそうしていて、q7 で刻む三角波のベースが拍ごとに鳴っていた(2026-10-07)。
      // 重さは、上の「何も鳴っていない区切りは回さない」で抑えている
      let raw = 0;
      for (const chip of this.pool) raw += chip.c.calc();
      const x = raw * OUT_GAIN;
      // 1 標本目は、そこを出発点にして 0 を出す(上の dcInit)
      if (!this.dcInit) { this.dcInit = true; this.dcX = x; }
      const y = x - this.dcX + this.dcR * this.dcY;
      this.dcX = x;
      this.dcY = y;
      let v = y;
      if (this.cutAt >= 0) {
        v *= Math.max(0, 1 - this.cutAt / this.cutLen);
        this.cutAt++;
        if (this.cutAt > this.cutLen) { this.cutAt = this.cutLen; v = 0; }
      }
      out[i] = v;
    }
    if (this.log) {
      for (let k = 0; k < this.pool.length; k++) {
        const chip = this.pool[k];
        if (!chip.log.length) continue;
        this.port.postMessage({ regs: chip.log, chip: k, type: 0 });
        chip.log = [];
      }
    }
    return this.alive;
  }
}
registerProcessor('mmsxx-nes', NesBank);
`;
