// YM3526(OPL)。MSX-AUDIO(Y8950)の FM 部と同じもの。
//
// ---- 出どころ ----
//
// emu8950(Mitsutaka Okazaki、MIT)を読んで書き直した。
// https://github.com/digital-sound-antiques/emu8950
// OPLL と同じ値になる表は sound/fmtables.js から埋める。エンベロープと位相は
// 細かさと桁が違うので、ここで別に持つ(docs/ENGINE_TODO.md の 2i)。
//
// 実機と一致させることまでは求めない。emu8950 と同じ計算をしていれば、
// エミュレータで聞いた音とおおよそ合う。
//
// ---- この音源を外すとき ----
//
// 音色と @opl{…} の書き方はこのファイルが自分で登録する。処理器だけは audio.js の
// 「外せる音源」の並びが登録する(こちらから audio.js を読むと輪になるため)。
// 外すときは、その並びの 2 行を消せばよい。
//
// ---- まだ無いもの ----
//
// - プリセットの音色。実機の BIOS の音色を合法に確かめる手段が少ないので、保留にしている。
//   音色は @opl{…} か registerOPL で自分で作る
// - リズム(BDh の bit5)。チップは打楽器の音を作れるが、音符から叩く道が無い
// - フェード、ポルタメント、タイ。OPLL の処理器が持っているものを、まだ写していない
// - タイマーと CSM、ADPCM(ADPCM は sound/oplpcm.js で別に鳴らす)

import { FM_TABLES_CODE } from './fmtables.js';
import { registerVoice, registerVoiceSyntax } from './mml.js';
import { registerDefaultLayers } from './layerpresets.js';
import { registerChipKind } from './audio.js';
import './oplpcm.js';

export const OPL_CLOCK = 3579545;

/**
 * 処理器の中身。1 つの文字列として持つ(sound/opll.js の OPLL_CODE と同じ決まり)。
 * 中にバッククォートを書かない。コメントの中も同じ。
 */
