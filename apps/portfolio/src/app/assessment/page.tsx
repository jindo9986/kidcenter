import type { Metadata } from "next";
import Link from "next/link";
import { getStory } from "@/lib/story";
import { getAchievements, getGallery } from "@/lib/content";
import type { L } from "@/lib/schemas";
import { asset } from "@/lib/asset";
import { Localized } from "@/components/Localized";
import { SiteNav } from "@/components/SiteNav";
import { PrintLink } from "@/components/PrintLink";

export const metadata: Metadata = {
  title: "Independent AI Assessment — Đào Đình Hữu (Tin)",
  description:
    "An independent, evidence-based AI assessment of Đào Đình Hữu (Tin): the pattern connecting curiosity, inquiry, observation and visual thinking — backed by four years of teacher reports, academic results and his portfolio.",
};

// English used only for non-visible attributes (alt text, keys); visible text is
// bilingual via <Localized>.
const en = (v: L) => v.en;

/* faint indigo graph-paper texture (DESIGN.md hero treatment) */
const graphPaper =
  "linear-gradient(0deg, rgba(255,253,247,.6), rgba(255,253,247,.6))," +
  "repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(55,48,163,.06) 24px)," +
  "repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(55,48,163,.06) 24px)";

/* ---------- building blocks (Editorial Warm, mirrors the story page) ---------- */

