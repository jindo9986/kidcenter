import type { Strength } from "@/lib/schemas";
import { Localized } from "./Localized";

export function Strengths({ items }: { items: Strength[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((s, i) => (
        <div
          key={i}
          className="break-avoid flex gap-3 rounded-3xl border border-black/5 bg-white p-4 shadow-sm"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/20 text-2xl">
            {s.icon}
          </span>
          <div>
            <h3 className="font-bold text-ink">
              <Localized value={s.title} />
            </h3>
            <p className="mt-0.5 text-sm leading-relaxed text-ink/65">
              <Localized value={s.detail} />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
