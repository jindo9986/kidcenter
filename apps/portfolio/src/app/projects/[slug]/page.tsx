import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getProject } from "@/lib/content";
import type { L } from "@/lib/schemas";
import { asset } from "@/lib/asset";
import { SiteNav } from "@/components/SiteNav";
import { Localized } from "@/components/Localized";
import { ZoomButton } from "@/components/ZoomButton";

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

function Eyebrow({ value }: { value: L }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand">
      <Localized value={value} />
    </p>
  );
}

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-06-24" → { vi: "24/06/2026", en: "24 June 2026" } */
function fmtDate(iso: string): L {
  const [y, m, d] = iso.split("-");
  return {
    vi: `${d}/${m}/${y}`,
    en: `${parseInt(d, 10)} ${MONTHS_EN[parseInt(m, 10) - 1]} ${y}`,
  };
}

function ProtoImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: L;
}) {
  return (
    <div className="relative aspect-square rounded-3xl border border-black/5 bg-gradient-to-br from-cream to-black/[0.03] p-4 shadow-sm">
      <ZoomButton src={src} caption={caption} group="project">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(src)} alt={alt} loading="lazy" className="h-full w-full object-contain" />
      </ZoomButton>
    </div>
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

  const maxSpin = Math.max(...p.dataRows.map((r) => parseFloat(r.value)));

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
          <Eyebrow value={p.tag} />
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl">
            <Localized value={p.title} />
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] text-lg leading-relaxed text-ink/70">
            <Localized value={p.summary} />
          </p>
          {p.dateLabel && (
            <p className="mt-4 inline-block rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-ink/60 shadow-sm">
              📅 <Localized value={p.dateLabel} />
            </p>
          )}
        </div>
        <div className="mx-auto max-w-3xl px-6 pb-10">
          <ZoomButton src={p.cover} caption={p.title} group="project">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(p.cover)}
              alt={en(p.title)}
              className="w-full rounded-[28px] border border-black/5 object-cover shadow-md"
            />
          </ZoomButton>
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

      {/* THE PHYSICS — concept cards (verbatim text) */}
      <section className="border-y border-brand/10 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow value={p.physicsEyebrow} />
            <p className="text-xl font-display font-bold leading-snug text-ink">
              <Localized value={p.physicsLead} />
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {p.physics.map((c, i) => (
              <div
                key={i}
                className="break-avoid rounded-3xl border border-black/5 bg-cream p-6 shadow-sm"
              >
                {c.icon && <div className="text-3xl">{c.icon}</div>}
                <h3 className="mt-3 font-display text-lg font-bold text-brand">
                  <Localized value={c.term} />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">
                  <Localized value={c.text} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MATERIALS → FINISHED — the loose parts, then the finished spinning tops */}
      {p.materials && (
        <section className="mx-auto max-w-5xl px-6 pt-14">
          <div className="mx-auto max-w-2xl text-center">
            {p.materials.eyebrow && <Eyebrow value={p.materials.eyebrow} />}
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              <Localized value={p.materials.heading} />
            </h2>
            {p.materials.note && (
              <p className="mt-4 text-lg leading-relaxed text-ink/75">
                <Localized value={p.materials.note} />
              </p>
            )}
          </div>

          <div className="mt-9 flex flex-col items-center gap-4 md:flex-row md:gap-6">
            {/* raw parts — object-contain so nothing is cropped */}
            <figure className="w-full md:flex-1">
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br from-cream to-black/[0.03] p-2 shadow-sm">
                <ZoomButton
                  src={p.materials.image}
                  caption={p.materials.fromLabel}
                  group="project"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(p.materials.image)}
                    alt={en(p.materials.fromLabel)}
                    loading="lazy"
                    className="max-h-full max-w-full rounded-2xl object-contain"
                  />
                </ZoomButton>
              </div>
              <figcaption className="mt-2 text-center text-sm font-bold uppercase tracking-wide text-ink/50">
                <Localized value={p.materials.fromLabel} />
              </figcaption>
            </figure>

            {/* arrow (points down on mobile, right on desktop) */}
            <div className="shrink-0 rotate-90 md:rotate-0">
              <span className="morph-arrow inline-block font-display text-4xl font-bold text-accent">
                →
              </span>
            </div>

            {/* finished builds */}
            <figure className="w-full md:flex-1">
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br from-cream to-black/[0.03] p-2 shadow-sm">
                <ZoomButton
                  src={p.materials.finishedImage}
                  caption={p.materials.toLabel}
                  group="project"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(p.materials.finishedImage)}
                    alt={en(p.materials.toLabel)}
                    loading="lazy"
                    className="max-h-full max-w-full rounded-2xl object-contain"
                  />
                </ZoomButton>
              </div>
              <figcaption className="mt-2 text-center text-sm font-bold uppercase tracking-wide text-brand">
                <Localized value={p.materials.toLabel} />
              </figcaption>
            </figure>
          </div>
        </section>
      )}

      {/* PROTOTYPES — image + full text rows, with number + parts chip */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="text-center">
          <Eyebrow value={p.prototypesEyebrow} />
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            <Localized value={p.prototypesHeading} />
          </h2>
          {p.prototypesLede && (
            <p className="mx-auto mt-3 max-w-[600px] text-ink/60">
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
                <div className="relative">
                  <ProtoImage src={proto.image} alt={en(proto.name)} caption={proto.name} />
                  <span className="absolute -left-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand font-display text-sm font-bold text-white shadow-md">
                    {i + 1}
                  </span>
                </div>
              </div>
              <div className="md:flex-1">
                <h3 className="font-display text-2xl font-bold leading-tight text-ink sm:text-[1.7rem]">
                  <Localized value={proto.name} />
                </h3>
                <span className="mt-2 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
                  <Localized value={proto.parts} />
                </span>
                <div className="mt-3 space-y-3 leading-relaxed text-ink/80">
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

      {/* LAUNCHER + CLOSING NARRATIVE (verbatim) */}
      <section className="border-t border-brand/10 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
            <div className="md:w-2/5">
              <ProtoImage src={p.launcherImage} alt="LEGO ripcord launcher" />
            </div>
            <div className="leading-relaxed text-ink/80 md:flex-1">
              <p>
                <Localized value={p.midProse[0]} />
              </p>
            </div>
          </div>
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-ink/80">
            {p.midProse.slice(1).map((para, i) => (
              <p key={i}>
                <Localized value={para} />
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* DATA — spinning-time bar chart (exact values, PDF order) */}
      <section className="border-y border-brand/10 bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <div className="text-center">
            <Eyebrow value={p.dataEyebrow} />
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              <Localized value={p.dataHeading} />
            </h2>
            <p className="mx-auto mt-3 max-w-[560px] text-sm text-ink/60">
              <Localized value={p.dataColumns[1]} />
            </p>
          </div>
          <div className="mt-8 space-y-3">
            {p.dataRows.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-36 shrink-0 text-right text-sm text-ink/70 sm:w-52">
                  <Localized value={r.label} />
                </div>
                <div className="relative h-7 flex-1 overflow-hidden rounded-full bg-black/[0.05]">
                  <div
                    className={
                      "flex h-full items-center justify-end rounded-full pr-2 text-xs font-bold text-white " +
                      (r.highlight ? "bg-accent" : "bg-brand")
                    }
                    style={{ width: `${Math.max(14, (parseFloat(r.value) / maxSpin) * 100)}%` }}
                  >
                    {r.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING — brand band (verbatim learnings + thanks) */}
      <section className="bg-brand text-white">
        <div className="mx-auto max-w-2xl px-6 py-14 text-center">
          <div className="space-y-4 text-left text-lg leading-relaxed text-white/85">
            {p.closing.slice(0, -1).map((para, i) => (
              <p key={i}>
                <Localized value={para} />
              </p>
            ))}
          </div>
          <p className="mt-8 font-display text-xl font-bold italic text-accent">
            <Localized value={p.closing[p.closing.length - 1]} />
          </p>
        </div>
      </section>

      {/* TIMELINE — dated milestones (project metadata, not the child's text) */}
      {p.timeline && p.timeline.length > 0 && (
        <section className="mx-auto max-w-2xl px-6 py-14">
          <div className="text-center">
            <Eyebrow value={{ vi: "Dòng thời gian", en: "Timeline" }} />
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              <Localized value={{ vi: "Quá trình thực hiện", en: "How it unfolded" }} />
            </h2>
          </div>
          <ol className="relative mt-8 space-y-7 border-l-2 border-brand/15 pl-7">
            {p.timeline.map((m, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[35px] top-1.5 h-3.5 w-3.5 rounded-full bg-brand ring-4 ring-cream" />
                <p className="text-xs font-bold uppercase tracking-wide text-brand">
                  <Localized value={fmtDate(m.date)} />
                </p>
                <p className="mt-0.5 font-display text-lg font-bold leading-snug text-ink">
                  <Localized value={m.title} />
                </p>
                {m.note && (
                  <p className="mt-0.5 text-sm leading-snug text-ink/60">
                    <Localized value={m.note} />
                  </p>
                )}
              </li>
            ))}
          </ol>
          {p.timelineNote && (
            <p className="mt-7 border-t border-black/5 pt-4 text-xs italic leading-relaxed text-ink/45">
              <Localized value={p.timelineNote} />
            </p>
          )}
        </section>
      )}
    </main>
  );
}
