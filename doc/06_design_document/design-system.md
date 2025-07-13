# ゆるVibe Pages デザインシステム仕様書

## 概要

ゆるVibe Pagesは感情を詩と画像で表現するAIアプリケーションです。本デザインシステムは、美しく統一感のあるユーザー体験を提供するために、視覚的要素とインタラクションパターンを定義します。

## デザインフィロソフィー

**「心のかけらを美しいかたちに変える」**

- **感情の可視化**: ユーザーの感情を視覚的に美しく表現
- **和の美意識**: 日本的な美しさと現代的なデザインの融合
- **共感の創造**: SNSでシェアしたくなる魅力的な体験

## カラーパレット

### プライマリカラー
```css
/* ピンク系 - メインブランドカラー */
--pink-50: #fdf2f8     /* 背景グラデーション */
--pink-200: #fecaca     /* 装飾要素 */
--pink-300: #fca5a5     /* フォーカス状態 */
--pink-400: #f472b6     /* インタラクティブ要素 */
--pink-500: #ec4899     /* メインCTA */
--pink-600: #db2777     /* ホバー状態 */
--pink-900: #831843     /* ダークアクセント */

/* ローズ系 - サブカラー */
--rose-50: #fff1f2      /* 背景 */
--rose-200: #fecdd3     /* 装飾 */
--rose-500: #f43f5e     /* アクセント */
--rose-600: #e11d48     /* ホバー */
```

### セカンダリカラー
```css
/* パープル系 - アクセント */
--purple-200: #e9d5ff   /* 装飾 */
--purple-500: #a855f7   /* アクセント */
--purple-900: #581c87   /* ダークアクセント */

/* ブルー系 - リンク・SNS */
--blue-400: #60a5fa     /* リンク */
--blue-500: #3b82f6     /* Twitter/X */

/* グレー系 - テキスト・背景 */
--gray-50: #f9fafb      /* 背景 */
--gray-400: #9ca3af     /* セカンダリテキスト */
--gray-600: #4b5563     /* テキスト */
--gray-700: #374151     /* プライマリテキスト */
--gray-800: #1f2937     /* 見出し */
--gray-900: #111827     /* ダーク背景 */
```

### 特殊カラー
```css
/* グラスモーフィズム */
--glass-white-10: rgba(255, 255, 255, 0.1)   /* 背景 */
--glass-white-20: rgba(255, 255, 255, 0.2)   /* 要素 */
--glass-white-30: rgba(255, 255, 255, 0.3)   /* ボーダー */

/* エラー・成功 */
--red-50: #fef2f2       /* エラー背景 */
--red-600: #dc2626      /* エラーテキスト */
--green-900: #14532d    /* 成功背景 */
```

## タイポグラフィ

### フォントファミリー
```css
/* プライマリフォント - Geist Sans */
--font-geist-sans: 'Geist', 'Hiragino Sans', 'ヒラギノ角ゴシック Pro', 'Yu Gothic Medium', '游ゴシック Medium', YuGothic, '游ゴシック体', 'Meiryo', sans-serif;

/* モノスペースフォント - Geist Mono */
--font-geist-mono: 'Geist Mono', 'Menlo', 'Monaco', 'Consolas', monospace;

/* フォールバック */
font-family: Arial, Helvetica, sans-serif;
```

### フォントサイズ階層
```css
/* メインタイトル */
--text-5xl: 3rem        /* 48px - アプリタイトル */
--text-3xl: 1.875rem    /* 30px - ページタイトル */

/* 詩・コンテンツ */
--text-2xl: 1.5rem      /* 24px - 詩テキスト（PC） */
--text-xl: 1.25rem      /* 20px - 詩テキスト（モバイル） */
--text-lg: 1.125rem     /* 18px - サブタイトル */

/* UI要素 */
--text-base: 1rem       /* 16px - 基本テキスト */
--text-sm: 0.875rem     /* 14px - キャプション */
--text-xs: 0.75rem      /* 12px - ヘルプテキスト */
```

### フォントウェイト
```css
--font-bold: 700        /* 見出し */
--font-medium: 500      /* 強調テキスト、ボタン */
--font-normal: 400      /* 基本テキスト */
```

## レイアウト・間隔

### グリッドシステム
```css
/* コンテナ幅 */
--max-width-md: 28rem   /* 448px - フォームコンテナ */
--max-width-2xl: 42rem  /* 672px - 詩表示エリア */

/* パディング・マージン */
--spacing-2: 0.5rem     /* 8px */
--spacing-3: 0.75rem    /* 12px */
--spacing-4: 1rem       /* 16px */
--spacing-6: 1.5rem     /* 24px */
--spacing-8: 2rem       /* 32px */
--spacing-12: 3rem      /* 48px */
```

### レスポンシブブレイクポイント
```css
/* モバイル優先設計 */
/* デフォルト: ~639px */
--breakpoint-sm: 640px  /* タブレット */
--breakpoint-md: 768px  /* 小型デスクトップ */
--breakpoint-lg: 1024px /* デスクトップ */
```

## コンポーネント仕様

### 1. メインページ (/) - ThemeInput

#### 背景
- **グラデーション**: `from-pink-50 via-white to-rose-50`
- **装飾**: 浮遊する円形要素（blur効果付き）
- **アニメーション**: `animate-pulse` で柔らかい点滅

