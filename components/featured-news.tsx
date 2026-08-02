import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { adminNewsToNewsItem, getLiveContent } from "@/lib/live-content";
import type { NewsItem } from "@/lib/news";

function isNewsItem(item: NewsItem | undefined): item is NewsItem {
  return Boolean(item);
}

export async function FeaturedNews() {
  const content = await getLiveContent();
  const newsItems = content.news.map(adminNewsToNewsItem);
  const featuredIds = content.settings.featuredNewsIds.split(",").map((id) => id.trim()).filter(Boolean);
  const featuredNews = featuredIds.length
    ? featuredIds.map((id) => newsItems.find((item) => item.slug === id)).filter(isNewsItem)
    : newsItems.slice(0, 2);

  return (
    <section className="site-section bg-paper transition-colors dark:bg-charcoal">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="site-eyebrow">Featured News</p>
              <h2 className="site-section-title mt-4 max-w-3xl">
                Recent studio notes and project milestones.
              </h2>
            </div>
            <Link
              href="/news"
              className="inline-flex w-fit items-center gap-3 border border-black/20 px-5 py-3 text-[11px] uppercase tracking-[0.18em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink md:px-6 md:py-4 md:text-xs md:tracking-[0.22em]"
            >
              More news <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {featuredNews.slice(0, 2).map((item, index) => (
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
                  <p className="site-eyebrow">
                    {item.category} / {item.date}
                  </p>
                  <h3 className="mt-4 font-serif text-2xl leading-tight transition group-hover:text-muted md:text-4xl">
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
