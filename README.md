# Arabic MathJax Processor

تطبيق لمعالجة ملفات Markdown وإصلاح اتجاه المعادلات والرموز الرياضية باللغة العربية.

## الميزات

- ✅ قراءة جميع ملفات Markdown من مجلد Docs
- ✅ معالجة المعادلات الرياضية بصيغة LaTeX
- ✅ إضافة دعم RTL (من اليمين إلى اليسار) للمعادلات
- ✅ إعدادات MathJax متوافقة مع اللغة العربية
- ✅ توليد ملفات HTML مع دعم MathJax كامل
- ✅ تحويل الأرقام إلى أرقام عربية (اختياري)
- ✅ معالجة متكررة للمجلدات الفرعية

## التثبيت

```bash
npm install
```

## الاستخدام

### المعالجة الأساسية (إنشاء ملفات Markdown مع إعدادات MathJax)

```bash
node index.js --dir=Docs --output=output
```

### توليد ملفات HTML

```bash
node index.js --dir=Docs --output=output --html
```

### تحويل الأرقام إلى عربية

```bash
node index.js --dir=Docs --output=output --html --numerals
```

### الخيارات المتاحة

| الخيار | الوصف | الافتراضي |
|--------|-------|----------|
| `--dir=<مسار>` | مجلد الإدخال | `Docs` |
| `--output=<مسار>` | مجلد الإخراج | `output` |
| `--html, -h` | توليد ملفات HTML | `false` |
| `--numerals, -n` | تحويل الأرقام إلى عربية | `false` |
| `--no-recursive` | عدم البحث في المجلدات الفرعية | `false` |
| `--help, -?` | عرض المساعدة | - |

### أمثلة

```bash
# معالجة الملفات فقط
npm run process

# معالجة الملفات وتوليد HTML
npm run process:docs

# معالجة مع تحويل الأرقام
node index.js --dir=Docs --output=output --html --numerals
```

## البنية

```
.
├── Docs/                          # مجلد الملفات المصدرية
│   ├── رياضيات/
│   │   └── mathematic_12th/
│   │       ├── markdown.md
│   │       └── pages/
│   ├── فيزياء/
│   ├── كيمياء/
│   ├── احياء/
│   └── قراءة وبلاغة ونصوص/
├── output/                        # مجلد الملفات المعالجة
│   └── [نفس بنية Docs]
├── index.js                       # السكريبت الرئيسي
├── package.json                   # إعدادات المشروع
└── README.md                      # هذا الملف
```

## الميزات التقنية

### معالجة المعادلات

- **معادلات منفصلة (Display Math)**: `$$...$$`
- **معادلات مضمنة (Inline Math)**: `$...$`
- إضافة علامات RTL للمعادلات
- دعم كامل لـ LaTeX

### إعدادات MathJax

التطبيق يضيف إعدادات MathJax التالية:

```javascript
{
    tex: {
        packages: ['base', 'ams', 'noerrors', 'noundefined'],
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true,
        tags: 'ams',
        tagSide: 'right',  // ترقيم المعادلات على اليمين
        tagIndent: '0.8em',
        useLabelIds: true
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
}
```

### تنسيق HTML

عند توليد HTML، يتم إضافة:
- اتجاه RTL للصفحة
- خطوط عربية مناسبة
- تنسيقات CSS للمعادلات
- دعم كامل للعناوين والجداول والقوائم

## المكتبات المستخدمة

- **marked**: لتحويل Markdown إلى HTML
- **MathJax**: لعرض المعادلات الرياضية

## ملاحظات

1. الملفات Markdown الناتجة تحتوي على إعدادات MathJax في البداية
2. ملفات HTML تحتوي على جميع الإعدادات اللازمة في الرأس
3. المعادلات الرياضية تبقى بصيغة LaTeX الأصلية
4. يمكن فتح ملفات HTML مباشرة في المتصفح

## الترخيص

MIT

## المراجع

- [arabic-mathjax](https://github.com/OmarIthawi/arabic-mathjax) - الحزمة المرجعية للدعم العربي في MathJax
- [MathJax Documentation](https://docs.mathjax.org/)