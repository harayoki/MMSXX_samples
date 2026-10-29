// AY-3-8910 / YM2149(MSX の PSG)。チップそのものを持って鳴らす。
//
// ---- なぜチップそのものを持つか ----
//
// `pulse(50)` や `noise(white)` は Web Audio の発振器で作っていて、
// 実機に寄せているのは高さの刻み・音量の段・波形だけだった。
// チップを持てば、ノイズの並び、トーンとノイズの混ぜ方、音量の表が
// 実機と同じになる(docs/ENGINE_TODO.md の「1b」)。
//
// いまの音色は残す。チップで鳴らすのは `ay` で始まる音色だけで、
// どちらで鳴らすかは音色ごとに選ぶ。
//
// ---- 出どころ ----
//
// emu2149 v1.42(Mitsutaka Okazaki、MIT)を読んで書き直した。
// https://github.com/digital-sound-antiques/emu2149
//
// 物差しには使わない。確かめるときは libvgm の MAME のコア(ay8910.c)で
// 同じ書き込みを鳴らす。移植元と比べても「移植元と一致する」ことしか言えない。
//
// ---- 重さ ----
//
// チップは行き先(トラック)ごとに 1 個立つ。黙っているあいだは計算を飛ばすので、
// 重さは鳴っている音の数に比例する。スマホとブラウザゲームで鳴らすため。

import { registerAY, registerFamily } from './mml.js';

/** チップに入るクロック。MSX は 3.58MHz を 2 で割ったものを入れる */
export const AY_CLOCK = 1789772;

/**
 * 音量の表。emu2149 のもの(32 段)。
 *
 * 0 = YM2149(32 段。MSX2 以降)、1 = AY-3-8910(16 段。MSX1)。
 * 音量レジスタ(0〜15)は 2 倍して引く。エンベロープは 32 段のまま引く。
 */
export const AY_VOLTBL = [
  [0x00, 0x01, 0x01, 0x02, 0x02, 0x03, 0x03, 0x04, 0x05, 0x06, 0x07, 0x09,
    0x0B, 0x0D, 0x0F, 0x12, 0x16, 0x1A, 0x1F, 0x25, 0x2D, 0x35, 0x3F, 0x4C,
    0x5A, 0x6A, 0x7F, 0x97, 0xB4, 0xD6, 0xFF, 0xFF],
  [0x00, 0x00, 0x03, 0x03, 0x04, 0x04, 0x06, 0x06, 0x09, 0x09, 0x0D, 0x0D,
    0x12, 0x12, 0x1D, 0x1D, 0x22, 0x22, 0x37, 0x37, 0x4D, 0x4D, 0x62, 0x62,
    0x82, 0x82, 0xA6, 0xA6, 0xD0, 0xD0, 0xFF, 0xFF],
];

/**
 * 出口の割り算。1 チャンネルを音量 15 の矩形波で鳴らしたときの実効値が、
 * `pulse(50)` を `v15` で鳴らしたときと揃う数(鳴らして測った。2026-10-04)。
 */
export const AY_OUT_DIV = 14568;

/**
 * 音の高さから、トーンの周期(R0〜R5)。12 ビット。
 * @param {number} freq 高さ(Hz)
 */
export function ayTonePeriod(freq) {
  if (!(freq > 0)) return 4095;
  return Math.max(1, Math.min(4095, Math.round(AY_CLOCK / (16 * freq))));
}

/**
 * 音の高さから、ノイズの周期(R6)。5 ビット。
 *
 * ノイズに音程は無いので、書いた高さで粗さを選ぶ。o4a(440Hz)が 16 で
 * まん中あたりに来るよう、トーンの 16 倍の刻みで割る。低いほど粗い。
 * @param {number} freq 高さ(Hz)
 */
export function ayNoisePeriod(freq) {
  if (!(freq > 0)) return 31;
  return Math.max(1, Math.min(31, Math.round(AY_CLOCK / (256 * freq))));
}

