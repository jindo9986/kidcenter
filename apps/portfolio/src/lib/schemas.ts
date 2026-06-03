import { z } from "zod";

export const L = z.object({ vi: z.string(), en: z.string() });
export type L = z.infer<typeof L>;

export const profileSchema = z.object({
  name: z.string(),
  nickname: z.string().optional(),
  birthDate: z.string(), // ISO yyyy-mm-dd
  avatar: z.string(),
  school: L,
  tagline: L,
  bio: L,
  focus: z.array(L), // development direction (e.g. Science, Math)
  personality: z.array(L),
  interests: z.array(L),
  skills: z.array(L),
  parentContact: z.object({
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }),
});
export type Profile = z.infer<typeof profileSchema>;

export const medalEnum = z.enum(["gold", "silver", "bronze", "none"]);
export type Medal = z.infer<typeof medalEnum>;

export const achievementCategoryEnum = z.enum([
  "international",
  "national",
  "local",
]);
export type AchievementCategory = z.infer<typeof achievementCategoryEnum>;

export const achievementSchema = z.object({
  category: achievementCategoryEnum,
  medal: medalEnum.default("none"),
  year: z.string().optional(),
  title: L,
  detail: L.optional(),
});
export const achievementsSchema = z.array(achievementSchema);
export type Achievement = z.infer<typeof achievementSchema>;

/** One subject result: a numeric score string (e.g. "10", "9") or a
 *  qualitative level ("T" = Tốt/Excellent, "Đ" = Đạt/Pass). */
export const subjectResultSchema = z.object({
  subject: L,
  score: z.string().optional(),
  level: z.string().optional(),
});
export type SubjectResult = z.infer<typeof subjectResultSchema>;

/** One school-year report card. */
export const yearRecordSchema = z.object({
  grade: L,
  year: z.string().optional(),
  civility: z.string().optional(),
  subjects: z.array(subjectResultSchema),
  honors: z.array(L).default([]),
});
export type YearRecord = z.infer<typeof yearRecordSchema>;

export const academicSchema = z.array(yearRecordSchema);
export type Academic = z.infer<typeof academicSchema>;

// Cambridge learner attributes (Character / Ability report).
export const characterAttributeSchema = z.object({ keyword: L, desc: L });
export type CharacterAttribute = z.infer<typeof characterAttributeSchema>;

export const characterSchema = z.object({
  level: z.object({ code: z.string(), vi: z.string(), en: z.string() }),
  scaleNote: L,
  allYearsNote: L,
  attributes: z.array(characterAttributeSchema),
});
export type Character = z.infer<typeof characterSchema>;

// Teacher comments per school year (authentic English quotes).
export const teacherCommentSchema = z.object({
  subject: L,
  teacher: z.string(),
  text: z.string(),
});
export const yearCommentsSchema = z.object({
  grade: L,
  year: z.string().optional(),
  comments: z.array(teacherCommentSchema),
  general: z
    .object({ teacher: z.string(), text: z.string() })
    .optional(),
  goals: z.string().optional(),
});
export const teacherCommentsSchema = z.array(yearCommentsSchema);
export type YearComments = z.infer<typeof yearCommentsSchema>;

export const journeyItemSchema = z.object({
  date: z.string(),
  icon: z.string(),
  title: L,
  body: L,
});
export const journeySchema = z.array(journeyItemSchema);
export type JourneyMilestone = z.infer<typeof journeyItemSchema>;

export const mediaItemSchema = z.object({
  type: z.enum(["image", "video"]),
  src: z.string(),
  caption: L,
});
export const mediaSchema = z.array(mediaItemSchema);
export type MediaItem = z.infer<typeof mediaItemSchema>;

export const projectMetaSchema = z.object({
  date: z.string(),
  cover: z.string().optional(),
  tag: L,
  title: L,
});
export type ProjectMeta = z.infer<typeof projectMetaSchema>;

export type Project = ProjectMeta & {
  slug: string;
  bodyHtml: { vi: string; en: string };
};
