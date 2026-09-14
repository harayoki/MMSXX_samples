# 楽曲ページのWAV書き出し

対象は Volcano Parade と Pocket Tunnel の3アレンジ。

- 選択中のタブの、ボタンを押した時点の編集欄のMMLを曲頭から最後まで出力する。
- 再生途中からの録音ではない。書き出し中も通常再生を継続できる。
- エンジン標準 `renderBGM` を専用インスタンスで使い、48 kHz・16 bit PCM・モノラルのWAVにする。末尾に1秒の余韻を含む。
- 再生と同じ譜面準備・音色・音量補正を使う。エンジン本体は変更しない。
- 一度でも編集欄の `input` が発生したタブには、ページを開いている間 `_arranged` を付ける。Undoで原文へ戻しても保持する。タブごとに独立し、リロードでリセットされる。
- 書き出し開始後にタブやMMLを変更しても、そのダウンロードの内容・名前は開始時点のものになる。

| 選択 | 未編集のファイル名 |
| --- | --- |
| Volcano Parade | `volcano_parade.wav` |
| ノーマル | `pocket_tunnel.wav` |
| おしゃれ | `pocket_tunnel_jazz.wav` |
| チップチューン | `pocket_tunnel_fusion_v1.wav` |

## ループ回数

各MML冒頭のマクロの数字を変更する。

```mml
// この数値を直すと本編のループ回数が変わります（1以上）。
$LOOP_END = { ]1 }
```

標準値はPocket Tunnelが1、Volcano Paradeが2。開始側の `[` と、終了側の `$LOOP_END` を使う標準MMLマクロであり、独自の反復命令ではない。エンジンのマクロ展開では空白が挿入されるため、数字だけでなく `]1` 全体をマクロにしている。

プレイヤーは先頭の共通マクロ定義を各パートのコンパイルに引き継ぐ。別のプレイヤーでパートごとにコンパイルする場合も同様に共通定義を渡す。定義済みの先頭パートには二重追加しない。

Pocket Tunnelは24小節の本編を反復し、イントロとエンディングは1回。各パートの本編冒頭で音色・音量・ゲート等を復元するため、前周の末尾設定を引き継がない。Volcano Paradeは既存の本編反復範囲（静かな区間とINTRO2を含む）を維持する。

## 実装

`wav-download.js` がファイル名・編集状態・ダウンロード・PCM WAV化を担当する。

Pocket Tunnelは通常再生と同じ `ptPrepare` を使用する。Volcano Paradeは埋め込みプレイヤーの曲専用ラッパーから `renderVolcanoWav` を公開し、既存の音色登録と譜面準備関数を共用する。Volcano Paradeの埋め込み部分は、復号した内容を比較するとラッパーの共通マクロ対応と書き出しAPIの追加だけで、音源エンジンは同一。

曲・MML・書き出したWAVのライセンスはページ記載のCC BY 4.0。JavaScriptの権利表記とは対象が異なる。`_arranged` は編集の目印であり、クレジットや変更表示を代替するものではない。

## 検証

PlaywrightとChromiumを用意して次を実行する（GitHub Actionsは追加しない）。

```sh
node scripts/test_music_wav.cjs
# システムのChromiumを使う場合
MUSIC_TEST_CHROMIUM=/path/to/chromium node scripts/test_music_wav.cjs
```

全4曲の実WAV生成、ヘッダー・長さ・無音/クリッピング、再生中の書き出し、ループ回数編集、タブごとの編集履歴、元に戻した後の命名、MML欄の表示、スマートフォン幅での横はみ出しを確認する。
