"use client";

import { SocialLinks } from "@/components/social-links";
import { useEffect, useState } from "react";

export function HomeSocialDock({
  links
}: {
  links?: Parameters<typeof SocialLinks>[0]["links"];
}) {
  const [footerVisible, setFooterVisible] = useState(false);
  const visibleLinks = links?.slice(0, 5);

  useEffect(() => {
    const footer = document.querySelector("[data-site-footer]");
    if (!footer) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.02 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-site-chrome
      className={`fixed bottom-4 right-4 z-40 scale-90 origin-bottom-right overflow-visible transition duration-300 md:bottom-5 md:right-5 md:scale-100 ${
        footerVisible ? "pointer-events-none translate-y-3 opacity-0" : "pointer-events-auto translate-y-0 opacity-100"
      }`}
    >
      <SocialLinks links={visibleLinks} />
    </div>
  );
}
