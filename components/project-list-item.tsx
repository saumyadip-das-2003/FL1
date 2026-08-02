"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronUp, ExternalLink, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project, ProjectMedia } from "@/lib/data";
import { youtubeEmbedUrl } from "@/lib/youtube";

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
        <dd className="mt-1 uppercase">{project.status || "Concept"}</dd>
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
        caption: ""
      })),
      {
        type: "caption" as const,
        source: "Project note",
        caption: captionFor(0)
      },
      {
        type: "video" as const,
        source: project.video ?? "https://youtu.be/OP_fVIUTr9Y",
        caption: ""
      }
    ];
  }, [images, project.media, project.title, project.video]);
  const baseSlides = useMemo(
    () => [
      { id: "meta", kind: "meta" as const },
      { id: "overview", kind: "overview" as const },
      ...mediaItems.map((media, index) => ({
        id: `${media.type}-${index}`,
        kind: media.type === "caption" ? ("caption" as const) : ("media" as const),
        media,
        index
      })),
      ...(project.mapLocation?.trim() ? [{ id: "map", kind: "map" as const }] : [])
    ],
    [mediaItems, project.mapLocation]
  );
  const stripRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });

  useEffect(() => {
    if (!expanded) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (stripRef.current) {
          const firstMobileContentIndex = window.matchMedia("(max-width: 767px)").matches ? 1 : 0;
          scrollToBaseIndex(Math.min(firstMobileContentIndex, baseSlides.length - 1), "auto");
        }
      });
    });
  }, [baseSlides.length, expanded]);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    if ((event.target as HTMLElement).closest("button, a, input, textarea, select, iframe")) {
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
    const nearest = nearestSlide();

    setIsDragging(false);
    strip.style.scrollSnapType = "";
    if (nearest?.slide) {
      strip.scrollTo({ left: centeredOffset(nearest.slide), behavior: "smooth" });
    }
  }

  function slideBy(direction: "previous" | "next") {
    const nearest = nearestSlide();
    if (!nearest || baseSlides.length === 0) {
      return;
    }

    const current = Number(nearest.slide.dataset.baseIndex ?? 0);
    const next =
      direction === "next"
        ? Math.min(current + 1, baseSlides.length - 1)
        : Math.max(current - 1, 0);

    scrollToBaseIndex(next, "smooth");
  }

  function nearestSlide() {
    if (!stripRef.current) {
      return null;
    }

    const strip = stripRef.current;
    const slides = Array.from(strip.querySelectorAll<HTMLElement>("[data-slide]"));

    if (!slides.length) {
      return null;
    }

    const viewportCenter = strip.scrollLeft + strip.clientWidth / 2;

    return slides.reduce(
      (closest, slide) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(slideCenter - viewportCenter);
        return distance < closest.distance ? { slide, distance } : closest;
      },
      { slide: slides[0], distance: Number.POSITIVE_INFINITY }
    );
  }

  function centeredOffset(slide: HTMLElement) {
    if (!stripRef.current) {
      return slide.offsetLeft;
    }

    return slide.offsetLeft - (stripRef.current.clientWidth - slide.offsetWidth) / 2;
  }

  function scrollToBaseIndex(baseIndex: number, behavior: ScrollBehavior) {
    if (!stripRef.current) {
      return;
    }

    const target = stripRef.current.querySelector<HTMLElement>(`[data-base-index="${baseIndex}"]`);
    if (target) {
      stripRef.current.scrollTo({ left: centeredOffset(target), behavior });
    }
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

  function mapEmbedUrl(value: string) {
    const location = value.trim();
    if (!location) {
      return "";
    }

    if (/^https?:\/\//i.test(location)) {
      try {
        const url = new URL(location);
        const isEmbed = url.pathname.includes("/maps/embed") || url.searchParams.get("output") === "embed";
        if (isEmbed) {
          return location;
        }

        const coordinateMatch = location.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
        if (coordinateMatch) {
          return `https://maps.google.com/maps?q=${coordinateMatch[1]},${coordinateMatch[2]}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }

        const placeMatch = url.pathname.match(/\/maps\/place\/([^/]+)/);
        if (placeMatch?.[1]) {
          return `https://maps.google.com/maps?q=${encodeURIComponent(decodeURIComponent(placeMatch[1].replace(/\+/g, " ")))}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
      } catch {
        // Fall through and use the raw value as a search query.
      }
    }

    return `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  }

  function youtubeWatchUrl(source: string) {
    const id = youtubeEmbedUrl(source, false).match(/\/embed\/([^?]+)/)?.[1];
    return id ? `https://www.youtube.com/watch?v=${id}` : source;
  }

  function renderSlide(slide: (typeof baseSlides)[number] & { baseIndex: number }) {
    if (slide.kind === "meta") {
      return (
        <section
          data-slide
          data-base-index={slide.baseIndex}
          className="flex h-full w-[68vw] max-w-[280px] shrink-0 snap-start items-center bg-white px-5 text-center text-ink dark:bg-[#4a4a4a] dark:text-paper md:w-[380px] md:max-w-[380px] md:snap-center md:px-8"
        >
          <div className="w-full">
            <ProjectMark title={project.title} />
            <h2 className="mt-6 font-sans text-xl leading-tight tracking-normal md:mt-7 md:text-2xl">{project.title}</h2>
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
          </div>
        </section>
      );
    }

    if (slide.kind === "overview") {
      return (
        <section
          data-slide
          data-base-index={slide.baseIndex}
          className="no-scrollbar flex h-full w-[58vw] max-w-none shrink-0 snap-start items-start overflow-y-auto bg-transparent px-0 pr-5 pt-1 text-ink dark:text-paper md:w-[560px] md:max-w-[520px] md:snap-center md:items-center md:bg-white md:px-8 md:pt-0 md:dark:bg-[#4a4a4a]"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted md:text-xs md:tracking-[0.22em]">Project Caption</p>
            <p className="mt-3 text-base leading-7 text-ink dark:text-paper md:mt-4 md:text-xl md:leading-9">{project.excerpt}</p>
            <p className="mt-4 text-sm leading-7 text-ink/85 dark:text-paper/85 md:text-base md:leading-8">{project.description}</p>
          </div>
        </section>
      );
    }

    if (slide.kind === "caption") {
      return (
        <section
          data-slide
          data-base-index={slide.baseIndex}
          className="flex h-full w-[56vw] max-w-none shrink-0 snap-start items-start bg-transparent px-0 pr-5 pt-1 text-ink dark:text-paper md:w-[500px] md:max-w-[500px] md:snap-center md:items-center md:bg-white md:px-8 md:pt-0 md:dark:bg-[#4a4a4a]"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted md:text-xs md:tracking-[0.22em]">
              Caption
            </p>
            <h3 className="mt-3 font-serif text-2xl leading-tight md:mt-4 md:text-4xl">{slide.media.source || "Project note"}</h3>
            <p className="mt-4 text-sm leading-7 text-ink/85 dark:text-paper/85 md:mt-5 md:text-lg md:leading-9">{slide.media.caption}</p>
          </div>
        </section>
      );
    }

    if (slide.kind === "map") {
      const src = mapEmbedUrl(project.mapLocation ?? "");

      return (
        <section
          data-slide
          data-base-index={slide.baseIndex}
          className="grid h-full w-[72vw] max-w-none shrink-0 snap-start overflow-hidden bg-white text-ink dark:bg-[#4a4a4a] dark:text-paper md:w-[72vw] md:max-w-[1280px] md:snap-center md:grid-cols-[minmax(260px,0.36fr)_minmax(0,1fr)]"
        >
          <div className="flex items-center border-b border-black/10 p-5 dark:border-white/10 md:border-b-0 md:border-r md:p-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted md:text-xs md:tracking-[0.22em]">Map Location</p>
              <h3 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">{project.title}</h3>
              <p className="mt-4 text-base leading-7 text-ink/80 dark:text-paper/80">{project.mapLocation}</p>
            </div>
          </div>
          {src ? (
            <iframe
              src={src}
              title={`${project.title} map location`}
              loading="lazy"
              className="pointer-events-none h-full min-h-0 w-full md:pointer-events-auto"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : null}
        </section>
      );
    }

    return (
      <section
        data-slide
        data-base-index={slide.baseIndex}
        className="relative h-full w-[58vw] max-w-none shrink-0 snap-start overflow-hidden bg-black md:w-[72vw] md:max-w-[1280px] md:snap-center"
      >
        {slide.media.type === "image" ? (
          <Image
            src={slide.media.source}
            alt={`${project.title} media ${slide.index + 1}`}
            fill
            sizes="(min-width: 1024px) 72vw, 92vw"
            className="object-cover"
            draggable={false}
            priority={slide.index === 0}
          />
        ) : (
          <iframe
            src={youtubeEmbedUrl(slide.media.source)}
            title={`${project.title} media video ${slide.index + 1}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            className="pointer-events-none h-full w-full"
          />
        )}
        <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 text-xs uppercase tracking-[0.18em] text-paper">
          {slide.media.type} {slide.index + 1} / {mediaItems.length}
        </div>
        {slide.media.type === "video" && (
          <a
            href={youtubeWatchUrl(slide.media.source)}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white/90 px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-ink transition hover:bg-white"
          >
            YouTube <ExternalLink size={13} />
          </a>
        )}
      </section>
    );
  }

  return (
    <motion.article
      layout
      className="w-full min-w-0 overflow-hidden py-6 md:py-11"
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
            className="mx-auto grid w-full max-w-[1180px] gap-4 md:grid-cols-[220px_minmax(0,860px)] md:items-start md:gap-5"
          >
            <div className="order-2 grid grid-cols-[64px_1fr] items-start gap-4 md:order-1 md:block md:text-center md:pt-1">
              <button type="button" onClick={() => setExpanded(true)} aria-label={`Expand ${project.title}`}>
                <ProjectMark title={project.title} />
              </button>
              <button type="button" onClick={() => setExpanded(true)} className="block w-full text-left md:mt-6 md:text-center">
                <h2 className="font-sans text-xl leading-tight tracking-normal md:text-xl">{project.title}</h2>
                <p className="mt-2 text-xs uppercase tracking-normal text-muted md:mt-3 md:text-sm">{project.location}</p>
              </button>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="mx-auto mt-5 hidden h-9 w-9 items-center justify-center border border-black/15 transition hover:bg-ink hover:text-paper dark:border-white/15 dark:hover:bg-paper dark:hover:text-ink md:mt-8 md:flex md:h-10 md:w-10"
                aria-label={`Expand ${project.title}`}
              >
                <Plus size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="group relative order-1 aspect-[16/10] overflow-hidden bg-black md:order-2"
              aria-label={`Expand ${project.title}`}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(min-width: 768px) 860px, 100vw"
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
            className="relative ml-[calc(50%-50vw)] w-screen max-w-none overflow-hidden px-5 md:mx-auto md:ml-auto md:w-full md:max-w-[1680px] md:px-0"
          >
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute right-3 top-3 z-40 flex h-11 w-11 items-center justify-center border border-black/15 bg-white/95 text-ink shadow-soft transition hover:bg-ink hover:text-paper dark:border-white/15 dark:bg-[#4a4a4a]/95 dark:text-paper dark:hover:bg-paper dark:hover:text-ink md:right-5 md:top-5"
              aria-label={`Minimize ${project.title}`}
            >
              <ChevronUp size={19} />
            </button>
            <div className="relative min-w-0 overflow-hidden bg-transparent text-ink dark:text-paper md:border md:border-black/10 md:bg-white md:dark:border-white/10 md:dark:bg-[#4a4a4a]">
              <button
                type="button"
                onClick={() => slideBy("previous")}
                className="absolute bottom-0 left-0 top-0 z-10 hidden w-10 items-center justify-center bg-gradient-to-r from-black/32 to-transparent text-paper opacity-100 transition md:bottom-auto md:left-4 md:top-1/2 md:flex md:h-24 md:w-14 md:-translate-y-1/2 md:bg-black/25 md:hover:bg-black/40"
                aria-label={`Previous ${project.title} media`}
              >
                <ChevronLeft size={24} className="drop-shadow md:h-[30px] md:w-[30px]" />
              </button>
              <button
                type="button"
                onClick={() => slideBy("next")}
                className="absolute bottom-0 right-0 top-0 z-10 hidden w-10 items-center justify-center bg-gradient-to-l from-black/32 to-transparent text-paper opacity-100 transition md:bottom-auto md:right-4 md:top-1/2 md:flex md:h-24 md:w-14 md:-translate-y-1/2 md:bg-black/25 md:hover:bg-black/40"
                aria-label={`Next ${project.title} media`}
              >
                <ChevronRight size={24} className="drop-shadow md:h-[30px] md:w-[30px]" />
              </button>

              <div
                ref={stripRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
                onPointerLeave={stopDragging}
                style={{ touchAction: "pan-x pan-y", WebkitOverflowScrolling: "touch" }}
                className={`no-scrollbar flex h-[420px] cursor-grab select-none gap-0 overflow-x-auto overflow-y-hidden px-0 py-0 active:cursor-grabbing md:h-[640px] md:gap-6 md:px-6 md:py-8 lg:px-8 ${
                  isDragging ? "snap-none scroll-auto" : "snap-x snap-mandatory scroll-smooth"
                }`}
              >
                {baseSlides.map((slide, baseIndex) => (
                  <div key={slide.id} className="contents">
                    {renderSlide({ ...slide, baseIndex })}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
