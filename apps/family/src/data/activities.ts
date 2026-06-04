import { supabase } from "@/lib/supabase";
import type { Activity, ActivityType } from "./db-types";

export async function listActivityTypes(familyId: string): Promise<ActivityType[]> {
  const { data, error } = await supabase
    .from("activity_types")
    .select("*")
    .eq("family_id", familyId)
    .order("sort");
  if (error) throw error;
  return (data ?? []) as ActivityType[];
}

export async function upsertActivityType(
  input: Partial<ActivityType> & { family_id: string; name: string },
): Promise<ActivityType> {
  const { data, error } = await supabase
    .from("activity_types")
    .upsert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as ActivityType;
}

export async function deleteActivityType(id: string): Promise<void> {
  const { error } = await supabase.from("activity_types").delete().eq("id", id);
  if (error) throw error;
}

export async function listActivities(familyId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("family_id", familyId)
    .order("created_at");
  if (error) throw error;
  return (data ?? []) as Activity[];
}

export async function listActiveActivities(familyId: string): Promise<Activity[]> {
  return (await listActivities(familyId)).filter((a) => a.active);
}

export type ActivityInput = Omit<Activity, "id" | "created_at">;

export async function insertActivity(input: ActivityInput): Promise<Activity> {
  const { data, error } = await supabase
    .from("activities")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as Activity;
}

export async function updateActivity(
  id: string,
  patch: Partial<ActivityInput>,
): Promise<void> {
  const { error } = await supabase.from("activities").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteActivity(id: string): Promise<void> {
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) throw error;
}
