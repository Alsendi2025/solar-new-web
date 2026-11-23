/**
 * محرك تصميم المنظومات الشمسية — الإصدار الموسّع
 * Design Engine (Extended)
 *
 * يعتمد على أسس هندسية شائعة وقابلة للتحقق:
 *  - تحجيم الألواح: P_pv = E_req / (PSH × PR)
 *  - تحجيم البطارية: C(Wh) = (متوسط الحمل × ساعات الاستقلالية) / (DoD × η)
 *  - تحجيم العاكس: P_inv ≥ P_peak × معامل الأمان
 *  - توافق MPPT: نطاق جهد السلسلة (Vmp) ضمن نطاق المدخل، والتيار ضمن حد الدخل
 *
 * تنبيه: قيم الإشعاع الشمسي (PSH) تقديرية مجمّعة ومتوسطة، وليست قياسات محطات
 * أرصاد دقيقة. يجب التحقق منها عبر مصادر محلية (Global Solar Atlas / NASA POWER)
 * قبل الاعتماد التنفيذي. المنحنيات الليلية/النهارية نموذجية تقديرية.
 */

export type BatteryType = 'lifepo4' | 'lead-acid' | 'gel';
export type SystemType = 'solar-battery' | 'hybrid-generator' | 'grid-tied' | 'grid-assist';
export type UsageType = 'home' | 'shop' | 'office' | 'farm' | 'institution';

export interface BatteryTypeDef {
  label: string;
  dod: number;
  maxDoD: number;
  efficiency: number;
  unitVoltage: number;
  unitAh: number;
}

export const BATTERY_TYPES: Record<BatteryType, BatteryTypeDef> = {
  lifepo4: { label: 'بطارية ليثيوم LiFePO4', dod: 0.8, maxDoD: 0.9, efficiency: 0.95, unitVoltage: 12, unitAh: 100 },
  'lead-acid': { label: 'بطارية رصاص-حمض Lead-Acid', dod: 0.5, maxDoD: 0.5, efficiency: 0.85, unitVoltage: 12, unitAh: 200 },
  gel: { label: 'بطارية جل / AGM', dod: 0.5, maxDoD: 0.6, efficiency: 0.85, unitVoltage: 12, unitAh: 200 },
};

export const SYSTEM_TYPES: Record<SystemType, string> = {
  'solar-battery': 'شمسي مع بطاريات (Off-Grid)',
  'hybrid-generator': 'هجين مع مولد احتياطي',
  'grid-tied': 'متصل بالشبكة (On-Grid)',
  'grid-assist': 'هجين مع الاستفادة من الشبكة',
};

export const USAGE_TYPES: Record<UsageType, string> = {
  home: 'منزل',
  shop: 'محل تجاري',
  office: 'مكتب',
  farm: 'مزرعة',
  institution: 'مؤسسة / مركز',
};

/** مواصفات نموذجية لألواح السوق (تحكمها ورقة بيانات المصنّع) */
export const PANEL_SPECS: Record<number, { vmp: number; imp: number; voc: number; isc: number }> = {
  100: { vmp: 18.0, imp: 5.56, voc: 22.0, isc: 5.9 },
  150: { vmp: 18.0, imp: 8.33, voc: 22.0, isc: 8.8 },
  300: { vmp: 32.0, imp: 9.4, voc: 38.0, isc: 9.9 },
  350: { vmp: 34.0, imp: 10.3, voc: 41.0, isc: 10.9 },
  500: { vmp: 41.0, imp: 12.2, voc: 49.0, isc: 12.9 },
  700: { vmp: 41.5, imp: 16.9, voc: 49.5, isc: 17.8 },
};

export const MARKET_WATTAGES = [100, 150, 300, 350, 500, 700];

export interface DesignAssumptions {
  /** معامل الأداء الإجمالي (حرارة + أتربة + عدم تطابق) 0..1 */
  performanceRatio: number;
  /** فواقد التوصيل 0..1 */
  wiringLoss: number;
  /** كفاءة العاكس 0..1 */
  inverterEff: number;
  /** كفاءة منظم الشحن 0..1 */
  controllerEff: number;
  /** معامل الذروة للطرق غير التفصيلية (الذروة = متوسط الحمل × المعامل) */
  peakFactor: number;
}

export const DEFAULT_ASSUMPTIONS: DesignAssumptions = {
  performanceRatio: 0.83,
  wiringLoss: 0.02,
  inverterEff: 0.9,
  controllerEff: 0.97,
  peakFactor: 3.0,
};

