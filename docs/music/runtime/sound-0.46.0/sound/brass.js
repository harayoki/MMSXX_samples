// 金管(息で鳴らし続ける音)。波形を持たない音源の 2 つ目の作り方。
//
// ---- なぜ共振器の束と別にしたか ----
//
// 共振器の束(sound/modal.js)は、叩いたりはじいたりする音のためのもの。
// 頭を流し込んだあとは減っていくだけなので、息で鳴らし続ける音は作れない。
// 作り方は 1 つにまとめなくてよい、と決めている(docs/ENGINE_TODO.md の 2h)。
//
// ---- 金管でいちばん大事なこと ----
//
// 大きさで明るさが決まる。弱く吹くと丸く、強く吹くほど上の倍音が増える。
// n 番目の倍音は、およそ基音の大きさの n 乗で育つと言われている
// (Risset のトランペットの分析。こちらでは測っていない)。
//
// ---- どう作るか ----
//
// サイン波を指数関数で曲げる。
//
// ```
// y = exp(k (cos θ − 1))
// ```
//
// この y の n 番目の倍音は e^-k I_n(k)(変形ベッセル関数)で、k が小さいうちは
// k^n に比例する。k を大きくすると、どの倍音も単調に増える。
// FM の倍音はベッセル関数 J_n で決まるので、深くすると増えたり減ったりして
// 途中に谷ができる。金管の倍音は単調に育つので、こちらのほうが近い
// (Lazzarini と Timoney の ModFM と同じ形)。
//
// k は鳴っている大きさ(息の圧)から作る。強さで決めるのではないので、
// 吹きながら大きくすれば、そのまま明るくなる(2h の「大きさで性質が変わる」)。
// 大きさそのものは、出口で息の圧に揃える。k で明るさだけを動かす。
//
// ---- サックスもここに置く ----
//
// リードと円錐の管で、金管ではない。ただ「大きさで明るさが決まる」骨格は同じで、
// 違うのは息の雑音の多さと、胴の共鳴。雑音の出方を 2 つ足して(airCurve と
// airPulse)、共鳴は声の外に置いた。
//
// ---- 声の外に置くもの ----
//
// ベル(管の先の広がった部分)は、どの音程でも同じところに効く動かないフィルタ。
// 線形なので混ぜたあとに 1 回掛ければ済む。ここには入れない。
// 山の付いたハイパスで、トランペットなら 1〜1.5kHz あたり(見当。測っていない)。
// ミュートはこのフィルタを差し替えるもの。
//
// ---- 力がこもる(push)と、裏返る(crack) ----
//
// push は出だしの押し。鳴りはじめの pushTime ほどのあいだ、明るさを押し上げ、
// 音程をわずかに上ずらせてから落ち着く。強く吹くほど、高い音ほど強い。
//
// crack は唇が一瞬となりの倍音に引っかかってから、狙った音に落ちる動き。
// ずれ幅はセントではなく倍音の比で決まる。管のいちばん低い倍音(pedal)から、
// 鳴らす音が何番目の倍音かを出し、その上(ときどき下)の倍音で鳴りはじめる。
// 落ちた瞬間に一度だけ大きさが抜ける。
// 起きるかどうかは、強さ・倍音の番号・前の音からの跳躍で決まる確率に、種を当てて決める。
// 番号が大きいほど(高い音ほど)となりの倍音が近く、外しやすい。低い音はめったに外さないが、
// 外すとオクターブや 5 度跳ぶので目立つ。本物もそうなる。
// 種は、鳴らす側が付ける k(書いた音符の番号。繰り返しを数えない)と音の高さから作る。
// 同じ音符は毎回同じように裏返る。#looptimes の 2 周目も同じ(鳴らした時刻では決めない)。
// k が無いとき(聞くページ、テスト)は、前の音と今の音の高さで代わりにする。
// 起きやすさには前の音からの跳躍を使うので、1 周目の頭の 1 音だけは入り方が違う(前が無音か前奏)。
// 2 周目からは、頭の前が毎回「前の周の最後の音」なので、どの周も同じになる。
//
// wobble は伸ばしている途中の裏返り。唇が一瞬となりの倍音へ跳ねて、元の音に戻る。
// 跳ねた瞬間と戻った瞬間に大きさが抜ける。起きやすさは 1 秒あたりで、強さ・倍音の番号と、
// ビブラートの山(息の圧が上がる瞬間)で増える。跳ねている長さは crackTime を使う。
// 種は音の高さから作るので、同じ音を同じ長さで吹けば、毎回同じところで跳ねる。
//
// ---- 回し方 ----
//
// sound/modal.js と同じ。ノードは 1 つ、状態は平らな Float64Array、
// 128 サンプルの塊で回して、中では確保しない。
// 明るさと音程は 16 サンプルごとに作り直す。指数とベッセル関数は重いので、
// 毎サンプルは計算しない。

export const BRASS_NODE = 'mmsxx-brass';

/** 1 つのノードが同時に持てる声の数 */
export const BRASS_VOICES = 16;
/** 長さ(d)を書かない音を、何秒で離すか */
export const BRASS_HOLD = 1;

