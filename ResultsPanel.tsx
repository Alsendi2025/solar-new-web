import {
  AlertTriangle, CheckCircle2, BatteryCharging, Sun, Zap, Gauge,
  Save, FileText, MessageCircle, Cable, ShieldCheck, Cpu, Package,
} from 'lucide-react';
import type { CalcResult, SelectionItem } from '../../lib/solarEngine';
import { formatEnergy, formatPower, formatNumber } from '../../lib/format';
import { StatCard, Badge } from '../ui';
import EnergyChart from './EnergyChart';

function Row({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 py-2 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800" dir="ltr">
        {value} {unit && <span className="text-xs font-normal text-slate-400">{unit}</span>}
      </span>
    </div>
  );
}

export default function ResultsPanel({
  result,
  selections,
  onSave,
  onReport,
  onQuote,
  saving,
}: {
  result: CalcResult;
  selections: SelectionItem[];
  onSave: () => void;
  onReport: () => void;
  onQuote: () => void;
  saving: boolean;
}) {
  const { load, inverter, battery, pv, controller, cable, protection, warnings } = result;
  const ok = warnings.length === 0;

  return (
    <div className="space-y-5">
      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onReport}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-teal-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-teal-500/20 transition hover:from-teal-700 hover:to-cyan-700"
        >
          <FileText className="h-4 w-4" /> التقرير الفني الكامل
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? 'جارٍ الحفظ...' : 'حفظ المشروع'}
        </button>
        <button
          onClick={onQuote}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          <MessageCircle className="h-4 w-4" /> طلب عرض سعر
        </button>
      </div>

      {/* Verification banner */}
      <div
        className={`flex items-start gap-3 rounded-2xl border p-4 ${
          ok ? 'border-emerald-100 bg-emerald-50' : 'border-amber-100 bg-amber-50'
        }`}
      >
        {ok ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        ) : (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        )}
        <div>
          <p className={`text-sm font-bold ${ok ? 'text-emerald-800' : 'text-amber-800'}`}>
            {ok ? 'تم التحقق الهندسي بنجاح ✓' : `يوجد ${warnings.length} ملاحظة هندسية`}
          </p>
          {ok ? (
            <p className="mt-1 text-xs text-emerald-700">جميع المعاملات ضمن الحدود الآمنة للتصميم.</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {warnings.map((w, i) => (
                <li key={i} className="flex gap-1.5 text-xs text-amber-800">
                  <span>•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="استهلاك يومي" value={formatNumber(load.dailyEnergyWh)} unit="Wh" icon={<Zap className="h-4 w-4" />} />
        <StatCard label="قدرة الذروة" value={formatNumber(load.peakLoadW)} unit="W" icon={<Gauge className="h-4 w-4" />} accent="blue" />
        <StatCard label="قدرة العاكس" value={formatNumber(inverter.recommendedW)} unit="W" icon={<Cpu className="h-4 w-4" />} accent="amber" />
        <StatCard label="عدد الألواح" value={formatNumber(pv.numPanels)} unit="لوح" icon={<Sun className="h-4 w-4" />} accent="green" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* PV array */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
            <span className="text-amber-500"><Sun className="h-4 w-4" /></span> مصفوفة الألواح الكهروضوئية
          </h3>
          <Row label="إجمالي قدرة المصفوفة" value={formatNumber(pv.arrayWattage)} unit="W" />
          <Row label="عدد الألواح" value={formatNumber(pv.numPanels)} unit="لوح" />
          <Row label="توصيل الألواح" value={`${pv.panelsPerString} تسلسلي × ${pv.numStrings} متوازي`} />
          <Row label="القدرة المطلوبة (تقديري)" value={formatNumber(pv.requiredWattage)} unit="W" />
          <Row label="الإنتاج اليومي المتوقع" value={formatEnergy(pv.dailyGenerationWh)} />
          <Row label="معامل الأداء (PR)" value={formatNumber(pv.performanceRatio * 100, 1)} unit="%" />
        </div>

        {/* Battery */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
            <span className="text-teal-600"><BatteryCharging className="h-4 w-4" /></span> بنك البطاريات BESS
          </h3>
          <Row label="عدد البطاريات" value={formatNumber(battery.numBatteries)} unit="بطارية" />
          <Row label="التوصيل" value={`${battery.seriesCount} تسلسلي × ${battery.parallelStrings} متوازي`} />
          <Row label="جهد البنك" value={formatNumber(battery.bankVoltage)} unit="V" />
          <Row label="سعة البنك" value={formatNumber(battery.bankCapacityAh)} unit="Ah" />
          <Row label="الطاقة القابلة للاستخدام" value={formatEnergy(battery.usableWh)} />
          <Row label="الاستقلالية الفعلية" value={formatNumber(battery.actualAutonomyDays, 1)} unit="يوم" />
        </div>

        {/* Inverter + Controller */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
            <span className="text-blue-600"><Cpu className="h-4 w-4" /></span> العاكس ومنظم الشحن
          </h3>
          <Row label="قدرة العاكس الموصى بها" value={formatPower(inverter.recommendedW)} />
          <Row label="القدرة الاندفاعية (Surge)" value={formatPower(inverter.surgeW)} />
          <Row label="تيار الدخل DC" value={formatNumber(inverter.ratedInputCurrentA, 1)} unit="A" />
          <Row label="تيار الخرج AC" value={formatNumber(inverter.outputCurrentA, 1)} unit="A" />
          <Row label="منظم الشحن (MPPT)" value={`${formatNumber(controller.recommendedCurrentA, 1)}A / ${controller.recommendedVoltage}V`} />
        </div>

        {/* Cable + Protection */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
            <span className="text-slate-600"><Cable className="h-4 w-4" /></span> الكابلات والحماية
          </h3>
          <Row label="مقاس الكابل الموصى به" value={`${cable.recommendedArea}`} unit="mm²" />
          <Row label="هبوط الجهد" value={formatNumber(cable.voltageDropPercent, 2)} unit="%" />
          <Row label="قواطع المصفوفة" value={`${protection.arrayBreakerA}`} unit="A" />
          <Row label="قواطع البطارية" value={`${protection.batteryBreakerA}`} unit="A" />
          <Row label="قواطع العاكس DC" value={`${protection.inverterBreakerA}`} unit="A" />
          <Row label="قاطع الحمل AC" value={`${protection.acBreakerA}`} unit="A" />
        </div>
      </div>

      {/* Energy breakdown */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
          <span className="text-teal-600"><Zap className="h-4 w-4" /></span> توزيع الطاقة على الأحمال
        </h3>
        <EnergyChart breakdown={load.breakdown} />
      </div>

      {/* Component selection */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-800">
          <span className="text-teal-600"><Package className="h-4 w-4" /></span> المكونات المقترحة آلياً
        </h3>
        <p className="mb-4 text-xs text-slate-400">اختيار تلقائي دقيق للمكونات المناسبة دون إلزام ماركة تجارية محددة — بناءً على التوافق الهندسي.</p>
        {selections.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">لم تتوفر منتجات مطابقة في قاعدة البيانات بعد.</p>
        ) : (
          <div className="space-y-2">
            {selections.map((s) => (
              <div key={s.category} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                    <Package className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{s.product.name}</p>
                    <p className="text-xs text-slate-400">{s.product.brand} · {s.note}</p>
                  </div>
                </div>
                <Badge color="teal">الكمية: {s.quantity}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 text-teal-500" />
        تمثل هذه النتائج تصميماً هندسياً أولياً — التطبيق النهائي يتطلب مراجعة مهندس مختص ودراسة ميدانية.
      </div>
    </div>
  );
}