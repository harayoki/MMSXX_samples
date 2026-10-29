// 減算方式のシンセ音源(アナログ)。発振器 1 つをフィルタ 1 台に通し、
// カットオフと音量にエンベロープを 1 本ずつ掛ける。
//
// ---- 名前 ----
//
// MML からは `@{analog::seqBass}` で呼ぶ。`analog` は減算方式ぜんぶの入れ物で、
// あとで FM や PCM のシンセが来ても名前がぶつからない(2026-10-09 に決めた)。
//
// ---- なぜ常駐の処理器か ----
//
// 音ごとにノードを組むと、作り捨ての手間だけで実時間を越える(`sound/audio.js` の
// `_wkFlush` に実測がある)。1 つの処理器が声を何本も持ち、音符を流し込む形にする。
// フィルタの計算は `sound/filter.js` の `FILTER_CORE` をそのまま埋めるので、
// 節として置いたフィルタと同じ音になる。
//
// ---- 出口は 2 本 ----
//
// コーラスが左右へ広がるので、`sound/modal.js` と同じ 2 本で出す。
// 1 本目が左へ行く束、2 本目が右へ行く束で、足せば元の音に戻る。
// どこに置くかはエンジンが決める(`@p{…}` の両側)。
// コーラスは時間で変わるが線形なので、声ごとに掛けて足すのと、
// 混ぜたあとに掛けるのは同じ音になる(揺れの位相を文脈の時計から出すため)。
//
// ---- まだ無いもの ----
//
// フィルタは声ごとに 1 台。決めごとは「サブチャンネル 1 本につき 1 台」で、
// 同じサブチャンネルの次の音が前の音の状態を引き継ぐ形だが、サブチャンネルの
// 身元がコンパイル結果に残っていないので、そこは先(→ [docs/FILTER.md](../docs/FILTER.md))。

import { FILTER_CORE } from './filter.js';
import { registerAnalog, registerFamily, registerLayer, sealPresets, VIB_SPEED, WAVEFORMS, findWave } from './mml.js';
import { registerDefaultLayers } from './layerpresets.js';
import { TONE_FRAME } from './tones.js';
import { registerChipKind } from './audio.js';

/** 処理器の名前 */
export const ANALOG_NODE = 'mmsxx-analog';

/** 1 つのノードが同時に持てる声の数 */
export const ANALOG_VOICES = 16;

/** コーラスの遅れの中心(秒)。短すぎると櫛のような響きが前に出る */
const CHORUS_BASE = 0.012;

/** ディレイの間隔の上限(秒)。遅れ線はこの長さで取る */
const DELAY_MAX = 1;

/** LFO の表 1 周の長さ */
const LFO_N = 1024;

// 発振器の形。処理器の中では数で比べる(1 サンプルごとに名前を比べると遅い)
const WAVES = ['sawtooth', 'square', 'pulse', 'detuned', 'noise', 'pwm', 'sync', 'ring', 'sine', 'triangle', 'octaveSaw', 'halfSine', 'partials'];

// フィルタの種類。`FILTER_CORE` の KINDS と同じ順
const KINDS = ['lowpass', 'highpass', 'ladder', 'bandpass', 'notch', 'highpass4'];

