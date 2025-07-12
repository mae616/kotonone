import { getPoemFromFirestore } from '@/lib/firestore.js';
import { notFound } from 'next/navigation';

// メタデータ生成（OGP対応）
export async function generateMetadata({ params }) {
  try {
    const poemData = await getPoemFromFirestore(params.id);
    
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
    console.error('メタデータ生成エラー:', error);
    return {
      title: 'ゆるVibe Pages',
      description: '詩と画像を生成するアプリ'
    };
  }
}

export default async function ViewPoemPage({ params }) {
  try {
    const poemData = await getPoemFromFirestore(params.id);
    
    if (!poemData) {
      notFound();
    }
    
    const shareText = `${poemData.phrase}\n\n#ゆるVibePages`;
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/view/${params.id}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* 背景画像 */}
        {poemData.imageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${poemData.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>
        )}
        
        {/* コンテンツ */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="text-center max-w-2xl">
            {/* テーマ */}
            <div className="mb-8">
              <span className="inline-block bg-white bg-opacity-90 text-gray-700 px-6 py-2 rounded-full text-sm font-medium">
                {poemData.theme}
              </span>
            </div>
            
            {/* 詩 */}
            <div className="bg-white bg-opacity-95 rounded-2xl p-8 mb-8 shadow-2xl">
              <div className="text-gray-800 text-xl md:text-2xl leading-relaxed whitespace-pre-line font-medium">
                {poemData.phrase}
              </div>
            </div>
            
            {/* アクションボタン */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                𝕏で共有する
              </a>
              
              <a
                href="/"
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
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
    console.error('詩表示エラー:', error);
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