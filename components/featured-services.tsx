import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

const services = [
  {
    title: "Architecture Design & Drafting",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    description: "Professional drawings and documentation for concept, planning, and presentation stages."
  },
  {
    title: "3D Modeling",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
    description: "Accurate architectural models for design development, visualization, and coordination."
  },
  {
    title: "Rendering & Visualization",
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",
    description: "Still renders and spatial imagery that communicate materiality, light, and atmosphere."
  }
];

export function FeaturedServices() {
  return (
    <section className="bg-white px-5 py-24 transition-colors dark:bg-[#0d0d0d] md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted">Featured Services</p>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-balance md:text-6xl">
                Design support from concept to visual story.
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex w-fit items-center gap-3 border border-black/20 px-6 py-4 text-xs uppercase tracking-[0.22em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink"
            >
              More services <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.06}>
              <article className="group overflow-hidden border border-black/10 bg-paper dark:border-white/10 dark:bg-charcoal">
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-3xl leading-tight">{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{service.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
