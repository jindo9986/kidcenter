"use client";

import { Button } from "@kidcenter/ui";

/** `compact` hides the text label on small screens (icon-only) — used in the
 *  sticky header where horizontal space is tight on mobile. */
export function PrintButton({ compact = false }: { compact?: boolean }) {
  const labelCls = compact ? "hidden sm:inline" : "";
  return (
    <Button
      size="md"
      onClick={() => window.print()}
      aria-label="Tải PDF / Export PDF"
      className="min-h-11"
    >
      ⬇️
      <span data-lang="vi" className={labelCls}>
        &nbsp;Tải PDF
      </span>
      <span data-lang="en" className={labelCls}>
        &nbsp;Export PDF
      </span>
    </Button>
  );
}
