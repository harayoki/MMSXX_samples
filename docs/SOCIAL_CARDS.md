# SNSカード生成

GitHub Actions の **Render social card** は、既存のアート画像から
1200 × 630 px の `social-card.png` を生成し、対象ページへ OGP / Twitter Card 情報を追加します。
生成画像は Git LFS で管理されます。

## 手動実行

Actions 画面の **Run workflow** で次を指定します。

- `folder`（必須）: `04_Grassland-Trinity` または
  `docs/music/04_Grassland-Trinity` のような曲フォルダ
- `image_path`（任意）: 入力画像。曲フォルダからの相対パス、または
  `docs/music/` から始まるリポジトリ内パス

`image_path` を空にすると、対象の `index.html` にある最初の
`data-music-image` を使用します。指定した場合はその画像で上書きできます。

実行後は `codex/card-render-<run id>` ブランチが作られます。
内容を確認して、そのブランチからPRを作成してください。

## リクエスト用ブランチ

Codexから実行する場合は `codex/card-render-*` ブランチに
`.card-render/*.json` を1件だけ追加します。

```json
{
  "base_sha": "生成元コミットのSHA",
  "folder": "04_Grassland-Trinity",
  "image_path": "grassland-trinity.png"
}
```

Actionsはリクエストファイルだけが変更されていることを検証し、リクエストを
履歴から除いたうえで生成結果を同じブランチへ保存します。
