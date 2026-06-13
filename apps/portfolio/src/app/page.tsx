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
    "A self-introduction by Đào Đình Hữu (Tin): a curious learner who enjoys understanding how things work — through science, reading, observation, drawing and maths. Observe. Investigate. Understand.",
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
    <div className="mx-auto mt-8 max-w-5xl gap-3 [column-fill:_balance] columns-2 sm:columns-3">
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
  { vi: "Vì sao nó xảy ra?", en: "Why does it happen?" },
  { vi: "Nó hoạt động thế nào?", en: "How does it work?" },
  { vi: "Trước kia nó ra sao?", en: "What was it like before?" },
  { vi: "Sẽ thế nào nếu thay đổi điều gì đó?", en: "What would happen if something changed?" },
];

const SCIENCE_METHOD: L[] = [
  { vi: "Đặt câu hỏi", en: "Ask" },
  { vi: "Quan sát", en: "Observe" },
  { vi: "Tìm bằng chứng", en: "Find evidence" },
  { vi: "Tìm ra câu trả lời", en: "Discover answers" },
];

const INTERESTS: L[] = [
  { vi: "Động vật", en: "Animals" },
  { vi: "Khủng long", en: "Dinosaurs" },
  { vi: "Thiên nhiên", en: "Nature" },
  { vi: "Công nghệ", en: "Technology" },
  { vi: "Lịch sử", en: "History" },
  { vi: "Cách mọi thứ vận hành", en: "How things work" },
];

