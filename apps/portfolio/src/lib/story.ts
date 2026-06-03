import fs from "node:fs";
import path from "node:path";

export interface Rating {
  name: string;
  stars: number;
}

export interface Story {
  hero: {
    name: string;
    roles: string[];
    subtitle: string;
    motto: string[];
  };
  welcome: {
    eyebrow: string;
    lead: string;
    lines: string[];
    turn: string;
    paras: string[];
  };
  story: {
    eyebrow: string;
    title: string;
    intro: string[];
    questions: string[];
    beats: { title: string; body: string }[];
  };
  philosophy: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: { name: string; through: string }[];
  };
  combination: {
    eyebrow: string;
    title: string;
    intro: string[];
    domains: { name: string; role: string; body: string }[];
    conclusion: string;
  };
  visual: {
    eyebrow: string;
    title: string;
    cycle: string[];
    note: string;
    reflects: string[];
  };
  curiosity: {
    eyebrow: string;
    title: string;
    intro: string[];
    becomes: string[];
    observing: string[];
    everyday: { title: string; intro: string; questions: string[]; close: string };
    beyond: { title: string; intro: string; places: string[]; close: string };
    mindset: {
      title: string;
      intro: string;
      links: { from: string; to: string }[];
      close: string;
    };
    reveal: {
      title: string;
      intro: string;
      traits: { name: string; body: string }[];
    };
  };
  growth: {
    eyebrow: string;
    title: string;
    intro: string;
    stages: { grade: string; theme: string; body: string; strengths: string[] }[];
    pattern: string[];
  };
  teachers: {
    eyebrow: string;
    title: string;
    entries: {
      grade: string;
      label: string;
      name: string;
      role: string;
      quotes: string[];
      themes: string[];
    }[];
    consistent: string;
  };
  capabilities: {
    eyebrow: string;
    title: string;
    items: Rating[];
  };
  academic: {
    eyebrow: string;
    title: string;
    grade4: { subject: string; score: string }[];
    strengths: Rating[];
    excellentYears: string[];
    excellentNote: string;
    naturalScience: string[];
    naturalScienceNote: string;
    cambridge: string[];
    cambridgeNote: string;
  };
  forward: {
    eyebrow: string;
    title: string;
    intro: string[];
    projects: string[];
    close: string;
  };
  motto: {
    lines: string[];
    reflection: string[];
    statement: string;
  };
}

export function getStory(): Story {
  const file = path.join(process.cwd(), "content", "story.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as Story;
}
