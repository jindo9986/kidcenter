import { supabase } from "@/lib/supabase";
import { normalizeEmail } from "@/domain/allowlist";
import type { AllowlistEmail } from "./db-types";
import type { Role } from "@/domain/types";

export async function listAllowlist(familyId: string): Promise<AllowlistEmail[]> {
  const { data, error } = await supabase
    .from("allowlist_emails")
    .select("*")
    .eq("family_id", familyId)
    .order("email");
  if (error) throw error;
  return (data ?? []) as AllowlistEmail[];
}

export async function addAllowlist(input: {
  familyId: string;
  email: string;
  role: Role;
}): Promise<AllowlistEmail> {
  const { data, error } = await supabase
    .from("allowlist_emails")
    .insert({
      family_id: input.familyId,
      email: normalizeEmail(input.email),
      role: input.role,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as AllowlistEmail;
}

export async function removeAllowlist(id: string): Promise<void> {
  const { error } = await supabase.from("allowlist_emails").delete().eq("id", id);
  if (error) throw error;
}
