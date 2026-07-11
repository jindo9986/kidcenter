import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getProject } from "@/lib/content";
import type { L } from "@/lib/schemas";
import { asset } from "@/lib/asset";
import { SiteNav } from "@/components/SiteNav";
import { Localized } from "@/components/Localized";

const en = (v: L) => v.en;

/* faint indigo graph-paper texture (DESIGN.md hero treatment, mirrors intro/assessment) */
const graphPaper =
  "linear-gradient(0deg, rgba(255,253,247,.6), rgba(255,253,247,.6))," +
  "repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(55,48,163,.06) 24px)," +
  "repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(55,48,163,.06) 24px)";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project — Đào Đình Hữu (Tin)" };
  return { title: `${p.title.en} — Đào Đình Hữu (Tin)`, description: p.summary.en };
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand">
      {children}
    </p>
  );
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const maxSpin = Math.max(...p.data.rows.map((r) => r.value));

  return (
    <main className="bg-cream text-ink">
      <SiteNav />

      {/* HERO */}
      <header
        className="relative overflow-hidden border-b border-brand/10"
        style={{ background: graphPaper }}
      >
        <div className="relative mx-auto max-w-3xl px-6 pb-10 pt-6 text-center">
          <Link
            href="/projects"
            className="mb-6 inline-block text-sm font-semibold text-brand hover:underline"
          >
            <Localized value={{ vi: "← Tất cả dự án", en: "← All projects" }} />
          </Link>
          <Eyebrow>
            <Localized value={p.tag} />
          </Eyebrow>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl">
            <Localized value={p.title} />
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] text-lg leading-relaxed text-ink/70">
            <Localized value={p.summary} />
          </p>
        </div>
        <div className="mx-auto max-w-3xl px-6 pb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(p.cover)}
            alt={en(p.title)}
            className="w-full rounded-[28px] border border-black/5 object-cover shadow-md"
          />
        </div>
      </header>

      {/* THE IDEA */}
      <section className="mx-auto max-w-2xl px-6 py-12">
        <div className="space-y-4 text-lg leading-relaxed text-ink/80">
          {p.intro.map((para, i) => (
            <p key={i}>
              <Localized value={para} />
            </p>
          ))}
        </div>
      </section>

      {/* THE SCIENCE — concept cards */}
      <section className="border-y border-brand/10 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="text-center">
            <Eyebrow>
              <Localized value={{ vi: "Vật lý", en: "The physics" }} />
            </Eyebrow>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              <Localized value={p.science.heading} />
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {p.science.points.map((c, i) => (
              <div
                key={i}
                className="break-avoid rounded-3xl border border-black/5 bg-cream p-6 text-center shadow-sm"
              >
                {c.icon && <div className="text-3xl">{c.icon}</div>}
                <h3 className="mt-3 font-display text-lg font-bold text-brand">
                  <Localized value={c.term} />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  <Localized value={c.text} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROTOTYPES — image + full-text rows (alternating), faithful to the write-up */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="text-center">
          <Eyebrow>
            <Localized value={{ vi: "Quá trình", en: "The process" }} />
          </Eyebrow>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            <Localized value={p.prototypesHeading} />
          </h2>
          {p.prototypesLede && (
            <p className="mx-auto mt-3 max-w-[560px] text-ink/60">
              <Localized value={p.prototypesLede} />
            </p>
          )}
        </div>
        <div className="mt-12 space-y-14 md:space-y-20">
          {p.prototypes.map((proto, i) => (
            <article
              key={i}
              className={
                "flex flex-col gap-6 md:items-center md:gap-10 " +
                (i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row")
              }
            >
              <div className="md:w-1/3">
                <div className="relative aspect-square rounded-3xl border border-black/5 bg-gradient-to-br from-cream to-black/[0.03] p-4 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(proto.image)}
                    alt={en(proto.name)}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                  <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand font-display text-sm font-bold text-white shadow">
                    {i + 1}
                  </span>
                </div>
              </div>
              <div className="md:flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-brand">
                    <Localized value={{ vi: `Nguyên mẫu ${i + 1}`, en: `Prototype ${i + 1}` }} />
                  </span>
                  {proto.spinTime && (
                    <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-ink">
                      ⏱ {proto.spinTime.toFixed(2)}s
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-ink sm:text-[1.7rem]">
                  <Localized value={proto.name} />
                </h3>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-accent">
                  <Localized value={proto.parts} />
                </p>
                <div className="mt-3 space-y-3 leading-relaxed text-ink/75">
                  {proto.body.map((para, j) => (
                    <p key={j}>
                      <Localized value={para} />
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FEATURE SECTIONS — image + text rows */}
      {p.sections && (
        <section className="border-t border-brand/10 bg-white">
          <div className="mx-auto max-w-5xl divide-y divide-black/5 px-6">
            {p.sections.map((s, i) => (
              <div
                key={i}
                className={
                  "flex flex-col gap-6 py-12 md:items-center " +
                  (i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row")
                }
              >
                {s.image && (
                  <div className="md:w-2/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(s.image)}
                      alt={en(s.heading)}
                      loading="lazy"
                      className="w-full rounded-3xl border border-black/5 object-cover shadow-sm"
                    />
                  </div>
                )}
                <div className="md:flex-1">
                  <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                    <Localized value={s.heading} />
                  </h2>
                  <div className="mt-3 space-y-3 leading-relaxed text-ink/75">
                    {s.body.map((para, j) => (
                      <p key={j}>
                        <Localized value={para} />
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DATA — spinning-time bar chart */}
      <section className="border-y border-brand/10 bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <div className="text-center">
            <Eyebrow>
              <Localized value={{ vi: "Dữ liệu", en: "The data" }} />
            </Eyebrow>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              <Localized value={p.data.heading} />
            </h2>
            <p className="mx-auto mt-3 max-w-[560px] text-sm text-ink/60">
              <Localized value={p.data.note} />
            </p>
          </div>
          <div className="mt-8 space-y-3">
            {p.data.rows.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-32 shrink-0 text-right text-sm text-ink/70 sm:w-44">
                  <Localized value={r.label} />
                </div>
                <div className="relative h-7 flex-1 overflow-hidden rounded-full bg-black/[0.05]">
                  <div
                    className={
                      "flex h-full items-center justify-end rounded-full pr-2 text-xs font-bold text-white " +
                      (r.highlight ? "bg-accent" : "bg-brand")
                    }
                    style={{ width: `${Math.max(12, (r.value / maxSpin) * 100)}%` }}
                  >
                    {r.value.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-right text-xs text-ink/45">
            <Localized value={p.data.unit} />
          </p>
        </div>
      </section>

      {/* LEARNINGS — closing band */}
      <section className="bg-brand text-white">
        <div className="mx-auto max-w-2xl px-6 py-14 text-center">
          <Eyebrow>
            <span className="text-accent">
              <Localized value={{ vi: "Bài học", en: "Takeaways" }} />
            </span>
          </Eyebrow>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <Localized value={p.learnings.heading} />
          </h2>
          <div className="mt-5 space-y-4 text-left text-lg leading-relaxed text-white/85">
            {p.learnings.body.map((para, i) => (
              <p key={i}>
                <Localized value={para} />
              </p>
            ))}
          </div>
          <p className="mt-8 font-display text-xl font-bold italic text-accent">
            <Localized value={p.learnings.closing} />
          </p>
        </div>
      </section>
    </main>
  );
}
