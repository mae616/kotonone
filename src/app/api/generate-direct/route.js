// API Route: DALL-E URL直接保存版（Firebase Storage回避）
import { NextResponse } from 'next/server';
import { generatePoem, generateImagePrompt } from '@/lib/openai.js';
import { generateImage, getImageFallback } from '@/lib/dalle.js';
import { savePoemToFirestore } from '@/lib/firestore.js';

export async function POST(request) {
  try {
    console.log('🌸 詩生成API開始（DALL-E直接版）');
    
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
    
    let finalImageUrl = null;
    let imagePrompt = null;
    let isDirect = false;
    
    try {
      // 画像プロンプト生成と画像生成
      console.log('🎨 画像プロンプト生成開始');
      imagePrompt = await generateImagePrompt(cleanTheme, poem);
      console.log('✅ 画像プロンプト完了:', imagePrompt);
      
      console.log('🖼️ DALL-E画像生成開始');
      const dalleImageUrl = await generateImage(imagePrompt);
      console.log('✅ DALL-E画像生成完了:', dalleImageUrl);
      
      // DALL-E URLを直接使用（Firebase Storage回避）
      finalImageUrl = dalleImageUrl;
      isDirect = true;
      
    } catch (imageError) {
      console.warn('🚨 画像生成失敗:', imageError.message);
      
      // フォールバック: プレースホルダー画像
      const fallbackData = getImageFallback(cleanTheme);
      finalImageUrl = fallbackData.imageUrl;
      imagePrompt = fallbackData.prompt;
      isDirect = false;
    }
    
    // Firestoreに詩データを保存
    console.log('📚 Firestore保存開始');
    const poemId = await savePoemToFirestore({
      theme: cleanTheme,
      phrase: poem,
      imageUrl: finalImageUrl,
      imagePrompt: imagePrompt + (isDirect ? ' [DALL-E直接]' : ' [フォールバック]')
    });
    console.log('✅ Firestore保存完了:', poemId);
    
    // 成功レスポンス
    return NextResponse.json({
      success: true,
      data: {
        id: poemId,
        theme: cleanTheme,
        phrase: poem,
        imageUrl: finalImageUrl,
        imagePrompt: imagePrompt,
        isDirect: isDirect,
        note: isDirect ? 'DALL-E URL直接使用' : 'フォールバック画像使用'
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
    message: '🌸 ゆるVibe Pages 詩生成API（DALL-E直接版）',
    usage: 'POST /api/generate-direct with { "theme": "your_theme" }',
    note: 'Firebase Storage回避版',
    version: '1.0.0'
  });
}