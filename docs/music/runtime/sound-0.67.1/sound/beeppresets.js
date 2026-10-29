// 最初から入っているビープ音源。
//
// **機械そのものの名前は付けない。**「あの機械らしい音」であって、
// 実機の完全な再現ではないため。中身と、何をもとにしたかはここに書いてある。
// 詳しい調べものは [docs/BEEP.md](../docs/BEEP.md)。
//
// **実在の機械に縛らない。** 幅は広く取ってあるので、どこにも無かった
// ビープも作れる。下の 2 つがその例。

import { registerBeep, registerFamily } from './mml.js';

/**
 * @type {Record<string, {carrier?:number, jitter?:number, frame?:number,
 *   display?:number, divClock?:number, descJa:string}>}
 */
export const BEEP_PRESETS = {
  // ---- 搬送波を刻む型。**音程を変える回路が無い機械** ----
  // 2.4kHz が鳴りっぱなしで、ソフトはそれを On/Off するだけ。
  // 消せない搬送波が乗り、画面の DMA で刻む間隔も揺れる = 濁る
  'beep(noisy)': { role: 'lead', desc: 'Japanese 8-bit micro beeper. A 2.4kHz carrier runs constantly and software only gates it on and off, so the carrier bleeds through and the video DMA jitters the gaps. The muddiness is the sound, not a defect.',
    carrier: 2400, jitter: 0.40, frame: 60, display: 0.70,
                 descJa: '国産 8 ビット機のビープ。濁りがこの音の本体' },
  'beep(calm)': { role: 'lead', desc: 'The same machine with the jitter halved. Use when the melody matters more than the character.',
    carrier: 2400, jitter: 0.15, frame: 60, display: 0.70,
                 descJa: '同じ作りで揺れを浅くしたもの。旋律を聞かせたいとき' },
  'beep(flat)': { role: 'lead', desc: 'Does not exist on real hardware. Same carrier bleed, jitter removed — the display always fought the CPU, so it always wobbled.',
    carrier: 2400, jitter: 0,
                 descJa: '**実在しない。**同じ濁りのまま揺れだけ止めたもの。'
                     + '実機は画面と食い合うので必ず揺れた' },

  // ---- 線を直接叩く型。搬送波が無いので素直な矩形 ----
  // 画面とメモリを取り合う機械は、同じ理由で揺れる。
  // **同じ仲間の作り分けとして持つ** — 鳴らす側から見れば
  // 「ビープの、濁っていないほう」でしかない
  'beep(direct)': { role: 'lead', desc: 'Speaker driven directly, so no carrier: a clean square. Still jitters because video and memory share the bus.',
    carrier: 0, jitter: 0.40, frame: 50, display: 0.62,
               descJa: '線を直接叩く型。搬送波が無いので素直な矩形。画面を描く間だけ CPU が待たされて揺れる(50Hz)' },
  'beep(clean)': { role: 'lead', desc: 'Direct-drive beeper on a faster machine. Cleaner and higher.',
    carrier: 0, jitter: 0, frame: 60, display: 0.70,
               descJa: '同じ作りで、画面と食い合わない機械のもの。揺れない' },

  // ---- エンベロープを連れてくるもの ----
  // **音色とエンベロープの組み合わせで初めて楽器になる**例。
  // 実機のビープは音量すら変えられなかったので、これは完全にこちらの発明。
  // **これも同じ仲間の作り分け** — ビープは 1 種類しかない音なので、
  // 別々の名前で並べるより、1 行の中で押し比べられるほうが早い。
  'beep(pluck)': { role: 'lead', desc: 'Beeper gated with a short envelope so each note reads as plucked.',
    carrier: 2400, jitter: 0.25, frame: 60, display: 0.7, env: 'pluck',
             descJa: '**実機に無い楽器。**濁ったビープを弾いた音にする。'
                 + '頭だけ鳴って落ちるので、速い刻みでも粒が立つ' },
  'beep(chime)': { role: 'lead', desc: 'Two beeper tones close together, beating against each other.',
    carrier: 3600, jitter: 0.1, frame: 60, display: 0.7, env: 'piano',
             descJa: '同じ作りで高い搬送波 + ピアノ風の減衰。硬く澄んだ粒' },

  // ---- カセット ----
  // 搬送波は持たない(ロード音は 2 つの音の切り替えそのもの)。
  // 揺れをごく浅く遅くすると**テープの回転むら(ワウ)**になる。
  //
  // **`special: ['tape']` を持つ。**下の hiss / wow / muffle は
  // MML に `=` を書いたときにしか通らないので、音符で鳴らすと
  // **ただの矩形波**になる。道具はこの印を見て鳴らし方を変える。
  //
  // 3 つはテープの傷み具合の並び。**素の `tape` は真ん中**にしてある —
  // 何も考えずに選んだときに出るものが、いちばん普通のテープであってほしい。
  // 劣化のほうは味が濃く、**曲に敷くと勝ちすぎる**。
  //
  // **名前は `tape`。**ビープ音源の上に載ってはいるが、これは楽器ではなく
  // ロード音そのもので、`bp` の仲間として並べるものではない。
  //
  // **`dev: ['done']`。**3 つに割ることも名前も、これで確定。
  // 曲の側から名前で呼ばれるので、ここが動くと向こうが動く
  'tape(used)': { role: 'se', special: ['tape'], dev: ['done'],
    tags: ['tape', 'loading', 'cassette'], desc: 'Cassette loading noise off an ordinary tape: the speed holds, a little hiss underneath, the top end softened.',
    carrier: 0, jitter: 0.02, frame: 7, display: 0.5,
    hiss: 0.05, wow: 0, muffle: 4000,
                 descJa: 'カセットのロード音用。ふつうに使ってきたテープ。'
                       + '回転むらは無く、地のノイズが少し乗って、高いところがやわらぐ' },
  'tape(worn)': { role: 'se', special: ['tape'], dev: ['done'],
    tags: ['tape', 'loading', 'cassette'], desc: 'The same loading noise off a worn tape: the speed wobbles, the top end is gone, the hiss is always there.',
    carrier: 0, jitter: 0.02, frame: 7, display: 0.5,
    hiss: 0.16, wow: 0.05, muffle: 2200,
                 descJa: '同じロード音を劣化したテープで。回転むらで音程が揺れ、'
                       + '高いところが落ちてこもり、地のノイズが常に鳴っている' },
  'tape(clean)': { role: 'se', special: ['tape'], dev: ['done'],
    tags: ['tape', 'loading', 'cassette'], desc: 'The same loading noise off a fresh tape: no hiss at all, only the top end rolled off.',
    carrier: 0, jitter: 0.02, frame: 7, display: 0.5,
    hiss: 0, wow: 0, muffle: 6000,
                 descJa: '同じロード音を新品のテープで。地のノイズがまったく無く、'
                       + '高いところが少し落ちているだけ' },

  // ---- 実在しないもの。**これも同じ仲間の作り分け** ----
  'beep(glass)': { role: 'lead', desc: 'High and thin, on the edge of the machine\'s range.',
    carrier: 6000, jitter: 0.25, frame: 120, display: 0.40,
             descJa: '実在しない。搬送波が高く、揺れが速い。硬くて落ち着かない音' },
  // **これだけ音程が出ない。**揺れ 0.55 は書いた高さの 45〜100% まで動くので、
  // しかも 30Hz とゆっくりなので、音符ではなく地響きとして聞こえる。役は se
  'beep(tar)': { role: 'se', desc: 'Low and coarse. Slow enough that the individual gate steps are audible.',
    carrier: 900, jitter: 0.55, frame: 30, display: 0.80,
             descJa: '実在しない。搬送波が低く、揺れが深い。**音程は出ない** — '
                 + '書いた高さの半分まで揺れるので、音符ではなく地響きに聞こえる' },
};

