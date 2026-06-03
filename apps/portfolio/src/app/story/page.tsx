import type { Metadata } from "next";
import Link from "next/link";
import { getStory } from "@/lib/story";
import {
  getAchievements,
  getAcademic,
  getCharacter,
  getGallery,
} from "@/lib/content";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Đào Đình Hữu (Tin) — The Story",
  description:
    "Observe. Understand. Explain. — the story of a curious explorer and visual thinker growing at the intersection of science, art and language.",
};

const MEDAL: Record<string, string> = {
  gold: "#D4A017",
  silver: "#9CA3AF",
  bronze: "#B45309",
  none: "#9CA3AF",
};
const RANK: Record<string, number> = { gold: 0, silver: 1, bronze: 2, none: 3 };

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand">
      {children}
    </p>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[680px] space-y-5 text-lg leading-relaxed text-ink/75">
      {children}
    </div>
  );
}

export default function StoryPage() {
  const s = getStory();
  const achievements = getAchievements();
  const academic = getAcademic();
  const character = getCharacter();
  const gallery = getGallery();
  const art = gallery.filter((g) => g.src.includes("dino")).slice(0, 4);
  const cats: [string, string][] = [
    ["international", "International Olympiads"],
    ["national", "National Olympiads"],
    ["local", "School, City, Sports & Arts"],
  ];

  return (
    <main className="bg-cream text-ink">
      {/* version switch */}
      <div className="no-print mx-auto flex max-w-5xl items-center justify-between px-6 py-4 text-sm">
        <span className="font-display font-bold text-ink/70">Đào Đình Hữu (Tin)</span>
        <Link
          href="/"
          className="rounded-full border border-brand/20 px-3 py-1.5 font-semibold text-brand transition-colors hover:bg-brand/5"
        >
          Full profile →
        </Link>
      </div>

      {/* HERO */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(55,48,163,0.10), transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-10 text-center sm:pt-16">
          <div className="mb-7 h-28 w-28 overflow-hidden rounded-full shadow-md ring-4 ring-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/media/avatar.jpg")}
              alt="Đào Đình Hữu (Tin)"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] text-ink sm:text-6xl">
            {s.hero.name}
          </h1>
          <p className="mt-5 font-display text-2xl italic text-brand sm:text-3xl">
            {s.hero.lines.join(" ")}
          </p>
          <p className="mt-7 flex flex-wrap items-center justify-center gap-x-3 text-sm font-bold uppercase tracking-[0.25em] text-ink/50">
            {s.hero.motto.map((m, i) => (
              <span key={i} className="flex items-center gap-3">
                {i > 0 && <span className="text-accent">◆</span>}
                {m.replace(".", "")}
              </span>
            ))}
          </p>
        </div>
      </header>

      {/* EXECUTIVE SUMMARY */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-[720px]">
          <p className="text-center font-display text-2xl font-medium leading-snug text-ink sm:text-[28px]">
            {s.summary.lead}
          </p>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/75">
            {s.summary.paras.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {s.summary.threads.map((t, i) => (
              <div
                key={i}
                className="break-avoid rounded-2xl border border-brand/10 bg-white p-4 text-center shadow-sm"
              >
                <p className="font-display text-lg font-bold text-brand">
                  {t.label}
                </p>
                <p className="text-sm text-ink/55">{t.through}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE STORY */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <Eyebrow>{s.story.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            {s.story.title}
          </h2>
        </div>
        <Prose>
          <p>{s.story.paras[0]}</p>
          <p>{s.story.paras[1]}</p>
          <div className="flex flex-wrap justify-center gap-3 py-2">
            {s.story.questions.map((q, i) => (
              <span
                key={i}
                className="rounded-full bg-accent/15 px-4 py-1.5 font-display text-xl font-bold italic text-ink/80"
              >
                {q}
              </span>
            ))}
          </div>
          <p>{s.story.paras[2]}</p>
          <p>{s.story.paras[3]}</p>
        </Prose>
        {/* he drew to... */}
        <div className="mx-auto mt-10 grid max-w-[680px] gap-2 sm:grid-cols-3">
          {s.story.drawLines.map((l, i) => (
            <p
              key={i}
              className="break-avoid rounded-2xl bg-cream px-4 py-3 text-center font-display text-lg italic text-ink/80"
            >
              {l}
            </p>
          ))}
        </div>
      </section>

      {/* UNCOMMON COMBINATION */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{s.combination.eyebrow}</Eyebrow>
          <h2 className="font-display text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            <span className="text-brand">Science</span>{" "}
            <span className="text-accent">×</span>{" "}
            <span className="text-teal">Art</span>{" "}
            <span className="text-accent">×</span>{" "}
            <span className="text-ink">Language</span>
          </h2>
          <div className="mx-auto mt-5 max-w-[620px] space-y-1 text-lg text-ink/70">
            {s.combination.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          {s.combination.domains.map((d, i) => (
            <div
              key={i}
              className="break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm"
            >
              <p className="font-display text-2xl font-bold text-ink">{d.name}</p>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand">
                {d.role}
              </p>
              <p className="leading-relaxed text-ink/70">{d.body}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-[680px] text-center font-display text-xl font-medium italic text-ink/80">
          {s.combination.conclusion}
        </p>
      </section>

      {/* GROWTH JOURNEY */}
      <section className="bg-brand px-6 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            {s.growth.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            {s.growth.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-white/70">
            {s.growth.intro}
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
          {s.growth.stages.map((st, i) => (
            <div
              key={i}
              className="break-avoid rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-extrabold text-accent">
                  {String(i + 1)}
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
                    {st.grade}
                  </p>
                  <p className="font-display text-xl font-bold">{st.theme}</p>
                </div>
              </div>
              <p className="mt-3 leading-relaxed text-white/80">{st.body}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {st.strengths.map((x, j) => (
                  <span
                    key={j}
                    className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* pattern arc */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-display text-lg font-bold sm:text-xl">
            {s.growth.pattern.map((p, i) => (
              <span key={i} className="flex items-center gap-3">
                {i > 0 && <span className="text-accent">→</span>}
                {p}
              </span>
            ))}
          </div>
          <p className="mt-2 text-center text-sm text-white/55">
            {s.growth.patternAlt.join(" → ")}
          </p>
        </div>
      </section>

      {/* VISUAL THINKER */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{s.visual.eyebrow}</Eyebrow>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            <span className="text-brand">Observe</span> →{" "}
            <span className="text-teal">Understand</span> →{" "}
            <span className="text-accent">Explain</span>
          </h2>
        </div>
        <div className="mx-auto mt-8 max-w-[640px] space-y-2 text-center">
          {s.visual.chain.map((c, i) => (
            <p
              key={i}
              className="font-display text-lg italic text-ink/75"
              style={{ opacity: 0.6 + i * 0.08 }}
            >
              {c}
            </p>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-[680px] text-center text-lg leading-relaxed text-ink/70">
          {s.visual.note}
        </p>
        {art.length > 0 && (
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {art.map((a, i) => (
              <figure
                key={i}
                className="break-avoid overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(a.src)}
                  alt={a.caption.en}
                  className="aspect-square w-full object-cover"
                />
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* CORE CAPABILITIES */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Core capabilities</Eyebrow>
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            How he learns
          </h2>
        </div>
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {s.capabilities.map((c, i) => (
            <div key={i} className="break-avoid border-t border-brand/15 pt-4">
              <h3 className="font-display text-xl font-bold text-ink">{c.name}</h3>
              <p className="mt-1.5 leading-relaxed text-ink/70">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ACADEMIC CONSISTENCY */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{s.academic.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            {s.academic.title}
          </h2>
        </div>
        <div className="mx-auto max-w-3xl divide-y divide-black/5 rounded-3xl border border-black/5 bg-white px-6 shadow-sm">
          {s.academic.items.map((it, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <p className="w-44 shrink-0 font-display text-lg font-bold text-brand">
                {it.k}
              </p>
              <p className="text-ink/75">{it.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Achievements & recognition</Eyebrow>
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            Milestones along the way
          </h2>
        </div>
        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
          {cats.map(([cat, label]) => {
            const grp = achievements
              .filter((a) => a.category === cat)
              .sort((a, b) => RANK[a.medal] - RANK[b.medal]);
            if (grp.length === 0) return null;
            return (
              <div key={cat} className="break-avoid">
                <h3 className="mb-2 font-display text-lg font-bold text-ink">
                  {label}
                </h3>
                <ul className="space-y-1.5">
                  {grp.map((a, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-snug">
                      <span
                        aria-hidden
                        className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full"
                        style={{ background: MEDAL[a.medal] }}
                      />
                      <span className="text-ink/75">
                        {a.title.en}
                        {a.year ? (
                          <span className="text-ink/40"> · {a.year}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="mx-auto mt-8 max-w-[620px] text-center text-sm text-ink/50">
          Highest level (C) on all five Cambridge attributes — Confident,
          Responsible, Reflective, Innovative, Engaged ({character.level.en}).
        </p>
      </section>

      {/* LOOKING FORWARD */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <Eyebrow>{s.forward.eyebrow}</Eyebrow>
          <h2 className="mb-6 font-display text-3xl font-bold text-ink sm:text-4xl">
            {s.forward.title}
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-ink/75">
            {s.forward.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {s.forward.projects.map((p, i) => (
              <span
                key={i}
                className="rounded-full border border-brand/15 bg-brand/8 px-4 py-1.5 text-sm font-semibold text-brand"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="mt-8 font-display text-xl font-medium italic text-ink/80">
            {s.forward.close}
          </p>
        </div>
      </section>

      {/* MOTTO */}
      <section className="bg-brand px-6 py-20 text-center text-white sm:py-28">
        <div className="mx-auto max-w-2xl">
          {s.motto.lines.map((l, i) => (
            <p
              key={i}
              className="font-display text-3xl font-extrabold leading-tight sm:text-4xl"
            >
              {l}
            </p>
          ))}
          <div className="mx-auto mt-8 max-w-md space-y-1 text-white/70">
            {s.motto.because.map((b, i) => (
              <p key={i}>{b}</p>
            ))}
          </div>
          <div className="no-print mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={asset("/ho-so-nang-luc-en.pdf")}
              download
              className="rounded-2xl bg-white px-5 py-2.5 font-semibold text-brand shadow-sm transition hover:bg-white/90"
            >
              ⬇ Download PDF
            </a>
            <Link
              href="/"
              className="rounded-2xl border border-white/30 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
            >
              See the full profile →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
