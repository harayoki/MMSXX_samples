# 楽曲ページのファイル参照

各楽曲ページは共通ローダー `music-page.js` と共通プレイヤー
`player-engine.js` を使用する。共通プレイヤーは
`harayoki/mmsxx-mml-studio` の
`850b3ce6e88e6cec0ab7971f20b91b6cb912067f` をバンドルしたもの。

## ファイル構成

- 共通：`music-page.js`、`music-page.css`、`player-engine.js`
- 曲固有：各フォルダの `index.html`、`player.js`、`*.mml`
- 画像：開発時は各曲フォルダから読む
- 公開画像：GitHub PagesではGit LFSのmedia URLへ切り替える

各曲の `index.html` 末尾には、曲フォルダを指定してローダーを置く。

```html
<script src="../music-page.js" data-song="02_Pocket-Tunnel"></script>
```

新しいMMLは `#ch 名前` でチャンネルを分ける。先頭の共通マクロは
`MusicPage.splitMML()` が各チャンネルへ渡す。空行は自由に使用できる。

## 曲一覧

| 曲 | フォルダ |
| --- | --- |
| Volcano Parade | `01_Volcano-parade` |
| Pocket Tunnel | `02_Pocket-Tunnel` |
| Windward Crossing | `03_Windward-Crossing` |
| 草原のトリニティ | `04_Grassland-Trinity` |
| 風渡りの境界 戦闘曲(インタラクティブ) | `05_Windward-Battle-Interactive` |
| BEAT2 | `06_BEAT2` |
| STARFABLE — BOSS | `08_STARFABLE-Boss` |

草原のトリニティの `grassland-trinity.jpg` と
`grassland-trinity.png` は未配置。リンク切れを許容している。

## ローカル確認

```sh
cd docs/music
python3 serve.py
```

`http://127.0.0.1:8000/` から各曲フォルダを開く。`file://` はMMLの
`fetch` が制限されるため使用しない。

## MMLとJS APIの更新点

- メタデータ：`#title`、`#about`
- チャンネル：`#ch`、`#role`
- 波形：`pulse:50`、`pulse:25`、`pulse:12`、`noise:white`
- ビブラート：旧 `@v` ではなく `@m`
- `@d`：元音を増やさず音程そのものをセント移動
- `@o`：元音を増やさずチャンネル全体をオクターブ移動
- `@s`：空き部分へエコー音符を生成
- `#takes <グループ> restart`：次の切れ目でテイク変更し、囲みの先頭から再生
- `#takes <グループ> now`：切れ目を待たず、ただちにテイク変更
- 声を重ねるデチューン・オクターブ・エコー：
  `audio.dynamic_effects[ch]`

Volcano Paradeの7セント重ねと、Pocket Tunnel「おしゃれアレンジ」の
14セント重ねは `dynamic_effects` へ移している。有効な動的エフェクトは
再生だけでなくWAV書き出しにも含まれる。

## PLAYERを改造しない（引継ぎ必須）

- 曲の調整のために、公式PLAYER・エンジンを独自に改造しない。
  共通 `player-engine.js` だけでなく、個別 `player.js`、チャット内の試聴プレイヤーにも適用する。
- 個別JSからPLAYERの内部状態・内部GainNode・コンパイル済みイベントを直接操作しない。
  `bgmState.gain` への書き込み、`bgmDefs` 内のイベント書換え、
  タイマーによる独自フェードなどは禁止する。
- `renderBGM` 等のメソッドの上書き・差し替え、独自の再生制御や
  WAV後処理でPLAYERにない機能を補うことは禁止する。
- 曲固有の設定は、公式に提供されている設定・公開APIとMMLで表現する。
  音色・エンベロープの登録は可能だが、PLAYERの挙動の改造には使わない。
- 公式機能で実現できない場合は、制約を説明して対応方針を相談する。
  独自実装で回避せず、取得元リポジトリにも無断で書き込まない。
- 引継ぎ時にもこの禁止事項を維持する。既存コードに独自処理があっても、
  それを前例として追加・横展開しない。

### 既存の是正対象

STARFABLEの個別 `player.js` にある、`bgmState.gain` を操作する
タイマーフェードと、`renderBGM` の上書きによるWAV後処理は、このルールに反する。
公式フェード機能の仕様を確認し、公式機能へ移行して独自処理を撤去する。
この記載は当該実装の継続を承認するものではない。

## 検証

```sh
node scripts/check_lfs_pointers.cjs
node scripts/test_music_mml.cjs
node scripts/test_music_assets.cjs
node scripts/test_music_wav.cjs
```

システムのChromiumを使う場合は
`MUSIC_TEST_CHROMIUM=/path/to/chromium` を付ける。
