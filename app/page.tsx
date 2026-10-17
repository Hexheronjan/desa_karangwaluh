"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  MessageSquareWarning,
  PhoneForwarded,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight,
  Users,
  Compass,
  Building2,
  Send,
  Calendar,
  Store,
  MessageCircle,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { villageConfig, localProducts, villageNews, villageGallery } from "@/lib/config";
import { formatWhatsAppUrl } from "@/lib/utils";
import { StatCounter } from "@/components/StatCounter";
import { GalleryLightbox } from "@/components/GalleryLightbox";

export default function HomePage() {
  const [todayStatus, setTodayStatus] = useState<{
    isOpen: boolean;
    hours: string;
    dayName: string;
  }>({
    isOpen: true,
    hours: "08.00 - 15.00 WIB",
    dayName: "Hari Ini",
  });

  useEffect(() => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const now = new Date();
    const day = now.getDay();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    let isOpen = false;
    let hours = villageConfig.serviceHours.weekdays;

    if (day >= 1 && day <= 4) {
      // Senin - Kamis
      isOpen = currentHour >= 8 && currentHour < 15;
      hours = "08.00 – 15.00 WIB";
    } else if (day === 5) {
      // Jumat
      isOpen = currentHour >= 8 && currentHour < 14.5;
      hours = "08.00 – 14.30 WIB";
    } else {
      // Sabtu & Minggu
      isOpen = false;
      hours = "Tutup (Siaga 24 Jam via WhatsApp)";
    }

    setTodayStatus({
      isOpen,
      hours,
      dayName: days[day],
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION (Layar Penuh dengan Foto Desa & Gradasi Elegan) */}
      <section className="relative min-h-[92vh] sm:min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Next.js */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/desa/hero-karangwaluh.jpg"
            alt="Lanskap Persawahan dan Perbukitan Desa Karangwaluh Sampung Ponorogo"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-102 transition-transform duration-1000 ease-out"
          />
          {/* Multi-layered Warm Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/65 to-emerald-950/30" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-emerald-950/40 to-emerald-950/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Badge Wilayah */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-amber-300 text-xs sm:text-sm font-semibold mb-6 shadow-md animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>Selamat Datang di Portal Resmi Warga</span>
          </div>

          {/* Judul Besar yang Hangat */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl drop-shadow-md">
            Desa Karangwaluh yang Asri, Guyub, dan Melayani dari Hati
          </h1>

          {/* Satu Kalimat Penjelasan */}
          <p className="mt-5 text-base sm:text-xl text-emerald-100/95 max-w-2xl font-normal leading-relaxed drop-shadow-xs">
            Urus keperluan administrasi kependudukan, buat surat resmi, dan sampaikan aspirasi warga dengan cepat langsung dari ponsel Anda.
          </p>

          {/* Dua Tombol CTA Utama (Buat Surat & Sampaikan Pengaduan) */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
            <Link
              href="/surat"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold text-base sm:text-lg shadow-lg hover:shadow-amber-500/30 transition-all duration-200 active:scale-98"
            >
              <FileText className="w-5 h-5 text-emerald-950 stroke-[2.5]" />
              <span>Buat Surat Online</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/pengaduan"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 font-bold text-base sm:text-lg shadow-md transition-all duration-200 active:scale-98"
            >
              <MessageSquareWarning className="w-5 h-5 text-amber-300" />
              <span>Sampaikan Pengaduan</span>
            </Link>
          </div>

          {/* Kartu Kaca Jam Pelayanan Hari Ini */}
          <div className="mt-10 sm:mt-12 w-full max-w-md p-3.5 sm:p-4 rounded-2xl bg-emerald-900/60 backdrop-blur-md border border-white/20 text-white shadow-xl flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  todayStatus.isOpen ? "bg-emerald-500/30 text-emerald-300" : "bg-amber-500/30 text-amber-300"
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                    Pelayanan {todayStatus.dayName}
                  </span>
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      todayStatus.isOpen ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                    }`}
                  />
                </div>
                <p className="text-sm font-bold text-white">{todayStatus.hours}</p>
              </div>
            </div>

            <Link
              href="/layanan-mandiri"
              className="text-xs text-amber-300 hover:text-amber-200 font-semibold underline shrink-0"
            >
              Layanan WA &rarr;
            </Link>
          </div>
        </div>

        {/* Decorative Wave Divider at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 leading-none">
          <svg
            className="w-full h-8 sm:h-14 text-emerald-50 dark:text-emerald-950/80 fill-current"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 2. BENTO GRID LAYANAN WARGA */}
      <section className="py-16 sm:py-24 bg-emerald-50/60 dark:bg-emerald-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-3.5 py-1 rounded-full border border-emerald-200/60">
              Pelayanan Terpadu
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-emerald-950 dark:text-white mt-3 tracking-tight">
              Layanan Cepat Untuk Seluruh Warga
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
              Pilih kebutuhan administrasi Anda. Seluruh proses dirancang sederhana dan dapat diakses dari perangkat mana pun.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Bento Card 1 (Large - 2 cols): Surat Online */}
            <div className="md:col-span-2 rounded-3xl bg-white dark:bg-emerald-900/30 p-6 sm:p-8 border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-800/20 group-hover:scale-105 transition-transform">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
                    Paling Sering Digunakan
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-white">
                  Permohonan Surat Keterangan Online
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
                  Ajukan Surat Domisili, SKTM, Pengantar KTP/KK, Keterangan Usaha (SKU), dan SKCK tanpa perlu antre di balai desa. Isi data, pantau prosesnya, lalu cetak langsung saat siap.
                </p>

                {/* Sub Features Chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    "Surat Domisili",
                    "SKTM",
                    "Pengantar SKCK",
                    "Keterangan Usaha",
                    "Pengantar KTP/KK",
                  ].map((s) => (
                    <span
                      key={s}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-emerald-950/60 text-gray-700 dark:text-gray-300"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-emerald-800/30 flex items-center justify-between">
                <Link
                  href="/surat"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-xs transition-colors"
                >
                  <span>Mulai Isi Form Surat</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/surat/saya"
                  className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:underline"
                >
                  Lihat Surat Saya &rarr;
                </Link>
              </div>
            </div>

            {/* Bento Card 2: Pengaduan Warga */}
            <div className="rounded-3xl bg-white dark:bg-emerald-900/30 p-6 sm:p-7 border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-emerald-950 flex items-center justify-center mb-5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <MessageSquareWarning className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-emerald-950 dark:text-white">
                  Pengaduan & Aspirasi
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                  Lapor jalan rusak, lampu PJU mati, saluran air tersumbat, atau keluhan layanan. Tersedia opsi kirim anonim.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-emerald-800/30">
                <Link
                  href="/pengaduan"
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold text-sm transition-colors border border-amber-200/50"
                >
                  <span>Kirim Laporan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Bento Card 3: Layanan Mandiri WhatsApp */}
            <div className="rounded-3xl bg-white dark:bg-emerald-900/30 p-6 sm:p-7 border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-5 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                  <PhoneForwarded className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-emerald-950 dark:text-white">
                  Layanan Mandiri WhatsApp
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                  Satu-ketuk terhubung ke WhatsApp kantor desa dengan pesan otomatis siap kirim. Cepat dan bebas ribet.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-emerald-800/30">
                <Link
                  href="/layanan-mandiri"
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-bold text-sm transition-colors border border-emerald-200/50"
                >
                  <span>Buka Menu WA</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Bento Card 4 (Full width banner / Lacak Berkas Cepat): */}
            <div className="md:col-span-3 lg:col-span-4 rounded-3xl bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/70 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pelacakan Real-Time</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black">
                  Sudah Mengajukan Surat atau Pengaduan?
                </h3>
                <p className="text-sm text-emerald-200/90 max-w-xl">
                  Gunakan kode tiket permohonan Anda (contoh: <code className="bg-emerald-800/80 px-2 py-0.5 rounded text-amber-300 font-mono">SRT-2026-0001</code> atau <code className="bg-emerald-800/80 px-2 py-0.5 rounded text-amber-300 font-mono">PGD-2026-0001</code>) untuk mengetahui tahapan berkas.
                </p>
              </div>

              <Link
                href="/lacak"
                className="shrink-0 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold text-sm shadow-md transition-all active:scale-98 flex items-center gap-2"
              >
                <span>Lacak Berkas Sekarang</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CARA KERJA DALAM 3 LANGKAH (Numbered with Connecting Lines) */}
      <section className="py-16 sm:py-24 bg-white dark:bg-emerald-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-3.5 py-1 rounded-full border border-emerald-200/60">
              Alur Sangat Mudah
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-emerald-950 dark:text-white mt-3 tracking-tight">
              3 Langkah Praktis Mengurus Kebutuhan Desa
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
              Tidak perlu membuang waktu bolak-balik ke kantor desa jika berkas belum siap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-900/5 dark:border-emerald-800/30">
              <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-800/20 mb-5 relative z-10">
                1
              </div>
              <h3 className="text-lg font-extrabold text-emerald-950 dark:text-white">
                Pilih Layanan & Isi Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                Pilih jenis surat yang dibutuhkan atau tuliskan pengaduan Anda lewat form ramah HP dalam hitungan menit.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-900/5 dark:border-emerald-800/30">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-emerald-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20 mb-5 relative z-10">
                2
              </div>
              <h3 className="text-lg font-extrabold text-emerald-950 dark:text-white">
                Diverifikasi Pamong Desa
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                Petugas balai desa memvalidasi identitas NIK dan memproses draf dokumen resmi dengan tanda tangan sah.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-900/5 dark:border-emerald-800/30">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-600/20 mb-5 relative z-10">
                3
              </div>
              <h3 className="text-lg font-extrabold text-emerald-950 dark:text-white">
                Notifikasi & Pengambilan
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                Dapatkan notifikasi di website begitu surat siap. Surat dapat langsung dicetak online atau diambil di kantor desa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROFIL SINGKAT DESA DENGAN STATISTIK ANIMATED COUNTER */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-950 to-emerald-900 text-white relative overflow-hidden">
        {/* Subtle Map Silhouette or Decorative circles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber-400 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left text profile */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/70 border border-emerald-700 text-amber-300 text-xs font-bold">
                <Compass className="w-3.5 h-3.5" />
                <span>Sekilas Profil Desa</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Mengenal Lebih Dekat {villageConfig.name}
              </h2>
              <p className="text-sm sm:text-base text-emerald-200/90 leading-relaxed">
                Desa Karangwaluh merupakan salah satu dari 12 desa berdaya di Kecamatan Sampung, Kabupaten Ponorogo, Jawa Timur. Terkenal dengan keramahan warganya, udara perbukitan yang segar, panorama persawahan hijau, dan potensi UMKM olahan lokal seperti keripik dan madu murni.
              </p>
              <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-emerald-300 uppercase tracking-wider font-semibold">
                    Kepemimpinan Desa
                  </p>
                  <p className="text-base font-extrabold text-white">
                    {villageConfig.headOfVillage.name}
                  </p>
                  <p className="text-xs text-emerald-200">
                    {villageConfig.headOfVillage.title} ({villageConfig.headOfVillage.period})
                  </p>
                </div>
              </div>
            </div>

            {/* Right animated counter grid */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {/* Stat 1: Penduduk */}
              <div className="p-5 sm:p-6 rounded-3xl bg-emerald-900/50 backdrop-blur-xs border border-emerald-700/40 text-center hover:bg-emerald-900/70 transition-colors">
                <Users className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-3xl sm:text-4xl font-black text-white">
                  <StatCounter end={villageConfig.statistics.population} suffix="+" />
                </div>
                <p className="text-xs sm:text-sm text-emerald-200 font-semibold mt-1">
                  Jumlah Penduduk (Jiwa)
                </p>
                <span className="text-[10px] text-emerald-400 block mt-1">Data BPS Sampung</span>
              </div>

              {/* Stat 2: Luas Wilayah */}
              <div className="p-5 sm:p-6 rounded-3xl bg-emerald-900/50 backdrop-blur-xs border border-emerald-700/40 text-center hover:bg-emerald-900/70 transition-colors">
                <MapPin className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-3xl sm:text-4xl font-black text-white">
                  <StatCounter end={villageConfig.statistics.areaKm2} suffix=" km²" />
                </div>
                <p className="text-xs sm:text-sm text-emerald-200 font-semibold mt-1">
                  Luas Wilayah Desa
                </p>
                <span className="text-[10px] text-emerald-400 block mt-1">Kecamatan Sampung</span>
              </div>

              {/* Stat 3: Kepala Keluarga */}
              <div className="p-5 sm:p-6 rounded-3xl bg-emerald-900/50 backdrop-blur-xs border border-emerald-700/40 text-center hover:bg-emerald-900/70 transition-colors">
                <Building2 className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-3xl sm:text-4xl font-black text-white">
                  <StatCounter end={villageConfig.statistics.families} suffix="" />
                </div>
                <p className="text-xs sm:text-sm text-emerald-200 font-semibold mt-1">
                  Kepala Keluarga (KK)
                </p>
                <span className="text-[10px] text-emerald-400 block mt-1">Komunitas Rukun</span>
              </div>

              {/* Stat 4: Rukun Tetangga */}
              <div className="p-5 sm:p-6 rounded-3xl bg-emerald-900/50 backdrop-blur-xs border border-emerald-700/40 text-center hover:bg-emerald-900/70 transition-colors">
                <Compass className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-3xl sm:text-4xl font-black text-white">
                  <StatCounter end={villageConfig.statistics.neighborhoodUnits} suffix=" RT" />
                </div>
                <p className="text-xs sm:text-sm text-emerald-200 font-semibold mt-1">
                  Rukun Tetangga (RT)
                </p>
                <span className="text-[10px] text-emerald-400 block mt-1">Dalam 3 Dukuh</span>
              </div>

              {/* Stat 5: Rukun Warga */}
              <div className="p-5 sm:p-6 rounded-3xl bg-emerald-900/50 backdrop-blur-xs border border-emerald-700/40 text-center hover:bg-emerald-900/70 transition-colors">
                <ShieldCheck className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-3xl sm:text-4xl font-black text-white">
                  <StatCounter end={villageConfig.statistics.citizenUnits} suffix=" RW" />
                </div>
                <p className="text-xs sm:text-sm text-emerald-200 font-semibold mt-1">
                  Rukun Warga (RW)
                </p>
                <span className="text-[10px] text-emerald-400 block mt-1">Koordinasi Wilayah</span>
              </div>

              {/* Stat 6: UMKM Aktif */}
              <div className="p-5 sm:p-6 rounded-3xl bg-emerald-900/50 backdrop-blur-xs border border-emerald-700/40 text-center hover:bg-emerald-900/70 transition-colors">
                <Store className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-3xl sm:text-4xl font-black text-white">
                  <StatCounter end={villageConfig.statistics.activeUmkm} suffix="+" />
                </div>
                <p className="text-xs sm:text-sm text-emerald-200 font-semibold mt-1">
                  Sentra UMKM Aktif
                </p>
                <span className="text-[10px] text-emerald-400 block mt-1">Olahan Pangan & Kriya</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GALERI FOTO DESA (Masonry Layout & Lightbox) */}
      <section className="py-16 sm:py-24 bg-white dark:bg-emerald-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-3.5 py-1 rounded-full border border-emerald-200/60">
              Dokumentasi Desa
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-emerald-950 dark:text-white mt-3 tracking-tight">
              Galeri Keindahan & Kegiatan Karangwaluh
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
              Klik pada foto untuk melihat ukuran penuh dan penjelasan suasana desa.
            </p>
          </div>

          {/* Interactive Lightbox Component */}
          <GalleryLightbox items={villageGallery} />
        </div>
      </section>

      {/* 6. PRODUK LOKAL DESA (UMKM Khas Karangwaluh) */}
      <section id="produk-umkm" className="py-16 sm:py-24 bg-emerald-50/70 dark:bg-emerald-950/40 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3.5 py-1 rounded-full border border-amber-300/60">
              Potensi Ekonomi Desa
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-emerald-950 dark:text-white mt-3 tracking-tight">
              Produk Olahan Lokal & Kriya Karangwaluh
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
              Dukung kemajuan ekonomi warga dengan membeli produk asli buatan tangan dan kebun Desa Karangwaluh, Sampung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {localProducts.map((product) => {
              const waUrl = formatWhatsAppUrl(product.whatsappNumber, product.orderMessage);
              return (
                <div
                  key={product.id}
                  className="rounded-3xl bg-white dark:bg-emerald-900/30 overflow-hidden border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative aspect-4/3 w-full bg-emerald-100 dark:bg-emerald-950/60 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-emerald-950/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-emerald-900 dark:text-emerald-200 shadow-xs">
                        {product.category}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-amber-500 text-emerald-950 px-3 py-1 rounded-xl text-xs font-extrabold shadow-md">
                        {product.priceEstimate}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-6">
                      <h3 className="text-lg font-black text-emerald-950 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mt-1">
                        Pengrajin: {product.sellerName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-3 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Order via WhatsApp Button */}
                  <div className="p-6 pt-0">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-xs transition-all active:scale-98"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-300" />
                      <span>Hubungi Penjual via WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. PENGUMUMAN & BERITA TERKINI */}
      <section className="py-16 sm:py-24 bg-white dark:bg-emerald-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-3.5 py-1 rounded-full border border-emerald-200/60">
                Kabar Warga
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-emerald-950 dark:text-white mt-3 tracking-tight">
                Pengumuman & Agenda Desa
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Informasi resmi dari Balai Desa Karangwaluh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {villageNews.map((news) => (
              <div
                key={news.id}
                className="p-6 rounded-3xl bg-emerald-50/40 dark:bg-emerald-900/20 border border-emerald-900/10 dark:border-emerald-800/30 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                      {news.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {news.date}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-emerald-950 dark:text-white">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2.5 leading-relaxed">
                    {news.summary}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-gray-200/60 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between">
                  <span>Oleh: {news.author}</span>
                  <span>Baca Rincian &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. KONTAK, JAM PELAYANAN, DAN PETA EMBED */}
      <section className="py-16 sm:py-24 bg-emerald-50/80 dark:bg-emerald-950/40 border-t border-emerald-900/10 dark:border-emerald-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Lokasi & Info Kantor Balai Desa */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-3.5 py-1 rounded-full border border-emerald-200/60">
                  Lokasi & Kontak
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-emerald-950 dark:text-white mt-3 tracking-tight">
                  Kantor & Balai Desa Karangwaluh
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                  Kami siap menyambut warga untuk pelayanan tatap muka maupun konsultasi administrasi kependudukan.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-emerald-900/40 border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950 dark:text-white">Alamat Resmi</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                      {villageConfig.address}
                    </p>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 font-mono mt-1">
                      Koordinat: 7°51′24″ S, 111°21′07″ E
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-emerald-900/40 border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950 dark:text-white">Jam Buka Kantor</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                      {villageConfig.serviceHours.weekdays}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {villageConfig.serviceHours.friday}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={villageConfig.coordinates.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-xs transition-all active:scale-98"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Petunjuk Arah Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Peta Embed OpenStreetMap */}
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-16/10 rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-emerald-900/60 bg-emerald-100">
                <iframe
                  title="Peta Balai Desa Karangwaluh"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={villageConfig.coordinates.embedMapUrl}
                  className="w-full h-full"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-emerald-950/90 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-950 dark:text-white shadow-md flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                  <span>Titik Balai Desa Karangwaluh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
