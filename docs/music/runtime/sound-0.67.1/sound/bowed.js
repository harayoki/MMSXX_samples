// 弓で弾く弦(擦弦)。胡弓のための音源。
//
// ---- 何をしているか ----
//
// 弓と弦のあいだの摩擦が、弦を引っかけては離す(スティックスリップ)。
// 擦弦の音の芯はこれで、鳴り続けるのも、弓の速さと押しつけで音が変わるのも、ここから出る
// (docs/physmodel/bowed.md)。
//
// 作りは STK の `Bowed`(Perry Cook。MIT 相当)と同じ形。弦を遅れ線 2 本にして、
// 弓の当たるところでつなぐ。
//
//   上駒 ←── 遅れ線(弓から上駒)──→ 弓 ←── 遅れ線(弓から駒)──→ 駒 → 胴
//
// 両端では向きが逆になって返る。駒の側は、返るたびに高いところから減る(1 極のローパス)。
// 弓のところで、弓の速さと弦の速さの差を見て、摩擦の表から力を引き、両方の遅れ線へ足す。
//
// ---- 摩擦の表 ----
//
// 表は配列にせず、数式で持つ(1 枚の JS が太らないように)。STK の `BowTable` と同じ式。
//
//   f(Δv) = min(1, (|(Δv + offset) × slope| + 0.75)^−4)
//
// 速さの差が小さいうちは 1 に近く(弓が弦をつかんでいる。スティック)、
// 差が開くと急に落ちる(すべる。スリップ)。押しつけ(pressure)は slope にあたり、
// 押しつけが強いほど、すべりはじめるまでの幅が広い。
//
// 弾塑性の摩擦(履歴のあるもの)や有限差分は使わない。1 本で CPU 6% の桁なので、
// 実時間で重ねるものではない(bowed.md の「数字」)。
//
// ---- 胴 ----
//
// 胡弓の胴は皮を張った小さな箱で、三味線に近い。鼻にかかった明るい音は皮の共振から来る。
// 共振器を数本並べて、駒から出た音に掛ける。並べたものは鳴らし続ける音に掛かるので、
// 山の高さが 1 になるように (1 − r²) sin ω で揃える(叩く音の sin ω ではない)。
//
// ---- MML から ----
//
// 音符の頭で弓を当て、音符の長さだけ弾き続け、終わりで弓を離す。離したあとは、弦が自分の損失で消える。
// 強さ(v)は弓の速さにあたる。タイでつないだ音は弓を返さない。高さの違う続き(スラー `c&e`)は、
// 弓を返さずに押さえる指だけを動かす。`@m` のビブラートと `*` のポルタメントも効く。
//
// ---- まだ合わせていない ----
//
// 数はどれも物の理屈と STK の値から置いた見当で、録音に寄せて測ったものではない。

/** MML で `#voice` から作ったパッチ。既定の楽器とは分けて持つ */
const MML_PATCHES = {};

import { registerBowed, registerVoiceDetail, registerVoiceSyntax, sealPresets, VIB_SPEED } from './mml.js';
import { registerChipKind } from './audio.js';
import { TONE_FRAME } from './tones.js';

export const BOWED_NODE = 'mmsxx-bowed';

/** 1 つのノードが同時に持てる声の数。弓で弾く楽器は重ねても数本 */
export const BOWED_VOICES = 4;

/** 胴の共振の数の上限 */
export const BOWED_MODES = 4;

/**
 * パッチのパラメータ。`live` は鳴っている音の途中で動かして効くか。
 * 声は鳴りはじめのパッチを持ち続けるので、どれも効かない(次の音から効く)。
 * 既定の値はここに持たない。楽器ごとに違うので、パッチ(`BOWED_PATCHES`)が持つ。
 *
 * 胴の共振の表(`body`)は、つまみではなくパッチのデータとして持つ。
 * 書き方は `[Hz, 大きさ, Q]` の並び。
 */
