import { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, Plus, Trash2, Info, Zap } from 'lucide-react';
import { YEMEN_CITIES } from '../../lib/constants';
import {
  DEFAULT_ASSUMPTIONS, USAGE_TYPES, BATTERY_TYPES, SYSTEM_TYPES, MARKET_WATTAGES,
  type UsageType, type BatteryType, type SystemType,
} from '../../lib/designEngine';
import type { ManualAppliance, MethodOutput } from './types';

let uid = 1;
const nid = () => `m${uid++}`;

const COMMON: Omit<ManualAppliance, 'id'>[] = [
  { name: 'إضاءة LED', qty: 8, powerW: 10, unit: 'W', hours: 5, period: 'night' },
  { name: 'مروحة سقف', qty: 3, powerW: 60, unit: 'W', hours: 8, period: 'night' },
  { name: 'ثلاجة', qty: 1, powerW: 150, unit: 'W', hours: 8, period: '24h' },
  { name: 'تلفاز', qty: 1, powerW: 90, unit: 'W', hours: 6, period: 'night' },
  { name: 'مكيف هواء سبليت', qty: 1, powerW: 1200, unit: 'W', hours: 6, period: 'day' },
  { name: 'غسالة', qty: 1, powerW: 500, unit: 'W', hours: 1, period: 'day' },
  { name: 'مضخة مياه', qty: 1, powerW: 0.75, unit: 'kW', hours: 2, period: 'day' },
  { name: 'كمبيوتر / لابتوب', qty: 1, powerW: 120, unit: 'W', hours: 6, period: 'day' },
  { name: 'راوتر إنترنت', qty: 1, powerW: 15, unit: 'W', hours: 24, period: '24h' },
  { name: 'ميكروويف', qty: 1, powerW: 1000, unit: 'W', hours: 1, period: 'day' },
  { name: 'سخان ماء', qty: 1, powerW: 1500, unit: 'W', hours: 2, period: 'day' },
  { name: 'إضاءة متجر', qty: 10, powerW: 20, unit: 'W', hours: 8, period: 'day' },
  { name: 'ماكينة خياطة', qty: 1, powerW: 300, unit: 'W', hours: 6, period: 'day' },
  { name: 'مضخة ري زراعية', qty: 1, powerW: 2.2, unit: 'kW', hours: 4, period: 'day' },
  { name: 'حاسوب مكتبي', qty: 2, powerW: 200, unit: 'W', hours: 8, period: 'day' },
  { name: 'طابعة / ناسخة', qty: 1, powerW: 300, unit: 'W', hours: 3, period: 'day' },
];

const PERIODS: { value: ManualAppliance['period']; label: string }[] = [
  { value: 'day', label: 'نهاراً' },
  { value: 'night', label: 'ليلاً' },
  { value: '24h', label: '24 ساعة' },
];