export const BRASS_CODE = `
const V = ${BRASS_VOICES};
const B = 128;
// 明るさと音程を作り直す間隔
const SUB = 16;
const TAU = Math.PI * 2;
// 声の持ち物(平らな配列の中の位置)
const ON = 0, PH = 1, P = 2, TGT = 3, AGE = 4, REL = 5, F0 = 6, VEL = 7,
  K = 8, DC = 9, NRM = 10, INC = 11, LP = 12, BORN = 13, GONE = 14, OFF = 15, SC = 16, ST = 17,
  CR = 18, CD = 19, PG = 20, KG = 21, WR = 22, FR = 23, FS = 24, FE = 25, SG = 26;
const W = 27;

/** e^-x I0(x)。指数で割った形で持つと、大きな x でも桁があふれない */
function i0e(x) {
  if (x < 15) {
    let s = 1, t = 1;
    const q = x * x / 4;
    for (let m = 1; m < 60; m++) {
      t *= q / (m * m);
      s += t;
      if (t < s * 1e-12) break;
    }
    return s * Math.exp(-x);
  }
  return (1 + 1 / (8 * x) + 9 / (128 * x * x)) / Math.sqrt(TAU * x);
}

/**
 * 鳴らす音が、管の何番目の倍音か。スライドやバルブで管が伸びると、倍音の並びの基音は
 * pedal から最大 6 半音下がる。基音が pedal 以下に収まる、いちばん小さい番号にする
 * (丸めると、低い音で番号が 1 つ小さく出て、裏返りの跳び幅が大きすぎた)
 */
function partialOf(f0, pedal) { return Math.max(1, Math.ceil(f0 / pedal - 1e-6)); }

/**
 * 倍音の番号による外れやすさ。番号が大きいほどとなりの倍音が近く、唇が少しずれるだけで
 * 隣に乗る。低い音はとなりが遠く(オクターブ、5 度)、めったに外さない。6 番目で 1
 */
function slip(n) { return Math.min(2, Math.pow(n / 6, 1.5)); }

class BrassBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.voice = new Float64Array(V * W);
    this.patch = p.patches || {};
    this.def = new Array(V).fill(null);
    this.events = [];
    this.at = 0;
    this.born = 0;
    this.noise = 0x2545f491;
    this.cutAt = -1;
    // パッチごとの、前の音の高さ(裏返りの跳躍と種に使う)
    this.last = {};
    this.add(p.events || []);
    this.port.onmessage = (e) => {
      const d = e.data || {};
      if (d.patch) this.patch[d.patch] = d.def;
      // MML の #voice で作ったパッチ。音符より先に入れる(sound/audio.js の MML_PATCHES)
      if (d.patches) Object.assign(this.patch, d.patches);
      if (d.add) this.add(d.add);
      if (d.cut) { this.events = []; this.at = 0; this.cutAt = 0; }
    };
  }

  add(list) {
    if (!list.length) return;
    const rest = this.events.slice(this.at).concat(list);
    rest.sort((a, b) => a.t - b.t);
    this.events = rest;
    this.at = 0;
  }

  pick() {
    const vo = this.voice;
    let best = 0, oldest = Infinity;
    for (let v = 0; v < V; v++) {
      const o = v * W;
      if (!vo[o + ON]) return v;
      if (vo[o + BORN] < oldest) { oldest = vo[o + BORN]; best = v; }
    }
    return best;
  }

  start(ev, off) {
    const def = this.patch[ev.p];
    if (!def) return;
    const v = this.pick();
    const o = v * W;
    const vo = this.voice;
    vo.fill(0, o, o + W);
    vo[o + ON] = 1;
    vo[o + F0] = ev.f || 440;
    vo[o + VEL] = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
    vo[o + TGT] = vo[o + VEL];
    // 長さを書かない音は BRASS_HOLD 秒で離す。吹きっぱなしにはしない
    vo[o + REL] = ev.t + (ev.d == null ? ${BRASS_HOLD} : ev.d);
    vo[o + BORN] = ++this.born;
    vo[o + OFF] = off;
    // 音ごとに、どこから入るかを上書きできる。前の音の高さから入れればスライドになる
    vo[o + SC] = ev.s == null ? def.scoop : ev.s;
    vo[o + ST] = ev.st == null ? def.scoopTime : ev.st;
    vo[o + NRM] = 1;
    vo[o + SG] = 1;
    // 高い音ほど押しが強い。A4 で 1、半分から 2 倍までに収める
    const f0 = vo[o + F0], vel = vo[o + VEL];
    const reg = Math.min(2, Math.max(0.5, Math.sqrt(f0 / 440)));
    vo[o + PG] = (def.push || 0) * vel * reg;
    // 音の高さによる大きさの差。A4 を基準に、1 オクターブにつき keyGain dB
    vo[o + KG] = def.keyGain ? Math.pow(10, def.keyGain * Math.log2(f0 / 440) / 20) : 1;
    vo[o + CR] = 1;
    vo[o + CD] = 0;
    const last = this.last[ev.p];
    if (def.crack > 0 && def.pedal > 0) {
      const n = partialOf(f0, def.pedal);
      // 跳躍(オクターブで 1 まで)。前の音が無ければ中くらいと見る
      const leap = last ? Math.min(1, Math.abs(Math.log2(f0 / last))) : 0.5;
      const chance = Math.min(1, def.crack * vel * slip(n) * (0.5 + 1.5 * leap));
      let h = (Math.round(f0 * 10) | 0) ^ Math.imul(ev.k == null ? Math.round((last || 0) * 10) | 0 : 0, 0x85ebca6b) ^ Math.imul(def.crackSeed | 0, 0x9e3779b1) ^ Math.imul((ev.k ?? -1) + 1, 0x27d4eb2f);
      const u = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
      if (u() < chance) {
        // 多くは上の倍音へ。いちばん下の倍音からは上にしか行けない
        const up = n < 2 || u() < 0.7;
        vo[o + CR] = (n + (up ? 1 : -1)) / n;
        vo[o + CD] = def.crackTime * (0.6 + 0.8 * u());
      }
    }
    // キーク。リードが鳴りそこねて、狙った音の倍音のうち 2.8kHz に近いもので「キッ」と鳴る。
    // 出だしの裏返りが起きなかった音だけ。跳躍のあとと、強い音で起きやすい
    if (def.squeak > 0 && vo[o + CD] === 0) {
      const leap = last ? Math.min(1, Math.abs(Math.log2(f0 / last))) : 0.5;
      const chance = Math.min(1, def.squeak * vel * (0.5 + 1.5 * leap));
      let q = (Math.round(f0 * 10) | 0) ^ Math.imul(ev.k == null ? Math.round((last || 0) * 10) | 0 : 0, 0x2c1b3c6d) ^ Math.imul(def.crackSeed | 0, 0x297a2d39) ^ Math.imul((ev.k ?? -1) + 1, 0x165667b1);
      const u = () => { q = Math.imul(q ^ (q >>> 15), 2246822507); q = Math.imul(q ^ (q >>> 13), 3266489909); q ^= q >>> 16; return (q >>> 0) / 4294967296; };
      if (u() < chance) {
        vo[o + CR] = Math.max(2, Math.round(2800 / f0));
        vo[o + CD] = def.crackTime * (0.5 + 0.5 * u());
        // 鳴りそこねた一瞬の音なので、元の音ほど大きくない。元の大きさのままだと、耳がいちばん敏感な
        // 2.8kHz あたりに胴の高い山も重なって、本物よりずっとうるさく聞こえた(2026-10-07)
        vo[o + SG] = 0.3;
      }
    }
    this.last[ev.p] = f0;
    // 途中の裏返りの種と、跳ねているあいだの倍音の比・始まり・終わり(サンプル)
    let w = (Math.round(f0 * 10) | 0) ^ Math.imul(def.crackSeed | 0, 0x51ed270b) ^ Math.imul((ev.k ?? -1) + 1, 0x7feb352d);
    w = Math.imul(w ^ (w >>> 16), 0x45d9f3b); w ^= w >>> 16;
    vo[o + WR] = (w >>> 0) || 1;
    vo[o + FR] = 1;
    vo[o + FS] = -1;
    vo[o + FE] = -1;
    this.def[v] = def;
  }

  /** 明るさ・音程・正規化を作り直す。16 サンプルに 1 回 */
  control(v, sr) {
    const vo = this.voice, d = this.def[v];
    const o = v * W;
    const f0 = vo[o + F0];
    const age = vo[o + AGE] / sr;
    // 鳴りはじめは少し下から入って、せり上がる
    let cents = vo[o + SC] * Math.exp(-age / Math.max(1e-3, vo[o + ST]));
    // 出だしの押し。少し上ずって、明るくなる
    const push = vo[o + PG] > 0 ? vo[o + PG] * Math.exp(-age / Math.max(1e-3, d.pushTime)) : 0;
    cents += 25 * push;
    // ビブラートは遅れて入る
    let vibUp = 0;
    if (d.vib > 0) {
      const fade = Math.min(1, Math.max(0, (age - d.vibDelay) / 0.4));
      const sv = Math.sin(TAU * d.vibRate * age);
      cents += d.vib * fade * sv;
      vibUp = fade * Math.max(0, sv);
    }
    // 途中の裏返り。跳ねているあいだはとなりの倍音で鳴る。出だしの裏返りと押しが
    // 済んで、伸ばしているところだけで起きる
    let flip = 1;
    if (d.wobble > 0 && d.pedal > 0) {
      const a = vo[o + AGE];
      if (a < vo[o + FE]) flip = vo[o + FR];
      else if (age > Math.max(0.15, vo[o + CD]) && !vo[o + GONE]) {
        const vel = vo[o + VEL];
        const n = partialOf(f0, d.pedal);
        const chance = d.wobble * vel * slip(n) * (1 + 2 * vibUp) * SUB / sr;
        let r = vo[o + WR];
        const u = () => { r ^= r << 13; r >>>= 0; r ^= r >>> 17; r ^= r << 5; r >>>= 0; return r / 4294967296; };
        if (u() < chance) {
          const up = n < 2 || u() < 0.7;
          vo[o + FR] = (n + (up ? 1 : -1)) / n;
          vo[o + FS] = a;
          vo[o + FE] = a + d.crackTime * (0.6 + 0.8 * u()) * sr;
          flip = vo[o + FR];
        }
        vo[o + WR] = r;
      }
    }
    // 裏返っているあいだは、となりの倍音で鳴る
    const f = f0 * (age < vo[o + CD] ? vo[o + CR] : 1) * flip * Math.pow(2, cents / 1200);
    vo[o + INC] = f / sr;
    // 明るさは息の圧から。ナイキストを越える倍音が出ない k で止める。
    // brassKey は音の高さで明るさを変える。本物の金管は、明るさが倍音の番号ではなく
    // 周波数(Hz)で決まる(録音で測った)。倍音の広がりはおよそ sqrt(k) 本なので、
    // 2 で、どの高さでも同じ Hz まで倍音が届く。A4 を基準にする
    const h = 0.45 * sr / f;
    const cap = Math.max(0.05, h - 3 * Math.sqrt(h));
    const p = vo[o + P];
    const kk = d.brassKey ? Math.pow(440 / f0, d.brassKey) : 1;
    const k = Math.min(cap, Math.max(1e-4, d.brass * kk * Math.pow(p, d.curve) * (1 + 3 * push)));
    const dc = i0e(k);
    const ac = Math.sqrt(Math.max(1e-12, i0e(2 * k) - dc * dc));
    vo[o + K] = k;
    vo[o + DC] = dc;
    vo[o + NRM] = 1 / ac;
  }

  render(v, out, sr, tEnd) {
    const vo = this.voice, d = this.def[v];
    const o = v * W;
    if (vo[o + REL] < tEnd && !vo[o + GONE]) { vo[o + GONE] = 1; vo[o + TGT] = 0; }
    const vel = vo[o + VEL];
    // 息の圧の追いかけ方。強く吹くほど速く立ち上がる
    const ta = d.attack * (1.5 - vel);
    const ka = 1 - Math.exp(-1 / (Math.max(1e-3, ta) * sr));
    const kr = 1 - Math.exp(-1 / (Math.max(1e-3, d.release) * sr));
    const lv = d.level * vo[o + KG];
    let ph = vo[o + PH], p = vo[o + P], age = vo[o + AGE], lp = vo[o + LP];
    let nz = this.noise;
    // 裏返りから落ちたところ(サンプル)。そこで一度だけ大きさが抜ける
    const cdS = vo[o + CD] * sr;
    const off = vo[o + OFF];
    vo[o + OFF] = 0;
    for (let i = off; i < B; i++) {
      if ((i - off) % SUB === 0) {
        vo[o + P] = p; vo[o + AGE] = age;
        this.control(v, sr);
      }
      // 強く吹くと、出だしで一度行き過ぎてから落ち着く
      let tgt = vo[o + TGT];
      if (tgt > 0) tgt *= 1 + d.blat * vel * Math.exp(-age / (0.06 * sr));
      p += (tgt > p ? ka : kr) * (tgt - p);
      const cs = Math.cos(TAU * ph);
      const y = (Math.exp(vo[o + K] * (cs - 1)) - vo[o + DC]) * vo[o + NRM];
      ph += vo[o + INC];
      if (ph >= 1) ph -= 1;
      // タンギングの雑音と、息の雑音。息は airCurve が小さいほど、弱く吹いたときに
      // 相対的に大きく残る(サックスのかすれた弱音)。airPulse はリードが開いている
      // あいだだけ雑音が通る割合で、雑音が音程の周期で脈打つ
      nz ^= nz << 13; nz >>>= 0; nz ^= nz >>> 17; nz ^= nz << 5; nz >>>= 0;
      const n = nz / 2147483648 - 1;
      const gate = 1 - d.airPulse + d.airPulse * (1 + cs);
      const air = n * (d.tongue * vel * Math.exp(-age / (0.012 * sr))
        + d.breath * Math.pow(p, d.airCurve) * gate);
      lp += 0.35 * (air - lp);
      let dip = cdS > 0 && age >= cdS && age - cdS < 0.05 * sr ? 1 - 0.6 * Math.exp(-(age - cdS) / (0.006 * sr)) : 1;
      // 途中の裏返り。跳ねた瞬間と戻った瞬間に抜ける
      const fs = vo[o + FS];
      if (fs >= 0 && age >= fs && age - fs < 0.2 * sr) {
        const fe = vo[o + FE];
        dip *= 1 - 0.5 * Math.exp(-(age - fs) / (0.004 * sr));
        if (age >= fe) dip *= 1 - 0.5 * Math.exp(-(age - fe) / (0.004 * sr));
      }
      // キークのあいだだけ小さくする(出だしの裏返りは元の大きさのまま)
      const sq = age < cdS ? vo[o + SG] : 1;
      out[i] += lv * (p * y * dip * sq + lp);
      age++;
    }
    vo[o + PH] = ph; vo[o + P] = p; vo[o + AGE] = age; vo[o + LP] = lp;
    this.noise = nz;
    if (vo[o + GONE] && p < 1e-4) vo[o + ON] = 0;
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
      const ev = this.events[this.at++];
      this.start(ev, Math.max(0, Math.min(B - 1, Math.round((ev.t - t0) * sr))));
    }
    for (let v = 0; v < V; v++) if (vo[v * W + ON]) this.render(v, out, sr, tEnd);
    if (this.cutAt >= 0) {
      const len = Math.max(1, Math.round(sr * 0.01));
      for (let i = 0; i < out.length; i++) {
        out[i] *= Math.max(0, 1 - this.cutAt / len);
        this.cutAt++;
      }
      if (this.cutAt >= len) { vo.fill(0); this.cutAt = -1; }
    }
    for (let c = 1; c < chs.length; c++) chs[c].set(out);
    return true;
  }
}
registerProcessor('${BRASS_NODE}', BrassBank);
`;

