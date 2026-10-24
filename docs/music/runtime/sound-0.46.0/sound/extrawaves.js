// 足りない基本波形。
//
// 作りつけには矩形波が 12.5 / 25 / 50% の 3 通りしかなく、鋸波は 1 種類だけ。
// カセットに音源を足していた機種では、そこがもっと細かかった —
// デューティ比が 16 分のいくつかで 8 通り、鋸波は素の坂ではなく段のある坂。
// ここに置くのはその足りないぶん。
//
// 作りつけの矩形波とは別のまとまりにしてある。名前は
// 何分のいくつかがそのまま数字のままだが、`wavePulse( )` の仲間として書く。
//
// ---- なぜ混ぜないか ----
//
// 作りが違う。`pulse(12)` は幅を持った発振器そのもので、ここのものは
// 32 個の表として書いた波形メモリ。同じ「矩形波」に見えても通る道が違い、
// 波形メモリの道は山が 1 になるよう均されるので、幅と音量の関係が
// 作りつけの側とそろわない(測ると `wavePulse(6)` は理屈より 7 dB 静かい)。
//
// 混ぜると、同じ列に並んでいるのに音量の並びだけが折れる。
// 実機の矩形波として登録し直すまでは、別のまとまりとして置く。
//
// ---- 段のある鋸のこと ----
//
// 素の鋸ではない。足し算器の値をそのまま出す作りだったので、
// 1 周期が段のある坂になる。段が粗いぶん高い倍音が出て、
// 素の鋸よりざらつく。あの手の曲らしさは、ほとんどここから来る。
//
// これは「らしい形」で、実機の波形を写したものではない。
// 段の数と粗さは合わせてあるが、実機は音量の掛かり方も違う。
//
// 完全に同じ音は目指さない。狙いは「並べて聴けば違いが分かるが、
// 単体で聴けば分からない」ところまでで、いまの形でそこに届いている。
// これ以上の詰めは、届かない曲が出てきてからでよい
// (何をどこまで測るかは docs/SOUND_TOOL.md の「出来を測るもの」)。

import { registerWave, registerFamily, findWave } from './mml.js';

/** 1 周期の長さ。段が 8 つなので、割り切れる数にする */
export const EXTRA_LEN = 32;

/** 1 周期ぶんを作る(0..1 を受けて -1..1 を返す関数から) */
const build = (fn) => Array.from({ length: EXTRA_LEN }, (_, i) => fn(i / EXTRA_LEN));

/**
 * 矩形波。デューティ比は 16 分のいくつで決まる。
 *
 * 1/16 の細いものは、鼻にかかったような薄い音。
 * 8/16(＝50%)まで来ると作りつけの `pulse(50)` と同じ太さになる。
 */
const pulse = (n) => build((p) => (p < n / 16 ? 1 : -1));

/**
 * 段のある鋸。
 *
 * 足し算器が 1 周期のあいだに 7 回足して、8 回目で 0 に戻る。
 * だから段は 7 つで、8 つ目が落ち込みになる。
 */
/**
 * 音律を確かめるための波形。
 *
 * 1〜6 倍音を足したもので、4 倍音と 5 倍音を大きくしてある。
 * 長 3 度のうなりは 5 倍音と 4 倍音、5 度のうなりは 3 倍音と 2 倍音から出るので、
 * そこを厚くすると、ずれがそのまま速さになって聞こえる。
 */
export const TUNER = (() => {
  const h = [0.5, 0.35, 0.4, 0.95, 1, 0.25];       // 1〜6 倍音の大きさ
  // 位相をずらして山を低くする。正弦をそのまま足すと山が 1 か所に集まり、
  // 山を 1 に均したときに実効値が矩形波の 0.39 倍(-8dB)まで落ちる。
  // うなりは倍音の大きさで決まり、位相では変わらないので、ここはずらし得。
  // 山が散って 0.47 倍(-6.6dB)まで戻る(シュレーダー位相)
  const power = h.reduce((s, a) => s + a * a, 0);
  const phase = h.map((_, k) => {
    let acc = 0;
    for (let j = 0; j <= k; j++) acc += (k + 1 - j) * h[j] * h[j] / power;
    return -Math.PI * acc;
  });
  const raw = build((p) => h.reduce(
    (sum, a, i) => sum + a * Math.sin(2 * Math.PI * (i + 1) * p + phase[i]), 0));
  const top = Math.max(...raw.map(Math.abs));
  return raw.map((v) => v / top);
})();

export const SAW_STEP = build((p) => {
  const step = Math.floor(p * 8);            // 0..7
  return step >= 7 ? -1 : step / 6 * 2 - 1;  // 7 段のぼって、最後に落ちる
});

/**
 * 足すもの。作りつけに無いものだけを置く。
 *
 * 16 分の 2 / 4 / 8 は `pulse(12)` `pulse(25)` `pulse(50)` がすでにあるので置かない。
 * 同じ形を 2 つの名前で持つと、どちらを書いたかで音が違うのかと迷う。
 */
