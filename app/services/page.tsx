import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { adminServiceTags, getLiveContent, parseLinkItems, parseTextItems } from "@/lib/live-content";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const content = await getLiveContent();
  const services = content.services;
  const workflow = parseTextItems(content.settings.serviceWorkflow);
  const whyChoose = parseTextItems(content.settings.serviceWhyChoose);
  const freelanceLinks = parseLinkItems(content.settings.serviceFreelanceLinks);

  return (
    <main className="bg-paper px-5 pb-24 pt-32 transition-colors dark:bg-charcoal md:px-8 md:pb-32 md:pt-40">
      <section className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-muted">Services</p>
            <h1 className="mt-5 font-serif text-4xl leading-tight text-balance md:text-6xl">{content.settings.servicesIntroTitle}</h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-muted">
              {content.settings.servicesIntroBody}
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

        <Reveal>
          <section className="mt-24 border-t border-black/10 pt-16 dark:border-white/10">
            <p className="text-xs uppercase tracking-[0.28em] text-muted">Our workflow</p>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {workflow.map((step, index) => (
                <article key={step.id} className="border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#4a4a4a]">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">Step {String(index + 1).padStart(2, "0")}</p>
                  <h2 className="mt-5 font-serif text-3xl leading-tight">{step.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-muted">{step.body}</p>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-24 grid gap-10 border-t border-black/10 pt-16 dark:border-white/10 lg:grid-cols-[0.55fr_1.45fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted">Why choose us</p>
              <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">Built for clear delivery.</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {whyChoose.map((item) => (
                <article key={item.id} className="border-t border-black/10 pt-5 dark:border-white/10">
                  <h3 className="font-serif text-2xl leading-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{item.body}</p>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        <section className="mt-24 grid gap-6 md:grid-cols-3">
          {[
            {
              title: content.settings.serviceFreelanceTitle,
              body: content.settings.serviceFreelanceBody,
              links: freelanceLinks
            },
            {
              title: content.settings.serviceLocalSupportTitle,
              body: content.settings.serviceLocalSupportBody,
              links: []
            },
            {
              title: content.settings.serviceSocialPresenceTitle,
              body: content.settings.serviceSocialPresenceBody,
              links: []
            }
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="min-h-full border border-black/10 bg-white p-7 dark:border-white/10 dark:bg-[#4a4a4a]">
                <h2 className="font-serif text-3xl leading-tight">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted">{item.body}</p>
                {item.links.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {item.links.map((link) => (
                      <Link key={link.id} href={link.href} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-[0.18em] underline underline-offset-4">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </section>

        <Reveal>
          <section className="mt-24 grid gap-8 border-y border-black/10 py-14 dark:border-white/10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted">{content.settings.serviceTeamCultureTitle}</p>
              <p className="mt-5 max-w-3xl text-lg leading-9 text-muted">{content.settings.serviceTeamCultureBody}</p>
              <h2 className="mt-10 font-serif text-4xl leading-tight md:text-5xl">{content.settings.serviceCtaTitle}</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={content.settings.serviceCtaPrimaryHref} className="border border-black/20 px-6 py-4 text-xs uppercase tracking-[0.22em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink">
                {content.settings.serviceCtaPrimaryLabel}
              </Link>
              <Link href={content.settings.serviceCtaSecondaryHref} className="border border-black/20 px-6 py-4 text-xs uppercase tracking-[0.22em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink">
                {content.settings.serviceCtaSecondaryLabel}
              </Link>
            </div>
          </section>
        </Reveal>
      </section>
    </main>
  );
}
