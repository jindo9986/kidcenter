import type { MediaItem } from "@/lib/schemas";
import { asset } from "@/lib/asset";
import { Localized } from "./Localized";
import { ZoomButton } from "./ZoomButton";

/** A masonry wall of photos at their natural aspect ratio.
 *
 *  Unlike `Gallery`, nothing is square-cropped — use this when the set mixes
 *  portrait and landscape and cropping would cut the subject (a finish-line
 *  banner, a podium, a full-body shot). Clicking a photo opens the site-wide
 *  lightbox; `group` scopes its prev/next set. */
export function PhotoWall({
  items,
  group,
}: {
  items: MediaItem[];
  group: string;
}) {
  return (
    <div className="gap-3 [column-fill:_balance] columns-1 sm:columns-2">
      {items.map((item) => (
        <figure
          key={item.src}
          className="mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm"
        >
          <ZoomButton src={item.src} caption={item.caption} group={group}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(item.src)}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full transition-transform duration-200 ease-out group-hover:scale-[1.02]"
            />
          </ZoomButton>
          <figcaption className="px-3 py-2 text-center text-xs leading-snug text-ink/60">
            <Localized value={item.caption} />
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
