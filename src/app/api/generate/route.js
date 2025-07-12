// API Route: 詩と画像の並行生成
import { NextResponse } from 'next/server';
import { generatePoem, generateImagePrompt } from '@/lib/openai.js';
import { generateImage } from '@/lib/dalle.js';
import { uploadImageToStorage } from '@/lib/storage.js';
import { savePoemToFirestore } from '@/lib/firestore.js';

export async function POST(request) {
  try {
    console.log('🌸 詩生成API開始');
    
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
    
    // 並行処理：詩生成と画像プロンプト生成
    console.log('🚀 並行処理開始: 詩生成');
    const poemPromise = generatePoem(cleanTheme);
    
    // 詩生成完了を待つ
    const poem = await poemPromise;
    console.log('✅ 詩生成完了:', poem);
    
    // 画像プロンプト生成と画像生成を順次実行
    console.log('🎨 画像プロンプト生成開始');
    const imagePrompt = await generateImagePrompt(cleanTheme, poem);
    console.log('✅ 画像プロンプト完了:', imagePrompt);
    
    console.log('🖼️ DALL-E画像生成開始');
    const dalleImageUrl = await generateImage(imagePrompt);
    console.log('✅ DALL-E画像生成完了:', dalleImageUrl);
    
    // 仮のIDを生成（Firestoreで正式に確定される）
    const tempId = Date.now().toString();
    
    // Firebase Storageに画像をアップロード
    console.log('☁️ Firebase Storage アップロード開始');
    const firebaseImageUrl = await uploadImageToStorage(tempId, dalleImageUrl);
    console.log('✅ Firebase Storage アップロード完了:', firebaseImageUrl);
    
    // Firestoreに詩データを保存
    console.log('📚 Firestore保存開始');
    const poemId = await savePoemToFirestore({
      theme: cleanTheme,
      phrase: poem,
      imageUrl: firebaseImageUrl,
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
        imageUrl: firebaseImageUrl,
        imagePrompt: imagePrompt
      }
    });
    
  } catch (error) {
    console.error('❌ API生成エラー:', error);
    
    // エラータイプ別の詳細情報
    let errorMessage = '詩の生成中にエラーが発生しました';
    let errorDetails = {};
    
    if (error.message.includes('OpenAI')) {
      errorMessage = 'AI生成サービスでエラーが発生しました';
      errorDetails.type = 'openai_error';
    } else if (error.message.includes('Firebase') || error.message.includes('Storage')) {
      errorMessage = 'データ保存中にエラーが発生しました';
      errorDetails.type = 'firebase_error';
    } else if (error.message.includes('DALL-E') || error.message.includes('画像')) {
      errorMessage = '画像生成中にエラーが発生しました';
      errorDetails.type = 'dalle_error';
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

// GETメソッドの場合の簡単な情報表示
export async function GET() {
  return NextResponse.json({
    message: '🌸 ゆるVibe Pages 詩生成API',
    usage: 'POST /api/generate with { "theme": "your_theme" }',
    version: '1.0.0'
  });
}