import { getConfig } from '../config/index';

const config = getConfig();

/**
 * 获取 CDN 图片完整 URL
 * @param path 图片相对路径 (如 'tab/tab_home_def@2x.png')
 */
export function cdnImage(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('data:')) return path;
  const baseUrl = config.cdnBaseUrl.replace(/\/$/, '');
  const normalizedPath = path.replace(/^\//, '');
  return `${baseUrl}/${normalizedPath}`;
}

/**
 * 获取本地图片路径（降级方案）
 * @param path 图片相对路径
 */
export function localImage(path: string): string {
  return `/images/${path.replace(/^\//, '')}`;
}

/**
 * 根据环境获取图片 URL（CDN 优先，降级本地）
 */
export function imageUrl(path: string): string {
  if (config.env === 'development') {
    return localImage(path);
  }
  return cdnImage(path);
}