export const ANALOG_CODE = `${FILTER_CORE}
// 畳むところは外と同じものを埋める。縮めた JS では関数の名前が変わるので、
// 名前を書いて受け取る(sound/modal.js と同じ)
const compileAnalog = ${compileAnalog};

const V = ${ANALOG_VOICES};
const B = 128;
const CHORUS_BASE = ${CHORUS_BASE};
// コーラスの遅れの上限。中心 + 揺れ幅がここを越えない
const CH_MAX = 0.064;
const DELAY_MAX = ${DELAY_MAX};

// 段差を丸める(PolyBLEP)。丸めないと高い音で折り返し雑音が出る
const poly = (t, dt) => {
  if (t < dt) { const x = t / dt; return x + x - x * x - 1; }
  if (t > 1 - dt) { const x = (t - 1) / dt; return x * x + x + x + 1; }
  return 0;
};

/** のこぎり波。位相 t(0〜1)と 1 サンプルぶんの進み dt */
const sawAt = (t, dt) => 2 * t - 1 - poly(t, dt);
/** サイン波 */
const sineAt = (t) => Math.sin(2 * Math.PI * t);
/** [秒, 値] の点の並びの、age 秒のところの値。点のあいだはまっすぐ、最後の点のあとはとどまる */
const curveAt = (pts, age) => {
  if (age <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (age < pts[i][0]) {
      const [a, va] = pts[i - 1], [b, vb] = pts[i];
      return va + (vb - va) * (age - a) / (b - a);
    }
  }
  return pts[pts.length - 1][1];
};
/** 三角波。角は鈍いので、段差を丸めなくても折り返し雑音は小さい */
const triAt = (t) => 1 - 4 * Math.abs(t - 0.5);
/** 半分のサイン波(OPLL の half)。下半分を 0 にして、平均(1/π)を引く */
const halfSineAt = (t) => 2 * (Math.max(0, Math.sin(2 * Math.PI * t)) - 1 / Math.PI);

// ユニゾン(1 つの声の中で、のこぎり波を何本も重ねる)の並べ方。UNI_MAX 本まで。
// 同じ間隔・同じ大きさで並べると、うなりが規則正しく重なって大きくうねる。
// ずらし方を不ぞろいにし、真ん中ほど大きくする。位相は声ごとにばらばらから始める
// (本物の VCO は鳴りっぱなしで、押したときの位相はそろわない)
const UNI_MAX = 20;
// サイン波を並べる(partials)ときの本数の上限
const PT_MAX = 8;
// 呼ぶときに選べる波形(analog の軸 wave の値の順)。[WAVES の番号, パルスの幅]
// saw・square・sine・triangle・pulse25・pulse12・pwm・octaveSaw・pulse33・sync・halfSine
const ALT_WAVES = [[0, null], [1, null], [8, null], [9, null], [2, 0.25], [2, 0.125],
  [5, null], [10, null], [2, 1 / 3], [6, null], [11, null]];
// ユニゾンで重ねたシンクの、聞こえる側の倍率(呼ぶときに wave: sync を選んだとき)
const UNI_SYNC = 2.5;
const UNI_JIT = [0.31, -0.22, 0.12, -0.35, 0.27, -0.08, 0.19, -0.29, 0.05, -0.15,
  0.33, -0.25, 0.09, -0.32, 0.21, -0.11, 0.15, -0.27, 0.02, -0.18];
/**
 * n 本ぶんの音程のずれ(倍率)と大きさ。大きさは 2 乗の和が 1 になるようにそろえる。
 * 位相がばらばらなので、本数を変えても聞こえる大きさが変わらない
 */
function uniTable(n, spread) {
  const rat = new Float64Array(n), gain = new Float64Array(n);
  let p2 = 0;
  for (let k = 0; k < n; k++) {
    // -1〜1 に並べてから、間隔の 3 割ほどずつ散らす。端は動かさない
    const step = n > 1 ? 2 / (n - 1) : 0;
    let x = n > 1 ? -1 + k * step : 0;
    if (k > 0 && k < n - 1) x += UNI_JIT[k] * step;
    rat[k] = Math.pow(2, x * spread / 1200);
    gain[k] = 0.35 + 0.65 * Math.exp(-x * x / 0.5);
    p2 += gain[k] * gain[k];
  }
  const g = 1 / Math.sqrt(p2);
  for (let k = 0; k < n; k++) gain[k] *= g;
  return { rat, gain };
}

/**
 * 幅 w のパルス。幅が 0.5 から外れると波が片側へ寄る(平均が 2w - 1)ので、
 * そのぶんを引く。PWM で幅を揺らしたときに、聞こえない低い揺れが乗らないように
 */
const pulseAt = (t, dt, w) =>
  0.5 * ((t < w ? 1 : -1) + poly(t, dt) - poly((t + 1 - w) % 1, dt) - (2 * w - 1));

/**
 * 小さなリバーブ。くし形の遅れ 4 本を並べ、全域通過 2 本を通す(Freeverb の形を小さくしたもの)。
 * 左右で長さを少し変えて広げる。響きが 60dB 小さくなるまでの秒(time)から、
 * くし形の戻す量を決める。チャンネルの @f{reverb} とは作りが違うので、響きも少し違う
 */
const RV_COMB = [1116, 1277, 1422, 1557];
const RV_AP = [556, 441];
const RV_SPREAD = 23;
class Verb {
  constructor(sr) {
    const sc = sr / 44100;
    const mk = (n) => new Float32Array(Math.max(8, Math.round(n * sc)));
    this.c = [0, 1].map((side) => RV_COMB.map((n) => ({ b: mk(n + side * RV_SPREAD), i: 0, z: 0, g: 0 })));
    this.a = [0, 1].map((side) => RV_AP.map((n) => ({ b: mk(n + side * RV_SPREAD), i: 0 })));
    this.time = -1;
  }
  setTime(time, sr) {
    if (time === this.time) return;
    this.time = time;
    for (const side of this.c) for (const c of side) c.g = Math.pow(10, -3 * c.b.length / (time * sr));
  }
  clear() {
    for (const side of this.c) for (const c of side) { c.b.fill(0); c.z = 0; }
    for (const side of this.a) for (const a of side) a.b.fill(0);
  }
  /** 1 サンプル。左右の響きを out へ書く */
  step(x, out) {
    const damp = 0.3;
    for (let s = 0; s < 2; s++) {
      let y = 0;
      for (const c of this.c[s]) {
        const o = c.b[c.i];
        c.z = o * (1 - damp) + c.z * damp;
        c.b[c.i] = x + c.z * c.g;
        if (++c.i >= c.b.length) c.i = 0;
        y += o;
      }
      y *= 0.25;
      for (const a of this.a[s]) {
        const o = a.b[a.i];
        a.b[a.i] = y + o * 0.5;
        if (++a.i >= a.b.length) a.i = 0;
        y = o - y;
      }
      out[s] = y;
    }
  }
}

/**
 * サブチャンネル 1 本ぶん。フィルタとコーラスと、カットオフのエンベロープを持つ。
 *
 * 決めごとは「フィルタはサブチャンネル 1 本につき 1 台」(docs/FILTER.md)。
 * 同じサブチャンネルの次の音は、前の音のフィルタの状態を引き継ぐ。モノシンセの粘りが
 * これで出る。和音('ceg')はサブチャンネルが 3 本なので、3 台に分かれる
 */
class Part {
  constructor(sr) {
    this.use = 0;
    this.lp = new LowPass();
    this.hp = new HighPass();
    this.ld = new Ladder();
    this.bp = new BandPass();
    this.nt = new Notch();
    this.h4 = new HighPass4();
    // コーラスの遅れ線。左右で 1 本ずつ
    this.dl = new Float32Array(Math.ceil(CH_MAX * sr) + 4);
    this.dr = new Float32Array(this.dl.length);
    this.di = 0;
    // ディレイの遅れ線。使うパッチが来たときに取る(1 秒ぶんあるので、要らない声には持たせない)
    this.eb = null;
    this.ew = 0;
    this.ez = 0;
    this.bus = new Float64Array(B);
    // リバーブ。使うパッチが来たときに取る
    this.rv = null;
    this.rvOn = 1;
    this.ro = [0, 0];
    // 声がサンプルごとに書く、いまの高さ(滑りとビブラートを含む)。0 は書かれていない
    this.hzb = new Float64Array(B);
    this.hz = 440;
    // 2 台目のフィルタ(filter2)。使うパッチが来たときに、種類ごとに 1 つずつ作る
    this.f2s = [];
    this.f2 = null;
    this.g2 = 0;
  }

  /** 使いはじめ。中の状態は全部まっさらにする */
  open(key, def) {
    this.use = 1;
    this.key = key;
    this.def = def;
    this.co = 0;
    this.pa = 0;
    this.pa0 = 0;
    this.vel = 0;
    this.fv = 1;
    this.n = 0;
    this.rel = 0;
    this.off = null;
    this.idle = 0;
    this.f0 = [this.lp, this.hp, this.ld, this.bp, this.nt, this.h4][def.kind] || this.lp;
    this.f0.reset();
    // 2 台目は動かないので、係数をここで 1 回だけ作る
    if (def.kind2 >= 0) {
      const K2 = [LowPass, HighPass, Ladder, BandPass, Notch, HighPass4][def.kind2];
      this.f2 = this.f2s[def.kind2] || (this.f2s[def.kind2] = new K2());
      this.f2.reset();
      this.g2 = warp(def.cut2, sampleRate);
    } else {
      this.f2 = null;
    }
    this.hz = 440;
    this.dl.fill(0);
    this.dr.fill(0);
    this.di = 0;
    if (this.eb) this.eb.fill(0);
    this.ew = 0;
    this.ez = 0;
    if (this.rv) this.rv.clear();
    this.rvOn = 1;
  }

  /**
   * 音符が来た。カットオフのエンベロープを頭から掛け直す(フィルタの状態は残す)。
   * 音量をフィルタのあとに置くパッチは、音量のエンベロープもここで掛け直す。
   * 立ち上がりはいまの音量から始める。0 へ戻すと、続けて弾いたときにぷつっと鳴る
   */
  hit(def, off, vel, op, rv) {
    this.def = def;
    // リバーブを使うか。呼ぶときに reverb: off / on と書けば、音色の既定(reverb.on)より勝つ
    this.rvOn = rv == null ? def.rvDef : rv;
    this.pa0 = this.pa;
    this.vel = vel;
    // 強さで開く量を変える。fenv.velocity が 1 なら、開く量が強さに比例する。
    // 開く量の並び(@steps)を書いていれば、強さの代わりにその値で決める
    this.fv = op != null ? op : 1 - def.fvel + def.fvel * vel;
    this.n = 0;
    this.rel = 0;
    this.off = off;
    this.idle = 0;
  }

  /** LFO の値(-1〜1)。表は 1 周ぶんで、1 秒に rate 周読む */
  lfoAt(def, t) {
    const tbl = def.lfoTbl;
    if (!tbl) return 0;
    const x = (t * def.lfoRate / def.lfoCycles) % 1;
    const i = (x < 0 ? x + 1 : x) * tbl.length;
    return tbl[Math.min(tbl.length - 1, i | 0)];
  }

  /** 溜めた声を 1 台のフィルタへ通し、コーラスを掛けて 2 本の出口へ足す */
  render(a, b, t0, sr, live) {
    const d = this.def;
    const dt = 1 / sr;
    const bus = this.bus;
    const dln = this.dl.length;
    const relAt = this.off == null ? B + 1 : Math.round((this.off - t0) * sr);
    for (let i = 0; i < B; i++) {
      if (!this.rel && i >= relAt) this.rel = 1;
      const age = this.n * dt;
      const now = t0 + i * dt;

      // ---- カットオフのエンベロープ(オクターブで持つ) ----
      if (this.rel) {
        this.co += (0 - this.co) * d.kfr;
      } else if (age < d.fat) {
        this.co = d.fa * this.fv * (age / d.fat);
      } else {
        this.co += (d.fa * this.fv * d.fsu - this.co) * d.kfd;
      }

      let cut = d.cutoff * Math.pow(2, this.co + d.lfoDepth * this.lfoAt(d, now));
      // ---- キートラッキング。A4(440Hz)を基準に、音の高さへついていく ----
      if (d.track > 0) {
        if (this.hzb[i] > 0) this.hz = this.hzb[i];
        cut *= Math.pow(this.hz / 440, d.track);
      }
      let y = this.f0.step(bus[i], warp(cut, sr), d.k, d.drive);
      if (this.f2) y = this.f2.step(y, this.g2, d.k2, 0);

      // ---- 音量をフィルタのあとに置くパッチ。サブチャンネルに 1 つの音量で絞る ----
      // 自己発振したフィルタは入力が無くても鳴るので、ここで絞らないと音符と関係なく鳴り続ける
      if (d.post) {
        if (this.rel) {
          this.pa += (0 - this.pa) * d.kar;
        } else if (age < d.aat) {
          this.pa = this.pa0 + (1 - this.pa0) * (age / d.aat);
        } else if (age < d.aat + d.ahd) {
          this.pa = 1;
        } else {
          this.pa += (d.asu - this.pa) * d.kad;
        }
        y *= this.pa * this.vel * d.level;
      }

      // ---- ディレイ。返りはループの中のローパスを毎回通るので、返るたびに暗くなる ----
      if (d.dlMix > 0) {
        if (!this.eb) this.eb = new Float32Array(Math.ceil(DELAY_MAX * sr) + 4);
        const n = this.eb.length;
        const w = this.eb[(this.ew - d.dlLen + n) % n];
        this.ez += (w - this.ez) * d.dlTone;
        this.eb[this.ew] = y + this.ez * d.dlFb;
        this.ew = (this.ew + 1) % n;
        y += this.ez * d.dlMix;
      }

      // ---- コーラス。左右へ逆に揺れる短い遅れ ----
      if (d.chMix > 0) {
        const half = d.chDepth / 2000;
        const sw = Math.sin(2 * Math.PI * d.chRate * now) * half;
        const read = (buf, sec) => {
          const at = this.di - sec * sr;
          const j = Math.floor(at);
          const fr = at - j;
          const p0 = ((j % dln) + dln) % dln;
          return buf[p0] * (1 - fr) + buf[(p0 + 1) % dln] * fr;
        };
        const wl = read(this.dl, CHORUS_BASE + half + sw);
        const wr = read(this.dr, CHORUS_BASE + half - sw);
        this.dl[this.di] = y;
        this.dr[this.di] = y;
        this.di = (this.di + 1) % dln;
        const dry = y * (1 - d.chMix / 2) * 0.5;
        // 左右の広がり(width)。リバーブと同じく、和はそのままに差だけを絞る。
        // 0 なら揺れは中央に収まり、左右へは動かない。既定は 1(2026-10-17)
        const cm = (wl + wr) * 0.5;
        const cs = (wl - wr) * 0.5 * d.chWidth;
        a[i] += dry + (cm + cs) * d.chMix / 2;
        b[i] += dry + (cm - cs) * d.chMix / 2;
      } else {
        a[i] += y * 0.5;
        b[i] += y * 0.5;
      }

      // ---- リバーブ。音色が持っていて、呼ぶときに切っていなければ掛ける ----
      if (d.rvMix > 0 && this.rvOn) {
        if (!this.rv) this.rv = new Verb(sr);
        this.rv.setTime(d.rvTime, sr);
        this.rv.step(y * 0.2, this.ro);
        // 左右の広がり(width)。左右の和(中央)はそのままに、差だけを絞る。0 なら響きは中央で鳴る
        const rm = (this.ro[0] + this.ro[1]) * 0.5;
        const rs = (this.ro[0] - this.ro[1]) * 0.5 * d.rvWidth;
        a[i] += (rm + rs) * d.rvMix;
        b[i] += (rm - rs) * d.rvMix;
      }
      this.n++;
    }
    // 声がいなくなったら、響きが消えるのを待って空ける。
    // すぐ空けると、レゾナンスの鳴きとディレイの返りが切れる
    if (live) this.idle = 0;
    else if ((this.idle += B) > sr * (0.2 + d.dlTail + (d.rvMix > 0 ? d.rvTime : 0))) this.use = 0;
  }
}

/**
 * 1 声ぶん(音符 1 つ)。発振器と音量のエンベロープだけを持つ。
 * フィルタは持たない — そこはサブチャンネル(Part)のもの
 */
class Voice {
  constructor() {
    this.on = 0;
  }

  /** 音符 1 つで鳴りはじめる。前の音から引き継ぐのは滑る元の高さだけ */
  begin(def, part, t, f, vel, off, from, mv) {
    // 呼ぶときに波形を渡していれば(analog::tomitaStringsAlt(wave: sine))、その波形で鳴らす。
    // 波形ごとの大きさの違いは、パッチの waveLevels でそろえる
    if (mv && mv.pw != null && ALT_WAVES[mv.pw]) {
      const [w, pwid] = ALT_WAVES[mv.pw];
      def = Object.assign(Object.create(def), {
        wave: w, pulseW: pwid ?? def.pulseW, level: def.level * (def.waveLv[mv.pw] ?? 1),
      });
    }
    this.on = 1;
    this.cutT = null;
    this.def = def;
    this.part = part;
    this.t0 = t;
    this.off = off;
    this.rel = 0;
    this.f = f;
    this.from = from;
    // MML から来た高さの動き(c*g の滑りと @m のビブラート)。音色のものより後に掛ける
    this.mv = mv;
    this.vel = vel;
    this.n = 0;
    this.pm = 0; this.ps = 0; this.pr = 0;
    this.d1 = 0.33; this.d2 = 0.66;
    this.amp = 0;
    this.bst = 0;   // くり返す山(amp.repeat)。くり返さないパッチでは amp と同じ
    this.tl = 0;    // 尾(amp.tail)
    this.se = 1;
    this.seed = ((Math.imul(def.seed || 1, 0x9e3779b1) ^ (f * 1000 | 0)) >>> 0) || 1;
    // ユニゾン。呼ぶときに本数を渡していれば(analog::tomitaStrings(voices: 3))そちらを使う
    const nu = Math.max(1, Math.min(UNI_MAX, Math.round(mv && mv.pu != null ? mv.pu : def.uni)));
    // 重ねられるのは、のこぎり波・矩形波・パルス・PWM・シンク・サイン波・三角波・
    // オクターブ重ねのこぎり波・半分のサイン波
    this.nu = [0, 1, 2, 5, 6, 8, 9, 10, 11].includes(def.wave) ? nu : 1;
    // 重ねる道を通すか。1 本でも、ふつうの道に無い波形(10 から)と、呼ぶときに波形を替えたものは通す
    this.uni = this.nu > 1 || def.wave === 10 || def.wave === 11 || (mv && mv.pw != null);
    // サイン波を並べる(partials)。1 本ずつ、位相と、減っていく大きさを持つ
    if (def.wave === 12) {
      if (!this.pp) { this.pp = new Float64Array(PT_MAX); this.pe = new Float64Array(PT_MAX); }
      for (let k = 0; k < PT_MAX; k++) { this.pp[k] = 0; this.pe[k] = 1; }
    }
    if (this.uni) {
      this.ut = uniTable(this.nu, def.uniSpread);
      if (!this.up) { this.up = new Float64Array(UNI_MAX); this.up2 = new Float64Array(UNI_MAX); }
      for (let k = 0; k < this.nu; k++) {
        this.up[k] = (this.noise() + 1) / 2;
        this.up2[k] = (this.noise() + 1) / 2;
      }
    }
  }

  /** 種を固定した白色雑音 */
  noise() {
    let a = this.seed;
    a ^= a << 13; a ^= a >>> 17; a ^= a << 5;
    this.seed = a >>> 0;
    return (this.seed % 1000000) / 500000 - 1;
  }

  /** 発振器と音量のエンベロープを、サブチャンネルの溜め場へ足す */
  render(bus, t0, sr) {
    const d = this.def;
    const dt = 1 / sr;
    const start = Math.max(0, Math.min(B - 1, Math.round((this.t0 - t0) * sr)));
    const relAt = this.off == null ? B + 1 : Math.round((this.off - t0) * sr);
    // 音量をフィルタのあとに置くパッチでは、ここの音量は声を空ける時期を決めるだけに使う。
    // 強さと level はサブチャンネルの音量が掛ける
    const peak = d.post ? 1 : this.vel * d.level;
    // 同じサブチャンネルに次の音が来たら、そこで止める(モノシンセと同じ)
    const end = this.cutT == null ? B : Math.max(0, Math.min(B, Math.round((this.cutT - t0) * sr)));
    for (let i = start; i < end; i++) {
      if (!this.rel && i >= relAt) this.rel = 1;
      const age = this.n * dt;
      const now = t0 + i * dt;

      // ---- 音量のエンベロープ ----
      // 山を amp.gap ごとに amp.repeat 回かけ直す(手拍子の「パッ」を何回か重ねるため)。
      // 流れ続けるノイズに音量だけを掛け直すので、パッごとにノイズの中身が違う。
      // ディレイで同じパッを写すと、同じ波形のくり返しが音の高さになってブザーに聞こえた
      // (2026-10-22)。くり返さないパッチ(repeat 1・tail 0)は前と同じ計算になる
      if (this.rel) {
        this.amp += (0 - this.amp) * d.kar;
      } else {
        const k = d.arep > 1 ? Math.min(d.arep - 1, Math.floor(age / d.agap)) : 0;
        const local = age - k * d.agap;
        if (local < d.aat) {
          this.bst = peak * (local / d.aat);
        } else if (local < d.aat + d.ahd) {
          // 上がりきったあと、下がりはじめるまで保つ(amp.hold)。
          // amp.holdDecay があれば、保つあいだもゆっくり減る(TR-808 のオープンハイハット。
          // 鳴りながら減って、そのあと切れる)。0 なら平らなまま(2026-10-22)
          this.bst = d.ahk < 1 ? Math.min(peak, this.bst) * d.ahk : peak;
        } else {
          this.bst += (peak * d.asu - this.bst) * d.kad;
        }
        // 尾。くり返しが終わるころまでに上がりきり、amp.tailDecay で減る
        if (d.atl > 0) {
          const rise = d.arep > 1 ? (d.arep - 1) * d.agap : d.aat;
          if (age < rise) this.tl = peak * d.atl * (age / rise);
          else this.tl += (0 - this.tl) * d.ktd;
        }
        this.amp = this.bst + this.tl;
      }

      // ---- 高さ。滑りとビブラート ----
      let hz = this.f;
      if (this.from > 0 && age < d.glide) {
        hz = this.from * Math.pow(this.f / this.from, age / d.glide);
      }
      // 叩いた瞬間に高い音から落ちる(バスドラム・タム)。dropHold 秒は頭の高さのまま、
      // そのあと書いた高さより上のぶん(Hz)が dropTime 秒ごとに 1/e へ減る。
      // TR-909 のバスドラムの録音が、頭の数 ms を保ってから、この形で落ちていた(docs/STUDY_TR909.md)
      if (d.dropR > 1) {
        const t = age - d.dropHold;
        hz *= 1 + (d.dropR - 1) * (t <= 0 ? 1 : Math.exp(-t / d.dropTime));
      }
      const mv = this.mv;
      // ポルタメント(c*g)。半音の数だけ、gl 秒かけて滑る
      if (mv.gs) {
        // 待ち(gd)のあいだは動かさない。そのあと gl 秒かけて滑る
        const k = Math.min(1, Math.max(0, (age - (mv.gd || 0)) / mv.gl));
        hz *= Math.pow(2, mv.gs * k / 12);
      }
      // 高さの並び(@bend)。bs 半音ずれたところから始めて、bl 秒かけて書いた高さへ戻る
      if (mv.bs) hz *= Math.pow(2, mv.bs * (1 - Math.min(1, age / mv.bl)) / 12);
      // 音をまたいで動かす高さ(@pitch)と揺れ(@vibrato)。点のあいだはまっすぐつなぐ。
      // 揺れは鳴りはじめではなく曲の時刻で回すので、音が変わっても途切れない
      if (mv.pc) hz *= Math.pow(2, curveAt(mv.pc, age) / 1200);
      if (mv.vc) hz *= Math.pow(2, curveAt(mv.vc, age) * Math.sin(2 * Math.PI * mv.vr * now) / 1200);
      // @m を書いてあれば、音色のビブラートの代わりにそちらを使う(@m0 なら揺らさない)
      // 音色を呼ぶときに深さを渡していれば(analog::tomitaWhistle(vibrato: 100))、音色の値の代わりに使う
      const vib = mv.vb ? mv.vb[0] : mv.pv != null ? mv.pv : d.vib;
      const vibRate = mv.vb ? mv.vb[1] : d.vibRate;
      const vibDelay = mv.vb ? mv.vb[2] : d.vibDelay;
      if (vib > 0 && age > vibDelay) {
        const grow = Math.min(1, (age - vibDelay) / 0.3);
        hz *= Math.pow(2, vib * grow * Math.sin(2 * Math.PI * vibRate * age) / 1200);
      }

      // 離したあとの声は書かない。重なった次の音の高さを上書きしないように
      if (!this.rel) this.part.hzb[i] = hz;

      // ---- 発振器 ----
      const dtm = hz / sr;
      let y = 0;
      if (d.wave === 4) {
        y = this.noise();
      } else if (d.wave === 12) {
        // サイン波を並べる。1 本ずつ、何倍の高さか・大きさ・立ち上がり・減り方を持つ。
        // System 55 で VCO を何本か VCA に通して混ぜるのと同じ作り(冨田勲風の鐘のため。2026-10-17)
        y = 0;
        for (let k = 0; k < d.ptN; k++) {
          let ph = this.pp[k] + dtm * d.ptR[k];
          ph -= Math.floor(ph);
          this.pp[k] = ph;
          const rise = d.ptA[k] > 0 ? Math.min(1, age / d.ptA[k]) : 1;
          y += d.ptL[k] * rise * this.pe[k] * Math.sin(2 * Math.PI * ph);
          this.pe[k] *= d.ptK[k];
        }
      } else if (d.wave === 3) {
        // のこぎり波 3 本。真ん中と、上下に 12 セントずつ。3 本ぶん大きくなるので下げる
        const u = Math.pow(2, 12 / 1200);
        this.pm += dtm; this.pm -= Math.floor(this.pm);
        this.d1 += dtm / u; this.d1 -= Math.floor(this.d1);
        this.d2 += dtm * u; this.d2 -= Math.floor(this.d2);
        y = 0.5 * (sawAt(this.pm, dtm) + sawAt(this.d1, dtm) + sawAt(this.d2, dtm));
      } else {
        // 親の位相。1 周したら子の位相を戻す(シンク)
        this.pm += dtm;
        let wrapped = false;
        if (this.pm >= 1) { this.pm -= 1; wrapped = true; }
        let ratio = 1;
        if (d.wave === 6) {
          // 音の頭で syncEnv オクターブ上へ飛び、フィルタのエンベロープの Decay で戻る
          this.se += (0 - this.se) * d.kfd;
          ratio = Math.max(1, d.sync) * Math.pow(2, d.syncEnv * this.se);
        }
        const dts = dtm * ratio;
        if (ratio > 1.0001) {
          if (wrapped) this.ps = this.pm * ratio - Math.floor(this.pm * ratio);
          else { this.ps += dts; this.ps -= Math.floor(this.ps); }
        } else this.ps = this.pm;
        const w = d.wave === 5
          ? Math.min(0.95, Math.max(0.05, d.width + d.pwmDepth * Math.sin(2 * Math.PI * d.pwmRate * now)))
          : (d.wave === 2 ? d.pulseW : 0.5);
        if (this.uni) {
          // ユニゾン。nu 本を少しずつずらして重ねる
          y = 0;
          const { rat, gain } = this.ut;
          for (let k = 0; k < this.nu; k++) {
            const dk = dtm * rat[k];
            let ph = this.up[k] + dk;
            let wrap = false;
            if (ph >= 1) { ph -= 1; wrap = true; }
            this.up[k] = ph;
            const dt = Math.min(0.5, dk);
            let v;
            if (d.wave === 5) {
              // PWM。幅を揺らす速さはそろえ、揺れの位置を声ごとにずらす
              const wk = Math.min(0.95, Math.max(0.05,
                d.width + d.pwmDepth * Math.sin(2 * Math.PI * d.pwmRate * now + k * 1.7)));
              v = pulseAt(ph, dt, wk);
            } else if (d.wave === 6) {
              // シンク。聞こえる側は UNI_SYNC 倍(パッチに osc.sync があればそちら)で回り、
              // 親が 1 周するたびに頭へ戻る
              const r = d.sync > 1 ? d.sync : UNI_SYNC;
              let q = this.up2[k] + dk * r;
              if (wrap) q = ph * r;
              q -= Math.floor(q);
              this.up2[k] = q;
              v = sawAt(q, Math.min(0.5, dk * r));
            } else if (d.wave === 10) {
              // オクターブ重ね。1 オクターブ下ののこぎり波を半分の大きさで足す
              let q = this.up2[k] + dk / 2;
              q -= Math.floor(q);
              this.up2[k] = q;
              v = (sawAt(ph, dt) + 0.5 * sawAt(q, dt / 2)) / 1.25;
            } else {
              v = d.wave === 1 ? pulseAt(ph, dt, 0.5)
                : d.wave === 2 ? pulseAt(ph, dt, d.pulseW)
                  : d.wave === 8 ? sineAt(ph)
                    : d.wave === 9 ? triAt(ph)
                      : d.wave === 11 ? halfSineAt(ph)
                        : sawAt(ph, dt);
            }
            y += gain[k] * v;
          }
        } else {
          y = (d.wave === 1 || d.wave === 2 || d.wave === 5)
            ? pulseAt(this.ps, Math.min(0.5, dts), w)
            : d.wave === 8 ? sineAt(this.ps)
              : d.wave === 9 ? triAt(this.ps)
                : sawAt(this.ps, Math.min(0.5, dts));
        }
        // リング。高さの何倍かのサイン波を掛ける
        if (d.wave === 7 && d.ring > 0) {
          this.pr += dtm * d.ringRatio;
          this.pr -= Math.floor(this.pr);
          y = y * (1 - d.ring) + y * Math.sin(2 * Math.PI * this.pr) * d.ring;
        }
      }
      bus[i] += (d.post ? y : y * this.amp) * d.oscLevel;
      this.n++;
    }
    // 離したあと、聞こえないところまで落ちたら空ける
    if (this.rel && this.amp < 1e-5) this.on = 0;
    if (end < B) this.on = 0;
  }
}

class AnalogBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.patch = {};
    for (const [k, d] of Object.entries(p.patches || {})) this.patch[k] = compileAnalog(d, sampleRate);
    this.voices = [];
    this.parts = [];
    for (let i = 0; i < V; i++) {
      this.voices.push(new Voice());
      this.parts.push(new Part(sampleRate));
    }
    this.events = [];
    this.at = 0;
    this.cutAt = -1;
    this.ob = new Float32Array(B);
    // 滑る元にする、パッチごとの前の音の高さ
    this.lastF = {};
    this.add(p.events || []);
    this.alive = true;
    this.port.onmessage = (e) => {
      // 片付けの合図。つないでいない処理器も、true を返すあいだ回り続けるので、
      // 外しただけでは止まらない(sound/filter.js と同じ決めごと)
      if (e.data && e.data.stop) { this.alive = false; return; }
      const q = e.data || {};
      if (q.patch) this.patch[q.patch] = compileAnalog(q.def, sampleRate);
      // 外から足したパッチ(registerAnalogPatch)。音符より先に入れる
      if (q.patches) {
        for (const [k, d] of Object.entries(q.patches)) {
          this.patch[k] = compileAnalog(d, sampleRate);
        }
      }
      if (q.add) this.add(q.add);
      if (q.cut) {
        this.events = [];
        this.at = 0;
        this.cutAt = 0;
      }
    };
  }

  /** 音符を足す。時刻順に並べ直して、済んだぶんは捨てる */
  add(list) {
    if (!list.length) return;
    const rest = this.events.slice(this.at).concat(list);
    rest.sort((a, b) => a.t - b.t);
    this.events = rest;
    this.at = 0;
  }

  /** 空いている声。無ければいちばん古いものを取る */
  pickVoice() {
    let old = 0, at = -1;
    for (let i = 0; i < V; i++) {
      const v = this.voices[i];
      if (!v.on) return v;
      if (at < 0 || v.t0 < old) { old = v.t0; at = i; }
    }
    return this.voices[at];
  }

  /**
   * そのサブチャンネルのフィルタ。鍵はパッチの名前とサブチャンネルの番号。
   * 同じ鍵なら前の音のものをそのまま使う(状態を引き継ぐ)
   */
  pickPart(key, def, off, vel, op, rv) {
    for (let i = 0; i < V; i++) {
      const p = this.parts[i];
      if (p.use && p.key === key) { p.hit(def, off, vel, op, rv); return p; }
    }
    for (let i = 0; i < V; i++) {
      const p = this.parts[i];
      if (!p.use) { p.open(key, def); p.hit(def, off, vel, op, rv); return p; }
    }
    // 空きが無ければ、いちばん長く音符の来ていないものを取り上げる
    let at = 0;
    for (let i = 1; i < V; i++) if (this.parts[i].idle > this.parts[at].idle) at = i;
    this.parts[at].open(key, def);
    this.parts[at].hit(def, off, vel, op, rv);
    return this.parts[at];
  }

  start(ev) {
    const def = this.patch[ev.p];
    if (!def) return;
    const f = (ev.f || 440) * Math.pow(2, def.oct);
    const from = def.glide > 0 ? (this.lastF[ev.p] || 0) : 0;
    const gs = ev.gs || 0;
    // 滑ったなら、次の音は滑り終わった高さから始める
    this.lastF[ev.p] = gs ? f * Math.pow(2, gs / 12) : f;
    const vel = Math.max(0, Math.min(1, ev.v == null ? 0.8 : ev.v));
    const off = ev.d == null ? null : ev.t + ev.d;
    const part = this.pickPart(ev.p + '/' + (ev.sc | 0), def, off, vel, ev.op == null ? null : ev.op,
      ev.rv == null ? null : ev.rv);
    // 音量をフィルタのあとに置くパッチは、サブチャンネルに音量が 1 つしかない。
    // 前の音は次の音の頭で止める。同じ時刻に始まる重ね(オクターブ重ねなど)は残す
    if (def.post) {
      for (const v of this.voices) {
        if (v.on && v.part === part && v.t0 < ev.t - 1e-6) v.cutT = ev.t;
      }
    }
    this.pickVoice().begin(def, part, ev.t, f, vel, off, from,
      { gs, gl: Math.max(0.01, ev.gl || 0), gd: ev.gd || 0,
        vb: ev.vb || null, pv: ev.pv == null ? null : ev.pv,
        pu: ev.pu == null ? null : ev.pu, pw: ev.pw == null ? null : ev.pw,
        bs: ev.bs || 0, bl: Math.max(0.01, ev.bl || 0),
        pc: ev.pc || null, vc: ev.vc || null, vr: ev.vr || 5.5 });
  }

  process(inputs, outputs) {
    const chs = outputs[0];
    const out = chs[0], rb = chs.length > 1 ? chs[1] : this.ob;
    out.fill(0);
    rb.fill(0);
    const sr = sampleRate;
    const t0 = currentTime;
    const tEnd = t0 + B / sr;
    while (this.at < this.events.length && this.events[this.at].t < tEnd) {
      this.start(this.events[this.at++]);
    }
    // サブチャンネルごとに、声を溜めてから 1 台のフィルタへ通す
    for (let i = 0; i < V; i++) {
      const part = this.parts[i];
      if (!part.use) continue;
      part.bus.fill(0);
      part.hzb.fill(0);
      let live = 0;
      for (let j = 0; j < V; j++) {
        const v = this.voices[j];
        if (v.on && v.part === part) { v.render(part.bus, t0, sr); live += v.on; }
      }
      part.render(out, rb, t0, sr, live);
    }
    // 止めている最中なら、ぷつっと鳴らないよう 10 ミリ秒で落とす
    if (this.cutAt >= 0) {
      const len = Math.max(1, Math.round(sr * 0.01));
      for (let i = 0; i < out.length; i++) {
        const k = Math.max(0, 1 - this.cutAt / len);
        out[i] *= k;
        rb[i] *= k;
        this.cutAt++;
      }
      if (this.cutAt >= len) {
        for (let i = 0; i < V; i++) { this.voices[i].on = 0; this.parts[i].use = 0; }
        this.cutAt = -1;
      }
    }
    if (chs.length === 1) for (let i = 0; i < out.length; i++) out[i] += rb[i];
    for (let c = 2; c < chs.length; c++) chs[c].fill(0);
    return this.alive;
  }
}
registerProcessor('${ANALOG_NODE}', AnalogBank);
`;