export const BOWED_PARAMS = {
  pressure: { live: false, min: 0, max: 1,
    desc: 'How hard the bow presses on the string. Too light and the string slips all the time, giving a thin, airy tone; too heavy and it cannot let go cleanly, so the tone turns raw and scratchy.' },
  position: { live: false, min: 0.02, max: 0.4,
    desc: 'Where the bow touches the string, as a share of its length from the bridge. Close to the bridge is bright and edgy; further out is softer and rounder.' },
  speed: { live: false, min: 0.02, max: 0.5,
    desc: 'How fast the bow moves at the loudest note (velocity 15). Softer notes draw it more slowly. Faster is louder and fuller.' },
  attack: { live: false, min: 0.005, max: 1, unit: 's',
    desc: 'How long the bow takes to reach full speed at the start of a note.' },
  release: { live: false, min: 0.01, max: 2, unit: 's',
    desc: 'How long the bow takes to leave the string at the end of a note. After that the string rings on by itself.' },
  noise: { live: false, min: 0, max: 0.5,
    desc: 'Grit in the bow hair: random jitter in the bow speed. A little makes the tone breathe; a lot makes it hiss.' },
  loss: { live: false, min: 0.8, max: 0.999,
    desc: 'How much of the wave comes back each time it reflects from the bridge. Lower values damp the string, so it stops quickly once the bow leaves.' },
  bright: { live: false, min: 0, max: 0.95,
    desc: 'How quickly the high harmonics are lost at the bridge. 0 keeps them all; higher values make the string darker, as with a soft or heavily wound string.' },
  dry: { live: false, min: 0, max: 1,
    desc: 'How much of the string goes out without passing the body. The rest is coloured by the body resonances.' },
  level: { live: false, min: 0, max: 8,
    desc: 'Output level of the voice.' },
};

/**
 * 楽器の値。`body` は胴の共振で、`[Hz, 大きさ, Q]`。
 * `range` はその楽器で意味のある範囲(聞く道具のつまみが動く幅)。
 *
 * 数はどれも物の理屈と STK の値から置いた見当で、録音に寄せて測ったものではない。
 */
export const BOWED_PATCHES = {
  kokyu: {
    desc: 'Kokyu, the Japanese bowed lute. A thin silk-like string over a small body covered with skin, much like a shamisen played with a bow: nasal, bright and a little rough, with strong resonances in the upper mids. Made from the physics, not fitted to recordings.',
    dev: ['wip'],
    // 弓の押しつけと位置、損失は STK の Bowed の既定に近いところ(2026-10-26)。
    // 胴は皮の箱なので、木の胴(バイオリン)より山が高く、狭い。
    // 600Hz あたりに皮の 1 本目、1.2kHz と 2.6kHz に鼻にかかった山を置いた。どれも見当
    pressure: 0.55, position: 0.11, speed: 0.22, attack: 0.07, release: 0.12,
    noise: 0.06, loss: 0.97, bright: 0.45, dry: 0.35, level: 0.6,
    body: [[620, 1, 9], [1240, 0.8, 11], [2600, 0.55, 7], [380, 0.35, 5]],
    range: { pressure: [0.2, 0.9], position: [0.04, 0.25], speed: [0.08, 0.4], attack: [0.02, 0.3],
      release: [0.05, 0.5], noise: [0, 0.2], loss: [0.9, 0.995], bright: [0.2, 0.8],
      dry: [0, 0.8], level: [0.2, 1.2] },
  },
};

/**
 * パッチを、処理器が読む平らな形へ畳む。
 * 胴の表は `[Hz, 大きさ, Q]` を `BOWED_MODES` 本ぶんに切り、Hz が 0 のものは使わない。
 */
export function compileBowed(def) {
  const d = def || {};
  const num = (k) => {
    const p = BOWED_PARAMS[k];
    const v = Number(d[k]);
    if (!Number.isFinite(v)) return p.min;
    return Math.max(p.min, Math.min(p.max, v));
  };
  const body = [];
  for (let i = 0; i < BOWED_MODES; i++) {
    const m = (d.body || [])[i] || [];
    const f = Math.max(0, Math.min(16000, Number(m[0]) || 0));
    if (!f) continue;
    body.push([Math.max(20, f), Math.max(0, Math.min(4, Number(m[1]) || 0)), Math.max(0.5, Math.min(100, Number(m[2]) || 5))]);
  }
  const out = { body };
  for (const k of Object.keys(BOWED_PARAMS)) out[k] = num(k);
  return out;
}

