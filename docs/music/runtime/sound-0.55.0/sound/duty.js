// **デューティ比の表**(矩形波の幅を 1 フレームごとに動かす)。
//
// ---- なぜワークレットが要るか ----
//
// **音量と高さは「つまみ」だが、幅は「形」。**
//
// | | 何で動かしているか | 鳴っている最中に |
// | --- | --- | --- |
// | 音量 | 音量つまみ(`gain`) | 動かせる |
// | 高さ | 高さつまみ(`frequency`) | 動かせる |
// | **幅** | **つまみが無い。波の形そのもの** | **動かせない** |
//
// 矩形波の幅は `PeriodicWave`(倍音の一覧)として発振器に渡していて、
// **これは載せた時点で焼き付く**。載せ直しても効かず、**例外も出ない**
// (2026-08-31 に測った。docs/ENGINE_TODO.md に経緯がある)。
//
// 逃げ道は 3 つ試して、どれも駄目だった —
// 1 フレームごとに音を作り直す(継ぎ目が鳴る)、
// のこぎり波 2 本の差(遅らせる量を変えると遅延の中身が飛ぶ)、
// PCM に焼く(表の周期と波の周期が噛み合わず輪にできない)。
//
// **中で 1 サンプルずつ書けば、幅はただの変数になる。**
//
// ---- 4 オペ FM で分かったことをそのまま使う ----
//
// **常駐 1 個で全部の声を回す。** 音ごとに節を作ると、作り捨ての手間だけで
// 実時間の 2.65 倍かかって鳴らせない(`sound/ym2151.js` の頭)。
//
// ---- 表を読むのはこちらではない ----
//
// 高さ・音量・幅は**フレームごとの数字の並びにして、鳴らす側が渡す**。
// 表を読む決めごと(`readTable` の戻る位置、`psgSnap` の階段への丸め)は
// `sound/tones.js` と `sound/audio.js` にあるものが 1 つきり。
// **ここに写すと、片方だけ直したときに音が食い違う。**
// こちらの仕事は**幅の変わる矩形波を作ること**だけ。

import { TONE_FRAME } from './tones.js';

/**
 * 処理器の中身(文字列から作るのでファイルは増えない)。
 *
 * 音符は**作るときにまとめて渡す**。港へ流す手もあるが、
 * 書き出し(OfflineAudioContext)は待ってくれないので、
 * 届く前に計算が終わってしまう。**渡してから作る**のが確実。
 */
