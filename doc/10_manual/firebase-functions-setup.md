# 🔥 Firebase Functions 設定手順書

## 📋 概要

このドキュメントは、**ゆるVibe Pages** でFirebase Functions統合を設定するための完全な手順書です。

### 🎯 なぜFirebase Functions が必要なのか？

#### 1. CORS問題の解決
- **問題**: ブラウザから直接Firestoreにアクセスする際のCORS制限
- **現象**: `Access to fetch at 'https://firestore.googleapis.com/...' from origin 'http://localhost:3000' has been blocked by CORS policy`
- **解決**: Firebase Functions経由でのアクセスによりCORS制限を回避

#### 2. セキュリティ強化
- **問題**: クライアントサイドでのFirestoreアクセスはセキュリティリスク
- **現象**: 機密情報の漏洩、不正なデータ操作の可能性
- **解決**: Admin SDK使用による安全なサーバーサイド操作

#### 3. パフォーマンス向上
- **問題**: クライアントサイドからの複数API呼び出しでの遅延
- **現象**: 複数のFirestore操作による応答時間の増加
- **解決**: 東京リージョンでの一括処理による低レイテンシ

### ⚠️ 設定しないとどうなるか？

1. **アプリケーションが動作しない** 🚨
   - 詩の保存・取得機能が完全に停止
   - ユーザーに「エラーが発生しました」画面のみ表示

2. **開発効率の低下** 📉
   - CORSエラーによるローカル開発の困難
   - デバッグとテストの複雑化

3. **セキュリティリスク** 🔓
   - 直接Firestore操作による脆弱性
   - 不正なデータアクセスの可能性

## 🚀 設定手順

### ステップ1: Firebase CLI インストール

#### 1-1. Node.js バージョン確認
```bash
node --version
# v18.0.0 以上である必要があります
```

#### 1-2. Firebase CLI グローバルインストール
```bash
npm install -g firebase-tools
```

#### 1-3. インストール確認
```bash
firebase --version
# 13.0.0 以上であることを確認
```

**🎉 完了！** Firebase CLIの準備が整いました。

---

### ステップ2: Firebase プロジェクト作成

#### 2-1. Firebase Console にアクセス
1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを作成」をクリック

#### 2-2. プロジェクト設定
1. **プロジェクト名**: `kotonone-app` (または任意の名前)
2. **Google Analytics**: 「続行」をクリック
3. **Analytics アカウント**: デフォルトのまま「プロジェクトを作成」

#### 2-3. プロジェクトID 確認
- プロジェクト設定画面で **プロジェクトID** をメモしてください
- 例: `kotonone-app-f1a2b3c4`

**🎉 完了！** Firebaseプロジェクトが作成されました。

---

### ステップ3: Firebase ログインと認証

#### 3-1. Firebase ログイン
```bash
firebase login
```

#### 3-2. ブラウザでの認証
1. 自動的にブラウザが開きます
2. Googleアカウントでログイン
3. Firebase CLI のアクセス許可

#### 3-3. ログイン確認
```bash
firebase projects:list
```

**🎉 完了！** Firebase認証が完了しました。

---

### ステップ4: プロジェクト設定ファイル更新

#### 4-1. `.firebaserc` 更新
```bash
# プロジェクトのルートディレクトリで実行
cd /path/to/kotonone
```

`.firebaserc` ファイルを開き、`YOUR_PROJECT_ID` を実際のプロジェクトIDに変更：

```json
{
  \"projects\": {
    \"default\": \"kotonone-app-f1a2b3c4\"
  }
}
```

#### 4-2. Firebase 設定確認
```bash
firebase use --add
```

プロジェクトを選択し、alias を「default」に設定

**🎉 完了！** プロジェクト設定が完了しました。

---

### ステップ5: Firestore 設定

#### 5-1. Firestore データベース作成
1. Firebase Console の「Firestore Database」にアクセス
2. 「データベースの作成」をクリック
3. **セキュリティルール**: 「テストモードで開始」を選択
4. **ロケーション**: 「asia-northeast1 (東京)」を選択

#### 5-2. セキュリティルール デプロイ
```bash
npm run firebase:deploy:rules
```

#### 5-3. インデックス デプロイ
```bash
npm run firebase:deploy:indexes
```

**🎉 完了！** Firestore設定が完了しました。

---

### ステップ6: Firebase Functions デプロイ

#### 6-1. Functions 依存関係インストール
```bash
npm run functions:install
```

#### 6-2. Functions デプロイ
```bash
npm run functions:deploy
```

**期待される出力:**
```
✔ functions[asia-northeast1-savePoem]: Successful create operation.
✔ functions[asia-northeast1-getPoem]: Successful create operation. 
✔ functions[asia-northeast1-healthCheck]: Successful create operation.
```

