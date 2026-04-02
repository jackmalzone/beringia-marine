'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useNavigation } from '@/lib/store/AppStore';
import styles from './PhotoGallery.module.css';

interface PhotoGalleryProps {
  className?: string;
}

// Curated gallery of themed images (hot/cold/misc) - mixed order for variety
const galleryImages = [
  {
    src: 'https://media.vitalicesf.com/calm_volcanic-lake-shore.jpg',
    alt: 'Volcanic lake shore',
    theme: 'hot',
  },
  {
    src: 'https://media.vitalicesf.com/ice_morninglight.jpg',
    alt: 'Ice in morning light',
    theme: 'cold',
  },
  {
    src: 'https://media.vitalicesf.com/water_lava-red-lighting.jpg',
    alt: 'Water with lava red lighting',
    theme: 'hot',
  },
  {
    src: 'https://media.vitalicesf.com/cold_arctic-mountains.jpg',
    alt: 'Arctic mountains',
    theme: 'cold',
  },
  {
    src: 'https://media.vitalicesf.com/lava_aerial-volcanic-cauldron.jpg',
    alt: 'Aerial volcanic cauldron',
    theme: 'hot',
  },
  {
    src: 'https://media.vitalicesf.com/ice_stunning-glacier.jpg',
    alt: 'Stunning glacier',
    theme: 'cold',
  },
  {
    src: 'https://media.vitalicesf.com/embers_vertical.jpg',
    alt: 'Vertical embers',
    theme: 'hot',
  },
  {
    src: 'https://media.vitalicesf.com/moon_above-iceberg.jpg',
    alt: 'Moon above iceberg',
    theme: 'misc',
  },
  {
    src: 'https://media.vitalicesf.com/lava_texture-aerial_flow.jpg',
    alt: 'Aerial lava flow texture',
    theme: 'hot',
  },
  {
    src: 'https://media.vitalicesf.com/ice_texture-cracks.jpg',
    alt: 'Ice texture cracks',
    theme: 'cold',
  },
  {
    src: 'https://media.vitalicesf.com/moon_majestic-mountain-sunrise.jpg',
    alt: 'Moon over majestic mountain sunrise',
    theme: 'misc',
  },
  {
    src: 'https://media.vitalicesf.com/lava-closeup.jpg',
    alt: 'Lava closeup',
    theme: 'hot',
  },
  {
    src: 'https://media.vitalicesf.com/ice_silver-texture.jpg',
    alt: 'Ice silver texture',
    theme: 'cold',
  },
  {
    src: 'https://media.vitalicesf.com/sand_ripples.jpg',
    alt: 'Sand ripples',
    theme: 'misc',
  },
  {
    src: 'https://media.vitalicesf.com/lavastones.jpg',
    alt: 'Lava stones',
    theme: 'hot',
  },
  {
    src: 'https://media.vitalicesf.com/cold_usgs-aerial_coastline.jpg',
    alt: 'USGS aerial coastline',
    theme: 'cold',
  },
  {
    src: 'https://media.vitalicesf.com/moon-snow.jpg',
    alt: 'Moon over snow',
    theme: 'misc',
  },
  {
    src: 'https://media.vitalicesf.com/light_blurryhues.jpg',
    alt: 'Light blurry hues',
    theme: 'misc',
  },
  {
    src: 'https://media.vitalicesf.com/ice-glaciersonblack.jpg',
    alt: 'Ice glaciers on black',
    theme: 'cold',
  },
  {
    src: 'https://media.vitalicesf.com/moon-yosemite.jpg',
    alt: 'Moon over Yosemite',
    theme: 'misc',
  },
  {
    src: 'https://media.vitalicesf.com/moonscape_snowdrift.jpg',
    alt: 'Moonscape snowdrift',
    theme: 'misc',
  },
];

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
