"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageSquareWarning,
  Send,
  CheckCircle,
  Copy,
  Check,
  UploadCloud,
  X,
  AlertCircle,
  Shield,
  ArrowRight,
  Construction,
  Trash2,
  Lock,
  Landmark,
  Layers,
  Sparkles,
} from "lucide-react";
import { createComplaint } from "@/lib/storage";
import { ComplaintCategory, ComplaintTicket } from "@/lib/types";
import { isValidPhone } from "@/lib/utils";

export default function PengaduanPage() {
  // Form States
  const [reporterName, setReporterName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState<ComplaintCategory>("Infrastruktur");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<ComplaintTicket | null>(null);
  const [copied, setCopied] = useState(false);

  // Categories definition with icons
  const categories: { label: ComplaintCategory; icon: any; color: string }[] = [
    { label: "Infrastruktur", icon: Construction, color: "text-amber-600" },
    { label: "Kebersihan", icon: Trash2, color: "text-emerald-600" },
    { label: "Keamanan", icon: Shield, color: "text-blue-600" },
    { label: "Pelayanan Publik", icon: Landmark, color: "text-purple-600" },
    { label: "Lainnya", icon: Layers, color: "text-gray-600" },
  ];

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, photo: "Ukuran foto maksimal 5 MB." }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.photo;
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  }

  function validate() {
    const err: Record<string, string> = {};
    if (!isAnonymous && !reporterName.trim()) {
      err.reporterName = "Nama lengkap wajib diisi jika tidak memilih kirim anonim.";
    }
    if (!phone.trim()) {
      err.phone = "Nomor HP / WhatsApp wajib diisi agar pamong dapat mengabari perkembangan aduan.";
    } else if (!isValidPhone(phone)) {
      err.phone = "Format nomor HP tidak valid (contoh: 081234567890).";
    }
    if (!location.trim()) {
      err.location = "Sebutkan RT/RW, Dusun, atau patokan lokasi kejadian secara jelas.";
    }
    if (!description.trim() || description.trim().length < 15) {
      err.description = "Ceritakan deskripsi aduan minimal 15 karakter agar mudah ditindaklanjuti.";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ticket = createComplaint({
        reporterName: reporterName.trim(),
        isAnonymous,
        phone: phone.trim(),
        category,
        location: location.trim(),
        description: description.trim(),
        photoUrl: photoPreview || undefined,
      });

      setCreatedTicket(ticket);
      setIsSubmitting(false);
    }, 600);
  }

  function copyTicketCode() {
    if (!createdTicket) return;
    navigator.clipboard.writeText(createdTicket.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  // JIKA SUDAH TERKIRIM (TAMPILAN SUKSES)
  if (createdTicket) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 flex items-center justify-center bg-emerald-50/40 dark:bg-emerald-950/20">
        <div className="max-w-lg w-full bg-white dark:bg-emerald-900/40 p-8 sm:p-10 rounded-3xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xl text-center">
          {/* Centang Animasi */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center mb-6 shadow-inner animate-bounce">
            <CheckCircle className="w-12 h-12 stroke-[2.5]" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-full">
            Pengaduan Berhasil Dikirim
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-white mt-3">
            Terima Kasih Atas Laporan Anda!
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            Laporan Anda telah tercatat di buku aduan warga Desa Karangwaluh dan segera diverifikasi oleh pamong desa.
          </p>

          {/* Kartu Tiket */}
          <div className="mt-6 p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Nomor Tiket Aduan:
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                {createdTicket.status}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 bg-white dark:bg-emerald-900/80 p-3 rounded-xl border border-emerald-200 dark:border-emerald-700">
              <span className="font-mono text-xl font-extrabold text-emerald-900 dark:text-emerald-100">
                {createdTicket.id}
              </span>
              <button
                onClick={copyTicketCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
                aria-label="Salin nomor tiket"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
              Simpan kode tiket ini untuk memantau perkembangan perbaikan fasilitas.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/lacak?kode=${createdTicket.id}`}
              className="inline-flex items-center justify-center gap-2 flex-1 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all active:scale-98"
            >
              <span>Lacak Status Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                setCreatedTicket(null);
                setReporterName("");
                setPhone("");
                setLocation("");
                setDescription("");
                setPhotoPreview(null);
                setIsAnonymous(false);
              }}
              className="py-3.5 px-4 rounded-xl bg-gray-100 dark:bg-emerald-900/40 hover:bg-gray-200 dark:hover:bg-emerald-800/60 text-gray-700 dark:text-gray-200 font-semibold text-sm transition-colors"
            >
              Kirim Laporan Lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TAMPILAN FORMULIR PENGADUAN
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-emerald-50/40 dark:bg-emerald-950/20">
      <div className="max-w-3xl mx-auto">
        {/* Header Breadcrumb & Judul */}
        <div className="text-center mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-3.5 py-1 rounded-full border border-emerald-200/60">
            Aspirasi & Keluhan Warga
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-emerald-950 dark:text-white mt-3 tracking-tight">
            Sampaikan Pengaduan Desa Karangwaluh
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2 max-w-xl mx-auto">
            Bantu kami menjaga fasilitas, kebersihan, dan ketertiban lingkungan desa. Setiap pengaduan akan ditindaklanjuti secara transparan.
          </p>
        </div>

        {/* Formulir Card */}
        <div className="bg-white dark:bg-emerald-900/30 rounded-3xl p-6 sm:p-10 border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Pengirim & Opsi Anonim */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-emerald-950 dark:text-white">
                  Identitas Pengirim
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => {
                      setIsAnonymous(e.target.checked);
                      if (e.target.checked) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.reporterName;
                          return n;
                        });
                      }
                    }}
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-gray-300"
                  />
                  <span>Kirim Sebagai Anonim</span>
                </label>
              </div>

              {!isAnonymous ? (
                <div>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    className={`w-full px-4 py-3 rounded-xl border text-sm sm:text-base bg-white dark:bg-emerald-950/60 dark:text-white transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
                      errors.reporterName
                        ? "border-red-500 bg-red-50/30"
                        : "border-gray-300 dark:border-emerald-800"
                    }`}
                  />
                  {errors.reporterName && (
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.reporterName}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>
                    Nama Anda akan disamarkan sebagai <strong>Warga Karangwaluh (Anonim)</strong>.
                  </span>
                </div>
              )}
            </div>

            {/* 2. Nomor HP / WhatsApp */}
            <div>
              <label className="block text-sm font-bold text-emerald-950 dark:text-white mb-1.5">
                Nomor HP / WhatsApp Aktif <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className={`w-full px-4 py-3 rounded-xl border text-sm sm:text-base bg-white dark:bg-emerald-950/60 dark:text-white transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
                  errors.phone
                    ? "border-red-500 bg-red-50/30"
                    : "border-gray-300 dark:border-emerald-800"
                }`}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Diperlukan untuk konfirmasi dan update penanganan oleh pamong desa.
              </p>
              {errors.phone && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* 3. Kategori Pengaduan (Chip Pilihan Berikon) */}
            <div>
              <label className="block text-sm font-bold text-emerald-950 dark:text-white mb-2">
                Pilih Kategori Laporan <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {categories.map((c) => {
                  const Icon = c.icon;
                  const isSelected = category === c.label;
                  return (
                    <button
                      type="button"
                      key={c.label}
                      onClick={() => setCategory(c.label)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                        isSelected
                          ? "bg-emerald-800 text-white border-emerald-800 shadow-xs scale-102"
                          : "bg-gray-50 dark:bg-emerald-950/40 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-emerald-800 hover:bg-emerald-50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? "text-amber-300" : c.color}`} />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Lokasi / RT RW */}
            <div>
              <label className="block text-sm font-bold text-emerald-950 dark:text-white mb-1.5">
                Lokasi Kejadian / RT RW <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: RT 02 / RW 01, Dusun Krajan (Dekat pertigaan gardu poskamling)"
                className={`w-full px-4 py-3 rounded-xl border text-sm sm:text-base bg-white dark:bg-emerald-950/60 dark:text-white transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
                  errors.location
                    ? "border-red-500 bg-red-50/30"
                    : "border-gray-300 dark:border-emerald-800"
                }`}
              />
              {errors.location && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.location}</span>
                </p>
              )}
            </div>

            {/* 5. Deskripsi Aduan */}
            <div>
              <label className="block text-sm font-bold text-emerald-950 dark:text-white mb-1.5">
                Penjelasan / Uraian Aduan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan detail permasalahan yang Anda jumpai secara lengkap..."
                className={`w-full px-4 py-3 rounded-xl border text-sm sm:text-base bg-white dark:bg-emerald-950/60 dark:text-white transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
                  errors.description
                    ? "border-red-500 bg-red-50/30"
                    : "border-gray-300 dark:border-emerald-800"
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.description}</span>
                </p>
              )}
            </div>

            {/* 6. Unggah Foto Bukti (Preview) */}
            <div>
              <label className="block text-sm font-bold text-emerald-950 dark:text-white mb-1.5">
                Foto Bukti Pendukung (Opsional)
              </label>
              {photoPreview ? (
                <div className="relative w-full max-w-xs aspect-4/3 rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-sm">
                  <Image
                    src={photoPreview}
                    alt="Pratinjau foto pengaduan"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition-colors"
                    aria-label="Hapus foto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-emerald-800 hover:border-emerald-600 dark:hover:border-emerald-500 rounded-2xl cursor-pointer bg-gray-50 dark:bg-emerald-950/40 transition-colors">
                  <UploadCloud className="w-8 h-8 text-emerald-700 dark:text-emerald-400 mb-2" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Klik untuk memilih foto dari galeri HP / kamera
                  </span>
                  <span className="text-[11px] text-gray-400 mt-1">Format JPG, PNG (Maks 5 MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
              {errors.photo && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.photo}</span>
                </p>
              )}
            </div>

            {/* Tombol Kirim */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:bg-gray-300 text-emerald-950 font-extrabold text-base sm:text-lg shadow-lg hover:shadow-amber-500/30 transition-all active:scale-98"
              >
                <Send className="w-5 h-5 text-emerald-950" />
                <span>{isSubmitting ? "Mengirim Laporan..." : "Kirim Pengaduan Sekarang"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Info Tambahan */}
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          Sudah punya nomor tiket?{" "}
          <Link href="/lacak" className="text-emerald-800 dark:text-emerald-300 font-bold underline">
            Lacak status pengaduan di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