/**
 * パッチの一覧。パラメータの説明は `ANALOG_PARAMS`。
 *
 * もとは `samples/synth/presets.json` にあった、チップで真似るためのお手本。
 * エンジンの音色として鳴らすので、こちらが元になった(2026-10-09)
 */
export const ANALOG_PATCHES = {
  seqBass: {
    desc: 'Sequenced bass. Each sixteenth note opens the ladder filter and snaps shut, with the resonance singing on top.',
    wave: 'sawtooth', octave: 0,
    filter: { kind: 'ladder', cutoff: 150, resonance: 0.8, drive: 0.3 },
    fenv: { amount: 3.5, attack: 0.001, decay: 0.25, sustain: 0 },
    amp: { attack: 0.002, decay: 0.2, sustain: 0.6, release: 0.05 },
    level: 1.358,
  },
  delayBass: {
    desc: "Sequenced bass with a delay that fills the gaps, the trick heard on Donna Summer's I Feel Love. Play eighth notes and the single repeat lands on the sixteenth in between. The repeat is timed for 120 BPM.",
    wave: 'sawtooth', octave: 0,
    filter: { kind: 'ladder', cutoff: 150, resonance: 0.7, drive: 0.3 },
    fenv: { amount: 3.5, attack: 0.001, decay: 0.2, sustain: 0 },
    amp: { attack: 0.002, decay: 0.15, sustain: 0.4, release: 0.05 },
    delay: { mix: 0.7, time: 0.125, feedback: 0, tone: 3000 },
    level: 1.358,
  },
  synthBrass: {
    desc: 'Synth brass. Three detuned sawtooths, the filter swelling open a little after the note starts.',
    wave: 'detuned', octave: 0,
    filter: { kind: 'ladder', cutoff: 400, resonance: 0.2, drive: 0.1 },
    fenv: { amount: 2.5, attack: 0.08, decay: 0.6, sustain: 0.4 },
    amp: { attack: 0.03, decay: 0.3, sustain: 0.8, release: 0.2 },
    level: 0.566,
    chorus: { mix: 0.5, rate: 0.5, depth: 3 },
  },
  strings: {
    desc: 'Strings. A slow swell through a gentle low-pass, thickened by the chorus.',
    wave: 'detuned', octave: 0,
    filter: { kind: 'lowpass', cutoff: 700, resonance: 0.1, drive: 0 },
    fenv: { amount: 1.5, attack: 0.5, decay: 1.5, sustain: 0.6 },
    amp: { attack: 0.4, decay: 1, sustain: 0.9, release: 0.6 },
    level: 0.215,
    chorus: { mix: 1, rate: 0.4, depth: 4 },
  },
  pulseLead: {
    desc: 'Pulse lead. A narrow pulse with a late vibrato, bright enough to cut through.',
    wave: 'pulse', octave: 0,
    filter: { kind: 'lowpass', cutoff: 1800, resonance: 0.35, drive: 0.2 },
    fenv: { amount: 1.2, attack: 0.01, decay: 0.3, sustain: 0.5 },
    amp: { attack: 0.01, decay: 0.2, sustain: 0.85, release: 0.12 },
    level: 0.51,
    chorus: { mix: 0.3, rate: 0.6, depth: 2 },
    pitch: { vibrato: 15, rate: 5.5, delay: 0.3, glide: 0 },
  },
  noiseSnare: {
    desc: 'Snare. White noise through a resonant low-pass that snaps shut.',
    wave: 'noise', octave: 0,
    filter: { kind: 'lowpass', cutoff: 300, resonance: 0.5, drive: 0.2 },
    fenv: { amount: 4, attack: 0.001, decay: 0.12, sustain: 0 },
    amp: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.05 },
    level: 0.973,
  },
  laserZap: {
    desc: 'Laser zap. A ladder filter pushed past self-oscillation, its whistle diving from high to low on the filter envelope. The pitch comes from the filter, so it does not follow the note.',
    wave: 'noise', octave: 0,
    filter: { kind: 'ladder', cutoff: 150, resonance: 1.15, drive: 0 },
    fenv: { amount: 4.5, attack: 0.001, decay: 0.35, sustain: 0 },
    amp: { position: 'afterFilter', attack: 0.001, decay: 0.3, sustain: 0, release: 0.05 },
    osc: { level: 0.02 },
    level: 2.68,
  },
  noiseHat: {
    desc: 'Hi-hat. White noise with the lows taken away and a very short envelope.',
    wave: 'noise', octave: 0,
    filter: { kind: 'highpass', cutoff: 6000, resonance: 0.2, drive: 0 },
    fenv: { amount: 0.5, attack: 0.001, decay: 0.04, sustain: 0 },
    amp: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 },
    level: 0.528,
  },
  slowPad: {
    desc: 'Pad. A slow sine on the cutoff keeps it moving while the note is held.',
    wave: 'detuned', octave: 0,
    filter: { kind: 'lowpass', cutoff: 500, resonance: 0.25, drive: 0 },
    fenv: { amount: 2, attack: 1.2, decay: 2, sustain: 0.7 },
    amp: { attack: 0.8, decay: 2, sustain: 0.9, release: 1.2 },
    level: 0.311,
    lfo: { depth: 0.3, rate: 0.25, shape: 'sine' },
    chorus: { mix: 0.8, rate: 0.3, depth: 5 },
  },
  glideLead: {
    desc: 'Glide lead. Each note slides up from the one before it, with a wide vibrato.',
    wave: 'sawtooth', octave: 0,
    filter: { kind: 'ladder', cutoff: 1200, resonance: 0.45, drive: 0.25 },
    fenv: { amount: 1.5, attack: 0.02, decay: 0.4, sustain: 0.5 },
    amp: { attack: 0.02, decay: 0.3, sustain: 0.9, release: 0.15 },
    level: 0.818,
    chorus: { mix: 0.3, rate: 0.5, depth: 2 },
    pitch: { vibrato: 20, rate: 5, delay: 0.2, glide: 0.08 },
  },
  pwmStrings: {
    desc: 'PWM strings. The pulse width keeps moving, so one oscillator sounds like two.',
    wave: 'pwm', octave: 0,
    filter: { kind: 'lowpass', cutoff: 1400, resonance: 0.15, drive: 0 },
    fenv: { amount: 1, attack: 0.3, decay: 1, sustain: 0.6 },
    amp: { attack: 0.25, decay: 1, sustain: 0.9, release: 0.5 },
    level: 0.271,
    chorus: { mix: 0.3, rate: 0.4, depth: 3 },
    osc: { width: 0.5, pwmDepth: 0.35, pwmRate: 0.8 },
  },
  // PWM を 1 本だけ。フィルタは開けたまま、コーラスもリバーブも掛けない。
  // 波形メモリでは幅が揺れる形を持てないので、基本の音色の代わりにここへ置いた(2026-10-17)
  pwm: {
    desc: 'A bare PWM pulse: one oscillator whose width sweeps slowly around the square, with the filter left open and no chorus or reverb. The plain waveform, for when you want to shape it yourself. pwmStrings is the finished string sound.',
    wave: 'pwm', octave: 0,
    filter: { kind: 'lowpass', cutoff: 18000, resonance: 0, drive: 0 },
    fenv: { amount: 0, attack: 0.001, decay: 0.2, sustain: 0 },
    amp: { attack: 0.005, decay: 0.1, sustain: 1, release: 0.05 },
    level: 0.21,
    osc: { width: 0.5, pwmDepth: 0.35, pwmRate: 0.8 },
  },
  syncLead: {
    desc: 'Sync lead. A sawtooth hard-synced to the note, the ratio jumping up at each attack.',
    wave: 'sync', octave: 0,
    filter: { kind: 'lowpass', cutoff: 2500, resonance: 0.3, drive: 0.3 },
    fenv: { amount: 1, attack: 0.01, decay: 0.35, sustain: 0.4 },
    amp: { attack: 0.01, decay: 0.3, sustain: 0.85, release: 0.1 },
    level: 0.349,
    chorus: { mix: 0.2, rate: 0.6, depth: 2 },
    pitch: { vibrato: 12, rate: 5.5, delay: 0.25, glide: 0 },
    osc: { sync: 3, syncEnv: 1 },
  },
  ringBell: {
    desc: 'Ring bell. A sawtooth multiplied by a sine at a non-whole multiple, so it rings like metal.',
    wave: 'ring', octave: 0,
    filter: { kind: 'lowpass', cutoff: 3000, resonance: 0.2, drive: 0 },
    fenv: { amount: 2, attack: 0.001, decay: 0.5, sustain: 0.2 },
    amp: { attack: 0.002, decay: 0.8, sustain: 0.3, release: 0.4 },
    level: 0.658,
    chorus: { mix: 0.3, rate: 0.5, depth: 3 },
    osc: { ring: 0.8, ringRatio: 1.5 },
  },
  // 前の whistle。息の音が多く、風切り音のように聞こえるので名前を変えて残した(2026-10-16)
  whistleWind: {
    desc: 'Breathy whistle, like wind through a gap. White noise through a low-pass ringing just short of oscillation, the cutoff following the note, so a lot of breath comes along with the pitch. Notes hold as long as they are played. The vibrato comes in late.',
    wave: 'noise', octave: 0,
    // ラダーの山はカットオフより少し下に立つ(resonance 0.98 で 13 セント)。そのぶん上げて音程に合わせる
    filter: { kind: 'ladder', cutoff: 443.3, track: 1, resonance: 0.98, drive: 0 },
    fenv: { amount: 0, attack: 0.001, decay: 0.2, sustain: 0 },
    amp: { attack: 0.06, decay: 0.3, sustain: 0.9, release: 0.15 },
    level: 1,
    // ビブラートは 45 セント。25 では雑音のふらつき(±25 セント)に紛れて聞き取れなかった(2026-10-16)
    pitch: { vibrato: 45, rate: 5, delay: 0.25, glide: 0.04 },
  },

  // 口笛。動画(木村昭二の Moog System 55 ②)の頭 3 秒を測って寄せた(2026-10-16)。
  // ラダーを発振させ(resonance 1.05)、雑音を 1 割だけ入れて揺らす。
  // 0.98〜1 でレゾナンスを上げても息の音はほとんど変わらなかった(ローパスは
  // カットオフより下の雑音を全部通す)。雑音を全部入れると発振が崩れ、高さが
  // 100 セント以上ずれたので、入れる量を絞っている。動画の音は伸ばさず、鳴らしたそばから減っていき、
  // ビブラートは 6.5Hz・約 55 セント(測った値)と速く深く、すぐ掛かっていた。
  // 動画は音程より低いところの雑音がとても少なかった(300Hz〜1kHz で音程の音より 48dB 下。whistleWind は 22dB 下)。
  // ローパスだけでは残るので、使う側でチャンネルのハイパス(@f{highpass …})を重ねて削る。
  // バンドパスにする手も試したが、高いところの雑音が残り、音量も足りなかった
  tomitaWhistle: {
    desc: "Whistle in Isao Tomita's manner, matched to a recording of a Moog System 55 recreation. The ladder is pushed into oscillation so it sings a near-sine at the note by itself, roughened by a little noise. Each note swells in and fades away at once, with a fast, deep vibrato from the start. Put a high-pass on the channel to take out the noise under the pitch. whistleWind is the breathy one that holds.",
    wave: 'noise', octave: 0,
    osc: { level: 0.1 },
    filter: { kind: 'ladder', cutoff: 440, track: 1, resonance: 1.05, drive: 0 },
    fenv: { amount: 0, attack: 0.001, decay: 0.2, sustain: 0 },
    // 0.22 秒かけて上がり、すぐ減る。動画は 0.15〜0.24 秒かけて上がっていた。
    // 上がりきってから保つ形(amp.hold 0.15)も試したが、立ち上がりを長くするほうを採った。
    // 鳴らしているあいだ保つ形(サステインとリリース)は、聞いて気持ち悪いのでやめた(2026-10-16)
    amp: { attack: 0.22, decay: 0.4, sustain: 0, release: 0.15, position: 'afterFilter' },
    level: 4,
    // ビブラートは 80 セント。測った動画は 55 セントほどだが、聞くともっと深く、聞き比べて決めた
    pitch: { vibrato: 80, rate: 6.5, delay: 0.08, glide: 0.04 },
    dev: ['wip'],
  },
  // 冨田勲風のストリングス(2026-10-16)。木村昭二の動画「Moog System 55 冨田勲風 ⑤」を測って寄せた
  // (→ samples/mml_experiments/08_tomita_strings/)。のこぎり波を少しずつずらして重ね、
  // 0.17 秒かけて立ち上げ、4.8kHz より上を落とし、リバーブを掛ける。
  // 本数は呼ぶときに選べる(voices: 1〜20、既定 7)。冨田は 20 回以上重ねて録っていたが、
  // 3 本でも効果ははっきりあり、軽い。全体でリバーブを掛けるなら reverb: off で切る
  tomitaStrings: {
    desc: "Strings in Isao Tomita's manner, after a Moog System 55 recreation. Detuned sawtooths stacked and started at random phases, swelling in over 0.17 s, with the top above 4.8 kHz rolled off and a reverb. Choose how many with voices (1 to 20, 7 by default); even 3 gives the effect and costs far less. Turn the reverb off with reverb: off when the whole song gets one.",
    wave: 'sawtooth', octave: 0,
    osc: { unison: 7, spread: 12 },
    filter: { kind: 'lowpass', cutoff: 4800, resonance: 0, drive: 0 },
    fenv: { amount: 0, attack: 0.001, decay: 0.2, sustain: 0 },
    amp: { attack: 0.17, decay: 0.1, sustain: 1, release: 0.15 },
    reverb: { time: 2.5, mix: 0.3 },
    // 大きさは pulseLead にそろえた(1 音 o4 v15 c2、t120、リバーブなしで −18 LUFS ほど)。
    // 本数を変えると、3 本で +0.7dB、20 本で +2.3dB ほど動く
    level: 0.29,
    pitch: { vibrato: 0, rate: 5, delay: 0.3, glide: 0 },
  },
  // tomitaStrings の軽い版(2026-10-16)。違いは、既定が 3 本で、リバーブを既定で切ってあること
  // (reverb: on で掛かる)、波形を呼ぶときに選べること(wave: saw / square / sine / triangle /
  // pulse25 / pulse12 / pwm / octaveSaw / pulse33 / sync / halfSine。既定は矩形波)。
  // ほかのパートと一緒に鳴らす用。
  // 波形ごとの大きさは waveLevels でそろえた(1 音 o4 v15 c2、t120 で −18 LUFS)
  tomitaStringsAlt: {
    desc: "A lighter tomitaStrings with a choice of waveform: square by default, or saw, sine, triangle, pulse25, pulse12, pwm, octaveSaw, pulse33, sync or halfSine with wave. 3 voices by default (voices, 1 to 20) and the reverb off unless called with reverb: on. The square stack sounds hollow, like an organ or accordion section; saw is the tomitaStrings sound itself; sine and triangle are soft; the pulses are nasal and bright; pwm is the 80s synth string sound; octaveSaw is a string machine; sync leans towards a vocal choir; halfSine is round and chip-like. For parts that play alongside others.",
    wave: 'square', octave: 0,
    osc: { unison: 3, spread: 12 },
    filter: { kind: 'lowpass', cutoff: 4800, resonance: 0, drive: 0 },
    fenv: { amount: 0, attack: 0.001, decay: 0.2, sustain: 0 },
    amp: { attack: 0.17, decay: 0.1, sustain: 1, release: 0.15 },
    reverb: { time: 2.5, mix: 0.3, on: false },
    level: 0.31,
    waveLevels: { saw: 0.87, square: 1, sine: 0.71, triangle: 0.87, pulse25: 1.16, pulse12: 1.52,
      pwm: 1.07, octaveSaw: 1.07, pulse33: 1.08, sync: 0.86, halfSine: 0.67 },
    pitch: { vibrato: 0, rate: 5, delay: 0.3, glide: 0 },
    dev: ['wip'],
  },
  // 冨田勲風の鐘。木村昭二の動画「Moog System 55 冨田勲風 ①鐘の音色」の録音を測って作った(2026-10-17)。
  // 倍音はどの高さでも 1 : 1.035 : 1.618 : 2.437 : 3.233。整数倍でないので鐘に聞こえる。
  // 2 つの音を掛ける(リング)だけではこの比が揃わないので、サイン波を並べて足す(VCO を何本か混ぜるのと同じ)。
  // 1 秒に 4〜5dB ずつ長く減る(docs/STUDY_TOMITA.md)。
  // 立ち上がりは、はじめ録音の見かけどおり 50〜150ms にしたが、低い音で叩いた感じが消えた。
  // 測った範囲(43ms)でぼけた値だったと見て、すぐ立ち上がる形にした(上の山だけ 20ms。2026-10-17)
  tomitaBell: {
    desc: "Bell in Isao Tomita's manner, measured from a Moog System 55 recreation. Five sines at 1, 1.035, 1.618, 2.437 and 3.233 times the pitch: not a harmonic series, so it rings like a bell, and the lowest two beat slowly. Struck at once, every one fades over many seconds, ringing on after the note ends. A little reverb is built in; call it with reverb: off to leave it to the song.",
    wave: 'partials', octave: 0,
    osc: { partials: [
      { ratio: 1, level: 1, attack: 0.003, t60: 14 },
      { ratio: 1.035, level: 0.22, attack: 0.003, t60: 14 },
      { ratio: 1.618, level: 0.56, attack: 0.02, t60: 8 },
      { ratio: 2.437, level: 0.7, attack: 0.02, t60: 11 },
      { ratio: 3.233, level: 0.12, attack: 0.02, t60: 15 },
    ] },
    filter: { kind: 'lowpass', cutoff: 12000, resonance: 0, drive: 0 },
    fenv: { amount: 0, attack: 0.001, decay: 0.2, sustain: 0 },
    amp: { attack: 0.005, decay: 0.1, sustain: 1, release: 4 },
    reverb: { time: 2.5, mix: 0.2 },
    // 大きさは決めごとどおり。1 音(o4 b2、t60)を v15 で −22 LUFS
    level: 0.163,
    pitch: { vibrato: 0, rate: 5, delay: 0.3, glide: 0 },
    dev: ['wip'],
  },
  papipupe: {
    desc: "Talking voice, after the sound in Isao Tomita's records nicknamed the Papipupe man. A closed, ringing ladder filter snaps open in 30 ms, which sounds like a P. How far it opens follows the velocity, so a hard note says pa and a soft one says pu. One note at a time.",
    wave: 'sawtooth', octave: 0,
    filter: { kind: 'ladder', cutoff: 200, resonance: 0.9, drive: 0 },
    fenv: { amount: 5, attack: 0.03, decay: 0.2, sustain: 1, velocity: 1 },
    amp: { attack: 0.005, decay: 0.2, sustain: 1, release: 0.08, position: 'afterFilter' },
    level: 0.84,
    pitch: { vibrato: 20, rate: 4.5, delay: 0.35, glide: 0 },
    // 作業中の記号は外した(2026-10-16)。音色としてはこれで使う。
    // 曲ごとの細かい使われ方(高さの動き・開く量の並び)は、音色ではなく
    // 専用の記法で書く(→ docs/ENGINE_TODO.md の「1 音の中で高さを動かす」)
  },
  // ---- 試作(2026-10-16)。冨田勲の話を手がかりに耳で寄せた見当で、録音とは聞き比べていない。
  // 冨田の音と言えるものではないので、名前に冨田を付けない ----
  violinTrial: {
    desc: "Solo violin line, a trial. A sawtooth through a low-pass that partly follows the note. The filter opens a little as the bow bites, a wide vibrato comes in late, and each note slides from the one before.",
    wave: 'sawtooth', octave: 0,
    filter: { kind: 'lowpass', cutoff: 1500, track: 0.7, resonance: 0.25, drive: 0 },
    fenv: { amount: 1.5, attack: 0.08, decay: 0.4, sustain: 0.6 },
    amp: { attack: 0.08, decay: 0.3, sustain: 0.95, release: 0.25 },
    level: 0.28,
    pitch: { vibrato: 30, rate: 6, delay: 0.25, glide: 0.06 },
    // 2 軍。音としてはよいが、アナログの音色として作るには中途半端に生っぽい(2026-10-16)。
    // MML からは使えない。Filter Bench からは鳴らせる
    draft: true,
    dev: ['wip'],
  },
  // 冨田の合唱かどうかはまだ分からないので、聞こえ方で名前を付けた(前は choir。2026-10-16)
  aahPad: {
    desc: "Wordless choir. A pulse with a slowly moving width through a band-pass around 800 Hz, the region of an open ah, slow to swell and slow to fade.",
    wave: 'pwm', octave: 0,
    filter: { kind: 'bandpass', cutoff: 800, resonance: 0.45, drive: 0 },
    fenv: { amount: 0.3, attack: 0.6, decay: 1.5, sustain: 0.8 },
    amp: { attack: 0.5, decay: 1, sustain: 0.9, release: 1 },
    level: 1,
    chorus: { mix: 1, rate: 0.35, depth: 6 },
    pitch: { vibrato: 8, rate: 5, delay: 0.5, glide: 0 },
    osc: { width: 0.5, pwmDepth: 0.25, pwmRate: 3 },
    dev: ['wip'],
  },
  musicBox: {
    desc: "Music box. A ring-modulated tone with a click on the attack that dies away like a plucked steel tooth.",
    wave: 'ring', octave: 0,
    filter: { kind: 'lowpass', cutoff: 1800, track: 1, resonance: 0.1, drive: 0 },
    fenv: { amount: 1.5, attack: 0.001, decay: 0.12, sustain: 0 },
    amp: { attack: 0.001, decay: 1.2, sustain: 0, release: 0.6 },
    level: 0.56,
    osc: { ring: 0.35, ringRatio: 4 },
    // 2 軍。手本にした録音や資料が無く、耳で寄せただけなので積極的には採らない(2026-10-16)。
    // MML からは使えない。Filter Bench からは鳴らせる
    draft: true,
    dev: ['wip'],
  },
  flute: {
    desc: "Flute. A square through a low-pass that sits just above the note, so little is left but the fundamental. A small chiff at the start, a soft late vibrato and a short slide between notes.",
    wave: 'square', octave: 0,
    filter: { kind: 'lowpass', cutoff: 600, track: 1, resonance: 0.2, drive: 0 },
    fenv: { amount: 1, attack: 0.04, decay: 0.25, sustain: 0.3 },
    amp: { attack: 0.07, decay: 0.3, sustain: 0.9, release: 0.18 },
    level: 0.44,
    pitch: { vibrato: 18, rate: 5, delay: 0.3, glide: 0.03 },
    // 2 軍。手本にした録音や資料が無く、耳で寄せただけなので積極的には採らない(2026-10-16)。
    // MML からは使えない。Filter Bench からは鳴らせる
    draft: true,
    dev: ['wip'],
  },
  voxHumana: {
    desc: "Vox Humana style pad, after the Polymoog preset heard on Gary Numan's Cars and said to be on YMO's records. A pulse with a fast width wobble and a fast chorus gives the warbling, choir-like shimmer.",
    wave: 'pwm', octave: 1,
    filter: { kind: 'lowpass', cutoff: 1800, resonance: 0.2, drive: 0 },
    fenv: { amount: 0.6, attack: 0.3, decay: 0.8, sustain: 0.5 },
    amp: { attack: 0.12, decay: 0.6, sustain: 0.85, release: 0.7 },
    level: 0.331,
    chorus: { mix: 0.9, rate: 4.5, depth: 3 },
    osc: { width: 0.45, pwmDepth: 0.2, pwmRate: 5 },
  },
  polyBrass: {
    desc: 'Poly brass. Like synthBrass, written for chords: every note swells on its own.',
    wave: 'detuned', octave: 0,
    filter: { kind: 'ladder', cutoff: 350, resonance: 0.25, drive: 0.1 },
    fenv: { amount: 2.2, attack: 0.06, decay: 0.5, sustain: 0.45 },
    amp: { attack: 0.04, decay: 0.4, sustain: 0.8, release: 0.25 },
    level: 0.6,
    chorus: { mix: 0.5, rate: 0.5, depth: 3 },
  },
};

