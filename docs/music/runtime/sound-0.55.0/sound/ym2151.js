// **OPM(YM2151)を、チップごと移す。**
//
// X68000 とアーケードの多く(セガ、タイトー、コナミの沙羅曼蛇)がこれ。
// 4 オペレータが 8 声。
//
// ---- なぜ丸ごと移すのか ----
//
// いままでの `fm4.js` は「FM らしい音」を作る道具で、実機ではない。
// レジスタも音程の刻みもエンベロープの段も持っていないので、
// 実機の音色データ(`.opm`)を入れても同じ音にならなかった。
// OPLL で同じことをして、音色 15 個とリズム 5 つが emu2413 と 0.00dB で
// 合ったので、こちらも同じやり方にする。
//
// ---- どこから写したか ----
//
// **ymfm**(Aaron Giles、BSD 3-Clause)の `ymfm_fm.ipp` と `ymfm_opm.cpp`。
// 表のうち、サインと指数は式で出せることを確かめてから式にしてある
// (原典の値と全部一致した)。**式にできなかったものだけ数値で持つ** —
//
// - 音程の表(768 個)。原典にも「計算した表は実機と数か所違う。
//   David Viens の解析を使った」とある。式では出ない
// - エンベロープの刻み表(64 個)と、デチューンの表(32×4)。
//   どちらも実機の回路そのままで、意味のある式にならない
//
// ---- 外部依存ゼロを保つ ----
//
// 処理器の中身は文字列で持つ。ファイルを増やすと 1 枚に写せなくなる
// (`sound/` は 1 枚の JS として配る。CLAUDE.md)。
//
// **テンプレート文字列の中にバッククォートを書かない。**
// コメントに書いただけで構文が壊れる。OPLL のときに 2 回踏んだ。

/** 実機のクロック。X68000 もアーケードもこれ */
import { registerVoice, registerVoiceSyntax, badVoice as bad, splitParts } from './mml.js';
import { registerChipKind, freqAt, fadeGain } from './audio.js';
import { TONE_FRAME } from './tones.js';

export const OPM_CLOCK = 3579545;

/**
 * 1 秒あたり何回計算するか。
 *
 * 実機は 32 オペレータを順に回し、その手前で 2 分周している。
 * 3579545 / 32 / 2 = 55930.4Hz。
 */
export const OPM_RATE = OPM_CLOCK / 64;

