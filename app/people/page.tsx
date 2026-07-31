import { PeopleGrid } from "@/components/people-grid";
import { Reveal } from "@/components/reveal";
import { adminPersonToTeamMember, getLiveContent } from "@/lib/live-content";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const content = await getLiveContent();
  const team = content.people.map(adminPersonToTeamMember);

  return (
    <main className="bg-paper px-5 pb-24 pt-32 transition-colors dark:bg-charcoal md:px-8 md:pb-32 md:pt-40">
      <section className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">People</p>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-tight text-balance md:text-6xl">
            A compact studio shaped by research, delivery, and craft.
          </h1>
        </Reveal>

        <PeopleGrid team={team} />
      </section>
    </main>
  );
}
