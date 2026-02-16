"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STORAGE_KEY = "hume_early_bird_dismissed";

const EarlyBirdPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed =
      typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => {
      setOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
    setTimeout(() => setOpen(false), 1200);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => (value ? setOpen(true) : handleClose())}>
      <DialogContent className="max-w-md border border-border/60 bg-background/95 p-6 shadow-[0_30px_80px_rgba(15,15,20,0.25)]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-light">
            Early Bird Offer
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Get 10% off your first order — enter your email.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="mt-4 text-sm text-foreground">
            Thanks! Your welcome offer is on the way.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-border/70 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/60"
              required
            />
            <button
              type="submit"
              className="w-full bg-foreground text-background py-2 text-xs uppercase tracking-[0.28em]"
            >
              Claim 10% Off
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="w-full text-xs uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground"
            >
              No thanks
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EarlyBirdPopup;
