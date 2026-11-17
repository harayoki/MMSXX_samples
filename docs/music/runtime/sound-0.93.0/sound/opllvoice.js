// OPLL(YM2413)のユーザー音色。自分で作る 1 つぶん。
//
// ---- 何ができるか ----
//
// OPLL の音色は 15 個の固定表しかないが、0 番だけは自分で書ける。
// レジスタ 0x00〜0x07 の 8 バイトで、2 つのオペレータの形が決まる。
//
// ---- 8 バイトは外に出さない ----
//
// **書く人はバイトを見ない。**名前の付いた値で書いて、こちらが 8 バイトへ畳む。
// 実機の呼び名(`mul` `tl` `ar`)と、日常の言葉(`ratio` `depth` `attack`)の
// 両方を受ける。前者は実機の資料や `.opm` と突き合わせるとき、後者は
// 初めて触るときのため。バイトを直に渡す道(`bytes`)も残してある —
// よそから写してくるときに要る(2026-09-28)。
//
// ---- 同時に 2 つ以上 ----
//
// レジスタは 1 組しかないので、実機では同時に 1 種類しか持てない。
// **こちらは止めない。**要るときに書き直す(実機のドライバもそうする)。
// 書き直すと、そのとき鳴っているユーザー音色の音が変わる。実機でも同じことが
// 起きるので、そのまま出す。書く人が承知で使う。
//
// ---- 2 つのオペレータ ----
//
// 変調側(`mod`)が出した波で、キャリア側(`car`)の位相を揺らす。
// 出てくる音はキャリアの側。変調側の強さ(`tl` / `depth`)で倍音の量が決まり、
// キャリア側の音量は音量レジスタ(MML の `v`)が持つ。

/** オペレータ 1 つぶんのパラメータ。名前は実機の呼び名 */
import { registerVoice, registerVoiceSyntax, registerDrumSlots, badVoice as bad,
         voiceNums, splitParts } from './mml.js';
import { OPLL_SETS, OPLL_DRUM_TABLE } from './opll.js';

const OP_FIELDS = {
  mul: { at: 'ml', max: 15,
    desc: 'Frequency multiple, 0 to 15. 0 means half. 1 is the written pitch, '
      + '2 is an octave up. On the modulator this sets which harmonic it adds.' },
  ksr: { at: 'kr', max: 1,
    desc: 'Key scale rate, 0 or 1. With 1 the envelope runs faster for higher notes, '
      + 'the way a real instrument decays faster up top.' },
  hold: { at: 'eg', max: 1,
    desc: 'Sustaining, 0 or 1. With 1 the note holds while the key is down. '
      + 'With 0 it keeps falling away, like a plucked or struck instrument.' },
  vibrato: { at: 'pm', max: 1,
    desc: 'Pitch wobble, 0 or 1. The chip has one fixed depth and speed.' },
  tremolo: { at: 'am', max: 1,
    desc: 'Volume wobble, 0 or 1. The chip has one fixed depth and speed.' },
  ksl: { at: 'kl', max: 3,
    desc: 'Key scale level, 0 to 3. How much quieter the higher notes get. '
      + '0 keeps every octave at the same level.' },
  tl: { at: 'tl', max: 63, modOnly: true,
    desc: 'Total level of the modulator, 0 to 63, in steps of 0.75dB. '
      + '0 is the strongest. Larger numbers mean fewer harmonics, a rounder sound. '
      + 'The carrier has no total level: its loudness is the volume register (v in MML).' },
  wave: { at: 'ws', max: 1,
    desc: 'Waveform, 0 or 1. 0 is a sine. 1 is a half sine, with the lower half '
      + 'cut off, which is thinner and has more harmonics.' },
  fb: { at: 'fb', max: 7, modOnly: true,
    desc: 'Feedback of the modulator into itself, 0 to 7. 0 is none. Larger numbers '
      + 'add harmonics and, at the top, break into noise. Only the modulator has it.' },
  ar: { at: 'ar', max: 15,
    desc: 'Attack rate, 0 to 15. How fast it rises. 15 is instant, 0 never starts.' },
  dr: { at: 'dr', max: 15,
    desc: 'Decay rate, 0 to 15. How fast it falls to the sustain level after the attack.' },
  sl: { at: 'sl', max: 15,
    desc: 'Sustain level, 0 to 15, in steps of 3dB. 0 is full, 15 is nearly silent. '
      + 'Where the decay stops.' },
  rr: { at: 'rr', max: 15,
    desc: 'Release rate, 0 to 15. How fast it falls once the key is let go.' },
};

