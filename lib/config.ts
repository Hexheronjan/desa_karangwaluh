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
  // TODO: Sesuaikan dengan nomor WhatsApp pengrajin/penjual produk
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
    name: "Madu Murni Klanceng & Hutan Karangwaluh",
    category: "Hasil Hutan & Ternak Alami",
    priceEstimate: "Rp65.000 - Rp120.000",
    description: "Madu asli dari lebah klanceng (Trigona) yang dibudidayakan di sekitar lereng bukit Sampung. Berkhasiat tinggi untuk daya tahan tubuh, rasa manis segar dengan sentuhan asam alami.",
    image: "/images/desa/umkm-madu.svg",
    sellerName: "Pak Samidi (Dusun Karangmulyo)",
    whatsappNumber: "6281234567890", // TODO: Ganti dengan WhatsApp peternak lebah
    orderMessage: "Halo Pak Samidi, saya ingin pesan Madu Murni Klanceng asli Karangwaluh.",
    rating: 5.0,
  },
  {
    id: "umkm-3",
    name: "Kerajinan Besek & Anyaman Bambu Lestari",
    category: "Kerajinan Ramah Lingkungan",
    priceEstimate: "Rp5.000 - Rp45.000",
    description: "Anyaman bambu alami ramah lingkungan untuk wadah berkatan, kemasan oleh-oleh tradisional, hingga hiasan rumah bernuansa pedesaan Jawa estetis karya pengrajin sepuh desa.",
    image: "/images/desa/umkm-anyaman.svg",
    sellerName: "Kelompok Perajin Anyaman Bambu Lestari",
    whatsappNumber: "6281234567890", // TODO: Ganti dengan WhatsApp kelompok perajin
    orderMessage: "Halo Kelompok Bambu Lestari, saya tertarik dengan produk kerajinan anyaman bambu Karangwaluh.",
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
    title: "Jadwal Penyaluran Bantuan Pangan & Posyandu Balita Bulan Ini",
    date: "15 Oktober 2026",
    category: "Kesehatan",
    summary: "Pemerintah Desa Karangwaluh mengundang warga sasaran untuk hadir di Balai Desa mulai pukul 08.30 WIB dengan membawa fotokopi KK dan KTP.",
    author: "Pemerintah Desa",
  },
  {
    id: "berita-2",
    title: "Gotong Royong Perawatan Saluran Irigasi Sawah Dusun Krajan",
    date: "12 Oktober 2026",
    category: "Kegiatan Warga",
    summary: "Warga bersama kelompok tani sukses membersihkan aliran air irigasi menjelang musim tanam padi agar pasokan air ke sawah warga merata.",
    author: "Kelompok Tani Karangwaluh",
  },
  {
    id: "berita-3",
    title: "Optimalisasi Layanan Surat Kependudukan Digital Ramah HP",
    date: "08 Oktober 2026",
    category: "Pembangunan",
    summary: "Kini warga Desa Karangwaluh dapat mengajukan surat keterangan kapan saja dari ponsel tanpa perlu bolak-balik mengantre di kantor desa.",
    author: "Pelayanan Publik Mandiri",
  },
];

// Foto Galeri Desa
export interface GalleryItem {
  id: string;
  title: string;
  category: "Kantor" | "Panorama" | "Pertanian" | "UMKM" | "Infrastruktur";
  src: string;
  description: string;
}

export const villageGallery: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Lanskap Sawah & Perbukitan Sampung",
    category: "Panorama",
    src: "/images/desa/hero-karangwaluh.jpg",
    description: "Hamparan sawah hijau subur berpadu dengan kabut pagi perbukitan karst khas Ponorogo.",
  },
  {
    id: "gal-2",
    title: "Balai & Kantor Desa Karangwaluh",
    category: "Kantor",
    src: "/images/desa/kantor-desa.jpg",
    description: "Gedung pusat pelayanan masyarakat berarsitektur Joglo dengan halaman bersih dan teduh.",
  },
  {
    id: "gal-3",
    title: "Sentra Olahan Keripik Pisang & Singkong",
    category: "UMKM",
    src: "/images/desa/umkm-keripik.jpg",
    description: "Produksi camilan renyah alami dari hasil perkebunan warga Karangwaluh.",
  },
  {
    id: "gal-4",
    title: "Madu Klanceng Alami Lereng Karangwaluh",
    category: "UMKM",
    src: "/images/desa/umkm-madu.svg",
    description: "Budidaya lebah tanpa sengat menghasilkan madu murni berkualitas tinggi.",
  },
  {
    id: "gal-5",
    title: "Panen Raya Padi Warga Karangwaluh",
    category: "Pertanian",
    src: "/images/desa/kegiatan-desa.svg",
    description: "Semangat gotong royong warga desa saat musim panen padi di sawah terasering.",
  },
  {
    id: "gal-6",
    title: "Jalan Lingkungan Desa yang Rapi dan Asri",
    category: "Infrastruktur",
    src: "/images/desa/jalan-desa.svg",
    description: "Pembangunan akses jalan beraspal mulus dilengkapi penerangan tenaga surya ramah lingkungan.",
  },
  {
    id: "gal-7",
    title: "Kerajinan Tangan Anyaman Bambu",
    category: "UMKM",
    src: "/images/desa/umkm-anyaman.svg",
    description: "Kearifan lokal anyaman bambu lestari yang diwariskan turun temurun oleh warga desa.",
  },
];
