import { SocialLinks } from "@/components/social-links";
import { getLiveContent } from "@/lib/live-content";
import { parseBrandLinks, selectedSocialLinks } from "@/lib/social-platforms";
import Image from "next/image";
import Link from "next/link";

export async function Footer() {
  const content = await getLiveContent();
  const offices = content.settings.offices.split(/\n+/).map((office) => office.trim()).filter(Boolean);
  const socialLinks = selectedSocialLinks(content, "footerSocialIds");
  const brandLinks = parseBrandLinks(content);

  return (
    <footer data-site-chrome className="mt-20 border-t border-black/20 bg-neutral-100 px-5 py-20 shadow-[0_-18px_50px_rgba(0,0,0,0.05)] transition-colors dark:border-white/15 dark:bg-[#3f3f3f] md:mt-28 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-serif text-4xl text-balance md:text-5xl">{content.settings.companyName}</p>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted">
            {content.settings.homeTagline}
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
            <p>
              <a href={`mailto:${content.settings.email}`} className="transition hover:text-muted">
                {content.settings.email}
              </a>
            </p>
            <p>{content.settings.phone}</p>
            <div className="pt-3">
              <SocialLinks compact links={socialLinks} />
            </div>
            <Link href="/admin/login" className="inline-block pt-4 text-xs uppercase tracking-[0.18em] text-muted underline">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
      {brandLinks.length > 0 && (
        <div className="mx-auto mt-14 max-w-7xl border-t border-black/10 pt-8 dark:border-white/10">
          <p className="mb-5 text-xs uppercase tracking-[0.24em] text-muted">Brands & Collaborations</p>
          <div className="flex flex-wrap items-center gap-4">
            {brandLinks.map((brand) => (
              <Link
                key={brand.id}
                href={brand.href || "#"}
                target={brand.href ? "_blank" : undefined}
                rel={brand.href ? "noreferrer" : undefined}
                className="flex h-16 w-32 items-center justify-center border border-black/10 bg-white p-3 transition hover:opacity-70 dark:border-white/10 dark:bg-[#4a4a4a]"
                aria-label={brand.name}
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={160}
                  height={80}
                  className="max-h-full w-auto object-contain"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </footer>
  );
}
