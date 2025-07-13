This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📊 Documentation & Slides

### Marp Slides Generation

このプロジェクトでは、要件定義書（`doc/02_requirements_definition/rdd.md`）をMarpを使ってスライド形式で表示・出力できます。

#### 手動でスライドを生成

```bash
# PDF形式で生成
npm run marp

# HTML形式で生成  
npm run marp:html

# PowerPoint形式で生成
npm run marp:pptx

# 全てのスライドを生成（PDF）
npm run slides
```

生成されたスライドは `doc/99_slide_pdf/` ディレクトリに保存されます。

#### 自動生成（GitHub Actions）

`doc/02_requirements_definition/rdd.md` がpushされると、GitHub Actionsが自動的にスライドを生成してコミットします。

### ディレクトリ構成

```
doc/
├── 00_task/           # タスク管理
├── 01_project_rules/  # プロジェクトルール
├── 02_requirements_definition/  # 要件定義（Marp対応）
├── 03_architecture/   # アーキテクチャ
├── 04_uml/           # UML図
├── 05_api_design/    # API設計
├── 06_design_document/  # 設計ドキュメント
├── 07_ui-ux/         # 画面デザイン
├── 08_test_case/     # テストケース
├── 09_issue/         # 課題管理
└── 99_slide_pdf/     # 生成されたスライド（PDF/HTML/PPTX）
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
