import { toTrendSeries, type RawPoint } from "@/lib/normalize";

// Small-multiple line chart: one subject's DEC (faint) + MAY (solid) percentage
// across grades 1–4. Shared y-domain [60,100] so charts are comparable side by side.
const Y_MIN = 60;
const Y_MAX = 100;
const W = 300;
const H = 150;
const PAD = { l: 30, r: 12, t: 26, b: 22 };

const xOf = (grade: number) => PAD.l + ((grade - 1) / 3) * (W - PAD.l - PAD.r);
const yOf = (pct: number) =>
  PAD.t + (1 - (pct - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD.t - PAD.b);

// Connect only consecutive points sharing the same scale (max), so the line never
// bridges the G1 (/6) → G2 (/10) scale break — a bridged line would falsely look
// like a drop. Same-scale runs of length 1 render as a lone marker.
function runs<T extends { max: number }>(points: T[]): T[][] {
  const out: T[][] = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (last && last[0].max === p.max) last.push(p);
    else out.push([p]);
  }
  return out;
}

export function LineTrend({ name, points }: { name: string; points: RawPoint[] }) {
  const series = points.map((p, i) => ({
    grade: p.grade,
    max: p.max,
    dec: p.dec == null ? null : toTrendSeries([points[i]])[0].dec,
    may: p.may == null ? null : toTrendSeries([points[i]])[0].may,
  }));
  const may = series.filter((p) => p.may != null) as { grade: number; max: number; may: number }[];
  const dec = series.filter((p) => p.dec != null) as { grade: number; max: number; dec: number }[];
  const latest = may.length ? may[may.length - 1].may : null;

  const line = (pts: { grade: number; v: number }[]) =>
    pts.map((p) => `${xOf(p.grade)},${yOf(p.v)}`).join(" ");

  return (
    <figure className="break-avoid rounded-3xl border border-black/5 bg-white p-4 shadow-sm">
      <figcaption className="mb-1 flex items-baseline justify-between gap-2">
        <span className="font-display text-base font-bold text-ink">{name}</span>
        {latest != null && <span className="text-sm font-semibold text-brand">{latest}% <span className="text-ink/40">cuối L4</span></span>}
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Xu hướng ${name}`}>
        {/* gridlines + y labels */}
        {[60, 70, 80, 90, 100].map((g) => (
          <g key={g}>
            <line x1={PAD.l} x2={W - PAD.r} y1={yOf(g)} y2={yOf(g)} stroke="var(--color-ink)" strokeOpacity="0.07" />
            <text x={PAD.l - 6} y={yOf(g) + 3} textAnchor="end" fontSize="9" fill="var(--color-ink)" opacity="0.4">
              {g}
            </text>
          </g>
        ))}
        {/* x labels */}
        {[1, 2, 3, 4].map((gr) => (
          <text key={gr} x={xOf(gr)} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--color-ink)" opacity="0.55">
            L{gr}
          </text>
        ))}
        {/* DEC series (faint), split at scale breaks */}
        {runs(dec).map((run, ri) =>
          run.length > 1 ? (
            <polyline
              key={`dr${ri}`}
              points={line(run.map((p) => ({ grade: p.grade, v: p.dec })))}
              fill="none"
              stroke="var(--color-ink)"
              strokeOpacity="0.25"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          ) : null,
        )}
        {dec.map((p) => (
          <circle key={`d${p.grade}`} cx={xOf(p.grade)} cy={yOf(p.dec)} r="2" fill="var(--color-ink)" opacity="0.3" />
        ))}
        {/* MAY series (solid, brand), split at scale breaks */}
        {runs(may).map((run, ri) =>
          run.length > 1 ? (
            <polyline
              key={`mr${ri}`}
              points={line(run.map((p) => ({ grade: p.grade, v: p.may })))}
              fill="none"
              stroke="var(--color-brand)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null,
        )}
        {may.map((p) => (
          <circle key={`m${p.grade}`} cx={xOf(p.grade)} cy={yOf(p.may)} r="3.5" fill="var(--color-brand)" stroke="white" strokeWidth="1.5" />
        ))}
      </svg>
    </figure>
  );
}
