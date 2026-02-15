"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

const fallbackSlides = [
  { url: "/images/hero-perfume.jpg", label: "HUME luxury perfume", link: "/shop" },
  { url: "/images/collection-hero.jpg", label: "HUME collection", link: "/shop" },
  { url: "/images/hero-perfume.jpg", label: "HUME offers", link: "/shop" },
];

const Hero = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(fallbackSlides.length);
  const [slides, setSlides] = useState(fallbackSlides);

  useEffect(() => {
    if (!api) {
      return;
    }

    setSlideCount(api.scrollSnapList().length);
    setSelectedIndex(api.selectedScrollSnap());

    const handleSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    api.on("reInit", handleSelect);

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
      clearInterval(interval);
    };
  }, [api]);

  useEffect(() => {
    let active = true;
    const loadSlides = async () => {
      try {
        const response = await fetch("/api/images?usage=hero");
        if (!response.ok) {
          throw new Error("Failed to load hero slides");
        }
        const data = (await response.json()) as { url: string; label: string; link?: string }[];
        if (active && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            url: item.url,
            label: item.label ?? "HUME offer",
            link: item.link ?? "/shop",
          }));
          setSlides(mapped);
          setSlideCount(mapped.length);
        }
      } catch (error) {
        console.error("Failed to load hero slides:", error);
      }
    };

    loadSlides();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="min-h-screen flex items-center pt-24">
      <div className="container-luxury w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <p className="text-caption text-muted-foreground mb-6">
              The Art of Impression
            </p>
            <h1 className="text-display mb-8">
              Luxury
              <br />
              <span className="italic">Reimagined</span>
            </h1>
            <div className="divider-elegant mb-8" />
            <p className="hidden md:block text-body text-muted-foreground max-w-md mb-10">
              Experience the world&apos;s most celebrated fragrances, meticulously
              crafted to capture their essence. HUME brings you exceptional
              clone perfumes that honour the originals while remaining
              accessible.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground text-caption tracking-widest hover:bg-primary/90 transition-colors"
              >
                Shop All Perfumes
              </Link>

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="order-1 lg:order-2 -mx-6 sm:mx-0"
          >
            <Carousel
              setApi={setApi}
              opts={{ loop: true }}
              className="w-screen sm:w-full"
            >
              <CarouselContent className="-ml-0">
                {slides.map((slide, index) => (
                  <CarouselItem key={`${slide.url}-${index}`} className="pl-0">
                    <div className="relative w-full aspect-square">
                      {slide.link?.startsWith("http") ? (
                        <a href={slide.link} className="block w-full h-full" target="_blank" rel="noreferrer">
                          <img
                            src={slide.url}
                            alt={slide.label}
                            className="object-cover w-full h-full"
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                        </a>
                      ) : (
                        <Link href={slide.link ?? "/shop"} className="block w-full h-full">
                          <img
                            src={slide.url}
                            alt={slide.label}
                            className="object-cover w-full h-full"
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                        </Link>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="mt-4 flex items-center justify-center gap-3 sm:justify-center">
              {Array.from({ length: slideCount }).map((_, index) => (
                <button
                  key={`hero-dot-${index}`}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={selectedIndex === index}
                  onClick={() => api?.scrollTo(index)}
                  className="group flex items-center"
                >
                  <span className="relative h-px w-10 overflow-hidden bg-foreground/20">
                    <span
                      className={`absolute inset-0 origin-left bg-foreground transition-transform duration-[2000ms] ${
                        selectedIndex === index ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
