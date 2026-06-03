import type { RadarAxis } from "@/lib/schemas";

const SIZE = 320;
const CENTER = SIZE / 2;
const R = 100; // max polygon radius
const LABEL_R = R + 22;
const RINGS = [0.25, 0.5, 0.75, 1];
// Horizontal padding so side axis labels (Nghệ thuật, Tiếng Anh…) aren't clipped.
const PAD_X = 56;

export function RadarChart({ data }: { data: RadarAxis[] }) {
  const n = data.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const point = (i: number, frac: number): [number, number] => {
    const a = angle(i);
    return [CENTER + R * frac * Math.cos(a), CENTER + R * frac * Math.sin(a)];
  };
  const poly = (frac: number) =>
    data
      .map((_, i) => point(i, frac).map((v) => v.toFixed(1)).join(","))
      .join(" ");
  const dataPoly = data
    .map((d, i) =>
      point(i, Math.max(0, Math.min(100, d.value)) / 100)
        .map((v) => v.toFixed(1))
        .join(","),
    )
    .join(" ");

  return (
    <div className="mx-auto max-w-sm break-avoid">
      <svg
        viewBox={`${-PAD_X} 0 ${SIZE + 2 * PAD_X} ${SIZE}`}
        className="h-auto w-full"
        role="img"
        aria-label="Skills radar"
      >
        {/* grid rings */}
        {RINGS.map((f) => (
          <polygon
            key={f}
            points={poly(f)}
            fill="none"
            stroke="rgba(55,48,163,0.12)"
            strokeWidth={1}
          />
        ))}
        {/* spokes */}
        {data.map((_, i) => {
          const [x, y] = point(i, 1);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={x.toFixed(1)}
              y2={y.toFixed(1)}
              stroke="rgba(55,48,163,0.12)"
              strokeWidth={1}
            />
          );
        })}
        {/* data area */}
        <polygon
          points={dataPoly}
          fill="rgba(55,48,163,0.18)"
          stroke="#3730a3"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {/* vertices */}
        {data.map((d, i) => {
          const [x, y] = point(i, Math.max(0, Math.min(100, d.value)) / 100);
          return (
            <circle
              key={i}
              cx={x.toFixed(1)}
              cy={y.toFixed(1)}
              r={3.5}
              fill="#3730a3"
            />
          );
        })}
        {/* axis labels (bilingual) */}
        {data.map((d, i) => {
          const a = angle(i);
          const lx = CENTER + LABEL_R * Math.cos(a);
          const ly = CENTER + LABEL_R * Math.sin(a);
          const cos = Math.cos(a);
          const anchor =
            Math.abs(cos) < 0.2 ? "middle" : cos > 0 ? "start" : "end";
          return (
            <g key={i} fontSize={12} fontWeight={700} fill="#1f2937">
              <text
                data-lang="vi"
                x={lx.toFixed(1)}
                y={ly.toFixed(1)}
                textAnchor={anchor}
                dominantBaseline="middle"
              >
                {d.axis.vi}
              </text>
              <text
                data-lang="en"
                x={lx.toFixed(1)}
                y={ly.toFixed(1)}
                textAnchor={anchor}
                dominantBaseline="middle"
              >
                {d.axis.en}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