/**
 * `beep( )` と `tape( )` の仲間。値の説明は上の作り分けの `desc` をそのまま使う
 * (同じ文を 2 か所に書くと、片方だけ直したときに食い違う)
 */
function familyFrom(head, spec) {
  const values = Object.entries(BEEP_PRESETS)
    .filter(([name]) => name.startsWith(head + '('))
    .map(([name, p]) => ({ value: name.slice(head.length + 1, -1), desc: p.desc }));
  registerFamily(head, { desc: spec.desc, params: [{ ...spec.param, values }] });
}

/** 最初から入れておく(ChipTuneSound が読み込まれるときに走る) */
export function registerDefaultBeeps() {
  familyFrom('beep', {
    desc: '1-bit beeper speakers of 8-bit micros. Opens its own section: @{beep( )}{ … } takes BASIC-style BEEP sweeps.',
    param: { name: 'model', default: 'noisy', desc: 'Which beeper circuit, real or imagined.' },
  });
  familyFrom('tape', {
    desc: 'Cassette loading noise. Opens its own section: @{tape( )}{ … } takes = for pilot tone and ? for data.',
    param: { name: 'wear', default: 'used', desc: 'Condition of the tape.' },
  });
  for (const [name, p] of Object.entries(BEEP_PRESETS)) {
    registerBeep(name, p,
      { desc: p.desc, descJa: p.descJa, role: p.role,
        tags: p.tags, special: p.special, dev: p.dev,
        vsteps: p.vsteps, vcurve: p.vcurve });
  }
}

/** ビープ音源かどうか(名前で見分ける) */
export const isBeepTone = (name) => String(name).startsWith('bp');
