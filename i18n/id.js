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
  processing:    "Sedang diproses...",
  done:          "Selesai",
  doneLabel:     "Selesai",
  failed:        "Gagal",
  errorOccurred: "Terjadi kesalahan",
  tryAgain:      "Coba ulang",
  ofVideos:      (c, t) => `${c} dari ${t} video`,

  // Custom rename
  playlistName:     "Nama Playlist (Opsional)",
  playlistNameDesc: "Biarkan kosong untuk menggunakan nama playlist asli",
  playlistNamePlaceholder: "Masukkan nama playlist custom...",

  // Tab navigation
  tabSyncPlaylist:      "Sinkron Playlist",
  tabSaveLinks:         "Simpan Tautan",
  tabSyncDesc:          "Transfer seluruh playlist dari satu akun ke akun lain",
  tabLinksDesc:         "Simpan banyak link ke satu playlist",

  // Save Links mode
  destPlaylist:         "Playlist Tujuan",
  linksLabel:           "Daftar Tautan",
  linksTextarea:        "Tempel tautan di sini (satu per baris)...",
  linksCreateNew:       "Buat Playlist Baru",
  linksUseExisting:     "Gunakan Playlist Lama",
  selectPlaylist:       "Pilih playlist...",
  btnSaveLinks:         "Simpan Tautan ke Playlist",
  newPlaylistName:      "Nama Playlist Baru",

  // Log and Toast additions
  logTitle:             "Log Transfer",
  logStats:             (s, f) => `Berhasil: ${s} | Gagal: ${f}`,
  toastTransferDone:    "Transfer Selesai",
  toastTransferPartial: (s, f) => `${s} Berhasil, ${f} Gagal.`,
  toastTransferAll:     "Semua video berhasil ditransfer!",
  toastLinksDone:       "Simpan Tautan Selesai",
  toastLinksPartial:    (s, f) => `${s} Berhasil, ${f} Gagal.`,
  toastLinksAll:        "Semua tautan berhasil disimpan!",
  toastNeedLink:        "Silakan masukkan tautan",
  toastNeedPlaylist:    "Silakan pilih playlist",

  loadingPlaylists:     "Memuat daftar playlist...",
  noPlaylistsFound:     "Tidak ada playlist pada akun ini",
  loadFailed:           "Pemuatan Gagal",
  loadFailedMsg:        "Daftar playlist tidak dapat dimuat.",
  loadFailedRetry:      "Gagal memuat, silakan coba lagi",
  loadErrorPrefix:      (msg) => `Kesalahan: ${msg}`,
  loginFailed:          "Login Gagal",
  loginFailedMsg:       (msg) => `Login gagal: ${msg}`,
  sessionExpired:       "Sesi Berakhir",
  reloginStep02:        "Silakan login ulang pada Langkah 02.",
  logSuccess:           "BERHASIL",
  logFailed:            "GAGAL"
};
