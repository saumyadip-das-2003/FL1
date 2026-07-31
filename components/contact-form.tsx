"use client";

import { CheckCircle2, X } from "lucide-react";
import { FormEvent, useState } from "react";

export function ContactForm() {
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mrenwzqw", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Unable to send message.");
      }

      form.reset();
      setSuccessOpen(true);
    } catch {
      setError("Message could not be sent. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-muted">
            Name
            <input
              name="name"
              required
              className="h-14 border border-black/15 bg-transparent px-4 text-base normal-case tracking-normal text-ink outline-none transition focus:border-ink dark:border-white/15 dark:text-paper dark:focus:border-paper"
            />
          </label>
          <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-muted">
            Email
            <input
              type="email"
              name="email"
              required
              className="h-14 border border-black/15 bg-transparent px-4 text-base normal-case tracking-normal text-ink outline-none transition focus:border-ink dark:border-white/15 dark:text-paper dark:focus:border-paper"
            />
          </label>
        </div>
        <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-muted">
          Project Type
          <select
            name="project_type"
            className="h-14 border border-black/15 bg-paper px-4 text-base normal-case tracking-normal text-ink outline-none transition focus:border-ink dark:border-white/15 dark:bg-charcoal dark:text-paper dark:focus:border-paper"
          >
            <option>Architecture</option>
            <option>Interior</option>
            <option>Exterior</option>
            <option>Landscape</option>
          </select>
        </label>
        <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-muted">
          Message
          <textarea
            name="message"
            required
            className="min-h-44 resize-y border border-black/15 bg-transparent p-4 text-base normal-case tracking-normal text-ink outline-none transition focus:border-ink dark:border-white/15 dark:text-paper dark:focus:border-paper"
          />
        </label>
        <input type="hidden" name="_subject" value="New Modern Age Studio website inquiry" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="h-14 bg-ink px-6 text-xs uppercase tracking-[0.22em] text-paper transition hover:bg-black/75 disabled:opacity-60 dark:bg-paper dark:text-ink dark:hover:bg-white/75"
        >
          {busy ? "Sending..." : "Send inquiry"}
        </button>
      </form>

      {successOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/35 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md border border-black/10 bg-white p-7 text-center shadow-soft dark:border-white/10 dark:bg-[#4a4a4a]">
            <button
              type="button"
              onClick={() => setSuccessOpen(false)}
              className="ml-auto flex h-9 w-9 items-center justify-center border border-black/10 dark:border-white/10"
              aria-label="Close success message"
            >
              <X size={16} />
            </button>
            <CheckCircle2 className="mx-auto mt-2 text-green-600" size={42} />
            <h2 className="mt-5 font-serif text-3xl">Message sent</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Thank you. The studio has received your inquiry and will respond soon.
            </p>
            <button
              type="button"
              onClick={() => setSuccessOpen(false)}
              className="mt-7 h-12 w-full bg-ink text-xs uppercase tracking-[0.18em] text-paper dark:bg-paper dark:text-ink"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}
