#!/usr/bin/env node

/**
 * Markdown to A4 PDF Converter using Puppeteer
 * Marpスライド以外の通常のMarkdownをA4サイズのPDFに変換
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const puppeteer = require('puppeteer');

/**
 * MarkdownファイルをA4 PDFに変換
 * @param {string} inputFile - 入力Markdownファイルパス
 * @param {string} outputFile - 出力PDFファイルパス
 * @param {Object} options - 変換オプション
 */
async function convertMarkdownToPDF(inputFile, outputFile, options = {}) {
  try {
    console.log(`📖 Markdown読み込み: ${inputFile}`);
    
    // Markdownファイルを読み込み
    const markdownContent = fs.readFileSync(inputFile, 'utf8');
    
    // MarkdownをHTMLに変換
    const htmlContent = marked(markdownContent);
    
    // A4用のHTMLテンプレート
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${path.basename(inputFile, '.md')}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', YuGothic, Meiryo, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 60px;
            color: #333;
            font-size: 14px;
        }
        
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 2em;
            margin-bottom: 1em;
        }
        
        h1 {
            font-size: 2.2em;
            border-bottom: 3px solid #3498db;
            padding-bottom: 0.3em;
        }
        
        h2 {
            font-size: 1.8em;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 0.3em;
        }
        
        h3 {
            font-size: 1.5em;
            color: #34495e;
        }
        
        code {
            background-color: #f8f9fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 0.9em;
        }
        
        pre {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 16px;
            overflow-x: auto;
            margin: 1em 0;
        }
        
        pre code {
            background: none;
            padding: 0;
        }
        
        blockquote {
            border-left: 4px solid #3498db;
            margin: 1em 0;
            padding-left: 1em;
            color: #7f8c8d;
            font-style: italic;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
        }
        
        th {
            background-color: #f8f9fa;
            font-weight: 600;
        }
        
        ul, ol {
            margin: 1em 0;
            padding-left: 2em;
        }
        
        li {
            margin: 0.5em 0;
        }
        
        img {
            max-width: 100%;
            height: auto;
            margin: 1em 0;
        }
        
        /* ページ区切り用 */
        .page-break {
            page-break-before: always;
        }
        
        /* 印刷用スタイル */
        @media print {
            body {
                margin: 0;
                padding: 20mm;
            }
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

    console.log(`🚀 PDF生成開始...`);
    
    // Puppeteerでブラウザを起動
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // HTMLコンテンツを設定
    await page.setContent(htmlTemplate, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // 出力ディレクトリを作成
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // A4 PDFとして出力
    await page.pdf({
      path: outputFile,
      format: 'A4',
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '20mm',
        right: '20mm'
      },
      printBackground: true,
      preferCSSPageSize: false
    });
    
    await browser.close();
    
    // ファイルサイズを取得
    const stats = fs.statSync(outputFile);
    const fileSizeKB = Math.round(stats.size / 1024);
    
    console.log(`✅ PDF生成完了: ${outputFile} (${fileSizeKB}KB)`);
    
  } catch (error) {
    console.error(`❌ PDF生成エラー: ${error.message}`);
    throw error;
  }
}

// コマンドライン引数の処理
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
📚 Markdown to A4 PDF Converter

使用方法:
  node scripts/md-to-pdf.js <input.md> <output.pdf>

例:
  node scripts/md-to-pdf.js doc/00_task/todo.md doc/99_slide_pdf/task/todo-a4.pdf
`);
    process.exit(1);
  }
  
  const [inputFile, outputFile] = args;
  
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ 入力ファイルが見つかりません: ${inputFile}`);
    process.exit(1);
  }
  
  await convertMarkdownToPDF(inputFile, outputFile);
}

// スクリプト直接実行時
if (require.main === module) {
  main().catch(error => {
    console.error('エラー:', error);
    process.exit(1);
  });
}

module.exports = { convertMarkdownToPDF };
