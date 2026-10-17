"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  FileText,
  MessageSquareWarning,
  ShieldCheck,
  Store,
  PhoneCall,
  Search,
  ExternalLink,
} from "lucide-react";
import { getUnreadNotificationCount } from "@/lib/storage";
import { villageConfig } from "@/lib/config";

export function Navbar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    function updateCount() {
      setUnreadCount(getUnreadNotificationCount());
    }
    updateCount();

    function handleScroll() {
      setIsScrolled(window.scrollY > 15);
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("village-storage-update", updateCount);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("village-storage-update", updateCount);
    };
  }, []);

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Layanan Mandiri", href: "/layanan-mandiri" },
    { label: "Surat Online", href: "/surat" },
    { label: "Pengaduan", href: "/pengaduan" },
    { label: "Lacak Status", href: "/lacak" },
    { label: "Produk UMKM", href: "/#produk-umkm" },
  ];

  return (
    <>
      {/* Top Banner Mode Demo */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 border-b border-emerald-800/40">
        <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          Mode Demo Warga
        </span>
        <span className="hidden sm:inline text-emerald-300">
          Data tersimpan di perangkat ini. Uji alur persetujuan surat & laporan di:
        </span>
        <Link
          href="/admin-demo"
          className="font-semibold text-amber-300 hover:text-amber-200 underline decoration-amber-400/50 hover:decoration-amber-300 transition-colors flex items-center gap-1"
        >
          <span>Simulasi Petugas</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Main Sticky Glass Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 dark:bg-emerald-950/90 backdrop-blur-md shadow-sm border-b border-emerald-900/10 dark:border-emerald-800/30 py-2.5"
            : "bg-white/80 dark:bg-emerald-950/80 backdrop-blur-sm py-3.5 border-b border-emerald-900/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl p-1 bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Image
                src="/images/desa/logo.gif"
                alt="Lambang Kabupaten Ponorogo - Desa Karangwaluh"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-emerald-950 dark:text-emerald-100 tracking-tight group-hover:text-emerald-800 transition-colors">
                  {villageConfig.name}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 hidden md:inline">
                  Sampung • Ponorogo
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Portal Pelayanan Masyarakat Mandiri
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-emerald-50/70 dark:bg-emerald-900/30 p-1 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "text-emerald-950/80 dark:text-emerald-100/90 hover:text-emerald-900 hover:bg-emerald-100/60 dark:hover:bg-emerald-800/40"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Notification & Action) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <Link
              href="/notifikasi"
              className="relative p-2.5 rounded-full text-emerald-900 dark:text-emerald-100 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              aria-label={`Notifikasi (${unreadCount} belum dibaca)`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-amber-500 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center animate-bounce shadow-xs ring-2 ring-white dark:ring-emerald-950">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            {/* Buat Surat Direct CTA (Desktop) */}
            <Link
              href="/surat"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow-md transition-all active:scale-98"
            >
              <FileText className="w-4 h-4" />
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
                  href="/surat/saya"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-50 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Daftar Permohonan Surat Saya</span>
                </Link>
                <Link
                  href="/admin-demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 flex items-center justify-between border border-amber-200/50"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Panel Simulasi Petugas Desa</span>
                  </span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">Demo</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
