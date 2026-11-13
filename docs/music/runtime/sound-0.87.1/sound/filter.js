// フィルタ(ローパス、ハイパス、バンドパス、ノッチ、4 極ラダー、4 極ハイパス、ダイオードラダー)。
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
//
// ---- ダイオードラダー(diode、2026-11-01) ----
//
// Roland TB-303 のフィルタ。Open303(Robin Schmidt、MIT)の TeeBeeFilter の TB_303 の型を写した。
// 4 つの段が隣どうしでつながっていて(Moog のラダーは前から後ろへ流れるだけ)、
// 出口から入口への帰還の途中に 1 極のハイパス(10Hz)が入っている。
// 帰還のハイパスで、カットオフが低いときほど山が立たない。a1k0n/303 が x0xb0x で測って
// 合わせたのと同じ考え方。カットオフから係数への対応は、Open303 が測って当てた式のまま。
//
// 帰還のハイパスは、Open303 では 150Hz。実機の録音(Freesound の pitmusic「TB303 Bass」、
// 矩形波の 1 音 16 本)と比べて 10Hz にした(2026-11-03)。録音の倍音を実機の矩形波の倍音で割って、
// 時刻ごとのフィルタの形を出し、山がはっきり立っている 40 か所に、カットオフを探して当てた。
// 150Hz のままだと、山が 200〜500Hz に下りたときにほとんど立たず(330Hz で 1dB。録音は 17dB)、
// 「みやおーん」と鳴かなかった。当てたときの差の平均は、150Hz で 3.6〜11.4dB、20Hz で 1.8〜4.5dB、
// 10Hz で 1.4〜4.2dB。
//
// カットオフは山の立つ高さ。レゾナンス 0 では、カットオフのところですでに 25dB ほど落ちている。
// カットオフの 2 倍から 4 倍のあいだは、1 オクターブで約 18dB 落ちる。その先は 22dB ほどに
// 急になる(48kHz で、正弦波を通して測った)。「18dB」と言われるのは、カットオフの近くのこと。
//
// Open303 と同じく、4 倍に上げて回し、カットオフは 2 万 Hz で止める。はじめは 1 倍で回していたが、
// 係数の式は 4 倍に上げた範囲で当てたもので、1 倍でカットオフを 1 万 Hz より上へ開くと
// 帰還が膨らみ、音が 10dB 以上大きくなった(tb303 で cutoff と envMod を上げきったとき)。
// 4 倍に上げる前に入口を作り直すことはしない(同じ値を 4 回入れる)。低いところしか通さないので、
// 折り返しは小さい。
// レゾナンスは Open303 と同じく曲げてから使う((1 - e^-3r) / (1 - e^-3))。
// 音量は、レゾナンス 0 のときに低い音がそのまま通るように、Open303 の半分にした。
// drive は帰還を引いたあとの入口に掛ける(ladder と同じ)。Open303 のこの型には飽和が無い。
// 帰還には、Open303 に無い頭打ちを入れた(DIODE_FB)。上げきったレゾナンスでカットオフを
// 1 サンプルごとに大きく振ると、4 倍に上げて回しても膨らみつづけたため。
// 重さは ladder の 2.5 倍ほど(npm run bench:filter で still 0.43%、ladder は 0.18%)。

/*! @license
 * The diode ladder filter (Diode in FILTER_CORE) is adapted from Open303
 * (https://github.com/RobinSchmidt/Open303), TeeBeeFilter, TB_303 mode.
 *
 * The MIT License
 *
 * Copyright (c) 2009 Robin Schmidt (www.rs-met.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * 定義。EFFECTS(sound/fx.js)と同じ形で、fx.js がほかのエフェクトと 1 つの表に集める。
 * 名前から見当がつくように、フィルタにもパラメータにも desc を付ける
 */