export interface DesignInput {
  city: string;
  psh: number;
  dailyEnergyWh: number;
  peakLoadW: number;
  autonomyHours: number;
  batteryType: BatteryType;
  systemType: SystemType;
  usageType: UsageType;
  panelWattage: number;
  assumptions: DesignAssumptions;
  /** أوزان استهلاك 24 ساعة (اختياري) */
  hourlyWeights?: number[];
}

export interface VerificationCheck {
  key: string;
  label: string;
  status: 'ok' | 'warn' | 'unknown';
  detail: string;
}

export interface DesignResult {
  system: {
    arrayWattage: number;
    numPanels: number;
    panelWattage: number;
    panelVmp: number;
    panelImp: number;
    panelsPerString: number;
    numStrings: number;
    totalCapacityKw: number;
  };
  inverter: {
    recommendedW: number;
    numInverters: number;
    batteryVoltage: number;
    mpptInputs: number;
    vMin: number;
    vMax: number;
    iMax: number;
    stringVmp: number;
    stringImp: number;
  };
  battery: {
    required: boolean;
    nominalWh: number;
    usableWh: number;
    nominalAh: number;
    usableAh: number;
    voltage: number;
    dod: number;
    type: BatteryType;
    unitVoltage: number;
    unitAh: number;
    seriesCount: number;
    parallelStrings: number;
    numUnits: number;
  };
  production: {
    dailyGenerationWh: number;
    performanceRatio: number;
    requiredWattage: number;
    specificYield: number;
  };
  curves: {
    hours: number[];
    generation: number[];
    consumption: number[];
    soc: number[];
    peakHour: number;
    eveningStart: number;
  };
  verification: VerificationCheck[];
  assumptions: string[];
  warnings: string[];
}

const INVERTER_SIZES = [1000, 1500, 2000, 3000, 5000, 6000, 8000, 10000, 12000, 15000, 20000];

function nextStandard(value: number, sizes: number[]): number {
  for (const s of sizes) if (s >= value) return s;
  return sizes[sizes.length - 1];
}

