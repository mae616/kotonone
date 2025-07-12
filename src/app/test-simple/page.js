'use client';

import { useState } from 'react';

export default function TestSimplePage() {
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!theme.trim()) {
      alert('テーマを入力してください');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

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
        setResult(data.data);
      } else {
        setError(data.error || 'エラーが発生しました');
      }
    } catch (err) {
      setError('ネットワークエラー: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            🌸 OpenAI API テスト（Simple版）
          </h1>
          <p className="text-gray-600">
            Firebase Storage回避版 - DALL-E URL直接保存
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              テーマを入力してください
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="例: ざわざわした気分、疲れた、安心したい"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              disabled={loading}
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading || !theme.trim()}
            className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? '詩を生成中... ⏰' : 'リアル詩を生成する ✨'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-medium">エラー</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold">🎉 生成結果</h2>
              <span className="ml-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                OpenAI API
              </span>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">ID:</h3>
              <p className="text-sm text-gray-600 font-mono">{result.id}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">テーマ:</h3>
              <p className="text-gray-800">{result.theme}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">AI生成詩:</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-800 whitespace-pre-line font-medium text-lg">{result.phrase}</p>
              </div>
            </div>
            
            {result.imageUrl && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700">DALL-E 3生成画像:</h3>
                <img 
                  src={result.imageUrl} 
                  alt="DALL-E生成画像"
                  className="w-full max-w-md rounded-md mt-2"
                />
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">画像プロンプト:</h3>
              <p className="text-sm text-gray-600">{result.imagePrompt}</p>
            </div>
            
            {result.note && (
              <div className="mb-4">
                <p className="text-xs text-blue-600">{result.note}</p>
              </div>
            )}
            
            <div className="mt-6">
              <a 
                href={`/view/${result.id}`}
                className="inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                詩ページを見る →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}