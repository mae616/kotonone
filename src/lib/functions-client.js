/**
 * Firebase Functions クライアント
 * 
 * CORS問題を回避するため、Firestore操作をFirebase Functions経由で実行
 * 
 * @fileoverview Firebase Functions APIクライアント
 * @module FunctionsClient
 * @requires logger
 * @version 1.0.0
 */

import logger from '@/lib/logger.js';

/**
 * Firebase Functions の基本URL
 * @constant {string}
 */
const FUNCTIONS_BASE_URL = process.env.NEXT_PUBLIC_FUNCTIONS_URL || 
  'https://asia-northeast1-kotonone-app.cloudfunctions.net';

/**
 * Firebase Functions共通リクエストヘッダー
 * @constant {Object}
 */
const FUNCTIONS_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Firebase Functions APIリクエストのタイムアウト設定
 * @constant {number}
 */
const REQUEST_TIMEOUT = 30000; // 30秒

/**
 * Firebase Functions APIクライアント
 * @class
 */
class FunctionsClient {
  /**
   * 詩をFirebase Functions経由で保存
   * 
   * @async
   * @static
   * @param {Object} poemData - 詩データオブジェクト
   * @param {string} poemData.theme - 入力テーマ
   * @param {string} poemData.phrase - 生成された詩
   * @param {string} [poemData.imageUrl] - 画像URL
   * @param {string} [poemData.imagePrompt] - 画像プロンプト
   * @returns {Promise<string>} 保存された詩のID
   * @throws {Error} API呼び出し失敗時
   * 
   * @example
   * const poemId = await FunctionsClient.savePoem({
   *   theme: 'ざわざわした気分',
   *   phrase: 'ざわめきの中で ほんの少し 風が鳴った',
   *   imageUrl: 'https://storage.googleapis.com/...',
   *   imagePrompt: 'A serene autumn scene...'
   * });
   */
  static async savePoem(poemData) {
    const startTime = Date.now();
    
    try {
      logger.info('Functions詩保存開始', { 
        theme: poemData.theme?.substring(0, 20) + '...',
        hasImage: !!poemData.imageUrl
      });

      // AbortControllerでタイムアウト設定
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(`${FUNCTIONS_BASE_URL}/savePoem`, {
        method: 'POST',
        headers: FUNCTIONS_HEADERS,
        body: JSON.stringify(poemData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Functions API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(`Functions operation failed: ${result.error || 'Unknown error'}`);
      }

      logger.info('Functions詩保存完了', {
        poemId: result.data.id,
        duration: `${Date.now() - startTime}ms`
      });

      return result.data.id;

    } catch (error) {
      logger.error('Functions詩保存失敗', {
        error: error.message,
        stack: error.stack,
        theme: poemData.theme,
        duration: `${Date.now() - startTime}ms`
      });

      if (error.name === 'AbortError') {
        throw new Error('詩の保存がタイムアウトしました');
      }

      throw new Error(`詩の保存に失敗しました: ${error.message}`);
    }
  }

  /**
   * IDでFirebase Functions経由で詩を取得
   * 
   * @async
   * @static
   * @param {string} id - 詩のID
   * @returns {Promise<Object|null>} 詩データまたはnull
   * @throws {Error} API呼び出し失敗時
   * 
   * @example
   * const poem = await FunctionsClient.getPoem('abc123xyz');
   * console.log(poem.theme, poem.phrase);
   */
  static async getPoem(id) {
    const startTime = Date.now();
    
    try {
      logger.info('Functions詩取得開始', { id });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(`${FUNCTIONS_BASE_URL}/getPoem?id=${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: FUNCTIONS_HEADERS,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          logger.info('詩が見つかりません', { id });
          return null;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Functions API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(`Functions operation failed: ${result.error || 'Unknown error'}`);
      }

      logger.info('Functions詩取得完了', {
        id,
        hasData: !!result.data,
        duration: `${Date.now() - startTime}ms`
      });

      return result.data;

    } catch (error) {
      logger.error('Functions詩取得失敗', {
        error: error.message,
        stack: error.stack,
        id,
        duration: `${Date.now() - startTime}ms`
      });

      if (error.name === 'AbortError') {
        throw new Error('詩の取得がタイムアウトしました');
      }

      throw new Error(`詩の取得に失敗しました: ${error.message}`);
    }
  }

  /**
   * Functions ヘルスチェック
   * 
   * @async
   * @static
   * @returns {Promise<boolean>} サービス状態
   * 
   * @example
   * const isHealthy = await FunctionsClient.healthCheck();
   * console.log('Functions status:', isHealthy ? 'OK' : 'Error');
   */
  static async healthCheck() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒タイムアウト

      const response = await fetch(`${FUNCTIONS_BASE_URL}/healthCheck`, {
        method: 'GET',
        headers: FUNCTIONS_HEADERS,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await response.json();
      const isHealthy = response.ok && result.success;

      logger.debug('Functions ヘルスチェック', {
        status: response.status,
        healthy: isHealthy,
        version: result.version
      });

      return isHealthy;

    } catch (error) {
      logger.warn('Functions ヘルスチェック失敗', {
        error: error.message
      });
      return false;
    }
  }
}

export default FunctionsClient;