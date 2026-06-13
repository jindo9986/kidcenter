import type { Metadata } from "next";
import Link from "next/link";
import { PrintLink } from "@/components/PrintLink";

export const metadata: Metadata = {
  title: "Independent AI Assessment — Đào Đình Hữu (Tin)",
  description:
    "An independent, AI-generated synthesis of Đào Đình Hữu (Tin)'s learning journey — the pattern connecting curiosity, inquiry, observation and visual thinking across four years of records.",
};

// Faint indigo graph-paper texture over warm paper (DESIGN.md hero treatment).
const graphPaper =
  "linear-gradient(0deg, rgba(255,253,247,.55), rgba(255,253,247,.55))," +
  "repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(55,48,163,.06) 24px)," +
  "repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(55,48,163,.06) 24px)";

/* ---------- small building blocks ---------- */

function Movement({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12 break-avoid">
      <div className="mb-3 flex items-baseline gap-3">
        <span className="font-display text-lg font-bold text-accent">{n}</span>
        <h2 className="font-display text-2xl font-bold leading-tight text-ink">{title}</h2>
      </div>
      <div className="space-y-4 leading-relaxed text-ink/75">{children}</div>
    </section>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-6 break-avoid border-l-4 border-accent pl-5">
      <p className="font-display text-xl italic leading-snug text-ink">{children}</p>
    </blockquote>
  );
}

function InsetList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="break-avoid rounded-2xl bg-brand/[0.04] p-5">
      <p className="mb-2 text-sm font-semibold text-ink/55">{title}</p>
      <ul className="space-y-1.5">
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

function StarRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-black/5 py-2.5 last:border-0">
      <span className="font-semibold text-ink">{label}</span>
      <span className="shrink-0 tracking-[0.15em] text-accent" aria-label="5 out of 5">
        ★★★★★
      </span>
    </div>
  );
}

const OBSERVED = [
  {
    icon: "🔍",
    title: "Curiosity",
    text: "A willingness to explore and investigate.",
  },
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
  {
    icon: "🧩",
    title: "Reasoning",
    text: "The ability to analyse, connect ideas, and solve problems.",
  },
];

const FLOW = ["Curiosity", "Inquiry", "Observation", "Investigation", "Understanding"];

/* ---------- page ---------- */

