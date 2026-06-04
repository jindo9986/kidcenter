import { createClient } from "@supabase/supabase-js";

// Public, build-time env. The anon key is safe to ship; RLS protects the data.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, detectSessionInUrl: true, flowType: "pkce" },
});
