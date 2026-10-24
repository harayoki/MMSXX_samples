// MML (Music Macro Language) コンパイラ
// 対応コマンド (MSX BASIC の PLAY 文風):
//   cdefgab  音符 (直後に +/# =半音上げ, - =半音下げ, 数字=音長, . =付点)
//   r        休符
//   o<n>     オクターブ 1..8 (o4 の a = 440Hz)
//   > <      オクターブ上げ / 下げ
//   l<n>     デフォルト音長 (4=四分音符)
//   t<n>     テンポ (四分音符/分)
//   v<n>     音量 0..15
//   q<n>     ゲート 1..8 (8=フルレングス, 既定7)
//   &        タイ / スラー。高さが同じなら長さを足し、違えば
//            キーオンし直さずに音程だけ差し替える(a&<c のように
//            & のあとでオクターブも動かせる)
//   c*g2     ポルタメント。直前の音から * のあとの音へ滑る。
//            数字は滑り終わるまでの長さ(省くと直前の音のまま)
//   [ ... ]<n>  繰り返し (n 省略時 2 回, ネスト可。0 なら中身ごと消える)
//   #label LOOP     くり返すときに戻る先。曲の中に 1 か所だけ置ける
//   p<n>     定位 0..3 (PMD 互換。0=消音 1=右 2=左 3=中央)
//
// マクロ (V1MML の `$名前=中身` / サクラの `Str A = {…}` に倣う):
//   $名前 = { ... }  登録。中身に音色も繰り返しも書ける
//   $名前            呼び出し。マクロの中からマクロも呼べる
//            後ろで登録したものを前で呼んでよい。名前は a-z 0-9 _ で書く
//            (日本語も動くが勧めない。登録のときに知らせる)。
//            見えるのはチャンネル 1 本ぶん(曲をまたぐ使い回しは部品箱の仕事)
//
// 書き方:
//   空白と改行は読み飛ばすので、何行に分けて書いてもよい
//   //          行末までの注釈
//   /* ... */   注釈。何行でもまたげる
//   曲そのもの以外のこと(何のために作ったか / どういう構成か)は、
//   別のファイルではなくこの中に書く。離れたところに置くと必ずずれていく
//
// 音色・効果 (チャンネルごとに途中で切り替えられる):
//   @<n>     波形 0..6  (WAVEFORMS 参照。0=矩形12.5% .. 6=ノイズ)
//   @{名前}  波形を名前で指定 (pulse(12) / pulse(25) / pulse(50) /
//            triangle / saw / sine / noise)。番号より名前を勧める。
//            番号はエンジンの都合で動くことがあるが、名前は動かない
//   @e<n>    エンベロープ 0..5 (ENVELOPES 参照)
//   @e{名前} エンベロープを名前で指定 (flat / soft / percussive /
//            piano / pad / pluck)
//   @d<n>    デチューン (セント単位。2 音を少しずらして重ねる。0 で無効)
//   @m<n>    ビブラート。深さをセントで 0..100 (0 で無効)。速さは 5.5Hz。
//            @m{深さ,速さ,遅れ} で速さ(Hz)と遅れ(フレーム)も決める
//   @s<n>    エコー(ディレイ) 0..9 (0 で無効。数字が大きいほど強い)
//   @o<n>    オクターブ重ね 0..2 (0 で無効)。同じ音の 1 オクターブ下を
//            重ねて厚くする。2 なら 2 オクターブ下も足す
//   @p{x,y,z} 位置。x 左右(-1 左 / +1 右) y 上下 z 前後(+ が前)。
//            @p{x} なら左右だけ。p0..p3 はこの位置のうちの 4 点
//            (docs/STEREO.md)。鳴らし方はエンジン側が決める
//
// BASIC の BEEP で作っていた効果音。BEEP 音色が開く区間 @{beep…}{ ... } の中だけ:
//   <n>          待ち n で 1 つ鳴らす。長さは今の l
//   <a>-<b>      待ち a から b へ 1 ずつ
//   <a>-<b>,<s>  s ずつ飛ばす
//   @tick <us>   待ち 1 回にかかる時間 (マイクロ秒)。既定 150。機械の速さそのもの
//   @carrier <hz> @jitter <v> @frame <hz> @display <v>
//                音色が持っている値の上書き。書かなければ音色のまま
//
// カセットのロード音。音色が開く区間 @{tape…}{ ... } の中だけ:
//   @baud <n>    ボーレート。既定 1200。マーク音 = n*2 Hz / スペース音 = n Hz。
//                データの地の音程は n/12 (1 バイトが 12 ビット枠に入るため)
//   @seed <n>    でたらめの種。既定 1
//   @hiss <v>    地のノイズ 0..1。書かなければ音色のまま
//   @wow <v>     回転むら 0..1。書かなければ音色のまま
//   @muffle <hz> 高いところを落とす。書かなければ音色のまま
//   @bytes <16進> `?` の中身。`random` でたらめへ戻す(既定)。
//                ビットの並びがそのまま波の形になるので、音色を選ぶようなもの
//   =<len>       一定の音(パイロット)を len ぶん
//   ?<len>       データを len ぶん

// GM の音色名。`gm:` を名前で書けるようにするため(sound/gm.js)
import { gmIndex, gmLike } from './gm.js';
// 音色の登録。`#voice` の行き先の 1 つ。tones.js もこちらを読むが、
// あちらは読み込みのときに何もしないので、輪になっても困らない
import { registerTone } from './tones.js';
import { FILTERS } from './filter.js';
import { MASTER_FX, MASTER_PRESETS, fxCost, fxVariants, noteLenSec } from './fx.js';

/**
 * チャンネルの出口(`@f`)に置けるもの。フィルタ(`sound/filter.js`)と、
 * 全体にも掛けられるエフェクト(`sound/fx.js` の echo・reverb)。
 * 置き場所が違うだけで、同じものを同じ名前で書く
 */
const FX_KINDS = { ...FILTERS, ...MASTER_FX };

/** 1 本のチャンネルで、重さの見積もりがこれを越えたら知らせる(締め切りに対する %) */
const FX_WARN_COST = 10;

/**
 * 1 台(番号 1 つ)に作る並びの数。これを越えたら知らせる / 断る。
 *
 * 動かせない値を書き替えると、その組み合わせごとに並びが要る。
 * 並びはずっとつないだままで、どれにも音が入り続ける(溜まったぶんを
 * 切らないため)。だから数がそのまま重さになる。
 *
 * 行ったり来たりするぶんは増えない(同じ組み合わせは使い回す)。
 * 増えるのは、書くたびに違う値を書いたときだけ(2026-10-23)
 */
const FX_WARN_VARIANTS = 4;
const FX_MAX_VARIANTS = 16;

/** ビブラート(`@m`)の深さの上限(セント)。音色の `pitch.vibrato` と揃えた */
export const VIB_MAX = 100;
/** ビブラートの速さを書かなかったときの既定(Hz)。深さによらない */
export const VIB_SPEED = 5.5;

const SEMI = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
/** 音名の順番(`c` から数えて何番目の字か)。12 でない音律で使う */
const LETTER = { c: 0, d: 1, e: 2, f: 3, g: 4, a: 5, b: 6 };
/** 半音の数から音名の順番へ戻す。半音記号を書いたところは undefined */
const LETTER_OF_SEMI = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };

/**
 * 音律。音名を Hz にするときの物差し。
 *
 * 根音からのセントで、1 周ぶんを並べる。12 個並べたものは半音の段にそのまま
 * 当たるので、半音記号(`+` `-`)も書ける。12 でないものは音名の順番
 * (`c d e f g a b`)で数え、並べた数で 1 周する。5 つなら `c d e f g` で
 * 1 周し、`a` は次の周の 1 番目になる。
 *
 * 12 平均律から外れた音階は、`@d` でセントを 1 音ずつ足すしかなかった。
 * 曲としては書けない(2026-09-23)。
 */
export const TUNINGS = {
  equal: {
    cents: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
    desc: 'Twelve equal steps. The default, and what almost every chiptune uses.',
    descJa: '12 平均律。既定。ふつうの曲はこれです。',
  },
  pure: {
    // 5 限の純正律。1/1 16/15 9/8 6/5 5/4 4/3 45/32 3/2 8/5 5/3 9/5 15/8
    cents: [0, 111.73, 203.91, 315.64, 386.31, 498.04, 590.22, 701.96,
      813.69, 884.36, 1017.6, 1088.27],
    desc: 'Five-limit just intonation. Thirds and fifths lock; distant keys do not.',
    descJa: '純正律(5 限)。3 度と 5 度がぴたりと合います。遠い調へ回すと濁ります。',
  },
  pythagorean: {
    // 5 度(3/2)を積んで作る。3 度が広い
    cents: [0, 90.22, 203.91, 294.13, 407.82, 498.04, 611.73, 701.96,
      792.18, 905.87, 996.09, 1109.78],
    desc: 'Built from stacked perfect fifths. Wide, bright thirds.',
    descJa: 'ピタゴラス音律。5 度を積んで作ります。3 度が広く、明るく張ります。',
  },
  'meantone:quarter': {
    // 1/4 コンマ中全音。5 度を狭めて 3 度を純正に寄せる
    cents: [0, 76.05, 193.16, 310.26, 386.31, 503.42, 579.47, 696.58,
      772.63, 889.74, 1006.84, 1082.89],
    desc: 'Quarter-comma meantone. Pure thirds, narrow fifths, a wolf you must avoid.',
    descJa: '中全音(1/4 コンマ)。3 度が純正で、5 度が狭くなります。使えない調が出ます。',
  },
  'meantone:sixth': {
    // 1/6 コンマ。1/4 より 5 度の狭めかたがゆるい
    cents: [0, 88.59, 196.74, 305.33, 393.48, 501.63, 590.22, 698.37,
      786.96, 895.11, 1003.26, 1091.85],
    desc: 'Sixth-comma meantone. A gentler compromise than quarter-comma.',
    descJa: '中全音(1/6 コンマ)。1/4 より穏やかで、使える調が広がります。',
  },
  slendro: {
    // ジャワ・バリの 5 音。5 等分に近い。楽団ごとの差は小さい
    cents: [0, 240, 480, 720, 960],
    desc: 'Javanese slendro, five nearly equal steps. Values are a representative set.',
    descJa: 'スレンドロ。ほぼ 5 等分の 5 音です。値は代表的なものです。',
  },
  pelog: {
    // ジャワの 7 音。段の幅がばらばらなのがこの音階の顔
    cents: [0, 120, 270, 540, 670, 785, 950],
    desc: 'Javanese pelog, seven uneven steps. Values are a representative set.',
    descJa: 'ペロッグ。段の幅が不揃いな 7 音です。値は代表的なものです。',
  },
  'pelog:bem': {
    // 7 音のうち 1 2 3 5 6 を使う旋法
    cents: [0, 120, 270, 670, 785],
    desc: 'Pelog bem: the five degrees a Javanese piece in bem actually uses.',
    descJa: 'ペロッグのブム。7 音のうち実際に使う 5 つだけを並べたものです。',
  },
  'pelog:barang': {
    // 2 3 5 6 7 を使う旋法。ブムと 2 音が入れ替わる
    cents: [0, 150, 550, 665, 830],
    desc: 'Pelog barang: the other five-degree mode, two tones apart from bem.',
    descJa: 'ペロッグのバラン。ブムとは 2 音が入れ替わります。',
  },
};

/**
 * `#tuning` の字を読む。
 *
 * ```
 * #tuning pure a                       名前と根音
 * #tuning 0 204 386 498 702 884 1088   セントで直に
 * #tuning 0 240 480 720 960 /1200      1 周の幅も書ける
 * ```
 *
 * 名前とセントの並びは混ぜられない。置き換えなのか足すのか読めなくなる。
 *
 * @param {string} text 指示行の値のところ
 * @returns {{cents:number[], period:number, root:string}|null} 読めなければ null
 */
function readTuning(text) {
  const words = String(text ?? '').trim().split(/[\s,]+/).filter(Boolean);
  if (!words.length) return null;
  let period = 1200;
  const rest = [];
  for (const w of words) {
    if (!w.startsWith('/')) { rest.push(w); continue; }
    const n = Number(w.slice(1));
    if (!(n > 0)) bad(`[ChpTnSnd] MML: "#tuning" の 1 周の幅 "${w}" は読めません`);
    period = n;
  }
  // 並びの最後が音名 1 文字なら、それが根音。書かなければ c
  let root = 'c';
  const last = rest[rest.length - 1];
  if (rest.length > 1 && last && LETTER[last.toLowerCase()] !== undefined) {
    root = rest.pop().toLowerCase();
  }
  const isNum = (w) => /^-?[\d.]+$/.test(w);
  if (rest.some(isNum) && rest.some((w) => !isNum(w))) {
    bad('[ChpTnSnd] MML: "#tuning" は名前かセントの並びのどちらかです'
      + '(混ぜると、置き換えなのか足すのか読めません)');
  }
  if (rest.every(isNum)) {
    const cents = rest.map(Number);
    if (cents.length < 2) bad('[ChpTnSnd] MML: "#tuning" のセントは 2 つ以上書きます');
    return { cents, period, root, name: null };
  }
  const name = rest.join(' ').toLowerCase();
  const set = TUNINGS[name];
  if (!set) {
    bad(`[ChpTnSnd] MML: 音律 "${name}" は知らない名前です`
      + `(使えるのは ${Object.keys(TUNINGS).join(' / ')})`);
  }
  if (name === 'equal' && root !== 'c') {
    warn('[ChpTnSnd] MML: 12 平均律に根音はありません。どこから数えても同じです');
  }
  return { cents: set.cents, period, root, name };
}

/**
 * ビープの待ち時間を周波数に直す。
 *
 * 8 ビット機のスピーカーは 1 ビットしか無いので、音程を作る手が
 * 「待つ回数」しかなかった。BASIC ではこう書く:
 *
 *     10 FOR I=1 TO 200          1 つめの FOR。音程を変えていく
 *     20   OUT P,1 : OUT P,0     合間の ON/OFF
 *     30   FOR J=1 TO I : NEXT J 2 つめの FOR。この待ちが音程になる
 *     40 NEXT I
 *
 * 待ちが半周期になるので、周波数は待ちの回数に反比例する(1/n)。
 * ここが音階と決定的に違うところで、上のほうは 1 段でオクターブ跳ぶ
 * (n=1,2,3,4 が 1/1, 1/2, 1/3, 1/4 = 原音・オクターブ下・その 5 度下…)。
 * 下へ行くほど刻みが詰まる。あの歪んだ掃引はこの形から出ている。
 * 半音刻みで書くと、この歪みが消えてただの音階になってしまう。
 *
 * @param {number} n 待ちの回数
 * @param {number} us 1 回まわるのにかかる時間(マイクロ秒)
 */
function beepFreq(n, us) {
  return 1e6 / (2 * Math.max(1, n) * Math.max(1, us));
}

/** 1 回で出せる音の数の上限(書き間違いで固まらないように) */
const BEEP_MAX_STEPS = 4096;

/**
 * 波形テーブル。
 * ファミコン(2A03)の矩形波デューティ比 12.5/25/50% と、
 * MSX(AY-3-8910)の矩形波(50%固定)、三角波、ノコギリ波、サイン波、ノイズ。
 *
 * どれも実機の写し。音色を書かなかったときに鳴るものも、この中から選ぶ。
 */
export const WAVEFORMS = [
  { id: 0, name: 'pulse(12)', kind: 'pulse', duty: 0.125, role: 'lead',
    dev: ['done'],
    descJa: '幅 12.5% の矩形波。プリセットの矩形波 3 つのうちいちばん細く、鼻にかかって前へ出る。ファミコンのリードの音',
    desc: 'Pulse at 12.5% duty. The thinnest of the three built-ins — nasal and cutting, the classic NES lead.'  }, // ファミコン風 12.5%
  { id: 1, name: 'pulse(25)', kind: 'pulse', duty: 0.25, role: 'lead',
    dev: ['done'],
    descJa: '幅 25%。12.5% より太いが、まだはっきり細い。いちばん使い出のある音',
    desc: 'Pulse at 25% duty. Fuller than 12.5% but still clearly reedy. The most common all-round chip voice.'  },  // ファミコン風 25%
  { id: 2, name: 'pulse(50)', kind: 'pulse', duty: 0.5, role: 'lead',
    // `pulse` だけで呼べば矩形波。幅を書かなければ 50%(仲間の既定)
    dev: ['done'],
    descJa: 'ただの矩形波(幅 50%)。中が空いた、上と下の同じ音。MSX の PSG はこれしか出せないので、あの機械の音そのもの',
    desc: 'Square wave (50% duty). Hollow and even. The only pulse an AY-3-8910 can make, so this is the MSX/ZX sound.'  },   // ファミコン/MSX 50%
  // 75% は 25% と上下が逆なだけで同じ音に聞こえるので置かない
  { id: 3, name: 'triangle', kind: 'triangle', role: 'bass',
    descJa: '三角波。丸くて倍音が少ない。ファミコンの実機では、この声だけ音量つまみが無かった',
    desc: 'Triangle. Rounded, few harmonics. On real NES hardware this channel has no volume control at all.'  },          // 三角波
  { id: 4, name: 'saw', kind: 'saw', role: 'lead',
    descJa: 'のこぎり波。倍音が全部そろっているので、ざらついて明るい',
    desc: 'Plain sawtooth ramp. Buzzy and bright; every harmonic is present.'  },                    // ノコギリ波
  { id: 5, name: 'sine', kind: 'sine', role: 'bass',
    descJa: 'サイン波。倍音がまったく無い。1 本だけだと素っ気ないが、低いところや他の音の下に敷くと効く',
    desc: 'Sine. No harmonics at all — plain to the point of being characterless on its own, useful as a sub or under other voices.'  },                  // サイン波
  { id: 6, name: 'noise(white)', kind: 'noise', role: 'noise',
    descJa: 'ノイズ。音程は無いが、書いた高さで粗さが変わる。打楽器と効果音に使う',
    desc: 'White noise. No pitch as such, though the note still changes how coarse it sounds. Used for drums and effects.'  },                // ノイズ
  // 幅 33%。3 の倍数の倍音が抜ける(2026-10-16。tomitaStringsAlt の波形から基本の音色へ)
  { id: 7, name: 'pulse(33)', kind: 'pulse', duty: 1 / 3, role: 'lead',
    desc: 'Pulse at 33% duty. Every third harmonic drops out, so it is bright but hollow in a different way from the square.' },
];

/**
 * ノイズの作り分け。実機はチップごとにノイズの出し方が違う。
 *
 * ---- 何が違うか ----
 *
 * どのチップも同じ仕掛け(帰還を掛けた並びを回して 0 と 1 を吐く)で、
 * 違うのは輪の長さと回す速さの 2 つだけ。
 *
 * - 輪が長い(15〜17 段)と、繰り返しが聞こえないので白いノイズになる
 * - 輪が短い(6〜9 段)と、繰り返しそのものが音程として聞こえる。
 *   ファミコンの「短周期」、SN76489 の「周期ノイズ」、
 *   ゲームボーイの 7 段がこれで、金属質なブザーになる
 * - 回す速さで明るさが決まる。AY は 5 ビットの分周(1〜31)、
 *   ファミコンは 16 段の表、SN76489 は 3 段 + 「3 番の音程を使う」
 *
 * ---- ここでの持ち方 ----
 *
 * 輪の長さ(`bits`)と、速さの倍率(`rate`)の 2 つだけを持つ。
 * チップごとの分周の刻みまでは持たない — 書いた音の高さで速さが決まる
 * 作りなので、そこへ倍率を掛けるだけで同じ幅が出せる。
 *
 * 書き出すときは、ここが素直に落ちない。ノイズは独立した音量を持たず、
 * 混ぜた声の音量つまみに従うチップが多い
 * (docs/ENGINE_TODO.md の「鳴らす側では考えなくてよいもの」)。
 */
export const NOISE_VARIANTS = {
  'noise(metal)': { bits: 7, role: 'noise',
    descJa: '短い輪を回すノイズ。繰り返しが音程として聞こえるので、'
          + '砂ではなく金属質のブザーになる。ファミコンの短周期・'
          + 'SN76489 の周期ノイズ・ゲームボーイの 7 段がこれ',
    desc: 'Noise on a short loop, so the repeat itself is audible as pitch — a metallic buzz rather than sand. '
        + 'The NES short mode, the SN76489 periodic noise and the Game Boy 7-bit mode are all this.' },
  'noise(hiss)': { rate: 2.5, role: 'noise',
    descJa: '同じ白いノイズを速く回したもの。細かくて明るい。シンバルと風',
    desc: 'The same white noise run faster: finer and brighter. Cymbals and wind.' },
  'noise(rumble)': { rate: 0.3, role: 'noise',
    descJa: '同じ白いノイズを遅く回したもの。粒が粗く、低いところが厚い。爆発と地響き',
    desc: 'The same white noise run slower: coarse grain with weight underneath. Explosions and rumble.' },
};

/**
 * 矩形波とノイズの仲間。作り分けの軸と値の説明(`describeVoice()` が返す)。
 * 呼ばれるたびに入れ直さない(二度目からは何もしない)
 */
export function registerCoreFamilies() {
  registerFamily('pulse', {
    desc: 'Pulse wave with a fixed duty cycle. For a width that moves, use a tone with a duty table.',
    params: [{
      name: 'width', default: '50',
      desc: 'Share of each cycle spent high, in percent. 75% sounds the same as 25%, so it is not offered.',
      values: [
        { value: '12', desc: '12.5%. The thinnest built-in pulse: nasal and cutting, the classic NES lead.' },
        { value: '25', desc: '25%. Fuller than 12.5% but still reedy. The most common all-round chip voice.' },
        { value: '33', desc: '33%. Every third harmonic drops out: bright, with a hollow of its own, between 25% and the square.' },
        { value: '50', desc: '50%, a square wave. Hollow and even; the only width an AY-3-8910 can make.' },
      ],
    }],
  });
  registerFamily('noise', {
    desc: 'Noise from a feedback shift register. Chips differ only in the loop length and how fast it runs.',
    params: [{
      name: 'kind', default: 'white',
      desc: 'Which loop and speed to use.',
      values: [
        { value: 'white', desc: 'Long loop, plain white noise. Drums and effects.' },
        { value: 'metal', desc: 'Short loop, so the repeat is heard as pitch: a metallic buzz (NES short mode, SN76489 periodic noise).' },
        { value: 'hiss', desc: 'White noise run faster: finer and brighter. Cymbals and wind.' },
        { value: 'rumble', desc: 'White noise run slower: coarse, with weight underneath. Explosions and rumble.' },
      ],
    }],
  });
}

/**
 * ノイズの作り分けを登録する(エンジンが読み込まれるときに走る)。
 * 二度呼ばれても止まらない(ほかの register* と同じ)。
 */
export function registerNoiseVariants() {
  for (const [name, v] of Object.entries(NOISE_VARIANTS)) {
    if (findWave(name) >= 0) continue;
    WAVEFORMS.push({
      id: WAVEFORMS.length, name, kind: 'noise',
      // 輪の長さと速さ。書かなければ素の白いノイズと同じ
      bits: v.bits || 0, rate: v.rate || 1,
      role: roleOf(v.role, name), ...metaOf(v),
    });
  }
}

/**
 * 音色を書かなかったときに鳴るもの。
 *
 * 番号ではなく名前で決める。番号は音色を足すと動くので、
 * ここに数を書くと足した誰かが既定を変えてしまう。
 */
export const DEFAULT_WAVE = 'pulse(50)';

/**
 * エンベロープを名乗っていない音色が着るもの。
 *
 * どの音色もエンベロープを持っている、という形にするためにある。
 * 名乗っていない音色は「これを名乗っている」と見なす。
 */
export const DEFAULT_ENV = 'flat';

/**
 * エンベロープのプリセット。`a` `d` `r` は秒で、音符の長さでは伸び縮みしない。
 *
 * 0〜11 は ADSR 型、12 以降は `table` を 1 フレームずつ読む配列型。
 * どれを選ぶかは `descJa` / `desc` を読めば分かるようにしてある。
 */
export const ENVELOPES = [
  { id: 0, name: 'flat',    a: 0.005, d: 0,    s: 1.0,  r: 0.01,
    descJa: '鳴っているあいだ、ずっと同じ大きさ。上がりも下がりもしない。'
          + '実機のチップはここから始まる。大きさを v だけに決めさせたいときはこれ',
    desc: 'Holds one level from start to finish \u2014 nothing rises, nothing falls. '
        + 'Where chip hardware starts, and what to pick when v alone should decide how loud a note is.' },
  { id: 1, name: 'soft',    a: 0.08,  d: 0.1,  s: 0.8,  r: 0.15,
    descJa: 'ふわっと入って、上から少しだけ落ち着く。角が取れるが、楽器らしくはなりすぎない。'
          + '速い刻みの伴奏が耳に刺さるときに',
    desc: 'Eases in, then settles a little below the top. Takes the sting out without turning a part '
        + 'into an instrument \u2014 handy when a fast accompaniment starts to bite.' },
  { id: 2, name: 'percussive', a: 0.002, d: 0.25, s: 0.0, r: 0.05,
    descJa: '一気に立ち上がって、そのまま消える。伸ばすところが無いので、叩いた音になる',
    desc: 'Straight up and straight back down with nothing held in between. What is left reads as a hit.' },
  { id: 3, name: 'piano',   a: 0.004, d: 0.4,  s: 0.35, r: 0.12,
    descJa: '速く立ち上がって長く減り、3 分の 1 あたりで落ち着いて、そのまま残る。'
          + '叩いて響くものの形',
    desc: 'A quick start, a long fall, then it settles about a third of the way up and rings on. '
        + 'The shape of something struck that keeps sounding.' },
  { id: 4, name: 'pad',     a: 0.25,  d: 0.2,  s: 0.7,  r: 0.2,
    descJa: 'ゆっくり入って、ゆっくり抜ける。あいだはずっと高いまま。'
          + '後ろで鳴らして場所を埋めるための形',
    desc: 'Slow to arrive and slow to leave, high all the way between. '
        + 'Made for sitting behind everything else and filling the room.' },
  { id: 5, name: 'pluck',   a: 0.002, d: 0.12, s: 0.15, r: 0.08,
    descJa: 'はじいた瞬間だけ大きく、すぐ小さくなって、わずかに残る。'
          + '速く刻んでも 1 粒ずつ立つ',
    desc: 'Loud for an instant, gone almost as fast, with a trace left behind. '
        + 'Even at speed each note keeps its own edge.' },

  // ---- ここから下は、上の 6 つのあとに足したもの ----
  { id: 6, name: 'snap',    a: 0.001, d: 0.06, s: 0,    r: 0.02,
    descJa: 'percussive をさらに短くしたもの。ほとんど点にしか聞こえないので、'
          + '拍を刻むだけの声に',
    desc: 'Percussive cut shorter still \u2014 barely more than a dot. For a voice whose only job is to mark the beat.' },
  { id: 7, name: 'bell',    a: 0.002, d: 1.2,  s: 0,    r: 0.1,
    descJa: '一気に立ち上がって、長い時間をかけて消えていく。伸ばすところが無いので、'
          + '長い音符を書いても途中で消える',
    desc: 'Struck at once, then a long slow fade. There is nothing to hold, so even a long note dies away inside itself.' },
  { id: 8, name: 'organ',   a: 0.01,  d: 0.05, s: 0.9,  r: 0.03,
    descJa: '素早く立ち上がって、ほんの少し落ちてから伸びる。flat ほど硬くなく、'
          + '押している間はずっと鳴っている',
    desc: 'Up fast, a small settle, then it stays. Softer than flat at the edges but just as steady while held.' },
  { id: 9, name: 'strings', a: 0.15,  d: 0.1,  s: 0.85, r: 0.175,
    descJa: 'ゆっくり立ち上がって高いまま伸び、離しても尾を引く。'
          + 'pad より入りが速く、尾が長い',
    desc: 'Arrives unhurried, holds high, and trails after the note ends. Quicker in than pad, longer out.' },
  { id: 10, name: 'swell',  a: 0.7,   d: 0,    s: 1,    r: 0.2,
    descJa: '入りだけが長い。音の頭が無いので、どこから始まったか分からないまま大きくなる。'
          + '上まで来るのに 0.7 秒かかるので、短い音符に着せるとほとんど鳴らない',
    desc: 'All attack. With no front edge you cannot tell where it began, only that it grew \u2014 '
        + 'and it takes seven tenths of a second to get there, so a short note barely speaks at all.' },

  // 叩いて消える。`snap` と `percussive` のあいだが空いていた
  // (s が 0 のものは 0.06 / 0.25 / 1.2 秒しか無く、その中間が無い)。
  // 重ねものの頭に使うとちょうどよい — 8 分音符より短く落ちるので、
  // 音符の途中で消えて、下の音へ引き継いだように聞こえる
  { id: 11, name: 'tap',    a: 0.002, d: 0.12, s: 0,    r: 0.03,
    descJa: '叩いて、すぐ消える。snap より少し残るが、8 分音符より短く落ちるので、'
          + '音符が終わる前に消えている',
    desc: 'Struck and gone. It holds longer than snap but falls quicker than an eighth note, '
        + 'so it is already silent before the note ends.' },

  // ---- 配列式。1 フレーム(60 分の 1 秒)ずつ段で動く ----
  // なめらかな坂では作れない形(段で落ちる・持ち上がる・回りつづける)がこちら
  { id: 12, name: 'step',   a: 0, d: 0, s: 0, r: 0,
    table: [1, 0.87, 0.75, 0.62, 0.5, 0.37, 0.25, 0.12, 0], loop: null,
    descJa: '段で落ちる。なめらかに減るのではなく、1 フレームごとにカクッと下がる。'
          + '実機の駆動系が音量を書き換えていた動きそのもの',
    desc: 'Falls in steps rather than sliding \u2014 one notch per frame. The way a real driver rewrote the volume register.' },
  { id: 13, name: 'tremolo', a: 0, d: 0, s: 0.85, r: 0,
    table: [1, 1, 0.85, 0.7, 0.7, 0.85], loop: 0,
    descJa: '大きさが揺れつづける。戻る先が先頭なので、音符が長いほど何度も揺れる',
    desc: 'The level keeps rocking. It returns to the start, so the longer the note the more times it swings.' },
  { id: 14, name: 'blink',  a: 0, d: 0, s: 0.5, r: 0,
    table: [1, 1, 0.5, 0.5], loop: 0,
    descJa: '鳴る・止まるを速く繰り返す。止まる側は切れずに半分の大きさで残るので、'
          + '途切れずに刻んで聞こえる。実機で声が足りないときにやっていた手',
    desc: 'On, off, on, off, and quickly \u2014 except the off side is not silence but half, '
        + 'so the note keeps sounding while it beats. What you did on hardware when you had run out of voices.' },
  { id: 15, name: 'breath', a: 0, d: 0, s: 0.72, r: 0,
    table: [0.2, 0.7, 1, 1, 1, 0.95, 0.88, 0.82, 0.78,
            0.75, 0.7, 0.66, 0.7, 0.75, 0.78], loop: 9,
    descJa: '立ち上がって少し落ち着き、そこから揺れつづける。'
          + '戻る先が先頭ではなく途中なので、立ち上がりは 1 回きりで、伸ばすところだけが回る',
    desc: 'Rises, settles a little, and sways from there on. The loop point sits partway in '
        + 'rather than at the start, so the attack happens once and only the held part goes round.' },
  { id: 16, name: 'bounce', a: 0, d: 0, s: 0.1, r: 0,
    table: [1, 0.55, 0.25, 0.5, 0.2, 0.35, 0.14, 0.22, 0.09, 0.14, 0.07, 0.11],
    loop: 8,
    descJa: '落ちては少し戻る、を繰り返して小さくなり、そのあとは小さいまま跳ねつづける。'
          + '戻る先が途中なので、大きく跳ねるのは頭の何回かだけ',
    desc: 'Falls, springs back a little, falls further \u2014 and once it is quiet it keeps bouncing at that size. '
        + 'The loop point sits partway in, so the big bounces only happen at the top.' },

  // ADSR 型だが、番号は後ろに付ける。曲も部品も名前で持っている
  //(`@e{名前}`、`samples/songs/*.json` の `"env": "piano"`)ので、どこへ
  // 入れても鳴り方は変わらない。それでも後ろに付けるのは、一覧に並ぶ順が
  // 動かないほうが、前に見たものを探しやすいため(2026-09-24)。
  //
  // organ との違いは 3 つで、立ち上がりが 3 倍速く(3ms / 10ms)、
  // 伸びる高さが低く(65% / 90%)、終わりが 2 倍長い(60ms / 30ms)。
  // organ より沈んでいて、切れ際が柔らかい
  { id: 17, name: 'gradual', a: 0.003, d: 0.05, s: 0.65, r: 0.06,
    descJa: '素早く立ち上がり、すぐ少し沈んで、そこで伸びる。organ より低いところで'
          + '伸びるので前に出すぎず、音の終わりもなめらかに消える',
    desc: 'Up at once, a quick settle, then it holds \u2014 lower than organ, so it sits back '
        + 'in the mix rather than pushing forward, and it releases softly.' },
];

/**
 * エンベロープの時間を秒にする。
 *
 * `0.25` なら 0.25 秒。`'25%'` なら、その音が鳴っている長さの 25%。
 * 割合で書けるのは、音の長さに合わせて減衰を変えたい音色があるため
 * (古い曲の変換がそれで、長さごとに別のエンベロープを登録していた)。
 *
 * 秒か割合かを値の形で見分ける。欄を 2 つに分けないのは、`@s` の写しや
 * スラーが `d` を数で上書きする場所があるため。欄が 1 つなら、そこで
 * 割合ごと消える(2026-09-24)。
 *
 * @param {number|string} v 秒(数)か、割合(`'25%'`)
 * @param {number} len その音が鳴っている長さ(秒)
 * @returns {number} 秒
 */
export function envSec(v, len) {
  if (typeof v === 'string') {
    const n = parseFloat(v);
    return Number.isFinite(n) ? Math.max(0, n / 100 * len) : 0;
  }
  return Math.max(0, Number(v) || 0);
}

/**
 * エンベロープを足す。`@e{名前}` で呼べるようになる。
 *
 * ---- 2 通りの書き方 ----
 *
 * ADSR 型 — プリセットの 0〜10 と同じ形。`a` `d` `r` は秒で、
 * 音符の長さでは伸び縮みしない(実機の FM と同じ)。長い音は減りきってから伸び、
 * 短い音は減りきる前に切れる。
 *
 *     registerEnvelope('myBell', { a: 0.002, d: 0.9, s: 0, r: 0.05 });
 *
 * `a` `d` `r` は割合でも書ける。`'25%'` と書くと、その音が鳴っている長さの
 * 25% になる。長い音ほどゆっくり落ちる音色はこちら。秒と混ぜてよい。
 *
 *     registerEnvelope('myOld', { a: 0.002, d: '25%', s: 0, r: 0.05 });
 *
 * 100% を超える割合は書けるが、鳴っているあいだに最後まで進まないので
 * 知らせが出る。
 *
 * 配列式 — 1 フレーム(60 分の 1 秒)ずつ読む。なめらかな坂ではなく段になり、
 * `loop` を書くと最後まで行ったらそこへ戻って回りつづける。
 * ADSR で書けない形(途中で持ち上がる、うねる)はこちら。
 *
 *     registerEnvelope('myStep', { table: [1, .8, .6, .5], loop: 2 });
 *     //  1 → .8 → .6 → .5 → .6 → .5 → …  (2 番へ戻る)
 *
 * `loop` を書かなければ、最後の値のまま止まる。
 *
 * ---- 数の幅 ----
 *
 * 表の値は 0〜1。エンベロープは音量に掛かるものなので、`s`(ADSR の伸ばすところ)
 * と同じ幅にしてある。音色が持つ `vol` の表は 0〜15 で、あちらは掛けるのではなく
 * 音量そのものを置き換えるもの。同じ「表」でも別のものなので幅が違う。
 *
 * @param {string} name `@e{名前}` で呼ぶときの名前
 * @param {{a?:number|string, d?:number|string, s?:number, r?:number|string,
 *          table?:number[], loop?:number,
 *          desc?:string, descJa?:string, overwrite?:boolean}} spec
 *   a / d / r = 秒(数)か、鳴っている長さに対する割合(`'25%'`)。
 *   s = 伸ばすところの高さ(0〜1)。table = フレームごとの表(0〜1)。
 *   loop = 表のどこへ戻るか。desc / descJa = 何の音かの説明。
 *   overwrite = 同じ名前があっても上書きするか
 * @returns {number} エンベロープの番号(ふだんは名前で呼ぶので使わない)
 */
export function registerEnvelope(name, spec = {}) {
  noOldDescName(spec, 'registerEnvelope');
  const at = ENVELOPES.findIndex((e) => e.name.toLowerCase() === String(name).toLowerCase());
  if (at >= 0 && !spec.overwrite) {
    throw new Error(`[ChpTnSnd] エンベロープ "${name}" はもう登録されています`
      + '(差し替えるなら overwrite: true を渡してください)');
  }
  const entry = {
    id: at >= 0 ? at : ENVELOPES.length, name: String(name),
    desc: spec.desc == null ? null : String(spec.desc),
    descJa: spec.descJa == null ? null : String(spec.descJa),
  };
  if (Array.isArray(spec.table) && spec.table.length) {
    const table = spec.table.map((v) => Math.max(0, Math.min(1, Number(v) || 0)));
    entry.table = table;
    // 戻る先。表の外を指したら戻らない(黙って先頭へ回すと、書いた人の
    // 狙いと違う音が出たまま気づけない)
    const lp = spec.loop;
    entry.loop = Number.isInteger(lp) && lp >= 0 && lp < table.length ? lp : null;
    if (lp !== undefined && entry.loop === null) {
      console.warn(`[ChpTnSnd] エンベロープ "${name}": loop ${lp} は表の外です`
        + `(表は ${table.length} 個)。戻らずに最後の値で止まります`);
    }
    // ADSR の側からも読めるようにしておく(表を持たない道が触っても落ちない)
    entry.a = 0; entry.d = 0; entry.s = table[table.length - 1]; entry.r = 0;
  } else {
    // 秒(数)か、割合(`'25%'`)。割合はその音が鳴っている長さに掛かる
    const time = (v, dflt, key) => {
      if (typeof v !== 'string') return Math.max(0, Number(v ?? dflt) || 0);
      const m = /^\s*(\d*\.?\d+)\s*%\s*$/.exec(v);
      if (!m) {
        warn(`[ChpTnSnd] エンベロープ "${name}": ${key} "${v}" は読めません`
          + '(秒の数か、"25%" のような割合で書きます)');
        return Math.max(0, Number(dflt) || 0);
      }
      const n = Number(m[1]);
      if (n > 100) {
        warn(`[ChpTnSnd] エンベロープ "${name}": ${key} ${n}% は音の長さより長いので、`
          + '鳴っているあいだは最後まで進みません');
      }
      return `${n}%`;
    };
    entry.a = time(spec.a, 0.005, 'a');
    entry.d = time(spec.d, 0, 'd');
    entry.s = Math.max(0, Math.min(1, spec.s ?? 1));
    entry.r = time(spec.r, 0.01, 'r');
    entry.table = null;
    entry.loop = null;
  }
  if (at >= 0) ENVELOPES[at] = entry; else ENVELOPES.push(entry);
  return entry.id;
}

/**
 * 波形メモリを足す(実機の SCC / PC エンジンにあたるもの)。
 *
 * 1 周期ぶんの数字の並びを渡すと、その形の音が鳴るようになる。
 * `@{名前}` で呼べる。同じ名前で呼び直せば上書きする。
 *
 * @param {string} name 名前。`wave` で始める(波形メモリだと分かるように)
 * @param {number[]|Float32Array} samples 1 周期ぶん(-1..1)。32 個が実機らしい
 * @param {5|8} [bits=8] 段階の細かさ。5 なら 32 段階(PC エンジン風)、
 *   8 なら 256 段階(SCC 風)。粗いほどジャリッとした音になる
 * ディスクシステムの変調ユニットは、チップで鳴らす `registerFDS` が持つ。
 *
 * @param {{overwrite?:boolean}} [opts]
 *   overwrite = 同じ名前を差し替える
 * @returns {number} 波形の番号(ふだんは名前で呼ぶので使わない)
 */
export function registerWave(name, samples, bits = 8, opts = {}) {
  requireFreeName(name, opts.overwrite);
  const levels = (1 << bits) - 1;
  // 段階に丸める。ここで粗くしておくと、実機らしい歪みがそのまま音になる
  const wave = Float32Array.from(samples, (v) => {
    const q = Math.round((Math.max(-1, Math.min(1, v)) + 1) / 2 * levels);
    return q / levels * 2 - 1;
  });
  const at = findWave(name);
  const entry = { id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'wave', bits, samples: wave,
    role: roleOf(opts.role, name), ...metaOf(opts) };
  // 波形もエンベロープを連れてこられる(ビープや音色表と同じ)。
  // 形だけでは楽器にならないものがある — ゆっくり入るパッドがそれで、
  // 立ち上がりを速いままにすると、和音の中で旋律とぶつかる
  if (opts.env !== undefined) entry.defaultEnv = envIndex(opts.env);
  // 音量の下駄。書いたときだけ載る。
  //
  // 波形は山の高さを 1 に均すので、山の尖った形ほど実効値が下がる。
  // 正弦を何本か足したものは、同じ `v` で矩形波より 6dB ほど静かになる。
  // 形のほうは直せない(倍音の配合がその音色の中身なので)から、
  // ここで持ち上げる(2026-09-23)
  if (opts.gain > 0) entry.gain = Math.max(0.1, Math.min(4, Number(opts.gain)));
  // 鳴らす高さのずれ(オクターブ)。1 周の形に、書いた音より低い音を含めたいときに使う。
  // octaveSaw は 1 周に 1 オクターブ下を含むので -1(書いた高さでのこぎり波が鳴る)
  if (opts.octave) entry.octave = Math.max(-3, Math.min(3, Math.round(Number(opts.octave)) || 0));
  const tone = toneOf(opts, 'wave', name);
  if (tone) entry.tone = tone;
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/**
 * 音色の名前として使える名前(プリセットのもの)。文字を直に書かずにこれを使う。
 * 波形メモリや FM を足すと、その名前も `@{名前}` で呼べるようになる
 */
export const WAVE = {
  PULSE12: 'pulse(12)', PULSE25: 'pulse(25)', PULSE50: 'pulse(50)',
  TRIANGLE: 'triangle', SAW: 'saw', SINE: 'sine', NOISE: 'noise',
};

/**
 * 音色のロール。その音をどこで使うつもりか、という札。
 *
 * ---- なぜ音色が持つのか ----
 *
 * 書き出す先ごとに、当て先を選ばないといけない — Reaper なら音源、
 * MIDI なら GM の番号、ファミコン系ならどのチップへ回すか。
 * 名前や曲の並びから当てると、行き先が増えるたびに当てずっぽうが増える
 * (実際 3 か所に増えた。docs/EXPORT.md)。
 *
 * 音そのものが知っていることなので、音色に書く。
 * 書き出しも取り込みも、ここだけを見ればよくなる。
 *
 * 書かなくてよい。無ければ書き出す側が今までどおり当てる。
 *
 * @type {string[]}
 */
/**
 * 開発用の印。音色を精査するときの当たり先で、
 * 鳴りにも書き出しにも効かない。
 *
 * 音色は 100 を超えていて、どれを見直すべきかが頭の中にしか無かった。
 * ここに印を付けておけば、一覧の絞り込みからそのまま引ける。
 *
 * 書かなくてよい。印の無い音色が「見直さなくてよい」という意味ではなく、
 * 見直すと決めたものに付けるという向き。
 *
 * @type {string[]}
 */
/**
 * 鳴らし方が特別な音色の印。道具はここを見て扱いを変える。
 *
 * 名前では見分けない。名前に意味を持たせると名前を変えられなくなるので、
 * 音色の側が自分で言う。
 *
 * @type {string[]}
 */
export const SPECIALS = [
  // 音符では鳴らない。`=` を書いたときだけロード音が組み立てられる
  'tape',
  // 中で計算している。発振器を並べるのではなく、常駐の処理器
  // (AudioWorklet)へ音符を渡す。処理器が読めないと鳴らない唯一の音色
  'worklet',
];

export const DEV_MARKS = [
  'done',    // 確定。これはもう動かさない — 名前も音も、当てにしてよい
  'spec',    // 要仕様。どういうものにするかがまだ決まっていない
  'wip',     // 作業中。鳴るが、まだ手を入れる
  'check',   // 要確認。聞き直したい。ほかと並べて確かめる
  'dup',     // 重複。似たものがある。まとめるか、違いをはっきりさせるか決める
  'drop',    // 削除。落とす候補。使われていないか、別のもので足りている
];

export const ROLES = [
  'lead',     // 旋律。いちばん前に出るもの
  'counter',  // 対旋律
  'chord',    // 和音・パッド
  'bass',     // 低音
  'arp',      // 分散和音
  'perc',     // 打楽器
  'noise',    // ノイズを楽器として使うもの(ハイハット・砂・風)
  // 曲の部品ではないもの。テープの読み込み音・当たった音・落ちる音。
  // `noise` と分けたのは、あちらが曲の中で拍を刻むのに対して
  // こちらは曲の外で 1 回鳴るものだから。見本の曲も当てはめも変わる
  'se',
];

/**
 * ロールを整える。知らない言葉なら知らせるが、捨てない。
 *
 * ---- 書き間違いで音が作れなくなるほうが困る ----
 *
 * ここは音を鳴らす手前なので、止めない・落とさない。知らない言葉は
 * そのまま残す — 書いた本人には意味があるし、あとで語彙が増えることもある。
 *
 * 知らないロールは、どの当てはめ表にも当たらないだけ。
 * そこから先は名前やトラックのロールへ落ちる(docs/EXPORT.md の「何を当てるか」)。
 *
 * 黙ってはいない。書き間違いに気づけないと、なぜ当たらないのか分からない。
 *
 * 音色を足すところ(tones.js など)からも呼べるように出しておく。
 */
export function roleOf(role, name) {
  if (role == null) return null;
  const s = String(role).trim().toLowerCase();
  if (!s) return null;
  if (!ROLES.includes(s)) {
    console.warn(`[ChpTnSnd] 音色 "${name}" のロール "${role}" は知らない言葉です `
      + `(決まっているのは ${ROLES.join(' / ')})。`
      + 'そのまま持ちますが、書き出しの当てはめには当たりません');
  }
  return s;
}

/**
 * 音色のロールを引く。無ければ null。
 * @param {number|string} what 波形の番号か名前
 * @returns {string|null}
 */
export function waveRole(what) {
  return waveMeta(what)?.role ?? null;
}

export const STEALS = [
  'ok',       // 取ってよい。割り込まれても、戻ったときに聞いて分からない
  'avoid',    // できれば取らない。戻ったときに頭が聞こえる
  'unknown',  // まだ測っていない。どちらか分からない
];

/**
 * 声の取り合いの目安を整える。知らない言葉なら知らせるが、捨てない。
 *
 * ---- 禁止ではない ----
 *
 * `avoid` は「取らない」ではなく「できれば取らない」。ほかに取れるものが
 * 無ければ取る。無理やり割り込んで面白い効果が出ることもあるので、止めない
 * (`role` と同じ扱い。止めない・落とさない)。
 *
 * ---- 2 値で始める ----
 *
 * 順位の数にはしない。いま分かっているのは「戻ったときに頭が聞こえるか」の
 * 1 つだけで、数にしても埋める材料が無い。数が要ると分かってから増やす
 * (→ docs/TODO.md の「チャンネルの圧縮」)。
 *
 * ---- `unknown` と、書かないこと(null)は別 ----
 *
 * `unknown` は「測っていないと分かっている」印。null は「何も書いていない」。
 * どちらも目安としては使えないが、音色を足す人には違いがある —
 * `unknown` は測れば埋まるもの、null は測る筋が無いもの。
 *
 * 書かないままにすると、書き忘れと見分けが付かない。測っていない音色が
 * あることが読む側に伝わらないので、分かるように書く(2026-10-03)。
 *
 * @param {string|null|undefined} steal
 * @param {string} [name] 知らせに出す音色の名前
 * @returns {string|null}
 */
export function stealOf(steal, name = '?') {
  if (steal == null) return null;
  const t = String(steal).trim().toLowerCase();
  if (!t) return null;
  if (!STEALS.includes(t)) {
    console.warn(`[ChpTnSnd] 音色 "${name}" の steal "${steal}" は知らない言葉です `
      + `(決まっているのは ${STEALS.join(' / ')})。`
      + 'そのまま持ちますが、声の取り合いの目安には使われません');
  }
  return t;
}

/**
 * 音色の `steal` を引く。書いていなければ null。
 *
 * null も `unknown` も「取ってよい」ではない。どちらも決まっていない、
 * という意味。違いは、`unknown` が測れば埋まるもので、null は何も書いて
 * いないもの。読む側(チャンネルの圧縮)がまだ無いので、いまは引けるだけ。
 *
 * @param {number|string} what 波形の番号か名前
 * @returns {string|null}
 */
export function waveSteal(what) {
  return waveMeta(what)?.steal ?? null;
}

/**
 * 音色に添える覚え書き。ロールのほかに、決まった形でないものも持てる。
 *
 * ---- なぜ 2 つに分かれているのか ----
 *
 * ロールは 8 通りしかないので、そこへ入りきらないことがある —
 * 「歪ませてある」「短く切って使う」「ファミコンなら三角波へ」。
 * 決めごとにすると数が増えるばかりなので、普通の文で書けるようにする。
 *
 * | | 誰が読むか | 語彙 |
 * | --- | --- | --- |
 * | `role` | 書き出し | 8 通りに決まっている(ROLES) |
 * | `steal` | 声の取り合い | 2 通りに決まっている(STEALS)。目安 |
 * | `genre` | 相棒・部品箱 | 決まっている(和音エディタと同じ言葉) |
 * | `tags` | 道具そのもの | 自由。短い語 |
 * | `special` | 道具そのもの | 決まっている。鳴らし方が特別なものだけ書く |
 * | `dev` | 作っている人だけ | 決まっている。調整中・調整済み・参考などが入る |
 * | `targets` | 書き出し | 決まっている(tool/core/targets.js)。書かなくてよい |
 * | `desc` | 人と AI | 自由。英語の普通の文 |
 * | `descJa` | 人と AI | 自由。日本語の普通の文 |
 *
 * ---- 説明が 2 つある理由 ----
 *
 * マニュアルを 2 か国語で出すため。どちらか片方があればよく、
 * 両方書けるなら両方書く。片方しか無ければ、もう一方の言語のページには
 * ある側をそのまま載せて「まだ訳していない」と印を付ける
 * (`scripts/descs.js` がそれを見つける)。
 * 未完成でも 2 か国語そろえて出すほうが、片方が空で出るよりよい。
 *
 * 最初から入っている音色は `desc`(英語)を必ず書く。画面に出る文字は
 * 英語という決めごとに合わせてある。`descJa` は書けるなら書く。
 * 自分で足す音色はどちらの言語でもよい。
 *
 * 文は AI がいないと読めないので、道具の側が使うものは `tags` に要る —
 * 部品箱の絞り込み、相棒が音色を勧めるとき。
 * 和音のほうはもう同じ形になっている(`tool/core/chord.js` の `tags`)。
 *
 * ---- `special` は「ふつうに鳴らすと違うものになる」印 ----
 *
 * `tags` が探すための札なのに対して、`special` は鳴らす前に見るもの。
 * 音符を並べるだけでは本来の音にならない音色があり、道具はそれを知らないと
 * 別のものを鳴らしてしまう。実際に起きた — カセットの音は `=` を書いた
 * ときだけ組み立てられるので、音符で鳴らすと `hiss` も `wow` も `muffle` も
 * 通らず、ただの矩形波が出ていた(それでも黙って鳴るので気づけない)。
 *
 * だから自由な語にしない。道具はこの値で分かれるので、書き間違いは
 * 「印が無い」= もとの間違った鳴り方に戻る、という形で出る。
 * いまあるのは `tape` だけ。
 *
 * 鳴らし方が特別なだけで、鳴りそのものは変えない。何を鳴らすかを
 * 決めるのは今までどおり `tone` や `patch` の側。
 *
 * ---- `dev` は作っている最中の覚え書き ----
 *
 * ここまでの 5 つが使う人のためのものなのに対して、`dev` は
 * 作っている人のためのもの。鳴りにも書き出しにも効かないし、
 * 使う人に見せるものでもない。「この音はまだ形が決まっていない」
 * 「名前を変えるかもしれない」を音色そのものに書いておくための欄。
 *
 * 別の場所で管理しない。覚え書きを表や課題票へ置くと、音色を足したり
 * 名前を変えたりしたときに片方だけ古くなる。音色の隣にあれば一緒に動く。
 *
 * | 語 | 意味 |
 * | --- | --- |
 * | `spec` | 仕様を決めている最中。割り方や名前がまだ動く |
 * | `tuning` | 音を調整している最中。鳴りが変わる |
 * | `tuned` | 調整が済んだ。もう動かさないつもり |
 * | `ref` | 参考。手本として置いてあるもので、そのまま使う前提ではない |
 *
 * 語彙はここでは決めない(`role` と違って `sound/` は突き合わせない)。
 * 増やすときは、この表に書き足す。
 *
 * ジャンルは `tags` に混ぜない。あちらは語彙が決まっていて、
 * 相棒が突き合わせる先も決まっている。自由なタグに混ぜると
 * 「これはジャンルなのか、ただの札なのか」が分からなくなる。
 *
 * 語彙はここでは見ない。ジャンルの言葉を持っているのは `tool/core/chord.js` で、
 * `sound/` はそこへ依存しない(外部依存ゼロ)。入れ物だけ持って、
 * 中身の確かめは道具の側でやる(test/role.test.js)。
 *
 * いまはまだ誰も読んでいない。書ける場所だけ先に開けてある(docs/MGS.md)。
 *
 * どれも鳴りには何も効かない。効かせたいものは `tone` や `patch` の側へ書く。
 *
 * @param {number|string} what 波形の番号か名前
 * @returns {{name:string, kind:string, role:string|null, steal:string|null,
 *            genre:string[], tags:string[], special:string[], dev:string[],
 *            desc:string|null}|null}
 */
export function waveMeta(what) {
  const w = typeof what === 'number' ? WAVEFORMS[what] : WAVEFORMS[findWave(what)];
  if (!w) return null;
  return {
    name: w.name, kind: w.kind,
    role: w.role ?? null,
    steal: w.steal ?? null,
    genre: w.genre ?? [],
    tags: w.tags ?? [],
    special: w.special ?? [],
    dev: w.dev ?? [],
    targets: w.targets ?? [],
    // MIDI に出すならこの音色、という希望(GM の番号)。書いていなければ null
    gm: w.gm ?? null,
    // 入れたアドオンの名前。エンジンが入れたものは null(sound/addon.js)
    addon: w.addon ?? null,
    alias: w.alias ?? [],
    desc: w.desc ?? null,
    descJa: w.descJa ?? null,
  };
}

/**
 * ここまでに登録したものを「最初から入っているもの」として印を付ける。
 *
 * エンジンが自分で入れた音色とエンベロープに `preset` を立てる。
 * あとから足したものは自作になる。呼ぶのは `sound/audio.js` の頭、
 * 初期登録が全部済んだところ(2026-09-15)。
 *
 * 分けて配る音源(`sound/opnarhythm.js` など)も、自分のプリセットを
 * 登録したあとにここを呼ぶ。読み込んだ順で自作になってしまわないように
 * (2026-10-18)。何度呼んでも同じ
 */
export function sealPresets() {
  for (const w of WAVEFORMS) {
    w.preset = true;
    // 音量の段数と曲線は、どの音色も必ず持つ。`registerWave` などを通ったものは
    // `metaOf()` が入れているが、この表に直に書いてある最初の 7 つは通らない。
    // 読む側に「無かったら」の分岐を作らないよう、ここで揃える(2026-09-25)
    if (w.vsteps === undefined) w.vsteps = 0;
    if (w.vcurve === undefined) w.vcurve = 'curve';
  }
  for (const e of ENVELOPES) e.preset = true;
}

/** 絞り込みの当たり判定。書かれた条件だけ見る */
function hits(meta, q) {
  if (!q) return true;
  if (q.preset !== undefined && !!meta.preset !== !!q.preset) return false;
  if (q.kind && meta.kind !== q.kind) return false;
  if (q.role && meta.role !== q.role) return false;
  if (q.tag && !(meta.tags || []).includes(q.tag)) return false;
  // どのアドオンが入れた音色か。出どころは札と分けて持つ(札は人が付けるもの)
  if (q.addon !== undefined && (meta.addon ?? null) !== q.addon) return false;
  if (q.genre && !(meta.genre || []).includes(q.genre)) return false;
  if (q.target && !(meta.targets || []).includes(q.target)) return false;
  if (q.name && !meta.name.toLowerCase().includes(String(q.name).toLowerCase())) return false;
  return true;
}

/**
 * 音色の一覧。最初から入っているものも、あとから足したものも並ぶ。
 *
 * どちらかは `preset` で見分ける。絞り込みは書いた条件だけ見るので、
 * 何も渡さなければ全部返る。
 *
 * ```js
 * listVoices();                          // 全部
 * listVoices({ preset: false });         // 自分で足したものだけ
 * listVoices({ kind: 'pulse' });         // 矩形波だけ
 * listVoices({ addon: 'mgsdrv-analog' }); // そのアドオンが入れたものだけ
 * listVoices({ role: 'bass', tag: 'fm' });
 * ```
 *
 * @param {{preset?:boolean, kind?:string, role?:string, tag?:string,
 *          genre?:string, target?:string, name?:string}} [q]
 *   絞り込む条件。書いたものだけを見る。preset は最初から入っているものかどうか、
 *   kind は音の作り(pulse / fm など)、role は役割(bass など)、
 *   tag・genre・target はその音色に付いている札、name は名前の部分一致。
 *   省くと全部返る
 * @returns {object[]} `waveMeta()` と同じ形に `preset` が付く
 */
export function listVoices(q) {
  return WAVEFORMS
    .map((w) => ({ ...waveMeta(w.name), preset: !!w.preset }))
    .filter((m) => m && hits(m, q));
}

/**
 * エンベロープの一覧。見分け方と絞り込みは `listVoices()` と同じ。
 *
 * @param {{preset?:boolean, name?:string}} [q]
 *   絞り込む条件。preset と name だけ見る。省くと全部返る
 * @returns {{name:string, desc:string|null, descJa:string|null,
 *            table:boolean, preset:boolean}[]}
 */
export function listEnvelopes(q) {
  return ENVELOPES
    .map((e) => ({
      name: e.name,
      desc: e.desc ?? null,
      descJa: e.descJa ?? null,
      table: !!e.table,
      preset: !!e.preset,
    }))
    .filter((m) => hits(m, q));
}

/**
 * フレームごとの表を組み立てる。どの登録口からも呼べる。
 *
 * ---- なぜ `registerTone` の外へ出したか ----
 *
 * はじめ表は `registerTone` だけのものだった。だから FM や波形メモリの
 * 音色にビブラートを着せられず、着せたければ「素の音色を土台にした別の音色」を
 * もう 1 つ作るしかなかった。同じ音が 2 つ並ぶし、素のほうは飾られないまま残る。
 *
 * 表は音色の一部であって、特定の登録口のものではない。
 * 見た目の重さも変わらない — 書かなければ `null` が並ぶだけ。
 *
 * 幅の表(`duty`)だけは矩形波にしか効かないので、そこだけ見る。
 *
 * @param {object} spec arp / pitch / vol / duty / dutyLfo / slide / loop / vib
 * @param {string|object} base 土台。形(`kind`)の文字列でも、音色そのものでもよい。
 *   幅の表を落とすかどうかの判断に使う
 * @param {string} name 言づてに出す名前
 * @returns {object|null} 何も書いていなければ null
 */
export function toneOf(spec = {}, base = '', name = '') {
  // 幅を動かせる土台か。
  //
  // **チップで鳴らす矩形波も幅を動かせる。**前は `kind === 'pulse'` だけ見て
  // いたので、`nesPulse(25)` を土台にすると幅の表が落ちていた。ファミコンの
  // チップは幅を 4 段持っていて、鳴らす道(`_nesEvent`)も表を読むように
  // できている(2026-10-18)
  const kind = typeof base === 'object' && base ? base.kind : base;
  const mode = typeof base === 'object' && base ? base.mode : null;
  const canDuty = kind === 'pulse' || (mode === 'pulse' && (kind === 'nes' || kind === 'ay'));
  const list = (v) => (Array.isArray(v) && v.length ? v.map(Number) : null);
  let duty = list(spec.duty);
  // 幅の LFO。中心から深さのぶん、三角波で行って戻る。
  //
  // **行って戻るだけの表は、これで書ける。**前は 24 個と 18 個の表を
  // 並べていたが、どちらも素直な三角波で、中心と深さと速さの 3 つで足りた
  // (2026-10-17)。表が無くなるので、実機の駆動系も足し算と折り返しで済む。
  // `delay` を書けるのも表には無かったところ —— 押した瞬間は動かさずに、
  // 途中から揺れ出す形が作れる(ビブラートの `delay` と同じ向き)
  let dutyLfo = spec.dutyLfo
    ? { center: 0.3, depth: 0.2, speed: 2.5, delay: 0, ...spec.dutyLfo }
    : null;
  if ((duty || dutyLfo) && !canDuty) {
    console.warn(`[ChpTnSnd] 音色 "${name}": duty の表は矩形波(pulse)にしか効きません`
      + `(この音色は ${kind})。表は落として登録します`);
    duty = null; dutyLfo = null;
  }
  const arp = list(spec.arp), pitch = list(spec.pitch), vol = list(spec.vol);
  // 滑り込み。下から定位置へ上がって、そこで止まる。
  //
  // **片道の表は、これで書ける。**`[-200, -140, -80, -30, 0]` のような並びは、
  // 「どこから」「何フレームで」の 2 つで足りる。LFO にはならない形
  // (行って戻らないので)なので、別に持つ(2026-10-17)
  const slide = spec.slide
    ? { cents: -200, frames: 4, curve: 1.25, ...spec.slide }
    : null;
  // 深さはセント(`@m` と同じ)。書かなければ 28 セント・6Hz
  const vib = spec.vib ? { depth: 28, speed: 6, delay: 0, ...spec.vib } : null;
  if (!arp && !pitch && !vol && !duty && !dutyLfo && !slide && !vib) return null;
  return { arp, pitch, vol, duty, dutyLfo, slide, loop: { ...(spec.loop || {}) }, vib };
}

/**
 * 滑り込みの、そのフレームでのずれ(セント)。
 *
 * **着いたら動かない。**`frames` を過ぎたら 0 を返す。
 *
 * 形は `cents * (1 - t)^curve`。`curve` が 1 なら真っ直ぐで、
 * 1 より大きいと**初めに速く動いて、定位置の手前で緩む。**
 * 既定の 1.25 は、置き換えた 2 つの表に合わせて選んだ ——
 * `[-200, -140, -80, -30, 0]` との差が最大 5 セント、
 * `[-150, -90, -40, 0]` との差が最大 2 セント。音の出はじめの数フレームなので、
 * この差は聞き分けられない(2026-10-17)
 */
export function slideAt(slide, frame) {
  if (!slide) return 0;
  const n = Math.max(1, slide.frames);
  if (frame >= n) return 0;
  return slide.cents * Math.pow(1 - frame / n, slide.curve);
}

/**
 * その音色の幅が、鳴っているあいだ動くか。表でも LFO でも true。
 *
 * **1 か所にまとめてある。**幅が動く音色は常駐の処理器を通る決まりで、
 * その判断が 6 か所にあった。LFO を足したときに 1 か所だけ直すと、
 * 処理器へ回らない音色ができて無音になる
 */
export function dutyMoves(tone) {
  return !!(tone && (tone.duty || tone.dutyLfo));
}

/**
 * 幅の LFO の、そのフレームでの値。三角波で行って戻る。
 *
 * `delay` のあいだは中心から動かさない。表と同じ 1/60 秒きざみ
 */
export function dutyLfoAt(lfo, frame) {
  if (!lfo) return null;
  const wait = lfo.delay || 0;
  if (frame < wait) return lfo.center;
  // 1 周ぶんの位置(0〜1)から、三角波(0 → 1 → 0)を作る
  const turn = ((frame - wait) / 60) * lfo.speed % 1;
  const tri = turn < 0.5 ? turn * 2 : (1 - turn) * 2;
  return lfo.center + lfo.depth * (tri * 2 - 1);
}

/**
 * 作り分けを持つ音色の仲間。名前(小文字)から、軸の宣言を引く。
 *
 * 作り分けは `@{pulse(25)}` のように `( )` の中に書く。軸が 2 本以上あっても、
 * 名前は 1 つで済む(`layerPair(25, soft, near)`)。前は `pulse:25` と書いていたが、
 * 軸が増えると名前が掛け算で増えるので替えた(2026-09-28。docs/TODO.md の 20 番)。
 *
 * 作り分けの 1 つ 1 つは、いままでどおり別の音色として登録する。
 * ここが持つのは、どの軸にどんな値があり、何も書かなければどれになるか、だけ。
 */
const FAMILIES = new Map();

/** 名前を揃えた結果の控え。仲間を足すと答えが変わるので、そのたびに捨てる */
const KEYS = new Map();

/**
 * 作り分けの仲間を登録する。
 *
 * ```js
 * registerFamily('pulse', {
 *   desc: 'Pulse wave with a fixed duty cycle.',
 *   params: [{
 *     name: 'width', desc: 'Width of the high part, in percent.', default: '50',
 *     values: [{ value: '12', desc: '12.5%.' }, { value: '25', desc: '25%.' },
 *              { value: '50', desc: 'Square.' }],
 *   }],
 * });
 * ```
 *
 * 並べた値だけを受け付ける。並べていない値は、引くときに断る
 * (近い値に丸めない)。軸の名前・値・説明は、`describeVoice()` がそのまま返す。
 *
 * 数を受け取る軸も持てる(`{ name: 'vibrato', min: 0, max: 100, unit: 'cent' }`)。
 * 値を並べるかわりに範囲を書く。範囲の外は断る。こちらは音色を作り分けない —
 * 引くと軸を書かなかったものと同じ音色が見つかり、書いた数は `voiceArgs()` で取り出して
 * 鳴らすときに渡す。書かなければ null で、音色が持っている値のまま(2026-10-16)。
 *
 * 書き方を 2 つ断れる(2026-09-28)。
 *
 * - `exclusive` 一緒に書けない軸の組。`[['a', 'b']]` なら、a と b の両方を
 *   既定から動かすと断る(既定と同じ値を書くのは構わない)
 * - `forbid` 意味の無い値の組み合わせ。`[{ detune: 'none', echo: 'none' }]` なら、
 *   既定で埋めたあとの値がこの組になったら断る
 *
 * @param {string} name 仲間の名前(`pulse`)
 * @param {{desc?:string, params:{name:string, desc?:string, default:string,
 *          values:{value:string, desc?:string}[]}[],
 *          exclusive?:string[][], forbid?:Object<string,string>[],
 *          overwrite?:boolean}} spec
 */
export function registerFamily(name, spec = {}) {
  noOldDescName(spec, 'registerFamily');
  const key = String(name).trim().toLowerCase();
  // 名前空間を頭に付けられる(`opll::kick` `supermusic::dancemix::lead`)。
  // `::` は何段でもよい。アドオンが自分の中をさらに仕切ることがある(2026-10-20)
  if (!/^[a-z][a-z0-9]*(?:::[a-z][a-z0-9]*)*$/i.test(String(name).trim())) {
    throw new Error(`[ChpTnSnd] 仲間の名前 "${name}" は英数字と `
      + '音源セットの区切り(`::`)で書きます');
  }
  if (FAMILIES.has(key) && !spec.overwrite) return FAMILIES.get(key);
  const params = (spec.params || []).map((p) => {
    noOldDescName(p, `registerFamily の軸 ${p && p.name}`);
    // 数を受け取る軸。値の一覧のかわりに範囲を持つ
    if (!(p.values && p.values.length) && Number.isFinite(p.min) && Number.isFinite(p.max)) {
      if (!p.name) throw new Error(`[ChpTnSnd] 仲間 "${name}": 軸には名前を書きます`);
      // words: 数の代わりに書ける語(`{ on: 1, off: 0 }`)
      const words = p.words ? Object.fromEntries(Object.entries(p.words)
        .map(([w, v]) => [String(w).toLowerCase(), Number(v)])) : null;
      // 既定を書ける。書かなければ null で、「音色が持っている値のまま」。
      // 数で書けば、何も書かなかったときの値がそれだと言える
      // (null だと、読む側に基準が分からない。2026-10-20)
      return { name: String(p.name), desc: p.desc == null ? null : String(p.desc),
        default: Number.isFinite(p.default) ? Number(p.default) : null,
        values: [], min: Number(p.min), max: Number(p.max), unit: p.unit == null ? null : String(p.unit),
        numeric: true, ...(words ? { words } : {}) };
    }
    const values = (p.values || []).map((v) => {
      noOldDescName(v, `registerFamily の値 ${v && v.value}`);
      return { value: String(v.value), desc: v.desc == null ? null : String(v.desc) };
    });
    if (!p.name || !values.length) {
      throw new Error(`[ChpTnSnd] 仲間 "${name}": 軸には名前と値を書きます`);
    }
    const def = String(p.default ?? values[0].value);
    if (!values.some((v) => v.value.toLowerCase() === def.toLowerCase())) {
      throw new Error(`[ChpTnSnd] 仲間 "${name}": 軸 ${p.name} の既定 "${def}" が値の中にありません`);
    }
    return { name: String(p.name), desc: p.desc == null ? null : String(p.desc), default: def, values };
  });
  if (!params.length) throw new Error(`[ChpTnSnd] 仲間 "${name}": 軸が 1 本もありません`);
  const axisOf = (n) => {
    const p = params.find((q) => q.name.toLowerCase() === String(n).toLowerCase());
    if (!p) throw new Error(`[ChpTnSnd] 仲間 "${name}": 軸 "${n}" はありません`);
    return p.name;
  };
  const exclusive = (spec.exclusive || []).map((g) => g.map(axisOf));
  const forbid = (spec.forbid || []).map((c) => Object.fromEntries(Object.entries(c)
    .map(([k, v]) => [axisOf(k), String(v)])));
  const fam = { name: String(name).trim(), desc: spec.desc == null ? null : String(spec.desc),
    params, exclusive, forbid };
  FAMILIES.set(key, fam);
  KEYS.clear();
  return fam;
}

/**
 * `A(B, C)` を頭と中身に分ける。`( )` が無ければ中身は null。
 * 中身は `,` で切り、`軸: 値` と書いたものは軸の名前を分けて持つ。
 */
function splitVoiceName(name) {
  const s = String(name).trim();
  const m = /^([^()\s]+)\s*(?:\((.*)\))?$/s.exec(s);
  if (!m) return null;
  if (m[2] === undefined) return { head: m[1], args: null };
  const args = m[2].split(',').map((a) => a.trim()).filter((a) => a !== '').map((a) => {
    const i = a.indexOf(':');
    return i < 0 ? { axis: null, value: a } : { axis: a.slice(0, i).trim(), value: a.slice(i + 1).trim() };
  });
  return { head: m[1], args };
}

/**
 * 作り分けの書き方を読んで、軸ごとの値に直す。
 *
 * - 値だけを並べてよい。順番は問わない。どの軸の値かは、値そのもので決める
 * - `軸: 値` と書いてもよい。同じ値が 2 つの軸にあるときは、書かないと断る
 * - 書かない軸は既定の値になる
 *
 * @returns {{fam:object, args:Object<string,string>}|{error:string}|null}
 *   仲間でなければ null
 */
function resolveVoiceName(name) {
  const sp = splitVoiceName(name);
  if (!sp) return null;
  const fam = FAMILIES.get(sp.head.toLowerCase());
  if (!fam) {
    return sp.args === null ? null
      : { error: `"${sp.head}" は作り分けを持つ音色ではありません` };
  }
  const args = {};
  for (const a of sp.args || []) {
    let axis;
    if (a.axis !== null) {
      axis = fam.params.find((p) => p.name.toLowerCase() === a.axis.toLowerCase());
      if (!axis) {
        return { error: `${fam.name} に軸 "${a.axis}" はありません`
          + `(あるのは ${fam.params.map((p) => p.name).join(' / ')})` };
      }
    } else {
      let hits = fam.params.filter((p) => p.values
        .some((v) => v.value.toLowerCase() === a.value.toLowerCase()));
      // 数だけ書いたものは、数を受け取る軸が 1 本だけならそこへ
      if (!hits.length && isNum(a.value)) {
        const nums = fam.params.filter((p) => p.numeric && !p.words);
        if (nums.length === 1) hits = nums;
      }
      // 数の代わりの語(`off` など)は、その語を持つ軸へ
      if (!hits.length) {
        hits = fam.params.filter((p) => p.words && p.words[a.value.toLowerCase()] !== undefined);
      }
      if (!hits.length) {
        // 数だけ書いて、数を受け取る軸が 2 本以上あるときは、どれか名前を付けてもらう
        const nums = fam.params.filter((p) => p.numeric && !p.words);
        if (isNum(a.value) && nums.length > 1) {
          return { error: `${fam.name} の数 "${a.value}" は、どの軸のものか名前を付けて書きます`
            + `(${nums.map((p) => `${p.name}: ${a.value}`).join(' か ')})` };
        }
        const show = (p) => (p.numeric
          ? `${p.name}: ${p.min}〜${p.max}${p.words ? ' か ' + Object.keys(p.words).join(' | ') : ''}`
          : `${p.name}: ${p.values.map((v) => v.value).join(' | ')}`);
        return { error: `${fam.name} に値 "${a.value}" はありません(${fam.params.map(show).join(' / ')})` };
      }
      if (hits.length > 1) {
        return { error: `${fam.name} の値 "${a.value}" は ${hits.map((p) => p.name).join(' と ')} の`
          + `どちらにもあります。軸の名前を付けて書きます(${hits[0].name}: ${a.value})` };
      }
      axis = hits[0];
    }
    if (axis.numeric) {
      const word = axis.words ? axis.words[a.value.toLowerCase()] : undefined;
      const n = word !== undefined ? word : Number(a.value);
      if (word === undefined && !isNum(a.value)) {
        return { error: `${fam.name} の ${axis.name} は数で書きます("${a.value}" は数ではありません)` };
      }
      if (n < axis.min || n > axis.max) {
        return { error: `${fam.name} の ${axis.name} は ${axis.min} から ${axis.max} までです(${a.value})` };
      }
      if (args[axis.name] !== undefined) {
        return { error: `${fam.name} の ${axis.name} を 2 回書いています` };
      }
      args[axis.name] = String(n);
      continue;
    }
    const val = axis.values.find((v) => v.value.toLowerCase() === a.value.toLowerCase());
    if (!val) {
      return { error: `${fam.name} の ${axis.name} に値 "${a.value}" はありません`
        + `(あるのは ${axis.values.map((v) => v.value).join(' | ')})` };
    }
    if (args[axis.name] !== undefined) {
      return { error: `${fam.name} の ${axis.name} を 2 回書いています` };
    }
    args[axis.name] = val.value;
  }
  // 一緒に書けないのは、既定から動かした軸どうし。既定と同じ値を書くのは構わない
  // (決まった形の名前は、軸を全部書くので)
  const moved = (n) => args[n] !== undefined && args[n] !== null
    && args[n].toLowerCase() !== String(fam.params.find((p) => p.name === n).default).toLowerCase();
  for (const g of fam.exclusive) {
    const said = g.filter(moved);
    if (said.length > 1) {
      return { error: `${fam.name} の ${said.join(' と ')} は一緒に書けません` };
    }
  }
  for (const p of fam.params) if (args[p.name] === undefined) args[p.name] = p.default;
  for (const c of fam.forbid) {
    if (Object.entries(c).every(([k, v]) => args[k].toLowerCase() === v.toLowerCase())) {
      return { error: `${fam.name} の ${Object.entries(c).map(([k, v]) => `${k}: ${v}`).join(' と ')} は`
        + '組み合わせられません' };
    }
  }
  return { fam, args };
}

/**
 * 作り分けを、決まった形の名前にする。登録するときも、この形で書く。
 *
 * 軸は宣言した順に並べ、値だけを書く。同じ値がほかの軸にもあるものだけ、
 * 軸の名前を付ける(`layerPair(50, detune: none, far)`)。
 *
 * @param {string} name `pulse( 25 )` `layerPair(far, 25)` など
 * @returns {string|null} 仲間でない名前や、読めない書き方なら null
 */
export function voiceName(name) {
  const r = resolveVoiceName(name);
  if (!r || r.error) return null;
  const { fam, args } = r;
  const shared = (p) => fam.params.some((q) => q !== p
    && q.values.some((v) => v.value.toLowerCase() === args[p.name].toLowerCase()));
  // 数を受け取る軸は、書いたときだけ軸の名前を付けて並べる
  const show = fam.params
    .filter((p) => !p.numeric || args[p.name] != null)
    .map((p) => (p.numeric || shared(p) ? `${p.name}: ${args[p.name]}` : args[p.name]));
  // 並べるものが無ければ、かっこも付けない(数の軸だけを持つ音色。`analog::seqBass`)
  return show.length ? fam.name + '(' + show.join(', ') + ')' : fam.name;
}

/** 比べるための形。大文字小文字と空白と順番の揺れを消す */
function voiceKey(name) {
  const s = String(name);
  if (KEYS.has(s)) return KEYS.get(s);
  const r = resolveVoiceName(s);
  const key = !r ? s.trim().toLowerCase()
    : r.error ? null
    : r.fam.name.toLowerCase() + '(' + r.fam.params.filter((p) => !p.numeric)
      .map((p) => `${p.name}=${r.args[p.name]}`.toLowerCase()).join(',') + ')';
  KEYS.set(s, key);
  return key;
}

/** 数として読めるか */
const isNum = (v) => /^[-+]?(\d+\.?\d*|\.\d+)$/.test(String(v).trim());

/**
 * 音色を呼ぶときに渡した数を取り出す(`analog::tomitaWhistle(vibrato: 100)` なら `{ vibrato: 100 }`)。
 * 数を受け取る軸に何も書いていなければ null。
 * @param {string} name @returns {Object<string,number>|null}
 */
export function voiceArgs(name) {
  const r = resolveVoiceName(name);
  if (!r || r.error) return null;
  const out = {};
  for (const p of r.fam.params) {
    if (p.numeric && r.args[p.name] != null) out[p.name] = Number(r.args[p.name]);
  }
  return Object.keys(out).length ? out : null;
}

/**
 * 名前で引けなかったわけ。知らない名前を知らせるときに添える。
 * @returns {string|null}
 */
export function voiceNameProblem(name) {
  const r = resolveVoiceName(name);
  if (r && r.error) return r.error;
  return null;
}

/**
 * 音色を名前で引く。大文字小文字は見ない。
 *
 * 作り分けは `( )` の中に書く(`pulse(25)`)。空白・順番・軸の名前の有る無しは
 * 揃えてから比べるので、`pulse( 25 )` `layerPair(far, 25)` `layerPair(width: 25, echo: far)` も
 * 引ける。`( )` を書かなければ、仲間の既定のもの(`pulse` は `pulse(50)`)。
 *
 * @param {string} name @returns {number} 見つからなければ -1
 */
export function findWave(name) {
  const key = voiceKey(name);
  if (key === null) return -1;
  const at = WAVEFORMS.findIndex((w) => voiceKey(w.name) === key);
  if (at >= 0) return at;
  // 別名。作り分けのためには使わない(作り分けは仲間の表が持つ)
  const low = String(name).trim().toLowerCase();
  return WAVEFORMS.findIndex((w) => (w.alias || [])
    .some((a) => String(a).toLowerCase() === low));
}

/**
 * 音色について、AI が最初に読むもの。何を渡せて、それぞれ何を意味するか。
 *
 * 作り分けを持つ音色なら、仲間の説明と軸を返す。作り分けの名前を渡したら
 * (`pulse(25)`)、どの値が選ばれているか(`args`)も付ける。
 * 作り分けを持たない音色は `params` が空になる。
 *
 * @param {string} name
 * @returns {{name:string, desc:string|null, params:{name:string, desc:string|null,
 *   default:string, values:{value:string, desc:string|null}[]}[],
 *   exclusive:string[][], forbid:Object<string,string>[],
 *   voice?:string, args?:Object<string,string>, variants?:string[]}|null}
 *   知らない名前なら null
 */
export function describeVoice(name) {
  const r = resolveVoiceName(name);
  if (r && !r.error) {
    const { fam, args } = r;
    const sp = splitVoiceName(name);
    const out = {
      name: fam.name, desc: fam.desc,
      params: fam.params.map((p) => ({
        name: p.name, desc: p.desc, default: p.default,
        values: p.values.map((v) => ({ value: v.value, desc: v.desc })),
        // 数を受け取る軸は、値の一覧のかわりに範囲を返す
        ...(p.numeric ? { min: p.min, max: p.max, unit: p.unit, ...(p.words ? { words: { ...p.words } } : {}) } : {}),
      })),
      // 一緒に書けない軸の組と、組み合わせられない値
      exclusive: fam.exclusive.map((g) => [...g]),
      forbid: fam.forbid.map((c) => ({ ...c })),
      // 登録してある作り分け。組み合わせによっては無いものがある
      variants: WAVEFORMS.filter((w) => {
        const q = resolveVoiceName(w.name);
        return q && !q.error && q.fam === fam && splitVoiceName(w.name).args !== null;
      }).map((w) => w.name),
    };
    if (sp.args !== null || findWave(name) >= 0) {
      const at = findWave(name);
      if (at >= 0) {
        out.voice = WAVEFORMS[at].name; out.args = args;
        const more = detailOf(WAVEFORMS[at]);
        if (more) out.detail = more;
      }
    }
    return out;
  }
  const at = findWave(name);
  if (at < 0) return null;
  const w = WAVEFORMS[at];
  const out = { name: w.name, desc: w.desc ?? null, params: [], exclusive: [], forbid: [] };
  const more = detailOf(w);
  if (more) out.detail = more;
  return out;
}

/**
 * 音色の種類(`kind`)ごとに、`describeVoice` へ足す中身を作る関数。
 *
 * mml.js は音源の中身を知らない。生音の音色(`modal` `brass`)のように、名前のほかに
 * 数で動かせるパラメータを持つものは、音源の側がここへ一覧の作り方を渡す。
 * 何があり、何を渡せて、どこまで動くかを、マニュアルを開かずに API で引けるようにするため
 * (2026-10-13。#voice の @acoustic{…} で数を書くときに要る)
 */
const VOICE_DETAIL = new Map();

/**
 * 音色の種類に、`describeVoice` の `detail` を作る関数を付ける。
 * @param {string} kind 音色の `kind`(`modal` など)
 * @param {(entry:object) => object} fn 音色の登録から、`detail` に入れるものを作る
 */
export function registerVoiceDetail(kind, fn) {
  VOICE_DETAIL.set(String(kind), fn);
}

function detailOf(w) {
  const fn = VOICE_DETAIL.get(w.kind);
  return fn ? fn(w) : null;
}

/** 登録してある仲間の名前 */
export function listVoiceFamilies() {
  return [...FAMILIES.values()].map((f) => f.name);
}

// 矩形波とノイズはエンジンの芯に入っているので、読み込んだ時点で仲間も入れておく。
// 後から入れると、それまでに `pulse` を引いたものが見つからない
registerCoreFamilies();

/** 短い語の並びにする。空は落とし、小文字に揃える(突き合わせるため) */
const words = (v) => (Array.isArray(v) ? v : v == null ? [] : [v])
  .map((x) => String(x).trim().toLowerCase()).filter(Boolean);

/** 覚え書きを整える。形だけ見る(語彙の確かめは道具の側) */
/**
 * `gm` に書かれたものを番号にする。番号でも名前でもよい。
 *
 * 知らない名前はその場で知らせる。捨てて null にするので鳴りには効かないが、
 * 黙って捨てると書き出すまで気づけない — MIDI へ出したときに
 * 「なぜかピアノで鳴る」になる。
 */
function gmOf(v) {
  if (v == null || v === '') return null;
  if (typeof v === 'number' || /^\d+$/.test(String(v).trim())) {
    const n = Math.round(Number(v));
    if (n >= 0 && n <= 127) return n;
    console.warn(`[ChpTnSnd] gm: ${v} は 0〜127 の外です`);
    return null;
  }
  const at = gmIndex(v);
  if (at >= 0) return at;
  const like = gmLike(v);
  console.warn(`[ChpTnSnd] gm: "${v}" は GM の音色名ではありません`
    + (like.length ? `(近いのは ${like.join(' / ')})` : '(sound/gm.js に 128 個あります)'));
  return null;
}

/** 音量の曲線の名前。1 段あたり何 dB かで並べてある(`linear` だけ別の作り) */
export const VCURVES = ['curve', '3db', '2db', '1.5db', 'linear', '0.75db'];

/** 音量を寄せる段数。0 は寄せない。書き間違いは 0 に戻して知らせる */
function vstepsOf(v) {
  if (v === undefined || v === null) return 0;
  const n = Math.floor(Number(v));
  if (!Number.isFinite(n) || n < 0) {
    warn(`[ChpTnSnd] vsteps "${v}" は読めません(0 以上の整数。0 なら寄せない)`);
    return 0;
  }
  return n;
}

/**
 * 古い名前(`note` / `noteJa`)で説明を渡していないか。
 *
 * 説明の名前を `desc` / `descJa` へ変えた(2026-10-15)。知らないキーは
 * 黙って捨てるので、古い書き方のまま渡されると説明だけが消える。
 * エラーも出ないので、一覧を見るまで気づけない。ここで止める。
 *
 * ブランチが何本も走っていて、どれも古い名前で音色を書いている。
 * 取り込むときに全部ここで分かる
 *
 * @param {object} opts 登録に渡された設定
 * @param {string} where どの口か(メッセージに出す)
 */
export function noOldDescName(opts, where) {
  if (opts && (opts.note != null || opts.noteJa != null)) {
    throw new Error(`[ChpTnSnd] ${where}: 説明は note ではなく desc です`
      + '(日本語は noteJa ではなく descJa)');
  }
}

/** 音量の曲線。知らない名前は既定へ戻して知らせる */
function vcurveOf(v) {
  if (v === undefined || v === null) return 'curve';
  const s = String(v).toLowerCase();
  if (VCURVES.includes(s)) return s;
  warn(`[ChpTnSnd] vcurve "${v}" は知らない名前です`
    + `(使えるのは ${VCURVES.join(' / ')})`);
  return 'curve';
}

export function metaOf(opts = {}) {
  noOldDescName(opts, 'metaOf');
  return {
    genre: words(opts.genre),
    // 自由な語(英語)。決まった意味を持たせている語は 2 つ。
    // approx — 実機と同じとは言えない音(録音を描き直した、耳で寄せた)。出どころの話なので、
    // 仕上がっても外さない。まだ近づける作業を続けているなら dev の wip と重ねる(2026-10-11)
    // byEar — 実機の録音と聞き比べて、人が耳で合わせた音。数で測って寄せただけのものには付けない。
    // これも出どころの話なので、仕上がっても外さない(2026-10-23。tr808)
    tags: words(opts.tags),
    // 鳴らし方が特別なもの。道具はここを見て鳴らし方を変える。
    // ふつうに音符で鳴らすと別のものになってしまう音色だけが持つ
    special: words(opts.special),
    // 作っている最中の覚え書き。鳴りにも書き出しにも効かない。
    // 決まった語を使う(DEV_MARKS)が、知らない語も通す —
    // 途中で増えるものなので、ここで止めると印を付けるのに手が要る
    dev: words(opts.dev),
    // 書き出せる先。言葉の一覧は道具の側が持つ(tool/core/targets.js)。
    // 書かなくてよい — 空なら、道具が音色の作りから割り出す
    targets: words(opts.targets),
    // 声の取り合いの目安。チャンネルが足りないときに、この音色を
    // 割り込んでよいか。書かなければ null(決めていない)。
    // 禁止ではなく目安で、読む側(圧縮)はまだ無い
    steal: stealOf(opts.steal, opts.name),
    // MIDI に出すならこの音色、という希望(GM の番号 0〜127)。
    //
    // いまは役(lead / bass …)と名前の当てずっぽうで決めている
    // (tool/core/midi-write.js の GM_BY_NAME)。役は粗くて、名前の正規表現は
    // 自分で足した音色には効かない。音色が自分で言えるのがいちばん強い。
    //
    // 書かなくてよい。書いていなければ今までどおり当てる。
    // 番号でも名前でもよい(`56` でも `'Trumpet'` でも同じ)。
    // 書き間違いはここで言う — 黙って捨てると、書き出すまで気づけない
    gm: gmOf(opts.gm),
    // 音量の段数と曲線。どちらも必ず持つ(書かなければ既定)ので、
    // 読む側に「無かったら」の分岐が要らない。
    //
    // 実機は音量の目盛りが機種ごとに違う。AY は 16 段で 1 段 3dB、
    // ファミコンは 16 段だが値がそのまま振幅、FM の TL は 128 段で 0.75dB。
    // 曲線と段数は対で意味を持つ(1 段あたり何 dB × 段数 = 全体の幅)。
    //
    // MML には命令を足さない。同じ波形の段あり・段なしが欲しければ、
    // `registerTone` で着せ替えた音色を 2 つ登録する(2026-09-25)
    vsteps: vstepsOf(opts.vsteps),
    vcurve: vcurveOf(opts.vcurve),
    // 実機の高さの刻み。書かなければ音色の作りから決める(`psgDiv`)。
    // 書くのは、ふつうの音程レジスタとは別の道で高さを作る音色だけ ——
    // AY のブザー音がそれで、エンベロープの周期で高さが決まるため
    // 刻みが 16 倍粗い(2026-09-26)
    ...(opts.snapDiv > 0 ? { snapDiv: Math.floor(opts.snapDiv) } : {}),
    // 別名。同じ音を 2 通りの名前で呼べる(findWave)
    alias: Array.isArray(opts.alias) ? opts.alias.map(String) : [],
    // 説明は 2 か国語ぶん持てる。どちらか片方でよい(マニュアルの側で
    // 足りないほうを補って印を付ける。scripts/descs.js)
    desc: opts.desc == null ? null : String(opts.desc),
    descJa: opts.descJa == null ? null : String(opts.descJa),
  };
}

/** 同じ名前がもうあれば止める(わざと差し替えるときだけ通す) */
function requireFreeName(name, overwrite) {
  // 作り分けの名前は、仲間を先に登録しておく。書き間違いをここで止めるため
  if (String(name).includes('(') && voiceName(name) === null) {
    throw new Error(`[ChpTnSnd] 音色 "${name}" は登録できません。`
      + (voiceNameProblem(name) || '作り分けの書き方が読めません'));
  }
  const key = voiceKey(name);
  const at = WAVEFORMS.findIndex((w) => voiceKey(w.name) === key);
  if (at >= 0 && !overwrite) {
    throw new Error(`[ChpTnSnd] 音色 "${name}" はもう登録されています`
      + '(差し替えるなら overwrite: true を渡してください)');
  }
  return at;
}

/**
 * `v`(0〜15)から、実際の大きさ(0〜1)へ。
 *
 * 実機ごとに音量レジスタの効き方が違う。AY は 1 段 0.75dB あたりで、
 * FM の TL は 1 段 0.75dB、OPLL のリズムは 3dB 刻み。`curve` がそれを言う。
 *
 * 鳴らす側と、フェードを逆算する側の両方が使う。片方だけ直すと、
 * 書いた音量と鳴る大きさがずれる。
 *
 * @param {number} v 0〜15
 * @param {string} curve `linear` / `3db` / `2db` / `1.5db` / `0.75db` / それ以外(既定の曲線)
 * @param {number} steps 段数(無音を含めた符号の数)。0 なら 16 段として数える
 * @returns {number} 0〜1
 */
export function volGainOf(v, curve, steps) {
  if (!(v > 0)) return 0;
  // 段数は、無音を含めた符号の数。4 ビットの音量レジスタは 16 段で、
  // そのうち 0 が無音。鳴る符号は 1〜15 なので、上から下まで 14 段ぶんしか
  // 下がらない。前はここを 15 段ぶんと数えていて、AY の `v1` が
  // -45dB になっていた。実機は -42dB(2026-10-04 に測り直した)。
  //
  // 段数を書かなければ、`v` 1 つが 1 段。16 段と同じ数え方になる
  const n = steps > 0 ? steps : 16;
  const down = Math.max(0, (n - 1) * (1 - v / 15));   // 最大から何段下か
  switch (curve) {
    case '3db':    return Math.pow(10, -3 * down / 20);
    // SN76489(セガ)。16 段で 1 段 2dB。こちらでは測っていない
    case '2db':    return Math.pow(10, -2 * down / 20);
    // PCE(HuC6280)。5 ビット(32 段)で 1 段 1.5dB。こちらでは測っていない
    case '1.5db':  return Math.pow(10, -1.5 * down / 20);
    case '0.75db': return Math.pow(10, -0.75 * down / 20);
    case 'linear': return v / 15;
    default:       return Math.pow(v / 15, 1.8);
  }
}

/**
 * `volGainOf` の逆。大きさ(0〜1)から `v`(0〜15)へ。
 *
 * フェードを音源ごとにそろえるために要る。`@fade` は「いまの大きさの
 * 何割か」で書くので、その割合を大きさに掛けてから、音色の曲線で
 * `v` へ戻す。曲線が音色ごとに違っても、耳に届く下がり方は同じになる。
 *
 * 段に寄せるのはここではしない。寄せるのは鳴らす側(`snapVol`)で、
 * 先に寄せると段の外の値が出る。
 *
 * @param {number} g 0〜1
 * @param {string} curve `volGainOf` と同じもの
 * @param {number} steps 段数
 * @returns {number} 0〜15
 */
export function volFromGain(g, curve, steps) {
  if (!(g > 0)) return 0;
  const n = steps > 0 ? steps : 15;
  const back = (perStep) => {
    const down = -20 * Math.log10(g) / perStep;   // 最大から何段下か
    return clamp(15 * (n - down) / n, 0, 15);
  };
  switch (curve) {
    case '3db':    return back(3);
    case '2db':    return back(2);
    case '1.5db':  return back(1.5);
    case '0.75db': return back(0.75);
    case 'linear': return clamp(g * 15, 0, 15);
    default:       return clamp(15 * Math.pow(g, 1 / 1.8), 0, 15);
  }
}

/**
 * 2 オペレータの FM 音色を足す(MSX-MUSIC の YM2413 にあたるもの)。
 *
 * 片方の音(変調側)でもう片方の音程を揺らすと、揺らし方しだいで
 * 金属にも笛にも聞こえる。要るのは 3 つだけ:
 *   - `ratio` 変調側の周波数比。整数なら楽器らしい音、
 *     半端な数(3.5 など)なら鐘や打楽器になる
 *   - `depth` 揺らしの深さ。大きいほど倍音が増えて硬くなる
 *   - `decay` 揺らしの減り方(秒)。時間とともに倍音が減るのが FM らしさ
 *
 * バスドラムのように音程そのものが落ちる打楽器には `drop` を使う。
 * 鳴りはじめだけ高いところから始めて、すぐ本来の高さへ落とす。
 * これが無いと、低い音を短く切っただけの「ボッ」にしかならない。
 *
 * @param {string} name 名前。`fm` で始める(打楽器は `fmDrum`)
 * @param {{ratio?:number, depth?:number, attack?:number, decay?:number,
 *          sustain?:number, wave?:string, drop?:number, dropTime?:number}} params
 *   wave = 変調側の波形(WAVE の値。既定は WAVE.SINE)
 *   drop = 鳴りはじめを何倍の高さから始めるか(0 で無効。バスドラムは 6〜8)
 *   dropTime = 本来の高さへ落ちきるまでの秒数(既定 0.05)
 * @param {{overwrite?:boolean}} [opts]
 * @returns {number} 音色の番号(ふだんは名前で呼ぶので使わない)
 */
export function registerFM(name, params = {}, opts = {}) {
  const at = requireFreeName(name, opts.overwrite);
  const entry = {
    role: roleOf(opts.role, name), ...metaOf(opts),
    id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'fm',
    ratio: params.ratio ?? 1,
    depth: params.depth ?? 3,
    attack: params.attack ?? 0.002,
    decay: params.decay ?? 0.3,
    sustain: params.sustain ?? 0.15,
    wave: params.wave || WAVE.SINE,
    drop: params.drop ?? 0,
    dropTime: params.dropTime ?? 0.05,
  };
  // params と opts のどちらに書いても効かせる。呼ぶ側から見ると
  // 表は「音色の設定」で、2 つに分かれていることに意味は無い
  const tone = toneOf({ ...params, ...opts }, 'fm', name);
  if (tone) entry.tone = tone;
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/**
 * ビープ音源を足す(8 ビット機のスピーカー)。
 *
 * 作りが 3 通りあり、どれも同じ形で書ける([docs/BEEP.md](../docs/BEEP.md))。
 *
 * - 搬送波を刻む型(PC-8001 系)。固定の音を On/Off するだけの機械。
 *   `carrier` を持たせると、音程はその搬送波を刻む速さで作られる。
 *   搬送波が消せないので濁る
 * - 線を直接叩く型(ZX Spectrum / Apple II 系)。`carrier: 0`。素直な矩形
 * - カウンタに数えさせる型(8253。MZ / PC-98 系)。`divClock` を持たせると
 *   出せる高さが分周比の階段に丸まる。高い音ほど狂う
 *
 * `jitter` は画面と CPU がメモリを取り合うことによる揺れ。
 * CPU が時間を数えている機械(上の 1 と 2)だけに起きる。
 * カウンタが数える機械は揺れない。
 *
 * 実在の機械に縛らない。 幅は広めに取ってあるので、どこにも無かった
 * ビープも作れる。
 *
 * @param {string} name 名前。`bp` で始める
 * @param {{carrier?:number, jitter?:number, frame?:number,
 *          display?:number, divClock?:number}} params
 *   carrier = 搬送波 Hz(0 で無し)。jitter = 揺れの深さ 0..1(0 で切)。
 *   frame = 揺れの周期 Hz(画面の書き換え)。display = 1 コマのうち
 *   CPU が食われる割合 0..1。divClock = 分周に使うクロック Hz(0 で丸めない)。
 *   hiss = テープの地のノイズ 0..1。wow = 回転むら 0..0.5(ロード音だけ)。
 *   muffle = テープとスピーカーで高いところが落ちる境目 Hz(0 で落とさない)
 * @param {{overwrite?:boolean}} [opts]
 * @returns {number} 音色の番号(ふだんは名前で呼ぶので使わない)
 */
export function registerBeep(name, params = {}, opts = {}) {
  const at = requireFreeName(name, opts.overwrite);
  const entry = {
    role: roleOf(opts.role, name), ...metaOf(opts),
    id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'beep',
    carrier: Math.max(0, params.carrier ?? 0),
    jitter: Math.max(0, Math.min(1, params.jitter ?? 0)),
    frame: Math.max(1, params.frame ?? 60),
    display: Math.max(0.01, Math.min(0.99, params.display ?? 0.7)),
    divClock: Math.max(0, params.divClock ?? 0),
    hiss: Math.max(0, Math.min(1, params.hiss ?? 0)),
    wow: Math.max(0, Math.min(0.5, params.wow ?? 0)),
    muffle: Math.max(0, params.muffle ?? 0),
  };
  // 音色がエンベロープを連れてこられる。 @{名前} を書いた時点で掛かり、
  // そのあとに @e{...} を書けば上書きできる。
  // 音色とエンベロープは本来べつのものだが、組み合わせで初めて楽器になるものがある
  if (params.env !== undefined) entry.defaultEnv = envIndex(params.env);
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/** AY の音色が鳴らすもの。トーン・ノイズ・エンベロープ(ブザー) */
export const AY_MODES = ['tone', 'noise', 'env'];

/**
 * ブザーの形。R13 に書く値と、1 周に進む刻み(高さの割り算)。
 *
 * エンベロープは CLK / 8 の 1 刻みを周期レジスタぶん数えて 1 段進む。
 * のこぎりは 32 段で 1 周なので CLK / (256 × 周期)、三角は上り下りで
 * 64 段なので CLK / (512 × 周期)。音色の `snapDiv` にもこの数を持たせる。
 */
export const AY_ENV_SHAPES = {
  saw: { r13: 8, div: 256 },
  tri: { r13: 10, div: 512 },
};

/**
 * AY-3-8910 / YM2149 のチップで鳴らす音色を足す(`sound/ay.js`)。
 *
 * 同じ矩形波でも `pulse(50)` は Web Audio の発振器で作る。こちらはチップの
 * レジスタを書いて鳴らすので、ノイズの並びや音量の表が実機と同じになる。
 *
 * 音量は AY の 16 段(1 段 3dB)。エンベロープはこちらで計算して、
 * 1 フレームずつ音量レジスタへ書く(実機のドライバと同じ)。
 *
 * @param {string} name 名前。`ay` で始める
 * `env` は音量エンベロープを音の高さまで速く回すもの(ブザー)。音量は効かず、
 * 書いた高さはエンベロープの周期(R11/R12)になる。`@{名前}{ … }` の区間を開き、
 * `@g` で同じチャンネルの矩形波を掛けられる(docs/MML.md)。
 *
 * @param {{mode?:string, shape?:string, ay?:boolean}} params
 *   mode = `tone`(矩形波)・`noise`・`env`(ブザー)。shape = ブザーの形(`saw` / `tri`)。
 *   ay = 音量の表を AY-3-8910(MSX1)にする。書かなければ YM2149(MSX2 以降)
 * @param {{overwrite?:boolean}} [opts] 説明や役。`registerOPLL()` と同じ
 * @returns {number} 音色の番号
 */
export function registerAY(name, params = {}, opts = {}) {
  const at = requireFreeName(name, opts.overwrite);
  const mode = AY_MODES.includes(params.mode) ? params.mode : 'tone';
  if (params.mode !== undefined && params.mode !== mode) {
    warn(`[ChpTnSnd] AY の mode "${params.mode}" は知らない名前です(使えるのは ${AY_MODES.join(' / ')})`);
  }
  const env = mode === 'env';
  const shape = AY_ENV_SHAPES[params.shape] ? params.shape : 'saw';
  if (env && params.shape !== undefined && params.shape !== shape) {
    warn(`[ChpTnSnd] AY の shape "${params.shape}" は知らない名前です(使えるのは ${Object.keys(AY_ENV_SHAPES).join(' / ')})`);
  }
  // ブザーは音量が効かない(v0 で黙るだけ)。高さの刻みはエンベロープの周期で決まる
  const meta = metaOf(env
    ? { vsteps: 1, vcurve: '3db', snapDiv: AY_ENV_SHAPES[shape].div, ...opts }
    : { vsteps: 16, vcurve: '3db', ...opts });
  const entry = { id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'ay', mode,
    ...(env ? { shape } : {}),
    ...(params.ay ? { ay: true } : {}),
    role: roleOf(opts.role, name), ...meta,
    special: [...new Set(meta.special.concat(env ? ['buzz', 'worklet'] : ['worklet']))] };
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/** ファミコンの音色が鳴らす声 */
export const NES_MODES = ['pulse', 'triangle', 'noise'];

/**
 * ファミコン(2A03)の APU で鳴らす音色を足す(`sound/nes.js`)。
 *
 * 音量は 4 ビットの値がそのまま振幅(`linear`、16 段)。三角波は音量が効かない
 * (v0 で黙るだけ)。エンベロープはこちらで計算して、1 フレームずつ書く。
 *
 * @param {string} name 名前。`nes` で始める
 * @param {{mode?:string, duty?:number, short?:boolean}} params
 *   mode = `pulse`・`triangle`・`noise`。duty = 矩形波の幅(0.125 / 0.25 / 0.5 / 0.75)。
 *   short = ノイズを短い並び(93 段)にする
 * @param {{overwrite?:boolean}} [opts] 説明や役。`registerOPLL()` と同じ
 * @returns {number} 音色の番号
 */
export function registerNES(name, params = {}, opts = {}) {
  const at = requireFreeName(name, opts.overwrite);
  const mode = NES_MODES.includes(params.mode) ? params.mode : 'pulse';
  if (params.mode !== undefined && params.mode !== mode) {
    warn(`[ChpTnSnd] NES の mode "${params.mode}" は知らない名前です(使えるのは ${NES_MODES.join(' / ')})`);
  }
  const tri = mode === 'triangle';
  const meta = metaOf({ vsteps: tri ? 1 : 16, vcurve: 'linear', ...opts });
  const entry = { id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'nes', mode,
    ...(mode === 'pulse' ? { duty: [0.125, 0.25, 0.5, 0.75].includes(params.duty) ? params.duty : 0.5 } : {}),
    ...(mode === 'noise' && params.short ? { short: true } : {}),
    role: roleOf(opts.role, name), ...meta,
    special: [...new Set(meta.special.concat('worklet'))] };
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/**
 * ファミコン ディスクシステムのチップで鳴らす音色を足す(`sound/fds.js`)。
 *
 * 波形メモリは 64 個・6 ビット(0〜63)。変調ユニットは、表でカウンタを動かして
 * 音程を書き換える。音量は 0〜32 で値がそのまま振幅。
 *
 * @param {string} name 名前。`fds` で始める
 * @param {{wave:number[], mod?:{ratio:number, depth:number, table?:string}}} params
 *   wave = 64 個の 0〜63。mod = 変調。ratio は表を 1 周する速さ(音の高さの何倍か)、
 *   depth は揺らす深さ(音の高さに対する割合)、table は `tri` か `step`
 * @param {{overwrite?:boolean}} [opts] 説明や役。`registerOPLL()` と同じ
 * @returns {number} 音色の番号
 */
export function registerFDS(name, params = {}, opts = {}) {
  const at = requireFreeName(name, opts.overwrite);
  const src = Array.isArray(params.wave) ? params.wave : [];
  if (src.length !== 64) warn(`[ChpTnSnd] FDS の波形は 64 個です(${name} は ${src.length} 個)`);
  const wave = Array.from({ length: 64 }, (_, i) => Math.max(0, Math.min(63, Math.round(src[i] ?? 32))));
  const m = params.mod;
  const meta = metaOf({ vsteps: 32, vcurve: 'linear', ...opts });
  const entry = { id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'fds', wave,
    ...(m && m.ratio > 0 && m.depth > 0
      ? { mod: { ratio: Number(m.ratio), depth: Number(m.depth), table: m.table === 'step' ? 'step' : 'tri' } }
      : {}),
    role: roleOf(opts.role, name), ...meta,
    special: [...new Set(meta.special.concat('worklet'))] };
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/**
 * コナミの SCC のチップで鳴らす音色を足す(`sound/scc.js`)。
 *
 * 波形は 32 個・8 ビット符号つき(-128〜127)。音量は 4 ビットで値がそのまま振幅。
 * 実機に無いビット数で鳴らしたいときは `registerWave` を使う(Web Audio で鳴らす)。
 *
 * @param {string} name 名前。`scc` で始める
 * @param {{wave:number[]}} params wave = 32 個の -128〜127
 * @param {{overwrite?:boolean, env?:string}} [opts] 説明や役。env は連れてくるエンベロープ
 * @returns {number} 音色の番号
 */
export function registerSCC(name, params = {}, opts = {}) {
  const at = requireFreeName(name, opts.overwrite);
  const src = Array.isArray(params.wave) ? params.wave : [];
  if (src.length !== 32) warn(`[ChpTnSnd] SCC の波形は 32 個です(${name} は ${src.length} 個)`);
  const wave = Array.from({ length: 32 }, (_, i) => Math.max(-128, Math.min(127, Math.round(src[i] ?? 0))));
  const meta = metaOf({ vsteps: 16, vcurve: 'linear', ...opts });
  const entry = { id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'scc', wave,
    role: roleOf(opts.role, name), ...meta,
    special: [...new Set(meta.special.concat('worklet'))] };
  if (opts.env !== undefined) entry.defaultEnv = envIndex(opts.env);
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/**
 * 波形を持たない音源で鳴らす音色を足す(`sound/modal.js`)。
 *
 * 共振器の束で、叩く音とはじく音を 1 音ごとに計算して鳴らす。表を持たないので、
 * 強さと高さと長さで音色そのものが変わる(docs/ENGINE_TODO.md の 2h)。
 *
 * チップには無い音なので、実機へ書き出すときは消える。
 *
 * @param {string} name 音色の名前。`modal(piano)` のように作り分けで書く
 * @param {{patch:string}} params patch = `MODAL_PATCHES` の名前
 * @param {{overwrite?:boolean, env?:string}} [opts] 説明や役
 * @returns {number} 音色の番号
 */
export function registerModal(name, params = {}, opts = {}) {
  const at = requireFreeName(name, opts.overwrite);
  const meta = metaOf(opts);
  const entry = { id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'modal',
    patch: String(params.patch || ''), role: roleOf(opts.role, name), ...meta,
    special: [...new Set(meta.special.concat('worklet'))] };
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/**
 * 減算方式のシンセで鳴らす音色を足す(`sound/analog.js`)。
 *
 * 発振器 1 つをフィルタ 1 台に通し、カットオフと音量にエンベロープを 1 本ずつ掛ける。
 * フィルタは実機に無いので、書き出すときは消える。
 *
 * @param {string} name 音色の名前。`analog::seqBass` のように作り分けで書く
 * @param {{patch:string}} params patch = `ANALOG_PATCHES` の名前
 * @param {{overwrite?:boolean, env?:string}} [opts] 説明や役
 * @returns {number} 音色の番号
 */
export function registerAnalog(name, params = {}, opts = {}) {
  const at = requireFreeName(name, opts.overwrite);
  const meta = metaOf(opts);
  const entry = { id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'analog',
    patch: String(params.patch || ''), role: roleOf(opts.role, name), ...meta,
    special: [...new Set(meta.special.concat('worklet'))] };
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/**
 * 息で鳴らし続ける音源で鳴らす音色を足す(`sound/brass.js`)。
 *
 * `registerModal` と同じ扱いで、違うのは処理器だけ。
 *
 * @param {string} name 音色の名前。`brass(trumpet)` のように作り分けで書く
 * @param {{patch:string}} params patch = `BRASS_PATCHES` の名前
 * @param {{overwrite?:boolean, env?:string}} [opts] 説明や役
 * @returns {number} 音色の番号
 */
export function registerBrass(name, params = {}, opts = {}) {
  const at = requireFreeName(name, opts.overwrite);
  const meta = metaOf(opts);
  const entry = { id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'brass',
    patch: String(params.patch || ''), role: roleOf(opts.role, name), ...meta,
    special: [...new Set(meta.special.concat('worklet'))] };
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/**
 * 粒がぶつかる音(シェイカー)で鳴らす音色を足す(`sound/phisem.js`)。
 *
 * 粒を 1 つずつ計算せず、ぶつかる頻度と 1 回の当たりの音と胴の響きで作る。
 * 打楽器なので、音符の高さは胴の共振に掛かる(大きさを変える操作にあたる)。
 *
 * @param {string} name 音色の名前。`shaker::maraca` のように作り分けで書く
 * @param {{patch:string}} params patch = `SHAKER_PATCHES` の名前
 * @param {{overwrite?:boolean, env?:string}} [opts] 説明や役
 * @returns {number} 音色の番号
 */
export function registerShaker(name, params = {}, opts = {}) {
  const at = requireFreeName(name, opts.overwrite);
  const meta = metaOf(opts);
  const entry = { id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'shaker',
    patch: String(params.patch || ''), role: roleOf(opts.role, name), ...meta,
    special: [...new Set(meta.special.concat('worklet'))] };
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/**
 * OPNA(YM2608)のリズム音源で鳴らす音色を足す(`sound/opnarhythm.js`)。
 *
 * 録音を鳴らす打楽器なので、選べるのはどの打楽器かだけ。
 * 音量は 5 ビットで 1 段 0.75dB。o4c なら録音の速さのまま鳴る。
 *
 * @param {string} name 名前。`opna` で始める
 * @param {{key?:string}} params key = bd / sd / top / hh / tom / rim
 * @param {{overwrite?:boolean, env?:string}} [opts] 説明や役。env は連れてくるエンベロープ
 * @returns {number} 音色の番号
 */
export function registerOPNARhythm(name, params = {}, opts = {}) {
  const at = requireFreeName(name, opts.overwrite);
  const keys = ['bd', 'sd', 'top', 'hh', 'tom', 'rim'];
  const key = keys.includes(params.key) ? params.key : 'bd';
  if (!keys.includes(params.key)) warn(`[ChpTnSnd] OPNA のリズムは ${keys.join(' / ')} のどれかです(${name} は ${params.key})`);
  const meta = metaOf({ vsteps: 32, vcurve: '0.75db', ...opts });
  const entry = { id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'opnaRhythm', key,
    role: roleOf(opts.role, name), ...meta,
    special: [...new Set(meta.special.concat('worklet'))] };
  if (opts.env !== undefined) entry.defaultEnv = envIndex(opts.env);
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/**
 * 外のファイルが持つ音源の音色を登録する(`sound/opl.js` など)。
 *
 * mml.js はその音源の中身を知らない。音源の側が `kind` と、鳴らすときに要るもの
 * (`fields`)を渡す。こうしておくと、音源を外すときにここを直さずに済む
 * (docs/ENGINE_TODO.md の 2i)。
 *
 * @param {string} name 名前
 * @param {string} kind 音源の種類。audio.js の `registerChipKind` に渡したものと同じ
 * @param {object} fields 音色に持たせるもの(音源が読む)
 * @param {{overwrite?:boolean, env?:string, role?:string, desc?:string,
 *          vsteps?:number, vcurve?:string}} [opts] 説明や役。env は連れてくるエンベロープ
 * @returns {number} 音色の番号
 */
export function registerVoice(name, kind, fields = {}, opts = {}) {
  const at = requireFreeName(name, opts.overwrite);
  const meta = metaOf(opts);
  const entry = { id: at >= 0 ? at : WAVEFORMS.length, name, kind, ...fields,
    role: roleOf(opts.role, name), ...meta,
    special: [...new Set(meta.special.concat('worklet'))] };
  if (opts.env !== undefined) entry.defaultEnv = envIndex(opts.env);
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/**
 * PC エンジン(HuC6280)のチップで鳴らす音色を足す(`sound/pce.js`)。
 *
 * 波形は 32 個・5 ビット(0〜31)。音量は 5 ビットで 1 段およそ 1.5dB。
 * ノイズは声 5 と 6 だけが出せる。
 *
 * @param {string} name 名前。`pce` で始める
 * @param {{wave?:number[], noise?:boolean}} params wave = 32 個の 0〜31。noise = ノイズにする
 * @param {{overwrite?:boolean, env?:string}} [opts] 説明や役。env は連れてくるエンベロープ
 * @returns {number} 音色の番号
 */
export function registerPCE(name, params = {}, opts = {}) {
  const at = requireFreeName(name, opts.overwrite);
  const noise = !!params.noise;
  const src = Array.isArray(params.wave) ? params.wave : [];
  if (!noise && src.length !== 32) warn(`[ChpTnSnd] PC エンジンの波形は 32 個です(${name} は ${src.length} 個)`);
  const meta = metaOf({ vsteps: 32, vcurve: '1.5db', ...opts });
  const entry = { id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'pce',
    ...(noise ? { noise: true }
      : { wave: Array.from({ length: 32 }, (_, i) => Math.max(0, Math.min(31, Math.round(src[i] ?? 16)))) }),
    role: roleOf(opts.role, name), ...meta,
    special: [...new Set(meta.special.concat('worklet'))] };
  if (opts.env !== undefined) entry.defaultEnv = envIndex(opts.env);
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/**
 * ほかの音色を焼いて、波形として使う(プロシージャルな PCM 音源)。
 *
 * 4 オペのように計算の重い音色を、先に波形にしておいて鳴らすだけにする。
 * 鳴らす側は AudioBufferSource 一本になるので、いちばん遅い機械でも通る。
 *
 * 配るのは作り方だけ。 波形は持ち歩かず、要るときに焼く(ルール 4)。
 *
 * 焼けるまでは元の音色で鳴る。 焼き上がりは速さのためのもので、
 * 鳴らないほうがおかしいため。焼き終わったら黙って差し替わる。
 *
 * @param {string} name 名前。`pcm` で始める
 * @param {{from:string, octaves?:number[], step?:number,
 *          sampleRate?:number, minLoop?:number, loop?:boolean, length?:number,
 *          post?:function, phrase?:string, tempo?:number}} opts
 *   from = 焼く元の音色の名前。octaves = 焼くオクターブ(既定 2..6)。
 *   step = 何半音おきか(既定 1)。間の高さは再生速度で寄せる。
 *   sampleRate = 焼く細かさ(既定 22050)。
 *   loop = 輪にするか(書かなければ、音が残る音色なら輪にする)。
 *   length = 頭の長さ(秒)。書かなければエンベロープから決める。
 *   post = 焼けた波形に掛ける処理。`(data, sampleRate) => ({ data, sampleRate })`。
 *   チップの方式へ落とす音色(sound/oplpcm.js)がここを使う。
 *   phrase = 音色 1 つの代わりに、MML のフレーズを焼く(from は要らない)。
 *   o4c で書いたとおりに鳴り、ほかの高さは読む速さで動く。tempo = そのときのテンポ(既定 120)
 * @param {{overwrite?:boolean}} [flags]
 * @returns {number} 音色の番号
 */
export function registerBaked(name, opts = {}, flags = {}) {
  const at = requireFreeName(name, flags.overwrite);
  if (!opts.from && !opts.phrase) throw new Error('[ChpTnSnd] ' + name + ': 焼く元の音色(from)がありません');
  const entry = {
    role: roleOf(opts.role, name), ...metaOf(opts),
    id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'baked',
    from: opts.from,
    octaves: opts.octaves || [2, 3, 4, 5, 6],
    step: opts.step || 1,
    sampleRate: opts.sampleRate || 22050,
    minLoop: opts.minLoop,
    loop: opts.loop,
    length: opts.length,
    post: typeof opts.post === 'function' ? opts.post : null,
    phrase: opts.phrase ? String(opts.phrase) : null,
    tempo: opts.tempo > 0 ? Number(opts.tempo) : 120,
    baked: null,
    baking: false,
  };
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/**
 * 合成音色を足す。いくつかの音色を同じ位置に重ねて、1 つの名前で呼べるようにする。
 *
 * ---- なぜ音色の側で持つのか ----
 *
 * 打楽器にノイズを添える、オクターブ下で芯を作る、5 度を重ねて厚くする —
 * どれも定番なのに、曲を書くたびに手で並べていた(ゲームの効果音は
 * 31 個のうち 27 個がこれ)。定番はシステムが持つ、という指針そのもの
 * (docs/SOUND_TOOL.md の「演出と作曲を分ける」)。
 *
 * 書き出した先へ渡せるのがいちばん大きい。演出が音色に入っていれば
 * レジスタを直に書く道具の音色定義へそのまま落ちるが、曲の行に散らばって
 * いると、どれが曲でどれが演出なのか機械には見分けられない。
 *
 * ---- 外の `@e` に従うかを、1 つずつ宣言する ----
 *
 * どれが本体かは、エンジンには分からない。2 つ重なっていても、
 * 「太いほうが本体」とも「先に書いたほうが本体」とも言えない。
 * だから登録するときに、層ごとに言う。
 *
 * `env` と `follow` は別の話。
 *
 * | | |
 * | --- | --- |
 * | `env` | その層がふだん着る形。書かなければ、その音色が持っている形 |
 * | `follow` | 曲が `@e` を書いたときに上書きされるか(既定 true) |
 *
 * 両方書ける。`{ env: 'tap', follow: true }` は「ふだんは tap、
 * 曲が `@e{pad}` と言うならパッドになる」。
 * `follow: false` は曲が何と言おうと動かない — 頭に足す短い音や、
 * 打楽器に添える空気のように、曲の都合で変わっては困るもの。
 *
 * 曲が `@e` を書いていないときは、どの層も自分の `env` を着る。
 * 書いたかどうかは、その音色が持っている形と違うかで見る。
 *
 * ---- 重ねられるのは同じリズムのものだけ ----
 *
 * 1 つの音符から全部が同時に鳴る。別のリズムで鳴らしたいものは、
 * いままでどおりトラックを分けて書く。
 *
 *     registerLayer('layerKickAir', {
 *       layers: [
 *         { wave: 'opll::kick' },                  // 芯
 *         { wave: 'noise(white)', gain: 0.5, semi: 12 },  // 空気
 *       ],
 *     });
 *
 * @param {string} name `@{名前}` で呼ぶ名前
 * @param {{layers:{wave:string, gain?:number, semi?:number, cents?:number,
 *          delay?:number, follow?:boolean, env?:string|number}[],
 *          role?:string, tags?:string|string[],
 *          desc?:string, descJa?:string}} opts
 *   layers = 重ねるもの。`gain` は 0..1 の掛け算(既定 1)、
 *   `semi` は半音のずれ、`cents` はその下のずれ、`delay` はフレーム(60 分の 1 秒)
 *   遅らせる量、`follow` は外の `@e` に従うか(既定 true)、
 *   `env` は従わないときに着る形(書かなければその音色の既定)
 * ---- デチューン幅は呼ぶときに渡せる ----
 *
 * `cents` を持つ層があると、`detune` の軸が着く。
 *
 *     @{gamenotes::grdsSt1::edgeLead(detune: 25)}
 *
 * 書いた数(セント)が、いちばん広い層のずれになる。ほかの層は同じ比で
 * 伸び縮みし、上か下かは `cents` の向きを継ぐ。`cents` が 0 の層は動かない。
 *
 * 軸の既定は、その音色がいちばん広くずらしている幅。`cents: 12` の層を持つ
 * 音色なら 12 で、そう書けば元の音になる。既定を null にすると、読む側に
 * 何が基準なのか分からない(2026-10-20)。
 *
 * 音色は作り分けない。幅ごとに名前を増やすと、同じ音が名前の数だけ並ぶ
 * (かっこは引数専用、という決めごと。2026-10-20)。
 *
 * @param {{overwrite?:boolean}} [flags]
 * @returns {number} 音色の番号
 */
export function registerLayer(name, opts = {}, flags = {}) {
  const at = requireFreeName(name, flags.overwrite);
  const list = Array.isArray(opts.layers) ? opts.layers : [];
  // 1 つだけでも、音量を変えるなら作れる(2026-10-13)。波形を持たない音源やチップは v で
  // 音色そのものが変わる(強く弾くと歪むなど)ので、v を下げずに音量だけ下げる道が要る
  const alone = list.length === 1 && list[0] && list[0].gain != null && Number(list[0].gain) !== 1
    && !list[0].semi && !list[0].cents && !list[0].delay;
  if (list.length < 2 && !alone) {
    throw new Error(`[ChpTnSnd] ${name}: 合成音色は 2 つ以上を重ねます`
      + '(1 つだけなら、その音色をそのまま使ってください。音量だけ変えるなら @gain を書きます)');
  }
  const layers = list.map((m, i) => {
    const w = findWave(m.wave);
    if (w < 0) throw new Error(`[ChpTnSnd] ${name}: ${i} 番目の音色 "${m.wave}" は知らない名前です`);
    if (WAVEFORMS[w].kind === 'layer') {
      throw new Error(`[ChpTnSnd] ${name}: 合成音色を合成音色に重ねられません ("${m.wave}")`);
    }
    // `env` と `follow` は別の話。`env` はその層がふだん着る形、
    // `follow` は曲が `@e` を書いたときに上書きされるか。
    // 両方書ける — 「ふだんは tap、曲が言うならそちらに従う」が書けるように
    const follow = m.follow == null ? true : !!m.follow;
    return {
      wave: w,
      gain: m.gain == null ? 1 : clamp(Number(m.gain), 0, 1),
      semi: m.semi == null ? 0 : Number(m.semi),
      cents: m.cents == null ? 0 : Number(m.cents),
      // 遅らせる(フレーム。60 分の 1 秒)。こだまを音色として持つときに使う
      delay: m.delay == null ? 0 : Math.max(0, Number(m.delay)),
      follow,
      env: m.env == null ? null : envIndex(m.env),
    };
  });
  // デチューン幅を呼ぶときに渡せるようにする。ずらしている層が無ければ
  // 効くところが無いので、軸も着せない(何もしないつまみを見せない)。
  //
  // 既定は、この音色がいちばん広くずらしている幅。幅を書くと、層ごとの
  // ずれがその比のまま伸び縮みするので、既定と同じ数を書けば元の音になる
  const width = Math.max(...layers.map((m) => Math.abs(m.cents)), 0);
  // つまみ(2026-10-22)。重ねた音色は自分では音を作らないので、値を部品へ渡すだけ。
  // 部品の側が同じ名前のつまみを持っていれば、そこで効く(sound/analog.js の knobs)。
  // ここでは名前・範囲・既定・説明だけを持つ
  const knobSpec = {};
  for (const [k, v] of Object.entries(opts.knobs || {})) {
    if (!(Number.isFinite(v.min) && Number.isFinite(v.max) && Number.isFinite(v.default))
      || v.min > v.default || v.default > v.max) {
      throw new Error(`[ChpTnSnd] ${name}: つまみ "${k}" には min ≦ default ≦ max の数が要ります`);
    }
    knobSpec[k] = { min: v.min, max: v.max, default: v.default,
      ...(v.unit ? { unit: v.unit } : {}), desc: v.desc ?? null };
  }
  const knobAxes = Object.entries(knobSpec).map(([k, v]) => ({ name: k, ...v }));
  if (width > 0 || knobAxes.length) {
    try {
      registerFamily(name, {
        desc: opts.desc ?? null, overwrite: true,
        params: [...(width > 0 ? [{
          name: 'detune', min: 0, max: 100, unit: 'cent', default: width,
          desc: 'Detune width in cents \u2014 how far apart the offset layers sit.'
            + ' Each layer keeps its direction and its share of the width.',
        }] : []), ...knobAxes],
      });
    } catch (e) { /* すでに入っている */ }
  }
  const entry = {
    role: roleOf(opts.role, name), ...metaOf(opts),
    id: at >= 0 ? at : WAVEFORMS.length, name, kind: 'layer', layers,
    // いちばん広いずれ(セント)。呼ぶときに渡した幅との比を取るのに使う
    ...(width > 0 ? { detune: width } : {}),
    // つまみの既定(名前 → 値)と、その書き方。鳴らすときに既定を部品へ渡し、
    // プリセットを作るときに書き方を写す
    ...(knobAxes.length ? { knobs: Object.fromEntries(knobAxes.map((a) => [a.name, a.default])), knobSpec } : {}),
  };
  // 何と何を重ねて、何声使うのかは、説明の頭に自分で書く。
  // 手で書かせると層を変えたときに古くなる。読む人も相棒も説明しか見ないので、
  // ここがずれると「2 声と書いてあるのに 3 声使う」が起きる
  const made = layers.map((m) => WAVEFORMS[m.wave].name).join(' + ');
  const n = layers.length;
  entry.descJa = `合成音色。${made} を重ねた ${n} 声。` + (entry.descJa || '');
  entry.desc = `A layered voice \u2014 ${made}, ${n} voices.`
    + (entry.desc ? ' ' + entry.desc : '');
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/** エンベロープを名前か番号で引く */
function envIndex(v) {
  if (typeof v === 'number') return clamp(v, 0, ENVELOPES.length - 1);
  const at = ENVELOPES.findIndex((e) => e.name.toLowerCase() === String(v).toLowerCase());
  return at >= 0 ? at : 0;
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * 独自の書き方をする区間。`!名前 { ... }` で開いて `}` で閉じる。
 *
 * 中は音楽の書き方ではない。掃引は音程のかわりに分周を書き、カセットは
 * 音符ですらないデータの並びを置く。ふつうの音符に混ぜて書けると、
 * 読む人がどちらの書き方で読めばよいか分からなくなる(2026-09-16)。
 *
 * 印に `!` を使うのは、ほかの MML がどれもこの字に意味を持たせていないため。
 * `%` はクロックで長さを書く印として広く使われていて(docs/MGS.md)、
 * こちらでもいつか要る。取らずに空けておく。
 *
 * 中の書き方は変えない。`@b` `@k` `@r` `~` `=` はそのまま使える。
 * 区間の外で書いたらエラーにする。どこからその書き方なのかが目で分かる。
 */
const SECTIONS = {
  // BASIC の BEEP で作っていた効果音。BEEP 音色が開く
  beep: {
    byKind: 'beep',
    // 中身は待ち時間の並び。`1-60` のように数字で書く
    chars: [],
    digits: true,
    keys: {
      tick: { min: 1, max: 1e6 },
      // 以下 4 つは音色が持っている値の上書き。書かなければ音色のまま
      carrier: { min: 0, max: 20000 },
      jitter: { min: 0, max: 1 },
      frame: { min: 1, max: 1000 },
      display: { min: 0.01, max: 0.99 },
    },
  },
  // AY のブザー音。音色が開く(`@{ayEnvSaw}{ ... }`)。
  //
  // 中の音符はブザーの高さ。`@g{+12}` を置くと、そこから先の音符に
  // 同じチャンネルの矩形波が重なる(数は半音)。実機はこの 2 つを掛け算する
  // ので、2 声にはならず、1 つの声の音色が変わる(docs/MML.md)。
  //
  // 前は `(c,e)4` と 2 つの高さを並べて書いていた。やめた理由は、
  // 平行に動かすのに毎回 2 つ書くことになるのと、絶対の高さで重ねたい
  // 場面が、旋律を別トラックに持つ `#pair` のほうへ移ったため(2026-09-26)。
  buzz: {
    byVoice: 'buzz',
    chars: ['^'],
    notes: true,
    // `@g{+12}` で、そこから先の音符に重ねる矩形波の間隔(半音)。
    // 数を直に書かないので、読むところは主ループに置いてある
    keys: { g: { semi: true } },
  },
  // カセットのロード音。音色が開く(`@{tape(clean)}{ ... }`)
  tape: {
    byVoice: 'tape',
    chars: ['=', '?'],
    // 音名を書いたら、その高さでデータ(`?`)を 1 つ置く。旋律はこれで書く
    notes: true,
    keys: {
      // 音名でも書ける(`@baud o2a`)。書いた音は `=`(パイロット)の高さになる
      baud: { min: 1, max: 1e6, note: true },
      seed: { min: 0, max: 1e9 },
      // 以下 3 つは音色が持っている値の上書き。書かなければ音色のまま
      hiss: { min: 0, max: 1 },
      wow: { min: 0, max: 1 },
      muffle: { min: 0, max: 20000 },
      // `?` の中身。16 進の並びか `random`(既定)
      bytes: { hex: true },
    },
  },
  // 生音の楽器(`@{acoustic::piano}{ ... }`)。ほかの区間と違い、中はふつうの MML がそのまま書ける。
  // 足すのは、その楽器だけの操作(`@名前 値`)。楽器だけの記号をふつうの MML に混ぜると、
  // ピアノのための `@` が誰の曲にも入ってくる(2026-10-14 に言われた)。区間の中に閉じ込める。
  //
  // 書ける操作は楽器ごと(`only` に楽器の名前)。`#voice` で数を書き換えた音色も、元の楽器で見る
  acoustic: {
    byKind: 'modal',
    full: true,
    chars: [],
    keys: {
      // 右ペダル(ダンパーペダル)。1 で踏み、0 で放す。踏んでいるあいだは鍵盤を放しても音が止まらず、
      // ほかの弦もつられて鳴る。区間を閉じると放す
      ped: { min: 0, max: 1, step: 1, only: ['piano'] },
      // ロールの強弱。次の音符のロールを、その音符の音量からこの音量まで少しずつ変えていく
      // (クレッシェンド・デクレッシェンド)。音量と同じ 0〜15。タイでつないだ音は、つながり全体で変える。
      // 区切って v を変えると、区切りごとに 1 打目から叩き直して継ぎ目が出る(2026-10-14)
      to: { min: 0, max: 15, step: 1, only: ['timpaniRoll'] },
    },
  },
};

/** 音色の `special` から、その音色が開く区間の名前を引く */
const sectionByVoice = (wf) => {
  const sp = (wf && wf.special) || [];
  // 印のあるものが先。カセットもビープ音源の上に載っているので、
  // 種類だけで見るとどちらか分からない
  for (const [name, set] of Object.entries(SECTIONS)) {
    if (set.byVoice && sp.includes(set.byVoice)) return name;
  }
  for (const [name, set] of Object.entries(SECTIONS)) {
    if (set.byKind && wf && wf.kind === set.byKind) return name;
  }
  return null;
};

// ---- 読み方(mode)と、読めなかったところの控え ----
//
// 読み方は 3 つある。呼ぶ側が決める。曲の中には書かない — 同じ曲を、
// 道具では厳しく、ゲームではゆるく読めるようにするため(2026-09-18)。
//
//   strict … 全部エラー。警告も止める
//   normal … いままでと同じ。エラーは投げて、警告は console へ出す(既定)
//   loose  … 何も投げない。読めないところで、そのチャンネルを打ち切る
//
// もう 1 つ `allowOverLimit` がある。**上限を越えてよい**という札で、
// 読み方とは別に立てる(2026-10-23)。
// 前は `force` という名前にしたが、何を force するのか読めなかった。
// 止めているのは `overLimit()` なので、名前をそちらへ揃えた。
//
// 上限は、鳴らせないものを配ってしまわないために置いてある。
// 書き間違いではないので、分かって越えるなら通してよい。
// 通したときは黙らずに警告を出す — 越えたこと自体は知らせたい。
//
// これも曲の中には書かない。上限は聞く人の機械の話なので、
// 越えるかどうかを決めるのは曲ではなく呼ぶ側(`mode` と同じ理由)。
// 同じ性質の上限がこれから増えても、同じ札で通す
//
// 集めるところはモジュールに 1 つ持つ。コンパイルは同期で走り切るので、
// 入れ子にはならない。60 か所へ引数を足すより、ここ 1 か所で済む。
let REPORT = null;

/** `loose` のときだけ投げる。打ち切る場所まで持っていくための印 */
class LooseStop extends Error {}

/** 読み方の名前。知らない言葉は既定に落とす */
function modeOf(name) {
  const key = String(name ?? 'normal').toLowerCase();
  return key === 'strict' || key === 'loose' ? key : 'normal';
}

/**
 * 上限を越えたところ。
 *
 * `allowOverLimit` が立っていなければ止める。立っていれば警告にして通す。
 * 止めるのは「鳴らせないものを配らない」ためで、分かって越えるなら通してよい。
 *
 * 新しい上限を足すときも、`bad()` ではなくここを呼ぶ。
 * そうすれば同じ札で通せる(2026-10-23)
 * @param {string} text 何本できて、上限がいくつか
 * @param {string} how 越えたいときにどう書くか
 */
function overLimit(text, how) {
  if (REPORT && REPORT.allowOverLimit) {
    warn(`${text}。allowOverLimit で通しました`);
    return;
  }
  bad(`${text}。${how}`);
}

/** 控えに 1 件足す。`[ChpTnSnd]` の頭は落とす(読む側で付け直せる) */
function keep(level, text) {
  if (!REPORT) return;
  REPORT.problems.push({ level, text: String(text).replace(/^\[[^\]]+\]\s*/, '') });
}

/**
 * 鳴りはするが怪しいところ。
 *
 * `strict` では止める。`loose` では黙って控えるだけ。
 * `normal` はいままでどおり `console.warn` へ出す。
 */
export function warn(text) {
  keep('warn', text);
  const mode = REPORT ? REPORT.mode : 'normal';
  if (mode === 'strict') throw new Error(text);
  if (mode === 'loose') return;
  console.warn(text);
}

/**
 * 読めないところ。必ず投げる。
 *
 * `loose` のときだけ別の印で投げて、チャンネルの切れ目で受け止める。
 * そこまでに読めたぶんは鳴る。
 */
function bad(text) {
  keep('error', text);
  if (REPORT && REPORT.mode === 'loose') throw new LooseStop(text);
  throw new Error(text);
}

/** その命令が要る区間の名前。区間の外で書いてよいものは undefined */
const SECTION_OF = {};
for (const [name, set] of Object.entries(SECTIONS)) {
  for (const c of set.chars) SECTION_OF[c] = name;
}

/**
 * 区間の中で書いてよいもの(区間ごとの `chars` と `@設定` は別に見る)。
 *
 * 音符は通さない。区間は別の書き方をする場所なので、ふつうの音符が混ざれると
 * 分けた意味が無くなる(2026-09-16)。休符は要る — ロード音の「FILE FOUND の間」が
 * それ。長さ・音の切り方・音量は、書く並びを短くするために通す。
 */
/**
 * どの区間でも書けるもの。
 *
 * `o` `>` `<` は音の高さそのものではなく、音名で書く設定(`@baud o2a`)の
 * 足場になる。区間の中で動かせないと、音名を書くたびにオクターブを
 * 書き足すことになる(2026-09-19)。
 */
const SEC_COMMON = ['l', 'q', 'v', 'r', 'o', '>', '<', '}'];

/** その区間の開き方を字にする。音色が開くものと `!名前` で開くものがある */
const howOpen = (name) => `@{${SECTIONS[name].byVoice || name}…}{ ... }`;

/** その命令をいまの区間で書いてよいか。だめなら止める */
function needSection(what, now) {
  const name = SECTION_OF[what];
  if (!name || now === name) return;
  bad(`[ChpTnSnd] MML: "${what}" は ${howOpen(name)} の中だけで書けます`
    + '(外に書くと、どちらの書き方で読むのか分からなくなります)');
}

/** くり返しやマクロを広げた結果の上限(文字)。回数ではなく長さで止める(下記) */
const LOOP_MAX_CHARS = 1 << 20;

/**
 * マクロの名前に使える字。127 より上も通す。
 *
 * 日本語の名前は動くが、勧めない。登録のときに知らせる。
 * 通しつづけるのは、すでに書いたものを動かなくしないため(2026-09-16)。
 */
const isNameChar = (c) => (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')
  || c === '_' || c.charCodeAt(0) > 127;

/**
 * マクロ。 `$名前 = { ... }` で登録し、`$名前` で呼び出す。
 *
 * 書き方は既存の MML に合わせてある。V1MML が `$名前=中身;`、
 * サクラが `Str A = {cdefg}` で、どちらも `$` か名前 + `=` + 中身。
 * 中身を `{ }` で囲むのはサクラ側の形で、うちの `@{名前}` とも揃うし、
 * `;` のような終わりの印を新しく増やさずに済む。
 * `=` はカセットのコマンドと同じ字だが、`$名前` の直後にしか見ないので混ざらない。
 *
 * 引数はまだ無い。V1MML は `$m{note}=...` → `$m{C}` の形で持っているが、
 * うちで「同じ形を別の高さで」は部品と着せるものの仕事なので、
 * 先に入れる理由が無い。入れるなら `$名前(引数) = { ... }` にすれば、
 * いまの呼び出しと衝突しない。
 *
 * 登録は先に全部拾う。 後ろで登録したものを前で呼べる。
 * 同じ名前を 2 回登録したら知らせて、後のほうを使う。
 *
 * 見える範囲はチャンネル 1 本ぶん。 compileMML はチャンネルごとに呼ばれるので、
 * 別のチャンネルへは渡らない。曲をまたぐ使い回しは部品箱(層 2)の仕事。
 */
function expandMacros(src) {
  const table = new Map();
  const wide = new Set();   // 英数字でない名前。1 つにつき 1 度だけ知らせる
  let body = '';
  let i = 0;
  // 1) 登録を拾って、本文からは抜く
  while (i < src.length) {
    if (src[i] !== '$') { body += src[i++]; continue; }
    const at = i++;
    let name = '';
    while (i < src.length && isNameChar(src[i])) name += src[i++];
    let j = i;
    while (j < src.length && ' \n\t\r'.includes(src[j])) j++;
    if (!name || src[j] !== '=') { body += src.slice(at, i); continue; }   // 呼び出し
    j++;
    while (j < src.length && ' \n\t\r'.includes(src[j])) j++;
    if (src[j] !== '{') {
      warn(`[ChpTnSnd] MML: マクロ "${name}" の中身が { } で囲まれていません`);
      body += src.slice(at, i);
      continue;
    }
    // { } は数えて閉じる。 中身に @{pulse(50)} のような { } が入る
    let depth = 0, k = j;
    for (; k < src.length; k++) {
      if (src[k] === '{') depth++;
      else if (src[k] === '}' && --depth === 0) break;
    }
    if (k >= src.length) {
      warn(`[ChpTnSnd] MML: マクロ "${name}" の } がありません`);
      i = src.length;
      continue;
    }
    if (table.has(name)) warn(`[ChpTnSnd] MML: マクロ "${name}" が二重に登録されています(後のほうを使います)`);
    // 日本語の名前は動くが、これから先は勧めない。区切りに全角スペースを
    // 入れると名前に食われるし、「ゔ」のように同じに見えて別の字がある。
    // 落とすと書いたものが動かなくなるので、知らせるだけにする(2026-09-16)
    if (!wide.has(name) && [...name].some((c) => c.codePointAt(0) > 127)) {
      wide.add(name);
      warn(`[ChpTnSnd] MML: マクロ "${name}" の名前に英数字でない字が入っています`
        + '(いまは動きますが、これから先は a-z 0-9 _ で書いてください)');
    }
    // 囲みの内側の空白は落とす。`$END = { 1 }` と書いたときに中身を ` 1 ` の
    // ままにすると、`]$END` が `] 1` になって回数として読まれない。
    // 見やすさのために空けて書くほうがふつうなので、こちらで落とす(2026-09-14)
    table.set(name, src.slice(j + 1, k).trim());
    i = k + 1;
  }
  // 2) 循環参照を登録の時点で見つけて止める。`$a = { $a c }` は置き換えでは
  //    終わらず、長さの上限まで 1 文字ずつ伸びつづける(実測 13 秒)。
  //
  //    前は空にして知らせるだけにしていた。やめる(2026-09-16)。
  //    書いたものが黙って消えると、鳴らしてみるまで気づけない。
  //    番号で音色を選んだときと同じで、その場で止めたほうが直しやすい
  const refsOf = (s) => {
    const out = [];
    for (let k = 0; k < s.length; k++) {
      if (s[k] !== '$') continue;
      let name = '';
      while (k + 1 < s.length && isNameChar(s[k + 1])) name += s[++k];
      if (name) out.push(name);
    }
    return out;
  };
  const state = new Map();   // 0=まだ / 1=たどっている最中 / 2=済み
  const path = [];           // たどっている最中の名前。回った道筋を言うために持つ
  const walk = (name) => {
    const st = state.get(name) || 0;
    if (st === 1) {
      const from = path.indexOf(name);
      const ring = [...path.slice(from < 0 ? 0 : from), name].map((n) => `$${n}`).join(' → ');
      bad(`[ChpTnSnd] MML: マクロ "${name}" が循環参照しています(${ring})。`
        + '展開しても終わらないので、ここで止めます');
    }
    if (st === 2) return;
    state.set(name, 1);
    path.push(name);
    for (const r of refsOf(table.get(name) || '')) if (table.has(r)) walk(r);
    path.pop();
    state.set(name, 2);
  };
  for (const k of [...table.keys()]) walk(k);

  // 3) 呼び出しを中身に置き換える。マクロの中からマクロを呼べるので、
  //    無くなるまでくり返す。止めるのはくり返しと同じく長さで
  //
  //    前後に何も足さない。ただの文字の置き換えにする。
  //    以前は空白を 1 つずつ入れていた。`$a = { c4 }` を `$a4` と呼んだときに
  //    `c44` にならずに済むが、そのぶんくっついてほしい書き方ができなかった。
  //    `]$LOOP_END` は回数として読まれず(expandLoops は `]` の直後からしか
  //    数字を見ない)、`l$LEN` `o$OCT` も同じ。
  //    数字が続くときは、呼ぶ側で空ける(2026-09-14)。
  const missing = new Set();
  for (;;) {
    const at = body.indexOf('$');
    if (at < 0) break;
    let e = at + 1;
    let name = '';
    while (e < body.length && isNameChar(body[e])) name += body[e++];
    const hit = table.get(name);
    if (hit === undefined) {
      if (name && !missing.has(name)) {
        missing.add(name);
        warn(`[ChpTnSnd] MML: マクロ "${name}" は登録されていません`
          + `(あるのは ${[...table.keys()].join(' / ')})`);
      }
      body = body.slice(0, at) + body.slice(e);   // 落として先へ進む
      continue;
    }
    const next = body.slice(0, at) + hit + body.slice(e);
    if (next.length > LOOP_MAX_CHARS) {
      // 落として鳴らすのはやめた(2026-09-16)。短くなったことに気づけない
      bad(`[ChpTnSnd] MML: マクロ "${name}" が大きすぎます`
        + `(広げると ${next.length} 文字。上限は ${LOOP_MAX_CHARS} 文字)`);
    }
    body = next;
  }
  return body;
}

/**
 * `[ ... ]n` のくり返しをテキストとして展開する(入れ子可)。
 *
 * 回数では止めない。 いちばん内側から潰していくので、広げた中身に
 * 新しい `[` は入らず、`[` は 1 回ごとにきっちり 1 つ減る。つまり回数は
 * 書いたくり返しの数そのもので、そこに上限を置くと書いたぶんが黙って落ちる
 * (以前 64 回で打ち切っていて、65 個目から先が 1 回だけ鳴っていた)。
 *
 * 止めるべきなのは長さのほう。`[[[[c]9]9]9]9` のような入れ子は
 * 指数で膨らむので、そこだけ見張って、超えたら知らせて止める。
 */
// 「ずっと繰り返す」の印。MML に書けない字を使う(打ち間違いとぶつからない)
/** 曲の中のラベルの目印 */
const MARK_AT = '\u0003';
/** 合図(`#cue`)を本文へ残すときの印。ラベルと同じ作りで、名前は預ける */
const CUE_AT = '\u0004';

/**
 * 字(`"…"`)を本文へ残すときの印。合図と同じ作りで、中身は外に預ける。
 *
 * 本文から抜いておくのは、小文字へ揃える前に逃がすため。
 * 本文はドラムの囲みの外をすべて小文字にするので、残したままだと
 * 書いた字が変わる(`"Am7"` が `"am7"` になる)。
 */
const TEXT_AT = '\u0005';
/**
 * ラベルの予約語。ここに置いたラベルが、くり返すときに戻る先になる。
 *
 * ラベルとして跳ぶ先にもなるので、書いた人から見ればただのラベル 1 つ。
 * 曲そのものは変わらない — 長さも音符も、これを消しても同じ。
 * 変わるのは、終わりまで来たあとどこへ戻るかだけ(2026-09-15)。
 */
const LOOP_LABEL = 'loop';

/** そのラベルが戻る先の印か */
function isLoopMark(low) {
  return low === LOOP_LABEL;
}

/**
 * 曲の頭に自動で足すラベルの名前。
 *
 * 頭出しの押しどころは、どの曲にも要る。書く人に毎回書かせるものでもない。
 * ここで足しておけば、跳ぶ先の一覧がいつも曲の頭から始まる(2026-09-16)。
 *
 * `INTRO` にはしない。前奏のある曲だけが持つ言葉なので、
 * 前奏のない曲に出ると嘘になる。`START` はどちらでも正しい。
 */
const START_LABEL = 'start';
/**
 * ラベルの予約語、その 2。ここから下が後奏になる。
 *
 * ふつうに鳴らしているあいだは鳴らない。鳴らす側が「終わりへ向かえ」と
 * 言ったとき(`goToEnding()`)だけ、いま回っている周を鳴らし終えてから入る。
 * くり返す範囲も、曲の終わりではなくここまでになる(2026-09-15)。
 *
 * 名前は `OUTRO`。intro の対語がこれで、道具の側(FMOD や Wwise)も
 * intro / loop / outro で揃えている。ending は「エンディング曲」という
 * 別の曲を指すことが多く、区間の名前としては輪郭がぼやけた(2026-09-15)。
 * 前の名前 `ENDING` も読む。すでに書いた曲があるので切らない。
 * 読んだときに 1 度だけ知らせる
 */
const OUTRO_LABEL = 'outro';
const OLD_OUTRO_LABEL = 'ending';
let saidOldOutro = false;

/** そのラベルが後奏の印か。古い名前で書いてあれば、1 度だけ知らせる */
function isOutroMark(low) {
  if (low === OUTRO_LABEL) return true;
  if (low !== OLD_OUTRO_LABEL) return false;
  if (!saidOldOutro) {
    saidOldOutro = true;
    warn('[ChpTnSnd] MML: ラベル "ENDING" は古い名前です。'
      + 'これからは "OUTRO" と書きます(intro の対語)。'
      + 'いまのところ ENDING もそのまま読みます');
  }
  return true;
}

/**
 * そのラベルが予約語かどうか。
 *
 * `START` `LOOP` `OUTRO` の 3 つ(と `OUTRO` の古い名前の `ENDING`)。
 * どれも曲の作りを指すもので、書いた人が付けた名前ではない。
 *
 * 一覧からは落とさない(2026-09-16)。`LOOP` も `OUTRO` も、
 * 聞く人が跳びたい場所そのものなので、隠す理由が無かった。
 * 落としたい側だけが `{ hideSystem: true }` を渡す。
 *
 * @param {string} name ラベルの名前。大文字小文字と前後の空白は見ない
 * @returns {boolean} 予約語なら true
 */
export function isSystemMark(name) {
  const low = String(name ?? '').trim().toLowerCase();
  return low === START_LABEL || low === LOOP_LABEL
    || low === OUTRO_LABEL || low === OLD_OUTRO_LABEL;
}

/** 曲の頭のラベルの名前(大文字)。鳴らす側が足すときに使う */
export const HEAD_MARK = START_LABEL.toUpperCase();

/**
 * 予約語はこれからも増える。全部大文字の名前は、こちらが取る分として空けておく。
 *
 * 書いたら止める(2026-09-16)。前は知らせるだけにしていたが、エラーにするのは
 * 言い過ぎになる。ただ、あとで意味が付いたときに曲の鳴り方が変わるので、
 * そのときに「知らなかった」と言われないように 1 度言う(2026-09-15)。
 */
const SHOUTING = (name) => /^[A-Z0-9 _-]+$/.test(name) && /[A-Z]/.test(name);
// 和音の囲み。ほかの MML と同じ字(sakuramml など)
const CHORD_QUOTE = "'";

function expandLoops(src) {
  for (;;) {
    const open = src.lastIndexOf('['); // 最内ループから展開する
    if (open < 0) break;
    const close = src.indexOf(']', open);
    if (close < 0) {
      // 閉じ括弧なし: その `[` だけ捨てて、手前のくり返しは生かす
      src = src.slice(0, open) + src.slice(open + 1);
      continue;
    }
    const body = src.slice(open + 1, close);
    // `]*` はずっと繰り返す書き方だった。やめた(2026-09-15)。
    // 囲みは終わりの位置まで書けてしまうので、チャンネルごとに終わりが食い違い、
    // いちばん長いチャンネルの後ろが鳴らないことがあった。
    // 戻る先は点で足りるので、ラベルの予約語(`#label LOOP`)に移した。
    // こう分けると、曲の長さは読んだ時点で決まる
    if (src[close + 1] === '*') {
      warn('[ChpTnSnd] MML: "]*" は使えません。'
        + 'くり返すときに戻る先は "#label LOOP" で書きます(ここは 1 回だけ鳴ります)');
      src = src.slice(0, open) + body + src.slice(close + 2);
      continue;
    }
    let numEnd = close + 1;
    while (numEnd < src.length && src[numEnd] >= '0' && src[numEnd] <= '9') numEnd++;
    const count = numEnd > close + 1 ? parseInt(src.slice(close + 1, numEnd), 10) : 2;
    // `]0` は 0 回。中身ごと消える
    if (count === 0) {
      src = src.slice(0, open) + src.slice(numEnd);
      continue;
    }
    const next = src.slice(0, open) + body.repeat(Math.max(0, count)) + src.slice(numEnd);
    if (next.length > LOOP_MAX_CHARS) {
      // 1 回だけにして鳴らすのはやめた(2026-09-16)。
      // 書いた回数と鳴る回数が黙って食い違う
      bad('[ChpTnSnd] MML: くり返しが大きすぎます'
        + `(広げると ${next.length} 文字。上限は ${LOOP_MAX_CHARS} 文字)`);
    }
    src = next;
  }
  return src.replace(/[\[\]]/g, '');
}

/**
 * 注釈を落とす。`//` は行末まで、`/*` から `*` `/` までは何行でもまたげる。
 *
 * 曲そのもの以外のこと — 何のために作ったか、どういう構成か、
 * どの部品がどこに効いているか — を MML の中に書けるようにするため。
 * 別のファイルに書くと、必ず中身と離れていく。
 *
 * 落とすときに改行は残す。 潰してしまうと「何行目がおかしい」と言えなくなる。
 * 注釈は `expandLoops` より先に落とす。中の `[` を数えられては困る。
 *
 * @param {string} src
 * @returns {string}
 */
/**
 * エフェクトの中身を読む。`lowpass 800` `echo @l 8 @feedback 0.6` の形。
 *
 * チャンネルの `@f{…}` と、曲ぜんぶの `#fx` の両方から呼ぶ。書き方を 2 か所に
 * 持つと、片方だけ直したときに食い違う。
 *
 * 位置で書けるのは先頭の 1 つ(フィルタなら `cutoff`、echo と reverb なら `time`)
 * だけで、あとは名前で書く。遅れは `@l` で音符の長さでも書ける。
 *
 * 種類とパラメータの名前と範囲は `FX_KINDS`(`sound/filter.js` の `FILTERS` と
 * `sound/fx.js` の `MASTER_FX`)から引く。
 *
 * @param {string[]} words 中身を空白で切ったもの(先頭が種類)
 * @param {number} tempo `@l` を秒に直すのに使うテンポ
 * @param {(head:string)=>string} tag 知らせに出す書き方の見本
 * @param {(msg:string)=>void} fail 読めなかったときの知らせ
 * @returns {object|null} `{kind, ...値}`。読めなければ null
 */
function readFxWords(words, tempo, tag, fail) {
  // 空白を詰めて書いても読む(`@l8@feedback0` → `@l 8 @feedback 0`)。
  // MML はふつう詰めて書くので、ここだけ空白が要ると引っかかる(2026-10-21)。
  // 名前は英字だけなので、`@` と、名前のあとの数の頭で切れば決まる
  words = words.flatMap((w) => w.replace(/@/g, ' @').trim().split(/\s+/))
    .flatMap((w) => {
      const m = /^@([A-Za-z]+)(-?[\d.].*)$/.exec(w);
      return m ? [`@${m[1]}`, m[2]] : [w];
    })
    .filter(Boolean);
  const head = words.shift();
  if (!FX_KINDS[head]) {
    fail(`[ChpTnSnd] MML: ${tag(head ?? '')} — "${head ?? ''}" というエフェクトはありません`
      + `(書けるのは ${Object.keys(FX_KINDS).join(' / ')})`);
    return null;
  }
  const names = Object.keys(FX_KINDS[head].params);
  const got = {};
  // 先頭が数なら、いちばん触るもの(フィルタは cutoff、echo と reverb は time)として読む
  if (words.length && !words[0].startsWith('@')) {
    const f = parseFloat(words.shift());
    if (!Number.isFinite(f)) {
      fail(`[ChpTnSnd] MML: ${tag(head)} の 1 つ目は ${names[0]} の数です`);
      return null;
    }
    got[names[0]] = f;
  }
  while (words.length) {
    const key = words.shift();
    if (!key.startsWith('@')) {
      fail(`[ChpTnSnd] MML: ${tag(head)} — "${key}" は名前で書いてください`
        + `(例 @resonance 0.8)。位置で書けるのは 1 つ目の ${names[0]} だけです`);
      return null;
    }
    const name = key.slice(1);
    // 音長で遅れを書く(`@l 8`、付点は `@l 8.`)。MML の `l8` と同じ数え方で、
    // そのときのテンポで秒に直す。小数は受けない — `8.` を付点のつもりで書いても
    // 8 分として通ってしまうのと、付点を小数(5.333)で書くと読めないため(2026-10-17)
    if (name === 'l' && FX_KINDS[head].params.time) {
      const word = words.shift() ?? '';
      const sec = noteLenSec(word, tempo);
      if (sec == null) {
        fail(`[ChpTnSnd] MML: ${tag(head)} の "@l" は音長です。`
          + `整数と付点で書きます(@l 8、付点 8 分は @l 8.)。"${word}" は読めません`);
        return null;
      }
      got.time = sec;
      continue;
    }
    const raw = parseFloat(words.shift());
    if (!Number.isFinite(raw)) {
      fail(`[ChpTnSnd] MML: ${tag(head)} の "@${name}" に数がありません`);
      return null;
    }
    if (!FX_KINDS[head].params[name]) {
      fail(`[ChpTnSnd] MML: ${tag(head)} に "@${name}" はありません`
        + `(書けるのは ${Object.keys(FX_KINDS[head].params).map((k) => '@' + k).join(' ')}`
        + `${FX_KINDS[head].params.time ? ' / @l' : ''})`);
      return null;
    }
    got[name] = raw;
  }
  const spec = { kind: head };
  for (const [name, d] of Object.entries(FX_KINDS[head].params)) {
    spec[name] = clamp(got[name] ?? d.default, d.min, d.max);
  }
  return spec;
}

/**
 * 本文に最初に出てくるテンポ(`t112`)。`#fx … @l` を秒に直すのに使う。
 *
 * `#tempo` を書いてあればそちらが先。どちらも無ければ null を返す。
 * 注釈と字(`"…"`)は先に落とす。中の `t` を拾っては困る
 *
 * @param {string} src MML
 * @returns {number|null}
 */
export function firstTempo(src) {
  const body = String(src ?? '')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/[^\n]*/g, ' ')
    .replace(/"[^"]*"/g, ' ');
  const m = /(?:^|[^A-Za-z@_])t[ \t]*(\d+(?:\.\d+)?)/.exec(body);
  return m ? Number(m[1]) : null;
}

/**
 * 注釈の中の指示行を読む。`#` で始まる行を拾う。
 *
 * 注釈なので、書き足しても鳴り方は変わらない(`compileMML` が注釈ごと落とす)。
 * 同じ 1 本のテキストが、鳴らす用と渡す用を兼ねる。
 *
 * ここに置いてあるのは、MML の書き方を決めるのがここだから。
 * 前は書き出しの道具(`tool/core/mml2rpp.js`)が自分で読んでいたが、
 * プレイヤーにチャンネル名を出すのにエンジン側も要ることになった。
 * 2 か所に同じ読み方があると、片方だけ直したときに食い違う(2026-09-15)。
 *
 * 書き方は行頭の `#…`。囲み注釈(`/ *` … `* /`)の中は読まない。
 * 昔の `// #…` も読む(いずれ読まなくなる)。
 *
 * ```
 * #title 鋼の翼
 * #version 1.2
 * #meter 4/4
 * #looptimes 4
 * #name 主旋律
 * #role melody
 * ```
 *
 * `#version` は曲そのもののバージョン。同じ曲を何度も直すので、いま鳴っているのが
 * どれなのかが分からなくなる。中身は見ないので、日付でも `1.2` でも書ける
 * (2026-09-19)。
 *
 * 曲ぜんぶに関わるもの(`title` / `version` / `tempo` / `meter` / `section` /
 * `looptimes`)はどのチャンネルに書いてもよい。トラックごとのもの(`name` / `role` /
 * `group` / `machine`)はそのチャンネルの MML に書く。
 *
 * ```
 * #group nes            版だけ。その版まるごと 1 組
 * #group msx scc        版と組。組は重なる
 * #machine msx-scc      音量と音色の釣り合いを決める名前
 * ```
 *
 * `#group` は 2 段で、`group`(版)と `groupSet`(組)に分けて返す。
 * `#machine` は名前をそのまま持つだけで、検査しない。どちらも
 * 最初の `#ch` より前に書けば全チャンネルに写る(`#tuning` と同じ規則)。
 *
 * @param {string} mml 指示行(`#…`)を含む MML。1 本のテキストでも 1 チャンネルでもよい
 * @returns {object} 見つかった指示(無ければ空)
 */
export function readDirectives(mml) {
  const meta = {};
  const sections = [];
  // `#fx … @l` を秒に直すのに要るテンポ。要るときだけ本文を見る
  let bodyT;
  const bodyTempo = () => (bodyT === undefined ? (bodyT = firstTempo(mml) ?? 120) : bodyT);
  for (const line of commentLines(String(mml ?? ''))) {
    const m = DIRECTIVE.exec(line);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === 'section') {
      // `#section <小節> <名前>`。小節は 1 から数える(人が読む番号に合わせる)
      const sp = val.search(/\s/);
      const bar = Number(sp < 0 ? val : val.slice(0, sp));
      if (Number.isFinite(bar)) sections.push({ bar, name: sp < 0 ? '' : val.slice(sp).trim() });
    } else if (key === 'takes' || key === 'take') {
      // 選択肢の囲み。場所を指すものなので、覚え書きには入れない
      //(切り分けは splitTakes がやる)
    } else if (key === 'bundle' || key === 'chord' || key === 'drum' || key === 'voice'
      || key === 'wave') {
      // バンドル音色・和音の楽器・ドラムの割り当て・MML 内の音色と波形メモリ。
      // 音色の話なので、覚え書きには入れない(読むのは readBundles /
      // readChordSets / readDrums / readVoices / readWaves)
    } else if (key === 'group') {
      // `#group <版> [<組>]`。区切りは空白なので、名前に空白は使えない
      const words = val.split(/[ \t]+/).filter(Boolean);
      if (!words.length) {
        warn('[ChpTnSnd] MML: "#group" に名前がありません。読み飛ばします');
        continue;
      }
      // 3 段目は読まない。深さがそのまま性質(版は排他、組は重なる)なので、
      // 3 段目には当てる意味がまだ無い(docs/ENGINE_TODO.md)
      if (words.length > 2) {
        warn(`[ChpTnSnd] MML: "#group ${val}" は 3 段以上です。`
          + `2 段目まで("${words[0]} ${words[1]}")を使います`);
      }
      // 全部大文字はこちらの取り分。ラベルと同じ決めごとにしてある。
      // あとで予約語が増えたときに、曲の鳴り方が黙って変わるのを防ぐ
      for (const w of words.slice(0, 2)) {
        if (SHOUTING(w)) {
          bad(`[ChpTnSnd] MML: グループ名 "${w}" は全部大文字です。`
            + '大文字の名前は予約語のために空けてあります'
            + '(いまの予約語は ALL)。小文字で書いてください');
        }
      }
      meta.group = words[0];
      if (words[1] !== undefined) meta.groupSet = words[1];
    } else if (key === 'tempo') {
      const n = Number(val);
      if (Number.isFinite(n) && n > 0) meta.tempo = n;
    } else if (key === 'gain') {
      // `#gain <倍率> [measured]`。曲ぜんぶに掛かる大きさ。
      //
      // ---- なぜ `v` で足りないか ----
      //
      // `v` は 0〜15 の段で、上限を越えて増やせない。音源ごとに曲線も段数も
      // 違うので、全パートの `v` を一律に上げても同じ倍率にはならず、
      // 釣り合いが変わる。ここは出口に掛ける 1 つの数なので、
      // パートの釣り合いを保ったまま曲ぜんぶを持ち上げられる。
      //
      // ---- 聴く人のつまみとは取り合わない ----
      //
      // あちらは手元の大きさで、こちらは曲が名乗る大きさ。掛け算になる。
      //
      // ---- 2 語目の印 ----
      //
      // 道具が測って書いた行には `measured` が付く。人が書いた行には付かない。
      // 道具は自分の書いた行だけを差し替える(→ docs/LOUDNESS.md)。
      const words = val.split(/[ \t]+/).filter(Boolean);
      const n = Number(words[0]);
      if (!Number.isFinite(n) || n < 0) {
        warn(`[ChpTnSnd] MML: #gain "${val}" は 0 以上の数ではありません。読み飛ばします`);
        continue;
      }
      // 上限は `audio.volume` と揃える。越えたぶんを黙って落とすと、
      // 書いた倍率で鳴っていないことに気づけない
      if (n > 8) {
        warn(`[ChpTnSnd] MML: #gain ${n} は上限の 8 を越えています。8 で鳴らします`);
      }
      meta.gain = Math.min(8, n);
      if (words[1]) meta.gainBy = words[1].toLowerCase();
    } else if (key === 'fx') {
      // `#fx <種類> [値] [@名前 値]…`。曲ぜんぶの出口に、書いた順に通す。
      // 中の書き方はチャンネルの `@f{…}` と同じ。
      //
      // 番号を付けないのは、全体のエフェクトが鳴っている途中で差し替えられない
      // ため。並ぶ順だけが要るので、書いた順がそのまま通る順になる。
      //
      // 書くところは最初の `#ch` より前。曲ぜんぶに掛かるものなので、
      // どのチャンネルに書いても同じに効く(`#gain` と同じ扱い)
      const spec = readFxWords(val.split(/[\s,]+/).filter(Boolean),
        meta.tempo ?? bodyTempo(),
        (h) => `"#fx ${h} …"`,
        (msg) => warn(`${msg}。読み飛ばします`));
      if (spec) (meta.fx || (meta.fx = [])).push(spec);
    } else if (key === 'master') {
      // `#master <名前>`。仕上げの設定(sound/fx.js の MASTER_PRESETS)を、
      // 書いたところで `#fx` の並びに入れる。`#fx` と混ぜて書くと、書いた順に通る
      const pre = MASTER_PRESETS[val.trim()];
      if (!pre) {
        warn(`[ChpTnSnd] MML: #master "${val}" という設定はありません`
          + `(書けるのは ${Object.keys(MASTER_PRESETS).join(' / ')})。読み飛ばします`);
      } else {
        (meta.fx || (meta.fx = [])).push(...pre.fx.map((fx) => ({ ...fx })));
      }
    } else if (key === 'looptimes') {
      // 本編を何周してほしいか。鳴らす側が何も言わなければこの数で回る
      const n = Number(val);
      if (Number.isFinite(n) && n > 0) meta.loopTimes = Math.floor(n);
      else warn(`[ChpTnSnd] MML: #looptimes "${val}" は数ではありません。読み飛ばします`);
    } else if (val !== '') {
      // 解説は続けて書ける。書いた順に改行でつなぐ
      if (STACKED.includes(key) && meta[key]) meta[key] += `\n${val}`;
      else meta[key] = val;
    }
  }
  if (sections.length) meta.sections = sections;
  return meta;
}
const DIRECTIVE = /^[ \t*]*#[ \t]*([A-Za-z][\w-]*)[ \t]*(.*)$/;

/**
 * バンドル音色を読む。
 *
 * ```
 * #bundle mypiano = @{piano} v5 @o+1, @{organ} v4 q7
 * #bundle softbass = @{waveRamp} @e{piano}
 * ```
 *
 * 音色と、着せるもの(音量・エンベロープ・ずらし)をひとまとめにして名前を付ける。
 * `,` で区切って 1 つ以上。2 つ以上書けば、呼んだところから先の音符が
 * その数だけ重なって鳴る。1 つなら重ならず、着せ替えに名前が付くだけ。
 *
 * 音色は作らない。番号(`WAVEFORMS` の添字)も説明も増えないので、
 * 曲が消えれば一緒に消える。名前を付けて使い回したいものは、
 * `registerLayer()` の合成音色にする。
 *
 * 指示行に書く。最初の `#ch` より前に書けば、切り分けたあと全部のチャンネルの
 * 頭に写るので、1 か所で済む(`splitVoices`)。
 *
 * 中に書いたもの(`v` `q` `@e`)はそれが勝ち、書かなければ曲のものに従う。
 * `@o` と `@d` は曲のものに足す。
 *
 * @param {string} mml 指示行を含む MML
 * @returns {Map<string, object[]>} 名前(小文字)→ 中身の並び
 */
export function readBundles(mml) {
  const out = new Map();
  const seenText = new Map();
  for (const line of commentLines(String(mml ?? ''))) {
    const m = BUNDLE_LINE.exec(line);
    if (!m) continue;
    const name = m[1].trim().toLowerCase();
    if (findWave(name) >= 0) {
      bad(`[ChpTnSnd] MML: バンドル音色 "${name}" は音色の名前と同じです`
        + '(別の名前にしてください)');
    }
    // 同じ字で 2 度書くのは、`shareBundles()` が全チャンネルへ配ったときに起きる。
    // 中身が同じなら黙って通す。違っていたら書き間違いなので言う
    const raw = m[2].trim();
    if (out.has(name) && seenText.get(name) !== raw) {
      warn(`[ChpTnSnd] MML: バンドル音色 "${name}" を 2 度書いています(後のほうを使います)`);
    }
    seenText.set(name, raw);
    const parts = splitParts(m[2]);
    if (!parts.length) {
      bad(`[ChpTnSnd] MML: バンドル音色 "${name}" の中身がありません`);
    }
    out.set(name, parts.map((t) => readBundlePart(name, t, out)));
  }
  return out;
}
const BUNDLE_LINE = /^[ \t*]*#[ \t]*bundle[ \t]+([A-Za-z][\w-]*)[ \t]*=[ \t]*(.*)$/i;
const CHORD_LINE = /^[ \t*]*#[ \t]*chord[ \t]+([A-Za-z][\w-]*)[ \t]*=[ \t]*(.*)$/i;

/**
 * MML の中で波形メモリを作る。
 *
 * ```
 * #wave vpBass = 0.000 0.127 0.251 …
 * #wave vpDull = @bits{5} 0.000 0.127 …
 * #wave vpSaw  = @bits{5} @role{bass} -1 -3/4 -1/2 -1/4 0 1/4 1/2 3/4
 * ```
 *
 * 数を空白(か `,`)で区切って並べるだけ。値は -1〜1 で、はみ出したぶんは
 * 登録のときに切られる(`addWave` と同じ)。深さは `@bits{…}`、
 * 書き出しの当て先は `@role{…}`。どちらも先頭に置く。深さを省略すると 8。
 *
 * ---- 分数で書ける ----
 *
 * `3/4` のように書ける。段を等分した形は分数のほうが読める —
 * `-1 -3/4 -1/2 -1/4 0 1/4 1/2 3/4` は見ただけで鋸波だと分かるが、
 * `-1 -0.75 -0.5 -0.25 0 0.25 0.5 0.75` は読み解くことになる。
 * 段の値をそのまま書くのにも使える(5 ビットなら `7/31` のように)。
 *
 * ---- なぜ小数か ----
 *
 * 16 進のほうが短く書けるが、書き方の刻みと鳴らす深さが割り切れないと、
 * 二度丸めたぶんがずれる。8 ビットで書いたものを 5 ビットで鳴らすと、
 * 255 と 31 が割り切れないので 1 段ずれる。小数なら丸めが 1 回で済む。
 * 16 進は、刻みをどこに置くか決まってから足す。
 *
 * ---- 計算はここに書けない ----
 *
 * 倍音を積んだりフィルタを掛けたりは、JS で並びを作って `addWave` に渡す。
 * ここは「計算し終えた並びを MML の中に置く」ための道で、JS の置き換えではない
 *(`#voice` と同じ考え方)。
 *
 * ---- 説明は持てない ----
 *
 * `desc` は書けない。曲の中の一時利用なので、曲が消えれば一緒に消える。
 * 使い回したいものは JS で登録する。
 *
 * ロールだけは書ける。あれは説明ではなく、書き出しの当て先だからで、
 * 無いと当てはめが名前やトラックからの推測に落ちる(docs/EXPORT.md)。
 * 曲の中だけの波形でも、その曲を書き出すときには要る(2026-09-30)。
 *
 * @param {string} mml 指示行を含む MML
 * @returns {Map<string, number>} 名前(小文字)→ 1 周期のサンプル数
 */
export function readWaves(mml) {
  const out = new Map();
  for (const line of commentLines(String(mml ?? ''))) {
    const m = WAVE_LINE.exec(line);
    if (!m) continue;
    const name = m[1].trim();
    let rest = m[2].trim();
    let bits = 8;
    let role;
    // 指示は先頭だけに置かせる。そうすると残り全部が数の並びになるので、
    // どこで並びが終わるかを探さなくてよい。並び順は問わない
    for (let o = WAVE_OPT.exec(rest); o; o = WAVE_OPT.exec(rest)) {
      const word = o[2].trim();
      if (o[1].toLowerCase() === 'bits') {
        bits = Number(word);
        if (!Number.isInteger(bits) || bits < 1 || bits > 16) {
          bad(`[ChpTnSnd] MML: 波形 "${name}" の @bits "${word}" は 1〜16 の整数です`);
        }
      } else {
        role = word;
      }
      rest = rest.slice(o[0].length);
    }
    const words = rest.split(/[\s,]+/).filter(Boolean);
    if (words.length < 2 || words.length > 1024) {
      bad(`[ChpTnSnd] MML: 波形 "${name}" は 2〜1024 個の数です`
        + `(${words.length} 個ありました)`);
    }
    const samples = words.map((w) => {
      const v = waveNum(w);
      if (!Number.isFinite(v)) {
        bad(`[ChpTnSnd] MML: 波形 "${name}" の "${w}" は読めません`
          + '(-1〜1 の数か、3/4 のような分数です)');
      }
      return v;
    });
    tellIfTaken(name, findWave(name) >= 0, '波形');
    registerWave(name, samples, bits, { overwrite: true, role });
    out.set(name.toLowerCase(), samples.length);
  }
  return out;
}
const WAVE_LINE = /^[ \t*]*#[ \t]*wave[ \t]+([A-Za-z][\w-]*)[ \t]*=[ \t]*(.*)$/i;
const WAVE_OPT = /^@[ \t]*(bits|role)[ \t]*\{([^}]*)\}[ \t]*/i;

/**
 * 波形の 1 つぶんを読む。`3/4` のような分数も受ける。
 *
 * 段を等分した形は分数のほうが読めるため(`readWaves` の覚え書き)。
 * 割り算をここでやってしまうので、以降は小数で書いたのと区別がない。
 *
 * @param {string} word
 * @returns {number} 読めないときは NaN(呼ぶ側が止める)
 */
function waveNum(word) {
  const at = word.indexOf('/');
  if (at < 0) return Number(word);
  const a = Number(word.slice(0, at));
  const b = Number(word.slice(at + 1));
  // 0 で割ると Infinity になる。Number.isFinite で弾かれるが、
  // 「読めません」より先に分母を見たほうが、直すところが分かる
  if (b === 0) return NaN;
  return a / b;
}

/**
 * MML の中で音色を作る。
 *
 * ```
 * #voice psgJazzPiano = @adsr{0.002, 0.34, 0, 0.05}
 * #voice psgKickDrop  = @{pulse(50)} @pitch{900, 300, 0}
 * #voice myLead       = @{pulse(25)} @e{piano} @arp{0, 4, 7} @loop{arp 0}
 * #voice myPair       = @{pulse(50)}, @{pulse(50)} @d+7 @delay{2} @gain{0.6}
 * ```
 *
 * ---- 何が作れるか ----
 *
 * 書いた中身で行き先が決まる。指示行を 3 つに分けると、書く人が
 * 「これはどれで作るのか」を先に決めることになる。それは作る側の都合なので、
 * `#voice` 1 つにまとめてある(2026-09-29)。
 *
 * - `@adsr{a, d, s, r}` だけ書いたもの → エンベロープ(`@e{名前}` で呼ぶ)
 * - 音色 1 つと表 → 音色(`registerTone` と同じもの)
 * - `,` で区切って 2 つ以上 → 合成音色(`registerLayer` と同じもの)
 * - `@opll{…}` → OPLL のユーザー音色(`registerOPLLVoice` と同じもの)
 * - `@opm{…}` → 4 オペの音色(`registerOPM` と同じもの。OPM のチップで鳴る)
 * - 外のファイルが加えた書き方(`@opl{…}` など。`registerVoiceSyntax`)→ その音源の音色
 *
 * ---- JS の口は残る ----
 *
 * 計算で作る表(うねる音量、長い分散和音)は、ここには書けない。
 * 数を並べるだけなので、式が書きたければいままでどおり JS を呼ぶ。
 * ここにあるのは「短いものを MML の中で済ませる」ための道で、
 * JS の置き換えではない。
 *
 * ---- 覚え書きは持てない ----
 *
 * 説明もロールもタグも書けない。曲の中の一時利用なので、曲が消えれば
 * 一緒に消える。使い回したいものは JS で登録する。
 *
 * ---- 名前がぶつかったら ----
 *
 * 同じ名前が先にあれば、MML のほうが勝つ。曲の中の話なので、
 * その曲を鳴らしているあいだは書いたとおりに鳴ってほしい。
 * 黙って乗っ取ると気づけないので、知らせを出す。
 *
 * @param {string} mml 指示行を含む MML
 * @returns {Map<string, string>} 名前(小文字)→ 何になったか(env / tone / layer / opll)
 */
export function readVoices(mml) {
  const out = new Map();
  for (const line of commentLines(String(mml ?? ''))) {
    const m = VOICE_LINE.exec(line);
    if (!m) continue;
    const name = m[1].trim();
    const parts = splitParts(m[2]);
    if (!parts.length) {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の中身がありません`);
    }
    out.set(name.toLowerCase(),
      makeVoice(name, parts.map((t) => readVoicePart(name, t, mml))));
  }
  return out;
}
const VOICE_LINE = /^[ \t*]*#[ \t]*voice[ \t]+([A-Za-z][\w-]*(?:::[A-Za-z][\w-]*)*)[ \t]*=[ \t]*(.*)$/i;

/** `#voice` で作った名前。ぶつかりの知らせを 2 度目から出さないために持つ */
const MML_VOICES = new Set();

/** 中身 1 つに書けるもの。`@vol` は `@v` より先に見る(長いほうが勝つ) */
const VOICE_PART = new RegExp([
  '@\\{(?<wave>[^}]*)\\}',
  '@e\\{(?<env>[^}]*)\\}',
  '@role\\{(?<role>[^}]*)\\}',
  '@adsr\\{(?<adsr>[^}]*)\\}',
  '@arp\\{(?<arp>[^}]*)\\}',
  '@pitch\\{(?<pitch>[^}]*)\\}',
  '@vol\\{(?<vol>[^}]*)\\}',
  '@duty\\{(?<duty>[^}]*)\\}',
  '@loop\\{(?<loop>[^}]*)\\}',
  '@delay\\{(?<delay>[^}]*)\\}',
  '@gain\\{(?<gain>[^}]*)\\}',
  '@o(?<octave>[+-]?\\d+)',
  '@d(?<detune>[+-]?\\d+)',
  // 外のファイルが加えた書き方(registerVoiceSyntax)。上のどれにも当たらないときだけ見る。
  // 入れ子は 2 段まで読む(`body{ 2{freq 215} }`。生音の胴の山は番号で並ぶ)
  '@(?<extName>[A-Za-z]+)\\{(?<extBody>(?:[^{}]|\\{(?:[^{}]|\\{[^{}]*\\})*\\})*)\\}',
  '\\s+',
].join('|'), 'giy');

/**
 * 外のファイルが加えた #voice の書き方。語(小文字)→ 音色を作る関数。
 *
 * mml.js はその音源の中身を知らない。`@opl{…}` のような書き方を、音源の側が
 * 自分で加える(sound/opl.js)。外すときは、その音源の import を消すだけで済む。
 */
const VOICE_SYNTAX = new Map();

/**
 * #voice の書き方を加える。
 *
 * `{ }` の中身は `@opll{…}` と同じ形で読んで渡す。`mod{ratio 2, depth 29}` のような
 * まとまりは「名前 数」の組、`feedback 5` のような 1 語は数になる。
 *
 * @param {string} word `@` のあとの語。`opl` なら `@opl{…}`
 * @param {(name:string, spec:object, opts:{role?:string, overwrite:boolean}) => void} make
 *   読んだ中身から音色を登録する関数
 */
export function registerVoiceSyntax(word, make, opts = {}) {
  VOICE_SYNTAX.set(String(word).toLowerCase(),
    { make, tree: !!opts.tree, raw: !!opts.raw });
}

/**
 * 音源のリズムの割り当て(種類 → 打つものの名前 → どのチャンネルか)。
 *
 * mml.js はどの音源がリズムを持つかを知らない。音源の側が渡す。
 * 読むのは、同じ拍で同じチャンネルを別の高さで叩いていないかの知らせだけ
 * (`tellIfDrumPitchClash`)
 */
const DRUM_SLOTS = new Map();

/**
 * リズムの割り当てを加える。
 *
 * @param {string} kind 音色の `kind`
 * @param {Object<string, {ch:number}>} table 打つものの名前 → チャンネル
 */
export function registerDrumSlots(kind, table) {
  DRUM_SLOTS.set(kind, table);
}

/**
 * 外の音源が、自分の書き方の読めないところで止めるために使う。
 *
 * 中身は MML を読むところと同じ。`loose` のときの受け止め方も同じになるので、
 * 音源の側で `throw` を書かない(→ `registerVoiceSyntax`)
 */
export function badVoice(text) {
  bad(text);
}

/**
 * `{ }` の中身を、入れ子のまま読む(`registerVoiceSyntax` の `tree`)。
 *
 * 中身は `,` で区切った項目の並び。項目は 3 つの形のどれか。
 *
 * - `guitar` 語 1 つ。値は null
 * - `t60 4.2` 語と数
 * - `head{ sharp 0.8, bright 0.9 }` 語と、同じ形の中身(入れ子)
 *
 * 返すのは `[{ key, value }]` の並び。書いた順のまま持つ(同じ名前を 2 度書いたかを、
 * 受け取った側が見られるように)。語の字は書いたまま渡す。
 * 生音の音色(sound/audio.js の @acoustic{…})がこれで読む。`@opll` の形は 1 段しか
 * 入れ子を持てず、胴の山のように番号で並ぶものが書けなかった(2026-10-13)
 */
function readVoiceTree(text, name, word) {
  const items = [];
  for (const one of splitParts(text)) {
    const t = one.trim();
    if (!t) continue;
    const m = /^([A-Za-z0-9_]+)\s*(?:\{([\s\S]*)\}|(-?\d*\.?\d+(?:e-?\d+)?))?$/i.exec(t);
    if (!m) {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の @${word} の "${t}" は読めません`
        + '(guitar / t60 4.2 / head{sharp 0.8} のように書きます)');
    }
    const value = m[2] !== undefined ? readVoiceTree(m[2], name, word)
      : m[3] !== undefined ? Number(m[3]) : null;
    items.push({ key: m[1], value });
  }
  return items;
}

/**
 * 外の書き方の `{ }` の中身を読む。形は `@opll{…}` と同じ。
 *
 * 1 語で書くものは、数のほかに名前とマクロも書ける。`from opll::kick(mid)` は名前の字のまま、
 * `from $hit` はマクロの中身(ほかのマクロを展開したもの)を `{ macro, mml }` にして渡す。
 * マクロは同じ MML の中から引くので、`mml` に元の MML を渡す。
 */
function readExtSpec(text, name, word, mml = '') {
  const spec = {};
  for (const one of splitParts(text)) {
    const m = /^([A-Za-z]+)\s*(?:\{([^}]*)\}|(-?\d+(?:\.\d+)?)|\$([\w]+)|([A-Za-z][\w.-]*(?:::[A-Za-z][\w.-]*)*(?:\([^)]*\))?))$/
      .exec(one.trim());
    if (!m) {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の @${word} の "${one.trim()}" は読めません`
        + '(mod{…} car{…} か、feedback 5 / from 名前 / from $マクロ のように書きます)');
    }
    if (m[2] !== undefined) {
      const fields = {};
      for (const pair of String(m[2]).split(',')) {
        const w = pair.trim().split(/\s+/).filter(Boolean);
        if (w.length !== 2 || !Number.isFinite(Number(w[1]))) {
          bad(`[ChpTnSnd] MML: 音色 "${name}" の @${word} の ${m[1]}{${m[2]}} は`
            + '「名前 数」を `,` で区切って書きます');
        }
        fields[w[0]] = Number(w[1]);
      }
      spec[m[1]] = fields;
    } else if (m[3] !== undefined) {
      spec[m[1]] = Number(m[3]);
    } else if (m[4] !== undefined) {
      spec[m[1]] = { macro: m[4].toLowerCase(), mml: macroText(mml, m[4], name, word) };
    } else {
      spec[m[1]] = m[5];
    }
  }
  if (!Object.keys(spec).length) bad(`[ChpTnSnd] MML: 音色 "${name}" の @${word} に中身がありません`);
  return spec;
}

/**
 * マクロ 1 つの中身を、ほかのマクロを展開した形で返す。
 *
 * 本文を読むときと同じ下ごしらえ(コメントを抜く、小文字にそろえる)をしてから、
 * 末尾に呼び出しを 1 つ置いて展開し、その部分だけを切り出す。
 */
function macroText(mml, macro, name, word) {
  const MARK = '\u0001';
  const key = String(macro).toLowerCase();
  const src = lowerOutsideDrums(stripComments(String(mml))) + `\n${MARK}$${key}${MARK}`;
  const out = expandMacros(src);
  const at = out.lastIndexOf(MARK, out.length - 2);
  const body = at >= 0 ? out.slice(at + 1, out.length - 1).trim() : '';
  if (!body || body === `$${key}`) {
    bad(`[ChpTnSnd] MML: 音色 "${name}" の @${word} が指すマクロ $${macro} がありません`);
  }
  return body;
}

/** `{ }` の中の数を読む。区切りは `,` でも空白でもよい */
export function voiceNums(text, name, what) {
  const list = String(text).split(/[\s,]+/).filter(Boolean).map(Number);
  if (!list.length || list.some((v) => !Number.isFinite(v))) {
    bad(`[ChpTnSnd] MML: 音色 "${name}" の @${what}{${text}} は数の並びで書きます`);
  }
  return list;
}

/**
 * `@adsr{…}` の 4 つを読む。立ち上がり・減り・離しは秒か割合。
 *
 * `registerEnvelope` は秒(数)と割合(`'25%'`)の両方を受ける。割合はその音が
 * 鳴っている長さに掛かる。`#voice` だけ数しか受けていなかったので、
 * 同じものが JS では書けて MML では書けなかった(2026-09-30)。
 *
 * 伸ばす高さ(s)は時間ではなく 0〜1 の高さなので、割合では書けない。
 */
function readAdsr(text, name) {
  const words = String(text).split(/[\s,]+/).filter(Boolean);
  if (words.length !== 4) {
    bad(`[ChpTnSnd] MML: 音色 "${name}" の @adsr は 4 つです`
      + `(立ち上がり, 減り, 伸ばす高さ, 離し。${words.length} 個ありました)`);
  }
  const time = (w, key) => {
    if (/^\d*\.?\d+\s*%$/.test(w)) return w.replace(/\s+/g, '');
    const n = Number(w);
    if (!Number.isFinite(n) || n < 0) {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の @adsr の ${key} "${w}" は読めません`
        + '(秒の数か、"25%" のような割合で書きます)');
    }
    return n;
  };
  const level = Number(words[2]);
  if (!Number.isFinite(level)) {
    bad(`[ChpTnSnd] MML: 音色 "${name}" の @adsr の伸ばす高さ "${words[2]}" は`
      + '0〜1 の数です(割合では書けません)');
  }
  return { a: time(words[0], '立ち上がり'), d: time(words[1], '減り'),
    s: level, r: time(words[3], '離し') };
}

/** 中身 1 つを読む。どれになるかは `makeVoice` が中身を見て決める */
function readVoicePart(name, text, mml = '') {
  const part = { wave: null, env: null, adsr: null, arp: null, pitch: null,
    vol: null, duty: null, loop: {}, delay: null, gain: null, octave: 0, detune: 0,
    role: null, ext: null };
  let at = 0;
  while (at < text.length) {
    VOICE_PART.lastIndex = at;
    const m = VOICE_PART.exec(text);
    if (!m) {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の "${text.slice(at)}" は読めません`
        + '(書けるのは @{音色} @e{形} @role @adsr '
        + [...VOICE_SYNTAX.keys()].map((k) => '@' + k + ' ').join('')
        + '@arp @pitch @vol @duty @loop @delay @gain @o @d だけです)');
    }
    at = VOICE_PART.lastIndex;
    const g = m.groups;
    if (g.wave !== undefined) { part.wave = g.wave.trim(); continue; }
    if (g.env !== undefined) { part.env = g.env.trim(); continue; }
    if (g.role !== undefined) { part.role = g.role.trim(); continue; }
    if (g.adsr !== undefined) {
      part.adsr = readAdsr(g.adsr, name);
      continue;
    }
    if (g.extName !== undefined) {
      const word = g.extName.toLowerCase();
      if (!VOICE_SYNTAX.has(word)) {
        bad(`[ChpTnSnd] MML: 音色 "${name}" の @${g.extName}{…} は読めません。知らない書き方です`
          + (VOICE_SYNTAX.size ? `(加えられているもの: ${[...VOICE_SYNTAX.keys()].map((k) => '@' + k).join(' ')})` : ''));
      }
      const how = VOICE_SYNTAX.get(word);
      // raw = 中身を読まずに字のまま渡す。自分の書き方を持つ音源が使う
      // (`@opll{…}` の `bytes{…}` のように、形がここの読み方と合わないもの)
      part.ext = { word, spec: how.raw ? g.extBody
        : how.tree ? readVoiceTree(g.extBody, name, word)
          : readExtSpec(g.extBody, name, word, mml) };
      continue;
    }
    if (g.arp !== undefined) { part.arp = voiceNums(g.arp, name, 'arp'); continue; }
    if (g.pitch !== undefined) { part.pitch = voiceNums(g.pitch, name, 'pitch'); continue; }
    if (g.vol !== undefined) { part.vol = voiceNums(g.vol, name, 'vol'); continue; }
    if (g.duty !== undefined) { part.duty = voiceNums(g.duty, name, 'duty'); continue; }
    if (g.loop !== undefined) {
      // `@loop{arp 0}`。表の名前と、戻る先。2 つ以上は `,` で区切る
      for (const one of String(g.loop).split(',')) {
        const w = one.trim().split(/\s+/).filter(Boolean);
        if (w.length !== 2 || !TABLE_NAMES.includes(w[0].toLowerCase())
            || !Number.isInteger(Number(w[1]))) {
          bad(`[ChpTnSnd] MML: 音色 "${name}" の @loop{${g.loop}} は`
            + `「表の名前 戻る先」で書きます(表は ${TABLE_NAMES.join(' ')})`);
        }
        part.loop[w[0].toLowerCase()] = Number(w[1]);
      }
      continue;
    }
    if (g.delay !== undefined) { part.delay = voiceNums(g.delay, name, 'delay')[0]; continue; }
    if (g.gain !== undefined) { part.gain = voiceNums(g.gain, name, 'gain')[0]; continue; }
    if (g.octave !== undefined) { part.octave = clamp(Number(g.octave), -4, 4); continue; }
    if (g.detune !== undefined) { part.detune = clamp(Number(g.detune), -2400, 2400); continue; }
  }
  return part;
}
/** 表の名前。`@loop` が指せる先 */
const TABLE_NAMES = ['arp', 'pitch', 'vol', 'duty'];

/** その中身に、書いてはいけないものが書かれていないか */
function refuse(name, part, keys, why) {
  for (const k of keys) {
    const v = part[k];
    const wrote = (k === 'loop') ? Object.keys(v).length > 0
      : (k === 'octave' || k === 'detune') ? v !== 0 : v !== null;
    if (wrote) bad(`[ChpTnSnd] MML: 音色 "${name}" に @${k} は書けません(${why})`);
  }
}

/** 名前がぶつかったら知らせる。`#voice` で作ったものの作り直しは黙って通す */
function tellIfTaken(name, taken, what) {
  const key = String(name).toLowerCase();
  if (taken && !MML_VOICES.has(key)) {
    warn(`[ChpTnSnd] MML: ${what} "${name}" はもう登録されています。`
      + 'この曲のあいだは #voice に書いたほうで鳴ります');
  }
  MML_VOICES.add(key);
}

/** 読んだ中身を、エンベロープ・音色・合成音色・音源の音色のどれかにする */
function makeVoice(name, parts) {
  if (parts.length === 1) {
    const p = parts[0];
    if (p.ext) {
      // 外のファイルが加えた書き方(@opl{…} など)。@opll と同じく音色そのもの
      if (p.wave !== null) {
        bad(`[ChpTnSnd] MML: 音色 "${name}" に @{${p.wave}} は書けません`
          + `(@${p.ext.word} が音色そのものです)`);
      }
      refuse(name, p, ['env', 'adsr', 'arp', 'pitch', 'vol', 'duty', 'loop',
        'delay', 'gain', 'octave', 'detune'],
        `@${p.ext.word} は音色そのものです。表を着せるときは別の #voice でこの名前を呼んでください`);
      tellIfTaken(name, findWave(name) >= 0, '音色');
      VOICE_SYNTAX.get(p.ext.word).make(name, p.ext.spec,
        { ...(p.role === null ? {} : { role: p.role }), overwrite: true });
      return p.ext.word;
    }
    if (p.wave === null) {
      // エンベロープ。`@adsr` だけが書ける
      if (!p.adsr) {
        bad(`[ChpTnSnd] MML: 音色 "${name}" に音色がありません`
          + '(@{名前} を書くか、@adsr{…} だけを書いてください)');
      }
      refuse(name, p, ['env', 'role', 'arp', 'pitch', 'vol', 'duty', 'loop', 'delay', 'gain',
        'octave', 'detune'], 'エンベロープには @adsr だけ書けます');
      tellIfTaken(name,
        ENVELOPES.some((e) => e.name.toLowerCase() === name.toLowerCase()), 'エンベロープ');
      registerEnvelope(name, { ...p.adsr, overwrite: true });
      return 'env';
    }
    // 音色。表を着せられる
    // @gain だけは 1 つでも書ける。下の合成音色として作り、行き先で音量を掛ける。
    // 表と一緒には書けない(合成音色の中身に表は書けないのと同じ)
    const tables = ['adsr', 'arp', 'pitch', 'vol', 'duty', 'loop'];
    const gainOnly = p.gain !== null
      && !tables.some((k) => (k === 'loop' ? Object.keys(p.loop).length > 0 : p[k] !== null));
    if (!gainOnly) {
      refuse(name, p, ['adsr', 'delay', 'gain', 'octave', 'detune'],
        '@adsr は別の #voice に、@delay @o @d は重ねたときだけ書けます。'
        + '@gain は表と一緒には書けないので、表を着せた音色を先に #voice で作ってください');
      tellIfTaken(name, findWave(name) >= 0, '音色');
      registerTone(name, { wave: p.wave, ...(p.env ? { env: p.env } : {}),
        arp: p.arp, pitch: p.pitch, vol: p.vol, duty: p.duty, loop: p.loop,
        ...(p.role === null ? {} : { role: p.role }), overwrite: true });
      return 'tone';
    }
    refuse(name, p, ['delay', 'octave', 'detune'], '@delay @o @d は重ねたときだけ書けます');
  }
  // 合成音色。中身は音色の名前と、重ね方だけ。表を着せたいものは
  // 先に `#voice` で作って、その名前を書く(表が中で 2 段になると読めなくなる)
  const layers = parts.map((p, i) => {
    if (p.wave === null) {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の重ねる中身に @{名前} がありません`);
    }
    // ロールは重ねたものぜんぶで 1 つ。2 つめ以降に書けると、どれが効くのか
    // 読めなくなる(中身ごとに違うロールを書かれても、当て先は 1 つしかない)
    if (i > 0) {
      refuse(name, p, ['role'],
        '@role は音色ぜんぶに掛かるので、いちばん初めの中身にだけ書けます');
    }
    refuse(name, p, ['adsr', 'arp', 'pitch', 'vol', 'duty', 'loop'],
      '重ねる中身に表は書けません。表を着せた音色を先に #voice で作ってください');
    return { wave: p.wave, ...(p.env ? { env: p.env } : {}),
      ...(p.gain === null ? {} : { gain: p.gain }),
      ...(p.delay === null ? {} : { delay: p.delay }),
      semi: p.octave * 12, cents: p.detune };
  });
  tellIfTaken(name, findWave(name) >= 0, '音色');
  registerLayer(name, { layers, ...(parts[0].role === null ? {} : { role: parts[0].role }) },
    { overwrite: true });
  return 'layer';
}

/**
 * 和音の楽器を読む。
 *
 * ```
 * #chord brass = @{beatHorn}, @{beatBrass}, @{beatBrassTop}
 * ```
 *
 * 書くのは楽器の名前だけ。音色でもバンドル音色でもよい。音量もエンベロープも
 * そちらが持つので、ここには書かない。ここで着せられるようにすると、
 * 同じことを 2 か所で書けることになる(2026-09-18)。
 *
 * 下から順に着せる。和音のいちばん低い音が 1 番目、その上が 2 番目。
 * 音が定義より多ければ、最後のものを使い回す。ブラスなら「下はホルン、
 * 上はトランペット」と 2 つ書けば、3 声でも 4 声でも同じように鳴る。
 *
 * @param {string} mml 指示行を含む MML
 * @param {Map<string, object[]>} [bundles] バンドル音色。名前で引けるようにする
 * @returns {Map<string, object[][]>} 名前(小文字)→ 声ごとの中身の並び
 */
export function readChordSets(mml, bundles = readBundles(mml)) {
  const out = new Map();
  const seenText = new Map();
  for (const line of commentLines(String(mml ?? ''))) {
    const m = CHORD_LINE.exec(line);
    if (!m) continue;
    const name = m[1].trim().toLowerCase();
    if (findWave(name) >= 0 || bundles.has(name)) {
      bad(`[ChpTnSnd] MML: 和音の楽器 "${name}" は音色の名前と同じです`
        + '(別の名前にしてください)');
    }
    const raw = m[2].trim();
    if (out.has(name) && seenText.get(name) !== raw) {
      warn(`[ChpTnSnd] MML: 和音の楽器 "${name}" を 2 度書いています(後のほうを使います)`);
    }
    seenText.set(name, raw);
    const parts = splitParts(m[2]);
    if (!parts.length) bad(`[ChpTnSnd] MML: 和音の楽器 "${name}" の中身がありません`);
    out.set(name, parts.map((t) => readChordVoice(name, t, bundles)));
  }
  return out;
}

/**
 * 声 1 つ。書けるのは `@{名前}` だけ。音色でもバンドル音色でもよい。
 *
 * 楽器の名前も一緒に返す。プレイヤーで声ごとに止められるようにするのに要る
 * (イベントの `lane` になる)。うしろに書いたものは呼び名になる。
 */
function readChordVoice(name, text, bundles) {
  const m = /^@\{([^}]*)\}[ \t]*(.*)$/.exec(text.trim());
  if (!m) {
    bad(`[ChpTnSnd] MML: 和音の楽器 "${name}" の "${text.trim()}" は読めません`
      + '(書けるのは @{名前} と呼び名だけです。音量やエンベロープは、その音色の側に持たせます)');
  }
  const key = m[1].trim().toLowerCase();
  const lane = m[1].trim();
  // 呼び名。書かなければ音色の名前をそのまま使う(ドラムと同じ)
  const label = looksLikeSetting(m[2].trim())
    ? bad(`[ChpTnSnd] MML: 和音の楽器 "${name}" の "${m[2].trim()}" は読めません`
      + '(音量やエンベロープは、その音色の側に持たせます。'
      + 'うしろに書けるのは呼び名だけです)')
    : (m[2].trim() || lane);
  if (bundles.has(key)) return { parts: bundles.get(key), lane, label };
  const w = findWave(key);
  if (w < 0) {
    bad(`[ChpTnSnd] MML: 和音の楽器 "${name}" の "${m[1].trim()}" は知らない名前です`);
  }
  return { parts: [{ wave: w, vol: null, gate: null, env: null, octave: 0,
    detune: 0, echo: undefined }], lane, label };
}

/* ==================== ドラム ====================
 *
 * 打楽器は並びが主役で、高さは主役ではない。ふつうの書き方だと高さを
 * 毎回書くことになり、どの拍に何が来るのかが目で追えなくなる。
 *
 * ```
 * #drum B = @{beatKick}
 * #drum S = @{beatSnare}
 * #drum H = @{beatHatOff} v8
 *
 * @{drums 16}{
 * v12
 * [BH . H . S . H . B . BH . S . H .]2
 * }
 * ```
 *
 * 囲みの中は字が 1 つで 1 打。詰めて書けば同時、空白で区切れば次の刻み、
 * `.` は休み。刻みは囲みが持つので、中では長さを書かない。
 *
 * 鳴るのは必ず o4c。実機のリズム音源が音量とパンしか持たないのと同じで、
 * 高さは音色の側で作る。タムは高さ違いを並べて宣言する。そうすると、
 * ノイズでも PCM の生音でも、同じように並べられる(2026-09-18)。
 */

/**
 * 呼び名のつもりで書いたものが、設定に見えないか。
 *
 * `v6` や `o4c` や `@e{soft}` を黙って呼び名にすると、書いた人は
 * 「着せたのに効かない」に出くわす。その場で言うほうが直せる。
 */
function looksLikeSetting(text) {
  return /^@/.test(text) || /^[A-Za-z][+-]?\d/.test(text);
}

const DRUM_LINE = /^[ \t*]*#[ \t]*drum[ \t]+([A-Za-z][A-Za-z0-9]*)[ \t]*=[ \t]*(.*)$/i;
/** ドラムの囲みの開き。`@{drums 16}{` */
const DRUM_OPEN = /@\{[ \t]*drums\b([^}]*)\}[ \t]*\{/i;
/** ドラムが鳴る高さ。o4c で固定(上記) */
const DRUM_MIDI = 60;
/**
 * ドラムが鳴る高さを Hz で。ここからずらした分が、打楽器の高さの指定になる。
 *
 * OPLL のリズム音源は、実機のドライバが決め打ちの高さで鳴らす。その値を
 * 「ずらしていない」ことの目印にするために、o4c を物差しとして出しておく
 * (→ `sound/opll.js` の `DRUM`、2026-10-04)。
 */
export const DRUM_FREQ = 440 * Math.pow(2, (DRUM_MIDI - 69) / 12);

/**
 * その音色が鳴り切るまでの秒数。ドラムの音の長さを決めるのに使う。
 *
 * 刻みを変えても音が変わってはいけない。8 ビートを 16 分の刻みで書いても、
 * 8 分の刻みで書いても、同じバスドラが鳴る必要がある。エンベロープの減衰は
 * 音符より長くは伸びない(`d = min(e.d, len - a)`)ので、音符の長さを刻みに
 * 合わせると、刻みを変えただけで音が変わってしまう(2026-09-18)。
 *
 * そこで打楽器は、刻みではなく音色が鳴り終わるまで鳴らす。実機の打楽器と
 * 同じで、叩いたら減衰しきる。
 *
 * 伸ばすところがある音色(`s > 0`)は、放っておくと鳴り続ける。
 * そういうものはドラムに向かないが、書かれたときは刻みで切る。
 *
 * export しているのは、打楽器の長さをツール側(Stave の組み立て)でも同じに出すため。
 */
export function envRunLen(env, fallback) {
  const e = ENVELOPES[env];
  if (!e) return fallback;
  // 表で書いたエンベロープ。1 コマ 1/60 秒で最後まで
  if (Array.isArray(e.table)) {
    return e.loop === null || e.loop === undefined
      ? Math.max(fallback, e.table.length / 60) : fallback;
  }
  if (!(e.s === 0)) return fallback;
  // 割合で書いたものは、刻みの長さを物差しにして秒へ直す
  const sec = (v) => envSec(v, fallback);
  return Math.max(fallback, sec(e.a) + sec(e.d) + sec(e.r));
}

/**
 * OPLL のリズム音源で、同じ拍に高さ違いが重なっていないか。重なっていたら知らせる。
 *
 * ---- なぜ知らせるか ----
 *
 * スネアとハイハットがチャンネル 7 を、タムとシンバルが 8 を分け合う。
 * 高さのレジスタは 1 組しかない。
 *
 * 叩くたびに書き直すので、順に鳴らすぶんは書いたとおりに鳴る。
 * どうにもならないのは同じ拍で重ねたときで、あとから書いたほうの高さで
 * 両方が鳴る。どちらが先かは書いた順なので、読んでも見当がつかない。
 * 黙って片方の高さになると、書いた人は自分の MML を疑うことになる。
 *
 * 定義は止めない。高さ違いを並べて宣言するのは、ふつうの書き方
 * (→ [MML.md](../docs/MML.md) の「鳴るのは必ず o4c」)。重なった拍だけ言う。
 *
 * バスドラは自分のチャンネル(6)を持っているので、取り合わない。
 *
 * @param {Array<{nm:string}>} names その 1 打で鳴る字
 * @param {Map<string, object>} table その囲みで効く割り当て
 * @param {Set<string>} said もう言ったもの。同じ組を拍ごとに繰り返さない
 */
function tellIfDrumPitchClash(names, table, said) {
  if (names.length < 2) return;
  // チャンネル → 高さ(半音) → その字
  const at = new Map();
  for (const { nm } of names) {
    for (const part of (table.get(nm) || {}).parts || []) {
      const w = WAVEFORMS[part.wave];
      if (!w || !w.drum) continue;
      const slot = (DRUM_SLOTS.get(w.kind) || {})[w.drum];
      if (!slot || slot.ch === 6) continue;
      const semi = (part.octave || 0) * 12 + (part.detune || 0) / 100;
      const got = at.get(slot.ch) || new Map();
      if (!got.has(semi)) got.set(semi, `${nm}(${w.name})`);
      at.set(slot.ch, got);
    }
  }
  for (const [ch, got] of at) {
    if (got.size < 2) continue;
    const who = [...got.values()];
    const key = `${ch}:${who.join(',')}`;
    if (said.has(key)) continue;
    said.add(key);
    warn(`[ChpTnSnd] MML: 同じ拍に高さ違いの打楽器が重なっています(${who.join(' / ')})。`
      + `OPLL のリズム音源はチャンネル ${ch} の高さを 1 組しか持たないので、`
      + 'あとに書いたほうの高さで両方が鳴ります。順に鳴らすぶんは書いたとおりです');
  }
}

/**
 * ドラムの割り当てを読む。
 *
 * 囲みの中に書いたものは、その囲みの中だけで効く。前奏とサビでハイハットを
 * 変えたいときに、囲みを分ければ書き直すだけで済む。
 *
 * @param {string} mml 指示行を含む MML
 * @param {Map<string, object[]>} [bundles] バンドル音色。名前で引けるようにする
 * @returns {{outer: Map<string, object>, scopes: Map<string, object>[]}}
 *   `outer` は囲みの外の割り当て、`scopes` は囲みごと(出てくる順)
 */
export function readDrums(raw, bundles = readBundles(raw)) {
  const mml = normalizeDirectives(raw);
  const outer = new Map();
  const scopes = [];
  let depth = 0;
  for (const raw of String(mml ?? '').split('\n')) {
    const cut = raw.indexOf('//');
    const code = cut < 0 ? raw : raw.slice(0, cut);
    const note = cut < 0 ? '' : raw.slice(cut + 2);
    const m = DRUM_LINE.exec(note);
    if (m) {
      const name = m[1].trim();
      const into = depth > 0 ? scopes[scopes.length - 1] : outer;
      into.set(name, readDrumPart(name, m[2], bundles));
    }
    // 囲みの開け閉めを数える。`{Ho}` の `}` で閉じないよう、字で数える
    let i = 0;
    while (i < code.length) {
      if (depth === 0) {
        const om = DRUM_OPEN.exec(code.slice(i));
        if (!om) break;
        i += om.index + om[0].length;
        depth = 1;
        scopes.push(new Map());
      } else {
        const c = code[i++];
        if (c === '{') depth++;
        else if (c === '}') depth--;
      }
    }
  }
  return { outer, scopes };
}

/**
 * 割り当て 1 つ。書けるのは楽器の名前と `v` だけ。
 *
 * `v` は差だけを言う。囲みの `v` と掛け合わせて実際の音量になるので、
 * 曲の途中でドラム全体を下げても、楽器どうしのつり合いは崩れない。
 *
 * `!名前` は、その字が送る合図の名前(docs/DYNAMIC.md)。ここで決めておいて、
 * 本文では `B!` と 1 字足すだけで送れる。名前を毎回書かずに済むうえ、
 * どの打で送るかは本文の側で選べる。
 *
 * うしろに書いたものは呼び名になる。字だけ並べても、どれがハイハットなのかは
 * 書いた人しか分からないので、プレイヤーが中を開いたときにこれを出す。
 * 書かなければ音色の名前をそのまま使う。たいていはそれで足りる。
 */
function readDrumPart(name, text, bundles) {
  const t = String(text).trim();
  const m = /^@\{([^}]*)\}[ \t]*(?:v[ \t]*(\d+(?:\.\d+)?)\b)?[ \t]*(?:!([A-Za-z_]\w*)(?:[ \t]+(-?\d+))?)?[ \t]*(.*)$/
    .exec(t);
  if (!m) {
    bad(`[ChpTnSnd] MML: ドラム "${name}" の "${t}" は読めません`
      + '(書けるのは @{名前} と v と合図と呼び名だけです。長さと高さは書きません)');
  }
  const key = m[1].trim().toLowerCase();
  const vol = m[2] === undefined ? null : clamp(parseFloat(m[2]), 0, 15);
  // 合図。この字が鳴るたびに、ゲーム側へ届く。本文には書けないので
  // (囲みの中は楽器の字と `.` と `v` だけ)、割り当てのほうに持たせる
  const cue = m[3] ? { name: m[3], arg: m[4] === undefined ? 0 : parseInt(m[4], 10) } : null;
  // 呼び名。書かなければ音色の名前をそのまま使う
  const label = looksLikeSetting(m[5].trim())
    ? bad(`[ChpTnSnd] MML: ドラム "${name}" の "${m[5].trim()}" は読めません`
      + '(長さと高さは書きません。うしろに書けるのは呼び名だけです)')
    : (m[5].trim() || m[1].trim());
  if (bundles.has(key)) return { parts: bundles.get(key), vol, label, cue };
  const w = findWave(key);
  if (w < 0) {
    bad(`[ChpTnSnd] MML: ドラム "${name}" の "${m[1].trim()}" は知らない名前です`);
  }
  return { parts: [{ wave: w, vol: null, gate: null, env: null, octave: 0,
    detune: 0, echo: undefined }], vol, label, cue };
}

/**
 * ドラムの囲みの中だけ、くり返しの境目に区切りを入れる。
 *
 * ふつうの MML では `[cd]2` が `cdcd` になればよい。ドラムは違って、
 * 空白が「次の刻みへ」を意味するので、`[BH H H H]2` を字のままつなぐと
 * 前の小節の最後の `H` と次の小節の `B` が 1 つの打になる。小節ごとに
 * 1 刻みずつ詰まって、気づいたときには全部ずれている(2026-09-19)。
 *
 * 書く側に `[$a |]4` と書かせる手もあったが、忘れても音が出てしまう。
 * 出る音が静かに変わるものは、書き手に覚えさせない。
 *
 * `[` と `]` の外側へ空白を足すだけなので、ふつうの MML には何も起きない。
 */
function spaceDrumRepeats(src) {
  const text = String(src);
  const keep = drumRanges(text);
  if (!keep.length) return text;
  keep.sort((a, b) => a[0] - b[0]);
  let out = '', at = 0;
  for (const [s, e] of keep) {
    if (s < at) continue;
    out += text.slice(at, s) + text.slice(s, e).replace(/\[/g, '[ ').replace(/\]/g, ' ]');
    at = e;
  }
  return out + text.slice(at);
}

/**
 * ドラムの囲みの中だけ、書いた字のまま残して小文字にする。
 *
 * ほかのところは今までどおり小文字へ倒す(`O4C` でも書けるように)。
 * 囲みの中は大文字と小文字が別の楽器なので、倒すと区別が消える。
 *
 * 囲みの中で呼ぶマクロも守る。定義は囲みの外にあるが、中身はドラムの字として
 * 読まれるため。ドラムの囲みで呼ばないマクロは、今までどおり倒す。
 */
function lowerOutsideDrums(src) {
  const text = String(src);
  const keep = drumRanges(text);
  if (!keep.length) return text.toLowerCase();
  keep.sort((a, b) => a[0] - b[0]);
  let out = '', at = 0;
  for (const [s, e] of keep) {
    if (s < at) continue;                       // 重なりは先に取ったほうを使う
    out += text.slice(at, s).toLowerCase() + text.slice(s, e);
    at = e;
  }
  return out + text.slice(at).toLowerCase();
}

/** 字のまま残す範囲。ドラムの囲みと、その中で呼ぶマクロの中身 */
function drumRanges(text) {
  const out = [];
  const macros = macroBodies(text);
  const want = new Set();
  const re = new RegExp(DRUM_OPEN.source, 'gi');
  let m;
  while ((m = re.exec(text)) !== null) {
    const from = m.index + m[0].length;
    let depth = 1, i = from;
    for (; i < text.length && depth > 0; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') depth--;
    }
    out.push([from, i - 1]);
    for (const name of text.slice(from, i - 1).match(/\$[A-Za-z_][\w]*/g) || []) {
      want.add(name.slice(1));
    }
    re.lastIndex = i;
  }
  // マクロの中でマクロを呼ぶこともある。呼ばれたものを辿る
  const seen = new Set();
  while (want.size) {
    const name = want.values().next().value;
    want.delete(name);
    if (seen.has(name) || !macros.has(name)) continue;
    seen.add(name);
    const [s, e] = macros.get(name);
    out.push([s, e]);
    for (const n of text.slice(s, e).match(/\$[A-Za-z_][\w]*/g) || []) want.add(n.slice(1));
  }
  return out;
}

/** 囲みの外に書いたドラムの割り当て行。`shareBundles` が配る先を選ぶのに要る */
function outerDrumLines(text) {
  const out = [];
  let depth = 0;
  for (const raw of String(text ?? '').split('\n')) {
    const cut = raw.indexOf('//');
    const code = cut < 0 ? raw : raw.slice(0, cut);
    const note = cut < 0 ? '' : raw.slice(cut + 2);
    if (depth === 0 && DRUM_LINE.test(note)) out.push(note);
    let i = 0;
    while (i < code.length) {
      if (depth === 0) {
        const om = DRUM_OPEN.exec(code.slice(i));
        if (!om) break;
        i += om.index + om[0].length;
        depth = 1;
      } else {
        const c = code[i++];
        if (c === '{') depth++;
        else if (c === '}') depth--;
      }
    }
  }
  return out;
}

/** マクロの名前 → 中身の範囲。`lowerOutsideDrums` が守る先を探すのに要る */
function macroBodies(text) {
  const out = new Map();
  const re = /\$([A-Za-z_][\w]*)[ \t\n\r]*=[ \t\n\r]*\{/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const from = m.index + m[0].length;
    let depth = 1, i = from;
    for (; i < text.length && depth > 0; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') depth--;
    }
    out.set(m[1], [from, i - 1]);
    re.lastIndex = i;
  }
  return out;
}

/**
 * バンドル音色の指示行を、全部のチャンネルへ配る。
 *
 * 1 本のテキストに書いた曲は `splitVoices()` がヘッダの注釈を写すので、
 * 最初の `#ch` より前に書けば全部へ届く。チャンネルごとに分けて渡す形
 * (`defineBGM(name, [ch1, ch2])`)にはヘッダが無いので、ここで同じことをする。
 *
 * 同じ字を 2 度読むことになるが、中身が同じなら `readBundles()` は黙って通す。
 *
 * @param {string[]} voices チャンネルごとの MML
 * @returns {string[]} 指示行を頭に足したもの(1 つも無ければそのまま)
 */
export function shareBundles(raw) {
  const voices = (raw || []).map((v) => normalizeDirectives(v));
  const lines = [];
  for (const v of voices) {
    for (const line of commentLines(String(v ?? ''))) {
      if (BUNDLE_LINE.test(line) || VOICE_LINE.test(line)) lines.push('//' + line);
    }
    // ドラムの割り当ても同じように配る。ただし囲みの中に書いたものは配らない —
    // あれはその囲みの中だけの話で、ほかのチャンネルへ持っていくと意味が変わる
    for (const line of outerDrumLines(String(v ?? ''))) lines.push('//' + line);
  }
  if (!lines.length) return voices;
  const head = lines.join('\n') + '\n';
  // #voice が指すマクロ(@oplpcm{ from $hit } など)も配る。#voice の行はどのトラックでも
  // 読まれるので、マクロがそのトラックに無いと、そこで見つからずに止まる。
  // 配るのは指されているマクロ(と、その中から呼ばれているもの)で、そのトラックに無いものだけ
  const defs = new Map();
  for (const v of voices) for (const [k, d] of macroDefs(String(v ?? ''))) if (!defs.has(k)) defs.set(k, d);
  const want = new Set();
  const take = (text) => {
    for (const m of String(text).matchAll(/\$([A-Za-z0-9_]+)/g)) {
      const k = m[1].toLowerCase();
      if (want.has(k) || !defs.has(k)) continue;
      want.add(k);
      take(defs.get(k));
    }
  };
  for (const line of lines) if (VOICE_LINE.test(line.slice(2))) take(line);
  return voices.map((v) => {
    const have = macroDefs(String(v ?? ''));
    const add = [...want].filter((k) => !have.has(k)).map((k) => defs.get(k));
    return head + (add.length ? add.join('\n') + '\n' : '') + String(v ?? '');
  });
}

/** そのトラックに書いてあるマクロの登録(`$名前 = { … }`)。名前(小文字)→ 登録の字そのまま */
function macroDefs(text) {
  const out = new Map();
  const src = String(text);
  for (const m of src.matchAll(/\$([A-Za-z0-9_]+)[ \t\r\n]*=[ \t\r\n]*\{/g)) {
    let depth = 0, k = m.index + m[0].length - 1;
    for (; k < src.length; k++) {
      if (src[k] === '{') depth++;
      else if (src[k] === '}' && --depth === 0) break;
    }
    if (k < src.length) out.set(m[1].toLowerCase(), src.slice(m.index, k + 1));
  }
  return out;
}

/**
 * `,` で中身に切り分ける。`{ }` の中の `,` では切らない —
 * `@s{16,3}` の `,` まで切ってしまうと、書いた人には読めない場所で止まる。
 */
export function splitParts(text) {
  const out = [];
  let buf = '', depth = 0;
  for (const c of String(text)) {
    if (c === '{') depth++;
    else if (c === '}') depth = Math.max(0, depth - 1);
    if (c === ',' && depth === 0) { out.push(buf); buf = ''; continue; }
    buf += c;
  }
  out.push(buf);
  return out.map((t) => t.trim()).filter(Boolean);
}

/** 中身 1 つ。音色は必ず要る。音名も `o` も `l` も書けない(音符は外から来る) */
function readBundlePart(name, text, seen) {
  // `echo` は「書いていない」と「`@s0` で切った」を分ける。前者は undefined、
  // 後者は null。曲が掛けているエコーを、層ごとに切れるようにするため
  const part = { wave: -1, vol: null, gate: null, env: null, octave: 0, detune: 0,
    echo: undefined, vsteps: null, vcurve: null };
  let at = 0;
  while (at < text.length) {
    BUNDLE_PART.lastIndex = at;
    const m = BUNDLE_PART.exec(text);
    if (!m) {
      bad(`[ChpTnSnd] MML: バンドル音色 "${name}" の "${text.slice(at)}" は読めません`
        + '(書けるのは @{音色} @e{形} v q @o @d @s @vsteps @vcurve だけです)');
    }
    at = BUNDLE_PART.lastIndex;
    const g = m.groups;
    // エコーは音符の長さで書く。秒に直すのは鳴らす速さが決まってからなので、
    // ここでは書いた数のまま持つ(`oneNote` が直す)
    const echoLen = g.echoLen ?? g.echoLen2;
    if (echoLen !== undefined) {
      const len = Number(echoLen);
      part.echo = len > 0 ? { len, depth: g.echoDepth ? clamp(Number(g.echoDepth), 1, 9) : 5 }
        : null;
      continue;
    }
    if (g.env !== undefined) { part.env = envIndex(g.env.trim()); continue; }
    if (g.wave !== undefined) {
      const key = g.wave.trim().toLowerCase();
      if (seen.has(key)) {
        bad(`[ChpTnSnd] MML: バンドル音色 "${name}" にバンドル音色 "${key}" は入れられません`);
      }
      const w = findWave(key);
      if (w < 0) {
        bad(`[ChpTnSnd] MML: バンドル音色 "${name}" の音色 "${g.wave.trim()}" は知らない名前です`);
      }
      if (WAVEFORMS[w].kind === 'layer') {
        // 合成音色はそれ自体が何本かを食う。重ねの中に置くと数が読めなくなる
        bad(`[ChpTnSnd] MML: バンドル音色 "${name}" に合成音色 "${WAVEFORMS[w].name}" は`
          + '入れられません(合成音色はそのまま使ってください)');
      }
      part.wave = w;
      continue;
    }
    if (g.octave !== undefined) { part.octave = clamp(Number(g.octave), -4, 4); continue; }
    if (g.detune !== undefined) { part.detune = clamp(Number(g.detune), -2400, 2400); continue; }
    // 音量の段数と曲線。ふだんは音色が持っているが、ここで着せ替えられる。
    // JS を書かずに、MML 1 枚で実機らしい段の曲を配れるようにするため
    // (2026-09-25)
    if (g.vsteps !== undefined) { part.vsteps = vstepsOf(g.vsteps); continue; }
    if (g.vcurve !== undefined) { part.vcurve = vcurveOf(g.vcurve.trim()); continue; }
    if (g.vol !== undefined) { part.vol = clamp(Number(g.vol), 0, 15); continue; }
    if (g.gate !== undefined) { part.gate = clamp(Number(g.gate), 0, 8); continue; }
  }
  if (part.wave < 0) {
    bad(`[ChpTnSnd] MML: バンドル音色 "${name}" の "${text}" に音色がありません`
      + '(@{名前} を書いてください)');
  }
  return part;
}
/** 中身 1 つに書けるもの。`@s{16,3}` は `@s16` より先に見る(長いほうが勝つ) */
const BUNDLE_PART = new RegExp([
  '@\\{(?<wave>[^}]*)\\}',
  '@e\\{(?<env>[^}]*)\\}',
  '@s\\{(?<echoLen>\\d+)(?:,(?<echoDepth>\\d+))?\\}',
  '@s(?<echoLen2>\\d+)',
  '@o(?<octave>[+-]?\\d+)',
  '@d(?<detune>[+-]?\\d+)',
  '@vsteps\\{(?<vsteps>\\d+)\\}',
  '@vcurve\\{(?<vcurve>[^}]*)\\}',
  'v(?<vol>\\d+)',
  'q(?<gate>\\d+)',
  '\\s+',
].join('|'), 'giy');
/**
 * 曲ぜんぶに効く指示。どのチャンネルに書いてもよいが、2 つ書いて中身が
 * 違っていたら困る。`validateMML()` がそこを見る
 */
const SONG_WIDE = ['title', 'tempo', 'meter', 'about', 'loopTimes'];

/**
 * 何行書いても継ぎ足す指示。いまは解説だけ。
 *
 * 解説は 1 行に収まらないことがある。上書きにすると、続けて書いた人の
 * 最後の 1 行しか残らず、消えたことにも気づけない(2026-09-15)
 */
const STACKED = ['about'];

/**
 * 1 本のテキストを、チャンネルごとに切り分ける。
 *
 * `#ch <名前>` が、新しいチャンネルの始まり。名前は省いてよい。
 *
 * ```
 * #title 鋼の翼
 * #tempo 132
 *
 * #ch 主旋律
 * #role melody
 * @{pulse(25)} l8 o5 cdefgab>c
 *
 * #ch ベース
 * @{triangle} o2 l4 c g c g
 * ```
 *
 * 最初の `#ch` より前に書いた注釈は、切り分けたあと全部の頭に付く。
 * 曲ぜんぶに関わる指示(`#title` `#tempo` `#meter` `#section`)を
 * 1 か所に書けるようにするため。注釈だけを写すので、音符は写らない。
 *
 * `#ch` が 1 つも無ければ、ぜんぶで 1 チャンネル。
 * 前は空行で切っていたが、やめた。1 声の中に読みやすさのための空行を
 * 入れられなくなるため(2026-09-15)。
 *
 * ここに置いてあるのは、切り方を 1 か所にするため。画面ごとに書くと、
 * 貼り直すたびに切れ方が変わる(2026-09-15)。
 *
 * @param {string} text 曲ぜんぶを書いた 1 本のテキスト
 * @returns {string[]} チャンネルごとの MML
 */
export function splitVoices(raw) {
  const text = normalizeDirectives(raw);
  const lines = text.split(/\r?\n/);
  // 印は行注釈にだけ置ける。囲み注釈の中に埋めると、どこで切れるのかが
  // 書いた人にも見えなくなる
  const isMark = (line) => /^\s*\/\/\s*#\s*ch(\s|$)/i.test(line);
  const at = lines.map((l, i) => (isMark(l) ? i : -1)).filter((i) => i >= 0);
  const whole = text.trim();
  if (at.length === 0) return whole ? [whole] : [];
  // 最初の印より前の注釈。音符が混ざっていても、注釈の行だけを写す
  const head = lines.slice(0, at[0]).filter((l) => /^\s*\/\//.test(l));
  const out = [];
  for (let i = 0; i < at.length; i++) {
    const body = lines.slice(at[i], at[i + 1] ?? lines.length);
    out.push([...head, ...body].join('\n').trim());
  }
  return out.filter(Boolean);
}

/**
 * 行注釈の中身を行で返す。囲み注釈(`/*` … `*` `/`)の中は読まない。
 *
 * 前は囲みの中も読んでいた。指示行は行頭の `#…`(と昔の `// #…`)だけ、と決め直した
 * (2026-09-15)。形が 1 つなら、書くほうも探すほうも迷わない。
 * 囲み注釈は何行にもまたがれるので、`#ch` と `#label` は前から読んでいなかった。
 * `#title` だけ囲みでも書ける、という食い違いが残っていた。
 */
/** 行頭の `#`。空白のあとでもよい。行の途中の `#` は半音上げのまま */
const BARE_DIRECTIVE = /^([ \t]*)#/;

/**
 * 行頭の `#` を `#` に直す。
 *
 * 指示行はずっと `#` で書いてきた。注釈の中なので、書き足しても鳴り方が
 * 変わらないのが値打ちだった。ただし「よその MML へ渡しても注釈として
 * 読み飛ばされる」は成り立たない。MUCOM88 の注釈は `;` で、FlMML は `/* *' + '/`。
 * `//` を読むものは見つからなかった(2026-09-19)。
 *
 * 残る値打ちはこちらの中だけの話になったので、短いほうを通すことにした。
 * 半音上げの `#` は必ず音名のうしろに付くので、行頭には来ない。
 * ぶつからない。
 *
 * 囲み注釈(`/* *' + '/`)の中は触らない。あちらは読まない決まりなので、
 * 中の `#` を指示行にすると、読まないはずのものが効いてしまう。
 *
 * 直したあとは今までの道をそのまま通る。読む側は 1 つのままで済む。
 */
function normalizeDirectives(src) {
  const text = String(src ?? '');
  if (!/^[ \t]*#/m.test(text)) return text;        // 無ければ触らない
  const out = [];
  let inBlock = false;
  for (const line of text.split('\n')) {
    out.push(!inBlock && BARE_DIRECTIVE.test(line)
      ? line.replace(BARE_DIRECTIVE, '$1// #') : line);
    // 囲みの開け閉めを数える。行ごとに見るので、開いた行の続きから効く
    let i = 0;
    while (i < line.length) {
      if (!inBlock && line[i] === '/' && line[i + 1] === '*') { inBlock = true; i += 2; continue; }
      if (inBlock && line[i] === '*' && line[i + 1] === '/') { inBlock = false; i += 2; continue; }
      i++;
    }
  }
  return out.join('\n');
}

/**
 * 古い書き方(`#`)の行がいくつあるか。
 *
 * 知らせを出すのは道具の側。エンジンから `warn()` で言うと strict が
 * そこで止まり、いまある曲がぜんぶ鳴らなくなる。`console.warn` で言うのも
 * やめた。控え(`problems`)に入れると、チャンネルの数だけ件数が並んで、
 * 直すところがあるように見える(2026-09-19)。
 *
 * @param {string} src MML
 * @returns {number} `#` で書いてある行の数
 */
export function countOldStyle(src) {
  return (String(src ?? '').match(/^[ \t]*\/\/[ \t]*#/gm) || []).length;
}

function commentLines(raw) {
  const src = normalizeDirectives(raw);
  const out = [];
  for (let i = 0; i < src.length; i++) {
    if (src[i] === '/' && src[i + 1] === '/') {
      let j = i + 2;
      while (j < src.length && src[j] !== '\n') j++;
      out.push(src.slice(i + 2, j));
      i = j;
    } else if (src[i] === '/' && src[i + 1] === '*') {
      // 中は飛ばす。ここに書いた `// #…` は指示行として扱わない
      const end = src.indexOf('*' + '/', i + 2);
      i = (end < 0 ? src.length : end + 1);
    }
  }
  return out;
}

/**
 * 注釈を落とす。ただし `#label` だけは、書いてあった場所を残す。
 *
 * ラベルは曲についての覚え書きなので、注釈に書くのが素直。けれど注釈を
 * そのまま落とすと、どこに書いてあったかが消える。ラベルは「ここ」を
 * 指すものなので、場所が消えると意味が無い。
 *
 * そこで `#label` の注釈だけ、目印(`\x03<番号>\x03`)に置き換えて本文へ残す。
 * `\x01` と `\x02` はくり返しが使っているので、そこを避ける。
 * 名前は `names` へ預ける — このあと本文は小文字にされるので、
 * 本文に混ぜたままだと名前の大文字が崩れる(2026-09-15)。
 *
 * 予約語が 2 つある。`LOOP` はくり返すときに戻る先、`OUTRO` は後奏の始まり。
 * どちらも跳ぶ先としては並ぶ。
 *
 * ラベルは行頭に書く決まりにした。音符の後ろに書いても同じところを指すが、
 * 行末と次の行の頭が同じ 1 点なので、どちらの意味で書いたのかが読めない。
 * 行頭だけにすれば、下に続く音符を指していると一目で分かる。
 * 後ろに書いてあったら黙って捨てず、知らせる。
 *
 * @param {string} src
 * @param {string[]} names 見つけた名前を、書いてあった順に入れる
 */
function stripComments(raw, names = [], cues = [], texts = []) {
  const src = normalizeDirectives(raw);
  const LABEL = /^\s*#\s*label\b[ \t]*(.*)$/i;
  const CUE = /^\s*#\s*cue\b[ \t]*(.*)$/i;
  let out = '';
  // その行に、まだ音符が出てきていないか。ラベルは行頭にだけ置ける
  let headOfLine = true;
  for (let i = 0; i < src.length; i++) {
    if (src[i] === '/' && src[i + 1] === '/') {
      let j = i + 2;
      while (j < src.length && src[j] !== '\n') j++;
      const body = src.slice(i + 2, j);
      const m = LABEL.exec(body);
      const c = CUE.exec(body);
      if (m && headOfLine) {
        names.push(m[1].trim());
        out += `${MARK_AT}${names.length - 1}${MARK_AT}`;
      } else if (m) {
        warn(`[ChpTnSnd] MML: ラベル "${m[1].trim()}" は行頭に書きます `
          + '(音符の後ろに書いたものは効きません)');
      } else if (c && headOfLine) {
        // 合図。ラベルと同じ置き方だが、同じ名前を何度でも置ける
        cues.push(c[1].trim());
        out += `${CUE_AT}${cues.length - 1}${CUE_AT}`;
      } else if (c) {
        warn(`[ChpTnSnd] MML: 合図 "${c[1].trim()}" は行頭に書きます `
          + '(音符の後ろに書いたものは効きません)');
      }
      i = j - 1;
      out += '\n';
      headOfLine = true;
    } else if (src[i] === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end < 0 ? src.length : end + 2;   // 閉じ忘れは末尾までとみなす
      for (let k = i; k < stop; k++) if (src[k] === '\n') out += '\n';
      i = stop - 1;
    } else if (src[i] === '"') {
      // 字。音符の並びの中に置く。音は出ず、時間も進まない。
      // ここで抜く。小文字へ揃える処理より先に通るので、書いた字が残る。
      //
      // ---- 中に " を書きたいとき ----
      //
      // """ で囲む。逃がす書き方(バックスラッシュ)は作らない。
      // 歌詞を書く人に覚えさせるものではないし、逃がす記号をもう 1 つ
      // 決めることになる。Stave の長い文がすでに """ なので、
      // そちらへ揃えた(docs/SCORE_LANG.md)。
      //
      // " が 3 つ続いたら、必ず囲みの始まりと見る。空の字を 2 つ並べたい
      // ときは空白で離す
      const triple = src[i + 1] === '"' && src[i + 2] === '"';
      const close = triple ? '"""' : '"';
      let j = i + close.length, body = '';
      while (j < src.length && src[j] !== '\n' && !src.startsWith(close, j)) {
        body += src[j++];
      }
      const shut = src.startsWith(close, j);
      if (!shut) {
        warn(`[ChpTnSnd] MML: 字 "${body}" の閉じる ${close} がありません`
          + '(字は 1 行の中で閉じます)');
      }
      texts.push(body);
      out += `${TEXT_AT}${texts.length - 1}${TEXT_AT}`;
      i = (shut ? j + close.length : j) - 1;
      headOfLine = false;
    } else {
      if (src[i] === '\n') headOfLine = true;
      else if (!' \t\r'.includes(src[i])) headOfLine = false;
      out += src[i];
    }
  }
  return out;
}

/**
 * 合図の短い名前(`!k = { kick 2 }`)を拾って、本文からは抜く。
 *
 * 合図は音符と強く結びつく。バスドラムを鳴らすたびに出す、のような書き方だと
 * 1 音ごとに置くことになるので、名前を毎回書くと MML が膨らむ。短い名前へ
 * 畳めるようにした(2026-09-18)。
 *
 * 書く場所はどこでもよく、使うより後ろに書いてもよい(マクロと同じ)。
 *
 * @param {string} src マクロとくり返しを広げたあとの本文
 * @returns {{body:string, table:Map<string,{name:string,arg:number}>}}
 */
function readCueNames(src) {
  const table = new Map();
  let body = '';
  let i = 0;
  while (i < src.length) {
    if (src[i] !== '!') { body += src[i++]; continue; }
    const at = i++;
    let name = '';
    while (i < src.length && isNameChar(src[i])) name += src[i++];
    let j = i;
    while (j < src.length && ' \n\t\r'.includes(src[j])) j++;
    if (!name || src[j] !== '=') { body += src.slice(at, i); continue; }   // 呼び出し
    j++;
    while (j < src.length && ' \n\t\r'.includes(src[j])) j++;
    if (src[j] !== '{') {
      bad(`[ChpTnSnd] MML: 合図 "!${name}" の中身が { } で囲まれていません`);
    }
    const k = src.indexOf('}', j);
    if (k < 0) bad(`[ChpTnSnd] MML: 合図 "!${name}" の } がありません`);
    const [word, ...rest] = src.slice(j + 1, k).trim().split(/\s+/);
    if (!word) bad(`[ChpTnSnd] MML: 合図 "!${name}" の中身が空です`);
    if (word === name) {
      // 同じ名前への登録は、番号を付け足すためだけのものになる。
      // 読む側は `!kick` が登録済みかどうかで意味が変わることになり、
      // 書いた人しか分からない。断る(2026-09-18)
      bad(`[ChpTnSnd] MML: 合図 "!${name}" を同じ名前へ登録しています`
        + '(短い名前を付けるための書き方です)');
    }
    const num = Number(rest[0]);
    table.set(name, { name: word, arg: Number.isFinite(num) ? num : 0 });
    i = k + 1;
  }
  return { body, table };
}

/**
 * `@` の命令で、名前を語で書くもの。`{ }` で囲む。
 *
 * ここに無い `@` の命令は 1 文字で、`@e{…}` のように 2 文字目で種類が決まる。
 * だから `@` のうしろに英字が 2 つ以上続いていて、ここに無ければ打ち間違い。
 */
const AT_WORDS = ['key', 'tuning', 'fade', 'steps', 'bend', 'vib', 'pitch', 'vibrato'];

/** 生音の区間の中でだけ書ける `@` の、書き方の例。区間の外に書いたときに見せる */
const AT_EXAMPLE = {
  ped: '@{acoustic::piano}{ @ped 1 c e g @ped 0 }',
  to: '@{acoustic::timpaniRoll}{ v4 @to 14 a1 }',
};

/** `{ }` で囲まないと読めない `@` の命令。囲みが無ければ打ち間違い */
// `@steps` `@bend` `@vib` は `@steps0` `@bend0` `@vib0` で止めるので、囲まない書き方も通す
const AT_BRACED = [...AT_WORDS.filter((w) => w !== 'steps' && w !== 'bend' && w !== 'vib'), 'p'];

/**
 * バンドル音色(`#bundle`)の中でだけ書ける `@` の命令。
 *
 * トラックの本文に書かれたら、知らない名前として扱わずに、どこなら書けるかを言う。
 * 名前そのものは合っているので、「そんな命令はありません」では直せない
 */
const AT_BUNDLE_ONLY = ['vsteps', 'vcurve'];

/** 打ち間違いのときに並べて見せる、トラックの本文で書ける `@` の命令 */
const AT_LIST = '@{音色} @e{形} @key{…} @tuning{…} @fade{…} @steps{…} @bend{…} @vib{…} @pitch{…} @vibrato{…} @p{…} @f{…} '
              + '@d @o @v @m @s';

/**
 * MML 文字列をイベント列にコンパイルする。
 *
 * 空白と改行は読み飛ばすので、何行に分けて書いてもよい。
 * 注釈は `//` と `/*` … `*` `/`(複数行可)。
 *
 * @param {string} mml 1 チャンネルぶんの MML
 * @returns {{events:{t:number,dur:number,gate:number,freq:number,vol:number}[], total:number}}
 *   t=開始秒, dur=音長秒, gate=実発音秒, freq=Hz, vol=0..15。total=チャンネル全体の長さ(秒)。
 */
function compileOne(mml, again = null) {
  // 順番が要る。 注釈を落としてから、マクロを広げて、最後にくり返しを広げる。
  // マクロの中身にくり返しが入ることも、くり返しの中でマクロを呼ぶこともあるので、
  // マクロを先に全部置き換えてからでないと数が合わない
  // 指示行は注釈の中にある。落とす前に読む。
  // 小文字化の前でもあるので、名前は書いたとおりの字で残る
  const meta = readDirectives(mml);
  // MML の中で作った波形メモリ。`#voice` から `@{名前}` で呼べるので、先に読む
  readWaves(mml);
  // MML の中で作った音色。名前で引けるようにしてから、あとを読む。
  // ここより後ろは `findWave` で引くので、登録が先でなければ名前が見つからない
  readVoices(mml);
  // バンドル音色。`@{名前}` で着ると、そこから先の音符が中身の数だけ重なる
  const bundles = readBundles(mml);
  // 和音の楽器。`@{名前}` で着ると、和音の n 番目の音が n 番目を着る
  const chordSets = readChordSets(mml, bundles);
  // ドラムの割り当て。囲みの中に書いたものは、その囲みの中だけで効く
  const drums = readDrums(mml, bundles);
  // `#label` は場所を指すので、落とさずに目印として本文へ残す
  const markNames = [];
  const cueNames = [];
  // 字(`"…"`)。本文からは抜けて、ここに並ぶ
  const textList = [];
  // ドラムの囲みの中だけ、書いた字のまま残す(大文字と小文字が別の楽器)
  const expanded = expandLoops(expandMacros(spaceDrumRepeats(
    lowerOutsideDrums(stripComments(String(mml), markNames, cueNames, textList)))));
  // 合図の短い名前(`!k = { kick }`)を先に拾う。本文からは抜ける
  const { body: src, table: cueTable } = readCueNames(expanded);
  let pos = 0;
  let octave = 4, defLen = 4, tempo = 120, vol = 10, gate = 7;
  /** テンポの変わり目。`t` を書いた時刻(秒)と、そこからの BPM */
  const tempos = [];
  // 音色・効果の現在値(音符ごとにイベントへコピーする)
  let wave = findWave(DEFAULT_WAVE), env = 0, vibrato = 0;
  // 音色を呼ぶときに渡した数(`@{analog::tomitaWhistle(vibrato: 100)}` の vibrato)。
  // 音色を選び直すと、そのとき書いたものに替わる(書かなければ null)
  let vargs = null;
  // 開く量の並び(`@steps{9 3 6}`)。0〜1 に直して持つ。音符が 1 つ鳴るたびに次へ進み、
  // 尽きたら頭へ戻る。null なら書いていない(強さが開く量を決める)
  let steps = null, stepAt = 0;
  // 高さの並び(`@bend{+80 -50 0}`)。セントで持つ。進み方は @steps と同じ
  let bends = null, bendIdx = 0;
  // 揺れの並び(`@vib{0 30 0 50:8}`)。[深さ(セント), 速さ(Hz か null)] で持つ。進み方は @steps と同じ
  let vibs = null, vibIdx = 0;
  // 音をまたいで動かす高さ(`@pitch{+700,2}`、セント)と揺れの深さ(`@vibrato{40,2}`、セント)。
  // { t0, t1, from, to } で、t0 から t1(秒)へまっすぐ動き、そのあとはとどまる。
  // 音符の区切りを見ない。鳴っている音ごとに、その音の長さぶんの動きを点で写す
  let pitchRamp = null, vibRamp = null, vibRampRate = null;
  // ビブラートの深さ(セント)・速さ(Hz)・遅れ(フレーム)。速さと遅れは、
  // 書かなければ null で、鳴らす側の既定(`VIB_SPEED`・0)になる。
  // `@m` を書いたかどうかは `vibSaid` が持つ — 書いたら音色の揺れより勝つ
  let vibSpeed = null, vibDelay = null, vibSaid = false;
  // 音程をずらす量。@d はセント(100 で半音)、@o はオクターブ。
  // どちらも符号つきで、書いたところから後ろぜんぶに効く(2026-09-16)
  let detune = 0, octShift = 0;
  /**
   * `@v` のずらし。書いた `v` に足してから鳴らす。
   *
   * 書いた値そのものは動かさないので、`@v0` で戻せる。フレーズの釣り合いを
   * 書き直さずに、その一帯だけを持ち上げるためのもの
   */
  let volShift = 0;
  // エコー。`{ delay: 秒, depth: 1..9 }`。切ってあれば null
  let echo = null;
  // フェード(`@fade{行き先, 拍数}`)。`{ t0, t1, from, to }` で、時刻は秒、
  // 値は 0〜15(15 で素通し)。`v` とは別の掛け率で、音符ごとの音量に掛かる。
  // 曲じゅうの `v` を書き換えずにフェードイン・アウトするためのもの。
  // 終わったあとも行き先のまま残り、`v` を書いても外れない。
  // 何も書いていなければ 15 のまま
  let fade = null;
  // 戻る先が曲の頭のとき(`LOOP` を書かずに `OUTRO` だけ書いた曲)の読み直し
  if (again && again.head) {
    fade = { t0: 0, t1: 0, from: again.level, to: again.level,
      raw: !!again.raw, gamma: 1 };
  }
  // `@fade` を書いた順の控え。ループの 2 周目の掛け率を決めるのに要る
  const volLog = [];
  // ラベルを置いたとき、控えが何件あったか。書いた順で内と外を分けるため
  const volLogAt = new Map();
  let saidFixed = false;
  /** その時刻の掛け率(0〜15。フェードの途中なら、そこまで動いた値) */
  const fadeAt = (f, t) => {
    if (t >= f.t1) return f.to;
    if (t <= f.t0) return f.from;
    // 進み具合を 0〜1 で出して、ガンマを掛けてから音量へ写す。
    // γ=1 で真っ直ぐ。γ>1 は前半をゆっくり、0<γ<1 は前半を大きく動かす
    const u = (t - f.t0) / (f.t1 - f.t0);
    return f.from + (f.to - f.from) * (f.gamma === 1 ? u : Math.pow(u, f.gamma));
  };
  /**
   * 音符の中の音量の動き(`[[鳴りはじめからの秒, 音量], …]`)に、`age` から先の
   * 動きを書き足す。`age` までの動きは残す。`then` が無ければ、そこで止める
   */
  const bendAt = (e, age, then) => {
    const pts = (e.fade || []).filter((p) => p[0] < age - 1e-9);
    pts.push([age, fadeVolOf(e, age)]);
    if (then) pts.push(then);
    e.fade = pts;
  };
  /**
   * フェードの掛け率を `v` に直す関数を作る。
   *
   * 既定は、掛け率を大きさ(振幅)に掛ける。音量の曲線は音色ごとに違うので、
   * 掛け率をそのまま `v` に掛けると、同じ `@fade` でも音色ごとに別の下がり方に
   * なる。実際、`@fade{0,8}` の途中で `0.75db` が −8.4dB、`3db` が −33.8dB に
   * なっていた。大きさのほうで割合を決めて、そこから音色の曲線で `v` へ戻すと、
   * どの音色もだいたい同じに聞こえる。
   *
   * `@fade{0,8,raw}` と書けば、昔どおり `v` へ直に掛ける。音源ごとの
   * 効き方そのものを使いたいときに。
   *
   * 段(`vsteps`)には寄せない。寄せるのは鳴らす側で、先に寄せると段の外の値が出る。
   *
   * @param {number} at 音色の番号
   * @param {object|null} m バンドル音色の中身(着ているとき)
   * @param {boolean} raw `v` へ直に掛けるか
   */
  const fadeScaler = (at, m, raw) => {
    if (raw) return (b, r) => b * r;
    const w = WAVEFORMS[at] || {};
    const steps = (m && m.vsteps !== null ? m.vsteps : w.vsteps) || 0;
    const curve = (m && m.vcurve !== null ? m.vcurve : w.vcurve) || 'curve';
    return (b, r) => volFromGain(volGainOf(b, curve, steps) * r, curve, steps);
  };
  /** 音符の `fade` から、鳴りはじめから `age` 秒の音量を引く */
  const fadeVolOf = (e, age) => {
    const pts = e.fade;
    if (!pts || !pts.length || age <= pts[0][0]) return e.vol;
    for (let i = 1; i < pts.length; i++) {
      if (age <= pts[i][0]) {
        const [a0, v0] = pts[i - 1], [a1, v1] = pts[i];
        return a1 > a0 ? v0 + (v1 - v0) * (age - a0) / (a1 - a0) : v1;
      }
    }
    return pts[pts.length - 1][1];
  };
  /**
   * いま鳴り終わったばかりの音(最後に置いた音と、同じ時刻に並ぶもの)。
   * 余韻がこの先で鳴るので、フェードを書いたらそちらにも効かせる
   */
  const lastSounding = () => {
    const out = [];
    const t = events.length ? events[events.length - 1].t : null;
    for (let i = events.length - 1; i >= 0 && events[i].t === t; i--) {
      if (written.has(events[i])) out.push(events[i]);
    }
    return out;
  };
  // 音符ごとの、フェードを掛ける前の音量(`v` で書いたもの)
  const written = new WeakMap();
  // 定位。位置が本体で、`p0..p3` はその上の 4 点にすぎない(docs/STEREO.md)
  // カーソルの pos と名前がぶつかるので px/py/pz にしてある
  let px = 0, py = 0, pz = 0, muted = 0;
  // 着ているバンドル音色(中身の並び)。ふつうの音色を選ぶと外れる
  let bundle = null;
  // 着ている和音の楽器(声ごとの並び)。ふつうの音色を選ぶと外れる
  let chordSet = null;
  // いま鳴らしているものの層の名前。`#chord` の声と `#drum` の字に付く。
  // プレイヤーで「ブラスの上だけ止める」のような聞き分けをするのに要る
  let lane = null;
  // 重ねの通し番号。どのイベントが同じ 1 音かを、あとから見分けるために持つ
  let bundleSeq = 0;
  let tapeSeq = 0;    // 何本目のカセットの音か。種と合わせて中身を決める
  // いま入っている区間の名前。区間の外では null(上記 SECTIONS)
  let section = null;
  // 区間で書いた設定。`@名前 値` を入れておき、音符へ持たせる
  let sec = {};
  let time = 0;
  const events = [];
  /** 曲の途中に置いたラベル。`{ name, t }` の並び */
  const marks = [];
  /** `|` を書いたところ(秒)。切り替えてよい場所 */
  const bars = [];
  /** 合図。`{ name, arg, t }` の並び。同じ名前を何度置いてもよい */
  const cues = [];
  // 字。時刻とチャンネルだけ付けて出す。いつ消すかは受けた側が決める
  const texts = [];
  /**
   * チャンネルの出口のフィルタ(`@f`)。`{ t, kind, cutoff, resonance, drive }` か
   * `{ t, off: true }` の並び。
   *
   * 音符に着せずに別の並びで持つのは、音の無いところでも書き替えられるため。
   * 音符に乗せると、休みの途中で替えたぶんが落ちる(位置の `pos` は音符の
   * 持ち物なので、あちらは着せる形でよい)
   */
  const filters = [];
  /**
   * 音符を 1 つ置く。
   *
   * `extra` は和音のときだけ付く(`chord` = 同じ和音の通し番号、
   * `mark` = `?` / `!`)。ふつうの音符には付けない —
   * 付けると全部のイベントが変わって、基準の指紋が総取っ替えになる。
   */
  /** 右ペダルを踏む・放す(生音の区間の `@ped`)。踏んでいたところから、いまの時刻までを 1 つにする */
  const pedalAt = (down) => {
    // 放してすぐ踏み直す(`@ped 0 @ped 1`。和音が変わるところの踏みかえ)は、ダンパーが下りて弦を止める
    // あいだだけ放しておく(60 ミリ秒)。同じ時刻で踏み直すと、前の和音が止まらずに残る
    const last = sec._pedals[sec._pedals.length - 1];
    if (down && sec._pedOn == null) sec._pedOn = last && time - last[1] < 0.06 ? last[1] + 0.06 : time;
    if (!down && sec._pedOn != null) {
      if (time > sec._pedOn) sec._pedals.push([sec._pedOn, time]);
      sec._pedOn = null;
    }
  };
  /** その時刻の値。t0 から t1 へまっすぐ動き、そのあとはとどまる */
  const rampAt = (r, t) => (t >= r.t1 ? r.to : t <= r.t0 ? r.from : r.from + (r.to - r.from) * (t - r.t0) / (r.t1 - r.t0));
  /**
   * いまの時刻からの動きを点で返す。動かずに 0 のままなら null。
   * 最後の点のあとは、その値にとどまる(音の長さぶんで切らない。余韻のあいだも同じ)
   */
  const rampCurve = (r) => {
    const v0 = rampAt(r, time);
    const pts = [[0, v0]];
    if (time < r.t1 - 1e-9) pts.push([r.t1 - time, r.to]);
    return pts.every((p) => p[1] === 0) ? null : pts;
  };
  const pushNote = (dur, freq, extra) => {
    // 開く量の並びを 1 つ進める。スラーの続き(legato)は同じ音のうちなので進めない
    if (steps && !(extra && extra.legato)) {
      extra = { ...(extra || {}), bright: steps[stepAt++ % steps.length] };
    }
    // 高さの並びも同じように 1 つ進める。0 のときは何も付けない
    if (bends && !(extra && extra.legato)) {
      const c = bends[bendIdx++ % bends.length];
      if (c) extra = { ...(extra || {}), bend: c };
    }
    // 音をまたいで動かす高さと揺れ。この音の頭から終わりまでの動きを、点の並び [秒, 値] で写す
    if (pitchRamp) {
      const c = rampCurve(pitchRamp);
      if (c) extra = { ...(extra || {}), pitchCurve: c };
    }
    if (vibRamp) {
      const c = rampCurve(vibRamp);
      if (c) extra = { ...(extra || {}), vibCurve: c, vibCurveRate: vibRampRate };
    }
    // 揺れの並びも同じように 1 つ進める。@m の代わりに、この音の揺れを決める(0 なら揺らさない)
    if (vibs && !(extra && extra.legato)) {
      const [depth, speed] = vibs[vibIdx++ % vibs.length];
      extra = { ...(extra || {}), vib: { depth, speed, delay: 0 } };
    }
    if (!bundle) {
      const ev = oneNote(dur, freq, null, extra);
      events.push(ev);
      lastNote = { freq, parts: [{ ev, shift: shiftOf(null) }] };
      return;
    }
    // バンドル音色。同じ場所へ中身の数だけ置く。同じ通し番号を配るので、
    // あとから「これは 1 つの音だ」と読める(声の取り合いと書き出しのため)
    const id = bundleSeq++;
    const parts = [];
    bundle.forEach((m, i) => {
      const ev = oneNote(dur, freq, m, { bundle: id, part: i, ...extra });
      events.push(ev);
      parts.push({ ev, shift: shiftOf(m) });
    });
    lastNote = { freq, parts };
  };
  /**
   * 直前に置いた音符。バンドル音色だと中身の数だけイベントがあるので、
   * まとめて持つ。`&` と `*` は「書いた 1 つの音符」に効くものなので、
   * 最後のイベント 1 つだけを見ると、いちばん下の中身にしか効かない。
   *
   * `freq` は書いたままの高さ(`@o` と `@d` を通す前)。part ごとの `shift` を
   * 別に持つのは、つなぐ相手が同じ高さかを書いたままの高さで比べ、
   * 滑り先は part ごとにずらして書き込むため(2026-09-29)
   */
  let lastNote = null;
  /** その中身の音程のずらし。`@o` と `@d` を、曲のものに足して倍率にする */
  const shiftOf = (m) => Math.pow(2,
    (octShift + (m ? m.octave : 0)) + (detune + (m ? m.detune : 0)) / 1200);
  /**
   * 音符 1 つぶんのイベント。`m` はバンドル音色の中身(着ているとき)。
   *
   * 中に書いたもの(`v` `q` `@e`)はそれが勝ち、書かなければ曲のものに従う。
   * `@o` と `@d` は曲のものに足す。
   */
  const oneNote = (dur, freq, m, extra) => {
    // 音程のずらしは、ここで高さそのものに入れる。鳴らすときに足していた
    // ころは、書き出しの側が「書いた高さ」と「鳴る高さ」の 2 つを持っていた
    const shift = shiftOf(m);
    const g = m && m.gate !== null ? m.gate : gate;
    // 書いた音量(中で `v` を書いたものはそれ)に、`@v` のずらしを足してから、
    // フェードの掛け率を掛ける。足すのが先なのは、フェードが掛け率だから —
    // あとから足すと、消えたはずのところで音が戻る
    const base = clamp((m && m.vol !== null ? m.vol : vol) + volShift, 0, 15);
    let v = base;
    let fd = null;
    if (fade) {
      const scale = fadeScaler(m ? m.wave : wave, m, fade.raw);
      v = scale(base, fadeAt(fade, time) / 15);
      if (time < fade.t1 - 1e-9) {
        // 音符の中も刻む。鳴らす側は点と点を `v` の上で真っ直ぐつなぐので、
        // 端だけ直しても途中は音色の曲線がそのまま出る。実際、頭はそろうのに
        // 音符の真ん中では音色ごとに 1 割ちがっていた。
        // `raw` は昔どおり端だけ(点が増えると別のものになる)
        const span = fade.t1 - time;
        const n = fade.raw ? 1 : Math.max(1, Math.min(24, Math.ceil(span / 0.1)));
        fd = [];
        for (let i = 0; i <= n; i++) {
          const at = span * i / n;
          fd.push([at, scale(base, fadeAt(fade, time + at) / 15)]);
        }
      }
    }
    // 打楽器は刻みで切らない。刻みを変えただけで音が変わってしまうため
    const ev = m && m.env !== null ? m.env : env;
    const hold = inDrums ? envRunLen(ev, dur * g / 8) : dur * g / 8;
    // エコーは音符の長さで書いてあるので、ここで秒に直す。
    // 書いていなければ曲のものに従い、`@s0` と書いてあれば切る
    const ec = m && m.echo !== undefined
      ? (m.echo && { delay: (240 / tempo) / m.echo.len, depth: m.echo.depth })
      : echo;
    // 音量を受け付けない音色(`vsteps: 1`)にはフェードが効かない。実機でも同じ
    if (fd && !saidFixed) {
      const w = WAVEFORMS[m ? m.wave : wave] || {};
      if ((m && m.vsteps !== null ? m.vsteps : w.vsteps) === 1) {
        saidFixed = true;
        warn(`[ChpTnSnd] MML: 音色 "${w.name}" は音量を受け付けません(vsteps: 1)。`
          + '"@fade" は効きません');
      }
    }
    // ロールの強弱(生音の区間の `@to`)。次の音符 1 つにだけ付ける
    // 終わったら、そのあとの音は書いた音量で続く(クレッシェンドした先の強さのまま)
    let rollTo = null;
    if (section && SECTIONS[section].full && sec.to != null) {
      rollTo = clamp(sec.to + volShift, 0, 15);
      vol = sec.to;
      sec.to = null;
    }
    const note = {
      t: time, dur, gate: hold, freq: freq * shift, vol: muted ? 0 : v,
      wave: m ? m.wave : wave, env: ev, vibrato, echo: ec,
      // 定位。着せるものの 1 つなので、音色と同じく音符ごとに写す
      pos: [px, py, pz],
      // 層の名前。付いていないものは付けない(基準の指紋を動かさないため)
      ...(lane ? { lane } : {}),
      // 音量の段数と曲線。バンドル音色が着せ替えたときだけ載る。
      // 鳴らす側はこれを音色のものより先に見る
      ...(m && m.vsteps !== null ? { vsteps: m.vsteps } : {}),
      ...(m && m.vcurve !== null ? { vcurve: m.vcurve } : {}),
      // `@m` を書いたときだけ載せる。鳴らす側はこれを音色の揺れより先に見る
      ...(vibSaid ? { vib: { depth: vibrato, speed: vibSpeed, delay: vibDelay } } : {}),
      // 音色を呼ぶときに渡した数。鳴らす側は音色の値の代わりに使う
      ...(vargs ? { vargs: { ...vargs } } : {}),
      // 鳴っているあいだの音量の動き。フェードの途中の音にだけ載る
      ...(fd && !muted ? { fade: fd } : {}),
      ...(rollTo != null && !muted ? { rollTo } : {}),
      ...extra,
    };
    if (!muted) written.set(note, base);
    return note;
  };
  /**
   * `@{` のうしろを読んで、音色かバンドル音色を着る。`{` は読んだあと。
   *
   * 和音の中からも呼ぶ。あちらは声ごとに楽器を変えられる。
   *
   * @returns {boolean} バンドル音色だったか(区間を開く判定を飛ばすのに要る)
   */
  const takeVoice = () => {
    let j = pos;
    while (j < src.length && src[j] !== '}') j++;
    const key = src.slice(pos, j).trim();
    const set = bundles.get(key) || chordSets.get(key);
    if (set) {
      pos = j + 1;
      // 和音の楽器は「声ごとの中身の並び」なので、1 つ深い。
      // 和音でないふつうの音符には、1 番目(いちばん下の声)を着せる
      const isChord = chordSets.has(key);
      bundle = isChord ? set[0].parts : set;
      vargs = null;
      chordSet = isChord ? set : null;
      lane = isChord ? set[0].lane : null;
      if (isChord) for (const v of set) laneLabels.set(v.lane, v.label);
      // エンベロープは 1 つ目のものへ戻す。ふつうの音色を選んだときと
      // 同じ振る舞いにするため(中身が自分で書いていればそちらが勝つ)
      const de = (WAVEFORMS[bundle[0].wave] || {}).defaultEnv;
      env = de !== undefined ? de : envIndex(DEFAULT_ENV);
      return true;
    }
    bundle = null;
    chordSet = null;
    lane = null;
    const before = wave;
    wave = readName(WAVEFORMS, '波形', wave);
    // 読めなかったときは音色が前のままなので、渡した数も前のままにする
    if (wave !== before || findWave(key) >= 0) vargs = voiceArgs(key);
    return false;
  };
  // 音律と基準の高さ。指示行で書く(`#tuning` `#a4`)。曲の途中では変えられない
  let tuning = meta.tuning ? readTuning(meta.tuning) : null;
  const a4 = Number(meta.a4) > 0 ? Number(meta.a4) : 440;
  /** 根音が `c` から何番目の字か。12 でない音律で数の起点になる */
  let rootLetter = tuning ? LETTER[tuning.root] : 0;
  let rootSemi = tuning ? SEMI[tuning.root] : 0;
  // 根音を動かしたときの基準の倍率。釘付け(既定)なら 1 のまま。
  // つなぐ(`@k{a,link}`)と、前の高さを保つぶんだけここがずれる
  let anchor = 1;
  let saidHalf = false;
  let saidKey = false;
  let saidTurn = false;
  /**
   * 音の高さ(MIDI 番号)を Hz に。和音と単音で同じ式を使う。
   *
   * 音律を書いてあれば、そこからの物差しで測る。12 個並べたものは半音の段に
   * そのまま当たるので、根音から何半音かで引く。12 でないものは音名の順番で
   * 数え、並べた数で 1 周する(2026-09-23)。
   */
  const freqOf = (midi) => {
    const plain = (m) => a4 * Math.pow(2, (m - 69) / 12);
    if (!tuning) return plain(midi);
    const hit = (hz) => hz * anchor;
    const semi = ((midi % 12) + 12) % 12;
    if (tuning.cents.length === 12) {
      // 根音は、その音より下でいちばん近いもの。そこから表のセントを積む
      const step = ((semi - rootSemi) % 12 + 12) % 12;
      return hit(plain(midi - step) * Math.pow(2, tuning.cents[step] / 1200));
    }
    const letter = LETTER_OF_SEMI[semi];
    if (letter === undefined) {
      if (!saidHalf) {
        saidHalf = true;
        warn('[ChpTnSnd] MML: この音律に半音はありません'
          + `(${tuning.cents.length} 音で 1 周します)。平均律の高さで鳴らします`);
      }
      return plain(midi);
    }
    const n = tuning.cents.length;
    // 音名を頭から数えた番号。根音を 0 にして、並べた数で 1 周する
    const at = (Math.floor(midi / 12) - 1) * 7 + letter - (4 * 7 + rootLetter);
    const turn = Math.floor(at / n);
    const base = plain((4 + 1) * 12 + rootSemi);
    return hit(base * Math.pow(2, (turn * tuning.period + tuning.cents[at - turn * n]) / 1200));
  };
  // 和音の通し番号。どの音符が同じ和音の仲間かを、あとから見分けるために持つ
  // (声が足りないときに何を落とすか決めるのに要る → docs/ENGINE_TODO.md)
  let chordSeq = 0;
  // 何個目のドラムの囲みか。囲みの中に書いた割り当てを引くのに要る
  let drumSeq = 0;
  // ドラムの囲みの中か。音の長さを音色にまかせるかどうかを決める
  let inDrums = false;
  // 鳴らした層と、その呼び名。プレイヤーが中を開いたときに出す。
  // ドラムの字と、和音の声の両方が入る。同じものを書き直していたら、
  // あとに書いたほうが残る
  const laneLabels = new Map();
  /**
   * ドラムの囲み。`@{drums 16}{ ... }` の `{` を読んだところから呼ぶ。
   *
   * 中は字が 1 つで 1 打。詰めれば同時、空白で切れば次の刻み、`.` は休み。
   * 鳴るのは必ず o4c で、高さは音色の側が持つ(上記「ドラム」)。
   *
   * @returns {boolean} ドラムの囲みだったか。違えばカーソルを戻して false
   */
  const playDrums = () => {
    const back = pos;
    let j = pos;
    while (j < src.length && src[j] !== '}') j++;
    const head = /^[ \t]*drums\b([^}]*)$/.exec(src.slice(pos, j));
    if (!head) return false;
    let k = j + 1;
    while (k < src.length && ' \n\t\r'.includes(src[k])) k++;
    if (src[k] !== '{') { pos = back; return false; }
    pos = k + 1;
    const len = parseInt(String(head[1]).trim(), 10);
    const step = 240 / tempo / (Number.isFinite(len) && len > 0 ? len : defLen);
    // 囲みの外の割り当てに、その囲みで書き直したものを重ねる
    const table = new Map([...drums.outer, ...(drums.scopes[drumSeq++] || new Map())]);
    // 同じ組を拍ごとに言わない。くり返しの中なら何十回も来る
    const saidClash = new Set();
    // 囲みの中で動かしたものは、出ると戻る。和音と同じ考え方で、
    // 囲みのあとの音符が思わぬ音色や音量で鳴らないようにする
    const keep = { wave, vargs, bundle, chordSet, vol, env, octave, lane };
    inDrums = true;
    let base = vol;
    let names = [];
    /** 集めた字をまとめて 1 打として置く。同時に鳴るものは同じ通し番号を配る */
    const hit = () => {
      if (!names.length) return;
      tellIfDrumPitchClash(names, table, saidClash);
      const id = names.length > 1 ? chordSeq++ : null;
      for (const { nm, bang } of names) {
        const d = table.get(nm);
        if (!d) {
          warn(`[ChpTnSnd] MML: ドラム "${nm}" は割り当てがありません`
            + '(#drum ' + nm + ' = @{音色} と書きます)');
          continue;
        }
        bundle = d.parts;
        lane = nm;
        if (d.label) laneLabels.set(nm, d.label);
        // `B!` と書いた打だけ合図を送る。名前は割り当てで決めてある
        if (bang) {
          if (!d.cue) {
            warn(`[ChpTnSnd] MML: ドラム "${nm}" に合図の名前がありません`
              + `(#drum ${nm} = @{音色} !名前 と書きます)`);
          } else {
            cues.push({ name: d.cue.name, arg: d.cue.arg, t: time });
          }
        }
        // 宣言の `v` は差だけを言う。囲みの `v` と掛け合わせて実際の音量にする。
        // 丸めない。段に寄せるのは音色(音源)の仕事で、ここは意図を持つところ
        // (docs/SCORE_LANG.md「値は連続で書き、刻むのは音源」。2026-10-03)。
        // 前は段へ丸めていたが、`v` が小数を受けるようになったのに、ドラムだけ
        // 半段まで落ちていた。Stave から組んだ音量とも食い違っていた
        vol = d.vol === null ? base : base * d.vol / 15;
        pushNote(step, freqOf(DRUM_MIDI), id === null ? undefined : { chord: id });
      }
      time += step;
      names = [];
    };
    /** 名前のうしろの `!`。書いてあれば、その 1 打で合図を送る */
    const eatBang = () => (src[pos] === '!' ? (pos++, true) : false);
    let depth = 1;
    while (pos < src.length) {
      const c = src[pos];
      if (c === '}') { depth--; pos++; if (!depth) break; continue; }
      if (' \n\t\r'.includes(c)) { hit(); pos++; continue; }
      if (c === '|') {
        hit();
        pos++;
        if (!bars.some((b) => Math.abs(b - time) < 1e-9)) bars.push(time);
        continue;
      }
      // 休みは 1 つで 1 刻み。前に集めた字があれば、そこで 1 打ぶん切る
      if (c === '.') { hit(); pos++; time += step; continue; }
      if (c === 'v' || c === 'V') {
        hit();
        pos++;
        base = clamp(readNumber() ?? base, 0, 15);
        continue;
      }
      // 長い名前は `{ }` で囲む。1 字で足りないときだけ使う
      if (c === '{') {
        depth++;
        pos++;
        let s = '';
        while (pos < src.length && src[pos] !== '}') s += src[pos++];
        pos++;
        depth--;
        names.push({ nm: s.trim(), bang: eatBang() });
        continue;
      }
      if (/[A-Za-z]/.test(c)) { pos++; names.push({ nm: c, bang: eatBang() }); continue; }
      if (c >= '0' && c <= '9') {
        bad(`[ChpTnSnd] MML: ドラムの囲みの中に数字 "${c}" は書けません`
          + '(長さは囲みが持ちます。音量は v のうしろだけです)');
      }
      warn(`[ChpTnSnd] MML: ドラムの囲みの中に "${c}" は書けません`
        + '(楽器の字と . と v と ! と [ ] | だけです)');
      pos++;
    }
    hit();
    inDrums = false;
    wave = keep.wave; vargs = keep.vargs; bundle = keep.bundle; chordSet = keep.chordSet;
    vol = keep.vol; env = keep.env; octave = keep.octave; lane = keep.lane;
    return true;
  };

  const peek = () => src[pos];
  const readNumber = () => {
    let n = '';
    while (pos < src.length && src[pos] >= '0' && src[pos] <= '9') n += src[pos++];
    return n === '' ? null : parseInt(n, 10);
  };
  /**
   * 音量の数。小数を受ける(`v5.5`)。
   *
   * 点のうしろに数字が無ければ点は食べない。`v5.` のような書き方は
   * どこにも無いが、食べてしまうと次の字が消える
   */
  const readVol = () => {
    let n = '';
    while (pos < src.length && src[pos] >= '0' && src[pos] <= '9') n += src[pos++];
    if (src[pos] === '.' && src[pos + 1] >= '0' && src[pos + 1] <= '9') {
      n += src[pos++];
      while (pos < src.length && src[pos] >= '0' && src[pos] <= '9') n += src[pos++];
    }
    return n === '' ? null : parseFloat(n);
  };
  /** 符号つきの音量。`@v+1.5` のように、小数も受ける */
  const readSignedVol = () => {
    let sign = 1;
    if (src[pos] === '-') { sign = -1; pos++; }
    else if (src[pos] === '+') pos++;
    const n = readVol();
    return n === null ? null : sign * n;
  };
  /**
   * `@` の 1 文字命令に値が続いているかを見る。無ければ止める。
   *
   * `?? いまの値` で黙って通していたので、値を書き忘れた `@d` や、
   * `@vsteps` のように長い名前を書いた打ち間違いが、何も起きないまま
   * 通っていた。残りの英字は音符として鳴る(2026-10-04 に測った)。
   *
   * @param {string} name 命令の文字(`d` `o` `v` `m` `s`)
   * @param {string} starts 数字のほかに値を始められる文字(`+-` や `{`)
   */
  const needValue = (name, starts) => {
    const c = src[pos];
    if (c !== undefined && (starts.includes(c) || (c >= '0' && c <= '9'))) return;
    bad(`[ChpTnSnd] MML: "@${name}" に値がありません`);
  };
  /** 符号つきの整数。`@d-12` のように、下へずらすのに要る */
  const readSigned = () => {
    let sign = 1;
    if (src[pos] === '-') { sign = -1; pos++; }
    else if (src[pos] === '+') pos++;
    const n = readNumber();
    return n === null ? null : sign * n;
  };
  /**
   * 小数も読む。区間の設定(`@hiss 0.16`)で要る。
   * 名前と値のあいだは空けて書くので、先に空白を飛ばす
   */
  const readFloat = () => {
    while (pos < src.length && ' \n\t\r'.includes(src[pos])) pos++;
    let n = '';
    if (src[pos] === '-') n += src[pos++];
    while (pos < src.length && ((src[pos] >= '0' && src[pos] <= '9') || src[pos] === '.')) {
      n += src[pos++];
    }
    const v = parseFloat(n);
    return Number.isFinite(v) ? v : null;
  };
  // `{名前}` を読んで、表の中の番号に直す。
  // 知らない名前は元のままにして知らせる(曲そのものは鳴らしつづける)
  const readName = (table, what, now) => {
    let s = '';
    while (pos < src.length && src[pos] !== '}') s += src[pos++];
    pos++;   // 閉じ括弧
    const key = s.trim().toLowerCase();
    // 音色は findWave で引く。作り分けの書き方(`pulse( 25 )` など)を揃えるのはあちら
    let hit = table === WAVEFORMS ? findWave(s)
      : table.findIndex((e) => e.name.toLowerCase() === key);
    if (hit < 0) {
      hit = table.findIndex((e) => (e.alias || [])
        .some((a) => String(a).toLowerCase() === key));
    }
    if (hit >= 0) return hit;
    const why = table === WAVEFORMS ? voiceNameProblem(s) : null;
    warn(`[ChpTnSnd] MML: ${what} "${s}" は` + (why ? `読めません。${why}`
      : `知らない名前です (使えるのは ${table.map((e) => e.name).join(' / ')})`));
    return now;
  };
  // `@p{x,y,z}` の中身を読む。符号と小数を許す(readNumber は整数しか読まない)。
  // 桁を丸めるのは機械をまたぐため(collect.js の canon と同じ理由)
  const readPlace = () => {
    let s = '';
    while (pos < src.length && src[pos] !== '}') s += src[pos++];
    pos++;   // 閉じ括弧
    const n = s.split(',').map((v) => {
      const f = parseFloat(v);
      return Number.isFinite(f) ? Math.round(clamp(f, -8, 8) * 10000) / 10000 : 0;
    });
    px = n[0] ?? 0; py = n[1] ?? 0; pz = n[2] ?? 0;
  };
  /**
   * チャンネルの出口に置くエフェクト(`@f{…}`)を読む。
   *
   * 書き方は `@f{lowpass 800}` か `@f{ladder 400 @resonance 0.8 @drive 0.3}`。
   * 2 台目からは番号を付ける(`@f2{echo 0.125}`)。番号は順番の札で、本数ではない。
   * 書いた番号だけが作られて、小さい順に通る。`@f999{…}` と書いても 1 台。
   *
   * 位置で書けるのは先頭の 1 つ(フィルタなら `cutoff`、echo と reverb なら `time`)
   * だけで、あとは名前で書く。名前つきの書き方は `@{tape}{ @baud 1200 }` と同じ形。
   *
   * 遅れは `@l` で音符の長さでも書ける(`@f2{echo @l 16}`)。
   * そのときのテンポで秒に直す。秒で書くと、テンポを変えたときに曲から浮く。
   *
   * 種類とパラメータの名前と範囲は `FX_KINDS`(`sound/filter.js` の `FILTERS` と
   * `sound/fx.js` の `MASTER_FX`)から引く。ここに書き写すと、片方だけ直したときに食い違う
   *
   * @param {number} slot 何台目か(1 から)
   */
  const readFx = (slot) => {
    let body = '';
    while (pos < src.length && src[pos] !== '}') body += src[pos++];
    pos++;   // 閉じ括弧
    const words = body.trim().split(/[\s,]+/).filter(Boolean);
    const at = slot === 1 ? '@f' : `@f${slot}`;
    // `@f2{off}` でその 1 台だけ外す。`@f0` は全部外す
    if (words[0] === 'off') { filters.push({ t: time, slot, off: true }); return; }
    const got = readFxWords(words, tempo, (h) => `"${at}{${h} …}"`, bad);
    if (!got) return;
    const head = got.kind;
    // 種類は 1 台に 1 つ。節を途中で差し替えると、そこで音が切れる。
    // フィルタのカットオフ・レゾナンス・飽和は途中で動かせる
    const first = filters.find((f) => (f.slot ?? 1) === slot && f.kind);
    if (first && first.kind !== head) {
      warn(`[ChpTnSnd] MML: "${at}{${head} …}" — エフェクトの種類は 1 台に 1 つです`
        + `(先に書いた "${first.kind}" で鳴らします)。`
        + '別の種類を足すなら、空いている番号に書いてください');
    }
    const kind = first ? first.kind : head;
    let spec = got;
    if (kind !== head) {
      spec = { kind };
      for (const [name, d] of Object.entries(FX_KINDS[kind].params)) {
        spec[name] = clamp(got[name] ?? d.default, d.min, d.max);
      }
    }
    // 動かせない値を書き替えても、ここでは寄せない。
    //
    // 1 つの節で動かせるのは `live` のパラメータだけだが、動かせない値は
    // その組み合わせごとに節を作って入れ替えれば変えられる。並びは
    // 組み合わせごとに 1 つだけ作って使い回すので、行ったり来たりしても増えない
    // (作るのは `_chFx`、数えるのは `fxVariants`)。
    //
    // 前は先に書いたものへ寄せて「途中では変えられません」と知らせていた
    // (2026-10-23 に、入れ替える形にして断るのをやめた)
    filters.push({ t: time, slot, ...spec });
  };
  /**
   * エコー(`@s`)の書き方を読む。
   *
   * 遅れは音符の長さで書く。秒で書くと、テンポを変えたときに曲から浮く。
   * `@s8` なら 8 分音符ぶん遅れる。深さを決めたいときは `@s{8,3}`。
   * `@s0` で切る(2026-09-16)。
   *
   * @param {object|null} now いまの設定
   * @returns {{delay:number,depth:number}|null} 遅れ(秒)と深さ
   */
  /**
   * 設定の値として書いた音名を読む。`o2a` `a` `c+` `b-` の形。
   *
   * `o` を書かなければ、そのときのオクターブを使う。区間の中でも `o` `>` `<`
   * を書けるので、そちらで足場を決めておける。
   *
   * ここで書いた `o` は、この 1 つにしか効かない。設定を書いただけで、
   * 後ろの音の高さが変わってしまわないようにする。
   *
   * @returns {number|null} MIDI の番号。音名でなければ null(カーソルは動かさない)
   */
  const readPitchArg = () => {
    const back = pos;
    while (pos < src.length && ' \t'.includes(src[pos])) pos++;
    let oct = octave;
    if (src[pos] === 'o') {
      pos++;
      const n = readNumber();
      if (n === null) { pos = back; return null; }
      oct = clamp(n, 1, 8);
    }
    const ch = src[pos];
    if (SEMI[ch] === undefined) { pos = back; return null; }
    pos++;
    let semi = SEMI[ch];
    while (peek() === '+' || peek() === '#') { semi++; pos++; }
    while (peek() === '-') { semi--; pos++; }
    return (oct + 1) * 12 + semi;
  };

  /**
   * 転調(`@k`)を読む。音律の形は変えず、根音だけ動かす。
   *
   * `@ka` で根音を a へ。`@k{a,link}` と書くと、前の物差しでその音が鳴って
   * いた高さをそのまま新しい根音にする(継ぎ目がなめらかになる代わりに、
   * くり返すとコンマが積もって曲全体がずれていく)。書かなければ釘付けで、
   * 新しい根音は平均律のその音の高さに置く(2026-09-23)。
   */
  /**
   * 途中で音律を替える(`@tuning{…}`)。
   *
   * 中に書けるものは `#tuning` と同じで、`link` を足せる。
   * `#tuning` は曲ぜんぶの決めごと、こちらは途中で替えるもの。
   *
   * チャンネルは別々にコンパイルされるので、替えるときは全部のチャンネルの
   * 同じところへ書く。1 本だけ書き忘れても音は出るので、気づけない。
   * マクロにして 1 語で呼ぶほうが安全(2026-09-23)。
   */
  const readTuningAt = () => {
    let body = '';
    while (pos < src.length && src[pos] !== '}') body += src[pos++];
    pos++;
    const parts = body.split(',').map((w) => w.trim()).filter(Boolean);
    const link = parts.some((w) => w.toLowerCase() === 'link');
    const text = parts.filter((w) => !['link', 'pin'].includes(w.toLowerCase())).join(' ');
    const next = readTuning(text);
    if (!next) bad('[ChpTnSnd] MML: "@tuning" の中身がありません');
    // 音の数が変わると、同じ音名が別のものを指すようになる。
    // 12 音の `a` は 6 番目だが、5 音のスレンドロでは次の周の 1 番目になる
    if (tuning && next.cents.length !== tuning.cents.length && !saidTurn) {
      saidTurn = true;
      warn(`[ChpTnSnd] MML: 1 周の音の数が ${tuning.cents.length} から `
        + `${next.cents.length} に変わります。ここから音名の指す音がずれます`);
    }
    const ref = (4 + 1) * 12 + SEMI[next.root];
    const was = tuning ? freqOf(ref) : null;
    anchor = 1;
    tuning = next;
    rootSemi = SEMI[next.root];
    rootLetter = LETTER[next.root];
    if (link && was) anchor = was / freqOf(ref);
  };

  /**
   * `@fade{行き先, 拍数}` の中を読む。`{` は読んだあと。
   *
   * 配り方は時間で割る。音符ごとに等間隔にすると、同じ拍の中で音量が
   * 変わって、和音を書いている別のチャンネルとずれる。
   */
  /**
   * `@steps{9 3 6 9 5}` の中を読む。`{` は読んだあと。
   * 0〜9 を空白か `,` で区切って並べる。範囲の外は止める(丸めない)。空なら止める
   */
  const readSteps = () => {
    let body = '';
    while (pos < src.length && src[pos] !== '}') body += src[pos++];
    pos++;
    const items = body.split(/[\s,]+/).filter(Boolean);
    const vals = items.map(Number);
    if (vals.some((v) => !Number.isFinite(v) || v < 0 || v > 9)) {
      bad(`[ChpTnSnd] MML: "@steps{${body.trim()}}" — 値は 0 から 9 の数を並べます(例: @steps{9 3 6})`);
    }
    steps = vals.length ? vals.map((v) => v / 9) : null;
    stepAt = 0;
  };
  /**
   * `@bend{+80 -50 0}` の中を読む。`{` は読んだあと。
   * セントを空白か `,` で区切って並べる。-1200〜1200。範囲の外は止める。空なら止める
   */
  const readBend = () => {
    let body = '';
    while (pos < src.length && src[pos] !== '}') body += src[pos++];
    pos++;
    const items = body.split(/[\s,]+/).filter(Boolean);
    const vals = items.map(Number);
    if (vals.some((v) => !Number.isFinite(v) || v < -1200 || v > 1200)) {
      bad(`[ChpTnSnd] MML: "@bend{${body.trim()}}" — 値は -1200 から 1200 のセントを並べます(例: @bend{+80 -50 0})`);
    }
    bends = vals.length ? vals : null;
    bendIdx = 0;
  };
  /**
   * `@vib{0 30 0 50:8}` の中を読む。`{` は読んだあと。
   * 深さ(セント、0〜VIB_MAX)を並べる。`深さ:速さ` と書けば速さ(Hz、0.1〜20)も決まる。
   * 速さを書かなければ VIB_SPEED。範囲の外は止める。空なら止める
   */
  const readVibs = () => {
    let body = '';
    while (pos < src.length && src[pos] !== '}') body += src[pos++];
    pos++;
    const items = body.split(/[\s,]+/).filter(Boolean);
    const vals = items.map((it) => {
      const [d, r] = it.split(':');
      return [Number(d), r === undefined ? null : Number(r)];
    });
    if (vals.some(([d, r]) => !Number.isFinite(d) || d < 0 || d > VIB_MAX
      || (r !== null && (!Number.isFinite(r) || r < 0.1 || r > 20)))) {
      bad(`[ChpTnSnd] MML: "@vib{${body.trim()}}" — 深さ(0 から ${VIB_MAX} のセント)を並べます。速さも決めるなら 深さ:速さ(0.1 から 20 Hz)(例: @vib{0 30 0 50:8})`);
    }
    vibs = vals.length ? vals : null;
    vibIdx = 0;
  };
  /**
   * `@pitch{+700,2}` と `@vibrato{40,2}` の中を読む。`{` は読んだあと。
   * 行き先と拍数。`@vibrato` は 3 つめに速さ(Hz)も書ける。拍数 0 ならすぐ跳ぶ
   */
  const readRamp = (word, lo, hi) => {
    let body = '';
    while (pos < src.length && src[pos] !== '}') body += src[pos++];
    pos++;
    const parts = body.split(',').map((x) => Number(x.trim()));
    const [to, beats, rate] = parts;
    const okRate = word !== 'vibrato' || parts.length < 3 || (Number.isFinite(rate) && rate >= 0.1 && rate <= 20);
    if (parts.length < 2 || parts.length > (word === 'vibrato' ? 3 : 2) || !Number.isFinite(to) || to < lo || to > hi
      || !Number.isFinite(beats) || beats < 0 || !okRate) {
      bad(word === 'pitch'
        ? `[ChpTnSnd] MML: "@pitch{${body.trim()}}" — 行き先のセント(-1200 から 1200)と拍数を書きます(例: @pitch{+700,2})`
        : `[ChpTnSnd] MML: "@vibrato{${body.trim()}}" — 行き先の深さ(0 から ${VIB_MAX} のセント)と拍数を書きます。3 つめに速さ(0.1 から 20 Hz)も書けます(例: @vibrato{40,2})`);
    }
    const cur = word === 'pitch' ? pitchRamp : vibRamp;
    const from = cur ? rampAt(cur, time) : 0;
    const r = { t0: time, t1: time + beats * 60 / tempo, from, to: clamp(to, lo, hi) };
    if (word === 'pitch') pitchRamp = r;
    else { vibRamp = r; if (parts.length >= 3) vibRampRate = rate; }
  };
  const readFade = () => {
    let body = '';
    while (pos < src.length && src[pos] !== '}') body += src[pos++];
    pos++;
    const parts = body.split(',').map((x) => x.trim());
    const [a, b] = parts.map(Number);
    // 3 つめから先は、書く順を問わない語。`amp` / `raw` と `g<数>`
    let raw = false;
    let gamma = 1;
    let sayBad = parts.length < 2 || !Number.isFinite(a) || !Number.isFinite(b) || b < 0;
    for (const w of parts.slice(2)) {
      const t = w.toLowerCase();
      if (t === 'amp') { raw = false; continue; }
      if (t === 'raw') { raw = true; continue; }
      if (t.startsWith('g')) {
        const n = Number(t.slice(1));
        if (Number.isFinite(n) && n > 0) { gamma = n; continue; }
      }
      sayBad = true;
    }
    if (sayBad) {
      bad('[ChpTnSnd] MML: "@fade" には行き先の音量と拍数を書きます(`@fade{0,8}`)。'
        + '3 つめから先は書かなくてよく、書くなら amp(既定。音色が違っても同じ下がり方)'
        + '・raw(v へ直に掛ける)・g<数>(時間の曲がり具合。1 で真っ直ぐ、'
        + '2〜3 で立ち上がりを抑える)です。順番は問いません');
    }
    // 出発はいまの掛け率。書いていなければ 15(素通し)
    const from = fade ? fadeAt(fade, time) : 15;
    const to = clamp(a, 0, 15);
    fade = { t0: time, t1: time + b * 60 / tempo, from, to, raw, gamma };
    volLog.push({ t: time, fade });
    // いま鳴り終わった音の余韻も、ここから同じだけ動く。
    // 直し方は鳴っている音符ごとに決める — 重ねた中身で音色が違う
    for (const e of lastSounding()) {
      const scale = fadeScaler(e.wave, null, fade.raw);
      // 余韻も曲線をたどる。端だけ置くと、そこだけ真っ直ぐになる
      const span = fade.t1 - time;
      const n = (fade.raw && fade.gamma === 1) ? 1
        : Math.max(1, Math.min(24, Math.ceil(span / 0.1)));
      for (let i = 1; i <= n; i++) {
        const at = span * i / n;
        bendAt(e, time - e.t + (i > 1 ? at - span / n : 0),
          [time - e.t + at, scale(written.get(e), fadeAt(fade, time + at) / 15)]);
      }
    }
  };
  const readKey = () => {
    let body = '';
    while (pos < src.length && src[pos] !== '}') body += src[pos++];
    pos++;
    let link = false;
    let name = null;
    for (const w of body.split(',').map((x) => x.trim()).filter(Boolean)) {
      if (w.toLowerCase() === 'link') link = true;
      else if (w.toLowerCase() === 'pin') link = false;
      else name = w;
    }
    if (!name || LETTER[name[0].toLowerCase()] === undefined) {
      bad('[ChpTnSnd] MML: "@key" には音名を書きます(`@key{a}` `@key{a,link}`)');
    }
    const letter = name[0].toLowerCase();
    let semi = SEMI[letter];
    for (const c of name.slice(1)) {
      if (c === '+' || c === '#') semi++;
      else if (c === '-') semi--;
    }
    if (!tuning || tuning.name === 'equal') {
      if (!saidKey) {
        saidKey = true;
        warn('[ChpTnSnd] MML: 12 平均律に根音はありません。"@key" は何も変えません');
      }
      return;
    }
    const to = () => {
      rootSemi = ((semi % 12) + 12) % 12;
      rootLetter = LETTER[letter];
    };
    if (!link) { anchor = 1; to(); return; }
    // つなぐ。前の物差しでのその音の高さを、そのまま新しい根音にする
    const ref = (4 + 1) * 12 + ((semi % 12) + 12) % 12;
    const was = freqOf(ref);
    anchor = 1;
    to();
    anchor = was / freqOf(ref);
  };

  const readEcho = (now) => {
    let len = null, depth = 5;
    if (src[pos] === '{') {
      pos++;
      let body = '';
      while (pos < src.length && src[pos] !== '}') body += src[pos++];
      pos++;
      const n = body.split(',').map((v) => parseInt(v, 10));
      len = Number.isFinite(n[0]) ? n[0] : null;
      // 深さは 1〜16。9 までだと、いちばん深くしても写しが 4 つで終わる。
      // 16 で 31 個まで伸びる(音量の減りかたが 0.92 倍になる)。
      // これより上は 1 倍を超えて、写しのほうが大きくなる(2026-09-19)
      if (Number.isFinite(n[1])) depth = clamp(n[1], 1, 16);
    } else {
      len = readNumber();
    }
    if (len === null) return now;
    if (len <= 0) return null;                    // @s0 = 切る
    return { delay: (240 / tempo) / len, depth };
  };
  /**
   * ビブラート(`@m`)の書き方を読む。
   *
   * `@m35` は深さだけ。`@m{35,7,18}` で速さ(Hz)と遅れ(フレーム)も決める。
   * 遅れて揺れ出す形は、音色の `vib` でしか書けなかった(2026-09-19)。
   *
   * 深さはセント。前は 0〜9 の目盛りで、速さも深さから決まっていた
   * (5 + 深さ × 0.6 Hz)。本物のビブラートは深くしても速くならないので、
   * 深さと速さを切り離し、深さは音色の `vib` と同じセントにした(2026-10-16)
   */
  const readVib = () => {
    if (src[pos] !== '{') {
      vibrato = clamp(readNumber() ?? vibrato, 0, VIB_MAX);
      // 深さだけ書き直したら、速さと遅れは既定へ戻す。
      // 前に書いた `@m{35,7,18}` の速さが、あとの `@m20` に残ると読めない
      vibSpeed = null; vibDelay = null;
      vibSaid = true;
      return;
    }
    pos++;
    let body = '';
    while (pos < src.length && src[pos] !== '}') body += src[pos++];
    pos++;
    const n = body.split(',').map((v) => parseFloat(v));
    vibrato = clamp(Number.isFinite(n[0]) ? n[0] : vibrato, 0, VIB_MAX);
    vibSpeed = Number.isFinite(n[1]) ? clamp(n[1], 0.1, 30) : null;
    vibDelay = Number.isFinite(n[2]) ? clamp(n[2], 0, 600) : null;
    vibSaid = true;
  };

  /** 長さが書いてあったか。ポルタメントが「書いてなければ前のまま」を決めるのに要る */
  let durWritten = false;
  /**
   * カセットのロード音を 1 つ置く。`=` `?` と、区間の中の音名から呼ぶ。
   *
   * カセットは 1 つの音として置く。ビット 1 個は 1/1200 秒しかないので、
   * 音符に割るとエンジンの最短の長さ(10ms)に伸ばされて重なり、団子になる。
   * 波形はエンジン側で作る(鳴らす層が FSK を組み立てる)
   */
  const pushTape = (isData, dur) => {
    const ch = isData ? '?' : '=';
    if ((WAVEFORMS[wave] || {}).kind !== 'beep') {
      // ほかの音色では鳴らさない。長さだけ進めるので、
      // 重ねている別のチャンネルとずれない
      warn(`[ChpTnSnd] MML: "${ch}" はビープ音源専用です `
        + `(いまの音色は "${(WAVEFORMS[wave] || {}).name}")`);
      time += dur;
      return;
    }
    const baud = sec.baud ?? 1200;
    pushNote(dur, baud * 2);
    // 音色が持っている hiss / wow / muffle は、書いたときだけ上書きする
    const tape = {
      data: isData,
      bytes: isData ? (sec.bytes ?? null) : null,
      baud,
      seed: sec.seed ?? 1,
      seq: tapeSeq++,
    };
    for (const k of ['hiss', 'wow', 'muffle']) if (sec[k] != null) tape[k] = sec[k];
    events[events.length - 1].tape = tape;
    time += dur;
  };

  const readDuration = () => {
    const n = readNumber();
    durWritten = n !== null;
    const len = n ?? defLen;
    let d = 240 / tempo / len;
    let dot = d;
    while (peek() === '.') { pos++; dot /= 2; d += dot; }
    return d;
  };
  const skipSpace = () => {
    while (pos < src.length && ' \n\t\r|'.includes(src[pos])) pos++;
  };

  // ---- ブザーの区間(`@{ayEnvSaw}{ … }`)----
  //
  // 中の音符はブザー(R11/R12 と R13)。重ねる矩形波(R0/R1)は `@g` の間隔で
  // 決まる。実機はこの 2 つを掛け算するので、出てくる声は 1 つのまま
  // 音色だけが変わる。
  //
  // `^` は前の音を伸ばす。エンベロープを書き直さないので鳴りはじめは 1 回で、
  // 伸ばしている途中で `@g` を書き替えると矩形波だけが動く。
  //
  // 1 つのブザーの音符が続いているあいだも矩形波は動けるので、その切り替えは
  // 音符の中の区切り(`gates`)として持つ。鳴らす側はこれを見て、
  // 発振器 2 本の掛け算を組む。
  //
  // 閉じたすぐ後ろにもう 1 つ `{ }` を置くと、そちらが矩形波の担当になる
  // (`readToneLane`)。同じところから並んで進み、ブザーが休んでいる拍では
  // 矩形波だけが鳴る。1 チャンネルで低音と旋律を分け合う書き方(2026-09-26)。

  /** いま開いているブザーの音符を、イベントとして置く */
  const buzzFlush = () => {
    const b = sec._note;
    if (!b) return;
    sec._note = null;
    const keep = time;
    time = b.t;
    const from = events.length;
    pushNote(b.dur, b.freq, { gates: b.gates });
    for (let i = from; i < events.length; i++) sec._ids.push(i);
    time = keep;
  };
  /**
   * ブザーの音符の、ある区間だけ矩形波の高さを差し替える。
   *
   * 区切りは音符の頭からの秒数で並んでいる。またぐところは切り分ける。
   * すでに `@g` で書いてあるところは、そちらが勝つ。同じレジスタを
   * 2 か所から書いているので、どちらかに決めるしかない(2026-09-26)。
   */
  const setGate = (ev, a, b, hz) => {
    const out = [];
    for (const g of ev.gates) {
      const s0 = g.at, s1 = g.at + g.dur;
      const lo = Math.max(s0, a), hi = Math.min(s1, b);
      if (hi <= lo + 1e-9) { out.push(g); continue; }
      if (lo > s0 + 1e-9) out.push({ at: s0, dur: lo - s0, hz: g.hz });
      out.push({ at: lo, dur: hi - lo, hz: g.hz > 0 ? g.hz : hz });
      if (s1 > hi + 1e-9) out.push({ at: hi, dur: s1 - hi, hz: g.hz });
    }
    ev.gates = out;
  };
  /**
   * 2 つめの `{ }`。同じチャンネルの矩形波を、ふつうの音符として書く。
   *
   * 1 つめと同じところから並んで進む。ブザーが鳴っている拍では、その音を
   * 刻む側になる。ブザーが休んでいる拍では矩形波だけが鳴る —— 実機で音量
   * レジスタをエンベロープから取り返した状態で、大きさは刻んでいるときと
   * 揃えてある(揃えないと、拍ごとに 6dB 跳ねる)。
   *
   * 中に音量は書けない。書けるようにすると跳ねが戻ってくる。
   */
  const readToneLane = () => {
    const keepOct = octave, keepLen = defLen, keepTime = time;
    const ids = sec._ids.slice();
    time = sec._from;
    /**
     * ブザーが鳴っていない区間。矩形波だけを置く。
     *
     * 切り方(`q`)は呼ぶ側が長さに入れてあるので、ここでは切らない。
     * ここでもう一度切ると、2 回かかって点になる
     */
    const alone = (a, b, hz) => {
      const keepT = time, keepQ = gate;
      time = a;
      gate = 8;
      pushNote(b - a, hz, { toneOnly: true });
      gate = keepQ;
      time = keepT;
    };
    while (pos < src.length && src[pos] !== '}') {
      const c = src[pos++];
      if (' \n\t\r|'.includes(c)) continue;
      if (c === '>') { octave = Math.min(8, octave + 1); continue; }
      if (c === '<') { octave = Math.max(1, octave - 1); continue; }
      if (c === 'o') { octave = clamp(readNumber() ?? octave, 1, 8); continue; }
      if (c === 'l') { defLen = readNumber() ?? defLen; continue; }
      if (c === 'q') { gate = clamp(readNumber() ?? gate, 0, 8); continue; }
      if (c === 'r') { time += readDuration(); continue; }
      if (SEMI[c] === undefined) {
        bad(`[ChpTnSnd] MML: "${c}" は矩形波のほうの { … } では書けません`
          + '(音名 / r / l / q / o / > / < だけです)');
      }
      let semi = SEMI[c];
      while (peek() === '+' || peek() === '#') { semi++; pos++; }
      while (peek() === '-') { semi--; pos++; }
      const dur = readDuration();
      const hz = freqOf((octave + 1) * 12 + semi);
      // 切り方(`q`)はここで長さに入れる。重なっている拍では音符が
      // 独り立ちしていないので、鳴っているあいだだけゲートを張ることでしか
      // 切れない。張りっぱなしだと `q` が効かなかった(2026-09-26)
      const t0 = time;
      const t1 = time + Math.max(dur * gate / 8, 0.005);
      // ブザーの音符に重なっているところは、その音符の区切りを書き替える
      const covered = [];
      for (const i of ids) {
        const ev = events[i];
        const lo = Math.max(t0, ev.t), hi = Math.min(t1, ev.t + ev.dur);
        if (hi <= lo + 1e-9) continue;
        setGate(ev, lo - ev.t, hi - ev.t, hz);
        covered.push([lo, hi]);
      }
      // 重なっていないところは、矩形波だけの音符として置く
      covered.sort((x, y) => x[0] - y[0]);
      let at = t0;
      for (const [lo, hi] of covered) {
        if (lo > at + 1e-9) alone(at, lo, hz);
        at = Math.max(at, hi);
      }
      if (t1 > at + 1e-9) alone(at, t1, hz);
      time += dur;
    }
    pos++;
    // 置いた順が時刻の順とは限らないので、並べ直す。同じ時刻のものは
    // 書いた順のまま(バンドル音色の並びが崩れる)
    events.sort((a, b) => a.t - b.t);
    octave = keepOct;
    defLen = keepLen;
    time = Math.max(time, keepTime);
  };
  /**
   * ブザーの音符を 1 つ進める。
   *
   * @param {number|'^'|'r'} left ブザーの高さ。`^` は前の音を伸ばす、`r` は休み
   * @param {number} dur 長さ(秒)
   */
  const buzzPut = (left, dur) => {
    if (left === 'r') {
      buzzFlush();
      time += dur;
      return;
    }
    if (left === '^') {
      if (!sec._note) bad('[ChpTnSnd] MML: "^" の前に音符がありません');
    } else {
      buzzFlush();
      sec._note = { t: time, midi: left, freq: freqOf(left), dur: 0, gates: [] };
    }
    const b = sec._note;
    // 重ねる矩形波の高さは、ブザーからの間隔で決まる。間隔を書き替えれば
    // 伸ばしている音の途中でも動く(`^` と組み合わせるとうねる)
    const hz = sec._g == null ? 0 : freqOf(b.midi + sec._g);
    b.gates.push({ at: b.dur, dur, hz });
    b.dur += dur;
    time += dur;
  };

  // `loose` のときは、読めないところでこのチャンネルを打ち切る。
  // そこまでに読めたぶんは鳴る(`bad()` が LooseStop を投げる)
  try {
  while (pos < src.length) {
    const ch = src[pos++];
    // `|` は音にならないが、切り替えてよい場所の印になる(docs/DYNAMIC.md)。
    // ほかの MML でも読み飛ばす目印なので、書いてある曲がそのまま通る
    if (ch === '|') {
      if (!bars.some((b) => Math.abs(b - time) < 1e-9)) bars.push(time);
      continue;
    }
    if (' \n\t\r'.includes(ch)) continue;
    // 区間の中は、その区間のものと、共通で通すものだけ。
    // ラベル(MARK_AT)は音を出さないので通す
    if (section && !SECTIONS[section].full && ch !== MARK_AT && ch !== CUE_AT && ch !== '@'
        && !SEC_COMMON.includes(ch) && !SECTIONS[section].chars.includes(ch)
        && !(SECTIONS[section].digits && ch >= '0' && ch <= '9')
        && !(SECTIONS[section].notes && SEMI[ch] !== undefined)) {
      const ok = [...SECTIONS[section].chars,
        ...(SECTIONS[section].digits ? ['数字'] : []),
        ...(SECTIONS[section].notes ? ['音名'] : []),
        ...SEC_COMMON.filter((c) => c !== '}')];
      bad(`[ChpTnSnd] MML: "${ch}" は ${howOpen(section)} の中では書けません`
        + `(中で書けるのは ${ok.join(' ')} と @設定)`);
    }

    if (SEMI[ch] !== undefined) {
      let semi = SEMI[ch];
      while (peek() === '+' || peek() === '#') { semi++; pos++; }
      while (peek() === '-') { semi--; pos++; }
      const dur = readDuration();
      if (section === 'buzz') {
        buzzPut((octave + 1) * 12 + semi, dur);
      } else if (section === 'tape') {
        // カセットの区間では、音名はデータ(`?`)を 1 つ置く。
        // 書いた高さがそのまま鳴るように `baud = 周波数 × 12`(1 バイトが
        // 12 ビット枠に入るため)。この高さは後ろの `?` にも残る。
        // 数の並びでは譜面として読めないので、旋律はこちらで書く(2026-09-19)
        sec.baud = Math.max(1, Math.min(1e6, Math.round(freqOf((octave + 1) * 12 + semi) * 12)));
        pushTape(true, dur);
      } else {
        pushNote(dur, freqOf((octave + 1) * 12 + semi));
        time += dur;
      }
    } else if (ch === CHORD_QUOTE) {
      // ---- 和音。囲んだ音符が、同じところから同じ長さで鳴る ----
      //
      // 1 つのトラックは 1 音ずつ、という決まりはそのまま。書き方が短くなる
      // のと、どれが同じ和音の仲間かがエンジンに伝わるのが値打ちで、
      // 後者が無いと、声が足りないときに何を落とすか決められない
      // (docs/ENGINE_TODO.md の「声の取り合い」)。
      //
      // 中で動かした > < o は、和音を出ると戻る。和音はひとかたまりなので、
      // 書いたあとの高さが中身で変わると、次の音符が思わぬところで鳴る。
      // 転回は中で動かして書く — `'>ce<g'` は C5 E5 G4。
      //
      // 印は音符の前に付く。`?c` は落としてよい、`!c` は残す。
      // `'` で囲まれた中にしか出てこないので、ほかの解析に触らない
      const keepOctave = octave, keepWave = wave, keepBundle = bundle, keepVargs = vargs;
      const keepVol = vol, keepEnv = env, keepSet = chordSet, keepLane = lane;
      const notes = [];
      let mark = null;
      // 声ごとの楽器を自分で書いたか。書かなければ `#chord` の並びから取る
      let said = false;
      while (pos < src.length && src[pos] !== CHORD_QUOTE) {
        const c = src[pos++];
        if (' \n\t\r'.includes(c)) continue;
        if (c === '?' || c === '!') { mark = c; continue; }
        if (c === '>') { octave = Math.min(8, octave + 1); continue; }
        if (c === '<') { octave = Math.max(1, octave - 1); continue; }
        if (c === 'o') { octave = readNumber() ?? octave; continue; }
        // 声ごとに楽器を変えられる。ブラスの和音のように、上と下で楽器が違う
        // 書き方は珍しくない。書かなければ、その前の音と同じものを着る
        if (c === '@' && src[pos] === '{') {
          pos++;
          takeVoice();
          said = true;
          continue;
        }
        if (c === 'v') { vol = clamp(readNumber() ?? vol, 0, 15); said = true; continue; }
        if (SEMI[c] !== undefined) {
          let semi = SEMI[c];
          while (peek() === '+' || peek() === '#') { semi++; pos++; }
          while (peek() === '-') { semi--; pos++; }
          notes.push({ midi: (octave + 1) * 12 + semi, mark, wave, vargs, bundle, vol, env,
            lane,
            // 自分で楽器を書いたか。書いていなければ `#chord` の並びから着せる
            said });
          mark = null;
          continue;
        }
        // 長さは和音ぜんぶで 1 つ。中に書いても効かないので、黙って捨てない。
        // ラベルは注釈を落とすときに目印の文字へ変わっているので、
        // そのまま出すと字が空っぽに見える。そこだけ言い直す(2026-09-15)
        if (c === CUE_AT) {
          // 合図は和音の中でも音にならない。閉じまで飛ばす
          pos++;
          while (pos < src.length && src[pos] !== CUE_AT) pos++;
          pos++;
          continue;
        }
        if (c === MARK_AT) {
          warn('[ChpTnSnd] MML: 和音の中にラベルは置けません'
            + '(和音は 1 音と同じ扱いです。閉じたあとに書きます)');
          // 目印は名前の番号を挟んでいるので、閉じるところまで読み飛ばす
          while (pos < src.length && src[pos] !== MARK_AT) pos++;
          pos++;
          continue;
        }
        warn(`[ChpTnSnd] MML: 和音の中に "${c}" は書けません `
          + '(音名と + # - と > < o と @{} と v と ? ! だけ。'
          + '長さは閉じたあとに書きます)');
      }
      pos++;   // 閉じる '
      const dur = readDuration();
      // 中で動かしたものは、和音を出ると戻る。和音はひとかたまりなので、
      // 書いたあとの音色や音量が中身で変わると、次の音符が思わぬ音で鳴る
      octave = keepOctave; wave = keepWave; bundle = keepBundle; vargs = keepVargs;
      vol = keepVol; env = keepEnv; chordSet = keepSet; lane = keepLane;
      if (notes.length === 0) {
        warn('[ChpTnSnd] MML: 空の和音があります(休みたいなら r を書きます)');
        time += dur;
      } else {
        // 同じ通し番号を配る。鳴らす側は今までどおり 1 つずつ鳴らすだけで、
        // 番号を見るのは声の取り合いをするところ
        const id = chordSeq++;
        // `#chord` は下から順に着せる。和音のいちばん低い音が 1 番目。
        // 音が定義より多ければ、最後のものを使い回す
        if (keepSet) {
          const low = notes.map((n, i) => i).sort((x, y) => notes[x].midi - notes[y].midi);
          low.forEach((at, rank) => {
            if (notes[at].said) return;
            const voice = keepSet[Math.min(rank, keepSet.length - 1)];
            notes[at].bundle = voice.parts;
            notes[at].lane = voice.lane;
          });
        }
        notes.forEach((n, at) => {
          // 声ごとの音色と音量を、その音符のあいだだけ着せる
          wave = n.wave; vargs = n.vargs; bundle = n.bundle; vol = n.vol; env = n.env; lane = n.lane;
          // `sub` は和音の中の何番目か。書いた順で、和音が替わっても同じ番号が
          // 同じサブチャンネルを指す。和音記法は分けて書いたのと同じものなので、
          // あとから続く音がどれの続きかは、ここで決まる
          // (フィルタを 1 本に 1 台持たせるのに要る → docs/FILTER.md)
          const meta = { chord: id, sub: at };
          if (n.mark) meta.mark = n.mark;
          pushNote(dur, freqOf(n.midi), meta);
        });
        wave = keepWave; vargs = keepVargs; bundle = keepBundle; vol = keepVol; env = keepEnv;
        lane = keepLane;
        time += dur;
      }
    } else if (ch === '}' && section) {
      if (SECTIONS[section].full) {
        // 踏んだまま閉じたら、ここで放す。区間の中で弾いた音に、ペダルの区間を持たせる
        // (エンジンは音符と同じ道でしか受け取れない。曲の中の秒で持ち、鳴らす側が時計へ直す)
        pedalAt(false);
        if (sec._pedals.length) {
          for (let i = sec._first; i < events.length; i++) events[i].pedals = sec._pedals;
        }
      }
      if (section === 'buzz') {
        buzzFlush();
        // 閉じたすぐ後ろの `{` は、同じチャンネルの矩形波の担当
        let j = pos;
        while (j < src.length && ' \n\t\r'.includes(src[j])) j++;
        if (src[j] === '{') { pos = j + 1; readToneLane(); }
      }
      section = null;
    } else if (ch === MARK_AT) {
      // ラベル。ここまで進んだ時刻に名前を置く。音は出ないし、時間も進まない
      let n = '';
      while (pos < src.length && src[pos] !== MARK_AT) n += src[pos++];
      pos++;
      const name = markNames[Number(n)] ?? '';
      // 同じ名前は最初のところだけ。くり返しの中に書くと何度も通る
      if (name && !marks.some((m) => m.name === name)) {
        marks.push({ name, t: time });
        volLogAt.set(name, volLog.length);
        // 2 周目を読み直しているところ。戻った先を、周の終わりの掛け率で始める
        if (again && isLoopMark(name.trim().toLowerCase())) {
          fade = { t0: time, t1: time, from: again.level, to: again.level,
            raw: !!again.raw, gamma: 1 };
        }
      }
    } else if (ch === CUE_AT) {
      // 合図。ラベルと同じで音は出ないが、こちらは同じ名前を何度でも置ける。
      // くり返しの中に書けば、そのたびに出る(docs/DYNAMIC.md)
      let n = '';
      while (pos < src.length && src[pos] !== CUE_AT) n += src[pos++];
      pos++;
      const said = cueNames[Number(n)] ?? '';
      const [word, ...rest] = said.split(/\s+/);
      if (word) {
        const num = Number(rest[0]);
        cues.push({ name: word, arg: Number.isFinite(num) ? num : 0, t: time });
      }
    } else if (ch === TEXT_AT) {
      // 字。合図と同じ置き方で、音は出ず、時間も進まない。
      // くり返しやマクロの中に書けば、そのたびに出る
      let n = '';
      while (pos < src.length && src[pos] !== TEXT_AT) n += src[pos++];
      pos++;
      const said = textList[Number(n)];
      if (said !== undefined) texts.push({ text: said, t: time });
    } else if (ch === '!') {
      // 合図。音符と同じ並びに置く。音は出ず、時間も進まない。
      // 登録してあれば、その名前と番号で出す(`!k = { kick 2 }`)
      let word = '';
      while (pos < src.length && isNameChar(src[pos])) word += src[pos++];
      if (!word) bad('[ChpTnSnd] MML: "!" のうしろに合図の名前がありません');
      const known = cueTable.get(word);
      cues.push({ name: known ? known.name : word, arg: known ? known.arg : 0, t: time });
    } else if (ch === '^' && section === 'buzz') {
      // 前の音を伸ばす。エンベロープを書き直さないので、キーオンし直さない。
      // 伸ばしている途中で `@g` を書き替えると、矩形波だけが動く
      buzzPut('^', readDuration());
    } else if (ch === 'r') {
      if (section === 'buzz') { buzzPut('r', readDuration()); continue; }
      time += readDuration();
    } else if (ch === '&') {
      // ---- タイとスラー ----
      //
      // 高さが同じならタイ。音符 2 つで 1 つの長い音になるので、長さを足す。
      // 高さが違えばスラー。音符は 2 つのままで、キーオンし直さずに
      // 音程だけ差し替える。どちらも鳴りはじめは 1 回しかない。
      //
      // 楽譜でもこの 2 つは同じ曲線で書いて、つないだ音の高さで呼び名が
      // 決まる。ほかの MML(PMD・サクラ・FlMML)も & 1 つで書いて、
      // 高さを見て判断している。
      //
      // 前は高さを読み飛ばして長さだけ足していたので、a&b と書くと
      // b がどこにも出てこないまま a が 2 倍の長さで鳴っていた。
      // エラーにならないぶん気づきにくい壊れ方だった。
      skipSpace();
      // & のあとでオクターブを動かせる。またいでつなぐのに要る(a&<c)
      for (;;) {
        if (peek() === '>') { octave = Math.min(8, octave + 1); pos++; skipSpace(); continue; }
        if (peek() === '<') { octave = Math.max(1, octave - 1); pos++; skipSpace(); continue; }
        if (peek() === 'o') { pos++; octave = readNumber() ?? octave; skipSpace(); continue; }
        break;
      }
      if (SEMI[src[pos]] !== undefined && lastNote) {
        let semi = SEMI[src[pos]];
        pos++;
        while (peek() === '+' || peek() === '#') { semi++; pos++; }
        while (peek() === '-') { semi--; pos++; }
        const dur = readDuration();
        const f = freqOf((octave + 1) * 12 + semi);
        // 同じ高さかは、書いたままの高さどうしで比べる。part ごとにずらした
        // あとの高さと比べると、`@d` の付いた中身が最後にいるだけで
        // 「違う高さ」になり、a&a が 1 つの長い音にまとまらなかった
        if (Math.abs(f - lastNote.freq) < 1e-9) {
          for (const { ev } of lastNote.parts) {
            ev.dur += dur;
            ev.gate = ev.dur * gate / 8;
          }
        } else {
          // 前の音は切らずに次へ渡す。q で短くしてあっても、
          // ここだけは目一杯伸ばす(間が空くとつながって聞こえない)
          for (const { ev } of lastNote.parts) ev.gate = ev.dur;
          pushNote(dur, f, { legato: 1 });
        }
        time += dur;
      }
    } else if (ch === '*') {
      // ---- ポルタメント ----
      //
      // 2 つの音符をつなぐ。どちらも書いた長さのまま鳴り、境目をまたいで
      // 高さが滑る。鳴り直さない(スラーと同じく、鳴りはじめは 1 回)。
      //
      // 滑る範囲は `{前,後}` で書く。書かなければ、前の音符の後ろ半分と
      // 次の音符の前半分。数を 1 つだけ書いたら、その長さを境目で半分ずつに
      // 分ける(`a*{8}d` は `a*{16,16}d` と同じ)。
      //
      //     l1 a*d          a の真ん中から d の真ん中まで
      //     l1 a*{8}d       境目をはさんで 8 分音符ぶん
      //     l1 a*{8,8}d     a の終わりの 8 分と、d の頭の 8 分
      //     l1 a*{0,4}d     境目から滑りはじめて、d の頭の 4 分で着く
      //
      // 書いた長さが音符より長ければ、その音符の長さまでに縮めて知らせる。
      // 滑っているあいだは `q` の隙間を埋める(切れるとつながって聞こえない)。
      //
      // 2026-10-22 に、この形へ直した。前は「音符 1 つの中で滑る」で、
      // `*` のあとの長さが前の音符の長さを置き換えていた。タイでつないだ音の
      // 途中から滑らせることが書けず(前に伸ばしたぶんまで置き換わる)、
      // `q` を縮めると滑る速さまで変わっていた。
      //
      // スラー(&)は跳ぶ。こちらは滑る。楽譜でも別の記号なので、
      // MML でも分けた。ほかの MML も & とは別の書き方にしている
      // (PMD と terrific-audio-driver は `{c2b}`、MXDRV は `_`)。
      skipSpace();
      // 滑る範囲。`{前,後}` か `{長さ}`。書かなければ null(半分ずつ)
      let span = null;
      if (peek() === '{') {
        pos++;
        const readLen = () => {
          skipSpace();
          const n = readNumber();
          if (n === null) return null;
          if (n === 0) return 0;
          let d = 240 / tempo / n;
          let dot = d;
          while (peek() === '.') { pos++; dot /= 2; d += dot; }
          return d;
        };
        const a = readLen();
        skipSpace();
        let b = null;
        if (peek() === ',') { pos++; b = readLen(); }
        skipSpace();
        if (peek() === '}') pos++;
        else bad('[ChpTnSnd] MML: ポルタメントの範囲は "{8}" か "{8,8}" と書きます');
        if (a === null) bad('[ChpTnSnd] MML: ポルタメントの範囲に長さがありません');
        // 1 つだけなら、境目で半分ずつに分ける
        span = b === null ? [a / 2, a / 2] : [a, b ?? 0];
      }
      skipSpace();
      // * のあとでオクターブを動かせる。またいで滑るのに要る(d*<<d1)
      for (;;) {
        if (peek() === '>') { octave = Math.min(8, octave + 1); pos++; skipSpace(); continue; }
        if (peek() === '<') { octave = Math.max(1, octave - 1); pos++; skipSpace(); continue; }
        if (peek() === 'o') { pos++; octave = readNumber() ?? octave; skipSpace(); continue; }
        break;
      }
      if (SEMI[src[pos]] !== undefined && lastNote) {
        let semi = SEMI[src[pos]];
        pos++;
        while (peek() === '+' || peek() === '#') { semi++; pos++; }
        while (peek() === '-') { semi--; pos++; }
        // `*` のあとの長さは、次の音符の長さ(前の音符には触らない)
        const dur2 = readDuration();
        const f1 = lastNote.freq;
        const f2 = freqOf((octave + 1) * 12 + semi);
        const dur1 = lastNote.parts[0].ev.dur;
        let before = span ? span[0] : dur1 / 2;
        let after = span ? span[1] : dur2 / 2;
        if (before > dur1 + 1e-9) {
          warn(`[ChpTnSnd] MML: ポルタメントの前半が音符より長いので、音符の長さまでにしました`);
          before = dur1;
        }
        if (after > dur2 + 1e-9) {
          warn(`[ChpTnSnd] MML: ポルタメントの後半が音符より長いので、音符の長さまでにしました`);
          after = dur2;
        }
        before = Math.min(before, dur1);
        after = Math.min(after, dur2);
        // 1 つめの音符を、滑り終わるところまで伸ばす。滑る区間を別の音符に
        // すると、音源によっては鳴り直すか、続きを落としてしまう
        // (つながりの続きを受け取らない処理器がある)。1 つの音符の中で
        // 「しばらく伸ばしてから滑る」と書けるようにした(2026-10-22)。
        //
        // 間が空くとつながって聞こえないので、`q` の隙間は埋める
        const head = dur1 - before;
        const slide = before + after;
        for (const { ev, shift } of lastNote.parts) {
          ev.dur = head + slide;
          ev.gate = ev.dur;
          if (slide > 1e-9) {
            ev.glide = f2 * shift;
            // 滑りはじめるまでの待ちと、滑っている長さ(どちらも秒)
            if (head > 1e-9) ev.glideAt = head;
            ev.glideFor = slide;
          }
        }
        time += after;
        // 2 つめの音符の残り。ここから先はふつうの音で、`q` も効く
        const tailDur = dur2 - after;
        if (tailDur > 1e-9) {
          pushNote(tailDur, f2, { legato: 1 });
          time += tailDur;
        }
      }
    } else if (ch === 'o') {
      octave = readNumber() ?? octave;
    } else if (ch === '>') {
      octave = Math.min(8, octave + 1);
    } else if (ch === '<') {
      octave = Math.max(1, octave - 1);
    } else if (ch === 'l') {
      defLen = readNumber() ?? defLen;
    } else if (ch === 't') {
      const was = tempo;
      tempo = readNumber() ?? tempo;
      // テンポの変わり目を、時刻とともに控える。音符の長さはもう秒に直して
      // あるので鳴らすのには要らないが、実機のドライバへ渡すときに要る
      // (向こうは 1 拍のフレーム数を BPM から出す。2026-10-21)
      if (tempo !== was) tempos.push({ t: time, bpm: tempo });
    } else if (ch === 'v') {
      // 小数も受ける。目盛りは 0〜15 のままで、そのあいだを細かく書ける。
      // 実機の段が欲しいときは、音色の `vsteps` が寄せる(2026-09-25)
      //
      // `v+2` `v-3` で、いまの値からの上げ下げも書ける。フレーズの中で
      // 少しずつ動かすときに、そのつど 0〜15 のどこかを数えなくて済む。
      //
      // 端で止める。`v14` から `v+3` は 15 で止まり、17 を覚えない。
      // 覚えておくと、見えている値と鳴っている値が食い違って、
      // 途中から読んだときに何が鳴るか分からなくなる(2026-09-30)
      if (src[pos] === '+' || src[pos] === '-') {
        const sign = src[pos++] === '-' ? -1 : 1;
        // 数を書かなければ 1 段。`v+ v+ v+` と並べて少しずつ上げられる
        const d = readVol() ?? 1;
        vol = Math.max(0, Math.min(15, vol + sign * d));
      } else {
        vol = Math.max(0, Math.min(15, readVol() ?? vol));
      }
    } else if (ch === 'q') {
      gate = Math.max(1, Math.min(8, readNumber() ?? gate));
    } else if (ch === '=' || ch === '?') {
      needSection(ch, section);
      // カセットのロード音。ビープ音源専用。
      //   `=` パイロット(連続音)。あの「ピー」
      //   `?` データ(でたらめなバイト列)。あの「ガーガー」
      //   `?{55aa}` 中身のバイトを直に書く。同じ並びを繰り返すので波形が
      //             周期的になり、音色が選べる(ff は高いほう寄り、55 は交互)
      pushTape(ch === '?', readDuration());
    } else if (ch === 'p') {
      // 定位。PMD 互換の 4 段で、`@p{...}` の位置のうちの 4 点にあたる。
      // p0 だけは位置ではなく消音なので、音量 0 の音符として出す。
      // v の値は壊さない(壊すと p3 で戻す先が無くなる)。
      // 音符そのものは残るので、枠は食ったままになる
      // (定位をいじっただけで別の音の鳴り方が変わらないように)
      const n = readNumber();
      if (n === 0) muted = 1;
      else if (n === 1) { muted = 0; px = 1; py = 0; pz = 0; }
      else if (n === 2) { muted = 0; px = -1; py = 0; pz = 0; }
      else if (n === 3) { muted = 0; px = 0; py = 0; pz = 0; }
    } else if (section === 'beep' && ch >= '0' && ch <= '9') {
      // BASIC の BEEP 効果音。待ち時間の回数を書く。
      // `1-60` で 1 から 60 へ、1 つにつき 1 音。長さは今の `l`
      pos--;
      const from = readNumber();
      if (from !== null) {
        let to = from, step = 1;
        if (peek() === '-') { pos++; to = readNumber() ?? from; }
        if (peek() === ',') { pos++; step = Math.max(1, readNumber() ?? 1); }
        const dur = readDuration();
        const dir = to >= from ? 1 : -1;
        let guard = 0;
        for (let n = from; dir > 0 ? n <= to : n >= to; n += dir * step) {
          if (guard++ >= BEEP_MAX_STEPS) break;
          pushNote(dur, beepFreq(n, sec.tick ?? 150));
          // 音色の持ちものを書き換えていれば、音符へ持たせる
          const over = {};
          for (const k of ['carrier', 'jitter', 'frame', 'display']) {
            if (sec[k] != null) over[k] = sec[k];
          }
          if (Object.keys(over).length) events[events.length - 1].beepSet = over;
          time += dur;
        }
      }
    } else if (ch === '@') {
      // 区間の中は独自の文法空間。`@名前 値` で設定を書く。
      // `@{...}` `@e{...}` のように次が `{` のものは、外と同じ読み方をする
      // ふつうの MML が書ける区間(生音の楽器)では、その楽器の操作だけをここで読み、
      // ほかの `@` は外と同じに読む。音色を変えるのと区間を開くのは止める
      let fullOther = false;
      if (section && SECTIONS[section].full) {
        let name = '';
        let j = pos;
        while (j < src.length && src[j] >= 'a' && src[j] <= 'z') name += src[j++];
        const keys = SECTIONS[section].keys;
        if (!name && src[j] === '{') {
          bad(`[ChpTnSnd] MML: ${howOpen(section)} の中では音色を変えられません。区間を閉じてから変えてください`);
        }
        if (keys[name] && src[j] !== '{') {
          const k = keys[name];
          if (k.only && !k.only.includes(sec._inst)) {
            const can = Object.keys(keys).filter((x) => !keys[x].only || keys[x].only.includes(sec._inst));
            bad(`[ChpTnSnd] MML: "@${name}" は ${k.only.join(' / ')} の操作です`
              + `(この音色の元は ${sec._inst || '不明'}。書けるのは ${can.length ? can.map((x) => `@${x}`).join(' / ') : 'ありません'})`);
          }
          pos = j;
          const v = readFloat();
          if (v === null || v < k.min || v > k.max || (k.step && Math.abs(v / k.step - Math.round(v / k.step)) > 1e-9)) {
            bad(`[ChpTnSnd] MML: "@${name}" の値は ${k.min}〜${k.max}${k.step ? `(${k.step} きざみ)` : ''} で書きます`);
          }
          if (name === 'ped') pedalAt(v === 1);
          else sec[name] = v;
          continue;
        }
        fullOther = true;
      }
      if (section && !fullOther) {
        let name = '';
        let j = pos;
        while (j < src.length && src[j] >= 'a' && src[j] <= 'z') name += src[j++];
        const keys = SECTIONS[section].keys;
        // `@g{+12}` だけは `{ }` で書く。符号の付いた数を書くので、
        // 空白区切り(`@baud 1200`)だと次の音符との切れ目が読めない
        if (keys[name] && keys[name].semi && src[j] === '{') {
          pos = j + 1;
          let word = '';
          while (pos < src.length && src[pos] !== '}') word += src[pos++];
          pos++;
          const w = word.trim().toLowerCase();
          if (w === 'off' || w === '') { sec._g = null; continue; }
          const n = Number(w);
          if (!Number.isFinite(n) || Math.abs(n) > 48) {
            bad(`[ChpTnSnd] MML: "@${name}{${word}}" は読めません`
              + '(半音の数を -48 〜 48 で書くか、off と書きます)');
          }
          sec._g = Math.round(n);
          continue;
        }
        if (!Object.keys(SECTIONS[section].keys).length) {
          bad(`[ChpTnSnd] MML: ${howOpen(section)} の中に "@" は書けません`
            + '(設定を持たない区間です)。音色や効果は区間の外で書いてください');
        }
        if (!name || src[j] === '{') {
          bad(`[ChpTnSnd] MML: "@" は ${howOpen(section)} の中では設定だけです`
            + `(${Object.keys(keys).map((k) => `@${k}`).join(' / ')})。`
            + '音色や効果は区間の外で書いてください');
        }
        {
          if (!keys[name]) {
            bad(`[ChpTnSnd] MML: "@${name}" は ${howOpen(section)} の設定ではありません`
              + `(あるのは ${Object.keys(keys).map((k) => `@${k}`).join(' / ')})`);
          }
          pos = j;
          if (keys[name].hex) {
            // 16 進の並びか `random`。`?` の中身になる
            while (pos < src.length && ' \n\t\r'.includes(src[pos])) pos++;
            let word = '';
            while (pos < src.length && /[0-9a-z]/.test(src[pos])) word += src[pos++];
            if (word === 'random' || word === '') { sec[name] = null; continue; }
            if (word.length % 2 !== 0 || /[^0-9a-f]/.test(word)) {
              bad(`[ChpTnSnd] MML: "@${name} ${word}" は読めません`
                + '(16 進を 2 桁ずつ並べるか、random と書きます)');
            }
            sec[name] = word.match(/../g).map((h) => parseInt(h, 16));
            continue;
          }
          // 音名でも書ける設定(いまは `@baud` だけ)。
          //
          // カセットの区間は高さを `@baud` でしか決められないので、旋律を
          // 書くと `@baud 1320 ?1 @baud 1048 ?1 …` と数が並ぶ。読んでも
          // 何の音か分からない。音名で書ければ、譜面として読める(2026-09-19)。
          //
          // 割り出すのは `=`(パイロット)の高さ。パイロットは `baud × 2` で
          // 鳴るので `baud = 周波数 ÷ 2`。`?`(データ)もこの `baud` から
          // 決まる(`baud ÷ 12`)ので、1 つ書けば両方が決まる。
          //
          // データのほうを音名で書きたいときは、`@baud` ではなく音名を直に
          // 書く(`@{tape(worn)}{ l4 c d e }`)。
          //
          // ボーレートは整数なので端数は丸める。ずれは 0.05% に満たない。
          // ぴったりの数が要るときは、今までどおり数字で書く
          const p = keys[name].note ? readPitchArg() : null;
          const v = p === null ? readFloat() : Math.round(freqOf(p) / 2);
          if (v === null) {
            bad(`[ChpTnSnd] MML: "@${name}" に値がありません`);
          }
          const { min, max } = keys[name];
          sec[name] = Math.max(min, Math.min(max, v));
          continue;
        }
      }
      // 音色と効果。@e/@d/@v/@s は 2 文字目で種類が決まる
      const kind = peek();
      // 命令の名前を先にまとめて見る。
      //
      // 1 文字の命令に長い名前を書くと、頭の 1 文字だけが当たって、残りの英字が
      // 音符として鳴っていた。`@vsteps{16} @vcurve{3db} c` が 6 音になり、
      // 長さも 0.50 秒から 3.50 秒に伸びる(2026-10-04 に測った)。
      // `@v` が値を取れずに黙って通り、`steps` `curve` の英字が音名として読まれる。
      // 打ち間違いが音程になるので、知らせずに済ませてよいものではない。
      //
      // 英字は `@n` のうしろでも拾う(`@nc8` は `@nc` という命令として止まる)。
      // `@n` は旧記法で、いまは `@{noise}` と書く
      let word = '';
      for (let j = pos; j < src.length && src[j] >= 'a' && src[j] <= 'z'; j++) word += src[j];
      if (AT_BRACED.includes(word) && src[pos + word.length] !== '{') {
        bad(`[ChpTnSnd] MML: "@${word}" は "@${word}{…}" と囲んで書きます`);
      }
      // 並べる命令は、囲むか 0 で止めるかのどちらか。それ以外は 1 文字の命令に当たって分かりにくく止まる
      if (['steps', 'bend', 'vib'].includes(word) && src[pos + word.length] !== '{' && src[pos + word.length] !== '0') {
        bad(`[ChpTnSnd] MML: "@${word}" は "@${word}{…}" と囲んで書きます(止めるのは @${word}0)`);
      }
      if (word.length > 1 && !AT_WORDS.includes(word)) {
        const inSec = Object.entries(SECTIONS).find(([, v]) => v.full && v.keys[word]);
        if (inSec) {
          bad(`[ChpTnSnd] MML: "@${word}" は ${howOpen(inSec[0])} の中だけで書けます`
            + `(${(inSec[1].keys[word].only || []).join(' / ')} の操作です。例: ${AT_EXAMPLE[word] || ''})`);
        }
        bad(AT_BUNDLE_ONLY.includes(word)
          ? `[ChpTnSnd] MML: "@${word}" はバンドル音色(#bundle)の中だけで書けます`
          : `[ChpTnSnd] MML: "@${word}" という命令はありません(書けるのは ${AT_LIST})`);
      }
      // 名前で書けるようにする(番号はエンジンの都合で動くので、ゲーム側は名前を使う)
      //   @{saw} = 波形 / @e{piano} = エンベロープ
      if (kind === '{') {
        pos++;
        // ドラムの囲みが先。中は音符ではなく打楽器の並びになる
        if (playDrums()) continue;
        // バンドル音色が先。名前が当たれば、そこから先の音符が中身の数だけ重なる
        if (takeVoice()) continue;
        // その音色が自分の書き方を持っていて、すぐ `{` が続けば区間を開く。
        // カセットのロード音がこれで、中は音符ではなくデータの並びになる
        {
          let j = pos;
          while (j < src.length && ' \n\t\r'.includes(src[j])) j++;
          if (src[j] === '{') {
            const opened = sectionByVoice(WAVEFORMS[wave]);
            if (!opened) {
              bad(`[ChpTnSnd] MML: 音色 "${(WAVEFORMS[wave] || {}).name}" は`
                + '区間を開けません(自分の書き方を持っていません)');
            }
            if (section) {
              bad(`[ChpTnSnd] MML: 区間の中で区間は開けません`);
            }
            pos = j + 1;
            section = opened;
            sec = {};
            if (SECTIONS[opened].full) {
              const d = describeVoice((WAVEFORMS[wave] || {}).name);
              sec._inst = d && d.detail ? d.detail.instrument : null;
              sec._first = events.length;
              sec._pedals = [];
              sec._pedOn = null;
            }
            // ブザーは 2 つめの `{ }` を受けるので、どこから始まったかと
            // 置いたイベントを覚えておく
            sec._from = time;
            sec._ids = [];
            continue;
          }
        }
        // 音色を変えたら、エンベロープはその音色のものに戻る。
        //
        // 名乗っていない音色でも、既定(flat)へ戻す。名乗っているかどうかで
        // 振る舞いが変わらないようにするため — 変わると、自分で音色を足した人が
        // 「エンベロープを書かなかった音色だけ前の指定が残る」に出くわす。
        // どの音色もエンベロープを持っている、という 1 本の決まりで済ませる。
        //
        // 一時的に変えたいときは、音色より後ろに @e{...} を書く。
        const de = (WAVEFORMS[wave] || {}).defaultEnv;
        env = de !== undefined ? de : envIndex(DEFAULT_ENV);
      }
      // 転調。音律の根音だけを動かす(`#tuning` は指示行のままで変わらない)。
      // 1 文字にすると `@ka` `@kc` が別々の命令に見えるので、語で書く。
      // 囲みも欠かせない — `@key a` を許すと、うしろの音符が根音なのか
      // 音符なのか読めなくなる(2026-09-23)
      else if (src.startsWith('key{', pos)) { pos += 4; readKey(); }
      else if (src.startsWith('tuning{', pos)) { pos += 7; readTuningAt(); }
      // フェード。いまの掛け率から行き先へ、拍数をかけて動かす。
      // なめらかか段かは音色の `vsteps` が決めるので、書き分けは無い
      else if (src.startsWith('fade{', pos)) { pos += 5; readFade(); }
      // 開く量の並び。音符が鳴るたびに次の値で、フィルタの開く量を決める。
      // パピプペ親父のために作った。シーケンサーにカットオフの値を並べて、
      // 鍵盤を押すたびに次へ進めるやり方と同じ(2026-10-16)
      else if (src.startsWith('steps{', pos)) { pos += 6; readSteps(); }
      else if (src.startsWith('steps0', pos)) { pos += 6; steps = null; }
      // 高さの並び。音符が鳴るたびに次の値だけずれた高さから始め、音の長さをかけて
      // 書いた高さへ戻る。パピプペ親父の、しゃべっているような上がり下がりのため(2026-10-17)
      else if (src.startsWith('bend{', pos)) { pos += 5; readBend(); }
      else if (src.startsWith('bend0', pos)) { pos += 5; bends = null; }
      // 揺れの並び。音符が鳴るたびに次の深さ(と速さ)で揺らす。@m より勝つ。
      // 歌のように、音ごとに揺らし方を変えるため(2026-10-17)
      else if (src.startsWith('vib{', pos)) { pos += 4; readVibs(); }
      else if (src.startsWith('vib0', pos)) { pos += 4; vibs = null; }
      // 音をまたいで高さと揺れを動かす。音符の区切りを見ずに、時間に沿って動く。
      // パピプペ親父を、1 オクターブの範囲で派手に動かすと声っぽくなる、という話から(2026-10-17)
      else if (src.startsWith('pitch{', pos)) { pos += 6; readRamp('pitch', -1200, 1200); }
      else if (src.startsWith('vibrato{', pos)) { pos += 8; readRamp('vibrato', 0, VIB_MAX); }
      else if (kind === 'e' && src[pos + 1] === '{') { pos += 2; env = readName(ENVELOPES, 'エンベロープ', env); }
      // 番号では選べない。音色(`@3`)と同じ理由で、1 つ足しただけで後ろが
      // 全部ずれる。名前で書けば、足しても動かない(2026-09-24)
      else if (kind === 'e') {
        pos++;
        const n = readNumber();
        bad(`[ChpTnSnd] MML: "@e${n ?? ''}" — 番号ではエンベロープを選べません。`
          + '@e{名前} で書いてください(番号はエンベロープを足すとずれるので通していません)');
      }
      // 音程をずらす。重ねない。うねりが欲しければ、同じ並びをもう 1 本
      // 書いて片方をずらす(2026-09-16)。前は裏で 1 声ぶん重ねていた
      else if (kind === 'd') { pos++; needValue('d', '+-'); detune = clamp(readSigned(), -2400, 2400); }
      else if (kind === 'o') { pos++; needValue('o', '+-'); octShift = clamp(readSigned(), -4, 4); }
      // 音量をずらす。書いた `v` はそのまま残り、鳴る値だけがずれる。
      //
      // `@v+1` と書くと、そこから先の `v1 v2 v3` が `v2 v3 v4` として鳴る。
      // フレーズの釣り合いを書き直さずに、その一帯だけを持ち上げられる。
      // `@v0` で戻る。
      //
      // `v+2`(そこで 1 回動く)とは別のもの。あちらは `v` そのものが動くので、
      // そのあとの `v` を書き直したことになる。こちらは書いた値に手を触れない。
      //
      // `#gain` とも別。あちらは出口の掛け算で、実機のデータには乗らない。
      // これは音符の音量そのものなので、書き出した先にも乗る。
      // 段が粗いぶん釣り合いは変わるし、15 で頭打ちになる(2026-09-30)
      else if (kind === 'v') { pos++; needValue('v', '+-'); volShift = clamp(readSignedVol(), -15, 15); }
      // ビブラート。音程のほうで、音量ではない。前の名前は `@v` だったが、
      // 音量の `v` と紛らわしいので `@m`(modulation)にした(2026-09-16)。
      //
      // 深さだけなら `@m35`。速さと遅れも決めるなら `@m{35,7,18}`
      // (深さセント・速さ Hz・遅れフレーム)。`@s` と同じ書き方にしてある。
      //
      // 書いたら音色の揺れより勝つ。音色の `vib` は書かなかったときの既定で、
      // `@e` と `defaultEnv` の関係と同じ向きになる(2026-09-19)
      else if (kind === 'm') { pos++; needValue('m', '{'); readVib(); }
      else if (kind === 's') { pos++; needValue('s', '{'); echo = readEcho(echo); }
      else if (kind === 'p' && src[pos + 1] === '{') { pos += 2; readPlace(); }
      // チャンネルの出口のフィルタ。`@f{lowpass 800}` で掛け、`@f0` で外す。
      //
      // 音色を変えても残る。層が違うので、位置(`@p`)と同じ扱いにした
      // (2026-10-11 に決めた)。音色の中のフィルタ(`@{analog(…)}`)は
      // 音色のものなので、そちらは音色を変えると戻る。
      //
      // チップには無いものなので、実機へ書き出すと消える
      else if (kind === 'f') {
        pos++;                               // "f"
        let digits = '';
        while (src[pos] >= '0' && src[pos] <= '9') digits += src[pos++];
        if (digits === '0') { filters.push({ t: time, off: true, all: true }); }
        else if (src[pos] === '{') {
          pos++;
          const slot = digits ? parseInt(digits, 10) : 1;
          // 番号は順番の札。桁を切るのは、書き間違いをそのまま通さないため
          if (slot > 999) {
            bad(`[ChpTnSnd] MML: "@f${digits}{…}" — 番号は 1 から 999 までです`);
          }
          readFx(slot);
        } else {
          bad('[ChpTnSnd] MML: "@f" は "@f{lowpass 800}" と囲んで書きます'
            + '(2 台目からは "@f2{echo 0.125}"。外すときは @f0、1 台だけなら @f2{off})');
        }
      }
      else if (kind === 'n') { pos++; wave = findWave('noise'); vargs = null; } // 旧記法: @n = ノイズ
      else {
        // 番号では選べない。ここで止める。
        //
        // 昔の MML は `@0` で音色を選べた。番号は WAVEFORMS の位置でしかなく、
        // 音色を 1 つ足しただけで後ろが全部ずれる — 曲を書いた人には
        // 何も起きていないのに音が変わる。名前なら足しても動かず、
        // 名前を変えた / 消したときだけ動く。
        //
        // 黙って読み飛ばさない。飛ばすと「書いたのに効かない」まま鳴り続け、
        // どこが悪いのか分からない。書いた場所で止まるほうが直せる。
        const n = readNumber();
        if (n !== null) {
          bad(`[ChpTnSnd] MML: "@${n}" — 番号では音色を選べません。`
            + '@{名前} で書いてください(番号は音色を足すとずれるので通していません)');
        }
        // 知らない 1 文字。ここも黙って終われない。`@q7` のように、書いた人には
        // 効いているつもりのものが何も起きずに通っていた(2026-10-04)
        bad(`[ChpTnSnd] MML: "@${word || src[pos] || ''}" という命令はありません`
          + `(書けるのは ${AT_LIST})`);
      }
    }
    // 未知の文字は無視する
  }
  if (section) {
    bad(`[ChpTnSnd] MML: ${howOpen(section)} が閉じていません`);
  }
  } catch (e) {
    if (!(e instanceof LooseStop)) throw e;
  }
  // 次の音がすぐ続くか。続くなら離れぎわ(r)を鳴らさない。
  //
  // 実機は次のキーオンで前の音が切られるので、間が空いていないと
  // 離れぎわは聞こえない。こちらは音符ごとに 0 まで落としていたので、
  // 次が音符でも離れぎわが鳴って、そのぶん手前の音量が削れていた。
  //
  // 間が空くのは、休符があるか、q で短く切ったか、曲の終わりのとき。
  for (let i = 0; i < events.length; i++) {
    const e = events[i], next = events[i + 1];
    e.open = !!(next && next.t < e.t + e.gate + 1e-6);
  }

  // タイでつながった音は、1 つの音として扱う。
  //
  // ---- なぜ要るか ----
  //
  // 鳴らす側はエンベロープを音符 1 つの長さで頭打ちにする(短い音は減衰の
  // 途中で切れる、という実機の姿)。タイでつながっていると、そのつながりが
  // 見えないので、`a+24*a &a8.` の滑る音(0.08 秒)が 0.08 秒の音として扱われ、
  // 0.34 秒の減衰が 0.08 秒に縮んで 0 まで落ちる。続く音は満振幅から始まるので、
  // 音量が谷を作って跳ね上がる — 滑ったあとに鳴り直して聞こえていた
  //(2026-09-30 に測って確かめた)。
  //
  // つながり全体の長さと、その先頭からの経過を持たせれば、鳴らす側は
  // 1 つの音として扱える。書き出しにも同じ情報が渡る。
  //
  // ---- 数えかた ----
  //
  // `legato` が立っているイベントが、前のイベントから続いている印。
  // 先頭は `legato` を持たず、`open` が立っているもの。
  let tieSeq = 0;
  for (let i = 0; i < events.length; i++) {
    if (events[i].legato) continue;          // 先頭だけから数える
    let j = i;
    while (events[j + 1] && events[j + 1].legato) j++;
    if (j === i) continue;                   // つながっていない
    const head = events[i];
    // つながりの終わりは、最後のイベントが離れるところ
    const span = events[j].t + events[j].gate - head.t;
    // つながりの通し番号。鳴らす側が「同じ声で続ける」と分かるために要る。
    // レジスタを書くチップ(OPLL / OPM)は声を自分で割り当てるので、
    // 続く音が前の音と同じ声に入らないと、キーオンを立て直すことになる
    const id = ++tieSeq;
    for (let k = i; k <= j; k++) {
      events[k].tieSpan = span;
      events[k].tieAt = events[k].t - head.t;
      events[k].tieId = id;
    }
  }

  // 戻る先。ラベルの予約語 `LOOP` を置いたところ。無ければ null。
  // 終わりは曲の終わりなので、書かなくてよい(点で足りる)
  const back = marks.find((m) => isLoopMark(m.name.trim().toLowerCase()));
  const tail = marks.find((m) => isOutroMark(m.name.trim().toLowerCase()));
  // 後奏を書いた曲は、そこが 1 周の終わり。書いていなければ曲の終わりまで
  const outro = tail ? tail.t : null;
  // 曲が書いた周回数(`#looptimes`)。鳴らす側が何も言わなければこの数で回る。
  // 戻る先が無い曲に書かれていても数えようがないので、そのときは知らせる
  const times = meta.loopTimes > 0 ? meta.loopTimes : null;
  // `times` は書いた曲にだけ入れる。書いていない曲の形を変えると、
  // 戻り値をそのまま比べているところが食い違う
  const loop = (back || tail)
    ? { from: back ? back.t : 0, to: outro ?? time, ...(times ? { times } : {}) }
    : null;
  // 2 周目から先の音量。フェードで下げたまま周の終わりに来たら、下げたまま戻る。
  // 戻った先で次の `@fade` を書くまで、周の終わりの掛け率で鳴る。
  //
  // 戻った先でもう一度 `@fade` を通ると、そのフェードも下げたところから始まる。
  // 音符ごとに直すと取りこぼすので、周の終わりの掛け率で頭から読み直して、
  // 違ったところを 2 周目のぶんとして持たせる(`loopVol` `loopFade`)
  if (loop && !again) {
    const upto = tail ? volLogAt.get(tail.name) : volLog.length;
    const end = volLog[upto - 1];
    if (end) {
      const keepReport = REPORT;
      // 読み直しで同じ知らせを 2 度出さない
      REPORT = { mode: 'loose', problems: [],
        allowOverLimit: keepReport ? keepReport.allowOverLimit : false };
      let two;
      try {
        two = compileOne(mml,
          { level: fadeAt(end.fade, loop.to), head: !back, raw: end.fade.raw }).events;
      }
      finally { REPORT = keepReport; }
      if (two.length === events.length) {
        events.forEach((e, i) => {
          if (e.t < loop.from - 1e-9 || e.t >= loop.to - 1e-9) return;
          const b = two[i];
          if (b.vol === e.vol && JSON.stringify(b.fade) === JSON.stringify(e.fade)) return;
          e.loopVol = b.vol;
          e.loopFade = b.fade ?? null;
        });
      }
    }
  }
  if (times && !loop) {
    warn('[ChpTnSnd] MML: #looptimes を書いていますが、戻る先がありません'
      + '(`#label LOOP` か `#label OUTRO` が要ります)');
  }
  try {
  for (const m of marks) {
    const name = m.name.trim();
    const low = name.toLowerCase();
    // `START` は鳴らす側が足すもの。手で書かれると、足すほうと 2 つになる。
    // 予約語に自分の意味を持たせるのは断る(2026-09-16)
    if (low === START_LABEL) {
      bad(`[ChpTnSnd] MML: ラベル "${name}" は書けません。`
        + '曲の頭の印は鳴らす側が足します(跳ぶ先の一覧にいつも並びます)');
    }
    if (isSystemMark(name) || !SHOUTING(name)) continue;
    // 全部大文字はこちらの取り分。書いてよいのは予約語だけ(2026-09-16)。
    // 前は知らせるだけにしていたが、あとで予約語になったときに曲の鳴り方が
    // 変わる。ここで断れば、そのときに黙って変わることが無い。
    // この形は他所の MML には無いので、写してきて困ることも無い
    bad(`[ChpTnSnd] MML: ラベル "${name}" は全部大文字です。`
      + '大文字の名前は予約語のために空けてあります'
      + `(いまの予約語は LOOP と OUTRO)。小文字を混ぜてください`);
  }
  } catch (e) {
    if (!(e instanceof LooseStop)) throw e;
  }
  // 重ね掛けの見積もり。鳴らす前に桁で気づけるようにする(`sound/fx.js` の FX_COST)。
  // 実際の負荷は聞く人の機械しだいなので、止めはしない
  if (filters.length) {
    // 番号ごとに、作ることになる並びの数。動かせない値の組み合わせごとに 1 つと、
    // `@f0` で素通しへ移るぶんが 1 つ
    const vars = fxVariants(filters, FX_KINDS, FILTERS);
    for (const [slot, g] of vars) {
      const n = g.sigs.length + (g.bypass ? 1 : 0);
      const at = slot === 1 ? '@f' : `@f${slot}`;
      if (n > FX_MAX_VARIANTS) {
        overLimit(`[ChpTnSnd] MML: "${at}" に ${g.kind} の並びが ${n} 本できます`
          + `(上限は ${FX_MAX_VARIANTS} 本)。動かせない値を書き替えるたびに 1 本増えます。`
          + `${g.kind} で途中から動かせるのは `
          + `${Object.entries(FX_KINDS[g.kind].params).filter(([, p]) => p.live)
              .map(([k]) => k).join(' ') || '(なし)'} です`,
        'それ以外を何通りも使うなら、チャンネルを分けてください'
          + '(分かって越えるなら compileMML の allowOverLimit です)');
      } else if (n > FX_WARN_VARIANTS) {
        warn(`[ChpTnSnd] MML: "${at}" に ${g.kind} の並びが ${n} 本できます`
          + `(${FX_WARN_VARIANTS} 本を越えました)。どれにも音が入り続けるので、`
          + 'そのぶん重くなります。同じ組み合わせは使い回すので、'
          + '行ったり来たりするぶんは増えません');
      }
    }
    let cost = 0;
    for (const [, g] of vars) {
      // 並びの数だけ重さを数える。1 本ぶんだけ数えると、入れ替える曲で桁を見誤る
      const one = filters.find((f) => f.kind === g.kind);
      if (one) cost += fxCost(one) * (g.sigs.length + (g.bypass ? 1 : 0));
    }
    if (cost > FX_WARN_COST) {
      const seen = new Map();
      for (const f of filters) if (f.kind && !seen.has(f.slot ?? 1)) seen.set(f.slot ?? 1, f);
      const names = [...seen.values()].map((f) => f.kind).join(' + ');
      warn(`[ChpTnSnd] MML: このチャンネルのエフェクト(${names})は、`
        + `1 ブロックの締め切りの ${cost.toFixed(1)}% を使う見積もりです`
        + `(${FX_WARN_COST}% を越えました)。機械によっては音が途切れます。`
        + '書き出し(renderBGM)には締め切りが無いので、焼けば必ず聞けます');
    }
  }
  // `ending` は前の名前。読む側が直るまで、同じ値を両方の名前で返す
  return { events, total: time, loop, outro, ending: outro, meta, marks, bars, cues, texts,
    filters, tempos,
    // 層の呼び名。`lane` は控えめな字なので、画面に出すものは別に持つ
    laneLabels };
}

/**
 * 選択肢の囲みで切り分ける。
 *
 * `#takes <グループ>` で開き、名前だけの `#takes` で閉じる。
 * 中は `#take <名前>` で仕切る(docs/DYNAMIC.md)。
 *
 * @param {string} src チャンネル 1 本ぶんの MML
 * @returns {({kind:'common', text:string}
 *          |{kind:'takes', group:string, options:{name:string,text:string}[]})[]}
 */
function splitTakes(raw) {
  const src = normalizeDirectives(raw);
  const OPEN = /^[ \t]*\/\/[ \t]*#[ \t]*takes\b[ \t]*(.*)$/i;
  const TAKE = /^[ \t]*\/\/[ \t]*#[ \t]*take\b[ \t]*(.*)$/i;
  const out = [{ kind: 'common', text: '' }];
  let open = null;   // いま開いている囲み
  for (const line of String(src ?? '').split(/\r?\n/)) {
    const o = OPEN.exec(line);
    if (o) {
      const name = o[1].trim();
      if (open) {
        if (name) {
          bad(`[ChpTnSnd] MML: "#takes ${name}" は`
            + `"#takes ${open.group}" の中では書けません(入れ子にはできません)`);
        }
        if (!open.options.length) {
          bad(`[ChpTnSnd] MML: "#takes ${open.group}" に選択肢がありません`
            + '(中を "#take <名前>" で仕切ります)');
        }
        out.push(open);
        out.push({ kind: 'common', text: '' });
        open = null;
        continue;
      }
      if (!name) {
        bad('[ChpTnSnd] MML: 開いていない "#takes" を閉じています');
      }
      // グループの名前のうしろに、その囲みの性格を書ける。
      //   restart = 押されたら囲みの頭から鳴らし直す
      //   now     = 切れ目(#switch と |)を待たずに替える
      // 語を並べる形にしてあるので、あとで増やしても書き方は変わらない
      const KNOWN = ['restart', 'now'];
      const [group, ...flags] = name.split(/[ \t]+/);
      const low = flags.map((f) => f.toLowerCase());
      for (const f of low) {
        if (!KNOWN.includes(f)) {
          bad(`[ChpTnSnd] MML: "#takes ${group}" の "${f}" は知らない指定です`
            + `(いまあるのは ${KNOWN.join(' と ')})`);
        }
      }
      open = { kind: 'takes', group, options: [],
               restart: low.includes('restart'), now: low.includes('now') };
      continue;
    }
    if (open && /^[ \t]*\/\/[ \t]*#[ \t]*switch\b/i.test(line)) {
      // 網の目は曲ぜんぶの決めごとで、選び替えで変わると数えはじめがずれる。
      // 選んでいない枝に書いたものが効くのも、ほかの指示と食い違う(2026-09-18)
      bad(`[ChpTnSnd] MML: "#switch" は "#takes ${open.group}" の中では`
        + '書けません(網の目は曲ぜんぶで 1 つです)');
    }
    const t = TAKE.exec(line);
    if (t) {
      if (!open) {
        bad(`[ChpTnSnd] MML: "#take ${t[1].trim()}" は`
          + ' "#takes <グループ>" の中だけで書けます');
      }
      open.options.push({ name: t[1].trim(), text: '' });
      continue;
    }
    if (!open) { out[out.length - 1].text += line + '\n'; continue; }
    if (!open.options.length) {
      // 仕切りの前に書いたものは捨てない。1 つ目の選択肢の中とみなす
      open.options.push({ name: '', text: '' });
    }
    open.options[open.options.length - 1].text += line + '\n';
  }
  if (open) {
    bad(`[ChpTnSnd] MML: "#takes ${open.group}" が閉じていません`
      + '(名前を書かない "#takes" で閉じます)');
  }
  return out;
}

/**
 * 前置きのあとに続きを足して読み、続きのぶんだけを返す。
 *
 * 音色も音量もオクターブも前置きから引き継ぐので、途中から読むことはできない。
 * 頭から読み直して、前置きのぶんを落とす(2026-09-16)。
 */
function piece(prefix, body) {
  const head = compileOne(prefix);
  const all = compileOne(prefix + body);
  return {
    events: all.events.slice(head.events.length)
      .map((e) => ({ ...e, t: e.t - head.total })),
    marks: all.marks.slice(head.marks.length)
      .map((m) => ({ ...m, t: m.t - head.total })),
    bars: all.bars.slice(head.bars.length).map((b) => b - head.total),
    texts: all.texts.slice(head.texts.length),
    cues: all.cues.slice(head.cues.length)
      .map((c) => ({ ...c, t: c.t - head.total })),
    tempos: (all.tempos || []).slice((head.tempos || []).length)
      .map((m) => ({ ...m, t: m.t - head.total })),
    total: all.total - head.total,
  };
}

/**
 * MML をイベント列にコンパイルする。
 *
 * 選択肢(`#takes`)が書いてあれば、囲みごとに全部の選択肢を読む。
 * 囲みの長さはいちばん長い選択肢に合わせるので、どれを選んでも曲の長さは動かない。
 * `events` には 1 つ目の選択肢が並ぶ。鳴らす側が選び替える。
 *
 * 囲みの中で変えたもの(`o` `v` `@{}` など)は、囲みを出ると戻る。
 * 残すと、どれを選んだかで共通のところの音が変わってしまう。
 *
 * @param {string} mml 1 チャンネルぶんの MML
 * @returns {{events:object[], total:number, loop:object|null, outro:number|null,
 *            meta:object, marks:{name:string,t:number}[],
 *            takes:{group:string,at:number,dur:number,
 *                   options:{name:string,events:object[],total:number}[]}[]}}
 */
export function compileMML(mml, opts = {}) {
  // 読み方は呼ぶ側が決める。入れ子で呼ばれたとき(piece など)は、
  // 外で立てた控えをそのまま使う
  const own = REPORT === null;
  if (own) REPORT = { mode: modeOf(opts.mode), allowOverLimit: !!opts.allowOverLimit, problems: [] };
  try {
    return compileInto(mml);
  } catch (e) {
    if (own && REPORT.mode === 'loose' && e instanceof LooseStop) {
      return { events: [], total: 0, loop: null, outro: null, ending: null,
        meta: {}, marks: [], takes: [], bars: [], cues: [], texts: [], tempos: [],
        problems: REPORT.problems };
    }
    throw e;
  } finally {
    if (own) REPORT = null;
  }
}

/** 中身。控えの立て方は `compileMML` が持つ */
function compileInto(mml) {
  const here = () => (REPORT ? REPORT.problems : []);
  const segs = splitTakes(mml);
  if (!segs.some((x) => x.kind === 'takes')) {
    return { ...compileOne(mml), takes: [], problems: here() };
  }
  const events = [], marks = [], takes = [], bars = [], cues = [], texts = [], filters = [];
  const tempos = [];
  const laneLabels = new Map();
  let prefix = '';
  let at = 0;
  for (const s of segs) {
    if (s.kind === 'common') {
      if (!s.text.trim()) continue;
      const p = piece(prefix, s.text);
      for (const e of p.events) events.push({ ...e, t: e.t + at });
      for (const m of p.marks) {
        if (!marks.some((x) => x.name === m.name)) marks.push({ name: m.name, t: m.t + at });
      }
      for (const b of p.bars) bars.push(b + at);
      for (const c of p.cues) cues.push({ ...c, t: c.t + at });
      for (const x of p.texts || []) texts.push({ ...x, t: x.t + at });
      for (const f of p.filters || []) filters.push({ ...f, t: f.t + at });
      for (const [k, v] of p.laneLabels ?? []) laneLabels.set(k, v);
      at += p.total;
      prefix += s.text;
      continue;
    }
    const opts = s.options.map((o) => ({ name: o.name, ...piece(prefix, o.text) }));
    const dur = Math.max(0, ...opts.map((o) => o.total));
    for (const o of opts) {
      if (Math.abs(o.total - dur) > 1e-6) {
        warn(`[ChpTnSnd] MML: 選択肢 "${s.group}/${o.name}" の長さが`
          + `そろっていません(${o.total.toFixed(3)}s / いちばん長いもの ${dur.toFixed(3)}s)。`
          + '後ろは休みで埋めます');
      }
    }
    // 並べておくのは 1 つ目。鳴らす側が選び替える
    for (const e of opts[0].events) events.push({ ...e, t: e.t + at });
    for (const m of opts[0].marks) {
      if (!marks.some((x) => x.name === m.name)) marks.push({ name: m.name, t: m.t + at });
    }
    // 切れ目は選んだ選択肢のものを使う。刻みの違う選択肢では、切ってよい場所も
    // 変わる(2026-09-18)。並べておくのは 1 つ目のぶん
    for (const b of opts[0].bars) bars.push(b + at);
    // 合図は選んだ選択肢のぶんだけ出る。読まない枝の合図は鳴らない
    for (const c of opts[0].cues) cues.push({ ...c, t: c.t + at });
    for (const m of opts[0].tempos || []) tempos.push({ ...m, t: m.t + at });
    for (const x of opts[0].texts || []) texts.push({ ...x, t: x.t + at });
    // フィルタは選んだ選択肢のぶん。並べておくのは 1 つ目
    for (const f of opts[0].filters || []) filters.push({ ...f, t: f.t + at });
    for (const o of opts) for (const [k, v] of o.laneLabels ?? []) laneLabels.set(k, v);
    takes.push({
      group: s.group, at, dur,
      restart: s.restart === true, now: s.now === true,
      options: opts.map((o) => ({ name: o.name, events: o.events,
                                 cues: o.cues, texts: o.texts, bars: o.bars, total: o.total })),
    });
    at += dur;
  }
  const back = marks.find((m) => isLoopMark(m.name.trim().toLowerCase()));
  const tail = marks.find((m) => isOutroMark(m.name.trim().toLowerCase()));
  const outro = tail ? tail.t : null;
  const meta2 = readDirectives(mml);
  const times = meta2.loopTimes > 0 ? meta2.loopTimes : null;
  const loop = (back || tail)
    ? { from: back ? back.t : 0, to: outro ?? at, ...(times ? { times } : {}) }
    : null;
  return { events, total: at, loop, outro, ending: outro,
    meta: meta2, marks, takes, bars, cues, texts, filters, tempos, laneLabels,
    problems: here() };
}

/**
 * 曲を、前奏・本編・後奏に切って並べ直す。
 *
 * 決めごとはここ 1 か所。鳴らすとき(`renderBGM`)も、動画の音符を並べる
 * ところ(`tool/core/video.js`)も、これを呼ぶ。同じ切り方を 2 か所に書くと、
 * 片方だけ直したときに音と絵がずれる(2026-09-24)。
 *
 * 切れ目は `LOOP` と `OUTRO`。本編は `loop.from` から `outro` まで(`OUTRO` が
 * 無ければ曲の終わりまで)で、そこだけを `loops` 回並べる。
 *
 * 何周ぶん並べるかは、呼ぶ側 → 曲の `#looptimes` → 2 の順に見る。
 *
 * @param {object[]} tracks `compileMML()` の返りの並び(チャンネルごと)
 * @param {{loops?:number, intro?:boolean, outro?:boolean}} [opts]
 *   loops = 本編を何周ぶん並べるか。書かなければ曲の `#looptimes`、それも
 *   無ければ 2。intro = 前奏を入れるか(既定 true)。
 *   outro = 後奏を入れるか(既定 true)
 * @returns {{parts:{from:number,to:number,at:number}[], span:number,
 *            loops:number, outroAt:number|null, total:number}}
 *   parts = 切り出す範囲と、並べ直したあとの頭の時刻。
 *   span = 並べ終えた長さ。outroAt = 後奏の始まる時刻(無ければ null)。
 *   total = 元の曲 1 周ぶんの長さ
 */
export function songParts(tracks, opts = {}) {
  const list = Array.isArray(tracks) ? tracks : [tracks];
  const total = Math.max(...list.map((t) => t.total ?? 0), 0.01);
  const back = list.map((t) => t.loop).find(Boolean) ?? null;
  const endAt = list.map((t) => t.outro).find((v) => v != null) ?? null;
  const want = list.map((t) => t.loop && t.loop.times).find((v) => v > 0) ?? 2;
  // 本編がある曲だけが周回する。`LOOP` も `OUTRO` も書いていない曲を
  // 何周も並べると、同じものが 2 回続けて出るだけになる(2026-09-24)
  const laps = back || endAt != null;
  const loops = laps ? Math.max(1, Math.floor(opts.loops ?? want)) : 1;
  const from = back ? back.from : 0;
  const lapEnd = endAt != null ? Math.min(endAt, total) : total;

  const parts = [];
  let at = 0;
  const push = (a, b) => { parts.push({ from: a, to: b, at }); at += b - a; };
  if (opts.intro !== false && from > 0) push(0, from);
  // 本編の 1 周目が `parts` の何番目か。2 周目から先は音量の持ち越しが要る
  // (フェードで下げたまま戻る。`loopVol`)
  const lapAt = parts.length;
  for (let i = 0; i < loops; i++) push(from, lapEnd);
  const wantOutro = opts.outro !== false && lapEnd < total;
  const outroAt = wantOutro ? at : null;
  if (wantOutro) push(lapEnd, total);
  return { parts, span: at, loops, outroAt, total, lapAt };
}

/**
 * MML を、鳴らさずに確かめる。
 *
 * エンジンの言い分は `console.warn` へ流れるだけなので、呼んだ側からは
 * 何が起きたのか読めなかった。マニュアルのページは `console.warn` を
 * 自分のものに差し替えて集めていて、同じ手を使う場所が増えていく。
 * それを 1 か所にした(2026-09-15)。
 *
 * 渡し方は 2 つある。プログラムから呼ぶときは、チャンネルごとに分けた並びが
 * 素直で、`defineBGM()` に渡すのと同じ形になる。人が 1 本のテキストに書いたものは、
 * そのまま渡せば `splitVoices()` で切ってから読む。
 * 読めないところがあれば `errors` に入り、
 * 鳴りはするが怪しいところは `warnings` に入る。
 *
 * チャンネルをまたいだ食い違いもここで見る。`LOOP` の位置がそろっていないと、
 * 最初の 1 本に合わせて鳴るので、書いた人の思ったとおりにはならない。
 *
 * ```js
 * const got = validateMML(voices);        // チャンネルごとの並び
 * if (!got.ok) for (const e of got.errors) console.log(e.text);
 * for (const w of got.warnings) console.log(`${w.ch + 1} 本目: ${w.text}`);
 * ```
 *
 * @param {string[]|string} text チャンネルごとの並び、または 1 本のテキスト
 * @returns {{ok:boolean, errors:{ch:number|null,text:string}[],
 *            warnings:{ch:number|null,text:string}[],
 *            channels:{ch:number,name:string|null,role:string|null,
 *                      events:number,total:number,loop:object|null,
 *                      marks:{name:string,t:number}[]}[],
 *            total:number}}
 */
export function validateMML(text, mode, allowOverLimit) {
  const errors = [];
  const warnings = [];
  const channels = [];
  // チャンネルごとに分けてあるなら、そのまま。1 本なら切り分ける
  const voices = Array.isArray(text)
    ? text.map((v) => String(v ?? '')).filter((v) => v.trim() !== '')
    : splitVoices(text);
  if (!voices.length) {
    return { ok: false, errors: [{ ch: null, text: '鳴らすものがありません' }],
      warnings, channels, total: 0 };
  }
  // エンジンの言い分を横から借りる。戻したあとで並べ直す
  const said = console.warn;
  let total = 0;
  voices.forEach((src, i) => {
    const heard = [];
    console.warn = (...a) => { heard.push(a.join(' ')); };
    let got = null;
    try {
      got = compileMML(src, { mode, allowOverLimit });
    } catch (e) {
      errors.push({ ch: i, text: String(e && e.message ? e.message : e) });
    } finally {
      console.warn = said;
    }
    for (const w of heard) {
      warnings.push({ ch: i, text: w.replace(/^\[MMSXX\]\s*/, '') });
    }
    if (!got) return;
    total = Math.max(total, got.total);
    channels.push({
      ch: i,
      meta: got.meta,
      name: got.meta.name ?? got.meta.ch ?? null,
      role: got.meta.role ?? null,
      events: got.events.length,
      total: got.total,
      loop: got.loop,
      marks: got.marks,
      takes: got.takes ?? [],
    });
    if (!got.events.length) warnings.push({ ch: i, text: '音符がありません' });
  });

  // ---- チャンネルをまたいで見る ----
  //
  // 曲ぜんぶに効くものが、チャンネルごとに違っていたら止める。
  // 黙って最初の 1 本を採ると、書いたほうは採られなかった側を探すことになる。
  // 1 か所に書けば全部の頭に写るので、食い違うのは書き間違いのとき(2026-09-15)
  for (const key of SONG_WIDE) {
    const said = channels.filter((c) => c.meta[key] !== undefined);
    const first = said[0];
    for (const c of said) {
      if (String(c.meta[key]) !== String(first.meta[key])) {
        errors.push({ ch: c.ch,
          text: `#${key} が食い違っています `
            + `(${first.ch + 1} 本目は "${first.meta[key]}"、`
            + `${c.ch + 1} 本目は "${c.meta[key]}")。曲ぜんぶに効くので 1 つに決めます` });
      }
    }
  }
  const mark = channels.map((c) => c.loop).find(Boolean) || null;
  if (mark) {
    for (const c of channels) {
      if (c.loop && Math.abs(c.loop.from - mark.from) >= 0.001) {
        errors.push({ ch: c.ch,
          text: `LOOP が食い違っています (${c.loop.from.toFixed(2)} 秒)。`
            + `${mark.from.toFixed(2)} 秒にも書いてあります。戻る先は曲に 1 つです` });
      }
    }
  }
  // 選択肢の食い違い。同じグループに同じ名前を書いておくと、
  // 1 回選ぶだけで全部のチャンネルがそろって替わる。名前がずれていると、
  // 替わるチャンネルと替わらないチャンネルが出る。それは書き間違いのことが多い
  const groups = new Map();
  for (const c of channels) {
    for (const box of c.takes || []) {
      if (!groups.has(box.group)) groups.set(box.group, []);
      groups.get(box.group).push({ ch: c.ch, names: box.options.map((o) => o.name) });
    }
  }
  for (const [group, boxes] of groups) {
    const first = boxes[0];
    for (const b of boxes.slice(1)) {
      const same = b.names.length === first.names.length
        && b.names.every((n, i) => n === first.names[i]);
      if (!same) {
        warnings.push({ ch: b.ch,
          text: `選択肢 "${group}" の顔ぶれが食い違っています `
            + `(${first.ch + 1} 本目は ${first.names.join(' / ')}、`
            + `${b.ch + 1} 本目は ${b.names.join(' / ')})。`
            + '同じ名前を書いておくと、まとめて替わります' });
      }
    }
    // 名前を書かなかった選択肢。仕切りの前に書いたものがここへ来る
    for (const b of boxes) {
      if (b.names.some((n) => n === '')) {
        warnings.push({ ch: b.ch,
          text: `選択肢 "${group}" に名前の無いものがあります`
            + '("#take <名前>" で仕切ります)' });
      }
    }
  }
  return { ok: errors.length === 0, errors, warnings, channels, total };
}
