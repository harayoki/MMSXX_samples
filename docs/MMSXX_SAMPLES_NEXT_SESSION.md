# MMSXX_samples 次セッション作業ガイド

更新日: 2026-09-22  
対象リポジトリ: `harayoki/MMSXX_samples`

## 1. 最初に守ること

- 作業対象は、ユーザーが明示した `harayoki/MMSXX_samples` のみとする。
- 別リポジトリや似た名前のリポジトリを推測して変更しない。
- 作業開始時に必ず最新の `main` を確認する。
- ユーザーの既存変更を消さない。汚れた作業ツリーでは関係ない変更に触れない。
- 通常の修正は作業ブランチを作り、PRで渡す。
- 画像・音声・動画などのLFS対象ファイルをGitHub Contents APIで直接登録しない。通常blobになる。
- カード生成やLFS画像取込では、専用GitHub Actionsを使う。
- DUMMY、CodeMirror試験ページ、CH1専用ページを公開一覧やカード生成対象に含めるかは、明示指示がある場合だけ変更する。

## 2. Work新規セッションの前提

Workの新規セッションでは、前セッションのローカル作業ディレクトリが残っているとは限らない。

- GitHubプラグインの認証と、シェルのGit認証は別物。
- まずローカルに対象リポジトリがあるか確認する。
- なければ、シェルのGitが使える場合だけcloneする。
- cloneやpushが認証・通信制限で使えない場合は、GitHubプラグインで必要なファイルだけ取得・更新する。
- 過去の一時生成物やローカルSHAの完全復元を開始条件にしない。最新 `main` を正とする。

## 3. 推奨環境

必要なもの:

- Git
- Git LFS
- Node.js 20以上
- Python 3
- ImageMagick 6または7（カードをローカル確認する場合）
- Webブラウザ

このサイトには通常のnpmビルド工程はない。CodeMirrorはブラウザ上で `esm.sh` から読み込むため、ローカル表示にもインターネット接続が必要。

### cloneできる場合

```bash
git clone https://github.com/harayoki/MMSXX_samples.git
cd MMSXX_samples
git lfs install
git lfs pull
git switch main
git pull --ff-only
```

作業ブランチ例:

```bash
git switch -c codex/short-task-name
```

### cloneできない場合

GitHubプラグインで次を行う。

1. `main` の最新コミットを確認する。
2. 必要なファイルだけ取得する。
3. `main` から作業ブランチを作る。
4. テキストファイルをGitHubプラグインで更新する。
5. PRを作る。

バイナリを直接GitHubプラグインで作成・更新してはいけない。画像は「8. LFS画像の追加」を使う。

## 4. ローカル表示

リポジトリ内の `docs/music` をWebルートとして起動する。

```bash
cd docs/music
python3 serve.py
```

ブラウザで開く:

```text
http://127.0.0.1:8000/
http://127.0.0.1:8000/06_BEAT_V2/
```

`file://` ではMMLの `fetch()` が失敗するため、必ずHTTPサーバーを使う。

## 4.1 チャット内MMLPLAYER

ユーザーが「ここにPLAYERを貼る」「ここで再生」「MMLPLAYERを使う」と指示した場合は、公開ページやWAVリンクを渡すだけではなく、**その返答内に操作可能なMMLPLAYERを直接表示する**。

過去の作曲セッションでは、`visualize` スキルを使い、HTML＋JavaScript＋Web Audio APIのインラインUIとして表示していた。実装は `Pico (MML Player)`／`ChipTuneSound` を使用し、外部MP3を鳴らす代用品ではない。

### 必須手順

1. そのセッションで利用可能な `visualize` スキルを全文読む。
2. 最新 `main` から `docs/music/player-engine.js` と対象曲の `player.js`、MMLを取得する。
3. `/workspace/mml-player-<曲slug>.html` にインライン表示用HTMLフラグメントを作る。
4. `player-engine.js` の必要部分、曲固有の音色・エンベロープ登録、MML本文をフラグメント内へ埋め込む。
5. JavaScriptの未定義参照、対象DOM、主要操作を確認する。
6. 最終回答に次の形式を単独行で置き、そのターン内にPLAYERを表示する。

```text
visualize{"path":"/workspace/mml-player-<曲slug>.html"}
```

### visualize用HTMLの制約

