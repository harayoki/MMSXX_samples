var MMSXX;(MMSXX||={}).sound=(()=>{var jn=Object.defineProperty;var _c=Object.getOwnPropertyDescriptor;var yc=Object.getOwnPropertyNames;var kc=Object.prototype.hasOwnProperty;var oe=(s,e)=>{for(var t in e)jn(s,t,{get:e[t],enumerable:!0})},Sc=(s,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of yc(e))!kc.call(s,o)&&o!==t&&jn(s,o,{get:()=>e[o],enumerable:!(n=_c(e,o))||n.enumerable});return s};var Tc=s=>Sc(jn({},"__esModule",{value:!0}),s);var Ru={};oe(Ru,{ChipTuneSound:()=>Cn,SE_SYS_PAUSE:()=>bt,SOUND_VERSION:()=>yn,ampFor:()=>Ee,core:()=>Ou,encodeWAV:()=>Za,fadeGain:()=>nt,freqAt:()=>An,psgDiv:()=>li,registerChipKind:()=>Ja,snapVol:()=>Ge,volAt:()=>ze});var ui={};oe(ui,{ChipTuneSound:()=>Cn,SE_SYS_PAUSE:()=>bt,SOUND_VERSION:()=>yn,ampFor:()=>Ee,encodeWAV:()=>Za,fadeGain:()=>nt,freqAt:()=>An,psgDiv:()=>li,registerChipKind:()=>Ja,snapVol:()=>Ge,volAt:()=>ze});var Ls={};oe(Ls,{AY_ENV_SHAPES:()=>Le,AY_MODES:()=>ls,DEFAULT_ENV:()=>Dt,DEFAULT_WAVE:()=>Zi,DEV_MARKS:()=>Rc,DRUM_FREQ:()=>al,ENVELOPES:()=>fe,HEAD_MARK:()=>Ss,NES_MODES:()=>us,NOISE_VARIANTS:()=>Yi,ROLES:()=>Bt,SPECIALS:()=>Oc,STEALS:()=>rs,TUNINGS:()=>is,VCURVES:()=>cs,VIB_MAX:()=>Ke,VIB_SPEED:()=>rn,WAVE:()=>er,WAVEFORMS:()=>T,badVoice:()=>el,compileMML:()=>mn,countOldStyle:()=>gl,describeVoice:()=>ln,dutyLfoAt:()=>ms,dutyMoves:()=>Fe,envRunLen:()=>Tr,envSec:()=>Oe,findWave:()=>Z,firstTempo:()=>dn,isSystemMark:()=>dt,listEnvelopes:()=>Dc,listVoiceFamilies:()=>vs,listVoices:()=>Fc,metaOf:()=>ce,noOldDescName:()=>ut,readBundles:()=>pn,readChordSets:()=>_r,readDirectives:()=>Ts,readDrums:()=>Ar,readVoices:()=>xr,readWaves:()=>wr,registerAY:()=>xs,registerAnalog:()=>jc,registerBaked:()=>ys,registerBeep:()=>ws,registerBrass:()=>Gc,registerCoreFamilies:()=>Xi,registerDrumSlots:()=>Qc,registerEnvelope:()=>Qi,registerFDS:()=>Ms,registerFM:()=>Vt,registerFamily:()=>pe,registerLayer:()=>fn,registerModal:()=>Ic,registerNES:()=>bs,registerNoiseVariants:()=>ds,registerOPNARhythm:()=>zc,registerPCE:()=>hn,registerSCC:()=>_s,registerVoice:()=>qc,registerVoiceDetail:()=>Bc,registerVoiceSyntax:()=>As,registerWave:()=>ie,roleOf:()=>ae,sealPresets:()=>ps,shareBundles:()=>$s,slideAt:()=>cn,songParts:()=>Es,splitParts:()=>pt,splitVoices:()=>Er,stealOf:()=>Xt,toneOf:()=>$t,validateMML:()=>gn,voiceArgs:()=>sr,voiceName:()=>nr,voiceNameProblem:()=>gs,voiceNums:()=>Ue,volFromGain:()=>ar,volGainOf:()=>un,warn:()=>G,waveMeta:()=>an,waveRole:()=>Nc,waveSteal:()=>Pc});var qn={};oe(qn,{GM_NAMES:()=>Ht,gmIndex:()=>Gn,gmLike:()=>zn});var Ht=["Acoustic Grand Piano","Bright Acoustic Piano","Electric Grand Piano","Honky-tonk Piano","Electric Piano 1","Electric Piano 2","Harpsichord","Clavi","Celesta","Glockenspiel","Music Box","Vibraphone","Marimba","Xylophone","Tubular Bells","Dulcimer","Drawbar Organ","Percussive Organ","Rock Organ","Church Organ","Reed Organ","Accordion","Harmonica","Tango Accordion","Acoustic Guitar (nylon)","Acoustic Guitar (steel)","Electric Guitar (jazz)","Electric Guitar (clean)","Electric Guitar (muted)","Overdriven Guitar","Distortion Guitar","Guitar Harmonics","Acoustic Bass","Electric Bass (finger)","Electric Bass (pick)","Fretless Bass","Slap Bass 1","Slap Bass 2","Synth Bass 1","Synth Bass 2","Violin","Viola","Cello","Contrabass","Tremolo Strings","Pizzicato Strings","Orchestral Harp","Timpani","String Ensemble 1","String Ensemble 2","Synth Strings 1","Synth Strings 2","Choir Aahs","Voice Oohs","Synth Voice","Orchestra Hit","Trumpet","Trombone","Tuba","Muted Trumpet","French Horn","Brass Section","Synth Brass 1","Synth Brass 2","Soprano Sax","Alto Sax","Tenor Sax","Baritone Sax","Oboe","English Horn","Bassoon","Clarinet","Piccolo","Flute","Recorder","Pan Flute","Blown Bottle","Shakuhachi","Whistle","Ocarina","Lead 1 (square)","Lead 2 (sawtooth)","Lead 3 (calliope)","Lead 4 (chiff)","Lead 5 (charang)","Lead 6 (voice)","Lead 7 (fifths)","Lead 8 (bass + lead)","Pad 1 (new age)","Pad 2 (warm)","Pad 3 (polysynth)","Pad 4 (choir)","Pad 5 (bowed)","Pad 6 (metallic)","Pad 7 (halo)","Pad 8 (sweep)","FX 1 (rain)","FX 2 (soundtrack)","FX 3 (crystal)","FX 4 (atmosphere)","FX 5 (brightness)","FX 6 (goblins)","FX 7 (echoes)","FX 8 (sci-fi)","Sitar","Banjo","Shamisen","Koto","Kalimba","Bag pipe","Fiddle","Shanai","Tinkle Bell","Agogo","Steel Drums","Woodblock","Taiko Drum","Melodic Tom","Synth Drum","Reverse Cymbal","Guitar Fret Noise","Breath Noise","Seashore","Bird Tweet","Telephone Ring","Helicopter","Applause","Gunshot"],at=s=>String(s).toLowerCase().replace(/[^a-z0-9+]/g,""),Ac=new Map(Ht.map((s,e)=>[at(s),e]));function Gn(s){let e=Ac.get(at(s));return e===void 0?-1:e}function zn(s,e=5){let t=at(s);if(!t)return[];let n=Ht.filter(i=>at(i).includes(t)||t.includes(at(i)));if(n.length)return n.slice(0,e);let o=t.slice(0,3);return Ht.filter(i=>at(i).startsWith(o)).slice(0,e)}var Kn={};oe(Kn,{TONE_FRAME:()=>W,TONE_PRESETS:()=>Ri,readTable:()=>Ce,registerDefaultTones:()=>Jn,registerTone:()=>Yt});var W=1/60,Wn=s=>Z(s);function Yt(s,e={}){let t=Wn(s);if(t>=0&&!e.overwrite)throw new Error(`[ChpTnSnd] 音色 "${s}" はもう登録されています(差し替えるなら overwrite: true を渡してください)`);let n=T[Wn(e.wave||"pulse(50)")]||T[2],o=$t(e,n,s)||{arp:null,pitch:null,vol:null,duty:null,loop:{},vib:null},{id:i,name:r,tone:l,role:c,preset:h,desc:a,descJa:d,tags:u,genre:f,dev:v,...x}=n,y={...x,id:t>=0?t:T.length,name:s,role:ae(e.role,s)??n.role??null,...ce(e),steal:Xt(e.steal,s)??n.steal??null,tone:o};if(!y.special.length&&n.special&&n.special.length&&(y.special=[...n.special]),Fe(o)&&(y.special=[...new Set((y.special||[]).concat("worklet"))]),e.env){let M=fe.findIndex(C=>C.name===e.env);M>=0&&(y.defaultEnv=M)}else n.defaultEnv!==void 0&&(y.defaultEnv=n.defaultEnv);return t>=0?T[t]=y:T.push(y),y.id}function Ce(s,e,t){if(!s||!s.length)return 0;if(e<s.length)return s[e];if(t==null||t<0||t>=s.length)return s[s.length-1];let n=s.length-t;return s[t+(e-t)%n]}var Ri={toneArp:{descJa:null,dev:["wip"],role:"arp",draft:!0,desc:null,wave:"pulse(50)",env:"flat",arp:[0,4,7],loop:{arp:0}},toneLead:{descJa:null,role:"lead",desc:null,wave:"pulse(25)",env:"flat",vib:{depth:35,speed:6,delay:18}},nesDutyOpen:{descJa:null,role:"lead",tags:["nes","duty"],desc:null,wave:"nesPulse(25)",env:"flat",duty:[.125,.125,.125,.125,.25,.25,.25,.5,.5]},nesDutyPWM:{descJa:null,role:"chord",tags:["nes","duty"],desc:null,wave:"nesPulse(25)",env:"flat",dutyLfo:{center:.3,depth:.2,speed:2.5}},nesDutyAtk:{descJa:null,role:"lead",tags:["nes","duty"],desc:null,wave:"nesPulse(25)",env:"flat",duty:[.5,.5,.25]},toneSlideIn:{descJa:null,role:"lead",desc:null,wave:"pulse(25)",env:"flat",slide:{cents:-200,frames:4}},nesLead:{descJa:null,role:"lead",tags:["nes","duty"],desc:null,wave:"nesPulse(25)",env:"flat",slide:{cents:-150,frames:3},duty:[.125,.125,.125,.25,.25],vib:{depth:28,speed:6,delay:20}},nesBreathPad:{descJa:null,role:"chord",tags:["nes","duty"],desc:null,wave:"nesPulse(25)",env:"soft",dutyLfo:{center:.32,depth:.18,speed:3.3},vib:{depth:21,speed:4,delay:30}},tonePadStrings:{descJa:null,role:"chord",desc:null,wave:"pulse(25)",env:"strings",vib:{depth:21,speed:4.2,delay:30}}};function Jn(){for(let[s,e]of Object.entries(Ri))e.draft||Wn(s)<0&&Yt(s,e)}var Yn={};oe(Yn,{FILTERS:()=>de,FILTER_CODE:()=>Hn,FILTER_CORE:()=>Ni,filterOptions:()=>Un});var de={lowpass:{desc:null,params:{cutoff:{unit:"Hz",min:20,max:2e4,default:2e4,desc:null},resonance:{min:0,max:1,default:0,desc:null},drive:{min:0,max:1,default:0,desc:null}}},highpass:{desc:null,params:{cutoff:{unit:"Hz",min:20,max:2e4,default:20,desc:null},resonance:{min:0,max:1,default:0,desc:null},drive:{min:0,max:1,default:0,desc:null}}},bandpass:{desc:null,params:{cutoff:{unit:"Hz",min:20,max:2e4,default:1e3,desc:null},resonance:{min:0,max:1,default:0,desc:null},drive:{min:0,max:1,default:0,desc:null}}},notch:{desc:null,params:{cutoff:{unit:"Hz",min:20,max:2e4,default:1e3,desc:null},resonance:{min:0,max:1,default:0,desc:null},drive:{min:0,max:1,default:0,desc:null}}},ladder:{desc:null,params:{cutoff:{unit:"Hz",min:20,max:2e4,default:2e4,desc:null},resonance:{min:0,max:1.2,default:0,desc:null},drive:{min:0,max:1,default:0,desc:null}}}};function Un(s,e={}){let t=de[s];if(!t)throw new Error(`unknown filter: ${s}`);let n={};for(let[o,i]of Object.entries(t.params))n[o]=e[o]??i.default;return{processorOptions:{kind:s},parameterData:n}}var Ni=`const K_MIN = 0.01;
const damp = (r) => Math.max(K_MIN, 2 - 2 * Math.min(1, Math.max(0, r)));
const D_MAX = 4;
const D_MIN = 1e-4;
const sat = (x, d) => Math.tanh(x * d) / d;
const warp = (fc, sr) => Math.tan(Math.PI * Math.min(Math.max(fc, 1), sr * 0.49) / sr);
/** 2 極の SVF。low と high を同時に出す。どちらを使うかは継いだ側が決める */
class Svf {
constructor() { this.ic1 = 0; this.ic2 = 0; }
reset() { this.ic1 = 0; this.ic2 = 0; }
/** g = warp(カットオフ)、k = damp(レゾナンス)、d = 飽和の強さ。結果は this.low と this.high */
tick(x, g, k, d) {
const a1 = 1 / (1 + g * (g + k));
const a2 = g * a1;
const a3 = g * a2;
const v3 = x - this.ic2;
const v1 = a1 * this.ic1 + a2 * v3;
const v2 = this.ic2 + a2 * this.ic1 + a3 * v3;
this.ic1 = 2 * v1 - this.ic1;
this.ic2 = 2 * v2 - this.ic2;
if (d > D_MIN) { this.ic1 = sat(this.ic1, d); this.ic2 = sat(this.ic2, d); }
this.low = v2;
this.band = v1;
this.high = x - k * v1 - v2;
}
}
class LowPass extends Svf {
static res(r) { return damp(r); }
step(x, g, k, d = 0) { this.tick(x, g, k, d); return this.low; }
}
class HighPass extends Svf {
static res(r) { return damp(r); }
step(x, g, k, d = 0) { this.tick(x, g, k, d); return this.high; }
}
class BandPass extends Svf {
static res(r) { return damp(r); }
step(x, g, k, d = 0) { this.tick(x, g, k, d); return k * this.band; }
}
class Notch extends Svf {
static res(r) { return damp(r); }
step(x, g, k, d = 0) { this.tick(x, g, k, d); return x - k * this.band; }
}
const K_LADDER = 3.96;
const K_OSC = 4.6;
const R_OSC = 1.2;
const D_OSC = 1;
/** 4 極ラダー。1 極のローパス 4 つと、出口から入口への帰還 */
class Ladder {
constructor() { this.s1 = 1e-5; this.s2 = 0; this.s3 = 0; this.s4 = 0; }
reset() { this.s1 = 1e-5; this.s2 = 0; this.s3 = 0; this.s4 = 0; }
static res(r) {
const x = Math.min(R_OSC, Math.max(0, r));
return x <= 1 ? K_LADDER * x : K_LADDER + (K_OSC - K_LADDER) * (x - 1) / (R_OSC - 1);
}
/** g = warp(カットオフ)、k = 帰還の強さ(0..K_OSC)、d = 飽和の強さ */
step(x, g, k, d = 0) {
const G = g / (1 + g);
const h = 1 / (1 + g);
const S = G * (G * (G * this.s1 + this.s2) + this.s3) * h + this.s4 * h;
const G4 = G * G * G * G;
const y4 = (G4 * x + S) / (1 + k * G4);
let u = x - k * y4;
if (k > 4 && d < D_OSC) d = D_OSC;
if (d > D_MIN) u = sat(u, d);
let v = (u - this.s1) * G; const y1 = v + this.s1; this.s1 = y1 + v;
v = (y1 - this.s2) * G; const y2 = v + this.s2; this.s2 = y2 + v;
v = (y2 - this.s3) * G; const y3 = v + this.s3; this.s3 = y3 + v;
v = (y3 - this.s4) * G; const y = v + this.s4; this.s4 = y + v;
return y;
}
}
const KINDS = { lowpass: LowPass, highpass: HighPass, ladder: Ladder, bandpass: BandPass, notch: Notch };`,Hn=`${Ni}
const DEFS = ${JSON.stringify(de)};
class FilterNode extends AudioWorkletProcessor {
static get parameterDescriptors() {
const p = DEFS.lowpass.params;
const resMax = Math.max(...Object.values(DEFS).map((f) => f.params.resonance.max));
return [
{ name: 'cutoff', defaultValue: p.cutoff.default, minValue: p.cutoff.min, maxValue: p.cutoff.max, automationRate: 'a-rate' },
{ name: 'resonance', defaultValue: p.resonance.default, minValue: p.resonance.min, maxValue: resMax, automationRate: 'a-rate' },
{ name: 'drive', defaultValue: p.drive.default, minValue: p.drive.min, maxValue: p.drive.max, automationRate: 'a-rate' },
];
}
constructor(o) {
super();
const q = (o && o.processorOptions) || {};
this.kind = KINDS[q.kind] ? q.kind : 'lowpass';
this.Kind = KINDS[this.kind];
this.chans = [];
this.alive = true;
this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
}
process(inputs, outputs, params) {
const input = inputs[0], output = outputs[0];
const cut = params.cutoff, res = params.resonance, drv = params.drive;
const sr = sampleRate;
const cFix = cut.length === 1, rFix = res.length === 1, dFix = drv.length === 1;
let g = cFix ? warp(cut[0], sr) : 0;
const Kind = this.Kind;
let k = rFix ? Kind.res(res[0]) : 0;
let d = dFix ? drv[0] * D_MAX : 0;
for (let c = 0; c < output.length; c++) {
const out = output[c];
const inp = input && input[c];
const f = this.chans[c] || (this.chans[c] = new this.Kind());
for (let i = 0; i < out.length; i++) {
if (!cFix) g = warp(cut[i], sr);
if (!rFix) k = Kind.res(res[i]);
if (!dFix) d = drv[i] * D_MAX;
out[i] = f.step(inp ? inp[i] : 0, g, k, d);
}
}
return this.alive;
}
}
registerProcessor('mmsxx-filter', FilterNode);`;var ts={};oe(ts,{ECHO_CODE:()=>es,ECHO_NODE:()=>Et,FX_COST:()=>Fi,MASTER_FX:()=>ct,fxCost:()=>Xn,fxHasLength:()=>Qt,fxTail:()=>Zn,normalizeFx:()=>Lt,noteLenSec:()=>Zt,reverbImpulse:()=>Qn});var Et="mmsxx-echo";var ct={echo:{desc:null,params:{time:{unit:"s",min:.01,max:2,default:.25,desc:null},feedback:{min:0,max:.95,default:.4,desc:null},mix:{min:0,max:1,default:.3,desc:null},tone:{unit:"Hz",min:200,max:2e4,default:4e3,desc:null},cross:{min:0,max:1,default:0,desc:null}}},reverb:{desc:null,params:{time:{unit:"s",min:.1,max:10,default:1.5,desc:null},mix:{min:0,max:1,default:.2,desc:null},width:{min:0,max:1,default:1,desc:null}}}},Fi={lowpass:.029,highpass:.045,bandpass:.129,notch:.192,ladder:.12,echo:.032,reverb:{base:.46,perSec:.24}};function Xn(s){let e=Fi[s&&s.kind];return e===void 0?0:typeof e=="number"?e:e.base+e.perSec*(Number(s.time)||0)}var Cc=24301;function Zt(s,e){let t=/^(\d+)(\.*)$/.exec(String(s??"").trim());return!t||+t[1]<1?null:240/e/+t[1]*(2-.5**t[2].length)}function Pi(s,e){let t={kind:e.kind};for(let[n,o]of Object.entries(s.params)){let i=Number(e[n]);t[n]=Number.isFinite(i)?Math.min(o.max,Math.max(o.min,i)):o.default}return t}function Lt(s,e,t=120){if(!Array.isArray(s))throw new Error("master effects: pass an array");return s.map(n=>{let o=n&&n.kind,i=ct[o]||e[o];if(!i)throw new Error(`master effects: unknown kind "${o}"`);if(n.l==null)return Pi(i,n);if(!i.params.time)throw new Error(`master effects: "${o}" does not take l`);let r=Zt(n.l,t);if(r==null)throw new Error(`master effects: l "${n.l}" is a note length, a whole number with optional dots such as 8 or "8."`);return Pi(i,{...n,time:r})})}function Qt(s){return Array.isArray(s)&&s.some(e=>e&&e.l!=null)}function Zn(s){let e=0;for(let t of s)t.kind==="echo"?e+=t.time*(1+Math.ceil(Math.log(.001)/Math.log(Math.max(.01,t.feedback)))):t.kind==="reverb"&&(e+=t.time);return e}function Qn(s,e,t=1){let n=s.sampleRate,o=Math.max(1,Math.round(e*n)),i=s.createBuffer(2,o,n),r=Cc,l=()=>(r^=r<<13,r>>>=0,r^=r>>>17,r^=r<<5,r>>>=0,r/4294967296*2-1),c=-6.91/o;for(let a=0;a<2;a++){let d=i.getChannelData(a),u=0;for(let v=0;v<o;v++)d[v]=l()*Math.exp(c*v),u+=d[v]*d[v];let f=1/Math.sqrt(u||1);for(let v=0;v<o;v++)d[v]*=f}let h=Math.max(0,Math.min(1,Number.isFinite(Number(t))?Number(t):1));if(h<1){let a=i.getChannelData(0),d=i.getChannelData(1),u=0,f=0;for(let y=0;y<o;y++){let M=(a[y]+d[y])*.5,C=(a[y]-d[y])*.5*h;a[y]=M+C,d[y]=M-C,u+=a[y]*a[y],f+=d[y]*d[y]}let v=1/Math.sqrt(u||1),x=1/Math.sqrt(f||1);for(let y=0;y<o;y++)a[y]*=v,d[y]*=x}return i}var es=`const ECHO_MAX = 2;
class Echo extends AudioWorkletProcessor {
constructor(o) {
super();
const p = (o && o.processorOptions) || {};
this.len = Math.max(1, Math.round((p.time || 0.25) * sampleRate));
this.fb = p.feedback || 0;
this.mix = p.mix || 0;
this.cross = p.cross || 0;
this.lift = this.cross * Math.SQRT1_2;
this.g = 1 - Math.exp(-2 * Math.PI * (p.tone || 20000) / sampleRate);
this.n = Math.ceil(ECHO_MAX * sampleRate) + 4;
this.bufs = [];
this.zs = [];
this.w = 0;
this.alive = true;
this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
}
process(inputs, outputs) {
if (!this.alive) return false;
const inp = inputs[0], out = outputs[0];
const n = this.n;
if (this.cross > 0 && out.length === 2) return this.pingPong(inp, out);
let w = this.w;
for (let c = 0; c < out.length; c++) {
if (!this.bufs[c]) { this.bufs[c] = new Float32Array(n); this.zs[c] = 0; }
const buf = this.bufs[c];
const x = inp[c] || inp[0];
const y = out[c];
let z = this.zs[c];
w = this.w;
for (let i = 0; i < y.length; i++) {
const xi = x ? x[i] : 0;
const r = buf[(w - this.len + n) % n];
z += (r - z) * this.g;
buf[w] = xi + z * this.fb;
y[i] = xi + z * this.mix;
w = (w + 1) % n;
}
this.zs[c] = z;
}
this.w = w;
return true;
}
pingPong(inp, out) {
const n = this.n, k = this.cross;
for (let c = 0; c < 2; c++) {
if (!this.bufs[c]) { this.bufs[c] = new Float32Array(n); this.zs[c] = 0; }
}
const bl = this.bufs[0], br = this.bufs[1];
const xl = inp[0], xr = inp[1] || inp[0];
const yl = out[0], yr = out[1];
let zl = this.zs[0], zr = this.zs[1];
let w = this.w;
for (let i = 0; i < yl.length; i++) {
const a = xl ? xl[i] : 0, b = xr ? xr[i] : 0;
const at = (w - this.len + n) % n;
zl += (bl[at] - zl) * this.g;
zr += (br[at] - zr) * this.g;
bl[w] = a * (1 - k) + (a + b) * this.lift + (zl * (1 - k) + zr * k) * this.fb;
br[w] = b * (1 - k) + (zr * (1 - k) + zl * k) * this.fb;
yl[i] = a + zl * this.mix;
yr[i] = b + zr * this.mix;
w = (w + 1) % n;
}
this.zs[0] = zl; this.zs[1] = zr;
this.w = w;
return true;
}
}
registerProcessor('${Et}', Echo);`;var Te={...de,...ct},Di=10,Ke=100,rn=5.5,ge={c:0,d:2,e:4,f:5,g:7,a:9,b:11},Rt={c:0,d:1,e:2,f:3,g:4,a:5,b:6},$c={0:0,2:1,4:2,5:3,7:4,9:5,11:6},is={equal:{cents:[0,100,200,300,400,500,600,700,800,900,1e3,1100],desc:null,descJa:null},pure:{cents:[0,111.73,203.91,315.64,386.31,498.04,590.22,701.96,813.69,884.36,1017.6,1088.27],desc:null,descJa:null},pythagorean:{cents:[0,90.22,203.91,294.13,407.82,498.04,611.73,701.96,792.18,905.87,996.09,1109.78],desc:null,descJa:null},"meantone:quarter":{cents:[0,76.05,193.16,310.26,386.31,503.42,579.47,696.58,772.63,889.74,1006.84,1082.89],desc:null,descJa:null},"meantone:sixth":{cents:[0,88.59,196.74,305.33,393.48,501.63,590.22,698.37,786.96,895.11,1003.26,1091.85],desc:null,descJa:null},slendro:{cents:[0,240,480,720,960],desc:null,descJa:null},pelog:{cents:[0,120,270,540,670,785,950],desc:null,descJa:null},"pelog:bem":{cents:[0,120,270,670,785],desc:null,descJa:null},"pelog:barang":{cents:[0,150,550,665,830],desc:null,descJa:null}};function Bi(s){let e=String(s??"").trim().split(/[\s,]+/).filter(Boolean);if(!e.length)return null;let t=1200,n=[];for(let h of e){if(!h.startsWith("/")){n.push(h);continue}let a=Number(h.slice(1));a>0||E(`[ChpTnSnd] MML: "#tuning" の 1 周の幅 "${h}" は読めません`),t=a}let o="c",i=n[n.length-1];n.length>1&&i&&Rt[i.toLowerCase()]!==void 0&&(o=n.pop().toLowerCase());let r=h=>/^-?[\d.]+$/.test(h);if(n.some(r)&&n.some(h=>!r(h))&&E('[ChpTnSnd] MML: "#tuning" は名前かセントの並びのどちらかです(混ぜると、置き換えなのか足すのか読めません)'),n.every(r)){let h=n.map(Number);return h.length<2&&E('[ChpTnSnd] MML: "#tuning" のセントは 2 つ以上書きます'),{cents:h,period:t,root:o,name:null}}let l=n.join(" ").toLowerCase(),c=is[l];return c||E(`[ChpTnSnd] MML: 音律 "${l}" は知らない名前です(使えるのは ${Object.keys(is).join(" / ")})`),l==="equal"&&o!=="c"&&G("[ChpTnSnd] MML: 12 平均律に根音はありません。どこから数えても同じです"),{cents:c.cents,period:t,root:o,name:l}}function Ec(s,e){return 1e6/(2*Math.max(1,s)*Math.max(1,e))}var Lc=4096,T=[{id:0,name:"pulse(12)",kind:"pulse",duty:.125,role:"lead",dev:["done"],descJa:null,desc:null},{id:1,name:"pulse(25)",kind:"pulse",duty:.25,role:"lead",dev:["done"],descJa:null,desc:null},{id:2,name:"pulse(50)",kind:"pulse",duty:.5,role:"lead",dev:["done"],descJa:null,desc:null},{id:3,name:"triangle",kind:"triangle",role:"bass",descJa:null,desc:null},{id:4,name:"saw",kind:"saw",role:"lead",descJa:null,desc:null},{id:5,name:"sine",kind:"sine",role:"bass",descJa:null,desc:null},{id:6,name:"noise(white)",kind:"noise",role:"noise",descJa:null,desc:null},{id:7,name:"pulse(33)",kind:"pulse",duty:1/3,role:"lead",desc:null}],Yi={"noise(metal)":{bits:7,role:"noise",descJa:null,desc:null},"noise(hiss)":{rate:2.5,role:"noise",descJa:null,desc:null},"noise(rumble)":{rate:.3,role:"noise",descJa:null,desc:null}};function Xi(){pe("pulse",{desc:null,params:[{name:"width",default:"50",desc:null,values:[{value:"12",desc:null},{value:"25",desc:null},{value:"33",desc:null},{value:"50",desc:null}]}]}),pe("noise",{desc:null,params:[{name:"kind",default:"white",desc:null,values:[{value:"white",desc:null},{value:"metal",desc:null},{value:"hiss",desc:null},{value:"rumble",desc:null}]}]})}function ds(){for(let[s,e]of Object.entries(Yi))Z(s)>=0||T.push({id:T.length,name:s,kind:"noise",bits:e.bits||0,rate:e.rate||1,role:ae(e.role,s),...ce(e)})}var Zi="pulse(50)",Dt="flat",fe=[{id:0,name:"flat",a:.005,d:0,s:1,r:.01,descJa:null,desc:null},{id:1,name:"soft",a:.08,d:.1,s:.8,r:.15,descJa:null,desc:null},{id:2,name:"percussive",a:.002,d:.25,s:0,r:.05,descJa:null,desc:null},{id:3,name:"piano",a:.004,d:.4,s:.35,r:.12,descJa:null,desc:null},{id:4,name:"pad",a:.25,d:.2,s:.7,r:.2,descJa:null,desc:null},{id:5,name:"pluck",a:.002,d:.12,s:.15,r:.08,descJa:null,desc:null},{id:6,name:"snap",a:.001,d:.06,s:0,r:.02,descJa:null,desc:null},{id:7,name:"bell",a:.002,d:1.2,s:0,r:.1,descJa:null,desc:null},{id:8,name:"organ",a:.01,d:.05,s:.9,r:.03,descJa:null,desc:null},{id:9,name:"strings",a:.15,d:.1,s:.85,r:.175,descJa:null,desc:null},{id:10,name:"swell",a:.7,d:0,s:1,r:.2,descJa:null,desc:null},{id:11,name:"tap",a:.002,d:.12,s:0,r:.03,descJa:null,desc:null},{id:12,name:"step",a:0,d:0,s:0,r:0,table:[1,.87,.75,.62,.5,.37,.25,.12,0],loop:null,descJa:null,desc:null},{id:13,name:"tremolo",a:0,d:0,s:.85,r:0,table:[1,1,.85,.7,.7,.85],loop:0,descJa:null,desc:null},{id:14,name:"blink",a:0,d:0,s:.5,r:0,table:[1,1,.5,.5],loop:0,descJa:null,desc:null},{id:15,name:"breath",a:0,d:0,s:.72,r:0,table:[.2,.7,1,1,1,.95,.88,.82,.78,.75,.7,.66,.7,.75,.78],loop:9,descJa:null,desc:null},{id:16,name:"bounce",a:0,d:0,s:.1,r:0,table:[1,.55,.25,.5,.2,.35,.14,.22,.09,.14,.07,.11],loop:8,descJa:null,desc:null},{id:17,name:"gradual",a:.003,d:.05,s:.65,r:.06,descJa:null,desc:null}];function Oe(s,e){if(typeof s=="string"){let t=parseFloat(s);return Number.isFinite(t)?Math.max(0,t/100*e):0}return Math.max(0,Number(s)||0)}function Qi(s,e={}){ut(e,"registerEnvelope");let t=fe.findIndex(o=>o.name.toLowerCase()===String(s).toLowerCase());if(t>=0&&!e.overwrite)throw new Error(`[ChpTnSnd] エンベロープ "${s}" はもう登録されています(差し替えるなら overwrite: true を渡してください)`);let n={id:t>=0?t:fe.length,name:String(s),desc:e.desc==null?null:String(e.desc),descJa:e.descJa==null?null:String(e.descJa)};if(Array.isArray(e.table)&&e.table.length){let o=e.table.map(r=>Math.max(0,Math.min(1,Number(r)||0)));n.table=o;let i=e.loop;n.loop=Number.isInteger(i)&&i>=0&&i<o.length?i:null,i!==void 0&&n.loop===null&&console.warn(`[ChpTnSnd] エンベロープ "${s}": loop ${i} は表の外です(表は ${o.length} 個)。戻らずに最後の値で止まります`),n.a=0,n.d=0,n.s=o[o.length-1],n.r=0}else{let o=(i,r,l)=>{if(typeof i!="string")return Math.max(0,Number(i??r)||0);let c=/^\s*(\d*\.?\d+)\s*%\s*$/.exec(i);if(!c)return G(`[ChpTnSnd] エンベロープ "${s}": ${l} "${i}" は読めません(秒の数か、"25%" のような割合で書きます)`),Math.max(0,Number(r)||0);let h=Number(c[1]);return h>100&&G(`[ChpTnSnd] エンベロープ "${s}": ${l} ${h}% は音の長さより長いので、鳴っているあいだは最後まで進みません`),`${h}%`};n.a=o(e.a,.005,"a"),n.d=o(e.d,0,"d"),n.s=Math.max(0,Math.min(1,e.s??1)),n.r=o(e.r,.01,"r"),n.table=null,n.loop=null}return t>=0?fe[t]=n:fe.push(n),n.id}function ie(s,e,t=8,n={}){xe(s,n.overwrite);let o=(1<<t)-1,i=Float32Array.from(e,h=>Math.round((Math.max(-1,Math.min(1,h))+1)/2*o)/o*2-1),r=Z(s),l={id:r>=0?r:T.length,name:s,kind:"wave",bits:t,samples:i,role:ae(n.role,s),...ce(n)};n.env!==void 0&&(l.defaultEnv=$e(n.env)),n.gain>0&&(l.gain=Math.max(.1,Math.min(4,Number(n.gain)))),n.octave&&(l.octave=Math.max(-3,Math.min(3,Math.round(Number(n.octave))||0)));let c=$t(n,"wave",s);return c&&(l.tone=c),r>=0?T[r]=l:T.push(l),l.id}var er={PULSE12:"pulse(12)",PULSE25:"pulse(25)",PULSE50:"pulse(50)",TRIANGLE:"triangle",SAW:"saw",SINE:"sine",NOISE:"noise"},Oc=["tape","worklet"],Rc=["done","spec","wip","check","dup","drop"],Bt=["lead","counter","chord","bass","arp","perc","noise","se"];function ae(s,e){if(s==null)return null;let t=String(s).trim().toLowerCase();return t?(Bt.includes(t)||console.warn(`[ChpTnSnd] 音色 "${e}" のロール "${s}" は知らない言葉です (決まっているのは ${Bt.join(" / ")})。そのまま持ちますが、書き出しの当てはめには当たりません`),t):null}function Nc(s){return an(s)?.role??null}var rs=["ok","avoid","unknown"];function Xt(s,e="?"){if(s==null)return null;let t=String(s).trim().toLowerCase();return t?(rs.includes(t)||console.warn(`[ChpTnSnd] 音色 "${e}" の steal "${s}" は知らない言葉です (決まっているのは ${rs.join(" / ")})。そのまま持ちますが、声の取り合いの目安には使われません`),t):null}function Pc(s){return an(s)?.steal??null}function an(s){let e=typeof s=="number"?T[s]:T[Z(s)];return e?{name:e.name,kind:e.kind,role:e.role??null,steal:e.steal??null,genre:e.genre??[],tags:e.tags??[],special:e.special??[],dev:e.dev??[],targets:e.targets??[],gm:e.gm??null,alias:e.alias??[],desc:e.desc??null,descJa:e.descJa??null}:null}function ps(){for(let s of T)s.preset=!0,s.vsteps===void 0&&(s.vsteps=0),s.vcurve===void 0&&(s.vcurve="curve");for(let s of fe)s.preset=!0}function tr(s,e){return e?!(e.preset!==void 0&&!!s.preset!=!!e.preset||e.kind&&s.kind!==e.kind||e.role&&s.role!==e.role||e.tag&&!(s.tags||[]).includes(e.tag)||e.genre&&!(s.genre||[]).includes(e.genre)||e.target&&!(s.targets||[]).includes(e.target)||e.name&&!s.name.toLowerCase().includes(String(e.name).toLowerCase())):!0}function Fc(s){return T.map(e=>({...an(e.name),preset:!!e.preset})).filter(e=>e&&tr(e,s))}function Dc(s){return fe.map(e=>({name:e.name,desc:e.desc??null,descJa:e.descJa??null,table:!!e.table,preset:!!e.preset})).filter(e=>tr(e,s))}function $t(s={},e="",t=""){let n=typeof e=="object"&&e?e.kind:e,o=typeof e=="object"&&e?e.mode:null,i=n==="pulse"||o==="pulse"&&(n==="nes"||n==="ay"),r=v=>Array.isArray(v)&&v.length?v.map(Number):null,l=r(s.duty),c=s.dutyLfo?{center:.3,depth:.2,speed:2.5,delay:0,...s.dutyLfo}:null;(l||c)&&!i&&(console.warn(`[ChpTnSnd] 音色 "${t}": duty の表は矩形波(pulse)にしか効きません(この音色は ${n})。表は落として登録します`),l=null,c=null);let h=r(s.arp),a=r(s.pitch),d=r(s.vol),u=s.slide?{cents:-200,frames:4,curve:1.25,...s.slide}:null,f=s.vib?{depth:28,speed:6,delay:0,...s.vib}:null;return!h&&!a&&!d&&!l&&!c&&!u&&!f?null:{arp:h,pitch:a,vol:d,duty:l,dutyLfo:c,slide:u,loop:{...s.loop||{}},vib:f}}function cn(s,e){if(!s)return 0;let t=Math.max(1,s.frames);return e>=t?0:s.cents*Math.pow(1-e/t,s.curve)}function Fe(s){return!!(s&&(s.duty||s.dutyLfo))}function ms(s,e){if(!s)return null;let t=s.delay||0;if(e<t)return s.center;let n=(e-t)/60*s.speed%1,o=n<.5?n*2:(1-n)*2;return s.center+s.depth*(o*2-1)}var Pt=new Map,en=new Map;function pe(s,e={}){ut(e,"registerFamily");let t=String(s).trim().toLowerCase();if(!/^[a-z][a-z0-9]*(?:::[a-z][a-z0-9]*)?$/i.test(String(s).trim()))throw new Error(`[ChpTnSnd] 仲間の名前 "${s}" は英数字と 音源セットの区切り(\`::\`)で書きます`);if(Pt.has(t)&&!e.overwrite)return Pt.get(t);let n=(e.params||[]).map(c=>{if(ut(c,`registerFamily の軸 ${c&&c.name}`),!(c.values&&c.values.length)&&Number.isFinite(c.min)&&Number.isFinite(c.max)){if(!c.name)throw new Error(`[ChpTnSnd] 仲間 "${s}": 軸には名前を書きます`);let d=c.words?Object.fromEntries(Object.entries(c.words).map(([u,f])=>[String(u).toLowerCase(),Number(f)])):null;return{name:String(c.name),desc:c.desc==null?null:String(c.desc),default:null,values:[],min:Number(c.min),max:Number(c.max),unit:c.unit==null?null:String(c.unit),numeric:!0,...d?{words:d}:{}}}let h=(c.values||[]).map(d=>(ut(d,`registerFamily の値 ${d&&d.value}`),{value:String(d.value),desc:d.desc==null?null:String(d.desc)}));if(!c.name||!h.length)throw new Error(`[ChpTnSnd] 仲間 "${s}": 軸には名前と値を書きます`);let a=String(c.default??h[0].value);if(!h.some(d=>d.value.toLowerCase()===a.toLowerCase()))throw new Error(`[ChpTnSnd] 仲間 "${s}": 軸 ${c.name} の既定 "${a}" が値の中にありません`);return{name:String(c.name),desc:c.desc==null?null:String(c.desc),default:a,values:h}});if(!n.length)throw new Error(`[ChpTnSnd] 仲間 "${s}": 軸が 1 本もありません`);let o=c=>{let h=n.find(a=>a.name.toLowerCase()===String(c).toLowerCase());if(!h)throw new Error(`[ChpTnSnd] 仲間 "${s}": 軸 "${c}" はありません`);return h.name},i=(e.exclusive||[]).map(c=>c.map(o)),r=(e.forbid||[]).map(c=>Object.fromEntries(Object.entries(c).map(([h,a])=>[o(h),String(a)]))),l={name:String(s).trim(),desc:e.desc==null?null:String(e.desc),params:n,exclusive:i,forbid:r};return Pt.set(t,l),en.clear(),l}function as(s){let e=String(s).trim(),t=/^([^()\s]+)\s*(?:\((.*)\))?$/s.exec(e);if(!t)return null;if(t[2]===void 0)return{head:t[1],args:null};let n=t[2].split(",").map(o=>o.trim()).filter(o=>o!=="").map(o=>{let i=o.indexOf(":");return i<0?{axis:null,value:o}:{axis:o.slice(0,i).trim(),value:o.slice(i+1).trim()}});return{head:t[1],args:n}}function ht(s){let e=as(s);if(!e)return null;let t=Pt.get(e.head.toLowerCase());if(!t)return e.args===null?null:{error:`"${e.head}" は作り分けを持つ音色ではありません`};let n={};for(let i of e.args||[]){let r;if(i.axis!==null){if(r=t.params.find(c=>c.name.toLowerCase()===i.axis.toLowerCase()),!r)return{error:`${t.name} に軸 "${i.axis}" はありません(あるのは ${t.params.map(c=>c.name).join(" / ")})`}}else{let c=t.params.filter(h=>h.values.some(a=>a.value.toLowerCase()===i.value.toLowerCase()));if(!c.length&&ns(i.value)){let h=t.params.filter(a=>a.numeric&&!a.words);h.length===1&&(c=h)}if(c.length||(c=t.params.filter(h=>h.words&&h.words[i.value.toLowerCase()]!==void 0)),!c.length){let h=t.params.filter(d=>d.numeric&&!d.words);if(ns(i.value)&&h.length>1)return{error:`${t.name} の数 "${i.value}" は、どの軸のものか名前を付けて書きます(${h.map(d=>`${d.name}: ${i.value}`).join(" か ")})`};let a=d=>d.numeric?`${d.name}: ${d.min}〜${d.max}${d.words?" か "+Object.keys(d.words).join(" | "):""}`:`${d.name}: ${d.values.map(u=>u.value).join(" | ")}`;return{error:`${t.name} に値 "${i.value}" はありません(${t.params.map(a).join(" / ")})`}}if(c.length>1)return{error:`${t.name} の値 "${i.value}" は ${c.map(h=>h.name).join(" と ")} のどちらにもあります。軸の名前を付けて書きます(${c[0].name}: ${i.value})`};r=c[0]}if(r.numeric){let c=r.words?r.words[i.value.toLowerCase()]:void 0,h=c!==void 0?c:Number(i.value);if(c===void 0&&!ns(i.value))return{error:`${t.name} の ${r.name} は数で書きます("${i.value}" は数ではありません)`};if(h<r.min||h>r.max)return{error:`${t.name} の ${r.name} は ${r.min} から ${r.max} までです(${i.value})`};if(n[r.name]!==void 0)return{error:`${t.name} の ${r.name} を 2 回書いています`};n[r.name]=String(h);continue}let l=r.values.find(c=>c.value.toLowerCase()===i.value.toLowerCase());if(!l)return{error:`${t.name} の ${r.name} に値 "${i.value}" はありません(あるのは ${r.values.map(c=>c.value).join(" | ")})`};if(n[r.name]!==void 0)return{error:`${t.name} の ${r.name} を 2 回書いています`};n[r.name]=l.value}let o=i=>n[i]!==void 0&&n[i]!==null&&n[i].toLowerCase()!==String(t.params.find(r=>r.name===i).default).toLowerCase();for(let i of t.exclusive){let r=i.filter(o);if(r.length>1)return{error:`${t.name} の ${r.join(" と ")} は一緒に書けません`}}for(let i of t.params)n[i.name]===void 0&&(n[i.name]=i.default);for(let i of t.forbid)if(Object.entries(i).every(([r,l])=>n[r].toLowerCase()===l.toLowerCase()))return{error:`${t.name} の ${Object.entries(i).map(([r,l])=>`${r}: ${l}`).join(" と ")} は組み合わせられません`};return{fam:t,args:n}}function nr(s){let e=ht(s);if(!e||e.error)return null;let{fam:t,args:n}=e,o=r=>t.params.some(l=>l!==r&&l.values.some(c=>c.value.toLowerCase()===n[r.name].toLowerCase())),i=t.params.filter(r=>!r.numeric||n[r.name]!=null).map(r=>r.numeric||o(r)?`${r.name}: ${n[r.name]}`:n[r.name]);return i.length?t.name+"("+i.join(", ")+")":t.name}function tn(s){let e=String(s);if(en.has(e))return en.get(e);let t=ht(e),n=t?t.error?null:t.fam.name.toLowerCase()+"("+t.fam.params.filter(o=>!o.numeric).map(o=>`${o.name}=${t.args[o.name]}`.toLowerCase()).join(",")+")":e.trim().toLowerCase();return en.set(e,n),n}var ns=s=>/^[-+]?(\d+\.?\d*|\.\d+)$/.test(String(s).trim());function sr(s){let e=ht(s);if(!e||e.error)return null;let t={};for(let n of e.fam.params)n.numeric&&e.args[n.name]!=null&&(t[n.name]=Number(e.args[n.name]));return Object.keys(t).length?t:null}function gs(s){let e=ht(s);return e&&e.error?e.error:null}function Z(s){let e=tn(s);if(e===null)return-1;let t=T.findIndex(o=>tn(o.name)===e);if(t>=0)return t;let n=String(s).trim().toLowerCase();return T.findIndex(o=>(o.alias||[]).some(i=>String(i).toLowerCase()===n))}function ln(s){let e=ht(s);if(e&&!e.error){let{fam:r,args:l}=e,c=as(s),h={name:r.name,desc:r.desc,params:r.params.map(a=>({name:a.name,desc:a.desc,default:a.default,values:a.values.map(d=>({value:d.value,desc:d.desc})),...a.numeric?{min:a.min,max:a.max,unit:a.unit,...a.words?{words:{...a.words}}:{}}:{}})),exclusive:r.exclusive.map(a=>[...a]),forbid:r.forbid.map(a=>({...a})),variants:T.filter(a=>{let d=ht(a.name);return d&&!d.error&&d.fam===r&&as(a.name).args!==null}).map(a=>a.name)};if(c.args!==null||Z(s)>=0){let a=Z(s);if(a>=0){h.voice=T[a].name,h.args=l;let d=Vi(T[a]);d&&(h.detail=d)}}return h}let t=Z(s);if(t<0)return null;let n=T[t],o={name:n.name,desc:n.desc??null,params:[],exclusive:[],forbid:[]},i=Vi(n);return i&&(o.detail=i),o}var or=new Map;function Bc(s,e){or.set(String(s),e)}function Vi(s){let e=or.get(s.kind);return e?e(s):null}function vs(){return[...Pt.values()].map(s=>s.name)}Xi();var Ot=s=>(Array.isArray(s)?s:s==null?[]:[s]).map(e=>String(e).trim().toLowerCase()).filter(Boolean);function Vc(s){if(s==null||s==="")return null;if(typeof s=="number"||/^\d+$/.test(String(s).trim())){let n=Math.round(Number(s));return n>=0&&n<=127?n:(console.warn(`[ChpTnSnd] gm: ${s} は 0〜127 の外です`),null)}let e=Gn(s);if(e>=0)return e;let t=zn(s);return console.warn(`[ChpTnSnd] gm: "${s}" は GM の音色名ではありません`+(t.length?`(近いのは ${t.join(" / ")})`:"(sound/gm.js に 128 個あります)")),null}var cs=["curve","3db","2db","1.5db","linear","0.75db"];function ir(s){if(s==null)return 0;let e=Math.floor(Number(s));return!Number.isFinite(e)||e<0?(G(`[ChpTnSnd] vsteps "${s}" は読めません(0 以上の整数。0 なら寄せない)`),0):e}function ut(s,e){if(s&&(s.note!=null||s.noteJa!=null))throw new Error(`[ChpTnSnd] ${e}: 説明は note ではなく desc です(日本語は noteJa ではなく descJa)`)}function rr(s){if(s==null)return"curve";let e=String(s).toLowerCase();return cs.includes(e)?e:(G(`[ChpTnSnd] vcurve "${s}" は知らない名前です(使えるのは ${cs.join(" / ")})`),"curve")}function ce(s={}){return ut(s,"metaOf"),{genre:Ot(s.genre),tags:Ot(s.tags),special:Ot(s.special),dev:Ot(s.dev),targets:Ot(s.targets),steal:Xt(s.steal,s.name),gm:Vc(s.gm),vsteps:ir(s.vsteps),vcurve:rr(s.vcurve),...s.snapDiv>0?{snapDiv:Math.floor(s.snapDiv)}:{},alias:Array.isArray(s.alias)?s.alias.map(String):[],desc:s.desc==null?null:String(s.desc),descJa:s.descJa==null?null:String(s.descJa)}}function xe(s,e){if(String(s).includes("(")&&nr(s)===null)throw new Error(`[ChpTnSnd] 音色 "${s}" は登録できません。`+(gs(s)||"作り分けの書き方が読めません"));let t=tn(s),n=T.findIndex(o=>tn(o.name)===t);if(n>=0&&!e)throw new Error(`[ChpTnSnd] 音色 "${s}" はもう登録されています(差し替えるなら overwrite: true を渡してください)`);return n}function un(s,e,t){if(!(s>0))return 0;let n=t>0?t:16,o=Math.max(0,(n-1)*(1-s/15));switch(e){case"3db":return Math.pow(10,-3*o/20);case"2db":return Math.pow(10,-2*o/20);case"1.5db":return Math.pow(10,-1.5*o/20);case"0.75db":return Math.pow(10,-.75*o/20);case"linear":return s/15;default:return Math.pow(s/15,1.8)}}function ar(s,e,t){if(!(s>0))return 0;let n=t>0?t:15,o=i=>{let r=-20*Math.log10(s)/i;return ee(15*(n-r)/n,0,15)};switch(e){case"3db":return o(3);case"2db":return o(2);case"1.5db":return o(1.5);case"0.75db":return o(.75);case"linear":return ee(s*15,0,15);default:return ee(15*Math.pow(s,1/1.8),0,15)}}function Vt(s,e={},t={}){let n=xe(s,t.overwrite),o={role:ae(t.role,s),...ce(t),id:n>=0?n:T.length,name:s,kind:"fm",ratio:e.ratio??1,depth:e.depth??3,attack:e.attack??.002,decay:e.decay??.3,sustain:e.sustain??.15,wave:e.wave||er.SINE,drop:e.drop??0,dropTime:e.dropTime??.05},i=$t({...e,...t},"fm",s);return i&&(o.tone=i),n>=0?T[n]=o:T.push(o),o.id}function ws(s,e={},t={}){let n=xe(s,t.overwrite),o={role:ae(t.role,s),...ce(t),id:n>=0?n:T.length,name:s,kind:"beep",carrier:Math.max(0,e.carrier??0),jitter:Math.max(0,Math.min(1,e.jitter??0)),frame:Math.max(1,e.frame??60),display:Math.max(.01,Math.min(.99,e.display??.7)),divClock:Math.max(0,e.divClock??0),hiss:Math.max(0,Math.min(1,e.hiss??0)),wow:Math.max(0,Math.min(.5,e.wow??0)),muffle:Math.max(0,e.muffle??0)};return e.env!==void 0&&(o.defaultEnv=$e(e.env)),n>=0?T[n]=o:T.push(o),o.id}var ls=["tone","noise","env"],Le={saw:{r13:8,div:256},tri:{r13:10,div:512}};function xs(s,e={},t={}){let n=xe(s,t.overwrite),o=ls.includes(e.mode)?e.mode:"tone";e.mode!==void 0&&e.mode!==o&&G(`[ChpTnSnd] AY の mode "${e.mode}" は知らない名前です(使えるのは ${ls.join(" / ")})`);let i=o==="env",r=Le[e.shape]?e.shape:"saw";i&&e.shape!==void 0&&e.shape!==r&&G(`[ChpTnSnd] AY の shape "${e.shape}" は知らない名前です(使えるのは ${Object.keys(Le).join(" / ")})`);let l=ce(i?{vsteps:1,vcurve:"3db",snapDiv:Le[r].div,...t}:{vsteps:16,vcurve:"3db",...t}),c={id:n>=0?n:T.length,name:s,kind:"ay",mode:o,...i?{shape:r}:{},...e.ay?{ay:!0}:{},role:ae(t.role,s),...l,special:[...new Set(l.special.concat(i?["buzz","worklet"]:["worklet"]))]};return n>=0?T[n]=c:T.push(c),c.id}var us=["pulse","triangle","noise"];function bs(s,e={},t={}){let n=xe(s,t.overwrite),o=us.includes(e.mode)?e.mode:"pulse";e.mode!==void 0&&e.mode!==o&&G(`[ChpTnSnd] NES の mode "${e.mode}" は知らない名前です(使えるのは ${us.join(" / ")})`);let r=ce({vsteps:o==="triangle"?1:16,vcurve:"linear",...t}),l={id:n>=0?n:T.length,name:s,kind:"nes",mode:o,...o==="pulse"?{duty:[.125,.25,.5,.75].includes(e.duty)?e.duty:.5}:{},...o==="noise"&&e.short?{short:!0}:{},role:ae(t.role,s),...r,special:[...new Set(r.special.concat("worklet"))]};return n>=0?T[n]=l:T.push(l),l.id}function Ms(s,e={},t={}){let n=xe(s,t.overwrite),o=Array.isArray(e.wave)?e.wave:[];o.length!==64&&G(`[ChpTnSnd] FDS の波形は 64 個です(${s} は ${o.length} 個)`);let i=Array.from({length:64},(h,a)=>Math.max(0,Math.min(63,Math.round(o[a]??32)))),r=e.mod,l=ce({vsteps:32,vcurve:"linear",...t}),c={id:n>=0?n:T.length,name:s,kind:"fds",wave:i,...r&&r.ratio>0&&r.depth>0?{mod:{ratio:Number(r.ratio),depth:Number(r.depth),table:r.table==="step"?"step":"tri"}}:{},role:ae(t.role,s),...l,special:[...new Set(l.special.concat("worklet"))]};return n>=0?T[n]=c:T.push(c),c.id}function _s(s,e={},t={}){let n=xe(s,t.overwrite),o=Array.isArray(e.wave)?e.wave:[];o.length!==32&&G(`[ChpTnSnd] SCC の波形は 32 個です(${s} は ${o.length} 個)`);let i=Array.from({length:32},(c,h)=>Math.max(-128,Math.min(127,Math.round(o[h]??0)))),r=ce({vsteps:16,vcurve:"linear",...t}),l={id:n>=0?n:T.length,name:s,kind:"scc",wave:i,role:ae(t.role,s),...r,special:[...new Set(r.special.concat("worklet"))]};return t.env!==void 0&&(l.defaultEnv=$e(t.env)),n>=0?T[n]=l:T.push(l),l.id}function Ic(s,e={},t={}){let n=xe(s,t.overwrite),o=ce(t),i={id:n>=0?n:T.length,name:s,kind:"modal",patch:String(e.patch||""),role:ae(t.role,s),...o,special:[...new Set(o.special.concat("worklet"))]};return n>=0?T[n]=i:T.push(i),i.id}function jc(s,e={},t={}){let n=xe(s,t.overwrite),o=ce(t),i={id:n>=0?n:T.length,name:s,kind:"analog",patch:String(e.patch||""),role:ae(t.role,s),...o,special:[...new Set(o.special.concat("worklet"))]};return n>=0?T[n]=i:T.push(i),i.id}function Gc(s,e={},t={}){let n=xe(s,t.overwrite),o=ce(t),i={id:n>=0?n:T.length,name:s,kind:"brass",patch:String(e.patch||""),role:ae(t.role,s),...o,special:[...new Set(o.special.concat("worklet"))]};return n>=0?T[n]=i:T.push(i),i.id}function zc(s,e={},t={}){let n=xe(s,t.overwrite),o=["bd","sd","top","hh","tom","rim"],i=o.includes(e.key)?e.key:"bd";o.includes(e.key)||G(`[ChpTnSnd] OPNA のリズムは ${o.join(" / ")} のどれかです(${s} は ${e.key})`);let r=ce({vsteps:32,vcurve:"0.75db",...t}),l={id:n>=0?n:T.length,name:s,kind:"opnaRhythm",key:i,role:ae(t.role,s),...r,special:[...new Set(r.special.concat("worklet"))]};return t.env!==void 0&&(l.defaultEnv=$e(t.env)),n>=0?T[n]=l:T.push(l),l.id}function qc(s,e,t={},n={}){let o=xe(s,n.overwrite),i=ce(n),r={id:o>=0?o:T.length,name:s,kind:e,...t,role:ae(n.role,s),...i,special:[...new Set(i.special.concat("worklet"))]};return n.env!==void 0&&(r.defaultEnv=$e(n.env)),o>=0?T[o]=r:T.push(r),r.id}function hn(s,e={},t={}){let n=xe(s,t.overwrite),o=!!e.noise,i=Array.isArray(e.wave)?e.wave:[];!o&&i.length!==32&&G(`[ChpTnSnd] PC エンジンの波形は 32 個です(${s} は ${i.length} 個)`);let r=ce({vsteps:32,vcurve:"1.5db",...t}),l={id:n>=0?n:T.length,name:s,kind:"pce",...o?{noise:!0}:{wave:Array.from({length:32},(c,h)=>Math.max(0,Math.min(31,Math.round(i[h]??16))))},role:ae(t.role,s),...r,special:[...new Set(r.special.concat("worklet"))]};return t.env!==void 0&&(l.defaultEnv=$e(t.env)),n>=0?T[n]=l:T.push(l),l.id}function ys(s,e={},t={}){let n=xe(s,t.overwrite);if(!e.from&&!e.phrase)throw new Error("[ChpTnSnd] "+s+": 焼く元の音色(from)がありません");let o={role:ae(e.role,s),...ce(e),id:n>=0?n:T.length,name:s,kind:"baked",from:e.from,octaves:e.octaves||[2,3,4,5,6],step:e.step||1,sampleRate:e.sampleRate||22050,minLoop:e.minLoop,loop:e.loop,length:e.length,post:typeof e.post=="function"?e.post:null,phrase:e.phrase?String(e.phrase):null,tempo:e.tempo>0?Number(e.tempo):120,baked:null,baking:!1};return n>=0?T[n]=o:T.push(o),o.id}function fn(s,e={},t={}){let n=xe(s,t.overwrite),o=Array.isArray(e.layers)?e.layers:[],i=o.length===1&&o[0]&&o[0].gain!=null&&Number(o[0].gain)!==1&&!o[0].semi&&!o[0].cents&&!o[0].delay;if(o.length<2&&!i)throw new Error(`[ChpTnSnd] ${s}: 合成音色は 2 つ以上を重ねます(1 つだけなら、その音色をそのまま使ってください。音量だけ変えるなら @gain を書きます)`);let r=o.map((a,d)=>{let u=Z(a.wave);if(u<0)throw new Error(`[ChpTnSnd] ${s}: ${d} 番目の音色 "${a.wave}" は知らない名前です`);if(T[u].kind==="layer")throw new Error(`[ChpTnSnd] ${s}: 合成音色を合成音色に重ねられません ("${a.wave}")`);let f=a.follow==null?!0:!!a.follow;return{wave:u,gain:a.gain==null?1:ee(Number(a.gain),0,1),semi:a.semi==null?0:Number(a.semi),cents:a.cents==null?0:Number(a.cents),delay:a.delay==null?0:Math.max(0,Number(a.delay)),follow:f,env:a.env==null?null:$e(a.env)}}),l={role:ae(e.role,s),...ce(e),id:n>=0?n:T.length,name:s,kind:"layer",layers:r},c=r.map(a=>T[a.wave].name).join(" + "),h=r.length;return l.descJa=`合成音色。${c} を重ねた ${h} 声。`+(l.descJa||""),l.desc=`A layered voice — ${c}, ${h} voices.`+(l.desc?" "+l.desc:null),n>=0?T[n]=l:T.push(l),l.id}function $e(s){if(typeof s=="number")return ee(s,0,fe.length-1);let e=fe.findIndex(t=>t.name.toLowerCase()===String(s).toLowerCase());return e>=0?e:0}var ee=(s,e,t)=>Math.max(e,Math.min(t,s)),le={beep:{byKind:"beep",chars:[],digits:!0,keys:{tick:{min:1,max:1e6},carrier:{min:0,max:2e4},jitter:{min:0,max:1},frame:{min:1,max:1e3},display:{min:.01,max:.99}}},buzz:{byVoice:"buzz",chars:["^"],notes:!0,keys:{g:{semi:!0}}},tape:{byVoice:"tape",chars:["=","?"],notes:!0,keys:{baud:{min:1,max:1e6,note:!0},seed:{min:0,max:1e9},hiss:{min:0,max:1},wow:{min:0,max:1},muffle:{min:0,max:2e4},bytes:{hex:!0}}},acoustic:{byKind:"modal",full:!0,chars:[],keys:{ped:{min:0,max:1,step:1,only:["piano"]},to:{min:0,max:15,step:1,only:["timpaniRoll"]}}}},Wc=s=>{let e=s&&s.special||[];for(let[t,n]of Object.entries(le))if(n.byVoice&&e.includes(n.byVoice))return t;for(let[t,n]of Object.entries(le))if(n.byKind&&s&&s.kind===n.byKind)return t;return null},we=null,ft=class extends Error{};function Jc(s){let e=String(s??"normal").toLowerCase();return e==="strict"||e==="loose"?e:"normal"}function cr(s,e){we&&we.problems.push({level:s,text:String(e).replace(/^\[[^\]]+\]\s*/,"")})}function G(s){cr("warn",s);let e=we?we.mode:"normal";if(e==="strict")throw new Error(s);e!=="loose"&&console.warn(s)}function E(s){throw cr("error",s),we&&we.mode==="loose"?new ft(s):new Error(s)}var lr={};for(let[s,e]of Object.entries(le))for(let t of e.chars)lr[t]=s;var Ii=["l","q","v","r","o",">","<","}"],De=s=>`@{${le[s].byVoice||s}…}{ ... }`;function Kc(s,e){let t=lr[s];!t||e===t||E(`[ChpTnSnd] MML: "${s}" は ${De(t)} の中だけで書けます(外に書くと、どちらの書き方で読むのか分からなくなります)`)}var nn=1<<20,Ft=s=>s>="a"&&s<="z"||s>="0"&&s<="9"||s==="_"||s.charCodeAt(0)>127;function ur(s){let e=new Map,t=new Set,n="",o=0;for(;o<s.length;){if(s[o]!=="$"){n+=s[o++];continue}let a=o++,d="";for(;o<s.length&&Ft(s[o]);)d+=s[o++];let u=o;for(;u<s.length&&` 
	\r`.includes(s[u]);)u++;if(!d||s[u]!=="="){n+=s.slice(a,o);continue}for(u++;u<s.length&&` 
	\r`.includes(s[u]);)u++;if(s[u]!=="{"){G(`[ChpTnSnd] MML: マクロ "${d}" の中身が { } で囲まれていません`),n+=s.slice(a,o);continue}let f=0,v=u;for(;v<s.length;v++)if(s[v]==="{")f++;else if(s[v]==="}"&&--f===0)break;if(v>=s.length){G(`[ChpTnSnd] MML: マクロ "${d}" の } がありません`),o=s.length;continue}e.has(d)&&G(`[ChpTnSnd] MML: マクロ "${d}" が二重に登録されています(後のほうを使います)`),!t.has(d)&&[...d].some(x=>x.codePointAt(0)>127)&&(t.add(d),G(`[ChpTnSnd] MML: マクロ "${d}" の名前に英数字でない字が入っています(いまは動きますが、これから先は a-z 0-9 _ で書いてください)`)),e.set(d,s.slice(u+1,v).trim()),o=v+1}let i=a=>{let d=[];for(let u=0;u<a.length;u++){if(a[u]!=="$")continue;let f="";for(;u+1<a.length&&Ft(a[u+1]);)f+=a[++u];f&&d.push(f)}return d},r=new Map,l=[],c=a=>{let d=r.get(a)||0;if(d===1){let u=l.indexOf(a),f=[...l.slice(u<0?0:u),a].map(v=>`$${v}`).join(" → ");E(`[ChpTnSnd] MML: マクロ "${a}" が循環参照しています(${f})。展開しても終わらないので、ここで止めます`)}if(d!==2){r.set(a,1),l.push(a);for(let u of i(e.get(a)||""))e.has(u)&&c(u);l.pop(),r.set(a,2)}};for(let a of[...e.keys()])c(a);let h=new Set;for(;;){let a=n.indexOf("$");if(a<0)break;let d=a+1,u="";for(;d<n.length&&Ft(n[d]);)u+=n[d++];let f=e.get(u);if(f===void 0){u&&!h.has(u)&&(h.add(u),G(`[ChpTnSnd] MML: マクロ "${u}" は登録されていません(あるのは ${[...e.keys()].join(" / ")})`)),n=n.slice(0,a)+n.slice(d);continue}let v=n.slice(0,a)+f+n.slice(d);v.length>nn&&E(`[ChpTnSnd] MML: マクロ "${u}" が大きすぎます(広げると ${v.length} 文字。上限は ${nn} 文字)`),n=v}return n}var He="",Ye="",sn="",hr="loop";function hs(s){return s===hr}var ks="start",fr="outro",dr="ending",ji=!1;function pr(s){return s===fr?!0:s!==dr?!1:(ji||(ji=!0,G('[ChpTnSnd] MML: ラベル "ENDING" は古い名前です。これからは "OUTRO" と書きます(intro の対語)。いまのところ ENDING もそのまま読みます')),!0)}function dt(s){let e=String(s??"").trim().toLowerCase();return e===ks||e===hr||e===fr||e===dr}var Ss=ks.toUpperCase(),mr=s=>/^[A-Z0-9 _-]+$/.test(s)&&/[A-Z]/.test(s),Gi="'";function Uc(s){for(;;){let e=s.lastIndexOf("[");if(e<0)break;let t=s.indexOf("]",e);if(t<0){s=s.slice(0,e)+s.slice(e+1);continue}let n=s.slice(e+1,t);if(s[t+1]==="*"){G('[ChpTnSnd] MML: "]*" は使えません。くり返すときに戻る先は "#label LOOP" で書きます(ここは 1 回だけ鳴ります)'),s=s.slice(0,e)+n+s.slice(t+2);continue}let o=t+1;for(;o<s.length&&s[o]>="0"&&s[o]<="9";)o++;let i=o>t+1?parseInt(s.slice(t+1,o),10):2;if(i===0){s=s.slice(0,e)+s.slice(o);continue}let r=s.slice(0,e)+n.repeat(Math.max(0,i))+s.slice(o);r.length>nn&&E(`[ChpTnSnd] MML: くり返しが大きすぎます(広げると ${r.length} 文字。上限は ${nn} 文字)`),s=r}return s.replace(/[\[\]]/g,"")}function gr(s,e,t,n){let o=s.shift();if(!Te[o])return n(`[ChpTnSnd] MML: ${t(o??"")} — "${o??""}" というエフェクトはありません(書けるのは ${Object.keys(Te).join(" / ")})`),null;let i=Object.keys(Te[o].params),r={};if(s.length&&!s[0].startsWith("@")){let c=parseFloat(s.shift());if(!Number.isFinite(c))return n(`[ChpTnSnd] MML: ${t(o)} の 1 つ目は ${i[0]} の数です`),null;r[i[0]]=c}for(;s.length;){let c=s.shift();if(!c.startsWith("@"))return n(`[ChpTnSnd] MML: ${t(o)} — "${c}" は名前で書いてください(例 @resonance 0.8)。位置で書けるのは 1 つ目の ${i[0]} だけです`),null;let h=c.slice(1);if(h==="l"&&Te[o].params.time){let d=s.shift()??"",u=Zt(d,e);if(u==null)return n(`[ChpTnSnd] MML: ${t(o)} の "@l" は音長です。整数と付点で書きます(@l 8、付点 8 分は @l 8.)。"${d}" は読めません`),null;r.time=u;continue}let a=parseFloat(s.shift());if(!Number.isFinite(a))return n(`[ChpTnSnd] MML: ${t(o)} の "@${h}" に数がありません`),null;if(!Te[o].params[h])return n(`[ChpTnSnd] MML: ${t(o)} に "@${h}" はありません(書けるのは ${Object.keys(Te[o].params).map(d=>"@"+d).join(" ")}${Te[o].params.time?" / @l":""})`),null;r[h]=a}let l={kind:o};for(let[c,h]of Object.entries(Te[o].params))l[c]=ee(r[c]??h.default,h.min,h.max);return l}function dn(s){let e=String(s??"").replace(/\/\*[\s\S]*?\*\//g," ").replace(/\/\/[^\n]*/g," ").replace(/"[^"]*"/g," "),t=/(?:^|[^A-Za-z@_])t[ \t]*(\d+(?:\.\d+)?)/.exec(e);return t?Number(t[1]):null}function Ts(s){let e={},t=[],n,o=()=>n===void 0?n=dn(s)??120:n;for(let i of gt(String(s??""))){let r=Hc.exec(i);if(!r)continue;let l=r[1].toLowerCase(),c=r[2].trim();if(l==="section"){let h=c.search(/\s/),a=Number(h<0?c:c.slice(0,h));Number.isFinite(a)&&t.push({bar:a,name:h<0?"":c.slice(h).trim()})}else if(!(l==="takes"||l==="take")){if(!(l==="bundle"||l==="chord"||l==="drum"||l==="voice"||l==="wave"))if(l==="group"){let h=c.split(/[ \t]+/).filter(Boolean);if(!h.length){G('[ChpTnSnd] MML: "#group" に名前がありません。読み飛ばします');continue}h.length>2&&G(`[ChpTnSnd] MML: "#group ${c}" は 3 段以上です。2 段目まで("${h[0]} ${h[1]}")を使います`);for(let a of h.slice(0,2))mr(a)&&E(`[ChpTnSnd] MML: グループ名 "${a}" は全部大文字です。大文字の名前は予約語のために空けてあります(いまの予約語は ALL)。小文字で書いてください`);e.group=h[0],h[1]!==void 0&&(e.groupSet=h[1])}else if(l==="tempo"){let h=Number(c);Number.isFinite(h)&&h>0&&(e.tempo=h)}else if(l==="gain"){let h=c.split(/[ \t]+/).filter(Boolean),a=Number(h[0]);if(!Number.isFinite(a)||a<0){G(`[ChpTnSnd] MML: #gain "${c}" は 0 以上の数ではありません。読み飛ばします`);continue}a>8&&G(`[ChpTnSnd] MML: #gain ${a} は上限の 8 を越えています。8 で鳴らします`),e.gain=Math.min(8,a),h[1]&&(e.gainBy=h[1].toLowerCase())}else if(l==="fx"){let h=gr(c.split(/[\s,]+/).filter(Boolean),e.tempo??o(),a=>`"#fx ${a} …"`,a=>G(`${a}。読み飛ばします`));h&&(e.fx||(e.fx=[])).push(h)}else if(l==="looptimes"){let h=Number(c);Number.isFinite(h)&&h>0?e.loopTimes=Math.floor(h):G(`[ChpTnSnd] MML: #looptimes "${c}" は数ではありません。読み飛ばします`)}else c!==""&&(ml.includes(l)&&e[l]?e[l]+=`
${c}`:e[l]=c)}}return t.length&&(e.sections=t),e}var Hc=/^[ \t*]*#[ \t]*([A-Za-z][\w-]*)[ \t]*(.*)$/;function pn(s){let e=new Map,t=new Map;for(let n of gt(String(s??""))){let o=vr.exec(n);if(!o)continue;let i=o[1].trim().toLowerCase();Z(i)>=0&&E(`[ChpTnSnd] MML: バンドル音色 "${i}" は音色の名前と同じです(別の名前にしてください)`);let r=o[2].trim();e.has(i)&&t.get(i)!==r&&G(`[ChpTnSnd] MML: バンドル音色 "${i}" を 2 度書いています(後のほうを使います)`),t.set(i,r);let l=pt(o[2]);l.length||E(`[ChpTnSnd] MML: バンドル音色 "${i}" の中身がありません`),e.set(i,l.map(c=>dl(i,c,e)))}return e}var vr=/^[ \t*]*#[ \t]*bundle[ \t]+([A-Za-z][\w-]*)[ \t]*=[ \t]*(.*)$/i,Yc=/^[ \t*]*#[ \t]*chord[ \t]+([A-Za-z][\w-]*)[ \t]*=[ \t]*(.*)$/i;function wr(s){let e=new Map;for(let t of gt(String(s??""))){let n=Xc.exec(t);if(!n)continue;let o=n[1].trim(),i=n[2].trim(),r=8,l;for(let a=zi.exec(i);a;a=zi.exec(i)){let d=a[2].trim();a[1].toLowerCase()==="bits"?(r=Number(d),(!Number.isInteger(r)||r<1||r>16)&&E(`[ChpTnSnd] MML: 波形 "${o}" の @bits "${d}" は 1〜16 の整数です`)):l=d,i=i.slice(a[0].length)}let c=i.split(/[\s,]+/).filter(Boolean);(c.length<2||c.length>1024)&&E(`[ChpTnSnd] MML: 波形 "${o}" は 2〜1024 個の数です(${c.length} 個ありました)`);let h=c.map(a=>{let d=Zc(a);return Number.isFinite(d)||E(`[ChpTnSnd] MML: 波形 "${o}" の "${a}" は読めません(-1〜1 の数か、3/4 のような分数です)`),d});Nt(o,Z(o)>=0,"波形"),ie(o,h,r,{overwrite:!0,role:l}),e.set(o.toLowerCase(),h.length)}return e}var Xc=/^[ \t*]*#[ \t]*wave[ \t]+([A-Za-z][\w-]*)[ \t]*=[ \t]*(.*)$/i,zi=/^@[ \t]*(bits|role)[ \t]*\{([^}]*)\}[ \t]*/i;function Zc(s){let e=s.indexOf("/");if(e<0)return Number(s);let t=Number(s.slice(0,e)),n=Number(s.slice(e+1));return n===0?NaN:t/n}function xr(s){let e=new Map;for(let t of gt(String(s??""))){let n=fs.exec(t);if(!n)continue;let o=n[1].trim(),i=pt(n[2]);i.length||E(`[ChpTnSnd] MML: 音色 "${o}" の中身がありません`),e.set(o.toLowerCase(),il(o,i.map(r=>ol(o,r,s))))}return e}var fs=/^[ \t*]*#[ \t]*voice[ \t]+([A-Za-z][\w-]*(?:::[A-Za-z][\w-]*)?)[ \t]*=[ \t]*(.*)$/i,qi=new Set,ss=new RegExp(["@\\{(?<wave>[^}]*)\\}","@e\\{(?<env>[^}]*)\\}","@role\\{(?<role>[^}]*)\\}","@adsr\\{(?<adsr>[^}]*)\\}","@arp\\{(?<arp>[^}]*)\\}","@pitch\\{(?<pitch>[^}]*)\\}","@vol\\{(?<vol>[^}]*)\\}","@duty\\{(?<duty>[^}]*)\\}","@loop\\{(?<loop>[^}]*)\\}","@delay\\{(?<delay>[^}]*)\\}","@gain\\{(?<gain>[^}]*)\\}","@o(?<octave>[+-]?\\d+)","@d(?<detune>[+-]?\\d+)","@(?<extName>[A-Za-z]+)\\{(?<extBody>(?:[^{}]|\\{(?:[^{}]|\\{[^{}]*\\})*\\})*)\\}","\\s+"].join("|"),"giy"),Xe=new Map;function As(s,e,t={}){Xe.set(String(s).toLowerCase(),{make:e,tree:!!t.tree,raw:!!t.raw})}var br=new Map;function Qc(s,e){br.set(s,e)}function el(s){E(s)}function Mr(s,e,t){let n=[];for(let o of pt(s)){let i=o.trim();if(!i)continue;let r=/^([A-Za-z0-9_]+)\s*(?:\{([\s\S]*)\}|(-?\d*\.?\d+(?:e-?\d+)?))?$/i.exec(i);r||E(`[ChpTnSnd] MML: 音色 "${e}" の @${t} の "${i}" は読めません(guitar / t60 4.2 / head{sharp 0.8} のように書きます)`);let l=r[2]!==void 0?Mr(r[2],e,t):r[3]!==void 0?Number(r[3]):null;n.push({key:r[1],value:l})}return n}function tl(s,e,t,n=""){let o={};for(let i of pt(s)){let r=/^([A-Za-z]+)\s*(?:\{([^}]*)\}|(-?\d+(?:\.\d+)?)|\$([\w]+)|([A-Za-z][\w.-]*(?:::[A-Za-z][\w.-]*)?(?:\([^)]*\))?))$/.exec(i.trim());if(r||E(`[ChpTnSnd] MML: 音色 "${e}" の @${t} の "${i.trim()}" は読めません(mod{…} car{…} か、feedback 5 / from 名前 / from $マクロ のように書きます)`),r[2]!==void 0){let l={};for(let c of String(r[2]).split(",")){let h=c.trim().split(/\s+/).filter(Boolean);(h.length!==2||!Number.isFinite(Number(h[1])))&&E(`[ChpTnSnd] MML: 音色 "${e}" の @${t} の ${r[1]}{${r[2]}} は「名前 数」を \`,\` で区切って書きます`),l[h[0]]=Number(h[1])}o[r[1]]=l}else r[3]!==void 0?o[r[1]]=Number(r[3]):r[4]!==void 0?o[r[1]]={macro:r[4].toLowerCase(),mml:nl(n,r[4],e,t)}:o[r[1]]=r[5]}return Object.keys(o).length||E(`[ChpTnSnd] MML: 音色 "${e}" の @${t} に中身がありません`),o}function nl(s,e,t,n){let i=String(e).toLowerCase(),r=Cr(Lr(String(s)))+`
$${i}`,l=ur(r),c=l.lastIndexOf("",l.length-2),h=c>=0?l.slice(c+1,l.length-1).trim():"";return(!h||h===`$${i}`)&&E(`[ChpTnSnd] MML: 音色 "${t}" の @${n} が指すマクロ $${e} がありません`),h}function Ue(s,e,t){let n=String(s).split(/[\s,]+/).filter(Boolean).map(Number);return(!n.length||n.some(o=>!Number.isFinite(o)))&&E(`[ChpTnSnd] MML: 音色 "${e}" の @${t}{${s}} は数の並びで書きます`),n}function sl(s,e){let t=String(s).split(/[\s,]+/).filter(Boolean);t.length!==4&&E(`[ChpTnSnd] MML: 音色 "${e}" の @adsr は 4 つです(立ち上がり, 減り, 伸ばす高さ, 離し。${t.length} 個ありました)`);let n=(i,r)=>{if(/^\d*\.?\d+\s*%$/.test(i))return i.replace(/\s+/g,"");let l=Number(i);return(!Number.isFinite(l)||l<0)&&E(`[ChpTnSnd] MML: 音色 "${e}" の @adsr の ${r} "${i}" は読めません(秒の数か、"25%" のような割合で書きます)`),l},o=Number(t[2]);return Number.isFinite(o)||E(`[ChpTnSnd] MML: 音色 "${e}" の @adsr の伸ばす高さ "${t[2]}" は0〜1 の数です(割合では書けません)`),{a:n(t[0],"立ち上がり"),d:n(t[1],"減り"),s:o,r:n(t[3],"離し")}}function ol(s,e,t=""){let n={wave:null,env:null,adsr:null,arp:null,pitch:null,vol:null,duty:null,loop:{},delay:null,gain:null,octave:0,detune:0,role:null,ext:null},o=0;for(;o<e.length;){ss.lastIndex=o;let i=ss.exec(e);i||E(`[ChpTnSnd] MML: 音色 "${s}" の "${e.slice(o)}" は読めません(書けるのは @{音色} @e{形} @role @adsr `+[...Xe.keys()].map(l=>"@"+l+" ").join("")+"@arp @pitch @vol @duty @loop @delay @gain @o @d だけです)"),o=ss.lastIndex;let r=i.groups;if(r.wave!==void 0){n.wave=r.wave.trim();continue}if(r.env!==void 0){n.env=r.env.trim();continue}if(r.role!==void 0){n.role=r.role.trim();continue}if(r.adsr!==void 0){n.adsr=sl(r.adsr,s);continue}if(r.extName!==void 0){let l=r.extName.toLowerCase();Xe.has(l)||E(`[ChpTnSnd] MML: 音色 "${s}" の @${r.extName}{…} は読めません。知らない書き方です`+(Xe.size?`(加えられているもの: ${[...Xe.keys()].map(h=>"@"+h).join(" ")})`:""));let c=Xe.get(l);n.ext={word:l,spec:c.raw?r.extBody:c.tree?Mr(r.extBody,s,l):tl(r.extBody,s,l,t)};continue}if(r.arp!==void 0){n.arp=Ue(r.arp,s,"arp");continue}if(r.pitch!==void 0){n.pitch=Ue(r.pitch,s,"pitch");continue}if(r.vol!==void 0){n.vol=Ue(r.vol,s,"vol");continue}if(r.duty!==void 0){n.duty=Ue(r.duty,s,"duty");continue}if(r.loop!==void 0){for(let l of String(r.loop).split(",")){let c=l.trim().split(/\s+/).filter(Boolean);(c.length!==2||!Wi.includes(c[0].toLowerCase())||!Number.isInteger(Number(c[1])))&&E(`[ChpTnSnd] MML: 音色 "${s}" の @loop{${r.loop}} は「表の名前 戻る先」で書きます(表は ${Wi.join(" ")})`),n.loop[c[0].toLowerCase()]=Number(c[1])}continue}if(r.delay!==void 0){n.delay=Ue(r.delay,s,"delay")[0];continue}if(r.gain!==void 0){n.gain=Ue(r.gain,s,"gain")[0];continue}if(r.octave!==void 0){n.octave=ee(Number(r.octave),-4,4);continue}if(r.detune!==void 0){n.detune=ee(Number(r.detune),-2400,2400);continue}}return n}var Wi=["arp","pitch","vol","duty"];function lt(s,e,t,n){for(let o of t){let i=e[o];(o==="loop"?Object.keys(i).length>0:o==="octave"||o==="detune"?i!==0:i!==null)&&E(`[ChpTnSnd] MML: 音色 "${s}" に @${o} は書けません(${n})`)}}function Nt(s,e,t){let n=String(s).toLowerCase();e&&!qi.has(n)&&G(`[ChpTnSnd] MML: ${t} "${s}" はもう登録されています。この曲のあいだは #voice に書いたほうで鳴ります`),qi.add(n)}function il(s,e){if(e.length===1){let n=e[0];if(n.ext)return n.wave!==null&&E(`[ChpTnSnd] MML: 音色 "${s}" に @{${n.wave}} は書けません(@${n.ext.word} が音色そのものです)`),lt(s,n,["env","adsr","arp","pitch","vol","duty","loop","delay","gain","octave","detune"],`@${n.ext.word} は音色そのものです。表を着せるときは別の #voice でこの名前を呼んでください`),Nt(s,Z(s)>=0,"音色"),Xe.get(n.ext.word).make(s,n.ext.spec,{...n.role===null?{}:{role:n.role},overwrite:!0}),n.ext.word;if(n.wave===null)return n.adsr||E(`[ChpTnSnd] MML: 音色 "${s}" に音色がありません(@{名前} を書くか、@adsr{…} だけを書いてください)`),lt(s,n,["env","role","arp","pitch","vol","duty","loop","delay","gain","octave","detune"],"エンベロープには @adsr だけ書けます"),Nt(s,fe.some(r=>r.name.toLowerCase()===s.toLowerCase()),"エンベロープ"),Qi(s,{...n.adsr,overwrite:!0}),"env";let o=["adsr","arp","pitch","vol","duty","loop"];if(!(n.gain!==null&&!o.some(r=>r==="loop"?Object.keys(n.loop).length>0:n[r]!==null)))return lt(s,n,["adsr","delay","gain","octave","detune"],"@adsr は別の #voice に、@delay @o @d は重ねたときだけ書けます。@gain は表と一緒には書けないので、表を着せた音色を先に #voice で作ってください"),Nt(s,Z(s)>=0,"音色"),Yt(s,{wave:n.wave,...n.env?{env:n.env}:{},arp:n.arp,pitch:n.pitch,vol:n.vol,duty:n.duty,loop:n.loop,...n.role===null?{}:{role:n.role},overwrite:!0}),"tone";lt(s,n,["delay","octave","detune"],"@delay @o @d は重ねたときだけ書けます")}let t=e.map((n,o)=>(n.wave===null&&E(`[ChpTnSnd] MML: 音色 "${s}" の重ねる中身に @{名前} がありません`),o>0&&lt(s,n,["role"],"@role は音色ぜんぶに掛かるので、いちばん初めの中身にだけ書けます"),lt(s,n,["adsr","arp","pitch","vol","duty","loop"],"重ねる中身に表は書けません。表を着せた音色を先に #voice で作ってください"),{wave:n.wave,...n.env?{env:n.env}:{},...n.gain===null?{}:{gain:n.gain},...n.delay===null?{}:{delay:n.delay},semi:n.octave*12,cents:n.detune}));return Nt(s,Z(s)>=0,"音色"),fn(s,{layers:t,...e[0].role===null?{}:{role:e[0].role}},{overwrite:!0}),"layer"}function _r(s,e=pn(s)){let t=new Map,n=new Map;for(let o of gt(String(s??""))){let i=Yc.exec(o);if(!i)continue;let r=i[1].trim().toLowerCase();(Z(r)>=0||e.has(r))&&E(`[ChpTnSnd] MML: 和音の楽器 "${r}" は音色の名前と同じです(別の名前にしてください)`);let l=i[2].trim();t.has(r)&&n.get(r)!==l&&G(`[ChpTnSnd] MML: 和音の楽器 "${r}" を 2 度書いています(後のほうを使います)`),n.set(r,l);let c=pt(i[2]);c.length||E(`[ChpTnSnd] MML: 和音の楽器 "${r}" の中身がありません`),t.set(r,c.map(h=>rl(r,h,e)))}return t}function rl(s,e,t){let n=/^@\{([^}]*)\}[ \t]*(.*)$/.exec(e.trim());n||E(`[ChpTnSnd] MML: 和音の楽器 "${s}" の "${e.trim()}" は読めません(書けるのは @{名前} と呼び名だけです。音量やエンベロープは、その音色の側に持たせます)`);let o=n[1].trim().toLowerCase(),i=n[1].trim(),r=yr(n[2].trim())?E(`[ChpTnSnd] MML: 和音の楽器 "${s}" の "${n[2].trim()}" は読めません(音量やエンベロープは、その音色の側に持たせます。うしろに書けるのは呼び名だけです)`):n[2].trim()||i;if(t.has(o))return{parts:t.get(o),lane:i,label:r};let l=Z(o);return l<0&&E(`[ChpTnSnd] MML: 和音の楽器 "${s}" の "${n[1].trim()}" は知らない名前です`),{parts:[{wave:l,vol:null,gate:null,env:null,octave:0,detune:0,echo:void 0}],lane:i,label:r}}function yr(s){return/^@/.test(s)||/^[A-Za-z][+-]?\d/.test(s)}var kr=/^[ \t*]*#[ \t]*drum[ \t]+([A-Za-z][A-Za-z0-9]*)[ \t]*=[ \t]*(.*)$/i,Cs=/@\{[ \t]*drums\b([^}]*)\}[ \t]*\{/i,Sr=60,al=440*Math.pow(2,(Sr-69)/12);function Tr(s,e){let t=fe[s];if(!t)return e;if(Array.isArray(t.table))return t.loop===null||t.loop===void 0?Math.max(e,t.table.length/60):e;if(t.s!==0)return e;let n=o=>Oe(o,e);return Math.max(e,n(t.a)+n(t.d)+n(t.r))}function cl(s,e,t){if(s.length<2)return;let n=new Map;for(let{nm:o}of s)for(let i of(e.get(o)||{}).parts||[]){let r=T[i.wave];if(!r||!r.drum)continue;let l=(br.get(r.kind)||{})[r.drum];if(!l||l.ch===6)continue;let c=(i.octave||0)*12+(i.detune||0)/100,h=n.get(l.ch)||new Map;h.has(c)||h.set(c,`${o}(${r.name})`),n.set(l.ch,h)}for(let[o,i]of n){if(i.size<2)continue;let r=[...i.values()],l=`${o}:${r.join(",")}`;t.has(l)||(t.add(l),G(`[ChpTnSnd] MML: 同じ拍に高さ違いの打楽器が重なっています(${r.join(" / ")})。OPLL のリズム音源はチャンネル ${o} の高さを 1 組しか持たないので、あとに書いたほうの高さで両方が鳴ります。順に鳴らすぶんは書いたとおりです`))}}function Ar(s,e=pn(s)){let t=mt(s),n=new Map,o=[],i=0;for(let r of String(t??"").split(`
`)){let l=r.indexOf("//"),c=l<0?r:r.slice(0,l),h=l<0?"":r.slice(l+2),a=kr.exec(h);if(a){let u=a[1].trim();(i>0?o[o.length-1]:n).set(u,ll(u,a[2],e))}let d=0;for(;d<c.length;)if(i===0){let u=Cs.exec(c.slice(d));if(!u)break;d+=u.index+u[0].length,i=1,o.push(new Map)}else{let u=c[d++];u==="{"?i++:u==="}"&&i--}}return{outer:n,scopes:o}}function ll(s,e,t){let n=String(e).trim(),o=/^@\{([^}]*)\}[ \t]*(?:v[ \t]*(\d+(?:\.\d+)?)\b)?[ \t]*(?:!([A-Za-z_]\w*)(?:[ \t]+(-?\d+))?)?[ \t]*(.*)$/.exec(n);o||E(`[ChpTnSnd] MML: ドラム "${s}" の "${n}" は読めません(書けるのは @{名前} と v と合図と呼び名だけです。長さと高さは書きません)`);let i=o[1].trim().toLowerCase(),r=o[2]===void 0?null:ee(parseFloat(o[2]),0,15),l=o[3]?{name:o[3],arg:o[4]===void 0?0:parseInt(o[4],10)}:null,c=yr(o[5].trim())?E(`[ChpTnSnd] MML: ドラム "${s}" の "${o[5].trim()}" は読めません(長さと高さは書きません。うしろに書けるのは呼び名だけです)`):o[5].trim()||o[1].trim();if(t.has(i))return{parts:t.get(i),vol:r,label:c,cue:l};let h=Z(i);return h<0&&E(`[ChpTnSnd] MML: ドラム "${s}" の "${o[1].trim()}" は知らない名前です`),{parts:[{wave:h,vol:null,gate:null,env:null,octave:0,detune:0,echo:void 0}],vol:r,label:c,cue:l}}function ul(s){let e=String(s),t=$r(e);if(!t.length)return e;t.sort((i,r)=>i[0]-r[0]);let n="",o=0;for(let[i,r]of t)i<o||(n+=e.slice(o,i)+e.slice(i,r).replace(/\[/g,"[ ").replace(/\]/g," ]"),o=r);return n+e.slice(o)}function Cr(s){let e=String(s),t=$r(e);if(!t.length)return e.toLowerCase();t.sort((i,r)=>i[0]-r[0]);let n="",o=0;for(let[i,r]of t)i<o||(n+=e.slice(o,i).toLowerCase()+e.slice(i,r),o=r);return n+e.slice(o).toLowerCase()}function $r(s){let e=[],t=fl(s),n=new Set,o=new RegExp(Cs.source,"gi"),i;for(;(i=o.exec(s))!==null;){let l=i.index+i[0].length,c=1,h=l;for(;h<s.length&&c>0;h++)s[h]==="{"?c++:s[h]==="}"&&c--;e.push([l,h-1]);for(let a of s.slice(l,h-1).match(/\$[A-Za-z_][\w]*/g)||[])n.add(a.slice(1));o.lastIndex=h}let r=new Set;for(;n.size;){let l=n.values().next().value;if(n.delete(l),r.has(l)||!t.has(l))continue;r.add(l);let[c,h]=t.get(l);e.push([c,h]);for(let a of s.slice(c,h).match(/\$[A-Za-z_][\w]*/g)||[])n.add(a.slice(1))}return e}function hl(s){let e=[],t=0;for(let n of String(s??"").split(`
`)){let o=n.indexOf("//"),i=o<0?n:n.slice(0,o),r=o<0?"":n.slice(o+2);t===0&&kr.test(r)&&e.push(r);let l=0;for(;l<i.length;)if(t===0){let c=Cs.exec(i.slice(l));if(!c)break;l+=c.index+c[0].length,t=1}else{let c=i[l++];c==="{"?t++:c==="}"&&t--}}return e}function fl(s){let e=new Map,t=/\$([A-Za-z_][\w]*)[ \t\n\r]*=[ \t\n\r]*\{/g,n;for(;(n=t.exec(s))!==null;){let o=n.index+n[0].length,i=1,r=o;for(;r<s.length&&i>0;r++)s[r]==="{"?i++:s[r]==="}"&&i--;e.set(n[1],[o,r-1]),t.lastIndex=r}return e}function $s(s){let e=(s||[]).map(l=>mt(l)),t=[];for(let l of e){for(let c of gt(String(l??"")))(vr.test(c)||fs.test(c))&&t.push("//"+c);for(let c of hl(String(l??"")))t.push("//"+c)}if(!t.length)return e;let n=t.join(`
`)+`
`,o=new Map;for(let l of e)for(let[c,h]of Ji(String(l??"")))o.has(c)||o.set(c,h);let i=new Set,r=l=>{for(let c of String(l).matchAll(/\$([A-Za-z0-9_]+)/g)){let h=c[1].toLowerCase();i.has(h)||!o.has(h)||(i.add(h),r(o.get(h)))}};for(let l of t)fs.test(l.slice(2))&&r(l);return e.map(l=>{let c=Ji(String(l??"")),h=[...i].filter(a=>!c.has(a)).map(a=>o.get(a));return n+(h.length?h.join(`
`)+`
`:"")+String(l??"")})}function Ji(s){let e=new Map,t=String(s);for(let n of t.matchAll(/\$([A-Za-z0-9_]+)[ \t\r\n]*=[ \t\r\n]*\{/g)){let o=0,i=n.index+n[0].length-1;for(;i<t.length;i++)if(t[i]==="{")o++;else if(t[i]==="}"&&--o===0)break;i<t.length&&e.set(n[1].toLowerCase(),t.slice(n.index,i+1))}return e}function pt(s){let e=[],t="",n=0;for(let o of String(s)){if(o==="{"?n++:o==="}"&&(n=Math.max(0,n-1)),o===","&&n===0){e.push(t),t="";continue}t+=o}return e.push(t),e.map(o=>o.trim()).filter(Boolean)}function dl(s,e,t){let n={wave:-1,vol:null,gate:null,env:null,octave:0,detune:0,echo:void 0,vsteps:null,vcurve:null},o=0;for(;o<e.length;){os.lastIndex=o;let i=os.exec(e);i||E(`[ChpTnSnd] MML: バンドル音色 "${s}" の "${e.slice(o)}" は読めません(書けるのは @{音色} @e{形} v q @o @d @s @vsteps @vcurve だけです)`),o=os.lastIndex;let r=i.groups,l=r.echoLen??r.echoLen2;if(l!==void 0){let c=Number(l);n.echo=c>0?{len:c,depth:r.echoDepth?ee(Number(r.echoDepth),1,9):5}:null;continue}if(r.env!==void 0){n.env=$e(r.env.trim());continue}if(r.wave!==void 0){let c=r.wave.trim().toLowerCase();t.has(c)&&E(`[ChpTnSnd] MML: バンドル音色 "${s}" にバンドル音色 "${c}" は入れられません`);let h=Z(c);h<0&&E(`[ChpTnSnd] MML: バンドル音色 "${s}" の音色 "${r.wave.trim()}" は知らない名前です`),T[h].kind==="layer"&&E(`[ChpTnSnd] MML: バンドル音色 "${s}" に合成音色 "${T[h].name}" は入れられません(合成音色はそのまま使ってください)`),n.wave=h;continue}if(r.octave!==void 0){n.octave=ee(Number(r.octave),-4,4);continue}if(r.detune!==void 0){n.detune=ee(Number(r.detune),-2400,2400);continue}if(r.vsteps!==void 0){n.vsteps=ir(r.vsteps);continue}if(r.vcurve!==void 0){n.vcurve=rr(r.vcurve.trim());continue}if(r.vol!==void 0){n.vol=ee(Number(r.vol),0,15);continue}if(r.gate!==void 0){n.gate=ee(Number(r.gate),0,8);continue}}return n.wave<0&&E(`[ChpTnSnd] MML: バンドル音色 "${s}" の "${e}" に音色がありません(@{名前} を書いてください)`),n}var os=new RegExp(["@\\{(?<wave>[^}]*)\\}","@e\\{(?<env>[^}]*)\\}","@s\\{(?<echoLen>\\d+)(?:,(?<echoDepth>\\d+))?\\}","@s(?<echoLen2>\\d+)","@o(?<octave>[+-]?\\d+)","@d(?<detune>[+-]?\\d+)","@vsteps\\{(?<vsteps>\\d+)\\}","@vcurve\\{(?<vcurve>[^}]*)\\}","v(?<vol>\\d+)","q(?<gate>\\d+)","\\s+"].join("|"),"giy"),pl=["title","tempo","meter","about","loopTimes"],ml=["about"];function Er(s){let e=mt(s),t=e.split(/\r?\n/),n=c=>/^\s*\/\/\s*#\s*ch(\s|$)/i.test(c),o=t.map((c,h)=>n(c)?h:-1).filter(c=>c>=0),i=e.trim();if(o.length===0)return i?[i]:[];let r=t.slice(0,o[0]).filter(c=>/^\s*\/\//.test(c)),l=[];for(let c=0;c<o.length;c++){let h=t.slice(o[c],o[c+1]??t.length);l.push([...r,...h].join(`
`).trim())}return l.filter(Boolean)}var Ki=/^([ \t]*)#/;function mt(s){let e=String(s??"");if(!/^[ \t]*#/m.test(e))return e;let t=[],n=!1;for(let o of e.split(`
`)){t.push(!n&&Ki.test(o)?o.replace(Ki,"$1// #"):o);let i=0;for(;i<o.length;){if(!n&&o[i]==="/"&&o[i+1]==="*"){n=!0,i+=2;continue}if(n&&o[i]==="*"&&o[i+1]==="/"){n=!1,i+=2;continue}i++}}return t.join(`
`)}function gl(s){return(String(s??"").match(/^[ \t]*\/\/[ \t]*#/gm)||[]).length}function gt(s){let e=mt(s),t=[];for(let n=0;n<e.length;n++)if(e[n]==="/"&&e[n+1]==="/"){let o=n+2;for(;o<e.length&&e[o]!==`
`;)o++;t.push(e.slice(n+2,o)),n=o}else if(e[n]==="/"&&e[n+1]==="*"){let o=e.indexOf("*/",n+2);n=o<0?e.length:o+1}return t}function Lr(s,e=[],t=[],n=[]){let o=mt(s),i=/^\s*#\s*label\b[ \t]*(.*)$/i,r=/^\s*#\s*cue\b[ \t]*(.*)$/i,l="",c=!0;for(let h=0;h<o.length;h++)if(o[h]==="/"&&o[h+1]==="/"){let a=h+2;for(;a<o.length&&o[a]!==`
`;)a++;let d=o.slice(h+2,a),u=i.exec(d),f=r.exec(d);u&&c?(e.push(u[1].trim()),l+=`${He}${e.length-1}${He}`):u?G(`[ChpTnSnd] MML: ラベル "${u[1].trim()}" は行頭に書きます (音符の後ろに書いたものは効きません)`):f&&c?(t.push(f[1].trim()),l+=`${Ye}${t.length-1}${Ye}`):f&&G(`[ChpTnSnd] MML: 合図 "${f[1].trim()}" は行頭に書きます (音符の後ろに書いたものは効きません)`),h=a-1,l+=`
`,c=!0}else if(o[h]==="/"&&o[h+1]==="*"){let a=o.indexOf("*/",h+2),d=a<0?o.length:a+2;for(let u=h;u<d;u++)o[u]===`
`&&(l+=`
`);h=d-1}else if(o[h]==='"'){let d=o[h+1]==='"'&&o[h+2]==='"'?'"""':'"',u=h+d.length,f="";for(;u<o.length&&o[u]!==`
`&&!o.startsWith(d,u);)f+=o[u++];let v=o.startsWith(d,u);v||G(`[ChpTnSnd] MML: 字 "${f}" の閉じる ${d} がありません(字は 1 行の中で閉じます)`),n.push(f),l+=`${sn}${n.length-1}${sn}`,h=(v?u+d.length:u)-1,c=!1}else o[h]===`
`?c=!0:" 	\r".includes(o[h])||(c=!1),l+=o[h];return l}function vl(s){let e=new Map,t="",n=0;for(;n<s.length;){if(s[n]!=="!"){t+=s[n++];continue}let o=n++,i="";for(;n<s.length&&Ft(s[n]);)i+=s[n++];let r=n;for(;r<s.length&&` 
	\r`.includes(s[r]);)r++;if(!i||s[r]!=="="){t+=s.slice(o,n);continue}for(r++;r<s.length&&` 
	\r`.includes(s[r]);)r++;s[r]!=="{"&&E(`[ChpTnSnd] MML: 合図 "!${i}" の中身が { } で囲まれていません`);let l=s.indexOf("}",r);l<0&&E(`[ChpTnSnd] MML: 合図 "!${i}" の } がありません`);let[c,...h]=s.slice(r+1,l).trim().split(/\s+/);c||E(`[ChpTnSnd] MML: 合図 "!${i}" の中身が空です`),c===i&&E(`[ChpTnSnd] MML: 合図 "!${i}" を同じ名前へ登録しています(短い名前を付けるための書き方です)`);let a=Number(h[0]);e.set(i,{name:c,arg:Number.isFinite(a)?a:0}),n=l+1}return{body:t,table:e}}var Or=["key","tuning","fade","steps","bend","vib","pitch","vibrato"],wl={ped:"@{acoustic::piano}{ @ped 1 c e g @ped 0 }",to:"@{acoustic::timpaniRoll}{ v4 @to 14 a1 }"},xl=[...Or.filter(s=>s!=="steps"&&s!=="bend"&&s!=="vib"),"p"],bl=["vsteps","vcurve"],Ui="@{音色} @e{形} @key{…} @tuning{…} @fade{…} @steps{…} @bend{…} @vib{…} @pitch{…} @vibrato{…} @p{…} @f{…} @d @o @v @m @s";function on(s,e=null){let t=Ts(s);wr(s),xr(s);let n=pn(s),o=_r(s,n),i=Ar(s,n),r=[],l=[],c=[],h=Uc(ur(ul(Cr(Lr(String(s),r,l,c))))),{body:a,table:d}=vl(h),u=0,f=4,v=4,x=120,y=10,M=7,C=Z(Zi),$=0,N=0,S=null,k=null,A=0,V=null,P=0,B=null,Q=0,X=null,I=null,H=null,ye=null,ke=null,We=!1,hi=0,fi=0,$n=0,En=null,ue=null;e&&e.head&&(ue={t0:0,t1:0,from:e.level,to:e.level,raw:!!e.raw,gamma:1});let Wt=[],di=new Map,pi=!1,_t=(p,g)=>{if(g>=p.t1)return p.to;if(g<=p.t0)return p.from;let m=(g-p.t0)/(p.t1-p.t0);return p.from+(p.to-p.from)*(p.gamma===1?m:Math.pow(m,p.gamma))},Qa=(p,g,m)=>{let _=(p.fade||[]).filter(w=>w[0]<g-1e-9);_.push([g,ec(p,g)]),m&&_.push(m),p.fade=_},mi=(p,g,m)=>{if(m)return(O,L)=>O*L;let _=T[p]||{},w=(g&&g.vsteps!==null?g.vsteps:_.vsteps)||0,b=(g&&g.vcurve!==null?g.vcurve:_.vcurve)||"curve";return(O,L)=>ar(un(O,b,w)*L,b,w)},ec=(p,g)=>{let m=p.fade;if(!m||!m.length||g<=m[0][0])return p.vol;for(let _=1;_<m.length;_++)if(g<=m[_][0]){let[w,b]=m[_-1],[O,L]=m[_];return O>w?b+(L-b)*(g-w)/(O-w):L}return m[m.length-1][1]},tc=()=>{let p=[],g=J.length?J[J.length-1].t:null;for(let m=J.length-1;m>=0&&J[m].t===g;m--)Ln.has(J[m])&&p.push(J[m]);return p},Ln=new WeakMap,yt=0,kt=0,St=0,Re=0,Me=null,st=null,_e=null,nc=0,sc=0,Y=null,z={},D=0,J=[],ot=[],Tt=[],Jt=[],gi=[],Je=[],vi=p=>{let g=z._pedals[z._pedals.length-1];p&&z._pedOn==null&&(z._pedOn=g&&D-g[1]<.06?g[1]+.06:D),!p&&z._pedOn!=null&&(D>z._pedOn&&z._pedals.push([z._pedOn,D]),z._pedOn=null)},wi=(p,g)=>g>=p.t1?p.to:g<=p.t0?p.from:p.from+(p.to-p.from)*(g-p.t0)/(p.t1-p.t0),xi=p=>{let m=[[0,wi(p,D)]];return D<p.t1-1e-9&&m.push([p.t1-D,p.to]),m.every(_=>_[1]===0)?null:m},Ne=(p,g,m)=>{if(k&&!(m&&m.legato)&&(m={...m||{},bright:k[A++%k.length]}),V&&!(m&&m.legato)){let b=V[P++%V.length];b&&(m={...m||{},bend:b})}if(X){let b=xi(X);b&&(m={...m||{},pitchCurve:b})}if(I){let b=xi(I);b&&(m={...m||{},vibCurve:b,vibCurveRate:H})}if(B&&!(m&&m.legato)){let[b,O]=B[Q++%B.length];m={...m||{},vib:{depth:b,speed:O,delay:0}}}if(!Me){let b=bi(p,g,null,m);J.push(b),Ae={freq:g,parts:[{ev:b,shift:On(null)}]};return}let _=nc++,w=[];Me.forEach((b,O)=>{let L=bi(p,g,b,{bundle:_,part:O,...m});J.push(L),w.push({ev:L,shift:On(b)})}),Ae={freq:g,parts:w}},Ae=null,On=p=>Math.pow(2,fi+(p?p.octave:0)+(hi+(p?p.detune:0))/1200),bi=(p,g,m,_)=>{let w=On(m),b=m&&m.gate!==null?m.gate:M,O=ee((m&&m.vol!==null?m.vol:y)+$n,0,15),L=O,F=null;if(ue){let j=mi(m?m.wave:C,m,ue.raw);if(L=j(O,_t(ue,D)/15),D<ue.t1-1e-9){let ne=ue.t1-D,me=ue.raw?1:Math.max(1,Math.min(24,Math.ceil(ne/.1)));F=[];for(let ve=0;ve<=me;ve++){let Oi=ne*ve/me;F.push([Oi,j(O,_t(ue,D+Oi)/15)])}}}let R=m&&m.env!==null?m.env:$,q=Nn?Tr(R,p*b/8):p*b/8,K=m&&m.echo!==void 0?m.echo&&{delay:240/x/m.echo.len,depth:m.echo.depth}:En;if(F&&!pi){let j=T[m?m.wave:C]||{};(m&&m.vsteps!==null?m.vsteps:j.vsteps)===1&&(pi=!0,G(`[ChpTnSnd] MML: 音色 "${j.name}" は音量を受け付けません(vsteps: 1)。"@fade" は効きません`))}let se=null;Y&&le[Y].full&&z.to!=null&&(se=ee(z.to+$n,0,15),y=z.to,z.to=null);let U={t:D,dur:p,gate:q,freq:g*w,vol:Re?0:L,wave:m?m.wave:C,env:R,vibrato:N,echo:K,pos:[yt,kt,St],..._e?{lane:_e}:{},...m&&m.vsteps!==null?{vsteps:m.vsteps}:{},...m&&m.vcurve!==null?{vcurve:m.vcurve}:{},...We?{vib:{depth:N,speed:ye,delay:ke}}:{},...S?{vargs:{...S}}:{},...F&&!Re?{fade:F}:{},...se!=null&&!Re?{rollTo:se}:{},..._};return Re||Ln.set(U,O),U},Mi=()=>{let p=u;for(;p<a.length&&a[p]!=="}";)p++;let g=a.slice(u,p).trim(),m=n.get(g)||o.get(g);if(m){u=p+1;let w=o.has(g);if(Me=w?m[0].parts:m,S=null,st=w?m:null,_e=w?m[0].lane:null,w)for(let O of m)Pn.set(O.lane,O.label);let b=(T[Me[0].wave]||{}).defaultEnv;return $=b!==void 0?b:$e(Dt),!0}Me=null,st=null,_e=null;let _=C;return C=Ci(T,"波形",C),(C!==_||Z(g)>=0)&&(S=sr(g)),!1},he=t.tuning?Bi(t.tuning):null,oc=Number(t.a4)>0?Number(t.a4):440,Rn=he?Rt[he.root]:0,Kt=he?ge[he.root]:0,it=1,_i=!1,yi=!1,ki=!1,be=p=>{let g=R=>oc*Math.pow(2,(R-69)/12);if(!he)return g(p);let m=R=>R*it,_=(p%12+12)%12;if(he.cents.length===12){let R=((_-Kt)%12+12)%12;return m(g(p-R)*Math.pow(2,he.cents[R]/1200))}let w=$c[_];if(w===void 0)return _i||(_i=!0,G(`[ChpTnSnd] MML: この音律に半音はありません(${he.cents.length} 音で 1 周します)。平均律の高さで鳴らします`)),g(p);let b=he.cents.length,O=(Math.floor(p/12)-1)*7+w-(28+Rn),L=Math.floor(O/b),F=g(60+Kt);return m(F*Math.pow(2,(L*he.period+he.cents[O-L*b])/1200))},Si=0,ic=0,Nn=!1,Pn=new Map,rc=()=>{let p=u,g=u;for(;g<a.length&&a[g]!=="}";)g++;let m=/^[ \t]*drums\b([^}]*)$/.exec(a.slice(u,g));if(!m)return!1;let _=g+1;for(;_<a.length&&` 
	\r`.includes(a[_]);)_++;if(a[_]!=="{")return u=p,!1;u=_+1;let w=parseInt(String(m[1]).trim(),10),b=240/x/(Number.isFinite(w)&&w>0?w:v),O=new Map([...i.outer,...i.scopes[ic++]||new Map]),L=new Set,F={wave:C,vargs:S,bundle:Me,chordSet:st,vol:y,env:$,octave:f,lane:_e};Nn=!0;let R=y,q=[],K=()=>{if(!q.length)return;cl(q,O,L);let j=q.length>1?Si++:null;for(let{nm:ne,bang:me}of q){let ve=O.get(ne);if(!ve){G(`[ChpTnSnd] MML: ドラム "${ne}" は割り当てがありません(#drum `+ne+" = @{音色} と書きます)");continue}Me=ve.parts,_e=ne,ve.label&&Pn.set(ne,ve.label),me&&(ve.cue?Jt.push({name:ve.cue.name,arg:ve.cue.arg,t:D}):G(`[ChpTnSnd] MML: ドラム "${ne}" に合図の名前がありません(#drum ${ne} = @{音色} !名前 と書きます)`)),y=ve.vol===null?R:R*ve.vol/15,Ne(b,be(Sr),j===null?void 0:{chord:j})}D+=b,q=[]},se=()=>a[u]==="!"?(u++,!0):!1,U=1;for(;u<a.length;){let j=a[u];if(j==="}"){if(U--,u++,!U)break;continue}if(` 
	\r`.includes(j)){K(),u++;continue}if(j==="|"){K(),u++,Tt.some(ne=>Math.abs(ne-D)<1e-9)||Tt.push(D);continue}if(j==="."){K(),u++,D+=b;continue}if(j==="v"||j==="V"){K(),u++,R=ee(re()??R,0,15);continue}if(j==="{"){U++,u++;let ne="";for(;u<a.length&&a[u]!=="}";)ne+=a[u++];u++,U--,q.push({nm:ne.trim(),bang:se()});continue}if(/[A-Za-z]/.test(j)){u++,q.push({nm:j,bang:se()});continue}j>="0"&&j<="9"&&E(`[ChpTnSnd] MML: ドラムの囲みの中に数字 "${j}" は書けません(長さは囲みが持ちます。音量は v のうしろだけです)`),G(`[ChpTnSnd] MML: ドラムの囲みの中に "${j}" は書けません(楽器の字と . と v と ! と [ ] | だけです)`),u++}return K(),Nn=!1,C=F.wave,S=F.vargs,Me=F.bundle,st=F.chordSet,y=F.vol,$=F.env,f=F.octave,_e=F.lane,!0},te=()=>a[u],re=()=>{let p="";for(;u<a.length&&a[u]>="0"&&a[u]<="9";)p+=a[u++];return p===""?null:parseInt(p,10)},Fn=()=>{let p="";for(;u<a.length&&a[u]>="0"&&a[u]<="9";)p+=a[u++];if(a[u]==="."&&a[u+1]>="0"&&a[u+1]<="9")for(p+=a[u++];u<a.length&&a[u]>="0"&&a[u]<="9";)p+=a[u++];return p===""?null:parseFloat(p)},ac=()=>{let p=1;a[u]==="-"?(p=-1,u++):a[u]==="+"&&u++;let g=Fn();return g===null?null:p*g},At=(p,g)=>{let m=a[u];m!==void 0&&(g.includes(m)||m>="0"&&m<="9")||E(`[ChpTnSnd] MML: "@${p}" に値がありません`)},Ti=()=>{let p=1;a[u]==="-"?(p=-1,u++):a[u]==="+"&&u++;let g=re();return g===null?null:p*g},Ai=()=>{for(;u<a.length&&` 
	\r`.includes(a[u]);)u++;let p="";for(a[u]==="-"&&(p+=a[u++]);u<a.length&&(a[u]>="0"&&a[u]<="9"||a[u]===".");)p+=a[u++];let g=parseFloat(p);return Number.isFinite(g)?g:null},Ci=(p,g,m)=>{let _="";for(;u<a.length&&a[u]!=="}";)_+=a[u++];u++;let w=_.trim().toLowerCase(),b=p===T?Z(_):p.findIndex(L=>L.name.toLowerCase()===w);if(b<0&&(b=p.findIndex(L=>(L.alias||[]).some(F=>String(F).toLowerCase()===w))),b>=0)return b;let O=p===T?gs(_):null;return G(`[ChpTnSnd] MML: ${g} "${_}" は`+(O?`読めません。${O}`:`知らない名前です (使えるのは ${p.map(L=>L.name).join(" / ")})`)),m},cc=()=>{let p="";for(;u<a.length&&a[u]!=="}";)p+=a[u++];u++;let g=p.split(",").map(m=>{let _=parseFloat(m);return Number.isFinite(_)?Math.round(ee(_,-8,8)*1e4)/1e4:0});yt=g[0]??0,kt=g[1]??0,St=g[2]??0},lc=p=>{let g="";for(;u<a.length&&a[u]!=="}";)g+=a[u++];u++;let m=g.trim().split(/[\s,]+/).filter(Boolean),_=p===1?"@f":`@f${p}`;if(m[0]==="off"){Je.push({t:D,slot:p,off:!0});return}let w=gr(m,x,R=>`"${_}{${R} …}"`,E);if(!w)return;let b=w.kind,O=Je.find(R=>(R.slot??1)===p&&R.kind);O&&O.kind!==b&&G(`[ChpTnSnd] MML: "${_}{${b} …}" — エフェクトの種類は 1 台に 1 つです(先に書いた "${O.kind}" で鳴らします)。別の種類を足すなら、空いている番号に書いてください`);let L=O?O.kind:b,F=w;if(L!==b){F={kind:L};for(let[R,q]of Object.entries(Te[L].params))F[R]=ee(w[R]??q.default,q.min,q.max)}if(O&&!de[L]&&!Object.keys(Te[L].params).every(q=>O[q]===F[q])){G(`[ChpTnSnd] MML: "${_}{${L} …}" — ${L} は途中で値を変えられません(先に書いたもので鳴らします)。作るときに値が決まるためです`);for(let q of Object.keys(Te[L].params))F[q]=O[q]}Je.push({t:D,slot:p,...F})},uc=()=>{let p=u;for(;u<a.length&&" 	".includes(a[u]);)u++;let g=f;if(a[u]==="o"){u++;let w=re();if(w===null)return u=p,null;g=ee(w,1,8)}let m=a[u];if(ge[m]===void 0)return u=p,null;u++;let _=ge[m];for(;te()==="+"||te()==="#";)_++,u++;for(;te()==="-";)_--,u++;return(g+1)*12+_},hc=()=>{let p="";for(;u<a.length&&a[u]!=="}";)p+=a[u++];u++;let g=p.split(",").map(L=>L.trim()).filter(Boolean),m=g.some(L=>L.toLowerCase()==="link"),_=g.filter(L=>!["link","pin"].includes(L.toLowerCase())).join(" "),w=Bi(_);w||E('[ChpTnSnd] MML: "@tuning" の中身がありません'),he&&w.cents.length!==he.cents.length&&!ki&&(ki=!0,G(`[ChpTnSnd] MML: 1 周の音の数が ${he.cents.length} から ${w.cents.length} に変わります。ここから音名の指す音がずれます`));let b=60+ge[w.root],O=he?be(b):null;it=1,he=w,Kt=ge[w.root],Rn=Rt[w.root],m&&O&&(it=O/be(b))},fc=()=>{let p="";for(;u<a.length&&a[u]!=="}";)p+=a[u++];u++;let m=p.split(/[\s,]+/).filter(Boolean).map(Number);m.some(_=>!Number.isFinite(_)||_<0||_>9)&&E(`[ChpTnSnd] MML: "@steps{${p.trim()}}" — 値は 0 から 9 の数を並べます(例: @steps{9 3 6})`),k=m.length?m.map(_=>_/9):null,A=0},dc=()=>{let p="";for(;u<a.length&&a[u]!=="}";)p+=a[u++];u++;let m=p.split(/[\s,]+/).filter(Boolean).map(Number);m.some(_=>!Number.isFinite(_)||_<-1200||_>1200)&&E(`[ChpTnSnd] MML: "@bend{${p.trim()}}" — 値は -1200 から 1200 のセントを並べます(例: @bend{+80 -50 0})`),V=m.length?m:null,P=0},pc=()=>{let p="";for(;u<a.length&&a[u]!=="}";)p+=a[u++];u++;let m=p.split(/[\s,]+/).filter(Boolean).map(_=>{let[w,b]=_.split(":");return[Number(w),b===void 0?null:Number(b)]});m.some(([_,w])=>!Number.isFinite(_)||_<0||_>Ke||w!==null&&(!Number.isFinite(w)||w<.1||w>20))&&E(`[ChpTnSnd] MML: "@vib{${p.trim()}}" — 深さ(0 から ${Ke} のセント)を並べます。速さも決めるなら 深さ:速さ(0.1 から 20 Hz)(例: @vib{0 30 0 50:8})`),B=m.length?m:null,Q=0},$i=(p,g,m)=>{let _="";for(;u<a.length&&a[u]!=="}";)_+=a[u++];u++;let w=_.split(",").map(se=>Number(se.trim())),[b,O,L]=w,F=p!=="vibrato"||w.length<3||Number.isFinite(L)&&L>=.1&&L<=20;(w.length<2||w.length>(p==="vibrato"?3:2)||!Number.isFinite(b)||b<g||b>m||!Number.isFinite(O)||O<0||!F)&&E(p==="pitch"?`[ChpTnSnd] MML: "@pitch{${_.trim()}}" — 行き先のセント(-1200 から 1200)と拍数を書きます(例: @pitch{+700,2})`:`[ChpTnSnd] MML: "@vibrato{${_.trim()}}" — 行き先の深さ(0 から ${Ke} のセント)と拍数を書きます。3 つめに速さ(0.1 から 20 Hz)も書けます(例: @vibrato{40,2})`);let R=p==="pitch"?X:I,q=R?wi(R,D):0,K={t0:D,t1:D+O*60/x,from:q,to:ee(b,g,m)};p==="pitch"?X=K:(I=K,w.length>=3&&(H=L))},mc=()=>{let p="";for(;u<a.length&&a[u]!=="}";)p+=a[u++];u++;let g=p.split(",").map(R=>R.trim()),[m,_]=g.map(Number),w=!1,b=1,O=g.length<2||!Number.isFinite(m)||!Number.isFinite(_)||_<0;for(let R of g.slice(2)){let q=R.toLowerCase();if(q==="amp"){w=!1;continue}if(q==="raw"){w=!0;continue}if(q.startsWith("g")){let K=Number(q.slice(1));if(Number.isFinite(K)&&K>0){b=K;continue}}O=!0}O&&E('[ChpTnSnd] MML: "@fade" には行き先の音量と拍数を書きます(`@fade{0,8}`)。3 つめから先は書かなくてよく、書くなら amp(既定。音色が違っても同じ下がり方)・raw(v へ直に掛ける)・g<数>(時間の曲がり具合。1 で真っ直ぐ、2〜3 で立ち上がりを抑える)です。順番は問いません');let L=ue?_t(ue,D):15,F=ee(m,0,15);ue={t0:D,t1:D+_*60/x,from:L,to:F,raw:w,gamma:b},Wt.push({t:D,fade:ue});for(let R of tc()){let q=mi(R.wave,null,ue.raw),K=ue.t1-D,se=ue.raw&&ue.gamma===1?1:Math.max(1,Math.min(24,Math.ceil(K/.1)));for(let U=1;U<=se;U++){let j=K*U/se;Qa(R,D-R.t+(U>1?j-K/se:0),[D-R.t+j,q(Ln.get(R),_t(ue,D+j)/15)])}}},gc=()=>{let p="";for(;u<a.length&&a[u]!=="}";)p+=a[u++];u++;let g=!1,m=null;for(let F of p.split(",").map(R=>R.trim()).filter(Boolean))F.toLowerCase()==="link"?g=!0:F.toLowerCase()==="pin"?g=!1:m=F;(!m||Rt[m[0].toLowerCase()]===void 0)&&E('[ChpTnSnd] MML: "@key" には音名を書きます(`@key{a}` `@key{a,link}`)');let _=m[0].toLowerCase(),w=ge[_];for(let F of m.slice(1))F==="+"||F==="#"?w++:F==="-"&&w--;if(!he||he.name==="equal"){yi||(yi=!0,G('[ChpTnSnd] MML: 12 平均律に根音はありません。"@key" は何も変えません'));return}let b=()=>{Kt=(w%12+12)%12,Rn=Rt[_]};if(!g){it=1,b();return}let O=60+(w%12+12)%12,L=be(O);it=1,b(),it=L/be(O)},vc=p=>{let g=null,m=5;if(a[u]==="{"){u++;let _="";for(;u<a.length&&a[u]!=="}";)_+=a[u++];u++;let w=_.split(",").map(b=>parseInt(b,10));g=Number.isFinite(w[0])?w[0]:null,Number.isFinite(w[1])&&(m=ee(w[1],1,16))}else g=re();return g===null?p:g<=0?null:{delay:240/x/g,depth:m}},wc=()=>{if(a[u]!=="{"){N=ee(re()??N,0,Ke),ye=null,ke=null,We=!0;return}u++;let p="";for(;u<a.length&&a[u]!=="}";)p+=a[u++];u++;let g=p.split(",").map(m=>parseFloat(m));N=ee(Number.isFinite(g[0])?g[0]:N,0,Ke),ye=Number.isFinite(g[1])?ee(g[1],.1,30):null,ke=Number.isFinite(g[2])?ee(g[2],0,600):null,We=!0},Ei=!1,Li=(p,g)=>{let m=p?"?":"=";if((T[C]||{}).kind!=="beep"){G(`[ChpTnSnd] MML: "${m}" はビープ音源専用です (いまの音色は "${(T[C]||{}).name}")`),D+=g;return}let _=z.baud??1200;Ne(g,_*2);let w={data:p,bytes:p?z.bytes??null:null,baud:_,seed:z.seed??1,seq:sc++};for(let b of["hiss","wow","muffle"])z[b]!=null&&(w[b]=z[b]);J[J.length-1].tape=w,D+=g},Se=()=>{let p=re();Ei=p!==null;let g=p??v,m=240/x/g,_=m;for(;te()===".";)u++,_/=2,m+=_;return m},Pe=()=>{for(;u<a.length&&` 
	\r|`.includes(a[u]);)u++},Dn=()=>{let p=z._note;if(!p)return;z._note=null;let g=D;D=p.t;let m=J.length;Ne(p.dur,p.freq,{gates:p.gates});for(let _=m;_<J.length;_++)z._ids.push(_);D=g},xc=(p,g,m,_)=>{let w=[];for(let b of p.gates){let O=b.at,L=b.at+b.dur,F=Math.max(O,g),R=Math.min(L,m);if(R<=F+1e-9){w.push(b);continue}F>O+1e-9&&w.push({at:O,dur:F-O,hz:b.hz}),w.push({at:F,dur:R-F,hz:b.hz>0?b.hz:_}),L>R+1e-9&&w.push({at:R,dur:L-R,hz:b.hz})}p.gates=w},bc=()=>{let p=f,g=v,m=D,_=z._ids.slice();D=z._from;let w=(b,O,L)=>{let F=D,R=M;D=b,M=8,Ne(O-b,L,{toneOnly:!0}),M=R,D=F};for(;u<a.length&&a[u]!=="}";){let b=a[u++];if(` 
	\r|`.includes(b))continue;if(b===">"){f=Math.min(8,f+1);continue}if(b==="<"){f=Math.max(1,f-1);continue}if(b==="o"){f=ee(re()??f,1,8);continue}if(b==="l"){v=re()??v;continue}if(b==="q"){M=ee(re()??M,0,8);continue}if(b==="r"){D+=Se();continue}ge[b]===void 0&&E(`[ChpTnSnd] MML: "${b}" は矩形波のほうの { … } では書けません(音名 / r / l / q / o / > / < だけです)`);let O=ge[b];for(;te()==="+"||te()==="#";)O++,u++;for(;te()==="-";)O--,u++;let L=Se(),F=be((f+1)*12+O),R=D,q=D+Math.max(L*M/8,.005),K=[];for(let U of _){let j=J[U],ne=Math.max(R,j.t),me=Math.min(q,j.t+j.dur);me<=ne+1e-9||(xc(j,ne-j.t,me-j.t,F),K.push([ne,me]))}K.sort((U,j)=>U[0]-j[0]);let se=R;for(let[U,j]of K)U>se+1e-9&&w(se,U,F),se=Math.max(se,j);q>se+1e-9&&w(se,q,F),D+=L}u++,J.sort((b,O)=>b.t-O.t),f=p,v=g,D=Math.max(D,m)},Bn=(p,g)=>{if(p==="r"){Dn(),D+=g;return}p==="^"?z._note||E('[ChpTnSnd] MML: "^" の前に音符がありません'):(Dn(),z._note={t:D,midi:p,freq:be(p),dur:0,gates:[]});let m=z._note,_=z._g==null?0:be(m.midi+z._g);m.gates.push({at:m.dur,dur:g,hz:_}),m.dur+=g,D+=g};try{for(;u<a.length;){let p=a[u++];if(p==="|"){Tt.some(g=>Math.abs(g-D)<1e-9)||Tt.push(D);continue}if(!` 
	\r`.includes(p)){if(Y&&!le[Y].full&&p!==He&&p!==Ye&&p!=="@"&&!Ii.includes(p)&&!le[Y].chars.includes(p)&&!(le[Y].digits&&p>="0"&&p<="9")&&!(le[Y].notes&&ge[p]!==void 0)){let g=[...le[Y].chars,...le[Y].digits?["数字"]:[],...le[Y].notes?["音名"]:[],...Ii.filter(m=>m!=="}")];E(`[ChpTnSnd] MML: "${p}" は ${De(Y)} の中では書けません(中で書けるのは ${g.join(" ")} と @設定)`)}if(ge[p]!==void 0){let g=ge[p];for(;te()==="+"||te()==="#";)g++,u++;for(;te()==="-";)g--,u++;let m=Se();Y==="buzz"?Bn((f+1)*12+g,m):Y==="tape"?(z.baud=Math.max(1,Math.min(1e6,Math.round(be((f+1)*12+g)*12))),Li(!0,m)):(Ne(m,be((f+1)*12+g)),D+=m)}else if(p===Gi){let g=f,m=C,_=Me,w=S,b=y,O=$,L=st,F=_e,R=[],q=null,K=!1;for(;u<a.length&&a[u]!==Gi;){let U=a[u++];if(!` 
	\r`.includes(U)){if(U==="?"||U==="!"){q=U;continue}if(U===">"){f=Math.min(8,f+1);continue}if(U==="<"){f=Math.max(1,f-1);continue}if(U==="o"){f=re()??f;continue}if(U==="@"&&a[u]==="{"){u++,Mi(),K=!0;continue}if(U==="v"){y=ee(re()??y,0,15),K=!0;continue}if(ge[U]!==void 0){let j=ge[U];for(;te()==="+"||te()==="#";)j++,u++;for(;te()==="-";)j--,u++;R.push({midi:(f+1)*12+j,mark:q,wave:C,vargs:S,bundle:Me,vol:y,env:$,lane:_e,said:K}),q=null;continue}if(U===Ye){for(u++;u<a.length&&a[u]!==Ye;)u++;u++;continue}if(U===He){for(G("[ChpTnSnd] MML: 和音の中にラベルは置けません(和音は 1 音と同じ扱いです。閉じたあとに書きます)");u<a.length&&a[u]!==He;)u++;u++;continue}G(`[ChpTnSnd] MML: 和音の中に "${U}" は書けません (音名と + # - と > < o と @{} と v と ? ! だけ。長さは閉じたあとに書きます)`)}}u++;let se=Se();if(f=g,C=m,Me=_,S=w,y=b,$=O,st=L,_e=F,R.length===0)G("[ChpTnSnd] MML: 空の和音があります(休みたいなら r を書きます)"),D+=se;else{let U=Si++;L&&R.map((ne,me)=>me).sort((ne,me)=>R[ne].midi-R[me].midi).forEach((ne,me)=>{if(R[ne].said)return;let ve=L[Math.min(me,L.length-1)];R[ne].bundle=ve.parts,R[ne].lane=ve.lane}),R.forEach((j,ne)=>{C=j.wave,S=j.vargs,Me=j.bundle,y=j.vol,$=j.env,_e=j.lane;let me={chord:U,sub:ne};j.mark&&(me.mark=j.mark),Ne(se,be(j.midi),me)}),C=m,S=w,Me=_,y=b,$=O,_e=F,D+=se}}else if(p==="}"&&Y){if(le[Y].full&&(vi(!1),z._pedals.length))for(let g=z._first;g<J.length;g++)J[g].pedals=z._pedals;if(Y==="buzz"){Dn();let g=u;for(;g<a.length&&` 
	\r`.includes(a[g]);)g++;a[g]==="{"&&(u=g+1,bc())}Y=null}else if(p===He){let g="";for(;u<a.length&&a[u]!==He;)g+=a[u++];u++;let m=r[Number(g)]??"";m&&!ot.some(_=>_.name===m)&&(ot.push({name:m,t:D}),di.set(m,Wt.length),e&&hs(m.trim().toLowerCase())&&(ue={t0:D,t1:D,from:e.level,to:e.level,raw:!!e.raw,gamma:1}))}else if(p===Ye){let g="";for(;u<a.length&&a[u]!==Ye;)g+=a[u++];u++;let m=l[Number(g)]??"",[_,...w]=m.split(/\s+/);if(_){let b=Number(w[0]);Jt.push({name:_,arg:Number.isFinite(b)?b:0,t:D})}}else if(p===sn){let g="";for(;u<a.length&&a[u]!==sn;)g+=a[u++];u++;let m=c[Number(g)];m!==void 0&&gi.push({text:m,t:D})}else if(p==="!"){let g="";for(;u<a.length&&Ft(a[u]);)g+=a[u++];g||E('[ChpTnSnd] MML: "!" のうしろに合図の名前がありません');let m=d.get(g);Jt.push({name:m?m.name:g,arg:m?m.arg:0,t:D})}else if(p==="^"&&Y==="buzz")Bn("^",Se());else if(p==="r"){if(Y==="buzz"){Bn("r",Se());continue}D+=Se()}else if(p==="&"){for(Pe();;){if(te()===">"){f=Math.min(8,f+1),u++,Pe();continue}if(te()==="<"){f=Math.max(1,f-1),u++,Pe();continue}if(te()==="o"){u++,f=re()??f,Pe();continue}break}if(ge[a[u]]!==void 0&&Ae){let g=ge[a[u]];for(u++;te()==="+"||te()==="#";)g++,u++;for(;te()==="-";)g--,u++;let m=Se(),_=be((f+1)*12+g);if(Math.abs(_-Ae.freq)<1e-9)for(let{ev:w}of Ae.parts)w.dur+=m,w.gate=w.dur*M/8;else{for(let{ev:w}of Ae.parts)w.gate=w.dur;Ne(m,_,{legato:1})}D+=m}}else if(p==="*"){for(Pe();;){if(te()===">"){f=Math.min(8,f+1),u++,Pe();continue}if(te()==="<"){f=Math.max(1,f-1),u++,Pe();continue}if(te()==="o"){u++,f=re()??f,Pe();continue}break}if(ge[a[u]]!==void 0&&Ae){let g=ge[a[u]];for(u++;te()==="+"||te()==="#";)g++,u++;for(;te()==="-";)g--,u++;let m=Se();if(Ei){D+=m-Ae.parts[0].ev.dur;for(let{ev:w}of Ae.parts)w.dur=m,w.gate=m*M/8}let _=be((f+1)*12+g);for(let{ev:w,shift:b}of Ae.parts)w.glide=_*b}}else if(p==="o")f=re()??f;else if(p===">")f=Math.min(8,f+1);else if(p==="<")f=Math.max(1,f-1);else if(p==="l")v=re()??v;else if(p==="t")x=re()??x;else if(p==="v")if(a[u]==="+"||a[u]==="-"){let g=a[u++]==="-"?-1:1,m=Fn()??1;y=Math.max(0,Math.min(15,y+g*m))}else y=Math.max(0,Math.min(15,Fn()??y));else if(p==="q")M=Math.max(1,Math.min(8,re()??M));else if(p==="="||p==="?")Kc(p,Y),Li(p==="?",Se());else if(p==="p"){let g=re();g===0?Re=1:g===1?(Re=0,yt=1,kt=0,St=0):g===2?(Re=0,yt=-1,kt=0,St=0):g===3&&(Re=0,yt=0,kt=0,St=0)}else if(Y==="beep"&&p>="0"&&p<="9"){u--;let g=re();if(g!==null){let m=g,_=1;te()==="-"&&(u++,m=re()??g),te()===","&&(u++,_=Math.max(1,re()??1));let w=Se(),b=m>=g?1:-1,O=0;for(let L=g;(b>0?L<=m:L>=m)&&!(O++>=Lc);L+=b*_){Ne(w,Ec(L,z.tick??150));let F={};for(let R of["carrier","jitter","frame","display"])z[R]!=null&&(F[R]=z[R]);Object.keys(F).length&&(J[J.length-1].beepSet=F),D+=w}}}else if(p==="@"){let g=!1;if(Y&&le[Y].full){let w="",b=u;for(;b<a.length&&a[b]>="a"&&a[b]<="z";)w+=a[b++];let O=le[Y].keys;if(!w&&a[b]==="{"&&E(`[ChpTnSnd] MML: ${De(Y)} の中では音色を変えられません。区間を閉じてから変えてください`),O[w]&&a[b]!=="{"){let L=O[w];if(L.only&&!L.only.includes(z._inst)){let R=Object.keys(O).filter(q=>!O[q].only||O[q].only.includes(z._inst));E(`[ChpTnSnd] MML: "@${w}" は ${L.only.join(" / ")} の操作です(この音色の元は ${z._inst||"不明"}。書けるのは ${R.length?R.map(q=>`@${q}`).join(" / "):"ありません"})`)}u=b;let F=Ai();(F===null||F<L.min||F>L.max||L.step&&Math.abs(F/L.step-Math.round(F/L.step))>1e-9)&&E(`[ChpTnSnd] MML: "@${w}" の値は ${L.min}〜${L.max}${L.step?`(${L.step} きざみ)`:""} で書きます`),w==="ped"?vi(F===1):z[w]=F;continue}g=!0}if(Y&&!g){let w="",b=u;for(;b<a.length&&a[b]>="a"&&a[b]<="z";)w+=a[b++];let O=le[Y].keys;if(O[w]&&O[w].semi&&a[b]==="{"){u=b+1;let L="";for(;u<a.length&&a[u]!=="}";)L+=a[u++];u++;let F=L.trim().toLowerCase();if(F==="off"||F===""){z._g=null;continue}let R=Number(F);(!Number.isFinite(R)||Math.abs(R)>48)&&E(`[ChpTnSnd] MML: "@${w}{${L}}" は読めません(半音の数を -48 〜 48 で書くか、off と書きます)`),z._g=Math.round(R);continue}Object.keys(le[Y].keys).length||E(`[ChpTnSnd] MML: ${De(Y)} の中に "@" は書けません(設定を持たない区間です)。音色や効果は区間の外で書いてください`),(!w||a[b]==="{")&&E(`[ChpTnSnd] MML: "@" は ${De(Y)} の中では設定だけです(${Object.keys(O).map(L=>`@${L}`).join(" / ")})。音色や効果は区間の外で書いてください`);{if(O[w]||E(`[ChpTnSnd] MML: "@${w}" は ${De(Y)} の設定ではありません(あるのは ${Object.keys(O).map(K=>`@${K}`).join(" / ")})`),u=b,O[w].hex){for(;u<a.length&&` 
	\r`.includes(a[u]);)u++;let K="";for(;u<a.length&&/[0-9a-z]/.test(a[u]);)K+=a[u++];if(K==="random"||K===""){z[w]=null;continue}(K.length%2!==0||/[^0-9a-f]/.test(K))&&E(`[ChpTnSnd] MML: "@${w} ${K}" は読めません(16 進を 2 桁ずつ並べるか、random と書きます)`),z[w]=K.match(/../g).map(se=>parseInt(se,16));continue}let L=O[w].note?uc():null,F=L===null?Ai():Math.round(be(L)/2);F===null&&E(`[ChpTnSnd] MML: "@${w}" に値がありません`);let{min:R,max:q}=O[w];z[w]=Math.max(R,Math.min(q,F));continue}}let m=te(),_="";for(let w=u;w<a.length&&a[w]>="a"&&a[w]<="z";w++)_+=a[w];if(xl.includes(_)&&a[u+_.length]!=="{"&&E(`[ChpTnSnd] MML: "@${_}" は "@${_}{…}" と囲んで書きます`),["steps","bend","vib"].includes(_)&&a[u+_.length]!=="{"&&a[u+_.length]!=="0"&&E(`[ChpTnSnd] MML: "@${_}" は "@${_}{…}" と囲んで書きます(止めるのは @${_}0)`),_.length>1&&!Or.includes(_)){let w=Object.entries(le).find(([,b])=>b.full&&b.keys[_]);w&&E(`[ChpTnSnd] MML: "@${_}" は ${De(w[0])} の中だけで書けます(${(w[1].keys[_].only||[]).join(" / ")} の操作です。例: ${wl[_]||""})`),E(bl.includes(_)?`[ChpTnSnd] MML: "@${_}" はバンドル音色(#bundle)の中だけで書けます`:`[ChpTnSnd] MML: "@${_}" という命令はありません(書けるのは ${Ui})`)}if(m==="{"){if(u++,rc()||Mi())continue;{let b=u;for(;b<a.length&&` 
	\r`.includes(a[b]);)b++;if(a[b]==="{"){let O=Wc(T[C]);if(O||E(`[ChpTnSnd] MML: 音色 "${(T[C]||{}).name}" は区間を開けません(自分の書き方を持っていません)`),Y&&E("[ChpTnSnd] MML: 区間の中で区間は開けません"),u=b+1,Y=O,z={},le[O].full){let L=ln((T[C]||{}).name);z._inst=L&&L.detail?L.detail.instrument:null,z._first=J.length,z._pedals=[],z._pedOn=null}z._from=D,z._ids=[];continue}}let w=(T[C]||{}).defaultEnv;$=w!==void 0?w:$e(Dt)}else if(a.startsWith("key{",u))u+=4,gc();else if(a.startsWith("tuning{",u))u+=7,hc();else if(a.startsWith("fade{",u))u+=5,mc();else if(a.startsWith("steps{",u))u+=6,fc();else if(a.startsWith("steps0",u))u+=6,k=null;else if(a.startsWith("bend{",u))u+=5,dc();else if(a.startsWith("bend0",u))u+=5,V=null;else if(a.startsWith("vib{",u))u+=4,pc();else if(a.startsWith("vib0",u))u+=4,B=null;else if(a.startsWith("pitch{",u))u+=6,$i("pitch",-1200,1200);else if(a.startsWith("vibrato{",u))u+=8,$i("vibrato",0,Ke);else if(m==="e"&&a[u+1]==="{")u+=2,$=Ci(fe,"エンベロープ",$);else if(m==="e"){u++;let w=re();E(`[ChpTnSnd] MML: "@e${w??""}" — 番号ではエンベロープを選べません。@e{名前} で書いてください(番号はエンベロープを足すとずれるので通していません)`)}else if(m==="d")u++,At("d","+-"),hi=ee(Ti(),-2400,2400);else if(m==="o")u++,At("o","+-"),fi=ee(Ti(),-4,4);else if(m==="v")u++,At("v","+-"),$n=ee(ac(),-15,15);else if(m==="m")u++,At("m","{"),wc();else if(m==="s")u++,At("s","{"),En=vc(En);else if(m==="p"&&a[u+1]==="{")u+=2,cc();else if(m==="f"){u++;let w="";for(;a[u]>="0"&&a[u]<="9";)w+=a[u++];if(w==="0")Je.push({t:D,off:!0,all:!0});else if(a[u]==="{"){u++;let b=w?parseInt(w,10):1;b>999&&E(`[ChpTnSnd] MML: "@f${w}{…}" — 番号は 1 から 999 までです`),lc(b)}else E('[ChpTnSnd] MML: "@f" は "@f{lowpass 800}" と囲んで書きます(2 台目からは "@f2{echo 0.125}"。外すときは @f0、1 台だけなら @f2{off})')}else if(m==="n")u++,C=Z("noise"),S=null;else{let w=re();w!==null&&E(`[ChpTnSnd] MML: "@${w}" — 番号では音色を選べません。@{名前} で書いてください(番号は音色を足すとずれるので通していません)`),E(`[ChpTnSnd] MML: "@${_||a[u]||""}" という命令はありません(書けるのは ${Ui})`)}}}}Y&&E(`[ChpTnSnd] MML: ${De(Y)} が閉じていません`)}catch(p){if(!(p instanceof ft))throw p}for(let p=0;p<J.length;p++){let g=J[p],m=J[p+1];g.open=!!(m&&m.t<g.t+g.gate+1e-6)}let Mc=0;for(let p=0;p<J.length;p++){if(J[p].legato)continue;let g=p;for(;J[g+1]&&J[g+1].legato;)g++;if(g===p)continue;let m=J[p],_=J[g].t+J[g].gate-m.t,w=++Mc;for(let b=p;b<=g;b++)J[b].tieSpan=_,J[b].tieAt=J[b].t-m.t,J[b].tieId=w}let Ut=ot.find(p=>hs(p.name.trim().toLowerCase())),Ct=ot.find(p=>pr(p.name.trim().toLowerCase())),Vn=Ct?Ct.t:null,In=t.loopTimes>0?t.loopTimes:null,rt=Ut||Ct?{from:Ut?Ut.t:0,to:Vn??D,...In?{times:In}:{}}:null;if(rt&&!e){let p=Ct?di.get(Ct.name):Wt.length,g=Wt[p-1];if(g){let m=we;we={mode:"loose",problems:[]};let _;try{_=on(s,{level:_t(g.fade,rt.to),head:!Ut,raw:g.fade.raw}).events}finally{we=m}_.length===J.length&&J.forEach((w,b)=>{if(w.t<rt.from-1e-9||w.t>=rt.to-1e-9)return;let O=_[b];O.vol===w.vol&&JSON.stringify(O.fade)===JSON.stringify(w.fade)||(w.loopVol=O.vol,w.loopFade=O.fade??null)})}}In&&!rt&&G("[ChpTnSnd] MML: #looptimes を書いていますが、戻る先がありません(`#label LOOP` か `#label OUTRO` が要ります)");try{for(let p of ot){let g=p.name.trim();g.toLowerCase()===ks&&E(`[ChpTnSnd] MML: ラベル "${g}" は書けません。曲の頭の印は鳴らす側が足します(跳ぶ先の一覧にいつも並びます)`),!(dt(g)||!mr(g))&&E(`[ChpTnSnd] MML: ラベル "${g}" は全部大文字です。大文字の名前は予約語のために空けてあります(いまの予約語は LOOP と OUTRO)。小文字を混ぜてください`)}}catch(p){if(!(p instanceof ft))throw p}if(Je.length){let p=new Map;for(let m of Je)m.kind&&!p.has(m.slot??1)&&p.set(m.slot??1,m);let g=0;for(let m of p.values())g+=Xn(m);if(g>Di){let m=[...p.values()].map(_=>_.kind).join(" + ");G(`[ChpTnSnd] MML: このチャンネルのエフェクト(${m})は、1 ブロックの締め切りの ${g.toFixed(1)}% を使う見積もりです(${Di}% を越えました)。機械によっては音が途切れます。書き出し(renderBGM)には締め切りが無いので、焼けば必ず聞けます`)}}return{events:J,total:D,loop:rt,outro:Vn,ending:Vn,meta:t,marks:ot,bars:Tt,cues:Jt,texts:gi,filters:Je,laneLabels:Pn}}function Ml(s){let e=mt(s),t=/^[ \t]*\/\/[ \t]*#[ \t]*takes\b[ \t]*(.*)$/i,n=/^[ \t]*\/\/[ \t]*#[ \t]*take\b[ \t]*(.*)$/i,o=[{kind:"common",text:""}],i=null;for(let r of String(e??"").split(/\r?\n/)){let l=t.exec(r);if(l){let h=l[1].trim();if(i){h&&E(`[ChpTnSnd] MML: "#takes ${h}" は"#takes ${i.group}" の中では書けません(入れ子にはできません)`),i.options.length||E(`[ChpTnSnd] MML: "#takes ${i.group}" に選択肢がありません(中を "#take <名前>" で仕切ります)`),o.push(i),o.push({kind:"common",text:""}),i=null;continue}h||E('[ChpTnSnd] MML: 開いていない "#takes" を閉じています');let a=["restart","now"],[d,...u]=h.split(/[ \t]+/),f=u.map(v=>v.toLowerCase());for(let v of f)a.includes(v)||E(`[ChpTnSnd] MML: "#takes ${d}" の "${v}" は知らない指定です(いまあるのは ${a.join(" と ")})`);i={kind:"takes",group:d,options:[],restart:f.includes("restart"),now:f.includes("now")};continue}i&&/^[ \t]*\/\/[ \t]*#[ \t]*switch\b/i.test(r)&&E(`[ChpTnSnd] MML: "#switch" は "#takes ${i.group}" の中では書けません(網の目は曲ぜんぶで 1 つです)`);let c=n.exec(r);if(c){i||E(`[ChpTnSnd] MML: "#take ${c[1].trim()}" は "#takes <グループ>" の中だけで書けます`),i.options.push({name:c[1].trim(),text:""});continue}if(!i){o[o.length-1].text+=r+`
`;continue}i.options.length||i.options.push({name:"",text:""}),i.options[i.options.length-1].text+=r+`
`}return i&&E(`[ChpTnSnd] MML: "#takes ${i.group}" が閉じていません(名前を書かない "#takes" で閉じます)`),o}function Hi(s,e){let t=on(s),n=on(s+e);return{events:n.events.slice(t.events.length).map(o=>({...o,t:o.t-t.total})),marks:n.marks.slice(t.marks.length).map(o=>({...o,t:o.t-t.total})),bars:n.bars.slice(t.bars.length).map(o=>o-t.total),texts:n.texts.slice(t.texts.length),cues:n.cues.slice(t.cues.length).map(o=>({...o,t:o.t-t.total})),total:n.total-t.total}}function mn(s,e={}){let t=we===null;t&&(we={mode:Jc(e.mode),problems:[]});try{return _l(s)}catch(n){if(t&&we.mode==="loose"&&n instanceof ft)return{events:[],total:0,loop:null,outro:null,ending:null,meta:{},marks:[],takes:[],bars:[],cues:[],texts:[],problems:we.problems};throw n}finally{t&&(we=null)}}function _l(s){let e=()=>we?we.problems:[],t=Ml(s);if(!t.some($=>$.kind==="takes"))return{...on(s),takes:[],problems:e()};let n=[],o=[],i=[],r=[],l=[],c=[],h=[],a=new Map,d="",u=0;for(let $ of t){if($.kind==="common"){if(!$.text.trim())continue;let k=Hi(d,$.text);for(let A of k.events)n.push({...A,t:A.t+u});for(let A of k.marks)o.some(V=>V.name===A.name)||o.push({name:A.name,t:A.t+u});for(let A of k.bars)r.push(A+u);for(let A of k.cues)l.push({...A,t:A.t+u});for(let A of k.texts||[])c.push({...A,t:A.t+u});for(let A of k.filters||[])h.push({...A,t:A.t+u});for(let[A,V]of k.laneLabels??[])a.set(A,V);u+=k.total,d+=$.text;continue}let N=$.options.map(k=>({name:k.name,...Hi(d,k.text)})),S=Math.max(0,...N.map(k=>k.total));for(let k of N)Math.abs(k.total-S)>1e-6&&G(`[ChpTnSnd] MML: 選択肢 "${$.group}/${k.name}" の長さがそろっていません(${k.total.toFixed(3)}s / いちばん長いもの ${S.toFixed(3)}s)。後ろは休みで埋めます`);for(let k of N[0].events)n.push({...k,t:k.t+u});for(let k of N[0].marks)o.some(A=>A.name===k.name)||o.push({name:k.name,t:k.t+u});for(let k of N[0].bars)r.push(k+u);for(let k of N[0].cues)l.push({...k,t:k.t+u});for(let k of N[0].texts||[])c.push({...k,t:k.t+u});for(let k of N[0].filters||[])h.push({...k,t:k.t+u});for(let k of N)for(let[A,V]of k.laneLabels??[])a.set(A,V);i.push({group:$.group,at:u,dur:S,restart:$.restart===!0,now:$.now===!0,options:N.map(k=>({name:k.name,events:k.events,cues:k.cues,texts:k.texts,bars:k.bars,total:k.total}))}),u+=S}let f=o.find($=>hs($.name.trim().toLowerCase())),v=o.find($=>pr($.name.trim().toLowerCase())),x=v?v.t:null,y=Ts(s),M=y.loopTimes>0?y.loopTimes:null,C=f||v?{from:f?f.t:0,to:x??u,...M?{times:M}:{}}:null;return{events:n,total:u,loop:C,outro:x,ending:x,meta:y,marks:o,takes:i,bars:r,cues:l,texts:c,filters:h,laneLabels:a,problems:e()}}function Es(s,e={}){let t=Array.isArray(s)?s:[s],n=Math.max(...t.map(M=>M.total??0),.01),o=t.map(M=>M.loop).find(Boolean)??null,i=t.map(M=>M.outro).find(M=>M!=null)??null,r=t.map(M=>M.loop&&M.loop.times).find(M=>M>0)??2,c=o||i!=null?Math.max(1,Math.floor(e.loops??r)):1,h=o?o.from:0,a=i!=null?Math.min(i,n):n,d=[],u=0,f=(M,C)=>{d.push({from:M,to:C,at:u}),u+=C-M};e.intro!==!1&&h>0&&f(0,h);let v=d.length;for(let M=0;M<c;M++)f(h,a);let x=e.outro!==!1&&a<n,y=x?u:null;return x&&f(a,n),{parts:d,span:u,loops:c,outroAt:y,total:n,lapAt:v}}function gn(s,e){let t=[],n=[],o=[],i=Array.isArray(s)?s.map(a=>String(a??"")).filter(a=>a.trim()!==""):Er(s);if(!i.length)return{ok:!1,errors:[{ch:null,text:"鳴らすものがありません"}],warnings:n,channels:o,total:0};let r=console.warn,l=0;i.forEach((a,d)=>{let u=[];console.warn=(...v)=>{u.push(v.join(" "))};let f=null;try{f=mn(a,{mode:e})}catch(v){t.push({ch:d,text:String(v&&v.message?v.message:v)})}finally{console.warn=r}for(let v of u)n.push({ch:d,text:v.replace(/^\[MMSXX\]\s*/,"")});f&&(l=Math.max(l,f.total),o.push({ch:d,meta:f.meta,name:f.meta.name??f.meta.ch??null,role:f.meta.role??null,events:f.events.length,total:f.total,loop:f.loop,marks:f.marks,takes:f.takes??[]}),f.events.length||n.push({ch:d,text:"音符がありません"}))});for(let a of pl){let d=o.filter(f=>f.meta[a]!==void 0),u=d[0];for(let f of d)String(f.meta[a])!==String(u.meta[a])&&t.push({ch:f.ch,text:`#${a} が食い違っています (${u.ch+1} 本目は "${u.meta[a]}"、${f.ch+1} 本目は "${f.meta[a]}")。曲ぜんぶに効くので 1 つに決めます`})}let c=o.map(a=>a.loop).find(Boolean)||null;if(c)for(let a of o)a.loop&&Math.abs(a.loop.from-c.from)>=.001&&t.push({ch:a.ch,text:`LOOP が食い違っています (${a.loop.from.toFixed(2)} 秒)。${c.from.toFixed(2)} 秒にも書いてあります。戻る先は曲に 1 つです`});let h=new Map;for(let a of o)for(let d of a.takes||[])h.has(d.group)||h.set(d.group,[]),h.get(d.group).push({ch:a.ch,names:d.options.map(u=>u.name)});for(let[a,d]of h){let u=d[0];for(let f of d.slice(1))f.names.length===u.names.length&&f.names.every((x,y)=>x===u.names[y])||n.push({ch:f.ch,text:`選択肢 "${a}" の顔ぶれが食い違っています (${u.ch+1} 本目は ${u.names.join(" / ")}、${f.ch+1} 本目は ${f.names.join(" / ")})。同じ名前を書いておくと、まとめて替わります`});for(let f of d)f.names.some(v=>v==="")&&n.push({ch:f.ch,text:`選択肢 "${a}" に名前の無いものがあります("#take <名前>" で仕切ります)`})}return{ok:t.length===0,errors:t,warnings:n,channels:o,total:l}}var Ds={};oe(Ds,{applyMask:()=>Ll,fitsOn:()=>Al,groupPick:()=>Gt,groupsOf:()=>Be,peakUse:()=>Nr,planMask:()=>$l,slices:()=>Ps,useOf:()=>Fs});var Rs={};oe(Rs,{CHIPSETS:()=>Sl,FAMILIES:()=>yl,ROLES_COVERED:()=>Tl,ROLE_RANK:()=>jt,costOf:()=>Os,costOfEvent:()=>It,rankOf:()=>vn});var yl=["psg","noise","wave","fm","pcm","beep"],kl={pulse:"psg",triangle:"psg",saw:"psg",sine:"psg",noise:"noise",wave:"wave",fm:"fm",opm:"fm",opll:"fm",baked:"pcm",opnaRhythm:"pcm",beep:"beep"};function Os(s){let e=typeof s=="number"?T[s]:s;if(!e)return{};if(e.kind==="layer"){let t={};for(let n of e.layers||[])for(let[o,i]of Object.entries(Os(n.wave)))t[o]=(t[o]||0)+i;return t}return e.kind==="ay"?{[e.mode==="noise"?"noise":"psg"]:1}:e.kind==="nes"?{[e.mode==="noise"?"noise":"psg"]:1}:e.kind==="fds"||e.kind==="scc"?{wave:1}:e.kind==="pce"?{[e.noise?"noise":"wave"]:1}:{[kl[e.kind]||"psg"]:1}}function It(s){return s.masked?{}:Os(s.wave)}var Sl={psg:{psg:3,noise:1},"msx-scc":{psg:3,noise:1,wave:5},"msx-fm":{psg:3,noise:1,fm:9},nes:{psg:3,noise:1,pcm:1},pce:{wave:6,noise:2},beep:{beep:1}},jt={lead:6,bass:5,counter:4,perc:3,arp:2,chord:2,noise:1,se:0};function vn(s){let e=T[s.wave],t=e&&e.role,n=jt[t];return n===void 0?0:n}var Tl=Bt.every(s=>jt[s]!==void 0);var Ns=s=>[s.t,s.t+Math.max(.01,s.gate)];function Ps(s){let e=new Set;s.forEach(o=>o.events.forEach(i=>{let[r,l]=Ns(i);e.add(r),e.add(l)}));let t=[...e].sort((o,i)=>o-i),n=[];for(let o=0;o+1<t.length;o++){let i=t[o],r=t[o+1],l=[];s.forEach((c,h)=>c.events.forEach((a,d)=>{let[u,f]=Ns(a);u<=i&&f>i&&l.push({track:h,index:d,ev:a})})),l.length&&n.push({from:i,to:r,live:l})}return n}function Fs(s){let e={};for(let{ev:t}of s)for(let[n,o]of Object.entries(It(t)))e[n]=(e[n]||0)+o;return e}function Nr(s){let e={};for(let t of Ps(s))for(let[n,o]of Object.entries(Fs(t.live)))e[n]>=o||(e[n]=o);return e}function Al(s,e){let t=Nr(s),n={};for(let[o,i]of Object.entries(t)){let r=e[o]||0;i>r&&(n[o]=i-r)}return{ok:Object.keys(n).length===0,over:n}}function Rr(s,e){let{ev:t,track:n}=s,o=t.mark==="!"?2:t.mark==="?"?0:1,i=t.chord!==void 0,r=i?Math.min(vn(t),jt.chord):vn(t),l=i&&e.get(t.chord)===t.freq?1:0;return[o,r+l,-n]}var Cl=(s,e)=>s[0]-e[0]||s[1]-e[1]||s[2]-e[2];function $l(s,e){let t=new Map;s.forEach(o=>o.events.forEach(i=>{if(i.chord===void 0)return;let r=t.get(i.chord);(r===void 0||i.freq<r)&&t.set(i.chord,i.freq)}));let n=[];for(let o of Ps(s)){let i=Fs(o.live);for(let[r,l]of Object.entries(i)){let c=l-(e[r]||0);if(c<=0)continue;let h=o.live.filter(a=>It(a.ev)[r]>0).sort((a,d)=>Cl(Rr(a,t),Rr(d,t)));for(let a of h){if(c<=0)break;c-=It(a.ev)[r],n.push({track:a.track,index:a.index,from:o.from,to:o.to})}}}return El(n)}function El(s){let e=new Map;for(let n of s){let o=n.track+":"+n.index;e.has(o)||e.set(o,[]),e.get(o).push(n)}let t=[];for(let n of e.values()){n.sort((i,r)=>i.from-r.from);let o=null;for(let i of n){if(o&&Math.abs(i.from-o.to)<1e-9){o.to=i.to;continue}o={...i},t.push(o)}}return t.sort((n,o)=>n.from-o.from||n.track-o.track)}function Ll(s,e){let t=s.map(r=>({...r,events:r.events.map(l=>({...l}))})),n=new Map;for(let r of e){let l=r.track+":"+r.index;n.set(l,(n.get(l)||0)+(r.to-r.from))}let o=0,i=0;for(let[r,l]of n){let[c,h]=r.split(":").map(Number),a=t[c]&&t[c].events[h];if(!a)continue;let[d,u]=Ns(a);a.masked||o++,i+=Math.max(0,u-d-l),a.vol=0,a.masked=!0}return{tracks:t,silenced:o,extra:Math.round(i*1e3)/1e3}}function Be(s){let e=[];for(let t of s??[]){if(!t||!t.group)continue;let n=e.find(o=>o.name===t.group);n||(n={name:t.group,sets:[]},e.push(n)),t.groupSet&&!n.sets.includes(t.groupSet)&&n.sets.push(t.groupSet)}return e}function Gt(s,e={}){let t=Be(s),n=e.group==null?null:String(e.group),o=n&&t.find(h=>h.name===n)||t[0]||null,i=o?e.sets==null?o.sets.slice():o.sets.filter(h=>e.sets.includes(h)):[],r=[];(s??[]).forEach((h,a)=>{if(!(!h||!h.group)){if(!o||h.group!==o.name){r.push(a);return}h.groupSet&&!i.includes(h.groupSet)&&r.push(a)}});let l=new Set(r),c=null;return(s??[]).forEach((h,a)=>{c==null&&!l.has(a)&&h&&h.machine&&(c=h.machine)}),{group:o?o.name:null,sets:i,silent:r,machine:c}}var js={};oe(js,{WT_BELL:()=>Ir,WT_ORGAN:()=>Vs,WT_PAD_AIRY:()=>zr,WT_PAD_WARM:()=>Gr,WT_RAMP:()=>vt,WT_SINE:()=>Ie,WT_SQUARE_SOFT:()=>qr,WT_VOICE:()=>jr,registerDefaultWaves:()=>Is});var Pr=32,Ve=s=>Array.from({length:Pr},(e,t)=>s(t/Pr,t)),Vr=s=>{let e=Math.max(...s.map(Math.abs))||1;return s.map(t=>t/e)},wn=s=>Vr(Ve(e=>{let t=0;for(let[n,o]of s)t+=o*Math.sin(2*Math.PI*n*e);return t})),Ie=Ve(s=>Math.sin(2*Math.PI*s)),Ir=wn([[1,1],[3,.5],[5,.35],[7,.2],[11,.12]]),Vs=wn([[1,1],[2,.6],[3,.45],[4,.3],[6,.15]]),vt=Ve(s=>1-2*s),jr=Vr(Ve(s=>{let e=Math.sin(2*Math.PI*s),t=.5*Math.sin(2*Math.PI*2*s)+.35*Math.sin(2*Math.PI*3*s);return e+(s<.5?t:t*.25)})),Gr=wn([[1,1],[2,.45],[3,.22]]),zr=wn([[1,1],[3,.3],[5,.16]]),qr=Ve(s=>{let t=Math.min(s,Math.abs(s-.5),1-s)/.06;return(s<.5?1:-1)*Math.min(1,t)}),Fr=s=>Math.max(0,Math.sin(2*Math.PI*s))*2-1,Dr=s=>1-2*(s*2.5%1),Br=s=>(1-2*(s*2%1)+.5*(1-2*s))/1.5,Bs=s=>Array.from({length:512},(e,t)=>s(t/512));function Is(){pe("waveSine",{desc:null,params:[{name:"bits",default:"5",desc:null,values:[{value:"8",desc:null},{value:"5",desc:null},{value:"3",desc:null}]}]}),ie("waveSine(8)",Ie,8,{role:"chord",descJa:null,desc:null}),ie("waveSine(5)",Ie,5,{role:"chord",descJa:null,desc:null}),ie("waveSine(3)",Ie,3,{role:"chord",descJa:null,desc:null}),ie("waveBell",Ir,8,{role:"counter",descJa:null,desc:null}),pe("waveOrgan",{desc:null,params:[{name:"bits",default:"8",desc:null,values:[{value:"8",desc:null},{value:"5",desc:null}]}]}),ie("waveOrgan(8)",Vs,8,{role:"chord",descJa:null,desc:null}),ie("waveOrgan(5)",Vs,5,{role:"chord",descJa:null,desc:null}),ie("waveRamp",vt,5,{role:"lead",descJa:null,desc:null}),ie("waveVoice",jr,5,{role:"lead",descJa:null,desc:null}),ie("wavePadWarm",Gr,8,{role:"chord",env:"pad",descJa:null,desc:null}),ie("wavePadAiry",zr,8,{role:"chord",env:"swell",descJa:null,desc:null}),ie("waveSquareSoft",qr,8,{role:"lead",descJa:null,desc:null}),ie("waveHalfSine",Ve(Fr),8,{role:"lead",desc:null}),ie("waveSync",Ve(Dr),8,{role:"lead",desc:null}),ie("waveOctaveSaw",Ve(Br),8,{role:"lead",octave:-1,desc:null}),ie("halfSine",Bs(Fr),16,{role:"lead",desc:null}),ie("syncSaw",Bs(Dr),16,{role:"lead",desc:null}),ie("octaveSaw",Bs(Br),16,{role:"lead",octave:-1,desc:null})}var qs={};oe(qs,{FM_PRESETS:()=>Wr,isDrumTone:()=>Gs,registerDefaultFM:()=>zs});var Wr={fm2Lead:{gm:"Lead 1 (square)",pitch:[-180,-110,-50,0],vib:{depth:83,speed:6.5,delay:18},descJa:null,role:"lead",desc:null,ratio:2.5,depth:7,attack:.004,decay:.22,sustain:.25},fm2Growl:{gm:"Lead 8 (bass + lead)",vib:{depth:97,speed:9,delay:6},descJa:null,role:"bass",desc:null,ratio:1.5,depth:9,attack:.002,decay:.14,sustain:.12},fm2Chime:{gm:"Tubular Bells",vol:[15,15,14,13,12,11,10,9,8,7,7,6,5,5,4,4,3,3,2,2,1],descJa:null,role:"counter",desc:null,ratio:4.7,depth:5,attack:.002,decay:.6,sustain:.1}},Gs=s=>String(s).startsWith("fmDrum");function zs(){for(let[s,e]of Object.entries(Wr))Vt(s,e,{overwrite:!0,desc:e.desc,descJa:e.descJa,role:e.role,gm:e.gm})}var Ks={};oe(Ks,{BEEP_PRESETS:()=>Ws,isBeepTone:()=>Ol,registerDefaultBeeps:()=>Js});var Ws={"beep(noisy)":{role:"lead",desc:null,carrier:2400,jitter:.4,frame:60,display:.7,descJa:null},"beep(calm)":{role:"lead",desc:null,carrier:2400,jitter:.15,frame:60,display:.7,descJa:null},"beep(flat)":{role:"lead",desc:null,carrier:2400,jitter:0,descJa:null},"beep(direct)":{role:"lead",desc:null,carrier:0,jitter:.4,frame:50,display:.62,descJa:null},"beep(clean)":{role:"lead",desc:null,carrier:0,jitter:0,frame:60,display:.7,descJa:null},"beep(pluck)":{role:"lead",desc:null,carrier:2400,jitter:.25,frame:60,display:.7,env:"pluck",descJa:null},"beep(chime)":{role:"lead",desc:null,carrier:3600,jitter:.1,frame:60,display:.7,env:"piano",descJa:null},"tape(used)":{role:"se",special:["tape"],dev:["done"],tags:["tape","loading","cassette"],desc:null,carrier:0,jitter:.02,frame:7,display:.5,hiss:.05,wow:0,muffle:4e3,descJa:null},"tape(worn)":{role:"se",special:["tape"],dev:["done"],tags:["tape","loading","cassette"],desc:null,carrier:0,jitter:.02,frame:7,display:.5,hiss:.16,wow:.05,muffle:2200,descJa:null},"tape(clean)":{role:"se",special:["tape"],dev:["done"],tags:["tape","loading","cassette"],desc:null,carrier:0,jitter:.02,frame:7,display:.5,hiss:0,wow:0,muffle:6e3,descJa:null},"beep(glass)":{role:"lead",desc:null,carrier:6e3,jitter:.25,frame:120,display:.4,descJa:null},"beep(tar)":{role:"se",desc:null,carrier:900,jitter:.55,frame:30,display:.8,descJa:null}};function Jr(s,e){let t=Object.entries(Ws).filter(([n])=>n.startsWith(s+"(")).map(([n,o])=>({value:n.slice(s.length+1,-1),desc:o.desc}));pe(s,{desc:e.desc,params:[{...e.param,values:t}]})}function Js(){Jr("beep",{desc:null,param:{name:"model",default:"noisy",desc:null}}),Jr("tape",{desc:null,param:{name:"wear",default:"used",desc:null}});for(let[s,e]of Object.entries(Ws))ws(s,e,{desc:e.desc,descJa:e.descJa,role:e.role,tags:e.tags,special:e.special,dev:e.dev,vsteps:e.vsteps,vcurve:e.vcurve})}var Ol=s=>String(s).startsWith("bp");var Xs={};oe(Xs,{EXTRA_LEN:()=>Us,EXTRA_PRESETS:()=>Hr,SAW_STEP:()=>Ur,TUNER:()=>Kr,registerExtraWaves:()=>Ys});var Us=32,Hs=s=>Array.from({length:Us},(e,t)=>s(t/Us)),zt=s=>Hs(e=>e<s/16?1:-1),Kr=(()=>{let s=[.5,.35,.4,.95,1,.25],e=s.reduce((i,r)=>i+r*r,0),t=s.map((i,r)=>{let l=0;for(let c=0;c<=r;c++)l+=(r+1-c)*s[c]*s[c]/e;return-Math.PI*l}),n=Hs(i=>s.reduce((r,l,c)=>r+l*Math.sin(2*Math.PI*(c+1)*i+t[c]),0)),o=Math.max(...n.map(Math.abs));return n.map(i=>i/o)})(),Ur=Hs(s=>{let e=Math.floor(s*8);return e>=7?-1:e/6*2-1}),Hr={"wavePulse(6)":{descJa:null,role:"lead",wave:zt(1),bits:1,desc:null},"wavePulse(18)":{descJa:null,role:"lead",wave:zt(3),bits:1,desc:null},"wavePulse(31)":{descJa:null,role:"lead",wave:zt(5),bits:1,desc:null},"wavePulse(33)":{role:"lead",wave:Array.from({length:96},(s,e)=>e<32?1:-1),bits:1,desc:null},"wavePulse(37)":{descJa:null,role:"lead",wave:zt(6),bits:1,desc:null},"wavePulse(43)":{descJa:null,role:"lead",wave:zt(7),bits:1,desc:null},toolTuner:{descJa:null,role:"lead",wave:Kr,bits:8,special:["exact"],gain:1.9,desc:null},waveSawStep:{descJa:null,role:"lead",wave:Ur,bits:5,desc:null}};function Rl(){pe("wavePulse",{desc:null,params:[{name:"width",default:"6",desc:null,values:[{value:"6",desc:null},{value:"18",desc:null},{value:"31",desc:null},{value:"33",desc:null},{value:"37",desc:null},{value:"43",desc:null}]}]})}function Ys(){Rl();let s=e=>Z(e)>=0;for(let[e,t]of Object.entries(Hr))s(e)||ie(e,t.wave,t.bits,{role:t.role,desc:t.desc,descJa:t.descJa,special:t.special,gain:t.gain,vsteps:t.vsteps,vcurve:t.vcurve,snapDiv:t.snapDiv,dev:t.dev})}var to={};oe(to,{MIN_LOOP:()=>Nl,bakeOps:()=>Zs,bakePlan:()=>Qs,bakeSourceOf:()=>eo,loopPlan:()=>Zr,midiToFreq:()=>Qr,periodMultiple:()=>Xr,pitchSet:()=>ea});var Nl=1024;function Xr(s,e=8){for(let t=1;t<=e;t++){let n=!0;for(let o of s){let i=o*t;if(Math.abs(i-Math.round(i))>1e-6){n=!1;break}}if(n)return t}return 0}function Zr(s,e,t=1,n=1024){let o=e*t/s,i=Math.max(1,Math.ceil(n/o)),r=Math.round(o*i);return{samples:r,bakedFreq:e*t*i/r,cents:1200*Math.log2(e*t*i/r/s)}}var Qr=s=>440*Math.pow(2,(s-69)/12);function ea(s={}){let e=s.octaves??[2,3,4,5,6],t=Math.max(1,s.step??1),n=[];for(let o of e)for(let i=0;i<12;i+=t)n.push((o+1)*12+i);return n}function Yr(s){if(!(s>0))return 1/0;let e=Math.min(63,s*2);return 1023*3*Math.pow(2,11-e/4)/55930}var Pl=[1,Math.pow(2,600/1200),Math.pow(2,781.25/1200),Math.pow(2,950/1200)];function Zs(s){return{ops:s.ops.map(e=>{if(e.ratio!==void 0)return e;let t=(e.mul>0?e.mul:.5)*Pl[(e.dt2??0)&3],n=(e.d2r??0)===0&&(e.d1l??0)<15?1-(e.d1l??0)/15:0,o=e.ar>=31?0:Math.min(2,Yr(e.ar)/8),i=Math.min(4,Yr(e.d1r)*Math.min(1,(e.d1l??0)*3/96));return{ratio:t,sl:n,ar:o,dr:i}})}}function Qs(s,e={}){let t=e.sampleRate??22050,n=Xr(s.ops.map(u=>u.ratio)),o=s.ops.some(u=>u.sl>0),i=[],r=e.loop??o,l=n>0,c=e.minLoop??1024;r&&!l&&i.push("繰り返さない波を輪にします。継ぎ目の段差が "+(t/c).toFixed(0)+"Hz あたりで唸ります(輪の長さで高さが変わります)。嫌なら sl を 0 にして頭の中で減衰しきってください"),!r&&o&&i.push("段が残っているのに輪にしないので、途中で切れます");let h=e.length>0?e.length:s.ops.reduce((u,f)=>Math.max(u,f.ar+f.dr),0)+.02,a=ea(e).map(u=>{let f=Qr(u),v=r?Zr(f,t,l?n:1,c):null,x=Math.ceil(h*t);return{note:u,freq:f,bakedFreq:v?v.bakedFreq:f,cents:v?v.cents:0,attackSamples:x,loopSamples:v?v.samples:0,totalSamples:x+(v?v.samples:0)}}),d=a.reduce((u,f)=>u+f.totalSamples,0);return{sampleRate:t,loop:r,clean:l,periods:n,attack:h,notes:i,seamHz:r&&!l?t/(e.minLoop??1024):0,jobs:a,bytes:d*2,seconds:d/t}}function eo(s,e,t,n=[]){let{from:o,...i}=e;for(let l of Object.keys(i)){let c=["rate","length","tempo",...n];if(!c.includes(l))throw new Error(`[ChpTnSnd] MML: 音色 "${s}" の @${t} に "${l}" は書けません(from ${c.join(" ")})`)}let r=o&&typeof o=="object"?{phrase:o.mml}:{from:o};if(r.phrase&&i.length!==void 0)throw new Error(`[ChpTnSnd] MML: 音色 "${s}" の @${t} の length は、from に音色を書いたときだけです(フレーズの長さは書いた MML で決まります)`);return{...i,...r}}var ro={};oe(ro,{AY_CLOCK:()=>qt,AY_CODE:()=>io,AY_OUT_DIV:()=>sa,AY_PRESETS:()=>oa,AY_VOLTBL:()=>na,ayEnvPeriod:()=>so,ayNoisePeriod:()=>no,ayTonePeriod:()=>xn,registerAYPresets:()=>oo});var qt=1789772,na=[[0,1,1,2,2,3,3,4,5,6,7,9,11,13,15,18,22,26,31,37,45,53,63,76,90,106,127,151,180,214,255,255],[0,0,3,3,4,4,6,6,9,9,13,13,18,18,29,29,34,34,55,55,77,77,98,98,130,130,166,166,208,208,255,255]],sa=14568;function xn(s){return s>0?Math.max(1,Math.min(4095,Math.round(qt/(16*s)))):4095}function no(s){return s>0?Math.max(1,Math.min(31,Math.round(qt/(256*s)))):31}function so(s,e){return s>0?Math.max(1,Math.min(65535,Math.round(qt/(e*s)))):65535}var oa=[["ayTone",{mode:"tone"},"lead","Square wave from the AY-3-8910 / YM2149 itself: the register-level MSX PSG rather than an oscillator imitating it. Volume follows the chip table, 16 steps of about 3dB."],["ayNoise",{mode:"noise"},"noise","Noise from the AY-3-8910 / YM2149 itself: the 17-bit shift register of the real chip. The note picks the noise period (R6); o4a lands mid-range, lower notes are coarser. The chip has one noise generator, so two noise notes in the same part share its period."],["ayEnvSaw(5bit)",{mode:"env",shape:"saw"},"bass","The volume envelope of the YM2149 itself, cycled at audio rate as a falling sawtooth. Volume does nothing; the note sets the envelope period, whose steps are 16 times coarser than a tone, so high notes drift. One envelope serves all three channels of the chip."],["ayEnvSaw(4bit)",{mode:"env",shape:"saw",ay:!0},"bass","The same falling sawtooth through the AY-3-8910 volume table: sixteen uneven steps instead of thirty-two. The MSX1 and the ZX Spectrum sound."],["ayEnvTri(5bit)",{mode:"env",shape:"tri"},"bass","The volume envelope of the YM2149 itself, alternating, so it comes out as a triangle an octave below the sawtooth for the same period. Volume does nothing."],["ayEnvTri(4bit)",{mode:"env",shape:"tri",ay:!0},"bass","The alternating envelope through the AY-3-8910 volume table: a coarser triangle."]],ta={name:"bits",default:"5bit",desc:null,values:[{value:"5bit",desc:null},{value:"4bit",desc:null}]};function oo(){try{pe("ayEnvSaw",{desc:null,params:[ta]}),pe("ayEnvTri",{desc:null,params:[ta]})}catch{}for(let[s,e,t,n]of oa)try{xs(s,e,{role:t,desc:n,tags:["msx"]})}catch{}}var io=`const CLK = ${qt};
const VOLTBL = ${JSON.stringify(na)};
const OUT_DIV = ${sa};
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
for (let i = 0; i < 3; i++) {
this.count[i]++;
if (this.count[i] >= this.freq[i]) {
this.edge[i] ^= 1;
if (this.freq[i] >= 1) this.count[i] -= this.freq[i];
else this.count[i] = 0;
}
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
this.pool = [];
this.log = !!q.log;
this.logNow = 0;
this.dcX = 0;
this.dcY = 0;
this.dcR = 1 - 2 * Math.PI * 20 / sampleRate;   // 20Hz
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
/** チップを 1 個足す。type は音量の表(0 = YM2149、1 = AY-3-8910) */
grow(type) {
const c = new PSG(sampleRate, type);
const chip = { c, type, log: null, v: [0, 1, 2].map(() => ({ end: 0, vs: null, ps: null, gs: null })) };
if (this.log) {
const raw = c.writeReg.bind(c);
chip.log = [];
c.writeReg = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
}
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
if (chip.v[ch].end > 0) this.silence(chip, ch);
const noise = !!ev.noise;
const env = ev.env || null;
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
c.writeReg(11, env.ep & 0xff);
c.writeReg(12, (env.ep >> 8) & 0xff);
c.writeReg(13, env.shape);
this.gate(c, ch, ev.g0 || 0);
}
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
this.step(now);
while (this.at < this.events.length && this.events[this.at].t <= now) {
this.start(this.events[this.at++], now);
}
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
this.port.postMessage({ regs: chip.log, chip: k, type: chip.type });
chip.log = [];
}
}
return true;
}
}
registerProcessor('mmsxx-ay', AyBank);`;var mo={};oe(mo,{NES_CLOCK:()=>wt,NES_CODE:()=>po,NES_DUTIES:()=>ao,NES_NOISE_PERIODS:()=>bn,NES_OUT_GAIN:()=>ia,NES_PRESETS:()=>ra,nesDutyIndex:()=>ho,nesNoisePeriod:()=>uo,nesPulseTimer:()=>co,nesTriangleTimer:()=>lo,registerNESPresets:()=>fo});var wt=1789773,bn=[4,8,16,32,64,96,128,160,202,254,380,508,762,1016,2034,4068],ao=[.125,.25,.5,.75],ia=1.876;function co(s){return s>0?Math.max(8,Math.min(2047,Math.round(wt/(16*s)-1))):2047}function lo(s){return s>0?Math.max(2,Math.min(2047,Math.round(wt/(32*s)-1))):2047}function uo(s,e){if(!(s>0))return 15;let t=e?wt/(93*s):wt/(16*s),n=0;for(let o=1;o<16;o++)Math.abs(Math.log(bn[o]/t))<Math.abs(Math.log(bn[n]/t))&&(n=o);return n}function ho(s){let e=0;for(let t=1;t<4;t++)Math.abs(ao[t]-s)<Math.abs(ao[e]-s)&&(e=t);return e}var ra=[["nesPulse(12)",{mode:"pulse",duty:.125},"lead","NES APU pulse at 12.5% duty, from the chip itself. Thin and nasal. Volume is the 4-bit value as amplitude, and the two pulses share one nonlinear mixer."],["nesPulse(25)",{mode:"pulse",duty:.25},"lead","NES APU pulse at 25% duty, from the chip itself. The classic NES lead."],["nesPulse(50)",{mode:"pulse",duty:.5},"lead","NES APU pulse at 50% duty, from the chip itself. A plain square."],["nesTriangle",{mode:"triangle"},"bass","NES APU triangle, from the chip itself: a 32-step staircase, an octave below a pulse with the same timer. It has no volume control; v0 silences it and anything else plays full."],["nesNoise(long)",{mode:"noise"},"noise","NES APU noise in its long mode: the 15-bit shift register, heard as white noise. The note picks one of the sixteen periods; o4a lands mid-range, lower notes are coarser."],["nesNoise(short)",{mode:"noise",short:!0},"noise","NES APU noise in its short mode: the register loops every 93 steps, so it comes out as a metallic buzz with a pitch. The note picks the nearest of the sixteen periods."]];function fo(){try{pe("nesPulse",{desc:null,params:[{name:"duty",default:"50",desc:null,values:[{value:"12",desc:null},{value:"25",desc:null},{value:"50",desc:null}]}]}),pe("nesNoise",{desc:null,params:[{name:"mode",default:"long",desc:null,values:[{value:"long",desc:null},{value:"short",desc:null}]}]})}catch{}for(let[s,e,t,n]of ra)try{bs(s,e,{role:t,desc:n,tags:["nes"]})}catch{}}var po=`const CLK = ${wt};
const NOISE = ${JSON.stringify(bn)};
const OUT_GAIN = ${ia};
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
this.dcInit = false;
this.dcR = 1 - 2 * Math.PI * 20 / sampleRate;   // 20Hz
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
const c = new APU(sampleRate);
const chip = { c, log: null, v: [0, 1, 2, 3].map(() => ({ end: 0, vs: null, ps: null, ds: null })) };
if (this.log) {
const raw = c.writeReg.bind(c);
chip.log = [];
c.writeReg = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
}
c.writeReg(0x15, 0x0f);
c.writeReg(0x01, 0x08);
c.writeReg(0x05, 0x08);
c.writeReg(0x00, 0x30);
c.writeReg(0x04, 0x30);
c.writeReg(0x08, 0x80);
c.writeReg(0x0c, 0x30);
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
let raw = 0;
for (const chip of this.pool) raw += chip.c.calc();
const x = raw * OUT_GAIN;
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
return true;
}
}
registerProcessor('mmsxx-nes', NesBank);`;var _o={};oe(_o,{FDS_CLOCK:()=>vo,FDS_CODE:()=>Mo,FDS_LEN:()=>go,FDS_MOD_TABLES:()=>Mn,FDS_OUT_PEAK:()=>fa,FDS_PRESETS:()=>pa,fdsModGain:()=>xo,fdsPitch:()=>wo,fdsWave:()=>da,registerFDSPresets:()=>bo});var vo=1789773,go=64,fa=2.4*(95.88/(8128/15+100))*1.876;function wo(s){return s>0?Math.max(1,Math.min(4095,Math.round(s*16*64*4096/vo))):0}var da=s=>Array.from(s,e=>Math.round((Math.max(-1,Math.min(1,e))+1)/2*63)),Ze=s=>da(Array.from({length:go},(e,t)=>s(t/go))),Mn={tri:[...Array(8).fill(2),...Array(16).fill(6),...Array(8).fill(2)],step:[4,3,3,3,3,...Array(11).fill(0),4,5,5,5,5,...Array(11).fill(0)]},Fl=16,xo=s=>Math.max(0,Math.min(63,Math.round(s*1024/Fl))),aa=Ze(s=>Math.round(Math.sin(2*Math.PI*s)*8)/8),Dl=Ze(s=>s<.12?Math.sin(Math.PI*s/.12):-.18),ca=Ze(s=>{let e=Math.sin(2*Math.PI*s);return(e>0?e:0)*2-.6}),la=Ze(s=>Math.round((1-2*s)*6)/6),ua=Ze(s=>s<.35?Math.sin(Math.PI*s/.35):-.7*Math.sin(Math.PI*(s-.35)/.65)),ha=Ze(s=>Math.sin(2*Math.PI*s)*.5+Math.sin(4*Math.PI*s)*.5),Bl=Ze(s=>(Math.sin(2*Math.PI*s)+.12*Math.sin(4*Math.PI*s)+.28*Math.sin(6*Math.PI*s)+.16*Math.sin(10*Math.PI*s)+.09*Math.sin(14*Math.PI*s))/1.65),pa=[["fdsStep",{wave:aa},"lead",'Stepped wavetable on the disk system chip: the shape that reads as "wavetable chip" more than any other.'],["fdsSpike",{wave:Dl},"lead","Narrow spike in the disk system wavetable: bright and thin."],["fdsHalf",{wave:ca},"bass","Half-wave rectified shape on the disk system chip: fat and round."],["fdsRamp",{wave:la},"lead","Stepped ramp on the disk system chip. Buzzy, close to a saw."],["fdsOdd",{wave:ua},"lead","Lopsided shape on the disk system chip. Reads as reedy."],["fdsTwin",{wave:ha},"lead","Two humps per cycle on the disk system chip, so it sounds an octave brighter than it is."],["fdsVibe",{wave:ca,mod:{ratio:.035,depth:.03,table:"tri"}},"lead","The disk system modulator run slowly, used as vibrato rather than as timbre."],["fdsBell",{wave:aa,mod:{ratio:1,depth:.6,table:"tri"}},"counter","The disk system modulator at the note’s own rate and deep: sidebands grow and it turns metallic."],["fdsMetal",{wave:ha,mod:{ratio:2.51,depth:.9,table:"step"}},"perc","An awkward modulator ratio with a stepped table, deep enough that the pitch turns into a clang."],["fdsWobble",{wave:ua,mod:{ratio:.25,depth:.35,table:"step"}},"counter","The modulator at a quarter of the note’s rate, deep: the pitch audibly swings."],["fdsGrowl",{wave:la,mod:{ratio:.5,depth:.7,table:"step"}},"bass","The modulator at half the note’s rate, deep enough to roughen the tone into a growl."],["fdsLikeZld",{wave:Bl,mod:{ratio:.015,depth:.025,table:"tri"}},"lead","A hollow, slightly asymmetric wavetable with a shallow vibrato: the overworld-lead sound of the disk system, drawn rather than lifted.",["homage"]]];function bo(){for(let[s,e,t,n,o]of pa)try{Ms(s,e,{role:t,desc:n,tags:["nes",...o||[]]})}catch{}}var Mo=`const CLK = ${vo};
const OUT_PEAK = ${fa};
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
let temp = this.counter * this.modGain;
if ((temp & 0x0f) && !(temp & 0x800)) temp += 0x20;
temp += 0x400;
temp = (temp >> 4) & 0xff;
const wp = (this.pitch * temp) & 0xfffff;
const before = this.waveAcc >>> 18;
this.waveAcc = (this.waveAcc + wp) % 0x1000000;
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
this.port.onmessage = (e) => {
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
if (chip.wave !== ev.wkey) {
c.writeReg(0x29, 0x80);
for (let i = 0; i < 64; i++) c.writeReg(0x40 + i, ev.wave[i]);
c.writeReg(0x29, 0x00);
chip.wave = ev.wkey;
}
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
return true;
}
}
registerProcessor('mmsxx-fds', FdsBank);`;var Ao={};oe(Ao,{SCC_CLOCK:()=>yo,SCC_CODE:()=>To,SCC_OUT_GAIN:()=>ma,SCC_PRESETS:()=>va,registerSCCPresets:()=>So,sccPeriod:()=>ko,sccWave:()=>ga});var yo=3579545,ma=.1404;function ko(s){return s>0?Math.max(9,Math.min(4095,Math.round(yo/(32*s)-1))):4095}var ga=s=>Array.from(s,e=>Math.max(-128,Math.min(127,Math.round(e*127)))),va=[["sccSquare",Array.from({length:32},(s,e)=>e<16?1:-1),"lead","A 50% square on the SCC chip itself. The basic shape for porting a pulse part from another chip."],["sccTriangle",Array.from({length:32},(s,e)=>e<16?-1+e/7.5:1-(e-16)/7.5),"bass","A triangle on the SCC chip. The basic shape for porting a bass from another chip."],["sccSaw",vt,"lead","A sawtooth on the SCC chip. Bright and buzzy."],["sccSine",Ie,"chord","A sine on the SCC chip: thirty-two eight-bit samples, so the steps all but disappear."]];function So(){for(let[s,e,t,n]of va)try{_s(s,{wave:ga(e)},{role:t,desc:n,tags:["msx"]})}catch{}}var To=`const CLK = ${yo};
const OUT_GAIN = ${ma};
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
this.port.onmessage = (e) => {
if (e.data && e.data.cut) { this.cut(); return; }
const add = e.data && e.data.add;
if (!add || !add.length) return;
this.cutAt = -1;
for (let i = 0; i < add.length; i++) this.events.push(add[i]);
};
}
grow() {
const c = new SCC(sampleRate);
const chip = { c, log: null, v: [0, 1, 2, 3, 4].map(() => ({ end: 0, vs: null, ps: null })),
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
v.end = 0; v.vs = null; v.ps = null;
if (chip.c.reg[0xaa + s] !== 0) chip.c.writeReg(0xaa + s, 0);
const on = chip.c.reg[0xaf] & ~(1 << s);
if (chip.c.reg[0xaf] !== on) chip.c.writeReg(0xaf, on);
}
pick(wkey, now) {
for (const chip of this.pool) {
for (let s = 0; s < 5; s++) if (chip.wave[s] === wkey && chip.v[s].end <= now) return { chip, s };
for (let s = 0; s < 5; s++) if (chip.v[s].end <= now) return { chip, s };
}
return { chip: this.grow(), s: 0 };
}
start(ev, now) {
const { chip, s } = this.pick(ev.wkey, now);
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
v.vs = ev.vs && ev.vs.length ? { list: ev.vs, at: 0 } : null;
v.ps = ev.ps && ev.ps.length ? { list: ev.ps, at: 0 } : null;
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
registerProcessor('mmsxx-scc', SccBank);`;var Oo={};oe(Oo,{PCE_CLOCK:()=>_n,PCE_CODE:()=>Lo,PCE_OUT_GAIN:()=>wa,PCE_PRESETS:()=>ba,pceNoise:()=>$o,pcePeriod:()=>Co,pceWave:()=>xa,registerPCEPresets:()=>Eo});var _n=3579545,wa=.1393;function Co(s){return s>0?Math.max(1,Math.min(4095,Math.round(_n/(32*s)))):4095}function $o(s){return s>0?31-Math.max(1,Math.min(31,Math.round(_n/(64*s*16)))):0}var xa=s=>Array.from(s,e=>Math.max(0,Math.min(31,Math.round((e+1)/2*31)))),ba=[["pceSquare",Array.from({length:32},(s,e)=>e<16?1:-1),"lead","A 50% square on the PC Engine chip itself. The basic shape for porting a pulse part from another chip."],["pceTriangle",Array.from({length:32},(s,e)=>e<16?-1+e/7.5:1-(e-16)/7.5),"bass","A triangle on the PC Engine chip. Five bits leave a visible staircase; the basic shape for porting a bass."],["pceSaw",vt,"lead","A sawtooth on the PC Engine chip. The five-bit steps make it buzz."],["pceSine",Ie,"chord","A sine on the PC Engine chip: thirty-two five-bit samples, so the staircase is audible."]];function Eo(){for(let[s,e,t,n]of ba)try{hn(s,{wave:xa(e)},{role:t,desc:n,tags:["pce"]})}catch{}try{hn("pceNoise",{noise:!0},{role:"noise",tags:["pce"],desc:null})}catch{}}var Lo=`const CLK = ${_n};
const OUT_GAIN = ${wa};
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
if ((v & 0xc0) === 0x40) c.wpos = 0;
c.ctrl = v;
break;
}
case 5: c.bal = v; break;
case 6:
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
const nf = 31 - Math.min(30, c.noise & 31);
const per = 64 * nf;
while (left >= c.ncount) {
sum += (c.nbit ? 31 : 0) * c.ncount;
left -= c.ncount;
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
registerProcessor('mmsxx-pce', PceBank);`;var Po={};oe(Po,{DUTY_CODE:()=>Ro,clampDuty:()=>No});var Ro=`const FRAME = ${W};
const poly = (t, dt) => {
if (t < dt) { const x = t / dt; return x + x - x * x - 1; }
if (t > 1 - dt) { const x = (t - 1) / dt; return x * x + x + x + 1; }
return 0;
};
class DutyBank extends AudioWorkletProcessor {
constructor(o) {
super();
const q = o.processorOptions || {};
this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
this.at = 0;
this.max = q.voices || 16;
this.voices = [];
this.cutAt = -1;
this.port.onmessage = (e) => {
if (e.data && e.data.cut) {
this.events.length = 0;
this.at = 0;
this.voices.length = 0;
if (this.cutAt < 0) this.cutAt = 0;
return;
}
const add = e.data && e.data.add;
if (!add || !add.length) return;
this.cutAt = -1;
for (let i = 0; i < add.length; i++) this.events.push(add[i]);
};
}
start(ev) {
if (this.voices.length >= this.max) this.voices.shift();   // いちばん古いのを譲る
this.voices.push({
fr: ev.fr, du: ev.du, gv: ev.gv || null, env: ev.env || null,
fv: ev.fv || null,
t0: ev.t, len: ev.dur, vol: ev.vol,
last: ev.gv ? (ev.gv.length - 1) * FRAME : 0,
ph: 0, done: false,
});
}
render(v, t, sr) {
const x = t - v.t0;
if (x >= v.len) { v.done = true; return 0; }
let i = Math.floor(x / FRAME);
if (i < 0) i = 0;
const end = v.fr.length - 1;
if (i > end) i = end;
const f = v.fr[i];
const d = v.du[i];
const dt = f / sr;             // 1 サンプルで何回転ぶん進むか
const ph = v.ph;
let s = ph < d ? 1 : -1;
s += poly(ph, dt);
let q = ph + 1 - d;
if (q >= 1) q -= 1;
s -= poly(q, dt);
s -= 2 * d - 1;
let nph = ph + dt;
if (nph >= 1) nph -= 1;
v.ph = nph;
let g;
if (v.gv) {
g = v.gv[i];
if (x > v.last) g *= (v.len - x) / Math.max(1e-6, v.len - v.last);
} else {
const e = v.env;
if (!e) g = 1;
else if (x < e.a) g = e.a > 0 ? x / e.a : 1;
else if (x < e.a + e.d) g = 1 + (e.s - 1) * (x - e.a) / e.d;
else if (x < e.hold) g = e.d > 0 ? e.s : 1;
else {
const top = e.d > 0 ? e.s : 1;
g = top * (v.len - x) / Math.max(1e-6, v.len - e.hold);
}
if (g < 0) g = 0;
}
if (v.fv) g *= v.fv[Math.min(i, v.fv.length - 1)];
return s * g * v.vol;
}
process(inputs, outputs) {
const out = outputs[0][0];
const base = currentTime;
const sr = sampleRate;
const vs = this.voices;
let dead = false;
for (let i = 0; i < out.length; i++) {
const t = base + i / sr;
while (this.at < this.events.length && this.events[this.at].t <= t) {
this.start(this.events[this.at++]);
}
let s = 0;
for (let k = 0; k < vs.length; k++) {
const v = vs[k];
s += this.render(v, t, sr);
if (v.done) dead = true;
}
if (this.cutAt >= 0) {
const len = Math.max(1, Math.round(sr * 0.01));
s *= Math.max(0, 1 - this.cutAt / len);
this.cutAt++;
if (this.cutAt > len) { this.cutAt = len; s = 0; }
}
out[i] = s;
}
if (dead) this.voices = vs.filter((v) => !v.done);
return true;
}
}
registerProcessor('mmsxx-duty', DutyBank);`,No=s=>{let e=Number(s);return Number.isFinite(e)?Math.min(.98,Math.max(.02,e)):.5};var jo={};oe(jo,{SE_SYS_PAUSE:()=>bt,SYSTEM_SE:()=>Vo,bassDemo:()=>Ca,beatTune:()=>gu,chordDemo:()=>$a,demoFor:()=>Ql,drumDemo:()=>ka,drumKitDemo:()=>Xl,scaleDemo:()=>Il,seDemo:()=>Aa,tapeDemo:()=>Ta,toneDemo:()=>Ea});var bt="sys.pause",Vo={[bt]:["@{pulse(50)} @e{piano} @s{8,6} q6 t200 v12 o5 l16 e4.","@{pulse(50)} @e{piano} @s{8,6} q6 t200 v10 o5 l16 r g4.","@{pulse(50)} @e{piano} @s{8,7} q6 t200 v8  o5 l16 r r > c4."]},Vl=s=>`@{${s}} o4 c8. d16 e8 f8 g4 a8 b8 > c4. < b8 a8 g8 f8 e8 d4 c4 r4 `;function Il(s){return["t150 q7 v12 l8 "+s.filter(t=>Sa(t)!=="perc").map(Vl).join("")]}var jl=["c4 r4 c8 c16 c16 r4","c4 r4 c8 c16 c16 r4","c4 r4 c8 c16 c16 r4","c4 r4 c8 c8 c8 c8"],Gl=["r4 c8 r8 r4 c8 r8","r4 c8 r8 r4 c8 r8","r4 c8 r8 r4 c8 r8","r4 c8 r8 r2"],zl=["r4 c4 r4 c4","r4 c4 r4 c4","r4 c4 r4 c4","r4 c4 r8 c16 c16 c16 c16 c16 c16"],ql=["r8 c8 r8 c8 r8 c8 r8 c8","r8 c8 r8 c8 r8 c8 r8 c8","r8 c8 r8 c8 r8 c8 r8 c8","r8 c8 r8 c8 r8 c8 c16 c16 c8"],Wl=["c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16","c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16","c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16","c8 c16 c16 c8 c16 c16 c4 r4"];function ka(s){let e=n=>n.join(" ")+" "+n.join(" "),t=n=>`t150 q8 v${n} l16 @{${s}} @e{percussive}`;return[`${t(13)} o2 `+e(jl),`${t(12)} o3 `+e(Gl),`${t(11)} o4 `+e(zl),`${t(9)} o5 `+e(ql),`${t(7)} o6 `+e(Wl)]}var Jl=["r1","c4 r4 c8 c16 c16 r4","c4 r4 c8 c16 c16 r4","c8 c16 c16 r4 c8 r8 c8 r8","c4 r4 c8 c16 c16 r4","c8 c16 c16 r4 c8 r8 c8 r8","c4 r4 c8 c16 c16 r4","c4 r4 r2","c8 c16 c16 r4 c8 r8 c8 r8","c8 c16 c16 r4 c8 r8 c8 r8","c8 c16 c16 r4 c8 r8 c8 r8","c4 r4 c8 c8 c4","c4 r4 c4 r4","c4 r4 c4 r4","c8 c8 c8 c8 c8 c8 c8 c8","c4 r4 r2"],Kl=["r1","r1","r4 c4 r4 c4","r4 c4 r4 c4","r4 c4 r4 c4","r4 c4 r8 c8 c8 c8","r4 c4 r4 c4","c16 c16 c16 c16 c8 c8 c16 c16 c16 c16 c8 c8","r4 c4 r4 c4","r4 c4 r8 c8 c8 c8","r4 c4 r4 c4","r4 c4 r8 c8 c8 c8","r1","r1","c16 c16 c16 c16 c8 c8 c16 c16 c16 c16 c8 c8","c4 r4 r2"],Ul=["r1","r1","r1","r1","r1","r1","r1","r2 o4 c8 c8 o3 c8 c8","r1","r1","r1","o4 c8 c8 c8 c8 o3 c8 c8 c8 c8","o4 c8 c16 c16 o3 c8 c16 c16 o4 c8 o3 c8 c4","o4 c8 c16 c16 o3 c8 c16 c16 o4 c4 o3 c4","o4 c8 c8 c8 c8 o3 c8 c8 c8 c8","r1"],Hl=["c8 c8 c8 c8 c8 c8 c8 c8","r8 c16 r16 r4 r8 c16 r16 r4","r8 c16 r16 r4 r8 c16 r16 r4","r8 c16 r16 r4 r8 c16 r16 r4","r8 c16 r16 r4 r8 c16 r16 r4","r8 c16 r16 r4 r8 c16 r16 r4","r8 c16 r16 r4 r8 c16 r16 r4","r1","r8 c16 r16 r4 r8 c16 r16 r4","r8 c16 r16 r4 r8 c16 r16 r4","r8 c16 r16 r4 r8 c16 r16 r4","r1","r1","r1","r1","r1"],Yl=["o5 c4 r4 r2 o6","c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16","c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16","c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16","c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16","c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16","c8 c16 c16 c8 c16 c16 c8 c16 c16 c8 c16 c16","r1","o5 c4 o6 r4 c8 c16 c16 c8 c16 c16","c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16","c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16","c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16","r1","r1","c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16 c16","o5 c4 r4 r2 o6"];function Xl(){let s="t150 q8 l16";return[`${s} v13 @{opll::kick} @e{percussive} o4 `+Jl.join(" "),`${s} v11 @{opll::snare} @e{percussive} o4 `+Kl.join(" "),`${s} v11 @{opll::tom} @e{percussive} o4 `+Ul.join(" "),`${s} v8 @{opll::hat} @e{percussive} o5 `+Hl.join(" "),`${s} v6 @{opll::cymbal} @e{percussive} o6 `+Yl.join(" ")]}var Io=s=>T.find(e=>String(e.name).toLowerCase()===String(s).toLowerCase());function Sa(s){let e=Io(s);return e&&e.role?e.role:Gs(s)?"perc":"lead"}function Zl(s){let e=(Io(s)||{}).tone;return!!(e&&(e.arp||e.pitch||e.vol||e.duty||e.vib))}function Ql(s){let e=Sa(s);if(e==="se"&&((Io(s)||{}).special||[]).includes("tape"))return Ta(s);if(e==="se")return Aa(s);if(e==="perc"||e==="noise")return ka(s);let t=e==="bass"?Ca(s):e==="chord"?$a(s):Ea(s);return Zl(s)?eu(s,t):t}function Ta(s){return[`t120 q8 v10 @e{flat} @{${s}}{ @baud 1200 @seed 1 =3 @bytes ff ?1 @bytes random ?4 r2 =1 @bytes 00 ?1 @bytes random ?6 @bytes 55 ?2 @bytes random ?4 @bytes ff ?1 @bytes random ?6 @bytes aa ?1 }`]}function Aa(s){return[`t120 q8 v13 @{${s}} @e{flat} o4 c2 r2  o5 c2 r2  o3 c2 r2  o4 c4 r4 o5 c4 r4  o4 c1`]}function eu(s,e){let t=`t138 q8 v12 @{${s}} @e{flat} o4 c1 c1 `,n="t138 q8 r1 r1 ";return e.map((o,i)=>(i===0?t:n)+o)}function Ca(s){return[`t150 q7 v12 l8 @{${s}} @e{flat} `+La,`t150 q8 v8 @{${s}} @e{soft} `+Oa]}function $a(s){let e=t=>`t120 q7 v${t} @{${s}} @e{soft} `;return[e(11)+"o3 c1 o3 a1 o3 f1 o3 g1 l4 o3 c c c c o3 a a a a o3 f f f f o3 g g g g ",e(9)+"o3 e1 o4 c1 o3 a1 o3 b1 l4 o3 e e e e o4 c c c c o3 a a a a o3 b b b b ",e(8)+"o3 g1 o4 e1 o4 c1 o4 d1 l4 o3 g g g g o4 e e e e o4 c c c c o4 d d d d "]}function Ea(s){let e="q8 l1 ";return[`t138 q7 v12 l8 @{${s}} @e{soft} o4 c8. d16 e8 f8 g4 a8 b8  > c4. < b8 a8 g8 f8 e8 d4 c4 o4 e8. f16 g8 a8 > c4 < b8 a8  g4. e8 g8 a8 g8 e8 d2 `+e+"o4 c&c ",`t138 q6 v10 l8 @{${s}} @e{flat} o2 c4 g4 c4 g4  c4 g4 c4 g4 o2 a4 e4 f4 c4  g4 > d4 < g4 g4 o2 c4 g4 c2 `+e+"o2 c&c ",`t138 q7 v8 l8 @{${s}} @e{soft} r1 r1 r2 o3 c8. d16 e8 f8 a4 g8 f8  e4. c8 e8 f8 e8 c8 b2 `+e+"o3 e&e "]}var et=(s,e=2)=>{let t=[];for(let n=0;n<s.length;n+=e)t.push(s.slice(n,n+e).join(" "));return t.join(`
`)},tu=["#bundle beatBass1  = @{waveRamp} @e{piano} @s{8,2}","#bundle beatBass2  = @{triangle} @e{flat}","#bundle beatKick   = @{opll::kick} @e{percussive} @o+2,   @{noise} v11 @e{snap}","#bundle beatSnare  = @{opll::snare} @e{percussive},  @{noise} v8 @o+1 @e{snap}","#bundle beatHat    = @{opll::cymbal} @e{percussive}","#bundle beatHatAir = @{opll::cymbal} @e{percussive}, @{noise} v3 @e{percussive}","#bundle beatTom    = @{opll::tom} @e{percussive}","#bundle beatPulse  = @{pulse(12)} @e{percussive}","#bundle beatBrass  = @{opll::trumpet} @e{soft}","#bundle beatHorn   = @{opll::horn} @e{soft}"].join(`
`),La=et(["o2 d a o3 d o2 a f a d o3 c","o2 d a o3 d o2 a f a d o3 c","o2 b- f o3 b- o2 f d f b- a","o2 c g o3 c o2 g e g c b-","o2 d a o3 d o2 a f a d o3 c","o2 d a o3 d o2 a f a d o3 c","o2 g d g d b- d g f","o2 a e a e o3 c o2 e a g"]),Oa=et(["o2 d1","o2 d1","o2 b-1","o2 c1","o2 d1","o2 d1","o2 g1","o2 a1"],4),xt="c8 r8 r8 c16 r16 c8 r8 r4",Ma="c8 r8 c16 r16 r8 c8 r8 c8 r8",nu=et([xt,xt,xt,Ma,xt,xt,xt,Ma]),Qe="r4 c8 r8 r4 c8 r8",su="r4 c8 r8 r4 c16 c16 c16 c16",ou=et([Qe,Qe,Qe,Qe,Qe,Qe,Qe,su]),iu=["$h = { @{beatHat} c8 }","$a = { @{beatHatAir} c8 }"].join(`
`),ru="$h $a $h $h $h $a $h $a",au=et(new Array(8).fill(ru)),_a="r2 c16 c16 o3 c16 c16 o4 c8 o3 c8",cu=et(["r1","r1","r1",_a,"r1","r1","r1",_a]),lu="$p = { [r16 c16]8 }",uu="[$p]8",Fo="r1",ya="r2 r4 r8 %16 %16",hu="r2 r4 %4",fu="r2 %4 %4",du="%4 r4 r2",pu=(s,e)=>s.split("%").join(e),mu=[Fo,ya,Fo,hu,Fo,ya,fu,du],Do=[["o4 a","o4 a","o4 f","o4 g","o4 a","o4 a","o5 d","o5 e"],["o4 f","o4 f","o4 d","o4 e","o4 f","o4 f","o4 b-","o5 c+"],["o4 d","o4 d","o3 b-","o4 c","o4 d","o4 d","o4 g","o4 a"]],Bo=s=>et(mu.map((e,t)=>pu(e,s[t])));function gu(){let s="t152";return[tu+`
#name ベース1
${s} q7 v13 l8 @{beatBass1} [`+La+"]2",`#name ベース2
${s} q8 v10 l1 @{beatBass2} [`+Oa+"]2",`#name バスドラ
${s} q8 v13 l16 @{beatKick} o2 [`+nu+"]2",`#name スネア
${s} q8 v11 l16 @{beatSnare} o4 [`+ou+"]2",iu+`
#name ハイハット
${s} q8 v6 l16 o6 [`+au+"]2",`#name タム
${s} q8 v10 l16 @{beatTom} o4 [`+cu+"]2",lu+`
#name パルス
${s} q8 v4 l16 @{beatPulse} o6 [`+uu+"]2",`#name ブラス上
${s} q8 v7 l16 @{beatBrass} [`+Bo(Do[0])+"]2",`#name ブラス中
${s} q8 v6 l16 @{beatBrass} [`+Bo(Do[1])+"]2",`#name ブラス下
${s} q8 v6 l16 @{beatHorn} [`+Bo(Do[2])+"]2"]}var Ho={};oe(Ho,{SE_FRAME:()=>zo,SE_TEMPO:()=>Wo,SE_WHOLE:()=>qo,parseSEBase:()=>Ko,parseSENotes:()=>Jo,sliceSE:()=>Uo});var zo=1/60,qo=64,Wo=Math.round(240/(qo*zo)),Go={c:0,d:2,e:4,f:5,g:7,a:9,b:11};function Jo(s,e=0){let t=String(s||"").toLowerCase(),n=[],o=4;for(let i=0;i<t.length;){let r=t[i];if(` 	
\r|,`.includes(r)){i++;continue}if(r===">"){o++,i++;continue}if(r==="<"){o--,i++;continue}if(r==="o"){i++;let f="";for(;i<t.length&&t[i]>="0"&&t[i]<="9";)f+=t[i++];f!==""&&(o=parseInt(f,10));continue}let l=r==="r";if(!l&&Go[r]===void 0){console.warn(`[ChpTnSnd] SE: 音名として読めない字 "${r}" は読み飛ばします (${s})`),i++;continue}i++;let c=l?0:Go[r]+(o-4)*12-e;for(;i<t.length&&"+#-".includes(t[i]);)c+=t[i++]==="-"?-1:1;let h="";for(;i<t.length&&t[i]>="0"&&t[i]<="9";)h+=t[i++];let a=h===""?1:Math.max(1,parseInt(h,10)),d=qo/a,u=d;for(;t[i]===".";)i++,u/=2,d+=u;n.push({semi:c,sec:d*zo,rest:l})}return n}function Ko(s){let e=s===!0?"c1":String(s||"c1").toLowerCase().trim(),t=/^([a-g])([+#-]*)(\d*)/.exec(e);if(!t)return console.warn(`[ChpTnSnd] SE: 本体の高さ "${s}" が読めないので c1 とみなします`),{semi:0,len:1};let n=Go[t[1]];for(let o of t[2])n+=o==="-"?-1:1;return{semi:n,len:t[3]===""?1:parseInt(t[3],10)}}var vu=(s,e)=>Math.max(0,Math.min(15,Math.round(s*e)));function Uo(s,e,t){let n=t==null?null:Math.max(0,Math.min(15,t))/15;return s.map(o=>{let i=[],r=0;for(let l of e){if(!l.rest){let c=Math.pow(2,l.semi/12);for(let h of o.events){if(h.t>=l.sec-1e-9)break;let a=l.sec-h.t;i.push({...h,t:r+h.t,dur:Math.min(h.dur,a),gate:Math.min(h.gate,a),freq:h.freq*c,vol:n==null?h.vol:vu(h.vol,n)})}}r+=l.sec}return{events:i,total:r,noise:i.some(l=>(T[l.wave]||{}).kind==="noise"),ch:o.ch}})}var Xo={};oe(Xo,{LAYER_PRESETS:()=>Da,layerPairFamily:()=>Fa,registerDefaultLayers:()=>Yo});var Ra=[{key:"",value:"none",c:0,en:"no detune"},{key:"Soft",value:"soft",c:8,alone:"8 セントずらして重ねたもの",lead:"8 セントずらしたうえで",tail:"うねりがゆっくりで、厚みだけが付く",en:"eight cents apart, slow enough that the beating reads as body and nothing else"},{key:"Wide",value:"wide",c:20,alone:"20 セントずらして重ねたもの",lead:"20 セントずらしたうえで",tail:"うねりが聞き取れて、2 本鳴っていると分かる",en:"twenty cents apart, close enough to hear the beating and tell there are two of them"}],Na=[{key:"",value:"none",f:0,en:"no delayed copy"},{key:"Near",value:"near",f:7,alone:"7 フレーム(0.12 秒)遅らせて小さく重ねたもの",mid:"7 フレーム(0.12 秒)遅らせたもの",tail:"声が 1 本しかないところに置くと、それだけで広く聞こえる",en:"a quieter copy seven frames (0.12s) behind — on a part with nobody beside it, this alone opens up the space"},{key:"Far",value:"far",f:12,alone:"12 フレーム(0.2 秒)遅らせて小さく重ねたもの",mid:"12 フレーム(0.2 秒)遅らせたもの",tail:"はっきり返りとして聞こえるので、速い刻みでは前の音と当たる",en:"a quieter copy twelve frames (0.2s) behind — clearly a return, so in fast passages it collides with the note before"}],Pa=[{key:"50",wave:"pulse(50)",ja:"矩形波",en:"squares"},{key:"25",wave:"pulse(25)",ja:"幅 25% の矩形波",en:"quarter-width pulses"},{key:"12",wave:"pulse(12)",ja:"幅 12.5% の矩形波",en:"eighth-width pulses"}];function wu(){let s={};for(let e of Pa)for(let t of[...Ra].reverse())for(let n of[...Na].reverse()){if(!t.c&&!n.f)continue;let o=`layerPair(${e.key}, ${t.c?t.value:"detune: none"}, ${n.f?n.value:"echo: none"})`,i=t.c&&n.f,r=i?"@d と @s":t.c?"@d":"@s";s[o]={layers:[{wave:e.wave},{wave:e.wave,gain:n.f?.3:.6,cents:t.c,delay:n.f}],role:"lead",tags:["psg","layer"].concat(t.c?["detune"]:[]).concat(n.f?["echo"]:[]),descJa:e.ja+"を "+(i?`${t.lead}、${n.mid}。${t.tail}。${n.tail}`:`${t.alone||n.alone}。${t.tail||n.tail}`)+`。エフェクトの ${r} と同じことを、枠を食う側でやる`,desc:null+e.en+", "+(i?t.en+", and "+n.en:t.en||n.en)+". The same thing "+(i?"@d and @s do together":t.c?"@d does":"@s does")+", on the side that costs voices."}}return s}function Fa(){return{desc:null,params:[{name:"width",default:"50",desc:null,values:Pa.map(s=>({value:s.key,desc:null}))},{name:"detune",default:"wide",desc:null,values:[...Ra].reverse().map(s=>({value:s.value,desc:s.en}))},{name:"echo",default:"far",desc:null,values:[...Na].reverse().map(s=>({value:s.value,desc:s.en}))}],forbid:[{detune:"none",echo:"none"}]}}var Da={layerKickAir:{layers:[{wave:"opll::kick"},{wave:"noise",gain:.34,semi:24,follow:!1,env:"snap"}],role:"perc",tags:["drum","kick","layer"],descJa:null,desc:null},layerBrassBite:{layers:[{wave:"opll::trumpet"},{wave:"pulse(50)",gain:.6,semi:12,follow:!1,env:"tap"}],role:"lead",tags:["brass","attack","layer"],descJa:null,desc:null}};function Yo(){pe("layerPair",Fa());let s=t=>Z(t)>=0,e={...Da,...wu()};for(let[t,n]of Object.entries(e))s(t)||(n.layers||[]).some(o=>!s(o.wave))||fn(t,n)}var Zo={};oe(Zo,{SOUND_VERSION:()=>yn});var yn="0.41.0";var ni={};oe(ni,{DYNPCM_DEFAULT_RATE:()=>Qo,DYNPCM_RATE_MAX:()=>ti,DYNPCM_RATE_MIN:()=>ei,registerDynPCM:()=>Ba});var Qo=44100,ei=3e3,ti=48e3;function Ba(s,e={},t={}){if(!e.from&&!e.phrase)throw new Error("[ChpTnSnd] "+s+": 焼く元の音色(from)か、フレーズ(phrase)がありません");if(e.from&&e.phrase)throw new Error("[ChpTnSnd] "+s+": from と phrase はどちらか 1 つだけ書きます");let n=e.rate??Qo,o=Math.round(Math.max(ei,Math.min(ti,Number(n)||Qo)));o!==n&&G(`[ChpTnSnd] ${s}: @dynpcm の細かさは ${ei}〜${ti}Hz です(${n} → ${o})`);let i=e.length>0?Number(e.length):1,l=`Baked from ${e.phrase?"a phrase":e.from} into clean PCM at ${o}Hz, so a stacked sound plays as one and costs one voice. o4c plays it at the baked speed; other notes change the speed.`+(e.desc?" "+e.desc:null),c=ys(s,{...e,desc:l,octaves:[4],step:12,sampleRate:o,loop:!1,length:i,...e.phrase?{phrase:e.phrase,tempo:e.tempo}:{}},t);return T[c].defaultEnv=0,c}As("dynpcm",(s,e,t)=>Ba(s,eo(s,e,"dynpcm"),t));Is();zs();Js();oo();fo();bo();So();Eo();Ys();ds();Jn();Yo();ps();var ci=.14,xu=(()=>{let s=new Float32Array(1024);for(let e=0;e<1024;e++)s[e]=e<512?-1:1;return s})(),Va=new Set;function bu(s,e){Va.has(s)||(Va.add(s),console.warn(`[ChpTnSnd] ${s} は古い呼び方です。${e}(いまは動きますが、いずれ無くなります)`))}function si(s,e){for(let t of e.errors){let n=t.ch===null?"":`${t.ch+1} 本目: `;console.warn(`[ChpTnSnd] ${s}: ${n}${t.text}`)}return e}function Mu(s){let e=[],t=[],n=0,o=s.map((i,r)=>{n=Math.max(n,i.total||0);for(let l of i.problems||[])(l.level==="error"?e:t).push({ch:r,text:l.text});return i.events.length||t.push({ch:r,text:"音符がありません"}),{ch:r,meta:i.meta??{},name:i.name??null,role:i.role??null,events:i.events.length,total:i.total,loop:i.loop,marks:i.marks,takes:i.takes??[]}});return s.length||e.push({ch:null,text:"鳴らすものがありません"}),{ok:!e.length,errors:e,warnings:t,channels:o,total:n}}function oi(s){let e=s>>>0||1;return()=>(e^=e<<13,e>>>=0,e^=e>>>17,e^=e<<5,e>>>=0,e/4294967296)}var Ia=3579545/2;function li(s){let e=T[s]||T[2];return e.kind==="layer"?null:(e.special||[]).includes("exact")?0:e.snapDiv>0?e.snapDiv:["fm","noise","baked","beep"].includes(e.kind)?0:qe.has(e.kind)?_u(e):e.kind==="ay"&&e.mode==="noise"?0:e.kind==="nes"?e.mode==="noise"?0:e.mode==="triangle"?32:16:e.kind==="fds"?0:e.kind==="pce"?e.noise?0:16:e.kind==="triangle"?32:16}function kn(s,e){if(!(s>0))return s;let t=li(e);if(!t)return s;let n=(T[e]||{}).snapDiv>0?65535:4095,o=Math.max(1,Math.min(n,Math.round(Ia/(t*s))));return Ia/(t*o)}var tt={ay:{node:"mmsxx-ay",code:io},nes:{node:"mmsxx-nes",code:po},fds:{node:"mmsxx-fds",code:Mo},scc:{node:"mmsxx-scc",code:To},pce:{node:"mmsxx-pce",code:Lo},duty:{node:"mmsxx-duty",code:Ro},filter:{node:"mmsxx-filter",code:Hn},echo:{node:Et,code:es}},qe=new Map;function Ja(s,e){tt[s]={node:e.node,code:e.code,...e.voices?{voices:e.voices}:{},...e.buses?{buses:e.buses}:{},...e.options?{options:e.options}:{},...e.extra?{extra:e.extra}:{}},qe.set(s,{event:e.event,snap:e.snap??0,noTail:!!e.noTail})}function _u(s){let e=qe.get(s.kind).snap;return typeof e=="function"?e(s):e}function yu(s){return s?s.kind==="ay"?"ay":s.kind==="nes"?"nes":s.kind==="fds"?"fds":s.kind==="scc"?"scc":s.kind==="pce"?"pce":Fe(s.tone)?"duty":qe.has(s.kind)?s.kind:null:null}function je(s){let e=fe[s.env]||fe[0],t=s.tail&&!e.table?{...e,a:typeof e.a=="string"?.004:Math.min(e.a,.004),d:99,s:0}:e;return s.legato&&!t.table?{...t,a:0}:t}function ja(s,e){if(s.open||!(s.room>0))return 0;let t=T[s.wave];if(!t||(qe.get(t.kind)||{}).noTail||t.tone&&t.tone.vol)return 0;let n=i=>!i||i.table||!(i.s>0)?0:Oe(i.r,e),o=n(je(s));if(t.kind==="layer")for(let i of t.layers){let r=i.env!=null?i.env:(T[i.wave]||{}).defaultEnv;r!=null&&(o=Math.max(o,n(je({...s,env:r}))))}return Math.max(0,Math.min(o,s.room))}function Sn(s,e){let t=Math.min(Oe(s.a,e),e*.5),n=Math.min(Oe(s.d,e),Math.max(0,e-t)),o=Math.min(Oe(s.r,e),e*.5);return{a:t,d:n,s:s.s,rel:o,hold:Math.max(t+n,e-o)}}function ku(s,e){if(!s.table)return null;let t=Math.max(1,Math.ceil(e/W)),n=new Float32Array(t);for(let o=0;o<t;o++)n[o]=Tn(s,o);return n}function Tn(s,e){let t=s.table;if(e<t.length)return t[e];if(s.loop===null||s.loop===void 0)return t[t.length-1];let n=t.length-s.loop;return t[s.loop+(e-s.loop)%n]}function Ge(s,e){if(!(e>0)||!(s>0))return s;if(e===1)return 15;let t=15/(e-1);return Math.min(15,Math.max(t,Math.round(s/t)*t))}function Su(s,e){let t=je(s),n=Math.max(.01,s.gate),o=Mt(s,1,e)/ci;if(t.table)return Math.max(0,Math.min(1,Tn(t,Math.floor(e/W))*o));let i=Sn(t,n),r;return e<i.a?r=i.a>0?e/i.a:1:e<i.a+i.d?r=1-(1-i.s)*((e-i.a)/Math.max(1e-6,i.d)):e<i.hold?r=i.s:r=i.s*(1-(e-i.hold)/Math.max(1e-6,n-i.hold)),Math.max(0,Math.min(1,r*o))}function An(s,e){if(!(s.glide>0))return s.freq;let t=Math.max(.01,s.gate),n=Math.max(0,Math.min(1,e/t));return s.freq*Math.pow(s.glide/s.freq,n)}function Ee(s){return Mt({...s,fade:null,vol:Ka(s)},1)}function ze(s,e){let t=s.fade;if(!t||!t.length||e<=t[0][0])return s.vol;for(let n=1;n<t.length;n++)if(e<=t[n][0]){let[o,i]=t[n-1],[r,l]=t[n];return r>o?i+(l-i)*(e-o)/(r-o):l}return t[t.length-1][1]}function Ka(s){return s.fade?Math.max(s.vol,...s.fade.map(e=>e[1])):s.vol}function nt(s,e){let t=Ee(s);return t>0?Mt(s,1,e)/t:0}function Mt(s,e,t=0){let n=T[s.wave],o=n&&n.gain>0?n.gain:1,i=s.vsteps??(n?n.vsteps:0),r=s.vcurve??(n?n.vcurve:"curve"),l=Ge(ze(s,t)*Math.max(0,e),i);return un(l,r,i)*ci*o}function Tu(s){let e=new Set(["name","role","ch","group","groupSet","machine"]),t={};for(let n of s)for(let[o,i]of Object.entries(n.meta??{}))e.has(o)||t[o]!==void 0||(t[o]=i);return t}function Au(s){let e=[];for(let o of s)o.vol>0&&e.push([o.t,1],[o.t+Math.max(o.gate,.001),-1]);e.sort((o,i)=>o[0]-i[0]||o[1]-i[1]);let t=0,n=0;for(let[,o]of e)t+=o,t>n&&(n=t);return n}function Cu(s,e){let t=new Set;for(let o of s)o.lane&&t.add(o.lane);if(!t.size)return[];let n=[];for(let[o,i]of e??[])t.has(o)&&(n.push({name:o,label:i||o}),t.delete(o));for(let o of t)n.push({name:o,label:o});return n}function Ga(s,e){return Ua(mn(s.trim(),{mode:e}))}function Ua(s){let{events:e,total:t,loop:n,outro:o,meta:i={},marks:r,takes:l,bars:c,cues:h,texts:a,problems:d,filters:u,laneLabels:f}=s,v=e.some(y=>(T[y.wave]||{}).kind==="noise"),x=Ya(e,t);return Ha(x,n?n.to:1/0),{events:x,base:e,voices:Au(x),chords:e.some(y=>y.chord!==void 0),lanes:Cu(x,f),total:t,noise:v,loop:n,outro:o,marks:r,meta:i,takes:l,bars:c,filters:u??[],problems:d??[],cues:h??[],baseCues:h??[],texts:a??[],baseTexts:a??[],baseBars:c??[],name:i.name??i.ch??null,role:i.role??null,group:i.group??null,groupSet:i.groupSet??null,machine:i.machine??null}}function Ha(s,e){let t=0;for(let n=0;n<s.length;n++){let o=s[n];for(t<=n&&(t=n+1);t<s.length&&s[t].t<=o.t+1e-6;)t++;let i=t<s.length?s[t].t:1/0;o.t<e-1e-6&&(i=Math.min(i,e)),o.room=Math.max(0,i-(o.t+o.gate))}}function Ya(s,e){if(!s.some(c=>c.echo))return s;let t=[...s],n=s.filter(c=>c.gate>0).map(c=>[c.t,c.t+c.gate]),o=c=>{let h=Number.isFinite(e)?e:1/0;for(let[a]of n)a>c+1e-9&&a<h&&(h=a);return h},i=c=>{let h=c;for(let[a,d]of n)h>a-1e-9&&h<d-1e-9&&(h=Math.max(h,d));return h},r=[];for(let c of s){if(!c.echo||!(c.echo.delay>0)||!(c.vol>0))continue;let h=.12+c.echo.depth*.05,a=c.vol;for(let d=1;d<=32&&(a*=h,!(a<.7));d++){let u=c.t+c.echo.delay*d;if(u>=e-1e-9)break;let f=i(u),x=Math.min(u+c.gate,o(f),e)-f;if(x<=.01)continue;let y={...c,t:f,dur:x,gate:x,vol:Math.round(a),echo:null,tail:!0},M=y.vol/c.vol;c.fade&&(y.fade=c.fade.map(([C,$])=>[C-(f-c.t),$*M])),c.loopVol!==void 0&&(y.loopVol=c.loopVol*M,y.loopFade=c.loopFade&&c.loopFade.map(([C,$])=>[C-(f-c.t),$*M])),r.push(y)}}r.sort((c,h)=>c.t-h.t||h.vol-c.vol);let l=null;for(let c of r){if(l){if(c.t<l.t+1e-9)continue;c.t<l.t+l.gate-1e-9&&(l.gate=c.t-l.t,l.dur=l.gate)}t.push(c),l=c}return t.sort((c,h)=>c.t-h.t),t}function ii(s){for(let e of s.events)e.beep=!0;return s}function $u(s){return s.reduce((e,t)=>e+(t.noise?1:0),0)}function Eu(s){let{grid:e,bars:t}=Xa(s);return ai([...e,...t])}function ai(s){return[...new Set(s.map(e=>Math.round(e*1e6)/1e6))].sort((e,t)=>e-t)}function za(s){if(!Array.isArray(s))return 1;let e=s.map(n=>n&&n.meta&&n.meta.gain).find(n=>n!=null);if(e==null)return 1;let t=Number(e);return Number.isFinite(t)&&t>=0?Math.min(8,t):1}function ri(s){if(!Array.isArray(s))return null;let e=s.map(t=>t&&t.meta&&t.meta.fx).find(t=>Array.isArray(t)&&t.length);if(!e)return null;try{return Lt(e,de)}catch(t){return console.warn(`[ChpTnSnd] #fx を読めませんでした: ${t.message}`),null}}function qa(s){if(!Array.isArray(s))return 120;if(s.tempo>0)return s.tempo;let e=Number(s.map(t=>t&&t.meta&&t.meta.tempo).find(t=>t!=null));return e>0?e:120}function Xa(s){if(!s.length)return{grid:[],bars:[]};let e=Math.max(...s.map(c=>c.total),0),t=s.map(c=>c.loop).find(Boolean)||null,n=t?t.from:0,o=[],i=Number(s.map(c=>c.meta&&c.meta.switch).find(c=>c!=null)),r=Number(s.map(c=>c.meta&&c.meta.tempo).find(c=>c!=null))||120;if(Number.isFinite(i)&&i>0){let c=i*(240/r);for(let h=n;h<=e+1e-9;h+=c)o.push(h)}let l=s.flatMap(c=>c.bars||[]);return{grid:ai(o),bars:ai(l)}}function Lu(s){let e=s.picks||{},t=new Map;for(let n of s)for(let o of n.takes||[]){t.has(o.group)||t.set(o.group,{group:o.group,now:"",options:[],boxes:[],restart:!1,noWait:!1});let i=t.get(o.group);for(let r of o.options)i.options.includes(r.name)||i.options.push(r.name);i.boxes.push({ch:n.ch,at:o.at,dur:o.dur}),o.restart&&(i.restart=!0),o.now&&(i.noWait=!0),i.now||(i.now=e[o.group]??o.options[0].name)}return[...t.values()]}function Wa(s,e){let t=new Set,n=[];for(let l of s??[])for(let c of l.marks??[])t.has(c.name)||(t.add(c.name),n.push({name:c.name,t:c.t}));n.push({name:Ss,t:0});let o=n.filter(l=>!dt(l.name)),i=l=>dt(l.name)&&o.some(c=>Math.abs(c.t-l.t)<1e-6);return n.filter(l=>!i(l)&&!(e&&dt(l.name))).sort((l,c)=>l.t-c.t)}var Cn=class s{constructor(e,t={}){this.ctx=e||null,this.seVoices=[],this.maxVoices=t.maxVoices??8,this.bgmVoices=0,this._seSeq=0,this._sePausedAll=!1,this.bgmDefs=new Map,this.seDefs=new Map;for(let[n,o]of Object.entries(Vo))this.defineSE(n,o);this.bgmState=null,this.jingleState=null,this.noiseBuffer=null,this.maxNoise=t.maxNoise??1,this.psgTune=t.psgTune??!0,this.spatial=t.spatial??"mono",this.ignoreSongLoop=!!t.ignoreSongLoop,this.playOutro=t.playOutro!==!1,this.loopTimes=2,this._loopTimesFromSong=2,this._songGain=1,this._fx=[],this._songFx=[],this._fxSrc=[],this._fxNodes=[],this._fxHead=null,this._post=null,this._range=null,this._chMute=new Set,this._chLevel=new Map,this._laneMute=new Set,this._muteFor=null,this._group=null,this._cues=[],this._texts=[],this.onText=null,this._textSeq=0,this.onCue=null,this._cueMute=new Set,this._cueSeq=0,this.dynamic_effects={}}unlock(){if(this.ctx||(this.ctx=new(window.AudioContext||window.webkitAudioContext)),this.ctx.state==="suspended"&&this.ctx.resume(),!this.noiseBuffer){let e=this.ctx.sampleRate;this.noiseBuffer=this.ctx.createBuffer(1,e,this.ctx.sampleRate);let t=this.noiseBuffer.getChannelData(0);for(let n=0;n<e;n++)t[n]=Math.random()*2-1}return Promise.all(Object.keys(tt).map(e=>this._wkLoad(e).catch(()=>{}))).then(()=>{})}_usedNoise(){return this.seVoices.reduce((e,t)=>e+t.noise,0)}reserveSE(e){this._chans=new Map,this._chanOf=new Map;for(let[t,n]of Object.entries(e||{})){let o=typeof n=="number"?{voices:n}:n||{};this._chans.set(t,{voices:Math.max(0,o.voices||0),noise:Math.max(0,o.noise||0)});for(let i of o.names||[])this._chanOf.set(i,t)}}_reserved(){let e=0,t=0;for(let n of(this._chans||new Map).values())e+=n.voices,t+=n.noise;return{voices:e,noise:t}}_scope(e){let t=e&&this._chans&&this._chans.get(e),n=c=>t?c.ch===e:!(c.ch&&this._chans&&this._chans.has(c.ch)),o=this.seVoices.filter(n),i=o.reduce((c,h)=>c+h.voices,0),r=o.reduce((c,h)=>c+h.noise,0);if(t)return{max:t.voices,maxNoise:t.noise,used:i,usedNoise:r,list:o};let l=this._reserved();return{max:this.maxVoices-l.voices-this.bgmVoices,maxNoise:this.maxNoise-l.noise,used:i,usedNoise:r,list:o}}_spatialMode(){let e=this.spatial;return e==="stereo"||e==="hrtf"?e:"mono"}_panFor(e,t){if(!e||!t)return e;let n=this._spatialMode();if(n==="mono")return e;let o=e.__pan;o||(o=new Map,e.__pan=o);let i=`${n}:${t[0]},${t[1]},${t[2]}`,r=o.get(i);if(r)return r;let l=n==="hrtf"?this._panHRTF(e,t):this._panStereo(e,t);return l.__spot={dest:e,pos:t,mode:n},o.set(i,l),l}_gainDest(e,t){if(!e||!this.ctx||!(t>=0)||t===1)return e;let n=e.__gain;n||(n=new Map,e.__gain=n);let o=n.get(t);if(o)return o;let i=this.ctx.createGain();return i.gain.value=t,i.connect(e),i.__under={dest:e,gain:t},n.set(t,i),i}_panPair(e){if(!e||!this.ctx)return e;if(e.__pair)return e.__pair;let t=this.ctx;if(e.__under){let f=t.createGain();return f.gain.value=e.__under.gain,f.connect(this._panPair(e.__under.dest)),e.__pair=f,f}let n=t.createChannelSplitter(2),o=e.__spot;if(!o){let f=t.createGain();return n.connect(f,0),n.connect(f,1),f.connect(e),e.__pair=n,n}let{dest:i,pos:r,mode:l}=o,c=Math.hypot(r[0],r[2]),h=c>0?r[0]/c:0,a=1-Math.abs(h),d=t.createGain();d.gain.value=Math.round(1e6/Math.cos(a*Math.PI/4))/1e6,d.connect(n);let u=(f,v)=>{let x=Math.max(-1,Math.min(1,h+v)),y=l==="hrtf"?[x,r[1],r[2]]:[x,0,Math.sqrt(Math.max(0,1-x*x))],M=l==="hrtf"?this._panHRTF(i,y):this._panStereo(i,y);n.connect(M,f)};return u(0,-a),u(1,a),e.__pair=d,d}_panStereo(e,t){let n=this.ctx,o=Math.hypot(t[0],t[2]),r=((o>0?t[0]/o:0)+1)*Math.PI/4,l=u=>Math.round(u*1e6)/1e6,c=n.createGain(),h=n.createGain(),a=n.createGain(),d=n.createChannelMerger(2);return h.gain.value=l(Math.cos(r)),a.gain.value=l(Math.sin(r)),c.connect(h),c.connect(a),h.connect(d,0,0),a.connect(d,0,1),d.connect(e),c}_panHRTF(e,t){let n=this.ctx.createPanner();return n.panningModel="HRTF",n.rolloffFactor=0,n.positionX?(n.positionX.value=t[0],n.positionY.value=t[1],n.positionZ.value=-t[2]):n.setPosition(t[0],t[1],-t[2]),n.connect(e),n}static get _tapCode(){return`
class MmsxxTap extends AudioWorkletProcessor {
  constructor(opts) {
    super();
    this.size = opts.processorOptions.size | 0;
    this.buf = new Float32Array(this.size);
    this.at = 0; this.len = 0;
    this.port.onmessage = (e) => {
      if (e.data === 'grab') {
        // 古い順に並べ直して渡す
        const out = new Float32Array(this.len);
        const start = (this.at - this.len + this.size) % this.size;
        for (let i = 0; i < this.len; i++) out[i] = this.buf[(start + i) % this.size];
        this.port.postMessage(out, [out.buffer]);
      } else if (e.data === 'clear') { this.at = 0; this.len = 0; }
      else if (e.data === 'hold') { this.hold = true; }
      else if (e.data === 'go') { this.hold = false; }
    };
  }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch && !this.hold) {
      for (let i = 0; i < ch.length; i++) {
        this.buf[this.at] = ch[i];
        this.at = (this.at + 1) % this.size;
        if (this.len < this.size) this.len++;
      }
    }
    return true;   // 音が止まっても回しつづける
  }
}
registerProcessor('mmsxx-tap', MmsxxTap);
`}keepSound(e){if(this._keepSec=Math.max(0,e),this.holdSound(!1),!!this.ctx){if(this._keepSec<=0){this._stopTap();return}this._out(),this._startTap(this._keepSec)}}_startTap(e){if(this._tap||this._tapBusy||!this.ctx||!this._bus||!this.ctx.audioWorklet)return;this._tapBusy=!0;let t=Math.round(e*this.ctx.sampleRate),n=URL.createObjectURL(new Blob([s._tapCode],{type:"application/javascript"}));this.ctx.audioWorklet.addModule(n).then(()=>{if(URL.revokeObjectURL(n),this._keepSec<=0||!this._bus){this._tapBusy=!1;return}let o=new AudioWorkletNode(this.ctx,"mmsxx-tap",{processorOptions:{size:t}}),i=this.ctx.createGain();i.gain.value=0,o.connect(i),i.connect(this.ctx.destination),this._post.connect(o),this._tap=o,this._tapSink=i,this._tapBusy=!1}).catch(()=>{this._tapBusy=!1})}_stopTap(){if(this._tap)try{this._tap.disconnect()}catch{}if(this._tapSink)try{this._tapSink.disconnect()}catch{}this._tap=null,this._tapSink=null}recordTo(e){let t=this._out();if(!t)return!1;if(this._recDest)try{t.disconnect(this._recDest)}catch{}return this._recDest=e||null,e&&t.connect(e),!0}clearSound(){this._tap&&this._tap.port.postMessage("clear")}holdSound(e){this._tap&&this._tap.port.postMessage(e?"hold":"go")}soundBack(){let e=this._tap;return!e||!this.ctx?Promise.resolve(null):new Promise(t=>{let n=setTimeout(()=>t(null),500);e.port.onmessage=o=>{clearTimeout(n);let i=o.data;if(!i||!i.length){t(null);return}let r=this.ctx.createBuffer(1,i.length,this.ctx.sampleRate);r.getChannelData(0).set(i),t(r)},e.port.postMessage("grab")})}async playSound(){let e=await this.soundBack();if(!e)return null;let t=this.ctx.createBufferSource();return t.buffer=e,t.connect(this._out()),t.start(),t}defineBGMData(e,t,n={}){this._mutesOf(e);let i=(Array.isArray(t)?t:[t]).map((r,l)=>{let c=Ua(r);return c.ch=l,n.beep&&ii(c),c});return i.problems=i.flatMap((r,l)=>(r.problems||[]).map(c=>({...c,ch:l}))),i.check=si(`BGM "${e}"`,Mu(i)),this.bgmDefs.set(e,i),i.check}defineBGM(e,t,n={}){if(this._mutesOf(e),t&&typeof t=="object"&&!Array.isArray(t)&&t.url)return this.bgmDefs.set(e,{kind:"audio",url:t.url,gain:t.gain??1}),{ok:!0,errors:[],warnings:[],channels:[],total:0};let o=$s(Array.isArray(t)?t:[t]),i=o.map((l,c)=>{let h=Ga(l,n.mode);return h.ch=c,n.beep&&ii(h),h});i.check=si(`BGM "${e}"`,gn(o,n.mode)),i.problems=i.flatMap((l,c)=>(l.problems||[]).map(h=>({...h,ch:c})));let r=Number(i.map(l=>l.meta&&l.meta.tempo).find(l=>l!=null));return i.tempo=r>0?r:o.map(l=>dn(String(l??""))).find(l=>l>0)??120,this.bgmDefs.set(e,i),i.check}_waitFor(e,t){let n=this.bgmSwitchPoints(e);if(!n.length)return 0;let o=this.bgmDefs.get(e),i=Math.max(...o.map(c=>c.total),0),r=o.map(c=>c.outro).find(c=>c!=null)??i,l=n.find(c=>c>t+.001&&c<=r+1e-9);return Math.max(0,(l??r)-t)}bgmSwitchPoints(e){let t=this.bgmDefs.get(e);return Array.isArray(t)?Eu(t):[]}selectTake(e,t,n,o={}){let i=this.bgmDefs.get(e);if(!Array.isArray(i))return!1;let r=i.picks||(i.picks={}),l=!1;for(let N of i)for(let S of N.takes||[])S.group===t&&S.options.some(k=>k.name===n)&&(l=!0);if(!l)return!1;r[t]=n;let c=()=>{this._takeWait=null;for(let N of i)this._rebuildTrack(N,r)};this._takeWait&&(clearTimeout(this._takeWait.timer),this._takeWait=null);let h=N=>i.some(S=>(S.takes||[]).some(k=>k.group===t&&k[N])),a=o.restart===void 0?h("restart"):o.restart===!0,d=o.now===void 0?h("now"):o.now===!0,u=this.bgmState;if(!(u&&u.name===e&&!u.paused&&u.cursor!=null))return c(),!0;let v=N=>{let S=null;for(let k of i)for(let A of k.takes||[])A.group===t&&(N<A.at-1e-9||N>=A.at+A.dur-1e-9||(S==null||A.at>S)&&(S=A.at));return S},x=()=>{let N=v(this.bgmPosition());c(),N!=null&&this.seekBGM(N,{cut:!1})},y=d?[]:this.bgmSwitchPoints(e);if(a){let N=this.bgmPosition(),S=y.find(A=>A>N+.001);if(S==null)return x(),!0;let k=Math.max(0,(u.base+S-this.ctx.currentTime)*1e3);return this._takeWait={at:u.base+S,timer:setTimeout(x,k),run:c},!0}let C=i.some(N=>(N.takes||[]).some(S=>S.group===t&&u.cursor>S.at+1e-9&&u.cursor<S.at+S.dur-1e-9))?y.find(N=>N>u.cursor+1e-9):null;if(C==null)return c(),!0;let $=Math.max(0,(u.base+C-.5-this.ctx.currentTime)*1e3);return this._takeWait={at:u.base+C,timer:setTimeout(c,$),run:c},!0}takesOf(e){let t=this.bgmDefs.get(e);if(!Array.isArray(t))return{};let n={};for(let o of t)for(let i of o.takes||[])n[i.group]===void 0&&(n[i.group]=(t.picks||{})[i.group]??i.options[0].name);return n}_fxChain(e){let t=this.ctx,n=h=>this._wkReady&&this._wkReady.get(h)===t,o=[],i=new Map,r=null,l=null,c=h=>{r?l.connect(h):r=h,o.push(h),l=h};for(let h of e)if(de[h.kind]){if(!n("filter"))continue;let a=new AudioWorkletNode(t,"mmsxx-filter",Un(h.kind,h));c(a),h.slot!==void 0&&i.set(h.slot,a)}else if(h.kind==="echo"){if(!n("echo"))continue;let a=h.cross>0?{channelCount:2,channelCountMode:"explicit",outputChannelCount:[2]}:{};c(new AudioWorkletNode(t,Et,{processorOptions:h,...a}))}else if(h.kind==="reverb"){r||c(t.createGain());let a=t.createGain(),d=t.createConvolver();d.normalize=!1,d.buffer=Qn(t,h.time,h.width);let u=t.createGain();u.gain.value=h.mix,l.connect(a),l.connect(d),d.connect(u),u.connect(a),o.push(d,u,a),l=a}return r?{head:r,tail:l,nodes:o,slots:i}:null}_chFx(e){let t=e&&e.filters;if(!t||!t.length||!this.ctx)return null;let n=new Map;for(let i of t){let r=i.slot??1;i.kind&&!n.has(r)&&n.set(r,{...i,slot:r})}if(!n.size)return null;let o=[...n.keys()].sort((i,r)=>i-r).map(i=>n.get(i));return this._fxChain(o)}_scheduleFilters(e,t,n,o,i){let r=e.filters;if(!r||!r.length)return;let l=n.chFilters&&n.chFilters[t];if(!l||!l.slots||!l.slots.size)return;let c=new Map;for(let a of r){let d=a.slot??1;a.kind&&!c.has(d)&&c.set(d,a.kind)}let h=(a,d,u)=>{let f=de[d]||de.lowpass;a.parameters.get("cutoff").setValueAtTime(f===de.highpass?f.params.cutoff.min:f.params.cutoff.max,u),a.parameters.get("resonance").setValueAtTime(0,u),a.parameters.get("drive").setValueAtTime(0,u)};for(let a of r){if(a.t<o||a.t>=i)continue;let d=n.base+a.t;if(a.off&&a.all){for(let[v,x]of l.slots)h(x,c.get(v),d);continue}let u=a.slot??1,f=l.slots.get(u);if(f){if(a.off){h(f,c.get(u),d);continue}f.parameters.get("cutoff").setValueAtTime(a.cutoff,d),f.parameters.get("resonance").setValueAtTime(a.resonance,d),f.parameters.get("drive").setValueAtTime(a.drive,d)}}}_scheduleCues(e,t,n,o,i){let r=e.cues;if(!(!r||!r.length)&&!this._cueMute.has(t))for(let l of r){if(l.t<o||l.t>=i)continue;let c=n.base+l.t,h=Math.max(0,(c-this.ctx.currentTime)*1e3),a={id:++this._cueSeq,name:l.name,arg:l.arg,t:l.t,ch:t},d=setTimeout(()=>{if(this.bgmState===n&&(this._cues.push(a),this._cues.length>256&&this._cues.splice(0,this._cues.length-256),typeof this.onCue=="function"))try{this.onCue(a)}catch(u){console.warn("[ChpTnSnd] onCue:",u)}},h);n.cueTimers.push(d)}}_scheduleTexts(e,t,n,o,i){let r=e.texts;if(!(!r||!r.length))for(let l of r){if(l.t<o||l.t>=i)continue;let c=n.base+l.t,h=Math.max(0,(c-this.ctx.currentTime)*1e3),a={id:++this._textSeq,text:l.text,t:l.t,ch:t},d=setTimeout(()=>{if(this.bgmState===n&&(this._texts.push(a),this._texts.length>256&&this._texts.splice(0,this._texts.length-256),typeof this.onText=="function"))try{this.onText(a)}catch(u){console.warn("[ChpTnSnd] onText:",u)}},h);n.cueTimers.push(d)}}takeTexts(){let e=this._texts;return this._texts=[],e}takeCues(){let e=this._cues;return this._cues=[],e}muteCues(e,t){let n=t===void 0?!this._cueMute.has(e):t===!0;return n?this._cueMute.add(e):this._cueMute.delete(e),n}cuesMuted(e){return this._cueMute.has(e)}_dropCues(e){let t=e||this.bgmState;if(!(!t||!t.cueTimers)){for(let n of t.cueTimers)clearTimeout(n);t.cueTimers=[]}}_rebuildTrack(e,t){if(!e.takes||!e.takes.length)return;let n=c=>e.takes.some(h=>c>=h.at-1e-9&&c<h.at+h.dur-1e-9),o=e.base.filter(c=>!n(c.t)),i=(e.baseCues||[]).filter(c=>!n(c.t)),r=(e.baseTexts||[]).filter(c=>!n(c.t)),l=(e.baseBars||[]).filter(c=>!n(c));for(let c of e.takes){let h=t[c.group],a=c.options.find(d=>d.name===h)||c.options[0];for(let d of a.events)o.push({...d,t:d.t+c.at});for(let d of a.cues||[])i.push({...d,t:d.t+c.at});for(let d of a.texts||[])r.push({...d,t:d.t+c.at});for(let d of a.bars||[])l.push(d+c.at)}o.sort((c,h)=>c.t-h.t),i.sort((c,h)=>c.t-h.t),r.sort((c,h)=>c.t-h.t),l.sort((c,h)=>c-h),e.events=Ya(o,e.total),Ha(e.events,e.loop?e.loop.to:1/0),e.cues=i,e.texts=r,e.bars=l}bgmInfo(e,t={}){let n=this.bgmDefs.get(e);if(!n)return null;if(!Array.isArray(n))return{ok:!0,active:!0,errors:[],warnings:[],audio:!0,tracks:[],marks:[],meta:{},takes:[],problems:[],loop:null,outro:null,ending:null,total:0};let o=n.check||{ok:!0,errors:[],warnings:[]},i=Wa(n,t.hideSystem===!0);return{ok:o.ok,active:this.bgmActive(e),errors:o.errors,warnings:o.warnings,tracks:n.map((r,l)=>({ch:l,name:r.name??null,role:r.role??null,voices:r.voices??1,chords:r.chords===!0,lanes:(r.lanes??[]).map(c=>({name:c.name,label:c.label,muted:this.isLaneMuted(l,c.name)})),group:r.group??null,groupSet:r.groupSet??null,machine:r.machine??null,total:r.total,muted:this._chMute.has(l)})),marks:i,takes:Lu(n),switches:Xa(n),problems:n.problems||[],cues:n.flatMap((r,l)=>(r.cues||[]).map(c=>({...c,ch:l}))).sort((r,l)=>r.t-l.t),texts:n.flatMap((r,l)=>(r.texts||[]).map(c=>({...c,ch:l}))).sort((r,l)=>r.t-l.t),meta:{...Tu(n),...Be(n).length?{groups:Be(n)}:{}},loop:n.map(r=>r.loop).find(Boolean)??null,outro:n.map(r=>r.outro).find(r=>r!=null)??null,ending:n.map(r=>r.outro).find(r=>r!=null)??null,total:Math.max(...n.map(r=>r.total),0)}}bgmGroups(e){let t=this.bgmDefs.get(e);return Array.isArray(t)?{groups:Be(t),...Gt(t,this._groupOf(e))}:null}_groupOf(e){return this._group&&this._group.song===e?this._group:{}}selectGroups(e,t={}){let n=this.bgmDefs.get(e);if(!Array.isArray(n))return null;let o=this._groupOf(e),i=t.group!==void 0?t.group:o.group??null,r=String(i)===String(o.group??""),l=t.sets!==void 0?t.sets:r?o.sets??null:null,c=Gt(n,{group:i,sets:l});this._group={song:e,group:c.group,sets:c.sets};let h=this.bgmState;if(h&&h.name===e&&h.chGains){h.groupOff=new Set(c.silent);for(let a=0;a<h.chGains.length;a++)h.chGains[a].gain.value=this._chVol(h,a)}return{groups:Be(n),...c}}_chVol(e,t){return this._chMute.has(t)||e&&e.groupOff&&e.groupOff.has(t)?0:this.trackVolume(t)}bgmActive(e){let t=this.bgmDefs.get(e);return t?Array.isArray(t)?!t.check||t.check.ok:!0:!1}async _loadAudio(e){return e.buffer?e.buffer:(e._loading||(e._loading=fetch(e.url).then(t=>t.arrayBuffer()).then(t=>new Promise((n,o)=>this.ctx.decodeAudioData(t,n,o))).then(t=>(e.buffer=t,t))),e._loading)}_playAudioBGM(e,t,n){this._loadAudio(e).then(o=>{if(this.bgmState!==n)return;let i=this.ctx.createBufferSource();i.buffer=o,i.loop=t,i.connect(n.gain),i.start(this.ctx.currentTime+.02),n.nodes.push(i)}).catch(()=>{})}defineSE(e,t,n={}){let o=n.base==null?null:Ko(n.base),i=o?`t${Wo} `:"",r=(Array.isArray(t)?t:[t]).map((l,c)=>{let h=Ga(i+l);return h.ch=c,n.beep&&ii(h),h});return r.base=o,this.seDefs.set(e,r),si(`SE "${e}"`,gn((Array.isArray(t)?t:[t]).map(l=>i+l)))}startBGM(e,t={}){let n=t.loop!==!1,o=t.restart===!0;this._mutesOf(e);let i=this.bgmDefs.get(e);if(!i||!this.ctx)return!1;if(!this.bgmActive(e))return console.warn(`[ChpTnSnd] BGM "${e}": 直すところがあるので鳴らしません`),!1;if(!o&&this.bgmState&&this.bgmState.name===e&&!this.bgmState.fading)return!0;let r=Array.isArray(i)?this._bakeNeeds(i):[];if(r.length)return this._bakeAll(r).then(()=>this.startBGM(e,{...t,restart:!0})),!0;this._waitSwitch=null,this._switchTimer&&(clearTimeout(this._switchTimer),this._switchTimer=0);let l=this.bgmState;if(t.now!==!0&&l&&l.name&&l.name!==e&&!l.paused){let d=this._waitFor(l.name,this.bgmPosition());if(d>.01)return this._waitSwitch={name:e,at:this.ctx.currentTime+d},this._switchTimer=setTimeout(()=>{this._switchTimer=0,this._waitSwitch=null,this.startBGM(e,{...t,now:!0})},d*1e3),!0}this.stopBGM();let c=this.ctx.createGain();c.gain.value=1,c.connect(this._out());let h={gain:c,timer:0,nodes:[],name:e,baseGain:1};this.bgmState=h;let a=()=>{this.jingleState&&(c.gain.value=1e-4)};return Array.isArray(i)?(a(),this.bgmVoices=i.length,this._applySongFx(i),h.groupOff=new Set(this.bgmGroups(e)?.silent??[]),this._pump(i,n,h,c,()=>this.bgmState===h),!0):(c.gain.value=i.gain??1,h.baseGain=c.gain.value,a(),this.bgmVoices=1,this._playAudioBGM(i,n,h),!0)}_pump(e,t,n,o,i){let r=Math.max(...e.map(M=>M.total),.01),l=e.map(M=>M.loop).find(Boolean)||null,c=e.map(M=>M.outro).find(M=>M!=null)??null,h=c!=null?Math.min(c,r):r,a=l?l.from:0;l&&e.forEach((M,C)=>{M.loop&&Math.abs(M.loop.from-l.from)>=.001&&console.warn(`[ChpTnSnd] MML: ${C+1} 本目の REPEAT はほかと違うところにあります (${M.loop.from.toFixed(2)} 秒)。最初に見つけた ${l.from.toFixed(2)} 秒に合わせます`)});let d=e.map(M=>M.loop&&M.loop.times).find(M=>M>0)??null;if(d&&this.loopTimes===this._loopTimesFromSong&&(this.loopTimes=d),d&&(this._loopTimesFromSong=d),this._songGain=za(e),this._master){let M=this.ctx.currentTime;this._master.gain.cancelScheduledValues(M),this._master.gain.setValueAtTime(this._master.gain.value,M),this._master.gain.linearRampToValueAtTime(this._outGain(),M+.05)}let u=t||!!l;n.chFilters=[],n.chGains=e.map((M,C)=>{let $=this.ctx.createGain();$.gain.value=this._chVol(n,C);let N=this._chFx(M);return n.chFilters[C]=N,N?($.connect(N.head),N.tail.connect(o)):$.connect(o),$}),n.muted=e.map((M,C)=>this._chMute.has(C)),n.tracks=e;let f=.5,v=120;n.base=this.ctx.currentTime+.05,n.cursor=0,n.length=r,n.lapEnd=h,n.endAt=c,n.inEnding=!1,n.laps=0,n.range=this._range,n.showBase=n.base,n.wraps=[],n.cueTimers=[];let x=(M,C)=>{n.base+=C,n.wraps.push({at:M,base:n.base})},y=()=>{if(!i())return;let M=this.ctx.currentTime;n.nodes=n.nodes.filter($=>$.__endTime>M);let C=0;for(;n.base+n.cursor<M+f&&C++<8;){let $=n.range&&n.cursor<n.range.to?n.range:null,N=$?$.to:n.inEnding?r:h,S=Math.min(N,n.cursor+f);for(let B=0;B<e.length;B++)this._scheduleTrack(e[B],n.base,n.chGains[B],n.nodes,n.cursor,S,n.laps>0&&!n.inEnding),this._scheduleCues(e[B],B,n,n.cursor,S),this._scheduleFilters(e[B],B,n,n.cursor,S),this._scheduleTexts(e[B],B,n,n.cursor,S);if(this._wkFlushAll(n.nodes),n.cursor=S,n.cursor<N)continue;if($){x(n.base+$.to,$.to-$.from),n.cursor=$.from;continue}let k=()=>{let B=n.base+n.cursor;n.timer=setTimeout(()=>{i()&&this.stopBGM()},Math.max(0,(B-this.ctx.currentTime)*1e3)+60)},A=u&&!this.ignoreSongLoop;if(n.inEnding){if(!A){k();return}x(n.base+r,r),n.cursor=0,n.laps=0,n.inEnding=!1;continue}if(n.laps++,!((!!l||c!=null)&&!n.leaving&&n.laps<this.loopTimes)){if(n.endAt!=null&&this.playOutro){n.inEnding=!0,n.leaving=!1;continue}if(!A){k();return}x(n.base+h,h),n.cursor=0,n.laps=0;continue}x(n.base+h,h-a),n.cursor=a}n.timer=setTimeout(y,v)};n.pump=y,y()}pauseBGM(){let e=this.bgmState;if(!e||!this.ctx||e.paused)return;if(e.paused=!0,!e.pump){this._muteBGM(!0);return}e.timer&&(clearTimeout(e.timer),e.timer=0);let t=this.ctx.currentTime-e.base;e.offset=Math.max(0,Math.min(Math.max(0,e.length-.02),t));for(let n of e.nodes)try{n.stop(0)}catch{}this._wkCut(),e.nodes=[]}resumeBGM(){let e=this.bgmState;if(!e||!this.ctx||!e.paused)return;if(e.paused=!1,!e.pump){this._muteBGM(!1);return}let t=e.offset||0;e.base=this.ctx.currentTime+.05-t,e.showBase=e.base,e.wraps=[],e.cursor=t,e.offset=0,e.pump()}playJingle(e){let t=this.bgmDefs.get(e);if(!t||!this.ctx)return 0;this.stopJingle();let n=this.ctx.createGain();n.gain.value=1,n.connect(this._out());let o={gain:n,timer:0,nodes:[],name:e};this.jingleState=o,this._muteBGM(!0);let i=0;return Array.isArray(t)?(this._pump(t,!1,o,n,()=>this.jingleState===o),i=o.length):(n.gain.value=t.gain??1,this._playAudioBGM(t,!1,o),i=t.duration||3),o.endTimer=setTimeout(()=>{this.jingleState===o&&this.stopJingle()},i*1e3+120),i}stopJingle(){let e=this.jingleState;if(e){this.jingleState=null,clearTimeout(e.timer),clearTimeout(e.endTimer);for(let t of e.nodes)try{t.stop(0)}catch{}try{e.gain.disconnect()}catch{}this._muteBGM(!1)}}get jingling(){return!!this.jingleState}_muteBGM(e){let t=this.bgmState;if(!(!t||!this.ctx))try{let n=this.ctx.currentTime;t.gain.gain.cancelScheduledValues(n),t.gain.gain.setValueAtTime(t.gain.gain.value,n),t.gain.gain.linearRampToValueAtTime(e?1e-4:t.baseGain??1,n+.05)}catch{}}fadeOutBGM(e=1.5){let t=this.bgmState;if(!t||!this.ctx)return;let n=this.ctx.currentTime;t.fading=!0;try{t.gain.gain.cancelScheduledValues(n),t.gain.gain.setValueAtTime(t.gain.gain.value,n),t.gain.gain.linearRampToValueAtTime(1e-4,n+e)}catch{}setTimeout(()=>{this.bgmState===t&&this.stopBGM()},e*1e3+50)}playBGM(e,t=!0,n=!1){return bu("playBGM()","startBGM(name, { loop, restart }) を使います。"),this.startBGM(e,{loop:t,restart:n})}async renderBGM(e,t={}){let n=this.bgmDefs.get(e);if(!n)throw new Error(`[ChpTnSnd] BGM "${e}" は登録されていません`);if(!Array.isArray(n))throw new Error(`[ChpTnSnd] BGM "${e}" は音声ファイルなので書き出せません(MML の曲だけが対象です)`);let o=globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext;if(!o)throw new Error("[ChpTnSnd] OfflineAudioContext がありません(書き出しにはブラウザが要ります。画面は無くてかまいません)");if(String(t.group??"")==="ALL")return this._renderChain(e,t);let i=Math.max(0,t.tail??Math.max(.5,Zn([...ri(n)||[],...this._fxFor(n)]))),r=t.sampleRate??44100,l=t.channels??1,c=Es(n,{loops:t.loops,intro:t.intro,outro:t.outro??t.ending}),h=c.parts.map(v=>[v.from,v.to]),a=Math.ceil((c.span+i)*r),d=new Set(t.mute??this.mutedTracks());for(let v of Gt(n,{group:t.group!==void 0?t.group:this._groupOf(e).group??null}).silent)d.add(v);let u=new o(l,a,r),f={ctx:this.ctx,bus:this._bus,master:this._master,noise:this.noiseBuffer,fxNodes:this._fxNodes,fxHead:this._fxHead,post:this._post,waveCache:this._waveCache,pulseCache:this._pulseCache,modCache:this._modCache,wk:this._wk,wkReady:this._wkReady,keepSec:this._keepSec,muted:this._muted,spatial:this.spatial,songGain:this._songGain,songFx:this._songFx,fx:this._fx,regLog:this._regLog,opllFixed:this._opllFixed};try{this.ctx=u,this._bus=null,this._master=null,this._fxNodes=[],this._fxHead=null,this._post=null,this._waveCache=null,this._pulseCache=null,this._modCache=null,this._wk=null,this._wkReady=null,this.spatial=t.spatial??(l>=2?"stereo":"mono"),this._keepSec=0,this._muted=!1,this._songGain=za(n),this._applySongFx(n),this._regLog=typeof t.regs=="function",this._opllFixed=!!t.opllFixed;let v=oi(t.seed??1);this.noiseBuffer=u.createBuffer(1,r,r);let x=this.noiseBuffer.getChannelData(0);for(let P=0;P<r;P++)x[P]=v()*2-1;await this._bakeAll(this._bakeNeeds(n));for(let P of this._wkKinds(n))await this._wkLoad(P);for(let P of this._fxKinds())await this._wkLoad(P);let y=this._out(),M=[],C=0,$=[],N=n.map((P,B)=>{let Q=this.trackVolume(B),X=this._chFx(P);X&&($[B]=X);let I=u.createGain();return I.gain.value=Q,X?(I.connect(X.head),X.tail.connect(y)):I.connect(y),I});h.forEach(([P,B],Q)=>{let X=Q>c.lapAt&&Q<c.lapAt+c.loops;n.forEach((I,H)=>{d.has(H)||(this._scheduleTrack(I,C-P,N[H],M,P,B,X),$[H]&&this._scheduleFilters(I,H,{base:C-P,chFilters:$},P,B))}),C+=B-P}),this._wkFlushAll(M);let S=a/r,k=!1,A=new Promise(P=>{if(!t.onProgress&&!t.stop)return;let B=Math.max(.25,S/60),Q=I=>Math.round(I*r/128)*128/r,X=I=>{let H=Q(I);H<=0||H>=S||u.suspend(H).then(()=>{if(t.stop&&t.stop()){k=!0,P(null);return}t.onProgress&&t.onProgress(H/S),X(H+B),u.resume()}).catch(()=>{})};X(B)}),V=await Promise.race([u.startRendering(),A]);return k?null:(t.onProgress&&t.onProgress(1),this._regLog&&t.regs(await this._collectRegs()),V)}finally{this.ctx=f.ctx,this._bus=f.bus,this._master=f.master,this._fxNodes=f.fxNodes,this._fxHead=f.fxHead,this._post=f.post,this.noiseBuffer=f.noise,this._waveCache=f.waveCache,this._pulseCache=f.pulseCache,this._modCache=f.modCache,this._wk=f.wk,this._wkReady=f.wkReady,this._keepSec=f.keepSec,this._muted=f.muted,this._songGain=f.songGain,this._songFx=f.songFx,this._fx=f.fx,this.spatial=f.spatial,this._regLog=f.regLog,this._opllFixed=f.opllFixed}}async _collectRegs(){let e={};if(this._wk)for(let[n,o]of this._wk){let i=0;for(let r of o.node.values()){if(!r.port)continue;let l=i++,c=e[n]||(e[n]=[]),h=new Map;r.port.onmessage=a=>{let d=a.data&&a.data.regs;if(!d)return;let u=a.data.chip|0,f=h.get(u);f||(f={id:`${l}.${u}`,type:a.data.type|0,regs:[]},h.set(u,f),c.push(f));for(let v=0;v<d.length;v++)f.regs.push(d[v])}}}let t=-1;for(;;){await new Promise(o=>setTimeout(o,5));let n=Object.values(e).reduce((o,i)=>o+i.reduce((r,l)=>r+l.regs.length,0),0);if(n===t)break;t=n}return e}async _renderChain(e,t={}){let n=this.bgmDefs.get(e),o=Be(n).map(v=>v.name),i=Math.max(0,t.gap??.5);if(o.length<2)return this.renderBGM(e,{...t,group:o[0]??null});let r=[];for(let v=0;v<o.length;v++){let x=await this.renderBGM(e,{...t,group:o[v],onProgress:t.onProgress?y=>t.onProgress((v+y)/o.length):void 0});if(!x)return null;r.push(x)}let l=r[0].sampleRate,c=r[0].numberOfChannels,h=Math.round(i*l),a=r.reduce((v,x)=>v+x.length,0)+h*(r.length-1),d=globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext,u=new d(c,a,l).createBuffer(c,a,l),f=0;for(let v of r){for(let x=0;x<c;x++)u.getChannelData(x).set(v.getChannelData(x),f);f+=v.length+h}return u}bgmPosition(){let e=this.bgmState;if(!e||!this.ctx||!e.pump)return 0;if(e.paused)return e.offset||0;let t=this.ctx.currentTime;for(;e.wraps&&e.wraps.length&&t>=e.wraps[0].at;)e.showBase=e.wraps.shift().base;return Math.max(0,Math.min(e.length||0,t-(e.showBase??e.base)))}bgmLength(){let e=this.bgmState;return e&&e.pump&&e.length||0}setRange(e,t){let n=Math.max(0,Math.min(e,t)),o=Math.max(e,t);return this._range=o-n>.05?{from:n,to:o}:null,this.bgmState&&(this.bgmState.range=this._range),this._range}clearRange(){this._range=null,this.bgmState&&(this.bgmState.range=null)}bgmRange(){return this._range}seekBGM(e,t={}){let n=t.cut,o=this.bgmState;if(!o||!this.ctx||!o.pump)return;this._takeWait&&(clearTimeout(this._takeWait.timer),this._takeWait.run()),this._dropCues(o);let i=Math.max(0,Math.min(Math.max(0,(o.length||0)-.02),e));if(Array.isArray(o.tracks)){let l=null;for(let c of o.tracks)for(let h of c.events)h.t>i+1e-9||h.t<i-.005||(l==null||h.t<l)&&(l=h.t);l!=null&&(i=l)}o.timer&&(clearTimeout(o.timer),o.timer=0);for(let r of o.nodes)try{r.stop(0)}catch{}if(n!==!1&&this._wkCut(),o.nodes=[],o.inEnding=o.endAt!=null&&i>=o.lapEnd,o.paused){o.offset=i;return}o.base=this.ctx.currentTime+.05-i,o.showBase=o.base,o.wraps=[],o.cursor=i,o.pump()}describeVoice(e){return ln(e)}voiceFamilies(){return vs()}bgmTracks(){let e=this.bgmState;return!e||!e.tracks?[]:e.tracks.map((t,n)=>({ch:n,name:t.name??null,role:t.role??null,muted:!!e.muted[n]}))}bgmMarks(e={}){let t=this.bgmState;return!t||!t.tracks?[]:Wa(t.tracks,e.hideSystem===!0)}bgmMarkAt(e,t){let n=String(e??"").trim().toLowerCase();if(!n)return null;let i=(t===void 0?this.bgmMarks({system:!0}):this.bgmInfo(t,{system:!0})?.marks??[]).find(r=>r.name.trim().toLowerCase()===n);return i?i.t:null}bgmLoop(){let e=this.bgmState;return!e||!e.tracks?null:e.tracks.map(t=>t.loop).find(Boolean)??null}notesAt(e){let t=this.bgmState;if(!t||!t.tracks)return[];let n=e??this.bgmPosition(),o=[];return t.tracks.forEach((i,r)=>{let l=i.events,c=0,h=l.length-1,a=-1;for(;c<=h;){let d=c+h>>1;l[d].t<=n?(a=d,c=d+1):h=d-1}for(let d=a;d>=0&&d>a-24;d--){let u=l[d],f=n-u.t;if(f<0||f>=u.gate)continue;let v=this._chMute.has(r)||u.lane!==void 0&&this._laneMute.has(`${r}/${u.lane}`);o.push({ch:r,freq:An(u,f),vol:u.vol,level:v?0:Su(u,f),t:u.t,age:f,muted:this._chMute.has(r),lane:u.lane})}}),o}levels(e){let t=this.bgmState;if(!t||!t.tracks)return[];let n=t.tracks.map(()=>0);for(let o of this.notesAt(e))n[o.ch]=Math.max(n[o.ch],o.level);return n}muteTrack(e,t){let n=t===void 0?!this._chMute.has(e):!!t;n?this._chMute.add(e):this._chMute.delete(e);let o=this.bgmState;return o&&o.chGains&&o.chGains[e]&&(o.muted[e]=n,o.chGains[e].gain.value=this._chVol(o,e)),n}_mutesOf(e){this._muteFor!==e&&(this._muteFor=e,this._chMute.clear(),this._chLevel.clear(),this._laneMute.clear(),this._group=null)}setTrackVolume(e,t){let n=Math.max(0,Math.min(4,Number(t)||0));n===1?this._chLevel.delete(e):this._chLevel.set(e,n);let o=this.bgmState;return o&&o.chGains&&o.chGains[e]&&(o.chGains[e].gain.value=this._chVol(o,e)),n}trackVolume(e){return this._chLevel.get(e)??1}resetTrackVolumes(){this._chLevel.clear();let e=this.bgmState;if(!(!e||!e.chGains))for(let t=0;t<e.chGains.length;t++)e.chGains[t].gain.value=this._chVol(e,t)}mutedTracks(){return[...this._chMute].sort((e,t)=>e-t)}isMuted(e){return this._chMute.has(e)}muteLane(e,t,n){let o=`${e}/${t}`,i=n===void 0?!this._laneMute.has(o):!!n;return i?this._laneMute.add(o):this._laneMute.delete(o),i}isLaneMuted(e,t){return this._laneMute.has(`${e}/${t}`)}mutedLanes(){return[...this._laneMute].map(e=>{let t=e.indexOf("/");return{ch:Number(e.slice(0,t)),lane:e.slice(t+1)}})}muteTracks(e){this._chMute=new Set(e||[]);let t=this.bgmState;if(!(!t||!t.chGains))for(let n=0;n<t.chGains.length;n++)t.muted[n]=this._chMute.has(n),t.chGains[n].gain.value=this._chVol(t,n)}stopBGM(){this._switchTimer&&(clearTimeout(this._switchTimer),this._switchTimer=0),this._waitSwitch=null,this._takeWait&&(clearTimeout(this._takeWait.timer),this._takeWait.run()),this._dropCues();let e=this.bgmState;if(e){this.bgmState=null,this.bgmVoices=0,clearTimeout(e.timer);for(let t of e.nodes)try{t.stop(0)}catch{}this._wkCut();for(let t of e.chFilters||[])if(t)for(let n of t.nodes)try{n.disconnect(),n.port&&n.port.postMessage({stop:!0})}catch{}try{e.gain.disconnect()}catch{}}}_victim(e,t,n){let o=null,i=null;for(let r of n||this.seVoices)t&&!r.noise||(r.priority<e?(!o||r.priority<o.priority)&&(o=r):r.priority===e&&(!i||r.id<i.id)&&(i=r));return o||i}_seShape(e,t,n){let o=n.note!=null&&n.note!=="",i=n.vol!=null;if(!o&&!i)return t;o&&!t.base&&console.warn(`[ChpTnSnd] SE "${e}" は音名で鳴らし分けられません(defineSE の base を付けて登録してください)`);let r=o&&t.base?Jo(n.note,t.base.semi):[{semi:0,sec:Math.max(...t.map(l=>l.total),0),rest:!1}];return r.length?Uo(t,r,n.vol):t}playSE(e,t=0,n={}){let o=this.seDefs.get(e);if(!o||!this.ctx)return 0;o=this._seShape(e,o,n);let i=this.ctx.currentTime;this._cleanupSE(i);let r=!!n.system,l=o.length,c=$u(o),h=n.ch||this._chanOf&&this._chanOf.get(e)||null;if(!r){if(this.seVoices.some(C=>C.exclusive&&C.priority>t))return 0;if(n.exclusive)for(let C of[...this.seVoices])this._stopVoice(C);let M=this._scope(h);for(;M.used+l>M.max;){let C=this._victim(t,!1,M.list);if(!C)return 0;this._stopVoice(C),M=this._scope(h)}for(;c>0&&c<=M.maxNoise&&M.usedNoise+c>M.maxNoise;){let C=this._victim(t,!0,M.list);if(!C)return 0;this._stopVoice(C),M=this._scope(h)}}let a=this.ctx.createGain();a.gain.value=1,a.connect(this._out());let d=Math.max(...o.map(M=>M.total),0),u=n.loop==null?1:n.loop|0,f=++this._seSeq,v=i+.02,x={id:f,gain:a,nodes:[],priority:t,voices:l,noise:c,ch:h,endTime:v+d,exclusive:!r&&!!n.exclusive,system:r,left:u,timer:0,nextAt:v+d,paused:!1,tracks:o,len:d,resume:n.resume==="continue"?"continue":"head",startAt:v,offset:0};this.seVoices.push(x);for(let M of o)this._scheduleTrack(M,v,a,x.nodes);if(this._wkFlushAll(x.nodes),u===1||d<=0)return f;let y=()=>{if(this.seVoices.indexOf(x)<0)return;if(x.paused||this._sePausedAll){x.timer=0;return}if(x.left>0&&x.left--,x.left===0)return;let M=x.nextAt,C=this.ctx.currentTime;x.nodes=x.nodes.filter($=>($.__endTime||0)>C);for(let $ of o)this._scheduleTrack($,M,a,x.nodes);this._wkFlushAll(x.nodes),x.nextAt=M+d,x.startAt=M,x.endTime=M+d+.05,x.timer=setTimeout(y,Math.max(20,(M+d-this.ctx.currentTime)*1e3-60))};return x.loopAgain=y,x.timer=setTimeout(y,Math.max(20,d*1e3-60)),f}playPauseSE(){return this.playSE(bt,0,{system:!0})}pauseSE(e){if(e){let t=this.seVoices.find(n=>n.id===e);t&&(t.paused=!0,this._silence(t));return}this._sePausedAll=!0;for(let t of this.seVoices)t.system||this._silence(t)}resumeSE(e){if(e){let t=this.seVoices.find(n=>n.id===e);t&&(t.paused=!1,this._restart(t));return}this._sePausedAll=!1;for(let t of[...this.seVoices])t.system||this._restart(t)}_silence(e){if(e.timer&&(clearTimeout(e.timer),e.timer=0),e.resume==="continue"&&e.len>0){let t=this.ctx.currentTime-e.startAt;e.offset=Math.max(0,Math.min(e.len-.02,t))}for(let t of e.nodes)try{t.stop(0)}catch{}e.nodes=[]}_restart(e){if(e.paused||this._sePausedAll||e.timer)return;if(e.left===1||e.left===0||!e.tracks){this._stopVoice(e);return}let t=this.ctx.currentTime+.02;if(e.resume==="continue"&&e.offset>0){let n=e.len-e.offset;for(let o of e.tracks)this._scheduleTrackFrom(o,t,e.gain,e.nodes,e.offset);e.startAt=t-e.offset,e.nextAt=t+n,e.endTime=t+n+.05,e.offset=0,e.timer=setTimeout(e.loopAgain,Math.max(20,n*1e3-60));return}e.nextAt=t,e.loopAgain()}stopSE(e){if(e){let t=this.seVoices.find(n=>n.id===e);t&&this._stopVoice(t);return}for(let t of[...this.seVoices])this._stopVoice(t);this.seVoices=[]}_lfsrBuffer(e){this._lfsr=this._lfsr||new Map;let t=e+"@"+(this.ctx?this.ctx.sampleRate:0),n=this._lfsr.get(t);if(n&&n.ctx===this.ctx)return n.buf;let o=(1<<e)-1,i=this.ctx.createBuffer(1,o,this.ctx.sampleRate),r=i.getChannelData(0),l=1;for(let c=0;c<o;c++){let h=l&1;l>>=1,h&&(l^=1<<e-2),r[c]=h?1:-1}return this._lfsr.set(t,{ctx:this.ctx,buf:i}),i}_makeOscillator(e,t){let n=this.ctx,o=T[e.wave]||T[2];if(o.kind==="wave"){let r=n.createOscillator();return r.setPeriodicWave(this._periodicWave(o)),r.frequency.value=t,r}if(o.kind==="fm"){let r=n.createOscillator();r.type="sine",r.frequency.value=t;let l=n.createOscillator(),c=T[Z(o.wave)];c&&c.kind==="pulse"?l.setPeriodicWave(this._pulseWave(c.duty)):c&&c.kind==="wave"?l.setPeriodicWave(this._periodicWave(c)):l.type=c&&{triangle:"triangle",saw:"sawtooth"}[c.name]||"sine",l.frequency.value=t*o.ratio;let h=n.createGain();return l.connect(h).connect(r.frequency),r.__fm={mod:l,depth:h,wf:o,freq:t},r}if(o.kind==="beep")return e.tape?this._makeTape(o,e):this._makeBeep(o,t,e);if(o.kind==="noise"){let r=n.createBufferSource();return r.buffer=o.bits?this._lfsrBuffer(o.bits):this.noiseBuffer,r.loop=!0,r.playbackRate.value=Math.min(4,Math.max(.05,t/440*(o.rate||1))),r}let i=n.createOscillator();return o.kind==="pulse"?i.setPeriodicWave(this._pulseWave(o.duty)):o.kind==="triangle"?i.type="triangle":o.kind==="saw"?i.type="sawtooth":i.type="sine",i.frequency.value=t,i}get waveNames(){return T.map(e=>e.name)}addWave(e,t,n=8,o={}){let i=ie(e,t,n,o);return this._waveCache&&this._waveCache.delete(e),i}addFM(e,t,n={}){return Vt(e,t,n)}_periodicWave(e){this._waveCache||(this._waveCache=new Map);let t=this._waveCache.get(e.name);if(t)return t;let n=e.samples,o=n.length,i=o>>1,r=new Float32Array(i),l=new Float32Array(i);for(let h=1;h<i;h++){let a=0,d=0;for(let u=0;u<o;u++){let f=2*Math.PI*h*u/o;a+=n[u]*Math.cos(f),d+=n[u]*Math.sin(f)}r[h]=a*2/o,l[h]=d*2/o}let c=this.ctx.createPeriodicWave(r,l);return this._waveCache.set(e.name,c),c}_pulseWave(e,t=!1){this._pulseCache||(this._pulseCache=new Map);let n=e+(t?"#n":""),o=this._pulseCache.get(n);if(o)return o;let i=64,r=new Float32Array(i),l=new Float32Array(i);for(let h=1;h<i;h++)r[h]=2/(h*Math.PI)*Math.sin(2*Math.PI*h*e),l[h]=2/(h*Math.PI)*(1-Math.cos(2*Math.PI*h*e));let c=this.ctx.createPeriodicWave(r,l,{disableNormalization:!t});return this._pulseCache.set(n,c),c}async bakeVoice(e){let t=T[Z(e)];if(!t||t.kind!=="baked")throw new Error("[ChpTnSnd] "+e+" は焼ける音色ではありません");if(t.baked)return t.baked.length;if(t.baking)return 0;if(t.phrase)return this._bakePhrase(t);let n=Z(t.from);if(n<0)throw new Error("[ChpTnSnd] "+e+": 元の音色がありません");t.baking=!0;try{let o=T[n],i=o.patch&&Array.isArray(o.patch.ops)?Zs(o.patch):o.kind==="fm"?{ops:[{ratio:o.ratio,sl:o.sustain,ar:o.attack,dr:o.decay},{ratio:1,sl:1,ar:0,dr:0}]}:{ops:[{ratio:1,sl:1,ar:.005,dr:.05}]},r=Qs(i,{sampleRate:t.sampleRate,octaves:t.octaves,step:t.step,minLoop:t.minLoop,loop:t.loop,length:t.length}),l=[];for(let c of r.jobs){let h=c.attackSamples+c.loopSamples,a=Math.ceil(t.sampleRate*.2),d=await this._renderTone(n,c.bakedFreq,h+a,t.sampleRate),u={note:c.note,bakedFreq:c.bakedFreq,attack:c.attackSamples,loop:c.loopSamples,data:d.slice(0,h),rate:t.sampleRate};if(t.post){let f=t.post(u.data,t.sampleRate),v=f.sampleRate/t.sampleRate;u.data=f.data,u.rate=f.sampleRate,u.attack=Math.round(u.attack*v),u.loop=Math.round(u.loop*v)}l.push(u)}return t.baked=l,t.plan=r,l.length}finally{t.baking=!1}}async _bakePhrase(e){if(!(globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext))throw new Error("[ChpTnSnd] 焼くにはブラウザが要ります");e.baking=!0;try{let n=new s({maxVoices:this.maxVoices});n.defineBGM("__phrase__",[`t${e.tempo} ${e.phrase}`],{});let o=await n.renderBGM("__phrase__",{loops:1,tail:.5,sampleRate:e.sampleRate,channels:1,seed:1,mute:[]}),i=o?o.getChannelData(0):new Float32Array(1),r=i.length;for(;r>1&&Math.abs(i[r-1])<1e-4;)r--;i=i.slice(0,r);for(let c=0;c<i.length;c++)i[c]/=ci;let l={note:60,bakedFreq:440*Math.pow(2,-9/12),attack:i.length,loop:0,data:i,rate:e.sampleRate};if(e.post){let c=e.post(l.data,e.sampleRate);l.attack=Math.round(l.attack*c.sampleRate/e.sampleRate),l.data=c.data,l.rate=c.sampleRate}return e.baked=[l],1}finally{e.baking=!1}}_bakeNeeds(e){let t=new Set,n=(o,i)=>{if(i.has(o))return;i.add(o);let r=T[o];if(r){if(r.kind==="layer"){for(let l of r.layers)n(l.wave,i);return}r.kind==="baked"&&!r.baked&&!r.bakeFailed&&t.add(r.name)}};for(let o of e||[])for(let i of o.events||[])n(i.wave,new Set);return[...t]}async _bakeAll(e){for(let t of e)try{await this.bakeVoice(t)}catch{let o=T[Z(t)];o&&(o.bakeFailed=!0)}}async _renderTone(e,t,n,o){let i=globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext;if(!i)throw new Error("[ChpTnSnd] 焼くにはブラウザが要ります");let r=new i(1,n,o),l=new s({maxVoices:this.maxVoices});l.ctx=r;let c=oi(1);l.noiseBuffer=r.createBuffer(1,o,o);let h=l.noiseBuffer.getChannelData(0);for(let M=0;M<o;M++)h[M]=c()*2-1;for(let M of l._wkKindsOf(e))await l._wkLoad(M);let a=l._out(),d=[],u=n/o,f={t:0,dur:u,gate:u,freq:t,vol:15,wave:e,env:0,vibrato:0,echo:null},v=Mt(f,1);l._playVoice(f,t,v,0,u,a,d,!1),l._wkFlushAll(d);let y=(await r.startRendering()).getChannelData(0);if(v>0)for(let M=0;M<y.length;M++)y[M]/=v;return y}_pcmBuffer(e,t){this._pcmCache||(this._pcmCache=new Map);let n=e.name+"#"+t.note,o=this._pcmCache.get(n);if(o&&o.ctx===this.ctx)return o.buf;let i=this.ctx.createBuffer(1,t.data.length,t.rate||e.sampleRate);return i.getChannelData(0).set(t.data),this._pcmCache.set(n,{ctx:this.ctx,buf:i}),i}_playBaked(e,t,n,o,i,r,l,c){let h=this.ctx,a=e.baked[0],d=69+12*Math.log2(n/440);for(let x of e.baked)Math.abs(x.note-d)<Math.abs(a.note-d)&&(a=x);let u=h.createGain();u.gain.value=0,u.connect(l),this._applyEnvelope(u,t,o,i,r);let f=h.createBufferSource();if(f.buffer=this._pcmBuffer(e,a),a.loop>0){let x=a.rate||e.sampleRate;f.loop=!0,f.loopStart=a.attack/x,f.loopEnd=(a.attack+a.loop)/x}let v=x=>x/a.bakedFreq;if(f.playbackRate.value=v(n),t.glide>0){let x=r-Math.max(0,Math.min(t.relTail||0,r-i-.01));f.playbackRate.setValueAtTime(v(n),i),f.playbackRate.exponentialRampToValueAtTime(Math.max(1e-4,v(n*(t.glide/t.freq))),x)}f.connect(u),f.start(i),f.stop(r+.02),f.__endTime=r+.02,f.onended=()=>{try{u.disconnect()}catch{}},c.push(f)}_wkBank(e){this._wk||(this._wk=new Map);let t=this._wk.get(e);return t||(t={pend:new Map,node:new Map},this._wk.set(e,t)),t}_wkPush(e,t,n){let o=this._wkBank(e).pend,i=o.get(t);i||(i=[],o.set(t,i)),i.push(n)}async _wkLoad(e){if(this._wkReady||(this._wkReady=new Map),this._wkReady.get(e)===this.ctx)return;let t=URL.createObjectURL(new Blob([tt[e].code],{type:"application/javascript"}));await this.ctx.audioWorklet.addModule(t),this._wkReady.set(e,this.ctx)}_wkFlushAll(e){if(this._wk)for(let[t,n]of this._wk)for(let o of[...n.pend.keys()])this._wkFlush(t,o,e)}_wkCut(){if(this._wk)for(let[,e]of this._wk){e.pend.clear();for(let t of e.node.values())try{t.port.postMessage({cut:!0})}catch{}}}_wkFlush(e,t,n){let o=this._wkBank(e),i=o.pend.get(t);if(!i||!i.length||!this._wkReady||this._wkReady.get(e)!==this.ctx)return null;o.pend.delete(t),i.sort((c,h)=>c.t-h.t);let r=o.node.get(t);if(r){let c=tt[e].extra?tt[e].extra():null;return r.port.postMessage(c&&Object.keys(c).length?{patches:c,add:i}:{add:i}),r}let l=tt[e];return r=new AudioWorkletNode(this.ctx,l.node,l.options?l.options.call(this,i):{processorOptions:{events:i,voices:this.maxVoices*4,...this._regLog?{log:!0}:{}}}),r.connect(t),r.__endTime=1/0,o.node.set(t,r),n&&n.push(r),r}_wkKindOf(e){let t=T[e];return t?t.kind==="baked"?this._wkKindOf(Z(t.from)):yu(t):null}_wkKindsOf(e,t=new Set,n=new Set){if(n.has(e))return t;n.add(e);let o=T[e];if(!o)return t;if(o.kind==="layer"){for(let r of o.layers)this._wkKindsOf(r.wave,t,n);return t}let i=this._wkKindOf(e);return i&&t.add(i),t}_wkKinds(e){let t=new Set;for(let n of ri(e)||[])de[n.kind]?t.add("filter"):n.kind==="echo"&&t.add("echo");for(let n of e){for(let o of n.events)this._wkKindsOf(o.wave,t);for(let o of n.filters||[])de[o.kind]?t.add("filter"):o.kind==="echo"&&t.add("echo")}return t}_makeTape(e,t){let n=this.ctx,o=n.sampleRate,i=4,r=t.tape,l=Math.max(1,Math.round(t.dur*o)),c=n.createBuffer(1,l,o),h=c.getChannelData(0),a=oi(r.seed*2654435761+r.seq*40503>>>0),d=r.baud*2,u=r.baud,f=Math.round(i*o/r.baud),v=new Float32Array(l*i),x=0,y=0,M=(r.wow??e.wow)>0?r.wow??e.wow:0,C=P=>{if(!M)return 1;let B=P/(o*i);return 1+M*(Math.sin(2*Math.PI*1.7*B)*.7+Math.sin(2*Math.PI*11*B)*.3)},$=P=>{let B=P?d:u,Q=C(x),X=Math.min(v.length,x+Math.round(f/Q));for(;x<X;x++)y+=B*Q/(o*i),v[x]=y%1<.5?1:-1};if(r.data){let P=r.bytes,B=0;for(;x<v.length;){let Q=P?P[B++%P.length]:null;$(0);for(let X=0;X<8;X++)$(Q===null?a()<.5?1:0:Q>>X&1);$(1),$(1),$(1)}}else for(;x<v.length;)$(1);let N=(r.muffle??e.muffle)>0?r.muffle??e.muffle:0,S=N>0?Math.exp(-2*Math.PI*N/(o*i)):0,k=0;for(let P=0;P<l;P++){let B=0;for(let Q=0;Q<i;Q++){let X=v[P*i+Q];N>0?(k=X*(1-S)+k*S,B+=k):B+=X}h[P]=B/i}let A=r.hiss??e.hiss;if(A>0){let P=A;for(let B=0;B<l;B++)h[B]=h[B]*(1-P)+(a()*2-1)*P}let V=n.createBufferSource();return V.buffer=c,V}_makeBeep(e,t,n){let o=this.ctx,i=n&&n.beepSet?Object.assign(Object.create(e),n.beepSet):e,r=t;i.divClock>0&&(r=i.divClock/Math.max(1,Math.round(i.divClock/r)));let l=[],c=(v,x)=>{if(!(i.jitter>0))return;let y=x*i.jitter/2,M=o.createOscillator();M.frequency.value=i.frame,M.setPeriodicWave(this._pulseWave(i.display,!0));let C=o.createGain();C.gain.value=-y;let $=o.createConstantSource();$.offset.value=-y,M.connect(C).connect(v),$.connect(v),l.push(M,$)};if(!(i.carrier>0)){let v=o.createOscillator();return v.type="square",v.frequency.value=r,c(v.frequency,r),l.length&&(v.__beep={out:v,extras:l}),v}let h=o.createOscillator();h.type="square",h.frequency.value=i.carrier;let a=o.createOscillator();a.type="square",a.frequency.value=r,c(a.frequency,r);let d=o.createGain();d.gain.value=.5;let u=o.createConstantSource();u.offset.value=.5;let f=o.createGain();return f.gain.value=0,a.connect(d).connect(f.gain),u.connect(f.gain),h.connect(f),l.push(a,u),h.__beep={out:f,extras:l},h}_applyTone(e,t,n,o,i,r,l,c){let h=T[n.wave],a=h&&h.tone;if(!a)return!1;let d=Math.max(1,Math.ceil((l-r)/W));if(!!(t&&t.frequency)&&(a.arp||a.pitch||a.slide))for(let f=0;f<d;f++){let v=Ce(a.arp,f,a.loop.arp),x=Ce(a.pitch,f,a.loop.pitch)+cn(a.slide,f),y=o*Math.pow(2,v/12+x/1200);c&&(y=kn(y,n.wave)),t.frequency.setValueAtTime(y,r+f*W)}if(a.vol){e.gain.setValueAtTime(0,r);for(let f=0;f<d;f++){let v=Math.max(0,Math.min(15,Ce(a.vol,f,a.loop.vol)));e.gain.setValueAtTime(Math.max(1e-4,i*v/15),r+f*W)}return e.gain.linearRampToValueAtTime(0,l),!0}return!1}_dutyFrames(e,t,n,o,i){let r=Math.max(1,Math.ceil(o/W)),l=new Float32Array(r),c=new Float32Array(r),h=e.vol?new Float32Array(r):null,a=t.vib||e.vib,d=a?a.depth:t.vibrato,u=a&&a.speed!=null?a.speed:rn,f=a&&a.delay!=null?a.delay:0;for(let v=0;v<r;v++){let x=Ce(e.arp,v,e.loop.arp),y=Ce(e.pitch,v,e.loop.pitch)+cn(e.slide,v),C=(t.glide>0?An(t,v*W):n)*Math.pow(2,x/12+y/1200);d>0&&v>=f&&(C*=Math.pow(2,d*Math.sin(2*Math.PI*u*(v-f)*W)/1200)),l[v]=i?kn(C,t.wave):C,c[v]=No(e.dutyLfo?ms(e.dutyLfo,v):Ce(e.duty,v,e.loop.duty)),h&&(h[v]=Math.max(0,Math.min(15,Ce(e.vol,v,e.loop.vol)))/15)}return{fr:l,du:c,gv:h}}_stepShape(e,t,n){let o=je(e),i=Math.max(0,Math.min(e.relTail||0,n-t-.01)),r=Math.max(.02,n-i-t),l=e.tieSpan>0?Math.max(.02,e.tieSpan-i):r,c=e.tieAt>0?e.tieAt:0,h=i>0&&!o.table&&o.s>0?Math.min(Oe(o.r,r),i):0,{a,d,rel:u}=Sn(o,l),f=i>0?0:e.open?.002:u,v=Math.max(a+d,l-f),x=r+h;return{n:Math.max(1,Math.ceil(x/W)),end:x,shapeAt:C=>{let $=c+C;return $<a?a>0?$/a:1:$<a+d?1-(1-o.s)*(($-a)/Math.max(1e-6,d)):$<v?o.s:Math.max(0,o.s*(1-($-v)/Math.max(1e-6,l+h-v)))}}}_chipShape(e,t,n,o){let i=je(e);if(t.vol)return{n:Math.max(1,Math.ceil((o-n)/W)),shapeAt:c=>Math.max(0,Math.min(15,Ce(t.vol,Math.floor(c/W),t.loop.vol)))/15};if(i.table)return{n:Math.max(1,Math.ceil((o-n)/W)),shapeAt:c=>Tn(i,Math.floor(c/W))};let{n:r,shapeAt:l}=this._stepShape(e,n,o);return{n:r,shapeAt:l}}_pceEvent(e,t,n,o,i,r){let l=t.tone||{loop:{}},c=e.vsteps??t.vsteps,{n:h,shapeAt:a}=this._chipShape(e,l,i,r),d=Ee(e),u=d>0&&o<d*.999?Math.round(-20*Math.log10(Math.max(1e-6,o/d))/1.5):0,f=k=>{let A=Math.round(Ge(ze(e,k)*a(k),c)*31/15);return A>0?Math.max(0,Math.min(31,A-u)):0},{fr:v}=this._dutyFrames(l,e,n,h*W,!1),x=k=>(t.noise?$o:Co)(v[Math.min(k,v.length-1)]),y=f(0),M=x(0),C=[],$=[],N=y,S=M;for(let k=1;k<h;k++){let A=i+k*W;if(A>=r)break;let V=f(k*W),P=x(k);V!==N&&(C.push([A,V]),N=V),P!==S&&($.push([A,P]),S=P)}return{t:i,dur:Math.max(.01,r-i),v:y,p:M,...t.noise?{noise:1}:{wave:t.wave,wkey:t.name},...C.length?{vs:C}:{},...$.length?{ps:$}:{}}}_sccEvent(e,t,n,o,i,r){let l=t.tone||{loop:{}},c=e.vsteps??t.vsteps,{n:h,shapeAt:a}=this._chipShape(e,l,i,r),d=Ee(e),u=d>0?Math.min(1,o/d):1,f=k=>Math.max(0,Math.min(15,Math.round(Ge(ze(e,k)*a(k),c)*u))),{fr:v}=this._dutyFrames(l,e,n,h*W,!1),x=k=>ko(v[Math.min(k,v.length-1)]),y=f(0),M=x(0),C=[],$=[],N=y,S=M;for(let k=1;k<h;k++){let A=i+k*W;if(A>=r)break;let V=f(k*W),P=x(k);V!==N&&(C.push([A,V]),N=V),P!==S&&($.push([A,P]),S=P)}return{t:i,dur:Math.max(.01,r-i),v:y,p:M,wave:t.wave,wkey:t.name,...C.length?{vs:C}:{},...$.length?{ps:$}:{}}}_fdsEvent(e,t,n,o,i,r){let l=t.tone||{loop:{}},c=e.vsteps??t.vsteps,{n:h,shapeAt:a}=this._chipShape(e,l,i,r),d=Ee(e),u=d>0?Math.min(1,o/d):1,f=A=>Math.max(0,Math.min(32,Math.round(Ge(ze(e,A)*a(A),c)*u*32/15))),{fr:v}=this._dutyFrames(l,e,n,h*W,!1),x=A=>wo(v[Math.min(A,v.length-1)]),y=f(0),M=x(0),C=[],$=[],N=y,S=M;for(let A=1;A<h;A++){let V=i+A*W;if(V>=r)break;let P=f(A*W),B=x(A);P!==N&&(C.push([V,P]),N=P),B!==S&&($.push([V,B]),S=B)}let k=t.mod;return{t:i,dur:Math.max(.01,r-i),v:y,p:M,wave:t.wave,wkey:t.name,...k?{mod:{ratio:k.ratio,gain:xo(k.depth),table:Mn[k.table]||Mn.tri}}:{},...C.length?{vs:C}:{},...$.length?{ps:$}:{}}}_ayEvent(e,t,n,o,i,r){let l=t.tone||{loop:{}},c=t.mode==="noise",h=t.mode==="env"&&!e.toneOnly,a=t.mode==="env"&&e.toneOnly,d=a?16:e.vsteps??t.vsteps,{n:u,shapeAt:f}=this._chipShape(e,l,i,r),v=Ee(e),x=v>0&&o<v*.999?Math.round(-20*Math.log10(Math.max(1e-6,o/v))/3):0,y=13,M=I=>{if(a)return Math.max(0,Math.min(15,Math.round(y*f(I))-x));let H=Math.round(Ge(ze(e,I)*f(I),d));return h?H>0?16:0:Math.max(0,Math.min(15,H-x))},{fr:C}=this._dutyFrames(l,e,n,u*W,!1),$=h?(Le[t.shape]||Le.saw).div:0,N=I=>{let H=C[Math.min(I,C.length-1)];return h?so(H,$):c?no(H):xn(H)},S=M(0),k=N(0),A=[],V=[],P=S,B=k;for(let I=1;I<u;I++){let H=i+I*W;if(H>=r)break;let ye=M(I*W),ke=N(I);ye!==P&&(A.push([H,ye]),P=ye),ke!==B&&(V.push([H,ke]),B=ke)}let Q=0,X=[];if(h&&e.gates)for(let I of e.gates){let H=I.hz>0?xn(I.hz):0;I.at<=1e-9?Q=H:i+I.at<r&&X.push([i+I.at,H])}return{t:i,dur:Math.max(.01,r-i),v:S,...c?{noise:1,np:k}:h?{env:{shape:(Le[t.shape]||Le.saw).r13,ep:k},g0:Q}:{tp:k},...t.ay?{ay:1}:{},...A.length?{vs:A}:{},...V.length?{ps:V}:{},...X.length?{gs:X}:{}}}_nesEvent(e,t,n,o,i,r){let l=t.tone||{loop:{}},c=t.mode,h=e.vsteps??t.vsteps,{n:a,shapeAt:d}=this._chipShape(e,l,i,r),u=Ee(e),f=u>0?Math.min(1,o/u):1,v=I=>{let H=Math.round(Ge(ze(e,I)*d(I),h)*f);return c==="triangle"?H>0?1:0:Math.max(0,Math.min(15,H))},{fr:x,du:y}=this._dutyFrames(l,e,n,a*W,!1),M=I=>x[Math.min(I,x.length-1)],C=I=>c==="noise"?uo(M(I),!!t.short):c==="triangle"?lo(M(I)):co(M(I)),$=I=>ho(Fe(l)?y[Math.min(I,y.length-1)]:t.duty??.5),N=v(0),S=C(0),k=$(0),A=[],V=[],P=[],B=N,Q=S,X=k;for(let I=1;I<a;I++){let H=i+I*W;if(H>=r)break;let ye=v(I*W),ke=C(I),We=$(I);ye!==B&&(A.push([H,ye]),B=ye),ke!==Q&&(V.push([H,ke]),Q=ke),c==="pulse"&&We!==X&&(P.push([H,We]),X=We)}return{t:i,dur:Math.max(.01,r-i),ch:c,v:N,p:S,...c==="pulse"?{duty:k}:{},...c==="noise"&&t.short?{short:1}:{},...A.length?{vs:A}:{},...V.length?{ps:V}:{},...P.length?{ds:P}:{}}}_applyEnvelope(e,t,n,o,i){let r=je(t),l=Math.max(0,Math.min(t.relTail||0,i-o-.01)),c=i-l,h=Math.max(.02,c-o),a=t.tieSpan>0?Math.max(.02,t.tieSpan-l):h,d=t.tieAt>0?t.tieAt:0,u=l>0&&!r.table&&r.s>0?Math.min(Oe(r.r,h),l):0;if(r.table){e.gain.setValueAtTime(0,o);let S=Math.max(1,Math.ceil(h/W));for(let k=0;k<S;k++){let A=Tn(r,k);e.gain.setValueAtTime(Math.max(1e-4,n*A),o+k*W)}e.gain.linearRampToValueAtTime(0,c);return}let{a:f,d:v,rel:x}=Sn(r,a),y=T[t.wave];if((t.vsteps??(y?y.vsteps:0))>0){let{n:S,end:k,shapeAt:A}=this._stepShape(t,o,i);e.gain.setValueAtTime(t.legato?Mt(t,A(0)):0,o);for(let V=0;V<S;V++){let P=V*W;e.gain.setValueAtTime(Math.max(1e-4,Mt(t,A(P),P)),o+P)}e.gain.setValueAtTime(1e-4,o+k);return}let M=n*r.s,C=S=>S<f?f>0?S/f:1:S<f+v?1-(1-r.s)*((S-f)/Math.max(1e-6,v)):r.s;if(t.legato?(e.gain.setValueAtTime(Math.max(1e-4,n*C(d)),o),d<f+v&&e.gain.linearRampToValueAtTime(Math.max(1e-4,M),o+(f+v-d))):(e.gain.setValueAtTime(0,o),e.gain.linearRampToValueAtTime(n,o+f),v>0?e.gain.linearRampToValueAtTime(Math.max(1e-4,M),o+f+v):e.gain.setValueAtTime(n,o+f)),u>0){e.gain.setValueAtTime(Math.max(1e-4,M),Math.max(o+f+v-d,c)),e.gain.linearRampToValueAtTime(0,c+u);return}let $=t.open?.002:x,N=Math.max(o,c-$);e.gain.linearRampToValueAtTime(Math.max(1e-4,n*C(d+(N-o))),N),e.gain.linearRampToValueAtTime(0,c)}_extraVoices(e,t,n,o,i,r,l,c=!1){let h=this.dynamic_effects&&this.dynamic_effects[t];if(!h)return;let a=Math.max(0,Math.min(2,h.octave|0));if(a>=1&&this._playVoice(e,e.freq/2,n*.5,o,i,r,l,c),a>=2&&this._playVoice(e,e.freq/4,n*.28,o,i,r,l,c),h.detune){let d=e.freq*Math.pow(2,Number(h.detune)/1200);this._playVoice(e,d,n*.6,o,i,r,l,c)}if(h.echo){let d=Number(h.echo.delay)||.12,u=Math.max(1,Math.min(9,Number(h.echo.depth)||5)),f=n*(.12+u*.035);this._playVoice(e,e.freq,f,o+d,i+d,r,l,c)}}_tuneOn(e){let t=this.psgTune;return Array.isArray(t)?t[e|0]!==!1:!!t}_fadeSteps(e,t,n,o,i=r=>Math.round(r)){let r=[],l=i(o(0));for(let c=W;t+c<n;c+=W){let h=o(c),a=i(h);a!==l&&(l=a,r.push([t+c,h]))}return r}_fadeDest(e,t,n,o){let i=Math.max(0,n-t),r=e.fade,l=Math.max(0,Math.min(i,r[0][0])),c=Math.max(l,Math.min(i,r[r.length-1][0])),h=this.ctx.createGain();h.gain.setValueAtTime(nt(e,0),t),h.gain.setValueAtTime(nt(e,l),t+l);for(let a=l+W;a<c;a+=W)h.gain.linearRampToValueAtTime(nt(e,a),t+a);return h.gain.linearRampToValueAtTime(nt(e,c),t+c),h.connect(o),{dest:h,ev:{...e,fade:null,vol:Ka(e)}}}_playVoice(e,t,n,o,i,r,l,c=!1){let h=this.ctx;if(e.fade){let S=T[e.wave]||{};S.kind==="layer"||S.kind==="ay"||S.kind==="nes"||S.kind==="fds"||S.kind==="scc"||S.kind==="pce"||qe.has(S.kind)||S.kind==="baked"&&!S.baked||Fe(S.tone)||(e.vsteps??S.vsteps)>0&&!je(e).table&&!(S.tone&&S.tone.vol)||({dest:r,ev:e}=this._fadeDest(e,o,i,r))}let a=T[e.wave];if(a&&a.kind==="wave"&&a.octave&&(t*=Math.pow(2,a.octave)),a&&a.kind==="ay"){this._wkPush("ay",r,this._ayEvent(e,a,t,n,o,i));return}if(a&&a.kind==="nes"){this._wkPush("nes",r,this._nesEvent(e,a,t,n,o,i));return}if(a&&a.kind==="fds"){this._wkPush("fds",r,this._fdsEvent(e,a,t,n,o,i));return}if(a&&a.kind==="scc"){this._wkPush("scc",r,this._sccEvent(e,a,t,n,o,i));return}if(a&&a.kind==="pce"){this._wkPush("pce",r,this._pceEvent(e,a,t,n,o,i));return}let d=T[e.wave];if(d&&d.kind==="layer"){let S=d.defaultEnv??fe.findIndex(A=>A.name===Dt),k=e.env!==S;for(let A of d.layers){let V=t*Math.pow(2,(A.semi+A.cents/100)/12),P=A.env!=null?A.env:(T[A.wave]||{}).defaultEnv??S,B=A.follow&&k?e.env:P,Q=(A.delay||0)*W;this._playVoice({...e,wave:A.wave,env:B},V,n,o+Q,i+Q,this._gainDest(r,A.gain),l,c)}return}let u=T[e.wave];if(u&&u.kind==="baked"){if(u.baked)return this._playBaked(u,e,t,n,o,i,r,l);u.baking||this.bakeVoice(u.name).catch(()=>{});let S=Z(u.from);return S>=0?this._playVoice({...e,wave:S},t,n,o,i,r,l,c):void 0}let f=T[e.wave];if(f&&qe.has(f.kind)){let S=tt[f.kind].buses===2?this._panPair(r):r,k=qe.get(f.kind).event.call(this,e,f,t,n,o,i);k&&this._wkPush(f.kind,S,k);return}let v=T[e.wave];if(v&&Fe(v.tone)){let S=Math.max(.02,i-o),k=this._dutyFrames(v.tone,e,t,S,c),A=Math.min(e.relTail||0,S-.01),V=je(e),P=k.gv||V.table?null:Sn(V,S-A);P&&A>0&&(P={...P,hold:S-A}),this._wkPush("duty",r,{t:o,dur:S,vol:n,fr:k.fr,du:k.du,gv:k.gv||ku(V,S),...e.fade?{fv:Float32Array.from(k.fr,(B,Q)=>nt(e,Q*W))}:{},env:P});return}c&&(t=kn(t,e.wave));let x=h.createGain();x.gain.value=0,x.connect(r);let y=this._makeOscillator(e,t),M=this._applyTone(x,y,e,t,n,o,i,c);if(M||this._applyEnvelope(x,e,n,o,i),e.glide>0&&!M&&y.frequency){let S=t*(e.glide/e.freq),k=c?kn(S,e.wave):S;if(y.frequency.setValueAtTime(t,o),y.frequency.exponentialRampToValueAtTime(Math.max(1,k),i),y.__fm){let A=y.__fm;A.mod.frequency.setValueAtTime(t*A.wf.ratio,o),A.mod.frequency.exponentialRampToValueAtTime(Math.max(1,k*A.wf.ratio),i)}}let C=e.vib||(T[e.wave]||{}).tone?.vib,$=C?C.depth:e.vibrato;if($>0&&y.frequency){let S=h.createOscillator(),k=h.createGain();S.frequency.value=C&&C.speed!=null?C.speed:rn;let A=t*(Math.pow(2,$/1200)-1);if(C&&C.delay>0){let V=o+C.delay*W;k.gain.setValueAtTime(0,o),k.gain.setValueAtTime(0,Math.min(V,i)),k.gain.linearRampToValueAtTime(A,Math.min(V+.08,i))}else k.gain.value=A;S.connect(k).connect(y.frequency),S.start(o),S.stop(i+.02),S.__endTime=i+.02,l.push(S)}if(y.__fm){let{mod:S,depth:k,wf:A,freq:V}=y.__fm,P=V*A.ratio*A.depth,B=P*A.sustain;if(k.gain.setValueAtTime(0,o),k.gain.linearRampToValueAtTime(P,o+Math.min(A.attack,(i-o)*.5)),k.gain.exponentialRampToValueAtTime(Math.max(1,B),Math.min(i,o+A.attack+A.decay)),A.drop>0&&!e.glide){let Q=V*(1+A.drop),X=Math.min(i,o+A.dropTime);y.frequency.setValueAtTime(Q,o),y.frequency.exponentialRampToValueAtTime(V,X),S.frequency.setValueAtTime(Q*A.ratio,o),S.frequency.exponentialRampToValueAtTime(V*A.ratio,X)}S.start(o),S.stop(i+.02),S.__endTime=i+.02,l.push(S)}let N=y;if(y.__beep){N=y.__beep.out;for(let S of y.__beep.extras)S.start(o),S.stop(i+.02),S.__endTime=i+.02,l.push(S)}if(e.beep){let S=h.createWaveShaper();S.curve=xu,S.oversample="none",N.connect(S),S.connect(x)}else N.connect(x);y.start(o),y.stop(i+.02),y.__endTime=i+.02,y.onended=()=>{try{x.disconnect()}catch{}},l.push(y)}_scheduleTrackFrom(e,t,n,o,i){let r=this._tuneOn(e.ch);for(let l of e.events){let c=l.t+Math.max(.01,l.gate);if(c<=i)continue;let h=Math.max(l.t,i),a=t+(h-i),d=ja(l,c-h),u=t+(c-i)+d,f=Ee(l),v=d>0?{...l,relTail:d}:l;l.pedals&&(v={...v,pedBase:t-i}),this._playVoice(v,l.freq,f,a,u,n,o,r),this._extraVoices(v,e.ch,f,a,u,n,o,r)}}_scheduleTrack(e,t,n,o,i=-1/0,r=1/0,l=!1){let c=this._tuneOn(e.ch);for(let h of e.events){if(h.t<i||h.t>=r||(l&&h.loopVol!==void 0&&(h={...h,vol:h.loopVol,fade:h.loopFade}),h.lane&&this._laneMute.has(`${e.ch}/${h.lane}`)))continue;let a=t+h.t,d=ja(h,Math.max(.01,h.gate)),u=a+Math.max(.01,h.gate)+d,f=Ee(h);d>0&&(h={...h,relTail:d}),h.pedals&&(h={...h,pedBase:t});let v=this._panFor(n,h.pos);this._playVoice(h,h.freq,f,a,u,v,o,c),this._extraVoices(h,e.ch,f,a,u,v,o,c)}}_cleanupSE(e){this.seVoices=this.seVoices.filter(t=>{if(e<t.endTime||t.left!==0&&t.timer||!t.system&&(t.paused||this._sePausedAll))return!0;t.timer&&(clearTimeout(t.timer),t.timer=0);try{t.gain.disconnect()}catch{}return!1})}_usedVoices(){return this.bgmVoices+this.seVoices.reduce((e,t)=>e+t.voices,0)}_stopVoice(e){e.timer&&(clearTimeout(e.timer),e.timer=0),e.left=0;for(let t of e.nodes)try{t.stop(0)}catch{}try{e.gain.disconnect()}catch{}this.seVoices=this.seVoices.filter(t=>t!==e)}_out(){return this.ctx?(this._bus||(this._master=this.ctx.createGain(),this._master.gain.value=this._outGain(),this._master.connect(this.ctx.destination),this._spatialMode()==="mono"&&(this._master.channelCount=1,this._master.channelCountMode="explicit",this._master.channelInterpretation="speakers"),this._bus=this.ctx.createGain(),this._bus.gain.value=1,this._post=this.ctx.createGain(),this._post.connect(this._master),this._fxWire(),this._keepSec>0&&this._startTap(this._keepSec)),this._bus):null}async setMasterEffects(e){let t=this.bgmState?this.bgmDefs.get(this.bgmState.name):null;if(this._fx=Lt(e,de,qa(t)),this._fxSrc=e.map(n=>({...n})),this.ctx){for(let n of this._fxKinds())await this._wkLoad(n).catch(()=>{});this._bus&&this._fxWire()}return this.masterEffects()}masterEffects(){return this._fx.map(e=>({...e}))}describeMasterEffects(){let e={};for(let[t,n]of Object.entries({...de,...ct}))e[t]={desc:n.desc,params:JSON.parse(JSON.stringify(n.params))};return e}_applySongFx(e){let t=ri(e)||[],n=Qt(this._fxSrc);!t.length&&!this._songFx.length&&!n||(this._songFx=t,n&&(this._fx=this._fxFor(e)),this._bus&&this._fxWire())}_fxFor(e){return Qt(this._fxSrc)?Lt(this._fxSrc,de,qa(e)):this._fx}_fxAll(){return[...this._songFx,...this._fx]}_fxKinds(){let e=new Set;for(let t of this._fxAll())de[t.kind]&&e.add("filter"),t.kind==="echo"&&e.add("echo");return e}_fxWire(){for(let t of this._fxNodes){try{t.disconnect()}catch{}t.port&&t.port.postMessage({stop:!0})}if(this._fxNodes=[],this._fxHead)try{this._bus.disconnect(this._fxHead)}catch{}this._fxHead=null;let e=this._fxChain(this._fxAll());e?(this._bus.connect(e.head),this._fxHead=e.head,this._fxNodes=e.nodes,e.tail.connect(this._post)):(this._bus.connect(this._post),this._fxHead=this._post)}mute(e){this._muted=e===void 0?!this._muted:!!e,this._out();let t=this._master;if(t){let n=this.ctx.currentTime;t.gain.cancelScheduledValues(n),t.gain.setValueAtTime(t.gain.value,n),t.gain.linearRampToValueAtTime(this._outGain(),n+.05)}return this._muted}goToEnding(){return this.bgmState?(this.bgmState.leaving=!0,!0):!1}_outGain(){return this._muted?0:this.volume*this._songGain}get volume(){return this._vol==null?1:this._vol}set volume(e){if(this._vol=Math.max(0,Math.min(8,Number(e)||0)),this._master&&!this._muted){let t=this.ctx.currentTime;this._master.gain.cancelScheduledValues(t),this._master.gain.setValueAtTime(this._master.gain.value,t),this._master.gain.linearRampToValueAtTime(this._outGain(),t+.05)}}get muted(){return!!this._muted}};function Za(s){let e=s.numberOfChannels,t=s.length,n=s.sampleRate,o=2,i=t*e*o,r=new Uint8Array(44+i),l=new DataView(r.buffer),c=0,h=f=>{for(let v of f)r[c++]=v.charCodeAt(0)},a=f=>{l.setUint32(c,f,!0),c+=4},d=f=>{l.setUint16(c,f,!0),c+=2};h("RIFF"),a(36+i),h("WAVE"),h("fmt "),a(16),d(1),d(e),a(n),a(n*e*o),d(e*o),d(8*o),h("data"),a(i);let u=[];for(let f=0;f<e;f++)u.push(s.getChannelData(f));for(let f=0;f<t;f++)for(let v=0;v<e;v++){let x=Math.max(-1,Math.min(1,u[v][f]));l.setInt16(c,Math.round(x<0?x*32768:x*32767),!0),c+=2}return r}var Ou={"gm.js":qn,"tones.js":Kn,"filter.js":Yn,"fx.js":ts,"mml.js":Ls,"chipset.js":Rs,"mask.js":Ds,"wavetables.js":js,"fmpresets.js":qs,"beeppresets.js":Ks,"extrawaves.js":Xs,"pcmbake.js":to,"ay.js":ro,"nes.js":mo,"fds.js":_o,"scc.js":Ao,"pce.js":Oo,"duty.js":Po,"demotunes.js":jo,"se.js":Ho,"layerpresets.js":Xo,"version.js":Zo,"dynpcm.js":ni,"audio.js":ui};return Tc(Ru);})();
