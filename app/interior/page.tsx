import { ProjectsBrowser } from "@/components/projects-browser";
import { adminProjectToProject, getLiveContent } from "@/lib/live-content";
import { normalizeProjectTaxonomy } from "@/lib/data";

export default async function InteriorPage() {
  const content = await getLiveContent();
  const projects = content.projects.map(adminProjectToProject);
  const projectSubsections = normalizeProjectTaxonomy(content.settings.projectSubsections);

  return <ProjectsBrowser initialCategory="Interior" projects={projects} projectSubsections={projectSubsections} />;
}
