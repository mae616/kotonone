# Firebase Storage 設定手順

## 🔧 必要な設定

### 1. Firebase Console でのStorage設定

1. **Firebase Console** (https://console.firebase.google.com/) にアクセス
2. **プロジェクト選択** → kotonone
3. **左サイドバー** → **Storage**
4. **ルール** タブをクリック

### 2. セキュリティルールの設定

以下のルールに変更してください：

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // 読み取りは全て許可、書き込みも全て許可（開発用）
      allow read, write: if true;
    }
  }
}
```

### 3. CORS設定（必要に応じて）

Firebase StorageはデフォルトでWebアプリからのアクセスをサポートしていますが、
問題がある場合は以下を実行：

```bash
# Google Cloud SDK が必要
gsutil cors set cors.json gs://kotonone-52150.appspot.com
```

cors.json:
```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

## 🧪 テスト方法

1. http://localhost:3000/debug にアクセス
2. 生成済みの詩ID を入力してテスト実行
3. 画像URLが正常に表示されるか確認

## 🔍 トラブルシューティング

### 問題: 画像が表示されない
- Firebase Storage ルールを確認
- 画像URLが正しいか確認
- Console でエラーログを確認

### 問題: CORS エラー
- Firebase Storage CORS設定確認
- ブラウザの開発者ツールでネットワークタブ確認

### 問題: 権限エラー
- Storage ルールで read: if true が設定されているか確認
- プロジェクト設定が正しいか確認
