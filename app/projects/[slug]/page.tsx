import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LightboxGallery } from "@/components/lightbox-gallery";
import { ProjectListItem } from "@/components/project-list-item";
import { Reveal } from "@/components/reveal";
import { adminProjectToProject, getLiveContent } from "@/lib/live-content";
import { getYouTubeId } from "@/lib/youtube";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const content = await getLiveContent();
  const projects = content.projects.map(adminProjectToProject);
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) {
    notFound();
  }

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length] ?? project;
  const projectVideo = project.video ?? "https://youtu.be/OP_fVIUTr9Y";
  const videoId = getYouTubeId(projectVideo);

  return (
    <main className="bg-paper pt-20 transition-colors dark:bg-charcoal">
      <section className="relative min-h-[62svh] overflow-hidden bg-black md:min-h-[78vh]">
        <Image src={project.image} alt={project.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/24 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-8 md:pb-16">
          <div className="mx-auto max-w-7xl text-paper">
            <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-white/75 md:mb-5 md:text-xs md:tracking-[0.28em]">
              {project.category} / {project.year}
            </p>
            <h1 className="max-w-5xl font-serif text-[2.35rem] leading-[1.02] text-balance md:text-6xl">{project.title}</h1>
            <p className="mt-4 text-base text-white/80 md:mt-5 md:text-lg">{project.location}</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div className="grid gap-6 border-y border-black/10 py-8 text-sm dark:border-white/10">
              <p className="flex justify-between gap-8">
                <span className="text-muted">Location</span>
                <span>{project.location}</span>
              </p>
              <p className="flex justify-between gap-8">
                <span className="text-muted">Year</span>
                <span>{project.year}</span>
              </p>
              <p className="flex justify-between gap-8">
                <span className="text-muted">Category</span>
                <span>{project.category}</span>
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-serif text-2xl leading-tight text-balance md:text-5xl">{project.excerpt}</p>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted md:mt-8 md:text-lg md:leading-9">{project.description}</p>
          </Reveal>
        </div>
      </section>

      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-end justify-between gap-6">
            <p className="site-eyebrow">Project Film</p>
            <p className="hidden text-sm text-muted md:block">Placeholder video position</p>
          </div>
          <div className="aspect-video overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&controls=1&modestbranding=1&rel=0`}
              title={`${project.title} video`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <LightboxGallery project={project} />
        </div>
      </section>

      <section className="border-t border-black/10 px-5 py-14 dark:border-white/10 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Link href={`/projects/${nextProject.slug}`} className="mb-8 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted md:text-xs md:tracking-[0.24em]">
            Next project <ArrowRight size={16} />
          </Link>
          <ProjectListItem project={nextProject} />
        </div>
      </section>
    </main>
  );
}
