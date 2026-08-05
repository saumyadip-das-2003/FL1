"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getYouTubeId } from "@/lib/youtube";

export function Hero({
  headline = "Formal spaces for a changing climate.",
  tagline = "A client-facing studio prototype for architecture, interiors, exteriors, and landscape portfolios.",
  mediaType = "none",
  videoUrl = "",
  imageUrl = ""
}: {
  headline?: string;
  tagline?: string;
  mediaType?: string;
  videoUrl?: string;
  imageUrl?: string;
}) {
  const videoId = getYouTubeId(videoUrl);
  const showVideo = mediaType === "video" && Boolean(videoId);
  const showImage = mediaType === "image" && Boolean(imageUrl);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-charcoal text-paper">
      {showImage && (
        <Image src={imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      )}
      {showVideo && (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1&rel=0`}
          title="Architecture studio background video"
          className="pointer-events-none absolute left-1/2 top-1/2 block aspect-video h-[120vh] min-h-full w-[213.34vh] min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          allow="autoplay; encrypted-media; picture-in-picture"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-black/18 to-black/72" />
      <div className="relative z-10 flex min-h-[100svh] items-end px-5 pb-12 pt-24 md:px-8 md:pb-24 md:pt-32">
        <div className="mx-auto w-full max-w-7xl">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 text-[11px] uppercase tracking-[0.2em] text-white/70 md:text-xs md:tracking-[0.32em]"
          >
            Architecture / Interiors / Landscape
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 42 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl font-serif text-[3rem] leading-[0.98] text-balance sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {headline}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col gap-5 md:mt-10 md:flex-row md:items-center md:justify-between"
          >
            <p className="max-w-xl text-sm leading-7 text-white/78 md:text-lg md:leading-8">
              {tagline}
            </p>
            <Link
              href="/projects"
              className="inline-flex w-fit items-center gap-3 border border-white/40 px-5 py-3 text-[11px] uppercase tracking-[0.18em] transition hover:bg-white hover:text-ink md:px-6 md:py-4 md:text-xs md:tracking-[0.22em]"
            >
              View projects <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
