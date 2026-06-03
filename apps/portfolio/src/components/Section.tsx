import type { L } from "@/lib/schemas";
import { Localized } from "./Localized";

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: L;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-10">
      <h2 className="mb-4 font-display text-2xl font-bold text-ink">
        <Localized value={title} />
      </h2>
      {children}
    </section>
  );
}
