const { app, BrowserWindow, ipcMain } = require('electron');
const { google } = require('googleapis');
const open = (...args) => import('open').then(mod => mod.default(...args));
const http = require('http');
const fs = require('fs');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// LOGIN HANDLER
ipcMain.handle('login-google', async () => {
  const credentials = JSON.parse(fs.readFileSync('credentials.json'));
  const { client_id, client_secret, redirect_uris } =
    credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube'],
    prompt: 'consent'
  });

  // LOCAL SERVER
  const server = http
    .createServer(async (req, res) => {
      const url = new URL(req.url, 'http://localhost:5000');
      const code = url.searchParams.get('code');

      if (code) {
        res.end('Login sukses, boleh tutup tab ini.');

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        fs.writeFileSync('token.json', JSON.stringify(tokens));

        server.close();

        win.webContents.send('login-success');
      }
    })
    .listen(5000);

  await open(authUrl);
});

ipcMain.handle('transfer-playlist', async (event, playlistUrl) => {
  const credentials = JSON.parse(fs.readFileSync('credentials.json'));
  const token = JSON.parse(fs.readFileSync('token.json'));

  const { client_id, client_secret, redirect_uris } = credentials.installed;

  const auth = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  auth.setCredentials(token);

  const youtube = google.youtube({ version: 'v3', auth });

  // Extract playlist ID
  const playlistId = playlistUrl.split('list=')[1];

  // GET videos
  let videos = [];
  let nextPageToken = null;

  do {
    const res = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId,
      maxResults: 50,
      pageToken: nextPageToken
    });

    videos.push(...res.data.items);
    nextPageToken = res.data.nextPageToken;
  } while (nextPageToken);

  // CREATE playlist baru
  const newPlaylist = await youtube.playlists.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title: 'Imported Playlist'
      },
      status: {
        privacyStatus: 'private'
      }
    }
  });

  const newId = newPlaylist.data.id;

  // INSERT video satu per satu
for (let i = 0; i < videos.length; i++) {
  const vid = videos[i].snippet.resourceId.videoId;

  try {
    await youtube.playlistItems.insert({
      part: 'snippet',
      requestBody: {
        snippet: {
          playlistId: newId,
          resourceId: {
            kind: 'youtube#video',
            videoId: vid
          }
        }
      }
    });

    win.webContents.send('progress', {
      current: i + 1,
      total: videos.length
    });

  } catch (err) {
    console.log("ERROR VIDEO:", vid);
    console.log(err.message);

    // skip dan lanjut
    continue;
  }

  // delay kecil biar aman
  await new Promise(r => setTimeout(r, 200));
}

  return 'done';
});