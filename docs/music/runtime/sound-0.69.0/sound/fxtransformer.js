// トランス(音声用の鉄芯トランス)を通した感じを出すエフェクト。
// 古い卓やプリアンプの入出力にある、大きな鉄のトランスのつもり。
//
// ---- 何を真似るか ----
//
// 鉄芯の磁束は、かかった電圧を時間で積分したものになる。同じ大きさの電圧でも、
// 周波数が低いほど 1 周期が長いので、磁束の振れ幅は大きくなる(振れ幅は周波数に
// 反比例する)。鉄芯は磁束が大きくなるほど飽和するので、同じ音量なら低音ほど
// 歪み、高音はほとんどきれいに通る。低音の山が少し丸まり、倍音が加わるので、
// 低音がまとまって太く聞こえる。
//
// 低いほうの端では、巻線のインダクタンスと手前の回路の抵抗とで、ごく低い音が
// 少しずつ届かなくなる(結合の損失)。高いほうの端では、漏れインダクタンスと
// 巻線の容量とで高音が丸まる。どちらも弱く入れてある。
//
// ---- どう計算するか ----
//
// 1. 入口に 1 次のハイパス(low)。結合の損失のつもり。直流もここで止まる
// 2. 1 次のローパス(freq)で低い帯 L を取り出す。L は磁束の代わり。
//    freq より下では L は入口とほぼ同じ大きさで、上では 1/f で小さくなる。
//    本物の磁束は全帯域で 1/f だが、freq より下を平らにしたのは近似。
//    こうすると、どこまで低くしても飽和の強さが上がり続けない
// 3. L を tanh の近い形で丸め、丸めたぶんの差(sat(L) - L)だけを入口に足す。
//    小さい音では差がほぼ 0 なので、入口がそのまま出る(全帯域で倍率 1)。
//    本物は丸まった磁束を微分して電圧に戻すが、ここでは差を微分しない。
//    微分すると高い倍音ほど持ち上がるが、そのぶんは入れていない(近似)。
//    曲線は左右対称なので、出る倍音は奇数次(3 次、5 次…)。ヒステリシスは
//    入れていない
// 4. 出口に 2 次のローパス(high、Q は 0.707 で山なし)。高音の丸まりのつもり。
//    本物は少し山を持つことが多いが、山は入れていない
//
// 積分の代わりのローパスは減衰するので、磁束が溜まり続けて飛ぶことはない。
// 曲線は振れ幅を 1/g で頭打ちにするので、出口の大きさも入口で決まる上限を持つ。
//
// フィルタは sound/filter.js と同じ TPT(遅れのない形)で書いた。
// 処理器は外から何も引かない。sound/filter.js の FILTER_CORE も引かずに、
// 要るものだけここに書いた。

/** トランスの処理器の名前 */
export const TRANSFORMER_NODE = 'mmsxx-transformer';

