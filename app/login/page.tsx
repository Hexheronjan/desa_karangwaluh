"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { loginOfficer, isOfficerAuthenticated } from "@/lib/storage";
import { villageConfig } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to /admin-demo
  useEffect(() => {
    if (isOfficerAuthenticated()) {
      router.push("/admin-demo");
    }
  }, [router]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginOfficer(username, password);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          router.push("/admin-demo");
        }, 800);
      } else {
        setErrorMsg(res.message);
        setIsLoading(false);
      }
    }, 400);
  }

  // Quick autofill demo accounts helper
  function autofillAccount(u: string, p: string) {
    setUsername(u);
    setPassword(p);
    setErrorMsg(null);
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-200 hover:text-white font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Beranda Warga</span>
        </Link>
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
          Khusus Petugas
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-emerald-950/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-800/40 text-emerald-950 dark:text-emerald-100 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl p-2 bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/60 shadow-md flex items-center justify-center mb-3">
            <Image
              src="/images/desa/logo.gif"
              alt="Logo Kabupaten Ponorogo - Desa Karangwaluh"
              width={48}
              height={48}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-emerald-950 dark:text-white">
            Masuk Panel Petugas Desa
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Pemerintah {villageConfig.name}, {villageConfig.subdistrict}, {villageConfig.regency}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 text-xs flex items-center gap-2.5 animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
            <p className="font-semibold">{successMsg}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Username / ID Petugas</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username (contoh: operator)"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-hidden transition-all text-emerald-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Kata Sandi (Password)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-hidden transition-all text-emerald-950 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                aria-label="Lihat kata sandi"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-emerald-800/60 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memverifikasi...</span>
              </span>
            ) : (
              <>
                <span>Masuk ke Panel Operator</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Autofill Box */}
        <div className="mt-6 pt-5 border-t border-gray-200 dark:border-emerald-800/50">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-2.5">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Akun Demo Cepat (Klik untuk Isi Otomatis):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => autofillAccount("operator", "karangwaluh")}
              className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/40 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-950 dark:text-white">Operator Desa</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold group-hover:underline">Pakai &rarr;</span>
              </div>
              <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                operator / karangwaluh
              </p>
            </button>

            <button
              type="button"
              onClick={() => autofillAccount("admin", "admin123")}
              className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-950 dark:text-amber-200">Admin Utama</span>
                <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold group-hover:underline">Pakai &rarr;</span>
              </div>
              <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                admin / admin123
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Small Footer Security Notice */}
      <p className="text-center text-xs text-emerald-300/70 mt-6 max-w-sm leading-relaxed relative z-10">
        Sistem simulasi pelayanan Desa Karangwaluh. Sesi login tersimpan secara aman di peramban lokal perangkat ini.
      </p>
    </div>
  );
}
