"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ExternalLink } from "lucide-react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useCart } from "@/context/CartContext";
import ShopMegaMenu from "./ShopMegaMenu";
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

  useEffect(() => {
    if (!isMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMenuOpen]);

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
              <HiOutlineShoppingBag size={18} />
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
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] md:hidden"
          >
            <div className="h-full overflow-y-auto bg-background text-foreground">
              <div className="flex items-center justify-between border-b border-border px-5 py-5">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
                <span className="font-serif text-4xl leading-none tracking-[0.28em]">HUME</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center"
                    aria-label="Search"
                  >
                    <Search size={19} />
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="relative inline-flex h-9 w-9 items-center justify-center"
                    aria-label="Open cart"
                  >
                    <HiOutlineShoppingBag size={19} />
                    {totalItems > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-[#c7a65b] px-1 text-[10px] leading-4 text-black">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="px-6 py-5 space-y-6">
                <section>
                  <p className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground mb-2">
                    Navigation
                  </p>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/shop");
                    }}
                    className="inline-flex items-center gap-2.5 font-serif text-[2.05rem] italic leading-none"
                  >
                    <span className="underline underline-offset-4">The Collection</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </section>

                <section>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push("/scent-quiz");
                      }}
                      className="w-full border border-foreground bg-foreground px-4 py-3 text-left text-background"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-serif text-[1.4rem]">
                          Scent Quiz <span className="text-[0.65em] italic opacity-80">(60s)</span>
                        </p>
                        <span className="text-[1.9rem] opacity-70">→</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push("/kit-pack");
                      }}
                      className="w-full border border-foreground/45 px-4 py-3 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-serif text-[1.4rem]">
                          Build Your Kit <span className="text-[0.65em] text-muted-foreground">Pack of 4</span>
                        </p>
                        <span className="text-[1.9rem] text-muted-foreground">→</span>
                      </div>
                    </button>
                  </div>
                </section>

                <section>
                  <p className="text-[11px] uppercase tracking-[0.38em] text-muted-foreground mb-5">
                    By Occasion
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {["Gym", "Daily Wear", "Office", "Date Night", "Party", "Formal"].map((occasion) => (
                      <button
                        key={occasion}
                        onClick={() => handleMobileFilterClick("occasion", occasion)}
                        className="inline-flex min-h-7 items-center justify-center border border-border px-2 text-center text-xs font-light tracking-tight hover:bg-muted/50"
                      >
                        {occasion}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.38em] text-muted-foreground">
                      Celebrities&apos; Favorite
                    </p>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push("/celebrities-favorites");
                      }}
                      className="text-muted-foreground"
                      aria-label="Open celebrities favorite"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {celebrityFavorites.slice(0, 2).map((celeb) => (
                      <button
                        key={celeb.label}
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push(`/celebrities-favorites?celebrity=${encodeURIComponent(celeb.label)}`);
                        }}
                        className="text-left"
                      >
                        <img
                          src={celebImageByLabel[celeb.label] || celeb.image}
                          alt={celeb.label}
                          className="aspect-[3/4] w-full object-cover border border-border/60"
                        />
                        <p className="mt-2 text-[14px] text-gray-700 leading-none">{celeb.label}</p>
                        <p className="mt-1 text-[5px] uppercase tracking-[0.14em] text-muted-foreground">
                          {celeb.subtitle}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;
