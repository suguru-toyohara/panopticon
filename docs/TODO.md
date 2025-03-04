# 要件・要求を満たすために必要な要素 v0.1.0

それぞれ作成すべきdenoモジュールになっている。
依存関係も含む要素を作成する。

## 現在のTODOリスト

- [x] StoryPointを2pt = 1hとして割り振る
- [x] 不要な粒度のmodule分割をmergeする。
  - [x] 相談する。（何を基準にマージするか考える）
  - [x] 何をマージするか決める。←これは全部書いてみてから決めればいいかも。
- [x] TODOリストを改変したので下記を行う
  - [x] 依存関係mermaid図を作成する。
  - [x] 見積もりを算定する
  - [x] パスを修正する 

## 依存関係順の作成しなければいけないモジュール群

上から順番に実装していく。依存先のないモジュールから順に実装し、依存関係の下層から上層へと進める。

### 基盤モジュール（依存先なし）

- [ ] **PromptをOpenRouterAPIに投げる基本的なモジュール** v0.1.0
  - パス: `/module/prompt/api/v0.1.0/`
  - 見積もり：4pt (2時間)

- [ ] **jsonを読み出す機能 module** v0.1.0
  - パス: `/module/io/json/v0.1.0/`
  - 見積もり：2pt (1時間)

- [ ] **PCから正確に時間を測ってくれる機能** v0.1.0 (must)
  - パス: `/module/timer/v0.1.0/`
  - 見積もり：2pt (1時間)

- [ ] **JSONデータからマークダウン形式のTODOリストを生成するmodule機能** v0.1.0
  - パス: `/module/md/generator/v0.1.0/`
  - 見積もり：4pt (2時間)

- [ ] **依存関係を視覚的に表現するMermaid図を自動生成するmodule機能** v0.1.0
  - パス: `/module/md/mermaid/v0.1.0/`
  - 見積もり：6pt (3時間)

### 第2層モジュール

- [ ] **Promptを自動生成して投げる機能** v0.1.0
  - パス: `/module/prompt/generator/v0.1.0/`
  - 依存: PromptをOpenRouterAPIに投げる基本的なモジュール
  - 見積もり：6pt (3時間)

- [ ] **config.jsonを読み出したりする機能** v0.1.0
  - パス: `/module/io/config/v0.1.0/`
  - 依存: jsonを読み出す機能 module v0.1.0
  - 見積もり：4pt (2時間)

- [ ] **プロジェクトフォルダ内で各種マイルストーン名.jsonをimportするmodule** v0.1.0
  - パス: `/module/project/import/v0.1.0/`
  - 依存: jsonを読み出す機能 module v0.1.0
  - 見積もり：4pt (2時間)

### 第3層モジュール

- [ ] **計測された進捗の予測・実測を元にマイルストーンの到達予想時刻を表示する機能** (must)
  - パス: `/module/progress/prediction/v0.1.0/`
  - 依存: Promptを自動生成して投げる機能 v0.1.0
  - 見積もり：8pt (4時間)

- [ ] **統計データを元に進捗予測時間のフィードバック修正機能module** v.0.1.0 (must)
  - パス: `/module/progress/feedback/v0.1.0/`
  - 依存: Promptを自動生成して投げる機能 v0.1.0
  - 見積もり：8pt (4時間)

- [ ] **プロジェクトフォルダ内に各種マイルストーン名.jsonとmdをexportするmodule** v0.1.0
  - パス: `/module/project/export/v0.1.0/`
  - 依存: JSONデータからマークダウン形式のTODOリストを生成するmodule機能 v0.1.0
  - 見積もり：4pt (2時間)

### 第4層モジュール

- [ ] **1時間ごとに進捗を聞いてくるPromptをAPI経由で流し、ユーザに応答するようにさせるmodule** v0.1.0
  - パス: `/module/prompt/interaction/v0.1.0/`
  - 依存: Promptを自動生成して投げる機能 v0.1.0
  - 見積もり：10pt (5時間)

- [ ] **タスク/マイルストーン/プロジェクト という形で管理するmodule** v0.1.0
  - パス: `/module/project/structure/v0.1.0/`
  - 依存: 
    - プロジェクトフォルダ内に各種マイルストーン名.jsonとmdをexportするmodule v0.1.0
    - プロジェクトフォルダ内で各種マイルストーン名.jsonをimportするmodule v0.1.0 
    - config.jsonを読み出したりする機能 v0.1.0
  - 見積もり：12pt (6時間)

- [ ] **進捗予測値作成module** v0.1.0 (must)
  - パス: `/module/progress/prediction/v0.1.0/`
  - 依存:
    - PCから正確に時間を測ってくれる機能 v0.1.0 (must)
    - 計測された進捗の予測・実測を元にマイルストーンの到達予想時刻を表示する機能 (must)
    - 統計データを元に進捗予測時間のフィードバック修正機能module v.0.1.0 (must)
  - 見積もり：8pt (4時間)

### 第5層モジュール

- [ ] **entrypoint** v0.1.0
  - パス: `/main/v0.1.0/`
  - 依存: 
    - 1時間ごとに進捗を聞いてくるPromptをAPI経由で流し、ユーザに応答するようにさせるmodule v0.1.0
    - タスク/マイルストーン/プロジェクト という形で管理するmodule v0.1.0
    - 進捗予測値作成module v0.1.0 (must)
  - 見積もり: 4pt (2時間)

### 拡張モジュール

- [ ] **人格機能module** v0.1.0 (enhance)
  - パス: `/module/personality/v0.1.0/`
  - 機能:
    - 励ましの機能とかもつける
    - 様々な人格を入れておく
  - 見積もり：10pt (5時間)

- [ ] **TUImodule** (enhance)
  - パス: `/module/ui/v0.1.0/`
  - 機能:
    - 進捗統計表示機能 (enhance)
  - 見積もり：12pt (6時間)
