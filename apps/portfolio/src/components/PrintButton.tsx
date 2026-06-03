import { asset } from "@/lib/asset";

/** Download the purpose-built capability-profile PDF for the active locale.
 *  `compact` hides the text label on small screens (icon-only). */
export function PrintButton({ compact = false }: { compact?: boolean }) {
  const cls =
    "inline-flex min-h-11 items-center justify-center rounded-2xl bg-brand px-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark";
  const labelCls = compact ? "hidden sm:inline" : "";
  return (
    <>
      <a
        data-lang="vi"
        href={asset("/ho-so-nang-luc-vi.pdf")}
        download
        className={cls}
        aria-label="Tải hồ sơ PDF"
      >
        ⬇️<span className={labelCls}>&nbsp;Tải PDF</span>
      </a>
      <a
        data-lang="en"
        href={asset("/ho-so-nang-luc-en.pdf")}
        download
        className={cls}
        aria-label="Download PDF profile"
      >
        ⬇️<span className={labelCls}>&nbsp;Profile PDF</span>
      </a>
    </>
  );
}
