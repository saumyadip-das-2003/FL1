import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { newsItems } from "@/lib/news";

export function FeaturedNews() {
  return (
    <section className="bg-paper px-5 py-24 transition-colors dark:bg-charcoal md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted">Featured News</p>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-balance md:text-6xl">
                Recent studio notes and project milestones.
              </h2>
            </div>
            <Link
              href="/news"
              className="inline-flex w-fit items-center gap-3 border border-black/20 px-6 py-4 text-xs uppercase tracking-[0.22em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink"
            >
              More news <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {newsItems.slice(0, 2).map((item, index) => (
            <Reveal key={item.slug} delay={index * 0.06}>
              <Link href={`/news/${item.slug}`} className="group grid gap-5 border-t border-black/10 pt-6 dark:border-white/10">
                <div className="relative aspect-[16/9] overflow-hidden bg-black">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">
                    {item.category} / {item.date}
                  </p>
                  <h3 className="mt-4 font-serif text-3xl leading-tight transition group-hover:text-muted md:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{item.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
