"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, ExternalLink, Minus, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

const placeholderVideoId = "OP_fVIUTr9Y";

export function ProjectListItem({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const [activeImage, setActiveImage] = useState(project.image);
  const images = useMemo(() => [project.image, ...project.gallery], [project.gallery, project.image]);

  return (
    <motion.article
      layout
      className="border-t border-black/10 py-6 last:border-b dark:border-white/10"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid gap-5 md:grid-cols-[190px_1fr_auto] md:items-center">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="group relative aspect-[16/10] overflow-hidden bg-black md:aspect-[5/4]"
          aria-label={`Expand ${project.title}`}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 190px, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
            <Search className="text-paper" size={22} />
          </div>
        </button>

        <button type="button" onClick={() => setExpanded((value) => !value)} className="text-left">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">{project.category} / {project.year}</p>
          <h2 className="mt-2 font-serif text-4xl leading-tight transition hover:text-muted md:text-5xl">
            {project.title}
          </h2>
          <p className="mt-2 text-sm text-muted">{project.location}</p>
        </button>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex h-11 w-11 items-center justify-center border border-black/15 transition hover:bg-ink hover:text-paper dark:border-white/15 dark:hover:bg-paper dark:hover:text-ink"
          aria-label={expanded ? `Minimize ${project.title}` : `Expand ${project.title}`}
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
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="min-w-0">
                <motion.div layout className="relative aspect-[16/10] overflow-hidden bg-black">
                  <Image
                    src={activeImage}
                    alt={`${project.title} expanded image`}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                    priority
                  />
                </motion.div>
                <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      className={cn(
                        "relative h-20 w-32 shrink-0 overflow-hidden border transition",
                        activeImage === image ? "border-ink dark:border-paper" : "border-black/10 opacity-65 hover:opacity-100 dark:border-white/10"
                      )}
                    >
                      <Image src={image} alt={`${project.title} thumbnail ${index + 1}`} fill sizes="128px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-6 flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted">Expanded Study</p>
                    <h3 className="mt-3 font-serif text-4xl leading-tight">{project.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/15 transition hover:bg-ink hover:text-paper dark:border-white/15 dark:hover:bg-paper dark:hover:text-ink"
                    aria-label={`Minimize ${project.title}`}
                  >
                    <ChevronUp size={18} />
                  </button>
                </div>

                <dl className="grid gap-4 border-y border-black/10 py-6 text-sm dark:border-white/10">
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted">Location</dt>
                    <dd className="text-right">{project.location}</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted">Year</dt>
                    <dd>{project.year}</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted">Category</dt>
                    <dd>{project.category}</dd>
                  </div>
                </dl>

                <p className="mt-6 text-base leading-8 text-muted">{project.description}</p>

                <div className="mt-7">
                  <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted">Video</p>
                  <div className="aspect-video overflow-hidden bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${placeholderVideoId}?autoplay=0&mute=1&controls=1&modestbranding=1&rel=0`}
                      title={`${project.title} video`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="mt-7 inline-flex items-center gap-3 border border-black/20 px-5 py-3 text-xs uppercase tracking-[0.2em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink"
                >
                  Open detail page <ExternalLink size={15} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