/** 処理器の中身。**中でバッククォートを使わないこと** */
export const OPM_CODE = `
// ---- 表 ----

// サインを対数の減衰として持つ(4.8 固定小数、1/4 周期ぶん)。
// 原典の s_sin_table と全部一致する
const SIN = new Uint16Array(256);
for (let x = 0; x < 256; x++) {
  SIN[x] = Math.round(-Math.log2(Math.sin((x + 0.5) * Math.PI / 512)) * 256);
}

// 減衰から振幅へ戻す表。原典の s_power_table と一致する。
// 0x400 を先に足して 2 ビット左へ寄せてあるのも原典どおりで、
// 引いたあとに右シフトするだけで済むようにしてある
const POW = new Uint16Array(256);
for (let i = 0; i < 256; i++) {
  POW[i] = ((Math.round((Math.pow(2, (255 - i) / 256) - 1) * 1024)) | 0x400) << 2;
}

// 1 周期ぶんの波形。下 15 ビットが減衰、ビット 15 が符号
const WAVE = new Uint16Array(1024);
for (let i = 0; i < 1024; i++) {
  const half = (i & 0x100) ? (~i & 0xff) : (i & 0xff);
  WAVE[i] = SIN[half] | (((i >> 9) & 1) << 15);
}

// **音程の表。** 式では出ない(上の説明)。32 で割ってあるので戻す
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

// エンベロープの刻み。速さ 0..63 ごとに、8 回ぶんの増分が 4 ビットずつ
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

// デチューン(DT1)。キーコード 32 段 × 深さ 4
const DET = Uint8Array.from([
  0,0,1,2,0,0,1,2,0,0,1,2,0,0,1,2,0,1,2,2,0,1,2,3,0,1,2,3,0,1,2,3,
  0,1,2,4,0,1,3,4,0,1,3,4,0,1,3,5,0,2,4,5,0,2,4,6,0,2,4,6,0,2,5,7,
  0,2,5,8,0,3,6,8,0,3,6,9,0,3,7,10,0,4,8,11,0,4,8,12,0,4,9,13,0,5,10,14,
  0,5,11,16,0,6,12,17,0,6,13,19,0,7,14,20,0,8,16,22,0,8,16,22,0,8,16,22,0,8,16,22
]);

// LFO の波形。下 8 ビットが AM、上 8 ビットが PM。3 番はノイズで、走らせながら書く
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

// DT2。実機の説明書のセント値を 1/64 単位へ直したもの
const DT2 = [0, 384, 500, 608];

// アルゴリズム 8 通り。opout の添字で「何を入れて何を出すか」を表す。
// 0=無し 1=OP1 2=OP2 3=OP3 5=OP1+OP2 6=OP1+OP3 7=OP2+OP3
const ALG = [
  //  op2 の入力, op3 の入力, op4 の入力, 出口に OP1 / OP2 / OP3 を足すか
  [1, 2, 3, 0, 0, 0],
  [0, 5, 3, 0, 0, 0],
  [0, 2, 6, 0, 0, 0],
  [1, 0, 7, 0, 0, 0],
  [1, 0, 3, 0, 1, 0],
  [1, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1, 1],
];

// チャンネルごとのオペレータ番号。並びは鎖の順(M1 M2 C1 C2 ではない)
const OPOF = [0, 16, 8, 24];

// **出口に出ているオペレータ。**音量(TL)を足すのはここだけ。
// 揺らす側に足すと音量ではなく音色が変わる
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

    // 先に計算しておくもの
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
    // AM と PM の深さが同じレジスタに来る。PM は空いている隣へ逃がす
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
    // LFO が音程を揺らしているあいだは、毎サンプル計算し直すしかない
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
      // 速さ 62 以上は押した瞬間に済ませてあるので、ここでは動かさない
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
      // **先にずらしてから、ずらしたものの 17 と 14 を見る**(原典の順番)。
      // ずらす前の値から取ると 189 回で同じ並びに戻り、296Hz のブザーになる。
      // 正しい順番なら 131071 回で、噪音として聞こえる(2026-10-05)
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
    // エンベロープの数え上げ。3 回に 1 回だけ進む作りになっている
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
        // ノイズはチャンネル 8 のオペレータ 4 だけ。対数の変換を通さない
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
    // レジスタの記録(log)。OPLL と同じで、書いた時刻と中身を外へ流す。
    // 同じ書き込みをエミュレータへ渡して、こちらの翻訳を耳で確かめるため
    this.log = !!q.log;
    this.logNow = 0;
    this.acc = 0;
    this.base = currentTime;
    // 止めている最中。出口を落としているあいだのサンプル数。-1 なら止めていない
    this.cutAt = -1;
    this.port.onmessage = (e) => {
      // 止めて。シークと停止とポーズで来る(docs/BUGS.md)
      if (e.data && e.data.cut) { this.cut(); return; }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      // 次の音が来たら出口を戻す。戻さないと、止めたあとは何を積んでも
      // 黙ったままになる
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
    // busy: 鳴っているもの [{ ch, off }]。
    // fading: フェードの途中の音 [{ ch, list, at, patch }]。出口側のオペの TL を書き直す。
    // gliding: ポルタメントの途中の音 [{ ch, list, at }]。音程レジスタを書き直す
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
      // 鳴っている声を全部キーオフ(0x08 の下 3 ビットがチャンネル)
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
    // ノイズ。チャンネル 8 のオペ 4 がノイズになる。ノイズでない音が 8 本目に来たら戻す
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
      // 音量は TL へ足す。実機ではここしか効かない
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
    // 音程の書き直し。鳴らし始めのビットは別のレジスタ(0x08)にあるので、
    // ここは音程だけを書ける
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
    const steps = ${OPM_RATE} / sr;
    // 鳴りきったチップは計算しない。余韻があるので、128 サンプルごとに見直す
    for (const chip of this.pool) if (!chip.quiet && this.silent(chip)) chip.quiet = true;
    for (let i = 0; i < out.length; i++) {
      const t = this.base + i / sr;
      if (this.log) this.logNow = t;
      while (this.at < this.events.length && this.events[this.at].t <= t) {
        this.start(this.events[this.at++]);
      }
      for (const chip of this.pool) if (!chip.quiet) this.step(chip, t);
      // 実機の刻みと出す刻みは違う。足りるまで回す
      this.acc += steps;
      let n = 0;
      while (this.acc >= 1) { n++; this.acc -= 1; }
      let v = 0;
      for (const chip of this.pool) {
        if (chip.quiet) continue;
        for (let k = 0; k < n; k++) chip.c.tick();
        v += chip.c.out();
      }
      // 止めている最中なら、ぷつっと鳴らないよう 10 ミリ秒で落とす
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
registerProcessor('mmsxx-opm', OpmBank);
`;

