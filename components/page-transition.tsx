"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const loadingStartedAt = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const minVisibleTime = 520;
    const elapsed = Date.now() - loadingStartedAt.current;
    const remaining = Math.max(180, minVisibleTime - elapsed);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, remaining);
  }, [pathname]);

  useEffect(() => {
    function startLoading() {
      loadingStartedAt.current = Date.now();
      setIsLoading(true);
    }

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");
      const download = anchor.hasAttribute("download");

      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || targetAttr || download) {
        return;
      }

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) {
        return;
      }

      startLoading();
    }

    window.addEventListener("popstate", startLoading);
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("popstate", startLoading);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <>
            <motion.div
              key="route-progress"
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 z-[160] h-[3px] w-full origin-left bg-ink shadow-[0_0_24px_rgba(0,0,0,0.2)] dark:bg-paper"
            />
            <motion.div
              key="route-loading-mark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="pointer-events-none fixed inset-0 z-[155] grid place-items-center bg-paper/45 backdrop-blur-[2px] dark:bg-[#3f3f3f]/45"
            >
              <div className="flex -translate-y-[2vh] flex-col items-center gap-5">
                <div className="relative h-20 w-20">
                  {[
                    "left-0 top-0 origin-bottom-right",
                    "right-0 top-0 origin-bottom-left",
                    "bottom-0 left-0 origin-top-right",
                    "bottom-0 right-0 origin-top-left"
                  ].map((position, index) => (
                    <motion.span
                      key={position}
                      className={`absolute h-[38px] w-[38px] bg-ink shadow-sm dark:bg-paper ${position}`}
                      animate={{
                        x: index % 2 === 0 ? [-1, -14, -1, 0] : [1, 14, 1, 0],
                        y: index < 2 ? [-1, -14, -1, 0] : [1, 14, 1, 0],
                        rotate: index % 2 === 0 ? [0, -12, 5, 0] : [0, 12, -5, 0],
                        opacity: [0.85, 1, 1, 0.9]
                      }}
                      transition={{
                        duration: 1.15,
                        repeat: Infinity,
                        ease: [0.65, 0, 0.35, 1],
                        delay: index * 0.04
                      }}
                    />
                  ))}
                </div>
                <motion.p
                  className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink dark:text-paper"
                  animate={{ opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 1.15, repeat: Infinity, ease: "easeInOut" }}
                >
                  Loading
                </motion.p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        key={pathname}
        initial={{ opacity: 0.96 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
