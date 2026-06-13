"use client";

// A print / "save as PDF" trigger for pages without a pre-built PDF.
// Uses the browser print dialog; @media print rules in globals.css handle layout.
export function PrintLink({ label = "Print / Save as PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-brand/25 px-4 text-base font-semibold text-brand transition-colors hover:bg-brand/5"
    >
      🖨&nbsp;{label}
    </button>
  );
}
