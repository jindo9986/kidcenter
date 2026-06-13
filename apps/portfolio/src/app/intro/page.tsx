import type { Metadata } from "next";
import Link from "next/link";
import { getAchievements } from "@/lib/content";
import type { L } from "@/lib/schemas";
import { asset } from "@/lib/asset";
import { Localized } from "@/components/Localized";
import { LangToggle } from "@/components/LangToggle";

export const metadata: Metadata = {
  title: "Hi, I'm Tin — Đào Đình Hữu",
  description:
    "A self-introduction by Đào Đình Hữu (Tin): a curious learner who loves understanding how things work — through observation, science, drawing and reading.",
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
        "mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-2 font-display text-lg font-bold sm:text-xl " +
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
  { vi: "Tại sao điều đó xảy ra?", en: "Why does it happen?" },
  { vi: "Nó vận hành thế nào?", en: "How does it work?" },
  { vi: "Sẽ ra sao nếu thay đổi điều gì đó?", en: "What would happen if something changed?" },
];

const TOPICS: L[] = [
  { vi: "Thiên nhiên", en: "Nature" },
  { vi: "Động vật", en: "Animals" },
  { vi: "Khủng long", en: "Dinosaurs" },
  { vi: "Khoa học", en: "Science" },
  { vi: "Công nghệ", en: "Technology" },
  { vi: "Lịch sử", en: "History" },
];

const INTEREST_LINKS: { from: L; to: L }[] = [
  { from: { vi: "Yêu thích động vật", en: "My interest in animals" }, to: { vi: "Sinh học", en: "Biology" } },
  { from: { vi: "Tò mò về hoá thạch", en: "My interest in fossils" }, to: { vi: "Khủng long & sự sống tiền sử", en: "Dinosaurs & prehistoric life" } },
  { from: { vi: "Thích quan sát", en: "My interest in observation" }, to: { vi: "Vẽ", en: "Drawing" } },
  { from: { vi: "Khát khao thấu hiểu", en: "My interest in understanding" }, to: { vi: "Khoa học", en: "Science" } },
];

const TEACHER_WORDS: L[] = [
  { vi: "Tò mò", en: "Curious" },
  { vi: "Tự chủ", en: "Independent" },
  { vi: "Trách nhiệm", en: "Responsible" },
  { vi: "Chu đáo", en: "Thoughtful" },
  { vi: "Sẵn sàng giúp đỡ", en: "Willing to help" },
  { vi: "Tố chất lãnh đạo", en: "Leadership" },
];

const STEPS: L[] = [
  { vi: "Quan sát", en: "Observe" },
  { vi: "Thấu hiểu", en: "Understand" },
  { vi: "Diễn giải", en: "Explain" },
];

const TRIAD: { name: string; body: L; tone: string }[] = [
  { name: "Science", body: { vi: "giúp mình thấu hiểu", en: "helps me understand" }, tone: "text-brand" },
  { name: "Art", body: { vi: "giúp mình hình dung", en: "helps me visualise" }, tone: "text-teal" },
  { name: "Language", body: { vi: "giúp mình truyền đạt", en: "helps me communicate" }, tone: "text-ink" },
];

