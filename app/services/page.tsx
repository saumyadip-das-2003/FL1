import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { adminServiceTags, getLiveContent } from "@/lib/live-content";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const content = await getLiveContent();
  const services = content.services;

  return (
    <main className="bg-paper px-5 pb-24 pt-32 transition-colors dark:bg-charcoal md:px-8 md:pb-32 md:pt-40">
      <section className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-muted">Services</p>
            <h1 className="mt-5 font-serif text-4xl leading-tight text-balance md:text-6xl">Our expertise</h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-muted">
              From concept drafting to cinematic walkthroughs, we deliver architecture-focused design and visualization
              services for local and international projects.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.04}>
              <article className="group overflow-hidden border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-[#4a4a4a]">
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-7 md:p-8">
                  <h2 className="font-serif text-3xl leading-tight">{service.title}</h2>
                  <p className="mt-4 text-base leading-8 text-muted">{service.description}</p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {adminServiceTags(service).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs text-ink/80 dark:border-white/15 dark:text-paper/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
