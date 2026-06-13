import type { Metadata } from "next";
import Link from "next/link";
import type { L } from "@/lib/schemas";
import { asset } from "@/lib/asset";
import { Localized } from "@/components/Localized";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Hi, I'm Tin — Đào Đình Hữu",
  description:
    "A self-introduction by Đào Đình Hữu (Tin): a curious learner who really likes understanding things — through science, reading, drawing and maths. Observe. Investigate. Understand.",
};

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
  { vi: "Sao nó lại như vậy?", en: "Why does it work that way?" },
  { vi: "Chuyện đó đã xảy ra thế nào?", en: "How did it happen?" },
  { vi: "Trước kia nó ra sao?", en: "What was it like before?" },
  { vi: "Sẽ thế nào nếu thay đổi điều gì đó?", en: "What would happen if something changed?" },
];

const SCIENCE_METHOD: L[] = [
  { vi: "Quan sát", en: "Observe" },
  { vi: "Đặt câu hỏi", en: "Ask" },
  { vi: "Tìm bằng chứng", en: "Find evidence" },
  { vi: "Thấu hiểu", en: "Understand" },
];

const INTERESTS: L[] = [
  { vi: "Động vật", en: "Animals" },
  { vi: "Khủng long", en: "Dinosaurs" },
  { vi: "Thiên nhiên", en: "Nature" },
  { vi: "Công nghệ", en: "Technology" },
  { vi: "Cách mọi thứ vận hành", en: "How things work" },
];

const TEACHER_WORDS: L[] = [
  { vi: "Tò mò", en: "Curious" },
  { vi: "Chu đáo", en: "Thoughtful" },
  { vi: "Tự chủ", en: "Independent" },
];

const THREE_WORDS: L[] = [
  { vi: "Quan sát", en: "Observe" },
  { vi: "Tìm tòi", en: "Investigate" },
  { vi: "Thấu hiểu", en: "Understand" },
];

