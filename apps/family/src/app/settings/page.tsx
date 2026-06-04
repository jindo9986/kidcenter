"use client";

import Link from "next/link";
import { Card } from "@kidcenter/ui";
import { ParentShell } from "@/components/ParentShell";

const SECTIONS = [
  { href: "/activities", icon: "📋", title: "Hoạt động", desc: "Nhóm việc, hoạt động, điểm, lịch lặp lại" },
  { href: "/rewards", icon: "🎁", title: "Phần thưởng", desc: "Cửa hàng đổi điểm" },
  {
    href: "/access",
    icon: "🔑",
    title: "Thành viên & quyền",
    desc: "Email Google được phép đăng nhập (bố mẹ / con)",
  },
];

export default function SettingsPage() {
  return (
    <ParentShell>
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-ink">Cài đặt</h1>
        <div className="space-y-3">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="block">
              <Card className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden>
                  {s.icon}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-ink">{s.title}</p>
                  <p className="text-sm text-ink/60">{s.desc}</p>
                </div>
                <span className="text-ink/30">›</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </ParentShell>
  );
}
