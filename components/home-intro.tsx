"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function HomeIntro({ children }: { children: React.ReactNode }) {
  const [introOpen, setIntroOpen] = useState(true);
  const [entering, setEntering] = useState(false);

  function enterSite() {
    setEntering(true);
    window.setTimeout(() => setIntroOpen(false), 780);
  }

  return (
    <>
      <AnimatePresence>
        {introOpen && (
          <motion.button
            type="button"
            aria-label="Enter Atelier Northline website"
            className="fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-black/50 text-paper backdrop-blur-xl"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={enterSite}
          >
            <motion.div
              initial={{ opacity: 0, x: "-50%", y: "-44%", scale: 1 }}
              animate={
                entering
                  ? { opacity: 1, left: 20, top: 16, x: 0, y: 0, scale: 0.32 }
                  : { opacity: 1, left: "50%", top: "50%", x: "-50%", y: "-50%", scale: 1 }
              }
              transition={{ duration: entering ? 0.72 : 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute text-center origin-top-left"
            >
              <p className="whitespace-nowrap font-serif text-5xl leading-none md:text-8xl">Atelier Northline</p>
              <motion.p
                animate={entering ? { opacity: 0, y: -8 } : { opacity: 1, y: 0 }}
                className="mt-5 text-xs uppercase tracking-[0.34em] text-white/58"
              >
                Click to enter
              </motion.p>
            </motion.div>
            <motion.div
              className="absolute inset-x-0 bottom-10 text-center text-[10px] uppercase tracking-[0.28em] text-white/40"
              animate={entering ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
            >
              Architecture Studio
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
