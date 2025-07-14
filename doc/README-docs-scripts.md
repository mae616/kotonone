# 📚 ドキュメント生成スクリプト

このプロジェクトでは、Markdownファイルから高品質なPDFドキュメントとJSDocを自動生成できます。

## 🚀 クイックスタート

### 全ドキュメント一括生成
```bash
npm run docs:full
```
> RDD、全MDファイルのPDF、JSDocを一括生成

## 📋 利用可能なスクリプト

### 🎯 個別PDF生成

#### タスク管理
```bash
npm run docs:pdf:task
```
- 出力: `doc/99_slide_pdf/task/todo.pdf`
- 内容: プロジェクトのタスク管理情報

#### アーキテクチャ
```bash
npm run docs:pdf:architecture
```
- 出力: `doc/99_slide_pdf/architecture/architecture-overview.pdf`
- 内容: システム全体のアーキテクチャ概要

#### UML図
```bash
npm run docs:pdf:uml
```
- 出力先: `doc/99_slide_pdf/uml/`
- ファイル:
  - `class-diagram.pdf` - クラス図
  - `data-flow.pdf` - データフロー図
  - `page-flow-diagram.pdf` - ページ遷移図
  - `system-overview.pdf` - システム概要図

#### API設計
```bash
npm run docs:pdf:api
```
- 出力: `doc/99_slide_pdf/api/api-specification.pdf`
- 内容: APIエンドポイントの詳細仕様

#### 設計ドキュメント
```bash
npm run docs:pdf:design
```
- 出力先: `doc/99_slide_pdf/design/`
- ファイル:
  - `data-flow-analysis.pdf` - データフロー分析
  - `debug-page-design.pdf` - デバッグページ設計
  - `design-system.pdf` - デザインシステム
  - `implementation-status.pdf` - 実装状況
  - `test-*-page-design.pdf` - 各テストページ設計

#### テストケース
```bash
npm run docs:pdf:test
```
- 出力: `doc/99_slide_pdf/test/tdd-practice.pdf`
- 内容: TDD実践記録とテスト戦略

### 🔧 JSDoc生成

#### JSDoc HTML生成
```bash
npm run jsdoc:generate
```
- 出力: `docs/jsdoc/`
- 内容: JavaScript/APIの詳細ドキュメント

#### JSDoc監視モード
```bash
npm run jsdoc:watch
```
- ファイル変更を監視して自動更新

### 📊 RDDスライド生成

#### PDF
```bash
npm run marp
# または
npm run slides
```
- 出力: `doc/99_slide_pdf/rdd-slides.pdf`

#### HTML
```bash
npm run marp:html
```
- 出力: `doc/99_slide_pdf/rdd-slides.html`

#### PowerPoint
```bash
npm run marp:pptx
```
- 出力: `doc/99_slide_pdf/rdd-slides.pptx`

### 🎯 組み合わせスクリプト

#### 全PDF一括生成
```bash
npm run docs:pdf:all
```
> MDファイルをすべてPDF化（RDD除く）

#### 全ドキュメント生成
```bash
npm run docs:generate:all
```
> JSDoc + 全PDF + RDD を一括生成

#### 完全生成（推奨）
```bash
npm run docs:full
```
> 進捗表示付きで全ドキュメント生成

## 📁 出力ディレクトリ構造

```
doc/99_slide_pdf/
├── rdd-slides.pdf              # RDD要件定義
├── rdd-slides.html             # RDD HTML版
├── task/
│   └── todo.pdf                # タスク管理
├── architecture/
│   └── architecture-overview.pdf  # アーキテクチャ
├── uml/
│   ├── class-diagram.pdf       # クラス図
│   ├── data-flow.pdf          # データフロー
│   ├── page-flow-diagram.pdf  # ページ遷移
│   └── system-overview.pdf    # システム概要
├── api/
│   └── api-specification.pdf  # API仕様
├── design/
│   ├── data-flow-analysis.pdf
│   ├── design-system.pdf
│   ├── implementation-status.pdf
│   └── test-*-page-design.pdf  # 各種テストページ
└── test/
    └── tdd-practice.pdf        # TDD実践

docs/jsdoc/                     # JSDoc HTML
├── index.html                  # メインページ
├── global.html                 # グローバル関数
└── module-*.html              # 各モジュール
```

## 🛠️ 必要な依存関係

- `@marp-team/marp-cli` - Markdown→PDF変換
- `jsdoc` - JavaScript→HTMLドキュメント生成

## 💡 使用例

### 開発フローでの利用
```bash
# 開発開始時
npm run docs:full

# API変更後
npm run jsdoc:generate
npm run docs:pdf:api

# 設計変更後
npm run docs:pdf:architecture
npm run docs:pdf:uml

# リリース前
npm run docs:full
```

### CI/CDでの自動生成
```yaml
- name: Generate Documentation
  run: npm run docs:full
```

## 📋 注意事項

- PDF生成にはMarpを使用（プレゼンテーション形式）
- JSDocは`src/**/*.js`ファイルを自動解析
- 出力ディレクトリは自動作成される
- 生成エラー時は個別スクリプトで問題を特定

## 🎯 トラブルシューティング

### PDF生成エラー
```bash
# 個別に実行して問題を特定
npm run docs:pdf:task
npm run docs:pdf:architecture
# ...
```

### JSDoc生成エラー
```bash
# 構文チェック
npm run lint:jsdoc

# 設定確認
cat jsdoc.conf.json
```

---

📚 **Happy Documentation!** 美しいドキュメントで開発効率を最大化しましょう ✨