const curiosityPhotos: { src: string; alt: string; caption: L }[] = [
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

/* ---------- page ---------- */

export default function IntroPage() {
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
                vi: "Mình là Đào Đình Hữu, nhưng mọi người đều gọi là Tin. Nếu phải mô tả bản thân trong một câu, mình sẽ nói: mình rất thích hiểu mọi thứ. Từ nhỏ, mình đã thích đặt câu hỏi về thế giới quanh mình.",
                en: "My name is Đào Đình Hữu, but everyone calls me Tin. If I had to describe myself in one sentence, I'd say I really like understanding things. Ever since I was little, I've enjoyed asking questions about the world around me.",
              }}
            />
          </p>
          <div className="mt-6">
            <Chips items={QUESTIONS} italic />
          </div>
          <p className="mt-6 max-w-[560px] text-base text-ink/60">
            <Localized
              value={{
                vi: "Mình hỏi không phải lúc nào cũng vì cần câu trả lời ngay — đôi khi chỉ đơn giản vì tò mò.",
                en: "I don't always ask because I need an answer right away — sometimes simply because I'm curious.",
              }}
            />
          </p>
        </div>
      </header>

      {/* CURIOSITY → EXPLORING */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Tò mò dẫn lối", en: "Curiosity leads the way" }}
          title={{ vi: "Một câu hỏi mở ra câu hỏi khác", en: "One question leads to another" }}
          paras={[
            {
              vi: "Một hoá thạch có thể khiến mình tự hỏi về sự sống hàng triệu năm trước. Một con vật khiến mình nghĩ xem nó sinh tồn thế nào trong tự nhiên. Một cỗ máy khiến mình tò mò bên trong đang diễn ra điều gì. Ngay cả những thứ bình thường cũng trở nên thú vị khi mình bắt đầu nghĩ về chúng.",
              en: "A fossil can make me wonder about life millions of years ago. An animal can make me think about how it survives in nature. A machine can make me curious about what's happening inside. Even ordinary things become interesting when I start thinking about them.",
            },
            {
              vi: "Vì thế, mình hay khám phá một chủ đề lâu hơn dự định rất nhiều. Câu hỏi này dẫn đến câu hỏi khác, rồi câu khác nữa — và trước khi kịp nhận ra, mình đã dành cả tiếng đồng hồ tìm hiểu một điều vừa thu hút mình.",
              en: "So I often explore a topic for much longer than I planned. One question leads to another, then another — and before I realise it, I've spent an hour learning about something that caught my attention.",
            },
          ]}
        />
        <PhotoMasonry photos={curiosityPhotos} />
      </section>

      {/* SCIENCE */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Môn học tự nhiên nhất với mình", en: "The subject that feels most natural" }}
          title={{ vi: "Khoa học bắt đầu từ sự tò mò", en: "Science begins with curiosity" }}
          paras={[
            {
              vi: "Mình thích việc khoa học bắt đầu từ sự tò mò. Người ta quan sát một điều gì đó, đặt câu hỏi, tìm bằng chứng, rồi dần dần xây nên hiểu biết. Quy trình ấy với mình thật quen thuộc.",
              en: "I like that science begins with curiosity. People observe something, ask questions, look for evidence, and gradually build understanding. That process feels familiar to me.",
            },
          ]}
        />
        <div className="mt-8">
          <FlowChain items={SCIENCE_METHOD} />
        </div>
        <p className="mx-auto mt-10 max-w-[640px] text-center text-lg leading-relaxed text-ink/75">
          <Localized
            value={{
              vi: "Nhiều sở thích của mình đều kết nối với khoa học theo cách nào đó:",
              en: "Many of my interests connect to science in some way:",
            }}
          />
        </p>
        <div className="mt-6">
          <Chips items={INTERESTS} />
        </div>
      </section>

      {/* READING */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Khi muốn tìm hiểu thêm", en: "When I want to learn more" }}
          title={{ vi: "Một cuốn sách mở ra nhiều cánh cửa", en: "A book opens more doors" }}
        />
        <div className="mx-auto mt-8 grid max-w-3xl items-center gap-6 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-3xl bg-cream shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/media/life/life-reading-science.jpg")} alt="Reading a science book" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </figure>
          <p className="text-lg leading-relaxed text-ink/75">
            <Localized
              value={{
                vi: "Đọc sách là một trong những sở thích của mình, vì nó cho mình tiếp tục theo đuổi những câu hỏi mình quan tâm. Một cuốn sách hay hiếm khi là dấu chấm hết cho một chủ đề — thường thì nó lại mở ra thêm thật nhiều điều mình muốn học.",
                en: "Reading is one of my favourite hobbies, because it lets me keep exploring the questions that interest me. A good book rarely feels like the end of a topic — usually it opens the door to even more things I want to learn.",
              }}
            />
          </p>
        </div>
      </section>

      {/* DRAWING */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Vẽ", en: "Drawing" }}
          title={{ vi: "Vẽ giúp mình quan sát kỹ hơn", en: "Drawing helps me observe more carefully" }}
          paras={[
            {
              vi: "Với mình, vẽ là một cách quan sát kỹ hơn. Khi vẽ một thứ gì đó, mình bắt đầu nhận ra những chi tiết trước đó chưa từng thấy. Càng nhìn kỹ, mình càng hiểu.",
              en: "For me, drawing is a way of observing more carefully. When I draw something, I start noticing details I didn't see before. The more closely I look, the more I understand.",
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

      {/* MATHS → science is the one */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Toán học", en: "Mathematics" }}
          title={{ vi: "Thử thách tư duy logic", en: "A logical challenge" }}
          paras={[
            {
              vi: "Mình cũng thích Toán vì nó thử thách mình tư duy logic và giải quyết vấn đề. Nhưng nếu phải chọn một môn thể hiện rõ nhất cách mình học một cách tự nhiên, thì đó là khoa học.",
              en: "I also enjoy mathematics because it challenges me to think logically and solve problems. But if I had to choose one subject that best represents how I naturally learn, it would be science.",
            },
          ]}
        />
      </section>

      {/* TEACHERS */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Thầy cô nói về mình", en: "What my teachers say" }}
          title={{ vi: "Tò mò là lý do đằng sau nhiều điều", en: "Curiosity is the reason behind it all" }}
          paras={[
            {
              vi: "Thầy cô thường nhận xét mình tò mò, chu đáo và tự chủ. Mình nghĩ tò mò có lẽ là lý do đằng sau rất nhiều điều mình thích: nó thôi thúc mình đặt câu hỏi, thôi thúc mình khám phá, và thôi thúc mình tiếp tục học.",
              en: "My teachers often describe me as curious, thoughtful and independent. I think curiosity is probably the reason behind many of the things I enjoy — it encourages me to ask questions, to explore, and to keep learning.",
            },
          ]}
        />
        <div className="mt-7">
          <Chips items={TEACHER_WORDS} />
        </div>
      </section>

      {/* THREE WORDS */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Hành trình học của mình", en: "My learning journey" }}
          title={{ vi: "Gói gọn trong ba từ", en: "In three words" }}
        />
        <div className="mt-8">
          <FlowChain items={THREE_WORDS} />
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-brand px-6 py-20 text-center text-white sm:py-28">
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
                vi: "Mỗi câu trả lời lại dường như dẫn tới một câu hỏi mới — và mình nghĩ đó chính là lý do mình thích học đến vậy.",
                en: "Every answer seems to lead to a new question — and I think that's exactly why I enjoy learning so much.",
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
