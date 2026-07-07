/**
 * Arabic MathJax Processor
 * تطبيق لمعالجة ملفات Markdown وإصلاح اتجاه المعادلات والرموز الرياضية باللغة العربية
 * 
 * يعتمد على مفاهيم حزمة arabic-mathjax: https://github.com/OmarIthawi/arabic-mathjax
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * فئة معالجة النصوص العربية الرياضية
 * Arabic Math Text Processor Class
 */
class ArabicMathProcessor {
    constructor() {
        // خريطة تحويل الرموز الرياضية العربية
        this.arabicMathSymbols = {
            // الأرقام العربية
            '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
            '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩',
            
            // الرموز الرياضية
            '+': '+', '-': '-', '×': '×', '÷': '÷', '=': '=',
            '(': '(', ')': ')', '<': '<', '>': '>',
            '≤': '≤', '≥': '≥', '≠': '≠', '≈': '≈',
            
            // الرموز اليونانية والعلمية
            'α': 'α', 'β': 'β', 'γ': 'γ', 'δ': 'δ', 'θ': 'θ',
            'π': 'π', 'σ': 'σ', 'Ω': 'Ω', 'Δ': 'Δ', 'Σ': 'Σ',
        };

        // مصفوفة لاستبدال المصطلحات الرياضية في النصوص
        this.mathTermsArabic = {
            'sin': 'جا', 'cos': 'جتا', 'tan': 'ظتا',
            'arcsin': 'قا جا', 'arccos': 'قا جتا', 'arctan': 'قا ظتا',
            'log': 'لوغ', 'ln': 'لوغ طبيعي', 'lim': 'نهاية',
            'sum': 'مجموع', 'prod': 'حاصل ضرب', 'int': 'تكامل',
            'frac': 'كسر', 'sqrt': 'جذر', 'partial': 'جزئي',
            'infty': 'لانهاية', 'therefore': 'إذاً', 'because': 'لأن',
        };
    }

    /**
     * تحويل الأرقام الغربية إلى أرقام عربية
     */
    convertToArabicNumerals(text) {
        let result = text;
        for (const [western, arabic] of Object.entries(this.arabicMathSymbols)) {
            if (western >= '0' && western <= '9') {
                result = result.replace(new RegExp(western, 'g'), arabic);
            }
        }
        return result;
    }

    /**
     * معالجة معادلة LaTeX لإضافة دعم RTL
     */
    processMathEquation(equation, options = {}) {
        const { convertNumerals = false, addDirection = true } = options;
        
        let processed = equation;
        
        // إضافة اتجاه النص من اليمين لليسار إذا لزم الأمر
        if (addDirection) {
            // إضافة علامة RTL في البداية والنهاية
            processed = `\u202B${processed}\u202C`;
        }
        
        // تحويل الأرقام إلى عربية إذا طُلب
        if (convertNumerals) {
            processed = this.convertToArabicNumerals(processed);
        }
        
        return processed;
    }

    /**
     * استخراج المعادلات الرياضية من نص Markdown
     */
    extractMathEquations(markdown) {
        const equations = [];
        
        // معادلات بين $$ (معادلات منفصلة)
        const displayMathRegex = /\$\$([\s\S]*?)\$\$/g;
        let match;
        while ((match = displayMathRegex.exec(markdown)) !== null) {
            equations.push({
                type: 'display',
                content: match[1],
                fullMatch: match[0],
                index: match.index
            });
        }
        
        // معادلات بين $ (معادلات مضمنة)
        const inlineMathRegex = /\$([^\$][\s\S]*?[^\$])\$/g;
        while ((match = inlineMathRegex.exec(markdown)) !== null) {
            // التأكد من عدم تطابقها مع display math
            if (!match[0].startsWith('$$')) {
                equations.push({
                    type: 'inline',
                    content: match[1],
                    fullMatch: match[0],
                    index: match.index
                });
            }
        }
        
        // ترتيب المعادلات حسب الموقع
        equations.sort((a, b) => a.index - b.index);
        
        return equations;
    }

