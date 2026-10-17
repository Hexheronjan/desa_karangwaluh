"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  ExternalLink,
  ShieldCheck,
  HeartHandshake,
  MessageCircle,
} from "lucide-react";
import { villageConfig } from "@/lib/config";
import { getStoredVillageConfig } from "@/lib/storage";
import { formatWhatsAppUrl } from "@/lib/utils";

export function Footer() {
  const [config, setConfig] = React.useState(villageConfig);

  React.useEffect(() => {
    function loadConfig() {
      setConfig(getStoredVillageConfig());
    }
    loadConfig();
    window.addEventListener("village-storage-update", loadConfig);
    return () => window.removeEventListener("village-storage-update", loadConfig);
  }, []);

  const waHelpUrl = formatWhatsAppUrl(
    config.contact.whatsapp,
    "Halo Admin Pelayanan Desa Karangwaluh, saya ingin bertanya tentang layanan desa."
  );

  return (
    <footer className="no-print bg-emerald-950 text-emerald-100 border-t border-emerald-900/60 pb-20 lg:pb-8 pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Village Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 p-2 border border-emerald-700/40 flex items-center justify-center">
                <Image
                  src="/images/desa/logo.gif"
                  alt="Lambang Kabupaten Ponorogo - Desa Karangwaluh"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white tracking-tight">
                  {config.name}
                </h3>
                <p className="text-xs text-emerald-300">
                  {config.subdistrict}, {config.regency}
                </p>
              </div>
            </div>
            <p className="text-sm text-emerald-200/80 leading-relaxed">
              Portal pelayanan administrasi mandiri masyarakat Desa Karangwaluh. Warga dapat mengurus surat, lapor aduan, dan mengakses info UMKM dengan mudah dan cepat dari rumah.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-900/80 border border-emerald-700/50 text-xs text-amber-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Kepala Desa: {config.headOfVillage.name}</span>
              </span>
            </div>
          </div>

          {/* Col 2: Jam Pelayanan & Kontak */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Pelayanan & Lokasi
            </h4>
            <div className="space-y-3 text-sm text-emerald-200/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{config.address}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{config.serviceHours.weekdays}</p>
                  <p className="text-xs text-emerald-300/80">{config.serviceHours.friday}</p>
                  <p className="text-xs text-amber-300/90 mt-0.5">{config.serviceHours.weekend}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Kecamatan: {config.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{config.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Menu Cepat */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Menu Layanan
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/80">
              <li>
                <Link href="/surat" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span>Buat Surat Keterangan Online</span>
                </Link>
              </li>

              <li>
                <Link href="/pengaduan" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span>Sampaikan Pengaduan Warga</span>
                </Link>
              </li>
              <li>
                <Link href="/lacak" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span>Lacak Tiket & Status Berkas</span>
                </Link>
              </li>
              <li>
                <Link href="/layanan-mandiri" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span>Pusat Layanan Mandiri WhatsApp</span>
                </Link>
              </li>
              <li>
                <Link href="/umkm" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span>Katalog Produk Lokal UMKM</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Peta & Bantuan Cepat */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Bantuan Langsung
            </h4>
            <p className="text-xs text-emerald-200/80">
              Butuh konsultasi cepat atau bantuan darurat? Hubungi petugas piket desa melalui WhatsApp resmi.
            </p>
            <a
              href={waHelpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm shadow-md transition-all active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Kantor Desa</span>
            </a>
            <div className="pt-2">
              <a
                href={config.coordinates.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 underline decoration-emerald-500/50"
              >
                <span>Buka Peta Kantor Desa di Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400">
          <p>
            © 2026 {config.name}, {config.subdistrict}, {config.regency}. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4 text-emerald-400/80">
            <span>Kecamatan Sampung • Kabupaten Ponorogo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
