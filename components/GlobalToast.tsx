"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, X, ArrowRight } from "lucide-react";
import { VillageNotification } from "@/lib/types";

export function GlobalToast() {
  const [activeToast, setActiveToast] = useState<VillageNotification | null>(null);

  useEffect(() => {
    function handleStorageUpdate(e: any) {
      if (typeof window === "undefined") return;
      try {
        const notifData = window.localStorage.getItem("karangwaluh_demo_notifications_v1");
        if (notifData) {
          const list: VillageNotification[] = JSON.parse(notifData);
          if (list.length > 0) {
            const latest = list[0];
            // Show toast if within last 5 seconds
            const diffMs = Date.now() - new Date(latest.timestamp).getTime();
            if (diffMs < 5000 && !latest.isRead) {
              setActiveToast(latest);
              const timer = setTimeout(() => {
                setActiveToast(null);
              }, 6000);
              return () => clearTimeout(timer);
            }
          }
        }
      } catch (err) {
        console.error("Toast error:", err);
      }
    }

    window.addEventListener("village-storage-update", handleStorageUpdate);
    return () => window.removeEventListener("village-storage-update", handleStorageUpdate);
  }, []);

  if (!activeToast) return null;

  return (
    <div className="no-print fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full bg-white dark:bg-emerald-950 p-4 rounded-2xl shadow-2xl border border-emerald-600/40 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500 text-emerald-950 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-emerald-900 dark:text-emerald-200">
              Notifikasi Baru
            </h4>
            <button
              onClick={() => setActiveToast(null)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs font-bold text-gray-900 dark:text-white mt-1">
            {activeToast.title}
          </p>
          <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 mt-0.5">
            {activeToast.message}
          </p>

          {activeToast.link && (
            <Link
              href={activeToast.link}
              onClick={() => setActiveToast(null)}
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 hover:underline"
            >
              <span>Lihat Sekarang</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
