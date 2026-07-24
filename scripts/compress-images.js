#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const sharp = require('sharp');

const IMAGE_DIRS = ['images/tab', 'images/icon', 'images/huilv'];
const OUTPUT_DIR = path.join(__dirname, '../images-compressed');
const QUALITY = 75;
const MAX_WIDTH = 400;

async function compressImage(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  let pipeline = sharp(inputPath);

  const metadata = await pipeline.metadata();
  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH);
  }

  switch (ext) {
    case '.png':
      pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9 });
      break;
    case '.jpg':
    case '.jpeg':
      pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
      break;
    case '.webp':
      pipeline = pipeline.webp({ quality: QUALITY });
      break;
    default:
      return false;
  }

  await pipeline.toFile(outputPath);
  return true;
}

async function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return { processed: 0, saved: 0 };

  const files = fs.readdirSync(dirPath);
  let processed = 0;
  let totalOriginal = 0;
  let totalCompressed = 0;

  for (const file of files) {
    const inputPath = path.join(dirPath, file);
    const stat = fs.statSync(inputPath);

    if (stat.isDirectory()) {
      const sub = await processDirectory(inputPath);
      processed += sub.processed;
      totalOriginal += sub.saved;
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;
    if (file.endsWith('.gif')) continue;

    const relativePath = path.relative(path.join(__dirname, '..'), inputPath);
    const outputPath = path.join(OUTPUT_DIR, relativePath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    try {
      const originalSize = stat.size;
      const success = await compressImage(inputPath, outputPath);

      if (success) {
        const compressedSize = fs.statSync(outputPath).size;
        const saved = originalSize - compressedSize;
        const ratio = ((saved / originalSize) * 100).toFixed(1);
        console.log(
          `[compressed] ${relativePath}: ${(originalSize / 1024).toFixed(1)}KB → ${(compressedSize / 1024).toFixed(1)}KB (saved ${ratio}%)`,
        );
        processed++;
        totalOriginal += originalSize;
        totalCompressed += compressedSize;
      }
    } catch (err) {
      console.error(`[error] ${relativePath}: ${err.message}`);
    }
  }

  return { processed, totalOriginal, totalCompressed };
}

async function main() {
  console.log('🗜️  Starting image compression...\n');

  const rootDir = path.join(__dirname, '..');
  let totalProcessed = 0;
  let totalOriginal = 0;
  let totalCompressed = 0;

  for (const dir of IMAGE_DIRS) {
    const fullPath = path.join(rootDir, dir);
    if (fs.existsSync(fullPath)) {
      const result = await processDirectory(fullPath);
      totalProcessed += result.processed;
      totalOriginal += result.totalOriginal || 0;
      totalCompressed += result.totalCompressed || 0;
    }
  }

  console.log(`\n✅ Compressed ${totalProcessed} images`);
  console.log(
    `   Total: ${(totalOriginal / 1024).toFixed(1)}KB → ${(totalCompressed / 1024).toFixed(1)}KB (saved ${(((totalOriginal - totalCompressed) / totalOriginal) * 100).toFixed(1)}%)`,
  );
  console.log(`   Output directory: ${OUTPUT_DIR}`);
}

main().catch(console.error);
