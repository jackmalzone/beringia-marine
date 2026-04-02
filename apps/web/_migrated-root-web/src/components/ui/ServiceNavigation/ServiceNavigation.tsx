'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from '@/lib/motion';
import { servicesData } from '@/lib/data/services';
import { springConfigs } from '@/lib/utils/animations';
import { useNavigation } from '@/lib/store/AppStore';
import styles from './ServiceNavigation.module.css';

const serviceOrder = [
  'cold-plunge',
  'infrared-sauna',
  'traditional-sauna',
  'compression-boots',
  'percussion-massage',
  'red-light-therapy',
];

const SERVICE_COLORS = {
  'cold-plunge': '#00bcd4', // Water - Vital Ice Blue
  'infrared-sauna': '#ff3e36', // Fire/Light - Blood Orange
  'traditional-sauna': '#d45700', // Earth/Wood - Deep Umber
  'red-light-therapy': '#e63e80', // Light - Rose Gold
  'compression-boots': '#8B5CF6', // Air - Pale Silver
  'percussion-massage': '#64b5f6', // Motion - Electric Cyan
};

export default function ServiceNavigation() {
  const pathname = usePathname();
  const { isServiceSidebarOpen, setServiceSidebarOpen } = useNavigation();

  // Check if we're on overview page or individual service page
  const isOverview = pathname === '/services';
  const currentServiceId = isOverview ? null : pathname.split('/').pop();
  const currentIndex = isOverview ? -1 : serviceOrder.indexOf(currentServiceId || '');

  // Get previous and next services (only show arrows on individual service pages)
  const prevService = currentIndex > 0 ? serviceOrder[currentIndex - 1] : null;
  const nextService =
    currentIndex < serviceOrder.length - 1 && currentIndex >= 0
      ? serviceOrder[currentIndex + 1]
      : null;

  // Get service data
  const currentService = currentServiceId ? servicesData[currentServiceId] : null;
  const prevServiceData = prevService ? servicesData[prevService] : null;
  const nextServiceData = nextService ? servicesData[nextService] : null;

  // Show navigation on both overview and individual service pages
  const shouldShowNavigation = isOverview || currentService;
  if (!shouldShowNavigation) return null;

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className={styles.sidebarToggle}
        onClick={() => setServiceSidebarOpen(!isServiceSidebarOpen)}
        aria-label="Toggle service navigation"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12H21M3 6H21M3 18H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Right Arrow for Next Service */}
      {nextService && (
        <Link
          href={`/services/${nextService}`}
          className={styles.rightArrow}
          aria-label={`Next: ${nextServiceData?.title}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}

      {/* Left Arrow for Previous Service */}
      {prevService && (
        <Link
          href={`/services/${prevService}`}
          className={styles.leftArrow}
          aria-label={`Previous: ${prevServiceData?.title}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isServiceSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h3>Services</h3>
          <button
            className={styles.closeButton}
            onClick={() => setServiceSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {/* Overview Link - First Item */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              ...springConfigs.gentle,
              delay: 0,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/services"
              className={`${styles.sidebarLink} ${isOverview ? styles.active : ''}`}
              onClick={() => setServiceSidebarOpen(false)}
            >
              <div className={styles.serviceIcon} style={{ backgroundColor: '#00b7b5' }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <div className={styles.serviceInfo}>
                <span className={styles.serviceTitle}>Overview</span>
                <span className={styles.serviceSubtitle}>All services</span>
              </div>
            </Link>
          </motion.div>

          {/* Individual Service Links */}
          {serviceOrder.map((serviceId, index) => {
            const service = servicesData[serviceId];
            if (!service) return null;

            const isActive = serviceId === currentServiceId;
            const serviceColor =
              SERVICE_COLORS[serviceId as keyof typeof SERVICE_COLORS] || service.accentColor;

            return (
              <motion.div
                key={serviceId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  ...springConfigs.gentle,
                  delay: (index + 1) * 0.1,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/services/${serviceId}`}
                  className={`${styles.sidebarLink} ${isActive ? styles.active : ''}`}
                  onClick={() => setServiceSidebarOpen(false)}
                >
                  <div className={styles.serviceIcon} style={{ backgroundColor: serviceColor }}>
                    {service.title.charAt(0)}
                  </div>
                  <div className={styles.serviceInfo}>
                    <span className={styles.serviceTitle}>{service.title}</span>
                    <span className={styles.serviceSubtitle}>{service.subtitle}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Backdrop */}
      {isServiceSidebarOpen && (
        <div className={styles.backdrop} onClick={() => setServiceSidebarOpen(false)} />
      )}
    </>
  );
}
