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

## 検証

```sh
node scripts/check_lfs_pointers.cjs
node scripts/test_music_mml.cjs
node scripts/test_music_assets.cjs
node scripts/test_music_wav.cjs
```

システムのChromiumを使う場合は
`MUSIC_TEST_CHROMIUM=/path/to/chromium` を付ける。
