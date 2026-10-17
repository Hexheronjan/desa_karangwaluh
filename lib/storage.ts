import {
  ComplaintTicket,
  ComplaintStatus,
  LetterRequest,
  LetterStatus,
  VillageNotification,
  ComplaintCategory,
  LetterType,
} from "./types";
import {
  villageConfig,
  localProducts,
  villageNews,
  villageGallery,
  VillageConfig,
  ProductUmkm,
  NewsItem,
  GalleryItem,
} from "./config";

const STORAGE_KEYS = {
  COMPLAINTS: "karangwaluh_demo_complaints_v1",
  LETTERS: "karangwaluh_demo_letters_v1",
  NOTIFICATIONS: "karangwaluh_demo_notifications_v1",
  CONFIG: "karangwaluh_demo_config_v1",
  PRODUCTS: "karangwaluh_demo_products_v1",
  GALLERY: "karangwaluh_demo_gallery_v1",
  NEWS: "karangwaluh_demo_news_v1",
  AUTH_SESSION: "karangwaluh_demo_auth_session_v1",
  INITIALIZED: "karangwaluh_demo_initialized_v2",
};

// Safe localStorage helper
function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (error) {
    console.error(`[Storage Error] Gagal membaca ${key}:`, error);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Emit event for real-time reactivity across components
    window.dispatchEvent(new CustomEvent("village-storage-update", { detail: { key } }));
    return true;
  } catch (error) {
    console.error(`[Storage Error] Gagal menyimpan ${key}:`, error);
    return false;
  }
}

// Initial demo seeds
const initialComplaints: ComplaintTicket[] = [
  {
    id: "PGD-2026-0001",
    createdAt: "2026-10-15T09:30:00.000Z",
    reporterName: "Budi Santoso",
    isAnonymous: false,
    phone: "081234567891",
    category: "Infrastruktur",
    location: "RT 02 / RW 01, Dusun Krajan (Dekat Jembatan Timur)",
    description: "Lampu penerangan jalan utama dekat jembatan mati sudah 3 hari, jalan agak gelap saat malam hari.",
    status: "Diproses",
    officerNote: "Petugas desa sudah menjadwalkan penggantian bohlam LED PJU bersama teknisi kecamatan.",
    history: [
      {
        status: "Diterima",
        timestamp: "2026-10-15T09:30:00.000Z",
        note: "Pengaduan diterima sistem layanan warga Desa Karangwaluh.",
      },
      {
        status: "Diproses",
        timestamp: "2026-10-16T10:15:00.000Z",
        note: "Diteruskan ke Seksi Kesejahteraan & Pembangunan Desa.",
      },
    ],
  },
];

const initialLetters: LetterRequest[] = [
  {
    id: "SRT-2026-0001",
    createdAt: "2026-10-14T11:00:00.000Z",
    letterType: "Surat Keterangan Domisili",
    officialNumber: "470/08/405.29.11/2026",
    applicant: {
      name: "Siti Rahmawati",
      nik: "3502114508980002",
      gender: "Perempuan",
      birthPlace: "Ponorogo",
      birthDate: "1998-08-15",
      religion: "Islam",
      occupation: "Wiraswasta",
      address: "RT 03 / RW 01",
      rtRw: "RT 03 / RW 01",
      dusun: "Dusun Krajan",
      purpose: "Persyaratan pembukaan rekening bank usaha UMKM keripik",
      phone: "081398765432",
    },
    status: "Siap Diambil",
    officerNote: "Surat fisik resmi sudah ditandatangani Kepala Desa dan dibubuhi stempel basah. Silakan diambil langsung di Meja Pelayanan Balai Desa Karangwaluh pada jam kerja.",
    history: [
      {
        status: "Diajukan",
        timestamp: "2026-10-14T11:00:00.000Z",
        note: "Permohonan diajukan oleh pemohon via portal online.",
      },
      {
        status: "Diverifikasi",
        timestamp: "2026-10-14T13:20:00.000Z",
        note: "Data NIK dan identitas kependudukan telah diverifikasi sesuai basis data.",
      },
      {
        status: "Diproses",
        timestamp: "2026-10-15T08:45:00.000Z",
        note: "Pencetakan draf dan penomoran resmi surat.",
      },
      {
        status: "Siap Diambil",
        timestamp: "2026-10-15T10:30:00.000Z",
        note: "Surat selesai dan siap diambil di meja pelayanan desa.",
      },
    ],
    isNotifiedReady: true,
  },
];

