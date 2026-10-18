var MMSXX;((MMSXX||={}).sound||={}).opm=(()=>{var t=globalThis.MMSXX.sound.core["mml.js"],X=t.AY_ENV_SHAPES,j=t.AY_MODES,H=t.DEFAULT_ENV,Q=t.DEFAULT_WAVE,z=t.DEV_MARKS,Z=t.DRUM_FREQ,t1=t.ENVELOPES,e1=t.HEAD_MARK,s1=t.NES_MODES,r1=t.NOISE_VARIANTS,o1=t.ROLES,i1=t.SPECIALS,n1=t.STEALS,c1=t.TUNINGS,l1=t.VCURVES,a1=t.VIB_MAX,p1=t.VIB_SPEED,d1=t.WAVE,f1=t.WAVEFORMS,d=t.badVoice,h1=t.compileMML,x1=t.countOldStyle,u1=t.describeVoice,m1=t.dutyLfoAt,g1=t.dutyMoves,k1=t.envRunLen,E1=t.envSec,A1=t.findWave,S1=t.firstTempo,O1=t.isSystemMark,b1=t.listEnvelopes,v1=t.listVoiceFamilies,M1=t.listVoices,w1=t.metaOf,y1=t.noOldDescName,L1=t.readBundles,T1=t.readChordSets,P1=t.readDirectives,C1=t.readDrums,F1=t.readVoices,_1=t.readWaves,R1=t.registerAY,N1=t.registerAnalog,k=t.registerBaked,V1=t.registerBeep,D1=t.registerBrass,U1=t.registerCoreFamilies,I1=t.registerDrumSlots,G1=t.registerEnvelope,W1=t.registerFDS,B1=t.registerFM,$1=t.registerFamily,K1=t.registerLayer,q1=t.registerModal,Y1=t.registerNES,J1=t.registerNoiseVariants,X1=t.registerOPNARhythm,j1=t.registerPCE,H1=t.registerSCC,E=t.registerVoice,Q1=t.registerVoiceDetail,A=t.registerVoiceSyntax,z1=t.registerWave,Z1=t.roleOf,S=t.sealPresets,tt=t.shareBundles,et=t.slideAt,st=t.songParts,O=t.splitParts,rt=t.splitVoices,ot=t.stealOf,it=t.toneOf,nt=t.validateMML,ct=t.voiceArgs,lt=t.voiceName,at=t.voiceNameProblem,pt=t.voiceNums,dt=t.volFromGain,ft=t.volGainOf,ht=t.warn,xt=t.waveMeta,ut=t.waveRole,mt=t.waveSteal;var u=globalThis.MMSXX.sound.core["layerpresets.js"],kt=u.LAYER_PRESETS,Et=u.layerPairFamily,b=u.registerDefaultLayers;var a=globalThis.MMSXX.sound.core["audio.js"],St=a.ChipTuneSound,Ot=a.SE_SYS_PAUSE,bt=a.SOUND_VERSION,vt=a.ampFor,Mt=a.encodeWAV,v=a.fadeGain,M=a.freqAt,wt=a.psgDiv,w=a.registerChipKind,yt=a.snapVol,Lt=a.volAt;var x=globalThis.MMSXX.sound.core["tones.js"],m=x.TONE_FRAME,Pt=x.TONE_PRESETS,Ct=x.readTable,Ft=x.registerDefaultTones,_t=x.registerTone;var F=3579545,T=F/64,_=`const SIN = new Uint16Array(256);
for (let x = 0; x < 256; x++) {
SIN[x] = Math.round(-Math.log2(Math.sin((x + 0.5) * Math.PI / 512)) * 256);
}
const POW = new Uint16Array(256);
for (let i = 0; i < 256; i++) {
POW[i] = ((Math.round((Math.pow(2, (255 - i) / 256) - 1) * 1024)) | 0x400) << 2;
}
const WAVE = new Uint16Array(1024);
for (let i = 0; i < 1024; i++) {
const half = (i & 0x100) ? (~i & 0xff) : (i & 0xff);
WAVE[i] = SIN[half] | (((i >> 9) & 1) << 15);
}
const PSTEP = Uint32Array.from([
1299,1300,1301,1302,1303,1304,1305,1306,1308,1309,1310,1311,1313,1314,1315,1316,1318,1319,1320,1321,1322,1323,1324,1325,
1327,1328,1329,1330,1332,1333,1334,1335,1337,1338,1339,1340,1341,1342,1343,1344,1346,1347,1348,1349,1351,1352,1353,1354,
1356,1357,1358,1359,1361,1362,1363,1364,1366,1367,1368,1369,1371,1372,1373,1374,1376,1377,1378,1379,1381,1382,1383,1384,
1386,1387,1388,1389,1391,1392,1393,1394,1396,1397,1398,1399,1401,1402,1403,1404,1406,1407,1408,1409,1411,1412,1413,1414,
1416,1417,1418,1419,1421,1422,1423,1424,1426,1427,1429,1430,1431,1432,1434,1435,1437,1438,1439,1440,1442,1443,1444,1445,
1447,1448,1449,1450,1452,1453,1454,1455,1458,1459,1460,1461,1463,1464,1465,1466,1468,1469,1471,1472,1473,1474,1476,1477,
1479,1480,1481,1482,1484,1485,1486,1487,1489,1490,1492,1493,1494,1495,1497,1498,1501,1502,1503,1504,1506,1507,1509,1510,
1512,1513,1514,1515,1517,1518,1520,1521,1523,1524,1525,1526,1528,1529,1531,1532,1534,1535,1536,1537,1539,1540,1542,1543,
1545,1546,1547,1548,1550,1551,1553,1554,1556,1557,1558,1559,1561,1562,1564,1565,1567,1568,1569,1570,1572,1573,1575,1576,
1578,1579,1580,1581,1583,1584,1586,1587,1590,1591,1592,1593,1595,1596,1598,1599,1601,1602,1604,1605,1607,1608,1609,1610,
1613,1614,1615,1616,1618,1619,1621,1622,1624,1625,1627,1628,1630,1631,1632,1633,1637,1638,1639,1640,1642,1643,1645,1646,
1648,1649,1651,1652,1654,1655,1656,1657,1660,1661,1663,1664,1666,1667,1669,1670,1672,1673,1675,1676,1678,1679,1681,1682,
1685,1686,1688,1689,1691,1692,1694,1695,1697,1698,1700,1701,1703,1704,1706,1707,1709,1710,1712,1713,1715,1716,1718,1719,
1721,1722,1724,1725,1727,1728,1730,1731,1734,1735,1737,1738,1740,1741,1743,1744,1746,1748,1749,1751,1752,1754,1755,1757,
1759,1760,1762,1763,1765,1766,1768,1769,1771,1773,1774,1776,1777,1779,1780,1782,1785,1786,1788,1789,1791,1793,1794,1796,
1798,1799,1801,1802,1804,1806,1807,1809,1811,1812,1814,1815,1817,1819,1820,1822,1824,1825,1827,1828,1830,1832,1833,1835,
1837,1838,1840,1841,1843,1845,1846,1848,1850,1851,1853,1854,1856,1858,1859,1861,1864,1865,1867,1868,1870,1872,1873,1875,
1877,1879,1880,1882,1884,1885,1887,1888,1891,1892,1894,1895,1897,1899,1900,1902,1904,1906,1907,1909,1911,1912,1914,1915,
1918,1919,1921,1923,1925,1926,1928,1930,1932,1933,1935,1937,1939,1940,1942,1944,1946,1947,1949,1951,1953,1954,1956,1958,
1960,1961,1963,1965,1967,1968,1970,1972,1975,1976,1978,1980,1982,1983,1985,1987,1989,1990,1992,1994,1996,1997,1999,2001,
2003,2004,2006,2008,2010,2011,2013,2015,2017,2019,2021,2022,2024,2026,2028,2029,2032,2033,2035,2037,2039,2041,2043,2044,
2047,2048,2050,2052,2054,2056,2058,2059,2062,2063,2065,2067,2069,2071,2073,2074,2077,2078,2080,2082,2084,2086,2088,2089,
2092,2093,2095,2097,2099,2101,2103,2104,2107,2108,2110,2112,2114,2116,2118,2119,2122,2123,2125,2127,2129,2131,2133,2134,
2137,2139,2141,2142,2145,2146,2148,2150,2153,2154,2156,2158,2160,2162,2164,2165,2168,2170,2172,2173,2176,2177,2179,2181,
2185,2186,2188,2190,2192,2194,2196,2197,2200,2202,2204,2205,2208,2209,2211,2213,2216,2218,2220,2222,2223,2226,2227,2230,
2232,2234,2236,2238,2239,2242,2243,2246,2249,2251,2253,2255,2256,2259,2260,2263,2265,2267,2269,2271,2272,2275,2276,2279,
2281,2283,2285,2287,2288,2291,2292,2295,2297,2299,2301,2303,2304,2307,2308,2311,2315,2317,2319,2321,2322,2325,2326,2329,
2331,2333,2335,2337,2338,2341,2342,2345,2348,2350,2352,2354,2355,2358,2359,2362,2364,2366,2368,2370,2371,2374,2375,2378,
2382,2384,2386,2388,2389,2392,2393,2396,2398,2400,2402,2404,2407,2410,2411,2414,2417,2419,2421,2423,2424,2427,2428,2431,
2433,2435,2437,2439,2442,2445,2446,2449,2452,2454,2456,2458,2459,2462,2463,2466,2468,2470,2472,2474,2477,2480,2481,2484,
2488,2490,2492,2494,2495,2498,2499,2502,2504,2506,2508,2510,2513,2516,2517,2520,2524,2526,2528,2530,2531,2534,2535,2538,
2540,2542,2544,2546,2549,2552,2553,2556,2561,2563,2565,2567,2568,2571,2572,2575,2577,2579,2581,2583,2586,2589,2590,2593
], (v) => v * 32);
const INC = Uint32Array.from([
0x00000000,0x00000000,0x10101010,0x10101010,0x10101010,0x10101010,0x11101110,0x11101110,
0x10101010,0x10111010,0x11101110,0x11111110,0x10101010,0x10111010,0x11101110,0x11111110,
0x10101010,0x10111010,0x11101110,0x11111110,0x10101010,0x10111010,0x11101110,0x11111110,
0x10101010,0x10111010,0x11101110,0x11111110,0x10101010,0x10111010,0x11101110,0x11111110,
0x10101010,0x10111010,0x11101110,0x11111110,0x10101010,0x10111010,0x11101110,0x11111110,
0x10101010,0x10111010,0x11101110,0x11111110,0x10101010,0x10111010,0x11101110,0x11111110,
0x11111111,0x21112111,0x21212121,0x22212221,0x22222222,0x42224222,0x42424242,0x44424442,
0x44444444,0x84448444,0x84848484,0x88848884,0x88888888,0x88888888,0x88888888,0x88888888
]);
const DET = Uint8Array.from([
0,0,1,2,0,0,1,2,0,0,1,2,0,0,1,2,0,1,2,2,0,1,2,3,0,1,2,3,0,1,2,3,
0,1,2,4,0,1,3,4,0,1,3,4,0,1,3,5,0,2,4,5,0,2,4,6,0,2,4,6,0,2,5,7,
0,2,5,8,0,3,6,8,0,3,6,9,0,3,7,10,0,4,8,11,0,4,8,12,0,4,9,13,0,5,10,14,
0,5,11,16,0,6,12,17,0,6,13,19,0,7,14,20,0,8,16,22,0,8,16,22,0,8,16,22,0,8,16,22
]);
const LFOW = [];
for (let w = 0; w < 4; w++) LFOW.push(new Int16Array(256));
for (let i = 0; i < 256; i++) {
let am, pm;
am = i ^ 0xff; pm = i;                                  // 0 のこぎり
LFOW[0][i] = (am | (pm << 8)) << 16 >> 16;
am = (i & 0x80) ? 0 : 0xff; pm = am ^ 0x80;             // 1 矩形
LFOW[1][i] = (am | (pm << 8)) << 16 >> 16;
am = ((i & 0x80) ? (i << 1) : ((i ^ 0xff) << 1)) & 0xff; // 2 三角
pm = ((i & 0x40) ? am : ~am) & 0xff;
LFOW[2][i] = (am | (pm << 8)) << 16 >> 16;
}
const DT2 = [0, 384, 500, 608];
const ALG = [
[1, 2, 3, 0, 0, 0],
[0, 5, 3, 0, 0, 0],
[0, 2, 6, 0, 0, 0],
[1, 0, 7, 0, 0, 0],
[1, 0, 3, 0, 1, 0],
[1, 1, 1, 0, 1, 1],
[1, 0, 0, 0, 1, 1],
[0, 0, 0, 1, 1, 1],
];
const OPOF = [0, 16, 8, 24];
const CARRIER = [[3], [3], [3], [3], [1, 3], [1, 2, 3], [1, 2, 3], [0, 1, 2, 3]];
const EG_ATTACK = 1, EG_DECAY = 2, EG_SUSTAIN = 3, EG_RELEASE = 4;
const EG_QUIET = 0x380;
/** 減衰(5.8)から振幅(13 ビット)へ */
const toLinear = (x) => POW[x & 0xff] >>> (x >> 8);
/** キーコードと深さからデチューンの量 */
function detuneOf(dt, kc) {
const v = DET[kc * 4 + (dt & 3)];
return (dt & 4) ? -v : v;
}
/** 速さに KSR を足す。0 のときは 0 のまま */
const effRate = (raw, ksr) => (raw === 0 ? 0 : Math.min(raw + ksr, 63));
/**
* ブロックとキーコードと端数から、1 サンプルぶんの位相の進み。
*
* キーコードは 1 オクターブに 16 の枠を取って 12 個しか使っていないので、
* 4 分の 1 を引いて詰めてから表を引く(原典どおり)。
*/
function stepOf(blockFreq, delta) {
let block = (blockFreq >> 10) & 7;
const code = ((blockFreq >> 6) & 15) - ((blockFreq >> 8) & 3);
let eff = ((code << 6) | (blockFreq & 63)) + delta;
if (eff >>> 0 >= 768) {
if (eff < 0) {
eff += 768;
if (block-- === 0) return PSTEP[0] >>> 7;
} else {
eff -= 768;
if (eff >= 768) { block++; eff -= 768; }
if (block++ >= 7) return PSTEP[767];
}
}
return PSTEP[eff] >>> (block ^ 7);
}
/**
* 出口の丸め。
*
* YM2151 は外付けの DAC(YM3012)へ浮動小数の形で渡していて、
* 小さい音ほど下の桁が落ちる。ここを入れないと静かなところが澄みすぎる。
*/
function roundFp(v) {
if (v < -32768) return -32768;
if (v > 32767) return 32767;
const scan = v ^ (v >> 31);
let exp = 7 - Math.clz32(scan << 17);
if (exp < 1) exp = 1;
exp -= 1;
return v & ~((1 << exp) - 1);
}
class OPM {
constructor() {
this.reg = new Uint8Array(256);
this.reg.fill(0xc0, 0x20, 0x28);          // 出口は左右とも開けておく
this.phase = new Uint32Array(32);
this.att = new Uint16Array(32);
this.state = new Uint8Array(32);
this.keyState = new Uint8Array(32);
this.keyLive = new Uint8Array(32);
this.att.fill(0x3ff);
this.state.fill(EG_RELEASE);
this.cStep = new Uint32Array(32);
this.cDyn = new Uint8Array(32);
this.cTL = new Uint16Array(32);
this.cSus = new Uint16Array(32);
this.cRate = new Uint8Array(32 * 6);
this.cDet = new Int16Array(32);
this.cMul = new Uint8Array(32);
this.cBF = new Uint16Array(32);
this.fb0 = new Int32Array(8);
this.fb1 = new Int32Array(8);
this.fbIn = new Int32Array(8);
this.envCount = 0;
this.lfoCount = 0;
this.lfoAm = 0;
this.noiseLfsr = 1;
this.noiseCount = 0;
this.noiseState = 0;
this.dirty = true;
this.prepCount = 0;
}
write(addr, data) {
addr &= 0xff;
if (addr === 0x19) this.reg[0x19 + (data >> 7)] = data;
else if (addr !== 0x1a) this.reg[addr] = data;
if (addr === 0x08) {
const ch = data & 7, mask = (data >> 3) & 15;
for (let n = 0; n < 4; n++) this.keyLive[ch + OPOF[n]] = (mask >> n) & 1;
}
this.dirty = true;
}
/** 音色と音程から、そのオペレータぶんの前計算 */
cacheOp(ch, op) {
const r = this.reg;
const bf = ((r[0x28 + ch] & 0x7f) << 6) | ((r[0x30 + ch] >> 2) & 0x3f);
this.cBF[op] = bf;
const kc = (bf >> 8) & 0x1f;
this.cDet[op] = detuneOf((r[0x40 + op] >> 4) & 7, kc);
let mul = (r[0x40 + op] & 15) * 2;
if (mul === 0) mul = 1;
this.cMul[op] = mul;
this.cTL[op] = (r[0x60 + op] & 0x7f) << 3;
let sus = (r[0xe0 + op] >> 4) & 15;
sus |= (sus + 1) & 0x10;                  // 15 は 31 の意味になる
this.cSus[op] = sus << 5;
const ksr = kc >>> (((r[0x80 + op] >> 6) & 3) ^ 3);
const b = op * 6;
this.cRate[b + EG_ATTACK] = effRate((r[0x80 + op] & 0x1f) * 2, ksr);
this.cRate[b + EG_DECAY] = effRate((r[0xa0 + op] & 0x1f) * 2, ksr);
this.cRate[b + EG_SUSTAIN] = effRate((r[0xc0 + op] & 0x1f) * 2, ksr);
this.cRate[b + EG_RELEASE] = effRate((r[0xe0 + op] & 15) * 4 + 2, ksr);
const pmDepth = r[0x1a] & 0x7f, pmSens = (r[0x38 + ch] >> 4) & 7;
if (pmDepth === 0 || pmSens === 0) {
this.cDyn[op] = 0;
this.cStep[op] = this.stepFor(ch, op, 0);
} else {
this.cDyn[op] = 1;
}
}
stepFor(ch, op, rawPm) {
const r = this.reg;
let delta = DT2[(r[0xc0 + op] >> 6) & 3];
const sens = (r[0x38 + ch] >> 4) & 7;
if (sens !== 0) {
if (sens < 6) delta += rawPm >> (6 - sens);
else delta += rawPm << (sens - 5);
}
let step = stepOf(this.cBF[op], delta);
step = (step + this.cDet[op]) >>> 0;
return ((step * this.cMul[op]) >>> 1) >>> 0;
}
startAttack(op) {
if (this.state[op] === EG_ATTACK) return;
this.state[op] = EG_ATTACK;
this.phase[op] = 0;
if (this.cRate[op * 6 + EG_ATTACK] >= 62) this.att[op] = 0;
}
prepare() {
for (let ch = 0; ch < 8; ch++) {
for (let n = 0; n < 4; n++) {
const op = ch + OPOF[n];
this.cacheOp(ch, op);
const on = this.keyLive[op] ? 1 : 0;
if (on !== this.keyState[op]) {
this.keyState[op] = on;
if (on) this.startAttack(op);
else if (this.state[op] < EG_RELEASE) this.state[op] = EG_RELEASE;
}
}
}
}
/** エンベロープを 1 段進める */
clockEnv(op, count) {
if (this.state[op] === EG_ATTACK && this.att[op] === 0) this.state[op] = EG_DECAY;
if (this.state[op] === EG_DECAY && this.att[op] >= this.cSus[op]) this.state[op] = EG_SUSTAIN;
const rate = this.cRate[op * 6 + this.state[op]];
const shift = rate >> 2;
const c = (count * Math.pow(2, shift)) >>> 0;
if ((c & 0x7ff) !== 0) return;
const bits = (c >>> (shift <= 11 ? 11 : shift)) & 7;
const inc = (INC[rate] >>> (4 * bits)) & 15;
if (this.state[op] === EG_ATTACK) {
if (rate < 62) this.att[op] += (~this.att[op] * inc) >> 4;
} else {
let a = this.att[op] + inc;
if (a >= 0x400) a = 0x3ff;
this.att[op] = a;
}
}
/** ノイズと LFO。返すのは音程を揺らす量 */
clockNoiseLfo() {
const r = this.reg;
const nf = (r[0x0f] & 0x1f) ^ 0x1f;
for (let rep = 0; rep < 2; rep++) {
this.noiseLfsr = (this.noiseLfsr << 1) >>> 0;
this.noiseLfsr = (this.noiseLfsr
| (((this.noiseLfsr >>> 17) ^ (this.noiseLfsr >>> 14) ^ 1) & 1)) >>> 0;
if (this.noiseCount++ >= nf) {
this.noiseCount = 0;
this.noiseState = (this.noiseLfsr >>> 17) & 1;
}
}
const rate = r[0x18];
this.lfoCount = (this.lfoCount + ((0x10 | (rate & 15)) * Math.pow(2, rate >> 4))) % 4294967296;
if (r[0x01] & 2) this.lfoCount = 0;
const lfo = (Math.floor(this.lfoCount / 4194304)) & 0xff;
const n8 = (this.noiseLfsr >>> 17) & 0xff;
LFOW[3][(lfo + 1) & 0xff] = (n8 | (n8 << 8)) << 16 >> 16;
const ampm = LFOW[r[0x1b] & 3][lfo];
this.lfoAm = ((ampm & 0xff) * (r[0x19] & 0x7f)) >> 7;
return ((ampm >> 8) * (r[0x1a] & 0x7f)) >> 7;
}
/** そのチャンネルの AM の掛かり具合 */
amOffset(ch) {
const sens = this.reg[0x38 + ch] & 3;
return sens === 0 ? 0 : this.lfoAm << (sens - 1);
}
/** オペレータ 1 本ぶんの出力(14 ビット符号つき) */
opOut(op, ph, am) {
if (this.att[op] > EG_QUIET) return 0;
const sa = WAVE[ph & 0x3ff];
let env = this.att[op] + this.cTL[op];
if (this.reg[0xa0 + op] & 0x80) env += am;
if (env > 0x3ff) env = 0x3ff;
const v = toLinear((sa & 0x7fff) + (env << 2));
return (sa & 0x8000) ? -v : v;
}
/** 1 サンプル進める */
tick() {
if (this.dirty || this.prepCount++ >= 4096) {
this.prepare();
this.dirty = false;
this.prepCount = 0;
}
this.envCount++;
if ((this.envCount & 3) === 3) this.envCount += 1;
const rawPm = this.clockNoiseLfo();
for (let ch = 0; ch < 8; ch++) {
this.fb0[ch] = this.fb1[ch];
this.fb1[ch] = this.fbIn[ch];
for (let n = 0; n < 4; n++) {
const op = ch + OPOF[n];
if ((this.envCount & 3) === 0) this.clockEnv(op, this.envCount >> 2);
const step = this.cDyn[op] ? this.stepFor(ch, op, rawPm) : this.cStep[op];
this.phase[op] = (this.phase[op] + step) >>> 0;
}
}
}
/** 全チャンネルを足して出す */
out() {
let sum = 0;
const noiseOn = (this.reg[0x0f] & 0x80) !== 0;
for (let ch = 0; ch < 8; ch++) {
const am = this.amOffset(ch);
const alg = ALG[this.reg[0x20 + ch] & 7];
const fb = (this.reg[0x20 + ch] >> 3) & 7;
const o1 = ch + OPOF[0], o2 = ch + OPOF[1], o3 = ch + OPOF[2], o4 = ch + OPOF[3];
let mod = 0;
if (fb !== 0) mod = (this.fb0[ch] + this.fb1[ch]) >> (10 - fb);
const v1 = this.opOut(o1, (this.phase[o1] >>> 10) + mod, am);
this.fbIn[ch] = v1;
if (((this.reg[0x20 + ch] >> 6) & 3) === 0) continue;
const opout = [0, v1, 0, 0, 0, 0, 0, 0];
opout[2] = this.opOut(o2, (this.phase[o2] >>> 10) + (opout[alg[0]] >> 1), am);
opout[5] = opout[1] + opout[2];
opout[3] = this.opOut(o3, (this.phase[o3] >>> 10) + (opout[alg[1]] >> 1), am);
opout[6] = opout[1] + opout[3];
opout[7] = opout[2] + opout[3];
let r;
if (noiseOn && ch === 7) {
let env = this.att[o4] + this.cTL[o4];
if (this.reg[0xa0 + o4] & 0x80) env += am;
if (env > 0x3ff) env = 0x3ff;
r = (env ^ 0x3ff) << 1;
if (this.noiseState) r = -r;
} else {
r = this.opOut(o4, (this.phase[o4] >>> 10) + (opout[alg[2]] >> 1), am);
}
if (alg[3]) r += opout[1];
if (alg[4]) r += opout[2];
if (alg[5]) r += opout[3];
sum += r;
}
return roundFp(sum) / 32768;
}
}
/**
* 常駐して全部の声を回す。
*
* 中にチップを何個でも持つ(sound/ay.js と同じ考え方)。前は 1 個の 8 声を取り合い、
* 9 音目でいちばん古い音を止めていたが、ほかのチップと同じく数は縛らない(2026-10-05)。
*
* LFO はチップに 1 つで、8 声が分け合う。音色ごとに設定が違えば、別のチップに載せる。
* ノイズはチャンネル 8 だけが出せる。実機の制約は、書き出すときに見る。
*/
class OpmBank extends AudioWorkletProcessor {
constructor(o) {
super();
const q = o.processorOptions || {};
this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
this.at = 0;
this.pool = [];
this.log = !!q.log;
this.logNow = 0;
this.acc = 0;
this.base = currentTime;
this.cutAt = -1;
this.port.onmessage = (e) => {
if (e.data && e.data.cut) { this.cut(); return; }
const add = e.data && e.data.add;
if (!add || !add.length) return;
this.cutAt = -1;
for (let i = 0; i < add.length; i++) this.events.push(add[i]);
this.events.sort((a, b) => a.t - b.t);
};
}
/** LFO の設定を文字にする。同じなら同じチップに載せられる */
lfoKey(p) {
const l = p.lfo;
return l ? (l.rate | 0) + '.' + (l.amd | 0) + '.' + (l.pmd | 0) + '.' + (l.wf | 0) : '';
}
grow() {
const c = new OPM();
const chip = { c, key: null, busy: [], fading: [], gliding: [], log: null, quiet: true, noise: false };
if (this.log) {
const raw = c.write.bind(c);
chip.log = [];
c.write = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
}
c.write(0x0f, 0);
this.pool.push(chip);
return chip;
}
/** LFO を書く(速さ・音量の深さ・音程の深さ・波形) */
setLfo(chip, key, p) {
const l = p.lfo || { rate: 0, amd: 0, pmd: 0, wf: 0 };
const c = chip.c;
c.write(0x18, l.rate & 0xff);
c.write(0x19, l.amd & 0x7f);
c.write(0x19, 0x80 | (l.pmd & 0x7f));
c.write(0x1b, l.wf & 3);
chip.key = key;
}
/**
* 止める。溜めたイベントを捨てて、鳴っている声を黙らせる。
*
* キーオフを書くだけでは、チップの RR のぶん鳴り続ける。実機ではそれが
* 正しいが、シークも停止もポーズも実機に無い操作なので消す
* (docs/BUGS.md の線引き)。出口を 10 ミリ秒で落とす。
*/
cut() {
this.events.length = 0;
this.at = 0;
for (const chip of this.pool) {
for (const b of chip.busy) chip.c.write(0x08, b.ch);
chip.busy.length = 0;
chip.fading.length = 0;
chip.gliding.length = 0;
}
if (this.cutAt < 0) this.cutAt = 0;
}
/**
* 鳴りきったか。キーオフのあとの余韻も含めて、全部のオペが黙っていれば true。
* TL を足した減衰で見る(TL 127 のオペは、エンベロープが残っていても聞こえない)
*/
silent(chip) {
if (chip.busy.length) return false;
const { att, cTL } = chip.c;
for (let i = 0; i < 32; i++) if (att[i] + cTL[i] < 0x3f0) return false;
return true;
}
/** そのチップの空いているチャンネル。ノイズは 8 本目だけ。ほかは 8 本目を後回しにする */
freeCh(chip, noise) {
const used = (ch) => chip.busy.some((b) => b.ch === ch);
if (noise) return used(7) ? -1 : 7;
for (let ch = 0; ch < 8; ch++) if (!used(ch)) return ch;
return -1;
}
/**
* 載せるチップとチャンネルを選ぶ。LFO の設定が同じチップを先に見る。
* 黙っているチップは、LFO を書き直して使い回す。どれも駄目ならチップを足す
*/
pick(p) {
const key = this.lfoKey(p);
const noise = p.noise != null;
for (const chip of this.pool) {
if (chip.key !== key) continue;
const ch = this.freeCh(chip, noise);
if (ch >= 0) return { chip, ch };
}
for (const chip of this.pool) {
if (!this.silent(chip)) continue;
this.setLfo(chip, key, p);
return { chip, ch: this.freeCh(chip, noise) };
}
const chip = this.grow();
this.setLfo(chip, key, p);
return { chip, ch: this.freeCh(chip, noise) };
}
start(ev) {
const p = ev.patch;
const { chip, ch } = this.pick(p);
chip.quiet = false;
chip.fading = chip.fading.filter((f) => f.ch !== ch);
if (ev.vs && ev.vs.length) chip.fading.push({ ch, list: ev.vs, at: 0, patch: p });
chip.gliding = chip.gliding.filter((f) => f.ch !== ch);
if (ev.ps && ev.ps.length) chip.gliding.push({ ch, list: ev.ps, at: 0 });
const c = chip.c;
if (ch === 7) {
const want = p.noise != null;
if (want) c.write(0x0f, 0x80 | (p.noise & 31));
else if (chip.noise) c.write(0x0f, 0);
chip.noise = want;
}
c.write(0x20 + ch, 0xc0 | ((p.fb & 7) << 3) | (p.alg & 7));
c.write(0x38 + ch, ((p.pms & 7) << 4) | (p.ams & 3));
const car = CARRIER[p.alg & 7];
for (let n = 0; n < 4; n++) {
const op = ch + OPOF[n];
const o = p.ops[n];
c.write(0x40 + op, ((o.dt1 & 7) << 4) | (o.mul & 15));
const tl = car.indexOf(n) >= 0 ? Math.min(127, (o.tl & 0x7f) + (ev.att || 0)) : (o.tl & 0x7f);
c.write(0x60 + op, tl);
c.write(0x80 + op, ((o.ks & 3) << 6) | (o.ar & 0x1f));
c.write(0xa0 + op, ((o.ame ? 1 : 0) << 7) | (o.d1r & 0x1f));
c.write(0xc0 + op, ((o.dt2 & 3) << 6) | (o.d2r & 0x1f));
c.write(0xe0 + op, ((o.d1l & 15) << 4) | (o.rr & 15));
}
c.write(0x28 + ch, ev.kc & 0x7f);
c.write(0x30 + ch, (ev.kf & 0x3f) << 2);
c.write(0x08, ch | 0x78);
chip.busy.push({ ch, off: ev.t + ev.dur });
}
/** 1 チップぶん、時刻 t までに来た書き直しとキーオフを片付ける */
step(chip, t) {
for (let k = chip.fading.length - 1; k >= 0; k--) {
const f = chip.fading[k];
while (f.at < f.list.length && f.list[f.at][0] <= t) {
const att = f.list[f.at++][1];
const car = CARRIER[f.patch.alg & 7];
for (const n of car) {
chip.c.write(0x60 + f.ch + OPOF[n], Math.min(127, (f.patch.ops[n].tl & 0x7f) + att));
}
}
if (f.at >= f.list.length) chip.fading.splice(k, 1);
}
for (let k = chip.gliding.length - 1; k >= 0; k--) {
const f = chip.gliding[k];
while (f.at < f.list.length && f.list[f.at][0] <= t) {
const [, kc, kf] = f.list[f.at++];
chip.c.write(0x28 + f.ch, kc & 0x7f);
chip.c.write(0x30 + f.ch, (kf & 0x3f) << 2);
}
if (f.at >= f.list.length) chip.gliding.splice(k, 1);
}
for (let k = chip.busy.length - 1; k >= 0; k--) {
if (chip.busy[k].off <= t) {
chip.c.write(0x08, chip.busy[k].ch);
chip.busy.splice(k, 1);
}
}
}
process(inputs, outputs) {
const out = outputs[0][0];
const sr = sampleRate;
const steps = ${T} / sr;
for (const chip of this.pool) if (!chip.quiet && this.silent(chip)) chip.quiet = true;
for (let i = 0; i < out.length; i++) {
const t = this.base + i / sr;
if (this.log) this.logNow = t;
while (this.at < this.events.length && this.events[this.at].t <= t) {
this.start(this.events[this.at++]);
}
for (const chip of this.pool) if (!chip.quiet) this.step(chip, t);
this.acc += steps;
let n = 0;
while (this.acc >= 1) { n++; this.acc -= 1; }
let v = 0;
for (const chip of this.pool) {
if (chip.quiet) continue;
for (let k = 0; k < n; k++) chip.c.tick();
v += chip.c.out();
}
if (this.cutAt >= 0) {
const len = Math.max(1, Math.round(sampleRate * 0.01));
v *= Math.max(0, 1 - this.cutAt / len);
this.cutAt++;
if (this.cutAt > len) { this.cutAt = len; v = 0; }
}
out[i] = v;
}
this.base += out.length / sr;
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
registerProcessor('mmsxx-opm', OpmBank);`;function R(e,s){let r=(e&127)<<6|s&63,i=r>>10&7,n=(r>>6&15)-(r>>8&3)<<6|r&63;return n<0||n>=768?null:V[n]*32*T/(1<<20)/(1<<7-i)}var f=null;function N(){let e=[];for(let s=0;s<128;s++)if((s&3)!==3)for(let r=0;r<64;r++){let i=R(s,r);i&&e.push({kc:s,kf:r,f:i})}return e.sort((s,r)=>s.f-r.f),e}function P(e){f||(f=N());let s=0,r=f.length-1;for(;s<r;){let o=s+r>>1;f[o].f<e?s=o+1:r=o}let i=f[s],c=f[Math.max(0,s-1)],n=Math.abs(i.f-e)<=Math.abs(c.f-e)?i:c;return{kc:n.kc,kf:n.kf}}var V=Uint32Array.from([1299,1300,1301,1302,1303,1304,1305,1306,1308,1309,1310,1311,1313,1314,1315,1316,1318,1319,1320,1321,1322,1323,1324,1325,1327,1328,1329,1330,1332,1333,1334,1335,1337,1338,1339,1340,1341,1342,1343,1344,1346,1347,1348,1349,1351,1352,1353,1354,1356,1357,1358,1359,1361,1362,1363,1364,1366,1367,1368,1369,1371,1372,1373,1374,1376,1377,1378,1379,1381,1382,1383,1384,1386,1387,1388,1389,1391,1392,1393,1394,1396,1397,1398,1399,1401,1402,1403,1404,1406,1407,1408,1409,1411,1412,1413,1414,1416,1417,1418,1419,1421,1422,1423,1424,1426,1427,1429,1430,1431,1432,1434,1435,1437,1438,1439,1440,1442,1443,1444,1445,1447,1448,1449,1450,1452,1453,1454,1455,1458,1459,1460,1461,1463,1464,1465,1466,1468,1469,1471,1472,1473,1474,1476,1477,1479,1480,1481,1482,1484,1485,1486,1487,1489,1490,1492,1493,1494,1495,1497,1498,1501,1502,1503,1504,1506,1507,1509,1510,1512,1513,1514,1515,1517,1518,1520,1521,1523,1524,1525,1526,1528,1529,1531,1532,1534,1535,1536,1537,1539,1540,1542,1543,1545,1546,1547,1548,1550,1551,1553,1554,1556,1557,1558,1559,1561,1562,1564,1565,1567,1568,1569,1570,1572,1573,1575,1576,1578,1579,1580,1581,1583,1584,1586,1587,1590,1591,1592,1593,1595,1596,1598,1599,1601,1602,1604,1605,1607,1608,1609,1610,1613,1614,1615,1616,1618,1619,1621,1622,1624,1625,1627,1628,1630,1631,1632,1633,1637,1638,1639,1640,1642,1643,1645,1646,1648,1649,1651,1652,1654,1655,1656,1657,1660,1661,1663,1664,1666,1667,1669,1670,1672,1673,1675,1676,1678,1679,1681,1682,1685,1686,1688,1689,1691,1692,1694,1695,1697,1698,1700,1701,1703,1704,1706,1707,1709,1710,1712,1713,1715,1716,1718,1719,1721,1722,1724,1725,1727,1728,1730,1731,1734,1735,1737,1738,1740,1741,1743,1744,1746,1748,1749,1751,1752,1754,1755,1757,1759,1760,1762,1763,1765,1766,1768,1769,1771,1773,1774,1776,1777,1779,1780,1782,1785,1786,1788,1789,1791,1793,1794,1796,1798,1799,1801,1802,1804,1806,1807,1809,1811,1812,1814,1815,1817,1819,1820,1822,1824,1825,1827,1828,1830,1832,1833,1835,1837,1838,1840,1841,1843,1845,1846,1848,1850,1851,1853,1854,1856,1858,1859,1861,1864,1865,1867,1868,1870,1872,1873,1875,1877,1879,1880,1882,1884,1885,1887,1888,1891,1892,1894,1895,1897,1899,1900,1902,1904,1906,1907,1909,1911,1912,1914,1915,1918,1919,1921,1923,1925,1926,1928,1930,1932,1933,1935,1937,1939,1940,1942,1944,1946,1947,1949,1951,1953,1954,1956,1958,1960,1961,1963,1965,1967,1968,1970,1972,1975,1976,1978,1980,1982,1983,1985,1987,1989,1990,1992,1994,1996,1997,1999,2001,2003,2004,2006,2008,2010,2011,2013,2015,2017,2019,2021,2022,2024,2026,2028,2029,2032,2033,2035,2037,2039,2041,2043,2044,2047,2048,2050,2052,2054,2056,2058,2059,2062,2063,2065,2067,2069,2071,2073,2074,2077,2078,2080,2082,2084,2086,2088,2089,2092,2093,2095,2097,2099,2101,2103,2104,2107,2108,2110,2112,2114,2116,2118,2119,2122,2123,2125,2127,2129,2131,2133,2134,2137,2139,2141,2142,2145,2146,2148,2150,2153,2154,2156,2158,2160,2162,2164,2165,2168,2170,2172,2173,2176,2177,2179,2181,2185,2186,2188,2190,2192,2194,2196,2197,2200,2202,2204,2205,2208,2209,2211,2213,2216,2218,2220,2222,2223,2226,2227,2230,2232,2234,2236,2238,2239,2242,2243,2246,2249,2251,2253,2255,2256,2259,2260,2263,2265,2267,2269,2271,2272,2275,2276,2279,2281,2283,2285,2287,2288,2291,2292,2295,2297,2299,2301,2303,2304,2307,2308,2311,2315,2317,2319,2321,2322,2325,2326,2329,2331,2333,2335,2337,2338,2341,2342,2345,2348,2350,2352,2354,2355,2358,2359,2362,2364,2366,2368,2370,2371,2374,2375,2378,2382,2384,2386,2388,2389,2392,2393,2396,2398,2400,2402,2404,2407,2410,2411,2414,2417,2419,2421,2423,2424,2427,2428,2431,2433,2435,2437,2439,2442,2445,2446,2449,2452,2454,2456,2458,2459,2462,2463,2466,2468,2470,2472,2474,2477,2480,2481,2484,2488,2490,2492,2494,2495,2498,2499,2502,2504,2506,2508,2510,2513,2516,2517,2520,2524,2526,2528,2530,2531,2534,2535,2538,2540,2542,2544,2546,2549,2552,2553,2556,2561,2563,2565,2567,2568,2571,2572,2575,2577,2579,2581,2583,2586,2589,2590,2593]);function l(e={}){let s=(i={})=>({ar:i.ar??31,d1r:i.d1r??0,d2r:i.d2r??0,rr:i.rr??7,d1l:i.d1l??0,tl:i.tl??0,ks:i.ks??0,mul:i.mul??1,dt1:i.dt1??0,dt2:i.dt2??0,ame:i.ame??0}),r=e.lfo;return{alg:e.alg??0,fb:e.fb??0,pms:e.pms??0,ams:e.ams??0,ops:[s(e.ops?.[0]),s(e.ops?.[1]),s(e.ops?.[2]),s(e.ops?.[3])],...r?{lfo:{rate:(r.rate??0)&255,amd:(r.amd??0)&127,pmd:(r.pmd??0)&127,wf:(r.wf??0)&3}}:{},...e.noise!=null?{noise:e.noise&31}:{}}}var D=[[3],[3],[3],[3],[1,3],[1,2,3],[1,2,3],[0,1,2,3]];function U(e){return e/2}function I(e,s=20){let r=D[(e?.alg??0)&7].map(o=>e.ops[o]),i=r.every(o=>o.d2r===0&&o.d1l<=10),c=Math.min(...r.map(o=>o.ar)),n=c>0?1067/2**(U(c)-1):1/0;return i&&n<s?"ok":"avoid"}function g(e,s,r={}){return E(e,"opm",{patch:s},{...r,steal:r.steal??I(s)})}function G(e,s){let r={ops:[{},{},{},{}]},i=new Set;for(let c of O(e)){let n=/^([A-Za-z]+[1-4]?)\s*(?:\{([^}]*)\})?\s*(-?\d+)?$/.exec(c.trim());(!n||n[2]===void 0&&n[3]===void 0)&&d(`[ChpTnSnd] MML: 音色 "${s}" の @opm の "${c.trim()}" は読めません(op1{…} lfo{…} か、alg 4 のように書きます)`);let o=n[1].toLowerCase();i.add(o);let p=/^op([1-4])$/.exec(o);p?(n[2]===void 0&&d(`[ChpTnSnd] MML: 音色 "${s}" の @opm の ${o} は ${o}{…} で書きます`),r.ops[Number(p[1])-1]=y(n[2],s,o,W)):o==="lfo"?(n[2]===void 0&&d(`[ChpTnSnd] MML: 音色 "${s}" の @opm の lfo は lfo{…} で書きます`),r.lfo=y(n[2],s,o,B)):["alg","fb","pms","ams","noise"].includes(o)?(n[3]===void 0&&d(`[ChpTnSnd] MML: 音色 "${s}" の @opm の ${o} は数で書きます`),r[o]=Number(n[3])):d(`[ChpTnSnd] MML: 音色 "${s}" の @opm に "${n[1]}" は書けません(書けるのは alg fb pms ams noise op1〜op4 lfo です)`)}return[1,2,3,4].some(c=>i.has("op"+c))||d(`[ChpTnSnd] MML: 音色 "${s}" の @opm にオペがありません(op1{…}〜op4{…} を書いてください)`),l(r)}var W={ar:"ar",d1r:"d1r",dr:"d1r",d2r:"d2r",sr:"d2r",rr:"rr",d1l:"d1l",sl:"d1l",tl:"tl",ks:"ks",mul:"mul",ml:"mul",dt1:"dt1",dt:"dt1",dt2:"dt2",ame:"ame",am:"ame"},B={rate:"rate",amd:"amd",pmd:"pmd",wf:"wf"};function y(e,s,r,i){let c={};for(let n of String(e).split(",")){let o=n.trim().split(/\s+/).filter(Boolean);if(!o.length)continue;(o.length!==2||!Number.isFinite(Number(o[1])))&&d(`[ChpTnSnd] MML: 音色 "${s}" の @opm の ${r}{${e}} は「名前 数」を \`,\` で区切って書きます`);let p=i[o[0].toLowerCase()];p||d(`[ChpTnSnd] MML: 音色 "${s}" の @opm の ${r} に "${o[0]}" は書けません(書けるのは ${Object.keys(i).join(" ")} です)`),c[p]=Number(o[1])}return c}A("opm",(e,s,r)=>g(e,G(s,e),r),{raw:!0});function $(e,s,r){let i=[],c=-1;for(let n=m;s+n<r;n+=m){let{kc:o,kf:p}=P(M(e,n)),h=o<<8|p;h!==c&&(c=h,i.push([s+n,o,p]))}return i}function K(e,s,r,i,c,n){let{kc:o,kf:p}=P(r),h=C=>Math.max(0,Math.round(-20*Math.log10(Math.max(1e-4,i*(e.fade?v(e,C):1)))/.75));return{t:c,dur:Math.max(.01,n-c-(e.relTail||0)),kc:o,kf:p,patch:s.patch,att:h(0),...e.fade?{vs:this._fadeSteps(e,c,n,h)}:{},...e.glide>0?{ps:$(e,c,n-(e.relTail||0))}:{}}}var L={kind:"opm",node:"mmsxx-opm",code:_,event:K,noTail:!0};w(L.kind,L);var q={"opn::brass":{descJa:null,role:"lead",desc:null,of:"主役のブラス。結線 2 + 帰還。いちばん耳に残る役",patch:l({alg:2,fb:5,ops:[{ar:17,d1r:8,d2r:0,rr:10,d1l:1,tl:29,ks:0,mul:1,dt1:2,dt2:0},{ar:17,d1r:8,d2r:0,rr:10,d1l:1,tl:33,ks:0,mul:1,dt1:6,dt2:0},{ar:18,d1r:9,d2r:0,rr:10,d1l:2,tl:37,ks:0,mul:2,dt1:3,dt2:0},{ar:17,d1r:6,d2r:0,rr:9,d1l:1,tl:0,ks:0,mul:1,dt1:5,dt2:0}]})},"opn::lead":{descJa:null,role:"lead",desc:null,of:"細めで前に出るリード",patch:l({alg:4,fb:4,ops:[{ar:25,d1r:12,d2r:0,rr:10,d1l:3,tl:34,ks:0,mul:3,dt1:2,dt2:0},{ar:23,d1r:7,d2r:0,rr:9,d1l:2,tl:0,ks:0,mul:1,dt1:6,dt2:0},{ar:25,d1r:14,d2r:0,rr:10,d1l:4,tl:38,ks:0,mul:2,dt1:3,dt2:0},{ar:23,d1r:6,d2r:0,rr:9,d1l:2,tl:4,ks:0,mul:1,dt1:5,dt2:0}]})},"opn::bass":{descJa:null,role:"bass",desc:null,of:"頭が立ってすぐ締まるベース。帰還を深めに",patch:l({alg:0,fb:5,ops:[{ar:27,d1r:16,d2r:0,rr:11,d1l:5,tl:31,ks:0,mul:1,dt1:1,dt2:0},{ar:27,d1r:15,d2r:0,rr:11,d1l:5,tl:33,ks:0,mul:2,dt1:6,dt2:0},{ar:27,d1r:14,d2r:0,rr:11,d1l:3,tl:32,ks:0,mul:1,dt1:1,dt2:0},{ar:27,d1r:11,d2r:0,rr:10,d1l:3,tl:0,ks:0,mul:1,dt1:5,dt2:0}]})},"opn::ep":{descJa:null,role:"chord",desc:null,of:"エレピ。高い比(11)で頭だけ鳴らして落とす",patch:l({alg:4,fb:0,ops:[{ar:27,d1r:22,d2r:0,rr:9,d1l:15,tl:31,ks:0,mul:11,dt1:2,dt2:0},{ar:25,d1r:8,d2r:0,rr:8,d1l:5,tl:0,ks:0,mul:1,dt1:6,dt2:0},{ar:27,d1r:13,d2r:0,rr:10,d1l:9,tl:38,ks:0,mul:1,dt1:2,dt2:0},{ar:24,d1r:7,d2r:0,rr:8,d1l:4,tl:3,ks:0,mul:2,dt1:5,dt2:0}]})},"opm::bell":{descJa:null,role:"counter",desc:null,of:"鐘。**半端な比**(3.5 / 7)。整数でないと鐘にならない",patch:l({alg:4,fb:3,ops:[{ar:27,d1r:14,d2r:0,rr:4,d1l:15,tl:32,ks:0,mul:2,dt1:2,dt2:3},{ar:27,d1r:12,d2r:0,rr:3,d1l:15,tl:0,ks:0,mul:1,dt1:6,dt2:0},{ar:27,d1r:15,d2r:0,rr:5,d1l:15,tl:40,ks:0,mul:7,dt1:3,dt2:0},{ar:27,d1r:12,d2r:0,rr:4,d1l:15,tl:4,ks:0,mul:2,dt1:5,dt2:0}]})},"opn::klang":{descJa:null,role:"perc",desc:null,of:"いかにも FM なリード。比 7 を頭だけ深くかけて落とす",patch:l({alg:0,fb:5,ops:[{ar:27,d1r:23,d2r:0,rr:9,d1l:15,tl:19,ks:0,mul:7,dt1:3,dt2:0},{ar:27,d1r:16,d2r:0,rr:11,d1l:6,tl:23,ks:0,mul:2,dt1:6,dt2:0},{ar:27,d1r:12,d2r:0,rr:10,d1l:3,tl:26,ks:0,mul:1,dt1:2,dt2:0},{ar:25,d1r:9,d2r:0,rr:9,d1l:2,tl:0,ks:0,mul:1,dt1:5,dt2:0}]})},"opm::glass":{descJa:null,role:"counter",desc:null,of:"ガラスの鐘。比 4.7 と 9.1。**整数から外す**ほど金属になる",patch:l({alg:4,fb:3,ops:[{ar:27,d1r:17,d2r:0,rr:6,d1l:15,tl:21,ks:0,mul:3,dt1:2,dt2:2},{ar:27,d1r:13,d2r:0,rr:4,d1l:15,tl:0,ks:0,mul:1,dt1:6,dt2:0},{ar:27,d1r:19,d2r:0,rr:7,d1l:15,tl:24,ks:0,mul:9,dt1:3,dt2:0},{ar:27,d1r:13,d2r:0,rr:4,d1l:15,tl:3,ks:0,mul:2,dt1:6,dt2:0}]})},"opn::slap":{descJa:null,role:"bass",desc:null,of:"弾くベース。頭で比 5 が弾けて、すぐ芯だけ残る",patch:l({alg:0,fb:6,ops:[{ar:27,d1r:24,d2r:0,rr:9,d1l:15,tl:20,ks:0,mul:5,dt1:2,dt2:0},{ar:27,d1r:19,d2r:0,rr:11,d1l:9,tl:24,ks:0,mul:2,dt1:6,dt2:0},{ar:27,d1r:14,d2r:0,rr:11,d1l:4,tl:29,ks:0,mul:1,dt1:1,dt2:0},{ar:27,d1r:11,d2r:0,rr:10,d1l:3,tl:0,ks:0,mul:1,dt1:5,dt2:0}]})},"opm::leadVib":{descJa:null,role:"lead",desc:null,of:"揺れるリード。`opn::lead` に LFO を足したもの",dev:["wip"],patch:l({alg:4,fb:4,pms:4,lfo:{rate:196,pmd:36,wf:2},ops:[{ar:25,d1r:12,d2r:0,rr:10,d1l:3,tl:34,ks:0,mul:3,dt1:2,dt2:0},{ar:23,d1r:7,d2r:0,rr:9,d1l:2,tl:0,ks:0,mul:1,dt1:6,dt2:0},{ar:25,d1r:11,d2r:0,rr:10,d1l:3,tl:38,ks:0,mul:2,dt1:1,dt2:0},{ar:23,d1r:7,d2r:0,rr:9,d1l:2,tl:4,ks:0,mul:1,dt1:5,dt2:0}]})},"opm::brassTrem":{descJa:null,role:"lead",desc:null,of:"揺れる金管。`opn::brass` に LFO を足し、出口のオペだけで受ける。深く掛けると途切れて聞こえる",dev:["wip"],patch:l({alg:2,fb:5,ams:1,lfo:{rate:200,amd:20,wf:2},ops:[{ar:17,d1r:8,d2r:0,rr:10,d1l:1,tl:29,ks:0,mul:1,dt1:2,dt2:0},{ar:17,d1r:8,d2r:0,rr:10,d1l:1,tl:33,ks:0,mul:1,dt1:6,dt2:0},{ar:17,d1r:8,d2r:0,rr:10,d1l:1,tl:31,ks:0,mul:1,dt1:1,dt2:0},{ar:17,d1r:7,d2r:0,rr:9,d1l:1,tl:0,ks:0,mul:1,dt1:5,dt2:0,ame:1}]})},"opm::tom":{descJa:null,role:"perc",desc:null,of:"打楽器。帰還を深く潰す",patch:l({alg:0,fb:6,ops:[{ar:27,d1r:23,d2r:0,rr:9,d1l:15,tl:28,ks:0,mul:1,dt1:1,dt2:0},{ar:27,d1r:22,d2r:0,rr:9,d1l:15,tl:29,ks:0,mul:1,dt1:1,dt2:1},{ar:27,d1r:21,d2r:0,rr:8,d1l:15,tl:31,ks:0,mul:1,dt1:1,dt2:0},{ar:27,d1r:18,d2r:0,rr:7,d1l:15,tl:0,ks:0,mul:1,dt1:1,dt2:0}]})}},Y={opn:["opn","pc88","pc98"],opm:["opm","x68000","arcade"]};function J(){for(let[e,s]of Object.entries(q))g(e,s.patch,{desc:s.desc,descJa:s.descJa,role:s.role,tags:Y[e.slice(0,3)],dev:s.dev});k("bakedBrass",{from:"opn::brass",octaves:[3,4,5],step:3,role:"lead",descJa:null,desc:null})}J();b();S();})();
