import { useState } from 'react';
import { Settings2, ChevronDown } from 'lucide-react';
import { BATTERY_TYPES, SYSTEM_TYPES, MARKET_WATTAGES, type BatteryType, type SystemType } from '../../lib/designEngine';
import type { AdvancedSettings } from './types';

export default function AdvancedOptions({
  value,
  onChange,
}: {
  value: AdvancedSettings;
  onChange: (v: AdvancedSettings) => void;
}) {
  const [open, setOpen] = useState(false);
  const set = <K extends keyof AdvancedSettings>(k: K, v: AdvancedSettings[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-sm font-bold text-slate-700"
      >
        <span className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-teal-600" /> خيارات متقدمة (اختياري)
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="grid gap-4 border-t border-slate-100 p-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">نوع البطارية</span>
            <select
              value={value.batteryType}
              onChange={(e) => set('batteryType', e.target.value as BatteryType)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400"
            >
              {Object.entries(BATTERY_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">نوع النظام</span>
            <select
              value={value.systemType}
              onChange={(e) => set('systemType', e.target.value as SystemType)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400"
            >
              {Object.entries(SYSTEM_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">ساعات الاستقلالية</span>
            <input
              type="number"
              min={0}
              max={72}
              value={value.autonomyHours}
              onChange={(e) => set('autonomyHours', Math.max(0, Number(e.target.value)))}
              dir="ltr"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400"
            />
            <span className="mt-1 block text-[11px] text-slate-400">كم ساعة تريد أن تعمل المنظومة دون إنتاج شمسي.</span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">قدرة اللوح (واط)</span>
            <select
              value={value.panelWattage}
              onChange={(e) => set('panelWattage', Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400"
            >
              {MARKET_WATTAGES.map((w) => (
                <option key={w} value={w}>{w}W</option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}