export const BOWED_CODE = `
const V = ${BOWED_VOICES};
const M = ${BOWED_MODES};
const B = 128;
const TAU = Math.PI * 2;
const LN1000 = 6.907755278982137;
/** 遅れ線の長さ。20Hz の弦が収まる */
const DL = Math.ceil(sampleRate / 20) + 8;

/** 声の持ち物(平らな配列の中の位置) */
const ON = 0, BV = 1, CT = 2, HOLD = 3, VMAX = 4, ATK = 5, REL = 6, SLOPE = 7,
  BETA = 8, LOSS = 9, POLE = 10, LP = 11, NOISE = 12, DRY = 13, LVL = 14,
  FA = 15, FB = 16, GK = 17, GL = 18, VD = 19, VR = 20, VDL = 21, VPH = 22, AGE = 23,
  TIE = 24, W = 25, GONE = 26, NB = 27, GW = 28, BA1 = 29, BA2 = BA1 + M, BG = BA2 + M, BY1 = BG + M, BY2 = BY1 + M;
const WV = BY2 + M;

class BowedBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.voice = new Float64Array(V * WV);
    // 遅れ線。声ごとに 2 本(弓から上駒、弓から駒)
    this.line = new Float64Array(V * 2 * DL);
    this.patch = p.patches || {};
    this.events = [];
    this.at = 0;
    this.seed = 0x2545f491;
    this.cutAt = -1;
    for (const ev of p.events || []) this.events.push(ev);
    this.events.sort((a, b) => a.t - b.t);
    this.alive = true;
    this.port.onmessage = (e) => {
      // 片付けの合図。つないでいない処理器も、true を返すあいだ回り続けるので、
      // 外しただけでは止まらない(sound/filter.js と同じ決めごと)
      if (e.data && e.data.stop) { this.alive = false; return; }
      const m = e.data || {};
      if (m.patches) for (const k in m.patches) this.patch[k] = m.patches[k];
      if (m.events) {
        for (const ev of m.events) this.events.push(ev);
        this.events.sort((a, b) => a.t - b.t);
        this.at = 0;
        while (this.at < this.events.length && this.events[this.at].t < currentTime) this.at++;
      }
      if (m.cut) this.cutAt = 0;
    };
  }

  /** -1〜1 の乱数。種から回すので、焼くたびに同じ音になる */
  rnd() {
    let x = this.seed;
    x ^= x << 13; x >>>= 0;
    x ^= x >> 17;
    x ^= x << 5; x >>>= 0;
    this.seed = x;
    return x / 2147483648 - 1;
  }

  /** 空いている声を取る。全部ふさがっていたら、いちばん古いものを取り上げる */
  pick() {
    const vo = this.voice;
    let old = 0, oldAge = -1;
    for (let v = 0; v < V; v++) {
      if (!vo[v * WV + ON]) return v;
      if (vo[v * WV + AGE] > oldAge) { oldAge = vo[v * WV + AGE]; old = v; }
    }
    return old;
  }

  /** 高さを動かす。いまの高さから、wait サンプル待って、n サンプルかけて f へ */
  glide(v, f, n, wait = 0) {
    const vo = this.voice, o = v * WV;
    const k = Math.max(0, Math.min(1, (vo[o + GK] - vo[o + GW]) / Math.max(1, vo[o + GL])));
    vo[o + FA] = vo[o + FA] * Math.pow(vo[o + FB] / vo[o + FA], k);
    vo[o + FB] = f;
    vo[o + GK] = 0;
    vo[o + GW] = Math.max(0, wait);
    vo[o + GL] = Math.max(1, n);
  }

  start(ev, sr) {
    const vo = this.voice;
    // スラーの続き。弓を返さずに、押さえる指だけを動かす(30 ミリ秒で移る)
    if (ev.sl != null) {
      for (let v = 0; v < V; v++) {
        const o = v * WV;
        if (vo[o + ON] && vo[o + TIE] === ev.sl + 1) { this.glide(v, ev.f, 0.03 * sr); return; }
      }
      return;
    }
    const d = this.patch[ev.p];
    if (!d || !(ev.f > 0)) return;
    const v = this.pick();
    const o = v * WV;
    for (let i = 0; i < WV; i++) vo[o + i] = 0;
    this.line.fill(0, v * 2 * DL, (v + 1) * 2 * DL);
    const vel = Math.max(0, Math.min(1, ev.v == null ? 0.8 : ev.v));
    vo[o + ON] = 1;
    vo[o + TIE] = ev.tie != null ? ev.tie + 1 : 0;
    vo[o + HOLD] = currentTime + Math.max(0, ev.d == null ? 0.5 : ev.d);
    // 弓の速さ。弱い音でも止まらないよう、下に 1 割残す(STK は 0.03 + 0.2 × 強さ)
    vo[o + VMAX] = d.speed * (0.15 + 0.85 * vel);
    vo[o + ATK] = 1 - Math.exp(-LN1000 / 3 / Math.max(1, d.attack * sr));
    vo[o + REL] = 1 - Math.exp(-LN1000 / 3 / Math.max(1, d.release * sr));
    // 押しつけ。表の傾き(slope)にあたる。STK は 5 から 1 へ動かすが、それだと弓の速さを変えたときに
    // 鳴り方まで変わった(同じ押しつけで強く弾くと、基音が抜けた細い音になる)。
    // まともに鳴る押しつけの幅は、弓の速さに比例して動く(Schelleng)。だから傾きを速さで割り、
    // 押しつけは「速さに対してどれだけ押すか」として持つ。強さ(v)は大きさだけを変える。
    // 傾き × 速さを 0.6(押しつけ 0)から 0.03(押しつけ 1)まで、対数で動かす。
    // 弓の位置 0.11 で測ると、0 ではすべってばかりで基音が出ず、大きさも半分の細い音になる。
    // 0.3 から上は 220〜1320Hz のどれも素直に鳴る(のこぎり波の形。2026-10-26)。
    // 駒に寄せる(position 0.04)と、強い側で弓が弦をつかんだまま離さず、音が止まる
    vo[o + SLOPE] = 0.6 * Math.pow(0.05, d.pressure) / Math.max(1e-4, vo[o + VMAX]);
    vo[o + BETA] = d.position;
    vo[o + LOSS] = d.loss;
    vo[o + POLE] = d.bright;
    vo[o + NOISE] = d.noise;
    vo[o + DRY] = d.dry;
    vo[o + LVL] = d.level;
    vo[o + FA] = ev.f; vo[o + FB] = ev.f; vo[o + GK] = 1; vo[o + GL] = 1;
    // ポルタメント(*)。gw 秒待って、gs 半音を gl 秒かけて
    if (ev.gs) this.glide(v, ev.f * Math.pow(2, ev.gs / 12), (ev.gl || 0.1) * sr, (ev.gw || 0) * sr);
    // ビブラート(@m)。深さ(セント)・速さ(Hz)・遅れ(秒)
    if (ev.vb) { vo[o + VD] = ev.vb[0]; vo[o + VR] = ev.vb[1]; vo[o + VDL] = ev.vb[2] * sr; }
    // 胴の共振。鳴らし続ける音に掛かるので、山の高さが 1 になるよう (1 - r^2) sin w で揃える
    const body = d.body || [];
    let nb = 0;
    for (let i = 0; i < body.length && i < M; i++) {
      const f = Math.min(sr * 0.45, body[i][0]);
      const w = TAU * f / sr;
      const r = Math.exp(-Math.PI * f / body[i][2] / sr);
      vo[o + BA1 + nb] = 2 * r * Math.cos(w);
      vo[o + BA2 + nb] = r * r;
      vo[o + BG + nb] = (1 - r * r) * Math.sin(w) * body[i][1];
      nb++;
    }
    vo[o + NB] = nb;
  }

  render(v, out, sr, t0) {
    const vo = this.voice, ln = this.line;
    const o = v * WV;
    const neck = v * 2 * DL, bridge = neck + DL;
    const vmax = vo[o + VMAX], atk = vo[o + ATK], rel = vo[o + REL], slope = vo[o + SLOPE];
    const beta = vo[o + BETA], loss = vo[o + LOSS], pole = vo[o + POLE], nz = vo[o + NOISE];
    const dry = vo[o + DRY], lvl = vo[o + LVL], hold = vo[o + HOLD], nb = vo[o + NB] | 0;
    const vd = vo[o + VD], vr = vo[o + VR], vdl = vo[o + VDL];
    let bv = vo[o + BV], ct = vo[o + CT], lp = vo[o + LP], w = vo[o + W] | 0;
    let gk = vo[o + GK], vph = vo[o + VPH], age = vo[o + AGE];
    const fa = vo[o + FA], fb = vo[o + FB], gl = vo[o + GL], gw = vo[o + GW];
    // 高さは塊の頭で 1 回決める。ビブラートとポルタメントの動きは 128 サンプルより十分ゆっくり
    let f = fa * Math.pow(fb / fa, Math.max(0, Math.min(1, (gk - gw) / gl)));
    if (vd > 0 && age > vdl) {
      // 揺れは遅れのあと 0.2 秒かけて深くなる
      const ramp = Math.min(1, (age - vdl) / (0.2 * sr));
      f *= Math.pow(2, vd * ramp * Math.sin(vph) / 1200);
    }
    // 1 周の遅れ。駒で返るときのローパスのぶんだけ、遅れ線を短くする
    const wf = TAU * f / sr;
    const lag = Math.atan2(pole * Math.sin(wf), 1 - pole * Math.cos(wf)) / wf;
    const L = Math.max(4, Math.min(2 * DL - 8, sr / f - lag));
    const lb = Math.max(1, L * beta), lnk = Math.max(1, L - lb);
    const ib = lb | 0, fbr = lb - ib, inn = lnk | 0, fnk = lnk - inn;
    let peak = 0;
    for (let i = 0; i < B; i++) {
      // 弓。音符のあいだは速さを上げて当て続け、終わったら離す
      if (t0 + i / sr < hold) { bv += (vmax - bv) * atk; ct += (1 - ct) * atk; }
      else { bv -= bv * rel; ct -= ct * rel; }
      // 遅れ線の先を読む(端数はまっすぐつなぐ)
      const rb = w - ib, rn = w - inn;
      const xb = ln[bridge + ((rb + DL) % DL)] * (1 - fbr) + ln[bridge + ((rb - 1 + DL) % DL)] * fbr;
      const xn = ln[neck + ((rn + DL) % DL)] * (1 - fnk) + ln[neck + ((rn - 1 + DL) % DL)] * fnk;
      // 駒で返る。高いところから減り、向きが逆になる
      lp = (1 - pole) * xb + pole * lp;
      const fromBridge = -lp * loss;
      // 上駒で返る。向きが逆になるだけ
      const fromNut = -xn;
      // 弓のところの弦の速さと、弓の速さの差。差から摩擦の表を引く
      const dv = bv * (1 + nz * this.rnd()) - (fromBridge + fromNut);
      let fr = Math.abs((dv + 0.001) * slope) + 0.75;
      fr = 1 / (fr * fr * fr * fr);
      if (fr > 1) fr = 1;
      const nv = dv * fr * ct;
      ln[neck + w] = fromBridge + nv;
      ln[bridge + w] = fromNut + nv;
      w = w + 1 === DL ? 0 : w + 1;
      // 駒に届いた波が胴を鳴らす
      let y = xb * dry;
      for (let m = 0; m < nb; m++) {
        const yy = vo[o + BG + m] * xb + vo[o + BA1 + m] * vo[o + BY1 + m] - vo[o + BA2 + m] * vo[o + BY2 + m];
        vo[o + BY2 + m] = vo[o + BY1 + m];
        vo[o + BY1 + m] = yy;
        y += yy;
      }
      out[i] += y * lvl;
      const a = y < 0 ? -y : y;
      if (a > peak) peak = a;
    }
    gk += B; age += B; vph += TAU * vr * B / sr;
    if (vph > TAU) vph -= TAU;
    vo[o + BV] = bv; vo[o + CT] = ct; vo[o + LP] = lp; vo[o + W] = w;
    vo[o + GK] = gk; vo[o + VPH] = vph; vo[o + AGE] = age;
    // 弓が離れて、弦も消えたら、声を返す
    if (t0 >= hold && ct < 1e-4 && peak < 1e-6) {
      vo[o + GONE]++;
      if (vo[o + GONE] > 2) vo[o + ON] = 0;
    } else vo[o + GONE] = 0;
  }

  process(inputs, outputs) {
    const chs = outputs[0];
    const out = chs[0];
    out.fill(0);
    const sr = sampleRate;
    const t0 = currentTime;
    const tEnd = t0 + B / sr;
    const vo = this.voice;
    while (this.at < this.events.length && this.events[this.at].t < tEnd) {
      this.start(this.events[this.at++], sr);
    }
    for (let v = 0; v < V; v++) if (vo[v * WV + ON]) this.render(v, out, sr, t0);
    if (this.cutAt >= 0) {
      const len = Math.max(1, Math.round(sr * 0.01));
      for (let i = 0; i < out.length; i++) {
        out[i] *= Math.max(0, 1 - this.cutAt / len);
        this.cutAt++;
      }
      if (this.cutAt >= len) { vo.fill(0); this.line.fill(0); this.cutAt = -1; }
    }
    for (let c = 1; c < chs.length; c++) chs[c].set(out);
    return this.alive;
  }
}
registerProcessor('${BOWED_NODE}', BowedBank);
`;

