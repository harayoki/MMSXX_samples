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
// ---- ベルと胴 ----
//
// ベル(管の先の広がった部分)は、どの音程でも同じところに効く動かないフィルタ。
// 線形なので混ぜたあとに 1 回掛ければ済むが、エンジンには楽器ごとに混ぜたあとへ掛ける
// 場所が無い。前は聞くページだけが後から掛けていて、MML から鳴らすと掛かっていなかった
// (録音に寄せた明るさも胴の山も、曲の中では鳴っていなかった)。2026-10-26 から、処理器の中で
// 1 声ずつ掛ける。2 次のフィルタが 1 声に数個増えるだけで、重さはほとんど変わらない。
// 山の付いたハイパスで、トランペットなら 1〜1.5kHz あたり(見当。測っていない)。
// ミュートはこのフィルタを差し替えるもの。
//
// ---- ミュート(mute。2026-10-26) ----
//
// ベルに差すミュートは、ベルのフィルタを差し替えるものとして作った。プランジャーは
// 1 音の中で閉じてから開くので、混ぜたあとに 1 回掛ける形では作れず、処理器の中で 1 声ずつ掛ける。
// ベルと胴の山も処理器の中で掛けるようになった(上の「ベルと胴」)ので、mute が 0 でないときは
// ベルを外し、胴の山を通したあとでミュートを通す(差し替えなので、ベルとミュートの両方は掛けない)。
//
// - 1 カップ: 300Hz の 2 極のハイパス、1kHz に +4dB の山(Q 1.2)、1.8kHz の 2 極のローパス(Q 0.8)。
//   低いほうも高いほうも削れて、丸くこもった音
// - 2 ハーモン(ステムを抜いたもの。マイルス・デイヴィスの音): 1kHz の 2 極のハイパス(Q 0.9)、
//   1.7kHz に +8dB の狭い山(Q 3)、4kHz に +3dB の山(Q 2)。低いほうが大きく削れ、鼻にかかった細い音
// - 3 プランジャー: 山の付いた 2 極のローパス。鳴りはじめは 450Hz・Q 2.5(閉じた「ウ」)で、
//   plungerTime 秒かけて 5kHz・Q 0.71(開いた「ア」)へ開く。高さは対数で、動きは滑らかに(三次の S 字)
//
// どの数も見当で、録音と比べていない。ミュートで小さくなるぶんは、フィルタが削るぶんだけで、
// ほかに音量は下げていない
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
// ベルと胴の山。1 声に、胴の山 MF 個とベル 1 個まで。段ごとに 2 次のフィルタの前 2 つと後 2 つを持つ
const MF = 4, FW = 4 * (MF + 1);
// ミュートのフィルタの状態。1 声に 2 次の SVF を 3 段まで、段ごとに 2 つ
const MZ = 6;
// ミュートの形。段ごとに [種類(0 ローパス、1 ハイパス、2 山), 高さ Hz, Q, 山の dB](どれも見当)
const MUTE_CUP = [[1, 300, 0.71], [2, 1000, 1.2, 4], [0, 1800, 0.8]];
const MUTE_HARMON = [[1, 1000, 0.9], [2, 1700, 3, 8], [2, 4000, 2, 3]];
// プランジャー。閉じたときの高さ、開いたときの高さ、閉じたときの Q、開いたときの Q
const PLUNGER = [450, 5000, 2.5, 0.71];