/** 値の形は sound/fx.js の EFFECTS と同じ */
export const TRANSFORMER_FX = {
  transformer: {
    tags: ['saturation', 'vintage'], dev: ['wip'], version: '0.1',
    desc: 'Audio transformer. Sounds as if the tune went through the big iron transformers of a vintage console. The iron saturates more on low notes than on high ones, so the bass is gently rounded and thickened while the highs pass almost clean. Quiet sounds pass unchanged. It only adds odd harmonics, and the very lowest and very highest edges of the range are softened slightly.',
    params: {
      drive: { live: false, min: 0, max: 1, default: 0.3, desc: 'How hard the iron is pushed. 0 is clean. Around 0.3 loud bass is slightly rounded and fuller. At 1 even moderate bass is squashed and grows thick and fuzzy, while the highs stay clean.' },
      freq: { live: false, unit: 'Hz', min: 20, max: 1000, default: 120, desc: 'Below this frequency the iron saturates fully. Above it the saturation fades quickly: an octave higher the added harmonics are roughly 14 to 18 dB quieter. Low values affect only the deep bass. Higher values reach into the low mids and make the whole sound heavier.' },
      low: { live: false, unit: 'Hz', min: 2, max: 80, default: 10, desc: 'The very lowest notes fade below this frequency, as the transformer cannot pass them fully. At the default it removes only rumble and DC. Raise it for a tighter, thinner bass.' },
      high: { live: false, unit: 'Hz', min: 2000, max: 20000, default: 20000, desc: 'The highs are softened above this frequency. At 20000 it is barely heard. Lower values give a darker, smoother top, like an older or cheaper transformer.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
};

/**
 * トランスの処理器。入口 1 つ、出口 1 つ。チャンネルごとに状態を持つ。
 *
 * 値は作るときに渡す(processorOptions、範囲に寄せて埋めたもの)。
 * 変えるときは作り直す。要らなくなったら port へ { stop: true } を送る
 * (sound/filter.js と同じ)
 */
export const TRANSFORMER_CODE = `
// drive 1 のときの曲線の傾きの係数。振れ幅 1/g あたりから強く丸まる
const G_MAX = 4;
// これより小さい g は曲線を通さない(g → 0 で曲線は x に近づくので、音は飛ばない)
const G_MIN = 1e-4;
// これより小さい状態は 0 にする(非正規化数で遅くならないように)
const TINY = 1e-20;

// tanh の近い形(パデ近似)。|u| <= 3 で tanh との差は 0.025 以内で、
// u = 3 で値が 1、傾きが 0 になるので、そこから外は 1 で止めてつながる。
// Math.tanh より軽い
const soft = (u) => {
  if (u >= 3) return 1;
  if (u <= -3) return -1;
  const u2 = u * u;
  return u * (27 + u2) / (27 + 9 * u2);
};

// カットオフを tan の引数に直す。ナイキストの手前で止める(tan が発散する)
const warp = (fc, sr) => Math.tan(Math.PI * Math.min(Math.max(fc, 1), sr * 0.45) / sr);

class Transformer extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const sr = sampleRate;
    this.g = G_MAX * Math.min(1, Math.max(0, p.drive ?? 0.3));
    // 1 次の TPT の係数 G = g / (1 + g)
    const gl = warp(p.low ?? 10, sr), gf = warp(p.freq ?? 120, sr);
    this.Gl = gl / (1 + gl);
    this.Gf = gf / (1 + gf);
    // 2 次の SVF(k = 2 * 0.707)。high がナイキストの手前で止まるので、
    // 44.1kHz で 20000 を指すと、実際には 19845Hz で切っている
    const gh = warp(p.high ?? 20000, sr), k = Math.SQRT2;
    this.a1 = 1 / (1 + gh * (gh + k));
    this.a2 = gh * this.a1;
    this.a3 = gh * this.a2;
    this.chans = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0] || [], out = outputs[0];
    const g = this.g, on = g > G_MIN, ig = on ? 1 / g : 0;
    const Gl = this.Gl, Gf = this.Gf, a1 = this.a1, a2 = this.a2, a3 = this.a3;
    for (let c = 0; c < out.length; c++) {
      const s = this.chans[c] || (this.chans[c] = { hp: 0, lp: 0, ic1: 0, ic2: 0 });
      const x = inp[c] || inp[0];
      const y = out[c];
      let hp = s.hp, lp = s.lp, ic1 = s.ic1, ic2 = s.ic2;
      for (let i = 0; i < y.length; i++) {
        // 1. 結合の損失。1 次のローパスを引いてハイパスにする
        const xi = x ? x[i] : 0;
        const vl = (xi - hp) * Gl;
        const lo = vl + hp;
        hp = lo + vl;
        const v = xi - lo;
        // 2. 磁束の代わり。減衰する積分(1 次のローパス)
        const vf = (v - lp) * Gf;
        const L = vf + lp;
        lp = L + vf;
        // 3. 鉄芯の飽和。丸めたぶんの差だけを足す
        const w = on ? v + (soft(g * L) * ig - L) : v;
        // 4. 高音の丸まり。2 次の SVF のローパス
        const v3 = w - ic2;
        const v1 = a1 * ic1 + a2 * v3;
        const v2 = ic2 + a2 * ic1 + a3 * v3;
        ic1 = 2 * v1 - ic1;
        ic2 = 2 * v2 - ic2;
        y[i] = v2;
      }
      if (Math.abs(hp) < TINY) hp = 0;
      if (Math.abs(lp) < TINY) lp = 0;
      if (Math.abs(ic1) < TINY) ic1 = 0;
      if (Math.abs(ic2) < TINY) ic2 = 0;
      s.hp = hp; s.lp = lp; s.ic1 = ic1; s.ic2 = ic2;
    }
    return true;
  }
}
registerProcessor('${TRANSFORMER_NODE}', Transformer);
`;