/**
 * パッチのパラメータ。`when` は効く条件で、決め方は sound/modal.js の MODAL_PARAMS と同じ
 * (`vib` が 0 なら `vibRate` は効かない、など)。
 * `live` は、鳴っている音の途中で動かして効くか。声の中のものはどれも効かない。
 * 声は鳴りはじめのパッチを持ち続け、差し替えは次の音から効く。
 * ベルと胴(BRASS_BELL、BRASS_BODY)は声の外のフィルタなので、途中でも効く。
 * 既定の値はここには持たない。楽器ごとに違うので、パッチ(BRASS_PATCHES)が持つ。
 * `group: 'flaw'` は弾き方の失敗や崩れ(押し・裏返り)。この音源の売りなので、
 * 道具の画面では閉じずに上のほうへ出す(2026-10-05)
 */
export const BRASS_PARAMS = {
  brass:  { live: false, min: 0, max: 40,
    desc: 'How bright it gets at full breath, at A4. 0 is a pure sine at any loudness.' },
  brassKey: { live: false, min: 0, max: 3, when: [{ key: 'brass', gt: 0 }],
    desc: 'How much brighter low notes get, as a power of the pitch below A4. 0 gives every note the same number of harmonics; 2 makes the harmonics reach the same frequency at every pitch, as on a real horn.' },
  curve:  { live: false, min: 0.3, max: 4, when: [{ key: 'brass', gt: 0 }],
    desc: 'How fast brightness follows loudness. High values stay dark until played hard.' },
  attack: { live: false, min: 0.003, max: 0.5, unit: 's',
    desc: 'How fast the breath pressure builds. Harder notes build faster.' },
  blat:   { live: false, min: 0, max: 1,
    desc: 'Overshoot of the breath on hard attacks, settling within about 60 ms.' },
  release: { live: false, min: 0.01, max: 1, unit: 's',
    desc: 'How fast the breath falls when the note is let go. The tone darkens as it falls.' },
  scoop:  { live: false, min: -300, max: 300, unit: 'cent',
    desc: 'Where the pitch starts, before it settles on the note. Negative comes up from below.' },
  scoopTime: { live: false, min: 0.005, max: 0.3, unit: 's', when: [{ key: 'scoop', ne: 0 }],
    desc: 'How long the pitch takes to settle.' },
  vib:    { live: false, min: 0, max: 100, unit: 'cent',
    desc: 'Vibrato depth.' },
  vibRate: { live: false, min: 2, max: 9, unit: 'Hz', when: [{ key: 'vib', gt: 0 }],
    desc: 'Vibrato speed.' },
  vibDelay: { live: false, min: 0, max: 2, unit: 's', when: [{ key: 'vib', gt: 0 }],
    desc: 'How long a note is held before the vibrato fades in.' },
  tongue: { live: false, min: 0, max: 1,
    desc: 'Noise burst of the tongue at the start of a note.' },
  breath: { live: false, min: 0, max: 0.3,
    desc: 'Air noise that follows the breath pressure.' },
  airCurve: { live: false, min: 0.1, max: 2, when: [{ key: 'breath', gt: 0 }],
    desc: 'How the air noise follows the breath. Below 1, soft notes keep more air, as in a breathy saxophone.' },
  airPulse: { live: false, min: 0, max: 1, when: [{ key: 'breath', gt: 0 }],
    desc: 'How much the air noise pulses with each cycle of the reed. 0 is steady hiss.' },
  push:   { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'How hard the start of a note is pushed: brighter and a little sharp, then it settles. Grows with velocity and pitch.' },
  pushTime: { live: false, group: 'flaw', min: 0.01, max: 0.4, unit: 's', when: [{ key: 'push', gt: 0 }],
    desc: 'How long the push takes to settle.' },
  crack:  { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'How likely the lips catch the neighbouring harmonic for a moment before landing on the note. More likely on loud notes, high in the harmonic series where the harmonics sit close together, and after a leap. Low notes rarely crack, but jump far when they do.' },
  crackTime: { live: false, group: 'flaw', min: 0.01, max: 0.15, unit: 's',
    desc: 'How long the note stays on the wrong harmonic, for crack and wobble.' },
  pedal:  { live: false, group: 'flaw', min: 20, max: 400, unit: 'Hz',
    desc: 'Lowest harmonic of the tube. Sets which harmonic a note is, and so how far a crack or a wobble jumps.' },
  crackSeed: { live: false, group: 'flaw', min: 1, max: 9999, step: 1,
    desc: 'Seed for which leaps crack and where held notes wobble. The same leap always cracks the same way.' },
  squeak: { live: false, group: 'flaw', min: 0, max: 1,
    desc: 'How likely the reed squeaks at the start of a note, jumping to a harmonic near 2.8 kHz for a moment. More likely on loud notes and after a leap.' },
  wobble: { live: false, group: 'flaw', min: 0, max: 5, unit: '/s',
    desc: 'How often a held note flips to the neighbouring harmonic for a moment and comes back, per second. More likely on loud notes high in the harmonic series and at the top of the vibrato.' },
  keyGain: { live: false, min: -12, max: 12, unit: 'dB',
    desc: 'Level change per octave above A4. Positive makes low notes quieter, as on a real trumpet, whose low register speaks softly at every dynamic.' },
  level:  { live: false, min: 0.01, max: 4,
    desc: 'Output level of this patch.' },
};

