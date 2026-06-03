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

  return (
    <>
      <div className="no-print sticky top-0 z-10 flex items-center justify-end gap-2 border-b border-black/5 bg-cream/80 px-5 py-2 backdrop-blur">
        <LangToggle />
        <PrintButton />
      </div>

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8 sm:px-8">
        <Hero profile={profile} />

        <Section id="about" title={{ vi: "Giới thiệu", en: "About" }}>
          <p className="mb-4 leading-relaxed text-ink/70">
            <Localized value={profile.bio} />
          </p>
          <ChipRow
            label={{ vi: "Tính cách", en: "Personality" }}
            items={profile.personality}
          />
          <ChipRow
            label={{ vi: "Kỹ năng", en: "Skills" }}
            items={profile.skills}
          />
          <ChipRow
            label={{ vi: "Sở thích", en: "Interests" }}
            items={profile.interests}
          />
        </Section>

        <Section
          id="academic"
          title={{ vi: "Kết quả học tập", en: "Academic Record" }}
        >
          <p className="-mt-2 mb-4 text-sm font-medium text-ink/50">
            <Localized
              value={{
                vi: "Chương trình Cambridge · Vinschool The Harmony",
                en: "Cambridge programme · Vinschool The Harmony",
              }}
            />
          </p>
          <Academic data={academic} />
        </Section>

        <Section
          id="character"
          title={{ vi: "Phẩm chất Cambridge", en: "Cambridge Learner Attributes" }}
        >
          <Character data={character} />
        </Section>

        <Section
          id="achievements"
          title={{ vi: "Thành tích nổi bật", en: "Achievements" }}
        >
          <Achievements items={achievements} />
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
            title={{ vi: "Thư viện ảnh & video", en: "Media Gallery" }}
          >
            <Gallery items={gallery} />
          </Section>
        )}

        {teacherComments.length > 0 && (
          <Section
            id="comments"
            title={{ vi: "Nhận xét của giáo viên", en: "Teacher Comments" }}
          >
            <p className="-mt-2 mb-4 text-sm text-ink/45">
              <span data-lang="vi">Trích học bạ Cambridge · nhấn để mở từng năm</span>
              <span data-lang="en">From Cambridge report cards · tap a year to expand</span>
            </p>
            <TeacherComments data={teacherComments} />
          </Section>
        )}

        <footer className="mt-8 border-t border-black/5 pt-4 text-sm text-ink/50">
          <span data-lang="vi">Liên hệ: </span>
          <span data-lang="en">Contact: </span>
          {profile.parentContact.name}
          {profile.parentContact.email
            ? ` · ${profile.parentContact.email}`
            : ""}
        </footer>
      </main>
    </>
  );
}
