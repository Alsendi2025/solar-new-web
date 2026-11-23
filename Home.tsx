import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sun, Calculator, Store, ArrowLeft, CheckCircle2, Zap, BatteryCharging,
  Cpu, FileText, ShieldCheck, LineChart, Wrench, BookOpen, MessageCircle,
  Users, Layers, Gauge, Sparkles, ChevronLeft, Package, TrendingUp,
} from 'lucide-react';
import { Container, SectionHeading, Badge } from '../components/ui';
import { WHATSAPP_NUMBER } from '../lib/constants';
import { formatCurrency } from '../lib/format';

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  power_w?: number;
  capacity_ah?: number;
  capacity_wh?: number;
  voltage_v?: number;
  price_yer?: number;
  image_url?: string;
  description?: string;
}
interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  cover_image?: string;
  read_time?: number;
}

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const SERVICES = [
  { icon: Gauge, title: 'دراسة الأحمال الكهربائية', desc: 'تحليل دقيق لاستهلاك الأجهزة وتحديد الاحتياج الفعلي بالكيلوواط/ساعة.' },
  { icon: LineChart, title: 'التصميم العكسي للمواصفات', desc: 'انطلاقاً من احتياجك، نستخرج المواصفات الفنية الدقيقة لكل مكوّن.' },
  { icon: Layers, title: 'اختيار المكونات آلياً', desc: 'مطابقة هندسية ذكية دون إلزام ماركة تجارية — الأفضل أداءً وتكلفة.' },
  { icon: FileText, title: 'التقارير الفنية والقوائم', desc: 'تقارير تصميم شاملة وقوائم مشتريات (BoM) قابلة للتصدير.' },
  { icon: Store, title: 'الوساطة التجارية', desc: 'ننسّق عروض الأسعار مع الموردين والشركات ونحافظ على مصالحك.' },
  { icon: Wrench, title: 'التنفيذ والتركيب', desc: 'إشراف هندسي على التنفيذ وتركيب المنظومة وفق أعلى المعايير.' },
];

const STEPS = [
  { icon: MessageCircle, title: 'أخبرنا باحتياجك', desc: 'أدخل أحمالك الكهربائية أو تواصل معنا لدراسة احتياجك.' },
  { icon: Calculator, title: 'نحسب المصمم هندسياً', desc: 'محرك الحسابات يحدد العاكس والبطاريات والألواح والكابلات بدقة.' },
  { icon: Package, title: 'نختار المكونات', desc: 'اختيار تلقائي للمكونات المناسبة من قاعدة بيانات فنية واسعة.' },
  { icon: FileText, title: 'تقرير فني وتسعير', desc: 'تستلم تقريراً شاملاً وقائمة مشتريات مع عروض أسعار من موردين موثوقين.' },
  { icon: CheckCircle2, title: 'التنفيذ والتشغيل', desc: 'تركيب احترافي واختبار وتسليم المنظومة جاهزة للعمل.' },
];

