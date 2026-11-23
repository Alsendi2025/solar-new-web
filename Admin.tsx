import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, FolderKanban, Package, BookOpen, LogOut,
  Plus, Trash2, RefreshCw, Phone, MapPin, Calendar, X, Save, Pencil,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Container, Badge, Spinner, EmptyState } from '../components/ui';
import { formatDate, formatNumber } from '../lib/format';

interface Quote {
  id: number;
  name: string;
  phone: string;
  city: string;
  service_type: string;
  details: string;
  status: string;
  created_at: string;
}
interface Project {
  id: number;
  name: string;
  city: string;
  daily_energy_wh: number;
  array_wattage: number;
  num_panels: number;
  num_batteries: number;
  created_at: string;
}
interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price_yer: number;
  power_w?: number;
  capacity_ah?: number;
  voltage_v?: number;
  current_a?: number;
}
interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  created_at: string;
}

const STATUS: Record<string, { label: string; color: 'amber' | 'blue' | 'teal' | 'slate' }> = {
  new: { label: 'جديد', color: 'amber' },
  contacted: { label: 'تم التواصل', color: 'blue' },
  quoted: { label: 'تم التسعير', color: 'teal' },
  closed: { label: 'مغلق', color: 'slate' },
};

const TABS = [
  { key: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { key: 'quotes', label: 'طلبات العروض', icon: MessageSquare },
  { key: 'projects', label: 'المشاريع', icon: FolderKanban },
  { key: 'products', label: 'المنتجات', icon: Package },
  { key: 'articles', label: 'المقالات', icon: BookOpen },
];

export default function Admin() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // forms
  const [showProductForm, setShowProductForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [productForm, setProductForm] = useState({ name: '', brand: '', category: 'panel', price_yer: '', power_w: '', voltage_v: '', capacity_ah: '', current_a: '', description: '' });
  const [articleForm, setArticleForm] = useState({ title: '', slug: '', category: 'أساسيات الطاقة الشمسية', excerpt: '', content: '', read_time: '5' });

  const fetchAll = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [q, p, pr, a] = await Promise.all([
        fetch('/api/quote-requests').then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/articles').then((r) => r.json()),
      ]);
      setQuotes(Array.isArray(q) ? q : []);
      setProjects(Array.isArray(p) ? p : []);
      setProducts(Array.isArray(pr) ? pr : []);
      setArticles(Array.isArray(a) ? a : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const updateQuoteStatus = async (id: number, status: string) => {
    await fetch('/api/quote-requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
  };

  const deleteQuote = async (id: number) => {
    if (!confirm('حذف هذا الطلب؟')) return;
    await fetch('/api/quote-requests', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  const deleteProject = async (id: number) => {
    if (!confirm('حذف هذا المشروع؟')) return;
    await fetch('/api/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: Record<string, unknown> = { name: productForm.name, brand: productForm.brand, category: productForm.category, description: productForm.description };
    if (productForm.price_yer) body.price_yer = Number(productForm.price_yer);
    if (productForm.power_w) body.power_w = Number(productForm.power_w);
    if (productForm.voltage_v) body.voltage_v = Number(productForm.voltage_v);
    if (productForm.capacity_ah) body.capacity_ah = Number(productForm.capacity_ah);
    if (productForm.current_a) body.current_a = Number(productForm.current_a);
    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      const created = await res.json();
      setProducts((prev) => [...prev, created]);
      setShowProductForm(false);
      setProductForm({ name: '', brand: '', category: 'panel', price_yer: '', power_w: '', voltage_v: '', capacity_ah: '', current_a: '', description: '' });
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('حذف هذا المنتج؟')) return;
    await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      title: articleForm.title,
      slug: articleForm.slug || articleForm.title.replace(/\s+/g, '-'),
      category: articleForm.category,
      excerpt: articleForm.excerpt,
      content: articleForm.content,
      read_time: Number(articleForm.read_time) || 5,
      published: true,
      author: 'فريق طاقة بلس الهندسي',
    };
    const res = await fetch('/api/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      const created = await res.json();
      setArticles((prev) => [created, ...prev]);
      setShowArticleForm(false);
      setArticleForm({ title: '', slug: '', category: 'أساسيات الطاقة الشمسية', excerpt: '', content: '', read_time: '5' });
    }
  };

  const deleteArticle = async (id: number) => {
    if (!confirm('حذف هذا المقال؟')) return;
    await fetch('/api/articles', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleArticle = async (a: Article) => {
    const res = await fetch('/api/articles', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: a.id, published: !a.published }) });
    if (res.ok) setArticles((prev) => prev.map((x) => (x.id === a.id ? { ...x, published: !x.published } : x)));
  };

  if (loading) return <Spinner label="جارٍ تحميل لوحة الإدارة..." />;

  return (
    <div className="py-8">
      <Container>
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">لوحة الإدارة</h1>
            <p className="text-sm text-slate-500">مرحباً {user?.email}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => fetchAll(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-teal-300">
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> تحديث
            </button>
            <button onClick={() => { signOut(); navigate('/login'); }} className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4" /> خروج
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === t.key ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-teal-300'
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
              {t.key === 'quotes' && quotes.filter((q) => q.status === 'new').length > 0 && (
                <span className="rounded-full bg-amber-400 px-1.5 text-[10px] font-bold text-white">{quotes.filter((q) => q.status === 'new').length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'إجمالي الطلبات', value: quotes.length, icon: MessageSquare, color: 'from-teal-500 to-cyan-500' },
                { label: 'طلبات جديدة', value: quotes.filter((q) => q.status === 'new').length, icon: Phone, color: 'from-amber-500 to-orange-500' },
                { label: 'المشاريع المحفوظة', value: projects.length, icon: FolderKanban, color: 'from-blue-600 to-indigo-600' },
                { label: 'المنتجات', value: products.length, icon: Package, color: 'from-emerald-500 to-green-600' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white`}>
                    <s.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-2xl font-extrabold text-slate-900" dir="ltr">{formatNumber(s.value)}</p>
                  <p className="text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-slate-800">أحدث الطلبات</h3>
              {quotes.length === 0 ? (
                <EmptyState title="لا توجد طلبات بعد" />
              ) : (
                <div className="space-y-2">
                  {quotes.slice(0, 5).map((q) => (
                    <div key={q.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{q.name} <span className="text-xs font-normal text-slate-400">· {q.service_type}</span></p>
                        <p className="text-xs text-slate-400">{q.city} · {formatDate(q.created_at)}</p>
                      </div>
                      <Badge color={STATUS[q.status]?.color ?? 'slate'}>{STATUS[q.status]?.label ?? q.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quotes */}
        {tab === 'quotes' && (
          <div className="space-y-3">
            {quotes.length === 0 ? (
              <EmptyState title="لا توجد طلبات عروض" description="ستظهر هنا طلبات العملاء الواردة من الموقع." />
            ) : (
              quotes.map((q) => (
                <div key={q.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-800">{q.name}</h3>
                        <Badge color={STATUS[q.status]?.color ?? 'slate'}>{STATUS[q.status]?.label ?? q.status}</Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /><span dir="ltr">{q.phone}</span></span>
                        {q.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{q.city}</span>}
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(q.created_at)}</span>
                        <Badge color="blue">{q.service_type}</Badge>
                      </div>
                      {q.details && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{q.details}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <select
                        value={q.status}
                        onChange={(e) => updateQuoteStatus(q.id, e.target.value)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium outline-none focus:border-teal-400"
                      >
                        {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                      <button onClick={() => deleteQuote(q.id)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" /> حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Projects */}
        {tab === 'projects' && (
          <div>
            {projects.length === 0 ? (
              <EmptyState title="لا توجد مشاريع محفوظة" description="احفظ مشروعاً من الحاسبة ليظهر هنا." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-bold text-slate-800">{p.name}</h3>
                      <button onClick={() => deleteProject(p.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{p.city} · {formatDate(p.created_at)}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-slate-50 p-2"><span className="text-slate-400">استهلاك</span><p className="font-bold text-slate-800" dir="ltr">{formatNumber(p.daily_energy_wh ?? 0)} Wh</p></div>
                      <div className="rounded-lg bg-slate-50 p-2"><span className="text-slate-400">الألواح</span><p className="font-bold text-slate-800" dir="ltr">{p.num_panels ?? 0}</p></div>
                      <div className="rounded-lg bg-slate-50 p-2"><span className="text-slate-400">البطاريات</span><p className="font-bold text-slate-800" dir="ltr">{p.num_batteries ?? 0}</p></div>
                      <div className="rounded-lg bg-slate-50 p-2"><span className="text-slate-400">المصفوفة</span><p className="font-bold text-slate-800" dir="ltr">{formatNumber(p.array_wattage ?? 0)} W</p></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setShowProductForm(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
                <Plus className="h-4 w-4" /> إضافة منتج
              </button>
            </div>

            {showProductForm && (
              <form onSubmit={addProduct} className="rounded-2xl border border-teal-200 bg-teal-50/40 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">إضافة منتج جديد</h3>
                  <button type="button" onClick={() => setShowProductForm(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <input required placeholder="اسم المنتج" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400" />
                  <input required placeholder="الماركة" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400" />
                  <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400">
                    <option value="panel">لوح شمسي</option>
                    <option value="battery">بطارية</option>
                    <option value="inverter">عاكس</option>
                    <option value="charge_controller">منظم شحن</option>
                    <option value="cable">كابل</option>
                  </select>
                  <input type="number" placeholder="السعر (ر.ي)" value={productForm.price_yer} onChange={(e) => setProductForm({ ...productForm, price_yer: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400" dir="ltr" />
                  <input type="number" placeholder="القدرة (W)" value={productForm.power_w} onChange={(e) => setProductForm({ ...productForm, power_w: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400" dir="ltr" />
                  <input type="number" placeholder="الجهد (V)" value={productForm.voltage_v} onChange={(e) => setProductForm({ ...productForm, voltage_v: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400" dir="ltr" />
                  <input type="number" placeholder="السعة (Ah)" value={productForm.capacity_ah} onChange={(e) => setProductForm({ ...productForm, capacity_ah: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400" dir="ltr" />
                  <input type="number" placeholder="التيار (A)" value={productForm.current_a} onChange={(e) => setProductForm({ ...productForm, current_a: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400" dir="ltr" />
                  <input placeholder="وصف مختصر" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400 sm:col-span-2" />
                </div>
                <button type="submit" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
                  <Save className="h-4 w-4" /> حفظ المنتج
                </button>
              </form>
            )}

            {products.length === 0 ? (
              <EmptyState title="لا توجد منتجات" />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500">
                    <tr>
                      <th className="px-4 py-3 text-right font-medium">المنتج</th>
                      <th className="px-4 py-3 text-right font-medium">الماركة</th>
                      <th className="px-4 py-3 text-right font-medium">الفئة</th>
                      <th className="px-4 py-3 text-left font-medium">السعر</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t border-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                        <td className="px-4 py-3 text-slate-500">{p.brand}</td>
                        <td className="px-4 py-3 text-slate-500">{p.category}</td>
                        <td className="px-4 py-3 text-left font-semibold text-teal-700">{p.price_yer ? formatNumber(p.price_yer) : '—'}</td>
                        <td className="px-4 py-3 text-left">
                          <button onClick={() => deleteProduct(p.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Articles */}
        {tab === 'articles' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setShowArticleForm(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
                <Plus className="h-4 w-4" /> إضافة مقال
              </button>
            </div>

            {showArticleForm && (
              <form onSubmit={addArticle} className="rounded-2xl border border-teal-200 bg-teal-50/40 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">إضافة مقال جديد</h3>
                  <button type="button" onClick={() => setShowArticleForm(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input required placeholder="عنوان المقال" value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400 sm:col-span-2" />
                  <input placeholder="الرابط (slug)" value={articleForm.slug} onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400" dir="ltr" />
                  <select value={articleForm.category} onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400">
                    <option>أساسيات الطاقة الشمسية</option>
                    <option>تصميم المنظومات</option>
                    <option>البطاريات والتخزين</option>
                    <option>العواكس والمنظمات</option>
                    <option>صيانة وتشغيل</option>
                  </select>
                  <input placeholder="ملخص (excerpt)" value={articleForm.excerpt} onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400 sm:col-span-2" />
                  <textarea required rows={6} placeholder="محتوى المقال (كل سطر = فقرة)" value={articleForm.content} onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400 sm:col-span-2" />
                  <input type="number" placeholder="دقائق القراءة" value={articleForm.read_time} onChange={(e) => setArticleForm({ ...articleForm, read_time: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400" dir="ltr" />
                </div>
                <button type="submit" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
                  <Save className="h-4 w-4" /> حفظ المقال
                </button>
              </form>
            )}

            {articles.length === 0 ? (
              <EmptyState title="لا توجد مقالات" />
            ) : (
              <div className="space-y-2">
                {articles.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{a.title}</h3>
                      <p className="text-xs text-slate-400">{a.category} · {formatDate(a.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleArticle(a)} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${a.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {a.published ? 'منشور' : 'مخفي'}
                      </button>
                      <button onClick={() => deleteArticle(a.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}