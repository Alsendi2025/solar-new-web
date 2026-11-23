import { Calculator as CalcIcon, Info } from 'lucide-react';
import { Container } from '../components/ui';
import CalculatorWorkspace from '../components/calculator/CalculatorWorkspace';

export default function Calculator() {
  return (
    <div className="py-8">
      <Container>
        <header className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1 text-sm font-semibold text-teal-700">
            <CalcIcon className="h-4 w-4" /> حاسبة المنظومات — الوضع المبسط
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">احسب منظومتك الشمسية الآن</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            أدخل أحمالك الكهربائية وبعض الإعدادات الأساسية، وسيقوم محرك الحسابات الهندسية بتصميم
            المنظومة لك تلقائياً مع التحقق الهندسي واختيار المكونات. للمزيد من التحكم استخدم
            <a href="/pro-calculator" className="mx-1 font-semibold text-teal-600 hover:underline">الحاسبة الاحترافية</a>.
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>النتائج تُحسب لحظياً أثناء التعديل. يمكنك حفظ المشروع أو تصدير التقرير الفني الكامل بصيغة PDF.</span>
          </div>
        </header>
        <CalculatorWorkspace mode="basic" />
      </Container>
    </div>
  );
}