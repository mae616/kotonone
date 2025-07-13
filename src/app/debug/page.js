'use client';

import { useState } from 'react';
import { ref, getDownloadURL, listAll, getBlob } from 'firebase/storage';
import { storage } from '@/lib/firebase.js';
import { getPoemFromFirestore } from '@/lib/firestore.js';

export default function DebugPage() {
  const [poemId, setPoemId] = useState('');
  const [poemData, setPoemData] = useState(null);
  const [imageStatus, setImageStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [storageResults, setStorageResults] = useState([]);
  const [storageLoading, setStorageLoading] = useState(false);

  const testFirestoreLoad = async () => {
    if (!poemId.trim()) {
      alert('詩IDを入力してください');
      return;
    }

    setLoading(true);
    setImageStatus('');
    
    try {
      console.log('🔍 Firestore詩データ取得開始:', poemId);
      const data = await getPoemFromFirestore(poemId.trim());
      
      if (data) {
        setPoemData(data);
        console.log('✅ Firestore詩データ取得成功:', data);
        
        if (data.imageUrl) {
          testImageLoad(data.imageUrl);
        }
      } else {
        setImageStatus('詩が見つかりませんでした');
      }
    } catch (error) {
      console.error('❌ Firestore取得エラー:', error);
      setImageStatus('Firestore取得エラー: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testImageLoad = (imageUrl) => {
    setImageStatus('画像読み込みテスト中...');
    console.log('🖼️ 画像読み込みテスト開始:', imageUrl);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('✅ 画像読み込み成功:', imageUrl);
      setImageStatus('✅ 画像読み込み成功');
    };
    
    img.onerror = (error) => {
      console.error('❌ 画像読み込みエラー:', error);
      setImageStatus('❌ 画像読み込みエラー - CORS或はアクセス権限問題の可能性');
    };
    
    img.src = imageUrl;
  };

  const testDirectImageUrl = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  const debugStorageAccess = async () => {
    setStorageLoading(true);
    setStorageResults([]);
    
    const debugResults = [];
    
    try {
      // 1. Storage bucket 情報確認
      debugResults.push({
        type: 'info',
        message: `Firebase Storage Bucket: ${storage.app.options.storageBucket}`,
        details: `アプリID: ${storage.app.options.appId}`
      });
      
      // 1.5. Firebase SDK getBlob() 機能テスト
      try {
        debugResults.push({
          type: 'info',
          message: '🔥 Firebase SDK getBlob() 機能テスト開始...'
        });
        
        // 実際に存在するファイルでテスト（Firebase Consoleで確認済み）
        const testImageIds = ['1752308749714', '1752304956761', '1752305274447'];
        
        for (const testId of testImageIds) {
          try {
            const fileName = `images/${testId}.png`;
            const testRef = ref(storage, fileName);
            
            // getBlob() テスト
            const blob = await getBlob(testRef);
            debugResults.push({
              type: 'success',
              message: `✅ getBlob() 成功: ${testId}`,
              details: `サイズ: ${blob.size} bytes, タイプ: ${blob.type}`
            });
            
            // Object URL 作成テスト
            const objectUrl = URL.createObjectURL(blob);
            debugResults.push({
              type: 'success',
              message: `✅ Object URL 作成成功: ${testId}`,
              url: objectUrl
            });
            
            // Object URL クリーンアップ（5秒後）
            setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
            
          } catch (blobError) {
            debugResults.push({
              type: 'error',
              message: `❌ getBlob() 失敗: ${testId}`,
              details: blobError.message
            });
          }
        }
        
      } catch (sdkError) {
        debugResults.push({
          type: 'error',
          message: `Firebase SDK テストエラー: ${sdkError.message}`
        });
      }

      // 2. images/ ディレクトリの一覧を取得
      try {
        const imagesRef = ref(storage, 'images/');
        const listResult = await listAll(imagesRef);
        debugResults.push({
          type: 'success',
          message: `Images directory access: OK (${listResult.items.length} items found)`
        });
        
        // 最新の3つのファイルをテスト
        const testFiles = listResult.items.slice(-3);
        for (const fileRef of testFiles) {
          try {
            const downloadURL = await getDownloadURL(fileRef);
            debugResults.push({
              type: 'success',
              message: `File access OK: ${fileRef.name}`,
              url: downloadURL
            });
            
            // 実際に画像をfetchしてみる（CORS テスト）
            try {
              const response = await fetch(downloadURL, { 
                method: 'HEAD',
                mode: 'cors'
              });
              debugResults.push({
                type: response.ok ? 'success' : 'error',
                message: `HTTP HEAD request: ${response.status} ${response.statusText}`,
                details: `Content-Type: ${response.headers.get('content-type')}, CORS: ${response.headers.get('access-control-allow-origin') || 'not set'}`
              });
            } catch (fetchError) {
              debugResults.push({
                type: 'error',
                message: `CORS fetch test failed: ${fetchError.message}`,
                details: 'CORS制限またはネットワークエラーの可能性'
              });
            }
            
            // Image オブジェクトでの読み込みテスト
            try {
              await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = downloadURL;
                
                setTimeout(() => reject(new Error('Timeout')), 5000);
              });
              debugResults.push({
                type: 'success',
                message: `Image object load: SUCCESS for ${fileRef.name}`
              });
            } catch (imgError) {
              debugResults.push({
                type: 'error',
                message: `Image object load: FAILED for ${fileRef.name}`,
                details: imgError.message
              });
            }
            
          } catch (urlError) {
            debugResults.push({
              type: 'error',
              message: `Download URL failed for ${fileRef.name}: ${urlError.message}`
            });
          }
        }
        
      } catch (listError) {
        debugResults.push({
          type: 'error',
          message: `Images directory access failed: ${listError.message}`,
          details: 'Firebase Storage権限またはセキュリティルールの問題'
        });
      }
      
      // 3. セキュリティルール情報表示
      debugResults.push({
        type: 'info',
        message: 'Firebase Storage セキュリティルール確認が必要',
        details: 'Firebase Console > Storage > Rules で "allow read: if true;" が設定されているか確認してください'
      });
      
    } catch (error) {
      debugResults.push({
        type: 'error',
        message: `Debug test failed: ${error.message}`
      });
    }
    
    setStorageResults(debugResults);
    setStorageLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          🔧 Firebase Storage デバッグページ
        </h1>

        {/* Firebase Storage システム調査 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔍 Firebase Storage システム調査</h2>
          <p className="text-gray-600 mb-4">
            Firebase Storage の権限設定とアクセス状況を詳細に調査します
          </p>
          
          <button
            onClick={debugStorageAccess}
            disabled={storageLoading}
            className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 disabled:bg-gray-300 mb-4"
          >
            {storageLoading ? 'Storage調査中...' : 'Storage調査開始'}
          </button>

          {storageResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">調査結果:</h3>
              {storageResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md ${
                    result.type === 'success' ? 'bg-green-50 border border-green-200' :
                    result.type === 'error' ? 'bg-red-50 border border-red-200' :
                    result.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className={`font-medium ${
                    result.type === 'success' ? 'text-green-800' :
                    result.type === 'error' ? 'text-red-800' :
                    result.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {result.type === 'success' ? '✅' :
                     result.type === 'error' ? '❌' :
                     result.type === 'warning' ? '⚠️' : 'ℹ️'} {result.message}
                  </div>
                  
                  {result.details && (
                    <div className="mt-2 text-sm text-gray-600">
                      {result.details}
                    </div>
                  )}
                  
                  {result.url && (
                    <div className="mt-2 text-sm">
                      <strong>URL:</strong> 
                      <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {result.url}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">詩データ取得テスト</h2>
          
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={poemId}
              onChange={(e) => setPoemId(e.target.value)}
              placeholder="詩ID (例: koYZvp3rup_2QuyzOw2PA)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={testFirestoreLoad}
              disabled={loading || !poemId.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              {loading ? '取得中...' : 'テスト実行'}
            </button>
          </div>

          {imageStatus && (
            <div className={`p-3 rounded-md mb-4 ${
              imageStatus.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {imageStatus}
            </div>
          )}
        </div>

        {poemData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">取得結果</h2>
            
            <div className="space-y-4">
              <div>
                <label className="font-medium">ID:</label>
                <p className="text-sm text-gray-600 font-mono">{poemData.id}</p>
              </div>
              
              <div>
                <label className="font-medium">テーマ:</label>
                <p className="text-gray-800">{poemData.theme}</p>
              </div>
              
              <div>
                <label className="font-medium">詩:</label>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="whitespace-pre-line">{poemData.phrase}</p>
                </div>
              </div>
              
              {poemData.imageUrl && (
                <div>
                  <label className="font-medium">画像URL:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-blue-600 break-all flex-1">{poemData.imageUrl}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => testDirectImageUrl(poemData.imageUrl)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        直接開く
                      </button>
                      <button
                        onClick={() => testImageLoad(poemData.imageUrl)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        再テスト
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label className="font-medium">画像プロンプト:</label>
                <p className="text-sm text-gray-600">{poemData.imagePrompt}</p>
              </div>
              
              {poemData.createdAt && (
                <div>
                  <label className="font-medium">作成日時:</label>
                  <p className="text-sm text-gray-600">
                    {new Date(poemData.createdAt).toLocaleString('ja-JP')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {poemData?.imageUrl && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">画像表示テスト</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">方法1: img タグ</h3>
                <img 
                  src={poemData.imageUrl} 
                  alt="テスト画像"
                  className="max-w-md rounded-md border"
                  onLoad={() => console.log('✅ img タグ読み込み成功')}
                  onError={() => console.error('❌ img タグ読み込み失敗')}
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-2">方法2: CSS background-image</h3>
                <div 
                  className="w-80 h-48 rounded-md border bg-cover bg-center"
                  style={{ backgroundImage: `url(${poemData.imageUrl})` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <a
            href="/"
            className="text-blue-500 hover:text-blue-600"
          >
            ← メインページに戻る
          </a>
        </div>
      </div>
    </div>
  );
}