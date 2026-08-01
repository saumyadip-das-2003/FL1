import { CataloguePrintButton } from "@/components/admin/catalogue-print-button";
import { adminNewsToNewsItem, adminServiceTags, getLiveContent } from "@/lib/live-content";

export const dynamic = "force-dynamic";

function splitLines(value: string) {
  return value
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function CataloguePage() {
  const content = await getLiveContent();
  const offices = splitLines(content.settings.offices);
  const news = content.news.map(adminNewsToNewsItem);

  return (
    <main className="bg-white text-black">
      <CataloguePrintButton />
      <style>
        {`
          @page { size: A4; margin: 14mm; }
          @media print {
            body { background: white !important; color: black !important; }
            .catalogue-page { break-after: page; page-break-after: always; }
            .avoid-break { break-inside: avoid; page-break-inside: avoid; }
          }
        `}
      </style>

      <section className="catalogue-page flex min-h-screen flex-col justify-between px-10 py-12">
        <div>
          {content.settings.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={content.settings.logoUrl} alt="" className="mb-8 h-20 w-20 object-contain" />
          )}
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">{content.settings.tagline}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-7xl leading-none">{content.settings.companyName}</h1>
          <p className="mt-8 max-w-3xl text-xl leading-8 text-neutral-700">{content.settings.homeTagline}</p>
        </div>
        <div className="grid grid-cols-3 gap-6 border-t border-black pt-8 text-sm">
          <p><a href={`mailto:${content.settings.email}`}>{content.settings.email}</a></p>
          <p>{content.settings.phone}</p>
          <p>{content.settings.address}</p>
        </div>
      </section>

      <section className="catalogue-page px-10 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Studio Profile</p>
        <h2 className="mt-4 font-serif text-5xl leading-tight">{content.settings.aboutStudioTitle || "Company Overview"}</h2>
        <div className="mt-10 grid gap-8 text-lg leading-8 text-neutral-700">
          <p>{content.settings.aboutStudioProfile}</p>
          <p><strong>Mission:</strong> {content.settings.aboutMissionTitle || content.settings.aboutMission}<br />{content.settings.aboutMission}</p>
          <p><strong>Vision:</strong> {content.settings.aboutVisionTitle || content.settings.aboutVision}<br />{content.settings.aboutVision}</p>
          <p><strong>Message from Founder:</strong> {content.settings.founderMessage}</p>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-5 border-y border-black py-8 text-center">
          <div><p className="font-serif text-5xl">{content.settings.statYears}</p><p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500">Years Active</p></div>
          <div><p className="font-serif text-5xl">{content.settings.statProjects}</p><p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500">Projects</p></div>
          <div><p className="font-serif text-5xl">{content.settings.statCountries}</p><p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500">Countries</p></div>
        </div>
      </section>

      <section className="catalogue-page px-10 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Projects</p>
        <h2 className="mt-4 font-serif text-5xl leading-tight">Selected Portfolio</h2>
        <div className="mt-10 grid gap-8">
          {content.projects.map((project) => (
            <article key={project.id} className="avoid-break grid grid-cols-[220px_1fr] gap-6 border-t border-neutral-300 pt-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.image} alt={project.title} className="h-36 w-full object-cover" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">{project.section} / {project.subsection} / {project.year}</p>
                <h3 className="mt-2 font-serif text-3xl">{project.title}</h3>
                <p className="mt-1 text-sm uppercase tracking-[0.12em] text-neutral-500">{project.location}</p>
                <p className="mt-4 text-sm leading-6 text-neutral-700">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="catalogue-page px-10 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Services</p>
        <h2 className="mt-4 font-serif text-5xl leading-tight">Capabilities</h2>
        <div className="mt-10 grid grid-cols-2 gap-6">
          {content.services.map((service) => (
            <article key={service.id} className="avoid-break border border-neutral-300 p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={service.image} alt={service.title} className="h-36 w-full object-cover" />
              <h3 className="mt-5 font-serif text-2xl">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-700">{service.description}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-neutral-500">{adminServiceTags(service).join(" / ")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="catalogue-page px-10 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">People</p>
        <h2 className="mt-4 font-serif text-5xl leading-tight">Team</h2>
        <div className="mt-10 grid grid-cols-2 gap-6">
          {content.people.map((person) => (
            <article key={person.id} className="avoid-break grid grid-cols-[96px_1fr] gap-4 border-t border-neutral-300 pt-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={person.image} alt={person.name} className="h-24 w-24 object-cover grayscale" />
              <div>
                <h3 className="font-serif text-2xl">{person.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-500">{person.role}</p>
                <p className="mt-3 text-sm leading-6 text-neutral-700">{person.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-10 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">News and Contact</p>
        <h2 className="mt-4 font-serif text-5xl leading-tight">Recent Updates</h2>
        <div className="mt-10 grid gap-6">
          {news.map((item) => (
            <article key={item.slug} className="avoid-break border-t border-neutral-300 pt-5">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">{item.category} / {item.date}</p>
              <h3 className="mt-2 font-serif text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-700">{item.excerpt}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 border-t border-black pt-8">
          <h3 className="font-serif text-3xl">Offices</h3>
          <div className="mt-5 grid gap-3 text-sm">
            {offices.map((office) => <p key={office}>{office}</p>)}
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
            <p><a href={`mailto:${content.settings.email}`}>{content.settings.email}</a></p>
            <p>{content.settings.phone}</p>
            <p>{content.settings.facebook}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
