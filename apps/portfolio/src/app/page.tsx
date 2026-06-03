import Link from "next/link";
import { getStory, type Rating } from "@/lib/story";
import { getAchievements, getGallery } from "@/lib/content";
import { asset } from "@/lib/asset";

// This is the home page — metadata is inherited from the root layout so the site
// title / OG stay clean ("Đào Đình Hữu (Tin)").

const RANK: Record<string, number> = { gold: 0, silver: 1, bronze: 2, none: 3 };
const MEDAL_EMOJI: Record<string, string> = {
  gold: "🥇",
  silver: "🥈",
  bronze: "🥉",
  none: "🏅",
};

// Drop the redundant "Silver Medal — " / "1st Place — " prefix so each line reads
// short; the medal emoji already carries that information.
function shortName(title: string): string {
  return title
    .replace(/^(Gold|Silver|Bronze)\s+Medal\s+—\s+/, "")
    .replace(/^\d+(st|nd|rd|th)\s+Place(\s*\(Team\))?\s+—\s+/, "");
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand">
      {children}
    </p>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span
      className="shrink-0 text-lg leading-none tracking-tight"
      aria-label={`${n} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} aria-hidden className={i <= n ? "text-accent" : "text-ink/15"}>
          ★
        </span>
      ))}
    </span>
  );
}

function StarPanel({ items, bg = "bg-cream" }: { items: Rating[]; bg?: string }) {
  return (
    <div
      className={`mx-auto max-w-3xl rounded-3xl border border-black/5 ${bg} p-6 shadow-sm sm:p-8`}
    >
      <div className="grid gap-x-10 gap-y-1 sm:grid-cols-2">
        {items.map((c) => (
          <div
            key={c.name}
            className="flex items-center justify-between gap-4 border-b border-black/5 py-3 last:border-0 sm:[&:nth-last-of-type(2)]:border-0"
          >
            <span className="font-display text-base font-semibold text-ink sm:text-lg">
              {c.name}
            </span>
            <Stars n={c.stars} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StoryPage() {
  const s = getStory();
  const achievements = getAchievements();
  const gallery = getGallery();
  const art = gallery.filter((g) => g.src.includes("dino")).slice(0, 4);
  const cats: [string, string][] = [
    ["international", "International Olympiads"],
    ["national", "National Olympiads"],
    ["local", "School & City"],
  ];
  // One real-life photo per story beat (nature → reading → drawing → exploring).
  const beatImages: { src: string; alt: string }[] = [
    {
      src: "/media/life/life-wildflowers.jpg",
      alt: "Tin crouching to look closely at roadside wildflowers",
    },
    {
      src: "/media/life/life-reading-science.jpg",
      alt: "Tin reading a science book, ‘100 amazing mysteries of science’",
    },
    {
      src: "/media/dino-sketches.jpg",
      alt: "Tin’s dinosaur and biology sketches",
    },
    {
      src: "/media/life/life-harvest.jpg",
      alt: "Tin holding a sweet potato he dug up on a field trip",
    },
  ];

  return (
    <main className="bg-cream text-ink">
      {/* version switch */}
      <div className="no-print mx-auto flex max-w-5xl items-center justify-between px-6 py-4 text-sm">
        <span className="font-display font-bold text-ink/70">Đào Đình Hữu (Tin)</span>
        <Link
          href="/profile"
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
          <p className="mt-5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-display text-xl italic text-brand sm:text-2xl">
            {s.hero.roles.map((r, i) => (
              <span key={i} className="flex items-center gap-2.5">
                {i > 0 && <span className="not-italic text-accent">·</span>}
                {r}
              </span>
            ))}
          </p>
          <p className="mt-4 text-base text-ink/60 sm:text-lg">{s.hero.subtitle}</p>
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

      {/* WELCOME */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-[680px] text-center">
          <Eyebrow>{s.welcome.eyebrow}</Eyebrow>
          <p className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            {s.welcome.lead}
          </p>
          <div className="mt-5 space-y-1 text-lg text-ink/55">
            {s.welcome.lines.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
          <p className="mt-8 font-display text-2xl font-medium italic text-brand sm:text-[26px]">
            {s.welcome.turn}
          </p>
          <div className="mt-6 space-y-1 text-lg leading-relaxed text-ink/75">
            {s.welcome.paras.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        {/* childhood — where it all began */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              {
                src: "/media/life/life-dad-shoulders.jpg",
                alt: "Tin as a smiling toddler riding on his dad’s shoulders",
              },
              {
                src: "/media/life/life-flower-v2.jpg",
                alt: "Tin as a toddler holding and studying a frangipani flower",
              },
            ].map((p) => (
              <figure
                key={p.src}
                className="overflow-hidden rounded-3xl bg-white shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(p.src)}
                  alt={p.alt}
                  className="aspect-[4/5] w-full object-cover"
                />
              </figure>
            ))}
          </div>
          <figcaption className="mt-3 text-center text-sm text-ink/50">
            Where it all began — a curious, happy child.
          </figcaption>
        </div>
      </section>

      {/* THE STORY */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <Eyebrow>{s.story.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            {s.story.title}
          </h2>
          <div className="space-y-5 text-left text-lg leading-relaxed text-ink/75">
            {s.story.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            {s.story.questions.map((q, i) => (
              <span
                key={i}
                className="rounded-full bg-accent/15 px-4 py-1.5 font-display text-base font-bold italic text-ink/80 sm:text-lg"
              >
                {q}
              </span>
            ))}
          </div>
        </div>
        {/* four beats — editorial, real photos alternating left / right */}
        <div className="mx-auto mt-12 max-w-4xl space-y-12 sm:space-y-16">
          {s.story.beats.map((b, i) => {
            const img = beatImages[i];
            return (
              <div
                key={i}
                className="grid items-center gap-6 sm:gap-10 md:grid-cols-2"
              >
                <figure
                  className={`overflow-hidden rounded-3xl bg-white shadow-md ${
                    i % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(img.src)}
                    alt={img.alt}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </figure>
                <div>
                  <span className="font-display text-3xl font-extrabold text-accent">
                    {i + 1}
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed text-ink/70">
                    {b.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CORE LEARNING PHILOSOPHY */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{s.philosophy.eyebrow}</Eyebrow>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            <span className="text-brand">Observe</span> →{" "}
            <span className="text-teal">Understand</span> →{" "}
            <span className="text-accent">Explain</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[620px] text-lg text-ink/70">
            {s.philosophy.intro}
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {s.philosophy.steps.map((st, i) => {
            const tone = ["text-brand", "text-teal", "text-accent"][i];
            return (
              <div
                key={i}
                className="break-avoid rounded-3xl border border-black/5 bg-cream p-6 text-center shadow-sm"
              >
                <p className={`font-display text-2xl font-extrabold ${tone}`}>
                  {st.name}
                </p>
                <p className="mt-2 leading-relaxed text-ink/70">{st.through}</p>
              </div>
            );
          })}
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
        {/* Venn: where the three domains overlap */}
        <figure className="mx-auto mt-10 max-w-md">
          <svg
            viewBox="0 0 440 430"
            className="w-full"
            role="img"
            aria-label="Venn diagram — Science, Art and Language overlap in science illustration"
          >
            <g style={{ mixBlendMode: "multiply" }}>
              <circle
                cx="220"
                cy="160"
                r="122"
                fill="var(--color-brand)"
                fillOpacity="0.20"
                stroke="var(--color-brand)"
                strokeOpacity="0.55"
                strokeWidth="1.5"
              />
              <circle
                cx="150"
                cy="280"
                r="122"
                fill="var(--color-teal)"
                fillOpacity="0.20"
                stroke="var(--color-teal)"
                strokeOpacity="0.55"
                strokeWidth="1.5"
              />
              <circle
                cx="290"
                cy="280"
                r="122"
                fill="var(--color-ink)"
                fillOpacity="0.13"
                stroke="var(--color-ink)"
                strokeOpacity="0.5"
                strokeWidth="1.5"
              />
            </g>
            <g className="font-display" textAnchor="middle">
              <text x="220" y="92" fontSize="24" fontWeight="800" fill="var(--color-brand)">
                Science
              </text>
              <text x="220" y="112" fontSize="11.5" fill="var(--color-brand)" opacity="0.75">
                analyse · understand
              </text>

              <text x="86" y="316" fontSize="24" fontWeight="800" fill="var(--color-teal)">
                Art
              </text>
              <text x="86" y="336" fontSize="11.5" fill="var(--color-teal)" opacity="0.8">
                observe · visualise
              </text>

              <text x="356" y="316" fontSize="24" fontWeight="800" fill="var(--color-ink)">
                Language
              </text>
              <text x="356" y="336" fontSize="11.5" fill="var(--color-ink)" opacity="0.6">
                communicate · express
              </text>

              <text x="220" y="236" fontSize="15" fontWeight="800" fill="var(--color-ink)">
                Science
              </text>
              <text x="220" y="255" fontSize="15" fontWeight="800" fill="var(--color-ink)">
                Illustration
              </text>
            </g>
          </svg>
          <figcaption className="mt-4 text-center text-sm text-ink/55">
            Where the three overlap — science illustration &amp; science
            communication.
          </figcaption>
        </figure>
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

      {/* VISUAL THINKER */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{s.visual.eyebrow}</Eyebrow>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            {s.visual.title}
          </h2>
        </div>
        {/* cycle chain */}
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 font-display text-lg font-bold text-ink sm:text-xl">
          {s.visual.cycle.map((c, i) => (
            <span key={i} className="flex items-center gap-3">
              {i > 0 && <span className="text-accent">→</span>}
              {c}
            </span>
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
                className="break-avoid overflow-hidden rounded-2xl bg-cream shadow-sm"
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
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2">
          {s.visual.reflects.map((r, i) => (
            <span
              key={i}
              className="rounded-full border border-teal/20 bg-teal/8 px-4 py-1.5 text-sm font-semibold text-teal"
            >
              {r}
            </span>
          ))}
        </div>
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
          <p className="mx-auto mt-4 max-w-[620px] text-white/70">{s.growth.intro}</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
          {s.growth.stages.map((st, i) => (
            <div
              key={i}
              className="break-avoid rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-extrabold text-accent">
                  {i + 1}
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
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-2 font-display text-base font-bold sm:text-lg">
          {s.growth.pattern.map((p, i) => (
            <span key={i} className="flex items-center gap-3">
              {i > 0 && <span className="text-accent">→</span>}
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* VOICES FROM TEACHERS */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{s.teachers.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            {s.teachers.title}
          </h2>
        </div>
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
          {s.teachers.entries.map((e, i) => (
            <div
              key={i}
              className="break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                    {e.grade} · {e.label}
                  </p>
                  <p className="font-display text-lg font-bold text-ink">{e.name}</p>
                  <p className="text-sm text-ink/45">{e.role}</p>
                </div>
              </div>
              <ul className="space-y-2.5 border-l-2 border-accent/40 pl-4">
                {e.quotes.map((q, j) => (
                  <li key={j} className="text-ink/75 italic leading-snug">
                    “{q}”
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.themes.map((t, j) => (
                  <span
                    key={j}
                    className="rounded-full bg-brand/8 px-2.5 py-0.5 text-xs font-semibold text-brand"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-[680px] text-center font-display text-lg font-medium italic text-ink/75">
          {s.teachers.consistent}
        </p>
      </section>

      {/* CORE CAPABILITY MAP */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{s.capabilities.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            {s.capabilities.title}
          </h2>
        </div>
        <StarPanel items={s.capabilities.items} bg="bg-cream" />
      </section>

      {/* ACADEMIC EXCELLENCE */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{s.academic.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            {s.academic.title}
          </h2>
        </div>
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
          {/* Grade 4 results */}
          <div className="break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand">
              Grade 4 results
            </p>
            <ul className="divide-y divide-black/5">
              {s.academic.grade4.map((g) => (
                <li
                  key={g.subject}
                  className="flex items-center justify-between py-2.5"
                >
                  <span className="text-ink/75">{g.subject}</span>
                  <span
                    className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 font-display text-sm font-bold tabular-nums ${
                      g.score === "10"
                        ? "bg-brand text-white"
                        : "bg-accent/20 text-ink"
                    }`}
                  >
                    {g.score}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Strength profile */}
          <div className="break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand">
              Subject strength profile
            </p>
            <div className="divide-y divide-black/5">
              {s.academic.strengths.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between gap-4 py-2.5"
                >
                  <span className="text-ink/75">{c.name}</span>
                  <Stars n={c.stars} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* recognitions */}
        <div className="mx-auto mt-4 grid max-w-4xl gap-4 sm:grid-cols-3">
          <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 text-center shadow-sm">
            <p className="font-display text-3xl font-extrabold text-brand">4×</p>
            <p className="mt-1 font-display font-bold text-ink">Excellent Student</p>
            <p className="mt-1 text-sm text-ink/55">{s.academic.excellentNote}</p>
          </div>
          <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 text-center shadow-sm">
            <p className="font-display text-3xl font-extrabold text-accent">★</p>
            <p className="mt-1 font-display font-bold text-ink">
              Natural Sciences Star
            </p>
            <p className="mt-1 text-sm text-ink/55">
              {s.academic.naturalScience.join(" · ")}
            </p>
          </div>
          <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 text-center shadow-sm">
            <p className="font-display text-3xl font-extrabold text-teal">C</p>
            <p className="mt-1 font-display font-bold text-ink">Cambridge — top level</p>
            <p className="mt-1 text-sm text-ink/55">
              {s.academic.cambridge.join(" · ")}
            </p>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Achievements &amp; recognition</Eyebrow>
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            Milestones along the way
          </h2>
        </div>
        {/* medal tally */}
        <div className="mx-auto mb-6 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["🥇", "Gold", "gold"],
              ["🥈", "Silver", "silver"],
              ["🥉", "Bronze", "bronze"],
              ["🏅", "Honours", "all"],
            ] as [string, string, string][]
          ).map(([emoji, label, key]) => {
            const n =
              key === "all"
                ? achievements.length
                : achievements.filter((a) => a.medal === key).length;
            return (
              <div
                key={key}
                className="break-avoid rounded-3xl border border-black/5 bg-cream p-5 text-center shadow-sm"
              >
                <p className="text-2xl leading-none" aria-hidden>
                  {emoji}
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold tabular-nums text-ink">
                  {n}
                </p>
                <p className="text-sm font-semibold text-ink/55">{label}</p>
              </div>
            );
          })}
        </div>
        {/* grouped lists — roomy cards */}
        <div className="mx-auto grid max-w-4xl items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map(([cat, label]) => {
            const grp = achievements
              .filter((a) => a.category === cat)
              .sort((a, b) => RANK[a.medal] - RANK[b.medal]);
            if (grp.length === 0) return null;
            return (
              <div
                key={cat}
                className="break-avoid rounded-3xl border border-black/5 bg-cream p-6 shadow-sm"
              >
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-ink">
                    {label}
                  </h3>
                  <span className="text-sm font-semibold tabular-nums text-ink/35">
                    {grp.length}
                  </span>
                </div>
                <ul className="divide-y divide-black/5">
                  {grp.map((a, i) => (
                    <li key={i} className="flex items-baseline gap-3 py-3">
                      <span aria-hidden className="shrink-0 text-base leading-none">
                        {MEDAL_EMOJI[a.medal]}
                      </span>
                      <span className="leading-snug text-ink/80">
                        {shortName(a.title.en)}
                      </span>
                      {a.year ? (
                        <span className="ml-auto shrink-0 pl-2 text-sm tabular-nums text-ink/40">
                          {a.year}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* FUTURE DIRECTION */}
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

      {/* MOTTO / FINAL */}
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
          {/* final reflection chain */}
          <div className="mx-auto mt-10 flex max-w-xl flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-sm font-bold uppercase tracking-[0.18em] text-white/70">
            {s.motto.reflection.map((r, i) => (
              <span key={i} className="flex items-center gap-2.5">
                {i > 0 && <span className="text-accent">→</span>}
                {r}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl font-display text-lg italic leading-relaxed text-white/85">
            {s.motto.statement}
          </p>
          <div className="no-print mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={asset("/ho-so-nang-luc-en.pdf")}
              download
              className="rounded-2xl bg-white px-5 py-2.5 font-semibold text-brand shadow-sm transition hover:bg-white/90"
            >
              ⬇ Download PDF
            </a>
            <Link
              href="/profile"
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
