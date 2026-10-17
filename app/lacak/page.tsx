"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MessageSquareWarning,
  ArrowRight,
  ShieldAlert,
  Calendar,
  MapPin,
  User,
  Printer,
  ChevronRight,
  Building2,
} from "lucide-react";
import { getComplaintById, getLetterById } from "@/lib/storage";
import { ComplaintTicket, LetterRequest } from "@/lib/types";
import { formatDateIndo, maskNik, maskName, maskPhone } from "@/lib/utils";

function LacakContent() {
  const searchParams = useSearchParams();
  const initialKode = searchParams.get("kode") || "";

  const [inputCode, setInputCode] = useState(initialKode);
  const [complaintResult, setComplaintResult] = useState<ComplaintTicket | null>(null);
  const [letterResult, setLetterResult] = useState<LetterRequest | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function performSearch(codeToSearch: string) {
    const clean = codeToSearch.trim().toUpperCase();
    if (!clean) {
      setErrorMsg("Silakan ketikkan kode tiket atau permohonan terlebih dahulu.");
      return;
    }

    setErrorMsg(null);
    setHasSearched(true);

    if (clean.startsWith("PGD")) {
      const found = getComplaintById(clean);
      setComplaintResult(found || null);
      setLetterResult(null);
      if (!found) {
        setErrorMsg(`Pengaduan dengan nomor "${clean}" tidak ditemukan di database demo perangkat ini.`);
      }
    } else if (clean.startsWith("SRT")) {
      const found = getLetterById(clean);
      setLetterResult(found || null);
      setComplaintResult(null);
      if (!found) {
        setErrorMsg(`Surat permohonan dengan kode "${clean}" tidak ditemukan di database demo perangkat ini.`);
      }
    } else {
      // Cek dua-duanya
      const cFound = getComplaintById(clean);
      if (cFound) {
        setComplaintResult(cFound);
        setLetterResult(null);
        return;
      }
      const lFound = getLetterById(clean);
      if (lFound) {
        setLetterResult(lFound);
        setComplaintResult(null);
        return;
      }
      setErrorMsg(`Kode "${clean}" tidak ditemukan. Pastikan format diawali dengan PGD- atau SRT- (contoh: PGD-2026-0001 atau SRT-2026-0001).`);
      setComplaintResult(null);
      setLetterResult(null);
    }
  }

  useEffect(() => {
    if (initialKode) {
      performSearch(initialKode);
    }
  }, [initialKode]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    performSearch(inputCode);
  }

  // Stepper Pengaduan: Diterima -> Diproses -> Selesai
  const complaintSteps: ("Diterima" | "Diproses" | "Selesai")[] = ["Diterima", "Diproses", "Selesai"];

  // Stepper Surat: Diajukan -> Diverifikasi -> Diproses -> Siap Diambil
  const letterSteps: ("Diajukan" | "Diverifikasi" | "Diproses" | "Siap Diambil")[] = [
    "Diajukan",
    "Diverifikasi",
    "Diproses",
    "Siap Diambil",
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-emerald-50/40 dark:bg-emerald-950/20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-3.5 py-1 rounded-full border border-emerald-200/60">
            Pusat Pelacakan Berkas
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-emerald-950 dark:text-white mt-3 tracking-tight">
            Lacak Status Surat & Pengaduan
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Masukkan kode tiket laporan atau permohonan surat Anda untuk melihat posisi penanganan berkas secara real-time.
          </p>
        </div>

        {/* Form Input Kode */}
        <div className="bg-white dark:bg-emerald-900/30 p-4 sm:p-6 rounded-3xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Ketik kode (Contoh: PGD-2026-0001 atau SRT-2026-0001)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/60 dark:text-white text-sm sm:text-base font-mono uppercase focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm sm:text-base shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Lacak Berkas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Code helper chips */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-emerald-800/40 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-500 dark:text-gray-400">Contoh kode demo:</span>
            <button
              type="button"
              onClick={() => {
                setInputCode("PGD-2026-0001");
                performSearch("PGD-2026-0001");
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-200 font-mono font-semibold"
            >
              PGD-2026-0001
            </button>
            <button
              type="button"
              onClick={() => {
                setInputCode("SRT-2026-0001");
                performSearch("SRT-2026-0001");
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-mono font-semibold"
            >
              SRT-2026-0001
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm flex items-start gap-3 mb-8">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Pencarian Tidak Ditemukan</p>
              <p className="text-xs mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* HASIL 1: PENGADUAN */}
        {complaintResult && (
          <div className="bg-white dark:bg-emerald-900/30 rounded-3xl p-6 sm:p-8 border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm space-y-8 animate-fade-in">
            {/* Header Laporan */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-emerald-800/40">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    Pengaduan Warga
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    {formatDateIndo(complaintResult.createdAt)}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-white mt-1">
                  Nomor Tiket: <span className="font-mono text-emerald-800 dark:text-emerald-300">{complaintResult.id}</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Kategori: <strong>{complaintResult.category}</strong> • Lokasi: {complaintResult.location}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1.5 rounded-xl font-extrabold text-sm bg-emerald-800 text-white shadow-xs">
                  {complaintResult.status}
                </span>
              </div>
            </div>

            {/* STEPPER STATUS PENGADUAN */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-6">
                Tahapan Penanganan Laporan:
              </h3>
              <div className="relative flex items-center justify-between">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-emerald-950 -translate-y-1/2 z-0" />

                {complaintSteps.map((step, idx) => {
                  const currentIdx = complaintSteps.indexOf(complaintResult.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                          isCompleted
                            ? "bg-emerald-800 text-white ring-4 ring-emerald-100 dark:ring-emerald-900"
                            : "bg-gray-200 dark:bg-emerald-950 text-gray-400 border border-gray-300"
                        } ${isCurrent ? "scale-115 ring-amber-400" : ""}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-xs font-bold mt-2 ${
                          isCompleted
                            ? "text-emerald-900 dark:text-emerald-300"
                            : "text-gray-400"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail Isi & Catatan Petugas */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-emerald-800/40">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200/60 dark:border-emerald-800/40">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Uraian Laporan
                </h4>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 leading-relaxed">
                  {complaintResult.description}
                </p>
                {complaintResult.photoUrl && (
                  <div className="mt-3">
                    <span className="text-xs text-gray-500 block mb-1">Foto Bukti Lampiran:</span>
                    <div className="relative w-40 h-32 rounded-xl overflow-hidden border">
                      <Image
                        src={complaintResult.photoUrl}
                        alt="Foto bukti aduan"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {complaintResult.officerNote && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 text-amber-950 dark:text-amber-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    Catatan Resmi Pamong Desa:
                  </h4>
                  <p className="text-sm mt-1 leading-relaxed font-medium">
                    "{complaintResult.officerNote}"
                  </p>
                </div>
              )}
            </div>

            {/* Riwayat Log Waktu */}
            <div className="pt-4 border-t border-gray-100 dark:border-emerald-800/40">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Riwayat Log Aktivitas
              </h4>
              <div className="space-y-3">
                {complaintResult.history.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {h.note}
                      </p>
                      <p className="text-gray-400 mt-0.5">{formatDateIndo(h.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HASIL 2: SURAT ONLINE */}
        {letterResult && (
          <div className="bg-white dark:bg-emerald-900/30 rounded-3xl p-6 sm:p-8 border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm space-y-8 animate-fade-in">
            {/* Header Surat */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-emerald-800/40">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                    Permohonan Surat
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    {formatDateIndo(letterResult.createdAt)}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-white mt-1">
                  {letterResult.letterType}
                </h2>
                <p className="text-xs font-mono text-emerald-800 dark:text-emerald-300 mt-0.5 font-bold">
                  Kode Registrasi: {letterResult.id}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>
                    Pemohon: <strong className="text-gray-800 dark:text-gray-200">{maskName(letterResult.applicant.name)}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    NIK: <strong className="font-mono text-gray-800 dark:text-gray-200">{maskNik(letterResult.applicant.nik)}</strong>
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50">
                    🔒 Data Pribadi Tersensor
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-3.5 py-1.5 rounded-xl font-extrabold text-sm ${
                    letterResult.status === "Siap Diambil"
                      ? "bg-amber-500 text-emerald-950 shadow-md animate-pulse"
                      : "bg-emerald-800 text-white"
                  }`}
                >
                  {letterResult.status}
                </span>
              </div>
            </div>

            {/* STEPPER STATUS SURAT (Diajukan -> Diverifikasi -> Diproses -> Siap Diambil) */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-6">
                Tahapan Pengurusan Surat:
              </h3>
              <div className="relative flex items-center justify-between">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-emerald-950 -translate-y-1/2 z-0" />

                {letterSteps.map((step, idx) => {
                  const currentIdx = letterSteps.indexOf(letterResult.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                          isCompleted
                            ? "bg-emerald-800 text-white ring-4 ring-emerald-100 dark:ring-emerald-900"
                            : "bg-gray-200 dark:bg-emerald-950 text-gray-400 border border-gray-300"
                        } ${isCurrent ? "scale-115 ring-amber-400 bg-amber-500 text-emerald-950" : ""}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-bold mt-2 text-center max-w-[70px] sm:max-w-none ${
                          isCompleted
                            ? "text-emerald-900 dark:text-emerald-300"
                            : "text-gray-400"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Catatan dan Tindakan Surat */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-emerald-800/40">
              {letterResult.officerNote && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                    Pemberitahuan Pamong Desa:
                  </h4>
                  <p className="text-sm mt-1 leading-relaxed font-medium">
                    "{letterResult.officerNote.replace(/atau unduh cetak digital\.?/gi, "pada jam kerja kantor desa.")}"
                  </p>
                </div>
              )}

              {/* Petunjuk Pengambilan Fisik: Jika surat sudah Siap Diambil */}
              {letterResult.status === "Siap Diambil" && (
                <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 text-xs font-bold">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
                      <span>Surat Fisik Siap Diambil</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-emerald-950 dark:text-white mt-1">
                      Silakan Ambil Dokumen di Balai Desa
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Surat fisik resmi telah selesai dicetak, ditandatangani Kepala Desa, dan dibubuhi stempel basah resmi.
                    </p>
                    <div className="pt-2 text-xs text-emerald-900 dark:text-emerald-200 font-semibold space-y-0.5">
                      <p>📍 <strong>Lokasi:</strong> Meja Pelayanan Kantor Balai Desa Karangwaluh</p>
                      <p>🕒 <strong>Jam Layanan:</strong> Senin – Kamis (08.00 – 15.00 WIB) | Jumat (08.00 – 14.30 WIB)</p>
                      <p>🔖 <strong>No. Registrasi:</strong> <span className="font-mono font-bold text-amber-700 dark:text-amber-300">{letterResult.id}</span></p>
                    </div>
                  </div>
                  <div className="shrink-0 w-full sm:w-auto">
                    <div className="px-4 py-3 rounded-xl bg-amber-400 text-emerald-950 text-xs font-black text-center shadow-xs">
                      Tunjukkan Kode Permohonan:
                      <span className="block font-mono text-sm tracking-wide mt-0.5">{letterResult.id}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Riwayat Surat */}
            <div className="pt-4 border-t border-gray-100 dark:border-emerald-800/40">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Riwayat Permohonan
              </h4>
              <div className="space-y-3">
                {letterResult.history.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {h.note.replace(/atau unduh cetak digital\.?/gi, "pada jam kerja kantor desa.").replace(/atau cetak online/gi, "")}
                      </p>
                      <p className="text-gray-400 mt-0.5">{formatDateIndo(h.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LacakPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center text-sm">Memuat pelacak...</div>}>
      <LacakContent />
    </Suspense>
  );
}
