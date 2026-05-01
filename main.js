const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { google } = require("googleapis");
const open = (...args) => import("open").then((mod) => mod.default(...args));
const http = require("http");
const fs = require("fs");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

// LOAD CREDENTIALS HANDLER
ipcMain.handle("load-credentials", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    title: "Pilih credentials.json",
    filters: [{ name: "JSON", extensions: ["json"] }],
    properties: ["openFile"],
  });

  if (canceled || filePaths.length === 0) return { success: false };

  try {
    const filePath = filePaths[0];
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!data.installed || !data.installed.client_id) {
      return {
        success: false,
        error: "File tidak valid! Pastikan itu file OAuth Desktop App.",
      };
    }

    fs.copyFileSync(filePath, "credentials.json");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal membaca file JSON: " + err.message };
  }
});

// GET ACCOUNTS HANDLER
ipcMain.handle("get-accounts", () => {
  if (!fs.existsSync("tokens")) {
    fs.mkdirSync("tokens");
    return [];
  }
  const files = fs.readdirSync("tokens").filter((f) => f.endsWith(".json"));
  return files.map((f) => f.replace(".json", ""));
});

// LOGIN HANDLER
ipcMain.handle("login-google", async () => {
  const credentials = JSON.parse(fs.readFileSync("credentials.json"));
  const { client_id, client_secret, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    "http://localhost:5000",
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube"],
    prompt: "consent",
  });

  // LOCAL SERVER
  const server = http
    .createServer(async (req, res) => {
      const url = new URL(req.url, "http://localhost:5000");
      const code = url.searchParams.get("code");

      if (code) {
        const successHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Otentikasi Berhasil - PlaylistSync</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #f8fafc;
        }
        .success-card {
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .check-icon {
            animation: scaleIn 0.5s 0.3s both cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes scaleIn {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-6">
    
    <div class="success-card max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 text-center border border-slate-100">
        
        <!-- Logo Branded -->
        <div class="flex items-center justify-center gap-2 mb-8">
            <div class="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-100">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
                </svg>
            </div>
            <span class="text-xl font-extrabold tracking-tight text-slate-800">Playlist<span class="text-red-600">Sync</span></span>
        </div>

        <!-- Success Icon -->
        <div class="check-icon relative w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <div class="absolute inset-0 bg-green-100 rounded-full animate-pulse opacity-50"></div>
            <svg class="w-12 h-12 text-green-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>

        <h1 class="text-2xl font-extrabold text-slate-900 mb-3">Login Berhasil!</h1>
        <p class="text-slate-500 text-sm leading-relaxed mb-8">
            Akun YouTube Anda telah berhasil terhubung. Proses sinkronisasi sedang berjalan di latar belakang.
        </p>

        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-8">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Instruksi Selanjutnya</p>
            <p class="text-sm text-slate-700 font-medium italic">"Jendela browser ini akan tertutup secara otomatis."</p>
        </div>

        <div class="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <svg class="w-4 h-4 animate-spin text-red-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Kembali ke aplikasi dalam <span id="countdown" class="text-red-500 font-bold text-sm">5</span> detik...
        </div>
    </div>

    <!-- Background Decoration -->
    <div class="fixed top-0 left-0 w-full h-1 bg-red-600 shadow-[0_2px_10px_rgba(220,38,38,0.3)]"></div>
    <div class="fixed -bottom-24 -left-24 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
    <div class="fixed -top-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

    <script>
        let count = 5;
        const countdownEl = document.getElementById('countdown');
        const interval = setInterval(() => {
            count--;
            countdownEl.innerText = count;
            if (count <= 0) {
                clearInterval(interval);
                window.close();
            }
        }, 1000);
    </script>
</body>
</html>`;
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(successHtml);

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Get channel name
        const youtube = google.youtube({ version: "v3", auth: oAuth2Client });
        let accountName = "Akun_" + Date.now();
        try {
          const channelRes = await youtube.channels.list({
            part: "snippet",
            mine: true,
          });
          if (channelRes.data.items && channelRes.data.items.length > 0) {
            accountName = channelRes.data.items[0].snippet.title
              .replace(/[^a-zA-Z0-9_ -]/g, "")
              .trim();
            if (!accountName) accountName = "Akun_" + Date.now();
          }
        } catch (e) {
          console.error("Gagal mendapatkan nama channel", e);
        }

        if (!fs.existsSync("tokens")) {
          fs.mkdirSync("tokens");
        }

        fs.writeFileSync(`tokens/${accountName}.json`, JSON.stringify(tokens));

        server.close();

        // Menunggu 5 detik (sesuai countdown di browser) sebelum kembali ke app
        setTimeout(() => {
          if (win) {
            if (win.isMinimized()) win.restore();
            win.show();
            win.focus();
            win.setAlwaysOnTop(true);
            setTimeout(() => win.setAlwaysOnTop(false), 1000);

            win.webContents.send("login-success", accountName);
          }
        }, 5000);
      }
    })
    .listen(5000);

  await open(authUrl);
});

ipcMain.handle(
  "transfer-playlist",
  async (event, { url: playlistUrl, accountName }) => {
    try {
      const credentials = JSON.parse(fs.readFileSync("credentials.json"));
      const token = JSON.parse(fs.readFileSync(`tokens/${accountName}.json`));

      const { client_id, client_secret, redirect_uris } = credentials.installed;

      const auth = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0],
      );

      auth.setCredentials(token);

      const youtube = google.youtube({ version: "v3", auth });

      // Extract playlist ID
      let playlistId = playlistUrl;
      try {
        const parsedUrl = new URL(playlistUrl);
        if (parsedUrl.searchParams.has("list")) {
          playlistId = parsedUrl.searchParams.get("list");
        }
      } catch (e) {
        // Kalau gagal parsing URL (mungkin user paste ID langsung atau URL jelek)
        if (playlistUrl.includes("list=")) {
          playlistId = playlistUrl.split("list=")[1].split("&")[0];
        }
      }

      // GET source playlist details (untuk mengambil namanya)
      let sourcePlaylistTitle = "Imported Playlist";
      try {
        const plRes = await youtube.playlists.list({
          part: "snippet",
          id: playlistId,
        });
        if (plRes.data.items && plRes.data.items.length > 0) {
          sourcePlaylistTitle = plRes.data.items[0].snippet.title;
        }
      } catch (err) {
        console.error("Gagal mendapatkan nama playlist sumber:", err.message);
        if (err.message && err.message.toLowerCase().includes("quota")) {
          throw new Error(
            "Kuota API harian Google Cloud habis. Silakan coba lagi besok.",
          );
        }
      }

      // GET videos
      let videos = [];
      let nextPageToken = null;

      do {
        const res = await youtube.playlistItems.list({
          part: "snippet",
          playlistId,
          maxResults: 50,
          pageToken: nextPageToken,
        });

        videos.push(...res.data.items);
        nextPageToken = res.data.nextPageToken;
      } while (nextPageToken);

      // CREATE playlist baru
      const newPlaylist = await youtube.playlists.insert({
        part: "snippet,status",
        requestBody: {
          snippet: {
            title: sourcePlaylistTitle,
          },
          status: {
            privacyStatus: "private",
          },
        },
      });

      const newId = newPlaylist.data.id;

      // INSERT video satu per satu
      for (let i = 0; i < videos.length; i++) {
        const vid = videos[i].snippet.resourceId.videoId;

        try {
          await youtube.playlistItems.insert({
            part: "snippet",
            requestBody: {
              snippet: {
                playlistId: newId,
                resourceId: {
                  kind: "youtube#video",
                  videoId: vid,
                },
              },
            },
          });

          win.webContents.send("progress", {
            current: i + 1,
            total: videos.length,
          });
        } catch (err) {
          console.log("ERROR VIDEO:", vid);
          console.log(err.message);
          if (err.message && err.message.toLowerCase().includes("quota")) {
            throw new Error(
              "Kuota API harian Google Cloud habis saat proses transfer. Lanjutkan besok.",
            );
          }
          // skip dan lanjut
          continue;
        }

        // delay kecil biar aman
        await new Promise((r) => setTimeout(r, 200));
      }

      return "done";
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes("quota")) {
        throw new Error(
          "Kuota API harian Google Cloud Anda (10.000 unit/hari) telah habis. Limit ini di-reset tiap tengah malam waktu US.",
        );
      }
      throw err;
    }
  },
);