// ---- 音程 ----
//
// **表から逆に引く。** キーコードは 1 オクターブに 16 の枠を取って 12 しか
// 使っておらず、しかも飛ばす位置が決まっている。式で当てると取り違えるので、
// 出せる高さを全部作っておいて、いちばん近いものを選ぶ。

/** ブロックとキーコードと端数から、実際に出る高さ(Hz) */
function freqOf(kc, kf) {
  const bf = ((kc & 0x7f) << 6) | (kf & 0x3f);
  let block = (bf >> 10) & 7;
  const code = ((bf >> 6) & 15) - ((bf >> 8) & 3);
  let eff = (code << 6) | (bf & 63);
  if (eff < 0 || eff >= 768) return null;
  return PHASE[eff] * 32 * OPM_RATE / (1 << 20) / (1 << (7 - block));
}

/** 出せる高さの一覧。1 回だけ作る */
let TABLE = null;
function buildTable() {
  const rows = [];
  for (let kc = 0; kc < 128; kc++) {
    if ((kc & 3) === 3) continue;            // 使わない枠
    for (let kf = 0; kf < 64; kf++) {
      const f = freqOf(kc, kf);
      if (f) rows.push({ kc, kf, f });
    }
  }
  rows.sort((a, b) => a.f - b.f);
  return rows;
}

/**
 * 高さ(Hz)から、いちばん近いレジスタの値へ。
 *
 * @param {number} freq
 * @returns {{kc:number, kf:number}}
 */
export function opmPitch(freq) {
  if (!TABLE) TABLE = buildTable();
  let lo = 0, hi = TABLE.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (TABLE[mid].f < freq) lo = mid + 1; else hi = mid;
  }
  const a = TABLE[lo], b = TABLE[Math.max(0, lo - 1)];
  const pick = Math.abs(a.f - freq) <= Math.abs(b.f - freq) ? a : b;
  return { kc: pick.kc, kf: pick.kf };
}

/** 音程の表(逆引き用)。処理器の中と同じもの */
const PHASE = Uint32Array.from([
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
]);

/**
 * 音色 1 つぶんの既定値。
 *
 * **実機のレジスタの値をそのまま持つ。** 0〜1 の線形に直したりしない。
 * `.opm` のファイルはこの形で書かれているので、読んだものを翻訳せずに置ける
 * (`sound/opmfile.js` の「翻訳が要らなくなった」がこれ)。
 *
 * LFO とノイズは、実機ではチップ全体で 1 つの設定(8 声が分け合う)。ここでは音色ごとに
 * 持たせる。設定の違う音色は、処理器が別のチップに載せる(2026-10-05)。
 *
 * - `lfo` — { rate: 速さ 0〜255, amd: 音量の深さ 0〜127, pmd: 音程の深さ 0〜127,
 *   wf: 波形 0〜3(のこぎり・矩形・三角・ノイズ)}。書かなければ LFO は止まったまま
 *   (`pms` `ams` を書いても揺れない)
 * - `noise` — ノイズの周波数 0〜31。書くとオペ 4 がノイズになる(実機はチャンネル 8 だけ)
 *
 * @param {object} p
 * @returns {{alg:number, fb:number, pms:number, ams:number, ops:object[],
 *            lfo?:{rate:number, amd:number, pmd:number, wf:number}, noise?:number}}
 */
