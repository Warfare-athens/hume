"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa6";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import type { PerfumeData } from "@/data/perfumes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatINR } from "@/lib/currency";
import { withCloudinaryTransforms } from "@/lib/cloudinary";

type BottleData = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
};

export default function ProductDetailClient({ perfume }: { perfume: PerfumeData }) {
  const { addItem } = useCart();
  const [isBottleOpen, setIsBottleOpen] = useState(false);
  const [selectedBottleId, setSelectedBottleId] = useState<string | null>(null);
  const [bottles, setBottles] = useState<BottleData[]>([]);
  const [bottlesLoading, setBottlesLoading] = useState(true);
  const selectedBottle = useMemo(
    () => bottles.find((bottle) => bottle.id === selectedBottleId) ?? null,
    [bottles, selectedBottleId]
  );
  const totalPrice = perfume.price + (selectedBottle?.price ?? 0);

  useEffect(() => {
    let active = true;
    const loadBottles = async () => {
      try {
        const response = await fetch("/api/bottles");
        if (!response.ok) throw new Error("Failed to load bottles");
        const data = (await response.json()) as BottleData[];
        if (active) setBottles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load bottles:", error);
      } finally {
        if (active) setBottlesLoading(false);
      }
    };

    loadBottles();
    return () => {
      active = false;
    };
  }, []);

  const handleAddToCart = () => {
    const lineId = selectedBottle ? `${perfume.id}::bottle-${selectedBottle.id}` : perfume.id;
    const bottlePrice = selectedBottle?.price ?? 0;
    addItem({
      id: lineId,
      name: perfume.name,
      inspiration: perfume.inspiration,
      category: perfume.category,
      image: perfume.images[0],
      price: perfume.price + bottlePrice,
      size: perfume.size || "50ml",
      bottleName: selectedBottle?.name,
      bottlePrice: selectedBottle?.price,
    });
    toast({
      title: "Added to bag",
      description: selectedBottle
        ? `${perfume.name} added with ${selectedBottle.name}.`
        : `${perfume.name} has been added to your bag.`,
    });
  };

  const handleSelectBottle = (bottleId: string) => {
    setSelectedBottleId(bottleId);
    const bottle = bottles.find((item) => item.id === bottleId);
    if (bottle) {
      toast({
        title: "Bottle selected",
        description: `${bottle.name} will be used for this perfume.`,
      });
    }
    setIsBottleOpen(false);
  };

  return (
    <div className="mb-3 space-y-4 pb-10 md:mb-12 md:space-y-5 md:pb-0">
      <motion.button
        onClick={handleAddToCart}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-foreground text-background text-[11px] uppercase tracking-[0.28em] hover:opacity-90 transition-opacity"
      >
        Add to Bag
      </motion.button>

      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Personalize your bottle
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {bottles.slice(0, 3).map((bottle, index) => {
            const isActive = selectedBottleId === bottle.id;
            return (
              <button
                key={bottle.id}
                onClick={() => handleSelectBottle(bottle.id)}
                className={`relative aspect-[3/4] overflow-hidden bg-secondary/30 p-1 border transition-colors ${
                  index === 2 ? "hidden sm:block" : ""
                } ${
                  isActive ? "border-foreground" : "border-border/60 hover:border-foreground/35"
                } shadow-[0_8px_22px_rgba(39,112,255,0.18)]`}
                style={{ aspectRatio: "3 / 4" }}
                aria-label={`Select ${bottle.name} bottle`}
              >
                <div className="h-full w-full overflow-hidden border border-border/30 bg-background">
                  <Image
                    src={withCloudinaryTransforms(bottle.imageUrl, { width: 320 })}
                    alt={bottle.name}
                    width={320}
                    height={426}
                    sizes="(min-width: 640px) 160px, 30vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>
            );
          })}
          <motion.button
            type="button"
            onClick={() => setIsBottleOpen(true)}
            style={{ aspectRatio: "3 / 4" }}
            className="inline-flex aspect-[3/4] items-center justify-center border border-border/60 bg-transparent p-1 text-3xl leading-none text-white shadow-[0_8px_22px_rgba(39,112,255,0.28)] transition-colors hover:border-foreground/35 hover:opacity-95"
            aria-label="Choose from more bottles"
          >
            <motion.span
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #2bd177, #1ec4c9, #4f86ff, #7a5cff, #2bd177)",
                backgroundSize: "260% 260%",
              }}
              className="flex h-full w-full items-center justify-center border border-border/30"
            >
              <FaPlus className="h-5 w-5" />
            </motion.span>
          </motion.button>
        </div>
        <div className="border border-border/60 px-3 py-3 text-center text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          {selectedBottle ? `Selected: ${selectedBottle.name}` : "Default: Clear Glass Rose Gold"}
        </div>
      </div>

      <Dialog open={isBottleOpen} onOpenChange={setIsBottleOpen}>
      <DialogContent className="max-w-5xl border border-border/60 bg-[radial-gradient(circle_at_top,_#ffffff,_#f6f6f4_60%,_#f2f2f0_100%)] p-0 shadow-[0_30px_120px_rgba(15,15,20,0.25)] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="px-6 pt-6">
              <DialogTitle className="font-serif font-light text-3xl mt-3">
                Choose your beautiful bottle
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="px-4 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white/80 border border-border/60 shadow-[0_12px_32px_rgba(15,15,20,0.08)] px-4 py-3 mt-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                  Selected
                </p>
                <p className="font-serif text-lg">
                  {selectedBottle ? `#${selectedBottle.id}` : "None yet"}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedBottle ? formatINR(selectedBottle.price) : "Choose to see price"}
              </div>
            </div>

            {bottlesLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Loading bottles...
              </div>
            ) : bottles.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No bottles available yet. Please check back soon.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {bottles.map((bottle) => (
                  <motion.button
                    key={bottle.id}
                    onClick={() => handleSelectBottle(bottle.id)}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group text-left border border-border/70 bg-white transition-luxury overflow-hidden ${
                      selectedBottleId === bottle.id ? "ring-2 ring-foreground/80" : ""
                    }`}
                  >
                    <div className="relative">
                      <div className="relative">
                        <Image
                          src={withCloudinaryTransforms(bottle.imageUrl, { width: 320 })}
                          alt={bottle.name}
                          width={320}
                          height={426}
                          sizes="(min-width: 1024px) 240px, (min-width: 768px) 180px, 45vw"
                          className="aspect-[3/4] w-full object-cover bg-secondary"
                          style={{ aspectRatio: "3 / 4" }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-muted-foreground px-3 py-2 border-t border-border/70">
                        <span>#{bottle.id}</span>
                        <span className="text-[11px] font-medium">{formatINR(bottle.price)}</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Price</p>
            <p className="font-serif text-xl">{formatINR(totalPrice)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="inline-flex min-w-[9rem] items-center justify-center bg-foreground px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-background"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
