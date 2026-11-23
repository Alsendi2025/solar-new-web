/**
 * SolarEdge Engineering Engine
 * محرك الحسابات والتصميم الهندسي لمنظومات الطاقة الشمسية (Off-Grid / Hybrid)
 *
 * جميع المعادلات مبنية على أسس هندسية معتمدة:
 *  - دراسة الأحمال: E(Wh/day) = Σ (عدد × القدرة × ساعات التشغيل)
 *  - تحجيم العاكس: P_inv ≥ P_peak × معامل الأمان
 *  - تحجيم البطارية: C(Wh) = (E × أيام الاستقلالية) / (DoD × η_batt)
 *  - تحجيم المصفوفة: P_pv = E_req / (PSH × PR)
 *  - تحجيم الكابل: A = (2 × I × L × ρ) / (V × نسبة هبوط الجهد المسموحة)
 *  - تحجيم الحماية: I_breaker ≥ I × 1.25
 */

export type BatteryType = 'lead-acid' | 'gel' | 'lifepo4';
export type CableMaterial = 'copper' | 'aluminum';

export interface Appliance {
  id: string;
  name: string;
  qty: number;
  powerW: number;
  hoursPerDay: number;
  surgeW?: number;
  powerFactor?: number;
}

export interface SolarInputs {
  appliances: Appliance[];
  city: string;
  psh: number; // ساعات الذروة الشمسية (kWh/m²/يوم)
  autonomyDays: number; // أيام الاستقلالية
  batteryDoD: number; // عمق التفريغ 0..1
  batteryVoltage: number; // جهد النظام (بطارية البنك)
  batteryNominalVoltage: number; // جهد البطارية الواحدة
  batteryCapacityAh: number; // سعة البطارية الواحدة Ah
  batteryType: BatteryType;
  panelWattage: number; // قدرة اللوح W
  panelVmp: number;
  panelVoc: number;
  panelImp: number;
  panelIsc: number;
  inverterEfficiency: number; // 0..1
  controllerEfficiency: number; // 0..1
  wiringLoss: number; // 0..1
  systemLoss: number; // 0..1 (أتربة، حرارة، عدم تطابق)
  cableLength: number; // متر (مسار واحد)
  cableMaterial: CableMaterial;
  maxVoltageDrop: number; // 0..1
}

export interface ApplianceResult {
  name: string;
  qty: number;
  powerW: number;
  hours: number;
  energyWh: number;
}

export interface CalcResult {
  load: {
    dailyEnergyWh: number;
    peakLoadW: number;
    surgeLoadW: number;
    avgPowerW: number;
    breakdown: ApplianceResult[];
  };
  inverter: {
    recommendedW: number;
    surgeW: number;
    ratedInputCurrentA: number;
    actualInputCurrentA: number;
    outputCurrentA: number;
    recommendedVoltage: number;
    efficiency: number;
  };
  battery: {
    requiredCapacityWh: number;
    requiredCapacityAh: number;
    seriesCount: number;
    parallelStrings: number;
    numBatteries: number;
    bankVoltage: number;
    bankCapacityAh: number;
    bankCapacityWh: number;
    usableWh: number;
    actualAutonomyDays: number;
    maxDischargeA: number;
    type: BatteryType;
    efficiency: number;
    dod: number;
  };
  pv: {
    requiredEnergyWh: number;
    requiredWattage: number;
    numPanels: number;
    arrayWattage: number;
    panelsPerString: number;
    numStrings: number;
    arrayCurrentA: number;
    dailyGenerationWh: number;
    performanceRatio: number;
  };
  controller: {
    recommendedCurrentA: number;
    recommendedVoltage: number;
  };
  cable: {
    currentA: number;
    calculatedArea: number;
    recommendedArea: number;
    voltageDropV: number;
    voltageDropPercent: number;
    powerLossW: number;
    material: CableMaterial;
  };
  protection: {
    arrayBreakerA: number;
    batteryBreakerA: number;
    inverterBreakerA: number;
    acBreakerA: number;
  };
  warnings: string[];
  totals: {
    systemCostIndex: number;
    co2AvoidedKgPerYear: number;
  };
}

export const BATTERY_TYPES: Record<
  BatteryType,
  { label: string; efficiency: number; maxDoD: number; recommendedDoD: number; cycles: number }
> = {
  'lead-acid': { label: 'بطارية رصاص-حمض (Lead-Acid)', efficiency: 0.85, maxDoD: 0.5, recommendedDoD: 0.5, cycles: 800 },
  gel: { label: 'بطارية جل (Gel / AGM)', efficiency: 0.85, maxDoD: 0.6, recommendedDoD: 0.5, cycles: 1200 },
  lifepo4: { label: 'بطارية ليثيوم (LiFePO4)', efficiency: 0.95, maxDoD: 0.9, recommendedDoD: 0.8, cycles: 4000 },
};

