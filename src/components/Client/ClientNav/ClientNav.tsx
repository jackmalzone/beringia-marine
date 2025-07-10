import styles from './ClientNav.module.css'

interface ClientNavProps {
  clientSlug: string
  sectionRefs: Record<string, React.RefObject<HTMLDivElement>>
}

export default function ClientNav({ clientSlug, sectionRefs }: ClientNavProps) {
  const handleNavClick = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className={styles.clientNav}>
      <div className={styles.clientNav__container}>
        <div className={styles.clientNav__links}>
          <button 
            className={styles.clientNav__link}
            onClick={() => handleNavClick(sectionRefs[`/clients/${clientSlug}`])}
          >
            Overview
          </button>
          <button 
            className={styles.clientNav__link}
            onClick={() => handleNavClick(sectionRefs[`/clients/${clientSlug}/features`])}
          >
            Features
          </button>
          <button 
            className={styles.clientNav__link}
            onClick={() => handleNavClick(sectionRefs[`/clients/${clientSlug}/value`])}
          >
            Value
          </button>
          <button 
            className={styles.clientNav__link}
            onClick={() => handleNavClick(sectionRefs[`/clients/${clientSlug}/media`])}
          >
            Media
          </button>
        </div>
      </div>
    </nav>
  )
} 