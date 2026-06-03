import Link from "next/link";
import { getStory, type Rating } from "@/lib/story";
import { getAchievements, getGallery } from "@/lib/content";
import type { L } from "@/lib/schemas";
import { asset } from "@/lib/asset";
import { Localized } from "@/components/Localized";
import { LangToggle } from "@/components/LangToggle";

// This is the home page — metadata is inherited from the root layout so the site
// title / OG stay clean ("Đào Đình Hữu (Tin)").

const RANK: Record<string, number> = { gold: 0, silver: 1, bronze: 2, none: 3 };
const MEDAL_EMOJI: Record<string, string> = {
  gold: "🥇",
  silver: "🥈",
  bronze: "🥉",
  none: "🏅",
};

// Drop the redundant medal / placement prefix so each line reads short; the medal
// emoji already carries that information (handles English + Vietnamese titles).
function shortName(title: string): string {
  return title
    .replace(/^(Gold|Silver|Bronze)\s+Medal\s+—\s+/, "")
    .replace(/^\d+(st|nd|rd|th)\s+Place(\s*\(Team\))?\s+—\s+/, "")
    .replace(/^Huy chương (Vàng|Bạc|Đồng)\s+/, "");
}

function short(t: L): L {
  return { vi: shortName(t.vi), en: shortName(t.en) };
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand">
      {children}
    </p>
  );
}

