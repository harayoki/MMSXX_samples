// 粒がぶつかる音(シェイカー)。
//
// ---- なぜ粒を 1 つずつ計算しないか ----
//
// マラカスの中には種が数十粒入っていて、振るたびに互いにぶつかる。
// 1 粒ずつ運動を解くのは実時間に乗らないし、乗せても聞き分けられない。
// 聞こえているのは「いつぶつかるか」と「1 回の当たりの音」と「胴の鳴り」で、
// そこだけ作れば足りる(Perry Cook の PhISEM。docs/physmodel/phisem.md)。
//
// ---- 当たりは、雑音ではなく力のパルス ----
//
// 最初は Cook と同じく、当たりを雑音の粒として出していた。楽器に聞こえなかった。
// 当たりそのものに体が無かったためで、直したのはそこ(2026-10-22)。
//
// 固いものが当たっているあいだは、接触の力が半分の正弦の形で立って落ちる。
// 当たっている時間を τ とすると、力の中身は 1/τ あたりから上が落ちていく。
// だから τ が音の明るさを決める。種のように軽くて固いものは τ が 0.1ms より短く、
// 2kHz より上まで出る。柔らかいものや重いものは τ が長く、低いところだけが出る
// (太鼓のばちで測られているのは 5〜7ms。docs/physmodel/japan.md)。
//
// ---- 胴はモードの束 ----
//
// 力のパルスを、減衰する共振器の束へ入れる。瓢箪(ひょうたん)でも竹でも金属でも、
// 鳴るのは固有振動で、整数比にはならない。比と減衰の時間を楽器ごとに持つ。
// 共振器 1 台だと帯域の色がつくだけで、物が鳴っている感じにならない。
//
// 粒がすべる音(ざわざわ)も、同じ胴を通す。実際に鳴っているのは胴なので、
// 雑音を別に出すより、当たりと同じ入り口へ入れるほうが筋が通る。
//
// ---- 作り ----
//
//   e *= 減り                        振りのエネルギーが減る
//   もし 当たった なら                 確率は 1 秒あたりの数から出す
//     力のパルスを書き込む             半分の正弦。長さ τ、大きさはばらつく
//   入り口 += 雑音 × e × ざわざわ      すべる音
//   out = モードの束(入り口)           比と減衰を持つ共振器を足す
//
// 重さは共振器の数しだいで、モード 4 本ならフィルタ 4 台ぶん。
//
// ---- MML から ----
//
// 音符の頭でエネルギーを入れる。長く書くとそのあいだ入れ続ける(`pump`)。
// 短い音符は一振り、長い音符は振り続ける。
// 高さ(`o4c` からの比)はモードの周波数に掛かる。同じ楽器の小さいものになる。
//
// ---- まだ合わせていない ----
//
// 数はどれも物の理屈から置いた見当で、録音に寄せて測ったものではない。
// 次にやるのはそこ(金管やスラップベースと同じやり方)。

/** MML で `#voice` から作ったパッチ。既定の楽器とは分けて持つ */
const MML_PATCHES = {};

import { registerShaker, registerVoiceDetail, registerVoiceSyntax, sealPresets } from './mml.js';
import { registerChipKind } from './audio.js';

export const SHAKER_NODE = 'mmsxx-shaker';

/** 1 つのノードが同時に持てる声の数。打楽器なので重なりは短い */
export const SHAKER_VOICES = 8;

/** 胴のモードの数の上限。増やすとそのまま重くなる */
export const SHAKER_MODES = 4;

/** モードの周波数を書いたとおりに鳴らす高さ(o4c)。ここからの比で動く */
const BASE_FREQ = 261.6255653;

/**
 * パッチのパラメータ。`live` は鳴っている音の途中で動かして効くか。
 * 声は鳴りはじめのパッチを持ち続けるので、どれも効かない(次の音から効く)。
 * 既定の値はここに持たない。楽器ごとに違うので、パッチ(`SHAKER_PATCHES`)が持つ。
 *
 * 胴のモードの表(`modes`)は、つまみではなくパッチのデータとして持つ。
 * 書き方は `[比, 大きさ, 減衰の倍率]` の並び。
 */
