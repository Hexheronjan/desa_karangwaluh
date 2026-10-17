"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquareWarning, FileText, Bell, PhoneForwarded } from "lucide-react";
import { getUnreadNotificationCount } from "@/lib/storage";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    function updateCount() {
      setUnreadCount(getUnreadNotificationCount());
    }
    updateCount();

    window.addEventListener("village-storage-update", updateCount);
    return () => {
      window.removeEventListener("village-storage-update", updateCount);
    };
  }, []);

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
      badge: null,
      highlight: true,
    },
    {
      label: "Pengaduan",
      href: "/pengaduan",
      icon: MessageSquareWarning,
    },
    {
      label: "Notifikasi",
      href: "/notifikasi",
      icon: Bell,
      badge: unreadCount,
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
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-emerald-950 animate-pulse">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
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
