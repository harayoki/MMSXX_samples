// PC エンジン(HuC6280 に内蔵の PSG)。チップそのものを持って鳴らす。
//
// ---- なぜチップそのものを持つか ----
//
// `wave*` の 5 ビットの音色は、波形の形を Web Audio の発振器で鳴らしている。
// こちらは実機の作りどおり、声ごとに 32 個・5 ビットの波形を 12 ビットの周期で読み、
// 音量は 1 段およそ 1.5dB の対数で掛ける(docs/ENGINE_TODO.md の「1b」)。
//
// ---- 出どころ ----
//
// どのエミュレータも移していない。Hudson の公式マニュアル(HuC6280 CMOS Programmable
// Sound Generator Manual)を読んで書いた。ノイズの乱数の並び(18 ビット、タップ
// 0・1・11・12・17)はマニュアルに無いので、Charles MacDonald の調査の値を使った。
// 確かめるときは、同じ書き込みを VGM にして libvgm の MAME のコア(c6280)で鳴らす。
//
// ---- 決めたこと ----
//
// - 音量は mednafen と同じ 1 段 2^(-1/4)(およそ 1.505dB)。mednafen で測った値(1.51dB)と合う。
//   Ootake の 1.09dB は作者が耳で合わせた値なので採らない
// - 波形の中心は HuC6280A(後期のチップ)に合わせる。初期のチップは音量を変えると
//   直流が動いてポップノイズが出るが、それは写さない
//
// ---- まだ無いもの ----
//
// - LFO(声 2 で声 1 の高さを変える)
// - DDA(値を直に出して PCM を鳴らす)
// - ステレオ。左右の音量はどちらも最大にして、片側だけ出している

import { registerPCE } from './mml.js';
import { WT_SINE, WT_RAMP } from './wavetables.js';

/** PSG のクロック。CPU の半分(21.47727MHz ÷ 3 ÷ 2) */
export const PCE_CLOCK = 3579545;

/**
 * 出口の大きさ。山いっぱい(0 と 31)の矩形を音量 31 で鳴らしたときの実効値が、
 * `pulse(50)` を `v15` で鳴らしたときと揃う数。
 */
export const PCE_OUT_GAIN = 0.1393;

/**
 * 音の高さから、周期の値(R2/R3)。12 ビット。f = CLK / (32 × 値)。
 * 0 は 4096 として扱われるので使わない。
 * @param {number} freq 高さ(Hz)
 */
export function pcePeriod(freq) {
  if (!(freq > 0)) return 4095;
  return Math.max(1, Math.min(4095, Math.round(PCE_CLOCK / (32 * freq))));
}

/**
 * 音の高さから、ノイズの値(R7 の下 5 ビット)。
 *
 * ノイズのクロックは CLK / (64 × (31 − 値))。音程は無いので、書いた高さで粗さを選ぶ。
 * o4a がまん中あたりに来るよう、高さの 16 倍に近いクロックを選ぶ。
 * 31 はマニュアルで決まっていない(エミュレータごとに違う)ので使わない。
 * @param {number} freq 高さ(Hz)
 */
export function pceNoise(freq) {
  if (!(freq > 0)) return 0;
  const nf = Math.max(1, Math.min(31, Math.round(PCE_CLOCK / (64 * freq * 16))));
  return 31 - nf;
}

/** -1..1 の 32 個を、0〜31 の値へ */
export const pceWave = (list) => Array.from(list, (v) => Math.max(0, Math.min(31, Math.round((v + 1) / 2 * 31))));

/**
 * 最初から入れておく音色。説明は英語だけ持つ(日本語はデータに入れない)。
 *
 * 置くのは、ほかの音源から曲を移すときに要る基本の形だけ。PC エンジンの音色は
 * 本来ゲームごとに作るもので、ベルやオルガンのような形をこちらで描いて並べても、
 * 実機の音にはならない。実際のゲームで使われた形は、別に取り込む(2026-10-04)。
 */
export const PCE_PRESETS = [
  ['pceSquare', Array.from({ length: 32 }, (_, i) => (i < 16 ? 1 : -1)), 'lead',
    'A 50% square on the PC Engine chip itself. The basic shape for porting a pulse part from another chip.'],
  ['pceTriangle', Array.from({ length: 32 }, (_, i) => (i < 16 ? -1 + i / 7.5 : 1 - (i - 16) / 7.5)), 'bass',
    'A triangle on the PC Engine chip. Five bits leave a visible staircase; the basic shape for porting a bass.'],
  ['pceSaw', WT_RAMP, 'lead',
    'A sawtooth on the PC Engine chip. The five-bit steps make it buzz.'],
  ['pceSine', WT_SINE, 'chord',
    'A sine on the PC Engine chip: thirty-two five-bit samples, so the staircase is audible.'],
];

/**
 * 最初から入れておく音色を登録する(エンジンが読み込まれるときに走る)。
 * 二度呼ばれても止まらない(ほかの register* と同じ)。
 */