const TEACHER_WORDS: L[] = [
  { vi: "Tò mò", en: "Curious" },
  { vi: "Chu đáo", en: "Thoughtful" },
  { vi: "Tự chủ", en: "Independent" },
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
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-12 pt-8 text-center">
          <div className="mb-6 h-44 w-44 overflow-hidden rounded-full shadow-md ring-4 ring-white sm:h-56 sm:w-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/media/life/life-harvest.jpg")} alt="Đào Đình Hữu (Tin)" className="h-full w-full object-cover" />
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand">
            <Localized value={{ vi: "Tự giới thiệu", en: "A self-introduction" }} />
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] text-ink sm:text-6xl">
            <Localized value={{ vi: "Chào, mình là Tin.", en: "Hi, I'm Tin." }} />
          </h1>
          <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-ink/70 sm:text-xl">
            <Localized
              value={{
                vi: "Tên đầy đủ của mình là Đào Đình Hữu. Nếu phải mô tả bản thân trong một câu, mình sẽ nói: mình thực sự thích hiểu mọi thứ vận hành ra sao. Từ nhỏ, mình đã tò mò về thế giới quanh mình và hay tự đặt câu hỏi.",
                en: "My full name is Đào Đình Hữu. If I had to describe myself in one sentence, I'd say I really enjoy understanding how things work. Ever since I was little, I've been curious about the world around me, and I often find myself asking questions.",
              }}
            />
          </p>
          <div className="mt-6">
            <Chips items={QUESTIONS} italic />
          </div>
          <p className="mt-6 max-w-[600px] text-base text-ink/60">
            <Localized
              value={{
                vi: "Những câu hỏi ấy đôi khi đến từ điều mình thấy hằng ngày, đôi khi từ một chuyến thăm bảo tàng, một con vật, một hoá thạch, một thí nghiệm khoa học, hay một chủ đề mình tình cờ khám phá. Một câu hỏi thường dẫn đến câu hỏi khác — và trước khi kịp nhận ra, mình đã dành rất nhiều thời gian tìm hiểu điều vừa thu hút mình.",
                en: "Those questions sometimes come from something I see in everyday life, sometimes from a museum visit, an animal, a fossil, a science experiment, or a topic I happen to discover. One question often leads to another — and before I know it, I've spent a lot of time learning more about something that caught my attention.",
              }}
            />
          </p>
        </div>
      </header>

      {/* SCIENCE */}
      <section className="bg-white px-6 py-12 sm:py-16">
        <SectionHead
          eyebrow={{ vi: "Môn học tự nhiên nhất với mình", en: "The subject that feels most natural" }}
          title={{ vi: "Khoa học bắt đầu từ sự tò mò", en: "Science begins with curiosity" }}
          paras={[
            {
              vi: "Mình thích việc khoa học khởi đầu từ sự tò mò, và khuyến khích người ta đặt câu hỏi, quan sát kỹ, tìm bằng chứng và khám phá câu trả lời.",
              en: "I like that science begins with curiosity, and encourages people to ask questions, observe carefully, look for evidence, and discover answers.",
            },
          ]}
        />
        <div className="mt-6">
          <FlowChain items={SCIENCE_METHOD} />
        </div>
        <p className="mx-auto mt-8 max-w-[640px] text-center text-lg leading-relaxed text-ink/75">
          <Localized
            value={{
              vi: "Nhiều điều mình thích học đều kết nối với khoa học theo cách nào đó. Càng học, mình càng thấy mọi thứ liên kết với nhau.",
              en: "Many of the things I enjoy learning about connect to science in some way. The more I learn, the more connected everything seems.",
            }}
          />
        </p>
        <div className="mt-6">
          <Chips items={INTERESTS} />
        </div>
      </section>

      {/* READING */}
      <section className="px-6 py-12 sm:py-16">
        <SectionHead
          eyebrow={{ vi: "Sở thích yêu thích", en: "A favourite hobby" }}
          title={{ vi: "Đọc để tiếp tục đặt câu hỏi", en: "Reading keeps the questions going" }}
        />
        <div className="mx-auto mt-8 grid max-w-3xl items-center gap-6 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-3xl bg-white shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/media/life/life-reading-science.jpg")} alt="Reading a science book" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </figure>
          <p className="text-lg leading-relaxed text-ink/75">
            <Localized
              value={{
                vi: "Mình thích đọc sách về khoa học, thiên nhiên, động vật, lịch sử, công nghệ và nhiều chủ đề khác. Đọc sách giúp mình tiếp tục theo đuổi những câu hỏi mình tò mò. Có khi một cuốn sách trả lời một câu hỏi; có khi nó cho mình ba câu hỏi mới. Dù thế nào, mình thường lại muốn tìm hiểu thêm.",
                en: "I enjoy reading books about science, nature, animals, history, technology and many other topics. Reading helps me keep exploring the questions I'm curious about. Sometimes a book answers one question; sometimes it gives me three new ones. Either way, I usually end up wanting to learn more.",
              }}
            />
          </p>
        </div>
      </section>

      {/* OBSERVATION */}
      <section className="bg-white px-6 py-12 sm:py-16">
        <SectionHead
          eyebrow={{ vi: "Một cách học khác", en: "Another way I learn" }}
          title={{ vi: "Quan sát thật kỹ", en: "Observing closely" }}
          paras={[
            {
              vi: "Mình thích đến bảo tàng, sở thú, thuỷ cung, trung tâm khoa học và triển lãm. Mình thích nhìn kỹ vào chi tiết và nghĩ xem chúng có thể nói lên điều gì.",
              en: "I enjoy visiting museums, zoos, aquariums, science centres and exhibitions. I like looking closely at details and thinking about what they might tell me.",
            },
            {
              vi: "Một hoá thạch khiến mình tự hỏi về sự sống hàng triệu năm trước. Một con vật khiến mình tò mò nó sinh tồn ra sao. Một mô hình khoa học khiến mình muốn hiểu thứ gì đó vận hành thế nào. Nhiều sở thích của mình lớn lên chỉ từ việc dành thời gian quan sát và đặt câu hỏi.",
              en: "A fossil makes me wonder about life millions of years ago. An animal makes me curious about how it survives. A scientific model makes me want to understand how something works. Many of my interests have grown simply from taking the time to observe and ask questions.",
            },
          ]}
        />
        <PhotoMasonry photos={observePhotos} />
      </section>

      {/* DRAWING */}
      <section className="px-6 py-12 sm:py-16">
        <SectionHead
          eyebrow={{ vi: "Vẽ", en: "Drawing" }}
          title={{ vi: "Vẽ cũng là một cách học", en: "Drawing is a way of learning" }}
          paras={[
            {
              vi: "Với mình, vẽ không chỉ là tạo ra tranh — đó là một cách học. Khi vẽ một con vật, một con khủng long, hay thứ mình đang tìm hiểu, mình bắt đầu nhận ra những chi tiết trước đó chưa thấy.",
              en: "For me, drawing is not only about creating pictures — it is a way of learning. When I draw an animal, a dinosaur, or something I'm studying, I begin to notice details I didn't see before.",
            },
            {
              vi: "Vẽ giúp mình chậm lại, quan sát kỹ hơn và hiểu sâu hơn. Càng nhìn kỹ, mình càng học được nhiều.",
              en: "Drawing helps me slow down, observe more carefully, and understand more deeply. The more closely I look, the more I learn.",
            },
          ]}
        />
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
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
      <section className="bg-white px-6 py-12 sm:py-16">
        <SectionHead
          eyebrow={{ vi: "Toán học", en: "Mathematics" }}
          title={{ vi: "Thử thách tư duy logic", en: "A logical challenge" }}
          paras={[
            {
              vi: "Mình cũng thích Toán vì nó thử thách mình tư duy logic và giải quyết vấn đề. Mình thích tìm quy luật, thử nhiều lời giải khác nhau, và khám phá xem mọi thứ liên kết với nhau ra sao.",
              en: "I also enjoy mathematics because it challenges me to think logically and solve problems. I like finding patterns, exploring different solutions, and figuring out how things connect.",
            },
          ]}
        />
      </section>

      {/* AWARDS */}
      <section className="bg-brand px-6 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <Localized value={{ vi: "Một vài cột mốc", en: "A few milestones" }} />
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <Localized value={{ vi: "Phía sau mỗi giải là nỗ lực", en: "Behind every award is the effort" }} />
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-white/75">
            <Localized
              value={{
                vi: "Những năm qua mình may mắn được tham gia nhiều kỳ Olympic Toán, Khoa học và Thiên văn ở cấp trường, thành phố, quốc gia và quốc tế. Mình đã nhận các giải Vàng, Bạc, Đồng và Khuyến khích, và đặc biệt tự hào khi được vinh danh Tinh hoa Khoa học Tự nhiên hai năm liên tiếp.",
                en: "Over the years I've been fortunate to take part in many Mathematics, Science and Astronomy Olympiads at school, city, national and international levels. I've received Gold, Silver, Bronze and Honours awards, and I was especially proud to be recognised as a Natural Sciences Star Student for two consecutive years.",
              }}
            />
          </p>
          <p className="mx-auto mt-4 max-w-[640px] text-white/75">
            <Localized
              value={{
                vi: "Những thành tích ấy quan trọng với mình vì chúng nhắc nhớ về việc học, nỗ lực và sự kiên trì phía sau. Mình thích cảm giác phấn khích khi giải được một bài khó, khám phá ý tưởng mới, và dần hiểu được những điều từng có vẻ thử thách.",
                en: "These achievements matter to me because they remind me of the learning, effort and persistence behind them. I enjoy the thrill of solving a hard problem, discovering new ideas, and gradually understanding things that once seemed challenging.",
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
      <section className="px-6 py-12 sm:py-16">
        <SectionHead
          eyebrow={{ vi: "Thầy cô nói về mình", en: "What my teachers say" }}
          title={{ vi: "Tò mò, chu đáo, tự chủ và ham học", en: "Curious, thoughtful, independent and eager to learn" }}
          paras={[
            {
              vi: "Thầy cô thường nhận xét mình tò mò, chu đáo, tự chủ và ham học.",
              en: "My teachers often describe me as curious, thoughtful, independent and eager to learn.",
            },
          ]}
        />
        <div className="mt-7">
          <Chips items={TEACHER_WORDS} />
        </div>
      </section>

      {/* THE PATH — three words */}
      <section className="bg-white px-6 py-12 sm:py-16">
        <SectionHead
          eyebrow={{ vi: "Nhìn lại", en: "Looking back" }}
          title={{ vi: "Mọi điều mình thích đều đi theo một lối", en: "The things I love follow the same path" }}
          paras={[
            {
              vi: "Đầu tiên, mình để ý một điều gì đó. Rồi mình thấy tò mò. Mình đặt câu hỏi. Mình tìm tòi. Mình đọc. Mình quan sát. Và từng chút một, mình bắt đầu hiểu.",
              en: "First, I notice something. Then I become curious. I ask questions. I investigate. I read. I observe. And little by little, I begin to understand.",
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
      <section className="bg-brand px-6 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            <Localized
              value={{
                vi: "Vẫn còn rất nhiều điều mình muốn khám phá. Và đó chính là điều khiến việc học trở nên thú vị.",
                en: "There is still so much I want to discover. That's what makes learning exciting.",
              }}
            />
          </p>
          <p className="mx-auto mt-6 max-w-xl font-display text-xl italic text-white/90">
            <Localized
              value={{
                vi: "Mỗi câu trả lời lại như khởi đầu của một câu hỏi mới — và mình rất mong được biết những câu hỏi ấy sẽ dẫn mình tới đâu tiếp theo.",
                en: "Every answer feels like the beginning of a new question — and I look forward to finding where those questions will lead me next.",
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