const initialNotifications: VillageNotification[] = [
  {
    id: "notif-1",
    title: "Surat Selesai: Surat Keterangan Domisili",
    message: "Permohonan surat kode SRT-2026-0001 berstatus SIAP DIAMBIL langsung di Balai Desa Karangwaluh.",
    type: "surat",
    relatedId: "SRT-2026-0001",
    link: "/lacak?kode=SRT-2026-0001",
    timestamp: "2026-10-15T10:30:00.000Z",
    isRead: false,
  },
  {
    id: "notif-2",
    title: "Pengaduan Diproses: PGD-2026-0001",
    message: "Laporan PGD-2026-0001 mengenai Penerangan Jalan telah diproses oleh petugas pembangunan desa.",
    type: "pengaduan",
    relatedId: "PGD-2026-0001",
    link: "/lacak?kode=PGD-2026-0001",
    timestamp: "2026-10-16T10:15:00.000Z",
    isRead: false,
  },
  {
    id: "notif-3",
    title: "Selamat Datang di Portal Warga Karangwaluh",
    message: "Nikmati kemudahan layanan surat online, pengaduan 24 jam, dan katalog UMKM Desa Karangwaluh dari HP Anda.",
    type: "pengumuman",
    link: "/",
    timestamp: "2026-10-17T08:00:00.000Z",
    isRead: true,
  },
];

// Initialize Storage
export function initVillageStorage(): void {
  if (typeof window === "undefined") return;
  try {
    if (!window.localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) {
      window.localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(initialComplaints));
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.LETTERS)) {
      window.localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(initialLetters));
    } else {
      // Auto-migrate: remove any old "unduh cetak digital" notes from user's browser
      const existing = window.localStorage.getItem(STORAGE_KEYS.LETTERS);
      if (existing && existing.includes("unduh cetak digital")) {
        try {
          const parsed: LetterRequest[] = JSON.parse(existing);
          const sanitized = parsed.map((item) => {
            if (item.officerNote && item.officerNote.includes("unduh cetak digital")) {
              return {
                ...item,
                officerNote: "Surat fisik resmi sudah ditandatangani Kepala Desa dan dibubuhi stempel basah. Silakan diambil langsung di Meja Pelayanan Balai Desa Karangwaluh pada jam kerja.",
              };
            }
            return item;
          });
          window.localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(sanitized));
        } catch {}
      }
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      window.localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
    } else {
      // Auto-migrate: redirect any old /surat/saya links or cetak online in notifications
      const notifs = window.localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (notifs && (notifs.includes("/surat/saya") || notifs.includes("cetak online"))) {
        try {
          const parsedNotifs = JSON.parse(notifs);
          const cleanedNotifs = parsedNotifs.map((n: VillageNotification) => ({
            ...n,
            link: n.link === "/surat/saya" ? (n.relatedId ? `/lacak?kode=${n.relatedId}` : "/lacak") : n.link,
            message: n.message.replace(" atau dicetak online", "").replace(" atau cetak online", "").replace(" Silakan cetak online atau", " Silakan"),
          }));
          window.localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(cleanedNotifs));
        } catch {}
      }
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.CONFIG)) {
      window.localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(villageConfig));
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      window.localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(localProducts));
    } else {
      const existingProds = window.localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (existingProds && existingProds.includes(".svg")) {
        try {
          const parsedProds = JSON.parse(existingProds);
          const migratedProds = parsedProds.map((p: ProductUmkm) => ({
            ...p,
            image: p.image.replace("umkm-madu.svg", "umkm-madu.jpg").replace("umkm-anyaman.svg", "umkm-anyaman.jpg"),
          }));
          window.localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(migratedProds));
        } catch {}
      }
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.GALLERY)) {
      window.localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(villageGallery));
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.NEWS)) {
      window.localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(villageNews));
    }
    window.localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
  } catch (e) {
    console.error("Gagal inisialisasi storage:", e);
  }
}

// COMPLAINTS API
export function getComplaints(): ComplaintTicket[] {
  initVillageStorage();
  return safeGet<ComplaintTicket[]>(STORAGE_KEYS.COMPLAINTS, initialComplaints);
}

