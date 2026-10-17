"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Printer,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { getLetters } from "@/lib/storage";
import { LetterRequest } from "@/lib/types";
import { formatDateIndo } from "@/lib/utils";

export default function SuratSayaPage() {
  const [letters, setLetters] = useState<LetterRequest[]>([]);
  const [filter, setFilter] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    function load() {
      setLetters(getLetters());
    }
    load();

    window.addEventListener("village-storage-update", load);
    return () => window.removeEventListener("village-storage-update", load);
  }, []);

  const filteredLetters = letters.filter((l) => {
    const matchFilter = filter === "Semua" || l.status === filter;
    const matchSearch =
      l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.letterType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.applicant.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-emerald-50/40 dark:bg-emerald-950/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-3.5 py-1 rounded-full border border-emerald-200/60">
              Riwayat Warga
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-white mt-2">
              Daftar Permohonan Surat Saya
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Pantau perkembangan dan cetak surat yang telah disetujui pamong desa.
            </p>
          </div>

          <Link
            href="/surat"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm shadow-md transition-all active:scale-98 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Ajukan Surat Baru</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-emerald-900/30 p-4 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode atau nama..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-xs sm:text-sm"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {["Semua", "Diajukan", "Diverifikasi", "Diproses", "Siap Diambil"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === cat
                    ? "bg-emerald-800 text-white"
                    : "bg-gray-100 dark:bg-emerald-950/60 text-gray-600 dark:text-gray-300 hover:bg-emerald-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List of Letters */}
        {filteredLetters.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-emerald-900/20 border border-emerald-900/10 dark:border-emerald-800/30">
            <FileText className="w-12 h-12 text-gray-300 dark:text-emerald-800 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700 dark:text-gray-300">
              Belum Ada Surat Terdaftar
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Anda belum memiliki permohonan surat dalam kategori ini. Silakan buat permohonan baru untuk memulai.
            </p>
            <div className="mt-5">
              <Link
                href="/surat"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
              >
                <span>Mulai Buat Surat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLetters.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-emerald-900/30 rounded-2xl p-5 sm:p-6 border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/50">
                      {item.id}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDateIndo(item.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-emerald-950 dark:text-white">
                    {item.letterType}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Pemohon: <strong>{item.applicant.name}</strong> • NIK: {item.applicant.nik}
                  </p>

                  {item.officerNote && (
                    <p className="text-xs text-amber-800 dark:text-amber-300 italic bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg inline-block border border-amber-200/40">
                      Catatan pamong: "{item.officerNote}"
                    </p>
                  )}
                </div>

                {/* Right Status & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      item.status === "Siap Diambil"
                        ? "bg-amber-400 text-emerald-950 font-black animate-pulse"
                        : item.status === "Diproses"
                        ? "bg-blue-100 text-blue-900"
                        : item.status === "Diverifikasi"
                        ? "bg-purple-100 text-purple-900"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>

                  {item.status === "Siap Diambil" ? (
                    <Link
                      href={`/surat/cetak/${item.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Surat</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/lacak?kode=${item.id}`}
                      className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Lacak Tahapan</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
