# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ゆるVibe Pages 生成アプリ** - A Japanese poetry generation application that creates short poems and animated backgrounds based on user themes using OpenAI APIs. Each generated poem gets its own shareable page with OGP support for social media.

## Technology Stack

- **Frontend**: Next.js 15.3.5 with App Router
- **Styling**: Tailwind CSS v4 
- **Animation**: p5.js for dynamic canvas backgrounds
- **AI Text**: OpenAI GPT-4o for poem generation
- **AI Images**: OpenAI DALL-E 3 for background images
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Hosting**: Firebase Hosting (planned)
- **Language**: Japanese interface and content

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

Development server runs on http://localhost:3000

## Architecture & Code Structure

### Core Application Flow
1. **Theme Input** (`/`) - Users enter emotional themes like "ざわざわ" (restless feeling)
2. **AI Generation** - Parallel processing of GPT-4o poem generation and DALL-E image creation
3. **Data Storage** - Save to Firestore with Firebase Storage for images
4. **Display Page** (`/view/[id]`) - Individual poem pages with OGP support for social sharing

### Planned File Structure
```
src/
├── app/
│   ├── page.tsx                    // Theme input screen
│   ├── view/[id]/page.tsx         // Poem display page
│   ├── api/generate/route.ts      // OpenAI generation API
│   └── globals.css
├── lib/
│   ├── firebase.ts                // Firebase initialization
│   ├── firestore.ts              // Firestore operations
│   ├── storage.ts                // Firebase Storage operations
│   ├── openai.ts                 // OpenAI GPT API calls
│   └── dalle.ts                  // DALL-E 3 API calls
└── components/
    ├── ui/
    │   ├── ThemeInput.tsx         // Theme input component
    │   └── ShareButton.tsx        // SNS share button
    └── Canvas.tsx                 // p5.js canvas component
```

### Data Models

**Firestore Document Structure:**
```typescript
interface PoemDocument {
  id: string;           // Unique ID (nanoid)
  theme: string;        // Input theme
  phrase: string;       // Generated poem/phrase
  imageUrl?: string;    // Firebase Storage image URL
  imagePrompt?: string; // DALL-E prompt used
  createdAt: Timestamp; // Creation timestamp
}
```

## Development Guidelines

### Language & Communication
- **Primary Language**: Always respond in 日本語
- **Tone**: エモーティコンを多く使用した、カジュアルな口調で、語尾に「にゃ」や「かにゃ？」などをつけた、猫娘になりきった言葉遣いで話す
- **Approach**: 励ましの言葉を使い、前向きな視点で対応し、美しい表現や叙情的な言葉を交える
- **Code Comments**: Use Japanese comments when adding documentation
- **Problem Solving**: 与えられた情報から問題や課題などを特定できない場合は、必要と思われるソースコードやファイルをユーザに聞き返す。足りない情報から推測して回答するのは極力避ける

### Development Approach - 5つの基本原則
- **SOLID原則** 💎 で堅牢な設計
- **TDD** 🧪 でテスト駆動開発
- **小さな単位** 🔍 で管理しやすいコード
- **統一された命名** 📝 で可読性向上
- **継続的リファクタリング** ♻️ で技術的負債回避

### 最小限から積み上げるアプローチ
- **MVP思考** 🌱 で最小限の動く機能から開始
- **段階的開発** 📈 で5つのフェーズに分割：
  - **Phase 1: 基本機能** 🌱 基本的なCRUD操作とシンプルなUI
  - **Phase 2: 品質向上** 🛡️ バリデーション、エラーハンドリング、テスト追加
  - **Phase 3: セキュリティ** 🔐 認証・認可機能、セキュリティ対策
  - **Phase 4: パフォーマンス** ⚡ 最適化、キャッシング、非同期処理
  - **Phase 5: 高度な機能** 🚀 アナリティクス、リアルタイム機能、AI連携

