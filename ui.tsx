import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'start';
}) {
  return (
    <div className={`${align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}`}>
      {eyebrow && (
        <span className="inline-block mb-3 rounded-full bg-teal-50 px-4 py-1 text-sm font-semibold text-teal-700 ring-1 ring-teal-100">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      {description && <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-500">{description}</p>}
    </div>
  );
}

export function Badge({ children, color = 'teal' }: { children: ReactNode; color?: 'teal' | 'blue' | 'amber' | 'slate' | 'green' }) {
  const colors: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-700 ring-teal-100',
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    slate: 'bg-slate-100 text-slate-600 ring-slate-200',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${colors[color]}`}>
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  accent = 'teal',
}: {
  label: string;
  value: string;
  unit?: string;
  icon?: ReactNode;
  accent?: 'teal' | 'blue' | 'amber' | 'slate' | 'green';
}) {
  const accents: Record<string, string> = {
    teal: 'from-teal-500 to-cyan-500',
    blue: 'from-blue-600 to-indigo-600',
    amber: 'from-amber-500 to-orange-500',
    slate: 'from-slate-600 to-slate-700',
    green: 'from-emerald-500 to-green-600',
  };
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {icon && (
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${accents[accent]} text-white`}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900" dir="ltr">
        {value}
        {unit && <span className="mr-1 text-sm font-medium text-slate-400">{unit}</span>}
      </p>
    </div>
  );
}

export function Spinner({ label = 'جارٍ التحميل...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
      <p className="text-lg font-semibold text-slate-700">{title}</p>
      {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function WhatsAppButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
    >
      {children}
    </a>
  );
}

export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
      {children}
    </Link>
  );
}