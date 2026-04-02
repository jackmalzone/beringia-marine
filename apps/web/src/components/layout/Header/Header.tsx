'use client';
import { FC, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from '@/lib/motion';
import { springConfigs } from '@/lib/utils/animations';
import { useNavigation } from '@/lib/store/AppStore';
import { SHELL_PRIMARY_NAV, SHELL_CTA } from '@vital-ice/config';
import { SOLUTIONS } from '@/lib/content/solutions';

import styles from './Header.module.css';

const NAV_LINKS = SHELL_PRIMARY_NAV.filter((link) => link.label !== 'Solutions');

const Header: FC = () => {
  const { isMenuOpen, toggleMenu } = useNavigation();
  const pathname = usePathname();
  const router = useRouter();
  const [desktopSolutionsOpen, setDesktopSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const desktopMenuCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDesktopMenuCloseTimer = () => {
    if (desktopMenuCloseTimerRef.current != null) {
      clearTimeout(desktopMenuCloseTimerRef.current);
      desktopMenuCloseTimerRef.current = null;
    }
  };

  const openDesktopSolutionsMenu = () => {
    clearDesktopMenuCloseTimer();
    setDesktopSolutionsOpen(true);
  };

  const scheduleCloseDesktopSolutionsMenu = () => {
    clearDesktopMenuCloseTimer();
    desktopMenuCloseTimerRef.current = setTimeout(() => {
      setDesktopSolutionsOpen(false);
      desktopMenuCloseTimerRef.current = null;
    }, 220);
  };

  const closeMenu = () => {
    if (isMenuOpen) {
      toggleMenu();
    }
    setMobileSolutionsOpen(false);
  };

  return (
    <header className={styles.header}>
      <Link
        href="/"
        className={`${styles.logoLink} ${isMenuOpen ? styles.logoLinkOpen : ''}`}
        aria-label="Beringia Marine home"
      >
        <span className={styles.logoRow}>
          <Image
            src="/assets/beringia/logo-white-transparent.png"
            alt=""
            width={44}
            height={44}
            className={styles.logoMark}
            priority
          />
          <span className={styles.brandWordmark}>BERINGIA MARINE</span>
        </span>
      </Link>

      <nav className={styles.desktopNav}>
        <ul className={styles.desktopNavList}>
          {NAV_LINKS.map((link, index) => (
            <motion.li
              key={link.href}
              className={styles.desktopNavItem}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...springConfigs.gentle,
                delay: index * 0.1,
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={springConfigs.quick}
              >
                <Link
                  href={link.href}
                  className={`${styles.desktopNavLink} ${pathname === link.href ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              </motion.div>
            </motion.li>
          ))}
          <motion.li
            className={styles.desktopNavItem}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ...springConfigs.gentle,
              delay: NAV_LINKS.length * 0.1,
            }}
          >
            <div
              className={`${styles.dropdownContainer} ${desktopSolutionsOpen ? styles.dropdownOpen : ''}`}
              onMouseEnter={openDesktopSolutionsMenu}
              onMouseLeave={scheduleCloseDesktopSolutionsMenu}
              onFocusCapture={openDesktopSolutionsMenu}
              onBlurCapture={(e) => {
                const next = e.relatedTarget as Node | null;
                if (next && e.currentTarget.contains(next)) return;
                scheduleCloseDesktopSolutionsMenu();
              }}
            >
              <div className={styles.dropdownTriggerRow}>
                <Link
                  href="/solutions"
                  className={`${styles.desktopNavLink} ${pathname.startsWith('/solutions') ? styles.active : ''}`}
                  aria-haspopup="menu"
                >
                  Solutions
                </Link>
                <span className={styles.dropdownIcon} aria-hidden>
                  ▼
                </span>
              </div>
              {desktopSolutionsOpen ? (
                <div className={styles.dropdown} role="menu">
                  <ul className={styles.dropdownList}>
                    <li className={styles.dropdownItem}>
                      <Link href="/solutions" className={styles.dropdownLink} role="menuitem">
                        All Solutions
                      </Link>
                    </li>
                    {SOLUTIONS.map((solution) => (
                      <li key={solution.slug} className={styles.dropdownItem}>
                        <Link
                          href={`/solutions/${solution.slug}`}
                          className={styles.dropdownLink}
                          role="menuitem"
                        >
                          {solution.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </motion.li>
          <motion.li
            className={styles.desktopNavItem}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ...springConfigs.gentle,
              delay: (NAV_LINKS.length + 1) * 0.1,
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springConfigs.quick}>
              <Link href={SHELL_CTA.href} className={styles.desktopNavLink}>
                {SHELL_CTA.label}
              </Link>
            </motion.div>
          </motion.li>
        </ul>
      </nav>

      <button
        className={`${styles.iceCube} ${isMenuOpen ? styles.active : ''} ${isMenuOpen ? styles.iceCubeOpen : ''}`}
        aria-label="Toggle mobile menu"
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
      >
        <div className={styles.iceCubeContainer}>
          <div className={styles.iceCubeFace} />
          <div className={styles.iceCubeFace} />
          <div className={styles.iceCubeFace} />
          <div className={styles.iceCubeFace} />
          <div className={styles.iceCubeFace} />
          <div className={styles.iceCubeFace} />
        </div>
      </button>

      {isMenuOpen && (
        <div className={styles.overlayMenu} onClick={closeMenu}>
          <nav className={styles.overlayNav} onClick={e => e.stopPropagation()}>
            <ul className={styles.overlayNavList}>
              {NAV_LINKS.map((link, index) => (
                <motion.li
                  key={link.href}
                  className={styles.overlayNavItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    ...springConfigs.responsive,
                    delay: index * 0.1,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={springConfigs.quick}
                  >
                    <Link
                      href={link.href}
                      className={`${styles.overlayNavLink} ${pathname === link.href ? styles.active : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(link.href);
                        setTimeout(() => {
                          closeMenu();
                        }, 100);
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
              <motion.li
                className={styles.overlayNavItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  ...springConfigs.responsive,
                  delay: NAV_LINKS.length * 0.1,
                }}
              >
                <div className={styles.mobileDropdownContainer}>
                  <div className={styles.mobileDropdownTriggerRow}>
                    <Link
                      href="/solutions"
                      className={`${styles.mobileSolutionsLink} ${pathname.startsWith('/solutions') ? styles.active : ''}`}
                      aria-haspopup="menu"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/solutions');
                        setTimeout(() => closeMenu(), 100);
                      }}
                    >
                      Solutions
                    </Link>
                    <button
                      className={`${styles.mobileDropdownChevron} ${mobileSolutionsOpen ? styles.active : ''}`}
                      aria-expanded={mobileSolutionsOpen}
                      aria-label={mobileSolutionsOpen ? 'Close solutions menu' : 'Open solutions menu'}
                      onClick={() => setMobileSolutionsOpen((prev) => !prev)}
                      type="button"
                    >
                      <span className={styles.mobileDropdownIcon} aria-hidden>
                        ▼
                      </span>
                    </button>
                  </div>
                  {mobileSolutionsOpen && (
                    <ul className={styles.mobileDropdownList}>
                      <li className={styles.mobileDropdownItem}>
                        <Link
                          href="/solutions"
                          className={styles.mobileDropdownLink}
                          onClick={(e) => {
                            e.preventDefault();
                            router.push('/solutions');
                            setTimeout(() => closeMenu(), 100);
                          }}
                        >
                          All Solutions
                        </Link>
                      </li>
                      {SOLUTIONS.map((solution) => (
                        <li key={solution.slug} className={styles.mobileDropdownItem}>
                          <Link
                            href={`/solutions/${solution.slug}`}
                            className={styles.mobileDropdownLink}
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(`/solutions/${solution.slug}`);
                              setTimeout(() => closeMenu(), 100);
                            }}
                          >
                            {solution.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.li>
              <motion.li
                className={styles.overlayNavItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  ...springConfigs.responsive,
                  delay: (NAV_LINKS.length + 1) * 0.1,
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={springConfigs.quick}
                >
                  <Link
                    href={SHELL_CTA.href}
                    className={styles.mobileBookButton}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(SHELL_CTA.href);
                      setTimeout(() => {
                        closeMenu();
                      }, 100);
                    }}
                  >
                    {SHELL_CTA.label}
                  </Link>
                </motion.div>
              </motion.li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
