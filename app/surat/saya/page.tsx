"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Search, ArrowRight, Lock } from "lucide-react";

export default function SuratSayaPage() {
  const router = useRouter();

  useEffect(() => {
    // Otomatis arahkan ke halaman lacak resmi demi perlindungan privasi data warga
    const timer = setTimeout(() => {
      router.replace("/lacak");
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 flex items-center justify-center bg-emerald-50/40 dark:bg-emerald-950/20">
      <div className="max-w-md w-full bg-white dark:bg-emerald-900/40 p-8 sm:p-10 rounded-3xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xl text-center space-y-5 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-800/60 text-emerald-800 dark:text-emerald-200 flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200/60">
            <Lock className="w-3 h-3" />
            <span>Perlindungan Data Pribadi Warga</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-white">
            Privasi Warga Terlindungi
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Demi menjaga kerahasiaan NIK dan jenis surat yang Anda ajukan, daftar surat <strong>tidak dipublikasikan secara terbuka</strong>.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Silakan pantau status permohonan Anda menggunakan <strong>Nomor Registrasi pribadi</strong> di menu Lacak Status.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/lacak"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all active:scale-98"
          >
            <Search className="w-4 h-4 text-amber-300" />
            <span>Buka Lacak Status Surat</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-[11px] text-gray-400">
          Mengalihkan otomatis ke halaman lacak...
        </p>
      </div>
    </div>
  );
}