export const EXTRA_PRESETS = {
  'wavePulse(6)': {
    descJa: '幅 6.25%(16 分の 1)。細くて鼻にかかる。混んだところでも他とぶつからずに上へ乗る',
    role: 'lead', wave: pulse(1), bits: 1,
    desc: '1/16 duty (6.25%). Thin and reedy; sits above a busier mix without fighting it.' },
  'wavePulse(18)': {
    descJa: '幅 18.75%(16 分の 3)。プリセットの 12.5% と 25% のあいだ',
    role: 'lead', wave: pulse(3), bits: 1,
    desc: '3/16 duty (18.75%). Between the built-in 12.5% and 25%.' },
  'wavePulse(31)': {
    descJa: '幅 31.25%(16 分の 5)',
    role: 'lead', wave: pulse(5), bits: 1,
    desc: '5/16 duty (31.25%).' },
  // 1/3 は 32 点では作れない(11/32 で 34.4%、10/32 は wavePulse(31) と同じ)。
  // これだけ 96 点の表にして、33.3% ちょうどにした(2026-10-17)
  'wavePulse(33)': {
    role: 'lead', wave: Array.from({ length: 96 }, (_, i) => (i < 32 ? 1 : -1)), bits: 1,
    desc: '1/3 duty (33.3%). Every third harmonic drops out. Not a sixteenth: the table is 96 steps long so the third comes out exact.' },
  'wavePulse(37)': {
    descJa: '幅 37.5%(16 分の 6)',
    role: 'lead', wave: pulse(6), bits: 1,
    desc: '6/16 duty (37.5%).' },
  'wavePulse(43)': {
    descJa: '幅 43.75%(16 分の 7)。ほとんど矩形波と同じ太さ',
    role: 'lead', wave: pulse(7), bits: 1,
    desc: '7/16 duty (43.75%). Nearly as full as a square wave.' },
  // 音律を確かめるためのもの。楽器ではない。
  //
  // `wave` の一族ではない。あちらは実機の波形メモリらしさを集めたところで、
  // 段が粗いことが売りになっている。これは 8 ビットで、倍音から作っていて、
  // 分周の丸めからも外してある。性格が合わないので `tool` で始める。
  // 素の `tuner` を取らないのは、短い語を 1 つ押さえてしまうため(2026-09-23)。
  //
  // 音律の違いは、倍音どうしがぶつかって出る「うなり」でしか聞こえない。
  // 長 3 度なら下の音の 5 倍音と上の音の 4 倍音、5 度なら 3 倍音と 2 倍音。
  // 矩形波には偶数倍音が無いので、4 倍音も 2 倍音も出ない。ぶつかる相手が
  // いないので、どの音律で鳴らしても同じに聞こえる(2026-09-23)。
  //
  // そこで 2〜5 倍音を持たせて、4 倍音と 5 倍音を basic より大きくした。
  // 3 度も 5 度も、ずれていればはっきりうなる。
  toolTuner: {
    descJa: '音律を確かめるためのもの。楽器ではない。'
          + '4 倍音と 5 倍音を強くしてあるので、3 度と 5 度のずれがうなりになって出る。'
          + '音律を替えて長くのばすと、うなりの速さが変わるのが分かる。'
          + '矩形波では偶数倍音が無いので、そもそもうなりが出ない。'
          + '実機の分周には乗せない。丸めると純正の 3 度が 1.5Hz うなって、'
          + '平均律の速いうなりより揺れて聞こえてしまう。'
          + '山を 1 に均すぶん実効値が下がるので、音量の下駄を 1.9 倍はかせて、'
          + '矩形波と同じ v で同じくらいの大きさになるようにしてある',
    role: 'lead', wave: TUNER, bits: 8, special: ['exact'], gain: 1.9,
    desc: 'A ruler, not an instrument. The fourth and fifth harmonics are pushed up, so a third '
        + 'or a fifth that is out of tune beats audibly. Hold a dyad and switch tunings: the '
        + 'beat rate is the difference. A square wave has no even harmonics, so nothing beats '
        + 'there at all. This one is never rounded onto the real chip dividers: rounding leaves '
        + 'a pure third beating at 1.5Hz, which reads as more wobble than the fast one.' },

  waveSawStep: {
    descJa: '段のあるのこぎり。7 段のぼって 1 段落ちる。足し算器で作るチップはこの形になる。素のなだらかな坂よりざらつく。VRC6 ののこぎりにそのまま当てはまる',
    role: 'lead', wave: SAW_STEP, bits: 5,
    desc: 'Stepped saw: seven rising steps and a drop, the way an adder-based chip builds one. Grittier than a plain ramp. Maps straight onto the VRC6 saw.' },
};

/**
 * 作り分けを持つものの仲間。軸と値の説明は `describeVoice()` が返す
 */
function registerExtraFamilies() {
  registerFamily('wavePulse', {
    desc: 'One-bit wavetable pulses in sixteenths, plus a third, for widths the built-in pulse does not have.',
    params: [{
      name: 'width', default: '6', desc: 'Share of each cycle spent high, in percent (rounded down).',
      values: [
        { value: '6', desc: '1/16 (6.25%). Thin and reedy; sits above a busy mix without fighting it.' },
        { value: '18', desc: '3/16 (18.75%). Between the built-in 12.5% and 25%.' },
        { value: '31', desc: '5/16 (31.25%).' },
        { value: '33', desc: '1/3 (33.3%). Every third harmonic drops out. The one width that is not a sixteenth.' },
        { value: '37', desc: '6/16 (37.5%).' },
        { value: '43', desc: '7/16 (43.75%). Nearly as full as a square wave.' },
      ],
    }],
  });
}

/**
 * 最初から入れておく(ChipTuneSound が読み込まれるときに走る)。
 * 二度呼ばれても止まらない(理由は tones.js の同じところ)
 */
export function registerExtraWaves() {
  registerExtraFamilies();
  const has = (n) => findWave(n) >= 0;
  for (const [name, p] of Object.entries(EXTRA_PRESETS)) {
    if (!has(name)) {
      registerWave(name, p.wave, p.bits,
        { role: p.role, desc: p.desc, descJa: p.descJa,
          special: p.special, gain: p.gain, vsteps: p.vsteps, vcurve: p.vcurve,
          snapDiv: p.snapDiv, dev: p.dev });
    }
  }
}