export const OPL_CODE = `
const CLK = ${OPL_CLOCK};
const RATE = CLK / 72;
${FM_TABLES_CODE}

// 速い刻み(速さ 13 と 14)。OPLL には無い
const EG_STEP_FAST = [
  [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 2, 1, 1, 1, 2],
  [1, 2, 1, 2, 1, 2, 1, 2], [1, 2, 2, 2, 1, 2, 2, 2],
];

// エンベロープは 9 ビット。1 段 0.1875dB
const EG_MUTE = 511;
const EG_MAX = 0x1f0;
const ATTACK = 0, DECAY = 1, SUSTAIN = 2, RELEASE = 3;

// キースケールで落とす量。block と fnum の上 4 ビットで引く。
// KSL の 2 ビットはレジスタの中で並びが逆なので、入れ替えて読む
const TLL = new Uint16Array(128 * 4);
for (let fnum = 0; fnum < 16; fnum++) {
  for (let blk = 0; blk < 8; blk++) {
    for (let kl = 0; kl < 4; kl++) {
      const kx = ((kl & 1) << 1) | ((kl >> 1) & 1);
      const at = ((blk << 4) | fnum) * 4 + kl;
      if (kl === 0) { TLL[at] = 0; continue; }
      const tmp = Math.trunc(KL[fnum] - 6 * (7 - blk));
      TLL[at] = tmp <= 0 ? 0 : Math.trunc((tmp >> (3 - kx)) / 0.1875);
    }
  }
}
// キースケールでエンベロープが速くなるぶん。NOTE SEL(08h の bit6)で引く位置が変わる
const RKS = new Int32Array(2 * 32 * 2);
for (let f8 = 0; f8 < 2; f8++) {
  for (let f9 = 0; f9 < 2; f9++) {
    for (let blk = 0; blk < 8; blk++) {
      const b = (blk << 2) | (f9 << 1) | f8;
      RKS[(0 * 32 + b) * 2 + 1] = (blk << 1) + f9;
      RKS[(0 * 32 + b) * 2 + 0] = blk >> 1;
      RKS[(1 * 32 + b) * 2 + 1] = (blk << 1) + (f9 & f8);
      RKS[(1 * 32 + b) * 2 + 0] = blk >> 1;
    }
  }
}

// レジスタの下 5 ビット → スロット。6、7、14、15 などは空き
const SLOT_OF = [0, 2, 4, 1, 3, 5, -1, -1, 6, 8, 10, 7, 9, 11, -1, -1,
  12, 14, 16, 13, 15, 17, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

function newPatch() {
  return { AM: 0, PM: 0, EG: 0, KR: 0, ML: 0, KL: 0, TL: 0, AR: 0, DR: 0, SL: 0, RR: 0, FB: 0 };
}

function newSlot(n) {
  return {
    number: n, type: n % 2, pgKeep: 0, patch: newPatch(),
    pgPhase: 0, pgOut: 0, out0: 0, out1: 0,
    egState: RELEASE, egOut: EG_MUTE, egRateH: 0, egRateL: 0, egShift: 0,
    fnum: 0, blk: 0, blkFnum: 0, tll: 0, rks: 0, req: 0,
  };
}

class OPL {
  constructor() {
    this.reg = new Uint8Array(0x100);
    this.slot = [];
    for (let i = 0; i < 18; i++) this.slot.push(newSlot(i));
    this.alg = new Uint8Array(9);
    this.slotKey = 0;
    this.notesel = 0;
    this.pmPhase = 0; this.amPhase = 0; this.lfoAm = 0;
    this.amMode = 0; this.pmMode = 0;
    this.egCounter = 0;
    this.noise = 1; this.shortNoise = 0; this.rhythm = 0;
  }
  mod(ch) { return this.slot[ch << 1]; }
  car(ch) { return this.slot[(ch << 1) | 1]; }

  setFnumber(ch, fnum) {
    for (const s of [this.car(ch), this.mod(ch)]) {
      s.fnum = fnum;
      s.blkFnum = (s.blkFnum & 0x1c00) | (fnum & 0x3ff);
      s.req |= 2 | 4 | 8;
    }
  }
  setBlock(ch, blk) {
    for (const s of [this.car(ch), this.mod(ch)]) {
      s.blk = blk;
      s.blkFnum = ((blk & 7) << 10) | (s.blkFnum & 0x3ff);
      s.req |= 2 | 4 | 8;
    }
  }

  writeReg(reg, data) {
    reg &= 0xff;
    data &= 0xff;
    this.reg[reg] = data;
    if (reg === 0x08) {
      this.notesel = (data >> 6) & 1;
    } else if (reg >= 0x20 && reg < 0xa0) {
      const s = SLOT_OF[reg & 0x1f];
      if (s < 0) return;
      const sl = this.slot[s], p = sl.patch;
      const hi = reg & 0xe0;
      if (hi === 0x20) {
        p.AM = (data >> 7) & 1; p.PM = (data >> 6) & 1; p.EG = (data >> 5) & 1;
        p.KR = (data >> 4) & 1; p.ML = data & 15;
        sl.req |= 255;
      } else if (hi === 0x40) {
        p.KL = (data >> 6) & 3; p.TL = data & 63;
        sl.req |= 255;
      } else if (hi === 0x60) {
        p.AR = (data >> 4) & 15; p.DR = data & 15;
        sl.req |= 8;
      } else {
        p.SL = (data >> 4) & 15; p.RR = data & 15;
        sl.req |= 8;
      }
    } else if (reg >= 0xa0 && reg < 0xa9) {
      this.setFnumber(reg - 0xa0, data + ((this.reg[reg + 0x10] & 3) << 8));
    } else if (reg >= 0xb0 && reg < 0xb9) {
      const ch = reg - 0xb0;
      this.setFnumber(ch, ((data & 3) << 8) + this.reg[reg - 0x10]);
      this.setBlock(ch, (data >> 2) & 7);
      this.updateKey();
    } else if (reg >= 0xc0 && reg < 0xc9) {
      const ch = reg - 0xc0;
      this.mod(ch).patch.FB = (data >> 1) & 7;
      this.alg[ch] = data & 1;
    } else if (reg === 0xbd) {
      this.updateRhythm();
      this.updateKey();
      this.amMode = (data >> 7) & 1;
      this.pmMode = (data >> 6) & 1;
    }
  }

  /** リズムに入ると、下 3 チャンネルが打楽器になる(OPLL と同じ作り) */
  updateRhythm() {
    const on = (this.reg[0xbd] >> 5) & 1;
    if (this.rhythm !== on) {
      const t = on ? [3, 3, 3, 3] : [0, 1, 0, 1];
      this.slot[14].type = t[0]; this.slot[14].pgKeep = on;
      this.slot[15].type = t[1];
      this.slot[16].type = t[2];
      this.slot[17].type = t[3]; this.slot[17].pgKeep = on;
    }
    this.rhythm = on;
  }

  updateKey() {
    let want = 0;
    for (let ch = 0; ch < 9; ch++) if (this.reg[0xb0 + ch] & 0x20) want |= 3 << (ch * 2);
    const r = this.reg[0xbd];
    if ((r >> 5) & 1) {
      if (r & 0x10) want |= 3 << 12;   // バスドラは 2 スロット
      if (r & 0x01) want |= 1 << 14;   // ハイハット
      if (r & 0x08) want |= 1 << 15;   // スネア
      if (r & 0x04) want |= 1 << 16;   // タム
      if (r & 0x02) want |= 1 << 17;   // シンバル
    }
    const diff = this.slotKey ^ want;
    for (let i = 0; i < 18; i++) {
      if (!((diff >> i) & 1)) continue;
      if ((want >> i) & 1) this.slotOn(this.slot[i]);
      else { this.slot[i].egState = RELEASE; this.slot[i].req |= 8; }
    }
    this.slotKey = want;
  }

  /** キーオン。OPLL と違って DAMP を挟まず、すぐ上がりはじめる */
  slotOn(s) {
    s.rks = RKS[(this.notesel * 32 + (s.blkFnum >> 8)) * 2 + s.patch.KR];
    if (Math.min(15, s.patch.AR + (s.rks >> 2)) === 15) { s.egState = DECAY; s.egOut = 0; }
    else s.egState = ATTACK;
    if (!s.pgKeep) s.pgPhase = 0;
    s.req |= 8;
  }

  rateOf(s) {
    switch (s.egState) {
      case ATTACK: return s.patch.AR;
      case DECAY: return s.patch.DR;
      case SUSTAIN: return s.patch.EG ? 0 : s.patch.RR;
      case RELEASE: return s.patch.RR;
      default: return 0;
    }
  }
  commit(s) {
    if (s.req & 2) s.tll = TLL[(s.blkFnum >> 6) * 4 + s.patch.KL] + (s.patch.TL << 2);
    if (s.req & 4) s.rks = RKS[(this.notesel * 32 + (s.blkFnum >> 8)) * 2 + s.patch.KR];
    if (s.req & (4 | 8)) {
      const r = this.rateOf(s);
      if (r === 0) {
        s.egShift = 0; s.egRateH = 0; s.egRateL = 0;
      } else {
        s.egRateH = Math.min(15, r + (s.rks >> 2));
        s.egRateL = s.rks & 3;
        s.egShift = s.egState === ATTACK
          ? ((0 < s.egRateH && s.egRateH < 12) ? (12 - s.egRateH) : 0)
          : (s.egRateH < 12 ? (12 - s.egRateH) : 0);
      }
    }
    s.req = 0;
  }

  stepOf(s, c, decay) {
    const i = (c >> s.egShift) & 7;
    switch (s.egRateH) {
      case 0: return 0;
      case 13: return EG_STEP_FAST[s.egRateL][i];
      case 14: return EG_STEP_FAST[s.egRateL][i] << 1;
      case 15: return decay ? 4 : 0;
      default: return EG_STEP[s.egRateL][i];
    }
  }
  calcEnv(s, c) {
    const mask = (1 << s.egShift) - 1;
    if (s.egState === ATTACK) {
      if (0 < s.egOut && s.egRateH > 0 && (c & mask) === 0) {
        s.egOut += (~s.egOut * this.stepOf(s, c, false)) >> 3;
      }
    } else if (s.egRateH > 0 && (c & mask) === 0) {
      s.egOut = Math.min(EG_MUTE, s.egOut + this.stepOf(s, c, true));
    }
    if (s.egState === ATTACK) {
      if (s.egOut === 0) { s.egState = DECAY; s.req |= 8; }
    } else if (s.egState === DECAY) {
      if (s.patch.SL !== 15 && (s.egOut >> 4) === s.patch.SL) { s.egState = SUSTAIN; s.req |= 8; }
    }
  }
  calcPhase(s) {
    let pm = 0;
    if (s.patch.PM) {
      pm = PM[(s.fnum >> 7) & 7][this.pmPhase >> 19];
      if (!this.pmMode) pm >>= 1;
    }
    s.pgPhase += ((((s.fnum & 0x3ff) + pm) * ML[s.patch.ML]) << s.blk) >> 1;
    s.pgPhase &= (1 << 20) - 1;
    s.pgOut = s.pgPhase >> 10;
  }

  toLinear(h, s, am) {
    if (s.egOut >= EG_MAX) return 0;
    const att = Math.min(EG_MUTE, s.egOut + s.tll + am) << 3;
    return expLookup(h + att);
  }
  calcMod(ch) {
    const s = this.mod(ch);
    const fb = s.patch.FB > 0 ? (s.out1 + s.out0) >> (9 - s.patch.FB) : 0;
    const am = s.patch.AM ? this.lfoAm : 0;
    s.out1 = s.out0;
    s.out0 = this.toLinear(SIN[(s.pgOut + fb) & 1023], s, am);
    return s.out0;
  }
  calcCar(ch, fm) {
    const s = this.car(ch);
    const am = s.patch.AM ? this.lfoAm : 0;
    s.out1 = s.out0;
    s.out0 = this.toLinear(SIN[(s.pgOut + 2 * (fm >> 1)) & 1023], s, am);
    return s.out0;
  }
  /** 2 つのつなぎ方。0 は直列の FM、1 は 2 つを足すだけ */
  calcFm(ch) {
    if (this.alg[ch]) return this.calcCar(ch, 0) + this.calcMod(ch);
    return this.calcCar(ch, this.calcMod(ch));
  }

  stepNoise(n) {
    for (let i = 0; i < n; i++) {
      if (this.noise & 1) this.noise ^= 0x800200;
      this.noise >>>= 1;
    }
  }
  updateShortNoise() {
    const hh = this.slot[14].pgOut, cym = this.slot[17].pgOut;
    const h2 = (hh >> 2) & 1, h7 = (hh >> 7) & 1, h3 = (hh >> 3) & 1;
    const c3 = (cym >> 3) & 1, c5 = (cym >> 5) & 1;
    this.shortNoise = (h2 ^ h7) | (h3 ^ c5) | (c3 ^ c5);
  }
  calcTom() { const s = this.slot[16]; return this.toLinear(SIN[s.pgOut], s, 0); }
  calcSnare() {
    const s = this.slot[15];
    const ph = ((this.slot[14].pgOut >> 8) & 1)
      ? ((this.noise & 1) ? 0x300 : 0x200)
      : ((this.noise & 1) ? 0x000 : 0x100);
    return this.toLinear(SIN[ph], s, 0);
  }
  calcCym() {
    const s = this.slot[17];
    return this.toLinear(SIN[this.shortNoise ? 0x300 : 0x100], s, 0);
  }
  calcHat() {
    const s = this.slot[14];
    const ph = this.shortNoise
      ? ((this.noise & 1) ? 0x2d0 : 0x234)
      : ((this.noise & 1) ? 0x034 : 0x0d0);
    return this.toLinear(SIN[ph], s, 0);
  }

  /** 1 サンプル(49716Hz)ぶん進めて、和を返す。ノイズを進める位置は OPLL と同じ */
  tick() {
    this.pmPhase = (this.pmPhase + 512) & ((1 << 22) - 1);
    this.amPhase++;
    this.lfoAm = AM[(this.amPhase >> 6) % 210] >> (this.amMode ? 0 : 2);
    this.updateShortNoise();
    this.egCounter = (this.egCounter + 1) & 0xffff;
    for (let i = 0; i < 18; i++) {
      const s = this.slot[i];
      if (s.req) this.commit(s);
      this.calcEnv(s, this.egCounter);
      this.calcPhase(s);
    }
    let sum = 0;
    for (let ch = 0; ch < 6; ch++) sum += -this.calcFm(ch) >> 1;
    if (!this.rhythm) sum += -this.calcFm(6) >> 1;
    else sum += this.calcFm(6);                       // バスドラ
    this.stepNoise(14);
    if (!this.rhythm) sum += -this.calcFm(7) >> 1;
    else { sum += this.calcHat(); sum += this.calcSnare(); }
    this.stepNoise(2);
    if (!this.rhythm) sum += -this.calcFm(8) >> 1;
    else { sum += this.calcTom(); sum += this.calcCym(); }
    this.stepNoise(2);
    return sum;
  }
}

// ---- 音符を受けて、レジスタへ変換する ----

/** 高さから block と fnum を出す。fnum は 512 以上に寄せて刻みを稼ぐ */
function pitchOf(freq) {
  for (let blk = 0; blk < 8; blk++) {
    const fnum = Math.round(freq * 72 * (1 << (20 - blk)) / CLK);
    if (fnum < 1024) return { blk, fnum: Math.max(1, fnum) };
  }
  return { blk: 7, fnum: 1023 };
}

/** チャンネルの変調側のオフセット(20h 台などの下位)。搬送側は 3 足す */
function opOffset(ch) { return (ch % 3) + Math.floor(ch / 3) * 8; }

class OplBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    this.chip = new OPL();
    this.step = RATE / sampleRate;
    this.frac = 0;
    this.prev = 0;
    this.cur = 0;
    this.busy = new Float64Array(9);
    this.off = new Float64Array(9);
    this.cutAt = -1;
    this.cutLen = Math.max(1, Math.round(RATE * 0.01));
    this.port.onmessage = (e) => {
      if (e.data && e.data.cut) { this.cut(); return; }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      this.cutAt = -1;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
    };
  }

  /** 止める。溜めたイベントを捨て、キーオフを書いて、出口を 10 ミリ秒で落とす */
  cut() {
    this.events.length = 0;
    this.at = 0;
    for (let ch = 0; ch < 9; ch++) {
      const r = this.chip.reg[0xb0 + ch];
      if (r & 0x20) this.chip.writeReg(0xb0 + ch, r & ~0x20);
      this.busy[ch] = 0;
      this.off[ch] = 0;
    }
    if (this.cutAt < 0) this.cutAt = 0;
  }

  /** 空いている声。無ければいちばん早く空く声 */
  pick(now) {
    let best = 0;
    for (let ch = 0; ch < 9; ch++) {
      if (this.busy[ch] <= now) return ch;
      if (this.busy[ch] < this.busy[best]) best = ch;
    }
    return best;
  }

  /** 音色をそのチャンネルへ書く。音量は搬送側の TL に足す(1 段 3dB) */
  voice(ch, p, v) {
    const m = opOffset(ch), c = m + 3;
    const att = Math.max(0, Math.min(15, 15 - Math.round(v))) * 4;
    const w = (r, d) => this.chip.writeReg(r, d);
    w(0x20 + m, p.m[0]); w(0x20 + c, p.c[0]);
    w(0x40 + m, p.m[1]);
    w(0x40 + c, (p.c[1] & 0xc0) | Math.min(63, (p.c[1] & 63) + att));
    w(0x60 + m, p.m[2]); w(0x60 + c, p.c[2]);
    w(0x80 + m, p.m[3]); w(0x80 + c, p.c[3]);
    w(0xc0 + ch, p.fbc);
    // 足すつなぎ方では、変調側も音として出る。音量を両方に掛ける
    if (p.fbc & 1) w(0x40 + m, (p.m[1] & 0xc0) | Math.min(63, (p.m[1] & 63) + att));
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const n = out.length;
    for (let i = 0; i < n; i++) {
      const now = currentTime + i / sampleRate;
      for (let ch = 0; ch < 9; ch++) {
        if (this.off[ch] > 0 && this.off[ch] <= now) {
          const r = this.chip.reg[0xb0 + ch];
          if (r & 0x20) this.chip.writeReg(0xb0 + ch, r & ~0x20);
          this.off[ch] = 0;
        }
      }
      while (this.at < this.events.length && this.events[this.at].t <= now) {
        const ev = this.events[this.at++];
        if (!ev.patch || !(ev.v > 0)) continue;
        const ch = this.pick(now);
        const r = this.chip.reg[0xb0 + ch];
        if (r & 0x20) this.chip.writeReg(0xb0 + ch, r & ~0x20);
        const { blk, fnum } = pitchOf(ev.freq);
        this.voice(ch, ev.patch, ev.v);
        this.chip.writeReg(0xa0 + ch, fnum & 0xff);
        this.chip.writeReg(0xb0 + ch, 0x20 | (blk << 2) | ((fnum >> 8) & 3));
        // 離したあとの余韻ぶんは、次の音に声を譲らない
        this.busy[ch] = now + ev.dur + 0.3;
        this.off[ch] = now + ev.dur;
      }
      this.frac += this.step;
      while (this.frac >= 1) {
        this.prev = this.cur;
        this.cur = this.chip.tick();
        this.frac -= 1;
      }
      // 出口の割り算は OPLL と同じ(チップの生の値は int16 の幅)
      let v = (this.prev + (this.cur - this.prev) * this.frac) / 16384;
      if (this.cutAt >= 0) {
        v *= Math.max(0, 1 - this.cutAt / this.cutLen);
        this.cutAt++;
        if (this.cutAt > this.cutLen) { this.cutAt = this.cutLen; v = 0; }
      }
      out[i] = v;
    }
    return true;
  }
}
registerProcessor('mmsxx-opl', OplBank);
`;

