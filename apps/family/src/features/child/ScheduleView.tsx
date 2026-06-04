"use client";

import { useState } from "react";
import { Card } from "@kidcenter/ui";
import { Spinner } from "@/components/Spinner";
import { useAsync } from "@/lib/useAsync";
import { toActivityLite } from "@/lib/adapters";
import { dueOn } from "@/domain/recurrence";
import { listActiveActivities } from "@/data/activities";
import { listInstancesInRange } from "@/data/tasks";
import type { Activity, Member } from "@/data/db-types";
import type { TaskStatus } from "@/domain/types";
import {
  todayISO,
  addDaysISO,
  startOfWeekISO,
  startOfMonthISO,
  addMonthsISO,
  daysInMonthOf,
  weekdayISO,
  dayNum,
  dayLabel,
  monthLabel,
  WEEK_COLS,
} from "@/lib/date";

type DayStatus = TaskStatus | "future";

const STATUS: Record<DayStatus, { icon: string; label: string; cls: string }> = {
  approved: { icon: "✅", label: "Xong", cls: "text-brand" },
  submitted: { icon: "⏳", label: "Chờ duyệt", cls: "text-ink/60" },
  rejected: { icon: "❌", label: "Bị từ chối", cls: "text-red-600" },
  pending: { icon: "⭕", label: "Chưa làm", cls: "text-ink/50" },
  missed: { icon: "➖", label: "Bỏ lỡ", cls: "text-ink/40" },
  future: { icon: "·", label: "Sắp tới", cls: "text-ink/40" },
};

interface DueItem {
  activity: Activity;
  status: DayStatus;
}

export function ScheduleView({ child }: { child: Member }) {
  const today = todayISO();
  const [mode, setMode] = useState<"week" | "month">("week");
  const [anchor, setAnchor] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today);

  const { data, loading } = useAsync(async () => {
    const acts = await listActiveActivities(child.family_id);
    const mine = acts.filter(
      (a) => a.assignee_member_id === null || a.assignee_member_id === child.id,
    );
    const start = mode === "week" ? startOfWeekISO(anchor) : startOfMonthISO(anchor);
    const end =
      mode === "week"
        ? addDaysISO(start, 6)
        : addDaysISO(start, daysInMonthOf(anchor) - 1);
    const instances = await listInstancesInRange(child.id, start, end);
    const map = new Map(instances.map((i) => [`${i.activity_id}|${i.due_date}`, i.status]));
    return { mine, map, start, end };
  }, [child.id, mode, anchor]);

  function dueOnDay(date: string): DueItem[] {
    if (!data) return [];
    return data.mine
      .filter((a) => dueOn(toActivityLite(a), date))
      .map((a) => {
        const st = data.map.get(`${a.id}|${date}`);
        const status: DayStatus = st ?? (date < today ? "missed" : "future");
        return { activity: a, status };
      });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">Lịch</h2>
        <div className="flex rounded-2xl bg-black/5 p-0.5 text-sm font-semibold">
          {(["week", "month"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={
                "rounded-2xl px-3 py-1 transition-colors " +
                (mode === m ? "bg-brand text-white" : "text-ink/60")
              }
            >
              {m === "week" ? "Tuần" : "Tháng"}
            </button>
          ))}
        </div>
      </div>

      {loading || !data ? (
        <Spinner />
      ) : mode === "week" ? (
        <WeekView
          start={data.start}
          today={today}
          dueOnDay={dueOnDay}
          onPrev={() => setAnchor(addDaysISO(anchor, -7))}
          onNext={() => setAnchor(addDaysISO(anchor, 7))}
        />
      ) : (
        <MonthView
          anchor={anchor}
          today={today}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          dueOnDay={dueOnDay}
          onPrev={() => setAnchor(addMonthsISO(anchor, -1))}
          onNext={() => setAnchor(addMonthsISO(anchor, 1))}
        />
      )}
    </div>
  );
}

function Pager({
  label,
  onPrev,
  onNext,
}: {
  label: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <button onClick={onPrev} className="rounded-xl px-3 py-1 text-lg text-brand hover:bg-brand/10">
        ◀
      </button>
      <span className="font-semibold text-ink">{label}</span>
      <button onClick={onNext} className="rounded-xl px-3 py-1 text-lg text-brand hover:bg-brand/10">
        ▶
      </button>
    </div>
  );
}

