// YM2413(OPLL)。MSX-MUSIC / FM-PAC に載っていた FM 音源。
//
// ---- なぜチップそのものを持つか ----
//
// ここまでの `fm2*` は「それらしく寄せた 2 オペ FM」で、実機とは別ものだった。
// OPLL は音色が 15 個の固定表しかないので、表と演算器さえ合えば実機と同じ音が
// 出る。寄せる相手が閉じている音源なので、近似で止める理由がない(2026-09-26)。
//
// ---- 出どころ ----
//
// emu2413(Mitsutaka Okazaki、MIT)を読んで書き直した。
// https://github.com/digital-sound-antiques/emu2413
//
// 表は数値で持たない。サイン表も指数表も式で作れることを確かめてある
// (`-log2(sin((x+0.5)π/512))*256` と `(2^(x/256)-1)*1024`)。
// 数値で持つのは音色 19 個(152 バイト)だけ。
// OPL と同じ値になる表は sound/fmtables.js にまとめてあり、処理器の中へ埋めて使う。
//
// ---- まだ無いもの ----
//
// - テストレジスタ
// - 内部 49716Hz から出口の周波数へは直線で補間している。emu2413 は
//   窓付き sinc を使う。高い音で差が出るはず

import { FM_TABLES_CODE } from './fmtables.js';
import { DRUM_FREQ } from './mml.js';
import { registerChipKind, volAt, freqAt } from './audio.js';

/**
 * 組み込み音色 19 個(YM2413)。1 音色 8 バイト。
 *
 * 0 番はユーザー音色の置き場で、中身は空。1〜15 が名前の付いた音色で、
 * 16〜18 がリズム用。並びは実機のレジスタ番号そのまま。
 */
export const OPLL_INST = [
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 0: User
  0x71, 0x61, 0x1e, 0x17, 0xd0, 0x78, 0x00, 0x17, // 1: Violin
  0x13, 0x41, 0x1a, 0x0d, 0xd8, 0xf7, 0x23, 0x13, // 2: Guitar
  0x13, 0x01, 0x99, 0x00, 0xf2, 0xc4, 0x21, 0x23, // 3: Piano
  0x11, 0x61, 0x0e, 0x07, 0x8d, 0x64, 0x70, 0x27, // 4: Flute
  0x32, 0x21, 0x1e, 0x06, 0xe1, 0x76, 0x01, 0x28, // 5: Clarinet
  0x31, 0x22, 0x16, 0x05, 0xe0, 0x71, 0x00, 0x18, // 6: Oboe
  0x21, 0x61, 0x1d, 0x07, 0x82, 0x81, 0x11, 0x07, // 7: Trumpet
  0x33, 0x21, 0x2d, 0x13, 0xb0, 0x70, 0x00, 0x07, // 8: Organ
  0x61, 0x61, 0x1b, 0x06, 0x64, 0x65, 0x10, 0x17, // 9: Horn
  0x41, 0x61, 0x0b, 0x18, 0x85, 0xf0, 0x81, 0x07, // A: Synthesizer
  0x33, 0x01, 0x83, 0x11, 0xea, 0xef, 0x10, 0x04, // B: Harpsichord
  0x17, 0xc1, 0x24, 0x07, 0xf8, 0xf8, 0x22, 0x12, // C: Vibraphone
  0x61, 0x50, 0x0c, 0x05, 0xd2, 0xf5, 0x40, 0x42, // D: Synthesizer Bass
  0x01, 0x01, 0x55, 0x03, 0xe9, 0x90, 0x03, 0x02, // E: Acoustic Bass
  0x41, 0x41, 0x89, 0x03, 0xf1, 0xe4, 0xc0, 0x13, // F: Electric Guitar
  0x01, 0x01, 0x18, 0x0f, 0xdf, 0xf8, 0x6a, 0x6d, // R: Bass Drum
  0x01, 0x01, 0x00, 0x00, 0xc8, 0xd8, 0xa7, 0x68, // R: High-Hat / Snare
  0x05, 0x01, 0x00, 0x00, 0xf8, 0xaa, 0x59, 0x55, // R: Tom-tom / Top Cymbal
];

/**
 * VRC7(コナミが作った、ファミコン用の OPLL)の音色表。
 *
 * 演算器は YM2413 と同じで、内蔵音色だけが違う。『ラグランジュポイント』が
 * これを載せていた。名前は付いていないので番号で呼ぶ。
 */
export const OPLL_INST_VRC7 = [
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 0: User
  0x03, 0x21, 0x05, 0x06, 0xe8, 0x81, 0x42, 0x27, // 1
  0x13, 0x41, 0x14, 0x0d, 0xd8, 0xf6, 0x23, 0x12, // 2
  0x11, 0x11, 0x08, 0x08, 0xfa, 0xb2, 0x20, 0x12, // 3
  0x31, 0x61, 0x0c, 0x07, 0xa8, 0x64, 0x61, 0x27, // 4
  0x32, 0x21, 0x1e, 0x06, 0xe1, 0x76, 0x01, 0x28, // 5
  0x02, 0x01, 0x06, 0x00, 0xa3, 0xe2, 0xf4, 0xf4, // 6
  0x21, 0x61, 0x1d, 0x07, 0x82, 0x81, 0x11, 0x07, // 7
  0x23, 0x21, 0x22, 0x17, 0xa2, 0x72, 0x01, 0x17, // 8
  0x35, 0x11, 0x25, 0x00, 0x40, 0x73, 0x72, 0x01, // 9
  0xb5, 0x01, 0x0f, 0x0f, 0xa8, 0xa5, 0x51, 0x02, // 10
  0x17, 0xc1, 0x24, 0x07, 0xf8, 0xf8, 0x22, 0x12, // 11
  0x71, 0x23, 0x11, 0x06, 0x65, 0x74, 0x18, 0x16, // 12
  0x01, 0x02, 0xd3, 0x05, 0xc9, 0x95, 0x03, 0x02, // 13
  0x61, 0x63, 0x0c, 0x00, 0x94, 0xc0, 0x33, 0xf6, // 14
  0x21, 0x72, 0x0d, 0x00, 0xc1, 0xd5, 0x56, 0x06, // 15
  0x01, 0x01, 0x18, 0x0f, 0xdf, 0xf8, 0x6a, 0x6d, // R: Bass Drum
  0x01, 0x01, 0x00, 0x00, 0xc8, 0xd8, 0xa7, 0x68, // R: Hi-Hat / Snare
  0x05, 0x01, 0x00, 0x00, 0xf8, 0xaa, 0x59, 0x55, // R: Tom / Cymbal
];

/**
 * YMF281B(OPLLP)の音色表。パチンコ・パチスロ向けに音色を差し替えた型。
 *
 * これも演算器は YM2413 と同じ。音色だけが差し替えてある。
 * 名前は Chabin と plgDavid が起こしたもの(emu2413 の注記)。
 */
