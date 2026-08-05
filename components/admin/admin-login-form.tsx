"use client";

import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { adminEmailStorageKey, adminRefreshTokenStorageKey, adminTokenStorageKey } from "@/lib/admin-auth";

type FirebaseLoginResponse = {
  idToken?: string;
  refreshToken?: string;
  error?: { message?: string };
};

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    let navigating = false;

    try {
      if (!firebaseApiKey) {
        window.localStorage.setItem(adminTokenStorageKey, "demo-admin-token");
        navigating = true;
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
      if (payload.refreshToken) {
        window.localStorage.setItem(adminRefreshTokenStorageKey, payload.refreshToken);
      }
      window.localStorage.setItem(adminEmailStorageKey, email.trim().toLowerCase());
      navigating = true;
      router.push("/admin");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      if (!navigating) {
        setBusy(false);
      }
    }
  }

  async function sendPasswordReset() {
    setError("");
    setResetStatus("");

    if (!firebaseApiKey) {
      setResetStatus("Password reset is available after Firebase keys are configured.");
      return;
    }

    if (!email.trim()) {
      setError("Enter the admin email first, then request a reset link.");
      return;
    }

    setResetBusy(true);

    try {
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${firebaseApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email
        })
      });
      const payload = (await response.json()) as FirebaseLoginResponse;

      if (!response.ok) {
        throw new Error(payload.error?.message ?? "Password reset failed.");
      }

      setResetStatus("Password reset email sent. Check the admin inbox.");
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Password reset failed.");
    } finally {
      setResetBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4 text-left">
      {busy && (
        <div className="fixed inset-0 z-[160] grid place-items-center bg-paper/70 backdrop-blur-[2px] dark:bg-[#3f3f3f]/70">
          <div className="flex flex-col items-center gap-5">
            <div className="route-square-loader" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink dark:text-paper">
              Loading
            </p>
          </div>
        </div>
      )}
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
        <span className="flex h-12 items-center border border-black/15 bg-paper dark:border-white/15 dark:bg-charcoal">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-full min-w-0 flex-1 bg-transparent px-4 text-base normal-case tracking-normal text-ink outline-none dark:text-paper"
            required={Boolean(firebaseApiKey)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="flex h-full w-12 items-center justify-center text-muted transition hover:text-ink dark:hover:text-paper"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {resetStatus && <p className="text-sm text-muted">{resetStatus}</p>}
      <button
        type="button"
        onClick={sendPasswordReset}
        disabled={resetBusy}
        className="justify-self-start text-xs uppercase tracking-[0.18em] text-muted underline underline-offset-4 transition hover:text-ink disabled:opacity-60 dark:hover:text-paper"
      >
        {resetBusy ? "Sending reset email" : "Forgot password?"}
      </button>
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
