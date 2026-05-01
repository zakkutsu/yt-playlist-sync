const sharp = require("sharp");
const pngToIco = require("png-to-ico").default || require("png-to-ico");
const fs = require("fs");
const path = require("path");

const src  = path.join(__dirname, "../assets/icon.png");
const temp = path.join(__dirname, "../assets/icon_256.png");
const dest = path.join(__dirname, "../assets/icon.ico");

// Resize to 256x256 PNG first (required by png-to-ico)
sharp(src)
  .resize(256, 256)
  .png()
  .toFile(temp)
  .then(() => pngToIco(temp))
  .then((buf) => {
    fs.writeFileSync(dest, buf);
    fs.unlinkSync(temp);
    console.log("✅ icon.ico created at assets/icon.ico");
  })
  .catch((err) => {
    console.error("❌ Failed:", err.message);
  });
