// 真空管の段(tube)。昔のスタジオ機材の、真空管 1 段を通したときの色づけをまねる。
//
// transformer・tape と並べて tube -> transformer -> tape の順に通すつもりで、
// ここは真空管だけを受け持つ。
//
// ---- 何をまねているか ----
//
// 三極管の 1 段は、入力の山と谷で増幅率が違う。片側は伸びて、反対側は早めに
// 頭打ちになる。この左右の違いが偶数次(とくに 2 次)の倍音になる。
// どれだけ偏るかは、球のバイアス(動作点)で決まる。
//
// ここでは tanh の曲線を横にずらして、その偏りを作る。
//
//   c  = bias * BIAS_MAX         曲線をずらす量(動作点のつもり)
//   t0 = tanh(c), k = 1 / (1 - t0^2)
//   f(x) = k * (tanh(g x + c) - t0) / g
//
// f(0) = 0 で、0 のところの傾きは 1。小さい音は大きさを変えずに通る。
// bias が 0 なら tanh(g x) / g で、DYN_CODE の saturator と同じ左右対称の曲線になる。
// bias を上げると、正の側は早く頭打ちになり、負の側は少し伸びる(傾きは最大で k)。
// 三極管の伝達曲線そのもの(3/2 乗の法則など)ではなく、偏り方の向きを似せた近似。
//
// 音の大きさで鳴り方が変わるのは、この曲線の形から来る。2 次の倍音は振れ幅に比例して、
// 3 次は振れ幅の 2 乗に比例して増える。小さい音はほぼそのまま、少し大きいと 2 次が出て、
// もっと大きいと 3 次も混ざる。電源のたわみ(サグ)や、グリッド電流でバイアスが動く
// 現象はまねていない。
//
// ---- 処理の流れ ----
//
// 曲線を「そのまま通る x」と「曲線が足したぶん r(x) = f(x) - x」に分けて、
// r だけに手を入れる。
//
//   y = x + DC(LP(ADAA(r)))
//
// - ADAA(折り返しを減らす)。倍音は 44.1kHz・48kHz の上限を越えると折り返して、
//   音程に合わない音になる。2 倍のオーバーサンプリングは、補間のフィルタが前後で
//   2 本要り、曲線も 2 回計算することになる。ここでは 1 次の ADAA を使う。
//   r の原始関数 R を持っておき、(R(x) - R(x_前)) / (x - x_前) を出す。
//   1 サンプルあたり exp と log1p が 1 回ずつで済む。折り返しは消えはせず、減るだけ。
//   ADAA は半サンプル遅れ、2 点の平均に近い高域の落ち方をする。それを r にだけ
//   掛けるので、そのまま通る x の高域は削らない。その代わり、高い音を強く入れたときは
//   x と r のあいだに半サンプルのずれが残り、頭打ちのしかたが少し甘くなる
// - LP(highcut)。r にだけ掛ける 1 次のローパス(双一次変換)。足された倍音を丸くする。
//   実機では球の入力容量(ミラー効果)が音全体の高域を落とすが、ここでは倍音だけに
//   掛ける。小さい音を変えないための作りの都合で、物理のまねではない。
//   ナイキストに零点があるので、残った折り返しも少し減る
// - DC。偏った曲線を通すと、波形の平均がずれる(直流が出る)。実機では段のあいだの
//   結合コンデンサが直流を止める。ここでは r にだけ 10Hz の 1 次ハイパスを掛ける。
//   直流は r の中にしか無いので、x には掛けなくてよい
//
// 処理器の名前・処理器のソース・パラメータの決めごとの 3 つを出す。
// 外から何も import しない(sound/ は外部依存ゼロ)。

/** tube の処理器の名前 */
export const TUBE_NODE = 'mmsxx-tube';

/** bias 1 のときに曲線をずらす量。これより大きいと、負の側の伸び(k)が大きくなりすぎる */
const BIAS_MAX = 0.6;

/** 直流を止めるハイパスの周波数(Hz) */
const DC_HZ = 10;

/**
 * 真空管の段。EFFECTS の 1 件と同じ形
 */