- 完全なHTML文書ではなくフラグメントにする。`<!doctype>`、`<html>`、`<head>`、`<body>` は書かない。
- ルート要素に曲固有の一意なIDを付け、`document.getElementById()` で参照する。
- `fetch`、XHR、WebSocketは使えない。GitHub上のJSやMMLを実行時に取りに行かず、必要な内容をフラグメントへ埋め込む。
- 1MB未満に収める。PLAYERエンジン全体が大きい場合は、対象曲の再生に必要な部分だけを含める。
- CSSはテーマ変数を使い、ライト／ダークの両方で読めるようにする。
- 320px幅でも操作できる配置にする。
- 自動再生しない。ユーザー操作後にAudioContextを開始する。
- PLAYERを表示したターンでは、`sandbox:` のHTMLダウンロードリンクで代用しない。

### PLAYERに必要な機能

最低限:

- Play／Pause／Stop
- シークまたは再生位置表示
- 音量
- チャンネル別ON/OFF
- MMLコンパイルエラー表示

曲や比較作業に応じて追加:

- ループ回数
- Endless
- To outro
- ABリピート
- TITLE／ABOUT表示
- MML表示／コピー
- WAV書き出し
- 複数案のタブ切替

過去のインラインPLAYERでは、チャンネル別ミュート、ループ回数、リピート範囲、音量、MML表示／コピー、WAV書き出しまで実装していた。

### 音を一致させるための注意

- MMLだけを渡しても、曲固有の音色は再現できない。
- 対象曲の `player.js` にある `registerEnvelope`、`registerTone`、`registerFM` などをPLAYER初期化前に実行する。
- `ChipTuneSound` の生成オプション、`psgTune`、`spatial`、音量補正も対象ページと揃える。
- `MusicPage.splitMML()` 相当の処理で、先頭の共通マクロを各 `#ch` に引き継ぐ。
- MMLが配列なら各要素を文字列化し、文字列ならチャンネル分割してからPLAYERへ渡す。
- コンパイル後にチャンネル数、総時間、マーク、バンドル音色数、エラーの有無を確認する。
- 試聴用の変更と、採用してリポジトリへ保存するMMLを混同しない。

### やってはいけない対応

- 「WAVを作ります」と返して、MMLPLAYERを表示しない。
- 公開サイトのURLだけを返す。
- HTMLファイルのダウンロードリンクだけを返す。
- MMLを単純なOscillatorへ置き換え、現行 `ChipTuneSound` と違う音で済ませる。
- PLAYERを表示すると宣言したまま、処理中表示でターンを終える。

ユーザーがPLAYERを要求した場合、説明より先にそのターンで再生可能なUIを完成させる。WAVや公開ページは補助物であり、チャット内PLAYERの代替ではない。

## 5. 現在の構成

公開曲フォルダ:

- `docs/music/01_Volcano-parade`
- `docs/music/02_Pocket-Tunnel`
- `docs/music/03_Windward-Crossing`
- `docs/music/04_Grassland-Trinity`
- `docs/music/05_Windward-Battle-Interactive`
- `docs/music/06_BEAT_V2`

共有ファイル:

- `docs/music/player-engine.js`: 共通PLAYER／MMLエンジン
- `docs/music/music-page.js`: 各ページ共通の読込・PLAYER接続
- `docs/music/mml-editor.js`: CodeMirrorのMMLエディタ
- `docs/music/music-page.css`: 曲ページ共通CSS
- `docs/music/index.html`: 曲一覧設定

各曲フォルダの基本構成:

```text
NN_Song-Name/
  index.html
  player.js
  song-name.mml
  cover.png または cover.jpg
  social-card.png
```

## 6. 作曲・MML更新

### MML先頭の基本情報

```mml
#title 曲名
#version 1.0
#about 曲の説明。SNSカードのdescriptionにも使われる。
#arrangement 任意の編曲情報
```

注意:

- 現行PLAYERではシステム行は行頭の `#` を使う。古い `// #` 形式へ戻さない。
- チャンネルは `#ch チャンネル名` で分ける。
- 音色は可能な限り `#bundle` を使い、曲側に必要な指定をまとめる。
- 数値付きエコーは `@s{N,8}` とし、深さを8にする。
- エコー解除だけの `@s0` は不要なら書かない。
- マクロは行数を減らすために使うが、拍やオクターブの状態が読めなくなるほど詰め込まない。
- MMLの編集後は、ブラウザで再生、停止、ループ、チャンネルON/OFF、MML再編集を確認する。

### タイトルの同期

PLAYER上の曲名はMMLの `#title`、ブラウザとカードの元タイトルはHTMLの `<title>` を使う。

この2つは自動同期ではないため、曲名変更時は両方を変更する。

```html
<title>曲名</title>
```

カード生成時には次が自動更新される。

- `meta name="description"`: MMLの `#about`
- `og:title` / `twitter:title`: HTMLの `<title>`
- `og:description` / `twitter:description`: MMLの `#about`
- `og:image` / `twitter:image`

### ページ側の最小PLAYER接続例