/**
 * 胴の共鳴。音程によらない山なので、これも混ぜたあとに掛ける。エンジンは掛けない。
 * サックスの「ホンク」と「エッジ」はここで決まる。
 */
export const BRASS_BODY = {
  freq: { live: true, min: 100, max: 6000, unit: 'Hz',
    desc: 'Centre of the resonance.' },
  gain: { live: true, min: -18, max: 18, unit: 'dB',
    desc: 'How much it lifts or cuts at the centre.' },
  resonance: { live: true, min: 0, max: 0.95,
    desc: 'How narrow the peak is. 0 is broad.' },
};

/**
 * ベルの代わりに混ぜたあとへ掛けるフィルタの値。エンジンは掛けない。
 * 声の外のフィルタができたら、そちらに渡す値になる。
 * `resonance` は 0〜1 で、Q = 1 / (2 − 2 × resonance)(声の外のフィルタと同じ決め方)。
 */
export const BRASS_BELL = {
  freq: { live: true, min: 100, max: 4000, unit: 'Hz',
    desc: 'Where the bell starts to let sound out. Below it, sound is held back.' },
  resonance: { live: true, min: 0, max: 0.95,
    desc: 'Height of the peak at that point. 0 is no peak.' },
};

/**
 * `range` はその楽器で意味のある範囲(推奨範囲)。決め方は sound/modal.js の MODAL_PATCHES と同じ。
 * ベルは `bell.`、胴の山は `body.0.` のように場所で書く。値はどれも見当
 */
