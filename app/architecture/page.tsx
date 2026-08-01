import { ProjectsBrowser } from "@/components/projects-browser";
import { adminProjectToProject, getLiveContent } from "@/lib/live-content";
import { normalizeProjectTaxonomy } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ArchitecturePage() {
  const content = await getLiveContent();
  const projects = content.projects.map(adminProjectToProject);
  const projectSubsections = normalizeProjectTaxonomy(content.settings.projectSubsections);

  return <ProjectsBrowser initialCategory="Architecture" projects={projects} projectSubsections={projectSubsections} />;
}
