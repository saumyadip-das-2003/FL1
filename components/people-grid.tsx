"use client";

import Image from "next/image";
import { useState } from "react";
import { PersonModal } from "@/components/person-modal";
import { Reveal } from "@/components/reveal";
import { team } from "@/lib/data";

type Person = (typeof team)[number];

export function PeopleGrid() {
  const [activePerson, setActivePerson] = useState<Person | null>(null);

  return (
    <>
      <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member, index) => (
          <Reveal key={member.name} delay={index * 0.04}>
            <article className="group">
              <button
                type="button"
                onClick={() => setActivePerson(member)}
                className="relative block aspect-[4/5] w-full overflow-hidden bg-black text-left"
                aria-label={`Open ${member.name} profile`}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
              </button>
              <h2 className="mt-5 font-serif text-3xl">{member.name}</h2>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{member.role}</p>
              <p className="mt-4 text-sm leading-7 text-muted">{member.bio}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <PersonModal person={activePerson} open={Boolean(activePerson)} onClose={() => setActivePerson(null)} />
    </>
  );
}