function DueRow({ item }: { item: DueItem }) {
  const s = STATUS[item.status];
  const pts = item.activity.points;
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="min-w-0 truncate text-ink">
        {s.icon} {item.activity.title}
      </span>
      <span className={"shrink-0 text-xs " + s.cls}>
        {s.label} · {pts >= 0 ? "+" : ""}
        {pts}
      </span>
    </div>
  );
}

function WeekView({
  start,
  today,
  dueOnDay,
  onPrev,
  onNext,
}: {
  start: string;
  today: string;
  dueOnDay: (date: string) => DueItem[];
  onPrev: () => void;
  onNext: () => void;
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDaysISO(start, i));
  const end = days[6];
  return (
    <div className="space-y-3">
      <Pager
        label={`${dayNum(start)}/${Number(start.slice(5, 7))} – ${dayNum(end)}/${Number(end.slice(5, 7))}`}
        onPrev={onPrev}
        onNext={onNext}
      />
      {days.map((d) => {
        const items = dueOnDay(d);
        const isToday = d === today;
        return (
          <Card key={d} className={isToday ? "ring-2 ring-brand" : ""}>
            <p className="mb-2 text-sm font-semibold text-ink">
              {dayLabel(d)}
              {isToday && <span className="ml-2 text-xs text-brand">• Hôm nay</span>}
            </p>
            {items.length === 0 ? (
              <p className="text-sm text-ink/50">Không có việc — nghỉ ngơi 🎉</p>
            ) : (
              <div className="space-y-1">
                {items.map((it) => (
                  <DueRow key={it.activity.id} item={it} />
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function MonthView({
  anchor,
  today,
  selectedDay,
  setSelectedDay,
  dueOnDay,
  onPrev,
  onNext,
}: {
  anchor: string;
  today: string;
  selectedDay: string;
  setSelectedDay: (d: string) => void;
  dueOnDay: (date: string) => DueItem[];
  onPrev: () => void;
  onNext: () => void;
}) {
  const monthStart = startOfMonthISO(anchor);
  const n = daysInMonthOf(anchor);
  const lead = (weekdayISO(monthStart) + 6) % 7; // Monday-first leading blanks
  const cells: (string | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: n }, (_, i) => addDaysISO(monthStart, i)),
  ];

  const inMonth = selectedDay >= monthStart && selectedDay < addMonthsISO(anchor, 1);
  const detailDay = inMonth ? selectedDay : monthStart;
  const detailItems = dueOnDay(detailDay);

  return (
    <div className="space-y-3">
      <Pager label={monthLabel(anchor)} onPrev={onPrev} onNext={onNext} />

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEK_COLS.map((w) => (
          <div key={w} className="py-1 text-xs font-semibold text-ink/40">
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`b${i}`} />;
          const items = dueOnDay(d);
          const total = items.length;
          const done = items.filter((x) => x.status === "approved").length;
          const isToday = d === today;
          const isSel = d === detailDay;
          let tint = "bg-white";
          if (total > 0) {
            if (done === total) tint = "bg-brand/15";
            else if (done > 0) tint = "bg-accent/20";
            else if (d < today) tint = "bg-red-500/5";
          }
          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={
                "aspect-square rounded-xl border p-1 text-xs transition-colors " +
                tint +
                (isSel ? " border-brand" : " border-black/5") +
                (isToday ? " font-bold text-brand" : " text-ink")
              }
            >
              <div>{dayNum(d)}</div>
              {total > 0 && (
                <div className="mt-0.5 text-[10px] text-ink/50">
                  {done}/{total}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Card>
        <p className="mb-2 text-sm font-semibold text-ink">{dayLabel(detailDay)}</p>
        {detailItems.length === 0 ? (
          <p className="text-sm text-ink/50">Không có việc — nghỉ ngơi 🎉</p>
        ) : (
          <div className="space-y-1">
            {detailItems.map((it) => (
              <DueRow key={it.activity.id} item={it} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