export const BRASS_PATCHES = {
  trumpet: {
    desc: 'Trumpet, open. Bright when pushed, a short scoop into each note and a late vibrato. Fitted to recordings of a B-flat trumpet.',
    // 録音(アイオワ大学の B♭ トランペット、ビブラートなし、E3〜C6 を 3 つの強さ)に寄せた(2026-10-05)。
    // 前は低い音ほど暗かった(E3 mf で重心 4.2、録音は 9.1)。本物は明るさが倍音の番号ではなく
    // Hz で決まり、1.1kHz あたりに山がある。brassKey と、山の立ったベルで合わせた。
    // 明るくなったぶん大きく出るので、セッションの大きさが前と同じになるよう level を下げている
    brass: 37.5, brassKey: 1.38, curve: 1.41, attack: 0.0222, blat: 0.33, release: 0.06,
    scoop: -40, scoopTime: 0.035, vib: 18, vibRate: 5.6, vibDelay: 0.35,
    tongue: 0.25, breath: 0.03, airCurve: 1, airPulse: 0, level: 0.09,
    // 管のいちばん低い倍音は B♭2
    // 裏返りは短いほうが本物らしい(40ms では長く聞こえた。2026-10-05)
    push: 0.4, pushTime: 0.08, crack: 0.15, crackTime: 0.025, pedal: 116.5, crackSeed: 1, wobble: 0.2, squeak: 0,
    // 録音は pp・mf・ff のどれでも、低い音ほど 1 オクターブにつき約 5dB 小さい。
    // 強さによらないので楽器の特徴と見た。4 で mf の並びが録音に合う。
    // セッションは低いところで吹かせていて 5dB 小さくなるので、level で前の大きさに戻した
    keyGain: 4,
    bell: { freq: 1100, resonance: 0.72 },
    range: {
      brass: [25, 40], brassKey: [1, 2], curve: [1.1, 2.2], attack: [0.012, 0.05], blat: [0.1, 0.45], release: [0.03, 0.12],
      scoop: [-80, 0], scoopTime: [0.015, 0.07], vib: [0, 35], vibRate: [4.5, 6.5], vibDelay: [0.15, 0.7],
      tongue: [0.1, 0.4], breath: [0.01, 0.06], airCurve: [0.8, 1.2], airPulse: [0, 0.3], level: [0.02, 0.12],
      push: [0, 0.8], pushTime: [0.04, 0.15], crack: [0, 0.4], crackTime: [0.012, 0.05], pedal: [110, 120], crackSeed: [1, 9999], wobble: [0, 1], squeak: [0, 0], keyGain: [2, 7],
      'bell.freq': [800, 1800], 'bell.resonance': [0.5, 0.85],
    },
  },
  trombone: {
    desc: 'Trombone. Darker and slower to speak than the trumpet. Fitted to recordings of a tenor trombone.',
    // 録音(アイオワ大学のテナートロンボーン、E2〜C5 を 3 つの強さ)に寄せた(2026-10-05)。
    // トランペットと同じく低い音ほど暗かったので、brassKey とベルの山で合わせた。
    // 低い音ほど小さいのも同じで、keyGain 3.6。誤差は 3.75 → 3.14。残りの多くは E2 の録音で、
    // mf が pp より暗く出ている(録音の癖と見て追わなかった)。
    // 明るくなったぶん大きく出るので、セッションの大きさが前と同じになるよう level を下げている
    brass: 20, brassKey: 1.38, curve: 1.8, attack: 0.0712, blat: 0.15, release: 0.09,
    scoop: -25, scoopTime: 0.05, vib: 10, vibRate: 5, vibDelay: 0.5,
    tongue: 0.18, breath: 0.025, airCurve: 1, airPulse: 0, level: 0.21,
    // 管のいちばん低い倍音は B♭1
    push: 0.3, pushTime: 0.1, crack: 0.1, crackTime: 0.05, pedal: 58.3, crackSeed: 1, wobble: 0.15, squeak: 0,
    keyGain: 3.6,
    bell: { freq: 565, resonance: 0.472 },
    range: {
      brass: [12, 30], brassKey: [1, 2], curve: [1.2, 2.4], attack: [0.03, 0.1], blat: [0.05, 0.3], release: [0.05, 0.15],
      scoop: [-60, 0], scoopTime: [0.02, 0.09], vib: [0, 20], vibRate: [4, 6], vibDelay: [0.3, 0.9],
      tongue: [0.08, 0.3], breath: [0.01, 0.05], airCurve: [0.8, 1.2], airPulse: [0, 0.3], level: [0.1, 0.35],
      push: [0, 0.7], pushTime: [0.05, 0.2], crack: [0, 0.3], crackTime: [0.03, 0.08], pedal: [55, 62], crackSeed: [1, 9999], wobble: [0, 0.8], squeak: [0, 0], keyGain: [2, 6],
      'bell.freq': [300, 800], 'bell.resonance': [0.3, 0.7],
    },
  },
  tenor: {
    desc: 'Tenor saxophone. Breathy when soft, edgy when pushed, a wide scoop and a jaw vibrato. The honk and the edge come from two body peaks. Fitted to recordings of an alto saxophone, scaled down a fifth.',
    // テナーの録音は無いので、アルトサックス(アイオワ大学、D♭3・C4・C5 を 3 つの強さ)を
    // 物差しにした(2026-10-05)。テナーはアルトをおよそ 1.5 倍にした相似形なので、アルトの音を
    // 5 度下で鳴らし、倍音の番号ごとの並びで比べる。胴の山もその比で縮むので、テナーの値のまま比べられる。
    // ホンクの山は 450Hz から 700Hz に上がって鋭くなった。誤差は 5.89 → 4.41。
    // 残りの多くは弱く吹いたときの立ち上がりで、録音は D♭3 pp で 0.26 秒かけてふくらむ。
    // いまの attack は強さに比例して縮むだけなので、そこまで遅くできない
    brass: 13.1, brassKey: 0.7, curve: 1.62, attack: 0.048, blat: 0.05, release: 0.08,
    scoop: -60, scoopTime: 0.05, vib: 22, vibRate: 5.2, vibDelay: 0.3,
    // 大きさは、声の外の bell と body まで通して、トランペットに揃えている。
    // bell が低い(120Hz)ので低いほうが削れず、body で 2 か所持ち上がるぶん、
    // 同じ level だと 7dB 大きかった。セッションの中で目立ちすぎた(2026-10-05)。
    // 録音に寄せたあとも、セッションでの大きさは前と同じに揃えてある
    tongue: 0.12, breath: 0.12, airCurve: 0.4, airPulse: 0.8, level: 0.1,
    // サックスの裏返りは、リードがひっくり返って上の倍音へ跳ぶもの。管のいちばん下は A♭2
    push: 0.25, pushTime: 0.08, crack: 0.05, crackTime: 0.05, pedal: 103.8, crackSeed: 1, wobble: 0.1, squeak: 0.04,
    // サックスは低い音ほど大きい。録音の C4 が D♭3 と C5 の両方より小さく、1 本の傾きでは
    // 合わない。合わせると −8 まで行くが、それだと C5 が 9dB 小さくなるので、間を取った
    keyGain: -2,
    bell: { freq: 120, resonance: 0 },
    body: [{ freq: 700, gain: 7.34, resonance: 0.84 }, { freq: 1900, gain: 9, resonance: 0.549 }],
    range: {
      brass: [9, 20], brassKey: [0.3, 1.2], curve: [1.2, 2], attack: [0.025, 0.08], blat: [0, 0.15], release: [0.05, 0.15],
      scoop: [-120, -10], scoopTime: [0.03, 0.1], vib: [8, 40], vibRate: [4.5, 6], vibDelay: [0.15, 0.5],
      tongue: [0.05, 0.2], breath: [0.05, 0.2], airCurve: [0.25, 0.7], airPulse: [0.5, 1], level: [0.05, 0.18],
      push: [0, 0.6], pushTime: [0.04, 0.15], crack: [0, 0.2], crackTime: [0.03, 0.08], pedal: [100, 108], crackSeed: [1, 9999], wobble: [0, 0.6], squeak: [0, 0.2], keyGain: [-8, 2],
      'bell.freq': [100, 250], 'bell.resonance': [0, 0.3],
      'body.0.freq': [450, 850], 'body.0.gain': [3, 10], 'body.0.resonance': [0.5, 0.9],
      'body.1.freq': [1400, 2400], 'body.1.gain': [4, 12], 'body.1.resonance': [0.35, 0.75],
    },
  },
};

