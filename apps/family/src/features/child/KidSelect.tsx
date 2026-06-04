"use client";

import { useState } from "react";
import { Button, Card } from "@kidcenter/ui";
import { Spinner } from "@/components/Spinner";
import { useAsync } from "@/lib/useAsync";
import { listChildren } from "@/data/members";
import { verifyPin } from "@/domain/pin";
import type { Member } from "@/data/db-types";

// Shared-device entry: pick a child, optionally unlock with a PIN.
export function KidSelect({
  familyId,
  onSelect,
}: {
  familyId: string;
  onSelect: (child: Member) => void;
}) {
  const { data: children, loading } = useAsync(() => listChildren(familyId), [familyId]);
  const [pending, setPending] = useState<Member | null>(null);

  if (loading) return <Spinner label="Đang tải…" />;

  if (pending && pending.pin_hash && pending.pin_salt) {
    return (
      <PinPrompt
        child={pending}
        onCancel={() => setPending(null)}
        onOk={() => onSelect(pending)}
      />
    );
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-1 text-center font-display text-2xl font-bold text-ink">Chọn người chơi</h1>
      <p className="mb-6 text-center text-sm text-ink/60">Ai đang chơi nào?</p>
      <div className="grid grid-cols-2 gap-3">
        {(children ?? []).map((c) => (
          <button
            key={c.id}
            onClick={() => (c.pin_hash ? setPending(c) : onSelect(c))}
            className="rounded-3xl border border-black/5 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="text-4xl">{c.avatar_url ? "🧒" : "🧒"}</div>
            <p className="mt-2 font-semibold text-ink">{c.display_name}</p>
            {c.pin_hash && <p className="text-xs text-ink/40">🔒 Cần PIN</p>}
          </button>
        ))}
        {children?.length === 0 && (
          <Card className="col-span-2">
            <p className="text-sm text-ink/60">Chưa có bé nào. Bố/mẹ hãy thêm ở mục Thành viên.</p>
          </Card>
        )}
      </div>
    </main>
  );
}

function PinPrompt({
  child,
  onOk,
  onCancel,
}: {
  child: Member;
  onOk: () => void;
  onCancel: () => void;
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function check() {
    setBusy(true);
    try {
      const ok = await verifyPin(pin, child.pin_salt!, child.pin_hash!);
      if (ok) onOk();
      else {
        setError(true);
        setPin("");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xs flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-4xl">🔒</p>
      <p className="font-semibold text-ink">Nhập PIN của {child.display_name}</p>
      <input
        autoFocus
        className="w-40 rounded-2xl border border-black/10 px-4 py-3 text-center text-2xl tracking-widest"
        inputMode="numeric"
        type="password"
        value={pin}
        onChange={(e) => {
          setError(false);
          setPin(e.target.value.replace(/\D/g, "").slice(0, 6));
        }}
        onKeyDown={(e) => e.key === "Enter" && void check()}
      />
      {error && <p className="text-sm text-red-600">PIN không đúng, thử lại nhé.</p>}
      <div className="flex gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Quay lại
        </Button>
        <Button onClick={() => void check()} disabled={busy || pin.length < 4}>
          Vào
        </Button>
      </div>
    </main>
  );
}
