// フィルタ(ローパス、ハイパス、バンドパス、ノッチ、4 極ラダー、4 極ハイパス)。
//
// ---- 置き場所はまだ決めない ----
//
// 同じフィルタを、音色の中、音色の後処理、グループ、全体のどこにでも置き、
// 入れ子にも、直列にも並列にも並べる、と決めてある(2026-10-04)。
// ここで作るのは 1 個ぶんだけ。並べ方と記法(Stave)はあとから決める。
// よく使う組み合わせを 1 回で処理するまとめたフィルタは、最初は作らない。
// 重くて困ったら考える。
//
// ---- なぜ BiquadFilterNode を使わないか ----
//
// 置き場所のうち、音色の中は常駐の処理器の中で回す(`sound/duty.js` と同じ)。
// そこでは作りつけのノードが使えない。トラックや全体だけ BiquadFilterNode にすると、
// 同じ設定でも置き場所で鳴り方が変わる。だから計算は 1 つにして、処理器の中で回す。
//
// ---- 中身は 2 極の SVF ----
//
// 状態変数フィルタを台形則で離散化したもの(TPT / ZDF と呼ばれる形)。
// カットオフを 1 サンプルごとに動かしても崩れない。BiquadFilterNode の係数は
// 速く動かすと発散したり雑音が出たりするので、掃くならこちらが向いている。
// 12dB/oct。24dB が要るときは 2 つ直列に並べる。
// ただし analog の音色の中にはフィルタが 1 台しか置けないので、ハイパスだけは
// 4 極のもの(highpass4)を種類として持つ(下の節)。
//
// ---- 飽和 ----
//
// drive を上げると、2 つの積分器の状態が tanh で頭打ちになる。アナログの回路で
// 部品の出せる電圧に上限があるのと同じで、レゾナンスの山が膨らみきらずに潰れ、
// 大きな音ほど倍音が増える。積分器の状態を潰すのは手早い近似で、
// 回路の式を解いているわけではない。
// drive が 0 なら線形のまま。生音の側は線形で使うので、既定は 0 にしてある。
// SVF の自己発振(レゾナンスを上げきったときに入力なしで鳴り続ける)は無い。
//
// ---- バンドパスとノッチ(2026-10-05) ----
//
// 同じ SVF の別の出口。バンドパスはカットオフのあたりだけを通し、ノッチはそこだけを消す。
// バンドパスは山の高さが resonance で変わらないようにしてある(k × band)。
// resonance を上げると、高さはそのままで幅だけが狭くなる。
// ノッチは元の音からバンドパスを引いたもの。
// Oberheim の SEM 系のフィルタはこの出口を切り替えて使う。生音の側のブラスのミュートと、
// これから作るボコーダーの帯域分けにも使う
//
// ---- 4 極ラダー(ladder) ----
//
// Moog のラダーに倣った 24dB/oct のローパス。1 極のローパスを 4 つ直列に並べ、
// 出口を入口へ引き戻す(帰還)ことでレゾナンスを作る。2 極を 2 つ並べた 24dB とは
// 山の形が違い、こちらはレゾナンスを上げると低音が痩せる(帰還で入口が打ち消されるため。
// 低い音の大きさは 1 / (1 + k))。本物のラダーもそうなるので、補ってはいない。
//
// 1 極ずつ台形則で離散化し、帰還のぶんは式で先に解いている(ZDF)。
// 飽和は帰還をかけたあとの入口 1 か所に tanh を入れる。式を解いたあとで潰すので、
// これも近似。drive が 0 なら線形。
// 帰還の強さ k は 4 で発振の境目になる。resonance 1 までは境目の手前(K_LADDER)で止まり、
// 前と同じく線形のまま。
//
// ---- ラダーの自己発振(2026-10-05) ----
//
// resonance を 1 より上(1.2 まで)にすると、k が 4 を越えて、入力が無くてもカットオフの高さで
// 正弦波のように鳴り続ける。Moog や Prophet-5 でレゾナンスを上げきったときの口笛のような音。
// 線形のままでは振幅がどこまでも膨らむので、k が 4 を越えたら drive が 0 でも飽和を入れて
// 頭打ちにする(本物も、部品の飽和で振幅が決まる)。1 より上を使わなければ、前と同じ音になる。
// 鳴り出すきっかけとして、状態にごく小さな値を入れておく(本物では回路の雑音がこれにあたる)。
//
// 音量のあとにフィルタを置く道(@f と analog)で発振させると、音符と関係なく鳴り続ける。
// analog は resonance を 1 で止めてあり、発振域は使えない(docs/FILTER.md)
//
// ---- 4 極ハイパス(highpass4、2026-10-22) ----
//
// 2 極のハイパスを 2 段直列にした 24dB/oct。TR-808 のシンバルとハイハットを録音に合わせたとき、
// 実機は 2kHz より下を約 21dB/oct で切っていて、12dB/oct の 1 段では届かなかった。
// analog の音色の中にはフィルタが 1 台しか置けないので、種類として足した。
// resonance 0 で山の無い形(バターワース)になるように、1 段目の減衰は 1.848(Q 0.54)で止め、
// 2 段目は 0.765(Q 1.31)に damp(resonance) / 2 を掛ける。山は 2 段目だけが作る。
// 同じ設定の highpass を 2 つ並べたものとは違う音になる(あちらは resonance 0 で Q 0.5 が 2 つ)。
// まとめたフィルタ(docs/FILTER.md)ではなく、別の種類として扱う