export function opmPatch(p = {}) {
  const op = (o = {}) => ({
    ar: o.ar ?? 31, d1r: o.d1r ?? 0, d2r: o.d2r ?? 0, rr: o.rr ?? 7,
    d1l: o.d1l ?? 0, tl: o.tl ?? 0, ks: o.ks ?? 0, mul: o.mul ?? 1,
    dt1: o.dt1 ?? 0, dt2: o.dt2 ?? 0, ame: o.ame ?? 0,
  });
  const l = p.lfo;
  return {
    alg: p.alg ?? 0, fb: p.fb ?? 0, pms: p.pms ?? 0, ams: p.ams ?? 0,
    ops: [op(p.ops?.[0]), op(p.ops?.[1]), op(p.ops?.[2]), op(p.ops?.[3])],
    ...(l ? { lfo: { rate: (l.rate ?? 0) & 0xff, amd: (l.amd ?? 0) & 0x7f,
      pmd: (l.pmd ?? 0) & 0x7f, wf: (l.wf ?? 0) & 3 } } : {}),
    ...(p.noise != null ? { noise: p.noise & 31 } : {}),
  };
}

/**
 * OPN(YM2203 / YM2608。PC-88・PC-98)の音色を、OPM の音色へ写す。
 *
 * ---- OPN のチップを持たない理由 ----
 *
 * FM の演算器は同じもので、AR・DR・SR・RR・SL・TL・KS・ML・DT・結線・帰還の意味も
 * 同じ。libvgm で同じ音色を YM2203 と YM2151 の両方で鳴らして比べると、実効値は
 * 0.1dB 以内、倍音も揃う(DT でずらした音色は、うなりの進み方がわずかに違うので、
 * 切り取る瞬間によって上の倍音が上下する)。聞き分けられる差が無いので、OPM で
 * 鳴らす(2026-10-04)。
 *
 * OPN にしか無いもの(SSG-EG と、3 声目のオペを別々の高さで鳴らすモード)は写せない。
 * OPM にしか無い DT2 は 0 にする。LFO(PMS / AMS / AM)は OPNA にあるので通す。
 *
 * 名前は OPN の資料の呼び方で受ける。オペは鎖の順(1 → 2 → 3 → 4)で並べる。
 * レジスタの並び(1・3・2・4)ではないので、音色データを写すときは並べ直す。
 *
 * @param {{alg?:number, fb?:number, pms?:number, ams?:number,
 *          ops?:{ar?:number, dr?:number, sr?:number, rr?:number, sl?:number, tl?:number,
 *                ks?:number, ml?:number, dt?:number, am?:number}[]}} p
 * @returns {object} `opmPatch()` と同じ形
 */
export function opnPatch(p = {}) {
  const op = (o = {}) => ({
    ar: o.ar, d1r: o.dr, d2r: o.sr, rr: o.rr, d1l: o.sl, tl: o.tl, ks: o.ks,
    mul: o.ml, dt1: o.dt, dt2: 0, ame: o.am,
  });
  return opmPatch({ alg: p.alg, fb: p.fb, pms: p.pms, ams: p.ams,
    ops: (p.ops || []).slice(0, 4).map(op) });
}

// ---- 声の取り合いの目安を、音色から割り出す ----
//
// OPLL と同じ考え方(→ `sound/opllvoice.js` の `opllSteal`)。
// 鳴らし直しが聞こえるかは、持続音かどうかと立ち上がりの速さで決まる。
// どちらも音色の値に入っているので、鳴らさずに決められる。

/**
 * 結線ごとの、出口に出ているオペレータ。
 *
 * 処理器の中(`OPM_CODE`)にも同じ表がある。あちらは文字列の中なので
 * こちらからは読めない。1 行なので持ち合う
 */
const OUT_OPS = [[3], [3], [3], [3], [1, 3], [1, 2, 3], [1, 2, 3], [0, 1, 2, 3]];

