import FunctionsClient from '@/lib/functions-client.js';
import { notFound } from 'next/navigation';
import FloatingParticles from '@/components/FloatingParticles.js';
import BackgroundImage from '@/components/BackgroundImage.js';
import logger from '@/lib/logger.js';

// メタデータ生成（OGP対応）
export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const poemData = await FunctionsClient.getPoem(id);
    
    if (!poemData) {
      return {
        title: '詩が見つかりません - ゆるVibe Pages',
        description: '指定された詩が見つかりませんでした。'
      };
    }
    
    return {
      title: `${poemData.theme} - ゆるVibe Pages`,
      description: poemData.phrase,
      openGraph: {
        title: `${poemData.theme} - ゆるVibe Pages`,
        description: poemData.phrase,
        images: poemData.imageUrl ? [
          {
            url: poemData.imageUrl,
            width: 1792,
            height: 1024,
            alt: `${poemData.theme}をテーマにした詩`,
          }
        ] : [],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${poemData.theme} - ゆるVibe Pages`,
        description: poemData.phrase,
        images: poemData.imageUrl ? [poemData.imageUrl] : [],
      }
    };
  } catch (error) {
    logger.error('メタデータ生成エラー', { error: error.message, stack: error.stack });
    return {
      title: 'ゆるVibe Pages',
      description: '詩と画像を生成するアプリ'
    };
  }
}

export default async function ViewPoemPage({ params }) {
  try {
    const { id } = await params;
    const poemData = await FunctionsClient.getPoem(id);
    
    if (!poemData) {
      notFound();
    }
    
    const shareText = `${poemData.phrase}\n\n#ゆるVibePages`;
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/view/${id}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* 浮遊パーティクルアニメーション */}
        <FloatingParticles />
        
        {/* 背景画像 - Firebase SDK方式でpoemIdを渡す */}
        <BackgroundImage 
          imageUrl={poemData.imageUrl} 
          poemId={id}
        />
        
        {/* コンテンツ */}
        <div className="relative z-20 min-h-screen flex items-center justify-center p-8">
          <div className="text-center max-w-2xl">
            {/* テーマ */}
            <div className="mb-8">
              <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg">
                {poemData.theme}
              </span>
            </div>
            
            {/* 詩 - グラスモーフィズムデザイン */}
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl">
              {/* 内側のグロー効果 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              {/* 詩のテキスト */}
              <div className="relative text-white text-xl md:text-2xl leading-relaxed whitespace-pre-line font-medium text-center">
                {poemData.phrase}
              </div>
              
              {/* 装飾的な光の効果 */}
              <div className="absolute -top-1 -left-1 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-pink-300/20 rounded-full blur-lg"></div>
            </div>
            
            {/* アクションボタン - グラスモーフィズム */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500/20 backdrop-blur-md border border-blue-400/30 hover:bg-blue-500/30 text-white px-8 py-4 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
                𝕏で共有する
              </a>
              
              <a
                href="/"
                className="bg-pink-500/20 backdrop-blur-md border border-pink-400/30 hover:bg-pink-500/30 text-white px-8 py-4 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <span className="mr-2">✨</span>
                新しい詩を作る
              </a>
            </div>
            
            {/* 作成日時 */}
            {poemData.createdAt && (
              <div className="mt-8 text-white text-sm opacity-75">
                {new Date(poemData.createdAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    logger.error('詩表示エラー', { error: error.message, stack: error.stack });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">エラーが発生しました</h1>
          <p className="text-gray-600 mb-8">詩の読み込み中にエラーが発生しました。</p>
          <a
            href="/"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            ホームに戻る
          </a>
        </div>
      </div>
    );
  }
}