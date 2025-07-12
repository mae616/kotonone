'use client';

// 緊急時用：確実に表示される背景コンポーネント
export default function EmergencyBackground() {
  return (
    <div 
      className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"
      style={{ zIndex: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-purple-900/30 to-blue-900/30"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </div>
      <div className="absolute top-4 right-4 bg-red-900/50 text-white p-2 rounded text-xs">
        🚨 緊急背景モード
      </div>
    </div>
  );
}