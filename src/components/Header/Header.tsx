'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import styles from './Header.module.css'

interface HeaderProps {
  isLoading?: boolean
}

export default function Header({ isLoading }: HeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [showSolutions, setShowSolutions] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const solutionsRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout>()

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    
    setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Track scroll for header visibility and scrolled state
  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateHeader = () => {
      const currentScrollY = window.scrollY
      
      // Update scrolled state
      setIsScrolled(currentScrollY > 50)
      
      // Update header visibility (hide on scroll down, show on scroll up)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false)
      } else {
        setIsHeaderVisible(true)
      }
      
      lastScrollY = currentScrollY
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Handle clicks outside solutions menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setShowSolutions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  // Handle body overflow for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const shouldShowMobileMenu = windowWidth <= 1024

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setShowSolutions(false)
  }

  const handleSolutionsMouseEnter = () => {
    if (!shouldShowMobileMenu) {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
      setShowSolutions(true)
    }
  }

  const handleSolutionsMouseLeave = () => {
    if (!shouldShowMobileMenu) {
      closeTimeoutRef.current = setTimeout(() => {
        setShowSolutions(false)
      }, 300)
    }
  }

  const handleSolutionsClick = (e: React.MouseEvent) => {
    if (shouldShowMobileMenu) {
      e.stopPropagation()
      setShowSolutions(!showSolutions)
    }
  }

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
    setShowSolutions(false)
  }

  const headerClasses = [
    styles.header,
    isScrolled ? styles.headerScrolled : '',
    !isHeaderVisible ? styles.headerHidden : '',
  ].filter(Boolean).join(' ')

  if (isLoading) {
    return (
      <header className={headerClasses}>
        <div className={styles.headerLoading}>Loading...</div>
      </header>
    )
  }

  return (
    <header className={headerClasses}>
      <div className={styles.headerLeft}>
        <Link href="/" className={styles.headerLogo} aria-label="Home" onClick={handleNavClick}>
          <Image 
            src="/assets/beringia/logo-white-transparent.png"
            alt="Beringia Marine Logo"
            width={150}
            height={40}
            className={styles.headerLogoImage}
            priority
          />
        </Link>
        <h1 className={styles.headerTitle}>
          Beringia Marine
        </h1>
      </div>

      {shouldShowMobileMenu ? (
        <button 
          className={styles.headerMobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={styles.menuIcon}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </span>
        </button>
      ) : (
        <>
          <nav className={styles.headerNav}>
            <div className={styles.headerNavContent}>
              <Link 
                href="/" 
                className={`${styles.headerNavLink} ${pathname === '/' ? styles.headerNavLinkCurrent : ''}`}
                onClick={handleNavClick}
              >
                Home
              </Link>
              
              <div 
                ref={solutionsRef}
                className={`${styles.headerNavDropdown} ${showSolutions ? styles.headerNavDropdownExpanded : ''}`}
                onClick={handleSolutionsClick}
                onMouseEnter={handleSolutionsMouseEnter}
                onMouseLeave={handleSolutionsMouseLeave}
              >
                <button 
                  className={`${styles.headerNavLink} ${styles.headerNavLinkSolutions}`}
                  aria-expanded={showSolutions}
                  aria-haspopup="true"
                >
                  Solutions
                  <span className={styles.dropdownArrow}>▼</span>
                </button>
                <div className={styles.headerSolutionsMenu} role="menu">
                  <Link
                    href="/clients/mission-robotics"
                    className={styles.headerSolutionsLink}
                    onClick={handleNavClick}
                    role="menuitem"
                  >
                    Mission Robotics
                  </Link>
                  <Link
                    href="/clients/anchor-bot"
                    className={styles.headerSolutionsLink}
                    onClick={handleNavClick}
                    role="menuitem"
                  >
                    Anchor Bot
                  </Link>
                  <Link
                    href="/clients/advanced-navigation"
                    className={styles.headerSolutionsLink}
                    onClick={handleNavClick}
                    role="menuitem"
                  >
                    Advanced Navigation
                  </Link>
                </div>
              </div>

              <Link 
                href="/about" 
                className={`${styles.headerNavLink} ${pathname === '/about' ? styles.headerNavLinkCurrent : ''}`}
                onClick={handleNavClick}
              >
                About
              </Link>

              <Link 
                href="/contact" 
                className={`${styles.headerNavLink} ${pathname === '/contact' ? styles.headerNavLinkCurrent : ''}`}
                onClick={handleNavClick}
              >
                Contact
              </Link>

              <Link 
                href="/terms" 
                className={`${styles.headerNavLink} ${pathname === '/terms' ? styles.headerNavLinkCurrent : ''}`}
                onClick={handleNavClick}
              >
                Terms
              </Link>
            </div>
          </nav>
          <div className={styles.headerEnd}>
            <Link href="/contact" className={styles.headerContactButton} onClick={handleNavClick}>
              Get in Touch
            </Link>
          </div>
        </>
      )}
      
      {shouldShowMobileMenu && (
        <>
          <div 
            className={`${styles.headerNavOverlay} ${isMobileMenuOpen ? styles.headerNavOverlayVisible : ''}`} 
            onClick={toggleMobileMenu}
            aria-hidden="true"
          />
          <nav className={`${styles.headerNav} ${isMobileMenuOpen ? styles.headerNavExpanded : ''}`}>
            <div className={styles.headerNavContent}>
              <Link 
                href="/" 
                className={`${styles.headerNavLink} ${pathname === '/' ? styles.headerNavLinkCurrent : ''}`}
                onClick={handleNavClick}
              >
                Home
              </Link>
              
              <div 
                ref={solutionsRef}
                className={`${styles.headerNavDropdown} ${showSolutions ? styles.headerNavDropdownExpanded : ''}`}
                onClick={handleSolutionsClick}
                onMouseEnter={handleSolutionsMouseEnter}
                onMouseLeave={handleSolutionsMouseLeave}
              >
                <button 
                  className={`${styles.headerNavLink} ${styles.headerNavLinkSolutions}`}
                  aria-expanded={showSolutions}
                  aria-haspopup="true"
                >
                  Solutions
                  <span className={styles.dropdownArrow}>▼</span>
                </button>
                <div className={styles.headerSolutionsMenu} role="menu">
                  <Link
                    href="/clients/mission-robotics"
                    className={styles.headerSolutionsLink}
                    onClick={handleNavClick}
                    role="menuitem"
                  >
                    Mission Robotics
                  </Link>
                  <Link
                    href="/clients/anchor-bot"
                    className={styles.headerSolutionsLink}
                    onClick={handleNavClick}
                    role="menuitem"
                  >
                    Anchor Bot
                  </Link>
                  <Link
                    href="/clients/advanced-navigation"
                    className={styles.headerSolutionsLink}
                    onClick={handleNavClick}
                    role="menuitem"
                  >
                    Advanced Navigation
                  </Link>
                </div>
              </div>

              <Link 
                href="/about" 
                className={`${styles.headerNavLink} ${pathname === '/about' ? styles.headerNavLinkCurrent : ''}`}
                onClick={handleNavClick}
              >
                About
              </Link>

              <Link 
                href="/contact" 
                className={`${styles.headerNavLink} ${pathname === '/contact' ? styles.headerNavLinkCurrent : ''}`}
                onClick={handleNavClick}
              >
                Contact
              </Link>

              <Link 
                href="/terms" 
                className={`${styles.headerNavLink} ${pathname === '/terms' ? styles.headerNavLinkCurrent : ''}`}
                onClick={handleNavClick}
              >
                Terms
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  )
} 