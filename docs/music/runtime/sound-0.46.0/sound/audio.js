import { compileMML, validateMML, shareBundles, WAVEFORMS, ENVELOPES, DEFAULT_ENV,
  describeVoice, listVoiceFamilies, findWave,
  registerWave, registerFM, registerNoiseVariants, registerModal, registerBrass, registerAnalog,
  registerFamily, sealPresets, isSystemMark, registerVoiceSyntax, registerVoiceDetail, warn,
  volGainOf, AY_ENV_SHAPES,
  HEAD_MARK, songParts, envSec, VIB_SPEED, firstTempo, dutyMoves, dutyLfoAt,
  slideAt } from './mml.js';
import { groupsOf, groupPick } from './mask.js';
import { registerDefaultWaves } from './wavetables.js';
import { registerDefaultFM } from './fmpresets.js';
import { registerDefaultBeeps } from './beeppresets.js';
import { registerExtraWaves } from './extrawaves.js';
import { registerDefaultTones, readTable, TONE_FRAME } from './tones.js';
import { bakePlan, bakeOps } from './pcmbake.js';
import { AY_CODE, registerAYPresets, ayTonePeriod, ayNoisePeriod, ayEnvPeriod } from './ay.js';
import { NES_CODE, registerNESPresets, nesPulseTimer, nesTriangleTimer, nesNoisePeriod,
  nesDutyIndex } from './nes.js';
import { FDS_CODE, registerFDSPresets, fdsPitch, fdsModGain, FDS_MOD_TABLES } from './fds.js';
import { SCC_CODE, registerSCCPresets, sccPeriod } from './scc.js';
import { PCE_CODE, registerPCEPresets, pcePeriod, pceNoise } from './pce.js';
import { DUTY_CODE, clampDuty } from './duty.js';
import { FILTER_CODE, FILTERS, filterOptions } from './filter.js';
import { COLOR_WORKLETS, CHIP_CODE, CHIP_NODE, DYN_CODE, DYN_NODE, MASTER_PRESETS, DUCKING, normalizeDucking,
  LOUDNESS, loudnessGains, ECHO_CODE, ECHO_NODE, MASTER_FX, normalizeFx, fxHasLength, fxTail,
  FX_BYPASS, fxVariant, fxVariants, reverbImpulse } from './fx.js';
import { SE_SYS_PAUSE, SYSTEM_SE } from './demotunes.js';
import { SE_TEMPO, parseSEBase, parseSENotes, sliceSE } from './se.js';
import { registerDefaultLayers } from './layerpresets.js';
import { SOUND_VERSION } from './version.js';
// 音色をほかの音色から焼く口(@dynpcm{…})。音源ではないので、ここに置く
import './dynpcm.js';

// 最初から使える波形メモリ(waveBell など)と FM 音色(opll::piano など)を入れておく
registerDefaultWaves();
registerDefaultFM();
registerDefaultBeeps();
registerAYPresets();
registerNESPresets();
registerFDSPresets();
registerSCCPresets();
registerPCEPresets();
registerExtraWaves();
registerNoiseVariants();
registerDefaultTones();
// 重ねる相手が全部そろってから。合成音色は名前で他の音色を指す
registerDefaultLayers();
// ここまでが「最初から入っているもの」。あとから足したものは自作になる
sealPresets();

// PSG 風のサウンドドライバ。
// - 波形は 7 種類 (パルス 3 種 / 三角 / ノコギリ / サイン / ノイズ) +
//   波形メモリ(wt〜)。波形メモリはゲームから addWave() で足せる
// - 音色ごとにエンベロープ 6 種、デチューン・ビブラート・エコーを指定できる
// - BGM: 複数チャンネルの MML 配列。ループ再生可能
// - SE : 単発再生。新しい SE を鳴らすと前の SE は止まる(実機ゲーム風)
// - MML の "@n" は旧記法としてノイズ波形の指定に対応している

const MASTER_VOL = 0.14;

/**
 * 1 ビットへ潰す曲線(ビープ)。0 より上なら +1、下なら -1。
 *
 * 8 ビット機のビープは音量を持たず、線が 1 本あるだけだった。
 * どんな音色を通しても矩形になるので、音色の違いが消えて機械の音になる。
 *
 * WaveShaper は context に紐づかない(渡すのはただの配列)ので、
 * ここで 1 つ作って使い回せる。
 */
const BEEP_CURVE = (() => {
  const c = new Float32Array(1024);
  for (let i = 0; i < 1024; i++) c[i] = i < 512 ? -1 : 1;
  return c;
})();

/**
 * 種つきの乱数(xorshift32)。外部依存を増やさないために手で持つ。
 *
 * 書き出しのノイズに要る。種が無いと焼くたびに違うファイルになり、
 * 「さっきと同じものをもう一度」ができない。
 * 実測では同じ曲を 4 回焼いてピークが 9389〜30719 まで振れた
 * (上限は 32768 なので、回によっては歪む手前まで行く)。
 */
/**
 * いずれ無くなる呼び方を、1 度だけ知らせる。
 *
 * すぐ切らずに、まず言う。読んでいる人が直す時間を取れるようにするため。
 * 毎回言うと、直すまでのあいだ画面が埋まるので 1 度きりにする(2026-09-15)。
 */
const saidOld = new Set();
function oldWay(what, instead) {
  if (saidOld.has(what)) return;
  saidOld.add(what);
  console.warn(`[ChpTnSnd] ${what} は古い呼び方です。${instead}`
    + '(いまは動きますが、いずれ無くなります)');
}

/**
 * 確かめた結果のうち、`errors` に入ったものを知らせる。
 *
 * 返り値を見ない呼び方もあるので、黙って通さない。止めはしない —
 * 鳴らせるところは鳴らす(2026-09-15)
 */
function sayErrors(what, got) {
  for (const e of got.errors) {
    const ch = e.ch === null ? '' : `${e.ch + 1} 本目: `;
    console.warn(`[ChpTnSnd] ${what}: ${ch}${e.text}`);
  }
  return got;
}

/**
 * 組み立て済みのトラックから、確かめた結果を作る。
 *
 * `validateMML()` は MML の字を読み直して作る。字を持たないものには使えないので、
 * トラックが控えている `problems` から同じ形を組む。
 * 読む側(`bgmActive()` や画面)は、どちらから来たかを知らずに済む。
 */
function checkOfTracks(tracks) {
  const errors = [];
  const warnings = [];
  let total = 0;
  const channels = tracks.map((t, i) => {
    total = Math.max(total, t.total || 0);
    for (const p of t.problems || []) {
      (p.level === 'error' ? errors : warnings).push({ ch: i, text: p.text });
    }
    if (!t.events.length) warnings.push({ ch: i, text: '音符がありません' });
    return { ch: i, meta: t.meta ?? {}, name: t.name ?? null, role: t.role ?? null,
      events: t.events.length, total: t.total, loop: t.loop,
      marks: t.marks, takes: t.takes ?? [] };
  });
  if (!tracks.length) errors.push({ ch: null, text: '鳴らすものがありません' });
  return { ok: !errors.length, errors, warnings, channels, total };
}

function seededRandom(seed) {
  let x = (seed >>> 0) || 1;
  return () => {
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5; x >>>= 0;
    return x / 4294967296;
  };
}

/**
 * 最初から入っているポーズ音の名前。`playSE()` にそのまま渡せる。
 * 曲そのものは見本の曲と一緒に demotunes.js が持っている。
 * @type {string}
 */
export { SE_SYS_PAUSE };
/**
 * エンジンの版。写して持っていかれたものにもこの数字が入るので、
 * どの時点のものかが、あとから分かるようにしておく。
 * 0 系のあいだは仕様が動く(履歴は version.js の頭)。
 * @type {string}
 */
export { SOUND_VERSION };

// 実機(MSX)の PSG のトーン。クロックを 16 と整数(1〜4095)で割った高さしか
// 出せないので、出せる音程が階段になっている。低いところは細かいが、
// 高いところは段が粗く、狙った高さから外れる = 音痴に聞こえる
const PSG_CLOCK = 3579545 / 2;
/**
 * その階段のいちばん近い段へ丸める。音色で段の細かさが変わる。
 *
 * - FM は丸めない。実機の FM は 1 オクターブを 512 段階で刻むので、
 *   どのオクターブでもほぼ正しい音程が出る
 * - ノイズは音程を持たないので、そのまま
 * - 三角波だけは 32 で割る(ファミコンの三角波と同じ)。同じ高さで比べると
 *   段は 2 倍粗いが、三角波は低音を受け持つので割る数が大きくなり、
 *   実際に鳴らす音域ではよく合う
 * - それ以外(矩形波・波形メモリなど)は 16 で割る。
 *   MSX の PSG / ファミコンの矩形波 / PC エンジン / SCC は、
 *   割り算の答えがそろっていて同じ階段になる
 *
 * @param {number} freq もとの高さ
 * @param {number} wave 音色の番号(WAVEFORMS の位置)
 */
/**
 * その音色の階段の細かさ。0 なら丸めない。
 *
 * 音色に紐づく値なので、一覧のほうからも引けるように分けてある
 * (`tool/manual/make-data.mjs`)。
 *
 * 丸めないもの — FM は 2 オペも 4 オペも実機が 1 オクターブを 512 段で
 * 刻むのでほぼ正しい音程が出る。ノイズは音程を持たない。焼いた波形(pcm)は
 * FM を焼いたものなので元と同じ。ビープは自分の分周を持っているので、
 * ここで丸めると二重になる
 */
export function psgDiv(wave) {
  const wf = WAVEFORMS[wave] || WAVEFORMS[2];
  // 合成音色は 1 つに決まらない。重ねたものがそれぞれ自分の階段に乗る
  // (鳴らすときも層ごとに `_playVoice` を通るので、そのとおりになる)
  if (wf.kind === 'layer') return null;
  // 実機の階段に乗せない音色。音律を確かめるためのものがこれで、丸めると
  // 純正の 3 度が 1.5Hz うなる。速い 13Hz のうなりよりそちらのほうが
  // 揺れて聞こえるので、平均律と逆に聞こえていた(2026-09-23)
  if ((wf.special || []).includes('exact')) return 0;
  // 自分の刻みを言う音色。AY のブザー音は音程レジスタを使わず、
  // エンベロープの周期で高さを作るので、刻みが 16 倍粗い
  if (wf.snapDiv > 0) return wf.snapDiv;
  if (['fm', 'noise', 'baked', 'beep'].includes(wf.kind)) return 0;
  // 外から加えた音源は、自分で言った刻み(言わなければ寄せない)
  if (CHIP_KINDS.has(wf.kind)) return chipSnap(wf);
  // AY のノイズは高さで粗さを選ぶだけ(`ayNoisePeriod`)。トーンは 16 で割る
  if (wf.kind === 'ay' && wf.mode === 'noise') return 0;
  // ファミコンのノイズは 16 個の周期から選ぶだけ。三角波は 32 で割る
  if (wf.kind === 'nes') return wf.mode === 'noise' ? 0 : wf.mode === 'triangle' ? 32 : 16;
  // ディスクシステムの周期は 12 ビットで刻みが細かい(o4a で 0.4Hz)。丸めない
  if (wf.kind === 'fds') return 0;
  // PC エンジンのノイズは高さで粗さを選ぶだけ。波形は CLK / (32 × 値) で、PSG と同じ階段
  if (wf.kind === 'pce') return wf.noise ? 0 : 16;
  return wf.kind === 'triangle' ? 32 : 16;
}

function psgSnap(freq, wave) {
  if (!(freq > 0)) return freq;
  const div = psgDiv(wave);
  if (!div) return freq;
  // 音程レジスタは 12 ビット、エンベロープの周期は 16 ビット
  const max = (WAVEFORMS[wave] || {}).snapDiv > 0 ? 65535 : 4095;
  const tp = Math.max(1, Math.min(max, Math.round(PSG_CLOCK / (div * freq))));
  return PSG_CLOCK / (div * tp);
}

/**
 * 常駐の処理器(AudioWorklet)。
 *
 * 音ごとに節を並べる作りでは出せないものだけ、ここへ回す。
 * 音ごとに処理器を作ると実時間の 2.65 倍かかって鳴らせないので、
 * 出口ごとに 1 個だけ立てて、音符を流し込む(`sound/ym2151.js` の頭)。
 *
 * 増やすときはここへ 1 行足すだけでよい。積む・渡す・書き出しで作り直す、の
 * 3 か所は名前で回している(書き忘れるとその音だけ無音になるため)。
 */
const WORKLETS = {
  ay:   { node: 'mmsxx-ay',   code: AY_CODE },
  nes:  { node: 'mmsxx-nes',  code: NES_CODE },
  fds:  { node: 'mmsxx-fds',  code: FDS_CODE },
  scc:  { node: 'mmsxx-scc',  code: SCC_CODE },
  pce:  { node: 'mmsxx-pce',  code: PCE_CODE },
  duty: { node: 'mmsxx-duty', code: DUTY_CODE },
  // チャンネルの出口のフィルタ(`@f`)。音符は取らず、入口と出口を持つ。
  // 作るときに種類を渡すので、`options` ではなく `_fxChain` が自分で組む
  filter: { node: 'mmsxx-filter', code: FILTER_CODE },
  // エコー。全体(`setMasterEffects`)にもチャンネル(`@f2{echo …}`)にも置く
  echo: { node: ECHO_NODE, code: ECHO_CODE },
  // 波形を刻む 2 つ(wavestep・crush)。同じ処理器で、作るときに種類を渡す
  chip: { node: CHIP_NODE, code: CHIP_CODE },
  // 仕上げの 2 つ(limiter・saturate)。同じ処理器で、作るときに種類を渡す
  dyn: { node: DYN_NODE, code: DYN_CODE },
  // 古い機材の色付け(tube・transformer・tape)。種類ごとに処理器が 1 つ
  ...COLOR_WORKLETS,
};

/**
 * エフェクトの並びを入れ替えるのに掛ける秒数。
 *
 * その場で切り替えるとプツッと鳴る。中身の違う 2 本の音が段差でつながるため。
 * 短くしてあるのは、曲の指示どおりの時刻に効いてほしいから。
 * 掛けているあいだは両方が鳴る(2026-10-23)
 */
const FX_SWAP = 0.005;

/** エフェクトの種類が使う処理器(WORKLETS の名前)。reverb のように要らなければ null */
function fxWorklet(kind) {
  if (FILTERS[kind]) return 'filter';
  if (kind === 'echo') return 'echo';
  if (kind === 'wavestep' || kind === 'crush') return 'chip';
  if (kind === 'limiter' || kind === 'saturate') return 'dyn';
  if (COLOR_WORKLETS[kind]) return kind;
  return null;
}

/**
 * 外のファイルが加える音源(sound/opl.js など)。種類の名前 → 鳴らし方。
 *
 * audio.js はその音源の中身を知らない。音源の側が処理器のコードと、
 * 音符を処理器へ渡す形に直す関数を渡す。外すときは、その音源の import を消すだけで済む
 * (docs/ENGINE_TODO.md の 2i)。
 */
const CHIP_KINDS = new Map();

/**
 * 音源を加える。
 *
 * @param {string} kind 音色の `kind`。mml.js の `registerVoice` に渡すものと同じ
 * @param {{node:string, code:string, event:function,
 *          snap?:number|function, noTail?:boolean,
 *          voices?:number, buses?:number, options?:function, extra?:function}} spec
 *   node = 処理器の名前(registerProcessor に渡すもの)。code = 処理器のコード。
 *   event = `(ev, wf, freq, amp, t0, t1) => 処理器へ渡す音符`。エンジンそのものが
 *   `this` になるので、音の形を出す手(`_chipShape` など)はそこから引く。
 *   snap = 高さを寄せる刻み(psgDiv と同じ意味。既定 0 で寄せない)。
 *   音色ごとに変わるなら関数で渡す(`(wf) => 刻み`)。
 *   noTail = 残響のしっぽを足さない(音量をチップが持つ音源)。
 *   voices / buses / options / extra = 音符のほかにパッチを渡す音源が使う
 *   (`WORKLETS` の modal と同じ形)
 */
export function registerChipKind(kind, spec) {
  WORKLETS[kind] = { node: spec.node, code: spec.code,
    ...(spec.voices ? { voices: spec.voices } : {}),
    ...(spec.buses ? { buses: spec.buses } : {}),
    ...(spec.options ? { options: spec.options } : {}),
    ...(spec.extra ? { extra: spec.extra } : {}) };
  CHIP_KINDS.set(kind, { event: spec.event, snap: spec.snap ?? 0, noTail: !!spec.noTail });
}

/**
 * その音源が読み込まれているか。
 *
 * 分けて配るので、要る音源が入っていないまま音色を足されることがある。
 * そうすると名前だけ並んで鳴らない。アドオンの依存を確かめるために開けてある
 * (`sound/addon.js`)
 *
 * @param {string} kind 音色の `kind`(`analog` `opll` `modal` など)
 */
export function hasChipKind(kind) {
  return CHIP_KINDS.has(kind);
}

/** 音源が言う高さの刻み。音色ごとに変わるものは関数で来る */
function chipSnap(wf) {
  const s = CHIP_KINDS.get(wf.kind).snap;
  return typeof s === 'function' ? s(wf) : s;
}

/**
 * その音色が常駐の処理器を要るか。要るならその名前。
 *
 * 幅の表は `kind` を変えない。元の形(`pulse`)のまま持たせてあるので、
 * 書き出しや譜面の側は音色を知らないままで通る(docs/MML.md)。
 * ここだけが「表を持っているか」を見る。
 */
function workletOf(wf) {
  if (!wf) return null;
  if (wf.kind === 'ay') return 'ay';
  if (wf.kind === 'nes') return 'nes';
  if (wf.kind === 'fds') return 'fds';
  if (wf.kind === 'scc') return 'scc';
  if (wf.kind === 'pce') return 'pce';
  if (dutyMoves(wf.tone)) return 'duty';
  if (CHIP_KINDS.has(wf.kind)) return wf.kind;
  return null;
}

/**
 * エンベロープの形を秒で出す。`_applyEnvelope` と、幅の表の処理器が同じものを使う。
 *
 * 処理器の側には節が無いので automation を書けない。数にして渡す。
 * @param {{a:number,d:number,s:number,r:number}} e @param {number} len 音の長さ(秒)
 */
/**
 * 音符のエンベロープを引く。
 *
 * スラーで続く音(legato)は立ち上がりを作らない。前の音から鳴りっぱなしで
 * 音程だけ変わるので、ここで張り直すと切れて聞こえる。
 * 配列式のエンベロープは 1 フレームずつ進む別の道なので、そのまま返す。
 */
function envOf(ev) {
  const e = ENVELOPES[ev.env] || ENVELOPES[0];
  // エコーの写し(`@s`)は、鳴りはじめてからずっと落ちていく。
  //
  // 元の音と同じ形のまま置くと、ずらして重ねただけに聞こえる。減らずに
  // 途中で切れるので、輪郭が 2 つ並ぶ。やまびこは尾を引いて消えるものなので、
  // 立ち上がりを詰めて、伸ばすところを外して、終わりまで落としていく。
  // `envShape` が `d` を音符の長さで頭打ちにするので、写しの長さいっぱいで
  // 0 へ着く(2026-09-19)。
  //
  // 表を持つエンベロープ(tn 系)はそのまま。あちらは形そのものが音なので、
  // 書き換えると別の音になる
  const base = (ev.tail && !e.table)
    // 立ち上がりは 4 ミリ秒まで。割合で書いてあるものは、ここでは
    // 長さが分からないので頭打ちの値をそのまま使う(写しは速く立ち上がる)
    ? { ...e, a: typeof e.a === 'string' ? 0.004 : Math.min(e.a, 0.004), d: 99, s: 0 }
    : e;
  return (ev.legato && !base.table) ? { ...base, a: 0 } : base;
}
/**
 * 音が終わったあとに鳴らす余韻(R)の長さ(秒)。0 なら今までどおり音の終わりで切る。
 *
 * 実機の PSG や SCC はキーオフですぐ消えるので、余韻は空き時間に音を置いて
 * 作っていた。こちらはエンベロープの R を、音の後ろへそのまま鳴らす
 * (docs/ENGINE_TODO.md 2g)。
 *
 * - 自分の次の音までしか鳴らさない(`ev.room`。`markRooms()` が数えてある)。
 *   次の音がすぐ続くなら(`ev.open`)鳴らさない。実機の次のキーオンと同じ
 * - OPLL と OPM はチップが自分で余韻を持つので、ここでは延ばさない
 * - 表のエンベロープ、音量の表を持つ幅の表、伸ばすところが 0 の形は、
 *   離す時点で音が残っていないので延ばさない
 * - 重ねた音色は、層の形のうちいちばん長い R を取る。延ばしたぶんは層ごとに
 *   自分の R で使う(`_applyEnvelope` が短いほうに合わせる)
 *
 * @param {object} ev @param {number} len 音の長さ(秒。延ばす前)
 */
function tailOf(ev, len) {
  if (ev.open || !(ev.room > 0)) return 0;
  const w = WAVEFORMS[ev.wave];
  // 音量をチップが持つ音源(OPLL / OPM)は、しっぽを足さない
  if (!w || (CHIP_KINDS.get(w.kind) || {}).noTail) return 0;
  if (w.tone && w.tone.vol) return 0;
  const one = (e) => ((!e || e.table || !(e.s > 0)) ? 0 : envSec(e.r, len));
  let r = one(envOf(ev));
  if (w.kind === 'layer') {
    for (const m of w.layers) {
      const at = m.env != null ? m.env : (WAVEFORMS[m.wave] || {}).defaultEnv;
      if (at != null) r = Math.max(r, one(envOf({ ...ev, env: at })));
    }
  }
  return Math.max(0, Math.min(r, ev.room));
}

function envShape(e, len) {
  // a / d / r は秒。音符の長さでは伸び縮みしない。
  //
  // 実機の FM(OPM / OPN)のレートはどれも絶対時間で、音符の長さとは
  // 関係が無い。長い音でも短い音でも同じ速さで落ちる。
  // 前は d だけ音符の長さに対する割合にしていた(`e.d * len`)ので、
  // a と r は秒・d は割合、という混ざった作りになっていた。
  //
  // 短い音では最後まで進まない。それが実機の姿で、
  // 減衰の途中で切れるから短い音は明るく聞こえる。
  // `'25%'` のように割合で書いたものは、ここで秒に直す。
  // 書いてあるのは音色の側の都合(音が短いほど速く落とす)で、
  // 読み替えるのはこの 1 か所だけ(2026-09-24)
  const a = Math.min(envSec(e.a, len), len * 0.5);
  const d = Math.min(envSec(e.d, len), Math.max(0, len - a));
  const rel = Math.min(envSec(e.r, len), len * 0.5);
  // hold = 落としはじめる時刻(頭からの秒数)
  return { a, d, s: e.s, rel, hold: Math.max(a + d, len - rel) };
}

/**
 * 配列式のエンベロープの、i フレーム目の値。
 *
 * 表の終わりまで来たら `loop` の位置へ戻る。`loop` が無ければ最後の値のまま。
 * 実機の駆動系がやっていたのと同じで、戻る先は先頭とは限らない —
 * 立ち上がりを 1 回だけ通してから、伸ばすところを回す書き方ができる。
 */
/** 配列式なら 1 フレームずつの並びにする。ADSR 型なら null */
function envGains(e, len) {
  if (!e.table) return null;
  const n = Math.max(1, Math.ceil(len / TONE_FRAME));
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = envTableAt(e, i);
  return out;
}

function envTableAt(e, i) {
  const t = e.table;
  if (i < t.length) return t[i];
  if (e.loop === null || e.loop === undefined) return t[t.length - 1];
  const span = t.length - e.loop;
  return t[e.loop + ((i - e.loop) % span)];
}

/**
 * `v`(0〜15)を段に寄せる。
 *
 * 実機の音量レジスタは段でできている。AY は 16 段、FM の TL は 128 段。
 * 音色が `vsteps` を持っていれば、その段数に寄せる。0 なら寄せない。
 *
 * `vsteps: 1` は段が 1 つしか無い音色 —— 鳴るときは必ず最大で、`v0` だけが
 * 消音になる。ファミコンの三角波が実際そうで、あの声にだけ音量つまみが
 * 無かった(前は `special: ['fixedVolume']` で書いていた。2026-09-25)。
 *
 * 目盛りそのものは 0〜15 のまま動かさない。段数を変えても、同じ `v` は
 * だいたい同じ大きさで鳴る。
 *
 * export しているのは、音量のページが段の形を絵にするため。固定の絵を置くと
 * 式を直したときにずれるので、エンジンに描かせる。
 */
export function snapVol(v, steps) {
  if (!(steps > 0) || !(v > 0)) return v;
  // 段数は無音を含めた符号の数。鳴る符号は 1〜(steps-1) なので、
  // 目盛りの 15 をその数で割る。16 段なら 1 ずつ(v1 v2 … v15)。
  // 1 段の音色は下がりようが無いので、鳴るときは必ず最大
  if (steps === 1) return 15;
  const step = 15 / (steps - 1);
  return Math.min(15, Math.max(step, Math.round(v / step) * step));
}

/**
 * `v` を実際のゲインへ。曲線は音色が持つ。
 *
 * 同じ矩形波でも、実機は音量の目盛りが機種で別ものだった。AY は 16 段の DAC が
 * 対数で並び(1 段 3dB)、ファミコンは 4 ビットの値がそのまま振幅、
 * FM の TL は 0.75dB 刻み。曲線と段数は対で意味を持つ ——
 * 1 段あたり何 dB × 段数が、その機械で出せる音量の幅になる。
 * 段数は無音を含めた符号の数なので、下がるのはその 1 つ手前まで —— AY は
 * 16 段のうち 14 段ぶんで 42dB(2026-10-04 に測り直して数え方を直した)。
 *
 * `curve` が既定。これだけは実機のものではなく、このエンジンが使ってきた形
 * (`(v/15)^1.8`)で、書き換えると既存の曲が全部変わる(2026-09-25)。
 */

/**
 * その音符の大きさ。`v` を音色の段に寄せてから、音色の曲線でゲインにする。
 */
/**
 * 音符が鳴りはじめてから `age` 秒のときの音量(0〜1)。
 *
 * 鳴らすときに使っているエンベロープの形をそのまま引く。
 * 出た音を測るのではないので、エコーの尾やコーラスの厚みは映らない。
 * MML が書いた音量そのものが出る(2026-09-15)
 */
function levelAt(ev, age) {
  const e = envOf(ev);
  const len = Math.max(0.01, ev.gate);
  const vol = ampAt(ev, 1, age) / MASTER_VOL;   // 0〜1 に戻す
  if (e.table) return Math.max(0, Math.min(1, envTableAt(e, Math.floor(age / TONE_FRAME)) * vol));
  const sh = envShape(e, len);
  let g;
  if (age < sh.a) g = sh.a > 0 ? age / sh.a : 1;
  else if (age < sh.a + sh.d) g = 1 - (1 - sh.s) * ((age - sh.a) / Math.max(1e-6, sh.d));
  else if (age < sh.hold) g = sh.s;
  else g = sh.s * (1 - (age - sh.hold) / Math.max(1e-6, len - sh.hold));
  return Math.max(0, Math.min(1, g * vol));
}

/**
 * 音符が鳴りはじめてから `age` 秒のときの高さ(Hz)。
 *
 * 滑っている最中(`*` のポルタメント)は、その時点の高さを返す。
 * 鳴らすほうが指数で滑らせているので、こちらも指数で合わせる
 */
export function freqAt(ev, age) {
  if (!(ev.glide > 0)) return ev.freq;
  // 滑りはじめるまでの待ちと、滑っている長さ。書いていなければ音符いっぱい
  const wait = ev.glideAt > 0 ? ev.glideAt : 0;
  const len = Math.max(0.01, ev.glideFor > 0 ? ev.glideFor : Math.max(0.01, ev.gate) - wait);
  const k = Math.max(0, Math.min(1, (age - wait) / len));
  return ev.freq * Math.pow(ev.glide / ev.freq, k);
}

/**
 * その音符を鳴らす大きさ。フェードの途中の音は、その音の中でいちばん大きい
 * ところで数える。そこから下げるぶんは `fadeGain` が掛ける
 */
export function ampFor(ev) {
  return ampAt({ ...ev, fade: null, vol: peakVol(ev) }, 1);
}

/**
 * 鳴りはじめから `age` 秒の音量(0〜15)。
 *
 * フェード(`@fade`)の途中の音は `fade` に動きを持っている
 * (`[[鳴りはじめからの秒, 音量], …]`)。点のあいだは真っ直ぐつなぎ、
 * 最初の点より前は `vol`、最後の点より後ろは最後の値のまま。
 * 段にするかどうかは、ここでは決めない。音色の `vsteps` が寄せる
 */
export function volAt(ev, age) {
  const pts = ev.fade;
  if (!pts || !pts.length || age <= pts[0][0]) return ev.vol;
  for (let i = 1; i < pts.length; i++) {
    if (age <= pts[i][0]) {
      const [a0, v0] = pts[i - 1], [a1, v1] = pts[i];
      return a1 > a0 ? v0 + (v1 - v0) * (age - a0) / (a1 - a0) : v1;
    }
  }
  return pts[pts.length - 1][1];
}

/** その音符の中でいちばん大きい音量 */
function peakVol(ev) {
  if (!ev.fade) return ev.vol;
  return Math.max(ev.vol, ...ev.fade.map((p) => p[1]));
}

/**
 * フェードのぶんの掛け率(0〜1)。`ampFor` で鳴らした音に掛けると、
 * `age` 秒のときの大きさになる。音量の曲線を通してから割るので、
 * 曲線が真っ直ぐでない音色でも耳に合う
 */
export function fadeGain(ev, age) {
  const top = ampFor(ev);
  return top > 0 ? ampAt(ev, 1, age) / top : 0;
}

/**
 * エンベロープが `f`(0〜1)まで下がったときの大きさ。
 *
 * 実機の駆動系は、エンベロープを音量レジスタへ書き込んで作っていた。
 * つまり途中の値も段に乗る。`f` を掛けてから寄せるのはそのため
 * (寄せてから掛けると、段の外の値が出る。2026-09-25)。
 */
function ampAt(ev, f, age = 0) {
  const w = WAVEFORMS[ev.wave];
  // 音色が持っている下駄。山の尖った波形を、同じ `v` で並べるためのもの
  const boost = w && w.gain > 0 ? w.gain : 1;
  // バンドル音色が着せ替えていれば、そちらが勝つ(`#bundle … @vsteps{16}`)
  const steps = ev.vsteps ?? (w ? w.vsteps : 0);
  const curve = ev.vcurve ?? (w ? w.vcurve : 'curve');
  const v = snapVol(volAt(ev, age) * Math.max(0, f), steps);
  return volGainOf(v, curve, steps) * MASTER_VOL * boost;
}

/**
 * 曲ぜんぶの覚え書きを集める。
 *
 * どのチャンネルに書いてもよい決まりなので、全部のチャンネルから拾って
 * 1 つにまとめる。チャンネルごとのもの(`name` `role` `ch`)は外す。
 * 食い違いは `validateMML()` が見るので、ここでは先に書いてあるほうを取る
 */
function songMeta(tracks) {
  // 版・組・機械はチャンネルごとのもの。1 本目の値を曲ぜんぶのものとして
  // 出すと、別の版のチャンネルにも効いているように読める
  const skip = new Set(['name', 'role', 'ch', 'group', 'groupSet', 'machine']);
  const out = {};
  for (const t of tracks) {
    for (const [k, v] of Object.entries(t.meta ?? {})) {
      if (skip.has(k) || out[k] !== undefined) continue;
      out[k] = v;
    }
  }
  return out;
}

/** チャンネル MML をコンパイルする(波形などは MML 内の @ コマンドで指定する) */
/**
 * そのチャンネルが同時に何声使うか。
 *
 * 和音・バンドル音色・エコーで、1 本のチャンネルから同時に何本も鳴る。
 * 画面に出すのと、実機へ持っていくときの目安に要る。
 *
 * 数えるのは重なっている数の最大。前の音が鳴り終わってから次が始まる形は
 * 1 声に数える(切れ目がちょうど同じ時刻なら、終わるほうを先に見る)。
 *
 * @param {object[]} events 鳴らすイベント(エコーを足したあと)
 * @returns {number} 同時に鳴る数の最大
 */
function voicesOfTrack(events) {
  const pts = [];
  for (const e of events) {
    if (!(e.vol > 0)) continue;
    pts.push([e.t, 1], [e.t + Math.max(e.gate, 0.001), -1]);
  }
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let now = 0, most = 0;
  for (const [, d] of pts) { now += d; if (now > most) most = now; }
  return most;
}

/**
 * このチャンネルが持つ層の名前。出てくる順に並べる。
 *
 * ドラムなら `#drum` の字、和音なら `#chord` の声。どちらも
 * 「1 本のチャンネルの中で名前の付いたまとまり」で、聞き分けの単位になる。
 *
 * 画面に出すのは呼び名のほう。`B` や `h` のような字だけ並べても、
 * どれがハイハットなのかは書いた人しか分からない。
 * 並びは MML に書いた順にする。
 *
 * @param {object[]} events 鳴らすイベント
 * @param {Map<string,string>} [labels] 層 → 呼び名
 * @returns {{name:string,label:string}[]} 層。無ければ空
 */
function lanesOfTrack(events, labels) {
  const used = new Set();
  for (const e of events) if (e.lane) used.add(e.lane);
  if (!used.size) return [];
  const out = [];
  // 並びは書いた順。鳴った順に並べると、和音が上の声から出てくるので
  // `ブラス3 ブラス2 ブラス1` と逆さに見える(2026-09-18)
  for (const [name, label] of labels ?? []) {
    if (used.has(name)) { out.push({ name, label: label || name }); used.delete(name); }
  }
  for (const name of used) out.push({ name, label: name });
  return out;
}

function compileTrack(mml, mode, allowOverLimit) {
  return trackFrom(compileMML(mml.trim(), { mode, allowOverLimit }));
}

/**
 * 読み終えた中間データから、鳴らすトラックを組む。
 *
 * MML の字を読むところと、読み終えたものを組み立てるところを分けてある。
 * Stave は MML を通さずにここへ入る(docs/SCORE_LANG.md「Stave を直に鳴らす」)。
 * 入れるのは `compileMML()` が返す形。
 */
function trackFrom(data) {
  const { events, total, loop, outro, meta = {}, marks, takes, bars, cues, texts, problems,
    filters, laneLabels } = data;
  // 実機の PSG はノイズ発生器の数が限られているので、
  // 「このチャンネルはノイズを使うか」をここで一度だけ調べておく
  const noise = events.some(e => (WAVEFORMS[e.wave] || {}).kind === 'noise');
  // 名前と役割は注釈の指示行から。プレイヤーがチャンネルのボタンに出す
  // 名前は `#name`。`#ch 主旋律` のように切れ目へ書いたものも同じ扱いにする
  // 曲ぜんぶに効く指示(`#title` `#about` など)は、そのまま持っておく。
  // 画面が出したいものは、こちらが決めずに書いた人が決める(2026-09-15)
  // 選択肢は、鳴らす側が選び替えるまで 1 つ目が `events` に並んでいる。
  // 素の並びを取っておく(選び替えるたびに、ここから作り直す)
  const played = addEchoes(events, total);
  markRooms(played, loop ? loop.to : Infinity);
  return { events: played, base: events,
    // 同時に何声使うか。和音とバンドル音色とエコーで 1 本から何本も鳴る
    voices: voicesOfTrack(played),
    // 和音を鳴らすチャンネルか。重ねは 1 つの音を厚くするだけだが、
    // 和音は別の音を並べるので、実機では本当に何本か要る
    chords: events.some((e) => e.chord !== undefined),
    // 中の層。`#drum` の字と `#chord` の声に付く。1 本を開いて
    // 「ハイハットだけ止める」ができるようにするため(2026-09-18)
    lanes: lanesOfTrack(played, laneLabels),
    total, noise, loop, outro, marks, meta, takes, bars,
    // チャンネルの出口のフィルタ(`@f`)。音符に着せずに時刻つきの並びで持つ
    filters: filters ?? [],
    // 読めなかったところ。読み方(mode)にかかわらず控えてある
    problems: problems ?? [],
    // 合図と切れ目も選択肢で入れ替わるので、素の並びを取っておく
    cues: cues ?? [], baseCues: cues ?? [],
    // 字(`"…"`)も同じ扱い。選択肢で入れ替わるので素の並びを取っておく
    texts: texts ?? [], baseTexts: texts ?? [],
    baseBars: bars ?? [],
    name: meta.name ?? meta.ch ?? null, role: meta.role ?? null,
    // 版と組(`#group`)。どちらも書かなければ null で、どの版にも属さない。
    // 機械(`#machine`)は覚えるだけで、いまは音を変えない
    group: meta.group ?? null, groupSet: meta.groupSet ?? null,
    machine: meta.machine ?? null };
}

/**
 * 音ごとに、終わってから自分の次の音が鳴るまでの空き(秒)を `room` に書く。
 * 余韻(R)はここまでしか鳴らさない。自分の次の音が必ず勝つ(docs/ENGINE_TODO.md 2g)。
 *
 * 並びが決まってから数える。選択肢を選び替えると並びが作り直され、
 * エコーの写しも読んだあとで足されるので、MML を読む時点では数えられない。
 *
 * - 同じ時刻に並ぶ音(和音・重ね)は次の音に数えない
 * - くり返しのある曲は、周の終わり(`turn`)でも切る。戻った先の頭と重ならないように
 * - 次が無ければ限りなし(曲の終わりの音は、余韻を最後まで鳴らす)
 *
 * @param {object[]} events 時刻順の並び @param {number} turn 周の終わり(無ければ Infinity)
 */
function markRooms(events, turn) {
  let j = 0;
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    if (j <= i) j = i + 1;
    while (j < events.length && events[j].t <= e.t + 1e-6) j++;
    let at = j < events.length ? events[j].t : Infinity;
    if (e.t < turn - 1e-6) at = Math.min(at, turn);
    e.room = Math.max(0, at - (e.t + e.gate));
  }
}

/**
 * エコー(`@s`)を音符として書き込む。
 *
 * 声を 1 本増やすのをやめた(2026-09-16)。代わりに、コンパイルのときに
 * 「遅らせて小さくした写し」を音符として置く。置くのは音の無いところだけで、
 * 次の音の頭に当たったらそこで切る。曲の長さは変えない。
 *
 * 1 声しかない機械で鳴らすときと同じ考え方になる。実機でも、エコーは
 * 休符へ小さい音を書くやり方で作っていた。
 *
 * @param {object[]} events 時刻の早い順に並んだ音符
 * @param {number} total チャンネルの長さ(秒)。ここからはみ出すぶんは置かない
 * @returns {object[]} 写しを混ぜて並べ直したもの
 */
