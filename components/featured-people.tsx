import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { adminPersonToTeamMember, getLiveContent } from "@/lib/live-content";

export async function FeaturedPeople() {
  const content = await getLiveContent();
  const people = content.people.map(adminPersonToTeamMember).slice(0, 4);

  if (!people.length) {
    return null;
  }

  return (
    <section className="bg-white px-5 py-24 transition-colors dark:bg-[#4a4a4a] md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted">People</p>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-balance md:text-6xl">
                The studio team behind the work.
              </h2>
            </div>
            <Link
              href="/people"
              className="inline-flex w-fit items-center gap-3 border border-black/20 px-6 py-4 text-xs uppercase tracking-[0.22em] transition hover:bg-ink hover:text-paper dark:border-white/20 dark:hover:bg-paper dark:hover:text-ink"
            >
              View people <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((person, index) => (
            <Reveal key={person.name} delay={index * 0.05}>
              <Link href="/people" className="group block border-t border-black/10 pt-5 dark:border-white/10">
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                <h3 className="mt-5 font-serif text-2xl leading-tight transition group-hover:text-muted">
                  {person.name}
                </h3>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">{person.role}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
