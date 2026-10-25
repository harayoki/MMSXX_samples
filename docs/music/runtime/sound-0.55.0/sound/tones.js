// 音色。波形に「フレームごとの表」を着せたもの。
//
// ---- なぜ要るのか ----
//
// チップチューンらしい音は、1 フレーム(60 分の 1 秒)ごとに数を書き換えて
// 作られている。高さを回して和音に聞かせる(分散和音)、少しずつ上げ下げして
// 唸らせる、音量を刻んで減らす — 全部おなじ作りで、表を 1 つずつ読むだけ。
//
// `@e` のエンベロープは音の長さに対する割合なので、これとは別のもの。
// 短い音では速く、長い音ではゆっくり動く。楽器らしいが、
// チップチューンはそうではない。両方持つ。
//
// ---- 呼び方 ----
//
// 新しい命令を増やさない。登録した名前を `@{名前}` で呼ぶ。
// 波形を呼ぶのと同じ書き方なので、MML 側は何も知らなくてよい。
//
//     registerTone('myPluck', { wave: 'pulse(25)', vol: [15, 11, 8, 5, 3, 1] });
//     // MML:  @{myPluck} c4
//
// ---- 幅の表だけ、鳴らす道が違う ----
//
// 高さと音量には回せるつまみがあるが、幅にはつまみが無い
// (波の形そのものなので、発振器に載せた時点で焼き付く)。
// そのため `duty:` を書いた音色だけは AudioWorklet を通る。
// 書きかたは他の表と同じで、違うのは中の道だけ(sound/duty.js)。

import { WAVEFORMS, ENVELOPES, roleOf, stealOf, metaOf, toneOf, findWave, dutyMoves } from './mml.js';

/** 表が 1 つ進む時間。画面の書き換えと同じ 60 分の 1 秒 */
export const TONE_FRAME = 1 / 60;

/** 名前から波形を引く。別名も見る(sound/mml.js の findWave) */
const waveByName = (name) => findWave(name);

/**
 * 音色を登録する。`@{名前}` で呼べるようになる。
 *
 * @param {string} name
 * @param {{wave?:string, env?:string,
 *          arp?:number[], pitch?:number[], vol?:number[],
 *          loop?:{arp?:number, pitch?:number, vol?:number},
 *          vib?:{depth?:number, speed?:number, delay?:number},
 *          overwrite?:boolean}} spec
 *   wave  = 元になる形(既定 `pulse(50)`)
 *   env   = 既定のエンベロープ。`@e{...}` で上から変えられる
 *   arp   = 高さの表(半音)。1 フレームずつ読む
 *   pitch = 細かい高さの表(セント)
 *   vol   = 音量の表(0〜15)。あるとこちらがエンベロープより勝つ
 *   duty  = 幅の表(0〜1)。0.125 なら 12.5%。矩形波にしか効かない
 *   dutyLfo = 幅の LFO。{ center, depth, speed, delay }。行って戻るだけなら表より安い
 *   loop  = 表ごとの戻る位置。無ければ最後の値のまま止まる
 *   vib   = ビブラート。delay はフレーム数。遅れてから出るのがチップチューンの顔
 * @returns {number} 波形の番号
 */