export function getComplaintById(id: string): ComplaintTicket | undefined {
  const list = getComplaints();
  return list.find((c) => c.id.trim().toUpperCase() === id.trim().toUpperCase());
}

export function createComplaint(data: {
  reporterName: string;
  isAnonymous: boolean;
  phone: string;
  category: ComplaintCategory;
  location: string;
  description: string;
  photoUrl?: string;
}): ComplaintTicket {
  const current = getComplaints();
  const year = new Date().getFullYear();
  const count = current.length + 1;
  const id = `PGD-${year}-${String(count).padStart(4, "0")}`;
  const now = new Date().toISOString();

  const newTicket: ComplaintTicket = {
    id,
    createdAt: now,
    reporterName: data.isAnonymous ? "Warga Karangwaluh (Anonim)" : data.reporterName,
    isAnonymous: data.isAnonymous,
    phone: data.phone,
    category: data.category,
    location: data.location,
    description: data.description,
    photoUrl: data.photoUrl,
    status: "Diterima",
    history: [
      {
        status: "Diterima",
        timestamp: now,
        note: "Pengaduan baru berhasil dikirim dan masuk ke antrean verifikasi perangkat desa.",
      },
    ],
  };

  const updated = [newTicket, ...current];
  safeSet(STORAGE_KEYS.COMPLAINTS, updated);

  // Add notification
  createNotification({
    title: `Pengaduan Terkirim: ${id}`,
    message: `Pengaduan kategori ${data.category} berhasil dicatat dengan kode tiket ${id}.`,
    type: "pengaduan",
    relatedId: id,
    link: `/lacak?kode=${id}`,
  });

  return newTicket;
}

export function updateComplaintStatus(
  id: string,
  newStatus: ComplaintStatus,
  officerNote?: string
): ComplaintTicket | null {
  const list = getComplaints();
  const index = list.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const item = { ...list[index] };
  item.status = newStatus;
  if (officerNote) item.officerNote = officerNote;
  item.history = [
    ...item.history,
    {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: officerNote || `Status pengaduan diperbarui menjadi ${newStatus}.`,
    },
  ];

  list[index] = item;
  safeSet(STORAGE_KEYS.COMPLAINTS, list);

  // Trigger notification to user
  createNotification({
    title: `Update Pengaduan: ${id}`,
    message: `Laporan Anda kini berstatus: ${newStatus.toUpperCase()}${officerNote ? ` ("${officerNote}")` : ""}`,
    type: "pengaduan",
    relatedId: id,
    link: `/lacak?kode=${id}`,
  });

  return item;
}

// LETTERS API
export function getLetters(): LetterRequest[] {
  initVillageStorage();
  return safeGet<LetterRequest[]>(STORAGE_KEYS.LETTERS, initialLetters);
}

export function getLetterById(id: string): LetterRequest | undefined {
  const list = getLetters();
  return list.find((item) => item.id.trim().toUpperCase() === id.trim().toUpperCase());
}

export function createLetter(data: {
  letterType: LetterType;
  applicant: {
    name: string;
    nik: string;
    gender: "Laki-laki" | "Perempuan";
    birthPlace: string;
    birthDate: string;
    religion: string;
    occupation: string;
    address: string;
    rtRw: string;
    dusun: string;
    purpose: string;
    phone: string;
  };
}): LetterRequest {
  const current = getLetters();
  const year = new Date().getFullYear();
  const count = current.length + 1;
  const id = `SRT-${year}-${String(count).padStart(4, "0")}`;
  const now = new Date().toISOString();

  const newLetter: LetterRequest = {
    id,
    createdAt: now,
    letterType: data.letterType,
    applicant: data.applicant,
    status: "Diajukan",
    history: [
      {
        status: "Diajukan",
        timestamp: now,
        note: "Permohonan surat berhasil dikirim melalui portal online Desa Karangwaluh.",
      },
    ],
  };

  const updated = [newLetter, ...current];
  safeSet(STORAGE_KEYS.LETTERS, updated);

  // Add notification
  createNotification({
    title: `Permohonan Surat: ${id}`,
    message: `Permohonan ${data.letterType} berhasil diajukan atas nama ${data.applicant.name}.`,
    type: "surat",
    relatedId: id,
    link: `/lacak?kode=${id}`,
  });

  return newLetter;
}

