import type { L } from "@/lib/schemas";
import { Localized } from "./Localized";

export type Stat = { value: string; label: L };

export function Snapshot({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="break-avoid rounded-3xl border border-brand/10 bg-white p-4 text-center shadow-sm"
        >
          <div className="font-display text-3xl font-extrabold leading-none text-brand">
            {s.value}
          </div>
          <p className="mt-1.5 text-xs font-semibold leading-tight text-ink/55">
            <Localized value={s.label} />
          </p>
        </div>
      ))}
    </div>
  );
}
