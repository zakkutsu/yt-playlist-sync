# PlaylistSync

Tool desktop berbasis Electron untuk memindahkan playlist YouTube dari satu akun ke akun lain dengan mudah dan aman.

![Electron](https://img.shields.io/badge/Electron-191970?style=flat-square&logo=Electron&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)
![YouTube API](https://img.shields.io/badge/YouTube_API_v3-FF0000?style=flat-square&logo=youtube&logoColor=white)

---

##  Download

-  **[Download PlaylistSync (Latest)](https://github.com/zakkutsu/yt-playlist-sync/releases/latest/download/playlistsync.Setup.1.0.0.exe)**  
  Windows installer — **Recommended**

**Requirements:** Windows 10 / 11 (64-bit)

---

## Fitur

- Transfer playlist dari akun A ke akun B
- Login hanya 1 akun (akun tujuan)
- Progress real-time
- Skip video yang tidak bisa diakses (private/deleted)
- Stabil menggunakan YouTube Data API

---

## Cara Kerja

1. Playlist akun A dijadikan **public / unlisted**
2. App membaca semua video dari playlist tersebut
3. Login menggunakan akun B
4. App membuat playlist baru
5. Semua video valid akan dimasukkan ke playlist baru

---

## Catatan Penting

- Video **private / deleted / region locked** tidak bisa ditransfer
- Jumlah video di YouTube adalah **jumlah kotor**
- Hasil transfer = **jumlah bersih (video yang valid saja)**

---

## Instalasi

```bash
npm install
npm start
```

## Arsitektur Kuota & Keamanan

Aplikasi ini menggunakan konsep **Bring Your Own Credentials (BYOC)**. Setiap pengguna **wajib** membuat project di Google Cloud masing-masing.

**BUKAN:** "Satu credentials dibagikan ke banyak pengguna" (Akan cepat terkena _limit global_)
**YANG BENAR:** "Setiap pengguna membuat credentials sendiri"

**Keuntungan sistem ini:**

1. **Kuota Tidak Bentrok:** Setiap pengguna memiliki jatah API 10.000 unit/hari secara mandiri.
2. **Tidak Ada Limit Global:** Aplikasi bisa dipakai banyak orang tanpa khawatir terkena bottleneck.
3. **Lebih Aman:** Tidak ada _shared credential_. Jika satu pengguna mengalami error, tidak akan mengganggu pengguna lain.

---

## Setup Google Cloud

Karena sistem yang sangat _scalable_ di atas, setup awal menjadi tanggung jawab setiap pengguna (bukan sekadar _plug-and-play_). Ikuti langkah ini:

**1. Masuk ke Google Cloud Console**

- Buka tautan: [https://console.cloud.google.com/](https://console.cloud.google.com/)

**2. Buat Project**

- Klik dropdown project (atas kiri)
- Klik **New Project**
- Isi nama (bebas, misal: yt-transfer)
- Klik **Create**
- Pastikan project itu aktif

**3. Enable API**

- Masuk ke: **APIs & Services > Library**
- Cari: **YouTube Data API v3**
- Klik **Enable**

**4. Setup OAuth Consent Screen**

- Masuk ke: **APIs & Services > OAuth consent screen**
- Isi bagian ini:
  - **User Type**: pilih **External**
  - **App Information**:
    - **App name**: bebas (misal: YT Transfer)
    - **User support email**: email Anda
  - **Developer contact**:
    - isi email Anda
- Klik **Save and Continue**
- **Scope** (biarkan default) -> langsung **Save and Continue**
- **Test Users (INI PENTING)**
  - Kalau status masih Testing:
    - Klik **Add Users**
    - Masukkan email akun yang akan login (akun tujuan / akun B)
    - Klik **Save**
  - **Catatan Penting**: Jika menu **Test Users** tidak tersedia, berarti status Anda _In Production_. Solusinya, klik _Back to testing_.

**5. Buat OAuth Client ID**

- Masuk ke: **APIs & Services > Credentials**
- Klik: **Create Credentials > OAuth Client ID**
- Pilih: **Desktop app**
- Isi Name: bebas (misal: yt-app)
- Klik **Create**

**6. Download file JSON**

- Klik **Download JSON**
- Rename file yang didownload menjadi: `credentials.json`

**7. Status Final yang Benar**
Kalau semua langkah benar, maka:

- API sudah aktif
- OAuth selesai dibuat
- File `credentials.json` siap digunakan
- Test Users sudah ditambahkan (jika dalam status testing)

## Cara Pakai & Login

1. Buka aplikasi PlaylistSync.
2. Di Tahap 1, klik tombol **Load credentials.json** lalu pilih file JSON yang Anda download dari Google Cloud.
3. Di Tahap 2, klik **Login Google**. Pilih akun Google tujuan (akun tempat Anda ingin menaruh playlist baru), lalu klik _Allow_.
4. Setelah berhasil, token otomatis tersimpan.
5. Paste link playlist YouTube yang ingin dikloning.
6. Klik **Start Transfer** dan tunggu sampai indikator selesai!

Contoh progress:
`Progres: 12 / 76 video ditambahkan...`

## Mode Operasi (Tab)

Aplikasi kini memiliki dua mode operasi yang dapat dipilih melalui tab di bagian atas langkah kerja:

- **Sync Playlist**: Mode lama — masukkan URL playlist sumber, berikan nama playlist baru (opsional), lalu jalankan transfer seluruh isi playlist ke akun tujuan.
- **Save Links**: Mode baru — tempelkan banyak link video (satu per baris) ke dalam textarea, pilih apakah ingin membuat playlist baru atau menggunakan playlist yang sudah ada, kemudian simpan semua link sekaligus ke playlist tujuan.

Keduanya menggunakan antarmuka progress yang sama dan menampilkan kotak log terminal-style untuk memantau status per-video secara real-time.

### Cara Pakai — Save Links

1. Pilih tab **Save Links**.
2. Tempelkan tautan YouTube pada textarea (satu per baris). Format yang didukung: `youtube.com/watch?v=ID`, `youtu.be/ID`, `youtube.com/shorts/ID`.
3. Pilih opsi **Buat Playlist Baru** atau **Gunakan Playlist Lama**. Jika memilih gunakan playlist, pilih playlist dari dropdown (diambil dari akun yang sedang login).
4. Klik **Simpan Links ke Playlist** untuk memulai proses. Proses akan menambahkan setiap video ke playlist yang dipilih atau dibuat.

Catatan: Aplikasi akan mengekstrak video ID dari setiap baris dan mengabaikan baris yang tidak mengandung ID valid.

### Terminal Log & Ekspor Daftar Gagal

Selama proses berjalan, sebuah kotak log bergaya terminal akan menampilkan baris status untuk setiap video (SUKSES / GAGAL). Jika terdapat video yang gagal ditambahkan, pengguna dapat mengekspor daftar video yang gagal (fitur `Download daftar gagal`) untuk pengecekan ulang atau percobaan ulang manual.

Backend mengirimkan event progress secara real-time dan menyediakan handler IPC baru yang relevan:

- `get-user-playlists` — mengambil daftar playlist milik akun yang terautentikasi untuk mengisi dropdown.
- `save-bulk-links` — menangani parsing link, pembuatan playlist baru bila diminta, dan penyisipan video satu-per-satu dengan delay untuk menghindari penalti kuota.


## Contoh Kasus

Playlist: **76 videos**

Hasil:

- 68 berhasil
- 8 gagal (private/deleted)

## Limitasi

- Tidak bisa transfer video private
- Tidak bisa ambil playlist private
- Bergantung pada quota API Google

### Catatan Kuota API (Penting)

Setiap pengguna memang mendapat kuota default **10.000 unit/hari**, tetapi setiap aksi API memiliki "biaya" tersendiri:

- Baca isi playlist (`playlistItems.list`) = **1 unit**
- Buat playlist baru (`playlists.insert`) = **50 unit**
- Tambah 1 video ke playlist (`playlistItems.insert`) = **50 unit / video**

Karena proses tambah video memakan kuota paling besar, batas real transfer per hari biasanya ada di kisaran **190-198 video**.

Jadi kalau proses berhenti di sekitar angka 190-an dan muncul **Quota Exceeded (Error 403)**, itu normal. Lanjutkan lagi setelah kuota harian reset di hari berikutnya.

## Roadmap (Next Upgrade)
## Changelog — Perubahan Terbaru

- Menambahkan sistem tab: **Sync Playlist** dan **Save Links**
- Menambahkan mode **Save Links** untuk menyimpan banyak video dari daftar link
- Menambahkan kotak log terminal-style dengan status per-video dan opsi ekspor daftar gagal
- Menambahkan dukungan `get-user-playlists` dan `save-bulk-links` di backend
- Menambahkan opsi **Custom Playlist Name** saat transfer


## Roadmap (Next Upgrade)

- [ ] Tombol Stop / Resume
- [x] Log video gagal (sudah tersedia; dapat diekspor)
- [ ] Retry system (partial — daftar gagal tersedia untuk retry manual)
- [ ] Multiple playlist transfer
- [ ] UI lebih modern
