"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

export function LightboxGallery({ project }: { project: Project }) {
  const images = [project.image, ...project.gallery];
  const [active, setActive] = useState(images[0]);

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

      <div className="mt-6 border-t border-black/10 pt-6 dark:border-white/10">
        <div className="relative aspect-[16/9] overflow-hidden bg-black">
          <Image
            src={active}
            alt={`${project.title} selected image`}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(image)}
              className={cn(
                "relative h-20 w-32 shrink-0 overflow-hidden border transition",
                active === image ? "border-ink dark:border-paper" : "border-black/10 opacity-65 hover:opacity-100 dark:border-white/10"
              )}
            >
              <Image src={image} alt={`${project.title} thumbnail ${index + 1}`} fill sizes="128px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
