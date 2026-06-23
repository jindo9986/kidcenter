import { supabase } from "@/lib/supabase";
import type { Member } from "@/lib/db-types";

export async function signInWithGoogle(): Promise<void> {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${location.origin}${base}/` },
  });
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

// The members row for the signed-in Google user, or null if not provisioned
// (email not on the family allowlist). The provision trigger lives in the Family
// migrations and is shared across the project.
export async function getCurrentMember(): Promise<Member | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("members")
    .select("id, family_id, role, display_name, auth_user_id")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  return (data as Member | null) ?? null;
}