export const SHAKER_PARAMS = {
  rate: { live: false, min: 2, max: 12000, unit: '/s',
    desc: 'How many collisions happen per second while the shake is at full strength. A few dozen are heard as separate ticks; a few thousand blur into a hiss.' },
  impact: { live: false, min: 0, max: 1,
    desc: 'How much of the stroke lands as one collective hit at the very start, when every particle slams into the wall together. This is what makes a shaker sound struck rather than merely rustling.' },
  contact: { live: false, min: 0.00002, max: 0.005, unit: 's',
    desc: 'How long one particle stays in contact with the shell. It sets the brightness: a hard seed touches for well under a tenth of a millisecond and excites everything up to several kHz, while something soft and heavy only pushes the low modes.' },
  spread: { live: false, min: 0, max: 1,
    desc: 'How unevenly hard the collisions are. 0 makes every hit the same strength, which sounds mechanical; near 1 a few hits stand out, as loose grains do.' },
  decay: { live: false, min: 0.01, max: 4, unit: 's',
    desc: 'How long one shake keeps producing collisions. Short values give a single tick, long ones a sustained rattle.' },
  freq: { live: false, min: 80, max: 14000, unit: 'Hz',
    desc: 'Frequency of the first body mode at o4c. The other modes follow it by the ratios in the patch. Playing higher notes raises them all, as if the body were smaller.' },
  ring: { live: false, min: 0.001, max: 4, unit: 's',
    desc: 'How long the first body mode rings (to -60 dB). Wood and gourd stop within a few tens of milliseconds; metal rings for most of a second.' },
  rustle: { live: false, min: 0, max: 1,
    desc: 'The sound of particles sliding rather than striking: noise fed through the same body, as loud as the shake is strong.' },
  regular: { live: false, min: 0, max: 1,
    desc: 'How evenly the collisions are spaced. 0 is random, which sounds like loose grains; 1 is a steady rate, which sounds like a stick being dragged across notches.' },
  pump: { live: false, min: 0, max: 1,
    desc: 'How much energy a held note keeps feeding in. 0 is one shake and it dies away; 1 keeps the rattle going for the whole note.' },
  level: { live: false, min: 0, max: 4,
    desc: 'Output level of the voice.' },
};

/**
 * 楽器の値。`modes` は胴の固有振動で、`[比, 大きさ, 減衰の倍率]`。
 * 比は 1 本目を 1 とする。整数比にしない(物は整数比で鳴らない)。
 * `range` はその楽器で意味のある範囲(聞く道具のつまみが動く幅)。
 *
 * **数はどれも物の理屈から置いた見当で、録音に寄せて測ったものではない。**
 */
