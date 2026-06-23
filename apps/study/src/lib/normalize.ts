// Cambridge scales differ by grade (G1 = /6, G2–G4 = /10). Normalise every score
// to a percentage so trends across grades are comparable. This is the one place
// with real logic — if it is wrong, the trend lines mislead, so it is unit-tested.
export function normalizePct(score: number, max: number): number {
  if (max <= 0) return 0;
  return Math.round((score / max) * 1000) / 10; // one decimal
}

export interface RawPoint {
  grade: number;
  dec?: number;
  may?: number;
  max: number;
  units?: number[];
}
export interface TrendPoint {
  grade: number;
  dec: number | null;
  may: number | null;
}

export function toTrendSeries(points: RawPoint[]): TrendPoint[] {
  return points.map((p) => ({
    grade: p.grade,
    dec: p.dec == null ? null : normalizePct(p.dec, p.max),
    may: p.may == null ? null : normalizePct(p.may, p.max),
  }));
}
