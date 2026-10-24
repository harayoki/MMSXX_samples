// MML を鳴らすだけの小さなプレイヤー。中身はここ 1 か所。
//
// ---- なぜ画面から切り出すか ----
//
// 置き場所が 2 つある。道具の画面(`tool/ui/player.html`)と、
// 配る解説ページ(`tool/manual/`)。解説ページは artifact として配るので、
// 読む人はこちらの HTML を開けない。動くものを見せるならページの中に要る。
//
// 同じものを 2 か所に書くと、片方だけ直したときに食い違う。RetroTalk の
// ときに一度そうなっている。だから中身はここに置いて、置く側は呼ぶだけにする
// (2026-09-15)。
//
// ---- 見た目もここが持つ ----
//
// 押すものの決めごとは `tool/ui/ui.css` にあるが、解説ページはあれを読まない。
// 読めるところと読めないところで見た目が変わるので、このプレイヤーが使う形は
// `PLAYER_CSS` に持たせて、どちらに置いても同じ顔にする。
// 色は `--ink` `--amber` などの名前で引くので、明暗は置く側が決める。
//
// ---- 出しているもの ----
//
// 止める・戻す・跳ぶ・黙らせるの 4 つだけ。MML を書き換えるテキストボックスは
// 持たない。外に置くかどうかは使う側が決めることで、鳴らす道具の仕事ではない
// (2026-09-15)。差し替えは `setMML()` で受ける。
//
// ---- 状態はエンジンが持つ ----
//
// モデルとビューの分け方にする(2026-09-15)。黙らせたチャンネルも、
// くり返すかどうかも、持っているのはエンジン(`ChipTuneSound`)。
// ここは 0.1 秒ごとに見に行って、押すところの形を合わせるだけ。
//
// だから外からはエンジンへ言う。
//
// ```js
// p.audio.muteTracks([0, 1]);   // 1 と 2 を黙らせる
// p.audio.ignoreSongLoop = true;   // くり返さない
// ```
//
// 押すところは次の瞬間に追いついて、そう見える形になる。
// 同じ操作をここにも生やすと、状態が 2 か所に置かれて食い違う。
//
// チャンネルとくり返しは、押すところを消せる(`channels: false` `repeat: false`)。
// 消えるのは見た目だけで、エンジンへ言うぶんには変わらず効く。
//
// 渡し方は 2 つ。チャンネルごとに分けた並びでも、1 本のテキストでもよい。
// どちらで持っているかは使う人によるので、両方受ける(2026-09-15)。
// 1 本のときの声の切れ目は `#ch <名前>` で、切り方はエンジンが持っている
// (`sound/mml.js` の `splitVoices`)。

import { ChipTuneSound, SOUND_VERSION } from '#sound/all.js';
import { PLAYER_VERSION } from './version.js';
import { splitVoices, compileMML, countOldStyle, WAVEFORMS, ENVELOPES } from '#sound/mml.js';
import { eventsToMML } from '../core/tomml.js';
import { writeWAV } from '../core/wav.js';
import { measureLoudness } from '../core/check/loudness.js';
import { fitGain, SONG_TARGET } from '../core/check/fit.js';

/** 権利の表示。LICENSE と揃える(書き換えるときは両方) */
const COPYRIGHT = '2026 harayoki';

