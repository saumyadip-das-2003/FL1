import { SocialLinks } from "@/components/social-links";
import { offices } from "@/lib/data";
import Link from "next/link";

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
            <div className="pt-3">
              <SocialLinks compact />
            </div>
            <Link href="/admin/login" className="inline-block pt-4 text-xs uppercase tracking-[0.18em] text-muted underline">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
