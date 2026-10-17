/**
 * KONFIGURASI UTAMA DESA KARANGWALUH
 * Seluruh data desa, jam pelayanan, nomor kontak darurat & WhatsApp tersentralisasi di sini.
 */

export interface VillageConfig {
  name: string;
  subdistrict: string; // Kecamatan
  regency: string; // Kabupaten
  province: string;
  postalCode: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
    embedMapUrl: string;
    googleMapsUrl: string;
  };
  headOfVillage: {
    name: string;
    period: string;
    title: string;
  };
  contact: {
    // TODO: Ganti dengan nomor WhatsApp aktif resmi kantor desa (format internasional: 628xxxxxxxxxx tanpa spasi atau tanda hubung)
    whatsapp: string;
    phone: string;
    // TODO: Ganti dengan alamat email resmi desa
    email: string;
    website: string;
  };
  serviceHours: {
    weekdays: string;
    friday: string;
    weekend: string;
    note: string;
  };
  statistics: {
    population: number;
    families: number;
    areaKm2: number;
    neighborhoodUnits: number; // RT
    citizenUnits: number; // RW
    activeUmkm: number;
  };
}

export const villageConfig: VillageConfig = {
  name: "Desa Karangwaluh",
  subdistrict: "Kecamatan Sampung",
  regency: "Kabupaten Ponorogo",
  province: "Jawa Timur",
  postalCode: "63454",
  address: "Balai Desa Karangwaluh, Jl. Raya Sampung, Desa Karangwaluh, Kec. Sampung, Kab. Ponorogo, Jawa Timur 63454",
  coordinates: {
    lat: -7.8567,
    lng: 111.352,
    embedMapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=111.3320%2C-7.8767%2C111.3720%2C-7.8367&layer=mapnik&marker=-7.8567%2C111.3520",
    googleMapsUrl: "https://www.google.com/maps?q=-7.8567,111.3520",
  },
  headOfVillage: {
    name: "Sukeni", // Kepala Desa hasil PAW 2025/2026
    period: "2025 - 2031",
    title: "Kepala Desa Karangwaluh",
  },
  contact: {
    // TODO: Ganti dengan nomor WhatsApp resmi kantor desa saat mulai dipakai langsung oleh warga
    whatsapp: "6281234567890",
    phone: "(0352) 7129052", // Kantor Kecamatan Sampung / Sentra Pelayanan Ponorogo
    // TODO: Ganti dengan email resmi domain desa.id bila sudah terdaftar di Kominfo
    email: "pelayanan@karangwaluh-sampung.desa.id",
    website: "https://karangwaluh-sampung.desa.id",
  },
  serviceHours: {
    weekdays: "Senin – Kamis: 08.00 – 15.00 WIB",
    friday: "Jumat: 08.00 – 14.30 WIB",
    weekend: "Sabtu & Minggu: Libur Pelayanan Kantor",
    note: "Pelayanan darurat warga tetap siaga 24 jam melalui WhatsApp Desa.",
  },
  statistics: {
    population: 648, // Berdasarkan data BPS Kecamatan Sampung
    families: 215,
    areaKm2: 6.0,
    neighborhoodUnits: 10,
    citizenUnits: 3,
    activeUmkm: 24,
  },
};

// Produk UMKM Lokal Unggulan Desa Karangwaluh
export interface ProductUmkm {
  id: string;
  name: string;
  category: string;
  priceEstimate: string;
  description: string;
  image: string;
  sellerName: string;
  // TODO: Ganti dengan nomor WhatsApp aktif penjual / perangkat desa
  whatsappNumber: string;
  orderMessage: string;
  rating: number;
}

export const localProducts: ProductUmkm[] = [
  {
    id: "umkm-1",
    name: "Keripik Pisang & Singkong 'Waluh Sari'",
    category: "Olahan Makanan Ringan",
    priceEstimate: "Rp12.000 - Rp25.000",
    description: "Camilan renyah gurih khas Karangwaluh dari pisang kepok dan singkong hasil kebun warga. Tanpa bahan pengawet, tersedia varian rasa original gurih, pedas manis, dan cokelat lumer.",
    image: "/images/desa/umkm-keripik.jpg",
    sellerName: "Ibu Hartini (Dusun Krajan)",
    whatsappNumber: "6281234567890", // TODO: Ganti dengan WhatsApp penjual
    orderMessage: "Halo Bu Hartini, saya ingin memesan Keripik Waluh Sari khas Desa Karangwaluh.",
    rating: 4.9,
  },
  {
    id: "umkm-2",
    name: "Seni & Kerajinan Reyog 'Seco Drono'",
    category: "Seni Budaya & Cinderamata",
    priceEstimate: "Jasa Pentas & Kerajinan",
    description: "Paguyuban kesenian Reyog Ponorogo asli Desa Karangwaluh. Menerima undangan pementasan seni tradisional, sewa kostum dadak merak & bujang ganong, serta pernak-pernik khas Ponorogo.",
    image: "/images/desa/gambar4.webp",
    sellerName: "Paguyuban Seco Drono Karangwaluh",
    whatsappNumber: "6281234567890", // TODO: Ganti dengan WhatsApp pengurus paguyuban
    orderMessage: "Halo Paguyuban Seco Drono Karangwaluh, saya ingin berkonsultasi mengenai pementasan seni Reyog.",
    rating: 5.0,
  },
  {
    id: "umkm-3",
    name: "Sentra Kemitraan Komunitas & UMKM Desa",
    category: "Kemitraan Usaha Warga",
    priceEstimate: "Pelayanan Mandiri",
    description: "Wadah pendampingan legalitas izin usaha mikro (NIB), fasilitasi permodalan, serta etalase pemasaran produk unggulan pertanian dan olahan tangan warga Karangwaluh.",
    image: "/images/desa/gambar3.webp",
    sellerName: "Pemerintah Desa & Paguyuban Warga",
    whatsappNumber: "6281234567890", // TODO: Ganti dengan nomor WhatsApp pelayanan desa
    orderMessage: "Halo Pengurus Desa Karangwaluh, saya tertarik bermitra dengan produk dan sentra UMKM desa.",
    rating: 4.8,
  },
];