/**
 * パラメータの説明。`live` は鳴らしながら動かせるかどうかで、いまは全部 false。
 * `group` は、どのまとまりのものか
 */
export const ANALOG_PARAMS = {
  wave: {
    live: false, group: 'osc',
    desc: 'Source waveform before the filter.',
    values: {
      sawtooth: 'Sawtooth. All harmonics. The filter has the most to work on.',
      square: 'Square. Odd harmonics only, so filter sweeps sound thinner than on a sawtooth.',
      pulse: 'Pulse, 25% wide unless osc.width says otherwise. Nasal and brighter than a square.',
      detuned: 'Three sawtooths, the outer two 12 cents up and down. Thick and moving.',
      noise: 'White noise. No pitch. Through a resonant filter it whistles at the cutoff.',
      pwm: 'Pulse whose width keeps moving. Sounds like two detuned voices. Uses osc.width, osc.pwmDepth and osc.pwmRate.',
      sync: "Sawtooth hard-synced to a hidden master at the note's pitch. The audible pitch stays put while osc.sync sets the tone. Uses osc.sync and osc.syncEnv.",
      ring: 'Sawtooth multiplied by a sine at osc.ringRatio times the pitch. Metallic and bell-like. Uses osc.ring and osc.ringRatio.',
      sine: 'Sine. The note alone, with no harmonics. The filter has almost nothing to work on.',
      triangle: 'Triangle. Odd harmonics that fall away quickly. Soft and round, a little brighter than a sine.',
      octaveSaw: 'Sawtooth with another sawtooth an octave below at half the level. Full and warm at the bottom, like a string machine.',
      halfSine: 'The top half of a sine with the bottom flattened, as on the OPLL chip. The note plus its even harmonics only, round but fuller than a sine.',
      partials: 'Several sines added together, each at its own multiple of the pitch with its own level, rise and fade, as when several oscillators on a modular synth are mixed. Set them with osc.partials. Non-whole multiples ring like a bell.',
    },
  },
  octave: { live: false, group: 'osc', min: -2, max: 2, desc: 'Shifts every note by whole octaves.' },
  'filter.kind': {
    live: false, group: 'filter',
    desc: 'Which filter the voice runs through. See FILTER_FX in sound/filter.js.',
    values: {
      lowpass: 'Two-pole (12 dB/oct) low-pass.',
      highpass: 'Two-pole (12 dB/oct) high-pass.',
      ladder: 'Four-pole (24 dB/oct) low-pass in the style of the Moog ladder.',
      bandpass: 'Two-pole band-pass. Passes only a band around the cutoff.',
      notch: 'Two-pole notch. Removes a band around the cutoff.',
      highpass4: 'Four-pole (24 dB/oct) high-pass. Twice as steep as highpass.',
    },
  },
  'filter.cutoff': { live: false, group: 'filter', min: 20, max: 20000, unit: 'Hz', desc: 'Where the filter sits before any envelope opens it.' },
  'filter.track': { live: false, group: 'filter', min: 0, max: 1, desc: 'How far the cutoff follows the note, including glide and vibrato. 0 holds it still. At 1 it moves as far as the pitch does, so a cutoff of 440 Hz sits right on the note. The cutoff is set for A4 (440 Hz).' },
  'filter.resonance': { live: false, group: 'filter', min: 0, max: 1.2, desc: 'Peak at the cutoff. Near 1 the filter rings. Above 1 a ladder oscillates by itself at the cutoff; that range needs amp.position afterFilter, and is held at 1 otherwise.' },
  'filter.drive': { live: false, group: 'filter', min: 0, max: 1, desc: 'Saturation inside the filter. 0 is clean.' },
  'filter2.kind': {
    live: false, group: 'filter',
    desc: 'A second filter after the first, fixed in place: no envelope, LFO or key tracking moves it. Use it to cut the other side of a band, for example a high-pass for the peak and a low-pass above it. Left out, there is no second filter.',
    values: {
      lowpass: 'Two-pole (12 dB/oct) low-pass.',
      highpass: 'Two-pole (12 dB/oct) high-pass.',
      ladder: 'Four-pole (24 dB/oct) low-pass in the style of the Moog ladder.',
      bandpass: 'Two-pole band-pass.',
      notch: 'Two-pole notch.',
      highpass4: 'Four-pole (24 dB/oct) high-pass.',
    },
  },
  'filter2.cutoff': { live: false, group: 'filter', min: 20, max: 20000, unit: 'Hz', desc: 'Where the second filter sits. It does not move.' },
  'filter2.resonance': { live: false, group: 'filter', min: 0, max: 1, desc: 'Peak at the cutoff of the second filter.' },
  'fenv.amount': { live: false, group: 'fenv', min: 0, max: 6, unit: 'oct', desc: 'How far the cutoff opens, in octaves above the cutoff. 0 turns the envelope off.' },
  'fenv.attack': { live: false, group: 'fenv', min: 0.001, max: 4, unit: 's', desc: 'Seconds to open fully.' },
  'fenv.decay': { live: false, group: 'fenv', min: 0.001, max: 8, unit: 's', desc: 'Seconds to fall to the sustain level, roughly.' },
  'fenv.sustain': { live: false, group: 'fenv', min: 0, max: 1, desc: 'Where it stays while the note is held, as a share of amount.' },
  'fenv.velocity': { live: false, group: 'fenv', min: 0, max: 1, desc: 'How much the velocity scales how far the cutoff opens. 0 opens by the full amount every time. At 1 a soft note opens only a little and a hard note opens all the way.' },
  'amp.attack': { live: false, group: 'amp', min: 0.001, max: 4, unit: 's', desc: 'Seconds to full volume.' },
  'amp.hold': { live: false, group: 'amp', min: 0, max: 4, unit: 's', desc: 'Seconds to stay at full volume after the attack, before the decay begins. 0 starts the decay at once.' },
  'amp.holdDecay': { live: false, group: 'amp', min: 0, max: 30, unit: 's', when: [{ key: 'amp.hold', gt: 0 }], desc: 'Seconds for the volume to fall by 60 dB during the hold, so the sound fades a little while it rings and then the decay cuts it off. 0 keeps the hold flat.' },
  'amp.decay': { live: false, group: 'amp', min: 0.001, max: 8, unit: 's', desc: 'Seconds to fall to the sustain level, roughly.' },
  'amp.sustain': { live: false, group: 'amp', min: 0, max: 1, desc: 'Volume while the note is held.' },
  'amp.position': {
    live: false, group: 'amp',
    desc: 'Where the volume envelope sits. Only afterFilter lets a self-oscillating ladder (resonance above 1) stop with the note.',
    values: {
      beforeFilter: 'Each note has its own volume before the shared filter. Notes overlap freely. The default.',
      afterFilter: 'One volume per subchannel, after the filter, as in a mono synth. A new note on the subchannel cuts the one before.',
    },
  },
  'amp.repeat': { live: false, group: 'amp', min: 1, max: 8, desc: 'How many times the attack and decay start again at the start of a note, amp.gap apart. A hand clap uses about 4: a few people clapping slightly out of step. Each restart cuts into the running noise, so no two are the same. 1 plays the envelope once. Only for patches whose volume comes before the filter.' },
  'amp.gap': { live: false, group: 'amp', min: 0.002, max: 0.05, unit: 's', when: [{ key: 'amp.repeat', gt: 1 }], desc: 'Seconds between the restarts of amp.repeat. About 0.011 for a hand clap.' },
  'amp.tail': { live: false, group: 'amp', min: 0, max: 1, desc: 'Level of a second, slower envelope added on top, like the ring of a room after a clap. It rises over the restarts and then fades over amp.tailDecay. 0 turns it off.' },
  'amp.tailDecay': { live: false, group: 'amp', min: 0.01, max: 4, unit: 's', when: [{ key: 'amp.tail', gt: 0 }], desc: 'Seconds for the tail of amp.tail to fade, roughly.' },
  'amp.release': { live: false, group: 'amp', min: 0.001, max: 4, unit: 's', desc: 'Seconds to fade after the note ends, roughly.' },
  'lfo.depth': { live: false, group: 'lfo', min: 0, max: 4, unit: 'oct', desc: 'How far a slow wave moves the cutoff, in octaves. 0 turns it off.' },
  'lfo.rate': { live: false, group: 'lfo', min: 0.01, max: 20, unit: 'Hz', when: [{ key: 'lfo.depth', gt: 0 }], desc: 'Cycles per second.' },
  'lfo.shape': {
    live: false, group: 'lfo', when: [{ key: 'lfo.depth', gt: 0 }],
    desc: 'Shape of the slow wave. A name below, or a list of numbers from -1 to 1 for one cycle of your own shape.',
    values: {
      sine: 'Smooth up and down.',
      triangle: 'Straight lines up and down.',
      square: 'Jumps between two values.',
      sawtooth: 'Rises slowly, then drops at once.',
      sampleHold: 'Jumps to a random value once per cycle and holds it.',
    },
  },
  'chorus.mix': { live: false, group: 'chorus', min: 0, max: 1, desc: 'How much of the delayed sound is mixed in. 0 turns the chorus off. 1 is half dry, half delayed.' },
  'chorus.rate': { live: false, group: 'chorus', min: 0.05, max: 8, unit: 'Hz', when: [{ key: 'chorus.mix', gt: 0 }], desc: 'How fast the delays sway.' },
  'chorus.depth': { live: false, group: 'chorus', min: 0.5, max: 20, unit: 'ms', when: [{ key: 'chorus.mix', gt: 0 }], desc: 'How far the delays sway. More depth means more pitch wobble.' },
  'chorus.width': { live: false, group: 'chorus', min: 0, max: 1, when: [{ key: 'chorus.mix', gt: 0 }], desc: 'How far the sway spreads to the left and right. The two delays move in opposite directions, so at 1 (the default) the sound swings between the speakers; 0 keeps it in the middle. It only shows when the player asks for stereo.' },
  'reverb.mix': { live: false, group: 'reverb', min: 0, max: 1, desc: 'How loud the ring of a small reverb is against the dry sound. 0 turns it off. Calling the patch with reverb: off also turns it off, for when the whole song gets a reverb.' },
  waveLevels: { live: false, group: 'out', desc: 'Loudness multipliers, one per waveform chosen with wave when the patch is called (saw, square, sine, triangle, pulse25, pulse12, pwm, octaveSaw, pulse33, sync, halfSine), so that every choice comes out equally loud.' },
  'reverb.on': { live: false, group: 'reverb', values: { true: 'The reverb is on unless the patch is called with reverb: off.', false: 'The reverb is off unless the patch is called with reverb: on.' }, desc: 'Whether the reverb is used when the patch is called without saying.' },
  'reverb.time': { live: false, group: 'reverb', min: 0.1, max: 6, unit: 's', when: [{ key: 'reverb.mix', gt: 0 }], desc: 'Seconds for the ring to fade by 60 dB.' },
  'reverb.width': { live: false, group: 'reverb', min: 0, max: 1, when: [{ key: 'reverb.mix', gt: 0 }], desc: 'How far the ring spreads to the left and right. 1 (the default) is the full spread; 0 keeps it in the middle with the sound. It only shows when the player asks for stereo.' },
  'delay.mix': { live: false, group: 'delay', min: 0, max: 1, desc: 'How loud the repeats are against the dry sound. 0 turns the delay off.' },
  'delay.time': { live: false, group: 'delay', min: 0.01, max: 1, unit: 's', when: [{ key: 'delay.mix', gt: 0 }], desc: 'Seconds between repeats. It does not follow the tempo, so work it out from the tempo: a sixteenth note at 120 BPM is 0.125.' },
  'delay.feedback': { live: false, group: 'delay', min: 0, max: 0.95, when: [{ key: 'delay.mix', gt: 0 }], desc: 'How much of each repeat goes round again. 0 gives a single repeat. Near 0.95 the repeats last a long time.' },
  'delay.tone': { live: false, group: 'delay', min: 200, max: 20000, unit: 'Hz', when: [{ key: 'delay.mix', gt: 0 }], desc: 'Cutoff of a gentle low-pass inside the loop. Every repeat passes it again, so the repeats grow darker one by one, like a tape or analog delay.' },
  'pitch.vibrato': { live: false, group: 'pitch', min: 0, max: 100, unit: 'cent', desc: 'Vibrato depth. 0 turns it off.' },
  'pitch.rate': { live: false, group: 'pitch', min: 0.1, max: 12, unit: 'Hz', when: [{ key: 'pitch.vibrato', gt: 0 }], desc: 'Vibrato speed.' },
  'pitch.delay': { live: false, group: 'pitch', min: 0, max: 2, unit: 's', when: [{ key: 'pitch.vibrato', gt: 0 }], desc: 'Seconds before the vibrato starts. It then fades in over 0.3 seconds.' },
  'pitch.glide': { live: false, group: 'pitch', min: 0, max: 1, unit: 's', desc: "Seconds to slide from the pitch of this patch's previous note. 0 turns it off." },
  'pitch.drop': { live: false, group: 'pitch', min: 0, max: 48, unit: 'semitone', desc: 'How far above the written note each note starts, in semitones, falling back to the note at once. This is the thump of an analog bass drum or tom, whose pitch drops right after it is struck. 0 turns it off.' },
  'pitch.dropHold': { live: false, group: 'pitch', min: 0, max: 0.2, unit: 's', when: [{ key: 'pitch.drop', gt: 0 }], desc: 'Seconds the starting pitch is held before it falls.' },
  'pitch.dropTime': { live: false, group: 'pitch', min: 0.001, max: 2, unit: 's', when: [{ key: 'pitch.drop', gt: 0 }], desc: 'How fast the pitch falls: the part above the note shrinks to about a third (1/e) every this many seconds. Short is a tight click; longer is a deep, sweeping boom.' },
  'osc.level': { live: false, group: 'osc', min: 0, max: 1, desc: 'How loud the oscillator goes into the filter. 1 is full. Turn it down to hear a self-oscillating filter on its own.' },
  'osc.unison': { live: false, group: 'osc', min: 1, max: 20, desc: 'For the sawtooth and square waves, how many slightly detuned sawtooths sound at once. They start at random phases, the middle ones louder, so the beating never repeats the same way. The loudness stays the same whatever the number.' },
  'osc.spread': { live: false, group: 'osc', min: 0, max: 50, unit: 'cent', when: [{ key: 'osc.unison', gt: 1 }], desc: 'How far the outermost unison sawtooths are from the note, up and down. The ones in between are spread unevenly.' },
  'osc.width': { live: false, group: 'osc', min: 0.05, max: 0.95, desc: 'Pulse width for the pwm and pulse waves. 0.5 is a square. Left out, pwm centres on 0.5 and pulse is 0.25.' },
  'osc.pwmDepth': { live: false, group: 'osc', min: 0, max: 0.45, desc: 'How far the pulse width swings for the pwm wave. 0 holds it still.' },
  'osc.pwmRate': { live: false, group: 'osc', min: 0.05, max: 8, unit: 'Hz', desc: 'How fast the pulse width swings for the pwm wave.' },
  'osc.sync': { live: false, group: 'osc', min: 1, max: 32, desc: 'For the sync wave, how many times faster the audible saw runs than the master. 1 is no sync.' },
  'osc.syncEnv': { live: false, group: 'osc', min: 0, max: 4, unit: 'oct', desc: "For the sync wave, how many octaves the ratio jumps up at each attack, falling back with the filter envelope's decay." },
  'osc.ring': { live: false, group: 'osc', min: 0, max: 1, desc: 'For the ring wave, how much of the multiplied sound is used. 0 is the plain saw.' },
  'osc.partials': { live: false, group: 'osc', desc: 'For the partials wave, the sines to add: a list of up to 8, each { ratio, level, attack, t60 }. ratio is the multiple of the pitch, level its loudness (0 to 1), attack the seconds it takes to rise, and t60 the seconds it takes to fade by 60 dB on its own, while the note is held.' },
  'osc.ringRatio': { live: false, group: 'osc', min: 0.01, max: 32, desc: 'For the ring wave, the sine\'s pitch as a multiple of the note. Non-whole numbers sound like bells.' },
  level: { live: false, group: 'out', min: 0, max: 4, desc: 'How loud the voice is at full velocity. Set so that every patch measures the same loudness; see docs/FILTER.md. With amp.position afterFilter it is applied after the filter.' },
  seed: { live: false, group: 'out', min: 1, max: 9999, desc: 'Seed for the noise and the sample-hold shape. The same seed sounds the same every time.' },
};

