// ノイズを取るエフェクト(denoise)。全体かチャンネルに掛ける。noisefill の逆。
//
// ---- 何をするか ----
//
// 帯ごとに絞る形(多帯域のエキスパンダー)。遅れは無い。
//
// 1. 元の音を、高さごとに帯に分ける(2 極のバンドパスを並べる)
// 2. 帯ごとに、いまどれくらい鳴っているかを追う
// 3. 帯ごとに、いつも鳴っている底(ノイズ)の大きさを覚える。下がるときはすぐ追い、
//    上がるときは learn 秒かけてゆっくり追う(いちばん小さかったところを覚えておく形)
// 4. 帯の大きさが底に近いとき(threshold dB より下)だけ、その帯を絞って足し合わせる
//
// 帯の分け方は、全部足すとぴったり元の音に戻る形にした。ローパスに通したものと、
// 元の音からそれを引いた残りに分け、残りをまた次のローパスで分ける、を繰り返す。
// 全部の帯が開いているときは、元の音がそのまま出る。
// 最初はバンドパスを並べて、絞るぶんを引いていた。帯を全部足しても元の音に戻らない
// (位相がずれる)ので、全部を閉じても 2.7dB しか消えなかった
//
// 弱いところ。音が鳴っている帯では、音もノイズも通す。消えるのは、音の隙間と、
// 減っていく尾の下のノイズ。鳴っている音の下のノイズまで取るには、細かいスペクトルを
// 見る形が要る。それが sound/fxspectralgate.js で、音が 21ms 遅れる。
// 同じ高さの音を長く鳴らし続けると、底がその音まで上がってきて、音が絞られはじめる。
// learn を長くすると起きにくい(2026-10-24)

