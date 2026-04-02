/**
 * Image utilities for Sanity images
 * Uses the existing Sanity image URL builder from apps/web/src/sanity/lib/image.ts
 */
import { urlFor } from '@/sanity/lib/image';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'avif' | 'auto';
  fit?: 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'clip' | 'min';
  dpr?: number;
  blur?: number;
  sharpen?: number;
  saturation?: number;
  brightness?: number;
  contrast?: number;
  invert?: boolean;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  ignoreImageParams?: boolean;
}

export interface ResponsiveImageOptions extends Omit<ImageOptions, 'width'> {
  sizes?: number[];
  aspectRatio?: number;
  maxWidth?: number;
  minWidth?: number;
}

export interface ResponsiveImageSet {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  aspectRatio: number;
  placeholder?: string;
  alt?: string;
}

// Enhanced image URL builder with comprehensive options
export function buildImageUrl(
  image: SanityImageSource | string | null | undefined,
  options: ImageOptions = {}
): string {
  if (!image) {
    console.warn('buildImageUrl: No image provided');
    return '';
  }

  // If image is already a string URL, return it directly (external URLs)
  if (typeof image === 'string') {
    return image;
  }

  const {
    width,
    height,
    quality = 85,
    format = 'auto',
    fit = 'crop',
    dpr = 1,
    blur,
    sharpen,
    saturation,
    brightness,
    contrast,
    invert,
    flipHorizontal,
    flipVertical,
    ignoreImageParams = false,
  } = options;

  try {
    let urlBuilder = urlFor(image);

    // Dimensions
    if (width) urlBuilder = urlBuilder.width(Math.round(width * dpr));
    if (height) urlBuilder = urlBuilder.height(Math.round(height * dpr));

    // Quality and format
    urlBuilder = urlBuilder.quality(Math.min(100, Math.max(1, quality)));

    if (format === 'auto') {
      urlBuilder = urlBuilder.auto('format');
    } else {
      urlBuilder = urlBuilder.format(format);
    }

    // Fit mode
    urlBuilder = urlBuilder.fit(fit);

    // Image adjustments
    if (blur !== undefined) urlBuilder = urlBuilder.blur(blur);
    if (sharpen !== undefined) urlBuilder = urlBuilder.sharpen(sharpen);
    if (saturation !== undefined) urlBuilder = urlBuilder.saturation(saturation);
    if (brightness !== undefined) urlBuilder = urlBuilder.brightness(brightness);
    if (contrast !== undefined) urlBuilder = urlBuilder.contrast(contrast);
    if (invert) urlBuilder = urlBuilder.invert();

    // Transformations
    if (flipHorizontal) urlBuilder = urlBuilder.flipHorizontal();
    if (flipVertical) urlBuilder = urlBuilder.flipVertical();

    // Ignore hotspot/crop if requested
    if (ignoreImageParams) urlBuilder = urlBuilder.ignoreImageParams();

    return urlBuilder.url();
  } catch (error) {
    console.error('Error building image URL:', error);
    return '';
  }
}

// Generate responsive image set with srcset and sizes
export function buildResponsiveImageSet(
  image: SanityImageSource,
  options: ResponsiveImageOptions = {}
): ResponsiveImageSet {
  const {
    sizes = [320, 640, 768, 1024, 1280, 1920],
    aspectRatio,
    maxWidth = 1920,
    minWidth = 320,
    ...imageOptions
  } = options;

  // Filter sizes based on min/max width
  const filteredSizes = sizes.filter(size => size >= minWidth && size <= maxWidth);

  // Get image metadata if available
  const imageWithMeta = image as any;
  const originalWidth = imageWithMeta?.asset?.metadata?.dimensions?.width;
  const originalHeight = imageWithMeta?.asset?.metadata?.dimensions?.height;
  const originalAspectRatio =
    originalWidth && originalHeight ? originalWidth / originalHeight : aspectRatio || 16 / 9;

  // Generate srcset entries
  const srcSetEntries = filteredSizes.map(width => {
    const height = aspectRatio ? Math.round(width / aspectRatio) : undefined;
    const url = buildImageUrl(image, { ...imageOptions, width, height });
    return `${url} ${width}w`;
  });

  // Generate sizes attribute
  const sizesAttr = ['(max-width: 640px) 100vw', '(max-width: 1024px) 50vw', '33vw'].join(', ');

  // Default image (largest size or middle size)
  const defaultWidth = filteredSizes[Math.floor(filteredSizes.length / 2)] || 800;
  const defaultHeight = aspectRatio ? Math.round(defaultWidth / aspectRatio) : undefined;
  const src = buildImageUrl(image, { ...imageOptions, width: defaultWidth, height: defaultHeight });

  return {
    src,
    srcSet: srcSetEntries.join(', '),
    sizes: sizesAttr,
    width: defaultWidth,
    height: defaultHeight || Math.round(defaultWidth / originalAspectRatio),
    aspectRatio: aspectRatio || originalAspectRatio,
    placeholder: imageWithMeta?.asset?.metadata?.lqip,
    alt: imageWithMeta?.alt || '',
  };
}

