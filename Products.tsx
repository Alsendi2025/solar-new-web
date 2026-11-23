import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, MessageCircle, SlidersHorizontal } from 'lucide-react';
import { Container, SectionHeading, Badge, Spinner, EmptyState } from '../components/ui';
import { formatCurrency } from '../lib/format';
import { WHATSAPP_NUMBER } from '../lib/constants';

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  power_w?: number;
  capacity_ah?: number;
  capacity_wh?: number;
  voltage_v?: number;
  current_a?: number;
  price_yer?: number;
  image_url?: string;
  description?: string;
  in_stock?: boolean;
}

const CATEGORIES = [
  { value: 'all', label: 'كل المكونات' },
  { value: 'panel', label: 'ألواح شمسية' },
  { value: 'battery', label: 'بطاريات' },
  { value: 'inverter', label: 'عواكس' },
  { value: 'charge_controller', label: 'منظمات شحن' },
  { value: 'cable', label: 'كابلات' },
];

function specLine(p: Product): string {
  if (p.power_w) return `${p.power_w}W`;
  if (p.capacity_wh) return `${p.capacity_wh}Wh`;
  if (p.capacity_ah) return `${p.capacity_ah}Ah${p.voltage_v ? ` / ${p.voltage_v}V` : ''}`;
  if (p.current_a) return `${p.current_a}A`;
  return '';
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cat !== 'all') params.set('category', cat);
    if (search) params.set('search', search);
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [cat, search]);

  return (
    <div className="py-12">
      <Container>
        <SectionHeading
          eyebrow="سوق الطاقة الشمسية"
          title="تصفح المكونات والم المنتجات الشمسية"
          description="قاعدة معلومات فنية واسعة للألواح والبطاريات والعواكس والمنظمات. اختر ما يناسبك واطلب عرض سعر رسمي عبر المنصة."
        />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCat(c.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  cat === c.value ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-teal-300'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="relative sm:w-64">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-9 pl-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <Spinner />
          ) : products.length === 0 ? (
            <EmptyState title="لا توجد منتجات مطابقة" description="جرّب تغيير كلمات البحث أو التصنيف." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <div key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
                  <Link to={`/products/${p.id}`} className="block aspect-[4/3] overflow-hidden bg-slate-100">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300"><Package className="h-10 w-10" /></div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center justify-between">
                      <Badge color="slate">{p.brand}</Badge>
                      {p.in_stock !== false && <span className="text-[11px] font-medium text-emerald-600">متوفر</span>}
                    </div>
                    <Link to={`/products/${p.id}`} className="mt-2 line-clamp-1 text-sm font-bold text-slate-800 group-hover:text-teal-700">{p.name}</Link>
                    <p className="mt-1 text-xs text-slate-400" dir="ltr">{specLine(p)}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="text-sm font-bold text-teal-700">{formatCurrency(p.price_yer)}</span>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحباً، أرغب في معرفة سعر وتوفر: ${p.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> طلب سعر
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs text-blue-700">
          <SlidersHorizontal className="mt-0.5 h-4 w-4 shrink-0" />
          <span>الأسعار تقديرية للاستئناس فقط وقد تتغير حسب السوق والكمية. المنصة هي نقطة الاتصال التجارية المركزية — لا يتم التواصل المباشر مع التجار.</span>
        </div>
      </Container>
    </div>
  );
}