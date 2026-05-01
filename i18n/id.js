module.exports = {
  subtitle: "Pindahkan koleksi playlist YouTube antar akun tanpa ribet.",

  // Steps
  step01:      "Langkah 01",
  step01Title: "Akses API Google Cloud",
  step01Desc:  "Muat file <code class='text-red-500 font-mono'>credentials.json</code> dari project Google Cloud Anda.",
  step02:      "Langkah 02",
  step02Title: "Otorisasi Akun",
  step02Desc:  "Pilih atau tambahkan akun YouTube tujuan transfer.",
  step03:      "Langkah 03",
  step03Title: "Mulai Transfer",
  step03Desc:  "Masukkan URL playlist asal untuk memulai proses.",

  // Buttons & labels
  btnLoadCreds:       "Muat Credentials",
  credsWaiting:       "Menunggu file...",
  selectAccount:      "Pilih Akun Tersimpan...",
  btnNewAccount:      "Akun Baru",
  noAccount:          "Belum ada akun yang terhubung",
  btnTransfer:        "Transfer Playlist",
  progressProcessing: "MEMPROSES",

  // Dynamic strings
  active:        (v) => `Aktif: ${v}`,
  openingFile:   "Membuka file...",
  apiActive:     "API Aktif",
  failedLoad:    "Gagal memuat",
  waitingAuth:   "Menunggu otorisasi browser...",

  // Toast messages
  toastUrlTitle: "URL Kosong",
  toastUrlMsg:   "Masukkan link playlist YouTube terlebih dahulu.",
  toastAccTitle: "Akun Belum Dipilih",
  toastAccMsg:   "Pilih atau tambahkan akun YouTube di Langkah 02.",

  // Transfer states
  processing:    "Memproses Transfer...",
  done:          "Selesai! ✨",
  doneLabel:     "Selesai!",
  failed:        "Gagal",
  errorOccurred: "Terjadi kesalahan",
  tryAgain:      "Coba Lagi",
  ofVideos:      (c, t) => `${c} dari ${t} video`,
};
