import sharp from "sharp";
import fs from "fs";
import path from "path";
import os from "os";

const productsDir = "./public/images/products";
const products = fs.readdirSync(productsDir);

for (const product of products) {
  const productPath = path.join(productsDir, product);
  if (!fs.statSync(productPath).isDirectory()) continue;

  const images = fs.readdirSync(productPath).filter((f) => f.endsWith(".jpg"));

  for (const img of images) {
    const imgPath = path.join(productPath, img);
    const metadata = await sharp(imgPath).metadata();

    if (!metadata.width || !metadata.height) continue;

    const ratio = metadata.width / metadata.height;
    const targetRatio = 3 / 4;
    const tolerance = 0.05;

    if (Math.abs(ratio - targetRatio) < tolerance) {
      console.log(`✓ ${product}/${img} already 3:4`);
      continue;
    }

    if (Math.abs(ratio - 1) < 0.1) {
      console.log(`◯ ${product}/${img} is square, skipping`);
      continue;
    }

    const newHeight = Math.round(metadata.width / targetRatio);
    const yOffset = Math.max(0, Math.round((metadata.height - newHeight) / 2));
    const tempPath = path.join(os.tmpdir(), `temp-${Date.now()}.jpg`);

    await sharp(imgPath)
      .extract({
        left: 0,
        top: yOffset,
        width: metadata.width,
        height: Math.min(newHeight, metadata.height),
      })
      .toFile(tempPath);

    fs.renameSync(tempPath, imgPath);
    console.log(`→ ${product}/${img} resized to 3:4`);
  }
}

console.log("✓ Done!");