const observePhotos: { src: string; alt: string; caption: L }[] = [
  { src: "/media/life/life-microscope.jpg", alt: "Looking through a microscope", caption: { vi: "Dưới kính hiển vi — thớ gỗ", en: "Under the microscope — the grain of wood" } },
  { src: "/media/life/life-evolution-skulls.jpg", alt: "Studying a wall of hominid skulls", caption: { vi: "Lần theo nguồn gốc loài người, từng chiếc sọ", en: "Tracing human origins, skull by skull" } },
  { src: "/media/life/life-whale-skeleton.jpg", alt: "In front of a sperm-whale skeleton", caption: { vi: "Đối diện bộ xương cá nhà táng", en: "Eye to eye with a sperm whale" } },
  { src: "/media/life/life-wonder-reptile.jpg", alt: "Pointing at a reptile", caption: { vi: "Ồ — đó là con gì vậy?!", en: "Whoa — what is that?!" } },
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
      {/* top bar */}
      <div className="no-print mx-auto flex max-w-5xl items-center justify-between gap-2 px-6 py-4 text-sm">
        <span className="font-display font-bold text-ink/70">
          <Localized value={{ vi: "Tự giới thiệu", en: "A self-introduction" }} />
        </span>
        <div className="flex items-center gap-2">
          <LangToggle />
          <Link
            href="/"
            className="rounded-full border border-brand/20 px-3 py-1.5 font-semibold text-brand transition-colors hover:bg-brand/5"
          >
            <Localized value={{ vi: "← Câu chuyện", en: "← Story" }} />
          </Link>
        </div>
      </div>

      {/* HERO */}
      <header className="relative overflow-hidden border-b border-brand/10" style={{ background: graphPaper }}>
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-16 pt-8 text-center">
          <div className="mb-6 h-28 w-28 overflow-hidden rounded-full shadow-md ring-4 ring-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/media/avatar.jpg")} alt="Đào Đình Hữu (Tin)" className="h-full w-full object-cover" />
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
                vi: "Tên mình là Đào Đình Hữu, mọi người thường gọi là Tin. Nếu phải mô tả bản thân trong một câu, mình sẽ nói: mình thực sự thích hiểu xem mọi thứ vận hành ra sao.",
                en: "My name is Đào Đình Hữu, and most people call me Tin. If I had to describe myself in one sentence, I'd say I really enjoy understanding how things work.",
              }}
            />
          </p>
          <p className="mt-6 text-base text-ink/60">
            <Localized
              value={{
                vi: "Khi thấy điều gì thú vị, mình thường bắt đầu bằng cách đặt câu hỏi:",
                en: "When I see something interesting, I usually start by asking questions:",
              }}
            />
          </p>
          <div className="mt-4">
            <Chips items={QUESTIONS} italic />
          </div>
        </div>
      </header>

      {/* CURIOSITY */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Từ khi còn rất nhỏ", en: "For as long as I can remember" }}
          title={{ vi: "Mình luôn tò mò về thế giới", en: "I've always been curious about the world" }}
          paras={[
            {
              vi: "Những câu hỏi của mình đôi khi đến từ một cuốn sách khoa học. Đôi khi từ một chuyến thăm bảo tàng, một bộ phim tài liệu, một hoá thạch, một con vật, một bức vẽ — hay thậm chí từ điều gì đó mình tình cờ để ý trong ngày.",
              en: "Sometimes my questions come from a science book. Sometimes from a museum visit, a documentary, a fossil, an animal, a drawing — or even something I notice during an ordinary day.",
            },
            {
              vi: "Mình thích học điều mới, nhưng còn thích hơn việc thật sự hiểu chúng.",
              en: "I enjoy learning new things, but I enjoy understanding them even more.",
            },
          ]}
        />
        <div className="mt-7">
          <Chips items={TOPICS} />
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:gap-4">
          {[
            { src: "/media/life/life-dad-shoulders.jpg", alt: "Tin as a toddler on his dad's shoulders" },
            { src: "/media/life/life-flower-v2.jpg", alt: "Tin as a toddler holding a flower" },
          ].map((p) => (
            <figure key={p.src} className="overflow-hidden rounded-3xl bg-cream shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(p.src)} alt={p.alt} className="aspect-[4/5] w-full object-cover" />
            </figure>
          ))}
        </div>
      </section>

      {/* OBSERVING */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Cách mình học tốt nhất", en: "One of the ways I learn best" }}
          title={{ vi: "Mình học bằng cách quan sát", en: "I learn by observing" }}
          paras={[
            {
              vi: "Mình thích để ý những chi tiết mà người khác có thể bỏ qua. Ở bảo tàng, trung tâm khoa học, sở thú hay thuỷ cung, mình thường dành rất lâu để nhìn thật kỹ và đặt câu hỏi.",
              en: "I like paying attention to details that other people might miss. At museums, science centres, zoos and aquariums, I often spend a long time looking closely and asking questions.",
            },
            {
              vi: "Một hoá thạch khiến mình nghĩ về sự sống hàng triệu năm trước. Một con vật khiến mình tự hỏi nó đã tiến hoá ra sao. Một chiếc kính hiển vi khiến mình tò mò về những cấu trúc mắt thường không thấy được.",
              en: "A fossil makes me think about life millions of years ago. An animal makes me wonder how it evolved. A microscope makes me curious about structures the naked eye cannot see.",
            },
          ]}
        />
        <PhotoMasonry photos={observePhotos} />
      </section>

      {/* HOW INTERESTS CONNECT */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Mọi thứ kết nối với nhau", en: "It all connects" }}
          title={{ vi: "Nhiều đam mê của mình bắt đầu như thế", en: "Many of my interests began this way" }}
        />
        <div className="mx-auto mt-8 max-w-2xl space-y-2.5">
          {INTEREST_LINKS.map((l, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-2xl border border-black/5 bg-cream px-5 py-3 text-center shadow-sm"
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
      </section>

      {/* SCIENCE */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Môn học mình yêu thích", en: "One of my favourite subjects" }}
          title={{ vi: "Khoa học biến tò mò thành câu trả lời", en: "Science turns curiosity into answers" }}
          paras={[
            {
              vi: "Mình thích lập kế hoạch cho các thí nghiệm, đưa ra dự đoán, phân tích bằng chứng và giải thích kết luận. Mình thích ý tưởng rằng khoa học không chỉ là biết sự thật — mà là tìm bằng chứng và hiểu vì sao một điều là đúng.",
              en: "I enjoy planning investigations, making predictions, analysing evidence and explaining conclusions. I like that science is not just about knowing facts — it is about finding evidence and understanding why something is true.",
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
            <Localized value={{ vi: "Niềm vui lớn nhất là việc học", en: "What I enjoy most is the learning" }} />
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-white/75">
            <Localized
              value={{
                vi: "Hai năm qua mình vinh dự nhận giải Tinh hoa Khoa học Tự nhiên ở trường, và tham gia nhiều kỳ Olympic Toán, Khoa học, Thiên văn ở cấp trường, thành phố, quốc gia và quốc tế. Những giải thưởng khiến mình tự hào — nhưng điều mình thích nhất là việc học diễn ra khi chuẩn bị cho chúng.",
                en: "Over the past two years I have been honoured to receive the Natural Sciences Star Award at school, and to take part in many Mathematics, Science and Astronomy Olympiads at school, city, national and international levels. These awards make me proud — but what I enjoy most is the learning that happens while preparing for them.",
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

      {/* THE WAYS I LEARN — math, reading, drawing, tech */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Những cách mình học", en: "The ways I learn" }}
          title={{ vi: "Toán, sách, vẽ và công nghệ", en: "Maths, books, drawing & technology" }}
        />
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
          {[
            {
              icon: "🔢",
              name: { vi: "Toán học", en: "Mathematics" },
              body: {
                vi: "thử thách mình tư duy logic — tìm quy luật, giải bài toán, và khám phá nhiều cách khác nhau để đi đến lời giải.",
                en: "challenges me to think logically — finding patterns, solving problems and discovering different ways to reach a solution.",
              },
            },
            {
              icon: "📚",
              name: { vi: "Đọc sách", en: "Reading" },
              body: {
                vi: "đưa mình đi xa hơn lớp học rất nhiều. Đọc một câu trả lời thường mở ra ba câu hỏi mới.",
                en: "lets me explore far beyond the classroom. Reading often answers one question and creates three new ones.",
              },
            },
            {
              icon: "✏️",
              name: { vi: "Vẽ", en: "Drawing" },
              body: {
                vi: "với mình không chỉ là nghệ thuật — đó là một cách tư duy. Vẽ giúp mình nhận ra chi tiết, quy luật và cấu trúc.",
                en: "is not only art for me — it is a way of thinking. Drawing helps me notice details, patterns and structures.",
              },
            },
            {
              icon: "💻",
              name: { vi: "Công nghệ & lập trình", en: "Technology & coding" },
              body: {
                vi: "giúp mình hiểu cách các hệ thống hoạt động, cách câu lệnh trở thành hành động, và cách giải quyết vấn đề bằng tư duy logic.",
                en: "helps me understand how systems work, how instructions become actions, and how problems can be solved through logical thinking.",
              },
            },
          ].map((c, i) => (
            <div key={i} className="break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="text-2xl" aria-hidden>
                {c.icon}
              </div>
              <p className="mt-1 font-display text-xl font-bold text-ink">
                <Localized value={c.name} />
              </p>
              <p className="mt-1.5 leading-relaxed text-ink/70">
                <Localized value={c.body} />
              </p>
            </div>
          ))}
        </div>
        {/* drawing as thinking — sketches */}
        <p className="mx-auto mt-10 max-w-[640px] text-center font-display text-lg italic text-ink/75">
          <Localized
            value={{
              vi: "Mình thường nghĩ bằng hình ảnh trước khi diễn đạt bằng lời.",
              en: "I often think through images before I explain ideas with words.",
            }}
          />
        </p>
        <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
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

      {/* TEACHERS + GROWING */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Thầy cô nói về mình", en: "How my teachers describe me" }}
          title={{ vi: "Và một điều mình đang cố gắng", en: "And one thing I'm working on" }}
        />
        <div className="mt-7">
          <Chips items={TEACHER_WORDS} />
        </div>
        <div className="mx-auto mt-8 max-w-[680px] space-y-4 text-center text-lg leading-relaxed text-ink/75">
          <p>
            <Localized
              value={{
                vi: "Mình thích giúp đỡ bạn bè, chia sẻ ý tưởng và cùng nhau học, vì mình tin rằng ai cũng học tốt hơn khi được hỗ trợ lẫn nhau.",
                en: "I enjoy helping classmates, sharing ideas and learning together, because I believe everyone learns better when they support one another.",
              }}
            />
          </p>
          <p className="font-display italic text-brand">
            <Localized
              value={{
                vi: "Một bài học mình vẫn đang rèn: chậm lại và kiểm tra bài thật kỹ. Đôi khi mình hào hứng giải nhanh quá — nên mình đang tập kiên nhẫn hơn và soát lại trước khi kết thúc.",
                en: "One lesson I keep learning: to slow down and check my work carefully. Sometimes I get excited and move too quickly — so I'm working on being more patient and reviewing before I finish.",
              }}
            />
          </p>
        </div>
      </section>

      {/* HOW I LEARN — Observe → Understand → Explain + triad */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Nhìn lại", en: "Looking back" }}
          title={{ vi: "Ba bước đơn giản trong cách mình học", en: "My learning, in three simple steps" }}
          paras={[
            {
              vi: "Đầu tiên, mình quan sát thế giới bằng sự tò mò. Sau đó, mình cố hiểu nó qua đọc sách, khoa học, toán học và điều tra. Cuối cùng, mình cố diễn giải điều đã học qua viết, nói và vẽ.",
              en: "First, I observe the world with curiosity. Then I try to understand it through reading, science, mathematics and investigation. Finally, I try to explain what I've learned through writing, speaking and drawing.",
            },
          ]}
        />
        <div className="mt-9">
          <FlowChain items={STEPS} />
        </div>
        <p className="mx-auto mt-10 max-w-[640px] text-center text-lg leading-relaxed text-ink/75">
          <Localized
            value={{
              vi: "Cách học này giúp mình kết nối ba điều mình quan tâm sâu sắc — Khoa học, Nghệ thuật và Ngôn ngữ:",
              en: "This way of learning connects three areas I care deeply about — Science, Art and Language:",
            }}
          />
        </p>
        <div className="mx-auto mt-6 grid max-w-4xl gap-4 md:grid-cols-3">
          {TRIAD.map((d) => (
            <div key={d.name} className="break-avoid rounded-3xl border border-black/5 bg-white p-6 text-center shadow-sm">
              <p className={`font-display text-2xl font-bold ${d.tone}`}>{d.name}</p>
              <p className="mt-1.5 leading-relaxed text-ink/70">
                <Localized value={d.body} />
              </p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-[640px] text-center text-ink/70">
          <Localized
            value={{
              vi: "Cùng nhau, chúng giúp mình học sâu hơn và chia sẻ điều mình biết với mọi người.",
              en: "Together, they help me learn more deeply and share what I know with others.",
            }}
          />
        </p>
      </section>

      {/* CLOSING */}
      <section className="bg-brand px-6 py-20 text-center text-white sm:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            <Localized
              value={{
                vi: "Hành trình của mình chỉ mới bắt đầu, và còn rất nhiều điều để khám phá.",
                en: "My journey is still just beginning, and there is still so much to discover.",
              }}
            />
          </p>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            <Localized
              value={{
                vi: "Mình mong được tiếp tục khám phá, học hỏi, sáng tạo và đặt câu hỏi trong nhiều năm tới.",
                en: "I hope to keep exploring, learning, creating and asking questions for many years to come.",
              }}
            />
          </p>
          <p className="mx-auto mt-8 font-display text-xl italic text-white/90">
            <Localized
              value={{
                vi: "Bởi suy cho cùng, mỗi câu trả lời mới thường là khởi đầu của một câu hỏi mới.",
                en: "After all, every new answer is often the beginning of a new question.",
              }}
            />
          </p>
          <div className="no-print mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-2xl bg-white px-5 py-2.5 font-semibold text-brand shadow-sm transition hover:bg-white/90"
            >
              <Localized value={{ vi: "Đọc câu chuyện của mình →", en: "Read my story →" }} />
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
