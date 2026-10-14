import type { ReactNode } from "react";
import type { L } from "@/lib/schemas";
import { asset } from "@/lib/asset";
import { Localized } from "./Localized";

/** Wraps an image so clicking it opens the site-wide `Lightbox`.
 *
 *  Deliberately NOT a client component: it only emits a button carrying
 *  `data-zoom*`, which the single delegated `Lightbox` picks up. That keeps
 *  every page that shows photos a server component.
 *
 *  `group` scopes prev/next — images sharing a group are navigated together,
 *  in DOM order. Use one group per visual cluster (a photo wall, a grid), not
 *  one per page, so the arrows stay meaningful. */
export function ZoomButton({
  src,
  caption,
  group,
  className,
  children,
}: {
  src: string;
  caption?: L;
  group: string;
  className?: string;
  children: ReactNode;
}) {
  const url = asset(src);
  return (
    <button
      type="button"
      data-zoom
      data-zoom-group={group}
      data-zoom-src={url}
      data-zoom-vi={caption?.vi}
      data-zoom-en={caption?.en}
      className={`group block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${className ?? ""}`}
    >
      <span className="sr-only">
        <Localized
          value={{
            vi: caption ? `Xem ảnh lớn: ${caption.vi}` : "Xem ảnh lớn",
            en: caption ? `View larger: ${caption.en}` : "View larger",
          }}
        />
      </span>
      {children}
    </button>
  );
}
