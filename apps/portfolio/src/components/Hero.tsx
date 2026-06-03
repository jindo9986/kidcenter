import type { Profile } from "@/lib/schemas";
import { Localized } from "./Localized";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="mb-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
      <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-5xl shadow-sm">
        {/* Avatar image with graceful fallback to broken-image alt text.
            Uses <img> (not next/image) to stay fully offline/file-based. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatar}
          alt={profile.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-brand">Portfolio</p>
        <h1 className="font-display text-4xl font-extrabold text-ink">
          {profile.name}
        </h1>
        <p className="mt-1 text-ink/60">
          {profile.age} <span data-lang="vi">tuổi</span>
          <span data-lang="en">years old</span> ·{" "}
          <Localized value={profile.tagline} />
        </p>
      </div>
    </section>
  );
}
