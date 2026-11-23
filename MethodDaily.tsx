import { useEffect, useState } from 'react';
import { MapPin, Zap, Info } from 'lucide-react';
import { YEMEN_CITIES } from '../../lib/constants';
import { DEFAULT_ASSUMPTIONS, USAGE_TYPES, type UsageType } from '../../lib/designEngine';
import AdvancedOptions from './AdvancedOptions';
import type { AdvancedSettings, MethodOutput } from './types';

const DEFAULT_ADV: AdvancedSettings = {
  batteryType: 'lifepo4',
  systemType: 'solar-battery',
  autonomyHours: 12,
  panelWattage: 500,
};

export default function MethodDaily({ onOutput }: { onOutput: (o: MethodOutput) => void }) {
  const [city, setCity] = useState('صنعاء');
  const [dailyKwh, setDailyKwh] = useState(5);
  const [usageType, setUsageType] = useState<UsageType>('home');
  const [adv, setAdv] = useState<AdvancedSettings>(DEFAULT_ADV);

  const psh = YEMEN_CITIES.find((c) => c.name === city)?.psh ?? 5.9;
  const dailyEnergyWh = Math.max(0, dailyKwh) * 1000;
  const peakLoadW = (dailyEnergyWh / 24) * DEFAULT_ASSUMPTIONS.peakFactor;

  useEffect(() => {
    onOutput({
      city,
      psh,
      dailyEnergyWh,
      peakLoadW,
      usageType,
      batteryType: adv.batteryType,
      systemType: adv.systemType,
      autonomyHours: adv.autonomyHours,
      panelWattage: adv.panelWattage,
      assumptions: DEFAULT_ASSUMPTIONS,
      methodLabel: 'حسب الاستهلاك اليومي',
      ready: dailyEnergyWh > 0,
    });
  }, [city, dailyEnergyWh, peakLoadW, usageType, adv, onOutput]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700">
            <MapPin className="h-4 w-4 text-teal-600" /> المدينة / المنطقة
          </span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400"
          >
            {YEMEN_CITIES.map((c) => (
              <option key={c.name} value={c.name}>{c.name} — {c.psh} PSH</option>
            ))}
          </select>
          <span className="mt-1 block text-[11px] text-slate-400">لتحديد الإشعاع الشمسي وفواقد الحرارة.</span>
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700">
            <Zap className="h-4 w-4 text-teal-600" /> متوسط الاستهلاك اليومي
          </span>
          <div className="relative">
            <input
              type="number"
              min={0}
              step={0.5}
              value={dailyKwh}
              onChange={(e) => setDailyKwh(Math.max(0, Number(e.target.value)))}
              dir="ltr"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-12 pr-3 text-sm outline-none focus:border-teal-400"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">kWh</span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-400">متوسط ما تستهلكه الأجهزة طاقةً خلال 24 ساعة.</span>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">نوع الاستخدام</span>
          <select
            value={usageType}
            onChange={(e) => setUsageType(e.target.value as UsageType)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400"
          >
            {Object.entries(USAGE_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-[11px] text-blue-700">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          قدرة الذروة تُقدّر تلقائياً من متوسط الاستهلاك (معامل ذروة {DEFAULT_ASSUMPTIONS.peakFactor}). للحصول على
          ذروة دقيقة حسب الأجهزة، استخدم «الحساب اليدوي التفصيلي».
        </span>
      </div>

      <AdvancedOptions value={adv} onChange={setAdv} />
    </div>
  );
}