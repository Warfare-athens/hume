"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Clock, Wind, Sun, Calendar, Star } from "lucide-react";
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-caption text-muted-foreground">{title}</p>
          <div className="mt-2 h-px w-12 bg-foreground/15" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70">
          {notes.length} notes
        </span>
      </div>
      <div className="-mx-4 sm:mx-0">
        <div className="flex gap-3 overflow-x-auto px-0 sm:px-0 scrollbar-none snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:gap-1 lg:overflow-visible lg:snap-none">
          {notes.map((note) => {
            const key = note.trim().toLowerCase();
            const image = noteImageLookup.get(key);
            return (
              <div
                key={note}
                className="w-24 sm:w-36 lg:w-auto shrink-0 flex flex-col snap-start lg:snap-none lg:shrink"
              >
                <div
                  className="relative h-24 w-24 sm:h-36 sm:w-36 lg:h-28 lg:w-28 overflow-hidden"
                  style={{ borderRadius: 10 }}
                >
                  {image?.url ? (
                    <img
                      src={image.url}
                      alt={`${note} note`}
                      className="h-full w-full object-cover"
                      style={{ borderRadius: 10 }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground border border-border/50">
                      {note}
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4">
                    <p className="text-xs uppercase tracking-[0.32em] text-white/90">
                      {note}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
              <div className="flex flex-wrap gap-2 md:pt-10 mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-primary text-primary-foreground text-caption">
                  {perfume.gender}
                </span>
                <span className="inline-flex items-center px-3 py-1 border border-border text-caption text-muted-foreground">
                  {perfume.category}
                </span>
                {perfume.badges?.bestSeller && (
                  <span className="inline-flex items-center px-3 py-1 bg-foreground text-background text-caption">
                    Best Seller
                  </span>
                )}
                {perfume.badges?.limitedStock && (
                  <span className="inline-flex items-center px-3 py-1 bg-amber-200/90 text-amber-900 text-caption">
                    Limited Stock
                  </span>
                )}
              </div>

              <p className="text-caption text-muted-foreground mb-2">HUME - {perfume.size}</p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-3">
                {perfume.name}
              </h1>
              <p className="text-body text-muted-foreground mb-4">Inspired by {perfume.inspiration}</p>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= Math.round(averageRating)
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted"
                      }
                    />
                  ))}
                </div>
                <span className="text-caption text-muted-foreground">
                  {averageRating} ({perfume.reviews.length} reviews)
                </span>
              </div>

              <p className="font-serif text-2xl mb-8">{formatINR(perfume.price)}</p>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                  <div className="border border-border/70 bg-background/80 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-caption text-muted-foreground">Longevity</p>
                      <Clock size={16} className="text-muted-foreground" />
                    </div>
                    <p className="font-serif text-lg">{perfume.longevity.duration}</p>
                    <div className="mt-3 sm:mt-4 h-px w-full bg-foreground/10" />
                  </div>

                  <div className="border border-border/70 bg-background/80 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-caption text-muted-foreground">Projection</p>
                      <Wind size={16} className="text-muted-foreground" />
                    </div>
                    <p className="font-serif text-lg">{perfume.longevity.sillage}</p>
                    <div className="mt-3 sm:mt-4 h-px w-full bg-foreground/10" />
                  </div>

                  <div className="border border-border/70 bg-background/80 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-caption text-muted-foreground">Best Season</p>
                      <Sun size={16} className="text-muted-foreground" />
                    </div>
                    <p className="font-serif text-lg">{perfume.longevity.season.join(", ")}</p>
                    <div className="mt-3 sm:mt-4 h-px w-full bg-foreground/10" />
                  </div>

                  <div className="border border-border/70 bg-background/80 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-caption text-muted-foreground">Occasion</p>
                      <Calendar size={16} className="text-muted-foreground" />
                    </div>
                    <p className="font-serif text-lg">{perfume.longevity.occasion.join(", ")}</p>
                    <div className="mt-3 sm:mt-4 h-px w-full bg-foreground/10" />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="text-caption text-foreground mb-1">Authenticity</p>
                      <p className="text-body">Crafted to honor the original DNA with premium oils.</p>
                    </div>
                    <div>
                      <p className="text-caption text-foreground mb-1">Longevity</p>
                      <p className="text-body">Long-lasting performance designed for all‑day wear.</p>
                    </div>
                    <div>
                      <p className="text-caption text-foreground mb-1">Shipping Time</p>
                      <p className="text-body">Fast dispatch in 24–48 hours on ready stock.</p>
                    </div>
                    <div>
                      <p className="text-caption text-foreground mb-1">Returns</p>
                      <p className="text-body">Hassle‑free support if something isn’t right.</p>
                    </div>
                  </div>
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
