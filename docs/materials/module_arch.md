
## モジュール構造

```
/
├── main/                  # メインアプリケーション
│   └── v0.1.0/            # バージョン
│       ├── deno.json      # 依存関係設定
│       ├── deno.lock      # ロックファイル
│       ├── src/           # ソースコード
│       ├── docs/          # ドキュメント
│       └── tests/         # テスト
│
└── module/                # モジュール群
    ├── prompt/            # Prompt関連モジュール
    │   ├── api/           # OpenRouter API
    │   │   └── v0.1.0/    # バージョン
    │   │       ├── deno.json
    │   │       ├── src/
    │   │       ├── docs/
    │   │       └── tests/
    │   └── generator/     # Prompt生成
    │       └── v0.1.0/
    │           ├── deno.json
    │           ├── src/
    │           ├── docs/
    │           └── tests/
    ├── io/                # 入出力関連モジュール
    │   ├── json/          # JSON処理
    │   │   └── v0.1.0/
    │   │       ├── deno.json
    │   │       ├── src/
    │   │       ├── docs/
    │   │       └── tests/
    │   └── config/        # 設定ファイル処理
    │       └── v0.1.0/
    │           ├── deno.json
    │           ├── src/
    │           ├── docs/
    │           └── tests/
    ├── project/           # プロジェクト管理
    │   ├── structure/     # 構造化
    │   │   └── v0.1.0/
    │   │       ├── deno.json
    │   │       ├── src/
    │   │       ├── docs/
    │   │       └── tests/
    │   ├── import/        # JSONインポート
    │   │   └── v0.1.0/
    │   │       ├── deno.json
    │   │       ├── src/
    │   │       ├── docs/
    │   │       └── tests/
    │   └── export/        # JSONエクスポート
    │       └── v0.1.0/
    │           ├── deno.json
    │           ├── src/
    │           ├── docs/
    │           └── tests/
    ├── timer/             # タイマー関連
    │   └── v0.1.0/
    │       ├── deno.json
    │       ├── src/
    │       ├── docs/
    │       └── tests/
    ├── progress/          # 進捗管理
    │   ├── prediction/    # 予測
    │   │   └── v0.1.0/
    │   │       ├── deno.json
    │   │       ├── src/
    │   │       ├── docs/
    │   │       └── tests/
    │   └── feedback/      # フィードバック
    │       └── v0.1.0/
    │           ├── deno.json
    │           ├── src/
    │           ├── docs/
    │           └── tests/
    ├── personality/       # 人格機能
    │   └── v0.1.0/
    │       ├── deno.json
    │       ├── src/
    │       ├── docs/
    │       └── tests/
    ├── ui/                # UI関連
    │   └── v0.1.0/
    │       ├── deno.json
    │       ├── src/
    │       ├── docs/
    │       └── tests/
    └── md/                # マークダウン処理
        ├── generator/     # 生成
        │   └── v0.1.0/
        │       ├── deno.json
        │       ├── src/
        │       ├── docs/
        │       └── tests/
        └── mermaid/       # Mermaid図生成
            └── v0.1.0/
                ├── deno.json
                ├── src/
                ├── docs/
                └── tests/
```