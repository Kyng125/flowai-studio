'use client';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export function Sparkline({ data, width = 200, height = 50, color = '#D4AF37' }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height * 0.8) - height * 0.1;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');
  // Fill path: go down to bottom-right, bottom-left, back up
  const last = points[points.length - 1];
  const [lx] = last.split(',');
  const fillPath = `M ${points[0]} L ${polyline.slice(polyline.indexOf(' ') + 1)} L ${lx},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill="url(#spark-fill)" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Latest value dot */}
      {(() => {
        const [x, y] = last.split(',').map(Number);
        return <circle cx={x} cy={y} r="3" fill={color} />;
      })()}
    </svg>
  );
}
