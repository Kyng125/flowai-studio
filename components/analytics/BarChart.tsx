'use client';

import { COLORS } from '@/lib/tokens';

interface BarChartProps {
  data: number[];
  labels?: string[];
  accentColor?: string;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function BarChart({ data, labels = DAY_LABELS, accentColor = COLORS.gold }: BarChartProps) {
  const max = Math.max(...data, 1);
  const avg = Math.round(data.reduce((s, v) => s + v, 0) / data.length);

  return (
    <div>
      <div className="flex items-end gap-2 h-40">
        {data.map((value, i) => {
          const heightPct = Math.round((value / max) * 100);
          const isAboveAvg = value >= avg;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
              <span className="text-[10px] text-white/30">{value}%</span>
              <div
                className="w-full rounded-t transition-all duration-700 hover:opacity-80"
                style={{
                  height: `${heightPct}%`,
                  background: isAboveAvg
                    ? `linear-gradient(to top, ${accentColor}cc, ${accentColor}44)`
                    : `linear-gradient(to top, ${accentColor}55, ${accentColor}11)`,
                  border: `1px solid ${accentColor}${isAboveAvg ? '60' : '30'}`,
                  minHeight: 4,
                }}
              />
              <span className="text-[10px] text-white/30">{labels[i]}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex gap-4">
        <span className="text-xs text-white/30">Avg: {avg}%</span>
        <span className="text-xs text-white/30">Peak: {max}%</span>
      </div>
    </div>
  );
}
