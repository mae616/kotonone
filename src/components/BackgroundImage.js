'use client';

import { useState, useEffect, useRef } from 'react';
import { loadPoemImage } from '@/lib/firebase-image.js';

export default function BackgroundImage({ imageUrl, poemId }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [finalImageUrl, setFinalImageUrl] = useState(null);
  const [loadMethod, setLoadMethod] = useState('');
  const [performance, setPerformance] = useState(null);
  const cleanupRef = useRef(null);

  // Firebase SDK方式での画像読み込み
  useEffect(() => {
      // poemIdがある場合は新しいSDK方式を使用
      if (poemId) {
          console.log("🔥 Firebase SDK方式で画像読み込み開始 (poemId):", poemId);
          loadImageWithSDK(poemId);
          return;
      }
      
      // 従来方式（imageUrlを直接使用）
      if (!imageUrl) {
          console.log("⚠️ 背景画像URL未設定");
          setIsLoading(false);
          return;
      }
      
      console.log("🔄 従来方式で画像読み込み:", imageUrl);
      loadImageWithURL(imageUrl);
  }, [poemId, imageUrl]);
  
  // Firebase SDK方式の読み込み関数
  const loadImageWithSDK = async (poemId) => {
      setIsLoading(true);
      setLoaded(false);
      setError(false);
      setFinalImageUrl(null);
      
      try {
          console.log('🚀 Firebase SDK loadPoemImage 実行中...');
          const result = await loadPoemImage(poemId);
          
          if (result.success) {
              // クリーンアップ関数を保存
              cleanupRef.current = result.cleanup;
              
              // Object URL または Download URL を設定
              const imageUrlToUse = result.objectUrl || result.imageUrl;
              setFinalImageUrl(imageUrlToUse);
              setLoadMethod(result.method);
              setPerformance(result.performance);
              
              console.log('✅ Firebase SDK画像読み込み成功:', result.method);
              console.log('📊 パフォーマンス:', result.performance);
              
              // Image オブジェクトで最終確認
              await validateImageLoad(imageUrlToUse);
              
          } else {
              throw new Error(result.error || 'Firebase SDK読み込み失敗');
          }
          
      } catch (error) {
          console.error('❌ Firebase SDK方式失敗:', error.message);
          setError(true);
          setIsLoading(false);
          setLoadMethod('Failed: ' + error.message);
      }
  };
  
  // 従来のURL方式の読み込み関数
  const loadImageWithURL = async (imageUrl) => {
      setIsLoading(true);
      setLoaded(false);
      setError(false);
      setFinalImageUrl(imageUrl);
      setLoadMethod('Legacy URL method');
      
      try {
          await validateImageLoad(imageUrl);
      } catch (error) {
          console.error('❌ URL方式失敗:', error.message);
          setError(true);
          setIsLoading(false);
      }
  };
  
  // Image オブジェクトでの検証
  const validateImageLoad = (imageUrl) => {
      return new Promise((resolve, reject) => {
          const img = new Image();
          
          img.onload = () => {
              console.log('✅ 画像読み込み検証成功:', imageUrl.substring(0, 50) + '...');
              setLoaded(true);
              setError(false);
              setIsLoading(false);
              resolve();
          };
          
          img.onerror = (event) => {
              console.error('❌ 画像読み込み検証失敗:', imageUrl, event);
              reject(new Error('Image validation failed'));
          };
          
          img.src = imageUrl;
          
          // タイムアウト設定（12秒）
          setTimeout(() => {
              reject(new Error('Image load timeout'));
          }, 12000);
      });
  };
  
  // クリーンアップ
  useEffect(() => {
      return () => {
          if (cleanupRef.current) {
              cleanupRef.current();
              cleanupRef.current = null;
          }
      };
  }, []);

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
          {loaded && finalImageUrl && (
              <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 opacity-100 z-1"
                  style={{ backgroundImage: `url(${finalImageUrl})` }}
              >
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
          )}

          {/* エラー時の表示（詳細情報付き） */}
          {error && (
              <div className="absolute top-4 left-4 bg-red-900/70 text-white p-3 rounded text-sm z-10 max-w-md">
                  <div className="font-bold">🚨 Firebase画像読み込みエラー</div>
                  <div className="text-xs mt-1">
                      Method: {loadMethod}
                  </div>
                  {poemId && (
                      <div className="text-xs">
                          PoemID: {poemId}
                      </div>
                  )}
                  {(imageUrl || finalImageUrl) && (
                      <div className="text-xs mt-1 opacity-75">
                          URL: {(finalImageUrl || imageUrl).substring(0, 50)}...
                      </div>
                  )}
                  {performance && (
                      <div className="text-xs mt-1 opacity-75">
                          Load time: {performance.loadTime}ms
                      </div>
                  )}
              </div>
          )}

          {/* ロード中の表示（方式表示付き） */}
          {isLoading && !loaded && !error && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-white bg-black/50 px-4 py-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <div className="flex flex-col">
                              <span>{poemId ? 'Firebase SDK getBlob()' : 'Firebase URL'} 読み込み中...</span>
                              {loadMethod && (
                                  <span className="text-xs opacity-75">{loadMethod}</span>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          )}
          
          {/* 成功時のパフォーマンス情報（デバッグ用） */}
          {loaded && performance && process.env.NODE_ENV === 'development' && (
              <div className="absolute bottom-4 left-4 bg-green-900/70 text-white p-2 rounded text-xs z-10">
                  <div>✅ {loadMethod}</div>
                  <div>⏱️ {performance.loadTime}ms</div>
                  {performance.size && (
                      <div>📦 {Math.round(performance.size / 1024)}KB</div>
                  )}
              </div>
          )}
      </>
  );
}
