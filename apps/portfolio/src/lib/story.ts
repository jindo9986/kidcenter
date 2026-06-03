import fs from "node:fs";
import path from "node:path";
import type { L } from "@/lib/schemas";

export interface Rating {
  name: L;
  stars: number;
}

export interface Story {
  hero: {
    name: string;
    roles: L[];
    subtitle: L;
    motto: L[];
  };
  welcome: {
    eyebrow: L;
    lead: L;
    lines: L[];
    turn: L;
    paras: L[];
  };
  story: {
    eyebrow: L;
    title: L;
    intro: L[];
    questions: L[];
    beats: { title: L; body: L }[];
  };
  philosophy: {
    eyebrow: L;
    title: L;
    intro: L;
    steps: { name: L; through: L }[];
  };
  combination: {
    eyebrow: L;
    title: L;
    intro: L[];
    domains: { name: L; role: L; body: L }[];
    conclusion: L;
  };
  visual: {
    eyebrow: L;
    title: L;
    cycle: L[];
    note: L;
    reflects: L[];
  };
  curiosity: {
    eyebrow: L;
    title: L;
    intro: L[];
    becomes: L[];
    observing: L[];
    everyday: { title: L; intro: L; questions: L[]; close: L };
    beyond: { title: L; intro: L; places: L[]; close: L };
    mindset: {
      title: L;
      intro: L;
      links: { from: L; to: L }[];
      close: L;
    };
    reveal: {
      title: L;
      intro: L;
      traits: { name: L; body: L }[];
    };
  };
  growth: {
    eyebrow: L;
    title: L;
    intro: L;
    stages: { grade: L; theme: L; body: L; strengths: L[] }[];
    pattern: L[];
  };
  teachers: {
    eyebrow: L;
    title: L;
    entries: {
      grade: L;
      label: L;
      name: string;
      role: L;
      quotes: L[];
      themes: L[];
    }[];
    consistent: L;
  };
  capabilities: {
    eyebrow: L;
    title: L;
    items: Rating[];
  };
  academic: {
    eyebrow: L;
    title: L;
    grade4: { subject: L; score: string }[];
    strengths: Rating[];
    excellentNote: L;
    naturalScience: string[];
    naturalScienceNote: L;
    cambridge: L[];
    cambridgeNote: L;
  };
  forward: {
    eyebrow: L;
    title: L;
    intro: L[];
    projects: L[];
    close: L;
  };
  motto: {
    lines: L[];
    reflection: L[];
    statement: L;
  };
}

export function getStory(): Story {
  const file = path.join(process.cwd(), "content", "story.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as Story;
}