/** オペレータ 1 つぶんのパラメータ。名前は @opll{…} と同じ(sound/opllvoice.js) */
const OP_FIELDS = {
  mul: { at: 'ml', max: 15,
    desc: 'Frequency multiple, 0 to 15. 0 means half. 1 is the written pitch, '
      + '2 is an octave up. On the modulator this sets which harmonic it adds.' },
  ksr: { at: 'kr', max: 1,
    desc: 'Key scale rate, 0 or 1. With 1 the envelope runs faster for higher notes.' },
  hold: { at: 'eg', max: 1,
    desc: 'Sustaining, 0 or 1. With 1 the note holds while the key is down. '
      + 'With 0 it keeps falling away, like a plucked or struck instrument.' },
  vibrato: { at: 'pm', max: 1,
    desc: 'Pitch wobble, 0 or 1. The chip has one speed and two depths for all channels.' },
  tremolo: { at: 'am', max: 1,
    desc: 'Volume wobble, 0 or 1. The chip has one speed and two depths for all channels.' },
  ksl: { at: 'kl', max: 3,
    desc: 'Key scale level, 0 to 3. How much quieter the higher notes get. '
      + '0 keeps every octave at the same level.' },
  tl: { at: 'tl', max: 63,
    desc: 'Total level, 0 to 63, in steps of 0.75dB. 0 is the loudest. On the modulator '
      + 'larger numbers mean fewer harmonics. On the carrier it is the level of the voice, '
      + 'and the volume (v in MML) is taken off on top of it.' },
  fb: { at: 'fb', max: 7, modOnly: true,
    desc: 'Feedback of the modulator into itself, 0 to 7. 0 is none. Larger numbers '
      + 'add harmonics and, at the top, break into noise. Only the modulator has it.' },
  ar: { at: 'ar', max: 15,
    desc: 'Attack rate, 0 to 15. How fast it rises. 15 is instant, 0 never starts.' },
  dr: { at: 'dr', max: 15,
    desc: 'Decay rate, 0 to 15. How fast it falls to the sustain level after the attack.' },
  sl: { at: 'sl', max: 15,
    desc: 'Sustain level, 0 to 15, in steps of 3dB. 0 is full, 15 is nearly silent. '
      + 'Where the decay stops.' },
  rr: { at: 'rr', max: 15,
    desc: 'Release rate, 0 to 15. How fast it falls once the key is let go.' },
};

