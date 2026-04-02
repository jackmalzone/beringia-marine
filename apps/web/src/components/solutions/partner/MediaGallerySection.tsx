'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { sketchfabEmbedUrl } from '@/lib/media/sketchfab';
import styles from './MediaGallerySection.module.css';

export type GalleryRenderable =
  | { id: string; type: 'image'; url: string; alt: string }
  | { id: string; type: 'sketchfab'; modelId: string; alt: string };

export function MediaGallerySection({ items }: { items: GalleryRenderable[] }) {
  const imageItems = items.filter((i) => i.type === 'image');
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const close = useCallback(() => setOpen(false), []);

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? imageItems.length - 1 : i - 1));
  }, [imageItems.length]);

  const next = useCallback(() => {
    setIndex((i) => (i === imageItems.length - 1 ? 0 : i + 1));
  }, [imageItems.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close, prev, next]);

  if (!items.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Gallery</h2>
        <div className={styles.grid}>
          {items.map((item, idx) => {
            if (item.type === 'image') {
              const imgIdx = imageItems.findIndex((x) => x.id === item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={styles.thumb}
                  onClick={() => openAt(imgIdx >= 0 ? imgIdx : 0)}
                >
                  <Image
                    src={item.url}
                    alt={item.alt}
                    width={400}
                    height={200}
                    className={styles.thumbImg}
                    unoptimized={item.url.endsWith('.webp')}
                  />
                  {item.alt ? <div className={styles.caption}>{item.alt}</div> : null}
                </button>
              );
            }
            return (
              <div key={item.id} className={styles.thumb}>
                <iframe
                  title={item.alt}
                  className={styles.thumbEmbed}
                  src={sketchfabEmbedUrl(item.modelId)}
                  allow="fullscreen; xr-spatial-tracking"
                  allowFullScreen
                  loading="lazy"
                />
                {item.alt ? <div className={styles.caption}>{item.alt}</div> : null}
              </div>
            );
          })}
        </div>
      </div>

      {open && imageItems[index] ? (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onClick={close}
        >
          <div
            className={styles.modalInner}
            role="presentation"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.close} onClick={close} aria-label="Close">
              ×
            </button>
            {imageItems.length > 1 ? (
              <>
                <button type="button" className={`${styles.nav} ${styles.navPrev}`} onClick={prev} aria-label="Previous">
                  ‹
                </button>
                <button type="button" className={`${styles.nav} ${styles.navNext}`} onClick={next} aria-label="Next">
                  ›
                </button>
              </>
            ) : null}
            <Image
              src={imageItems[index].url}
              alt={imageItems[index].alt}
              width={1200}
              height={800}
              className={styles.modalMedia}
              unoptimized={imageItems[index].url.endsWith('.webp')}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
