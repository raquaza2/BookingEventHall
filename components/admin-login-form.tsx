"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@grandaurora.com");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to sign in.");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel w-full max-w-md p-8">
      <p className="eyebrow">Admin Access</p>
      <h1 className="mt-3 text-3xl font-semibold text-ink">Review venue requests</h1>
      <p className="mt-3 text-sm leading-6 text-ink/68">
        Sign in to review incoming bookings, filter by status, and approve or reject requests.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
          />
        </label>
      </div>

      {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Signing in..." : "Sign in"}
      </button>

      <p className="mt-4 text-xs text-ink/55">Seeded demo credentials are prefilled for local development.</p>
    </form>
  );
}

