// Firebase Storage 画像アップロード関数
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase.js';

/**
 * DALL-E生成画像をFirebase Storageにアップロード
 * @param {string} imageId - 画像識別ID（通常は詩のID）
 * @param {string} imageUrl - DALL-Eから取得した画像URL
 * @returns {Promise<string>} - Firebase Storage上の画像URL
 */
export async function uploadImageToStorage(imageId, imageUrl) {
  try {
    console.log('画像ダウンロード開始:', imageUrl);
    
    // DALL-E画像をfetch
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`画像取得失敗: ${response.status}`);
    }
    
    // Blobとして取得
    const imageBlob = await response.blob();
    console.log('画像サイズ:', imageBlob.size, 'bytes');
    
    // Storage参照を作成（ファイル名：{imageId}.png）
    const fileName = `images/${imageId}.png`;
    const storageRef = ref(storage, fileName);
    
    // メタデータを設定
    const metadata = {
      contentType: 'image/png',
      customMetadata: {
        'generated': 'dalle-3',
        'uploadedAt': new Date().toISOString()
      }
    };
    
    console.log('Firebase Storageアップロード開始:', fileName);
    
    // アップロード実行
    const snapshot = await uploadBytes(storageRef, imageBlob, metadata);
    console.log('アップロード完了:', snapshot.metadata.fullPath);
    
    // ダウンロードURLを取得
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Firebase Storage URL:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Storage アップロードエラー:', error);
    throw new Error('画像のアップロードに失敗しました');
  }
}

/**
 * Base64画像データをFirebase Storageにアップロード
 * @param {string} imageId - 画像識別ID
 * @param {string} base64Data - Base64エンコード画像データ
 * @returns {Promise<string>} - Firebase Storage上の画像URL
 */
export async function uploadBase64ImageToStorage(imageId, base64Data) {
  try {
    // Base64からBlobに変換
    const base64Response = await fetch(base64Data);
    const blob = await base64Response.blob();
    
    const fileName = `images/${imageId}.png`;
    const storageRef = ref(storage, fileName);
    
    const metadata = {
      contentType: 'image/png',
      customMetadata: {
        'generated': 'dalle-3',
        'uploadedAt': new Date().toISOString()
      }
    };
    
    const snapshot = await uploadBytes(storageRef, blob, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('Base64画像アップロード完了:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Base64 アップロードエラー:', error);
    throw new Error('Base64画像のアップロードに失敗しました');
  }
}

/**
 * Storage上の画像を削除
 * @param {string} imageId - 画像識別ID
 * @returns {Promise<void>}
 */
export async function deleteImageFromStorage(imageId) {
  try {
    const fileName = `images/${imageId}.png`;
    const storageRef = ref(storage, fileName);
    
    await deleteObject(storageRef);
    console.log('画像削除完了:', fileName);
  } catch (error) {
    console.error('画像削除エラー:', error);
    throw new Error('画像の削除に失敗しました');
  }
}