// Firestore データベース操作関数
import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from './firebase.js';

// コレクション名
const POEMS_COLLECTION = 'poems';

/**
 * 新しい詩をFirestoreに保存
 * @param {Object} poemData - 詩のデータ
 * @param {string} poemData.theme - 入力されたテーマ
 * @param {string} poemData.phrase - 生成された詩・句
 * @param {string} [poemData.imageUrl] - Firebase Storage画像URL
 * @param {string} [poemData.imagePrompt] - DALL-E用プロンプト
 * @returns {Promise<string>} - 生成されたドキュメントID
 */
export async function savePoemToFirestore(poemData) {
  try {
    // ユニークIDを生成
    const id = nanoid();
    
    // ドキュメント参照を作成
    const docRef = doc(db, POEMS_COLLECTION, id);
    
    // 保存するデータを準備
    const dataToSave = {
      id,
      theme: poemData.theme,
      phrase: poemData.phrase,
      imageUrl: poemData.imageUrl || null,
      imagePrompt: poemData.imagePrompt || null,
      createdAt: serverTimestamp()
    };
    
    // Firestoreに保存
    await setDoc(docRef, dataToSave);
    
    console.log('詩をFirestoreに保存しました:', id);
    return id;
  } catch (error) {
    console.error('Firestore保存エラー:', error);
    throw new Error('詩の保存に失敗しました');
  }
}

/**
 * IDから詩のデータを取得
 * @param {string} id - ドキュメントID
 * @returns {Promise<Object|null>} - 詩のデータまたはnull
 */
export async function getPoemFromFirestore(id) {
  try {
    const docRef = doc(db, POEMS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('詩を取得しました:', id);
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || null
      };
    } else {
      console.log('指定されたIDの詩が見つかりません:', id);
      return null;
    }
  } catch (error) {
    console.error('Firestore取得エラー:', error);
    throw new Error('詩の取得に失敗しました');
  }
}

/**
 * 詩のデータ構造（型定義コメント）
 * @typedef {Object} PoemDocument
 * @property {string} id - ユニークID（nanoid）
 * @property {string} theme - 入力されたテーマ
 * @property {string} phrase - 生成された詩・句
 * @property {string|null} imageUrl - Firebase Storage画像URL
 * @property {string|null} imagePrompt - DALL-E用プロンプト
 * @property {Date|null} createdAt - 作成日時
 */