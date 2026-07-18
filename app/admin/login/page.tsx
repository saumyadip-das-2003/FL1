import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-24 transition-colors dark:bg-charcoal">
      <section className="w-full max-w-md border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-[#4a4a4a]">
        <p className="text-xs uppercase tracking-[0.28em] text-muted">Admin Login</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight">Modern Age Studio</h1>
        <p className="mt-5 text-sm leading-7 text-muted">
          Demo mode is open without a password. Firebase authentication can be connected later for the production admin.
        </p>
        <Link
          href="/admin"
          className="mt-8 inline-flex w-full items-center justify-center gap-3 bg-ink px-6 py-4 text-xs uppercase tracking-[0.22em] text-paper dark:bg-paper dark:text-ink"
        >
          Enter admin panel <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