/** 処理器へ渡す形にする */
export function compileBrass(def) {
  const out = {};
  for (const k of Object.keys(BRASS_PARAMS)) out[k] = def[k] ?? 0;
  if (def.level == null) out.level = 0.5;
  // マクロの大きさの補正(applyBrassMacro が軸ごとに書く)
  out.level *= Object.values(def.macroLevel || {}).reduce((a, b) => a * b, 1);
  if (def.airCurve == null) out.airCurve = 1;
  return out;
}

/**
 * 鳴らすところ。ノード 1 つに全部の声を通す。ベルは dest の先に置く。
 *
 * ```js
 * const b = new BrassSynth(ctx, bell);
 * await b.load();
 * b.note(ctx.currentTime + 0.1, 'trumpet', 466.16, 0.8, 0.5);
 * ```
 */
/**
 * まとめて動かすパラメータ(マクロ)を当てる。決め方は sound/modal.js の applyMacro と同じで、
 * x = 1 でパッチの値、0 で `neutral` の値、1 より上は同じ向きに伸ばす。
 * ベルと胴は `bell.freq` のように場所で書く。範囲は BRASS_PARAMS・BRASS_BELL・BRASS_BODY で切る
 * @param {object} def いまの値
 * @param {object} base パッチの既定値(`macros` を持つもの)
 * @param {string} name マクロの名前
 * @param {number} x
 */
