import {
  getProfile,
  getAchievements,
  getJourney,
  getGallery,
  getProjects,
} from "@/lib/content";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Timeline } from "@/components/Timeline";
import { Gallery } from "@/components/Gallery";
import { ProjectCard } from "@/components/ProjectCard";
import { Localized } from "@/components/Localized";
import { LangToggle } from "@/components/LangToggle";
import { PrintButton } from "@/components/PrintButton";

export default function Home() {
  const profile = getProfile();
  const achievements = getAchievements();
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
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, i) => (
              <span
                key={i}
                className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-sm"
              >
                <Localized value={s} />
              </span>
            ))}
          </div>
        </Section>

        <Section
          id="achievements"
          title={{ vi: "Thành tích nổi bật", en: "Achievements" }}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {achievements.map((a, i) => (
              <div
                key={i}
                className="break-avoid rounded-3xl border border-black/5 bg-white p-4 shadow-sm"
              >
                <div className="mb-1 text-2xl">{a.icon}</div>
                <p className="text-xs font-semibold text-ink/40">{a.date}</p>
                <h3 className="font-bold text-ink">
                  <Localized value={a.title} />
                </h3>
                <p className="text-sm text-ink/60">
                  <Localized value={a.detail} />
                </p>
              </div>
            ))}
          </div>
        </Section>

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

        <Section
          id="journey"
          title={{ vi: "Hành trình phát triển", en: "Growth Journey" }}
        >
          <Timeline items={journey} />
        </Section>

        <Section
          id="gallery"
          title={{ vi: "Thư viện ảnh & video", en: "Media Gallery" }}
        >
          <Gallery items={gallery} />
        </Section>

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