/** SVF の 1 段の係数を c の at から 5 つ書く。[g, k, m0, m1, m2] */
function muteSec(c, at, type, f, q, db, sr) {
  const g = Math.tan(Math.PI * Math.min(f, sr * 0.45) / sr);
  c[at] = g;
  if (type === 0) { c[at + 1] = 1 / q; c[at + 2] = 0; c[at + 3] = 0; c[at + 4] = 1; return; }
  if (type === 1) { c[at + 1] = 1 / q; c[at + 2] = 1; c[at + 3] = -1 / q; c[at + 4] = -1; return; }
  const A = Math.pow(10, db / 40), k = 1 / (q * A);
  c[at + 1] = k; c[at + 2] = 1; c[at + 3] = k * (A * A - 1); c[at + 4] = 0;
}

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
    // ベルと胴の山の状態と、1 声ぶんを書いてからフィルタに通すための置き場
    this.filt = new Float64Array(V * FW);
    // ミュートの状態と、ミュートを通す声を 1 声ぶん書いてから通すための置き場
    this.mz = new Float64Array(V * MZ);
    this.tmp = new Float32Array(B);
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
    this.alive = true;
    this.port.onmessage = (e) => {
      // 片付けの合図。つないでいない処理器も、true を返すあいだ回り続けるので、
      // 外しただけでは止まらない(sound/filter.js と同じ決めごと)
      if (e.data && e.data.stop) { this.alive = false; return; }
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
    this.filt.fill(0, v * FW, (v + 1) * FW);
    this.mz.fill(0, v * MZ, (v + 1) * MZ);
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

  /**
   * ベルと胴の山の係数。パッチごとに、サンプリング周波数が変わったときだけ作る。
   * 胴の山は 2 次のピーキング、ベルは 2 次のハイパス(Q は dB)。聞くページが Web Audio の
   * BiquadFilter で掛けていたものと同じ式で、同じ順(胴の山のあとにベル)
   */
  coefs(d, sr, muted = false) {
    if (d._cs === sr) return d._c;
    const c = [];
    const peak = (f, q, g) => {
      const w = TAU * f / sr, cs = Math.cos(w), sn = Math.sin(w), A = Math.pow(10, g / 40), al = sn / (2 * q);
      const a0 = 1 + al / A;
      c.push([(1 + al * A) / a0, -2 * cs / a0, (1 - al * A) / a0, -2 * cs / a0, (1 - al / A) / a0]);
    };
    for (const pk of (d.body || []).slice(0, MF)) peak(pk.freq, 1 / (2 - 2 * Math.min(0.95, pk.resonance)), pk.gain);
    if (d.bell && !muted) {
      const w = TAU * d.bell.freq / sr, cs = Math.cos(w), sn = Math.sin(w);
      const qdb = 20 * Math.log10(1 / (2 - 2 * Math.min(0.95, d.bell.resonance)));
      const al = sn / (2 * Math.pow(10, qdb / 20)), a0 = 1 + al;
      c.push([(1 + cs) / 2 / a0, -(1 + cs) / a0, (1 + cs) / 2 / a0, -2 * cs / a0, (1 - al) / a0]);
    }
    d._c = c; d._cs = sr;
    return c;
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
    // いったん 1 声ぶんを置き場に書き、胴の山とベルを通してから足す。
    // ミュートはベルを差し替えるものなので、ミュートのときはベルの代わりにミュートを通す
    const mute = Math.round(d.mute || 0);
    const age0 = age;
    const buf = this.tmp;
    buf.fill(0);
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
      buf[i] = lv * (p * y * dip * sq + lp);
      age++;
    }
    const cf = this.coefs(d, sr, mute > 0), fz = this.filt;
    for (let k = 0; k < cf.length; k++) {
      const [b0, b1, b2, a1, a2] = cf[k], z = v * FW + 4 * k;
      let x1 = fz[z], x2 = fz[z + 1], y1 = fz[z + 2], y2 = fz[z + 3];
      for (let i = 0; i < B; i++) {
        const x = buf[i], y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
        x2 = x1; x1 = x; y2 = y1; y1 = y; buf[i] = y;
      }
      fz[z] = x1; fz[z + 1] = x2; fz[z + 2] = y1; fz[z + 3] = y2;
    }
    if (mute > 0) this.muted(v, mute, d, out, off, age0, sr);
    else for (let i = 0; i < B; i++) out[i] += buf[i];
    vo[o + PH] = ph; vo[o + P] = p; vo[o + AGE] = age; vo[o + LP] = lp;
    this.noise = nz;
    if (vo[o + GONE] && p < 1e-4) vo[o + ON] = 0;
  }

  /**
   * ミュートを通して out へ足す。置き場(this.tmp)に 1 声ぶんが書いてある。
   * 2 次の SVF(Simper の形)を段に並べる。段ごとに [g, k, m0, m1, m2] を c の at から 5 つ。
   * 鳴らしているあいだは確保しない(カップとハーモンの係数はパッチに 1 度だけ作って持つ)
   */
  muted(v, mute, d, out, off, age0, sr) {
    const buf = this.tmp;
    if (mute === 1 || mute === 2) {
      const key = mute === 1 ? '_cup' : '_harmon';
      if (!d[key] || d[key + 'Sr'] !== sr) {
        const c = new Float64Array(15);
        const list = mute === 1 ? MUTE_CUP : MUTE_HARMON;
        list.forEach((x, n) => muteSec(c, n * 5, x[0], x[1], x[2], x[3] || 0, sr));
        d[key] = c; d[key + 'Sr'] = sr;
      }
      for (let n = 0; n < 3; n++) this.svf(v, n, d[key], n * 5, off, B);
    } else {
      // プランジャー。SUB サンプルごとに、鳴りはじめからの時間で開き具合を決める
      const T = Math.max(1e-3, d.plungerTime || 0.15) * sr;
      const c = this.pc || (this.pc = new Float64Array(5));
      for (let i = off; i < B; i += SUB) {
        const x = Math.min(1, (age0 + i - off) / T);
        const s = x * x * (3 - 2 * x);
        muteSec(c, 0, 1, PLUNGER[0] * Math.pow(PLUNGER[1] / PLUNGER[0], s), PLUNGER[2] + s * (PLUNGER[3] - PLUNGER[2]), 0, sr);
        this.svf(v, 0, c, 0, i, Math.min(B, i + SUB));
      }
    }
    for (let i = off; i < B; i++) out[i] += buf[i];
  }

  /** 置き場の from から to までを、声 v の n 段目の SVF に通す */
  svf(v, n, c, at, from, to) {
    const buf = this.tmp, z = this.mz, zi = v * MZ + 2 * n;
    const g = c[at], k = c[at + 1], m0 = c[at + 2], m1 = c[at + 3], m2 = c[at + 4];
    const a1 = 1 / (1 + g * (g + k)), a2 = g * a1, a3 = g * a2;
    let ic1 = z[zi], ic2 = z[zi + 1];
    for (let i = from; i < to; i++) {
      const v0 = buf[i];
      const v3 = v0 - ic2;
      const v1 = a1 * ic1 + a2 * v3;
      const v2 = ic2 + a2 * ic1 + a3 * v3;
      ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2;
      buf[i] = m0 * v0 + m1 * v1 + m2 * v2;
    }
    z[zi] = ic1; z[zi + 1] = ic2;
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
    return this.alive;
  }
}
registerProcessor('${BRASS_NODE}', BrassBank);
`;

/**
 * パッチのパラメータ。`when` は効く条件で、決め方は sound/modal.js の MODAL_PARAMS と同じ
 * (`vib` が 0 なら `vibRate` は効かない、など)。
 * `live` は、鳴っている音の途中で動かして効くか。声の中のものはどれも効かない。
 * 声は鳴りはじめのパッチを持ち続け、差し替えは次の音から効く。
 * ベルと胴(BRASS_BELL、BRASS_BODY)も声の中で掛けるので、同じく次の音から効く(2026-10-26。前は声の外で途中でも効いた)。
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
  mute: { live: false, min: 0, max: 3, step: 1,
    desc: 'Mute in the bell, rounded to a whole number. 0 open. 1 cup mute: round and muffled, both the lows and the highs cut. 2 harmon mute with the stem out, as Miles Davis played it: thin, nasal and buzzy, the lows cut hard. 3 plunger: each note starts closed and dark ("oo") and opens over plungerTime ("ah"), the wah-wah of a hand moving the plunger away from the bell. The filter shapes are guesses, not fitted to recordings.' },
  plungerTime: { live: false, min: 0.02, max: 1, unit: 's', when: [{ key: 'mute', gt: 2 }],
    desc: 'How long the plunger takes to open, from the start of each note.' },
  keyGain: { live: false, min: -12, max: 12, unit: 'dB',
    desc: 'Level change per octave above A4. Positive makes low notes quieter, as on a real trumpet, whose low register speaks softly at every dynamic.' },
  level:  { live: false, min: 0.01, max: 4,
    desc: 'Output level of this patch.' },
};

/**
 * 胴の共鳴。音程によらない山。処理器の中で 1 声ずつ掛ける(最大 4 つ)。
 * サックスの「ホンク」と「エッジ」はここで決まる。
 * 係数は音の鳴りはじめに作るので、鳴っている途中で動かしても次の音から効く
 */
export const BRASS_BODY = {
  freq: { live: false, min: 100, max: 6000, unit: 'Hz',
    desc: 'Centre of the resonance.' },
  gain: { live: false, min: -18, max: 18, unit: 'dB',
    desc: 'How much it lifts or cuts at the centre.' },
  resonance: { live: false, min: 0, max: 0.95,
    desc: 'How narrow the peak is. 0 is broad.' },
};

/**
 * ベル。山の付いた 2 次のハイパスを、処理器の中で 1 声ずつ掛ける。
 * `resonance` は 0〜1 で、Q = 1 / (2 − 2 × resonance)(声の外のフィルタと同じ決め方)。
 * 係数は音の鳴りはじめに作るので、鳴っている途中で動かしても次の音から効く
 */
export const BRASS_BELL = {
  freq: { live: false, min: 100, max: 4000, unit: 'Hz',
    desc: 'Where the bell starts to let sound out. Below it, sound is held back.' },
  resonance: { live: false, min: 0, max: 0.95,
    desc: 'Height of the peak at that point. 0 is no peak.' },
};

/**
 * `range` はその楽器で意味のある範囲(推奨範囲)。決め方は sound/modal.js の MODAL_PATCHES と同じ。
 * ベルは `bell.`、胴の山は `body.0.` のように場所で書く。値はどれも見当
 */
export const BRASS_PATCHES = {
  trumpet: {
    version: '1.00',
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
    mute: 0, plungerTime: 0.15,
    bell: { freq: 1100, resonance: 0.72 },
    range: {
      brass: [25, 40], brassKey: [1, 2], curve: [1.1, 2.2], attack: [0.012, 0.05], blat: [0.1, 0.45], release: [0.03, 0.12],
      scoop: [-80, 0], scoopTime: [0.015, 0.07], vib: [0, 35], vibRate: [4.5, 6.5], vibDelay: [0.15, 0.7],
      tongue: [0.1, 0.4], breath: [0.01, 0.06], airCurve: [0.8, 1.2], airPulse: [0, 0.3], level: [0.02, 0.12],
      push: [0, 0.8], pushTime: [0.04, 0.15], crack: [0, 0.4], crackTime: [0.012, 0.05], pedal: [110, 120], crackSeed: [1, 9999], wobble: [0, 1], squeak: [0, 0], keyGain: [2, 7],
      mute: [0, 3], plungerTime: [0.05, 0.4],
      'bell.freq': [800, 1800], 'bell.resonance': [0.5, 0.85],
    },
  },
  trombone: {
    version: '1.00',
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
    mute: 0, plungerTime: 0.2,
    bell: { freq: 565, resonance: 0.472 },
    range: {
      brass: [12, 30], brassKey: [1, 2], curve: [1.2, 2.4], attack: [0.03, 0.1], blat: [0.05, 0.3], release: [0.05, 0.15],
      scoop: [-60, 0], scoopTime: [0.02, 0.09], vib: [0, 20], vibRate: [4, 6], vibDelay: [0.3, 0.9],
      tongue: [0.08, 0.3], breath: [0.01, 0.05], airCurve: [0.8, 1.2], airPulse: [0, 0.3], level: [0.1, 0.35],
      push: [0, 0.7], pushTime: [0.05, 0.2], crack: [0, 0.3], crackTime: [0.03, 0.08], pedal: [55, 62], crackSeed: [1, 9999], wobble: [0, 0.8], squeak: [0, 0], keyGain: [2, 6],
      mute: [0, 3], plungerTime: [0.05, 0.5],
      'bell.freq': [300, 800], 'bell.resonance': [0.3, 0.7],
    },
  },
  tuba: {
    desc: 'Tuba, the big B-flat one. The lowest of the brass: dark and round even when pushed, slow to speak, with a soft, wide blat at the front. Made by ear from the trombone, not yet fitted to recordings.',
    // 伊福部ふうの低いユニゾンに要る(2026-10-25)。トロンボーンを元に、耳での見当で作った。録音とは比べていない。
    // 管が太く長いので、強く吹いてもトロンボーンほど明るくならない(brass を下げる)。
    // ベルの山は低く、なだらかに。立ち上がりは遅く、出だしのブワッ(blat)は柔らかく広い。
    // 管のいちばん低い倍音は B♭0(29.1Hz。B♭ のチューバ)。
    // アイオワ大学の録音(C1〜C3 を 3 つの強さ)に寄せた(2026-10-26)。録音は音の高さによらず、
    // 450Hz あたりに山があり、1.4kHz あたりから上が落ちる。胴の山を 2 つ置いた。
    // 倍音 1〜16 の強さと音域ごとの大きさの差は 7.36 → 5.04。残りの多くは pp の明るさと、強さによる大きさの開き
    // (録音は pp から ff で 30dB 開くが、こちらは 15dB ほど)。胴の山で 5.5dB 大きくなったぶん、level を 0.18 → 0.095 にした
    brass: 10.2, brassKey: 1.42, curve: 2.4, attack: 0.1, blat: 0.12, release: 0.12,
    scoop: -20, scoopTime: 0.06, vib: 6, vibRate: 4.6, vibDelay: 0.6,
    tongue: 0.15, breath: 0.1, airCurve: 1, airPulse: 0, level: 0.095,
    push: 0.25, pushTime: 0.12, crack: 0.05, crackTime: 0.06, pedal: 29.1, crackSeed: 1, wobble: 0.1, squeak: 0,
    keyGain: -2.25,
    bell: { freq: 342, resonance: 0 },
    body: [{ freq: 454, gain: 4.65, resonance: 0.7 }, { freq: 1440, gain: -5.66, resonance: 0.165 }],
    mute: 0, plungerTime: 0.15,
    dev: ['wip'],
    devNote: 'チューバ。制作中。アイオワ大学の録音(C1〜C3)に合わせた(誤差 7.36 → 5.04)。弱く吹いたときの明るさと、強弱による大きさの開き(録音は pp から ff で 30dB、こちらは 15dB ほど)がまだ合っていない',
    range: {
      mute: [0, 3], plungerTime: [0.15, 0.15],
      brass: [8, 20], brassKey: [1, 2], curve: [1.4, 2.8], attack: [0.05, 0.15], blat: [0.05, 0.25], release: [0.06, 0.2],
      scoop: [-50, 0], scoopTime: [0.03, 0.1], vib: [0, 15], vibRate: [4, 5.5], vibDelay: [0.4, 1],
      tongue: [0.08, 0.25], breath: [0.03, 0.12], airCurve: [0.8, 1.2], airPulse: [0, 0.3], level: [0.05, 0.3],
      push: [0, 0.5], pushTime: [0.06, 0.2], crack: [0, 0.15], crackTime: [0.03, 0.1], pedal: [27, 32], crackSeed: [1, 9999], wobble: [0, 0.5], squeak: [0, 0], keyGain: [-4, 4],
      'bell.freq': [200, 500], 'bell.resonance': [0, 0.6],
      'body.0.freq': [350, 550], 'body.0.gain': [0, 10], 'body.0.resonance': [0.4, 0.85], 'body.1.freq': [1000, 2000], 'body.1.gain': [-10, 0], 'body.1.resonance': [0, 0.5],
    },
  },
  // ここから下は、伊福部ふうの低いユニゾンのページに楽器を揃えるため、粗く作ったもの(2026-10-25)。
  // どれも耳での見当で、録音と比べていない。完成度は低くてよいと言われた。dev の wip を付けてある
  bassoon: {
    desc: 'Bassoon, a work in progress. A double reed: reedy and a little nasal, round in the low register. Made roughly by ear, not fitted to recordings.',
    // ダブルリードの木管。サックスの作りを借りて、胴に山を置いた。
    // アイオワ大学の録音(C2〜C5 を 3 つの強さ)に寄せた(2026-10-26)。録音は音の高さによらず、
    // 500Hz あたりに強く狭い山があり、750Hz あたりで凹み、1.2kHz あたりにもう 1 つ山がある。
    // 倍音 1〜16 の強さと音域ごとの大きさの差は 7.17 → 4.63。残りの多くは C2 の明るさ(録音のほうが明るい)と、
    // C5 と pp の大きさ。胴の山で 6dB 大きくなったぶん、level を 0.1 → 0.05 にして前の大きさに戻した
    brass: 9, brassKey: 1.04, curve: 1.27, attack: 0.05, blat: 0.03, release: 0.08,
    scoop: -15, scoopTime: 0.04, vib: 8, vibRate: 5, vibDelay: 0.4,
    tongue: 0.12, breath: 0.064, airCurve: 0.5, airPulse: 0.5, level: 0.05,
    push: 0.15, pushTime: 0.08, crack: 0.02, crackTime: 0.04, pedal: 58.3, crackSeed: 1, wobble: 0.1, squeak: 0,
    keyGain: -1.2,
    bell: { freq: 231, resonance: 0.06 },
    body: [{ freq: 513, gain: 17.3, resonance: 0.72 }, { freq: 1234, gain: 5.4, resonance: 0.77 }, { freq: 766, gain: -7.4, resonance: 0.64 }],
    mute: 0, plungerTime: 0.15,
    dev: ['wip'],
    devNote: 'ファゴット。制作中。アイオワ大学の録音(C2〜C5)に合わせた(誤差 7.17 → 4.63)。C2 の明るさ(録音のほうが明るい)と、C5 と pp の大きさがまだ合っていない',
    range: {
      mute: [0, 0], plungerTime: [0.15, 0.15],
      brass: [6, 16], brassKey: [0.5, 1.5], curve: [1, 2], attack: [0.03, 0.1], blat: [0, 0.1], release: [0.05, 0.15],
      scoop: [-40, 0], scoopTime: [0.02, 0.08], vib: [0, 20], vibRate: [4.5, 6], vibDelay: [0.2, 0.6],
      tongue: [0.05, 0.2], breath: [0.02, 0.12], airCurve: [0.3, 0.8], airPulse: [0.2, 0.8], level: [0.05, 0.2],
      push: [0, 0.3], pushTime: [0.04, 0.12], crack: [0, 0.1], crackTime: [0.02, 0.08], pedal: [55, 62], crackSeed: [1, 9999], wobble: [0, 0.3], squeak: [0, 0.05], keyGain: [-4, 4],
      'bell.freq': [150, 350], 'bell.resonance': [0, 0.3],
      'body.0.freq': [450, 600], 'body.0.gain': [10, 18], 'body.0.resonance': [0.5, 0.85], 'body.1.freq': [1000, 1500], 'body.1.gain': [0, 10], 'body.1.resonance': [0.5, 0.9],
      'body.2.freq': [650, 900], 'body.2.gain': [-14, 0], 'body.2.resonance': [0.4, 0.8],
    },
  },
  bassClarinet: {
    desc: 'Bass clarinet, a work in progress. A single reed in a straight bore: dark, woody and hollow in the low register, with no vibrato. Made roughly by ear, not fitted to recordings.',
    // 円柱の管なので、低い音域では奇数の倍音が強く、偶数が弱い。今の作りでは倍音ごとに分けられないので、
    // 暗めにして、胴の山で木の響きを付けただけ。ビブラートは掛けない(クラリネットはふつう掛けない)
    brass: 8, brassKey: 0.6, curve: 1.5, attack: 0.04, blat: 0.02, release: 0.08,
    scoop: -10, scoopTime: 0.03, vib: 0, vibRate: 5, vibDelay: 0.5,
    tongue: 0.1, breath: 0.05, airCurve: 0.5, airPulse: 0.4, level: 0.1,
    push: 0.1, pushTime: 0.08, crack: 0.02, crackTime: 0.04, pedal: 77.8, crackSeed: 1, wobble: 0.05, squeak: 0.02,
    keyGain: 0,
    bell: { freq: 100, resonance: 0 },
    body: [{ freq: 350, gain: 5, resonance: 0.5 }, { freq: 1500, gain: 4, resonance: 0.4 }],
    mute: 0, plungerTime: 0.15,
    dev: ['wip'],
    devNote: 'バスクラリネット。制作中。耳での見当で、録音と比べていない。低い音域で奇数の倍音が強い形を、今の仕組みでは表せない',
    range: {
      mute: [0, 0], plungerTime: [0.15, 0.15],
      brass: [5, 14], brassKey: [0.3, 1.2], curve: [1.2, 2], attack: [0.02, 0.08], blat: [0, 0.1], release: [0.05, 0.15],
      scoop: [-30, 0], scoopTime: [0.02, 0.06], vib: [0, 5], vibRate: [4.5, 6], vibDelay: [0.3, 0.8],
      tongue: [0.05, 0.2], breath: [0.02, 0.1], airCurve: [0.3, 0.8], airPulse: [0.2, 0.7], level: [0.05, 0.2],
      push: [0, 0.3], pushTime: [0.04, 0.12], crack: [0, 0.1], crackTime: [0.02, 0.08], pedal: [70, 82], crackSeed: [1, 9999], wobble: [0, 0.2], squeak: [0, 0.1], keyGain: [-4, 4],
      'bell.freq': [100, 200], 'bell.resonance': [0, 0.3],
      'body.0.freq': [250, 500], 'body.0.gain': [0, 12], 'body.0.resonance': [0.2, 0.8], 'body.1.freq': [1000, 2000], 'body.1.gain': [0, 10], 'body.1.resonance': [0.2, 0.7],
    },
  },
  // 弓で弾く弦は、ほんとうは別の作りが要る(docs/STUDY_PIZZICATO_FIVE_ACOUSTIC.md)。それまでの代わりに、
  // 息の楽器の作りで、明るく鳴らし続ける音(ノコギリ波に近い)と、弓の擦れ(breath)と、胴の山で真似る
  cello: {
    desc: 'Cello, bowed, a stand-in and a work in progress. A bright, sustained string tone with bow noise and a late vibrato, made with the wind instrument engine until a proper bowed string exists. Not fitted to recordings.',
    brass: 30, brassKey: 0.5, curve: 1.3, attack: 0.08, blat: 0, release: 0.15,
    scoop: 0, scoopTime: 0.03, vib: 18, vibRate: 5.5, vibDelay: 0.25,
    tongue: 0.04, breath: 0.04, airCurve: 0.6, airPulse: 0.3, level: 0.08,
    push: 0.1, pushTime: 0.1, crack: 0, crackTime: 0.03, pedal: 65.4, crackSeed: 1, wobble: 0, squeak: 0,
    keyGain: 0,
    bell: { freq: 100, resonance: 0 },
    body: [{ freq: 230, gain: 6, resonance: 0.5 }, { freq: 2200, gain: 4, resonance: 0.3 }],
    mute: 0, plungerTime: 0.15,
    dev: ['wip'],
    devNote: 'チェロ(弓)。仮のもの。弓で弾く弦の作りが無いので、息の楽器の仕組みで真似ている。録音と比べていない',
    range: {
      mute: [0, 0], plungerTime: [0.15, 0.15],
      brass: [15, 40], brassKey: [0.2, 1], curve: [1, 2], attack: [0.04, 0.2], blat: [0, 0], release: [0.08, 0.3],
      scoop: [-20, 0], scoopTime: [0.02, 0.06], vib: [0, 30], vibRate: [4.5, 6.5], vibDelay: [0.1, 0.5],
      tongue: [0, 0.1], breath: [0.01, 0.08], airCurve: [0.3, 1], airPulse: [0, 0.5], level: [0.04, 0.16],
      push: [0, 0.2], pushTime: [0.05, 0.15], crack: [0, 0], crackTime: [0.02, 0.05], pedal: [60, 70], crackSeed: [1, 9999], wobble: [0, 0], squeak: [0, 0], keyGain: [-4, 4],
      'bell.freq': [100, 200], 'bell.resonance': [0, 0.3],
      'body.0.freq': [150, 350], 'body.0.gain': [0, 12], 'body.0.resonance': [0.2, 0.8], 'body.1.freq': [1500, 3000], 'body.1.gain': [0, 10], 'body.1.resonance': [0.2, 0.7],
    },
  },
  contrabass: {
    desc: 'Double bass, bowed, a stand-in and a work in progress. Like the cello an octave lower: a deep, buzzing bowed tone with plenty of bow noise. Made with the wind instrument engine until a proper bowed string exists. Not fitted to recordings.',
    brass: 26, brassKey: 0.5, curve: 1.3, attack: 0.12, blat: 0, release: 0.2,
    scoop: 0, scoopTime: 0.03, vib: 12, vibRate: 5, vibDelay: 0.35,
    tongue: 0.04, breath: 0.05, airCurve: 0.6, airPulse: 0.3, level: 0.1,
    push: 0.1, pushTime: 0.12, crack: 0, crackTime: 0.03, pedal: 41.2, crackSeed: 1, wobble: 0, squeak: 0,
    keyGain: 0,
    bell: { freq: 100, resonance: 0 },
    body: [{ freq: 130, gain: 6, resonance: 0.5 }, { freq: 1500, gain: 3, resonance: 0.3 }],
    mute: 0, plungerTime: 0.15,
    dev: ['wip'],
    devNote: 'コントラバス(弓)。仮のもの。チェロと同じく息の楽器の仕組みで真似ている。録音と比べていない',
    range: {
      mute: [0, 0], plungerTime: [0.15, 0.15],
      brass: [15, 40], brassKey: [0.2, 1], curve: [1, 2], attack: [0.06, 0.25], blat: [0, 0], release: [0.1, 0.4],
      scoop: [-20, 0], scoopTime: [0.02, 0.06], vib: [0, 25], vibRate: [4, 6], vibDelay: [0.15, 0.6],
      tongue: [0, 0.1], breath: [0.02, 0.1], airCurve: [0.3, 1], airPulse: [0, 0.5], level: [0.05, 0.2],
      push: [0, 0.2], pushTime: [0.05, 0.2], crack: [0, 0], crackTime: [0.02, 0.05], pedal: [38, 44], crackSeed: [1, 9999], wobble: [0, 0], squeak: [0, 0], keyGain: [-4, 4],
      'bell.freq': [100, 200], 'bell.resonance': [0, 0.3],
      'body.0.freq': [100, 200], 'body.0.gain': [0, 12], 'body.0.resonance': [0.2, 0.8], 'body.1.freq': [1000, 2000], 'body.1.gain': [0, 10], 'body.1.resonance': [0.2, 0.7],
    },
  },
  tenor: {
    version: '1.00',
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
    // サックスにミュートは差さないが、パラメータは全部の楽器が持つ決まりなので 0 で持つ
    mute: 0, plungerTime: 0.15,
    bell: { freq: 120, resonance: 0 },
    body: [{ freq: 700, gain: 7.34, resonance: 0.84 }, { freq: 1900, gain: 9, resonance: 0.549 }],
    range: {
      brass: [9, 20], brassKey: [0.3, 1.2], curve: [1.2, 2], attack: [0.025, 0.08], blat: [0, 0.15], release: [0.05, 0.15],
      scoop: [-120, -10], scoopTime: [0.03, 0.1], vib: [8, 40], vibRate: [4.5, 6], vibDelay: [0.15, 0.5],
      tongue: [0.05, 0.2], breath: [0.05, 0.2], airCurve: [0.25, 0.7], airPulse: [0.5, 1], level: [0.05, 0.18],
      push: [0, 0.6], pushTime: [0.04, 0.15], crack: [0, 0.2], crackTime: [0.03, 0.08], pedal: [100, 108], crackSeed: [1, 9999], wobble: [0, 0.6], squeak: [0, 0.2], keyGain: [-8, 2],
      mute: [0, 0], plungerTime: [0.15, 0.15],
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
  // ベルと胴の山も、処理器の中で 1 声ずつ掛ける(2026-10-26。前は聞くページだけが混ぜたあとに掛けていて、
  // MML から鳴らすと掛かっていなかった)
  if (def.bell) out.bell = { freq: def.bell.freq, resonance: def.bell.resonance ?? 0 };
  if (def.body) out.body = def.body.map((pk) => ({ freq: pk.freq, gain: pk.gain ?? 0, resonance: pk.resonance ?? 0 }));
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
