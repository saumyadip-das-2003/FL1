"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { team } from "@/lib/data";

type Person = (typeof team)[number];
type PeopleFilter = "All" | "Design" | "Interior" | "Landscape" | "Technical";

const peopleFilters: PeopleFilter[] = ["All", "Design", "Interior", "Landscape", "Technical"];

export function PeopleGrid() {
  const [activeName, setActiveName] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PeopleFilter>("All");

  const visibleTeam = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return team.filter((member) => {
      const searchable = [member.name, member.role, member.bio].join(" ").toLowerCase();
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesFilter =
        filter === "All" ||
        (filter === "Design" && /design|founding|project|visualization/i.test(member.role)) ||
        (filter === "Interior" && /interior/i.test(member.role)) ||
        (filter === "Landscape" && /landscape|sustainability/i.test(member.role)) ||
        (filter === "Technical" && /technical|sustainability/i.test(member.role));

      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  return (
    <div className="mt-16">
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
        <div className="flex gap-6 overflow-x-auto border-b border-black/10 pb-1 dark:border-white/10">
          {peopleFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className="relative whitespace-nowrap pb-4 text-xs uppercase tracking-[0.22em] text-muted transition hover:text-ink dark:hover:text-paper"
            >
              {item}
              {filter === item && (
                <motion.span
                  layoutId="people-filter"
                  className="absolute bottom-0 left-0 h-px w-full bg-ink dark:bg-paper"
                />
              )}
            </button>
          ))}
        </div>
        <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-muted">
          Search employees
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, role, expertise"
            className="h-12 border border-black/15 bg-transparent px-4 text-base normal-case tracking-normal text-ink outline-none transition placeholder:text-muted/65 focus:border-ink dark:border-white/15 dark:text-paper dark:focus:border-paper"
          />
        </label>
      </div>

      <div className="border-t border-black/10 dark:border-white/10">
        {visibleTeam.map((member: Person) => {
          const expanded = activeName === member.name;

          return (
            <motion.article
              layout
              key={member.name}
              className="border-b border-black/10 py-6 dark:border-white/10"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between gap-6">
                <button
                  type="button"
                  onClick={() => setActiveName(expanded ? null : member.name)}
                  className="text-left"
                >
                  <h2 className="font-serif text-3xl leading-tight transition hover:text-muted md:text-4xl">
                    {member.name}
                  </h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted">{member.role}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveName(expanded ? null : member.name)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/15 transition hover:bg-ink hover:text-paper dark:border-white/15 dark:hover:bg-paper dark:hover:text-ink"
                  aria-label={expanded ? `Collapse ${member.name}` : `Expand ${member.name}`}
                >
                  {expanded ? <Minus size={18} /> : <Plus size={18} />}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    layout
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-8 grid gap-8 md:grid-cols-[320px_1fr] md:items-start">
                      <div className="relative aspect-[4/5] overflow-hidden bg-black">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="(min-width: 768px) 320px, 100vw"
                          className="object-cover grayscale"
                        />
                      </div>
                      <div className="max-w-2xl">
                        <p className="font-serif text-2xl leading-tight">{member.role}</p>
                        <p className="mt-5 text-base leading-8 text-muted">{member.bio}</p>
                        <div className="mt-8 grid gap-4 border-y border-black/10 py-6 text-sm dark:border-white/10">
                          <p className="flex justify-between gap-5">
                            <span className="text-muted">Studio</span>
                            <span>Atelier Northline</span>
                          </p>
                          <p className="flex justify-between gap-5">
                            <span className="text-muted">Office</span>
                            <span>Dhaka / Singapore</span>
                          </p>
                          <p className="flex justify-between gap-5">
                            <span className="text-muted">Profile</span>
                            <span>Placeholder employee details</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
        {visibleTeam.length === 0 && (
          <div className="border-b border-black/10 py-16 text-muted dark:border-white/10">
            No employees match the current search.
          </div>
        )}
      </div>
    </div>
  );
}