export function registerPCEPresets() {
  for (const [name, wave, role, desc] of PCE_PRESETS) {
    try { registerPCE(name, { wave: pceWave(wave) }, { role, desc, tags: ['pce'] }); }
    catch (e) { /* すでに入っている */ }
  }
  try {
    registerPCE('pceNoise', { noise: true }, { role: 'noise', tags: ['pce'],
      desc: 'Noise from the PC Engine chip itself (voices 5 and 6 only). The note picks the noise clock; '
        + 'o4a lands mid-range, lower notes are coarser.' });
  } catch (e) { /* すでに入っている */ }
}

/**
 * 処理器の中身(文字列から作るのでファイルは増えない)。
 *
 * レジスタの番号は $0800 からの差(0〜9)。R0 で声を選んでから、その声の R2〜R7 を書く。
 * VGM の HuC6280 と同じ番号なので、記録をそのまま VGM に書ける。
 */
export const PCE_CODE = `
const CLK = ${PCE_CLOCK};
const OUT_GAIN = ${PCE_OUT_GAIN};

/** 減衰の段(1 段 2^(-1/4))から掛け率へ。31 段以上は無音 */
const ATT = Array.from({ length: 32 }, (_, i) => (i >= 31 ? 0 : Math.pow(2, -i / 4)));

/**
 * チップ 1 個。出口のサンプルごとにクロックを数えて進め、そのあいだの値を平均してから
 * 混ぜる(点で拾うと高い音で折り返しが出るため)。
 */
class PSG {
  constructor(rate) {
    this.step = CLK / rate;
    this.frac = 0;
    this.sel = 0;
    this.master = 0xff;
    this.ch = Array.from({ length: 6 }, () => ({
      period: 0, ctrl: 0, bal: 0xff, wave: new Uint8Array(32), wpos: 0, pos: 0, count: 1,
      noise: 0, lfsr: 1, ncount: 1, nbit: 0,
    }));
    this.reg = new Uint8Array(16);
  }

  writeReg(r, v) {
    this.reg[r] = v;
    const c = this.ch[this.sel];
    switch (r) {
      case 0: this.sel = v & 7; if (this.sel > 5) this.sel = 5; break;
      case 1: this.master = v; break;
      case 2: c.period = (c.period & 0xf00) | v; break;
      case 3: c.period = (c.period & 0xff) | ((v & 15) << 8); break;
      case 4: {
        // 鳴らさず DDA だけ立てると、書き込みの位置が 0 に戻る
        if ((v & 0xc0) === 0x40) c.wpos = 0;
        c.ctrl = v;
        break;
      }
      case 5: c.bal = v; break;
      case 6:
        // 鳴らしていないときだけ、波形メモリへ順に書く
        if (!(c.ctrl & 0x80)) { c.wave[c.wpos] = v & 31; c.wpos = (c.wpos + 1) & 31; }
        break;
      case 7: if (this.sel >= 4) c.noise = v; break;
    }
  }

  /** その声の掛け率。声の音量・左右・全体の減衰を合わせる(左側) */
  gain(c) {
    const al = c.ctrl & 31, lal = c.bal >> 4, lmal = this.master >> 4;
    if (!(c.ctrl & 0x80) || al === 0 || lal === 0 || lmal === 0) return 0;
    const att = (31 - al) + (15 - lal) * 2 + (15 - lmal) * 2;
    return ATT[Math.min(31, att)];
  }

  /** 出口の 1 サンプル(およそ -1..1) */
  calc() {
    this.frac += this.step;
    const n = Math.floor(this.frac);
    this.frac -= n;
    if (n <= 0) return this.out || 0;
    let mix = 0;
    for (let i = 0; i < 6; i++) {
      const c = this.ch[i];
      const g = this.gain(c);
      if (g === 0) continue;
      let left = n, sum = 0;
      if (i >= 4 && (c.noise & 0x80)) {
        // ノイズ。31 は決まっていないので、30 と同じ速さにする
        const nf = 31 - Math.min(30, c.noise & 31);
        const per = 64 * nf;
        while (left >= c.ncount) {
          sum += (c.nbit ? 31 : 0) * c.ncount;
          left -= c.ncount;
          // 18 ビットの並び。タップ 0・1・11・12・17
          const b = c.lfsr;
          const fb = (b ^ (b >> 1) ^ (b >> 11) ^ (b >> 12) ^ (b >> 17)) & 1;
          c.lfsr = (b >> 1) | (fb << 17);
          c.nbit = c.lfsr & 1;
          c.ncount = per;
        }
        sum += (c.nbit ? 31 : 0) * left;
        c.ncount -= left;
      } else {
        const per = c.period === 0 ? 4096 : c.period;
        while (left >= c.count) {
          sum += c.wave[c.pos] * c.count;
          left -= c.count;
          c.pos = (c.pos + 1) & 31;
          c.count = per;
        }
        sum += c.wave[c.pos] * left;
        c.count -= left;
      }
      // 中心を 15.5 に取る(HuC6280A)。初期のチップのポップノイズは写さない
      mix += (sum / n - 15.5) / 15.5 * g;
    }
    this.out = mix * OUT_GAIN;
    return this.out;
  }
}

/** 声の種類。ノイズは 5 と 6(番号は 4 と 5)だけ */
const ANY = [0, 1, 2, 3, 4, 5];
const NOISE = [4, 5];

/**
 * 行き先 1 つぶんの処理器。中にチップを何個でも持つ(sound/ay.js と同じ考え方)。
 */
class PceBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    this.pool = [];
    this.log = !!q.log;
    this.logNow = 0;
    this.cutAt = -1;
    this.cutLen = Math.max(1, Math.round(sampleRate * 0.01));
    this.port.onmessage = (e) => {
      if (e.data && e.data.cut) { this.cut(); return; }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      this.cutAt = -1;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
    };
  }

  grow() {
    const c = new PSG(sampleRate);
    const chip = { c, log: null, v: ANY.map(() => ({ end: 0, vs: null, ps: null, noise: false })),
      wave: Array(6).fill(null) };
    if (this.log) {
      const raw = c.writeReg.bind(c);
      chip.log = [];
      c.writeReg = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    c.writeReg(1, 0xff);
    for (let s = 0; s < 6; s++) { c.writeReg(0, s); c.writeReg(4, 0); c.writeReg(5, 0xff); }
    this.pool.push(chip);
    return chip;
  }

  /** その声を選ぶ(同じなら書かない) */
  sel(c, s) { if (c.sel !== s) c.writeReg(0, s); }

  cut() {
    this.events.length = 0;
    this.at = 0;
    for (const chip of this.pool) for (let s = 0; s < 6; s++) this.silence(chip, s);
    if (this.cutAt < 0) this.cutAt = 0;
  }

  silence(chip, s) {
    const v = chip.v[s];
    v.end = 0; v.vs = null; v.ps = null;
    this.sel(chip.c, s);
    chip.c.writeReg(4, 0);
    if (v.noise) { chip.c.writeReg(7, 0); v.noise = false; }
  }

  pick(ev, now) {
    const want = ev.noise ? NOISE : ANY;
    for (const chip of this.pool) {
      // 同じ波形がすでに載っている声を先に選ぶ(書き直さずに済む)
      if (!ev.noise) for (const s of want) if (chip.v[s].end <= now && chip.wave[s] === ev.wkey) return { chip, s };
      for (const s of want) if (chip.v[s].end <= now) return { chip, s };
    }
    return { chip: this.grow(), s: want[0] };
  }

  start(ev, now) {
    const { chip, s } = this.pick(ev, now);
    const c = chip.c;
    if (chip.v[s].end > 0) this.silence(chip, s);
    this.sel(c, s);
    const v = chip.v[s];
    if (ev.noise) {
      c.writeReg(7, 0x80 | (ev.p & 31));
      v.noise = true;
    } else {
      if (chip.wave[s] !== ev.wkey) {
        // 書き込みの位置を 0 に戻して、32 個を順に書く
        c.writeReg(4, 0x40);
        c.writeReg(4, 0x00);
        for (let i = 0; i < 32; i++) c.writeReg(6, ev.wave[i]);
        chip.wave[s] = ev.wkey;
      }
      c.writeReg(2, ev.p & 0xff);
      c.writeReg(3, (ev.p >> 8) & 15);
    }
    c.writeReg(4, 0x80 | (ev.v & 31));
    v.end = ev.t + ev.dur;
    v.vs = ev.vs && ev.vs.length ? { list: ev.vs, at: 0 } : null;
    v.ps = ev.ps && ev.ps.length ? { list: ev.ps, at: 0 } : null;
  }

  step(now) {
    for (const chip of this.pool) {
      const c = chip.c;
      for (let s = 0; s < 6; s++) {
        const v = chip.v[s];
        if (v.end <= 0) continue;
        if (v.end <= now) { this.silence(chip, s); continue; }
        if (v.vs) {
          const f = v.vs;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            this.sel(c, s);
            c.writeReg(4, 0x80 | (f.list[f.at++][1] & 31));
          }
          if (f.at >= f.list.length) v.vs = null;
        }
        if (v.ps) {
          const f = v.ps;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            const p = f.list[f.at++][1];
            this.sel(c, s);
            if (v.noise) c.writeReg(7, 0x80 | (p & 31));
            else { c.writeReg(2, p & 0xff); c.writeReg(3, (p >> 8) & 15); }
          }
          if (f.at >= f.list.length) v.ps = null;
        }
      }
    }
  }

  live(chip) {
    for (let s = 0; s < 6; s++) if (chip.v[s].end > 0) return true;
    return false;
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const n = out.length;
    const base = currentTime;
    const next = this.at < this.events.length ? this.events[this.at].t : Infinity;
    if (!this.pool.some((c) => this.live(c)) && next >= base + n / sampleRate) {
      out.fill(0);
      return true;
    }
    for (let i = 0; i < n; i++) {
      const now = base + i / sampleRate;
      if (this.log) this.logNow = now;
      this.step(now);
      while (this.at < this.events.length && this.events[this.at].t <= now) {
        this.start(this.events[this.at++], now);
      }
      let v = 0;
      for (const chip of this.pool) if (this.live(chip)) v += chip.c.calc();
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
    return true;
  }
}
registerProcessor('mmsxx-pce', PceBank);
`;
