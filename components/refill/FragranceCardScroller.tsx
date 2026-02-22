"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

type FragranceOption = {
  id: string;
  name: string;
  inspiration?: string;
  image: string;
};

type FragranceCardScrollerProps = {
  title: string;
  options: FragranceOption[];
};

export default function FragranceCardScroller({ title, options }: FragranceCardScrollerProps) {
  const [selectedId, setSelectedId] = useState("");
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => options.find((item) => item.id === selectedId) ?? options[0],
    [options, selectedId]
  );

  if (!options.length) return null;

  return (
    <div>
      <p className="mb-2 text-[0.72rem] uppercase tracking-[0.2em] text-white/55">{title}</p>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-12 w-full items-center justify-between border border-white/30 bg-transparent px-4 text-left"
      >
        <span
          className={clsx(
            "truncate text-[0.74rem] uppercase tracking-[0.14em]",
            selected?.name ? "text-white/95" : "text-white/60"
          )}
        >
          {selected?.name ?? "Choose Fragrance"}
        </span>
        <ChevronDown
          className={clsx("h-4 w-4 text-white/70 transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div
          className="hide-scrollbar mt-2 max-h-56 space-y-2 overflow-y-auto pr-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {options.map((item) => {
            const isSelected = item.id === selected?.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedId(item.id);
                  setOpen(false);
                }}
                className={clsx(
                  "flex w-full items-center gap-3 border p-2 text-left transition-colors",
                  isSelected ? "border-[#b58b36] bg-white/5" : "border-white/20 hover:border-white/35"
                )}
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-white/5">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[0.78rem] uppercase tracking-[0.12em] text-white/95">{item.name}</p>
                  <p className="mt-0.5 line-clamp-1 text-[0.7rem] italic text-white/55">
                    Inspired by {item.inspiration || "HUME Signature"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      ) : null}

      <input type="hidden" name={title.toLowerCase().replace(/\s+/g, "-")} value={selected?.name ?? ""} />
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
