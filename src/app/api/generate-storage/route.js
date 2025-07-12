// API Route: Firebase Storage保存付き詩生成
import { NextResponse } from 'next/server';
import { generatePoem, generateImagePrompt } from '@/lib/openai.js';
import { generateImage, getImageFallback } from '@/lib/dalle.js';
import { uploadImageToStorage } from '@/lib/storage.js';
import { savePoemToFirestore } from '@/lib/firestore.js';

export async function POST(request) {
  try {
    console.log('🌸 詩生成API開始（Storage版）');
    
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
    let storageSuccess = false;
    
    try {
      // 画像プロンプト生成と画像生成
      console.log('🎨 画像プロンプト生成開始');
      imagePrompt = await generateImagePrompt(cleanTheme, poem);
      console.log('✅ 画像プロンプト完了:', imagePrompt);
      
      console.log('🖼️ DALL-E画像生成開始');
      const dalleImageUrl = await generateImage(imagePrompt);
      console.log('✅ DALL-E画像生成完了:', dalleImageUrl);
      
      // Firebase Storageに保存を試行
      try {
        const tempId = Date.now().toString();
        console.log('☁️ Firebase Storage アップロード開始');
        const storageImageUrl = await uploadImageToStorage(tempId, dalleImageUrl);
        console.log('✅ Firebase Storage アップロード完了:', storageImageUrl);
        
        finalImageUrl = storageImageUrl;
        storageSuccess = true;
        
      } catch (storageError) {
        console.warn('🚨 Firebase Storage アップロード失敗:', storageError.message);
        console.log('🔄 DALL-E URL直接使用にフォールバック');
        finalImageUrl = dalleImageUrl;
        storageSuccess = false;
      }
      
    } catch (imageError) {
      console.warn('🚨 画像生成失敗:', imageError.message);
      
      // フォールバック: プレースホルダー画像
      const fallbackData = getImageFallback(cleanTheme);
      finalImageUrl = fallbackData.imageUrl;
      imagePrompt = fallbackData.prompt;
      storageSuccess = false;
    }
    
    // Firestoreに詩データを保存
    console.log('📚 Firestore保存開始');
    const poemId = await savePoemToFirestore({
      theme: cleanTheme,
      phrase: poem,
      imageUrl: finalImageUrl,
      imagePrompt: imagePrompt + (storageSuccess ? ' [STORAGE]' : ' [DIRECT]')
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
        storageSuccess: storageSuccess,
        note: storageSuccess ? 'Firebase Storage保存成功' : 'DALL-E URL直接保存'
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
    message: '🌸 ゆるVibe Pages 詩生成API（Storage版）',
    usage: 'POST /api/generate-storage with { "theme": "your_theme" }',
    note: 'Firebase Storage保存付き',
    version: '1.0.0'
  });
}