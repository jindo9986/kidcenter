"use client";

import { Button } from "@kidcenter/ui";

export function PrintButton() {
  return (
    <Button
      size="md"
      onClick={() => window.print()}
      className="min-h-11"
    >
      ⬇️ <span data-lang="vi">Tải PDF</span>
      <span data-lang="en">Export PDF</span>
    </Button>
  );
}
