"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function LightboxGallery({ images, title }: { images: string[]; title: string }) {
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
              alt={`${title} gallery image ${index + 1}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-110"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-5"
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              aria-label="Close gallery"
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center bg-white text-ink"
              onClick={() => setActive(null)}
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative h-[82vh] w-full max-w-6xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Image src={active} alt={`${title} enlarged image`} fill sizes="100vw" className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
