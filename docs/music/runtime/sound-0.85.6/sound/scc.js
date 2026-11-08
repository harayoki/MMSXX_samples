// コナミの SCC。MSX に挿すカートリッジの波形メモリ音源。チップそのものを持って鳴らす。
// 鳴らすのは SCC+(K052539)の作り。5 声とも波形を別々に持てる。
//
// ---- なぜチップそのものを持つか ----
//
// `wave*` の音色は、波形メモリの形を Web Audio の発振器で鳴らしている。
// 実機に無いビット数も書けるので、それはそれで残す。こちらは実機の作りどおりに、
// 32 個・8 ビット符号つきの波形を、12 ビットの周期で 1 個ずつ読んで鳴らす
// (docs/ENGINE_TODO.md の「1b」)。
//
// ---- 出どころ ----
//
// どのエミュレータも移していない。MSX Datapack などにあるレジスタの資料から書いた。
// 確かめるときは、同じ書き込みを VGM にして libvgm の MAME のコア(k051649.c)で鳴らす。
//
// ---- 実機の制約 ----
//
// - 5 声。初代の SCC(K051649)では 4 声目と 5 声目が波形を共有するが、再生では気にしない。
//   その決まりは、実機へ書き出すと宣言したときにチェックする(2026-10-04)。
//   SCC を何個使ってもよいのと同じで、実機の制約は再生に持ち込まない
// - 音量は 4 ビットで、値がそのまま振幅

import { registerSCC, registerVoiceSyntax, badVoice as bad, voiceNums, splitParts }
  from './mml.js';
import { WT_SINE, WT_RAMP } from './wavetables.js';

/** チップのクロック。MSX の 3.58MHz */
export const SCC_CLOCK = 3579545;

/**
 * 出口の大きさ。山いっぱい(±127)の矩形を音量 15 で鳴らしたときの実効値が、
 * `pulse(50)` を `v15` で鳴らしたときと揃う数(鳴らして測った。2026-10-04)。
 */
export const SCC_OUT_GAIN = 0.1404;

/**
 * 音の高さから、周期の値。12 ビット。f = CLK / (32 × (値 + 1))。
 * 小さい値は実機で正しく鳴らないので、9 で止める。
 * @param {number} freq 高さ(Hz)
 */
export function sccPeriod(freq) {
  if (!(freq > 0)) return 4095;
  return Math.max(9, Math.min(4095, Math.round(SCC_CLOCK / (32 * freq) - 1)));
}

/** -1..1 の 32 個を、-128〜127 の値へ */
export const sccWave = (list) => Array.from(list, (v) => Math.max(-128, Math.min(127, Math.round(v * 127))));

/**
 * 最初から入れておく音色。説明は英語だけ持つ(日本語はデータに入れない)。
 *
 * 置くのは、ほかの音源から曲を移すときに要る基本の形だけ。SCC の音色は本来
 * ゲームごとに作るもので、こちらで描いた形は実機の音ではない。
 * 少しずつ増やしていく(2026-10-04)。
 */
export const SCC_PRESETS = [
  ['sccSquare', Array.from({ length: 32 }, (_, i) => (i < 16 ? 1 : -1)), 'lead',
    'A 50% square on the SCC chip itself. The basic shape for porting a pulse part from another chip.'],
  ['sccTriangle', Array.from({ length: 32 }, (_, i) => (i < 16 ? -1 + i / 7.5 : 1 - (i - 16) / 7.5)), 'bass',
    'A triangle on the SCC chip. The basic shape for porting a bass from another chip.'],
  ['sccSaw', WT_RAMP, 'lead',
    'A sawtooth on the SCC chip. Bright and buzzy.'],
  ['sccSine', WT_SINE, 'chord',
    'A sine on the SCC chip: thirty-two eight-bit samples, so the steps all but disappear.'],
];

/**
 * 最初から入れておく音色を登録する(エンジンが読み込まれるときに走る)。
 * 二度呼ばれても止まらない(ほかの register* と同じ)。
 */
