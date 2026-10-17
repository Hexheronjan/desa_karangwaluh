"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  FileText,
  MessageSquareWarning,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Send,
  Phone,
  Settings,
  Store,
  Image as ImageIcon,
  Newspaper,
  Plus,
  Trash2,
  Save,
  Upload,
  User,
  MapPin,
  Calendar,
  Eye,
  Check,
  Building2,
  Users,
  LogOut,
  MessageCircle,
} from "lucide-react";
import {
  getLetters,
  getComplaints,
  updateLetterStatus,
  updateComplaintStatus,
  getStoredVillageConfig,
  updateStoredVillageConfig,
  getStoredProducts,
  addProductUmkm,
  deleteProductUmkm,
  getStoredGallery,
  addGalleryItem,
  deleteGalleryItem,
  getStoredNews,
  addVillageNews,
  deleteVillageNews,
  resetDemoData,
  isOfficerAuthenticated,
  getOfficerSession,
  logoutOfficer,
  OfficerSession,
} from "@/lib/storage";
import {
  LetterRequest,
  ComplaintTicket,
  LetterStatus,
  ComplaintStatus,
} from "@/lib/types";
import {
  VillageConfig,
  ProductUmkm,
  GalleryItem,
  NewsItem,
} from "@/lib/config";
import { formatDateIndo } from "@/lib/utils";

type AdminTab = "surat" | "pengaduan" | "kontak" | "umkm" | "galeri" | "pengumuman";

function getCleanWaNumber(phone?: string): string {
  if (!phone) return "";
  let clean = phone.replace(/\D/g, "");
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  } else if (clean.startsWith("8")) {
    clean = "62" + clean;
  }
  return clean;
}

