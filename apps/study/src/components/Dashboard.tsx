"use client";

import { LineTrend } from "@/components/LineTrend";
import { RadarChart } from "@/components/RadarChart";
import type { RawPoint } from "@/lib/normalize";
import type { StudyData, Theme, FocusArea as FocusAreaT } from "@/lib/study-data";
import { signOut } from "@/lib/session";

/* ---------- building blocks (Editorial Warm, per apps/portfolio/DESIGN.md) ---------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-brand">{children}</p>;
}

function Section({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-6">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-1 max-w-2xl text-sm text-ink/55">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Pill({ children, tone = "ink" }: { children: React.ReactNode; tone?: "ink" | "brand" | "teal" | "accent" }) {
  const cls = {
    ink: "bg-black/5 text-ink/70",
    brand: "bg-brand/10 text-brand",
    teal: "bg-teal/10 text-teal",
    accent: "bg-accent/20 text-ink",
  }[tone];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{children}</span>;
}

/* ---------- dashboard ---------- */

export function Dashboard({ data }: { data: StudyData }) {
  const { academics, comments, assessment, roadmap } = data;
  const s = academics.student;
  const perfect = academics.current.subjects.filter((m) => m.score >= m.max).length;
  const totalSubjects = academics.current.subjects.length;

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
      {/* HEADER */}
      <header className="break-avoid rounded-[28px] border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">
              Đánh giá nội bộ · Lớp 1 → Lớp 4
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              {s.name} <span className="text-ink/40">({s.nickname})</span>
            </h1>
            <p className="mt-1 text-sm text-ink/55">
              {s.school} · Mã HS {s.id}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-ink">
              🔒 Chỉ bố/mẹ
            </span>
            <button
              onClick={() => void signOut()}
              className="text-xs font-semibold text-ink/45 underline-offset-2 hover:text-ink/70 hover:underline"
            >
              Đăng xuất
            </button>
          </div>
        </div>
        {/* KPI tiles */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { v: "4", l: "năm theo dõi (L1–L4)", tone: "text-brand" },
            { v: "10/10", l: "Khoa học cuối Lớp 4", tone: "text-teal" },
            { v: `${perfect}/${totalSubjects}`, l: "môn đạt điểm tối đa (Lớp 4)", tone: "text-brand" },
            { v: "Cao nhất", l: "phẩm chất Cambridge · 4 năm", tone: "text-accent" },
          ].map((k) => (
            <div key={k.l} className="rounded-2xl border border-black/5 bg-cream p-4 text-center">
              <p className={`font-display text-2xl font-extrabold ${k.tone}`}>{k.v}</p>
              <p className="mt-0.5 text-xs leading-snug text-ink/55">{k.l}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="mt-12 space-y-12">
        {/* 1. TRENDS */}
        <Section
          eyebrow="Xu hướng theo thời gian"
          title="Điểm các môn lõi qua 4 năm"
          subtitle="Đường đậm = cuối kỳ (MAY), đường mờ = giữa kỳ (DEC), chấm mờ = điểm từng unit trong năm. Mọi điểm quy về % của thang điểm năm đó để các lớp nối liền thành một mạch."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {academics.trends.map((t) => (
              <LineTrend key={t.key} name={t.name} points={t.points as RawPoint[]} />
            ))}
            <div className="break-avoid rounded-3xl border border-dashed border-black/10 bg-cream/50 p-4 text-sm leading-relaxed text-ink/55">
              <p className="font-semibold text-ink/70">Ghi chú thang điểm</p>
              <p className="mt-1">{academics.scaleNote}</p>
            </div>
          </div>
        </Section>

        {/* 2. CURRENT CAPABILITY */}
        <Section
          eyebrow="Năng lực hiện tại"
          title="Bản đồ năng lực · Lớp 4"
          subtitle="Tất cả các môn được tổng kết cuối Lớp 4, dùng điểm thực (có lẻ). Khoảng cách từ tâm tỉ lệ thật với điểm (10/10 ở vành ngoài, 5/10 ở vòng giữa)."
        >
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <RadarChart data={academics.current.subjects} />
              {academics.current.subjectsNote && (
                <p className="mt-2 text-center text-xs leading-snug text-ink/45">{academics.current.subjectsNote}</p>
              )}
            </div>
            <div className="space-y-4">
              <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand">Điểm cuối Lớp 4 theo môn</p>
                <ul className="divide-y divide-black/5">
                  {academics.current.subjects.map((m) => (
                    <li key={m.name} className="flex items-center justify-between gap-2 py-2">
                      <span className="flex items-center gap-2 text-sm text-ink/75">
                        {m.name}
                        <span className="rounded bg-black/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-ink/45">
                          {m.source === "Cambridge" ? "Cam" : "MOET"}
                        </span>
                      </span>
                      <span
                        className={
                          "flex h-7 min-w-7 items-center justify-center rounded-full px-2 font-display text-sm font-bold tabular-nums " +
                          (m.score >= m.max ? "bg-brand text-white" : "bg-accent/20 text-ink")
                        }
                      >
                        {m.score}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand">Tiếng Việt · theo mạch</p>
                <div className="flex flex-wrap gap-2">
                  {academics.current.vietnameseStrands.map((st) => (
                    <span key={st.name} className="flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-sm">
                      {st.name}
                      <span className={"font-bold " + (st.level === "V" ? "text-teal" : "text-brand")}>{st.level}</span>
                    </span>
                  ))}
                  <span className="self-center text-xs text-ink/45">V = Vượt kỳ vọng · Đ = Đạt kỳ vọng</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 3. ATTRIBUTES */}
        <Section eyebrow="Phẩm chất & thái độ" title="Ổn định qua các năm">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="font-display text-lg font-bold text-ink">Cambridge</p>
              <p className="mb-3 text-xs text-ink/50">{academics.attributes.cambridgeNote}</p>
              <div className="flex flex-wrap gap-1.5">
                {academics.attributes.cambridge.map((a) => (
                  <Pill key={a} tone="brand">
                    {a}
                  </Pill>
                ))}
              </div>
            </div>
            <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="font-display text-lg font-bold text-ink">Phẩm chất Vinser</p>
              <p className="mb-3 text-xs text-ink/50">{academics.attributes.vinserNote}</p>
              <div className="flex flex-wrap gap-1.5">
                {academics.attributes.vinser.map((a) => (
                  <Pill key={a} tone="teal">
                    {a}
                  </Pill>
                ))}
              </div>
            </div>
            <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="font-display text-lg font-bold text-ink">Kỹ năng – Phẩm chất (CLISE)</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{academics.attributes.clise}</p>
            </div>
          </div>
          {academics.awards.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink/60">
              <span className="font-semibold text-ink/70">Hoạt động nổi bật:</span>
              {academics.awards.map((a) => (
                <Pill key={a} tone="accent">
                  🏅 {a}
                </Pill>
              ))}
            </div>
          )}
        </Section>

        {/* 4. SYNTHESIS OF TEACHER COMMENTS */}
        <Section
          eyebrow="Tổng hợp nhận xét giáo viên · 4 năm"
          title="Điểm mạnh & điểm cần cải thiện"
          subtitle="Gom các nhận xét lặp lại thành chủ đề, kèm trích dẫn gốc và năm học."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-teal">
                ✦ Điểm mạnh
              </h3>
              <div className="space-y-3">
                {comments.strengths.map((t) => (
                  <ThemeCard key={t.title} item={t} accent="teal" />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-accent">
                ◆ Điểm cần cải thiện
              </h3>
              <div className="space-y-3">
                {comments.growth.map((t) => (
                  <ThemeCard key={t.title} item={t} accent="accent" />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 5. INTERNAL ASSESSMENT */}
        <Section eyebrow="Đánh giá nội bộ" title="Tổng quan & phong cách học">
          <div className="break-avoid rounded-3xl border-l-4 border-brand bg-white p-6 shadow-sm">
            <p className="text-lg leading-relaxed text-ink/80">{assessment.summary}</p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <AssessList title="Điểm mạnh nổi bật" items={assessment.strengths} tone="teal" />
            <AssessList title="Điểm cần lưu ý" items={assessment.watchAreas} tone="accent" />
          </div>
          <div className="mt-4 break-avoid rounded-3xl border border-black/5 bg-cream p-5">
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-brand">Phong cách học</p>
            <p className="leading-relaxed text-ink/75">{assessment.learningStyle}</p>
          </div>
        </Section>

        {/* 6. ROADMAP */}
        <Section eyebrow="Lộ trình cải thiện" title="Cùng con thực hiện" subtitle={roadmap.intro}>
          <div className="grid gap-4 md:grid-cols-2">
            {roadmap.focusAreas.map((f) => (
              <FocusArea key={f.title} item={f} />
            ))}
          </div>
        </Section>

        <footer className="border-t border-black/5 pt-6 text-center text-xs leading-relaxed text-ink/45">
          Tổng hợp từ học bạ & phiếu tiến bộ Vinschool (Lớp 1–4). Dữ liệu lưu riêng tư trong Supabase
          (truy cập sau đăng nhập, chỉ bố/mẹ). Phần đánh giá & lộ trình do AI tổng hợp, bố mẹ có thể chỉnh.
        </footer>
      </div>
    </main>
  );
}

/* ---------- local components ---------- */

function ThemeCard({ item, accent }: { item: Theme; accent: "teal" | "accent" }) {
  return (
    <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="flex items-center gap-2 font-display text-base font-bold text-ink">
        <span aria-hidden>{item.icon}</span>
        {item.title}
      </p>
      <ul className={"mt-2 space-y-2 border-l-2 pl-3 " + (accent === "teal" ? "border-teal/40" : "border-accent/50")}>
        {item.evidence.map((e, i) => (
          <li key={i} className="text-sm leading-snug text-ink/70">
            <span className="italic">“{e.quote}”</span>
            <span className="mt-0.5 block text-xs text-ink/45">
              — {e.who} · Lớp {e.grade}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AssessList({ title, items, tone }: { title: string; items: string[]; tone: "teal" | "accent" }) {
  const mark = tone === "teal" ? "text-teal" : "text-accent";
  return (
    <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="mb-2 font-display text-base font-bold text-ink">{title}</p>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm leading-snug text-ink/75">
            <span className={"mt-0.5 select-none " + mark}>{tone === "teal" ? "✦" : "◆"}</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FocusArea({ item }: { item: FocusAreaT }) {
  return (
    <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="flex items-center gap-2 font-display text-lg font-bold text-ink">
        <span aria-hidden>{item.icon}</span>
        {item.title}
      </p>
      <p className="mt-1 text-sm italic leading-snug text-ink/55">{item.why}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand">Việc con làm</p>
      <ul className="mt-1 space-y-1">
        {item.steps.map((st, i) => (
          <li key={i} className="flex gap-2 text-sm text-ink/75">
            <span className="mt-0.5 select-none text-brand/40">☐</span>
            <span>{st}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-teal">Bố mẹ hỗ trợ</p>
      <ul className="mt-1 space-y-1">
        {item.parentSupport.map((st, i) => (
          <li key={i} className="flex gap-2 text-sm text-ink/70">
            <span className="mt-0.5 select-none text-teal">›</span>
            <span>{st}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
