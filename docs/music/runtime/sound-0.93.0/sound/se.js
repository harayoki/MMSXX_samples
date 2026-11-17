// **効果音。**MML で書いた本体を、鳴らすときに高さと長さで切って使う。
//
// ---- なぜ普通の SE と分けるのか ----
//
// `defineSE()` はもともと「書いたとおりに鳴らす」もので、それはそのまま残る。
// ここで足すのは **1 つの本体を鳴らし分ける**やり方。
//
// 本体は **c1**(c の高さ・全音符ぶん)で書く。鳴らすときに音名と長さを渡すと、
// **その高さへ移して、頭からその長さぶんだけ**鳴らす。
//
//     本体   ジャーーーン
//     c1     ジャーーーン        まるごと
//     c4     ジャー              頭の 1/4 だけ
//     c4b4e4 ジャージャージャー  頭の 1/4 を、高さを変えて 3 回
//
// **長さは切るだけで、伸び縮みしない。**伸ばすと音色そのものが変わってしまう
// ので、頭を使う。だから本体は「頭がいちばん要る音」の順に書く。
//
// 切る長さは書いた音名の長さだけで決まるので、**本体は 64 フレームより
// 長くても短くてもよい**。長ければ `c1` で余りが落ちるだけ、短ければ
// 残りが間になるだけ。もっと長く取りたければ `c1.`(96 フレーム)と書ける。
//
// ---- テンポは書けない ----
//
// **全音符 = 64 フレーム**(60 分の 1 秒が 64 個)に固定してある。
// つまり —
//
//     l1 = 64 フレーム    l8  =  8 フレーム
//     l2 = 32             l16 =  4
//     l4 = 16             l32 =  2
//                         l64 =  1 フレーム
//
// **`l64` がちょうど 1 フレーム**になるので、書いた長さと画面の書き換えが
// ずれない。効果音は数フレームの世界なので、ここがずれると作れない。
// テンポを書けるようにすると、この対応が崩れる。
//
// `t225` にあたるが、これは結果であって決めごとではない。
//
// ---- 何を組み合わせるのか ----
//
// 音色の表(tones.js)・デチューン(`@d`)・エコー(`@s`)・重ね(`@o`)は
// そのまま使える。`l64 [cde>]16` のような**駆け上がり**と合わせると、
// 8 ビット機の効果音になる。

import { WAVEFORMS } from './mml.js';

/** 表が 1 つ進む時間。**画面の書き換えと同じ 60 分の 1 秒**(tones.js と同じ) */
export const SE_FRAME = 1 / 60;

/** 全音符ぶんのフレーム数。**`l64` が 1 フレームになる数**として選んである */
export const SE_WHOLE = 64;

/** 本体を組み立てるときのテンポ。上の 2 つから出てくる数(= 225) */
export const SE_TEMPO = Math.round(240 / (SE_WHOLE * SE_FRAME));

const SEMI = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

/**
 * 音名を読む。**MML の音符と同じ書き方**にしてある。
 *
 *   `c` `c+` `c#` `c-`   半音上げ下げ
 *   `c4`                 長さ(全音符の 1/4)。**書かなければ本体まるごと**
 *   `c4.`                付点
 *   `>` `<` `o<n>`       オクターブ
 *   `r4`                 間。**次の音までの空き**
 *
 * @param {string} spec 例 `'c4b4e4'`
 * @param {number} [base=0] 本体を書いた高さ(半音)。ここからの差を取る
 * @returns {{semi:number, sec:number, rest:boolean}[]}
 *   semi = 本体からずらす半音 / sec = 頭から切り取る長さ(秒)
 */
