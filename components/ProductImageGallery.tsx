"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImageGalleryProps {
  images: string[];
  videos?: string[];
  name: string;
}

type GalleryItem =
  | { type: "video"; src: string }
  | { type: "image"; src: string };

const ProductImageGallery = ({ images, videos = [], name }: ProductImageGalleryProps) => {
  const mediaItems: GalleryItem[] = [
    ...videos.map((src) => ({ type: "video" as const, src })),
    ...images.map((src) => ({ type: "image" as const, src })),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedItem = mediaItems[selectedIndex];

  return (
    <div className="space-y-4">
      <div className="aspect-[3/4] bg-secondary overflow-hidden relative">
        <AnimatePresence mode="wait">
          {selectedItem?.type === "video" ? (
            <motion.video
              key={`${selectedIndex}-${selectedItem.src}`}
              src={selectedItem.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <motion.img
              key={`${selectedIndex}-${selectedItem?.src ?? ""}`}
              src={selectedItem?.src}
              alt={`${name} - Image ${selectedIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {mediaItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`aspect-square bg-secondary overflow-hidden transition-all duration-300 ${
              selectedIndex === index
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            {item.type === "video" ? (
              <video
                src={item.src}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            ) : (
              <img
                src={item.src}
                alt={`${name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