/**
 * パッチの定義を、処理器が読む形へ畳む。
 *
 * エンベロープの Decay と Release は「戻りきるまでのおよその時間」で、
 * 時定数はその 3 分の 1。1 サンプルぶんの寄せ方(`k…`)をここで出しておく。
 * 刻みの速さは文脈の sampleRate で変わるので、処理器の中で畳む
 * (`ANALOG_CODE` にこの関数を埋めている)。だから外の名前は使わない
 */
export function compileAnalog(def, sr = 48000) {
  const num = (v, lo, hi, dflt) => {
    const x = Number(v);
    if (!Number.isFinite(x)) return dflt;
    return Math.min(hi, Math.max(lo, x));
  };
  // 種から決まる乱数。同じ種なら毎回同じ形になる
  const rng = (seed) => {
    let a = (seed | 0) || 1;
    return () => {
      a ^= a << 13; a ^= a >>> 17; a ^= a << 5;
      return ((a >>> 0) % 1000000) / 1000000;
    };
  };
  const WAVES = ['sawtooth', 'square', 'pulse', 'detuned', 'noise', 'pwm', 'sync', 'ring', 'sine', 'triangle', 'octaveSaw', 'halfSine', 'partials'];
  const KINDS = ['lowpass', 'highpass', 'ladder', 'bandpass', 'notch', 'highpass4'];
  const N = 1024;
  // LFO の形。`cycles` のあるものは 1 周ごとに値を取り直す
  const SHAPES = {
    sine: { make: (x) => Math.sin(2 * Math.PI * x) },
    triangle: { make: (x) => 1 - 4 * Math.abs(((x + 0.25) % 1) - 0.5) },
    square: { make: (x) => (x < 0.5 ? 1 : -1) },
    sawtooth: { make: (x) => 1 - 2 * x },
    sampleHold: { cycles: 8 },
  };
  const lfoTable = (shape, seed) => {
    if (Array.isArray(shape) && shape.length) {
      const per = Math.max(1, Math.round(N / shape.length));
      const data = new Float32Array(shape.length * per);
      shape.forEach((v, i) => data.fill(num(v, -1, 1, 0), i * per, (i + 1) * per));
      return { data, cycles: 1 };
    }
    const sh = SHAPES[shape] || SHAPES.sine;
    if (sh.cycles) {
      const r = rng(seed);
      const per = N / 8;
      const data = new Float32Array(sh.cycles * per);
      for (let c = 0; c < sh.cycles; c++) data.fill(r() * 2 - 1, c * per, (c + 1) * per);
      return { data, cycles: sh.cycles };
    }
    const data = new Float32Array(N);
    for (let i = 0; i < N; i++) data[i] = sh.make(i / N);
    return { data, cycles: 1 };
  };
  const f = def.filter || {};
  const fe = def.fenv || {};
  const am = def.amp || {};
  const lf = def.lfo || {};
  const ch = def.chorus || {};
  const pi = def.pitch || {};
  const os = def.osc || {};
  const dl = def.delay || {};
  const rv = def.reverb || {};
  const seed = num(def.seed, 1, 9999, 1);
  const { data, cycles } = lfoTable(lf.shape, seed);
  const depth = num(lf.depth, 0, 4, 0);
  // ディレイの返りが聞こえなくなるまで(秒)。戻りの量で 1000 分の 1 まで落ちる回数ぶん
  const delayTail = (time, fb) =>
    time * (1 + Math.ceil(Math.log(1e-3) / Math.log(Math.max(0.01, fb))));
  // 1 サンプルで目標へどれだけ寄るか。時定数 tau の 1 次の寄せ方
  const coef = (sec) => 1 - Math.exp(-1 / (sr * Math.max(0.001, sec) / 3));
  const kind = Math.max(0, KINDS.indexOf(String(f.kind || 'lowpass')));
  const dlMix = num(dl.mix, 0, 1, 0);
  const dlTime = num(dl.time, 0.01, 1, 0.25);
  const dlFb = num(dl.feedback, 0, 0.95, 0.3);
  const post = String(am.position || 'beforeFilter') === 'afterFilter';
  // ラダーの発振域(1〜1.2)は、音量をフィルタのあとに置くときだけ使える。
  // 前に置いたままだと、発振が音符と関係なく鳴り続ける
  const res = num(f.resonance, 0, kind === 2 && post ? 1.2 : 1, 0);
  // レゾナンスの係数は種類で意味が違う(2 極は減衰、ラダーは帰還の強さ)。
  // ラダーは sound/filter.js の Ladder.res と同じ対応(1 までは 3.96 倍、その先は 4.6 まで)
  const k = kind === 2
    ? (res <= 1 ? 3.96 * res : 3.96 + (4.6 - 3.96) * (res - 1) / 0.2)
    : Math.max(0.01, 2 - 2 * res);
  // 2 台目のフィルタ。1 台目のあとに直列に置く。カットオフは動かない(エンベロープも LFO も
  // 効かない)。1 台目で山を作り、2 台目で反対側を切る、という使い方のため(2026-10-23。tr808 のシンバル)
  const f2 = def.filter2 || null;
  const kind2 = f2 && f2.kind ? KINDS.indexOf(String(f2.kind)) : -1;
  const res2 = num(f2 && f2.resonance, 0, 1, 0);
  const k2 = kind2 === 2 ? 3.96 * res2 : Math.max(0.01, 2 - 2 * res2);
  return {
    wave: Math.max(0, WAVES.indexOf(String(def.wave || 'sawtooth'))),
    oct: num(def.octave, -2, 2, 0),
    kind,
    cutoff: num(f.cutoff, 20, 20000, 20000),
    kind2,
    cut2: num(f2 && f2.cutoff, 20, 20000, 20000),
    k2,
    track: num(f.track, 0, 1, 0),
    k,
    drive: num(f.drive, 0, 1, 0) * 4,
    fa: num(fe.amount, 0, 6, 0),
    fat: num(fe.attack, 0.001, 4, 0.001),
    fsu: num(fe.sustain, 0, 1, 0),
    fvel: num(fe.velocity, 0, 1, 0),
    kfd: coef(num(fe.decay, 0.001, 8, 0.2)),
    kfr: coef(num(am.release, 0.001, 4, 0.05)),
    post,
    aat: num(am.attack, 0.001, 4, 0.002),
    ahd: num(am.hold, 0, 4, 0),
    // 保つあいだに 1 サンプルで掛ける数。holdDecay 秒で 60dB 減る。0 なら 1(減らない)
    ahk: num(am.holdDecay, 0, 30, 0) > 0 ? Math.exp(-6.91 / (sr * num(am.holdDecay, 0.01, 30, 1))) : 1,
    arep: Math.round(num(am.repeat, 1, 8, 1)),
    agap: num(am.gap, 0.002, 0.05, 0.011),
    atl: num(am.tail, 0, 1, 0),
    ktd: coef(num(am.tailDecay, 0.01, 4, 0.2)),
    asu: num(am.sustain, 0, 1, 0.8),
    kad: coef(num(am.decay, 0.001, 8, 0.2)),
    kar: coef(num(am.release, 0.001, 4, 0.05)),
    lfoDepth: depth,
    lfoRate: num(lf.rate, 0.01, 20, 2),
    lfoTbl: depth > 0 ? data : null,
    lfoCycles: cycles,
    chMix: num(ch.mix, 0, 1, 0),
    chRate: num(ch.rate, 0.05, 8, 0.5),
    chDepth: num(ch.depth, 0.5, 20, 3),
    // 揺れの左右の広がり。既定は 1(広げる)。リバーブの width と同じ(2026-10-17)
    chWidth: num(ch.width, 0, 1, 1),
    dlMix,
    dlLen: Math.max(1, Math.round(dlTime * sr)),
    dlFb,
    // ループの中の 1 次のローパス。1 サンプルで寄る量
    dlTone: 1 - Math.exp(-2 * Math.PI * num(dl.tone, 200, 20000, 20000) / sr),
    dlTail: dlMix > 0 ? delayTail(dlTime, dlFb) : 0,
    vib: num(pi.vibrato, 0, 100, 0),
    vibRate: num(pi.rate, 0.1, 12, 5.5),
    vibDelay: num(pi.delay, 0, 2, 0.3),
    glide: num(pi.glide, 0, 1, 0),
    // 叩いた瞬間の高さ(書いた高さの何倍か)。0 半音なら 1 で、落ちない
    dropR: Math.pow(2, num(pi.drop, 0, 48, 0) / 12),
    dropHold: num(pi.dropHold, 0, 0.2, 0),
    dropTime: num(pi.dropTime, 0.001, 2, 0.02),
    width: num(os.width, 0.05, 0.95, 0.5),
    // pulse の幅。書かなければ 25%
    pulseW: num(os.width, 0.05, 0.95, 0.25),
    pwmDepth: num(os.pwmDepth, 0, 0.45, 0.35),
    pwmRate: num(os.pwmRate, 0.05, 8, 0.8),
    sync: num(os.sync, 1, 32, 1),
    syncEnv: num(os.syncEnv, 0, 4, 0),
    ring: num(os.ring, 0, 1, 0),
    ringRatio: num(os.ringRatio, 0.01, 32, 1.5),
    // サイン波を並べる(partials)。8 本まで。減り方は 1 標本ごとに掛ける倍率にしておく
    // (処理器へは compileAnalog だけを埋めるので、ここに書く)
    ...(() => {
      const list = Array.isArray(os.partials) ? os.partials.slice(0, 8) : [];
      const n = list.length;
      const ptR = new Float64Array(8), ptL = new Float64Array(8), ptA = new Float64Array(8), ptK = new Float64Array(8);
      list.forEach((q, k) => {
        ptR[k] = num(q && q.ratio, 0.01, 32, 1);
        ptL[k] = num(q && q.level, 0, 1, 1);
        ptA[k] = num(q && q.attack, 0, 5, 0);
        ptK[k] = Math.exp(-6.91 / (num(q && q.t60, 0.05, 60, 10) * sr));
      });
      return { ptN: n, ptR, ptL, ptA, ptK };
    })(),
    oscLevel: num(os.level, 0, 1, 1),
    uni: num(os.unison, 1, 20, 1),
    rvMix: num(rv.mix, 0, 1, 0),
    rvTime: num(rv.time, 0.1, 6, 2),
    // 響きの左右の広がり。既定は 1(広げる)。ステレオで出すかは再生する側が決める(2026-10-17)
    rvWidth: num(rv.width, 0, 1, 1),
    // 呼ぶときに何も書かなければリバーブを使うか。false なら reverb: on と書いたときだけ掛ける
    rvDef: rv.on === false ? 0 : 1,
    // 呼ぶときに波形を替えたときの大きさの掛け率。軸 wave の値の順(saw・square・sine・triangle・pulse25・pulse12)
    waveLv: ['saw', 'square', 'sine', 'triangle', 'pulse25', 'pulse12', 'pwm', 'octaveSaw', 'pulse33', 'sync', 'halfSine']
      .map((k) => num((def.waveLevels || {})[k], 0, 4, 1)),
    uniSpread: num(os.spread, 0, 50, 12),
    level: num(def.level, 0, 4, 0.25),
    seed,
  };
}

