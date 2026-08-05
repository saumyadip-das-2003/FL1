import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SocialLinks } from "@/components/social-links";
import { adminServiceTags, getLiveContent, parseLinkItems, parseTextItems } from "@/lib/live-content";
import { selectedSocialLinks } from "@/lib/social-platforms";
import type { AdminLinkItem, AdminSocialLink } from "@/lib/admin-demo-data";

export const dynamic = "force-dynamic";

function isShown(value?: string) {
  return value !== "false";
}

type SupportCard = {
  show: boolean;
  title: string;
  body: string;
  links: AdminLinkItem[];
  socialLinks: AdminSocialLink[];
};

export default async function ServicesPage() {
  const content = await getLiveContent();
  const services = content.services;
  const workflow = parseTextItems(content.settings.serviceWorkflow);
  const whyChoose = parseTextItems(content.settings.serviceWhyChoose);
  const freelanceLinks = parseLinkItems(content.settings.serviceFreelanceLinks);
  const socialPresenceLinks = selectedSocialLinks(content, "serviceSocialPresenceSocialIds");
  const supportCards: SupportCard[] = [
    {
      show: isShown(content.settings.serviceShowFreelance),
      title: content.settings.serviceFreelanceTitle,
      body: content.settings.serviceFreelanceBody,
      links: freelanceLinks,
      socialLinks: []
    },
    {
      show: isShown(content.settings.serviceShowLocalSupport),
      title: content.settings.serviceLocalSupportTitle,
      body: content.settings.serviceLocalSupportBody,
      links: [],
      socialLinks: []
    },
    {
      show: isShown(content.settings.serviceShowSocialPresence),
      title: content.settings.serviceSocialPresenceTitle,
      body: content.settings.serviceSocialPresenceBody,
      links: [],
      socialLinks: socialPresenceLinks
    }
  ].filter((item) => item.show);

  return (
    <main className="site-page bg-paper transition-colors dark:bg-charcoal">
      <section className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="site-eyebrow">Services</p>
            <h1 className="site-page-title mt-5">{content.settings.servicesIntroTitle}</h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted md:mt-7 md:text-lg">
              {content.settings.servicesIntroBody}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-7 md:mt-16 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.04}>
              <article className="group overflow-hidden border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-[#4a4a4a]">
                {service.image ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="p-6 md:p-8">
                  <h2 className="site-card-title">{service.title}</h2>
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

        {isShown(content.settings.serviceShowWorkflow) && workflow.length > 0 && (
          <Reveal>
            <section className="mt-16 border-t border-black/10 pt-12 dark:border-white/10 md:mt-24 md:pt-16">
              <p className="site-eyebrow">Our workflow</p>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {workflow.map((step, index) => (
                  <article key={step.id} className="border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#4a4a4a]">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted md:text-xs md:tracking-[0.24em]">Step {String(index + 1).padStart(2, "0")}</p>
                    <h2 className="mt-5 site-card-title">{step.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-muted">{step.body}</p>
                  </article>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {isShown(content.settings.serviceShowWhyChoose) && whyChoose.length > 0 && (
          <Reveal>
            <section className="mt-16 grid gap-10 border-t border-black/10 pt-12 dark:border-white/10 md:mt-24 md:pt-16 lg:grid-cols-[0.55fr_1.45fr]">
              <div>
                <p className="site-eyebrow">Why choose us</p>
                <h2 className="mt-5 font-serif text-3xl leading-tight md:text-5xl">Built for clear delivery.</h2>
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
        )}

        {supportCards.length > 0 && (
          <section className="mt-16 grid gap-6 md:mt-24 md:grid-cols-3">
            {supportCards.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="min-h-full border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#4a4a4a] md:p-7">
                <h2 className="site-card-title">{item.title}</h2>
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
                {item.socialLinks.length > 0 && (
                  <div className="mt-6">
                    <SocialLinks compact links={item.socialLinks} />
                  </div>
                )}
              </article>
            </Reveal>
            ))}
          </section>
        )}

        {(isShown(content.settings.serviceShowTeamCulture) || isShown(content.settings.serviceShowCta)) && (
          <Reveal>
            <section className="mt-16 grid gap-8 border-y border-black/10 py-10 dark:border-white/10 md:mt-24 md:grid-cols-[1fr_auto] md:items-center md:py-14">
            <div>
              {isShown(content.settings.serviceShowTeamCulture) && (
                <>
                  <p className="site-eyebrow">{content.settings.serviceTeamCultureTitle}</p>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-muted md:text-lg md:leading-9">{content.settings.serviceTeamCultureBody}</p>
                </>
              )}
              {isShown(content.settings.serviceShowCta) && (
                <h2 className="mt-8 font-serif text-3xl leading-tight md:mt-10 md:text-5xl">{content.settings.serviceCtaTitle}</h2>
              )}
            </div>
            {isShown(content.settings.serviceShowCta) && (
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="border border-black/20 px-5 py-3 text-[11px] uppercase tracking-[0.18em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink md:px-6 md:py-4 md:text-xs md:tracking-[0.22em]">
                  {content.settings.serviceCtaPrimaryLabel}
                </Link>
                <Link href="/contact" className="border border-black/20 px-5 py-3 text-[11px] uppercase tracking-[0.18em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink md:px-6 md:py-4 md:text-xs md:tracking-[0.22em]">
                  {content.settings.serviceCtaSecondaryLabel}
                </Link>
              </div>
            )}
            </section>
          </Reveal>
        )}
      </section>
    </main>
  );
}
