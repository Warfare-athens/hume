"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { formatINR } from "@/lib/currency";

interface CelebrityFavoriteCardProps {
  id: string;
  name: string;
  inspiration: string;
  category: string;
  image: string;
  price: number;
  celebrityName?: string;
  celebrityImage?: string;
  index?: number;
}

function getStyleTags(category: string, inspiration: string) {
  const tags = [category.toUpperCase()];
  const spicyKeywords = ["spice", "pepper", "khamrah", "viking"];
  const source = `${category} ${inspiration}`.toLowerCase();
  if (spicyKeywords.some((token) => source.includes(token)) && !tags.includes("SPICY")) {
    tags.push("SPICY");
  }
  return tags;
}

export default function CelebrityFavoriteCard({
  id,
  name,
  inspiration,
  category,
  image,
  price,
  celebrityName,
  celebrityImage,
  index = 0,
}: CelebrityFavoriteCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const tags = getStyleTags(category, inspiration);
  const productFirst = index % 2 === 0;
  const productPath = `/product/${id}`;

  const handleAddToCart = () => {
    addItem({ id, name, inspiration, category, image, price, size: "50ml" });
    toast({
      title: "Added to bag",
      description: `${name} has been added to your bag.`,
    });
  };

  return (
    <article
      className="w-full max-w-[360px] mx-auto cursor-pointer"
      role="link"
      tabIndex={0}
      onClick={() => router.push(productPath)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(productPath);
        }
      }}
    >
      {celebrityName && <p className="mb-3 font-serif text-[1.2rem] leading-none">{celebrityName}</p>}

      <div className="mb-5 grid grid-cols-2 gap-4">
        <div className={`relative block aspect-[3/4] bg-[#efefef] ${productFirst ? "order-1" : "order-2"}`}>
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 44vw, 180px"
            className="object-cover"
          />
        </div>

        <div className={`relative aspect-[3/4] bg-[#efefef] ${productFirst ? "order-2" : "order-1"}`}>
          <Image
            src={celebrityImage || "https://placehold.co/600x600?text=Celeb"}
            alt={celebrityName || "Celebrity"}
            fill
            sizes="(max-width: 640px) 44vw, 180px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground/80">
          {tags.join(" • ")}
        </p>

        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="font-serif text-[2.05rem] leading-none font-light">{name}</p>
          <p className="text-[2rem] leading-none font-light">{formatINR(price)}</p>
        </div>

        <p className="mt-2 text-[0.96rem] italic leading-snug text-muted-foreground/90">
          Inspired by {inspiration}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart();
          }}
          className="mt-6 w-full border border-border bg-transparent py-5 text-[13px] tracking-[0.35em] uppercase transition-colors hover:bg-foreground hover:text-background"
        >
          Add To Bag
        </button>
      </div>
    </article>
  );
}

