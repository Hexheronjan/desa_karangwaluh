"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquareWarning, FileText, Search, PhoneForwarded } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin-demo") || pathname.startsWith("/login")) {
    return null;
  }

  const navItems = [
    {
      label: "Beranda",
      href: "/",
      icon: Home,
    },
    {
      label: "Layanan",
      href: "/layanan-mandiri",
      icon: PhoneForwarded,
    },
    {
      label: "Surat",
      href: "/surat",
      icon: FileText,
      highlight: true,
    },
    {
      label: "Pengaduan",
      href: "/pengaduan",
      icon: MessageSquareWarning,
    },
    {
      label: "Lacak",
      href: "/lacak",
      icon: Search,
    },
  ];

  return (
    <nav
      className="bottom-nav lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md border-t border-emerald-900/10 dark:border-emerald-800/40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      aria-label="Navigasi Bawah Layar Ponsel"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-all group ${
                isActive
                  ? "text-emerald-800 dark:text-emerald-300 font-bold"
                  : "text-gray-500 dark:text-gray-400 font-medium hover:text-emerald-700"
              }`}
            >
              <div className="relative">
                <item.icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "scale-110 stroke-[2.5]" : "group-hover:scale-105"
                  }`}
                />
              </div>
              <span className="text-[11px] leading-tight mt-1 tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-1 rounded-full bg-emerald-700 dark:bg-emerald-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
