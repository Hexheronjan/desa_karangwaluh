import {
  ComplaintTicket,
  ComplaintStatus,
  LetterRequest,
  LetterStatus,
  VillageNotification,
  ComplaintCategory,
  LetterType,
} from "./types";

const STORAGE_KEYS = {
  COMPLAINTS: "karangwaluh_demo_complaints_v1",
  LETTERS: "karangwaluh_demo_letters_v1",
  NOTIFICATIONS: "karangwaluh_demo_notifications_v1",
  INITIALIZED: "karangwaluh_demo_initialized_v1",
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
    officerNote: "Surat sudah ditandatangani Kepala Desa dan dibubuhi stempel resmi. Silakan diambil di Balai Desa atau unduh cetak digital.",
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
    message: "Permohonan surat kode SRT-2026-0001 atas nama Siti Rahmawati berstatus SIAP DIAMBIL di Balai Desa atau dicetak online.",
    type: "surat",
    relatedId: "SRT-2026-0001",
    link: "/surat/saya",
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
    const isInit = window.localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      window.localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(initialComplaints));
      window.localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(initialLetters));
      window.localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
      window.localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
    }
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
    link: `/surat/saya`,
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
        ? `Surat ${item.letterType} (${id}) telah selesai dibuat dan ditandatangani. Silakan cetak online atau ambil di kantor desa.`
        : `Status surat (${id}) kini: ${newStatus.toUpperCase()}${officerNote ? ` ("${officerNote}")` : ""}`,
    type: "surat",
    relatedId: id,
    link: `/surat/saya`,
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

export function resetDemoData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(initialComplaints));
  window.localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(initialLetters));
  window.localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
  window.localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
  window.dispatchEvent(new CustomEvent("village-storage-update", { detail: { reset: true } }));
}
