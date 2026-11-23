import { Link } from 'react-router-dom';
import { Sun, Mail, MapPin, Phone } from 'lucide-react';
import { Container } from './ui';
import { WHATSAPP_NUMBER } from '../lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-300">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                <Sun className="h-6 w-6" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-base font-extrabold text-white">طاقة بلس</span>
                <span className="text-[11px] font-medium text-teal-400">Solar Engineering Platform</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              منصة هندسية متخصصة في الطاقة الشمسية للسوق اليمني — تصميم، حساب، توريد، واستشارة فنية موثوقة.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-white">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/design" className="hover:text-teal-400">تصميم المنظومات</Link></li>
              <li><Link to="/products" className="hover:text-teal-400">سوق الطاقة الشمسية</Link></li>
              <li><Link to="/services" className="hover:text-teal-400">الخدمات الهندسية</Link></li>
              <li><Link to="/knowledge" className="hover:text-teal-400">مركز المعرفة</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-white">خدماتنا</h4>
            <ul className="space-y-2 text-sm">
              <li>دراسة الأحمال الكهربائية</li>
              <li>التصميم العكسي للمواصفات</li>
              <li>اختيار المكونات آلياً</li>
              <li>إعداد التقارير الفنية</li>
              <li>الوساطة التجارية مع الموردين</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-white">التواصل الرسمي</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-400" />
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" dir="ltr" className="hover:text-teal-400">
                  +{WHATSAPP_NUMBER}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-400" />
                <span dir="ltr">info@energyplus.ye</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-400" />
                <span>صنعاء، الجمهورية اليمنية</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} طاقة بلس — جميع الحقوق محفوظة.</p>
          <p>المنصة هي نقطة الاتصال التجارية المركزية — لا يتم التواصل المباشر مع التجار.</p>
        </div>
      </Container>
    </footer>
  );
}