export function updateLetterStatus(
  id: string,
  newStatus: LetterStatus,
  officerNote?: string,
  officialNumber?: string
): LetterRequest | null {
  const list = getLetters();
  const index = list.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const item = { ...list[index] };
  item.status = newStatus;
  if (officerNote) item.officerNote = officerNote;
  if (officialNumber) item.officialNumber = officialNumber;
  else if (newStatus === "Siap Diambil" && !item.officialNumber) {
    const yr = new Date().getFullYear();
    const rand = Math.floor(10 + Math.random() * 89);
    item.officialNumber = `470/${rand}/405.29.11/${yr}`;
  }

  item.history = [
    ...item.history,
    {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: officerNote || `Status surat kini: ${newStatus}.`,
    },
  ];

  list[index] = item;
  safeSet(STORAGE_KEYS.LETTERS, list);

  // Push notification with emphasis if "Siap Diambil"
  createNotification({
    title:
      newStatus === "Siap Diambil"
        ? `🎉 Surat Anda Siap: ${item.letterType}`
        : `Update Permohonan Surat: ${id}`,
    message:
      newStatus === "Siap Diambil"
        ? `Surat ${item.letterType} (${id}) telah selesai dibuat dan ditandatangani Kepala Desa. Silakan ambil fisik surat resmi di Balai Desa Karangwaluh.`
        : `Status surat (${id}) kini: ${newStatus.toUpperCase()}${officerNote ? ` ("${officerNote}")` : ""}`,
    type: "surat",
    relatedId: id,
    link: `/lacak?kode=${id}`,
  });

  return item;
}

// NOTIFICATIONS API
export function getNotifications(): VillageNotification[] {
  initVillageStorage();
  return safeGet<VillageNotification[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
}

export function createNotification(data: {
  title: string;
  message: string;
  type: "surat" | "pengaduan" | "pengumuman";
  relatedId?: string;
  link?: string;
}): VillageNotification {
  const list = getNotifications();
  const newNotif: VillageNotification = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: data.title,
    message: data.message,
    type: data.type,
    relatedId: data.relatedId,
    link: data.link,
    timestamp: new Date().toISOString(),
    isRead: false,
  };

  const updated = [newNotif, ...list];
  safeSet(STORAGE_KEYS.NOTIFICATIONS, updated);
  return newNotif;
}

export function markNotificationRead(id: string): void {
  const list = getNotifications();
  const updated = list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  safeSet(STORAGE_KEYS.NOTIFICATIONS, updated);
}

export function markAllNotificationsRead(): void {
  const list = getNotifications();
  const updated = list.map((n) => ({ ...n, isRead: true }));
  safeSet(STORAGE_KEYS.NOTIFICATIONS, updated);
}

export function getUnreadNotificationCount(): number {
  const list = getNotifications();
  return list.filter((n) => !n.isRead).length;
}

// ==========================================
// VILLAGE CONFIG & CONTACT CMS API
// ==========================================
export function getStoredVillageConfig(): VillageConfig {
  initVillageStorage();
  return safeGet<VillageConfig>(STORAGE_KEYS.CONFIG, villageConfig);
}

export function updateStoredVillageConfig(updates: Partial<VillageConfig>): VillageConfig {
  const current = getStoredVillageConfig();
  const updated: VillageConfig = {
    ...current,
    ...updates,
    contact: {
      ...current.contact,
      ...(updates.contact || {}),
    },
    headOfVillage: {
      ...current.headOfVillage,
      ...(updates.headOfVillage || {}),
    },
    serviceHours: {
      ...current.serviceHours,
      ...(updates.serviceHours || {}),
    },
    statistics: {
      ...current.statistics,
      ...(updates.statistics || {}),
    },
  };
  safeSet(STORAGE_KEYS.CONFIG, updated);
  return updated;
}

// ==========================================
// PRODUK UMKM CMS API
// ==========================================
export function getStoredProducts(): ProductUmkm[] {
  initVillageStorage();
  return safeGet<ProductUmkm[]>(STORAGE_KEYS.PRODUCTS, localProducts);
}

export function addProductUmkm(data: Omit<ProductUmkm, "id">): ProductUmkm {
  const list = getStoredProducts();
  const newProduct: ProductUmkm = {
    ...data,
    id: `umkm-${Date.now()}`,
  };
  const updated = [newProduct, ...list];
  safeSet(STORAGE_KEYS.PRODUCTS, updated);
  return newProduct;
}

