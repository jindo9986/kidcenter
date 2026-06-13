import type { Metadata } from "next";
import Link from "next/link";
import { getStory } from "@/lib/story";
import { getAchievements, getGallery } from "@/lib/content";
import type { L } from "@/lib/schemas";
import { asset } from "@/lib/asset";
import { PrintLink } from "@/components/PrintLink";

export const metadata: Metadata = {
  title: "Independent AI Assessment — Đào Đình Hữu (Tin)",
  description:
    "An independent, evidence-based AI assessment of Đào Đình Hữu (Tin): the pattern connecting curiosity, inquiry, observation and visual thinking — backed by four years of teacher reports, academic results and his portfolio.",
};

// This page is an English assessment document; render the English side of any
// bilingual (L) value pulled from the shared portfolio data.
const en = (v: L) => v.en;

/* faint indigo graph-paper texture (DESIGN.md hero treatment) */
const graphPaper =
  "linear-gradient(0deg, rgba(255,253,247,.6), rgba(255,253,247,.6))," +
  "repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(55,48,163,.06) 24px)," +
  "repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(55,48,163,.06) 24px)";

/* ---------- building blocks (Editorial Warm, mirrors the story page) ---------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand">{children}</p>
  );
}

function SectionHead({
  n,
  eyebrow,
  title,
  children,
}: {
  n?: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow>
        {n && <span className="text-accent">{n} · </span>}
        {eyebrow}
      </Eyebrow>
      <h2 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{title}</h2>
      {children && (
        <div className="mx-auto mt-5 max-w-[640px] space-y-4 text-lg leading-relaxed text-ink/75">
          {children}
        </div>
      )}
    </div>
  );
}

function FlowChain({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <div
      className={
        "mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-2 font-display text-base font-bold sm:text-lg " +
        (dark ? "text-white" : "text-ink")
      }
    >
      {items.map((it, i) => (
        <span key={it} className="flex items-center gap-3">
          {i > 0 && <span className="text-accent">→</span>}
          <span className={i === items.length - 1 ? "text-accent" : undefined}>{it}</span>
        </span>
      ))}
    </div>
  );
}

function Chips({ items, italic = false }: { items: string[]; italic?: boolean }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2.5">
      {items.map((q) => (
        <span
          key={q}
          className={
            "rounded-full bg-accent/15 px-4 py-1.5 font-display text-base font-bold text-ink/80 " +
            (italic ? "italic" : "")
          }
        >
          {q}
        </span>
      ))}
    </div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="mx-auto my-2 max-w-[640px] break-avoid border-l-4 border-accent pl-5 text-left">
      <p className="font-display text-xl italic leading-snug text-ink">{children}</p>
    </blockquote>
  );
}

function InsetList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mx-auto max-w-2xl break-avoid rounded-3xl bg-brand/[0.04] p-6 text-left">
      <p className="mb-2 text-sm font-semibold text-ink/55">{title}</p>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {items.map((it) => (
          <li key={it} className="flex gap-2 text-ink/80">
            <span className="mt-1 select-none text-accent">◆</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="shrink-0 text-lg leading-none" aria-label={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} aria-hidden className={i <= n ? "text-accent" : "text-ink/15"}>
          ★
        </span>
      ))}
    </span>
  );
}

function PhotoMasonry({ photos }: { photos: { src: string; alt: string; caption?: string }[] }) {
  return (
    <div className="mx-auto mt-10 max-w-5xl gap-3 [column-fill:_balance] columns-2 sm:columns-3">
      {photos.map((p) => (
        <figure
          key={p.src}
          className="mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(p.src)} alt={p.alt} loading="lazy" className="w-full" />
          {p.caption && (
            <figcaption className="px-3 py-2 text-xs leading-snug text-ink/55">{p.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

/* ---------- content ---------- */

const ARC = ["Curiosity", "Inquiry", "Observation", "Investigation", "Understanding"];

const COGNITIVE = [
  "Scientific Inquiry",
  "Visual Thinking",
  "Observation",
  "Independent Learning",
  "Analytical Reasoning",
];

const INQUIRY_QS = [
  "Why does this happen?",
  "How does it work?",
  "What caused it?",
  "What would happen if something changed?",
  "How are different things connected?",
];