export function applyBrassMacro(def, base, name, x) {
  const m = base.macros && base.macros[name];
  const out = structuredClone(def);
  if (!m) return out;
  if (m.levelDb) {
    const db = x < 1 ? m.levelDb[0] * (1 - x) : m.levelDb[1] * (x - 1) / Math.max(1e-9, (m.max ?? 2) - 1);
    out.macroLevel = { ...(def.macroLevel || {}), [name]: Math.pow(10, db / 20) };
  }
  for (const [path, zero] of Object.entries(m.neutral)) {
    const ks = path.split('.');
    const one = ks.reduce((o, k) => o?.[k], base);
    const key = ks[ks.length - 1];
    const p = ks[0] === 'bell' ? BRASS_BELL[key] : ks[0] === 'body' ? BRASS_BODY[key] : BRASS_PARAMS[key];
    let v = zero + x * (one - zero);
    if (p) v = Math.min(p.max, Math.max(p.min, v));
    let o = out;
    for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]];
    o[key] = v;
  }
  return out;
}

/**
 * 1 音の余韻が −60dB まで落ちる秒。焼く側(renderBGM)が、どこまで焼けばよいかと、
 * ループの終わりをどれだけはみ出すかを知るためのもの。
 *
 * - released が true(d のある音): 離した時刻から数えた秒
 * - released が false(d の無い音): 鳴らした時刻から数えた秒。BRASS_HOLD 秒で離してからの余韻を足す
 *
 * 離すと息の圧は release を時定数にして落ち、出る大きさは息の圧に比例するので、
 * −60dB までは release × ln(1000)。息の雑音は息の圧の airCurve 乗で付いてくるので、airCurve が
 * 1 より小さいと音より遅く落ちる(テナー)。雑音の大きさ breath から −60dB までを出し、長いほうを取る。
 * 裏返りやキークは鳴りはじめのことで、余韻の長さは変えない。
 * なので f、k、v は受けるが使わない(打つ楽器の modalTail と同じ形で呼べるようにしてある)。
 *
 * 焼く側で使うときの注意: ループの折り返しに要るのは最後の 1 音だけではない。
 * ループの終わりから tail ぶん手前より後に始まった音符を、ぜんぶ見ること。
 * @param {object} def パッチ(BRASS_PATCHES の形)
 * @param {number} [f] Hz
 * @param {boolean} [released] d があるか
 */
