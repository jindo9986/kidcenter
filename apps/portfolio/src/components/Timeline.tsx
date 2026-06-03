import type { JourneyMilestone } from "@/lib/schemas";
import { Localized } from "./Localized";

export function Timeline({ items }: { items: JourneyMilestone[] }) {
  return (
    <ol className="relative ml-3 border-l-2 border-brand/20">
      {items.map((m, i) => (
        <li key={i} className="break-avoid mb-6 ml-6">
          <span className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm">
            {m.icon}
          </span>
          <p className="text-xs font-semibold text-ink/40">{m.date}</p>
          <h3 className="font-bold text-ink">
            <Localized value={m.title} />
          </h3>
          <p className="text-sm text-ink/70">
            <Localized value={m.body} />
          </p>
        </li>
      ))}
    </ol>
  );
}
