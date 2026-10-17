"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  FileText,
  Search,
} from "lucide-react";
import { villageConfig } from "@/lib/config";
import { getStoredVillageConfig } from "@/lib/storage";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [config, setConfig] = useState(villageConfig);

  useEffect(() => {
    function updateState() {
      setConfig(getStoredVillageConfig());
    }
    updateState();

    function handleScroll() {
      setIsScrolled(window.scrollY > 15);
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("village-storage-update", updateState);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("village-storage-update", updateState);
    };
  }, []);

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Layanan Mandiri", href: "/layanan-mandiri" },
    { label: "Surat Online", href: "/surat" },
    { label: "Pengaduan", href: "/pengaduan" },
    { label: "Lacak Status", href: "/lacak" },
    { label: "Produk UMKM", href: "/umkm" },
  ];

  if (pathname.startsWith("/admin-demo") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <>
      {/* Main Sticky Glass Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 w-full overflow-x-clip ${
          isScrolled
            ? "bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md shadow-md border-b border-emerald-900/10 dark:border-emerald-800/30 py-2.5 sm:py-3"
            : "bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md py-3 sm:py-3.5 border-b border-emerald-900/10 shadow-xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 w-full">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl p-1 bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Image
                src="/images/desa/logo.gif"
                alt="Lambang Kabupaten Ponorogo - Desa Karangwaluh"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base lg:text-lg text-emerald-950 dark:text-emerald-100 tracking-tight group-hover:text-emerald-800 transition-colors whitespace-nowrap">
                  {config.name}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 hidden 2xl:inline">
                  Sampung • Ponorogo
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                Portal Pelayanan Masyarakat Mandiri
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 bg-emerald-50/80 dark:bg-emerald-900/40 p-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/50 shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold tracking-wide transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "text-emerald-950/80 dark:text-emerald-100/90 hover:text-emerald-900 hover:bg-emerald-100/70 dark:hover:bg-emerald-800/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Direct Action) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Buat Surat Direct CTA (Desktop & Tablet) */}
            <Link
              href="/surat"
              className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 shrink-0 ring-2 ring-emerald-600/30 whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Buat Surat</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-emerald-950 dark:text-emerald-100 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              aria-label="Buka menu navigasi"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-3 pb-5 border-t border-emerald-900/10 dark:border-emerald-800/40 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${
                      isActive
                        ? "bg-emerald-800 text-white"
                        : "text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <div className="pt-2 mt-2 border-t border-gray-100 dark:border-emerald-900/50 flex flex-col gap-2">
                <Link
                  href="/lacak"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-50 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-emerald-700" />
                  <span>Lacak Status Surat Pribadi</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
