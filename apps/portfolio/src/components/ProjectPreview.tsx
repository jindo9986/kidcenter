import Link from "next/link";
import type { Project } from "@/lib/schemas";
import { asset } from "@/lib/asset";
import { Localized } from "./Localized";

// Compact project card for the /projects grid and the /profile teaser — cover +
// tag + title + summary, linking to the detail page.
export function ProjectPreview({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block break-avoid overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
    >
      {project.cover && (
        <div className="aspect-[4/3] overflow-hidden bg-cream">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(project.cover)}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-block rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
            <Localized value={project.tag} />
          </span>
          {project.dateLabel && (
            <span className="text-xs font-semibold text-ink/45">
              <Localized value={project.dateLabel} />
            </span>
          )}
        </div>
        <h3 className="font-display text-lg font-bold leading-tight text-ink">
          <Localized value={project.title} />
        </h3>
        {project.summary && (
          <p className="mt-1.5 text-sm leading-snug text-ink/60">
            <Localized value={project.summary} />
          </p>
        )}
        <span className="mt-3 inline-block text-sm font-semibold text-brand">
          <Localized value={{ vi: "Xem chi tiết →", en: "View project →" }} />
        </span>
      </div>
    </Link>
  );
}
