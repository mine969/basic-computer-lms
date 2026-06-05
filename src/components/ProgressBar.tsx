export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-base font-extrabold">
        <span>{label ?? "Progress"}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-2 h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-leaf"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
