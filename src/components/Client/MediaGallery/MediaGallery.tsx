import styles from './MediaGallery.module.css'

interface MediaGalleryProps {
  items?: any[]
}

export const MediaGallery = ({ items }: MediaGalleryProps) => {
  if (!items || items.length === 0) return null

  return (
    <section className={styles.media_gallery}>
      <div className={styles.media_gallery__container}>
        <h2 className={styles.media_gallery__title}>Gallery</h2>
        <div className={styles.media_gallery__grid}>
          {items.map((item, index) => (
            <div key={index} className={styles.media_gallery__item}>
              {/* Gallery item content */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 