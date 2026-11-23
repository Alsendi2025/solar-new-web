import type { SolarInputs, Appliance } from './solarEngine';

/** بيانات المدن اليمنية — متوسط ساعات الذروة الشمسية السنوية (PSH) */
export const YEMEN_CITIES: { name: string; psh: number; lat: string }[] = [
  { name: 'صنعاء', psh: 5.9, lat: '15.35°N' },
  { name: 'عدن', psh: 6.1, lat: '12.79°N' },
  { name: 'تعز', psh: 5.6, lat: '13.58°N' },
  { name: 'الحديدة', psh: 5.3, lat: '14.80°N' },
  { name: 'إب', psh: 5.2, lat: '13.97°N' },
  { name: 'المكلا', psh: 6.0, lat: '14.54°N' },
  { name: "صعدة", psh: 5.8, lat: '16.94°N' },
  { name: 'مأرب', psh: 6.0, lat: '15.46°N' },
  { name: 'الريان / حضرموت', psh: 6.2, lat: '15.00°N' },
  { name: 'ذمار', psh: 5.6, lat: '14.55°N' },
  { name: 'المهرة', psh: 6.1, lat: '16.20°N' },
  { name: 'لحج', psh: 6.0, lat: '13.05°N' },
];

/** أحمال افتراضية شائعة في المنازل اليمنية */
export const APPLIANCE_PRESETS: Omit<Appliance, 'id'>[] = [
  { name: 'إضاءة LED', qty: 8, powerW: 10, hoursPerDay: 5 },
  { name: 'مروحة سقف', qty: 3, powerW: 60, hoursPerDay: 8 },
  { name: 'ثلاجة', qty: 1, powerW: 150, hoursPerDay: 8, surgeW: 600 },
  { name: 'تلفاز', qty: 1, powerW: 90, hoursPerDay: 6 },
  { name: 'مكيف هواء (سبليت)', qty: 1, powerW: 1200, hoursPerDay: 6, surgeW: 2400 },
  { name: 'غسالة', qty: 1, powerW: 500, hoursPerDay: 1, surgeW: 1200 },
  { name: 'مضخة مياه', qty: 1, powerW: 750, hoursPerDay: 2, surgeW: 1800 },
  { name: 'كمبيوتر / لابتوب', qty: 1, powerW: 120, hoursPerDay: 6 },
  { name: 'راوتر إنترنت', qty: 1, powerW: 15, hoursPerDay: 24 },
  { name: 'هاتف / شاحن', qty: 4, powerW: 20, hoursPerDay: 3 },
  { name: 'ميكروويف', qty: 1, powerW: 1000, hoursPerDay: 1 },
  { name: 'سخان ماء كهربائي', qty: 1, powerW: 1500, hoursPerDay: 2 },
];

export const DEFAULT_INPUTS: SolarInputs = {
  appliances: [
    { id: 'a1', name: 'إضاءة LED', qty: 8, powerW: 10, hoursPerDay: 5 },
    { id: 'a2', name: 'مروحة سقف', qty: 3, powerW: 60, hoursPerDay: 8 },
    { id: 'a3', name: 'ثلاجة', qty: 1, powerW: 150, hoursPerDay: 8, surgeW: 600 },
    { id: 'a4', name: 'تلفاز', qty: 1, powerW: 90, hoursPerDay: 6 },
    { id: 'a5', name: 'راوتر إنترنت', qty: 1, powerW: 15, hoursPerDay: 24 },
  ],
  city: 'صنعاء',
  psh: 5.9,
  autonomyDays: 1,
  batteryDoD: 0.5,
  batteryVoltage: 24,
  batteryNominalVoltage: 12,
  batteryCapacityAh: 200,
  batteryType: 'lead-acid',
  panelWattage: 550,
  panelVmp: 41.7,
  panelVoc: 49.8,
  panelImp: 13.2,
  panelIsc: 13.9,
  inverterEfficiency: 0.9,
  controllerEfficiency: 0.97,
  wiringLoss: 0.02,
  systemLoss: 0.2,
  cableLength: 5,
  cableMaterial: 'copper',
  maxVoltageDrop: 0.03,
};

export const PANEL_PRESETS = [
  { wattage: 100, vmp: 18.0, voc: 22.0, imp: 5.56, isc: 5.9 },
  { wattage: 250, vmp: 30.5, voc: 37.5, imp: 8.2, isc: 8.6 },
  { wattage: 400, vmp: 34.5, voc: 41.5, imp: 11.6, isc: 12.2 },
  { wattage: 550, vmp: 41.7, voc: 49.8, imp: 13.2, isc: 13.9 },
  { wattage: 650, vmp: 41.5, voc: 49.5, imp: 15.7, isc: 16.5 },
];

export const BATTERY_PRESETS = [
  { label: 'بطارية 12V 100Ah', voltage: 12, capacityAh: 100 },
  { label: 'بطارية 12V 150Ah', voltage: 12, capacityAh: 150 },
  { label: 'بطارية 12V 200Ah', voltage: 12, capacityAh: 200 },
  { label: 'بطارية 12V 250Ah', voltage: 12, capacityAh: 250 },
  { label: 'بطارية 24V 100Ah', voltage: 24, capacityAh: 100 },
  { label: 'بطارية 48V 100Ah', voltage: 48, capacityAh: 100 },
];

export const WHATSAPP_NUMBER = '967700000000'; // الرقم الرسمي للمنصة (يُعدّل من الإدارة)

export const SERVICE_CATEGORIES = [
  'تصميم منظومة',
  'دراسة أحمال',
  'توريد مكونات',
  'تنفيذ وتركيب',
  'استشارة فنية',
  'صيانة',
];