export const CABLE_SIZES = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
export const INVERTER_SIZES = [1000, 1500, 2000, 3000, 5000, 6000, 8000, 10000, 12000, 15000, 20000];

const COPPER_RESISTIVITY = 0.0175; // Ω·mm²/m
const ALUMINUM_RESISTIVITY = 0.0282;

function nextStandard(value: number, sizes: number[]): number {
  for (const s of sizes) if (s >= value) return s;
  return sizes[sizes.length - 1];
}

export function roundTo(value: number, decimals = 2): number {
  const f = Math.pow(10, decimals);
  return Math.round(value * f) / f;
}

export function calculateSystem(inputs: SolarInputs): CalcResult {
  const warnings: string[] = [];

  // ---------- 1) دراسة الأحمال ----------
  const breakdown: ApplianceResult[] = inputs.appliances.map((a) => ({
    name: a.name,
    qty: a.qty,
    powerW: a.powerW,
    hours: a.hoursPerDay,
    energyWh: a.qty * a.powerW * a.hoursPerDay,
  }));

  const dailyEnergyWh = breakdown.reduce((sum, a) => sum + a.energyWh, 0);
  const peakLoadW = inputs.appliances.reduce((sum, a) => sum + a.qty * a.powerW, 0);
  const surgeLoadW = inputs.appliances.reduce((sum, a) => {
    const surge = a.surgeW ?? a.powerW;
    return sum + a.qty * Math.max(surge, a.powerW);
  }, 0);
  const avgPowerW = dailyEnergyWh / 24;

  if (dailyEnergyWh <= 0) {
    warnings.push('لم يتم إدخال أحمال كهربائية — أضف جهازاً واحداً على الأقل لبدء الحساب.');
  }

  // ---------- 2) تحجيم العاكس ----------
  const safetyFactor = 1.25;
  const recommendedW = nextStandard(Math.max(peakLoadW * safetyFactor, 500), INVERTER_SIZES);
  const surgeW = Math.ceil(surgeLoadW * 1.2);
  const recommendedVoltage =
    recommendedW < 1500 ? 12 : recommendedW < 3500 ? 24 : 48;
  const actualInputCurrentA = (peakLoadW / inputs.inverterEfficiency) / inputs.batteryVoltage;
  const ratedInputCurrentA = (recommendedW / inputs.inverterEfficiency) / inputs.batteryVoltage;
  const outputCurrentA = recommendedW / 220;

  if (peakLoadW > recommendedW) {
    warnings.push('قدرة الذروة للأحمال تتجاوز قدرة العاكس — يرجى مراجعة أحجام الأجهزة المتزامنة.');
  }
  if (surgeLoadW > surgeW) {
    warnings.push('تيار البدء (Surge) للأجهزة التحريضية مرتفع — اختر عاكساً بقدرة اندفاعية أعلى.');
  }

  // ---------- 3) تحجيم البطارية ----------
  const batt = BATTERY_TYPES[inputs.batteryType];
  const dod = Math.min(inputs.batteryDoD, batt.maxDoD);
  if (inputs.batteryDoD > batt.maxDoD) {
    warnings.push(
      `عمق التفريغ المحدد (${Math.round(inputs.batteryDoD * 100)}%) يتجاوز الحد الآمن لنوع ${batt.label} (${Math.round(batt.maxDoD * 100)}%). تم اعتماد ${Math.round(dod * 100)}%.`
    );
  }
  const requiredCapacityWh = (dailyEnergyWh * inputs.autonomyDays) / (dod * batt.efficiency);
  const requiredCapacityAh = requiredCapacityWh / inputs.batteryVoltage;
  const seriesCount = Math.max(1, Math.round(inputs.batteryVoltage / inputs.batteryNominalVoltage));
  const parallelStrings = Math.max(1, Math.ceil(requiredCapacityAh / inputs.batteryCapacityAh));
  const numBatteries = seriesCount * parallelStrings;
  const bankVoltage = seriesCount * inputs.batteryNominalVoltage;
  const bankCapacityAh = parallelStrings * inputs.batteryCapacityAh;
  const bankCapacityWh = bankCapacityAh * bankVoltage;
  const usableWh = bankCapacityWh * dod * batt.efficiency;
  const actualAutonomyDays = dailyEnergyWh > 0 ? usableWh / dailyEnergyWh : 0;
  const maxDischargeA = bankCapacityAh * (inputs.batteryType === 'lifepo4' ? 1 : 0.2);

  if (actualAutonomyDays < inputs.autonomyDays) {
    warnings.push(
      `الاستقلالية الفعلية (${roundTo(actualAutonomyDays, 1)} يوم) أقل من المطلوب (${inputs.autonomyDays} يوم) — أضف بطاريات.`
    );
  }
  if (actualInputCurrentA > maxDischargeA) {
    warnings.push('تيار سحب العاكس يتجاوز معدل التفريغ الآمن للبطارية — تحقق من توصيل البطاريات على التوازي.');
  }

  // ---------- 4) تحجيم المصفوفة ----------
  const performanceRatio = Math.max(0.5, 1 - inputs.systemLoss);
  const energyPath =
    inputs.inverterEfficiency * inputs.controllerEfficiency * (1 - inputs.wiringLoss) * batt.efficiency;
  const requiredEnergyWh = dailyEnergyWh / Math.max(0.3, energyPath);
  const requiredWattage = requiredEnergyWh / Math.max(1, inputs.psh * performanceRatio);
  const numPanels = Math.max(1, Math.ceil(requiredWattage / inputs.panelWattage));
  const arrayWattage = numPanels * inputs.panelWattage;

  const panelsPerString = Math.max(
    1,
    Math.ceil((inputs.batteryVoltage * 1.3) / inputs.panelVmp)
  );
  const numStrings = Math.ceil(numPanels / panelsPerString);
  const arrayCurrentA = numStrings * inputs.panelImp;
  const dailyGenerationWh = arrayWattage * inputs.psh * performanceRatio;

  if (dailyGenerationWh < dailyEnergyWh) {
    warnings.push('إنتاج المصفوفة اليومي أقل من الاستهلاك اليومي — أضف ألواحاً أو حسّن ساعات الذروة.');
  }

  // ---------- 5) تحجيم منظم الشحن ----------
  const recommendedCurrentA = (arrayWattage / inputs.batteryVoltage) * 1.25;
  const recommendedControllerVoltage = inputs.batteryVoltage;

  // ---------- 6) تحجيم الكابل (DC) ----------
  const resistivity = inputs.cableMaterial === 'copper' ? COPPER_RESISTIVITY : ALUMINUM_RESISTIVITY;
  const cableCurrent = Math.max(recommendedCurrentA, ratedInputCurrentA);
  const vDropMax = inputs.maxVoltageDrop * inputs.batteryVoltage;
  const calculatedArea = (2 * cableCurrent * inputs.cableLength * resistivity) / Math.max(0.1, vDropMax);
  const recommendedArea = nextStandard(Math.max(calculatedArea, 1.5), CABLE_SIZES);
  const voltageDropV = (2 * cableCurrent * inputs.cableLength * resistivity) / recommendedArea;
  const voltageDropPercent = (voltageDropV / inputs.batteryVoltage) * 100;
  const powerLossW = voltageDropV * cableCurrent;

  if (voltageDropPercent > inputs.maxVoltageDrop * 100) {
    warnings.push(
      `هبوط الجهد (${roundTo(voltageDropPercent, 1)}%) يتجاوز الحد الأقصى (${roundTo(inputs.maxVoltageDrop * 100, 1)}%) — زد مقاس الكابل.`
    );
  }

  // ---------- 7) تحجيم الحماية ----------
  const arrayBreakerA = Math.ceil(arrayCurrentA * 1.25 * 1.25);
  const batteryBreakerA = Math.ceil(Math.max(recommendedCurrentA, ratedInputCurrentA) * 1.25);
  const inverterBreakerA = Math.ceil(ratedInputCurrentA * 1.25);
  const acBreakerA = Math.ceil(outputCurrentA * 1.25);

  // ---------- مؤشرات إضافية ----------
  const gridFactor = 0.709; // kg CO2 / kWh (متوسط الشبكة)
  const co2AvoidedKgPerYear = dailyEnergyWh * 365 * gridFactor / 1000;

  return {
    load: {
      dailyEnergyWh: roundTo(dailyEnergyWh, 0),
      peakLoadW: roundTo(peakLoadW, 0),
      surgeLoadW: roundTo(surgeLoadW, 0),
      avgPowerW: roundTo(avgPowerW, 0),
      breakdown,
    },
    inverter: {
      recommendedW,
      surgeW,
      ratedInputCurrentA: roundTo(ratedInputCurrentA, 1),
      actualInputCurrentA: roundTo(actualInputCurrentA, 1),
      outputCurrentA: roundTo(outputCurrentA, 1),
      recommendedVoltage,
      efficiency: inputs.inverterEfficiency,
    },
    battery: {
      requiredCapacityWh: roundTo(requiredCapacityWh, 0),
      requiredCapacityAh: roundTo(requiredCapacityAh, 0),
      seriesCount,
      parallelStrings,
      numBatteries,
      bankVoltage,
      bankCapacityAh,
      bankCapacityWh: roundTo(bankCapacityWh, 0),
      usableWh: roundTo(usableWh, 0),
      actualAutonomyDays: roundTo(actualAutonomyDays, 2),
      maxDischargeA: roundTo(maxDischargeA, 0),
      type: inputs.batteryType,
      efficiency: batt.efficiency,
      dod,
    },
    pv: {
      requiredEnergyWh: roundTo(requiredEnergyWh, 0),
      requiredWattage: roundTo(requiredWattage, 0),
      numPanels,
      arrayWattage,
      panelsPerString,
      numStrings,
      arrayCurrentA: roundTo(arrayCurrentA, 1),
      dailyGenerationWh: roundTo(dailyGenerationWh, 0),
      performanceRatio: roundTo(performanceRatio, 3),
    },
    controller: {
      recommendedCurrentA: roundTo(recommendedCurrentA, 1),
      recommendedVoltage: recommendedControllerVoltage,
    },
    cable: {
      currentA: roundTo(cableCurrent, 1),
      calculatedArea: roundTo(calculatedArea, 2),
      recommendedArea,
      voltageDropV: roundTo(voltageDropV, 2),
      voltageDropPercent: roundTo(voltageDropPercent, 2),
      powerLossW: roundTo(powerLossW, 1),
      material: inputs.cableMaterial,
    },
    protection: {
      arrayBreakerA,
      batteryBreakerA,
      inverterBreakerA,
      acBreakerA,
    },
    warnings,
    totals: {
      systemCostIndex: roundTo(arrayWattage + bankCapacityWh / 40 + recommendedW, 0),
      co2AvoidedKgPerYear: roundTo(co2AvoidedKgPerYear, 0),
    },
  };
}

