import { marked } from "marked";

/** Render a Markdown string to an HTML string (synchronous, offline). */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
