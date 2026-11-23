import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Receipt, SlidersHorizontal, CheckCircle2, Info } from 'lucide-react';
import { Container } from '../components/ui';
import { designSystem } from '../lib/designEngine';
import type { MethodOutput } from '../components/design/types';
import MethodDaily from '../components/design/MethodDaily';
import MethodBill from '../components/design/MethodBill';
import MethodManual from '../components/design/MethodManual';
import DesignReport from '../components/design/DesignReport';

type Method = 'daily' | 'bill' | 'manual';

const METHODS: { key: Method; label: string; icon: typeof Zap; desc: string }[] = [
  { key: 'daily', label: 'حسب الاستهلاك اليومي', icon: Zap, desc: 'أدخل متوسط kWh اليومي' },
  { key: 'bill', label: 'حسب الفاتورة', icon: Receipt, desc: 'أسبوعي / شهري / مبلغ مالي' },
  { key: 'manual', label: 'حساب يدوي تفصيلي', icon: SlidersHorizontal, desc: 'الأجهزة والمواصفات' },
];

export default function DesignNormal() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>('daily');
  const [output, setOutput] = useState<MethodOutput | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const result = useMemo(() => {
    if (!output || !output.ready) return null;
    return designSystem({
      city: output.city,
      psh: output.psh,
      dailyEnergyWh: output.dailyEnergyWh,
      peakLoadW: output.peakLoadW,
      autonomyHours: output.autonomyHours,
      batteryType: output.batteryType,
      systemType: output.systemType,
      usageType: output.usageType,
      panelWattage: output.panelWattage,
      assumptions: output.assumptions,
      hourlyWeights: output.hourlyWeights,
    });
  }, [output]);

  const handleOutput = useCallback((o: MethodOutput) => {
    setOutput(o);
    setSaved(false);
  }, []);

  const handleSave = async () => {
    if (!output || !result) return;
    setSaving(true);
    try {
      const name = `منظومة ${output.city} — ${output.methodLabel}`;
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          city: output.city,
          inputs: output,
          results: result,
          daily_energy_wh: Math.round(output.dailyEnergyWh),
          array_wattage: result.system.arrayWattage,
          num_panels: result.system.numPanels,
          num_batteries: result.battery.numUnits,
        }),
      });
      setSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleQuote = () => {
    if (!output) return;
    const summary = `استهلاك يومي: ${(output.dailyEnergyWh / 1000).toFixed(1)} kWh | طريقة: ${output.methodLabel}`;
    navigate('/contact', { state: { summary, city: output.city } });
  };

  return (
    <div className="py-8">
      <Container>
        <header className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1 text-sm font-semibold text-teal-700">
            <Zap className="h-4 w-4" /> حساب المنظومات العادية
          </span>
          <h1 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">صمّم منظومتك الشمسية</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            اختر الطريقة الأنسب لك. يقوم محرك التصميم الهندسي بحساب حجم الألواح والعواكس والبطاريات
            تلقائياً، مع تقرير فني موحّد وتحقق هندسي.
          </p>
        </header>

        {/* اختيار الطريقة */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {METHODS.map((m) => (
            <button
              key={m.key}
              onClick={() => { setMethod(m.key); setSaved(false); }}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-right transition ${
                method === m.key
                  ? 'border-teal-400 bg-teal-50 ring-2 ring-teal-100'
                  : 'border-slate-100 bg-white hover:border-teal-200'
              }`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${method === m.key ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <m.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-800">{m.label}</span>
                <span className="block text-[11px] text-slate-400">{m.desc}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* المدخلات */}
          <div className="space-y-4">
            {method === 'daily' && <MethodDaily onOutput={handleOutput} />}
            {method === 'bill' && <MethodBill onOutput={handleOutput} />}
            {method === 'manual' && <MethodManual onOutput={handleOutput} />}

            <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-[11px] text-blue-700">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <span>النتائج مبدئية وتقديرية، وتحتاج مراجعة مهندس مختص ودراسة ميدانية قبل التنفيذ. لا تُعد اعتماداً تنفيذياً.</span>
            </div>
          </div>

          {/* النتائج */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            {result && output ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  <h2 className="text-sm font-bold text-slate-800">التقرير الفني</h2>
                </div>
                <DesignReport
                  result={result}
                  city={output.city}
                  methodLabel={output.methodLabel}
                  onSave={handleSave}
                  onQuote={handleQuote}
                  saving={saving}
                />
                {saved && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> تم حفظ المشروع في لوحة الإدارة
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-600"><Zap className="h-7 w-7" /></span>
                <p className="mt-4 text-base font-bold text-slate-700">أدخل بياناتك لبدء التصميم</p>
                <p className="mt-1 max-w-xs text-sm text-slate-400">ستظهر النتائج والتقرير الفني هنا تلقائياً فور إدخالاستهلاك.</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}