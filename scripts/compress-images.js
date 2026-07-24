/**
 * 图片压缩脚本
 *
 * 用法：npm run compress:images
 * 使用 imagemin 对 images/ 下的 png/jpg 进行有损压缩，输出到 images-dist/。
 * 压缩后可执行 npm run upload:cdn 迁移至 CDN。
 */
const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');

const SRC_DIR = path.resolve(__dirname, '../images');
const OUT_DIR = path.resolve(__dirname, '../images-dist');

/** 递归收集所有子目录（保持目录结构） */
function collectDirs(dir) {
  const dirs = [dir];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      dirs.push(...collectDirs(path.join(dir, entry.name)));
    }
  }
  return dirs;
}

async function run() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error('images 目录不存在:', SRC_DIR);
    process.exit(1);
  }

  const dirs = collectDirs(SRC_DIR);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const dir of dirs) {
    const rel = path.relative(SRC_DIR, dir);
    const outDir = path.join(OUT_DIR, rel);
    const files = await imagemin([path.join(dir, '*.{png,jpg,jpeg}')], {
      destination: outDir,
      plugins: [
        imageminPngquant({ quality: [0.6, 0.8] }),
        imageminMozjpeg({ quality: 75 }),
      ],
    });
    files.forEach((f) => {
      const before = fs.statSync(f.sourcePath).size;
      const after = f.data.length;
      totalBefore += before;
      totalAfter += after;
    });
  }

  const saved = totalBefore - totalAfter;
  const ratio = totalBefore ? ((saved / totalBefore) * 100).toFixed(1) : '0';
  console.warn(
    `图片压缩完成：${(totalBefore / 1024).toFixed(0)}KB -> ${(totalAfter / 1024).toFixed(
      0
    )}KB，节省 ${ratio}%（输出至 images-dist/）`
  );
}

run().catch((err) => {
  console.error('压缩失败:', err);
  process.exit(1);
});
