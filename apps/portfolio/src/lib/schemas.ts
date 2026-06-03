import { z } from "zod";

export const L = z.object({ vi: z.string(), en: z.string() });
export type L = z.infer<typeof L>;

export const profileSchema = z.object({
  name: z.string(),
  age: z.number(),
  avatar: z.string(),
  tagline: L,
  bio: L,
  interests: z.array(L),
  skills: z.array(L),
  parentContact: z.object({
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }),
});
export type Profile = z.infer<typeof profileSchema>;

export const achievementSchema = z.object({
  date: z.string(),
  icon: z.string(),
  title: L,
  detail: L,
});
export const achievementsSchema = z.array(achievementSchema);
export type Achievement = z.infer<typeof achievementSchema>;

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