export default function AssessmentPage() {
  return (
    <>
      <header className="no-print sticky top-0 z-20 border-b border-black/5 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2 px-5 py-2 sm:px-8">
          <span className="truncate font-display text-sm font-bold text-ink/80">
            Independent AI Assessment
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex rounded-full border border-brand/20 px-3 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/5"
            >
              ← Story
            </Link>
            <PrintLink label="PDF" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8">
        {/* Hero */}
        <section
          className="mb-12 break-avoid rounded-[28px] border border-brand/10 p-7 sm:p-9"
          style={{ background: graphPaper }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
            Independent · AI Assessment
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            The Story Behind the Learning Journey
          </h1>
          <p className="mt-3 font-display text-xl italic text-ink/70">
            Scientific Inquiry <span className="text-accent">×</span> Visual Thinking
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/60">
            <span className="font-semibold text-ink/80">Đào Đình Hữu (Tin)</span>
            <span aria-hidden>·</span>
            <span>Synthesised from four years of records, teacher reports &amp; portfolio</span>
          </div>
        </section>

        {/* Introduction (lead) */}
        <section className="mb-12 break-avoid">
          <p className="text-lg leading-relaxed text-ink/80">
            Every child learns. Many achieve good grades. Some collect medals, certificates,
            and awards. But behind every achievement lies a deeper story — a story about how a
            child thinks, how a child learns, and what drives a child to keep exploring even
            when nobody is watching.
          </p>
          <p className="mt-4 leading-relaxed text-ink/75">
            After reviewing Tin&apos;s academic records, teacher evaluations, learning
            behaviours, extracurricular activities, achievements, and personal portfolio, one
            question emerged repeatedly:
          </p>
          <PullQuote>What is the underlying pattern connecting everything?</PullQuote>
          <p className="leading-relaxed text-ink/75">
            The answer was surprisingly consistent. The story is not primarily about
            achievement. It is not about competition. It is not about collecting awards. It is a
            story about <strong className="font-semibold text-ink">curiosity becoming inquiry</strong>,
            inquiry becoming investigation, and investigation becoming understanding.
          </p>
        </section>

        <Movement n="01" title="Before Achievement, There Was Curiosity">
          <p>
            Before Olympiads. Before competitions. Before academic recognition. There was
            curiosity. Tin has always been drawn to questions — about animals, nature,
            dinosaurs, science, technology, history.
          </p>
          <p>
            Many children ask questions. What appears different is what happens next. For Tin, a
            question rarely disappears after being answered once. Answers often become starting
            points for further exploration. One question leads to another; one discovery opens
            the door to many more. The process seems less about finding information and more
            about understanding how things truly work.
          </p>
        </Movement>

        <Movement n="02" title="Learning as Investigation">
          <p>
            As curiosity grew, learning gradually became a form of investigation. Across
            different subjects and interests, a common pattern can be observed: instead of
            stopping at facts, Tin often moves toward deeper questions.
          </p>
          <InsetList
            title="The questions that recur"
            items={[
              "Why does this happen?",
              "How does it work?",
              "What caused it?",
              "What would happen if something changed?",
              "How are different things connected?",
            ]}
          />
          <p>
            Knowledge is not treated as something to memorise. It becomes something to examine,
            to test, to understand. This tendency is one of the strongest indicators of an
            inquiry-driven learner.
          </p>
        </Movement>

        <Movement n="03" title="Observation Became the Starting Point">
          <p>
            Every investigation begins somewhere. For Tin, it often begins with observation —
            of nature, animals, books, science, everyday experiences. Many of his interests
            appear to start with simply noticing something interesting and wanting to understand
            it better.
          </p>
          <p>
            Observation allows details to emerge. Patterns become visible. Questions begin to
            form. Before explanations comes investigation; before investigation comes
            observation. Across multiple teacher reports and learning experiences, careful
            observation appears again and again as a core part of how Tin approaches learning.
          </p>
        </Movement>

        <Movement n="04" title="Visual Thinking Became a Way to Understand">
          <p>
            Not everyone learns in the same way. Some learners think primarily through words,
            others through numbers. Tin often appears to think through images. Visual thinking
            plays an important role in how he organises information and develops understanding.
          </p>
          <InsetList
            title="Images help him"
            items={[
              "Examine structures",
              "Recognise patterns",
              "Understand relationships",
              "Build mental models",
              "Organise complex information",
            ]}
          />
          <p>
            For him, visualisation is not simply a method of presentation. It is part of the
            learning process itself — understanding often develops through seeing.
          </p>
        </Movement>

        <Movement n="05" title="Drawing Became a Tool for Investigation">
          <p>
            One of the most distinctive aspects of Tin&apos;s profile is the role drawing plays
            in his learning. For many children, drawing is mainly a creative activity. For Tin,
            it appears to serve a different purpose: drawing slows down observation, encourages
            closer examination, and creates opportunities to notice details that might otherwise
            be overlooked.
          </p>
          <p>
            Whether studying animals, dinosaurs, biology, nature, or scientific subjects,
            drawing often becomes part of the investigation itself:
          </p>
          <PullQuote>
            Observation leads to drawing. Drawing leads to deeper observation. Deeper
            observation leads to greater understanding.
          </PullQuote>
          <p>
            The purpose is not merely to create artwork — the process becomes a way of studying
            the subject more carefully. In this sense, drawing functions as visual documentation:
            a tool for recording observations, preserving discoveries, and supporting deeper
            inquiry.
          </p>
        </Movement>

        <Movement n="06" title="Visual Documentation for Scientific Inquiry">
          <p>
            As interests developed, a clear relationship emerged between scientific inquiry and
            visual thinking. Tin&apos;s drawings do not appear to be primarily motivated by
            artistic expression, storytelling, or public communication. Instead, they often
            function as visual records of exploration — a way to document observations, organise
            understanding, and revisit ideas and discoveries.
          </p>
          <p>
            This mirrors an important tradition within science itself. Throughout history,
            scientists, naturalists, and researchers have used sketches, diagrams, notebooks,
            and illustrations as tools for observation and investigation. Visual documentation
            was not created simply to communicate knowledge — it was created to help generate
            it. Tin&apos;s learning behaviour reflects many of these same patterns.
          </p>
        </Movement>

        <Movement n="07" title="Independent Learning">
          <p>
            Another consistent theme throughout Tin&apos;s development is independence. Across
            four years of teacher evaluations, different teachers repeatedly identified similar
            characteristics: he willingly accepts challenges, works independently, remains
            focused, and demonstrates initiative when exploring new ideas.
          </p>
          <p>
            This consistency across different academic years and learning environments suggests
            that independent learning is not simply a classroom behaviour — it has become part
            of his learning identity. Curiosity creates questions; independence allows those
            questions to be pursued.
          </p>
        </Movement>

        <Movement n="08" title="Analytical Reasoning">
          <p>
            Inquiry naturally leads to analysis. Strong performance in science, mathematics, and
            investigation-based learning suggests well-developed reasoning abilities. Teacher
            evaluations frequently reference:
          </p>
          <InsetList
            title="Recurring in evaluations"
            items={[
              "Problem solving",
              "Reasoning skills",
              "Prediction making",
              "Investigation planning",
              "Scientific thinking",
            ]}
          />
          <p>
            These abilities allow Tin to move beyond information gathering toward understanding
            relationships, causes, and systems. Understanding becomes structured rather than
            accidental.
          </p>
        </Movement>

        {/* What teachers observed */}
        <section className="mb-12 break-avoid">
          <div className="mb-3 flex items-baseline gap-3">
            <span className="font-display text-lg font-bold text-accent">09</span>
            <h2 className="font-display text-2xl font-bold leading-tight text-ink">
              What Teachers Consistently Observed
            </h2>
          </div>
          <p className="mb-5 leading-relaxed text-ink/75">
            One of the strongest pieces of evidence within the portfolio is consistency.
            Different teachers, different subjects, different years — yet remarkably similar
            observations continue to appear.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {OBSERVED.map((o) => (
              <div
                key={o.title}
                className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm"
              >
                <div className="mb-1 text-2xl" aria-hidden>
                  {o.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-ink">{o.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-ink/70">{o.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 leading-relaxed text-ink/75">
            The repetition of these themes across four years suggests stable cognitive strengths
            rather than isolated achievements.
          </p>
        </section>

        {/* Core cognitive profile */}
        <section className="mb-12 break-avoid">
          <div className="mb-3 flex items-baseline gap-3">
            <span className="font-display text-lg font-bold text-accent">10</span>
            <h2 className="font-display text-2xl font-bold leading-tight text-ink">
              Core Cognitive Profile
            </h2>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <StarRow label="Scientific Inquiry" />
            <StarRow label="Visual Thinking" />
            <StarRow label="Observation" />
            <StarRow label="Independent Learning" />
            <StarRow label="Analytical Reasoning" />
          </div>
          <p className="mt-4 leading-relaxed text-ink/75">
            These strengths form a connected system rather than separate abilities. Together
            they shape how Tin learns, explores, and understands the world.
          </p>
        </section>

        {/* Looking forward */}
        <Movement n="11" title="Looking Forward">
          <p>
            It is impossible to predict exactly where a child&apos;s future interests will lead.
            Interests evolve, opportunities change, new passions emerge. However, certain
            patterns often remain stable. In Tin&apos;s case, the strongest pattern is clear: a
            persistent desire to understand, a tendency to investigate rather than simply accept
            answers, a habit of observing carefully before forming conclusions, and a unique
            ability to use visual thinking as part of the inquiry process itself.
          </p>
          <InsetList
            title="Strong potential in environments that encourage"
            items={[
              "Scientific investigation",
              "Research-oriented learning",
              "Independent exploration",
              "Observation-based study",
              "Analytical thinking",
              "Visual documentation",
            ]}
          />
        </Movement>

        {/* Final reflection — the progression */}
        <section className="mb-12 break-avoid">
          <div className="mb-4 flex items-baseline gap-3">
            <span className="font-display text-lg font-bold text-accent">12</span>
            <h2 className="font-display text-2xl font-bold leading-tight text-ink">
              Final Reflection
            </h2>
          </div>
          <div
            className="rounded-3xl border border-brand/10 p-6 sm:p-8"
            style={{ background: graphPaper }}
          >
            <ol className="mx-auto flex max-w-xs flex-col items-center gap-0">
              {FLOW.map((step, i) => (
                <li key={step} className="flex w-full flex-col items-center">
                  <span
                    className={
                      "w-full rounded-2xl px-4 py-2.5 text-center font-display text-lg font-bold shadow-sm " +
                      (i === FLOW.length - 1
                        ? "bg-brand text-white"
                        : "border border-brand/15 bg-white text-ink")
                    }
                  >
                    {step}
                  </span>
                  {i < FLOW.length - 1 && (
                    <span className="py-1 text-xl leading-none text-accent" aria-hidden>
                      ↓
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-5 space-y-4 leading-relaxed text-ink/75">
            <p>
              This simple progression captures the central theme of Tin&apos;s learning journey.
              The story is not primarily about awards, grades, or recognition. Those achievements
              are important, but they are not the beginning of the story.
            </p>
            <p>
              The story begins with curiosity — a curiosity that gradually developed into inquiry,
              an inquiry that led to investigation, and an investigation that continues to deepen
              understanding.
            </p>
          </div>
        </section>

        {/* Final assessment */}
        <section className="mb-10 break-avoid rounded-3xl border-l-4 border-accent bg-white p-6 shadow-sm sm:p-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand">
            Final Assessment
          </p>
          <div className="space-y-4 font-display text-lg leading-snug text-ink">
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
        </section>

        <footer className="no-print mt-10 flex flex-wrap items-center justify-center gap-2">
          <PrintLink />
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-brand/25 px-4 text-base font-semibold text-brand transition-colors hover:bg-brand/5"
          >
            ← Back to the story
          </Link>
        </footer>

        <p className="mt-6 text-center text-xs leading-relaxed text-ink/45">
          This is an independent assessment generated by AI as a synthesis of existing records,
          teacher evaluations and portfolio materials. It is intended to describe observed
          learning patterns, not to serve as a formal psychometric evaluation.
        </p>
      </main>
    </>
  );
}
