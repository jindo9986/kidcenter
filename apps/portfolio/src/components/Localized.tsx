import type { ElementType } from "react";
import type { L } from "@/lib/schemas";

export function Localized({
  value,
  as,
  className,
}: {
  value: L;
  as?: ElementType;
  className?: string;
}) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <>
      <Tag data-lang="vi" className={className}>
        {value.vi}
      </Tag>
      <Tag data-lang="en" className={className}>
        {value.en}
      </Tag>
    </>
  );
}