/** 日常の言葉から、実機の呼び名へ。書く人はどちらで書いてもよい */
const ALIASES = {
  ratio: 'mul', harmonic: 'mul',
  depth: 'tl', level: 'tl',
  attack: 'ar', decay: 'dr', sustain: 'sl', release: 'rr',
  feedback: 'fb',
  scale: 'ksl', scaleRate: 'ksr',
  sustaining: 'hold',
  half: 'wave',
};

/** その名前が実機の呼び名かどうか。日常の言葉なら直す */
function fieldOf(key, where) {
  const name = ALIASES[key] ?? key;
  const f = OP_FIELDS[name];
  if (!f) {
    const all = [...Object.keys(OP_FIELDS), ...Object.keys(ALIASES)].sort().join(' ');
    throw new Error(`[ChpTnSnd] OPLL のユーザー音色: ${where} に "${key}" は書けません`
      + `(書けるもの: ${all})`);
  }
  return [name, f];
}

/** 0 か 1 で書くところは、true / false でも書ける */
function numOf(v, f, key, where) {
  const n = (v === true) ? f.max : (v === false) ? 0 : Number(v);
  if (!Number.isFinite(n) || n < 0 || n > f.max || n !== Math.floor(n)) {
    throw new Error(`[ChpTnSnd] OPLL のユーザー音色: ${where} の "${key}" は`
      + ` 0〜${f.max} の整数です(${v} と書いてあります)`);
  }
  return n;
}

/** オペレータ 1 つぶんを読む。実機の呼び名に揃えた形で返す */
function readOp(src, where, isMod) {
  const out = { ml: 0, kr: 0, eg: 0, pm: 0, am: 0, kl: 0, tl: 0, ws: 0, fb: 0,
    ar: 0, dr: 0, sl: 0, rr: 0 };
  for (const [key, v] of Object.entries(src || {})) {
    const [name, f] = fieldOf(key, where);
    if (f.modOnly && !isMod) {
      throw new Error(`[ChpTnSnd] OPLL のユーザー音色: "${key}" は変調側(mod)にだけ書けます`
        + (name === 'tl'
          ? '。キャリア側の音量は MML の v です'
          : '。実機のキャリア側には無いパラメータです'));
    }
    out[f.at] = numOf(v, f, key, where);
  }
  return out;
}

/** 読んだ 2 つのオペレータを、実機の 8 バイトへ畳む */
function toBytes(m, c) {
  return [
    (m.am << 7) | (m.pm << 6) | (m.eg << 5) | (m.kr << 4) | m.ml,
    (c.am << 7) | (c.pm << 6) | (c.eg << 5) | (c.kr << 4) | c.ml,
    (m.kl << 6) | m.tl,
    (c.kl << 6) | (c.ws << 4) | (m.ws << 3) | m.fb,
    (m.ar << 4) | m.dr,
    (c.ar << 4) | c.dr,
    (m.sl << 4) | m.rr,
    (c.sl << 4) | c.rr,
  ];
}

/**
 * ユーザー音色の指定を、実機の 8 バイトにする。
 *
 * ```js
 * opllVoice({
 *   mod: { ratio: 2, depth: 29, attack: 15, decay: 2, sustain: 1, release: 7, hold: true },
 *   car: { ratio: 1, attack: 8, decay: 1, sustain: 0, release: 7, hold: true },
 *   feedback: 5,
 * });
 * ```
 *
 * `mod` が変調側、`car` がキャリア側。名前は実機の呼び名(`mul` `tl` `ar`)でも、
 * 日常の言葉(`ratio` `depth` `attack`)でもよい。`feedback` は外側にも書ける。
 *
 * `bytes` に 8 個の数を渡せば、そのまま使う。よそから写してくるときに要る。
 *
 * @param {{mod?:object, car?:object, feedback?:number, bytes?:number[]}} spec
 * @returns {number[]} 8 バイト(レジスタ 0x00〜0x07 に書くもの)
 */
