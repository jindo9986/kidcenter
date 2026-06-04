"use client";

import Link from "next/link";
import { Card } from "@kidcenter/ui";
import { useAuth } from "./providers";
import { Spinner } from "@/components/Spinner";
import { LoginScreen } from "@/features/auth/LoginScreen";
import { ParentShell } from "@/components/ParentShell";
import { ChildHome } from "@/features/child/ChildHome";
import { useAsync } from "@/lib/useAsync";
import { listChildren } from "@/data/members";
import { balanceOf } from "@/data/points";
import { listSubmitted } from "@/data/tasks";
import { listRequestedRedemptions } from "@/data/rewards";

export default function Home() {
  const { member, loading } = useAuth();
  if (loading) return <Spinner label="Đang tải…" />;
  if (!member) return <LoginScreen />;
  if (member.role === "child") return <ChildHome member={member} />;
  return (
    <ParentShell>
      <Dashboard familyId={member.family_id} />
    </ParentShell>
  );
}

function Dashboard({ familyId }: { familyId: string }) {
  const { data, loading } = useAsync(async () => {
    const children = await listChildren(familyId);
    const balances = await Promise.all(children.map((c) => balanceOf(c.id)));
    const [submitted, redemptions] = await Promise.all([
      listSubmitted(familyId),
      listRequestedRedemptions(familyId),
    ]);
    return {
      children: children.map((c, i) => ({ ...c, balance: balances[i] })),
      pending: submitted.length + redemptions.length,
    };
  }, [familyId]);

  if (loading || !data) return <Spinner />;

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Tổng quan</h1>
          <p className="text-sm text-ink/60">Điểm và việc cần duyệt của các bé.</p>
        </div>
        <Link
          href="/kid"
          className="shrink-0 rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-ink shadow-sm"
        >
          🧒 Chế độ trẻ
        </Link>
      </section>

      <Link href="/approvals" className="block">
        <Card className="flex items-center justify-between">
          <span className="font-semibold text-ink">Đang chờ duyệt</span>
          <span
            className={
              "rounded-full px-3 py-1 text-sm font-bold " +
              (data.pending > 0 ? "bg-accent text-ink" : "bg-black/5 text-ink/50")
            }
          >
            {data.pending}
          </span>
        </Card>
      </Link>

      <section className="grid gap-3 sm:grid-cols-2">
        {data.children.length === 0 && (
          <Card>
            <p className="text-sm text-ink/60">
              Chưa có bé nào.{" "}
              <Link href="/members" className="font-semibold text-brand">
                Thêm thành viên
              </Link>
            </p>
          </Card>
        )}
        {data.children.map((c) => (
          <Card key={c.id} title={c.display_name} icon="🧒">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-brand">{c.balance}</span>
              <span className="text-sm text-ink/60">điểm</span>
            </div>
            <div className="mt-3 flex gap-2 text-sm">
              <Link href="/points" className="font-semibold text-brand">
                Lịch sử
              </Link>
              <span className="text-ink/30">·</span>
              <Link href="/activities" className="font-semibold text-brand">
                Giao việc
              </Link>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
