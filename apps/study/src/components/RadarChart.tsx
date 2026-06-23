import { normalizePct } from "@/lib/normalize";

export interface RadarAxis {
  axis: string;
  score: number;
  max: number;
}

// Compact pentagon radar for the current (Grade-4) capability snapshot. The radial
// domain is [70,100]% (not [0,100]) so the shape shows real differences between
// near-perfect scores instead of a flat blob near the edge.
const SIZE = 320;
const C = SIZE / 2;
const R = 110;
const DOM_MIN = 70;

function point(i: number, total: number, radius: number) {
  const ang = -Math.PI / 2 + (i / total) * Math.PI * 2;
  return [C + radius * Math.cos(ang), C + radius * Math.sin(ang)];
}
const radiusFor = (pct: number) =>
  R * Math.min(1, Math.max(0, (pct - DOM_MIN) / (100 - DOM_MIN)));

export function RadarChart({ data }: { data: RadarAxis[] }) {
  const n = data.length;
  const pts = data.map((d, i) => point(i, n, radiusFor(normalizePct(d.score, d.max))));
  const poly = pts.map((p) => p.join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-sm" role="img" aria-label="Bản đồ năng lực Lớp 4">
      {/* rings at 70 / 85 / 100% */}
      {[0.5, 1].map((f) => (
        <polygon
          key={f}
          points={Array.from({ length: n }, (_, i) => point(i, n, R * f).join(",")).join(" ")}
          fill="none"
          stroke="var(--color-ink)"
          strokeOpacity="0.08"
        />
      ))}
      {/* spokes + axis labels */}
      {data.map((d, i) => {
        const [ex, ey] = point(i, n, R);
        const [lx, ly] = point(i, n, R + 22);
        return (
          <g key={d.axis}>
            <line x1={C} y1={C} x2={ex} y2={ey} stroke="var(--color-ink)" strokeOpacity="0.08" />
            <text
              x={lx}
              y={ly}
              textAnchor={Math.abs(lx - C) < 8 ? "middle" : lx > C ? "start" : "end"}
              dominantBaseline="middle"
              fontSize="12"
              fontWeight="700"
              fill="var(--color-ink)"
              opacity="0.75"
            >
              {d.axis}
            </text>
            <text x={lx} y={ly + 13} textAnchor={Math.abs(lx - C) < 8 ? "middle" : lx > C ? "start" : "end"} dominantBaseline="middle" fontSize="10" fill="var(--color-brand)">
              {d.score}/{d.max}
            </text>
          </g>
        );
      })}
      {/* data polygon */}
      <polygon points={poly} fill="var(--color-brand)" fillOpacity="0.16" stroke="var(--color-brand)" strokeWidth="2" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="var(--color-brand)" stroke="white" strokeWidth="1.5" />
      ))}
    </svg>
  );
}
