'use client';

import React, { FC, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from '@/lib/motion';
import { MembershipInquiryForm } from '@/components/forms/MembershipInquiryForm';
import Logo from '@/components/ui/Logo/Logo';
import { VITAL_ICE_BUSINESS } from '@/lib/config/business-info';
import { servicesData } from '@/lib/data/services';
import {
  GiSnowflake1,
  GiFire,
  GiCampfire,
  GiLightningTrio,
  GiLeg,
  GiVibratingBall,
} from 'react-icons/gi';
import {
  trackMetaPixelContact,
  trackMetaPixelInitiateCheckout,
} from '@/lib/utils/metaPixel';
import styles from './page.module.css';

const SERVICE_COLORS = {
  'cold-plunge': '#00bcd4',
  'infrared-sauna': '#ff3e36',
  'traditional-sauna': '#d45700',
  'red-light-therapy': '#e63e80',
  'compression-boots': '#8B5CF6',
  'percussion-massage': '#64b5f6',
};

const ServiceIcons = {
  'cold-plunge': GiSnowflake1,
  'infrared-sauna': GiFire,
  'traditional-sauna': GiCampfire,
  'red-light-therapy': GiLightningTrio,
  'compression-boots': GiLeg,
  'percussion-massage': GiVibratingBall,
} as const;

const serviceOrder = [
  'cold-plunge',
  'infrared-sauna',
  'traditional-sauna',
  'red-light-therapy',
  'compression-boots',
  'percussion-massage',
];

// Simple SVG icon components
const CheckIcon = () => (
  <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const LockIcon = () => (
  <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </svg>
);

const FlashIcon = () => (
  <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 2v11h3v9l7-12h-4l4-8z" />
  </svg>
);

const CardIcon = () => (
  <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
  </svg>
);

const EmailIcon = () => (
  <svg className={styles.emailIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const EquipmentIcon = () => (
  <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
  </svg>
);

const EventIcon = () => (
  <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
  </svg>
);

const DiscountIcon = () => (
  <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.79 21L3 11.21v2c0 .45.54.67.85.35l7.79-7.79c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0L3.21 13H1.21L12 2.21 22.79 13H20.8L13.5 5.71c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l7.79 7.79c.31.32.85.1.85-.35v-2L12.79 21z" />
  </svg>
);

const BookPageClient: FC = () => {
  const [showTerms, setShowTerms] = useState(true);
  const [showFAQ, setShowFAQ] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get services for display
  const services = serviceOrder
    .map(id => servicesData[id])
    .filter(
      (service): service is NonNullable<(typeof servicesData)[string]> =>
        Boolean(service) &&
        service !== undefined &&
        service !== null &&
        typeof service === 'object' &&
        'id' in service &&
        'title' in service
    );


  // Handle fade out effect on scroll and infinite scroll reset
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number | null = null;
    let isRunning = false;
    let autoScrollInterval: NodeJS.Timeout | null = null;
    let isAutoScrolling = false;
    let lastScrollLeft = container.scrollLeft;
    let userScrolling = false;

    const updateCardTransforms = () => {
      // Use data attribute to find cards since we can't easily query CSS modules
      const cards = container.querySelectorAll('[data-service-card]');
      const containerWidth = container.offsetWidth;
      const centerX = containerWidth / 2;

      cards.forEach((card: Element) => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2 - containerRect.left;
        const distanceFromCenter = cardCenterX - centerX;
        const maxDistance = containerWidth / 2;

        // Calculate opacity based on distance (fade out cards that are far from center)
        const distanceRatio = Math.abs(distanceFromCenter) / maxDistance;
        const opacity = Math.max(0.3, 1 - distanceRatio * 0.7);

        // Calculate Z translation for depth effect (cards further from center go back)
        const zTranslation = distanceRatio * -80;

        // Apply transforms - no rotation or scale, just opacity and depth
        cardElement.style.transform = `translateZ(${zTranslation}px)`;
        cardElement.style.opacity = opacity.toString();
      });
    };

    // Continuous smooth update loop using requestAnimationFrame
    const animate = () => {
      updateCardTransforms();
      if (isRunning) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Start the animation loop
    const startAnimation = () => {
      if (!isRunning) {
        isRunning = true;
        animate();
      }
    };

    // Stop the animation loop
    const stopAnimation = () => {
      isRunning = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      updateCardTransforms(); // Final update
    };

    // Auto-scroll function
    const startAutoScroll = () => {
      if (autoScrollInterval) return; // Already running
      
      isAutoScrolling = true;
      autoScrollInterval = setInterval(() => {
        if (!userScrolling && container) {
          container.scrollLeft += 0.15; // Very slow scroll speed
          
          const scrollWidth = container.scrollWidth;
          const scrollLeft = container.scrollLeft;
          const clientWidth = container.clientWidth;
          
          // Reset to beginning when reaching end
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            container.scrollLeft = scrollWidth / 2 - clientWidth;
          }
        }
      }, 16); // ~60fps
    };

    // Stop auto-scroll
    const stopAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
      isAutoScrolling = false;
    };

    // Handle infinite scroll - reset position when reaching end
    const handleScroll = () => {
      const currentScrollLeft = container.scrollLeft;
      
      // Detect if user is scrolling (manual scroll)
      if (Math.abs(currentScrollLeft - lastScrollLeft) > 1 && !isAutoScrolling) {
        userScrolling = true;
        stopAutoScroll();
      }
      
      lastScrollLeft = currentScrollLeft;
      startAnimation();
      
      const scrollWidth = container.scrollWidth;
      const scrollLeft = container.scrollLeft;
      const clientWidth = container.clientWidth;
      
      // If scrolled to the end, reset to beginning seamlessly
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        container.scrollLeft = scrollWidth / 2 - clientWidth;
      }
      // If scrolled to the beginning, reset to end seamlessly
      else if (scrollLeft <= 10) {
        container.scrollLeft = scrollWidth / 2;
      }
    };

    // Stop continuous updates and restart auto-scroll when scroll stops
    let scrollTimeout: NodeJS.Timeout;
    const handleScrollEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        stopAnimation();
        userScrolling = false;
        // Start auto-scroll after a brief pause
        setTimeout(() => {
          if (!userScrolling) {
            startAutoScroll();
          }
        }, 1000); // Wait 1 second before auto-scrolling
      }, 300);
    };

    // Set initial scroll position to middle (start of first set)
    const setInitialScroll = () => {
      if (container.scrollLeft === 0) {
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        container.scrollLeft = scrollWidth / 2 - clientWidth / 2;
      }
    };

    // Store resize handler so it can be properly removed
    const handleResize = () => {
      updateCardTransforms();
      setInitialScroll();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('scroll', handleScrollEnd, { passive: true });
    window.addEventListener('resize', handleResize);
    
    // Initial setup
    setInitialScroll();
    updateCardTransforms();
    
    // Start auto-scroll after initial delay
    const initialAutoScrollTimeout = setTimeout(() => {
      if (!userScrolling) {
        startAutoScroll();
      }
    }, 2000); // Wait 2 seconds before starting auto-scroll

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('scroll', handleScrollEnd);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
      clearTimeout(scrollTimeout);
      clearTimeout(initialAutoScrollTimeout);
    };
  }, [services]);

  // Scroll to membership form
  const scrollToMembershipForm = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      // Try multiple ways to find the element
      let formElement: HTMLElement | null = null;
      
      // Try by ID first (motion section)
      formElement = document.getElementById('membership-form');
      
      // Fallback to container ID
      if (!formElement) {
        formElement = document.getElementById('membership-form-container');
      }
      
      // Fallback to querySelector
      if (!formElement) {
        formElement = document.querySelector('[id="membership-form"]') as HTMLElement;
      }
      
      // Fallback to class selector
      if (!formElement) {
        formElement = document.querySelector('[class*="membershipFormSection"]') as HTMLElement;
      }

      if (!formElement) {
        console.warn('Membership form element not found. Available IDs:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
        return;
      }

      // Get current scroll position and form position
      const currentScroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
      const rect = formElement.getBoundingClientRect();
      const elementTop = rect.top + currentScroll;
      
      // Calculate offset for header/navigation (increased for better visibility)
      const offset = 150;
      const targetPosition = elementTop - offset;
      
      // Check if form is already in view with proper offset
      const formTopInViewport = rect.top;
      const isFormVisible = formTopInViewport >= offset && formTopInViewport <= window.innerHeight - 100;
      
      // Always scroll, even if form is close - ensures button functionality is clear
      // If form is already visible, scroll a bit more to make the action noticeable
      if (isFormVisible && formTopInViewport < offset + 50) {
        // Form is close but not perfectly positioned - scroll to ensure it's clearly visible
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth',
        });
      } else {
        // Use scrollIntoView first for better browser compatibility
        formElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
        
        // Then apply manual offset after a brief delay to ensure proper positioning
        setTimeout(() => {
          const updatedRect = formElement.getBoundingClientRect();
          const updatedScroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
          const updatedElementTop = updatedRect.top + updatedScroll;
          
          window.scrollTo({
            top: Math.max(0, updatedElementTop - offset),
            behavior: 'smooth',
          });
        }, 100);
      }
    }, 100);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Book Your Recovery Session</h1>
        <p className={styles.subtitle}>
          Experience transformative recovery through cold therapy, sauna, and wellness services.
          Secure your founding membership and join our recovery community.
        </p>
      </div>

      {/* Services Section */}
      <motion.section
        className={styles.servicesSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className={styles.servicesTitle}>Our Services</h2>
        <p className={styles.servicesDescription}>
          Discover our comprehensive suite of recovery and wellness services designed to optimize
          your performance and well-being.
        </p>
        <div className={styles.servicesScrollContainer} ref={scrollContainerRef}>
          <div className={styles.servicesScrollTrack}>
            {/* First set for seamless infinite scroll */}
            {services.map((service, index) => {
              if (!service) return null;

              const serviceColor =
                SERVICE_COLORS[service.id as keyof typeof SERVICE_COLORS] ||
                service.accentColor ||
                '#00bcd4';
              const IconComponent =
                ServiceIcons[service.id as keyof typeof ServiceIcons] || GiSnowflake1;

              return (
                <div key={`first-${service.id}`} className={styles.serviceCard} data-service-card data-index={index}>
                  <Link href={`/services/${service.id}`} className={styles.serviceCardLink}>
                    <div className={styles.serviceIcon} style={{ backgroundColor: serviceColor }}>
                      <IconComponent size={32} />
                    </div>
                    <h3 className={styles.serviceCardTitle}>{service.title}</h3>
                    <p className={styles.serviceCardSubtitle}>{service.subtitle}</p>
                  </Link>
                </div>
              );
            })}
            {/* Duplicate set for infinite scroll */}
            {services.map((service, index) => {
              if (!service) return null;

              const serviceColor =
                SERVICE_COLORS[service.id as keyof typeof SERVICE_COLORS] ||
                service.accentColor ||
                '#00bcd4';
              const IconComponent =
                ServiceIcons[service.id as keyof typeof ServiceIcons] || GiSnowflake1;

              return (
                <div key={`second-${service.id}`} className={styles.serviceCard} data-service-card data-index={index + services.length}>
                  <Link href={`/services/${service.id}`} className={styles.serviceCardLink}>
                    <div className={styles.serviceIcon} style={{ backgroundColor: serviceColor }}>
                      <IconComponent size={32} />
                    </div>
                    <h3 className={styles.serviceCardTitle}>{service.title}</h3>
                    <p className={styles.serviceCardSubtitle}>{service.subtitle}</p>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.servicesCTA}>
          <Link href="/services" className={styles.viewAllServicesLink}>
            View All Services →
          </Link>
        </div>
      </motion.section>

      <motion.div
        className={styles.foundingSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className={styles.backgroundText}>Coming Soon</div>
        <div className={styles.foundingContent}>
          <Logo className={styles.logo} width={200} height={100} />
          <h2 className={styles.foundingTitle}>Founding Memberships Available</h2>
          <p className={styles.foundingSubtitle}>
            <strong>Limited</strong> presale opportunity with exclusive benefits
          </p>

          {/* Unified Pricing Display */}
          <div className={styles.pricingDisplay}>
            <div className={styles.membershipType}>
              <h4 className={styles.typeTitle}>Unlimited Community Membership</h4>
              <div className={styles.membershipContent}>
                <div className={styles.membershipInfo}>
                  <p className={styles.typeDescription}>
                    Access to shared recovery space with cold plunge, Infrared sauna, Traditional
                    sauna, rinse shower and recovery equipment.{' '}
                    <Link href="/experience">
                      <span className={styles.inlineLink}>Learn more.</span>
                    </Link>
                  </p>
                  <p className={styles.limitedText}>
                    <strong>Limited availability</strong>
                  </p>
                </div>
                <div className={styles.priceColumn}>
                  <div className={`${styles.priceBox} ${styles.soldOut}`}>
                    <div className={styles.priceBoxInner}>
                      <div className={styles.priceBoxFront}>
                        <span className={styles.tierTitle}>Tier 1</span>
                        <div className={styles.priceContainer}>
                          <span className={styles.price}>$149/mo</span>
                          <span className={styles.originalPrice}>$210</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.soldOutOverlay}>
                      <span className={styles.soldOutText}>SOLD OUT</span>
                    </div>
                    <span className={`${styles.tierTitle} ${styles.tierTitleOverlay}`}>Tier 1</span>
                  </div>
                  <div
                    className={styles.priceBox}
                    onClick={(e) => {
                      scrollToMembershipForm(e);
                      trackMetaPixelInitiateCheckout('Community Founding Membership');
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        scrollToMembershipForm();
                        trackMetaPixelInitiateCheckout('Community Founding Membership');
                      }
                    }}
                  >
                    <div className={styles.priceBoxInner}>
                      <div className={styles.priceBoxFront}>
                        <span className={styles.tierTitle}>Tier 2</span>
                        <div className={styles.priceContainer}>
                          <span className={styles.price}>$179/mo</span>
                          <span className={styles.originalPrice}>$210</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.membershipType}>
              <h4 className={styles.typeTitle}>Unlimited Private Membership</h4>
              <div className={styles.membershipContent}>
                <div className={styles.membershipInfo}>
                  <p className={styles.typeDescription}>
                    Exclusive access to private recovery room with Cold plunge, Infrared Sauna,
                    rinse shower, and recovery equipment.{' '}
                    <Link href="/experience">
                      <span className={styles.inlineLink}>Learn more.</span>
                    </Link>
                  </p>
                  <p className={styles.limitedText}>
                    <strong>Extremely limited availability</strong>
                  </p>
                </div>
                <div className={styles.priceColumn}>
                  <div className={`${styles.priceBox} ${styles.soldOut}`}>
                    <div className={styles.priceBoxInner}>
                      <div className={styles.priceBoxFront}>
                        <span className={styles.tierTitle}>Tier 1</span>
                        <div className={styles.priceContainer}>
                          <span className={styles.price}>$189/mo</span>
                          <span className={styles.originalPrice}>$269</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.soldOutOverlay}>
                      <span className={styles.soldOutText}>SOLD OUT</span>
                    </div>
                    <span className={`${styles.tierTitle} ${styles.tierTitleOverlay}`}>Tier 1</span>
                  </div>
                  <div
                    className={styles.priceBox}
                    onClick={(e) => {
                      scrollToMembershipForm(e);
                      trackMetaPixelInitiateCheckout('Private Founding Membership');
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        scrollToMembershipForm();
                        trackMetaPixelInitiateCheckout('Private Founding Membership');
                      }
                    }}
                  >
                    <div className={styles.priceBoxInner}>
                      <div className={styles.priceBoxFront}>
                        <span className={styles.tierTitle}>Tier 2</span>
                        <div className={styles.priceContainer}>
                          <span className={styles.price}>$229/mo</span>
                          <span className={styles.originalPrice}>$269</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <motion.div
            className={styles.benefitsSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.button
              className={styles.benefitsToggle}
              onClick={() => setShowTerms(!showTerms)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Founding Member Benefits</span>
              <span className={`${styles.toggleIcon} ${showTerms ? styles.expanded : ''}`}>▼</span>
            </motion.button>

            <AnimatePresence>
              {showTerms && (
                <motion.div
                  className={styles.benefitsContent}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <div className={styles.benefitsList}>
                    <div className={styles.benefit}>
                      <CheckIcon />
                      <div>
                        <strong>Exclusive Presale Pricing</strong>
                        <p>Special discounted rates locked in at time of purchase</p>
                      </div>
                    </div>
                    <div className={styles.benefit}>
                      <LockIcon />
                      <div>
                        <strong>Lifetime Rate Lock</strong>
                        <p>
                          Your founding member rate will never increase as long as the membership
                          remains active
                        </p>
                      </div>
                    </div>
                    <div className={styles.benefit}>
                      <FlashIcon />
                      <div>
                        <strong>Early Access</strong>
                        <p>Access to the facility before official launch</p>
                      </div>
                    </div>
                    <div className={styles.benefit}>
                      <EquipmentIcon />
                      <div>
                        <strong>Complimentary Recovery Equipment</strong>
                        <p>
                          Complimentary access to the recovery equipment (compression, percussion,
                          red light masks)
                        </p>
                      </div>
                    </div>
                    <div className={styles.benefit}>
                      <EventIcon />
                      <div>
                        <strong>Exclusive Events & Workshops</strong>
                        <p>
                          Invitations to exclusive events, member-only workshops, and wellness
                          offerings
                        </p>
                      </div>
                    </div>
                    <div className={styles.benefit}>
                      <DiscountIcon />
                      <div>
                        <strong>Member Pricing</strong>
                        <p>Member pricing on merch and partner services</p>
                      </div>
                    </div>
                    <div className={styles.benefit}>
                      <CardIcon />
                      <div>
                        <strong>Flexible Payment</strong>
                        <p>Monthly autopay or annual payment options</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className={styles.faqSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className={styles.faqToggle}
              onClick={() => setShowFAQ(!showFAQ)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Frequently Asked Questions</span>
              <span className={`${styles.toggleIcon} ${showFAQ ? styles.expanded : ''}`}>▼</span>
            </motion.button>

            <AnimatePresence>
              {showFAQ && (
                <motion.div
                  className={styles.faqContent}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <div className={styles.faqList}>
                    <div className={styles.faqItem}>
                      <h4 className={styles.faqQuestion}>When do you open?</h4>
                      <p className={styles.faqAnswer}>
                        No exact date just yet, unfortunately - but sometime this winter
                      </p>
                    </div>
                    <div className={styles.faqItem}>
                      <h4 className={styles.faqQuestion}>What will the hours be?</h4>
                      <p className={styles.faqAnswer}>
                        <strong>Mon-Fri:</strong> <span className={styles.timeSlot}>6:30AM-10AM</span> |{' '}
                        <span className={styles.timeSlot}>12PM-2PM</span> |{' '}
                        <span className={styles.timeSlot}>4PM-9PM</span>
                        <br />
                        <strong>Sat:</strong> <span className={styles.timeSlot}>7AM-9PM</span>
                        <br />
                        <strong>Sun:</strong> <span className={styles.timeSlot}>8AM-7PM</span>
                        <br />
                        <em>Also displayed at the bottom of the page.</em>
                      </p>
                    </div>
                    <div className={styles.faqItem}>
                      <h4 className={styles.faqQuestion}>Do you have to book in advance?</h4>
                      <p className={styles.faqAnswer}>
                        We will accept walk-ins or advance booking. The community space should have
                        availability to walk in regularly, we will urge you to book private rooms in
                        advance. You will be able to book here on the website, on the MindBody site
                        or app, or on our own iOS app
                      </p>
                    </div>
                    <div className={styles.faqItem}>
                      <h4 className={styles.faqQuestion}>How do I secure a membership?</h4>
                      <p className={styles.faqAnswer}>
                        Just follow the mailto button, or send us an inquiry at{' '}
                        <a
                          href={`mailto:${VITAL_ICE_BUSINESS.email}`}
                          className={styles.emailLink}
                        >
                          {VITAL_ICE_BUSINESS.email}
                        </a>{' '}
                        and we will share a personal purchase link directly with you.
                      </p>
                    </div>
                    <div className={styles.faqItem}>
                      <h4 className={styles.faqQuestion}>
                        Where are the terms and conditions of the membership?
                      </h4>
                      <p className={styles.faqAnswer}>
                        Full membership terms, including founding member conditions will be clearly
                        listed at checkout. Please review carefully before your purchase.
                      </p>
                    </div>
                    <div className={styles.faqItem}>
                      <h4 className={styles.faqQuestion}>Is Vital Ice members only?</h4>
                      <p className={styles.faqAnswer}>
                        No, we will be flexible and accessible. Ask us for other presales options if
                        memberships don&apos;t work for you. We will be announcing all of our access
                        options prior to launch!
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            className={styles.ctaButton}
            onClick={(e) => {
              scrollToMembershipForm(e);
              trackMetaPixelInitiateCheckout('Founding Membership');
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Secure Your Founding Membership
          </motion.button>

          {/* Registration CTA */}
          <div className={styles.registrationCTA}>
            <p className={styles.registrationCTAText}>
              New to our studio? Register with Mindbody to create your account.
            </p>
            <Link href="/register" className={styles.registerButton}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                New Member Registration
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Membership Form Section */}
      <motion.section
        id="membership-form"
        className={styles.membershipFormSection}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div id="membership-form-container" className={styles.membershipFormContainer}>
          <h2 className={styles.membershipFormTitle}>Apply for Founding Membership</h2>
          <p className={styles.membershipFormDescription}>
            Fill out the form below to express your interest in our founding membership tiers. We&apos;ll
            be in touch soon to discuss availability and next steps.
          </p>
          <div className={styles.mailtoFallback}>
            <p className={styles.mailtoText}>
              Having trouble with the form?{' '}
              <a href="mailto:info@vitalicesf.com" className={styles.mailtoLink}>
                Email us directly at info@vitalicesf.com
              </a>
            </p>
          </div>
          <div className={styles.membershipFormWidget}>
            <MembershipInquiryForm />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default BookPageClient;
