"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const videoId = "OP_fVIUTr9Y";

  return (
    <section className="relative min-h-screen overflow-hidden bg-charcoal text-paper">
      <div
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2200&q=80')"
        }}
      />
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1&rel=0`}
        title="Architecture studio background video"
        className="pointer-events-none absolute left-1/2 top-1/2 hidden aspect-video h-[120vh] min-h-full w-[213.34vh] min-w-full -translate-x-1/2 -translate-y-1/2 object-cover md:block"
        allow="autoplay; encrypted-media; picture-in-picture"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-black/18 to-black/72" />
      <div className="relative z-10 flex min-h-screen items-end px-5 pb-16 pt-32 md:px-8 md:pb-24">
        <div className="mx-auto w-full max-w-7xl">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 text-xs uppercase tracking-[0.32em] text-white/70"
          >
            Architecture / Interiors / Landscape
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 42 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl font-serif text-6xl leading-[0.95] text-balance md:text-8xl lg:text-9xl"
          >
            Formal spaces for a changing climate.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
          >
            <p className="max-w-xl text-base leading-8 text-white/72 md:text-lg">
              A client-facing studio prototype for architecture, interiors, exteriors, and landscape portfolios.
            </p>
            <Link
              href="/projects"
              className="inline-flex w-fit items-center gap-3 border border-white/40 px-6 py-4 text-xs uppercase tracking-[0.22em] transition hover:bg-white hover:text-ink"
            >
              View projects <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