export function opllVoice(spec = {}) {
  if (spec.bytes) {
    const b = [...spec.bytes];
    if (b.length !== 8 || b.some((x) => !Number.isInteger(x) || x < 0 || x > 255)) {
      throw new Error('[ChpTnSnd] OPLL のユーザー音色: bytes は 0〜255 の数 8 個です');
    }
    return b;
  }
  const m = readOp(spec.mod, 'mod', true);
  const c = readOp(spec.car, 'car', false);
  // フィードバックは変調側のものだが、音色ぜんぶに効くので外側にも書ける
  if (spec.feedback !== undefined) {
    m.fb = numOf(spec.feedback, OP_FIELDS.fb, 'feedback', 'この音色');
  }
  return toBytes(m, c);
}

/**
 * ユーザー音色に書けるものを返す。名前から見当をつけさせないため。
 *
 * 返すのは、オペレータごとのパラメータと、それぞれの意味と取れる値。
 * 日常の言葉での呼び名も並べてある。
 *
 * @returns {{mod:object, car:object, aliases:object, desc:string}}
 */
export function describeOpllVoice() {
  const back = {};
  for (const [from, to] of Object.entries(ALIASES)) (back[to] ||= []).push(from);
  const side = (isMod) => {
    const out = {};
    for (const [name, f] of Object.entries(OP_FIELDS)) {
      if (f.modOnly && !isMod) continue;
      out[name] = { min: 0, max: f.max, desc: f.desc,
        ...(back[name] ? { alsoCalled: back[name] } : {}) };
    }
    return out;
  };
  return {
    mod: side(true),
    car: side(false),
    aliases: { ...ALIASES },
    desc: 'The one user-definable voice of the YM2413. mod is the modulator, '
      + 'car is the carrier you hear. Every field takes a whole number from 0 to max; '
      + 'the ones whose max is 1 also take true and false. Names under alsoCalled '
      + 'mean the same thing. The chip holds one user voice at a time, so playing two '
      + 'of them rewrites the registers, and a user-voice note already sounding changes '
      + 'with it. Pass bytes instead to give the eight register values directly.',
  };
}

// ---- 声の取り合いの目安を、8 バイトから割り出す ----
//
// チャンネルが足りないとき、FM は途中から続けられないので鳴らし直しになる
// (→ docs/TODO.md の「チャンネルの圧縮」)。鳴らし直しが聞こえるかは
// 2 つで決まる —
//
// - **EG タイプ。**1 なら持続音で、戻ったときに同じ音量のところへ戻る。
//   0(減衰音)は、鳴らし直すと二度叩いたように聞こえる
// - **立ち上がりの速さ。**持続音でも、頭に時間がかかる音色は頭が付いて聞こえる
//
// どちらもレジスタに入っているので、**鳴らさずに決められる。**
// 測っていない音色にも値が付く。間違っていたら直す。

/** 立ち上がりの境目(ミリ秒)。**聞いて決めた数ではない** */
export const STEAL_ATTACK_MS = 20;

/**
 * AR から立ち上がりの時間(ミリ秒)。
 *
 * 測った表に合わせた式(→ docs/OPLL_ROM_TEST.md の「立ち上がりの速さ」)。
 * AR が 1 増えると半分になる。AR=1 が 1067 ミリ秒、AR=6 が 33、AR=13 以上は
 * 測った分解能(0.6 ミリ秒)より速い。AR=0 は立ち上がらない。
 *
 * 440Hz で KSR=0 のときの値。KSR=1 だと 6 倍速くなるが、音程でも変わるので
 * ここでは見ない(目安なので、速いほうへ外れるぶんは困らない)。
 *
 * @param {number} ar 0〜15
 * @returns {number} ミリ秒。AR=0 は Infinity
 */
export function opllAttackMs(ar) {
  return ar > 0 ? 1067 / 2 ** (ar - 1) : Infinity;
}

/**
 * 8 バイトから `steal` を割り出す。
 *
 * 見るのはキャリア(2 バイト目・6 バイト目)。耳に出るのはそちらで、
 * 変調する側は倍音の量を決めるだけ。
 *
 * @param {number[]} bytes レジスタ 0x00〜0x07 の 8 バイト
 * @returns {'ok'|'avoid'}
 */
export function opllSteal(bytes) {
  const hold = ((bytes[1] >> 5) & 1) === 1;   // EG タイプ
  const ar = (bytes[5] >> 4) & 15;
  return hold && opllAttackMs(ar) < STEAL_ATTACK_MS ? 'ok' : 'avoid';
}


// ---- 音色を登録する口(ここから mml.js の中へ入る)----
//
// OPLL の中身を知っているのはこのファイルと `opll.js` だけにする。mml.js は
// `registerVoice` で受けるだけなので、OPLL を外すときに mml.js を直さずに済む
// (docs/ENGINE_TODO.md の 2i)

