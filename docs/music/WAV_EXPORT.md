# 楽曲ページのWAV書き出し

各ページは現行プレイヤーの `Export WAV` を使用する。

- `Main loops` の値を反映する
- チャンネルのミュートを反映する
- A–Bが有効なら選択範囲を書き出す
- ファイル名はMMLの `#title` から決める
- 生成中はプレイヤー内の進捗表示と `Cancel` を出す
- MML欄を編集してフォーカスを外すと、次の再生・書き出しへ反映する

`dynamic_effects` は、書き出し時に有効なチャンネルの設定がWAVにも含まれる。
画面で無効にした動的エフェクトは含まれない。MMLの `@s` で生成した
エコー音符もWAVへ含まれる。

## 検証

```sh
node scripts/test_music_wav.cjs
# システムのChromiumを使う場合
MUSIC_TEST_CHROMIUM=/path/to/chromium node scripts/test_music_wav.cjs
```

GitHub Actionsは追加しない。
