![img-203.jpeg](img-203.jpeg)

الوحدة السابعة

# تكامل الدوال الكسرية

٥ - ٧

تدريب

أوجد $‫\left\lfloor \frac{m \cdot s}{m^2 - 5} \right\rfloor‬$‫ .

لاشك أنك قد توصلت للحل وهو ‬$‫\frac{1}{2}‬$‫ لو ‬$‫\left| m^2 - 5 \right| + \varepsilon‬$‫ ، ونلاحظ هنا أن الدالة الكسرية قد احتوت على بسط هو عبارة عن مشتقة المقام نفسه ( وقد يكون مضروباً في عدد حقيقي ) .

في هذا البند سوف تتعرف على تكامل دوال كسرية ( لا يكون بسطها هو مشتقة المقام ) مختلفة .
أولاً : إذا كانت درجة البسط أصغر من درجة المقام ، والمقام يحلل إلى حاصل ضرب عوامله الأولية من الدرجة الأولى ( غير مكررة ) .

نضع الكسر ‬$‫\frac{\text{هـ}(m)}{\text{م}(m)}‬$‫ بالصورة :

‬$‫\frac{\text{هـ}(m)}{\text{م}(m)} = \frac{\text{هـ}(m)}{(m - \text{م}^1)(m - \text{م}^2) \dots (m - \text{م}^s)}‬$‫ .

ونقوم بتجزئة المقام في الطرف الأيسر إلى صورة مجموع كسور جزئية كالتالي :

‬$‫\frac{\text{هـ}(m)}{\text{م}(m)} = \frac{1}{m - \text{م}^1} + \frac{1}{m - \text{م}^2} + \dots + \frac{1}{m - \text{م}^s}‬$‫ .

ثم نوجد قيم الثوابت ‬$‫1, 1, 1, \dots, 1‬$‫ وبالتالي يمكننا أن نجري التكامل على النحو الآتي :

‬$‫\left\lfloor \frac{\text{هـ}(m)}{\text{م}(m)} \right\rfloor = \left\lfloor \frac{1}{m - \text{م}^1} \right\rfloor + \left\lfloor \frac{1}{m - \text{م}^2} \right\rfloor + \dots + \left\lfloor \frac{1}{m - \text{م}^s} \right\rfloor + \dots‬$‫ .

مثال (٧ - ٢٦)

أوجد ‬$‫\left\lfloor \frac{m^2}{(m^2 - 1)(m - 2)} \right\rfloor‬$‫ .

الحل : ‬$‫\therefore \left\lfloor \frac{m^2}{(m - 1)(m + 1)(m - 2)} \right\rfloor‬$‫ .

نجزئ المقام على الصورة :

‬$‫\frac{m^2}{(m - 1)(m + 1)(m - 2)} = \frac{1}{m - 1} + \frac{1}{m + 1} + \frac{1}{m - 2} \dots \dots \dots (1)‬$

نوحد مقامات الطرف الأيسر كما يلي :

٢٤٤

http://www.e-learning-moe.edu.ye/