"use client";

import { motion } from "framer-motion";
import { Clock, Wind, Sun, Calendar, Star } from "lucide-react";
import { getAverageRating } from "@/data/perfumes";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductReviews from "@/components/ProductReviews";
import ProductDetailClient from "./ProductDetailClient";
import type { PerfumeData } from "@/data/perfumes";
import { formatINR } from "@/lib/currency";

export default function ProductDetailView({ perfume }: { perfume: PerfumeData }) {
  const averageRating = getAverageRating(perfume.reviews);

  return (
    <>
      <section className="pt-10 pb-16 md:pt-30 md:pb-24">
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
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-primary text-primary-foreground text-caption">
                  {perfume.gender}
                </span>
                <span className="inline-flex items-center px-3 py-1 border border-border text-caption text-muted-foreground">
                  {perfume.category}
                </span>
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
                <h2 className="font-serif text-xl mb-6">Fragrance Notes</h2>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-caption text-muted-foreground mb-3">Top Notes</p>
                    <ul className="space-y-1">
                      {perfume.notes.top.map((note) => (
                        <li key={note} className="text-body">{note}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-3">Heart Notes</p>
                    <ul className="space-y-1">
                      {perfume.notes.heart.map((note) => (
                        <li key={note} className="text-body">{note}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-3">Base Notes</p>
                    <ul className="space-y-1">
                      {perfume.notes.base.map((note) => (
                        <li key={note} className="text-body">{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <h2 className="font-serif text-xl mb-6">Performance & Character</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-caption text-muted-foreground mb-1">Longevity</p>
                      <p className="text-body">{perfume.longevity.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wind size={18} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-caption text-muted-foreground mb-1">Sillage</p>
                      <p className="text-body">{perfume.longevity.sillage}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sun size={18} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-caption text-muted-foreground mb-1">Best Season</p>
                      <p className="text-body">{perfume.longevity.season.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-caption text-muted-foreground mb-1">Occasion</p>
                      <p className="text-body">{perfume.longevity.occasion.join(", ")}</p>
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
