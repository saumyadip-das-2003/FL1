"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

export function HomeIntro({
  children,
  companyName,
  tagline,
  logoUrl,
  homeLogoText
}: {
  children: React.ReactNode;
  companyName?: string;
  tagline?: string;
  logoUrl?: string;
  homeLogoText?: string;
}) {
  const [introOpen, setIntroOpen] = useState(true);
  const [entering, setEntering] = useState(false);
  const [compactIntro, setCompactIntro] = useState(false);

  function enterSite() {
    if (entering) {
      return;
    }

    setEntering(true);
    window.setTimeout(() => setIntroOpen(false), 1040);
  }

  useEffect(() => {
    const timer = window.setTimeout(enterSite, 1800);
    return () => window.clearTimeout(timer);
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const sync = () => setCompactIntro(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <>
      <AnimatePresence>
        {introOpen && (
          <motion.button
            type="button"
            aria-label="Enter Atelier Northline website"
            className="fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-[#101010] text-paper"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={enterSite}
          >
            <motion.div
              initial={{ opacity: 0, x: "-50%", y: "-50%", scale: compactIntro ? 1.35 : 2.25, transformOrigin: "center center" }}
              animate={
                entering
                  ? {
                      opacity: 1,
                      left: compactIntro ? "1rem" : "clamp(2rem, 2.5vw, 3rem)",
                      top: compactIntro ? 12 : 20,
                      x: 0,
                      y: 0,
                      scale: compactIntro ? 0.92 : 1,
                      transformOrigin: "top left"
                    }
                  : {
                      opacity: 1,
                      left: "50%",
                      top: "50%",
                      x: "-50%",
                      y: "-50%",
                      scale: compactIntro ? 1.35 : 2.25,
                      transformOrigin: "center center"
                    }
              }
              transition={{ duration: entering ? 1 : 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute max-w-[88vw] origin-top-left text-center"
            >
              <BrandLogo
                light
                className="items-center text-paper"
                companyName={homeLogoText || companyName}
                tagline={tagline}
                logoUrl={logoUrl}
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
