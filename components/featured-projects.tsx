import { ProjectListItem } from "@/components/project-list-item";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/data";

export function FeaturedProjects() {
  return (
    <section className="bg-paper px-5 py-24 transition-colors dark:bg-charcoal md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted">Featured Projects</p>
              <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-tight text-balance md:text-7xl">
                Selected work across scales and climates.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-muted">
              A rotating sample of cultural, residential, interior, exterior, and landscape studies.
            </p>
          </div>
        </Reveal>
        <div className="grid">
          {projects.slice(0, 6).map((project) => (
            <ProjectListItem key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
