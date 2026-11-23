import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, MessageCircle, CheckCircle2, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { Container, SectionHeading } from '../components/ui';
import { YEMEN_CITIES, SERVICE_CATEGORIES, WHATSAPP_NUMBER } from '../lib/constants';

interface LocationState {
  summary?: string;
  city?: string;
}

export default function Contact() {
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: state.city ?? '',
    service_type: 'تصميم منظومة',
    details: state.summary ?? '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const update = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.phone.trim()) {
      setError('يرجى إدخال الاسم ورقم الهاتف على الأقل.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('فشل الإرسال');
      setDone(true);
    } catch (e) {
      setError('تعذّر إرسال الطلب. حاول مرة أخرى أو تواصل عبر واتساب.');
    } finally {
      setSubmitting(false);
    }
  };

  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `مرحباً، أرغب في ${form.service_type}. الاسم: ${form.name || '—'}، المدينة: ${form.city || '—'}`
  )}`;

  return (
    <div className="py-12">
      <Container>
        <SectionHeading
          eyebrow="التواصل الرسمي"
          title="اطلب عرض سعر أو استشارة فنية"
          description="أخبرنا باحتياجك وسيتواصل معك فريقنا الهندسي. المنصة هي نقطة الاتصال التجارية المركزية بينك وبين الموردين."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Form */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            {done ? (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h3 className="mt-4 text-xl font-bold text-slate-800">تم استلام طلبك بنجاح</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  وصل طلبك إلى لوحة الإدارة وسيتواصل معك فريقنا في أقرب وقت. يمكنك أيضاً التواصل معنا مباشرة عبر واتساب.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
                    <MessageCircle className="h-4 w-4" /> واتساب
                  </a>
                  <button
                    onClick={() => {
                      setDone(false);
                      setForm({ name: '', phone: '', city: '', service_type: 'تصميم منظومة', details: '' });
                    }}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-teal-300"
                  >
                    طلب جديد
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">الاسم الكامل *</span>
                    <input
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      required
                      placeholder="اسمك الكريم"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">رقم الهاتف *</span>
                    <input
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      required
                      dir="ltr"
                      placeholder="7XXXXXXXX"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">المدينة</span>
                    <select
                      value={form.city}
                      onChange={(e) => update('city', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    >
                      <option value="">اختر المدينة</option>
                      {YEMEN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">نوع الخدمة</span>
                    <select
                      value={form.service_type}
                      onChange={(e) => update('service_type', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    >
                      {SERVICE_CATEGORIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">تفاصيل إضافية</span>
                  <textarea
                    value={form.details}
                    onChange={(e) => update('details', e.target.value)}
                    rows={4}
                    placeholder="اشرح احتياجك، الأجهزة التي تريد تشغيلها، أو أي تفاصيل فنية..."
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                  />
                </label>
                {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-teal-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-teal-500/20 transition hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" /> {submitting ? 'جارٍ الإرسال...' : 'إرسال الطلب'}
                </button>
                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-500" /> خصوصيتك محفوظة — لا تتم مشاركة بياناتك مع التجار مباشرة.
                </p>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800">قنوات التواصل الرسمية</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Phone className="h-5 w-5" /></span>
                  <div>
                    <p className="text-xs text-slate-400">واتساب / هاتف</p>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" dir="ltr" className="font-semibold text-slate-800 hover:text-teal-600">+{WHATSAPP_NUMBER}</a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Mail className="h-5 w-5" /></span>
                  <div>
                    <p className="text-xs text-slate-400">البريد الإلكتروني</p>
                    <span dir="ltr" className="font-semibold text-slate-800">info@energyplus.ye</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><MapPin className="h-5 w-5" /></span>
                  <div>
                    <p className="text-xs text-slate-400">الموقع</p>
                    <span className="font-semibold text-slate-800">صنعاء، الجمهورية اليمنية</span>
                  </div>
                </li>
              </ul>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
                <MessageCircle className="h-4 w-4" /> تواصل معنا عبر واتساب
              </a>
            </div>

            <div className="rounded-2xl border border-teal-100 bg-teal-50 p-6">
              <h3 className="flex items-center gap-2 text-sm font-bold text-teal-800">
                <ShieldCheck className="h-4 w-4" /> لماذا نتوسط؟
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-teal-700">
                نحافظ على شفافية السوق ونضمن لك أفضل الأسعار وأعلى جودة. تصلك عروض الأسعار من موردين
                موثوقين دون أي تواصل مباشر، حفاظاً على مصالحك وسرية بياناتك.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}