/**
 * OPM の AR を、OPLL の AR と同じ目盛りへ直す。
 *
 * **段の刻みが違う。**エンベロープの速さを決める 6 ビットの値へ、OPLL は
 * `AR` をそのまま(1 段で倍)、OPM は `AR × 2`(4 段で倍)で入れている
 * (`sound/opll.js` の `egRateH`、こちらの `effRate`)。だから OPM の 2 段が
 * OPLL の 1 段にあたる。
 *
 * **チップの時計の違いは見ない。**OPLL が 49716Hz、OPM が 55930Hz で 12% 違うが、
 * 目安なのでその幅は困らない。
 *
 * @param {number} ar OPM の AR(0〜31)
 * @returns {number} OPLL の目盛りでの AR
 */
export function opmArToOpll(ar) { return ar / 2; }

/**
 * 音色から `steal` を割り出す。
 *
 * 見るのは出口のオペレータ(結線で決まる)。耳に出るのはそちらで、
 * 変調する側は倍音の量を決めるだけ。
 *
 * - 持続音か — 出口のオペレータが第 2 減衰(`d2r`)を持たず、段(`d1l`)が
 *   落ちきらないもの。OPM には EG タイプの印が無いので、この 2 つで見る
 * - 立ち上がり — 出口のうちいちばん遅いもので見る。遅い側が頭を作る
 *
 * **`d1l <= 10` と立ち上がりの境目は、聞いて決めた数ではない。**
 * 間違っていたら直す(→ docs/TODO.md の「チャンネルの圧縮」)。
 *
 * @param {object} patch `opmPatch()` が作るもの
 * @param {number} [attackMs] 立ち上がりの境目(ミリ秒)。既定 20
 * @returns {'ok'|'avoid'}
 */
export function opmSteal(patch, attackMs = 20) {
  const car = OUT_OPS[(patch?.alg ?? 0) & 7].map((i) => patch.ops[i]);
  const hold = car.every((o) => o.d2r === 0 && o.d1l <= 10);
  // いちばん遅い出口の AR。OPLL の目盛りへ直してミリ秒にする
  const slowest = Math.min(...car.map((o) => o.ar));
  const ms = slowest > 0 ? 1067 / 2 ** (opmArToOpll(slowest) - 1) : Infinity;
  return hold && ms < attackMs ? 'ok' : 'avoid';
}


// ---- 音色を登録する口(ここから mml.js の中へ入る)----
//
// OPM の中身を知っているのはこのファイルだけにする。mml.js は `registerVoice` で
// 受けるだけなので、OPM を外すときに mml.js を直さずに済む
// (docs/ENGINE_TODO.md の 2i)

/**
 * 4 オペレータの FM 音色を足す(OPM = YM2151)。
 *
 * チップそのものを鳴らす。音色データは実機のレジスタの値をそのまま持つので、
 * `.opm` のファイルを翻訳せずに置ける。演算は ymfm(BSD)と突き合わせてあって、
 * サンプル単位で一致する([ym2151.js](ym2151.js))。
 *
 * 2 オペ(`registerFM`)との違いは帰還が持てること。オペレータの出力を
 * 自分へ戻すと明るい音や金属質な打楽器になるが、Web Audio の節では
 * グラフを輪にできない(最小の遅延が音の周期より長い)。だから中で計算する。
 *
 * 名前の頭は、どの音源のための音色かで決める。X68000 とアーケードは `opm`、
 * PC-88 / PC-98 は `opn`(OPN の音色は `opnPatch()` で写して、ここで登録する)。
 *
 * @param {string} name 名前。`opm` か `opn` + 役(`opn::brass` など)
 * @param {object} patch `opmPatch()` が作るもの(結線・帰還・オペ 4 つ)
 * @param {{overwrite?:boolean}} [opts]
 * @returns {number} 音色の番号(ふだんは名前で呼ぶので使わない)
 */
