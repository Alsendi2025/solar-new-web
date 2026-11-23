import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Package, MessageCircle, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import { Container, Badge, Spinner, EmptyState } from '../components/ui';
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
  specs?: Record<string, string>;
  in_stock?: boolean;
}

const CAT_LABEL: Record<string, string> = {
  panel: 'لوح شمسي',
  battery: 'بطارية',
  inverter: 'عاكس',
  charge_controller: 'منظم شحن',
  cable: 'كابل',
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : [];
        setProduct(list.find((p: Product) => String(p.id) === String(id)) ?? null);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!product) return <div className="py-12"><Container><EmptyState title="المنتج غير موجود" action={<Link to="/products" className="text-teal-600 hover:underline">العودة إلى السوق</Link>} /></Container></div>;

  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحباً، أرغب في عرض سعر وتوفر المنتج: ${product.name} (${product.brand})`)}`;

  const specs: { label: string; value: string }[] = [];
  if (product.power_w) specs.push({ label: 'القدرة', value: `${product.power_w} W` });
  if (product.voltage_v) specs.push({ label: 'الجهد', value: `${product.voltage_v} V` });
  if (product.capacity_ah) specs.push({ label: 'السعة', value: `${product.capacity_ah} Ah` });
  if (product.capacity_wh) specs.push({ label: 'الطاقة', value: `${product.capacity_wh} Wh` });
  if (product.current_a) specs.push({ label: 'التيار', value: `${product.current_a} A` });
  if (product.specs) Object.entries(product.specs).forEach(([k, v]) => specs.push({ label: k, value: String(v) }));

  return (
    <div className="py-10">
      <Container>
        <Link to="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
          <ArrowRight className="h-4 w-4" /> سوق الطاقة الشمسية
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300"><Package className="h-20 w-20" /></div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Badge color="slate">{product.brand}</Badge>
              <Badge color="teal">{CAT_LABEL[product.category] ?? product.category}</Badge>
              {product.in_stock !== false && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> متوفر
                </span>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">{product.name}</h1>
            <p className="mt-4 text-3xl font-extrabold text-teal-700">{formatCurrency(product.price_yer)}</p>
            <p className="mt-1 text-xs text-slate-400">السعر تقديري — للحصول على السعر النهائي اطلب عرض سعر رسمي.</p>

            {product.description && (
              <p className="mt-5 text-sm leading-relaxed text-slate-600">{product.description}</p>
            )}

            {specs.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map((s, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0">
                        <td className="bg-slate-50/60 px-4 py-2.5 font-medium text-slate-500">{s.label}</td>
                        <td className="px-4 py-2.5 font-semibold text-slate-800" dir="ltr">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-600">
                <MessageCircle className="h-4 w-4" /> اطلب عرض سعر رسمي
              </a>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700">
                <FileText className="h-4 w-4" /> نموذج طلب
              </Link>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
              <span>المنصة وسيط تجاري — تصلك عروض الأسعار من موردين موثوقين دون تواصل مباشر مع التجار.</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}