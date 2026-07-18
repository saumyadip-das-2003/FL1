import Image from "next/image";
import { Reveal } from "@/components/reveal";

const news = [
  {
    title: "Meridian Pavilion shortlisted for a regional civic design award",
    date: "July 2026",
    category: "Awards",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=80",
    excerpt:
      "The placeholder pavilion study has been recognized for its public ground strategy and climate-responsive envelope."
  },
  {
    title: "Studio research note: shaded thresholds in humid cities",
    date: "June 2026",
    category: "Research",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
    excerpt:
      "A short dummy publication outlining how verandas, arcades, and deep facades can extend civic comfort."
  },
  {
    title: "Atelier Northline opens a temporary project room in Singapore",
    date: "May 2026",
    category: "Studio",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    excerpt:
      "The temporary workspace supports hospitality interiors, cultural competitions, and regional consultant workshops."
  },
  {
    title: "Greenline Campus landscape framework moves into documentation",
    date: "April 2026",
    category: "Projects",
    image: "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?auto=format&fit=crop&w=1400&q=80",
    excerpt:
      "The campus landscape proposal advances with rain gardens, shaded walks, and outdoor teaching rooms."
  }
];

export default function NewsPage() {
  return (
    <main className="bg-paper px-5 pb-24 pt-32 transition-colors dark:bg-charcoal md:px-8 md:pb-32 md:pt-40">
      <section className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">News</p>
          <h1 className="mt-5 max-w-5xl font-serif text-6xl leading-[0.98] text-balance md:text-8xl">
            Studio notes, project milestones, awards, and research updates.
          </h1>
        </Reveal>

        <div className="mt-16 grid gap-10">
          {news.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="grid gap-6 border-t border-black/10 pt-8 dark:border-white/10 md:grid-cols-[320px_1fr] md:items-start">
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <Image src={item.image} alt={item.title} fill sizes="(min-width: 768px) 320px, 100vw" className="object-cover" />
                </div>
                <div className="max-w-3xl">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">
                    {item.category} / {item.date}
                  </p>
                  <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{item.title}</h2>
                  <p className="mt-5 text-lg leading-8 text-muted">{item.excerpt}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
