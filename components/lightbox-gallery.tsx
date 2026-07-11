"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ProjectModal } from "@/components/project-modal";
import type { Project } from "@/lib/data";

export function LightboxGallery({ project }: { project: Project }) {
  const images = [project.image, ...project.gallery];
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        {images.map((image, index) => (
          <motion.button
            key={image}
            type="button"
            onClick={() => setActive(image)}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative overflow-hidden bg-black ${index === 0 ? "md:col-span-2 aspect-[16/10]" : "aspect-[4/5]"}`}
          >
            <Image
              src={image}
              alt={`${project.title} gallery image ${index + 1}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-110"
            />
          </motion.button>
        ))}
      </div>
      <ProjectModal project={project} open={Boolean(active)} initialImage={active ?? undefined} onClose={() => setActive(null)} />
    </>
  );
}
