"use client";

import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import type { PerfumeData } from "@/data/perfumes";

export default function ProductDetailClient({ perfume }: { perfume: PerfumeData }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: perfume.id,
      name: perfume.name,
      inspiration: perfume.inspiration,
      category: perfume.category,
      image: perfume.images[0],
      price: perfume.price,
      size: perfume.size || "50ml",
    });
    toast({
      title: "Added to bag",
      description: `${perfume.name} has been added to your bag.`,
    });
  };

  return (
    <motion.button
      onClick={handleAddToCart}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full py-4 bg-primary text-primary-foreground text-caption tracking-widest hover:bg-primary/90 transition-colors mb-12"
    >
      Add to Bag
    </motion.button>
  );
}