export const SHAKER_PATCHES = {
  maraca: {
    desc: 'Maraca. Dry seeds in a gourd: a dense burst of very short, hard contacts over a body that stops almost at once.',
    dev: ['wip'],
    devNote: 'マラカス。制作中。物の理屈から数を置いただけで、録音と比べていない。「全部楽器とは思えない」と言われた段階。作りは直してあり、残りは数合わせ(引き継ぎの覚え書きより)',
    rate: 900, impact: 0.6, contact: 0.00006, spread: 0.7, decay: 0.13,
    freq: 2300, ring: 0.012, rustle: 0.25, regular: 0, pump: 0.3, level: 0.025,
    modes: [[1, 1, 1], [1.43, 0.8, 0.8], [2.07, 0.55, 0.6], [3.12, 0.3, 0.45]],
    range: { rate: [200, 3000], impact: [0.2, 1], contact: [0.00003, 0.0003], spread: [0.3, 1],
      decay: [0.05, 0.4], freq: [1200, 4000], ring: [0.005, 0.05], rustle: [0, 0.6],
      regular: [0, 0.3], pump: [0, 0.8], level: [0.009, 0.062] },
  },
  cabasa: {
    desc: 'Cabasa. Steel beads dragged over a ribbed cylinder: the hardest and shortest contacts of the family, almost a click each.',
    dev: ['wip'],
    devNote: 'カバサ。制作中。録音と比べていない。粒の当たりがいちばん短く、カチカチに寄りすぎていないか聞き直す',
    rate: 2600, impact: 0.5, contact: 0.00003, spread: 0.5, decay: 0.09,
    freq: 5200, ring: 0.006, rustle: 0.35, regular: 0.3, pump: 0.3, level: 0.024,
    modes: [[1, 1, 1], [1.61, 0.7, 0.8], [2.43, 0.45, 0.6], [0, 0, 0]],
    range: { rate: [800, 8000], impact: [0.15, 0.9], contact: [0.00002, 0.0002], spread: [0.2, 0.9],
      decay: [0.04, 0.25], freq: [3000, 9000], ring: [0.003, 0.03], rustle: [0, 0.8],
      regular: [0, 0.7], pump: [0, 0.8], level: [0.008, 0.06] },
  },
  sekere: {
    desc: 'Sekere. A net of large beads around a gourd: fewer, heavier contacts and a lower body than a maraca.',
    dev: ['wip'],
    devNote: 'シェケレ。制作中。録音と比べていない。マラカスとの違い(粒が大きく少ない、胴が低い)が聞き分けられるか確かめていない',
    rate: 320, impact: 0.75, contact: 0.00018, spread: 0.85, decay: 0.2,
    freq: 1500, ring: 0.022, rustle: 0.2, regular: 0, pump: 0.35, level: 0.013,
    modes: [[1, 1, 1], [1.52, 0.75, 0.85], [2.31, 0.5, 0.6], [3.44, 0.28, 0.4]],
    range: { rate: [60, 1200], impact: [0.3, 1], contact: [0.00008, 0.0008], spread: [0.4, 1],
      decay: [0.08, 0.6], freq: [800, 2600], ring: [0.01, 0.08], rustle: [0, 0.5],
      regular: [0, 0.3], pump: [0, 0.8], level: [0.005, 0.033] },
  },
  bamboo: {
    desc: 'Bamboo wind chimes. A handful of tubes knocking together, each ringing at a pitch of its own for a long time.',
    dev: ['wip'],
    devNote: '竹の風鈴。制作中。録音と比べていない。管ごとの高さと、鳴り残りの長さは見当',
    rate: 11, impact: 0.35, contact: 0.0006, spread: 0.9, decay: 1.1,
    freq: 1150, ring: 0.42, rustle: 0.03, regular: 0, pump: 0.6, level: 0.014,
    modes: [[1, 1, 1], [2.78, 0.6, 0.7], [5.4, 0.3, 0.5], [8.9, 0.12, 0.35]],
    range: { rate: [3, 50], impact: [0.1, 0.8], contact: [0.0002, 0.002], spread: [0.5, 1],
      decay: [0.4, 3], freq: [600, 2400], ring: [0.15, 1.2], rustle: [0, 0.2],
      regular: [0, 0.2], pump: [0, 1], level: [0.005, 0.035] },
  },
  sleighBells: {
    desc: 'Sleigh bells. Small metal bells that keep ringing after the hand stops, with several high modes well out of tune with each other.',
    dev: ['wip'],
    devNote: 'そり鈴。制作中。録音と比べていない。金属の鳴り残りと、高い山どうしのずれ方は見当',
    rate: 95, impact: 0.85, contact: 0.00005, spread: 0.7, decay: 0.28,
    freq: 2550, ring: 0.55, rustle: 0.05, regular: 0, pump: 0.5, level: 0.029,
    modes: [[1, 1, 1], [2.11, 0.8, 0.9], [3.47, 0.5, 0.75], [5.21, 0.3, 0.6]],
    range: { rate: [25, 300], impact: [0.3, 1], contact: [0.00002, 0.0002], spread: [0.3, 1],
      decay: [0.1, 1], freq: [1500, 4000], ring: [0.2, 1.5], rustle: [0, 0.2],
      regular: [0, 0.3], pump: [0, 1], level: [0.01, 0.073] },
  },
  tambourine: {
    desc: 'Tambourine jingles, without the head. Pairs of metal discs slapping against each other.',
    dev: ['wip'],
    devNote: 'タンバリンの鈴だけ(皮は無い)。制作中。録音と比べていない。皮を叩く音は別に要る',
    rate: 70, impact: 0.9, contact: 0.00004, spread: 0.6, decay: 0.2,
    freq: 2400, ring: 0.3, rustle: 0.05, regular: 0, pump: 0.4, level: 0.028,
    modes: [[1, 1, 1], [2.34, 0.9, 0.85], [4.12, 0.6, 0.7], [6.3, 0.3, 0.55]],
    range: { rate: [20, 250], impact: [0.4, 1], contact: [0.00002, 0.0002], spread: [0.2, 0.9],
      decay: [0.08, 0.8], freq: [1400, 3600], ring: [0.1, 0.8], rustle: [0, 0.2],
      regular: [0, 0.3], pump: [0, 1], level: [0.01, 0.07] },
  },
  guiro: {
    desc: 'Guiro. A stick dragged across notches, so the contacts come at an even rate instead of at random, each one longer than a bead strike.',
    dev: ['wip'],
    devNote: 'ギロ。制作中。録音と比べていない。当たる間隔をそろえた(regular 1)だけで、こする速さの変化は無い',
    rate: 190, impact: 0.25, contact: 0.0004, spread: 0.3, decay: 0.5,
    freq: 1700, ring: 0.03, rustle: 0.3, regular: 1, pump: 1, level: 0.023,
    modes: [[1, 1, 1], [1.84, 0.7, 0.8], [2.93, 0.4, 0.6], [0, 0, 0]],
    range: { rate: [40, 600], impact: [0, 0.6], contact: [0.0002, 0.0015], spread: [0, 0.6],
      decay: [0.1, 1.5], freq: [1000, 3500], ring: [0.01, 0.1], rustle: [0, 0.7],
      regular: [0.6, 1], pump: [0.5, 1], level: [0.008, 0.057] },
  },
  jawbone: {
    desc: 'Jawbone rattle (quijada). Loose teeth in a dry bone: a few hard, uneven contacts over a hollow body whose modes are far from any harmonic series.',
    dev: ['wip'],
    devNote: 'キハーダ(ロバの下あご)。制作中。録音と比べていない。ウルトラQの音で挙がったもの。骨の胴の高さは見当',
    rate: 34, impact: 0.95, contact: 0.00012, spread: 1, decay: 0.4,
    freq: 850, ring: 0.075, rustle: 0.08, regular: 0, pump: 0.25, level: 0.014,
    modes: [[1, 1, 1], [1.66, 0.8, 0.85], [2.74, 0.55, 0.7], [4.1, 0.3, 0.5]],
    range: { rate: [8, 140], impact: [0.4, 1], contact: [0.00005, 0.0005], spread: [0.5, 1],
      decay: [0.15, 1.2], freq: [500, 1800], ring: [0.03, 0.2], rustle: [0, 0.3],
      regular: [0, 0.4], pump: [0, 0.7], level: [0.005, 0.035] },
  },
  waterDrop: {
    desc: 'Water drops. A few sharp high contacts, each one ringing briefly at its own pitch.',
    dev: ['wip'],
    devNote: '水滴。制作中。録音と比べていない。粒ごとの高さの変わり方(しずくの「ポチャ」)はまだ無い',
    rate: 5, impact: 0.3, contact: 0.00008, spread: 0.9, decay: 0.8,
    freq: 4200, ring: 0.1, rustle: 0.02, regular: 0, pump: 0.5, level: 0.061,
    modes: [[1, 1, 1], [1.31, 0.5, 0.8], [0, 0, 0], [0, 0, 0]],
    range: { rate: [2, 25], impact: [0.1, 0.7], contact: [0.00003, 0.0004], spread: [0.5, 1],
      decay: [0.3, 2], freq: [2500, 8000], ring: [0.04, 0.4], rustle: [0, 0.2],
      regular: [0, 0.2], pump: [0, 1], level: [0.021, 0.152] },
  },
};

