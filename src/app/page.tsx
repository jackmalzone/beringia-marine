import Hero from '@/components/Hero/Hero'
import styles from './page.module.css'

export default function Home() {
  return (
      <main className={styles.main}>
      <Hero 
        title="Beringia Marine Technologies"
        subtitle="Sales Engineering & Consulting for Marine Technology"
        backgroundImage="/assets/beringia/seascape-wallpaper.jpg"
        showCallToAction={true}
        showScrollIndicator={true}
      />

      <section id="main-content" className={styles.missionSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            Beringia Marine provides the experience and passion necessary for 
            increasing our knowledge of the oceans. We work with companies to 
            identify and fill the gaps in marine technology to provide scalable 
            solutions for our oceans. Whether you're an established player or a startup, 
            Beringia has the expertise, network and passion to rapidly scale your success.
          </p>
        </div>
      </section>
      
      <section className={styles.solutionsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Solutions</h2>
          <div className={styles.solutionsGrid}>
            <div className={styles.solutionCard}>
              <h3 className={styles.solutionTitle}>Mission Robotics</h3>
              <p className={styles.solutionDescription}>
                Advanced underwater robotics for exploration and research missions.
              </p>
              <a href="/clients/mission-robotics" className={styles.solutionLink}>
                Learn More →
              </a>
            </div>
            
            <div className={styles.solutionCard}>
              <h3 className={styles.solutionTitle}>Anchor Bot</h3>
              <p className={styles.solutionDescription}>
                Innovative anchoring solutions for marine applications.
              </p>
              <a href="/clients/anchor-bot" className={styles.solutionLink}>
                Learn More →
              </a>
            </div>
            
            <div className={styles.solutionCard}>
              <h3 className={styles.solutionTitle}>Advanced Navigation</h3>
              <p className={styles.solutionDescription}>
                Cutting-edge navigation systems for marine vessels.
              </p>
              <a href="/clients/advanced-navigation" className={styles.solutionLink}>
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <section className={styles.expertiseSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Expertise</h2>
          <div className={styles.expertiseGrid}>
            <div className={styles.expertiseItem}>
              <h3 className={styles.expertiseTitle}>Marine Technology</h3>
              <p className={styles.expertiseDescription}>
                Deep understanding of underwater systems, robotics, and marine engineering.
              </p>
            </div>
            
            <div className={styles.expertiseItem}>
              <h3 className={styles.expertiseTitle}>Sales Engineering</h3>
              <p className={styles.expertiseDescription}>
                Technical sales expertise to bridge the gap between technology and market needs.
              </p>
            </div>
            
            <div className={styles.expertiseItem}>
              <h3 className={styles.expertiseTitle}>Consulting</h3>
              <p className={styles.expertiseDescription}>
                Strategic guidance for marine technology companies and startups.
              </p>
            </div>
          </div>
    </div>
      </section>
    </main>
  )
}
