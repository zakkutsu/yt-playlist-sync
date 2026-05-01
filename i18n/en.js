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
};
