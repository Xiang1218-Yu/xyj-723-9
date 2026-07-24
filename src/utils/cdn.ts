/**
 * CDN 资源地址工具：将本地 images 路径映射为 CDN 地址
 * @module utils/cdn
 */
import { config } from '../config/index';

/**
 * 生成 CDN 资源地址
 * @param path 相对 images 目录的路径，如 'huilv/USD.png'
 */
export function cdn(path: string): string {
  const clean = path.replace(/^\/?images\//, '').replace(/^\//, '');
  return `${config.cdnBaseURL.replace(/\/$/, '')}/${clean}`;
}
