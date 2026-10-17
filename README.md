# Website Resmi & Portal Pelayanan Warga Desa Karangwaluh

Website demo modern dan portal pelayanan mandiri masyarakat **Desa Karangwaluh**, Kecamatan Sampung, Kabupaten Ponorogo, Jawa Timur.

Dibangun dengan prinsip *mobile-first* untuk memudahkan warga mengurus keperluan desa kapan saja langsung dari ponsel Android maupun komputer tanpa perlu mengantre lama di kantor balai desa.

---

## 🌟 Fitur Unggulan

1. **Beranda Interaktif**:
   - Hero layar penuh menampilkan foto lanskap persawahan dan perbukitan kapur Sampung Ponorogo.
   - Kartu kaca (*glassmorphism*) kalkulator status jam buka balai desa hari ini secara otomatis.
   - Tata letak **Bento Grid** modern untuk akses cepat surat, pengaduan, dan bantuan WhatsApp.
   - Alur kerja 3 langkah mudah dengan garis penghubung.
   - Statistik desa dengan penghitung animasi naik (*animated counter*).
   - Galeri foto desa *masonry layout* dilengkapi modal **Lightbox** interaktif.
   - Etalase **Produk Lokal UMKM** (keripik, madu klanceng, kerajinan anyaman bambu) dengan tombol pemesanan WhatsApp satu-sentuhan.
   - Pengumuman & Berita terkini desa.
   - Peta interaktif Balai Desa Karangwaluh via OpenStreetMap & tautan petunjuk arah Google Maps.

2. **Layanan Pengaduan Warga (`/pengaduan`)**:
   - Formulir ramah HP dengan opsi kirim sebagai **Anonim** demi kenyamanan warga.
   - Chip pilihan kategori berikon (Infrastruktur, Kebersihan, Keamanan, Pelayanan Publik, Lainnya).
   - Pratinjau unggah foto bukti langsung dari kamera/galeri ponsel.
   - Validasi formulir inline dengan pesan penjelasan yang bersahabat.
   - Halaman sukses dengan nomor tiket resmi (contoh: `PGD-2026-0001`) dan tombol salin instan.

3. **Pusat Pelacakan Berkas (`/lacak`)**:
   - Stepper visual tahapan laporan (**Diterima &rarr; Diproses &rarr; Selesai**) dan surat (**Diajukan &rarr; Diverifikasi &rarr; Diproses &rarr; Siap Diambil**).
   - Catatan resmi pamong desa dan log riwayat waktu penanganan.

4. **Pusat Layanan Mandiri WhatsApp (`/layanan-mandiri`)**:
   - Grid tombol besar untuk 6 kebutuhan umum warga.
   - Menghubungkan langsung ke WhatsApp kantor desa dengan pesan otomatis (*prefilled text*) siap kirim.

5. **Permohonan Surat Keterangan Online (`/surat`)**:
   - Tersedia 6 jenis surat resmi (Domisili, SKTM, Pengantar KTP/KK, Keterangan Usaha, Pengantar SKCK, Kelahiran/Kematian).
   - Formulir bertahap (*wizard 3 langkah*) dengan indikator progres visual.
   - Validasi format NIK 16 digit dan nomor kontak.
   - Ringkasan data sebelum pengiriman (*review step*).
   - Riwayat surat warga di menu **Surat Saya (`/surat/saya`)**.
   - **Pratinjau & Cetak Surat Resmi (`/surat/cetak/[id]`)**: Format standar birokrasi A4 lengkap dengan kop surat kabupaten/kecamatan/desa, nomor surat, data pemohon, stempel resmi, dan tanda tangan Kepala Desa Sukeni yang siap disimpan PDF / dicetak lewat `window.print()`.

6. **Notifikasi Real-Time (`/notifikasi`)**:
   - Notifikasi toast dan lonceng dengan badge angka dinamis saat status surat berubah menjadi **"Siap Diambil"**.

7. **Simulasi Petugas Desa (`/admin-demo`)**:
   - Panel khusus presentasi demo untuk mengubah status berkas warga, menambahkan catatan pamong, dan menguji alur notifikasi tanpa memerlukan backend server.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router) + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Animasi & Interaksi**: Framer Motion & CSS Animations
- **Tipografi**: Plus Jakarta Sans (Google Fonts via `next/font`)
- **Penyimpanan Demo**: Browser `localStorage` yang dibungkus *safe try-catch* di lapisan `lib/storage.ts`

---

## 🚀 Panduan Menjalankan Secara Lokal

Pastikan Anda telah menginstal **Node.js** (v18 ke atas) dan **npm**:

```bash
# 1. Buka terminal di folder proyek
cd "c:/desa karangwaluh"

# 2. Instal dependensi (jika belum)
npm install

# 3. Jalankan server pengembangan
npm run dev
```

Buka peramban di [http://localhost:3000](http://localhost:3000).

Untuk menguji build produksi:
```bash
npm run build
npm run start
```

---

## ☁️ Panduan Deploy ke Vercel

Proyek ini dirancang **Zero-Config** (tanpa database dan tanpa environment variable wajib), sehingga dapat langsung di-deploy gratis ke [Vercel](https://vercel.com/):

1. **Unggah Proyek ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: website portal desa karangwaluh"
   git branch -M main
   git remote add origin https://github.com/USERNAME/desa-karangwaluh.git
   git push -u origin main
   ```

2. **Deploy di Vercel**:
   - Masuk ke dashboard [vercel.com](https://vercel.com/)
   - Klik tombol **"Add New..."** &rarr; **"Project"**
   - Pilih repositori `desa-karangwaluh` dari akun GitHub Anda
   - Klik tombol **"Deploy"** (biarkan seluruh pengaturan default)
   - Tunggu sekitar 1 menit hingga website live!

---

## ⚙️ Penyesuaian Data Desa

Seluruh informasi desa (nama kepala desa, nomor WhatsApp kantor, jam buka, titik koordinat, produk UMKM) tersentralisasi di berkas:
👉 `lib/config.ts`

Silakan sesuaikan data dengan mencari tanda komentar `// TODO:` di dalam berkas tersebut saat website hendak dipakai secara operasional penuh oleh Pemerintah Desa Karangwaluh.
