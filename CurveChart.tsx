import type { DesignResult } from '../../lib/designEngine';

const W = 720;
const H = 300;
const PAD_L = 44;
const PAD_R = 44;
const PAD_T = 16;
const PAD_B = 28;

export default function CurveChart({ curves }: { curves: DesignResult['curves'] }) {
  const { generation, consumption, soc, peakHour, eveningStart } = curves;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const maxW = Math.max(...generation, ...consumption, 1);
  const niceMax = Math.ceil(maxW / 100) * 100 || 100;

  const x = (h: number) => PAD_L + (h / 23) * innerW;
  const yW = (v: number) => PAD_T + innerH - (v / niceMax) * innerH;
  const ySoc = (v: number) => PAD_T + innerH - (v / 100) * innerH;

  const line = (arr: number[], yFn: (v: number) => number) =>
    arr.map((v, h) => `${h === 0 ? 'M' : 'L'} ${x(h).toFixed(1)} ${yFn(v).toFixed(1)}`).join(' ');

  const genLine = line(generation, yW);
  const consLine = line(consumption, yW);
  const socLine = line(soc, ySoc);
  const genArea = `${genLine} L ${x(23).toFixed(1)} ${(PAD_T + innerH).toFixed(1)} L ${x(0).toFixed(1)} ${(PAD_T + innerH).toFixed(1)} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="منحنى الإنتاج والاستهلاك خلال 24 ساعة">
        <defs>
          <linearGradient id="genFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* تظليل الفترة المسائية */}
        <rect
          x={x(eveningStart)}
          y={PAD_T}
          width={x(23) - x(eveningStart)}
          height={innerH}
          fill="#0f172a"
          opacity="0.04"
        />
        <text x={x(eveningStart) + 6} y={PAD_T + 12} className="fill-slate-400" fontSize="9">الفترة المسائية</text>

        {/* خطوط الشبكة الأفقية */}
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={PAD_L} x2={W - PAD_R} y1={yW(t * niceMax)} y2={yW(t * niceMax)} stroke="#e2e8f0" strokeWidth="1" />
            <text x={PAD_L - 6} y={yW(t * niceMax) + 3} textAnchor="end" className="fill-slate-400" fontSize="9">{Math.round(t * niceMax)}</text>
            <text x={W - PAD_R + 6} y={ySoc(t * 100) + 3} textAnchor="start" className="fill-slate-400" fontSize="9">{Math.round(t * 100)}%</text>
          </g>
        ))}

        {/* منطقة الإنتاج */}
        <path d={genArea} fill="url(#genFill)" />
        <path d={genLine} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />

        {/* خط الاستهلاك */}
        <path d={consLine} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />

        {/* خط حالة الشحن */}
        <path d={socLine} fill="none" stroke="#0d9488" strokeWidth="1.8" strokeDasharray="5 4" strokeLinejoin="round" />

        {/* مؤشر الذروة */}
        <line x1={x(peakHour)} x2={x(peakHour)} y1={PAD_T} y2={PAD_T + innerH} stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        <text x={x(peakHour)} y={PAD_T + innerH - 4} textAnchor="middle" className="fill-red-500" fontSize="9">ذروة {peakHour}:00</text>

        {/* محور الساعات */}
        {[0, 3, 6, 9, 12, 15, 18, 21, 23].map((h) => (
          <text key={h} x={x(h)} y={H - 8} textAnchor="middle" className="fill-slate-400" fontSize="9">{h}</text>
        ))}
        <text x={PAD_L} y={H - 8} textAnchor="start" className="fill-slate-400" fontSize="9" dx="-30">ساعة</text>
      </svg>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-amber-500" /> الإنتاج الشمسي (W)</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-blue-600" /> الاستهلاك (W)</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 border-t-2 border-dashed border-teal-600" /> حالة شحن البطارية (%)</span>
      </div>
      <p className="mt-1 text-center text-[10px] text-slate-400">المنحنيات نموذجية تقديرية (ليست قياسات فعلية لكل ساعة) — للتوضيح فقط.</p>
    </div>
  );
}