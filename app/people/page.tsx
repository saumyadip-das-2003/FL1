import { PeopleGrid } from "@/components/people-grid";
import { Reveal } from "@/components/reveal";
import { adminPersonToTeamMember, getLiveContent } from "@/lib/live-content";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const content = await getLiveContent();
  const team = content.people.map(adminPersonToTeamMember);
  const roleOptions = content.settings.peopleRoles
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);

  return (
    <main className="site-page bg-paper transition-colors dark:bg-charcoal">
      <section className="mx-auto max-w-7xl">
        <Reveal>
          <p className="site-eyebrow">People</p>
          <h1 className="site-page-title mt-5 max-w-4xl">
            A compact studio shaped by research, delivery, and craft.
          </h1>
        </Reveal>

        <PeopleGrid team={team} roleOptions={roleOptions} />
      </section>
    </main>
  );
}
