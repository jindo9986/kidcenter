#!/usr/bin/env node
// Seed the four study docs into Supabase from the local (git-ignored) content/*.json.
// Run locally once after applying 0006_study_docs.sql:
//   node scripts/seed.mjs
//
// Requires in apps/study/.env.local:
//   NEXT_PUBLIC_SUPABASE_URL=...
//   SUPABASE_SERVICE_ROLE_KEY=...        # service role bypasses RLS for the upsert
// Optional:
//   STUDY_FAMILY_ID=<uuid>               # else the first family() row is used
//
// The actual school records never enter git: they live only in content/*.json
// (git-ignored) and in Supabase.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

// Minimal .env.local loader (Node has no built-in dotenv).
function loadEnv() {
  try {
    for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local — rely on the ambient environment */
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const DOCS = ["academics", "comments", "assessment", "roadmap"];
const readDoc = (key) => JSON.parse(readFileSync(join(root, "content", `${key}.json`), "utf8"));

async function familyId() {
  if (process.env.STUDY_FAMILY_ID) return process.env.STUDY_FAMILY_ID;
  const { data, error } = await supabase.from("families").select("id").order("created_at").limit(1);
  if (error) throw error;
  if (!data?.length) throw new Error("No families row found. Provision a family first (Family app).");
  return data[0].id;
}

async function main() {
  const family_id = await familyId();
  const rows = DOCS.map((doc_key) => ({
    family_id,
    doc_key,
    data: readDoc(doc_key),
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from("study_docs").upsert(rows, { onConflict: "family_id,doc_key" });
  if (error) throw error;
  console.log(`Seeded ${rows.length} docs for family ${family_id}: ${DOCS.join(", ")}`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
