import { Plus, Trash2, Zap } from 'lucide-react';
import type { Appliance } from '../../lib/solarEngine';
import { APPLIANCE_PRESETS } from '../../lib/constants';

let uid = 100;
const nextId = () => `a${uid++}`;

export default function ApplianceEditor({
  appliances,
  onChange,
}: {
  appliances: Appliance[];
  onChange: (a: Appliance[]) => void;
}) {
  const update = (id: string, patch: Partial<Appliance>) =>
    onChange(appliances.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const remove = (id: string) => onChange(appliances.filter((a) => a.id !== id));

  const addPreset = (preset: Omit<Appliance, 'id'>) =>
    onChange([...appliances, { ...preset, id: nextId() }]);

  const addCustom = () =>
    onChange([...appliances, { id: nextId(), name: 'جهاز جديد', qty: 1, powerW: 100, hoursPerDay: 4 }]);

  const totalWh = appliances.reduce((s, a) => s + a.qty * a.powerW * a.hoursPerDay, 0);

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <span className="text-teal-600"><Zap className="h-4 w-4" /></span>
          الأحمال الكهربائية
        </h3>
        <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700" dir="ltr">
          {totalWh.toLocaleString('en-US')} Wh/يوم
        </span>
      </div>

      <div className="space-y-2">
        {appliances.map((a) => (
          <div key={a.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
            <div className="flex items-center gap-2">
              <input
                value={a.name}
                onChange={(e) => update(a.id, { name: e.target.value })}
                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-800 outline-none focus:border-teal-400"
              />
              <button
                onClick={() => remove(a.id)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                aria-label="حذف"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <label className="block">
                <span className="mb-0.5 block text-[11px] text-slate-400">العدد</span>
                <input
                  type="number"
                  min={1}
                  value={a.qty}
                  onChange={(e) => update(a.id, { qty: Math.max(1, Number(e.target.value)) })}
                  dir="ltr"
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-sm outline-none focus:border-teal-400"
                />
              </label>
              <label className="block">
                <span className="mb-0.5 block text-[11px] text-slate-400">القدرة (W)</span>
                <input
                  type="number"
                  min={0}
                  value={a.powerW}
                  onChange={(e) => update(a.id, { powerW: Math.max(0, Number(e.target.value)) })}
                  dir="ltr"
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-sm outline-none focus:border-teal-400"
                />
              </label>
              <label className="block">
                <span className="mb-0.5 block text-[11px] text-slate-400">ساعات/يوم</span>
                <input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={a.hoursPerDay}
                  onChange={(e) => update(a.id, { hoursPerDay: Math.max(0, Number(e.target.value)) })}
                  dir="ltr"
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-sm outline-none focus:border-teal-400"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={addCustom}
          className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-700"
        >
          <Plus className="h-3.5 w-3.5" /> جهاز مخصص
        </button>
        {APPLIANCE_PRESETS.filter(
          (p) => !appliances.some((a) => a.name === p.name)
        ).map((p) => (
          <button
            key={p.name}
            onClick={() => addPreset(p)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-teal-300 hover:text-teal-700"
          >
            + {p.name}
          </button>
        ))}
      </div>
    </section>
  );
}