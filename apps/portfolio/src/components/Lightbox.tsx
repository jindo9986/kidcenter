"use client";

import { useEffect, useRef, useState } from "react";

type Shot = { src: string; vi: string; en: string };

/** One lightbox for the whole site.
 *
 *  Mounted once in the root layout and driven by event delegation: anything
 *  rendered by `ZoomButton` carries `data-zoom`, so server components stay
 *  server components — they only emit markup, never a client boundary.
 *  Clicking one collects every `data-zoom` sharing its `data-zoom-group`, in
 *  DOM order, and that becomes the prev/next set. */
export function Lightbox() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>("[data-zoom]");
      if (!trigger) return;
      const group = trigger.dataset.zoomGroup ?? "";
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(
          `[data-zoom][data-zoom-group="${CSS.escape(group)}"]`,
        ),
      );
      setShots(
        nodes.map((n) => ({
          src: n.dataset.zoomSrc ?? "",
          vi: n.dataset.zoomVi ?? "",
          en: n.dataset.zoomEn ?? "",
        })),
      );
      openerRef.current = trigger;
      setIndex(Math.max(0, nodes.indexOf(trigger)));
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = () => setIndex(null);
  const step = (delta: number) =>
    setIndex((i) =>
      i === null ? i : (i + delta + shots.length) % shots.length,
    );

  // Drive the native dialog from state so Esc, the focus trap and the top
  // layer all come for free.
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

  // Hand focus back to whatever opened the lightbox.
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

  const current = index === null ? null : shots[index];

  return (
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={current.src}
              src={current.src}
              alt=""
              className="max-h-[78dvh] w-auto max-w-full rounded-2xl bg-white object-contain shadow-2xl"
            />
            {(current.vi || current.en) && (
              <figcaption className="max-w-prose text-center text-sm text-paper/90">
                <span data-lang="vi">{current.vi}</span>
                <span data-lang="en">{current.en}</span>
              </figcaption>
            )}
          </figure>

          <div className="relative flex items-center gap-2">
            {shots.length > 1 && (
              <LightboxButton
                onClick={() => step(-1)}
                glyph="‹"
                label={{ vi: "Ảnh trước", en: "Previous image" }}
              />
            )}
            {shots.length > 1 && (
              <span className="min-w-16 text-center text-sm font-semibold tabular-nums text-paper/70">
                {index! + 1} / {shots.length}
              </span>
            )}
            {shots.length > 1 && (
              <LightboxButton
                onClick={() => step(1)}
                glyph="›"
                label={{ vi: "Ảnh tiếp theo", en: "Next image" }}
              />
            )}
            <LightboxButton
              onClick={close}
              glyph="✕"
              label={{ vi: "Đóng", en: "Close" }}
            />
          </div>
        </div>
      )}
    </dialog>
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
        <span data-lang="vi">{label.vi}</span>
        <span data-lang="en">{label.en}</span>
      </span>
    </button>
  );
}