/**
 * 定義。EFFECTS(sound/fx.js)と同じ形で、fx.js がほかのエフェクトと 1 つの表に集める。
 * 名前から見当がつくように、フィルタにもパラメータにも desc を付ける
 */
export const FILTER_FX = {
  lowpass: {
    tags: ['filter'], dev: ['done'], version: '1.00',
    desc: 'Two-pole (12 dB/oct) low-pass. Cuts the harmonics above the cutoff. Raise the resonance to add a peak at the cutoff.',
    params: {
      cutoff: { live: true, unit: 'Hz', min: 20, max: 20000, default: 20000, desc: 'Cutoff frequency in Hz. Above this the sound is cut. Kept below half the sample rate.' },
      resonance: { live: true, min: 0, max: 1, default: 0, desc: 'Peak at the cutoff. 0 is no peak. Near 1 the filter rings at the cutoff.' },
      drive: { live: true, min: 0, max: 1, default: 0, desc: 'Saturation inside the filter. 0 is clean. Higher values squash loud signals and the resonance peak, adding harmonics.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the filtered sound comes out, against the sound as it came in. 1 is fully filtered; 0 passes the sound untouched while the filter keeps running, so it can come back in without a click; 0.5 is half and half.' },
    },
  },
  highpass: {
    tags: ['filter'], dev: ['done'], version: '1.00',
    desc: 'Two-pole (12 dB/oct) high-pass. Cuts the lows below the cutoff. Raise the resonance to add a peak at the cutoff.',
    params: {
      cutoff: { live: true, unit: 'Hz', min: 20, max: 20000, default: 20, desc: 'Cutoff frequency in Hz. Below this the sound is cut. Kept below half the sample rate.' },
      resonance: { live: true, min: 0, max: 1, default: 0, desc: 'Peak at the cutoff. 0 is no peak. Near 1 the filter rings at the cutoff.' },
      drive: { live: true, min: 0, max: 1, default: 0, desc: 'Saturation inside the filter. 0 is clean. Higher values squash loud signals and the resonance peak, adding harmonics.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the filtered sound comes out, against the sound as it came in. 1 is fully filtered; 0 passes the sound untouched while the filter keeps running, so it can come back in without a click; 0.5 is half and half.' },
    },
  },
  bandpass: {
    tags: ['filter'], dev: [], version: '1.00',
    desc: 'Two-pole band-pass. Passes only a band around the cutoff. Raise the resonance to narrow the band; its peak stays at the same height.',
    params: {
      cutoff: { live: true, unit: 'Hz', min: 20, max: 20000, default: 1000, desc: 'Center of the band in Hz. Kept below half the sample rate.' },
      resonance: { live: true, min: 0, max: 1, default: 0, desc: 'Narrows the band. 0 is wide. Near 1 only a thin slice around the cutoff passes.' },
      drive: { live: true, min: 0, max: 1, default: 0, desc: 'Saturation inside the filter. 0 is clean. Higher values squash loud signals and add harmonics.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the filtered sound comes out, against the sound as it came in. 1 is fully filtered; 0 passes the sound untouched while the filter keeps running, so it can come back in without a click; 0.5 is half and half.' },
    },
  },
  notch: {
    tags: ['filter'], dev: [], version: '1.00',
    desc: 'Two-pole notch. Removes a band around the cutoff and passes everything else.',
    params: {
      cutoff: { live: true, unit: 'Hz', min: 20, max: 20000, default: 1000, desc: 'Center of the removed band in Hz. Kept below half the sample rate.' },
      resonance: { live: true, min: 0, max: 1, default: 0, desc: 'Narrows the removed band. 0 is wide. Near 1 only a thin slice is removed.' },
      drive: { live: true, min: 0, max: 1, default: 0, desc: 'Saturation inside the filter. 0 is clean. Higher values squash loud signals and add harmonics.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the filtered sound comes out, against the sound as it came in. 1 is fully filtered; 0 passes the sound untouched while the filter keeps running, so it can come back in without a click; 0.5 is half and half.' },
    },
  },
  highpass4: {
    tags: ['filter'], dev: [], version: '1.00',
    desc: 'Four-pole (24 dB/oct) high-pass. Twice as steep as highpass, for cutting the lows hard, as on the metal of an analog drum machine. Raise the resonance to add a peak at the cutoff.',
    params: {
      cutoff: { live: true, unit: 'Hz', min: 20, max: 20000, default: 20, desc: 'Cutoff frequency in Hz. Below this the sound is cut. Kept below half the sample rate.' },
      resonance: { live: true, min: 0, max: 1, default: 0, desc: 'Peak at the cutoff. 0 is no peak and the flattest top. Near 1 the filter rings at the cutoff.' },
      drive: { live: true, min: 0, max: 1, default: 0, desc: 'Saturation inside the filter. 0 is clean. Higher values squash loud signals and the resonance peak, adding harmonics.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the filtered sound comes out, against the sound as it came in. 1 is fully filtered; 0 passes the sound untouched while the filter keeps running, so it can come back in without a click; 0.5 is half and half.' },
    },
  },
  ladder: {
    tags: ['filter', 'analog'], dev: ['done'], version: '1.00',
    desc: 'Four-pole (24 dB/oct) low-pass in the style of the Moog ladder. Steeper than lowpass. The bass thins out as the resonance rises.',
    params: {
      cutoff: { live: true, unit: 'Hz', min: 20, max: 20000, default: 20000, desc: 'Cutoff frequency in Hz. Above this the sound is cut. Kept below half the sample rate.' },
      resonance: { live: true, min: 0, max: 1.2, default: 0, desc: 'Feedback around the four stages. 0 is no peak. Near 1 the filter rings at the cutoff and the bass gets thinner. Above 1 it oscillates by itself at the cutoff, even with no input.' },
      drive: { live: true, min: 0, max: 1, default: 0, desc: 'Saturation at the filter input after the feedback. 0 is clean. Higher values squash loud signals and the resonance peak, adding harmonics.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the filtered sound comes out, against the sound as it came in. 1 is fully filtered; 0 passes the sound untouched while the filter keeps running, so it can come back in without a click; 0.5 is half and half.' },
    },
  },
};

