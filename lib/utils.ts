import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateIndo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function formatDateOnlyIndo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function isValidNik(nik: string): boolean {
  return /^[0-9]{16}$/.test(nik.trim());
}

export function isValidPhone(phone: string): boolean {
  return /^(08|628|\+628)[0-9]{8,13}$/.test(phone.trim().replace(/[\s-]/g, ""));
}

export function formatWhatsAppUrl(phone: string, message: string): string {
  // Format international 62xxxxxxxxxx
  let cleaned = phone.trim().replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

// PRIVACY PROTECTION MASKING HELPERS
export function maskNik(nik: string): string {
  if (!nik || nik.length < 8) return "****************";
  // Show first 6 digits, mask middle, show last 4 digits (standard government privacy masking)
  return nik.slice(0, 6) + "******" + nik.slice(-4);
}

export function maskName(name: string): string {
  if (!name) return "***";
  const words = name.trim().split(/\s+/);
  return words
    .map((w) => {
      if (w.length <= 2) return w[0] + "*";
      return w[0] + "*".repeat(Math.max(w.length - 2, 2)) + w[w.length - 1];
    })
    .join(" ");
}

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return "***";
  return phone.slice(0, 4) + "****" + phone.slice(-3);
}
