"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sun, Star, Sparkles, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { celebrityFavorites } from "@/lib/celebrity-favorites";

type FilterType = "nature" | "gender" | "occasion" | "celebrity";

interface ShopItem {
  label: string;
  description: string;
  filterType: FilterType;
  image?: string;
  href?: string;
}

interface ShopSection {
  title: string;
  icon: React.ElementType;
  items: ShopItem[];
}

const shopSections: ShopSection[] = [
  {
    title: "Discover",
    icon: Sparkles,
    items: [
      {
        label: "Scent Quiz (60s)",
        description: "Find your fragrance in one minute",
        filterType: "occasion",
        href: "/scent-quiz",
      },
      {
        label: "Build Your Kit Pack of 4",
        description: "Create your own 4 x 20ml set",
        filterType: "occasion",
        href: "/kit-pack",
      },
    ],
  },
  {
    title: "By Occasion",
    icon: Sun,
    items: [
      { label: "Gym", description: "Fresh and energetic", filterType: "occasion" },
      { label: "Daily Wear", description: "Clean and versatile", filterType: "occasion" },
      { label: "Office", description: "Subtle and sophisticated", filterType: "occasion" },
      { label: "Date Night", description: "Seductive and alluring", filterType: "occasion" },
      { label: "Party", description: "Bold and unforgettable", filterType: "occasion" },
      { label: "Evening", description: "Rich and noticeable", filterType: "occasion" },
      { label: "Formal", description: "Elegant and refined", filterType: "occasion" },
      { label: "Special Events", description: "For standout moments", filterType: "occasion" },
    ],
  },
  {
    title: "Celebrities' Favorite",
    icon: Star,
    items: celebrityFavorites.slice(0, 4).map((celebrity) => ({
      label: celebrity.label,
      description: celebrity.description,
      filterType: "celebrity" as const,
      image: celebrity.image,
    })),
  },
];

interface ShopMegaMenuProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const ShopMegaMenu = ({ isOpen, onOpen, onClose }: ShopMegaMenuProps) => {
  const router = useRouter();
  const [celebImageByLabel, setCelebImageByLabel] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted || !Array.isArray(data)) return;
        const byId = new Map<string, { woreByImageUrl?: string }>(
          data.map((p: { id: string; woreByImageUrl?: string }) => [p.id, p])
        );
        const mapped = Object.fromEntries(
          celebrityFavorites.map((c) => [
            c.label,
            byId.get(c.perfumeIds[0])?.woreByImageUrl || c.image,
          ])
        );
        setCelebImageByLabel(mapped);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const renderedSections = useMemo(
    () =>
      shopSections.map((section) =>
        section.title === "Celebrities' Favorite"
          ? {
              ...section,
              items: section.items.map((item) => ({
                ...item,
                image: celebImageByLabel[item.label] || item.image,
              })),
            }
          : section
      ),
    [celebImageByLabel]
  );

  const handleItemClick = (item: ShopItem) => {
    onClose();
    if (item.href) {
      router.push(item.href);
      return;
    }
    if (item.filterType === "celebrity") {
      router.push(`/celebrities-favorites?celebrity=${encodeURIComponent(item.label)}`);
      return;
    }
    router.push(`/shop?filter=${item.filterType}&value=${encodeURIComponent(item.label)}`);
  };

  const handleViewAll = () => {
    onClose();
    router.push("/shop");
  };

  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        onClick={() => (isOpen ? onClose() : onOpen())}
        className="flex items-center gap-1 text-caption link-underline text-muted-foreground hover:text-foreground transition-luxury cursor-pointer"
      >
        Shop
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed left-0 right-0 top-[72px] z-50 bg-background border-t border-b border-border shadow-lg"
          >
            <div className="container-luxury py-10">
              <div className="grid grid-cols-3 gap-10">
                {renderedSections.map((section) => (
                  <div key={section.title}>
                    <div className="flex items-center gap-2 mb-5">
                      <section.icon size={16} className="text-muted-foreground" />
                      {section.title === "Celebrities' Favorite" ? (
                        <button
                          onClick={() => {
                            onClose();
                            router.push("/celebrities-favorites");
                          }}
                          className="text-caption text-foreground hover:text-muted-foreground transition-luxury flex items-center gap-1.5 cursor-pointer group"
                        >
                          {section.title}
                          <ExternalLink size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                      ) : (
                        <h3 className="text-caption text-foreground">{section.title}</h3>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {section.items.map((item) => (
                        <li key={item.label}>
                          {item.href ? (
                            <motion.button
                              onClick={() => handleItemClick(item)}
                              initial={{ opacity: 0.95, y: 0 }}
                              animate={{ opacity: [0.95, 1, 0.95], y: [0, -1.5, 0] }}
                              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                              className="group block text-left w-full border border-foreground/20 bg-gradient-to-r from-foreground to-zinc-700 text-background px-3 py-2.5 cursor-pointer hover:scale-[1.01] transition-transform duration-200"
                            >
                              <span className="block text-sm font-medium group-hover:opacity-95 transition-luxury">
                                {item.label}
                              </span>
                              <span className="block text-xs opacity-90 mt-0.5">
                                {item.description}
                              </span>
                            </motion.button>
                          ) : (
                          <button
                            onClick={() => handleItemClick(item)}
                            className="group block text-left w-full cursor-pointer"
                          >
                            <span className="flex items-center gap-3">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.label}
                                  className="w-12 h-12 rounded-sm object-cover border border-border"
                                />
                              ) : null}
                              <span>
                                <span className="block text-sm font-light text-foreground group-hover:text-muted-foreground transition-luxury">
                                  {item.label}
                                </span>
                                <span className="block text-xs text-muted-foreground/70 font-light mt-0.5">
                                  {item.description}
                                </span>
                              </span>
                            </span>
                          </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-light tracking-wide">
                  All fragrances are crafted with premium ingredients
                </p>
                <div className="flex items-center gap-6">
                  <button
                    onClick={handleViewAll}
                    className="text-caption link-underline text-foreground hover:text-muted-foreground transition-luxury cursor-pointer"
                  >
                    View All Perfumes -&gt;
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { shopSections };
export type { FilterType };
export default ShopMegaMenu;
