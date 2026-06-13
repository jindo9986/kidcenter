import type { Metadata } from "next";
import Link from "next/link";
import { getAchievements } from "@/lib/content";
import type { L } from "@/lib/schemas";
import { asset } from "@/lib/asset";
import { Localized } from "@/components/Localized";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Hi, I'm Tin — Đào Đình Hữu",
  description:
    "A self-introduction by Đào Đình Hữu (Tin): a curious learner who observes, investigates and tries to understand the world — through science, reading, drawing and maths.",
};

const en = (v: L) => v.en;

/* faint indigo graph-paper texture (DESIGN.md hero treatment) */
const graphPaper =
  "linear-gradient(0deg, rgba(255,253,247,.6), rgba(255,253,247,.6))," +
  "repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(55,48,163,.06) 24px)," +
  "repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(55,48,163,.06) 24px)";

/* ---------- building blocks (Editorial Warm, mirrors story/assessment) ---------- */

function SectionHead({ eyebrow, title, paras }: { eyebrow: L; title: L; paras?: L[] }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand">
        <Localized value={eyebrow} />
      </p>
      <h2 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
        <Localized value={title} />
      </h2>
      {paras && (
        <div className="mx-auto mt-5 max-w-[640px] space-y-4 text-lg leading-relaxed text-ink/75">
          {paras.map((p, i) => (
            <p key={i}>
              <Localized value={p} />
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function Chips({ items, italic = false }: { items: L[]; italic?: boolean }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2.5">
      {items.map((q, i) => (
        <span
          key={i}
          className={
            "rounded-full bg-accent/15 px-4 py-1.5 font-display text-base font-bold text-ink/80 " +
            (italic ? "italic" : "")
          }
        >
          <Localized value={q} />
        </span>
      ))}
    </div>
  );
}

function FlowChain({ items, dark = false }: { items: L[]; dark?: boolean }) {
  return (
    <div
      className={
        "mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-2 font-display text-xl font-bold sm:text-2xl " +
        (dark ? "text-white" : "text-ink")
      }
    >
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-3">
          {i > 0 && <span className="text-accent">→</span>}
          <span className={i === items.length - 1 ? "text-accent" : undefined}>
            <Localized value={it} />
          </span>
        </span>
      ))}
    </div>
  );
}

function PhotoMasonry({ photos }: { photos: { src: string; alt: string; caption: L }[] }) {
  return (
    <div className="mx-auto mt-10 max-w-5xl gap-3 [column-fill:_balance] columns-2 sm:columns-3">
      {photos.map((p) => (
        <figure key={p.src} className="mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(p.src)} alt={p.alt} loading="lazy" className="w-full" />
          <figcaption className="px-3 py-2 text-xs leading-snug text-ink/55">
            <Localized value={p.caption} />
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ---------- content (bilingual) ---------- */

const QUESTIONS: L[] = [
  { vi: "Sao nó trông như vậy?", en: "Why does it look like that?" },
  { vi: "Nó hoạt động thế nào?", en: "How does it work?" },
  { vi: "Trước đó đã xảy ra chuyện gì?", en: "What happened before?" },
  { vi: "Sẽ ra sao nếu thay đổi điều gì đó?", en: "What would happen if something changed?" },
];

const DOMAINS: { icon: string; name: L; body: L }[] = [
  {
    icon: "🔬",
    name: { vi: "Khoa học", en: "Science" },
    body: { vi: "giúp mình hiểu thế giới vận hành ra sao", en: "helps me understand how the world works" },
  },
  {
    icon: "🏛️",
    name: { vi: "Lịch sử", en: "History" },
    body: { vi: "giúp mình hiểu mọi thứ đã đổi thay thế nào theo thời gian", en: "helps me understand how things changed over time" },
  },
  {
    icon: "💻",
    name: { vi: "Công nghệ", en: "Technology" },
    body: { vi: "cho mình thấy ý tưởng có thể trở thành hiện thực", en: "shows me how ideas can become real" },
  },
  {
    icon: "📚",
    name: { vi: "Đọc sách", en: "Reading" },
    body: { vi: "giúp mình khám phá tất cả những điều đó", en: "helps me explore all of them" },
  },
];

const TEACHER_WORDS: L[] = [
  { vi: "Tò mò", en: "Curious" },
  { vi: "Tự chủ", en: "Independent" },
  { vi: "Chu đáo", en: "Thoughtful" },
  { vi: "Ham học", en: "Eager to learn" },
];

const THREE_WORDS: L[] = [
  { vi: "Quan sát", en: "Observe" },
  { vi: "Tìm tòi", en: "Investigate" },
  { vi: "Thấu hiểu", en: "Understand" },
];

const observePhotos: { src: string; alt: string; caption: L }[] = [
  { src: "/media/life/life-wonder-reptile.jpg", alt: "Pointing at a reptile", caption: { vi: "Ồ — đó là con gì vậy?!", en: "Whoa — what is that?!" } },
  { src: "/media/life/life-microscope.jpg", alt: "Looking through a microscope", caption: { vi: "Dưới kính hiển vi — thớ gỗ", en: "Under the microscope — the grain of wood" } },
  { src: "/media/life/life-whale-skeleton.jpg", alt: "In front of a sperm-whale skeleton", caption: { vi: "Đối diện bộ xương cá nhà táng", en: "Eye to eye with a sperm whale" } },
  { src: "/media/life/life-evolution-skulls.jpg", alt: "Studying a wall of hominid skulls", caption: { vi: "Lần theo nguồn gốc loài người, từng chiếc sọ", en: "Tracing human origins, skull by skull" } },
  { src: "/media/life/life-marlin.jpg", alt: "Under a mounted blue marlin", caption: { vi: "Con cá cờ xanh, dài hơn cả chiều cao của mình", en: "A blue marlin, longer than I am tall" } },
  { src: "/media/life/life-snake-touch.jpg", alt: "Touching a snake at the zoo", caption: { vi: "Lần đầu chạm vào một con trăn", en: "First time touching a snake" } },
];

const dinoPhotos: { src: string; alt: string; caption: L }[] = [
  { src: "/media/dino-trex.jpg", alt: "Drawing of a T-rex", caption: { vi: "Vẽ để nhìn kỹ hơn", en: "Drawing to look more closely" } },
  { src: "/media/dino-head.jpg", alt: "Drawing of a dinosaur head", caption: { vi: "Từng chi tiết một", en: "Detail by detail" } },
  { src: "/media/dino-trex-grid.jpg", alt: "Grid study of a T-rex", caption: { vi: "Dựng hình theo lưới tỉ lệ", en: "Building it up on a grid" } },
  { src: "/media/dino-sketches.jpg", alt: "Sketchbook of dinosaur and biology drawings", caption: { vi: "Một trang trong sổ ký hoạ", en: "A page from the sketchbook" } },
];

const awardPhotos = [
  { src: "/media/life/life-award-stage.jpg", alt: "On stage with the Science Star Award" },
  { src: "/media/life/life-award-ceremony.jpg", alt: "Holding the Science Star Award at the ceremony" },
  { src: "/media/life/life-award-classroom.jpg", alt: "With his certificate at the class Wall of Fame" },
];

/* ---------- page ---------- */

export default function IntroPage() {
  const achievements = getAchievements();
  const medal = (k: string) => achievements.filter((a) => a.medal === k).length;
  const tally: [string, L, number][] = [
    ["🥇", { vi: "Vàng", en: "Gold" }, medal("gold")],
    ["🥈", { vi: "Bạc", en: "Silver" }, medal("silver")],
    ["🥉", { vi: "Đồng", en: "Bronze" }, medal("bronze")],
    ["🏅", { vi: "Tổng giải", en: "Honours" }, achievements.length],
  ];

  return (
    <main className="bg-cream text-ink">
      <SiteNav />

      {/* HERO */}
      <header className="relative overflow-hidden border-b border-brand/10" style={{ background: graphPaper }}>
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-16 pt-8 text-center">
          <div className="mb-6 h-44 w-44 overflow-hidden rounded-full shadow-md ring-4 ring-white sm:h-56 sm:w-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/media/life/life-harvest.jpg")} alt="Đào Đình Hữu (Tin)" className="h-full w-full object-cover" />
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand">
            <Localized value={{ vi: "Xin chào", en: "Hello" }} />
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] text-ink sm:text-6xl">
            <Localized value={{ vi: "Chào, mình là Tin.", en: "Hi, I'm Tin." }} />
          </h1>
          <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-ink/70 sm:text-xl">
            <Localized
              value={{
                vi: "Mình là Đào Đình Hữu, nhưng mọi người đều gọi là Tin. Mình thích đặt câu hỏi — đôi khi rất nhiều. Khi thấy điều gì thú vị, mình thường muốn biết thêm về nó.",
                en: "My name is Đào Đình Hữu, but everyone calls me Tin. I like asking questions — sometimes a lot of them. When I see something interesting, I usually want to know more about it.",
              }}
            />
          </p>
          <div className="mt-6">
            <Chips items={QUESTIONS} italic />
          </div>
        </div>
      </header>

      {/* QUESTIONS → INTERESTS */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Mọi thứ bắt đầu từ câu hỏi", en: "It all starts with a question" }}
          title={{ vi: "Nhiều điều mình thích học đều khởi đầu như thế", en: "Many things I love learning started this way" }}
          paras={[
            {
              vi: "Một hoá thạch khủng long khiến mình tự hỏi thế giới hàng triệu năm trước trông ra sao. Một con vật khiến mình tò mò nó sinh tồn thế nào trong tự nhiên. Một thí nghiệm khoa học khiến mình muốn biết vì sao lại ra kết quả đó.",
              en: "A dinosaur fossil makes me wonder what the world looked like millions of years ago. An animal makes me curious about how it survives in nature. A science experiment makes me want to know why the result happened.",
            },
            {
              vi: "Thậm chí một vật bình thường cũng có thể khiến mình dừng lại và suy nghĩ.",
              en: "Even an ordinary object can make me stop and think.",
            },
          ]}
        />
      </section>

      {/* OBSERVING */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Mình quan sát rất nhiều", en: "I observe a lot" }}
          title={{ vi: "Nhìn thật kỹ vào từng chi tiết", en: "Looking closely at the details" }}
          paras={[
            {
              vi: "Khi đến bảo tàng, sở thú, thuỷ cung, trung tâm khoa học hay triển lãm, mình thường ở lại lâu hơn dự định, vì cứ liên tục phát hiện điều mới để ý.",
              en: "At museums, zoos, aquariums, science centres or exhibitions, I often stay longer than expected, because I keep finding new things to notice.",
            },
            {
              vi: "Có khi mình tìm ra một điều thú vị. Có khi lại tìm ra… thêm thật nhiều câu hỏi.",
              en: "Sometimes I discover something interesting. Sometimes I discover… even more questions.",
            },
          ]}
        />
        <PhotoMasonry photos={observePhotos} />
      </section>

      {/* CONNECTED WORLD */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Càng học càng thấy kết nối", en: "The more I learn, the more it connects" }}
          title={{ vi: "Một thế giới gắn kết với nhau", en: "A connected world" }}
          paras={[
            {
              vi: "Mình thích học về khoa học, động vật, khủng long, lịch sử, công nghệ và thiên nhiên. Càng học, mình càng thấy mọi thứ liên kết với nhau.",
              en: "I enjoy learning about science, animals, dinosaurs, history, technology and nature. The more I learn, the more connected everything seems.",
            },
          ]}
        />
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
          {DOMAINS.map((d, i) => (
            <div key={i} className="break-avoid rounded-3xl border border-black/5 bg-cream p-6 shadow-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl" aria-hidden>
                  {d.icon}
                </span>
                <p className="font-display text-xl font-bold text-ink">
                  <Localized value={d.name} />
                </p>
              </div>
              <p className="mt-1.5 leading-relaxed text-ink/70">
                <Localized value={d.body} />
              </p>
            </div>
          ))}
        </div>
        {/* reading */}
        <div className="mx-auto mt-10 grid max-w-3xl items-center gap-6 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-3xl bg-cream shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/media/life/life-reading-science.jpg")} alt="Reading a science book" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </figure>
          <p className="font-display text-lg italic leading-relaxed text-ink/80">
            <Localized
              value={{
                vi: "Sách là một trong những cách học mình thích nhất. Đọc xong một chủ đề, mình lại muốn tìm hiểu thêm — có khi một câu trả lời mở ra ba câu hỏi mới.",
                en: "Books are one of my favourite ways to learn. Finishing one topic, I want to learn even more — sometimes one answer leads to three new questions.",
              }}
            />
          </p>
        </div>
      </section>

      {/* DRAWING */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Vẽ cũng là cách học", en: "Drawing is also how I learn" }}
          title={{ vi: "Vẽ là một cách để chú ý", en: "Drawing is a way of paying attention" }}
          paras={[
            {
              vi: "Nhiều người nghĩ vẽ chỉ là nghệ thuật. Với mình, vẽ còn là cách để chú ý. Khi vẽ một con vật, một con khủng long, hay thứ mình đang tìm hiểu, mình bắt đầu nhận ra những chi tiết trước đó không thấy.",
              en: "Many people think drawing is only about art. For me, drawing is also a way of paying attention. When I draw an animal, a dinosaur, or something I'm studying, I start noticing details I didn't see before.",
            },
            {
              vi: "Mình nhìn kỹ hơn, so sánh hình dạng và cấu trúc, và cố hiểu các phần ghép với nhau ra sao. Nhiều khi mình hiểu rõ một điều hơn hẳn sau khi vẽ nó — nên nhiều bức vẽ của mình bắt đầu từ quan sát.",
              en: "I look more carefully, compare shapes and structures, and try to understand how the parts fit together. Often I understand something far better after I draw it — so many of my drawings begin with observation.",
            },
          ]}
        />
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {dinoPhotos.map((p) => (
            <figure key={p.src} className="break-avoid overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(p.src)} alt={p.alt} loading="lazy" className="aspect-square w-full object-cover" />
              <figcaption className="px-2.5 py-1.5 text-[11px] leading-snug text-ink/55">
                <Localized value={p.caption} />
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* MATHS */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Và mình thích Toán", en: "And I enjoy maths" }}
          title={{ vi: "Niềm vui ở quá trình mày mò", en: "The joy is in figuring it out" }}
          paras={[
            {
              vi: "Mình thích tìm quy luật, giải bài toán, và khám phá nhiều cách khác nhau để ra đáp án. Có những bài khó mất rất lâu, nhưng mình thích chính quá trình mày mò tìm ra lời giải.",
              en: "I like finding patterns, solving problems, and discovering different ways to reach an answer. Some hard problems take a long time, but I enjoy the process of figuring them out.",
            },
          ]}
        />
      </section>

      {/* AWARDS */}
      <section className="bg-brand px-6 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <Localized value={{ vi: "Một vài cột mốc", en: "A few milestones" }} />
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <Localized value={{ vi: "Vui nhất là học được điều mới", en: "The best part is learning something new" }} />
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-white/75">
            <Localized
              value={{
                vi: "Những năm qua mình may mắn nhận được một số giải thưởng học thuật, trong đó có các cuộc thi khoa học và toán học. Những thành tích ấy khiến mình vui — nhưng điều mình thích nhất là học được điều gì đó mới trên hành trình.",
                en: "Over the years I've been fortunate to receive several academic awards, including recognition in science and mathematics competitions. These achievements make me happy — but what I enjoy most is learning something new along the way.",
              }}
            />
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-3 gap-3">
          {awardPhotos.map((p) => (
            <figure key={p.src} className="overflow-hidden rounded-2xl bg-white/10 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(p.src)} alt={p.alt} loading="lazy" className="aspect-[3/4] w-full object-cover" />
            </figure>
          ))}
        </div>
        <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {tally.map(([emoji, label, n]) => (
            <div key={en(label)} className="break-avoid rounded-3xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-sm">
              <p className="text-2xl leading-none" aria-hidden>
                {emoji}
              </p>
              <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">{n}</p>
              <p className="text-sm font-semibold text-white/70">
                <Localized value={label} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TEACHERS */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Thầy cô nói về mình", en: "What my teachers say" }}
          title={{ vi: "“Tò mò” có lẽ là từ hợp với mình nhất", en: "“Curious” is probably the word that fits me best" }}
          paras={[
            {
              vi: "Thầy cô thường nhận xét mình tò mò, tự chủ, chu đáo và ham học. Mình nghĩ “tò mò” có lẽ là từ mô tả mình đúng nhất.",
              en: "My teachers often describe me as curious, independent, thoughtful and eager to learn. I think “curious” is probably the word that describes me best.",
            },
          ]}
        />
        <div className="mt-7">
          <Chips items={TEACHER_WORDS} />
        </div>
      </section>

      {/* THE PATH — three words */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Nhìn lại", en: "Looking back" }}
          title={{ vi: "Mọi điều mình thích đều đi theo một lối", en: "The things I love follow the same path" }}
          paras={[
            {
              vi: "Đầu tiên, mình để ý một điều gì đó. Rồi mình đặt câu hỏi về nó. Sau đó mình tìm tòi và khám phá thêm. Cuối cùng, mình hiểu được điều mà trước đây mình chưa hiểu.",
              en: "First, I notice something. Then I ask questions about it. After that, I investigate and learn more. Finally, I understand something I didn't understand before.",
            },
          ]}
        />
        <p className="mx-auto mt-8 max-w-[640px] text-center text-lg text-ink/60">
          <Localized value={{ vi: "Nếu gói hành trình học của mình trong ba từ:", en: "If I had to describe my learning journey in three words:" }} />
        </p>
        <div className="mt-4">
          <FlowChain items={THREE_WORDS} />
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-brand px-6 py-20 text-center text-white sm:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            <Localized
              value={{
                vi: "Vẫn còn rất nhiều điều mình chưa biết. Và đó chính là điều khiến việc học trở nên thú vị.",
                en: "There is still so much I don't know yet. That's what makes learning exciting.",
              }}
            />
          </p>
          <p className="mx-auto mt-6 max-w-xl font-display text-xl italic text-white/90">
            <Localized
              value={{
                vi: "Mỗi câu trả lời lại như khởi đầu của một câu hỏi mới.",
                en: "Every answer feels like the beginning of another question.",
              }}
            />
          </p>
          <div className="no-print mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/profile"
              className="rounded-2xl bg-white px-5 py-2.5 font-semibold text-brand shadow-sm transition hover:bg-white/90"
            >
              <Localized value={{ vi: "Xem hồ sơ học tập →", en: "See my learning profile →" }} />
            </Link>
            <Link
              href="/assessment"
              className="rounded-2xl border border-white/30 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
            >
              <Localized value={{ vi: "Bản đánh giá độc lập →", en: "Independent assessment →" }} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