const WHY = [
  { icon: ShieldCheck, title: 'دقة هندسية موثوقة', desc: 'محرك حسابات مستقل مبني على معادلات هندسية معتمدة وقابلة للتحقق.' },
  { icon: Sparkles, title: 'تصميم مخصص 100%', desc: 'لا أرقام ثابتة — كل منظومة تُحسب حسب ظروفك واستهلاكك الفعلي.' },
  { icon: Users, title: 'وسيط موثوق', desc: 'نقف بينك وبين السوق لحماية مصالحك وضمان جودة المكونات والأسعار.' },
  { icon: TrendingUp, title: 'شفافية كاملة', desc: 'تعرف بالضبط لماذا اخترنا كل مكوّن وما هي مواصفاته وتكلفته.' },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('/api/products?limit=4').then((r) => r.json()).then((d) => Array.isArray(d) && setProducts(d)).catch(() => {});
    fetch('/api/articles?limit=3').then((r) => r.json()).then((d) => Array.isArray(d) && setArticles(d)).catch(() => {});
  }, []);

  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً، أرغب في استشارة فنية حول منظومة طاقة شمسية')}`;

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img src="/images/hero-solar.jpg" alt="حقل طاقة شمسية" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/85 to-slate-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        </div>

        <Container className="relative py-20 sm:py-24 lg:py-28">
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.12 }}
            className="max-w-3xl"
          >
            <motion.div variants={fade} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-sm font-medium text-teal-300">
                <Sun className="h-4 w-4" /> منصة هندسية متخصصة في الطاقة الشمسية — السوق اليمني
              </span>
            </motion.div>

            <motion.h1
              variants={fade}
              transition={{ duration: 0.5 }}
              className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl"
            >
              حلول الطاقة الشمسية
              <span className="block bg-gradient-to-l from-teal-300 to-cyan-300 bg-clip-text text-transparent">
                تبدأ من الحساب الصحيح
              </span>
            </motion.h1>

            <motion.p
              variants={fade}
              transition={{ duration: 0.5 }}
              className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              منصة هندسية تساعدك في تحديد احتياجاتك، تصميم منظومتك الشمسية، استخراج المواصفات
              الفنية، واختيار المكونات المناسبة — بدقة هندسية موثوقة وبدون إلزام ماركة تجارية.
            </motion.p>

            <motion.div variants={fade} transition={{ duration: 0.5 }} className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/design"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-teal-500 to-cyan-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition hover:from-teal-400 hover:to-cyan-400"
              >
                <Calculator className="h-5 w-5" /> احسب منظومتك الآن
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/50 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-teal-400 hover:text-teal-300"
              >
                <Store className="h-5 w-5" /> استكشف سوق الطاقة الشمسية
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                تعرّف على خدماتنا <ArrowLeft className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div variants={fade} transition={{ duration: 0.5 }} className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-slate-700/60 pt-6">
              {[
                { v: '+1,200', l: 'منظومة مصممة' },
                { v: '98%', l: 'دقة الحسابات' },
                { v: '24/7', l: 'محرك الحساب' },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-xl font-extrabold text-white sm:text-2xl" dir="ltr">{s.v}</p>
                  <p className="mt-1 text-xs text-slate-400">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="start"
                eyebrow="نبذة عن المنصة"
                title="هندسة تسبق المنتج.. ودقة تصنع الفرق"
                description="طاقة بلس منصة رقمية متخصصة تجمع بين الحسابات الهندسية، التصميم العكسي للمواصفات، وقاعدة معلومات فنية للمنتجات. نؤدي دور الوسيط الفني والتجاري بين العميل والموردين والشركات، لنضمن لك منظومة مصممة بدقة ومكوّنات مناسبة دون التقيّد بماركة واحدة."
              />
              <div className="mt-6 flex flex-wrap gap-2">
                {['حسابات هندسية مستقلة', 'تصميم spec-driven', 'قاعدة منتجات فنية', 'وساطة تجارية موثوقة'].map((t) => (
                  <Badge key={t} color="teal">{t}</Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Calculator, label: 'محرك حسابات هندسي', val: 'مستقل' },
                { icon: BatteryCharging, label: 'أنظمة تخزين BESS', val: 'LiFePO4' },
                { icon: Cpu, label: 'عواكس ومنظمات', val: 'MPPT' },
                { icon: FileText, label: 'تقارير فنية', val: 'BoM' },
              ].map((f) => (
                <div key={f.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-sm font-bold text-slate-800">{f.label}</p>
                  <p className="text-xs text-slate-400" dir="ltr">{f.val}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="كيف تعمل المنصة" title="من الفكرة إلى المنظومة في خطوات واضحة" description="مسار هندسي وتجاري متكامل يضمن لك قراراً مبنياً على المعرفة لا على التخمين." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fade}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <span className="absolute left-4 top-4 text-3xl font-black text-slate-100" dir="ltr">{i + 1}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-bold text-slate-800">{s.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= CALCULATOR TEASER ================= */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-l from-slate-900 to-slate-800 shadow-xl">
            <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge color="teal">المنتج الأساسي</Badge>
                <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
                  حاسبة المنظومات الشمسية — دقة هندسية في كل رقم
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  محرك حسابات مستقل يحسب لك: العاكس، بطاريات BESS، مصفوفة الألواح، الكابلات، وقواطع الحماية —
                  مع التحقق الهندسي الآلي واختيار المكونات المناسبة من قاعدة البيانات.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/design" className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-400">
                    <Calculator className="h-4 w-4" /> ابدأ التصميم
                  </Link>
                  <Link to="/design" className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:border-teal-400 hover:text-teal-300">
                    <Gauge className="h-4 w-4" /> كل مسارات التصميم
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Sun, t: 'ألواح', d: 'توصيل وأحجام' },
                  { icon: BatteryCharging, t: 'بطاريات', d: 'استقلالية وDoD' },
                  { icon: Cpu, t: 'عاكس', d: 'قدرة واندفاع' },
                  { icon: Zap, t: 'كابلات', d: 'هبوط جهد' },
                ].map((x) => (
                  <div key={x.t} className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
                    <x.icon className="h-5 w-5 text-teal-400" />
                    <p className="mt-2 text-sm font-bold text-white">{x.t}</p>
                    <p className="text-xs text-slate-400">{x.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      {products.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading align="start" eyebrow="سوق الطاقة الشمسية" title="أهم المكونات والمنتجات" description="قاعدة معلومات فنية واسعة تساعدك على فهم الخيارات المتاحة واختيار الأنسب." />
              <Link to="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
                كل المنتجات <ChevronLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <Link key={p.id} to={`/products/${p.id}`} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300"><Package className="h-10 w-10" /></div>
                    )}
                  </div>
                  <div className="p-4">
                    <Badge color="slate">{p.brand}</Badge>
                    <h3 className="mt-2 line-clamp-1 text-sm font-bold text-slate-800">{p.name}</h3>
                    <p className="mt-1 text-xs text-slate-400" dir="ltr">
                      {p.power_w ? `${p.power_w}W` : p.capacity_wh ? `${p.capacity_wh}Wh` : p.capacity_ah ? `${p.capacity_ah}Ah` : ''}
                    </p>
                    <p className="mt-2 text-sm font-bold text-teal-700">{formatCurrency(p.price_yer)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ================= SERVICES ================= */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="الخدمات الهندسية" title="حلول متكاملة لكل مراحل منظومتك" description="خدمات فنية واستشارية مصممة لترافقك من الدراسة حتى التشغيل." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fade}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-800">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= LATEST ARTICLES ================= */}
      {articles.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading align="start" eyebrow="مركز المعرفة" title="أحدث المقالات والاستشارات الفنية" />
              <Link to="/knowledge" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
                كل المقالات <ChevronLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <Link key={a.id} to={`/knowledge/${a.slug}`} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    {a.cover_image ? (
                      <img src={a.cover_image} alt={a.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300"><BookOpen className="h-10 w-10" /></div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <Badge color="teal">{a.category}</Badge>
                      {a.read_time && <span className="text-xs text-slate-400">{a.read_time} دقيقة قراءة</span>}
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-base font-bold text-slate-800 group-hover:text-teal-700">{a.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">{a.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ================= WHY US ================= */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="لماذا طاقة بلس؟" title="أربع ركائز تجعلنا الخيار الهندسي الأمثل" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                  <w.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-bold text-slate-800">{w.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{w.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= CONSULTATION CTA ================= */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-l from-teal-600 to-cyan-600 shadow-xl">
            <div className="grid gap-6 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-white sm:text-3xl">جاهز لتصميم منظومتك؟</h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-teal-50">
                  احصل على استشارة فنية مجانية أو اطلب عرض سعر رسمي. المنصة هي نقطة الاتصال التجارية
                  المركزية — لا تواصل مباشر مع التجار.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50">
                  <FileText className="h-4 w-4" /> طلب عرض سعر
                </Link>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-400">
                  <MessageCircle className="h-4 w-4" /> تواصل عبر واتساب
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}