export function registerSCCPresets() {
  for (const [name, wave, role, desc] of SCC_PRESETS) {
    try { registerSCC(name, { wave: sccWave(wave) }, { role, desc, tags: ['msx'], version: '1.00' }); }
    catch (e) { /* すでに入っている */ }
  }
}

/**
 * `#voice … = @scc{ bytes{…} }` を読む。
 *
 * 並びは 32 個、-128〜127 の符号つき 8 ビット。実機のデータがその形なので、
 * 書き写すときに割り算をしないで済む。`#wave` の -1〜1 とは別の書き方になる。
 *
 * @param {string} text `@scc{…}` の中身
 * @param {string} name 言づてに出す音色の名前
 * @returns {number[]} 32 個
 */
function readSccSpec(text, name) {
  let wave = null;
  for (const one of splitParts(text)) {
    const m = /^([A-Za-z]+)\s*\{([^}]*)\}$/.exec(one.trim());
    if (!m) {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の @scc の "${one.trim()}" は読めません`
        + '(bytes{…} と書きます)');
    }
    if (m[1].toLowerCase() !== 'bytes') {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の @scc に "${m[1]}" は書けません(書けるのは bytes です)`);
    }
    wave = voiceNums(m[2], name, 'scc の bytes');
  }
  if (!wave) bad(`[ChpTnSnd] MML: 音色 "${name}" の @scc に中身がありません(bytes{…} を書きます)`);
  return wave;
}

// MML の #voice で @scc{…} と書けるようにする。
//
// ---- なぜ `#wave` ではないか ----
//
// `#wave` が作るのは汎用の波形メモリで、音量の曲線は `curve`(dB 寄り)。
// SCC は音量 4 ビットの値がそのまま振幅に掛かるので、小さい `v` で鳴りが違う。
// 実機の SCC で曲を書いたものを `#wave` へ写すと、和音のような小さい `v` だけが
// 沈む(Beyond the Cave でそうなっていた。2026-10-30)。
// チップで鳴らすものは、チップの音色として作る。
//
// 中身は字のまま受ける(`bytes{…}` の形が mml.js の読み方と合わないため)
registerVoiceSyntax('scc', (name, text, opts) =>
  registerSCC(name, { wave: readSccSpec(text, name) }, opts), { raw: true });

/**
 * 処理器の中身(文字列から作るのでファイルは増えない)。
 *
 * レジスタの番号は SCC+ の窓の並びのまま。0x00〜0x9F が波形(5 声ぶん)、
 * 0xA0〜0xA9 が周期、0xAA〜0xAE が音量、0xAF が鳴らす声のビット。
 */
