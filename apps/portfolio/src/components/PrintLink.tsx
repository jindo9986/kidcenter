"use client";

// A print / "save as PDF" trigger for pages without a pre-built PDF.
// Uses the browser print dialog; @media print rules in globals.css handle layout.
// Bilingual label (data-lang spans toggled by the page's data-locale); `compact`
// shows a language-neutral "PDF" for tight spaces like a top bar.
export function PrintLink({ compact = false }: { compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-brand/25 px-4 text-base font-semibold text-brand transition-colors hover:bg-brand/5"
    >
      🖨
      {compact ? (
        <>&nbsp;PDF</>
      ) : (
        <>
          &nbsp;<span data-lang="vi">In / Lưu PDF</span>
          <span data-lang="en">Print / Save as PDF</span>
        </>
      )}
    </button>
  );
}