const IMAGES_HELP = [
  "Examine structures",
  "Recognise patterns",
  "Understand relationships",
  "Build mental models",
  "Organise complex information",
];

const REASONING = [
  "Problem solving",
  "Reasoning skills",
  "Prediction making",
  "Investigation planning",
  "Scientific thinking",
];

const ENVIRONMENTS = [
  "Scientific investigation",
  "Research-oriented learning",
  "Independent exploration",
  "Observation-based study",
  "Analytical thinking",
  "Visual documentation",
];

const OBSERVED = [
  { icon: "🔍", title: "Curiosity", text: "A willingness to explore and investigate." },
  {
    icon: "🧪",
    title: "Scientific Thinking",
    text: "An ability to approach questions logically and systematically.",
  },
  {
    icon: "🧭",
    title: "Independence",
    text: "Confidence in pursuing learning without constant guidance.",
  },
  { icon: "🧩", title: "Reasoning", text: "The ability to analyse, connect ideas, and solve problems." },
];

const curiosityPhotos = [
  { src: "/media/life/life-wonder-reptile.jpg", alt: "Pointing at a reptile in a vivarium", caption: "Whoa — what is that?!" },
  { src: "/media/life/life-snake-touch.jpg", alt: "Touching a snake at the zoo", caption: "First time touching a snake" },
  { src: "/media/life/life-whale-skeleton.jpg", alt: "In front of a sperm-whale skeleton", caption: "Eye to eye with a sperm whale" },
  { src: "/media/life/life-marlin.jpg", alt: "Under a mounted blue marlin", caption: "A blue marlin, longer than he is tall" },
  { src: "/media/life/life-elephants.jpg", alt: "Pointing at elephants at the zoo", caption: "Watching the elephants up close" },
  { src: "/media/life/life-wildflowers.jpg", alt: "Observing roadside wildflowers", caption: "Noticing the small things" },
];

const observationPhotos = [
  { src: "/media/life/life-microscope.jpg", alt: "Looking through a microscope", caption: "Under the microscope — the grain of wood" },
  { src: "/media/life/life-evolution-skulls.jpg", alt: "Studying a wall of hominid skulls", caption: "Tracing human origins, skull by skull" },
  { src: "/media/life/life-museum-art.jpg", alt: "Looking at ink cityscape paintings", caption: "Reading a city drawn in ink" },
];

/* ---------- page ---------- */

