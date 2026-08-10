import sharp from "sharp";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "..", "public", "icons");
const source = readFileSync(path.join(iconsDir, "icon-source.svg"));

const targets = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "icon-512-maskable.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
];

for (const { file, size } of targets) {
  await sharp(source, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(path.join(iconsDir, file));
  console.log(`wrote ${file}`);
}
