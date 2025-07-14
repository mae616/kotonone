#!/usr/bin/env node

/**
 * Markdown to A4 PDF Converter using Puppeteer with Mermaid Support
 * Marpスライド以外の通常のMarkdownをA4サイズのPDFに変換（Mermaid図付き）
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const puppeteer = require('puppeteer');

/**
 * Mermaid図を含むMarkdownをHTMLに変換
 * @param {string} markdownContent - Markdownコンテンツ
 * @returns {string} HTML文字列
 */
function preprocessMermaidInMarkdown(markdownContent) {
  // Mermaid図を一意のIDを持つHTMLに変換
  let mermaidCounter = 0;
  
  return markdownContent.replace(/```mermaid\n([\s\S]*?)\n```/g, (match, mermaidCode) => {
    const mermaidId = `mermaid-${++mermaidCounter}`;
    return `<div class="mermaid" id="${mermaidId}">\n${mermaidCode.trim()}\n</div>`;
  });
}

/**
 * MarkdownファイルをMermaid対応A4 PDFに変換
 * @param {string} inputFile - 入力Markdownファイルパス
 * @param {string} outputFile - 出力PDFファイルパス
 * @param {Object} options - 変換オプション
 */
async function convertMarkdownToPDF(inputFile, outputFile, options = {}) {
  try {
    console.log(`📖 Markdown読み込み: ${inputFile}`);
    
    // Markdownファイルを読み込み
    const markdownContent = fs.readFileSync(inputFile, 'utf8');
    
    // Mermaid図を前処理
    const processedMarkdown = preprocessMermaidInMarkdown(markdownContent);
    console.log(`🔍 Mermaid図の検出: ${(processedMarkdown.match(/class="mermaid"/g) || []).length}個`);
    
    // MarkdownをHTMLに変換
    const htmlContent = marked(processedMarkdown);
    
    // Mermaid対応A4用のHTMLテンプレート
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${path.basename(inputFile, '.md')}</title>
    
    <!-- Mermaid.js -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
    
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
        
        /* Mermaid図のスタイル */
        .mermaid {
            text-align: center;
            margin: 2em 0;
            padding: 1em;
            background-color: #fafafa;
            border: 1px solid #e1e5e9;
            border-radius: 8px;
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
            
            .mermaid {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    ${htmlContent}
    
    <script>
        console.log('🎨 Mermaid初期化開始');
        
        // Mermaid初期化と描画
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            themeCSS: '',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
            },
            sequence: {
                diagramMarginX: 50,
                diagramMarginY: 10,
                actorMargin: 50,
                width: 150,
                height: 65,
                boxMargin: 10,
                boxTextMargin: 5,
                noteMargin: 10,
                messageMargin: 35,
                mirrorActors: true,
                bottomMarginAdj: 1,
                useMaxWidth: true
            }
        });
        
        // Mermaid図の処理状況をログ出力
        window.addEventListener('load', () => {
            console.log('🎨 Mermaid図のレンダリング開始');
            const mermaidElements = document.querySelectorAll('.mermaid');
            console.log('検出されたMermaid図の数:', mermaidElements.length);
            
            mermaidElements.forEach((element, index) => {
                console.log(\`Mermaid図 \${index + 1}の内容:\`, element.textContent.trim().substring(0, 50));
            });
            
            mermaid.run().then(() => {
                console.log('✅ Mermaid図のレンダリング完了');
            }).catch(error => {
                console.error('❌ Mermaid図のレンダリングエラー:', error);
            });
        });
    </script>
</body>
</html>`;

    console.log(`🚀 PDF生成開始...`);
    
    // Puppeteerでブラウザを起動
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 60000
    });
    
    const page = await browser.newPage();
    
    // コンソールログを取得
    page.on('console', msg => {
      console.log(`🌐 ブラウザ: ${msg.text()}`);
    });
    
    // エラーを取得
    page.on('pageerror', error => {
      console.error(`❌ ページエラー: ${error.message}`);
    });
    
    console.log(`📄 HTMLコンテンツを設定中...`);
    
    // HTMLコンテンツを設定
    await page.setContent(htmlTemplate, { 
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 60000 
    });
    
    console.log(`✅ HTMLコンテンツ設定完了`);
    
    // Mermaid図のレンダリングを待機
    console.log('🎨 Mermaid図のレンダリング待機中...');
    
    // waitForTimeout の代わりに新しい構文を使用
    await new Promise(resolve => setTimeout(resolve, 5000)); // Mermaid図の描画時間を確保
    
    // Mermaid図が完全にレンダリングされるまで待機
    try {
      await page.waitForFunction(
        () => {
          const mermaidElements = document.querySelectorAll('.mermaid');
          if (mermaidElements.length === 0) return true; // Mermaid図がない場合は即座に続行
          
          // すべてのMermaid図がSVGとしてレンダリングされているかチェック
          for (const element of mermaidElements) {
            const svg = element.querySelector('svg');
            if (!svg || svg.children.length === 0) return false;
          }
          return true;
        },
        { timeout: 45000 }
      );
      console.log('✅ Mermaid図のレンダリング完了');
    } catch (error) {
      console.warn('⚠️ Mermaid図のレンダリングタイムアウト（PDF生成は継続）');
    }
    
    // 出力ディレクトリを作成
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(`📑 PDF生成中...`);
    
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
