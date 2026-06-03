import { Button, Card } from "@kidcenter/ui";

type ScheduleItem = {
  time: string;
  title: string;
  icon: string;
  done?: boolean;
};

type Activity = {
  subject: string;
  title: string;
  icon: string;
  progress: number; // 0–100
};

const schedule: ScheduleItem[] = [
  { time: "07:00", title: "Thức dậy & vệ sinh", icon: "🌅", done: true },
  { time: "07:30", title: "Ăn sáng", icon: "🥣", done: true },
  { time: "08:30", title: "Học Toán tư duy", icon: "🧮" },
  { time: "10:00", title: "Giờ chơi ngoài trời", icon: "⚽" },
  { time: "14:00", title: "Đọc sách cùng mẹ", icon: "📖" },
  { time: "16:00", title: "Học tiếng Anh", icon: "🔤" },
  { time: "20:00", title: "Đi ngủ", icon: "🌙" },
];

const activities: Activity[] = [
  { subject: "Toán tư duy", title: "Đếm số 1–20", icon: "🧮", progress: 80 },
  { subject: "Tiếng Anh", title: "Animals & Colors", icon: "🦁", progress: 55 },
  { subject: "Khám phá", title: "Các loài cây", icon: "🌿", progress: 30 },
  { subject: "Nghệ thuật", title: "Vẽ gia đình em", icon: "🎨", progress: 100 },
];

export default function Home() {
  const doneCount = schedule.filter((s) => s.done).length;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand">KidCenter</p>
          <h1 className="font-display text-3xl font-extrabold text-ink">
            Chào buổi sáng, bé Na! 👋
          </h1>
          <p className="mt-1 text-ink/60">
            Hôm nay có {schedule.length} hoạt động · đã hoàn thành {doneCount}.
          </p>
        </div>
        <Button size="lg">+ Thêm hoạt động</Button>
      </header>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Lịch sinh hoạt */}
        <section className="md:col-span-3">
          <h2 className="mb-3 font-display text-xl font-bold text-ink">
            Lịch sinh hoạt hôm nay
          </h2>
          <Card className="p-0">
            <ul className="divide-y divide-black/5">
              {schedule.map((item) => (
                <li
                  key={item.time}
                  className="flex items-center gap-4 px-5 py-3"
                >
                  <span className="w-12 shrink-0 text-sm font-semibold text-ink/50">
                    {item.time}
                  </span>
                  <span className="text-2xl">{item.icon}</span>
                  <span
                    className={
                      item.done
                        ? "flex-1 text-ink/40 line-through"
                        : "flex-1 font-medium text-ink"
                    }
                  >
                    {item.title}
                  </span>
                  {item.done && <span className="text-brand">✓</span>}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Hoạt động học tập */}
        <section className="md:col-span-2">
          <h2 className="mb-3 font-display text-xl font-bold text-ink">
            Hoạt động học tập
          </h2>
          <div className="grid gap-3">
            {activities.map((a) => (
              <Card key={a.title} icon={a.icon} title={a.title}>
                <p className="mb-2 text-sm text-ink/50">{a.subject}</p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${a.progress}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-xs font-semibold text-ink/50">
                  {a.progress}%
                </p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
