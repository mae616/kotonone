'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError('テーマを入力してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-safe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: theme.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        // 生成成功後、詩ページに遷移
        router.push(`/view/${data.data.id}`);
      } else {
        setError(data.error || '生成中にエラーが発生しました');
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* メインコンテンツ */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🌸
          </h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            ゆるVibe Pages
          </h2>
          <p className="text-gray-600 text-lg">
            あなたの気持ちを詩に変えます
          </p>
        </div>

        {/* 入力フォーム */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              今の気持ちやテーマを教えてください
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="例: ざわざわした気分、疲れた、安心したい..."
              className="w-full px-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-pink-300 focus:border-pink-400 transition-all duration-200 bg-white/90"
              disabled={loading}
              maxLength={50}
            />
            {theme && (
              <div className="text-right text-xs text-gray-400 mt-1">
                {theme.length}/50
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !theme.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium py-4 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-3 focus:ring-pink-300 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                詩を生成中...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="mr-2">✨</span>
                詩を生成する
              </div>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              生成には20-30秒ほどかかります
            </p>
          </div>
        </div>

        {/* フッター */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            AI で美しい詩と画像を生成します
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <a
              href="/test-simple"
              className="text-gray-500 hover:text-pink-500 text-sm transition-colors"
            >
              テスト版
            </a>
            <a
              href="/test-dummy"
              className="text-gray-500 hover:text-pink-500 text-sm transition-colors"
            >
              ダミー版
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}