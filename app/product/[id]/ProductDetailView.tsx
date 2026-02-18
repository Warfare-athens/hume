"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Wind,
  Sun,
  Calendar,
  Star,
  ShieldCheck,
  RotateCcw,
  FlaskConical,
  Truck,
  WalletCards,
  MessageCircle,
} from "lucide-react";
import { getAverageRating } from "@/data/perfumes";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductReviews from "@/components/ProductReviews";
import ProductDetailClient from "./ProductDetailClient";
import type { PerfumeData } from "@/data/perfumes";
import { formatINR } from "@/lib/currency";

export default function ProductDetailView({ perfume }: { perfume: PerfumeData }) {
  const averageRating = getAverageRating(perfume.reviews);
  const [noteImages, setNoteImages] = useState<{
    id: string;
    label: string;
    url: string;
    usage: string;
    tags: string[];
  }[]>([]);

  useEffect(() => {
    let active = true;
    const loadImages = async () => {
      try {
        const response = await fetch("/api/images");
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = (await response.json()) as typeof noteImages;
        if (active) {
          setNoteImages(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to load note images:", error);
      }
    };

    loadImages();
    return () => {
      active = false;
    };
  }, []);

  const noteImageLookup = useMemo(() => {
    const map = new Map<string, { url: string; label: string }>();
    noteImages
      .filter((image) => image.usage === "notes")
      .forEach((image) => {
        const labelKey = image.label.trim().toLowerCase();
        if (labelKey && !map.has(labelKey)) {
          map.set(labelKey, { url: image.url, label: image.label });
        }
        image.tags?.forEach((tag) => {
          const tagKey = tag.trim().toLowerCase();
          if (tagKey && !map.has(tagKey)) {
            map.set(tagKey, { url: image.url, label: image.label });
          }
        });
      });
    return map;
  }, [noteImages]);
  const story =
    perfume.scentStory ??
    `A modern interpretation of ${perfume.inspirationBrand} ${perfume.inspiration}, opening with ${perfume.notes.top[0]} and settling into ${perfume.notes.base[0]}. Crafted to feel polished, memorable, and effortlessly wearable.`;
  const tips =
    perfume.pairingTips ??
    [
      `Best worn during ${perfume.longevity.season.join(", ")} for the most balanced projection.`,
      perfume.longevity.occasion[0]
        ? `Perfect for ${perfume.longevity.occasion[0]} moments when you want to leave a refined trail.`
        : "Perfect for moments when you want to leave a refined trail.",
      `Pairs beautifully with crisp shirts, tailored layers, or minimal evening looks.`,
    ];

  const renderNoteGroup = (title: string, notes: string[]) => (
    <div className="px-1 sm:px-0">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-caption text-muted-foreground">{title}</p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70">
          {notes.length} notes
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 sm:gap-5">
          {notes.map((note) => {
            const key = note.trim().toLowerCase();
            const image = noteImageLookup.get(key);
            return (
              <div key={note} className="flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-secondary/40">
                  {image?.url ? (
                    <img
                      src={image.url}
                      alt={`${note} note`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground border border-border/50">
                      {note}
                    </div>
                  )}
                </div>
                <p className="mt-3 text-center font-semibold text-[8px] uppercase tracking-[0.18em] text-foreground/80">
                  {note}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );

  return (
    <>
      <section className="pt-20 pb-16 md:pt-20 md:pb-24">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <ProductImageGallery images={perfume.images} videos={perfume.videos} name={perfume.name} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col"
            >
              <div className="flex flex-wrap justify-center gap-2 md:pt-10 mb-4">
                <span className="inline-flex items-center border border-foreground/35 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground">
                  {perfume.gender}
                </span>
                <span className="inline-flex items-center border border-border px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {perfume.category}
                </span>
                {perfume.badges?.bestSeller && (
                  <span className="inline-flex items-center border border-border px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Best Seller
                  </span>
                )}
                {perfume.badges?.limitedStock && (
                  <span className="inline-flex items-center border border-amber-500/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-amber-800">
                    Limited Stock
                  </span>
                )}
              </div>

              <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground mb-2">
                HUME — {perfume.size.toUpperCase()}
              </p>
              <h1 className="font-serif text-[2.75rem] md:text-5xl lg:text-6xl font-light italic tracking-tight mb-2">
                {perfume.name}
              </h1>
              <p className="text-[clamp(0.9rem,1vw,1rem)] italic text-muted-foreground mb-4">
                Inspired by {perfume.inspirationBrand} {perfume.inspiration}
              </p>

              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={13}
                      className={
                        star <= Math.round(averageRating)
                          ? "fill-foreground text-foreground"
                          : "fill-muted text-muted/70"
                      }
                    />
                  ))}
                </div>
                <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {averageRating} ({perfume.reviews.length} reviews)
                </span>
              </div>

              <p className="text-[2.05rem] leading-none text-center font-light mb-8">{formatINR(perfume.price)}</p>
              </div>

              <p className="text-body text-muted-foreground leading-relaxed mb-10">{perfume.description}</p>

              <ProductDetailClient perfume={perfume} />

              <div className="border-t border-border pt-8 mb-10">
                <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
                  <div>
                    <p className="text-caption text-muted-foreground">Fragrance Notes</p>
                    <h2 className="font-serif text-2xl font-light tracking-wide">A layered composition</h2>
                  </div>
                  <div className="hidden sm:block h-px w-20 bg-foreground/20" />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {renderNoteGroup("Top Notes", perfume.notes.top)}
                  {renderNoteGroup("Heart Notes", perfume.notes.heart)}
                  {renderNoteGroup("Base Notes", perfume.notes.base)}
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <div className="flex flex-wrap items-end justify-between gap-3 mb-4 sm:mb-6">
                  <div>
                    <p className="text-caption text-muted-foreground">Performance & Character</p>
                    <h2 className="font-serif text-2xl font-light tracking-wide">A quiet, composed trail</h2>
                  </div>
                  <div className="hidden sm:block h-px w-20 bg-foreground/20" />
                </div>

                <div className="grid grid-cols-2 gap-0 border border-border/60 bg-background/80">
                  <div className="min-h-[86px] sm:min-h-[120px] border-r border-b border-border/60 p-3 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-[10px] sm:text-caption uppercase tracking-[0.2em] text-muted-foreground">Longevity</p>
                      <Clock size={12} className="text-muted-foreground/80 sm:h-[14px] sm:w-[14px]" />
                    </div>
                    <p className="font-serif text-[1.05rem] sm:text-[2.05rem] leading-snug sm:leading-tight">
                      {perfume.longevity.duration}
                    </p>
                  </div>

                  <div className="min-h-[86px] sm:min-h-[120px] border-b border-border/60 p-3 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-[10px] sm:text-caption uppercase tracking-[0.2em] text-muted-foreground">Projection</p>
                      <Wind size={12} className="text-muted-foreground/80 sm:h-[14px] sm:w-[14px]" />
                    </div>
                    <p className="font-serif text-[1.05rem] sm:text-[2.05rem] leading-snug sm:leading-tight">
                      {perfume.longevity.sillage}
                    </p>
                  </div>

                  <div className="min-h-[86px] sm:min-h-[120px] border-r border-border/60 p-3 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-[10px] sm:text-caption uppercase tracking-[0.2em] text-muted-foreground">Best Season</p>
                      <Sun size={12} className="text-muted-foreground/80 sm:h-[14px] sm:w-[14px]" />
                    </div>
                    <p className="font-serif text-[1.05rem] sm:text-[2.05rem] leading-snug sm:leading-tight">
                      {perfume.longevity.season.join(", ")}
                    </p>
                  </div>

                  <div className="min-h-[86px] sm:min-h-[120px] p-3 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-[10px] sm:text-caption uppercase tracking-[0.2em] text-muted-foreground">Occasion</p>
                      <Calendar size={12} className="text-muted-foreground/80 sm:h-[14px] sm:w-[14px]" />
                    </div>
                    <p className="font-serif text-[1.05rem] sm:text-[2.05rem] leading-snug sm:leading-tight">
                      {perfume.longevity.occasion.join(" / ")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-8 mt-10">
                <div className="border border-border/70 bg-background/80 p-4 sm:p-5 mb-6">
                  <p className="text-caption text-muted-foreground mb-2">Scent Story</p>
                  <p className="text-body text-muted-foreground">{story}</p>
                </div>

                <div className="border border-border/70 bg-background/80 p-4 sm:p-5">
                  <p className="text-caption text-muted-foreground mb-3">Pairing & Occasion Tips</p>
                  <div className="space-y-2">
                    {tips.map((tip) => (
                      <p key={tip} className="text-body text-muted-foreground">
                        {tip}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="border border-border/70 bg-secondary/20 p-4 sm:p-5 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-caption text-muted-foreground">Why HUME?</p>
                    <div className="h-px w-10 bg-foreground/15" />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {["Razorpay", "UPI", "Cards"].map((method) => (
                      <span
                        key={method}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
                      >
                        <WalletCards size={12} />
                        {method}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck size={16} className="mt-0.5 text-foreground/75" />
                      <p className="text-body">100% authentic ingredients.</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <FlaskConical size={16} className="mt-0.5 text-foreground/75" />
                      <p className="text-body">Formulated following IFRA rules.</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <RotateCcw size={16} className="mt-0.5 text-foreground/75" />
                      <p className="text-body">
                        Easy 7-day returns. If not liked, perfume replacement is available with no questions asked.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Truck size={16} className="mt-0.5 text-foreground/75" />
                      <p className="text-body">Dispatched within 24 hours on ready stock.</p>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/919559024822"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm text-foreground hover:opacity-80 transition-opacity"
                  >
                    <MessageCircle size={15} />
                    <span>Queries on WhatsApp: +91 95590 24822</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ProductReviews reviews={perfume.reviews} productName={perfume.name} />
    </>
  );
}
