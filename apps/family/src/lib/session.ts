import { supabase } from "@/lib/supabase";
import type { Member } from "@/data/db-types";

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
// (i.e. the email is not on the family allowlist).
export async function getCurrentMember(): Promise<Member | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("members")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  return (data as Member | null) ?? null;
}
