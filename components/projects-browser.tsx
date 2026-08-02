"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ProjectListItem } from "@/components/project-list-item";
import { projectTaxonomy, projects as fallbackProjects, type Project, type ProjectCategory, type ProjectSection } from "@/lib/data";

const sections = Object.keys(projectTaxonomy) as ProjectSection[];
type SectionFilter = ProjectSection | "All";

function sectionFromCategory(category?: ProjectCategory): SectionFilter {
  if (!category) {
    return "All";
  }

  if (category === "Interior") {
    return "Interiors";
  }

  if (category === "Landscape") {
    return "Landscape";
  }

  return "Architecture";
}

export function ProjectsBrowser({
  initialCategory,
  projects = fallbackProjects,
  projectSubsections = projectTaxonomy
}: {
  initialCategory?: ProjectCategory;
  projects?: Project[];
  projectSubsections?: Record<ProjectSection, string[]>;
}) {
  const [activeSection, setActiveSection] = useState<SectionFilter>(sectionFromCategory(initialCategory));
  const [activeSubsection, setActiveSubsection] = useState<string>("All");
  const [query, setQuery] = useState("");
  const subsections = useMemo(() => {
    if (activeSection === "All") {
      return [];
    }

    const staticSubsections = projectSubsections[activeSection] ?? [];
    const liveSubsections = projects
      .filter((project) => (project.section ?? sectionFromCategory(project.category)) === activeSection)
      .map((project) => project.subsection?.trim())
      .filter((subsection): subsection is string => Boolean(subsection));

    return Array.from(new Set([...staticSubsections, ...liveSubsections]));
  }, [activeSection, projectSubsections, projects]);

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const section = project.section ?? sectionFromCategory(project.category);
      const matchesSection = activeSection === "All" || section === activeSection;
      const matchesSubsection = activeSubsection === "All" || project.subsection === activeSubsection;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          project.title,
          project.location,
          project.category,
          project.section,
          project.subsection,
          project.year,
          project.excerpt,
          project.description
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesSection && matchesSubsection && matchesQuery;
    });
  }, [activeSection, activeSubsection, projects, query]);

  return (
    <section className="site-page bg-paper transition-colors dark:bg-charcoal">
      <div className="mx-auto w-full max-w-[1560px]">
        <div className="mb-10 max-w-4xl md:mb-12">
          <p className="site-eyebrow">Portfolio</p>
          <h1 className="site-page-title mt-5">
            Work organized by type, atmosphere, and public intent.
          </h1>
        </div>

        <div className="mb-12 grid gap-6 md:gap-8">
          <div className="min-w-0 border-y border-black/10 py-4 dark:border-white/10 md:py-5">
            <div className="no-scrollbar -mx-5 flex min-w-0 items-center gap-7 overflow-x-auto px-5 pb-1 md:mx-0 md:justify-between md:gap-10 md:px-0">
              {(["All", ...sections] as SectionFilter[]).map((section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => {
                    setActiveSection(section);
                    setActiveSubsection("All");
                  }}
                  className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-sm uppercase tracking-normal text-muted transition hover:text-ink dark:hover:text-paper md:text-base"
                >
                  {activeSection === section && (
                    <motion.span
                      layoutId="project-section-marker"
                      className="h-1.5 w-1.5 bg-ink dark:bg-paper"
                    />
                  )}
                  <span className={activeSection === section ? "text-ink dark:text-paper" : ""}>{section}</span>
                </button>
              ))}
            </div>

            {subsections.length > 0 && (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="no-scrollbar -mx-5 mt-5 flex min-w-0 items-center gap-6 overflow-x-auto px-5 pb-1 md:mx-0 md:mt-7 md:flex-wrap md:justify-center md:gap-x-10 md:gap-y-4 md:px-0"
              >
                {["All", ...subsections].map((subsection) => (
                  <button
                    key={subsection}
                    type="button"
                    onClick={() => setActiveSubsection(subsection)}
                    className={`shrink-0 whitespace-nowrap text-sm transition hover:text-ink dark:hover:text-paper md:text-base ${
                      activeSubsection === subsection ? "text-ink dark:text-paper" : "text-muted"
                    }`}
                  >
                    {subsection}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <label className="grid w-full min-w-0 gap-2 text-[11px] uppercase tracking-[0.16em] text-muted md:ml-auto md:max-w-md md:text-xs md:tracking-[0.2em]">
            Search projects
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, place, section, typology"
              className="h-12 w-full min-w-0 border border-black/15 bg-transparent px-4 text-base normal-case tracking-normal text-ink outline-none transition placeholder:text-muted/65 focus:border-ink dark:border-white/15 dark:text-paper dark:focus:border-paper"
            />
          </label>
        </div>

        <motion.div layout className="grid">
          {visibleProjects.map((project) => (
            <ProjectListItem key={project.slug} project={project} />
          ))}
          {visibleProjects.length === 0 && (
            <div className="border-y border-black/10 py-16 text-muted dark:border-white/10">
              No projects match the current search and filter.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
