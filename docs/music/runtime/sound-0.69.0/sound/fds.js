// ファミコン ディスクシステム(FDS)の音源。チップそのものを持って鳴らす。
//
// ---- なぜチップそのものを持つか ----
//
// 前は「64 個・6 ビットの波形メモリ + 発振器で掛けるビブラート」で寄せていた。
// 実機の変調ユニットは周波数ではなく、表で数えるカウンタで音程を書き換える作りで、
// 揺れ方も丸め方も別もの。チップを持てば、そのまま実機の動きになる
// (docs/ENGINE_TODO.md の「1b」)。
//
// ---- 出どころ ----
//
// どのエミュレータも移していない。NESdev Wiki の資料を読んで書いた。
// https://www.nesdev.org/wiki/FDS_audio
// 確かめるときは、同じ書き込みを VGM にして libvgm の NSFPlay FDS のコアで鳴らす。
//
// ---- まだ無いもの ----
//
// - 音量と変調のエンベロープ(チップの)。音量はこちらで 1 フレームずつ書く
// - 音量を PWM で掛けるところ。振幅の掛け算にしてある
// - DAC の段の不揃い(資料に「2 進の節目でがたつく」とある)

import { registerFDS } from './mml.js';

/** CPU のクロック(NTSC) */
export const FDS_CLOCK = 1789773;

/** 波形メモリの枠。64 個・6 ビット */
export const FDS_LEN = 64;

/**
 * 出口の大きさ。波形が 63・音量 32 のときの山の高さ。
 *
 * 資料では、FDS の最大は APU の矩形波の最大のおよそ 2.4 倍。矩形波 1 本の最大
 * (95.88 / (8128 / 15 + 100))に `NES_OUT_GAIN`(1.876)を掛けたものが、
 * `nesPulse(50)` の `v15` を `pulse(50)` に揃えた大きさなので、その 2.4 倍にする。
 */
export const FDS_OUT_PEAK = 2.4 * (95.88 / (8128 / 15 + 100)) * 1.876;

/**
 * 音の高さから、周期の値($4082/$4083)。12 ビット。
 * 1 周 64 個を f で回すには、16 クロックごとに p × 64 を 2^24 の輪に足す。
 * @param {number} freq 高さ(Hz)
 */
export function fdsPitch(freq) {
  if (!(freq > 0)) return 0;
  return Math.max(1, Math.min(4095, Math.round(freq * 16 * 64 * 4096 / FDS_CLOCK)));
}

/** -1..1 の 64 個を、0〜63 の値へ */
export const fdsWave = (list) => Array.from(list, (v) => Math.round((Math.max(-1, Math.min(1, v)) + 1) / 2 * 63));

/** 1 周期ぶんを作る(0..1 を受けて -1..1 を返す関数から) */
const build = (fn) => fdsWave(Array.from({ length: FDS_LEN }, (_, i) => fn(i / FDS_LEN)));

/**
 * 変調の表。32 個の 3 ビットの値で、カウンタをどう動かすかを書く
 * (0 = そのまま、1 = +1、2 = +2、3 = +4、4 = 0 に戻す、5 = −4、6 = −2、7 = −1)。
 *
 * 表は値そのものではなく、足し引きの並び。三角の揺れは +2 と −2 を並べて作る。
 * カウンタは ±16 まで振れる。
 */
export const FDS_MOD_TABLES = {
  // 0 から上がって +16、下がって −16、戻って 0
  tri: [...Array(8).fill(2), ...Array(16).fill(6), ...Array(8).fill(2)],
  // +16 と −16 を行き来する段
  step: [4, 3, 3, 3, 3, ...Array(11).fill(0), 4, 5, 5, 5, 5, ...Array(11).fill(0)],
};

/** 上の表でカウンタが振れる幅。深さからゲインを出すのに使う */
const MOD_PEAK = 16;

/**
 * 揺らす深さ(音の高さに対する割合)から、変調のゲイン($4084)。
 *
 * 音程の倍率は 1 + カウンタ × ゲイン / 1024 なので、カウンタが振れきったときに
 * 深さになるゲインを選ぶ。6 ビットなので 63 で止まる。
 */
