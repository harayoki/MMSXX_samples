// ファズ。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 60〜70 年代のイタリア映画のサントラで鳴っている、ファズギターの音を狙った。
// saturator や tube よりずっと強く歪ませ、波形がほとんど四角になるまで潰す。
// 手順は 3 つ。
//
// 1. 大きく持ち上げる(`drive`。0 で +6dB、1 で +54dB)
// 2. 上と下で違う形に強く切る(`bias`)。上は tanh で 1 に張り付く。下は bias が大きいほど
//    浅いところで切れ、丸く潰れる。bias 0 で上下同じ形
// 3. 高いほうを削る(`tone`。2 極のローパス、Q 0.71)。強く切った音は耳に痛い高い倍音が多いので、
//    ファズのペダルのトーンと同じく、そこを丸める
//
// 1 と 2 は 2 回に分けてくり返す。1 回目は 18dB まで持ち上げて切り、直流を抜いて(20Hz の 1 極のハイパス。
// ペダルの段のあいだのコンデンサーにあたる)、残りを持ち上げて同じ形でもう一度切る。
// 1 回で切りきると、上下の高さが違うだけの四角になる。直流を抜くと上下同じ四角に戻り、偶数次の倍音が消える。
// 2 回に分けると、1 回目の上下の丸まり方の違いが、直流を抜いたときに 0 を横切るところをずらすので、
// 2 回目の四角の上と下の幅が変わる。220Hz の正弦を入れて、bias 1 で 2 倍音が基音の -18dB ほど、
// 上の幅が 46% ほどになった。bias 0 では偶数次の倍音は出ない。最後にもう一度直流を抜く(10Hz)
//
// 切るところの折り返しは、1 次の ADAA(反微分で割った差)で減らす。tube と同じ考え方。
// 上下の形は、上が tanh、下が L tanh(x / L)(L は 1 - 0.7 bias)。2 回とも同じ形。どちらも 0 で傾き 1、
// 反微分は log cosh なので、0 のところで滑らかにつながる。
//
// 実機のファズ(Maestro FZ-1 や Tone Bender)の回路をなぞったものではない。手順はユーザーのメモに従い、
// 数は耳で決める前の見当

/** fuzz の処理器の名前 */
export const FUZZ_NODE = 'mmsxx-fuzz';

/** drive 0 と 1 のときの持ち上げ(dB) */
export const FUZZ_GAIN_DB = [6, 54];

/** 1 回目に持ち上げる上限(dB)。残りは 2 回目 */
export const FUZZ_STAGE1_DB = 18;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const FUZZ_FX = {
  fuzz: {
    tags: ['saturation', 'vintage'], dev: ['wip'], version: '0.1',
    desc: 'Fuzz, as on the fuzz guitars of Italian film scores of the sixties and seventies. Much harder than saturator or tube: the sound is lifted a long way, clipped hard into a near square wave, the top and the bottom in different shapes, and then darkened with a tone control. Clipping this hard makes even quiet notes come out almost as loud as loud ones.',
    params: {
      drive: { live: true, min: 0, max: 1, default: 0.7, desc: 'How far the sound is lifted before it is clipped: 0 adds 6 dB, 1 adds 54 dB. Around 0.3 it still growls; from 0.6 up it is a buzzing near square wave that sustains.' },
      bias: { live: true, min: 0, max: 1, default: 0.4, desc: 'How differently the top and the bottom of the wave are clipped. 0 clips both alike. Higher values clip the bottom lower and softer, which adds even harmonics and a thicker, spitting edge.' },
      tone: { live: true, unit: 'Hz', min: 500, max: 12000, default: 3000, desc: 'Cutoff of a low-pass after the clipping. Lower values take the fizz off the top and sound woollier; higher values are raspy and bright.' },
      level: { live: true, unit: 'dB', min: -40, max: 6, default: -12, desc: 'Output level, in dB. The clipped sound is near full scale whatever goes in, so it is turned down by default.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is fuzz, from 0 (the dry sound alone) to 1 (the fuzz alone).' },
    },
  },
};

