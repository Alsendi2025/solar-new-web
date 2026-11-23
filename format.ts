export function formatNumber(value: number, decimals = 0): string {
  if (!isFinite(value)) return '0';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(yer?: number | null): string {
  if (yer == null || !isFinite(yer)) return '—';
  return `${formatNumber(yer)} ر.ي`;
}

export function formatEnergy(wh: number): string {
  if (wh >= 1000) return `${formatNumber(wh / 1000, 1)} kWh`;
  return `${formatNumber(wh)} Wh`;
}

export function formatPower(w: number): string {
  if (w >= 1000) return `${formatNumber(w / 1000, 2)} kW`;
  return `${formatNumber(w)} W`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
}