/**
 * パッチを、処理器が読む平らな形へ畳む。
 * モードの表は `[比, 大きさ, 減衰の倍率]` を `SHAKER_MODES` 本ぶんに切り、
 * 比が 0 のものは使わない。
 */
export function compileShaker(def) {
  const d = def || {};
  const num = (k) => {
    const p = SHAKER_PARAMS[k];
    const v = Number(d[k]);
    if (!Number.isFinite(v)) return p.min;
    return Math.max(p.min, Math.min(p.max, v));
  };
  const modes = [];
  for (let i = 0; i < SHAKER_MODES; i++) {
    const m = (d.modes || [])[i] || [];
    const ratio = Math.max(0, Math.min(40, Number(m[0]) || 0));
    if (!ratio) continue;
    modes.push([ratio,
      Math.max(0, Math.min(1, Number(m[1]) == null ? 1 : Number(m[1]))),
      Math.max(0.05, Math.min(4, Number(m[2]) || 1))]);
  }
  if (!modes.length) modes.push([1, 1, 1]);
  return {
    rate: num('rate'), impact: num('impact'), contact: num('contact'), spread: num('spread'),
    decay: num('decay'), freq: num('freq'), ring: num('ring'), rustle: num('rustle'),
    regular: num('regular'), pump: num('pump'), level: num('level'), modes,
  };
}