/** このプレイヤーの見た目。置く側が `<style>` へ流し込む */
export const PLAYER_CSS = `
.mmsxx-player{ font-family:var(--mono); font-size:13px; line-height:1.55; color:var(--ink); }
.mmsxx-player [hidden]{ display:none !important; }
/* 操作の帯。押すものが 1 か所にまとまっていないと、押しに行くのに目が泳ぐ */
.mmsxx-player .deck{
  background:var(--panel); border:1px solid var(--line); padding:13px 14px;
}
.mmsxx-player .row{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.mmsxx-player .row + .row{ margin-top:11px; }
/* 残りを開く押しどころ。ふつうのボタンの形にすると、何かが起きるものに
   見えてしまう。枠を外して、押すと地が反転するだけにする(2026-09-15) */
.mmsxx-player button.dots{
  margin-left:auto; border:0; padding:2px 8px 6px; line-height:1;
  font-size:16px; letter-spacing:.12em; color:var(--dim); border-radius:2px;
}
.mmsxx-player button.dots:hover{ color:var(--amber); border:0; }
.mmsxx-player button.dots[aria-pressed="true"]{ background:var(--sunk); color:var(--ink); }
/* 版と権利を出すところ。ふだんは要らないので、小さく置いて畳んでおく */
.mmsxx-player button.help{
  border:0; padding:3px 6px; line-height:1;
  font-size:12px; color:var(--dim); border-radius:2px;
}
.mmsxx-player button.help:hover{ color:var(--amber); border:0; }
.mmsxx-player button.help[aria-pressed="true"]{ background:var(--sunk); color:var(--ink); }
/* ? の吹き出し。押しどころのすぐ横に出す。行として並べると、
   ふだん要らないものが場所を取りつづける(2026-09-16) */
.mmsxx-player .ver-wrap{ position:relative; display:inline-flex; }
.mmsxx-player .about-ver{
  position:absolute; right:0; bottom:calc(100% + 7px); z-index:3;
  margin:0; padding:7px 10px; white-space:pre; text-align:right;
  font-size:11px; color:var(--ink); line-height:1.6;
  background:var(--panel); border:1px solid var(--line-hi); border-radius:3px;
  box-shadow:0 2px 8px rgba(0,0,0,.18);
}
/* 吹き出しの尻尾。枠のぶんと中身のぶんを 2 枚重ねる */
.mmsxx-player .about-ver::before,
.mmsxx-player .about-ver::after{
  content:''; position:absolute; right:9px; top:100%;
  border:5px solid transparent; border-bottom:0;
}
.mmsxx-player .about-ver::before{ border-top-color:var(--line-hi); }
.mmsxx-player .about-ver::after{ margin-top:-1px; border-top-color:var(--panel); }
/* 畳むところ。中の行の間は、畳まないときと同じ空け方にする */
.mmsxx-player .fold .row{ margin-top:11px; }
.mmsxx-player .time{ font-size:12px; color:var(--dim); white-space:nowrap; }
.mmsxx-player .time b{ color:var(--ink); font-weight:600; }
.mmsxx-player input[type=range]{
  width:100%; height:22px; margin:0; display:block;
  accent-color:var(--amber); background:transparent; cursor:pointer;
}
/* スライダーの上に A と B の線を重ねる。線は細いが、つまむところは広くとる
   (指でも押せるように)。線そのものに当たり判定を持たせると細すぎて掴めない */
.mmsxx-player .track{ position:relative; flex:1; min-width:140px; }
.mmsxx-player .ab{
  position:absolute; top:0; bottom:0; width:13px; margin-left:-6px;
  cursor:ew-resize; touch-action:none; z-index:2;
}
.mmsxx-player .ab::before{
  content:""; position:absolute; left:6px; top:1px; bottom:1px; width:1px;
  background:var(--teal);
}
.mmsxx-player .ab::after{
  content:attr(data-n); position:absolute; left:8px; top:0;
  font-size:8.5px; line-height:1; color:var(--teal);
}
.mmsxx-player .ab.off{ display:none; }
/* 切れ目の線。押せないようにして、スライダーの邪魔をしない。
   等間隔で入る網の目(#switch)は薄く、手で引いた | は濃く。
   曲の作りとして書いたものと、その場で引いたものを見分けるため */
.mmsxx-player .cuts{
  position:absolute; left:0; right:0; top:3px; bottom:3px;
  pointer-events:none; z-index:1;
}
.mmsxx-player .cuts i{
  position:absolute; top:0; bottom:0; width:1px; margin-left:-1px;
  background:var(--ink);
}
.mmsxx-player .cuts i.grid{ opacity:.14; }
.mmsxx-player .cuts i.bar{ opacity:.42; }
/* 曲の作りの線。戻る先(LOOP)と後奏の始まり(OUTRO)。切れ目とは別の色にして、
   同じところに重なっても見分けられるようにする */
.mmsxx-player .cuts i.loop, .mmsxx-player .cuts i.outro{
  background:var(--teal); opacity:.6; width:1px;
}
.mmsxx-player .cuts i.outro{ opacity:.45; }
/* A から B までの帯。押せないようにして、スライダーの邪魔をしない */
.mmsxx-player .abspan{
  position:absolute; top:2px; bottom:2px; background:var(--teal);
  opacity:.12; pointer-events:none; z-index:1;
}
/* 音量。ミュートと 2 つ出すときは枠を分け合って、ひとつながりに見せる。
   スライダーは短くてよい。位置のスライダーと同じ幅にすると、
   どちらが曲の位置なのか分からなくなる */
.mmsxx-player .vol{ display:inline-flex; align-items:center; gap:7px; }
.mmsxx-player .vol input[type=range]{ width:82px; }
.mmsxx-player .vol.joined{
  gap:0; border:1px solid var(--line-hi); border-radius:2px; overflow:hidden;
}
.mmsxx-player .vol.joined button{
  border:0; border-right:1px solid var(--line-hi); border-radius:0; padding:5px 9px;
}
.mmsxx-player .vol.joined input[type=range]{ margin:0 8px 0 7px; }
.mmsxx-player .vol button[aria-pressed="true"]{
  background:var(--ink); color:var(--panel);
}
.mmsxx-player input[type=text]{
  font:inherit; font-size:11px; width:72px; text-align:center;
  color:var(--ink); background:var(--sunk);
  border:1px solid var(--line); border-radius:2px; padding:3px 4px;
}
.mmsxx-player input[type=text]:focus{ outline:none; border-color:var(--amber); }
.mmsxx-player label.sw{ display:inline-flex; align-items:center; gap:5px; font-size:11px; }
.mmsxx-player .lbl{
  font-size:10px; letter-spacing:.09em; text-transform:uppercase;
  color:var(--dim); margin-right:2px;
}
/* 選ぶところ。並んだボタンだと、どれとどれが 1 つの組なのか読めない。
   選ぶものは選ぶ形にする(2026-09-15) */
.mmsxx-player .pick{
  display:inline-flex; align-items:center; gap:6px;
  font-size:10px; letter-spacing:.09em; text-transform:uppercase; color:var(--dim);
}
.mmsxx-player .pick select{
  font:inherit; font-size:11px; text-transform:none; letter-spacing:0;
  color:var(--ink); background:var(--sunk);
  border:1px solid var(--line-hi); border-radius:2px; padding:4px 6px;
}
.mmsxx-player .pick select:disabled{ opacity:.45; }
.mmsxx-player .chs, .mmsxx-player .marks{ display:flex; flex-wrap:wrap; gap:6px; }
/* 選択肢。グループごとに、名前と選べるものを 1 かたまりにする */
.mmsxx-player .takes{ display:flex; flex-wrap:wrap; gap:6px 14px; align-items:center; }
.mmsxx-player .take{ display:inline-flex; align-items:center; gap:6px; }
.mmsxx-player .take .grp{ font-size:11px; color:var(--dim); }
/* From top は選択肢ぜんぶに効く。グループの並びの続きに置くと、いちばん右の
   グループだけに掛かるように見えるので、行の端まで離す(2026-09-18) */
.mmsxx-player .row .wide{ margin-left:auto; }
.mmsxx-player .ch{ display:inline-flex; align-items:center; gap:7px; }
/* 音量に切り替えたときのチャンネル。名前・スライダー・割合を 1 かたまりにする。
   鳴っているあいだは名前が琥珀に点く。ボタンが無いので枠を光らせられないが、
   点くのは一瞬・消えるのは少し引きずる、という点け方はボタンと同じにする */
.mmsxx-player .chvol .name{ font-size:11px; transition:color .18s ease-out; }
.mmsxx-player .chvol.hot .name{ color:var(--amber); transition:none; }
.mmsxx-player .chvol input[type=range]{ width:82px; }
.mmsxx-player .chvol .pct{ min-width:3.2em; margin-right:8px; font-size:11px; color:var(--dim);
  font-variant-numeric:tabular-nums; }
.mmsxx-player .chmode{ display:inline-flex; gap:6px; margin-left:auto; }
/* ミュートのボタンの側に添える音量。押せるものではないので枠は付けない。
   0% まで下げた行だけ琥珀にする。黙っているのに押してあるように見えるのを
   防ぐのがここの役目なので、その 1 つだけ目立てばよい */
.mmsxx-player .ch .lvl{ font-size:9.5px; color:var(--dim); letter-spacing:.04em; }
.mmsxx-player .ch .lvl.off{ color:var(--amber); }
.mmsxx-player .ch .role{ font-size:9.5px; color:var(--dim); letter-spacing:.06em; }
/* 1 本で何声使うか。和音を鳴らすチャンネルのボタンの中に出す。
   枠は付けない。ボタンの中にもう 1 つ枠があると、押しどころが 2 つに見える */
.mmsxx-player .ch .voices{
  margin-left:5px; font-size:9.5px; color:var(--teal); letter-spacing:.04em;
}
/* 押してあるあいだは地が反転する。青緑のままだと、明るい地に明るい字が
   載って読めなくなる(暗い配色でとくに)。地と逆の色を継いで薄くする */
.mmsxx-player .ch button.sw[aria-pressed="true"] .voices{
  color:inherit; opacity:.75;
}
/* いま鳴っているチャンネルと層。押してあるボタンだけが光る(黙らせたものは
   音量が 0 なので光らない)。琥珀は「いま鳴っている」の色(docs/UI.md)。
   地の反転は入 / 切に使っているので、こちらは枠で言う。
   点くのは一瞬なので、消えるほうだけ少し引きずる(2026-09-19) */
.mmsxx-player .ch button.sw,
.mmsxx-player .lanes button.sw{ transition:box-shadow .18s ease-out; }
.mmsxx-player .ch button.sw.hot,
.mmsxx-player .lanes button.sw.hot{
  box-shadow:0 0 0 1px var(--amber), 0 0 6px -1px var(--amber);
  transition:none;
}
/* 中の層を開く印。チャンネルのボタンとは別に押せる必要があるので、
   ボタンの中には入れない。押しどころが 2 つあることを形で言う */
.mmsxx-player .ch button.open{
  border:0; padding:4px 4px; line-height:1; font-size:9px; color:var(--dim);
  border-radius:2px; margin-left:-4px;
}
.mmsxx-player .ch button.open:hover{ color:var(--amber); border:0; }
.mmsxx-player .ch button.open[aria-pressed="true"]{ color:var(--ink); }
/* 開いた中身。チャンネルの下にぶら下げる。行を分けないと、
   どのチャンネルを開いたのか分からなくなる */
.mmsxx-player .lanes{
  display:flex; flex-wrap:wrap; gap:5px; align-items:center;
  width:100%; margin:-2px 0 2px; padding:0 0 0 14px;
}
.mmsxx-player .lanes .of{ font-size:9.5px; color:var(--dim); letter-spacing:.06em; }
.mmsxx-player .lanes button{ font-size:10px; padding:3px 8px; border-radius:999px; }
/* 押すものの形。四角は何かが起きるもの、角丸は入 / 切(docs/UI.md) */
.mmsxx-player button{
  font:inherit; font-size:11px; color:var(--ink); background:transparent;
  border:1px solid var(--dim); border-radius:2px; padding:5px 9px; cursor:pointer;
}
.mmsxx-player button:hover{ border-color:var(--amber); color:var(--amber); }
.mmsxx-player button:disabled{ opacity:.4; cursor:default; }
.mmsxx-player button:disabled:hover{ border-color:var(--dim); color:var(--ink); }
.mmsxx-player button:focus-visible{ outline:2px solid var(--amber); outline-offset:1px; }
.mmsxx-player button.sw{ border-radius:999px; padding:5px 11px; border-color:var(--line-hi); }
/* 合図のランプ。曲に置いた合図を通ると光る。押すものではないので、
   ボタンの形にしない。点くのも消えるのも一瞬にする。じわっと消すと、
   いつ届いたのかが読めない(2026-09-18) */
.mmsxx-player .leds{ display:flex; flex-wrap:wrap; gap:9px; align-items:center; }
/* 曲に置いた字。チャンネルごとに 1 つ出して、来た順に並べる。

   **高さは字が出ていなくても取っておく。**出入りのたびに下の行が動くと、
   押しに行ったものがずれる。枠 1 つぶん(24px)を先に確保して、
   字の有無で行の高さが変わらないようにする(2026-10-05)。

   **横にも動かさない。**行を 1 列に詰めるページ(.row を display:contents に
   するもの)では行の箱が消えるので、字が押しどころと同じ列に入り、
   幅が変わるたびに「…」が左右に動いていた。1 つの箱(.saidwrap)にまとめて、
   flex-basis:100% で必ず自分の行を取らせる。箱が 1 つなら、
   行を畳まれても列の中で折り返す(2026-10-05) */
.mmsxx-player .saidwrap{
  display:flex; align-items:center; gap:10px; flex:0 0 100%; min-width:0;
}
.mmsxx-player .said{
  display:flex; flex-wrap:wrap; gap:7px; align-items:center; min-height:24px;
}
.mmsxx-player .said span{
  padding:2px 7px; border:1px solid var(--line); border-radius:3px;
  line-height:18px; background:var(--panel); color:var(--ink); white-space:pre;
}
.mmsxx-player .said span b{
  font-weight:400; font-size:10.5px; color:var(--dim); margin-right:5px;
}
.mmsxx-player .led{
  display:inline-flex; align-items:center; gap:5px;
  font-size:10.5px; color:var(--dim); white-space:nowrap;
}
.mmsxx-player .led::before{
  content:""; width:7px; height:7px; border-radius:50%;
  border:1px solid var(--line-hi); background:var(--panel);
}
/* 届いたものの控え。畳んでおく。番号はここでだけ出す(ランプは名前だけ) */
.mmsxx-player .cuelog{
  width:100%; max-height:92px; overflow:auto; margin-top:2px;
  background:var(--sunk); border:1px solid var(--line);
  padding:5px 8px; font-size:10.5px; color:var(--dim); line-height:1.5;
}
.mmsxx-player .cuelog div{ white-space:pre; }
.mmsxx-player .led.on::before{
  background:var(--amber); border-color:var(--amber);
}
/* いま鳴っているところの札(跳ぶ先の一覧)。押してあるかどうかとは別の話なので、
   地を反転させず、色と枠だけで言う */
.mmsxx-player .marks button.now{ border-color:var(--amber); color:var(--amber); }
.mmsxx-player button.sw[aria-pressed="true"]{
  background:var(--ink); color:var(--panel); border-color:var(--ink);
}
/* 題と解説。曲が名乗るものなので、押すところの外に置く */
.mmsxx-player .about{ margin:0 0 9px; }
.mmsxx-player .about b{ font-size:12px; font-weight:600; color:var(--ink); }
/* 題とバージョンの行。題は左、バージョンは右端。同じ曲を何度も直すので、
   いま鳴っているのがどれなのかが分かるようにする(#version)。
   1 行に並べるのに囲みが要る。b と span を並べただけだと、
   題が長いときにバージョンが下へ折り返す(2026-09-19) */
.mmsxx-player .about .head{
  display:flex; align-items:baseline; gap:10px;
}
.mmsxx-player .about .ver{
  margin-left:auto; font-size:10px; font-weight:400; color:var(--dim);
  white-space:nowrap;
}
/* いま効いている機械(#machine)。題の隣に置く。版を切り替えると変わるので、
   釣り合いが変わったことが見えるようにする。地を反転させないのは、
   押せるものではないため */
.mmsxx-player .about .mach{
  font-size:10px; color:var(--teal); letter-spacing:.04em; white-space:nowrap;
}
/* 版と組の押しどころ。チャンネルの並びと同じ形にする。
   版はラジオ(1 つだけ)、組はチェックボックス(重なる) */
.mmsxx-player .grp{ display:flex; flex-wrap:wrap; gap:6px 12px; align-items:center; }
.mmsxx-player .grp label{
  display:inline-flex; align-items:center; gap:5px; font-size:11px; cursor:pointer;
}
/* 版で黙っているチャンネル。行は消さずに薄くする。並びが動くと読みにくい。
   押せるままにすると、自分で消したのかどちらか分からなくなる */
.mmsxx-player .ch.gone{ opacity:.4; }
.mmsxx-player .ch.gone button{ cursor:default; }
.mmsxx-player .about p{
  margin:4px 0 0; font-size:11px; line-height:1.7; color:var(--dim);
  white-space:pre-line;
}
/* 書き出しているあいだの覆い。押すところを暗くして、進み具合だけ見せる。
   時間がかかるので、止まったように見えないようにする(2026-09-16) */
.mmsxx-player{ position:relative; }
.mmsxx-player.busy .deck{ opacity:.35; pointer-events:none; }
/* 帯はほかの押すところと似せない。太くして、色も分ける —
   琥珀は押せるもの、地の反転は入 / 切に使っているので、進み具合は青緑にする。
   数はその隣に大きく出す(2026-09-16) */
.mmsxx-player .veil{
  position:absolute; left:8px; right:8px; top:50%; transform:translateY(-50%);
  display:flex; align-items:center; gap:12px; z-index:3;
  padding:12px 14px; background:var(--panel); border:1px solid var(--line-hi);
  border-radius:3px; box-shadow:0 2px 10px rgba(0,0,0,.18);
}
.mmsxx-player .veil .bar{
  flex:1; height:16px; background:var(--sunk);
  border:1px solid var(--line-hi); border-radius:8px; overflow:hidden;
}
.mmsxx-player .veil .bar span{
  display:block; height:100%; width:0; background:var(--teal);
  transition:width .2s linear;
}
.mmsxx-player .veil .pct{
  font-size:15px; font-weight:600; color:var(--ink);
  min-width:52px; text-align:right; font-variant-numeric:tabular-nums;
}
/* 焼いたものを置くところ。枠の中では落とすのを断られることがあるので、
   音のプレイヤーに挿して、そちらの menu から保存してもらう(2026-09-16) */
.mmsxx-player .wavnote{ margin:9px 0 0; }
.mmsxx-player .got{ display:flex; align-items:center; gap:10px; margin:9px 0 0; }
.mmsxx-player .got audio{ flex:1; min-width:180px; height:32px; }
.mmsxx-player .got a{
  font-size:11px; color:var(--amber); text-decoration:none;
  border:1px solid var(--line-hi); border-radius:2px; padding:5px 9px; white-space:nowrap;
}
.mmsxx-player .got a:hover{ border-color:var(--amber); }
/* 渡された MML を読ませるところ。ページに重ねて出す。
   読むためのものなので、押しどころと同じ大きさだと字が小さすぎる。
   下が見えていると、鳴らしながら読めるように見えて、実際は押せない */
/* チャンネルごとに焼くときの問いかけ。読むためのものではなく選ぶものなので、
   MML を出す覆い(.srcwrap)と同じ置き方で、中身だけ縦に並べる */
.mmsxx-player .stemlist{
  display:flex; flex-direction:column; gap:5px;
  max-height:min(46vh, 320px); overflow:auto;
  padding:8px 9px; background:var(--sunk);
  border:1px solid var(--line); border-radius:2px;
}
.mmsxx-player .stemlist label{ display:flex; align-items:center; gap:7px; font-size:11.5px; }
.mmsxx-player .stemlist label .of{ color:var(--dim); font-size:10px; letter-spacing:.06em; }
.mmsxx-player .stemfoot{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.mmsxx-player .stemfoot .go{ margin-left:auto; }
/* 落としたものの並び。枠の中では落とすのを断られるので、1 本ずつ保存してもらう */
.mmsxx-player .stemgot{
  display:flex; flex-direction:column; gap:4px; margin:9px 0 0;
  max-height:min(36vh, 240px); overflow:auto; font-size:11px;
}
.mmsxx-player .stemgot div{ display:flex; align-items:center; gap:9px; }
.mmsxx-player .stemgot audio{ flex:1; min-width:140px; height:28px; }
.mmsxx-player .stemgot a{
  font-size:11px; color:var(--amber); text-decoration:none; white-space:nowrap;
  border:1px solid var(--line-hi); border-radius:2px; padding:3px 7px;
}
.mmsxx-player .srcwrap{
  position:fixed; inset:0; z-index:20; display:flex;
  align-items:center; justify-content:center; padding:20px;
  background:rgba(0,0,0,.45);
}
.mmsxx-player .srcbox{
  display:flex; flex-direction:column; gap:9px;
  width:min(900px, 100%); max-height:86vh; padding:12px 13px;
  background:var(--panel); border:1px solid var(--line-hi); border-radius:3px;
  box-shadow:0 4px 18px rgba(0,0,0,.3);
}
.mmsxx-player .srchead{ display:flex; align-items:center; gap:10px; }
.mmsxx-player .srchead button{ margin-left:auto; }
.mmsxx-player .src{
  flex:1; min-height:min(55vh, 420px); width:100%; padding:10px 11px;
  font-family:var(--mono); font-size:13px; line-height:1.7; color:var(--ink);
  background:var(--sunk); border:1px solid var(--line); border-radius:2px;
  resize:none; white-space:pre; overflow:auto;
}
/* 写した字を出すところ。写せない置き方があるので、必ず見えるようにする */
.mmsxx-player .out{
  display:block; width:100%; margin:9px 0 0; padding:8px 9px;
  font:inherit; font-size:11px; line-height:1.6; color:var(--ink);
  background:var(--sunk); border:1px solid var(--line); border-radius:2px;
  resize:vertical; white-space:pre; overflow:auto;
}
.mmsxx-player .note{ font-size:11px; color:var(--dim); margin:7px 0 0; }
/* 気をつけてほしいこと。琥珀。鳴らせてはいる */
.mmsxx-player .note.bad{ color:var(--amber); }
/* 直すところがあって、鳴らせないとき。既定は赤。
   琥珀は「押せる・鳴っている」に使っているので、止まっていることを同じ色で
   言うと読み分けられない。ページが --err を置けば、そちらが勝つ */
.mmsxx-player .note.err{ color:var(--err, #c62f26); }
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]) .mmsxx-player .note.err{ color:var(--err, #ff7a6e); }
}
:root[data-theme="dark"] .mmsxx-player .note.err{ color:var(--err, #ff7a6e); }
`;