export function registerTone(name, spec = {}) {
  const at = waveByName(name);
  if (at >= 0 && !spec.overwrite) {
    throw new Error(`[ChpTnSnd] 音色 "${name}" はもう登録されています`
      + '(差し替えるなら overwrite: true を渡してください)');
  }
  const base = WAVEFORMS[waveByName(spec.wave || 'pulse(50)')] || WAVEFORMS[2];
  const tone = toneOf(spec, base, name) || {
    arp: null, pitch: null, vol: null, duty: null, loop: {}, vib: null,
  };
  // **土台の中身は数え上げずに全部継ぐ。**
  //
  // ---- 数え上げると必ず漏れる ----
  //
  // ここは前まで「継ぐもの」を 1 つずつ書いていた。`kind` ごとに要るものが
  // 違うので、音源を足すたびに書き足すことになり、2 度漏れた。
  //
  // 1 度目は 2 オペ FM の `ratio`。`wave: 'opll::violin'` のように FM を土台に
  // すると `freq * undefined` が NaN になって落ちた。
  // 2 度目は OPLL の `inst` / `set` / `voice` と `special`。
  // `@{opll::opllpTomTom}` を土台にすると、`kind` は `opll` のままなのに音色番号が
  // 消えて、鳴らす側が何を書き込めばよいか分からなくなる(2026-09-30)。
  //
  // 下流は `kind` を見て分岐する。**`kind` を継ぐなら中身も全部継ぐ**のが
  // 1 本の決まりで済む。
  //
  // ---- 継がないもの ----
  //
  // 説明と札は継がない。別の音色なのに同じ説明が付くと、一覧で見分けられない。
  // `preset`(最初から入っていたか)も継がない。あとから足したものは自作。
  // `id` と `name` と `tone` はここで決めるもの。`role` は下で継ぐ
  // (書いてあればそちらが勝つ)
  const { id: _id, name: _name, tone: _tone, role: _role, preset: _preset,
    desc: _desc, descJa: _descJa, tags: _tags, genre: _genre, dev: _dev,
    ...inherited } = base;
  const entry = {
    ...inherited,
    id: at >= 0 ? at : WAVEFORMS.length,
    name,
    // ロール。書いていなければ元の形のものを継ぐ
    role: roleOf(spec.role, name) ?? base.role ?? null,
    ...metaOf(spec),
    // 声の取り合いの目安も継ぐ。`metaOf` は書いていなければ null を返すので、
    // ここで継がないと、土台の音色を包んだとたんに「決めていない」へ戻る
    // (`special` と同じ漏れ方。2026-10-03)
    steal: stealOf(spec.steal, name) ?? base.steal ?? null,
    tone,
  };
  // **鳴らし方の印は継ぐ。**`metaOf` は書いていないものを空の並びで返すので、
  // 土台が持っていた `special` がそこで消える。あれは説明や札とは違って
  // 音の出し方そのもので、OPLL や常駐の処理器へ回す印が入っている。
  // 落とすと、その音色だけ鳴らなくなる(2026-09-30)
  if (!entry.special.length && base.special && base.special.length) {
    entry.special = [...base.special];
  }
  // 幅の表を持つ音色も中で計算している。幅には回せるつまみが無いので、
  // 発振器では作れず、常駐の処理器へ音符を渡すことになる。
  // 書き忘れようがないよう、ここで付ける
  if (dutyMoves(tone)) {
    entry.special = [...new Set((entry.special || []).concat('worklet'))];
  }
  // **音量の段数と曲線も継ぐ。**`metaOf` は書いていなければ 0 と `curve` を返すので、
  // ここで継がないとチップの段が消える(`special` `steal` と同じ漏れ方)。
  // `nesLead` のような表を着せた音色が「段を持たない」と名乗っていて、実機の
  // ドライバを書く人が「ファミコンの矩形波は 4 ビットの音量を持つはずなのに
  // steps が 0 なのはなぜか」と聞いてきた(2026-10-20)
  if (spec.vsteps === undefined && base.vsteps !== undefined) entry.vsteps = base.vsteps;
  if (spec.vcurve === undefined && base.vcurve !== undefined) entry.vcurve = base.vcurve;
  if (spec.env) {
    const e = ENVELOPES.findIndex((x) => x.name === spec.env);
    if (e >= 0) entry.defaultEnv = e;
  } else if (base.defaultEnv !== undefined) {
    entry.defaultEnv = base.defaultEnv;
  }
  if (at >= 0) WAVEFORMS[at] = entry; else WAVEFORMS.push(entry);
  return entry.id;
}

/**
 * 表を読む。戻る位置があれば回り、無ければ最後で止まる。
 * @returns {number} その位置の値
 */
export function readTable(table, frame, loop) {
  if (!table || !table.length) return 0;
  if (frame < table.length) return table[frame];
  if (loop == null || loop < 0 || loop >= table.length) return table[table.length - 1];
  const span = table.length - loop;
  return table[loop + (frame - loop) % span];
}

/**
 * 最初から入れておく音色。何ができるかが分かる数だけ。
 *
 * 名前は `tone` で始める(波形メモリの `wave`、合成音色の `layer`、
 * 焼いたものの `baked` と同じ考え方)。
 *
 * **略さない。**もとは `tn` だった。2 文字にして得るものが無く、読む側は
 * 毎回それが何かを考えることになる(2026-09-29 に `wt` `ly` `bk` ごと直した)。
 * `fm` `fds` `opll` `ay` `nes` はそのままにしてある。あちらは略語ではなく、
 * もの自体の名前だから。
 *
 * `tone` が何かを言っていないのは承知している。186 件ぜんぶ音色なので、
 * ここを他と分けているのはフレームごとの表を持っていることのほうが正しい。
 * それでも書く側が目にする文字なので、読める語を選んだ。
 */
