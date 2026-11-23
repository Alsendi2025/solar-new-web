import { type ReactNode } from 'react';

export function NumberField({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
        <span>{label}</span>
        {unit && <span className="text-xs font-normal text-slate-400">{unit}</span>}
      </span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : ''}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        dir="ltr"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
      />
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

export function FieldGroup({ title, icon, children, cols = 2 }: { title: string; icon?: ReactNode; children: ReactNode; cols?: number }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
        {icon && <span className="text-teal-600">{icon}</span>}
        {title}
      </h3>
      <div className={`grid gap-4 ${cols === 1 ? '' : cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {children}
      </div>
    </section>
  );
}