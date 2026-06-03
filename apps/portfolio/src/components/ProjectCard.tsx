import type { Project } from "@/lib/schemas";
import { Card } from "@kidcenter/ui";
import { Localized } from "./Localized";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="break-avoid">
      <span className="mb-2 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
        <Localized value={project.tag} />
      </span>
      <h3 className="mb-2 text-lg font-bold text-ink">
        <Localized value={project.title} />
      </h3>
      <div
        className="prose prose-sm max-w-none text-ink/70"
        data-lang="vi"
        dangerouslySetInnerHTML={{ __html: project.bodyHtml.vi }}
      />
      <div
        className="prose prose-sm max-w-none text-ink/70"
        data-lang="en"
        dangerouslySetInnerHTML={{ __html: project.bodyHtml.en }}
      />
    </Card>
  );
}