各曲の `player.js` は共有エンジンを複製せず、MML読込とページ固有設定だけを書く。

```js
(() => {
  const E = MMSXX.sound;
  const editor = document.getElementById('song-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { spatial: 'mono' });

  fetch(MusicAssets.song('song.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('song-player'), {
        audio,
        mml: MusicPage.splitMML(source),
        loops: 3,
      });
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => player.setMML(MusicPage.splitMML(value)),
      });
      status.textContent = '';
    })
    .catch(error => {
      status.textContent = 'MML読み込みエラー：' + error.message;
    });
})();
```

音色登録が必要な曲は、同じ `player.js` のPLAYER生成前に `registerEnvelope`、`registerTone`、`registerFM` などを置く。

## 7. 新しい曲ページを作る

1. 番号付きフォルダを作る。例: `docs/music/07_New-Song`。
2. 構成が近い既存曲から `index.html` と `player.js` をコピーする。
3. `id`、MML名、画像名、`data-song`、PLAYER要素IDを新しい曲へ合わせる。
4. MMLに `#title`、`#version`、`#about`、`#ch` を入れる。
5. HTMLの `<title>` をMMLの `#title` と同じ表記にする。
6. 表紙リンクに `data-music-image="cover.png"` を付ける。
7. エディタ背景に `data-music-background="cover.png"` を付ける。
8. 次のライセンス表示を維持する。

```text
Music, artwork, MML and exports: CC BY 4.0.
JavaScript source is not covered by CC BY 4.0. Redistribution is prohibited.
Editor: CodeMirror 6 (MIT License).
```

9. ローカルHTTPサーバーで再生確認する。
10. 表紙画像をLFSで追加する。
11. ページ変更をマージ後、SNSカードActionを実行する。

## 8. LFS画像の追加

`.gitattributes` ではPNG、JPEG、GIF、WebP、WAV、MP3、MP4、ZIPなどがLFS対象。

### シェルからpushできる場合

```bash
git lfs install
git add docs/music/07_New-Song/cover.png
node scripts/check_lfs_pointers.cjs
git lfs status
git commit -m "表紙画像を追加"
git push -u origin HEAD
```

確認:

```bash
git show :docs/music/07_New-Song/cover.png | head -3
```

次の形式なら正しい。

```text
version https://git-lfs.github.com/spec/v1
oid sha256:...
size ...
```

### GitHubプラグインしか使えない場合

専用Action: `.github/workflows/import-lfs-asset.yml`

1. 最新 `main` の完全なSHAを取得する。
2. そのSHAから `codex/lfs-import-*` ブランチを作る。
3. 画像のSHA-256、バイト数、Base64を求める。
4. そのブランチへ `.lfs-import/*.json` を1ファイルだけ追加する。

```json
{
  "base_sha": "MAINの完全なSHA",
  "path": "docs/music/07_New-Song/cover.png",
  "sha256": "画像のSHA-256",
  "size": 123456,
  "content_base64": "画像全体のBase64"
}
```

重要:

- リクエストコミットの親は `base_sha` と一致させる。
- そのコミットの変更はJSON 1ファイルだけにする。
- Actionがリクエストコミットを消し、LFSポインタだけを含むコミットへブランチを書き換える。
- 完了後、そのブランチからPRを作る。

## 9. SNSカード生成

専用Action: `.github/workflows/render-social-card.yml`

生成内容:

- 1200×630 PNG
- 中央に表紙画像
- 左右に装飾用MMLソース
- 表紙平均色から補色系のMML文字色を自動選択
- `#about` をSNS descriptionへ設定
- HTML `<title>` を `「曲名」 MMLライブ再生` へ変換
- `og:image` と `twitter:image` に生成元コミットSHAの `?v=` を付けてキャッシュを回避
- `social-card.png` をGit LFSで保存

### GitHub画面から手動実行

1. GitHubの `Actions` を開く。
2. `Render social card` を選ぶ。
3. `Run workflow` を押す。
4. `folder` に曲フォルダ名を指定する。
5. 通常は `image_path` を空欄にする。

例:

```text
folder: 03_Windward-Crossing
image_path:
```

別画像を使う場合だけ `image_path` を指定する。

```text
image_path: alternate-cover.png
```

フォルダ相対または `docs/music/...` から始まるリポジトリ相対パスを使える。

Actionは `codex/card-render-<RUN_ID>` ブランチへ生成結果をpushする。完了後、そのブランチから `main` へのPRを作る。

### GitHubプラグインから起動

GitHubプラグインにworkflow dispatch機能がない場合は、pushトリガーを使う。

1. 最新 `main` の完全なSHAを取得する。
2. そのSHAから `codex/card-render-*` ブランチを作る。
3. `.card-render/*.json` を1ファイルだけ追加する。

