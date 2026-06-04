// Local calendar date as ISO yyyy-mm-dd (not UTC, so "today" matches the user).
export function todayISO(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]; // 0=Sun..6=Sat
// Monday-first column labels (for week/month grids).
export const WEEK_COLS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// All ISO date math parses at UTC noon so weekday/offset never drift across DST.
const atNoon = (iso: string) => new Date(`${iso}T12:00:00Z`);
const isoOf = (d: Date) => d.toISOString().slice(0, 10);

export function addDaysISO(iso: string, n: number): string {
  const d = atNoon(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return isoOf(d);
}

export function weekdayISO(iso: string): number {
  return atNoon(iso).getUTCDay(); // 0=Sun..6=Sat
}

// Monday as the first day of the week.
export function startOfWeekISO(iso: string): string {
  const back = (weekdayISO(iso) + 6) % 7;
  return addDaysISO(iso, -back);
}

export function startOfMonthISO(iso: string): string {
  return `${iso.slice(0, 7)}-01`;
}

export function addMonthsISO(iso: string, n: number): string {
  const d = atNoon(`${iso.slice(0, 7)}-01`);
  d.setUTCMonth(d.getUTCMonth() + n);
  return `${isoOf(d).slice(0, 7)}-01`;
}

export function daysInMonthOf(iso: string): number {
  const d = atNoon(iso);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
}

export function dayNum(iso: string): number {
  return Number(iso.slice(8, 10));
}

export function monthLabel(iso: string): string {
  return `Tháng ${Number(iso.slice(5, 7))}/${iso.slice(0, 4)}`;
}

const FULL_WEEKDAY = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
export function dayLabel(iso: string): string {
  return `${FULL_WEEKDAY[weekdayISO(iso)]}, ${dayNum(iso)}/${Number(iso.slice(5, 7))}`;
}

const p2 = (n: number) => String(n).padStart(2, "0");

// A timestamptz (UTC ISO) rendered in the viewer's local time as "HH:mm · dd/mm/yyyy".
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${p2(d.getHours())}:${p2(d.getMinutes())} · ${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()}`;
}