/**
 * 離してから消えるまでの長さ(秒)。焼くときの後ろの余白に使う。
 *
 * 音量の Release は時定数がその 3 分の 1 なので、聞こえなくなるまでは
 * おおよそ Release ぶん。コーラスの遅れと、少しの余白を足す
 */
export function analogTail(def) {
  const c = compileAnalog(def);
  // Release の 3 倍の時定数ぶんで聞こえなくなる。kar から秒へ戻す
  const rel = -1 / (48000 * Math.log(1 - c.kar)) * 3;
  const delay = c.chMix > 0 ? CHORUS_BASE + c.chDepth / 1000 : 0;
  return rel * 1.5 + delay + c.dlTail + (c.rvMix > 0 ? c.rvTime : 0) + 0.05;
}


// ---- エンジンへ自分を登録する ----
//
// このファイルを読み込むと `analog(…)` が使えるようになる。読み込まなければ
// エンジンには入らない(docs/SOUND_TOOL.md「音源ごとに分けて配る」)。縮めて 74KB ある。

/**
 * 減算方式のシンセの音色を入れる(`sound/analog.js`)。
 *
 * 家族は `analog` 1 つ。あとで FM や PCM のシンセが来ても名前がぶつからない。
 * チップには無い音なので、実機へ書き出すときは消える
 */