// Generate multiple image URLs for different breakpoints
export function buildResponsiveImageUrls(
  image: SanityImageSource,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1920],
  options: Omit<ImageOptions, 'width'> = {}
): Array<{ url: string; width: number; height?: number }> {
  return sizes.map(width => {
    const height = options.height
      ? Math.round((options.height / (options.width || width)) * width)
      : undefined;
    return {
      url: buildImageUrl(image, { ...options, width, height }),
      width,
      height,
    };
  });
}

// Enhanced helper for Next.js Image component
export function getImageProps(
  image: SanityImageSource,
  options: ImageOptions & { alt?: string; priority?: boolean } = {}
) {
  const { width = 800, height = 600, quality = 85, alt, priority, ...restOptions } = options;

  const imageWithMeta = image as any;
  const originalWidth = imageWithMeta?.asset?.metadata?.dimensions?.width;
  const originalHeight = imageWithMeta?.asset?.metadata?.dimensions?.height;

  // Use original dimensions if available and no dimensions specified
  const finalWidth = width || originalWidth || 800;
  const finalHeight = height || originalHeight || 600;

  return {
    src: buildImageUrl(image, { width: finalWidth, height: finalHeight, quality, ...restOptions }),
    width: finalWidth,
    height: finalHeight,
    alt: alt || imageWithMeta?.alt || '',
    priority,
    placeholder: imageWithMeta?.asset?.metadata?.lqip ? ('blur' as const) : undefined,
    blurDataURL: imageWithMeta?.asset?.metadata?.lqip,
  };
}

// Generate optimized image for different use cases
export function getOptimizedImageUrl(
  image: SanityImageSource,
  useCase: 'hero' | 'thumbnail' | 'gallery' | 'avatar' | 'background' | 'og-image',
  customOptions: ImageOptions = {}
): string {
  const presets: Record<typeof useCase, ImageOptions> = {
    hero: {
      width: 1920,
      height: 1080,
      quality: 90,
      format: 'auto',
      fit: 'crop',
    },
    thumbnail: {
      width: 300,
      height: 200,
      quality: 80,
      format: 'auto',
      fit: 'crop',
    },
    gallery: {
      width: 800,
      height: 600,
      quality: 85,
      format: 'auto',
      fit: 'crop',
    },
    avatar: {
      width: 150,
      height: 150,
      quality: 85,
      format: 'auto',
      fit: 'crop',
    },
    background: {
      width: 1920,
      height: 1080,
      quality: 75,
      format: 'auto',
      fit: 'crop',
    },
    'og-image': {
      width: 1200,
      height: 630,
      quality: 90,
      format: 'jpg',
      fit: 'crop',
    },
  };

  const options = { ...presets[useCase], ...customOptions };
  return buildImageUrl(image, options);
}

// Extract hotspot information
export function getImageHotspot(image: any): { x: number; y: number } | null {
  if (!image?.hotspot) return null;

  return {
    x: image.hotspot.x,
    y: image.hotspot.y,
  };
}

// Extract crop information
export function getImageCrop(image: any): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} | null {
  if (!image?.crop) return null;

  return {
    top: image.crop.top,
    bottom: image.crop.bottom,
    left: image.crop.left,
    right: image.crop.right,
  };
}

// Get image metadata
export function getImageMetadata(image: any): {
  width: number;
  height: number;
  aspectRatio: number;
  lqip?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
} | null {
  if (!image?.asset?.metadata) return null;

  const { dimensions, lqip, hasAlpha, isOpaque } = image.asset.metadata;

  return {
    width: dimensions.width,
    height: dimensions.height,
    aspectRatio: dimensions.aspectRatio,
    lqip,
    hasAlpha,
    isOpaque,
  };
}

// Validate image source
export function isValidImageSource(image: unknown): image is SanityImageSource {
  if (!image || typeof image !== 'object') return false;

  // Check for asset reference
  if ('asset' in image && image.asset && typeof image.asset === 'object') {
    return '_ref' in image.asset || '_id' in image.asset || 'url' in image.asset;
  }

  // Check for direct asset
  if ('_id' in image || 'url' in image) return true;

  return false;
}

// Generate placeholder for loading states
export function generateImagePlaceholder(width: number, height: number, color = '#f0f0f0'): string {
  // Generate a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial, sans-serif" font-size="14">
        Loading...
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Performance optimization: preload critical images
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Batch preload multiple images
export async function preloadImages(sources: string[]): Promise<void> {
  try {
    await Promise.all(sources.map(preloadImage));
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
}