export const fdsModGain = (depth) => Math.max(0, Math.min(63, Math.round(depth * 1024 / MOD_PEAK)));

// ---- 波形 ----
//
// 倍音を足しただけの滑らかな形では癖が出ない。波形メモリの値打ちは何でも描けることなので、
// 角・段・偏りのある形を直に描く。6 ビットの粗さもそこで効いてくる。
// どれも実機のデータを写したものではない。そう聞こえる形を描いたもの。

/** 階段 */
const STEP = build((p) => Math.round(Math.sin(2 * Math.PI * p) * 8) / 8);
/** 針。狭い山が 1 本立つ */
const SPIKE = build((p) => (p < 0.12 ? Math.sin(Math.PI * p / 0.12) : -0.18));
/** 半波整流。片側だけ出る */
const HALF = build((p) => {
  const v = Math.sin(2 * Math.PI * p);
  return (v > 0 ? v : 0) * 2 - 0.6;
});
/** のこぎりに段を付けたもの */
const RAMP = build((p) => Math.round((1 - 2 * p) * 6) / 6);
/** 偏った形。前半が細く後半が太い */
const ODD = build((p) => (p < 0.35
  ? Math.sin(Math.PI * p / 0.35)
  : -0.7 * Math.sin(Math.PI * (p - 0.35) / 0.65)));
/** 二山。1 オクターブ上が強く出る */
const TWIN = build((p) => Math.sin(2 * Math.PI * p) * 0.5 + Math.sin(4 * Math.PI * p) * 0.5);
/** 中が空いた矩形寄り。3 倍音を落とし、2 倍音を少し足して左右非対称にしてある */
const LIKE_ZLD = build((p) => (Math.sin(2 * Math.PI * p)
  + 0.12 * Math.sin(4 * Math.PI * p)
  + 0.28 * Math.sin(6 * Math.PI * p)
  + 0.16 * Math.sin(10 * Math.PI * p)
  + 0.09 * Math.sin(14 * Math.PI * p)) / 1.65);

/**
 * 最初から入れておく音色。説明は英語だけ持つ(日本語はデータに入れない)。
 *
 * `mod` の `ratio` は変調の速さ(表を 1 周する速さが音の高さの何倍か)、
 * `depth` は揺らす深さ(音の高さに対する割合)。
 *
 * @type {[string, {wave:number[], mod?:{ratio:number, depth:number, table:string}}, string, string, string[]?][]}
 */
export const FDS_PRESETS = [
  ['fdsStep', { wave: STEP }, 'lead', 'Stepped wavetable on the disk system chip: the shape that reads as "wavetable chip" more than any other.'],
  ['fdsSpike', { wave: SPIKE }, 'lead', 'Narrow spike in the disk system wavetable: bright and thin.'],
  ['fdsHalf', { wave: HALF }, 'bass', 'Half-wave rectified shape on the disk system chip: fat and round.'],
  ['fdsRamp', { wave: RAMP }, 'lead', 'Stepped ramp on the disk system chip. Buzzy, close to a saw.'],
  ['fdsOdd', { wave: ODD }, 'lead', 'Lopsided shape on the disk system chip. Reads as reedy.'],
  ['fdsTwin', { wave: TWIN }, 'lead', 'Two humps per cycle on the disk system chip, so it sounds an octave brighter than it is.'],
  ['fdsVibe', { wave: HALF, mod: { ratio: 0.035, depth: 0.03, table: 'tri' } }, 'lead',
    'The disk system modulator run slowly, used as vibrato rather than as timbre.'],
  ['fdsBell', { wave: STEP, mod: { ratio: 1.0, depth: 0.6, table: 'tri' } }, 'counter',
    'The disk system modulator at the note’s own rate and deep: sidebands grow and it turns metallic.'],
  ['fdsMetal', { wave: TWIN, mod: { ratio: 2.51, depth: 0.9, table: 'step' } }, 'perc',
    'An awkward modulator ratio with a stepped table, deep enough that the pitch turns into a clang.'],
  ['fdsWobble', { wave: ODD, mod: { ratio: 0.25, depth: 0.35, table: 'step' } }, 'counter',
    'The modulator at a quarter of the note’s rate, deep: the pitch audibly swings.'],
  ['fdsGrowl', { wave: RAMP, mod: { ratio: 0.5, depth: 0.7, table: 'step' } }, 'bass',
    'The modulator at half the note’s rate, deep enough to roughen the tone into a growl.'],
  ['fdsLikeZld', { wave: LIKE_ZLD, mod: { ratio: 0.015, depth: 0.025, table: 'tri' } }, 'lead',
    'A hollow, slightly asymmetric wavetable with a shallow vibrato: the overworld-lead sound of the '
    + 'disk system, drawn rather than lifted.', ['homage']],
];

