'use client';

import Image from 'next/image';
import { FC, useState } from 'react';
import { optimizeImageProps, ImageSEOData } from '@/lib/seo/image-optimization';

interface OptimizedImageProps extends Omit<ImageSEOData, 'src' | 'alt'> {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

/**
 * OptimizedImage Component
 *
 * A wrapper around Next.js Image that automatically applies SEO and accessibility optimizations
 * including lazy loading, responsive sizing, and optimized alt text.
 */
const OptimizedImage: FC<OptimizedImageProps> = ({
  src,
  alt,
  context = 'gallery',
  location = 'San Francisco',
  className = '',
  fill = false,
  quality = 85,
  onLoad,
  onError,
  style,
  ...imageData
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Optimize image props using our SEO utility
  const optimizedProps = optimizeImageProps({
    src,
    alt,
    context,
    location,
    ...imageData,
  });

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Determine if image should be lazy loaded based on context
  const shouldLazyLoad = context !== 'logo' && !optimizedProps.priority;

  return (
    <div className={`optimized-image-container ${className}`} style={style}>
      <Image
        src={optimizedProps.src}
        alt={optimizedProps.alt}
        title={optimizedProps.title}
        width={fill ? undefined : optimizedProps.width}
        height={fill ? undefined : optimizedProps.height}
        fill={fill}
        priority={optimizedProps.priority}
        loading={shouldLazyLoad ? 'lazy' : 'eager'}
        quality={quality}
        sizes={optimizedProps.sizes}
        className={`
          ${isLoaded ? 'loaded' : 'loading'}
          ${hasError ? 'error' : ''}
        `}
        onLoad={handleLoad}
        onError={handleError}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />

      {/* Loading state */}
      {!isLoaded && !hasError && (
        <div className="image-loading-placeholder">
          <div className="loading-spinner" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="image-error-placeholder">
          <span>Image failed to load</span>
        </div>
      )}

      <style jsx>{`
        .optimized-image-container {
          position: relative;
          overflow: hidden;
        }

        .image-loading-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #00b7b5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .image-error-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          color: #666;
          font-size: 14px;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .loading {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .loaded {
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .error {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default OptimizedImage;