/** أوزان استهلاك نموذجية لكل 24 ساعة حسب نوع الاستخدام */
const USAGE_WEIGHTS: Record<UsageType, number[]> = {
  home: [0.3, 0.25, 0.2, 0.2, 0.2, 0.3, 0.6, 1.0, 0.8, 0.5, 0.4, 0.4, 0.5, 0.4, 0.4, 0.5, 0.7, 1.0, 1.2, 1.3, 1.2, 1.0, 0.7, 0.4],
  shop: [0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.5, 0.8, 1.0, 1.2, 1.3, 1.3, 1.2, 1.2, 1.3, 1.3, 1.2, 1.1, 1.0, 0.9, 0.7, 0.5, 0.3, 0.2],
  office: [0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.4, 0.7, 1.2, 1.4, 1.4, 1.3, 1.2, 1.4, 1.4, 1.3, 1.0, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
  farm: [0.3, 0.3, 0.3, 0.3, 0.4, 0.6, 0.8, 1.0, 1.1, 1.2, 1.4, 1.5, 1.6, 1.5, 1.4, 1.2, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3],
  institution: [0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.6, 0.9, 1.2, 1.3, 1.3, 1.2, 1.1, 1.3, 1.3, 1.2, 1.0, 0.7, 0.5, 0.4, 0.3, 0.3, 0.3, 0.3],
};

function normalize(weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  return weights.map((w) => w / sum);
}

/** توليد منحنى إنتاج شمسي نموذجي (نصف جيبي)ιβ؛ القمم عند الظهر */
function generationShape(daylightStart = 6, daylightEnd = 18): number[] {
  const arr: number[] = [];
  const len = daylightEnd - daylightStart;
  for (let h = 0; h < 24; h++) {
    if (h < daylightStart || h >= daylightEnd) {
      arr.push(0);
    } else {
      arr.push(Math.sin((Math.PI * (h - daylightStart + 0.5)) / len));
    }
  }
  return normalize(arr);
}

function roundTo(v: number, d = 2): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

export function designSystem(input: DesignInput): DesignResult {
  const { assumptions } = input;
  const warnings: string[] = [];
  const assumptionNotes: string[] = [];

  const daily = Math.max(0, input.dailyEnergyWh);
  const batt = BATTERY_TYPES[input.batteryType];

  // ---- الأداء الإجمالي ----
  const pr = Math.min(0.95, Math.max(0.5, assumptions.performanceRatio));
  assumptionNotes.push(
    `معامل الأداء (PR) المفترض ${(pr * 100).toFixed(0)}% — تقدير يشمل الحرارة والأتربة وعدم التطابق (قابل للتعديل).`
  );

  // ---- المصفوفة ----
  const energyPath =
    assumptions.inverterEff * assumptions.controllerEff * (1 - assumptions.wiringLoss) *
    (input.systemType === 'grid-tied' ? 1 : batt.efficiency);
  const requiredEnergyWh = daily / Math.max(0.3, energyPath);
  const requiredWattage = requiredEnergyWh / Math.max(1, input.psh * pr);
  const panelWattage = input.panelWattage;
  const spec = PANEL_SPECS[panelWattage] ?? PANEL_SPECS[500];
  const numPanels = Math.max(1, Math.ceil(requiredWattage / panelWattage));
  const arrayWattage = numPanels * panelWattage;

  // ---- العاكس ----
  const recommendedW = nextStandard(Math.max(input.peakLoadW * 1.25, 500), INVERTER_SIZES);
  const batteryVoltage = recommendedW < 1500 ? 12 : recommendedW < 3500 ? 24 : 48;
  const numInverters = Math.max(1, Math.ceil(recommendedW / 20000));
  const mpptInputs = recommendedW <= 3000 ? 1 : 2;
  // نطاق MPPT نموذجي حسب جهد البطارية
  const vMax = batteryVoltage >= 48 ? 500 : batteryVoltage >= 24 ? 250 : 150;
  const vMin = batteryVoltage >= 48 ? 60 : batteryVoltage >= 24 ? 40 : 20;
  const iMax = batteryVoltage >= 48 ? 30 : batteryVoltage >= 24 ? 40 : 60;

  // ---- توصيل الألواح (سلسلة/توازي) ----
  const minSeriesByV = Math.ceil((batteryVoltage * 1.3) / spec.vmp);
  const maxSeriesByV = Math.max(1, Math.floor(vMax / spec.vmp));
  let panelsPerString = Math.min(maxSeriesByV, Math.max(minSeriesByV, 1));
  if (panelsPerString < 1) panelsPerString = 1;
  const numStrings = Math.ceil(numPanels / panelsPerString);
  const stringVmp = roundTo(panelsPerString * spec.vmp, 1);
  const stringImp = roundTo(spec.imp, 1);

  // ---- البطارية ----
  const needsBattery = input.systemType !== 'grid-tied' && input.autonomyHours > 0;
  const autonomyDays = input.autonomyHours / 24;
  const requiredWh = needsBattery
    ? ((daily / 24) * input.autonomyHours) / (batt.dod * batt.efficiency)
    : 0;
  const requiredAh = requiredWh / batteryVoltage;
  const seriesCount = Math.max(1, Math.round(batteryVoltage / batt.unitVoltage));
  const parallelStrings = needsBattery ? Math.max(1, Math.ceil(requiredAh / batt.unitAh)) : 0;
  const numUnits = seriesCount * parallelStrings;
  const nominalWh = numUnits * batt.unitVoltage * batt.unitAh;
  const usableWh = nominalWh * batt.dod * batt.efficiency;
  const nominalAh = nominalWh / batteryVoltage;
  const usableAh = usableWh / batteryVoltage;

  if (needsBattery && input.autonomyHours > 16) {
    warnings.push('ساعات استقلالية طويلة (أكثر من 16 ساعة) — تأكد من ملاءمة حجم البطارية للميزانية والمساحة.');
  }
  if (input.systemType === 'grid-tied') {
    assumptionNotes.push('النظام المتصل بالشبكة (On-Grid) لا يتضمن تخزيناً بالبطاريات — لا يوجد استقلالية عند انقطاع الشبكة.');
  }

  // ---- الإنتاج اليومي ----
  const dailyGenerationWh = arrayWattage * input.psh * pr;

  // ---- المنحنيات ----
  const genShape = generationShape(6, 18);
  const dailyGen = dailyGenerationWh;
  const generation = genShape.map((s) => roundTo(s * dailyGen, 0));

  const weights = input.hourlyWeights && input.hourlyWeights.length === 24
    ? normalize(input.hourlyWeights)
    : normalize(USAGE_WEIGHTS[input.usageType]);
  const consumption = weights.map((w) => roundTo(w * daily, 0));

  // محاكاة حالة الشحن SOC
  const soc: number[] = [];
  const capacity = Math.max(nominalWh, 1);
  const floor = Math.max(0, nominalWh - usableWh);
  let stored = capacity; // نبدأ ممتلئاً
  for (let h = 0; h < 24; h++) {
    const net = generation[h] - consumption[h];
    if (net >= 0) {
      stored = Math.min(capacity, stored + net * assumptions.controllerEff);
    } else {
      stored = Math.max(floor, stored + net / assumptions.inverterEff);
    }
    soc.push(roundTo((stored / capacity) * 100, 0));
  }

  // ساعات الذروة (أعلى استهلاك) والمساء
  let peakHour = 0;
  for (let h = 1; h < 24; h++) if (consumption[h] > consumption[peakHour]) peakHour = h;

  // ---- التحقق الهندسي ----
  const verification: VerificationCheck[] = [];

  verification.push({
    key: 'inverter_peak',
    label: 'ملاءمة العاكس لحمل الذروة',
    status: input.peakLoadW <= recommendedW ? 'ok' : 'warn',
    detail: `حمل الذروة ${roundTo(input.peakLoadW, 0)}W مقابل قدرة العاكس ${recommendedW}W (مع هامش 25%).`,
  });

  if (needsBattery) {
    verification.push({
      key: 'battery_voltage',
      label: 'توافق جهد البطارية مع العاكس',
      status: 'ok',
      detail: `جهد بنك البطاريات ${batteryVoltage}V مطابق لجهد دخل العاكس المصمم.`,
    });
  } else {
    verification.push({
      key: 'battery_voltage',
      label: 'توافق جهد البطارية مع العاكس',
      status: 'unknown',
      detail: 'لا توجد بطاريات في هذا النظام — تحقق من جهد دخل العاكس عند الإضافة لاحقاً.',
    });
  }

  const vWithin = stringVmp >= vMin && stringVmp <= vMax;
  const iWithin = stringImp <= iMax;
  verification.push({
    key: 'mppt_voltage',
    label: 'توافق جهد الألواح مع مدخل MPPT',
    status: vWithin && iWithin ? 'ok' : 'warn',
    detail: `جهد السلسلة ${stringVmp}V (المدخل ${vMin}-${vMax}V)، تيار السلسلة ${stringImp}A (الحد ${iMax}A). النطاق نموذجي — تحقق من ورقة بيانات العاكس الفعلية.`,
  });

  verification.push({
    key: 'mppt_data',
    label: 'اكتمال البيانات الفنية للمكونات',
    status: 'unknown',
    detail: 'المواصفات (Vmp/Imp ونطاق MPPT) تقديرية نموذجية. يلزم إدخال أوراق البيانات الفعلية للألواح والعاكس لتأكيد التوافق النهائي.',
  });

  if (daily > 0 && dailyGenerationWh < daily) {
    warnings.push('الإنتاج اليومي المتوقع أقل من الاستهلاك اليومي — أضف ألواحاً أو حسّن معدل الإشعاع.');
  }

  return {
    system: {
      arrayWattage,
      numPanels,
      panelWattage,
      panelVmp: spec.vmp,
      panelImp: spec.imp,
      panelsPerString,
      numStrings,
      totalCapacityKw: roundTo(arrayWattage / 1000, 2),
    },
    inverter: {
      recommendedW,
      numInverters,
      batteryVoltage,
      mpptInputs,
      vMin,
      vMax,
      iMax,
      stringVmp,
      stringImp,
    },
    battery: {
      required: needsBattery,
      nominalWh: roundTo(nominalWh, 0),
      usableWh: roundTo(usableWh, 0),
      nominalAh: roundTo(nominalAh, 0),
      usableAh: roundTo(usableAh, 0),
      voltage: batteryVoltage,
      dod: batt.dod,
      type: input.batteryType,
      unitVoltage: batt.unitVoltage,
      unitAh: batt.unitAh,
      seriesCount,
      parallelStrings,
      numUnits,
    },
    production: {
      dailyGenerationWh: roundTo(dailyGenerationWh, 0),
      performanceRatio: pr,
      requiredWattage: roundTo(requiredWattage, 0),
      specificYield: roundTo(input.psh * pr, 2),
    },
    curves: {
      hours: Array.from({ length: 24 }, (_, i) => i),
      generation,
      consumption,
      soc,
      peakHour,
      eveningStart: 18,
    },
    verification,
    assumptions: assumptionNotes,
    warnings,
  };
}