#### 入力フォーム
```css
/* コンテナ */
background: rgba(255, 255, 255, 0.8)
backdrop-filter: blur(8px)
border: 1px solid rgba(255, 255, 255, 0.5)
border-radius: 1rem

/* 入力フィールド */
padding: 1rem
font-size: 1.125rem
border: 1px solid #e5e7eb
border-radius: 0.75rem
focus:ring-3 focus:ring-pink-300 focus:border-pink-400
transition: all 0.2s
```

#### CTAボタン
```css
/* メインボタン */
background: linear-gradient(to right, #ec4899, #f43f5e)
color: white
font-weight: 500
padding: 1rem 1.5rem
border-radius: 0.75rem
transform: scale(1.02) on hover
transition: all 0.2s

/* 無効状態 */
background: linear-gradient(to right, #d1d5db, #9ca3af)
cursor: not-allowed
```

### 2. 詩表示ページ (/view/[id]) - PoemView

#### 背景システム
1. **フォールバック背景**: グラデーション + 装飾円形
2. **AI生成画像**: Firebase Storage経由、16:9比率
3. **オーバーレイ**: `bg-black bg-opacity-40`

#### 詩表示エリア - グラスモーフィズム
```css
/* メインコンテナ */
background: rgba(255, 255, 255, 0.1)
backdrop-filter: blur(24px)
border: 1px solid rgba(255, 255, 255, 0.2)
border-radius: 1.5rem
padding: 2rem
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

/* 内側グロー効果 */
background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent)

/* 装飾的光の効果 */
position: absolute
background: rgba(255, 255, 255, 0.1)
border-radius: 50%
filter: blur(24px)
```

#### アクションボタン
```css
/* Twitter/X共有 */
background: rgba(59, 130, 246, 0.2)
backdrop-filter: blur(8px)
border: 1px solid rgba(96, 165, 250, 0.3)
hover:background: rgba(59, 130, 246, 0.3)

/* 新規作成 */
background: rgba(236, 72, 153, 0.2)
backdrop-filter: blur(8px)
border: 1px solid rgba(244, 114, 182, 0.3)
hover:background: rgba(236, 72, 153, 0.3)

/* 共通スタイル */
color: white
padding: 1rem 2rem
border-radius: 9999px
font-weight: 500
transform: scale(1.05) on hover
box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1)
```

### 3. アニメーションコンポーネント

#### FloatingParticles
```css
/* キャンバス設定 */
position: fixed
inset: 0
pointer-events: none
background: transparent
z-index: 5

/* パーティクル色 */
gradient-start: rgba(255, 192, 203, 0.9)  /* ピンク */
gradient-mid: rgba(255, 182, 193, 0.6)   /* ライトピンク */
gradient-end: rgba(255, 255, 255, 0.3)   /* 白 */
```

#### BackgroundImage
```css
/* 読み込み状態 */
background: rgba(0, 0, 0, 0.5)
backdrop-filter: blur(4px)

/* エラー表示 */
background: rgba(153, 27, 27, 0.7)  /* red-900/70 */
color: white
padding: 0.75rem
border-radius: 0.25rem

/* 成功時パフォーマンス表示 */
background: rgba(20, 83, 45, 0.7)   /* green-900/70 */
```

## アニメーション仕様

### トランジション
```css
/* 基本トランジション */
transition: all 0.2s ease-in-out

/* ホバー効果 */
transition: transform 0.2s, box-shadow 0.2s
transform: scale(1.02) | scale(1.05)

/* ローディング */
animation: spin 1s linear infinite  /* スピナー */
animation: pulse 2s infinite        /* 柔らかい点滅 */
```

### キーフレーム
```css
/* パーティクルアニメーション */
animation-delay: 2s | 4s  /* 時間差アニメーション */

/* フェードイン */
transition: opacity 1s ease-in-out
```

## アクセシビリティ

### コントラスト比
- **白背景上の文字**: 4.5:1以上
- **カラー背景上の文字**: 3:1以上
- **ボタン**: 3:1以上

### フォーカス状態
```css
focus:outline-none
focus:ring-3 focus:ring-pink-300
focus:border-pink-400
```

### セマンティック構造
- `<h1>` - アプリタイトル
- `<label>` - フォームラベル
- `<button>` - インタラクティブ要素
- `alt` 属性 - 画像代替テキスト

## レスポンシブデザイン

### モバイル（~639px）
- フォントサイズ: `text-xl` (20px) - 詩テキスト
- パディング: `p-4` (16px)
- ボタン: フルWidth

### タブレット（640px~）
- フォントサイズ: `text-2xl` (24px) - 詩テキスト
- パディング: `p-8` (32px)
- ボタン: 横並び

### デスクトップ（768px~）
- 最大幅制限: `max-w-md` | `max-w-2xl`
- ホバー効果: 有効
- アニメーション: フル機能

## 実装パターン

### グラスモーフィズム実装
```css
.glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

### グラデーション背景
```css
.gradient-bg {
  background: linear-gradient(135deg, #fdf2f8 0%, #ffffff 50%, #fff1f2 100%);
}
```

### インタラクティブボタン
```css
.interactive-btn {
  transition: all 0.2s ease-in-out;
  transform: scale(1);
}

.interactive-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.interactive-btn:disabled {
  transform: scale(1);
  cursor: not-allowed;
  opacity: 0.6;
}
```

## 品質保証

### ブラウザサポート
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### パフォーマンス目標
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

### テスト項目
- [ ] 各コンポーネントの表示確認
- [ ] レスポンシブデザインの動作
- [ ] アニメーションのパフォーマンス
- [ ] アクセシビリティチェック
- [ ] カラーコントラスト検証

---

**更新履歴**
- 2025-07-13: 初版作成
- コードベース分析に基づく実装済み仕様の文書化