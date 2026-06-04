"use client";

import Link from "next/link";
import { Card } from "@kidcenter/ui";
import { Spinner } from "@/components/Spinner";
import { useAsync } from "@/lib/useAsync";
import { listChildren } from "@/data/members";
import type { Member } from "@/data/db-types";

// Parent kid-mode: pick which child to view/act as on a shared device (no PIN).
export function KidSelect({
  familyId,
  onSelect,
}: {
  familyId: string;
  onSelect: (child: Member) => void;
}) {
  const { data: children, loading } = useAsync(() => listChildren(familyId), [familyId]);

  if (loading) return <Spinner label="Đang tải…" />;

  return (
    <main className="mx-auto max-w-md p-6">
      <Link href="/" className="text-sm font-semibold text-brand">
        ← Quay lại quản trị
      </Link>
      <h1 className="mt-4 text-center font-display text-2xl font-bold text-ink">Chọn bé</h1>
      <p className="mb-6 text-center text-sm text-ink/60">Ai đang chơi nào?</p>
      <div className="grid grid-cols-2 gap-3">
        {(children ?? []).map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className="rounded-3xl border border-black/5 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="text-4xl">🧒</div>
            <p className="mt-2 font-semibold text-ink">{c.display_name}</p>
          </button>
        ))}
        {children?.length === 0 && (
          <Card className="col-span-2">
            <p className="text-sm text-ink/60">
              Chưa có bé nào. Thêm Gmail của bé ở Cài đặt → Thành viên &amp; quyền (vai
              trò Con); bé đăng nhập lần đầu sẽ xuất hiện ở đây.
            </p>
          </Card>
        )}
      </div>
    </main>
  );
}
