import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { getLiveContent } from "@/lib/live-content";
import type { AdminService } from "@/lib/admin-demo-data";

function isService(service: AdminService | undefined): service is AdminService {
  return Boolean(service);
}

export async function FeaturedServices() {
  const content = await getLiveContent();
  const featuredIds = content.settings.featuredServiceIds.split(",").map((id) => id.trim()).filter(Boolean);
  const services = featuredIds.length
    ? featuredIds.map((id) => content.services.find((service) => service.id === id)).filter(isService)
    : content.services.slice(0, 3);

  return (
    <section className="site-section bg-white transition-colors dark:bg-[#4a4a4a]">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="site-eyebrow">Featured Services</p>
              <h2 className="site-section-title mt-4 max-w-3xl">
                Design support from concept to visual story.
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex w-fit items-center gap-3 border border-black/20 px-5 py-3 text-[11px] uppercase tracking-[0.18em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink md:px-6 md:py-4 md:text-xs md:tracking-[0.22em]"
            >
              More services <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.06}>
              <article className="group overflow-hidden border border-black/10 bg-paper dark:border-white/10 dark:bg-charcoal">
                {service.image ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="p-6">
                  <h3 className="site-card-title">{service.title}</h3>
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
