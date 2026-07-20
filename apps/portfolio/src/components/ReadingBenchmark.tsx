import type { ReadingBenchmark as Data } from "@/lib/schemas";
import { Localized } from "./Localized";

/**
 * External reading benchmark (NGRT). Deliberately reports BOTH components — the
 * above-average one and the below-average one — plus the norm context, so the
 * result is never overstated.
 */
export function ReadingBenchmark({ data }: { data: Data }) {
  return (
    <div className="break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
      {/* header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-ink">
          <Localized value={data.test} />
        </h3>
        <p className="text-xs text-ink/45">
          {data.provider} · {data.date} ·{" "}
          <Localized value={{ vi: `Tuổi khi thi ${data.ageAtTest}`, en: `Age ${data.ageAtTest}` }} />
        </p>
      </div>

      {/* overall */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { k: { vi: "Điểm chuẩn tuổi", en: "Standard Age Score" }, v: data.overall.sas },
          { k: { vi: "Bách phân vị", en: "Percentile" }, v: data.overall.pr },
          { k: { vi: "Stanine", en: "Stanine" }, v: data.overall.stanine },
          { k: { vi: "Tuổi đọc", en: "Reading age" }, v: data.overall.readingAge },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-black/5 bg-cream p-3 text-center">
            <p className="font-display text-xl font-extrabold text-brand">{s.v}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-ink/55">
              <Localized value={s.k} />
            </p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-xs font-semibold text-ink/55">
        <Localized value={data.overall.band} />
      </p>

      {/* the two components — strength and growth area, side by side */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {data.parts.map((part, i) => {
          const strong = part.tone === "strong";
          return (
            <div
              key={i}
              className={
                "rounded-2xl border p-4 " +
                (strong ? "border-teal/30 bg-teal/5" : "border-accent/40 bg-accent/10")
              }
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-sm font-bold text-ink">
                  <Localized value={part.name} />
                </p>
                <span
                  className={
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-white " +
                    (strong ? "bg-teal" : "bg-accent")
                  }
                >
                  {part.stanine}
                </span>
              </div>
              <p className={"mt-1 text-xs font-bold uppercase tracking-wide " + (strong ? "text-teal" : "text-accent")}>
                <Localized value={part.band} />
              </p>
              <p className="mt-1.5 text-sm leading-snug text-ink/70">
                <Localized value={part.note} />
              </p>
            </div>
          );
        })}
      </div>

      {/* passage-comprehension breakdown */}
      <p className="mt-5 text-xs font-bold uppercase tracking-wide text-brand">
        <Localized value={data.breakdown.heading} />
      </p>
      <div className="mt-2 space-y-1.5">
        {data.breakdown.rows.map((r, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-xs text-ink/70 sm:w-44">
              <Localized value={r.type} />
            </span>
            <span className="relative h-4 flex-1 overflow-hidden rounded-full bg-black/[0.05]">
              <span
                className="block h-full rounded-full bg-brand/70"
                style={{ width: `${r.pct}%` }}
              />
            </span>
            <span className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-ink/70">
              {r.score}
            </span>
          </div>
        ))}
      </div>

      {/* honest takeaway + norm context */}
      <p className="mt-5 border-t border-black/5 pt-4 text-sm leading-relaxed text-ink/75">
        <Localized value={data.takeaway} />
      </p>
      <p className="mt-2 text-xs italic leading-relaxed text-ink/45">
        <Localized value={data.context} />
      </p>
    </div>
  );
}
