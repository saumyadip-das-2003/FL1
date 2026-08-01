import { ProjectListItem } from "@/components/project-list-item";
import { Reveal } from "@/components/reveal";
import { adminProjectToProject, getLiveContent } from "@/lib/live-content";
import type { Project } from "@/lib/data";

function isProject(project: Project | undefined): project is Project {
  return Boolean(project);
}

export async function FeaturedProjects() {
  const content = await getLiveContent();
  const projects = content.projects.map(adminProjectToProject);
  const featuredIds = content.settings.featuredProjectIds.split(",").map((id) => id.trim()).filter(Boolean);
  const featuredProjects = featuredIds.length
    ? featuredIds.map((id) => projects.find((project) => project.slug === id)).filter(isProject)
    : projects.slice(0, 6);

  return (
    <section className="bg-paper px-5 py-24 transition-colors dark:bg-charcoal md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-[1560px]">
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
          {featuredProjects.slice(0, 6).map((project) => (
            <ProjectListItem key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
