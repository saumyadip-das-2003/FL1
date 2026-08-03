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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="pointer-events-none fixed left-1/2 top-24 z-[155] -translate-x-1/2 border border-black/10 bg-white/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#4b4b4b]/90 dark:text-paper md:top-28"
            >
              Loading
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
