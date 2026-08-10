import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { adminNewsToNewsItem, getLiveContent } from "@/lib/live-content";

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const content = await getLiveContent();
  const newsItems = content.news.map(adminNewsToNewsItem);
  const item = newsItems.find((entry) => entry.slug === params.slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="bg-paper pb-24 pt-20 transition-colors dark:bg-charcoal md:pb-32">
      <section className="relative min-h-[58svh] overflow-hidden bg-black md:min-h-[70vh]">
        {item.image ? <Image src={item.image} alt={item.title} fill priority sizes="100vw" className="object-cover" /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/22 to-black/12" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-8 md:pb-16">
          <div className="mx-auto max-w-7xl text-paper">
            <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-white/75 md:mb-5 md:text-xs md:tracking-[0.28em]">
              {item.category} / {item.date}
            </p>
            <h1 className="max-w-5xl font-serif text-[2.35rem] leading-[1.02] text-balance md:text-6xl">{item.title}</h1>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal>
            <div>
              <Link
                href="/news"
                className="mb-10 inline-flex items-center gap-3 border border-black/20 px-5 py-3 text-[11px] uppercase tracking-[0.18em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink md:text-xs md:tracking-[0.2em]"
              >
                <ArrowLeft size={15} /> All News
              </Link>
              <p className="site-eyebrow">Full Story</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-serif text-2xl leading-tight text-balance md:text-5xl">{item.excerpt}</p>
            <div className="mt-7 grid gap-6 text-base leading-8 text-muted md:mt-9 md:gap-7 md:text-lg md:leading-9">
              {item.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-5 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {item.gallery.filter(Boolean).map((image, index) => (
            <Reveal key={image} delay={index * 0.06}>
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <Image
                  src={image}
                  alt={`${item.title} gallery image ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
