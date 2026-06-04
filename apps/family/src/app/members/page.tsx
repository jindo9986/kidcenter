"use client";

import { useState } from "react";
import { Button, Card } from "@kidcenter/ui";
import { ParentShell } from "@/components/ParentShell";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/app/providers";
import { useAsync } from "@/lib/useAsync";
import { listChildren, insertChild, updateMember, setPin, clearPin } from "@/data/members";
import { hashPin } from "@/domain/pin";
import type { Member } from "@/data/db-types";

export default function MembersPage() {
  return (
    <ParentShell back="/settings">
      <MembersInner />
    </ParentShell>
  );
}

function MembersInner() {
  const { member } = useAuth();
  const familyId = member!.family_id;
  const { data: children, loading, reload } = useAsync(() => listChildren(familyId), [familyId]);

  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [busy, setBusy] = useState(false);

  async function addChild(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      await insertChild({
        familyId,
        displayName: name.trim(),
        birthYear: birthYear ? Number(birthYear) : null,
      });
      setName("");
      setBirthYear("");
      reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink">Thành viên</h1>

      <Card title="Thêm bé" icon="➕">
        <form onSubmit={addChild} className="flex flex-col gap-3 sm:flex-row">
          <input
            className="flex-1 rounded-xl border border-black/10 px-3 py-2"
            placeholder="Tên hiển thị"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-black/10 px-3 py-2 sm:w-32"
            placeholder="Năm sinh"
            inputMode="numeric"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
          />
          <Button type="submit" disabled={busy}>
            Thêm
          </Button>
        </form>
      </Card>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid gap-3">
          {(children ?? []).map((c) => (
            <ChildRow key={c.id} child={c} onChanged={reload} />
          ))}
          {children?.length === 0 && (
            <p className="text-sm text-ink/60">Chưa có bé nào.</p>
          )}
        </div>
      )}
    </div>
  );
}

function ChildRow({ child, onChanged }: { child: Member; onChanged: () => void }) {
  const [pin, setPinValue] = useState("");
  const [busy, setBusy] = useState(false);

  async function savePin() {
    if (pin.length < 4) return;
    setBusy(true);
    try {
      const salt = crypto.randomUUID();
      const hash = await hashPin(pin, salt);
      await setPin(child.id, hash, salt);
      setPinValue("");
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{child.display_name}</p>
          <p className="text-xs text-ink/50">
            {child.birth_year ? `Sinh ${child.birth_year} · ` : ""}
            {child.pin_hash ? "🔒 Có PIN" : "Không PIN"}
            {child.auth_user_id ? " · Đã liên kết Google" : ""}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await updateMember(child.id, { active: false });
            onChanged();
          }}
        >
          Ẩn
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          className="w-28 rounded-xl border border-black/10 px-3 py-2"
          placeholder="PIN mới"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPinValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
        />
        <Button size="sm" onClick={() => void savePin()} disabled={busy || pin.length < 4}>
          Đặt PIN
        </Button>
        {child.pin_hash && (
          <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
              await clearPin(child.id);
              onChanged();
            }}
          >
            Xoá PIN
          </Button>
        )}
      </div>
      <p className="mt-2 text-xs text-ink/50">
        Để bé tự đăng nhập bằng Google: thêm email của bé vào allowlist (role child)
        trong Supabase; lần đăng nhập đầu sẽ tự liên kết.
      </p>
    </Card>
  );
}
