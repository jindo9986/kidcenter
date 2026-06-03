"use client";

import { useEffect, useState } from "react";
import type { L } from "@/lib/schemas";
import { Localized } from "./Localized";

export type NavItem = { id: string; label: L };

export function SectionNav({
  items,
  variant = "horizontal",
}: {
  items: NavItem[];
  variant?: "horizontal" | "vertical";
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const els = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (inView[0]) setActive(inView[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  function go(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (variant === "vertical") {
    return (
      <nav aria-label="Mục lục">
        <ul className="flex flex-col gap-0.5">
          {items.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => go(it.id)}
                aria-current={active === it.id ? "true" : undefined}
                className={
                  active === it.id
                    ? "block w-full rounded-lg border-l-2 border-brand bg-brand/8 px-3 py-1.5 text-left text-sm font-bold text-brand"
                    : "block w-full rounded-lg border-l-2 border-transparent px-3 py-1.5 text-left text-sm font-medium text-ink/55 transition-colors hover:bg-black/5 hover:text-ink"
                }
              >
                <Localized value={it.label} />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Mục lục"
      className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex gap-1.5 py-1">
        {items.map((it) => (
          <li key={it.id}>
            <button
              type="button"
              onClick={() => go(it.id)}
              aria-current={active === it.id ? "true" : undefined}
              className={
                active === it.id
                  ? "whitespace-nowrap rounded-full bg-brand px-3 py-1.5 text-sm font-semibold text-white"
                  : "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-ink/55 transition-colors hover:bg-black/5"
              }
            >
              <Localized value={it.label} />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
