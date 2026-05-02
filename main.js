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
    icon: "assets/icon.ico",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.removeMenu();
  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

// LOAD CREDENTIALS HANDLER
ipcMain.handle("load-credentials", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    title: "Select credentials.json",
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
        error: "Invalid file! Make sure it's an OAuth Desktop App file.",
      };
    }

    fs.copyFileSync(filePath, "credentials.json");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to read JSON file: " + err.message };
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
      const error = url.searchParams.get("error");

      if (error) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<html><body><h2>Login cancelled: ${error}</h2><p>You can close this window.</p></body></html>`);
        server.close();
        if (win) win.webContents.send("login-error", error);
        return;
      }

      if (code) {
        const successHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authentication Successful - PlaylistSync</title>
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

        <h1 class="text-2xl font-extrabold text-slate-900 mb-3">Login Successful!</h1>
        <p class="text-slate-500 text-sm leading-relaxed mb-8">
            Your YouTube account has been successfully connected. The sync process is running in the background.
        </p>

        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-8">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Next Step</p>
            <p class="text-sm text-slate-700 font-medium italic">"This browser window will close automatically."</p>
        </div>

        <div class="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <svg class="w-4 h-4 animate-spin text-red-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Returning to app in <span id="countdown" class="text-red-500 font-bold text-sm">5</span> seconds...
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

        try {
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
            console.error("Failed to get channel name", e);
          }

          if (!fs.existsSync("tokens")) {
            fs.mkdirSync("tokens");
          }

          fs.writeFileSync(`tokens/${accountName}.json`, JSON.stringify(tokens));

          server.close();

          // Wait 5s (matches browser countdown) then restore app
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
        } catch (err) {
          console.error("Failed to exchange auth code:", err.message);
          server.close();
          if (win) win.webContents.send("login-error", err.message);
        }
      }
    })
    .listen(5000);

  // Auto-close server after 5 minutes if no callback received
  const serverTimeout = setTimeout(() => {
    server.close();
    console.warn("OAuth server closed: no callback received within 5 minutes.");
  }, 5 * 60 * 1000);
  server.on("close", () => clearTimeout(serverTimeout));

  await open(authUrl);
});

// Helper: detect token/auth errors and throw user-friendly messages
function checkAuthError(err) {
  const msg = (err.message || "").toLowerCase();
  if (msg.includes("unauthorized_client") || msg.includes("invalid_client") || msg.includes("invalid_grant")) {
    throw new Error(
      "SESSION_EXPIRED: Your login session is invalid or expired. Please re-login in Step 02 (delete the old account and login again)."
    );
  }
}

ipcMain.handle(
  "transfer-playlist",
  async (event, { url: playlistUrl, accountName, customName, targetPlaylistId }) => {
    try {
      const credentials = JSON.parse(fs.readFileSync("credentials.json"));
      const token = JSON.parse(fs.readFileSync(`tokens/${accountName}.json`));

      const { client_id, client_secret, redirect_uris } = credentials.installed;

      const auth = new google.auth.OAuth2(
        client_id,
        client_secret,
        "http://localhost:5000",
      );

      auth.setCredentials(token);

      // Save refreshed token automatically
      auth.on("tokens", (newTokens) => {
        const merged = { ...token, ...newTokens };
        fs.writeFileSync(`tokens/${accountName}.json`, JSON.stringify(merged));
      });

      const youtube = google.youtube({ version: "v3", auth });

      // Extract and validate playlist ID
      const rawPlaylistInput = String(playlistUrl || "").trim();
      if (!rawPlaylistInput) {
        throw new Error("Playlist URL/ID is required.");
      }

      let playlistId = rawPlaylistInput;
      try {
        const parsedUrl = new URL(rawPlaylistInput);
        const listParam = parsedUrl.searchParams.get("list");
        if (!listParam) {
          throw new Error("INVALID_PLAYLIST_INPUT");
        }
        playlistId = listParam;
      } catch (e) {
        // If it's not a valid URL, try to parse manual list=... fragments
        if (rawPlaylistInput.includes("list=")) {
          playlistId = rawPlaylistInput.split("list=")[1].split("&")[0];
        }
      }

      try {
        playlistId = decodeURIComponent(playlistId).trim();
      } catch (_err) {
        // Keep original if decode fails
      }

      if (!/^[a-zA-Z0-9_-]{10,80}$/.test(playlistId)) {
        throw new Error(
          "Invalid playlist URL/ID. Please paste a valid YouTube playlist link.",
        );
      }

      // GET source playlist details (to get its name)
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
        console.error("Failed to get source playlist name:", err.message);
        checkAuthError(err);
        if (err.message && err.message.toLowerCase().includes("quota")) {
          throw new Error(
            "Google Cloud daily API quota exceeded. Please try again tomorrow.",
          );
        }
        if (
          err.message &&
          (err.message.toLowerCase().includes("invalid") ||
            err.message.toLowerCase().includes("bad request"))
        ) {
          throw new Error(
            "Invalid playlist URL/ID. Please paste a valid YouTube playlist link.",
          );
        }
        throw err;
      }

      // Determine target playlist: use existing or create new
      let newId;
      if (targetPlaylistId) {
        // Use the pre-selected existing playlist — skip creation (saves 50 quota units)
        newId = targetPlaylistId;
      } else {
        const playlistTitle = customName || sourcePlaylistTitle;
        const newPlaylist = await youtube.playlists.insert({
          part: "snippet,status",
          requestBody: {
            snippet: { title: playlistTitle },
            status: { privacyStatus: "private" },
          },
        });
        newId = newPlaylist.data.id;
      }

      // Fetch all videos from source playlist (with pagination)
      const videos = [];
      let pageToken = undefined;

      try {
        do {
          const listRes = await youtube.playlistItems.list({
            part: "snippet",
            playlistId,
            maxResults: 50,
            pageToken,
          });

          const items = listRes.data.items || [];
          // Keep only entries that contain a valid video id
          items.forEach((item) => {
            const vid = item?.snippet?.resourceId?.videoId;
            if (vid) videos.push(item);
          });

          pageToken = listRes.data.nextPageToken;
        } while (pageToken);
      } catch (err) {
        checkAuthError(err);
        if (
          err.message &&
          (err.message.toLowerCase().includes("invalid") ||
            err.message.toLowerCase().includes("bad request"))
        ) {
          throw new Error(
            "Invalid playlist URL/ID. Please paste a valid YouTube playlist link.",
          );
        }
        throw err;
      }

      if (videos.length === 0) {
        throw new Error("No valid videos found in source playlist.");
      }

      // INSERT video satu per satu
      let successCount = 0;
      let failedCount = 0;

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

          // Jika sukses, tambah counter dan kirim status "success"
          successCount++;
          win.webContents.send("progress", {
            current: i + 1,
            total: videos.length,
            videoId: vid,
            status: "success",
            successCount,
            failedCount,
          });
        } catch (err) {
          console.log("ERROR VIDEO:", vid, err.message);

          // Jika gagal, tambah counter dan kirim status "error"
          failedCount++;
          win.webContents.send("progress", {
            current: i + 1,
            total: videos.length,
            videoId: vid,
            status: "error",
            reason: (err.message || "").replace(/,/g, ""),
            successCount,
            failedCount,
          });

          if (err.message && err.message.toLowerCase().includes("quota")) {
            throw new Error(
              "Google Cloud daily API quota exceeded during transfer. Resume tomorrow.",
            );
          }
          // skip dan lanjut
          continue;
        }

        // DELAY 1 DETIK: Ini kunci utama agar video tidak tercegat Google!
        await new Promise((r) => setTimeout(r, 1000));
      }

      // KEMBALIKAN TOTAL HASILNYA
      return { status: "done", successCount, failedCount };
    } catch (err) {
      checkAuthError(err);
      if (err.message && err.message.toLowerCase().includes("quota")) {
        throw new Error(
          "Your Google Cloud daily API quota (10,000 units/day) has been exhausted. This limit resets every midnight US time.",
        );
      }
      throw err;
    }
  },
);

// Save failed videos list to file (invoked from renderer)
ipcMain.handle("save-failed-list", async (event, { failed }) => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      title: "Save failed videos list",
      defaultPath: `failed-videos-${Date.now()}.json`,
      filters: [{ name: "JSON", extensions: ["json"] }],
    });

    if (canceled || !filePath) return { success: false };

    fs.writeFileSync(filePath, JSON.stringify(failed, null, 2), "utf8");
    return { success: true, path: filePath };
  } catch (err) {
    console.error("Failed to save failed list:", err);
    return { success: false, error: err.message };
  }
});

// Get user playlists (for dropdown in Save Links mode)
ipcMain.handle("get-user-playlists", async (event, { accountName }) => {
  try {
    const token = JSON.parse(fs.readFileSync(`tokens/${accountName}.json`));
    const credentials = JSON.parse(fs.readFileSync("credentials.json"));
    const { client_id, client_secret, redirect_uris } = credentials.installed;

    const auth = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    auth.setCredentials(token);

    const youtube = google.youtube({ version: "v3", auth });
    const res = await youtube.playlists.list({
      part: "snippet",
      mine: true,
      maxResults: 50,
    });

    const playlists = res.data.items.map((p) => ({
      id: p.id,
      title: p.snippet.title,
    }));

    return { success: true, playlists };
  } catch (err) {
    console.error("Failed to get playlists:", err);
    return { success: false, error: err.message };
  }
});

// Save bulk links to playlist
ipcMain.handle("save-bulk-links", async (event, { linksText, accountName, mode, playlistName, playlistId }) => {
  try {
    const credentials = JSON.parse(fs.readFileSync("credentials.json"));
    const token = JSON.parse(fs.readFileSync(`tokens/${accountName}.json`));
    const { client_id, client_secret } = credentials.installed;

    const auth = new google.auth.OAuth2(
      client_id,
      client_secret,
      "http://localhost:5000"
    );
    auth.setCredentials(token);

    // Save refreshed token automatically
    auth.on("tokens", (newTokens) => {
      const merged = { ...token, ...newTokens };
      fs.writeFileSync(`tokens/${accountName}.json`, JSON.stringify(merged));
    });

    const youtube = google.youtube({ version: "v3", auth });

    // Extract video IDs dari links menggunakan regex
    const videoIds = new Set();
    const urlPatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/g,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/g,
    ];

    urlPatterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(linksText)) !== null) {
        videoIds.add(match[1]);
      }
    });

    if (videoIds.size === 0) {
      throw new Error("Tidak ada video ID yang ditemukan di links");
    }

    // Tentukan playlist ID
    let targetPlaylistId = playlistId;
    if (mode === "new") {
      const newPlaylist = await youtube.playlists.insert({
        part: "snippet,status",
        requestBody: {
          snippet: {
            title: playlistName || "Saved Links Playlist",
          },
          status: {
            privacyStatus: "private",
          },
        },
      });
      targetPlaylistId = newPlaylist.data.id;
    }

    // Insert videos dengan tracking success/failed
    let successCount = 0;
    let failedCount = 0;

    for (const [index, videoId] of Array.from(videoIds).entries()) {
      try {
        await youtube.playlistItems.insert({
          part: "snippet",
          requestBody: {
            snippet: {
              playlistId: targetPlaylistId,
              resourceId: {
                kind: "youtube#video",
                videoId: videoId,
              },
            },
          },
        });

        successCount++;
        win.webContents.send("progress", {
          current: index + 1,
          total: videoIds.size,
          videoId: videoId,
          status: "success",
          successCount,
          failedCount,
        });
      } catch (err) {
        console.log("ERROR VIDEO:", videoId, err.message);
        failedCount++;
        win.webContents.send("progress", {
          current: index + 1,
          total: videoIds.size,
          videoId: videoId,
          status: "error",
          reason: (err.message || "").replace(/,/g, ""),
          successCount,
          failedCount,
        });

        if (err.message && err.message.toLowerCase().includes("quota")) {
          throw new Error(
            "Google Cloud daily API quota exceeded. Resume tomorrow."
          );
        }
        continue;
      }

      // Delay 1 detik untuk mencegah spam
      await new Promise((r) => setTimeout(r, 1000));
    }

    return { status: "done", successCount, failedCount, playlistId: targetPlaylistId };
  } catch (err) {
    checkAuthError(err);
    if (err.message && err.message.toLowerCase().includes("quota")) {
      throw new Error(
        "Your Google Cloud daily API quota (10,000 units/day) has been exhausted. This limit resets every midnight US time."
      );
    }
    throw err;
  }
});
