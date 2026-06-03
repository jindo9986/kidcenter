import type { Profile } from "@/lib/schemas";
import { computeAge, formatDateDMY } from "@/lib/date";
import { asset } from "@/lib/asset";
import { Localized } from "./Localized";

export function Hero({ profile }: { profile: Profile }) {
  const age = computeAge(profile.birthDate);
  const dob = formatDateDMY(profile.birthDate);
  const displayName = profile.nickname
    ? `${profile.name} (${profile.nickname})`
    : profile.name;

  // Faint indigo graph-paper texture over warm paper (DESIGN.md hero treatment).
  const graphPaper =
    "linear-gradient(0deg, rgba(255,253,247,.55), rgba(255,253,247,.55))," +
    "repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(55,48,163,.06) 24px)," +
    "repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(55,48,163,.06) 24px)";

  return (
    <section
      className="mb-10 flex flex-col items-center gap-5 rounded-[28px] border border-brand/10 p-6 text-center sm:flex-row sm:p-7 sm:text-left"
      style={{ background: graphPaper }}
    >
      <div
        className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full text-6xl shadow-sm ring-4 ring-white"
        style={{
          background: "radial-gradient(circle at 30% 30%, #fde68a, var(--color-accent))",
        }}
      >
        {/* Avatar image with graceful fallback to alt text. Uses <img> (not
            next/image) to stay fully offline/file-based. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(profile.avatar)}
          alt={profile.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          Portfolio
        </p>
        <h1 className="font-display text-4xl font-extrabold text-ink">
          {displayName}
        </h1>
        <p className="mt-1 text-ink/60">
          {age} <span data-lang="vi">tuổi</span>
          <span data-lang="en">years old</span> ·{" "}
          <span data-lang="vi">Sinh {dob}</span>
          <span data-lang="en">Born {dob}</span>
        </p>
        <p className="mt-0.5 font-medium text-ink/80">
          🏫 <Localized value={profile.school} />
        </p>
        <p className="mt-1 text-ink/60">
          <Localized value={profile.tagline} />
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
          {profile.focus.map((f, i) => (
            <span
              key={i}
              className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white"
            >
              <Localized value={f} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
