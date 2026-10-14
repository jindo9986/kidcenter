import type { GalleryGroup, L, MediaItem } from "@/lib/schemas";
import { asset } from "@/lib/asset";
import { Localized } from "./Localized";
import { ZoomButton } from "./ZoomButton";

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

/** Gallery grouped by subject. The grid square-crops thumbnails; clicking one
 *  opens the site-wide lightbox, which shows the whole image.
 *
 *  Every tile shares one zoom group, so prev/next walks the entire gallery in
 *  display order rather than trapping the viewer inside a subject. */
export function Gallery({ items }: { items: MediaItem[] }) {
  const buckets = GROUP_ORDER.map((key) => ({
    key,
    items: items.filter((i) => i.group === key),
  })).filter((b) => b.items.length > 0);
  const ungrouped = items.filter((i) => !i.group);

  return (
    <div className="grid gap-5">
      {buckets.map((b) => (
        <section key={b.key} className="break-avoid">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-ink">
              <Localized value={GROUP_LABEL[b.key]} />
            </h3>
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand">
              {b.items.length}
            </span>
          </div>
          <Grid items={b.items} />
        </section>
      ))}
      {ungrouped.length > 0 && <Grid items={ungrouped} />}
    </div>
  );
}

function Grid({ items }: { items: MediaItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <figure
          key={item.src}
          className="break-avoid overflow-hidden rounded-2xl bg-white shadow-sm"
        >
          {item.type === "image" ? (
            <ZoomButton src={item.src} caption={item.caption} group="gallery">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(item.src)}
                alt=""
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
              />
            </ZoomButton>
          ) : (
            <video
              src={asset(item.src)}
              className="aspect-square w-full object-cover"
              controls
              playsInline
              preload="metadata"
            />
          )}
          <figcaption className="p-2 text-center text-xs text-ink/60">
            <Localized value={item.caption} />
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