// Pengumuman & Berita Terkini Desa
export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: "Pemberitahuan" | "Kesehatan" | "Pembangunan" | "Kegiatan Warga";
  summary: string;
  author: string;
}

export const villageNews: NewsItem[] = [
  {
    id: "berita-1",
    title: "Pentas Seni Reyog 'Seco Drono' Semarakkan Balai Desa Karangwaluh",
    date: "15 Oktober 2026",
    category: "Kegiatan Warga",
    summary: "Warga antusias menyaksikan pertunjukan kesenian tradisional Reyog Ponorogo paguyuban Seco Drono di halaman Balai Desa Karangwaluh.",
    author: "Pemerintah Desa",
  },
  {
    id: "berita-2",
    title: "Musyawarah & Pelantikan Lembaga Desa di Balai Desa",
    date: "12 Oktober 2026",
    category: "Pembangunan",
    summary: "Pemerintah desa sukses menyelenggarakan pelantikan panitia dan koordinasi bersama tokoh masyarakat demi kemajuan Karangwaluh.",
    author: "Sekretariat Desa",
  },
  {
    id: "berita-3",
    title: "Optimalisasi Layanan Surat Kependudukan Digital Ramah HP",
    date: "08 Oktober 2026",
    category: "Pemberitahuan",
    summary: "Kini warga Desa Karangwaluh dapat mengajukan surat keterangan kapan saja dari ponsel tanpa perlu bolak-balik mengantre di kantor desa.",
    author: "Pelayanan Publik Mandiri",
  },
];

// Foto Galeri Desa
export interface GalleryItem {
  id: string;
  title: string;
  category: "Kantor" | "Kegiatan" | "Pelayanan" | "Warga" | "Panorama" | "UMKM";
  src: string;
  description: string;
}

export const villageGallery: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Gedung Balai Desa Karangwaluh",
    category: "Kantor",
    src: "/images/desa/gambar3.webp",
    description: "Gedung megah Balai Desa Karangwaluh berlantai dua sebagai pusat pelayanan administrasi dan koordinasi warga.",
  },
  {
    id: "gal-2",
    title: "Pentas Seni Reyog 'Seco Drono' Karangwaluh",
    category: "Kegiatan",
    src: "/images/desa/gambar4.webp",
    description: "Pelestarian seni budaya adiluhung Reyog Ponorogo paguyuban Seco Drono di pelataran Balai Desa Karangwaluh.",
  },
  {
    id: "gal-3",
    title: "Pelantikan Lembaga & Musyawarah Desa",
    category: "Pelayanan",
    src: "/images/desa/gambar2.webp",
    description: "Kegiatan pelantikan dan koordinasi musyawarah mufakat di aula pertemuan Balai Desa Karangwaluh.",
  },
  {
    id: "gal-4",
    title: "Pertemuan Guyub Rukun Warga Desa",
    category: "Warga",
    src: "/images/desa/gambar1.webp",
    description: "Semangat gotong royong dan silaturahmi pamong desa bersama warga mewujudkan Karangwaluh yang tenteram.",
  },
  {
    id: "gal-5",
    title: "Sentra Olahan Keripik Pisang & Singkong",
    category: "UMKM",
    src: "/images/desa/umkm-keripik.jpg",
    description: "Produksi camilan renyah gurih alami kemasan modern hasil pertanian warga Karangwaluh.",
  },
  {
    id: "gal-6",
    title: "Lanskap Sawah & Perbukitan Sampung",
    category: "Panorama",
    src: "/images/desa/hero-karangwaluh.jpg",
    description: "Hamparan sawah hijau subur berpadu dengan kabut pagi perbukitan karst khas Sampung Ponorogo.",
  },
];
