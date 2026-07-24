"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUrl = exports.localImage = exports.cdnImage = void 0;
const index_1 = require("../config/index");
const config = (0, index_1.getConfig)();
/**
 * 获取 CDN 图片完整 URL
 * @param path 图片相对路径 (如 'tab/tab_home_def@2x.png')
 */
function cdnImage(path) {
    if (!path)
        return '';
    if (path.startsWith('http://') || path.startsWith('https://'))
        return path;
    if (path.startsWith('data:'))
        return path;
    const baseUrl = config.cdnBaseUrl.replace(/\/$/, '');
    const normalizedPath = path.replace(/^\//, '');
    return `${baseUrl}/${normalizedPath}`;
}
exports.cdnImage = cdnImage;
/**
 * 获取本地图片路径（降级方案）
 * @param path 图片相对路径
 */
function localImage(path) {
    return `/images/${path.replace(/^\//, '')}`;
}
exports.localImage = localImage;
/**
 * 根据环境获取图片 URL（CDN 优先，降级本地）
 */
function imageUrl(path) {
    if (config.env === 'development') {
        return localImage(path);
    }
    return cdnImage(path);
}
exports.imageUrl = imageUrl;
//# sourceMappingURL=cdn.js.map