/** اختيار المكونات المناسبة آلياً من قائمة المنتجات دون إلزام ماركة */
export interface ProductLike {
  id: number;
  name: string;
  brand: string;
  category: string;
  power_w?: number;
  voltage_v?: number;
  capacity_ah?: number;
  capacity_wh?: number;
  current_a?: number;
  price_yer?: number;
}

export interface SelectionItem {
  category: string;
  product: ProductLike;
  quantity: number;
  note: string;
}

export function selectComponents(result: CalcResult, products: ProductLike[]): SelectionItem[] {
  const picks: SelectionItem[] = [];
  const byCat = (c: string) => products.filter((p) => p.category === c);

  // الألواح
  const panels = byCat('panel').filter((p) => (p.power_w ?? 0) > 0);
  if (panels.length) {
    const sorted = [...panels].sort((a, b) => (a.power_w ?? 0) - (b.power_w ?? 0));
    const target = result.pv.requiredWattage;
    // اختر اللوح الذي يقلل عدد الألواح مع بقائه ضمن نطاق معقول
    const best = sorted.find((p) => (p.power_w ?? 0) >= target / Math.ceil(target / (sorted[sorted.length - 1].power_w ?? 1))) ?? sorted[sorted.length - 1];
    const perPanel = best.power_w ?? 100;
    const qty = Math.max(1, Math.ceil(result.pv.requiredWattage / perPanel));
    picks.push({ category: 'panel', product: best, quantity: qty, note: `${perPanel}W × ${qty} = ${perPanel * qty}W` });
  }

  // البطاريات
  const batteries = byCat('battery').filter((p) => (p.capacity_ah ?? 0) > 0 && (p.voltage_v ?? 0) > 0);
  if (batteries.length) {
    const targetWh = result.battery.requiredCapacityWh;
    const sorted = [...batteries].sort((a, b) => (b.capacity_wh ?? 0) - (a.capacity_wh ?? 0));
    const best = sorted.find((p) => (p.capacity_wh ?? 0) >= targetWh / 4) ?? sorted[0];
    const wh = best.capacity_wh ?? (best.capacity_ah ?? 0) * (best.voltage_v ?? 12);
    const qty = Math.max(1, Math.ceil(targetWh / wh));
    picks.push({ category: 'battery', product: best, quantity: qty, note: `${Math.round(wh)}Wh × ${qty}` });
  }

  // العاكس
  const inverters = byCat('inverter').filter((p) => (p.power_w ?? 0) > 0);
  if (inverters.length) {
    const sorted = [...inverters].sort((a, b) => (a.power_w ?? 0) - (b.power_w ?? 0));
    const best = sorted.find((p) => (p.power_w ?? 0) >= result.inverter.recommendedW) ?? sorted[sorted.length - 1];
    picks.push({ category: 'inverter', product: best, quantity: 1, note: `${best.power_w}W` });
  }

  // منظم الشحن
  const controllers = byCat('charge_controller').filter((p) => (p.current_a ?? 0) > 0);
  if (controllers.length) {
    const sorted = [...controllers].sort((a, b) => (a.current_a ?? 0) - (b.current_a ?? 0));
    const best = sorted.find((p) => (p.current_a ?? 0) >= result.controller.recommendedCurrentA) ?? sorted[sorted.length - 1];
    picks.push({ category: 'charge_controller', product: best, quantity: 1, note: `${best.current_a}A` });
  }

  return picks;
}