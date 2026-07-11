import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/content";
import { asset } from "@/lib/asset";
import { SiteNav } from "@/components/SiteNav";
import { Localized } from "@/components/Localized";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjects().find((p) => p.slug === slug);
  if (!project) return { title: "Project — Đào Đình Hữu (Tin)" };
  return {
    title: `${project.title.en} — Đào Đình Hữu (Tin)`,
    description: project.summary?.en,
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjects().find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8 sm:py-12">
        <Link
          href="/projects"
          className="text-sm font-semibold text-brand hover:underline"
        >
          <Localized value={{ vi: "← Tất cả dự án", en: "← All projects" }} />
        </Link>

        <span className="mt-5 inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
          <Localized value={project.tag} />
        </span>
        <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          <Localized value={project.title} />
        </h1>
        {project.summary && (
          <p className="mt-2 text-lg leading-relaxed text-ink/65">
            <Localized value={project.summary} />
          </p>
        )}

        {project.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset(project.cover)}
            alt=""
            className="mt-6 w-full rounded-3xl border border-black/5 object-cover"
          />
        )}

        <article className="mt-8">
          <div
            className="project-prose"
            data-lang="vi"
            dangerouslySetInnerHTML={{ __html: project.bodyHtml.vi }}
          />
          <div
            className="project-prose"
            data-lang="en"
            dangerouslySetInnerHTML={{ __html: project.bodyHtml.en }}
          />
        </article>
      </main>
    </>
  );
}
