import { describe, it, expect } from "vitest";
import { renderMarkdown } from "@/lib/markdown";

describe("renderMarkdown", () => {
  it("renders headings and bold to HTML", () => {
    const html = renderMarkdown("# Hi\n\nThis is **bold**.");
    expect(html).toContain("<h1");
    expect(html).toContain("<strong>bold</strong>");
  });

  it("returns a string synchronously", () => {
    expect(typeof renderMarkdown("plain")).toBe("string");
  });
});
