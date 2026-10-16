# PLAYER / サウンドエンジン更新と曲間音量合わせ

対象は `docs/music/` の公開曲15バリエーション（Pocket Tunnel 3版、Windward CH1を含む）。
本番のMMLを勝手に書き換えないため、**作業ブランチ上で**次を実行する。

1. 隣に最新の `harayoki/mmsxx-mml-studio` をチェックアウト。Studioの `npm install` を済ませる。
2. `node scripts/sync-mmsxx-player.mjs ../mmsxx-mml-studio`。公開サイト用の公式エンジンとPLAYERを同じStudio commitから生成する。
3. `npm install --no-save playwright` および `npx playwright install chromium`。FFmpegは不要。
4. `node scripts/normalize-music-gain.mjs`。各ページの公式PLAYERの `Level`（`player.measure()`）を呼び、PLAYERが返した `gainWrite` を `#gain` へ反映。もう一度Levelで測定し、`docs/music/LOUDNESS_REPORT.md` に前後の実測を記録する。
5. `git diff` で、曲ごとの `#gain` 以外に音符や楽器の変更がないことを確認する。
6. 実ブラウザで各ページの再生・WAV書き出し・Levelボタンを確認する。

PLAYERのLevelがIntegrated LUFSとtrue peakを測り、既存の `#gain` を含めた推奨値 `gainWrite` を算出する。スクリプト側で計算式を重複実装しない。**WAVファイルには書き出さず**、MMLのマスターGAINだけ変更する。
無限ループ曲は測定中だけ `loopTimes=1` にして、測定後に元へ戻す。
リミッター、コンプレッサー、動的loudnorm、チャンネル別ミックス変更は禁止。
true peak -1 dBTPは必須。PLAYERの `gainWrite` は小数2桁に丸められるため、越えたときだけ全体倍率を0.1 dBずつ下げ、Levelで再測定する。

**現状:** 最新Studioからの再ビルドと15曲の実測は、まだ実行していない。
この状態を完了扱いにせず、PRはDraftのままにする。