/**
 * 音の高さから、エンベロープの周期(R11/R12)。16 ビット。
 * @param {number} freq 高さ(Hz)
 * @param {number} div 1 周の刻み(のこぎり 256、三角 512。`AY_ENV_SHAPES`)
 */
export function ayEnvPeriod(freq, div) {
  if (!(freq > 0)) return 65535;
  return Math.max(1, Math.min(65535, Math.round(AY_CLOCK / (div * freq))));
}

/**
 * 最初から入れておく音色。説明は英語だけ持つ(日本語はデータに入れない)。
 */
export const AY_PRESETS = [
  ['ayTone', { mode: 'tone' }, 'lead',
    'Square wave from the AY-3-8910 / YM2149 itself: the register-level MSX PSG rather than an '
    + 'oscillator imitating it. Volume follows the chip table, 16 steps of about 3dB.'],
  ['ayNoise', { mode: 'noise' }, 'noise',
    'Noise from the AY-3-8910 / YM2149 itself: the 17-bit shift register of the real chip. The note '
    + 'picks the noise period (R6); o4a lands mid-range, lower notes are coarser. The chip has one '
    + 'noise generator, so two noise notes in the same part share its period.'],
  ['ayEnvSaw(5bit)', { mode: 'env', shape: 'saw' }, 'bass',
    'The volume envelope of the YM2149 itself, cycled at audio rate as a falling sawtooth. Volume '
    + 'does nothing; the note sets the envelope period, whose steps are 16 times coarser than a '
    + 'tone, so high notes drift. One envelope serves all three channels of the chip.'],
  ['ayEnvSaw(4bit)', { mode: 'env', shape: 'saw', ay: true }, 'bass',
    'The same falling sawtooth through the AY-3-8910 volume table: sixteen uneven steps instead of '
    + 'thirty-two. The MSX1 and the ZX Spectrum sound.'],
  ['ayEnvTri(5bit)', { mode: 'env', shape: 'tri' }, 'bass',
    'The volume envelope of the YM2149 itself, alternating, so it comes out as a triangle an octave '
    + 'below the sawtooth for the same period. Volume does nothing.'],
  ['ayEnvTri(4bit)', { mode: 'env', shape: 'tri', ay: true }, 'bass',
    'The alternating envelope through the AY-3-8910 volume table: a coarser triangle.'],
];

/** ブザーの音色の作り分け。どちらの音量の表を通すか */
const ENV_BITS = {
  name: 'bits', default: '5bit', desc: 'Which volume table the envelope runs through.',
  values: [
    { value: '5bit', desc: 'Thirty-two steps, as on a YM2149 (MSX2 and later).' },
    { value: '4bit', desc: 'Sixteen uneven steps, as on an AY-3-8910 (MSX1, ZX Spectrum). Coarser.' },
  ],
};

/**
 * 最初から入れておく音色を登録する(エンジンが読み込まれるときに走る)。
 * 二度呼ばれても止まらない(ほかの register* と同じ)。
 */
export function registerAYPresets() {
  try {
    registerFamily('ayEnvSaw', {
      desc: 'The AY / YM2149 volume envelope cycled at audio rate as a falling sawtooth, from the chip itself.',
      params: [ENV_BITS],
    });
    registerFamily('ayEnvTri', {
      desc: 'The AY / YM2149 volume envelope cycled at audio rate as a triangle, from the chip itself.',
      params: [ENV_BITS],
    });
    // ノイズの周期(R6)。**実機が出せる 1〜31 だけ。**書かなければ、
    // 書いた音の高さから選ぶ(`ayNoisePeriod`)。実機は R6 だけで決まるので、
    // 書いたときは高さを見ない(2026-10-27)
    registerFamily('ayNoise', {
      desc: 'The AY / YM2149 noise channel, from the chip itself.',
      params: [{
        name: 'period', min: 1, max: 31, unit: 'R6',
        desc: 'The noise period register (R6), 1 to 31 — the only values the chip has. '
            + 'The shift register runs at clock / 16 / period, so higher is coarser and lower-pitched. '
            + 'Left out, it is chosen from the written pitch instead.',
      }],
    });
  } catch (e) { /* すでに入っている */ }
  for (const [name, params, role, desc] of AY_PRESETS) {
    try { registerAY(name, params, { role, desc, tags: ['msx'] }); }
    catch (e) { /* すでに入っている */ }
  }
}

