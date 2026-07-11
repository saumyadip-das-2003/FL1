"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { categories, projects, type ProjectCategory } from "@/lib/data";

type Filter = "All" | ProjectCategory;

export function ProjectsBrowser({ initialCategory }: { initialCategory?: ProjectCategory }) {
  const [active, setActive] = useState<Filter>(initialCategory ?? "All");
  const filters: Filter[] = ["All", ...categories];

  const visibleProjects = useMemo(() => {
    if (active === "All") {
      return projects;
    }
    return projects.filter((project) => project.category === active);
  }, [active]);

  return (
    <section className="bg-paper px-5 pb-24 pt-32 transition-colors dark:bg-charcoal md:px-8 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Portfolio</p>
          <h1 className="mt-5 font-serif text-6xl leading-[0.98] text-balance md:text-8xl">
            Work organized by type, atmosphere, and public intent.
          </h1>
        </div>

        <div className="mb-12 flex gap-6 overflow-x-auto border-b border-black/10 pb-1 dark:border-white/10">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              className="relative whitespace-nowrap pb-4 text-xs uppercase tracking-[0.22em] text-muted transition hover:text-ink dark:hover:text-paper"
            >
              {filter}
              {active === filter && (
                <motion.span
                  layoutId="project-filter"
                  className="absolute bottom-0 left-0 h-px w-full bg-ink dark:bg-paper"
                />
              )}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} tall={index % 2 === 0} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
