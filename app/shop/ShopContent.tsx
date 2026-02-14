"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import PerfumeCard from "@/components/PerfumeCard";
import type { PerfumeData } from "@/data/perfumes";
import { celebrityFavorites } from "@/lib/celebrity-favorites";

type FilterType = "nature" | "gender" | "occasion" | "celebrity";

interface FilterConfig {
  type: FilterType;
  label: string;
  options: string[];
}

const filterConfigs: FilterConfig[] = [
  {
    type: "nature",
    label: "By Nature",
    options: ["Woody", "Ambery & Creamy", "Fresh Blue", "Aquatic & Marine", "Sweet", "Smoky", "Floral", "Fruity", "Spicy"],
  },
  {
    type: "gender",
    label: "By Gender",
    options: ["Men", "Women", "Unisex"],
  },
  {
    type: "occasion",
    label: "By Occasion",
    options: ["Gym", "Daily Wear", "Office", "Date Night", "Party", "Evening", "Formal", "Special Events"],
  },
];

const natureKeywords: Record<string, string[]> = {
  "Woody": ["cedar", "sandalwood", "vetiver", "wood", "birch", "patchouli", "oak"],
  "Ambery & Creamy": ["amber", "ambroxan", "tonka", "vanilla", "labdanum", "musk"],
  "Fresh Blue": ["bergamot", "lemon", "grapefruit", "mint", "aldehydes", "fresh"],
  "Aquatic & Marine": ["sea", "aquatic", "marine", "ocean", "water"],
  "Sweet": ["sweet", "vanilla", "toffee", "caramel", "praline", "sugar", "tonka"],
  "Smoky": ["oud", "incense", "smoke", "leather", "tobacco"],
  "Floral": ["rose", "jasmine", "lavender", "geranium", "iris", "violet", "neroli", "orange blossom", "floral"],
  "Fruity": ["apple", "pineapple", "pear", "mandarin", "black currant", "dried fruits", "fruit"],
  "Spicy": ["pepper", "cardamom", "ginger", "nutmeg", "sichuan", "cinnamon", "spicy"],
};

const celebrityMap: Record<string, string[]> = Object.fromEntries(
  celebrityFavorites.map((c) => [c.label, c.perfumeIds])
);

function filterPerfumes(
  allPerfumes: PerfumeData[],
  filterType: FilterType | null,
  filterValue: string | null
): PerfumeData[] {
  if (!filterType || !filterValue) return allPerfumes;

  switch (filterType) {
    case "nature": {
      const keywords = natureKeywords[filterValue] || [];
      if (keywords.length === 0) return allPerfumes;
      return allPerfumes.filter((p) => {
        const allNotes = [...p.notes.top, ...p.notes.heart, ...p.notes.base]
          .map((n) => n.toLowerCase());
        const desc = p.description.toLowerCase();
        const cat = p.category.toLowerCase();
        return keywords.some(
          (kw) =>
            allNotes.some((n) => n.includes(kw)) ||
            desc.includes(kw) ||
            cat.includes(kw)
        );
      });
    }
    case "gender":
      return allPerfumes.filter(
        (p) => p.gender.toLowerCase() === filterValue.toLowerCase()
      );
    case "occasion":
      return allPerfumes.filter((p) =>
        p.longevity.occasion.some(
          (o) => o.toLowerCase().includes(filterValue.toLowerCase())
        ) ||
        p.longevity.season.some(
          (s) => s.toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    case "celebrity": {
      const ids = celebrityMap[filterValue] || [];
      return allPerfumes.filter((p) => ids.includes(p.id));
    }
    default:
      return allPerfumes;
  }
}

export default function ShopContent({ perfumes }: { perfumes: PerfumeData[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFilterType = (searchParams.get("filter") as FilterType) || null;
  const activeFilterValue = searchParams.get("value") || null;

  const filteredPerfumes = useMemo(
    () => filterPerfumes(perfumes, activeFilterType, activeFilterValue),
    [perfumes, activeFilterType, activeFilterValue]
  );

  const setFilter = (type: FilterType, value: string) => {
    router.replace(`/shop?filter=${type}&value=${encodeURIComponent(value)}`);
    setMobileFiltersOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilter = () => {
    router.replace("/shop");
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <main className="pt-24 pb-20">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-caption text-muted-foreground mb-4">The Collection</p>
          <h1 className="text-headline mb-4">
            Shop All <span className="italic">Fragrances</span>
          </h1>
          <div className="divider-elegant mx-auto mb-6" />
          <p className="text-body text-muted-foreground max-w-xl mx-auto">
            Discover our curated collection of premium fragrances, inspired by the world&apos;s most iconic scents.
          </p>
        </motion.div>

        <AnimatePresence>
          {activeFilterValue && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <span className="text-caption text-muted-foreground">Filtered by:</span>
              <button
                onClick={clearFilter}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-caption"
              >
                {activeFilterValue}
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-10">
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-28 space-y-8">
              <button
                onClick={clearFilter}
                className={`text-caption w-full text-left pb-2 border-b border-border transition-luxury ${
                  !activeFilterValue
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Fragrances ({perfumes.length})
              </button>
              {filterConfigs.map((config) => (
                <div key={config.type}>
                  <h3 className="text-caption text-foreground mb-3">{config.label}</h3>
                  <ul className="space-y-2">
                    {config.options.map((option) => {
                      const isActive =
                        activeFilterType === config.type && activeFilterValue === option;
                      return (
                        <li key={option}>
                          <button
                            onClick={() => setFilter(config.type, option)}
                            className={`text-sm font-light tracking-wide transition-luxury block w-full text-left ${
                              isActive
                                ? "text-foreground font-normal"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {isActive && "— "}
                            {option}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground text-caption shadow-lg"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm lg:hidden"
              >
                <div className="h-full overflow-y-auto p-6">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-subheadline">Filters</h2>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      clearFilter();
                      setMobileFiltersOpen(false);
                    }}
                    className="text-caption text-foreground mb-8 block"
                  >
                    All Fragrances ({perfumes.length})
                  </button>
                  <div className="space-y-8">
                    {filterConfigs.map((config) => (
                      <div key={config.type}>
                        <h3 className="text-caption text-foreground mb-3">{config.label}</h3>
                        <div className="flex flex-wrap gap-2">
                          {config.options.map((option) => {
                            const isActive =
                              activeFilterType === config.type &&
                              activeFilterValue === option;
                            return (
                              <button
                                key={option}
                                onClick={() => setFilter(config.type, option)}
                                className={`text-sm font-light px-3 py-1.5 border transition-luxury ${
                                  isActive
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                                }`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="text-body text-muted-foreground">
                {filteredPerfumes.length} fragrance{filteredPerfumes.length !== 1 ? "s" : ""}
              </p>
            </div>

            {filteredPerfumes.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              >
                {filteredPerfumes.map((perfume, index) => (
                  <PerfumeCard
                    key={perfume.id}
                    id={perfume.id}
                    name={perfume.name}
                    inspiration={perfume.inspiration}
                    category={perfume.category}
                    image={perfume.images[0]}
                    price={perfume.price}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-subheadline text-muted-foreground mb-2">
                  No fragrances found
                </p>
                <p className="text-body text-muted-foreground/70 mb-6">
                  Try a different filter or browse all fragrances
                </p>
                <button
                  onClick={clearFilter}
                  className="text-caption link-underline text-foreground"
                >
                  View All Perfumes
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
