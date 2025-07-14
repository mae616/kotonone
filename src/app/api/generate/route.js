/**
 * API Route: 詩と画像の並行生成
 * 
 * ユーザーのテーマ入力から詩と背景画像を並行生成し、
 * Firebase Storageに保存後、Firestoreにメタデータを保存する
 * 
 * @module GenerateAPI
 * @requires NextResponse
 * @requires openai
 * @requires dalle
 * @requires storage
 * @requires functions-client
 */
import { NextResponse } from 'next/server';
import { generatePoem, generateImagePrompt } from '@/lib/openai.js';
import { generateImage } from '@/lib/dalle.js';
import { uploadImageToStorage } from '@/lib/storage.js';
import FunctionsClient from '@/lib/functions-client.js';
import logger from '@/lib/logger.js';

/**
 * 詩と画像を並行生成するPOSTエンドポイント
 * 
 * @async
 * @function POST
 * @param {Request} request - Next.js リクエストオブジェクト
 * @returns {Promise<NextResponse>} 生成結果またはエラーレスポンス
 * @throws {Error} OpenAI API呼び出し失敗時
 * @throws {Error} Firebase操作失敗時
 * @example
 * // リクエスト例
 * fetch('/api/generate', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ theme: 'ざわざわした気分' })
 * })
 */
export async function POST(request) {
  const startTime = Date.now();
  
  try {
    logger.info('詩生成API開始', { endpoint: '/api/generate' });
    
    // リクエストボディを取得
    const { theme } = await request.json();
    
    // バリデーション
    if (!theme || typeof theme !== 'string' || theme.trim().length === 0) {
      logger.warn('無効なテーマ入力', { theme: theme || 'undefined' });
      return NextResponse.json(
        { 
          success: false, 
          error: 'テーマを入力してください' 
        },
        { status: 400 }
      );
    }
    
    const cleanTheme = theme.trim();
    logger.debug('処理パラメータ', { theme: cleanTheme, timestamp: new Date().toISOString() });
    
    // 並行処理：詩生成と画像プロンプト生成
    logger.info('詩生成処理開始', { theme: cleanTheme });
    const poemPromise = generatePoem(cleanTheme);
    
    // 詩生成完了を待つ
    const poem = await poemPromise;
    logger.info('詩生成完了', { 
      poem: poem?.substring(0, 50) + '...', 
      length: poem?.length 
    });
    
    // 画像プロンプト生成と画像生成を順次実行
    logger.info('画像プロンプト生成開始', { theme: cleanTheme });
    const imagePrompt = await generateImagePrompt(cleanTheme, poem);
    logger.info('画像プロンプト生成完了', { 
      prompt: imagePrompt?.substring(0, 50) + '...'
    });
    
    logger.info('DALL-E画像生成開始', { prompt: imagePrompt });
    const dalleImageUrl = await generateImage(imagePrompt);
    logger.info('DALL-E画像生成完了', { imageUrl: dalleImageUrl });
    
    // 仮のIDを生成（Firestoreで正式に確定される）
    const tempId = Date.now().toString();
    
    // Firebase Storageに画像をアップロード
    logger.info('Firebase Storageアップロード開始', { tempId, dalleImageUrl });
    const firebaseImageUrl = await uploadImageToStorage(tempId, dalleImageUrl);
    logger.info('Firebase Storageアップロード完了', { firebaseImageUrl, tempId });
    
    // Firebase Functions経由で詩データを保存
    logger.info('Functions詩保存開始', { theme: cleanTheme });
    const poemId = await FunctionsClient.savePoem({
      theme: cleanTheme,
      phrase: poem,
      imageUrl: firebaseImageUrl,
      imagePrompt: imagePrompt
    });
    logger.info('Functions詩保存完了', { 
      poemId, 
      theme: cleanTheme,
      duration: `${Date.now() - startTime}ms`
    });
    
    // 成功レスポンス
    const response = {
      success: true,
      data: {
        id: poemId,
        theme: cleanTheme,
        phrase: poem,
        imageUrl: firebaseImageUrl,
        imagePrompt: imagePrompt
      }
    };
    
    logger.info('API処理完了', {
      success: true,
      poemId,
      totalDuration: `${Date.now() - startTime}ms`
    });
    
    return NextResponse.json(response);
    
  } catch (error) {
    // エラータイプ別の詳細情報
    let errorMessage = '詩の生成中にエラーが発生しました';
    let errorType = 'unknown';
    
    if (error.message.includes('OpenAI')) {
      errorMessage = 'AI生成サービスでエラーが発生しました';
      errorType = 'openai_error';
    } else if (error.message.includes('Firebase') || error.message.includes('Storage')) {
      errorMessage = 'データ保存中にエラーが発生しました';
      errorType = 'firebase_error';
    } else if (error.message.includes('DALL-E') || error.message.includes('画像')) {
      errorMessage = '画像生成中にエラーが発生しました';
      errorType = 'dalle_error';
    }
    
    logger.error('詩生成API失敗', {
      error: error.message,
      stack: error.stack,
      errorType,
      theme: cleanTheme || 'unknown',
      duration: `${Date.now() - startTime}ms`
    });
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: {
          type: errorType,
          message: error.message
        }
      },
      { status: 500 }
    );
  }
}

/**
 * API情報を返すGETエンドポイント
 * 
 * @async
 * @function GET
 * @returns {Promise<NextResponse>} API情報と使用方法
 * @example
 * // GET /api/generate
 * {
 *   "message": "🌸 ゆるVibe Pages 詩生成API",
 *   "usage": "POST /api/generate with { \"theme\": \"your_theme\" }",
 *   "version": "1.0.0"
 * }
 */
export async function GET() {
  logger.debug('API情報リクエスト', { method: 'GET', endpoint: '/api/generate' });
  
  return NextResponse.json({
    message: '🌸 ゆるVibe Pages 詩生成API',
    usage: 'POST /api/generate with { "theme": "your_theme" }',
    version: '1.0.0'
  });
}