function periodHours(p: ManualAppliance['period']): number[] {
  if (p === 'day') return [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  if (p === 'night') return [18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5];
  return Array.from({ length: 24 }, (_, i) => i);
}

function buildWeights(appliances: ManualAppliance[]): number[] {
  const w = new Array(24).fill(0);
  for (const a of appliances) {
    const energy = a.qty * a.powerW * a.hours;
    if (energy <= 0) continue;
    const hrs = periodHours(a.period);
    const per = energy / hrs.length;
    for (const h of hrs) w[h] += per;
  }
  return w;
}

export default function MethodManual({ onOutput }: { onOutput: (o: MethodOutput) => void }) {
  const [city, setCity] = useState('صنعاء');
  const [usageType, setUsageType] = useState<UsageType>('home');
  const [appliances, setAppliances] = useState<ManualAppliance[]>([
    { ...COMMON[0], id: nid() },
    { ...COMMON[2], id: nid() },
    { ...COMMON[3], id: nid() },
    { ...COMMON[8], id: nid() },
  ]);
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<'simultaneous' | 'alternating'>('simultaneous');
  const [batteryType, setBatteryType] = useState<BatteryType>('lifepo4');
  const [systemType, setSystemType] = useState<SystemType>('solar-battery');
  const [autonomyHours, setAutonomyHours] = useState(12);
  const [panelWattage, setPanelWattage] = useState(500);

  const dailyEnergyWh = useMemo(
    () => appliances.reduce((s, a) => s + a.qty * a.powerW * a.hours, 0),
    [appliances]
  );

  const peakLoadW = useMemo(() => {
    if (mode === 'alternating') {
      return appliances.reduce((m, a) => Math.max(m, a.qty * a.powerW), 0);
    }
    return appliances.reduce((s, a) => s + a.qty * a.powerW, 0);
  }, [appliances, mode]);

  const weights = useMemo(() => buildWeights(appliances), [appliances]);
  const psh = YEMEN_CITIES.find((c) => c.name === city)?.psh ?? 5.9;

  useEffect(() => {
    onOutput({
      city,
      psh,
      dailyEnergyWh,
      peakLoadW,
      usageType,
      hourlyWeights: weights,
      batteryType,
      systemType,
      autonomyHours,
      panelWattage,
      assumptions: DEFAULT_ASSUMPTIONS,
      methodLabel: 'الحساب اليدوي التفصيلي',
      ready: dailyEnergyWh > 0,
    });
  }, [city, psh, dailyEnergyWh, peakLoadW, usageType, weights, batteryType, systemType, autonomyHours, panelWattage, onOutput]);

  const update = (id: string, patch: Partial<ManualAppliance>) =>
    setAppliances((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const remove = (id: string) => setAppliances((prev) => prev.filter((a) => a.id !== id));
  const add = (p: Omit<ManualAppliance, 'id'>) => setAppliances((prev) => [...prev, { ...p, id: nid() }]);

  const filtered = COMMON.filter((c) => c.name.includes(search) && !appliances.some((a) => a.name === c.name));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700">
            <MapPin className="h-4 w-4 text-teal-600" /> الموقع / المدينة
          </span>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400">
            {YEMEN_CITIES.map((c) => <option key={c.name} value={c.name}>{c.name} — {c.psh} PSH</option>)}
          </select>
          <span className="mt-1 block text-[11px] text-slate-400">تحديد الإشعاع الشمسي ودرجة الحرارة والفواقد.</span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">نوع الاستخدام</span>
          <select value={usageType} onChange={(e) => setUsageType(e.target.value as UsageType)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400">
            {Object.entries(USAGE_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>

      {/* قائمة الأجهزة */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Zap className="h-4 w-4 text-teal-600" /> الأجهزة الكهربائية
          </h3>
          <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700" dir="ltr">
            {(dailyEnergyWh / 1000).toFixed(2)} kWh/يوم
          </span>
        </div>

        <div className="space-y-2">
          {appliances.length === 0 && (
            <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-400">أضف جهازاً من القائمة أدناه أو أضف جهازاً مخصصاً.</p>
          )}
          {appliances.map((a) => {
            const displayPower = a.unit === 'kW' ? a.powerW / 1000 : a.powerW;
            return (
              <div key={a.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <div className="flex items-center gap-2">
                  <input value={a.name} onChange={(e) => update(a.id, { name: e.target.value })} className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-800 outline-none focus:border-teal-400" />
                  <button onClick={() => remove(a.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <label className="block">
                    <span className="mb-0.5 block text-[11px] text-slate-400">العدد</span>
                    <input type="number" min={1} value={a.qty} onChange={(e) => update(a.id, { qty: Math.max(1, Number(e.target.value)) })} dir="ltr" className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-sm outline-none focus:border-teal-400" />
                  </label>
                  <label className="block">
                    <span className="mb-0.5 block text-[11px] text-slate-400">القدرة</span>
                    <div className="flex">
                      <input type="number" min={0} step={a.unit === 'kW' ? 0.05 : 1} value={displayPower} onChange={(e) => { const v = Math.max(0, Number(e.target.value)); update(a.id, { powerW: a.unit === 'kW' ? v * 1000 : v }); }} dir="ltr" className="w-full rounded-r-lg border border-slate-200 bg-white px-2 py-1 text-center text-sm outline-none focus:border-teal-400" />
                      <select value={a.unit} onChange={(e) => { const u = e.target.value as 'W' | 'kW'; update(a.id, { unit: u, powerW: u === 'kW' ? a.powerW / 1000 : a.powerW }); }} className="rounded-l-lg border border-r-0 border-slate-200 bg-white px-1 text-xs outline-none">
                        <option value="W">W</option>
                        <option value="kW">kW</option>
                      </select>
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-0.5 block text-[11px] text-slate-400">ساعات/يوم</span>
                    <input type="number" min={0} max={24} step={0.5} value={a.hours} onChange={(e) => update(a.id, { hours: Math.max(0, Number(e.target.value)) })} dir="ltr" className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-sm outline-none focus:border-teal-400" />
                  </label>
                  <label className="block">
                    <span className="mb-0.5 block text-[11px] text-slate-400">فترة التشغيل</span>
                    <select value={a.period} onChange={(e) => update(a.id, { period: e.target.value as ManualAppliance['period'] })} className="w-full rounded-lg border border-slate-200 bg-white px-1.5 py-1 text-center text-sm outline-none focus:border-teal-400">
                      {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* البحث والإضافة */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن جهاز شائع لإضافته..." className="w-full rounded-xl border border-slate-200 py-2 pr-9 pl-3 text-sm outline-none focus:border-teal-400" />
          </div>
          {filtered.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {filtered.slice(0, 8).map((c) => (
                <button key={c.name} onClick={() => add(c)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-teal-300 hover:text-teal-700">
                  + {c.name}
                </button>
              ))}
            </div>
          )}
          <button onClick={() => add({ name: 'جهاز جديد', qty: 1, powerW: 100, unit: 'W', hours: 4, period: 'day' })} className="mt-2 inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700">
            <Plus className="h-3.5 w-3.5" /> إضافة جهاز مخصص
          </button>
        </div>
      </div>

      {/* التشغيل المتزامن/المتناوب */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-2 text-sm font-bold text-slate-800">كيف تعمل الأجهزة؟</h3>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setMode('simultaneous')} className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${mode === 'simultaneous' ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-500'}`}>
            تعمل معاً (ذروة أعلى)
          </button>
          <button onClick={() => setMode('alternating')} className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${mode === 'alternating' ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-500'}`}>
            بالتناوب (لا تعمل كلها)
          </button>
        </div>
        <div className="mt-2 flex items-start gap-2 rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-500">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>قدرة الذروة المقدّرة: <b dir="ltr">{Math.round(peakLoadW)} W</b> — {mode === 'simultaneous' ? 'مجموع قدرات كل الأجهزة (احتمال تشغيلها معاً)' : 'أكبر جهاز واحد (تشغيل متناوب)'}.</span>
        </div>
      </div>

      {/* البطاريات والنظام */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-bold text-slate-800">إعدادات النظام والبطاريات</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">نوع البطارية</span>
            <select value={batteryType} onChange={(e) => setBatteryType(e.target.value as BatteryType)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400">
              {Object.entries(BATTERY_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">ساعات الاستقلالية</span>
            <input type="number" min={0} max={72} value={autonomyHours} onChange={(e) => setAutonomyHours(Math.max(0, Number(e.target.value)))} dir="ltr" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">نوع النظام</span>
            <select value={systemType} onChange={(e) => setSystemType(e.target.value as SystemType)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400">
              {Object.entries(SYSTEM_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">قدرة اللوح (واط)</span>
            <select value={panelWattage} onChange={(e) => setPanelWattage(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400">
              {MARKET_WATTAGES.map((w) => <option key={w} value={w}>{w}W</option>)}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}