    /**
     * معالجة نص Markdown بالكامل
     */
    processMarkdown(markdown, options = {}) {
        const {
            convertNumerals = false,
            preserveOriginal = true,
            addMathJaxConfig = false
        } = options;
        
        const equations = this.extractMathEquations(markdown);
        
        if (equations.length === 0) {
            return {
                processed: markdown,
                equations: [],
                hasMath: false
            };
        }
        
        let processed = markdown;
        
        // معالجة كل معادلة
        for (const eq of equations) {
            const processedContent = this.processMathEquation(eq.content, { convertNumerals });
            
            let replacement;
            if (eq.type === 'display') {
                replacement = `$$${processedContent}$$`;
            } else {
                replacement = `$${processedContent}$`;
            }
            
            processed = processed.replace(eq.fullMatch, replacement);
        }
        
        // إضافة إعدادات MathJax في البداية إذا طُلب
        if (addMathJaxConfig) {
            const mathjaxConfig = this.getMathJaxConfig();
            processed = mathjaxConfig + '\n\n' + processed;
        }
        
        return {
            processed,
            equations,
            hasMath: true
        };
    }

    /**
     * الحصول على إعدادات MathJax للغة العربية
     */
    getMathJaxConfig() {
        return `<!-- MathJax Configuration for Arabic -->
<script>
window.MathJax = {
    tex: {
        packages: ['base', 'ams', 'noerrors', 'noundefined'],
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
        processEscapes: true,
        processEnvironments: true,
        digits: /^(\\d+\\.\\d*|\\.\\d+)(?:[eE][-+]?\\d+)?$/,
        tags: 'ams',
        tagSide: 'right',
        tagIndent: '0.8em',
        useLabelIds: true
    },
    options: {
        renderActions: {
            addMenu: [],
            checkDocument: []
        },
        enableMenu: true,
        menuOptions: {
            settings: {
                semantics: true
            }
        }
    },
    loader: {
        load: ['input/tex', 'output/chtml', '[tex]/ams', '[tex]/noerrors', '[tex]/noundefined']
    },
    startup: {
        typeset: false,
        pageReady: () => {
            return MathJax.startup.defaultPageReady().then(() => {
                MathJax.typesetPromise();
            });
        }
    },
    chtml: {
        displayAlign: 'center',
        displayIndent: '0em',
        mtextInheritFont: true
    },
    // إعدادات خاصة باللغة العربية
    arabic: {
        rtl: true,
        arabicNumerals: false, // تعيين إلى true لتحويل الأرقام إلى عربية
        arabicMathTerms: true, // استخدام المصطلحات الرياضية العربية
        preserveArabicText: true // الحفاظ على النص العربي داخل المعادلات
    }
};
</script>`;
    }

    /**
     * إنشاء HTML من Markdown مع دعم MathJax العربي
     */
    markdownToHTML(markdown, options = {}) {
        // معالجة المحتوى بدون إضافة إعدادات MathJax (سيتم إضافتها في generateFullHTML)
        const { processed, equations, hasMath } = this.processMarkdown(markdown, { ...options, addMathJaxConfig: false });
        
        // تحويل Markdown إلى HTML
        let html = this.simpleMarkdownToHTML(processed);
        
        // إضافة CSS خاص بالعربية
        const arabicCSS = `
<style>
/* إعدادات الخط العربي */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    direction: rtl;
    text-align: right;
    line-height: 1.8;
}

/* تنسيق المعادلات الرياضية */
.MathJax {
    direction: ltr !important;
    display: inline-block;
}

.MathJax_Display {
    direction: ltr !important;
    display: block !important;
    text-align: center !important;
    margin: 1em 0;
}

/* تنسيق النصوص العربية داخل المعادلات */
mjx-mtext {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    direction: rtl;
}

/* تنسيق العناوين */
h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: bold;
}

h1 { font-size: 2em; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
h3 { font-size: 1.25em; }

/* تنسيق الجداول */
table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
}

th, td {
    border: 1px solid #ddd;
    padding: 0.75em;
    text-align: right;
}

th {
    background-color: #f5f5f5;
    font-weight: bold;
}

/* تنسيق القوائم */
ul, ol {
    padding-right: 2em;
    padding-left: 0;
}

/* تنسيق الصور */
img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1em auto;
}

/* تنسيق الروابط */
a {
    color: #0066cc;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

/* تنسيق الأكواد */
code {
    direction: ltr;
    text-align: left;
    background-color: #f4f4f4;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
}

pre {
    direction: ltr;
    text-align: left;
    background-color: #f4f4f4;
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
}

/* تنسيق الاقتباسات */
blockquote {
    border-right: 4px solid #ddd;
    margin: 1em 0;
    padding: 0.5em 1em;
    background-color: #f9f9f9;
}
</style>`;
        
        // إضافة CSS إلى HTML
        html = html.replace('</head>', arabicCSS + '\n</head>');
        
        return { html, equations, hasMath };
    }