export const FILTER_FX = {
  lowpass: {
    tags: ['filter'], version: '1.00',
    desc: 'Two-pole (12 dB/oct) low-pass. Cuts the harmonics above the cutoff. Raise the resonance to add a peak at the cutoff.',
    params: {
      cutoff: { live: true, unit: 'Hz', min: 20, max: 20000, default: 20000, desc: 'Cutoff frequency in Hz. Above this the sound is cut. Kept below half the sample rate.' },
      resonance: { live: true, min: 0, max: 1, default: 0, desc: 'Peak at the cutoff. 0 is no peak. Near 1 the filter rings at the cutoff.' },
      drive: { live: true, min: 0, max: 1, default: 0, desc: 'Saturation inside the filter. 0 is clean. Higher values squash loud signals and the resonance peak, adding harmonics.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the filtered sound comes out, against the sound as it came in. 1 is fully filtered; 0 passes the sound untouched while the filter keeps running, so it can come back in without a click; 0.5 is half and half.' },
    },
  },
  highpass: {
    tags: ['filter'], version: '1.00',
    desc: 'Two-pole (12 dB/oct) high-pass. Cuts the lows below the cutoff. Raise the resonance to add a peak at the cutoff.',
    params: {
      cutoff: { live: true, unit: 'Hz', min: 20, max: 20000, default: 20, desc: 'Cutoff frequency in Hz. Below this the sound is cut. Kept below half the sample rate.' },
      resonance: { live: true, min: 0, max: 1, default: 0, desc: 'Peak at the cutoff. 0 is no peak. Near 1 the filter rings at the cutoff.' },
      drive: { live: true, min: 0, max: 1, default: 0, desc: 'Saturation inside the filter. 0 is clean. Higher values squash loud signals and the resonance peak, adding harmonics.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the filtered sound comes out, against the sound as it came in. 1 is fully filtered; 0 passes the sound untouched while the filter keeps running, so it can come back in without a click; 0.5 is half and half.' },
    },
  },
  bandpass: {
    tags: ['filter'], version: '1.00',
    desc: 'Two-pole band-pass. Passes only a band around the cutoff. Raise the resonance to narrow the band; its peak stays at the same height.',
    params: {
      cutoff: { live: true, unit: 'Hz', min: 20, max: 20000, default: 1000, desc: 'Center of the band in Hz. Kept below half the sample rate.' },
      resonance: { live: true, min: 0, max: 1, default: 0, desc: 'Narrows the band. 0 is wide. Near 1 only a thin slice around the cutoff passes.' },
      drive: { live: true, min: 0, max: 1, default: 0, desc: 'Saturation inside the filter. 0 is clean. Higher values squash loud signals and add harmonics.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the filtered sound comes out, against the sound as it came in. 1 is fully filtered; 0 passes the sound untouched while the filter keeps running, so it can come back in without a click; 0.5 is half and half.' },
    },
  },
  notch: {
    tags: ['filter'], version: '1.00',
    desc: 'Two-pole notch. Removes a band around the cutoff and passes everything else.',
    params: {
      cutoff: { live: true, unit: 'Hz', min: 20, max: 20000, default: 1000, desc: 'Center of the removed band in Hz. Kept below half the sample rate.' },
      resonance: { live: true, min: 0, max: 1, default: 0, desc: 'Narrows the removed band. 0 is wide. Near 1 only a thin slice is removed.' },
      drive: { live: true, min: 0, max: 1, default: 0, desc: 'Saturation inside the filter. 0 is clean. Higher values squash loud signals and add harmonics.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the filtered sound comes out, against the sound as it came in. 1 is fully filtered; 0 passes the sound untouched while the filter keeps running, so it can come back in without a click; 0.5 is half and half.' },
    },
  },
  highpass4: {
    tags: ['filter'], version: '1.00',
    desc: 'Four-pole (24 dB/oct) high-pass. Twice as steep as highpass, for cutting the lows hard, as on the metal of an analog drum machine. Raise the resonance to add a peak at the cutoff.',
    params: {
      cutoff: { live: true, unit: 'Hz', min: 20, max: 20000, default: 20, desc: 'Cutoff frequency in Hz. Below this the sound is cut. Kept below half the sample rate.' },
      resonance: { live: true, min: 0, max: 1, default: 0, desc: 'Peak at the cutoff. 0 is no peak and the flattest top. Near 1 the filter rings at the cutoff.' },
      drive: { live: true, min: 0, max: 1, default: 0, desc: 'Saturation inside the filter. 0 is clean. Higher values squash loud signals and the resonance peak, adding harmonics.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the filtered sound comes out, against the sound as it came in. 1 is fully filtered; 0 passes the sound untouched while the filter keeps running, so it can come back in without a click; 0.5 is half and half.' },
    },
  },
  diode: {
    tags: ['filter', 'analog'], version: '1.00',
    desc: 'Diode ladder low-pass in the style of the Roland TB-303. About 18 dB/oct. The cutoff is where the peak stands; with no resonance the sound is already well down there. The resonance is weak when the cutoff is low and sharp when it is high, and never oscillates by itself.',
    params: {
      cutoff: { live: true, unit: 'Hz', min: 20, max: 20000, default: 20000, desc: 'Cutoff frequency in Hz, where the resonance peak stands. Kept below half the sample rate.' },
      resonance: { live: true, min: 0, max: 1, default: 0, desc: 'Feedback around the ladder. 0 is no peak. At 1 the peak is sharp at a high cutoff and gentle at a low one. It does not oscillate.' },
      drive: { live: true, min: 0, max: 1, default: 0, desc: 'Saturation at the filter input after the feedback. 0 is clean. Higher values squash loud signals and the resonance peak, adding harmonics.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the filtered sound comes out, against the sound as it came in. 1 is fully filtered; 0 passes the sound untouched while the filter keeps running, so it can come back in without a click; 0.5 is half and half.' },
    },
  },
  ladder: {
    tags: ['filter', 'analog'], version: '1.00',
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

// 小さすぎる値は 0 にする(非正規化数で重くならないように)。
//
// 入力が黙ると、フィルタの状態は 0 へ向かって減り続ける。非正規化数に落ちると
// 計算が極端に遅くなり、黙っているチャンネルが増えるほど重くなる
// (チャンネルごとにフィルタを掛けた曲で、音のスレッドの 27% がこれだった。2026-11-07)。
//
// 呼ぶのは区切りの終わりに 1 回だけ。サンプルごとに見ると、この判定のほうが高くつく。
// 128 サンプルぶん余計に回っても、落ちるところまで落ちてから止まるだけ
const fz = (x) => (x > -1e-20 && x < 1e-20 ? 0 : x);

/** 2 極の SVF。low と high を同時に出す。どちらを使うかは継いだ側が決める */
class Svf {
  constructor() { this.ic1 = 0; this.ic2 = 0; }
  reset() { this.ic1 = 0; this.ic2 = 0; }
  flush() { this.ic1 = fz(this.ic1); this.ic2 = fz(this.ic2); }
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
  flush() {
    this.a1 = fz(this.a1); this.a2 = fz(this.a2);
    this.b1 = fz(this.b1); this.b2 = fz(this.b2);
  }
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
  // 落としきると発振のきっかけが消えるので、1 段目は reset と同じ種を置き直す
  flush() {
    this.s1 = fz(this.s1) || 1e-5;
    this.s2 = fz(this.s2); this.s3 = fz(this.s3); this.s4 = fz(this.s4);
  }
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

// ダイオードラダー。Open303(MIT)の TeeBeeFilter の TB_303 の型
// 許諾の全文はこのファイルの頭(縮めても残るように /*! で書いた)
// 帰還のハイパス(Hz)。Open303 は 150。録音に合わせて 10 にした(上の注釈)
const DIODE_HP = 10;
// 帰還の頭打ち。ふつうの大きさ(1 前後)では届かない。レゾナンスを上げきって
// カットオフを 1 サンプルごとに大きく振ると、帰還が膨らみつづけることがあり、それを止める。
// tanh で丸めると still で 2 倍重くなったので、切るだけにした
const DIODE_FB = 4;
const DIODE_SKEW = 1 - Math.exp(-3);
// 1 サンプルを何回に分けて回すか。Open303 と同じ 4 倍。係数の式は、4 倍に上げたうえで
// カットオフ 2 万 Hz までを前提に当てたもので、1 倍で高いカットオフを渡すと帰還が膨らむ
const DIODE_OS = 4;
// カットオフの上限(Hz)。Open303 と同じ
const DIODE_MAX = 20000;
class Diode {
  constructor() { this.reset(); this.lg = -1; this.lr = -1; }
  reset() { this.y1 = 0; this.y2 = 0; this.y3 = 0; this.y4 = 0; this.hx = 0; this.hy = 0; }
  flush() {
    this.y1 = fz(this.y1); this.y2 = fz(this.y2); this.y3 = fz(this.y3);
    this.y4 = fz(this.y4); this.hx = fz(this.hx); this.hy = fz(this.hy);
  }
  /** レゾナンスを Open303 と同じく曲げる。0..1 */
  static res(r) { return (1 - Math.exp(-3 * Math.min(1, Math.max(0, r)))) / DIODE_SKEW; }
  /** g = warp(カットオフ)、r = res(レゾナンス)、d = 飽和の強さ */
  step(x, g, r, d = 0) {
    // 係数はカットオフかレゾナンスが変わったときだけ作る。動かないあいだの atan を省く
    if (g !== this.lg || r !== this.lr) {
      // warp を戻して、カットオフをサンプルレートとの比にする。fx = fc / fs / √2
      const fx = Math.min(Math.atan(g) / Math.PI, DIODE_MAX / sampleRate) * Math.SQRT1_2 / DIODE_OS;
      this.b0 = (0.00045522346 + 6.1922189 * fx) / (1 + 12.358354 * fx + 4.4156345 * fx * fx);
      const k = fx * (fx * (fx * (fx * (fx * (fx + 7198.6997) - 5837.7917) - 476.47308) + 614.95611) + 213.87126) + 16.998792;
      this.k = k * r;
      // 山を上げたぶん下がる音量を戻す。Open303 は出口をさらに 2 倍していたが、
      // レゾナンス 0 で低い音がそのまま通るように、それを外した
      this.gain = ((k / 17 - 1) * r + 1) * (1 + r);
      if (!this.ha) this.ha = Math.exp(-2 * Math.PI * DIODE_HP / (sampleRate * DIODE_OS));
      this.lg = g; this.lr = r;
    }
    const b0 = this.b0, k = this.k, ha = this.ha, hb = 0.5 * (1 + ha);
    let { y1, y2, y3, y4, hx, hy } = this;
    // 入口は同じ値のまま 4 回回し、最後の値を出す
    for (let j = 0; j < DIODE_OS; j++) {
      // 帰還のハイパス(1 極)
      const fb = k * Math.max(-DIODE_FB, Math.min(DIODE_FB, y4));
      hy = hb * (fb - hx) + ha * hy;
      hx = fb;
      let y0 = x - hy;
      if (d > D_MIN) y0 = sat(y0, d);
      // 4 つの段。隣どうしが引き合う
      y1 += 2 * b0 * (y0 - y1 + y2);
      y2 += b0 * (y1 - 2 * y2 + y3);
      y3 += b0 * (y2 - 2 * y3 + y4);
      y4 += b0 * (y3 - 2 * y4);
    }
    this.y1 = y1; this.y2 = y2; this.y3 = y3; this.y4 = y4; this.hx = hx; this.hy = hy;
    return this.gain * y4;
  }
}

const KINDS = { lowpass: LowPass, highpass: HighPass, ladder: Ladder, bandpass: BandPass, notch: Notch, highpass4: HighPass4, diode: Diode };
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
      f.flush();
    }
    return this.alive;
  }
}

registerProcessor('mmsxx-filter', FilterNode);
`;