export function brassTail(def, f, released = false) {
  const rel = def.release ?? 0;
  const tone = rel * Math.log(1000);
  const air = def.breath > 0 ? rel * Math.log(1000 * def.breath) / (def.airCurve ?? 1) : 0;
  const fall = Math.max(tone, air);
  return released ? fall : BRASS_HOLD + fall;
}

export class BrassSynth {
  /**
   * @param {BaseAudioContext} ctx
   * @param {AudioNode} [dest] 省くと ctx.destination
   */
  constructor(ctx, dest) {
    this.ctx = ctx;
    this.dest = dest || ctx.destination;
    this.defs = {};
    for (const [k, d] of Object.entries(BRASS_PATCHES)) this.defs[k] = structuredClone(d);
    this.node = null;
  }

  async load() {
    if (this.node) return;
    const url = URL.createObjectURL(new Blob([BRASS_CODE], { type: 'application/javascript' }));
    await this.ctx.audioWorklet.addModule(url);
    const patches = {};
    for (const [k, d] of Object.entries(this.defs)) patches[k] = compileBrass(d);
    this.node = new AudioWorkletNode(this.ctx, BRASS_NODE, {
      numberOfInputs: 0, outputChannelCount: [1], processorOptions: { patches },
    });
    this.node.connect(this.dest);
  }

  /** パッチを差し替える。次の音から効く */
  setPatch(name, def) {
    this.defs[name] = def;
    if (this.node) this.node.port.postMessage({ patch: name, def: compileBrass(def) });
  }

  /**
   * 1 音。
   * @param {number} t 鳴らす時刻(ctx の時計)
   * @param {string} name パッチの名前
   * @param {number} freq Hz
   * @param {number} [vel] 0〜1
   * @param {number} [dur] 秒。省くと 1 秒
   *
   * notes() に渡すときは、s(この音だけの scoop、セント)と st(この音だけの scoopTime、秒)も
   * 書ける。前の音との差を s に書けば、トロンボーンのスライドのように前の音から滑って入る
   */
  note(t, name, freq, vel = 0.8, dur) {
    const ev = { t, p: name, f: freq, v: vel };
    if (dur != null) ev.d = dur;
    this.notes([ev]);
  }

  /** まとめて渡す。{t, p, f, v, d, s, st} の並び */
  notes(list) {
    if (this.node) this.node.port.postMessage({ add: list });
  }

  cut() {
    if (this.node) this.node.port.postMessage({ cut: true });
  }
}
