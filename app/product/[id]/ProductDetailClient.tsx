"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import type { PerfumeData } from "@/data/perfumes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatINR } from "@/lib/currency";

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
    <div className="mb-12 space-y-4">
      <motion.button
        onClick={handleAddToCart}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-primary text-primary-foreground text-caption tracking-widest hover:bg-primary/90 transition-colors"
      >
        Add to Bag
      </motion.button>

      <motion.button
        onClick={() => setIsBottleOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(120deg, #ff4d4f, #ffb347, #7f5cff, #2ad4ff, #ff4d4f)",
          backgroundSize: "200% 200%",
        }}
        className="w-full py-4 text-caption tracking-[0.2em] text-white uppercase relative overflow-hidden shadow-[0_0_30px_rgba(255,120,200,0.35)]"
      >
        Choose Your Beautiful Bottle
      </motion.button>

      <div className="flex items-center gap-3 border border-border/60 bg-secondary/20 p-3">
        {selectedBottle ? (
          <>
            <img
              src={selectedBottle.imageUrl}
              alt={selectedBottle.name}
              className="w-16 h-20 object-cover bg-secondary"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Selected Bottle</p>
              <p className="font-serif text-base">{selectedBottle.name}</p>
            </div>
          </>
        ) : (
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            No bottle selected yet
          </p>
        )}
      </div>

      <Dialog open={isBottleOpen} onOpenChange={setIsBottleOpen}>
        <DialogContent className="max-w-5xl border-0 bg-[radial-gradient(circle_at_top,_#fff3e6,_#f7f1ff_45%,_#f8fbff_100%)] p-0 shadow-[0_30px_120px_rgba(20,20,40,0.35)] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="px-6 pt-6">
              <DialogTitle className="font-serif font-light text-3xl mt-3">
                Choose your beautiful bottle
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="px-4 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white/70 border border-white/60 shadow-[0_12px_40px_rgba(35,35,60,0.15)] px-4 py-3 mt-6">
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
                    className={`group text-left border border-white/60 bg-white/70 shadow-[0_20px_60px_rgba(25,25,50,0.15)] p-4 transition-luxury relative overflow-hidden ${
                      selectedBottleId === bottle.id ? "ring-2 ring-black/80" : ""
                    }`}
                  >
                    <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-amber-200/40 via-rose-200/40 to-indigo-200/40 blur-2xl opacity-80" />
                    <div className="relative">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-3">
                        <span>#{bottle.id}</span>
                        <span className="text-[11px] font-medium">{formatINR(bottle.price)}</span>
                      </div>
                      <div className="relative">
                        <img
                          src={bottle.imageUrl}
                          alt={bottle.name}
                          className="aspect-square w-full object-cover bg-secondary shadow-lg"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-16 shadow-2xl" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
