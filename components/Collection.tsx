"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PerfumeCard from "./PerfumeCard";
import { perfumes as localPerfumes, type PerfumeData } from "@/data/perfumes";

const categories = [
  { id: "all", label: "All Fragrances" },
  { id: "fresh", label: "Fresh" },
  { id: "woody", label: "Woody" },
  { id: "sweet", label: "Sweet" },
  { id: "oriental", label: "Oriental" },
  { id: "oud", label: "Oud" },
];

const Collection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [perfumes, setPerfumes] = useState<PerfumeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        setPerfumes(Array.isArray(data) ? data : localPerfumes);
      } catch (error) {
        console.error("Error fetching products:", error);
        setPerfumes(localPerfumes);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredPerfumes =
    activeCategory === "all"
      ? perfumes
      : perfumes.filter((p) => p.categoryId === activeCategory);
  const visiblePerfumes = filteredPerfumes.slice(0, 10);

  return (
    <section id="collection" className="py-24 md:py-32">
      <div className="container-luxury">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-caption text-muted-foreground mb-4">
            The Collection
          </p>
          <h2 className="text-headline mb-6">
            Timeless <span className="italic">Elegance</span>
          </h2>
          <div className="divider-elegant mx-auto mb-6" />
          <p className="text-body text-muted-foreground max-w-xl mx-auto">
            Each fragrance is a tribute to the world's most iconic scents,
            crafted with precision and passion in the heart of England.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 md:mb-16"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-[10px] md:text-caption px-3 md:px-4 py-1.5 md:py-2 transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:text-foreground border border-border hover:border-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Perfume Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 items-start"
        >
          {visiblePerfumes.map((perfume, index) => (
            <div key={perfume.id} className={index % 2 === 1 ? "mt-24 md:mt-0" : ""}>
              <PerfumeCard
                id={perfume.id}
                name={perfume.name}
                inspiration={perfume.inspiration}
                category={perfume.category}
                image={perfume.images[0]}
                price={perfume.price}
                index={index}
                bestSeller={perfume.badges?.bestSeller}
                limitedStock={perfume.badges?.limitedStock}
              />
            </div>
          ))}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <a
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-foreground text-caption tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            See All Products
          </a>
        </div>
      </div>
    </section>
  );
};

export default Collection;
