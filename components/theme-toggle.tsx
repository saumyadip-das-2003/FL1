"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-10 w-10 items-center justify-center border border-black/15 bg-white text-ink transition duration-300 hover:bg-ink hover:text-paper dark:border-white/15 dark:bg-[#202020] dark:text-paper dark:hover:bg-paper dark:hover:text-ink"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
