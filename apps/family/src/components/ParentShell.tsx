"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@kidcenter/ui";
import { useAuth } from "@/app/providers";
import { signOut } from "@/lib/session";
import { LoginScreen } from "@/features/auth/LoginScreen";
import { Spinner } from "./Spinner";

// Mobile-first bottom tabs. The config screens (activities/rewards/members/access)
// live under the "Cài đặt" tab, reached via the /settings hub.
const TABS = [
  { href: "/", label: "Tổng quan", icon: "🏠", match: ["/"] },
  { href: "/approvals", label: "Duyệt", icon: "✅", match: ["/approvals"] },
  { href: "/points", label: "Điểm", icon: "⭐", match: ["/points"] },
  {
    href: "/settings",
    label: "Cài đặt",
    icon: "⚙️",
    match: ["/settings", "/activities", "/rewards", "/access"],
  },
];

// Normalize trailing slash (static export uses trailingSlash: true).
const norm = (p: string | null) => p?.replace(/\/+$/, "") || "/";

function ParentTabs() {
  const here = norm(usePathname());
  const activeHref = TABS.find((t) => t.match.some((m) => norm(m) === here))?.href ?? "/";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-black/5 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg">
        {TABS.map((t) => {
          const active = t.href === activeHref;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-semibold transition-colors " +
                (active ? "text-brand" : "text-ink/50")
              }
            >
              <span className="text-xl" aria-hidden>
                {t.icon}
              </span>
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Gates a parent-only screen and renders the shared header + bottom tabs.
// `back` (e.g. "/settings") swaps the greeting for a back link on sub-screens.
export function ParentShell({
  children,
  back,
}: {
  children: React.ReactNode;
  back?: string;
}) {
  const { member, loading } = useAuth();

  if (loading) return <Spinner label="Đang tải…" />;
  if (!member) return <LoginScreen />;
  if (member.role !== "parent") return <LoginScreen unauthorized />;

  return (
    <div className="min-h-screen pb-24">
      <header className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
        {back ? (
          <Link href={back} className="text-sm font-semibold text-brand">
            ← Cài đặt
          </Link>
        ) : (
          <p className="text-sm text-ink/60">
            Xin chào, <span className="font-semibold text-ink">{member.display_name}</span>
          </p>
        )}
        <Button variant="ghost" size="sm" onClick={() => void signOut()}>
          Đăng xuất
        </Button>
      </header>
      <div className="mx-auto max-w-lg px-4">{children}</div>
      <ParentTabs />
    </div>
  );
}
