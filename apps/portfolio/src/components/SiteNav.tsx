"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LangToggle } from "./LangToggle";
import { Localized } from "./Localized";
import type { L } from "@/lib/schemas";

const ITEMS: { href: string; label: L }[] = [
  { href: "/", label: { vi: "Giới thiệu", en: "Intro" } },
  { href: "/profile", label: { vi: "Hồ sơ", en: "Profile" } },
  { href: "/assessment", label: { vi: "Đánh giá AI", en: "Assessment" } },
];

// Just the page links (no container / no LangToggle) — for pages that have their
// own header (e.g. the profile page with its table-of-contents bar).
export function SiteNavLinks() {
  const path = (usePathname() || "/").replace(/\/+$/, "") || "/";
  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {ITEMS.map((it) => {
        const active = path === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={
              "shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors " +
              (active ? "bg-brand text-white" : "text-ink/70 hover:bg-brand/5")
            }
          >
            <Localized value={it.label} />
          </Link>
        );
      })}
    </nav>
  );
}

// Full sticky top bar: page links + language toggle. Used on the Intro and
// Assessment pages.
export function SiteNav() {
  return (
    <div className="no-print sticky top-0 z-30 border-b border-black/5 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-5 py-2.5 sm:px-8">
        <SiteNavLinks />
        <LangToggle />
      </div>
    </div>
  );
}
