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

function ProtoImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-square rounded-3xl border border-black/5 bg-gradient-to-br from-cream to-black/[0.03] p-4 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(src)} alt={alt} loading="lazy" className="h-full w-full object-contain" />
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
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand">
            <Localized value={p.tag} />
          </p>
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

      {/* INTRO */}
      <section className="mx-auto max-w-2xl px-6 py-12">
        <div className="space-y-4 text-lg leading-relaxed text-ink/80">
          {p.intro.map((para, i) => (
            <p key={i}>
              <Localized value={para} />
            </p>
          ))}
        </div>
      </section>

      {/* PROTOTYPES — image + full text, alternating; the child's own headings + words */}
      <section className="border-y border-brand/10 bg-white">
        <div className="mx-auto max-w-5xl space-y-14 px-6 py-14 md:space-y-20">
          {p.prototypes.map((proto, i) => (
            <article
              key={i}
              className={
                "flex flex-col gap-6 md:items-center md:gap-10 " +
                (i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row")
              }
            >
              <div className="md:w-1/3">
                <ProtoImage src={proto.image} alt={en(proto.name)} />
              </div>
              <div className="md:flex-1">
                <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-[1.7rem]">
                  <Localized value={proto.name} />
                </h2>
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

      {/* AFTER — launcher photo + the closing narrative (verbatim) */}
      <section className="mx-auto max-w-2xl px-6 py-12">
        <div className="mx-auto mb-8 max-w-xs">
          <ProtoImage src={p.launcherImage} alt="LEGO ripcord launcher" />
        </div>
        <div className="space-y-4 text-lg leading-relaxed text-ink/80">
          {p.after.map((para, i) => {
            const last = i === p.after.length - 1;
            return (
              <p
                key={i}
                className={last ? "pt-2 text-center font-display text-xl font-bold text-brand" : undefined}
              >
                <Localized value={para} />
              </p>
            );
          })}
        </div>
      </section>

      {/* DATA — the spinning-time table, exactly as written */}
      <section className="border-t border-brand/10 bg-cream">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            <Localized value={p.dataHeading} />
          </h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-black/5 bg-white p-2 shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr>
                  {p.dataColumns.map((c, i) => (
                    <th
                      key={i}
                      className={
                        "border-b-2 border-brand/20 px-3 py-2 font-display font-bold text-ink " +
                        (i === p.dataColumns.length - 1 ? "text-right" : "")
                      }
                    >
                      <Localized value={c} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.dataRows.map((r, i) => (
                  <tr key={i} className="border-b border-black/5 last:border-0">
                    <td className="px-3 py-2 text-ink/80">
                      <Localized value={r.label} />
                    </td>
                    <td className="px-3 py-2 text-right font-semibold tabular-nums text-ink">
                      {r.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
