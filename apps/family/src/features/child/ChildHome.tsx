"use client";

import { useState } from "react";
import { Button, Card } from "@kidcenter/ui";
import { Spinner } from "@/components/Spinner";
import { useAsync } from "@/lib/useAsync";
import { signOut } from "@/lib/session";
import { todayISO } from "@/lib/date";
import { toActivityLite } from "@/lib/adapters";
import { generateInstances } from "@/domain/recurrence";
import { canAfford } from "@/domain/points";
import { listChildren } from "@/data/members";
import { listActiveActivities } from "@/data/activities";
import {
  listToday,
  upsertInstances,
  submitTask,
  autoCompleteTask,
  type TaskInstanceWithActivity,
} from "@/data/tasks";
import { balanceOf, listLedger } from "@/data/points";
import { listActiveRewards, requestRedemption } from "@/data/rewards";
import type { Member } from "@/data/db-types";

// The signed-in child (every member has their own Google login — no shared-device
// picker or PIN).
export function ChildHome({ member }: { member: Member }) {
  return <ChildShell child={member} />;
}

type Tab = "today" | "points" | "store" | "board";

function ChildShell({ child }: { child: Member }) {
  const [tab, setTab] = useState<Tab>("today");
  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "today", label: "Hôm nay", icon: "📋" },
    { key: "points", label: "Điểm", icon: "⭐" },
    { key: "store", label: "Cửa hàng", icon: "🎁" },
    { key: "board", label: "Xếp hạng", icon: "🏆" },
  ];

  return (
    <div className="min-h-screen pb-24">
      <header className="mx-auto flex max-w-md items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs text-ink/50">Người chơi</p>
          <p className="font-display text-xl font-bold text-ink">🧒 {child.display_name}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => void signOut()}>
          Đăng xuất
        </Button>
      </header>

      <main className="mx-auto max-w-md px-4">
        {tab === "today" && <TodayView child={child} />}
        {tab === "points" && <PointsView child={child} />}
        {tab === "store" && <StoreView child={child} />}
        {tab === "board" && <BoardView child={child} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 border-t border-black/5 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-md">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-semibold transition-colors " +
                (tab === t.key ? "text-brand" : "text-ink/50")
              }
            >
              <span className="text-xl">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function TodayView({ child }: { child: Member }) {
  const today = todayISO();
  const [busy, setBusy] = useState<string | null>(null);

  const { data, loading, reload } = useAsync(async () => {
    const acts = await listActiveActivities(child.family_id);
    const planned = generateInstances(acts.map(toActivityLite), [child.id], today).filter(
      (p) => p.memberId === child.id,
    );
    await upsertInstances(planned);
    return listToday(child.id, today);
  }, [child.id]);

  async function done(t: TaskInstanceWithActivity) {
    setBusy(t.id);
    try {
      if (t.activities?.requires_approval) await submitTask(t.id);
      else await autoCompleteTask(t.id);
      reload();
    } finally {
      setBusy(null);
    }
  }

  if (loading || !data) return <Spinner />;
  const tasks = [...data].sort((a, b) => (a.activities?.title ?? "").localeCompare(b.activities?.title ?? ""));

  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg font-bold text-ink">Nhiệm vụ hôm nay</h2>
      {tasks.length === 0 && <p className="text-sm text-ink/60">Hôm nay chưa có nhiệm vụ nào. 🎉</p>}
      {tasks.map((t) => {
        const pts = t.activities?.points ?? 0;
        return (
          <Card key={t.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-ink">{t.activities?.title ?? "Nhiệm vụ"}</p>
              <p className="text-xs text-brand">
                {pts >= 0 ? "+" : ""}
                {pts} điểm
              </p>
            </div>
            {t.status === "approved" ? (
              <span className="font-bold text-brand">✓</span>
            ) : t.status === "submitted" ? (
              <span className="text-xs text-ink/50">Đang chờ duyệt…</span>
            ) : t.status === "rejected" ? (
              <span className="text-xs text-red-600">Bị từ chối</span>
            ) : (
              <Button size="sm" disabled={busy === t.id} onClick={() => void done(t)}>
                Xong
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function PointsView({ child }: { child: Member }) {
  const { data, loading } = useAsync(async () => {
    const [balance, ledger] = await Promise.all([balanceOf(child.id), listLedger(child.id, 30)]);
    return { balance, ledger };
  }, [child.id]);

  if (loading || !data) return <Spinner />;
  return (
    <div className="space-y-3">
      <Card className="text-center">
        <p className="text-sm text-ink/60">Điểm của bạn</p>
        <p className="text-5xl font-bold text-brand">{data.balance}</p>
      </Card>
      <h2 className="font-display text-lg font-bold text-ink">Gần đây</h2>
      {data.ledger.length === 0 && <p className="text-sm text-ink/60">Chưa có gì.</p>}
      {data.ledger.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"
        >
          <span className="text-sm text-ink">{t.reason || "Điểm"}</span>
          <span className={"font-bold " + (t.delta >= 0 ? "text-brand" : "text-red-600")}>
            {t.delta >= 0 ? "+" : ""}
            {t.delta}
          </span>
        </div>
      ))}
    </div>
  );
}

function StoreView({ child }: { child: Member }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [requested, setRequested] = useState<Set<string>>(new Set());

  const { data, loading, reload } = useAsync(async () => {
    const [balance, rewards] = await Promise.all([
      balanceOf(child.id),
      listActiveRewards(child.family_id),
    ]);
    return { balance, rewards };
  }, [child.id]);

  async function redeem(rewardId: string, cost: number) {
    setBusy(rewardId);
    try {
      await requestRedemption({ rewardId, memberId: child.id, costPoints: cost });
      setRequested((s) => new Set(s).add(rewardId));
      reload();
    } finally {
      setBusy(null);
    }
  }

  if (loading || !data) return <Spinner />;
  return (
    <div className="space-y-3">
      <Card className="text-center">
        <p className="text-sm text-ink/60">Bạn có</p>
        <p className="text-3xl font-bold text-brand">{data.balance} điểm</p>
      </Card>
      <h2 className="font-display text-lg font-bold text-ink">Cửa hàng phần thưởng</h2>
      {data.rewards.length === 0 && <p className="text-sm text-ink/60">Chưa có phần thưởng nào.</p>}
      {data.rewards.map((r) => {
        const affordable = canAfford(data.balance, r.cost_points);
        const done = requested.has(r.id);
        return (
          <Card key={r.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-ink">
                {r.icon} {r.title}
              </p>
              <p className="text-sm text-brand">{r.cost_points} điểm</p>
            </div>
            {done ? (
              <span className="text-xs text-ink/50">Đã gửi yêu cầu</span>
            ) : (
              <Button
                size="sm"
                disabled={!affordable || busy === r.id}
                onClick={() => void redeem(r.id, r.cost_points)}
              >
                {affordable ? "Đổi" : "Chưa đủ"}
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function BoardView({ child }: { child: Member }) {
  const { data, loading } = useAsync(async () => {
    const children = await listChildren(child.family_id);
    const balances = await Promise.all(children.map((c) => balanceOf(c.id)));
    return children
      .map((c, i) => ({ id: c.id, name: c.display_name, balance: balances[i] }))
      .sort((a, b) => b.balance - a.balance);
  }, [child.id]);

  if (loading || !data) return <Spinner />;
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg font-bold text-ink">Bảng xếp hạng</h2>
      {data.map((row, i) => (
        <Card
          key={row.id}
          className={
            "flex items-center justify-between gap-3 " +
            (row.id === child.id ? "ring-2 ring-brand" : "")
          }
        >
          <div className="flex items-center gap-3">
            <span className="w-6 text-center text-xl">{medals[i] ?? i + 1}</span>
            <span className="font-semibold text-ink">{row.name}</span>
          </div>
          <span className="text-lg font-bold text-brand">{row.balance}</span>
        </Card>
      ))}
    </div>
  );
}