function addEchoes(events, total) {
  if (!events.some((e) => e.echo)) return events;
  const out = [...events];
  // 元の音符が鳴っているところ。写しはこの上へ乗らない
  const busy = events.filter((e) => e.gate > 0).map((e) => [e.t, e.t + e.gate]);
  /** そこから先で、次に音が始まる時刻 */
  const nextAt = (t) => {
    let at = Number.isFinite(total) ? total : Infinity;
    for (const [s] of busy) if (s > t + 1e-9 && s < at) at = s;
    return at;
  };
  /** そこが元の音で埋まっていたら、その音が切れる時刻。空いていればそのまま */
  const freeFrom = (t) => {
    let at = t;
    for (const [s, e] of busy) if (at > s - 1e-9 && at < e - 1e-9) at = Math.max(at, e);
    return at;
  };
  const copies = [];
  for (const e of events) {
    if (!e.echo || !(e.echo.delay > 0) || !(e.vol > 0)) continue;
    // 深さで減りかたが決まる。深いほど長く残る
    const k = 0.12 + e.echo.depth * 0.05;
    let vol = e.vol;
    // 深さ 16 だと写しが 31 個まで伸びるので、そこまで回す
    for (let r = 1; r <= 32; r++) {
      vol *= k;
      if (vol < 0.7) break;                       // 聞こえない大きさになった
      // 写しの場所は、遅れの目盛りから動かさない。「少し遅れて少し小さい音を
      // もう 1 本で鳴らしていて、こちらが空いたときだけそちらの消音が外れる」
      // のが `@s` の用事なので、鳴りはじめだけが後ろへずれる(2026-09-19)
      const at = e.t + e.echo.delay * r;
      if (at >= total - 1e-9) break;               // 曲より後ろへは置かない
      // 元の音に隠れているあいだは聞こえない。切れたところから顔を出す。
      // 終わりは動かさない。隠れていたぶんは頭が削れるだけで、消音が外れた
      // ところから途中で聞こえはじめる
      const t = freeFrom(at);
      const stop = Math.min(at + e.gate, nextAt(t), total);
      const gate = stop - t;
      if (gate <= 0.01) continue;                 // まるごと隠れている
      const c = { ...e, t, dur: gate, gate, vol: Math.round(vol), echo: null, tail: true };
      // フェードと 2 周目の音量も、元の音と同じ比で小さくする。
      // フェードの時刻は鳴りはじめから数えているので、ずらしたぶん戻す
      const k2 = c.vol / e.vol;
      if (e.fade) c.fade = e.fade.map(([a, v]) => [a - (t - e.t), v * k2]);
      if (e.loopVol !== undefined) {
        c.loopVol = e.loopVol * k2;
        c.loopFade = e.loopFade && e.loopFade.map(([a, v]) => [a - (t - e.t), v * k2]);
      }
      copies.push(c);
    }
  }
  // 写しどうしが重なることがある。新しい音の 1 回目と、前の音の 2 回目が
  // 同じ目盛りに来るときで、これは 1 本のチャンネルでは鳴らせない。
  // 大きいほう(新しい音から来たほう)を残して、前のものはそこで切る
  copies.sort((a, b) => a.t - b.t || b.vol - a.vol);
  let last = null;
  for (const c of copies) {
    if (last) {
      if (c.t < last.t + 1e-9) continue;          // 同じところ。小さいほうを捨てる
      if (c.t < last.t + last.gate - 1e-9) {
        last.gate = c.t - last.t;
        last.dur = last.gate;
      }
    }
    out.push(c);
    last = c;
  }
  out.sort((a, b) => a.t - b.t);
  return out;
}

/**
 * 音符ひとつずつに「ビープで鳴らす」印を押す。
 *
 * トラックに 1 つ持たせて鳴らす側へ引き回すこともできるが、そうすると
 * `_playVoice` まで手を伸ばす引数が増える。音符はもう音色もエンベロープも
 * 自分で持っているので、同じところに置くのが素直。
 */
function markBeep(track) {
  for (const ev of track.events) ev.beep = true;
  return track;
}

/** トラック配列のうち、ノイズを使うチャンネルの数 */
function noiseCount(tracks) {
  return tracks.reduce((n, t) => n + (t.noise ? 1 : 0), 0);
}

/**
 * MMS/XX のサウンドエンジン。MML を読んで Web Audio で鳴らす。
 *
 * チップチューン全部入り — PSG / 2 オペ FM / 4 オペ FM / 波形メモリ /
 * FDS / ビープ / 焼いて PCM / 音声合成。1 つの機械に全部載っている。
 * 0.10.0 で `PSGPlayer` から改名した(古い名前は消えている)。
 *
 * ゲームが触るのはこれ 1 つ。外部依存ゼロで、置いて import すれば動く。
 *
 *     import { ChipTuneSound } from './sound/audio.js';
 *
 *     const audio = new ChipTuneSound();
 *     audio.defineBGM('title', ['o5 c e g', 'o3 c c c']);
 *     audio.unlock();                // 最初の 1 回、人が触ったところで
 *     audio.playBGM('title');
 *
 * 登録してから鳴らす、が全部の形。名前で登録して、名前で鳴らす。
 *
 * | 登録 | 鳴らす | |
 * | --- | --- | --- |
 * | {@link ChipTuneSound#defineBGM} | {@link ChipTuneSound#playBGM} | 曲。1 つだけ鳴る |
 * | {@link ChipTuneSound#defineSE} | {@link ChipTuneSound#playSE} | 効果音。優先度で場所を取り合う |
 * | {@link ChipTuneSound#defineBGM} | {@link ChipTuneSound#playJingle} | 短い曲。鳴り終わると BGM が戻る |
 *
 * 音を出すには人の操作が要る(ブラウザがそう決めている)。
 * 最初のクリックやタップのところで {@link ChipTuneSound#unlock} を 1 回呼ぶ。
 *
 * 音色を足すのは {@link ChipTuneSound#addWave}(波形メモリ) /
 * {@link ChipTuneSound#addFM}(2 オペ FM) / {@link ChipTuneSound#bakeVoice}(焼いて PCM)。
 *
 * 書き出しは {@link ChipTuneSound#renderBGM} と {@link encodeWAV}。
 * 鳴らさずに計算するので、待たずに .wav が作れる。
 *
 * MML の書き方は docs/MML.md。
 *
 * @example
 * // 効果音。優先度の高いものが場所を取る
 * audio.defineSE('shot', '@{pulse(25)} l32 o6 c > c');
 * audio.defineSE('boom', '@{noise} l8 o3 c');
 * audio.playSE('shot');
 * audio.playSE('boom', 5);          // こちらが勝つ
 */
/**
 * 切り替えてよい場所(秒)を出す。
 *
 * `#switch <小節数>` が既定の網の目。1 小節は全音符 1 つ。
 * `|` を書いたところも足す。ただし全部のチャンネルが引いているところだけ —
 * 1 本にしか無い切れ目でほかのチャンネルを切ると、そこは曲の切れ目ではない。
 *
 * 網の目は `LOOP` があればそこから数える。前奏が半端な長さの曲(弱起など)で、
 * 音楽のほうが `LOOP` から小節を数え直しているため(docs/DYNAMIC.md)。
 *
 * 何も書いていなければ空を返す。呼ぶ側は「どこでも切り替えてよい」と読む。
 *
 * @param {object[]} tracks 登録したトラックの並び
 * @returns {number[]} 秒の早い順
 */
function switchPoints(tracks) {
  const { grid, bars } = switchParts(tracks);
  return tidy([...grid, ...bars]);
}

/** 秒の並びを、重なりを畳んで早い順にする */
function tidy(list) {
  return [...new Set(list.map((t) => Math.round(t * 1e6) / 1e6))].sort((a, b) => a - b);
}

/**
 * 曲が名乗る出力の大きさ(`#gain`)を引く。書いていなければ 1。
 *
 * どのチャンネルに書いてもよい。曲ぜんぶに掛かるものなので、
 * 最初に見つけたものを使う(`#tempo` と同じ扱い)。
 *
 * @param {object[]} tracks
 * @returns {number} 0〜8
 */
function songGain(tracks) {
  if (!Array.isArray(tracks)) return 1;
  const v = tracks.map((t) => t && t.meta && t.meta.gain).find((x) => x != null);
  if (v == null) return 1;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.min(8, n) : 1;
}

/**
 * 曲が名乗る、全体に掛けるエフェクト(`#fx`)を引く。書いていなければ null。
 *
 * どのチャンネルに書いてもよい。曲ぜんぶに掛かるものなので、
 * 最初に見つけたものを使う(`#gain` と同じ扱い)。
 *
 * @param {object[]} tracks
 * @returns {object[]|null} 値を埋めたあとの並び
 */
function songFx(tracks) {
  if (!Array.isArray(tracks)) return null;
  const v = tracks.map((t) => t && t.meta && t.meta.fx)
    .find((x) => Array.isArray(x) && x.length);
  if (!v) return null;
  try {
    return normalizeFx(v, FILTERS);
  } catch (e) {
    console.warn(`[ChpTnSnd] #fx を読めませんでした: ${e.message}`);
    return null;
  }
}

/**
 * 曲のテンポ。`#fx … @l` と同じ決め方で、`#tempo`、無ければ本文で最初の `t`、
 * それも無ければ 120。JS から音長(`l`)で渡したエフェクトを秒に直すのに使う
 * @param {object[]|null} tracks 登録したトラックの並び(`defineBGM` が `tempo` を付ける)
 * @returns {number}
 */
function songTempo(tracks) {
  if (!Array.isArray(tracks)) return 120;
  if (tracks.tempo > 0) return tracks.tempo;
  const t = Number(tracks.map((x) => x && x.meta && x.meta.tempo).find((v) => v != null));
  return t > 0 ? t : 120;
}

/**
 * 切れ目を、出どころで分けて返す。
 *
 * 画面で濃さを変えるために要る。等間隔で入る網の目(`#switch`)は薄く、
 * 手で引いた `|` は濃く描ける(2026-09-16)。
 *
 * @param {object[]} tracks 登録したトラックの並び
 * @returns {{grid:number[], bars:number[]}} grid = 網の目、bars = 手で引いたもの
 */
function switchParts(tracks) {
  if (!tracks.length) return { grid: [], bars: [] };
  const span = Math.max(...tracks.map((t) => t.total), 0);
  const mark = tracks.map((t) => t.loop).find(Boolean) || null;
  const from = mark ? mark.from : 0;
  const grid = [];
  const every = Number(tracks.map((t) => t.meta && t.meta.switch).find((v) => v != null));
  const tempo = Number(tracks.map((t) => t.meta && t.meta.tempo).find((v) => v != null)) || 120;
  if (Number.isFinite(every) && every > 0) {
    const step = every * (240 / tempo);   // 1 小節 = 全音符 1 つ
    for (let t = from; t <= span + 1e-9; t += step) grid.push(t);
  }
  // 手で引いた切れ目。どのチャンネルに書いたものも数える。
  //
  // 前は「全部のチャンネルが揃って引いたところだけ」にしていたが、
  // 同じ場所を全チャンネルに書かせることになって、書く手が増えるだけだった。
  // 書く人は曲ぜんぶを見て引くので、1 本にまとめて書けるほうが実際に合う
  // (2026-09-18)
  const out = tracks.flatMap((t) => t.bars || []);
  return { grid: tidy(grid), bars: tidy(out) };
}

/**
 * 選択肢をグループごとにまとめる。
 *
 * 同じグループの囲みが何本のチャンネルにあってもよく、顔ぶれが違ってもよい
 * (docs/DYNAMIC.md)。画面へ出すのは「選べる名前」なので、全部の囲みから
 * 名前を集めて並べる。
 *
 * @param {object[]} def 登録したトラックの並び
 * @returns {{group:string,now:string,options:string[],
 *            boxes:{ch:number,at:number,dur:number}[]}[]}
 */
function takesInfo(def) {
  const picks = def.picks || {};
  const out = new Map();
  for (const track of def) {
    for (const box of track.takes || []) {
      if (!out.has(box.group)) {
        out.set(box.group, { group: box.group, now: '', options: [], boxes: [],
                             restart: false, noWait: false });
      }
      const g = out.get(box.group);
      for (const o of box.options) if (!g.options.includes(o.name)) g.options.push(o.name);
      g.boxes.push({ ch: track.ch, at: box.at, dur: box.dur });
      if (box.restart) g.restart = true;
      if (box.now) g.noWait = true;
      if (!g.now) g.now = picks[box.group] ?? box.options[0].name;
    }
  }
  return [...out.values()];
}

/**
 * ラベルを 1 つにまとめて、曲の頭のラベルを足す。
 *
 * 頭出しの押しどころはどの曲にも要るので、書く人に書かせずにこちらで足す。
 *
 * 同じ場所に書く人のラベルがあれば、予約語のほうを並べない。押しどころが
 * 2 つ並んでも、跳ぶ先は同じところなので選びようがない。名前が付いている
 * ほうを残す(2026-09-16)。前は `START_DUP` という名前で 2 つとも出していた。
 *
 * 書く人が `#label START` と書くことはできない。予約語に自分の意味を
 * 持たせると、足すほうと 2 つ並ぶので、コンパイルのときに断っている。
 *
 * @param {{marks?:{name:string,t:number}[]}[]} tracks チャンネルの並び
 * @param {boolean} hideSystem 予約語を落とすか
 * @returns {{name:string,t:number}[]} 秒の早い順
 */
function gatherMarks(tracks, hideSystem) {
  const seen = new Set();
  const all = [];
  for (const t of tracks ?? []) {
    for (const m of t.marks ?? []) {
      if (seen.has(m.name)) continue;
      seen.add(m.name);
      all.push({ name: m.name, t: m.t });
    }
  }
  all.push({ name: HEAD_MARK, t: 0 });
  // 書く人のラベルがある場所からは、予約語を落とす
  const mine = all.filter((m) => !isSystemMark(m.name));
  const dup = (m) => isSystemMark(m.name)
    && mine.some((x) => Math.abs(x.t - m.t) < 1e-6);
  const out = all.filter((m) => !dup(m) && !(hideSystem && isSystemMark(m.name)));
  return out.sort((a, b) => a.t - b.t);
}

export class ChipTuneSound {
  /**
   * @param {AudioContext} [ctx] 外で作った AudioContext。
   *   1 枚の画面に音を出すものが 2 つ以上乗るときは、同じものを渡して使い回す。
   *   こちらは省いてもよい — 渡さなければ `unlock()` が自分で作る。
   *   ゲームが `new ChipTuneSound()` だけで鳴らしてきた口なので、そこは変えない
   * @param {{maxVoices?:number, maxNoise?:number}} [opts]
   *   maxVoices = 同時に鳴らせる音の数。実機に寄せたいときに絞る。
   *   エンジン側に上限はないので、いくつでも指定できる(既定 8)。
   *   maxNoise = 同時に鳴らせるノイズの数(既定 1)。実機の PSG は 1 つしか
   *   持っていないが、爆発など SE がノイズを取り合って消えがちなので
   *   「間違った方向に進化したマシン」として本数を宣言できるようにしてある。
   *   BGM のドラムぶんは別枠で、ここで数えるのは SE のノイズだけ。
   */
  constructor(ctx, opts = {}) {
    /** @type {AudioContext|null} */
    this.ctx = ctx || null;
    /** 鳴っている SE。1 つとは限らない(空きがあれば重ねて鳴る) */
    this.seVoices = [];
    this.maxVoices = opts.maxVoices ?? 8;
    /** いま BGM が使っている音の数 */
    this.bgmVoices = 0;
    /** SE の管理番号(playSE が返す。stopSE で狙って止めるのに使う) */
    this._seSeq = 0;
    /** 全体のポーズ(ゲームのポーズ用)。個別のポーズとは別に持つ */
    this._sePausedAll = false;
    this.bgmDefs = new Map();
    this.seDefs = new Map();
    // エンジンが持っている音。ゲームの SE と名前がぶつからないよう、
    // 使えない字(.)を入れた名前にしてある
    for (const [name, mml] of Object.entries(SYSTEM_SE)) this.defineSE(name, mml);
    this.bgmState = null;
    /** ジングル(BGM を黙らせて重ねる短い曲) */
    this.jingleState = null;
    this.noiseBuffer = null;
    this.maxNoise = opts.maxNoise ?? 1;
    /**
     * 実機と同じ音程のずれを出すか(既定 true)。
     *
     * 実機は「クロック ÷ 16(三角波は 32) ÷ 整数」でしか音を作れないので、
     * 出せる高さが階段になっている。低い音はほぼ合うが、高い音ほど狂う。
     * その階段に丸めて鳴らすのがこの設定(いわゆる「音痴」な音)。
     * FM とノイズには効かない(実機の FM は音程が正確なため)。
     *
     * ```js
     * mmsxx.audio.psgTune = false;              // まっすぐな音程にする
     * mmsxx.audio.psgTune = [true, false, true]; // チャンネルごとに決める
     * ```
     * @type {boolean|boolean[]}
     */
    this.psgTune = opts.psgTune ?? true;
    /**
     * 定位の出し方(既定 'mono')。
     *
     * - `'mono'`  … 位置を無視する。`p0` の消音だけ効く。リバーブやコーラスの広がりも、
     *               出口で 1 本に畳む
     * - `'stereo'`… 自前の計算で左右に振る。どの機械でも同じものが出る
     * - `'hrtf'`  … `PannerNode` に任せる。上下・前後も効くが、
     *               耳のデータをブラウザが持っているので出力が環境で変わる。
     *               焼く道には置けない
     *
     * 選ぶのは鳴らす側で、MML は選ばない。詳しくは docs/STEREO.md。
     * 前は既定が 'auto' で、出口が 2 本あればステレオになった。ブラウザではほぼいつも 2 本なので、
     * 頼んでいないのにステレオになっていた。ステレオは頼んだときだけにした(2026-10-17)
     * @type {'mono'|'stereo'|'hrtf'}
     */
    this.spatial = opts.spatial ?? 'mono';
    /**
     * くり返しを無視して 1 回だけ鳴らす(既定は false)。
     *
     * ふつうは MML に `#label REPEAT` と書いてあれば、鳴らす側が繰り返さないと
     * 言っても繰り返す。曲の作りとして書いてあるものだから。
     * ここはその例外で、聴くための都合で上書きする。
     * 最後まで聞いて止めたい、というプレイヤーのための切り替え(2026-09-15)。
     *
     * 曲は変わらない。鳴らし方だけが変わる。
     * @type {boolean}
     */
    this.ignoreSongLoop = !!opts.ignoreSongLoop;
    /**
     * 抜けるときに後奏(`#label OUTRO`)を通るか。既定は通る。
     *
     * 切ると、周回を終えたところでそのまま止まる(または頭へ戻る)。
     * 後奏の無い曲では何も変わらない。曲は変わらない。鳴らし方だけが変わる。
     * `loopTimes` と違って、鳴っている最中に変えてよい。長さは変わるが、
     * 変わるのは終わったあとの話で、いま鳴っているところは動かない(2026-09-15)
     * @type {boolean}
     */
    this.playOutro = opts.playOutro !== false;
    /**
     * 本編を何周するか。既定は 2。
     *
     * 無限ではなく数にしてある。曲は終わるものとして書かれていて、
     * 後奏を書いた曲は通ってはじめて形になる。止めるまで回りつづけるのは
     * 鳴らす側の都合なので、要るところが `Infinity` を書く(2026-09-24)。
     *
     * 鳴っている最中に変えてよい。一度は鳴らす前だけにしたが、戻した。
     * スライダーが映しているのは 1 周ぶんの長さで、そこは動かない。
     * 変わるのは「あと何周するか」だけなので、聴いている人の手がかりは
     * すり替わらない(2026-09-15)。
     *
     * すでに回った数以下の数を入れれば、いまの周の終わりで抜ける。
     * `goToEnding()` は、数を触らずに同じことをする。
     *
     * 数えているのはエンジンなので、「あと何周か」ではなく
     * 「ぜんぶで何周か」で書ける。抜けるときは、いま回っている周を鳴らし
     * 終えてから。いきなり切れない。`#label OUTRO` を書いた曲なら、
     * 抜ける道として後奏を通る。
     *
     * 前は `exitRepeat` という旗を別に持っていたが、数が同じことを言うので
     * 外した。`-1` を無限の印にする道もやめた。`Infinity` は本物の数なので、
     * 比べるところに分岐が要らない(2026-09-15)
     * @type {number}
     */
    this.loopTimes = 2;
    /**
     * 曲の `#looptimes` から入れた数。聴く側が触ったかどうかを見るためのもの。
     *
     * `loopTimes` がこれと同じなら、まだ誰も触っていない。違っていれば
     * 押した内容なので、曲を替えても上書きしない(2026-09-24)
     * @type {number}
     * @private
     */
    this._loopTimesFromSong = 2;
    /**
     * 曲が名乗る出力の大きさ(`#gain`)。既定は 1。
     *
     * `volume`(聴く人のつまみ)とは取り合わない。あちらは手元の大きさで、
     * こちらは曲そのものの大きさなので、出口では掛け算になる。
     * 曲を積むときに入れ替わる(`startBGM` / `renderBGM`)
     * @type {number}
     * @private
     */
    this._songGain = 1;
    /**
     * 鳴らす側が掛ける全体のエフェクト(`setMasterEffects`)。値は埋めてある。
     * 曲の `#fx` のあとに通す
     * @type {object[]}
     * @private
     */
    this._fx = [];
    /**
     * 曲が名乗る全体のエフェクト(`#fx`)。曲を替えるとその曲のものになる。
     * 鳴らす側のもの(`_fx`)とは別に持ち、両方を通す。曲の音ができてから、
     * 鳴らす側の響きを足す順(2026-10-17)
     * @type {object[]}
     * @private
     */
    this._songFx = [];
    /**
     * `setMasterEffects()` に渡されたままの並び。音長(`l`)で渡したものは、
     * 曲を替えるたびにその曲のテンポで秒に直し直す
     * @type {object[]}
     * @private
     */
    this._fxSrc = [];
    /** いまつないでいるエフェクトの節。作り直すときに片付ける @private */
    this._fxNodes = [];
    /**
     * 作ったあとで値を動かせる段。`tweakMasterEffects()` が使う。
     * つなぎ直すたびに作り直すので、節への参照を外に持ち出さない @private
     */
    this._fxLive = [];
    /** 溜める段からつないだ先。外すときに使う @private */
    this._fxHead = null;
    /** エフェクトを通ったあとの段。ここから消す段へ行き、録る仕掛けもここから取る @private */
    this._post = null;
    /**
     * AB リピートの範囲。聴く側の都合なので、曲をまたいでも残る。
     * 読むのは `bgmRange()`、決めるのは `setRange()`
     * @type {{from:number,to:number}|null}
     */
    this._range = null;
    /**
     * 黙らせてあるチャンネルの番号。止めても残るが、曲が変わると忘れる。
     *
     * 鳴っているあいだの音量は `bgmState.chGains` が持つが、あれは止めると
     * 消える。押した内容まで消えると、画面の側が同じものを控えることになり、
     * 同じ状態が 2 か所に置かれる。ここが本体で、画面は見るだけにする
     * (2026-09-15)。読むのは `mutedTracks()`。
     *
     * 曲をまたいで引き継がない。曲 A の 2 本目と曲 B の 2 本目は別のものなので、
     * 黙ったまま持ち越すと、次の曲で身に覚えのないチャンネルが消える
     * (2026-09-15)。どの曲のぶんかは `_muteFor` が持つ
     * @type {Set<number>}
     */
    this._chMute = new Set();
    /**
     * チャンネルごとの音量の倍率。書いていないチャンネルは 1。
     *
     * MML の `v` とは別に、鳴らす側で掛ける。曲のバランスを探るためのもので、
     * 1 より大きくもできる。ミュートと同じく、止めても残り、曲が変わると忘れる。
     * ミュートが書き出しに効くので、こちらも書き出しに乗せる(2026-09-28)
     * @type {Map<number, number>}
     */
    this._chLevel = new Map();
    // 止めてある層。`ch/名前` で覚える(チャンネルごとに同じ字が出るため)
    this._laneMute = new Set();
    /** `_chMute` がどの曲のものか。別の曲が来たら忘れる @type {string|null} */
    this._muteFor = null;
    /**
     * 選んである版と組(`#group`)。`{ song, group, sets }`。
     *
     * 何も選んでいなければ null で、そのときは曲の既定(先に出てきた版、
     * 組は全部 on)になる。自分のミュートと同じで、曲が変われば忘れる
     * @type {{song:string, group:string|null, sets:string[]}|null}
     */
    this._group = null;
    /**
     * 溜まった合図(`#cue`)。`takeCues()` で取り出して空にする。
     * 取りに来ない使い方(`onCue` だけ)でも溜まりつづけないように、
     * 積むときに古いものから捨てる @type {object[]}
     */
    this._cues = [];
    /**
     * 溜まった字(`"…"`)。`takeTexts()` で取り出して空にする。
     * 合図と同じ扱いで、古いものから捨てる @type {object[]}
     */
    this._texts = [];
    /**
     * 字を受ける口。1 本で受けたいときはこちら。
     * いつ消すかはこちらで決めない。受けた側が時間で消すか、
     * 次の字で入れ替えるかを決める @type {((text:object)=>void)|null}
     */
    this.onText = null;
    /** 字の通し番号 @type {number} */
    this._textSeq = 0;
    /**
     * 合図を受ける口。1 本で受けたいときはこちら。
     * 積んだ時刻ではなく、耳に届く時刻に呼ぶ @type {((cue:object)=>void)|null}
     */
    this.onCue = null;
    /** 合図を出さないチャンネル。音は鳴る(docs/DYNAMIC.md) @type {Set<number>} */
    this._cueMute = new Set();
    /** 合図の通し番号。同じ名前が何度も来るので、見分けるのに要る */
    this._cueSeq = 0;
    /**
     * 鳴らすときに掛けるエフェクト。チャンネルごとに書く(既定は空)。
     *
     * MML とは別の世界。曲には書いていないものを、鳴らす側が掛ける。
     * 声は増える — こちらは増やしてよい側で、実機の本数とは別の話。
     * 書き出しには乗らない(2026-09-16)。
     *
     * MML の `@s` `@d` `@o` はコンパイルのときに決まるもので、こちらとは
     * 別物。あちらを戻すためのものではない。
     *
     * 書いたチャンネルにだけ掛かる。主旋律だけ厚くする、が要るため。
     *
     * ```js
     * mmsxx.audio.dynamic_effects[0] = {
     *   detune: 20,                     // セント。ずらした音をもう 1 声重ねる
     *   octave: 1,                      // 下を 1 つ(2 なら 2 つ)重ねる
     *   echo: { delay: 0.12, depth: 5 } // 遅らせて小さく重ねる
     * };
     * delete mmsxx.audio.dynamic_effects[0];   // 切る
     * ```
     * @type {Object<number,{echo?:{delay:number,depth:number}|false,
     *                       detune?:number, octave?:number}>}
     */
    this.dynamic_effects = {};
  }


  /**
   * ユーザー操作を起点に AudioContext を有効化する(エンジンがキー入力時に呼ぶ)。
   *
   * 渡されていなければ、ここで作る。土台のほうは作らない決まりだが、
   * こちらはゲームが `new ChipTuneSound()` だけで鳴らしてきた口なので、
   * そこは変えない。分け合うときは `{ ctx }` を渡す。
   * そのあと、音源が要るものを足す(ノイズの元と、常駐の処理器)。
   *
   * 処理器の読み込みを待つ約束を返す。`await audio.unlock()` と書けば、
   * 1 回目の再生から処理器が揃う。待たずに鳴らすと、常駐の処理器を使う音色
   * (analog・modal・各チップ)が鳴らず、`@f` のエフェクトも素通しになる。
   * 2 回目からは読み終わっているので直る。1 回目だけ音が違うのはこれ(2026-10-15)
   * @returns {Promise<void>} 常駐の処理器が全部読めたら解決する
   */
  unlock() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (!this.noiseBuffer) {
      // ホワイトノイズバッファを1つ用意して使い回す
      const len = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    // 常駐の処理器は先に読んでおく。読み込みは非同期なので、
    // 曲が始まってからだと頭が欠ける。待てるように約束を返す
    return Promise.all(Object.keys(WORKLETS).map(
      (kind) => this._wkLoad(kind).catch(() => { /* 使わなければ要らない */ })))
      .then(() => undefined);
  }

  /** いま SE が使っているノイズの数 */
  _usedNoise() {
    return this.seVoices.reduce((n, v) => n + v.noise, 0);
  }

  /**
   * SE の席をカテゴリごとに取っておく。
   *
   * 優先度だけで譲り合わせると、先に鳴っていた音が場所を握ったままになり、
   * 撃つ音が鳴りつづけているあいだ、当たった音や爆発が聞こえなくなる。
   * 種類ごとに席を分けておけば、その心配が無くなる。
   *
   * ```js
   * mmsxx.audio.reserveSE({
   *   shot: { voices: 2, noise: 1, names: ['shot'] },
   *   hit:  { voices: 4, noise: 2, names: ['hit', 'clink', 'boom', 'bigboom'] },
   * });
   * ```
   *
   * `names` に書いておけば、鳴らす側は今までどおりでよい
   * (`playSE('boom', SE_HIT)` だけで hit の席に座る)。
   * その場で決めたいときは `playSE('boom', SE_HIT, { ch: 'hit' })` と書く。
   *
   * 取っておいた席は、そのカテゴリの中だけで取り合う。ほかの音には渡さない。
   * カテゴリを指定しない SE は残りの席を使い、そこは今までどおり
   * 優先度で取り合う。
   *
   * @param {Object<string,{voices?:number, noise?:number, names?:string[]}|number>} map
   *   数だけ渡すと声の数の指定になる(ノイズは 0)。
   *   names = その席に座らせる SE の名前
   */
  reserveSE(map) {
    this._chans = new Map();
    this._chanOf = new Map();
    for (const [name, v] of Object.entries(map || {})) {
      const q = (typeof v === 'number') ? { voices: v } : (v || {});
      this._chans.set(name, {
        voices: Math.max(0, q.voices || 0),
        noise: Math.max(0, q.noise || 0),
      });
      for (const se of q.names || []) this._chanOf.set(se, name);
    }
  }

  /** 取ってある席の合計(声 / ノイズ) */
  _reserved() {
    let voices = 0, noise = 0;
    for (const q of (this._chans || new Map()).values()) { voices += q.voices; noise += q.noise; }
    return { voices, noise };
  }

  /**
   * その SE が使う席の上限と、いまの使用数を返す。
   * 取ってあるカテゴリならその席、そうでなければ残りの席。
   */
  _scope(ch) {
    const q = ch && this._chans && this._chans.get(ch);
    const mine = (v) => (q ? v.ch === ch
      : !(v.ch && this._chans && this._chans.has(v.ch)));
    const list = this.seVoices.filter(mine);
    const used = list.reduce((n, v) => n + v.voices, 0);
    const usedNoise = list.reduce((n, v) => n + v.noise, 0);
    if (q) return { max: q.voices, maxNoise: q.noise, used, usedNoise, list };
    const r = this._reserved();
    return {
      // 残りの席。BGM のぶんはここから引く(取ってある席は SE 専用)
      max: this.maxVoices - r.voices - this.bgmVoices,
      maxNoise: this.maxNoise - r.noise,
      used, usedNoise, list,
    };
  }


  /** いま実際に使う定位の出し方。知らない値ならモノラル */
  _spatialMode() {
    const m = this.spatial;
    return m === 'stereo' || m === 'hrtf' ? m : 'mono';
  }

  /**
   * その位置へ振るための入り口を返す。
   *
   * 節は位置ごとに 1 個で、`dest` にぶら下げて持つ。着せるものは
   * トラック単位なので、実際にはトラックにつき 1 個に落ち着く。
   * 音符ごとには作らない(節の作り捨てがいちばん高い)。
   * `dest` に持たせておけば、曲が終われば `dest` ごと捨てられる。
   *
   * モノラルのときだけ素通しにする。ステレオでは中央も節を通す。
   * 素通しにすると 1 本の音がそのまま左右へ配られて、
   * 振った音より中央の音だけ 3 dB 大きくなってしまう
   */
  _panFor(dest, pos) {
    if (!dest || !pos) return dest;
    const mode = this._spatialMode();
    if (mode === 'mono') return dest;
    let bank = dest.__pan;
    if (!bank) { bank = new Map(); dest.__pan = bank; }
    const key = `${mode}:${pos[0]},${pos[1]},${pos[2]}`;
    const hit = bank.get(key);
    if (hit) return hit;
    const inp = mode === 'hrtf' ? this._panHRTF(dest, pos) : this._panStereo(dest, pos);
    // 出口を 2 本持つ音源(`_panPair`)は、この節を通さずに両側へ置く。
    // そのときに要るものを覚えておく — 節だけ渡されても元の行き先と位置が分かるように
    inp.__spot = { dest, pos, mode };
    bank.set(key, inp);
    return inp;
  }

  /**
   * 重ねた中身の @gain を掛ける行き先。
   *
   * 掛ける値ごとに節を 1 つ作って使い回す。音ごとに作ると、常駐の処理器が
   * 行き先の数だけ増えてしまう(`_wkPush` は行き先ごとに処理器を持つ)。
   * 1 のときは何も挟まない
   */
  _gainDest(dest, gain) {
    if (!dest || !this.ctx || !(gain >= 0) || gain === 1) return dest;
    let bank = dest.__gain;
    if (!bank) { bank = new Map(); dest.__gain = bank; }
    const hit = bank.get(gain);
    if (hit) return hit;
    const g = this.ctx.createGain();
    g.gain.value = gain;
    g.connect(dest);
    g.__under = { dest, gain };
    bank.set(gain, g);
    return g;
  }

  /**
   * 出口を 2 本持つ音源の行き先。1 本目が左へ行く束、2 本目が右へ行く束。
   *
   * モノラルでは足して 1 本に戻す。ステレオでは `@p{…}` の両側へ置き、
   * 横へ寄るほど狭めて、端では 2 本が重なる。位置は曲が持ち、広さは音色が持つ。
   *
   * 広げていない音色(2 本に半分ずつ)が、モノラルの音源と同じ大きさで鳴るように
   * 持ち上げる。等パワーの振り方では、両側へ置いた 2 本の和が
   * `cos(s·π/4)` 倍になる(s は広さ)。その逆を掛けると、ちょうど一致する。
   * 広げたぶんは片側が大きくなるが、それは広げたことの結果なのでそのままにする
   */
  _panPair(d) {
    if (!d || !this.ctx) return d;
    if (d.__pair) return d.__pair;
    const ctx = this.ctx;
    // 重ねた中身の @gain を挟んだ行き先(`_gainDest`)。ステレオでは両側を
    // 元の行き先の位置へ直に置くので、掛ける節を両側の手前へ移す
    if (d.__under) {
      const g = ctx.createGain();
      g.gain.value = d.__under.gain;
      g.connect(this._panPair(d.__under.dest));
      d.__pair = g;
      return g;
    }
    const split = ctx.createChannelSplitter(2);
    const spot = d.__spot;
    if (!spot) {
      // モノラル(`_panFor` が素通しにしたとき)。2 本を足して 1 本に戻す。
      // 畳むのは足し算 — `channelCount` を 1 にして任せると平均になり、6dB 下がる
      const sum = ctx.createGain();
      split.connect(sum, 0);
      split.connect(sum, 1);
      sum.connect(d);
      d.__pair = split;
      return split;
    }
    const { dest, pos, mode } = spot;
    const h = Math.hypot(pos[0], pos[2]);
    const pan = h > 0 ? pos[0] / h : 0;
    const s = 1 - Math.abs(pan);
    // 丸めるのは機械をまたぐため(`_panStereo` と同じ理由)
    const lift = ctx.createGain();
    lift.gain.value = Math.round(1e6 / Math.cos(s * Math.PI / 4)) / 1e6;
    lift.connect(split);
    const put = (ch, x) => {
      const q = Math.max(-1, Math.min(1, pan + x));
      // 渡すのは向きで、長さではない(`_panStereo` は x と z で割って向きだけを見る)。
      // 左右の値をそのまま x に入れると、長さで割られて必ず端へ寄ってしまう
      const at = mode === 'hrtf'
        ? [q, pos[1], pos[2]]
        : [q, 0, Math.sqrt(Math.max(0, 1 - q * q))];
      const inp = mode === 'hrtf' ? this._panHRTF(dest, at) : this._panStereo(dest, at);
      split.connect(inp, ch);
    };
    put(0, -s);
    put(1, s);
    d.__pair = lift;
    return lift;
  }

  /**
   * 自前の左右振り(等パワー)。音量差だけを作る。
   *
   * 上下(y)は音量差では作れないので効かない。前後(z)は向きにだけ効き、
   * 真横が ±1、真正面と真後ろが 0 になる(音量差では前と後ろを区別できない)。
   * 距離では音量を変えない。音量は `v` が持つ決まりなので、そこへ寄せる
   */
  _panStereo(dest, pos) {
    const ctx = this.ctx;
    const h = Math.hypot(pos[0], pos[2]);
    const pan = h > 0 ? pos[0] / h : 0;
    const a = (pan + 1) * Math.PI / 4;
    // 丸めるのは機械をまたぐため。Math.cos の最下位ビットは実装しだいで、
    // そのままだと中身が同じでも書き出したものの指紋が食い違う
    const r = (v) => Math.round(v * 1e6) / 1e6;
    const inp = ctx.createGain();
    const gl = ctx.createGain();
    const gr = ctx.createGain();
    const merge = ctx.createChannelMerger(2);
    gl.gain.value = r(Math.cos(a));
    gr.gain.value = r(Math.sin(a));
    inp.connect(gl); inp.connect(gr);
    gl.connect(merge, 0, 0); gr.connect(merge, 0, 1);
    merge.connect(dest);
    return inp;
  }

  /**
   * ブラウザ任せの定位。耳の形まで真似るので上下と前後も出るが、
   * 持っているデータがブラウザごとに違うので出力が揃わない。
   * 鳴らして聴くときだけのもの
   */
  _panHRTF(dest, pos) {
    const p = this.ctx.createPanner();
    p.panningModel = 'HRTF';
    // 距離では減らさない(ステレオ側と揃える)
    p.rolloffFactor = 0;
    // Web Audio の聞き手は -z を向いている。こちらは +z を前としているので裏返す
    if (p.positionX) {
      p.positionX.value = pos[0]; p.positionY.value = pos[1]; p.positionZ.value = -pos[2];
    } else {
      p.setPosition(pos[0], pos[1], -pos[2]);   // 古い書き方しか無いブラウザ向け
    }
    p.connect(dest);
    return p;
  }


  // ---- 直前の音を溜める(あとで聞き直す・動画に付ける) ----
  //
  // 出口の手前に聞き耳の節をつないで、流れた波形を輪っかに溜める。
  // 生の波形なので符号化は要らず、3 秒でも 0.6MB ほど(48kHz・モノラル)。
  // 輪っかは AudioWorklet の中に置く。毎回やりとりせず、欲しいときだけもらう。

  /** 聞き耳の節の中身(文字列から作るので、ファイルは増えない) */
  static get _tapCode() {
    return `
class MmsxxTap extends AudioWorkletProcessor {
  constructor(opts) {
    super();
    this.size = opts.processorOptions.size | 0;
    this.buf = new Float32Array(this.size);
    this.at = 0; this.len = 0;
    this.port.onmessage = (e) => {
      if (e.data === 'grab') {
        // 古い順に並べ直して渡す
        const out = new Float32Array(this.len);
        const start = (this.at - this.len + this.size) % this.size;
        for (let i = 0; i < this.len; i++) out[i] = this.buf[(start + i) % this.size];
        this.port.postMessage(out, [out.buffer]);
      } else if (e.data === 'clear') { this.at = 0; this.len = 0; }
      else if (e.data === 'hold') { this.hold = true; }
      else if (e.data === 'go') { this.hold = false; }
    };
  }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch && !this.hold) {
      for (let i = 0; i < ch.length; i++) {
        this.buf[this.at] = ch[i];
        this.at = (this.at + 1) % this.size;
        if (this.len < this.size) this.len++;
      }
    }
    return true;   // 音が止まっても回しつづける
  }
}
registerProcessor('mmsxx-tap', MmsxxTap);
`;
  }

