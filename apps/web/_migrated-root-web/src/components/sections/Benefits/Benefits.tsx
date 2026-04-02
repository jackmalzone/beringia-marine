'use client';

import { FC, useRef } from 'react';
import { motion, useScroll, useTransform } from '@/lib/motion';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Benefits.module.css';
// ShaderPanel replaced with CSS gradients

const Benefits: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Subtle parallax effect for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const benefits = [
    {
      title: 'COLD PLUNGE',
      tagline: 'Let the chill change you.',
      protocol: {
        temp: '40–50°F',
        time: '2–5 minutes',
        type: 'Immersion Therapy',
      },
      effect: {
        summary: '*Vagus nerve activation*, reduced *inflammation*, *mental acuity*.',
        description: 'Step in cold. Step out clear.',
        clinical: 'Clinically studied to enhance resilience and stress regulation.',
        protocolId: 'COLD-01',
      },
      image: 'https://media.vitalicesf.com/coldplunge_woman.jpg',
      alt: 'Woman experiencing cold plunge therapy for recovery and wellness at Vital Ice San Francisco',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
            fill="currentColor"
          />
          <path
            d="M6 14L7.5 18L12 16.5L16.5 18L18 14L12 15.5L6 14Z"
            fill="currentColor"
            opacity="0.7"
          />
        </svg>
      ),
      color: 'rgba(0, 183, 181, 0.8)',
    },
    {
      title: 'INFRARED SAUNA',
      tagline: 'Light that heals.',
      protocol: {
        temp: '120–150°F',
        time: '30–40 minutes',
        type: 'Full-spectrum Light Therapy',
      },
      effect: {
        summary: 'Cellular *detox*, reduced *pain*, *cardiovascular support*.',
        description: 'Release the strain. Welcome the repair.',
        clinical: 'Evidence-based approach to cellular regeneration and detoxification.',
        protocolId: 'INFR-02',
      },
      image: 'https://media.vitalicesf.com/sauna-infraredwide.jpg',
      alt: 'Infrared sauna interior with warm cedar panels for heat therapy at Vital Ice San Francisco',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.3" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <path
            d="M12 2V6M12 18V22M22 12H18M6 12H2"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.6"
          />
        </svg>
      ),
      color: 'rgba(255, 0, 0, 0.8)',
    },
    {
      title: 'TRADITIONAL SAUNA',
      tagline: 'Let the heat hold you.',
      protocol: {
        temp: '160–200°F',
        time: '10–20 minutes',
        type: 'Finnish Dry Heat Therapy',
      },
      effect: {
        summary: 'Sweat-induced *detoxification* and *mood regulation*.',
        description: 'Exhale the noise. Inhale the calm.',
        clinical: 'Centuries-old practice for cardiovascular health and stress relief.',
        protocolId: 'TRAD-03',
      },
      image: 'https://media.vitalicesf.com/sauna-traditional.jpg',
      alt: 'Traditional Finnish sauna with steam and hot stones for wellness therapy at Vital Ice San Francisco',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Heat waves emanating from center */}
          <path
            d="M12 4C8 4 4 6 4 10C4 14 8 18 12 20C16 18 20 14 20 10C20 6 16 4 12 4Z"
            fill="currentColor"
            opacity="0.2"
          />
          {/* Fire/heat wave lines */}
          <path
            d="M8 8C8 8 10 6 12 8C14 6 16 8 16 8"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <path
            d="M7 10C7 10 9 8 12 10C15 8 17 10 17 10"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M6 12C6 12 8 10 12 12C16 10 18 12 18 12"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.4"
          />
          {/* Central heat source */}
          <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.8" />
        </svg>
      ),
      color: 'rgba(255, 165, 0, 0.8)',
    },
    {
      title: 'RED LIGHT THERAPY',
      tagline: 'Rejuvenation by the power of light',
      protocol: {
        temp: 'Ambient',
        time: '10–20 minutes',
        type: 'Low-level red & near-infrared light',
      },
      effect: {
        summary: '*Collagen stimulation* and *cellular energy restoration*.',
        description: 'Red light. Radiant skin.',
        clinical: 'Photobiomodulation for tissue repair and cellular regeneration.',
        protocolId: 'RLT-04',
      },
      image: 'https://media.vitalicesf.com/sunset-redhorizon.jpg',
      alt: 'Red light therapy wavelengths for cellular regeneration and anti-aging at Vital Ice San Francisco',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
          <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.4" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <path
            d="M12 2L13 8L20 9L13 10L12 16L11 10L4 9L11 8L12 2Z"
            fill="currentColor"
            opacity="0.6"
          />
        </svg>
      ),
      color: 'rgba(255, 20, 147, 0.8)',
    },
    {
      title: 'PERCUSSION MASSAGE',
      tagline: 'Powerful pulses. Faster recovery.',
      protocol: {
        temp: 'Ambient',
        time: '15–30 minutes',
        type: 'High-frequency vibration therapy',
      },
      effect: {
        summary: '*Muscle recovery*, *tension release*, and *circulation enhancement*.',
        description: 'Break the tension with precision.',
        clinical: 'Evidence-based approach to muscle recovery and tension relief.',
        protocolId: 'PERC-05',
      },
      image: 'https://media.vitalicesf.com/percussion_bicep.jpg',
      alt: 'Percussion massage therapy device for deep tissue recovery at Vital Ice San Francisco',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vibration waves */}
          <path
            d="M4 12C4 12 6 10 8 12C10 10 12 12 12 12"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.8"
          />
          <path
            d="M12 12C12 12 14 10 16 12C18 10 20 12 20 12"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.6"
          />
          <path
            d="M4 12C4 12 6 14 8 12C10 14 12 12 12 12"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.4"
          />
          <path
            d="M12 12C12 12 14 14 16 12C18 14 20 12 20 12"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.2"
          />
          {/* Central device */}
          <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.8" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      ),
      color: 'rgba(100, 181, 246, 0.8)',
    },
    {
      title: 'COMPRESSION BOOTS',
      tagline: 'Recovery through rhythmic compression.',
      protocol: {
        temp: 'Ambient',
        time: '20–30 minutes',
        type: 'Sequential compression therapy',
      },
      effect: {
        summary: '*Lymphatic drainage*, *circulation improvement*, and *recovery acceleration*.',
        description: 'Compress. Decompress. Recover.',
        clinical: 'Sequential compression for enhanced recovery and circulation.',
        protocolId: 'COMP-06',
      },
      image: 'https://media.vitalicesf.com/cells-bloodcells.jpg',
      alt: 'Blood circulation enhancement through compression boot therapy at Vital Ice San Francisco',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Compression waves */}
          <path
            d="M6 8C6 8 8 6 12 8C16 6 18 8 18 8"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.8"
          />
          <path
            d="M6 12C6 12 8 10 12 12C16 10 18 12 18 12"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.6"
          />
          <path
            d="M6 16C6 16 8 14 12 16C16 14 18 16 18 16"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.4"
          />
          {/* Boot outline */}
          <path
            d="M8 6L8 18C8 18 10 20 12 20C14 20 16 18 16 18L16 6C16 6 14 4 12 4C10 4 8 6 8 6Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          {/* Compression chambers */}
          <rect x="9" y="8" width="6" height="2" fill="currentColor" opacity="0.3" />
          <rect x="9" y="12" width="6" height="2" fill="currentColor" opacity="0.3" />
          <rect x="9" y="16" width="6" height="2" fill="currentColor" opacity="0.3" />
        </svg>
      ),
      color: 'rgba(128, 203, 196, 0.8)',
    },
  ];

  // Service page mappings
  const servicePageMap: { [key: string]: string } = {
    'COLD PLUNGE': '/services/cold-plunge',
    'INFRARED SAUNA': '/services/infrared-sauna',
    'TRADITIONAL SAUNA': '/services/traditional-sauna',
    'RED LIGHT THERAPY': '/services/red-light-therapy',
    'PERCUSSION MASSAGE': '/services/percussion-massage',
    'COMPRESSION BOOTS': '/services/compression-boots',
  };

  // Function to render highlighted text
  const renderHighlightedText = (text: string) => {
    const parts = text.split(/(\*[^*]+\*)/);
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={index}>{part.slice(1)}</strong>;
      }
      return part;
    });
  };

  return (
    <section ref={sectionRef} id="benefits" className={styles.benefits}>
      {/* Background Image */}
      <motion.div className={styles.benefits__background} style={{ y: backgroundY }}>
        <Image
          src="https://media.vitalicesf.com/texture_blacksand.jpg"
          alt="Black volcanic sand texture background for wellness center ambiance at Vital Ice San Francisco"
          fill
          className={styles.benefits__backgroundImage}
          loading="lazy"
          sizes="100vw"
        />
        <div className={styles.benefits__backgroundOverlay} />
      </motion.div>

      {/* Ambient Background */}
      <div className={styles.benefits__ambient} />

      {/* Gradient Overlays */}
      <div className={styles.benefits__gradientTop} />
      <div className={styles.benefits__gradientBottom} />

      {/* Floating Elements */}
      <div className={styles.benefits__floatingElements}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={styles.benefits__floatingElement}
            style={
              {
                '--delay': `${i * 0.3}s`,
                '--duration': `${4 + i * 0.5}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Benefits Content */}
      <div className={styles.benefits__container}>
        {benefits.map((benefit, index) => {
          const isImageLeft = index % 2 === 0;

          return (
            <motion.div
              key={benefit.title}
              className={styles.benefit}
              data-service={benefit.title.toLowerCase().replace(/\s+/g, '-')}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              {/* Image Side */}
              <motion.div
                className={`${styles.benefit__image} ${isImageLeft ? styles.left : styles.right}`}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05 + 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <div className={styles.benefit__imageContainer}>
                  <Image
                    src={benefit.image}
                    alt={benefit.alt}
                    fill
                    className={styles.benefit__imageElement}
                    priority={index < 2}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className={styles.benefit__imageOverlay} />

                  {/* Image Accent Glow */}
                  <div className={styles.benefit__imageGlow} />
                </div>
              </motion.div>

              {/* Text Side */}
              <motion.div
                className={`${styles.benefit__text} ${isImageLeft ? styles.right : styles.left}`}
                initial={{ opacity: 0, x: isImageLeft ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05 + 0.15,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <div className={styles.benefit__textContent}>
                  <motion.div
                    className={styles.benefit__titleContainer}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05 + 0.2,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <h2 className={styles.benefit__title}>{benefit.title}</h2>
                    {/* Icon as superscript */}
                    <motion.div
                      className={styles.benefit__icon}
                      style={{ color: benefit.color }}
                      initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05 + 0.25,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      {benefit.icon}
                    </motion.div>
                  </motion.div>

                  <motion.p
                    className={styles.benefit__tagline}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05 + 0.3,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    {benefit.tagline}
                  </motion.p>

                  {/* Protocol Section with CSS gradient */}
                  <motion.div
                    className={styles.benefit__protocol}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05 + 0.35,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <div className={styles.benefit__shaderOverlay}>
                      {/* CSS gradient replaces ShaderPanel */}
                    </div>
                    <div className={styles.benefit__protocolContent}>
                      <h3 className={styles.benefit__protocolTitle}>PROTOCOL</h3>
                      <div className={styles.benefit__protocolSpecs}>
                        <div className={styles.benefit__protocolItem}>
                          <span className={styles.benefit__protocolLabel}>Temp:</span>
                          <span className={styles.benefit__protocolValue}>
                            {benefit.protocol.temp}
                          </span>
                        </div>
                        <div className={styles.benefit__protocolItem}>
                          <span className={styles.benefit__protocolLabel}>Time:</span>
                          <span className={styles.benefit__protocolValue}>
                            {benefit.protocol.time}
                          </span>
                        </div>
                        <div className={styles.benefit__protocolItem}>
                          <span className={styles.benefit__protocolLabel}>Type:</span>
                          <span className={styles.benefit__protocolValue}>
                            {benefit.protocol.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Effect Section with CSS gradient */}
                  <motion.div
                    className={styles.benefit__effect}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05 + 0.4,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <div className={styles.benefit__shaderOverlay}>
                      {/* CSS gradient replaces ShaderPanel */}
                    </div>
                    <div className={styles.benefit__effectContent}>
                      <h3 className={styles.benefit__effectTitle}>EFFECT</h3>
                      <p className={styles.benefit__effectSummary}>
                        {renderHighlightedText(benefit.effect.summary)}
                      </p>
                      <p className={styles.benefit__effectDescription}>
                        &ldquo;{benefit.effect.description}&rdquo;
                      </p>
                      <Link
                        href={servicePageMap[benefit.title]}
                        className={styles.benefit__learnMore}
                      >
                        Learn More
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Benefits;