/** denoise の処理器の名前 */
export const DENOISE_NODE = 'mmsxx-denoise';

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const DENOISE_FX = {
  denoise: {
    tags: ['noise', 'cleanup'], dev: ['wip'], version: '0.1',
    desc: 'Noise reduction, the opposite of noisefill. The sound is split into bands, and each band learns how loud its steady floor of noise is. When a band drops close to that floor, it is turned down; bands that are playing pass untouched, so the sound itself is not dulled the way a low-pass would dull it. It cleans the gaps between notes and the tails under fading notes, but not the noise underneath a note that is sounding in the same band. It adds no delay.',
    params: {
      amount: { live: false, unit: 'dB', min: 0, max: 40, default: 12, desc: 'How far a band is turned down when only noise is left in it, in dB. 0 does nothing; 12 is a clear clean-up; 30 or more can make the tails sound choked.' },
      threshold: { live: false, unit: 'dB', min: 0, max: 24, default: 9, desc: 'How far above the learned floor a band must rise to count as playing, in dB. Higher values clean more but may also turn down quiet parts of the sound.' },
      bands: { live: false, min: 4, max: 24, default: 12, desc: 'How many bands the sound is split into, rounded to a whole number. More bands follow the sound more closely and cost more.' },
      speed: { live: false, unit: 's', min: 0.005, max: 0.5, default: 0.05, desc: 'Seconds a band takes to open or close, roughly. Short times react to every hit but can flutter; longer times sound smoother.' },
      learn: { live: false, unit: 's', min: 0.5, max: 30, default: 5, desc: 'Seconds the learned floor takes to rise, roughly. It falls at once when the sound gets quieter. Longer times keep long held notes from being mistaken for noise.' },
      low: { live: false, unit: 'Hz', min: 50, max: 8000, default: 200, desc: 'Centre of the lowest band. The bands are spread from here up to 16 kHz, evenly in octaves. Below the lowest band nothing is cleaned.' },
      mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
};

/**
 * denoise の処理器。入口 1 つ、出口 1 つ。チャンネルごとに帯のフィルタと追従を持つ。
 *
 * 帯は、2 極のローパス(バターワース)で切っては残りを次へ回す形で作る。帯の境は、
 * となりあう帯の真ん中のあいだ。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const DENOISE_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(DENOISE_FX.denoise.params).map(([k, v]) => [k, v.default])))};
const TOP = 16000;
// 底の初めの値。最初の大きさをすぐ底として拾えるよう、大きく置いて、下がるほうへ一度で寄せる
const FLOOR_INIT = 1;
const TINY = 1e-9;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const warp = (fc, sr) => Math.tan(Math.PI * Math.min(Math.max(fc, 1), sr * 0.45) / sr);

class Denoise extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    const sr = sampleRate;
    const n = Math.round(v('bands', 4, 24));
    const low = v('low', 50, 8000);
    const top = Math.max(low * 1.5, Math.min(TOP, sr * 0.42));
    const r = Math.pow(top / low, 1 / (n - 1));
    this.n = n;
    // 帯の境 n - 1 か所。2 極のバターワースのローパス
    const k = Math.SQRT2;
    this.k = k;
    this.coef = [];
    for (let i = 0; i < n - 1; i++) {
      const g = warp(low * Math.pow(r, i + 0.5), sr);
      const a1 = 1 / (1 + g * (g + k));
      this.coef.push([a1, g * a1, g * g * a1]);
    }
    // 絞りきったときに残る割合と、開きはじめる大きさ(底からの倍率)
    this.floorGain = Math.pow(10, -v('amount', 0, 40) / 20);
    this.thr = Math.pow(10, v('threshold', 0, 24) / 20);
    const coef = (sec) => 1 - Math.exp(-1 / (sr * sec / 3));
    // 帯の大きさの追従は速く、開け閉めは speed、底の上がりは learn。
    // 底は、なめらかにした大きさ(SMOOTH 秒)で覚える。速い追従の谷まで追うと、
    // ノイズのふだんの揺れがしきい値を越えて開いてしまった
    this.ce = coef(0.005);
    this.cs = coef(0.1);
    this.cg = coef(v('speed', 0.005, 0.5));
    this.cf = coef(v('learn', 0.5, 30));
    this.chans = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  chan(c) {
    const n = this.n;
    return this.chans[c] || (this.chans[c] = {
      s: new Float64Array(n * 2), e: new Float64Array(n), m: new Float64Array(n).fill(FLOOR_INIT),
      fl: new Float64Array(n).fill(FLOOR_INIT), g: new Float64Array(n).fill(1),
    });
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, n = this.n, cf = this.coef;
    const ce = this.ce, cs = this.cs, cg = this.cg, cfl = this.cf, thr = this.thr, lo = this.floorGain;
    for (let ch = 0; ch < out.length; ch++) {
      const st = this.chan(ch);
      const x = inp && (inp[ch] || inp[0]);
      const y = out[ch];
      const s = st.s, e = st.e, m = st.m, fl = st.fl, gs = st.g;
      for (let i = 0; i < len; i++) {
        const xi = x ? x[i] : 0;
        let rest = xi, sum = 0;
        for (let b = 0; b < n; b++) {
          let band;
          if (b < n - 1) {
            // 残りをローパスに通したものがこの帯。引いた残りを次の帯へ回す
            const q = cf[b], j = b * 2;
            const v3 = rest - s[j + 1];
            const v1 = q[0] * s[j] + q[1] * v3;
            const v2 = s[j + 1] + q[1] * s[j] + q[2] * v3;
            s[j] = 2 * v1 - s[j]; s[j + 1] = 2 * v2 - s[j + 1];
            band = v2;
            rest -= band;
          } else {
            band = rest;
          }
          const a = Math.abs(band);
          e[b] += (a - e[b]) * ce;
          // 底。なめらかにした大きさ m を、下がるときはすぐ、上がるときはゆっくり追う
          m[b] += (a - m[b]) * cs;
          if (m[b] < fl[b]) fl[b] = m[b]; else fl[b] += (m[b] - fl[b]) * cfl;
          // 底の thr 倍より上なら開く。その間は、大きさに比例してなめらかに開く
          const ratio = e[b] / (fl[b] * thr + TINY);
          const want = ratio >= 1 ? 1 : lo + (1 - lo) * ratio * ratio;
          gs[b] += (want - gs[b]) * cg;
          sum += gs[b] * band;
        }
        y[i] = sum;
      }
    }
    return true;
  }
}
registerProcessor('${DENOISE_NODE}', Denoise);
`;
