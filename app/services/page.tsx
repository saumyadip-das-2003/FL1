import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

const services = [
  {
    title: "Architecture",
    description:
      "Concept design, planning strategy, design development, documentation coordination, and public-facing architectural narratives."
  },
  {
    title: "Interior Design",
    description:
      "Spatial planning, material palettes, lighting strategy, furniture integration, and detailed interior atmospheres for residential and commercial work."
  },
  {
    title: "Exterior & Facade",
    description:
      "Envelope concepts, facade rhythm studies, shade strategies, material assemblies, and elevation systems tuned to climate and identity."
  },
  {
    title: "Landscape",
    description:
      "Site planning, public realm design, planting frameworks, rain gardens, courtyards, terraces, and climate-responsive outdoor spaces."
  },
  {
    title: "Visualization",
    description:
      "Competition imagery, client presentation visuals, project films, diagrams, and spatial storytelling for early and advanced design stages."
  },
  {
    title: "Design Advisory",
    description:
      "Feasibility reviews, design audits, brand-aligned spatial direction, and strategic guidance for owners, developers, and institutions."
  }
];

export default function ServicesPage() {
  return (
    <main className="bg-paper px-5 pb-24 pt-32 transition-colors dark:bg-charcoal md:px-8 md:pb-32 md:pt-40">
      <section className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Services</p>
          <h1 className="mt-5 max-w-5xl font-serif text-6xl leading-[0.98] text-balance md:text-8xl">
            Integrated design services from first study to built atmosphere.
          </h1>
        </Reveal>

        <div className="mt-16 border-t border-black/10 dark:border-white/10">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.04}>
              <article className="grid gap-6 border-b border-black/10 py-9 dark:border-white/10 md:grid-cols-[0.45fr_1fr]">
                <div>
                  <p className="font-serif text-5xl text-muted">0{index + 1}</p>
                  <h2 className="mt-4 font-serif text-4xl leading-tight">{service.title}</h2>
                </div>
                <p className="max-w-3xl text-lg leading-9 text-muted">{service.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <Link
            href="/contact"
            className="mt-14 inline-flex items-center gap-3 border border-black/20 px-6 py-4 text-xs uppercase tracking-[0.22em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink"
          >
            Discuss a commission <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
