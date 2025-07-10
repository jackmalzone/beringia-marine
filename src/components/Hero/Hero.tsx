'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Hero.module.css'

interface HeroProps {
  title?: string
  subtitle?: string
  backgroundImage?: string
  showScrollIndicator?: boolean
  showCallToAction?: boolean
}

export default function Hero({ 
  title = "Marine Technology Solutions",
  subtitle = "Advancing ocean exploration and research through innovative technology",
  backgroundImage = "/assets/beringia/seascape-wallpaper.jpg",
  showScrollIndicator = true,
  showCallToAction = true
}: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleImageLoad = () => {
    setIsLoaded(true)
  }

  const handleScrollToContent = () => {
    const element = document.getElementById('main-content')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      className={styles.hero}
      style={{ 
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined 
      }}
    >
      {/* Background Overlay */}
      <div className={styles.heroOverlay} />
      
      {/* Background Image */}
      {backgroundImage && (
        <div className={styles.heroBackground}>
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            priority
            className={styles.heroBackgroundImage}
            onLoad={handleImageLoad}
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Content */}
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            {title}
          </h1>
          <p className={styles.heroSubtitle}>
            {subtitle}
          </p>
          
          {showCallToAction && (
            <div className={styles.heroActions}>
              <Link href="/clients" className={styles.heroPrimaryButton}>
                Explore Solutions
              </Link>
              <Link href="/about" className={styles.heroSecondaryButton}>
                Learn More
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <button 
          className={styles.heroScrollIndicator}
          onClick={handleScrollToContent}
          aria-label="Scroll to content"
        >
          <span className={styles.scrollIndicatorText}>Scroll to explore</span>
          <div className={styles.scrollIndicatorArrow}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M7 13l5 5 5-5" />
              <path d="M7 6l5 5 5-5" />
            </svg>
          </div>
        </button>
      )}

      {/* Animated Background Elements */}
      <div className={styles.heroBackgroundElements}>
        <div className={styles.heroWave}></div>
        <div className={styles.heroWave}></div>
        <div className={styles.heroWave}></div>
      </div>
    </section>
  )
} 