import Image from "next/image";
import { Reveal } from "@/components/reveal";

const services = [
  {
    title: "Architecture Design & Drafting",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
    description:
      "Professional architectural drawings and documentation for concept, planning, and presentation stages.",
    tags: ["AutoCAD", "Revit", "Planning"]
  },
  {
    title: "3D Modeling",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80",
    description:
      "Accurate architectural models for design development, visualization, consultant coordination, and client review.",
    tags: ["3ds Max", "SketchUp", "Rhino", "Revit"]
  },
  {
    title: "Rendering & Visualization",
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=80",
    description:
      "High-quality still renders that communicate materiality, lighting, landscape context, and spatial experience.",
    tags: ["Lumion", "V-Ray", "Enscape", "D5 Render"]
  },
  {
    title: "Interior Design",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80",
    description:
      "Interior concepts, finish palettes, lighting strategy, furniture planning, and detailed room atmospheres.",
    tags: ["FF&E", "Lighting", "Material"]
  },
  {
    title: "Exterior & Facade",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
    description:
      "Facade composition, exterior material systems, shading studies, and envelope identity for built projects.",
    tags: ["Facade", "Envelope", "Climate"]
  },
  {
    title: "Animation & Walkthrough",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    description:
      "Cinematic walkthroughs, project films, motion studies, and presentation-ready spatial storytelling.",
    tags: ["Film", "Motion", "Client Deck"]
  }
];

export default function ServicesPage() {
  return (
    <main className="bg-paper px-5 pb-24 pt-32 transition-colors dark:bg-charcoal md:px-8 md:pb-32 md:pt-40">
      <section className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-muted">Services</p>
            <h1 className="mt-5 font-serif text-6xl leading-[0.98] text-balance md:text-8xl">Our expertise</h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-muted">
              From concept drafting to cinematic walkthroughs, we deliver architecture-focused design and visualization
              services for local and international projects.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.04}>
              <article className="group overflow-hidden border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-[#0d0d0d]">
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
                    {service.tags.map((tag) => (
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
