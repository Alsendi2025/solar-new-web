import { Link } from 'react-router-dom';
import {
  Zap, Gauge, Wrench, ArrowLeft, CheckCircle2, Clock, Calculator,
  Receipt, SlidersHorizontal, Sparkles,
} from 'lucide-react';
import { Container } from '../components/ui';

const METHODS = [
  { icon: Zap, label: 'حسب الاستهلاك اليومي' },
  { icon: Receipt, label: 'حسب الفاتورة' },
  { icon: SlidersHorizontal, label: 'حساب يدوي تفصيلي' },
];

export default function Design() {
  return (
    <div className="py-10">
      <Container>
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1 text-sm font-semibold text-teal-700">
            <Sparkles className="h-4 w-4" /> قلب المنصة
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">تصميم المنظومات</h1>
          <p className="mt-3 text-base leading-relaxed text-slate-500">
            اختر المسار الذي يناسبك لتصميم منظومتك الشمسية. الحساب العادي متاح الآن بالكامل،
            والمسارات الاحترافية قيد التطوير.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* البطاقة 1 — متاحة بالكامل */}
          <div className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-teal-200 bg-white p-6 shadow-lg shadow-teal-500/5 lg:col-span-1">
            <div className="absolute left-4 top-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> متاح الآن
              </span>
            </div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-500/20">
              <Calculator className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-xl font-extrabold text-slate-900">حساب المنظومات العادية</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              للمنازل والمنشآت الصغيرة. ثلاث طرق سهلة للحساب مع تقرير فني موحّد وتحقق هندسي.
            </p>

            <ul className="mt-4 space-y-2">
              {METHODS.map((m) => (
                <li key={m.label} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600"><m.icon className="h-4 w-4" /></span>
                  {m.label}
                </li>
              ))}
            </ul>

            <Link
              to="/design/normal"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-teal-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-teal-500/20 transition hover:from-teal-700 hover:to-cyan-700"
            >
              ابدأ التصميم الآن <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          {/* البطاقة 2 — قريباً */}
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="absolute left-4 top-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                <Clock className="h-3 w-3" /> قريباً
              </span>
            </div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Gauge className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-xl font-extrabold text-slate-900">حساب المنظومات الاحترافي</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              وضع هندسي متقدم للمهندسين والفنيين: معاملات دقيقة، سيناريوهات متعددة، وتحليل تفصيلي
              للمكونات والتوافق.
            </p>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-400">
              واجهة مجهّزة بأيقونة مخصصة — تفاصيل الحساب والمراحل قيد التطوير.
            </div>
            <button
              disabled
              className="mt-6 inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-400"
            >
              <Clock className="h-4 w-4" /> قيد التطوير
            </button>
          </div>

          {/* البطاقة 3 — قريباً */}
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="absolute left-4 top-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                <Clock className="h-3 w-3" /> قريباً
              </span>
            </div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20">
              <Wrench className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-xl font-extrabold text-slate-900">تطوير منظومة قائمة</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              لتوسعة أو تحديث منظومة شمسية قائمة: تحليل الوضع الحالي، الأعطال، ورفع الكفاءة
              وإضافة مكونات.
            </p>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-400">
              واجهة مجهّزة بأيقونة مخصصة — تفاصيل التحليل والمراحل قيد التطوير.
            </div>
            <button
              disabled
              className="mt-6 inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-400"
            >
              <Clock className="h-4 w-4" /> قيد التطوير
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center text-xs leading-relaxed text-blue-700">
          جميع الحسابات تصدر عن محرك تصميم هندسي مستقل، وتُعد تقديرات مبدئية قابلة للتحقق تحتاج مراجعة مهندس مختص قبل التنفيذ.
        </div>
      </Container>
    </div>
  );
}