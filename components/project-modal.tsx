"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

const placeholderVideoId = "OP_fVIUTr9Y";

export function ProjectModal({
  project,
  open,
  onClose,
  initialImage
}: {
  project: Project;
  open: boolean;
  onClose: () => void;
  initialImage?: string;
}) {
  const images = useMemo(() => [project.image, ...project.gallery], [project.gallery, project.image]);
  const [activeImage, setActiveImage] = useState(images[0]);

  useEffect(() => {
    if (open) {
      setActiveImage(initialImage ?? images[0]);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [images, initialImage, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] bg-black/82 p-3 backdrop-blur-sm md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto grid h-full max-w-7xl overflow-hidden bg-paper text-ink shadow-soft dark:bg-charcoal dark:text-paper lg:grid-cols-[1.35fr_0.65fr]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex min-h-0 flex-col bg-black">
              <div className="relative min-h-0 flex-1">
                <Image
                  src={activeImage}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 68vw, 100vw"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex gap-2 overflow-x-auto border-t border-white/10 bg-black p-3">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    className={cn(
                      "relative h-20 w-28 shrink-0 overflow-hidden border transition",
                      activeImage === image ? "border-white" : "border-white/15 opacity-65 hover:opacity-100"
                    )}
                  >
                    <Image src={image} alt={`${project.title} thumbnail ${index + 1}`} fill sizes="112px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <aside className="min-h-0 overflow-y-auto p-5 md:p-8">
              <div className="mb-8 flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">{project.category}</p>
                  <h2 className="mt-3 font-serif text-4xl leading-tight">{project.title}</h2>
                </div>
                <button
                  type="button"
                  aria-label="Close project modal"
                  onClick={onClose}
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/15 transition hover:bg-ink hover:text-paper dark:border-white/15 dark:hover:bg-paper dark:hover:text-ink"
                >
                  <X size={18} />
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
                  <dt className="text-muted">Media</dt>
                  <dd>{images.length} images / 1 video</dd>
                </div>
              </dl>

              <p className="mt-7 text-base leading-8 text-muted">{project.description}</p>

              <div className="mt-8">
                <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted">Project Video</p>
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
                className="mt-8 inline-flex items-center gap-3 border border-black/20 px-5 py-3 text-xs uppercase tracking-[0.2em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink"
                onClick={onClose}
              >
                Open detail page <ExternalLink size={15} />
              </Link>
            </aside>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
