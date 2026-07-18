import Image from "next/image";
import { Reveal } from "@/components/reveal";

const sections = [
  {
    label: "Mission",
    title: "We pursue architecture that is formally clear, materially precise, and generous to daily life.",
    body:
      "Every commission begins with context: climate, program, construction culture, budget, and the social behaviors the project must support. From that foundation, the work develops through disciplined proportion, long-life materials, and carefully staged transitions between public and private space."
  },
  {
    label: "Vision",
    title: "To shape calm, durable places that help cities adapt with intelligence and grace.",
    body:
      "Our long-term ambition is to connect design excellence with climate responsibility. We imagine buildings, interiors, and landscapes that remain useful, legible, and emotionally resonant as communities and environments continue to change."
  },
  {
    label: "Message from Founder",
    title: "Architecture should make complexity feel quietly resolved.",
    body:
      "Atelier Northline was shaped around a simple belief: the best spaces carry discipline without losing warmth. This placeholder founder message can later introduce the real practice, its origins, collaborators, and the values that guide each commission."
  }
];

export default function AboutPage() {
  return (
    <main className="bg-paper transition-colors dark:bg-charcoal">
      <section className="px-5 pb-20 pt-32 md:px-8 md:pb-28 md:pt-40">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-muted">Studio Profile</p>
            <h1 className="mt-5 font-serif text-6xl leading-[0.98] text-balance md:text-8xl">
              Quiet buildings with a strong public life.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-9 text-muted">
              Atelier Northline is a dummy architecture practice profile created for this prototype. The studio is
              positioned as a multidisciplinary office working across civic architecture, private residences,
              hospitality interiors, exterior envelopes, and climate-responsive landscapes.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative h-[60vh] overflow-hidden bg-black">
        <Image
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=80"
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
                <p className="font-serif text-4xl leading-tight text-balance md:text-6xl">{section.title}</p>
                <p className="mt-8 max-w-3xl text-lg leading-9 text-muted">{section.body}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
