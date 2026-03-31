'use client';

import { FC } from 'react';
import Link from 'next/link';
import { motion } from '@/lib/motion';
import { FaLinkedin, FaPhone } from 'react-icons/fa';
import { springConfigs } from '@/lib/utils/animations';
import { TEMPLATE_BUSINESS, BusinessInfoHelpers, SHELL_FOOTER, SHELL_CREDITS } from '@vital-ice/config';
import { SOLUTIONS } from '@/lib/content/solutions';
import styles from './Footer.module.css';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const cityRegion = `${TEMPLATE_BUSINESS.address.city}, ${TEMPLATE_BUSINESS.address.state}`;
  const mapsQuery = `${TEMPLATE_BUSINESS.address.city}, ${TEMPLATE_BUSINESS.address.state} ${TEMPLATE_BUSINESS.address.country}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
  const linkedin = TEMPLATE_BUSINESS.socialMedia.linkedin?.trim();

  return (
    <footer
      className={styles.footer}
      style={{
        background: 'transparent',
        backgroundImage: 'none',
        border: '0',
        boxShadow: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
      }}
    >
      <div className={styles.footer__container}>
        <div className={styles.footer__content}>
          <motion.div
            className={styles.footer__brand}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className={styles.footer__logo}>BERINGIA MARINE</Link>
            <p className={styles.footer__tagline}>{TEMPLATE_BUSINESS.tagline}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <h3 className={styles.footer__sectionTitle}>{SHELL_FOOTER.aboutTitle}</h3>
            <p className={styles.footer__aboutBody}>{SHELL_FOOTER.aboutBody}</p>
            <Link href={SHELL_FOOTER.aboutLink.href} className={styles.footer__link}>
              {SHELL_FOOTER.aboutLink.label}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className={styles.footer__sectionTitle}>Solutions</h3>
            <ul className={styles.footer__linkList}>
              {[...SHELL_FOOTER.solutionsLinks, ...SOLUTIONS.map((solution) => ({
                label: solution.name,
                href: `/solutions/${solution.slug}`,
              }))].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.footer__link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <h3 className={styles.footer__sectionTitle}>Quick Links</h3>
            <ul className={styles.footer__linkList}>
              {SHELL_FOOTER.quickLinks.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.footer__link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className={styles.footer__contact}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className={styles.footer__sectionTitle}>Contact</h3>
            <div className={styles.footer__contactInfo}>
              {TEMPLATE_BUSINESS.phone && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springConfigs.quick}
                  className={styles.footer__contactItem}
                >
                  <FaPhone className={styles.footer__contactIcon} />
                  <a href={`tel:${TEMPLATE_BUSINESS.phone.replace(/\s/g, '')}`} className={styles.footer__link}>
                    {BusinessInfoHelpers.getFormattedPhone()}
                  </a>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springConfigs.quick}
              >
                <a href={`mailto:${TEMPLATE_BUSINESS.email}`} className={styles.footer__link}>
                  {TEMPLATE_BUSINESS.email}
                </a>
              </motion.div>

              <div className={styles.footer__addressContainer}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springConfigs.quick}>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.footer__address}
                    aria-label={`Open ${cityRegion} in Google Maps`}
                  >
                    <address>
                      {cityRegion}
                    </address>
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className={styles.footer__social}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          <h3 className={styles.footer__sectionTitle}>Stay Connected</h3>
          {linkedin ? (
            <div className={styles.footer__socialLinks}>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footer__socialLink}
                aria-label="Beringia Marine on LinkedIn"
              >
                <FaLinkedin size={22} />
              </a>
            </div>
          ) : (
            <p className={styles.footer__tagline}>Social links can be set via NEXT_PUBLIC_LINKEDIN_URL.</p>
          )}
        </motion.div>

        <motion.div
          className={styles.footer__bottom}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className={styles.footer__divider} />

          <motion.div
            className={styles.footer__credits}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className={styles.footer__creditsText}>
              Art by{' '}
              <a
                href={SHELL_CREDITS.featuredArtist.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footer__creditLink}
              >
                {SHELL_CREDITS.featuredArtist.name}
              </a>
              {' · '}Website by{' '}
              <a
                href={SHELL_CREDITS.websiteBy.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footer__creditLink}
              >
                {SHELL_CREDITS.websiteBy.name}
              </a>
            </p>
            <div className={styles.footer__developerLinks}>
              <motion.a
                href={SHELL_CREDITS.websiteBy.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footer__developerLink}
                aria-label={`${SHELL_CREDITS.websiteBy.name} on LinkedIn`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={springConfigs.quick}
              >
                <FaLinkedin size={20} />
              </motion.a>
            </div>
          </motion.div>

          <div className={styles.footer__divider} />

          <div className={styles.footer__copyright}>
            <p>{SHELL_FOOTER.copyrightTemplate.replace('{year}', String(currentYear))}</p>
            <div className={styles.footer__legal}>
              {SHELL_FOOTER.legalLinks.map((link, i) => (
                <span key={link.href} className={styles.footer__legalItem}>
                  {i > 0 ? <span className={styles.footer__separator}>•</span> : null}
                  <Link href={link.href} className={styles.footer__legalLink}>
                    {link.label}
                  </Link>
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
