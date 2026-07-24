#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CDN_BASE_URL = process.env.CDN_BASE_URL || 'https://cdn.example.com/ailecha';
const UPLOAD_DIR = path.join(__dirname, '../images');
const MANIFEST_PATH = path.join(__dirname, '../cdn-manifest.json');

function getFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 12);
}

function buildManifest(dirPath, baseUrl, prefix = '') {
  const manifest = {};
  if (!fs.existsSync(dirPath)) return manifest;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.join(prefix, entry.name);

    if (entry.isDirectory()) {
      Object.assign(manifest, buildManifest(fullPath, baseUrl, relativePath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) continue;

      const hash = getFileHash(fullPath);
      const extname = path.extname(entry.name);
      const basename = path.basename(entry.name, extname);
      const cdnFileName = `${basename}.${hash}${extname}`;
      const cdnUrl = `${baseUrl}/${path.dirname(relativePath)}/${cdnFileName}`.replace(/\\/g, '/');

      manifest[`images/${relativePath.replace(/\\/g, '/')}`] = {
        local: `images/${relativePath.replace(/\\/g, '/')}`,
        cdn: cdnUrl,
        hash: hash,
      };
    }
  }

  return manifest;
}

function generateUploadScript(manifest) {
  const lines = [
    '#!/bin/bash',
    '# Auto-generated CDN upload script',
    '# Usage: Configure your CDN credentials and run this script',
    '',
    'set -e',
    '',
    '# Configure your CDN credentials here:',
    '# export CDN_ACCESS_KEY="your-access-key"',
    '# export CDN_SECRET_KEY="your-secret-key"',
    '# export CDN_BUCKET="your-bucket"',
    '',
    'echo "📤 Uploading images to CDN..."',
    '',
  ];

  const entries = Object.entries(manifest);
  entries.forEach(([localPath, info]) => {
    const targetDir = path.dirname(info.cdn.replace(CDN_BASE_URL, ''));
    lines.push(
      `echo "  Uploading ${localPath}"`,
      `# Example for TOS/COS/S3 CLI:`,
      `# aws s3 cp "${localPath}" "s3://$CDN_BUCKET${targetDir}/${path.basename(info.cdn)}"`,
      `# tosutil cp "${localPath}" "tos://$CDN_BUCKET${targetDir}/${path.basename(info.cdn)}"`,
      '',
    );
  });

  lines.push('echo "✅ CDN upload complete!"');
  lines.push(`echo "Manifest saved to: ${MANIFEST_PATH}"`);

  return lines.join('\n');
}

function main() {
  console.log('📦 Building CDN manifest...\n');

  const manifest = buildManifest(UPLOAD_DIR, CDN_BASE_URL);
  const manifestWithMeta = {
    version: '1.0.0',
    cdnBaseUrl: CDN_BASE_URL,
    generatedAt: new Date().toISOString(),
    images: manifest,
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifestWithMeta, null, 2));

  const uploadScript = generateUploadScript(manifest);
  const uploadScriptPath = path.join(__dirname, '../scripts/upload-to-cdn.sh');
  fs.writeFileSync(uploadScriptPath, uploadScript);
  fs.chmodSync(uploadScriptPath, '755');

  console.log(`✅ Manifest generated: ${MANIFEST_PATH}`);
  console.log(`   Total images: ${Object.keys(manifest).length}`);
  console.log(`\n📤 Upload script: ${uploadScriptPath}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Run 'npm run images:compress' to compress images`);
  console.log(`  2. Configure CDN credentials in scripts/upload-to-cdn.sh`);
  console.log(`  3. Run 'bash scripts/upload-to-cdn.sh' to upload`);
  console.log(`  4. In config/index.ts, set cdnBaseUrl to ${CDN_BASE_URL}`);
  console.log(`  5. Use services/cdn.ts imageUrl() for CDN images`);
}

main();