export const SCC_CODE = `
const CLK = ${SCC_CLOCK};
const OUT_GAIN = ${SCC_OUT_GAIN};

/**
 * チップ 1 個。出口のサンプルごとにクロックを数えて進め、そのあいだの値を平均してから
 * 混ぜる(点で拾うと高い音で折り返しが出るため)。
 */
class SCC {
  constructor(rate) {
    this.step = CLK / rate;
    this.frac = 0;
    this.reg = new Uint8Array(0xb0);
    this.ram = new Int8Array(160);
    this.period = new Uint16Array(5);
    this.count = new Float64Array(5).fill(1);
    this.pos = new Uint8Array(5);
    this.vol = new Uint8Array(5);
    this.on = 0;
  }

  writeReg(r, v) {
    if (r >= 0xb0) return;
    this.reg[r] = v;
    if (r < 0xa0) { this.ram[r] = (v << 24) >> 24; return; }
    if (r < 0xaa) {
      const c = (r - 0xa0) >> 1;
      this.period[c] = ((this.reg[0xa1 + c * 2] & 15) << 8) | this.reg[0xa0 + c * 2];
      return;
    }
    if (r < 0xaf) { this.vol[r - 0xaa] = v & 15; return; }
    this.on = v & 31;
  }

  /** 出口の 1 サンプル(およそ -1..1) */
  calc() {
    this.frac += this.step;
    const n = Math.floor(this.frac);
    this.frac -= n;
    if (n <= 0) return this.out || 0;
    let mix = 0;
    for (let c = 0; c < 5; c++) {
      if (!(this.on & (1 << c)) || this.vol[c] === 0) continue;
      const base = c * 32;
      const per = this.period[c] + 1;
      let left = n, sum = 0;
      while (left >= this.count[c]) {
        sum += this.ram[base + this.pos[c]] * this.count[c];
        left -= this.count[c];
        this.pos[c] = (this.pos[c] + 1) & 31;
        this.count[c] = per;
      }
      sum += this.ram[base + this.pos[c]] * left;
      this.count[c] -= left;
      mix += sum / n * this.vol[c];
    }
    this.out = mix / (128 * 15) * OUT_GAIN;
    return this.out;
  }
}

/**
 * 行き先 1 つぶんの処理器。中にチップを何個でも持つ(sound/ay.js と同じ考え方)。
 */
class SccBank extends AudioWorkletProcessor {
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
    const c = new SCC(sampleRate);
    const chip = { c, log: null, v: [0, 1, 2, 3, 4].map(() => ({ end: 0, off: null, trk: null, vs: null, ps: null, ws: null })),
      wave: [null, null, null, null, null] };
    if (this.log) {
      const raw = c.writeReg.bind(c);
      chip.log = [];
      c.writeReg = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    c.writeReg(0xaf, 0);
    this.pool.push(chip);
    return chip;
  }

  cut() {
    this.events.length = 0;
    this.at = 0;
    for (const chip of this.pool) for (let s = 0; s < 5; s++) this.silence(chip, s);
    if (this.cutAt < 0) this.cutAt = 0;
  }

  silence(chip, s) {
    const v = chip.v[s];
    v.end = 0; v.off = null; v.trk = null; v.vs = null; v.ps = null; v.ws = null;
    if (chip.c.reg[0xaa + s] !== 0) chip.c.writeReg(0xaa + s, 0);
    const on = chip.c.reg[0xaf] & ~(1 << s);
    if (chip.c.reg[0xaf] !== on) chip.c.writeReg(0xaf, on);
  }

  /**
   * 声を 1 つ選ぶ。
   *
   * ---- 余韻は声を占め続けない ----
   *
   * end には余韻(@e のリリース)のぶんが入っている。余韻は「その音の音量が
   * 下がっていくところ」で、別の声を占めるものではない。実機のチップも、同じ
   * チャンネルに次のキーオンが来れば前の音の下がりはそこで終わる。
   *
   * 前はここを見ていなかったので、余韻の長い音を続けて書くと声が埋まり、
   * チップが増え続けた。増えたチップは外れず、割り当ては pool の頭から見るので、
   * くり返すたびに同じ音符が別の場所に載り、周を重ねるほど音が変わっていた
   * (2026-11-05)。
   *
   * 順は 4 つ。1) 同じ波形で空き 2) 空き 3) 同じチャンネルで、もうキーオフ
   * しているもの(余韻の尾だけ切る)4) チップを足す。
   * 重ねる音(オクターブ重ね・エコー・和音)はまだキーオフしていないので切られない
   */
  pick(ev, now) {
    const wkey = ev.wkey;
    // まず、同じチャンネルで「もう離した音」を探す。空き探しより先なのは、
    // 実機の 1 チャンネルが 1 音だから。後回しにすると、ほかのチャンネルの
    // 空いた声へ新しい音が載り、前の音の尾が鳴ったまま重なる。
    // まだ離していない音(重ね・エコー・和音)は off > now なので選ばれない
    const mine = this.sameTrack(ev, now, wkey);
    if (mine) return mine;
    for (const chip of this.pool) {
      // 同じ波形がすでに載っている声を先に選ぶ(書き直さずに済む)
      for (let s = 0; s < 5; s++) if (chip.wave[s] === wkey && chip.v[s].end <= now) return { chip, s };
      for (let s = 0; s < 5; s++) if (chip.v[s].end <= now) return { chip, s };
    }
    return { chip: this.grow(), s: 0 };
  }

  /** 同じチャンネルで、もう離した音が載っている声(同じ波形のものを先に) */
  sameTrack(ev, now, wkey) {
    if (ev.trk == null) return null;
    const ok = (chip, s) => {
      const v = chip.v[s];
      return v.end > 0 && v.trk === ev.trk && v.off != null && v.off <= now;
    };
    for (const chip of this.pool) {
      for (let s = 0; s < 5; s++) if (chip.wave[s] === wkey && ok(chip, s)) return { chip, s };
      for (let s = 0; s < 5; s++) if (ok(chip, s)) return { chip, s };
    }
    return null;
  }

  start(ev, now) {
    const { chip, s } = this.pick(ev, now);
    const c = chip.c;
    if (chip.v[s].end > 0) this.silence(chip, s);
    if (chip.wave[s] !== ev.wkey) {
      for (let i = 0; i < 32; i++) c.writeReg(s * 32 + i, ev.wave[i] & 0xff);
      chip.wave[s] = ev.wkey;
    }
    c.writeReg(0xa0 + s * 2, ev.p & 0xff);
    c.writeReg(0xa1 + s * 2, (ev.p >> 8) & 15);
    c.writeReg(0xaa + s, ev.v & 15);
    c.writeReg(0xaf, c.reg[0xaf] | (1 << s));
    const v = chip.v[s];
    v.end = ev.t + ev.dur;
    // 離す時刻と、どのチャンネルの音か。余韻の尾だけを切るのに使う
    v.off = ev.off != null ? ev.off : v.end;
    v.trk = ev.trk != null ? ev.trk : null;
    v.vs = ev.vs && ev.vs.length ? { list: ev.vs, at: 0 } : null;
    v.ps = ev.ps && ev.ps.length ? { list: ev.ps, at: 0 } : null;
    v.ws = ev.ws && ev.ws.length ? { list: ev.ws, at: 0 } : null;
  }

  step(now) {
    for (const chip of this.pool) {
      const c = chip.c;
      for (let s = 0; s < 5; s++) {
        const v = chip.v[s];
        if (v.end <= 0) continue;
        if (v.end <= now) { this.silence(chip, s); continue; }
        if (v.vs) {
          const f = v.vs;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            const val = f.list[f.at++][1] & 15;
            if (c.reg[0xaa + s] !== val) c.writeReg(0xaa + s, val);
          }
          if (f.at >= f.list.length) v.vs = null;
        }
        if (v.ps) {
          const f = v.ps;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            const p = f.list[f.at++][1];
            if (c.reg[0xa0 + s * 2] !== (p & 0xff)) c.writeReg(0xa0 + s * 2, p & 0xff);
            if (c.reg[0xa1 + s * 2] !== ((p >> 8) & 15)) c.writeReg(0xa1 + s * 2, (p >> 8) & 15);
          }
          if (f.at >= f.list.length) v.ps = null;
        }
        // 波形の並び(@sccseq)。鳴っているまま、波形メモリの 32 個を書き直す。
        // 実機では、チップが読んでいるところへ書くとプツッと鳴ることがある(書く時刻しだい)。
        // ここではそれをまねていない
        if (v.ws) {
          const f = v.ws;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            const [, wave, key] = f.list[f.at++];
            for (let i = 0; i < 32; i++) {
              if (c.reg[s * 32 + i] !== (wave[i] & 0xff)) c.writeReg(s * 32 + i, wave[i] & 0xff);
            }
            chip.wave[s] = key;
          }
          if (f.at >= f.list.length) v.ws = null;
        }
      }
    }
  }

  live(chip) {
    for (let s = 0; s < 5; s++) if (chip.v[s].end > 0) return true;
    return false;
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const n = out.length;
    const base = currentTime;
    const next = this.at < this.events.length ? this.events[this.at].t : Infinity;
    // 波形は符号つきなので直流は乗らない。黙っていれば回さない
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
    return this.alive;
  }
}
registerProcessor('mmsxx-scc', SccBank);
`;
