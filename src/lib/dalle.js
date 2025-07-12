// DALL-E 3 画像生成API関数
import OpenAI from 'openai';

// OpenAI クライアント初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * DALL-E 3で画像を生成
 * @param {string} prompt - 画像生成用プロンプト
 * @returns {Promise<string>} - 生成された画像のURL
 */
export async function generateImage(prompt) {
  try {
    console.log('DALL-E 3 画像生成開始');
    console.log('プロンプト:', prompt);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1792x1024", // 16:9 アスペクト比（OGP最適化）
      quality: "hd",      // 高品質
      style: "natural"    // 自然な写実的スタイル
    });

    const imageUrl = response.data[0]?.url;
    
    if (!imageUrl) {
      throw new Error('画像URLが取得できませんでした');
    }

    console.log('DALL-E 3 画像生成完了:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('DALL-E 3 エラー:', error);
    
    // エラーの詳細を確認
    if (error.response?.status === 400) {
      throw new Error('画像生成プロンプトに問題があります');
    } else if (error.response?.status === 429) {
      throw new Error('API利用制限に達しました。しばらく待ってから再試行してください');
    } else if (error.response?.status === 500) {
      throw new Error('OpenAI サーバーエラーが発生しました');
    }
    
    throw new Error('画像生成中にエラーが発生しました');
  }
}

/**
 * テーマから直接画像を生成（シンプル版）
 * @param {string} theme - ユーザーのテーマ
 * @returns {Promise<{imageUrl: string, prompt: string}>} - 画像URLとプロンプト
 */
export async function generateImageFromTheme(theme) {
  try {
    // シンプルなプロンプト生成
    const basePrompt = `Abstract watercolor painting representing the emotion "${theme}", soft brushstrokes, gentle colors, peaceful atmosphere, minimalist composition, 16:9 aspect ratio`;
    
    console.log('テーマ直接画像生成:', theme);
    
    const imageUrl = await generateImage(basePrompt);
    
    return {
      imageUrl,
      prompt: basePrompt
    };
  } catch (error) {
    console.error('テーマ画像生成エラー:', error);
    throw error;
  }
}

/**
 * エラー時のフォールバック処理
 * @param {string} theme - ユーザーのテーマ
 * @returns {Object} - フォールバック結果
 */
export function getImageFallback(theme) {
  console.log('画像生成フォールバック実行:', theme);
  
  // プレースホルダー画像URL（アプリ内の静的画像）
  const fallbackImageUrl = '/images/fallback-background.jpg';
  
  return {
    imageUrl: fallbackImageUrl,
    prompt: `Fallback image for theme: ${theme}`,
    isFallback: true
  };
}