  /**
   * 直前の音を溜めはじめる(0 でやめて捨てる)。
   * まだ音が解禁されていなければ覚えておいて、解禁されたときに始める。
   * @param {number} seconds 何秒ぶん持つか
   */
  keepSound(seconds) {
    this._keepSec = Math.max(0, seconds);
    this.holdSound(false);   // 止めたままにしない(絵と同じ理由)
    if (!this.ctx) return;              // 解禁待ち(_out で始める)
    if (this._keepSec <= 0) { this._stopTap(); return; }
    this._out();                        // bus を用意させる
    this._startTap(this._keepSec);
  }

  /** 聞き耳をつなぐ */
  _startTap(seconds) {
    if (this._tap || this._tapBusy || !this.ctx || !this._bus) return;
    if (!this.ctx.audioWorklet) return;   // 使えない環境では黙って何もしない
    this._tapBusy = true;
    const size = Math.round(seconds * this.ctx.sampleRate);
    const url = URL.createObjectURL(new Blob([ChipTuneSound._tapCode], { type: 'application/javascript' }));
    this.ctx.audioWorklet.addModule(url).then(() => {
      URL.revokeObjectURL(url);
      if (this._keepSec <= 0 || !this._bus) { this._tapBusy = false; return; }
      const node = new AudioWorkletNode(this.ctx, 'mmsxx-tap', { processorOptions: { size } });
      // 節を回しつづけるため、音の出ない先へつないでおく
      const sink = this.ctx.createGain();
      sink.gain.value = 0;
      node.connect(sink);
      sink.connect(this.ctx.destination);
      // 録るのはエフェクトを通ったあと。聞こえた音と同じものを残す
      this._post.connect(node);
      this._tap = node; this._tapSink = sink;
      this._tapBusy = false;
    }).catch(() => { this._tapBusy = false; });
  }

  /** 聞き耳を外して捨てる */
  _stopTap() {
    if (this._tap) { try { this._tap.disconnect(); } catch (e) { /* gone */ } }
    if (this._tapSink) { try { this._tapSink.disconnect(); } catch (e) { /* gone */ } }
    this._tap = null; this._tapSink = null;
  }

  /**
   * 録画へ音を分ける。出口の手前(bus)からつなぐので、
   * ミュート中でも動画には音が入る。null で外す。
   * @param {MediaStreamAudioDestinationNode|null} dest
   */
  recordTo(dest) {
    const bus = this._out();
    if (!bus) return false;
    if (this._recDest) { try { bus.disconnect(this._recDest); } catch (e) { /* gone */ } }
    this._recDest = dest || null;
    if (dest) bus.connect(dest);
    return true;
  }

  /** 溜めたぶんを捨てて、いまから溜め直す */
  clearSound() { if (this._tap) this._tap.port.postMessage('clear'); }

  /**
   * 溜めるのをいったん止める / 再開する(溜めたものは捨てない)。
   * ポーズ中は音が出ていないので、止めておかないと
   * 輪っかが無音で埋まってしまう
   */
  /**
   * @param {boolean} on true で溜めるのを止める / false で再開する
   */
  holdSound(on) { if (this._tap) this._tap.port.postMessage(on ? 'hold' : 'go'); }

  /**
   * 溜まっている音を受け取る。
   * @returns {Promise<AudioBuffer|null>} 鳴らせる形。溜めていなければ null
   */
  soundBack() {
    const node = this._tap;
    if (!node || !this.ctx) return Promise.resolve(null);
    return new Promise((done) => {
      const t = setTimeout(() => done(null), 500);   // 返事が来なければあきらめる
      node.port.onmessage = (e) => {
        clearTimeout(t);
        const data = e.data;
        if (!data || !data.length) { done(null); return; }
        const buf = this.ctx.createBuffer(1, data.length, this.ctx.sampleRate);
        buf.getChannelData(0).set(data);
        done(buf);
      };
      node.port.postMessage('grab');
    });
  }

  /** 溜まっている音をそのまま鳴らす(リプレイ用) */
  async playSound() {
    const buf = await this.soundBack();
    if (!buf) return null;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.connect(this._out());
    src.start();
    return src;
  }


  /**
   * BGM を登録する。MML でも音声ファイル(mp3 など)でも同じように扱える。
   *
   * 確かめた結果を返す(`validateMML()` と同じ形)。読めないところがあっても
   * 登録は止めない — 鳴らせるところは鳴らす。ただし黙ってはいない。
   * `errors` に入ったものは `console.warn` にも出す(2026-09-15)。
   *
   * @param {string} name 呼び出すときの名前。同じ名前で登録し直すと上書きする
   * @param {string|string[]|{url:string,gain?:number}} src
   *   MML 文字列 / チャンネルごとの MML 配列 / {url} を渡すと音声ファイル再生になる
   * @param {{beep?:boolean, mode?:string, allowOverLimit?:boolean}} [opts]
   *   beep = 音色を無視して単純なビープで鳴らす。
   *   mode = 読み方(`strict` / `normal` / `loose`。既定は `normal`)。
   *   allowOverLimit = 上限で止めるのをやめる。越えたことは警告で出す
   * @returns {object} `validateMML()` の返り値
   */
  /**
   * 読み終えた中間データから曲を登録する。MML の字を通さない。
   *
   * Stave はプレイヤーが読むデータを直に作ると決めてある
   * (docs/SCORE_LANG.md「Stave を直に鳴らす。MML は書き出しとして残す」)。
   * `defineBGM()` は字を受けてコンパイルするので、字を持たない側から鳴らす道が
   * 無かった。ここがその受け口。
   *
   * 渡すのは `compileMML()` が返す形の並びで、チャンネル 1 本につき 1 つ。
   * 中の組み立て(エコーの写し、余韻の空き、声の数、層)はこちらでやる。
   * 呼ぶ側がそこまで作ると、同じ処理が 2 か所に増える。
   *
   * @param {string} name 名前。`startBGM()` で引く
   * @param {object[]} tracks `compileMML()` が返す形の並び
   */
  defineBGMData(name, tracks, opts = {}) {
    this._mutesOf(name);
    const list = Array.isArray(tracks) ? tracks : [tracks];
    const built = list.map((d, i) => {
      const tr = trackFrom(d);
      tr.ch = i;
      if (opts.beep) markBeep(tr);
      return tr;
    });
    built.problems = built.flatMap((t, i) => (t.problems || [])
      .map((x) => ({ ...x, ch: i })));
    built.check = sayErrors(`BGM "${name}"`, checkOfTracks(built));
    this.bgmDefs.set(name, built);
    return built.check;
  }

  defineBGM(name, src, opts = {}) {
    this._mutesOf(name);
    if (src && typeof src === 'object' && !Array.isArray(src) && src.url) {
      this.bgmDefs.set(name, { kind: 'audio', url: src.url, gain: src.gain ?? 1 });
      // 音声ファイルは MML ではないので、見るところが無い
      return { ok: true, errors: [], warnings: [], channels: [], total: 0 };
    }
    // バンドル音色の指示行は、チャンネルをまたいで効く。
    // 1 本のテキストならヘッダが写るが、分けて渡す形にはヘッダが無いので配る
    const voices = shareBundles(Array.isArray(src) ? src : [src]);
    // 何番目のチャンネルかを覚えておく(音程の丸めをチャンネルごとに決めるため)
    const tracks = voices.map((t, i) => {
      const track = compileTrack(t, opts.mode, opts.allowOverLimit);
      track.ch = i;
      if (opts.beep) markBeep(track);
      return track;
    });
    // 確かめた結果を、定義と一緒に持っておく。鳴らす前に読めるものは
    // 全部ここから出す。画面の側が自分でコンパイルし直さなくてよくなる
    // (2026-09-15)。読むのは `bgmInfo()` と `bgmActive()`
    tracks.check = sayErrors(`BGM "${name}"`, validateMML(voices, opts.mode, opts.allowOverLimit));
    // 読めなかったところを 1 本にまとめる。画面はここから出す
    tracks.problems = tracks.flatMap((t, i) => (t.problems || [])
      .map((x) => ({ ...x, ch: i })));
    // 曲のテンポ。JS から音長で渡したエフェクトを、この曲に替えたときに秒へ直す
    const head = Number(tracks.map((t) => t.meta && t.meta.tempo).find((v) => v != null));
    tracks.tempo = head > 0 ? head
      : (voices.map((v) => firstTempo(String(v ?? ''))).find((v) => v > 0) ?? 120);
    this.bgmDefs.set(name, tracks);
    return tracks.check;
  }

  /**
   * いまの場所から見て、次に切り替えてよいのは何秒のところか。
   *
   * 曲を替えるときの待ちに使う内側のもの。切れ目を書いていない曲では
   * `0` を返す。待たずに替えてよい、の意味。
   *
   * @param {string} name いま鳴っている曲の名前
   * @param {number} pos いまの場所(秒)
   * @returns {number} 何秒待つか。0 なら待たない
   */
  _waitFor(name, pos) {
    const pts = this.bgmSwitchPoints(name);
    if (!pts.length) return 0;
    const def = this.bgmDefs.get(name);
    // 1 周の終わり。後奏を書いた曲はそこまで
    const span = Math.max(...def.map((t) => t.total), 0);
    const end = def.map((t) => t.outro).find((v) => v != null) ?? span;
    const next = pts.find((t) => t > pos + 1e-3 && t <= end + 1e-9);
    // 先に切れ目が無ければ、1 周の終わりまで待つ
    return Math.max(0, (next != null ? next : end) - pos);
  }

  /**
   * 切り替えてよい場所を返す(秒)。
   *
   * `#switch <小節数>` の網の目と、全部のチャンネルが引いた `|` の場所。
   * 何も書いていない曲では空で、そのときはどこでも切り替えてよい。
   *
   * @param {string} name `defineBGM()` で登録した名前
   * @returns {number[]} 秒の早い順
   */
  bgmSwitchPoints(name) {
    const def = this.bgmDefs.get(name);
    return Array.isArray(def) ? switchPoints(def) : [];
  }

  /**
   * 選択肢(`#takes`)を選び替える。
   *
   * 同じところに何通りかの演奏を書いておいて、鳴らしながら差し替える
   * (docs/DYNAMIC.md)。囲みの長さはいちばん長い選択肢に合わせてあるので、
   * 選び替えても曲の長さは動かない。鳴っている最中でも呼べる。
   *
   * 選ぶのは曲ぜんぶで 1 つ。別のチャンネルに同じグループを書いておけば、
   * まとめて替わる。そのグループを持っていない囲みは動かない。
   *
   * 替わるのは、鳴らす先を積むときです。囲みの途中で押して間に合わなければ、
   * 次の切れ目(`#switch` と `|`)まで滑らせる。切れ目を書いていない曲は、
   * そのまま次に積むところから替わる。
   *
   * 待っている最中に跳んだり止めたりしたら、待たずに差し替える。
   *
   * 囲みの頭から鳴らし直すかどうかは、曲のほうが決める。
   * `#takes mood restart` と書いた囲みは、押されると頭へ戻って鳴らし直す。
   * 場面が変わったことを音でも言いたいときに要る(別の曲にする手もあるが、
   * 共通のパートが多い曲では持ちにくいし、つなぎ目で隙間が出る)(2026-09-17)。
   *
   * 切れ目(`#switch` と `|`)を書いた曲では、そこまで待ってから替える。
   * 頭へ戻すときも同じで、耳が切れ目に着いたところで跳ぶ。待たせたくないときは
   * `now` を書く(`#takes mood restart now`)。切れ目を書いていない曲は
   * 待ちようが無いので、その場で替わる(2026-09-17)。
   *
   * その 1 回だけ変えたいときは引数で上書きする。渡さなければ曲の指定どおり。
   *
   * ```js
   * mmsxx.audio.selectTake('曲', 'mood', 'tense');                    // 曲の指定どおり
   * mmsxx.audio.selectTake('曲', 'mood', 'tense', { restart: true }); // 頭へ戻す
   * mmsxx.audio.selectTake('曲', 'mood', 'tense', { now: true });     // 待たない
   * ```
   *
   * @param {string} name `defineBGM()` で登録した名前
   * @param {string} group グループの名前(`#takes mood` の mood)
   * @param {string} take 選択肢の名前(`#take tense` の tense)
   * @param {{restart?:boolean, now?:boolean}} [opts]
   *   restart = 囲みの頭へ戻して鳴らし直すか / now = 切れ目を待たないか
   *   (どちらも省くと曲の指定どおり)
   * @returns {boolean} 動いた囲みがあれば true
   */
  selectTake(name, group, take, opts = {}) {
    const def = this.bgmDefs.get(name);
    if (!Array.isArray(def)) return false;
    const picks = def.picks || (def.picks = {});
    let moved = false;
    for (const track of def) {
      for (const box of track.takes || []) {
        if (box.group !== group) continue;
        if (!box.options.some((o) => o.name === take)) continue;
        moved = true;
      }
    }
    if (!moved) return false;
    picks[group] = take;

    // 差し替えの中身。積んだ先を作り直すだけで、跳びはしない
    const apply = () => {
      this._takeWait = null;
      for (const track of def) this._rebuildTrack(track, picks);
    };
    // 待ちが残っていたら、こちらで引き取る。あとから押したほうが勝つ
    if (this._takeWait) { clearTimeout(this._takeWait.timer); this._takeWait = null; }

    // 曲が書いた指定。引数があればその 1 回だけ上書きする
    const flag = (key) => def.some((track) => (track.takes || [])
      .some((box) => box.group === group && box[key]));
    const restart = opts.restart === undefined ? flag('restart') : opts.restart === true;
    const now = opts.now === undefined ? flag('now') : opts.now === true;

    const st = this.bgmState;
    const live = st && st.name === name && !st.paused && st.cursor != null;
    if (!live) { apply(); return true; }

    /**
     * いまの時刻を含んでいる takes のブロックの頭。
     *
     * 外にいるときは null。そのブロックを鳴らしている最中でなければ戻さない —
     * 手前のブロックへ跳ぶと、聞いているところと関係ない場所へ飛ぶ(2026-09-18)
     */
    const headFor = (at) => {
      let head = null;
      for (const track of def) {
        for (const box of track.takes || []) {
          if (box.group !== group) continue;
          if (at < box.at - 1e-9 || at >= box.at + box.dur - 1e-9) continue;
          if (head == null || box.at > head) head = box.at;
        }
      }
      return head;
    };
    /** 頭から鳴らし直す。差し替えてから跳ぶ */
    const again = () => {
      const head = headFor(this.bgmPosition());
      apply();
      // テイクの切り替えは曲が流れている最中に起きるので、前のテイクの余韻は
      // 最後まで鳴らす。切れ目を待ってから跳んでいるのに、ここで切ると
      // 待った意味が薄れる(docs/ENGINE_TODO.md、2026-09-28)
      if (head != null) this.seekBGM(head, { cut: false });
    };

    // 切れ目を待つか。書いていない曲は切れ目が無いので、待ちようがない
    const pts = now ? [] : this.bgmSwitchPoints(name);
    if (restart) {
      // 頭へ戻すときは、耳に届く時刻で切り替える。先読みで積む範囲ではなく、
      // 聞いている場所が切れ目に着いたところで跳ぶ(2026-09-17)
      const at = this.bgmPosition();
      const pt = pts.find((t) => t > at + 1e-3);
      if (pt == null) { again(); return true; }
      const ms = Math.max(0, (st.base + pt - this.ctx.currentTime) * 1000);
      this._takeWait = { at: st.base + pt, timer: setTimeout(again, ms), run: apply };
      return true;
    }

    // 先だけ差し替える。積むのは 0.5 秒先までなので、囲みがそれより後ろに
    // あれば何もしなくてよい。次に積むときには、もう新しい並びを読む。
    // 積み直すと音がいったん切れて間が開くので、要らないときはやらない
    // (2026-09-16)。
    //
    // 囲みの途中まで積んでしまっているときだけ、次の切れ目まで滑らせる。
    // そこまでは今のまま鳴らして、切れ目から新しいほうにする(2026-09-16)
    const inside = def.some((track) => (track.takes || []).some(
      (box) => box.group === group
        && st.cursor > box.at + 1e-9 && st.cursor < box.at + box.dur - 1e-9));
    const pt = inside ? pts.find((t) => t > st.cursor + 1e-9) : null;
    if (pt == null) { apply(); return true; }
    const ms = Math.max(0, (st.base + pt - 0.5 - this.ctx.currentTime) * 1000);
    this._takeWait = { at: st.base + pt, timer: setTimeout(apply, ms), run: apply };
    return true;
  }

  /**
   * いま選んである選択肢を返す。`{ グループ: 選択肢 }`
   *
   * @param {string} name `defineBGM()` で登録した名前
   * @returns {Object<string,string>}
   */
  takesOf(name) {
    const def = this.bgmDefs.get(name);
    if (!Array.isArray(def)) return {};
    const out = {};
    for (const track of def) {
      for (const box of track.takes || []) {
        if (out[box.group] === undefined) {
          out[box.group] = (def.picks || {})[box.group] ?? box.options[0].name;
        }
      }
    }
    return out;
  }

  /**
   * 合図(`#cue`)を予約する。
   *
   * 音符と同じ範囲([from, to))を見て、そこにある合図を耳に届く時刻へ予約する。
   * 音は Web Audio の時計で 0.5 秒先まで積んであるので、合図だけ別に
   * 待たせないと、聞こえる前に届いてしまう(docs/DYNAMIC.md)。
   *
   * @param {object} track トラック
   * @param {number} ch 何本目か
   * @param {object} state 鳴らしている状態
   * @param {number} from 積む範囲の始まり(曲の中の秒)
   * @param {number} to 積む範囲の終わり
   */
  /**
   * エフェクトの並びを節につないで返す。全体(`_fxWire`)とチャンネル(`_chFx`)で
   * 同じものを使う。置き場所が違うだけで、作るものは同じ。
   *
   * 処理器が読めていない段は飛ばす。黙るより、素のまま鳴るほうがよい
   * @param {object[]} list `{kind, ...値}` の並び。前から順に通る
   * `pitched` は音符の高さを受け取る段(wavestep)。`_scheduleFilters` が音符の頭で書き込む。
   * `live` は作ったあとで値を動かせる段。`tweakMasterEffects()` がここを見る
   * @returns {{head:AudioNode,tail:AudioNode,nodes:AudioNode[],slots:Map,
   *            pitched:AudioNode[],live:object[]}|null}
   * @private
   */
  _fxChain(list) {
    const ctx = this.ctx;
    const ready = (kind) => this._wkReady && this._wkReady.get(kind) === ctx;
    const nodes = [];
    const slots = new Map();
    const pitched = [];
    const loud = [];
    // 作ったあとで値を動かせる段。{ kind, 動かし方 } を順番どおりに並べる
    const live = [];
    let head = null, at = null;
    const add = (n) => {
      if (!head) head = n; else at.connect(n);
      nodes.push(n);
      at = n;
    };
    for (const fx of list) {
      if (FILTERS[fx.kind]) {
        if (!ready('filter')) continue;
        const n = new AudioWorkletNode(ctx, 'mmsxx-filter', filterOptions(fx.kind, fx));
        add(n);
        if (fx.slot !== undefined) slots.set(fx.slot, n);
        live.push({
          kind: fx.kind,
          slot: fx.slot,
          params: {
            cutoff: n.parameters.get('cutoff'),
            resonance: n.parameters.get('resonance'),
            drive: n.parameters.get('drive'),
            mix: n.parameters.get('mix'),
          },
        });
      } else if (fx.kind === 'echo') {
        if (!ready('echo')) continue;
        // 返りを左右へ回すときは、出口を 2 本に決めておく。中央の音は 1 本のまま
        // 届くので、そのままでは回す先が無い。cross 0 のときは今までどおり任せる
        const lr = fx.cross > 0
          ? { channelCount: 2, channelCountMode: 'explicit', outputChannelCount: [2] } : {};
        const n = new AudioWorkletNode(ctx, ECHO_NODE, { processorOptions: fx, ...lr });
        add(n);
        // 動かせる値は AudioParam。作るときの値はここで入れる
        // (processorOptions にも入っているが、処理器は AudioParam を読む)
        const live4 = { time: null, feedback: null, mix: null, tone: null };
        for (const name of Object.keys(live4)) {
          const prm = n.parameters.get(name);
          prm.value = fx[name];
          live4[name] = prm;
        }
        live.push({ kind: 'echo', slot: fx.slot, params: live4 });
      } else if (fxWorklet(fx.kind) === 'chip') {
        if (!ready('chip')) continue;
        const n = new AudioWorkletNode(ctx, CHIP_NODE, { processorOptions: fx });
        add(n);
        if (fx.kind === 'wavestep') pitched.push(n);
      } else if (COLOR_WORKLETS[fx.kind]) {
        if (!ready(fx.kind)) continue;
        add(new AudioWorkletNode(ctx, COLOR_WORKLETS[fx.kind].node, { processorOptions: fx }));
      } else if (fxWorklet(fx.kind) === 'dyn') {
        if (!ready('dyn')) continue;
        add(new AudioWorkletNode(ctx, DYN_NODE, { processorOptions: fx }));
      } else if (fx.kind === 'compressor') {
        // 作りつけのものを使う。山を見て絞るだけなら、処理器を書くより軽くて確か。
        // knee は決めておく(パラメータを増やさない)
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = fx.threshold;
        comp.ratio.value = fx.ratio;
        comp.attack.value = fx.attack;
        comp.release.value = fx.release;
        comp.knee.value = 6;
        // 作りつけのものは、自分で音量を持ち上げる(仕様では、0dB を入れたときに
        // 下がるぶんの 0.6 乗)。そのぶんを差し引いて、makeup を書いた量そのものにする。
        // knee のぶんは入れていないので、ずれは 1dB に届かない見込み
        const auto = -0.6 * fx.threshold * (1 - 1 / fx.ratio);
        const up = ctx.createGain();
        up.gain.value = Math.pow(10, (fx.makeup - auto) / 20);
        add(comp);
        add(up);
      } else if (fx.kind === 'loudness') {
        // 棚形の 2 つ。FILTERS に棚は無く、値は音量つまみで動かすだけなので、
        // 作りつけのノードで足りる。量は `_loudUpdate` が音量に合わせて書き込む
        const lo = ctx.createBiquadFilter();
        lo.type = 'lowshelf';
        lo.frequency.value = LOUDNESS.bassHz;
        const hi = ctx.createBiquadFilter();
        hi.type = 'highshelf';
        hi.frequency.value = LOUDNESS.trebleHz;
        const g = loudnessGains(this.volume, fx);
        lo.gain.value = g.bass;
        hi.gain.value = g.treble;
        add(lo);
        add(hi);
        loud.push({ fx, lo, hi });
      } else if (fx.kind === 'reverb') {
        // 元の音はそのまま通し、響きを mix ぶん足す。
        // 分岐の手前に 1 つ置いておくと、外すときに 1 つ外せば済む
        if (!head) add(ctx.createGain());
        const sum = ctx.createGain();
        const conv = ctx.createConvolver();
        conv.normalize = false;
        conv.buffer = reverbImpulse(ctx, fx.time, fx.width);
        const wet = ctx.createGain();
        wet.gain.value = fx.mix;
        at.connect(sum);
        at.connect(conv);
        conv.connect(wet);
        wet.connect(sum);
        nodes.push(conv, wet, sum);
        // 動かせるのは mix だけ。time と width は響きの波形そのものに入っている
        live.push({ kind: 'reverb', slot: fx.slot, gains: { mix: wet.gain } });
        at = sum;
      }
    }
    return head ? { head, tail: at, nodes, slots, pitched, loud, live } : null;
  }

  /**
   * そのチャンネルの出口へ置くエフェクトの並び。`@f` を書いていなければ null。
   *
   * 番号(`@f2{…}`)は順番の札で、本数ではない。書いた番号だけを小さい順に通す。
   * 種類は 1 台に 1 つ(先に書いたもの)。途中で差し替えると音が切れるので、
   * コンパイルのところで知らせを出して 1 つに寄せている。
   *
   * 動く値(`live`)は `_scheduleFilters` が時刻つきで動かす。
   * 動かない値(reverb の `time` `width`、echo の `cross`)は、組み合わせごとに
   * 1 本ずつ並びを作って、出口の音量で入れ替える。`@f0` と `@f2{off}` で
   * 素通しへ移るぶんも 1 本。同じ組み合わせは使い回すので、行ったり来たりしても
   * 増えない(2026-10-23)
   * @private
   */
  _chFx(track) {
    const list = track && track.filters;
    if (!list || !list.length || !this.ctx) return null;
    const ctx = this.ctx;
    const kinds = { ...FILTERS, ...MASTER_FX };
    // 番号ごとに、動かせない値の組み合わせを集める。
    // `fxVariants` はコンパイルのところでも同じ数え方に使っている
    const vars = fxVariants(list, kinds, FILTERS);
    if (!vars.size) return null;
    // 組み合わせの名前から、その値へ戻す表
    const specOf = new Map();
    for (const f of list) {
      if (f.off || !f.kind) continue;
      const slot = f.slot ?? 1;
      const g = vars.get(slot);
      if (!g || f.kind !== g.kind) continue;
      const sig = fxVariant(g.kind, f, kinds);
      if (!specOf.has(sig)) specOf.set(sig, { ...f, slot });
    }

    const nodes = [];
    const slots = new Map();
    const pitched = [];
    const loud = [];
    const live = [];
    /** 番号ごとの入れ替え。`{ gains: Map(組み合わせの名前 → 音量), now: いま鳴っているもの }` */
    const swap = new Map();
    let head = null, at = null;
    /** 直列につなぐ。前の段の出口へつないで、自分を出口にする */
    const join = (inNode, outNode) => {
      if (!head) head = inNode; else at.connect(inNode);
      at = outNode;
    };
    const take = (c) => {
      nodes.push(...c.nodes);
      for (const [s, n] of c.slots) slots.set(s, n);
      pitched.push(...c.pitched);
      loud.push(...c.loud);
      live.push(...c.live);
    };

    for (const slot of [...vars.keys()].sort((a, b) => a - b)) {
      const g = vars.get(slot);
      // 組み合わせが 1 つで、素通しへ移ることも無ければ、今までどおり 1 本だけ。
      // 曲の大半はこちらを通る
      if (g.sigs.length < 2 && !g.bypass) {
        const c = this._fxChain([specOf.get(g.sigs[0])]);
        if (!c) continue;
        take(c);
        join(c.head, c.tail);
        continue;
      }
      // 組み合わせごとに 1 本ずつ作って並べ、出口の音量で入れ替える。
      //
      // どれにも音を入れ続ける。入れ替えたときに、溜まっていた返りや響きが
      // 消えないようにするため。そのぶん重いので、本数はコンパイルのところで
      // 数えて知らせている
      const fan = ctx.createGain();
      const sum = ctx.createGain();
      nodes.push(fan, sum);
      const gains = new Map();
      for (const sig of g.sigs) {
        const c = this._fxChain([specOf.get(sig)]);
        if (!c) continue;
        take(c);
        const gn = ctx.createGain();
        gn.gain.value = 0;
        nodes.push(gn);
        fan.connect(c.head);
        c.tail.connect(gn);
        gn.connect(sum);
        gains.set(sig, gn);
      }
      if (!gains.size) { nodes.pop(); nodes.pop(); continue; }
      if (g.bypass) {
        // 素通し。入口から直に出口へ。節を外さないのは、外すと繋ぎ直しの
        // ところで音が切れるため(`@f0` と同じ考え)
        const gn = ctx.createGain();
        gn.gain.value = 0;
        nodes.push(gn);
        fan.connect(gn);
        gn.connect(sum);
        gains.set(FX_BYPASS, gn);
      }
      // はじめは、最初に書いた組み合わせを鳴らす
      const firstSig = g.sigs.find((s) => gains.has(s)) ?? FX_BYPASS;
      gains.get(firstSig).gain.value = 1;
      swap.set(slot, { kind: g.kind, gains, now: firstSig });
      join(fan, sum);
    }
    if (!head) return null;
    return { head, tail: at, nodes, slots, pitched, loud, live, swap };
  }

  /**
   * `@f` の書き替えを積む。合図(`_scheduleCues`)と同じ範囲の切り方。
   *
   * 動くのはパラメータが `live` を立てているものだけ。フィルタの
   * カットオフ・レゾナンス・飽和、echo の `time` `feedback` `mix` `tone`、
   * reverb の `mix`。動かせない値はコンパイルのところで先に書いたものへ
   * 寄せてあるので、ここへは同じ値しか来ない。
   *
   * 前は echo と reverb を丸ごと動かせないものとして扱っていた
   * (2026-10-23 に、AudioParam へ移して動かせるようにした)。
   *
   * `@f0` と `@f2{off}` は節を外さずに、フィルタなら `mix` を 0 にし、ほかは素通しの
   * 脇道へ移す。外すと繋ぎ直しのところで音が切れる
   */
  _scheduleFilters(track, ch, state, from, to) {
    const list = track.filters;
    if (!list || !list.length) return;
    const chain = state.chFilters && state.chFilters[ch];
    if (!chain) return;
    // wavestep には音符の高さを渡す。和音は後ろに書いた音が勝つ(和音には向かない)
    if (chain.pitched && chain.pitched.length) {
      for (const ev of track.events) {
        if (ev.t < from || ev.t >= to || !(ev.freq > 0)) continue;
        const at = state.base + ev.t;
        for (const n of chain.pitched) n.parameters.get('pitch').setValueAtTime(ev.freq, at);
      }
    }
    // フィルタの節が 1 つも無くても先へ進む。エコーだけを置いた並び
    // (`@f2{echo …}` だけ)でも、動かせる値はここで動かす(2026-10-23)。
    // 前はここで帰っていたので、書き替えても何も起きなかった。
    // 動かせる値を持たない段(tube・transformer・tape など)も、入れ替えるために先へ進む。
    // 入れ替えを数えていなかったので、`@f0` を書いても外れなかった(2026-10-24)
    const slots = chain.slots || new Map();
    if (!slots.size && !(chain.live || []).length && !(chain.swap && chain.swap.size)) return;
    // 外すときは mix を 0 にする。フィルタは回り続けるので、戻したときに途切れない。
    // 前はカットオフを端へ寄せていたが、端へ寄せても素通しにならない種類
    // (bandpass・notch・highpass4)があった(2026-10-24)
    const open = (node, at) => {
      node.parameters.get('mix').setValueAtTime(0, at);
    };
    for (const f of list) {
      if (f.t < from || f.t >= to) continue;
      const at = state.base + f.t;
      if (f.off && f.all) {
        for (const node of slots.values()) open(node, at);
        // フィルタでない段は素通しの脇道へ移す
        for (const slot of chain.swap ? chain.swap.keys() : []) {
          this._swapFx(chain, slot, FX_BYPASS, at);
        }
        continue;
      }
      const slot = f.slot ?? 1;
      const node = slots.get(slot);
      if (!node) {
        // フィルタでない段。動く値はその場で動かし、動かない値は並びを入れ替える
        if (f.off) this._swapFx(chain, slot, FX_BYPASS, at);
        else {
          this._swapFx(chain, slot, fxVariant(f.kind, f, { ...FILTERS, ...MASTER_FX }), at);
          this._moveFx(chain, slot, f, at);
        }
        continue;
      }
      if (f.off) { open(node, at); continue; }
      node.parameters.get('cutoff').setValueAtTime(f.cutoff, at);
      node.parameters.get('resonance').setValueAtTime(f.resonance, at);
      node.parameters.get('drive').setValueAtTime(f.drive, at);
      node.parameters.get('mix').setValueAtTime(f.mix ?? 1, at);
    }
  }

  /**
   * 番号の並びを、その時刻で入れ替える。
   *
   * 出口の音量を入れ替えるだけで、節は外さない。どちらにも音が入り続けるので、
   * 溜まっていた返りや響きは消えない。入れ替えは `FX_SWAP` 秒かけて移す。
   * その場で切り替えるとプツッと鳴る(中身の違う 2 本の音が段差でつながるため)。
   *
   * 掛けているあいだは両方が鳴る。移る先の響きが立ち上がり、元の響きが消える
   * @param {object} chain `_chFx` が作った並び
   * @param {number} slot 番号
   * @param {string} sig 移る先の組み合わせの名前(`FX_BYPASS` なら素通し)
   * @param {number} at いつ
   * @private
   */
  _swapFx(chain, slot, sig, at) {
    const sw = chain.swap && chain.swap.get(slot);
    if (!sw || sw.now === sig || !sw.gains.has(sig)) return;
    for (const [name, gn] of sw.gains) {
      const to = name === sig ? 1 : 0;
      gn.gain.cancelScheduledValues(at);
      gn.gain.setValueAtTime(gn.gain.value, at);
      gn.gain.linearRampToValueAtTime(to, at + FX_SWAP);
    }
    sw.now = sig;
  }

  /**
   * フィルタでない段の値を、その時刻で動かす。
   *
   * 動かせるのはパラメータが `live` を立てているものだけ(`MASTER_FX`)。
   * echo は AudioParam、reverb の `mix` は GainNode。どちらも時刻つきで積める。
   *
   * 動かせない値はコンパイルのところで先に書いたものへ寄せてあるので、
   * ここへは同じ値しか来ない。送っても何も変わらない
   * @private
   */
  _moveFx(chain, slot, fx, at) {
    const def = MASTER_FX[fx.kind];
    if (!def) return;
    const set = {};
    for (const [name, p] of Object.entries(def.params)) {
      if (p.live && fx[name] != null) set[name] = fx[name];
    }
    if (!Object.keys(set).length) return;
    // 同じ番号の並び全部に入れる。入れ替えたときに、どれを鳴らしても
    // 動く値は同じであってほしい
    for (const seg of chain.live || []) {
      if ((seg.slot ?? 1) !== slot || seg.kind !== fx.kind) continue;
      for (const [name, v] of Object.entries(set)) {
        const target = (seg.params && seg.params[name]) || (seg.gains && seg.gains[name]);
        if (target) target.setValueAtTime(v, at);
      }
    }
  }

  _scheduleCues(track, ch, state, from, to) {
    const list = track.cues;
    if (!list || !list.length) return;
    // 合図を止めてあるチャンネルは、並びを読まない。音は鳴る
    if (this._cueMute.has(ch)) return;
    for (const c of list) {
      if (c.t < from || c.t >= to) continue;
      const at = state.base + c.t;
      const wait = Math.max(0, (at - this.ctx.currentTime) * 1000);
      const cue = { id: ++this._cueSeq, name: c.name, arg: c.arg, t: c.t, ch };
      const timer = setTimeout(() => {
        if (this.bgmState !== state) return;   // 止めたあとには出さない
        this._cues.push(cue);
        // 取りに来ない使い方でも溜まりつづけないように、古いものから捨てる
        if (this._cues.length > 256) this._cues.splice(0, this._cues.length - 256);
        if (typeof this.onCue === 'function') {
          try { this.onCue(cue); } catch (e) { console.warn('[ChpTnSnd] onCue:', e); }
        }
      }, wait);
      state.cueTimers.push(timer);
    }
  }

  /**
   * 字(`"…"`)を、聞こえる時刻に合わせて予約する。
   *
   * 合図(`_scheduleCues`)と同じ作り。いつ消すかは予約しない。
   * 出すところだけを渡して、消し方は受けた側に委ねる —
   * 時間で消すのか、次の字で入れ替えるのかは画面の都合だからです
   * (docs/DYNAMIC.md)。
   *
   * @param {object} track トラック
   * @param {number} ch 何本目か
   * @param {object} state 鳴らしている状態
   * @param {number} from 積む範囲の始まり(曲の中の秒)
   * @param {number} to 積む範囲の終わり
   */
  _scheduleTexts(track, ch, state, from, to) {
    const list = track.texts;
    if (!list || !list.length) return;
    for (const x of list) {
      if (x.t < from || x.t >= to) continue;
      const at = state.base + x.t;
      const wait = Math.max(0, (at - this.ctx.currentTime) * 1000);
      const said = { id: ++this._textSeq, text: x.text, t: x.t, ch };
      const timer = setTimeout(() => {
        if (this.bgmState !== state) return;   // 止めたあとには出さない
        this._texts.push(said);
        if (this._texts.length > 256) this._texts.splice(0, this._texts.length - 256);
        if (typeof this.onText === 'function') {
          try { this.onText(said); } catch (e) { console.warn('[ChpTnSnd] onText:', e); }
        }
      }, wait);
      state.cueTimers.push(timer);
    }
  }

  /**
   * 溜まった字を取り出して空にする。
   *
   * 合図(`takeCues()`)と同じ使い方。いつ消すかはこちらが決めない。
   * 一定時間で消すのか、次の字が来たら入れ替えるのかは、受けた側が選びます。
   *
   * ```js
   * for (const said of audio.takeTexts()) {
   *   screen.show(said.ch, said.text);     // ch で分けても、1 か所にまとめてもよい
   * }
   * ```
   *
   * @returns {{id:number,text:string,t:number,ch:number}[]} 出た順
   */
  takeTexts() {
    const out = this._texts;
    this._texts = [];
    return out;
  }

  /**
   * 溜まった合図を取り出して空にする。
   *
   * 毎フレーム呼ぶ使い方を想定している。実機の鳴らし手も同じ形になるので、
   * こちらを本筋にしてある。1 本で受けたいときは `onCue` を入れる。
   *
   * ```js
   * for (const cue of audio.takeCues()) {
   *   if (cue.name === 'flash') game.flash(cue.arg);
   * }
   * ```
   *
   * @returns {{id:number,name:string,arg:number,t:number,ch:number}[]} 出た順
   */
  takeCues() {
    const out = this._cues;
    this._cues = [];
    return out;
  }

  /**
   * そのチャンネルの合図を止める / 戻す。音は鳴ったままです。
   *
   * ミュートは出口の音量なので、黙らせても合図は出る。受け取った側が
   * `isMuted(ch)` を見て決める。合図だけ止めたいときはこちら。
   *
   * @param {number} ch 何本目か
   * @param {boolean} [on] true で止める。省くと入れ替える
   * @returns {boolean} 止まっているか
   */
  muteCues(ch, on) {
    const want = on === undefined ? !this._cueMute.has(ch) : on === true;
    if (want) this._cueMute.add(ch);
    else this._cueMute.delete(ch);
    return want;
  }

  /** そのチャンネルの合図が止まっているか */
  cuesMuted(ch) {
    return this._cueMute.has(ch);
  }

  /** 予約してある合図を捨てる。止めたあとに演出だけ起きないようにする */
  _dropCues(state) {
    const s = state || this.bgmState;
    if (!s || !s.cueTimers) return;
    for (const t of s.cueTimers) clearTimeout(t);
    s.cueTimers = [];
  }

