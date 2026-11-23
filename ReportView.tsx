import { X, Printer, Sun, BatteryCharging, Cpu, Cable, ShieldCheck, FileText } from 'lucide-react';
import type { CalcResult, SolarInputs, SelectionItem } from '../../lib/solarEngine';
import { BATTERY_TYPES } from '../../lib/solarEngine';
import { formatEnergy, formatPower, formatNumber, formatDate } from '../../lib/format';

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid rounded-xl border border-slate-200 p-4">
      <h3 className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2 text-sm font-bold text-slate-800">
        <span className="text-teal-600">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800" dir="ltr">{value}</span>
    </div>
  );
}

export default function ReportView({
  open,
  onClose,
  result,
  inputs,
  selections,
}: {
  open: boolean;
  onClose: () => void;
  result: CalcResult;
  inputs: SolarInputs;
  selections: SelectionItem[];
}) {
  if (!open) return null;
  const { load, inverter, battery, pv, controller, cable, protection, warnings } = result;

  return (
    <div className="report-print fixed inset-0 z-[60] flex justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm print:static print:bg-white print:p-0">
      <div className="my-4 w-full max-w-3xl rounded-2xl bg-white shadow-2xl print:my-0 print:max-w-none print:shadow-none">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-100 bg-white px-5 py-3 print:hidden">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <FileText className="h-4 w-4 text-teal-600" /> التقرير الفني الشامل
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
            >
              <Printer className="h-3.5 w-3.5" /> طباعة / PDF
            </button>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Report body */}
        <div className="space-y-4 p-6 text-slate-800">
          <header className="border-b-2 border-teal-500 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                <Sun className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-lg font-extrabold text-slate-900">تقرير تصميم منظومة طاقة شمسية</h1>
                <p className="text-xs text-slate-500">Solar PV System Design Report — طاقة بلس</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div><span className="text-slate-400">المدينة:</span> <span className="font-semibold">{inputs.city}</span></div>
              <div><span className="text-slate-400">التاريخ:</span> <span className="font-semibold">{formatDate(new Date().toISOString())}</span></div>
              <div><span className="text-slate-400">ساعات الذروة:</span> <span className="font-semibold">{inputs.psh} kWh/m²</span></div>
              <div><span className="text-slate-400">نوع النظام:</span> <span className="font-semibold">Off-Grid / Hybrid</span></div>
            </div>
          </header>

          <Section title="1. ملخص التصميم" icon={<FileText className="h-4 w-4" />}>
            <div className="grid grid-cols-2 gap-x-6">
              <Line label="الاستهلاك اليومي" value={formatEnergy(load.dailyEnergyWh)} />
              <Line label="قدرة الذروة" value={formatPower(load.peakLoadW)} />
              <Line label="قدرة العاكس" value={formatPower(inverter.recommendedW)} />
              <Line label="إجمالي الألواح" value={`${pv.numPanels} لوح (${formatPower(pv.arrayWattage)})`} />
              <Line label="عدد البطاريات" value={`${battery.numBatteries} بطارية`} />
              <Line label="الاستقلالية" value={`${formatNumber(battery.actualAutonomyDays, 1)} يوم`} />
            </div>
          </Section>

          <Section title="2. دراسة الأحمال الكهربائية" icon={<Cpu className="h-4 w-4" />}>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-1 text-right font-medium">الجهاز</th>
                  <th className="py-1 text-center font-medium">العدد</th>
                  <th className="py-1 text-center font-medium">القدرة</th>
                  <th className="py-1 text-center font-medium">ساعات</th>
                  <th className="py-1 text-left font-medium">الطاقة</th>
                </tr>
              </thead>
              <tbody>
                {load.breakdown.map((b, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="py-1">{b.name}</td>
                    <td className="py-1 text-center">{b.qty}</td>
                    <td className="py-1 text-center" dir="ltr">{b.powerW}W</td>
                    <td className="py-1 text-center" dir="ltr">{b.hours}h</td>
                    <td className="py-1 text-left font-semibold" dir="ltr">{formatEnergy(b.energyWh)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="3. تحجيم المكونات" icon={<Sun className="h-4 w-4" />}>
            <div className="grid gap-x-6 sm:grid-cols-2">
              <Line label="قدرة العاكس الموصى بها" value={formatPower(inverter.recommendedW)} />
              <Line label="القدرة الاندفاعية" value={formatPower(inverter.surgeW)} />
              <Line label="لوح الطاقة" value={`${inputs.panelWattage}W × ${pv.numPanels}`} />
              <Line label="توصيل الألواح" value={`${pv.panelsPerString} تسلسلي × ${pv.numStrings} متوازي`} />
              <Line label="نوع البطارية" value={BATTERY_TYPES[battery.type].label} />
              <Line label="سعة البطارية" value={`${inputs.batteryCapacityAh}Ah / ${inputs.batteryNominalVoltage}V`} />
              <Line label="توصيل البطارية" value={`${battery.seriesCount} تسلسلي × ${battery.parallelStrings} متوازي`} />
              <Line label="منظم الشحن MPPT" value={`${formatNumber(controller.recommendedCurrentA, 1)}A`} />
            </div>
          </Section>

          <Section title="4. الكابلات والحماية" icon={<Cable className="h-4 w-4" />}>
            <div className="grid gap-x-6 sm:grid-cols-2">
              <Line label="مقاس الكابل" value={`${cable.recommendedArea} mm² (${cable.material === 'copper' ? 'نحاس' : 'ألمنيوم'})`} />
              <Line label="هبوط الجهد" value={`${formatNumber(cable.voltageDropPercent, 2)}%`} />
              <Line label="قاطع المصفوفة" value={`${protection.arrayBreakerA}A`} />
              <Line label="قاطع البطارية" value={`${protection.batteryBreakerA}A`} />
              <Line label="قاطع العاكس DC" value={`${protection.inverterBreakerA}A`} />
              <Line label="قاطع الحمل AC" value={`${protection.acBreakerA}A`} />
            </div>
          </Section>

          <Section title="5. قائمة المشتروات (BoM)" icon={<BatteryCharging className="h-4 w-4" />}>
            {selections.length === 0 ? (
              <p className="text-xs text-slate-400">لا توجد مكونات مطابقة في قاعدة البيانات.</p>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-1 text-right font-medium">المكون</th>
                    <th className="py-1 text-right font-medium">الماركة</th>
                    <th className="py-1 text-center font-medium">الكمية</th>
                    <th className="py-1 text-left font-medium">المواصفة</th>
                  </tr>
                </thead>
                <tbody>
                  {selections.map((s) => (
                    <tr key={s.category} className="border-b border-slate-50">
                      <td className="py-1">{s.product.name}</td>
                      <td className="py-1 text-slate-500">{s.product.brand}</td>
                      <td className="py-1 text-center font-semibold">{s.quantity}</td>
                      <td className="py-1 text-left text-slate-500">{s.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Section>

          {warnings.length > 0 && (
            <Section title="6. ملاحظات هندسية" icon={<ShieldCheck className="h-4 w-4" />}>
              <ul className="space-y-1">
                {warnings.map((w, i) => (
                  <li key={i} className="flex gap-1.5 text-xs text-amber-700">
                    <span>•</span><span>{w}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <footer className="border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400">
            هذا التقرير صادر عن منصة طاقة بلس للهندسة الشمسية — تصميم أولي يتطلب مراجعة مهندس مختص ودراسة ميدانية قبل التنفيذ.
          </footer>
        </div>
      </div>
    </div>
  );
}