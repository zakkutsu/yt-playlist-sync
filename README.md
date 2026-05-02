# PlaylistSync

Aplikasi desktop berbasis Electron untuk memindahkan atau menyimpan konten YouTube playlist secara aman, transparan, dan terukur menggunakan YouTube Data API v3.

![Electron](https://img.shields.io/badge/Electron-191970?style=flat-square&logo=Electron&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)
![YouTube API](https://img.shields.io/badge/YouTube_API_v3-FF0000?style=flat-square&logo=youtube&logoColor=white)

## Ringkasan

PlaylistSync menyediakan dua mode utama:

- **Sync Playlist**: menyalin isi playlist sumber ke akun tujuan.
- **Save Links**: menyimpan banyak tautan video ke satu playlist tujuan.

Seluruh proses didukung progress real-time, log per video, serta ekspor daftar video gagal untuk tindak lanjut manual.

## Unduh

- **[Download PlaylistSync (Latest)](https://github.com/zakkutsu/yt-playlist-sync/releases/latest)**

Persyaratan sistem:

- Windows 10 / 11 (64-bit)

## Fitur Utama

- Transfer playlist antar akun YouTube.
- Opsi nama playlist kustom saat transfer.
- Mode simpan massal tautan video ke playlist.
- Monitoring progres real-time dengan terminal-style log.
- Statistik berhasil/gagal selama proses berjalan.
- Ekspor daftar video gagal (untuk retry manual).
- Dukungan multiakun berbasis token lokal (`tokens/*.json`).

## Arsitektur Keamanan dan Kuota (BYOC)

PlaylistSync menggunakan pendekatan **Bring Your Own Credentials (BYOC)**.
Setiap pengguna wajib memakai project Google Cloud milik sendiri.

Prinsip:

- **Bukan** kredensial bersama untuk banyak pengguna.
- **Melainkan** satu pengguna, satu kredensial, satu kuota harian.

Keuntungan:

- Kuota tidak saling berbenturan antar pengguna.
- Tidak ada bottleneck kuota global.
- Risiko gangguan lebih terisolasi per pengguna.

## Instalasi dan Menjalankan Aplikasi

```bash
npm install
npm start
```

## Setup Google Cloud (Wajib)

Langkah konfigurasi awal:

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat project baru dan aktifkan project tersebut.
3. Aktifkan **YouTube Data API v3** melalui:
   - `APIs & Services > Library`
4. Konfigurasikan **OAuth consent screen**:
   - Pilih `External`
   - Isi `App name`, `User support email`, dan `Developer contact`
   - Lanjutkan hingga selesai
5. Jika status aplikasi masih `Testing`, tambahkan akun tujuan ke `Test Users`.
6. Buat OAuth Client ID:
   - `APIs & Services > Credentials > Create Credentials > OAuth Client ID`
   - Pilih tipe `Desktop app`
7. Unduh file JSON OAuth, lalu ubah nama file menjadi:
   - `credentials.json`

Checklist konfigurasi final:

- YouTube Data API v3 aktif
- OAuth consent screen selesai
- `credentials.json` tersedia
- Test users telah ditambahkan (jika status masih Testing)

## Alur Penggunaan

1. Buka aplikasi PlaylistSync.
2. Step 1: klik **Load credentials.json** dan pilih file kredensial.
3. Step 2: klik **Login Google** lalu otorisasi akun tujuan.
4. Pilih mode operasi pada tab Step 3.

### Mode 1: Sync Playlist

Digunakan untuk menyalin isi playlist sumber ke akun tujuan.

Langkah:

1. Tempel URL playlist sumber (`...playlist?list=...`).
2. Pilih mode tujuan:
   - Buat playlist baru, atau
   - Gunakan playlist tujuan yang sudah ada.
3. Isi nama playlist kustom (opsional).
4. Jalankan transfer.

### Mode 2: Save Links

Digunakan untuk menyimpan banyak tautan video ke satu playlist.

Langkah:

1. Tempel daftar tautan (satu baris satu tautan).
2. Pilih playlist tujuan:
   - Buat playlist baru, atau
   - Gunakan playlist yang sudah ada.
3. Klik **Simpan Tautan ke Playlist**.

Format tautan yang didukung:

- `youtube.com/watch?v=VIDEO_ID`
- `youtu.be/VIDEO_ID`
- `youtube.com/shorts/VIDEO_ID`

Catatan:

- Sistem mengekstrak `videoId` dari setiap baris.
- Baris yang tidak valid akan diabaikan.

## Progress, Log, dan Error Handling

- Progress bar menampilkan persentase proses secara real-time.
- Log terminal-style menampilkan status per video: berhasil/gagal.
- Statistik berjalan: total berhasil dan gagal.
- Jika ada kegagalan, daftar item gagal dapat diekspor untuk retry manual.

Handler IPC terkait:

- `get-user-playlists`: mengambil daftar playlist akun terautentikasi.
- `transfer-playlist`: transfer playlist sumber ke target.
- `save-bulk-links`: simpan tautan video massal ke playlist target.
- `save-failed-list`: simpan daftar video gagal ke file JSON.

## Catatan Kuota API (Penting)

Kuota default YouTube Data API adalah **10.000 unit/hari** per project.

Biaya kuota per operasi:

- `playlistItems.list` = **1 unit**
- `playlists.insert` = **50 unit**
- `playlistItems.insert` = **50 unit per video**

Dengan pola biaya tersebut, batas transfer praktis per hari umumnya berada di kisaran **190-198 video**.

Apabila muncul **Quota Exceeded (403)**, lanjutkan proses setelah kuota harian reset (umumnya pada pergantian hari waktu US).

## Batasan

- Video private/deleted/region locked tidak dapat diproses.
- Playlist private milik akun lain tidak dapat dibaca.
- Hasil transfer adalah jumlah video valid, bukan total kotor yang tampil di YouTube.

## Troubleshooting Singkat

- **Gagal login / sesi kedaluwarsa**:
  - login ulang di Step 2.
- **Playlist tidak ditemukan**:
  - pastikan URL berisi parameter `list=` yang valid.
- **Proses berhenti di kisaran 190-an video**:
  - kemungkinan kuota harian habis.

## Contoh Kasus

Sumber playlist: **76 video**

Hasil proses:

- 68 video berhasil
- 8 video gagal (private/deleted)

## Changelog Terbaru

- Penambahan tab **Sync Playlist** dan **Save Links**.
- Penambahan mode penyimpanan tautan video secara massal.
- Penambahan terminal-style log dengan statistik sukses/gagal.
- Penambahan ekspor daftar gagal.
- Penambahan dukungan backend `get-user-playlists` dan `save-bulk-links`.
- Penambahan opsi nama playlist kustom.

## Roadmap

- [ ] Tombol Stop / Resume
- [x] Log video gagal (sudah tersedia)
- [ ] Retry otomatis untuk video gagal
- [ ] Multiple playlist transfer
- [ ] Peningkatan UI/UX
