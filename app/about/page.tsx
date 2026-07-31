import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { getLiveContent } from "@/lib/live-content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getLiveContent();
  const sections = [
    {
      label: "Mission",
      title: content.settings.aboutMission,
      body: content.settings.aboutMission
    },
    {
      label: "Vision",
      title: content.settings.aboutVision,
      body: content.settings.aboutVision
    },
    {
      label: "Message from Founder",
      title: "Message from Founder",
      body: content.settings.founderMessage
    }
  ];

  return (
    <main className="bg-paper transition-colors dark:bg-charcoal">
      <section className="px-5 pb-20 pt-32 md:px-8 md:pb-28 md:pt-40">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-muted">Studio Profile</p>
            <h1 className="mt-5 font-serif text-4xl leading-tight text-balance md:text-6xl">
              Quiet buildings with a strong public life.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-9 text-muted">
              {content.settings.aboutStudioProfile}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative h-[60vh] overflow-hidden bg-black">
        <Image
          src={content.settings.aboutHeroImage}
          alt="Architecture studio workspace"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </section>

      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-16">
          {sections.map((section) => (
            <div
              key={section.label}
              className="grid gap-10 border-t border-black/10 pt-12 dark:border-white/10 lg:grid-cols-[0.7fr_1.3fr]"
            >
              <Reveal>
                <p className="text-xs uppercase tracking-[0.28em] text-muted">{section.label}</p>
              </Reveal>
              <Reveal delay={0.08}>
                <div>
                  <div>
                    <p className="font-serif text-3xl leading-tight text-balance md:text-5xl">{section.title}</p>
                    <p className="mt-8 max-w-3xl text-lg leading-9 text-muted">{section.body}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
