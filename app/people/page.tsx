import { PeopleGrid } from "@/components/people-grid";
import { Reveal } from "@/components/reveal";

export default function PeoplePage() {
  return (
    <main className="bg-paper px-5 pb-24 pt-32 transition-colors dark:bg-charcoal md:px-8 md:pb-32 md:pt-40">
      <section className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">People</p>
          <h1 className="mt-5 max-w-5xl font-serif text-6xl leading-[0.98] text-balance md:text-8xl">
            A compact studio shaped by research, delivery, and craft.
          </h1>
        </Reveal>

        <PeopleGrid />
      </section>
    </main>
  );
}
