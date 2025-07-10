'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './Gallery.module.css'
import { GalleryItem } from '@/types'

interface GalleryProps {
  items: GalleryItem[]
  title?: string
}

export default function Gallery({ items, title }: GalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  if (!items || items.length === 0) {
    return null
  }

  return (
    <section className={styles.gallery}>
      {title && <h2 className={styles.title}>{title}</h2>}
      
      <div className={styles.grid}>
        {items.map((item, index) => (
          <div key={item.id || index} className={styles.item}>
            {item.type === 'image' && item.image?.asset?.url && (
              <div 
                className={styles.imageContainer}
                onClick={() => setSelectedItem(item)}
              >
                <Image
                  src={item.image.asset.url}
                  alt={item.image.alt || item.alt || 'Gallery image'}
                  width={400}
                  height={300}
                  className={styles.image}
                />
              </div>
            )}
            
            {item.type === 'video' && item.videoFile?.asset?.url && (
              <div className={styles.videoContainer}>
                <video
                  src={item.videoFile.asset.url}
                  controls={item.videoOptions?.controls !== false}
                  autoPlay={item.videoOptions?.autoplay}
                  muted={item.videoOptions?.muted}
                  loop={item.videoOptions?.loop}
                  preload={item.videoOptions?.preload || 'metadata'}
                  className={styles.video}
                />
              </div>
            )}
            
            {item.type === 'sketchfab' && item.modelId && (
              <div className={styles.modelContainer}>
                <iframe
                  src={`https://sketchfab.com/models/${item.modelId}/embed`}
                  title={item.alt || '3D Model'}
                  className={styles.model}
                  allowFullScreen
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for full-size image view */}
      {selectedItem && selectedItem.type === 'image' && selectedItem.image?.asset?.url && (
        <div className={styles.modal} onClick={() => setSelectedItem(null)}>
          <div className={styles.modalContent}>
            <Image
              src={selectedItem.image.asset.url}
              alt={selectedItem.image.alt || selectedItem.alt || 'Full size image'}
              width={800}
              height={600}
              className={styles.modalImage}
            />
            <button 
              className={styles.closeButton}
              onClick={() => setSelectedItem(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  )
} 