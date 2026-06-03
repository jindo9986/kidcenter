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

export const gradeSchema = z.object({ subject: L, score: z.number() });
export type Grade = z.infer<typeof gradeSchema>;

export const academicSchema = z.object({
  year: z.string(),
  grades: z.array(gradeSchema),
  honors: z.array(L),
});
export type Academic = z.infer<typeof academicSchema>;

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