/**
 * フィルタの種類か。表は EFFECTS の 1 つだが、フィルタだけは振る舞いが違う。
 * `mmsxx-filter` の処理器で回し、`mix` を 0 にして外す(素通しの並びへ移らない)。
 * analog の音色の中に置けるのもフィルタだけ
 * @param {string} kind エフェクトの種類
 */
export function isFilter(kind) {
  return Object.hasOwn(FILTER_FX, kind);
}

/**
 * AudioWorkletNode を作るときの options。
 * AudioParam の既定値は種類ごとに変えられないので(処理器のクラスに 1 つ)、
 * ここで種類の既定値を parameterData に入れる。入れないとハイパスが
 * ローパスの既定値(20000Hz)で始まって、ほとんど鳴らない。
 */
export function filterOptions(kind, values = {}) {
  const def = FILTER_FX[kind];
  if (!def) throw new Error(`unknown filter: ${kind}`);
  const parameterData = {};
  for (const [name, p] of Object.entries(def.params)) parameterData[name] = values[name] ?? p.default;
  return { processorOptions: { kind }, parameterData };
}

/**
 * 処理器の中身。1 つの文字列として持つ(`sound/opll.js` と同じ理由)。
 * 中でバッククォートを書かない。この文字列がそこで終わってしまう。
 *
 * ノード 1 つにフィルタ 1 つ。processorOptions の kind で種類を選ぶ。
 * cutoff と resonance と drive と mix は AudioParam なので、setValueAtTime などで鳴らしながら動かせる。
 * チャンネルごとに状態を持つので、ステレオもそのまま通る。
 *
 * 要らなくなったら port へ { stop: true } を送る。送らないと、つなぎを外しても
 * 処理器は動き続ける(process が true を返すあいだは片付かない)。
 * 音ごとにフィルタを作ると、鳴り終わったぶんが溜まって重くなり、音が途切れた(2026-10-05)。
 */