export const SHAKER_CODE = `
const V = ${SHAKER_VOICES};
const M = ${SHAKER_MODES};
const B = 128;
const TAU = Math.PI * 2;
const BASE = ${BASE_FREQ};
/** 力のパルスを書き込む輪。いちばん長い接触(5ms)が 48kHz で収まる長さ */
const RING = 256;

/** 声の持ち物(平らな配列の中の位置) */
const ON = 0, E = 1, HOLD = 2, EDEC = 3, PROB = 4, PUMP = 5,
  SPREAD = 6, REG = 7, LVL = 8, PHASE = 9, STEP = 10, GONE = 11,
  PLEN = 12, RUST = 13, NMODE = 14, WPOS = 15,
  MA1 = 16, MA2 = MA1 + M, MG = MA2 + M, MY1 = MG + M, MY2 = MY1 + M;
const W = MY2 + M;

class ShakerBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.voice = new Float64Array(V * W);
    // 力のパルスを足し込む輪。声ごとに 1 本
    this.exc = new Float64Array(V * RING);
    this.patch = p.patches || {};
    this.events = [];
    this.at = 0;
    this.seed = 0x9e3779b9;
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

  /** 0〜1 の乱数。種から回すので、焼くたびに同じ音になる */
  rnd() {
    let x = this.seed;
    x ^= x << 13; x >>>= 0;
    x ^= x >> 17;
    x ^= x << 5; x >>>= 0;
    this.seed = x;
    return x / 4294967296;
  }

  /** 空いている声を取る。全部ふさがっていたら、いちばん弱いものを取り上げる */
  pick() {
    const vo = this.voice;
    let worst = 0, worstE = Infinity;
    for (let v = 0; v < V; v++) {
      if (!vo[v * W + ON]) return v;
      if (vo[v * W + E] < worstE) { worstE = vo[v * W + E]; worst = v; }
    }
    return worst;
  }

  /**
   * 当たりを 1 回書き込む。力は半分の正弦で、長さは接触の時間。
   * 大きさは spread でばらつかせる(粒の重さと当たり方の違い)
   */
  bang(v, amp, len) {
    const exc = this.exc;
    const base = v * RING;
    const at = this.voice[v * W + WPOS];
    const n = Math.max(1, len | 0);
    for (let i = 0; i < n; i++) {
      exc[base + ((at + i) % RING)] += amp * Math.sin(Math.PI * (i + 0.5) / n);
    }
  }

  start(ev, sr) {
    const d = this.patch[ev.p];
    if (!d) return;
    const v = this.pick();
    const o = v * W;
    const vo = this.voice;
    for (let i = 0; i < W; i++) vo[o + i] = 0;
    for (let i = 0; i < RING; i++) this.exc[v * RING + i] = 0;
    const vel = Math.max(0, Math.min(1, ev.v == null ? 0.8 : ev.v));
    // 高さはモードに掛かる。o4c で書いたとおり
    const scale = ev.f > 0 ? ev.f / BASE : 1;
    const modes = d.modes || [[1, 1, 1]];
    let n = 0;
    for (let i = 0; i < modes.length && i < M; i++) {
      const f = Math.min(sr * 0.45, Math.max(20, d.freq * modes[i][0] * scale));
      // 減衰は t60。1 サンプルあたりの半径にする
      const t60 = Math.max(0.001, d.ring * modes[i][2]);
      const r = Math.min(0.99995, Math.exp(-6.9078 / (t60 * sr)));
      const w = TAU * f / sr;
      vo[o + MA1 + n] = 2 * r * Math.cos(w);
      vo[o + MA2 + n] = r * r;
      // 入り口は力のパルスなので、インパルスで振幅 1 になるよう sin w を掛ける
      // (2 極の共振器にインパルスを入れると r^n sin((n+1)w) / sin w が出る)。
      // (1 - r^2) sin w のほうは、ずっと鳴らしたときの山を 1 にする正規化で、
      // 叩く音に使うと長く鳴るモードが何千分の 1 になる(2026-10-22)
      vo[o + MG + n] = Math.sin(w) * modes[i][1];
      n++;
    }
    vo[o + NMODE] = n;
    vo[o + EDEC] = Math.exp(-6.9078 / Math.max(1, d.decay * sr));
    vo[o + PROB] = Math.min(1, d.rate / sr);
    vo[o + STEP] = Math.min(1, d.rate / sr);
    vo[o + PUMP] = d.pump;
    vo[o + SPREAD] = d.spread;
    vo[o + REG] = d.regular;
    vo[o + RUST] = d.rustle;
    vo[o + PLEN] = Math.max(1, Math.round(d.contact * sr));
    vo[o + LVL] = d.level * (0.25 + 0.75 * vel);
    vo[o + E] = vel;
    vo[o + HOLD] = currentTime + Math.max(0, ev.d == null ? 0 : ev.d);
    vo[o + ON] = 1;
    // 頭の一撃。振り出しは粒がまとまって壁に当たるので、当たりが 1 回に重なる。
    // これが無いと、振っているだけの音になって楽器に聞こえない
    if (d.impact > 0) this.bang(v, d.impact * vel * 8, vo[o + PLEN]);
  }

  render(v, out, sr, t0) {
    const vo = this.voice;
    const exc = this.exc;
    const o = v * W, eb = v * RING;
    const edec = vo[o + EDEC], prob = vo[o + PROB], spread = vo[o + SPREAD];
    const reg = vo[o + REG], lvl = vo[o + LVL], rust = vo[o + RUST];
    const plen = vo[o + PLEN] | 0;
    const n = vo[o + NMODE] | 0;
    const feed = vo[o + PUMP] * (1 - edec);
    const hold = vo[o + HOLD];
    let e = vo[o + E], ph = vo[o + PHASE], pos = vo[o + WPOS] | 0;
    const step = vo[o + STEP];
    let ring = 0;
    for (let i = 0; i < B; i++) {
      e *= edec;
      if (t0 + i / sr < hold) e += feed;
      // 当たったか。regular が 1 なら等間隔、0 ならばらばら
      let hit = false;
      if (reg > 0) {
        ph += step;
        if (ph >= 1) { ph -= 1; hit = true; }
      }
      // 弱くなるほど当たりが減る。終わりぎわに粒がばらける
      if (reg < 1 && this.rnd() < prob * Math.min(1, e * 2.5)) hit = true;
      else if (hit && reg < 1 && this.rnd() > reg) hit = false;
      if (hit) {
        // 当たりの強さ。spread が大きいほど、まれに強いものが混じる
        const r = this.rnd();
        this.bang(v, e * (1 - spread + spread * r * r * 3), plen);
      }
      // すべる音。雑音を同じ入り口へ入れて、胴を通す
      let x = exc[eb + pos];
      exc[eb + pos] = 0;
      pos = (pos + 1) % RING;
      if (rust > 0) x += (this.rnd() * 2 - 1) * e * rust * 0.5;
      let y = 0;
      for (let m = 0; m < n; m++) {
        const yy = vo[o + MG + m] * x + vo[o + MA1 + m] * vo[o + MY1 + m]
          - vo[o + MA2 + m] * vo[o + MY2 + m];
        vo[o + MY2 + m] = vo[o + MY1 + m];
        vo[o + MY1 + m] = yy;
        y += yy;
      }
      ring = Math.abs(y) > ring ? Math.abs(y) : ring;
      out[i] += y * lvl;
    }
    vo[o + E] = e; vo[o + PHASE] = ph; vo[o + WPOS] = pos;
    // 鳴り終わったら声を返す。エネルギーも胴の鳴りも消えていること
    if (e < 1e-6 && ring < 1e-7 && t0 >= hold) {
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
    for (let v = 0; v < V; v++) if (vo[v * W + ON]) this.render(v, out, sr, t0);
    if (this.cutAt >= 0) {
      const len = Math.max(1, Math.round(sr * 0.01));
      for (let i = 0; i < out.length; i++) {
        out[i] *= Math.max(0, 1 - this.cutAt / len);
        this.cutAt++;
      }
      if (this.cutAt >= len) { vo.fill(0); this.exc.fill(0); this.cutAt = -1; }
    }
    for (let c = 1; c < chs.length; c++) chs[c].set(out);
    return this.alive;
  }
}
registerProcessor('${SHAKER_NODE}', ShakerBank);
`;