// A colored, separator-split title that stays bilingual (e.g. Science × Art × Language).
function SplitTitle({
  value,
  sep,
  colors,
}: {
  value: L;
  sep: string;
  colors: string[];
}) {
  const parts = (text: string) =>
    text.split(sep).map((p, i) => (
      <span key={i}>
        {i > 0 && <span className="text-accent">{` ${sep.trim()} `}</span>}
        <span className={colors[i % colors.length]}>{p.trim()}</span>
      </span>
    ));
  return (
    <>
      <span data-lang="vi">{parts(value.vi)}</span>
      <span data-lang="en">{parts(value.en)}</span>
    </>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span
      className="shrink-0 text-lg leading-none tracking-tight"
      aria-label={`${n} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} aria-hidden className={i <= n ? "text-accent" : "text-ink/15"}>
          ★
        </span>
      ))}
    </span>
  );
}

function StarPanel({ items, bg = "bg-cream" }: { items: Rating[]; bg?: string }) {
  return (
    <div
      className={`mx-auto max-w-3xl rounded-3xl border border-black/5 ${bg} p-6 shadow-sm sm:p-8`}
    >
      <div className="grid gap-x-10 gap-y-1 sm:grid-cols-2">
        {items.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 border-b border-black/5 py-3 last:border-0 sm:[&:nth-last-of-type(2)]:border-0"
          >
            <span className="font-display text-base font-semibold text-ink sm:text-lg">
              <Localized value={c.name} />
            </span>
            <Stars n={c.stars} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StoryPage() {
  const s = getStory();
  const c = s.curiosity;
  const achievements = getAchievements();
  const gallery = getGallery();
  const art = gallery.filter((g) => g.src.includes("dino")).slice(0, 4);
  const cats: { key: string; label: L }[] = [
    { key: "international", label: { vi: "Olympic Quốc tế", en: "International Olympiads" } },
    { key: "national", label: { vi: "Olympic Quốc gia", en: "National Olympiads" } },
    { key: "local", label: { vi: "Cấp trường & Thành phố", en: "School & City" } },
  ];
  const tally: [string, L, string][] = [
    ["🥇", { vi: "Vàng", en: "Gold" }, "gold"],
    ["🥈", { vi: "Bạc", en: "Silver" }, "silver"],
    ["🥉", { vi: "Đồng", en: "Bronze" }, "bronze"],
    ["🏅", { vi: "Tổng giải", en: "Honours" }, "all"],
  ];
  // One real-life photo per story beat (nature → reading → drawing → exploring).
  const beatImages: { src: string; alt: string }[] = [
    { src: "/media/life/life-wildflowers.jpg", alt: "Tin observing roadside wildflowers" },
    { src: "/media/life/life-reading-science.jpg", alt: "Tin reading a science book" },
    { src: "/media/dino-sketches.jpg", alt: "Tin’s dinosaur and biology sketches" },
    { src: "/media/life/life-harvest.jpg", alt: "Tin holding a sweet potato from a field trip" },
  ];
  // Photo essay — curiosity in the real world (museums, science halls, the zoo).
  const explore: { src: string; alt: string; caption: L }[] = [
    { src: "/media/life/life-wonder-reptile.jpg", alt: "Tin pointing at a reptile in a vivarium", caption: { vi: "Ồ — đó là con gì vậy?!", en: "Whoa — what is that?!" } },
    { src: "/media/life/life-whale-skeleton.jpg", alt: "Tin in front of a sperm-whale skeleton", caption: { vi: "Đối diện bộ xương cá nhà táng", en: "Eye to eye with a sperm whale" } },
    { src: "/media/life/life-evolution-skulls.jpg", alt: "Tin studying a wall of hominid skulls", caption: { vi: "Lần theo nguồn gốc loài người, từng chiếc sọ", en: "Tracing human origins, skull by skull" } },
    { src: "/media/life/life-microscope.jpg", alt: "Tin looking through a microscope", caption: { vi: "Dưới kính hiển vi — thớ gỗ", en: "Under the microscope — the grain of wood" } },
    { src: "/media/life/life-marlin.jpg", alt: "Tin standing under a mounted blue marlin", caption: { vi: "Con cá cờ xanh, dài hơn cả chiều cao của cậu", en: "A blue marlin, longer than he is tall" } },
    { src: "/media/life/life-snake-touch.jpg", alt: "Tin touching a snake at the zoo", caption: { vi: "Lần đầu chạm vào một con trăn", en: "First time touching a snake" } },
    { src: "/media/life/life-skeletons.jpg", alt: "Tin looking at a human and an ape skeleton", caption: { vi: "Con người và tổ tiên, đứng cạnh nhau", en: "Us and our ancestors, side by side" } },
    { src: "/media/life/life-elephants.jpg", alt: "Tin pointing at elephants at the zoo", caption: { vi: "Ngắm đàn voi ở cự ly gần", en: "Watching the elephants up close" } },
    { src: "/media/life/life-museum-art.jpg", alt: "Tin looking at ink cityscape paintings", caption: { vi: "Đọc một thành phố vẽ bằng mực", en: "Reading a city drawn in ink" } },
  ];
  // Real proud moments behind the medals.
  const awards: { src: string; alt: string }[] = [
    { src: "/media/life/life-award-stage.jpg", alt: "Tin on stage with the Science Star Award" },
    { src: "/media/life/life-award-ceremony.jpg", alt: "Tin holding the Science Star Award at the ceremony" },
    { src: "/media/life/life-award-classroom.jpg", alt: "Tin with his certificate at the class Wall of Fame" },
  ];

  return (
    <main className="bg-cream text-ink">
      {/* version switch */}
      <div className="no-print mx-auto flex max-w-5xl items-center justify-between gap-2 px-6 py-4 text-sm">
        <span className="font-display font-bold text-ink/70">Đào Đình Hữu (Tin)</span>
        <div className="flex items-center gap-2">
          <LangToggle />
          <Link
            href="/profile"
            className="rounded-full border border-brand/20 px-3 py-1.5 font-semibold text-brand transition-colors hover:bg-brand/5"
          >
            <Localized value={{ vi: "Hồ sơ đầy đủ →", en: "Full profile →" }} />
          </Link>
        </div>
      </div>

      {/* HERO */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(55,48,163,0.10), transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-10 text-center sm:pt-16">
          <div className="mb-7 h-28 w-28 overflow-hidden rounded-full shadow-md ring-4 ring-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/media/avatar.jpg")}
              alt="Đào Đình Hữu (Tin)"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] text-ink sm:text-6xl">
            {s.hero.name}
          </h1>
          <p className="mt-5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-display text-xl italic text-brand sm:text-2xl">
            {s.hero.roles.map((r, i) => (
              <span key={i} className="flex items-center gap-2.5">
                {i > 0 && <span className="not-italic text-accent">·</span>}
                <Localized value={r} />
              </span>
            ))}
          </p>
          <p className="mt-4 text-base text-ink/60 sm:text-lg">
            <Localized value={s.hero.subtitle} />
          </p>
          <p className="mt-7 flex flex-wrap items-center justify-center gap-x-3 text-sm font-bold uppercase tracking-[0.25em] text-ink/50">
            {s.hero.motto.map((m, i) => (
              <span key={i} className="flex items-center gap-3">
                {i > 0 && <span className="text-accent">◆</span>}
                <Localized value={m} />
              </span>
            ))}
          </p>
        </div>
      </header>

      {/* WELCOME */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-[680px] text-center">
          <Eyebrow>
            <Localized value={s.welcome.eyebrow} />
          </Eyebrow>
          <p className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            <Localized value={s.welcome.lead} />
          </p>
          <div className="mt-5 space-y-1 text-lg text-ink/55">
            {s.welcome.lines.map((l, i) => (
              <p key={i}>
                <Localized value={l} />
              </p>
            ))}
          </div>
          <p className="mt-8 font-display text-2xl font-medium italic text-brand sm:text-[26px]">
            <Localized value={s.welcome.turn} />
          </p>
          <div className="mt-6 space-y-1 text-lg leading-relaxed text-ink/75">
            {s.welcome.paras.map((p, i) => (
              <p key={i}>
                <Localized value={p} />
              </p>
            ))}
          </div>
        </div>
        {/* childhood — where it all began */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { src: "/media/life/life-dad-shoulders.jpg", alt: "Tin as a toddler on his dad’s shoulders" },
              { src: "/media/life/life-flower-v2.jpg", alt: "Tin as a toddler holding a frangipani flower" },
            ].map((p) => (
              <figure key={p.src} className="overflow-hidden rounded-3xl bg-white shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(p.src)} alt={p.alt} className="aspect-[4/5] w-full object-cover" />
              </figure>
            ))}
          </div>
          <figcaption className="mt-3 text-center text-sm text-ink/50">
            <Localized
              value={{
                vi: "Nơi mọi thứ bắt đầu — một đứa trẻ tò mò, hồn nhiên.",
                en: "Where it all began — a curious, happy child.",
              }}
            />
          </figcaption>
        </div>
      </section>

      {/* THE STORY */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <Eyebrow>
            <Localized value={s.story.eyebrow} />
          </Eyebrow>
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            <Localized value={s.story.title} />
          </h2>
          <div className="space-y-5 text-left text-lg leading-relaxed text-ink/75">
            {s.story.intro.map((p, i) => (
              <p key={i}>
                <Localized value={p} />
              </p>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            {s.story.questions.map((q, i) => (
              <span
                key={i}
                className="rounded-full bg-accent/15 px-4 py-1.5 font-display text-base font-bold italic text-ink/80 sm:text-lg"
              >
                <Localized value={q} />
              </span>
            ))}
          </div>
        </div>
        {/* four beats — editorial, real photos alternating left / right */}
        <div className="mx-auto mt-12 max-w-4xl space-y-12 sm:space-y-16">
          {s.story.beats.map((b, i) => {
            const img = beatImages[i];
            return (
              <div key={i} className="grid items-center gap-6 sm:gap-10 md:grid-cols-2">
                <figure
                  className={`overflow-hidden rounded-3xl bg-white shadow-md ${
                    i % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(img.src)} alt={img.alt} className="aspect-[4/5] w-full object-cover" />
                </figure>
                <div>
                  <span className="font-display text-3xl font-extrabold text-accent">{i + 1}</span>
                  <h3 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
                    <Localized value={b.title} />
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed text-ink/70">
                    <Localized value={b.body} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CORE LEARNING PHILOSOPHY */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>
            <Localized value={s.philosophy.eyebrow} />
          </Eyebrow>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            <SplitTitle
              value={s.philosophy.title}
              sep="→"
              colors={["text-brand", "text-teal", "text-accent"]}
            />
          </h2>
          <p className="mx-auto mt-5 max-w-[620px] text-lg text-ink/70">
            <Localized value={s.philosophy.intro} />
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {s.philosophy.steps.map((st, i) => {
            const tone = ["text-brand", "text-teal", "text-accent"][i];
            return (
              <div
                key={i}
                className="break-avoid rounded-3xl border border-black/5 bg-cream p-6 text-center shadow-sm"
              >
                <p className={`font-display text-2xl font-extrabold ${tone}`}>
                  <Localized value={st.name} />
                </p>
                <p className="mt-2 leading-relaxed text-ink/70">
                  <Localized value={st.through} />
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* UNCOMMON COMBINATION */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>
            <Localized value={s.combination.eyebrow} />
          </Eyebrow>
          <h2 className="font-display text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            <SplitTitle
              value={s.combination.title}
              sep="×"
              colors={["text-brand", "text-teal", "text-ink"]}
            />
          </h2>
          <div className="mx-auto mt-5 max-w-[620px] space-y-1 text-lg text-ink/70">
            {s.combination.intro.map((p, i) => (
              <p key={i}>
                <Localized value={p} />
              </p>
            ))}
          </div>
        </div>
        {/* Venn: where the three domains overlap (diagram labels kept in English) */}
        <figure className="mx-auto mt-10 max-w-md">
          <svg
            viewBox="0 0 440 430"
            className="w-full"
            role="img"
            aria-label="Venn diagram — Science, Art and Language overlap in science illustration"
          >
            <g style={{ mixBlendMode: "multiply" }}>
              <circle cx="220" cy="160" r="122" fill="var(--color-brand)" fillOpacity="0.20" stroke="var(--color-brand)" strokeOpacity="0.55" strokeWidth="1.5" />
              <circle cx="150" cy="280" r="122" fill="var(--color-teal)" fillOpacity="0.20" stroke="var(--color-teal)" strokeOpacity="0.55" strokeWidth="1.5" />
              <circle cx="290" cy="280" r="122" fill="var(--color-ink)" fillOpacity="0.13" stroke="var(--color-ink)" strokeOpacity="0.5" strokeWidth="1.5" />
            </g>
            <g className="font-display" textAnchor="middle">
              <text x="220" y="92" fontSize="24" fontWeight="800" fill="var(--color-brand)">Science</text>
              <text x="220" y="112" fontSize="11.5" fill="var(--color-brand)" opacity="0.75">analyse · understand</text>
              <text x="86" y="316" fontSize="24" fontWeight="800" fill="var(--color-teal)">Art</text>
              <text x="86" y="336" fontSize="11.5" fill="var(--color-teal)" opacity="0.8">observe · visualise</text>
              <text x="356" y="316" fontSize="24" fontWeight="800" fill="var(--color-ink)">Language</text>
              <text x="356" y="336" fontSize="11.5" fill="var(--color-ink)" opacity="0.6">communicate · express</text>
              <text x="220" y="236" fontSize="15" fontWeight="800" fill="var(--color-ink)">Science</text>
              <text x="220" y="255" fontSize="15" fontWeight="800" fill="var(--color-ink)">Illustration</text>
            </g>
          </svg>
          <figcaption className="mt-4 text-center text-sm text-ink/55">
            <Localized
              value={{
                vi: "Nơi cả ba giao nhau — minh hoạ khoa học & truyền thông khoa học.",
                en: "Where the three overlap — science illustration & science communication.",
              }}
            />
          </figcaption>
        </figure>
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          {s.combination.domains.map((d, i) => (
            <div key={i} className="break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-display text-2xl font-bold text-ink">
                <Localized value={d.name} />
              </p>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand">
                <Localized value={d.role} />
              </p>
              <p className="leading-relaxed text-ink/70">
                <Localized value={d.body} />
              </p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-[680px] text-center font-display text-xl font-medium italic text-ink/80">
          <Localized value={s.combination.conclusion} />
        </p>
      </section>

      {/* VISUAL THINKER */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>
            <Localized value={s.visual.eyebrow} />
          </Eyebrow>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            <Localized value={s.visual.title} />
          </h2>
        </div>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 font-display text-lg font-bold text-ink sm:text-xl">
          {s.visual.cycle.map((cy, i) => (
            <span key={i} className="flex items-center gap-3">
              {i > 0 && <span className="text-accent">→</span>}
              <Localized value={cy} />
            </span>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-[680px] text-center text-lg leading-relaxed text-ink/70">
          <Localized value={s.visual.note} />
        </p>
        {art.length > 0 && (
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {art.map((a, i) => (
              <figure key={i} className="break-avoid overflow-hidden rounded-2xl bg-cream shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(a.src)} alt={a.caption.en} className="aspect-square w-full object-cover" />
              </figure>
            ))}
          </div>
        )}
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2">
          {s.visual.reflects.map((r, i) => (
            <span
              key={i}
              className="rounded-full border border-teal/20 bg-teal/8 px-4 py-1.5 text-sm font-semibold text-teal"
            >
              <Localized value={r} />
            </span>
          ))}
        </div>
      </section>

      {/* CURIOSITY IN THE WORLD */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>
            <Localized value={c.eyebrow} />
          </Eyebrow>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            <Localized value={c.title} />
          </h2>
          <div className="mx-auto mt-5 max-w-[640px] space-y-4 text-lg leading-relaxed text-ink/75">
            {c.intro.map((p, i) => (
              <p key={i}>
                <Localized value={p} />
              </p>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
          {c.becomes.map((b, i) => (
            <p
              key={i}
              className="break-avoid rounded-2xl border border-black/5 bg-white px-5 py-4 text-center font-display text-lg text-ink/80 shadow-sm"
            >
              <Localized value={b} />
            </p>
          ))}
        </div>
        <div className="mx-auto mt-7 max-w-[600px] space-y-1 text-center font-display text-xl italic text-brand">
          {c.observing.map((p, i) => (
            <p key={i}>
              <Localized value={p} />
            </p>
          ))}
        </div>

        {/* photo essay */}
        <div className="mx-auto mt-10 max-w-5xl gap-3 [column-fill:_balance] columns-2 sm:columns-3">
          {explore.map((p) => (
            <figure
              key={p.src}
              className="mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(p.src)} alt={p.alt} loading="lazy" className="w-full" />
              <figcaption className="px-3 py-2 text-xs leading-snug text-ink/55">
                <Localized value={p.caption} />
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Seeing science in everyday places */}
        <div className="mx-auto mt-16 max-w-[720px] text-center">
          <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            <Localized value={c.everyday.title} />
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-ink/75">
            <Localized value={c.everyday.intro} />
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {c.everyday.questions.map((q, i) => (
              <span
                key={i}
                className="rounded-full bg-accent/15 px-4 py-1.5 font-display text-base font-bold italic text-ink/80 sm:text-lg"
              >
                <Localized value={q} />
              </span>
            ))}
          </div>
          <p className="mt-6 font-display text-lg font-medium italic text-ink/75">
            <Localized value={c.everyday.close} />
          </p>
        </div>

        {/* Beyond the classroom */}
        <div className="mx-auto mt-16 max-w-[720px] text-center">
          <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            <Localized value={c.beyond.title} />
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-ink/75">
            <Localized value={c.beyond.intro} />
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {c.beyond.places.map((p, i) => (
              <span
                key={i}
                className="rounded-full border border-brand/15 bg-brand/8 px-4 py-1.5 text-sm font-semibold text-brand"
              >
                <Localized value={p} />
              </span>
            ))}
          </div>
          <p className="mt-6 text-ink/65">
            <Localized value={c.beyond.close} />
          </p>
        </div>

        {/* Building a scientific mindset */}
        <div className="mx-auto mt-16 max-w-[720px] text-center">
          <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            <Localized value={c.mindset.title} />
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-ink/75">
            <Localized value={c.mindset.intro} />
          </p>
        </div>
        <div className="mx-auto mt-6 max-w-2xl space-y-2.5">
          {c.mindset.links.map((l, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-2xl border border-black/5 bg-white px-5 py-3 text-center shadow-sm"
            >
              <span className="text-ink/70">
                <Localized value={l.from} />
              </span>
              <span className="text-accent">→</span>
              <span className="font-display text-lg font-bold text-brand">
                <Localized value={l.to} />
              </span>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-[640px] text-center font-display text-lg font-medium italic text-ink/80">
          <Localized value={c.mindset.close} />
        </p>

        {/* What these experiences reveal */}
        <div className="mx-auto mt-16 max-w-[720px] text-center">
          <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            <Localized value={c.reveal.title} />
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-ink/75">
            <Localized value={c.reveal.intro} />
          </p>
        </div>
        <div className="mx-auto mt-6 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.reveal.traits.map((t, i) => (
            <div key={i} className="break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-display text-xl font-bold text-brand">
                <Localized value={t.name} />
              </p>
              <p className="mt-1.5 leading-relaxed text-ink/70">
                <Localized value={t.body} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* GROWTH JOURNEY */}
      <section className="bg-brand px-6 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <Localized value={s.growth.eyebrow} />
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <Localized value={s.growth.title} />
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-white/70">
            <Localized value={s.growth.intro} />
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
          {s.growth.stages.map((st, i) => (
            <div
              key={i}
              className="break-avoid rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-extrabold text-accent">{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
                    <Localized value={st.grade} />
                  </p>
                  <p className="font-display text-xl font-bold">
                    <Localized value={st.theme} />
                  </p>
                </div>
              </div>
              <p className="mt-3 leading-relaxed text-white/80">
                <Localized value={st.body} />
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {st.strengths.map((x, j) => (
                  <span key={j} className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold">
                    <Localized value={x} />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-2 font-display text-base font-bold sm:text-lg">
          {s.growth.pattern.map((p, i) => (
            <span key={i} className="flex items-center gap-3">
              {i > 0 && <span className="text-accent">→</span>}
              <Localized value={p} />
            </span>
          ))}
        </div>
      </section>

      {/* VOICES FROM TEACHERS */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>
            <Localized value={s.teachers.eyebrow} />
          </Eyebrow>
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            <Localized value={s.teachers.title} />
          </h2>
        </div>
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
          {s.teachers.entries.map((e, i) => (
            <div key={i} className="break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                    <Localized value={e.grade} /> · <Localized value={e.label} />
                  </p>
                  <p className="font-display text-lg font-bold text-ink">{e.name}</p>
                  <p className="text-sm text-ink/45">
                    <Localized value={e.role} />
                  </p>
                </div>
              </div>
              <ul className="space-y-2.5 border-l-2 border-accent/40 pl-4">
                {e.quotes.map((q, j) => (
                  <li key={j} className="text-ink/75 italic leading-snug">
                    “<Localized value={q} />”
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.themes.map((t, j) => (
                  <span key={j} className="rounded-full bg-brand/8 px-2.5 py-0.5 text-xs font-semibold text-brand">
                    <Localized value={t} />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-[680px] text-center font-display text-lg font-medium italic text-ink/75">
          <Localized value={s.teachers.consistent} />
        </p>
      </section>

      {/* CORE CAPABILITY MAP */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>
            <Localized value={s.capabilities.eyebrow} />
          </Eyebrow>
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            <Localized value={s.capabilities.title} />
          </h2>
        </div>
        <StarPanel items={s.capabilities.items} bg="bg-cream" />
      </section>

      {/* ACADEMIC EXCELLENCE */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>
            <Localized value={s.academic.eyebrow} />
          </Eyebrow>
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            <Localized value={s.academic.title} />
          </h2>
        </div>
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
          {/* Grade 4 results */}
          <div className="break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand">
              <Localized value={{ vi: "Điểm Lớp 4", en: "Grade 4 results" }} />
            </p>
            <ul className="divide-y divide-black/5">
              {s.academic.grade4.map((g, i) => (
                <li key={i} className="flex items-center justify-between py-2.5">
                  <span className="text-ink/75">
                    <Localized value={g.subject} />
                  </span>
                  <span
                    className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 font-display text-sm font-bold tabular-nums ${
                      g.score === "10" ? "bg-brand text-white" : "bg-accent/20 text-ink"
                    }`}
                  >
                    {g.score}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Strength profile */}
          <div className="break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand">
              <Localized value={{ vi: "Thế mạnh theo môn", en: "Subject strength profile" }} />
            </p>
            <div className="divide-y divide-black/5">
              {s.academic.strengths.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-2.5">
                  <span className="text-ink/75">
                    <Localized value={r.name} />
                  </span>
                  <Stars n={r.stars} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* recognitions */}
        <div className="mx-auto mt-4 grid max-w-4xl gap-4 sm:grid-cols-3">
          <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 text-center shadow-sm">
            <p className="font-display text-3xl font-extrabold text-brand">4×</p>
            <p className="mt-1 font-display font-bold text-ink">
              <Localized value={{ vi: "Học sinh Xuất sắc", en: "Excellent Student" }} />
            </p>
            <p className="mt-1 text-sm text-ink/55">
              <Localized value={s.academic.excellentNote} />
            </p>
          </div>
          <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 text-center shadow-sm">
            <p className="font-display text-3xl font-extrabold text-accent">★</p>
            <p className="mt-1 font-display font-bold text-ink">
              <Localized value={{ vi: "Tinh hoa Khoa học Tự nhiên", en: "Natural Sciences Star" }} />
            </p>
            <p className="mt-1 text-sm text-ink/55">{s.academic.naturalScience.join(" · ")}</p>
          </div>
          <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 text-center shadow-sm">
            <p className="font-display text-3xl font-extrabold text-teal">C</p>
            <p className="mt-1 font-display font-bold text-ink">
              <Localized value={{ vi: "Cambridge — mức cao nhất", en: "Cambridge — top level" }} />
            </p>
            <p className="mt-1 text-sm text-ink/55">
              {s.academic.cambridge.map((x, i) => (
                <span key={i}>
                  {i > 0 && " · "}
                  <Localized value={x} />
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>
            <Localized value={{ vi: "Thành tích & ghi nhận", en: "Achievements & recognition" }} />
          </Eyebrow>
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            <Localized value={{ vi: "Những cột mốc trên hành trình", en: "Milestones along the way" }} />
          </h2>
        </div>
        {/* the proud moments behind the medals */}
        <div className="mx-auto mb-3 grid max-w-4xl grid-cols-3 gap-3">
          {awards.map((p) => (
            <figure key={p.src} className="overflow-hidden rounded-2xl bg-cream shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(p.src)} alt={p.alt} loading="lazy" className="aspect-[3/4] w-full object-cover" />
            </figure>
          ))}
        </div>
        <p className="mx-auto mb-8 max-w-[620px] text-center text-sm text-ink/55">
          <Localized
            value={{
              vi: "Học sinh Xuất sắc & Tinh hoa Khoa học Tự nhiên — được vinh danh tại lớp, trên sân khấu và trong lễ tổng kết năm học.",
              en: "Excellent Student & Natural Sciences Star — celebrated in class, on stage, and at the end-of-year ceremony.",
            }}
          />
        </p>
        {/* medal tally */}
        <div className="mx-auto mb-6 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {tally.map(([emoji, label, key]) => {
            const n =
              key === "all" ? achievements.length : achievements.filter((a) => a.medal === key).length;
            return (
              <div key={key} className="break-avoid rounded-3xl border border-black/5 bg-cream p-5 text-center shadow-sm">
                <p className="text-2xl leading-none" aria-hidden>
                  {emoji}
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold tabular-nums text-ink">{n}</p>
                <p className="text-sm font-semibold text-ink/55">
                  <Localized value={label} />
                </p>
              </div>
            );
          })}
        </div>
        {/* grouped lists — roomy cards */}
        <div className="mx-auto grid max-w-4xl items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map(({ key, label }) => {
            const grp = achievements
              .filter((a) => a.category === key)
              .sort((a, b) => RANK[a.medal] - RANK[b.medal]);
            if (grp.length === 0) return null;
            return (
              <div key={key} className="break-avoid rounded-3xl border border-black/5 bg-cream p-6 shadow-sm">
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-ink">
                    <Localized value={label} />
                  </h3>
                  <span className="text-sm font-semibold tabular-nums text-ink/35">{grp.length}</span>
                </div>
                <ul className="divide-y divide-black/5">
                  {grp.map((a, i) => (
                    <li key={i} className="flex items-baseline gap-3 py-3">
                      <span aria-hidden className="shrink-0 text-base leading-none">
                        {MEDAL_EMOJI[a.medal]}
                      </span>
                      <span className="leading-snug text-ink/80">
                        <Localized value={short(a.title)} />
                      </span>
                      {a.year ? (
                        <span className="ml-auto shrink-0 pl-2 text-sm tabular-nums text-ink/40">{a.year}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* FUTURE DIRECTION */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <Eyebrow>
            <Localized value={s.forward.eyebrow} />
          </Eyebrow>
          <h2 className="mb-6 font-display text-3xl font-bold text-ink sm:text-4xl">
            <SplitTitle
              value={s.forward.title}
              sep="×"
              colors={["text-brand", "text-teal", "text-accent"]}
            />
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-ink/75">
            {s.forward.intro.map((p, i) => (
              <p key={i}>
                <Localized value={p} />
              </p>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {s.forward.projects.map((p, i) => (
              <span
                key={i}
                className="rounded-full border border-brand/15 bg-brand/8 px-4 py-1.5 text-sm font-semibold text-brand"
              >
                <Localized value={p} />
              </span>
            ))}
          </div>
          <p className="mt-8 font-display text-xl font-medium italic text-ink/80">
            <Localized value={s.forward.close} />
          </p>
        </div>
      </section>

      {/* A NOTE HOME — the hand-made thank-you card */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-2">
          <figure className="overflow-hidden rounded-3xl bg-cream shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/media/life/life-card-thankyou.jpg")}
              alt="A hand-made pop-up card that reads ‘Dear Mom and Dad … thank you for supporting me’"
              loading="lazy"
              className="w-full"
            />
          </figure>
          <div>
            <Eyebrow>
              <Localized value={{ vi: "Lời nhắn gửi về nhà", en: "A note home" }} />
            </Eyebrow>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              <Localized
                value={{ vi: "“Cảm ơn bố mẹ đã ủng hộ con”", en: "“Thank you for supporting me”" }}
              />
            </h2>
            <blockquote className="mt-5 space-y-3 border-l-2 border-accent/50 pl-5 text-lg italic leading-relaxed text-ink/75">
              <p>
                <Localized value={{ vi: "Bố mẹ thân yêu,", en: "Dear Mom and Dad," }} />
              </p>
              <p>
                <Localized
                  value={{
                    vi: "Con sắp hoàn thành năm học này rồi — cảm ơn bố mẹ đã chăm sóc con mỗi ngày. Năm nay con rất thích học khoa học với thầy Alasdair và giành được nhiều huy chương.",
                    en: "I am almost finished with this year — thank you for caring for me every day. This year I enjoyed science with Mr. Alasdair and won many medals.",
                  }}
                />
              </p>
              <p>
                <Localized
                  value={{
                    vi: "Con rất tự hào vì đã giành giải Tinh hoa Khoa học lần thứ hai — nhờ có sự giúp đỡ của bố mẹ. Cảm ơn bố mẹ đã luôn ủng hộ con.",
                    en: "I am very proud of myself because I won the Science Star Award for the second time — because of your help. Thank you for supporting me.",
                  }}
                />
              </p>
              <p className="not-italic font-display font-semibold text-ink/80">
                <Localized value={{ vi: "— Con trai của bố mẹ, Đình Hữu", en: "— Your son, Đình Hữu" }} />
              </p>
            </blockquote>
            <p className="mt-5 text-sm text-ink/50">
              <Localized
                value={{
                  vi: "Tấm thiệp pop-up tự làm tặng bố mẹ vào dịp cuối năm học.",
                  en: "A hand-made pop-up card for his parents at the end of the year.",
                }}
              />
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-[680px] space-y-4 text-center text-lg leading-relaxed text-ink/75">
          <p>
            <Localized
              value={{
                vi: "Đằng sau mỗi thành tích là cả một cộng đồng nâng đỡ — những thầy cô khơi nguồn tò mò, những người bạn cùng học, và một gia đình khuyến khích khám phá, đọc sách và học tập suốt đời ngay từ nhỏ.",
                en: "Behind every achievement is a community of support — teachers who inspired curiosity, friends who learned alongside him, and a family that encouraged exploration, reading and lifelong learning from an early age.",
              }}
            />
          </p>
          <p>
            <Localized
              value={{
                vi: "Tấm thiệp này nhắc ta rằng thành tích có thể đo đếm được, nhưng lòng biết ơn, sự tử tế và nhân cách cũng là những phần quan trọng không kém của hành trình.",
                en: "This letter is a reminder that while achievements can be measured, gratitude, kindness and character are equally important parts of the journey.",
              }}
            />
          </p>
        </div>
      </section>

      {/* MOTTO / FINAL */}
      <section className="bg-brand px-6 py-20 text-center text-white sm:py-28">
        <div className="mx-auto max-w-2xl">
          {s.motto.lines.map((l, i) => (
            <p key={i} className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              <Localized value={l} />
            </p>
          ))}
          <div className="mx-auto mt-10 flex max-w-xl flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-sm font-bold uppercase tracking-[0.18em] text-white/70">
            {s.motto.reflection.map((r, i) => (
              <span key={i} className="flex items-center gap-2.5">
                {i > 0 && <span className="text-accent">→</span>}
                <Localized value={r} />
              </span>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl font-display text-lg italic leading-relaxed text-white/85">
            <Localized value={s.motto.statement} />
          </p>
          <div className="no-print mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              data-lang="vi"
              href={asset("/ho-so-nang-luc-vi.pdf")}
              download
              className="rounded-2xl bg-white px-5 py-2.5 font-semibold text-brand shadow-sm transition hover:bg-white/90"
            >
              ⬇ Tải hồ sơ PDF
            </a>
            <a
              data-lang="en"
              href={asset("/ho-so-nang-luc-en.pdf")}
              download
              className="rounded-2xl bg-white px-5 py-2.5 font-semibold text-brand shadow-sm transition hover:bg-white/90"
            >
              ⬇ Download PDF
            </a>
            <Link
              href="/profile"
              className="rounded-2xl border border-white/30 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
            >
              <Localized value={{ vi: "Xem hồ sơ đầy đủ →", en: "See the full profile →" }} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
