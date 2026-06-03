import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Localized } from "@/components/Localized";

describe("Localized", () => {
  it("renders both languages with data-lang markers", () => {
    const html = renderToStaticMarkup(
      <Localized value={{ vi: "Xin chào", en: "Hello" }} />,
    );
    expect(html).toContain('data-lang="vi"');
    expect(html).toContain("Xin chào");
    expect(html).toContain('data-lang="en"');
    expect(html).toContain("Hello");
  });

  it("respects the `as` tag", () => {
    const html = renderToStaticMarkup(
      <Localized as="p" value={{ vi: "A", en: "B" }} />,
    );
    expect(html).toContain("<p");
  });
});