/** 秒を m:ss に。桁がそろっていないと、見るたびに位置が動いて読みにくい */
const clock = (sec) => {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/**
 * プレイヤーを 1 つ置く。
 *
 * @param {HTMLElement} root 置く先。中身は入れ替わる
 * @param {object} [opts] 何を出して何を出さないか。省くと全部出る
 * @param {ChipTuneSound} [opts.audio] 外で作ったものを使い回す。省くと自分で作る
 * @param {string|string[]} [opts.mml] 鳴らす MML。チャンネルごとの並びでもよい
 * @param {object[]} [opts.data] MML の字を通さずに鳴らすもの。`compileMML()` が返す形の
 *   並びで、チャンネル 1 本につき 1 つ(Stave の木から組んだものなど)。
 *   渡すと `opts.mml` より先に効く。字が無いので、MML を見せる・写す・落とす押しどころは隠れる
 * @param {boolean} [opts.channels] チャンネルの押すところを出すか(既定 true)
 * @param {boolean} [opts.repeat] くり返しの押すところを出すか(既定 true)。
 *   消しても `audio.ignoreSongLoop` は変わらず効く
 * @param {boolean|'show'} [opts.copy] 選んだ範囲の MML をどう渡すか。
 *   `true`(既定)は写して欄にも出す。`'show'` は欄に出すだけ。
 *   `false` は押すところを出さない
 * @param {boolean} [opts.open] 畳んであるところを最初から開けておくか(既定 false)。
 *   チャンネル・選択肢・跳ぶ先を見せたいページで使う
 * @param {boolean} [opts.about] 曲の題と解説を出すか(既定 true)。
 *   中身は MML の `#title` と `#version` と `#about`
 * @param {number} [opts.loops] 本編を何周するか。`audio.loopTimes` に入る。
 *   書かなければエンジンの既定(2)のまま
 * @param {boolean} [opts.repeatAll] 曲ぜんぶを鳴らし終えたあと、また頭から鳴らすか
 *   (既定 false)。`audio.ignoreSongLoop` の裏返し
 * @param {boolean} [opts.volume] 音量のスライダーを出すか(既定 true)
 * @param {boolean} [opts.mute] 黙らせるボタンを出すか(既定 false)。
 *   出すと、音量のスライダーとひとつながりに並ぶ
 * @param {boolean} [opts.showMml] `Show MML` の押しどころを出すか(既定 true)。
 *   押すと、渡された MML がページに重なって大きな欄で出る
 * @param {boolean} [opts.saveMml] `↓ MML` の押しどころを出すか(既定 true)。
 *   `false` にすると、押しどころを消すだけでなく、落とす仕掛けそのものを作らない。
 *   CSS で隠すのとは違って、あとから押せる道が残らない
 * @param {boolean} [opts.ignoreErrors] `Ignore errors` の押しどころを出すか
 *   (既定 false)。読めないところを落として鳴らす切り替えで、MML を書いている
 *   あいだにしか要らない。鳴らすだけの人には、押せるのに押す理由が無い
 * @param {number} [opts.cutGap] 網の目(`#switch`)の線を引くのをやめる間隔(ドット)。
 *   隣り合う線の間がこれを下回ると引かない。既定 1(ほぼ全部引く)
 * @returns {object} 外から呼ぶところ
 */
export function mountPlayer(root, opts = {}) {
  const audio = opts.audio || new ChipTuneSound();
  // 網の目の線を省きはじめる間隔。既定は 1 ドットで、ほぼ全部引く。
  // 前は 12 ドットで切っていたが、線が消えたり出たりするほうが分かりにくかった
  //(2026-09-18)
  const cutGap = Number.isFinite(Number(opts.cutGap)) ? Number(opts.cutGap) : 1;
  // 名前は 1 つに決めておく。同じページに 2 つ置いても、鳴るのは後のほう
  const NAME = '__player__';

  root.classList.add('mmsxx-player');
  root.textContent = '';
  root.innerHTML = `
    <div class="srcwrap" data-p="stemwrap" hidden>
      <div class="srcbox">
        <div class="srchead">
          <span class="lbl">Export per channel</span>
          <span class="lbl" data-p="stemnote"></span>
          <button type="button" data-p="stemclose">Close</button>
        </div>
        <div class="stemlist" data-p="stemlist"></div>
        <div class="stemfoot">
          <button type="button" class="sw" data-p="stemall" aria-pressed="true"
                  title="Pick every channel">All</button>
          <label class="sw"><input type="checkbox" data-p="stemfx">Apply #fx</label>
          <button type="button" class="go" data-p="stemgo">Export</button>
        </div>
        <p class="note" data-p="stemhint"></p>
        <div class="stemgot" data-p="stemgot" hidden></div>
      </div>
    </div>
    <div class="srcwrap" data-p="srcwrap" hidden>
      <div class="srcbox">
        <div class="srchead">
          <span class="lbl">MML</span>
          <span class="lbl" data-p="srcsize"></span>
          <button type="button" data-p="srcclose">Close</button>
        </div>
        <textarea class="src" data-p="src" readonly
                  aria-label="The MML this player was given"></textarea>
      </div>
    </div>
    <div class="about" data-p="about" hidden>
      <div class="head"><b data-p="title"></b><span class="mach" data-p="mach" hidden></span><span class="ver" data-p="songver" hidden></span></div>
      <p data-p="abouttext"></p>
    </div>
    <div class="deck">
      <div class="row">
        <button type="button" data-p="play">Play</button>
        <button type="button" data-p="stop">Stop</button>
        <span class="track" data-p="track">
          <input type="range" data-p="seek" min="0" max="1000" value="0" step="1"
                 aria-label="Position">
          <span class="cuts" data-p="cuts"></span>
          <span class="abspan" data-p="abspan" hidden></span>
          <span class="ab off" data-p="abA" data-n="A" role="slider"
                aria-label="Repeat from"></span>
          <span class="ab off" data-p="abB" data-n="B" role="slider"
                aria-label="Repeat to"></span>
        </span>
        <span class="time"><b data-p="now">0:00</b> / <span data-p="len">0:00</span></span>
        <span class="lbl" data-p="vollbl">Volume</span>
        <span class="vol" data-p="volwrap">
          <button type="button" data-p="mute" aria-pressed="false" hidden>Mute</button>
          <input type="range" data-p="vol" min="0" max="100" value="100" step="1"
                 aria-label="Volume">
        </span>
      </div>
      <div class="row" data-p="deck2">
        <button type="button" class="sw" data-p="rept" aria-pressed="true">Repeat all</button>
        <label class="pick" data-p="looplbl">Main loops
          <select data-p="loops"></select>
        </label>
        <button type="button" class="sw" data-p="stereo" aria-pressed="true"
                title="Export the WAV in stereo. Turn it off for mono.">Stereo</button>
        <button type="button" data-p="wav" title="Export WAV">&darr; WAV</button>
        <button type="button" data-p="stems"
                title="Export one WAV per channel, to mix in other software"
                >&darr; Stems</button>
        <button type="button" data-p="level"
                title="Measure the loudness and suggest a #gain. It does not change the sound"
                >Level</button>
        <button type="button" data-p="mml" title="Export MML">&darr; MML</button>
        <button type="button" class="sw" data-p="showmml" aria-pressed="false"
                aria-expanded="false" title="Show the MML this player was given"
                >Show MML</button>
        <button type="button" class="dots" data-p="open" aria-pressed="false"
                aria-expanded="false" aria-label="More" title="More">&hellip;</button>
        <span class="ver-wrap">
          <button type="button" class="help" data-p="help" aria-pressed="false"
                  aria-expanded="false" aria-label="About" title="About">?</button>
          <span class="about-ver" role="status" data-p="ver" hidden></span>
        </span>
      </div>
      <div class="row" data-p="textrow" hidden>
        <span class="saidwrap">
          <span class="lbl">Text</span>
          <span class="said" data-p="said"></span>
        </span>
      </div>
      <p class="note bad wavnote" data-p="wavnote" hidden></p>
      <div class="got" data-p="got" hidden>
        <audio controls data-p="audio"></audio>
        <a data-p="save" download>Save</a>
      </div>
      <div class="fold" data-p="fold" hidden>
      <div class="row" data-p="markrow" hidden>
        <span class="lbl">Jump to</span>
        <span class="marks" data-p="marks"></span>
      </div>
      <div class="row" data-p="takerow" hidden>
        <span class="lbl">Takes</span>
        <span class="takes" data-p="takes"></span>
        <button type="button" class="sw wide" data-p="rew" aria-pressed="false"
                title="Always restart the block, whatever the tune says. Applies to every group"
                >From top</button>
      </div>
      <div class="row" data-p="fxrow" hidden>
        <span class="lbl">Effects</span>
        <span class="marks" data-p="fx"></span>
      </div>
      <div class="row" data-p="edrow" hidden>
        <span class="lbl">Edition</span>
        <span class="grp" data-p="eds"></span>
      </div>
      <div class="row" data-p="setrow" hidden>
        <span class="lbl">Sets</span>
        <span class="grp" data-p="sets"></span>
      </div>
      <div class="row" data-p="chsrow">
        <span class="lbl" data-p="chslbl">Channels</span>
        <span class="chs" data-p="chs"></span>
        <span class="chmode">
          <button type="button" class="sw" data-p="volsw" aria-pressed="false"
                  title="Set each channel's volume. It also goes into the WAV.">Volume</button>
          <button type="button" data-p="volreset" hidden
                  title="Put every channel back to 100%.">Reset</button>
        </span>
      </div>
      <div class="row" data-p="cuerow" hidden>
        <span class="lbl">Cues</span>
        <span class="leds" data-p="leds"></span>
        <button type="button" class="sw" data-p="logsw" aria-pressed="false"
                aria-expanded="false">Log</button>
      </div>
      <div class="row" data-p="logrow" hidden>
        <span class="lbl"></span>
        <div class="cuelog" data-p="cuelog"></div>
      </div>
      <div class="row" data-p="looserow">
        <label class="sw"><input type="checkbox" data-p="loose"> Ignore errors</label>
        <span class="lbl" data-p="loosenote"></span>
      </div>
      <div class="row" data-p="abrow">
        <label class="sw"><input type="checkbox" data-p="abOn"> A &ndash; B</label>
        <button type="button" data-p="setA" title="Set A to the current position">Set A</button>
        <input type="number" data-p="abFrom" aria-label="Repeat from"
               min="0" step="0.1" placeholder="0">
        <span class="lbl">&ndash;</span>
        <input type="number" data-p="abTo" aria-label="Repeat to"
               min="0" step="0.1" placeholder="0">
        <button type="button" data-p="setB" title="Set B to the current position">Set B</button>
        <span class="lbl">sec</span>
        <button type="button" data-p="copy">Copy selection as MML</button>
      </div>
      </div>
    </div>
    <div class="veil" data-p="veil" hidden>
      <div class="bar"><span data-p="barfill"></span></div>
      <span class="pct" data-p="pct">0%</span>
      <button type="button" data-p="cancel">Cancel</button>
    </div>
    <textarea class="out" data-p="out" rows="6" readonly hidden
              aria-label="MML of the selection"></textarea>
    <p class="note" data-p="note"></p>
  `;
  const $ = (k) => root.querySelector(`[data-p="${k}"]`);
  const el = {
    play: $('play'), stop: $('stop'), seek: $('seek'), now: $('now'), len: $('len'),
    rept: $('rept'), chs: $('chs'), marks: $('marks'), markrow: $('markrow'),
    takes: $('takes'), takerow: $('takerow'),
    note: $('note'), deck2: $('deck2'), chslbl: $('chslbl'),
    volsw: $('volsw'), volreset: $('volreset'),
    open: $('open'), fold: $('fold'), chsrow: $('chsrow'), cuts: $('cuts'),
    fx: $('fx'), fxrow: $('fxrow'), rew: $('rew'),
    loose: $('loose'), loosenote: $('loosenote'), looserow: $('looserow'),
    leds: $('leds'), cuerow: $('cuerow'),
    said: $('said'), textrow: $('textrow'),
    logsw: $('logsw'), logrow: $('logrow'), cuelog: $('cuelog'),
    help: $('help'), ver: $('ver'),
    loops: $('loops'), looplbl: $('looplbl'),
    abrow: $('abrow'), abOn: $('abOn'), abFrom: $('abFrom'), abTo: $('abTo'),
    setA: $('setA'), setB: $('setB'),
    copy: $('copy'), out: $('out'), wav: $('wav'), stereo: $('stereo'), mml: $('mml'),
    level: $('level'),
    showmml: $('showmml'), src: $('src'), srcwrap: $('srcwrap'),
    stems: $('stems'), stemwrap: $('stemwrap'), stemlist: $('stemlist'),
    stemall: $('stemall'), stemfx: $('stemfx'), stemgo: $('stemgo'),
    stemclose: $('stemclose'), stemnote: $('stemnote'), stemhint: $('stemhint'),
    stemgot: $('stemgot'),
    srcclose: $('srcclose'), srcsize: $('srcsize'),
    veil: $('veil'), barfill: $('barfill'), pct: $('pct'), cancel: $('cancel'),
    got: $('got'), audio: $('audio'), save: $('save'), wavnote: $('wavnote'),
    track: $('track'), abA: $('abA'), abB: $('abB'), abspan: $('abspan'),
    volwrap: $('volwrap'), vol: $('vol'), mute: $('mute'), vollbl: $('vollbl'),
    about: $('about'), title: $('title'), abouttext: $('abouttext'),
    songver: $('songver'), mach: $('mach'),
    edrow: $('edrow'), eds: $('eds'), setrow: $('setrow'), sets: $('sets'),
  };
  // 押すところを消しても、呼ぶところは残る
  const showChs = opts.channels !== false;
  const showRept = opts.repeat !== false;
  // 音量と黙らせるところ。2 つとも出すときは、ひとつながりに見せる。
  // 離して並べると、どちらが何に効くのか読めない(2026-09-15)
  // 題と解説。曲が持っていれば出す(`#title` と `#about`)
  const showAbout = opts.about !== false;
  // 黙らせるほうは既定で出さない。音量を 0 にすれば足りるので、
  // ふだんは押すところが 1 つ減るほうがよい(2026-09-15)
  // MML の持ち出し方。`true` は写して欄にも出す、`'show'` は欄に出すだけ、
  // `false` は押すところごと出さない。枠の中に置かれたページは写す先へ
  // 手が届かないことがあるので、出すだけの道を選べるようにした(2026-09-15)
  const copyMode = opts.copy === undefined ? true : opts.copy;
  // MML を落とせるか。`false` なら押しどころを外して、仕掛けも作らない。
  // CSS で隠すと押せる道が残るので、そもそも無いことにする(2026-10-24)
  const canSaveMml = opts.saveMml !== false;
  // 書いたとおりの MML を読ませる押しどころ。読ませる気の無いページや、
  // 字を出す場所の無いところでは切る(2026-09-18)
  // 字を持たないもの(`opts.data`)を鳴らしているときは、MML を見せる・写す・落とす
  // 押しどころを隠す。押しても出すものが無い
  const srcButtons = () => {
    el.showmml.hidden = opts.showMml === false || data !== null;
    if (el.mml) el.mml.hidden = data !== null;
    el.copy.hidden = copyMode === false || data !== null;
  };
  // 読めないところを落として鳴らす切り替え。既定では出さない。
  // 直しながら書く人のためのもので、鳴らすだけの人には要らない(2026-09-19)
  el.looserow.hidden = opts.ignoreErrors !== true;
  const showVol = opts.volume !== false;
  const showMute = opts.mute === true;
  el.vol.hidden = !showVol;
  el.mute.hidden = !showMute;
  if (copyMode === 'show') el.copy.textContent = 'Show selection as MML';
  el.vollbl.hidden = !showVol && !showMute;
  el.volwrap.hidden = !showVol && !showMute;
  el.volwrap.classList.toggle('joined', showVol && showMute);
  el.rept.hidden = !showRept;
  // 数を選ぶところは札ごと消す。中の select だけ消すと札が残る
  el.looplbl.hidden = !showRept;
  el.chsrow.hidden = !showChs;
  el.deck2.hidden = !showRept;

  // 書き出しているあいだは true。押すところを止めて、覆いを出す
  let busy = false;
  let quit = false;
  let wavURL = null;
  // 枠の中に置かれているか。artifact は sandbox 付きの iframe なので、
  // 落とすのを黙って断られる。そのときは音のプレイヤーに挿して渡す(2026-09-16)
  const inFrame = (() => {
    try { return window.self !== window.top; } catch { return true; }
  })();

  // 切ってあるエフェクトの控え。戻すときに要る。`{ ch: 設定 }`
  const fxOff = {};
  // 選択肢を押したときの振る舞い。既定は曲の指定どおり(`#takes mood restart`)。
  // 入れると、曲が何と言っていても囲みの頭から鳴らし直す(2026-09-17)
  let restart = false;
  // 読めないところで止めるか、落として鳴らすか。既定は止める(2026-09-18)
  let loose = false;
  // 畳んでおくもの。チャンネル・AB リピート・跳ぶ先は、ふだんは要らない。
  // 出したままだと、鳴らすだけの人にも押すところが 3 段ぶん並ぶ(2026-09-15)
  let open = opts.open === true;
  const fold = () => {
    el.fold.hidden = !open;
    // 開けたときに数え直す。エフェクトは外から掛けるものなので、
    // 畳んでいるあいだに増えていることがある(2026-09-17)
    if (open) drawFx();
    clearNote();
    // 畳むときは MML の欄も一緒に閉じる。開けたままだと、押すところを
    // しまったのに字だけ残る(2026-09-15)
    if (!open) { el.out.hidden = true; dropWAV(); }
    el.open.setAttribute('aria-pressed', String(open));
    el.open.setAttribute('aria-expanded', String(open));
  };

  // 周回数。書かれたときだけ入れる。エンジンの既定が 2 になったので、
  // ここで別の数を持つと 2 か所が食い違う(2026-09-24)
  if (opts.loops > 0) audio.loopTimes = opts.loops;
  // 曲ぜんぶのくり返しは、既定で切。周回数ぶん鳴ったら終わるほうが、
  // 聞く人には分かりやすい(2026-09-16)
  audio.ignoreSongLoop = opts.repeatAll !== true;

  let marks = [];
  let cuts = { grid: [], bars: [] };
  // 曲の作り。戻る先と後奏の始まり(秒)。どちらも書いていなければ null
  let loopAt = null, outroAt = null;
  // 曲に置いてある合図(`#cue`)と、ランプの置き場。
  // 消す時刻を名前ごとに覚えておく
  // 字を出しておく秒数。来なければこれで消える。
  // **エンジンは渡してこない。**いつ消すかは画面の都合という決まりなので、
  // ここが持つ(docs/DYNAMIC.md)
  const TEXT_HOLD = 4;
  // 鳴らした秒の合計。字を消すのはこちらで数える。
  // **止めているあいだは進まない。**壁の時計で数えると、ポーズ中に消えてしまう
  let played = 0;
  let cues = [];
  // 曲に置いた字(`"…"`)。チャンネル番号つきで並んでいる
  let texts = [];
  // いま出している字。チャンネル → { text, 消すタイマー }
  const said = new Map();
  const leds = new Map();
  let lastPos = 0;
  let takes = [];
  let dragging = false;
  // 止めているあいだの頭出し。エンジンは鳴っていないと跳べないので、
  // どこから鳴らすかだけ覚えておいて、Play のときに渡す(2026-09-15)
  let from = 0;
  let mml = opts.mml ?? '';
  // 読み終えた中間データ。あれば MML の字より先に使う
  let data = opts.data ?? null;
  // 鳴らす前から出せるもの。チャンネルも跳ぶ先も長さも、MML を読めば分かる。
  // 押してからでないと出ないと、何が入っているのかを見るのに鳴らすことになる
  // (2026-09-15)
  let voices = [];
  // 中の層を開いてあるチャンネル。開き具合は画面の都合なので、こちらが持つ
  // (止めてあるかどうかはエンジンが持っている)
  const openLanes = new Set();
  let chans = [];
  // チャンネルの行が音量のスライダーになっているか。ふだんはミュートのボタン
  let volMode = false;
  // 版と組(`#group`)。何を選んでいて、どのチャンネルが黙るか。
  // 選び方はエンジンが持つので、こちらは読んだものを持つだけ
  let groups = { groups: [], group: null, sets: [], silent: [], machine: null };
  let total = 0;
  // AB リピートの範囲。切ってあるあいだも覚えておく(入れ直せるように)。
  // 効いているかどうかはエンジンが持つ(`bgmRange()`)
  let abFrom = 0;
  let abTo = 0;

  /**
   * 下に 1 行出す。
   *
   * @param {string} text 出す字
   * @param {'bad'|'err'} [kind] bad = 気をつけてほしいこと(琥珀)。
   *   err = 直すところがあって鳴らせない(赤)
   */
  const say = (text, kind) => {
    el.note.textContent = text || '';
    el.note.className = kind ? `note ${kind}` : 'note';
  };
  /**
   * 下の 1 行を空に戻す。直すところがあるときの字(`bad` / `err`)は消さない。
   *
   * 前はここにチャンネルの数(`4 channels`)を出していた。やめた。
   * 畳んでいても開けても、数を知りたい場面が無い(2026-09-19)。
   */
  const clearNote = () => {
    if (el.note.classList.contains('bad') || el.note.classList.contains('err')) return;
    say('');
  };

  /**
   * 曲を差し替えたあと、読み直して描き直す。鳴っているものは止まる。
   */
  function reload() {
    audio.stopBGM();
    // 黙らせたものを戻す。エンジンは番号で覚えているので、置いたままだと
    // 別の曲の同じ番号のチャンネルが黙る。曲を替えたら 2 本目が消えていた
    // (2026-09-19)。層と合図も同じ覚え方なので、まとめて戻す
    audio.muteTracks([]);
    for (const { ch, lane } of audio.mutedLanes()) audio.muteLane(ch, lane, false);
    for (const t of chans) audio.muteCues(t.ch, false);
    // 開いてあった中身も閉じる。番号が同じでも、別のチャンネルになる
    openLanes.clear();
    from = 0;
    el.out.hidden = true;
    dropWAV();
    read();
    drawGroups();
    drawChannels();
    drawMarks();
    drawTakes();
    drawFx();
    drawLeds();
    clearTexts();
    drawCuts();
    draw();
    srcButtons();
  }

  /**
   * いまの MML をエンジンへ渡して、分かったことを受け取る。まだ鳴らさない。
   *
   * チャンネルの名前も、跳ぶ先も、長さも、`defineBGM()` を通した時点で
   * 決まっている。だからここでコンパイルし直さない。同じものを 2 回読むと、
   * 読み方が食い違ったときにどちらが本当か分からなくなる(2026-09-15)。
   */
  function read() {
    voices = data ? [] : Array.isArray(mml)
      ? mml.map((v) => String(v ?? '')).filter((v) => v.trim() !== '')
      : splitVoices(mml);
    chans = [];
    marks = [];
    total = 0;
    if (data ? !data.length : !voices.length) { say('Nothing to play.', 'err'); return false; }
    let got = null;
    try {
      // 字を持たないものは、組み立て済みとして渡す。あとは同じ bgmInfo() から読む
      if (data) audio.defineBGMData(NAME, data);
      // 読めないところで止めるか、落として鳴らすか。既定は止める
      else audio.defineBGM(NAME, voices, loose ? { mode: 'loose' } : {});
      got = audio.bgmInfo(NAME);
    } catch (e) {
      say(String(e && e.message ? e.message : e), 'err');
      return false;
    }
    chans = got.tracks;
    // ラベルはエンジンが並べたものをそのまま出す。曲の頭(START)を足すのも、
    // 予約語を並べるかどうかも、あちらが決める(2026-09-16)
    marks = got.marks;
    cuts = got.switches || { grid: [], bars: [] };
    loopAt = got.loop ? got.loop.from : null;
    outroAt = got.outro ?? null;
    cues = got.cues ?? [];
    texts = got.texts ?? [];
    takes = got.takes ?? [];
    total = got.total;
    if (!got.active) {
      // 直すところがある曲は鳴らせない。何が悪いかはエンジンが言っている
      say(got.errors.map((e) => e.text).join(' / '), 'err');
      return false;
    }
    // 版と組。選んでいなければ曲の既定(先に出てきた版、組は全部 on)
    groups = audio.bgmGroups(NAME)
      || { groups: [], group: null, sets: [], silent: [], machine: null };
    // 題と解説は曲が持っている。こちらでは書き換えない
    const meta = got.meta || {};
    el.title.textContent = meta.title || '';
    el.songver.textContent = meta.version ? `ver ${meta.version}` : '';
    el.songver.hidden = !meta.version;
    el.abouttext.textContent = meta.about || '';
    el.abouttext.hidden = !meta.about;
    el.about.hidden = !showAbout
      || !(meta.title || meta.about || meta.version || machineText());
    // 指示行の古い書き方。いまは両方読むので、鳴らすぶんには何も起きない。
    // 言うのはここで、エンジンからは言わない。あちらの警告に載せると
    // strict が止まり、いまある曲がぜんぶ鳴らなくなる(2026-09-19)
    // 数えるのは切る前の MML。splitVoices() は `#` を `// #` へ直して返すので、
    // 切ったあとを数えると新しい書き方の行まで数えてしまう。先頭の注釈も
    // チャンネルの数だけ写るので、古い書き方でも件数が膨らんでいた
    const old = Array.isArray(mml)
      ? mml.reduce((n, v) => n + countOldStyle(v), 0) : countOldStyle(mml);
    if (old) {
      console.warn(`[ChpTnSnd] MML: 指示行の "// #" が ${old} 行あります。`
        + '"#" だけで書けます("// #" はいずれ読まなくなります)');
    }
    // 前に出した「直すところがある」の字を消す。読めた時点で用が済んでいる。
    // 消し忘れていたので、直したのにエラーが出たままになっていた(2026-09-19)
    say('');
    drawLoose(got.problems || []);
    return true;
  }

  /**
   * 落としたところの数。何を落としたかは `bgmInfo(name).problems` にある。
   *
   * 数だけ出す。中身をここへ並べると、鳴らすための押しどころが埋まる
   * (読むためのものは道具の側にある)。
   */
  function drawLoose(list) {
    const bad = list.filter((x) => x.level === 'error').length;
    const soft = list.length - bad;
    if (!list.length) { el.loosenote.textContent = ''; return; }
    const part = [];
    if (bad) part.push(`${bad} dropped`);
    if (soft) part.push(`${soft} warned`);
    el.loosenote.textContent = part.join(', ');
  }

  /**
   * いま効いている機械の字。出さないときは空。
   *
   * 何も宣言していない曲と `default` のときは出さない。「default」と出ても
   * 読む側には何も分からない。毎回聞き直すので、版を切り替えれば追いかける
   */
  function machineText() {
    const m = groups.machine;
    return (!m || m === 'default') ? '' : m;
  }

  /** 版で黙っているチャンネルか。自分で黙らせたものとは別に持つ */
  const goneCh = (ch) => (groups.silent || []).includes(ch);

  /**
   * 版と組の押しどころ(`#group`)。
   *
   * 版はラジオで 1 つだけ、組はチェックボックスで重なる。どちらも 2 つ以上
   * あるときだけ出す。1 つしか無ければ選ぶものが無い。
   * 全部鳴らす押しどころは出さない。版は排他なので、重ねてもうるさいだけ。
   */
  function drawGroups() {
    const list = groups.groups || [];
    const eds = list.map((g) => g.name);
    const here = list.find((g) => g.name === groups.group);
    const sets = here ? here.sets : [];
    el.edrow.hidden = eds.length < 2;
    el.setrow.hidden = sets.length < 2;
    el.eds.textContent = '';
    el.sets.textContent = '';
    for (const name of eds) {
      const lab = document.createElement('label');
      const i = document.createElement('input');
      i.type = 'radio';
      i.name = 'mmsxx-edition';
      i.value = name;
      i.checked = name === groups.group;
      // 押し替えは鳴らしたまま。止めて鳴らし直すと比べられない
      i.addEventListener('change', () => { pickGroups({ group: name }); });
      lab.append(i, document.createTextNode(name));
      el.eds.appendChild(lab);
    }
    for (const name of sets) {
      const lab = document.createElement('label');
      const i = document.createElement('input');
      i.type = 'checkbox';
      i.value = name;
      i.checked = (groups.sets || []).includes(name);
      i.addEventListener('change', () => {
        const on = [...el.sets.querySelectorAll('input')]
          .filter((x) => x.checked).map((x) => x.value);
        pickGroups({ sets: on });
      });
      lab.append(i, document.createTextNode(name));
      el.sets.appendChild(lab);
    }
  }

  /** 版か組を選び直す。エンジンが差し替えて、こちらは見た目を合わせる */
  function pickGroups(pick) {
    groups = audio.selectGroups(NAME, pick) || groups;
    drawGroups();
    drawChannels();
    draw();
  }

  /**
   * その行だけを残す。すでにその行だけなら全部戻す。
   *
   * 版で黙っている行(`goneCh`)は数に入れない。もともと鳴らないので、
   * 黙らせたかどうかで「その行だけ」の判定が変わってしまう
   */
  function soloTrack(ch) {
    const live = chans.filter((t) => !goneCh(t.ch)).map((t) => t.ch);
    const solo = !audio.isMuted(ch)
      && live.every((c) => c === ch || audio.isMuted(c));
    audio.muteTracks(solo ? [] : live.filter((c) => c !== ch));
  }

  /** チャンネルのボタン。ラベルと役割は MML の注釈から来る */
  function drawChannels() {
    el.chs.textContent = '';
    el.volsw.setAttribute('aria-pressed', String(volMode));
    el.volreset.hidden = !volMode;
    if (volMode) { drawVolumes(); return; }
    for (const t of chans) {
      const wrap = document.createElement('span');
      wrap.className = 'ch';
      // 版で黙っている行は薄くする。行は消さない(並びが動くと読みにくい)
      if (goneCh(t.ch)) wrap.classList.add('gone');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sw';
      b.dataset.ch = String(t.ch);
      b.setAttribute('aria-pressed', String(!audio.isMuted(t.ch)));
      b.textContent = t.name || `ch${t.ch + 1}`;
      // 押したらエンジンへ言うだけ。形は draw() が合わせる
      // 版で黙っている行は押せなくする。自分で消したのか版で消えたのかが
      // 分からなくなるため。押した内容は残るので、版を戻せば押したまま
      b.disabled = goneCh(t.ch);
      // Ctrl(Mac は Cmd)を押しながらなら、その行だけを残す。
      // すでにその行だけなら全部戻す。1 本を聞き分けるのに、
      // ほかの行を 1 つずつ押していくのが手間だった
      b.addEventListener('click', (e) => {
        if (e.ctrlKey || e.metaKey) soloTrack(t.ch);
        else audio.muteTrack(t.ch);
        draw();
      });
      // 和音を鳴らすチャンネルだけ、同時に何声使うかを出す。
      // 重ねは 1 つの音を厚くするだけなので数えない。和音は別の音を並べるので、
      // 実機では本当に何本か要る(2026-09-18)。
      // ボタンの中に入れる。隣に置くと、名前と数が別のものに見える
      if (t.chords && t.voices > 1) {
        wrap.classList.add('multi');
        const n = document.createElement('span');
        n.className = 'voices';
        n.textContent = `×${t.voices}`;
        b.title = `${t.voices} voices at once`;
        b.appendChild(n);
      }
      wrap.appendChild(b);
      // 中に層があれば開ける。ドラムの字と、和音の声ごとの楽器。
      // まとめて止めるのは上のボタンのまま。こちらは中を 1 つずつ
      if ((t.lanes || []).length > 1) {
        const o = document.createElement('button');
        o.type = 'button';
        o.className = 'open';
        o.setAttribute('aria-pressed', String(openLanes.has(t.ch)));
        o.textContent = openLanes.has(t.ch) ? '\u25be' : '\u25b8';
        o.title = openLanes.has(t.ch) ? 'Hide the parts inside' : 'Show the parts inside';
        o.addEventListener('click', () => {
          if (openLanes.has(t.ch)) openLanes.delete(t.ch); else openLanes.add(t.ch);
          // 行そのものが増え減りするので、並べ直す。`draw()` は押し具合を
          // 合わせるだけで、ボタンを作り直さない
          drawChannels();
          draw();
        });
        wrap.appendChild(o);
      }
      // 音量を動かしてある行は、その値を小さく添える。ボタンの側からは
      // 見えないと、黙っているのに押してあるように見える(2026-09-28)
      const v = audio.trackVolume(t.ch);
      if (v !== 1) {
        const n = document.createElement('span');
        n.className = 'lvl' + (v > 0 ? '' : ' off');
        n.textContent = `${Math.round(v * 100)}%`;
        n.title = 'Set on the Volume side';
        wrap.appendChild(n);
      }
      if (t.role) {
        const r = document.createElement('span');
        r.className = 'role';
        r.textContent = t.role;
        wrap.appendChild(r);
      }
      el.chs.appendChild(wrap);
      if (openLanes.has(t.ch)) el.chs.appendChild(laneRow(t));
    }
  }

  /**
   * チャンネルの音量のスライダー。ミュートのボタンと入れ替わりに出る。
   *
   * MML の `v` とは関係なく、鳴らす側で掛ける倍率。曲のバランスを探るためのもので、
   * 100% より上げられる。場所を取るので、ふだんはミュートのボタンを出しておき、
   * Volume を押したときだけこちらにする(2026-09-28)。値はエンジンが持つ
   */
  function drawVolumes() {
    for (const t of chans) {
      const wrap = document.createElement('label');
      wrap.className = 'ch chvol';
      // 鳴っているところを光らせるのに要る。ミュートのボタンと同じ仕組み
      wrap.dataset.ch = String(t.ch);
      // 黙らせてある行と、版で黙っている行は薄くする。ここで黙っていることが
      // 見えないと、100% と出ているのに音が出ない、という嘘になる(2026-09-28)。
      // スライダーは触れる。ここで直すのは音量で、黙っているのは別の話
      const off = audio.isMuted(t.ch) || goneCh(t.ch);
      if (off) wrap.classList.add('gone');
      const name = document.createElement('span');
      name.className = 'name';
      name.textContent = t.name || `ch${t.ch + 1}`;
      const r = document.createElement('input');
      r.type = 'range';
      r.min = '0';
      r.max = '200';
      r.step = '5';
      r.dataset.chvol = String(t.ch);
      r.value = String(Math.round(audio.trackVolume(t.ch) * 100));
      r.disabled = goneCh(t.ch);
      const pct = document.createElement('span');
      pct.className = 'pct';
      // 黙らせてあるなら、そう言う。数字だけだと鳴るように見える
      const say = () => {
        pct.textContent = audio.isMuted(t.ch) ? 'muted' : `${r.value}%`;
      };
      say();
      r.addEventListener('input', () => {
        audio.setTrackVolume(t.ch, Number(r.value) / 100);
        say();
      });
      wrap.append(name, r, pct);
      el.chs.appendChild(wrap);
    }
  }

  el.volsw.addEventListener('click', () => {
    volMode = !volMode;
    drawChannels();
    draw();
  });
  el.volreset.addEventListener('click', () => {
    audio.resetTrackVolumes();
    drawChannels();
  });

  /** 開いたチャンネルの中身。層ごとに 1 つずつ止められる */
  function laneRow(t) {
    const row = document.createElement('span');
    row.className = 'lanes';
    const of = document.createElement('span');
    of.className = 'of';
    of.textContent = t.name || `ch${t.ch + 1}`;
    row.appendChild(of);
    for (const lane of t.lanes) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sw';
      b.dataset.lane = `${t.ch}/${lane.name}`;
      b.setAttribute('aria-pressed', String(!lane.muted));
      b.textContent = lane.label || lane.name;
      // 押すのは MML に書いた字のほう。呼び名は画面に出すだけ
      if (lane.label && lane.label !== lane.name) b.title = lane.name;
      b.addEventListener('click', () => { audio.muteLane(t.ch, lane.name); draw(); });
      row.appendChild(b);
    }
    return row;
  }

  /**
   * 本編を何周するか。`∞` はずっと。
   *
   * 曲ぜんぶのくり返し(Repeat)とは別のもの。あちらは終わったらまた頭から、
   * こちらは本編を何周してから抜けるか(2026-09-15)
   */
  const LOOPS = [['1', 1], ['2', 2], ['3', 3], ['4', 4], ['8', 8], ['Endless', Infinity]];
  function drawLoops() {
    el.loops.textContent = '';
    for (const [label, n] of LOOPS) {
      const o = document.createElement('option');
      o.value = String(n);
      o.textContent = label;
      el.loops.appendChild(o);
    }
    el.loops.value = String(audio.loopTimes);
  }

  /**
   * 切れ目の線。曲を替えてよい場所を、位置のスライダーの上へ引く。
   *
   * 押せるようにはしない。見て分かればよいもので、押すところが増えると
   * 位置のスライダーを掴みにくくなる(2026-09-16)。
   *
   * 網の目(`#switch`)は薄く引く。隣り合う間が `opts.cutGap` ドットを下回ったときだけ
   * 引かない。既定は 1 ドットなので、ふだんは全部引く。手で引いた `|` は数が少ないので、
   * 濃くして常に引く。
   */
  function drawCuts() {
    el.cuts.textContent = '';
    const span = audio.bgmLength() || total;
    if (span <= 0) return;
    const wide = el.track ? el.track.clientWidth : 0;
    const line = (t, cls) => {
      const i = document.createElement('i');
      i.className = cls;
      i.style.left = `${Math.max(0, Math.min(100, (t / span) * 100))}%`;
      el.cuts.appendChild(i);
    };
    // 隣り合う間が `cutGap` ドットを切ったら、網の目は引かない
    const step = cuts.grid.length > 1 ? cuts.grid[1] - cuts.grid[0] : span;
    if (wide > 0 && (step / span) * wide >= cutGap) {
      for (const t of cuts.grid) line(t, 'grid');
    }
    for (const t of cuts.bars) line(t, 'bar');
    // 曲の作りの線。切れ目より数が少ないので、狭くても引く
    if (loopAt != null && loopAt > 0) line(loopAt, 'loop');
    if (outroAt != null) line(outroAt, 'outro');
  }

  /**
   * 鳴らすときに掛けているエフェクト(`audio.dynamic_effects`)。
   *
   * 掛かっているチャンネルだけ並べて、押すと入 / 切する。切ったぶんは控えて
   * おいて、押し直すとそのまま戻す。何も掛かっていない曲では行ごと出ない。
   *
   * ここはエンジンの持ちもので、MML には出てこない。曲を書き換えないので、
   * 畳んであるところに置いてある(2026-09-17)。
   */
  function drawFx() {
    const live = audio.dynamic_effects || {};
    const chs = [...new Set([...Object.keys(live), ...Object.keys(fxOff)])]
      .map((n) => Number(n)).filter((n) => Number.isInteger(n)).sort((a, b) => a - b);
    el.fx.textContent = '';
    el.fxrow.hidden = chs.length === 0;
    for (const ch of chs) {
      const on = !!live[ch];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sw';
      b.setAttribute('aria-pressed', String(on));
      const t = chans[ch];
      const kinds = Object.entries(live[ch] || fxOff[ch] || {})
        .filter(([, v]) => v).map(([k]) => k).join(' ');
      b.textContent = `${t && t.name ? t.name : `ch${ch + 1}`}${kinds ? ` ${kinds}` : ''}`;
      b.addEventListener('click', () => {
        if (live[ch]) { fxOff[ch] = live[ch]; delete live[ch]; }
        else if (fxOff[ch]) { live[ch] = fxOff[ch]; delete fxOff[ch]; }
        // 積んである先を作り直す。次に積むところから新しいほうになる。
        // **位置は変えていないので余韻は残す。**切ると、エフェクトを押すたびに
        // 鳴っている音が途切れる(跳ぶのとは別の用事)
        if (audio.bgmActive(NAME)) audio.seekBGM(audio.bgmPosition(), { cut: false });
        drawFx();
      });
      el.fx.appendChild(b);
    }
  }

  /**
   * 合図のランプ。曲に置いてある `#cue` の名前を並べる。
   *
   * 光らせるのは、聞いている場所がその合図を通ったとき。エンジンのキュー
   * (`takeCues()`)は取り出すと空になるので、こちらでは取らない。取ると、
   * 受け取る側(ゲームやページ)に届かなくなる(2026-09-18)。
   *
   * 出すのは曲に書いた合図だけ。ラベルのような仕掛けのものは出さない。
   */
  function drawLeds() {
    el.leds.textContent = '';
    el.cuelog.textContent = '';
    leds.clear();
    const names = [...new Set(cues.map((c) => c.name))];
    el.cuerow.hidden = names.length === 0;
    for (const name of names) {
      const led = document.createElement('span');
      led.className = 'led';
      led.dataset.name = name;
      led.textContent = name;
      el.leds.appendChild(led);
      leds.set(name, led);
    }
  }

  /** 届いたものを控えへ 1 行足す。番号はここでだけ出す */
  function logCue(c) {
    const line = document.createElement('div');
    line.textContent = `${c.t.toFixed(2)}s  ch${c.ch + 1}  ${c.name}`
      + (c.arg ? ` ${c.arg}` : '');
    el.cuelog.prepend(line);
    // 溜めすぎない。見るのは直近だけで、伸ばすと描くのも重くなる
    while (el.cuelog.children.length > 16) el.cuelog.lastChild.remove();
  }

  /** ランプを 1 つ光らせる。消えるのは CSS に任せる */
  function blink(name) {
    const led = leds.get(name);
    if (!led) return;
    led.classList.add('on');
    clearTimeout(led._off);
    led._off = setTimeout(() => led.classList.remove('on'), 120);
  }

  /**
   * 聞いている場所が通った合図を光らせる。
   *
   * 時計は 0.1 秒ごとに見ているので、そのあいだに通ったものをまとめて出す。
   * 一周して戻ったときは、終わりまでと頭からの 2 つに分けて見る。
   * 合図を止めてあるチャンネル(`muteCues`)のものは出さない。
   */
  function passedCues(at) {
    if (!cues.length) return;
    const len = audio.bgmLength() || total;
    const hit = (from, to) => {
      for (const c of cues) {
        if (c.t <= from || c.t > to) continue;
        if (audio.cuesMuted(c.ch)) continue;
        blink(c.name);
        logCue(c);
      }
    };
    if (at >= lastPos) hit(lastPos, at);
    else { hit(lastPos, len); hit(-1, at); }   // 一周して戻った
    lastPos = at;
  }

  /**
   * 曲に置いた字(`"…"`)を出す。
   *
   * ---- 消し方はこちらで決める ----
   *
   * **エンジンは出すところだけを渡してくる。**いつ消すかは画面の都合なので、
   * 受けた側が決める決まりにしてある(docs/DYNAMIC.md)。ここでは 2 つとも使う —
   * 同じチャンネルに次の字が来たら入れ替え、来なければ `TEXT_HOLD` 秒で消す。
   *
   * ---- チャンネルごとに 1 つ ----
   *
   * 分けて出すか 1 か所にまとめるかもプレイヤーの裁量だが、ここは分ける。
   * 旋律に歌詞、ベースにコード名のように、別のものが書かれていることがある。
   * まとめると、どちらの字だったのかが消える。
   *
   * エンジンのキュー(`takeTexts()`)は取り出すと空になるので、こちらでは
   * 取らない。取ると、受け取る側(ゲームやページ)に届かなくなる(合図と同じ)。
   */
  function showText(x) {
    // 空の字は「消す」の意味。置き場として使えるようにしてある
    if (x.text === '') { said.delete(x.ch); drawTexts(); return; }
    said.set(x.ch, { text: x.text, until: played + TEXT_HOLD });
    drawTexts();
  }

  /**
   * 出しておく時間が過ぎた字を消す。
   *
   * **数えるのは鳴らした秒。**壁の時計(`setTimeout`)で数えると、ポーズ中も
   * 減りつづけて、止めているあいだに消えてしまう。止めた画面は読むための
   * 画面でもあるので、そこで消えるのはいちばん困る(2026-10-05)。
   */
  function sweepTexts() {
    let went = false;
    for (const [ch, v] of said) {
      if (played >= v.until) { said.delete(ch); went = true; }
    }
    if (went) drawTexts();
  }

  /** いま出している字を並べる。チャンネルの番号順 */
  function drawTexts() {
    // 字を 1 つも持たない曲では、行ごと出さない
    el.textrow.hidden = texts.length === 0;
    el.said.textContent = '';
    for (const ch of [...said.keys()].sort((a, b) => a - b)) {
      const span = document.createElement('span');
      const who = document.createElement('b');
      who.textContent = `ch${ch + 1}`;
      span.appendChild(who);
      span.appendChild(document.createTextNode(said.get(ch).text));
      el.said.appendChild(span);
    }
  }

  /** 出している字を全部消す。止めたときと跳んだときに呼ぶ */
  function clearTexts() {
    said.clear();
    drawTexts();
  }

  /**
   * 聞いている場所が通った字を出す。`passedCues` と同じ見方。
   *
   * 時計は 0.1 秒ごとに見ているので、そのあいだに通ったものをまとめて出す。
   * 一周して戻ったときは、終わりまでと頭からの 2 つに分けて見る。
   */
  function passedTexts(from, to, len) {
    if (!texts.length) return;
    const hit = (a, b) => {
      for (const x of texts) if (x.t > a && x.t <= b) showText(x);
    };
    // **頭の 0 秒ちょうども拾う。**曲の 1 つめの字はたいていそこに置くので、
    // 開いた窓から外すと最初の歌詞が出ない。一周して戻ったほうも同じ扱い
    if (to >= from) hit(from <= 0 ? -1 : from, to);
    else if (wrapped(from, to, len)) { hit(from, len); hit(-1, to); }
    // 少しだけ戻ったのは一周ではない。何も出さない(下記)
  }

  /**
   * 後ろへ戻ったのが一周かどうか。
   *
   * **わずかな後戻りは一周ではない。**止めて戻した直後は、見せる時計が
   * 0.1 秒ほど巻き戻って見えることがある。それを一周と読むと、頭から
   * そこまでの字をまとめて出し直してしまい、出ていた字の消える時刻も
   * 延びる(2026-10-05)。半周ぶん以上戻ったときだけ一周とみなす。
   */
  function wrapped(from, to, len) {
    return len > 0 && (from - to) > len / 2;
  }

  /** 跳ぶ先のラベル */
  function drawMarks() {
    el.marks.textContent = '';
    el.markrow.hidden = marks.length === 0;
    for (const m of marks) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = m.name;
      b.dataset.t = String(m.t);
      b.addEventListener('click', () => { goTo(m.t); });
      el.marks.appendChild(b);
    }
  }

  /**
   * 選択肢。グループごとに、選べる名前を並べる。
   *
   * 押すとその場で差し替わる。囲みの長さは書いた時点で決まっているので、
   * 曲の長さも押すところの数も動かない(docs/DYNAMIC.md)
   */
  function drawTakes() {
    el.takes.textContent = '';
    el.takerow.hidden = takes.length === 0;
    for (const g of takes) {
      const wrap = document.createElement('span');
      wrap.className = 'take';
      const lbl = document.createElement('span');
      lbl.className = 'grp';
      lbl.textContent = g.group;
      wrap.appendChild(lbl);
      for (const name of g.options) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'sw';
        b.dataset.group = g.group;
        b.dataset.take = name;
        b.textContent = name;
        b.addEventListener('click', () => {
          audio.selectTake(NAME, g.group, name, restart ? { restart: true } : {});
          draw();
        });
        wrap.appendChild(b);
      }
      el.takes.appendChild(wrap);
    }
  }

  /** エンジンを見て、押すところの形を合わせる。0.1 秒ごとに呼ばれる */
  function draw() {
    const s = audio.bgmState;
    const on = !!(s && s.name === NAME);
    el.play.textContent = (on && !s.paused) ? 'Pause' : 'Play';
    // 直すところがある曲は押させない。押しても鳴らないので、
    // 押せるままにしておくと壊れているように見える
    el.play.disabled = !audio.bgmActive(NAME);
    // 外から `audio` へ直に言われていても、ここで追いつく。
    // 入 / 切は字ではなく地の反転で出す。チャンネルのボタンと同じ見た目に
    // して、押せば入 / 切だと一目で分かるようにした(2026-09-15)
    el.rept.setAttribute('aria-pressed', String(!audio.ignoreSongLoop));
    // 音量はエンジンが持つ。外から `audio.volume` へ入れられても追いつく
    if (document.activeElement !== el.vol) {
      el.vol.value = String(Math.round(audio.volume * 100));
    }
    // 1 本しかない曲では出さない。チャンネルごとに分ける意味が無い
    el.stems.hidden = chans.filter((t) => !goneCh(t.ch)).length < 2;
    el.mute.setAttribute('aria-pressed', String(audio.muted));
    el.mute.textContent = audio.muted ? 'Muted' : 'Mute';
    // AB リピート。線とスライダーの上の帯を合わせる
    const ab = audio.bgmRange();
    el.abOn.checked = !!ab;
    const span = audio.bgmLength() || total;
    const pct = (sec) => `${span > 0 ? Math.max(0, Math.min(100, (sec / span) * 100)) : 0}%`;
    el.abA.classList.toggle('off', !ab);
    el.abB.classList.toggle('off', !ab);
    el.abspan.hidden = !ab;
    if (ab) {
      el.abA.style.left = pct(ab.from);
      el.abB.style.left = pct(ab.to);
      el.abspan.style.left = pct(ab.from);
      el.abspan.style.width = `${Math.max(0, parseFloat(pct(ab.to)) - parseFloat(pct(ab.from)))}%`;
    }
    // 数で出す。上下のボタンで 0.1 秒ずつ動かせるようにするため(2026-09-15)
    if (document.activeElement !== el.abFrom) el.abFrom.value = abFrom.toFixed(3);
    if (document.activeElement !== el.abTo) el.abTo.value = abTo.toFixed(3);
    // 鳴っている最中も選べる。スライダーが映しているのは 1 周ぶんの長さで、
    // そこは動かない。変わるのは、あと何周するかだけ(2026-09-15)
    if (document.activeElement !== el.loops) el.loops.value = String(audio.loopTimes);
    // 何周で終わるか決まっていないと、どこまで焼けばよいか決まらない
    el.wav.disabled = busy || !Number.isFinite(audio.loopTimes) || total <= 0;
    el.level.disabled = el.wav.disabled;
    // 選んである選択肢。外から `selectTake()` を呼ばれても、ここで追いつく
    if (takes.length) {
      const now = audio.takesOf(NAME);
      for (const b of el.takes.querySelectorAll('button')) {
        b.setAttribute('aria-pressed', String(now[b.dataset.group] === b.dataset.take));
      }
    }
    for (const b of el.chs.querySelectorAll('button.sw')) {
      // 層のボタンは `ch/名前` を持っている。チャンネルのほうは番号だけ
      if (b.dataset.lane) {
        const at = b.dataset.lane.indexOf('/');
        const ch = Number(b.dataset.lane.slice(0, at));
        b.setAttribute('aria-pressed',
          String(!audio.isLaneMuted(ch, b.dataset.lane.slice(at + 1))));
        continue;
      }
      const ch = Number(b.dataset.ch);
      b.setAttribute('aria-pressed', String(!audio.isMuted(ch)));
      b.disabled = goneCh(ch);
    }
    // いま効いている機械。版を切り替えると変わる。宣言が無ければ出さない
    const mach = machineText();
    el.mach.textContent = mach;
    el.mach.hidden = !mach;
    // 鳴っていないあいだも長さは出す。読んだときに分かっている
    const len = audio.bgmLength() || total;
    el.len.textContent = clock(len);
    if (!dragging) {
      const at = on ? audio.bgmPosition() : from;
      if (on && !s.paused) {
        // 字を先に見る。`passedCues` が終わりに `lastPos` を進めるので、
        // 順を逆にすると字のぶんが取りこぼれる。
        // 合図が無い曲では `passedCues` が何もせずに戻るため、
        // `lastPos` はここで必ず進めておく
        // 進んだぶんだけ数える。一周して戻ったときは、終わりまでと頭からを足す。
        // わずかな後戻り(止めて戻した直後)は 0 として数えない
        played += (at >= lastPos) ? at - lastPos
          : wrapped(lastPos, at, len) ? Math.max(0, len - lastPos) + at : 0;
        passedTexts(lastPos, at, len);
        sweepTexts();
        passedCues(at);
        lastPos = at;
      } else lastPos = at;
      el.now.textContent = clock(at);
      el.seek.value = String(len > 0 ? Math.round((at / len) * 1000) : 0);
      // いま鳴っているところのラベルに印を付ける。手前にあるラベルのうち、
      // いちばん後ろのものが「いまここ」。見た目は CSS が決める(2026-09-17)
      const here = marks.reduce(
        (best, m) => (m.t <= at + 1e-6 && (!best || m.t >= best.t) ? m : best), null);
      for (const b of el.marks.querySelectorAll('button')) {
        const mine = here && Math.abs(Number(b.dataset.t) - here.t) < 1e-6;
        b.classList.toggle('now', !!mine);
        if (mine) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      }
    }
  }

  /** 鳴らしはじめる。止めてあるだけなら続きから */
  async function play() {
    dropWAV();
    await audio.unlock();
    const s = audio.bgmState;
    if (s && s.name === NAME && s.paused) { audio.resumeBGM(); draw(); return; }
    if (!audio.bgmActive(NAME) && !read()) return;
    // 黙らせてあるものも、くり返すかどうかも、エンジンが覚えている
    audio.startBGM(NAME, { restart: true });
    // 止めているあいだに動かした頭出しは、鳴らしはじめてから渡す
    if (from > 0) audio.seekBGM(from);
    draw();
  }

  /**
   * いまの範囲を MML の字にする。黙らせたチャンネルは入らない。
   *
   * 書き直したものなので、注釈もマクロも残らない。同じ音は出る。
   * 速さは MML に書いてある `t` を見る。無ければ `#tempo`、それも
   * 無ければ 120(2026-09-15)
   */
  function mmlOf(opts = {}) {
    const span = audio.bgmLength() || total;
    const ab = audio.bgmRange();
    const from = opts.from ?? (ab ? ab.from : 0);
    const to = opts.to ?? (ab ? ab.to : span);
    const text = voices.join(' ');
    const hit = /(?:^|[\s])t(\d+)/.exec(text);
    const meta = audio.bgmInfo(NAME)?.meta ?? {};
    const tempo = Number(hit ? hit[1] : meta.tempo) || 120;
    const tracks = voices
      .map((v, i) => ({ v, i }))
      // 版で黙っている行も出さない。選んだ版の、on になっている組と、
      // どの版にも属さないチャンネルだけを出す
      .filter(({ i }) => !audio.isMuted(i) && !goneCh(i))
      .map(({ v, i }) => ({
        name: chans[i]?.name ?? null,
        role: chans[i]?.role ?? null,
        events: compileMML(String(v).trim()).events,
      }));
    return eventsToMML(tracks, {
      tempo, from, to,
      waveName: (n) => WAVEFORMS[n]?.name ?? String(n),
      envName: (n) => ENVELOPES[n]?.name ?? String(n),
    });
  }

  /** 焼いたものを捨てる。次に鳴らすか焼くときに呼ぶ。抱えたままにしない */
  function dropWAV() {
    if (!wavURL) return;
    el.audio.pause();
    el.audio.removeAttribute('src');
    el.audio.load();
    el.got.hidden = true;
    el.wavnote.hidden = true;
    URL.revokeObjectURL(wavURL);
    wavURL = null;
  }

  /**
   * 曲の大きさを測って、揃える倍率を出す。
   *
   * 焼いてから測る(`renderBGM`)ので、鳴らしているのと同じ音を見る。
   * 曲に `#gain` が書いてあればそれも掛かった音なので、返すのは
   * 「いまから何倍すればよいか」と、「`#gain` に書くならいくつか」の両方。
   *
   * 測るだけで、音は変えない。書き戻すのは人がやる(docs/LOUDNESS.md)。
   * @param {{lufs?:number, peak?:number}} [target] 合わせ先。既定は −16 LUFS / −1 dBTP
   * @returns {Promise<object|null>} 測ったものと勧める倍率。焼けなければ null
   */
  async function measureLevel(target = SONG_TARGET) {
    if (busy || !Number.isFinite(audio.loopTimes)) return null;
    busy = true;
    quit = false;
    root.classList.add('busy');
    el.veil.hidden = false;
    el.barfill.style.width = '0%';
    el.pct.textContent = '0%';
    say('Measuring…');
    audio.stopBGM();
    try {
      // 1 周ぶんで足りる。周回数を増やしても、同じ並びがくり返されるだけ
      const buf = await audio.renderBGM(NAME, {
        loops: 1,
        onProgress: (v) => {
          const pct = Math.round(v * 100);
          el.barfill.style.width = `${pct}%`;
          el.pct.textContent = `${pct}%`;
        },
        stop: () => quit,
      });
      if (!buf) { say('Measuring cancelled.'); return null; }
      const level = measureLoudness([buf.getChannelData(0)], buf.sampleRate);
      const fit = fitGain(level, target);
      // 曲が名乗っている倍率。焼いた音にはもう掛かっているので、
      // 書き直す数はこれとの掛け算になる
      const now = Number(audio.bgmInfo(NAME)?.meta?.gain ?? 1) || 1;
      const got = {
        seconds: buf.duration,
        lufs: level.lufs,
        peakDb: level.peakDb,
        truePeakDb: level.truePeakDb,
        clipped: level.clipped,
        target: { ...target },
        gainNow: now,
        gainFactor: fit.gain,
        gainWrite: Math.round(now * fit.gain * 100) / 100,
        by: fit.by,
      };
      const line = `${got.lufs.toFixed(1)} LUFS / ${got.truePeakDb.toFixed(2)} dBTP`
        + ` → #gain ${got.gainWrite}`
        + ` (x${fit.gain.toFixed(2)}, ${fit.by === 'lufs' ? 'target' : 'ceiling'})`;
      // コンソールにも出す。押した人が数を持って帰れるように
      console.info('[player] ' + line, got);
      say(line);
      return got;
    } catch (e) {
      say(String(e && e.message ? e.message : e), 'err');
      return null;
    } finally {
      busy = false;
      root.classList.remove('busy');
      el.veil.hidden = true;
      draw();
    }
  }

  /** チャンネルごとに落としたものの URL。次に開くか焼くときに捨てる */
  let stemURLs = [];

  /** 落としたものを捨てる。抱えたままにしない */
  function dropStems() {
    for (const u of stemURLs) URL.revokeObjectURL(u);
    stemURLs = [];
    el.stemgot.textContent = '';
    el.stemgot.hidden = true;
  }

  /**
   * チャンネルごとに焼く問いかけを開く / 閉じる。
   *
   * 聞こえているチャンネルに印を付けて開く。黙らせてあるものは外す —
   * 画面で作った音がそのまま落ちる、という `mute` の約束に揃える
   */
  function showStems(on) {
    el.stemwrap.hidden = !on;
    el.stems.setAttribute('aria-pressed', String(!!on));
    if (!on) { dropStems(); return; }
    dropStems();
    el.stemlist.textContent = '';
    const live = chans.filter((t) => !goneCh(t.ch));
    for (const t of live) {
      const row = document.createElement('label');
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.dataset.ch = String(t.ch);
      box.checked = !audio.isMuted(t.ch);
      row.appendChild(box);
      const name = document.createElement('span');
      name.textContent = t.name || `ch${t.ch + 1}`;
      row.appendChild(name);
      const of = document.createElement('span');
      of.className = 'of';
      of.textContent = `ch${t.ch + 1}`;
      row.appendChild(of);
      el.stemlist.appendChild(row);
    }
    el.stemnote.textContent = `${live.length} channels`;
    stemHint();
  }

  /** 印の付いている番号 */
  function stemPicked() {
    return [...el.stemlist.querySelectorAll('input')]
      .filter((b) => b.checked).map((b) => Number(b.dataset.ch));
  }

  /**
   * 何本焼くかと、`#fx` をどうするかを書く。
   *
   * `#fx` を掛けたまま 1 本ずつ焼くと、音の大きさで効き方が変わる段
   * (limiter saturate compressor など)では足し合わせても曲に戻らない。
   * 線形の段(フィルタ・エコー・リバーブ)だけなら戻る。
   * 書いてある曲のときだけ言う
   */
  function stemHint() {
    const n = stemPicked().length;
    const fx = el.stemfx.checked;
    const has = (audio.bgmInfo(NAME)?.meta?.fx ?? []).length > 0
      || audio.masterEffects().length > 0;
    const lines = [`${n} file${n === 1 ? '' : 's'}.`];
    if (!has) lines.push('This tune has no #fx, so the files add back up to the mix.');
    else if (fx) {
      lines.push('#fx runs on each file. Effects that watch the level '
        + '(limiter, saturate, compressor) will not add back up to the mix.');
    } else {
      lines.push('#fx is left off, so the files add back up to the mix. '
        + 'Put it back on in your own software.');
    }
    el.stemhint.textContent = lines.join(' ');
    el.stemgo.disabled = n === 0;
  }

  /**
   * チャンネルごとに WAV へ焼く。
   *
   * ほかを黙らせて 1 本ずつ通すだけ。鳴らすときと同じ道を通る
   * (`renderBGM` の `mute`)。1 本ずつは声が 1 本ぶんしか動かないので、
   * 丸ごと 1 回の 2 倍ほどで本数ぶんが焼ける(87 秒 8 本の曲で測って、
   * 丸ごと 12 秒 / 8 本 25 秒。2026-10-23)
   */
  async function toStems() {
    if (busy || !Number.isFinite(audio.loopTimes)) return;
    const want = stemPicked();
    if (!want.length) return;
    dropWAV();
    dropStems();
    busy = true;
    quit = false;
    root.classList.add('busy');
    el.veil.hidden = false;
    const meta = audio.bgmInfo(NAME)?.meta ?? {};
    const song = String(meta.title || 'mmsxx').replace(/[\\/:*?"<>|]/g, '_');
    const stereo = el.stereo.getAttribute('aria-pressed') === 'true';
    const ab = audio.bgmRange();
    const all = chans.filter((t) => !goneCh(t.ch)).map((t) => t.ch);
    audio.stopBGM();
    try {
      for (let k = 0; k < want.length; k++) {
        const ch = want[k];
        const label = chans.find((t) => t.ch === ch);
        say(`Rendering ${k + 1}/${want.length}…`);
        const buf = await audio.renderBGM(NAME, {
          loops: ab ? 1 : audio.loopTimes,
          channels: stereo ? 2 : 1,
          mute: all.filter((i) => i !== ch),
          masterFx: el.stemfx.checked,
          onProgress: (v) => {
            // 1 本ぶんの進みを、本数ぜんぶのうちのどこかに直す
            const pct = Math.round(((k + v) / want.length) * 100);
            el.barfill.style.width = `${pct}%`;
            el.pct.textContent = `${pct}%`;
          },
          stop: () => quit,
        });
        if (!buf) { say('Export cancelled.'); return; }
        const rate = buf.sampleRate;
        let data = Array.from({ length: buf.numberOfChannels },
          (_, c) => buf.getChannelData(c));
        if (ab) {
          const a0 = Math.max(0, Math.floor(ab.from * rate));
          const a1 = Math.min(buf.length, Math.ceil(ab.to * rate));
          data = data.map((d) => d.slice(a0, a1));
        }
        // 名前は書いたまま残す。日本語の名前が多いので、ASCII だけに削ると
        // 「ベース2」が「2」になって、どれがどれだか分からなくなる
        const tag = String(ch + 1).padStart(2, '0');
        const part = String(label?.name || '').replace(/[\\/:*?"<>|]/g, '-').trim();
        const file = `${song}.ch${tag}${part ? '-' + part : ''}.wav`;
        const url = URL.createObjectURL(
          new Blob([writeWAV(data, rate)], { type: 'audio/wav' }));
        stemURLs.push(url);
        if (!inFrame) {
          const a = document.createElement('a');
          a.href = url;
          a.download = file;
          a.click();
          continue;
        }
        // 枠の中(artifact など)では落とすのを断られる。1 本ずつ保存してもらう
        const row = document.createElement('div');
        const au = document.createElement('audio');
        au.controls = true;
        au.src = url;
        const save = document.createElement('a');
        save.href = url;
        save.download = file;
        save.textContent = file;
        row.append(au, save);
        el.stemgot.appendChild(row);
        el.stemgot.hidden = false;
      }
      const n = want.length;
      say(inFrame
        ? ''
        : `Exported ${n} file${n === 1 ? '' : 's'}.`);
      if (inFrame) {
        el.stemhint.textContent =
          `Could not save ${want.length} files. Save them one at a time below.`;
      }
    } catch (e) {
      say(String(e && e.message ? e.message : e), 'err');
    } finally {
      busy = false;
      root.classList.remove('busy');
      el.veil.hidden = true;
      draw();
    }
  }

  /**
   * いまの設定で WAV に焼いて、落とす。
   *
   * 黙らせたチャンネルも、周回数も、AB リピートの範囲も、聞こえているとおりに
   * 出す。AB が入っているときは 1 周ぶんだけ焼いて、その範囲を切り出す。
   * 焼いた時刻の並びは 1 周ぶんの並びと同じなので、秒がそのまま使える
   */
  async function toWAV() {
    if (busy || !Number.isFinite(audio.loopTimes)) return;
    dropWAV();
    busy = true;
    quit = false;
    root.classList.add('busy');
    el.veil.hidden = false;
    el.barfill.style.width = '0%';
    el.pct.textContent = '0%';
    say('Rendering…');
    audio.stopBGM();
    const ab = audio.bgmRange();
    try {
      const buf = await audio.renderBGM(NAME, {
        loops: ab ? 1 : audio.loopTimes,
        // 左右に分けて焼くか。定位とエフェクトの広がりは 2 本のときだけ出る
        channels: el.stereo.getAttribute('aria-pressed') === 'true' ? 2 : 1,
        onProgress: (v) => {
          const pct = Math.round(v * 100);
          el.barfill.style.width = `${pct}%`;
          el.pct.textContent = `${pct}%`;
        },
        stop: () => quit,
      });
      if (!buf) { say('Export cancelled.'); return; }
      const rate = buf.sampleRate;
      let chans = Array.from({ length: buf.numberOfChannels }, (_, c) => buf.getChannelData(c));
      if (ab) {
        // 範囲の外は切る。1 周ぶんの並びなので、秒をそのまま添え字にできる
        const a0 = Math.max(0, Math.floor(ab.from * rate));
        const a1 = Math.min(buf.length, Math.ceil(ab.to * rate));
        chans = chans.map((d) => d.slice(a0, a1));
      }
      const data = chans[0];
      const meta = audio.bgmInfo(NAME)?.meta ?? {};
      const name = String(meta.title || 'mmsxx').replace(/[\\/:*?"<>|]/g, '_');
      const blob = new Blob([writeWAV(chans, rate)], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const secs = (data.length / rate).toFixed(1);
      if (!inFrame) {
        // 落とせる置き方なら、そのまま落とす。持ち物は残さない
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.wav`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        say(`Exported ${secs}s of WAV.`);
        return;
      }
      // 枠の中(artifact など)では落とすのを断られる。そのときだけ音のプレイヤーに
      // 挿して渡す。menu から保存できる。持ち物は次に鳴らすか焼くまで抱える
      wavURL = url;
      el.got.hidden = false;
      el.audio.src = url;
      el.save.href = url;
      el.save.download = `${name}.wav`;
      el.wavnote.textContent =
        `Could not save ${secs}s of WAV. Save it from the player below.`;
      el.wavnote.hidden = false;
      say('');
    } catch (e) {
      say(String(e && e.message ? e.message : e), 'err');
    } finally {
      busy = false;
      root.classList.remove('busy');
      el.veil.hidden = true;
      draw();
    }
  }

  /** 頭出しの位置を動かす。鳴っていればその場で跳ぶ */
  function goTo(sec) {
    const len = audio.bgmLength() || total;
    from = Math.max(0, Math.min(sec, len));
    const s = audio.bgmState;
    if (s && s.name === NAME) audio.seekBGM(from);
    // 跳んだら消す。飛ばしたぶんをまとめて出したりしない(合図と同じ)
    clearTexts();
    lastPos = from;
    draw();
  }



  el.play.addEventListener('click', () => {
    const s = audio.bgmState;
    if (s && s.name === NAME && !s.paused) { audio.pauseBGM(); draw(); return; }
    play();
  });
  el.stop.addEventListener('click', () => {
    audio.stopBGM(); from = 0; clearTexts(); lastPos = 0; draw();
  });
  /** 秒に直す。`1:23` でも `83.5` でも受ける */
  const secOf = (text) => {
    const t = String(text ?? '').trim();
    if (!t) return null;
    const m = /^(\d+):(\d+(?:\.\d+)?)$/.exec(t);
    const n = m ? Number(m[1]) * 60 + Number(m[2]) : Number(t);
    return Number.isFinite(n) ? Math.max(0, n) : null;
  };

  /**
   * 覚えてある範囲を、入 / 切に合わせてエンジンへ渡す。
   *
   * `toA` を立てると、頭出しもする。A が動いたときと入にしたときは、
   * そこから聞きたいはずなので(2026-09-15)
   */
  function applyRange(on, toA) {
    const span = audio.bgmLength() || total;
    if (!on) { audio.clearRange(); draw(); return; }
    // まだ決めていなければ曲ぜんぶ。そこから縮めてもらう
    if (!(abTo > abFrom)) { abFrom = 0; abTo = span; }
    audio.setRange(abFrom, abTo);
    if (toA) audio.seekBGM(abFrom);
    draw();
  }

  /**
   * いまの位置を A か B に置く。
   *
   * **数で打つのが難しい。**0.1 秒きざみの欄に手で入れるより、聞いている
   * ところをそのまま置けるほうが早い(2026-10-11 に言われた)。
   *
   * **前後が入れ替わったら入れ替える。**B より後ろを A に置くようなことが
   * 起きるので、そのまま渡すと範囲が空になる。
   *
   * 位置はエンジンに聞く。つまみを離したところで頭出しが入る(`goTo`)ので、
   * 止めたままつまみを動かしたときもそこを指す。エンジンがまだ何も持って
   * いないときだけ、つまみの位置から出す
   */
  function markAB(which) {
    const span = audio.bgmLength() || total;
    if (!(span > 0)) return;
    const st = audio.bgmState;
    const at = st && st.name === NAME
      ? audio.bgmPosition() : span * (Number(el.seek.value) / 1000);
    const sec = Math.max(0, Math.min(span, Math.round(at * 10) / 10));
    // まだ決めていなければ曲ぜんぶから始める
    if (!(abTo > abFrom)) { abFrom = 0; abTo = span; }
    if (which === 'A') abFrom = sec; else abTo = sec;
    if (abFrom > abTo) { const t = abFrom; abFrom = abTo; abTo = t; }
    // 同じところに重なったら、範囲が無くなる。端まで伸ばして逃がす
    if (abFrom === abTo) {
      if (abTo < span) abTo = Math.min(span, abTo + 0.1);
      else abFrom = Math.max(0, abFrom - 0.1);
    }
    el.abOn.checked = true;
    applyRange(true, which === 'A');
    say(`A ${abFrom.toFixed(1)}s \u2013 B ${abTo.toFixed(1)}s`);
  }
  el.setA.addEventListener('click', () => markAB('A'));
  el.setB.addEventListener('click', () => markAB('B'));

  /**
   * 範囲の外に出てしまったら A へ移す。
   *
   * B を縮めたときに起きる。外にいるまま鳴らしつづけると、B をまたぐまで
   * 戻らないので、選んだ範囲を聞いていないことになる(2026-09-15)
   */
  function fixHead() {
    const ab = audio.bgmRange();
    if (!ab) return;
    const at = audio.bgmPosition();
    if (at < ab.from || at > ab.to) { audio.seekBGM(ab.from); draw(); }
  }

  el.copy.addEventListener('click', async () => {
    const text = mmlOf();
    if (!text) { say('Nothing to copy.', 'bad'); return; }
    // 欄に出すのは、写せなかったときと、出すだけの置き方のとき。
    // 写せているなら欄は邪魔になる(2026-09-15)
    const show = () => {
      el.out.hidden = false;
      el.out.value = text;
      el.out.focus();
      el.out.select();
    };
    if (copyMode === 'show') { show(); say('Here is the MML. It is selected.'); return; }
    let done = false;
    // 写す先へ手が届かない置き方(枠の中など)がある。execCommand は選んだ字を
    // 見て写すので、こちらは欄に出してから試す
    try { await navigator.clipboard.writeText(text); done = true; } catch { /* 下で試す */ }
    if (!done) {
      show();
      try { done = document.execCommand('copy'); } catch { done = false; }
    }
    if (done) { el.out.hidden = true; say('Copied as MML.'); return; }
    say('Could not copy. Here is the MML, selected, to copy by hand.', 'bad');
  });
  // 書いたとおりの MML を落とす。音符から書き直したものが欲しいときは
  // `Copy selection as MML`(あちらは黙らせたチャンネルと A-B の範囲が効く)。
  //
  // 落とせないと決めたとき(`saveMml: false`)は、押しどころを外して、
  // ここから先を作らない。CSS で隠すと押せる道が残る
  if (!canSaveMml) { el.mml.remove(); el.mml = null; }
  if (el.mml) el.mml.addEventListener('click', () => {
    const text = srcText();
    if (!text) { say('Nothing to export.', 'bad'); return; }
    const meta = audio.bgmInfo(NAME)?.meta ?? {};
    const name = (meta.title || 'song').replace(/[\\/:*?"<>|]/g, '_');
    if (!inFrame) {
      const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.mml`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      say(`Exported ${name}.mml`);
      return;
    }
    // 枠の中(artifact など)では落とすのを断られる。そのときは欄に出す
    el.out.hidden = false;
    el.out.value = text;
    el.out.focus();
    el.out.select();
    say('Could not save the file. Here is the MML, selected, to copy by hand.', 'bad');
  });
  // 渡された MML をそのまま欄へ出す。入 / 切。
  //
  // `Export MML` は落とすもので、`Copy selection as MML` は音符から書き直した
  // ものを渡す(黙らせたチャンネルと A-B の範囲が効く)。こちらは書いたとおりの字を、
  // 押しどころのすぐ下で読めるようにするだけ(2026-09-18)
  /** 重ねた欄の開け閉め。開けているあいだは下の押しどころに手が届かない */
  const showSrc = (on) => {
    el.srcwrap.hidden = !on;
    el.showmml.setAttribute('aria-pressed', String(on));
    el.showmml.setAttribute('aria-expanded', String(on));
  };
  /**
   * 出す字。**貼れば鳴るものにする。**
   *
   * 1 本のテキストで渡されたものは、そのまま出す。チャンネルごとに分けて
   * 渡されたものは、並びが切れ目になっているので、字にすると切れ目が消える。
   * `#ch` を書き足さないと、貼ったときに全部が 1 本につながって、
   * 10 本の曲が 10 倍の長さで順番に鳴る(2026-09-18)。
   */
  const srcText = () => {
    if (!Array.isArray(mml)) return String(mml ?? '').trim();
    const has = (v) => /^[ \t]*\/\/[ \t]*#[ \t]*ch([ \t]|$)/im.test(v);
    return voices.map((v) => (has(v) ? v : `#ch\n${v}`)).join('\n\n').trim();
  };
  el.showmml.addEventListener('click', () => {
    if (el.showmml.getAttribute('aria-pressed') === 'true') { showSrc(false); return; }
    const text = srcText();
    if (!text) { say('Nothing to show.', 'bad'); return; }
    el.src.value = text;
    // どれだけの字を書いた曲なのかは、読む前に知りたい
    el.srcsize.textContent = `${text.split('\n').length} lines, ${text.length} chars`;
    showSrc(true);
    el.srcclose.focus();
  });
  el.srcclose.addEventListener('click', () => { showSrc(false); el.showmml.focus(); });
  // 外側を押しても閉じる。中(欄と Close)を押したときは閉じない
  el.srcwrap.addEventListener('click', (e) => {
    if (e.target === el.srcwrap) { showSrc(false); el.showmml.focus(); }
  });
  el.srcwrap.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { showSrc(false); el.showmml.focus(); }
  });
  el.abOn.addEventListener('change', () => applyRange(el.abOn.checked, true));
  for (const [box, which] of [[el.abFrom, 'from'], [el.abTo, 'to']]) {
    box.addEventListener('input', () => {
      const v = secOf(box.value);
      if (v === null) { draw(); return; }
      if (which === 'from') abFrom = v; else abTo = v;
      if (abTo > abFrom) applyRange(true, which === 'from');
      if (which === 'to') fixHead();
    });
  }

  // 線をつまんで動かす。線は細いので、つまむところは広くとってある
  for (const [handle, which] of [[el.abA, 'from'], [el.abB, 'to']]) {
    handle.addEventListener('pointerdown', (e) => {
      handle.setPointerCapture(e.pointerId);
      e.preventDefault();
      const move = (ev) => {
        const box = el.track.getBoundingClientRect();
        const span = audio.bgmLength() || total;
        const sec = Math.max(0, Math.min(span, ((ev.clientX - box.left) / box.width) * span));
        if (which === 'from') abFrom = sec; else abTo = sec;
        if (abTo > abFrom) audio.setRange(abFrom, abTo);
        draw();
      };
      const up = () => {
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', up);
        // A を動かし終えたら、そこから聞く。つまんでいる最中に動かすと、
        // 引くたびに積み直すことになる
        if (which === 'from' && audio.bgmRange()) { audio.seekBGM(abFrom); draw(); }
        if (which === 'to') fixHead();
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
    });
  }
  // 書き出しを左右に分けるか。鳴らすほうには効かない
  el.stereo.addEventListener('click', () => {
    el.stereo.setAttribute('aria-pressed', String(el.stereo.getAttribute('aria-pressed') !== 'true'));
  });
  el.rept.addEventListener('click', () => {
    audio.ignoreSongLoop = !audio.ignoreSongLoop;
    draw();
  });
  // 届いたものの控え。ふだんは畳んでおく
  el.logsw.addEventListener('click', () => {
    const on = el.logrow.hidden;
    el.logrow.hidden = !on;
    el.logsw.setAttribute('aria-pressed', String(on));
    el.logsw.setAttribute('aria-expanded', String(on));
  });
  // 読み方を切り替えたら読み直す。鳴っているものは中身が変わるので止める
  el.loose.addEventListener('change', () => {
    loose = el.loose.checked;
    audio.stopBGM();
    from = 0;
    if (read()) draw();
  });
  // 選択肢の押しかた。入れておくと、曲の指定を待たずに囲みの頭から鳴らし直す
  el.rew.addEventListener('click', () => {
    restart = !restart;
    el.rew.setAttribute('aria-pressed', String(restart));
  });
  // 音量はエンジンへ言うだけ。形は draw() が合わせる
  el.vol.addEventListener('input', () => {
    audio.volume = Number(el.vol.value) / 100;
    draw();
  });
  el.mute.addEventListener('click', () => { audio.mute(); draw(); });
  el.wav.addEventListener('click', () => { toWAV(); });
  // チャンネルごとに焼く問いかけ。開いてから選ぶ形にしてある —
  // 何本焼くかと `#fx` をどうするかは、押す前に決めることなので
  el.stems.addEventListener('click', () => {
    showStems(el.stemwrap.hidden);
  });
  el.stemclose.addEventListener('click', () => { showStems(false); el.stems.focus(); });
  el.stemwrap.addEventListener('click', (e) => {
    if (e.target === el.stemwrap) { showStems(false); el.stems.focus(); }
  });
  el.stemwrap.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { showStems(false); el.stems.focus(); }
  });
  el.stemlist.addEventListener('change', stemHint);
  el.stemfx.addEventListener('change', stemHint);
  el.stemall.addEventListener('click', () => {
    // 全部に付ける / 全部外すを行き来する。1 本だけ聞きたいときの手間を省く
    const boxes = [...el.stemlist.querySelectorAll('input')];
    const on = boxes.some((b) => !b.checked);
    for (const b of boxes) b.checked = on;
    el.stemall.setAttribute('aria-pressed', String(on));
    stemHint();
  });
  el.stemgo.addEventListener('click', () => { toStems(); });
  el.level.addEventListener('click', () => { measureLevel(); });
  el.cancel.addEventListener('click', () => { quit = true; say('Cancelling…'); });
  el.open.addEventListener('click', () => { open = !open; fold(); });
  // 版と権利。どの版のエンジンで鳴っているかは、聞いた人が知りたがる
  el.ver.textContent = `Pico (MML Player) ${PLAYER_VERSION}\n`
    + `ChipTuneSound ${SOUND_VERSION}\n`
    + `\u00a9 ${COPYRIGHT}`;
  const showVer = (on) => {
    el.ver.hidden = !on;
    el.help.setAttribute('aria-pressed', String(on));
    el.help.setAttribute('aria-expanded', String(on));
  };
  el.help.addEventListener('click', () => { showVer(el.ver.hidden); });
  // 吹き出しなので、よそを押したら閉じる。Esc でも閉じる
  const shut = (e) => {
    if (el.ver.hidden || el.help.contains(e.target) || el.ver.contains(e.target)) return;
    showVer(false);
  };
  const shutKey = (e) => { if (e.key === 'Escape') showVer(false); };
  document.addEventListener('pointerdown', shut);
  document.addEventListener('keydown', shutKey);
  el.loops.addEventListener('change', () => {
    audio.loopTimes = Number(el.loops.value);
    draw();
  });
  // つまんでいるあいだは時計のほうを止める(押し戻されて動かせなくなる)
  el.seek.addEventListener('pointerdown', () => { dragging = true; });
  el.seek.addEventListener('change', () => {
    dragging = false;
    const len = audio.bgmLength() || total;
    if (len <= 0) return;
    const at = len * (Number(el.seek.value) / 1000);
    // いちばん左は 0 秒ちょうどにする。スライダーは曲を 1000 段に丸めるので、
    // 端まで寄せても数十ミリ秒あとに落ちることがある。跳んだ先から始まる音だけを
    // 積む作りなので、0 秒に置いた音がまるごと消える(2026-09-18)
    goTo(at < len / 1000 ? 0 : at);
  });
  el.seek.addEventListener('input', () => {
    const len = audio.bgmLength() || total;
    if (len > 0) el.now.textContent = clock(len * (Number(el.seek.value) / 1000));
  });

  /**
   * いま鳴っているチャンネルのボタンを光らせる。
   *
   * 時計(`draw`)は 0.1 秒ごとだが、16 分の刻みはそれより短い。
   * 同じ間隔で見ると、光らないまま通り過ぎる音符が出る。
   * 絵のコマに合わせて、鳴っているかどうかだけを見にいく(2026-09-19)。
   *
   * 黙らせたチャンネルは `levels()` が 0 を返すので、押していないボタンは
   * 光らない。聞こえないものが光ると、押し具合のほうが読めなくなる。
   */
  function beat() {
    const s = audio.bgmState;
    const on = !!(s && s.name === NAME && !s.paused);
    // 鳴っている音符から、チャンネルと層の両方を拾う。開いた中の層も光る
    const hot = new Set();
    if (on) {
      for (const n of audio.notesAt()) {
        if (!(n.level > 0)) continue;
        // 音量を 0 まで下げたチャンネルは光らせない。黙らせたものが
        // 光らないのと同じで、聞こえていないものを光らせると嘘になる
        if (!(audio.trackVolume(n.ch) > 0)) continue;
        hot.add(String(n.ch));
        if (n.lane !== undefined) hot.add(`${n.ch}/${n.lane}`);
      }
    }
    // 音量のスライダーに替えてあるときは、行そのものを光らせる。
    // 押すところが無くなっても、どこが鳴っているかは見えているようにする
    for (const b of el.chs.querySelectorAll('button.sw, .chvol')) {
      b.classList.toggle('hot', hot.has(b.dataset.lane ?? b.dataset.ch));
    }
    frame = requestAnimationFrame(beat);
  }

  const timer = setInterval(draw, 100);
  let frame = requestAnimationFrame(beat);
  srcButtons();
  read();
  drawLoops();
  drawGroups();
  drawChannels();
  drawMarks();
  drawTakes();
  fold();
  drawFx();
  drawLeds();
  clearTexts();
  drawCuts();
  draw();
  // 幅が変わると割合も変わる。線は幅から引く場所を決めているので引き直す
  const onSize = () => drawCuts();
  window.addEventListener('resize', onSize);

  return {
    /**
     * 下で鳴らしているエンジン(`ChipTuneSound`)。
     *
     * 鳴り方はすべてこちらにある。黙らせるのも、くり返すかどうかも、
     * ここへ言う。押すところは 0.1 秒で追いつく。
     * 押すところを消してあっても、鳴っていなくても効く
     */
    audio,
    /** 鳴らしはじめる。止めてあるだけなら続きから */
    play,
    /**
     * 曲の大きさを測って、揃える倍率を返す(音は変えない)。
     * 既定の合わせ先は −16 LUFS / −1 dBTP。コンソールにも 1 行出る
     */
    measure: (target) => measureLevel(target),
    /** その場で凍らせる。`play()` で続きから鳴る */
    pause: () => { audio.pauseBGM(); draw(); },
    /** 止めて、位置を忘れる。次は頭から */
    stop: () => { audio.stopBGM(); draw(); },
    /**
     * 曲の途中へ跳ぶ。
     *
     * @param {number} sec 頭から何秒のところか
     */
    seek: (sec) => { goTo(sec); },
    /**
     * AB リピートの範囲。
     *
     * 省いて呼ぶと、いまの範囲が返る(`{ from, to }`。無ければ null)。
     * `range(null)` で外す。読むのも書くのも同じ名前でする。
     *
     * @param {number|null} [from] 始まりの秒。`null` で範囲を外す。省くと読むだけ
     * @param {number} [to] 終わりの秒。`from` と入れ替わっていても直す
     * @returns {{from:number, to:number}|null} そのあとの範囲
     */
    range(from, to) {
      if (from === undefined) return audio.bgmRange();
      if (from === null) { audio.clearRange(); } else {
        abFrom = Math.min(from, to);
        abTo = Math.max(from, to);
        audio.setRange(abFrom, abTo);
      }
      draw();
      return audio.bgmRange();
    },
    /**
     * ラベルの名前で跳ぶ。見つからなければ何もしない。
     *
     * @param {string} name `#label` に書いた名前。大文字小文字は見る
     */
    jump(name) {
      const m = marks.find((x) => x.name === name);
      if (m) goTo(m.t);
    },
    /**
     * 跳ぶ先の一覧。鳴らす前から読める。
     *
     * @returns {{name:string, t:number}[]} 名前と、頭から何秒のところか
     */
    marks: () => marks.slice(),
    /**
     * 鳴らす前から読めるチャンネルの一覧。名前と役割は MML の注釈から。
     * 黙っているかどうかはエンジンに聞く。
     *
     * @returns {{ch:number, name:string|null, role:string|null,
     *            total:number, muted:boolean}[]}
     */
    tracks: () => chans.map((t) => ({ ...t, muted: audio.isMuted(t.ch) })),
    /**
     * 外から MML を差し替える。テキストボックスは持たないので、入り口はここ。
     *
     * 差し替えると鳴っているものは止まる。チャンネルもラベルも読み直す。
     *
     * @param {string|string[]} text 1 本のテキストでも、チャンネルごとの並びでもよい
     */
    setMML(text) {
      mml = Array.isArray(text) ? text : String(text ?? '');
      data = null;
      reload();
    },
    /**
     * 外から、読み終えた中間データを差し替える。`setMML()` の字を通さない版。
     *
     * @param {object[]} tracks `compileMML()` が返す形の並び。チャンネル 1 本につき 1 つ
     */
    setData(tracks) {
      data = tracks;
      mml = '';
      reload();
    },
    /**
     * いまの範囲を MML の字にして返す。黙らせたチャンネルは入らない。
     *
     * 範囲を決めていなければ曲ぜんぶ。書き直したものなので、注釈も
     * マクロも残らない。`Copy as MML` が呼んでいるのもこれ
     *
     * @param {{from?:number, to?:number}} [opts] 秒で切る範囲。省くと AB リピートの範囲
     * @returns {string} チャンネルを `#ch` で分けた 1 本のテキスト
     */
    mml: (opts) => mmlOf(opts),
    /** 時計を止める。ページから外すときに呼ぶ */
    destroy() {
      clearInterval(timer);
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onSize);
      document.removeEventListener('pointerdown', shut);
      document.removeEventListener('keydown', shutKey);
      audio.stopBGM();
      dropWAV();
    },
  };
}
