"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
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
            <p className="text-body text-muted-foreground max-w-md mb-10">
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
              <a
                href="#collection"
                className="inline-flex items-center gap-3 text-caption link-underline group"
              >
                Discover Collection
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              <Image
                src="/images/hero-perfume.jpg"
                alt="HUME luxury perfume bottle"
                width={800}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