/**
 * 最初から入れておく音色を登録する(エンジンが読み込まれるときに走る)。
 * 二度呼ばれても止まらない(ほかの register* と同じ)。
 */
export function registerFDSPresets() {
  for (const [name, params, role, desc, tags] of FDS_PRESETS) {
    try { registerFDS(name, params, { role, desc, version: '1.00',
      tags: ['nes', ...(tags || [])] }); }
    catch (e) { /* すでに入っている */ }
  }
}

/**
 * 処理器の中身(文字列から作るのでファイルは増えない)。
 *
 * レジスタの番号は VGM の決まりに合わせる。$4080〜$408A は 0x20〜0x2A、
 * 波形メモリ $4040〜$407F は 0x40〜0x7F。記録をそのまま VGM に書けるように。
 */
export const FDS_CODE = `
const CLK = ${FDS_CLOCK};
const OUT_PEAK = ${FDS_OUT_PEAK};
const MOD_STEP = [0, 1, 2, 4, 0, -4, -2, -1];

/**
 * チップ 1 個。16 クロックごとに波形と変調の輪を進める。
 * 出口のサンプルのあいだに来た刻みの値を平均し、2kHz の低域通過を通す
 * (アダプタの出口にある。資料の「およそ 1 次の 2kHz」)。
 */
class FDS {
  constructor(rate) {
    this.step = CLK / 16 / rate;   // 出口 1 サンプルあたりの刻みの数
    this.frac = 0;
    this.reg = new Uint8Array(0x80);
    this.wave = new Uint8Array(64);
    this.mod = new Int8Array(32);
    this.waveAcc = 0;        // 24 ビット。上の 6 ビットが波形の位置
    this.modAcc = 0;         // 12 ビット。桁があふれたら表を 1 つ進める
    this.modPos = 0;         // 64 の位置(表は 2 つずつ同じ値を使う)
    this.counter = 0;        // 7 ビットの符号つき
    this.pitch = 0;
    this.modFreq = 0;
    this.gain = 0;           // いま出している音量(0〜32 で頭打ち)
    this.pend = -1;          // 波形の位置が 0 に戻ったときに入れる音量
    this.modGain = 0;
    this.halt = true;        // $4083 bit7。波形を止めて頭に戻す
    this.modHalt = true;     // $4087 bit7。変調を止めて、表を書けるようにする
    this.write = false;      // $4089 bit7。波形メモリを書ける(出口は止まる)
    this.master = 1;
    this.held = 0;
    const cut = 2000;
    this.lpA = 1 - Math.exp(-2 * Math.PI * cut / rate);
    this.lp = 0;
  }

  writeReg(r, v) {
    if (r >= 0x40) {
      if (this.write) this.wave[r - 0x40] = v & 63;
      return;
    }
    this.reg[r] = v;
    switch (r) {
      case 0x20: {   // $4080 音量。エンベロープを切って、値をそのまま使う
        const g = v & 63;
        if (g === 0) { this.gain = 0; this.pend = -1; } else this.pend = g;
        break;
      }
      case 0x22: this.pitch = (this.pitch & 0xf00) | v; break;
      case 0x23:
        this.pitch = (this.pitch & 0xff) | ((v & 15) << 8);
        this.halt = !!(v & 0x80);
        if (this.halt) this.waveAcc = 0;
        break;
      case 0x24: this.modGain = v & 63; break;
      case 0x25: this.counter = ((v & 0x7f) ^ 0x40) - 0x40; break;
      case 0x26: this.modFreq = (this.modFreq & 0xf00) | v; break;
      case 0x27:
        this.modFreq = (this.modFreq & 0xff) | ((v & 15) << 8);
        this.modHalt = !!(v & 0x80);
        if (this.modHalt) this.modAcc = 0;
        break;
      case 0x28:
        // 止めているあいだだけ書ける。いまの位置に入れて、次へ進める
        if (this.modHalt) {
          this.mod[(this.modPos >> 1) & 31] = v & 7;
          this.modPos = (this.modPos + 2) & 63;
        }
        break;
      case 0x29:
        this.write = !!(v & 0x80);
        if (this.write) this.held = this.wave[(this.waveAcc >>> 18) & 63];
        this.master = [1, 2 / 3, 2 / 4, 2 / 5][v & 3];
        break;
    }
  }

  /** 16 クロックぶん進める。そのときの出口の値(0〜1)を返す */
  tick() {
    // 変調。桁があふれたら、表の値でカウンタを動かす
    if (!this.modHalt && this.modFreq > 0) {
      this.modAcc += this.modFreq;
      while (this.modAcc >= 4096) {
        this.modAcc -= 4096;
        const m = this.mod[(this.modPos >> 1) & 31];
        if (m === 4) this.counter = 0;
        else this.counter = (((this.counter + MOD_STEP[m]) & 0x7f) ^ 0x40) - 0x40;
        this.modPos = (this.modPos + 1) & 63;
      }
    }
    if (!this.halt && !this.write && this.pitch > 0) {
      // 資料の式そのまま。正の側だけ 6 ビットへ切り上げる
      let temp = this.counter * this.modGain;
      if ((temp & 0x0f) && !(temp & 0x800)) temp += 0x20;
      temp += 0x400;
      temp = (temp >> 4) & 0xff;
      const wp = (this.pitch * temp) & 0xfffff;
      const before = this.waveAcc >>> 18;
      this.waveAcc = (this.waveAcc + wp) % 0x1000000;
      // 音量の書き換えは、波形の位置が 0 に戻ったところで効く
      if (this.pend >= 0 && (this.waveAcc >>> 18) < before) { this.gain = this.pend; this.pend = -1; }
    } else if (this.pend >= 0) {
      this.gain = this.pend; this.pend = -1;
    }
    const w = this.write ? this.held : this.wave[(this.waveAcc >>> 18) & 63];
    return w / 63 * Math.min(32, this.gain) / 32 * this.master;
  }

  /** 出口の 1 サンプル。0 から上。直流は外で抜く */
  calc() {
    this.frac += this.step;
    const n = Math.floor(this.frac);
    this.frac -= n;
    let sum = 0;
    for (let i = 0; i < n; i++) sum += this.tick();
    const x = n > 0 ? sum / n * OUT_PEAK : this.lp;
    this.lp += this.lpA * (x - this.lp);
    return this.lp;
  }
}

/**
 * 行き先 1 つぶんの処理器。FDS は 1 声なので、重なった音符ごとにチップを足す。
 */
class FdsBank extends AudioWorkletProcessor {
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
    const c = new FDS(sampleRate);
    const chip = { c, log: null, end: 0, wave: null, mod: null, ratio: 0, vs: null, ps: null };
    if (this.log) {
      const raw = c.writeReg.bind(c);
      chip.log = [];
      c.writeReg = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    c.writeReg(0x29, 0x00);
    c.writeReg(0x20, 0x80);
    c.writeReg(0x24, 0x80);
    c.writeReg(0x27, 0x80);
    this.pool.push(chip);
    return chip;
  }

  cut() {
    this.events.length = 0;
    this.at = 0;
    for (const chip of this.pool) this.silence(chip);
    if (this.cutAt < 0) this.cutAt = 0;
  }

  silence(chip) {
    chip.end = 0; chip.vs = null; chip.ps = null;
    chip.c.writeReg(0x20, 0x80);
  }

  pick(now) {
    for (const chip of this.pool) if (chip.end <= now) return chip;
    return this.grow();
  }

  /** 周期と、それに付いてくる変調の速さを書く */
  pitch(chip, p, force) {
    const c = chip.c;
    if (force || c.reg[0x22] !== (p & 0xff)) c.writeReg(0x22, p & 0xff);
    if (force || (c.reg[0x23] & 15) !== ((p >> 8) & 15)) c.writeReg(0x23, (p >> 8) & 15);
    if (chip.mod) {
      const m = Math.max(0, Math.min(4095, Math.round(chip.ratio * p)));
      if (force || c.reg[0x26] !== (m & 0xff)) c.writeReg(0x26, m & 0xff);
      if (force || (c.reg[0x27] & 15) !== ((m >> 8) & 15)) c.writeReg(0x27, (m >> 8) & 15);
    }
  }

  start(ev, now) {
    const chip = this.pick(now);
    const c = chip.c;
    if (chip.end > 0) this.silence(chip);
    // 波形メモリ。前と同じなら書き直さない
    if (chip.wave !== ev.wkey) {
      c.writeReg(0x29, 0x80);
      for (let i = 0; i < 64; i++) c.writeReg(0x40 + i, ev.wave[i]);
      c.writeReg(0x29, 0x00);
      chip.wave = ev.wkey;
    }
    // 変調。止めて表を書き、カウンタを 0 にしてから回す
    chip.mod = ev.mod || null;
    chip.ratio = ev.mod ? ev.mod.ratio : 0;
    c.writeReg(0x27, 0x80);
    if (ev.mod) {
      for (let i = 0; i < 32; i++) c.writeReg(0x28, ev.mod.table[i]);
      c.writeReg(0x25, 0);
      c.writeReg(0x24, 0x80 | ev.mod.gain);
    } else {
      c.writeReg(0x24, 0x80);
    }
    c.writeReg(0x20, 0x80 | (ev.v & 63));
    // 鳴らしはじめは波形の頭から(bit7 を立てて戻し、すぐ下ろす)
    c.writeReg(0x23, 0x80 | ((ev.p >> 8) & 15));
    this.pitch(chip, ev.p, true);
    chip.end = ev.t + ev.dur;
    chip.vs = ev.vs && ev.vs.length ? { list: ev.vs, at: 0 } : null;
    chip.ps = ev.ps && ev.ps.length ? { list: ev.ps, at: 0 } : null;
  }

  step(now) {
    for (const chip of this.pool) {
      if (chip.end <= 0) continue;
      if (chip.end <= now) { this.silence(chip); continue; }
      const c = chip.c;
      if (chip.vs) {
        const f = chip.vs;
        while (f.at < f.list.length && f.list[f.at][0] <= now) c.writeReg(0x20, 0x80 | (f.list[f.at++][1] & 63));
        if (f.at >= f.list.length) chip.vs = null;
      }
      if (chip.ps) {
        const f = chip.ps;
        while (f.at < f.list.length && f.list[f.at][0] <= now) this.pitch(chip, f.list[f.at++][1], false);
        if (f.at >= f.list.length) chip.ps = null;
      }
    }
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const n = out.length;
    const base = currentTime;
    const next = this.at < this.events.length ? this.events[this.at].t : Infinity;
    if (!this.pool.some((c) => c.end > 0) && next >= base + n / sampleRate
      && Math.abs(this.dcY) < 1e-6) {
      out.fill(0);
      this.dcX = 0; this.dcY = 0;
      return true;
    }
    for (let i = 0; i < n; i++) {
      const now = base + i / sampleRate;
      if (this.log) this.logNow = now;
      this.step(now);
      while (this.at < this.events.length && this.events[this.at].t <= now) {
        this.start(this.events[this.at++], now);
      }
      let raw = 0;
      for (const chip of this.pool) if (chip.end > 0) raw += chip.c.calc();
      const y = raw - this.dcX + this.dcR * this.dcY;
      this.dcX = raw;
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
registerProcessor('mmsxx-fds', FdsBank);
`;
