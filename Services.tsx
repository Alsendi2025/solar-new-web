import { Link } from 'react-router-dom';
import { Gauge, LineChart, Layers, FileText, Store, Wrench, ArrowLeft, CheckCircle2, Calculator } from 'lucide-react';
import { Container, SectionHeading } from '../components/ui';

const SERVICES = [
  {
    icon: Gauge,
    title: 'دراسة الأحمال الكهربائية',
    desc: 'تحليل تفصيلي لاستهلاك كل جهاز كهربائي (القدرة × ساعات التشغيل) لتحديد الاحتياج اليومي بالكيلوواط/ساعة وقدرة الذروة، وأساس متين لكل تصميم هندسي.',
    items: ['جرد الأحمال الكهربائية', 'حساب الطاقة اليومية (Wh)', 'تحديد قدرة الذروة وتيار البدء', 'تحليل ملف تعريف الأحمال'],
  },
  {
    icon: LineChart,
    title: 'التصميم العكسي للمواصفات',
    desc: 'ننطلق من احتياجك الفعلي لنستخرج المواصفات الفنية الدقيقة لكل مكوّن (Specification-Driven Reverse Design) بدلاً من فرض منتج جاهز.',
    items: ['تحديد المتطلبات الهندسية', 'استخراج مواصفات فنية دقيقة', 'مطابقة المواصفات مع السوق', 'ضمان التوافق الهندسي'],
  },
  {
    icon: Layers,
    title: 'اختيار المكونات آلياً',
    desc: 'خوارزمية اختيار ذكية تطابق المتطلبات الهندسية مع قاعدة بيانات المنتجات المتاحة، دون إلزام ماركة تجارية محددة — الأفضل أداءً وتكلفة.',
    items: ['مطابقة هندسية ذكية', 'بدائل متعددة لكل مكوّن', 'مقارنة الأداء والتكلفة', 'قائمة مشتريات (BoM)'],
  },
  {
    icon: FileText,
    title: 'التقارير الفنية والقوائم',
    desc: 'تقارير تصميم شاملة تتضمن الحسابات، التحقق الهندسي، المواصفات، وقوائم المشتريات — قابلة للتصدير والطباعة.',
    items: ['تقرير تصميم كامل', 'قائمة مشتريات تفصيلية', 'مخططات أحمال ومصفوفات', 'تصدير PDF'],
  },
  {
    icon: Store,
    title: 'الوساطة التجارية',
    desc: 'ننسّق طلبات عروض الأسعار مع الموردين والشركات نيابةً عنك، ونحافظ على سرية التواصل التجاري لحماية مصالحك.',
    items: ['تجميع عروض الأسعار', 'مقارنة الخيارات', 'التفاوض بالنيابة عنك', 'ضمان الجودة'],
  },
  {
    icon: Wrench,
    title: 'التنفيذ والإشراف',
    desc: 'إشراف هندسي على التنفيذ والتركيب والتشغيل، والتأكد من مطابقة المنظومة للتصميم المعتمد.',
    items: ['إشراف على التركيب', 'اختبار وتشغيل', 'مطابقة التصميم', 'تسليم المنظومة'],
  },
];

export default function Services() {
  return (
    <div className="py-12">
      <Container>
        <SectionHeading
          eyebrow="الخدمات الهندسية والاستشارية"
          title="حلول متكاملة لكل مراحل منظومتك الشمسية"
          description="نقدم خدمات فنية واستشارية متخصصة ترافقك من دراسة الاحتياج حتى التشغيل — بأيدٍ هندسية خبيرة ومحتوى تعليمي موثوق."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {SERVICES.map((s) => (
            <div key={s.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-bold text-slate-800">{s.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">{s.desc}</p>
              <ul className="mt-4 space-y-2">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-500" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-l from-slate-900 to-slate-800 p-8 sm:p-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-white">جرّب الحاسبة أولاً.. ثم استشر مهندسينا</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                احسب منظومتك بنفسك واحصل على تصميم مبدئي، ثم اطلب مراجعة هندسية وتنسيق عروض الأسعار.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/calculator" className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-bold text-white hover:bg-teal-400">
                <Calculator className="h-4 w-4" /> احسب الآن
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 text-sm font-semibold text-white hover:border-teal-400 hover:text-teal-300">
                اطلب استشارة <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}