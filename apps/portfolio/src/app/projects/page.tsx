import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { SiteNav } from "@/components/SiteNav";
import { ProjectPreview } from "@/components/ProjectPreview";
import { Localized } from "@/components/Localized";

export const metadata: Metadata = {
  title: "Projects — Đào Đình Hữu (Tin)",
  description:
    "Science and maker projects Đào Đình Hữu (Tin) designed and built himself.",
};

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8 sm:py-12">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-brand">
          <Localized value={{ vi: "Dự án", en: "Projects" }} />
        </p>
        <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          <Localized value={{ vi: "Dự án của Tin", en: "Tin's projects" }} />
        </h1>
        <p className="mt-2 max-w-2xl text-ink/60">
          <Localized
            value={{
              vi: "Những dự án khoa học & sáng tạo bé tự tay thiết kế và chế tạo.",
              en: "Science & maker projects the child designed and built himself.",
            }}
          />
        </p>

        {projects.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectPreview key={p.slug} project={p} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-ink/50">
            <Localized value={{ vi: "Sắp có…", en: "Coming soon…" }} />
          </p>
        )}
      </main>
    </>
  );
}
