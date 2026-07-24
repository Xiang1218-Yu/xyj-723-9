/**
 * 微信小程序 CI 上传脚本
 *
 * 用法：npm run ci:upload
 * 依赖 miniprogram-ci，在 CI 环境中完成体验版/正式版上传。
 * 需要通过环境变量注入：
 *   - MP_APPID：小程序 appid
 *   - MP_PRIVATE_KEY：上传私钥内容（微信公众平台生成的 key，建议存 CI Secret）
 *   - CI_VERSION：版本号（缺省取 package.json version）
 *   - CI_DESC：版本描述（缺省取最新 git commit message）
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ci = require('miniprogram-ci');

const pkg = require('../package.json');

async function run() {
  const appid = process.env.MP_APPID;
  const privateKeyContent = process.env.MP_PRIVATE_KEY;
  if (!appid || !privateKeyContent) {
    console.error('缺少 MP_APPID 或 MP_PRIVATE_KEY 环境变量');
    process.exit(1);
  }

  // 私钥写入临时文件
  const keyPath = path.resolve(__dirname, '.mp-private.key');
  fs.writeFileSync(keyPath, privateKeyContent);

  const version = process.env.CI_VERSION || pkg.version;
  let desc = process.env.CI_DESC;
  if (!desc) {
    try {
      desc = execSync('git log -1 --pretty=%s').toString().trim();
    } catch {
      desc = 'CI 自动上传';
    }
  }

  const project = new ci.Project({
    appid,
    type: 'miniProgram',
    projectPath: path.resolve(__dirname, '..'),
    privateKeyPath: keyPath,
    ignores: ['node_modules/**/*', 'src/**/*', 'scripts/**/*'],
  });

  try {
    const result = await ci.upload({
      project,
      version,
      desc,
      setting: {
        es6: true,
        minify: true,
        codeProtect: true,
        autoPrefixWXSS: true,
      },
      onProgressUpdate: () => {},
    });
    console.warn('上传成功:', JSON.stringify(result));
  } finally {
    fs.unlinkSync(keyPath);
  }
}

run().catch((err) => {
  console.error('CI 上传失败:', err);
  process.exit(1);
});