/**
 * 自分で作った OPLL の音色を登録する(ユーザー音色)。
 *
 * OPLL の音色は 15 個の固定表しかないが、0 番だけは自分で書ける。
 * 2 つのオペレータの形を名前の付いた値で渡すと、実機の 8 バイトへ畳む。
 *
 * ```js
 * registerOPLLVoice('myBrass', {
 *   mod: { ratio: 2, depth: 29, attack: 15, decay: 2, sustain: 1, release: 7, hold: true },
 *   car: { ratio: 1, attack: 8, decay: 1, sustain: 0, release: 7, hold: true },
 *   feedback: 5,
 * }, { role: 'lead', desc: 'A brass patch.' });
 * ```
 *
 * `mod` が変調側、`car` が聞こえるキャリア側。名前は実機の呼び名(`mul` `tl` `ar`)でも、
 * 日常の言葉(`ratio` `depth` `attack`)でもよい。書けるものと意味は
 * `describeOpllVoice()` が返す。`{ bytes: [...] }` を渡せば 8 バイトをそのまま使う。
 *
 * 実機は 1 種類しか持てない。こちらは止めないので、2 つ以上を同時に鳴らせる。
 * 要るときにレジスタを書き直すため、鳴っているユーザー音色の音が変わる。
 * 実機のドライバも同じことをする。
 *
 * @param {string} name 音色の名前。MML からは `@{名前}` で呼ぶ
 * @param {{mod?:object, car?:object, feedback?:number, bytes?:number[]}} spec 音色の中身
 * @param {object} [opts] 説明や役。`registerOPLL()` と同じ
 * @returns {number} 音色の番号
 */
export function registerOPLLVoice(name, spec, opts = {}) {
  const bytes = opllVoice(spec);
  return registerOPLL(name, 0, { ...opts, voice: bytes });
}

/**
 * OPLL(YM2413)の音色を登録する。MSX-MUSIC / FM-PAC の音源。
 *
 * チップそのものを鳴らす。音色は 15 個の固定表しかないので、番号を渡すだけ。
 * 音の作りは `sound/opll.js` の中にあり、実機と同じ演算をする。
 *
 * `fm2*` とは別の音色として並べる。あちらは寄せて作ったもので、別もの。
 *
 * @param {string} name 名前
 * @param {number} inst 実機の音色番号(1〜15)
 * @param {object} [opts] 説明や役
 * @returns {number} 音色の番号
 */
export function registerOPLL(name, inst, opts = {}) {
  const fields = {
    inst: Math.max(0, Math.min(15, Math.floor(inst))),
    // 打楽器は音色番号ではなく、リズムのどれを叩くかで決まる
    ...(opts.drum ? { drum: String(opts.drum) } : {}),
    // どの音色表か。0 = YM2413、1 = VRC7、2 = YMF281B
    ...(opts.set > 0 ? { set: Math.floor(opts.set) } : {}),
    // 自分で作った音色なら、レジスタ 0x00〜0x07 に書く 8 バイト
    ...(opts.voice ? { voice: opts.voice } : {}),
    // 同じ `v` で鳴らしたときの大きさ。矩形波を 1 とした比。
    //
    // 鳴りには効かない。OPLL の音量はチップの音量レジスタが持つので、
    // 外から掛けると実機と違う鳴り方になる(`audio.js` の `_playVoice`)。
    // 持たせるのは、音量を合わせる層が本当の大きさを知るため
    // (`tool/core/volmap.js` の `ampOf`)。矩形波と並べたときに
    // どれだけ離れるかは、そこから出る
    ...(opts.gain > 0 ? { gain: Math.max(0.1, Math.min(4, Number(opts.gain))) } : {}),
    // 書いた高さからずらす半音。作り分けで高さ違いを並べるために持つ
    // (`opll::kick(low)` など)。曲の側で `#bundle` に `@o` を書くのと同じこと
    ...(opts.semi ? { semi: Math.round(opts.semi) } : {}),
  };
  // 書いていなければ、音色の 8 バイトから割り出す。鳴らさずに決まるので、
  // 測っていない音色にも値が付く(`opllSteal`)。
  // 測った結果のほうが確かなので、書いてあればそちらが勝つ
  let steal = opts.steal;
  if (steal == null) {
    // 打楽器は音色番号を使わない(リズム音源の 16〜18 行)。あの 3 行は
    // どれも EG=0 の減衰音なので、割り出さずに `avoid` でよい
    if (fields.drum) steal = 'avoid';
    else {
      const bytes = fields.voice ?? OPLL_SETS[fields.set ?? 0]
        ?.slice(fields.inst * 8, fields.inst * 8 + 8);
      if (bytes && bytes.length === 8) steal = opllSteal(bytes);
    }
  }
  return registerVoice(name, 'opll', fields,
    { ...opts, ...(steal == null ? {} : { steal }) });
}

