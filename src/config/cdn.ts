export const CDN_CONFIG = {
  baseUrl: 'https://cdn.example.com/ailecha',
  imagePath: '/images',
  enableWebp: true
};

export function getCdnImageUrl(imagePath: string): string {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${CDN_CONFIG.baseUrl}${CDN_CONFIG.imagePath}${normalizedPath}`;
}

export function getOptimizedImageUrl(url: string, width?: number, quality = 80): string {
  if (!url) return url;
  const params = new URLSearchParams();
  if (width) params.set('w', String(width));
  params.set('q', String(quality));
  if (CDN_CONFIG.enableWebp) params.set('format', 'webp');
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}
