import type {
  BatteryType, SystemType, UsageType, DesignAssumptions,
} from '../../lib/designEngine';

export interface AdvancedSettings {
  batteryType: BatteryType;
  systemType: SystemType;
  autonomyHours: number;
  panelWattage: number;
}

export interface MethodOutput {
  city: string;
  psh: number;
  dailyEnergyWh: number;
  peakLoadW: number;
  usageType: UsageType;
  hourlyWeights?: number[];
  batteryType: BatteryType;
  systemType: SystemType;
  autonomyHours: number;
  panelWattage: number;
  assumptions: DesignAssumptions;
  methodLabel: string;
  ready: boolean;
}

export interface ManualAppliance {
  id: string;
  name: string;
  qty: number;
  powerW: number;
  unit: 'W' | 'kW';
  hours: number;
  period: 'day' | 'night' | '24h';
}