/**
 * 処理器の中身(文字列から作るのでファイルは増えない)。
 *
 * 音符の側(`sound/audio.js`)が、フレームごとの周期と音量をレジスタの値に
 * 直して渡す。ここは 3 声へ割り当てて、時刻が来たら書くだけ。
 */
export const AY_CODE = `
const CLK = ${AY_CLOCK};
const VOLTBL = ${JSON.stringify(AY_VOLTBL)};
const OUT_DIV = ${AY_OUT_DIV};
const REGMSK = [0xff, 0x0f, 0xff, 0x0f, 0xff, 0x0f, 0x1f, 0x3f,
  0x1f, 0x1f, 0x1f, 0xff, 0xff, 0x0f, 0xff, 0xff];

/**
 * チップ 1 個。emu2149 の高品質の道(内部を CLK / 8 で回して、出口で平均する)。
 *
 * 出口は 0 から上だけ(実機の DAC と同じ)。直流は外で抜く。
 */
class PSG {
  constructor(rate, type = 0) {
    this.voltbl = VOLTBL[type] || VOLTBL[0];
    this.realstep = CLK;
    this.psgstep = rate * 8;
    this.psgtime = 0;
    // ナイキストより高いトーンは黙らせる(emu2149 と同じ。実機は後ろの回路が落とす)
    this.freqLimit = Math.floor(CLK / 16 / (rate / 2));
    this.reg = new Uint8Array(16);
    this.count = new Uint16Array(3);
    this.freq = new Uint16Array(3);
    this.edge = new Uint8Array(3);
    this.volume = new Uint8Array(3);
    this.tmask = new Uint8Array(3);
    this.nmask = new Uint8Array(3);
    this.chOut = new Int32Array(3);
    this.noiseSeed = 0xffff;
    this.noiseScaler = 0;
    this.noiseCount = 0;
    this.noiseFreq = 0;
    this.envPtr = 0;
    this.envFace = 0;
    this.envContinue = 0;
    this.envAttack = 0;
    this.envAlternate = 0;
    this.envHold = 0;
    this.envPause = 1;
    this.envFreq = 0;
    this.envCount = 0;
    this.out = 0;
  }

  writeReg(reg, val) {
    if (reg > 15) return;
    val &= REGMSK[reg];
    this.reg[reg] = val;
    switch (reg) {
      case 0: case 1: case 2: case 3: case 4: case 5: {
        const c = reg >> 1;
        this.freq[c] = ((this.reg[c * 2 + 1] & 15) << 8) + this.reg[c * 2];
        break;
      }
      case 6:
        this.noiseFreq = val & 31;
        break;
      case 7:
        this.tmask[0] = val & 1; this.tmask[1] = val & 2; this.tmask[2] = val & 4;
        this.nmask[0] = val & 8; this.nmask[1] = val & 16; this.nmask[2] = val & 32;
        break;
      case 8: case 9: case 10:
        this.volume[reg - 8] = val << 1;
        break;
      case 11: case 12:
        this.envFreq = (this.reg[12] << 8) + this.reg[11];
        break;
      case 13:
        this.envContinue = (val >> 3) & 1;
        this.envAttack = (val >> 2) & 1;
        this.envAlternate = (val >> 1) & 1;
        this.envHold = val & 1;
        this.envFace = this.envAttack;
        this.envPause = 0;
        this.envPtr = this.envFace ? 0 : 0x1f;
        break;
    }
  }

  /** 内部の 1 刻み(CLK / 8 に 1 回) */
  update() {
    // エンベロープ
    this.envCount++;
    if (this.envCount >= this.envFreq) {
      if (!this.envPause) {
        this.envPtr = this.envFace ? (this.envPtr + 1) & 0x3f : (this.envPtr + 0x3f) & 0x3f;
      }
      if (this.envPtr & 0x20) {
        if (this.envContinue) {
          if (this.envAlternate ^ this.envHold) this.envFace ^= 1;
          if (this.envHold) this.envPause = 1;
          this.envPtr = this.envFace ? 0 : 0x1f;
        } else {
          this.envPause = 1;
          this.envPtr = 0;
        }
      }
      if (this.envFreq >= 1) this.envCount -= this.envFreq;
      else this.envCount = 0;
    }
    // ノイズ。17 ビットの並びを、2 回に 1 回進める
    this.noiseCount++;
    if (this.noiseCount >= this.noiseFreq) {
      this.noiseScaler ^= 1;
      if (this.noiseScaler) {
        if (this.noiseSeed & 1) this.noiseSeed ^= 0x24000;
        this.noiseSeed >>= 1;
      }
      if (this.noiseFreq >= 1) this.noiseCount -= this.noiseFreq;
      else this.noiseCount = 0;
    }
    const noise = this.noiseSeed & 1;
    // トーン
    for (let i = 0; i < 3; i++) {
      this.count[i]++;
      if (this.count[i] >= this.freq[i]) {
        this.edge[i] ^= 1;
        if (this.freq[i] >= 1) this.count[i] -= this.freq[i];
        else this.count[i] = 0;
      }
      // ナイキストより高いトーンを黙らせるのは、トーンを開けているときだけ。
      // emu2149 は閉じていても見るので、周期を書かずに鳴らすブザー(R7 で
      // トーンを閉じて、音量をエンベロープに任せる)が黙っていた
      if (this.freqLimit > 0 && !this.tmask[i] && this.freq[i] <= this.freqLimit && this.nmask[i]) continue;
      if ((this.tmask[i] || this.edge[i]) && (this.nmask[i] || noise)) {
        const v = this.volume[i];
        this.chOut[i] = (v & 32 ? this.voltbl[this.envPtr] : this.voltbl[v & 31]) << 4;
      } else {
        this.chOut[i] = 0;
      }
    }
  }

  /** 出口の 1 サンプル */
  calc() {
    while (this.realstep > this.psgtime) {
      this.psgtime += this.psgstep;
      this.update();
      this.out = (this.out + this.chOut[0] + this.chOut[1] + this.chOut[2]) >> 1;
    }
    this.psgtime -= this.realstep;
    return this.out;
  }
}

/**
 * 行き先 1 つぶんの処理器。中にチップを何個でも持つ。
 *
 * 実機の 1 個のチップは、3 声でノイズ 1 つとエンベロープ 1 つを分け合う。
 * こちらは止めない。ブザーやノイズを同時に鳴らしたいときは、空いている
 * チップが無ければ 1 個足す。実機で一緒に使えるかは、書き出しのときに見る
 * (鳴らす側は縛らない)。
 *
 * 黙っているチップは回さないので、重さは鳴っている音の数に比例する。
 */
class AyBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    // チップの並び。1 つが { c: PSG, type, v: [3 声] }
    this.pool = [];
    this.log = !!q.log;
    this.logNow = 0;
    // 直流を抜く(実機の出口のコンデンサにあたる)。前の入力と前の出力
    this.dcX = 0;
    this.dcY = 0;
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

  /** チップを 1 個足す。type は音量の表(0 = YM2149、1 = AY-3-8910) */
  grow(type) {
    const c = new PSG(sampleRate, type);
    const chip = { c, type, log: null, v: [0, 1, 2].map(() => ({ end: 0, vs: null, ps: null, gs: null })) };
    // 記録するときは、書いた時刻と中身をチップごとに溜めて外へ流す。
    // チップが何個あっても、どれへの書き込みかが分かるように分けておく
    // (VGM へ出すときは、チップごとに 1 個のチップとして書く)
    if (this.log) {
      const raw = c.writeReg.bind(c);
      chip.log = [];
      c.writeReg = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    // ノイズもトーンも切っておく(R7 は 1 で止まる)
    c.writeReg(7, 0x3f);
    this.pool.push(chip);
    return chip;
  }

  /** 止める。溜めたイベントを捨てて、鳴っている声を黙らせる */
  cut() {
    this.events.length = 0;
    this.at = 0;
    for (const chip of this.pool) for (let ch = 0; ch < 3; ch++) this.silence(chip, ch);
    if (this.cutAt < 0) this.cutAt = 0;
  }

  /** その声を黙らせる。音量を 0 にして、トーンもノイズも外す */
  silence(chip, ch) {
    const c = chip.c;
    const v = chip.v[ch];
    v.end = 0; v.vs = null; v.ps = null; v.gs = null;
    v.noise = false; v.env = false;
    if (c.reg[8 + ch] !== 0) c.writeReg(8 + ch, 0);
    const mix = c.reg[7] | (9 << ch);
    if (c.reg[7] !== mix) c.writeReg(7, mix);
  }

  /**
   * 音符を置く場所を選ぶ。空いた声があり、ノイズやエンベロープを使う音符なら
   * それを使っている声がほかに無いチップ。無ければチップを足す。
   */
  pick(ev, now) {
    const type = ev.ay ? 1 : 0;
    for (const chip of this.pool) {
      if (chip.type !== type) continue;
      let free = -1, busyNoise = false, busyEnv = false;
      for (let ch = 0; ch < 3; ch++) {
        const v = chip.v[ch];
        if (v.end <= now) { if (free < 0) free = ch; continue; }
        if (v.noise) busyNoise = true;
        if (v.env) busyEnv = true;
      }
      if (free < 0) continue;
      if (ev.noise && busyNoise) continue;
      if (ev.env && busyEnv) continue;
      return { chip, ch: free };
    }
    return { chip: this.grow(type), ch: 0 };
  }

  /** トーンの周期を書いて、そのチャンネルのトーンを開ける(0 なら閉じる) */
  gate(c, ch, tp) {
    if (tp > 0) {
      if (c.reg[ch * 2] !== (tp & 0xff)) c.writeReg(ch * 2, tp & 0xff);
      if (c.reg[ch * 2 + 1] !== ((tp >> 8) & 15)) c.writeReg(ch * 2 + 1, (tp >> 8) & 15);
    }
    const mix = tp > 0 ? c.reg[7] & ~(1 << ch) : c.reg[7] | (1 << ch);
    if (c.reg[7] !== mix) c.writeReg(7, mix);
  }

  /** 音符を 1 つ乗せる */
  start(ev, now) {
    const { chip, ch } = this.pick(ev, now);
    const c = chip.c;
    // 前の音が残っていれば先に黙らせる(書き直しの並びを捨てる)
    if (chip.v[ch].end > 0) this.silence(chip, ch);
    const noise = !!ev.noise;
    const env = ev.env || null;
    // R7 は 1 で止まる。まずトーンもノイズも閉じてから、要るほうを開ける
    let mix = c.reg[7] | (9 << ch);
    if (noise) {
      if (c.reg[6] !== ev.np) c.writeReg(6, ev.np);
      mix &= ~(8 << ch);
    } else if (!env) {
      c.writeReg(ch * 2, ev.tp & 0xff);
      c.writeReg(ch * 2 + 1, (ev.tp >> 8) & 15);
      mix &= ~(1 << ch);
    }
    if (c.reg[7] !== mix) c.writeReg(7, mix);
    if (env) {
      // ブザー。周期を書いてから R13 を書く。R13 を書くとエンベロープが頭から回る。
      // トーンは区切り(gs)の最初の値で開け閉めする(@g で掛ける矩形波)
      c.writeReg(11, env.ep & 0xff);
      c.writeReg(12, (env.ep >> 8) & 0xff);
      c.writeReg(13, env.shape);
      this.gate(c, ch, ev.g0 || 0);
    }
    // 音量は 0〜15。16 を足すとエンベロープに従う(ブザー)
    c.writeReg(8 + ch, ev.v & 31);
    const v = chip.v[ch];
    v.end = ev.t + ev.dur;
    v.noise = noise;
    v.env = !!env;
    v.vs = ev.vs && ev.vs.length ? { list: ev.vs, at: 0 } : null;
    v.ps = ev.ps && ev.ps.length ? { list: ev.ps, at: 0 } : null;
    v.gs = ev.gs && ev.gs.length ? { list: ev.gs, at: 0 } : null;
  }

  /** 時刻が来た書き直しを書く。終わった声を黙らせる */
  step(now) {
    for (const chip of this.pool) {
      const c = chip.c;
      for (let ch = 0; ch < 3; ch++) {
        const v = chip.v[ch];
        if (v.end <= 0) continue;
        if (v.end <= now) { this.silence(chip, ch); continue; }
        if (v.vs) {
          const f = v.vs;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            const val = f.list[f.at++][1] & 31;
            if (c.reg[8 + ch] !== val) c.writeReg(8 + ch, val);
          }
          if (f.at >= f.list.length) v.vs = null;
        }
        if (v.ps) {
          const f = v.ps;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            const p = f.list[f.at++][1];
            if (v.noise) {
              if (c.reg[6] !== p) c.writeReg(6, p);
            } else if (v.env) {
              // ブザーの高さはエンベロープの周期。R13 は書かない(書くと頭から回り直す)
              if (c.reg[11] !== (p & 0xff)) c.writeReg(11, p & 0xff);
              if (c.reg[12] !== ((p >> 8) & 0xff)) c.writeReg(12, (p >> 8) & 0xff);
            } else {
              if (c.reg[ch * 2] !== (p & 0xff)) c.writeReg(ch * 2, p & 0xff);
              if (c.reg[ch * 2 + 1] !== ((p >> 8) & 15)) c.writeReg(ch * 2 + 1, (p >> 8) & 15);
            }
          }
          if (f.at >= f.list.length) v.ps = null;
        }
        if (v.gs) {
          const f = v.gs;
          while (f.at < f.list.length && f.list[f.at][0] <= now) this.gate(c, ch, f.list[f.at++][1]);
          if (f.at >= f.list.length) v.gs = null;
        }
      }
    }
  }

  /** そのチップに鳴っている声があるか */
  live(chip) {
    return chip.v[0].end > 0 || chip.v[1].end > 0 || chip.v[2].end > 0;
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const n = out.length;
    const base = currentTime;
    // 何も鳴っておらず、次の音符もこの範囲に来ないなら、計算を飛ばす。
    // 直流を抜いたあとの尾が残っているあいだは回す
    const next = this.at < this.events.length ? this.events[this.at].t : Infinity;
    if (!this.pool.some((c) => this.live(c)) && next >= base + n / sampleRate
      && Math.abs(this.dcY) < 1e-6) {
      out.fill(0);
      this.dcX = 0; this.dcY = 0;
      return true;
    }
    for (let i = 0; i < n; i++) {
      const now = base + i / sampleRate;
      if (this.log) this.logNow = now;
      // 終わる音符を、始まる音符より先に(sound/opll.js と同じ理由)
      this.step(now);
      while (this.at < this.events.length && this.events[this.at].t <= now) {
        this.start(this.events[this.at++], now);
      }
      // 黙っているチップは回さない。出口は 0 のまま
      let raw = 0;
      for (const chip of this.pool) {
        if (this.live(chip)) raw += chip.c.calc();
        else chip.c.out = 0;
      }
      const x = raw / OUT_DIV;
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
        // type は音量の表(0 = YM2149、1 = AY-3-8910)。VGM の頭に書くのに要る
        this.port.postMessage({ regs: chip.log, chip: k, type: chip.type });
        chip.log = [];
      }
    }
    return this.alive;
  }
}
registerProcessor('mmsxx-ay', AyBank);
`;