/** パッチの定義を、処理器が読む形へ畳む */
function patchesOf(table) {
  const out = {};
  for (const [k, d] of Object.entries(table)) out[k] = compileShaker(d);
  return out;
}

/**
 * シェイカーの音符を、常駐の処理器へ渡す形にする。
 *
 * 強さは 0〜1 で渡す(振りの勢い)。長さは、振り続ける時間として渡す。
 * つないだ音(タイ)は 1 つの音として渡す。叩き直さないため
 */
function shakerEvent(ev, wf, freq, amp, t0, t1) {
  if (ev.legato) return null;
  return {
    t: t0, p: wf.patch, f: freq,
    v: Math.max(0, Math.min(1, (ev.vol ?? 0) / 15)),
    d: Math.max(0, (ev.tieSpan ?? (t1 - t0)) - 0.01),
  };
}

/** 処理器の登録に渡すもの。出口は 1 本 */
export const SHAKER_CHIP = {
  kind: 'shaker',
  node: SHAKER_NODE,
  code: SHAKER_CODE,
  voices: SHAKER_VOICES,
  event: shakerEvent,
  options: (list) => ({ numberOfInputs: 0, outputChannelCount: [1],
    processorOptions: { events: list, patches: patchesOf({ ...SHAKER_PATCHES, ...MML_PATCHES }) } }),
  extra: () => patchesOf(MML_PATCHES),
};

