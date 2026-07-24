/**
 * CDN 上传脚本（模板）
 *
 * 用法：npm run upload:cdn
 * 将 images-dist/ 下压缩后的图片上传到对象存储（如腾讯云 COS / 七牛 / 阿里云 OSS），
 * 并生成 src/config/cdn-manifest.json（本地路径 -> CDN URL 映射）。
 *
 * 说明：不同云厂商 SDK 不同，这里给出通用流程骨架，接入时替换 uploadOne 实现，
 * 并通过环境变量注入密钥（切勿硬编码到仓库）。
 */
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '../images-dist');
const MANIFEST = path.resolve(__dirname, '../src/config/cdn-manifest.json');

const CDN_BASE = process.env.CDN_BASE_URL || 'https://cdn.zhaotool.com/miniprogram';

function collectFiles(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectFiles(full, base));
    } else {
      out.push(path.relative(base, full));
    }
  }
  return out;
}

/**
 * 上传单个文件到 CDN。接入时替换为真实 SDK 调用。
 * @returns {Promise<string>} CDN 完整 URL
 */
async function uploadOne(relPath) {
  // TODO: 替换为 cos.putObject / oss.put / qiniu.upload 等真实实现
  // 这里仅按约定生成目标 URL
  return `${CDN_BASE.replace(/\/$/, '')}/${relPath.split(path.sep).join('/')}`;
}

async function run() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error('请先执行 npm run compress:images 生成 images-dist/');
    process.exit(1);
  }
  const files = collectFiles(SRC_DIR);
  const manifest = {};
  for (const rel of files) {
    manifest[`images/${rel.split(path.sep).join('/')}`] = await uploadOne(rel);
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.warn(`已上传 ${files.length} 个文件，映射写入 ${path.relative(process.cwd(), MANIFEST)}`);
}

run().catch((err) => {
  console.error('CDN 上传失败:', err);
  process.exit(1);
});