/**
 * `@opll{…}` を読む。OPLL(YM2413)のユーザー音色を MML の中で作る。
 *
 * ```
 * #voice myBrass = @opll{ mod{ratio 2, depth 29, attack 15, decay 2, sustain 1,
 *                              release 7, hold 1},
 *                         car{ratio 1, attack 8, decay 1, sustain 0, release 7, hold 1},
 *                         feedback 5 }
 * ```
 *
 * 中身は JS の `registerOPLLVoice()` へ渡すものと同じ形。`mod` が変調側、
 * `car` が聞こえるキャリア側で、書ける名前と意味は `describeOpllVoice()` が返す。
 * `bytes{…}` に 8 個の数を書けば、レジスタの値をそのまま使う。
 *
 * `@fm2` は作らない。寄せて作った 2 オペの口を別に立てると、実機どおりの
 * 2 オペ(OPLL・VRC7・YMF281B)がそちらへ入らなくなる。音色の表はもう
 * OPLL になっているので、口も実機の側へ寄せる(2026-10-04)。
 */
function readOpllSpec(text, name) {
  const spec = {};
  for (const one of splitParts(text)) {
    const m = /^([A-Za-z]+)\s*(?:\{([^}]*)\}|(-?\d+))$/.exec(one.trim());
    if (!m) {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の @opll の "${one.trim()}" は読めません`
        + '(mod{…} car{…} bytes{…} か、feedback 5 のように書きます)');
    }
    const key = m[1].toLowerCase();
    if (key === 'mod' || key === 'car') {
      if (m[2] === undefined) {
        bad(`[ChpTnSnd] MML: 音色 "${name}" の @opll の ${key} は ${key}{…} で書きます`);
      }
      spec[key] = opllFields(m[2], name, key);
    } else if (key === 'bytes') {
      if (m[2] === undefined) {
        bad(`[ChpTnSnd] MML: 音色 "${name}" の @opll の bytes は bytes{…} で書きます`);
      }
      spec.bytes = voiceNums(m[2], name, 'opll の bytes');
    } else if (key === 'feedback') {
      if (m[3] === undefined) {
        bad(`[ChpTnSnd] MML: 音色 "${name}" の @opll の feedback は数で書きます`);
      }
      spec.feedback = Number(m[3]);
    } else {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の @opll に "${m[1]}" は書けません`
        + '(書けるのは mod car feedback bytes です)');
    }
  }
  if (!spec.mod && !spec.car && !spec.bytes) {
    bad(`[ChpTnSnd] MML: 音色 "${name}" の @opll に中身がありません`
      + '(mod{…} と car{…} を書くか、bytes{…} に 8 個の数を書いてください)');
  }
  return spec;
}

/** `ratio 2, depth 29` を読む。値の確かめは `opllVoice()` がする */
function opllFields(text, name, where) {
  const out = {};
  for (const one of String(text).split(',')) {
    const w = one.trim().split(/\s+/).filter(Boolean);
    if (w.length !== 2 || !Number.isFinite(Number(w[1]))) {
      bad(`[ChpTnSnd] MML: 音色 "${name}" の @opll の ${where}{${text}} は`
        + '「名前 数」を `,` で区切って書きます');
    }
    out[w[0]] = Number(w[1]);
  }
  return out;
}

// MML の #voice で @opll{…} と書けるようにする。中身は字のまま受けて、ここで読む
// (`bytes{…}` の形が、mml.js の読み方と合わないため)
registerVoiceSyntax('opll', (name, text, opts) =>
  registerOPLLVoice(name, readOpllSpec(text, name), opts), { raw: true });

// リズムの割り当て。同じ拍で同じチャンネルを別の高さで叩いていないかを
// mml.js が見るために渡す
registerDrumSlots('opll', OPLL_DRUM_TABLE);