export const OPLL_INST_YMF281 = [
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 0: User
  0x62, 0x21, 0x1a, 0x07, 0xf0, 0x6f, 0x00, 0x16, // 1: Electric Strings
  0x40, 0x10, 0x45, 0x00, 0xf6, 0x83, 0x73, 0x63, // 2: Bow Wow
  0x13, 0x01, 0x99, 0x00, 0xf2, 0xc3, 0x21, 0x23, // 3: Electric Guitar
  0x01, 0x61, 0x0b, 0x0f, 0xf9, 0x64, 0x70, 0x17, // 4: Organ
  0x32, 0x21, 0x1e, 0x06, 0xe1, 0x76, 0x01, 0x28, // 5: Clarinet
  0x60, 0x01, 0x82, 0x0e, 0xf9, 0x61, 0x20, 0x27, // 6: Saxophone
  0x21, 0x61, 0x1c, 0x07, 0x84, 0x81, 0x11, 0x07, // 7: Trumpet
  0x37, 0x32, 0xc9, 0x01, 0x66, 0x64, 0x40, 0x28, // 8: Street Organ
  0x01, 0x21, 0x07, 0x03, 0xa5, 0x71, 0x51, 0x07, // 9: Synth Brass
  0x06, 0x01, 0x5e, 0x07, 0xf3, 0xf3, 0xf6, 0x13, // A: Electric Piano
  0x00, 0x00, 0x18, 0x06, 0xf5, 0xf3, 0x20, 0x23, // B: Bass
  0x17, 0xc1, 0x24, 0x07, 0xf8, 0xf8, 0x22, 0x12, // C: Vibraphone
  0x35, 0x64, 0x00, 0x00, 0xff, 0xf3, 0x77, 0xf5, // D: Chimes
  0x11, 0x31, 0x00, 0x07, 0xdd, 0xf3, 0xff, 0xfb, // E: Tom Tom II
  0x3a, 0x21, 0x00, 0x07, 0x80, 0x84, 0x0f, 0xf5, // F: Noise
  0x01, 0x01, 0x18, 0x0f, 0xdf, 0xf8, 0x6a, 0x6d, // R: Bass Drum
  0x01, 0x01, 0x00, 0x00, 0xc8, 0xd8, 0xa7, 0x68, // R: Hi-Hat / Snare
  0x05, 0x01, 0x00, 0x00, 0xf8, 0xaa, 0x59, 0x55, // R: Tom / Cymbal
];

/** 3 組の表。0 = YM2413、1 = VRC7、2 = YMF281B */
export const OPLL_SETS = [OPLL_INST, OPLL_INST_VRC7, OPLL_INST_YMF281];

/** 音色の名前。番号は実機の音色番号(1〜15)に合わせる */
export const OPLL_NAMES = [
  'user', 'violin', 'guitar', 'piano', 'flute', 'clarinet', 'oboe', 'trumpet',
  'organ', 'horn', 'synth', 'harpsichord', 'vibraphone', 'synthBass',
  'acousticBass', 'electricGuitar',
];

/** MSX のクロック。OPLL は 72 分周で 1 サンプルを出す */
export const OPLL_CLOCK = 3579545;
export const OPLL_RATE = OPLL_CLOCK / 72;   // 49716Hz

/**
 * リズムの 5 つ。R14 のどのビットで叩くか、音量をどこへ書くか、
 * どのチャンネルの高さで鳴るか。
 *
 * `fnum` と `blk` は実機のドライバが使っていた値。音符が o4c
 * (`DRUM_FREQ`)のままなら、この値をそのまま書く。
 *
 * スネアとハイハットは同じチャンネル(7)、タムとシンバルも同じ(8)。
 * 片方の高さを変えると、もう片方も一緒に動く。実機がそうなので、そのまま出す。
 * バスドラだけは自分のチャンネル(6)を持っているので、ほかに影響しない。
 *
 * 処理器の外に置いてある。同じ表を `sound/mml.js` も見る
 * (同じチャンネルに 2 つ高さを書いたときに知らせるため)。
 * 処理器の中へは `${}` で埋め込む
 */
export const OPLL_DRUM_TABLE = {
  bd:  { bit: 0x10, reg: 0x36, hi: 0, ch: 6, fnum: 0x120, blk: 2 },
  sd:  { bit: 0x08, reg: 0x37, hi: 0, ch: 7, fnum: 0x150, blk: 2 },
  hh:  { bit: 0x01, reg: 0x37, hi: 1, ch: 7, fnum: 0x150, blk: 2 },
  tom: { bit: 0x04, reg: 0x38, hi: 1, ch: 8, fnum: 0x1c0, blk: 0 },
  cym: { bit: 0x02, reg: 0x38, hi: 0, ch: 8, fnum: 0x1c0, blk: 0 },
};

/**
 * 処理器の中身。1 つの文字列として持つ。
 *
 * AudioWorklet のコードは別のスコープで走るので、`addModule` へ渡す前に
 * 文字列にしておく必要がある。音色の表はここで埋め込む(`${}` が効く)。
 *
 * ---- 中でバッククォートを書かない ----
 *
 * この文字列そのものがバッククォートで囲まれているので、中に 1 つでも書くと
 * そこで終わってしまう。コメントの中も同じ。うっかり書くと、
 * そこから先が JavaScript の式として読まれて、構文のエラーになる。
 * 引用したいときは記号を付けずに書く(2026-09-30 に踏んだ)。
 */
