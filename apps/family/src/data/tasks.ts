import { supabase } from "@/lib/supabase";
import type { PlannedInstance } from "@/domain/recurrence";
import type { Activity, TaskInstance } from "./db-types";

export type TaskInstanceWithActivity = TaskInstance & { activities: Activity | null };

export async function upsertInstances(rows: PlannedInstance[]): Promise<void> {
  if (rows.length === 0) return;
  const payload = rows.map((r) => ({
    activity_id: r.activityId,
    member_id: r.memberId,
    due_date: r.dueDate,
  }));
  // unique(activity_id,member_id,due_date) makes this idempotent.
  const { error } = await supabase
    .from("task_instances")
    .upsert(payload, { onConflict: "activity_id,member_id,due_date", ignoreDuplicates: true });
  if (error) throw error;
}

export async function listToday(
  memberId: string,
  date: string,
): Promise<TaskInstanceWithActivity[]> {
  const { data, error } = await supabase
    .from("task_instances")
    .select("*, activities(*)")
    .eq("member_id", memberId)
    .eq("due_date", date);
  if (error) throw error;
  return (data ?? []) as TaskInstanceWithActivity[];
}

export async function listSubmitted(familyId: string): Promise<TaskInstanceWithActivity[]> {
  const { data, error } = await supabase
    .from("task_instances")
    .select("*, activities!inner(*)")
    .eq("status", "submitted")
    .eq("activities.family_id", familyId)
    .order("submitted_at");
  if (error) throw error;
  return (data ?? []) as TaskInstanceWithActivity[];
}

export async function submitTask(id: string): Promise<void> {
  const { error } = await supabase
    .from("task_instances")
    .update({ status: "submitted", submitted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function rejectTask(id: string, deciderId: string): Promise<void> {
  const { error } = await supabase
    .from("task_instances")
    .update({ status: "rejected", decided_by: deciderId, decided_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}
