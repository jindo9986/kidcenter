import type { Activity } from "@/data/db-types";
import type { ActivityLite } from "@/domain/types";

// Translate a stored (snake_case) activity into the pure domain shape used by
// the recurrence engine.
export function toActivityLite(a: Activity): ActivityLite {
  return {
    id: a.id,
    points: a.points,
    recurrence: a.recurrence,
    schedule: a.schedule,
    assigneeMemberId: a.assignee_member_id,
    active: a.active,
    startDate: a.start_date ?? undefined,
  };
}
