import type { ActivityLite } from "./types";

export interface PlannedInstance {
  activityId: string;
  memberId: string;
  dueDate: string; // ISO yyyy-mm-dd
}

function weekday(iso: string): number {
  // Parse as UTC noon to avoid timezone drift.
  return new Date(`${iso}T12:00:00Z`).getUTCDay();
}

export function dueOn(a: ActivityLite, date: string): boolean {
  if (!a.active) return false;
  switch (a.recurrence) {
    case "daily":
      return true;
    case "once":
      return a.startDate === date;
    case "weekly":
    case "custom":
      return (a.schedule?.days ?? []).includes(weekday(date));
  }
}

export function generateInstances(
  activities: ActivityLite[],
  childMemberIds: string[],
  date: string,
): PlannedInstance[] {
  const out: PlannedInstance[] = [];
  for (const a of activities) {
    if (!dueOn(a, date)) continue;
    const targets = a.assigneeMemberId ? [a.assigneeMemberId] : childMemberIds;
    for (const memberId of targets) {
      out.push({ activityId: a.id, memberId, dueDate: date });
    }
  }
  return out;
}