/**
 * 処理器の中で使う計算だけ。フィルタの節(`FILTER_CODE`)と、フィルタを
 * 内に持つ音源(`sound/analog.js`)の両方へ埋める。
 *
 * 同じ計算を 2 つ書くとそのうちずれるので、ここに 1 つだけ置く。
 * 外の名前は使わない(この文字列の中で閉じている)
 */
export const FILTER_CORE = `
// レゾナンスを減衰の係数 k に直す。0 で k=2(Q=0.5、山なし)、1 に近づくと k は 0 へ。
// k=0 ちょうどは減衰しない(線形のままでは鳴り続けるか黙るかになる)ので、手前で止める。
// k について直線なので、0.9 から上は少し動かすだけで Q が大きく変わる。
// 手で回して困ったら、曲線で対応させるモードを加える。既定は変えない(2026-10-04)
const K_MIN = 0.01;
const damp = (r) => Math.max(K_MIN, 2 - 2 * Math.min(1, Math.max(0, r)));

// drive を飽和の強さ d に直す。潰す形は tanh(x * d) / d。小さい音は傾き 1 で
// そのまま通るので、drive を上げても静かなところの音量は変わらない。
// d が 0 に近づくと x に近づくので、0 の手前と 0 で音が飛ばない
const D_MAX = 4;
const D_MIN = 1e-4;
const sat = (x, d) => Math.tanh(x * d) / d;

// カットオフを tan の引数に直す。ナイキストの手前で止める(tan が発散する)
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

// 種類ごとに、レゾナンスの 0..1 を自分の係数へ直す口(res)を持つ。
// 処理器は動かないブロックでは 1 回だけ呼ぶ
class LowPass extends Svf {
  static res(r) { return damp(r); }
  step(x, g, k, d = 0) { this.tick(x, g, k, d); return this.low; }
}

class HighPass extends Svf {
  static res(r) { return damp(r); }
  step(x, g, k, d = 0) { this.tick(x, g, k, d); return this.high; }
}

// 山の高さを resonance によらず 1 にそろえたバンドパス。帯の真ん中で k × band が 1 になる
class BandPass extends Svf {
  static res(r) { return damp(r); }
  step(x, g, k, d = 0) { this.tick(x, g, k, d); return k * this.band; }
}

class Notch extends Svf {
  static res(r) { return damp(r); }
  step(x, g, k, d = 0) { this.tick(x, g, k, d); return x - k * this.band; }
}

// 2 極を 2 段。resonance 0 でバターワースになる減衰(2 cos(π/8) と 2 cos(3π/8))
const K_HP4A = 1.8478;
const K_HP4B = 0.7654;
// Svf を 2 つ持たせると 1 台 0.26% と、highpass の 6 倍近く重かったので、
// 同じ計算を 1 つのクラスの中に開いて書いた(0.10% になった。npm run bench:filter)
class HighPass4 {
  constructor() { this.a1 = 0; this.a2 = 0; this.b1 = 0; this.b2 = 0; }
  reset() { this.a1 = 0; this.a2 = 0; this.b1 = 0; this.b2 = 0; }
  static res(r) { return damp(r); }
  /** k = damp(resonance)。2 段目の減衰は K_HP4B × k / 2 で、resonance 0 のとき K_HP4B */
  step(x, g, k, d = 0) {
    // 1 段目。Svf.tick と同じ式
    let k1 = K_HP4A;
    let a1 = 1 / (1 + g * (g + k1)), a2 = g * a1, a3 = g * a2;
    let v3 = x - this.a2;
    let v1 = a1 * this.a1 + a2 * v3;
    let v2 = this.a2 + a2 * this.a1 + a3 * v3;
    this.a1 = 2 * v1 - this.a1;
    this.a2 = 2 * v2 - this.a2;
    if (d > D_MIN) { this.a1 = sat(this.a1, d); this.a2 = sat(this.a2, d); }
    const h = x - k1 * v1 - v2;
    // 2 段目
    k1 = K_HP4B * k / 2;
    a1 = 1 / (1 + g * (g + k1)); a2 = g * a1; a3 = g * a2;
    v3 = h - this.b2;
    v1 = a1 * this.b1 + a2 * v3;
    v2 = this.b2 + a2 * this.b1 + a3 * v3;
    this.b1 = 2 * v1 - this.b1;
    this.b2 = 2 * v2 - this.b2;
    if (d > D_MIN) { this.b1 = sat(this.b1, d); this.b2 = sat(this.b2, d); }
    return h - k1 * v1 - v2;
  }
}

// ラダーの帰還。4 で発振の境目。resonance 1 までは手前で止める(線形のまま)。
// 1 から 1.2 は発振域で、k は K_LADDER から K_OSC まで伸びる
const K_LADDER = 3.96;
const K_OSC = 4.6;
const R_OSC = 1.2;
// 発振域で入れる飽和の強さ。drive がこれより弱くても、ここまでは掛ける
const D_OSC = 1;

/** 4 極ラダー。1 極のローパス 4 つと、出口から入口への帰還 */
class Ladder {
  // 鳴り出すきっかけ。0 のままだと、入力が無いときに発振が始まらない
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
    // 帰還を先に解く。出口 y4 は G^4 u + S と書け、u = x - k y4 なので y4 が式で出る
    const S = G * (G * (G * this.s1 + this.s2) + this.s3) * h + this.s4 * h;
    const G4 = G * G * G * G;
    const y4 = (G4 * x + S) / (1 + k * G4);
    let u = x - k * y4;
    // 発振域では、振幅を頭打ちにするために必ず飽和を入れる
    if (k > 4 && d < D_OSC) d = D_OSC;
    if (d > D_MIN) u = sat(u, d);
    // 1 極ずつ進める。v = (入口 - 状態) G、出口 = v + 状態、次の状態 = 出口 + v
    let v = (u - this.s1) * G; const y1 = v + this.s1; this.s1 = y1 + v;
    v = (y1 - this.s2) * G; const y2 = v + this.s2; this.s2 = y2 + v;
    v = (y2 - this.s3) * G; const y3 = v + this.s3; this.s3 = y3 + v;
    v = (y3 - this.s4) * G; const y = v + this.s4; this.s4 = y + v;
    return y;
  }
}

const KINDS = { lowpass: LowPass, highpass: HighPass, ladder: Ladder, bandpass: BandPass, notch: Notch, highpass4: HighPass4 };
`;

