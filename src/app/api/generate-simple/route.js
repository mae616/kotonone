// API Route: Storage回避版（DALL-E URLを直接保存）
import { NextResponse } from 'next/server';
import { generatePoem, generateImagePrompt } from '@/lib/openai.js';
import { generateImage } from '@/lib/dalle.js';
import { savePoemToFirestore } from '@/lib/firestore.js';

export async function POST(request) {
  try {
    console.log('🌸 詩生成API開始（Simple版）');
    
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
    
    // 画像プロンプト生成と画像生成
    console.log('🎨 画像プロンプト生成開始');
    const imagePrompt = await generateImagePrompt(cleanTheme, poem);
    console.log('✅ 画像プロンプト完了:', imagePrompt);
    
    console.log('🖼️ DALL-E画像生成開始');
    const dalleImageUrl = await generateImage(imagePrompt);
    console.log('✅ DALL-E画像生成完了:', dalleImageUrl);
    
    // Firestoreに直接DALL-E URLを保存（Storage回避）
    console.log('📚 Firestore保存開始（DALL-E URL直接保存）');
    const poemId = await savePoemToFirestore({
      theme: cleanTheme,
      phrase: poem,
      imageUrl: dalleImageUrl, // DALL-E URLを直接保存
      imagePrompt: imagePrompt
    });
    console.log('✅ Firestore保存完了:', poemId);
    
    // 成功レスポンス
    return NextResponse.json({
      success: true,
      data: {
        id: poemId,
        theme: cleanTheme,
        phrase: poem,
        imageUrl: dalleImageUrl,
        imagePrompt: imagePrompt,
        note: 'DALL-E URL直接保存版'
      }
    });
    
  } catch (error) {
    console.error('❌ API生成エラー:', error);
    
    let errorMessage = '詩の生成中にエラーが発生しました';
    let errorDetails = {};
    
    if (error.message.includes('OpenAI')) {
      errorMessage = 'AI生成サービスでエラーが発生しました';
      errorDetails.type = 'openai_error';
    } else if (error.message.includes('Firebase') || error.message.includes('Storage')) {
      errorMessage = 'データ保存中にエラーが発生しました';
      errorDetails.type = 'firebase_error';
    }
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: {
          ...errorDetails,
          message: error.message
        }
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: '🌸 ゆるVibe Pages 詩生成API（Simple版）',
    usage: 'POST /api/generate-simple with { "theme": "your_theme" }',
    note: 'Firebase Storage回避版（DALL-E URL直接保存）',
    version: '1.0.0'
  });
}