export default function AssessmentPage() {
  const s = getStory();
  const achievements = getAchievements();
  const dinoArt = getGallery()
    .filter((g) => g.src.includes("dino"))
    .slice(0, 4);

  const medal = (k: string) => achievements.filter((a) => a.medal === k).length;
  const tally = [
    ["🥇", "Gold", medal("gold")],
    ["🥈", "Silver", medal("silver")],
    ["🥉", "Bronze", medal("bronze")],
    ["🏅", "Honours", achievements.length],
  ] as const;

  return (
    <main className="bg-cream text-ink">
      {/* top bar */}
      <div className="no-print mx-auto flex max-w-5xl items-center justify-between gap-2 px-6 py-4 text-sm">
        <span className="font-display font-bold text-ink/70">Independent AI Assessment</span>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-full border border-brand/20 px-3 py-1.5 font-semibold text-brand transition-colors hover:bg-brand/5"
          >
            ← Story
          </Link>
          <PrintLink label="PDF" />
        </div>
      </div>

      {/* HERO */}
      <header className="relative overflow-hidden border-b border-brand/10" style={{ background: graphPaper }}>
        <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-10 text-center sm:pt-14">
          <Eyebrow>Independent · AI Assessment</Eyebrow>
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] text-ink sm:text-5xl">
            The Story Behind the Learning Journey
          </h1>
          <p className="mt-4 font-display text-xl italic text-brand sm:text-2xl">
            Scientific Inquiry <span className="not-italic text-accent">×</span> Visual Thinking
          </p>
          <p className="mt-5 text-sm text-ink/60">
            <span className="font-semibold text-ink/80">Đào Đình Hữu (Tin)</span> · synthesised from
            four years of teacher reports, academic results &amp; portfolio
          </p>
        </div>
      </header>

      {/* THE PATTERN — thesis */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead eyebrow="The question that kept recurring" title="What is the underlying pattern?">
          <p>
            Every child learns. Many achieve good grades; some collect medals, certificates and
            awards. But behind every achievement lies a deeper story — about how a child thinks,
            how a child learns, and what keeps them exploring even when nobody is watching.
          </p>
          <p>
            After reviewing Tin&apos;s academic records, teacher evaluations, learning behaviours,
            achievements and personal portfolio, one question emerged again and again:
          </p>
        </SectionHead>
        <div className="mt-6">
          <PullQuote>What is the underlying pattern connecting everything?</PullQuote>
        </div>
        <p className="mx-auto mt-6 max-w-[640px] text-center text-lg leading-relaxed text-ink/75">
          The answer was surprisingly consistent. The story is not primarily about achievement,
          competition, or collecting awards. It is a story about{" "}
          <strong className="font-semibold text-ink">curiosity becoming inquiry</strong>, inquiry
          becoming investigation, and investigation becoming understanding.
        </p>
        <div className="mt-9">
          <FlowChain items={ARC} />
        </div>
      </section>

      {/* 01 — CURIOSITY */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead n="01" eyebrow="Before achievement" title="There was curiosity">
          <p>
            Before Olympiads, before competitions, before academic recognition — there was
            curiosity. Tin has always been drawn to questions: about animals, nature, dinosaurs,
            science, technology, history.
          </p>
          <p>
            Many children ask questions. What appears different is what happens next. For Tin, a
            question rarely disappears after being answered once — answers become starting points
            for further exploration. One question leads to another; one discovery opens the door to
            many more.
          </p>
        </SectionHead>
        <div className="mt-7">
          <Chips
            italic
            items={["Animals", "Nature", "Dinosaurs", "Science", "Technology", "History"]}
          />
        </div>
        <PhotoMasonry photos={curiosityPhotos} />
      </section>

      {/* 02 — INQUIRY */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead n="02" eyebrow="Learning as investigation" title="From facts to deeper questions">
          <p>
            As curiosity grew, learning gradually became a form of investigation. Across different
            subjects and interests, a common pattern can be observed: instead of stopping at facts,
            Tin moves toward deeper questions. Knowledge is not something to memorise — it becomes
            something to examine, to test, to understand.
          </p>
        </SectionHead>
        <div className="mt-8">
          <Chips items={INQUIRY_QS} italic />
        </div>
        <p className="mx-auto mt-8 max-w-[640px] text-center text-lg leading-relaxed text-ink/75">
          This tendency — to ask <em>why</em> and <em>how</em> rather than merely <em>what</em> — is
          one of the strongest indicators of an inquiry-driven learner.
        </p>
      </section>

      {/* 03 — OBSERVATION */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead n="03" eyebrow="Observation became the starting point" title="Noticing comes first">
          <p>
            Every investigation begins somewhere. For Tin, it often begins with observation — of
            nature, animals, books, everyday experiences. Observation lets details emerge, patterns
            become visible, and questions begin to form.
          </p>
          <p>
            Before explanation comes investigation; before investigation comes observation. Across
            multiple teacher reports, careful observation appears again and again as a core part of
            how he approaches learning.
          </p>
        </SectionHead>
        <PhotoMasonry photos={observationPhotos} />
      </section>

      {/* 04 — VISUAL THINKING & DRAWING */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          n="04"
          eyebrow="Visual thinking & drawing"
          title="Drawing as a tool for investigation"
        >
          <p>
            Not everyone learns the same way. Some think through words, others through numbers. Tin
            often appears to think through images — visualisation is part of the learning process
            itself, not merely a way to present it.
          </p>
          <p>
            For many children, drawing is a creative activity. For Tin it serves a different
            purpose: it slows down observation, encourages closer examination, and surfaces details
            that might otherwise be missed.
          </p>
        </SectionHead>

        <div className="mt-8">
          <FlowChain items={s.visual.cycle.map(en)} />
        </div>

        {dinoArt.length > 0 && (
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {dinoArt.map((a) => (
              <figure key={a.src} className="break-avoid overflow-hidden rounded-2xl bg-cream shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(a.src)} alt={en(a.caption)} loading="lazy" className="aspect-square w-full object-cover" />
              </figure>
            ))}
          </div>
        )}
        <p className="mx-auto mt-6 max-w-[640px] text-center font-display text-lg italic text-ink/75">
          Observation leads to drawing; drawing leads to deeper observation; deeper observation
          leads to greater understanding.
        </p>
        <div className="mt-8">
          <InsetList title="Images help him" items={IMAGES_HELP} />
        </div>
        <p className="mx-auto mt-6 max-w-[640px] text-center text-ink/70">
          His drawings function less as artwork and more as <strong className="font-semibold text-ink">visual
          documentation</strong> — a way to record observations and organise understanding, mirroring
          how naturalists and scientists have always used sketches and notebooks to generate
          knowledge.
        </p>
      </section>

      {/* 05 — INVESTIGATION → UNDERSTANDING */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead
          n="05"
          eyebrow="Independence & analytical reasoning"
          title="Investigation becomes understanding"
        >
          <p>
            Curiosity creates questions; independence allows them to be pursued. Across four years,
            teachers repeatedly noted that Tin accepts challenges willingly, works independently,
            stays focused, and shows initiative. Inquiry then naturally leads to analysis —
            understanding becomes structured rather than accidental.
          </p>
        </SectionHead>
        <div className="mt-8">
          <InsetList title="Recurring in teacher evaluations" items={REASONING} />
        </div>

        {/* evidence: Grade-4 academic results */}
        <div className="mx-auto mt-10 max-w-2xl break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-brand">
            Evidence · Grade 4 results
          </p>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {s.academic.grade4.map((g) => (
              <li key={en(g.subject)} className="flex items-center justify-between border-b border-black/5 py-2.5 last:border-0">
                <span className="text-ink/75">{en(g.subject)}</span>
                <span
                  className={
                    "flex h-8 min-w-8 items-center justify-center rounded-full px-2 font-display text-sm font-bold tabular-nums " +
                    (g.score === "10" ? "bg-brand text-white" : "bg-accent/20 text-ink")
                  }
                >
                  {g.score}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHAT TEACHERS CONSISTENTLY OBSERVED — real quotes */}
      <section className="bg-brand px-6 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            The strongest evidence is consistency
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            What teachers consistently observed
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-white/70">
            Different teachers, different subjects, different years — yet remarkably similar
            observations keep appearing across four years of Cambridge reports.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
          {s.teachers.entries.map((e) => (
            <div
              key={e.name}
              className="break-avoid rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                {en(e.grade)} · {en(e.label)}
              </p>
              <p className="font-display text-lg font-bold">{e.name}</p>
              <ul className="mt-3 space-y-2 border-l-2 border-accent/50 pl-4">
                {e.quotes.map((q, j) => (
                  <li key={j} className="text-sm italic leading-snug text-white/85">
                    “{en(q)}”
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.themes.map((t, j) => (
                  <span key={j} className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold">
                    {en(t)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* the four distilled themes */}
        <div className="mx-auto mt-6 grid max-w-5xl gap-3 sm:grid-cols-4">
          {OBSERVED.map((o) => (
            <div key={o.title} className="break-avoid rounded-3xl border border-white/15 bg-white/10 p-5 text-center">
              <div className="text-2xl" aria-hidden>
                {o.icon}
              </div>
              <p className="mt-1 font-display text-lg font-bold">{o.title}</p>
              <p className="mt-0.5 text-sm leading-snug text-white/75">{o.text}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-[680px] text-center font-display text-lg italic text-white/85">
          The repetition of these themes across four years suggests stable cognitive strengths,
          not isolated achievements.
        </p>
      </section>

      {/* CORE COGNITIVE PROFILE */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <SectionHead eyebrow="Core cognitive profile" title="A connected system of strengths" />
        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-black/5 bg-cream p-6 shadow-sm sm:p-8">
          {COGNITIVE.map((label) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 border-b border-black/5 py-3 last:border-0"
            >
              <span className="font-display text-base font-semibold text-ink sm:text-lg">{label}</span>
              <Stars n={5} />
            </div>
          ))}
        </div>
        <p className="mx-auto mt-5 max-w-[640px] text-center text-ink/70">
          These are not separate abilities but a connected system — together they shape how Tin
          learns, explores, and understands the world. They also mirror his portfolio capability
          map, where Scientific Thinking, Visual Thinking, Logical Reasoning and Independent
          Learning each rate at the top of the scale.
        </p>
      </section>

      {/* THE RECORD — achievements as corroboration */}
      <section className="px-6 py-16 sm:py-20">
        <SectionHead
          eyebrow="The record"
          title="Achievements corroborate the pattern"
        >
          <p>
            Awards are important — but in this story they are corroboration, not the starting
            point. The same curiosity and reasoning that drive everyday exploration also show up,
            measurably, in the record.
          </p>
        </SectionHead>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {tally.map(([emoji, label, n]) => (
            <div key={label} className="break-avoid rounded-3xl border border-black/5 bg-white p-5 text-center shadow-sm">
              <p className="text-2xl leading-none" aria-hidden>
                {emoji}
              </p>
              <p className="mt-2 font-display text-3xl font-extrabold tabular-nums text-ink">{n}</p>
              <p className="text-sm font-semibold text-ink/55">{label}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-4 grid max-w-4xl gap-3 sm:grid-cols-3">
          <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 text-center shadow-sm">
            <p className="font-display text-3xl font-extrabold text-brand">4×</p>
            <p className="mt-1 font-display font-bold text-ink">Excellent Student</p>
            <p className="mt-1 text-sm text-ink/55">{en(s.academic.excellentNote)}</p>
          </div>
          <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 text-center shadow-sm">
            <p className="font-display text-3xl font-extrabold text-accent">★</p>
            <p className="mt-1 font-display font-bold text-ink">Natural Sciences Star</p>
            <p className="mt-1 text-sm text-ink/55">{s.academic.naturalScience.join(" · ")}</p>
          </div>
          <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 text-center shadow-sm">
            <p className="font-display text-3xl font-extrabold text-teal">C</p>
            <p className="mt-1 font-display font-bold text-ink">Cambridge — top level</p>
            <p className="mt-1 text-sm text-ink/55">{s.academic.cambridge.map(en).join(" · ")}</p>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-[640px] text-center text-sm text-ink/55">
          {achievements.length} honours across school, national and international Olympiads — the
          downstream result of an upstream habit: curiosity, pursued.
        </p>
      </section>

      {/* LOOKING FORWARD */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead eyebrow="Looking forward" title="Where this profile thrives">
          <p>
            Interests evolve and new passions emerge, but certain patterns remain stable: a
            persistent desire to understand, a tendency to investigate rather than accept answers,
            and a habit of observing carefully before concluding. These suggest strong potential in
            environments that encourage:
          </p>
        </SectionHead>
        <div className="mt-8">
          <Chips items={ENVIRONMENTS} />
        </div>
      </section>

      {/* FINAL REFLECTION + ASSESSMENT */}
      <section className="bg-brand px-6 py-20 text-center text-white sm:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            Final reflection
          </p>
          <div className="mb-8">
            <FlowChain items={ARC} dark />
          </div>
          <p className="mx-auto max-w-xl text-white/80">
            The story is not primarily about awards, grades, or recognition. Those achievements
            matter — but they are not the beginning. It begins with curiosity, which became inquiry,
            which led to investigation, which continues to deepen understanding.
          </p>

          <div className="mx-auto mt-10 max-w-xl rounded-3xl border-l-4 border-accent bg-white/10 p-6 text-left backdrop-blur-sm sm:p-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Final assessment
            </p>
            <div className="space-y-4 font-display text-lg leading-snug">
              <p>
                Tin demonstrates the profile of a young learner whose development is driven by
                curiosity, guided by inquiry, and strengthened through observation.
              </p>
              <p>
                His visual thinking is not merely a creative skill, but an essential tool for
                investigation and understanding.
              </p>
              <p>
                Through Scientific Inquiry and Visual Thinking, he continues to explore the world
                with a desire not simply to know more, but to understand more deeply how things
                work.
              </p>
            </div>
          </div>

          <div className="no-print mt-10 flex flex-wrap items-center justify-center gap-3">
            <PrintLink label="Print / Save as PDF" />
            <Link
              href="/"
              className="rounded-2xl border border-white/30 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
            >
              ← Back to the story
            </Link>
          </div>
          <p className="mx-auto mt-8 max-w-md text-xs leading-relaxed text-white/55">
            An independent assessment generated by AI as a synthesis of existing records, teacher
            evaluations and portfolio materials — intended to describe observed learning patterns,
            not as a formal psychometric evaluation.
          </p>
        </div>
      </section>
    </main>
  );
}
