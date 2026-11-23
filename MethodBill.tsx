import { useEffect, useRef, useState } from 'react';
import { MapPin, Receipt, Upload, Info, AlertCircle, X, FileText } from 'lucide-react';
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

type Period = 'weekly' | 'monthly' | 'custom';
type InputMode = 'consumption' | 'amount';

export default function MethodBill({ onOutput }: { onOutput: (o: MethodOutput) => void }) {
  const [city, setCity] = useState('صنعاء');
  const [period, setPeriod] = useState<Period>('monthly');
  const [customDays, setCustomDays] = useState(30);
  const [mode, setMode] = useState<InputMode>('amount');
  const [consumptionKwh, setConsumptionKwh] = useState(150);
  const [amount, setAmount] = useState(15000);
  const [pricePerKwh, setPricePerKwh] = useState(100);
  const [variable, setVariable] = useState<'constant' | 'variable'>('constant');
  const [usageType, setUsageType] = useState<UsageType>('home');
  const [adv, setAdv] = useState<AdvancedSettings>(DEFAULT_ADV);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const days = period === 'weekly' ? 7 : period === 'monthly' ? 30 : Math.max(1, customDays);

  let totalKwh = 0;
  if (mode === 'consumption') totalKwh = Math.max(0, consumptionKwh);
  else totalKwh = pricePerKwh > 0 ? Math.max(0, amount) / pricePerKwh : 0;

  const safetyMargin = variable === 'variable' ? 0.2 : 0;
  const dailyKwh = totalKwh > 0 ? (totalKwh / days) * (1 + safetyMargin) : 0;
  const dailyEnergyWh = dailyKwh * 1000;
  const psh = YEMEN_CITIES.find((c) => c.name === city)?.psh ?? 5.9;
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
      methodLabel: 'حسب الفاتورة',
      ready: dailyEnergyWh > 0,
    });
  }, [city, psh, dailyEnergyWh, peakLoadW, usageType, adv, onOutput]);

  const onFile = (f: File | null) => {
    setFile(f);
    if (f && f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700">
            <MapPin className="h-4 w-4 text-teal-600" /> المدينة / المنطقة *
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
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">الفترة</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400"
          >
            <option value="weekly">أسبوعي (7 أيام)</option>
            <option value="monthly">شهري (30 يوماً)</option>
            <option value="custom">عدد أيام مخصص</option>
          </select>
        </label>

        {period === 'custom' && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">عدد الأيام</span>
            <input
              type="number"
              min={1}
              value={customDays}
              onChange={(e) => setCustomDays(Math.max(1, Number(e.target.value)))}
              dir="ltr"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400"
            />
          </label>
        )}

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">أدخل بيانات الفاتورة</span>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode('amount')}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === 'amount' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'}`}
            >
              المبلغ المالي (ر.ي)
            </button>
            <button
              type="button"
              onClick={() => setMode('consumption')}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === 'consumption' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'}`}
            >
              الاستهلاك (kWh)
            </button>
          </div>
        </label>

        {mode === 'amount' ? (
          <>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">المبلغ الإجمالي للفاتورة</span>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-12 pr-3 text-sm outline-none focus:border-teal-400"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">ر.ي</span>
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">سعر الكيلوواط ساعة</span>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={pricePerKwh}
                  onChange={(e) => setPricePerKwh(Math.max(0, Number(e.target.value)))}
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-14 pr-3 text-sm outline-none focus:border-teal-400"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">ر.ي/kWh</span>
              </div>
              <span className="mt-1 block text-[11px] text-slate-400">السعر من فاتورة الكهرباء أو تعرفة المولد.</span>
            </label>
          </>
        ) : (
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">إجمالي الاستهلاك خلال الفترة</span>
            <div className="relative">
              <input
                type="number"
                min={0}
                step={1}
                value={consumptionKwh}
                onChange={(e) => setConsumptionKwh(Math.max(0, Number(e.target.value)))}
                dir="ltr"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-12 pr-3 text-sm outline-none focus:border-teal-400"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">kWh</span>
            </div>
          </label>
        )}

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">هل الاستهلاك ثابت أم متفاوت؟</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setVariable('constant')}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${variable === 'constant' ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-500'}`}
            >
              ثابت تقريباً
            </button>
            <button
              type="button"
              onClick={() => setVariable('variable')}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${variable === 'variable' ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-500'}`}
            >
              متفاوت (مرتفع/منخفض)
            </button>
          </div>
          {variable === 'variable' && (
            <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-[11px] text-amber-700">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>نطبّق هامش أمان 20% على متوسط الاستهلاك لتغطية أيام الذروة — إجراء وقائي، وليس رقماً مطلقاً.</span>
            </div>
          )}
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

      {/* رفع الفاتورة */}
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Receipt className="h-4 w-4 text-teal-600" /> رفع صورة أو مستند الفاتورة (اختياري)
        </div>
        <p className="mt-1 text-[11px] text-slate-400">يمكنك رفع صورة فاتورتك للمتابعة، ثم إدخال الأرقام يدوياً.</p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-teal-300"
          >
            <Upload className="h-4 w-4" /> اختر ملفاً
          </button>
          {file && (
            <span className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs text-slate-600 ring-1 ring-slate-200">
              <FileText className="h-3.5 w-3.5" /> {file.name}
              <button onClick={() => { onFile(null); if (fileRef.current) fileRef.current.value = ''; }} className="text-slate-400 hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
            </span>
          )}
        </div>

        {preview && (
          <img src={preview} alt="معاينة الفاتورة" className="mt-3 max-h-56 rounded-xl border border-slate-200 object-contain" />
        )}

        <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50 p-2.5 text-[11px] text-amber-700">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            استخراج البيانات تلقائياً (OCR) غير متاح في هذه النسخة. يرجى إدخال المبلغ والاستهلاك وعدد الأيام
            يدوياً في الحقول أعلاه — ويمكنك مراجعتها وتعديلها قبل الحساب.
          </span>
        </div>
      </div>

      {/* ملخص المتوسط اليومي */}
      {dailyKwh > 0 && (
        <div className="rounded-xl border border-teal-100 bg-teal-50 p-3 text-center">
          <p className="text-xs text-teal-700">متوسط الاستهلاك اليومي المستخرج</p>
          <p className="mt-1 text-lg font-extrabold text-teal-800" dir="ltr">{dailyKwh.toFixed(2)} kWh/يوم</p>
          <p className="text-[10px] text-teal-600">= {totalKwh.toFixed(0)} kWh ÷ {days} يوماً{variable === 'variable' ? ' × 1.2 (هامش أمان)' : ''}</p>
        </div>
      )}

      <AdvancedOptions value={adv} onChange={setAdv} />
    </div>
  );
}