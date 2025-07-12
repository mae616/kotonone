'use client';

import { useState, useEffect } from 'react';

export default function BackgroundImage({ imageUrl, theme }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false);
      return;
    }

    console.log('🖼️ 背景画像読み込み開始:', imageUrl);
    setIsLoading(true);
    setLoaded(false);
    setError(false);

    const img = new Image();
    img.crossOrigin = 'anonymous'; // CORS対応
    
    img.onload = () => {
      console.log('✅ 背景画像読み込み成功:', imageUrl);
      setLoaded(true);
      setError(false);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      console.log('❌ 背景画像読み込みエラー:', imageUrl);
      setError(true);
      setLoaded(false);
      setIsLoading(false);
    };
    
    img.src = imageUrl;
    
    // タイムアウト設定（10秒）
    const timeout = setTimeout(() => {
      if (!loaded && !error) {
        console.log('⏰ 背景画像読み込みタイムアウト:', imageUrl);
        setError(true);
        setIsLoading(false);
      }
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [imageUrl, loaded, error]);

  // フォールバック背景
  const FallbackBackground = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-purple-900/30 to-blue-900/30"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-1000"></div>
      </div>
    </div>
  );

  // 画像がない場合、またはエラーの場合
  if (!imageUrl || error) {
    return <FallbackBackground />;
  }

  return (
    <>
      {/* 成功時の背景画像 */}
      {loaded && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 opacity-100"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      )}
      
      {/* ロード中またはまだロードできていない場合 */}
      {(isLoading || !loaded) && !error && (
        <div className="absolute inset-0">
          <FallbackBackground />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/50 text-sm">
                背景画像を読み込み中...
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}