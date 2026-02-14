"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { formatINR } from "@/lib/currency";

interface PerfumeCardProps {
  id: string;
  name: string;
  inspiration: string;
  category: string;
  image: string;
  price: number;
  index: number;
}

const PerfumeCard = ({
  id,
  name,
  inspiration,
  category,
  image,
  price,
  index,
}: PerfumeCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, inspiration, category, image, price, size: "50ml" });
    toast({
      title: "Added to bag",
      description: `${name} has been added to your bag.`,
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link href={`/product/${id}`} className="block h-full">
        <div className="relative overflow-hidden bg-secondary mb-6">
          <Image
            src={image}
            alt={name}
            width={400}
            height={533}
            className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-all duration-500" />
        </div>
        <div className="flex flex-col h-[170px]">
          <p className="text-caption text-muted-foreground mb-2">{category}</p>
          <h3 className="font-serif text-xl md:text-2xl font-light tracking-wide mb-1">
            {name}
          </h3>
          <p className="text-body text-muted-foreground h-14 overflow-hidden">
            Inspired by {inspiration}
          </p>
          <div className="flex items-center justify-between gap-3 ">
            <p className="font-serif text-lg">{formatINR(price)}</p>
            <button
              onClick={handleAddToCart}
              className="text-[10px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-none border border-foreground/15 bg-gradient-to-r from-foreground to-zinc-700 text-background shadow-[0_4px_14px_rgba(0,0,0,0.18)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.24)] hover:-translate-y-0.5 transition-all duration-300"
              aria-label={`Add ${name} to bag`}
            >
              + Bag
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default PerfumeCard;