  /** 選んである選択肢のとおりに、トラックの並びを作り直す */
  _rebuildTrack(track, picks) {
    if (!track.takes || !track.takes.length) return;
    // 囲みの外のものは素の並びから取る。囲みの中は選んだものへ差し替える
    const inBox = (t) => track.takes.some((b) => t >= b.at - 1e-9 && t < b.at + b.dur - 1e-9);
    const out = track.base.filter((e) => !inBox(e.t));
    const cues = (track.baseCues || []).filter((c) => !inBox(c.t));
    const texts = (track.baseTexts || []).filter((x) => !inBox(x.t));
    // 切れ目も選んだ枝のものを使う。刻みの違う選択肢では、切ってよい場所も変わる
    const bars = (track.baseBars || []).filter((b) => !inBox(b));
    for (const box of track.takes) {
      const want = picks[box.group];
      const opt = box.options.find((o) => o.name === want) || box.options[0];
      for (const e of opt.events) out.push({ ...e, t: e.t + box.at });
      // 選んでいない枝の合図は出ない。読む場所そのものが変わるため
      for (const c of opt.cues || []) cues.push({ ...c, t: c.t + box.at });
      for (const x of opt.texts || []) texts.push({ ...x, t: x.t + box.at });
      for (const b of opt.bars || []) bars.push(b + box.at);
    }
    out.sort((a, b) => a.t - b.t);
    cues.sort((a, b) => a.t - b.t);
    texts.sort((a, b) => a.t - b.t);
    bars.sort((a, b) => a - b);
    track.events = addEchoes(out, track.total);
    markRooms(track.events, track.loop ? track.loop.to : Infinity);
    track.cues = cues;
    track.texts = texts;
    track.bars = bars;
  }

  /**
   * 登録してある曲について、鳴らす前に分かることを返す。
   *
   * チャンネルの名前も、ラベルも、長さも、`defineBGM()` を通した時点で
   * 決まっている。鳴らしてからでないと読めないのは「いまどこか」だけ。
   *
   * ラベルの扱いは `bgmMarks()` と同じ。予約語(`START` `LOOP` `OUTRO`)も
   * 並ぶ。落としたいときだけ `{ hideSystem: true }` を渡す。
   *
   * @param {string} name `defineBGM()` で登録した名前
   * 選択肢(`#takes`)を書いた曲は `takes` に出る。グループごとに、選べる名前と
   * いま選んであるものが入る。画面はこれを見て押すところを並べられる。
   *
   * @param {{hideSystem?:boolean}} [opts] hideSystem = 予約語を落とすか(既定 false)
   * @returns {{ok:boolean, active:boolean, errors:object[], warnings:object[],
   *            tracks:{ch:number,name:string|null,role:string|null,
   *                    total:number,muted:boolean,
   *                    lanes:{name:string,label:string,muted:boolean}[]}[],
   *            marks:{name:string,t:number}[], meta:object,
   *            takes:{group:string,now:string,options:string[],
   *                   boxes:{ch:number,at:number,dur:number}[]}[],
   *            switches:{grid:number[],bars:number[]},
   *            cues:{name:string,arg:number,t:number,ch:number}[],
   *            loop:{from:number,to:number}|null,
   *            outro:number|null, ending:number|null, total:number}|null}
   *   登録が無ければ null
   */
  bgmInfo(name, opts = {}) {
    const def = this.bgmDefs.get(name);
    if (!def) return null;
    // 音声ファイルは MML ではないので、中を覗くところが無い
    if (!Array.isArray(def)) {
      return { ok: true, active: true, errors: [], warnings: [], audio: true,
        tracks: [], marks: [], meta: {}, takes: [], problems: [],
        loop: null, outro: null, ending: null, total: 0 };
    }
    const check = def.check || { ok: true, errors: [], warnings: [] };
    const marks = gatherMarks(def, opts.hideSystem === true);
    return {
      ok: check.ok,
      active: this.bgmActive(name),
      errors: check.errors,
      warnings: check.warnings,
      tracks: def.map((t, i) => ({
        ch: i, name: t.name ?? null, role: t.role ?? null,
        // 同時に何声使うか。1 なら書いたとおりの 1 本
        voices: t.voices ?? 1,
        // 和音を鳴らすか。画面はこれを見て、声の数を出すかどうかを決められる
        chords: t.chords === true,
        // 中の層。開いて 1 つずつ止められる(`muteLane`)。
        // `name` は MML に書いた字、`label` は画面に出す呼び名
        lanes: (t.lanes ?? []).map((lane) => ({
          name: lane.name, label: lane.label, muted: this.isLaneMuted(i, lane.name),
        })),
        // 版と組(`#group`)と機械(`#machine`)。書いていなければ null。
        // いまどれが黙っているかは `bgmGroups()` が答える
        group: t.group ?? null, groupSet: t.groupSet ?? null,
        machine: t.machine ?? null,
        total: t.total, muted: this._chMute.has(i),
      })),
      marks,
      takes: takesInfo(def),
      // 切れ目。出どころで分けてある。画面はこれを見て濃さを変えられる
      switches: switchParts(def),
      // 読めなかったところ。`{ level, text, ch }` の並び。
      // 読み方(mode)にかかわらず控えてあるので、画面から出せる
      problems: def.problems || [],
      // 曲に置いた合図。選んである選択肢のぶんだけ並ぶ
      cues: def.flatMap((t, i) => (t.cues || []).map((c) => ({ ...c, ch: i })))
        .sort((a, b) => a.t - b.t),
      // 曲に置いた字。どのチャンネルに書いても並ぶ。分けて出すか 1 か所に
      // まとめるかは、受けた側が決める
      texts: def.flatMap((t, i) => (t.texts || []).map((x) => ({ ...x, ch: i })))
        .sort((a, b) => a.t - b.t),
      // 曲ぜんぶの覚え書き。チャンネルごとの `name` と `role` は外してある
      // (あちらは tracks に入っている)。版と組の一覧はここへ入れる —
      // 曲ぜんぶの持ち物で、出てきた順に並ぶ
      meta: { ...songMeta(def), ...(groupsOf(def).length ? { groups: groupsOf(def) } : {}) },
      loop: def.map((t) => t.loop).find(Boolean) ?? null,
      // 後奏の始まる秒。`#label OUTRO` を書いた曲だけが持つ。
      // 押すところを出すかどうかを、画面がこれで決められる(2026-09-15)。
      // `ending` は前の名前。読む側が直るまで、同じ値を両方の名前で返す
      outro: def.map((t) => t.outro).find((v) => v != null) ?? null,
      ending: def.map((t) => t.outro).find((v) => v != null) ?? null,
      total: Math.max(...def.map((t) => t.total), 0),
    };
  }

  /**
   * その曲の版と組(`#group`)。いま何を選んでいて、どこが黙るか。
   *
   * 何も選んでいなければ曲の既定で答える(先に出てきた版で、組は全部 on)。
   * `machine` は、いま鳴っているチャンネルのうち先に出てきたものの `#machine`。
   * 覚えて言うだけで、音は変えない(釣り合いの表はこれから)。
   *
   * @param {string} name `defineBGM()` で登録した名前
   * @returns {{groups:{name:string,sets:string[]}[], group:string|null,
   *            sets:string[], silent:number[], machine:string|null}|null}
   *   MML の曲でなければ null
   */
  bgmGroups(name) {
    const def = this.bgmDefs.get(name);
    if (!Array.isArray(def)) return null;
    return { groups: groupsOf(def), ...groupPick(def, this._groupOf(name)) };
  }

  /** 選んである版と組。別の曲のぶんなら忘れる(既定で答える) */
  _groupOf(name) {
    return (this._group && this._group.song === name) ? this._group : {};
  }

  /**
   * 版を選び、その中の組を on / off する。
   *
   * 鳴らしたまま差し替える。止めて鳴らし直すと聞き比べられない。
   * 黙らせ方は音量 0 なので、後ろが詰まらない。
   *
   * 版を替えると、その版の組は全部 on に戻る。前の版の組の名前は、
   * 新しい版では別のものを指すため。
   *
   * @param {string} name `defineBGM()` で登録した名前
   * @param {{group?:string|null, sets?:string[]|null}} [pick]
   *   group = 選ぶ版。sets = on にする組。渡さなかったほうは今のまま
   * @returns {object|null} `bgmGroups()` と同じ形
   */
  selectGroups(name, pick = {}) {
    const def = this.bgmDefs.get(name);
    if (!Array.isArray(def)) return null;
    const now = this._groupOf(name);
    // 版が変わったときは組を選び直す。前の版の組の名前は別のものを指す
    const group = pick.group !== undefined ? pick.group : (now.group ?? null);
    const same = String(group) === String(now.group ?? '');
    const sets = pick.sets !== undefined ? pick.sets : (same ? (now.sets ?? null) : null);
    const got = groupPick(def, { group, sets });
    this._group = { song: name, group: got.group, sets: got.sets };
    const st = this.bgmState;
    if (st && st.name === name && st.chGains) {
      st.groupOff = new Set(got.silent);
      for (let i = 0; i < st.chGains.length; i++) {
        st.chGains[i].gain.value = this._chVol(st, i);
      }
    }
    return { groups: groupsOf(def), ...got };
  }

  /**
   * そのチャンネルの音量つまみ。黙っていれば 0、そうでなければ音量の倍率
   * (`setTrackVolume()`。決めていなければ 1)。
   *
   * 自分で黙らせたものと、版と組で黙るものの両方を見る。どちらも音量 0 で、
   * 音符は消さない。押した内容と版の選び方は別に持つので、版を切り替えて
   * 戻れば、押していたものは押したまま。
   */
  _chVol(state, ch) {
    if (this._chMute.has(ch)) return 0;
    if (state && state.groupOff && state.groupOff.has(ch)) return 0;
    return this.trackVolume(ch);
  }

  /**
   * その名前が鳴らせるか。
   *
   * 登録してあって、読めないところが無ければ鳴らせる。読めない MML を
   * 渡した曲は登録は残るが鳴らせない。画面の側は、これを見て押せるかどうかを
   * 決められる(2026-09-15)。
   *
   * @param {string} name `defineBGM()` で登録した名前
   * @returns {boolean} 登録してあって、鳴らせるなら true
   */
  bgmActive(name) {
    const def = this.bgmDefs.get(name);
    if (!def) return false;
    if (!Array.isArray(def)) return true;
    return !def.check || def.check.ok;
  }

  /** 音声ファイルを読み込んでデコードする(結果はキャッシュ) */
  async _loadAudio(def) {
    if (def.buffer) return def.buffer;
    if (!def._loading) {
      def._loading = fetch(def.url)
        .then(r => r.arrayBuffer())
        .then(b => new Promise((res, rej) => this.ctx.decodeAudioData(b, res, rej)))
        .then(buf => { def.buffer = buf; return buf; });
    }
    return def._loading;
  }

  /** 音声ファイルの BGM を鳴らす */
  _playAudioBGM(def, loop, state) {
    this._loadAudio(def).then((buffer) => {
      if (this.bgmState !== state) return;   // 途中で別の曲に変わった
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = loop;
      src.connect(state.gain);
      src.start(this.ctx.currentTime + 0.02);
      state.nodes.push(src);
    }).catch(() => { /* 読めなければ無音 */ });
  }

  /**
   * SE を登録する。書式は BGM と同じで、鳴らすのは `playSE()`。
   *
   * `base` を付けると鳴らし分けられる SEになる。本体を 1 つ書いておいて、
   * 鳴らすときに音名と長さを渡すと、その高さへ移して頭からそのぶんだけ鳴らす
   * (詳しくは se.js)。
   *
   *   audio.defineSE('zap', '@{pulse(12)} v13 o5 c1', { base: 'c1' });
   *   audio.playSE('zap', 0, { note: 'c4b4e4', vol: 12 });
   *
   * @param {string} name 鳴らすときに使う名前。同じ名前で呼べば上書きになる
   * @param {string|string[]} mml MML。配列にすると 1 本が 1 チャンネル
   *   (和音や重ねはこれで書く)。書き方は docs/MML.md
   * @param {{beep?:boolean, base?:string|boolean}} [opts]
   *   beep = 1 ビットへ潰して鳴らす(8 ビット機のスピーカー)。
   *   `~` の掃引や `=` のロード音は、これを付けたときだけ効く。
   *   base = 本体を書いた高さと長さ。`'c1'`(= `true`)なら c の高さの全音符ぶん。
   *   付けると全音符が 64 フレームに固定されるので、`l64` が 1 フレームになる。
   *   このとき MML の `t` は書かない(書いても効くが、フレームとの対応が崩れる)
   */
  defineSE(name, mml, opts = {}) {
    const base = opts.base == null ? null : parseSEBase(opts.base);
    // テンポを先に置く。あとから上書きされるほうが、書いた本人の意図に近い
    const head = base ? `t${SE_TEMPO} ` : '';
    const tracks = (Array.isArray(mml) ? mml : [mml]).map((t, i) => {
      const track = compileTrack(head + t);
      track.ch = i;
      if (opts.beep) markBeep(track);
      return track;
    });
    // 本数と一緒に持ちたいだけなので、配列に付けておく(seDefs の形は変えない)
    tracks.base = base;
    this.seDefs.set(name, tracks);
    // 頭に足したテンポごと見る。鳴らすのと同じものを確かめないと意味が無い
    return sayErrors(`SE "${name}"`,
      validateMML((Array.isArray(mml) ? mml : [mml]).map((t) => head + t)));
  }


  /**
   * BGM を再生する(別の曲が鳴っていれば止まる)。
   * 同じ曲がすでに鳴っている場合は何もしない(頭出しし直さない)。
   *
   * @param {string} name `defineBGM()` で登録した名前
   * @param {{loop?:boolean, restart?:boolean}} [opts]
   *   loop = 曲ぜんぶを鳴らし終えたあと、また頭から鳴らすか(既定 true)。
   *   restart = 同じ曲でも頭から鳴らし直すか(既定 false)
   * @returns {boolean} 鳴らしたか。`false` はその名前が登録されていないとき
   *   (`playSE()` が `0` を返すのと同じ位置づけ)
   */
  startBGM(name, opts = {}) {
    const loop = opts.loop !== false;
    const restart = opts.restart === true;
    this._mutesOf(name);
    const tracks = this.bgmDefs.get(name);
    if (!tracks || !this.ctx) return false;
    // 読めないところがある曲は鳴らさない。途中まで鳴って止まるより、
    // 鳴らないほうが気づける(2026-09-15)
    if (!this.bgmActive(name)) {
      console.warn(`[ChpTnSnd] BGM "${name}": 直すところがあるので鳴らしません`);
      return false;
    }
    // 同じ曲がすでに鳴っているときは、頭から鳴らし直さない。
    // 最初から鳴らしたいときは restart に true を渡す。
    // フェード中の曲は鳴らし直す(音量が下がったまま復帰してしまうのを防ぐ)
    // すでに鳴っているので、鳴っているには違いない
    if (!restart && this.bgmState && this.bgmState.name === name && !this.bgmState.fading) {
      return true;
    }
    // 焼く音色がまだ焼けていなければ、焼いてから始める。待たずに始めると、
    // 焼き上がるまで元の音色で鳴る(フレーズを焼く ADPCM なら黙る)。焼くのは一瞬なので待つ
    const needs = Array.isArray(tracks) ? this._bakeNeeds(tracks) : [];
    if (needs.length) {
      this._bakeAll(needs).then(() => this.startBGM(name, { ...opts, restart: true }));
      return true;
    }
    // 切れ目まで待ってからつなぐ。変なところで替わると音楽が壊れる。
    // 切れ目を書いていない曲では待たないので、いままでと同じ動きになる
    // (docs/DYNAMIC.md「曲を替える」)。急ぐときは `{ now: true }`
    this._waitSwitch = null;
    if (this._switchTimer) { clearTimeout(this._switchTimer); this._switchTimer = 0; }
    const cur = this.bgmState;
    if (opts.now !== true && cur && cur.name && cur.name !== name && !cur.paused) {
      const wait = this._waitFor(cur.name, this.bgmPosition());
      if (wait > 0.01) {
        this._waitSwitch = { name, at: this.ctx.currentTime + wait };
        this._switchTimer = setTimeout(() => {
          this._switchTimer = 0;
          this._waitSwitch = null;
          this.startBGM(name, { ...opts, now: true });
        }, wait * 1000);
        return true;
      }
    }
    this.stopBGM();
    const gain = this.ctx.createGain();
    gain.gain.value = 1;
    gain.connect(this._bgmOut());
    const state = { gain, timer: 0, nodes: [], name, baseGain: 1 };
    this.bgmState = state;

    /**
     * ジングルの最中に曲が変わったら、新しい曲は黙ったまま始める。
     *
     * playJingle は鳴っている BGM を `_muteBGM(true)` で黙らせるが、
     * 黙らせたのはそのときの曲であって、あとから始まった曲は素通しになる。
     * ジングルは短いので、全開で始まった曲にまるごと踏み潰されて聞こえない。
     *
     * 実際にそうなっていた: モアイを内側から倒すとボーナスのファンファーレが
     * 鳴るが、同じころモアイの曲が道中の曲へ戻るため、次のコマで全開の
     * 道中曲が始まってファンファーレが消えていた。
     *
     * 黙って始めておけば、stopJingle の `_muteBGM(false)` が拾って戻す
     */
    const hushForJingle = () => { if (this.jingleState) gain.gain.value = 0.0001; };

    // 音声ファイル(mp3 など)の場合
    if (!Array.isArray(tracks)) {
      gain.gain.value = tracks.gain ?? 1;
      state.baseGain = gain.gain.value;
      hushForJingle();
      this.bgmVoices = 1;
      this._playAudioBGM(tracks, loop, state);
      return true;
    }
    hushForJingle();
    this.bgmVoices = tracks.length;
    // 曲が名乗る全体のエフェクト(`#fx`)。節をつなぎ直すので、音を積む前に
    this._applySongFx(tracks);
    // 版と組で黙るチャンネル。選んでいなければ曲の既定(先に出てきた版)
    state.groupOff = new Set(this.bgmGroups(name)?.silent ?? []);
    this._pump(tracks, loop, state, gain, () => this.bgmState === state);
    return true;
  }

  /**
   * MML の音符を「少し先の分だけ」こまめに積んでいく(先読みスケジューリング)。
   * 1 ループぶんをまとめて予約すると、その瞬間に何百個もノードを作ることになり、
   * 非力な端末ではひとコマぶんの引っかかりになるため。
   * BGM とジングルの両方から使う。alive() が false を返したら積むのをやめる。
   */
  _pump(tracks, loop, state, gain, alive) {
    const loopLen = Math.max(...tracks.map(t => t.total), 0.01);
    // `#label REPEAT` が置いた戻り先。どれか 1 本にあれば曲ぜんぶがそこへ戻る
    // (声ごとに違うところへ戻ると、鳴らすたびに合わせ方が変わってしまう)。
    // MML に書いてあるなら、鳴らす側が繰り返さないと言っても繰り返す —
    // 曲の作りとして書いてあるものなので
    const mark = tracks.map((t) => t.loop).find(Boolean) || null;
    // 終わりは、いちばん長いチャンネルの終わり。戻り先は点なので、
    // どこで折り返すかを書く必要が無い。前は囲みの閉じ側で決めていて、
    // 短い 1 本に引きずられて長いチャンネルの後ろが鳴らなかった(2026-09-15)
    // 後奏(`#label OUTRO`)。書いてあれば、そこが 1 周の終わり。
    // 書いていなければ曲の終わりまでが 1 周で、いままでと同じ
    const endAt = tracks.map((t) => t.outro).find((v) => v != null) ?? null;
    const loopTo = endAt != null ? Math.min(endAt, loopLen) : loopLen;
    const loopBack = mark ? mark.from : 0;
    // 食い違っていたら知らせる。黙って最初の 1 本に合わせると、
    // 書いたほうは「なぜそこへ戻るのか」を鳴らしながら探すことになる(2026-09-15)
    if (mark) {
      tracks.forEach((t, i) => {
        if (t.loop && Math.abs(t.loop.from - mark.from) >= 0.001) {
          console.warn(`[ChpTnSnd] MML: ${i + 1} 本目の REPEAT はほかと違うところにあります `
            + `(${t.loop.from.toFixed(2)} 秒)。`
            + `最初に見つけた ${mark.from.toFixed(2)} 秒に合わせます`);
        }
      });
    }
    // 曲が `#looptimes` を書いていれば、それを既定として入れる。
    // 聴く側が数を触ったあとは動かさない — 前に入れた数のままのときだけ
    // 書き換える。押した内容が曲を変えるたびに消えると、押し直しになる
    const want = tracks.map((t) => t.loop && t.loop.times).find((v) => v > 0) ?? null;
    if (want && this.loopTimes === this._loopTimesFromSong) this.loopTimes = want;
    if (want) this._loopTimesFromSong = want;
    // 曲が名乗る大きさ(`#gain`)。聴く人のつまみとは掛け算になるので、
    // `#looptimes` と違って「触ったかどうか」を見る必要がない。
    // 曲を替えたらその曲の値になる
    this._songGain = songGain(tracks);
    if (this._master) {
      const t0 = this.ctx.currentTime;
      this._master.gain.cancelScheduledValues(t0);
      this._master.gain.setValueAtTime(this._master.gain.value, t0);
      this._master.gain.linearRampToValueAtTime(this._outGain(), t0 + 0.05);
    }
    // `[ … ]*` が書いてあれば、鳴らす側が何と言おうとくり返す。
    // 書いていない曲でも、鳴らす側がくり返すと言えば頭から繰り返す
    const wants = loop || !!mark;
    // チャンネルごとの音量。ここを 0 にすると、その 1 本だけ黙る。
    // 音符を積む先を分けておかないと、あとから 1 本だけ止められない
    // 黙らせてあったものは、曲をまたいでも黙ったまま。押した内容は
    // このインスタンスが持っている(`_chMute`)ので、積み直しても消えない
    state.chFilters = [];
    state.chGains = tracks.map((t, i) => {
      const g = this.ctx.createGain();
      // 版と組で黙るものも、ここで 0 にする(`state.groupOff`)
      g.gain.value = this._chVol(state, i);
      // `@f` を書いたチャンネルは、出口にエフェクトを挟む。
      // 音符ごとではなくここに置くので、重ねた音も和音も同じ並びを通る
      const f = this._chFx(t);
      state.chFilters[i] = f;
      if (f) { g.connect(f.head); f.tail.connect(gain); } else { g.connect(gain); }
      return g;
    });
    state.muted = tracks.map((t, i) => this._chMute.has(i));
    state.tracks = tracks;
    const LOOKAHEAD = 0.5;   // 何秒先まで積んでおくか
    const TICK_MS = 120;     // 積み足す間隔
    state.base = this.ctx.currentTime + 0.05;   // いまのループの開始時刻
    state.cursor = 0;                           // 曲の中のどこまで積んだか
    state.length = loopLen;                     // 曲ぜんぶの長さ(秒)
    state.lapEnd = loopTo;                      // 1 周の終わり(後奏の手前)
    state.endAt = endAt;
    state.inEnding = false;                     // 後奏に入ったか
    state.laps = 0;                             // 本編を何周したか
    state.range = this._range;                  // AB リピートの範囲(無ければ null)
    // 見せる時計。積むほうは 0.5 秒先を走っているので、折り返したときに
    // `base` を動かすと、耳に届く前に時計だけ戻る。AB リピートのように
    // 範囲が短いと目に見える。折り返しを予約しておいて、その時刻が来てから
    // 時計に移す(2026-09-15)
    state.showBase = state.base;
    state.wraps = [];
    state.cueTimers = [];   // 予約してある合図。止めるときに捨てる

    /**
     * 折り返す。`base` は積むほうの時計なのですぐ動かすが、見せる時計は
     * 耳に届く時刻(`at`)が来てから動かす
     */
    const wrapAt = (at, delta) => {
      state.base += delta;
      state.wraps.push({ at, base: state.base });
    };

    const pump = () => {
      if (!alive()) return;
      const now = this.ctx.currentTime;
      // 終わったノードを掃除
      state.nodes = state.nodes.filter(n => n.__endTime > now);
      // いま鳴っているところから LOOKAHEAD 秒先まで積む
      let guard = 0;
      while (state.base + state.cursor < now + LOOKAHEAD && guard++ < 8) {
        // AB リピートが効いているあいだは、そちらが勝つ。曲の作り(くり返しや
        // 後奏)より、聴いている人がいま選んだ範囲のほうが強い。
        // 範囲の後ろへ跳んだときは効かない — B をまたぐときだけ戻す
        const ab = (state.range && state.cursor < state.range.to) ? state.range : null;
        // 後奏に入っていれば曲の終わりまで、そうでなければ 1 周の終わりまで
        const limit = ab ? ab.to : (state.inEnding ? loopLen : loopTo);
        const to = Math.min(limit, state.cursor + LOOKAHEAD);
        for (let i = 0; i < tracks.length; i++) {
          this._scheduleTrack(tracks[i], state.base, state.chGains[i], state.nodes,
                              state.cursor, to, state.laps > 0 && !state.inEnding);
          this._scheduleCues(tracks[i], i, state, state.cursor, to);
          this._scheduleFilters(tracks[i], i, state, state.cursor, to);
          this._scheduleTexts(tracks[i], i, state, state.cursor, to);
        }
        this._wkFlushAll(state.nodes);    // 積んだぶんを常駐の処理器へ
        state.cursor = to;
        if (state.cursor < limit) continue;
        if (ab) {
          // B まで積んだ。A へ戻す。周は数えない(曲の作りではないので)
          wrapAt(state.base + ab.to, ab.to - ab.from);
          state.cursor = ab.from;
          continue;
        }
        // 最後まで積んだ。鳴り終わったところで片づける。
        // 前は積むのをやめるだけだったので、曲が終わっても
        // 鳴っている状態のまま残り、押し直しても始まらなかった
        const quit = () => {
          const end = state.base + state.cursor;
          state.timer = setTimeout(() => {
            if (alive()) this.stopBGM();
          }, Math.max(0, (end - this.ctx.currentTime) * 1000) + 60);
        };
        // 曲ぜんぶを鳴らし終えたあと、また頭から鳴らすか。聴く側の言い分は
        // ここで毎回見る。鳴っている最中に切り替えても効くようにするため
        const replay = wants && !this.ignoreSongLoop;
        if (state.inEnding) {
          // 後奏を鳴らし終えた。頭から鳴らし直すなら前奏も鳴る
          if (!replay) { quit(); return; }
          wrapAt(state.base + loopLen, loopLen);
          state.cursor = 0;
          state.laps = 0;
          state.inEnding = false;
          continue;
        }
        // 1 周ぶん鳴らし終えた。あと何周するかは `loopTimes` だけが決める。
        // 数えているのはこちらなので、外からは「ぜんぶで何周か」を渡せる。
        //
        // ここに `replay` を掛けてはいけない。あれは曲ぜんぶを鳴らし終えた
        // あとの話(Repeat all)で、本編を何周するかとは別のもの。
        // 掛けていたときは、Repeat all を消すと回数を見ないまま 1 周で
        // 終わっていた(2026-09-24)
        state.laps++;
        // 本編がある曲だけが周回する。`LOOP` も `OUTRO` も書いていない曲は、
        // 繰り返す本編そのものが無いので 1 回で終わる。頭からもう一度鳴らすか
        // どうかは、そのあとの `replay`(Repeat all)の話(2026-09-24)
        const laps = !!mark || endAt != null;
        const more = laps && !state.leaving && state.laps < this.loopTimes;
        if (!more) {
          // 抜ける。後奏があればそこを通る。いまの周は鳴らし終えているので、
          // いきなり切れることはない。通るかどうかは聴く側が決められる
          if (state.endAt != null && this.playOutro) {
            state.inEnding = true;
            // 抜ける指示は、後奏へ入った時点で下ろす。立てたままだと、
            // 頭へ戻ったあとも毎周すぐ抜けることになる(2026-09-15)
            state.leaving = false;
            continue;
          }
          if (!replay) { quit(); return; }
          // 後奏が無い曲は、そのまま頭から鳴らし直す
          wrapAt(state.base + loopTo, loopTo);
          state.cursor = 0;
          state.laps = 0;
          continue;
        }
        // 戻る先ぶんだけ時計を進めてから戻る。こうすると
        // 戻った先の時刻が、戻る手前の時刻とぴったり続く
        wrapAt(state.base + loopTo, loopTo - loopBack);
        state.cursor = loopBack;
      }
      state.timer = setTimeout(pump, TICK_MS);
    };
    // ポーズから戻すときにも、同じ手で積み直す
    state.pump = pump;
    pump();
  }

  /**
   * BGM を止めずに、その場で凍らせる(ゲームのポーズ用)。
   *
   * `stopBGM()` との違いは、続きから鳴らし直せること。
   * 止めてしまうと `playBGM()` で頭出しし直すことになり、
   * ポーズを抜けるたびにイントロから鳴ってしまう。
   *
   * 音声ファイルの BGM は途中の位置を持てないので、黙らせるだけにする
   * (裏で進み続けるので、戻したときに少し先へ飛ぶ)。
   */
  pauseBGM() {
    const s = this.bgmState;
    if (!s || !this.ctx || s.paused) return;
    s.paused = true;
    if (!s.pump) { this._muteBGM(true); return; }
    if (s.timer) { clearTimeout(s.timer); s.timer = 0; }
    // いまのループの頭から何秒進んだか。積んだ位置(cursor)ではなく
    // 鳴っている位置を覚える。cursor は先読みのぶんだけ先へ行っている
    const off = this.ctx.currentTime - s.base;
    s.offset = Math.max(0, Math.min(Math.max(0, s.length - 0.02), off));
    for (const n of s.nodes) { try { n.stop(0); } catch (e) { /* stopped */ } }
    // 常駐の処理器も黙らせる。時間が止まっているのに音が動くのはおかしい
    this._wkCut();
    s.nodes = [];
  }

  /** 凍らせた BGM を続きから鳴らし直す */
  resumeBGM() {
    const s = this.bgmState;
    if (!s || !this.ctx || !s.paused) return;
    s.paused = false;
    if (!s.pump) { this._muteBGM(false); return; }
    const off = s.offset || 0;
    // 止めたところが「いま」になるように、ループの開始時刻を過去へずらす
    s.base = this.ctx.currentTime + 0.05 - off;
    // 見せる時計も合わせる。`bgmPosition()` は `showBase` を先に見るので、
    // ここを置いていくと、止めていた秒数ぶん先へ飛ぶ。跳んだとき
    // (`seekBGM`)には書いてあったが、こちらだけ落ちていた(2026-10-05)。
    // 古い時計で取ってある折り返しも捨てる — 時刻が合わなくなっている
    s.showBase = s.base;
    s.wraps = [];
    s.cursor = off;
    s.offset = 0;
    s.pump();
  }

  /**
   * ジングル(ファンファーレなど)を鳴らす。
   * BGM は止めずに、鳴っているあいだだけ黙らせる。
   * 鳴り終わると BGM が続きから聞こえてくるので、
   * イントロの長い曲でも頭から鳴り直さない。
   * @param {string} name BGM として登録してある短い曲
   * @returns {number} 鳴っている長さ(秒)。0 なら鳴らせなかった
   */
  playJingle(name) {
    const tracks = this.bgmDefs.get(name);
    if (!tracks || !this.ctx) return 0;
    this.stopJingle();
    const gain = this.ctx.createGain();
    gain.gain.value = 1;
    gain.connect(this._bgmOut());
    const state = { gain, timer: 0, nodes: [], name };
    this.jingleState = state;
    this._muteBGM(true);

    let sec = 0;
    if (!Array.isArray(tracks)) {
      // 音声ファイルのジングル
      gain.gain.value = tracks.gain ?? 1;
      this._playAudioBGM(tracks, false, state);
      sec = tracks.duration || 3;
    } else {
      this._pump(tracks, false, state, gain, () => this.jingleState === state);
      sec = state.length;
    }
    // 鳴り終わったら BGM を戻す
    state.endTimer = setTimeout(() => {
      if (this.jingleState === state) this.stopJingle();
    }, sec * 1000 + 120);
    return sec;
  }

  /** ジングルを止めて、BGM の音を戻す */
  stopJingle() {
    const s = this.jingleState;
    if (!s) return;
    this.jingleState = null;
    clearTimeout(s.timer);
    clearTimeout(s.endTimer);
    for (const n of s.nodes) { try { n.stop(0); } catch (e) { /* stopped */ } }
    try { s.gain.disconnect(); } catch (e) { /* already gone */ }
    this._muteBGM(false);
  }

  /** ジングルが鳴っているか */
  get jingling() { return !!this.jingleState; }

  /** BGM を黙らせる / 戻す(止めないので、曲は裏で進み続ける) */
  _muteBGM(on) {
    const s = this.bgmState;
    if (!s || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      s.gain.gain.cancelScheduledValues(t);
      // ぶつっと切れないよう、ごく短く上げ下げする
      s.gain.gain.setValueAtTime(s.gain.gain.value, t);
      s.gain.gain.linearRampToValueAtTime(on ? 0.0001 : (s.baseGain ?? 1), t + 0.05);
    } catch (e) { /* 環境によっては失敗するので無視 */ }
  }

  /**
   * BGM を少しずつ小さくして止める。
   * @param {number} [sec=1.5] フェードにかける秒数
   */
  fadeOutBGM(sec = 1.5) {
    const s = this.bgmState;
    if (!s || !this.ctx) return;
    const t = this.ctx.currentTime;
    s.fading = true;   // フェード中は「鳴っている」とみなさない
    try {
      s.gain.gain.cancelScheduledValues(t);
      s.gain.gain.setValueAtTime(s.gain.gain.value, t);
      s.gain.gain.linearRampToValueAtTime(0.0001, t + sec);
    } catch (e) { /* 環境によっては失敗するので無視 */ }
    // 鳴り終わったら本当に止める(別の曲に切り替わっていたら何もしない)
    setTimeout(() => { if (this.bgmState === s) this.stopBGM(); }, sec * 1000 + 50);
  }

  /**
   * BGM を再生する。古い呼び方。新しくは `startBGM(name, { … })` を使う。
   *
   * 引数が増えるたびに真偽値が並ぶ形になっていたので、名前を分けて
   * options を取るほうへ寄せた。こちらは当分そのまま動くが、呼ぶと 1 度だけ
   * 知らせが出る(2026-09-15)。
   *
   * @param {string} name `defineBGM()` で登録した名前
   * @param {boolean} [loop=true] 曲ぜんぶを鳴らし終えたあと、また頭から鳴らすか
   * @param {boolean} [restart=false] 同じ曲が鳴っていても、頭から鳴らし直すか
   * @returns {boolean} 鳴らしはじめたら true
   */
  playBGM(name, loop = true, restart = false) {
    oldWay('playBGM()', 'startBGM(name, { loop, restart }) を使います。');
    return this.startBGM(name, { loop, restart });
  }

