import type { Metadata } from "next";
import {
  getProfile,
  getAchievements,
  getAcademic,
  getSignature,
  getOverall,
  getSkillsRadar,
  getCharacter,
  getTeacherInsights,
  getTeacherComments,
  getJourney,
  getGallery,
  getProjects,
} from "@/lib/content";
import type { L } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Đào Đình Hữu (Tin) — Full profile",
  description:
    "The complete record: strengths, skills, achievements, four-year academic results, Cambridge attributes and teacher comments for Đào Đình Hữu (Tin).",
};
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Snapshot, type Stat } from "@/components/Snapshot";
import { OverallEval } from "@/components/OverallEval";
import { Signature } from "@/components/Signature";
import { Strengths } from "@/components/Strengths";
import { RadarChart } from "@/components/RadarChart";
import { Achievements } from "@/components/Achievements";
import { Academic } from "@/components/Academic";
import { Character } from "@/components/Character";
import { TeacherInsights } from "@/components/TeacherInsights";
import { TeacherComments } from "@/components/TeacherComments";
import { Timeline } from "@/components/Timeline";
import { Gallery } from "@/components/Gallery";
import { ProjectCard } from "@/components/ProjectCard";
import { Localized } from "@/components/Localized";
import { LangToggle } from "@/components/LangToggle";
import { PrintButton } from "@/components/PrintButton";
import { SectionNav, type NavItem } from "@/components/SectionNav";
import Link from "next/link";

