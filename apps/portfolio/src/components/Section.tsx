import type { L } from "@/lib/schemas";
import { Localized } from "./Localized";

export function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: L;
  subtitle?: L;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-10 scroll-mt-24 sm:scroll-mt-36">
      <h2 className="font-display text-2xl font-bold text-ink">
        <Localized value={title} />
      </h2>
      {subtitle && (
        <p className="mb-4 mt-0.5 text-sm text-ink/50">
          <Localized value={subtitle} />
        </p>
      )}
      {!subtitle && <div className="mb-4" />}
      {children}
    </section>
  );
}
