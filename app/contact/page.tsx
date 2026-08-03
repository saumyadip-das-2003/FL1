import { Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { getLiveContent } from "@/lib/live-content";
import { ContactForm } from "@/components/contact-form";
import { ContactSocialSections } from "@/components/contact-social-sections";
import { mapEmbedUrl, mapOpenUrl } from "@/lib/map-links";
import { parseSocialLinks } from "@/lib/social-platforms";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getLiveContent();
  const offices = content.settings.offices.split(/\n+/).map((office) => office.trim()).filter(Boolean);
  const officeMaps = (content.settings.officeMaps ?? "").split(/\n+/).map((map) => map.trim());
  const socialLinks = parseSocialLinks(content);

  return (
    <main className="site-page bg-paper transition-colors dark:bg-charcoal">
      <section className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="site-eyebrow">Contact</p>
          <h1 className="site-page-title mt-5">
            Begin a conversation about place, program, and possibility.
          </h1>
          <div className="mt-12 grid gap-5 text-sm">
            <p className="flex items-center gap-3">
              <Mail size={18} />
              <a href={`mailto:${content.settings.email}`} className="transition hover:text-muted">
                {content.settings.email}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Phone size={18} /> {content.settings.phone}
            </p>
            <p className="flex items-center gap-3">
              <MapPin size={18} /> {content.settings.address}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            <ContactForm />
            <div className="mt-10 border-t border-black/10 pt-8 dark:border-white/10">
              <p className="site-eyebrow">Social Media</p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
                Follow the studio across active channels for project updates, process notes, and announcements.
              </p>
              <ContactSocialSections links={socialLinks} />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl gap-6 md:grid-cols-2">
        {offices.map((office, index) => {
          const map = officeMaps[index];
          const embedMap = mapEmbedUrl(map);
          const openMap = mapOpenUrl(map);

          return (
            <Reveal key={`${office}-${index}`} delay={index * 0.05}>
              <article className="overflow-hidden border border-black/10 bg-white dark:border-white/10 dark:bg-[#4a4a4a]">
                <div className="p-6">
                  <p className="site-eyebrow">Office {index + 1}</p>
                  <p className="mt-3 font-serif text-2xl leading-tight">{office}</p>
                </div>
                <div className="aspect-[16/10] bg-paper dark:bg-charcoal">
                  {embedMap ? (
                    <div className="relative h-full">
                      <iframe src={embedMap} title={`${office} map`} className="h-full w-full" loading="lazy" />
                      {openMap ? (
                        <a
                          href={openMap}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute left-4 top-4 bg-white/95 px-3 py-2 text-xs uppercase tracking-[0.14em] text-ink shadow-soft transition hover:bg-ink hover:text-paper"
                        >
                          Open in Maps
                        </a>
                      ) : null}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-center text-muted">
                      <div>
                        <MapPin className="mx-auto mb-4" size={28} />
                        <p className="text-xs uppercase tracking-[0.24em]">Map not added</p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>
    </main>
  );
}
