"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/lib/schemas";
import { asset } from "@/lib/asset";
import { Localized } from "./Localized";

/** Gallery grid + a lightbox for viewing each piece full-size.
 *  The grid square-crops thumbnails; the lightbox shows the whole image. */
export function Gallery({ items }: { items: MediaItem[] }) {
  // null = closed; otherwise the index being viewed.
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Restore focus to the thumbnail that opened the lightbox.
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setIndex((i) =>
        i === null ? i : (i + delta + items.length) % items.length,
      ),
    [items.length],
  );

  // Drive the native dialog from state so Esc, focus trap and the top layer
  // all come for free.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    else if (index === null && d.open) d.close();
  }, [index]);

  // The page behind a modal dialog can still scroll; pin it while open.
  useEffect(() => {
    if (index === null) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [index]);

  useEffect(() => {
    if (index === null) openerRef.current?.focus();
  }, [index]);

  function onKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  }

  const current = index === null ? null : items[index];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, i) => (
          <figure
            key={i}
            className="break-avoid overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setIndex(i);
              }}
              className="group block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <span className="sr-only">
                <Localized
                  value={{
                    vi: `Xem ảnh lớn: ${item.caption.vi}`,
                    en: `View larger: ${item.caption.en}`,
                  }}
                />
              </span>
              {item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset(item.src)}
                  alt=""
                  className="aspect-square w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <video
                  src={asset(item.src)}
                  className="aspect-square w-full object-cover"
                  muted
                  playsInline
                />
              )}
            </button>
            <figcaption className="p-2 text-center text-xs text-ink/60">
              <Localized value={item.caption} />
            </figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={close}
        onKeyDown={onKeyDown}
        aria-label="Lightbox"
        className="no-print m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-ink/85 open:flex"
      >
        {current && (
          <div className="flex h-[100dvh] w-[100vw] flex-col items-center justify-center gap-3 p-4 sm:p-6">
            {/* Click-away: a full-bleed layer behind the figure. */}
            <button
              type="button"
              onClick={close}
              aria-hidden
              tabIndex={-1}
              className="absolute inset-0 cursor-zoom-out"
            />

            <figure className="relative flex min-h-0 flex-col items-center gap-3">
              {current.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={current.src}
                  src={asset(current.src)}
                  alt=""
                  className="max-h-[78dvh] w-auto max-w-full rounded-2xl bg-white object-contain shadow-2xl"
                />
              ) : (
                <video
                  key={current.src}
                  src={asset(current.src)}
                  controls
                  autoPlay
                  className="max-h-[78dvh] w-auto max-w-full rounded-2xl bg-black object-contain shadow-2xl"
                />
              )}
              <figcaption className="max-w-prose text-center text-sm text-paper/90">
                <Localized value={current.caption} />
              </figcaption>
            </figure>

            <div className="relative flex items-center gap-2">
              <LightboxButton onClick={() => step(-1)} glyph="‹"
                label={{ vi: "Ảnh trước", en: "Previous image" }} />
              <span className="min-w-16 text-center text-sm font-semibold tabular-nums text-paper/70">
                {index! + 1} / {items.length}
              </span>
              <LightboxButton onClick={() => step(1)} glyph="›"
                label={{ vi: "Ảnh tiếp theo", en: "Next image" }} />
              <LightboxButton onClick={close} glyph="✕"
                label={{ vi: "Đóng", en: "Close" }} />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function LightboxButton({
  onClick,
  glyph,
  label,
}: {
  onClick: () => void;
  glyph: string;
  label: { vi: string; en: string };
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-full bg-paper/15 text-xl leading-none text-paper transition-colors duration-150 ease-out hover:bg-paper/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-paper"
    >
      <span aria-hidden>{glyph}</span>
      <span className="sr-only">
        <Localized value={label} />
      </span>
    </button>
  );
}