    /**
     * تحويل بسيط لـ Markdown إلى HTML
     */
    simpleMarkdownToHTML(markdown) {
        let html = markdown;
        
        // العناوين
        html = html.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
        html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
        html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        
        // الخط العريض والمائل
        html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // الصور
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
        
        // الروابط
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        
        // الأسطر الفارغة
        html = html.replace(/\n\n/g, '</p><p>');
        
        // إضافة وسوم الفقرات
        html = '<p>' + html + '</p>';
        
        // تنظيف الفقرات الفارغة
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-6]>)/g, '$1');
        html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<img)/g, '$1');
        html = html.replace(/(\/>)<\/p>/g, '$1');
        html = html.replace(/<p>(<div)/g, '$1');
        html = html.replace(/(<\/div>)<\/p>/g, '$1');
        
        return html;
    }
}

/**
 * فئة معالجة الملفات
 * File Processor Class
 */
class FileProcessor {
    constructor(options = {}) {
        this.mathProcessor = new ArabicMathProcessor();
        this.options = {
            inputDir: options.inputDir || 'Docs',
            outputDir: options.outputDir || 'output',
            convertNumerals: options.convertNumerals || false,
            generateHTML: options.generateHTML || false,
            recursive: options.recursive !== false,
            ...options
        };
    }

    /**
     * معالجة جميع ملفات Markdown في مجلد
     */
    processDirectory() {
        const { inputDir, outputDir, recursive } = this.options;
        
        console.log(`🔍 جاري البحث عن ملفات Markdown في: ${inputDir}`);
        
        const files = this.findMarkdownFiles(inputDir, recursive);
        
        if (files.length === 0) {
            console.log('❌ لم يتم العثور على أي ملفات Markdown');
            return;
        }
        
        console.log(`📄 تم العثور على ${files.length} ملف Markdown`);
        
        let processedCount = 0;
        let totalEquations = 0;
        
        for (const file of files) {
            try {
                const result = this.processFile(file);
                processedCount++;
                totalEquations += result.equations.length;
                
                console.log(`✅ ${basename(file)}: ${result.equations.length} معادلة`);
            } catch (error) {
                console.error(`❌ خطأ في معالجة ${file}:`, error.message);
            }
        }
        
        console.log(`\n📊 الإحصائيات:`);
        console.log(`   الملفات المعالجة: ${processedCount}/${files.length}`);
        console.log(`   إجمالي المعادلات: ${totalEquations}`);
        console.log(`   المجلد الناتج: ${outputDir}`);
    }

    /**
     * البحث عن ملفات Markdown
     */
    findMarkdownFiles(dir, recursive = true) {
        const files = [];
        
        if (!existsSync(dir)) {
            console.error(`❌ المجلد غير موجود: ${dir}`);
            return files;
        }
        
        const items = readdirSync(dir);
        
        for (const item of items) {
            const fullPath = join(dir, item);
            const stat = statSync(fullPath);
            
            if (stat.isDirectory() && recursive) {
                files.push(...this.findMarkdownFiles(fullPath, recursive));
            } else if (stat.isFile() && (extname(item).toLowerCase() === '.md' || extname(item).toLowerCase() === '.markdown')) {
                files.push(fullPath);
            }
        }
        
        return files;
    }

