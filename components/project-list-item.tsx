"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, ExternalLink, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/data";

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
            <div className="mt-11 bg-white py-7 dark:bg-[#0d0d0d] md:py-10">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center border border-black/15 bg-white/90 backdrop-blur transition hover:bg-ink hover:text-paper dark:border-white/15 dark:bg-charcoal/90 dark:hover:bg-paper dark:hover:text-ink"
                  aria-label={`Minimize ${project.title}`}
                >
                  <ChevronUp size={18} />
                </button>

                <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-5 md:gap-8 md:px-8">
                  <section className="grid min-h-[560px] w-[78vw] max-w-[360px] shrink-0 snap-start place-items-center border-r border-black/10 pr-6 text-center dark:border-white/10">
                    <div>
                      <ProjectMark title={project.title} />
                      <h3 className="mt-7 font-sans text-3xl leading-tight">{project.title}</h3>
                      <p className="mt-3 text-base uppercase text-muted">{project.location}</p>
                      <ProjectMeta project={project} />
                    </div>
                  </section>

                  {images.map((image, index) => (
                    <section
                      key={image}
                      className="relative min-h-[560px] w-[78vw] max-w-[980px] shrink-0 snap-center overflow-hidden bg-black md:w-[64vw]"
                    >
                      <Image
                        src={image}
                        alt={`${project.title} slide ${index + 1}`}
                        fill
                        sizes="(min-width: 1024px) 64vw, 78vw"
                        className="object-cover"
                        priority={index === 0}
                      />
                      <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 text-xs uppercase tracking-[0.18em] text-paper">
                        Image {index + 1} / {images.length}
                      </div>
                    </section>
                  ))}

                  <section className="flex min-h-[560px] w-[78vw] max-w-[460px] shrink-0 snap-center items-center bg-white px-2 dark:bg-[#0d0d0d] md:w-[34vw]">
                    <div>
                      <p className="mb-7 text-xl leading-7">{project.excerpt}</p>
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
                  </section>

                  <section className="flex min-h-[560px] w-[78vw] max-w-[860px] shrink-0 snap-center items-center md:w-[56vw]">
                    <div className="w-full">
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
                  </section>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
