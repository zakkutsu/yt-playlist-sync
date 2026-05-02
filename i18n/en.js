module.exports = {
  subtitle: "Transfer your YouTube playlist collection between accounts, hassle-free.",

  // Steps
  step01:      "Step 01",
  step01Title: "Google Cloud API Access",
  step01Desc:  "Load your <code class='text-red-500 font-mono'>credentials.json</code> file from your Google Cloud project.",
  step02:      "Step 02",
  step02Title: "Account Authorization",
  step02Desc:  "Select or add a destination YouTube account for the transfer.",
  step03:      "Step 03",
  step03Title: "Start Transfer",
  step03Desc:  "Enter the source playlist URL to begin processing.",

  // Buttons & labels
  btnLoadCreds:       "Load Credentials",
  credsWaiting:       "Waiting for file...",
  selectAccount:      "Select Saved Account...",
  btnNewAccount:      "New Account",
  noAccount:          "No account connected yet",
  btnTransfer:        "Transfer Playlist",
  progressProcessing: "PROCESSING",

  // Dynamic strings
  active:        (v) => `Active: ${v}`,
  openingFile:   "Opening file...",
  apiActive:     "API Active",
  failedLoad:    "Failed to load",
  waitingAuth:   "Waiting for browser authorization...",

  // Toast messages
  toastUrlTitle: "URL Required",
  toastUrlMsg:   "Please enter a YouTube playlist URL first.",
  toastAccTitle: "No Account Selected",
  toastAccMsg:   "Please select or add a YouTube account in Step 02.",

  // Transfer states
  processing:    "Processing Transfer...",
  done:          "Done! ✨",
  doneLabel:     "Done!",
  failed:        "Failed",
  errorOccurred: "An error occurred",
  tryAgain:      "Try Again",
  ofVideos:      (c, t) => `${c} of ${t} videos`,

  // Custom rename
  playlistName:     "Playlist Name (Optional)",
  playlistNameDesc: "Leave blank to use the original playlist name",
  playlistNamePlaceholder: "Enter custom playlist name...",

  // Tab navigation
  tabSyncPlaylist:      "Sync Playlist",
  tabSaveLinks:         "Save Links",
  tabSyncDesc:          "Transfer entire playlist from one account to another",
  tabLinksDesc:         "Save multiple links into one playlist",

  // Save Links mode
  destPlaylist:         "Destination Playlist",
  linksLabel:           "Links List",
  linksTextarea:        "Paste links here (one per line)...",
  linksCreateNew:       "Create New Playlist",
  linksUseExisting:     "Use Existing Playlist",
  selectPlaylist:       "Select a playlist...",
  btnSaveLinks:         "Save Links to Playlist",
  newPlaylistName:      "New Playlist Name",

  // Log and Toast additions
  logTitle:             "Transfer Log",
  logStats:             (s, f) => `Success: ${s} | Failed: ${f}`,
  toastTransferDone:    "Transfer Completed",
  toastTransferPartial: (s, f) => `${s} Succeeded, ${f} Failed.`,
  toastTransferAll:     "All videos successfully transferred!",
  toastLinksDone:       "Save Links Completed",
  toastLinksPartial:    (s, f) => `${s} Succeeded, ${f} Failed.`,
  toastLinksAll:        "All links successfully saved!",
  toastNeedLink:        "Please enter links",
  toastNeedPlaylist:    "Please select a playlist"
};
