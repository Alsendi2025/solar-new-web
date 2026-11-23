import { type ReactNode, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">{children ?? <Outlet />}</main>
      <Footer />
    </div>
  );
}