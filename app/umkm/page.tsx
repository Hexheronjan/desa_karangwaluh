"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Store,
  Search,
  MessageCircle,
  ExternalLink,
  Star,
  MapPin,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  Tag,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { localProducts, ProductUmkm, villageConfig } from "@/lib/config";
import { getStoredProducts, getStoredVillageConfig } from "@/lib/storage";
import { formatWhatsAppUrl } from "@/lib/utils";

export default function UmkmPage() {
  const [products, setProducts] = useState<ProductUmkm[]>(localProducts);
  const [config, setConfig] = useState(villageConfig);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  function refresh() {
    setProducts(getStoredProducts());
    setConfig(getStoredVillageConfig());
  }

  useEffect(() => {
    refresh();
    window.addEventListener("village-storage-update", refresh);
    return () => window.removeEventListener("village-storage-update", refresh);
  }, []);

  // Categories list
  const categories = [
    "Semua",
    "Olahan Makanan Ringan",
    "Seni Budaya & Cinderamata",
    "Hasil Bumi & Herbal",
    "Kerajinan Tangan",
  ];

  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.sellerName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-emerald-50/40 dark:bg-emerald-950/20">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb & Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300/50">
            <Store className="w-3.5 h-3.5" />
            <span>Sentra Ekonomi & Potensi Desa</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-950 dark:text-white tracking-tight">
            Katalog Produk & UMKM Karangwaluh
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            Dukung kemajuan ekonomi warga Desa Karangwaluh dengan membeli aneka produk olahan pangan lokal, kerajinan tangan, dan hasil kebun asli buatan warga. Pembelian terhubung langsung ke WhatsApp masing-masing produsen.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white dark:bg-emerald-900/40 p-4 sm:p-6 rounded-3xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk keripik, madu, reog, anyaman, atau nama penjual..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Quick Count Badge */}
            <div className="shrink-0 text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-900/60 px-3 py-2 rounded-xl border border-emerald-200/50 w-full sm:w-auto text-center">
              Menampilkan <strong>{filteredProducts.length}</strong> produk
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100 dark:border-emerald-800/40">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "bg-gray-100 dark:bg-emerald-950/60 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-emerald-900/20 border border-emerald-900/10 dark:border-emerald-800/30">
            <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-emerald-800 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700 dark:text-gray-300">
              Produk Tidak Ditemukan
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Tidak ada produk yang cocok dengan pencarian "{searchQuery}". Coba kata kunci lain atau pilih kategori "Semua".
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Semua");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const waUrl = formatWhatsAppUrl(
                product.whatsappNumber,
                product.orderMessage || `Halo ${product.sellerName}, saya ingin memesan produk ${product.name} khas Desa Karangwaluh.`
              );

              return (
                <div
                  key={product.id}
                  className="rounded-3xl bg-white dark:bg-emerald-900/30 overflow-hidden border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Product Photo */}
                    <div className="relative aspect-4/3 w-full bg-emerald-100 dark:bg-emerald-950/60 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute top-3 left-3 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-emerald-900 dark:text-emerald-200 shadow-xs border border-emerald-200/50">
                        {product.category}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-amber-400 text-emerald-950 px-3 py-1 rounded-xl text-xs font-black shadow-md">
                        {product.priceEstimate}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{product.sellerName}</span>
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-black shrink-0">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{product.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-black text-emerald-950 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors leading-snug">
                        {product.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Action / WhatsApp Order Button */}
                  <div className="p-6 pt-0">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-200" />
                      <span>Pesan via WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Promo Registration Banner for Citizens */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-6 sm:p-10 shadow-xl border border-emerald-700/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fasilitasi Promosi UMKM Gratis</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black">
              Punya Usaha atau Produk di Desa Karangwaluh?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Pemerintah Desa Karangwaluh siap mempromosikan produk olahan pangan, kerajinan tangan, atau jasa Anda di portal website desa secara 100% GRATIS. Hubungi admin atau datang langsung ke Balai Desa.
            </p>
          </div>

          <a
            href={`https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(
              "Halo Admin Desa Karangwaluh, saya warga Karangwaluh dan memiliki produk UMKM. Saya ingin mendaftarkan produk saya untuk ditampilkan di website desa."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs sm:text-sm shadow-lg transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Daftarkan Usaha Saya</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-75" />
          </a>
        </div>
      </div>
    </div>
  );
}
