/**
 * OpenAI GPT-4o API 呼び出し関数
 * 
 * ユーザーのテーマから美しい詩やフレーズを生成し、
 * さらにDALL-E用の画像プロンプトも作成する
 * 
 * @module OpenAI
 * @requires openai
 */
import OpenAI from 'openai';
import logger from '@/lib/logger.js';

// OpenAI クライアント初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * テーマから美しい詩・句を生成
 * 
 * @async
 * @function generatePoem
 * @param {string} theme - ユーザーが入力したテーマ・気分（例：「ざわざわした気分」）
 * @returns {Promise<string>} 生成された日本語の詩・句（2-3行）
 * @throws {Error} OpenAI API呼び出し失敗時
 * @throws {Error} テーマが空文字または無効な場合
 * @example
 * // 基本的な使用例
 * const poem = await generatePoem("ざわざわした気分");
 * // "ざわめきの中で ほんの少し 風が鳴った"
 * 
 * // 幸せなテーマの例
 * const happyPoem = await generatePoem("幸せ");
 * // "日だまりの中 笑顔がひとつ 花を咲かせた"
 */
export async function generatePoem(theme) {
  const startTime = Date.now();
  
  try {
    logger.info('詩生成開始', { theme, model: 'gpt-4o' });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `あなたは日本の詩人です。ユーザーの気分やテーマから、短くて美しい詩や句を生成してください。

要件:
- 2-3行の短い形式
- 日本語の美しい表現を使用
- 感情に寄り添う優しい言葉選び
- ひらがな、カタカナ、漢字をバランス良く使用
- 現代的でありながら詩的な表現
- 句読点は自然に、改行で区切る

例:
テーマ「ざわざわ」→「ざわめきの中で / ほんの少し / 風が鳴った」
テーマ「疲れた」→「そっと置いた / 重いカバンの音に / 今日が終わる」`
        },
        {
          role: "user",
          content: `テーマ: ${theme}`
        }
      ],
      max_tokens: 100,
      temperature: 0.8,
      top_p: 1,
      frequency_penalty: 0.3,
      presence_penalty: 0.2
    });

    const generatedPoem = completion.choices[0]?.message?.content?.trim();
    
    if (!generatedPoem) {
      logger.error('詩生成結果が空', { theme });
      throw new Error('詩の生成に失敗しました');
    }

    logger.info('詩生成完了', {
      theme,
      poem: generatedPoem.substring(0, 50) + '...',
      length: generatedPoem.length,
      duration: `${Date.now() - startTime}ms`,
      tokensUsed: completion.usage?.total_tokens
    });
    
    return generatedPoem;
  } catch (error) {
    logger.error('詩生成失敗', {
      error: error.message,
      theme,
      duration: `${Date.now() - startTime}ms`,
      statusCode: error.status
    });
    throw new Error('詩の生成中にエラーが発生しました');
  }
}

/**
 * テーマと詩から画像生成用プロンプトを作成
 * 
 * @async
 * @function generateImagePrompt
 * @param {string} theme - ユーザーが入力したテーマ
 * @param {string} poem - 生成された詩・フレーズ
 * @returns {Promise<string>} DALL-E 3用の英語画像プロンプト（16:9アスペクト比）
 * @throws {Error} OpenAI API呼び出し失敗時
 * @throws {Error} プロンプト生成失敗時
 * @example
 * // 基本的な使用例
 * const prompt = await generateImagePrompt("ざわざわした気分", "ざわめきの中で ほんの少し 風が鳴った");
 * // "Abstract watercolor painting, soft blue and gray tones..."
 */
export async function generateImagePrompt(theme, poem) {
  const startTime = Date.now();
  
  try {
    logger.info('画像プロンプト生成開始', { theme, poem: poem?.substring(0, 30) + '...' });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `あなたは画像生成プロンプトの専門家です。日本の詩のテーマから、DALL-E 3用の美しい画像プロンプトを英語で生成してください。

重要な要件:
- DALL-E 3のコンテンツポリシーを遵守
- 抽象的で芸術的な表現のみ
- 自然要素（空、雲、水、光）を中心に
- 優しく美しい色調
- 16:9のアスペクト比
- 人物や具体的なオブジェクトは避ける

安全なフォーマット例:
"Abstract watercolor painting, soft [color] tones, gentle flowing shapes, peaceful sky, natural lighting, minimalist composition, serene atmosphere, 16:9 aspect ratio"`
        },
        {
          role: "user",
          content: `テーマ: ${theme}\n詩: ${poem}\n\nこの詩に合う画像生成プロンプトを英語で作成してください。`
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    const imagePrompt = completion.choices[0]?.message?.content?.trim();
    
    if (!imagePrompt) {
      logger.error('画像プロンプト生成結果が空', { theme, poem });
      throw new Error('画像プロンプトの生成に失敗しました');
    }

    logger.info('画像プロンプト生成完了', {
      theme,
      prompt: imagePrompt.substring(0, 100) + '...',
      length: imagePrompt.length,
      duration: `${Date.now() - startTime}ms`,
      tokensUsed: completion.usage?.total_tokens
    });
    
    return imagePrompt;
  } catch (error) {
    logger.error('画像プロンプト生成失敗', {
      error: error.message,
      theme,
      poem,
      duration: `${Date.now() - startTime}ms`,
      statusCode: error.status
    });
    throw new Error('画像プロンプトの生成中にエラーが発生しました');
  }
}