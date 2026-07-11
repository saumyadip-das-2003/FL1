"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mail, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

type Person = {
  name: string;
  role: string;
  image: string;
  bio: string;
};

export function PersonModal({
  person,
  open,
  onClose
}: {
  person: Person | null;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && person && (
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
            className="mx-auto grid max-h-full max-w-5xl overflow-hidden bg-paper text-ink shadow-soft dark:bg-charcoal dark:text-paper md:grid-cols-[0.95fr_1.05fr]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-[420px] bg-black">
              <Image src={person.image} alt={person.name} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" priority />
            </div>
            <div className="overflow-y-auto p-6 md:p-9">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">{person.role}</p>
                  <h2 className="mt-3 font-serif text-5xl leading-tight">{person.name}</h2>
                </div>
                <button
                  type="button"
                  aria-label="Close person modal"
                  onClick={onClose}
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/15 transition hover:bg-ink hover:text-paper dark:border-white/15 dark:hover:bg-paper dark:hover:text-ink"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="mt-8 text-lg leading-9 text-muted">{person.bio}</p>
              <p className="mt-6 text-base leading-8 text-muted">
                This placeholder profile can later hold awards, selected projects, education, press notes, and direct
                contact details for the real studio team.
              </p>

              <div className="mt-8 grid gap-4 border-y border-black/10 py-6 text-sm dark:border-white/10">
                <p className="flex justify-between gap-5">
                  <span className="text-muted">Studio</span>
                  <span>Atelier Northline</span>
                </p>
                <p className="flex justify-between gap-5">
                  <span className="text-muted">Office</span>
                  <span>Dhaka / Singapore</span>
                </p>
                <p className="flex justify-between gap-5">
                  <span className="text-muted">Status</span>
                  <span>Placeholder profile</span>
                </p>
              </div>

              <button
                type="button"
                className="mt-8 inline-flex items-center gap-3 border border-black/20 px-5 py-3 text-xs uppercase tracking-[0.2em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink"
              >
                <Mail size={15} /> Contact
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
