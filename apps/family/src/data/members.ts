import { supabase } from "@/lib/supabase";
import type { Member } from "./db-types";

export async function listMembers(familyId: string): Promise<Member[]> {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("family_id", familyId)
    .order("created_at");
  if (error) throw error;
  return (data ?? []) as Member[];
}

export async function listChildren(familyId: string): Promise<Member[]> {
  return (await listMembers(familyId)).filter((m) => m.role === "child" && m.active);
}

export async function insertChild(input: {
  familyId: string;
  displayName: string;
  birthYear?: number | null;
  avatarUrl?: string | null;
}): Promise<Member> {
  const { data, error } = await supabase
    .from("members")
    .insert({
      family_id: input.familyId,
      role: "child",
      display_name: input.displayName,
      birth_year: input.birthYear ?? null,
      avatar_url: input.avatarUrl ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Member;
}

export async function updateMember(
  id: string,
  patch: Partial<Pick<Member, "display_name" | "birth_year" | "avatar_url" | "active">>,
): Promise<void> {
  const { error } = await supabase.from("members").update(patch).eq("id", id);
  if (error) throw error;
}

// Hard delete: cascades to the member's task instances, point ledger,
// redemptions and any activities assigned only to them. Not reversible.
export async function deleteMember(id: string): Promise<void> {
  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) throw error;
}

export async function setPin(id: string, pinHash: string, pinSalt: string): Promise<void> {
  const { error } = await supabase
    .from("members")
    .update({ pin_hash: pinHash, pin_salt: pinSalt })
    .eq("id", id);
  if (error) throw error;
}

export async function clearPin(id: string): Promise<void> {
  const { error } = await supabase
    .from("members")
    .update({ pin_hash: null, pin_salt: null })
    .eq("id", id);
  if (error) throw error;
}
