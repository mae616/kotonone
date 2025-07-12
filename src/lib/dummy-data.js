// ダミーデータ生成関数（OpenAI API制限時の代替）

/**
 * ダミー詩生成
 * @param {string} theme - テーマ
 * @returns {string} - ダミー詩
 */
export function generateDummyPoem(theme) {
  const poems = {
    'ざわざわ': 'ざわめきの中で\nほんの少し\n風が鳴った',
    'ざわざわした気分': 'ざわめきの中で\nほんの少し\n風が鳴った',
    '疲れた': 'そっと置いた\n重いカバンの音に\n今日が終わる',
    '安心したい': 'やわらかな光に\n包まれて\n心が軽やか',
    '寂しい': '星ひとつ\n窓の向こうで\nそっと光る',
    '嬉しい': '小さな幸せが\nポケットの中で\n踊ってる',
    default: `${theme}の中で\nやわらかな時間が\n流れていく`
  };
  
  return poems[theme] || poems.default;
}

/**
 * ダミー画像プロンプト生成
 * @param {string} theme - テーマ
 * @param {string} poem - 詩
 * @returns {string} - ダミー画像プロンプト
 */
export function generateDummyImagePrompt(theme, poem) {
  return `Watercolor painting, abstract representation of "${theme}" emotion, soft brushstrokes, muted earth tones with touches of deep blue, flowing organic shapes suggesting gentle movement and introspection, minimalist composition, peaceful atmosphere, 16:9 aspect ratio`;
}

/**
 * ダミー画像URL取得
 * @param {string} theme - テーマ
 * @returns {string} - ダミー画像URL
 */
export function getDummyImageUrl(theme) {
  // Unsplash APIを使用したダミー画像（無料）
  const imageKeywords = {
    'ざわざわ': 'abstract,water',
    'ざわざわした気分': 'abstract,water',
    '疲れた': 'sunset,peaceful',
    '安心したい': 'calm,nature',
    '寂しい': 'minimal,night',
    '嬉しい': 'light,joy',
    default: 'abstract,peaceful'
  };
  
  const keyword = imageKeywords[theme] || imageKeywords.default;
  
  // Unsplash Source API（1792x1024の16:9）
  return `https://source.unsplash.com/1792x1024/?${keyword}`;
}

/**
 * 完全ダミーデータでのレスポンス生成
 * @param {string} theme - テーマ
 * @returns {Object} - ダミーレスポンス
 */
export function generateDummyResponse(theme) {
  const poem = generateDummyPoem(theme);
  const imagePrompt = generateDummyImagePrompt(theme, poem);
  const imageUrl = getDummyImageUrl(theme);
  
  return {
    poem,
    imagePrompt,
    imageUrl,
    isDummy: true
  };
}