/** 日常の言葉から、実機の呼び名へ(@opll{…} と同じ) */
const ALIASES = {
  ratio: 'mul', harmonic: 'mul',
  depth: 'tl', level: 'tl',
  attack: 'ar', decay: 'dr', sustain: 'sl', release: 'rr',
  feedback: 'fb',
  scale: 'ksl', scaleRate: 'ksr',
  sustaining: 'hold',
};

function fail(msg) { throw new Error(`[ChpTnSnd] OPL の音色: ${msg}`); }

/** 0 か 1 で書くところは、true / false でも書ける */
function numOf(v, max, key, where) {
  const n = (v === true) ? max : (v === false) ? 0 : Number(v);
  if (!Number.isFinite(n) || n < 0 || n > max || n !== Math.floor(n)) {
    fail(`${where} の "${key}" は 0〜${max} の整数です(${v} と書いてあります)`);
  }
  return n;
}

/** オペレータ 1 つぶんを読む。実機の呼び名に揃えた形で返す */
function readOp(src, where, isMod) {
  const out = { ml: 0, kr: 0, eg: 0, pm: 0, am: 0, kl: 0, tl: 0, fb: 0, ar: 0, dr: 0, sl: 0, rr: 0 };
  for (const [key, v] of Object.entries(src || {})) {
    const name = ALIASES[key] ?? key;
    const f = OP_FIELDS[name];
    if (!f) {
      if (name === 'wave' || name === 'half') fail('OPL の波形はサイン波だけです(半波整流は OPLL にしかありません)');
      const all = [...Object.keys(OP_FIELDS), ...Object.keys(ALIASES)].sort().join(' ');
      fail(`${where} に "${key}" は書けません(書けるもの: ${all})`);
    }
    if (f.modOnly && !isMod) fail(`"${key}" は変調側(mod)にだけ書けます`);
    out[f.at] = numOf(v, f.max, key, where);
  }
  return out;
}

