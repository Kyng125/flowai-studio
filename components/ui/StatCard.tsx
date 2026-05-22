import { COLORS } from '@/lib/tokens';

interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      className="p-4 rounded-xl border hover:scale-[1.02] transition-transform duration-200"
      style={{
        background: COLORS.surface,
        borderColor: COLORS.border,
        boxShadow: `0 0 20px ${COLORS.gold}10`,
      }}
    >
      <p className="text-xs text-white/40">{label}</p>
      <h4 className="text-2xl font-semibold mt-2">{value}</h4>
    </div>
  );
}
