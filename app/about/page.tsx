import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { getLiveContent, parseAboutMessages } from "@/lib/live-content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getLiveContent();
  const messages = parseAboutMessages(content);
  const sections = [
    {
      label: "Mission",
      title: content.settings.aboutMissionTitle || content.settings.aboutMission,
      body: content.settings.aboutMission
    },
    {
      label: "Vision",
      title: content.settings.aboutVisionTitle || content.settings.aboutVision,
      body: content.settings.aboutVision
    }
  ];

  return (
    <main className="bg-paper transition-colors dark:bg-charcoal">
      <section className="site-page">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <Reveal>
            <p className="site-eyebrow">Studio Profile</p>
            <h1 className="site-page-title mt-5">
              {content.settings.aboutStudioTitle || "Quiet buildings with a strong public life."}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-base leading-8 text-muted md:text-lg md:leading-9">
              {content.settings.aboutStudioProfile}
            </p>
          </Reveal>
        </div>
      </section>

      {content.settings.aboutHeroImage ? (
        <section className="relative h-[42vh] overflow-hidden bg-black md:h-[60vh]">
          <Image
            src={content.settings.aboutHeroImage}
            alt="Architecture studio workspace"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </section>
      ) : null}

      <section className="site-section">
        <div className="mx-auto grid max-w-7xl gap-16">
          {sections.map((section) => (
            <div
              key={section.label}
              className="grid gap-10 border-t border-black/10 pt-12 dark:border-white/10 lg:grid-cols-[0.7fr_1.3fr]"
            >
              <Reveal>
                <p className="site-eyebrow">{section.label}</p>
              </Reveal>
              <Reveal delay={0.08}>
                <div>
                  <div>
                    <p className="font-serif text-2xl leading-tight text-balance md:text-5xl">{section.title}</p>
                    <p className="mt-6 max-w-3xl text-base leading-8 text-muted md:mt-8 md:text-lg md:leading-9">{section.body}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}

          <div className="grid gap-10 border-t border-black/10 pt-12 dark:border-white/10 lg:grid-cols-[0.7fr_1.3fr]">
            <Reveal>
              <p className="site-eyebrow">Messages</p>
            </Reveal>
            <div className="grid gap-12">
              {messages.map((message, index) => (
                <Reveal key={message.id} delay={index * 0.06}>
                  <article className={`grid gap-8 md:items-start ${message.image ? "md:grid-cols-[260px_1fr]" : ""}`}>
                    {message.image ? (
                      <div className="relative aspect-[4/5] overflow-hidden bg-black">
                        <Image
                          src={message.image}
                          alt={message.name}
                          fill
                          sizes="(min-width: 768px) 260px, 100vw"
                          className="object-cover grayscale"
                        />
                      </div>
                    ) : null}
                    <div>
                      <p className="font-serif text-2xl leading-tight text-balance md:text-5xl">{message.name}</p>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted md:text-xs md:tracking-[0.24em]">{message.role}</p>
                      <p className="mt-6 max-w-3xl text-base leading-8 text-muted md:mt-8 md:text-lg md:leading-9">{message.message}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
