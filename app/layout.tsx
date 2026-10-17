import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { GlobalToast } from "@/components/GlobalToast";
import { villageConfig } from "@/lib/config";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#064e3b",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://karangwaluh-sampung.desa.id"),
  title: `${villageConfig.name} | Portal Pelayanan Masyarakat Mandiri • Sampung, Ponorogo`,
  description: `Website resmi dan portal pelayanan digital warga ${villageConfig.name}, ${villageConfig.subdistrict}, ${villageConfig.regency}, ${villageConfig.province}. Buat surat keterangan online, sampaikan pengaduan, dan temukan produk olahan UMKM desa.`,
  keywords: [
    "Desa Karangwaluh",
    "Sampung Ponorogo",
    "Balai Desa Karangwaluh",
    "Surat Online Desa",
    "Pengaduan Warga Karangwaluh",
    "UMKM Ponorogo",
    "Sukeni Kepala Desa",
    "Pelayanan Publik Ponorogo",
  ],
  authors: [{ name: "Pemerintah Desa Karangwaluh" }],
  creator: "Pemerintah Desa Karangwaluh",
  icons: {
    icon: "/images/desa/logo.gif",
    apple: "/images/desa/logo.gif",
  },
  openGraph: {
    title: `${villageConfig.name} - Melayani dari Hati`,
    description: `Portal digital pelayanan mandiri warga Desa Karangwaluh, Kec. Sampung, Kab. Ponorogo. Urus surat dan pengaduan dari rumah.`,
    url: villageConfig.contact.website,
    siteName: villageConfig.name,
    images: [
      {
        url: "/images/desa/hero-karangwaluh.jpg",
        width: 1920,
        height: 1080,
        alt: "Pemandangan Sawah dan Perbukitan Desa Karangwaluh Ponorogo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${villageConfig.name} - Portal Pelayanan Warga`,
    description: `Layanan administrasi kependudukan dan aspirasi warga Desa Karangwaluh, Sampung, Ponorogo.`,
    images: ["/images/desa/hero-karangwaluh.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Suspense } from "react";
import { AuthGuard } from "@/components/AuthGuard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} font-sans scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#fcfbf7] dark:bg-[#091a13] text-[#0f291e] dark:text-[#f3f4f6] selection:bg-amber-400 selection:text-emerald-950">
        <Suspense fallback={null}>
          <AuthGuard />
        </Suspense>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        <Suspense fallback={null}>
          <MobileBottomNav />
        </Suspense>
        <Suspense fallback={null}>
          <GlobalToast />
        </Suspense>
      </body>
    </html>
  );
}
