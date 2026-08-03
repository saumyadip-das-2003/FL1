import { SocialLinkButton } from "@/components/social-links";
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
    <footer data-site-chrome className="border-t border-black/20 bg-neutral-200 px-5 py-8 shadow-[0_-14px_40px_rgba(0,0,0,0.04)] transition-colors dark:border-white/15 dark:bg-[#444444] md:px-8 md:py-10">
      {brandLinks.length > 0 && (
        <div className="mb-7 w-full border-b border-black/10 pb-6 dark:border-white/10">
          <p className="mb-4 text-xs uppercase tracking-[0.24em] text-muted">Partners & Collaborations</p>
          <div className="flex w-full flex-nowrap items-center gap-4 overflow-x-auto overflow-y-hidden pb-2">
            {brandLinks.map((brand) => (
              <Link
                key={brand.id}
                href={brand.href || "#"}
                target={brand.href ? "_blank" : undefined}
                rel={brand.href ? "noreferrer" : undefined}
                className="group relative flex h-16 max-w-36 shrink-0 items-center justify-center overflow-hidden transition"
                aria-label={brand.name}
                title={brand.name}
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={160}
                  height={80}
                  className="h-auto max-h-16 w-auto max-w-36 object-contain transition duration-300 group-hover:scale-95 group-hover:opacity-25"
                />
                <span className="absolute inset-0 flex translate-y-2 items-center justify-center bg-ink/85 px-2 text-center text-[10px] font-semibold uppercase leading-4 tracking-[0.14em] text-paper opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-paper/90 dark:text-ink">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-serif text-4xl text-balance md:text-5xl">{content.settings.companyName}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted">
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
            <Link href="/admin/login" className="inline-block pt-4 text-xs uppercase tracking-[0.18em] text-muted underline">
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {socialLinks.length > 0 ? (
        <div className="mt-7 border-t border-black/10 pt-5 dark:border-white/10">
          <div className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto overflow-y-visible pb-2">
            {socialLinks.map((link) => (
              <div key={`${link.id}-${link.href}`} className="shrink-0">
                <SocialLinkButton link={link} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </footer>
  );
}
