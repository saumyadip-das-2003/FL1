"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ProjectListItem } from "@/components/project-list-item";
import { categories, projects, type ProjectCategory } from "@/lib/data";

type Filter = "All" | ProjectCategory;

export function ProjectsBrowser({ initialCategory }: { initialCategory?: ProjectCategory }) {
  const [active, setActive] = useState<Filter>(initialCategory ?? "All");
  const [query, setQuery] = useState("");
  const filters: Filter[] = ["All", ...categories];

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory = active === "All" || project.category === active;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [project.title, project.location, project.category, project.year, project.excerpt, project.description]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [active, query]);

  return (
    <section className="bg-paper px-5 pb-24 pt-32 transition-colors dark:bg-charcoal md:px-8 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Portfolio</p>
          <h1 className="mt-5 font-serif text-6xl leading-[0.98] text-balance md:text-8xl">
            Work organized by type, atmosphere, and public intent.
          </h1>
        </div>

        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className="flex gap-6 overflow-x-auto border-b border-black/10 pb-1 dark:border-white/10">
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
          <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-muted">
            Search projects
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, place, year, category"
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