export const OPLL_CODE = `
const SETS = ${JSON.stringify([OPLL_INST, OPLL_INST_VRC7, OPLL_INST_YMF281])};
// リズムの 5 つ。表は外(OPLL_DRUM_TABLE)で、警告を出す側も同じものを見る
const DRUM = ${JSON.stringify(OPLL_DRUM_TABLE)};
const CLK = ${OPLL_CLOCK};
const RATE = CLK / 72;

${FM_TABLES_CODE}
// 半波整流(WS=1)。後ろ半分は最小に張り付く。OPLL にしか無い
const HALF = new Uint16Array(1024);
for (let x = 0; x < 512; x++) HALF[x] = SIN[x];
for (let x = 512; x < 1024; x++) HALF[x] = 0xfff;
const WAVE = [SIN, HALF];

// キースケールで音量が落ちるぶん。block と fnum の上 4 ビットで引く
const TLL = new Uint16Array(128 * 64 * 4);
for (let fnum = 0; fnum < 16; fnum++) {
  for (let blk = 0; blk < 8; blk++) {
    for (let tl = 0; tl < 64; tl++) {
      for (let kl = 0; kl < 4; kl++) {
        const at = (((blk << 4) | fnum) * 64 + tl) * 4 + kl;
        if (kl === 0) { TLL[at] = tl << 1; continue; }
        const tmp = Math.floor(KL[fnum] - 6 * (7 - blk));
        TLL[at] = tmp <= 0 ? (tl << 1) : (Math.floor((tmp >> (3 - kl)) / 0.375) + (tl << 1));
      }
    }
  }
}
// キースケールでエンベロープが速くなるぶん
const RKS = new Int32Array(16 * 2);
for (let f8 = 0; f8 < 2; f8++) {
  for (let blk = 0; blk < 8; blk++) {
    RKS[((blk << 1) | f8) * 2 + 1] = (blk << 1) + f8;
    RKS[((blk << 1) | f8) * 2 + 0] = blk >> 1;
  }
}

const EG_MUTE = 127;
const EG_MAX = EG_MUTE - 4;
const ATTACK = 0, DECAY = 1, SUSTAIN = 2, RELEASE = 3, DAMP = 4;
const DAMPER_RATE = 12;

/** 8 バイトの音色を、2 つのオペレータぶんに開く */
function toPatch(d, at) {
  const m = {}, c = {};
  m.AM = (d[at] >> 7) & 1; c.AM = (d[at + 1] >> 7) & 1;
  m.PM = (d[at] >> 6) & 1; c.PM = (d[at + 1] >> 6) & 1;
  m.EG = (d[at] >> 5) & 1; c.EG = (d[at + 1] >> 5) & 1;
  m.KR = (d[at] >> 4) & 1; c.KR = (d[at + 1] >> 4) & 1;
  m.ML = d[at] & 15;       c.ML = d[at + 1] & 15;
  m.KL = (d[at + 2] >> 6) & 3; c.KL = (d[at + 3] >> 6) & 3;
  m.TL = d[at + 2] & 63;   c.TL = 0;
  m.FB = d[at + 3] & 7;    c.FB = 0;
  m.WS = (d[at + 3] >> 3) & 1; c.WS = (d[at + 3] >> 4) & 1;
  m.AR = (d[at + 4] >> 4) & 15; c.AR = (d[at + 5] >> 4) & 15;
  m.DR = d[at + 4] & 15;   c.DR = d[at + 5] & 15;
  m.SL = (d[at + 6] >> 4) & 15; c.SL = (d[at + 7] >> 4) & 15;
  m.RR = d[at + 6] & 15;   c.RR = d[at + 7] & 15;
  return [m, c];
}
// 3 組ぶんの音色。演算器は同じで、表だけが違う
const PATCHES = SETS.map((t) => {
  const out = [];
  for (let i = 0; i < 19; i++) out.push(...toPatch(t, i * 8));
  return out;
});
const DEFAULT_PATCH = PATCHES[0];

function newSlot(n) {
  return {
    number: n, type: n % 2, pgKeep: 0, wave: WAVE[0],
    pgPhase: 0, pgOut: 0, out0: 0, out1: 0,
    egState: RELEASE, egOut: EG_MUTE, egRateH: 0, egRateL: 0, egShift: 0,
    patch: DEFAULT_PATCH[0], fnum: 0, blk: 0, blkFnum: 0,
    volume: 0, tll: 0, rks: 0, keyFlag: 0, susFlag: 0, req: 0,
  };
}

class OPLL {
  constructor() {
    this.reg = new Uint8Array(0x40);
    this.slot = [];
    for (let i = 0; i < 18; i++) this.slot.push(newSlot(i));
    this.patch = [Object.assign({}, DEFAULT_PATCH[0]), Object.assign({}, DEFAULT_PATCH[1])];
    this.patchNumber = new Int32Array(9);
    // チャンネルごとに、どの表の音色を着るか。0 = YM2413
    this.patchSet = new Int32Array(9);
    this.slotKey = 0;
    this.pmPhase = 0; this.amPhase = 0; this.lfoAm = 0;
    this.egCounter = 0;
    this.noise = 1; this.shortNoise = 0; this.rhythm = 0;
    this.chOut = new Int16Array(9);
    for (let ch = 0; ch < 9; ch++) this.setPatch(ch, 0);
  }
  mod(ch) { return this.slot[ch << 1]; }
  car(ch) { return this.slot[(ch << 1) | 1]; }

  /** そのチャンネルが使う音色表を選ぶ。演算器は同じで、表だけが変わる */
  useSet(ch, set) {
    const n = Math.max(0, Math.min(PATCHES.length - 1, set | 0));
    if (this.patchSet[ch] === n) return;
    this.patchSet[ch] = n;
    this.setPatch(ch, this.patchNumber[ch]);
  }
  setPatch(ch, num) {
    const tbl = PATCHES[this.patchSet[ch]];
    this.patchNumber[ch] = num;
    this.mod(ch).patch = num === 0 ? this.patch[0] : tbl[num * 2];
    this.car(ch).patch = num === 0 ? this.patch[1] : tbl[num * 2 + 1];
    this.mod(ch).req = 255;
    this.car(ch).req = 255;
  }
  setFnumber(ch, fnum) {
    for (const s of [this.car(ch), this.mod(ch)]) {
      s.fnum = fnum;
      s.blkFnum = (s.blkFnum & 0xe00) | (fnum & 0x1ff);
      s.req |= 2 | 4 | 8;
    }
  }
  setBlock(ch, blk) {
    for (const s of [this.car(ch), this.mod(ch)]) {
      s.blk = blk;
      s.blkFnum = ((blk & 7) << 9) | (s.blkFnum & 0x1ff);
      s.req |= 2 | 4 | 8;
    }
  }
  setVolume(ch, v) { this.car(ch).volume = v; this.car(ch).req |= 2; }
  setSlotVolume(s, v) { s.volume = v; s.req |= 2; }
  setSus(ch, f) {
    this.car(ch).susFlag = f; this.car(ch).req |= 8;
  }

  writeReg(reg, data) {
    if (reg >= 0x40) return;
    if ((0x19 <= reg && reg <= 0x1f) || (0x29 <= reg && reg <= 0x2f)
        || (0x39 <= reg && reg <= 0x3f)) reg -= 9;
    this.reg[reg] = data & 0xff;
    const p = this.patch;
    if (reg === 0x00 || reg === 0x01) {
      const t = p[reg];
      t.AM = (data >> 7) & 1; t.PM = (data >> 6) & 1;
      t.EG = (data >> 5) & 1; t.KR = (data >> 4) & 1; t.ML = data & 15;
      for (let i = 0; i < 9; i++) if (this.patchNumber[i] === 0) {
        (reg === 0 ? this.mod(i) : this.car(i)).req |= 4 | 8;
      }
    } else if (reg === 0x02) {
      p[0].KL = (data >> 6) & 3; p[0].TL = data & 63;
      for (let i = 0; i < 9; i++) if (this.patchNumber[i] === 0) this.mod(i).req |= 2;
    } else if (reg === 0x03) {
      p[1].KL = (data >> 6) & 3; p[1].WS = (data >> 4) & 1;
      p[0].WS = (data >> 3) & 1; p[0].FB = data & 7;
      for (let i = 0; i < 9; i++) if (this.patchNumber[i] === 0) {
        this.mod(i).req |= 1; this.car(i).req |= 1 | 2;
      }
    } else if (reg === 0x04 || reg === 0x05) {
      const t = p[reg - 4];
      t.AR = (data >> 4) & 15; t.DR = data & 15;
      for (let i = 0; i < 9; i++) if (this.patchNumber[i] === 0) {
        (reg === 4 ? this.mod(i) : this.car(i)).req |= 8;
      }
    } else if (reg === 0x06 || reg === 0x07) {
      const t = p[reg - 6];
      t.SL = (data >> 4) & 15; t.RR = data & 15;
      for (let i = 0; i < 9; i++) if (this.patchNumber[i] === 0) {
        const s = reg === 6 ? this.mod(i) : this.car(i);
        s.req |= 2 | 8;
      }
    } else if (0x10 <= reg && reg <= 0x18) {
      this.setFnumber(reg - 0x10, ((this.reg[0x20 + reg - 0x10] & 1) << 8) | data);
      this.updateKey();
    } else if (0x20 <= reg && reg <= 0x28) {
      const ch = reg - 0x20;
      this.setFnumber(ch, ((data & 1) << 8) | this.reg[0x10 + ch]);
      this.setBlock(ch, (data >> 1) & 7);
      this.setSus(ch, (data >> 5) & 1);
      this.updateKey();
    } else if (reg === 0x0e) {
      this.updateRhythm();
      this.updateKey();
    } else if (0x30 <= reg && reg <= 0x38) {
      const ch = reg - 0x30;
      if ((this.reg[0x0e] & 32) && reg >= 0x36) {
        // リズムのときは、上の 4 ビットが変調側の音量になる
        if (reg === 0x37) this.setSlotVolume(this.mod(7), ((data >> 4) & 15) << 2);
        if (reg === 0x38) this.setSlotVolume(this.mod(8), ((data >> 4) & 15) << 2);
      } else {
        this.setPatch(ch, (data >> 4) & 15);
      }
      this.setVolume(ch, (data & 15) << 2);
    }
  }

  /**
   * リズムに入ると、下 3 チャンネルが打楽器になる。
   *
   * ハイハットとシンバルは位相を止めない(pgKeep)。ノイズと組み合わせて
   * 金物の音を作るので、キーオンのたびに位相が戻ると質感が変わる
   */
  updateRhythm() {
    const on = (this.reg[0x0e] >> 5) & 1;
    if (this.rhythm !== on) {
      if (on) {
        this.slot[14].type = 3; this.slot[14].pgKeep = 1;
        this.slot[15].type = 3;
        this.slot[16].type = 3;
        this.slot[17].type = 3; this.slot[17].pgKeep = 1;
        this.setPatch(6, 16); this.setPatch(7, 17); this.setPatch(8, 18);
        this.setSlotVolume(this.slot[14], ((this.reg[0x37] >> 4) & 15) << 2);
        this.setSlotVolume(this.slot[16], ((this.reg[0x38] >> 4) & 15) << 2);
      } else {
        this.slot[14].type = 0; this.slot[14].pgKeep = 0;
        this.slot[15].type = 1;
        this.slot[16].type = 0;
        this.slot[17].type = 1; this.slot[17].pgKeep = 0;
        this.setPatch(6, this.reg[0x36] >> 4);
        this.setPatch(7, this.reg[0x37] >> 4);
        this.setPatch(8, this.reg[0x38] >> 4);
      }
    }
    this.rhythm = on;
  }

  updateKey() {
    let want = 0;
    for (let ch = 0; ch < 9; ch++) if (this.reg[0x20 + ch] & 0x10) want |= 3 << (ch * 2);
    if ((this.reg[0x0e] >> 5) & 1) {
      const r14 = this.reg[0x0e];
      if (r14 & 0x10) want |= 3 << 12;   // バスドラは 2 スロット
      if (r14 & 0x01) want |= 1 << 14;   // ハイハット
      if (r14 & 0x08) want |= 1 << 15;   // スネア
      if (r14 & 0x04) want |= 1 << 16;   // タム
      if (r14 & 0x02) want |= 1 << 17;   // シンバル
    }
    const diff = this.slotKey ^ want;
    if (diff) {
      for (let i = 0; i < 18; i++) {
        if (!((diff >> i) & 1)) continue;
        const s = this.slot[i];
        if ((want >> i) & 1) { s.keyFlag = 1; s.egState = DAMP; s.req |= 8; }
        else { s.keyFlag = 0; if (s.type & 1) { s.egState = RELEASE; s.req |= 8; } }
      }
    }
    this.slotKey = want;
  }

  rateOf(s) {
    if ((s.type & 1) === 0 && s.keyFlag === 0) return 0;
    switch (s.egState) {
      case ATTACK: return s.patch.AR;
      case DECAY: return s.patch.DR;
      case SUSTAIN: return s.patch.EG ? 0 : s.patch.RR;
      case RELEASE: return s.susFlag ? 5 : (s.patch.EG ? s.patch.RR : 7);
      case DAMP: return DAMPER_RATE;
      default: return 0;
    }
  }
  commit(s) {
    if (s.req & 1) s.wave = WAVE[s.patch.WS];
    if (s.req & 2) {
      const lvl = (s.type & 1) === 0 ? s.patch.TL : s.volume;
      s.tll = TLL[((s.blkFnum >> 5) * 64 + lvl) * 4 + s.patch.KL];
    }
    if (s.req & 4) s.rks = RKS[(s.blkFnum >> 8) * 2 + s.patch.KR];
    if (s.req & (4 | 8)) {
      const r = this.rateOf(s);
      if (r === 0) { s.egShift = 0; s.egRateH = 0; s.egRateL = 0; s.req = 0; return; }
      s.egRateH = Math.min(15, r + (s.rks >> 2));
      s.egRateL = s.rks & 3;
      s.egShift = s.egState === ATTACK
        ? ((0 < s.egRateH && s.egRateH < 12) ? (13 - s.egRateH) : 0)
        : (s.egRateH < 13 ? (13 - s.egRateH) : 0);
    }
    s.req = 0;
  }

  attackStep(s, c) {
    const i2 = (c & 0xc) >> 1;
    switch (s.egRateH) {
      case 12: return 4 - EG_STEP[s.egRateL][i2];
      case 13: return 3 - EG_STEP[s.egRateL][i2];
      case 14: return 2 - EG_STEP[s.egRateL][i2];
      case 0: case 15: return 0;
      default: return EG_STEP[s.egRateL][(c >> s.egShift) & 7] ? 4 : 0;
    }
  }
  decayStep(s, c) {
    switch (s.egRateH) {
      case 0: return 0;
      case 13: return EG_STEP[s.egRateL][((c & 0xc) >> 1) | (c & 1)];
      case 14: return EG_STEP[s.egRateL][(c & 0xc) >> 1] + 1;
      case 15: return 2;
      default: return EG_STEP[s.egRateL][(c >> s.egShift) & 7];
    }
  }
  startEnv(s) {
    if (Math.min(15, s.patch.AR + (s.rks >> 2)) === 15) { s.egState = DECAY; s.egOut = 0; }
    else s.egState = ATTACK;
    s.req |= 8;
  }
  calcEnv(s, buddy, c) {
    const mask = (1 << s.egShift) - 1;
    if (s.egState === ATTACK) {
      if (0 < s.egOut && 0 < s.egRateH && (c & mask & ~3) === 0) {
        const step = this.attackStep(s, c);
        if (step > 0) s.egOut = Math.max(0, s.egOut - (s.egOut >> step) - 1);
      }
    } else if (s.egRateH > 0 && (c & mask) === 0) {
      s.egOut = Math.min(EG_MUTE, s.egOut + this.decayStep(s, c));
    }
    if (s.egState === DAMP) {
      if (s.egOut >= EG_MAX && (c & mask) === 0) {
        this.startEnv(s);
        if (s.type & 1) {
          if (!s.pgKeep) s.pgPhase = 0;
          if (buddy && !buddy.pgKeep) buddy.pgPhase = 0;
        }
      }
    } else if (s.egState === ATTACK) {
      if (s.egOut === 0) { s.egState = DECAY; s.req |= 8; }
    } else if (s.egState === DECAY) {
      if ((s.egOut >> 3) === s.patch.SL) { s.egState = SUSTAIN; s.req |= 8; }
    }
  }
  calcPhase(s, pmPhase) {
    const pm = s.patch.PM ? PM[(s.fnum >> 6) & 7][(pmPhase >> 10) & 7] : 0;
    s.pgPhase += ((((s.fnum & 0x1ff) * 2 + pm) * ML[s.patch.ML]) << s.blk) >> 2;
    s.pgPhase &= (1 << 19) - 1;
    s.pgOut = s.pgPhase >> 9;
  }

  toLinear(h, s, am) {
    if (s.egOut > EG_MAX) return 0;
    const att = Math.min(EG_MUTE, s.egOut + s.tll + am) << 4;
    return expLookup(h + att);
  }
  calcMod(ch) {
    const s = this.mod(ch);
    const fb = s.patch.FB > 0 ? (s.out1 + s.out0) >> (9 - s.patch.FB) : 0;
    const am = s.patch.AM ? this.lfoAm : 0;
    s.out1 = s.out0;
    s.out0 = this.toLinear(s.wave[(s.pgOut + fb) & 1023], s, am);
    return s.out0;
  }
  calcCar(ch, fm) {
    const s = this.car(ch);
    const am = s.patch.AM ? this.lfoAm : 0;
    s.out1 = s.out0;
    s.out0 = this.toLinear(s.wave[(s.pgOut + 2 * (fm >> 1)) & 1023], s, am);
    return s.out0;
  }

  /** ノイズ。18 ビットのシフトレジスタ */
  stepNoise(n) {
    for (let i = 0; i < n; i++) {
      if (this.noise & 1) this.noise ^= 0x800200;
      this.noise >>>= 1;
    }
  }
  /** 金物の短いノイズ。ハイハットとシンバルの位相から作る */
  updateShortNoise() {
    const hh = this.slot[14].pgOut, cym = this.slot[17].pgOut;
    const h2 = (hh >> 2) & 1, h7 = (hh >> 7) & 1, h3 = (hh >> 3) & 1;
    const c3 = (cym >> 3) & 1, c5 = (cym >> 5) & 1;
    this.shortNoise = (h2 ^ h7) | (h3 ^ c5) | (c3 ^ c5);
  }
  calcTom() { const s = this.mod(8); return this.toLinear(s.wave[s.pgOut], s, 0); }
  calcSnare() {
    const s = this.car(7);
    const ph = ((s.pgOut >> 8) & 1)
      ? ((this.noise & 1) ? 0x300 : 0x200)
      : ((this.noise & 1) ? 0x000 : 0x100);
    return this.toLinear(s.wave[ph], s, 0);
  }
  calcCym() {
    const s = this.car(8);
    return this.toLinear(s.wave[this.shortNoise ? 0x300 : 0x100], s, 0);
  }
  calcHat() {
    const s = this.mod(7);
    const ph = this.shortNoise
      ? ((this.noise & 1) ? 0x2d0 : 0x234)
      : ((this.noise & 1) ? 0x034 : 0x0d0);
    return this.toLinear(s.wave[ph], s, 0);
  }

  /**
   * 1 サンプル(49716Hz)ぶん進めて、和を返す。
   *
   * ノイズを進める位置が決まっている。チャンネル 7 を出したあと 14 回、
   * 8 と 9 のあとに 2 回ずつ。実機の 1 サンプルが 18 スロットぶんの時間を
   * かけて回るので、そのあいだノイズも進む。ここを 1 か所にまとめると、
   * スネアとハイハットの粒立ちが変わる
   */
  /**
   * そのスロットは黙りきっていて、これ以上動かないか。
   *
   * 音量が下限まで落ちていて(egOut が EG_MUTE まで行っていて)、キーオンも
   * 書き込みの予約も無い状態。ここから先は、レジスタを書かないかぎり
   * 出口も中身も変わらない
   */
  quiet(s) {
    return s.req === 0 && s.keyFlag === 0 && s.egOut >= EG_MUTE && s.egState !== DAMP;
  }

  /** 9 チャンネルとも黙りきっているか。区切りをまるごと飛ばす判断に使う */
  allQuiet() {
    if (this.rhythm) return false;
    for (let i = 0; i < 18; i++) if (!this.quiet(this.slot[i])) return false;
    return true;
  }

  tick() {
    this.pmPhase++;
    this.amPhase++;
    this.lfoAm = AM[(this.amPhase >> 6) % 210];
    this.updateShortNoise();
    this.egCounter++;
    // **休んでいるチャンネルは回さない。**チップは 9 チャンネルぶんの
    // 18 スロットを毎サンプル回すので、1 声しか鳴っていなくても 9 声ぶんの
    // かかりになる。チャンネルを 1 本ずつ別の処理器へ渡す作りだと、
    // 45 本の曲で 45 台ぶんが回り、実時間に間に合わなくなる(2026-10-12)。
    // 黙りきったチャンネルは、レジスタを書くまで出口も中身も変わらないので、
    // 飛ばしても鳴りは同じ。キーオンのときに位相は 0 へ戻る(calcEnv の DAMP)
    let idle = 0;
    for (let ch = 0; ch < 9; ch++) {
      const m = this.slot[ch << 1], c = this.slot[(ch << 1) | 1];
      if (!(this.rhythm && ch >= 6) && this.quiet(m) && this.quiet(c)) {
        idle |= 1 << ch;
        // 変調のフィードバックは前 2 サンプルを見る。飛ばしているあいだに
        // 古い値が残ると、鳴らし直したときの 1 サンプル目に効いてしまう
        m.out0 = 0; m.out1 = 0; c.out0 = 0; c.out1 = 0;
        // 金物の短いノイズはスロット 14(7 の変調)と 17(8 の搬送)の位相から
        // 作るので、そこだけは進める。飛ばすと打楽器の粒立ちが変わる
        if (ch === 7) this.calcPhase(m, this.pmPhase);
        else if (ch === 8) this.calcPhase(c, this.pmPhase);
        continue;
      }
      if (m.req) this.commit(m);
      this.calcEnv(m, c, this.egCounter);
      this.calcPhase(m, this.pmPhase);
      if (c.req) this.commit(c);
      this.calcEnv(c, m, this.egCounter);
      this.calcPhase(c, this.pmPhase);
    }
    let sum = 0;
    for (let ch = 0; ch < 6; ch++) {
      if (idle & (1 << ch)) continue;
      sum += -(this.calcCar(ch, this.calcMod(ch)) >> 1);
    }
    if (!this.rhythm) {
      if (!(idle & (1 << 6))) sum += -(this.calcCar(6, this.calcMod(6)) >> 1);
    } else sum += this.calcCar(6, this.calcMod(6));        // バスドラ
    this.stepNoise(14);
    if (!this.rhythm) {
      if (!(idle & (1 << 7))) sum += -(this.calcCar(7, this.calcMod(7)) >> 1);
    } else { sum += this.calcHat(); sum += this.calcSnare(); }
    this.stepNoise(2);
    if (!this.rhythm) {
      if (!(idle & (1 << 8))) sum += -(this.calcCar(8, this.calcMod(8)) >> 1);
    } else { sum += this.calcTom(); sum += this.calcCym(); }
    this.stepNoise(2);
    return sum;
  }
}

// ---- 音符を受けて、レジスタへ変換する ----
//
// engine の側は音符を渡す作りなので、ここで 9 声へ割り当てて、
// fnum と block とキーオンに直す。レジスタを直に書く道はまだ無い。

/** 高さから block と fnum を出す。fnum は 256 以上に寄せて刻みを稼ぐ */
function pitchOf(freq) {
  for (let blk = 0; blk < 8; blk++) {
    const fnum = Math.round(freq * 72 * 524288 / (CLK * (1 << blk)));
    if (fnum < 512) return { blk, fnum: Math.max(1, fnum) };
  }
  return { blk: 7, fnum: 511 };
}

class OpllBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    this.chip = new OPLL();
    // レジスタの記録(log)。書いた時刻と中身をそのまま外へ流す。
    // 同じ書き込みをエミュレータへ渡して、こちらの翻訳が正しいかを
    // 耳で確かめるためのもの(VGM に直す)。記録しないときは何も変わらない
    if (q.log) {
      const raw = this.chip.writeReg.bind(this.chip);
      this.logNow = 0;
      this.logBuf = [];
      this.chip.writeReg = (r, d) => { this.logBuf.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    // チャンネルを 0 番に固定する(fixed)。実機のドライバは 1 パートを
    // 1 チャンネルに固定するので、前の音の余韻は次の音で切れる。
    // 空いたチャンネルへ回すいまの鳴らし方と聞き比べるための試験用で、
    // 1 パートだけの曲にしか使えない(2026-09-27)
    this.fixed = !!q.fixed;
    this.step = RATE / sampleRate;   // 出口 1 サンプルあたり何回まわすか
    this.frac = 0;
    this.prev = 0;
    this.cur = 0;
    // 9 声。いつまで鳴っているかと、どの音符が乗っているか
    this.busy = new Float64Array(9);
    this.off = new Float64Array(9);
    // リズム。入ると下 3 チャンネルが打楽器になるので、音のほうは 6 本になる
    this.rhythmOn = false;
    this.rbits = 0;
    this.rOff = { bd: 0, sd: 0, hh: 0, tom: 0, cym: 0 };
    // フェードの途中の音。鳴っているあいだに音量レジスタを書き直す並び
    // ([[時刻, v], …])と、どこまで書いたか。声を譲ったら捨てる
    this.vs = new Array(9).fill(null);
    this.rVs = {};
    this.fading = 0;
    // ポルタメントの途中の音。鳴っているあいだに音程レジスタを書き直す並び
    // ([[時刻, Hz], …])と、どこまで書いたか。声を譲ったら捨てる。
    // 実機のドライバも同じことをしていた(block と fnum を書き換える)
    this.ps = new Array(9).fill(null);
    // つながりの通し番号 → その声。タイでつながった音を同じ声で続けるために持つ。
    // 声の割り当てはこちらがするので、番号で突き合わせないと前の音と同じ声に
    // 入らない。そうなると、続く音でキーオンを立て直すことになる
    this.tieCh = Object.create(null);
    this.gliding = 0;
    // 止めている最中。出口を落としているあいだのサンプル数。-1 なら止めていない。
    // ぷつっと鳴らないよう 10 ミリ秒ほどかけて落とす
    this.cutAt = -1;
    this.cutLen = Math.max(1, Math.round(RATE * 0.01));
    this.alive = true;
    this.port.onmessage = (e) => {
      // 片付けの合図。つないでいない処理器も、true を返すあいだ回り続けるので、
      // 外しただけでは止まらない(sound/filter.js と同じ決めごと)
      if (e.data && e.data.stop) { this.alive = false; return; }
      // 止めて。シークと停止とポーズで来る。溜めたぶんを捨てて、鳴っている
      // 声を黙らせる。キーオフだけでは RR のぶん鳴り続けるので、出口で落とす
      if (e.data && e.data.cut) { this.cut(); return; }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      // 次の音が来たら出口を戻す。戻さないと、止めたあとは何を積んでも
      // 黙ったままになる
      this.cutAt = -1;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
    };
  }

  /**
   * 止める。溜めたイベントを捨てて、鳴っている声を黙らせる。
   *
   * キーオフを書くだけでは、チップの RR のぶん鳴り続ける。実機ではそれが
   * 正しいが、シークも停止もポーズも実機に無い操作なので、ここでは消す
   * (docs/BUGS.md の線引き)。出口を 10 ミリ秒で落としてから、
   * レジスタを静かにする。
   */
  cut() {
    this.events.length = 0;
    this.at = 0;
    for (let ch = 0; ch < 9; ch++) {
      // キーオンを落として、音量を最小(減衰が最大)にする
      this.chip.writeReg(0x20 + ch, this.chip.reg[0x20 + ch] & ~0x10);
      this.chip.writeReg(0x30 + ch, this.chip.reg[0x30 + ch] | 0x0f);
      this.busy[ch] = 0;
      this.off[ch] = 0;
      this.ps[ch] = null;
      this.vs[ch] = null;
    }
    this.gliding = 0;
    this.fading = 0;
    this.tieCh = Object.create(null);
    // リズムも切る
    this.rbits = 0;
    this.chip.writeReg(0x0e, 0);
    for (const k in this.rOff) this.rOff[k] = 0;
    for (const k in this.rVs) this.rVs[k] = null;
    // 出口を落としはじめる
    if (this.cutAt < 0) this.cutAt = 0;
  }

  /** リズムに入る。下 3 チャンネルの高さを、実機のドライバと同じ値にする */
  startRhythm() {
    if (this.rhythmOn) return;
    this.rhythmOn = true;
    this.chip.writeReg(0x0e, 0x20);
    for (const k of ['bd', 'sd', 'tom']) this.drumPitch(DRUM[k], DRUM[k]);
  }

  /**
   * 打楽器の高さを書く。
   *
   * キーオンのビットは立てない。リズム音源の叩きはじめは R14 が持つので、
   * 0x20 台の bit4 は 0 のまま置く。
   *
   * 同じ値なら書かない。叩くたびに呼ばれるので、高さを動かしていない曲で
   * 書き込みが増えないようにしておく。
   *
   * @param {object} d DRUM の 1 つ
   * @param {{fnum:number, blk:number}} at 書く高さ
   */
  drumPitch(d, at) {
    const lo = at.fnum & 0xff;
    const hi = (at.blk << 1) | ((at.fnum >> 8) & 1);
    if (this.chip.reg[0x10 + d.ch] !== lo) this.chip.writeReg(0x10 + d.ch, lo);
    if (this.chip.reg[0x20 + d.ch] !== hi) this.chip.writeReg(0x20 + d.ch, hi);
  }

  /**
   * 書いた高さから、その打楽器の fnum と blk を出す。
   *
   * **書いた高さが、そのままチャンネルの周波数になる。**実機のドライバが
   * そうしているので、同じ字を書けば同じ音が出る。
   *
   * ---- 前は比で動かしていた ----
   *
   * 実機のドライバの値(startRhythm が書く fnum)を物差しにして、
   * 「o4c からの比」で fnum を掛けていた(2026-10-04)。中では筋が通っていたが、
   * ドライバと字が合わなかった。あちらの t:o2a は ch9 の音程レジスタを
   * o2 の a に置く命令で、比ではない。
   *
   * **タムは聞こえる高さが 5 倍になる。**リズムのタムの音色は変調の倍率が 5
   * (0x05, 0x01, … の下 4 ビット)なので、チャンネルを o2 の a に置くと
   * 550Hz で鳴る。openMSX の録音を測って 550.5 / 435.1 / 367.5Hz で、
   * a → f → d の音程と合っていた。比で動かしていたときは 358Hz しか出ず、
   * バスドラに埋もれていた(2026-10-28)。
   *
   * **書かなければ触らない。**ドラムの囲み(@{drums 16})は必ず o4c で鳴るので、
   * そのときは呼ばれない(rhz が付かない)。囲みで書いた曲の音は変わらない。
   *
   * @param {number} hz 書いた高さ(Hz)
   * @returns {{fnum:number, blk:number}}
   */
  drumHz(hz) {
    // f = fnum * RATE / 2^19 * 2^blk を解く
    let blk = 0;
    let fnum = hz * 524288 / RATE;
    while (fnum > 511 && blk < 7) { fnum /= 2; blk++; }
    while (fnum < 256 && blk > 0) { fnum *= 2; blk--; }
    return { fnum: Math.max(1, Math.min(511, Math.round(fnum))), blk };
  }

  /** その声に、音程の書き直しを持たせる。前の音のぶんは捨てる */
  bend(ch, ps) {
    const had = this.ps[ch];
    const has = ps && ps.length ? { list: ps, at: 0 } : null;
    this.ps[ch] = has;
    this.gliding += (has ? 1 : 0) - (had ? 1 : 0);
  }

  /**
   * 時刻が来た音程の書き直しを、チップへ書く。
   *
   * キーオンのビットは触らない。音程レジスタ(0x20 台)には鳴らし始めの
   * ビットが同居しているので、いま立っているものをそのまま持ち越す。
   * 書き直すたびに立て直すと、音符の途中で鳴らし直しになる
   */
  glide(now) {
    for (let ch = 0; ch < 9; ch++) {
      const f = this.ps[ch];
      if (!f) continue;
      while (f.at < f.list.length && f.list[f.at][0] <= now) {
        const { blk, fnum } = pitchOf(f.list[f.at][1]);
        f.at++;
        // 同じ値なら書かない。渡ってくるのは 1 フレームずつの高さで、
        // レジスタの刻みより細かい。滑りが遅いところは同じ値が続く
        const lo = fnum & 0xff;
        const hi = (this.chip.reg[0x20 + ch] & 0x30) | (blk << 1) | ((fnum >> 8) & 1);
        if (this.chip.reg[0x10 + ch] === lo && this.chip.reg[0x20 + ch] === hi) continue;
        this.chip.writeReg(0x10 + ch, lo);
        this.chip.writeReg(0x20 + ch, hi);
      }
      if (f.at >= f.list.length) { this.ps[ch] = null; this.gliding--; }
    }
  }

  /** その声(打楽器なら名前)に、音量の書き直しを持たせる。前の音のぶんは捨てる */
  follow(key, vs) {
    const drum = typeof key === 'string';
    const had = drum ? this.rVs[key] : this.vs[key];
    const has = vs && vs.length ? { list: vs, at: 0 } : null;
    if (drum) this.rVs[key] = has; else this.vs[key] = has;
    this.fading += (has ? 1 : 0) - (had ? 1 : 0);
  }

  /** 時刻が来た音量の書き直しを、チップへ書く */
  fade(now) {
    const put = (f, write) => {
      while (f.at < f.list.length && f.list[f.at][0] <= now) {
        write(Math.max(0, Math.min(15, 15 - Math.round(f.list[f.at][1]))));
        f.at++;
      }
      return f.at >= f.list.length;
    };
    for (let ch = 0; ch < 9; ch++) {
      const f = this.vs[ch];
      if (!f) continue;
      const done = put(f, (att) => {
        this.chip.writeReg(0x30 + ch, (this.chip.reg[0x30 + ch] & 0xf0) | att);
      });
      if (done) { this.vs[ch] = null; this.fading--; }
    }
    for (const k in this.rVs) {
      const f = this.rVs[k];
      if (!f) continue;
      const d = DRUM[k];
      const done = put(f, (att) => {
        const cur = this.chip.reg[d.reg];
        this.chip.writeReg(d.reg, d.hi ? ((att << 4) | (cur & 15)) : ((cur & 0xf0) | att));
      });
      if (done) { this.rVs[k] = null; this.fading--; }
    }
  }

  /** いちばん古く空いた声を選ぶ。全部埋まっていれば、いちばん早く終わるもの */
  pick(now) {
    if (this.fixed) return 0;
    let best = -1, bestAt = Infinity;
    const top = this.rhythmOn ? 6 : 9;
    for (let ch = 0; ch < top; ch++) {
      if (this.busy[ch] <= now) return ch;
      if (this.busy[ch] < bestAt) { bestAt = this.busy[ch]; best = ch; }
    }
    return best;
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const n = out.length;
    // 時刻は currentTime で見る。音符に載っているのは context の絶対時刻で、
    // 自前で 0 から数えると、鳴りはじめが context の経過ぶんだけ先へずれる
    const base = currentTime;
    // **何も鳴っていない区切りは、まるごと飛ばす。**1 チャンネルを 1 台へ
    // 渡す作りなので、45 本の曲では休んでいる台が並ぶ。1 サンプルずつ回す
    // だけで 1 台 2% ほどかかり、45 台で 1 コアを使い切っていた(2026-10-12)。
    // 飛ばすと LFO とノイズの位相が止まるが、どちらも次の音の頭の揺れ方が
    // 変わるだけで、sound/ay.js と sound/nes.js も同じにしてある
    const next = this.at < this.events.length ? this.events[this.at].t : Infinity;
    if (this.cutAt < 0 && !this.rbits && !this.fading && !this.gliding
      && next >= base + n / sampleRate && this.chip.allQuiet()) {
      out.fill(0);
      return true;
    }
    for (let i = 0; i < n; i++) {
      const now = base + i / sampleRate;
      if (this.logBuf) this.logNow = now;
      // 終わる音符を、始まる音符より先に。同じ時刻に前の音の終わりと
      // 次の音の頭が重なると(q8 で続けて鳴らすとき)、先に次の音を乗せた
      // チャンネルの off を上書きしてしまい、キーオフが一度も書かれなかった。
      // キーオンが立ったままだとチップは立ち上げ直さないので、2 音目からは
      // 1 音目の余韻になる。減衰の速い音色(チェンバロ、シンセベース)が
      // 「明らかに小さい」と言われていたのはこれ(2026-09-27)
      // 終わる打楽器
      if (this.rbits) {
        for (const k in DRUM) {
          if (this.rOff[k] > 0 && this.rOff[k] <= now) {
            this.rbits &= ~DRUM[k].bit;
            this.chip.writeReg(0x0e, 0x20 | this.rbits);
            this.rOff[k] = 0;
          }
        }
      }
      // フェードの途中の音。音量だけ書き直す(キーオンはし直さない)
      if (this.fading) this.fade(now);
      if (this.gliding) this.glide(now);
      // 終わる音符(キーオフ)
      for (let ch = 0; ch < 9; ch++) {
        if (this.off[ch] > 0 && this.off[ch] <= now) {
          this.chip.writeReg(0x20 + ch, this.chip.reg[0x20 + ch] & ~0x10);
          this.off[ch] = 0;
        }
      }
      // 始まる音符
      while (this.at < this.events.length && this.events[this.at].t <= now) {
        const ev = this.events[this.at++];
        if (ev.drum) {
          const d = DRUM[ev.drum];
          this.startRhythm();
          // 叩くたびに、その打楽器の高さを書き直す。スネアとハイハットは
          // チャンネル 7 を、タムとシンバルは 8 を分け合うので、書き直さないと
          // 片方が置いていった高さで鳴る。実機のドライバも叩くたびに書いていた。
          // 値が同じなら書かないので、高さを動かしていない曲では書き込みが増えない
          this.drumPitch(d, ev.rhz ? this.drumHz(ev.rhz) : d);
          const att = Math.max(0, Math.min(15, 15 - Math.round(ev.v)));
          const cur = this.chip.reg[d.reg];
          this.chip.writeReg(d.reg, d.hi ? ((att << 4) | (cur & 15)) : ((cur & 0xf0) | att));
          this.rbits |= d.bit;
          this.chip.writeReg(0x0e, 0x20 | this.rbits);
          this.rOff[ev.drum] = now + ev.dur;
          this.follow(ev.drum, ev.vs);
          continue;
        }
        // 自分で作った音色(0 番)。8 バイトを先に書く。実機のレジスタは 1 組しか
        // ないので、別の音色が来るたびに書き直す(実機のドライバと同じ)。
        // 書き直すと、そのとき鳴っているユーザー音色の音も変わる
        if (ev.voice) {
          for (let r = 0; r < 8; r++) {
            if (this.chip.reg[r] !== ev.voice[r]) this.chip.writeReg(r, ev.voice[r]);
          }
        }
        // ---- タイでつながった音は、同じ声で続ける ----
        //
        // キーオンを立て直さない。立て直すとエンベロープが頭から始まるので、
        // 滑ったあとにアタックがやり直される。実測では 85ms で 0.0004 まで落ちて、
        // 125ms かけて上がっていた — 「滑り先が鳴り直して聞こえる」の正体
        //(2026-09-30)。
        //
        // 続ける声は tie(つながりの通し番号)で引く。声の割り当てはこちらが
        // するので、番号で突き合わせないと前の音と同じ声に入らない。
        // 音程だけ書き換えるのは glide() と同じやり方
        const keep = ev.legato && ev.tie ? this.tieCh[ev.tie] : undefined;
        if (keep !== undefined && (this.chip.reg[0x20 + keep] & 0x10)) {
          const { blk: b2, fnum: f2 } = pitchOf(ev.freq);
          // キーオンのビット(0x10)と、いま立っているものをそのまま持ち越す
          this.chip.writeReg(0x10 + keep, f2 & 0xff);
          this.chip.writeReg(0x20 + keep,
            (this.chip.reg[0x20 + keep] & 0x30) | (b2 << 1) | ((f2 >> 8) & 1));
          // 伸ばしたぶんだけ、離す時刻を後ろへ。つながりの残りまで持たせる
          const hold2 = Math.max(ev.dur, ev.left || 0);
          this.busy[keep] = now + hold2;
          this.off[keep] = now + hold2;
          this.follow(keep, ev.vs);
          this.bend(keep, ev.ps);
          continue;
        }
        const ch = this.pick(now);
        // 全部埋まっていて鳴っている声を取るときは、先にキーオフを書く。
        // 書かないとキーオンが立ったままで、立ち上げ直しにならない
        if (this.chip.reg[0x20 + ch] & 0x10) {
          this.chip.writeReg(0x20 + ch, this.chip.reg[0x20 + ch] & ~0x10);
        }
        const { blk, fnum } = pitchOf(ev.freq);
        this.chip.useSet(ch, ev.set | 0);
        const inst = Math.max(0, Math.min(15, ev.inst | 0));
        // 音量レジスタは減衰なので、v が大きいほど 0 に近い
        const att = Math.max(0, Math.min(15, 15 - Math.round(ev.v)));
        this.chip.writeReg(0x30 + ch, (inst << 4) | att);
        this.chip.writeReg(0x10 + ch, fnum & 0xff);
        this.chip.writeReg(0x20 + ch, 0x10 | (blk << 1) | ((fnum >> 8) & 1));
        // つながっている音は、離す時刻をつながりの終わりまで延ばす。
        // この音の長さで切ると、続く音が来る前にキーオフが走って立て直しになる
        const hold = Math.max(ev.dur, ev.left || 0);
        this.busy[ch] = now + hold;
        this.off[ch] = now + hold;
        // つながりの先頭。続く音がこの声を引けるように覚えておく
        if (ev.tie) this.tieCh[ev.tie] = ch;
        this.follow(ch, ev.vs);
        this.bend(ch, ev.ps);
      }
      // チップを進めて、出口の刻みへ落とす
      this.frac += this.step;
      while (this.frac >= 1) {
        this.prev = this.cur;
        this.cur = this.chip.tick();
        this.frac -= 1;
      }
      // 出口の割り算。チップの生の値は int16 の幅で出てくる。
      // 音 6 本 + 打楽器 5 つを全部いちばん大きい音量で鳴らすと 16401 まで
      // 行くので、そこがちょうど 1.0 になる数を選んだ。それ以上は出口で潰れる
      let v = (this.prev + (this.cur - this.prev) * this.frac) / 16384;
      // 止めている最中なら、出口を落とす。落ちきったら 0 のまま
      if (this.cutAt >= 0) {
        v *= Math.max(0, 1 - this.cutAt / this.cutLen);
        this.cutAt++;
        if (this.cutAt > this.cutLen) { this.cutAt = this.cutLen; v = 0; }
      }
      out[i] = v;
    }
    if (this.logBuf && this.logBuf.length) {
      this.port.postMessage({ regs: this.logBuf });
      this.logBuf = [];
    }
    return this.alive;
  }
}
registerProcessor('mmsxx-opll', OpllBank);
`;


