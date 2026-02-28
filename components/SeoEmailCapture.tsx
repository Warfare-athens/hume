"use client";

import { useState } from "react";

export default function SeoEmailCapture({ festivalName }: { festivalName: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Festival Perfume Updates</p>
      <h3 className="mt-2 font-serif text-3xl">Get {festivalName} fragrance picks by email</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Receive seasonal recommendations, limited offer alerts, and practical scent guides for Indian weather.
      </p>
      {submitted ? (
        <p className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
          Thanks. You are on the list.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
            className="h-11 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40"
          />
          <button
            type="submit"
            className="h-11 rounded-md bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-90"
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
}