function SectionHead({
  n,
  eyebrow,
  title,
  paras,
}: {
  n?: string;
  eyebrow: L;
  title: L;
  paras?: L[];
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand">
        {n && <span className="text-accent">{n} · </span>}
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

function FlowChain({ items, dark = false }: { items: L[]; dark?: boolean }) {
  return (
    <div
      className={
        "mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-2 font-display text-base font-bold sm:text-lg " +
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

function PullQuote({ value }: { value: L }) {
  return (
    <blockquote className="mx-auto my-2 max-w-[640px] break-avoid border-l-4 border-accent pl-5 text-left">
      <p className="font-display text-xl italic leading-snug text-ink">
        <Localized value={value} />
      </p>
    </blockquote>
  );
}

function InsetList({ title, items }: { title: L; items: L[] }) {
  return (
    <div className="mx-auto max-w-2xl break-avoid rounded-3xl bg-brand/[0.04] p-6 text-left">
      <p className="mb-2 text-sm font-semibold text-ink/55">
        <Localized value={title} />
      </p>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-ink/80">
            <span className="mt-1 select-none text-accent">◆</span>
            <span>
              <Localized value={it} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="shrink-0 text-lg leading-none" aria-label={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} aria-hidden className={i <= n ? "text-accent" : "text-ink/15"}>
          ★
        </span>
      ))}
    </span>
  );
}

function PhotoMasonry({ photos }: { photos: { src: string; alt: string; caption: L }[] }) {
  return (
    <div className="mx-auto mt-10 max-w-5xl gap-3 [column-fill:_balance] columns-2 sm:columns-3">
      {photos.map((p) => (
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
  );
}

/* ---------- content (bilingual) ---------- */

const ARC: L[] = [
  { vi: "Tò mò", en: "Curiosity" },
  { vi: "Tìm tòi", en: "Inquiry" },
  { vi: "Quan sát", en: "Observation" },
  { vi: "Điều tra", en: "Investigation" },
  { vi: "Thấu hiểu", en: "Understanding" },
];

const RESEARCH_CYCLE: L[] = [
  { vi: "Quan sát", en: "Observe" },
  { vi: "Vẽ", en: "Draw" },
  { vi: "Soi xét", en: "Examine" },
  { vi: "Thấu hiểu", en: "Understand" },
];

const COGNITIVE: L[] = [
  { vi: "Truy vấn khoa học", en: "Scientific Inquiry" },
  { vi: "Tư duy hình ảnh", en: "Visual Thinking" },
  { vi: "Quan sát", en: "Observation" },
  { vi: "Tự học", en: "Independent Learning" },
  { vi: "Suy luận phân tích", en: "Analytical Reasoning" },
];

const INQUIRY_QS: L[] = [
  { vi: "Tại sao điều này xảy ra?", en: "Why does this happen?" },
  { vi: "Nó vận hành thế nào?", en: "How does it work?" },
  { vi: "Nguyên nhân là gì?", en: "What caused it?" },
  { vi: "Sẽ ra sao nếu thay đổi điều gì đó?", en: "What would happen if something changed?" },
  { vi: "Các thứ liên kết với nhau ra sao?", en: "How are different things connected?" },
];

const IMAGES_HELP: L[] = [
  { vi: "Khảo sát cấu trúc", en: "Examine structures" },
  { vi: "Nhận ra quy luật", en: "Recognise patterns" },
  { vi: "Hiểu các mối liên hệ", en: "Understand relationships" },
  { vi: "Dựng mô hình tư duy", en: "Build mental models" },
  { vi: "Sắp xếp thông tin phức tạp", en: "Organise complex information" },
];

const REASONING: L[] = [
  { vi: "Giải quyết vấn đề", en: "Problem solving" },
  { vi: "Kỹ năng suy luận", en: "Reasoning skills" },
  { vi: "Đưa ra dự đoán", en: "Prediction making" },
  { vi: "Lập kế hoạch điều tra", en: "Investigation planning" },
  { vi: "Tư duy khoa học", en: "Scientific thinking" },
];

const ENVIRONMENTS: L[] = [
  { vi: "Nghiên cứu khoa học", en: "Scientific investigation" },
  { vi: "Học theo hướng nghiên cứu", en: "Research-oriented learning" },
  { vi: "Khám phá độc lập", en: "Independent exploration" },
  { vi: "Học dựa trên quan sát", en: "Observation-based study" },
  { vi: "Tư duy phân tích", en: "Analytical thinking" },
  { vi: "Ghi chép bằng hình ảnh", en: "Visual documentation" },
];

const TOPICS: L[] = [
  { vi: "Động vật", en: "Animals" },
  { vi: "Thiên nhiên", en: "Nature" },
  { vi: "Khủng long", en: "Dinosaurs" },
  { vi: "Khoa học", en: "Science" },
  { vi: "Công nghệ", en: "Technology" },
  { vi: "Lịch sử", en: "History" },
];

const OBSERVED: { icon: string; title: L; text: L }[] = [
  {
    icon: "🔍",
    title: { vi: "Tò mò", en: "Curiosity" },
    text: { vi: "Sẵn sàng khám phá và điều tra.", en: "A willingness to explore and investigate." },
  },
  {
    icon: "🧪",
    title: { vi: "Tư duy khoa học", en: "Scientific Thinking" },
    text: {
      vi: "Tiếp cận câu hỏi một cách logic và có hệ thống.",
      en: "An ability to approach questions logically and systematically.",
    },
  },
  {
    icon: "🧭",
    title: { vi: "Tự chủ", en: "Independence" },
    text: {
      vi: "Tự tin theo đuổi việc học mà không cần hướng dẫn liên tục.",
      en: "Confidence in pursuing learning without constant guidance.",
    },
  },
  {
    icon: "🧩",
    title: { vi: "Suy luận", en: "Reasoning" },
    text: {
      vi: "Phân tích, kết nối ý tưởng và giải quyết vấn đề.",
      en: "The ability to analyse, connect ideas, and solve problems.",
    },
  },
];

const curiosityPhotos: { src: string; alt: string; caption: L }[] = [
  { src: "/media/life/life-wonder-reptile.jpg", alt: "Pointing at a reptile in a vivarium", caption: { vi: "Ồ — đó là con gì vậy?!", en: "Whoa — what is that?!" } },
  { src: "/media/life/life-reading-science.jpg", alt: "Reading a science book", caption: { vi: "Đắm chìm trong một cuốn sách khoa học", en: "Hours lost in a science book" } },
  { src: "/media/life/life-snake-touch.jpg", alt: "Touching a snake at the zoo", caption: { vi: "Lần đầu chạm vào một con trăn", en: "First time touching a snake" } },
  { src: "/media/life/life-whale-skeleton.jpg", alt: "In front of a sperm-whale skeleton", caption: { vi: "Đối diện bộ xương cá nhà táng", en: "Eye to eye with a sperm whale" } },
  { src: "/media/life/life-marlin.jpg", alt: "Under a mounted blue marlin", caption: { vi: "Con cá cờ xanh, dài hơn cả chiều cao của cậu", en: "A blue marlin, longer than he is tall" } },
  { src: "/media/life/life-elephants.jpg", alt: "Pointing at elephants at the zoo", caption: { vi: "Ngắm đàn voi ở cự ly gần", en: "Watching the elephants up close" } },
  { src: "/media/life/life-wildflowers.jpg", alt: "Observing roadside wildflowers", caption: { vi: "Để ý những điều nhỏ bé", en: "Noticing the small things" } },
];

const observationPhotos: { src: string; alt: string; caption: L }[] = [
  { src: "/media/life/life-microscope.jpg", alt: "Looking through a microscope", caption: { vi: "Dưới kính hiển vi — thớ gỗ", en: "Under the microscope — the grain of wood" } },
  { src: "/media/life/life-evolution-skulls.jpg", alt: "Studying a wall of hominid skulls", caption: { vi: "Lần theo nguồn gốc loài người, từng chiếc sọ", en: "Tracing human origins, skull by skull" } },
  { src: "/media/life/life-museum-art.jpg", alt: "Looking at ink cityscape paintings", caption: { vi: "Đọc một thành phố vẽ bằng mực", en: "Reading a city drawn in ink" } },
];

const awardPhotos = [
  { src: "/media/life/life-award-stage.jpg", alt: "On stage with the Science Star Award" },
  { src: "/media/life/life-award-ceremony.jpg", alt: "Holding the Science Star Award at the ceremony" },
  { src: "/media/life/life-award-classroom.jpg", alt: "With his certificate at the class Wall of Fame" },
];

const VENN_DOMAINS: { name: string; role: L; body: L; tone: string }[] = [
  {
    name: "Science",
    role: { vi: "Phân tích & thấu hiểu", en: "Analyse & understand" },
    body: {
      vi: "Hỏi tại sao và như thế nào; coi kiến thức là thứ để khảo sát, kiểm chứng và thấu hiểu.",
      en: "Asks why and how; treats knowledge as something to examine, test and understand.",
    },
    tone: "text-brand",
  },
  {
    name: "Art",
    role: { vi: "Quan sát & hình dung", en: "Observe & visualise" },
    body: {
      vi: "Vẽ để chậm lại và nhìn kỹ; dùng hình ảnh để dựng mô hình tư duy và lưu lại khám phá.",
      en: "Draws to slow down and look closely; uses images to build mental models and record discoveries.",
    },
    tone: "text-teal",
  },
  {
    name: "Math",
    role: { vi: "Suy luận & cấu trúc", en: "Reason & structure" },
    body: {
      vi: "Mang lại logic, dự đoán và cấu trúc — biến dữ kiện rời rạc thành hệ thống và nguyên nhân.",
      en: "Brings logic, prediction and structure — turning scattered facts into systems and causes.",
    },
    tone: "text-ink",
  },
];

/* ---------- page ---------- */

export default function AssessmentPage() {
  const s = getStory();
  const achievements = getAchievements();
  const dinoArt = getGallery()
    .filter((g) => g.src.includes("dino"))
    .slice(0, 4);

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
        <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-10 text-center sm:pt-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand">
            <Localized value={{ vi: "Độc lập · Đánh giá bằng AI", en: "Independent · AI Assessment" }} />
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] text-ink sm:text-5xl">
            <Localized
              value={{
                vi: "Câu chuyện phía sau hành trình học tập",
                en: "The Story Behind the Learning Journey",
              }}
            />
          </h1>
          <p className="mt-4 font-display text-xl italic text-brand sm:text-2xl">
            <span data-lang="vi">Tư duy Khoa học</span>
            <span data-lang="en">Scientific Inquiry</span>
            <span className="not-italic text-accent"> × </span>
            <span data-lang="vi">Tư duy Hình ảnh</span>
            <span data-lang="en">Visual Thinking</span>
          </p>
          <p className="mt-5 text-sm text-ink/60">
            <span className="font-semibold text-ink/80">Đào Đình Hữu (Tin)</span> ·{" "}
            <Localized
              value={{
                vi: "tổng hợp từ học bạ, kết quả học tập & hồ sơ năng lực suốt bốn năm",
                en: "synthesised from four years of teacher reports, academic results & portfolio",
              }}
            />
          </p>
        </div>
      </header>

      {/* THE PATTERN — thesis */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Câu hỏi cứ lặp đi lặp lại", en: "The question that kept recurring" }}
          title={{ vi: "Điều gì là mẫu hình ẩn bên dưới?", en: "What is the underlying pattern?" }}
          paras={[
            {
              vi: "Đứa trẻ nào cũng học. Nhiều em đạt điểm cao; một số em sưu tầm huy chương, chứng nhận và giải thưởng. Nhưng phía sau mỗi thành tích là một câu chuyện sâu hơn — về cách một đứa trẻ suy nghĩ, cách em học, và điều gì khiến em tiếp tục khám phá ngay cả khi không ai để ý.",
              en: "Every child learns. Many achieve good grades; some collect medals, certificates and awards. But behind every achievement lies a deeper story — about how a child thinks, how a child learns, and what keeps them exploring even when nobody is watching.",
            },
            {
              vi: "Sau khi xem lại học bạ, nhận xét của giáo viên, thói quen học tập, thành tích và hồ sơ cá nhân của Tin, một câu hỏi cứ hiện lên lặp đi lặp lại:",
              en: "After reviewing Tin's academic records, teacher evaluations, learning behaviours, achievements and personal portfolio, one question emerged again and again:",
            },
          ]}
        />
        <div className="mt-6">
          <PullQuote
            value={{
              vi: "Mẫu hình nào kết nối tất cả lại với nhau?",
              en: "What is the underlying pattern connecting everything?",
            }}
          />
        </div>
        <p className="mx-auto mt-6 max-w-[640px] text-center text-lg leading-relaxed text-ink/75">
          <Localized
            value={{
              vi: "Câu trả lời nhất quán đến bất ngờ. Câu chuyện này không chủ yếu nói về thành tích, sự cạnh tranh hay việc sưu tầm giải thưởng. Đó là câu chuyện về sự tò mò trở thành tìm tòi, tìm tòi trở thành điều tra, và điều tra trở thành thấu hiểu.",
              en: "The answer was surprisingly consistent. The story is not primarily about achievement, competition, or collecting awards. It is a story about curiosity becoming inquiry, inquiry becoming investigation, and investigation becoming understanding.",
            }}
          />
        </p>
        <div className="mt-9">
          <FlowChain items={ARC} />
        </div>
      </section>

      {/* 01 — CURIOSITY */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead
          n="01"
          eyebrow={{ vi: "Trước khi có thành tích", en: "Before achievement" }}
          title={{ vi: "Đã có sự tò mò", en: "There was curiosity" }}
          paras={[
            {
              vi: "Trước các kỳ Olympic, trước những cuộc thi, trước mọi ghi nhận học thuật — đã có sự tò mò. Tin luôn bị cuốn hút bởi những câu hỏi: về động vật, thiên nhiên, khủng long, khoa học, công nghệ, lịch sử.",
              en: "Before Olympiads, before competitions, before academic recognition — there was curiosity. Tin has always been drawn to questions: about animals, nature, dinosaurs, science, technology, history.",
            },
            {
              vi: "Đứa trẻ nào cũng đặt câu hỏi. Điều khác biệt nằm ở những gì xảy ra tiếp theo. Với Tin, một câu hỏi hiếm khi biến mất sau khi được trả lời một lần — câu trả lời trở thành điểm khởi đầu cho khám phá tiếp theo. Một câu hỏi dẫn đến câu hỏi khác; một phát hiện mở ra nhiều phát hiện nữa.",
              en: "Many children ask questions. What appears different is what happens next. For Tin, a question rarely disappears after being answered once — answers become starting points for further exploration. One question leads to another; one discovery opens the door to many more.",
            },
          ]}
        />
        <div className="mt-7">
          <Chips italic items={TOPICS} />
        </div>
        <PhotoMasonry photos={curiosityPhotos} />
      </section>

      {/* 02 — INQUIRY */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          n="02"
          eyebrow={{ vi: "Học như một cuộc điều tra", en: "Learning as investigation" }}
          title={{ vi: "Từ dữ kiện đến những câu hỏi sâu hơn", en: "From facts to deeper questions" }}
          paras={[
            {
              vi: "Khi sự tò mò lớn dần, việc học dần trở thành một hình thức điều tra. Qua nhiều môn học và lĩnh vực, có thể thấy một mẫu hình chung: thay vì dừng ở dữ kiện, Tin hướng tới những câu hỏi sâu hơn. Kiến thức không phải để ghi nhớ — nó trở thành thứ để khảo sát, kiểm chứng và thấu hiểu.",
              en: "As curiosity grew, learning gradually became a form of investigation. Across different subjects and interests, a common pattern can be observed: instead of stopping at facts, Tin moves toward deeper questions. Knowledge is not something to memorise — it becomes something to examine, to test, to understand.",
            },
          ]}
        />
        <div className="mt-8">
          <Chips items={INQUIRY_QS} italic />
        </div>
        <p className="mx-auto mt-8 max-w-[640px] text-center text-lg leading-relaxed text-ink/75">
          <Localized
            value={{
              vi: "Khuynh hướng hỏi vì sao và như thế nào thay vì chỉ hỏi cái gì là một trong những dấu hiệu mạnh nhất của một người học theo lối truy vấn.",
              en: "This tendency — to ask why and how rather than merely what — is one of the strongest indicators of an inquiry-driven learner.",
            }}
          />
        </p>
      </section>

      {/* 03 — OBSERVATION */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead
          n="03"
          eyebrow={{ vi: "Quan sát trở thành điểm khởi đầu", en: "Observation became the starting point" }}
          title={{ vi: "Để ý trước tiên", en: "Noticing comes first" }}
          paras={[
            {
              vi: "Mọi cuộc điều tra đều bắt đầu từ đâu đó. Với Tin, nó thường bắt đầu bằng quan sát — thiên nhiên, động vật, sách vở, trải nghiệm hằng ngày. Quan sát giúp các chi tiết hiện ra, quy luật trở nên rõ ràng, và câu hỏi bắt đầu hình thành.",
              en: "Every investigation begins somewhere. For Tin, it often begins with observation — of nature, animals, books, everyday experiences. Observation lets details emerge, patterns become visible, and questions begin to form.",
            },
            {
              vi: "Trước khi giải thích là điều tra; trước khi điều tra là quan sát. Qua nhiều nhận xét của giáo viên, sự quan sát kỹ lưỡng lặp lại như một phần cốt lõi trong cách em tiếp cận việc học.",
              en: "Before explanation comes investigation; before investigation comes observation. Across multiple teacher reports, careful observation appears again and again as a core part of how he approaches learning.",
            },
          ]}
        />
        <PhotoMasonry photos={observationPhotos} />
      </section>

      {/* 04 — VISUAL THINKING & DRAWING */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          n="04"
          eyebrow={{ vi: "Tư duy hình ảnh & vẽ", en: "Visual thinking & drawing" }}
          title={{ vi: "Vẽ như một công cụ điều tra", en: "Drawing as a tool for investigation" }}
          paras={[
            {
              vi: "Không phải ai cũng học theo cùng một cách. Có người tư duy bằng ngôn từ, có người bằng con số. Tin thường tư duy bằng hình ảnh — hình dung là một phần của chính quá trình học, không chỉ là cách trình bày.",
              en: "Not everyone learns the same way. Some think through words, others through numbers. Tin often appears to think through images — visualisation is part of the learning process itself, not merely a way to present it.",
            },
            {
              vi: "Với nhiều trẻ, vẽ là một hoạt động sáng tạo. Với Tin, nó phục vụ một mục đích khác: làm chậm sự quan sát, khuyến khích xem xét kỹ hơn, và làm lộ ra những chi tiết dễ bị bỏ sót.",
              en: "For many children, drawing is a creative activity. For Tin it serves a different purpose: it slows down observation, encourages closer examination, and surfaces details that might otherwise be missed.",
            },
          ]}
        />

        <div className="mt-8">
          <FlowChain items={RESEARCH_CYCLE} />
        </div>

        {dinoArt.length > 0 && (
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {dinoArt.map((a) => (
              <figure key={a.src} className="break-avoid overflow-hidden rounded-2xl bg-cream shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(a.src)} alt={en(a.caption)} loading="lazy" className="aspect-square w-full object-cover" />
              </figure>
            ))}
          </div>
        )}
        <p className="mx-auto mt-6 max-w-[640px] text-center font-display text-lg italic text-ink/75">
          <Localized
            value={{
              vi: "Quan sát dẫn đến vẽ; vẽ dẫn đến quan sát sâu hơn; quan sát sâu hơn dẫn đến thấu hiểu nhiều hơn.",
              en: "Observation leads to drawing; drawing leads to deeper observation; deeper observation leads to greater understanding.",
            }}
          />
        </p>
        <div className="mt-8">
          <InsetList
            title={{ vi: "Hình ảnh giúp em", en: "Images help him" }}
            items={IMAGES_HELP}
          />
        </div>
        <p className="mx-auto mt-6 max-w-[640px] text-center text-ink/70">
          <Localized
            value={{
              vi: "Các bức vẽ của em ít mang tính tác phẩm nghệ thuật mà giống một dạng ghi chép bằng hình ảnh — cách lưu lại quan sát và sắp xếp hiểu biết, phản chiếu đúng cách các nhà tự nhiên học và nhà khoa học vẫn dùng phác thảo, sổ tay để tạo ra tri thức.",
              en: "His drawings function less as artwork and more as visual documentation — a way to record observations and organise understanding, mirroring how naturalists and scientists have always used sketches and notebooks to generate knowledge.",
            }}
          />
        </p>
      </section>

      {/* STEAM STRENGTHS — Venn (Science · Art · Math) */}
      <section className="px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Thế mạnh STEAM của Tin", en: "His STEAM strengths" }}
          title={{ vi: "Nơi Khoa học, Nghệ thuật & Toán gặp nhau", en: "Where Science, Art & Math meet" }}
          paras={[
            {
              vi: "Hồ sơ của Tin không phải một tài năng đơn lẻ mà là ba thế mạnh bổ trợ cho nhau. Nghệ thuật rèn cho đôi mắt biết quan sát và hình dung; Toán mang lại cấu trúc và suy luận; Khoa học biến cả hai thành câu hỏi và lời giải thích. Nơi ba điều này giao nhau là nơi em mạnh nhất — sự điều tra.",
              en: "Tin's profile is not one talent but three that reinforce one another. Art trains the eye to observe and visualise; Math gives structure and reasoning; Science turns both into questions and explanations. Where the three overlap is where he is strongest — investigation.",
            },
          ]}
        />
        <figure className="mx-auto mt-10 max-w-md">
          <svg
            viewBox="0 0 440 430"
            className="w-full"
            role="img"
            aria-label="Venn diagram — Science, Art and Math overlap in scientific inquiry"
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
              <text x="86" y="336" fontSize="11.5" fill="var(--color-teal)" opacity="0.85">observe · visualise</text>
              <text x="356" y="316" fontSize="24" fontWeight="800" fill="var(--color-ink)">Math</text>
              <text x="356" y="336" fontSize="11.5" fill="var(--color-ink)" opacity="0.6">reason · structure</text>
              <text x="220" y="236" fontSize="15" fontWeight="800" fill="var(--color-ink)">Scientific</text>
              <text x="220" y="255" fontSize="15" fontWeight="800" fill="var(--color-ink)">Inquiry</text>
            </g>
          </svg>
          <figcaption className="mt-4 text-center text-sm text-ink/55">
            <Localized
              value={{
                vi: "Nơi Khoa học, Nghệ thuật và Toán giao nhau — sự truy vấn khoa học bằng hình ảnh.",
                en: "Where Science, Art and Math overlap — visual scientific inquiry.",
              }}
            />
          </figcaption>
        </figure>
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-3">
          {VENN_DOMAINS.map((d) => (
            <div key={d.name} className="break-avoid rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className={`font-display text-2xl font-bold ${d.tone}`}>{d.name}</p>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand">
                <Localized value={d.role} />
              </p>
              <p className="leading-relaxed text-ink/70">
                <Localized value={d.body} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 05 — INVESTIGATION → UNDERSTANDING */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          n="05"
          eyebrow={{ vi: "Tự chủ & suy luận phân tích", en: "Independence & analytical reasoning" }}
          title={{ vi: "Điều tra trở thành thấu hiểu", en: "Investigation becomes understanding" }}
          paras={[
            {
              vi: "Tò mò tạo ra câu hỏi; sự tự chủ cho phép theo đuổi chúng. Suốt bốn năm, giáo viên liên tục ghi nhận Tin sẵn sàng nhận thử thách, làm việc độc lập, tập trung và chủ động. Truy vấn rồi dẫn đến phân tích một cách tự nhiên — hiểu biết trở nên có cấu trúc thay vì ngẫu nhiên.",
              en: "Curiosity creates questions; independence allows them to be pursued. Across four years, teachers repeatedly noted that Tin accepts challenges willingly, works independently, stays focused, and shows initiative. Inquiry then naturally leads to analysis — understanding becomes structured rather than accidental.",
            },
          ]}
        />
        <div className="mt-8">
          <InsetList
            title={{ vi: "Thường thấy trong nhận xét của giáo viên", en: "Recurring in teacher evaluations" }}
            items={REASONING}
          />
        </div>

        {/* evidence: Grade-4 academic results */}
        <div className="mx-auto mt-10 max-w-2xl break-avoid rounded-3xl border border-black/5 bg-cream p-6 shadow-sm">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-brand">
            <Localized value={{ vi: "Bằng chứng · Điểm Lớp 4", en: "Evidence · Grade 4 results" }} />
          </p>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {s.academic.grade4.map((g) => (
              <li key={en(g.subject)} className="flex items-center justify-between border-b border-black/5 py-2.5 last:border-0">
                <span className="text-ink/75">
                  <Localized value={g.subject} />
                </span>
                <span
                  className={
                    "flex h-8 min-w-8 items-center justify-center rounded-full px-2 font-display text-sm font-bold tabular-nums " +
                    (g.score === "10" ? "bg-brand text-white" : "bg-accent/20 text-ink")
                  }
                >
                  {g.score}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHAT TEACHERS CONSISTENTLY OBSERVED — real quotes */}
      <section className="bg-brand px-6 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <Localized value={{ vi: "Bằng chứng mạnh nhất là sự nhất quán", en: "The strongest evidence is consistency" }} />
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <Localized value={{ vi: "Điều giáo viên liên tục nhận thấy", en: "What teachers consistently observed" }} />
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-white/70">
            <Localized
              value={{
                vi: "Khác giáo viên, khác môn học, khác năm — nhưng những nhận xét giống nhau đến bất ngờ cứ xuất hiện, suốt bốn năm học bạ Cambridge.",
                en: "Different teachers, different subjects, different years — yet remarkably similar observations keep appearing across four years of Cambridge reports.",
              }}
            />
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
          {s.teachers.entries.map((e) => (
            <div
              key={e.name}
              className="break-avoid rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                <Localized value={e.grade} /> · <Localized value={e.label} />
              </p>
              <p className="font-display text-lg font-bold">{e.name}</p>
              <ul className="mt-3 space-y-2 border-l-2 border-accent/50 pl-4">
                {e.quotes.map((q, j) => (
                  <li key={j} className="text-sm italic leading-snug text-white/85">
                    “<Localized value={q} />”
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.themes.map((t, j) => (
                  <span key={j} className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold">
                    <Localized value={t} />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* the four distilled themes */}
        <div className="mx-auto mt-6 grid max-w-5xl gap-3 sm:grid-cols-4">
          {OBSERVED.map((o, i) => (
            <div key={i} className="break-avoid rounded-3xl border border-white/15 bg-white/10 p-5 text-center">
              <div className="text-2xl" aria-hidden>
                {o.icon}
              </div>
              <p className="mt-1 font-display text-lg font-bold">
                <Localized value={o.title} />
              </p>
              <p className="mt-0.5 text-sm leading-snug text-white/75">
                <Localized value={o.text} />
              </p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-[680px] text-center font-display text-lg italic text-white/85">
          <Localized
            value={{
              vi: "Sự lặp lại của những chủ đề này suốt bốn năm cho thấy những thế mạnh nhận thức ổn định, chứ không phải thành tích đơn lẻ.",
              en: "The repetition of these themes across four years suggests stable cognitive strengths, not isolated achievements.",
            }}
          />
        </p>
      </section>

      {/* CORE COGNITIVE PROFILE */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <SectionHead
          eyebrow={{ vi: "Hồ sơ năng lực nhận thức cốt lõi", en: "Core cognitive profile" }}
          title={{ vi: "Một hệ thống năng lực liên kết", en: "A connected system of strengths" }}
        />
        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-black/5 bg-cream p-6 shadow-sm sm:p-8">
          {COGNITIVE.map((label, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 border-b border-black/5 py-3 last:border-0"
            >
              <span className="font-display text-base font-semibold text-ink sm:text-lg">
                <Localized value={label} />
              </span>
              <Stars n={5} />
            </div>
          ))}
        </div>
        <p className="mx-auto mt-5 max-w-[640px] text-center text-ink/70">
          <Localized
            value={{
              vi: "Đây không phải các năng lực rời rạc mà là một hệ thống liên kết — cùng nhau, chúng định hình cách Tin học, khám phá và thấu hiểu thế giới. Chúng cũng phản chiếu bản đồ năng lực trong hồ sơ của em, nơi Tư duy Khoa học, Tư duy Hình ảnh, Suy luận Logic và Tự học đều đạt mức cao nhất.",
              en: "These are not separate abilities but a connected system — together they shape how Tin learns, explores, and understands the world. They also mirror his portfolio capability map, where Scientific Thinking, Visual Thinking, Logical Reasoning and Independent Learning each rate at the top of the scale.",
            }}
          />
        </p>
      </section>

      {/* THE RECORD — achievements as corroboration */}
      <section className="px-6 py-16 sm:py-20">
        <SectionHead
          eyebrow={{ vi: "Hồ sơ thành tích", en: "The record" }}
          title={{ vi: "Thành tích củng cố mẫu hình", en: "Achievements corroborate the pattern" }}
          paras={[
            {
              vi: "Giải thưởng rất quan trọng — nhưng trong câu chuyện này, chúng là sự củng cố, không phải điểm khởi đầu. Chính sự tò mò và suy luận dẫn dắt việc khám phá hằng ngày cũng xuất hiện, một cách đo đếm được, trong hồ sơ.",
              en: "Awards are important — but in this story they are corroboration, not the starting point. The same curiosity and reasoning that drive everyday exploration also show up, measurably, in the record.",
            },
          ]}
        />
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-3 gap-3">
          {awardPhotos.map((p) => (
            <figure key={p.src} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(p.src)} alt={p.alt} loading="lazy" className="aspect-[3/4] w-full object-cover" />
            </figure>
          ))}
        </div>
        <p className="mx-auto mt-3 max-w-[620px] text-center text-sm text-ink/55">
          <Localized
            value={{
              vi: "Được vinh danh tại lớp, trên sân khấu và trong lễ tổng kết năm học — Học sinh Xuất sắc & Tinh hoa Khoa học Tự nhiên.",
              en: "Recognised in class, on stage and at the end-of-year ceremony — Excellent Student & Natural Sciences Star.",
            }}
          />
        </p>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {tally.map(([emoji, label, n]) => (
            <div key={en(label)} className="break-avoid rounded-3xl border border-black/5 bg-white p-5 text-center shadow-sm">
              <p className="text-2xl leading-none" aria-hidden>
                {emoji}
              </p>
              <p className="mt-2 font-display text-3xl font-extrabold tabular-nums text-ink">{n}</p>
              <p className="text-sm font-semibold text-ink/55">
                <Localized value={label} />
              </p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-4 grid max-w-4xl gap-3 sm:grid-cols-3">
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
        <p className="mx-auto mt-6 max-w-[640px] text-center text-sm text-ink/55">
          <Localized
            value={{
              vi: `${achievements.length} giải thưởng từ cấp trường, quốc gia đến quốc tế — kết quả ở hạ nguồn của một thói quen ở thượng nguồn: tò mò, được theo đuổi.`,
              en: `${achievements.length} honours across school, national and international Olympiads — the downstream result of an upstream habit: curiosity, pursued.`,
            }}
          />
        </p>
      </section>

      {/* LOOKING FORWARD */}
      <section className="bg-white px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow={{ vi: "Nhìn về phía trước", en: "Looking forward" }}
          title={{ vi: "Nơi hồ sơ này phát triển", en: "Where this profile thrives" }}
          paras={[
            {
              vi: "Sở thích sẽ đổi thay và những đam mê mới sẽ xuất hiện, nhưng một số mẫu hình vẫn ổn định: khát khao thấu hiểu bền bỉ, xu hướng điều tra thay vì chấp nhận câu trả lời có sẵn, và thói quen quan sát kỹ trước khi kết luận. Những điều này cho thấy tiềm năng lớn trong các môi trường khuyến khích:",
              en: "Interests evolve and new passions emerge, but certain patterns remain stable: a persistent desire to understand, a tendency to investigate rather than accept answers, and a habit of observing carefully before concluding. These suggest strong potential in environments that encourage:",
            },
          ]}
        />
        <div className="mt-8">
          <Chips items={ENVIRONMENTS} />
        </div>
      </section>

      {/* FINAL REFLECTION + ASSESSMENT */}
      <section className="bg-brand px-6 py-20 text-center text-white sm:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <Localized value={{ vi: "Suy ngẫm cuối", en: "Final reflection" }} />
          </p>
          <div className="mb-8">
            <FlowChain items={ARC} dark />
          </div>
          <p className="mx-auto max-w-xl text-white/80">
            <Localized
              value={{
                vi: "Câu chuyện không chủ yếu nói về giải thưởng, điểm số hay sự ghi nhận. Những thành tích ấy quan trọng — nhưng không phải khởi đầu. Nó bắt đầu từ sự tò mò, rồi trở thành tìm tòi, dẫn đến điều tra, và tiếp tục làm sâu sắc thêm sự thấu hiểu.",
                en: "The story is not primarily about awards, grades, or recognition. Those achievements matter — but they are not the beginning. It begins with curiosity, which became inquiry, which led to investigation, which continues to deepen understanding.",
              }}
            />
          </p>

          <div className="mx-auto mt-10 max-w-xl rounded-3xl border-l-4 border-accent bg-white/10 p-6 text-left backdrop-blur-sm sm:p-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              <Localized value={{ vi: "Đánh giá cuối cùng", en: "Final assessment" }} />
            </p>
            <div className="space-y-4 font-display text-lg leading-snug">
              <p>
                <Localized
                  value={{
                    vi: "Tin thể hiện hình mẫu của một người học trẻ mà sự phát triển được dẫn dắt bởi tò mò, định hướng bởi truy vấn, và củng cố qua quan sát.",
                    en: "Tin demonstrates the profile of a young learner whose development is driven by curiosity, guided by inquiry, and strengthened through observation.",
                  }}
                />
              </p>
              <p>
                <Localized
                  value={{
                    vi: "Tư duy hình ảnh của em không chỉ là một kỹ năng sáng tạo, mà là một công cụ thiết yếu cho việc điều tra và thấu hiểu.",
                    en: "His visual thinking is not merely a creative skill, but an essential tool for investigation and understanding.",
                  }}
                />
              </p>
              <p>
                <Localized
                  value={{
                    vi: "Bằng Tư duy Khoa học và Tư duy Hình ảnh, em tiếp tục khám phá thế giới với khát khao không chỉ biết nhiều hơn, mà thấu hiểu sâu hơn cách mọi thứ vận hành.",
                    en: "Through Scientific Inquiry and Visual Thinking, he continues to explore the world with a desire not simply to know more, but to understand more deeply how things work.",
                  }}
                />
              </p>
            </div>
          </div>

          <div className="no-print mt-10 flex flex-wrap items-center justify-center gap-3">
            <PrintLink />
            <Link
              href="/"
              className="rounded-2xl border border-white/30 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
            >
              <Localized value={{ vi: "← Về trang Giới thiệu", en: "← Back to the intro" }} />
            </Link>
          </div>
          <p className="mx-auto mt-8 max-w-md text-xs leading-relaxed text-white/55">
            <Localized
              value={{
                vi: "Một bản đánh giá độc lập do AI tạo ra, tổng hợp từ hồ sơ, nhận xét giáo viên và tài liệu portfolio hiện có — nhằm mô tả các mẫu hình học tập quan sát được, không phải một đánh giá tâm lý chính thức.",
                en: "An independent assessment generated by AI as a synthesis of existing records, teacher evaluations and portfolio materials — intended to describe observed learning patterns, not as a formal psychometric evaluation.",
              }}
            />
          </p>
        </div>
      </section>
    </main>
  );
}
