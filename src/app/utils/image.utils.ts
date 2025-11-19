/**
 * Image utility functions for gallery
 */

export function getImagePath(filename: string): string {
  return `assets/images/${filename}`;
}

export function getWebPPath(filename: string): string {
  // For now, return JPG path since WebP conversion would need build step
  // In production, this would return the WebP version
  return getImagePath(filename.replace(/\.(jpg|jpeg)$/i, '.webp'));
}

export function getResponsiveSrcSet(filename: string): string {
  const basePath = filename.replace(/\.(jpg|jpeg)$/i, '');
  // Return srcset with multiple sizes (would need actual resized images)
  // For now, return single source
  return getImagePath(filename);
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

