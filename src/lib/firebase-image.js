// Firebase Storage 専用画像読み込みユーティリティ
import { ref, getBlob, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase.js';

/**
 * Firebase Storage から画像を直接ダウンロードしてObject URLを作成
 * CORSエラーを回避するためにgetBlob()を使用
 * @param {string} imageId - 画像ID（ファイル名から拡張子を除いたもの）
 * @returns {Promise<{success: boolean, objectUrl?: string, error?: string, method: string}>}
 */
export async function loadFirebaseImageBlob(imageId) {
  try {
    console.log('🔥 Firebase SDK getBlob() 方式で画像読み込み開始:', imageId);
    
    // Storage 参照を作成
    const fileName = `images/${imageId}.png`;
    const storageRef = ref(storage, fileName);
    
    // getBlob() で直接データを取得（CORS完全回避）
    console.log('📡 getBlob() 実行中...', fileName);
    const blob = await getBlob(storageRef);
    console.log('✅ getBlob() 成功 - サイズ:', blob.size, 'bytes, タイプ:', blob.type);
    
    // Blob の検証
    if (!blob || blob.size === 0) {
      throw new Error('Empty blob received');
    }
    
    // Object URL を作成
    const objectUrl = URL.createObjectURL(blob);
    console.log('✅ Object URL 作成成功:', objectUrl);
    
    return {
      success: true,
      objectUrl: objectUrl,
      method: 'Firebase SDK getBlob() - CORS回避',
      size: blob.size,
      type: blob.type,
      corsAvoidance: true
    };
    
  } catch (error) {
    console.warn('❌ Firebase SDK getBlob() 失敗:', error.message);
    console.log('🔄 フォールバック: getDownloadURL 方式に切り替え');
    
    // フォールバック: 従来のgetDownloadURL方式（CORS問題あり）
    return await loadFirebaseImageUrl(imageId);
  }
}

/**
 * Firebase Storage から getDownloadURL を使用して画像URLを取得（フォールバック）
 * @param {string} imageId - 画像ID
 * @returns {Promise<{success: boolean, downloadUrl?: string, error?: string, method: string}>}
 */
export async function loadFirebaseImageUrl(imageId) {
  try {
    console.log('🔄 フォールバック: getDownloadURL() 方式で画像読み込み:', imageId);
    
    const fileName = `images/${imageId}.png`;
    const storageRef = ref(storage, fileName);
    
    const downloadUrl = await getDownloadURL(storageRef);
    console.log('✅ getDownloadURL() 成功:', downloadUrl);
    
    // CORS問題の事前診断
    console.log('🔍 CORS診断: URL形式チェック');
    if (downloadUrl.includes('firebasestorage.googleapis.com')) {
      console.log('ℹ️ 標準Firebase Storage URL - CORS設定が必要');
    }
    
    return {
      success: true,
      downloadUrl: downloadUrl,
      method: 'Firebase getDownloadURL() - CORS依存',
      fallback: true,
      corsRequired: true
    };
    
  } catch (error) {
    console.error('❌ Firebase Storage 読み込み完全失敗:', error.message);
    
    // 緊急フォールバック: プレースホルダー画像
    console.log('🆘 緊急フォールバック: プレースホルダー画像を生成');
    
    return {
      success: false,
      error: error.message,
      method: 'Complete Failure - Emergency Fallback',
      emergencyFallback: true
    };
  }
}

/**
 * 詩IDからFirebase Storage画像を読み込む統合関数
 * @param {string} poemId - 詩のID
 * @returns {Promise<{success: boolean, imageUrl?: string, objectUrl?: string, cleanup?: Function, method: string}>}
 */
export async function loadPoemImage(poemId) {
  const startTime = Date.now();
  
  try {
    // まずSDK方式を試行
    const blobResult = await loadFirebaseImageBlob(poemId);
    
    if (blobResult.success) {
      const loadTime = Date.now() - startTime;
      console.log(`🚀 SDK方式成功 (${loadTime}ms):`, blobResult.method);
      
      // Object URL のクリーンアップ関数を提供
      const cleanup = () => {
        if (blobResult.objectUrl) {
          URL.revokeObjectURL(blobResult.objectUrl);
          console.log('🧹 Object URL クリーンアップ完了');
        }
      };
      
      return {
        success: true,
        objectUrl: blobResult.objectUrl,
        method: blobResult.method,
        cleanup: cleanup,
        performance: {
          loadTime: loadTime,
          size: blobResult.size,
          type: blobResult.type
        }
      };
    }
    
    // SDK方式が失敗した場合はURL方式（既に loadFirebaseImageBlob 内で実行済み）
    console.log('⚠️ SDK方式失敗、URL方式の結果:', blobResult);
    
    if (blobResult.downloadUrl) {
      const loadTime = Date.now() - startTime;
      console.log(`🔄 URL方式で継続 (${loadTime}ms):`, blobResult.method);
      
      return {
        success: true,
        imageUrl: blobResult.downloadUrl,
        method: blobResult.method,
        performance: {
          loadTime: loadTime
        }
      };
    }
    
    throw new Error('すべての読み込み方式が失敗しました');
    
  } catch (error) {
    const loadTime = Date.now() - startTime;
    console.error(`❌ 画像読み込み完全失敗 (${loadTime}ms):`, error.message);
    
    return {
      success: false,
      error: error.message,
      method: 'Complete Failure',
      performance: {
        loadTime: loadTime
      }
    };
  }
}

/**
 * Object URL のメモリリーク防止のためのクリーンアップユーティリティ
 * @param {string[]} objectUrls - クリーンアップするObject URLの配列
 */
export function cleanupObjectUrls(objectUrls) {
  if (!Array.isArray(objectUrls)) {
    objectUrls = [objectUrls];
  }
  
  objectUrls.forEach(url => {
    if (url && typeof url === 'string' && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
      console.log('🧹 Object URL revoked:', url.substring(0, 50) + '...');
    }
  });
}

/**
 * Firebase Storage画像の存在確認
 * @param {string} imageId - 画像ID
 * @returns {Promise<boolean>}
 */
export async function checkFirebaseImageExists(imageId) {
  try {
    const fileName = `images/${imageId}.png`;
    const storageRef = ref(storage, fileName);
    
    // getDownloadURL が成功すれば存在する
    await getDownloadURL(storageRef);
    return true;
  } catch (error) {
    console.log(`画像存在確認: ${imageId} は存在しません`);
    return false;
  }
}