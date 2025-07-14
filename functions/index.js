/**
 * Firebase Functions for ゆるVibe Pages
 * CORS対応でFirestore操作を提供するクラウド関数
 * 
 * @fileoverview メインエントリポイント - 詩の保存・取得API
 * @author ゆるVibe Pages Team
 * @version 1.0.0
 */

const {onRequest} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const {nanoid} = require("nanoid");

// Firebase Admin SDK初期化
admin.initializeApp();
const db = admin.firestore();

// CORS設定 - Next.jsアプリからのアクセスを許可
const corsHandler = cors({
  origin: [
    "http://localhost:3000",  // 開発環境
    "https://kotonone.vercel.app",  // 本番環境（要更新）
    /\.vercel\.app$/,  // Vercelプレビュー環境
  ],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

/**
 * 詩をFirestoreに保存するCloud Function
 * 
 * @async
 * @function savePoem
 * @param {Object} request - HTTPリクエストオブジェクト
 * @param {Object} response - HTTPレスポンスオブジェクト
 * @returns {Promise<void>} JSON形式のレスポンス
 * 
 * @example
 * // POST リクエスト例
 * {
 *   "theme": "ざわざわした気分",
 *   "phrase": "ざわめきの中で ほんの少し 風が鳴った",
 *   "imageUrl": "https://firebasestorage.googleapis.com/...",
 *   "imagePrompt": "A serene autumn scene..."
 * }
 * 
 * // レスポンス例
 * {
 *   "success": true,
 *   "data": {
 *     "id": "abc123xyz",
 *     "message": "詩を正常に保存しました"
 *   }
 * }
 */
exports.savePoem = onRequest({
  cors: true,
  region: "asia-northeast1",  // 東京リージョン（低レイテンシ）
}, async (request, response) => {
  return corsHandler(request, response, async () => {
    try {
      // POSTメソッドのみ許可
      if (request.method !== "POST") {
        logger.warn("Invalid HTTP method", {method: request.method});
        return response.status(405).json({
          success: false,
          error: "Method not allowed. Use POST.",
        });
      }

      const {theme, phrase, imageUrl, imagePrompt} = request.body;

      // 必須フィールドの検証
      if (!theme || !phrase) {
        logger.warn("Missing required fields", {theme, phrase});
        return response.status(400).json({
          success: false,
          error: "テーマと詩は必須項目です",
        });
      }

      // ユニークIDを生成
      const id = nanoid();
      
      // 保存データの準備
      const poemData = {
        id,
        theme: theme.trim(),
        phrase: phrase.trim(),
        imageUrl: imageUrl || null,
        imagePrompt: imagePrompt || null,
        createdAt: admin.firestore.Timestamp.now(),
      };

      // Firestoreに保存
      await db.collection("poems").doc(id).set(poemData);

      logger.info("Poem saved successfully", {id, theme: theme.substring(0, 20)});

      return response.status(201).json({
        success: true,
        data: {
          id,
          message: "詩を正常に保存しました",
        },
      });

    } catch (error) {
      logger.error("Error saving poem", {
        error: error.message,
        stack: error.stack,
      });

      return response.status(500).json({
        success: false,
        error: "詩の保存中にエラーが発生しました",
      });
    }
  });
});

/**
 * IDで詩を取得するCloud Function
 * 
 * @async
 * @function getPoem
 * @param {Object} request - HTTPリクエストオブジェクト
 * @param {Object} response - HTTPレスポンスオブジェクト
 * @returns {Promise<void>} 詩データまたはエラーレスポンス
 * 
 * @example
 * // GET /getPoem?id=abc123xyz
 * 
 * // 成功レスポンス
 * {
 *   "success": true,
 *   "data": {
 *     "id": "abc123xyz",
 *     "theme": "ざわざわした気分",
 *     "phrase": "ざわめきの中で ほんの少し 風が鳴った",
 *     "imageUrl": "https://firebasestorage.googleapis.com/...",
 *     "createdAt": "2025-01-14T10:30:00.000Z"
 *   }
 * }
 */
exports.getPoem = onRequest({
  cors: true,
  region: "asia-northeast1",
}, async (request, response) => {
  return corsHandler(request, response, async () => {
    try {
      // GETメソッドのみ許可
      if (request.method !== "GET") {
        logger.warn("Invalid HTTP method for getPoem", {method: request.method});
        return response.status(405).json({
          success: false,
          error: "Method not allowed. Use GET.",
        });
      }

      const {id} = request.query;

      // IDパラメータの検証
      if (!id) {
        logger.warn("Missing ID parameter");
        return response.status(400).json({
          success: false,
          error: "詩のIDが必要です",
        });
      }

      // Firestoreから詩を取得
      const docSnapshot = await db.collection("poems").doc(id).get();

      if (!docSnapshot.exists) {
        logger.info("Poem not found", {id});
        return response.status(404).json({
          success: false,
          error: "指定されたIDの詩が見つかりません",
        });
      }

      const poemData = docSnapshot.data();
      
      // Timestampを日付文字列に変換
      const responseData = {
        ...poemData,
        createdAt: poemData.createdAt?.toDate()?.toISOString() || null,
      };

      logger.info("Poem retrieved successfully", {id});

      return response.status(200).json({
        success: true,
        data: responseData,
      });

    } catch (error) {
      logger.error("Error retrieving poem", {
        error: error.message,
        stack: error.stack,
        id: request.query.id,
      });

      return response.status(500).json({
        success: false,
        error: "詩の取得中にエラーが発生しました",
      });
    }
  });
});

/**
 * ヘルスチェック用エンドポイント
 * 
 * @async
 * @function healthCheck
 * @param {Object} request - HTTPリクエストオブジェクト
 * @param {Object} response - HTTPレスポンスオブジェクト
 * @returns {Promise<void>} ステータスレスポンス
 */
exports.healthCheck = onRequest({
  cors: true,
  region: "asia-northeast1",
}, async (request, response) => {
  return corsHandler(request, response, async () => {
    return response.status(200).json({
      success: true,
      message: "ゆるVibe Pages Functions are running!",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    });
  });
});