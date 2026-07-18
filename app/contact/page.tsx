import { Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/reveal";

export default function ContactPage() {
  return (
    <main className="bg-paper px-5 pb-24 pt-32 transition-colors dark:bg-charcoal md:px-8 md:pb-32 md:pt-40">
      <section className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Contact</p>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-balance md:text-6xl">
            Begin a conversation about place, program, and possibility.
          </h1>
          <div className="mt-12 grid gap-5 text-sm">
            <p className="flex items-center gap-3">
              <Mail size={18} /> studio@ateliernorthline.test
            </p>
            <p className="flex items-center gap-3">
              <Phone size={18} /> +880 1700 000 000
            </p>
            <p className="flex items-center gap-3">
              <MapPin size={18} /> House 18, Road 7, Gulshan, Dhaka
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                Name
                <input className="h-14 border border-black/15 bg-transparent px-4 text-base normal-case tracking-normal text-ink outline-none transition focus:border-ink dark:border-white/15 dark:text-paper dark:focus:border-paper" />
              </label>
              <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                Email
                <input type="email" className="h-14 border border-black/15 bg-transparent px-4 text-base normal-case tracking-normal text-ink outline-none transition focus:border-ink dark:border-white/15 dark:text-paper dark:focus:border-paper" />
              </label>
            </div>
            <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-muted">
              Project Type
              <select className="h-14 border border-black/15 bg-paper px-4 text-base normal-case tracking-normal text-ink outline-none transition focus:border-ink dark:border-white/15 dark:bg-charcoal dark:text-paper dark:focus:border-paper">
                <option>Architecture</option>
                <option>Interior</option>
                <option>Exterior</option>
                <option>Landscape</option>
              </select>
            </label>
            <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-muted">
              Message
              <textarea className="min-h-44 resize-y border border-black/15 bg-transparent p-4 text-base normal-case tracking-normal text-ink outline-none transition focus:border-ink dark:border-white/15 dark:text-paper dark:focus:border-paper" />
            </label>
            <button
              type="button"
              className="h-14 bg-ink px-6 text-xs uppercase tracking-[0.22em] text-paper transition hover:bg-black/75 dark:bg-paper dark:text-ink dark:hover:bg-white/75"
            >
              Send inquiry
            </button>
          </form>
        </Reveal>
      </section>

      <section className="mx-auto mt-20 max-w-7xl">
        <Reveal>
          <div className="flex min-h-80 items-center justify-center border border-black/10 bg-white text-center dark:border-white/10 dark:bg-[#0d0d0d]">
            <div>
              <MapPin className="mx-auto mb-5" size={28} />
              <p className="text-xs uppercase tracking-[0.28em] text-muted">Map Placeholder</p>
              <p className="mt-3 font-serif text-3xl">Gulshan, Dhaka</p>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
