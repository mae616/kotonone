// ダミーAPI: OpenAI制限時の代替エンドポイント
import { NextResponse } from 'next/server';
import { generateDummyResponse } from '@/lib/dummy-data.js';
import { savePoemToFirestore } from '@/lib/firestore.js';

export async function POST(request) {
  try {
    console.log('🌸 ダミー詩生成API開始');
    
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
    
    // ダミーデータ生成
    console.log('🎭 ダミーデータ生成開始');
    const dummyData = generateDummyResponse(cleanTheme);
    console.log('✅ ダミーデータ生成完了');
    
    // Firestoreに詩データを保存
    console.log('📚 Firestore保存開始');
    const poemId = await savePoemToFirestore({
      theme: cleanTheme,
      phrase: dummyData.poem,
      imageUrl: dummyData.imageUrl,
      imagePrompt: dummyData.imagePrompt + ' [DUMMY]'
    });
    console.log('✅ Firestore保存完了:', poemId);
    
    // 成功レスポンス
    return NextResponse.json({
      success: true,
      data: {
        id: poemId,
        theme: cleanTheme,
        phrase: dummyData.poem,
        imageUrl: dummyData.imageUrl,
        imagePrompt: dummyData.imagePrompt,
        isDummy: true
      }
    });
    
  } catch (error) {
    console.error('❌ ダミーAPI生成エラー:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'ダミー詩の生成中にエラーが発生しました',
        details: {
          type: 'dummy_error',
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
    message: '🎭 ゆるVibe Pages ダミー詩生成API',
    usage: 'POST /api/generate-dummy with { "theme": "your_theme" }',
    note: 'OpenAI API制限時の代替エンドポイント',
    version: '1.0.0'
  });
}