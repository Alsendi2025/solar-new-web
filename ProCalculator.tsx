import { Gauge, Info } from 'lucide-react';
import { Container } from '../components/ui';
import CalculatorWorkspace from '../components/calculator/CalculatorWorkspace';

export default function ProCalculator() {
  return (
    <div className="py-8">
      <Container>
        <header className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-sm font-semibold text-white">
            <Gauge className="h-4 w-4 text-teal-400" /> الحاسبة الاحترافية — وضع المهندس
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">حاسبة المنظومات الاحترافية</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            تحكم كامل في معاملات التصميم: ساعات الذروة الشمسية، الكفاءات، الفواقد، المعاملات
            الكهربائية للألواح، إعدادات البطارية، وتحليل الكابلات وهبوط الجهد — مع تحقق هندسي تفصيلي.
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>هذا الوضع مخصص للمهندسين والفنيين. القيم الافتراضية مضبوطة مبدئياً — عدّلها حسب ظروف مشروعك.</span>
          </div>
        </header>
        <CalculatorWorkspace mode="pro" />
      </Container>
    </div>
  );
}