import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LightboxGallery } from "@/components/lightbox-gallery";
import { ProjectListItem } from "@/components/project-list-item";
import { Reveal } from "@/components/reveal";
import { getNextProject } from "@/lib/utils";
import { projects } from "@/lib/data";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextProject(project.slug);
  const placeholderVideoId = "OP_fVIUTr9Y";

  return (
    <main className="bg-paper pt-20 transition-colors dark:bg-charcoal">
      <section className="relative min-h-[78vh] overflow-hidden bg-black">
        <Image src={project.image} alt={project.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/24 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-8 md:pb-16">
          <div className="mx-auto max-w-7xl text-paper">
            <p className="mb-5 text-xs uppercase tracking-[0.28em] text-white/70">
              {project.category} / {project.year}
            </p>
            <h1 className="max-w-5xl font-serif text-6xl leading-none text-balance md:text-8xl">{project.title}</h1>
            <p className="mt-5 text-lg text-white/75">{project.location}</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 md:py-28">
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
            <p className="font-serif text-4xl leading-tight text-balance md:text-6xl">{project.excerpt}</p>
            <p className="mt-8 max-w-3xl text-lg leading-9 text-muted">{project.description}</p>
          </Reveal>
        </div>
      </section>

      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-end justify-between gap-6">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Project Film</p>
            <p className="hidden text-sm text-muted md:block">Placeholder video position</p>
          </div>
          <div className="aspect-video overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${placeholderVideoId}?autoplay=0&mute=1&controls=1&modestbranding=1&rel=0`}
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

      <section className="border-t border-black/10 px-5 py-20 dark:border-white/10 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href={`/projects/${nextProject.slug}`} className="mb-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-muted">
            Next project <ArrowRight size={16} />
          </Link>
          <ProjectListItem project={nextProject} />
        </div>
      </section>
    </main>
  );
}
