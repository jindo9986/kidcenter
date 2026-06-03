import type { Academic as AcademicType } from "@/lib/schemas";
import { Localized } from "./Localized";

export function Academic({ data }: { data: AcademicType }) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {/* Grades */}
      <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm md:col-span-3">
        <p className="mb-3 text-sm font-semibold text-ink/50">
          <span data-lang="vi">Kết quả môn học · </span>
          <span data-lang="en">Subject results · </span>
          {data.year}
        </p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {data.grades.map((g, i) => (
            <li
              key={i}
              className="break-avoid flex items-center justify-between gap-2 rounded-2xl bg-cream px-3 py-2"
            >
              <span className="text-sm font-medium text-ink">
                <Localized value={g.subject} />
              </span>
              <span
                className={
                  g.score >= 10
                    ? "rounded-full bg-brand px-2 py-0.5 text-sm font-extrabold text-white"
                    : "rounded-full bg-accent px-2 py-0.5 text-sm font-extrabold text-ink"
                }
              >
                {g.score}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Honors */}
      <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm md:col-span-2">
        <p className="mb-3 text-sm font-semibold text-ink/50">
          <span data-lang="vi">Khen thưởng</span>
          <span data-lang="en">Honors</span>
        </p>
        <ul className="space-y-2">
          {data.honors.map((h, i) => (
            <li key={i} className="break-avoid flex items-start gap-2">
              <span aria-hidden>🏆</span>
              <span className="text-sm font-medium text-ink/80">
                <Localized value={h} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
