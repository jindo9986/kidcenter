"use client";

import { useState } from "react";
import { Button, Card } from "@kidcenter/ui";
import { ParentShell } from "@/components/ParentShell";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/app/providers";
import { useAsync } from "@/lib/useAsync";
import { listChildren } from "@/data/members";
import {
  listActivities,
  listActivityTypes,
  upsertActivityType,
  deleteActivityType,
  insertActivity,
  updateActivity,
  deleteActivity,
  type ActivityInput,
} from "@/data/activities";
import { WEEKDAY_LABELS } from "@/lib/date";
import type { Recurrence } from "@/domain/types";
import type { Activity } from "@/data/db-types";

export default function ActivitiesPage() {
  return (
    <ParentShell back="/settings">
      <ActivitiesInner />
    </ParentShell>
  );
}

function ActivitiesInner() {
  const { member } = useAuth();
  const familyId = member!.family_id;
  const [editing, setEditing] = useState<Activity | null>(null);
  const { data, loading, reload } = useAsync(async () => {
    const [types, activities, children] = await Promise.all([
      listActivityTypes(familyId),
      listActivities(familyId),
      listChildren(familyId),
    ]);
    return { types, activities, children };
  }, [familyId]);

  if (loading || !data) return <Spinner />;
  const typeName = (id: string | null) =>
    data.types.find((t) => t.id === id)?.name ?? "—";

  function startEdit(a: Activity) {
    setEditing(a);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink">Hoạt động</h1>

      <TypeManager familyId={familyId} types={data.types} onChanged={reload} />

      <ActivityForm
        key={editing?.id ?? "new"}
        familyId={familyId}
        types={data.types}
        kids={data.children}
        editing={editing}
        onChanged={reload}
        onCancelEdit={() => setEditing(null)}
      />

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
          Danh sách hoạt động
        </h2>
        {data.activities.length === 0 && (
          <p className="text-sm text-ink/60">Chưa có hoạt động nào.</p>
        )}
        {data.activities.map((a) => (
          <Card key={a.id} className={editing?.id === a.id ? "ring-2 ring-brand" : ""}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">
                  {a.title}{" "}
                  <span className={a.points >= 0 ? "text-brand" : "text-red-600"}>
                    ({a.points >= 0 ? "+" : ""}
                    {a.points})
                  </span>
                </p>
                <p className="text-xs text-ink/50">
                  {typeName(a.type_id)} · {recurrenceLabel(a)} ·{" "}
                  {a.assignee_member_id
                    ? data.children.find((c) => c.id === a.assignee_member_id)?.display_name ??
                      "1 bé"
                    : "Tất cả"}{" "}
                  · {a.requires_approval ? "Cần duyệt" : "Tự động"}
                  {!a.active && " · ⏸ Tắt"}
                </p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => startEdit(a)}>
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await updateActivity(a.id, { active: !a.active });
                    reload();
                  }}
                >
                  {a.active ? "Tắt" : "Bật"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await deleteActivity(a.id);
                    if (editing?.id === a.id) setEditing(null);
                    reload();
                  }}
                >
                  Xoá
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}

function recurrenceLabel(a: { recurrence: Recurrence; schedule: { days?: number[] } | null }) {
  if (a.recurrence === "daily") return "Hàng ngày";
  if (a.recurrence === "once") return "Một lần";
  const days = (a.schedule?.days ?? []).map((d) => WEEKDAY_LABELS[d]).join(", ");
  return `${a.recurrence === "weekly" ? "Hàng tuần" : "Tuỳ chọn"}: ${days || "—"}`;
}

function TypeManager({
  familyId,
  types,
  onChanged,
}: {
  familyId: string;
  types: { id: string; name: string; icon: string | null }[];
  onChanged: () => void;
}) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  return (
    <Card title="Nhóm hoạt động" icon="🗂️">
      <div className="mb-3 flex flex-wrap gap-2">
        {types.map((t) => (
          <span
            key={t.id}
            className="flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 text-sm"
          >
            {t.icon} {t.name}
            <button
              className="text-ink/40 hover:text-red-600"
              onClick={async () => {
                await deleteActivityType(t.id);
                onChanged();
              }}
            >
              ✕
            </button>
          </span>
        ))}
        {types.length === 0 && <p className="text-sm text-ink/60">Chưa có nhóm.</p>}
      </div>
      <div className="flex gap-2">
        <input
          className="w-14 shrink-0 rounded-xl border border-black/10 px-2 py-2 text-center"
          placeholder="🏠"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
        />
        <input
          className="min-w-0 flex-1 rounded-xl border border-black/10 px-3 py-2"
          placeholder="Tên nhóm (vd: Việc nhà)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          className="shrink-0"
          onClick={async () => {
            if (!name.trim()) return;
            await upsertActivityType({ family_id: familyId, name: name.trim(), icon: icon || null });
            setName("");
            setIcon("");
            onChanged();
          }}
        >
          Thêm
        </Button>
      </div>
    </Card>
  );
}

