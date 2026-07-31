"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function SiteChromeVisibility() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.toggle("admin-route", pathname.startsWith("/admin"));
    return () => document.body.classList.remove("admin-route");
  }, [pathname]);

  return null;
}
