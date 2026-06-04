"use client";

import { useState } from "react";
import { Button, Card } from "@kidcenter/ui";
import { ParentShell } from "@/components/ParentShell";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/app/providers";
import { useAsync } from "@/lib/useAsync";
import { listRewards, insertReward, updateReward, deleteReward } from "@/data/rewards";

export default function RewardsPage() {
  return (
    <ParentShell back="/settings">
      <RewardsInner />
    </ParentShell>
  );
}

function RewardsInner() {
  const { member } = useAuth();
  const familyId = member!.family_id;
  const { data, loading, reload } = useAsync(() => listRewards(familyId), [familyId]);

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [cost, setCost] = useState("");
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const c = Number(cost);
    if (!title.trim() || c < 0 || Number.isNaN(c)) return;
    setBusy(true);
    try {
      await insertReward({
        family_id: familyId,
        title: title.trim(),
        description: null,
        cost_points: c,
        icon: icon || null,
        stock: null,
        active: true,
      });
      setTitle("");
      setIcon("");
      setCost("");
      reload();
    } finally {
      setBusy(false);
    }
  }

  const inputCls = "rounded-xl border border-black/10 px-3 py-2";

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink">Cửa hàng phần thưởng</h1>

      <Card title="Thêm phần thưởng" icon="🎁">
        <form onSubmit={add} className="space-y-3">
          <div className="flex gap-2">
            <input
              className={`${inputCls} w-16 text-center`}
              placeholder="🍦"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
            <input
              className={`${inputCls} flex-1`}
              placeholder="Tên phần thưởng"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className={`${inputCls} w-28`}
              placeholder="Giá (điểm)"
              inputMode="numeric"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={busy}>
            Thêm
          </Button>
        </form>
      </Card>

      {loading || !data ? (
        <Spinner />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.length === 0 && <p className="text-sm text-ink/60">Chưa có phần thưởng.</p>}
          {data.map((r) => (
            <Card key={r.id}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-ink">
                    {r.icon} {r.title}
                  </p>
                  <p className="text-sm text-brand">{r.cost_points} điểm{!r.active && " · ⏸ Tắt"}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      await updateReward(r.id, { active: !r.active });
                      reload();
                    }}
                  >
                    {r.active ? "Tắt" : "Bật"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      await deleteReward(r.id);
                      reload();
                    }}
                  >
                    Xoá
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
