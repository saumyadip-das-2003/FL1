"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ProjectListItem } from "@/components/project-list-item";
import { projectTaxonomy, projects, type ProjectCategory, type ProjectSection } from "@/lib/data";

const sections = Object.keys(projectTaxonomy) as ProjectSection[];

function sectionFromCategory(category?: ProjectCategory): ProjectSection {
  if (category === "Interior") {
    return "Interiors";
  }

  if (category === "Landscape") {
    return "Landscape";
  }

  return "Architecture";
}

export function ProjectsBrowser({ initialCategory }: { initialCategory?: ProjectCategory }) {
  const [activeSection, setActiveSection] = useState<ProjectSection>(sectionFromCategory(initialCategory));
  const [activeSubsection, setActiveSubsection] = useState<string>("All");
  const [query, setQuery] = useState("");
  const subsections = projectTaxonomy[activeSection];

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const section = project.section ?? sectionFromCategory(project.category);
      const matchesSection = section === activeSection;
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
  }, [activeSection, activeSubsection, query]);

  return (
    <section className="bg-paper px-5 pb-24 pt-32 transition-colors dark:bg-charcoal md:px-8 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Portfolio</p>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-balance md:text-6xl">
            Work organized by type, atmosphere, and public intent.
          </h1>
        </div>

        <div className="mb-12 grid gap-8">
          <div className="border-y border-black/10 py-5 dark:border-white/10">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-5">
              {sections.map((section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => {
                    setActiveSection(section);
                    setActiveSubsection("All");
                  }}
                  className="flex items-center justify-center gap-2 whitespace-nowrap text-sm uppercase tracking-normal text-muted transition hover:text-ink dark:hover:text-paper md:text-base"
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
                className="mt-7 flex flex-wrap justify-center gap-x-10 gap-y-4"
              >
                {subsections.map((subsection) => (
                  <button
                    key={subsection}
                    type="button"
                    onClick={() => setActiveSubsection(activeSubsection === subsection ? "All" : subsection)}
                    className={`text-sm transition hover:text-ink dark:hover:text-paper md:text-base ${
                      activeSubsection === subsection ? "text-ink dark:text-paper" : "text-muted"
                    }`}
                  >
                    {subsection}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <label className="ml-auto grid w-full max-w-md gap-2 text-xs uppercase tracking-[0.2em] text-muted">
            Search projects
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, place, section, typology"
              className="h-12 border border-black/15 bg-transparent px-4 text-base normal-case tracking-normal text-ink outline-none transition placeholder:text-muted/65 focus:border-ink dark:border-white/15 dark:text-paper dark:focus:border-paper"
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