export function registerOPM(name, patch, opts = {}) {
  // 書いていなければ、音色の中身から割り出す(`opmSteal`)。
  // 測った結果のほうが確かなので、書いてあればそちらが勝つ。
  // 4 オペは必ず中で計算しているので、`worklet` は `registerVoice` が付ける
  return registerVoice(name, 'opm', { patch },
    { ...opts, steal: opts.steal ?? opmSteal(patch) });
}

/**
 * `@opm{…}` を読む。4 オペの FM の音色を MML の中で作る(OPM のチップで鳴る)。
 *
 * ```
 * #voice myLead = @opm{ alg 4, fb 5,
 *   op1{ar 31, d1r 10, rr 7, d1l 2, tl 30, mul 1, dt1 3}, op2{…}, op3{…}, op4{…},
 *   pms 3, lfo{rate 200, pmd 40, wf 2} }
 * ```
 *
 * オペは鎖の順(1 → 2 → 3 → 4)。`.opm` の M1 C1 M2 C2 と同じ並び。
 * 値の名前は OPM の呼び名(`ar d1r d2r rr d1l tl ks mul dt1 dt2 ame`)で書く。
 * PC-88 の資料から写すときのために、OPN の呼び名(`dr sr sl ml dt am`)でも書ける。
 * 中身は `opmPatch()` へ渡すものと同じ形(2026-10-05)。
 */
function readOpmSpec(text, name) {
  const spec = { ops: [{}, {}, {}, {}] };
  const said = new Set();
  for (const one of splitParts(text)) {
    const m = /^([A-Za-z]+[1-4]?)\s*(?:\{([^}]*)\})?\s*(-?\d+)?$/.exec(one.trim());
    if (!m || (m[2] === undefined && m[3] === undefined)) {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の @opm の "${one.trim()}" は読めません`
        + '(op1{…} lfo{…} か、alg 4 のように書きます)');
    }
    const key = m[1].toLowerCase();
    said.add(key);
    const op = /^op([1-4])$/.exec(key);
    if (op) {
      if (m[2] === undefined) bad(`[ChpTnSnd] MML: 音色 "${name}" の @opm の ${key} は ${key}{…} で書きます`);
      spec.ops[Number(op[1]) - 1] = opmFields(m[2], name, key, OPM_OP_NAMES);
    } else if (key === 'lfo') {
      if (m[2] === undefined) bad(`[ChpTnSnd] MML: 音色 "${name}" の @opm の lfo は lfo{…} で書きます`);
      spec.lfo = opmFields(m[2], name, key, OPM_LFO_NAMES);
    } else if (['alg', 'fb', 'pms', 'ams', 'noise'].includes(key)) {
      if (m[3] === undefined) bad(`[ChpTnSnd] MML: 音色 "${name}" の @opm の ${key} は数で書きます`);
      spec[key] = Number(m[3]);
    } else {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の @opm に "${m[1]}" は書けません`
        + '(書けるのは alg fb pms ams noise op1〜op4 lfo です)');
    }
  }
  if (![1, 2, 3, 4].some((n) => said.has('op' + n))) {
    bad(`[ChpTnSnd] MML: 音色 "${name}" の @opm にオペがありません(op1{…}〜op4{…} を書いてください)`);
  }
  return opmPatch(spec);
}

/** オペに書ける名前。左が OPM の呼び名、右が別の呼び名(OPN の資料のもの) */
const OPM_OP_NAMES = {
  ar: 'ar', d1r: 'd1r', dr: 'd1r', d2r: 'd2r', sr: 'd2r', rr: 'rr', d1l: 'd1l', sl: 'd1l',
  tl: 'tl', ks: 'ks', mul: 'mul', ml: 'mul', dt1: 'dt1', dt: 'dt1', dt2: 'dt2', ame: 'ame', am: 'ame',
};
/** LFO に書ける名前 */
const OPM_LFO_NAMES = { rate: 'rate', amd: 'amd', pmd: 'pmd', wf: 'wf' };

