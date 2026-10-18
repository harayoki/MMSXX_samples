var MMSXX;((MMSXX||={}).sound||={}).acoustic=(()=>{var n=globalThis.MMSXX.sound.core["mml.js"],Ge=n.AY_ENV_SHAPES,Ie=n.AY_MODES,_e=n.DEFAULT_ENV,je=n.DEFAULT_WAVE,$e=n.DEV_MARKS,He=n.DRUM_FREQ,Ue=n.ENVELOPES,Qe=n.HEAD_MARK,Ye=n.NES_MODES,Ze=n.NOISE_VARIANTS,Xe=n.ROLES,Je=n.SPECIALS,et=n.STEALS,tt=n.TUNINGS,ot=n.VCURVES,st=n.VIB_MAX,at=n.VIB_SPEED,nt=n.WAVE,lt=n.WAVEFORMS,rt=n.badVoice,it=n.compileMML,ct=n.countOldStyle,ht=n.describeVoice,dt=n.dutyLfoAt,pt=n.dutyMoves,ut=n.envRunLen,mt=n.envSec,vt=n.findWave,ft=n.firstTempo,bt=n.isSystemMark,gt=n.listEnvelopes,yt=n.listVoiceFamilies,Mt=n.listVoices,xt=n.metaOf,wt=n.noOldDescName,kt=n.readBundles,St=n.readChordSets,Lt=n.readDirectives,Bt=n.readDrums,At=n.readVoices,qt=n.readWaves,Rt=n.registerAY,Nt=n.registerAnalog,Ot=n.registerBaked,Et=n.registerBeep,$=n.registerBrass,zt=n.registerCoreFamilies,Dt=n.registerDrumSlots,Tt=n.registerEnvelope,Pt=n.registerFDS,Ft=n.registerFM,Kt=n.registerFamily,Ct=n.registerLayer,H=n.registerModal,Wt=n.registerNES,Vt=n.registerNoiseVariants,Gt=n.registerOPNARhythm,It=n.registerPCE,_t=n.registerSCC,jt=n.registerVoice,ae=n.registerVoiceDetail,ne=n.registerVoiceSyntax,$t=n.registerWave,Ht=n.roleOf,le=n.sealPresets,Ut=n.shareBundles,Qt=n.slideAt,Yt=n.songParts,Zt=n.splitParts,Xt=n.splitVoices,Jt=n.stealOf,e0=n.toneOf,t0=n.validateMML,o0=n.voiceArgs,s0=n.voiceName,a0=n.voiceNameProblem,n0=n.voiceNums,l0=n.volFromGain,r0=n.volGainOf,re=n.warn,i0=n.waveMeta,c0=n.waveRole,h0=n.waveSteal;var U=globalThis.MMSXX.sound.core["layerpresets.js"],p0=U.LAYER_PRESETS,u0=U.layerPairFamily,ie=U.registerDefaultLayers;var Y="mmsxx-modal";function xe(e,t){if(!e.sour)return t;let o=(Math.round(t*100)|0)^Math.imul(e.sourSeed|0,2654435761);return o=Math.imul(o^o>>>15,2246822507),o=Math.imul(o^o>>>13,3266489909),o^=o>>>16,t*Math.pow(2,e.sour*((o>>>0)/4294967296*2-1)/1200)}function we(e,t,o,r,h){let l={amp:1,t60k:1,fcK:1,spot:0,buzz:0,head:null,extra:[]},d=t.f||e.base,c=Math.imul(r,2654435761)^Math.imul(Math.round(d*10)|0,2246822507)^Math.imul(t.k==null?Math.round(h*10)|0:0,3266489909)^Math.imul((e.flawSeed|0)+1,668265263),s=()=>(c=Math.imul(c^c>>>15,2246822507),c=Math.imul(c^c>>>13,3266489909),c^=c>>>16,(c>>>0)/4294967296),i=v=>{let a=s(),u=s(),m=s();return[v>0&&a<v,u,m]},p=t.h?Object.assign({},e.head,t.h):e.head||{},[b,y,M]=i(e.neighbor||0);if(b&&t.f&&l.extra.push({t:t.t+.006+.02*y,p:t.p,f:t.f*Math.pow(2,(M<.5?-1:1)/12),v:o*(.45+.25*M),d:t.d,k:t.k,nf:1}),i(0),e.double>0&&t.f){let v=Math.imul(Math.round(12*Math.log2(t.f/440))+69,2654435761)^Math.imul((e.doubleSeed|0)+1,2246822507),a=()=>(v=Math.imul(v^v>>>15,2246822507),v=Math.imul(v^v>>>13,3266489909),v^=v>>>16,(v>>>0)/4294967296),u=a()<e.double,m=a(),f=a();u&&o>=.75&&l.extra.push({t:t.t+.012+.025*m,p:t.p,f:t.f,v:o*(.4+.2*f),d:t.d==null?void 0:Math.max(.02,t.d-.03),k:t.k,nf:1})}if(i(0),e.buzz>0&&t.f&&o>=.6){let v=Math.imul(Math.round(12*Math.log2(t.f/440))+69,668265263)^Math.imul((e.buzzSeed|0)+1,374761393);v=Math.imul(v^v>>>15,2246822507),v=Math.imul(v^v>>>13,3266489909),v^=v>>>16,(v>>>0)/4294967296<e.buzz&&(l.buzz=(e.buzzLevel??.4)*Math.min(1,.4+1.5*(o-.6)))}let[x]=i(e.slip||0);x&&(l.amp*=.5,l.head={noise:Math.max(p.noise||0,.85),bright:(p.bright??.6)-.1});let[w]=i((e.ghost||0)*(1.3-o));w&&(l.t60k*=.05/Math.sqrt(e.strings>1&&e.after>1?e.after:1),l.amp*=.7,l.head=Object.assign({},l.head,{noise:Math.max(p.noise||0,.6)}));let[k]=i(e.splay||0);k&&p.grains>0&&(l.head=Object.assign({},l.head,{scatter:(p.scatter||0)*3.5+6}),l.amp*=1.5);let[L,A]=i((e.spot||0)*(.5+o));return L&&(A<.6?(l.spot=1,l.t60k*=1.3,l.fcK=.6,l.amp*=1.15):l.spot=2),l}function ke(e,t){let o=[40,45,50,55,59,64],r=Math.round(69+12*Math.log2(t/440)),h=[];for(let s=0;s<6;s++){let i=r-o[s];i>=0&&i<=19&&h.push([s,i])}if(!h.length)return null;let l=h.find(s=>s[1]===0);if(l)return{pos:e.pos,s:l[0],fret:0,moved:0};let d=h.filter(s=>s[1]>=e.pos&&s[1]<=e.pos+3);if(d.length){let s=d.find(i=>i[0]===e.s)||d[0];return{pos:e.pos,s:s[0],fret:s[1],moved:0}}let c=null;for(let[s,i]of h){let p=i<e.pos?i:i-3,b=Math.abs(p-e.pos);(!c||b<c.moved||b===c.moved&&s===e.s&&c.s!==e.s)&&(c={pos:p,s,fret:i,moved:b})}return c}function Se(e,t,o,r,h,l){let d=[],c=l(o||{pos:1,s:-1},t.f),s=c?{pos:c.pos,s:c.s,fret:c.fret}:o?{pos:o.pos,s:-1,fret:0}:{pos:1,s:-1,fret:0};if(!o||!c||!o.f)return{ev:d,hand:s};if(Math.abs(12*Math.log2(t.f/o.f))<.5)return{ev:d,hand:s};let p=Math.max(o.end!=null&&o.end<t.t?o.end:t.t-.1,h),b=Math.min(1,Math.max(0,e.lift??.3)),y=Math.min(1,Math.max(0,e.care||0)),M=Math.max(.1,1-y),x=Math.max(.1,b),w=Math.max(.1,1-b),k=o.s>=0&&o.fret>0,L=(e.openRing??0)*x*M;if(L>0&&k&&t.t-p>.03){let T=440*Math.pow(2,([40,45,50,55,59,64][o.s]-69)/12);d.push({t:p,p:t.p,f:T,v:Math.min(1,.6*L),d:t.t-p,nf:1,h:{sharp:2.5,bright:.7,noise:.1}})}let A=(e.stringNoise||0)*M;if(!(A>0))return{ev:d,hand:s};let v=A*x*Math.min(1,Math.max(0,e.click??1));k&&o.s<=2&&v>0&&d.push({t:p,p:t.p,sq:1,nf:1,sqLen:.02,sqF:0,sqB:1200,sqN:.5,sqSeed:r*31+3,v:.47*Math.pow(v,1.7)});let a=k&&o.s<=2||c.fret>0&&c.s<=2,u=A*w,m=Math.min(1,c.moved/12),f=1-Math.min(1,Math.max(0,(b-.05)/.2)),g=f*(.08+.06*m)+(1-f)*(.02+.03*m),S=Math.max(0,g-(t.t-.005-(p+.005))),B=Math.min(1,Math.max(0,e.rush||0)),q=Math.max(h,o.t!=null?o.t+.05:-1/0,p+.005-B*S),R=t.t-.005-q;if(c.moved>0&&a&&R>=.015){let T=k&&f>=.5?Math.sign(c.pos-o.pos)*c.moved:0,W=Me=>{let N=(((e.flawSeed??1)|0)*2654435761^Math.imul(r|0,40503)^Math.imul(Me,2654435761))>>>0;return N^=N>>>15,N=Math.imul(N,739982445)>>>0,N^=N>>>12,N=Math.imul(N,695872825)>>>0,N^=N>>>15,(N>>>0)/4294967296},se=q+Math.min(.01*W(1),Math.max(0,R-.015));d.push({t:se,p:t.p,sq:1,nf:1,sqLen:Math.min(g*(.7+.5*W(2)),t.t-.005-se),sqF:(1900+400*m)*(.88+.24*W(3)),sqB:0,sqN:.2,sqSeed:r*31+7,v:.4*u*(.6+.4*m)*(.65+.55*W(4)),bend:T})}return{ev:d,hand:s}}function Le(e,t,o,r,h,l,d,c,s){let i=e.pitched?t/261.63:1,p=e.t60*Math.pow(i,-(e.decayKey||0))*o,b=e.bStretch>0&&e.pitched&&t<40.5?e.bStretch:(e.stretch||0)*Math.pow(i,e.stretchKey||0),y=e.damp,M=e.guide>0&&t<e.guide,x=0;if(M){x=Math.max(1,Math.min(d,e.strings|0||1));for(let v=0;v<x;v++){let a=x===1?0:(e.detune||0)*(v/(x-1)-.5)*2;c(v,t*Math.pow(2,a/1200),p*(v===0?1:e.after||1),y,b)}}let w=e.table,k=e.pitched&&e.harmonic>=2?e.harmonic|0:0,L=1;if(e.pickupAt>0){let v=0,a=0;for(let u=1;u<=12;u++){let m=Math.pow(u,-1.25),f=m*Math.pow(Math.abs(Math.sin(Math.PI*u*e.pickupAt)),e.pickupDepth??1);v+=f*f,a+=m*m}L=Math.sqrt(a/v)}let A=0;for(let v=0;v<w.length&&A<l;v+=4){let a=w[v+3];if(k&&a>0&&a%k||M&&a>=0)continue;let u,m;if(a<0?(u=w[v],m=w[v+2]):(u=w[v]*t*(a>0&&b>0?Math.sqrt(1+b*a*a):1),m=p*w[v+2]/(1+y*(u/1e3)*(u/1e3)),e.mute>0&&(m=60/(60/m+e.mute*(45*Math.pow(u/165,1.5)+20)))),u<=20||u>=h*.45)continue;let f=1;if(a>=0&&(e.body||e.bodyLow)){let g=1;for(let S of e.body||[]){let B=Math.pow(10,S.gain/40),q=1/(2-2*Math.min(.95,S.resonance)),R=u/S.freq,T=(1-R*R)*(1-R*R);g*=(T+R*R*B*B/(q*q))/(T+R*R/(B*B*q*q))}if(e.bodyLow>0){let S=Math.pow(u/e.bodyLow,4);g*=S/(1+S)}f=Math.sqrt(g)}if(a>0&&e.pickupAt>0&&(f*=Math.pow(Math.abs(Math.sin(Math.PI*a*e.pickupAt)),e.pickupDepth??1)*L,e.pickupPeakGain>0&&e.pickupPeak>0)){let g=Math.pow(10,e.pickupPeakGain/40),S=1,B=u/e.pickupPeak,q=(1-B*B)*(1-B*B);f*=Math.sqrt((q+B*B*g*g/(S*S))/(q+B*B/(g*g*S*S)))}r===1&&A<w.length/12?f*=1.3:r===2&&(A<8?(f*=3,m*=2):f*=.4),s(A,u,m,w[v+1]*f,a>=0),A++}return x}var he=`const V = 24;
const M = 1024;
const B = 128;
const S = 9;
const ON = 0, POS = 1, LEN = 2, LP1 = 3, LP2 = 4, COMB = 5, AMP = 6, LPC = 7,
NOISE = 8, DIRECT = 9, RATTLE = 10, RENV = 11, NM = 12, REL = 13, RELT = 14,
LEVEL = 15, OFF = 16, BORN = 17, NORM = 18, VARY = 19, HPOS = 20, RHP = 21,
WG = 22, WGAIN = 23, FELT = 24, TL1 = 25, TL2 = 26, TC = 27, TA1 = 28, TA2 = 29,
GN = 30, GL = 31, BZ = 32, BP = 33, PK = 34, PO = 35, PV = 36, PD = 37,
WD = 38, TD = 39, TR = 40,
SQ = 41, SQP = 42, SQT = 43, SQL = 44, SQF = 45, SQB = 46, SQH = 47,
BG = 48,
SQN = 49,
BNS = 50, BNC = 51, BNT = 52, BNL = 53,
SQC = 54,
BLA = 55, BLR = 56, BLF = 57, BLP = 58, BLC = 59, BH1 = 60, BH2 = 61,
BLD = 62, BLK = 63, BLDK = 64,
MO = 65, MR = 66,
BZR = 67,
BZS = 68,
BNF = 69,
SQLP = 70;
const K = 71;
const G = 32;
const WS = 3, AP = 6, WK = 25;
const WN = 0, WETA = 1, WC = 2, WGG = 3, WA = 4, WLP = 5, WT1 = 6, WT2 = 7, WP = 8,
WT60 = 9, WL = 10, WAPS = 11, WQ = 23, WLV = 24;
const WR = Math.ceil(sampleRate / 20) + 8;
const GUIDE_GAIN = 45, GUIDE_REF = 523;
const R = 1024;
const TAU = Math.PI * 2;
const LN1000 = 6.907755278982137;
const QUIET = 1e-5;
const sourOf = ${xe};
const modalFlaws = ${we};
const modalModes = ${Le};
const guitarHand = ${ke};
const modalHandling = ${Se};
const PICKUP_SCALE = 1.2;
/**
* 磁石からの距離 1 − u で見た磁束(1 / 距離² から、止まっているときのぶんを引いたもの)。
* 磁石に当たらないよう、u は 0.9 の手前でなめらかに頭打ちにする
*/
function pickup(u) {
const c = 0.9 * Math.tanh(u / 0.9);
const d = 1 - c;
return (1 / (d * d) - 1) / 2;
}
function pickupSlope(u) {
const c = 0.9 * Math.tanh(u / 0.9);
const d = 1 - c;
return 1 / (d * d * d);
}
class ModalBank extends AudioWorkletProcessor {
constructor(o) {
super();
const p = (o && o.processorOptions) || {};
this.modes = new Float64Array(V * M * S);
this.voice = new Float64Array(V * K);
this.ring = new Float64Array(V * R);
this.wg = new Float64Array(V * WS * WK);
this.grain = new Float64Array(V * G * 2);
this.wring = new Float64Array(V * WS * WR);
this.seed = new Uint32Array(V);       // 種を固定した雑音
this.free = 0x9e3779b9;               // 毎回違う雑音(全部の声で 1 本)
this.hb = new Float64Array(B);        // 頭の塊
this.bb = new Float64Array(B);        // あとから膨らむ高音の塊(bloomFrom より高い共振器にだけ入る)
this.vb = new Float64Array(B);        // 声の塊
this.tb = new Float64Array(B);        // 導波管へ入れる頭(tilt を掛けたもの)
this.ob = new Float32Array(B);        // 出口が 1 本のとき、右へ行く束を置く
this.sqLp = new Float64Array(V);      // キュッの高いほうを丸める状態
this.sqBp = new Float64Array(V);      // キュッのカチの残り
this.vpat = new Array(V).fill(null);  // 声ごとの、共鳴弦へ流すパッチの名前
this.sym = {};                        // パッチごとの共鳴弦
this.ped = {};                        // パッチごとの右ペダル(1 で踏んでいる)
this.pedIv = {};                      // パッチごとの、右ペダルを踏む区間(時計の秒)
this.vname = new Array(V).fill(null); // 声ごとの、パッチの名前(ペダルで止めるかを見る)
this.patch = p.patches || {};
this.events = [];
this.at = 0;
this.born = 0;
this.cutAt = -1;
this.count = {};
this.lastF = {};
this.sqCount = {};
this.rollCount = {};
this.ties = new Map();
this.sqLast = {};
this.add(p.events || []);
this.port.onmessage = (e) => {
const d = e.data || {};
if (d.patch) this.patch[d.patch] = d.def;
if (d.patches) Object.assign(this.patch, d.patches);
if (d.add) this.add(d.add);
if (d.cut) { this.events = []; this.at = 0; this.cutAt = 0; this.pedIv = {}; }
};
}
/** 音符を足す。時刻順に並べ直して、済んだぶんは捨てる */
add(list) {
if (!list.length) return;
const sq = [];
const cand = list.filter((ev) => { const d = this.patch[ev.p]; return d && (d.stringNoise > 0 || d.openRing > 0) && !ev.nf && !ev.sq && ev.f; })
.sort((a, b) => a.t - b.t);
const now = typeof currentTime === 'number' ? currentTime : 0;
for (let i = 0; i < cand.length;) {
const p = cand[i].p, t = cand[i].t;
let f = Infinity, end = null, j = i;
const group = [];
for (; j < cand.length && cand[j].p === p && (j === i || cand[j].t - cand[j - 1].t < 0.03); j++) {
f = Math.min(f, cand[j].f);
group.push(cand[j]);
if (cand[j].d != null) end = Math.max(end ?? -Infinity, cand[j].t + cand[j].d);
}
const n = this.sqCount[p] = (this.sqCount[p] || 0) + 1;
const prev = this.sqLast[p] || null;
const r = modalHandling(this.patch[p], { t, f, p }, prev, cand[i].k ?? n, now, guitarHand);
this.sqLast[p] = { t, f, end, ...r.hand, evs: group };
for (const e of r.ev) { if (e.bend && prev) e.from = prev.evs; sq.push(e); }
i = j;
}
for (const ev of list) {
const d = this.patch[ev.p];
if (!d || !(d.keyNoise > 0) || ev.nf || ev.sq || !ev.f) continue;
const m = Math.round(12 * Math.log2(ev.f / 440) + 69);
let x = Math.imul(m + 1, 0x27d4eb2f) >>> 0; x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d) >>> 0; x ^= x >>> 13;
const kh = (x >>> 0) / 4294967296;
const vel = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
const g = d.keyNoise * Math.pow(vel, 1.5);
const fb = 170 * (0.85 + 0.3 * kh);
sq.push({ t: ev.t + 0.003, p: ev.p, sq: 1, nf: 1, sqLen: 0.022, sqF: 0, sqB: fb, sqN: 0.45, sqHp: 50, sqSeed: m * 7 + 1, v: 0.5 * g });
sq.push({ t: ev.t + 0.003, p: ev.p, sq: 1, nf: 1, sqLen: 0.004, sqF: 0, sqB: 2600, sqN: 0.8, sqHp: 800, sqSeed: m * 7 + 2, v: 0.25 * g });
if (ev.d != null) {
const r = d.keyNoise * 0.6;
sq.push({ t: ev.t + ev.d, p: ev.p, sq: 1, nf: 1, sqLen: 0.018, sqF: 0, sqB: fb * 1.2, sqN: 0.45, sqHp: 50, sqSeed: m * 7 + 3, v: 0.5 * r });
sq.push({ t: ev.t + ev.d, p: ev.p, sq: 1, nf: 1, sqLen: 0.003, sqF: 0, sqB: 3000, sqN: 0.8, sqHp: 800, sqSeed: m * 7 + 4, v: 0.2 * r });
sq.push({ t: ev.t + ev.d + 0.012 + 0.006 * kh, p: ev.p, sq: 1, nf: 1, sqLen: 0.025, sqF: 0, sqB: fb * 1.6, sqN: 0.6, sqHp: 80, sqSeed: m * 7 + 5, v: 0.35 * r });
}
}
for (const ev of list) {
const d = this.patch[ev.p];
if (!d || !(d.roll > 0) || ev.nf || ev.sq || ev.rs) continue;
const n = this.rollCount[ev.p] = (this.rollCount[ev.p] || 0) + 1;
const k = ((ev.k ?? n) + 1) * 7919 + (d.rollSeed | 0) * 104729;
const u = (i) => { let x = Math.imul(k + i * 2654435761, 0x27d4eb2f) >>> 0; x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d) >>> 0; x ^= x >>> 13; return (x >>> 0) / 4294967296; };
const vel = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
const end = ev.t + (ev.d == null ? 1 : ev.d);
const step = 1 / d.roll, jit = d.rollJitter ?? 0.15, vary = d.rollVary ?? 3;
let t = ev.t;
for (let i = 1; ; i++) {
t += step * (1 + jit * (2 * u(2 * i) - 1));
if (t >= end - 0.01) break;
const vt = ev.v2 == null ? vel : vel + (Math.max(0, Math.min(1, ev.v2)) - vel) * (t - ev.t) / (end - ev.t);
const vi = Math.min(1, vt * Math.pow(10, vary * (2 * u(2 * i + 1) - 1) / 30));
sq.push({ t, p: ev.p, f: ev.f, v: vi, nf: 1, rs: ev, h: ev.h });
}
}
for (const ev of list) {
const d = this.patch[ev.p];
if (!d || !(d.snap > 0) || ev.nf || ev.sq || ev.rs || !ev.f) continue;
const vel = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
const m = Math.round(12 * Math.log2(ev.f / 440) + 69);
const g = d.snap * Math.pow(vel, 1.5);
if (d.palm > 0) {
for (const [k, om] of [28, 33, 38, 43].entries()) {
sq.push({ t: ev.t + 0.0015 * k, p: ev.p, f: 440 * Math.pow(2, (om - 69) / 12), v: vel * 0.8, nf: 1, d: 0.06, h: { sharp: 1.2, bright: 0.95, noise: 0.15 } });
}
sq.push({ t: ev.t + 0.001, p: ev.p, sq: 1, nf: 1, sqLen: 0.004, sqF: 0, sqB: 900, sqN: 1, sqHp: 400, sqLp: 2000, sqSeed: m * 11 + 11, v: 0.8 * g });
ev.palmMain = 1;
continue;
}
if (d.thumbBelow > 0 && ev.f < d.thumbBelow) {
const dull = d.thumbDull;
ev.h = Object.assign({ sharp: d.head.sharp + 10 * dull, bright: d.head.bright - 0.2 * dull, noise: d.head.noise * (1 - 0.8 * dull) }, ev.h || {});
sq.push({ t: ev.t + 0.002, p: ev.p, sq: 1, nf: 1, sqLen: 0.025, sqF: 0, sqB: 1100, sqN: 1, sqHp: 350, sqLp: 1800, sqSeed: m * 11 + 9, v: 0.7 * g });
sq.push({ t: ev.t + 0.002, p: ev.p, sq: 1, nf: 1, sqLen: 0.018, sqF: 0, sqB: 280, sqN: 0.5, sqHp: 100, sqSeed: m * 11 + 10, v: 0.8 * g });
if (d.thump > 0) sq.push({ t: ev.t + 0.25 / ev.f, p: ev.p, f: ev.f * 2, v: vel, ampK: d.thump, nf: 1, d: d.thumpLen, t60k: d.thumpLen / d.t60, h: ev.h });
continue;
}
const lw = d.thumbBelow > 0 ? Math.max(0, 1 - Math.log2(ev.f / d.thumbBelow) / 1.5) : 0;
const low = d.pullLow * lw;
const pk = d.pullLevel * Math.pow(10, low / 20);
const lw1 = d.thumbBelow > 0 ? Math.max(0, 1 - Math.log2(ev.f / d.thumbBelow)) : 0;
if (d.pullLowDull > 0 && lw1 > 0) {
const dull = d.pullLowDull * lw1;
ev.h = Object.assign({ sharp: d.head.sharp + 10 * dull, bright: d.head.bright - 0.2 * dull, noise: d.head.noise * (1 - 0.8 * dull) }, ev.h || {});
}
if (pk !== 1) ev.ampK = pk;
if (d.pullDamp !== d.damp) ev.damp = d.pullDamp;
sq.push({ t: ev.t + 0.002, p: ev.p, sq: 1, nf: 1, sqLen: 0.006, sqF: 0, sqB: 1700, sqN: 1, sqHp: 500, sqLp: 2500, sqSeed: m * 11 + 7, v: g * pk });
sq.push({ t: ev.t + 0.002, p: ev.p, sq: 1, nf: 1, sqLen: 0.012, sqF: 0, sqB: 350, sqN: 0.5, sqHp: 120, sqSeed: m * 11 + 8, v: 0.6 * g * pk });
}
if (sq.length) list = list.concat(sq);
for (const ev of list) {
if (!ev.pd) continue;
const iv = this.pedIv[ev.p] || (this.pedIv[ev.p] = new Map());
for (const [a, b] of ev.pd) iv.set(a.toFixed(4) + '|' + b.toFixed(4), [a, b]);
}
for (const ev of list) ev.s0 = ev.t - this.lead(ev);
const rest = this.events.slice(this.at).concat(list);
rest.sort((a, b) => a.s0 - b.s0);
this.events = rest;
this.at = 0;
}
/** 山 1 つ(粒があるときは粒 1 つ)の長さ(サンプル)。強さで短く、高い音ほどハンマーが硬いぶん短くなる */
bumpLen(def, h, vel, f0) {
const hk = def.pitched ? Math.pow(Math.max(1, f0 / (h.hardFrom || 261.63)), h.hardKey || 0) : 1;
return Math.max(2, Math.round(h.sharp * 0.001 * sampleRate * (1.4 - 0.6 * vel) / hk));
}
/** 頭の長さ(サンプル)。粒があるときは、散らばる幅のぶん長くなる */
headLen(def, h, vel, f0) {
const b = this.bumpLen(def, h, vel, f0);
return h.grains > 0 ? b + Math.round((h.scatter || 0) * 0.001 * sampleRate) : b;
}
/**
* 音符の時刻より何秒早く鳴りはじめるか。頭の山は長さの半分のところにある。
* 遅らせる側は持たない。後ろに置くノリは、拍を基準にすべてのパートへ効く演奏の層の
* 話で、音色の補正とは役目が違う(2026-10-05)
*/
lead(ev) {
const def = this.patch[ev.p];
if (!def) return 0;
const h = ev.h ? Object.assign({}, def.head, ev.h) : def.head;
if (!(h.align > 0)) return 0;
const vel = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
return h.align * this.headLen(def, h, vel, ev.f || def.base) / 2 / sampleRate;
}
/** 空いている声。無ければいちばん古い声を取る */
pick() {
const vo = this.voice;
let best = 0, oldest = Infinity;
for (let v = 0; v < V; v++) {
const o = v * K;
if (!vo[o + ON]) return v;
if (vo[o + BORN] < oldest) { oldest = vo[o + BORN]; best = v; }
}
return best;
}
start(ev, off) {
const def = this.patch[ev.p];
if (!def) return;
if (ev.palmMain) return;
const sr = sampleRate;
const vo = this.voice;
if (ev.sl != null) {
const tv = this.ties.get(ev.p + '|' + ev.sl);
if (!tv || !(def.neck > 0) || !ev.f) return;
const w = tv.v * K;
if (vo[w + ON] !== 1 || vo[w + BORN] !== tv.born) return;
const steps = 12 * Math.log2(ev.f / tv.f);
if (Math.abs(steps) < 0.01) return;
vo[w + BNS] = steps; vo[w + BNC] = 0; vo[w + BNT] = -off;
vo[w + BNL] = Math.max(1, Math.round(0.003 * sr)); vo[w + BNF] = 1;
tv.f = ev.f;
ev.rs = { vx: tv.v, born: tv.born };
ev.v = (ev.v == null ? 0.8 : ev.v) * 0.4;
}
const rs = ev.rs;
const re = !!rs && rs.vx != null && vo[rs.vx * K + ON] === 1 && vo[rs.vx * K + BORN] === rs.born;
if (rs && !re) return;
const v = re ? rs.vx : this.pick();
const o = v * K;
ev.vx = v;
if (ev.sq) { this.vpat[v] = null; this.vname[v] = null; this.squeak(v, def, ev, off); return; }
this.vname[v] = ev.p;
if (def.silent) return;
this.vpat[v] = this.symBank(ev.p) ? ev.p : null;
vo[o + SQ] = 0;
let h = ev.h ? Object.assign({}, def.head, ev.h) : def.head;
const vel = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
let amp = Math.pow(vel, 1.5), t60k = 1, fcK = 1, spot = 0, buzz = 0;
if (!ev.nf) {
this.count[ev.p] = (this.count[ev.p] || 0) + 1;
const last = this.lastF[ev.p] || 0;
this.lastF[ev.p] = ev.f || def.base;
const fl = modalFlaws(def, ev, vel, ev.k ?? this.count[ev.p], last);
amp *= fl.amp; t60k = fl.t60k; fcK = fl.fcK; spot = fl.spot; buzz = fl.buzz;
if (fl.head) h = Object.assign({}, h, fl.head);
if (fl.extra.length) this.add(fl.extra);
}
if (ev.t60k > 0) t60k *= ev.t60k;
if (ev.ampK > 0) amp *= ev.ampK;
const f0 = sourOf(def, ev.f || def.base) / (def.pitched && def.harmonic >= 2 ? def.harmonic : 1);
const kr = def.pitched ? f0 / 261.63 : 1;
const hk = def.pitched ? Math.pow(Math.max(1, f0 / (h.hardFrom || 261.63)), h.hardKey || 0) : 1;
const len = this.headLen(def, h, vel, f0);
const fc = Math.min(sr * 0.45, 100 * Math.pow(2, h.bright * 8 + (h.velo ?? 1.5) * (vel - 1)) * hk * fcK);
vo[o + ON] = 1;
vo[o + POS] = 0;
vo[o + LEN] = len;
vo[o + LP1] = 0;
vo[o + LP2] = 0;
vo[o + LPC] = 1 - Math.exp(-TAU * fc / sr);
vo[o + COMB] = Math.min(R - 2, h.comb * sr / f0);
vo[o + AMP] = amp;
vo[o + NOISE] = h.noise;
vo[o + VARY] = h.vary;
vo[o + FELT] = 1 + (h.felt || 0) * vel * vel;
vo[o + BLA] = (h.bloom || 0) * Math.pow(vel, h.bloomVelo ?? 4);
vo[o + BLR] = Math.max(1, (h.bloomRise ?? 0.3) * sr);
vo[o + BLF] = Math.max(1, (h.bloomFall ?? 1) * sr);
vo[o + BLP] = 0;
vo[o + BLC] = Math.exp(-TAU * (h.bloomFrom ?? 1000) / sr);
vo[o + BH1] = 0; vo[o + BH2] = 0;
vo[o + BLD] = (h.bloomDrain || 0) / 8.686 / sr * Math.pow(vel, h.bloomVelo ?? 4);
vo[o + BLK] = Math.cos(TAU * Math.min(sr * 0.45, h.bloomFrom ?? 1000) / sr);
vo[o + BLDK] = Math.cos(TAU * Math.min(sr * 0.45, h.bloomDrainBelow ?? 300) / sr);
vo[o + DIRECT] = def.direct || 0;
vo[o + RATTLE] = def.rattle || 0;
vo[o + RENV] = 0;
vo[o + RHP] = 0;
let bg = 0.35;
if (def.loose > 0 && def.pitched) {
const lf = def.looseFreq || 233, tb = def.table;
let top = 0;
for (let i = 0; i < tb.length; i += 4) if (tb[i + 3] >= 0 && tb[i + 1] > top) top = tb[i + 1];
let drive = 0;
for (let i = 0; i < tb.length && top > 0; i += 4) {
if (tb[i + 3] < 0) continue;
const f = tb[i] * f0;
const x = (f - lf) / (lf / 10), y = f / fc;
drive += tb[i + 1] / top / (1 + x * x) / (1 + y * y);
}
drive *= Math.pow(vel, 1.5);
const from = def.looseFrom ?? 0.3;
if (drive > from) {
const lz = def.loose * Math.min(1, (drive - from) / Math.max(1e-6, from));
if (lz > buzz) { buzz = lz; bg = from / drive; }
}
}
vo[o + BZ] = buzz;
vo[o + BZR] = def.buzzRasp ?? 1;
vo[o + BZS] = 0;
vo[o + BG] = bg;
vo[o + BP] = 0;
vo[o + PK] = def.pickup || 0;
vo[o + PO] = def.pickupOffset || 0;
vo[o + PV] = 0;
vo[o + PD] = def.speed ? 1 / (2 * Math.sin(Math.PI * Math.min(f0, sr * 0.45) / sr)) : 0;
vo[o + WD] = def.width || 0;
vo[o + TD] = def.tremolo || 0;
vo[o + TR] = def.tremoloRate || 0;
vo[o + MO] = def.motor || 0;
vo[o + MR] = def.motorRate || 0;
const tg = def.trebleGain ? Math.pow(10, def.trebleGain * Math.max(0, Math.log2(kr)) / 20) : 1;
vo[o + LEVEL] = (def.level == null ? 0.5 : def.level) * tg;
vo[o + OFF] = off;
if (!re) {
vo[o + BORN] = ev.born = ++this.born;
vo[o + BNS] = 0; vo[o + BNC] = 0;
vo[o + REL] = ev.d == null ? -1 : ev.t + ev.d;
vo[o + RELT] = def.release || 0.15;
vo[o + HPOS] = 0;
}
let area = 0;
for (let i = 0; i < 32; i++) area += Math.pow(Math.sin(Math.PI * (i + 0.5) / 32), vo[o + FELT]);
area /= 32;
const gn = Math.max(0, Math.min(G, h.grains | 0));
vo[o + GN] = gn;
if (gn > 0) {
const gl = this.bumpLen(def, h, vel, f0);
const span = Math.max(0, len - gl);
vo[o + GL] = gl;
let gs = ((h.seed | 0) * 747796405 + 2891336453) >>> 0 || 1;
const u = () => { gs ^= gs << 13; gs >>>= 0; gs ^= gs >>> 17; gs ^= gs << 5; gs >>>= 0; return gs / 4294967296; };
let sum = 0;
for (let k = 0; k < gn; k++) {
const t = (1 - h.vary) * u() + h.vary * Math.random();
const a = 0.4 + 0.6 * ((1 - h.vary) * u() + h.vary * Math.random());
this.grain[(v * G + k) * 2] = Math.round(t * span);
this.grain[(v * G + k) * 2 + 1] = a / Math.sqrt(gn);
sum += a / Math.sqrt(gn);
}
vo[o + NORM] = 1 / Math.max(1, area * gl * sum);
} else {
vo[o + NORM] = 1 / Math.max(1, area * len);
}
if (re) return;
this.ring.fill(0, v * R, v * R + R);
this.seed[v] = (h.seed | 0) * 2654435761 + 1 >>> 0 || 1;
const tb = def.table;
const md = this.modes;
vo[o + WG] = 0;
vo[o + NM] = 0;
const mdef = ev.damp != null ? Object.assign({}, def, { damp: ev.damp }) : def;
const ns = modalModes(mdef, f0, t60k, spot, sr, M, WS, (s, f, t60s, damp, bb) => {
this.string(v, s, f, t60s, damp, bb);
this.wg[(v * WS + s) * WK + WLV] = s === 0 ? 1 : (def.afterLevel ?? 1);
}, (n, f, tt, a, follow) => {
const w = TAU * f / sr;
const r = Math.exp(-LN1000 / (Math.max(0.005, tt) * sr));
const c = Math.cos(w), s = Math.sin(w);
const m = (v * M + n) * S;
md[m] = 2 * r * c;
md[m + 1] = r * r;
md[m + 2] = a * s;
md[m + 3] = 0;
md[m + 4] = 0;
md[m + 5] = c;
md[m + 6] = s;
md[m + 7] = tt;
md[m + 8] = follow ? 1 : 0;
vo[o + NM] = n + 1;
});
vo[o + WG] = ns;
let fNow = ev.f || def.base;
if (ev.gs && def.neck > 0) {
vo[o + BNS] = ev.gs; vo[o + BNC] = 0; vo[o + BNT] = -off;
vo[o + BNL] = Math.max(1, Math.round((ev.gl || 0.1) * sr)); vo[o + BNF] = def.neck === 2 ? 1 : 0;
fNow *= Math.pow(2, ev.gs / 12);
}
if (def.attackBend > 0 && !ev.gs && !ev.nf && !re && vo[o + BNS] === 0) {
const ab = def.attackBend * vel * vel / 100;
vo[o + BNS] = ab; vo[o + BNC] = 0; vo[o + BNT] = 0; vo[o + BNL] = 1; vo[o + BNF] = 1;
this.bend(v);
vo[o + BNS] = -ab; vo[o + BNC] = 0; vo[o + BNT] = -off;
vo[o + BNL] = Math.max(1, Math.round((def.attackBendTime || 0.05) * sr)); vo[o + BNF] = 1;
}
if (ev.tie != null) this.ties.set(ev.p + '|' + ev.tie, { v, born: vo[o + BORN], f: fNow });
if (ns) {
const tl = def.tilt == null ? 1 : def.tilt;
vo[o + TC] = 1 - Math.exp(-TAU * f0 / sr);
vo[o + TA1] = Math.min(1, Math.max(0, tl));
vo[o + TA2] = Math.min(1, Math.max(0, tl - 1));
vo[o + TL1] = 0;
vo[o + TL2] = 0;
const share = 1 + (ns - 1) * (def.afterLevel ?? 1);
vo[o + WGAIN] = GUIDE_GAIN / share * Math.pow(GUIDE_REF / f0, 0.73) * vo[o + NORM];
}
}
/**
* 導波管の弦を 1 本張る。
*
* ループは 遅延線 → 損失(1 次のローパス)→ 硬さ(1 次のオールパス 6 段)→
* 端数(1 次のオールパス)→ 遅延線。1 周の長さが基音の周期になるように、
* 損失と硬さが食う遅れを差し引いて遅延の長さを決める。
*
* 硬さは、上の倍音ほど 1 周を短くして高くずらす。何番目かの倍音が
* 共振器の束と同じ高さ(n f sqrt(1 + B n^2))に来るまで、オールパスの係数を二分法で探す
*/
string(v, s, f, t60, damp, bb) {
const sr = sampleRate, wg = this.wg;
const wi = (v * WS + s) * WK;
const L0 = sr / f;
const w0 = TAU * f / sr;
const g = Math.pow(10, -3 * L0 / (sr * t60));
let a = 0;
const f1 = Math.min(2000, 0.35 * sr);
if (f1 > 1.5 * f && damp > 0) {
const t1 = t60 / (1 + damp * (f1 / 1000) * (f1 / 1000));
const r = Math.pow(10, -3 * L0 / sr * (1 / t1 - 1 / t60));
const q = r * r, c1 = Math.cos(TAU * f1 / sr);
if (q < 1) a = ((1 - q * c1) - Math.sqrt(Math.max(0, (1 - q * c1) ** 2 - (1 - q) ** 2))) / (1 - q);
}
const ap = (c, w) => -(Math.atan2(-Math.sin(w), c + Math.cos(w))
- Math.atan2(-c * Math.sin(w), 1 + c * Math.cos(w))) / w;
const lossD = (w) => a === 0 ? 0 : Math.atan2(a * Math.sin(w), 1 - a * Math.cos(w)) / w;
const fit = (c) => {
const rest = L0 - lossD(w0) - AP * ap(c, w0);
const N = Math.floor(rest - 0.5);
if (N < 2 || N >= WR - 1) return null;
const d = rest - N;
return { N, eta: (1 - d) / (1 + d) };
};
let c = 0;
const nt = Math.max(2, Math.min(12, Math.floor(0.3 * sr / f)));
if (bb > 0) {
const ft = nt * f * Math.sqrt(1 + bb * nt * nt);
const wt = TAU * ft / sr;
const err = (c) => {
const z = fit(c);
if (!z) return -1;
return z.N + lossD(wt) + AP * ap(c, wt) + ap(z.eta, wt) - nt * sr / ft;
};
if (err(0) > 0) {
let lo = -0.95, hi = 0;
for (let k = 0; k < 28; k++) {
const mid = (lo + hi) / 2;
if (err(mid) > 0) hi = mid; else lo = mid;
}
c = hi;
}
}
const z = fit(c) || fit(0);
wg.fill(0, wi, wi + WK);
wg[wi + WN] = z.N;
wg[wi + WETA] = z.eta;
wg[wi + WC] = c;
wg[wi + WGG] = g;
wg[wi + WA] = a;
wg[wi + WT60] = t60;
wg[wi + WL] = L0;
this.wring.fill(0, (v * WS + s) * WR, (v * WS + s + 1) * WR);
}
/**
* 押さえ替えのノイズ(modalHandling)を鳴らす声を張る。共振器も導波管も頭も持たない。
* キュッは、指が巻き弦の上を滑り、巻き線の段差を 1 つずつなぞる音。段差を通る速さが高さになるので、
* 滑っているあいだの速さはほぼ一定とみて、高さは動かさない。
* チッは、高さを動かさずに雑音を多めにした短いもの
*/
squeak(v, def, ev, off) {
const vo = this.voice, o = v * K, sr = sampleRate;
vo[o + ON] = 1;
vo[o + NM] = 0; vo[o + WG] = 0;
vo[o + LEN] = 0; vo[o + POS] = R;
vo[o + DIRECT] = 0; vo[o + RATTLE] = 0; vo[o + BZ] = 0; vo[o + RENV] = 0;
vo[o + PK] = 0; vo[o + PD] = 0; vo[o + WD] = 0; vo[o + TD] = 0; vo[o + TR] = 0;
vo[o + LEVEL] = def.level == null ? 0.5 : def.level;
vo[o + OFF] = off;
vo[o + BORN] = ++this.born;
vo[o + REL] = -1;
vo[o + SQ] = ev.v;
vo[o + SQP] = 0; vo[o + SQT] = -off; vo[o + SQH] = 0; this.sqLp[v] = 0; this.sqBp[v] = 0;
vo[o + SQL] = Math.max(1, Math.round(ev.sqLen * sr));
vo[o + SQF] = ev.sqF; vo[o + SQB] = ev.sqB; vo[o + SQN] = ev.sqN ?? 0.15; vo[o + SQC] = ev.sqHp || 0; vo[o + SQLP] = ev.sqLp || 0;
this.seed[v] = (ev.sqSeed | 0) * 2654435761 + 1 >>> 0 || 1;
if (ev.bend && ev.from) {
for (const e of ev.from) {
if (e.vx == null || e.vb == null) continue;
const w = e.vx * K;
if (!vo[w + ON] || vo[w + BORN] !== e.vb) continue;
vo[w + BNS] = ev.bend; vo[w + BNC] = 0; vo[w + BNT] = -off; vo[w + BNL] = vo[o + SQL]; vo[w + BNF] = 0;
}
}
}
/** 押さえ替えのノイズを vb へ足す。終わったら大きさを 0 にする */
squeakRender(v) {
const vo = this.voice, vb = this.vb, o = v * K, sr = sampleRate;
const amp = vo[o + SQ], len = vo[o + SQL], fpk = vo[o + SQF], fb = vo[o + SQB], nm = vo[o + SQN];
let t = vo[o + SQT], ph = vo[o + SQP], hp = vo[o + SQH], lp = this.sqLp[v], sd = this.seed[v], b1 = this.sqBp[v];
const a = Math.exp(-TAU * (vo[o + SQC] || 400) / sr);
const c = 1 - Math.exp(-TAU * Math.min(vo[o + SQLP] || (fpk > 0 ? 8000 : 4000), sr * 0.4) / sr);
for (let i = 0; i < B && t < len; i++, t++) {
if (t < 0) continue;
const u = t / len;
let f, env;
if (fpk > 0) {
f = fpk;
env = Math.min(1, t / (0.004 * sr)) * Math.min(1, (len - t) / Math.min(0.012 * sr, 0.4 * len));
} else {
f = fb;
env = Math.sin(Math.PI * u);
}
const pp = ph;
ph += f / sr;
if (ph >= 1) ph -= 1;
sd ^= sd << 13; sd >>>= 0; sd ^= sd >>> 17; sd ^= sd << 5; sd >>>= 0;
const z = sd / 2147483648 - 1;
let x;
if (fpk > 0) {
if (ph < pp) {
b1 += 1 + 0.4 * z;
ph -= 0.3 * (0.5 + 0.5 * z);
}
const cl = b1;
b1 *= 0.55;
x = (1 - nm) * cl * 2.2 + nm * z * 0.5;
} else {
const w = Math.sin(TAU * ph) + 0.25 * Math.sin(2 * TAU * ph);
x = (1 - nm) * w + nm * z;
}
lp += c * (x - lp);
const y = lp - hp;
hp = lp + a * (hp - lp);
vb[i] += amp * env * y;
}
vo[o + SQT] = t; vo[o + SQP] = ph; vo[o + SQH] = hp; this.sqLp[v] = lp; this.seed[v] = sd; this.sqBp[v] = b1;
if (t >= len) vo[o + SQ] = 0;
}
/** 導波管の弦を回して vb へ足す。まだ鳴っている弦の数を返す */
strings(v, live) {
const vo = this.voice, wg = this.wg, ring = this.wring, vb = this.vb;
const o = v * K;
const hb = this.tb;
if (live) {
const c = vo[o + TC], a1 = vo[o + TA1], a2 = vo[o + TA2];
let l1 = vo[o + TL1], l2 = vo[o + TL2];
for (let i = 0; i < B; i++) {
const x = this.hb[i];
l1 += c * (x - l1);
const y1 = (1 - a1) * x + a1 * 1.4142 * l1;
l2 += c * (y1 - l2);
hb[i] = (1 - a2) * y1 + a2 * 1.4142 * l2;
}
vo[o + TL1] = l1; vo[o + TL2] = l2;
}
const ns = vo[o + WG];
const gin = vo[o + WGAIN];
let alive = 0;
for (let s = 0; s < ns; s++) {
const wi = (v * WS + s) * WK;
const N = wg[wi + WN];
if (!N) continue;
const rb = (v * WS + s) * WR;
const eta = wg[wi + WETA], c = wg[wi + WC], a = wg[wi + WA];
const gg = wg[wi + WGG] * (1 - a);
const gl = gin * wg[wi + WLV];
let lp = wg[wi + WLP], t1 = wg[wi + WT1], t2 = wg[wi + WT2], wp = wg[wi + WP];
let e = 0;
for (let i = 0; i < B; i++) {
let rd = wp - N;
if (rd < 0) rd += WR;
const x = ring[rb + rd];
lp = gg * x + a * lp;
let u = lp;
for (let k = 0; k < AP; k++) {
const j = wi + WAPS + 2 * k;
const y = c * u + wg[j] - c * wg[j + 1];
wg[j] = u; wg[j + 1] = y; u = y;
}
const yt = eta * u + t1 - eta * t2;
t1 = u; t2 = yt;
ring[rb + wp] = live ? yt + hb[i] : yt;
if (++wp >= WR) wp = 0;
vb[i] += x * gl;
e += x * x;
}
wg[wi + WLP] = lp; wg[wi + WT1] = t1; wg[wi + WT2] = t2; wg[wi + WP] = wp;
if (!live && e < B * QUIET * QUIET) wg[wi + WQ] += B;
else wg[wi + WQ] = 0;
if (wg[wi + WQ] > N + B) wg[wi + WN] = 0;
else alive++;
}
return alive;
}
/**
* 押さえたまま滑らせる。フレットを 1 つ越えるごとに半音ずつ、音の高さに付いていく共振器を
* ずらす。滑る速さは一定なので、越える時刻は等しく並ぶ。
* 振れの大きさと位相はそのまま、高さだけを変える(y2 を新しい高さで作り直す)
*/
bend(v) {
const vo = this.voice, md = this.modes, o = v * K;
const steps = vo[o + BNS], len = vo[o + BNL];
const t = vo[o + BNT] + B;
vo[o + BNT] = t;
const u = Math.min(1, Math.max(0, t / len));
const want = vo[o + BNF] ? steps * u : Math.sign(steps) * Math.min(Math.abs(steps), Math.floor(u * Math.abs(steps) + 1e-9));
const d = want - vo[o + BNC];
if (d) {
const ratio = Math.pow(2, d / 12);
for (let k = 0; k < vo[o + NM]; k++) {
const m = (v * M + k) * S;
if (!md[m + 8]) continue;
const c = md[m + 5], s = md[m + 6], y1 = md[m + 3], y2 = md[m + 4];
const w = Math.atan2(s, c) * ratio;
if (w >= Math.PI * 0.9) { md[m + 3] = 0; md[m + 4] = 0; md[m + 2] = 0; continue; }
const c2 = Math.cos(w), s2 = Math.sin(w);
const ac = (y1 * c - y2) / s;
md[m + 4] = y1 * c2 - ac * s2;
md[m] = 2 * Math.sqrt(md[m + 1]) * c2;
md[m + 2] = md[m + 2] / s * s2;
md[m + 5] = c2; md[m + 6] = s2;
}
vo[o + BNC] = want;
}
if (u >= 1) vo[o + BNS] = 0;
}
/** 離す。減衰を縮めるだけで、鳴っている形は崩さない */
release(v) {
const vo = this.voice, md = this.modes, sr = sampleRate;
const o = v * K;
const rt = vo[o + RELT];
vo[o + REL] = -1;
for (let s = 0; s < vo[o + WG]; s++) {
const wi = (v * WS + s) * WK;
if (this.wg[wi + WT60] <= rt) continue;
this.wg[wi + WGG] = Math.pow(10, -3 * this.wg[wi + WL] / (sr * rt));
this.wg[wi + WT60] = rt;
}
for (let k = 0; k < vo[o + NM]; k++) {
const m = (v * M + k) * S;
if (md[m + 7] <= rt) continue;
const r = Math.exp(-LN1000 / (rt * sr));
md[m] = 2 * r * md[m + 5];
md[m + 1] = r * r;
md[m + 7] = rt;
}
}
/** 頭の塊を作る。終わっていたら false */
head(v) {
const vo = this.voice, hb = this.hb, ring = this.ring;
const o = v * K;
hb.fill(0);
let pos = vo[o + POS];
const len = vo[o + LEN];
const comb = vo[o + COMB];
const ci = Math.floor(comb), cf = comb - ci;
const lpc = vo[o + LPC];
const nz = vo[o + NOISE], vary = vo[o + VARY], amp = vo[o + AMP], felt = vo[o + FELT];
const gn = vo[o + GN], gl = vo[o + GL], gb = v * G * 2, gr = this.grain;
let lp1 = vo[o + LP1], lp2 = vo[o + LP2];
let hp = vo[o + HPOS];
let sd = this.seed[v], fr = this.free;
const base = v * R;
const off = vo[o + OFF];
vo[o + OFF] = 0;
const bla = vo[o + BLA], bb = this.bb;
let blive = false;
bb.fill(0);
if (bla > 0) {
const rise = vo[o + BLR], fall = vo[o + BLF], c = vo[o + BLC];
let t = vo[o + BLP], h1 = vo[o + BH1], h2 = vo[o + BH2], fr2 = this.free;
for (let i = off; i < B; i++) {
const env = (1 - Math.exp(-t / rise)) * Math.exp(-t / fall);
fr2 ^= fr2 << 13; fr2 >>>= 0; fr2 ^= fr2 >>> 17; fr2 ^= fr2 << 5; fr2 >>>= 0;
const x = (fr2 / 2147483648 - 1) * env * bla;
const y1 = x - h1; h1 = c * h1 + (1 - c) * x;
const y2 = y1 - h2; h2 = c * h2 + (1 - c) * y1;
bb[i] = y2;
t++;
}
this.free = fr2;
vo[o + BLP] = t; vo[o + BH1] = h1; vo[o + BH2] = h2;
if (t > fall * 6.9) vo[o + BLA] = 0;
blive = true;
this.bloomOn = true;
}
if (pos >= len + R) return blive;
for (let i = off; i < B; i++) {
let x = 0;
if (pos < len) {
let env;
if (gn > 0) {
env = 0;
for (let k = 0; k < gn; k++) {
const q = pos - gr[gb + k * 2];
if (q >= 0 && q < gl) env += gr[gb + k * 2 + 1] * Math.pow(Math.sin(Math.PI * q / gl), felt);
}
} else {
env = Math.pow(Math.sin(Math.PI * pos / len), felt);
}
sd ^= sd << 13; sd >>>= 0; sd ^= sd >>> 17; sd ^= sd << 5; sd >>>= 0;
fr ^= fr << 13; fr >>>= 0; fr ^= fr >>> 17; fr ^= fr << 5; fr >>>= 0;
const a = sd / 2147483648 - 1, b = fr / 2147483648 - 1;
x = env * amp * ((1 - nz) + nz * 1.7 * ((1 - vary) * a + vary * b));
}
lp1 += lpc * (x - lp1);
lp2 += lpc * (lp1 - lp2);
const y = comb > 0
? lp2 - ((1 - cf) * ring[base + ((hp - ci + R) % R)] + cf * ring[base + ((hp - ci - 1 + R) % R)])
: lp2;
ring[base + hp] = lp2;
hp = (hp + 1) % R;
hb[i] += y;
pos++;
}
vo[o + POS] = pos; vo[o + LP1] = lp1; vo[o + LP2] = lp2; vo[o + HPOS] = hp;
this.seed[v] = sd; this.free = fr;
return true;
}
/**
* 1 声ぶんを 2 本の出口(a と b)へ足す。鳴り終わっていたら声を空ける。
* a は左へ行く束、b は右へ行く束。どこに置くかはエンジンが決める(@p{…} の両側)。
* 畳むときは足し算なので、a + b がいつも声そのものになるように分ける
*/
render(v, a, b, t0) {
const vo = this.voice, md = this.modes, hb = this.hb, vb = this.vb;
const o = v * K;
const live = this.head(v);
const norm = vo[o + NORM];
vb.fill(0);
if (vo[o + BNS]) this.bend(v);
let gd = 1;
const cth = vo[o + BLK], dth = vo[o + BLDK];
if (vo[o + BLD] > 0 && vo[o + BLA] > 0) {
const t = vo[o + BLP];
const env = (1 - Math.exp(-t / vo[o + BLR])) * Math.exp(-t / vo[o + BLF]);
gd = Math.exp(-vo[o + BLD] * env * B);
}
const bon = this.bloomOn, bb = this.bb;
this.bloomOn = false;
let n = vo[o + NM];
for (let k = 0; k < n; k++) {
const m = (v * M + k) * S;
const a1 = md[m], a2 = md[m + 1], b = md[m + 2] * norm;
let y1 = md[m + 3], y2 = md[m + 4];
if (gd < 1 && md[m + 5] > dth) { y1 *= gd; y2 *= gd; }
if (bon && md[m + 5] <= cth) {
for (let i = 0; i < B; i++) {
const y = a1 * y1 - a2 * y2 + b * (hb[i] + bb[i]);
y2 = y1; y1 = y; vb[i] += y;
}
} else if (live) {
for (let i = 0; i < B; i++) {
const y = a1 * y1 - a2 * y2 + b * hb[i];
y2 = y1; y1 = y; vb[i] += y;
}
} else {
for (let i = 0; i < B; i++) {
const y = a1 * y1 - a2 * y2;
y2 = y1; y1 = y; vb[i] += y;
}
const s = md[m + 6];
const e = y1 * y1 + y2 * y2 - 2 * md[m + 5] * y1 * y2;
if (e < QUIET * QUIET * s * s) {
n--;
const last = (v * M + n) * S;
for (let j = 0; j < S; j++) md[m + j] = md[last + j];
k--;
continue;
}
}
md[m + 3] = y1; md[m + 4] = y2;
}
vo[o + NM] = n;
const wgAlive = vo[o + WG] ? this.strings(v, live) : 0;
if (vo[o + SQ] > 0) this.squeakRender(v);
const pk = vo[o + PK], pd = vo[o + PD];
if (pk > 0) {
const off = vo[o + PO], g = PICKUP_SCALE * pk;
const p0 = pickup(off), d0 = pickupSlope(off);
for (let i = 0; i < B; i++) vb[i] = (pickup(off + g * vb[i]) - p0) / (d0 * g);
}
if (pd > 0) {
let pv = vo[o + PV];
for (let i = 0; i < B; i++) {
const q = vb[i];
vb[i] = (q - pv) * pd;
pv = q;
}
vo[o + PV] = pv;
}
const rt = vo[o + RATTLE], bzl = vo[o + BZ], bg = vo[o + BG] || 0.35, rasp = vo[o + BZR];
let renv = vo[o + RENV], sm = vo[o + BZS];
if (rt || bzl) {
let fr = this.free, hp = vo[o + RHP], bp = vo[o + BP];
for (let i = 0; i < B; i++) {
const a = vb[i] < 0 ? -vb[i] : vb[i];
renv += (a > renv ? 0.2 : 0.0015) * (a - renv);
if (renv > bp) bp = renv;
fr ^= fr << 13; fr >>>= 0; fr ^= fr >>> 17; fr ^= fr << 5; fr >>>= 0;
const z = fr / 2147483648 - 1;
let add = rt * renv;
sm += 0.001 * (renv - sm);
if (bzl) {
const pulse = renv > bg * bp && a > 0.5 * renv ? renv - bg * bp : 0;
const smooth = sm > bg * bp ? 0.5 * (sm - bg * bp) : 0;
add += bzl * 3 * (rasp * pulse + (1 - rasp) * smooth);
}
vb[i] += add * (z - hp);
hp = z;
}
this.free = fr; vo[o + RHP] = hp; vo[o + BP] = bp; vo[o + BZS] = sm;
if (renv < 1e-6) renv = 0;
vo[o + RENV] = renv;
}
if (live) {
const dr = vo[o + DIRECT];
if (dr) for (let i = 0; i < B; i++) vb[i] += dr * hb[i];
}
const lv = vo[o + LEVEL];
const mo = vo[o + MO], mr = vo[o + MR];
if (mo > 0 && mr > 0) {
const ph = TAU * ((mr * t0) % 1), step = TAU * mr / sampleRate;
for (let i = 0; i < B; i++) vb[i] *= 1 - mo * (0.5 - 0.5 * Math.cos(ph + step * i));
}
const sw = vo[o + WD] * vo[o + TD], rate = vo[o + TR];
if (sw > 0 && rate > 0) {
const ph = TAU * ((rate * t0) % 1), step = TAU * rate / sampleRate;
for (let i = 0; i < B; i++) {
const y = vb[i] * lv * 0.5, m = sw * Math.sin(ph + step * i);
a[i] += y * (1 + m);
b[i] += y * (1 - m);
}
} else {
for (let i = 0; i < B; i++) {
const y = vb[i] * lv * 0.5;
a[i] += y;
b[i] += y;
}
}
const pn = this.vpat[v];
if (pn) { const sb = this.sym[pn].buf; for (let i = 0; i < B; i++) sb[i] += vb[i] * lv; }
if (!live && n === 0 && renv === 0 && wgAlive === 0 && !(vo[o + SQ] > 0)) vo[o + ON] = 0;
}
/**
* 共鳴弦。弾いていない弦が、高さの合う音につられて鳴る(3 弦 2 フレットの A で、5 弦の開放 A が鳴る)。
* 弦を倍音ずつの共振器にして、そのパッチの声を足したものを流し込む。高さの合う倍音だけが、
* ゆっくり大きくなって長く残る。パッチごとに 1 組なので、声が増えても重くならない。
* sympathetic が 0 なら作らない(2026-10-14。重くなってよいので、オフにできること、と言われた)。
*
* 弦の並び(symTuning):
* - guitar: 開放弦 6 本 × 倍音 10 本。ダンパーは無い。調弦は標準(E A D G B E)だけ
* - piano: 88 鍵 × 倍音 3 本。ダンパーのある弦(F6 より下)は、右ペダルを踏んでいるあいだだけ鳴る。
*   放すとダンパーが 0.12 秒で止める。いちばん上の 20 本ほどはダンパーが無いので、いつも鳴る
*   (調律師の解説。2026-10-14)。踏んでいないあいだ、止まった弦は回さない
* 弾いている弦がそのまま共鳴弦としても鳴るのは、まだ止めていない
*/
symBank(p) {
const def = this.patch[p];
if (!def || !(def.sympathetic > 0) || !def.pitched) return null;
let s = this.sym[p];
if (s && s.def === def) return s;
const sr = sampleRate;
const strings = def.symTuning === 'piano'
? Array.from({ length: 88 }, (_, i) => [21 + i, 3, 21 + i < 89])
: [40, 45, 50, 55, 59, 64].map((m) => [m, 10, false]);
const list = [];
for (const [m, hs, damper] of strings) {
const f0 = 440 * Math.pow(2, (m - 69) / 12), kr = f0 / 261.63;
const t60 = (def.t60 || 2) * Math.pow(kr, -(def.decayKey || 0));
const bb = (def.stretch || 0) * Math.pow(kr, def.stretchKey || 0);
for (let h = 1; h <= hs; h++) {
const f = h * f0 * Math.sqrt(1 + bb * h * h);
if (f >= sr * 0.45) break;
const tt = t60 / (1 + (def.damp || 0) * (f / 1000) * (f / 1000));
const w = TAU * f / sr;
const r = Math.exp(-LN1000 / (Math.max(0.005, tt) * sr)), rd = Math.exp(-LN1000 / (0.12 * sr));
list.push(2 * r * Math.cos(w), r * r, 2 * rd * Math.cos(w), rd * rd, 2 * (1 - r) * Math.sin(w) / h, damper ? 1 : 0);
}
}
const n = list.length / 6;
if (!s || s.n !== n) s = this.sym[p] = { def: null, n, c: null, y: new Float64Array(n * 2), buf: new Float64Array(B), quiet: 0, since: 1e9 };
s.c = Float64Array.from(list);
s.def = def;
return s;
}
/** 右ペダル。踏んでいるあいだは、離した音を止めず、ダンパーのある共鳴弦も鳴らす。踏む・放すでシュッと鳴る */
pedalTo(p, down, off) {
const was = !!this.ped[p];
this.ped[p] = down ? 1 : 0;
const s = this.sym[p];
if (s) s.since = 0;
const def = this.patch[p];
if (def && was !== !!down && def.keyNoise > 0) {
this.start({ p, sq: 1, nf: 1, sqLen: down ? 0.09 : 0.07, sqF: 0, sqB: 3200, sqN: 0.95, sqHp: 700,
sqSeed: (this.born | 0) + 11, v: def.keyNoise * (down ? 0.12 : 0.09) }, off);
}
}
/** 共鳴弦を回して出口へ足す。入ってくる音が無く、鳴りも消えていれば回さない */
symRender(a, b) {
for (const p in this.sym) {
const s = this.symBank(p);
if (!s) continue;
const buf = s.buf, c = s.c, y = s.y, g = s.def.sympathetic * (s.def.symTuning === 'piano' ? 0.25 : 1);
const pedal = !!this.ped[p];
const skipDamped = !pedal && s.since > 0.4 * sampleRate;
s.since += B;
let inE = 0;
for (let i = 0; i < B; i++) inE += buf[i] * buf[i];
if (inE === 0 && s.quiet) { buf.fill(0); continue; }
let e = 0;
for (let k = 0; k < s.n; k++) {
const j = 6 * k, damped = c[j + 5] && !pedal;
if (damped && skipDamped) { y[2 * k] = 0; y[2 * k + 1] = 0; continue; }
const a1 = damped ? c[j + 2] : c[j], a2 = damped ? c[j + 3] : c[j + 1], bk = c[j + 4];
let y1 = y[2 * k], y2 = y[2 * k + 1];
for (let i = 0; i < B; i++) {
const v = a1 * y1 - a2 * y2 + bk * buf[i];
y2 = y1; y1 = v;
const o = g * v;
a[i] += o; b[i] += o;
}
y[2 * k] = y1; y[2 * k + 1] = y2;
e += y1 * y1 + y2 * y2;
}
s.quiet = e < 1e-14 ? 1 : 0;
if (s.quiet) y.fill(0);
buf.fill(0);
}
}
process(inputs, outputs) {
const chs = outputs[0];
const out = chs[0], rb = chs.length > 1 ? chs[1] : this.ob;
out.fill(0);
rb.fill(0);
const sr = sampleRate;
const t0 = currentTime;
const tEnd = t0 + B / sr;
const vo = this.voice;
for (const p in this.pedIv) {
const iv = this.pedIv[p];
let down = false;
for (const [k, [a, b]] of iv) {
if (b < t0 - 1) { iv.delete(k); continue; }
if (a <= t0 && t0 < b) down = true;
}
if (down !== !!this.ped[p]) this.pedalTo(p, down, 0);
}
for (let v = 0; v < V; v++) {
const o = v * K;
if (vo[o + ON] && vo[o + REL] >= 0 && vo[o + REL] < tEnd && !this.ped[this.vname[v]]) this.release(v);
}
while (this.at < this.events.length && this.events[this.at].s0 < tEnd) {
const ev = this.events[this.at++];
if (ev.ped != null) { this.pedalTo(ev.p, ev.ped, Math.max(0, Math.min(B - 1, Math.round((ev.s0 - t0) * sr)))); continue; }
this.start(ev, Math.max(0, Math.min(B - 1, Math.round((ev.s0 - t0) * sr))));
if (ev.vx != null) ev.vb = this.voice[ev.vx * K + BORN];
}
for (let v = 0; v < V; v++) if (vo[v * K + ON]) this.render(v, out, rb, t0);
this.symRender(out, rb);
if (this.cutAt >= 0) {
const len = Math.max(1, Math.round(sr * 0.01));
for (let i = 0; i < out.length; i++) {
const k = Math.max(0, 1 - this.cutAt / len);
out[i] *= k;
rb[i] *= k;
this.cutAt++;
}
if (this.cutAt >= len) { vo.fill(0); this.cutAt = -1; this.ped = {}; this.pedIv = {}; for (const p in this.sym) this.sym[p].y.fill(0); }
}
if (chs.length === 1) for (let i = 0; i < out.length; i++) out[i] += rb[i];
for (let c = 2; c < chs.length; c++) chs[c].fill(0);
return true;
}
}
registerProcessor('${Y}', ModalBank);`;function Be(e){let t=e|0||1;return()=>{t=t+1831565813|0;let o=Math.imul(t^t>>>15,1|t);return o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}var Ae=[[.851,.0201,.93],[1,1,1],[1.19,.0101,1],[1.429,.0505,.6],[1.775,.0192,1.5],[1.842,.0149,.43],[1.994,.3314,.61],[2.137,.1304,.61],[2.23,.2121,.99],[2.444,.4484,1.5],[2.625,.057,1.5],[2.801,.1512,1.5],[2.959,.4411,1.35],[3.138,.1143,.63],[3.208,.1217,.47],[3.38,.4639,.4],[3.449,.1993,1.5],[3.649,.0656,1.5],[3.765,.0649,1.5],[4.006,.259,1.5],[4.082,.2687,1.47],[4.247,.0642,1.18],[4.371,.0257,.33],[4.516,.0238,1.5],[4.605,.0428,.38],[4.769,.0426,1.5],[4.852,.0623,.89],[4.913,.0517,.75],[5.075,.0893,1.5],[5.172,.0394,1.09],[5.331,.0404,1.38],[5.732,.0521,1.5],[5.843,.1274,.86],[5.925,.0619,1.36],[6.046,.0449,1.5],[6.195,.1026,.82],[6.415,.082,.82],[6.839,.1818,.46],[6.997,.1211,1.5],[7.189,.035,.49],[7.926,.0535,.85],[8.017,.0455,1.5],[8.13,.0936,1.5],[8.254,.1245,.95],[8.437,.0634,.92],[9.282,.1088,1.29],[9.355,.1144,1.47],[9.476,.1355,1.5],[10.878,.1461,1.5],[10.956,.1024,1.5],[11.074,.3567,1],[12.462,.1162,.49],[13.336,.2774,.62]],qe=[[.76,.3,.12],[1,1,1],[1.006,.35,1],[1.5,.55,1.15],[1.32,.05,.25],[1.985,.25,1],[2.44,.11,.8],[2.86,.18,.65],[3.25,.32,.5],[3.7,.27,.45],[4.15,.33,.4],[4.6,.22,.35],[5.05,.16,.3]],C=[1,1.594,2.136,2.296,2.653,2.918,3.156,3.501,3.6,3.652,4.06,4.154,4.23,4.601,4.651,4.832,5.061,5.131,5.412,5.473];var Z={sharp:{live:!1,group:"head",min:.2,max:300,unit:"ms",desc:null},bright:{live:!1,group:"head",min:0,max:1,desc:null},comb:{live:!1,group:"head",min:0,max:.5,desc:null},noise:{live:!1,group:"head",min:0,max:1,desc:null},vary:{live:!1,group:"head",min:0,max:1,when:[{key:"head.noise",gt:0}],desc:null},seed:{live:!1,group:"head",min:1,max:9999,step:1,when:[{key:"head.noise",gt:0},{key:"head.vary",lt:1}],desc:null},felt:{live:!1,group:"head",min:0,max:8,desc:null},grains:{live:!1,group:"head",min:0,max:32,step:1,desc:null},scatter:{live:!1,group:"head",min:0,max:40,unit:"ms",when:[{key:"head.grains",gt:0}],desc:null},align:{live:!1,group:"head",min:0,max:1,desc:null},velo:{live:!1,group:"head",min:0,max:6,unit:"oct",desc:null},hardKey:{live:!1,group:"head",min:0,max:2,desc:null},bloom:{live:!1,group:"head",min:0,max:400,desc:null},bloomVelo:{live:!1,group:"head",min:1,max:12,when:[{key:"head.bloom",gt:0}],desc:null},bloomRise:{live:!1,group:"head",min:.02,max:2,unit:"s",when:[{key:"head.bloom",gt:0}],desc:null},bloomFall:{live:!1,group:"head",min:.1,max:6,unit:"s",when:[{key:"head.bloom",gt:0}],desc:null},bloomFrom:{live:!1,group:"head",min:200,max:8e3,unit:"Hz",when:[{key:"head.bloom",gt:0}],desc:null},bloomDrain:{live:!1,group:"head",min:0,max:60,unit:"dB/s",when:[{key:"head.bloom",gt:0}],desc:null},bloomDrainBelow:{live:!1,group:"head",min:50,max:2e3,unit:"Hz",when:[{key:"head.bloomDrain",gt:0}],desc:null},hardFrom:{live:!1,group:"head",min:20,max:2e3,unit:"Hz",when:[{key:"head.hardKey",gt:0}],desc:null},count:{live:!1,group:"modes",min:1,max:1024,step:1,desc:null},stretch:{live:!1,group:"modes",min:0,max:.01,desc:null},pickupAt:{live:!1,group:"modes",min:0,max:.5,desc:null},pickupDepth:{live:!1,group:"modes",min:0,max:3,when:[{key:"pickupAt",gt:0}],desc:null},pickupPeak:{live:!1,group:"modes",min:500,max:8e3,unit:"Hz",when:[{key:"pickupAt",gt:0}],desc:null},pickupPeakGain:{live:!1,group:"modes",min:0,max:18,unit:"dB",when:[{key:"pickupAt",gt:0}],desc:null},attackBend:{live:!1,group:"modes",min:0,max:100,unit:"cents",desc:null},attackBendTime:{live:!1,group:"modes",min:.005,max:.3,unit:"s",when:[{key:"attackBend",gt:0}],desc:null},bStretch:{live:!1,group:"modes",min:0,max:.01,desc:null},stretchKey:{live:!1,group:"modes",min:0,max:3,desc:null},strings:{live:!1,group:"modes",min:1,max:3,step:1,desc:null},detune:{live:!1,group:"modes",min:0,max:50,unit:"cent",when:[{key:"strings",gt:1}],desc:null},tilt:{live:!1,group:"modes",min:0,max:3,desc:null},warp:{live:!1,group:"modes",min:.5,max:1.5,desc:null},spread:{live:!1,group:"modes",min:0,max:.2,desc:null},guide:{live:!1,group:"modes",min:0,max:2e3,unit:"Hz",desc:null},trebleGain:{live:!1,group:"out",min:0,max:12,unit:"dB",desc:null},sour:{live:!1,group:"modes",min:0,max:100,unit:"cent",desc:null},sourSeed:{live:!1,group:"modes",min:1,max:9999,step:1,when:[{key:"sour",gt:0}],desc:null},bodyLow:{live:!1,group:"modes",min:0,max:400,unit:"Hz",desc:null},knock:{live:!1,group:"modes",min:0,max:2,desc:null},lo:{live:!1,group:"modes",min:1,max:40,desc:null},hi:{live:!1,group:"modes",min:2,max:80,desc:null},light:{live:!1,group:"modes",min:0,max:1,desc:null},cloud:{live:!1,group:"modes",min:0,max:6,desc:null},t60:{live:!1,group:"decay",min:.02,max:60,unit:"s",desc:null},decayKey:{live:!1,group:"decay",min:0,max:2,desc:null},afterLevel:{live:!1,group:"decay",min:0,max:1,when:[{key:"strings",gt:1}],desc:null},after:{live:!1,group:"decay",min:1,max:10,when:[{key:"strings",gt:1}],desc:null},sympathetic:{live:!1,group:"decay",min:0,max:1,desc:null},damp:{live:!1,group:"decay",min:0,max:20,desc:null},harmonic:{live:!1,group:"modes",min:0,max:6,step:1,desc:null},mute:{live:!1,group:"decay",min:0,max:1,desc:null},release:{live:!1,group:"decay",min:.01,max:8,unit:"s",desc:null},direct:{live:!1,group:"out",min:0,max:1,desc:null},rattle:{live:!1,group:"out",min:0,max:4,desc:null},pickup:{live:!1,group:"out",min:0,max:2,desc:null},pickupOffset:{live:!1,group:"out",min:-.5,max:.5,when:[{key:"pickup",gt:0}],desc:null},strike:{live:!1,group:"modes",min:0,max:.5,desc:null},modeDecay:{live:!1,group:"decay",min:0,max:4,desc:null},tube:{live:!1,group:"modes",min:0,max:8,desc:null},motor:{live:!1,group:"out",min:0,max:1,desc:null},motorRate:{live:!1,group:"out",min:.5,max:12,unit:"Hz",when:[{key:"motor",gt:0}],desc:null},width:{live:!1,group:"out",min:0,max:1,desc:null},tremolo:{live:!1,group:"out",min:0,max:1,when:[{key:"width",gt:0}],desc:null},tremoloRate:{live:!1,group:"out",min:.5,max:12,unit:"Hz",when:[{key:"tremolo",gt:0}],desc:null},neighbor:{live:!1,group:"flaw",min:0,max:1,desc:null},double:{live:!1,group:"flaw",min:0,max:1,desc:null},doubleSeed:{live:!1,group:"flaw",min:1,max:9999,step:1,when:[{key:"double",gt:0}],desc:null},buzz:{live:!1,group:"flaw",min:0,max:1,desc:null},buzzSeed:{live:!1,group:"flaw",min:1,max:9999,step:1,when:[{key:"buzz",gt:0}],desc:null},buzzLevel:{live:!1,group:"flaw",min:0,max:2,when:[{key:"buzz",gt:0}],desc:null},buzzRasp:{live:!1,group:"flaw",min:0,max:1,when:[{key:"buzz",gt:0}],desc:null},slip:{live:!1,group:"flaw",min:0,max:1,desc:null},ghost:{live:!1,group:"flaw",min:0,max:1,desc:null},splay:{live:!1,group:"flaw",min:0,max:1,desc:null},spot:{live:!1,group:"flaw",min:0,max:1,desc:null},loose:{live:!1,group:"flaw",min:0,max:1,desc:null},looseFreq:{live:!1,group:"flaw",min:40,max:4e3,unit:"Hz",when:[{key:"loose",gt:0}],desc:null},looseFrom:{live:!1,group:"flaw",min:.02,max:2,when:[{key:"loose",gt:0}],desc:null},stringNoise:{live:!1,group:"flaw",min:0,max:1,desc:null},openRing:{live:!1,group:"flaw",min:0,max:1,desc:null},click:{live:!1,group:"flaw",min:0,max:1,desc:null},rush:{live:!1,group:"flaw",min:0,max:1,desc:null},lift:{live:!1,group:"flaw",min:0,max:1,desc:null},care:{live:!1,group:"flaw",min:0,max:1,desc:null},flawSeed:{live:!1,group:"flaw",min:1,max:9999,step:1,desc:null},silent:{live:!1,group:"out",min:0,max:1,step:1,desc:null},snap:{live:!1,group:"out",min:0,max:1,desc:null},palm:{live:!1,group:"out",min:0,max:1,step:1,when:[{key:"snap",gt:0}],desc:null},thumbBelow:{live:!1,group:"out",min:0,max:400,unit:"Hz",when:[{key:"snap",gt:0}],desc:null},thumbDull:{live:!1,group:"out",min:0,max:1,when:[{key:"snap",gt:0},{key:"thumbBelow",gt:0}],desc:null},thump:{live:!1,group:"out",min:0,max:4,when:[{key:"snap",gt:0},{key:"thumbBelow",gt:0}],desc:null},thumpLen:{live:!1,group:"out",min:.01,max:.2,unit:"s",when:[{key:"thump",gt:0}],desc:null},pullLevel:{live:!1,group:"out",min:0,max:4,when:[{key:"snap",gt:0}],desc:null},pullLow:{live:!1,group:"out",min:0,max:24,unit:"dB",when:[{key:"snap",gt:0},{key:"thumbBelow",gt:0}],desc:null},pullLowDull:{live:!1,group:"out",min:0,max:1,when:[{key:"snap",gt:0},{key:"thumbBelow",gt:0}],desc:null},pullDamp:{live:!1,group:"decay",min:0,max:20,when:[{key:"snap",gt:0}],desc:null},keyNoise:{live:!1,group:"out",min:0,max:1,desc:null},neck:{live:!1,group:"modes",min:0,max:2,step:1,desc:null},roll:{live:!1,group:"out",min:0,max:24,unit:"/s",desc:null},rollJitter:{live:!1,group:"out",min:0,max:.5,when:[{key:"roll",gt:0}],desc:null},rollVary:{live:!1,group:"out",min:0,max:10,unit:"dB",when:[{key:"roll",gt:0}],desc:null},rollSeed:{live:!1,group:"out",min:1,max:9999,step:1,when:[{key:"roll",gt:0}],desc:null},level:{live:!1,group:"out",min:.01,max:4,desc:null}},P={freq:{live:!1,min:40,max:6e3,unit:"Hz",desc:null},gain:{live:!1,min:-18,max:18,unit:"dB",desc:null},resonance:{live:!1,min:0,max:.95,desc:null}},z={brush:{desc:null,series:"membrane",pitched:!1,base:190,head:{sharp:2,bright:.86,comb:.18,noise:.95,vary:.8,seed:7,grains:16,scatter:6},count:20,tilt:.6,warp:1,spread:.02,seed:3,t60:.22,damp:.6,release:.1,direct:.32,rattle:1.6,level:.9,splay:.1,flawSeed:1,range:{"head.sharp":[.8,4],"head.bright":[.7,.95],"head.comb":[0,.4],"head.noise":[.7,1],"head.vary":[.3,1],"head.seed":[1,9999],"head.grains":[4,32],"head.scatter":[1,14],count:[8,60],tilt:[.2,1.2],warp:[.85,1.15],spread:[0,.08],seed:[1,9999],t60:[.08,.6],damp:[0,3],release:[.05,.3],direct:[.1,.6],rattle:[.5,3],level:[.3,2],splay:[0,.4],flawSeed:[1,9999]},macros:{fan:{desc:null,min:0,max:2,neutral:{"head.grains":6,"head.scatter":2,"head.sharp":1.2,"head.bright":.9},levelDb:[-6.4,2.6]}}},brushSweep:{desc:null,series:"membrane",pitched:!1,base:190,head:{sharp:260,bright:.72,comb:.03,noise:1,vary:.8,seed:7,align:1},count:20,tilt:.6,warp:1,spread:.02,seed:3,t60:.22,damp:.6,release:.1,direct:.32,rattle:1.6,level:.9,range:{"head.sharp":[120,300],"head.bright":[.6,.9],"head.comb":[.005,.04],"head.noise":[.85,1],"head.vary":[.3,1],"head.seed":[1,9999],"head.align":[0,1],count:[8,60],tilt:[.2,1.2],warp:[.85,1.15],spread:[0,.08],seed:[1,9999],t60:[.08,.6],damp:[0,3],release:[.05,.3],direct:[.15,.6],rattle:[.5,3],level:[.3,2]}},bass:{desc:null,series:"string",pitched:!0,head:{sharp:4,bright:.875,comb:.226,noise:.6,vary:.3,seed:11,velo:0,felt:1.13,hardKey:.5,hardFrom:60},count:35,stretch:6e-4,strings:2,detune:0,after:6,afterLevel:.35,tilt:.635,warp:1,spread:0,t60:2,decayKey:.3,damp:20,release:.09,body:[{freq:65,gain:10,resonance:.6},{freq:200,gain:-12,resonance:.3}],bodyLow:95,direct:0,rattle:0,level:.82,buzz:0,buzzSeed:1,buzzLevel:.15,buzzRasp:0,slip:.04,ghost:.03,flawSeed:1,neck:2,range:{neck:[2,2],"head.sharp":[2,8],"head.bright":[.6,.95],"head.comb":[.1,.35],"head.noise":[.2,.8],"head.vary":[0,.6],"head.seed":[1,9999],"head.velo":[0,1.5],"head.felt":[0,3],"head.hardKey":[0,1],"head.hardFrom":[40,120],count:[12,60],stretch:[0,.001],strings:[1,2],detune:[0,3],tilt:[.4,1.2],warp:[.95,1.05],spread:[0,.02],t60:[1.5,4],decayKey:[.1,.5],damp:[8,20],release:[.05,.2],bodyLow:[60,120],"body.0.freq":[55,80],"body.0.gain":[4,14],"body.0.resonance":[.4,.8],"body.1.freq":[150,260],"body.1.gain":[-16,-4],"body.1.resonance":[.1,.5],after:[3,8],afterLevel:[.2,.5],direct:[0,.1],rattle:[0,0],level:[.5,1.2],buzz:[0,.4],buzzSeed:[1,9999],buzzLevel:[.05,.6],buzzRasp:[0,.5],slip:[0,.2],ghost:[0,.2],flawSeed:[1,9999]},macros:{upright:{desc:null,min:0,max:2,neutral:{"head.bright":.42,"head.comb":.18,"head.noise":.08,"head.felt":0,"head.hardKey":0,stretch:8e-5,tilt:.7,t60:2.6,decayKey:0,damp:9,"body.0.gain":0,"body.1.gain":0,bodyLow:0,afterLevel:0},levelDb:[-7.3,13.2]}}},fingerBass:{desc:null,series:"string",pitched:!0,head:{sharp:3,bright:.85,comb:.22,noise:.15,vary:.2,seed:13,velo:1,felt:1,hardKey:.3,hardFrom:60},count:40,stretch:2e-4,bStretch:6e-4,pickupAt:0,pickupDepth:1.6,pickupPeak:2500,pickupPeakGain:6,strings:2,detune:0,after:3,afterLevel:.5,tilt:.8,warp:1,spread:0,t60:8,decayKey:.3,damp:4,mute:0,release:.08,direct:0,rattle:0,level:.17,neck:1,harmonic:0,range:{neck:[1,1],harmonic:[0,6],"head.sharp":[1,4],"head.bright":[.7,.98],"head.comb":[.08,.3],"head.noise":[0,.4],"head.vary":[0,.5],"head.seed":[1,9999],"head.velo":[0,2],"head.felt":[0,3],"head.hardKey":[0,.8],"head.hardFrom":[40,120],count:[25,60],stretch:[0,6e-4],bStretch:[0,.002],pickupAt:[0,.3],pickupDepth:[.5,2.5],pickupPeak:[1200,5e3],pickupPeakGain:[0,12],strings:[1,2],detune:[0,2],tilt:[.3,1],warp:[.98,1.02],spread:[0,.01],after:[1,5],afterLevel:[.2,.8],t60:[4,16],decayKey:[0,.6],damp:[1,10],mute:[0,1],release:[.04,.2],direct:[0,.05],rattle:[0,0],level:[.08,.4]}},pickBass:{desc:null,series:"string",pitched:!0,head:{sharp:.7,bright:.92,comb:.21,noise:.8,vary:.2,seed:13,velo:1,felt:1,hardKey:0,hardFrom:60},count:50,stretch:2e-4,bStretch:6e-4,pickupAt:0,pickupDepth:1.6,pickupPeak:2500,pickupPeakGain:6,strings:2,detune:0,after:3,afterLevel:.5,tilt:.93,warp:1,spread:0,t60:8,decayKey:.3,damp:4,mute:0,release:.08,direct:0,rattle:0,level:1.7,neck:1,harmonic:0,range:{neck:[1,1],harmonic:[0,6],"head.sharp":[.3,3],"head.bright":[.8,.99],"head.comb":[.08,.3],"head.noise":[.3,1],"head.vary":[0,.5],"head.seed":[1,9999],"head.velo":[0,2],"head.felt":[0,3],"head.hardKey":[0,.8],"head.hardFrom":[40,120],count:[25,60],stretch:[0,6e-4],bStretch:[0,.002],pickupAt:[0,.3],pickupDepth:[.5,2.5],pickupPeak:[1200,5e3],pickupPeakGain:[0,12],strings:[1,2],detune:[0,2],tilt:[.3,1],warp:[.98,1.02],spread:[0,.01],after:[1,5],afterLevel:[.2,.8],t60:[4,16],decayKey:[0,.6],damp:[1,10],mute:[0,1],release:[.04,.2],direct:[0,.05],rattle:[0,0],level:[.8,3]}},slapBass:{desc:null,series:"string",pitched:!0,head:{sharp:.58,bright:.93,comb:.15,noise:1,vary:.2,seed:13,velo:1,felt:1,hardKey:0,hardFrom:60},count:60,stretch:2e-4,bStretch:6e-4,attackBend:100,attackBendTime:.06,pickupAt:0,pickupDepth:1.6,pickupPeak:2500,pickupPeakGain:6,strings:2,detune:0,after:3,afterLevel:.5,tilt:.83,warp:1,spread:0,t60:8,decayKey:.3,damp:2,mute:0,release:.08,snap:.18,thumbBelow:70,thumbDull:.43,thump:3,thumpLen:.1,pullLevel:1.41,pullLow:3,pullLowDull:.35,pullDamp:.5,buzz:1,buzzSeed:1,buzzLevel:.02,buzzRasp:.6,direct:0,rattle:0,level:.7,neck:1,range:{neck:[1,1],"head.sharp":[.3,1.5],"head.bright":[.85,.98],"head.comb":[.1,.3],"head.noise":[.5,1],"head.vary":[0,.5],"head.seed":[1,9999],"head.velo":[0,2],"head.felt":[0,3],"head.hardKey":[0,.8],"head.hardFrom":[40,120],count:[40,60],stretch:[0,6e-4],bStretch:[0,.002],attackBend:[30,100],attackBendTime:[.03,.1],pickupAt:[0,.3],pickupDepth:[.5,2.5],pickupPeak:[1200,5e3],pickupPeakGain:[0,12],strings:[1,2],detune:[0,2],tilt:[.7,1.3],warp:[.98,1.02],spread:[0,.01],after:[1,5],afterLevel:[.2,.8],t60:[4,16],decayKey:[0,.6],damp:[.5,5],mute:[0,1],release:[.04,.2],snap:[.1,.5],thumbBelow:[50,100],thumbDull:[.05,.6],thump:[0,4],thumpLen:[.05,.15],pullLevel:[.7,2],pullLow:[0,12],pullLowDull:[0,.6],pullDamp:[.2,3],buzz:[0,1],buzzSeed:[1,9999],buzzLevel:[0,.4],buzzRasp:[0,1],direct:[0,.05],rattle:[0,0],level:[.3,3]}},bassSlap:{desc:null,draft:!0,series:"string",pitched:!0,head:{sharp:2.5,bright:.92,comb:.226,noise:.3,vary:.3,seed:11,velo:0,felt:1.13,hardKey:.5,hardFrom:60},count:50,stretch:6e-4,strings:2,detune:0,after:4,afterLevel:.2,tilt:.635,warp:1,spread:0,t60:1.4,decayKey:.3,damp:10,release:.09,body:[{freq:65,gain:10,resonance:.6},{freq:200,gain:-12,resonance:.3}],bodyLow:95,snap:.5,thumbBelow:80,thumbDull:.075,direct:0,rattle:0,level:.69,buzz:0,buzzSeed:1,buzzLevel:.15,buzzRasp:0,slip:.04,ghost:.03,flawSeed:1,neck:2,range:{neck:[2,2],"head.sharp":[1.5,5],"head.bright":[.6,.95],"head.comb":[.1,.35],"head.noise":[.1,.6],"head.vary":[0,.6],"head.seed":[1,9999],"head.velo":[0,1.5],"head.felt":[0,3],"head.hardKey":[0,1],"head.hardFrom":[40,120],count:[30,80],stretch:[0,.001],strings:[1,2],detune:[0,3],tilt:[.4,1.2],warp:[.95,1.05],spread:[0,.02],t60:[.8,3],decayKey:[.1,.5],damp:[5,20],release:[.05,.2],bodyLow:[60,120],"body.0.freq":[55,80],"body.0.gain":[4,14],"body.0.resonance":[.4,.8],"body.1.freq":[150,260],"body.1.gain":[-16,-4],"body.1.resonance":[.1,.5],after:[2,6],afterLevel:[.1,.4],snap:[.3,1],thumbBelow:[60,120],thumbDull:[0,.3],direct:[0,.1],rattle:[0,0],level:[.4,1],buzz:[0,.4],buzzSeed:[1,9999],buzzLevel:[.05,.6],buzzRasp:[0,.5],slip:[0,.2],ghost:[0,.2],flawSeed:[1,9999]}},bassSlapHit:{desc:null,draft:!0,series:"string",pitched:!0,head:{sharp:4,bright:.75,comb:.226,noise:.4,vary:.3,seed:11,velo:0,felt:1.13,hardKey:.5,hardFrom:60},count:30,stretch:6e-4,strings:1,detune:0,after:1,afterLevel:0,tilt:.635,warp:1,spread:0,t60:.1,decayKey:0,damp:10,release:.03,body:[{freq:65,gain:10,resonance:.6},{freq:200,gain:-12,resonance:.3}],bodyLow:95,snap:1,thumbBelow:400,palm:1,direct:0,rattle:0,level:.5,buzz:0,buzzSeed:1,buzzLevel:.15,buzzRasp:0,slip:0,ghost:0,flawSeed:1,neck:0,range:{neck:[0,0],"head.sharp":[2,5],"head.bright":[.6,.9],"head.comb":[.1,.35],"head.noise":[.2,.7],"head.vary":[0,.6],"head.seed":[1,9999],"head.velo":[0,1.5],"head.felt":[0,3],"head.hardKey":[0,1],"head.hardFrom":[40,120],count:[20,50],stretch:[0,.001],strings:[1,1],detune:[0,3],tilt:[.4,1.2],warp:[.95,1.05],spread:[0,.02],t60:[.05,.2],decayKey:[0,0],damp:[5,20],release:[.02,.06],bodyLow:[60,120],"body.0.freq":[55,80],"body.0.gain":[4,14],"body.0.resonance":[.4,.8],"body.1.freq":[150,260],"body.1.gain":[-16,-4],"body.1.resonance":[.1,.5],after:[1,1],afterLevel:[0,0],snap:[.5,1],thumbBelow:[400,400],palm:[1,1],direct:[0,.1],rattle:[0,0],level:[.25,1],buzz:[0,.4],buzzSeed:[1,9999],buzzLevel:[.05,.6],buzzRasp:[0,.5],slip:[0,0],ghost:[0,0],flawSeed:[1,9999]}},guitar:{desc:null,series:"string",pitched:!0,head:{sharp:.6,bright:.88,comb:.258,noise:.43,vary:.3,seed:13,velo:3.3,felt:.18,hardKey:.57},count:160,stretch:31e-6,strings:2,detune:.79,tilt:.41,warp:1,spread:0,body:[{freq:59,gain:16.3,resonance:.95},{freq:209,gain:12.2,resonance:.6},{freq:1087,gain:-16,resonance:.38}],bodyLow:202,t60:3.52,decayKey:.29,after:1.76,afterLevel:.55,damp:.021,release:.1,direct:0,rattle:0,level:.3,buzz:.05,buzzSeed:1,buzzLevel:.05,slip:.01,ghost:0,flawSeed:1,stringNoise:.5,openRing:.5,lift:.3,click:0,rush:0,care:.3,sympathetic:.5,neck:1,range:{neck:[1,1],"head.sharp":[.4,3],"head.bright":[.75,.95],"head.comb":[.18,.3],"head.noise":[.2,.7],"head.vary":[0,.6],"head.seed":[1,9999],"head.velo":[1.5,4.5],"head.felt":[0,1.5],"head.hardKey":[.3,.9],count:[80,240],stretch:[0,15e-5],strings:[1,2],detune:[0,1.5],tilt:[.2,.8],warp:[.99,1.01],spread:[0,.005],bodyLow:[140,220],"body.0.freq":[50,70],"body.0.gain":[10,20],"body.0.resonance":[.8,.95],"body.1.freq":[180,240],"body.1.gain":[6,16],"body.1.resonance":[.5,.9],"body.2.freq":[800,1400],"body.2.gain":[-18,-8],"body.2.resonance":[0,.5],t60:[2,6],decayKey:[.1,.6],after:[1.3,3],afterLevel:[.3,.8],damp:[.005,.1],release:[.05,.3],direct:[0,.05],rattle:[0,0],level:[.1,.8],buzz:[0,.4],buzzSeed:[1,9999],buzzLevel:[.03,.4],slip:[0,.2],ghost:[0,.2],flawSeed:[1,9999],stringNoise:[0,1],openRing:[0,1],lift:[0,1],click:[0,1],rush:[0,1],care:[0,.8],sympathetic:[0,1]},macros:{classical:{desc:null,min:0,max:2,neutral:{"body.0.gain":0,"body.1.gain":0,"body.2.gain":0,bodyLow:0,afterLevel:.2},levelDb:[.1,3.7]},pluck:{desc:null,min:0,max:2,neutral:{"head.comb":.45,"head.bright":.8,tilt:.55},levelDb:[.3,1.8]},nail:{desc:null,min:0,max:2,neutral:{"head.sharp":1.4,"head.noise":.15,"head.felt":0},levelDb:[-1.2,1.3]}}},piano:{desc:null,series:"string",pitched:!0,head:{sharp:.74,bright:.68,comb:.125,noise:.05,vary:.2,seed:5,velo:4.1,hardKey:.22,felt:3.1},count:100,stretch:7e-4,stretchKey:1.25,strings:2,detune:1.2,tilt:.63,warp:1,spread:0,guide:523,knock:.25,sour:0,sourSeed:1,t60:4.1,decayKey:.36,after:4.8,afterLevel:.42,damp:.63,release:.25,direct:0,rattle:0,trebleGain:3.5,level:.16,keyNoise:.3,silent:0,sympathetic:.5,symTuning:"piano",neighbor:.03,double:.05,doubleSeed:2,buzz:0,buzzSeed:1,buzzLevel:.1,flawSeed:1,loose:.05,looseFreq:233,looseFrom:.3,range:{"head.sharp":[.5,2.5],"head.bright":[.55,.8],"head.comb":[.1,.15],"head.noise":[0,.12],"head.vary":[0,.5],"head.seed":[1,9999],"head.velo":[2.5,6],"head.hardKey":[.2,1.2],"head.felt":[1,5],count:[40,160],stretch:[2e-4,.0015],stretchKey:[.8,2],strings:[2,3],detune:[.3,3],tilt:[.5,1.6],warp:[.98,1.02],spread:[0,.005],guide:[300,900],knock:[.1,.5],sour:[0,15],sourSeed:[1,9999],t60:[2,8],decayKey:[.2,.8],after:[2,8],afterLevel:[.2,.8],damp:[.2,.8],release:[.12,.5],direct:[0,.05],rattle:[0,0],trebleGain:[0,8],level:[.12,.8],keyNoise:[0,1],silent:[0,1],sympathetic:[0,1],neighbor:[0,.2],double:[0,.2],doubleSeed:[1,9999],buzz:[0,.1],buzzSeed:[1,9999],buzzLevel:[.03,.4],flawSeed:[1,9999],loose:[0,.3],looseFreq:[100,1e3],looseFrom:[.1,1]},macros:{voicing:{desc:null,min:0,max:2,neutral:{"head.felt":.5,"head.bright":.55,"head.hardKey":0,knock:.15},levelDb:[2.6,-1.2]},size:{desc:null,min:0,max:2,neutral:{stretch:.0016,t60:2.2,after:3},levelDb:[1.7,-.8]},unison:{desc:null,min:0,max:2,neutral:{afterLevel:0,detune:0},levelDb:[-.3,.5]}}},rhodes:{desc:null,series:"tine",pitched:!0,head:{sharp:1.2,bright:.66,comb:.06,noise:.03,vary:.2,seed:9,velo:3.2,hardKey:.9,hardFrom:130,felt:2},count:6,tilt:1.5,warp:1,spread:0,seed:1,strings:2,detune:.8,after:1.8,afterLevel:.6,t60:5,decayKey:.5,damp:.15,release:.22,direct:0,rattle:0,pickup:.7,pickupOffset:.1,level:.23,width:1,tremolo:.5,tremoloRate:4.5,range:{"head.sharp":[.8,3],"head.bright":[.5,.8],"head.comb":[0,.15],"head.noise":[0,.1],"head.vary":[0,.5],"head.seed":[1,9999],"head.velo":[2,5],"head.hardKey":[.5,1.3],"head.hardFrom":[100,200],"head.felt":[.5,4],count:[3,6],tilt:[1.2,2],warp:[.97,1.03],spread:[0,.01],seed:[1,9999],strings:[2,2],detune:[0,3],after:[1,3],afterLevel:[.15,1],t60:[3,9],decayKey:[.2,.8],damp:[0,.5],release:[.12,.4],direct:[0,.05],rattle:[0,0],pickup:[0,1.2],pickupOffset:[-.2,.3],level:[.1,.6],width:[.5,1],tremolo:[0,1],tremoloRate:[2,8]},macros:{rhodes:{desc:null,min:0,max:2,neutral:{pickup:0,pickupOffset:0,afterLevel:.15,after:1,t60:2.5,"head.sharp":.8,"head.velo":1.5,"head.felt":.5,"head.bright":.75},levelDb:[7.9,-11.1]}}},timpani:{desc:null,series:"kettle",pitched:!0,head:{sharp:1.5,bright:.7,comb:0,noise:.12,vary:.2,seed:3,velo:6,felt:8,hardKey:0},count:113,light:0,lo:3.5,hi:40,cloud:3,tilt:.5,warp:1,spread:0,t60:3,decayKey:.3,damp:.02,release:.8,direct:0,rattle:0,level:.08,range:{"head.sharp":[.8,4],"head.bright":[.55,.85],"head.comb":[0,0],"head.noise":[0,.4],"head.vary":[0,.5],"head.seed":[1,9999],"head.velo":[4,6],"head.felt":[4,8],"head.hardKey":[0,.5],count:[60,160],light:[0,1],lo:[2.5,5.5],hi:[25,60],cloud:[1.5,5],tilt:[0,1],warp:[.98,1.02],spread:[0,.01],t60:[1.5,6],decayKey:[0,.6],damp:[0,.1],release:[.2,2],direct:[0,.05],rattle:[0,0],level:[.04,.15]}},timpaniRoll:{desc:null,series:"kettle",pitched:!0,head:{sharp:1.5,bright:.75,comb:0,noise:.12,vary:.2,seed:3,velo:6,felt:8,hardKey:0},count:113,light:0,lo:3.5,hi:40,cloud:3,tilt:.5,warp:1,spread:0,t60:3,decayKey:.3,damp:.02,release:.8,roll:13,rollJitter:.15,rollVary:3,rollSeed:1,direct:0,rattle:0,level:.04,range:{"head.sharp":[.8,4],"head.bright":[.6,.9],"head.comb":[0,0],"head.noise":[0,.4],"head.vary":[0,.5],"head.seed":[1,9999],"head.velo":[4,6],"head.felt":[4,8],"head.hardKey":[0,.5],count:[60,160],light:[0,1],lo:[2.5,5.5],hi:[25,60],cloud:[1.5,5],tilt:[0,1],warp:[.98,1.02],spread:[0,.01],t60:[1.5,6],decayKey:[0,.6],damp:[0,.1],release:[.2,2],roll:[10,16],rollJitter:[.05,.3],rollVary:[1,5],rollSeed:[1,9999],direct:[0,.05],rattle:[0,0],level:[.02,.08]}},gong:{desc:null,series:"gong",pitched:!0,head:{sharp:1.2,bright:.6,comb:0,noise:.1,vary:.2,seed:5,velo:3,felt:8,hardKey:0,bloom:5,bloomVelo:7,bloomRise:.3,bloomFall:1.2,bloomFrom:2500,bloomDrain:25,bloomDrainBelow:200},count:160,light:.5,lo:14,hi:45,cloud:.004,tilt:1.5,warp:1,spread:0,t60:25,decayKey:0,damp:.01,release:3,direct:0,rattle:0,level:.13,range:{"head.sharp":[.8,3],"head.bright":[.5,.8],"head.comb":[0,0],"head.noise":[0,.3],"head.vary":[0,.5],"head.seed":[1,9999],"head.velo":[1,5],"head.felt":[2,8],"head.hardKey":[0,0],"head.bloom":[1,15],"head.bloomVelo":[4,10],"head.bloomRise":[.15,.8],"head.bloomFall":[.5,3],"head.bloomFrom":[1e3,4e3],"head.bloomDrain":[0,40],"head.bloomDrainBelow":[150,400],count:[100,300],light:[0,1],lo:[10,25],hi:[30,80],cloud:[.001,.02],tilt:[.5,2],warp:[.98,1.02],spread:[0,.01],t60:[10,40],decayKey:[0,0],damp:[0,.05],release:[1,6],direct:[0,.05],rattle:[0,0],level:[.08,.5]}},marimba:{desc:null,series:"bar",pitched:!0,head:{sharp:.64,bright:.6,comb:0,noise:.02,vary:.2,seed:7,velo:2.22,felt:.3,hardKey:.11,hardFrom:100},count:4,tilt:.06,warp:1,spread:0,tube:0,trebleGain:4.2,strike:.49,t60:2.14,decayKey:1.13,modeDecay:1.25,damp:0,release:.2,direct:0,rattle:0,level:.36,range:{"head.sharp":[.6,3],"head.bright":[.35,.8],"head.comb":[0,.2],"head.noise":[0,.1],"head.vary":[0,.5],"head.seed":[1,9999],"head.velo":[1,4],"head.felt":[0,3],"head.hardKey":[0,.5],"head.hardFrom":[80,300],count:[3,4],tilt:[0,1],warp:[.99,1.01],spread:[0,.005],tube:[0,3],trebleGain:[0,9],strike:[.3,.5],t60:[1,4],decayKey:[.5,1.5],modeDecay:[.5,1.6],damp:[0,1],release:[.1,.5],direct:[0,.05],rattle:[0,0],level:[.15,.6]}},vibraphone:{desc:null,series:"bar",pitched:!0,head:{sharp:.43,bright:.63,comb:0,noise:.01,vary:.2,seed:13,velo:.51,felt:.47,hardKey:.08,hardFrom:454},count:4,tilt:0,warp:1,spread:0,tube:0,trebleGain:1.5,strike:.49,t60:23,decayKey:.24,modeDecay:1.16,damp:0,release:.15,motor:0,motorRate:5,direct:0,rattle:0,level:.24,range:{"head.sharp":[.2,2],"head.bright":[.45,.8],"head.comb":[0,.2],"head.noise":[0,.05],"head.vary":[0,.5],"head.seed":[1,9999],"head.velo":[.5,4],"head.felt":[0,3],"head.hardKey":[0,.5],count:[3,4],tilt:[0,1],warp:[.99,1.01],spread:[0,.005],tube:[0,2],trebleGain:[0,9],strike:[.3,.5],"head.hardFrom":[80,600],t60:[8,35],decayKey:[0,.4],modeDecay:[.6,1.6],damp:[0,.5],release:[.08,.4],motor:[0,.8],motorRate:[2,8],direct:[0,.03],rattle:[0,0],level:[.1,.4]}},glockenspiel:{desc:null,series:"freebar",pitched:!0,head:{sharp:.2,bright:.94,comb:0,noise:.02,vary:.2,seed:17,velo:1.8,felt:4,hardKey:.28,hardFrom:717},count:5,tilt:0,warp:1,spread:0,trebleGain:0,strike:.44,t60:9.7,decayKey:.1,modeDecay:1.4,damp:0,release:.3,direct:0,rattle:0,level:.21,range:{"head.sharp":[.2,1],"head.bright":[.7,.98],"head.comb":[0,.2],"head.noise":[0,.1],"head.vary":[0,.5],"head.seed":[1,9999],"head.velo":[1,4],"head.felt":[0,4],"head.hardKey":[0,1],count:[3,5],tilt:[0,1],warp:[.98,1.02],spread:[0,.01],trebleGain:[0,9],strike:[.1,.5],"head.hardFrom":[80,1500],t60:[5,18],decayKey:[0,.5],modeDecay:[.6,2.5],damp:[0,.2],release:[.15,.6],direct:[0,.05],rattle:[0,0],level:[.08,.35]}},ride:{desc:null,series:"cymbal",pitched:!1,base:300,head:{sharp:.5,bright:.84,comb:0,noise:.25,vary:.4,seed:19},count:140,lo:1.1,hi:38,tilt:.25,warp:1,spread:0,seed:23,t60:3.5,damp:.004,release:.6,direct:.04,rattle:0,level:.06,spot:.1,flawSeed:1,range:{"head.sharp":[.3,1.5],"head.bright":[.75,.95],"head.comb":[0,.1],"head.noise":[.1,.5],"head.vary":[.1,.8],"head.seed":[1,9999],count:[60,200],lo:[1,2],hi:[20,45],tilt:[.1,.5],warp:[.9,1.1],spread:[0,.05],seed:[1,9999],t60:[2,6],damp:[0,.02],release:[.3,1],direct:[0,.1],rattle:[0,0],level:[.03,.12],spot:[0,.4],flawSeed:[1,9999]},macros:{ride:{desc:null,min:0,max:2,neutral:{t60:.4,tilt:1.5,hi:6,lo:1,damp:.1,"head.bright":.5,"head.noise":0}}}}};function de(e,t,o,r){let h=t.macros&&t.macros[o],l=structuredClone(e);if(!h)return l;if(h.levelDb){let d=r<1?h.levelDb[0]*(1-r):h.levelDb[1]*(r-1)/Math.max(1e-9,(h.max??2)-1);l.macroLevel={...e.macroLevel||{},[o]:Math.pow(10,d/20)}}for(let[d,c]of Object.entries(h.neutral)){let s=d.split("."),i=s[s.length-1],p=s.reduce((x,w)=>x?.[w],t),b=s[0]==="body"?P[i]:Z[i],y=c+r*(p-c);b&&(y=Math.min(b.max,Math.max(b.min,y)));let M=l;for(let x=0;x<s.length-1;x++)M=M[s[x]];M[i]=y}return l}var Q=[1,6.267,17.547,34.386,56.843,84.913],Re=[1,.12,.05,.03,.02,.015],Ne=[1,4,10,15.5],Oe=[1,3.05,5.9,9.26,14.1],ce=[4.73,7.853,10.996,14.137,17.279];function Ee(e,t){let o=ce[Math.min(e,ce.length-1)],r=o*t,h=(Math.cosh(o)-Math.cos(o))/(Math.sinh(o)-Math.sin(o));return Math.abs((Math.cosh(r)+Math.cos(r)-h*(Math.sinh(r)+Math.sin(r)))/2)}var ze=[[110,1,.06],[290,.7,.04],[620,.5,.03],[1400,.35,.02]];function De(e){let t=[],o=Be(e.seed||1),r=e.warp==null?1:e.warp,h=e.spread||0,l=e.tilt==null?1:e.tilt,d=Math.max(1,Math.min(1024,e.count|0||1)),c=(s,i,p,b=0)=>{let y=Math.pow(s,r);h&&(y*=1+h*(o()*2-1)),t.push(y,i,p,b)};if(e.series==="string"){let s=Math.max(1,e.strings|0||1),i=Math.max(1,Math.floor(d/s));for(let p=0;p<s;p++){let b=s===1?0:(e.detune||0)*(p/(s-1)-.5)*2,y=Math.pow(2,b/1200),M=p===0?1:e.after||1,x=p===0?1:e.afterLevel??1,w=1+(s-1)*(e.afterLevel??1);for(let k=1;k<=i;k++)c(k*y,x/(Math.pow(k,l)*w),M,k)}}else if(e.series==="membrane")for(let s=0;s<d;s++){let i=s<C.length?C[s]:C[C.length-1]*(1+.08*(s-C.length+1));c(i,(.5+.5*o())/Math.pow(s+1,l),1/(1+.15*s))}else if(e.series==="bar"||e.series==="freebar"){let s=e.series==="bar"?Ne:Oe;for(let i=0;i<Math.min(d,s.length);i++){let p=e.strike==null?1:Ee(i,e.strike);c(s[i],p*(i===0?1+(e.tube||0):1)/Math.pow(s[i],l),Math.pow(s[i],-(e.modeDecay||0)))}}else if(e.series==="kettle"||e.series==="gong"){let s=e.series==="gong"?Ae:qe,i=Math.max(0,Math.min(1,e.light||0)),p=Math.min(d,s.length),b=s.slice(0,p).map((a,u)=>[a[1]*Math.sqrt(a[2]),u]).sort((a,u)=>u[0]-a[0]),y=Math.max(1,Math.round(p*(1-.6*i))),M=new Set,x=new Set;for(let[,a]of b){let u=Math.round(4*Math.log2(s[a][0]));x.has(u)||(x.add(u),M.add(a))}for(let[,a]of b)M.size<y&&M.add(a);for(let a=0;a<p;a++){if(!M.has(a))continue;let[u,m,f]=s[a];c(u,m,f)}let w=e.lo||3.5,k=Math.max(w*1.01,e.hi||40),L=Math.max(0,d-s.length),A=Math.round(L*(1-.75*i)),v=A>0?Math.sqrt(L/A):0;for(let a=0;a<A;a++){let u=Math.sqrt(w*w+(k*k-w*w)*o()),m=o()<.5?-1:1;c(u,v*m*(e.cloud??0)*(.3+.7*o())*Math.pow(w/u,l),(.3+.3*o())*Math.sqrt(w/u))}}else if(e.series==="tine"){for(let s=0;s<Math.min(d,Q.length);s++)c(Q[s],1/Math.pow(Q[s],e.tilt??1),Re[s]);(e.afterLevel??0)>0&&c(Math.pow(2,(e.detune||0)/1200),e.afterLevel,e.after||1)}else{let s=e.lo||1,i=Math.max(s*1.01,e.hi||40);for(let p=0;p<d;p++){let b=Math.pow(o(),.6),y=Math.exp(Math.log(s)+(Math.log(i)-Math.log(s))*b);c(y,(.3+.7*o())/Math.pow(y/s,l),.5+o())}}if(e.knock)for(let[s,i,p]of ze)t.push(s,i*e.knock,p,-1);return t}function X(e){let t=e.head||{};return{table:De(e),base:e.base||220,head:{sharp:t.sharp??2,bright:t.bright??.6,comb:t.comb??0,noise:t.noise??0,vary:t.vary??0,seed:t.seed??1,velo:t.velo??1.5,hardKey:t.hardKey??0,hardFrom:t.hardFrom??261.63,felt:t.felt??0,align:t.align??0,grains:t.grains??0,scatter:t.scatter??0,bloom:t.bloom??0,bloomVelo:t.bloomVelo??4,bloomDrain:t.bloomDrain??0,bloomDrainBelow:t.bloomDrainBelow??300,bloomRise:t.bloomRise??.3,bloomFall:t.bloomFall??1,bloomFrom:t.bloomFrom??1e3},pitched:!!e.pitched,trebleGain:e.trebleGain??0,tilt:e.tilt??1,sour:e.sour??0,sourSeed:e.sourSeed??1,guide:e.series==="string"?e.guide??0:0,body:(e.body||[]).map(o=>({freq:o.freq,gain:o.gain,resonance:o.resonance})),bodyLow:e.bodyLow??0,strings:e.strings??1,detune:e.detune??0,after:e.after??1,afterLevel:e.afterLevel??1,stretch:e.stretch??0,stretchKey:e.stretchKey??0,bStretch:e.bStretch??0,attackBend:e.attackBend??0,attackBendTime:e.attackBendTime??.05,pickupAt:e.pickupAt??0,pickupDepth:e.pickupDepth??1,pickupPeak:e.pickupPeak??2500,pickupPeakGain:e.pickupPeakGain??0,decayKey:e.decayKey??0,t60:e.t60??2,damp:e.damp??0,mute:e.mute??0,harmonic:e.harmonic??0,release:e.release??.15,direct:e.direct??0,rattle:e.rattle??0,pickup:e.pickup??0,pickupOffset:e.pickupOffset??0,speed:e.series==="tine",width:e.width??0,tremolo:e.tremolo??0,tremoloRate:e.tremoloRate??0,motor:e.motor??0,motorRate:e.motorRate??0,neighbor:e.neighbor??0,double:e.double??0,doubleSeed:e.doubleSeed??1,buzz:e.buzz??0,buzzSeed:e.buzzSeed??1,buzzLevel:e.buzzLevel??.4,buzzRasp:e.buzzRasp??1,slip:e.slip??0,ghost:e.ghost??0,splay:e.splay??0,spot:e.spot??0,flawSeed:e.flawSeed??1,stringNoise:e.stringNoise??0,openRing:e.openRing??0,lift:e.lift??.3,click:e.click??1,rush:e.rush??0,care:e.care??0,loose:e.loose??0,looseFreq:e.looseFreq??233,looseFrom:e.looseFrom??.3,sympathetic:e.sympathetic??0,symTuning:e.symTuning==="piano"?"piano":"guitar",keyNoise:e.keyNoise??0,silent:e.silent?1:0,neck:e.neck??0,snap:e.snap??0,thumbBelow:e.thumbBelow??0,thumbDull:e.thumbDull??.075,thump:e.thump??0,thumpLen:e.thumpLen??.1,pullLevel:e.pullLevel??1,pullLow:e.pullLow??0,pullLowDull:e.pullLowDull??0,pullDamp:e.pullDamp??e.damp??0,palm:e.palm??0,roll:e.roll??0,rollJitter:e.rollJitter??.15,rollVary:e.rollVary??3,rollSeed:e.rollSeed??1,level:(e.level??.5)*Object.values(e.macroLevel||{}).reduce((o,r)=>o*r,1)}}var J="mmsxx-brass";var pe=`const V = 16;
const B = 128;
const SUB = 16;
const TAU = Math.PI * 2;
const ON = 0, PH = 1, P = 2, TGT = 3, AGE = 4, REL = 5, F0 = 6, VEL = 7,
K = 8, DC = 9, NRM = 10, INC = 11, LP = 12, BORN = 13, GONE = 14, OFF = 15, SC = 16, ST = 17,
CR = 18, CD = 19, PG = 20, KG = 21, WR = 22, FR = 23, FS = 24, FE = 25, SG = 26;
const W = 27;
/** e^-x I0(x)。指数で割った形で持つと、大きな x でも桁があふれない */
function i0e(x) {
if (x < 15) {
let s = 1, t = 1;
const q = x * x / 4;
for (let m = 1; m < 60; m++) {
t *= q / (m * m);
s += t;
if (t < s * 1e-12) break;
}
return s * Math.exp(-x);
}
return (1 + 1 / (8 * x) + 9 / (128 * x * x)) / Math.sqrt(TAU * x);
}
/**
* 鳴らす音が、管の何番目の倍音か。スライドやバルブで管が伸びると、倍音の並びの基音は
* pedal から最大 6 半音下がる。基音が pedal 以下に収まる、いちばん小さい番号にする
* (丸めると、低い音で番号が 1 つ小さく出て、裏返りの跳び幅が大きすぎた)
*/
function partialOf(f0, pedal) { return Math.max(1, Math.ceil(f0 / pedal - 1e-6)); }
/**
* 倍音の番号による外れやすさ。番号が大きいほどとなりの倍音が近く、唇が少しずれるだけで
* 隣に乗る。低い音はとなりが遠く(オクターブ、5 度)、めったに外さない。6 番目で 1
*/
function slip(n) { return Math.min(2, Math.pow(n / 6, 1.5)); }
class BrassBank extends AudioWorkletProcessor {
constructor(o) {
super();
const p = (o && o.processorOptions) || {};
this.voice = new Float64Array(V * W);
this.patch = p.patches || {};
this.def = new Array(V).fill(null);
this.events = [];
this.at = 0;
this.born = 0;
this.noise = 0x2545f491;
this.cutAt = -1;
this.last = {};
this.add(p.events || []);
this.port.onmessage = (e) => {
const d = e.data || {};
if (d.patch) this.patch[d.patch] = d.def;
if (d.patches) Object.assign(this.patch, d.patches);
if (d.add) this.add(d.add);
if (d.cut) { this.events = []; this.at = 0; this.cutAt = 0; }
};
}
add(list) {
if (!list.length) return;
const rest = this.events.slice(this.at).concat(list);
rest.sort((a, b) => a.t - b.t);
this.events = rest;
this.at = 0;
}
pick() {
const vo = this.voice;
let best = 0, oldest = Infinity;
for (let v = 0; v < V; v++) {
const o = v * W;
if (!vo[o + ON]) return v;
if (vo[o + BORN] < oldest) { oldest = vo[o + BORN]; best = v; }
}
return best;
}
start(ev, off) {
const def = this.patch[ev.p];
if (!def) return;
const v = this.pick();
const o = v * W;
const vo = this.voice;
vo.fill(0, o, o + W);
vo[o + ON] = 1;
vo[o + F0] = ev.f || 440;
vo[o + VEL] = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
vo[o + TGT] = vo[o + VEL];
vo[o + REL] = ev.t + (ev.d == null ? 1 : ev.d);
vo[o + BORN] = ++this.born;
vo[o + OFF] = off;
vo[o + SC] = ev.s == null ? def.scoop : ev.s;
vo[o + ST] = ev.st == null ? def.scoopTime : ev.st;
vo[o + NRM] = 1;
vo[o + SG] = 1;
const f0 = vo[o + F0], vel = vo[o + VEL];
const reg = Math.min(2, Math.max(0.5, Math.sqrt(f0 / 440)));
vo[o + PG] = (def.push || 0) * vel * reg;
vo[o + KG] = def.keyGain ? Math.pow(10, def.keyGain * Math.log2(f0 / 440) / 20) : 1;
vo[o + CR] = 1;
vo[o + CD] = 0;
const last = this.last[ev.p];
if (def.crack > 0 && def.pedal > 0) {
const n = partialOf(f0, def.pedal);
const leap = last ? Math.min(1, Math.abs(Math.log2(f0 / last))) : 0.5;
const chance = Math.min(1, def.crack * vel * slip(n) * (0.5 + 1.5 * leap));
let h = (Math.round(f0 * 10) | 0) ^ Math.imul(ev.k == null ? Math.round((last || 0) * 10) | 0 : 0, 0x85ebca6b) ^ Math.imul(def.crackSeed | 0, 0x9e3779b1) ^ Math.imul((ev.k ?? -1) + 1, 0x27d4eb2f);
const u = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
if (u() < chance) {
const up = n < 2 || u() < 0.7;
vo[o + CR] = (n + (up ? 1 : -1)) / n;
vo[o + CD] = def.crackTime * (0.6 + 0.8 * u());
}
}
if (def.squeak > 0 && vo[o + CD] === 0) {
const leap = last ? Math.min(1, Math.abs(Math.log2(f0 / last))) : 0.5;
const chance = Math.min(1, def.squeak * vel * (0.5 + 1.5 * leap));
let q = (Math.round(f0 * 10) | 0) ^ Math.imul(ev.k == null ? Math.round((last || 0) * 10) | 0 : 0, 0x2c1b3c6d) ^ Math.imul(def.crackSeed | 0, 0x297a2d39) ^ Math.imul((ev.k ?? -1) + 1, 0x165667b1);
const u = () => { q = Math.imul(q ^ (q >>> 15), 2246822507); q = Math.imul(q ^ (q >>> 13), 3266489909); q ^= q >>> 16; return (q >>> 0) / 4294967296; };
if (u() < chance) {
vo[o + CR] = Math.max(2, Math.round(2800 / f0));
vo[o + CD] = def.crackTime * (0.5 + 0.5 * u());
vo[o + SG] = 0.3;
}
}
this.last[ev.p] = f0;
let w = (Math.round(f0 * 10) | 0) ^ Math.imul(def.crackSeed | 0, 0x51ed270b) ^ Math.imul((ev.k ?? -1) + 1, 0x7feb352d);
w = Math.imul(w ^ (w >>> 16), 0x45d9f3b); w ^= w >>> 16;
vo[o + WR] = (w >>> 0) || 1;
vo[o + FR] = 1;
vo[o + FS] = -1;
vo[o + FE] = -1;
this.def[v] = def;
}
/** 明るさ・音程・正規化を作り直す。16 サンプルに 1 回 */
control(v, sr) {
const vo = this.voice, d = this.def[v];
const o = v * W;
const f0 = vo[o + F0];
const age = vo[o + AGE] / sr;
let cents = vo[o + SC] * Math.exp(-age / Math.max(1e-3, vo[o + ST]));
const push = vo[o + PG] > 0 ? vo[o + PG] * Math.exp(-age / Math.max(1e-3, d.pushTime)) : 0;
cents += 25 * push;
let vibUp = 0;
if (d.vib > 0) {
const fade = Math.min(1, Math.max(0, (age - d.vibDelay) / 0.4));
const sv = Math.sin(TAU * d.vibRate * age);
cents += d.vib * fade * sv;
vibUp = fade * Math.max(0, sv);
}
let flip = 1;
if (d.wobble > 0 && d.pedal > 0) {
const a = vo[o + AGE];
if (a < vo[o + FE]) flip = vo[o + FR];
else if (age > Math.max(0.15, vo[o + CD]) && !vo[o + GONE]) {
const vel = vo[o + VEL];
const n = partialOf(f0, d.pedal);
const chance = d.wobble * vel * slip(n) * (1 + 2 * vibUp) * SUB / sr;
let r = vo[o + WR];
const u = () => { r ^= r << 13; r >>>= 0; r ^= r >>> 17; r ^= r << 5; r >>>= 0; return r / 4294967296; };
if (u() < chance) {
const up = n < 2 || u() < 0.7;
vo[o + FR] = (n + (up ? 1 : -1)) / n;
vo[o + FS] = a;
vo[o + FE] = a + d.crackTime * (0.6 + 0.8 * u()) * sr;
flip = vo[o + FR];
}
vo[o + WR] = r;
}
}
const f = f0 * (age < vo[o + CD] ? vo[o + CR] : 1) * flip * Math.pow(2, cents / 1200);
vo[o + INC] = f / sr;
const h = 0.45 * sr / f;
const cap = Math.max(0.05, h - 3 * Math.sqrt(h));
const p = vo[o + P];
const kk = d.brassKey ? Math.pow(440 / f0, d.brassKey) : 1;
const k = Math.min(cap, Math.max(1e-4, d.brass * kk * Math.pow(p, d.curve) * (1 + 3 * push)));
const dc = i0e(k);
const ac = Math.sqrt(Math.max(1e-12, i0e(2 * k) - dc * dc));
vo[o + K] = k;
vo[o + DC] = dc;
vo[o + NRM] = 1 / ac;
}
render(v, out, sr, tEnd) {
const vo = this.voice, d = this.def[v];
const o = v * W;
if (vo[o + REL] < tEnd && !vo[o + GONE]) { vo[o + GONE] = 1; vo[o + TGT] = 0; }
const vel = vo[o + VEL];
const ta = d.attack * (1.5 - vel);
const ka = 1 - Math.exp(-1 / (Math.max(1e-3, ta) * sr));
const kr = 1 - Math.exp(-1 / (Math.max(1e-3, d.release) * sr));
const lv = d.level * vo[o + KG];
let ph = vo[o + PH], p = vo[o + P], age = vo[o + AGE], lp = vo[o + LP];
let nz = this.noise;
const cdS = vo[o + CD] * sr;
const off = vo[o + OFF];
vo[o + OFF] = 0;
for (let i = off; i < B; i++) {
if ((i - off) % SUB === 0) {
vo[o + P] = p; vo[o + AGE] = age;
this.control(v, sr);
}
let tgt = vo[o + TGT];
if (tgt > 0) tgt *= 1 + d.blat * vel * Math.exp(-age / (0.06 * sr));
p += (tgt > p ? ka : kr) * (tgt - p);
const cs = Math.cos(TAU * ph);
const y = (Math.exp(vo[o + K] * (cs - 1)) - vo[o + DC]) * vo[o + NRM];
ph += vo[o + INC];
if (ph >= 1) ph -= 1;
nz ^= nz << 13; nz >>>= 0; nz ^= nz >>> 17; nz ^= nz << 5; nz >>>= 0;
const n = nz / 2147483648 - 1;
const gate = 1 - d.airPulse + d.airPulse * (1 + cs);
const air = n * (d.tongue * vel * Math.exp(-age / (0.012 * sr))
+ d.breath * Math.pow(p, d.airCurve) * gate);
lp += 0.35 * (air - lp);
let dip = cdS > 0 && age >= cdS && age - cdS < 0.05 * sr ? 1 - 0.6 * Math.exp(-(age - cdS) / (0.006 * sr)) : 1;
const fs = vo[o + FS];
if (fs >= 0 && age >= fs && age - fs < 0.2 * sr) {
const fe = vo[o + FE];
dip *= 1 - 0.5 * Math.exp(-(age - fs) / (0.004 * sr));
if (age >= fe) dip *= 1 - 0.5 * Math.exp(-(age - fe) / (0.004 * sr));
}
const sq = age < cdS ? vo[o + SG] : 1;
out[i] += lv * (p * y * dip * sq + lp);
age++;
}
vo[o + PH] = ph; vo[o + P] = p; vo[o + AGE] = age; vo[o + LP] = lp;
this.noise = nz;
if (vo[o + GONE] && p < 1e-4) vo[o + ON] = 0;
}
process(inputs, outputs) {
const chs = outputs[0];
const out = chs[0];
out.fill(0);
const sr = sampleRate;
const t0 = currentTime;
const tEnd = t0 + B / sr;
const vo = this.voice;
while (this.at < this.events.length && this.events[this.at].t < tEnd) {
const ev = this.events[this.at++];
this.start(ev, Math.max(0, Math.min(B - 1, Math.round((ev.t - t0) * sr))));
}
for (let v = 0; v < V; v++) if (vo[v * W + ON]) this.render(v, out, sr, tEnd);
if (this.cutAt >= 0) {
const len = Math.max(1, Math.round(sr * 0.01));
for (let i = 0; i < out.length; i++) {
out[i] *= Math.max(0, 1 - this.cutAt / len);
this.cutAt++;
}
if (this.cutAt >= len) { vo.fill(0); this.cutAt = -1; }
}
for (let c = 1; c < chs.length; c++) chs[c].set(out);
return true;
}
}
registerProcessor('${J}', BrassBank);`,V={brass:{live:!1,min:0,max:40,desc:null},brassKey:{live:!1,min:0,max:3,when:[{key:"brass",gt:0}],desc:null},curve:{live:!1,min:.3,max:4,when:[{key:"brass",gt:0}],desc:null},attack:{live:!1,min:.003,max:.5,unit:"s",desc:null},blat:{live:!1,min:0,max:1,desc:null},release:{live:!1,min:.01,max:1,unit:"s",desc:null},scoop:{live:!1,min:-300,max:300,unit:"cent",desc:null},scoopTime:{live:!1,min:.005,max:.3,unit:"s",when:[{key:"scoop",ne:0}],desc:null},vib:{live:!1,min:0,max:100,unit:"cent",desc:null},vibRate:{live:!1,min:2,max:9,unit:"Hz",when:[{key:"vib",gt:0}],desc:null},vibDelay:{live:!1,min:0,max:2,unit:"s",when:[{key:"vib",gt:0}],desc:null},tongue:{live:!1,min:0,max:1,desc:null},breath:{live:!1,min:0,max:.3,desc:null},airCurve:{live:!1,min:.1,max:2,when:[{key:"breath",gt:0}],desc:null},airPulse:{live:!1,min:0,max:1,when:[{key:"breath",gt:0}],desc:null},push:{live:!1,group:"flaw",min:0,max:1,desc:null},pushTime:{live:!1,group:"flaw",min:.01,max:.4,unit:"s",when:[{key:"push",gt:0}],desc:null},crack:{live:!1,group:"flaw",min:0,max:1,desc:null},crackTime:{live:!1,group:"flaw",min:.01,max:.15,unit:"s",desc:null},pedal:{live:!1,group:"flaw",min:20,max:400,unit:"Hz",desc:null},crackSeed:{live:!1,group:"flaw",min:1,max:9999,step:1,desc:null},squeak:{live:!1,group:"flaw",min:0,max:1,desc:null},wobble:{live:!1,group:"flaw",min:0,max:5,unit:"/s",desc:null},keyGain:{live:!1,min:-12,max:12,unit:"dB",desc:null},level:{live:!1,min:.01,max:4,desc:null}},Te={freq:{live:!0,min:100,max:6e3,unit:"Hz",desc:null},gain:{live:!0,min:-18,max:18,unit:"dB",desc:null},resonance:{live:!0,min:0,max:.95,desc:null}},Pe={freq:{live:!0,min:100,max:4e3,unit:"Hz",desc:null},resonance:{live:!0,min:0,max:.95,desc:null}},D={trumpet:{desc:null,brass:37.5,brassKey:1.38,curve:1.41,attack:.0222,blat:.33,release:.06,scoop:-40,scoopTime:.035,vib:18,vibRate:5.6,vibDelay:.35,tongue:.25,breath:.03,airCurve:1,airPulse:0,level:.09,push:.4,pushTime:.08,crack:.15,crackTime:.025,pedal:116.5,crackSeed:1,wobble:.2,squeak:0,keyGain:4,bell:{freq:1100,resonance:.72},range:{brass:[25,40],brassKey:[1,2],curve:[1.1,2.2],attack:[.012,.05],blat:[.1,.45],release:[.03,.12],scoop:[-80,0],scoopTime:[.015,.07],vib:[0,35],vibRate:[4.5,6.5],vibDelay:[.15,.7],tongue:[.1,.4],breath:[.01,.06],airCurve:[.8,1.2],airPulse:[0,.3],level:[.02,.12],push:[0,.8],pushTime:[.04,.15],crack:[0,.4],crackTime:[.012,.05],pedal:[110,120],crackSeed:[1,9999],wobble:[0,1],squeak:[0,0],keyGain:[2,7],"bell.freq":[800,1800],"bell.resonance":[.5,.85]}},trombone:{desc:null,brass:20,brassKey:1.38,curve:1.8,attack:.0712,blat:.15,release:.09,scoop:-25,scoopTime:.05,vib:10,vibRate:5,vibDelay:.5,tongue:.18,breath:.025,airCurve:1,airPulse:0,level:.21,push:.3,pushTime:.1,crack:.1,crackTime:.05,pedal:58.3,crackSeed:1,wobble:.15,squeak:0,keyGain:3.6,bell:{freq:565,resonance:.472},range:{brass:[12,30],brassKey:[1,2],curve:[1.2,2.4],attack:[.03,.1],blat:[.05,.3],release:[.05,.15],scoop:[-60,0],scoopTime:[.02,.09],vib:[0,20],vibRate:[4,6],vibDelay:[.3,.9],tongue:[.08,.3],breath:[.01,.05],airCurve:[.8,1.2],airPulse:[0,.3],level:[.1,.35],push:[0,.7],pushTime:[.05,.2],crack:[0,.3],crackTime:[.03,.08],pedal:[55,62],crackSeed:[1,9999],wobble:[0,.8],squeak:[0,0],keyGain:[2,6],"bell.freq":[300,800],"bell.resonance":[.3,.7]}},tenor:{desc:null,brass:13.1,brassKey:.7,curve:1.62,attack:.048,blat:.05,release:.08,scoop:-60,scoopTime:.05,vib:22,vibRate:5.2,vibDelay:.3,tongue:.12,breath:.12,airCurve:.4,airPulse:.8,level:.1,push:.25,pushTime:.08,crack:.05,crackTime:.05,pedal:103.8,crackSeed:1,wobble:.1,squeak:.04,keyGain:-2,bell:{freq:120,resonance:0},body:[{freq:700,gain:7.34,resonance:.84},{freq:1900,gain:9,resonance:.549}],range:{brass:[9,20],brassKey:[.3,1.2],curve:[1.2,2],attack:[.025,.08],blat:[0,.15],release:[.05,.15],scoop:[-120,-10],scoopTime:[.03,.1],vib:[8,40],vibRate:[4.5,6],vibDelay:[.15,.5],tongue:[.05,.2],breath:[.05,.2],airCurve:[.25,.7],airPulse:[.5,1],level:[.05,.18],push:[0,.6],pushTime:[.04,.15],crack:[0,.2],crackTime:[.03,.08],pedal:[100,108],crackSeed:[1,9999],wobble:[0,.6],squeak:[0,.2],keyGain:[-8,2],"bell.freq":[100,250],"bell.resonance":[0,.3],"body.0.freq":[450,850],"body.0.gain":[3,10],"body.0.resonance":[.5,.9],"body.1.freq":[1400,2400],"body.1.gain":[4,12],"body.1.resonance":[.35,.75]}}};function ee(e){let t={};for(let o of Object.keys(V))t[o]=e[o]??0;return e.level==null&&(t.level=.5),t.level*=Object.values(e.macroLevel||{}).reduce((o,r)=>o*r,1),e.airCurve==null&&(t.airCurve=1),t}function ue(e,t,o,r){let h=t.macros&&t.macros[o],l=structuredClone(e);if(!h)return l;if(h.levelDb){let d=r<1?h.levelDb[0]*(1-r):h.levelDb[1]*(r-1)/Math.max(1e-9,(h.max??2)-1);l.macroLevel={...e.macroLevel||{},[o]:Math.pow(10,d/20)}}for(let[d,c]of Object.entries(h.neutral)){let s=d.split("."),i=s.reduce((x,w)=>x?.[w],t),p=s[s.length-1],b=s[0]==="bell"?Pe[p]:s[0]==="body"?Te[p]:V[p],y=c+r*(i-c);b&&(y=Math.min(b.max,Math.max(b.min,y)));let M=l;for(let x=0;x<s.length-1;x++)M=M[s[x]];M[p]=y}return l}function te(e){return z[e]?"modal":D[e]?"brass":null}var me=e=>e==="modal"?z:D,ve=e=>e==="modal"?Z:V;function F(e,t,o,r){return{name:e,desc:t.desc??null,unit:t.unit??null,min:t.min,max:t.max,...t.step?{step:t.step}:{},default:o,recommended:r||null,...t.when?{when:t.when.map(h=>({...h}))}:{}}}function _(e,t){let o=te(e);if(!o)return null;let r=me(o)[e],h=t||r,l=ve(o),d=r.range||{},c=Object.keys(l).filter(i=>l[i].group!=="head"&&typeof h[i]=="number").map(i=>F(i,l[i],h[i],d[i])),s={instrument:e,kind:o,smart:Object.entries(r.macros||{}).map(([i,p])=>({name:i,desc:p.desc??null,min:p.min,max:p.max,default:1})),params:c};return o==="modal"&&(s.head=Object.keys(l).filter(i=>l[i].group==="head"&&h.head&&typeof h.head[i]=="number").map(i=>F(i,l[i],h.head[i],d["head."+i])),s.body=(h.body||[]).map((i,p)=>Object.keys(P).map(b=>F(b,P[b],i[b],d[`body.${p}.${b}`])))),s}var O=e=>Math.abs(e)>=100?String(Math.round(e*10)/10):String(+Number(e).toPrecision(4));function I(e){let t=e.unit?" "+e.unit:"",o=e.recommended?`  推奨 ${O(e.recommended[0])}〜${O(e.recommended[1])}`:"",r=e.when?`  効く条件 ${e.when.map(h=>`${h.key} ${h.gt!=null?"> "+h.gt:h.lt!=null?"< "+h.lt:"≠ "+h.ne}`).join(" かつ ")}`:"";return`${e.name.padEnd(12)} ${O(e.min)}〜${O(e.max)}${t}${o}  既定 ${O(e.default)}${r}`}function Fe(e){let t=[],o=(r,h)=>{if(h.length){t.push(r);for(let l of h)t.push("  "+I(l))}};if(e.smart.length){t.push("smart{ }");for(let r of e.smart)t.push(`  ${r.name.padEnd(12)} ${O(r.min)}〜${O(r.max)}  既定 1`)}return e.head&&o("head{ }",e.head),(e.body||[]).forEach((r,h)=>o(`body{ ${h+1}{ } }`,r)),o("(そのまま書くもの)",e.params),t.join(`
`)}function fe(e,t){let o=`[ChpTnSnd] MML: 音色 "${t.name}" の @${t.word}`,r=a=>{throw new Error(`${o}${a}`)},h=e[0],l=[...Object.keys(z),...Object.keys(D)].filter(t.allowed);(!h||h.value!==null)&&r(` は、最初に元にする楽器の名前を書きます(${l.join(" ")})`);let d=h.key,c=te(d);c||r(` の "${d}" という楽器はありません(${l.join(" ")})`),t.allowed(d)||r(` に ${d} は書けません。@${t.others}{…} で書きます`);let s=me(c)[d],i=ve(c),p=()=>`
`+d+` で書けるもの:
`+Fe(_(d)),b=new Set,y=a=>{b.has(a)&&r(` に ${a} が 2 度書いてあります`),b.add(a)},M=(a,u,m,f)=>(typeof m!="number"&&r(` の ${a} は数で書きます
  ${I(F(a,u,G(s,a),f))}`),(m<u.min||m>u.max)&&r(` の ${a} ${O(m)} は範囲の外です
  ${I(F(a,u,G(s,a),f))}`),u.step&&Math.abs(m/u.step-Math.round(m/u.step))>1e-9&&r(` の ${a} ${O(m)} は ${u.step} きざみで書きます
  ${I(F(a,u,G(s,a),f))}`),m),x=s.range||{},w=[],k=[];for(let a of e.slice(1)){if(a.value===null&&(te(a.key)&&r(` の楽器の名前は最初に 1 つだけ書きます("${a.key}")`),r(` の "${a.key}" に値がありません`+p())),a.key==="smart"){Array.isArray(a.value)||r(" の smart は smart{…} で書きます");let m=s.macros||{};for(let f of a.value){let g=m[f.key];g||r(` の smart に "${f.key}" はありません`+(Object.keys(m).length?`(${d} の smart: ${Object.keys(m).join(" ")})`:`(${d} には smart がありません)`)),y("smart."+f.key),(typeof f.value!="number"||f.value<g.min||f.value>g.max)&&r(` の smart の ${f.key} は ${O(g.min)}〜${O(g.max)} の数で書きます(既定 1)`),w.push([f.key,f.value])}continue}if((a.key==="bell"||a.key==="body")&&c==="brass"&&r(` の ${a.key} は書けません。金管のベルと胴は混ぜたあとに掛けるもので、エンジンは掛けません(聞くページだけが掛けています)。書いても鳴りが変わらないので止めます`),a.key==="head"&&c==="modal"){Array.isArray(a.value)||r(" の head は head{…} で書きます"+p());for(let m of a.value){let f=i[m.key];(!f||f.group!=="head"||typeof s.head[m.key]!="number")&&r(` の head に "${m.key}" は書けません`+p()),y("head."+m.key),k.push(["head."+m.key,M("head."+m.key,f,m.value,x["head."+m.key])])}continue}if(a.key==="body"&&c==="modal"){let m=(s.body||[]).length;m||r(` の body は書けません(${d} には胴の山がありません)`),Array.isArray(a.value)||r(` の body は body{ 1{freq …} } のように番号で書きます(1〜${m})`);for(let f of a.value){let g=Number(f.key);(!Number.isInteger(g)||g<1||g>m||!Array.isArray(f.value))&&r(` の body の "${f.key}" は読めません。山は 1〜${m} の番号で、${m>1?"2":"1"}{freq 215} のように書きます`);for(let S of f.value){let B=P[S.key];B||r(` の body の ${g} に "${S.key}" は書けません(freq gain resonance)`);let q=`body.${g-1}.${S.key}`;y(q),k.push([q,M(q,B,S.value,x[q])])}}continue}let u=i[a.key];(!u||u.group==="head"||typeof s[a.key]!="number")&&r(` に "${a.key}" は書けません`+p()),y(a.key),k.push([a.key,M(a.key,u,a.value,x[a.key])])}let L=structuredClone(s),A=c==="modal"?de:ue;for(let a of Object.keys(s.macros||{})){let u=w.find(m=>m[0]===a);if(u){let m=A(L,s,a,u[1]);L={...L,...m,head:m.head??L.head}}}for(let[a,u]of k)Ke(L,a,u);let v=[];for(let[a]of k){let u=a.split(".").pop(),f=((a.startsWith("body.")?P[u]:i[u]).when||[]).filter(g=>{let S=G(L,g.key);return!(g.gt!=null?S>g.gt:g.lt!=null?S<g.lt:S!==g.ne)});f.length&&v.push(`${o} の ${a} は効きません(${f.map(g=>`${g.key} が ${g.gt!=null?g.gt+" より大きい":g.lt!=null?g.lt+" より小さい":g.ne+" でない"}`).join("、")}ときだけ効きます)`)}return delete L.range,delete L.macros,{kind:c,instrument:d,def:L,warnings:v}}function G(e,t){return t.split(".").reduce((o,r)=>o==null?o:o[r],e)}function Ke(e,t,o){let r=t.split("."),h=r.pop();r.reduce((l,d)=>l[d],e)[h]=o}var E=globalThis.MMSXX.sound.core["audio.js"],M0=E.ChipTuneSound,x0=E.SE_SYS_PAUSE,w0=E.SOUND_VERSION,k0=E.ampFor,S0=E.encodeWAV,L0=E.fadeGain,B0=E.freqAt,A0=E.psgDiv,oe=E.registerChipKind,q0=E.snapVol,R0=E.volAt;var K={modal:{},brass:{}};function Ve(){let e=new Set(["rhodes","fingerBass","pickBass","slapBass"]),t={brush:"perc",brushSweep:"perc",ride:"perc",bass:"bass",fingerBass:"bass",pickBass:"bass",slapBass:"bass",bassSlap:"bass",bassSlapHit:"perc",guitar:"lead",piano:"lead",rhodes:"lead",timpani:"perc",timpaniRoll:"perc",gong:"perc",marimba:"lead",vibraphone:"chord",glockenspiel:"counter",trumpet:"lead",trombone:"counter",tenor:"lead"},o=[...Object.entries(z).map(([l,d])=>({name:l,def:d,kind:"modal"})),...Object.entries(D).map(([l,d])=>({name:l,def:d,kind:"brass"}))].filter(({def:l})=>!l.draft),r=o.filter(l=>!e.has(l.name)),h=o.filter(l=>e.has(l.name));for(let{name:l,def:d,kind:c}of o){let s=e.has(l)?"electric":"acoustic";(c==="modal"?H:$)(`${s}::${l}`,{patch:l},{role:t[l],desc:d.desc})}for(let l of["acoustic","electric"]){let d=l==="electric";ne(l,(c,s,i)=>{let p=fe(s,{word:l,name:c,allowed:M=>e.has(M)===d,others:d?"acoustic":"electric"});for(let M of p.warnings)re(M);let b="#"+c;K[p.kind][b]={...p.def,from:p.instrument},(p.kind==="modal"?H:$)(c,{patch:b},{role:i.role??t[p.instrument],overwrite:!0})},{tree:!0})}for(let l of["modal","brass"])ae(l,d=>{let c=K[l][d.patch];return c?_(c.from,c):_(d.patch)})}function j(e,t){let o={};for(let[r,h]of Object.entries(e))o[r]=t(h);return o}function ye(e,t,o,r,h,l){return e.legato?t.kind==="modal"&&e.tieId!=null?{t:h,p:t.patch,f:o,v:Math.max(0,Math.min(1,(e.vol??0)/15)),sl:e.tieId,nf:1}:null:{t:h,p:t.patch,f:o,...t.kind==="modal"&&e.tieId!=null?{tie:e.tieId}:{},...t.kind==="modal"&&e.glide>0?{gs:12*Math.log2(e.glide/e.freq),gl:Math.max(.01,e.gate??l-h)}:{},v:Math.max(0,Math.min(1,(e.vol??0)/15)),d:Math.max(.001,e.tieSpan??l-h),...e.rollTo!=null?{v2:Math.max(0,Math.min(1,e.rollTo/15))}:{},...e.pedals&&e.pedBase!=null?{pd:e.pedals.map(([d,c])=>[e.pedBase+d,e.pedBase+c])}:{},sc:e.sub|0}}var be={kind:"modal",node:Y,code:he,voices:24,buses:2,event:ye,options:e=>({numberOfInputs:0,outputChannelCount:[2],processorOptions:{events:e,patches:j({...z,...K.modal},X)}}),extra:()=>j(K.modal,X)},ge={kind:"brass",node:J,code:pe,voices:16,event:ye,options:e=>({numberOfInputs:0,outputChannelCount:[1],processorOptions:{events:e,patches:j({...D,...K.brass},ee)}}),extra:()=>j(K.brass,ee)};oe(be.kind,be);oe(ge.kind,ge);Ve();ie();le();})();
