export default function ProgressRing({
  value,
  total,
  label,
}: {
  value: number;
  total: number;
  label: string;
}) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="flex items-center gap-4">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} stroke="#e2e8f0" strokeWidth="8" fill="none" />
        <circle
          cx="48"
          cy="48"
          r={r}
          stroke="#f59e0b"
          strokeWidth="8"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div>
        <div className="text-2xl font-bold text-slate-900">{pct}%</div>
        <div className="text-sm text-slate-600">
          {value} / {total} {label}
        </div>
      </div>
    </div>
  );
}