/** フィルタ 1 台ぶんの節。入口と出口を持ち、カットオフなどは AudioParam で動かす */
export const FILTER_CODE = `${FILTER_CORE}
const DEFS = ${JSON.stringify(FILTER_FX)};

// mix を渡さない呼び方(古い試験など)では、通した音をそのまま出す
const MIX_ONE = new Float32Array([1]);

class FilterNode extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    // 範囲は lowpass から取る。resonance の上だけは種類で違う(ladder は発振域まである)ので、
    // いちばん上を取る。既定値は kind を見て作るときに入れる
    const p = DEFS.lowpass.params;
    const resMax = Math.max(...Object.values(DEFS).map((f) => f.params.resonance.max));
    return [
      { name: 'cutoff', defaultValue: p.cutoff.default, minValue: p.cutoff.min, maxValue: p.cutoff.max, automationRate: 'a-rate' },
      { name: 'resonance', defaultValue: p.resonance.default, minValue: p.resonance.min, maxValue: resMax, automationRate: 'a-rate' },
      { name: 'drive', defaultValue: p.drive.default, minValue: p.drive.min, maxValue: p.drive.max, automationRate: 'a-rate' },
      { name: 'mix', defaultValue: p.mix.default, minValue: p.mix.min, maxValue: p.mix.max, automationRate: 'a-rate' },
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
    const cut = params.cutoff, res = params.resonance, drv = params.drive, mix = params.mix || MIX_ONE;
    const sr = sampleRate;
    // 動いていないブロックは係数を 1 回だけ作る。tan はそこそこ重い
    const cFix = cut.length === 1, rFix = res.length === 1, dFix = drv.length === 1, mFix = mix.length === 1;
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
        // mix 0 でもフィルタは回し続ける。戻したときに、止まっていた状態から始まってプツッと鳴らないように
        const x = inp ? inp[i] : 0;
        const m = mFix ? mix[0] : mix[i];
        const y = f.step(x, g, k, d);
        out[i] = m === 1 ? y : x + m * (y - x);
      }
    }
    return this.alive;
  }
}

registerProcessor('mmsxx-filter', FilterNode);
`;