function ChipRow({ label, items }: { label: L; items: L[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-sm font-semibold text-ink/50">
        <Localized value={label} />
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((it, i) => (
          <span
            key={i}
            className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-sm"
          >
            <Localized value={it} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const profile = getProfile();
  const achievements = getAchievements();
  const academic = getAcademic();
  const signature = getSignature();
  const overall = getOverall();
  const skillsRadar = getSkillsRadar();
  const character = getCharacter();
  const teacherInsights = getTeacherInsights();
  const teacherComments = getTeacherComments();
  const journey = getJourney();
  const gallery = getGallery();
  const projects = getProjects();

  // Headline stats, derived from the data so they always stay accurate.
  const isQGorQT = (c: string) => c === "international" || c === "national";
  const medalCount = achievements.filter((a) => isQGorQT(a.category)).length;
  const goldCount = achievements.filter(
    (a) => isQGorQT(a.category) && a.medal === "gold",
  ).length;
  const stats: Stat[] = [
    {
      value: String(medalCount),
      label: { vi: "HC Olympic · QG & QT", en: "Olympiad medals · Nat'l & Int'l" },
    },
    {
      value: String(goldCount),
      label: { vi: "HC Vàng cấp Quốc gia", en: "National gold medals" },
    },
    {
      value: String(academic.length),
      label: { vi: "Năm Học sinh Xuất sắc", en: "Years as Excellent Student" },
    },
    {
      value: character.level.code,
      label: { vi: "Cambridge · mức cao nhất", en: "Cambridge · top level" },
    },
  ];

  const navItems: NavItem[] = [
    { id: "about", label: { vi: "Giới thiệu", en: "About" } },
    { id: "strengths", label: { vi: "Điểm mạnh", en: "Strengths" } },
    { id: "signature", label: { vi: "Độc đáo", en: "Signature" } },
    { id: "radar", label: { vi: "Năng lực", en: "Skills" } },
    { id: "achievements", label: { vi: "Thành tích", en: "Achievements" } },
    { id: "academic", label: { vi: "Học tập", en: "Academics" } },
    { id: "character", label: { vi: "Phẩm chất", en: "Attributes" } },
    ...(gallery.length > 0
      ? [{ id: "gallery", label: { vi: "Tranh vẽ", en: "Artwork" } }]
      : []),
    ...(journey.length > 0
      ? [{ id: "journey", label: { vi: "Hành trình", en: "Journey" } }]
      : []),
    ...(teacherComments.length > 0
      ? [{ id: "comments", label: { vi: "Nhận xét", en: "Comments" } }]
      : []),
    { id: "overview", label: { vi: "Đánh giá", en: "Overview" } },
  ];

  return (
    <>
      <header className="no-print sticky top-0 z-20 border-b border-black/5 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-5 py-2 sm:px-8">
          <span className="truncate font-display text-sm font-bold text-ink/80">
            Đào Đình Hữu (Tin)
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-full border border-brand/20 px-3 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/5 sm:inline-flex"
            >
              <span data-lang="vi">← Câu chuyện</span>
              <span data-lang="en">← Story</span>
            </Link>
            <LangToggle />
            <PrintButton compact />
          </div>
        </div>
        {/* Mobile / tablet: horizontal scrollable nav (desktop uses the side TOC) */}
        <div className="mx-auto w-full max-w-6xl px-5 pb-1.5 sm:px-8 lg:hidden">
          <SectionNav items={navItems} variant="horizontal" />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl justify-center gap-6 px-5 sm:px-8 lg:gap-10">
        {/* Desktop: sticky table-of-contents on the left */}
        <aside className="no-print hidden w-44 shrink-0 pt-8 lg:block">
          <div className="sticky top-24">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-ink/40">
              <span data-lang="vi">Mục lục</span>
              <span data-lang="en">Contents</span>
            </p>
            <SectionNav items={navItems} variant="vertical" />
          </div>
        </aside>

        <main className="w-full min-w-0 max-w-3xl py-8">
          <Hero profile={profile} />

        <div className="mb-10">
          <Snapshot stats={stats} />
        </div>

        <Section id="about" title={{ vi: "Giới thiệu", en: "About" }}>
          <p className="mb-4 leading-relaxed text-ink/70">
            <Localized value={profile.bio} />
          </p>
          <ChipRow
            label={{ vi: "Tính cách", en: "Personality" }}
            items={profile.personality}
          />
          <ChipRow label={{ vi: "Kỹ năng", en: "Skills" }} items={profile.skills} />
          <ChipRow
            label={{ vi: "Sở thích", en: "Interests" }}
            items={profile.interests}
          />
        </Section>

        <Section
          id="strengths"
          title={{ vi: "Điểm mạnh nổi bật", en: "Key Strengths" }}
          subtitle={{
            vi: "Bốn thế mạnh được chứng minh bằng kết quả thực tế",
            en: "Four strengths, each backed by real results",
          }}
        >
          <Strengths items={profile.strengths} />
        </Section>

        <Section
          id="signature"
          title={{ vi: "Một tổ hợp ít gặp", en: "An Uncommon Combination" }}
          subtitle={{
            vi: "Logic + Nghệ thuật + Ngôn ngữ → một hướng đi nhiều hứa hẹn",
            en: "Logic + Art + Language → a promising direction",
          }}
        >
          <Signature data={signature} />
        </Section>

        <Section
          id="radar"
          title={{ vi: "Bản đồ năng lực", en: "Skills Map" }}
          subtitle={{
            vi: "Một hồ sơ toàn diện — mạnh ở Khoa học, vững đều các mặt",
            en: "A well-rounded profile — peak in Science, strong across the board",
          }}
        >
          <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <RadarChart data={skillsRadar} />
          </div>
        </Section>

        <Section
          id="achievements"
          title={{ vi: "Thành tích nổi bật", en: "Achievements" }}
          subtitle={{
            vi: "Hành trình thi đấu từ cấp trường đến đấu trường quốc tế",
            en: "A competitive journey from school contests to the international stage",
          }}
        >
          <Achievements items={achievements} />
        </Section>

        <Section
          id="academic"
          title={{ vi: "Kết quả học tập", en: "Academic Record" }}
          subtitle={{
            vi: "Chương trình Cambridge · Vinschool The Harmony",
            en: "Cambridge programme · Vinschool The Harmony",
          }}
        >
          <Academic data={academic} />
        </Section>

        <Section
          id="character"
          title={{ vi: "Phẩm chất Cambridge", en: "Cambridge Learner Attributes" }}
          subtitle={{
            vi: "Đạt mức cao nhất (C) ở mọi tiêu chí, cả 4 năm học",
            en: "Top level (C) on every attribute, across all 4 years",
          }}
        >
          <Character data={character} />
        </Section>

        {projects.length > 0 && (
          <Section
            id="projects"
            title={{ vi: "Dự án & Hoạt động", en: "Projects & Activities" }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </Section>
        )}

        {gallery.length > 0 && (
          <Section
            id="gallery"
            title={{ vi: "Năng lực sáng tạo", en: "Creative Work" }}
            subtitle={{
              vi: "Tranh đoạt giải & ký họa khủng long → Science Visualization",
              en: "Award-winning art & dinosaur sketches → science visualization",
            }}
          >
            <Gallery items={gallery} />
          </Section>
        )}

        {journey.length > 0 && (
          <Section
            id="journey"
            title={{ vi: "Hành trình phát triển", en: "Growth Journey" }}
            subtitle={{
              vi: "Xu hướng phát triển nhất quán qua 4 năm, Lớp 1 → Lớp 4",
              en: "A consistent trajectory across four years, Grade 1 → Grade 4",
            }}
          >
            <Timeline items={journey} />
          </Section>
        )}

        {teacherComments.length > 0 && (
          <Section
            id="comments"
            title={{ vi: "Nhận xét của giáo viên", en: "Teacher Comments" }}
            subtitle={{
              vi: "Phân tích điểm mạnh từ học bạ Cambridge 4 năm",
              en: "Strengths synthesised from four years of Cambridge reports",
            }}
          >
            <TeacherInsights data={teacherInsights} />
            <details className="break-avoid">
              <summary className="mb-3 cursor-pointer list-none text-sm font-semibold text-brand">
                <span data-lang="vi">▸ Xem nhận xét chi tiết theo năm</span>
                <span data-lang="en">▸ Read the full comments by year</span>
              </summary>
              <TeacherComments data={teacherComments} />
            </details>
          </Section>
        )}

        <Section
          id="overview"
          title={{ vi: "Đánh giá tổng thể", en: "Overall Assessment" }}
          subtitle={{
            vi: "Kết luận tổng hợp từ nhận xét giáo viên & kết quả học tập 4 năm",
            en: "An overall conclusion synthesised from four years of reports & results",
          }}
        >
          <OverallEval data={overall} />
        </Section>

        <footer className="mt-10 break-avoid rounded-3xl border border-brand/10 bg-white p-5 text-center shadow-sm">
          <p className="font-display text-lg font-bold text-ink">
            <span data-lang="vi">Tìm hiểu thêm về hành trình của Tin?</span>
            <span data-lang="en">Want to know more about Tin&apos;s journey?</span>
          </p>
          <div className="no-print mt-3 flex flex-wrap justify-center gap-2">
            <PrintButton />
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-brand/25 px-4 text-base font-semibold text-brand transition-colors hover:bg-brand/5"
            >
              <span data-lang="vi">← Về trang câu chuyện</span>
              <span data-lang="en">← Back to the story</span>
            </Link>
          </div>
          <p className="mt-3 text-sm text-ink/55">
            <span data-lang="vi">Liên hệ: </span>
            <span data-lang="en">Contact: </span>
            {profile.contact.name}
            {profile.contact.email ? ` · ${profile.contact.email}` : ""}
          </p>
        </footer>
        </main>
      </div>
    </>
  );
}
