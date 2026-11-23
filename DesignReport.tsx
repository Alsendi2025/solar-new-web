import {
  Sun, Cpu, BatteryCharging, Gauge, Zap, ShieldCheck, AlertTriangle,
  Info, Save, MessageCircle, CheckCircle2, HelpCircle,
} from 'lucide-react';
import type { DesignResult } from '../../lib/designEngine';
import { BATTERY_TYPES } from '../../lib/designEngine';
import { formatNumber } from '../../lib/format';
import CurveChart from './CurveChart';

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 py-1.5 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-800" dir="ltr">{value}</span>
    </div>
  );
}

function SpecCard({
  icon, title, accent, children,
}: {
  icon: React.ReactNode;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function DesignReport({
  result,
  city,
  methodLabel,
  onSave,
  onQuote,
  saving,
}: {
  result: DesignResult;
  city: string;
  methodLabel: string;
  onSave?: () => void;
  onQuote?: () => void;
  saving?: boolean;
}) {
  const { system, inverter, battery, production, verification, assumptions, warnings } = result;

  const statusStyle = {
    ok: { cls: 'text-emerald-700 bg-emerald-50 border-emerald-100', icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" /> },
    warn: { cls: 'text-amber-700 bg-amber-50 border-amber-100', icon: <AlertTriangle className="h-4 w-4 text-amber-600" /> },
    unknown: { cls: 'text-slate-600 bg-slate-50 border-slate-100', icon: <HelpCircle className="h-4 w-4 text-slate-400" /> },
  };

  return (
    <div className="space-y-5">
      {/* Actions */}
      {(onSave || onQuote) && (
        <div className="flex flex-wrap gap-2">
          {onQuote && (
            <button onClick={onQuote} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">
              <MessageCircle className="h-4 w-4" /> اطلب عرض سعر / تنفيذ
            </button>
          )}
          {onSave && (
            <button onClick={onSave} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700 disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? 'جارٍ الحفظ...' : 'حفظ المشروع'}
            </button>
          )}
        </div>
      )}

      {/* الملخص البارز */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-l from-slate-900 to-slate-800 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-300">ملخص تصميم المنظومة</span>
          <span className="text-xs text-slate-400">{city} · {methodLabel}</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { icon: Sun, label: 'قدرة المنظومة', value: system.totalCapacityKw, unit: 'kW' },
            { icon: Cpu, label: 'قدرة العاكس', value: (inverter.recommendedW * inverter.numInverters) / 1000, unit: 'kW' },
            { icon: BatteryCharging, label: 'سعة البطارية', value: (battery.usableWh || 0) / 1000, unit: 'kWh' },
            { icon: Zap, label: 'الإنتاج المتوقع', value: production.dailyGenerationWh / 1000, unit: 'kWh/يوم' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <s.icon className="h-4 w-4 text-teal-400" />
              <p className="mt-2 text-xl font-extrabold" dir="ltr">
                {formatNumber(s.value, s.value < 10 ? 2 : 1)}
                <span className="mr-1 text-xs font-medium text-slate-400">{s.unit}</span>
              </p>
              <p className="text-[11px] text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
        {!battery.required && (
          <p className="mt-3 text-[11px] text-amber-300">لا توجد بطاريات في النظام المختار — سعة التخزين = 0.</p>
        )}
      </div>

      {/* المنحنى */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
          <span className="text-teal-600"><Gauge className="h-4 w-4" /></span>
          الإنتاج والتخزين مقابل الاستهلاك خلال 24 ساعة
        </h3>
        <CurveChart curves={result.curves} />
      </div>

      {/* بطاقات المواصفات */}
      <div className="grid gap-4 md:grid-cols-3">
        <SpecCard icon={<Sun className="h-4 w-4" />} title="الألواح الكهروضوئية" accent="bg-amber-50 text-amber-600">
          <SpecRow label="القدرة الإجمالية" value={`${formatNumber(system.arrayWattage)} W (${system.totalCapacityKw} kW)`} />
          <SpecRow label="قدرة اللوح" value={`${system.panelWattage} W`} />
          <SpecRow label="عدد الألواح" value={`${system.numPanels} لوح`} />
          <SpecRow label="التوصيل" value={`${system.panelsPerString} تسلسلي × ${system.numStrings} متوازي`} />
          <SpecRow label="Vmp / Imp للوح" value={`${system.panelVmp}V / ${system.panelImp}A`} />
        </SpecCard>

        <SpecCard icon={<Cpu className="h-4 w-4" />} title="الإنفرتر (العاكس)" accent="bg-blue-50 text-blue-600">
          <SpecRow label="القدرة" value={`${formatNumber(inverter.recommendedW)} W`} />
          <SpecRow label="عدد الأجهزة" value={`${inverter.numInverters}`} />
          <SpecRow label="جهد بنك البطاريات" value={`${inverter.batteryVoltage} V`} />
          <SpecRow label="مداخل MPPT" value={`${inverter.mpptInputs}`} />
          <SpecRow label="نطاق جهد الألواح" value={`${inverter.vMin}–${inverter.vMax} V`} />
          <SpecRow label="حد تيار الدخل" value={`${inverter.iMax} A`} />
        </SpecCard>

        <SpecCard icon={<BatteryCharging className="h-4 w-4" />} title="البطاريات" accent="bg-teal-50 text-teal-600">
          {battery.required ? (
            <>
              <SpecRow label="النوع" value={BATTERY_TYPES[battery.type].label.split(' ')[0]} />
              <SpecRow label="الجهد الاسمي" value={`${battery.voltage} V`} />
              <SpecRow label="السعة الاسمية" value={`${formatNumber(battery.nominalAh)} Ah (${formatNumber(battery.nominalWh / 1000, 1)} kWh)`} />
              <SpecRow label="السعة القابلة للاستخدام" value={`${formatNumber(battery.usableAh)} Ah (${formatNumber(battery.usableWh / 1000, 1)} kWh)`} />
              <SpecRow label="عمق التفريغ DoD" value={`${Math.round(battery.dod * 100)}%`} />
              <SpecRow label="عدد الوحدات" value={`${battery.numUnits} (${battery.seriesCount} تسلسلي × ${battery.parallelStrings} متوازي)`} />
            </>
          ) : (
            <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">لا يتضمن النظام المختار تخزيناً بالبطاريات.</p>
          )}
        </SpecCard>
      </div>

      {/* التحقق الهندسي */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
          <span className="text-teal-600"><ShieldCheck className="h-4 w-4" /></span>
          التحقق الهندسي والتوافق
        </h3>
        <div className="space-y-2">
          {verification.map((v) => {
            const st = statusStyle[v.status];
            return (
              <div key={v.key} className={`flex items-start gap-2 rounded-xl border p-3 ${st.cls}`}>
                <span className="mt-0.5">{st.icon}</span>
                <div>
                  <p className="text-xs font-bold">{v.label}</p>
                  <p className="mt-0.5 text-[11px] opacity-90">{v.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* الافتراضات */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-800">
          <Info className="h-4 w-4" /> الافتراضات والمصادر
        </h3>
        <ul className="space-y-1">
          {assumptions.map((a, i) => (
            <li key={i} className="flex gap-1.5 text-[11px] leading-relaxed text-blue-700"><span>•</span><span>{a}</span></li>
          ))}
          <li className="flex gap-1.5 text-[11px] leading-relaxed text-blue-700"><span>•</span><span>بيانات الإشعاع الشمسي (PSH) تقديرية مجمّعة، يُنصح بالتحقق عبر Global Solar Atlas / NASA POWER وقياسات محلية.</span></li>
          <li className="flex gap-1.5 text-[11px] leading-relaxed text-blue-700"><span>•</span><span>النتائج تصميم مبدئي غير نهائي — لا يُعد اعتماداً تنفيذياً دون مراجعة مهندس مختص ودراسة ميدانية.</span></li>
        </ul>
      </div>

      {warnings.length > 0 && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-800">
            <AlertTriangle className="h-4 w-4" /> ملاحظات
          </h3>
          <ul className="space-y-1">
            {warnings.map((w, i) => (
              <li key={i} className="flex gap-1.5 text-[11px] leading-relaxed text-amber-700"><span>•</span><span>{w}</span></li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-center text-[10px] text-slate-400">
        طاقة بلس — محرك تصميم هندسي مستقل
      </p>
    </div>
  );
}