/**
 * fuzz の処理器。入口 1 つ、出口 1 つ。チャンネルごとに状態を持つ。
 * AudioParam は定義の 5 つ全部(k-rate)。作るときの値は processorOptions にも入れる
 * (AudioParam を受けないところで回しても、その値で鳴るように)。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const FUZZ_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(FUZZ_FX.fuzz.params).map(([k, v]) => [k, v.default])))};
const RANGE = ${JSON.stringify(Object.fromEntries(Object.entries(FUZZ_FX.fuzz.params).map(([k, v]) => [k, [v.min, v.max]])))};
const GDB = ${JSON.stringify(FUZZ_GAIN_DB)};
const NAMES = Object.keys(DEF);
const STAGE1 = ${FUZZ_STAGE1_DB};
const DC1 = 20, DC2 = 10;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// log cosh。大きな x でも桁があふれない形。|x| が 9 を越えたら残りは 1e-8 より小さいので省く
const lc = (x) => { const a = Math.abs(x); return a > 9 ? a - Math.LN2 : a + Math.log1p(Math.exp(-2 * a)) - Math.LN2; };

class Fuzz extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return NAMES.map((n) => ({ name: n, defaultValue: DEF[n], minValue: RANGE[n][0], maxValue: RANGE[n][1], automationRate: 'k-rate' }));
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.v0 = {};
    for (const n of NAMES) this.v0[n] = clamp(Number.isFinite(p[n]) ? p[n] : DEF[n], RANGE[n][0], RANGE[n][1]);
    this.st = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs, params) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length;
    const v = (n) => (params && params[n] ? clamp(params[n][0], RANGE[n][0], RANGE[n][1]) : this.v0[n]);
    const drive = v('drive'), bias = v('bias'), tone = v('tone'), mix = v('mix');
    const level = Math.pow(10, v('level') / 20);
    // 持ち上げは 2 回に分ける。1 回目は STAGE1 dB まで(drive に比例)、残りを 2 回目で
    const gdb = GDB[0] + drive * (GDB[1] - GDB[0]);
    const g1 = Math.pow(10, Math.min(gdb, STAGE1) / 20), g2 = Math.pow(10, Math.max(0, gdb - STAGE1) / 20);
    const L = 1 - 0.7 * bias, L2 = L * L;
    // 形と、その反微分
    const f = (u) => (u >= 0 ? Math.tanh(u) : L * Math.tanh(u / L));
    const F = (u) => (u >= 0 ? lc(u) : L2 * lc(u / L));
    // トーンのローパス(2 極、Simper の SVF)
    const sr = sampleRate;
    const tg = Math.tan(Math.PI * Math.min(tone, sr * 0.45) / sr), tk = Math.SQRT2;
    const a1 = 1 / (1 + tg * (tg + tk)), a2 = tg * a1, a3 = tg * a2;
    // 直流を抜く 1 極のハイパス。1 回目と 2 回目のあいだ(DC1)と、2 回目のあと(DC2)
    const d1 = 1 - 2 * Math.PI * DC1 / sr, d2 = 1 - 2 * Math.PI * DC2 / sr;
    for (let ch = 0; ch < out.length; ch++) {
      const x = inp && (inp[ch] || inp[0]);
      const y = out[ch];
      if (!x) { y.fill(0); continue; }
      if (mix === 0) { y.set(x); continue; }
      // [1 回目の前の u と F(u)、2 回目の前の u と F(u)、あいだの直流の x1 y1、あとの直流の x1 y1、SVF の ic1 ic2]
      const s = this.st[ch] || (this.st[ch] = new Float64Array(10));
      let pu = s[0], pF = s[1], qu = s[2], qF = s[3], ax = s[4], ay = s[5], bx = s[6], by = s[7], ic1 = s[8], ic2 = s[9];
      for (let i = 0; i < len; i++) {
        // 1 回目。ADAA(反微分の差を、入口の差で割る)
        const u = g1 * x[i];
        const Fu = F(u);
        const du = u - pu;
        const c = Math.abs(du) > 1e-6 ? (Fu - pF) / du : f(0.5 * (u + pu));
        pu = u; pF = Fu;
        ay = c - ax + d1 * ay; ax = c;
        // 2 回目。あいだで直流を抜いたので、上下で形が違うと 0 を横切るところがずれ、四角の上と下の幅が変わる
        const w = g2 * ay;
        const Fw = F(w);
        const dw = w - qu;
        const e = Math.abs(dw) > 1e-6 ? (Fw - qF) / dw : f(0.5 * (w + qu));
        qu = w; qF = Fw;
        by = e - bx + d2 * by; bx = e;
        const v3 = by - ic2;
        const v1 = a1 * ic1 + a2 * v3;
        const v2 = ic2 + a2 * ic1 + a3 * v3;
        ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2;
        y[i] = x[i] * (1 - mix) + v2 * level * mix;
      }
      s[0] = pu; s[1] = pF; s[2] = qu; s[3] = qF; s[4] = ax; s[5] = ay; s[6] = bx; s[7] = by; s[8] = ic1; s[9] = ic2;
    }
    return true;
  }
}
registerProcessor('${FUZZ_NODE}', Fuzz);
`;
