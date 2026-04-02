'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useNavigation } from '@/lib/store/AppStore';
import { templateRaster } from '@/lib/config/template-assets';
import styles from './PhotoGallery.module.css';

interface PhotoGalleryProps {
  className?: string;
}

const GALLERY_THEMES = ['hot', 'cold', 'misc'] as const;

/** Rotating local placeholders — replace with your own curated set when branding. */
const galleryImages = Array.from({ length: 20 }, (_, i) => ({
  src: templateRaster(i + 50),
  alt: `Gallery slide ${i + 1}`,
  theme: GALLERY_THEMES[i % 3],
}));

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ className = '' }) => {
  const { currentPhotoGalleryIndex, setCurrentPhotoGalleryIndex } = useNavigation();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance images - simplified for mobile performance
  useEffect(() => {
    if (galleryImages.length === 0) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentPhotoGalleryIndex((currentPhotoGalleryIndex + 1) % galleryImages.length);
    }, 6000); // Change every 6 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentPhotoGalleryIndex, setCurrentPhotoGalleryIndex]);

  // Safety check for empty gallery
  if (galleryImages.length === 0) {
    return <div className={`${styles.photoGallery} ${className}`} />;
  }

  const currentImage = galleryImages[currentPhotoGalleryIndex] || galleryImages[0];

  return (
    <div className={`${styles.photoGallery} ${className}`}>
      {/* Background Image - simplified for mobile performance */}
      <div className={styles.backgroundImage}>
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          priority
          quality={85}
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Overlay */}
      <div className={styles.overlay} />

      {/* Image Indicator */}
      <div className={styles.indicator}>
        <div className={styles.indicatorDots}>
          {galleryImages.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentPhotoGalleryIndex ? styles.active : ''}`}
              onClick={() => setCurrentPhotoGalleryIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;
