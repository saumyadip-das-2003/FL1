import { ProjectsBrowser } from "@/components/projects-browser";
import { adminProjectToProject, getLiveContent } from "@/lib/live-content";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const content = await getLiveContent();
  const projects = content.projects.map(adminProjectToProject);

  return <ProjectsBrowser projects={projects} />;
}
