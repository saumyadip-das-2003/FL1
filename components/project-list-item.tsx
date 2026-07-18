"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronUp, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import type { Project, ProjectMedia } from "@/lib/data";

const placeholderVideoId = "OP_fVIUTr9Y";

function youtubeEmbedUrl(source: string) {
  const idMatch =
    source.match(/youtu\.be\/([^?&]+)/) ??
    source.match(/[?&]v=([^?&]+)/) ??
    source.match(/embed\/([^?&]+)/);
  const id = idMatch?.[1] ?? placeholderVideoId;
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&playsinline=1&rel=0`;
}

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
    <dl className="mt-10 grid gap-5 text-center text-sm text-ink dark:text-paper">
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
  const [isDragging, setIsDragging] = useState(false);
  const images = useMemo(() => [project.image, ...project.gallery], [project.gallery, project.image]);
  const mediaItems = useMemo<ProjectMedia[]>(() => {
    if (project.media?.length) {
      return project.media;
    }

    return [
      ...images.map((image, index) => ({
        type: "image" as const,
        source: image,
        caption: captionFor(index)
      })),
      {
        type: "video" as const,
        source: project.video ?? "https://youtu.be/OP_fVIUTr9Y",
        caption: `${project.title} placeholder project film.`
      }
    ];
  }, [images, project.media, project.title, project.video]);
  const stripRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    if (!stripRef.current) {
      return;
    }

    dragState.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      scrollLeft: stripRef.current.scrollLeft
    };
    event.preventDefault();
    setIsDragging(true);
    stripRef.current.style.scrollSnapType = "none";
    stripRef.current.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    if (!dragState.current.active || !stripRef.current) {
      return;
    }

    event.preventDefault();
    const distance = event.clientX - dragState.current.startX;
    if (Math.abs(distance) > 4) {
      dragState.current.moved = true;
    }
    stripRef.current.scrollLeft = dragState.current.scrollLeft - distance;
  }

  function stopDragging() {
    if (!dragState.current.active) {
      return;
    }

    if (!stripRef.current) {
      dragState.current.active = false;
      setIsDragging(false);
      return;
    }

    dragState.current.active = false;
    const strip = stripRef.current;
    const slides = Array.from(strip.querySelectorAll<HTMLElement>("[data-slide]"));
    const nearest = slides.reduce(
      (closest, slide) => {
        const distance = Math.abs(slide.offsetLeft - strip.scrollLeft);
        return distance < closest.distance ? { slide, distance } : closest;
      },
      { slide: slides[0], distance: Number.POSITIVE_INFINITY }
    );

    setIsDragging(false);
    strip.style.scrollSnapType = "";
    if (nearest.slide) {
      strip.scrollTo({ left: nearest.slide.offsetLeft, behavior: "smooth" });
    }
  }

  function slideBy(direction: "previous" | "next") {
    if (!stripRef.current) {
      return;
    }

    const distance = Math.round(stripRef.current.clientWidth * 0.82);
    stripRef.current.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth"
    });
  }

  function captionFor(index: number) {
    const captions = [
      `${project.title} primary view, showing the project in its surrounding context.`,
      `Material and spatial study for ${project.title}, focused on atmosphere and envelope detail.`,
      `Interior and threshold sequence documenting how light, proportion, and circulation shape the project.`,
      `Landscape and approach view for ${project.title}, showing the relationship between building and site.`
    ];

    return captions[index] ?? `${project.title} project image ${index + 1}.`;
  }

  return (
    <motion.article
      layout
      className="py-8 md:py-11"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.34,
        ease: [0.22, 1, 0.36, 1],
        layout: { duration: 0.58, ease: [0.22, 1, 0.36, 1] }
      }}
    >
      <AnimatePresence initial={false}>
        {!expanded ? (
          <motion.div
            key="collapsed"
            layout
            initial={{ opacity: 0, scale: 0.985, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.985, y: -8 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto grid max-w-5xl gap-7 md:grid-cols-[210px_minmax(0,720px)] md:items-start"
          >
            <div className="text-center md:pt-1">
              <button type="button" onClick={() => setExpanded(true)} aria-label={`Expand ${project.title}`}>
                <ProjectMark title={project.title} />
              </button>
              <button type="button" onClick={() => setExpanded(true)} className="mt-6 block w-full">
                <h2 className="font-sans text-xl leading-tight tracking-normal">{project.title}</h2>
                <p className="mt-3 text-sm uppercase tracking-normal text-muted">{project.location}</p>
              </button>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="mx-auto mt-8 flex h-10 w-10 items-center justify-center border border-black/15 transition hover:bg-ink hover:text-paper dark:border-white/15 dark:hover:bg-paper dark:hover:text-ink"
                aria-label={`Expand ${project.title}`}
              >
                <Plus size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setExpanded(true)}
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
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            layout
            initial={{ opacity: 0, scale: 0.985, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.985, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-5xl overflow-hidden"
          >
            <div className="grid gap-5 bg-white text-ink dark:bg-[#4a4a4a] dark:text-paper md:grid-cols-[210px_minmax(0,840px)] md:items-stretch">
              <aside className="px-5 text-center md:px-0 md:pt-1">
                <ProjectMark title={project.title} />
                <h2 className="mt-6 font-sans text-xl leading-tight tracking-normal">{project.title}</h2>
                <p className="mt-3 text-sm uppercase tracking-normal text-muted">{project.location}</p>
                <ProjectMeta project={project} />
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="mx-auto mt-8 flex h-10 w-10 items-center justify-center border border-black/15 transition hover:bg-ink hover:text-paper dark:border-white/15 dark:hover:bg-paper dark:hover:text-ink"
                  aria-label={`Minimize ${project.title}`}
                >
                  <Minus size={18} />
                </button>
              </aside>

              <div className="relative min-w-0 overflow-hidden border border-black/10 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center border border-black/15 bg-white/90 backdrop-blur transition hover:bg-ink hover:text-paper dark:border-white/15 dark:bg-charcoal/90 dark:hover:bg-paper dark:hover:text-ink"
                    aria-label={`Minimize ${project.title}`}
                  >
                    <ChevronUp size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => slideBy("previous")}
                    className="absolute bottom-0 left-0 top-0 z-10 flex w-14 items-center justify-center bg-gradient-to-r from-black/18 to-transparent text-paper opacity-0 transition hover:opacity-100"
                    aria-label={`Previous ${project.title} media`}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={() => slideBy("next")}
                    className="absolute bottom-0 right-0 top-0 z-10 flex w-14 items-center justify-center bg-gradient-to-l from-black/18 to-transparent text-paper opacity-0 transition hover:opacity-100"
                    aria-label={`Next ${project.title} media`}
                  >
                    <ChevronRight size={24} />
                  </button>

                  <div
                    ref={stripRef}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                  onPointerUp={stopDragging}
                  onPointerCancel={stopDragging}
                  onPointerLeave={stopDragging}
                  style={{ touchAction: "auto", WebkitOverflowScrolling: "touch" }}
                  className={`no-scrollbar flex h-[380px] cursor-grab select-none gap-4 overflow-x-auto overflow-y-hidden p-4 active:cursor-grabbing md:h-[520px] md:gap-5 md:p-5 ${
                    isDragging ? "snap-none scroll-auto" : "snap-x snap-mandatory scroll-smooth"
                  }`}
                >
                    <section data-slide className="no-scrollbar flex h-full w-[76vw] max-w-[430px] shrink-0 snap-center items-center overflow-y-auto bg-white px-6 text-ink dark:bg-[#4a4a4a] dark:text-paper md:w-[430px]">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-muted">Project Caption</p>
                        <p className="mt-5 text-lg leading-8 text-ink dark:text-paper">{project.excerpt}</p>
                        <p className="mt-5 text-base leading-7 text-ink/85 dark:text-paper/85">
                          {project.description}
                        </p>
                      </div>
                    </section>
                    {mediaItems.map((media, index) => (
                      <div key={`${media.type}-${media.source}-${index}`} className="contents">
                        <section data-slide className="relative h-full w-[78vw] max-w-[680px] shrink-0 snap-center overflow-hidden bg-black md:w-[680px]">
                          {media.type === "image" ? (
                            <Image
                              src={media.source}
                              alt={`${project.title} media ${index + 1}`}
                              fill
                              sizes="(min-width: 768px) 680px, 78vw"
                              className="object-cover"
                              draggable={false}
                              priority={index === 0}
                            />
                          ) : (
                            <iframe
                              src={youtubeEmbedUrl(media.source)}
                              title={`${project.title} media video ${index + 1}`}
                              allow="autoplay; encrypted-media; picture-in-picture"
                              allowFullScreen
                              className={isDragging ? "pointer-events-none h-full w-full" : "h-full w-full"}
                            />
                          )}
                          <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 text-xs uppercase tracking-[0.18em] text-paper">
                            {media.type} {index + 1} / {mediaItems.length}
                          </div>
                        </section>
                        <section data-slide className="flex h-full w-[68vw] max-w-[340px] shrink-0 snap-center items-center bg-white px-6 text-ink dark:bg-[#4a4a4a] dark:text-paper md:w-[340px]">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-muted">
                              {media.type === "image" ? "Image Caption" : "Video Caption"}
                            </p>
                            <p className="mt-5 text-lg leading-8">{media.caption}</p>
                          </div>
                        </section>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
