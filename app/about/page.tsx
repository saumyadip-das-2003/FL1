import Image from "next/image";
import { Reveal } from "@/components/reveal";

const values = [
  "Design with climatic intelligence before formal expression.",
  "Make public-facing work legible, generous, and durable.",
  "Treat drawing, research, material testing, and delivery as one continuous practice."
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
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-muted">Mission</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="font-serif text-4xl leading-tight text-balance md:text-6xl">
              We pursue architecture that is formally clear, materially precise, and generous to daily life.
            </p>
            <p className="mt-8 max-w-3xl text-lg leading-9 text-muted">
              Every commission begins with context: climate, program, construction culture, budget, and the social
              behaviors the project must support. From that foundation, the work develops through disciplined
              proportion, long-life materials, and carefully staged transitions between public and private space.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-black/10 px-5 py-20 dark:border-white/10 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-muted">Values</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value, index) => (
              <Reveal key={value} delay={index * 0.08}>
                <div className="border-t border-black/20 pt-6 dark:border-white/20">
                  <p className="font-serif text-5xl text-muted">0{index + 1}</p>
                  <p className="mt-6 text-lg leading-8">{value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
