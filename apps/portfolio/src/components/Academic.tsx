import type {
  Academic as AcademicType,
  Honor,
  L,
  SubjectResult,
} from "@/lib/schemas";
import { Localized } from "./Localized";

/** Drop the repetitive "(Cambridge)" suffix for compact table labels. */
function shortSubject(l: L): L {
  const strip = (s: string) => s.replace(/\s*\(Cambridge\)/, "");
  return { vi: strip(l.vi), en: strip(l.en) };
}

function ScoreCell({ result }: { result?: SubjectResult }) {
  if (!result) return <span className="text-ink/25">—</span>;
  if (result.score) {
    return (
      <span
        className={
          result.score === "10"
            ? "font-extrabold text-brand"
            : "font-extrabold text-[#a16207]"
        }
      >
        {result.score}
      </span>
    );
  }
  if (result.level === "T")
    return (
      <span className="text-xs font-bold text-teal">
        <span data-lang="vi">Tốt</span>
        <span data-lang="en">Good</span>
      </span>
    );
  if (result.level === "Đ")
    return (
      <span className="text-xs font-bold text-ink/45">
        <span data-lang="vi">Đạt</span>
        <span data-lang="en">Pass</span>
      </span>
    );
  return <span className="text-ink/25">—</span>;
}

export function Academic({ data }: { data: AcademicType }) {
  // Columns left→right in chronological order (data is stored newest-first).
  const years = [...data].reverse();

  // Union of subjects across all years, preserving first-seen order.
  const subjectOrder: { key: string; label: L }[] = [];
  const seen = new Set<string>();
  for (const y of years) {
    for (const s of y.subjects) {
      if (!seen.has(s.subject.en)) {
        seen.add(s.subject.en);
        subjectOrder.push({ key: s.subject.en, label: shortSubject(s.subject) });
      }
    }
  }
  const cell = (yearIndex: number, key: string) =>
    years[yearIndex].subjects.find((s) => s.subject.en === key);

  // Deduplicate honors across years, keeping the grades each was earned in.
  const honorGroups: { honor: Honor; grades: L[] }[] = [];
  const honorIndex = new Map<string, number>();
  for (const rec of data) {
    for (const h of rec.honors) {
      const k = h.label.en;
      if (!honorIndex.has(k)) {
        honorIndex.set(k, honorGroups.length);
        honorGroups.push({ honor: h, grades: [] });
      }
      honorGroups[honorIndex.get(k)!].grades.push(rec.grade);
    }
  }

  return (
    <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      {/* Honors — prominent, balanced gold badges */}
      {honorGroups.length > 0 && (
        <ul className="mb-5 grid gap-2 sm:grid-cols-2">
          {honorGroups.map(({ honor, grades }, i) => {
            const allYears = grades.length === years.length;
            return (
              <li
                key={i}
                className="break-avoid flex items-center gap-2.5 rounded-2xl border border-accent/40 bg-accent/12 px-3 py-2"
              >
                <span className="text-xl" aria-hidden>
                  {honor.icon ?? "🏆"}
                </span>
                <div>
                  <p className="font-bold leading-snug text-ink">
                    <Localized value={honor.label} />
                  </p>
                  <p className="text-xs font-medium text-ink/55">
                    {allYears ? (
                      <>
                        <span data-lang="vi">Cả {years.length} năm</span>
                        <span data-lang="en">All {years.length} years</span>
                      </>
                    ) : (
                      grades.map((g, k) => (
                        <span key={k}>
                          {k > 0 ? " · " : ""}
                          <Localized value={g} />
                        </span>
                      ))
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Score matrix: subjects × years */}
      <div className="-mx-2 overflow-x-auto px-2">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-brand/20">
              <th className="py-2 pr-3 text-left font-semibold text-ink/50">
                <span data-lang="vi">Môn</span>
                <span data-lang="en">Subject</span>
              </th>
              {years.map((y, i) => (
                <th
                  key={i}
                  className="px-2 py-2 text-center font-display font-bold text-ink"
                >
                  <Localized value={y.grade} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subjectOrder.map(({ key, label }) => (
              <tr key={key} className="border-b border-black/5">
                <th
                  scope="row"
                  className="py-2 pr-3 text-left font-medium text-ink"
                >
                  <Localized value={label} />
                </th>
                {years.map((_, i) => (
                  <td key={i} className="px-2 py-2 text-center">
                    <ScoreCell result={cell(i, key)} />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th
                scope="row"
                className="py-2 pr-3 text-left text-xs font-semibold text-ink/50"
              >
                <span data-lang="vi">Văn minh</span>
                <span data-lang="en">Civility</span>
                <span className="text-ink/30"> /100</span>
              </th>
              {years.map((y, i) => (
                <td
                  key={i}
                  className="px-2 py-2 text-center text-xs font-bold text-teal"
                >
                  {y.civility ? y.civility.split("/")[0] : "—"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ink/40">
        <span data-lang="vi">Thang điểm /10 · — là môn không học năm đó</span>
        <span data-lang="en">Scored out of 10 · — = not taken that year</span>
      </p>
    </div>
  );
}
