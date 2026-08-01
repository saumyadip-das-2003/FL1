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
      title: content.settings.aboutMission,
      body: content.settings.aboutMission
    },
    {
      label: "Vision",
      title: content.settings.aboutVision,
      body: content.settings.aboutVision
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

          <div className="grid gap-10 border-t border-black/10 pt-12 dark:border-white/10 lg:grid-cols-[0.7fr_1.3fr]">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.28em] text-muted">Messages</p>
            </Reveal>
            <div className="grid gap-12">
              {messages.map((message, index) => (
                <Reveal key={message.id} delay={index * 0.06}>
                  <article className="grid gap-8 md:grid-cols-[260px_1fr] md:items-start">
                    <div className="relative aspect-[4/5] overflow-hidden bg-black">
                      <Image
                        src={message.image}
                        alt={message.name}
                        fill
                        sizes="(min-width: 768px) 260px, 100vw"
                        className="object-cover grayscale"
                      />
                    </div>
                    <div>
                      <p className="font-serif text-3xl leading-tight text-balance md:text-5xl">{message.name}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.24em] text-muted">{message.role}</p>
                      <p className="mt-8 max-w-3xl text-lg leading-9 text-muted">{message.message}</p>
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
