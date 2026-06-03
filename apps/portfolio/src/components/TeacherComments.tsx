import type { YearComments } from "@/lib/schemas";
import { Localized } from "./Localized";

export function TeacherComments({ data }: { data: YearComments[] }) {
  return (
    <div className="grid gap-3">
      {data.map((yr, i) => (
        <details
          key={i}
          open={i === 0}
          className="group break-avoid overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-5 py-3 font-display text-lg font-bold text-ink select-none">
            <span>
              <Localized value={yr.grade} />
              {yr.year && (
                <span className="ml-2 text-sm font-normal text-ink/40">
                  {yr.year}
                </span>
              )}
            </span>
            <span className="text-brand transition-transform group-open:rotate-180">
              ▾
            </span>
          </summary>

          <div className="space-y-4 border-t border-black/5 px-5 py-4">
            {yr.comments.map((c, j) => (
              <div key={j} className="break-avoid">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand">
                    <Localized value={c.subject} />
                  </span>
                  <span className="text-xs font-semibold text-ink/45">
                    {c.teacher}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-ink/75">{c.text}</p>
              </div>
            ))}

            {yr.general && (
              <div className="break-avoid rounded-2xl bg-cream p-3">
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink/50">
                  <span data-lang="vi">Nhận xét chung</span>
                  <span data-lang="en">General comment</span>
                  {" · "}
                  {yr.general.teacher}
                </p>
                <p className="text-sm leading-relaxed text-ink/75">
                  {yr.general.text}
                </p>
              </div>
            )}

            {yr.goals && (
              <div className="break-avoid">
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-teal">
                  <span data-lang="vi">Mục tiêu kỳ tới</span>
                  <span data-lang="en">Goals for next term</span>
                </p>
                <p className="text-sm leading-relaxed text-ink/70">
                  {yr.goals}
                </p>
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
