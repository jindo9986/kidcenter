"use client";

import { useState } from "react";
import { Button, Card } from "@kidcenter/ui";
import { ParentShell } from "@/components/ParentShell";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/app/providers";
import { useAsync } from "@/lib/useAsync";
import { listChildren } from "@/data/members";
import { balanceOf, listLedger, addManualTxn } from "@/data/points";

export default function PointsPage() {
  return (
    <ParentShell>
      <PointsInner />
    </ParentShell>
  );
}

const SOURCE_LABEL: Record<string, string> = {
  task: "Nhiệm vụ",
  reward: "Đổi thưởng",
  bonus: "Thưởng thêm",
  penalty: "Phạt",
  manual: "Thủ công",
};

function PointsInner() {
  const { member } = useAuth();
  const familyId = member!.family_id;
  const deciderId = member!.id;

  const { data: children } = useAsync(() => listChildren(familyId), [familyId]);
  const [selected, setSelected] = useState<string>("");
  const childId = selected || children?.[0]?.id || "";

  const { data, loading, reload } = useAsync(async () => {
    if (!childId) return null;
    const [balance, ledger] = await Promise.all([balanceOf(childId), listLedger(childId)]);
    return { balance, ledger };
  }, [childId]);

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  async function addTxn(sign: 1 | -1) {
    const n = Number(amount);
    if (!n || !childId) return;
    setBusy(true);
    try {
      await addManualTxn({
        familyId,
        memberId: childId,
        delta: sign * Math.abs(n),
        reason: reason.trim() || (sign > 0 ? "Thưởng" : "Phạt"),
        deciderId,
      });
      setAmount("");
      setReason("");
      reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink">Điểm &amp; lịch sử</h1>

      <div className="flex flex-wrap gap-2">
        {(children ?? []).map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            className={
              "rounded-2xl px-4 py-2 text-sm font-semibold transition-colors " +
              (c.id === childId ? "bg-brand text-white" : "bg-black/5 text-ink/70")
            }
          >
            {c.display_name}
          </button>
        ))}
      </div>

      {!childId ? (
        <p className="text-sm text-ink/60">Chưa có bé nào.</p>
      ) : loading || !data ? (
        <Spinner />
      ) : (
        <>
          <Card>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-brand">{data.balance}</span>
              <span className="text-ink/60">điểm hiện có</span>
            </div>
          </Card>

          <Card title="Cộng / trừ thủ công" icon="✍️">
            <div className="flex flex-wrap items-center gap-2">
              <input
                className="w-24 rounded-xl border border-black/10 px-3 py-2"
                placeholder="Số điểm"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <input
                className="flex-1 rounded-xl border border-black/10 px-3 py-2"
                placeholder="Lý do"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <Button size="sm" onClick={() => void addTxn(1)} disabled={busy}>
                + Thưởng
              </Button>
              <Button size="sm" variant="ghost" onClick={() => void addTxn(-1)} disabled={busy}>
                − Phạt
              </Button>
            </div>
          </Card>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
              Lịch sử
            </h2>
            {data.ledger.length === 0 && <p className="text-sm text-ink/60">Chưa có giao dịch.</p>}
            {data.ledger.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{t.reason || SOURCE_LABEL[t.source]}</p>
                  <p className="text-xs text-ink/50">
                    {SOURCE_LABEL[t.source]} · {t.created_at.slice(0, 10)}
                  </p>
                </div>
                <span
                  className={
                    "text-lg font-bold " + (t.delta >= 0 ? "text-brand" : "text-red-600")
                  }
                >
                  {t.delta >= 0 ? "+" : ""}
                  {t.delta}
                </span>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
