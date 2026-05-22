'use client';

interface Segment {
  value: number;
  color: string;
  label: string;
}

interface RingChartProps {
  segments: Segment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
}

export function RingChart({
  segments,
  size = 120,
  thickness = 18,
  centerLabel,
  centerSub,
}: RingChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) {
    return (
      <div
        className="rounded-full border-2 border-white/10 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-white/25">No data</span>
      </div>
    );
  }

  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  let offset = 0;
  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const dash = pct * circ;
    const arc = { ...seg, pct, dash, offset };
    offset += dash;
    return arc;
  });

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={thickness}
        />
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={thickness}
            strokeDasharray={`${arc.dash - 2} ${circ - arc.dash + 2}`}
            strokeDashoffset={-arc.offset}
            strokeLinecap="round"
          />
        ))}
      </svg>
      {(centerLabel || centerSub) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerLabel && <p className="text-lg font-semibold leading-none">{centerLabel}</p>}
          {centerSub && <p className="text-[10px] text-white/35 mt-0.5">{centerSub}</p>}
        </div>
      )}
    </div>
  );
}