/**
 * 呼ぶときに渡せる数。音色を選んでいるあいだだけ効き、選び直すと音色の値に戻る。
 *
 * 音色そのものは名前で選ぶ(`analog::seqBass`)。かっこの中は引数だけにする
 * 決まりなので、音色を選ぶ軸は持たない(2026-10-18)。
 * 外から足すパッチ(`registerAnalogPatch`)にも同じ軸を着せる
 */
const ARGS = [{
  // `@{analog::tomitaWhistle(vibrato: 100)}`。`@m` を書けば `@m` が勝つ
  name: 'vibrato', min: 0, max: 100, unit: 'cent',
  desc: "Vibrato depth in cents, in place of the patch's own. The speed and delay stay the patch's. Left out, the patch's own depth is used.",
}, {
  // 重ねるのこぎり波の本数。ユニゾンを持つパッチ(tomitaStrings など)にだけ効く
  name: 'voices', min: 1, max: 20,
  desc: "For patches that stack detuned sawtooths (osc.unison), how many, in place of the patch's own number. Other patches ignore it.",
}, {
  // リバーブを使うか。全体でリバーブを掛けるときに、音色のものを切る
  name: 'reverb', min: 0, max: 1, words: { on: 1, off: 0 },
  desc: "For patches with their own reverb, on or off. Turn it off when the whole song gets a reverb. Left out, the patch's own setting is used. Other patches ignore it.",
}, {
  // 波形。呼ぶときに選べるのは tomitaStringsAlt だけ
  name: 'wave', min: 0, max: 10,
  words: { saw: 0, square: 1, sine: 2, triangle: 3, pulse25: 4, pulse12: 5,
    pwm: 6, octaveSaw: 7, pulse33: 8, sync: 9, halfSine: 10 },
desc: 'For tomitaStringsAlt, the waveform: saw, square, sine, triangle, pulse25, pulse12, pwm, octaveSaw, pulse33, sync or halfSine. Left out, the patch\'s own. Other patches ignore it.',
}];

/**
 * 外から足したパッチ。名前 → 中身(畳む前)。
 *
 * 最初から入っているもの(`ANALOG_PATCHES`)とは分けて持つ。あちらは音色の
 * 一覧として、仲間の値の並び・テスト・聞くページが読むので、あとから足した
 * ものを混ぜない。処理器へは、作るときと音符を流し込むたびの両方で渡す
 * (処理器は一度作ると使い回されるので、あとから足したパッチが届かないと無音になる)
 */
const USER_PATCHES = {};

/** USER_PATCHES の版。入れ直すたびに上がる。処理器へ渡し直すかを決めるのに使う */
const USER_VER = {};

/** 処理器ごとに、どの版まで渡したか。node → (名前 → 版) */
const SENT = new WeakMap();

/**
 * つまみ。音色の名前 → つまみの名前 → `{min, max, default, unit, desc, apply}`。
 * `apply(patch, value)` はパッチの写しを受け取り、値を入れたパッチを返す(2026-10-22)
 */
const KNOBS = {};

/** つまみを、呼ぶときに渡せる軸の形にする(registerFamily の params) */
function knobAxes(knobs) {
  return Object.entries(knobs || {}).map(([name, k]) => ({
    name, min: k.min, max: k.max, default: k.default,
    ...(k.unit ? { unit: k.unit } : {}), desc: k.desc ?? null,
  }));
}

/** つまみの書き方を確かめる。範囲・既定・説明が無いものは止める */
function checkKnobs(voice, knobs, needApply) {
  for (const [name, k] of Object.entries(knobs || {})) {
    if (!/^[a-z][A-Za-z0-9]*$/.test(name)) {
      throw new Error(`[ChpTnSnd] ${voice}: つまみ "${name}" は英字で始まる英数字で名乗ります`);
    }
    if (ARGS.some((a) => a.name === name)) {
      throw new Error(`[ChpTnSnd] ${voice}: つまみ "${name}" はアナログ音源の決まった軸と重なります`);
    }
    if (!(Number.isFinite(k.min) && Number.isFinite(k.max) && Number.isFinite(k.default))
      || k.min > k.default || k.default > k.max) {
      throw new Error(`[ChpTnSnd] ${voice}: つまみ "${name}" には min ≦ default ≦ max の数が要ります`);
    }
    if (needApply && typeof k.apply !== 'function') {
      throw new Error(`[ChpTnSnd] ${voice}: つまみ "${name}" にはパッチを変える apply(patch, value) が要ります`);
    }
  }
}

/**
 * つまみの値を入れたパッチの名前。値はその音色の既定に、呼ぶときに渡したものを重ねる。
 * 作ったパッチは名前ごとに覚えて使い回す。値の組み合わせが同じなら同じ名前になる
 * @param {string} voice 音色の名前
 * @param {object|null} vargs 呼ぶときに渡した値(重ねた音色から渡ってくるものも含む)
 * @returns {string} 鳴らすパッチの名前
 */