export const DUTY_CODE = `
const FRAME = ${TONE_FRAME};

// **段差を丸める(PolyBLEP)。** 矩形波をそのまま書くと、上がり下がりの
// 段が 1 サンプルで起きるので、実際には出ていない高い音まで鳴る(折り返し雑音)。
// 段の前後 1 サンプルぶんだけ多項式で寄せると、聞こえる範囲はほぼ消える。
// 作りつけの発振器は倍音を 64 本並べて同じことをしている
const poly = (t, dt) => {
  if (t < dt) { const x = t / dt; return x + x - x * x - 1; }
  if (t > 1 - dt) { const x = (t - 1) / dt; return x * x + x + x + 1; }
  return 0;
};

class DutyBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    this.max = q.voices || 16;
    this.voices = [];
    // **あとから足せるようにする。**実時間の再生は先読みで少しずつ積むので、
    // 作るときに全部は渡せない。積む範囲は必ず前へ進むので、
    // **並べ替え済みの束を後ろへ足すだけ**で全体の順番は保たれる
    // 止めている最中。出口を落としているあいだのサンプル数。-1 なら止めていない
    this.cutAt = -1;
    this.port.onmessage = (e) => {
      // 止めて。シークと停止とポーズで来る(docs/BUGS.md)
      if (e.data && e.data.cut) {
        this.events.length = 0;
        this.at = 0;
        this.voices.length = 0;
        if (this.cutAt < 0) this.cutAt = 0;
        return;
      }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      // 次の音が来たら出口を戻す
      this.cutAt = -1;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
    };
  }

  start(ev) {
    if (this.voices.length >= this.max) this.voices.shift();   // いちばん古いのを譲る
    this.voices.push({
      fr: ev.fr, du: ev.du, gv: ev.gv || null, env: ev.env || null,
      // フェードの途中の音。1 フレームずつの掛け率(鳴らす側が数にして渡す)
      fv: ev.fv || null,
      t0: ev.t, len: ev.dur, vol: ev.vol,
      // 音量の表があるとき、**最後の段から 0 へ落とす**。
      // 作りつけの道(_applyTone)が linearRampToValueAtTime でやっているのと同じ
      last: ev.gv ? (ev.gv.length - 1) * FRAME : 0,
      ph: 0, done: false,
    });
  }

  render(v, t, sr) {
    const x = t - v.t0;
    if (x >= v.len) { v.done = true; return 0; }
    let i = Math.floor(x / FRAME);
    if (i < 0) i = 0;
    const end = v.fr.length - 1;
    if (i > end) i = end;

    const f = v.fr[i];
    const d = v.du[i];
    const dt = f / sr;             // 1 サンプルで何回転ぶん進むか
    const ph = v.ph;

    // **幅 d の矩形波。**上がり(位相 0)と下がり(位相 d)の 2 か所に段がある
    let s = ph < d ? 1 : -1;
    s += poly(ph, dt);
    let q = ph + 1 - d;
    if (q >= 1) q -= 1;
    s -= poly(q, dt);
    // **直流を抜く。**幅が 0.5 でないと平均が 0 からずれ、
    // 幅を動かすたびに波全体が上下して**ボコッと鳴る**
    s -= 2 * d - 1;
    // ここで割って山を均さない。**実機(2A03)に合わせる。**
    // ファミコンの矩形波は幅が変わっても 0 と音量値の間を行き来するだけなので、
    // **上下の振れ幅は変わらない**。変わるのは平均の力で、細いほど静かになる
    // (50% を 0 とすると 25% で −1.2 dB、12.5% で −3.6 dB)。
    // 幅 0.5 のときは作りつけの矩形波とぴったり同じ振れ幅になる。
    //
    // 均すと山はそろうが、**細いときの落ち方が実機の倍以上**になる
    // (12.5% で −8.5 dB)。幅を動かしたときに音量が動きすぎて、
    // 幅の変化ではなく音量の変化に聞こえてしまう

    let nph = ph + dt;
    if (nph >= 1) nph -= 1;
    v.ph = nph;

    // 音量。表があればそちら、無ければエンベロープ(形は鳴らす側が秒で渡している)
    let g;
    if (v.gv) {
      g = v.gv[i];
      if (x > v.last) g *= (v.len - x) / Math.max(1e-6, v.len - v.last);
    } else {
      const e = v.env;
      if (!e) g = 1;
      else if (x < e.a) g = e.a > 0 ? x / e.a : 1;
      else if (x < e.a + e.d) g = 1 + (e.s - 1) * (x - e.a) / e.d;
      else if (x < e.hold) g = e.d > 0 ? e.s : 1;
      else {
        const top = e.d > 0 ? e.s : 1;
        g = top * (v.len - x) / Math.max(1e-6, v.len - e.hold);
      }
      if (g < 0) g = 0;
    }
    if (v.fv) g *= v.fv[Math.min(i, v.fv.length - 1)];
    return s * g * v.vol;
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const base = currentTime;
    const sr = sampleRate;
    const vs = this.voices;
    let dead = false;
    for (let i = 0; i < out.length; i++) {
      const t = base + i / sr;
      while (this.at < this.events.length && this.events[this.at].t <= t) {
        this.start(this.events[this.at++]);
      }
      let s = 0;
      for (let k = 0; k < vs.length; k++) {
        const v = vs[k];
        s += this.render(v, t, sr);
        if (v.done) dead = true;
      }
      // 止めている最中なら、ぷつっと鳴らないよう 10 ミリ秒で落とす
      if (this.cutAt >= 0) {
        const len = Math.max(1, Math.round(sr * 0.01));
        s *= Math.max(0, 1 - this.cutAt / len);
        this.cutAt++;
        if (this.cutAt > len) { this.cutAt = len; s = 0; }
      }
      out[i] = s;
    }
    // **片づけは要るときだけ。** 毎ブロック filter すると配列を作り続ける
    if (dead) this.voices = vs.filter((v) => !v.done);
    return true;
  }
}
registerProcessor('mmsxx-duty', DutyBank);
`;

/**
 * 幅の値を鳴らせる範囲へ収める。
 *
 * **0 と 1 は音にならない。**どちらも波が平らになるだけで、直流を抜いたあとは
 * 無音になる。書き間違えたときに黙って消えるより、端で止めたほうがよい。
 */
export const clampDuty = (d) => {
  const x = Number(d);
  if (!Number.isFinite(x)) return 0.5;        // 書いていない = 矩形波
  return Math.min(0.98, Math.max(0.02, x));
};