export function parseSENotes(spec, base = 0) {
  const src = String(spec || '').toLowerCase();
  const out = [];
  let oct = 4;
  for (let i = 0; i < src.length; ) {
    const ch = src[i];
    if (' \t\n\r|,'.includes(ch)) { i++; continue; }
    if (ch === '>') { oct++; i++; continue; }
    if (ch === '<') { oct--; i++; continue; }
    if (ch === 'o') {
      i++;
      let n = '';
      while (i < src.length && src[i] >= '0' && src[i] <= '9') n += src[i++];
      if (n !== '') oct = parseInt(n, 10);
      continue;
    }
    const rest = ch === 'r';
    if (!rest && SEMI[ch] === undefined) {
      console.warn(`[ChpTnSnd] SE: 音名として読めない字 "${ch}" は読み飛ばします (${spec})`);
      i++;
      continue;
    }
    i++;
    let semi = rest ? 0 : SEMI[ch] + (oct - 4) * 12 - base;
    while (i < src.length && '+#-'.includes(src[i])) semi += src[i++] === '-' ? -1 : 1;
    let n = '';
    while (i < src.length && src[i] >= '0' && src[i] <= '9') n += src[i++];
    // **長さを書かなければ本体まるごと。**本体が c1 で書いてあるので `c` = `c1`
    const len = n === '' ? 1 : Math.max(1, parseInt(n, 10));
    let frames = SE_WHOLE / len;
    let dot = frames;
    while (src[i] === '.') { i++; dot /= 2; frames += dot; }
    out.push({ semi, sec: frames * SE_FRAME, rest });
  }
  return out;
}

/**
 * 本体を書いた高さと長さ(`'c1'` など)を読む。
 *
 * 長さは**本体がどれだけあるかの目安**で、切り取りの計算には効かない
 * (切り取りは書いた音名の長さだけで決まる)。
 *
 * @param {string|boolean} spec `'c1'` / `true`(= `'c1'`)
 * @returns {{semi:number, len:number}}
 */
export function parseSEBase(spec) {
  const s = spec === true ? 'c1' : String(spec || 'c1').toLowerCase().trim();
  const got = /^([a-g])([+#-]*)(\d*)/.exec(s);
  if (!got) {
    console.warn(`[ChpTnSnd] SE: 本体の高さ "${spec}" が読めないので c1 とみなします`);
    return { semi: 0, len: 1 };
  }
  let semi = SEMI[got[1]];
  for (const c of got[2]) semi += c === '-' ? -1 : 1;
  return { semi, len: got[3] === '' ? 1 : parseInt(got[3], 10) };
}

/** 音量を 0..15 の割合で掛ける。**音量表は 0..15 のまま持つ**(鳴らす側が曲線を持つ) */
const scaleVol = (v, mul) => Math.max(0, Math.min(15, Math.round(v * mul)));

/**
 * 本体を、音名の並びのぶんだけ切って並べ直す。
 *
 * **頭から切るだけ**で、伸ばさない。本体が指定より短ければ、
 * 残りは間になる(次の音は必ず書いた長さのところから始まる)。
 *
 * @param {{events:object[], total:number, ch:number}[]} tracks 本体
 * @param {{semi:number, sec:number, rest:boolean}[]} notes
 * @param {number} [vol] 0..15。**書かなければ本体のまま**
 * @returns {{events:object[], total:number, noise:boolean, ch:number}[]}
 */
export function sliceSE(tracks, notes, vol) {
  const mul = vol == null ? null : Math.max(0, Math.min(15, vol)) / 15;
  return tracks.map((t) => {
    const events = [];
    let at = 0;
    for (const n of notes) {
      if (!n.rest) {
        const ratio = Math.pow(2, n.semi / 12);
        for (const ev of t.events) {
          // **頭から。**始まりが切り口を越えたところで、その音はもう要らない
          if (ev.t >= n.sec - 1e-9) break;
          const room = n.sec - ev.t;
          events.push({
            ...ev,
            t: at + ev.t,
            dur: Math.min(ev.dur, room),
            gate: Math.min(ev.gate, room),
            freq: ev.freq * ratio,
            vol: mul == null ? ev.vol : scaleVol(ev.vol, mul),
          });
        }
      }
      at += n.sec;
    }
    return {
      events,
      total: at,
      noise: events.some((e) => (WAVEFORMS[e.wave] || {}).kind === 'noise'),
      ch: t.ch,
    };
  });
}
