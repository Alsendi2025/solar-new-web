import type { ApplianceResult } from '../../lib/solarEngine';
import { formatEnergy } from '../../lib/format';

export default function EnergyChart({ breakdown }: { breakdown: ApplianceResult[] }) {
  const max = Math.max(...breakdown.map((b) => b.energyWh), 1);
  const total = breakdown.reduce((s, b) => s + b.energyWh, 0);
  const colors = ['#0d9488', '#0891b2', '#2563eb', '#7c3aed', '#d97706', '#059669', '#dc2626', '#0284c7'];

  if (!breakdown.length) return null;

  return (
    <div className="space-y-3">
      {breakdown.map((b, i) => (
        <div key={`${b.name}-${i}`}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">
              {b.name} <span className="text-slate-400">×{b.qty}</span>
            </span>
            <span className="font-semibold text-slate-700" dir="ltr">{formatEnergy(b.energyWh)}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(b.energyWh / max) * 100}%`,
                backgroundColor: colors[i % colors.length],
              }}
            />
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
        <span className="font-semibold text-slate-700">إجمالي الاستهلاك اليومي</span>
        <span className="font-bold text-teal-700" dir="ltr">{formatEnergy(total)}</span>
      </div>
    </div>
  );
}