```json
{
  "base_sha": "MAINの完全なSHA",
  "folder": "03_Windward-Crossing",
  "image_path": ""
}
```

重要:

- リクエストコミットの親は `base_sha` と一致させる。
- 変更はリクエストJSON 1ファイルだけにする。
- ブランチ名は必ず `codex/card-render-*` にする。
- ActionがJSONを履歴から除去し、カード画像とHTMLだけの生成コミットへブランチを書き換える。
- Action完了後、HTMLの `og:title`、description、`?v=` と、`social-card.png` のLFSポインタを確認する。
- 差分がなければActionは正常終了し、PRは不要。
- 差分があれば、そのブランチからPRを作る。

### カード生成前の注意

- 曲名や `#about` を変更した場合は、ページ側の変更を先に `main` へマージする。
- その後、最新 `main` からカード生成を実行する。
- 複数曲は曲ごとに別ブランチ・別リクエスト・別PRにする。
- DUMMYや非公開ページは明示指示なしに生成しない。

## 10. PLAYER更新

- 共通PLAYERは `docs/music/player-engine.js`。
- 各曲の `player.js` はページ固有の薄い接続層。
- 最新PLAYERを取り込む場合、共有ファイルだけを機械的に置換して終わりにしない。
- MML文法変更がある場合は、全 `.mml` を検索して移行対象を列挙する。
- 例: エコー仕様変更時は `rg -n '@s' docs/music --glob '*.mml'` で使用チャンネルも確認する。
- バンドル音色仕様変更時は `#bundle` と各 `@{bundleName}` の対応を確認する。
- `#` システム行、コメント色、検索パネル、選択色などは `mml-editor.js` と `music-page.css` の両方を確認する。
- 共有PLAYER更新後は、少なくとも公開6ページをブラウザで確認する。

確認項目:

- 初回再生
- 停止と再開
- ループ
- チャンネルON/OFF
- ABリピート
- JUMPTO／マーク
- MML編集後の再適用
- 検索・置換パネル
- WAVダウンロードがあるページ
- ブラウザコンソールエラー

## 11. 最低限の検査

変更に応じて実行する。

```bash
node --check docs/music/player-engine.js
node --check docs/music/music-page.js
node --check scripts/prepare_social_card.cjs
node --check scripts/render_mml_overlay.cjs
node --check scripts/select_social_card_color.cjs
node scripts/check_lfs_pointers.cjs
git diff --check
git status --short
```

曲固有の `player.js` も対象にする。

```bash
node --check docs/music/03_Windward-Crossing/player.js
```

カードのメタ情報だけ確認する場合:

```bash
SOCIAL_CARD_VERSION=test \
  node scripts/prepare_social_card.cjs 03_Windward-Crossing --check
```

`--check` を付ければHTMLを書き換えず、解決されたタイトル、説明、画像、MML、出力先を確認できる。

## 12. PRの作り方

- 通常変更とカード生成結果は、できるだけ別PRにする。
- PR本文に変更対象、確認内容、LFS確認結果を書く。
- 画像を含むPRでは `social-card.png` や表紙がLFSポインタであることを確認する。
- マージ可能状態を確認してからユーザーへURLを渡す。
- マージはユーザーが行う。明示指示なしにこちらでマージしない。

## 13. 現在の重要仕様

- 風渡りの境界の正式表記: `風渡りの境界 (RPG組曲)`
- カードタイトル形式: `「タイトル」 MMLライブ再生`
- カードdescription: MMLの `#about` をそのまま使用
- カードMML文字色: 緑固定ではなく、表紙画像の平均色から自動選択
- MMLシステム行の色: 各ページのテーマ色より少し明るい色
- MMLコメント色: 白にはしない明るめのグレー
- MML選択背景: 本文色と色相をずらした暗色
- 検索パネル: ページ配色、入力欄を拡大、文字シャドウなし
- 画像URL: GitHub LFS用の `media.githubusercontent.com` を使用

## 14. 次セッション開始用プロンプト

```text
harayoki/MMSXX_samples の作業を引き継いでください。
最初に最新mainと、このプロジェクトに添付した MMSXX_SAMPLES_NEXT_SESSION.md を確認してください。
作業先はこのリポジトリだけです。別リポジトリを推測して変更しないでください。

Workの新規セッションではローカル環境が継承されない前提です。
GitHubプラグインとシェルGit認証は別なので、cloneできなければGitHubプラグインで必要なソースだけ取得してください。
画像は通常blobにせず、Git LFSまたは専用LFS取込Actionを使用してください。
カード生成は専用Render social card Actionを使ってください。

まず現状だけ確認し、次の明示指示を待ってください。
```
