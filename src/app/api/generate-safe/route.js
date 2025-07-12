// API Route: DALL-Eフォールバック付き詩生成
import { NextResponse } from 'next/server';
import { generatePoem, generateImagePrompt } from '@/lib/openai.js';
import { generateImage, getImageFallback } from '@/lib/dalle.js';
import { savePoemToFirestore } from '@/lib/firestore.js';

export async function POST(request) {
  try {
    console.log('🌸 詩生成API開始（Safe版）');
    
    // リクエストボディを取得
    const { theme } = await request.json();
    
    // バリデーション
    if (!theme || typeof theme !== 'string' || theme.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'テーマを入力してください' 
        },
        { status: 400 }
      );
    }
    
    const cleanTheme = theme.trim();
    console.log('テーマ:', cleanTheme);
    
    // 詩生成
    console.log('🚀 詩生成開始');
    const poem = await generatePoem(cleanTheme);
    console.log('✅ 詩生成完了:', poem);
    
    let imageUrl = null;
    let imagePrompt = null;
    let isFallback = false;
    
    try {
      // 画像プロンプト生成と画像生成
      console.log('🎨 画像プロンプト生成開始');
      imagePrompt = await generateImagePrompt(cleanTheme, poem);
      console.log('✅ 画像プロンプト完了:', imagePrompt);
      
      console.log('🖼️ DALL-E画像生成開始');
      imageUrl = await generateImage(imagePrompt);
      console.log('✅ DALL-E画像生成完了:', imageUrl);
      
    } catch (imageError) {
      console.warn('🚨 DALL-E画像生成失敗:', imageError.message);
      
      // フォールバック: シンプルな安全プロンプト
      try {
        console.log('🔄 安全プロンプトでリトライ');
        const safePrompt = `Abstract watercolor painting, soft pastel colors, gentle flowing shapes, peaceful atmosphere, minimalist composition, serene landscape, 16:9 aspect ratio`;
        imageUrl = await generateImage(safePrompt);
        imagePrompt = safePrompt;
        console.log('✅ 安全プロンプトで画像生成成功');
        
      } catch (retryError) {
        console.warn('🚨 安全プロンプトでも失敗:', retryError.message);
        
        // 最終フォールバック: プレースホルダー画像
        const fallbackData = getImageFallback(cleanTheme);
        imageUrl = fallbackData.imageUrl;
        imagePrompt = fallbackData.prompt;
        isFallback = true;
        console.log('🔄 フォールバック画像使用');
      }
    }
    
    // Firestoreに詩データを保存
    console.log('📚 Firestore保存開始');
    const poemId = await savePoemToFirestore({
      theme: cleanTheme,
      phrase: poem,
      imageUrl: imageUrl,
      imagePrompt: imagePrompt + (isFallback ? ' [FALLBACK]' : '')
    });
    console.log('✅ Firestore保存完了:', poemId);
    
    // 成功レスポンス
    return NextResponse.json({
      success: true,
      data: {
        id: poemId,
        theme: cleanTheme,
        phrase: poem,
        imageUrl: imageUrl,
        imagePrompt: imagePrompt,
        isFallback: isFallback,
        note: isFallback ? 'フォールバック画像を使用' : 'DALL-E画像生成成功'
      }
    });
    
  } catch (error) {
    console.error('❌ API生成エラー:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '詩の生成中にエラーが発生しました',
        details: {
          message: error.message
        }
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: '🌸 ゆるVibe Pages 詩生成API（Safe版）',
    usage: 'POST /api/generate-safe with { "theme": "your_theme" }',
    note: 'DALL-Eフォールバック付き',
    version: '1.0.0'
  });
}