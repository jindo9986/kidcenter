"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@kidcenter/ui";
import { useAuth } from "@/app/providers";
import { signOut } from "@/lib/session";
import { LoginScreen } from "@/features/auth/LoginScreen";
import { Spinner } from "./Spinner";

const NAV = [
  { href: "/", label: "Tổng quan", icon: "🏠" },
  { href: "/activities", label: "Hoạt động", icon: "📋" },
  { href: "/approvals", label: "Duyệt", icon: "✅" },
  { href: "/points", label: "Điểm", icon: "⭐" },
  { href: "/rewards", label: "Phần thưởng", icon: "🎁" },
  { href: "/members", label: "Thành viên", icon: "👨‍👩‍👧" },
];

function ParentNav() {
  const pathname = usePathname();
  // Normalize trailing slash (static export uses trailingSlash: true).
  const here = pathname?.replace(/\/+$/, "") || "/";
  return (
    <nav className="sticky top-0 z-10 border-b border-black/5 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-1 overflow-x-auto px-3 py-2">
        {NAV.map((item) => {
          const target = item.href.replace(/\/+$/, "") || "/";
          const active = here === target;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "flex shrink-0 items-center gap-1 rounded-2xl px-3 py-1.5 text-sm font-semibold transition-colors " +
                (active ? "bg-brand text-white" : "text-ink/70 hover:bg-brand/10")
              }
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Gates a parent-only screen and renders the shared nav + header around it.
export function ParentShell({ children }: { children: React.ReactNode }) {
  const { member, loading } = useAuth();

  if (loading) return <Spinner label="Đang tải…" />;
  if (!member) return <LoginScreen />;
  if (member.role !== "parent") return <LoginScreen unauthorized />;

  return (
    <div className="min-h-screen">
      <ParentNav />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-ink/60">
            Xin chào, <span className="font-semibold text-ink">{member.display_name}</span>
          </p>
          <Button variant="ghost" size="sm" onClick={() => void signOut()}>
            Đăng xuất
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
