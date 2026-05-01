# PlaylistSync

Tool sederhana berbasis Electron untuk memindahkan playlist YouTube dari satu akun ke akun lain.


![Electron](https://img.shields.io/badge/Electron-191970?style=flat-square&logo=Electron&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)
![YouTube API](https://img.shields.io/badge/YouTube_API_v3-FF0000?style=flat-square&logo=youtube&logoColor=white)

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

**BUKAN:** "Satu credentials dibagi ke banyak user" (Akan cepat kena *limit global*)
**YANG BENAR:** "Setiap user bikin credentials sendiri"

**Keuntungan sistem ini:**
1. **Kuota Tidak Bentrok:** Tiap user memiliki jatah API 10.000 unit/hari secara mandiri.
2. **Tidak Ada Limit Global:** Aplikasi bisa dipakai banyak orang tanpa khawatir terkena bottleneck.
3. **Lebih Aman:** Tidak ada *shared credential*. Jika satu user mengalami error, tidak akan mengganggu pengguna lain.

---

## Setup Google Cloud

Karena sistem yang sangat *scalable* di atas, setup awal menjadi tanggung jawab setiap pengguna (bukan sekadar *plug-and-play*). Ikuti langkah ini:

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
  - **Catatan Penting**: Kalau tidak ada menu test user, berarti status Anda *In Production*. Solusinya, klik *Back to testing*.

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
- Test user sudah ditambahkan (jika dalam status testing)

## Cara Pakai & Login

1. Buka aplikasi PlaylistSync.
2. Di Tahap 1, klik tombol **Load credentials.json** lalu pilih file JSON yang Anda download dari Google Cloud.
3. Di Tahap 2, klik **Login Google**. Pilih akun Google tujuan (akun tempat Anda ingin menaruh playlist baru), lalu klik *Allow*.
4. Setelah berhasil, token otomatis tersimpan.
5. Paste link playlist YouTube yang ingin dikloning.
6. Klik **Start Transfer** dan tunggu sampai indikator selesai!

Contoh progress:
`Progres: 12 / 76 video ditambahkan...`

## Contoh Kasus

Playlist: **76 videos**

Hasil:
- 68 berhasil
- 8 gagal (private/deleted)

## Limitasi
- Tidak bisa transfer video private
- Tidak bisa ambil playlist private
- Bergantung pada quota API Google

## Roadmap (Next Upgrade)
- [ ] Tombol Stop / Resume
- [ ] Log video gagal
- [ ] Retry system
- [ ] Multiple playlist transfer
- [ ] UI lebih modern
