'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Footer.module.css'

export default function Footer() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Track scroll and viewport
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300)
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleScroll()
    handleResize()

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerClasses = [
    styles.footer,
    isScrolled ? styles.footerVisible : ''
  ].filter(Boolean).join(' ')

  const currentYear = new Date().getFullYear()

  return (
    <footer className={footerClasses}>
      <div className={styles.footerContent}>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerTitle}>About Beringia</h3>
          <p className={styles.footerText}>
            Providing experience and passion necessary for increasing our knowledge of the oceans.
            <Link href="/about" className={styles.footerTextLink} onClick={handleLinkClick}>
              Learn more →
            </Link>
          </p>
        </div>

        <div className={styles.footerColumn}>
          <h3 className={styles.footerTitle}>Solutions</h3>
          <ul className={styles.footerList}>
            <li className={styles.footerListItem}>
              <Link href="/clients/advanced-navigation" className={styles.footerLink} onClick={handleLinkClick}>
                Advanced Navigation
              </Link>
            </li>
            <li className={styles.footerListItem}>
              <Link href="/clients/anchor-bot" className={styles.footerLink} onClick={handleLinkClick}>
                Anchorbot Marine
              </Link>
            </li>
            <li className={styles.footerListItem}>
              <Link href="/clients/mission-robotics" className={styles.footerLink} onClick={handleLinkClick}>
                Mission Robotics
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h3 className={styles.footerTitle}>Quick Links</h3>
          <ul className={styles.footerList}>
            <li className={styles.footerListItem}>
              <Link href="/" className={styles.footerLink} onClick={handleLinkClick}>
                Home
              </Link>
            </li>
            <li className={styles.footerListItem}>
              <Link href="/about" className={styles.footerLink} onClick={handleLinkClick}>
                About Us
              </Link>
            </li>
            <li className={styles.footerListItem}>
              <Link href="/contact" className={styles.footerLink} onClick={handleLinkClick}>
                Contact
              </Link>
            </li>
            <li className={styles.footerListItem}>
              <Link href="/terms" className={styles.footerLink} onClick={handleLinkClick}>
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h3 className={styles.footerTitle}>Contact</h3>
          <ul className={styles.footerList}>
            <li className={styles.footerListItem}>
              <a 
                href="mailto:info@beringia-marine.com" 
                className={styles.footerLink}
                aria-label="Send email to info@beringia-marine.com"
              >
                info@beringia-marine.com
              </a>
            </li>
            <li className={`${styles.footerListItem} ${styles.footerContactItem}`}>
              San Luis Obispo, CA
            </li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <div className={styles.footerCredits}>
          <p className={styles.footerCopyright}>
            © {currentYear} Beringia Marine Technologies. All rights reserved.
          </p>
          <p className={styles.footerAttribution}>
            Art by{' '}
            <a 
              href="https://www.rebeccarutstein.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.footerLink}
              aria-label="Visit Rebecca Rutstein's website"
            >
              Rebecca Rutstein
            </a>
            {' '}· Website by{' '}
            <a 
              href="https://linkedin.com/in/jackmalzone" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.footerLink}
              aria-label="Visit Jack Malzone's LinkedIn profile"
            >
              Jack Malzone
            </a>
          </p>
        </div>
        <div className={styles.footerActions}>
          {!isMobile && (
            <button 
              className={styles.footerScrollTop}
              onClick={handleScrollToTop}
              aria-label="Scroll to top of page"
            >
              <span className={styles.scrollTopIcon}>↑</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Seascape Divider */}
      <div className={styles.seascapeDivider}>
        <div className={styles.seascapeWave}></div>
        <div className={styles.seascapeWave}></div>
        <div className={styles.seascapeWave}></div>
      </div>
    </footer>
  )
} 