/**
 * 音色の指定を、処理器が書くレジスタの値へ畳む。
 *
 * ```js
 * oplVoice({
 *   mod: { ratio: 2, depth: 29, attack: 15, decay: 2, sustain: 1, release: 7, hold: 1 },
 *   car: { ratio: 1, attack: 8, decay: 1, sustain: 0, release: 7, hold: 1 },
 *   feedback: 5, connect: 0,
 * });
 * ```
 *
 * 書き方は @opll{…} と同じ。違うのは 2 つだけ。キャリア側にも tl(depth)を書けることと、
 * つなぎ方(connect、0 は FM、1 は 2 つを足すだけ)があること。波形(wave)は書けない。
 *
 * @param {{mod?:object, car?:object, feedback?:number, connect?:number}} spec
 * @returns {{m:number[], c:number[], fbc:number}}
 */
export function oplVoice(spec = {}) {
  const m = readOp(spec.mod, 'mod', true);
  const c = readOp(spec.car, 'car', false);
  if (spec.feedback !== undefined) m.fb = numOf(spec.feedback, 7, 'feedback', 'この音色');
  const con = spec.connect === undefined ? 0 : numOf(spec.connect, 1, 'connect', 'この音色');
  for (const k of Object.keys(spec)) {
    if (!['mod', 'car', 'feedback', 'connect'].includes(k)) fail(`"${k}" は書けません(mod car feedback connect)`);
  }
  const op = (o) => [
    (o.am << 7) | (o.pm << 6) | (o.eg << 5) | (o.kr << 4) | o.ml,
    (o.kl << 6) | o.tl,
    (o.ar << 4) | o.dr,
    (o.sl << 4) | o.rr,
  ];
  return { m: op(m), c: op(c), fbc: (m.fb << 1) | con };
}

