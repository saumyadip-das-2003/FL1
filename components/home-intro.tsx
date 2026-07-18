"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function HomeIntro({ children }: { children: React.ReactNode }) {
  const [introOpen, setIntroOpen] = useState(true);

  return (
    <>
      <AnimatePresence>
        {introOpen && (
          <motion.button
            type="button"
            aria-label="Enter Atelier Northline website"
            className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-black text-paper"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setIntroOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <p className="font-serif text-5xl leading-none md:text-8xl">Atelier Northline</p>
              <p className="mt-5 text-xs uppercase tracking-[0.34em] text-white/58">Click to enter</p>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
