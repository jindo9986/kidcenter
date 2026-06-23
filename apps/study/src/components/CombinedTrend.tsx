import { toTrendSeries, type RawPoint } from "@/lib/normalize";

// One overview chart: every subject's end-of-year (MAY) percentage across G1→G4,
// overlaid so the whole cohort of subjects can be compared at a glance. The
// per-subject small multiples below carry the DEC/MAY detail.
export interface TrendSubject {
  key: string;
  name: string;
  points: RawPoint[];
}

const Y_MIN = 60;
const Y_MAX = 100;
const W = 680;
const H = 320;
const PAD = { l: 34, r: 16, t: 16, b: 30 };

const xOf = (grade: number) => PAD.l + ((grade - 1) / 3) * (W - PAD.l - PAD.r);
const yOf = (pct: number) =>
  PAD.t + (1 - (pct - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD.t - PAD.b);

// Distinct, on-brand-ish palette (indigo, teal, gold, pink, violet).
const PALETTE: Record<string, string> = {
  science: "#3730a3",
  maths: "#0d9488",
  english: "#e8a317",
  ict: "#db2777",
  gp: "#7c3aed",
};
const colorFor = (key: string, i: number) =>
  PALETTE[key] ?? ["#3730a3", "#0d9488", "#e8a317", "#db2777", "#7c3aed"][i % 5];

export function CombinedTrend({ subjects }: { subjects: TrendSubject[] }) {
  const series = subjects.map((s, i) => {
    const may = toTrendSeries(s.points).filter((p) => p.may != null) as { grade: number; may: number }[];
    return { key: s.key, name: s.name, color: colorFor(s.key, i), may };
  });

  return (
    <figure className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <figcaption className="mb-1 font-display text-base font-bold text-ink">
        Tổng hợp các môn · điểm cuối kỳ (%) qua 4 năm
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Tiến trình tổng hợp các môn qua 4 năm">
        {[60, 70, 80, 90, 100].map((g) => (
          <g key={g}>
            <line x1={PAD.l} x2={W - PAD.r} y1={yOf(g)} y2={yOf(g)} stroke="var(--color-ink)" strokeOpacity="0.07" />
            <text x={PAD.l - 8} y={yOf(g) + 4} textAnchor="end" fontSize="11" fill="var(--color-ink)" opacity="0.4">
              {g}
            </text>
          </g>
        ))}
        {[1, 2, 3, 4].map((gr) => (
          <text key={gr} x={xOf(gr)} y={H - 8} textAnchor="middle" fontSize="13" fill="var(--color-ink)" opacity="0.55">
            Lớp {gr}
          </text>
        ))}
        {series.map((s) => (
          <g key={s.key}>
            {s.may.length > 1 && (
              <polyline
                points={s.may.map((p) => `${xOf(p.grade)},${yOf(p.may)}`).join(" ")}
                fill="none"
                stroke={s.color}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
            {s.may.map((p) => (
              <circle key={p.grade} cx={xOf(p.grade)} cy={yOf(p.may)} r="3.5" fill={s.color} stroke="white" strokeWidth="1.5" />
            ))}
          </g>
        ))}
      </svg>
      {/* legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-xs font-medium text-ink/70">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </figure>
  );
}
