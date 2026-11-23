import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings2, MapPin, BatteryCharging, Sun, Gauge, Save, CheckCircle2 } from 'lucide-react';
import {
  calculateSystem, selectComponents, BATTERY_TYPES,
  type SolarInputs, type ProductLike, type BatteryType,
} from '../../lib/solarEngine';
import { DEFAULT_INPUTS, YEMEN_CITIES, PANEL_PRESETS, BATTERY_PRESETS } from '../../lib/constants';
import ApplianceEditor from './ApplianceEditor';
import ResultsPanel from './ResultsPanel';
import ReportView from './ReportView';
import { NumberField, SelectField, FieldGroup } from './fields';

export default function CalculatorWorkspace({ mode }: { mode: 'basic' | 'pro' }) {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<SolarInputs>(DEFAULT_INPUTS);
  const [products, setProducts] = useState<ProductLike[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d : []))
      .catch(() => setProducts([]));
  }, []);

  const update = <K extends keyof SolarInputs>(key: K, value: SolarInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const result = useMemo(() => calculateSystem(inputs), [inputs]);
  const selections = useMemo(() => selectComponents(result, products), [result, products]);

  const handleCity = (city: string) => {
    const c = YEMEN_CITIES.find((x) => x.name === city);
    setInputs((prev) => ({ ...prev, city, psh: c?.psh ?? prev.psh }));
    setSaved(false);
  };

  const handlePanelPreset = (wattage: string) => {
    const p = PANEL_PRESETS.find((x) => String(x.wattage) === wattage);
    if (!p) return;
    setInputs((prev) => ({
      ...prev,
      panelWattage: p.wattage,
      panelVmp: p.vmp,
      panelVoc: p.voc,
      panelImp: p.imp,
      panelIsc: p.isc,
    }));
    setSaved(false);
  };

  const handleBatteryPreset = (label: string) => {
    const b = BATTERY_PRESETS.find((x) => x.label === label);
    if (!b) return;
    setInputs((prev) => ({ ...prev, batteryNominalVoltage: b.voltage, batteryCapacityAh: b.capacityAh }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const name = `منظومة ${inputs.city} — ${new Date().toLocaleDateString('ar-EG')}`;
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          city: inputs.city,
          inputs,
          results: result,
          daily_energy_wh: result.load.dailyEnergyWh,
          array_wattage: result.pv.arrayWattage,
          num_panels: result.pv.numPanels,
          num_batteries: result.battery.numBatteries,
        }),
      });
      if (res.ok) setSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleQuote = () => {
    const summary = `استهلاك يومي: ${result.load.dailyEnergyWh} Wh | عاكس: ${result.inverter.recommendedW}W | ألواح: ${result.pv.numPanels}×${inputs.panelWattage}W | بطاريات: ${result.battery.numBatteries}`;
    navigate('/contact', { state: { summary, city: inputs.city } });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      {/* Inputs column */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
            <span className="text-teal-600"><MapPin className="h-4 w-4" /></span> الموقع والظروف
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="المدينة"
              value={inputs.city}
              onChange={handleCity}
              options={YEMEN_CITIES.map((c) => ({ value: c.name, label: `${c.name} (${c.psh} PSH)` }))}
            />
            {mode === 'pro' ? (
              <NumberField label="ساعات الذروة الشمسية (PSH)" value={inputs.psh} onChange={(v) => update('psh', v)} unit="kWh/m²/يوم" step={0.1} min={2} max={8} />
            ) : (
              <div className="flex flex-col justify-end">
                <div className="rounded-xl bg-teal-50 px-3 py-2 text-xs text-teal-700">
                  ساعات الذروة الشمسية: <span className="font-bold">{inputs.psh}</span> kWh/m²/يوم
                </div>
              </div>
            )}
          </div>
        </div>

        <ApplianceEditor appliances={inputs.appliances} onChange={(a) => update('appliances', a)} />

        <FieldGroup title="إعدادات البطارية BESS" icon={<BatteryCharging className="h-4 w-4" />}>
          <SelectField
            label="نوع البطارية"
            value={inputs.batteryType}
            onChange={(v) => {
              const t = v as BatteryType;
              setInputs((prev) => ({ ...prev, batteryType: t, batteryDoD: BATTERY_TYPES[t].recommendedDoD }));
              setSaved(false);
            }}
            options={Object.entries(BATTERY_TYPES).map(([k, v]) => ({ value: k, label: v.label }))}
          />
          <NumberField label="أيام الاستقلالية" value={inputs.autonomyDays} onChange={(v) => update('autonomyDays', v)} unit="يوم" min={0.5} max={5} step={0.5} />
          <NumberField label="عمق التفريغ (DoD)" value={Math.round(inputs.batteryDoD * 100)} onChange={(v) => update('batteryDoD', v / 100)} unit="%" min={10} max={95} />
          <SelectField
            label="جهد النظام"
            value={String(inputs.batteryVoltage)}
            onChange={(v) => update('batteryVoltage', Number(v))}
            options={[{ value: '12', label: '12V' }, { value: '24', label: '24V' }, { value: '48', label: '48V' }]}
          />
          {mode === 'pro' && (
            <>
              <SelectField
                label="بطارية (سعة/جهد)"
                value={BATTERY_PRESETS.find((b) => b.voltage === inputs.batteryNominalVoltage && b.capacityAh === inputs.batteryCapacityAh)?.label ?? BATTERY_PRESETS[2].label}
                onChange={handleBatteryPreset}
                options={BATTERY_PRESETS.map((b) => ({ value: b.label, label: b.label }))}
              />
              <NumberField label="جهد البطارية الواحدة" value={inputs.batteryNominalVoltage} onChange={(v) => update('batteryNominalVoltage', v)} unit="V" />
              <NumberField label="سعة البطارية" value={inputs.batteryCapacityAh} onChange={(v) => update('batteryCapacityAh', v)} unit="Ah" />
            </>
          )}
        </FieldGroup>

        <FieldGroup title="إعدادات الألواح والعاكس" icon={<Sun className="h-4 w-4" />}>
          {mode === 'basic' ? (
            <SelectField
              label="قدرة اللوح"
              value={String(inputs.panelWattage)}
              onChange={handlePanelPreset}
              options={PANEL_PRESETS.map((p) => ({ value: String(p.wattage), label: `${p.wattage}W` }))}
            />
          ) : (
            <>
              <NumberField label="قدرة اللوح" value={inputs.panelWattage} onChange={(v) => update('panelWattage', v)} unit="W" />
              <NumberField label="جهد Vmp" value={inputs.panelVmp} onChange={(v) => update('panelVmp', v)} unit="V" step={0.1} />
              <NumberField label="جهد Voc" value={inputs.panelVoc} onChange={(v) => update('panelVoc', v)} unit="V" step={0.1} />
              <NumberField label="تيار Imp" value={inputs.panelImp} onChange={(v) => update('panelImp', v)} unit="A" step={0.1} />
              <NumberField label="تيار Isc" value={inputs.panelIsc} onChange={(v) => update('panelIsc', v)} unit="A" step={0.1} />
            </>
          )}
          {mode === 'pro' && (
            <>
              <NumberField label="كفاءة العاكس" value={Math.round(inputs.inverterEfficiency * 100)} onChange={(v) => update('inverterEfficiency', v / 100)} unit="%" min={70} max={99} />
              <NumberField label="كفاءة منظم الشحن" value={Math.round(inputs.controllerEfficiency * 100)} onChange={(v) => update('controllerEfficiency', v / 100)} unit="%" min={80} max={99} />
              <NumberField label="فواقد التوصيل" value={Math.round(inputs.wiringLoss * 100)} onChange={(v) => update('wiringLoss', v / 100)} unit="%" min={0} max={20} />
              <NumberField label="فواقد النظام (أتربة/حرارة)" value={Math.round(inputs.systemLoss * 100)} onChange={(v) => update('systemLoss', v / 100)} unit="%" min={0} max={50} />
            </>
          )}
        </FieldGroup>

        {mode === 'pro' && (
          <FieldGroup title="الكابلات والتحقق" icon={<Gauge className="h-4 w-4" />} cols={2}>
            <NumberField label="طول الكابل (DC)" value={inputs.cableLength} onChange={(v) => update('cableLength', v)} unit="متر" min={1} max={100} />
            <SelectField
              label="مادة الكابل"
              value={inputs.cableMaterial}
              onChange={(v) => update('cableMaterial', v as 'copper' | 'aluminum')}
              options={[{ value: 'copper', label: 'نحاس' }, { value: 'aluminum', label: 'ألمنيوم' }]}
            />
            <NumberField label="أقصى هبوط جهد" value={Math.round(inputs.maxVoltageDrop * 100)} onChange={(v) => update('maxVoltageDrop', v / 100)} unit="%" min={1} max={10} />
          </FieldGroup>
        )}

        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> تم حفظ المشروع في لوحة الإدارة
          </div>
        )}
        {!saved && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? 'جارٍ الحفظ...' : 'حفظ المشروع في لوحة الإدارة'}
          </button>
        )}
      </div>

      {/* Results column */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="mb-3 flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-teal-600" />
          <h2 className="text-sm font-bold text-slate-800">النتائج الهندسية (تُحسب تلقائياً)</h2>
        </div>
        <ResultsPanel
          result={result}
          selections={selections}
          onSave={handleSave}
          onReport={() => setReportOpen(true)}
          onQuote={handleQuote}
          saving={saving}
        />
      </div>

      <ReportView
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        result={result}
        inputs={inputs}
        selections={selections}
      />
    </div>
  );
}