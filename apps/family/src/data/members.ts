import { supabase } from "@/lib/supabase";
import type { Member } from "./db-types";

// Members are provisioned by the auth trigger on first Google sign-in (via the
// email allowlist). There is no manual member creation or PIN.

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
