"use client";

import { Button } from "@kidcenter/ui";

export function PrintButton() {
  return (
    <Button size="sm" onClick={() => window.print()}>
      ⬇️ <span data-lang="vi">Tải PDF</span>
      <span data-lang="en">Export PDF</span>
    </Button>
  );
}
