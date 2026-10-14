"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryGroup, L, MediaItem } from "@/lib/schemas";
import { asset } from "@/lib/asset";
import { Localized } from "./Localized";

const GROUP_ORDER: GalleryGroup[] = [
  "award",
  "landscape",
  "architecture",
  "stilllife",
  "dino",
];

const GROUP_LABEL: Record<GalleryGroup, L> = {
  award: { vi: "Tranh đoạt giải", en: "Prize paintings" },
  landscape: { vi: "Phong cảnh", en: "Landscape" },
  architecture: { vi: "Kiến trúc & phố", en: "Architecture & street" },
  stilllife: { vi: "Tĩnh vật", en: "Still life" },
  dino: { vi: "Ký họa khủng long", en: "Dinosaur studies" },
};

/** Gallery grouped by subject, plus a lightbox for viewing each piece full-size.
 *  The grid square-crops thumbnails; the lightbox shows the whole image and
 *  walks every group in the order they are displayed. */
export function Gallery({ items }: { items: MediaItem[] }) {
  // Buckets in display order; anything ungrouped trails as a plain grid.
  const buckets = GROUP_ORDER.map((key) => ({
    key,
    items: items.filter((i) => i.group === key),
  })).filter((b) => b.items.length > 0);
  const ungrouped = items.filter((i) => !i.group);

  // One flat list so prev/next crosses group boundaries.
  const ordered = [...buckets.flatMap((b) => b.items), ...ungrouped];

  // null = closed; otherwise the index into `ordered`.
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  // Plain functions: the React Compiler memoizes these, and hand-written
  // useCallback here cannot be preserved because `ordered` is derived in render.
  const close = () => setIndex(null);
  const step = (delta: number) =>
    setIndex((i) =>
      i === null ? i : (i + delta + ordered.length) % ordered.length,
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

  const open = (i: number, button: HTMLButtonElement) => {
    openerRef.current = button;
    setIndex(i);
  };

  const current = index === null ? null : ordered[index];

  // Each bucket's offset into `ordered`, so a tile knows its global index.
  const starts = buckets.map((_, i) =>
    buckets.slice(0, i).reduce((n, b) => n + b.items.length, 0),
  );

  return (
    <>
      <div className="grid gap-5">
        {buckets.map((b, bi) => (
          <section key={b.key} className="break-avoid">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-ink">
                <Localized value={GROUP_LABEL[b.key]} />
              </h3>
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand">
                {b.items.length}
              </span>
            </div>
            <Grid items={b.items} start={starts[bi]} onOpen={open} />
          </section>
        ))}
        {ungrouped.length > 0 && (
          <Grid
            items={ungrouped}
            start={ordered.length - ungrouped.length}
            onOpen={open}
          />
        )}
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
                {index! + 1} / {ordered.length}
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

function Grid({
  items,
  start,
  onOpen,
}: {
  items: MediaItem[];
  start: number;
  onOpen: (index: number, button: HTMLButtonElement) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item, i) => (
        <figure
          key={item.src}
          className="break-avoid overflow-hidden rounded-2xl bg-white shadow-sm"
        >
          <button
            type="button"
            onClick={(e) => onOpen(start + i, e.currentTarget)}
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
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
              />
            ) : (
              <video
                src={asset(item.src)}
                className="aspect-square w-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
            )}
          </button>
          <figcaption className="p-2 text-center text-xs text-ink/60">
            <Localized value={item.caption} />
          </figcaption>
        </figure>
      ))}
    </div>
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
