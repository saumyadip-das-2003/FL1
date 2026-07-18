"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, ExternalLink, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

const placeholderVideoId = "OP_fVIUTr9Y";

function ProjectMark({ title }: { title: string }) {
  const letters = title
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <div className="mx-auto flex h-14 w-14 items-center justify-center bg-black text-paper dark:bg-paper dark:text-ink">
      <span className="font-serif text-xl leading-none">{letters}</span>
    </div>
  );
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <dl className="mt-16 grid gap-7 text-center text-sm">
      <div>
        <dt className="text-xs uppercase tracking-[0.16em] text-muted">Year</dt>
        <dd className="mt-1 text-lg">{project.year}</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-[0.16em] text-muted">Client</dt>
        <dd className="mt-1 uppercase">Placeholder Studio</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-[0.16em] text-muted">Typology</dt>
        <dd className="mt-1 uppercase">{project.category}</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-[0.16em] text-muted">Status</dt>
        <dd className="mt-1 uppercase">Concept</dd>
      </div>
    </dl>
  );
}

export function ProjectListItem({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const [activeImage, setActiveImage] = useState(project.image);
  const images = useMemo(() => [project.image, ...project.gallery], [project.gallery, project.image]);

  return (
    <motion.article
      layout
      className="py-8 md:py-11"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto grid max-w-5xl gap-7 md:grid-cols-[210px_minmax(0,720px)] md:items-start">
        <div className="text-center md:pt-1">
          <button type="button" onClick={() => setExpanded((value) => !value)} aria-label={`Toggle ${project.title}`}>
            <ProjectMark title={project.title} />
          </button>
          <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-6 block w-full">
            <h2 className="font-sans text-xl leading-tight tracking-normal">{project.title}</h2>
            <p className="mt-3 text-sm uppercase tracking-normal text-muted">{project.location}</p>
          </button>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="mx-auto mt-8 flex h-10 w-10 items-center justify-center border border-black/15 transition hover:bg-ink hover:text-paper dark:border-white/15 dark:hover:bg-paper dark:hover:text-ink"
            aria-label={expanded ? `Minimize ${project.title}` : `Expand ${project.title}`}
          >
            {expanded ? <Minus size={18} /> : <Plus size={18} />}
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setActiveImage(project.image);
            setExpanded(true);
          }}
          className="group relative aspect-[16/10] overflow-hidden bg-black"
          aria-label={`Expand ${project.title}`}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 720px, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-11 bg-white py-8 dark:bg-[#0d0d0d] md:py-12">
              <div className="mx-auto grid max-w-[1680px] gap-8 px-0 md:grid-cols-[210px_minmax(520px,1.05fr)_360px_minmax(360px,0.85fr)] md:items-start md:px-8">
                <aside className="px-5 text-center md:px-0">
                  <ProjectMark title={project.title} />
                  <h3 className="mt-7 font-sans text-2xl leading-tight">{project.title}</h3>
                  <p className="mt-3 text-base uppercase text-muted">{project.location}</p>
                  <ProjectMeta project={project} />
                  <div className="mt-16">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted">Share</p>
                    <div className="mt-3 flex justify-center gap-1.5">
                      {["M", "F", "in", "X"].map((item) => (
                        <span key={item} className="flex h-5 w-5 items-center justify-center bg-black text-[10px] text-white">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </aside>

                <div className="min-w-0 px-5 md:px-0">
                  <motion.div layout className="relative aspect-[4/3] overflow-hidden bg-black">
                    <Image
                      src={activeImage}
                      alt={`${project.title} expanded image`}
                      fill
                      sizes="(min-width: 1024px) 54vw, 100vw"
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setActiveImage(image)}
                        className={cn(
                          "relative h-16 w-24 shrink-0 overflow-hidden border transition md:h-20 md:w-32",
                          activeImage === image
                            ? "border-ink dark:border-paper"
                            : "border-black/10 opacity-65 hover:opacity-100 dark:border-white/10"
                        )}
                      >
                        <Image src={image} alt={`${project.title} thumbnail ${index + 1}`} fill sizes="128px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-5 md:px-0">
                  <div className="mb-7 flex items-start justify-between gap-5">
                    <p className="text-lg leading-7">{project.excerpt}</p>
                    <button
                      type="button"
                      onClick={() => setExpanded(false)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/15 transition hover:bg-ink hover:text-paper dark:border-white/15 dark:hover:bg-paper dark:hover:text-ink"
                      aria-label={`Minimize ${project.title}`}
                    >
                      <ChevronUp size={18} />
                    </button>
                  </div>
                  <p className="text-base leading-7 text-ink/85 dark:text-paper/82">{project.description}</p>
                  <p className="mt-6 text-base leading-7 text-ink/85 dark:text-paper/82">
                    The project explores spatial clarity, climate-aware envelope design, and a measured relationship
                    between public movement, landscape, and daily occupation.
                  </p>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="mt-8 inline-flex items-center gap-3 border border-black/20 px-5 py-3 text-xs uppercase tracking-[0.18em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink"
                  >
                    Open detail page <ExternalLink size={15} />
                  </Link>
                </div>

                <div className="grid gap-8 px-5 md:px-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-black">
                    <Image
                      src={images[1] ?? project.image}
                      alt={`${project.title} secondary view`}
                      fill
                      sizes="(min-width: 1024px) 420px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">Video</p>
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
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
