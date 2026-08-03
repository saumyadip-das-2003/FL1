"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { createElement, useEffect, useRef, useState } from "react";

const lottieScriptId = "lottiefiles-player-script";
const loaderLottieUrl = "https://assets2.lottiefiles.com/packages/lf20_Z4BhGL.json";

function LottieLoader() {
  useEffect(() => {
    if (document.getElementById(lottieScriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.id = lottieScriptId;
    script.src = "https://unpkg.com/@lottiefiles/lottie-player@2.0.12/dist/lottie-player.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return createElement("lottie-player", {
    src: loaderLottieUrl,
    background: "transparent",
    speed: "1",
    loop: true,
    autoplay: true,
    class: "h-28 w-28 md:h-36 md:w-36"
  });
}

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
                <LottieLoader />
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
