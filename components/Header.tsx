"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, Sparkles, ExternalLink } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ShopMegaMenu, { shopSections } from "./ShopMegaMenu";
import type { FilterType } from "./ShopMegaMenu";
import SearchOverlay from "./SearchOverlay";
import { celebrityFavorites } from "@/lib/celebrity-favorites";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [celebImageByLabel, setCelebImageByLabel] = useState<Record<string, string>>({});
  const { totalItems, setIsCartOpen } = useCart();
  const router = useRouter();

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

  const handleMobileFilterClick = (filterType: FilterType, value: string, href?: string) => {
    setIsMenuOpen(false);
    if (href) {
      router.push(href);
      return;
    }
    if (filterType === "celebrity") {
      router.push(`/celebrities-favorites?celebrity=${encodeURIComponent(value)}`);
      return;
    }
    router.push(`/shop?filter=${filterType}&value=${encodeURIComponent(value)}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container-luxury">
        <div className="flex items-center justify-between py-5">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="hidden md:block">
              <ShopMegaMenu
                isOpen={isShopOpen}
                onOpen={() => setIsShopOpen(true)}
                onClose={() => setIsShopOpen(false)}
              />
            </div>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-baseline gap-1.5">
            <span className="font-serif text-2xl md:text-3xl font-light tracking-widest">
              HUME
            </span>
            <span className="text-caption text-muted-foreground hidden sm:inline">
              PERFUMES
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-muted transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-foreground text-background text-[10px] flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-t border-border overflow-hidden"
          >
            <nav className="container-luxury py-6">
              <div className="pl-1 pb-2 space-y-5">
                <p className="text-caption text-foreground">Shop</p>

                {shopSections.map((section) => (
                  <div key={section.title}>
                    {section.title === "Celebrities' Favorite" ? (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push("/celebrities-favorites");
                        }}
                        className="text-xs text-muted-foreground uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5 hover:text-foreground transition-luxury cursor-pointer group"
                      >
                        {section.title}
                        <ExternalLink size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                      </button>
                    ) : (
                      <h4 className="text-xs text-muted-foreground uppercase tracking-[0.15em] mb-2">
                        {section.title}
                      </h4>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {(section.title === "Celebrities' Favorite"
                        ? section.items.slice(0, 4)
                        : section.items
                      ).map((item) =>
                        item.href ? (
                          <motion.button
                            key={item.label}
                            onClick={() => handleMobileFilterClick(item.filterType, item.label, item.href)}
                            initial={{ opacity: 0.92, y: 0 }}
                            animate={{ opacity: [0.92, 1, 0.92], y: [0, -1.5, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-sm font-medium text-background px-3 py-2 border border-foreground/20 bg-gradient-to-r from-foreground to-zinc-700 transition-luxury flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
                          >
                            {item.label}
                          </motion.button>
                        ) : (
                          <button
                            key={item.label}
                            onClick={() => handleMobileFilterClick(item.filterType, item.label, item.href)}
                            className="text-sm font-light text-foreground px-3 py-1.5 border border-border hover:bg-muted transition-luxury flex items-center gap-2 cursor-pointer"
                          >
                            {item.image ? (
                              <img
                                src={
                                  section.title === "Celebrities' Favorite"
                                    ? celebImageByLabel[item.label] || item.image
                                    : item.image
                                }
                                alt={item.label}
                                className={`object-cover border border-border ${
                                  section.title === "Celebrities' Favorite"
                                    ? "w-10 h-10 rounded-sm"
                                    : "w-6 h-6 rounded-md"
                                }`}
                              />
                            ) : null}
                            {item.label}
                          </button>
                        )
                      )}
                    </div>

                  </div>
                ))}

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/shop");
                  }}
                  className="text-caption link-underline text-foreground mt-2 cursor-pointer"
                >
                  View All Perfumes -&gt;
                </button>

                <motion.button
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/kit-pack");
                  }}
                  initial={{ opacity: 0.85, y: 0 }}
                  animate={{ opacity: [0.85, 1, 0.85], y: [0, -2, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full mt-6 text-left p-4 border border-foreground/20 bg-gradient-to-r from-foreground text-background to-zinc-700"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={16} />
                    <span className="text-xs uppercase tracking-[0.15em]">Limited Offer</span>
                  </div>
                  <p className="font-serif text-xl leading-tight">Build Your Kit</p>
                  <p className="text-sm opacity-90">Pack of 4 x 20ml perfumes</p>
                </motion.button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;