registerChipKind(SHAKER_CHIP.kind, SHAKER_CHIP);

// 音色として並べる。名前は作り分けの形(`shaker::maraca`)。
// 家族の名前は音の種類で付ける決まりなので、作り方の名前(phisem)は使わない
for (const [name, def] of Object.entries(SHAKER_PATCHES)) {
  // 作っている最中の印(dev)も渡す。音色の一覧で、仕上がったものと分けて見られる
  registerShaker(`shaker::${name}`, { patch: name }, { role: 'perc', desc: def.desc, dev: def.dev, devNote: def.devNote });
}

// `#voice` で数を書き換えて作る(`@shaker{ maraca, rate 400, impact 0.9 }`)。
// 元にする楽器を 1 つ選んで、触るつまみだけ書く
registerVoiceSyntax('shaker', (name, tree, opts = {}) => {
  const head = `[ChpTnSnd] MML: 音色 "${name}" の @shaker`;
  const names = Object.keys(SHAKER_PATCHES);
  const first = tree[0];
  if (!first || first.value !== null) {
    throw new Error(`${head} は、最初に元にする楽器の名前を書きます(${names.join(' ')})`);
  }
  const base = SHAKER_PATCHES[first.key];
  if (!base) {
    throw new Error(`${head} の "${first.key}" という楽器はありません(${names.join(' ')})`);
  }
  const def = { ...base };
  delete def.range;
  const seen = new Set();
  for (const it of tree.slice(1)) {
    const p = SHAKER_PARAMS[it.key];
    if (!p) {
      throw new Error(`${head} に "${it.key}" はありません`
        + `(書けるのは ${Object.keys(SHAKER_PARAMS).join(' ')})`);
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
  registerShaker(name, { patch }, { role: opts.role ?? 'perc', overwrite: true, desc: base.desc, dev: base.dev, devNote: base.devNote });
}, { tree: true });

// 分けて読み込んでも、エンジンのプリセットとして並ぶようにする
sealPresets();

// 道具の画面へ、つまみの一覧を渡す
registerVoiceDetail('shaker', (wf) => {
  const def = MML_PATCHES['#' + wf.name] || SHAKER_PATCHES[wf.patch];
  if (!def) return null;
  const params = {};
  for (const [k, p] of Object.entries(SHAKER_PARAMS)) {
    params[k] = { ...p, value: def[k], ...(def.range && def.range[k] ? { range: def.range[k] } : {}) };
  }
  return { patch: wf.patch, params, modes: def.modes };
});