  /**
   * BGM を鳴らさずに、書き出し用の音として計算する(WAV や動画の素材用)。
   *
   * `OfflineAudioContext` は音の出口を使わないので、
   * 画面を持たないブラウザ(ヘッドレス)でもそのまま動く。
   *
   * きもは、鳴らすときと同じ `_scheduleTrack` を通すこと。
   * 書き出し用のレンダラーをもう 1 つ書くと、エンベロープの端やエコーの重なりで
   * 少しずつずれていき、しかも「書き出したときだけ変」という
   * 一番気づきにくい形で出る。以前 game/wavexport.js がそれで消えている。
   *
   * チャンネルごとの出口の分け方も揃える。常駐の処理器は出口ごとに 1 つ作られるので、
   * 出口をまとめると全チャンネルが 1 つの処理器の声を取り合い、足りないぶんが消える。
   * 書き出しだけ出口を共有していて、アナログ音源の音が消えていた(2026-10-15)。
   *
   * 先読み(`_pump`)は通さない。あれは非力な端末で引っかからないための刻みで、
   * 計算するだけの書き出しには要らない。まるごと一度に積む。
   *
   * @param {string} name `defineBGM()` で登録した名前(音声ファイルの BGM は不可)
   * @param {{loops?:number, intro?:boolean, outro?:boolean, mute?:number[],
   *          tail?:number, sampleRate?:number, channels?:number,
   *          masterFx?:boolean}} [opts]
   *   loops = 本編を何周ぶん並べるか。書かなければ曲の `#looptimes`、
   *   それも無ければ 2(鳴らすときの `loopTimes` と揃えてある)。
   *   intro = 前奏(`REPEAT` より手前)を入れるか(既定 true)。
   *   outro = 後奏(`OUTRO` より後ろ)を入れるか(既定 true。前の名前 `ending` も効く)。
   *   鳴らすときの `loopTimes` は見ない。あちらは `Infinity` を取れるので、
   *   何周ぶん焼くかは書き出す側が決める。
   *   group = 焼く版(`#group` の 1 つめの語)。省くと、選んである版か曲の既定。
   *   `'ALL'` を渡すと版ごとに 1 本ずつ焼いて、順につなげる(下記)。
   *   組(2 つめの語)は受け取らない。焼くときはいつも全部 on —
   *   組は鳴らして耳で比べるためのもので、一部だけ抜いて焼く用事が無い。
   *   gap = `'ALL'` のときに版のあいだへ入れる無音(秒。既定 0.5)。
   *   mute = 黙らせるチャンネルの番号。省くと、いま黙らせてあるものに従う。
   *   `[]` を渡せば全部鳴る。画面で作った音がそのまま落ちるようにするため
   *   (2026-09-15)。
   *   tail = 最後の音の余韻とエコーを入れる後ろの余白(秒。既定 0.5)。
   *   sampleRate = 既定 44100。channels = 既定 1。
   *   定位は channels に合わせる — 1 なら位置を無視(いままでと同じ出力)、
   *   2 なら左右に振る。`spatial` で明かに指定してもよいが、
   *   `'hrtf'` はブラウザごとに出力が変わるので焼くのには向かない。
   *   seed = ノイズの種(既定 1)。同じ種なら何度焼いても同じファイルになる。
   *   別のノイズが欲しいときだけ変える。
   *   onProgress = 進み具合(0〜1)を受け取る。長い曲で待たせるときに使う。
   *   stop = やめるかどうかを返すもの。`true` を返した時点で計算を止める。
   *   masterFx = 曲ぜんぶに掛かる段(`#fx` `#master` `setMasterEffects`)を掛けるか
   *   (既定 true)。`false` にすると外して焼く。チャンネルごとに焼いたものを、
   *   本格的なソフトで混ぜて仕上げるときに使う。あちらで掛けるものなので、
   *   こちらで掛けると二重になる。チャンネルの `@f` と音色の中のものは外さない
   * @returns {Promise<AudioBuffer|null>} 途中でやめたときは null
   */
  async renderBGM(name, opts = {}) {
    const def = this.bgmDefs.get(name);
    if (!def) throw new Error(`[ChpTnSnd] BGM "${name}" は登録されていません`);
    if (!Array.isArray(def)) {
      throw new Error(`[ChpTnSnd] BGM "${name}" は音声ファイルなので書き出せません`
        + '(MML の曲だけが対象です)');
    }
    const OAC = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
    if (!OAC) {
      throw new Error('[ChpTnSnd] OfflineAudioContext がありません'
        + '(書き出しにはブラウザが要ります。画面は無くてかまいません)');
    }
    // `ALL` は版を全部つなげて焼く。版は排他なので、同時には鳴らさない
    if (String(opts.group ?? '') === 'ALL') return this._renderChain(name, opts);

    // 全体にエコーやリバーブを掛けていれば、響きが消えるまで待つ
    const tail = Math.max(0, opts.tail ?? Math.max(0.5, fxTail([...(songFx(def) || []), ...this._fxFor(def)])));
    const rate = opts.sampleRate ?? 44100;
    const channels = opts.channels ?? 1;
    // 前奏・本編・後奏に切って並べ直す。鳴らすときと同じ区切りで焼かないと、
    // 聞いたものと書き出したものが別のものになる(2026-09-15)。
    // 切り方そのものは `songParts()` が持つ — 動画の側も同じものを呼ぶので、
    // ここに書き写すと片方だけ直したときにずれる(2026-09-24)
    const cut = songParts(def, {
      loops: opts.loops,
      intro: opts.intro,
      // `ending` は前の名前。どちらで書いても効く
      outro: opts.outro ?? opts.ending,
    });
    const parts = cut.parts.map((p) => [p.from, p.to]);
    const frames = Math.ceil((cut.span + tail) * rate);
    // 黙らせてあるチャンネルは書き出しでも黙る。聞いたものと落ちたものが
    // 違うと、どちらが本当か分からなくなる
    const off = new Set(opts.mute ?? this.mutedTracks());
    // 版で黙るチャンネルも落とす。その版のチャンネルと、どの版にも
    // 属さないチャンネルだけが残る。組は全部 on
    for (const i of groupPick(def, {
      group: opts.group !== undefined ? opts.group : (this._groupOf(name).group ?? null),
    }).silent) off.add(i);
    const ctx = new OAC(channels, frames, rate);

    // 鳴らすときの道具を一時的に借りる。
    // PeriodicWave は作った context に紐づくので、キャッシュを持ち越すと
    // 別の context で使えずに落ちる。出口も作り直させる
    const saved = {
      ctx: this.ctx, bus: this._bus, master: this._master, noise: this.noiseBuffer,
      fxNodes: this._fxNodes, fxHead: this._fxHead, fxLoud: this._fxLoud,
      fxLive: this._fxLive, post: this._post,
      waveCache: this._waveCache, pulseCache: this._pulseCache, modCache: this._modCache,
      wk: this._wk, wkReady: this._wkReady,
      keepSec: this._keepSec, muted: this._muted, spatial: this.spatial,
      songGain: this._songGain, songFx: this._songFx, fx: this._fx,
      regLog: this._regLog, opllFixed: this._opllFixed,
    };
    try {
      this.ctx = ctx;
      this._bus = null;
      this._master = null;
      this._fxNodes = [];
      this._fxHead = null;
      this._post = null;
      this._waveCache = null;
      this._pulseCache = null;
      this._modCache = null;
      // 常駐の処理器は context に紐づく。節も読み込みもやり直す
      this._wk = null;
      this._wkReady = null;
      // 焼くときの定位は channels が決める。書き出しでは指定を素直に受けたい
      this.spatial = opts.spatial ?? (channels >= 2 ? 'stereo' : 'mono');
      this._keepSec = 0;      // 溜める仕掛け(AudioWorklet)は書き出しに要らない
      this._muted = false;    // 音を切って遊んでいても、書き出したものは鳴る
      // 曲が名乗る大きさは書き出しにも掛ける。掛けないと
      // 「ページでは聞こえるのに WAV は小さい」になる(→ docs/LOUDNESS.md)
      this._songGain = songGain(def);
      // 曲が名乗る全体のエフェクト(`#fx`)。鳴らすときと同じものを焼く。
      //
      // `masterFx: false` を渡すと、全体に掛かる段を全部外して焼く。
      // チャンネルごとに焼いたものを、本格的なソフトで混ぜて仕上げるときに要る。
      // あちらで掛けるものなので、こちらで掛けると二重になる。
      // 外すのは `#fx` と `#master` と `setMasterEffects` の 3 つで、
      // チャンネルの `@f` と音色の中のものは外さない(あれはチャンネルの持ち物で、
      // 1 本だけ焼いてもそのまま付いてくる)。
      //
      // 線形の段(フィルタ・エコー・リバーブ)だけなら、外さずに焼いても
      // 足し合わせると曲に戻る(測った。ずれ 0)。戻らないのは音の大きさで
      // 効き方が変わる段で、`limiter` `saturate` `compressor` `crush`
      // `wavestep` などがそれ。1 本ずつは小さいので、ほとんど何もされない
      // (2026-10-23)
      // 戻すのは `saved` が持っている(`fx` と `songFx` の両方)
      if (opts.masterFx === false) this._fx = [];
      this._applySongFx(opts.masterFx === false ? [] : def);
      // `regs` を渡されたら、処理器にレジスタの書き込みを記録させる
      this._regLog = typeof opts.regs === 'function';
      // `opllFixed` は OPLL を 1 チャンネルに固定して焼く。実機の鳴らし方と
      // 聞き比べるための試験用で、1 パートだけの曲にしか使えない
      this._opllFixed = !!opts.opllFixed;
      // ノイズは context ごとに要る。種から作るので、同じ種なら
      // 何度焼いても 1 ビットまで同じものが出る(鳴らすほうは unlock() が
      // その場で作るまま。聴くだけなら毎回違ってかまわない)
      const rand = seededRandom(opts.seed ?? 1);
      this.noiseBuffer = ctx.createBuffer(1, rate, rate);
      const d = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < rate; i++) d[i] = rand() * 2 - 1;

      // 焼く音色は、先に焼いておく。焼けていないと元の音色で鳴る(ADPCM なら
      // ADPCM にならず、フレーズを焼くものは黙る)ので、書き出したものが変わってしまう
      await this._bakeAll(this._bakeNeeds(def));
      // 要る処理器だけ読み込む。context が変わっているので読み込み直し
      for (const kind of this._wkKinds(def)) await this._wkLoad(kind);
      // 全体のエフェクトが使う処理器も読む。出口(`_out`)が作るときに要る
      for (const kind of this._fxKinds()) await this._wkLoad(kind);
      const dest = this._out();
      const nodes = [];
      let at = 0;
      // チャンネルごとの出口。鳴らすときの `state.chGains` と同じく、
      // 倍率が 1 でもチャンネルごとに 1 つ作る。常駐の処理器は出口ごとに
      // 1 つなので、出口を共有すると全チャンネルが 1 つの処理器の声を取り合い、
      // 足りないぶんの音が消える。鳴らすときは起きないので、聞いたものと
      // 書き出したものが違ってしまう(2026-10-15、アナログ音源で見つかった)
      // `@f` を書いたチャンネルは、出口にフィルタを 1 台挟む。
      // 鳴らすときと同じ場所に置く(そこを変えると、焼いた音とページの音がずれる)
      const filts = [];
      const outs = def.map((t, i) => {
        const v = this.trackVolume(i);
        const f = this._chFx(t);
        if (f) filts[i] = f;
        const g = ctx.createGain();
        g.gain.value = v;
        if (f) { g.connect(f.head); f.tail.connect(dest); } else { g.connect(dest); }
        return g;
      });
      parts.forEach(([a, b], k) => {
        // 本編の 2 周目から先。鳴らすときと同じく、フェードで下げた音量を持ち越す
        const again = k > cut.lapAt && k < cut.lapAt + cut.loops;
        // その区間の頭が `at` に来るようにずらして積む
        def.forEach((t, i) => {
          if (off.has(i)) return;
          this._scheduleTrack(t, at - a, outs[i], nodes, a, b, again);
          // フィルタの書き替えも同じずらし方で積む。`state` は無いので、
          // 時刻の起点だけを渡す形で呼ぶ
          if (filts[i]) {
            this._scheduleFilters(t, i, { base: at - a, chFilters: filts }, a, b);
          }
        });
        at += b - a;
      });
      this._wkFlushAll(nodes);          // 積み終わってから渡す

      // ---- 進み具合と、途中でやめる道 ----
      //
      // 書き出しは音の出口を使わないぶん速いが、長い曲では待たされる。
      // 待っているあいだ何も出ないと、止まったように見える。
      // `OfflineAudioContext` は途中で止められる(`suspend`)ので、
      // そこで進み具合を知らせ、やめると言われていれば戻さない。
      // 戻さなければ、そこから先は計算されない(2026-09-16)
      const secs = frames / rate;
      let quit = false;
      const stopped = new Promise((done) => {
        if (!opts.onProgress && !opts.stop) return;
        const span = Math.max(0.25, secs / 60);
        // 止める時刻は 128 サンプルの区切りに合わせる。合っていないと
        // その約束は断られる。次の約束は、止まったところで 1 つずつ取る —
        // まとめて取ると、2 つ目から受け付けない作りのものがある(2026-09-16)
        const tick = (v) => Math.round(v * rate / 128) * 128 / rate;
        const next = (at) => {
          const t = tick(at);
          if (t <= 0 || t >= secs) return;
          ctx.suspend(t).then(() => {
            if (opts.stop && opts.stop()) { quit = true; done(null); return; }
            if (opts.onProgress) opts.onProgress(t / secs);
            next(t + span);
            ctx.resume();
          }).catch(() => { /* すでに終わっている */ });
        };
        next(span);
      });
      const buf = await Promise.race([ctx.startRendering(), stopped]);
      if (quit) return null;
      if (opts.onProgress) opts.onProgress(1);
      if (this._regLog) opts.regs(await this._collectRegs());
      return buf;
    } finally {
      this.ctx = saved.ctx;
      this._bus = saved.bus;
      this._master = saved.master;
      this._fxNodes = saved.fxNodes;
      this._fxHead = saved.fxHead;
      this._fxLoud = saved.fxLoud;
      this._fxLive = saved.fxLive;
      this._post = saved.post;
      this.noiseBuffer = saved.noise;
      this._waveCache = saved.waveCache;
      this._pulseCache = saved.pulseCache;
      this._modCache = saved.modCache;
      this._wk = saved.wk;
      this._wkReady = saved.wkReady;
      this._keepSec = saved.keepSec;
      this._muted = saved.muted;
      this._songGain = saved.songGain;
      this._songFx = saved.songFx;
      this._fx = saved.fx;
      this.spatial = saved.spatial;
      this._regLog = saved.regLog;
      this._opllFixed = saved.opllFixed;
    }
  }

  /**
   * 焼き終わったあとで、処理器が流してきたレジスタの記録を集める。
   *
   * 記録は処理器から `port` に積まれていて、受け口を開いた時点で順に届く。
   * 1 通ずつ別のタスクで届くので、増えなくなるまでタイマーを挟んで待つ。
   *
   * 返すのは処理器の種類ごとの、チップの並び
   * `{ opll: [{ id, type, regs: [時刻, レジスタ, 値, …] }, …], … }`。
   * チップは行き先(トラック)ごとに立ち、AY は 1 つの行き先が何個でも持つので、
   * チップごとに分けて返す。混ぜると、どのチップへの書き込みかが分からなくなる
   * (VGM へ出すときは、1 個ずつ別のチップとして書く)。
   * `id` は `行き先の番号.その中のチップの番号`、`type` は AY の音量の表
   * (0 = YM2149、1 = AY-3-8910。ほかのチップは 0)
   */
  async _collectRegs() {
    const out = {};
    if (this._wk) {
      for (const [kind, bank] of this._wk) {
        let n = 0;
        for (const node of bank.node.values()) {
          if (!node.port) continue;
          const at = n++;
          const list = out[kind] || (out[kind] = []);
          const chips = new Map();
          node.port.onmessage = (e) => {
            const r = e.data && e.data.regs;
            if (!r) return;
            const k = e.data.chip | 0;
            let c = chips.get(k);
            if (!c) {
              c = { id: `${at}.${k}`, type: e.data.type | 0, regs: [] };
              chips.set(k, c);
              list.push(c);
            }
            for (let i = 0; i < r.length; i++) c.regs.push(r[i]);
          };
        }
      }
    }
    let seen = -1;
    for (;;) {
      await new Promise((done) => setTimeout(done, 5));
      const n = Object.values(out).reduce((a, l) => a + l.reduce((b, c) => b + c.regs.length, 0), 0);
      if (n === seen) break;
      seen = n;
    }
    return out;
  }

  /**
   * 版を全部つなげて焼く(`renderBGM(name, { group: 'ALL' })`)。
   *
   * 曲の頭から終わりまでを版ごとに焼いて、出てきた順に並べる。
   * 聞き比べるのにいちばん速い形で、押し替えるより続けて聞けるほうが分かる。
   * あいだに無音を挟むのは、版の切れ目が耳で分かるようにするため。
   * 組はその版の既定(全部 on)。
   *
   * @param {string} name `defineBGM()` で登録した名前
   * @param {object} opts `renderBGM()` と同じもの。`gap` は版のあいだの無音(秒)
   * @returns {Promise<AudioBuffer|null>} 途中でやめたときは null
   */
  async _renderChain(name, opts = {}) {
    const def = this.bgmDefs.get(name);
    const list = groupsOf(def).map((g) => g.name);
    const gap = Math.max(0, opts.gap ?? 0.5);
    // 版が 1 つも無い曲、1 つだけの曲は、つなげるものが無いのでそのまま 1 本
    if (list.length < 2) {
      return this.renderBGM(name, { ...opts, group: list[0] ?? null });
    }
    const bufs = [];
    for (let i = 0; i < list.length; i++) {
      const buf = await this.renderBGM(name, { ...opts, group: list[i],
        onProgress: opts.onProgress
          ? (v) => opts.onProgress((i + v) / list.length) : undefined });
      if (!buf) return null;          // 途中でやめた
      bufs.push(buf);
    }
    const rate = bufs[0].sampleRate;
    const chs = bufs[0].numberOfChannels;
    const pad = Math.round(gap * rate);
    const frames = bufs.reduce((n, b) => n + b.length, 0) + pad * (bufs.length - 1);
    const OAC = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
    const out = new OAC(chs, frames, rate).createBuffer(chs, frames, rate);
    let at = 0;
    for (const b of bufs) {
      for (let c = 0; c < chs; c++) out.getChannelData(c).set(b.getChannelData(c), at);
      at += b.length + pad;
    }
    return out;
  }

  /**
   * いま曲のどこを鳴らしているか(秒)。
   *
   * 止めているあいだは止めた位置を返す。くり返しの中の位置なので、
   * 2 周目でも 0 から `bgmLength()` のあいだに収まる。
   * 音声ファイルの BGM は途中の位置を持てないので 0 を返す。
   * @returns {number}
   */
  bgmPosition() {
    const s = this.bgmState;
    if (!s || !this.ctx || !s.pump) return 0;
    if (s.paused) return s.offset || 0;
    // 折り返しは予約しておいて、その時刻が来てから時計に移す
    const now = this.ctx.currentTime;
    while (s.wraps && s.wraps.length && now >= s.wraps[0].at) s.showBase = s.wraps.shift().base;
    return Math.max(0, Math.min(s.length || 0, now - (s.showBase ?? s.base)));
  }

  /** くり返し 1 周ぶんの長さ(秒)。鳴っていなければ 0 */
  bgmLength() {
    const s = this.bgmState;
    return (s && s.pump) ? (s.length || 0) : 0;
  }

  /**
   * 鳴らす範囲を決める(AB リピート)。
   *
   * A から B までを回りつづける。曲に書いたくり返しや後奏より強い —
   * 曲の作りではなく、聴いている人がいま選んだものなので。
   *
   * 範囲の外へ跳んでもよい。止めずにそのまま鳴らし、B をまたぐところで
   * A へ戻す。B より後ろへ跳んだときは、そのまま曲を進む(2026-09-15)。
   *
   * @param {number} from A(秒)
   * @param {number} to B(秒)。前後は入れ替えてよい
   * @returns {{from:number,to:number}|null} 短すぎるときは null
   */
  setRange(from, to) {
    const a = Math.max(0, Math.min(from, to));
    const b = Math.max(from, to);
    this._range = (b - a > 0.05) ? { from: a, to: b } : null;
    if (this.bgmState) this.bgmState.range = this._range;
    return this._range;
  }

  /** 範囲を外す。曲の作りどおりに戻る */
  clearRange() {
    this._range = null;
    if (this.bgmState) this.bgmState.range = null;
  }

  /**
   * いまの範囲。無ければ null。
   * @returns {{from:number,to:number}|null}
   */
  bgmRange() {
    return this._range;
  }

  /**
   * 曲の途中へ跳ぶ。
   *
   * 鳴っているものを止めてから、その位置で積み直す。止めている最中に呼べば、
   * 戻したときにそこから始まる。
   *
   * 常駐の処理器(OPLL / 4 オペ / 幅の表)は `stop()` を持たないので、
   * 別に黙らせる(`_wkCut`)。2026-10-03 まで、ここも停止もポーズも
   * 届いていなかった(docs/BUGS.md)。
   *
   * @param {number} sec 頭から何秒のところか。曲より長いと終わりへ寄せる
   * @param {{cut?:boolean}} [opts] cut = 常駐の処理器を黙らせるか(既定 true)。
   *   `false` にすると前の音の余韻が残る。テイクの切り替えがそちら
   */
  seekBGM(sec, opts = {}) {
    const cut = opts.cut;
    const s = this.bgmState;
    if (!s || !this.ctx || !s.pump) return;
    // 選択肢の差し替え待ちは、ここで済ませる。切れ目まで待っていたのは
    // 鳴っているフレーズを折らないためで、跳ぶならもう折れている(2026-09-16)
    if (this._takeWait) { clearTimeout(this._takeWait.timer); this._takeWait.run(); }
    // 予約してある合図は捨てる。跳んだ先から積み直すので、飛ばしたぶんは出ない
    this._dropCues(s);
    let to = Math.max(0, Math.min(Math.max(0, (s.length || 0) - 0.02), sec));
    // 跳んだ先のすぐ手前に音符の頭があれば、そこへ吸着させる。
    //
    // 積むのは「跳んだ先から始まる音」だけなので、頭を数ミリ秒でも通り越すと
    // その音が丸ごと消える。囲みの頭へ戻したのに、そこに置いた音が鳴らない、
    // という形で出る。またいで鳴っている音(手前の小節から伸びている音)は
    // ここでは拾わない。音色の途中から鳴らすことになるので、別の話にする
    // (2026-09-18)
    if (Array.isArray(s.tracks)) {
      const SNAP = 0.005;
      let head = null;
      for (const track of s.tracks) {
        for (const ev of track.events) {
          if (ev.t > to + 1e-9 || ev.t < to - SNAP) continue;
          if (head == null || ev.t < head) head = ev.t;
        }
      }
      if (head != null) to = head;
    }
    if (s.timer) { clearTimeout(s.timer); s.timer = 0; }
    for (const n of s.nodes) { try { n.stop(0); } catch (e) { /* stopped */ } }
    // 常駐の処理器は `stop()` を持たないので、別に言う。跳ぶのは人の操作なので
    // 余韻は消す(`cut` が false なら残す。テイクの切り替えがそちら)
    if (cut !== false) this._wkCut();
    s.nodes = [];
    // 後奏の中へ跳んだなら、そこに居ることにする。そうしないと
    // 1 周の終わりを過ぎているとみなされて、すぐ戻されてしまう
    s.inEnding = s.endAt != null && to >= s.lapEnd;
    if (s.paused) { s.offset = to; return; }
    s.base = this.ctx.currentTime + 0.05 - to;
    s.showBase = s.base;
    s.wraps = [];
    s.cursor = to;
    s.pump();
  }

  /**
   * 音色について、何を渡せて、それぞれ何を意味するか(`sound/mml.js` の `describeVoice`)。
   * 作り分けを持つ音色なら軸と値と既定を、名前に作り分けを書けば選ばれた値も返す。
   * AI が名前から見当をつけずに済むように置いてある
   *
   * @param {string} name `layerPair` `pulse(25)` など
   */
  describeVoice(name) {
    return describeVoice(name);
  }

  /** 作り分けを持つ音色の仲間の名前(`describeVoice` に渡せる) */
  voiceFamilies() {
    return listVoiceFamilies();
  }

  /**
   * いま鳴っている曲のチャンネル一覧。
   *
   * 名前と役割は MML の注釈に書いたもの(`#name 主旋律`)。
   * 書いていなければ null なので、出す側が `ch1` のような札を当てる。
   * @returns {{ch:number, name:string|null, role:string|null, muted:boolean}[]}
   */
  bgmTracks() {
    const s = this.bgmState;
    if (!s || !s.tracks) return [];
    return s.tracks.map((t, i) => ({
      ch: i, name: t.name ?? null, role: t.role ?? null, muted: !!s.muted[i],
    }));
  }

  /**
   * いま鳴っている曲のラベル。跳ぶ先として使う。
   *
   * MML の注釈に `#label サビ` と書いたところ。どのチャンネルに書いても
   * 並ぶので、旋律のチャンネルにだけ書けば足りる。
   * 同じ名前は 1 つにまとめる(全部のチャンネルに書いても増えない)。
   *
   * 曲の頭のラベル(`START`)はこちらで足す。書く人に毎回書かせるものでは
   * ないし、頭出しの押しどころはどの曲にも要る(2026-09-16)。
   *
   * 予約語(`START` `LOOP` `OUTRO`)も並べる。`LOOP` も `OUTRO` も
   * 聞く人が跳びたい場所そのものなので、隠す理由が無かった。
   * 落としたいときだけ `{ hideSystem: true }` を渡す。
   *
   * @param {{hideSystem?:boolean}} [opts] hideSystem = 予約語を落とすか(既定 false)
   * @returns {{name:string, t:number}[]} 秒の早い順
   */
  bgmMarks(opts = {}) {
    const s = this.bgmState;
    if (!s || !s.tracks) return [];
    return gatherMarks(s.tracks, opts.hideSystem === true);
  }

  /**
   * ラベルの名前から、頭から何秒のところかを返す。
   *
   * 一覧を引いて探すのは毎回同じ書き方になるので、1 行で済むようにした。
   * 名前で呼んだときは予約語も返す。書いた人が `REPEAT` と名指ししたなら、
   * それが欲しいということなので隠さない(2026-09-15)。
   *
   * 曲の名前を渡せば、鳴らす前のものも読める。省くと、いま鳴っている曲を見る。
   *
   * @param {string} name ラベルの名前。大文字小文字と前後の空白は見ない
   * @param {string} [song] `defineBGM()` で登録した曲の名前
   * @returns {number|null} 秒。その名前が無ければ null
   */
  bgmMarkAt(name, song) {
    const want = String(name ?? '').trim().toLowerCase();
    if (!want) return null;
    const list = song === undefined
      ? this.bgmMarks({ system: true })
      : (this.bgmInfo(song, { system: true })?.marks ?? []);
    const hit = list.find((m) => m.name.trim().toLowerCase() === want);
    return hit ? hit.t : null;
  }

  /**
   * 戻る先。`#label REPEAT` を書いた曲だけ持つ。
   *
   * ラベルと同じで「曲のこの位置」を指すものなので、跳ぶ先としても使える。
   * 違うのは、ここが終わりに来たときの動きまで決めるところ。
   * @returns {{from:number, to:number}|null}
   */
  bgmLoop() {
    const s = this.bgmState;
    if (!s || !s.tracks) return null;
    return s.tracks.map((t) => t.loop).find(Boolean) ?? null;
  }

  /**
   * いま鳴っている音を、チャンネルごとに返す。
   *
   * 出た音を測るのではなく、音符とエンベロープから計算する。
   * `AnalyserNode` も FFT も要らないので、外部依存ゼロのまま。
   * 実機の鳴らし手もチャンネルごとに「いまの音符と音量」を持っているので、
   * あちらでも同じものが読める(2026-09-15)。
   *
   * 絵を音に合わせて動かすのに使う。知らせを配る形にすると、速い曲で
   * 毎秒 20〜30 回になり、しかも JS では音符 1 つずつタイマーを仕掛ける
   * ことになる。絵は毎コマ描くので、そのときに聞きに来るほうが安い。
   *
   * 和音は同じチャンネルに重なるので、1 本から何個も返ることがある。
   *
   * 層(`#drum` の字と `#chord` の声)を持つ音符は、その名前も返す。
   * 画面が中を開いたときに、どの層が鳴っているかを言えるようにするため。
   *
   * @param {number} [sec] 曲の中の秒。省くと、いま鳴らしているところ
   * @returns {{ch:number, freq:number, vol:number, level:number, t:number,
   *            age:number, muted:boolean, lane:string|undefined}[]}
   */
  notesAt(sec) {
    const s = this.bgmState;
    if (!s || !s.tracks) return [];
    const pos = sec ?? this.bgmPosition();
    const out = [];
    s.tracks.forEach((track, ch) => {
      const evs = track.events;
      // 音符は時刻の順に並んでいる。頭から舐めると長い曲で無駄なので、
      // `pos` 以下の最後の 1 つを二分で探してから、そこだけ見る
      let lo = 0, hi = evs.length - 1, at = -1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (evs[mid].t <= pos) { at = mid; lo = mid + 1; } else hi = mid - 1;
      }
      // 和音は同じ時刻に並ぶ。少し戻って、鳴り続けているものを拾う
      for (let i = at; i >= 0 && i > at - 24; i--) {
        const ev = evs[i];
        const age = pos - ev.t;
        if (age < 0 || age >= ev.gate) continue;
        // 黙っているものは音量 0 で返す。層を止めてあるときも同じ。
        // 聞こえないものが画面で光ると、押し具合のほうが読めなくなる
        const off = this._chMute.has(ch)
          || (ev.lane !== undefined && this._laneMute.has(`${ch}/${ev.lane}`));
        out.push({
          ch,
          freq: freqAt(ev, age),
          vol: ev.vol,
          level: off ? 0 : levelAt(ev, age),
          t: ev.t,
          age,
          muted: this._chMute.has(ch),
          lane: ev.lane,
        });
      }
    });
    return out;
  }

  /**
   * チャンネルごとの、いまの音量(0〜1)。
   *
   * 鳴っていないチャンネルは 0。黙らせてあるチャンネルも 0。
   * 和音が重なっているところは、いちばん大きいものを返す。
   * @param {number} [sec] 曲の中の秒。省くと、いま鳴らしているところ
   * @returns {number[]}
   */
  levels(sec) {
    const s = this.bgmState;
    if (!s || !s.tracks) return [];
    const out = s.tracks.map(() => 0);
    for (const n of this.notesAt(sec)) out[n.ch] = Math.max(out[n.ch], n.level);
    return out;
  }

  /**
   * チャンネルを 1 本だけ黙らせる / 戻す。
   *
   * 黙らせても曲は進む。戻せば、その時点から続きが聞こえる。
   * @param {number} ch 0 から数える
   * @param {boolean} [on] 省略すると切り替え
   * @returns {boolean} 黙っているか
   */
  muteTrack(ch, on) {
    const to = on === undefined ? !this._chMute.has(ch) : !!on;
    if (to) this._chMute.add(ch); else this._chMute.delete(ch);
    // 鳴っていなければ覚えるだけ。次に鳴らすときに効く
    const s = this.bgmState;
    if (s && s.chGains && s.chGains[ch]) {
      s.muted[ch] = to;
      s.chGains[ch].gain.value = this._chVol(s, ch);
    }
    return to;
  }

  /**
   * 黙らせてある番号を、この曲のものに合わせる。別の曲なら忘れる。
   *
   * 同じ曲を積み直すだけなら残す。聞き比べの途中で押し直しても、
   * 黙らせたところはそのままになる
   */
  _mutesOf(name) {
    if (this._muteFor === name) return;
    this._muteFor = name;
    this._chMute.clear();
    this._chLevel.clear();
    this._laneMute.clear();
    // 版と組も曲のもの。別の曲になれば選び直し(既定へ戻る)
    this._group = null;
  }

  /**
   * チャンネルの音量の倍率を決める。MML の `v` とは関係なく、鳴らす側で掛ける。
   *
   * 1 がそのまま。1 より大きくもできる(曲のバランスを探るため)。0〜4 に収める。
   * 鳴っていなければ覚えるだけで、次に鳴らすときに効く。書き出しにも乗る。
   * @param {number} ch 0 から数える
   * @param {number} v 倍率
   * @returns {number} 収めたあとの倍率
   */
  setTrackVolume(ch, v) {
    const to = Math.max(0, Math.min(4, Number(v) || 0));
    if (to === 1) this._chLevel.delete(ch); else this._chLevel.set(ch, to);
    const s = this.bgmState;
    if (s && s.chGains && s.chGains[ch]) s.chGains[ch].gain.value = this._chVol(s, ch);
    return to;
  }

  /**
   * チャンネルの音量の倍率。決めていなければ 1。
   * @param {number} ch 0 から数える
   * @returns {number}
   */
  trackVolume(ch) {
    return this._chLevel.get(ch) ?? 1;
  }

  /** チャンネルの音量の倍率を、全部 1 に戻す */
  resetTrackVolumes() {
    this._chLevel.clear();
    const s = this.bgmState;
    if (!s || !s.chGains) return;
    for (let i = 0; i < s.chGains.length; i++) s.chGains[i].gain.value = this._chVol(s, i);
  }

  /**
   * いま黙らせてあるチャンネルの番号。小さい順。
   *
   * 鳴っていなくても答える。押した内容はエンジンが持っているので、
   * 画面の側で控えなくてよい(2026-09-15)。
   * 別の曲を登録するか鳴らすかしたところで空になる。
   * @returns {number[]}
   */
  mutedTracks() {
    return [...this._chMute].sort((a, b) => a - b);
  }

  /**
   * いま黙っているか。`muteTrack()` で入れた番号かどうかを見る。
   * @param {number} ch 0 から数える
   * @returns {boolean}
   */
  isMuted(ch) {
    return this._chMute.has(ch);
  }

  /**
   * チャンネルの中の層を 1 つだけ黙らせる / 戻す。
   *
   * 層は `#drum` の字と `#chord` の声(`bgmInfo().tracks[].lanes`)。
   * チャンネルをまとめて止めるのとは別に持つので、まとめて止めてから
   * 開いても、中の押し具合は残る。
   *
   * チャンネルの音量つまみと違って、こちらは積むときに外す。すでに積んだぶんは
   * 鳴り切るので、押してから効くまでに先読みのぶん(1 秒ほど)かかる。
   *
   * @param {number} ch 0 から数える
   * @param {string} lane 層の名前
   * @param {boolean} [on] 省略すると切り替え
   * @returns {boolean} 黙っているか
   */
  muteLane(ch, lane, on) {
    const key = `${ch}/${lane}`;
    const to = on === undefined ? !this._laneMute.has(key) : !!on;
    if (to) this._laneMute.add(key); else this._laneMute.delete(key);
    return to;
  }

  /**
   * その層が黙っているか。
   * @param {number} ch 0 から数える
   * @param {string} lane 層の名前
   * @returns {boolean}
   */
  isLaneMuted(ch, lane) {
    return this._laneMute.has(`${ch}/${lane}`);
  }

  /**
   * いま黙らせてある層。`{ch, lane}` の並び。
   * @returns {{ch:number, lane:string}[]}
   */
  mutedLanes() {
    return [...this._laneMute].map((k) => {
      const at = k.indexOf('/');
      return { ch: Number(k.slice(0, at)), lane: k.slice(at + 1) };
    });
  }

  /**
   * 黙らせるチャンネルを、まとめて決める。
   *
   * 書いた番号だけが黙り、ほかは鳴る。1 本ずつ呼ぶのと違って、
   * 切り替わりが同じ瞬間に起きる。
   * 「1 と 2 を消して 3 と 4 を出す」のような聞き比べに要る。
   * @param {number[]} chs 黙らせるチャンネルの番号
   */
  muteTracks(chs) {
    this._chMute = new Set(chs || []);
    const s = this.bgmState;
    if (!s || !s.chGains) return;   // 鳴っていなければ覚えるだけ
    for (let i = 0; i < s.chGains.length; i++) {
      s.muted[i] = this._chMute.has(i);
      s.chGains[i].gain.value = this._chVol(s, i);
    }
  }

  /** BGM を停止する */
  stopBGM() {
    // 切れ目を待っている最中なら、それも消す。止めたのに替わっては困る
    if (this._switchTimer) { clearTimeout(this._switchTimer); this._switchTimer = 0; }
    this._waitSwitch = null;
    // 選択肢の差し替え待ちは、待たずに済ませる。止めたあとは鳴っていないので
    // 切れ目を待つ理由が無い。次に鳴らすときは選んだとおりになる
    if (this._takeWait) { clearTimeout(this._takeWait.timer); this._takeWait.run(); }
    // 予約してある合図も捨てる。放っておくと、曲が止まったあとに演出だけ起きる
    this._dropCues();
    const s = this.bgmState;
    if (!s) return;
    // ジングルは道連れにしない。
    // 以前はここで stopJingle() していた(黙らせた曲を止めると音量を戻す先が
    // 無くなるため)が、そのせいで曲が変わるとファンファーレが即死していた。
    // モアイを内側から倒したときの 10 万点のファンファーレが、ちょうど同じころ
    // モアイの曲が道中の曲へ戻るせいで、一音も鳴らずに消えていた。
    //
    // 戻す先が無い件は playBGM 側で面倒を見ている(ジングル中に始まる曲は
    // 黙ったまま始まり、stopJingle が戻す)。曲がひとつも無い場合も
    // _muteBGM は bgmState が無ければ何もしないので、放っておいて困らない
    this.bgmState = null;
    this.bgmVoices = 0;
    clearTimeout(s.timer);
    for (const n of s.nodes) { try { n.stop(0); } catch (e) { /* stopped */ } }
    // 常駐の処理器も黙らせる。止めたのに鳴っているのは不具合(docs/BUGS.md)
    this._wkCut();
    // チャンネルのフィルタも止める。外すだけでは処理器が動き続けて、
    // 曲を替えるたびに溜まる(docs/FILTER.md の「止める合図」)
    for (const f of s.chFilters || []) {
      if (!f) continue;
      for (const n of f.nodes) {
        try { n.disconnect(); if (n.port) n.port.postMessage({ stop: true }); } catch (e) { /* もう居ない */ }
      }
    }
    try { s.gain.disconnect(); } catch (e) { /* already gone */ }
  }

  /**
   * SE を再生する。
   * 空いている音があればそこで鳴らすので、ショットと爆発が同時に鳴ることもある。
   * 空きが足りないときは、いま鳴っている SE のうち優先度の低いものを止めて場所を作る。
   * どれも自分より優先度が高ければ、その SE は鳴らさない(高い音を消さない)。
   * @param {string} name
   * @param {number} [priority=0] 大きいほど優先
   * @param {{exclusive?:boolean, loop?:number, resume?:'head'|'continue'}} [opts]
   *   exclusive = ほかの SE を全部止めて独り占めする(ファンファーレなど)。
   *   鳴っているあいだ、優先度の低い SE は鳴らない。
   *
   *   loop = くり返す回数(既定 1)。現実的な回数を入れること。
   *   -1 で無限にくり返せるが、止め忘れると鳴りっぱなしになる。
   *   どうしても無限が要るときは、止める場所を先に決めてから使うこと
   *   (面が変わる・ボスが消える・ポーズに入る、など)。
   *
   *   ch = 席のカテゴリ(reserveSE で取っておいたもの)。
   *   指定するとその席の中だけで取り合うので、ほかの音に消されない。
   *
   *   resume = ポーズを解いたときの鳴らしかた。
   *   'head'(既定) = くり返しの頭から / 'continue' = 止めたところの続きから。
   *   1 回だけの SE は、どちらにしても鳴り直さない
   * @returns {number} 管理番号。stopSE(番号) でこれだけ止められる。
   *   鳴らせなかったときは 0
   */
  /**
   * 場所を空けるために止める SE を 1 つ選ぶ。
   *
   * まず自分より低い優先度のうち、いちばん低いものを探す。
   * 見つからなければ同じ優先度でいちばん古いものを止める。
   *
   * 同じ優先度で譲り合うと、先に鳴っていた音が場所を握ったままになり、
   * あとから起きた出来事の音が鳴らなくなる。
   * ショットを撃ちつづけていると当たった音や爆発が聞こえない、というのがこれ。
   * 実機の音源もあとから鳴らしたほうが勝つので、それに合わせる。
   * @param {number} priority 鳴らそうとしている音の優先度
   * @param {boolean} noiseOnly ノイズを使っているものだけから選ぶか
   */
  _victim(priority, noiseOnly, list) {
    let low = null, old = null;
    for (const v of (list || this.seVoices)) {
      if (noiseOnly && !v.noise) continue;
      if (v.priority < priority) {
        if (!low || v.priority < low.priority) low = v;
      } else if (v.priority === priority) {
        // id は鳴らした順に増えるので、小さいほうが古い
        if (!old || v.id < old.id) old = v;
      }
    }
    return low || old;
  }

  /**
   * 鳴らす直前に、音名と音量で作り直す。
   *
   * 本体はそのまま取っておく。ここで返すのはその場かぎりの写しなので、
   * 同じ SE を続けて別の高さで鳴らしても混ざらない。
   *
   * 指定が無ければ登録したものをそのまま返す(写しも作らない)。
   *
   * @returns {object[]} 鳴らすトラック
   */
  _seShape(name, tracks, opts) {
    const wantNote = opts.note != null && opts.note !== '';
    const wantVol = opts.vol != null;
    if (!wantNote && !wantVol) return tracks;
    if (wantNote && !tracks.base) {
      console.warn(`[ChpTnSnd] SE "${name}" は音名で鳴らし分けられません`
        + '(defineSE の base を付けて登録してください)');
    }
    // 音名が無い(音量だけ)ときは、本体まるごとを 1 つ鳴らす
    const notes = wantNote && tracks.base
      ? parseSENotes(opts.note, tracks.base.semi)
      : [{ semi: 0, sec: Math.max(...tracks.map((t) => t.total), 0), rest: false }];
    if (!notes.length) return tracks;
    return sliceSE(tracks, notes, opts.vol);
  }

  /**
   * 登録した SE を鳴らす。
   *
   * 声の数が足りなければ、優先度の低いものを止めて場所を空ける。
   * 空けられなければ鳴らさない(`0` が返る)。
   * 同じ優先度どうしなら古いほうを止める — 譲り合うと、先に鳴っていた音が
   * 場所を握ったまま、あとから起きた出来事の音が鳴らなくなるため。
   *
   * @param {string} name `defineSE()` で登録した名前
   * @param {number} [priority=0] 大きいほど強い。場所の取り合いで勝つ
   * `defineSE()` に `base` を付けて登録した SE なら、音名と長さで鳴らし分けられる。
   *
   *   audio.playSE('seShot', 0, { note: 'c4' });       頭の 1/4 を c の高さで
   *   audio.playSE('seShot', 0, { note: 'c4b4e4' });   高さを変えて 3 回
   *   audio.playSE('seShot', 0, { vol: 8 });           音量だけ下げる
   *
   * @param {{system?:boolean, ch?:number|null, exclusive?:boolean,
   *          loop?:number, resume?:('head'|'continue'),
   *          note?:string, vol?:number, duck?:boolean}} [opts]
   *   system = 全体のポーズに巻き込まれない(ポーズの音そのものなど)。
   *   ch = 鳴らすチャンネルを指名する(既定は空いているところ)。
   *   exclusive = 鳴っているあいだ、同じか下の優先度を鳴らさせない。
   *   loop = くり返す回数。-1 で止めるまで(既定 1)。
   *   resume = ポーズを解いたときの鳴らしかた。
   *   `head` = くり返しの頭から(既定) / `continue` = 続きから。
   *   note = 音名と長さ。`'c4b4e4'` のように続けて書くとその数だけ鳴る。
   *   長さを書かなければ本体まるごと。`base` 付きで登録した SE にだけ効く。
   *   vol = 音量 0..15。本体に書いた音量に掛かる(`base` が無くても効く)。
   *   duck = false なら、鳴っているあいだも BGM を下げない(`setDucking()`)
   * @returns {number} 鳴らした音の id。`0` なら鳴らなかった
   *   (場所が空けられなかった / その名前が無い)。
   *   id は `stopSE()` `pauseSE()` に渡せる
   */
  playSE(name, priority = 0, opts = {}) {
    let tracks = this.seDefs.get(name);
    if (!tracks || !this.ctx) return 0;
    tracks = this._seShape(name, tracks, opts);
    const now = this.ctx.currentTime;
    this._cleanupSE(now);
    const system = !!opts.system;
    const need = tracks.length;
    const needNoise = noiseCount(tracks);
    // 席は、その場の指定 > 名前で決めた割り当て、の順で決める
    const ch = opts.ch || (this._chanOf && this._chanOf.get(name)) || null;
    // 仕掛けの音は席の取り合いに入らない。ポーズ中は鳴っている SE が
    // 黙らされたまま席に居座っているので、ふつうに取り合わせると
    // 場所を空けるために戻すはずだった SE を止めてしまう。
    // 数フレームで消える短い音なので、はみ出させたほうが害が無い
    if (!system) {
      // 独り占めしている SE より低い優先度なら、そもそも鳴らさない
      if (this.seVoices.some(v => v.exclusive && v.priority > priority)) return 0;
      if (opts.exclusive) {
        for (const v of [...this.seVoices]) this._stopVoice(v);
      }
      // 席の取り合いは、その範囲の中だけで起きる。
      // 取ってあるカテゴリならその席、指定が無ければ残りの席
      let sc = this._scope(ch);
      // 空きが足りなければ、優先度の低いものから止めて場所を作る
      while (sc.used + need > sc.max) {
        const low = this._victim(priority, false, sc.list);
        if (!low) return 0;   // 止められるものが無い = 鳴らさない
        this._stopVoice(low);
        sc = this._scope(ch);
      }
      // ノイズは本数が決まっているので、あふれるならノイズを使っている SE を止める
      // (1 つの SE だけでノイズを使い切る場合は、その SE 自体は鳴らす)
      while (needNoise > 0 && needNoise <= sc.maxNoise
             && sc.usedNoise + needNoise > sc.maxNoise) {
        const low = this._victim(priority, true, sc.list);
        if (!low) return 0;
        this._stopVoice(low);
        sc = this._scope(ch);
      }
    }
    const gain = this.ctx.createGain();
    gain.gain.value = 1;
    gain.connect(this._out());
    const len = Math.max(...tracks.map(t => t.total), 0);
    const loop = opts.loop == null ? 1 : (opts.loop | 0);
    const id = ++this._seSeq;
    const when = now + 0.02;
    const state = {
      id, gain, nodes: [], priority, voices: need, noise: needNoise, ch,
      endTime: when + len, exclusive: !system && !!opts.exclusive,
      // 全体のポーズに巻き込まれない音(ポーズの音そのものなど)
      system,
      left: loop, timer: 0, nextAt: when + len,
      paused: false, tracks, len,
      // ポーズを解いたときの鳴らしかた。'head' = くり返しの頭から / 'continue' = 続きから
      resume: opts.resume === 'continue' ? 'continue' : 'head',
      startAt: when,   // いまのくり返しが始まった時刻(続きから鳴らすのに使う)
      offset: 0,       // 止めたときの、曲の中の位置(秒)
    };
    this.seVoices.push(state);
    const duck = opts.duck !== false;
    if (duck) this._duckFor(when, when + len);
    for (const t of tracks) this._scheduleTrack(t, when, gain, state.nodes);
    this._wkFlushAll(state.nodes);
    if (loop === 1 || len <= 0) return id;
    // くり返し。1 回ぶんずつ積み足す(先に全部積むと音の数が一気に増えるため)。
    // 次の開始時刻は前回から数える(setTimeout の揺れで隙間が空かないように)。
    // left が 0 になったら終わり。-1 のときは減らないので、止めるまで続く
    const again = () => {
      if (this.seVoices.indexOf(state) < 0) return;   // もう止められている
      if (state.paused || this._sePausedAll) { state.timer = 0; return; }
      if (state.left > 0) state.left--;
      if (state.left === 0) return;
      const t0 = state.nextAt;
      // 鳴り終わった音は捨ててから積む(node がたまり続けないように)
      const now2 = this.ctx.currentTime;
      state.nodes = state.nodes.filter(n => (n.__endTime || 0) > now2);
      for (const t of tracks) this._scheduleTrack(t, t0, gain, state.nodes);
      this._wkFlushAll(state.nodes);
      state.nextAt = t0 + len;
      state.startAt = t0;
      state.endTime = t0 + len + 0.05;
      if (duck) this._duckFor(t0, t0 + len);
      // 次の予約は、鳴り終わる少し前に入れる(積み遅れで切れないように)
      state.timer = setTimeout(again, Math.max(20, (t0 + len - this.ctx.currentTime) * 1000 - 60));
    };
    // ポーズから戻すときにも、同じ手で積み直す
    state.loopAgain = again;
    state.timer = setTimeout(again, Math.max(20, len * 1000 - 60));
    return id;
  }

  /**
   * ポーズの出入りの音を鳴らす。エンジンが持っている音なので、
   * ゲーム側で SE を用意しなくても鳴る。
   *
   * 全体のポーズ(`pauseSE()`)に巻き込まれないのがふつうの `playSE()` との違い。
   * ここを分けていないと、
   *
   *   playSE('pause'); pauseSE();   // 鳴らした直後に自分で黙らせている
   *
   * となって、ポーズへ入る音が出ない。抜けるときも `resumeSE()` が
   * 「1 回きりの SE は鳴らし直さない」の決まりで鳴りかけの音を片づけてしまう。
   * 出入りのどちらでも同じように鳴らしたいので、ポーズの仕組みの外に置いてある。
   *
   * @returns {number} 管理番号
   */
  playPauseSE() {
    return this.playSE(SE_SYS_PAUSE, 0, { system: true });
  }

  /**
   * SE を一時停止する。
   *
   * ポーズには 2 段ある。
   * - `pauseSE(番号)` = その SE だけ止めておく(個別)
   * - `pauseSE()` = 鳴っているもの全部を止めておく(全体。ゲームのポーズ用)
   *
   * 全体を解除しても、個別に止めてあるものは鳴り出さない。
   * どちらも解けているときだけ鳴る。
   * @param {number} [id] 省略で全体
   */
  pauseSE(id) {
    if (id) {
      const v = this.seVoices.find(x => x.id === id);
      if (v) { v.paused = true; this._silence(v); }
      return;
    }
    this._sePausedAll = true;
    for (const v of this.seVoices) if (!v.system) this._silence(v);
  }

  /**
   * SE の一時停止を解く。
   * くり返しの残りがあるものだけ鳴り直す。
   * 頭からか続きからかは、playSE の resume で決まる。
   * 1 回だけの SE は鳴り直さない(途中から鳴らしても不自然なので)
   * @param {number} [id] 省略で全体
   */
  resumeSE(id) {
    if (id) {
      const v = this.seVoices.find(x => x.id === id);
      if (v) { v.paused = false; this._restart(v); }
      return;
    }
    this._sePausedAll = false;
    for (const v of [...this.seVoices]) if (!v.system) this._restart(v);
  }

  /** 鳴っている音を黙らせる(予約も止める。残り回数と位置は覚えておく) */
  _silence(v) {
    if (v.timer) { clearTimeout(v.timer); v.timer = 0; }
    // 「続きから」のときのために、くり返しの頭からどこまで進んだかを覚える
    if (v.resume === 'continue' && v.len > 0) {
      const off = this.ctx.currentTime - v.startAt;
      v.offset = Math.max(0, Math.min(v.len - 0.02, off));
    }
    for (const n of v.nodes) { try { n.stop(0); } catch (e) { /* stopped */ } }
    v.nodes = [];
  }

  /** 止めてあった SE を鳴らし直す(頭から / 続きから は playSE の resume で決まる) */
  _restart(v) {
    if (v.paused || this._sePausedAll || v.timer) return;
    // 残りが無い(1 回だけの SE か、くり返し終わり)なら片づける
    if (v.left === 1 || v.left === 0 || !v.tracks) { this._stopVoice(v); return; }
    const now = this.ctx.currentTime + 0.02;
    if (v.resume === 'continue' && v.offset > 0) {
      // 止めたところから。残りぶんだけ鳴らして、そのあとはいつもどおりくり返す
      const rest = v.len - v.offset;
      for (const t of v.tracks) this._scheduleTrackFrom(t, now, v.gain, v.nodes, v.offset);
      v.startAt = now - v.offset;
      v.nextAt = now + rest;
      v.endTime = now + rest + 0.05;
      v.offset = 0;
      v.timer = setTimeout(v.loopAgain, Math.max(20, rest * 1000 - 60));
      return;
    }
    v.nextAt = now;
    v.loopAgain();
  }

  /**
   * SE を止める。
   * @param {number} [id] playSE() が返した管理番号。これだけ止める。
   *   省略すると鳴っている SE を全部止める。
   *   くり返し中のものも、ここで終わる
   * @param {{fade?:number}} [opts] fade = 消すまでの秒数(既定 0)。
   *   鳴っている途中で切るとプツッと鳴るので、押しているあいだ鳴らす使い方
   *   (鍵盤など)では少し置く。0.02 秒ほどで聞こえなくなる
   */
  stopSE(id, opts = {}) {
    const fade = Number(opts.fade) > 0 ? Number(opts.fade) : 0;
    if (id) {
      const v = this.seVoices.find(x => x.id === id);
      if (v) this._stopVoice(v, fade);
      return;
    }
    for (const v of [...this.seVoices]) this._stopVoice(v, fade);
    this.seVoices = [];
  }

  /** 波形に応じた音源ノードを作る(ノイズだけはバッファ再生) */
  /**
   * 短い輪のノイズ。帰還を掛けた並びを 1 サンプルずつ回して ±1 を吐く。
   *
   * 段数が少ないほど輪が短く、繰り返しそのものが音程として聞こえる。
   * 7 段なら 127 サンプルで一周するので、44.1kHz なら 347Hz のブザーになる。
   * 実機(ファミコンの短周期・SN76489 の周期ノイズ)もこの鳴り方。
   *
   * 音色ごとに 1 本だけ作って取っておく。音符ごとに作ると、
   * 速い刻みでそのぶんだけ配列を埋めることになる
   */
  _lfsrBuffer(bits) {
    this._lfsr = this._lfsr || new Map();
    const key = bits + '@' + (this.ctx ? this.ctx.sampleRate : 0);
    const got = this._lfsr.get(key);
    if (got && got.ctx === this.ctx) return got.buf;
    const n = (1 << bits) - 1;
    const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    // ガロア型。下 2 段を戻す(実機の並びもこの形)
    let reg = 1;
    for (let i = 0; i < n; i++) {
      const out = reg & 1;
      reg >>= 1;
      if (out) reg ^= 1 << (bits - 2);
      d[i] = out ? 1 : -1;
    }
    this._lfsr.set(key, { ctx: this.ctx, buf });
    return buf;
  }

  _makeOscillator(ev, freq) {
    const ctx = this.ctx;
    const wf = WAVEFORMS[ev.wave] || WAVEFORMS[2];
    if (wf.kind === 'wave') {
      // 波形メモリ。数字の並びから倍音を割り出して鳴らす
      // (そのままつなぐより、こちらのほうが高い音でも歪まない)
      const osc = ctx.createOscillator();
      osc.setPeriodicWave(this._periodicWave(wf));
      osc.frequency.value = freq;
      return osc;
    }
    if (wf.kind === 'fm') {
      // 2 オペの FM。変調側の音でもう片方の音程を揺らす。
      // 揺らす量を時間とともに減らすのが FM らしさなので、
      // 深さの予定は鳴らす側(_playVoice)で書き込む
      const car = ctx.createOscillator();
      car.type = 'sine';
      car.frequency.value = freq;
      const mod = ctx.createOscillator();
      const mw = WAVEFORMS[findWave(wf.wave)];
      if (mw && mw.kind === 'pulse') mod.setPeriodicWave(this._pulseWave(mw.duty));
      else if (mw && mw.kind === 'wave') mod.setPeriodicWave(this._periodicWave(mw));
      else mod.type = (mw && { triangle: 'triangle', saw: 'sawtooth' }[mw.name]) || 'sine';
      mod.frequency.value = freq * wf.ratio;
      const depth = ctx.createGain();
      mod.connect(depth).connect(car.frequency);
      car.__fm = { mod, depth, wf, freq };
      return car;
    }
    if (wf.kind === 'beep') return ev.tape ? this._makeTape(wf, ev) : this._makeBeep(wf, freq, ev);
    if (wf.kind === 'noise') {
      const src = ctx.createBufferSource();
      // 輪が短いものは、その音色ぶんの並びを作って回す。
      // 繰り返しが聞こえること自体が音なので、白いノイズとは buffer を分ける
      src.buffer = wf.bits ? this._lfsrBuffer(wf.bits) : this.noiseBuffer;
      src.loop = true;
      // 音程が高いほど明るいノイズになるよう再生速度を変える。
      // 作り分けの倍率はここに掛ける — 実機の分周にあたる
      src.playbackRate.value = Math.min(4, Math.max(0.05, freq / 440 * (wf.rate || 1)));
      return src;
    }
    const osc = ctx.createOscillator();
    if (wf.kind === 'pulse') {
      // デューティ比つき矩形波は PeriodicWave で作る。
      // setPeriodicWave を呼ぶと type は自動で 'custom' になる(直接代入は不可)。
      //
      // 50% も同じ道を通す。以前は素の `square` を使っていたが、
      // あちらは山が 1 になるよう均されて出てくるので、
      // 50% だけ 1.4 dB 静かった。同じ矩形波の仲間なのに
      // 25% のほうが大きい、という並びになっていた
      osc.setPeriodicWave(this._pulseWave(wf.duty));
    } else if (wf.kind === 'triangle') {
      osc.type = 'triangle';
    } else if (wf.kind === 'saw') {
      osc.type = 'sawtooth';
    } else {
      osc.type = 'sine';
    }
    osc.frequency.value = freq;
    return osc;
  }

  /**
   * 波形メモリを足す。1 周期ぶんの数字の並び(-1..1)を渡すと、
   * `@{名前}` で鳴らせるようになる。名前は wt で始める約束。
   * @param {string} name @param {number[]|Float32Array} samples
   * @param {5|8} [bits=8] 段階の細かさ(5 = PC エンジン風 / 8 = SCC 風)
   */
  /** 使える音色の名前(`@{名前}` で呼べるもの)。波形メモリも含む */
  get waveNames() { return WAVEFORMS.map((w) => w.name); }

  /**
   * 波形メモリの音色を足す。`@{名前}` で鳴らせるようになる。
   * 実機の SCC / PC エンジンにあたるもので、1 周期ぶんの形をそのまま置く。
   * 名前は wt で始める約束(波形メモリだと見て分かるように)。
   *
   * @param {string} name 名前。同じものがあるとエラー(差し替えは { overwrite: true })
   * @param {number[]} samples 1 周期ぶん。32 個が実機と同じ長さ。値は -1〜1
   * @param {number} [bits=8] 段階の細かさ。5 = 32 段(PC エンジン風) /
   *   8 = 256 段(SCC 風)。粗いほど倍音が増えて古い音になる
   * @param {{overwrite?:boolean, env?:string}} [opts]
   *   env = 既定のエンベロープ(`@e{...}` を書かなかったときに付くもの)
   * @returns {number} 音色の番号(`@<n>` で呼ぶときの数字)
   */
  addWave(name, samples, bits = 8, opts = {}) {
    const id = registerWave(name, samples, bits, opts);
    if (this._waveCache) this._waveCache.delete(name);   // 上書きに備えて捨てる
    return id;
  }

  /**
   * 2 オペの FM 音色を足す。`@{名前}` で鳴らせるようになる。
   * 名前は fm で始める約束。同じ名前があるとエラー
   * (差し替えるなら `{ overwrite: true }`)。
   * @param {string} name
   * @param {{ratio?:number, depth?:number, attack?:number, decay?:number,
   *          sustain?:number, wave?:string}} params
   * @param {{overwrite?:boolean}} [opts]
   */
  addFM(name, params, opts = {}) { return registerFM(name, params, opts); }

  /** 波形メモリを PeriodicWave に直す(キャッシュ付き) */
  _periodicWave(wf) {
    if (!this._waveCache) this._waveCache = new Map();
    const hit = this._waveCache.get(wf.name);
    if (hit) return hit;
    const s = wf.samples, N = s.length;
    const half = N >> 1;
    const real = new Float32Array(half), imag = new Float32Array(half);
    // 離散フーリエ変換。倍音の大きさを出して PeriodicWave に渡す
    for (let k = 1; k < half; k++) {
      let re = 0, im = 0;
      for (let n = 0; n < N; n++) {
        const a = 2 * Math.PI * k * n / N;
        re += s[n] * Math.cos(a);
        im += s[n] * Math.sin(a);
      }
      real[k] = re * 2 / N;
      imag[k] = im * 2 / N;
    }
    const pw = this.ctx.createPeriodicWave(real, imag);
    this._waveCache.set(wf.name, pw);
    return pw;
  }

  /**
   * デューティ比 duty のパルス波を PeriodicWave として作る(キャッシュ付き)。
   *
   * 倍音 1 本を決めるには、大きさと位相の 2 つが要る。
   * `createPeriodicWave(real, imag)` はその 2 つ組で、real が余弦・imag が正弦。
   *
   * 以前はここに大きさだけを入れていた(`imag[n] = 2/(nπ)·sin(nπd)`)。
   * 大きさの並びは合っているので耳では正しく聞こえていたが、
   * 位相が全部そろってしまい、波形が矩形になっていなかった —
   * 測ると幅 12.5% でも 25% でも「0 より上にいる時間」が 49.7% だった。
   *
   * @param {number} duty 0〜1
   * @param {boolean} [normalize=false] 山が 1 になるよう均すか。
   *   音には均さない。実機の矩形波は幅が変わっても 0 と音量値の間を
   *   行き来するだけで、上下の振れ幅は変わらない(細いほど静かになるのは
   *   平均の力が減るからで、山が低くなるからではない)。均すと細い幅ほど
   *   余計に縮められて、12.5% が実機より 7.7 dB 静かになる。
   *   ビブラートの信号として使うときだけ均す — あちらは ±1 で振れてほしい
   */
  _pulseWave(duty, normalize = false) {
    if (!this._pulseCache) this._pulseCache = new Map();
    const key = duty + (normalize ? '#n' : '');
    const hit = this._pulseCache.get(key);
    if (hit) return hit;
    const N = 64;
    const real = new Float32Array(N), imag = new Float32Array(N);
    for (let n = 1; n < N; n++) {
      // 幅 duty の矩形波(+1 / -1)のフーリエ係数
      real[n] = (2 / (n * Math.PI)) * Math.sin(2 * Math.PI * n * duty);
      imag[n] = (2 / (n * Math.PI)) * (1 - Math.cos(2 * Math.PI * n * duty));
    }
    const w = this.ctx.createPeriodicWave(real, imag, { disableNormalization: !normalize });
    this._pulseCache.set(key, w);
    return w;
  }

  /**
   * 音色を焼いて波形にする(プロシージャルな PCM 音源)。
   *
   * 元の音色を切らずに伸ばしっぱなしで鳴らし、頭と輪を切り出す。
   * 切るのは鳴らす側の仕事なので、焼くほうはエンベロープを持たない。
   *
   * 継ぎ目は基本周期の整数倍で切れば消える(pcmbake.js)。
   *
   * @param {string} name registerBaked で登録した名前
   * @returns {Promise<number>} 焼いた数
   */
  async bakeVoice(name) {
    const wf = WAVEFORMS[findWave(name)];
    if (!wf || wf.kind !== 'baked') throw new Error('[ChpTnSnd] ' + name + ' は焼ける音色ではありません');
    if (wf.baked) return wf.baked.length;
    if (wf.baking) return 0;
    if (wf.phrase) return this._bakePhrase(wf);
    const srcIndex = findWave(wf.from);
    if (srcIndex < 0) throw new Error('[ChpTnSnd] ' + name + ': 元の音色がありません');
    wf.baking = true;
    try {
      const src = WAVEFORMS[srcIndex];
      // 4 オペなら音色の中身から段取りを立てる。2 オペは `patch` を持たないので、
      // 変調側の比とエンベロープからその場で組む。ここを既定値で済ませると、
      // 比が半端な音色(3.5 の鐘など)でも基本周期で繰り返すことにしてしまい、
      // 輪の継ぎ目に段差が残ってぶつぶつ鳴る。減りきる時間も取り違えるので、
      // まだ倍音が動いている途中を輪にしてしまう。
      // それ以外は 1 周期で繰り返すとみなす。
      // `patch` を名前の文字列で持つ音色(analog など)もあるので、`ops` の有無で見る。
      // OPM の音色はレジスタの値で持っているので、比と秒数に読み替える(bakeOps)
      const patch = (src.patch && Array.isArray(src.patch.ops)) ? bakeOps(src.patch) : (src.kind === 'fm' ? { ops: [
        { ratio: src.ratio, sl: src.sustain, ar: src.attack, dr: src.decay },
        // 搬送側。焼くときはエンベロープを持たせないので、鳴りっぱなしとして数える
        { ratio: 1, sl: 1, ar: 0, dr: 0 },
      ] } : { ops: [{ ratio: 1, sl: 1, ar: 0.005, dr: 0.05 }] });
      const plan = bakePlan(patch, {
        sampleRate: wf.sampleRate, octaves: wf.octaves, step: wf.step, minLoop: wf.minLoop,
        loop: wf.loop, length: wf.length,
      });
      const baked = [];
      for (const job of plan.jobs) {
        const need = job.attackSamples + job.loopSamples;
        // 使うぶんの後ろに余りを付けて焼く。音を切ると離しの傾きが入るので、
        // ぴったりの長さで焼くと輪の終わりがその傾きに食われて、継ぎ目に段差が残る
        // (離しはいちばん長いエンベロープでも 0.15 秒)
        const tail = Math.ceil(wf.sampleRate * 0.2);
        const data = await this._renderTone(srcIndex, job.bakedFreq, need + tail, wf.sampleRate);
        const k = {
          note: job.note, bakedFreq: job.bakedFreq,
          attack: job.attackSamples, loop: job.loopSamples,
          data: data.slice(0, need), rate: wf.sampleRate,
        };
        // チップの方式へ落とす音色は、ここで落とす(sound/oplpcm.js)。
        // 細かさが変わることがあるので、輪の位置も一緒に読み替える
        if (wf.post) {
          const got = wf.post(k.data, wf.sampleRate);
          const r = got.sampleRate / wf.sampleRate;
          k.data = got.data;
          k.rate = got.sampleRate;
          k.attack = Math.round(k.attack * r);
          k.loop = Math.round(k.loop * r);
        }
        baked.push(k);
      }
      wf.baked = baked;
      wf.plan = plan;
      return baked.length;
    } finally {
      wf.baking = false;
    }
  }

  /**
   * MML のフレーズを焼く(registerBaked の phrase)。
   *
   * 使い捨ての player でフレーズだけを鳴らして波形にし、1 つの音として持つ。
   * o4c で書いたとおりに鳴り、ほかの高さは読む速さで動かす(サンプラーと同じ)。
   * 後ろの無音は切る。大きさは、v15 で鳴らしたときに元のフレーズと揃うように割り戻す。
   */
  async _bakePhrase(wf) {
    const OAC = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
    if (!OAC) throw new Error('[ChpTnSnd] 焼くにはブラウザが要ります');
    wf.baking = true;
    try {
      const tmp = new ChipTuneSound({ maxVoices: this.maxVoices });
      tmp.defineBGM('__phrase__', [`t${wf.tempo} ${wf.phrase}`], {});
      const buf = await tmp.renderBGM('__phrase__', { loops: 1, tail: 0.5,
        sampleRate: wf.sampleRate, channels: 1, seed: 1, mute: [] });
      let data = buf ? buf.getChannelData(0) : new Float32Array(1);
      let end = data.length;
      while (end > 1 && Math.abs(data[end - 1]) < 1e-4) end--;
      data = data.slice(0, end);
      // 書き出しには全体の大きさ(MASTER_VOL)が掛かっている。鳴らすときにもう一度
      // 掛かるので、ここで外して 1 を基準にしておく
      for (let i = 0; i < data.length; i++) data[i] /= MASTER_VOL;
      const k = { note: 60, bakedFreq: 440 * Math.pow(2, (60 - 69) / 12),
        attack: data.length, loop: 0, data, rate: wf.sampleRate };
      if (wf.post) {
        const got = wf.post(k.data, wf.sampleRate);
        k.attack = Math.round(k.attack * got.sampleRate / wf.sampleRate);
        k.data = got.data;
        k.rate = got.sampleRate;
      }
      wf.baked = [k];
      return 1;
    } finally {
      wf.baking = false;
    }
  }

  /**
   * 曲が使う焼く音色のうち、まだ焼けていないものの名前。
   * 焼けなかったもの(bakeFailed)は数えない。元の音色で鳴らす
   */
  _bakeNeeds(tracks) {
    const out = new Set();
    const look = (i, seen) => {
      if (seen.has(i)) return;
      seen.add(i);
      const w = WAVEFORMS[i];
      if (!w) return;
      if (w.kind === 'layer') { for (const m of w.layers) look(m.wave, seen); return; }
      if (w.kind === 'baked' && !w.baked && !w.bakeFailed) out.add(w.name);
    };
    for (const t of tracks || []) for (const e of t.events || []) look(e.wave, new Set());
    return [...out];
  }

  /** 焼けていない音色を焼く。焼けなかったものには印を付けて、二度と待たない */
  async _bakeAll(names) {
    for (const n of names) {
      try { await this.bakeVoice(n); }
      catch (e) { const w = WAVEFORMS[findWave(n)]; if (w) w.bakeFailed = true; }
    }
  }

  /**
   * 音色 1 つを、指定の高さで伸ばしっぱなしのまま波形にする。
   *
   * 使い捨ての player を作ってそちらで焼く。自分の ctx を差し替えると、
   * 焼いている間に鳴っている曲まで巻き込む(実際、裏で焼き始めたら
   * 積んでいる最中の曲が無音になった)。音色の表は共有なので、
   * 別の player でも同じ音が出る。
   */
  async _renderTone(waveIndex, freq, samples, sampleRate) {
    const OAC = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
    if (!OAC) throw new Error('[ChpTnSnd] 焼くにはブラウザが要ります');
    const ctx = new OAC(1, samples, sampleRate);
    const tmp = new ChipTuneSound({ maxVoices: this.maxVoices });
    tmp.ctx = ctx;
    const rand = seededRandom(1);
    tmp.noiseBuffer = ctx.createBuffer(1, sampleRate, sampleRate);
    const d = tmp.noiseBuffer.getChannelData(0);
    for (let i = 0; i < sampleRate; i++) d[i] = rand() * 2 - 1;
    // その音色が要る処理器だけ読む。幅の表も 4 オペもここを通る。
    // 重ねた音色は中身まで見る。見ないと、中の OPLL などが鳴らないまま焼ける(2026-10-13)
    for (const kind of tmp._wkKindsOf(waveIndex)) await tmp._wkLoad(kind);

    const dest = tmp._out();
    const nodes = [];
    const sec = samples / sampleRate;
    // エンベロープを持たせない。@e{flat} は最後まで満杯のまま
    const ev = {
      t: 0, dur: sec, gate: sec, freq, vol: 15,
      wave: waveIndex, env: 0, vibrato: 0, echo: null,
    };
    // ふつうに v15 で鳴らしたときの大きさで鳴らして、そのぶんを割り戻す。
    // 鳴らすときにもう一度同じ大きさが掛かるので、焼いた中身は 1 を基準にしておく。
    // チップの音色は渡した amp を使わず、自分で音量を作る(MASTER_VOL も中で掛かる)。
    // amp 1 で焼いていたころは、チップの音色を焼くと 17dB 小さくなっていた(2026-10-09)
    const amp = ampAt(ev, 1);
    tmp._playVoice(ev, freq, amp, 0, sec, dest, nodes, false);
    tmp._wkFlushAll(nodes);
    const buf = await ctx.startRendering();
    const data = buf.getChannelData(0);
    if (amp > 0) for (let i = 0; i < data.length; i++) data[i] /= amp;
    return data;
  }

  /** 焼いた波形を、いまの context の AudioBuffer に直す(使い回す) */
  _pcmBuffer(wf, k) {
    if (!this._pcmCache) this._pcmCache = new Map();
    const key = wf.name + '#' + k.note;
    const hit = this._pcmCache.get(key);
    if (hit && hit.ctx === this.ctx) return hit.buf;
    const buf = this.ctx.createBuffer(1, k.data.length, k.rate || wf.sampleRate);
    buf.getChannelData(0).set(k.data);
    this._pcmCache.set(key, { ctx: this.ctx, buf });
    return buf;
  }

  /**
   * 焼いた波形で鳴らす。
   *
   * いちばん近い高さを選んで、足りないぶんは再生速度で寄せる。
   * 焼いたときの丸めのずれも同じ仕組みで戻る。
   */
  _playBaked(wf, ev, freq, amp, t0, t1, dest, nodes) {
    const ctx = this.ctx;
    let best = wf.baked[0];
    const want = 69 + 12 * Math.log2(freq / 440);
    for (const k of wf.baked) {
      if (Math.abs(k.note - want) < Math.abs(best.note - want)) best = k;
    }
    const g = ctx.createGain();
    // 0 から始める。節の初期値は 1 で、エンベロープが書き込むのは t0 から。
    // 音源が t0 より 1 サンプル早く鳴りはじめると、そこだけ素通しで出る
    g.gain.value = 0;
    g.connect(dest);
    this._applyEnvelope(g, ev, amp, t0, t1);
    const src = ctx.createBufferSource();
    src.buffer = this._pcmBuffer(wf, best);
    if (best.loop > 0) {
      const sr = best.rate || wf.sampleRate;
      src.loop = true;
      src.loopStart = best.attack / sr;
      src.loopEnd = (best.attack + best.loop) / sr;
    }
    // ポルタメント(`*`)。焼いた音は読む速さで高さを変えているので、
    // その速さを動かす。速さが変わると音色も時間の進みも一緒に動く —
    // テープの速さを変えるのと同じで、サンプラーのポルタメントもこうなる。
    // 滑るぶんには気にならないが、大きく動かすと別の音になる(2026-09-29)
    const rate = (f) => f / best.bakedFreq;
    src.playbackRate.value = rate(freq);
    if (ev.glide > 0) {
      const off = t1 - Math.max(0, Math.min(ev.relTail || 0, t1 - t0 - 0.01));
      const from = t0 + (ev.glideAt > 0 ? ev.glideAt : 0);
      const till = ev.glideFor > 0 ? Math.min(off, from + ev.glideFor) : off;
      src.playbackRate.setValueAtTime(rate(freq), t0);
      if (from > t0) src.playbackRate.setValueAtTime(rate(freq), from);
      src.playbackRate.exponentialRampToValueAtTime(
        Math.max(0.0001, rate(freq * (ev.glide / ev.freq))), Math.max(from + 0.001, till));
    }
    src.connect(g);
    src.start(t0);
    src.stop(t1 + 0.02);
    src.__endTime = t1 + 0.02;
    src.onended = () => { try { g.disconnect(); } catch (e) { /* gone */ } };
    nodes.push(src);
  }

  /** 処理器 1 種類ぶんの置き場(積んでいる音符と、出口ごとの節) */
  _wkBank(kind) {
    if (!this._wk) this._wk = new Map();
    let bank = this._wk.get(kind);
    if (!bank) { bank = { pend: new Map(), node: new Map() }; this._wk.set(kind, bank); }
    return bank;
  }

  /** 音符を溜める(処理器ごと・出口ごと)。まとめて渡すのは書き出しが待たないため */
  _wkPush(kind, dest, ev) {
    const pend = this._wkBank(kind).pend;
    let list = pend.get(dest);
    if (!list) { list = []; pend.set(dest, list); }
    list.push(ev);
  }

  /**
   * 処理器を読み込む(context ごとに 1 回)。
   *
   * context と読み込み済みの表は、始めたときのものを持っておく。書き出し(`renderBGM`)は
   * 待っているあいだに `this.ctx` と表を差し替えるので、終わってから `this` を見ると、
   * 鳴らす側で読み込んだものを書き出しの側で読み込み済みとして書いてしまう。
   * そうなると書き出しで処理器が作れずに失敗した(`unlock()` の直後に書き出したとき。2026-10-20)
   */
  async _wkLoad(kind) {
    if (!this._wkReady) this._wkReady = new Map();
    const ctx = this.ctx, ready = this._wkReady;
    if (ready.get(kind) === ctx) return;
    const url = URL.createObjectURL(new Blob([WORKLETS[kind].code], { type: 'application/javascript' }));
    await ctx.audioWorklet.addModule(url);
    ready.set(kind, ctx);
  }

  /**
   * 溜めた音符を常駐の処理器へ渡す。
   *
   * 音ごとに節を作ると、作り捨ての手間だけで実時間の 2.65 倍かかって
   * 鳴らせない(実測)。常駐 1 個なら 8 声で 3.3%。
   *
   * 渡すのは作るときにする。港へ流す手もあるが、書き出しは待ってくれないので
   * 届く前に計算が終わってしまう。
   */
  /**
   * 積んだぶんを全部の行き先へ渡す。
   *
   * `_wkFlush` は行き先ごとに処理器を使い回すが、定位を入れると
   * 行き先が位置ごとに分かれるので、曲の出口 1 つを渡しても取りこぼす
   * (見落とすとその音だけ無音になる)。呼ぶ側は「積み終わった」ことだけ
   * 知っていればよい形にしてある。
   *
   * 処理器が位置の数だけ増えるが、鳴っている声の総数は変わらないので
   * 計算の本体は増えない。増えるのは呼び出しの手間だけ(docs/STEREO.md)
   */
  _wkFlushAll(nodes) {
    if (!this._wk) return;
    for (const [kind, bank] of this._wk) {
      for (const dest of [...bank.pend.keys()]) this._wkFlush(kind, dest, nodes);
    }
  }

  /**
   * 常駐の処理器を黙らせる。
   *
   * ---- なぜ要るか ----
   *
   * 止めるところは `n.stop(0)` で済ませているが、`AudioWorkletNode` は
   * `stop()` を持たない(あれは `AudioScheduledSourceNode` のメソッド)。
   * 例外になって catch で飲まれるので、処理器へは何も届かない。発音ノードだけが
   * 止まり、OPLL / 4 オペ / 幅の表はそのまま鳴り続けていた(docs/BUGS.md)。
   *
   * ---- 消すところと残すところ ----
   *
   * 消すのは人が操作したとき(シーク・停止・ポーズ)。残すのは曲が進んだとき
   * (ループの戻り・テイクの切り替え・曲の終わり)。
   * シークも停止もポーズも実機に無い操作なので、実機らしさを守る理由がない。
   *
   * 処理器の側は、溜めたイベントを捨てて、鳴っている声をキーオフしてから、
   * 出口を 10 ミリ秒で落とす。キーオフだけではチップの RR のぶん鳴り続ける。
   */
  _wkCut() {
    if (!this._wk) return;
    for (const [, bank] of this._wk) {
      bank.pend.clear();                      // まだ送っていないぶんも捨てる
      for (const node of bank.node.values()) {
        try { node.port.postMessage({ cut: true }); } catch (e) { /* もう居ない */ }
      }
    }
  }

  _wkFlush(kind, dest, nodes) {
    const bank = this._wkBank(kind);
    const list = bank.pend.get(dest);
    if (!list || !list.length) return null;
    // まだ読めていない。次の機会に
    if (!this._wkReady || this._wkReady.get(kind) !== this.ctx) return null;
    bank.pend.delete(dest);
    // 積む範囲の中を時刻順にしてから渡す。範囲は必ず前へ進むので、
    // 並べ替えた束を後ろへ足すだけで全体の順番が保たれる
    list.sort((a, b) => a.t - b.t);
    let node = bank.node.get(dest);
    if (node) {
      // 2 回目から: 流し込む。MML で作ったパッチは、そのあとに作られたものも届くよう毎回渡す
      const extra = WORKLETS[kind].extra ? WORKLETS[kind].extra(node) : null;
      node.port.postMessage(extra && Object.keys(extra).length ? { patches: extra, add: list } : { add: list });
      return node;
    }
    // 最初の束は、作るときの引数に入れて渡す。`port.postMessage` は
    // OfflineAudioContext の焼き上がりに間に合わないことがあるので、
    // 1 本目の音符をそこへ乗せると焼いたものが無音になる
    const spec = WORKLETS[kind];
    // 音源が自分で組む形(`options`)を持つなら、そちらへ任せる。エンジンそのものが
    // `this` になるので、焼くときの決めごと(声の数・記録・OPLL の固定)を引ける
    node = new AudioWorkletNode(this.ctx, spec.node, spec.options ? spec.options.call(this, list) : {
      processorOptions: { events: list, voices: this.maxVoices * 4,
        ...(this._regLog ? { log: true } : {}) },
    });
    node.connect(dest);
    node.__endTime = Infinity;
    bank.node.set(dest, node);
    if (nodes) nodes.push(node);
    return node;
  }

  /**
   * その音色が要る処理器の名前。
   *
   * 焼いて使う音色(pcm)の元もたどる。焼き上がるまでは元の音色で鳴らすので、
   * そこが 4 オペなら処理器が要る(見落として無音になった)。
   */
  _wkKindOf(waveIndex) {
    const w = WAVEFORMS[waveIndex];
    if (!w) return null;
    if (w.kind === 'baked') return this._wkKindOf(findWave(w.from));
    return workletOf(w);
  }

  /**
   * その音色が要る処理器を、重ねた中身まで見て集める。
   *
   * 重ねた音色(`layer`)は、中に OPLL や 4 オペを混ぜられる。中を見ないと
   * その処理器を読み込まないので、混ざっている層だけが黙る(2026-09-28)。
   * 焼いた音色の元をたどるのと同じ話で、あちらは `_wkKindOf` が見ている
   */
  _wkKindsOf(waveIndex, need = new Set(), seen = new Set()) {
    if (seen.has(waveIndex)) return need;   // 重ねの中に重ねがあっても回らない
    seen.add(waveIndex);
    const w = WAVEFORMS[waveIndex];
    if (!w) return need;
    if (w.kind === 'layer') {
      for (const m of w.layers) this._wkKindsOf(m.wave, need, seen);
      return need;
    }
    const k = this._wkKindOf(waveIndex);
    if (k) need.add(k);
    return need;
  }

  /** そのトラックに混ざっている処理器を全部集める */
  _wkKinds(tracks) {
    const need = new Set();
    // 曲が名乗る全体のエフェクト(`#fx`)。チャンネルのものと同じ処理器を使う
    for (const fx of songFx(tracks) || []) {
      const w = fxWorklet(fx.kind);
      if (w) need.add(w);
    }
    for (const t of tracks) {
      for (const e of t.events) this._wkKindsOf(e.wave, need);
      // チャンネルの出口のエフェクト(`@f`)。音色ではないので、別に見る
      for (const f of t.filters || []) {
        const w = fxWorklet(f.kind);
        if (w) need.add(w);
      }
    }
    return need;
  }

  /**
   * カセットのロード音を波形として作る。
   *
   * ビット 1 個は 1/1200 秒しかないので、音符に割るとエンジンの最短の長さに
   * 伸ばされて重なり、団子になる。まるごと 1 つの音として組むことで
   * 重なりが起きず、音の数も 1000 分の 1 で済む。
   *
   * 実機の作り: データ 0 = スペース音 1 波 / 1 = マーク音 2 波(どちらも 1/baud 秒)。
   * 1 バイトは スタート(0) + 8 ビット + ストップ(1)x3 = 12 ビット枠に収まるので、
   * でたらめなデータの下に 1 秒 100 回の地ができる。ここがロード音のらしさ。
   * パイロットがマーク音だけなのは、枠に挟まれない連続音はデータになりえないから。
   *
   * 4 倍で作ってから均している。素で作ると折り返しの雑音が乗り、
   * テープではなく壊れた音に聞こえる。
   */
  _makeTape(wf, ev) {
    const ctx = this.ctx;
    const rate = ctx.sampleRate, OS = 4;
    const t = ev.tape;
    const len = Math.max(1, Math.round(ev.dur * rate));
    const buf = ctx.createBuffer(1, len, rate);
    const out = buf.getChannelData(0);
    // 種は「曲の種 + 何本目か」から作る。同じ場所は毎回同じ音になり、
    // 続けて置いた ? どうしは違う中身になる
    const rnd = seededRandom((t.seed * 2654435761 + t.seq * 40503) >>> 0);
    const mark = t.baud * 2, space = t.baud;
    const bitSamples = Math.round(OS * rate / t.baud);

    const hi = new Float32Array(len * OS);
    let i = 0, phase = 0;
    // 回転むら。遅い揺れ(ワウ)と速い揺れ(フラッター)を重ねる。
    // テープが伸び縮みするので、音程と読み出しの速さが一緒に動く
    // 傷み具合は音色が持っている。MML の区間で書いてあれば、そちらを使う
    // (`@{tape}{ @wow 0.05 }`)。名前で選んで、要るところだけ上書きできる
    const wow = (t.wow ?? wf.wow) > 0 ? (t.wow ?? wf.wow) : 0;
    const speedAt = (at) => {
      if (!wow) return 1;
      const s = at / (rate * OS);
      return 1 + wow * (Math.sin(2 * Math.PI * 1.7 * s) * 0.7
                      + Math.sin(2 * Math.PI * 11 * s) * 0.3);
    };
    const putBit = (bit) => {
      const f = bit ? mark : space;
      const sp = speedAt(i);
      const end = Math.min(hi.length, i + Math.round(bitSamples / sp));
      for (; i < end; i++) {
        phase += f * sp / (rate * OS);
        hi[i] = (phase % 1) < 0.5 ? 1 : -1;
      }
    };
    if (!t.data) {
      while (i < hi.length) putBit(1);                    // パイロット
    } else {
      // 中身を書いてあればそれを繰り返す。書いていなければでたらめ。
      // 枠(スタート + 8 + ストップ x3)は変えない。
      // この 12 ビットの周期が「ボー / 12」の音程を作っているので、
      // ここを崩すと音程が消える
      const bytes = t.bytes;
      let at = 0;
      while (i < hi.length) {
        const v = bytes ? bytes[at++ % bytes.length] : null;
        putBit(0);                                        // スタート
        for (let b = 0; b < 8; b++) {
          putBit(v === null ? (rnd() < 0.5 ? 1 : 0) : ((v >> b) & 1));  // 下位から
        }
        putBit(1); putBit(1); putBit(1);                  // ストップ
      }
    }
    // 4 倍から 1 倍へ均す。ここで高いところを落とす。
    // テープもスピーカーも上まで出ないので、角の立った矩形にはならない。
    // 素の矩形のままだと「ロード音」ではなく「ただの矩形波」に聞こえる
    const fc = (t.muffle ?? wf.muffle) > 0 ? (t.muffle ?? wf.muffle) : 0;
    const a = fc > 0 ? Math.exp(-2 * Math.PI * fc / (rate * OS)) : 0;
    let lp = 0;
    for (let k = 0; k < len; k++) {
      let sum = 0;
      for (let j = 0; j < OS; j++) {
        const x = hi[k * OS + j];
        if (fc > 0) { lp = x * (1 - a) + lp * a; sum += lp; } else sum += x;
      }
      out[k] = sum / OS;
    }
    // テープの地のノイズ。音色ごとに量を持つ(0 で無し)
    const hiss = t.hiss ?? wf.hiss;
    if (hiss > 0) {
      const mix = hiss;
      for (let k = 0; k < len; k++) out[k] = out[k] * (1 - mix) + (rnd() * 2 - 1) * mix;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    return src;
  }

  /**
   * ビープ音源を組む([docs/BEEP.md](../docs/BEEP.md))。
   *
   * 3 通りの作りを 1 つの形で扱う。
   * - `carrier` があると、その固定音をゲートで刻む(PC-8001 系)。
   *   音程はゲートの速さで作られ、搬送波は消えない = 濁る
   * - `carrier` が 0 なら、音程そのままの矩形(線を直接叩く型 / カウンタ型)
   * - `divClock` があると、出せる高さが分周比の階段に丸まる(8253 の型)
   * - `jitter` は画面と CPU がメモリを取り合う揺れ。
   *   表示期間だけ遅くなるので、`frame` Hz・`display` の割合の脈になる
   *
   * 返すのは搬送波(またはゲート)の発振器。`__beep.out` が本当の出口で、
   * `__beep.extras` は一緒に start/stop すべき節。FM が `__fm` でやっているのと同じ形。
   */
  _makeBeep(wf, freq, ev) {
    const ctx = this.ctx;
    // 音色が持っている値を、MML の区間で書いた値で上書きする
    // (`@{beep(flat)}{ @carrier 2400 }`)。書かなければ音色のまま
    const w = (ev && ev.beepSet) ? Object.assign(Object.create(wf), ev.beepSet) : wf;
    // カウンタ型は分周比が整数なので、出せる高さが階段になる
    let f = freq;
    if (w.divClock > 0) f = w.divClock / Math.max(1, Math.round(w.divClock / f));

    const extras = [];
    // 画面に食われる揺れ。表示期間だけ遅くなるので、その形の脈を足す
    const addJitter = (param, base) => {
      if (!(w.jitter > 0)) return;
      const dev = base * w.jitter / 2;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = w.frame;
      // これは音ではなくビブラートの信号。±1 で振れてほしいので均す
      lfo.setPeriodicWave(this._pulseWave(w.display, true));
      const depth = ctx.createGain();
      depth.gain.value = -dev;              // 表示期間で -base*jitter、帰線で 0 になるよう
      const bias = ctx.createConstantSource();
      bias.offset.value = -dev;
      lfo.connect(depth).connect(param);
      bias.connect(param);
      extras.push(lfo, bias);
    };

    // 搬送波なし = 音程そのままの矩形
    if (!(w.carrier > 0)) {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = f;
      addJitter(osc.frequency, f);
      if (extras.length) osc.__beep = { out: osc, extras };
      return osc;
    }

    // 搬送波を刻む型。ゲートを 0..1 にして掛ける
    const car = ctx.createOscillator();
    car.type = 'square';
    car.frequency.value = w.carrier;
    const gate = ctx.createOscillator();
    gate.type = 'square';
    gate.frequency.value = f;
    addJitter(gate.frequency, f);
    const half = ctx.createGain(); half.gain.value = 0.5;
    const bias = ctx.createConstantSource(); bias.offset.value = 0.5;
    const mul = ctx.createGain(); mul.gain.value = 0;
    gate.connect(half).connect(mul.gain);
    bias.connect(mul.gain);
    car.connect(mul);
    extras.push(gate, bias);
    car.__beep = { out: mul, extras };
    return car;
  }

  /** エンベロープを gain に書き込む */
  /**
   * 音色の表を鳴らす。高さと音量を 1 フレームずつ書き換える。
   *
   * エンベロープ（`@e`）は音の長さで割るが、表は割らない — どの音でも同じ速さで
   * 進むので、短い音では途中までしか鳴らない。そこがチップチューンの手触り
   * （docs/MML.md「音色は何を持つか」）。
   *
   * @returns {boolean} 音量を表で書いたか（書いたらエンベロープは掛けない）
   */
  _applyTone(gain, src, ev, freq, amp, t0, t1, tune) {
    const wf = WAVEFORMS[ev.wave];
    const tone = wf && wf.tone;
    if (!tone) return false;
    const n = Math.max(1, Math.ceil((t1 - t0) / TONE_FRAME));
    const canBend = !!(src && src.frequency);
    // 高さの表。半音（分散和音）とセント（細かい揺れ）は足して効く。
    //
    // 表の高さも階段へ丸める。実機は周期の数でしか高さを持てないので、
    // 分散和音の 1 つ 1 つも階段の上に乗る。丸めずに書くときれいに合いすぎて、
    // あの尖った感じが出ない
    if (canBend && (tone.arp || tone.pitch || tone.slide)) {
      for (let i = 0; i < n; i++) {
        const semi = readTable(tone.arp, i, tone.loop.arp);
        const cent = readTable(tone.pitch, i, tone.loop.pitch) + slideAt(tone.slide, i);
        let f = freq * Math.pow(2, semi / 12 + cent / 1200);
        if (tune) f = psgSnap(f, ev.wave);
        src.frequency.setValueAtTime(f, t0 + i * TONE_FRAME);
      }
    }
    // 音量の表。あればエンベロープの代わりになる
    if (tone.vol) {
      gain.gain.setValueAtTime(0, t0);
      for (let i = 0; i < n; i++) {
        const v = Math.max(0, Math.min(15, readTable(tone.vol, i, tone.loop.vol)));
        gain.gain.setValueAtTime(Math.max(0.0001, amp * v / 15), t0 + i * TONE_FRAME);
      }
      gain.gain.linearRampToValueAtTime(0, t1);
      return true;
    }
    return false;
  }

  /**
   * 幅の表を持つ音色ぶんの、フレームごとの並びを作る。
   *
   * `_applyTone` と同じ表を同じ順に読むが、書き込む先が AudioParam ではなく
   * 数字の並びになる。処理器の側には節が無いので automation を書けない。
   *
   * ビブラートもここで少しずつ動かす。作りつけの道は発振器を 1 本
   * 足して滑らかに揺らすが、実機は 1 フレームに 1 回しか書き換えられないので、
   * 段にしたほうがむしろ本物に近い。
   *
   * @returns {{fr:Float32Array, du:Float32Array, gv:Float32Array|null}}
   *   fr = 高さ(Hz) / du = 幅(0〜1) / gv = 音量(0〜1。表が無ければ null)
   */
  _dutyFrames(tone, ev, freq, len, tune) {
    const n = Math.max(1, Math.ceil(len / TONE_FRAME));
    const fr = new Float32Array(n);
    const du = new Float32Array(n);
    const gv = tone.vol ? new Float32Array(n) : null;
    // `@m` を書いてあればそちらが勝つ。音色の `vib` は書かなかったときの既定
    const vib = ev.vib || tone.vib;
    // 深さはセント。速さは書かなければ深さによらず VIB_SPEED(2026-10-16)
    const depth = vib ? vib.depth : ev.vibrato;
    const speed = vib && vib.speed != null ? vib.speed : VIB_SPEED;
    const wait = vib && vib.delay != null ? vib.delay : 0;
    for (let i = 0; i < n; i++) {
      const semi = readTable(tone.arp, i, tone.loop.arp);
      const cent = readTable(tone.pitch, i, tone.loop.pitch) + slideAt(tone.slide, i);
      // ポルタメント(`*`)。基準の高さがフレームごとに動く。
      // 表(分散和音・細かい揺れ)はその上に乗る。実機のドライバも
      // 土台の高さを動かして、表をその差として足していた(2026-09-29)
      const base = ev.glide > 0 ? freqAt(ev, i * TONE_FRAME) : freq;
      let f = base * Math.pow(2, semi / 12 + cent / 1200);
      // 押した瞬間は真っ直ぐで、伸ばすと揺れ出す(delay はフレーム数)
      if (depth > 0 && i >= wait) {
        f *= Math.pow(2, depth * Math.sin(2 * Math.PI * speed * (i - wait) * TONE_FRAME) / 1200);
      }
      // 実機に寄せるときは階段へ丸める(作りつけの道と同じ)
      fr[i] = tune ? psgSnap(f, ev.wave) : f;
      du[i] = clampDuty(tone.dutyLfo ? dutyLfoAt(tone.dutyLfo, i)
        : readTable(tone.duty, i, tone.loop.duty));
      if (gv) gv[i] = Math.max(0, Math.min(15, readTable(tone.vol, i, tone.loop.vol))) / 15;
    }
    return { fr, du, gv };
  }

  /**
   * 段で下ろす音の形。1 フレームずつ読む。
   *
   * 実機の駆動系は 1 フレームに 1 回しか音量レジスタを書き換えられなかった。
   * Web Audio の道(`_applyEnvelope`)と、チップで鳴らす道(`_ayEvent`)が
   * 同じものを使う。2 か所に書くと、片方だけ直したときに音が食い違う。
   *
   * @returns {{n:number, end:number, shapeAt:(age:number)=>number}}
   *   n = フレームの数 / end = 余韻まで含めた長さ(秒)/ shapeAt = その時刻の高さ(0〜1)
   */
  _stepShape(ev, t0, t1) {
    const e = envOf(ev);
    // ここから下は `_applyEnvelope` の頭と同じ読み方
    const tail = Math.max(0, Math.min(ev.relTail || 0, t1 - t0 - 0.01));
    const len = Math.max(0.02, t1 - tail - t0);
    const span = ev.tieSpan > 0 ? Math.max(0.02, ev.tieSpan - tail) : len;
    const since = ev.tieAt > 0 ? ev.tieAt : 0;
    const r2 = tail > 0 && !e.table && e.s > 0 ? Math.min(envSec(e.r, len), tail) : 0;
    const { a, d, rel } = envShape(e, span);
    // 余韻を後ろで鳴らすときは、離すまで伸ばして、そこから R で段を下りる。
    // 余韻も 1/60 秒の段で落とす(実機の駆動系と同じ)
    const room = tail > 0 ? 0 : (ev.open ? 0.002 : rel);
    const hold = Math.max(a + d, span - room);
    const end = len + r2;
    const n = Math.max(1, Math.ceil(end / TONE_FRAME));
    /** つながりの先頭から数えた、その時刻の高さ */
    const shapeAt = (age) => {
      const at = since + age;
      if (at < a) return a > 0 ? at / a : 1;
      if (at < a + d) return 1 - (1 - e.s) * ((at - a) / Math.max(1e-6, d));
      if (at < hold) return e.s;
      return Math.max(0, e.s * (1 - (at - hold) / Math.max(1e-6, span + r2 - hold)));
    };
    return { n, end, shapeAt };
  }

  /**
   * チップで鳴らす音符の、音量の形。AY・ファミコン・ディスクシステムが同じものを読む。
   *
   * 音量の表 > 配列式のエンベロープ > ADSR の順に勝つ。ADSR は段で下ろす音と
   * 同じもの(`_stepShape`)。
   *
   * @returns {{n:number, shapeAt:(age:number)=>number}} n = フレームの数 / shapeAt = 0〜1
   */
  _chipShape(ev, tone, t0, t1) {
    const e = envOf(ev);
    if (tone.vol) {
      return { n: Math.max(1, Math.ceil((t1 - t0) / TONE_FRAME)),
        shapeAt: (age) => Math.max(0, Math.min(15,
          readTable(tone.vol, Math.floor(age / TONE_FRAME), tone.loop.vol))) / 15 };
    }
    if (e.table) {
      return { n: Math.max(1, Math.ceil((t1 - t0) / TONE_FRAME)),
        shapeAt: (age) => envTableAt(e, Math.floor(age / TONE_FRAME)) };
    }
    const { n, shapeAt } = this._stepShape(ev, t0, t1);
    return { n, shapeAt };
  }

  /**
   * チップ(PC エンジン)で鳴らす音符を、常駐の処理器へ渡す形にする。
   *
   * 音量は 5 ビット(0〜31)で 1 段およそ 1.5dB。v15 が 31 になるよう比で直す。
   * 重ねる音で下げた比は、1.5dB の段で引く(対数なので)。
   */
  _pceEvent(ev, wf, freq, amp, t0, t1) {
    const tone = wf.tone || { loop: {} };
    const steps = ev.vsteps ?? wf.vsteps;
    const { n, shapeAt } = this._chipShape(ev, tone, t0, t1);
    const top = ampFor(ev);
    const down = top > 0 && amp < top * 0.999 ? Math.round(-20 * Math.log10(Math.max(1e-6, amp / top)) / 1.5) : 0;
    const volOf = (age) => {
      const al = Math.round(snapVol(volAt(ev, age) * shapeAt(age), steps) * 31 / 15);
      return al > 0 ? Math.max(0, Math.min(31, al - down)) : 0;
    };
    const { fr } = this._dutyFrames(tone, ev, freq, n * TONE_FRAME, false);
    const per = (i) => (wf.noise ? pceNoise : pcePeriod)(fr[Math.min(i, fr.length - 1)]);
    const v0 = volOf(0), p0 = per(0);
    const vs = [], ps = [];
    let lv = v0, lp = p0;
    for (let i = 1; i < n; i++) {
      const t = t0 + i * TONE_FRAME;
      if (t >= t1) break;
      const v = volOf(i * TONE_FRAME), p = per(i);
      if (v !== lv) { vs.push([t, v]); lv = v; }
      if (p !== lp) { ps.push([t, p]); lp = p; }
    }
    return { t: t0, dur: Math.max(0.01, t1 - t0), v: v0, p: p0,
      ...(wf.noise ? { noise: 1 } : { wave: wf.wave, wkey: wf.name }),
      ...(vs.length ? { vs } : {}), ...(ps.length ? { ps } : {}) };
  }

  /**
   * チップ(SCC)で鳴らす音符を、常駐の処理器へ渡す形にする。
   *
   * 音量は 4 ビットで値がそのまま振幅。重ねる音で下げた比は、値を比のとおりに引く。
   * 波形は音色の名前で見分ける。同じ波形なら処理器は書き直さない。
   */
  _sccEvent(ev, wf, freq, amp, t0, t1) {
    const tone = wf.tone || { loop: {} };
    const steps = ev.vsteps ?? wf.vsteps;
    const { n, shapeAt } = this._chipShape(ev, tone, t0, t1);
    const top = ampFor(ev);
    const ratio = top > 0 ? Math.min(1, amp / top) : 1;
    const volOf = (age) => Math.max(0, Math.min(15,
      Math.round(snapVol(volAt(ev, age) * shapeAt(age), steps) * ratio)));
    const { fr } = this._dutyFrames(tone, ev, freq, n * TONE_FRAME, false);
    const per = (i) => sccPeriod(fr[Math.min(i, fr.length - 1)]);
    const v0 = volOf(0), p0 = per(0);
    const vs = [], ps = [];
    let lv = v0, lp = p0;
    for (let i = 1; i < n; i++) {
      const t = t0 + i * TONE_FRAME;
      if (t >= t1) break;
      const v = volOf(i * TONE_FRAME), p = per(i);
      if (v !== lv) { vs.push([t, v]); lv = v; }
      if (p !== lp) { ps.push([t, p]); lp = p; }
    }
    return { t: t0, dur: Math.max(0.01, t1 - t0), v: v0, p: p0, wave: wf.wave, wkey: wf.name,
      ...(vs.length ? { vs } : {}), ...(ps.length ? { ps } : {}) };
  }

  /**
   * チップ(ディスクシステム)で鳴らす音符を、常駐の処理器へ渡す形にする。
   *
   * 音量は 0〜32(値がそのまま振幅)。v15 が 32 になるよう比で直す。
   * 変調の速さは周期に付いてくるので、ここでは比と深さだけ渡す
   * (処理器が周期を書くたびに、比を掛けて変調の周期も書く)。
   */
  _fdsEvent(ev, wf, freq, amp, t0, t1) {
    const tone = wf.tone || { loop: {} };
    const steps = ev.vsteps ?? wf.vsteps;
    const { n, shapeAt } = this._chipShape(ev, tone, t0, t1);
    const top = ampFor(ev);
    const ratio = top > 0 ? Math.min(1, amp / top) : 1;
    const volOf = (age) => Math.max(0, Math.min(32,
      Math.round(snapVol(volAt(ev, age) * shapeAt(age), steps) * ratio * 32 / 15)));
    const { fr } = this._dutyFrames(tone, ev, freq, n * TONE_FRAME, false);
    const per = (i) => fdsPitch(fr[Math.min(i, fr.length - 1)]);
    const v0 = volOf(0), p0 = per(0);
    const vs = [], ps = [];
    let lv = v0, lp = p0;
    for (let i = 1; i < n; i++) {
      const t = t0 + i * TONE_FRAME;
      if (t >= t1) break;
      const v = volOf(i * TONE_FRAME), p = per(i);
      if (v !== lv) { vs.push([t, v]); lv = v; }
      if (p !== lp) { ps.push([t, p]); lp = p; }
    }
    const m = wf.mod;
    return { t: t0, dur: Math.max(0.01, t1 - t0), v: v0, p: p0,
      // 波形は音色の名前で見分ける。同じなら処理器は書き直さない
      wave: wf.wave, wkey: wf.name,
      ...(m ? { mod: { ratio: m.ratio, gain: fdsModGain(m.depth),
        table: FDS_MOD_TABLES[m.table] || FDS_MOD_TABLES.tri } } : {}),
      ...(vs.length ? { vs } : {}), ...(ps.length ? { ps } : {}) };
  }

  /**
   * チップ(AY)で鳴らす音符を、常駐の処理器へ渡す形にする。
   *
   * 高さと音量はフレームごとにレジスタの値まで直して渡す。処理器の側は
   * 時刻が来たら書くだけ。高さの表・ポルタメント・ビブラートは幅の表と
   * 同じもの(`_dutyFrames`)、音量の形は段で下ろす音と同じもの(`_stepShape`)を読む。
   *
   * 重ねる音(エコーやオクターブ重ね)は `amp` を下げて渡ってくる。
   * 外から音量を掛けられないので、下げた比を音量レジスタの段で引く。
   *
   * ブザー(`env`)は、高さをエンベロープの周期にして、音量レジスタは
   * エンベロープに従わせる(16)。`@g` で掛けた矩形波は区切り(`gates`)ごとに
   * トーンを開け閉めする。ブザーが休んでいる拍の矩形波(`toneOnly`)は、
   * 同じチャンネルのふつうのトーンとして鳴らす。
   */
  _ayEvent(ev, wf, freq, amp, t0, t1) {
    const tone = wf.tone || { loop: {} };
    const noise = wf.mode === 'noise';
    // 休んでいる拍の矩形波は、ブザーの音色のままトーンとして鳴る
    const env = wf.mode === 'env' && !ev.toneOnly;
    const lane = wf.mode === 'env' && ev.toneOnly;
    const steps = lane ? 16 : (ev.vsteps ?? wf.vsteps);
    const { n, shapeAt } = this._chipShape(ev, tone, t0, t1);
    const top = ampFor(ev);
    const down = top > 0 && amp < top * 0.999 ? Math.round(-20 * Math.log10(Math.max(1e-6, amp / top)) / 3) : 0;
    // 休んでいる拍の矩形波の大きさ。ブザーの実効値は v13 の矩形波と同じくらいなので
    // そこへ揃える(チップで鳴らして測った)。揃えないと拍ごとに跳ねる
    const LANE_VOL = 13;
    const volOf = (age) => {
      if (lane) return Math.max(0, Math.min(15, Math.round(LANE_VOL * shapeAt(age)) - down));
      const v = Math.round(snapVol(volAt(ev, age) * shapeAt(age), steps));
      // ブザーは鳴るか黙るかだけ。鳴るときはエンベロープに従わせる
      if (env) return v > 0 ? 16 : 0;
      return Math.max(0, Math.min(15, v - down));
    };
    const { fr } = this._dutyFrames(tone, ev, freq, n * TONE_FRAME, false);
    const div = env ? (AY_ENV_SHAPES[wf.shape] || AY_ENV_SHAPES.saw).div : 0;
    const per = (i) => {
      const f = fr[Math.min(i, fr.length - 1)];
      return env ? ayEnvPeriod(f, div) : noise ? ayNoisePeriod(f) : ayTonePeriod(f);
    };
    const v0 = volOf(0), p0 = per(0);
    const vs = [], ps = [];
    let lv = v0, lp = p0;
    for (let i = 1; i < n; i++) {
      const at = t0 + i * TONE_FRAME;
      if (at >= t1) break;
      const v = volOf(i * TONE_FRAME), p = per(i);
      if (v !== lv) { vs.push([at, v]); lv = v; }
      if (p !== lp) { ps.push([at, p]); lp = p; }
    }
    // `@g` の区切り。最初の 1 つは鳴らしはじめに書き、あとは時刻が来たら書く
    let g0 = 0;
    const gs = [];
    if (env && ev.gates) {
      for (const g of ev.gates) {
        const tp = g.hz > 0 ? ayTonePeriod(g.hz) : 0;
        if (g.at <= 1e-9) g0 = tp;
        else if (t0 + g.at < t1) gs.push([t0 + g.at, tp]);
      }
    }
    return { t: t0, dur: Math.max(0.01, t1 - t0), v: v0,
      ...(noise ? { noise: 1, np: p0 }
        : env ? { env: { shape: (AY_ENV_SHAPES[wf.shape] || AY_ENV_SHAPES.saw).r13, ep: p0 }, g0 }
        : { tp: p0 }),
      ...(wf.ay ? { ay: 1 } : {}),
      ...(vs.length ? { vs } : {}), ...(ps.length ? { ps } : {}), ...(gs.length ? { gs } : {}) };
  }

  /**
   * チップ(ファミコン)で鳴らす音符を、常駐の処理器へ渡す形にする。
   *
   * AY と同じく、フレームごとのタイマーと音量をレジスタの値まで直す
   * (高さと音量の形の読み方は `_ayEvent` と同じ)。矩形波は幅の表も読んで、
   * いちばん近い幅(4 通り)に寄せる。三角波は鳴らすか止めるかだけ。
   * 重ねる音で下げた比は、音量の値を比のとおりに引く(値がそのまま振幅なので)。
   */
  _nesEvent(ev, wf, freq, amp, t0, t1) {
    const tone = wf.tone || { loop: {} };
    const mode = wf.mode;
    const steps = ev.vsteps ?? wf.vsteps;
    const { n, shapeAt } = this._chipShape(ev, tone, t0, t1);
    const top = ampFor(ev);
    const ratio = top > 0 ? Math.min(1, amp / top) : 1;
    const volOf = (age) => {
      const v = Math.round(snapVol(volAt(ev, age) * shapeAt(age), steps) * ratio);
      if (mode === 'triangle') return v > 0 ? 1 : 0;
      return Math.max(0, Math.min(15, v));
    };
    const { fr, du } = this._dutyFrames(tone, ev, freq, n * TONE_FRAME, false);
    const at = (i) => fr[Math.min(i, fr.length - 1)];
    const per = (i) => (mode === 'noise' ? nesNoisePeriod(at(i), !!wf.short)
      : mode === 'triangle' ? nesTriangleTimer(at(i)) : nesPulseTimer(at(i)));
    // 幅は表があればそれを、無ければ音色の幅を使う
    const dutyOf = (i) => nesDutyIndex(dutyMoves(tone) ? du[Math.min(i, du.length - 1)] : (wf.duty ?? 0.5));
    const v0 = volOf(0), p0 = per(0), d0 = dutyOf(0);
    const vs = [], ps = [], ds = [];
    let lv = v0, lp = p0, ld = d0;
    for (let i = 1; i < n; i++) {
      const t = t0 + i * TONE_FRAME;
      if (t >= t1) break;
      const v = volOf(i * TONE_FRAME), p = per(i), d = dutyOf(i);
      if (v !== lv) { vs.push([t, v]); lv = v; }
      if (p !== lp) { ps.push([t, p]); lp = p; }
      if (mode === 'pulse' && d !== ld) { ds.push([t, d]); ld = d; }
    }
    return { t: t0, dur: Math.max(0.01, t1 - t0), ch: mode, v: v0, p: p0,
      ...(mode === 'pulse' ? { duty: d0 } : {}),
      ...(mode === 'noise' && wf.short ? { short: 1 } : {}),
      ...(vs.length ? { vs } : {}), ...(ps.length ? { ps } : {}), ...(ds.length ? { ds } : {}) };
  }

  _applyEnvelope(gain, ev, amp, t0, t1) {
    const e = envOf(ev);
    // 余韻を後ろへ延ばしている音(`relTail`)は、t1 が余韻の終わり。
    // 離すのはその手前で、形の長さは離すまでで数える
    const tail = Math.max(0, Math.min(ev.relTail || 0, t1 - t0 - 0.01));
    const off = t1 - tail;
    const len = Math.max(0.02, off - t0);
    // タイでつながった音は、1 つの音として形を出す。
    //
    // エンベロープは音符 1 つの長さで頭打ちにしている(短い音は減衰の途中で
    // 切れる、という実機の姿)。つながりが見えないと、`a+24*a &a8.` の滑る音
    // (0.08 秒)で 0.34 秒の減衰が 0.08 秒に縮んで 0 まで落ち、続く音が満振幅から
    // 始まる。音量が谷を作って跳ね上がり、滑ったあとに鳴り直して聞こえていた。
    //
    // `tieSpan` はつながり全体の長さ、`tieAt` はその先頭からこの音までの経過。
    // 形は全体の長さで出し、読む位置を経過ぶん進める(2026-09-30)
    const span = ev.tieSpan > 0 ? Math.max(0.02, ev.tieSpan - tail) : len;
    const since = ev.tieAt > 0 ? ev.tieAt : 0;
    // 延ばしたぶんのうち、この形の R が使う長さ。重ねた音色では層ごとに違う
    const r2 = tail > 0 && !e.table && e.s > 0 ? Math.min(envSec(e.r, len), tail) : 0;
    // 配列式のエンベロープ。1 フレームずつ読む。音符の長さに関係なく
    // 同じ速さで進むので、伸び縮みする ADSR とは別の道を通る
    if (e.table) {
      gain.gain.setValueAtTime(0, t0);
      const n = Math.max(1, Math.ceil(len / TONE_FRAME));
      for (let i = 0; i < n; i++) {
        const v = envTableAt(e, i);
        gain.gain.setValueAtTime(Math.max(0.0001, amp * v), t0 + i * TONE_FRAME);
      }
      gain.gain.linearRampToValueAtTime(0, off);
      return;
    }
    // 形は 1 か所で出す。幅の表の処理器も同じものを使う(envShape)。
    // つながっている音は全体の長さで出す
    const { a, d, rel } = envShape(e, span);
    // 段を持つ音色は、坂ではなく段で下ろす。実機の駆動系は 1 フレームに
    // 1 回しか音量レジスタを書き換えられなかったので、高さだけ段にしても
    // 狙いの半分しか出ない。時刻も 60 分の 1 秒ごとに止める(2026-09-25)。
    //
    // 50Hz の機械(PAL)も同じ曲を遅く鳴らしていたが、そちらは書き出しのときに
    // 直す。MML には持ち込まない
    const w = WAVEFORMS[ev.wave];
    if ((ev.vsteps ?? (w ? w.vsteps : 0)) > 0) {
      const { n, end, shapeAt } = this._stepShape(ev, t0, t1);
      // フェードの途中なら、音量も 1 フレームずつ動かす(段に寄せるのはそのあと)
      gain.gain.setValueAtTime(ev.legato ? ampAt(ev, shapeAt(0)) : 0, t0);
      for (let i = 0; i < n; i++) {
        const age = i * TONE_FRAME;
        gain.gain.setValueAtTime(Math.max(0.0001, ampAt(ev, shapeAt(age), age)), t0 + age);
      }
      gain.gain.setValueAtTime(0.0001, t0 + end);
      return;
    }
    const sustain = amp * e.s;
    /**
     * つながりの先頭から数えた、その時刻の高さ(0〜1)。
     * つながっていない音では `since` が 0 なので、音の頭から数えたのと同じ
     */
    const hAt = (at) => (at < a ? (a > 0 ? at / a : 1)
      : at < a + d ? 1 - (1 - e.s) * ((at - a) / Math.max(1e-6, d))
      : e.s);
    // スラーで続く音は、前の音が落ちていたところから続ける。
    //
    // 満振幅へ戻していたので、つながり目で音量が跳ね上がっていた。
    // `since`(つながりの先頭からの経過)で、その時刻の高さを出す
    if (ev.legato) {
      gain.gain.setValueAtTime(Math.max(0.0001, amp * hAt(since)), t0);
      // 減衰の途中から続くなら、残りを残りの時間で下ろす
      if (since < a + d) {
        gain.gain.linearRampToValueAtTime(Math.max(0.0001, sustain), t0 + (a + d - since));
      }
    } else {
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(amp, t0 + a);
      if (d > 0) gain.gain.linearRampToValueAtTime(Math.max(0.0001, sustain), t0 + a + d);
      else gain.gain.setValueAtTime(amp, t0 + a);
    }
    // 次の音がすぐ続くなら、離れぎわは鳴らさない。
    // 実機は次のキーオンで切られるので、間が空いていないと聞こえない。
    // プツッと鳴らないぶんだけは落とす(節を切るときの段差を消すため)
    if (r2 > 0) {
      // 余韻を後ろで鳴らす。離すまで伸ばし、そこから R で 0 へ。
      // 延ばしたぶんが R より長いときは(重ねた音色の短い層)、先に 0 へ着いて黙る
      gain.gain.setValueAtTime(Math.max(0.0001, sustain), Math.max(t0 + a + d - since, off));
      gain.gain.linearRampToValueAtTime(0, off + r2);
      return;
    }
    // つながりの途中でも、離れぎわは書く。書かないと、この音のノードが
    // 鳴ったまま次の音と重なって、そこだけ 1.4 倍に膨らむ(測って確かめた)。
    // 実機も次のキーオンで切られるので、短く 0 へ落とすのが正しい姿。
    //
    // 離れぎわ。`setValueAtTime` ではなく坂で置く。
    //
    // `setValueAtTime` は補間しない。前のイベントの値をそこまで保つので、
    // 手前に書いてある減衰の坂(`a + d` へ向かうもの)がまるごと消える。
    // つながっている音は減衰を全体の長さで数えるので `a + d` がこの音の
    // 終わりを越え、そこが必ず起きる。実際、滑る 80ms のあいだ減衰が止まって
    // 満振幅のままだった(automation を記録して確かめた。2026-09-30)。
    //
    // 坂で書けば、直前のイベントからそこまで補間される。伸ばすところに
    // 入っていれば値が変わらないので、つながっていない音では前と同じ形になる
    const room = ev.open ? 0.002 : rel;
    const relAt = Math.max(t0, off - room);
    gain.gain.linearRampToValueAtTime(
      Math.max(0.0001, amp * hAt(since + (relAt - t0))), relAt);
    gain.gain.linearRampToValueAtTime(0, off);
  }

  /**
   * 鳴らすときに掛けるエフェクトのぶんを重ねる(`dynamic_effects`)。
   *
   * 元の音と同じ場所から鳴らす。厚くするためのものなので、別のところから
   * 聞こえては困る。書いてあるチャンネルにだけ掛かる。
   */
  _extraVoices(ev, ch, amp, t0, t1, dest, nodes, tune = false) {
    const fx = this.dynamic_effects && this.dynamic_effects[ch];
    if (!fx) return;
    const oct = Math.max(0, Math.min(2, fx.octave | 0));
    if (oct >= 1) this._playVoice(ev, ev.freq / 2, amp * 0.5, t0, t1, dest, nodes, tune);
    if (oct >= 2) this._playVoice(ev, ev.freq / 4, amp * 0.28, t0, t1, dest, nodes, tune);
    if (fx.detune) {
      const f2 = ev.freq * Math.pow(2, Number(fx.detune) / 1200);
      this._playVoice(ev, f2, amp * 0.6, t0, t1, dest, nodes, tune);
    }
    if (fx.echo) {
      const delay = Number(fx.echo.delay) || 0.12;
      const depth = Math.max(1, Math.min(9, Number(fx.echo.depth) || 5));
      const eAmp = amp * (0.12 + depth * 0.035);
      this._playVoice(ev, ev.freq, eAmp, t0 + delay, t1 + delay, dest, nodes, tune);
    }
  }

  /**
   * そのチャンネルを丸めるか。配列を入れておけばチャンネルごとに決まる
   * (並びに無いチャンネルは丸める側にする)
   */
  _tuneOn(ch) {
    const t = this.psgTune;
    if (Array.isArray(t)) return t[ch | 0] !== false;
    return !!t;
  }

  /**
   * チップへ渡す、音量の書き直しの並び(`[[時刻, 値], …]`)。
   *
   * 実機の駆動系と同じく 1 フレームに 1 回見て、値が変わったときだけ書く。
   * 値は `valueAt(鳴りはじめからの秒)` が決める(OPLL は `v`、OPM は TL の段)。
   * 処理器が丸める OPLL も、変わり目はここで丸めて見る
   */
  _fadeSteps(ev, t0, t1, valueAt, keyOf = (x) => Math.round(x)) {
    const out = [];
    let last = keyOf(valueAt(0));
    for (let age = TONE_FRAME; t0 + age < t1; age += TONE_FRAME) {
      const v = valueAt(age);
      // 同じ値が続くところは書かない。レジスタへ書く回数を減らす。
      // 何をもって「同じ」かは渡す側が決める(音量は段、音程はレジスタの値)
      const k = keyOf(v);
      if (k === last) continue;
      last = k;
      out.push([t0 + age, v]);
    }
    return out;
  }

  /**
   * フェード(`@fade`)の途中の音を、掛け率の節に通す。
   *
   * 返す音符は `fade` を外して、その音の中でいちばん大きい音量にしてある。
   * そこから下げるぶんを節が掛けるので、先の道はフェードを知らなくてよい。
   *
   * 掛け率は 1 フレームずつ点を打ってつなぐ。段に寄せる音色はここを通らず、
   * エンベロープが 1 フレームずつ書くところで一緒に動かす(`_applyEnvelope`)。
   * 通すと寄せる前の値で掛かってしまい、段にならない
   */
  _fadeDest(ev, t0, t1, dest) {
    const len = Math.max(0, t1 - t0);
    const pts = ev.fade;
    const a = Math.max(0, Math.min(len, pts[0][0]));
    const b = Math.max(a, Math.min(len, pts[pts.length - 1][0]));
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(fadeGain(ev, 0), t0);
    g.gain.setValueAtTime(fadeGain(ev, a), t0 + a);
    for (let age = a + TONE_FRAME; age < b; age += TONE_FRAME) {
      g.gain.linearRampToValueAtTime(fadeGain(ev, age), t0 + age);
    }
    g.gain.linearRampToValueAtTime(fadeGain(ev, b), t0 + b);
    g.connect(dest);
    return { dest: g, ev: { ...ev, fade: null, vol: peakVol(ev) } };
  }

  /** 1 音ぶんの音源 + エンベロープを組み立てて鳴らす */
  _playVoice(ev, freq, amp, t0, t1, dest, nodes, tune = false) {
    const ctx = this.ctx;
    // フェードの途中の音。自分で音量を動かせる道(チップ・幅の表・段に寄せる音色)と、
    // 中身へ配り直す道(重ねた音色・焼く前の音色)は、ここでは掛けない
    if (ev.fade) {
      const w = WAVEFORMS[ev.wave] || {};
      const pass = w.kind === 'layer' || w.kind === 'ay'
        || w.kind === 'nes' || w.kind === 'fds' || w.kind === 'scc' || w.kind === 'pce'
        || CHIP_KINDS.has(w.kind)
        || (w.kind === 'baked' && !w.baked) || dutyMoves(w.tone)
        || ((ev.vsteps ?? w.vsteps) > 0 && !envOf(ev).table && !(w.tone && w.tone.vol));
      if (!pass) ({ dest, ev } = this._fadeDest(ev, t0, t1, dest));
    }
    // チップ(AY)で鳴らす音色。ブザーの `@g` と休んでいる拍の矩形波も
    // チップの中で作る
    const wfa = WAVEFORMS[ev.wave];
    // 1 周の形に、書いた音より低い音を含めた波形(octaveSaw)。そのぶん低く鳴らす
    if (wfa && wfa.kind === 'wave' && wfa.octave) freq *= Math.pow(2, wfa.octave);
    // いつも付いてくるチップ。音符を処理器へ渡す形に直すのはここ。
    // 分けて配る音源は自分の側で作る(`registerChipKind` の `event`)
    if (wfa && wfa.kind === 'ay') {
      this._wkPush('ay', dest, this._ayEvent(ev, wfa, freq, amp, t0, t1));
      return;
    }
    if (wfa && wfa.kind === 'nes') {
      this._wkPush('nes', dest, this._nesEvent(ev, wfa, freq, amp, t0, t1));
      return;
    }
    if (wfa && wfa.kind === 'fds') {
      this._wkPush('fds', dest, this._fdsEvent(ev, wfa, freq, amp, t0, t1));
      return;
    }
    if (wfa && wfa.kind === 'scc') {
      this._wkPush('scc', dest, this._sccEvent(ev, wfa, freq, amp, t0, t1));
      return;
    }
    if (wfa && wfa.kind === 'pce') {
      this._wkPush('pce', dest, this._pceEvent(ev, wfa, freq, amp, t0, t1));
      return;
    }
    // 4 オペと幅の表は節を作らない。常駐の処理器へ音符を渡す。
    // ここ 1 か所で横取りすると、デチューン・エコー・オクターブ重ねが
    // そのまま効く(どれも _playVoice を呼び直す作りなので)
    // 合成音色。重ねるものを、同じ位置へ順に鳴らす。
    // ここで横取りするので、デチューンもエコーもオクターブ重ねも
    // 重ねた全部に効く(どれも _playVoice を呼び直す作りなので)
    const wfl = WAVEFORMS[ev.wave];
    if (wfl && wfl.kind === 'layer') {
      // 曲が @e を書いたかどうか。書いていなければ、どの層も自分の形を着る。
      // 音符が持っているものと、この音色が持っているものが違えば「書いた」
      const own = wfl.defaultEnv ?? ENVELOPES.findIndex((x) => x.name === DEFAULT_ENV);
      const said = ev.env !== own;
      // 呼ぶときに渡したデチューン幅。いちばん広い層がこの幅になり、
      // ほかの層は同じ比で伸び縮みする(向きも、層ごとの差も残る)
      const dt = ev.vargs && ev.vargs.detune != null ? Number(ev.vargs.detune) : null;
      const scale = dt != null && wfl.detune > 0 ? dt / wfl.detune : 1;
      for (const m of wfl.layers) {
        const cents = m.cents * scale;
        const f = freq * Math.pow(2, (m.semi + cents / 100) / 12);
        // 従うと言った層だけが、曲の言い分を着る。
        // それ以外は自分の形(書いてあるものか、その音色が持っているもの)
        const mine = m.env != null ? m.env : ((WAVEFORMS[m.wave] || {}).defaultEnv ?? own);
        const e = (m.follow && said) ? ev.env : mine;
        // 遅らせるぶんは、頭もお尻も同じだけ動かす。
        // 長さを変えると、遅らせた音だけ形が変わってしまう
        const d = (m.delay || 0) * TONE_FRAME;
        // @gain は振幅に掛けず、節を挟んで掛ける。チップや波形を持たない音源は
        // 振幅を受け取らず `v` から大きさを決めるので、振幅に掛けると効かなかった
        // つまみの値は部品へ渡す。書いていないつまみは、この音色の既定
        const vargs = wfl.knobs ? { ...wfl.knobs, ...(ev.vargs || {}) } : ev.vargs;
        this._playVoice({ ...ev, wave: m.wave, env: e, ...(vargs ? { vargs } : {}) },
          f, amp, t0 + d, t1 + d, this._gainDest(dest, m.gain), nodes, tune);
      }
      return;
    }
    const wfp = WAVEFORMS[ev.wave];
    if (wfp && wfp.kind === 'baked') {
      if (wfp.baked) return this._playBaked(wfp, ev, freq, amp, t0, t1, dest, nodes);
      // まだ焼けていない。元の音色で鳴らしつつ、裏で焼き始める
      if (!wfp.baking) this.bakeVoice(wfp.name).catch(() => { /* 焼けなければ元のまま */ });
      const at = findWave(wfp.from);
      if (at >= 0) {
        return this._playVoice({ ...ev, wave: at }, freq, amp, t0, t1, dest, nodes, tune);
      }
      return;
    }
    // 外から加えた音源。音符を処理器へ渡す形に直すのは、その音源の側
    const wfx = WAVEFORMS[ev.wave];
    if (wfx && CHIP_KINDS.has(wfx.kind)) {
      // 出口を 2 本持つ音源は、定位の節を通さずに両側へ置く
      const to = WORKLETS[wfx.kind].buses === 2 ? this._panPair(dest) : dest;
      // 音符を作る関数は、エンジンそのものを `this` にして呼ぶ。音の形を出す手
      // (`_fadeSteps` など)を音源の側から引けるようにするため
      const one = CHIP_KINDS.get(wfx.kind).event.call(this, ev, wfx, freq, amp, t0, t1);
      // 渡さない音もある(タイでつながった続きは、先頭でまとめて渡してある)
      if (one) this._wkPush(wfx.kind, to, one);
      return;
    }
    const wf4 = WAVEFORMS[ev.wave];
    if (wf4 && dutyMoves(wf4.tone)) {
      // 幅の表。高さ・幅・音量をフレームごとの並びにして渡す。
      // 表を読むのはこちら側 — 決めごと(戻る位置・階段への丸め)を
      // 処理器へ写すと、片方だけ直したときに音が食い違う
      const len = Math.max(0.02, t1 - t0);
      const f = this._dutyFrames(wf4.tone, ev, freq, len, tune);
      // 余韻を後ろで鳴らすときは、離すまで伸ばして(hold)、延ばした終わりで 0 に着く
      const tail = Math.min(ev.relTail || 0, len - 0.01);
      const e = envOf(ev);
      let shape = (f.gv || e.table) ? null : envShape(e, len - tail);
      if (shape && tail > 0) shape = { ...shape, hold: len - tail };
      this._wkPush('duty', dest, {
        t: t0, dur: len, vol: amp, fr: f.fr, du: f.du,
        // 配列式のエンベロープは、そのまま 1 フレームずつの並びとして渡す
        // (処理器の側は `gv` をそう扱うので、道を増やさずに済む)
        gv: f.gv || envGains(e, len),
        // フェードの途中なら、1 フレームずつの掛け率を添える
        ...(ev.fade ? { fv: Float32Array.from(f.fr, (x, i) => fadeGain(ev, i * TONE_FRAME)) } : {}),
        env: shape,
      });
      return;
    }
    // 実機に寄せるときは、ここで階段へ丸める(重ねる音・エコーも同じ道を通る)
    if (tune) freq = psgSnap(freq, ev.wave);
    const g = ctx.createGain();
    // 0 から始める。節の初期値は 1 で、エンベロープが値を書き込むのは t0 から。
    // 音源の 1 サンプルめが t0 の automation より早く出ることがあり、
    // そこだけ音量が素通しになる。波形は 0 から立ち上がるので気づかないが、
    // ノイズと焼いた PCM は頭がいきなり満振幅なので、
    // ハイハット 1 打ごとに全振幅のプチッが乗っていた(実測 0.9999)
    g.gain.value = 0;
    g.connect(dest);
    const src = this._makeOscillator(ev, freq);
    // 音色が表を持っていれば、そちらが先。音量まで書いたらエンベロープは掛けない
    const byTone = this._applyTone(g, src, ev, freq, amp, t0, t1, tune);
    if (!byTone) this._applyEnvelope(g, ev, amp, t0, t1);

    // ポルタメント。鳴っているあいだに高さを動かす。
    //
    // 動かし方は指数。音程は対数の並びなので、こうしないと後半だけ急に
    // 上がって聞こえる。重ねる音もデチューンもエコーも同じ比で連れていく
    // (どれも _playVoice を呼び直すので、ここ 1 か所で効く)。
    //
    // 音色が自分でフレームごとに高さを書くもの(byTone)は、そちらが勝つので
    // ここでは何もしない。4 オペと幅の表と焼いた PCM も、まだ滑らない
    // (docs/TODO.md の 7 番)。
    if (ev.glide > 0 && !byTone && src.frequency) {
      const to0 = freq * (ev.glide / ev.freq);
      const to = tune ? psgSnap(to0, ev.wave) : to0;
      // 滑りはじめる時刻と、滑り終える時刻。書いていなければ音符いっぱい
      const from = t0 + (ev.glideAt > 0 ? ev.glideAt : 0);
      const till = ev.glideFor > 0 ? Math.min(t1, from + ev.glideFor) : t1;
      src.frequency.setValueAtTime(freq, t0);
      if (from > t0) src.frequency.setValueAtTime(freq, from);
      src.frequency.exponentialRampToValueAtTime(Math.max(1, to), Math.max(from + 0.001, till));
      if (src.__fm) {
        const fm = src.__fm;
        fm.mod.frequency.setValueAtTime(freq * fm.wf.ratio, t0);
        if (from > t0) fm.mod.frequency.setValueAtTime(freq * fm.wf.ratio, from);
        fm.mod.frequency.exponentialRampToValueAtTime(Math.max(1, to * fm.wf.ratio),
          Math.max(from + 0.001, till));
      }
    }

    // ビブラート(音程をゆらす)。ノイズには効かない。
    // `@m` を書いてあればそちらが勝ち、書かなければ音色の `vib`(2026-09-19)
    const tvib = ev.vib || (WAVEFORMS[ev.wave] || {}).tone?.vib;
    const vibDepth = tvib ? tvib.depth : ev.vibrato;
    if (vibDepth > 0 && src.frequency) {
      const lfo = ctx.createOscillator();
      const depth = ctx.createGain();
      lfo.frequency.value = tvib && tvib.speed != null ? tvib.speed : VIB_SPEED;
      // 深さはセント。上へ振れる幅を Hz にして、LFO の振れ幅にする
      const peak = freq * (Math.pow(2, vibDepth / 1200) - 1);
      if (tvib && tvib.delay > 0) {
        // 押した瞬間は真っ直ぐで、伸ばすと揺れ出す。チップチューンのリードの顔
        const at = t0 + tvib.delay * TONE_FRAME;
        depth.gain.setValueAtTime(0, t0);
        depth.gain.setValueAtTime(0, Math.min(at, t1));
        depth.gain.linearRampToValueAtTime(peak, Math.min(at + 0.08, t1));
      } else {
        depth.gain.value = peak;
      }
      lfo.connect(depth).connect(src.frequency);
      lfo.start(t0); lfo.stop(t1 + 0.02);
      lfo.__endTime = t1 + 0.02;
      nodes.push(lfo);
    }

    // FM: 変調の深さを時間で動かす。出だしだけ倍音を増やし、あとは減らす
    if (src.__fm) {
      const { mod, depth, wf, freq } = src.__fm;
      const peak = freq * wf.ratio * wf.depth;
      const keep = peak * wf.sustain;
      depth.gain.setValueAtTime(0, t0);
      depth.gain.linearRampToValueAtTime(peak, t0 + Math.min(wf.attack, (t1 - t0) * 0.5));
      depth.gain.exponentialRampToValueAtTime(Math.max(1, keep),
        Math.min(t1, t0 + wf.attack + wf.decay));
      // 音程が落ちる打楽器(バスドラムなど)。高いところから始めて、
      // すぐ本来の高さへ落とす。変調側も同じ比のまま連れていく
      if (wf.drop > 0 && !ev.glide) {
        const top = freq * (1 + wf.drop);
        const land = Math.min(t1, t0 + wf.dropTime);
        src.frequency.setValueAtTime(top, t0);
        src.frequency.exponentialRampToValueAtTime(freq, land);
        mod.frequency.setValueAtTime(top * wf.ratio, t0);
        mod.frequency.exponentialRampToValueAtTime(freq * wf.ratio, land);
      }
      mod.start(t0);
      mod.stop(t1 + 0.02);
      mod.__endTime = t1 + 0.02;
      nodes.push(mod);
    }

    // ビープ音源は節をいくつか使うので、本当の出口を取り直して
    // 一緒に鳴らすものを start/stop する(FM の mod と同じ扱い)
    let tail = src;
    if (src.__beep) {
      tail = src.__beep.out;
      for (const n of src.__beep.extras) {
        n.start(t0);
        n.stop(t1 + 0.02);
        n.__endTime = t1 + 0.02;
        nodes.push(n);
      }
    }

    // ビープ: 音量をかける手前で潰す。
    // 潰したあとに音量をかけるので、実機にはできなかった音量変化が効く。
    // 束ねてから潰すと 1 本の線を取り合う濁りが出るが、そのあとで
    // 声ごとの音量をかけ直せなくなるので、ここでは音量を取った
    if (ev.beep) {
      const ws = ctx.createWaveShaper();
      ws.curve = BEEP_CURVE;
      ws.oversample = 'none';
      tail.connect(ws);
      ws.connect(g);
    } else {
      tail.connect(g);
    }
    src.start(t0);
    src.stop(t1 + 0.02);
    src.__endTime = t1 + 0.02;
    src.onended = () => { try { g.disconnect(); } catch (e) { /* gone */ } };
    nodes.push(src);
  }

  /**
   * 1チャンネルぶんを、曲の途中(off 秒)から鳴らす。
   * off をまたいでいる音は、残りの長さだけ鳴らす(ポーズからの再開に使う)。
   * @param {number} off 曲の中の再開位置(秒)
   */
  _scheduleTrackFrom(track, when, dest, nodes, off) {
    const tune = this._tuneOn(track.ch);
    for (const ev of track.events) {
      const end = ev.t + Math.max(0.01, ev.gate);
      if (end <= off) continue;                 // もう鳴り終わっている音
      const start = Math.max(ev.t, off);        // またいでいる音は途中から
      const t0 = when + (start - off);
      // 余韻のぶんだけ後ろへ延ばす。離す時刻は `relTail` から戻して求める
      const tail = tailOf(ev, end - start);
      const t1 = when + (end - off) + tail;
      const amp = ampFor(ev);
      let e2 = tail > 0 ? { ...ev, relTail: tail } : ev;
      // 右ペダルの区間(曲の中の秒)を時計へ直すための起点
      if (ev.pedals) e2 = { ...e2, pedBase: when - off };
      this._playVoice(e2, ev.freq, amp, t0, t1, dest, nodes, tune);
      this._extraVoices(e2, track.ch, amp, t0, t1, dest, nodes, tune);
    }
  }

  /** 1チャンネルぶんのイベントを Web Audio ノードとしてスケジュールする */
  _scheduleTrack(track, when, dest, nodes, from = -Infinity, to = Infinity, again = false) {
    const tune = this._tuneOn(track.ch);
    for (let ev of track.events) {
      // 先読み予約: 曲の中の時刻が [from, to) のイベントだけを積む
      if (ev.t < from || ev.t >= to) continue;
      // 2 周目から先。フェードで下げたまま戻ってきた音は、その音量で鳴らす
      if (again && ev.loopVol !== undefined) ev = { ...ev, vol: ev.loopVol, fade: ev.loopFade };
      // 止めてある層は積まない。チャンネルの音量つまみでは 1 本ぜんぶが
      // 消えるので、中の 1 つだけを止めるにはここで外すしかない
      if (ev.lane && this._laneMute.has(`${track.ch}/${ev.lane}`)) continue;
      const t0 = when + ev.t;
      // 余韻のぶんだけ後ろへ延ばす。離す時刻は `relTail` から戻して求める
      const tail = tailOf(ev, Math.max(0.01, ev.gate));
      const t1 = t0 + Math.max(0.01, ev.gate) + tail;
      const amp = ampFor(ev);
      if (tail > 0) ev = { ...ev, relTail: tail };
      // 右ペダルの区間(曲の中の秒)を時計へ直すための起点
      if (ev.pedals) ev = { ...ev, pedBase: when };
      // 重ねる音も同じ位置へ。オクターブ重ねもデチューンもエコーも、
      // 元の音を厚くするためのものなので、別の場所から鳴っては困る
      const d = this._panFor(dest, ev.pos);
      // 1 音は 1 声。音程をずらすのは高さに入っているし、
      // エコーはコンパイルのときに音符として置いてある(2026-09-16)
      this._playVoice(ev, ev.freq, amp, t0, t1, d, nodes, tune);
      this._extraVoices(ev, track.ch, amp, t0, t1, d, nodes, tune);
    }
  }
  /** 終わった SE を片づける */
  _cleanupSE(now) {
    this.seVoices = this.seVoices.filter((v) => {
      if (now < v.endTime) return true;
      // くり返しの途中なら、まだ片づけない
      if (v.left !== 0 && v.timer) return true;
      // ポーズ中のものは、解除で鳴り直すので残す。
      // 仕掛けの音はポーズ中でも鳴り切るので、ふつうに片づける
      if (!v.system && (v.paused || this._sePausedAll)) return true;
      if (v.timer) { clearTimeout(v.timer); v.timer = 0; }
      try { v.gain.disconnect(); } catch (e) { /* already gone */ }
      return false;
    });
  }

  /** いま使っている音の数 */
  _usedVoices() {
    return this.bgmVoices + this.seVoices.reduce((n, v) => n + v.voices, 0);
  }

  /** 1 つの SE を止める */
  _stopVoice(v, fade = 0) {
    if (v.timer) { clearTimeout(v.timer); v.timer = 0; }
    v.left = 0;   // くり返しの予約が残っていても、もう積まない
    // 一覧からは先に外す。消えるのを待つあいだ、席が埋まったままになるのを
    // 避けるため(次の音がすぐ来る)
    this.seVoices = this.seVoices.filter(x => x !== v);
    if (fade > 0 && this.ctx) {
      // 音量を下げきってから止める。途中で切るとプツッと鳴る
      const now = this.ctx.currentTime;
      try {
        v.gain.gain.cancelScheduledValues(now);
        v.gain.gain.setValueAtTime(v.gain.gain.value, now);
        v.gain.gain.linearRampToValueAtTime(0, now + fade);
      } catch (e) { /* 掛けられなければそのまま切る */ }
      for (const n of v.nodes) { try { n.stop(now + fade); } catch (e) { /* stopped */ } }
      setTimeout(() => { try { v.gain.disconnect(); } catch (e) { /* already gone */ } },
        (fade + 0.05) * 1000);
      return;
    }
    for (const n of v.nodes) { try { n.stop(0); } catch (e) { /* stopped */ } }
    try { v.gain.disconnect(); } catch (e) { /* already gone */ }
  }

  /**
   * 音の出口。すべての音はここを通すので、
   * ここ 1 つで全体を消したり戻したりできる
   */
  _out() {
    if (!this.ctx) return null;
    if (!this._bus) {
      // 出口は 2 段。手前(bus)で溜めて、後ろ(master)で消す。
      // こうしておくと、音を切って遊んでいた人でも
      // 残した音には ちゃんと鳴っていたものが入る
      this._master = this.ctx.createGain();
      this._master.gain.value = this._outGain();
      this._master.connect(this.ctx.destination);
      // モノラルなら、ここで 1 本に畳む。リバーブやコーラスは左右で別の音を出すので、
      // 畳まないと出口が 2 本ある機械ではステレオに聞こえてしまう(2026-10-17)
      if (this._spatialMode() === 'mono') {
        this._master.channelCount = 1;
        this._master.channelCountMode = 'explicit';
        this._master.channelInterpretation = 'speakers';
      }
      this._bus = this.ctx.createGain();
      this._bus.gain.value = 1;
      // 溜める段と消す段のあいだに、全体のエフェクトを挟む。
      // エフェクトを通ったあとの段(post)から録る。聞いた音と録った音を揃えるため
      this._post = this.ctx.createGain();
      this._post.connect(this._master);
      this._fxWire();
      // 溜める指示が先に来ていたら、ここで始める
      if (this._keepSec > 0) this._startTap(this._keepSec);
    }
    return this._bus;
  }

  /**
   * 全体に掛けるエフェクトを決める。曲の出口の手前に、並べた順に通す。
   * 鳴らすときと書き出し(`renderBGM`)の両方に効く。
   *
   * 種類はフィルタ(`lowpass` `highpass` `ladder` `bandpass` `notch` `highpass4`)と、
   * `sound/fx.js` の `MASTER_FX`(`echo` `reverb` `loudness` `compressor` `limiter`
   * `saturate` `crush` `wavestep`)。何を渡せるかは `describeMasterEffects()` が返す。
   * 空の並びを渡すと外れる。
   *
   *     await audio.setMasterEffects([
   *       { kind: 'highpass', cutoff: 80 },
   *       { kind: 'echo', time: 0.25, feedback: 0.4, mix: 0.3 },
   *       { kind: 'reverb', time: 1.5, mix: 0.2 },
   *     ]);
   *
   * echo の間隔は `time`(秒)の代わりに音長 `l` でも渡せる(`l: '8.'` は付点 8 分)。
   * いま鳴っている曲のテンポで秒に直し、曲を替えるたびにその曲のテンポで直し直す。
   * 曲の途中でテンポが変わっても、そこにはついてこない。
   * 曲を鳴らす前に渡したときは 120 で直しておき、曲が始まったときに直す
   *
   * 掛け直すと、エコーとリバーブの響きはそこで切れる。
   * 仕上げの設定の名前(`'loud'` `'gentle'` `'safe'`)も渡せる。
   * 中身は `describeMasterPresets()` が返す
   * @param {object[]|string} list `{kind, ...値}` の並び。書いていない値は既定になる
   * @returns {Promise<object[]>} 値を埋めたあとの並び
   */
  async setMasterEffects(list) {
    // 名前なら仕上げの設定(MASTER_PRESETS)の並びにする
    if (typeof list === 'string') {
      const pre = MASTER_PRESETS[list];
      if (!pre) {
        throw new Error(`master effects: unknown preset "${list}" (${Object.keys(MASTER_PRESETS).join(' / ')})`);
      }
      list = pre.fx;
    }
    // 曲の `#fx` とは別に持つ。曲を替えても残り、曲のぶんのあとに通る。
    // 音長(`l`)はいま鳴っている曲のテンポで直し、曲を替えたら直し直す
    const now = this.bgmState ? this.bgmDefs.get(this.bgmState.name) : null;
    this._fx = normalizeFx(list, FILTERS, songTempo(now));
    this._fxSrc = list.map((fx) => ({ ...fx }));
    if (this.ctx) {
      for (const kind of this._fxKinds()) {
        await this._wkLoad(kind).catch(() => { /* 読めなければ、その段は飛ばす */ });
      }
      if (this._bus) this._fxWire();
    }
    return this.masterEffects();
  }

  /**
   * 全体のエフェクトの値を、つなぎ直さずに動かす。
   *
   * `setMasterEffects()` は並びを丸ごと作り直すので、エコーとリバーブの響きが
   * そこで切れる。値だけを動かしたいときはこちらを呼ぶ。
   *
   *     audio.tweakMasterEffects({ reverb: { mix: 0.6 } }, { fade: 0.4 });
   *     audio.tweakMasterEffects({ echo: { feedback: 0.7, mix: 0 } });
   *
   * 動かせるのは `live: true` のパラメータだけ(`describeMasterEffects()` が返す)。
   * いまのところ、フィルタの `cutoff` `resonance` `drive`、echo の
   * `time` `feedback` `mix` `tone`、reverb の `mix`。
   * チャンネルに置いたぶん(`@f`)は MML を書き替えて動かす。
   * 動かせないものを渡すと止める。黙って捨てると「書いたのに効かない」になる。
   *
   * `fade` は秒で、既定は 0(その場で切り替わる)。`mix` を 0 と 1 のあいだで
   * 動かすようなときは、少し掛けないとプツッと鳴る。
   * echo の `time` は `fade` を無視してその場で切り替わる。読む位置が飛ぶものなので、
   * 途中の値は別の遅れになってしまう。
   *
   * 同じ種類を 2 台並べているときは、どちらにも同じ値が入る。
   * 1 台ずつ動かす書き方は作っていない。
   *
   * 曲の `#fx` の段も動く。通す順の並びは曲のぶんが先なので、
   * 同じ種類が曲と鳴らす側の両方にあれば、やはり両方に入る。
   * @param {Object<string, object>} values 種類ごとの値。`{ echo: { mix: 0.5 } }`
   * @param {{fade?:number}} [opts] `fade` は寄せる秒数(既定 0)
   * @returns {number} 動かした段の数。0 ならその種類が並びに無い
   */
  tweakMasterEffects(values, opts = {}) {
    if (!values || typeof values !== 'object') {
      throw new Error('tweakMasterEffects: pass an object of {kind: {param: value}}');
    }
    const fade = Number(opts.fade) > 0 ? Number(opts.fade) : 0;
    const defs = { ...FILTERS, ...MASTER_FX };
    // 先に全部見る。1 つでも書き間違いがあれば、何も動かさずに止める
    for (const [kind, set] of Object.entries(values)) {
      const def = defs[kind];
      if (!def) throw new Error(`tweakMasterEffects: unknown kind "${kind}"`);
      if (!set || typeof set !== 'object') {
        throw new Error(`tweakMasterEffects: "${kind}" needs an object of values`);
      }
      for (const name of Object.keys(set)) {
        const p = def.params[name];
        if (!p) throw new Error(`tweakMasterEffects: "${kind}" has no "${name}"`);
        if (!p.live) {
          throw new Error(`tweakMasterEffects: "${kind}.${name}" cannot move once it is made`
            + ' (see live in describeMasterEffects())');
        }
        if (!Number.isFinite(Number(set[name]))) {
          throw new Error(`tweakMasterEffects: "${kind}.${name}" needs a number`);
        }
      }
    }
    /** 範囲へ収める。渡し直されたときに、覚えているほうと節が食い違わないように */
    const fit = (kind, name, v) => {
      const p = defs[kind].params[name];
      return Math.min(p.max, Math.max(p.min, Number(v)));
    };
    // 覚えているほうも直す。つなぎ直したときに、動かしたあとの値で作る
    for (const [kind, set] of Object.entries(values)) {
      for (const list of [this._fx, this._fxSrc, this._songFx]) {
        for (const fx of list) {
          if (fx.kind !== kind) continue;
          for (const [name, v] of Object.entries(set)) fx[name] = fit(kind, name, v);
          // 音長で渡してあったものは、秒を書いたので札を外す
          if (set.time != null) delete fx.l;
        }
      }
    }
    if (!this.ctx) return 0;                 // まだ鳴らしていなければ覚えるだけ
    const at = this.ctx.currentTime;
    let moved = 0;
    for (const seg of this._fxLive || []) {
      const set = values[seg.kind];
      if (!set) continue;
      const clamped = {};
      for (const [name, v] of Object.entries(set)) clamped[name] = fit(seg.kind, name, v);
      for (const [name, v] of Object.entries(clamped)) {
        const target = (seg.params && seg.params[name]) || (seg.gains && seg.gains[name]);
        if (!target) continue;
        // 寄せている途中で呼び直されたら、そこで打ち切って新しい行き先へ向かう
        target.cancelScheduledValues(at);
        if (fade > 0) {
          target.setValueAtTime(target.value, at);
          target.linearRampToValueAtTime(v, at + fade);
        } else {
          // setValueAtTime ではなく value に入れる。次のブロックを待たずに効き、
          // 読み返したときも入れた値が返る
          target.value = v;
        }
      }
      moved++;
    }
    return moved;
  }

  /**
   * `setMasterEffects()` で掛けたエフェクト(値は埋めてある)。
   * 曲の `#fx` は入らない。あちらは曲を替えると入れ替わる
   */
  masterEffects() {
    return this._fx.map((fx) => ({ ...fx }));
  }

  /**
   * 全体に掛けられるエフェクトの一覧。種類ごとに説明(desc)と、
   * 値の範囲・既定・説明(params)と、絞り込みの語(tags)と、開発の状態(dev)を持つ。
   * dev の語は音色と同じ(`DEV_MARKS`。`wip` は作業中で、まだ手を入れる)
   * @returns {Object<string,{desc:string,params:object,tags:string[],dev:string[]}>}
   */
  describeMasterEffects() {
    const out = {};
    for (const [kind, def] of Object.entries({ ...FILTERS, ...MASTER_FX })) {
      out[kind] = {
        desc: def.desc, params: JSON.parse(JSON.stringify(def.params)),
        tags: [...(def.tags || [])], dev: [...(def.dev || [])],
      };
    }
    return out;
  }

  /**
   * 仕上げの設定の一覧。名前ごとに説明(desc)と、エフェクトの並び(fx)を持つ。
   * `setMasterEffects(名前)` と MML の `#master 名前` で使う
   * @returns {Object<string,{desc:string,fx:object[]}>}
   */
  describeMasterPresets() {
    return JSON.parse(JSON.stringify(MASTER_PRESETS));
  }

  /**
   * 効果音が鳴っているあいだ、BGM を下げる(ダッキング)。ゲームで使うもので、
   * 曲の仕上げではない。ジングルも BGM として下がる。
   * `playSE(name, p, { duck: false })` で鳴らした効果音では下げない。
   *
   *     audio.setDucking({ depth: 9 });   // 効果音のあいだ 9dB 下げる
   *     audio.setDucking({ depth: 0 });   // やめる
   *
   * 何を渡せるかは `describeDucking()` が返す
   * @param {{depth?:number, attack?:number, release?:number}} opts
   * @returns {{depth:number, attack:number, release:number}} 値を埋めたあと
   */
  setDucking(opts = {}) {
    const { kind, ...d } = normalizeDucking(opts);
    this._duck = d;
    return this.ducking();
  }

  /** いまのダッキングの値 */
  ducking() {
    const { kind, ...d } = this._duck || normalizeDucking();
    return { ...d };
  }

  /** ダッキングの説明と、値の範囲・既定・説明 */
  describeDucking() {
    return JSON.parse(JSON.stringify(DUCKING));
  }

  /**
   * BGM の出口。ダッキングで下げるのはここ。効果音は通らない
   * @private
   */
  _bgmOut() {
    const out = this._out();
    if (!this._duckNode || this._duckNode.context !== this.ctx) {
      this._duckNode = this.ctx.createGain();
      this._duckNode.connect(out);
      this._duckEnd = 0;
    }
    return this._duckNode;
  }

  /**
   * 効果音が [t0, t1) で鳴るあいだ、BGM を下げる。重なった効果音は、
   * いちばん遅く終わるものまで下げたままにする
   * @private
   */
  _duckFor(t0, t1) {
    const d = this._duck;
    if (!d || !(d.depth > 0) || !this._duckNode || this._duckNode.context !== this.ctx) return;
    const g = this._duckNode.gain;
    const low = Math.pow(10, -d.depth / 20);
    this._duckEnd = Math.max(this._duckEnd || 0, t1);
    g.cancelScheduledValues(t0);
    g.setTargetAtTime(low, t0, d.attack / 3);
    g.setTargetAtTime(1, this._duckEnd, d.release / 3);
  }

  /**
   * 曲の `#fx` を、曲のぶんの並びにする。書いていない曲なら空にする。
   *
   * `setMasterEffects()` で掛けたものは触らない。あちらは曲ではなく
   * その場の鳴らし方で、曲のぶんのあとに重ねて通す
   *
   * @param {object[]} tracks
   * @private
   */
  _applySongFx(tracks) {
    const list = songFx(tracks) || [];
    const relen = fxHasLength(this._fxSrc);
    if (!list.length && !this._songFx.length && !relen) return;
    this._songFx = list;
    // 音長で渡されたものは、この曲のテンポで直し直す
    if (relen) this._fx = this._fxFor(tracks);
    if (this._bus) this._fxWire();
  }

  /**
   * `setMasterEffects()` のぶんを、その曲で鳴らすときの値にする。
   * 音長(`l`)で渡したものだけ、曲のテンポで秒に直す
   * @param {object[]} tracks
   * @private
   */
  _fxFor(tracks) {
    if (!fxHasLength(this._fxSrc)) return this._fx;
    return normalizeFx(this._fxSrc, FILTERS, songTempo(tracks));
  }

  /** 通す順の並び。曲の `#fx` が先、鳴らす側のものがあと @private */
  _fxAll() {
    return [...this._songFx, ...this._fx];
  }

  /** 全体のエフェクトが使う処理器の種類 @private */
  _fxKinds() {
    const need = new Set();
    for (const fx of this._fxAll()) {
      const w = fxWorklet(fx.kind);
      if (w) need.add(w);
    }
    return need;
  }

  /**
   * 溜める段(`_bus`)からエフェクトのあとの段(`_post`)までを、エフェクトの並びで
   * つなぎ直す。前の節は外して止める。止めないと処理器が動き続ける(sound/filter.js)
   * @private
   */
  _fxWire() {
    for (const n of this._fxNodes) {
      try { n.disconnect(); } catch (e) { /* 外れている */ }
      if (n.port) n.port.postMessage({ stop: true });
    }
    this._fxNodes = [];
    // 外すのは前につないだ先だけ。ほかの何かが溜める段につないでいても残す
    if (this._fxHead) {
      try { this._bus.disconnect(this._fxHead); } catch (e) { /* 外れている */ }
    }
    this._fxHead = null;
    this._fxLoud = [];
    this._fxLive = [];
    const chain = this._fxChain(this._fxAll());
    if (chain) {
      this._bus.connect(chain.head);
      this._fxHead = chain.head;
      this._fxNodes = chain.nodes;
      this._fxLoud = chain.loud;
      this._fxLive = chain.live;
      chain.tail.connect(this._post);
    } else {
      this._bus.connect(this._post);
      this._fxHead = this._post;
    }
  }

  /**
   * 音を消す / 戻す。曲は止めずに出口を閉じるだけなので、
   * 戻したときは曲の続きがそのまま聞こえてくる。
   * @param {boolean} [on] 省略すると切り替え
   * @returns {boolean} いま消えているか
   */
  mute(on) {
    this._muted = (on === undefined) ? !this._muted : !!on;
    this._out();                 // 出口を用意させる
    const out = this._master;    // 絞るのは後ろの段(溜めるほうは絞らない)
    if (out) {
      const t = this.ctx.currentTime;
      out.gain.cancelScheduledValues(t);
      // ぷつっと切れないよう、ごく短く滑らせる
      out.gain.setValueAtTime(out.gain.value, t);
      out.gain.linearRampToValueAtTime(this._outGain(), t + 0.05);
    }
    return this._muted;
  }

  /**
   * 音の大きさ(0〜8、既定 1)。曲も効果音もまとめて動く。
   * 1 を越えると持ち上がる — 声の少ない曲は既定では小さい。
   * 上げすぎると歪むので、耳で決める。
   * 消すのは `mute()` の役目で、こちらは大きさだけを決める。
   * 溜めるほうは絞らないので、残した音は鳴っていたとおりに残る
   */
  /**
   * いま回っている周を最後にして、終わりへ向かわせる。
   *
   * 周回数を決め直すのではない。長さを変えずに、次の周へ入らないようにする
   * だけ。いまの周は鳴らし終えるので、いきなり切れることはない。
   * `#label OUTRO` を書いた曲なら、抜ける道として後奏を通る。
   *
   * 鳴っていなければ何もしない。
   *
   * @returns {boolean} 向かわせたら true
   */
  goToEnding() {
    if (!this.bgmState) return false;
    // 周回数のほうは触らない。触ると、止めたあとも 0 のまま残って、
    // 次に鳴らしたとき 1 周で終わる曲になってしまう(2026-09-15)
    this.bgmState.leaving = true;
    return true;
  }

  /**
   * 出口に入れる数。掛け算を 1 か所にまとめてある。
   *
   * 聴く人のつまみ(`volume`)と、曲が名乗る大きさ(`#gain`)は別のもので、
   * 出口ではどちらも掛かる。3 か所(出口を作る・消す・つまみを回す)で
   * 別々に書くと、片方だけ直したときに音が食い違う。
   * @returns {number}
   * @private
   */
  _outGain() { return this._muted ? 0 : this.volume * this._songGain; }

  get volume() { return this._vol == null ? 1 : this._vol; }

  set volume(v) {
    // 1 を越えてよい。出口には MASTER_VOL(0.14)ぶんの余裕が取ってある。
    // 声をたくさん重ねる曲では要る余裕だが、2〜3 声の曲では小さすぎる。
    // 既定は 1 のままなので、何も指定しなければこれまでと同じ音量。
    this._vol = Math.max(0, Math.min(8, Number(v) || 0));
    if (this._master && !this._muted) {
      const t = this.ctx.currentTime;
      this._master.gain.cancelScheduledValues(t);
      this._master.gain.setValueAtTime(this._master.gain.value, t);
      this._master.gain.linearRampToValueAtTime(this._outGain(), t + 0.05);
    }
    this._loudUpdate();
  }

  /**
   * ラウドネス補正(`loudness`)の量を、いまの音量に合わせ直す。
   * 全体のものと、鳴っている曲のチャンネルのもの
   * @private
   */
  _loudUpdate() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const all = [...(this._fxLoud || [])];
    const st = this.bgmState;
    for (const c of (st && st.chFilters) || []) if (c && c.loud) all.push(...c.loud);
    for (const { fx, lo, hi } of all) {
      const g = loudnessGains(this.volume, fx);
      lo.gain.setTargetAtTime(g.bass, t, 0.02);
      hi.gain.setTargetAtTime(g.treble, t, 0.02);
    }
  }

  /** いま音を消しているか */
  get muted() { return !!this._muted; }

}