export const TONE_PRESETS = {
  // 分散和音。**2 軍。**値は残してあるが、MML からは使えない。
  //
  // 前は 10 個あった。作り分けに引数が無かった時期のもので、`chord` という
  // 1 本の軸に 3 つのことが詰まっていた —— 和音の形(major / minor)、矩形波の
  // 幅(`hard` が 12.5% のことだった)、1 段のフレーム数(名前が `toneArp` と
  // `toneArpSlow` に分かれていた)。
  //
  // 軸へ割り直すことも考えたが、やめた。土台に選べる形に限りが無く
  // (幅 3 つを並べても三角波や波形メモリの話がすぐ出る)、和音の形も
  // 半音の並びなので引数 1 つでは渡せない。1 つの音色のために仕掛けを
  // 足しつづけることになるので、音色としては置かないことにした(2026-10-17)。
  //
  // 書きたい人は表を並べれば書ける。それで足りる。
  //
  //     #voice myArp  = @{pulse(50)} @arp{0,4,7} @loop{arp 0} @role{arp}
  //     #voice myMinor = @{pulse(12)} @arp{0,3,7} @loop{arp 0} @role{arp}
  //     #voice myWide  = @{pulse(12)} @arp{0,7,12} @loop{arp 0} @role{arp}
  //     #voice mySlow  = @{pulse(12)} @arp{0,0,4,4,7,7} @loop{arp 0} @role{arp}
  toneArp:       {
                 descJa: '長三和音を 1 フレームずつ回して、和音に聞かせる',
                 dev: ['wip'], role: 'arp', draft: true,
                 desc: 'A major triad spun one frame per step, the way a machine with few channels '
                     + 'fakes harmony.',
                 wave: 'pulse(50)', env: 'flat', arp: [0, 4, 7], loop: { arp: 0 } },
  // 遅れて出るビブラート。押した瞬間は真っ直ぐで、伸ばすと揺れ出す。
  // チップチューンのリードの顔
  toneLead:      {
                 descJa: '押してから 18 フレーム待って揺れ出すビブラート。真っ直ぐ入って途中から揺れるのが、チップチューンのリードの顔',
                 role: 'lead',
                 desc: 'Vibrato that only starts after you hold the note (18 frames). The straight attack followed by a wobble is the signature chiptune lead.', wave: 'pulse(25)', env: 'flat',
                 vib: { depth: 35, speed: 6, delay: 18 } },
  // 幅の表。矩形波の幅を 1 フレームずつ動かす。高さも音量も変わらないので、
  // 音色だけが動く — 他の表では出せない動き(sound/duty.js)
  //
  // 幅は 0〜1。0.5 が矩形波で、そこから離れるほど細く尖る。
  // 0.25 と 0.75 は同じ音(上下が逆なだけ)なので、下半分だけ使えば足りる。
  //
  // ---- 段は 12.5 / 25 / 50% だけ使う ----
  //
  // ファミコンの幅は 4 段で、そのうち 75% は 25% と同じ音。
  // 細かい値を書いても `nesDutyIndex()` が 4 段へ丸めるので、実機では
  // 別の形になる。前は 9 段で 0.06 から 0.5 へ開く表を置いていたが、
  // NES へ出すと同じ値が 4 フレーム続いて階段 3 段に潰れていた(2026-10-18)。

  nesDutyOpen:   {
                 descJa: '幅が細いところから始まって、9 フレームで矩形波まで広がって止まる。高さも音量も動かさずに、頭だけ口を開けたように聞こえる',
                 role: 'lead', tags: ['nes', 'duty'],
                 desc: 'The pulse starts thin and widens to a square over nine frames, then stays. Gives the attack a vowel-like opening without touching pitch or volume.',
                 wave: 'nesPulse(25)', env: 'flat',
                 duty: [0.125, 0.125, 0.125, 0.125, 0.25, 0.25, 0.25, 0.5, 0.5] },
  // 行って戻る。ゆっくり回すと、声が 2 本あるように聞こえる(実機の PWM)
  nesDutyPWM:    {
                 descJa: '幅が 24 フレーム(約 2.5 Hz)かけて行って戻る。遅いので音色の変化というより、声が 2 本あって唸っているように聞こえる。実機の PWM の音',
                 role: 'chord', tags: ['nes', 'duty'],
                 desc: 'The width sweeps out and back over 24 frames (about 2.5 Hz). Slow enough to hear as two voices beating rather than as a timbre — the pulse-width modulation sound.',
                 wave: 'nesPulse(25)', env: 'flat',
                 dutyLfo: { center: 0.30, depth: 0.20, speed: 2.5 } },
  // 幅で「頭」を作る。戻る位置を書かないので、最後の値で止まる。
  //
  // 表を回すのとはまったく別の使い方で、こちらはエンベロープと同じ仕事を
  // 音量ではなく幅でやっている。音量を動かさずに「叩いた感じ」が出せるので、
  // 三角波に音量つまみが無い機械でも効く、というのが本来の値打ち
  nesDutyAtk:    {
                 descJa: '頭の 2 フレームだけ幅 50%、そのあとは 25%。音量はまったく動かさずに、頭が硬くなる。速い譜面ほど効く',
                 role: 'lead', tags: ['nes', 'duty'],
                 desc: 'Fifty per cent for the first two frames, then twenty-five. The volume never moves, yet every note arrives with a hard edge. The faster the line, the more it does.',
                 wave: 'nesPulse(25)', env: 'flat',
                 duty: [0.5, 0.5, 0.25] },
  // 滑り込む入り。下から定位置へ 4 フレームで上がる。
  // 音符ごとに掛かるので、速い譜面ほど効く
  toneSlideIn:   {
                 descJa: '2 半音下から 4 フレームで定位置へ上がる。押した音が一段下から滑り込んでくるので、速い譜面ほど生きる',
                 role: 'lead',
                 desc: 'Every note slides up into place from two semitones below over four frames. The faster the line, the more it does.',
                 wave: 'pulse(25)', env: 'flat',
                 slide: { cents: -200, frames: 4 } },
  // 3 つ重ね。滑り込んで、幅が開いて、遅れて揺れる。
  // どれも 1 つずつは地味だが、順に起きると 1 本の音として聞こえる
  nesLead:       {
                 descJa: '滑り込みと幅開きと遅れたビブラートを重ねたもの。押した瞬間は細くて低く、伸ばすうちに太く真っ直ぐになり、最後に揺れ出す。PSG のリードでいちばん気持ちのよい形',
                 role: 'lead', tags: ['nes', 'duty'],
                 desc: 'A slide-in, a widening pulse and a delayed vibrato stacked. It arrives thin and flat, fills out as you hold it, then starts to wobble — the most satisfying shape a PSG lead takes.',
                 wave: 'nesPulse(25)', env: 'flat',
                 slide: { cents: -150, frames: 3 },
                 duty: [0.125, 0.125, 0.125, 0.25, 0.25],
                 vib: { depth: 28, speed: 6, delay: 20 } },
  // 息づく和音。幅がゆっくり往復するので、伸ばすほど中で動く
  nesBreathPad:  {
                 descJa: '幅が 18 フレームかけて開いて閉じる。伸ばした和音の中でゆっくり動くので、同じ音を長く置いても飽きない',
                 role: 'chord', tags: ['nes', 'duty'],
                 desc: 'The width opens and closes over eighteen frames. A held chord keeps moving inside itself, so it does not go stale.',
                 wave: 'nesPulse(25)', env: 'soft',
                 dutyLfo: { center: 0.32, depth: 0.18, speed: 3.3 },
                 vib: { depth: 21, speed: 4, delay: 30 } },
  // 和音を敷くためのもの。全音符くらい置く前提なので、ゆっくり入ってよい。
  // 短い音符で使うと揺れはじめる前に終わるが、それは使いどころが違うだけ
  tonePadStrings: {
                 descJa: '30 フレーム待ってから、浅く長く揺れはじめる。'
                     + '弦を何本も重ねたときのうねりに寄せたもので、伸ばすほど効く',
                 role: 'chord',
                 desc: 'Waits thirty frames, then a shallow slow waver \u2014 the beating of several '
                     + 'string players not quite together. The longer you hold it the more it does.',
                 wave: 'pulse(25)', env: 'strings',
                 vib: { depth: 21, speed: 4.2, delay: 30 } },
};

/**
 * 最初から入れておく(ChipTuneSound が読み込まれるときに走る)。
 *
 * 二度呼ばれても止まらない。画面の側が音を鳴らす前に名前を知りたくて
 * 先に呼ぶことがある(名前を間違えていないか見るため)。そのあと engine が
 * 読み込まれてもう一度走るので、もう入っているものは飛ばす。
 * 自分で `registerTone` を呼ぶときの止め方は変えていない
 */
export function registerDefaultTones() {
  // 2 軍の音色(draft)は登録しない。値は残してあり、MML からは使えない
  // (`analog` と同じ扱い。sound/audio.js の ANALOG_PATCHES)
  for (const [name, spec] of Object.entries(TONE_PRESETS)) {
    if (spec.draft) continue;
    if (waveByName(name) < 0) registerTone(name, spec);
  }
}