// ---- エンジンへ自分を登録する ----
//
// このファイルを読み込むと OPLL で鳴らせるようになる。音色は `opllpresets.js`、
// 音色の中身を書く口は `opllvoice.js` が持つ
// (docs/SOUND_TOOL.md「音源ごとに分けて配る」)

/**
 * OPLL で鳴らす音符を、常駐の処理器へ渡す形にする。
 *
 * 音量はチップに任せる。OPLL の音量レジスタは 1 段 3dB の減衰で、
 * 実機ではここしか効かない。外から掛けると実機と違う鳴り方になる
 */
function opllEvent(ev, wf, freq, amp, t0, t1) {
  const wfo = wf;

  // 音色が高さをずらして名乗っているなら、そのぶん動かす(`opll::kick(low)` など)
  if (wfo.semi) freq *= Math.pow(2, wfo.semi / 12);
  // 音量はチップに任せる。OPLL の音量レジスタは 1 段 3dB の減衰で、
  // 実機ではここしか効かない。外から掛けると実機と違う鳴り方になる
  return {
    // 余韻はチップが持つ。延ばす前の長さでキーオフする
    t: t0, dur: Math.max(0.01, t1 - t0 - (ev.relTail || 0)), freq, v: ev.vol, inst: wfo.inst,
    // フェードの途中なら、鳴っているあいだに音量レジスタを書き直す。
    // 余韻(キーオフのあと)も書き直す
    ...(ev.fade ? { vs: this._fadeSteps(ev, t0, t1, (a) => volAt(ev, a)) } : {}),
    // ポルタメント。鳴っているあいだに音程レジスタを書き直す。
    // 実機のドライバも同じことをしていた。重ねた音色の片方が Web Audio の
    // 発振器で滑るのに、こちらだけ音符の頭のまま鳴っていた(2026-09-28)。
    // 高さで並べておいて、block と fnum へ直すのは処理器の側
    // 高さは間引かずに毎フレーム渡す。レジスタの値が同じかどうかは
    // 処理器の側でしか分からない(block と fnum に直すのがあちら)ので、
    // ここで薄めると音程の刻みと食い違う
    ...(ev.glide > 0
      ? { ps: this._fadeSteps(ev, t0, t1 - (ev.relTail || 0),
        (a) => freqAt(ev, a), (x) => x) }
      : {}),
    // 打楽器。書いた高さを Hz で渡す。それがチャンネルの周波数になる。
    // o4c(`DRUM_FREQ`)のままなら何も渡さないので、実機のドライバが決めた
    // 高さのまま鳴る(ドラムの囲みは必ず o4c)。ずらすのは `#bundle` の
    // `@o` `@d` か、ふつうの音符として鳴らしたとき
    // (→ `sound/opll.js` の `drumHz`、2026-10-28 に比から Hz へ直した)
    ...(wfo.drum
      ? { drum: wfo.drum,
        ...(Math.abs(freq / DRUM_FREQ - 1) > 1e-6 ? { rhz: freq } : {}) }
      : {}),
    ...(wfo.set ? { set: wfo.set } : {}),
    // タイでつながった音。同じ声で続けて、キーオンを立て直さない。
    // 立て直すとエンベロープが頭から始まるので、滑ったあとにアタックが
    // やり直される(実測で 40ms かけて上がっていた。2026-09-30)
    // `left` はつながりの残りの長さ。キーオフをここまで延ばすために要る。
    // 処理器は「終わる音符」を先に見るので、この音の長さでキーオフを
    // 書くと、同じ時刻に来る続く音がキーオンを立て直すことになる
    ...(ev.tieId ? { tie: ev.tieId, legato: ev.legato ? 1 : 0,
      left: Math.max(0, ev.tieSpan - ev.tieAt) } : {}),
    // 自分で作った音色。8 バイトをレジスタ 0x00〜0x07 へ書いてから鳴らす
    ...(wfo.voice ? { voice: wfo.voice } : {}),
  };
}

/** 処理器の登録に渡すもの */
export const OPLL_CHIP = {
  kind: 'opll',
  node: 'mmsxx-opll',
  code: OPLL_CODE,
  event: opllEvent,
  // 音量をチップが持つので、残響のしっぽを足さない
  noTail: true,
  // 実機が 1 オクターブを 512 段で刻むので、高さは寄せない(snap は既定の 0)
  //
  // 焼くときの決めごとを自分で組む。`fixed` は OPLL を 1 チャンネルに固定して
  // 焼く試験用の指定で、エンジンの `startBGM({ opllFixed: true })` から来る
  options(list) {
    return {
      processorOptions: {
        events: list, voices: this.maxVoices * 4,
        ...(this._regLog ? { log: true } : {}),
        ...(this._opllFixed ? { fixed: true } : {}),
      },
    };
  },
};

registerChipKind(OPLL_CHIP.kind, OPLL_CHIP);
