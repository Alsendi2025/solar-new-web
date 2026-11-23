import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Calculator, LayoutDashboard } from 'lucide-react';
import { Container } from './ui';

const NAV_LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/design', label: 'تصميم المنظومات' },
  { to: '/products', label: 'سوق الطاقة الشمسية' },
  { to: '/services', label: 'الخدمات الهندسية' },
  { to: '/knowledge', label: 'مركز المعرفة' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-500/20">
              <Sun className="h-6 w-6" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-extrabold text-slate-900">طاقة بلس</span>
              <span className="text-[11px] font-medium text-teal-600">Solar Engineering Platform</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive || (link.to !== '/' && location.pathname.startsWith(link.to))
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
            >
              <LayoutDashboard className="h-4 w-4" />
              لوحة الإدارة
            </Link>
            <Link
              to="/design"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-l from-teal-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-500/20 transition hover:from-teal-700 hover:to-cyan-700"
            >
              <Calculator className="h-4 w-4" />
              صمّم منظومتك
            </Link>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="القائمة"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <Container className="py-3">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  to="/design"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Calculator className="h-4 w-4" /> صمّم الآن
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
                >
                  <LayoutDashboard className="h-4 w-4" /> الإدارة
                </Link>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}