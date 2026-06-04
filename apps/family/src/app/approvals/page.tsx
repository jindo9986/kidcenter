"use client";

import { useState } from "react";
import { Button, Card } from "@kidcenter/ui";
import { ParentShell } from "@/components/ParentShell";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/app/providers";
import { useAsync } from "@/lib/useAsync";
import { listChildren } from "@/data/members";
import { listSubmitted, rejectTask } from "@/data/tasks";
import { listRequestedRedemptions, rejectRedemption } from "@/data/rewards";
import { approveTask, approveRedemption } from "@/data/points";

export default function ApprovalsPage() {
  return (
    <ParentShell>
      <ApprovalsInner />
    </ParentShell>
  );
}

function ApprovalsInner() {
  const { member } = useAuth();
  const familyId = member!.family_id;
  const deciderId = member!.id;
  const [busy, setBusy] = useState<string | null>(null);

  const { data, loading, reload } = useAsync(async () => {
    const [tasks, redemptions, children] = await Promise.all([
      listSubmitted(familyId),
      listRequestedRedemptions(familyId),
      listChildren(familyId),
    ]);
    return { tasks, redemptions, children };
  }, [familyId]);

  if (loading || !data) return <Spinner />;
  const nameOf = (id: string) =>
    data.children.find((c) => c.id === id)?.display_name ?? "Bé";

  async function run(key: string, fn: () => Promise<void>) {
    setBusy(key);
    try {
      await fn();
      reload();
    } finally {
      setBusy(null);
    }
  }

  const nothing = data.tasks.length === 0 && data.redemptions.length === 0;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink">Chờ duyệt</h1>

      {nothing && <p className="text-sm text-ink/60">Không có gì cần duyệt. 🎉</p>}

      {data.tasks.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
            Nhiệm vụ ({data.tasks.length})
          </h2>
          {data.tasks.map((t) => {
            const pts = t.activities?.points ?? 0;
            return (
              <Card key={t.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{t.activities?.title ?? "Nhiệm vụ"}</p>
                    <p className="text-xs text-ink/50">
                      {nameOf(t.member_id)} · {t.due_date} · {pts >= 0 ? "+" : ""}
                      {pts} điểm
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={busy === t.id}
                      onClick={() =>
                        run(t.id, () =>
                          approveTask({
                            instanceId: t.id,
                            familyId,
                            memberId: t.member_id,
                            points: pts,
                            deciderId,
                          }),
                        )
                      }
                    >
                      Duyệt
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy === t.id}
                      onClick={() => run(t.id, () => rejectTask(t.id, deciderId))}
                    >
                      Từ chối
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>
      )}

      {data.redemptions.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
            Đổi thưởng ({data.redemptions.length})
          </h2>
          {data.redemptions.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">
                    {r.rewards?.icon} {r.rewards?.title ?? "Phần thưởng"}
                  </p>
                  <p className="text-xs text-ink/50">
                    {nameOf(r.member_id)} · -{r.cost_points} điểm
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={busy === r.id}
                    onClick={() =>
                      run(r.id, () =>
                        approveRedemption({
                          redemptionId: r.id,
                          familyId,
                          memberId: r.member_id,
                          cost: r.cost_points,
                          deciderId,
                        }),
                      )
                    }
                  >
                    Duyệt
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy === r.id}
                    onClick={() => run(r.id, () => rejectRedemption(r.id, deciderId))}
                  >
                    Từ chối
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
