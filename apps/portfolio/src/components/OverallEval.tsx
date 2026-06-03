import type { Overall } from "@/lib/schemas";
import { Localized } from "./Localized";

export function OverallEval({ data }: { data: Overall }) {
  return (
    <div className="break-avoid rounded-3xl border border-brand/15 bg-white p-6 shadow-sm">
      <p className="font-display text-lg font-semibold leading-relaxed text-ink sm:text-xl">
        <Localized value={data.verdict} />
      </p>
      <p className="mt-3 leading-relaxed text-ink/65">
        <Localized value={data.placement} />
      </p>

      <div className="mt-4">
        <p className="mb-2 text-sm font-semibold text-ink/50">
          <span data-lang="vi">Phù hợp định hướng tương lai</span>
          <span data-lang="en">Well suited to</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {data.futureFields.map((f, i) => (
            <span
              key={i}
              className="rounded-full border border-brand/15 bg-brand/8 px-3 py-1 text-sm font-semibold text-brand"
            >
              <Localized value={f} />
            </span>
          ))}
        </div>
      </div>

      {data.growthNote && (
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-accent/12 px-3 py-2 text-sm text-ink/65">
          <span aria-hidden>🎯</span>
          <span>
            <Localized value={data.growthNote} />
          </span>
        </p>
      )}
    </div>
  );
}
