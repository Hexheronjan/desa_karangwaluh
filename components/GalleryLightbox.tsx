"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2, Tag } from "lucide-react";
import { GalleryItem } from "@/lib/config";

interface GalleryLightboxProps {
  items: GalleryItem[];
}

export function GalleryLightbox({ items }: GalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("Semua");

  const categories = ["Semua", "Kantor", "Panorama", "Pertanian", "UMKM", "Infrastruktur"];

  const filteredItems =
    filter === "Semua" ? items : items.filter((item) => item.category === filter);

  function openLightbox(index: number) {
    setSelectedIndex(index);
  }

  function closeLightbox() {
    setSelectedIndex(null);
  }

  function prevImage() {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + filteredItems.length) % filteredItems.length);
  }

  function nextImage() {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % filteredItems.length);
  }

  const currentItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  return (
    <div>
      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              setSelectedIndex(null);
            }}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              filter === cat
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-800/40 hover:bg-emerald-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry / Grid Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openLightbox(idx)}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-emerald-950/5 border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className="relative aspect-4/3 w-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/30">
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Category Tag */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/90 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-200 backdrop-blur-xs shadow-xs">
                  <Tag className="w-3 h-3 text-emerald-700" />
                  {item.category}
                </span>
              </div>

              {/* Zoom Icon Button */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Caption Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
                <h4 className="font-bold text-base sm:text-lg leading-snug drop-shadow-xs">
                  {item.title}
                </h4>
                <p className="text-xs text-emerald-200 line-clamp-1 mt-1 opacity-90">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {currentItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
            aria-label="Tutup pratinjau"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
            aria-label="Foto berikutnya"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image & Detail Content */}
          <div
            className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[60vh] sm:h-[70vh] rounded-2xl overflow-hidden shadow-2xl bg-black/40">
              <Image
                src={currentItem.src}
                alt={currentItem.title}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-4 text-center max-w-xl text-white">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-800 text-emerald-200">
                {currentItem.category}
              </span>
              <h3 className="text-xl font-bold mt-2">{currentItem.title}</h3>
              <p className="text-sm text-gray-300 mt-1">{currentItem.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                Foto {selectedIndex! + 1} dari {filteredItems.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
