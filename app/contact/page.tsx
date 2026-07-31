import { Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { getLiveContent } from "@/lib/live-content";
import { ContactForm } from "@/components/contact-form";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getLiveContent();
  const offices = content.settings.offices.split(/\n+/).map((office) => office.trim()).filter(Boolean);
  const officeMaps = (content.settings.officeMaps ?? "").split(/\n+/).map((map) => map.trim());

  return (
    <main className="bg-paper px-5 pb-24 pt-32 transition-colors dark:bg-charcoal md:px-8 md:pb-32 md:pt-40">
      <section className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Contact</p>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-balance md:text-6xl">
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
          <ContactForm />
        </Reveal>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl gap-6 md:grid-cols-2">
        {offices.map((office, index) => {
          const map = officeMaps[index];

          return (
            <Reveal key={`${office}-${index}`} delay={index * 0.05}>
              <article className="overflow-hidden border border-black/10 bg-white dark:border-white/10 dark:bg-[#4a4a4a]">
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-muted">Office {index + 1}</p>
                  <p className="mt-3 font-serif text-2xl leading-tight">{office}</p>
                </div>
                <div className="aspect-[16/10] bg-paper dark:bg-charcoal">
                  {map ? (
                    <iframe src={map} title={`${office} map`} className="h-full w-full" loading="lazy" />
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
