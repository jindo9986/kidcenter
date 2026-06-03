"use client";

import { useEffect, useState } from "react";
import type { L } from "@/lib/schemas";
import { Localized } from "./Localized";

export type NavItem = { id: string; label: L };

export function SectionNav({ items }: { items: NavItem[] }) {
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
      // Activate a section once its top passes the sticky header zone.
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Mục lục"
      className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex gap-1.5 whitespace-nowrap py-1">
        {items.map((it) => (
          <li key={it.id}>
            <button
              type="button"
              onClick={() => go(it.id)}
              aria-current={active === it.id ? "true" : undefined}
              className={
                active === it.id
                  ? "rounded-full bg-brand px-3 py-1.5 text-sm font-semibold text-white"
                  : "rounded-full px-3 py-1.5 text-sm font-medium text-ink/55 transition-colors hover:bg-black/5"
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