/** パッチの定義を、処理器が読む形へ畳む */
function patchesOf(table) {
  const out = {};
  for (const [k, d] of Object.entries(table)) out[k] = compileBowed(d);
  return out;
}

/** `@m` の揺れ。書いたもの(vib)が無ければ深さだけ(vibrato)。無ければ null */
function bowedVib(ev) {
  const depth = ev.vib ? ev.vib.depth : ev.vibrato;
  if (!(depth > 0)) return null;
  return [depth, ev.vib && ev.vib.speed != null ? ev.vib.speed : VIB_SPEED,
    ev.vib && ev.vib.delay > 0 ? ev.vib.delay * TONE_FRAME : 0];
}

/**
 * 弓で弾く音符を、常駐の処理器へ渡す形にする。
 *
 * 強さは 0〜1 で渡す(弓の速さ)。長さは、弓を当てている時間として渡す。
 * つないだ音(タイ)は 1 つの音として渡す。弓を返さないため。
 * 高さの違う続き(スラー)は、鳴っている弦の高さだけを変える(`sl`)
 */
function bowedEvent(ev, wf, freq, amp, t0, t1) {
  if (ev.legato) {
    if (ev.tieId == null) return null;
    return { t: t0, p: wf.patch, f: freq, sl: ev.tieId };
  }
  return {
    t: t0, p: wf.patch, f: freq,
    v: Math.max(0, Math.min(1, (ev.vol ?? 0) / 15)),
    d: Math.max(0.001, ev.tieSpan ?? (t1 - t0)),
    ...(ev.tieId != null ? { tie: ev.tieId } : {}),
    // ポルタメント(`c*g`)。待ち(glideAt)と滑る長さ(glideFor)は MML が決める。チップの道と同じ読み方
    ...(ev.glide > 0 ? {
      gs: 12 * Math.log2(ev.glide / ev.freq),
      gw: ev.glideAt > 0 ? ev.glideAt : 0,
      gl: ev.glideFor > 0 ? ev.glideFor : Math.max(0.01, (ev.gate ?? (t1 - t0)) - (ev.glideAt > 0 ? ev.glideAt : 0)),
    } : {}),
    ...(bowedVib(ev) ? { vb: bowedVib(ev) } : {}),
  };
}

