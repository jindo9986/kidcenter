import { supabase } from "@/lib/supabase";
import type { RawPoint } from "@/lib/normalize";
import type { RadarAxis } from "@/components/RadarChart";

/* Types mirror the four content/*.json documents (the seed source). */

export interface Academics {
  student: { name: string; nickname: string; id: string; school: string };
  scaleNote: string;
  trends: { key: string; name: string; points: RawPoint[] }[];
  current: {
    label: string;
    radar: RadarAxis[];
    moet: { subject: string; score: string; level: string }[];
    vietnameseStrands: { name: string; level: string }[];
  };
  attributes: {
    cambridge: string[];
    cambridgeNote: string;
    vinser: string[];
    vinserNote: string;
    clise: string;
  };
  awards: string[];
}

export interface Theme {
  icon: string;
  title: string;
  evidence: { quote: string; who: string; grade: number }[];
}
export interface Comments {
  strengths: Theme[];
  growth: Theme[];
}

export interface Assessment {
  summary: string;
  strengths: string[];
  watchAreas: string[];
  learningStyle: string;
}

export interface FocusArea {
  icon: string;
  title: string;
  why: string;
  steps: string[];
  parentSupport: string[];
}
export interface Roadmap {
  intro: string;
  focusAreas: FocusArea[];
}

export interface StudyData {
  academics: Academics;
  comments: Comments;
  assessment: Assessment;
  roadmap: Roadmap;
}

const KEYS = ["academics", "comments", "assessment", "roadmap"] as const;

// Fetch the four docs for a family. Returns null if any is missing (not seeded yet).
export async function fetchStudyData(familyId: string): Promise<StudyData | null> {
  const { data, error } = await supabase
    .from("study_docs")
    .select("doc_key, data")
    .eq("family_id", familyId);
  if (error) throw error;

  const byKey = new Map((data ?? []).map((r) => [r.doc_key as string, r.data]));
  if (!KEYS.every((k) => byKey.has(k))) return null;

  return {
    academics: byKey.get("academics") as Academics,
    comments: byKey.get("comments") as Comments,
    assessment: byKey.get("assessment") as Assessment,
    roadmap: byKey.get("roadmap") as Roadmap,
  };
}