/**
 * 音を WAV(RIFF / 16 ビット PCM)のバイト列にする。
 *
 * 計算するだけなので Web Audio は要らない。`renderBGM()` が返すものをそのまま渡せるし、
 * `{sampleRate, numberOfChannels, length, getChannelData(i)}` を持つものなら何でもよい。
 * おかげでブラウザ抜きで試せる。
 *
 * 16 ビットへ落とすとき負の側だけ 32768 倍するのは、-1 をちょうど -32768 に
 * 当てるため。両側を 32767 倍すると、いちばん深いところがわずかに浅くなる。
 *
 * @param {{sampleRate:number, numberOfChannels:number, length:number,
 *          getChannelData:(i:number)=>Float32Array}} buffer
 * @returns {Uint8Array} .wav の中身(44 バイトの見出し + 音のデータ)
 */
export function encodeWAV(buffer) {
  const ch = buffer.numberOfChannels;
  const frames = buffer.length;
  const rate = buffer.sampleRate;
  const bytes = 2;                        // 16 ビット
  const dataSize = frames * ch * bytes;
  const out = new Uint8Array(44 + dataSize);
  const view = new DataView(out.buffer);
  let p = 0;
  const str = (t) => { for (const c of t) out[p++] = c.charCodeAt(0); };
  const u32 = (v) => { view.setUint32(p, v, true); p += 4; };
  const u16 = (v) => { view.setUint16(p, v, true); p += 2; };

  str('RIFF'); u32(36 + dataSize); str('WAVE');
  str('fmt '); u32(16); u16(1); u16(ch);
  u32(rate); u32(rate * ch * bytes); u16(ch * bytes); u16(8 * bytes);
  str('data'); u32(dataSize);

  const src = [];
  for (let c = 0; c < ch; c++) src.push(buffer.getChannelData(c));
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < ch; c++) {
      const v = Math.max(-1, Math.min(1, src[c][i]));
      view.setInt16(p, Math.round(v < 0 ? v * 0x8000 : v * 0x7fff), true);
      p += 2;
    }
  }
  return out;
}
