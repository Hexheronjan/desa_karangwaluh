"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  Users,
  HeartHandshake,
  CalendarCheck,
  Search,
  AlertTriangle,
  MessageCircle,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Headphones,
  PhoneCall,
} from "lucide-react";
import { villageConfig } from "@/lib/config";
import { formatWhatsAppUrl } from "@/lib/utils";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  prefilledMessage: string;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

export default function LayananMandiriPage() {
  const services: ServiceItem[] = [
    {
      id: "srv-1",
      title: "Tanya Jam Buka & Pelayanan Kantor",
      description: "Informasi jadwal pamong desa, jam buka balai desa, dan syarat berkas sebelum berkunjung.",
      icon: Clock,
      prefilledMessage:
        "Halo Admin Desa Karangwaluh, saya ingin menanyakan jadwal pelayanan kantor desa hari ini dan jam keberadaan pamong.",
    },
    {
      id: "srv-2",
      title: "Konsultasi Administrasi Kependudukan",
      description: "Panduan pengurusan KK baru, mutasi KTP, surat pindah domisili, atau akta kelahiran.",
      icon: Users,
      prefilledMessage:
        "Halo Admin Desa Karangwaluh, saya ingin berkonsultasi mengenai kelengkapan berkas administrasi kependudukan (KTP/KK).",
    },
    {
      id: "srv-3",
      title: "Informasi Bantuan Sosial & PKH",
      description: "Cek jadwal penyaluran bansos beras pangan, BLT Dana Desa, atau program PKH.",
      icon: HeartHandshake,
      prefilledMessage:
        "Halo Admin Desa Karangwaluh, saya ingin menanyakan informasi dan jadwal penyaluran bantuan sosial terbaru.",
    },
    {
      id: "srv-4",
      title: "Jadwalkan Kunjungan ke Kantor Desa",
      description: "Atur janji temu dengan Kepala Desa atau Pamong Urusan untuk keperluan khusus.",
      icon: CalendarCheck,
      prefilledMessage:
        "Halo Admin Desa Karangwaluh, saya ingin membuat janji temu dengan perangkat desa untuk keperluan koordinasi warga.",
    },
    {
      id: "srv-5",
      title: "Tanya Perkembangan Berkas & Surat",
      description: "Cek langsung ke petugas piket jika ada kendala saat mengajukan surat kependudukan.",
      icon: Search,
      prefilledMessage:
        "Halo Admin Desa Karangwaluh, saya ingin mengecek status berkas surat yang sudah saya ajukan secara online.",
    },
    {
      id: "srv-6",
      title: "Lapor Kejadian Darurat (Siaga 24 Jam)",
      description: "Hubungi kontak darurat untuk kebutuhan mendesak, pertolongan medis, atau bencana.",
      icon: AlertTriangle,
      badge: "Siaga 24 Jam",
      badgeColor: "bg-red-500 text-white",
      highlight: true,
      prefilledMessage:
        "DARURAT: Halo Pamong Desa Karangwaluh, mohon bantuan segera terkait kejadian darurat di lingkungan desa.",
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-emerald-50/40 dark:bg-emerald-950/20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-3.5 py-1 rounded-full border border-emerald-200/60">
            Satu Sentuhan ke Pamong
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-emerald-950 dark:text-white mt-3 tracking-tight">
            Pusat Layanan Mandiri WhatsApp
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            Klik tombol di bawah untuk langsung membuka WhatsApp resmi Kantor Desa Karangwaluh dengan teks pertanyaan yang telah disiapkan otomatis.
          </p>
        </div>

        {/* Nomor Resmi Badge */}
        <div className="max-w-md mx-auto mb-10 p-4 rounded-2xl bg-white dark:bg-emerald-900/40 border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-800/60 text-emerald-800 dark:text-emerald-200 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-500 dark:text-gray-400">Nomor Pelayanan Desa:</p>
              <p className="font-mono font-extrabold text-emerald-950 dark:text-white">
                +{villageConfig.contact.whatsapp}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Online Siaga
          </span>
        </div>

        {/* Grid Tombol Besar WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => {
            const Icon = item.icon;
            const waUrl = formatWhatsAppUrl(villageConfig.contact.whatsapp, item.prefilledMessage);

            return (
              <a
                key={item.id}
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative rounded-3xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between border shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                  item.highlight
                    ? "bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-950/30 dark:to-emerald-950/50 border-red-200 dark:border-red-900/60"
                    : "bg-white dark:bg-emerald-900/30 border-emerald-900/10 dark:border-emerald-800/40 hover:border-emerald-600"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        item.highlight
                          ? "bg-red-600 text-white shadow-md shadow-red-500/20"
                          : "bg-emerald-800 text-white shadow-md shadow-emerald-800/20"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {item.badge && (
                      <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-extrabold text-emerald-950 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-emerald-800/30 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300 group-hover:text-emerald-950">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Chat via WhatsApp</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Banner Panduan Tambahan */}
        <div className="mt-12 p-6 rounded-3xl bg-emerald-900 text-white border border-emerald-700/50 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-amber-300">
              Ingin Membuat Surat Resmi Tanpa Lewat Chat?
            </h4>
            <p className="text-xs sm:text-sm text-emerald-200">
              Anda bisa memakai formulir surat online untuk langsung mencetak dokumen dengan kop dan tanda tangan desa.
            </p>
          </div>
          <Link
            href="/surat"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold text-sm shadow-md transition-all active:scale-98 shrink-0 flex items-center gap-2"
          >
            <span>Buka Surat Online</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
