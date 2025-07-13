'use client';

import { useState, useEffect } from 'react';
import BackgroundImage from '@/components/BackgroundImage.js';
import FloatingParticles from '@/components/FloatingParticles.js';

export default function TestSDKPage() {
  const [currentTestId, setCurrentTestId] = useState('1752308749714');
  
  // Firebase Consoleで確認した実際に存在する画像ID
  const existingImageIds = [
    '1752308749714',
    '1752304956761', 
    '1752305274447',
    '1752305538646',
    '1752306589525',
    '1752307999097',
    '1752308481839',
    '1752308749714'
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 浮遊パーティクルアニメーション */}
      <FloatingParticles />
      
      {/* 背景画像 - Firebase SDK方式でテスト */}
      <BackgroundImage 
        imageUrl={null} // URLは意図的にnullにしてSDK方式を強制
        poemId={currentTestId}
      />
      
      {/* コンテンツ */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          {/* テストタイトル */}
          <div className="mb-8">
            <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg">
              🔥 Firebase SDK getBlob() テスト
            </span>
          </div>
          
          {/* 詩コンテンツ - グラスモーフィズムデザイン */}
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl">
            {/* 内側のグロー効果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
            
            {/* テスト情報 */}
            <div className="relative text-white text-xl md:text-2xl leading-relaxed font-medium text-center">
              <div className="mb-4">Firebase SDK CORS回避テスト</div>
              <div className="text-lg">テスト画像ID: {currentTestId}</div>
              <div className="text-sm opacity-75 mt-2">
                ブラウザコンソールでgetBlob()ログを確認
              </div>
            </div>
            
            {/* 装飾的な光の効果 */}
            <div className="absolute -top-1 -left-1 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-pink-300/20 rounded-full blur-lg"></div>
          </div>
          
          {/* 画像ID切り替えボタン */}
          <div className="mb-8">
            <div className="text-white text-sm mb-4 opacity-75">
              存在する画像IDでテスト:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {existingImageIds.map((imageId) => (
                <button
                  key={imageId}
                  onClick={() => setCurrentTestId(imageId)}
                  className={`px-3 py-2 rounded text-xs font-mono transition-all ${
                    currentTestId === imageId
                      ? 'bg-blue-500/40 border border-blue-400/50 text-white'
                      : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {imageId.substring(0, 8)}...
                </button>
              ))}
            </div>
          </div>
          
          {/* アクションボタン - グラスモーフィズム */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-green-500/20 backdrop-blur-md border border-green-400/30 hover:bg-green-500/30 text-white px-8 py-4 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <span className="mr-2">🔄</span>
              リロードしてテスト
            </button>
            
            <a
              href="/debug"
              className="bg-purple-500/20 backdrop-blur-md border border-purple-400/30 hover:bg-purple-500/30 text-white px-8 py-4 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <span className="mr-2">🔍</span>
              詳細デバッグ
            </a>
            
            <a
              href="/"
              className="bg-pink-500/20 backdrop-blur-md border border-pink-400/30 hover:bg-pink-500/30 text-white px-8 py-4 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <span className="mr-2">✨</span>
              ホームに戻る
            </a>
          </div>
          
          {/* 期待される結果 */}
          <div className="mt-8 text-white/70 text-sm">
            <div className="font-medium mb-2">期待される結果:</div>
            <div className="text-left space-y-1">
              <div>• コンソールに「🔥 Firebase SDK getBlob() 方式で画像読み込み開始」</div>
              <div>• 「✅ getBlob() 成功」または適切なフォールバック</div>
              <div>• 左下に緑色のパフォーマンス情報</div>
              <div>• 背景画像の正常表示</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}