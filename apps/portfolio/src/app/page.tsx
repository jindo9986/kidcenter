import { Button, Card } from "@kidcenter/ui";

type Highlight = { icon: string; title: string; detail: string };
type Project = { icon: string; title: string; tag: string; summary: string };

const highlights: Highlight[] = [
  { icon: "🏅", title: "Giải Nhì", detail: "Cuộc thi vẽ thiếu nhi cấp quận 2025" },
  { icon: "📚", title: "Đọc 50 cuốn sách", detail: "Thử thách đọc sách 2025" },
  { icon: "🎹", title: "Piano cấp độ 2", detail: "Hoàn thành chứng chỉ ABRSM" },
];

const projects: Project[] = [
  {
    icon: "🌱",
    title: "Vườn rau mini",
    tag: "Khám phá khoa học",
    summary:
      "Tự trồng và theo dõi quá trình lớn lên của cây trong 6 tuần, ghi nhật ký bằng hình vẽ.",
  },
  {
    icon: "🤖",
    title: "Robot giấy",
    tag: "STEM · Thủ công",
    summary:
      "Thiết kế và lắp ráp robot từ vật liệu tái chế, trình bày trước lớp.",
  },
  {
    icon: "🎭",
    title: "Kể chuyện song ngữ",
    tag: "Ngôn ngữ",
    summary:
      "Quay video kể lại truyện cổ tích bằng cả tiếng Việt và tiếng Anh.",
  },
];

const skills = ["Sáng tạo", "Tiếng Anh", "Toán tư duy", "Âm nhạc", "Làm việc nhóm"];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10 sm:px-8">
      {/* Hero */}
      <section className="mb-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-accent text-5xl shadow-sm">
          🧒
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-brand">Portfolio của bé</p>
          <h1 className="font-display text-4xl font-extrabold text-ink">
            Nguyễn Bảo Na
          </h1>
          <p className="mt-1 text-ink/60">
            6 tuổi · Yêu vẽ, âm nhạc và khám phá thiên nhiên 🌈
          </p>
        </div>
        <div className="flex gap-2">
          <Button>Tải hồ sơ PDF</Button>
          <Button variant="ghost">Liên hệ</Button>
        </div>
      </section>

      {/* Giới thiệu */}
      <Card title="Giới thiệu" icon="✨" className="mb-8">
        <p className="leading-relaxed text-ink/70">
          Bé Na là một cô bé tò mò và giàu trí tưởng tượng, thích đặt câu hỏi về
          thế giới xung quanh. Bé học tốt nhất qua trải nghiệm thực tế — trồng
          cây, làm thủ công và kể chuyện. Hồ sơ này tổng hợp những hoạt động và
          thành tích nổi bật để ứng tuyển các chương trình học phù hợp.
        </p>
      </Card>

      {/* Thành tích */}
      <h2 className="mb-3 font-display text-2xl font-bold text-ink">
        Thành tích nổi bật
      </h2>
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {highlights.map((h) => (
          <Card key={h.title} icon={h.icon} title={h.title}>
            <p className="text-sm text-ink/60">{h.detail}</p>
          </Card>
        ))}
      </div>

      {/* Dự án / Hoạt động */}
      <h2 className="mb-3 font-display text-2xl font-bold text-ink">
        Dự án & Hoạt động
      </h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <Card key={p.title} icon={p.icon} title={p.title}>
            <span className="mb-2 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
              {p.tag}
            </span>
            <p className="text-sm leading-relaxed text-ink/70">{p.summary}</p>
          </Card>
        ))}
      </div>

      {/* Kỹ năng */}
      <h2 className="mb-3 font-display text-2xl font-bold text-ink">Kỹ năng</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span
            key={s}
            className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-sm"
          >
            {s}
          </span>
        ))}
      </div>
    </main>
  );
}