export default function AdminDemoPage() {
  const router = useRouter();
  const [session, setSession] = useState<OfficerSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [activeTab, setActiveTab] = useState<AdminTab>("surat");
  const [letters, setLetters] = useState<LetterRequest[]>([]);
  const [complaints, setComplaints] = useState<ComplaintTicket[]>([]);
  const [config, setConfig] = useState<VillageConfig | null>(null);
  const [products, setProducts] = useState<ProductUmkm[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Check auth session
  useEffect(() => {
    if (!isOfficerAuthenticated()) {
      router.push("/login");
    } else {
      setSession(getOfficerSession());
      setIsAuthChecking(false);
    }
  }, [router]);

  function handleLogout() {
    logoutOfficer();
    router.push("/login");
  }

  // Note inputs state per item
  const [letterNotes, setLetterNotes] = useState<Record<string, string>>({});
  const [complaintNotes, setComplaintNotes] = useState<Record<string, string>>({});

  // Config Form State
  const [configForm, setConfigForm] = useState({
    whatsapp: "",
    phone: "",
    email: "",
    address: "",
    headName: "",
    headPeriod: "",
    weekdays: "",
    friday: "",
    weekend: "",
    population: 0,
    families: 0,
    activeUmkm: 0,
  });

  // Modal / Form toggle states
  const [showAddUmkm, setShowAddUmkm] = useState(false);
  const [showAddGallery, setShowAddGallery] = useState(false);
  const [showAddNews, setShowAddNews] = useState(false);

  // New UMKM Form State
  const [umkmForm, setUmkmForm] = useState({
    name: "",
    category: "Olahan Makanan Ringan",
    priceEstimate: "Rp15.000",
    description: "",
    sellerName: "",
    whatsappNumber: "081234567890",
    image: "/images/desa/umkm-keripik.jpg",
  });

  // New Gallery Form State
  const [galleryForm, setGalleryForm] = useState<{
    title: string;
    category: "Kantor" | "Kegiatan" | "Pelayanan" | "Warga" | "Panorama" | "UMKM";
    src: string;
    description: string;
  }>({
    title: "",
    category: "Kegiatan",
    src: "/images/desa/gambar4.webp",
    description: "",
  });

  // New News Form State
  const [newsForm, setNewsForm] = useState<{
    title: string;
    date: string;
    category: "Pemberitahuan" | "Kesehatan" | "Pembangunan" | "Kegiatan Warga";
    summary: string;
    author: string;
  }>({
    title: "",
    date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    category: "Pemberitahuan",
    summary: "",
    author: "Pemerintah Desa Karangwaluh",
  });

  function refreshData() {
    setLetters(getLetters());
    setComplaints(getComplaints());
    const cfg = getStoredVillageConfig();
    setConfig(cfg);
    setConfigForm({
      whatsapp: cfg.contact.whatsapp,
      phone: cfg.contact.phone,
      email: cfg.contact.email,
      address: cfg.address,
      headName: cfg.headOfVillage.name,
      headPeriod: cfg.headOfVillage.period,
      weekdays: cfg.serviceHours.weekdays,
      friday: cfg.serviceHours.friday,
      weekend: cfg.serviceHours.weekend,
      population: cfg.statistics.population,
      families: cfg.statistics.families,
      activeUmkm: cfg.statistics.activeUmkm,
    });
    setProducts(getStoredProducts());
    setGallery(getStoredGallery());
    setNewsList(getStoredNews());
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

  // Handle Letter Status Change
  function handleLetterStatusChange(id: string, newStatus: LetterStatus) {
    const note = letterNotes[id] || undefined;
    updateLetterStatus(id, newStatus, note);
    triggerToast(`Status surat ${id} berhasil diubah ke: ${newStatus}`);
    refreshData();
  }

  // Handle Complaint Status Change
  function handleComplaintStatusChange(id: string, newStatus: ComplaintStatus) {
    const note = complaintNotes[id] || undefined;
    updateComplaintStatus(id, newStatus, note);
    triggerToast(`Status pengaduan ${id} berhasil diubah ke: ${newStatus}`);
    refreshData();
  }

  // Save Village Profile & Contact
  function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault();
    // Normalize WhatsApp number (remove non-digits, replace leading 0 with 62)
    let cleanWa = configForm.whatsapp.replace(/\D/g, "");
    if (cleanWa.startsWith("0")) {
      cleanWa = "62" + cleanWa.slice(1);
    }

    updateStoredVillageConfig({
      address: configForm.address,
      contact: {
        whatsapp: cleanWa,
        phone: configForm.phone,
        email: configForm.email,
        website: config?.contact.website || "",
      },
      headOfVillage: {
        name: configForm.headName,
        period: configForm.headPeriod,
        title: "Kepala Desa Karangwaluh",
      },
      serviceHours: {
        weekdays: configForm.weekdays,
        friday: configForm.friday,
        weekend: configForm.weekend,
        note: config?.serviceHours.note || "",
      },
      statistics: {
        population: Number(configForm.population),
        families: Number(configForm.families),
        areaKm2: config?.statistics.areaKm2 || 6.0,
        neighborhoodUnits: config?.statistics.neighborhoodUnits || 10,
        citizenUnits: config?.statistics.citizenUnits || 3,
        activeUmkm: Number(configForm.activeUmkm),
      },
    });

    triggerToast("Pengaturan profil & kontak desa berhasil diperbarui!");
  }

  // Add UMKM
  function handleAddUmkm(e: React.FormEvent) {
    e.preventDefault();
    let cleanWa = umkmForm.whatsappNumber.replace(/\D/g, "");
    if (cleanWa.startsWith("0")) {
      cleanWa = "62" + cleanWa.slice(1);
    }

    addProductUmkm({
      name: umkmForm.name,
      category: umkmForm.category,
      priceEstimate: umkmForm.priceEstimate,
      description: umkmForm.description,
      sellerName: umkmForm.sellerName,
      whatsappNumber: cleanWa,
      orderMessage: `Halo ${umkmForm.sellerName}, saya ingin memesan produk ${umkmForm.name} khas Desa Karangwaluh.`,
      image: umkmForm.image || "/images/desa/umkm-keripik.jpg",
      rating: 5.0,
    });

    setUmkmForm({
      name: "",
      category: "Olahan Makanan Ringan",
      priceEstimate: "Rp15.000",
      description: "",
      sellerName: "",
      whatsappNumber: "081234567890",
      image: "/images/desa/umkm-keripik.jpg",
    });
    setShowAddUmkm(false);
    triggerToast("Produk UMKM baru berhasil ditambahkan!");
    refreshData();
  }

  function handleDeleteUmkm(id: string, name: string) {
    if (confirm(`Hapus produk UMKM "${name}"?`)) {
      deleteProductUmkm(id);
      triggerToast(`Produk "${name}" berhasil dihapus.`);
      refreshData();
    }
  }

  // Add Gallery
  function handleAddGallery(e: React.FormEvent) {
    e.preventDefault();
    addGalleryItem({
      title: galleryForm.title,
      category: galleryForm.category,
      src: galleryForm.src || "/images/desa/gambar4.webp",
      description: galleryForm.description,
    });

    setGalleryForm({
      title: "",
      category: "Kegiatan",
      src: "/images/desa/gambar4.webp",
      description: "",
    });
    setShowAddGallery(false);
    triggerToast("Foto galeri baru berhasil ditambahkan!");
    refreshData();
  }

  function handleDeleteGallery(id: string, title: string) {
    if (confirm(`Hapus foto galeri "${title}"?`)) {
      deleteGalleryItem(id);
      triggerToast(`Foto "${title}" berhasil dihapus.`);
      refreshData();
    }
  }

  // Add News / Agenda
  function handleAddNews(e: React.FormEvent) {
    e.preventDefault();
    addVillageNews({
      title: newsForm.title,
      date: newsForm.date,
      category: newsForm.category,
      summary: newsForm.summary,
      author: newsForm.author || "Pemerintah Desa",
    });

    setNewsForm({
      title: "",
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      category: "Pemberitahuan",
      summary: "",
      author: "Pemerintah Desa Karangwaluh",
    });
    setShowAddNews(false);
    triggerToast("Pengumuman / agenda desa berhasil dipublikasikan!");
    refreshData();
  }

  function handleDeleteNews(id: string, title: string) {
    if (confirm(`Hapus pengumuman "${title}"?`)) {
      deleteVillageNews(id);
      triggerToast(`Pengumuman "${title}" berhasil dihapus.`);
      refreshData();
    }
  }

  // Handle local image upload preview using FileReader
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file foto maksimal 2 MB agar performa tetap cepat.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setter(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function handleReset() {
    if (confirm("Reset seluruh data demo (surat, pengaduan, profil, produk UMKM, galeri, pengumuman) ke kondisi awal bawaan?")) {
      resetDemoData();
      triggerToast("Semua data demo berhasil direset ke kondisi awal.");
      refreshData();
    }
  }

  // Quick preset image selector helper
  const presetImages = [
    { label: "Foto 1 (Pertemuan Warga)", path: "/images/desa/gambar1.webp" },
    { label: "Foto 2 (Pelantikan Lembaga)", path: "/images/desa/gambar2.webp" },
    { label: "Foto 3 (Balai Desa Megah)", path: "/images/desa/gambar3.webp" },
    { label: "Foto 4 (Pentas Reyog)", path: "/images/desa/gambar4.webp" },
    { label: "Foto Keripik UMKM", path: "/images/desa/umkm-keripik.jpg" },
    { label: "Lanskap Perbukitan", path: "/images/desa/hero-karangwaluh.jpg" },
  ];

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100">
        <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-500">Memeriksa hak akses operator...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-5 sm:py-8 px-4 sm:px-6 lg:px-8 bg-stone-50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Top Header Card (Compact & Streamlined) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-emerald-900 text-white shadow-xl border border-emerald-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                    Panel Operator Balai Desa
                  </h1>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950">
                    Mode Pengelola
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 mt-0.5 max-w-xl line-clamp-1 sm:line-clamp-none">
                  Kelola permohonan surat, pengaduan, nomor WhatsApp desa, UMKM, galeri, dan agenda resmi.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
              {session && (
                <div className="px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-emerald-100 text-xs flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-300" />
                  <span className="font-bold truncate max-w-[130px]">{session.name}</span>
                  <span className="text-[10px] bg-amber-400 text-emerald-950 font-bold px-1.5 py-0.2 rounded">
                    {session.role}
                  </span>
                </div>
              )}

              <Link
                href="/"
                target="_blank"
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all flex items-center gap-1.5 border border-white/20"
              >
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Lihat Tampilan Warga</span>
                <span className="sm:hidden">Warga</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition-all active:scale-98 flex items-center gap-1.5 cursor-pointer"
                title="Kembalikan semua data ke kondisi awal"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all active:scale-98 flex items-center gap-1.5 cursor-pointer border border-rose-500"
                title="Keluar dari sesi operator"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar (Compact) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4 pt-4 border-t border-emerald-800/80">
            <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/50">
              <p className="text-[10px] text-emerald-300 font-medium">Permohonan Surat</p>
              <p className="text-base sm:text-lg font-black text-white">{letters.length} <span className="text-xs text-amber-300 font-bold">({letters.filter(l => l.status === "Siap Diambil").length} Siap)</span></p>
            </div>
            <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/50">
              <p className="text-[10px] text-emerald-300 font-medium">Pengaduan Warga</p>
              <p className="text-base sm:text-lg font-black text-white">{complaints.length} <span className="text-xs text-emerald-300 font-bold">({complaints.filter(c => c.status === "Selesai").length} Selesai)</span></p>
            </div>
            <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/50">
              <p className="text-[10px] text-emerald-300 font-medium">WhatsApp Desa</p>
              <p className="text-xs sm:text-sm font-black text-amber-300 truncate">+{configForm.whatsapp || "62..."}</p>
            </div>
            <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/50">
              <p className="text-[10px] text-emerald-300 font-medium">Katalog UMKM</p>
              <p className="text-base sm:text-lg font-black text-white">{products.length} <span className="text-xs text-emerald-300 font-normal">Produk</span></p>
            </div>
            <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/50 col-span-2 sm:col-span-1">
              <p className="text-[10px] text-emerald-300 font-medium">Galeri & Agenda</p>
              <p className="text-base sm:text-lg font-black text-white">{gallery.length} <span className="text-xs text-amber-300 font-bold">Foto</span> • {newsList.length} <span className="text-xs text-emerald-300 font-bold">Agenda</span></p>
            </div>
          </div>
        </div>

        {/* Floating Success Toast */}
        {successToast && (
          <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-emerald-800 text-white shadow-2xl border border-emerald-600 flex items-center gap-3 animate-in slide-in-from-right duration-200 max-w-md">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{successToast}</span>
          </div>
        )}

        {/* Navigation Tabs (Full Width Responsive 6-Column Grid - No Cut Off Text) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
          <button
            onClick={() => setActiveTab("surat")}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all text-center w-full cursor-pointer ${
              activeTab === "surat"
                ? "bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600"
                : "bg-white dark:bg-emerald-900/30 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 border border-gray-200/70 dark:border-emerald-800/40"
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="truncate">Surat ({letters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("pengaduan")}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all text-center w-full cursor-pointer ${
              activeTab === "pengaduan"
                ? "bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600"
                : "bg-white dark:bg-emerald-900/30 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 border border-gray-200/70 dark:border-emerald-800/40"
            }`}
          >
            <MessageSquareWarning className="w-4 h-4 shrink-0" />
            <span className="truncate">Pengaduan ({complaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("kontak")}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all text-center w-full cursor-pointer ${
              activeTab === "kontak"
                ? "bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600"
                : "bg-white dark:bg-emerald-900/30 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 border border-gray-200/70 dark:border-emerald-800/40"
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span className="truncate">Profil & Kontak</span>
          </button>

          <button
            onClick={() => setActiveTab("umkm")}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all text-center w-full cursor-pointer ${
              activeTab === "umkm"
                ? "bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600"
                : "bg-white dark:bg-emerald-900/30 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 border border-gray-200/70 dark:border-emerald-800/40"
            }`}
          >
            <Store className="w-4 h-4 shrink-0" />
            <span className="truncate">UMKM ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("galeri")}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all text-center w-full cursor-pointer ${
              activeTab === "galeri"
                ? "bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600"
                : "bg-white dark:bg-emerald-900/30 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 border border-gray-200/70 dark:border-emerald-800/40"
            }`}
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            <span className="truncate">Galeri Foto ({gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("pengumuman")}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all text-center w-full cursor-pointer ${
              activeTab === "pengumuman"
                ? "bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600"
                : "bg-white dark:bg-emerald-900/30 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 border border-gray-200/70 dark:border-emerald-800/40"
            }`}
          >
            <Newspaper className="w-4 h-4 shrink-0" />
            <span className="truncate">Agenda ({newsList.length})</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PERMOHONAN SURAT */}
        {/* ======================================================== */}
        {activeTab === "surat" && (
          <div className="space-y-4">
            {/* Direct WhatsApp Info Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100">
                    Notifikasi Surat via Tautan WhatsApp Resmi (100% Gratis & Privat)
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300">
                    Tidak memerlukan gateway WA berbayar. Cukup klik tombol hijau pada surat untuk mengirim kabar perkembangan atau link unduh surat langsung ke WhatsApp pemohon.
                  </p>
                </div>
              </div>
            </div>

            {letters.map((item) => {
              const cleanApplicantPhone = getCleanWaNumber(item.applicant.phone);
              const waMessage = `Halo Bpk/Ibu ${item.applicant.name},\n\nPemberitahuan dari Kantor Balai Desa Karangwaluh:\nPermohonan dokumen "${item.letterType}" Anda (No. Registrasi: ${item.id}) saat ini berstatus: *${item.status}*.\n\nCatatan Pamong: ${letterNotes[item.id] || item.officerNote || (item.status === "Siap Diambil" ? "Surat fisik resmi Anda telah selesai diproses, ditandatangani Kepala Desa, dan dibubuhi stempel basah. Silakan datang langsung ke Kantor Balai Desa Karangwaluh pada jam pelayanan untuk mengambil surat fisik Anda." : "Dokumen permohonan sedang dalam tahapan proses pamong desa.")}\n\n🏢 Lokasi Pengambilan: Meja Pelayanan Balai Desa Karangwaluh\n🕒 Jam Layanan: Senin - Kamis (08.00 - 15.00 WIB) | Jumat (08.00 - 14.30 WIB)\n🔍 Lacak Status: http://localhost:3000/lacak\n\nTerima kasih.\n*Pemerintah Desa Karangwaluh, Kec. Sampung*`;

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-emerald-900/30 rounded-3xl p-6 border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-emerald-800/40">
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

                    <div className="text-left sm:text-right">
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
                      Catatan Petugas (Akan Disertakan Saat Kirim Kabar via WhatsApp):
                    </label>
                    <input
                      type="text"
                      value={letterNotes[item.id] !== undefined ? letterNotes[item.id] : item.officerNote || ""}
                      onChange={(e) =>
                        setLetterNotes({ ...letterNotes, [item.id]: e.target.value })
                      }
                      placeholder="Contoh: Surat sudah ditandatangani Kepala Desa dan siap diambil di meja pelayanan."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Tombol Pengubah Status & Aksi WhatsApp */}
                  <div>
                    <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Ubah Status & Kirim Notifikasi:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
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

                      {/* 1-Click Direct WhatsApp Click-to-Chat (Free) */}
                      {cleanApplicantPhone && (
                        <a
                          href={`https://wa.me/${cleanApplicantPhone}?text=${encodeURIComponent(waMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-98"
                          title="Buka WhatsApp untuk kirim notifikasi resmi ke pemohon"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Kirim Kabar ke WA Pemohon</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      )}


                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PENGADUAN WARGA */}
        {/* ======================================================== */}
        {activeTab === "pengaduan" && (
          <div className="space-y-4">
            {/* Direct WhatsApp Response Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100">
                    Kirim Tanggapan Aduan via WhatsApp (100% Gratis & Personal)
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300">
                    Petugas dapat langsung merespons pengaduan warga ke nomor WhatsApp pelapor secara pribadi dengan satu klik.
                  </p>
                </div>
              </div>
            </div>

            {complaints.map((item) => {
              const cleanReporterPhone = getCleanWaNumber(item.phone);
              const complaintWaMsg = `Halo Bpk/Ibu ${item.reporterName},\n\nTanggapan Pengaduan dari Kantor Balai Desa Karangwaluh:\nLaporan Anda dengan No. Tiket *${item.id}* (Kategori: ${item.category}) saat ini berstatus: *${item.status}*.\n\n💬 Tanggapan Pamong Desa: ${complaintNotes[item.id] || item.officerNote || (item.status === "Selesai" ? "Laporan pengaduan Anda telah selesai ditindaklanjuti dan diselesaikan oleh pamong desa terkait." : "Laporan telah kami terima dan sedang dalam penanganan pamong desa.")}\n\n🔍 Lacak Perkembangan Aduan: http://localhost:3000/lacak\n\nTerima kasih atas kepedulian Anda dalam menjaga dan membangun kemajuan Desa Karangwaluh.\n*Pemerintah Desa Karangwaluh, Kec. Sampung*`;

              return (
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

                    <div className="text-left sm:text-right">
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
                      Tanggapan Pamong Desa (Akan Disertakan Saat Kirim Tanggapan via WhatsApp):
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
                      placeholder="Contoh: Tim pemeliharaan telah meninjau lokasi dan material siap dipasang."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Tombol Pengubah Status & Kirim WhatsApp */}
                  <div>
                    <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Ubah Status & Kirim Tanggapan:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
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

                      {/* 1-Click Direct WhatsApp Click-to-Chat (Free) */}
                      {cleanReporterPhone && (
                        <a
                          href={`https://wa.me/${cleanReporterPhone}?text=${encodeURIComponent(complaintWaMsg)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-98 sm:ml-auto"
                          title="Buka WhatsApp untuk kirim tanggapan resmi ke pelapor"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Kirim Tanggapan ke WA Pelapor</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PROFIL & KONTAK DESA (GANTI NOMOR SENDIRI) */}
        {/* ======================================================== */}
        {activeTab === "kontak" && (
          <div className="bg-white dark:bg-emerald-900/30 rounded-3xl p-6 sm:p-8 border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm">
            <div className="mb-6 pb-4 border-b border-gray-100 dark:border-emerald-800/50">
              <h2 className="text-xl font-black text-emerald-950 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <span>Pengaturan Nomor Kontak & Profil Balai Desa</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Ganti nomor WhatsApp kantor desa, nomor telepon, nama kepala desa, jam buka, dan alamat. Perubahan langsung otomatis tersambung ke seluruh tombol chat di website warga!
              </p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* WhatsApp Desa */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
                  <label className="block text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>Nomor WhatsApp Resmi Kantor Desa *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={configForm.whatsapp}
                    onChange={(e) => setConfigForm({ ...configForm, whatsapp: e.target.value })}
                    placeholder="Contoh: 081234567890 atau 6281234567890"
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-emerald-950 text-sm font-semibold focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[11px] text-amber-800 dark:text-amber-300/90 mt-1.5">
                    💡 Semua tombol "Chat via WhatsApp" di landing page & Layanan Mandiri akan langsung membuka nomor ini.
                  </p>
                </div>

                {/* Telepon Kantor */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Nomor Telepon Kantor / Hotline
                  </label>
                  <input
                    type="text"
                    value={configForm.phone}
                    onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value })}
                    placeholder="Contoh: (0352) 7129052"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-sm"
                  />
                </div>

                {/* Email Resmi */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Email Resmi Desa
                  </label>
                  <input
                    type="email"
                    value={configForm.email}
                    onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                    placeholder="pelayanan@karangwaluh-sampung.desa.id"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-sm"
                  />
                </div>

                {/* Kepala Desa */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Nama Kepala Desa (Kades)</span>
                  </label>
                  <input
                    type="text"
                    value={configForm.headName}
                    onChange={(e) => setConfigForm({ ...configForm, headName: e.target.value })}
                    placeholder="Sukeni"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-sm font-semibold"
                  />
                </div>

                {/* Periode Jabatan */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Periode Masa Jabatan
                  </label>
                  <input
                    type="text"
                    value={configForm.headPeriod}
                    onChange={(e) => setConfigForm({ ...configForm, headPeriod: e.target.value })}
                    placeholder="2025 - 2031"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-sm"
                  />
                </div>

                {/* Jam Pelayanan Senin-Kamis */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Jam Layanan (Senin - Kamis)
                  </label>
                  <input
                    type="text"
                    value={configForm.weekdays}
                    onChange={(e) => setConfigForm({ ...configForm, weekdays: e.target.value })}
                    placeholder="Senin – Kamis: 08.00 – 15.00 WIB"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-sm"
                  />
                </div>

                {/* Jam Layanan Jumat */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Jam Layanan (Jumat)
                  </label>
                  <input
                    type="text"
                    value={configForm.friday}
                    onChange={(e) => setConfigForm({ ...configForm, friday: e.target.value })}
                    placeholder="Jumat: 08.00 – 14.30 WIB"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-sm"
                  />
                </div>

                {/* Jam Layanan Akhir Pekan */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Layanan Akhir Pekan (Sabtu & Minggu)
                  </label>
                  <input
                    type="text"
                    value={configForm.weekend}
                    onChange={(e) => setConfigForm({ ...configForm, weekend: e.target.value })}
                    placeholder="Sabtu & Minggu: Libur Pelayanan Kantor"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-sm"
                  />
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Alamat Balai Desa</span>
                </label>
                <textarea
                  rows={2}
                  value={configForm.address}
                  onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                  placeholder="Balai Desa Karangwaluh, Jl. Raya Sampung, Desa Karangwaluh, Kec. Sampung, Kab. Ponorogo..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-sm"
                />
              </div>

              {/* Statistik Desa */}
              <div className="pt-4 border-t border-gray-100 dark:border-emerald-800/50">
                <h3 className="text-sm font-black text-emerald-950 dark:text-white mb-3">
                  Statistik Utama Desa (Ditampilkan Pada Counter Beranda)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      Jumlah Penduduk (Jiwa)
                    </label>
                    <input
                      type="number"
                      value={configForm.population}
                      onChange={(e) => setConfigForm({ ...configForm, population: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      Jumlah Kepala Keluarga (KK)
                    </label>
                    <input
                      type="number"
                      value={configForm.families}
                      onChange={(e) => setConfigForm({ ...configForm, families: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      Jumlah UMKM Aktif
                    </label>
                    <input
                      type="number"
                      value={configForm.activeUmkm}
                      onChange={(e) => setConfigForm({ ...configForm, activeUmkm: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-950/50 text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-emerald-800/50">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-emerald-300" />
                  <span>Simpan Perubahan Kontak & Profil</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: KELOLA PRODUK UMKM */}
        {/* ======================================================== */}
        {activeTab === "umkm" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-emerald-900/30 p-6 rounded-3xl border border-emerald-900/10 dark:border-emerald-800/40">
              <div>
                <h2 className="text-xl font-black text-emerald-950 dark:text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  <span>Katalog Produk UMKM & Usaha Warga</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Operator dapat menambah produk lokal baru, mengubah nomor WhatsApp pemesanan, dan menghapus produk.
                </p>
              </div>

              <button
                onClick={() => setShowAddUmkm(!showAddUmkm)}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddUmkm ? "Tutup Form" : "Tambah Produk UMKM"}</span>
              </button>
            </div>

            {/* Form Tambah UMKM */}
            {showAddUmkm && (
              <div className="bg-amber-50/50 dark:bg-emerald-950/40 p-6 sm:p-8 rounded-3xl border border-amber-300 dark:border-amber-800/40 shadow-sm animate-in slide-in-from-top-2 duration-200">
                <h3 className="text-base font-black text-amber-950 dark:text-amber-200 mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Input Data Produk UMKM Baru</span>
                </h3>

                <form onSubmit={handleAddUmkm} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Nama Produk UMKM *
                      </label>
                      <input
                        type="text"
                        required
                        value={umkmForm.name}
                        onChange={(e) => setUmkmForm({ ...umkmForm, name: e.target.value })}
                        placeholder="Contoh: Keripik Tempe Renyah Gurih"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Kategori Usaha *
                      </label>
                      <input
                        type="text"
                        required
                        value={umkmForm.category}
                        onChange={(e) => setUmkmForm({ ...umkmForm, category: e.target.value })}
                        placeholder="Olahan Makanan Ringan / Kerajinan / Pertanian"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Nama Pemilik / Pengrajin *
                      </label>
                      <input
                        type="text"
                        required
                        value={umkmForm.sellerName}
                        onChange={(e) => setUmkmForm({ ...umkmForm, sellerName: e.target.value })}
                        placeholder="Contoh: Ibu Siti (RT 02 Dusun Krajan)"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Nomor WhatsApp Penjual *
                      </label>
                      <input
                        type="text"
                        required
                        value={umkmForm.whatsappNumber}
                        onChange={(e) => setUmkmForm({ ...umkmForm, whatsappNumber: e.target.value })}
                        placeholder="081234567890"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Kisaran Harga
                      </label>
                      <input
                        type="text"
                        value={umkmForm.priceEstimate}
                        onChange={(e) => setUmkmForm({ ...umkmForm, priceEstimate: e.target.value })}
                        placeholder="Contoh: Rp10.000 - Rp25.000"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Foto Produk (Upload atau Pilih Foto Tersedia)
                      </label>
                      <div className="flex gap-2 items-center">
                        <label className="px-3 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold cursor-pointer hover:bg-emerald-200 flex items-center gap-1.5 shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto dari HP/Laptop</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (val) => setUmkmForm({ ...umkmForm, image: val }))}
                            className="hidden"
                          />
                        </label>
                        <select
                          onChange={(e) => setUmkmForm({ ...umkmForm, image: e.target.value })}
                          className="px-2.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-xs flex-1 truncate"
                        >
                          <option value="">Atau Pilih Foto Desa...</option>
                          {presetImages.map((p) => (
                            <option key={p.path} value={p.path}>{p.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Deskripsi Singkat Produk
                    </label>
                    <textarea
                      rows={2}
                      value={umkmForm.description}
                      onChange={(e) => setUmkmForm({ ...umkmForm, description: e.target.value })}
                      placeholder="Camilan renyah terbuat dari kedelai pilihan warga, cocok untuk oleh-oleh khas Karangwaluh."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-sm"
                    />
                  </div>

                  {/* Image Preview */}
                  {umkmForm.image && (
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-emerald-950 rounded-2xl border border-emerald-200 dark:border-emerald-800 w-fit">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                        <Image src={umkmForm.image} alt="Preview" fill className="object-cover" unoptimized />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Pratinjau Foto Produk Terpilih</span>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddUmkm(false)}
                      className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-emerald-900/40 text-gray-700 dark:text-gray-300 text-xs font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm"
                    >
                      Simpan Produk UMKM
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List Produk UMKM */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-emerald-900/30 rounded-3xl overflow-hidden border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-4/3 w-full bg-emerald-100 dark:bg-emerald-950 overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      <span className="absolute top-3 left-3 bg-white/90 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        {p.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <h4 className="text-base font-black text-emerald-950 dark:text-white">
                        {p.name}
                      </h4>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                        {p.sellerName} • {p.priceEstimate}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {p.description}
                      </p>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 font-mono mt-2 bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-lg">
                        WA: +{p.whatsappNumber}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 dark:border-emerald-800/40 mt-2">
                    <a
                      href={`https://wa.me/${p.whatsappNumber}?text=${encodeURIComponent(p.orderMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1"
                    >
                      <span>Uji Chat WA</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => handleDeleteUmkm(p.id, p.name)}
                      className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                      title="Hapus Produk"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: KELOLA GALERI FOTO */}
        {/* ======================================================== */}
        {activeTab === "galeri" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-emerald-900/30 p-6 rounded-3xl border border-emerald-900/10 dark:border-emerald-800/40">
              <div>
                <h2 className="text-xl font-black text-emerald-950 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  <span>Kelola Foto Galeri Keindahan & Kegiatan Desa</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Tambah foto kegiatan warga, dokumentasi balai desa, pentas reyog, dan pemandangan alam Karangwaluh.
                </p>
              </div>

              <button
                onClick={() => setShowAddGallery(!showAddGallery)}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddGallery ? "Tutup Form" : "Tambah Foto Galeri"}</span>
              </button>
            </div>

            {/* Form Tambah Galeri */}
            {showAddGallery && (
              <div className="bg-amber-50/50 dark:bg-emerald-950/40 p-6 sm:p-8 rounded-3xl border border-amber-300 dark:border-amber-800/40 shadow-sm animate-in slide-in-from-top-2 duration-200">
                <h3 className="text-base font-black text-amber-950 dark:text-amber-200 mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Unggah Dokumentasi Foto Desa Baru</span>
                </h3>

                <form onSubmit={handleAddGallery} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Judul Foto *
                      </label>
                      <input
                        type="text"
                        required
                        value={galleryForm.title}
                        onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                        placeholder="Contoh: Kerja Bakti Pembersihan Saluran Irigasi"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Kategori Dokumentasi *
                      </label>
                      <select
                        value={galleryForm.category}
                        onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-sm font-semibold"
                      >
                        <option value="Kegiatan">Kegiatan</option>
                        <option value="Kantor">Kantor</option>
                        <option value="Pelayanan">Pelayanan</option>
                        <option value="Warga">Warga</option>
                        <option value="Panorama">Panorama</option>
                        <option value="UMKM">UMKM</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Sumber Gambar (Pilih File atau Preset Desa)
                      </label>
                      <div className="flex flex-wrap gap-2 items-center">
                        <label className="px-3 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold cursor-pointer hover:bg-emerald-200 flex items-center gap-1.5 shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto dari Perangkat</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (val) => setGalleryForm({ ...galleryForm, src: val }))}
                            className="hidden"
                          />
                        </label>
                        <select
                          onChange={(e) => setGalleryForm({ ...galleryForm, src: e.target.value })}
                          className="px-2.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-xs"
                        >
                          <option value="">Atau Pilih Foto Bawaan Desa...</option>
                          {presetImages.map((p) => (
                            <option key={p.path} value={p.path}>{p.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Keterangan Suasana / Deskripsi Singkat
                      </label>
                      <textarea
                        rows={2}
                        value={galleryForm.description}
                        onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                        placeholder="Gotong royong warga Dusun Krajan membersihkan saluran sawah menjelang musim tanam."
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-sm"
                      />
                    </div>
                  </div>

                  {galleryForm.src && (
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-emerald-950 rounded-2xl border border-emerald-200 dark:border-emerald-800 w-fit">
                      <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-gray-100">
                        <Image src={galleryForm.src} alt="Preview" fill className="object-cover" unoptimized />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Pratinjau Foto Siap Ditambahkan</span>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddGallery(false)}
                      className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-emerald-900/40 text-gray-700 dark:text-gray-300 text-xs font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm"
                    >
                      Tambahkan ke Galeri
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List Foto Galeri */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div
                  key={g.id}
                  className="bg-white dark:bg-emerald-900/30 rounded-2xl overflow-hidden border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm flex flex-col justify-between group"
                >
                  <div className="relative aspect-4/3 w-full bg-gray-100 dark:bg-emerald-950">
                    <Image
                      src={g.src}
                      alt={g.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    <span className="absolute top-2 left-2 bg-emerald-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {g.category}
                    </span>
                  </div>

                  <div className="p-3">
                    <h4 className="text-xs font-bold text-emerald-950 dark:text-white line-clamp-1">
                      {g.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                      {g.description}
                    </p>
                  </div>

                  <div className="p-3 pt-0 flex justify-end border-t border-gray-100 dark:border-emerald-800/40">
                    <button
                      onClick={() => handleDeleteGallery(g.id, g.title)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: PENGUMUMAN & AGENDA DESA */}
        {/* ======================================================== */}
        {activeTab === "pengumuman" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-emerald-900/30 p-6 rounded-3xl border border-emerald-900/10 dark:border-emerald-800/40">
              <div>
                <h2 className="text-xl font-black text-emerald-950 dark:text-white flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  <span>Pengumuman & Agenda Kegiatan Desa</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Tulis pengumuman resmi, jadwal posyandu, info bantuan sosial, atau agenda gotong royong warga.
                </p>
              </div>

              <button
                onClick={() => setShowAddNews(!showAddNews)}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddNews ? "Tutup Form" : "Buat Pengumuman Baru"}</span>
              </button>
            </div>

            {/* Form Tambah Pengumuman */}
            {showAddNews && (
              <div className="bg-amber-50/50 dark:bg-emerald-950/40 p-6 sm:p-8 rounded-3xl border border-amber-300 dark:border-amber-800/40 shadow-sm animate-in slide-in-from-top-2 duration-200">
                <h3 className="text-base font-black text-amber-950 dark:text-amber-200 mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Input Pengumuman / Agenda Baru</span>
                </h3>

                <form onSubmit={handleAddNews} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Judul Pengumuman / Agenda *
                      </label>
                      <input
                        type="text"
                        required
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        placeholder="Contoh: Jadwal Pelayanan Posyandu Balita & Lansia Dusun Krajan"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Kategori *
                      </label>
                      <select
                        value={newsForm.category}
                        onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value as any })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-sm font-semibold"
                      >
                        <option value="Pemberitahuan">Pemberitahuan</option>
                        <option value="Kesehatan">Kesehatan</option>
                        <option value="Pembangunan">Pembangunan</option>
                        <option value="Kegiatan Warga">Kegiatan Warga</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Tanggal Pelaksanaan / Rilis
                      </label>
                      <input
                        type="text"
                        value={newsForm.date}
                        onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                        placeholder="Contoh: 20 Oktober 2026"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Penulis / Penyelenggara
                      </label>
                      <input
                        type="text"
                        value={newsForm.author}
                        onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                        placeholder="Contoh: Tim Penggerak PKK / Bidan Desa"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Isi Ringkasan Pengumuman *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newsForm.summary}
                      onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                      placeholder="Diberitahukan kepada seluruh warga bahwa kegiatan posyandu akan dilaksanakan di Poskesdes Karangwaluh mulai pukul 08.30 WIB..."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-sm"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddNews(false)}
                      className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-emerald-900/40 text-gray-700 dark:text-gray-300 text-xs font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm"
                    >
                      Publikasikan Pengumuman
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List Pengumuman */}
            <div className="space-y-4">
              {newsList.map((n) => (
                <div
                  key={n.id}
                  className="bg-white dark:bg-emerald-900/30 p-5 rounded-3xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                        {n.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {n.date}
                      </span>
                      <span className="text-xs text-gray-400">• Oleh: {n.author}</span>
                    </div>
                    <h3 className="text-base font-black text-emerald-950 dark:text-white">
                      {n.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {n.summary}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteNews(n.id, n.title)}
                    className="p-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors self-end sm:self-center shrink-0"
                    title="Hapus Pengumuman"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