    /**
     * معالجة ملف واحد
     */
    processFile(filePath) {
        const { outputDir, convertNumerals, generateHTML } = this.options;
        
        // قراءة الملف
        const content = readFileSync(filePath, 'utf8');
        
        // معالجة المحتوى - بدون إضافة إعدادات MathJax للملفات Markdown
        const result = this.mathProcessor.processMarkdown(content, {
            convertNumerals,
            addMathJaxConfig: false
        });
        
        // تحديد مسار الملف الناتج
        const relativePath = filePath.replace(this.options.inputDir, '');
        const outputFilePath = join(outputDir, relativePath);
        
        // إنشاء المجلدات اللازمة
        mkdirSync(dirname(outputFilePath), { recursive: true });
        
        // حفظ الملف المعالج
        writeFileSync(outputFilePath, result.processed, 'utf8');
        
        // توليد HTML إذا طُلب
        if (generateHTML) {
            const htmlResult = this.mathProcessor.markdownToHTML(content, { convertNumerals });
            const htmlFilePath = outputFilePath.replace(extname(outputFilePath), '.html');
            
            const fullHTML = this.generateFullHTML(htmlResult.html, basename(filePath));
            writeFileSync(htmlFilePath, fullHTML, 'utf8');
        }
        
        return result;
    }

    /**
     * إنشاء HTML كامل مع الرأس والتذييل
     */
    generateFullHTML(content, title) {
        return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <script>
    window.MathJax = {
        tex: {
            packages: ['base', 'ams', 'noerrors', 'noundefined'],
            inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
            displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
            processEscapes: true,
            processEnvironments: true,
            tags: 'ams',
            tagSide: 'right',
            tagIndent: '0.8em',
            useLabelIds: true
        },
        options: {
            enableMenu: true
        },
        loader: {
            load: ['input/tex', 'output/chtml', '[tex]/ams', '[tex]/noerrors', '[tex]/noundefined']
        },
        startup: {
            typeset: false,
            pageReady: () => {
                return MathJax.startup.defaultPageReady().then(() => {
                    MathJax.typesetPromise();
                });
            }
        },
        chtml: {
            displayAlign: 'center',
            displayIndent: '0em',
            mtextInheritFont: true
        },
        arabic: {
            rtl: true,
            arabicNumerals: false,
            arabicMathTerms: true,
            preserveArabicText: true
        }
    };
    </script>
</head>
<body>
    <main>
        ${content}
    </main>
    <footer>
        <p>تمت المعالجة بواسطة Arabic MathJax Processor</p>
    </footer>
</body>
</html>`;
    }
}

/**
 * دالة رئيسية
 * Main Function
 */
function main() {
    const args = process.argv.slice(2);
    
    // تحليل المعاملات
    const options = {
        inputDir: 'Docs',
        outputDir: 'output',
        convertNumerals: false,
        generateHTML: false,
        recursive: true
    };
    
    for (const arg of args) {
        if (arg.startsWith('--dir=')) {
            options.inputDir = arg.split('=')[1];
        } else if (arg.startsWith('--output=')) {
            options.outputDir = arg.split('=')[1];
        } else if (arg === '--numerals' || arg === '-n') {
            options.convertNumerals = true;
        } else if (arg === '--html' || arg === '-h') {
            options.generateHTML = true;
        } else if (arg === '--no-recursive') {
            options.recursive = false;
        } else if (arg === '--help' || arg === '-?') {
            showHelp();
            return;
        }
    }
    
    console.log('🚀 Arabic MathJax Processor');
    console.log('============================\n');
    
    const processor = new FileProcessor(options);
    processor.processDirectory();
}

/**
 * عرض المساعدة
 */
function showHelp() {
    console.log(`
Arabic MathJax Processor - معالجة ملفات Markdown للغة العربية

الاستخدام:
  node index.js [خيارات]

الخيارات:
  --dir=<مسار>        مجلد الإدخال (الافتراضي: Docs)
  --output=<مسار>     مجلد الإخراج (الافتراضي: output)
  --numerals, -n      تحويل الأرقام إلى عربية
  --html, -h          توليد ملفات HTML
  --no-recursive      عدم البحث بشكل متكرر في المجلدات
  --help, -?          عرض هذه المساعدة

أمثلة:
  node index.js --dir=Docs --output=output --html
  node index.js -n -h
  npm run process:docs
`);
}

// تشغيل البرنامج
main();