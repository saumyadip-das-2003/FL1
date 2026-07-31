import { SocialLinks } from "@/components/social-links";
import { getLiveContent } from "@/lib/live-content";
import Link from "next/link";

export async function Footer() {
  const content = await getLiveContent();
  const offices = content.settings.offices.split(/\n+/).map((office) => office.trim()).filter(Boolean);
  const socialLinks = [
    { label: "WhatsApp", href: content.settings.whatsapp },
    { label: "Call", href: `tel:${content.settings.phone.replace(/\s+/g, "")}` },
    { label: "Facebook", href: content.settings.facebook }
  ];

  return (
    <footer data-site-chrome className="border-t border-black/10 bg-paper px-5 py-16 transition-colors dark:border-white/10 dark:bg-charcoal md:px-8">
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
            <Link href="/admin/catalogue.pdf" target="_blank" className="block pt-2 text-xs uppercase tracking-[0.18em] text-muted underline">
              Download Catalogue
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
