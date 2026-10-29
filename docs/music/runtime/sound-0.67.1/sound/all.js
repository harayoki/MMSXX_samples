// 音源を全部そろえた入口。
//
// `audio.js` はエンジンと、いつも付いてくる音源(ファミコン・MSX の PSG と SCC・
// PC エンジン)だけを持つ。ほかの音源は自分を登録するファイルとして分かれていて、
// 読み込んだものだけが鳴る(docs/SOUND_TOOL.md「音源ごとに分けて配る」)。
//
// ここはその全部を読み込むだけのファイル。道具とテストはこちらを通る。
// 配るときは、要る音源だけを並べた同じ形のファイルを作る。
//
// 分けた理由 — 音源が増えていくので、全部入りの 1 枚だと使わない音源のぶんまで
// 読み込ませることになる。アナログだけで 74KB、生音は 180KB ある。

export * from './audio.js';

// いつも付いてくるぶんの外。読み込むと自分をエンジンへ登録する
import './opl.js';
import './opnarhythm.js';
import './opmpresets.js';
import './opllpresets.js';
import './acoustic.js';
import './analog.js';
import './phisem.js';
import './bowed.js';
