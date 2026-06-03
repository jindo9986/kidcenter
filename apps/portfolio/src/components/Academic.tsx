import type { Academic as AcademicType, SubjectResult } from "@/lib/schemas";
import { Localized } from "./Localized";

function ResultBadge({ s }: { s: SubjectResult }) {
  if (s.score) {
    const isTop = s.score === "10";
    return (
      <span
        className={
          isTop
            ? "flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-extrabold text-white"
            : "flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-extrabold text-ink"
        }
      >
        {s.score}
      </span>
    );
  }
  if (s.level === "T") {
    return (
      <span className="rounded-full bg-teal/12 px-2 py-0.5 text-xs font-bold text-teal">
        <span data-lang="vi">Tốt</span>
        <span data-lang="en">Good</span>
      </span>
    );
  }
  if (s.level === "Đ") {
    return (
      <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-bold text-ink/50">
        <span data-lang="vi">Đạt</span>
        <span data-lang="en">Pass</span>
      </span>
    );
  }
  return null;
}

export function Academic({ data }: { data: AcademicType }) {
  return (
    <div className="grid gap-4">
      {data.map((rec, i) => (
        <div
          key={i}
          className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-ink">
              <Localized value={rec.grade} />
              {rec.year && (
                <span className="ml-2 text-sm font-normal text-ink/40">
                  {rec.year}
                </span>
              )}
            </h3>
            {rec.civility && (
              <span className="rounded-full bg-teal/12 px-2.5 py-0.5 text-xs font-bold text-teal">
                <span data-lang="vi">Văn minh </span>
                <span data-lang="en">Civility </span>
                {rec.civility}
              </span>
            )}
          </div>

          {/* Honors — promoted to the top, gold-accented so they stand out. */}
          {rec.honors.length > 0 && (
            <ul className="mb-4 grid gap-2 sm:grid-cols-2">
              {rec.honors.map((h, k) => (
                <li
                  key={k}
                  className="break-avoid flex items-start gap-2.5 rounded-2xl border border-accent/40 bg-accent/12 px-3 py-2"
                >
                  <span className="text-xl leading-6" aria-hidden>
                    {h.icon ?? "🏆"}
                  </span>
                  <div>
                    <p className="font-bold leading-snug text-ink">
                      <Localized value={h.label} />
                    </p>
                    {h.note && (
                      <p className="mt-0.5 text-xs leading-snug text-ink/60">
                        <Localized value={h.note} />
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <ul className="flex flex-wrap gap-2">
            {rec.subjects.map((s, j) => (
              <li
                key={j}
                className="flex items-center gap-1.5 rounded-2xl bg-cream px-3 py-1.5 text-sm"
              >
                <span className="font-medium text-ink">
                  <Localized value={s.subject} />
                </span>
                <ResultBadge s={s} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
