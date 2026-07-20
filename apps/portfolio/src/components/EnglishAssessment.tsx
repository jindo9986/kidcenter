import type { EnglishAssessment as Data } from "@/lib/schemas";
import { Localized } from "./Localized";

/**
 * English assessment, from two clearly-separated sources:
 *  1. NGRT — an external standardised benchmark (GL Education, UK).
 *  2. Speaking / Writing — the school's own First English Language rubric.
 *
 * Both are reported in full, including the below-average NGRT component. The two
 * scales are never blended or converted into one another.
 */
export function EnglishAssessment({ data }: { data: Data }) {
  const r = data.reading;
  const p = data.productive;

  return (
    <div className="space-y-4">
      {/* ---------- 1. External benchmark: NGRT ---------- */}
      <div className="break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
          <Localized value={{ vi: "Đối chiếu độc lập", en: "External benchmark" }} />
        </p>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-ink">
            <Localized value={r.test} />
          </h3>
          <p className="text-xs text-ink/45">
            {r.provider} · {r.date} ·{" "}
            <Localized value={{ vi: `Tuổi khi thi ${r.ageAtTest}`, en: `Age ${r.ageAtTest}` }} />
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { k: { vi: "Điểm chuẩn tuổi", en: "Standard Age Score" }, v: r.overall.sas },
            { k: { vi: "Bách phân vị", en: "Percentile" }, v: r.overall.pr },
            { k: { vi: "Stanine", en: "Stanine" }, v: r.overall.stanine },
            { k: { vi: "Tuổi đọc", en: "Reading age" }, v: r.overall.readingAge },
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
          <Localized value={r.overall.band} />
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {r.parts.map((part, i) => {
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
                <p
                  className={
                    "mt-1 text-xs font-bold uppercase tracking-wide " +
                    (strong ? "text-teal" : "text-accent")
                  }
                >
                  <Localized value={part.band} />
                </p>
                <p className="mt-1.5 text-sm leading-snug text-ink/70">
                  <Localized value={part.note} />
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-xs font-bold uppercase tracking-wide text-brand">
          <Localized value={r.breakdown.heading} />
        </p>
        <div className="mt-2 space-y-1.5">
          {r.breakdown.rows.map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-xs text-ink/70 sm:w-44">
                <Localized value={row.type} />
              </span>
              <span className="relative h-4 flex-1 overflow-hidden rounded-full bg-black/[0.05]">
                <span className="block h-full rounded-full bg-brand/70" style={{ width: `${row.pct}%` }} />
              </span>
              <span className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-ink/70">
                {row.score}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 border-t border-black/5 pt-4 text-sm leading-relaxed text-ink/75">
          <Localized value={r.takeaway} />
        </p>
        <p className="mt-2 text-xs italic leading-relaxed text-ink/45">
          <Localized value={r.context} />
        </p>
      </div>

      {/* ---------- 2. School rubric: Speaking & Writing ---------- */}
      <div className="break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal">
          <Localized value={{ vi: "Đánh giá của trường", en: "School assessment" }} />
        </p>
        <h3 className="mt-1 font-display text-lg font-bold text-ink">
          <Localized value={{ vi: "Nói & Viết", en: "Speaking & Writing" }} />
        </h3>
        <p className="mt-1 text-xs leading-snug text-ink/50">
          <Localized value={p.source} />
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {p.skills.map((skill, i) => {
            const pct = Math.round((skill.score / skill.max) * 100);
            return (
              <div key={i} className="rounded-2xl border border-black/5 bg-cream p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-display text-base font-bold text-ink">
                    {skill.icon && <span className="mr-1.5">{skill.icon}</span>}
                    <Localized value={skill.name} />
                  </p>
                  <p className="font-display text-lg font-extrabold text-brand">
                    {skill.score}
                    <span className="text-sm font-bold text-ink/40">/{skill.max}</span>
                  </p>
                </div>
                {/* zero-based bar — true proportion of the rubric maximum */}
                <span className="mt-2 block h-2.5 overflow-hidden rounded-full bg-black/[0.06]">
                  <span className="block h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                </span>
                <p className="mt-1 text-right text-[11px] font-semibold text-ink/45">{pct}%</p>

                {skill.criteria.length > 0 && (
                  <ul className="mt-2 space-y-1 border-t border-black/5 pt-2">
                    {skill.criteria.map((c, j) => (
                      <li key={j} className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-ink/70">
                          <Localized value={c.name} />
                        </span>
                        <span
                          className={
                            "shrink-0 rounded-full px-2 py-0.5 font-bold tabular-nums " +
                            (c.perfect ? "bg-accent/25 text-ink" : "bg-black/5 text-ink/70")
                          }
                        >
                          {c.score}/{c.max}
                          {c.perfect && " ★"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-ink/45">
          <Localized value={p.rubricNote} />
        </p>
        <p className="mt-4 border-t border-black/5 pt-4 text-sm leading-relaxed text-ink/75">
          <Localized value={p.takeaway} />
        </p>
        <p className="mt-2 text-xs italic leading-relaxed text-ink/45">
          <Localized value={p.note} />
        </p>
      </div>
    </div>
  );
}
