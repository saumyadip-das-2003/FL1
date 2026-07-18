"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

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
            className="fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-black/42 text-paper backdrop-blur-xl"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={enterSite}
          >
            <motion.div
              initial={{ opacity: 0, x: "-50%", y: "-50%", scale: 2.25, transformOrigin: "center center" }}
              animate={
                entering
                  ? {
                      opacity: 1,
                      left: "max(1.25rem, calc((100vw - 80rem) / 2 + 2rem))",
                      top: 20,
                      x: 0,
                      y: 0,
                      scale: 1,
                      transformOrigin: "top left"
                    }
                  : {
                      opacity: 1,
                      left: "50%",
                      top: "50%",
                      x: "-50%",
                      y: "-50%",
                      scale: 2.25,
                      transformOrigin: "center center"
                    }
              }
              transition={{ duration: entering ? 0.72 : 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute origin-top-left text-center"
            >
              <BrandLogo light className="items-center text-paper" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
