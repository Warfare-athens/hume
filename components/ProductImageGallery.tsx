"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

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

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(mediaItems.length);
  const blurDataURL =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjQyIiBmaWxsPSIjZWVlY2VjIi8+PC9zdmc+";

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

  return (
    <div className="space-y-4">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="w-[calc(100%+3rem)] -mx-6 sm:mx-0 sm:w-full"
      >
        <CarouselContent className="-ml-0">
          {mediaItems.map((item, index) => (
            <CarouselItem key={`${item.src}-${index}`} className="pl-0 basis-[95%] pr-3">
              <div className="aspect-[3/4] bg-secondary overflow-hidden relative">
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={`${name} - Image ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="grid grid-cols-4 gap-3">
        {mediaItems.slice(0, slideCount).map((item, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`relative aspect-square bg-secondary overflow-hidden transition-all duration-300 ${
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
              <Image
                src={item.src}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                sizes="96px"
                className="object-cover"
                placeholder="blur"
                blurDataURL={blurDataURL}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
