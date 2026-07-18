import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { newsItems } from "@/lib/news";

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
          {newsItems.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <Link
                href={`/news/${item.slug}`}
                className="group grid gap-6 border-t border-black/10 pt-8 dark:border-white/10 md:grid-cols-[320px_1fr] md:items-start"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <Image src={item.image} alt={item.title} fill sizes="(min-width: 768px) 320px, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="max-w-3xl">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">
                    {item.category} / {item.date}
                  </p>
                  <h2 className="mt-4 font-serif text-4xl leading-tight transition group-hover:text-muted md:text-5xl">{item.title}</h2>
                  <p className="mt-5 text-lg leading-8 text-muted">{item.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
