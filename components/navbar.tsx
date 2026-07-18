"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/people", label: "People" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b transition-all duration-500",
        scrolled || open
          ? "border-black/10 bg-paper/94 shadow-sm backdrop-blur dark:border-white/10 dark:bg-charcoal/94"
          : "border-white/10 bg-black/28 text-paper backdrop-blur-md"
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="Atelier Northline home">
          <BrandLogo light={!scrolled && !open} />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative text-sm uppercase tracking-[0.18em] transition",
                scrolled || open
                  ? "text-muted hover:text-ink dark:hover:text-paper"
                  : "text-white/80 hover:text-white",
                pathname === item.href && (scrolled || open ? "text-ink dark:text-paper" : "text-white")
              )}
            >
              {item.label}
              {pathname === item.href && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute -bottom-2 left-0 h-px w-full bg-current"
                />
              )}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center border border-black/15 bg-white/65 backdrop-blur transition dark:border-white/15 dark:bg-charcoal/65"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-black/10 bg-paper px-5 py-8 dark:border-white/10 dark:bg-charcoal lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-serif text-4xl text-ink transition hover:translate-x-2 dark:text-paper"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
