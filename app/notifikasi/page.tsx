"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  FileText,
  MessageSquareWarning,
  Sparkles,
  ArrowRight,
  Clock,
  Trash2,
} from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/storage";
import { VillageNotification } from "@/lib/types";
import { formatDateIndo } from "@/lib/utils";

export default function NotifikasiPage() {
  const [notifications, setNotifications] = useState<VillageNotification[]>([]);

  useEffect(() => {
    function load() {
      setNotifications(getNotifications());
    }
    load();

    window.addEventListener("village-storage-update", load);
    return () => window.removeEventListener("village-storage-update", load);
  }, []);

  function handleMarkAll() {
    markAllNotificationsRead();
    setNotifications(getNotifications());
  }

  function handleRead(id: string) {
    markNotificationRead(id);
    setNotifications(getNotifications());
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-emerald-50/40 dark:bg-emerald-950/20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-3.5 py-1 rounded-full border border-emerald-200/60">
                Pusat Pemberitahuan
              </span>
              {unreadCount > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                  {unreadCount} baru
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-white mt-2">
              Notifikasi Layanan Warga
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Setiap perubahan status surat dan tanggapan pengaduan akan muncul di sini.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-emerald-900/60 hover:bg-emerald-50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Tandai Semua Sudah Dibaca</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-emerald-900/20 border border-emerald-900/10 dark:border-emerald-800/30">
            <Bell className="w-12 h-12 text-gray-300 dark:text-emerald-800 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700 dark:text-gray-300">
              Belum Ada Notifikasi
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Saat Anda mengajukan permohonan surat atau membuat laporan aduan, perkembangan statusnya akan diberitahukan di halaman ini.
            </p>
            <div className="mt-5">
              <Link
                href="/surat"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
              >
                <span>Ajukan Surat Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const isSurat = notif.type === "surat";
              const isPengaduan = notif.type === "pengaduan";

              return (
                <div
                  key={notif.id}
                  onClick={() => handleRead(notif.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    notif.isRead
                      ? "bg-white/80 dark:bg-emerald-900/20 border-gray-200/80 dark:border-emerald-800/30 text-gray-600 dark:text-gray-300"
                      : "bg-white dark:bg-emerald-900/50 border-emerald-500/50 dark:border-emerald-700 shadow-sm ring-1 ring-emerald-500/20"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSurat
                        ? "bg-emerald-100 dark:bg-emerald-800/60 text-emerald-800 dark:text-emerald-200"
                        : isPengaduan
                        ? "bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200"
                        : "bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {isSurat ? (
                      <FileText className="w-5 h-5" />
                    ) : isPengaduan ? (
                      <MessageSquareWarning className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-sm font-bold ${
                          notif.isRead ? "text-gray-900 dark:text-white" : "text-emerald-950 dark:text-emerald-100 font-extrabold"
                        }`}
                      >
                        {notif.title}
                      </h3>
                      {!notif.isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateIndo(notif.timestamp)}
                      </span>

                      {notif.link && (
                        <Link
                          href={notif.link}
                          className="font-bold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1"
                        >
                          <span>Buka Detail</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
