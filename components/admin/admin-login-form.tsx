"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { adminTokenStorageKey } from "@/lib/admin-auth";

type FirebaseLoginResponse = {
  idToken?: string;
  error?: { message?: string };
};

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (!firebaseApiKey) {
        window.localStorage.setItem(adminTokenStorageKey, "demo-admin-token");
        router.push("/admin");
        return;
      }

      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        })
      });
      const payload = (await response.json()) as FirebaseLoginResponse;

      if (!response.ok || !payload.idToken) {
        throw new Error(payload.error?.message ?? "Login failed.");
      }

      window.localStorage.setItem(adminTokenStorageKey, payload.idToken);
      router.push("/admin");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4 text-left">
      <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-muted">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 border border-black/15 bg-paper px-4 text-base normal-case tracking-normal text-ink outline-none dark:border-white/15 dark:bg-charcoal dark:text-paper"
          required={Boolean(firebaseApiKey)}
        />
      </label>
      <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-muted">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 border border-black/15 bg-paper px-4 text-base normal-case tracking-normal text-ink outline-none dark:border-white/15 dark:bg-charcoal dark:text-paper"
          required={Boolean(firebaseApiKey)}
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-3 bg-ink px-6 py-4 text-xs uppercase tracking-[0.22em] text-paper disabled:opacity-60 dark:bg-paper dark:text-ink"
      >
        {firebaseApiKey ? "Login" : "Enter demo admin"} <ArrowRight size={16} />
      </button>
    </form>
  );
}
