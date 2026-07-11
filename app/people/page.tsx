import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { team } from "@/lib/data";

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

        <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <Reveal key={member.name} delay={index * 0.04}>
              <article className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover grayscale transition duration-700 group-hover:scale-110 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                </div>
                <h2 className="mt-5 font-serif text-3xl">{member.name}</h2>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{member.role}</p>
                <p className="mt-4 text-sm leading-7 text-muted">{member.bio}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
