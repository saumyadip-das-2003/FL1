import Link from "next/link";
import { offices } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-paper px-5 py-16 transition-colors dark:border-white/10 dark:bg-charcoal md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-serif text-4xl text-balance md:text-5xl">Atelier Northline</p>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted">
            A prototype architecture studio portfolio for civic, residential, interior, and landscape work.
          </p>
        </div>
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.24em] text-muted">Offices</p>
          <ul className="space-y-3 text-sm">
            {offices.map((office) => (
              <li key={office}>{office}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.24em] text-muted">Contact</p>
          <div className="space-y-3 text-sm">
            <p>studio@ateliernorthline.test</p>
            <p>+880 1700 000 000</p>
            <div className="flex gap-5 pt-3 text-muted">
              <Link href="#">Instagram</Link>
              <Link href="#">LinkedIn</Link>
              <Link href="#">Press</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
