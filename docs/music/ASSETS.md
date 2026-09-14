# 楽曲ページのファイル参照

Volcano Parade（01）・Pocket Tunnel（02）・風渡りの境界（03）は、共通ローダー `music-page.js` のURLを基準に全ファイルを解決する。最初のローダーのURLが解決された後は、個別の画像・MML・JSを書き換える必要はない。相対指定の `src="../music-page.js"` 自体は、HTMLのURL（`<base>` があればそのURL）から解決される。

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

## ローカル確認用サーバー

このファイルと同じフォルダの [`serve.py`](serve.py) と [`serve.bat`](serve.bat) を使用できる。Python 3が必要。

Windowsでは、リポジトリのルートから次を実行する。

```bat
cd docs\music
serve.bat
```

macOS / Linuxでは次を実行する。

```sh
cd docs/music
python3 serve.py
```

起動後、`http://127.0.0.1:8000/` にフォルダ一覧が表示される。各曲の確認URLは次のとおり。

| 曲 | URL |
|---|---|
| Volcano Parade | http://127.0.0.1:8000/01_Volcano-parade/ |
| Pocket Tunnel | http://127.0.0.1:8000/02_Pocket-Tunnel/ |
| 風渡りの境界 | http://127.0.0.1:8000/03_Windward-Crossing/ |

- `serve.py` は**起動時のカレントディレクトリ**を公開する。スクリプトの置き場所へ自動移動しないため、上記の `cd` が必要。
- 現在は `127.0.0.1:8000` 固定。同じPCから確認する。停止は Ctrl+C。
- `serve.bat` は `py serve.py 8000 --dir .` を実行するが、現在の `serve.py` は引数を解析しない。引数を変えてもポートや公開フォルダは変わらない。
- `/` は `index.html` ではなく一覧を表示する。MUSIC TOPを直接確認する場合は `http://127.0.0.1:8000/index.html` を開く。
- 曲フォルダだけを公開すると、親フォルダの共通JSを取得できない。`docs/music` またはそれより上を公開する。
- `file://` でHTMLを直接開く方法はMMLのfetchが制限されるため対象外。

別のポートを使う場合などは、標準HTTPサーバーも使える。リポジトリのルートで以下を実行する（Windowsでは `python3` を `py` に置き換える）。

```sh
python3 -m http.server 8001 --bind 127.0.0.1 --directory docs
```

この場合は `docs` が公開ルートなので、曲のURLは `http://127.0.0.1:8001/music/02_Pocket-Tunnel/` のように `/music/` を含む。

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

PlaywrightとChromiumを用意し、リポジトリのルートで実行する。ローカルと公開先を模したURLで、3曲の参照先・MML取得・通常再生・編集WAV出力を確認する。外部ネットワークを使わずHTTPレスポンスをローカルファイルに置き換える。

## エンジンの取得元

共通エンジンは mmsxx-mml-studio のコミット `af182d03b986bd28bd2e316f78df947336af68f3` の `sound/` を、元コードを改変せずバンドルしたもの。マクロ展開時に空白を挿入しない更新、および `[ ... ]0` は省略・`[ ... ]*` は無限ループとなる更新を含む。ページ固有のMML構文変換は行わない。

風渡りの境界（03）も共通ローダー・WAV UIを使用する。`windward-crossing.jpg` と `windward-crossing.png` は追加済み。

## 風渡りの境界の選曲

MML冒頭の `*_COUNT` が全3パート共通の再生回数。0は省略、1以上は指定回数、`*` は無限ループ。2度目の登場には別の回数を用意している。単独再生する場合は、目的の曲以外を0にする。全て0なら再生・WAV出力とも案内を表示する。

`$ORDER` で演奏順を一か所に定義し、各曲の先頭の `$RESET` で音域・既定音長・音色・音量・テンポ・定位・エフェクトを初期化してから曲固有の設定を適用する。回数と順番の編集は再生・WAVの両方に反映される。

`// @channel` はサンプル側のパート区切り。最初の区切りより前の共通MMLを、そのまま各パートの先頭へ渡して標準 `compileMML` でコンパイルする。独自の構文変換やマクロ展開はしない。別のプレイヤーで使う場合も、各パートへ共通部分を付けて渡す。

音符・休符を編集するときは各パートの拍数をそろえる。共通の回数設定は、譜面自体の長さの違いを自動補正するものではない。
