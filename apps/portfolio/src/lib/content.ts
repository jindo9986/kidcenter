import fs from "node:fs";
import path from "node:path";
import {
  profileSchema,
  achievementsSchema,
  academicSchema,
  skillsRadarSchema,
  characterSchema,
  teacherInsightsSchema,
  teacherCommentsSchema,
  journeySchema,
  mediaSchema,
  projectMetaSchema,
  type Profile,
  type Achievement,
  type Academic,
  type RadarAxis,
  type Character,
  type TeacherInsights,
  type YearComments,
  type JourneyMilestone,
  type MediaItem,
  type Project,
} from "./schemas";
import { renderMarkdown } from "./markdown";

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
  const projects = slugs.map((slug) => {
    const pdir = path.join(root, slug);
    const meta = projectMetaSchema.parse(readJson(pdir, "meta.json"));
    const vi = renderMarkdown(fs.readFileSync(path.join(pdir, "vi.md"), "utf8"));
    const en = renderMarkdown(fs.readFileSync(path.join(pdir, "en.md"), "utf8"));
    return { ...meta, slug, bodyHtml: { vi, en } };
  });
  return projects.sort((a, b) => b.date.localeCompare(a.date));
}
