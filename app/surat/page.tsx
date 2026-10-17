"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Copy,
  Check,
  Send,
  Printer,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Home,
  Briefcase,
  HeartCrack,
  CreditCard,
  Baby,
  FileCheck2,
} from "lucide-react";
import { LetterType, LetterRequest } from "@/lib/types";
import { createLetter } from "@/lib/storage";
import { isValidNik, isValidPhone } from "@/lib/utils";

export default function SuratPage() {
  // Wizard Step: 1 = Pilih Jenis, 2 = Isi Data, 3 = Tinjau & Kirim
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Data State
  const [letterType, setLetterType] = useState<LetterType>("Surat Keterangan Domisili");

  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    gender: "Laki-laki" as "Laki-laki" | "Perempuan",
    birthPlace: "Ponorogo",
    birthDate: "",
    religion: "Islam",
    occupation: "Wiraswasta",
    address: "",
    rtRw: "RT 01 / RW 01",
    dusun: "Dusun Krajan",
    purpose: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<LetterRequest | null>(null);
  const [copied, setCopied] = useState(false);

  // Daftar 6 Jenis Surat dengan ikon & deskripsi
  const letterTypes: {
    type: LetterType;
    icon: any;
    desc: string;
    requirement: string;
  }[] = [
    {
      type: "Surat Keterangan Domisili",
      icon: Home,
      desc: "Menyatakan tempat tinggal atau kediaman resmi warga di wilayah Desa Karangwaluh.",
      requirement: "Persyaratan: KTP / Kartu Keluarga",
    },
    {
      type: "Surat Keterangan Tidak Mampu (SKTM)",
      icon: HeartCrack,
      desc: "Untuk keperluan pengajuan beasiswa, keringanan biaya pendidikan, atau jaminan kesehatan.",
      requirement: "Persyaratan: KK, Pengantar RT",
    },
    {
      type: "Surat Pengantar KTP / KK",
      icon: CreditCard,
      desc: "Pengantar penerbitan KTP elektronik baru/rusak, pembaruan KK, atau pindah datang.",
      requirement: "Persyaratan: Fotokopi KK lama",
    },
    {
      type: "Surat Keterangan Usaha (SKU)",
      icon: Briefcase,
      desc: "Menyatakan bahwa warga memiliki usaha aktif di Karangwaluh untuk pengajuan pinjaman/izin UMKM.",
      requirement: "Persyaratan: KTP & Bukti Usaha",
    },
    {
      type: "Surat Pengantar SKCK",
      icon: ShieldCheck,
      desc: "Surat rekomendasi catatan kelakuan baik dari desa untuk pembuatan SKCK di Polsek/Polres.",
      requirement: "Persyaratan: KTP & Pas Foto",
    },
    {
      type: "Surat Keterangan Kelahiran / Kematian",
      icon: Baby,
      desc: "Pencatatan peristiwa kelahiran anak atau pelaporan kematian warga di desa.",
      requirement: "Persyaratan: Surat Bidan / RT",
    },
  ];

  function validateStep2(): boolean {
    const err: Record<string, string> = {};

    if (!formData.name.trim()) err.name = "Nama lengkap wajib diisi sesuai KTP.";
    if (!formData.nik.trim()) {
      err.nik = "Nomor NIK 16 digit wajib diisi.";
    } else if (!isValidNik(formData.nik)) {
      err.nik = "NIK harus terdiri dari tepat 16 angka.";
    }

    if (!formData.birthPlace.trim()) err.birthPlace = "Tempat lahir wajib diisi.";
    if (!formData.birthDate) err.birthDate = "Tanggal lahir wajib dipilih.";
    if (!formData.address.trim()) err.address = "Alamat domisili wajib diisi.";
    if (!formData.purpose.trim() || formData.purpose.trim().length < 8) {
      err.purpose = "Sebutkan keperluan pengajuan surat secara jelas (min. 8 karakter).";
    }
    if (!formData.phone.trim()) {
      err.phone = "Nomor WhatsApp wajib diisi untuk notifikasi saat surat selesai.";
    } else if (!isValidPhone(formData.phone)) {
      err.phone = "Nomor HP / WhatsApp tidak valid (contoh: 081234567890).";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function handleNext() {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  }

  function handleBack() {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  }

  function handleSubmit() {
    setIsSubmitting(true);
    setTimeout(() => {
      const res = createLetter({
        letterType,
        applicant: {
          name: formData.name.trim(),
          nik: formData.nik.trim(),
          gender: formData.gender,
          birthPlace: formData.birthPlace.trim(),
          birthDate: formData.birthDate,
          religion: formData.religion,
          occupation: formData.occupation.trim(),
          address: formData.address.trim(),
          rtRw: formData.rtRw,
          dusun: formData.dusun,
          purpose: formData.purpose.trim(),
          phone: formData.phone.trim(),
        },
      });

      setCreatedRequest(res);
      setIsSubmitting(false);
    }, 600);
  }

  function copyCode() {
    if (!createdRequest) return;
    navigator.clipboard.writeText(createdRequest.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  // TAMPILAN SUKSES
  if (createdRequest) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 flex items-center justify-center bg-emerald-50/40 dark:bg-emerald-950/20">
        <div className="max-w-lg w-full bg-white dark:bg-emerald-900/40 p-8 sm:p-10 rounded-3xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xl text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center mb-6 shadow-inner animate-bounce">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-full">
            Permohonan Berhasil Diajukan
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-white mt-3">
            Permohonan Surat Diterima!
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            Permohonan <strong>{createdRequest.letterType}</strong> atas nama{" "}
            <strong>{createdRequest.applicant.name}</strong> sedang masuk ke antrean verifikasi petugas desa.
          </p>

          {/* Kartu Kode Surat */}
          <div className="mt-6 p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Kode Permohonan Surat:
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                {createdRequest.status}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 bg-white dark:bg-emerald-900/80 p-3 rounded-xl border border-emerald-200 dark:border-emerald-700">
              <span className="font-mono text-xl font-extrabold text-emerald-900 dark:text-emerald-100">
                {createdRequest.id}
              </span>
              <button
                onClick={copyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
                aria-label="Salin kode surat"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
              <p className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                🏢 Alur Pengambilan Surat Fisik:
              </p>
              <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                Surat fisik resmi akan diproses, dicetak, dan ditandatangani Kepala Desa dengan stempel basah. Saat status menjadi <strong>"Siap Diambil"</strong>, petugas akan mengabari Anda via WhatsApp untuk mengambil surat langsung di Kantor Balai Desa Karangwaluh.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/lacak?kode=${createdRequest.id}`}
              className="inline-flex items-center justify-center gap-2 flex-1 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all active:scale-98"
            >
              <span>Lacak Status Surat Ini</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin-demo"
              className="py-3.5 px-4 rounded-xl bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 font-bold text-sm transition-colors border border-amber-300/50"
            >
              ⚡ Ubah Status di Demo Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // WIZARD FORM
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-emerald-50/40 dark:bg-emerald-950/20">
      <div className="max-w-3xl mx-auto">
        {/* Header Breadcrumb */}
        <div className="text-center mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-3.5 py-1 rounded-full border border-emerald-200/60">
            Pelayanan Administrasi Digital
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-emerald-950 dark:text-white mt-3 tracking-tight">
            Permohonan Surat Keterangan Online
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Ikuti 3 langkah mudah berikut untuk mengajukan surat resmi dari Balai Desa Karangwaluh.
          </p>
        </div>

        {/* PROGRESS BAR 3 LANGKAH */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-3">
            <span className={step >= 1 ? "text-emerald-800 dark:text-emerald-300" : "text-gray-400"}>
              1. Pilih Jenis Surat
            </span>
            <span className={step >= 2 ? "text-emerald-800 dark:text-emerald-300" : "text-gray-400"}>
              2. Isi Data Pemohon
            </span>
            <span className={step >= 3 ? "text-emerald-800 dark:text-emerald-300" : "text-gray-400"}>
              3. Tinjau & Kirim
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-emerald-950 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* LANGKAH 1: PILIH JENIS SURAT */}
        {step === 1 && (
          <div className="bg-white dark:bg-emerald-900/30 rounded-3xl p-6 sm:p-10 border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm space-y-6 animate-fade-in">
            <h2 className="text-lg sm:text-xl font-black text-emerald-950 dark:text-white">
              Pilih Jenis Surat yang Anda Butuhkan:
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {letterTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = letterType === item.type;
                return (
                  <div
                    key={item.type}
                    onClick={() => setLetterType(item.type)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-700 ring-2 ring-emerald-600 shadow-md"
                        : "bg-white dark:bg-emerald-900/20 border-gray-200 dark:border-emerald-800 hover:border-emerald-400"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected ? "bg-emerald-800 text-white" : "bg-gray-100 dark:bg-emerald-950 text-emerald-800"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "bg-emerald-700 border-emerald-700 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-emerald-950 dark:text-white">
                        {item.type}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
                      {item.requirement}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Link href="/lacak" className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 underline">
                Lacak Status Surat Sebelumnya &rarr;
              </Link>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm shadow-md transition-all active:scale-98"
              >
                <span>Lanjut: Isi Identitas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* LANGKAH 2: ISI DATA PEMOHON */}
        {step === 2 && (
          <div className="bg-white dark:bg-emerald-900/30 rounded-3xl p-6 sm:p-10 border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-emerald-800/40">
              <div>
                <span className="text-xs uppercase font-bold text-gray-400">Jenis Surat Terpilih:</span>
                <h2 className="text-lg font-black text-emerald-950 dark:text-white">{letterType}</h2>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold underline"
              >
                Ganti Jenis
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Lengkap */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Nama Lengkap Sesuai KTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Siti Rahmawati"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/60 dark:text-white text-sm focus:ring-2 focus:ring-emerald-600"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* NIK 16 digit */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Nomor Induk Kependudukan (NIK) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, "") })}
                  placeholder="16 Digit NIK di KTP/KK"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/60 dark:text-white text-sm font-mono focus:ring-2 focus:ring-emerald-600"
                />
                {errors.nik && <p className="text-xs text-red-500 mt-1">{errors.nik}</p>}
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/60 dark:text-white text-sm"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              {/* Tempat Lahir */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Tempat Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  placeholder="Contoh: Ponorogo"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/60 dark:text-white text-sm"
                />
                {errors.birthPlace && <p className="text-xs text-red-500 mt-1">{errors.birthPlace}</p>}
              </div>

              {/* Tanggal Lahir */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/60 dark:text-white text-sm"
                />
                {errors.birthDate && <p className="text-xs text-red-500 mt-1">{errors.birthDate}</p>}
              </div>

              {/* Agama & Pekerjaan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Agama
                </label>
                <input
                  type="text"
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/60 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Pekerjaan
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/60 dark:text-white text-sm"
                />
              </div>

              {/* Dusun & RT/RW */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Dusun di Karangwaluh
                </label>
                <select
                  value={formData.dusun}
                  onChange={(e) => setFormData({ ...formData, dusun: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/60 dark:text-white text-sm"
                >
                  <option value="Dusun Krajan">Dusun Krajan</option>
                  <option value="Dusun Waluh">Dusun Waluh</option>
                  <option value="Dusun Karangmulyo">Dusun Karangmulyo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  RT / RW
                </label>
                <input
                  type="text"
                  value={formData.rtRw}
                  onChange={(e) => setFormData({ ...formData, rtRw: e.target.value })}
                  placeholder="Contoh: RT 03 / RW 01"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/60 dark:text-white text-sm"
                />
              </div>

              {/* Alamat Domisili */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Alamat Lengkap Rumah <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Contoh: Jl. Poros Desa, RT 02 / RW 01"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/60 dark:text-white text-sm"
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>

              {/* Keperluan Surat */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Keperluan / Tujuan Pembuatan Surat <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Contoh: Pengajuan beasiswa kuliah anak, persyaratan kredit usaha mikro bank, perpanjangan KTP"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/60 dark:text-white text-sm"
                />
                {errors.purpose && <p className="text-xs text-red-500 mt-1">{errors.purpose}</p>}
              </div>

              {/* Nomor WhatsApp */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Nomor HP / WhatsApp Aktif <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/60 dark:text-white text-sm"
                />
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Kabar saat surat selesai siap diambil akan diberitahukan ke nomor ini.
                </p>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm shadow-md transition-all active:scale-98"
              >
                <span>Lanjut: Tinjau Data</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* LANGKAH 3: TINJAU & KIRIM */}
        {step === 3 && (
          <div className="bg-white dark:bg-emerald-900/30 rounded-3xl p-6 sm:p-10 border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm space-y-6 animate-fade-in">
            <div>
              <span className="text-xs uppercase font-bold text-gray-400">Pemeriksaan Akhir</span>
              <h2 className="text-lg sm:text-xl font-black text-emerald-950 dark:text-white">
                Pastikan Seluruh Data Anda Sudah Benar
              </h2>
            </div>

            {/* Rangkuman Data Pemohon */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 space-y-3 text-sm">
              <div className="flex justify-between border-b border-emerald-100 pb-2">
                <span className="text-gray-500">Jenis Surat:</span>
                <span className="font-extrabold text-emerald-900 dark:text-emerald-200">{letterType}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-100 pb-2">
                <span className="text-gray-500">Nama Pemohon:</span>
                <span className="font-bold text-gray-900 dark:text-white">{formData.name}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-100 pb-2">
                <span className="text-gray-500">NIK (16 Digit):</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{formData.nik}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-100 pb-2">
                <span className="text-gray-500">Tempat, Tanggal Lahir:</span>
                <span className="text-gray-900 dark:text-white">
                  {formData.birthPlace}, {formData.birthDate}
                </span>
              </div>
              <div className="flex justify-between border-b border-emerald-100 pb-2">
                <span className="text-gray-500">Wilayah Domisili:</span>
                <span className="text-gray-900 dark:text-white">
                  {formData.rtRw}, {formData.dusun}
                </span>
              </div>
              <div className="flex justify-between border-b border-emerald-100 pb-2">
                <span className="text-gray-500">Nomor WhatsApp:</span>
                <span className="font-mono text-gray-900 dark:text-white">{formData.phone}</span>
              </div>
              <div className="pt-1">
                <span className="text-gray-500 block text-xs">Keperluan Permohonan:</span>
                <p className="font-semibold text-emerald-950 dark:text-emerald-100 mt-0.5">
                  "{formData.purpose}"
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0 text-amber-700" />
              <span>
                Dengan menekan tombol Kirim, Anda menyatakan bahwa data yang diisi adalah benar untuk diterbitkan surat resmi oleh Pemerintah Desa Karangwaluh.
              </span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ubah Data</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold text-base shadow-lg hover:shadow-amber-500/30 transition-all active:scale-98"
              >
                <Send className="w-5 h-5 text-emerald-950" />
                <span>{isSubmitting ? "Mengirim Permohonan..." : "Kirim Permohonan Surat"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
