import fs from "node:fs";
import path from "node:path";
import {
  profileSchema,
  achievementsSchema,
  academicSchema,
  signatureSchema,
  overallSchema,
  skillsRadarSchema,
  characterSchema,
  teacherInsightsSchema,
  teacherCommentsSchema,
  journeySchema,
  mediaSchema,
  projectSchema,
  type Profile,
  type Achievement,
  type Academic,
  type Signature,
  type Overall,
  type RadarAxis,
  type Character,
  type TeacherInsights,
  type YearComments,
  type JourneyMilestone,
  type MediaItem,
  type Project,
} from "./schemas";
const DEFAULT_DIR = path.join(process.cwd(), "content");

function readJson(dir: string, file: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
}

export function getProfile(dir: string = DEFAULT_DIR): Profile {
  return profileSchema.parse(readJson(dir, "profile.json"));
}

export function getAchievements(dir: string = DEFAULT_DIR): Achievement[] {
  return achievementsSchema.parse(readJson(dir, "achievements.json"));
}

export function getAcademic(dir: string = DEFAULT_DIR): Academic {
  return academicSchema.parse(readJson(dir, "academic.json"));
}

export function getSignature(dir: string = DEFAULT_DIR): Signature {
  return signatureSchema.parse(readJson(dir, "signature.json"));
}

export function getOverall(dir: string = DEFAULT_DIR): Overall {
  return overallSchema.parse(readJson(dir, "overall.json"));
}

export function getSkillsRadar(dir: string = DEFAULT_DIR): RadarAxis[] {
  return skillsRadarSchema.parse(readJson(dir, "skills-radar.json"));
}

export function getCharacter(dir: string = DEFAULT_DIR): Character {
  return characterSchema.parse(readJson(dir, "character.json"));
}

export function getTeacherInsights(dir: string = DEFAULT_DIR): TeacherInsights {
  return teacherInsightsSchema.parse(readJson(dir, "teacher-insights.json"));
}

export function getTeacherComments(dir: string = DEFAULT_DIR): YearComments[] {
  return teacherCommentsSchema.parse(readJson(dir, "teacher-comments.json"));
}

export function getJourney(dir: string = DEFAULT_DIR): JourneyMilestone[] {
  return journeySchema.parse(readJson(dir, "journey.json"));
}

export function getGallery(dir: string = DEFAULT_DIR): MediaItem[] {
  return mediaSchema.parse(readJson(dir, "gallery.json"));
}

export function getProjects(dir: string = DEFAULT_DIR): Project[] {
  const root = path.join(dir, "projects");
  if (!fs.existsSync(root)) return [];
  const slugs = fs
    .readdirSync(root)
    .filter((s) => fs.statSync(path.join(root, s)).isDirectory());
  return slugs
    .map((slug) => ({
      ...projectSchema.parse(readJson(path.join(root, slug), "project.json")),
      slug,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getProject(
  slug: string,
  dir: string = DEFAULT_DIR,
): Project | undefined {
  return getProjects(dir).find((p) => p.slug === slug);
}
