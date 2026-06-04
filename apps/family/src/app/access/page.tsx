"use client";

import { useState } from "react";
import { Button, Card } from "@kidcenter/ui";
import { ParentShell } from "@/components/ParentShell";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/app/providers";
import { useAsync } from "@/lib/useAsync";
import { listAllowlist, addAllowlist, removeAllowlist } from "@/data/allowlist";
import type { Role } from "@/domain/types";

export default function AccessPage() {
  return (
    <ParentShell back="/settings">
      <AccessInner />
    </ParentShell>
  );
}

function AccessInner() {
  const { member } = useAuth();
  const familyId = member!.family_id;
  const { data, loading, reload } = useAsync(() => listAllowlist(familyId), [familyId]);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("parent");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await addAllowlist({ familyId, email, role });
      setEmail("");
      reload();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(
        msg.includes("duplicate") || msg.includes("unique")
          ? "Email này đã có trong danh sách (của gia đình bạn hoặc gia đình khác)."
          : msg,
      );
    } finally {
      setBusy(false);
    }
  }

  const inputCls = "rounded-xl border border-black/10 px-3 py-2";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Thành viên &amp; quyền</h1>
        <p className="text-sm text-ink/60">
          Mỗi thành viên (bố mẹ và con) đăng nhập bằng Gmail. Thêm email vào đây với
          đúng vai trò — lần đăng nhập đầu hệ thống tự tạo hồ sơ thành viên.
        </p>
      </div>

      <Card title="Thêm email được phép" icon="🔑">
        <form onSubmit={add} className="space-y-3">
          <input
            className={`${inputCls} w-full`}
            placeholder="email@gmail.com"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex gap-2">
            <select
              className={`${inputCls} min-w-0 flex-1`}
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="parent">Bố / mẹ (parent)</option>
              <option value="child">Con (child)</option>
            </select>
            <Button type="submit" className="shrink-0" disabled={busy}>
              Thêm
            </Button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </Card>

      {loading || !data ? (
        <Spinner />
      ) : (
        <div className="space-y-2">
          {data.length === 0 && <p className="text-sm text-ink/60">Danh sách trống.</p>}
          {data.map((a) => (
            <Card key={a.id} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{a.email}</p>
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-xs font-semibold " +
                    (a.role === "parent" ? "bg-brand/10 text-brand" : "bg-accent/20 text-ink")
                  }
                >
                  {a.role === "parent" ? "Bố / mẹ" : "Con"}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  await removeAllowlist(a.id);
                  reload();
                }}
              >
                Xoá
              </Button>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-ink/50">
        Lưu ý: xoá email chỉ chặn lần đăng nhập mới, không xoá hồ sơ thành viên đã
        tạo. Tên hiển thị lấy theo tài khoản Google của mỗi người.
      </p>
    </div>
  );
}