/** 処理器の登録に渡すもの。出口は 1 本 */
export const BOWED_CHIP = {
  kind: 'bowed',
  node: BOWED_NODE,
  code: BOWED_CODE,
  voices: BOWED_VOICES,
  event: bowedEvent,
  options: (list) => ({ numberOfInputs: 0, outputChannelCount: [1],
    processorOptions: { events: list, patches: patchesOf({ ...BOWED_PATCHES, ...MML_PATCHES }) } }),
  extra: () => patchesOf(MML_PATCHES),
};

registerChipKind(BOWED_CHIP.kind, BOWED_CHIP);

// 音色として並べる。名前は作り分けの形(`bowed::kokyu`)。
// 家族の名前は音の種類で付ける決まりなので、作り方の名前(waveguide)は使わない
for (const [name, def] of Object.entries(BOWED_PATCHES)) {
  // 作っている最中の印(dev)も渡す。音色の一覧で、仕上がったものと分けて見られる
  registerBowed(`bowed::${name}`, { patch: name }, { role: 'lead', desc: def.desc, dev: def.dev });
}

// `#voice` で数を書き換えて作る(`@bowed{ kokyu, pressure 0.8 }`)。
// 元にする楽器を 1 つ選んで、触るつまみだけ書く
registerVoiceSyntax('bowed', (name, tree, opts = {}) => {
  const head = `[ChpTnSnd] MML: 音色 "${name}" の @bowed`;
  const names = Object.keys(BOWED_PATCHES);
  const first = tree[0];
  if (!first || first.value !== null) {
    throw new Error(`${head} は、最初に元にする楽器の名前を書きます(${names.join(' ')})`);
  }
  const base = BOWED_PATCHES[first.key];
  if (!base) {
    throw new Error(`${head} の "${first.key}" という楽器はありません(${names.join(' ')})`);
  }
  const def = { ...base };
  delete def.range;
  const seen = new Set();
  for (const it of tree.slice(1)) {
    const p = BOWED_PARAMS[it.key];
    if (!p) {
      throw new Error(`${head} に "${it.key}" はありません`
        + `(書けるのは ${Object.keys(BOWED_PARAMS).join(' ')})`);
    }
    if (seen.has(it.key)) throw new Error(`${head} に ${it.key} が 2 度書いてあります`);
    seen.add(it.key);
    if (typeof it.value !== 'number') throw new Error(`${head} の ${it.key} は数で書きます`);
    // 範囲の外は丸めずに止める。黙って端へ寄せると、書いた値で鳴っていないことに気づけない
    if (it.value < p.min || it.value > p.max) {
      throw new Error(`${head} の ${it.key} ${it.value} は範囲の外です`
        + `(${p.min}〜${p.max}${p.unit ? ' ' + p.unit : ''})`);
    }
    def[it.key] = it.value;
  }
  const patch = '#' + name;
  MML_PATCHES[patch] = def;
  registerBowed(name, { patch }, { role: opts.role ?? 'lead', overwrite: true, desc: base.desc, dev: base.dev });
}, { tree: true });

// 分けて読み込んでも、エンジンのプリセットとして並ぶようにする
sealPresets();

// 道具の画面へ、つまみの一覧を渡す
registerVoiceDetail('bowed', (wf) => {
  const def = MML_PATCHES['#' + wf.name] || BOWED_PATCHES[wf.patch];
  if (!def) return null;
  const params = {};
  for (const [k, p] of Object.entries(BOWED_PARAMS)) {
    params[k] = { ...p, value: def[k], ...(def.range && def.range[k] ? { range: def.range[k] } : {}) };
  }
  return { patch: wf.patch, params, body: def.body };
});
