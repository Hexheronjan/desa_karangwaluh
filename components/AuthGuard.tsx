"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isOfficerAuthenticated } from "@/lib/storage";

export function AuthGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const authenticated = isOfficerAuthenticated();

    // 1. Proteksi Halaman Admin: Jika belum login, wajib dialihkan ke /login
    if (pathname.startsWith("/admin-demo") && !authenticated) {
      router.replace("/login");
      return;
    }

    // 2. Proteksi Hak Akses Operator: Jika sedang login sebagai admin/operator,
    //    petugas tidak bisa keluar seenaknya ke halaman publik warga.
    //    Untuk kembali ke website warga, petugas wajib menekan tombol "Keluar" (Logout).
    const isPublicCitizenPage =
      !pathname.startsWith("/admin-demo") &&
      !pathname.startsWith("/login");

    if (authenticated && isPublicCitizenPage) {
      router.replace("/admin-demo");
    }
  }, [pathname, mounted, router]);

  return null;
}
