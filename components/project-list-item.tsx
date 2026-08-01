"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronUp, Minus, Plus } from "lucide-react";
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
        caption: captionFor(index)
      })),
      {
        type: "video" as const,
        source: project.video ?? "https://youtu.be/OP_fVIUTr9Y",
        caption: `${project.title} placeholder project film.`
      }
    ];
  }, [images, project.media, project.title, project.video]);
  const baseSlides = useMemo(
    () => [
      { id: "meta", kind: "meta" as const },
      { id: "overview", kind: "overview" as const },
      ...mediaItems.flatMap((media, index) => [
        { id: `media-${index}`, kind: "media" as const, media, index },
        { id: `caption-${index}`, kind: "caption" as const, media, index }
      ])
    ],
    [mediaItems]
  );
  const loopedSlides = useMemo(
    () => [0, 1, 2].flatMap((loop) => baseSlides.map((slide, baseIndex) => ({ ...slide, loop, baseIndex }))),
    [baseSlides]
  );
  const stripRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToBaseIndex(0, "auto"));
    });
  }, [expanded, baseSlides.length]);

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
    const nearest = nearestSlide();

    setIsDragging(false);
    strip.style.scrollSnapType = "";
    if (nearest?.slide) {
      strip.scrollTo({ left: centeredOffset(nearest.slide), behavior: "smooth" });
      window.setTimeout(() => settleInfiniteLoop("auto"), 360);
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
        ? (current + 1) % baseSlides.length
        : (current - 1 + baseSlides.length) % baseSlides.length;

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

    const target = stripRef.current.querySelector<HTMLElement>(`[data-loop="1"][data-base-index="${baseIndex}"]`);
    if (target) {
      stripRef.current.scrollTo({ left: centeredOffset(target), behavior });
    }
  }

  function settleInfiniteLoop(behavior: ScrollBehavior = "auto") {
    const nearest = nearestSlide();
    if (!nearest || !stripRef.current) {
      return;
    }

    const loop = Number(nearest.slide.dataset.loop ?? 1);
    const baseIndex = Number(nearest.slide.dataset.baseIndex ?? 0);

    if (loop !== 1) {
      scrollToBaseIndex(baseIndex, behavior);
    }
  }

  function handleStripScroll() {
    if (isDragging) {
      return;
    }

    if (scrollEndTimer.current) {
      clearTimeout(scrollEndTimer.current);
    }

    scrollEndTimer.current = setTimeout(() => settleInfiniteLoop("auto"), 180);
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

  function renderSlide(slide: (typeof loopedSlides)[number]) {
    if (slide.kind === "meta") {
      return (
        <section
          data-slide
          data-loop={slide.loop}
          data-base-index={slide.baseIndex}
          className="flex h-full w-[78vw] max-w-[360px] shrink-0 snap-center items-center bg-white px-8 text-center text-ink dark:bg-[#4a4a4a] dark:text-paper md:w-[360px]"
        >
          <div className="w-full">
            <ProjectMark title={project.title} />
            <h2 className="mt-7 font-sans text-2xl leading-tight tracking-normal">{project.title}</h2>
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
          data-loop={slide.loop}
          data-base-index={slide.baseIndex}
          className="no-scrollbar flex h-full w-[78vw] max-w-[480px] shrink-0 snap-center items-center overflow-y-auto bg-white px-8 text-ink dark:bg-[#4a4a4a] dark:text-paper md:w-[480px]"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Project Caption</p>
            <p className="mt-5 text-xl leading-9 text-ink dark:text-paper">{project.excerpt}</p>
            <p className="mt-5 text-base leading-8 text-ink/85 dark:text-paper/85">{project.description}</p>
          </div>
        </section>
      );
    }

    if (slide.kind === "caption") {
      return (
        <section
          data-slide
          data-loop={slide.loop}
          data-base-index={slide.baseIndex}
          className="flex h-full w-[72vw] max-w-[380px] shrink-0 snap-center items-center bg-white px-8 text-ink dark:bg-[#4a4a4a] dark:text-paper md:w-[380px]"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              {slide.media.type === "image" ? "Image Caption" : "Video Caption"}
            </p>
            <p className="mt-5 text-xl leading-9">{slide.media.caption}</p>
          </div>
        </section>
      );
    }

    return (
      <section
        data-slide
        data-loop={slide.loop}
        data-base-index={slide.baseIndex}
        className="relative h-full w-[86vw] max-w-[960px] shrink-0 snap-center overflow-hidden bg-black md:w-[960px]"
      >
        {slide.media.type === "image" ? (
          <Image
            src={slide.media.source}
            alt={`${project.title} media ${slide.index + 1}`}
            fill
            sizes="(min-width: 1024px) 960px, 86vw"
            className="object-cover"
            draggable={false}
            priority={slide.index === 0 && slide.loop === 1}
          />
        ) : (
          <iframe
            src={youtubeEmbedUrl(slide.media.source)}
            title={`${project.title} media video ${slide.index + 1}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className={isDragging ? "pointer-events-none h-full w-full" : "h-full w-full"}
          />
        )}
        <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 text-xs uppercase tracking-[0.18em] text-paper">
          {slide.media.type} {slide.index + 1} / {mediaItems.length}
        </div>
      </section>
    );
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
            className="relative left-1/2 w-[min(1500px,calc(100vw-48px))] -translate-x-1/2 overflow-hidden px-0"
          >
            <div className="relative min-w-0 overflow-hidden border border-black/10 bg-white text-ink dark:border-white/10 dark:bg-[#4a4a4a] dark:text-paper">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center border border-black/15 bg-white/90 backdrop-blur transition hover:bg-ink hover:text-paper dark:border-white/15 dark:bg-charcoal/90 dark:hover:bg-paper dark:hover:text-ink"
                aria-label={`Minimize ${project.title}`}
              >
                <ChevronUp size={19} />
              </button>
              <button
                type="button"
                onClick={() => slideBy("previous")}
                className="absolute bottom-0 left-0 top-0 z-10 flex w-20 items-center justify-center bg-gradient-to-r from-black/24 to-transparent text-paper opacity-0 transition hover:opacity-100"
                aria-label={`Previous ${project.title} media`}
              >
                <ChevronLeft size={30} />
              </button>
              <button
                type="button"
                onClick={() => slideBy("next")}
                className="absolute bottom-0 right-0 top-0 z-10 flex w-20 items-center justify-center bg-gradient-to-l from-black/24 to-transparent text-paper opacity-0 transition hover:opacity-100"
                aria-label={`Next ${project.title} media`}
              >
                <ChevronRight size={30} />
              </button>

              <div
                ref={stripRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
                onPointerLeave={stopDragging}
                onScroll={handleStripScroll}
                style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch" }}
                className={`no-scrollbar flex h-[520px] cursor-grab select-none gap-5 overflow-x-auto overflow-y-hidden p-5 active:cursor-grabbing md:h-[720px] md:gap-6 md:p-6 ${
                  isDragging ? "snap-none scroll-auto" : "snap-x snap-mandatory scroll-smooth"
                }`}
              >
                {loopedSlides.map((slide) => (
                  <div key={`${slide.loop}-${slide.id}`} className="contents">
                    {renderSlide(slide)}
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
