import type { MediaItem } from "@/lib/schemas";
import { Localized } from "./Localized";

export function Gallery({ items }: { items: MediaItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item, i) => (
        <figure
          key={i}
          className="break-avoid overflow-hidden rounded-2xl bg-white shadow-sm"
        >
          {item.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.src}
              alt=""
              className="aspect-square w-full object-cover"
            />
          ) : (
            <video
              src={item.src}
              controls
              className="aspect-square w-full object-cover"
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