export function deleteProductUmkm(id: string): boolean {
  const list = getStoredProducts();
  const updated = list.filter((p) => p.id !== id);
  return safeSet(STORAGE_KEYS.PRODUCTS, updated);
}

// ==========================================
// FOTO GALERI DESA CMS API
// ==========================================
export function getStoredGallery(): GalleryItem[] {
  initVillageStorage();
  return safeGet<GalleryItem[]>(STORAGE_KEYS.GALLERY, villageGallery);
}

export function addGalleryItem(data: Omit<GalleryItem, "id">): GalleryItem {
  const list = getStoredGallery();
  const newItem: GalleryItem = {
    ...data,
    id: `gal-${Date.now()}`,
  };
  const updated = [newItem, ...list];
  safeSet(STORAGE_KEYS.GALLERY, updated);
  return newItem;
}

export function deleteGalleryItem(id: string): boolean {
  const list = getStoredGallery();
  const updated = list.filter((g) => g.id !== id);
  return safeSet(STORAGE_KEYS.GALLERY, updated);
}

// ==========================================
// PENGUMUMAN & AGENDA DESA CMS API
// ==========================================
export function getStoredNews(): NewsItem[] {
  initVillageStorage();
  return safeGet<NewsItem[]>(STORAGE_KEYS.NEWS, villageNews);
}

export function addVillageNews(data: Omit<NewsItem, "id">): NewsItem {
  const list = getStoredNews();
  const newItem: NewsItem = {
    ...data,
    id: `berita-${Date.now()}`,
  };
  const updated = [newItem, ...list];
  safeSet(STORAGE_KEYS.NEWS, updated);
  return newItem;
}

export function deleteVillageNews(id: string): boolean {
  const list = getStoredNews();
  const updated = list.filter((n) => n.id !== id);
  return safeSet(STORAGE_KEYS.NEWS, updated);
}

// ==========================================
// OFFICER AUTHENTICATION API
// ==========================================
export interface OfficerSession {
  username: string;
  name: string;
  role: string;
  loggedInAt: string;
}

export function getOfficerSession(): OfficerSession | null {
  return safeGet<OfficerSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
}

export function isOfficerAuthenticated(): boolean {
  return !!getOfficerSession();
}

export function loginOfficer(
  username: string,
  password: string
): { success: boolean; message: string; session?: OfficerSession } {
  const u = username.trim().toLowerCase();
  const p = password.trim();

  // Daftar akun demo yang didukung
  const validAccounts = [
    { u: "admin", p: "admin123", name: "Administrator Balai Desa", role: "Super Admin Desa" },
    { u: "operator", p: "karangwaluh", name: "Operator Pelayanan Desa", role: "Operator Pelayanan" },
    { u: "petugas", p: "desa2026", name: "Petugas Pelayanan Warga", role: "Staf Pamong Desa" },
  ];

  const matched = validAccounts.find((acc) => acc.u === u && acc.p === p);

  if (matched) {
    const session: OfficerSession = {
      username: matched.u,
      name: matched.name,
      role: matched.role,
      loggedInAt: new Date().toISOString(),
    };
    safeSet(STORAGE_KEYS.AUTH_SESSION, session);
    return {
      success: true,
      message: `Selamat datang, ${matched.name}! Mengalihkan ke panel operator...`,
      session,
    };
  }

  return {
    success: false,
    message: "Username atau kata sandi tidak cocok. Silakan gunakan kredensial demo yang disediakan.",
  };
}

export function logoutOfficer(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    window.dispatchEvent(
      new CustomEvent("village-storage-update", { detail: { key: STORAGE_KEYS.AUTH_SESSION } })
    );
  } catch (e) {
    console.error("Gagal logout:", e);
  }
}

// ==========================================
// RESET DEMO DATA
// ==========================================
export function resetDemoData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(initialComplaints));
  window.localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(initialLetters));
  window.localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
  window.localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(villageConfig));
  window.localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(localProducts));
  window.localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(villageGallery));
  window.localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(villageNews));
  window.localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  window.localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
  window.dispatchEvent(new CustomEvent("village-storage-update", { detail: { reset: true } }));
}