/**
 * 音色に書けるものを返す。名前から見当をつけさせないため。
 *
 * @returns {{mod:object, car:object, voice:object, aliases:object, desc:string}}
 */
export function describeOplVoice() {
  const back = {};
  for (const [from, to] of Object.entries(ALIASES)) (back[to] ||= []).push(from);
  const side = (isMod) => {
    const out = {};
    for (const [name, f] of Object.entries(OP_FIELDS)) {
      if (f.modOnly && !isMod) continue;
      out[name] = { min: 0, max: f.max, desc: f.desc, ...(back[name] ? { alsoCalled: back[name] } : {}) };
    }
    return out;
  };
  return {
    mod: side(true),
    car: side(false),
    voice: {
      feedback: { min: 0, max: 7, desc: 'The modulator feedback, written outside mod{…}. Same as fb.' },
      connect: { min: 0, max: 1, desc: 'How the two operators join. 0 is FM: the modulator bends '
        + 'the carrier and only the carrier is heard. 1 adds the two together, so both are heard.' },
    },
    aliases: { ...ALIASES },
    desc: 'A voice for the YM3526 (OPL), the FM part of MSX-AUDIO. Written like an OPLL user voice, '
      + 'with two differences: the carrier also takes a total level, and connect chooses FM or '
      + 'adding the two operators. The OPL has sine waves only, so there is no wave field.',
  };
}

