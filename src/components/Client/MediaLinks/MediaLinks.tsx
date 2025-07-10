import styles from './MediaLinks.module.css'

interface MediaLinksProps {
  links?: {
    website?: string
    youtube?: string
    linkedin?: string
    sketchfab?: string
    email?: string
  }
}

export const MediaLinks = ({ links }: MediaLinksProps) => {
  if (!links) return null

  return (
    <section className={styles.media_links}>
      <div className={styles.media_links__container}>
        <h2 className={styles.media_links__title}>Connect With Us</h2>
        <div className={styles.media_links__grid}>
          {links.website && (
            <a href={links.website} target="_blank" rel="noopener noreferrer" className={styles.media_links__link}>
              Website
            </a>
          )}
          {links.youtube && (
            <a href={links.youtube} target="_blank" rel="noopener noreferrer" className={styles.media_links__link}>
              YouTube
            </a>
          )}
          {links.linkedin && (
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className={styles.media_links__link}>
              LinkedIn
            </a>
          )}
          {links.sketchfab && (
            <a href={links.sketchfab} target="_blank" rel="noopener noreferrer" className={styles.media_links__link}>
              Sketchfab
            </a>
          )}
          {links.email && (
            <a href={`mailto:${links.email}`} className={styles.media_links__link}>
              Email
            </a>
          )}
        </div>
      </div>
    </section>
  )
} 