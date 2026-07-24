"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cdn = cdn;
/**
 * CDN 资源地址工具：将本地 images 路径映射为 CDN 地址
 * @module utils/cdn
 */
const index_1 = require("../config/index");
/**
 * 生成 CDN 资源地址
 * @param path 相对 images 目录的路径，如 'huilv/USD.png'
 */
function cdn(path) {
    const clean = path.replace(/^\/?images\//, '').replace(/^\//, '');
    return `${index_1.config.cdnBaseURL.replace(/\/$/, '')}/${clean}`;
}
//# sourceMappingURL=cdn.js.map