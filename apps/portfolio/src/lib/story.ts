import fs from "node:fs";
import path from "node:path";

export interface Story {
  hero: { name: string; lines: string[]; motto: string[] };
  summary: {
    lead: string;
    paras: string[];
    threads: { label: string; through: string }[];
  };
  story: {
    eyebrow: string;
    title: string;
    paras: string[];
    questions: string[];
    chain: string[];
    drawLines: string[];
  };
  combination: {
    eyebrow: string;
    title: string;
    intro: string[];
    domains: { name: string; role: string; body: string }[];
    conclusion: string;
  };
  growth: {
    eyebrow: string;
    title: string;
    intro: string;
    stages: { grade: string; theme: string; body: string; strengths: string[] }[];
    pattern: string[];
    patternAlt: string[];
  };
  visual: {
    eyebrow: string;
    title: string;
    chain: string[];
    note: string;
    cycle: string[];
  };
  capabilities: { name: string; body: string }[];
  academic: {
    eyebrow: string;
    title: string;
    items: { k: string; v: string }[];
  };
  forward: {
    eyebrow: string;
    title: string;
    intro: string[];
    projects: string[];
    close: string;
  };
  motto: { lines: string[]; because: string[] };
}

export function getStory(): Story {
  const file = path.join(process.cwd(), "content", "story.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as Story;
}