export const TUBE_FX = {
  tube: {
    tags: ['saturation', 'vintage'], dev: ['wip'], version: '0.1',
    desc: 'Tube stage. Colours the sound the way one valve stage in old studio gear does. Quiet parts pass at the same level. Louder parts are rounded more on one side than the other, which adds warm even harmonics, the 2nd most of all. Louder still, odd harmonics join in and the sound grows gritty. The clean sound itself is not filtered; only the added harmonics are.',
    params: {
      drive: { live: false, min: 0, max: 1, default: 0.2, desc: 'How hard the stage is pushed. 0 is gentle and only the loudest peaks are touched. Higher values round off quieter parts too and bring in odd harmonics, which sound harder. At 1 the level drops a lot; follow it with a compressor or a limiter to bring it back.' },
      bias: { live: false, min: 0, max: 1, default: 0.5, desc: 'How lopsided the rounding is, like the bias point of a valve. 0 rounds both sides alike, adding only odd harmonics, as saturator does. Higher values round one side earlier and let the other swing a little further, adding more 2nd harmonic, which sounds warmer and fuller.' },
      highcut: { live: false, unit: 'Hz', min: 1000, max: 20000, default: 10000, desc: 'Cutoff of a gentle low-pass on the added harmonics only. Lower values make the added colour darker and smoother; higher values make it brighter and more edgy. The clean sound keeps all its highs.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
};

/**
 * tube の処理器。入口 1 つ、出口 1 つ。モノラルでもステレオでも、左右で別の状態を持つ。
 * processorOptions には、値を埋めたあとのパラメータ(drive・bias・highcut)を渡す。
 *
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const TUBE_CODE = `
const BIAS_MAX = ${BIAS_MAX};
const DC_HZ = ${DC_HZ};
// ln(cosh(v))。大きな v で cosh があふれないよう、|v| を外に出して書く
function lncosh(v) {
  const a = Math.abs(v);
  return a + Math.log1p(Math.exp(-2 * a)) - Math.LN2;
}
class Tube extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const drive = p.drive ?? 0.2, bias = p.bias ?? 0.5, highcut = p.highcut ?? 10000;
    // drive 0〜1 を 0〜24dB に(saturator と同じ割り当て)
    this.g = Math.pow(10, drive * 24 / 20);
    this.c = bias * BIAS_MAX;
    this.t0 = Math.tanh(this.c);
    this.k = 1 / (1 - this.t0 * this.t0);
    this.lc0 = lncosh(this.c);
    // r に掛けるローパス(双一次変換の 1 次)。上限に近すぎるときは掛けない
    this.lp = highcut < 0.49 * sampleRate;
    const K = Math.tan(Math.PI * Math.min(highcut, 0.49 * sampleRate) / sampleRate);
    this.b0 = K / (1 + K);
    this.a1 = (K - 1) / (K + 1);
    // 直流を止める 1 次のハイパス
    this.dcR = Math.exp(-2 * Math.PI * DC_HZ / sampleRate);
    this.st = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  // 曲線が足したぶん r(x) = f(x) - x
  r(x) {
    return this.k * (Math.tanh(this.g * x + this.c) - this.t0) / this.g - x;
  }
  // r の原始関数 R(x)。R(0) = 0
  R(x) {
    const g = this.g;
    return this.k / g * ((lncosh(g * x + this.c) - this.lc0) / g - this.t0 * x) - x * x / 2;
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    const len = out[0].length;
    const b0 = this.b0, a1 = this.a1, lp = this.lp, dcR = this.dcR;
    for (let c = 0; c < out.length; c++) {
      // 左右それぞれの状態。xp・Rp は ADAA の前の値、l1・m1 はローパス、d1・e1 はハイパス
      const s = this.st[c] || (this.st[c] = { xp: 0, Rp: 0, l1: 0, m1: 0, d1: 0, e1: 0 });
      const x = (inp && (inp[c] || inp[0])) || null, y = out[c];
      for (let i = 0; i < len; i++) {
        const v = x ? x[i] : 0;
        const d = v - s.xp;
        const Rv = this.R(v);
        // 差が小さいと割り算が荒れるので、そのときは中点の値で代える
        const a = Math.abs(d) > 1e-6 ? (Rv - s.Rp) / d : this.r((v + s.xp) / 2);
        s.xp = v;
        s.Rp = Rv;
        let w = a;
        if (lp) {
          w = b0 * (a + s.l1) - a1 * s.m1;
          s.l1 = a;
          s.m1 = w;
        }
        const h = w - s.d1 + dcR * s.e1;
        s.d1 = w;
        s.e1 = h;
        y[i] = v + h;
      }
    }
    return true;
  }
}
registerProcessor('${TUBE_NODE}', Tube);
`;
