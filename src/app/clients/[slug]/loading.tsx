import styles from './loading.module.css'

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logoSkeleton}></div>
        <div className={styles.titleSkeleton}></div>
        <div className={styles.descriptionSkeleton}></div>
      </div>
      
      <div className={styles.section}>
        <div className={styles.sectionTitleSkeleton}></div>
        <div className={styles.contentSkeleton}></div>
      </div>
      
      <div className={styles.section}>
        <div className={styles.sectionTitleSkeleton}></div>
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.cardSkeleton}>
              <div className={styles.cardIconSkeleton}></div>
              <div className={styles.cardTitleSkeleton}></div>
              <div className={styles.cardDescriptionSkeleton}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 