function ActivityForm({
  familyId,
  types,
  kids,
  editing,
  onChanged,
  onCancelEdit,
}: {
  familyId: string;
  types: { id: string; name: string }[];
  kids: { id: string; display_name: string }[];
  editing: Activity | null;
  onChanged: () => void;
  onCancelEdit: () => void;
}) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [typeId, setTypeId] = useState(editing?.type_id ?? "");
  const [points, setPoints] = useState(editing ? String(editing.points) : "5");
  const [recurrence, setRecurrence] = useState<Recurrence>(editing?.recurrence ?? "daily");
  const [days, setDays] = useState<number[]>(editing?.schedule?.days ?? []);
  const [assignee, setAssignee] = useState(editing?.assignee_member_id ?? "");
  const [requiresApproval, setRequiresApproval] = useState(editing?.requires_approval ?? true);
  const [busy, setBusy] = useState(false);

  const showDays = recurrence === "weekly" || recurrence === "custom";

  function toggleDay(d: number) {
    setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d].sort()));
  }

  function resetNew() {
    setTitle("");
    setTypeId("");
    setPoints("5");
    setRecurrence("daily");
    setDays([]);
    setAssignee("");
    setRequiresApproval(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      const input: ActivityInput = {
        family_id: familyId,
        type_id: typeId || null,
        title: title.trim(),
        description: editing?.description ?? null,
        points: Number(points) || 0,
        recurrence,
        schedule: showDays ? { days } : null,
        start_date: editing?.start_date ?? null,
        assignee_member_id: assignee || null,
        requires_approval: requiresApproval,
        active: editing ? editing.active : true,
      };
      if (editing) {
        await updateActivity(editing.id, input);
        onChanged();
        onCancelEdit();
      } else {
        await insertActivity(input);
        resetNew();
        onChanged();
      }
    } finally {
      setBusy(false);
    }
  }

  const inputCls = "w-full min-w-0 rounded-xl border border-black/10 px-3 py-2";

  return (
    <Card title={editing ? "Sửa hoạt động" : "Thêm hoạt động"} icon={editing ? "✏️" : "📋"}>
      <form onSubmit={submit} className="space-y-3">
        <input
          className={inputCls}
          placeholder="Tên hoạt động (vd: Dọn bàn học)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <select className={inputCls} value={typeId} onChange={(e) => setTypeId(e.target.value)}>
            <option value="">— Nhóm —</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <input
            className={inputCls}
            placeholder="Điểm (+/-)"
            inputMode="numeric"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
          <select
            className={inputCls}
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value as Recurrence)}
          >
            <option value="daily">Hàng ngày</option>
            <option value="weekly">Hàng tuần</option>
            <option value="once">Một lần</option>
            <option value="custom">Tuỳ chọn</option>
          </select>
        </div>

        {showDays && (
          <div className="flex flex-wrap gap-1">
            {WEEKDAY_LABELS.map((label, d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                className={
                  "rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors " +
                  (days.includes(d) ? "bg-brand text-white" : "bg-black/5 text-ink/60")
                }
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <select
            className={inputCls}
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="">Giao cho tất cả</option>
            {kids.map((c) => (
              <option key={c.id} value={c.id}>
                {c.display_name}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-ink/80">
            <input
              type="checkbox"
              checked={requiresApproval}
              onChange={(e) => setRequiresApproval(e.target.checked)}
            />
            Cần bố/mẹ duyệt
          </label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={busy}>
            {editing ? "Lưu thay đổi" : "Thêm hoạt động"}
          </Button>
          {editing && (
            <Button type="button" variant="ghost" onClick={onCancelEdit}>
              Huỷ
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
