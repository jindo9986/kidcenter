import { createClient } from "@supabase/supabase-js";

// Public, build-time env. The anon key is safe to ship; RLS protects the data.
// Placeholders keep `createClient` from throwing when building without creds
// (e.g. local CI before Supabase is provisioned); prod injects the real values.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, detectSessionInUrl: true, flowType: "pkce" },
});
