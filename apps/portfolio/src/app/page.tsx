import {
  getProfile,
  getAchievements,
  getAcademic,
  getCharacter,
  getTeacherComments,
  getJourney,
  getGallery,
  getProjects,
} from "@/lib/content";
import type { L } from "@/lib/schemas";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Snapshot, type Stat } from "@/components/Snapshot";
import { Strengths } from "@/components/Strengths";
import { Achievements } from "@/components/Achievements";
import { Academic } from "@/components/Academic";
import { Character } from "@/components/Character";
import { TeacherComments } from "@/components/TeacherComments";
import { Timeline } from "@/components/Timeline";
import { Gallery } from "@/components/Gallery";
import { ProjectCard } from "@/components/ProjectCard";
import { Localized } from "@/components/Localized";
import { LangToggle } from "@/components/LangToggle";
import { PrintButton } from "@/components/PrintButton";
import { SectionNav, type NavItem } from "@/components/SectionNav";

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
  const character = getCharacter();
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
    { id: "achievements", label: { vi: "Thành tích", en: "Achievements" } },
    { id: "academic", label: { vi: "Học tập", en: "Academics" } },
    { id: "character", label: { vi: "Phẩm chất", en: "Attributes" } },
    ...(gallery.length > 0
      ? [{ id: "gallery", label: { vi: "Tranh vẽ", en: "Artwork" } }]
      : []),
    ...(teacherComments.length > 0
      ? [{ id: "comments", label: { vi: "Nhận xét", en: "Comments" } }]
      : []),
  ];

  return (
    <>
      <header className="no-print sticky top-0 z-20 border-b border-black/5 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-2 px-5 pt-2 sm:px-8">
          <span className="truncate font-display text-sm font-bold text-ink/80">
            Đào Đình Hữu (Tin)
          </span>
          <div className="flex items-center gap-2">
            <LangToggle />
            <PrintButton />
          </div>
        </div>
        <div className="mx-auto w-full max-w-4xl px-5 pb-1.5 sm:px-8">
          <SectionNav items={navItems} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8 sm:px-8">
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

        {journey.length > 0 && (
          <Section
            id="journey"
            title={{ vi: "Hành trình phát triển", en: "Growth Journey" }}
          >
            <Timeline items={journey} />
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

        {teacherComments.length > 0 && (
          <Section
            id="comments"
            title={{ vi: "Nhận xét của giáo viên", en: "Teacher Comments" }}
            subtitle={{
              vi: "Trích học bạ Cambridge · nhấn để mở từng năm",
              en: "From Cambridge report cards · tap a year to expand",
            }}
          >
            <TeacherComments data={teacherComments} />
          </Section>
        )}

        <footer className="mt-10 break-avoid rounded-3xl border border-brand/10 bg-white p-5 text-center shadow-sm">
          <p className="font-display text-lg font-bold text-ink">
            <span data-lang="vi">Tìm hiểu thêm về hành trình của Tin?</span>
            <span data-lang="en">Want to know more about Tin&apos;s journey?</span>
          </p>
          <div className="no-print mt-3 flex justify-center">
            <PrintButton />
          </div>
          <p className="mt-3 text-sm text-ink/55">
            <span data-lang="vi">Liên hệ: </span>
            <span data-lang="en">Contact: </span>
            {profile.parentContact.name}
            {profile.parentContact.email
              ? ` · ${profile.parentContact.email}`
              : ""}
          </p>
        </footer>
      </main>
    </>
  );
}
