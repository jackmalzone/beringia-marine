import Image from 'next/image'
import styles from './Overview.module.css'

interface OverviewProps {
  title: string
  description: string
  headerImage: string
  logo?: string
  website?: string
}

export const Overview = ({ title, description, headerImage, logo, website }: OverviewProps) => {
  return (
    <div className={styles.overview__wrapper}>
      <section className={styles.overview}>
        <div 
          className={styles.overview__header} 
          style={{ backgroundImage: `url(${headerImage})` }}
        >
          <div className={styles.overview__content}>
            {logo ? (
              <div className={styles.overview__logo}>
                {website ? (
                  <a 
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.overview__logo_link}
                  >
                    <Image 
                      src={logo} 
                      alt={`${title} logo`} 
                      className={styles.overview__logo_image}
                      width={400}
                      height={200}
                    />
                  </a>
                ) : (
                  <Image 
                    src={logo} 
                    alt={`${title} logo`} 
                    className={styles.overview__logo_image}
                    width={400}
                    height={200}
                  />
                )}
              </div>
            ) : (
              <h1 className={styles.overview__title}>{title}</h1>
            )}
            <p className={styles.overview__description}>{description}</p>
          </div>
        </div>
      </section>
    </div>
  )
} 