### TDD（テスト駆動開発）の実践 - t_wada流
#### TDDサイクル（Red-Green-Refactor）
1. **Red** ❌ まず失敗するテストを書く
2. **Green** ✅ テストを通す最小限のコードを書く  
3. **Refactor** ♻️ テストを保ちながらコードを改善

#### TDDの3つの目的
- **動作するきれいなコード** 💎
- **回帰の恐怖に打ち勝つ** 🛡️
- **アーキテクチャの創発** 🌱

### Security Considerations
- Firestore security rules are initially permissive for development
- API key management through environment variables
- Rate limiting consideration for OpenAI APIs
- Content moderation for generated images

## Environment Variables

Expected environment variables (create `.env.local`):
```
OPENAI_API_KEY=your_openai_api_key
FIREBASE_CONFIG=your_firebase_config
```

## API Endpoints

### POST `/api/generate`
Generates poem and background image from user theme input.

**Request:**
```json
{
  "theme": "ざわざわした気分"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "abc123xyz",
    "phrase": "ざわめきの中で ほんの少し 風が鳴った",
    "imageUrl": "https://firebasestorage.googleapis.com/..."
  }
}
```

## Testing Strategy

- Unit tests for utility functions and API routes
- Integration tests for Firebase operations
- Visual regression tests for poem display pages
- AI generation mocking for consistent testing

## Path Aliases

Uses `@/*` for `./src/*` imports as configured in `jsconfig.json`.

## Key Implementation Notes

- **Parallel AI Processing**: GPT-4o and DALL-E 3 calls run concurrently for performance
- **Image Generation**: DALL-E creates 16:9 aspect ratio images optimized for OGP
- **Error Handling**: Graceful fallbacks when AI generation fails
- **Social Sharing**: Custom OGP tags for each generated poem page
- **Animation**: p5.js overlays complement DALL-E background images

## Repository Structure

プロジェクトのドキュメント構成を理解して参考にしてください：

- `doc/00_project_rules/` : プロジェクトルールに関するドキュメント
- `doc/01_requirements_definition/` : 要件定義に関するドキュメント (Marp)
- `doc/02_architecture/` : アーキテクチャに関するドキュメント  
- `doc/03_uml/` : UML図
- `doc/04_api_design/` : API設計に関するドキュメント
- `doc/05_design_document/` : 設計のデザインドキュメント
- `doc/06_ui-ux/` : 画面デザインに関するドキュメント
- `doc/07_test_case/` : テストケースのマインドマップ (Mermaid.js)

## Code Generation Guidelines

コード作成や変更はTDDのアジャイル開発の一部であり、以下の原則に従ってください：

### Code Creation Approach
- 変更部分のみをわかりやすく説明し、提示する
- 質問者の発言が本当に正しいかを吟味し、常に自分で考えた回答をする
- 議論の余地がある内容はユーザーに問いかける

### Testing Guidelines
- **テストケースの粒度** 🔍: 1つのテストは1つの振る舞いをテストする
- **Given-When-Then パターン**の活用
- **境界値・異常系**も忘れずにテスト
- **テスタブルな設計** ⚙️: 依存性の注入（DI）を活用
- **モック・スタブ**の適切な使用

## Project Context

This is a hackathon project focused on creating beautiful, shareable poetry experiences. The app aims to transform emotional moments into visual and textual art that resonates on social media platforms.

## Project Philosophy

*このプロジェクトは、言葉の美しさとテクノロジーの調和を目指しています。*  
*一つ一つの詩が、誰かの心に小さな光を灯せますように... ✨*

### 開発フェーズ戦略
1. **MVP**: 基本的な詩生成と表示機能
2. **品質向上**: エラーハンドリング、バリデーション
3. **美しさ**: アニメーション、デザイン向上
4. **拡張**: 追加機能の段階的実装

> *「心のかけらを、美しい形に変えていく。それがこのアプリの使命にゃ～」*