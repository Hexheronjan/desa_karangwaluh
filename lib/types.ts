export type ComplaintCategory =
  | "Infrastruktur"
  | "Kebersihan"
  | "Keamanan"
  | "Pelayanan Publik"
  | "Lainnya";

export type ComplaintStatus = "Diterima" | "Diproses" | "Selesai";

export interface ComplaintHistoryItem {
  status: ComplaintStatus;
  timestamp: string;
  note: string;
}

export interface ComplaintTicket {
  id: string; // e.g. "PGD-2026-0001"
  createdAt: string;
  reporterName: string;
  isAnonymous: boolean;
  phone: string;
  category: ComplaintCategory;
  location: string;
  description: string;
  photoUrl?: string;
  status: ComplaintStatus;
  history: ComplaintHistoryItem[];
  officerNote?: string;
}

export type LetterType =
  | "Surat Keterangan Domisili"
  | "Surat Keterangan Tidak Mampu (SKTM)"
  | "Surat Pengantar KTP / KK"
  | "Surat Keterangan Usaha (SKU)"
  | "Surat Pengantar SKCK"
  | "Surat Keterangan Kelahiran / Kematian";

export type LetterStatus = "Diajukan" | "Diverifikasi" | "Diproses" | "Siap Diambil";

export interface LetterHistoryItem {
  status: LetterStatus;
  timestamp: string;
  note: string;
}

export interface LetterRequest {
  id: string; // e.g. "SRT-2026-0001"
  createdAt: string;
  letterType: LetterType;
  officialNumber?: string;
  applicant: {
    name: string;
    nik: string; // 16 digits
    gender: "Laki-laki" | "Perempuan";
    birthPlace: string;
    birthDate: string;
    religion: string;
    occupation: string;
    address: string;
    rtRw: string;
    dusun: string;
    purpose: string;
    phone: string; // WhatsApp
  };
  status: LetterStatus;
  history: LetterHistoryItem[];
  officerNote?: string;
  isNotifiedReady?: boolean;
}

export interface VillageNotification {
  id: string;
  title: string;
  message: string;
  type: "surat" | "pengaduan" | "pengumuman";
  relatedId?: string;
  link?: string;
  timestamp: string;
  isRead: boolean;
}