/** `ar 31, tl 30` を読む。範囲は `opmPatch()` とチップがビットで切る */
function opmFields(text, name, where, names) {
  const out = {};
  for (const one of String(text).split(',')) {
    const w = one.trim().split(/\s+/).filter(Boolean);
    if (!w.length) continue;
    if (w.length !== 2 || !Number.isFinite(Number(w[1]))) {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の @opm の ${where}{${text}} は`
        + '「名前 数」を `,` で区切って書きます');
    }
    const k = names[w[0].toLowerCase()];
    if (!k) {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の @opm の ${where} に "${w[0]}" は書けません`
        + `(書けるのは ${Object.keys(names).join(' ')} です)`);
    }
    out[k] = Number(w[1]);
  }
  return out;
}

// MML の #voice で @opm{…} と書けるようにする。中身は字のまま受けて、ここで読む
registerVoiceSyntax('opm', (name, text, opts) =>
  registerOPM(name, readOpmSpec(text, name), opts), { raw: true });

// ---- エンジンへ自分を登録する ----
//
// このファイルを読み込むと OPM で鳴らせるようになる。音色は `opmpresets.js` が
// 持っていて、そちらも読み込むとプリセットが並ぶ
// (docs/SOUND_TOOL.md「音源ごとに分けて配る」)

/**
 * ポルタメント(`*`)の途中の高さを、OPM のレジスタの並びにする。
 *
 * `[[時刻, KC, KF], …]`。同じ値が続くところは書かない。
 * OPLL は高さのまま渡して処理器の側で直すが、あちらは変換が処理器の中に
 * あるため。OPM の逆引きは表を持つので、外に 1 つだけ置いてある
 */
function pitchSteps(ev, t0, t1) {
  const out = [];
  let last = -1;
  for (let age = TONE_FRAME; t0 + age < t1; age += TONE_FRAME) {
    const { kc, kf } = opmPitch(freqAt(ev, age));
    const key = (kc << 8) | kf;
    if (key === last) continue;
    last = key;
    out.push([t0 + age, kc, kf]);
  }
  return out;
}

/**
 * OPM で鳴らす音符を、常駐の処理器へ渡す形にする。
 *
 * 音量はチップに任せる。OPM の TL は 1 段 0.75dB の減衰で、実機ではここしか
 * 効かない。外から掛けると実機と違う鳴り方になる(OPLL と同じ扱い。2026-09-27)。
 *
 * `@e{…}` は効かない。実機の音色が自分でエンベロープを持っていて、その外側に
 * もう一枚かけると音色が変わる。4 オペを寄せて作っていたころは外から掛けていたが、
 * チップそのものになったのでやめた。
 */
function opmEvent(ev, wf, freq, amp, t0, t1) {
  const { kc, kf } = opmPitch(freq);
  // 音量を TL の段へ直す。0.75dB きざみ。
  // フェードの途中の音は、`amp` がいちばん大きいところなので、そこから下げる
  const attOf = (a) => Math.max(0, Math.round(
    -20 * Math.log10(Math.max(1e-4, amp * (ev.fade ? fadeGain(ev, a) : 1))) / 0.75));
  return {
    t: t0, dur: Math.max(0.01, t1 - t0 - (ev.relTail || 0)), kc, kf, patch: wf.patch,
    att: attOf(0),
    // フェードの途中なら、鳴っているあいだに TL を書き直す(余韻も)
    ...(ev.fade ? { vs: this._fadeSteps(ev, t0, t1, attOf) } : {}),
    // ポルタメント。鳴っているあいだに音程レジスタ(KC と KF)を書き直す。
    // OPLL と違って、高さから直すのはこちら側 — 逆引きの表が
    // `opmPitch` にあり、処理器の中にも同じ表を持たせると 2 か所になる
    ...(ev.glide > 0 ? { ps: pitchSteps(ev, t0, t1 - (ev.relTail || 0)) } : {}),
  };
}

/** 処理器の登録に渡すもの。高さは実機が 1 オクターブ 512 段で刻むので寄せない */
export const OPM_CHIP = {
  kind: 'opm',
  node: 'mmsxx-opm',
  code: OPM_CODE,
  event: opmEvent,
  // 音量をチップが持つので、残響のしっぽを足さない
  noTail: true,
};

registerChipKind(OPM_CHIP.kind, OPM_CHIP);
