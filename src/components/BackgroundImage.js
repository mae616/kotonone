'use client';

import { useState, useEffect } from 'react';

export default function BackgroundImage({ imageUrl, theme }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      if (!imageUrl) {
          console.log("⚠️ 背景画像URL未設定");
          setIsLoading(false);
          return;
      }

      console.log("🖼️ Firebase Storage画像読み込み開始:", imageUrl);
      setIsLoading(true);
      setLoaded(false);
      setError(false);

      // Firebase Storage画像専用の読み込み方法
      const img = new Image();
      
      // Firebase Storage画像はcrossOriginを設定しない（調査結果より）
      // CORSはfetchで失敗するが、Image オブジェクトでは成功している
      
      img.onload = () => {
          console.log("✅ Firebase Storage画像読み込み成功:", imageUrl);
          setLoaded(true);
          setError(false);
          setIsLoading(false);
      };

      img.onerror = (event) => {
          console.error("❌ Firebase Storage画像読み込み失敗:", imageUrl, event);
          setError(true);
          setLoaded(false);
          setIsLoading(false);
      };

      // Firebase Storage URLを直接設定
      img.src = imageUrl;

      // タイムアウト設定（15秒に延長）
      const timeout = setTimeout(() => {
          if (!loaded && !error) {
              console.warn("⏰ Firebase Storage画像読み込みタイムアウト:", imageUrl);
              setError(true);
              setIsLoading(false);
          }
      }, 15000);

      return () => {
          clearTimeout(timeout);
          // メモリリーク防止
          img.onload = null;
          img.onerror = null;
      };
  }, [imageUrl]);

  // フォールバック背景（確実に表示される）
  const FallbackBackground = ({ showDebug = false }) => (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-purple-900/30 to-blue-900/30"></div>
          <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-1000"></div>
          </div>
          {showDebug && (
              <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-xs">
                  フォールバック背景表示中
              </div>
          )}
      </div>
  );

  return (
      <>
          {/* 常に表示されるフォールバック背景（緊急対応） */}
          <FallbackBackground showDebug={!loaded && !error} />

          {/* 成功時の背景画像（フォールバックの上に重ねる） */}
          {loaded && (
              <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 opacity-100 z-1"
                  style={{ backgroundImage: `url(${imageUrl})` }}
              >
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
          )}

          {/* エラー時の表示 */}
          {error && (
              <div className="absolute top-4 left-4 bg-red-900/70 text-white p-3 rounded text-sm z-10 max-w-md">
                  <div className="font-bold">🚨 Firebase Storage画像エラー</div>
                  <div className="text-xs mt-1">
                      Status: {imageUrl ? "URL取得済み" : "URL未設定"}
                  </div>
                  <div className="text-xs">
                      Type: {imageUrl?.includes('firebasestorage.googleapis.com') ? 'Firebase Storage' : 'External URL'}
                  </div>
                  {imageUrl && (
                      <div className="text-xs mt-1 opacity-75">
                          URL: {imageUrl.substring(0, 60)}...
                      </div>
                  )}
              </div>
          )}

          {/* ロード中の表示 */}
          {isLoading && !loaded && !error && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-white bg-black/50 px-4 py-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Firebase画像読み込み中...</span>
                      </div>
                  </div>
              </div>
          )}
      </>
  );
}
