"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Printer,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Download,
} from "lucide-react";
import { getLetterById } from "@/lib/storage";
import { LetterRequest } from "@/lib/types";
import { villageConfig } from "@/lib/config";
import { formatDateOnlyIndo } from "@/lib/utils";

function CetakSuratContent() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "";

  const [letter, setLetter] = useState<LetterRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const data = getLetterById(id);
      setLetter(data || null);
      setLoading(false);
    }
  }, [id]);

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center text-sm text-gray-500">
        Menyiapkan dokumen surat...
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="min-h-screen py-20 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold">Surat Tidak Ditemukan</h2>
        <p className="text-sm text-gray-500 mt-1">Kode {id} tidak terdaftar di perangkat ini.</p>
        <Link
          href="/surat/saya"
          className="inline-block mt-4 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold"
        >
          Kembali ke Surat Saya
        </Link>
      </div>
    );
  }

  const [currentDateIndo, setCurrentDateIndo] = useState("17 Oktober 2026");

  useEffect(() => {
    setCurrentDateIndo(formatDateOnlyIndo(new Date().toISOString()));
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-emerald-950/20">
      {/* Top Floating Control Bar (Hidden on print) */}
      <div className="no-print max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-white dark:bg-emerald-900/60 shadow-sm border border-emerald-900/10 dark:border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-emerald-800/40"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-emerald-950 dark:text-white">
              Pratinjau Surat Resmi Desa
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {letter.letterType} • Kode: {letter.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 w-full sm:w-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF (window.print)</span>
          </button>
        </div>
      </div>

      {/* LEMBAR KERTAS SURAT RESMI (Format A4 Standar Birokrasi Desa) */}
      <div className="print-container max-w-3xl mx-auto bg-white text-black p-8 sm:p-14 rounded-2xl shadow-xl border border-gray-200">
        {/* KOP SURAT PEMERINTAH DESA */}
        <div className="flex items-center justify-between pb-4 border-b-4 border-double border-black">
          <div className="w-20 h-20 relative shrink-0">
            <Image
              src="/images/desa/logo.gif"
              alt="Lambang Kabupaten Ponorogo - Desa Karangwaluh"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>

          <div className="text-center flex-1 px-4">
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider">
              Pemerintah Kabupaten Ponorogo
            </h3>
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider">
              Kecamatan Sampung
            </h3>
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-emerald-950">
              Desa Karangwaluh
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-700 mt-0.5">
              Alamat: {villageConfig.address} • Kode Pos: {villageConfig.postalCode}
            </p>
          </div>

          {/* Spacer right for symmetry */}
          <div className="w-20 h-20 hidden sm:block" />
        </div>

        {/* JUDUL DAN NOMOR SURAT */}
        <div className="text-center my-6">
          <h3 className="text-base sm:text-lg font-black uppercase underline decoration-2 tracking-wide">
            {letter.letterType}
          </h3>
          <p className="text-xs sm:text-sm font-semibold mt-1">
            Nomor: {letter.officialNumber || "470/12/405.29.11/2026"}
          </p>
        </div>

        {/* PARAGRAF PEMBUKA */}
        <p className="text-xs sm:text-sm leading-relaxed text-justify indent-8 mb-4">
          Yang bertanda tangan di bawah ini, Kepala Desa Karangwaluh, Kecamatan Sampung, Kabupaten Ponorogo, Provinsi Jawa Timur, dengan ini menerangkan dengan sebenarnya bahwa:
        </p>

        {/* TABEL DATA PEMOHON */}
        <div className="my-4 text-xs sm:text-sm space-y-2 pl-4 sm:pl-8">
          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-4 text-gray-700">Nama Lengkap</span>
            <span className="col-span-1">:</span>
            <span className="col-span-7 font-bold uppercase">{letter.applicant.name}</span>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-4 text-gray-700">NIK (KTP)</span>
            <span className="col-span-1">:</span>
            <span className="col-span-7 font-mono font-semibold">{letter.applicant.nik}</span>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-4 text-gray-700">Tempat, Tgl. Lahir</span>
            <span className="col-span-1">:</span>
            <span className="col-span-7">
              {letter.applicant.birthPlace}, {letter.applicant.birthDate}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-4 text-gray-700">Jenis Kelamin</span>
            <span className="col-span-1">:</span>
            <span className="col-span-7">{letter.applicant.gender}</span>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-4 text-gray-700">Agama</span>
            <span className="col-span-1">:</span>
            <span className="col-span-7">{letter.applicant.religion || "Islam"}</span>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-4 text-gray-700">Pekerjaan</span>
            <span className="col-span-1">:</span>
            <span className="col-span-7">{letter.applicant.occupation || "Wiraswasta"}</span>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-4 text-gray-700">Alamat Tempat Tinggal</span>
            <span className="col-span-1">:</span>
            <span className="col-span-7 leading-snug">
              {letter.applicant.address}, {letter.applicant.rtRw}, {letter.applicant.dusun}, Desa Karangwaluh, Kec. Sampung, Kab. Ponorogo, Jawa Timur.
            </span>
          </div>
        </div>

        {/* PARAGRAF KETERANGAN & KEPERLUAN */}
        <div className="text-xs sm:text-sm leading-relaxed text-justify space-y-3 my-5 indent-8">
          <p>
            Berdasarkan pencatatan administrasi kependudukan Desa Karangwaluh, yang bersangkutan benar-benar merupakan warga masyarakat Desa Karangwaluh dan berkelakuan baik dalam kehidupan bermasyarakat.
          </p>
          <p>
            Surat keterangan ini diberikan secara resmi kepada yang bersangkutan untuk dipergunakan sebagai:{" "}
            <strong className="underline uppercase">{letter.applicant.purpose}</strong>.
          </p>
          <p>
            Demikian Surat Keterangan ini kami perbuat dengan sebenarnya, agar dapat dipergunakan sebagaimana mestinya oleh pihak yang berkepentingan.
          </p>
        </div>

        {/* TANDA TANGAN KEPALA DESA & STEMPEL */}
        <div className="mt-12 flex justify-end">
          <div className="text-center w-64 space-y-1 relative">
            <p className="text-xs sm:text-sm">
              Karangwaluh, {currentDateIndo}
            </p>
            <p className="text-xs sm:text-sm font-bold">
              Kepala Desa Karangwaluh
            </p>

            {/* Kolom Tanda Tangan & Cap Stempel Desa */}
            <div className="relative h-24 flex items-center justify-center my-2">
              {/* Cap Stempel Transparan Resmi Desa */}
              <div className="absolute left-4 w-24 h-24 rounded-full border-3 border-emerald-800/70 text-emerald-800 flex items-center justify-center rotate-[-12deg] pointer-events-none select-none">
                <div className="w-20 h-20 rounded-full border border-dashed border-emerald-800/80 flex flex-col items-center justify-center p-1 text-center">
                  <span className="text-[7px] font-black uppercase">PEMERINTAH DESA</span>
                  <span className="text-[8px] font-black uppercase text-amber-900">KARANGWALUH</span>
                  <span className="text-[6px] font-bold">KEC. SAMPUNG</span>
                </div>
              </div>

              {/* Tanda Tangan Digital / Goresan */}
              <div className="font-serif italic text-2xl text-emerald-950 translate-x-3 select-none">
                Sukeni
              </div>
            </div>

            <p className="text-xs sm:text-sm font-extrabold uppercase underline">
              {villageConfig.headOfVillage.name}
            </p>
            <p className="text-[11px] text-gray-600">
              Pamong Praja Desa Karangwaluh
            </p>
          </div>
        </div>

        {/* Footer Dokumen Digital */}
        <div className="mt-10 pt-4 border-t border-gray-300 text-[10px] text-gray-500 flex items-center justify-between">
          <span>Dicetak melalui Sistem Layanan Mandiri Desa Karangwaluh</span>
          <span className="font-mono">ID Validasi: {letter.id}</span>
        </div>
      </div>
    </div>
  );
}

export default function CetakSuratPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-20 flex items-center justify-center text-sm text-gray-500">
          Menyiapkan dokumen surat...
        </div>
      }
    >
      <CetakSuratContent />
    </Suspense>
  );
}
