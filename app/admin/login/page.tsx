import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-24 transition-colors dark:bg-charcoal">
      <section className="w-full max-w-md border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-[#4a4a4a]">
        <p className="text-xs uppercase tracking-[0.28em] text-muted">Admin Login</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight">Modern Age Studio</h1>
        <p className="mt-5 text-sm leading-7 text-muted">
          Login with your authorized Firebase admin account.
        </p>
        <AdminLoginForm />
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.18em] text-muted underline underline-offset-4"
        >
          <ArrowLeft size={14} /> Back to main website
        </Link>
      </section>
    </main>
  );
}
