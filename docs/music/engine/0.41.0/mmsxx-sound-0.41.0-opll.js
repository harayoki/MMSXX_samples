var MMSXX;((MMSXX||={}).sound||={}).opll=(()=>{var r=globalThis.MMSXX.sound.core["mml.js"],Vt=r.AY_ENV_SHAPES,Kt=r.AY_MODES,Bt=r.DEFAULT_ENV,qt=r.DEFAULT_WAVE,It=r.DEV_MARKS,E=r.DRUM_FREQ,Ht=r.ENVELOPES,Ut=r.HEAD_MARK,Gt=r.NES_MODES,$t=r.NOISE_VARIANTS,Wt=r.ROLES,jt=r.SPECIALS,Xt=r.STEALS,Yt=r.TUNINGS,zt=r.VCURVES,Jt=r.VIB_MAX,Qt=r.VIB_SPEED,Zt=r.WAVE,N=r.WAVEFORMS,u=r.badVoice,te=r.compileMML,ee=r.countOldStyle,se=r.describeVoice,ie=r.dutyLfoAt,re=r.dutyMoves,oe=r.envRunLen,ae=r.envSec,ce=r.findWave,he=r.firstTempo,ne=r.isSystemMark,le=r.listEnvelopes,xe=r.listVoiceFamilies,fe=r.listVoices,ue=r.metaOf,pe=r.noOldDescName,de=r.readBundles,me=r.readChordSets,ge=r.readDirectives,be=r.readDrums,Se=r.readVoices,ke=r.readWaves,Ae=r.registerAY,Me=r.registerAnalog,F=r.registerBaked,ye=r.registerBeep,Le=r.registerBrass,ve=r.registerCoreFamilies,D=r.registerDrumSlots,Ee=r.registerEnvelope,we=r.registerFDS,Oe=r.registerFM,w=r.registerFamily,Re=r.registerLayer,Pe=r.registerModal,Te=r.registerNES,Ce=r.registerNoiseVariants,_e=r.registerOPNARhythm,Ne=r.registerPCE,Fe=r.registerSCC,k=r.registerVoice,De=r.registerVoiceDetail,m=r.registerVoiceSyntax,Ve=r.registerWave,Ke=r.roleOf,V=r.sealPresets,Be=r.shareBundles,qe=r.slideAt,Ie=r.songParts,K=r.splitParts,He=r.splitVoices,Ue=r.stealOf,Ge=r.toneOf,$e=r.validateMML,We=r.voiceArgs,je=r.voiceName,Xe=r.voiceNameProblem,B=r.voiceNums,Ye=r.volFromGain,ze=r.volGainOf,O=r.warn,Je=r.waveMeta,Qe=r.waveRole,Ze=r.waveSteal;var R=globalThis.MMSXX.sound.core["layerpresets.js"],es=R.LAYER_PRESETS,ss=R.layerPairFamily,A=R.registerDefaultLayers;var M=`const SIN = new Uint16Array(1024);
for (let x = 0; x < 256; x++) SIN[x] = Math.round(-Math.log2(Math.sin((x + 0.5) * Math.PI / 512)) * 256);
for (let x = 0; x < 256; x++) SIN[256 + x] = SIN[255 - x];
for (let x = 0; x < 512; x++) SIN[512 + x] = 0x8000 | SIN[x];
const EXP = new Uint16Array(256);
for (let x = 0; x < 256; x++) EXP[x] = Math.round((Math.pow(2, x / 256) - 1) * 1024);
/** 対数の値を振幅へ戻す。上位ビットが符号 */
function expLookup(i) {
const t = EXP[(i & 0xff) ^ 0xff] + 1024;
const res = t >> ((i & 0x7f00) >> 8);
return ((i & 0x8000) ? ~res : res) << 1;
}
const AM = [];
for (let v = 0; v <= 12; v++) for (let i = 0; i < 8; i++) AM.push(v);
AM.push(13, 13, 13);
for (let v = 12; v >= 0; v--) for (let i = 0; i < 8; i++) AM.push(v);
AM.length = 210;
const PM = [
[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, -1, 0],
[0, 1, 2, 1, 0, -1, -2, -1], [0, 1, 3, 1, 0, -1, -3, -1],
[0, 2, 4, 2, 0, -2, -4, -2], [0, 2, 5, 2, 0, -2, -5, -2],
[0, 3, 6, 3, 0, -3, -6, -3], [0, 3, 7, 3, 0, -3, -7, -3],
];
const EG_STEP = [
[0, 1, 0, 1, 0, 1, 0, 1], [0, 1, 0, 1, 1, 1, 0, 1],
[0, 1, 1, 1, 0, 1, 1, 1], [0, 1, 1, 1, 1, 1, 1, 1],
];
const ML = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 20, 24, 24, 30, 30];
const KL = [0, 18, 24, 27.75, 30, 32.25, 33.75, 35.25, 36, 37.5, 38.25, 39, 39.75, 40.5, 41.25, 42];`;var l=globalThis.MMSXX.sound.core["audio.js"],os=l.ChipTuneSound,as=l.SE_SYS_PAUSE,cs=l.SOUND_VERSION,hs=l.ampFor,ns=l.encodeWAV,ls=l.fadeGain,q=l.freqAt,xs=l.psgDiv,y=l.registerChipKind,fs=l.snapVol,I=l.volAt;var U=[0,0,0,0,0,0,0,0,113,97,30,23,208,120,0,23,19,65,26,13,216,247,35,19,19,1,153,0,242,196,33,35,17,97,14,7,141,100,112,39,50,33,30,6,225,118,1,40,49,34,22,5,224,113,0,24,33,97,29,7,130,129,17,7,51,33,45,19,176,112,0,7,97,97,27,6,100,101,16,23,65,97,11,24,133,240,129,7,51,1,131,17,234,239,16,4,23,193,36,7,248,248,34,18,97,80,12,5,210,245,64,66,1,1,85,3,233,144,3,2,65,65,137,3,241,228,192,19,1,1,24,15,223,248,106,109,1,1,0,0,200,216,167,104,5,1,0,0,248,170,89,85],G=[0,0,0,0,0,0,0,0,3,33,5,6,232,129,66,39,19,65,20,13,216,246,35,18,17,17,8,8,250,178,32,18,49,97,12,7,168,100,97,39,50,33,30,6,225,118,1,40,2,1,6,0,163,226,244,244,33,97,29,7,130,129,17,7,35,33,34,23,162,114,1,23,53,17,37,0,64,115,114,1,181,1,15,15,168,165,81,2,23,193,36,7,248,248,34,18,113,35,17,6,101,116,24,22,1,2,211,5,201,149,3,2,97,99,12,0,148,192,51,246,33,114,13,0,193,213,86,6,1,1,24,15,223,248,106,109,1,1,0,0,200,216,167,104,5,1,0,0,248,170,89,85],$=[0,0,0,0,0,0,0,0,98,33,26,7,240,111,0,22,64,16,69,0,246,131,115,99,19,1,153,0,242,195,33,35,1,97,11,15,249,100,112,23,50,33,30,6,225,118,1,40,96,1,130,14,249,97,32,39,33,97,28,7,132,129,17,7,55,50,201,1,102,100,64,40,1,33,7,3,165,113,81,7,6,1,94,7,243,243,246,19,0,0,24,6,245,243,32,35,23,193,36,7,248,248,34,18,53,100,0,0,255,243,119,245,17,49,0,7,221,243,255,251,58,33,0,7,128,132,15,245,1,1,24,15,223,248,106,109,1,1,0,0,200,216,167,104,5,1,0,0,248,170,89,85],W=[U,G,$];var j=3579545,gs=j/72,P={bd:{bit:16,reg:54,hi:0,ch:6,fnum:288,blk:2},sd:{bit:8,reg:55,hi:0,ch:7,fnum:336,blk:2},hh:{bit:1,reg:55,hi:1,ch:7,fnum:336,blk:2},tom:{bit:4,reg:56,hi:1,ch:8,fnum:448,blk:0},cym:{bit:2,reg:56,hi:0,ch:8,fnum:448,blk:0}},lt=`const SETS = ${JSON.stringify([U,G,$])};
const DRUM = ${JSON.stringify(P)};
const CLK = ${j};
const RATE = CLK / 72;
${M}
const HALF = new Uint16Array(1024);
for (let x = 0; x < 512; x++) HALF[x] = SIN[x];
for (let x = 512; x < 1024; x++) HALF[x] = 0xfff;
const WAVE = [SIN, HALF];
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
let idle = 0;
for (let ch = 0; ch < 9; ch++) {
const m = this.slot[ch << 1], c = this.slot[(ch << 1) | 1];
if (!(this.rhythm && ch >= 6) && this.quiet(m) && this.quiet(c)) {
idle |= 1 << ch;
m.out0 = 0; m.out1 = 0; c.out0 = 0; c.out1 = 0;
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
if (q.log) {
const raw = this.chip.writeReg.bind(this.chip);
this.logNow = 0;
this.logBuf = [];
this.chip.writeReg = (r, d) => { this.logBuf.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
}
this.fixed = !!q.fixed;
this.step = RATE / sampleRate;   // 出口 1 サンプルあたり何回まわすか
this.frac = 0;
this.prev = 0;
this.cur = 0;
this.busy = new Float64Array(9);
this.off = new Float64Array(9);
this.rhythmOn = false;
this.rbits = 0;
this.rOff = { bd: 0, sd: 0, hh: 0, tom: 0, cym: 0 };
this.vs = new Array(9).fill(null);
this.rVs = {};
this.fading = 0;
this.ps = new Array(9).fill(null);
this.tieCh = Object.create(null);
this.gliding = 0;
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
this.rbits = 0;
this.chip.writeReg(0x0e, 0);
for (const k in this.rOff) this.rOff[k] = 0;
for (const k in this.rVs) this.rVs[k] = null;
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
* 書いた高さの比から、その打楽器の fnum と blk を出す。
*
* 実機のドライバの値を物差しにして、比で動かす。比が 1 なら呼ばれない
* (音符が o4c のままなら、startRhythm() が書いた値がそのまま残る)ので、
* 前からある曲の音は変わらない。
*
* @param {object} d DRUM の 1 つ
* @param {number} ratio 書いた高さ ÷ o4c
* @returns {{fnum:number, blk:number}}
*/
drumBend(d, ratio) {
let fnum = d.fnum * ratio, blk = d.blk;
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
const base = currentTime;
const next = this.at < this.events.length ? this.events[this.at].t : Infinity;
if (this.cutAt < 0 && !this.rbits && !this.fading && !this.gliding
&& next >= base + n / sampleRate && this.chip.allQuiet()) {
out.fill(0);
return true;
}
for (let i = 0; i < n; i++) {
const now = base + i / sampleRate;
if (this.logBuf) this.logNow = now;
if (this.rbits) {
for (const k in DRUM) {
if (this.rOff[k] > 0 && this.rOff[k] <= now) {
this.rbits &= ~DRUM[k].bit;
this.chip.writeReg(0x0e, 0x20 | this.rbits);
this.rOff[k] = 0;
}
}
}
if (this.fading) this.fade(now);
if (this.gliding) this.glide(now);
for (let ch = 0; ch < 9; ch++) {
if (this.off[ch] > 0 && this.off[ch] <= now) {
this.chip.writeReg(0x20 + ch, this.chip.reg[0x20 + ch] & ~0x10);
this.off[ch] = 0;
}
}
while (this.at < this.events.length && this.events[this.at].t <= now) {
const ev = this.events[this.at++];
if (ev.drum) {
const d = DRUM[ev.drum];
this.startRhythm();
this.drumPitch(d, ev.rp ? this.drumBend(d, ev.rp) : d);
const att = Math.max(0, Math.min(15, 15 - Math.round(ev.v)));
const cur = this.chip.reg[d.reg];
this.chip.writeReg(d.reg, d.hi ? ((att << 4) | (cur & 15)) : ((cur & 0xf0) | att));
this.rbits |= d.bit;
this.chip.writeReg(0x0e, 0x20 | this.rbits);
this.rOff[ev.drum] = now + ev.dur;
this.follow(ev.drum, ev.vs);
continue;
}
if (ev.voice) {
for (let r = 0; r < 8; r++) {
if (this.chip.reg[r] !== ev.voice[r]) this.chip.writeReg(r, ev.voice[r]);
}
}
const keep = ev.legato && ev.tie ? this.tieCh[ev.tie] : undefined;
if (keep !== undefined && (this.chip.reg[0x20 + keep] & 0x10)) {
const { blk: b2, fnum: f2 } = pitchOf(ev.freq);
this.chip.writeReg(0x10 + keep, f2 & 0xff);
this.chip.writeReg(0x20 + keep,
(this.chip.reg[0x20 + keep] & 0x30) | (b2 << 1) | ((f2 >> 8) & 1));
const hold2 = Math.max(ev.dur, ev.left || 0);
this.busy[keep] = now + hold2;
this.off[keep] = now + hold2;
this.follow(keep, ev.vs);
this.bend(keep, ev.ps);
continue;
}
const ch = this.pick(now);
if (this.chip.reg[0x20 + ch] & 0x10) {
this.chip.writeReg(0x20 + ch, this.chip.reg[0x20 + ch] & ~0x10);
}
const { blk, fnum } = pitchOf(ev.freq);
this.chip.useSet(ch, ev.set | 0);
const inst = Math.max(0, Math.min(15, ev.inst | 0));
const att = Math.max(0, Math.min(15, 15 - Math.round(ev.v)));
this.chip.writeReg(0x30 + ch, (inst << 4) | att);
this.chip.writeReg(0x10 + ch, fnum & 0xff);
this.chip.writeReg(0x20 + ch, 0x10 | (blk << 1) | ((fnum >> 8) & 1));
const hold = Math.max(ev.dur, ev.left || 0);
this.busy[ch] = now + hold;
this.off[ch] = now + hold;
if (ev.tie) this.tieCh[ev.tie] = ch;
this.follow(ch, ev.vs);
this.bend(ch, ev.ps);
}
this.frac += this.step;
while (this.frac >= 1) {
this.prev = this.cur;
this.cur = this.chip.tick();
this.frac -= 1;
}
let v = (this.prev + (this.cur - this.prev) * this.frac) / 16384;
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
return true;
}
}
registerProcessor('mmsxx-opll', OpllBank);`;function xt(t,e,i,o,s,a){let c=e;return c.semi&&(i*=Math.pow(2,c.semi/12)),{t:s,dur:Math.max(.01,a-s-(t.relTail||0)),freq:i,v:t.vol,inst:c.inst,...t.fade?{vs:this._fadeSteps(t,s,a,h=>I(t,h))}:{},...t.glide>0?{ps:this._fadeSteps(t,s,a-(t.relTail||0),h=>q(t,h),h=>h)}:{},...c.drum?{drum:c.drum,...Math.abs(i/E-1)>1e-6?{rp:i/E}:{}}:{},...c.set?{set:c.set}:{},...t.tieId?{tie:t.tieId,legato:t.legato?1:0,left:Math.max(0,t.tieSpan-t.tieAt)}:{},...c.voice?{voice:c.voice}:{}}}var H={kind:"opll",node:"mmsxx-opll",code:lt,event:xt,noTail:!0,options(t){return{processorOptions:{events:t,voices:this.maxVoices*4,...this._regLog?{log:!0}:{},...this._opllFixed?{fixed:!0}:{}}}}};y(H.kind,H);var T={mul:{at:"ml",max:15,desc:null},ksr:{at:"kr",max:1,desc:null},hold:{at:"eg",max:1,desc:null},vibrato:{at:"pm",max:1,desc:null},tremolo:{at:"am",max:1,desc:null},ksl:{at:"kl",max:3,desc:null},tl:{at:"tl",max:63,modOnly:!0,desc:null},wave:{at:"ws",max:1,desc:null},fb:{at:"fb",max:7,modOnly:!0,desc:null},ar:{at:"ar",max:15,desc:null},dr:{at:"dr",max:15,desc:null},sl:{at:"sl",max:15,desc:null},rr:{at:"rr",max:15,desc:null}},X={ratio:"mul",harmonic:"mul",depth:"tl",level:"tl",attack:"ar",decay:"dr",sustain:"sl",release:"rr",feedback:"fb",scale:"ksl",scaleRate:"ksr",sustaining:"hold",half:"wave"};function ft(t,e){let i=X[t]??t,o=T[i];if(!o){let s=[...Object.keys(T),...Object.keys(X)].sort().join(" ");throw new Error(`[ChpTnSnd] OPLL のユーザー音色: ${e} に "${t}" は書けません(書けるもの: ${s})`)}return[i,o]}function z(t,e,i,o){let s=t===!0?e.max:t===!1?0:Number(t);if(!Number.isFinite(s)||s<0||s>e.max||s!==Math.floor(s))throw new Error(`[ChpTnSnd] OPLL のユーザー音色: ${o} の "${i}" は 0〜${e.max} の整数です(${t} と書いてあります)`);return s}function Y(t,e,i){let o={ml:0,kr:0,eg:0,pm:0,am:0,kl:0,tl:0,ws:0,fb:0,ar:0,dr:0,sl:0,rr:0};for(let[s,a]of Object.entries(t||{})){let[c,h]=ft(s,e);if(h.modOnly&&!i)throw new Error(`[ChpTnSnd] OPLL のユーザー音色: "${s}" は変調側(mod)にだけ書けます`+(c==="tl"?"。キャリア側の音量は MML の v です":"。実機のキャリア側には無いパラメータです"));o[h.at]=z(a,h,s,e)}return o}function ut(t,e){return[t.am<<7|t.pm<<6|t.eg<<5|t.kr<<4|t.ml,e.am<<7|e.pm<<6|e.eg<<5|e.kr<<4|e.ml,t.kl<<6|t.tl,e.kl<<6|e.ws<<4|t.ws<<3|t.fb,t.ar<<4|t.dr,e.ar<<4|e.dr,t.sl<<4|t.rr,e.sl<<4|e.rr]}function pt(t={}){if(t.bytes){let o=[...t.bytes];if(o.length!==8||o.some(s=>!Number.isInteger(s)||s<0||s>255))throw new Error("[ChpTnSnd] OPLL のユーザー音色: bytes は 0〜255 の数 8 個です");return o}let e=Y(t.mod,"mod",!0),i=Y(t.car,"car",!1);return t.feedback!==void 0&&(e.fb=z(t.feedback,T.fb,"feedback","この音色")),ut(e,i)}var dt=20;function mt(t){return t>0?1067/2**(t-1):1/0}function gt(t){let e=(t[1]>>5&1)===1,i=t[5]>>4&15;return e&&mt(i)<dt?"ok":"avoid"}function b(t,e,i={}){let o=pt(e);return g(t,0,{...i,voice:o})}function g(t,e,i={}){let o={inst:Math.max(0,Math.min(15,Math.floor(e))),...i.drum?{drum:String(i.drum)}:{},...i.set>0?{set:Math.floor(i.set)}:{},...i.voice?{voice:i.voice}:{},...i.gain>0?{gain:Math.max(.1,Math.min(4,Number(i.gain)))}:{},...i.semi?{semi:Math.round(i.semi)}:{}},s=i.steal;if(s==null)if(o.drum)s="avoid";else{let a=o.voice??W[o.set??0]?.slice(o.inst*8,o.inst*8+8);a&&a.length===8&&(s=gt(a))}return k(t,"opll",o,{...i,...s==null?{}:{steal:s}})}function bt(t,e){let i={};for(let o of K(t)){let s=/^([A-Za-z]+)\s*(?:\{([^}]*)\}|(-?\d+))$/.exec(o.trim());s||u(`[ChpTnSnd] MML: 音色 "${e}" の @opll の "${o.trim()}" は読めません(mod{…} car{…} bytes{…} か、feedback 5 のように書きます)`);let a=s[1].toLowerCase();a==="mod"||a==="car"?(s[2]===void 0&&u(`[ChpTnSnd] MML: 音色 "${e}" の @opll の ${a} は ${a}{…} で書きます`),i[a]=St(s[2],e,a)):a==="bytes"?(s[2]===void 0&&u(`[ChpTnSnd] MML: 音色 "${e}" の @opll の bytes は bytes{…} で書きます`),i.bytes=B(s[2],e,"opll の bytes")):a==="feedback"?(s[3]===void 0&&u(`[ChpTnSnd] MML: 音色 "${e}" の @opll の feedback は数で書きます`),i.feedback=Number(s[3])):u(`[ChpTnSnd] MML: 音色 "${e}" の @opll に "${s[1]}" は書けません(書けるのは mod car feedback bytes です)`)}return!i.mod&&!i.car&&!i.bytes&&u(`[ChpTnSnd] MML: 音色 "${e}" の @opll に中身がありません(mod{…} と car{…} を書くか、bytes{…} に 8 個の数を書いてください)`),i}function St(t,e,i){let o={};for(let s of String(t).split(",")){let a=s.trim().split(/\s+/).filter(Boolean);(a.length!==2||!Number.isFinite(Number(a[1])))&&u(`[ChpTnSnd] MML: 音色 "${e}" の @opll の ${i}{${t}} は「名前 数」を \`,\` で区切って書きます`),o[a[0]]=Number(a[1])}return o}m("opll",(t,e,i)=>b(t,bt(e,t),i),{raw:!0});D("opll",P);var kt=[[1,"opll::violin","lead","バイオリン。細くて張りがある","Violin. Thin and taut."],[2,"opll::guitar","lead","ギター。はじいたあと速く落ちる","Guitar. Plucked, and it drops away fast."],[3,"opll::piano","lead","ピアノ。MSX の FM でいちばん使われた音","Piano, and the one voice an MSX game was most likely to reach for."],[4,"opll::flute","lead","フルート。柔らかく立ち上がる","Flute. A soft start."],[5,"opll::clarinet","lead","クラリネット。木管らしい奇数倍音","Clarinet, with the odd harmonics of a reed."],[6,"opll::oboe","lead","オーボエ。鼻にかかる","Oboe. Nasal and narrow."],[7,"opll::trumpet","lead","トランペット。前に出る","Trumpet. It cuts through."],[8,"opll::organ","chord","オルガン。切るまで伸びる","Organ. It holds until you stop it."],[9,"opll::horn","chord","ホルン。丸くて奥にいる","Horn. Round, and it sits back."],[10,"opll::synth","lead","シンセ。この時代らしい作り物の音","Synthesizer, artificial in the way the era liked."],[11,"opll::harpsichord","lead","チェンバロ。硬くて短い","Harpsichord. Hard and short."],[12,"opll::vibraphone","lead","ビブラフォン。揺れながら伸びる","Vibraphone, wavering as it rings on."],[13,"opll::synthBass","bass","シンセベース。低音の定番","Synth bass, the usual choice down low."],[14,"opll::acousticBass","bass","アコースティックベース。指で弾いた低音","Acoustic bass, plucked."],[15,"opll::electricGuitar","lead","エレキギター。硬めのアタック","Electric guitar, with a harder attack."]],At=[[1,"opll::opllpStrings","lead","エレキストリングス","Electric strings."],[2,"opll::opllpBowWow","lead","バウワウ。うなる","Bow wow, and it growls."],[3,"opll::opllpGuitar","lead","エレキギター","Electric guitar."],[4,"opll::opllpOrgan","chord","オルガン","Organ."],[6,"opll::opllpSax","lead","サックス","Saxophone."],[7,"opll::opllpTrumpet","lead","トランペット","Trumpet."],[8,"opll::opllpStreetOrgan","chord","ストリートオルガン","Street organ."],[9,"opll::opllpSynthBrass","lead","シンセブラス","Synth brass."],[10,"opll::opllpEPiano","lead","エレピ","Electric piano."],[11,"opll::opllpBass","bass","ベース","Bass."],[13,"opll::opllpChimes","lead","チャイム","Chimes."],[14,"opll::opllpTomTom","perc","タムタム 2","Tom tom II."],[15,"opll::opllpNoise","noise","ノイズ","Noise."]],Mt=[[1,"opll::vrc7BuzzyBell","lead","バジーベル。濁った鐘","Buzzy bell, a bell with grit in it."],[2,"opll::vrc7Guitar","lead","ギター","Guitar."],[3,"opll::vrc7Wurly","lead","ウーリッツァー。電気ピアノ","Wurlitzer electric piano."],[4,"opll::vrc7Flute","lead","フルート","Flute."],[6,"opll::vrc7Synth","lead","シンセ","Synth."],[8,"opll::vrc7Organ","chord","オルガン","Organ."],[9,"opll::vrc7Bells","lead","ベル","Bells."],[10,"opll::vrc7Vibes","lead","バイブス","Vibes."],[11,"opll::vrc7Vibraphone","lead","ビブラフォン","Vibraphone."],[12,"opll::vrc7Tutti","chord","トゥッティ。合奏","Tutti, the whole band at once."],[13,"opll::vrc7Fretless","bass","フレットレスベース","Fretless bass."],[14,"opll::vrc7SynthBass","bass","シンセベース","Synth bass."],[15,"opll::vrc7Sweep","lead","スイープ","Sweep."]],yt=new Set([1,5,6,8,10]),Lt={"opll::clarinet":["opll::opllpClarinet","opll::vrc7Clarinet"],"opll::trumpet":["opll::vrc7Trumpet"],"opll::vibraphone":["opll::opllpVibraphone"]},vt=[["bd","opll::kick","バスドラ。2 オペを両方使う、いちばん厚い打楽器","Bass drum, the only one that gets both operators."],["sd","opll::snare","スネア。ノイズと矩形の組み合わせ","Snare, noise crossed with a square."],["hh","opll::hat","ハイハット。金物の短いノイズ","Hi-hat, built from the short metallic noise."],["tom","opll::tom","タム。素のサイン波に近い","Tom, close to a plain sine."],["cym","opll::cymbal","シンバル。ハイハットと位相を分け合う","Cymbal, sharing its phase with the hi-hat."]],Et=[["opll::userKick",{mod:{ratio:1,depth:22,feedback:4,attack:15,decay:15,sustain:12,release:15},car:{ratio:0,attack:15,decay:7,sustain:0,release:7}},"Bass drum. The carrier runs an octave below what you write, so the body lands low while the modulator only clicks at the front. The click is kept small on purpose: with noise layered over it, this voice is the body. Play it at o2."],["opll::userSnare",{mod:{ratio:4,depth:18,feedback:6,attack:15,decay:13,sustain:2,release:10,half:!0},car:{ratio:1,attack:15,decay:10,sustain:0,release:8}},"Snare. The shell, not the wires: body around 250Hz and a woody crack above it. Lay PSG noise over the top for the snares. Play it at o3."],["opll::userHatClosed",{mod:{ratio:15,depth:6,feedback:7,attack:15,decay:10,sustain:0,release:6,half:!0},car:{ratio:13,attack:15,decay:15,sustain:0,release:15,half:!0}},"Closed hi-hat. Ratios of 15 against 13 give the metal its beating, and the carrier is cut off at once. Play it at o5."],["opll::userHatOpen",{mod:{ratio:15,depth:6,feedback:7,attack:15,decay:10,sustain:0,release:6,half:!0},car:{ratio:13,attack:15,decay:8,sustain:0,release:5,half:!0}},"Open hi-hat. The same metal as the closed one, held on instead of cut. Striking the closed hat chokes it, the way a foot on the pedal does. Play it at o5."],["opll::userTom",{mod:{ratio:2,depth:22,feedback:5,attack:15,decay:14,sustain:8,release:12,half:!0},car:{ratio:1,attack:15,decay:8,sustain:0,release:7}},"Tom. Pitched, so the note is the drum — write o3 for a floor tom and o4 for a rack tom."],["opll::userKickHat",{mod:{ratio:15,depth:4,feedback:7,attack:15,decay:15,sustain:10,release:12,half:!0,scaleRate:1},car:{ratio:1,attack:15,decay:9,sustain:0,release:8,scaleRate:1}},"Kick and hi-hat in one voice, for when they fall on the same beat. Write o2 for the kick and o8 for the hat."],["opll::userKickSnare",{mod:{ratio:3,depth:16,feedback:7,attack:15,decay:14,sustain:4,release:11,half:!0,scaleRate:1},car:{ratio:1,attack:15,decay:9,sustain:0,release:8,scaleRate:1}},"Kick and snare in one voice. Write o2 for the kick and o4 for the snare."],["opll::userSnareHat",{mod:{ratio:11,depth:10,feedback:7,attack:15,decay:13,sustain:0,release:9,half:!0,scaleRate:1},car:{ratio:3,attack:15,decay:10,sustain:0,release:8,half:!0,scaleRate:1}},"Snare and hi-hat in one voice. Write o4 for the snare and o6 for the hat."]],J=[["low",-12,"An octave down, 54.6Hz. Heavy and slack; it sits under everything."],["mid",0,"The pitch the real driver used, 109.2Hz. Tight and light."],["high",12,"An octave up, 218.5Hz. Hard and small. Lay noise over it and it reads as a snare."]],Q=[["12",[33,33,14,30,240,240,7,7],.279,"Aimed at a 12.5% pulse: thin and nasal. Two operators matched against the first sixteen partials, not a real duty cycle. About 16.7dB quieter than pulse(12) at the same v, so raise it or lower the rest."],["25",[33,33,14,29,240,240,7,7],.468,"Aimed at a 25% pulse: reedy, the common all-round chip voice. Two operators matched against the first sixteen partials, not a real duty cycle. About 12.2dB quieter than pulse(25) at the same v."],["50",[34,33,32,7,240,240,7,7],.817,"Aimed at a square wave: hollow and even. Two operators matched against the first sixteen partials, not a real duty cycle. About 7.3dB quieter than pulse(50) at the same v."]],d={vcurve:"3db",vsteps:16},wt=[5,2,19,0,176,182,3,89];function Ot(){for(let[t,e,i,o,s]of kt)try{g(e,t,{...d,role:i,tags:["msx"],descJa:null,desc:s,steal:yt.has(t)?"ok":"avoid",alias:Lt[e]})}catch{}for(let[t,e,i]of[[2,At,"msx"],[1,Mt,"nes"]])for(let[o,s,a,c,h]of e)try{g(s,o,{...d,role:a,set:t,tags:[i],descJa:c,desc:h})}catch{}for(let[t,e,i,o]of vt){if(t==="bd"){try{w(e,{desc:null,params:[{name:"pitch",default:"mid",desc:null,values:J.map(([s,,a])=>({value:s,desc:a}))}]})}catch{}for(let[s,a,c]of J)try{g(`${e}(${s})`,16,{...d,role:"perc",drum:t,semi:a,tags:["msx"],descJa:null,desc:null})}catch{}continue}try{g(e,16,{...d,role:"perc",drum:t,tags:["msx"],descJa:null,desc:o})}catch{}}try{w("opll::pulse",{desc:null,params:[{name:"width",default:"50",desc:null,values:Q.map(([t,,,e])=>({value:t,desc:e}))}]})}catch{}for(let[t,e,i,o]of Q)try{b(`opll::pulse(${t})`,{bytes:e},{...d,gain:i,role:"lead",tags:["msx"],desc:o})}catch{}try{b("opll::chopBass",{bytes:wt},{...d,role:"bass",tags:["msx"],desc:null})}catch{}for(let[t,e,i]of Et)try{b(t,e,{...d,role:"perc",tags:["msx"],desc:i,dev:["check"]})}catch{}}Ot();A();V();function L(t,e){let i=[57,57,57,57,77,102,128,153],o=t.diff*((e&7)*2+1)>>3,s=e&8?t.out-o:t.out+o;s=s<-32768?-32768:s>32767?32767:s;let a=t.diff*i[e&7]>>6;return a=a<127?127:a>24575?24575:a,t.out=s,t.diff=a,s}var Es=L.toString();function Z(){return{out:0,diff:127}}function tt(t){let e=Z(),i=new Int16Array(t.length*2);for(let o=0;o<t.length;o++)i[o*2]=L(e,t[o]>>4),i[o*2+1]=L(e,t[o]&15);return i}function et(t){let e=Z(),i=new Uint8Array(Math.ceil(t.length/2));for(let o=0;o<t.length;o++){let s=Math.max(-1,Math.min(1,t[o])),a=Math.round(s*32767),c=Rt(e,a);L(e,c),o&1?i[o>>1]|=c:i[o>>1]=c<<4}return i}function Rt(t,e){let i=e<t.out?8:0,o=Math.abs(e-t.out),s=Math.round((o*8/t.diff-1)/2);s=s<0?0:s>7?7:s;let a=s,c=1/0;for(let h=Math.max(0,s-1);h<=Math.min(7,s+1);h++){let x=t.diff*(h*2+1)>>3,f=Math.abs(o-Math.min(x,i?t.out+32768:32767-t.out));f<c&&(c=f,a=h)}return i|a}var p=globalThis.MMSXX.sound.core["pcmbake.js"],Os=p.MIN_LOOP,Rs=p.bakeOps,Ps=p.bakePlan,st=p.bakeSourceOf,Ts=p.loopPlan,Cs=p.midiToFreq,_s=p.periodMultiple,Ns=p.pitchSet;var it=8e3,rt=3e3,ot=16e3,C=2,Pt=48e3;function Tt(t,e,i=1){let o=0;for(let n=0;n<t.length;n++)o=Math.max(o,Math.abs(t[n])/C);let s=1/C;o>1&&i>0&&(s*=Math.pow(o,-Math.min(1,i)));let a=et(Float32Array.from(t,n=>n*s)),c=tt(a),h=Math.max(1,Math.ceil(Pt/e)),x=new Float32Array(t.length*h),f=0;for(let n=0;n<t.length;n++){let v=(c[n]+f)/2/32768*C;f=c[n],x.fill(v,n*h,(n+1)*h)}return{data:x,sampleRate:e*h,bytes:a.length}}function Ct(t,e={},i={}){if(!e.from&&!e.phrase)throw new Error("[ChpTnSnd] "+t+": 焼く元の音色(from)か、フレーズ(phrase)がありません");if(e.from&&e.phrase)throw new Error("[ChpTnSnd] "+t+": from と phrase はどちらか 1 つだけ書きます");let o=e.rate??it,s=Math.round(Math.max(rt,Math.min(ot,Number(o)||it)));s!==o&&O(`[ChpTnSnd] ${t}: ADPCM のレートは ${rt}〜${ot}Hz です(${o} → ${s})`);let a=e.length>0?Number(e.length):1,c=e.fit===void 0?1:Math.max(0,Math.min(1,Number(e.fit)));e.fit!==void 0&&c!==Number(e.fit)&&O(`[ChpTnSnd] ${t}: @oplpcm の fit は 0〜1 です(${e.fit} → ${c})`);let x=`Baked from ${e.phrase?"a phrase":e.from} and played as 4-bit ADPCM-B at ${s}Hz, the way the Y8950 (MSX-AUDIO) plays samples. o4c plays it at the baked speed; other notes change the speed.`+(e.desc?" "+e.desc:null),f=F(t,{...e,desc:x,octaves:[4],step:12,sampleRate:s,loop:!1,length:a,...e.phrase?{phrase:e.phrase,tempo:e.tempo}:{},vsteps:256,vcurve:"linear",post:(n,v)=>Tt(n,v,c)},i);return N[f].defaultEnv=0,f}m("oplpcm",(t,e,i)=>Ct(t,st(t,e,"oplpcm",["fit"]),i));var _t=3579545,Nt=`const CLK = ${_t};
const RATE = CLK / 72;
${M}
const EG_STEP_FAST = [
[1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 2, 1, 1, 1, 2],
[1, 2, 1, 2, 1, 2, 1, 2], [1, 2, 2, 2, 1, 2, 2, 2],
];
const EG_MUTE = 511;
const EG_MAX = 0x1f0;
const ATTACK = 0, DECAY = 1, SUSTAIN = 2, RELEASE = 3;
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
this.busy[ch] = now + ev.dur + 0.3;
this.off[ch] = now + ev.dur;
}
this.frac += this.step;
while (this.frac >= 1) {
this.prev = this.cur;
this.cur = this.chip.tick();
this.frac -= 1;
}
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
registerProcessor('mmsxx-opl', OplBank);`,at={mul:{at:"ml",max:15,desc:null},ksr:{at:"kr",max:1,desc:null},hold:{at:"eg",max:1,desc:null},vibrato:{at:"pm",max:1,desc:null},tremolo:{at:"am",max:1,desc:null},ksl:{at:"kl",max:3,desc:null},tl:{at:"tl",max:63,desc:null},fb:{at:"fb",max:7,modOnly:!0,desc:null},ar:{at:"ar",max:15,desc:null},dr:{at:"dr",max:15,desc:null},sl:{at:"sl",max:15,desc:null},rr:{at:"rr",max:15,desc:null}},ct={ratio:"mul",harmonic:"mul",depth:"tl",level:"tl",attack:"ar",decay:"dr",sustain:"sl",release:"rr",feedback:"fb",scale:"ksl",scaleRate:"ksr",sustaining:"hold"};function S(t){throw new Error(`[ChpTnSnd] OPL の音色: ${t}`)}function _(t,e,i,o){let s=t===!0?e:t===!1?0:Number(t);return(!Number.isFinite(s)||s<0||s>e||s!==Math.floor(s))&&S(`${o} の "${i}" は 0〜${e} の整数です(${t} と書いてあります)`),s}function ht(t,e,i){let o={ml:0,kr:0,eg:0,pm:0,am:0,kl:0,tl:0,fb:0,ar:0,dr:0,sl:0,rr:0};for(let[s,a]of Object.entries(t||{})){let c=ct[s]??s,h=at[c];if(!h){(c==="wave"||c==="half")&&S("OPL の波形はサイン波だけです(半波整流は OPLL にしかありません)");let x=[...Object.keys(at),...Object.keys(ct)].sort().join(" ");S(`${e} に "${s}" は書けません(書けるもの: ${x})`)}h.modOnly&&!i&&S(`"${s}" は変調側(mod)にだけ書けます`),o[h.at]=_(a,h.max,s,e)}return o}function Ft(t={}){let e=ht(t.mod,"mod",!0),i=ht(t.car,"car",!1);t.feedback!==void 0&&(e.fb=_(t.feedback,7,"feedback","この音色"));let o=t.connect===void 0?0:_(t.connect,1,"connect","この音色");for(let a of Object.keys(t))["mod","car","feedback","connect"].includes(a)||S(`"${a}" は書けません(mod car feedback connect)`);let s=a=>[a.am<<7|a.pm<<6|a.eg<<5|a.kr<<4|a.ml,a.kl<<6|a.tl,a.ar<<4|a.dr,a.sl<<4|a.rr];return{m:s(e),c:s(i),fbc:e.fb<<1|o}}function Dt(t,e,i={}){return k(t,"opl",{patch:Ft(e)},{vsteps:16,vcurve:"3db",...i})}var nt={kind:"opl",node:"mmsxx-opl",code:Nt,event:(t,e,i,o,s,a)=>({t:s,dur:Math.max(.01,a-s-(t.relTail||0)),freq:i,v:t.vol,patch:e.patch})};m("opl",(t,e,i)=>Dt(t,e,i));y(nt.kind,nt);A();})();
