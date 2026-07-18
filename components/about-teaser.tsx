"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

const stats = [
  { value: "14", label: "Years active" },
  { value: "86", label: "Projects completed" },
  { value: "11", label: "Countries worked in" }
];

export function AboutTeaser() {
  return (
    <section className="border-y border-black/10 bg-white px-5 py-24 transition-colors dark:border-white/10 dark:bg-[#4a4a4a] md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">About the Studio</p>
          <h2 className="mt-5 font-serif text-5xl leading-tight text-balance md:text-7xl">
            Architecture measured by context, restraint, and long use.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="text-lg leading-9 text-muted">
            Atelier Northline is a placeholder studio profile for a professional portfolio website. The practice is
            presented as research-oriented, detail-driven, and internationally conversant while remaining rooted in
            climate, craft, and civic responsibility.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 border-y border-black/10 py-8 dark:border-white/10">
            {stats.map((stat, index) => (
              <div key={stat.label}>
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  className="font-serif text-4xl md:text-6xl"
                >
                  {stat.value}
                </motion.p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
          <Link
            href="/about"
            className="mt-10 inline-flex border border-black/20 px-6 py-4 text-xs uppercase tracking-[0.22em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink"
          >
            Read studio profile
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