function knobPatch(voice, vargs) {
  const kn = KNOBS[voice];
  if (!kn) return voice;
  const vals = Object.entries(kn).map(([name, k]) => {
    const v = vargs && vargs[name] != null ? Number(vargs[name]) : k.default;
    return [name, Math.min(k.max, Math.max(k.min, Number.isFinite(v) ? v : k.default))];
  });
  const key = `${voice}|${vals.map(([n, v]) => `${n}=${+v.toFixed(6)}`).join(',')}`;
  if (!USER_PATCHES[key]) {
    let p = JSON.parse(JSON.stringify(USER_PATCHES[voice]));
    for (const [name, v] of vals) p = kn[name].apply(p, v) || p;
    USER_PATCHES[key] = p;
    USER_VER[key] = 1;
  }
  return key;
}

/**
 * ほかの音源セットの名前空間。アナログの音色がここへ入ると、名前と鳴り方が
 * 食い違う(`opll::myLead` がアナログで鳴ってしまう)
 */
const OTHER_SETS = ['opll', 'opl', 'opm', 'opn', 'opna', 'acoustic', 'electric'];

/**
 * 減算方式のシンセの音色を、外から足す。
 *
 * エンジンを直さずに自分の音色を持てる。中身の形は最初から入っているパッチと
 * 同じで、`wave` `osc` `filter` `fenv` `amp` `lfo` `chorus` `delay` `reverb`
 * `pitch` `level` を書ける。値の確かめと丸めは処理器の中(`compileAnalog`)でやる。
 *
 * ```js
 * registerAnalogPatch('analog::myLead', {
 *   wave: 'square', osc: { width: 0.5 },
 *   filter: { kind: 'lowpass', cutoff: 12000 },
 *   amp: { attack: 0.002, decay: 0.25, sustain: 0.4, release: 0.04 },
 *   level: 0.5,
 * }, { role: 'lead' });
 * ```
 *
 * 名前は `analog::` で始める。付けずに `myLead` と書いても足す
 * (→ docs/MML.md「拡張音源は `音源セット::音色` で名乗る」)。
 * アドオンの中からは、そのアドオンの名前空間で名乗ってよい(`mgs::lead`)。
 * 同じ名前がもうあれば止まる。わざと差し替えるときは `overwrite: true`。
 *
 * 鳴らしている最中に足してもよい。処理器へは音符と一緒に届く。
 * ライブでも `renderBGM()` でも同じ道を通るので、音は同じになる。
 *
 * @param {string} name 音色の名前。MML からは `@{analog::myLead}` で呼ぶ
 * @param {object} patch パッチの中身(`ANALOG_PATCHES` と同じ形)
 * @param {{role?:string, desc?:string, descJa?:string, overwrite?:boolean}} [opts]
 * @returns {number} 音色の番号(ふだんは名前で呼ぶので使わない)
 */
export function registerAnalogPatch(name, patch, opts = {}) {
  const voice = String(name).includes('::') ? String(name) : `analog::${name}`;
  // ほかの音源セットの名前空間は使えない。何で鳴るのかが名前から食い違う。
  // アドオンは自分の名前空間を持つので、そちらは通す(`mgs::lead`。
  // → docs/ADDON.md。2026-10-20)
  if (OTHER_SETS.includes(voice.split('::')[0])) {
    throw new Error(`[ChpTnSnd] "${name}" はほかの音源セットの名前空間です。`
      + '"analog::" か、アドオン自身の名前空間で名乗ってください');
  }
  if (!patch || typeof patch !== 'object') {
    throw new Error(`[ChpTnSnd] ${voice} のパッチがありません(中身のオブジェクトを渡してください)`);
  }
  checkKnobs(voice, opts.knobs, true);
  USER_PATCHES[voice] = patch;
  USER_VER[voice] = (USER_VER[voice] || 0) + 1;
  if (opts.knobs) KNOBS[voice] = opts.knobs; else delete KNOBS[voice];
  // 引数の軸は最初から入っているものと同じ。つまみがあれば後ろに並べる。入れ直しは黙って通す
  try { registerFamily(voice, { desc: opts.desc ?? null, params: [...ARGS, ...knobAxes(opts.knobs)], overwrite: true }); }
  catch (e) { /* すでに入っている */ }
  const { knobs, ...rest } = opts;
  return registerAnalog(voice, { patch: voice }, rest);
}

/**
 * プリセット。元の音色の、つまみの既定だけを変えたものに名前を付ける。
 *
 *     registerAnalogPreset('tr808::bassDrumLong', 'tr808::bassDrum', { decay: 3 });
 *
 * 呼ぶときに値を渡せば、その値が勝つ(`@{tr808::bassDrumLong(tone: 0.8)}`)。
 * 元の音色は、つまみを持つパッチ(registerAnalogPatch)でも、つまみを持つ
 * 重ねた音色(registerLayer の knobs)でもよい(2026-10-22)
 *
 * @param {string} name 名前
 * @param {string} of 元の音色の名前
 * @param {Object<string,number>} values つまみの既定にする値
 * @param {object} [opts] registerAnalogPatch / registerLayer と同じもの(desc・role・tags・dev など)
 */
export function registerAnalogPreset(name, of, values = {}, opts = {}) {
  const at = findWave(of);
  const base = at >= 0 ? WAVEFORMS[at] : null;
  if (!base) throw new Error(`[ChpTnSnd] ${name}: 元の音色 "${of}" がありません`);
  const reset = (knobs) => {
    const out = {};
    for (const [k, v] of Object.entries(values)) {
      if (!knobs || !knobs[k]) throw new Error(`[ChpTnSnd] ${name}: "${of}" につまみ "${k}" はありません`);
    }
    for (const [k, kn] of Object.entries(knobs || {})) {
      out[k] = { ...kn, default: values[k] != null ? Math.min(kn.max, Math.max(kn.min, Number(values[k]))) : kn.default };
    }
    return out;
  };
  if (base.kind === 'layer') {
    return registerLayer(name, {
      role: base.role, genre: base.genre, tags: base.tags, dev: base.dev, ...opts,
      layers: base.layers.map((m) => ({ wave: WAVEFORMS[m.wave].name, gain: m.gain, semi: m.semi,
        cents: m.cents, delay: m.delay, follow: m.follow, env: m.env })),
      knobs: reset(base.knobSpec),
    });
  }
  const voice = String(of).includes('::') ? String(of) : `analog::${of}`;
  if (!USER_PATCHES[voice]) throw new Error(`[ChpTnSnd] ${name}: "${of}" はつまみを持つアナログの音色ではありません`);
  return registerAnalogPatch(name, USER_PATCHES[voice], {
    role: base.role, genre: base.genre, tags: base.tags, dev: base.dev, ...opts,
    knobs: reset(KNOBS[voice]),
  });
}

function registerAnalogVoices() {
  const ROLE = {
    seqBass: 'bass', synthBrass: 'chord', strings: 'chord', pulseLead: 'lead',
    noiseSnare: 'perc', noiseHat: 'perc', slowPad: 'chord', glideLead: 'lead',
    pwm: 'lead', pwmStrings: 'chord', syncLead: 'lead', ringBell: 'lead', tomitaWhistle: 'lead', tomitaStrings: 'chord', tomitaStringsAlt: 'chord', tomitaBell: 'counter', whistleWind: 'lead', papipupe: 'lead', violinTrial: 'lead', aahPad: 'chord', musicBox: 'lead', flute: 'lead', polyBrass: 'chord',
    voxHumana: 'chord', delayBass: 'bass', laserZap: 'perc',
  };
  // 2 軍の音色(draft)は登録しない。値は残してあり、Filter Bench からは鳴らせる(acoustic と同じ扱い)
  for (const [name, def] of Object.entries(ANALOG_PATCHES)) {
    if (def.draft) continue;
    const voice = `analog::${name}`;
    // 音色 1 つにつき、引数の軸を持たせる。数の軸は音色を増やさない
    try { registerFamily(voice, { desc: def.desc, params: ARGS }); }
    catch (e) { /* すでに入っている */ }
    registerAnalog(voice, { patch: name }, { role: ROLE[name], desc: def.desc, dev: def.dev });
  }
}

/**
 * 減算方式のシンセで鳴らす音符を、常駐の処理器へ渡す形にする。
 *
 * 音量は 0〜1 の強さで渡す。処理器の中で叩く強さとして使うので、振幅を渡すと
 * 二重に掛かる。タイでつないだ音は先頭だけ出して、長さはつながり全体(`tieSpan`)
 */
function analogEvent(ev, wf, freq, amp, t0, t1) {
  // つながりの続きは出さない。先頭で出してある
  if (ev.legato) return null;
  return {
    // つまみを持つ音色は、値を入れたパッチを鳴らす
    t: t0, p: KNOBS[wf.patch] ? knobPatch(wf.patch, ev.vargs) : wf.patch, f: freq,
    // ポルタメント(`c*e`)。鳴っている音を、音符の長さ(gate)をかけて滑らせる。
    // 半音の数で渡す(生音と同じ形。2026-10-16)
    ...(ev.glide > 0
      ? { gs: 12 * Math.log2(ev.glide / ev.freq),
        // 滑っている長さ。書いていなければ音符いっぱい
        gl: Math.max(0.01, ev.glideFor > 0 ? ev.glideFor : (ev.gate ?? (t1 - t0))),
        // 滑りはじめるまでの待ち(秒)。前の音を伸ばしてから滑るときに付く
        ...(ev.glideAt > 0 ? { gd: ev.glideAt } : {}) }
      : {}),
    // 開く量の並び(`@steps`)の値。0〜1。強さの代わりに、フィルタの開く量を決める
    ...(ev.bright != null ? { op: ev.bright } : {}),
    // 高さの並び(`@bend`)の値。半音の数にして、音符の長さ(gate)をかけて戻す
    ...(ev.bend ? { bs: ev.bend / 100, bl: Math.max(0.01, ev.gate ?? (t1 - t0)) } : {}),
    // 音をまたいで動かす高さ(`@pitch`)と揺れの深さ(`@vibrato`)。[秒, セント] の点の並び。
    // 揺れの速さは書かなければ VIB_SPEED
    ...(ev.pitchCurve ? { pc: ev.pitchCurve } : {}),
    ...(ev.vibCurve ? { vc: ev.vibCurve, vr: ev.vibCurveRate ?? VIB_SPEED } : {}),
    // 音色を呼ぶときに渡したビブラートの深さ(セント)。音色の値の代わりに使う
    ...(ev.vargs && ev.vargs.vibrato != null ? { pv: ev.vargs.vibrato } : {}),
    // 重ねる本数と、リバーブを使うか(呼ぶときに渡したもの)
    ...(ev.vargs && ev.vargs.voices != null ? { pu: ev.vargs.voices } : {}),
    ...(ev.vargs && ev.vargs.reverb != null ? { rv: ev.vargs.reverb } : {}),
    ...(ev.vargs && ev.vargs.wave != null ? { pw: ev.vargs.wave } : {}),
    // ビブラート(`@m`)。深さ(セント)・速さ(Hz)・遅れ(秒)にして渡す。
    // 速さを書かなければ VIB_SPEED。ふつうの発振器と同じ
    ...(ev.vib ? { vb: [
      ev.vib.depth,
      ev.vib.speed != null ? ev.vib.speed : VIB_SPEED,
      (ev.vib.delay || 0) * TONE_FRAME,
    ] } : {}),
      v: Math.max(0, Math.min(1, (ev.vol ?? 0) / 15)),
      d: Math.max(0.001, ev.tieSpan ?? (t1 - t0)),
      // ロールの終わりの強さ(生音の区間の `@to`)。始まりの v から少しずつ変える
      ...(ev.rollTo != null ? { v2: Math.max(0, Math.min(1, ev.rollTo / 15)) } : {}),
      // 右ペダルを踏んでいる区間(時計の秒)。生音の区間の `@ped`。同じパッチの声すべてに効く
      ...(ev.pedals && ev.pedBase != null ? { pd: ev.pedals.map(([a, b]) => [ev.pedBase + a, ev.pedBase + b]) } : {}),
      // サブチャンネルの番号。和音の中の何番目か(書いた順)。
      // フィルタをサブチャンネル 1 本につき 1 台持たせるのに使う。
      // 重ねたもの(オクターブ重ね・デチューン・エコーの写し)は元の音と
      // 同じ番号になる — 厚くするためのものなので、親と同じフィルタを通る
      sc: ev.sub | 0,
  };
}

/** 処理器の登録に渡すもの。コーラスが左右へ広がるので、生音と同じ 2 本で出す */
export const ANALOG_CHIP = {
  kind: 'analog',
  node: ANALOG_NODE,
  code: ANALOG_CODE,
  voices: ANALOG_VOICES,
  buses: 2,
  event: analogEvent,
  options: (list) => ({ numberOfInputs: 0, outputChannelCount: [2],
    // 畳むのは処理器の中。刻みの係数が文脈の sampleRate で変わるので、
    // そこで畳まないとエンベロープの時間がずれる
    processorOptions: { events: list,
      patches: { ...ANALOG_PATCHES, ...USER_PATCHES } } }),
  // 外から足したパッチ。音符を流し込むたびに、その処理器へまだ渡していないものを渡す
  // (USER_PATCHES)。つまみの値ごとにパッチが増えるので、毎回全部を作り直させない
  extra: (node) => {
    let sent = SENT.get(node);
    if (!sent) { sent = new Map(); SENT.set(node, sent); }
    const out = {};
    for (const [k, d] of Object.entries(USER_PATCHES)) {
      if (sent.get(k) === USER_VER[k]) continue;
      out[k] = d;
      sent.set(k, USER_VER[k]);
    }
    return out;
  },
};

registerChipKind(ANALOG_CHIP.kind, ANALOG_CHIP);
registerAnalogVoices();
// 重ねる相手が増えたので、合成音色を並べ直す。組み合わせによっては、この音源が
// 入っていないと作れないものがある(`layerKickAir` は OPLL のバスドラを使う)
registerDefaultLayers();
// 分けて読み込んでも、エンジンのプリセットとして並ぶようにする
sealPresets();
