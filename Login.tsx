import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Sun } from 'lucide-react';
import supabase from '../lib/supabase';
import { signInWithGoogle } from '../lib/googleAuth';
import { Container } from '../components/ui';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('بيانات الدخول غير صحيحة. تحقق من البريد وكلمة المرور.');
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <Container className="max-w-md">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
              <Sun className="h-8 w-8" />
            </span>
            <h1 className="mt-4 text-xl font-extrabold text-slate-900">لوحة الإدارة</h1>
            <p className="mt-1 text-sm text-slate-500">سجّل الدخول لإدارة الطلبات والمشاريع والمنتجات.</p>
          </div>

          <form onSubmit={handleEmail} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">البريد الإلكتروني</span>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  placeholder="admin@solar.ye"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pr-9 pl-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">كلمة المرور</span>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  dir="ltr"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pr-9 pl-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </label>
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-teal-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-teal-500/20 hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" /> {loading ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs text-slate-400">أو</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <button
            onClick={() => signInWithGoogle('طاقة بلس')}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            الدخول عبر Google
          </button>

          <p className="mt-6 rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-500">
            حساب تجريبي للإدارة: <span dir="ltr" className="font-semibold">admin@solar.ye</span> / <span dir="ltr" className="font-semibold">password123</span>
          </p>
        </div>
      </Container>
    </div>
  );
}