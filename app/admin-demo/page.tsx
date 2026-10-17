"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  MessageSquareWarning,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Send,
} from "lucide-react";
import {
  getLetters,
  getComplaints,
  updateLetterStatus,
  updateComplaintStatus,
  resetDemoData,
} from "@/lib/storage";
import { LetterRequest, ComplaintTicket, LetterStatus, ComplaintStatus } from "@/lib/types";
import { formatDateIndo } from "@/lib/utils";

export default function AdminDemoPage() {
  const [activeTab, setActiveTab] = useState<"surat" | "pengaduan">("surat");
  const [letters, setLetters] = useState<LetterRequest[]>([]);
  const [complaints, setComplaints] = useState<ComplaintTicket[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Note inputs state per item
  const [letterNotes, setLetterNotes] = useState<Record<string, string>>({});
  const [complaintNotes, setComplaintNotes] = useState<Record<string, string>>({});

  function refreshData() {
    setLetters(getLetters());
    setComplaints(getComplaints());
  }

  useEffect(() => {
    refreshData();
    window.addEventListener("village-storage-update", refreshData);
    return () => window.removeEventListener("village-storage-update", refreshData);
  }, []);

  function triggerToast(msg: string) {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  }

  function handleLetterStatusChange(id: string, newStatus: LetterStatus) {
    const note = letterNotes[id] || undefined;
    updateLetterStatus(id, newStatus, note);
    triggerToast(`Status surat ${id} berhasil diubah ke: ${newStatus}`);
    refreshData();
  }

  function handleComplaintStatusChange(id: string, newStatus: ComplaintStatus) {
    const note = complaintNotes[id] || undefined;
    updateComplaintStatus(id, newStatus, note);
    triggerToast(`Status pengaduan ${id} berhasil diubah ke: ${newStatus}`);
    refreshData();
  }

  function handleReset() {
    if (confirm("Reset seluruh data demo ke kondisi bawaan awal?")) {
      resetDemoData();
      triggerToast("Data demo berhasil direset ke kondisi awal.");
      refreshData();
    }
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-amber-50/30 dark:bg-emerald-950/20">
      <div className="max-w-5xl mx-auto">
        {/* Banner Simulasi Petugas */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 shadow-lg mb-8 border border-amber-400">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                    Simulasi Petugas Desa (Mode Demo)
                  </h1>
                  <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-emerald-950 text-amber-300">
                    Bukan Admin Asli
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-950/90 mt-0.5 font-medium leading-relaxed">
                  Panel khusus presentasi untuk mengubah status permohonan surat & pengaduan. Semua data disimpan secara lokal di peramban ini (*localStorage*).
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-bold text-xs shadow-md transition-all active:scale-98 shrink-0 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data Demo</span>
            </button>
          </div>
        </div>

        {/* Floating Success Toast */}
        {successToast && (
          <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-emerald-800 text-white shadow-xl border border-emerald-600 flex items-center gap-3 animate-in slide-in-from-right duration-200">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{successToast}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-emerald-800 pb-2">
          <button
            onClick={() => setActiveTab("surat")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-extrabold transition-all ${
              activeTab === "surat"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white dark:bg-emerald-900/30 text-gray-700 dark:text-gray-300 hover:bg-emerald-50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Permohonan Surat ({letters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("pengaduan")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-extrabold transition-all ${
              activeTab === "pengaduan"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white dark:bg-emerald-900/30 text-gray-700 dark:text-gray-300 hover:bg-emerald-50"
            }`}
          >
            <MessageSquareWarning className="w-4 h-4" />
            <span>Pengaduan Warga ({complaints.length})</span>
          </button>
        </div>

        {/* TAB 1: MANAJEMEN SURAT */}
        {activeTab === "surat" && (
          <div className="space-y-5">
            {letters.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-emerald-900/30 rounded-3xl p-6 border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-emerald-800/40">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/50">
                        {item.id}
                      </span>
                      <span className="text-xs text-gray-500">{formatDateIndo(item.createdAt)}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-emerald-950 dark:text-white mt-1">
                      {item.letterType}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Pemohon: <strong>{item.applicant.name}</strong> • NIK: {item.applicant.nik} • WA: {item.applicant.phone}
                    </p>
                    <p className="text-xs text-gray-500 italic mt-0.5">
                      Keperluan: "{item.applicant.purpose}"
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Status Saat Ini:
                    </span>
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        item.status === "Siap Diambil"
                          ? "bg-amber-400 text-emerald-950 font-black animate-pulse"
                          : "bg-emerald-800 text-white"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Input Catatan Petugas */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Catatan Petugas (Akan Tampil di Notifikasi Warga):
                  </label>
                  <input
                    type="text"
                    value={letterNotes[item.id] !== undefined ? letterNotes[item.id] : item.officerNote || ""}
                    onChange={(e) =>
                      setLetterNotes({ ...letterNotes, [item.id]: e.target.value })
                    }
                    placeholder="Contoh: Surat sudah ditandatangani Kepala Desa Sukeni dan siap diambil di meja pelayanan."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-xs sm:text-sm"
                  />
                </div>

                {/* Tombol Pengubah Status */}
                <div>
                  <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Ubah Status ke:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(["Diajukan", "Diverifikasi", "Diproses", "Siap Diambil"] as LetterStatus[]).map(
                      (st) => {
                        const isCurrent = item.status === st;
                        return (
                          <button
                            key={st}
                            onClick={() => handleLetterStatusChange(item.id, st)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                              isCurrent
                                ? "bg-emerald-800 text-white ring-2 ring-emerald-600 shadow-xs"
                                : "bg-gray-100 dark:bg-emerald-950/60 text-gray-700 dark:text-gray-300 hover:bg-emerald-100"
                            }`}
                          >
                            {st} {isCurrent && "✓"}
                          </button>
                        );
                      }
                    )}

                    {item.status === "Siap Diambil" && (
                      <Link
                        href={`/surat/cetak/${item.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-black shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Lihat Dokumen Cetak</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: MANAJEMEN PENGADUAN */}
        {activeTab === "pengaduan" && (
          <div className="space-y-5">
            {complaints.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-emerald-900/30 rounded-3xl p-6 border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-emerald-800/40">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200/50">
                        {item.id}
                      </span>
                      <span className="text-xs text-gray-500">{formatDateIndo(item.createdAt)}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-emerald-950 dark:text-white mt-1">
                      Kategori: {item.category}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Pelapor: <strong>{item.reporterName}</strong> • Lokasi: {item.location} • Kontak: {item.phone}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-200 mt-1 bg-gray-50 dark:bg-emerald-950/50 p-2.5 rounded-xl">
                      "{item.description}"
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Status Saat Ini:
                    </span>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-800 text-white">
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Input Catatan Petugas */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Tanggapan Pamong Desa:
                  </label>
                  <input
                    type="text"
                    value={
                      complaintNotes[item.id] !== undefined
                        ? complaintNotes[item.id]
                        : item.officerNote || ""
                    }
                    onChange={(e) =>
                      setComplaintNotes({ ...complaintNotes, [item.id]: e.target.value })
                    }
                    placeholder="Contoh: Tim pemeliharaan jalan telah meninjau lokasi dan material siap dipasang besok."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-xs sm:text-sm"
                  />
                </div>

                {/* Tombol Pengubah Status */}
                <div>
                  <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Ubah Status ke:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(["Diterima", "Diproses", "Selesai"] as ComplaintStatus[]).map((st) => {
                      const isCurrent = item.status === st;
                      return (
                        <button
                          key={st}
                          onClick={() => handleComplaintStatusChange(item.id, st)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isCurrent
                              ? "bg-emerald-800 text-white ring-2 ring-emerald-600 shadow-xs"
                              : "bg-gray-100 dark:bg-emerald-950/60 text-gray-700 dark:text-gray-300 hover:bg-emerald-100"
                          }`}
                        >
                          {st} {isCurrent && "✓"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
