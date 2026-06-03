import type { TeacherInsights as TeacherInsightsType } from "@/lib/schemas";
import { Localized } from "./Localized";

export function TeacherInsights({ data }: { data: TeacherInsightsType }) {
  return (
    <div className="mb-6">
      <p className="mb-4 leading-relaxed text-ink/70">
        <Localized value={data.intro} />
      </p>

      {/* Recurring strength themes */}
      <ul className="mb-5 flex flex-wrap gap-2">
        {data.themes.map((t, i) => (
          <li
            key={i}
            className="break-avoid flex items-center gap-2 rounded-2xl border border-brand/15 bg-brand/8 px-3 py-2"
          >
            <span className="text-lg" aria-hidden>
              {t.icon}
            </span>
            <span className="text-sm font-bold text-ink">
              <Localized value={t.label} />
            </span>
          </li>
        ))}
      </ul>

      {/* Standout pull quotes (verbatim) */}
      <div className="grid gap-3 sm:grid-cols-2">
        {data.quotes.map((q, i) => (
          <figure
            key={i}
            className="break-avoid relative rounded-3xl border border-black/5 bg-white p-5 pt-7 shadow-sm"
          >
            <span
              className="absolute left-4 top-1 font-display text-4xl leading-none text-accent"
              aria-hidden
            >
              &ldquo;
            </span>
            <blockquote className="font-display text-[15px] italic leading-relaxed text-ink/80">
              {q.text}
            </blockquote>
            <figcaption className="mt-2 text-xs font-semibold text-brand">
              <Localized value={q.attribution} />
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
