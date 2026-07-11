"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProjectModal } from "@/components/project-modal";
import type { Project } from "@/lib/data";

export function ProjectCard({ project, tall = false }: { project: Project; tall?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="group"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`relative block w-full overflow-hidden bg-black text-left ${tall ? "aspect-[4/5]" : "aspect-[4/3]"}`}
          aria-label={`Open ${project.title} media`}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition duration-700 ease-smooth group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/38" />
          <div className="absolute inset-x-0 bottom-0 translate-y-5 p-5 text-paper opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="max-w-sm text-sm leading-6">{project.excerpt}</p>
          </div>
          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center bg-paper text-ink opacity-0 transition duration-500 group-hover:opacity-100">
            <ArrowUpRight size={18} />
          </div>
        </button>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <Link href={`/projects/${project.slug}`} className="block transition hover:text-muted">
              <h3 className="font-serif text-3xl leading-tight">{project.title}</h3>
            </Link>
            <p className="mt-2 text-sm text-muted">{project.location}</p>
          </div>
          <span className="whitespace-nowrap border border-black/12 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted dark:border-white/15">
            {project.category}
          </span>
        </div>
      </motion.article>
      <ProjectModal project={project} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
