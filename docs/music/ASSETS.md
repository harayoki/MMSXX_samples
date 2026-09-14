# 楽曲ページのファイル参照

Volcano ParadeとPocket Tunnelは、共通ローダー `music-page.js` のURLを基準に全ファイルを解決する。HTMLのURLや `<base>` に依存して個別の画像・MML・JSを書き換える必要はない。

## 通常の開発・公開

各曲のindex.html末尾に次の1本を置く。開発時とGitHub Pages公開後で同じ記述を使う。

```html
<script src="../music-page.js" data-song="02_Pocket-Tunnel"></script>
```

- 共通JS：`music-page.js`、`sound-engine.js`、`wav-download.js` は `docs/music/` 直下。
- 曲専用JS：各曲フォルダの `player.js`。音色や譜面準備はここに置く。
- MML：各曲フォルダの `.mml` をHTTPで取得する。
- 画像：開発時は各曲フォルダから読む。ローカルではGit LFSの実ファイルを取得しておく。
- 公開画像：ローダーが `https://harayoki.github.io/MMSXX_samples/music/` にある場合だけ、Git LFS実体のmedia URLへ切り替える。
- エンジンとMMLは通常のGitHub PagesのURLを使い、media URLにはしない。

ローカル確認はHTTPサーバーを使う。例：リポジトリで `python -m http.server 8000 --directory docs` を実行し、`http://localhost:8000/music/02_Pocket-Tunnel/` を開く。`file://` でHTMLを直接開く方法はMMLのfetchが制限されるため対象外。

## JSから参照

```js
fetch(MusicAssets.song('original.mml'));
MusicAssets.image('pocket-tunnel.png');
MusicAssets.shared('wav-download.js');
```

画像リンクと背景はHTMLにファイル名を書く。ローダーが解決する。

```html
<a href="./pocket-tunnel.png" data-music-image="pocket-tunnel.png">cover art</a>
<textarea data-music-background="pocket-tunnel.jpg"></textarea>
```

## 別の場所にHTMLを置く場合

最初のローダー自身の場所だけはブラウザへ指定する必要がある。公開資材を使うプレビューなら、この1か所を絶対URLにする。

```html
<script src="https://harayoki.github.io/MMSXX_samples/music/music-page.js"
        data-song="02_Pocket-Tunnel"></script>
```

以降の共通JS・曲専用JS・MML・画像はこのURLと `data-song` から解決される。初回公開前の新規ファイルや未マージの曲を、mainのURLから取得することはできない。その場合はローカルHTTPサーバーまたは必要な資材を配置したプレビュー環境を使う。

## 検証

`MUSIC_TEST_CHROMIUM=/path/to/chromium node scripts/test_music_assets.cjs`

ローカルと公開先を模したURLで、両曲の参照先・MML取得・通常再生・編集WAV出力を確認する。外部ネットワークを使わずHTTPレスポンスをローカルファイルに置き換える。

## エンジンの取得元

共通エンジンは mmsxx-mml-studio のコミット `01d1cfedcbb5f0b52586a0bfec3914521c9131ab` の `sound/` を、元コードを改変せずバンドルしたもの。マクロ展開時に空白を挿入しない更新を含む。ページ固有のMML構文変換は行わない。

風渡りの境界（03）も共通ローダー・WAV UIを使用する。画像の実ファイルは未追加のまま。