/**
 * OPL で鳴らす音色を登録する。
 *
 * プリセットの音色は置いていない。実機の BIOS の音色を合法に確かめる手段が少ないため
 * (docs/ENGINE_TODO.md の 2i)。
 *
 * @param {string} name 名前。`opl` で始める
 * @param {object} spec 音色の中身(oplVoice を見る)
 * @param {{desc?:string, role?:string, overwrite?:boolean}} [opts]
 * @returns {number} 音色の番号
 */
export function registerOPL(name, spec, opts = {}) {
  return registerVoice(name, 'opl', { patch: oplVoice(spec) },
    { vsteps: 16, vcurve: '3db', ...opts });
}

// ---- エンジンへ自分を登録する ----

/** 処理器の登録に渡すもの */
export const OPL_CHIP = {
  kind: 'opl',
  node: 'mmsxx-opl',
  code: OPL_CODE,
  // 音量はチップに任せる。外から掛けると実機と違う鳴り方になる(OPLL と同じ扱い)
  event: (ev, wf, freq, amp, t0, t1) => ({
    t: t0, dur: Math.max(0.01, t1 - t0 - (ev.relTail || 0)), freq, v: ev.vol, patch: wf.patch,
  }),
};

// MML の #voice で @opl{…} と書けるようにする
registerVoiceSyntax('opl', (name, spec, opts) => registerOPL(name, spec, opts));

// 処理器をエンジンへ登録する。ADPCM の口(@oplpcm{…})も一緒に連れてくる
registerChipKind(OPL_CHIP.kind, OPL_CHIP);
// 重ねる相手が増えたので、合成音色を並べ直す(ほかの音源と同じ)
registerDefaultLayers();

