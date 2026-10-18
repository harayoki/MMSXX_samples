var MMSXX;((MMSXX||={}).sound||={}).analog=(()=>{var R=globalThis.MMSXX.sound.core["filter.js"],lt=R.FILTERS,ct=R.FILTER_CODE,z=R.FILTER_CORE,dt=R.filterOptions;var t=globalThis.MMSXX.sound.core["mml.js"],pt=t.AY_ENV_SHAPES,ut=t.AY_MODES,vt=t.DEFAULT_ENV,ft=t.DEFAULT_WAVE,mt=t.DEV_MARKS,wt=t.DRUM_FREQ,gt=t.ENVELOPES,xt=t.HEAD_MARK,yt=t.NES_MODES,kt=t.NOISE_VARIANTS,bt=t.ROLES,Mt=t.SPECIALS,At=t.STEALS,St=t.TUNINGS,Et=t.VCURVES,Tt=t.VIB_MAX,V=t.VIB_SPEED,Rt=t.WAVE,_t=t.WAVEFORMS,Ot=t.badVoice,Vt=t.compileMML,Pt=t.countOldStyle,Ft=t.describeVoice,Nt=t.dutyLfoAt,Lt=t.dutyMoves,Dt=t.envRunLen,Bt=t.envSec,It=t.findWave,Ct=t.firstTempo,zt=t.isSystemMark,Wt=t.listEnvelopes,qt=t.listVoiceFamilies,Ut=t.listVoices,Ht=t.metaOf,Xt=t.noOldDescName,jt=t.readBundles,Gt=t.readChordSets,Yt=t.readDirectives,Kt=t.readDrums,$t=t.readVoices,Jt=t.readWaves,Qt=t.registerAY,W=t.registerAnalog,Zt=t.registerBaked,te=t.registerBeep,ee=t.registerBrass,se=t.registerCoreFamilies,ae=t.registerDrumSlots,ie=t.registerEnvelope,oe=t.registerFDS,ne=t.registerFM,q=t.registerFamily,re=t.registerLayer,le=t.registerModal,ce=t.registerNES,de=t.registerNoiseVariants,he=t.registerOPNARhythm,pe=t.registerPCE,ue=t.registerSCC,ve=t.registerVoice,fe=t.registerVoiceDetail,me=t.registerVoiceSyntax,we=t.registerWave,ge=t.roleOf,U=t.sealPresets,xe=t.shareBundles,ye=t.slideAt,ke=t.songParts,be=t.splitParts,Me=t.splitVoices,Ae=t.stealOf,Se=t.toneOf,Ee=t.validateMML,Te=t.voiceArgs,Re=t.voiceName,_e=t.voiceNameProblem,Oe=t.voiceNums,Ve=t.volFromGain,Pe=t.volGainOf,Fe=t.warn,Ne=t.waveMeta,Le=t.waveRole,De=t.waveSteal;var P=globalThis.MMSXX.sound.core["layerpresets.js"],Ie=P.LAYER_PRESETS,Ce=P.layerPairFamily,H=P.registerDefaultLayers;var y=globalThis.MMSXX.sound.core["tones.js"],X=y.TONE_FRAME,We=y.TONE_PRESETS,qe=y.readTable,Ue=y.registerDefaultTones,He=y.registerTone;var c=globalThis.MMSXX.sound.core["audio.js"],je=c.ChipTuneSound,Ge=c.SE_SYS_PAUSE,Ye=c.SOUND_VERSION,Ke=c.ampFor,$e=c.encodeWAV,Je=c.fadeGain,Qe=c.freqAt,Ze=c.psgDiv,j=c.registerChipKind,ts=c.snapVol,es=c.volAt;var Y="mmsxx-analog",K=16,st=.012,at=1;var it=`${z}
const compileAnalog = ${ot};
const V = ${K};
const B = 128;
const CHORUS_BASE = ${st};
const CH_MAX = 0.064;
const DELAY_MAX = ${at};
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
const UNI_MAX = 20;
const PT_MAX = 8;
const ALT_WAVES = [[0, null], [1, null], [8, null], [9, null], [2, 0.25], [2, 0.125],
[5, null], [10, null], [2, 1 / 3], [6, null], [11, null]];
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
this.dl = new Float32Array(Math.ceil(CH_MAX * sr) + 4);
this.dr = new Float32Array(this.dl.length);
this.di = 0;
this.eb = null;
this.ew = 0;
this.ez = 0;
this.bus = new Float64Array(B);
this.rv = null;
this.rvOn = 1;
this.ro = [0, 0];
this.hzb = new Float64Array(B);
this.hz = 440;
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
this.f0 = [this.lp, this.hp, this.ld, this.bp, this.nt][def.kind] || this.lp;
this.f0.reset();
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
this.rvOn = rv == null ? def.rvDef : rv;
this.pa0 = this.pa;
this.vel = vel;
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
if (this.rel) {
this.co += (0 - this.co) * d.kfr;
} else if (age < d.fat) {
this.co = d.fa * this.fv * (age / d.fat);
} else {
this.co += (d.fa * this.fv * d.fsu - this.co) * d.kfd;
}
let cut = d.cutoff * Math.pow(2, this.co + d.lfoDepth * this.lfoAt(d, now));
if (d.track > 0) {
if (this.hzb[i] > 0) this.hz = this.hzb[i];
cut *= Math.pow(this.hz / 440, d.track);
}
let y = this.f0.step(bus[i], warp(cut, sr), d.k, d.drive);
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
if (d.dlMix > 0) {
if (!this.eb) this.eb = new Float32Array(Math.ceil(DELAY_MAX * sr) + 4);
const n = this.eb.length;
const w = this.eb[(this.ew - d.dlLen + n) % n];
this.ez += (w - this.ez) * d.dlTone;
this.eb[this.ew] = y + this.ez * d.dlFb;
this.ew = (this.ew + 1) % n;
y += this.ez * d.dlMix;
}
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
const cm = (wl + wr) * 0.5;
const cs = (wl - wr) * 0.5 * d.chWidth;
a[i] += dry + (cm + cs) * d.chMix / 2;
b[i] += dry + (cm - cs) * d.chMix / 2;
} else {
a[i] += y * 0.5;
b[i] += y * 0.5;
}
if (d.rvMix > 0 && this.rvOn) {
if (!this.rv) this.rv = new Verb(sr);
this.rv.setTime(d.rvTime, sr);
this.rv.step(y * 0.2, this.ro);
const rm = (this.ro[0] + this.ro[1]) * 0.5;
const rs = (this.ro[0] - this.ro[1]) * 0.5 * d.rvWidth;
a[i] += (rm + rs) * d.rvMix;
b[i] += (rm - rs) * d.rvMix;
}
this.n++;
}
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
this.mv = mv;
this.vel = vel;
this.n = 0;
this.pm = 0; this.ps = 0; this.pr = 0;
this.d1 = 0.33; this.d2 = 0.66;
this.amp = 0;
this.se = 1;
this.seed = ((Math.imul(def.seed || 1, 0x9e3779b1) ^ (f * 1000 | 0)) >>> 0) || 1;
const nu = Math.max(1, Math.min(UNI_MAX, Math.round(mv && mv.pu != null ? mv.pu : def.uni)));
this.nu = [0, 1, 2, 5, 6, 8, 9, 10, 11].includes(def.wave) ? nu : 1;
this.uni = this.nu > 1 || def.wave === 10 || def.wave === 11 || (mv && mv.pw != null);
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
const peak = d.post ? 1 : this.vel * d.level;
const end = this.cutT == null ? B : Math.max(0, Math.min(B, Math.round((this.cutT - t0) * sr)));
for (let i = start; i < end; i++) {
if (!this.rel && i >= relAt) this.rel = 1;
const age = this.n * dt;
const now = t0 + i * dt;
if (this.rel) {
this.amp += (0 - this.amp) * d.kar;
} else if (age < d.aat) {
this.amp = peak * (age / d.aat);
} else if (age < d.aat + d.ahd) {
this.amp = peak;
} else {
this.amp += (peak * d.asu - this.amp) * d.kad;
}
let hz = this.f;
if (this.from > 0 && age < d.glide) {
hz = this.from * Math.pow(this.f / this.from, age / d.glide);
}
const mv = this.mv;
if (mv.gs) hz *= Math.pow(2, mv.gs * Math.min(1, age / mv.gl) / 12);
if (mv.bs) hz *= Math.pow(2, mv.bs * (1 - Math.min(1, age / mv.bl)) / 12);
if (mv.pc) hz *= Math.pow(2, curveAt(mv.pc, age) / 1200);
if (mv.vc) hz *= Math.pow(2, curveAt(mv.vc, age) * Math.sin(2 * Math.PI * mv.vr * now) / 1200);
const vib = mv.vb ? mv.vb[0] : mv.pv != null ? mv.pv : d.vib;
const vibRate = mv.vb ? mv.vb[1] : d.vibRate;
const vibDelay = mv.vb ? mv.vb[2] : d.vibDelay;
if (vib > 0 && age > vibDelay) {
const grow = Math.min(1, (age - vibDelay) / 0.3);
hz *= Math.pow(2, vib * grow * Math.sin(2 * Math.PI * vibRate * age) / 1200);
}
if (!this.rel) this.part.hzb[i] = hz;
const dtm = hz / sr;
let y = 0;
if (d.wave === 4) {
y = this.noise();
} else if (d.wave === 12) {
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
const u = Math.pow(2, 12 / 1200);
this.pm += dtm; this.pm -= Math.floor(this.pm);
this.d1 += dtm / u; this.d1 -= Math.floor(this.d1);
this.d2 += dtm * u; this.d2 -= Math.floor(this.d2);
y = 0.5 * (sawAt(this.pm, dtm) + sawAt(this.d1, dtm) + sawAt(this.d2, dtm));
} else {
this.pm += dtm;
let wrapped = false;
if (this.pm >= 1) { this.pm -= 1; wrapped = true; }
let ratio = 1;
if (d.wave === 6) {
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
const wk = Math.min(0.95, Math.max(0.05,
d.width + d.pwmDepth * Math.sin(2 * Math.PI * d.pwmRate * now + k * 1.7)));
v = pulseAt(ph, dt, wk);
} else if (d.wave === 6) {
const r = d.sync > 1 ? d.sync : UNI_SYNC;
let q = this.up2[k] + dk * r;
if (wrap) q = ph * r;
q -= Math.floor(q);
this.up2[k] = q;
v = sawAt(q, Math.min(0.5, dk * r));
} else if (d.wave === 10) {
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
if (d.wave === 7 && d.ring > 0) {
this.pr += dtm * d.ringRatio;
this.pr -= Math.floor(this.pr);
y = y * (1 - d.ring) + y * Math.sin(2 * Math.PI * this.pr) * d.ring;
}
}
bus[i] += (d.post ? y : y * this.amp) * d.oscLevel;
this.n++;
}
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
this.lastF = {};
this.add(p.events || []);
this.port.onmessage = (e) => {
const q = e.data || {};
if (q.patch) this.patch[q.patch] = compileAnalog(q.def, sampleRate);
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
this.lastF[ev.p] = gs ? f * Math.pow(2, gs / 12) : f;
const vel = Math.max(0, Math.min(1, ev.v == null ? 0.8 : ev.v));
const off = ev.d == null ? null : ev.t + ev.d;
const part = this.pickPart(ev.p + '/' + (ev.sc | 0), def, off, vel, ev.op == null ? null : ev.op,
ev.rv == null ? null : ev.rv);
if (def.post) {
for (const v of this.voices) {
if (v.on && v.part === part && v.t0 < ev.t - 1e-6) v.cutT = ev.t;
}
}
this.pickVoice().begin(def, part, ev.t, f, vel, off, from,
{ gs, gl: Math.max(0.01, ev.gl || 0), vb: ev.vb || null, pv: ev.pv == null ? null : ev.pv,
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
return true;
}
}
registerProcessor('${Y}', AnalogBank);`,$={seqBass:{desc:null,wave:"sawtooth",octave:0,filter:{kind:"ladder",cutoff:150,resonance:.8,drive:.3},fenv:{amount:3.5,attack:.001,decay:.25,sustain:0},amp:{attack:.002,decay:.2,sustain:.6,release:.05},level:1.358},delayBass:{desc:null,wave:"sawtooth",octave:0,filter:{kind:"ladder",cutoff:150,resonance:.7,drive:.3},fenv:{amount:3.5,attack:.001,decay:.2,sustain:0},amp:{attack:.002,decay:.15,sustain:.4,release:.05},delay:{mix:.7,time:.125,feedback:0,tone:3e3},level:1.358},synthBrass:{desc:null,wave:"detuned",octave:0,filter:{kind:"ladder",cutoff:400,resonance:.2,drive:.1},fenv:{amount:2.5,attack:.08,decay:.6,sustain:.4},amp:{attack:.03,decay:.3,sustain:.8,release:.2},level:.566,chorus:{mix:.5,rate:.5,depth:3}},strings:{desc:null,wave:"detuned",octave:0,filter:{kind:"lowpass",cutoff:700,resonance:.1,drive:0},fenv:{amount:1.5,attack:.5,decay:1.5,sustain:.6},amp:{attack:.4,decay:1,sustain:.9,release:.6},level:.215,chorus:{mix:1,rate:.4,depth:4}},pulseLead:{desc:null,wave:"pulse",octave:0,filter:{kind:"lowpass",cutoff:1800,resonance:.35,drive:.2},fenv:{amount:1.2,attack:.01,decay:.3,sustain:.5},amp:{attack:.01,decay:.2,sustain:.85,release:.12},level:.51,chorus:{mix:.3,rate:.6,depth:2},pitch:{vibrato:15,rate:5.5,delay:.3,glide:0}},noiseSnare:{desc:null,wave:"noise",octave:0,filter:{kind:"lowpass",cutoff:300,resonance:.5,drive:.2},fenv:{amount:4,attack:.001,decay:.12,sustain:0},amp:{attack:.001,decay:.12,sustain:0,release:.05},level:.973},laserZap:{desc:null,wave:"noise",octave:0,filter:{kind:"ladder",cutoff:150,resonance:1.15,drive:0},fenv:{amount:4.5,attack:.001,decay:.35,sustain:0},amp:{position:"afterFilter",attack:.001,decay:.3,sustain:0,release:.05},osc:{level:.02},level:2.68},noiseHat:{desc:null,wave:"noise",octave:0,filter:{kind:"highpass",cutoff:6e3,resonance:.2,drive:0},fenv:{amount:.5,attack:.001,decay:.04,sustain:0},amp:{attack:.001,decay:.05,sustain:0,release:.02},level:.528},slowPad:{desc:null,wave:"detuned",octave:0,filter:{kind:"lowpass",cutoff:500,resonance:.25,drive:0},fenv:{amount:2,attack:1.2,decay:2,sustain:.7},amp:{attack:.8,decay:2,sustain:.9,release:1.2},level:.311,lfo:{depth:.3,rate:.25,shape:"sine"},chorus:{mix:.8,rate:.3,depth:5}},glideLead:{desc:null,wave:"sawtooth",octave:0,filter:{kind:"ladder",cutoff:1200,resonance:.45,drive:.25},fenv:{amount:1.5,attack:.02,decay:.4,sustain:.5},amp:{attack:.02,decay:.3,sustain:.9,release:.15},level:.818,chorus:{mix:.3,rate:.5,depth:2},pitch:{vibrato:20,rate:5,delay:.2,glide:.08}},pwmStrings:{desc:null,wave:"pwm",octave:0,filter:{kind:"lowpass",cutoff:1400,resonance:.15,drive:0},fenv:{amount:1,attack:.3,decay:1,sustain:.6},amp:{attack:.25,decay:1,sustain:.9,release:.5},level:.271,chorus:{mix:.3,rate:.4,depth:3},osc:{width:.5,pwmDepth:.35,pwmRate:.8}},pwm:{desc:null,wave:"pwm",octave:0,filter:{kind:"lowpass",cutoff:18e3,resonance:0,drive:0},fenv:{amount:0,attack:.001,decay:.2,sustain:0},amp:{attack:.005,decay:.1,sustain:1,release:.05},level:.21,osc:{width:.5,pwmDepth:.35,pwmRate:.8}},syncLead:{desc:null,wave:"sync",octave:0,filter:{kind:"lowpass",cutoff:2500,resonance:.3,drive:.3},fenv:{amount:1,attack:.01,decay:.35,sustain:.4},amp:{attack:.01,decay:.3,sustain:.85,release:.1},level:.349,chorus:{mix:.2,rate:.6,depth:2},pitch:{vibrato:12,rate:5.5,delay:.25,glide:0},osc:{sync:3,syncEnv:1}},ringBell:{desc:null,wave:"ring",octave:0,filter:{kind:"lowpass",cutoff:3e3,resonance:.2,drive:0},fenv:{amount:2,attack:.001,decay:.5,sustain:.2},amp:{attack:.002,decay:.8,sustain:.3,release:.4},level:.658,chorus:{mix:.3,rate:.5,depth:3},osc:{ring:.8,ringRatio:1.5}},whistleWind:{desc:null,wave:"noise",octave:0,filter:{kind:"ladder",cutoff:443.3,track:1,resonance:.98,drive:0},fenv:{amount:0,attack:.001,decay:.2,sustain:0},amp:{attack:.06,decay:.3,sustain:.9,release:.15},level:1,pitch:{vibrato:45,rate:5,delay:.25,glide:.04}},tomitaWhistle:{desc:null,wave:"noise",octave:0,osc:{level:.1},filter:{kind:"ladder",cutoff:440,track:1,resonance:1.05,drive:0},fenv:{amount:0,attack:.001,decay:.2,sustain:0},amp:{attack:.22,decay:.4,sustain:0,release:.15,position:"afterFilter"},level:4,pitch:{vibrato:80,rate:6.5,delay:.08,glide:.04},dev:["wip"]},tomitaStrings:{desc:null,wave:"sawtooth",octave:0,osc:{unison:7,spread:12},filter:{kind:"lowpass",cutoff:4800,resonance:0,drive:0},fenv:{amount:0,attack:.001,decay:.2,sustain:0},amp:{attack:.17,decay:.1,sustain:1,release:.15},reverb:{time:2.5,mix:.3},level:.29,pitch:{vibrato:0,rate:5,delay:.3,glide:0}},tomitaStringsAlt:{desc:null,wave:"square",octave:0,osc:{unison:3,spread:12},filter:{kind:"lowpass",cutoff:4800,resonance:0,drive:0},fenv:{amount:0,attack:.001,decay:.2,sustain:0},amp:{attack:.17,decay:.1,sustain:1,release:.15},reverb:{time:2.5,mix:.3,on:!1},level:.31,waveLevels:{saw:.87,square:1,sine:.71,triangle:.87,pulse25:1.16,pulse12:1.52,pwm:1.07,octaveSaw:1.07,pulse33:1.08,sync:.86,halfSine:.67},pitch:{vibrato:0,rate:5,delay:.3,glide:0},dev:["wip"]},tomitaBell:{desc:null,wave:"partials",octave:0,osc:{partials:[{ratio:1,level:1,attack:.003,t60:14},{ratio:1.035,level:.22,attack:.003,t60:14},{ratio:1.618,level:.56,attack:.02,t60:8},{ratio:2.437,level:.7,attack:.02,t60:11},{ratio:3.233,level:.12,attack:.02,t60:15}]},filter:{kind:"lowpass",cutoff:12e3,resonance:0,drive:0},fenv:{amount:0,attack:.001,decay:.2,sustain:0},amp:{attack:.005,decay:.1,sustain:1,release:4},reverb:{time:2.5,mix:.2},level:.163,pitch:{vibrato:0,rate:5,delay:.3,glide:0},dev:["wip"]},papipupe:{desc:null,wave:"sawtooth",octave:0,filter:{kind:"ladder",cutoff:200,resonance:.9,drive:0},fenv:{amount:5,attack:.03,decay:.2,sustain:1,velocity:1},amp:{attack:.005,decay:.2,sustain:1,release:.08,position:"afterFilter"},level:.84,pitch:{vibrato:20,rate:4.5,delay:.35,glide:0}},violinTrial:{desc:null,wave:"sawtooth",octave:0,filter:{kind:"lowpass",cutoff:1500,track:.7,resonance:.25,drive:0},fenv:{amount:1.5,attack:.08,decay:.4,sustain:.6},amp:{attack:.08,decay:.3,sustain:.95,release:.25},level:.28,pitch:{vibrato:30,rate:6,delay:.25,glide:.06},draft:!0,dev:["wip"]},aahPad:{desc:null,wave:"pwm",octave:0,filter:{kind:"bandpass",cutoff:800,resonance:.45,drive:0},fenv:{amount:.3,attack:.6,decay:1.5,sustain:.8},amp:{attack:.5,decay:1,sustain:.9,release:1},level:1,chorus:{mix:1,rate:.35,depth:6},pitch:{vibrato:8,rate:5,delay:.5,glide:0},osc:{width:.5,pwmDepth:.25,pwmRate:3},dev:["wip"]},musicBox:{desc:null,wave:"ring",octave:0,filter:{kind:"lowpass",cutoff:1800,track:1,resonance:.1,drive:0},fenv:{amount:1.5,attack:.001,decay:.12,sustain:0},amp:{attack:.001,decay:1.2,sustain:0,release:.6},level:.56,osc:{ring:.35,ringRatio:4},draft:!0,dev:["wip"]},flute:{desc:null,wave:"square",octave:0,filter:{kind:"lowpass",cutoff:600,track:1,resonance:.2,drive:0},fenv:{amount:1,attack:.04,decay:.25,sustain:.3},amp:{attack:.07,decay:.3,sustain:.9,release:.18},level:.44,pitch:{vibrato:18,rate:5,delay:.3,glide:.03},draft:!0,dev:["wip"]},voxHumana:{desc:null,wave:"pwm",octave:1,filter:{kind:"lowpass",cutoff:1800,resonance:.2,drive:0},fenv:{amount:.6,attack:.3,decay:.8,sustain:.5},amp:{attack:.12,decay:.6,sustain:.85,release:.7},level:.331,chorus:{mix:.9,rate:4.5,depth:3},osc:{width:.45,pwmDepth:.2,pwmRate:5}},polyBrass:{desc:null,wave:"detuned",octave:0,filter:{kind:"ladder",cutoff:350,resonance:.25,drive:.1},fenv:{amount:2.2,attack:.06,decay:.5,sustain:.45},amp:{attack:.04,decay:.4,sustain:.8,release:.25},level:.6,chorus:{mix:.5,rate:.5,depth:3}}};function ot(e,u=48e3){let s=(a,o,d,m)=>{let i=Number(a);return Number.isFinite(i)?Math.min(d,Math.max(o,i)):m},v=a=>{let o=a|0||1;return()=>(o^=o<<13,o^=o>>>17,o^=o<<5,(o>>>0)%1e6/1e6)},h=["sawtooth","square","pulse","detuned","noise","pwm","sync","ring","sine","triangle","octaveSaw","halfSine","partials"],w=["lowpass","highpass","ladder","bandpass","notch"],k={sine:{make:a=>Math.sin(2*Math.PI*a)},triangle:{make:a=>1-4*Math.abs((a+.25)%1-.5)},square:{make:a=>a<.5?1:-1},sawtooth:{make:a=>1-2*a},sampleHold:{cycles:8}},J=(a,o)=>{if(Array.isArray(a)&&a.length){let i=Math.max(1,Math.round(1024/a.length)),p=new Float32Array(a.length*i);return a.forEach((r,l)=>p.fill(s(r,-1,1,0),l*i,(l+1)*i)),{data:p,cycles:1}}let d=k[a]||k.sine;if(d.cycles){let i=v(o),p=1024/8,r=new Float32Array(d.cycles*p);for(let l=0;l<d.cycles;l++)r.fill(i()*2-1,l*p,(l+1)*p);return{data:r,cycles:d.cycles}}let m=new Float32Array(1024);for(let i=0;i<1024;i++)m[i]=d.make(i/1024);return{data:m,cycles:1}},g=e.filter||{},x=e.fenv||{},f=e.amp||{},_=e.lfo||{},b=e.chorus||{},M=e.pitch||{},n=e.osc||{},A=e.delay||{},S=e.reverb||{},N=s(e.seed,1,9999,1),{data:Q,cycles:Z}=J(_.shape,N),L=s(_.depth,0,4,0),tt=(a,o)=>a*(1+Math.ceil(Math.log(.001)/Math.log(Math.max(.01,o)))),E=a=>1-Math.exp(-1/(u*Math.max(.001,a)/3)),O=Math.max(0,w.indexOf(String(g.kind||"lowpass"))),D=s(A.mix,0,1,0),B=s(A.time,.01,1,.25),I=s(A.feedback,0,.95,.3),C=String(f.position||"beforeFilter")==="afterFilter",T=s(g.resonance,0,O===2&&C?1.2:1,0),et=O===2?T<=1?3.96*T:3.96+(4.6-3.96)*(T-1)/.2:Math.max(.01,2-2*T);return{wave:Math.max(0,h.indexOf(String(e.wave||"sawtooth"))),oct:s(e.octave,-2,2,0),kind:O,cutoff:s(g.cutoff,20,2e4,2e4),track:s(g.track,0,1,0),k:et,drive:s(g.drive,0,1,0)*4,fa:s(x.amount,0,6,0),fat:s(x.attack,.001,4,.001),fsu:s(x.sustain,0,1,0),fvel:s(x.velocity,0,1,0),kfd:E(s(x.decay,.001,8,.2)),kfr:E(s(f.release,.001,4,.05)),post:C,aat:s(f.attack,.001,4,.002),ahd:s(f.hold,0,4,0),asu:s(f.sustain,0,1,.8),kad:E(s(f.decay,.001,8,.2)),kar:E(s(f.release,.001,4,.05)),lfoDepth:L,lfoRate:s(_.rate,.01,20,2),lfoTbl:L>0?Q:null,lfoCycles:Z,chMix:s(b.mix,0,1,0),chRate:s(b.rate,.05,8,.5),chDepth:s(b.depth,.5,20,3),chWidth:s(b.width,0,1,1),dlMix:D,dlLen:Math.max(1,Math.round(B*u)),dlFb:I,dlTone:1-Math.exp(-2*Math.PI*s(A.tone,200,2e4,2e4)/u),dlTail:D>0?tt(B,I):0,vib:s(M.vibrato,0,100,0),vibRate:s(M.rate,.1,12,5.5),vibDelay:s(M.delay,0,2,.3),glide:s(M.glide,0,1,0),width:s(n.width,.05,.95,.5),pulseW:s(n.width,.05,.95,.25),pwmDepth:s(n.pwmDepth,0,.45,.35),pwmRate:s(n.pwmRate,.05,8,.8),sync:s(n.sync,1,32,1),syncEnv:s(n.syncEnv,0,4,0),ring:s(n.ring,0,1,0),ringRatio:s(n.ringRatio,.01,32,1.5),...(()=>{let a=Array.isArray(n.partials)?n.partials.slice(0,8):[],o=a.length,d=new Float64Array(8),m=new Float64Array(8),i=new Float64Array(8),p=new Float64Array(8);return a.forEach((r,l)=>{d[l]=s(r&&r.ratio,.01,32,1),m[l]=s(r&&r.level,0,1,1),i[l]=s(r&&r.attack,0,5,0),p[l]=Math.exp(-6.91/(s(r&&r.t60,.05,60,10)*u))}),{ptN:o,ptR:d,ptL:m,ptA:i,ptK:p}})(),oscLevel:s(n.level,0,1,1),uni:s(n.unison,1,20,1),rvMix:s(S.mix,0,1,0),rvTime:s(S.time,.1,6,2),rvWidth:s(S.width,0,1,1),rvDef:S.on===!1?0:1,waveLv:["saw","square","sine","triangle","pulse25","pulse12","pwm","octaveSaw","pulse33","sync","halfSine"].map(a=>s((e.waveLevels||{})[a],0,4,1)),uniSpread:s(n.spread,0,50,12),level:s(e.level,0,4,.25),seed:N}}function nt(){let e=[{name:"vibrato",min:0,max:100,unit:"cent",desc:null},{name:"voices",min:1,max:20,desc:null},{name:"reverb",min:0,max:1,words:{on:1,off:0},desc:null},{name:"wave",min:0,max:10,words:{saw:0,square:1,sine:2,triangle:3,pulse25:4,pulse12:5,pwm:6,octaveSaw:7,pulse33:8,sync:9,halfSine:10},desc:null}],u={seqBass:"bass",synthBrass:"chord",strings:"chord",pulseLead:"lead",noiseSnare:"perc",noiseHat:"perc",slowPad:"chord",glideLead:"lead",pwm:"lead",pwmStrings:"chord",syncLead:"lead",ringBell:"lead",tomitaWhistle:"lead",tomitaStrings:"chord",tomitaStringsAlt:"chord",tomitaBell:"counter",whistleWind:"lead",papipupe:"lead",violinTrial:"lead",aahPad:"chord",musicBox:"lead",flute:"lead",polyBrass:"chord",voxHumana:"chord",delayBass:"bass",laserZap:"perc"};for(let[s,v]of Object.entries($)){if(v.draft)continue;let h=`analog::${s}`;try{q(h,{desc:v.desc,params:e})}catch{}W(h,{patch:s},{role:u[s],desc:v.desc,dev:v.dev})}}function rt(e,u,s,v,h,w){return e.legato?null:{t:h,p:u.patch,f:s,...e.glide>0?{gs:12*Math.log2(e.glide/e.freq),gl:Math.max(.01,e.gate??w-h)}:{},...e.bright!=null?{op:e.bright}:{},...e.bend?{bs:e.bend/100,bl:Math.max(.01,e.gate??w-h)}:{},...e.pitchCurve?{pc:e.pitchCurve}:{},...e.vibCurve?{vc:e.vibCurve,vr:e.vibCurveRate??V}:{},...e.vargs&&e.vargs.vibrato!=null?{pv:e.vargs.vibrato}:{},...e.vargs&&e.vargs.voices!=null?{pu:e.vargs.voices}:{},...e.vargs&&e.vargs.reverb!=null?{rv:e.vargs.reverb}:{},...e.vargs&&e.vargs.wave!=null?{pw:e.vargs.wave}:{},...e.vib?{vb:[e.vib.depth,e.vib.speed!=null?e.vib.speed:V,(e.vib.delay||0)*X]}:{},v:Math.max(0,Math.min(1,(e.vol??0)/15)),d:Math.max(.001,e.tieSpan??w-h),...e.rollTo!=null?{v2:Math.max(0,Math.min(1,e.rollTo/15))}:{},...e.pedals&&e.pedBase!=null?{pd:e.pedals.map(([F,k])=>[e.pedBase+F,e.pedBase+k])}:{},sc:e.sub|0}}var G={kind:"analog",node:Y,code:it,voices:K,buses:2,event:rt,options:e=>({numberOfInputs:0,outputChannelCount:[2],processorOptions:{events:e,patches:$}})};j(G.kind,G);nt();H();U();})();