#### 6-3. Functions URL 確認
デプロイ完了後、Functions URL が表示されます：
```
https://asia-northeast1-kotonone-app-f1a2b3c4.cloudfunctions.net
```

**🎉 完了！** Firebase Functions デプロイが完了しました。

---

### ステップ7: 環境変数設定

#### 7-1. `.env.local` ファイル作成
プロジェクトルートに `.env.local` ファイルを作成：

```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kotonone-app-f1a2b3c4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kotonone-app-f1a2b3c4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kotonone-app-f1a2b3c4.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FUNCTIONS_URL=https://asia-northeast1-kotonone-app-f1a2b3c4.cloudfunctions.net
```

#### 7-2. Firebase 設定値の取得
Firebase Console の「プロジェクトの設定」→「全般」→「ウェブアプリ」で確認

**🎉 完了！** 環境変数設定が完了しました。

---

### ステップ8: 動作確認

#### 8-1. ヘルスチェック
```bash
npm run firebase:health
```

**期待される出力:**
```json
{
  \"success\": true,
  \"message\": \"ゆるVibe Pages Functions are running!\",
  \"timestamp\": \"2025-01-14T10:30:00.000Z\",
  \"version\": \"1.0.0\"
}
```

#### 8-2. 開発サーバー起動
```bash
npm run dev
```

#### 8-3. 機能テスト
1. http://localhost:3000 にアクセス
2. テーマを入力（例: \"ざわざわした気分\"）
3. 詩が正常に生成・保存されることを確認

**🎉 完了！** 全ての設定が正常に動作しています。

---

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. CORS エラー
**症状**: `Access to fetch ... has been blocked by CORS policy`

**原因**: Functions の CORS 設定が正しくない

**解決方法**:
1. `functions/index.js` の CORS 設定を確認
2. 許可されたオリジンにローカルホストが含まれているか確認
3. Functions 再デプロイ: `npm run functions:deploy`

#### 2. Functions デプロイ失敗
**症状**: `Error: Failed to configure trigger for function`

**原因**: 権限不足またはプロジェクト設定の問題

**解決方法**:
1. Firebase ログイン確認: `firebase login`
2. プロジェクト設定確認: `firebase use --add`
3. 権限確認: Firebase Console でプロジェクトオーナー権限を確認

#### 3. 環境変数エラー
**症状**: `NEXT_PUBLIC_FUNCTIONS_URL is not defined`

**原因**: 環境変数の設定漏れ

**解決方法**:
1. `.env.local` ファイルの存在確認
2. すべての環境変数が正しく設定されているか確認
3. 開発サーバー再起動: `npm run dev`

#### 4. Firestore 権限エラー
**症状**: `Missing or insufficient permissions`

**原因**: Firestore セキュリティルールの問題

**解決方法**:
1. セキュリティルールの再デプロイ: `npm run firebase:deploy:rules`
2. Firebase Console でルールの確認
3. Functions が Admin SDK を使用していることを確認

### 🆘 サポートが必要な場合

問題が解決しない場合は、以下の情報とともにお問い合わせください：

1. **実行したコマンド**
2. **エラーメッセージ全文**
3. **環境情報** (OS, Node.js バージョン等)
4. **Firebase プロジェクトID**

---

## 🎯 設定完了後の効果

### 1. セキュリティ強化
- ✅ Admin SDK による安全なFirestore操作
- ✅ CORS制限による不正アクセス防止
- ✅ サーバーサイドでの一元的なデータ管理

### 2. パフォーマンス向上
- ✅ 東京リージョンでの低レイテンシ
- ✅ 効率的なデータ処理
- ✅ 構造化されたエラーハンドリング

### 3. 開発効率向上
- ✅ CORS エラーの完全解決
- ✅ 統一されたAPI インターフェース
- ✅ 包括的なログ出力

### 4. 運用安定性
- ✅ 自動スケーリング
- ✅ 監視とアラート
- ✅ 災害復旧機能

---

## 📚 参考資料

- [Firebase Functions ドキュメント](https://firebase.google.com/docs/functions)
- [Firebase CLI リファレンス](https://firebase.google.com/docs/cli)
- [Firestore セキュリティルール](https://firebase.google.com/docs/firestore/security/get-started)
- [プロジェクト Issue 管理](../09_issue/firebase-functions-cors-integration.md)

---

**🎉 お疲れ様でした！**

Firebase Functions 統合の設定が完了しました。これで、安全で高パフォーマンスな詩生成アプリケーションを楽しむことができます。

何かご質問があれば、いつでもお気軽にお声がけください！ にゃ 🐱✨