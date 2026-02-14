"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const perks = [
  "4 fragrances x 20ml travel bottles",
  "Mix and match from bestsellers",
  "Perfect for gifting and discovery",
  "Limited-time value bundle",
];

export default function KitPackShowcase() {
  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-24">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-caption text-muted-foreground mb-3">Special Offer</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">
            Build Your Kit
          </h1>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Create your own pack of 4 perfumes in 20ml size. Great for daily rotation,
            travel, and gifting.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative overflow-hidden border border-border p-8 md:p-12 bg-gradient-to-br from-zinc-900 text-white to-zinc-700"
        >
          <motion.div
            className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10"
            animate={{ y: [0, 10, 0], x: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10"
            animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] mb-3 opacity-80">
                Limited-Time Kit
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">
                4 x 20ml Perfume Pack
              </h2>
              <p className="opacity-90 mb-6">
                Pick four inspired scents and build a premium mini collection.
              </p>
              <Link
                href="/admin"
                className="inline-block px-6 py-3 bg-white text-zinc-900 text-caption"
              >
                Configure Offer in Admin
              </Link>
            </div>

            <div className="space-y-3">
              {perks.map((perk, idx) => (
                <motion.div
                  key={perk}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 + idx * 0.08 }}
                  className="border border-white/25 bg-white/5 px-4 py-3 text-sm"
                >
                  {perk}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

