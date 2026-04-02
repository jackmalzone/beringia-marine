'use client';

import { FC } from 'react';
import { motion } from '@/lib/motion';
import Link from 'next/link';
import {
  GiSnowflake1,
  GiFire,
  GiCampfire,
  GiLightningTrio,
  GiLeg,
  GiVibratingBall,
} from 'react-icons/gi';
import PageSchema from '@/components/seo/PageSchema';
import ServiceNavigation from '@/components/ui/ServiceNavigation/ServiceNavigation';
import { servicesData } from '@/lib/data/services';
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
  'compression-boots',
  'percussion-massage',
  'red-light-therapy',
];

const ServicesPageClient: FC = () => {
  // Safely get services data
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

  if (!services || services.length === 0) {
    return (
      <main className={styles.main}>
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h1 style={{ color: '#d3f3ff', marginBottom: '1rem' }}>Services</h1>
          <p style={{ color: '#94a9b8' }}>Unable to load services. Please refresh the page.</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <PageSchema pageKey="services" />
      <ServiceNavigation />
      <main className={styles.main}>
        {/* Hero Section */}
        <motion.section
          className={styles.hero}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className={styles.hero__background}>
            <div className={styles.hero__overlay} />
          </div>
          <div className={styles.hero__content}>
            <motion.h1
              className={styles.hero__title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Our Services
            </motion.h1>
            <motion.p
              className={styles.hero__subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Experience the full spectrum of recovery and wellness through our comprehensive suite
              of services.
            </motion.p>
          </div>
        </motion.section>

        {/* Services Grid */}
        <section className={styles.services}>
          <div className={styles.services__container}>
            <div className={styles.services__grid}>
              {services.map((service, index) => {
                if (!service) return null;

                const serviceColor =
                  SERVICE_COLORS[service.id as keyof typeof SERVICE_COLORS] ||
                  service.accentColor ||
                  '#00bcd4';
                const IconComponent =
                  ServiceIcons[service.id as keyof typeof ServiceIcons] || GiSnowflake1;
                const briefDescription = service.description
                  ? service.description.split('.')[0] + '.'
                  : service.subtitle || '';

                return (
                  <motion.div
                    key={service.id}
                    className={styles.serviceCard}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    style={
                      {
                        '--accent-color': serviceColor,
                      } as React.CSSProperties
                    }
                  >
                    <Link href={`/services/${service.id}`} className={styles.serviceCard__link}>
                      <div className={styles.serviceCard__image}>
                        <div
                          className={styles.serviceCard__imageBg}
                          style={{ backgroundImage: `url(${service.backgroundImage})` }}
                        />
                        <div className={styles.serviceCard__overlay} />
                        <div className={styles.serviceCard__icon}>
                          <IconComponent size={32} />
                        </div>
                      </div>
                      <div className={styles.serviceCard__content}>
                        <h3 className={styles.serviceCard__title}>{service.title}</h3>
                        <p className={styles.serviceCard__tagline}>{service.tagline}</p>
                        <p className={styles.serviceCard__subtitle}>{service.subtitle}</p>
                        <p className={styles.serviceCard__description}>{briefDescription}</p>
                        <div className={styles.serviceCard__accent} />
                        <span className={styles.serviceCard__cta}>
                          Learn More <span className={styles.serviceCard__arrow}>→</span>
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          className={styles.cta}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className={styles.cta__container}>
            <h2 className={styles.cta__title}>Ready to Begin Your Recovery Journey?</h2>
            <p className={styles.cta__text}>
              Book your first session and experience the transformative power of our wellness
              services.
            </p>
            <Link href="/book" className={styles.cta__button}>
              Book Now
            </Link>
          </div>
        </motion.section>
      </main>
    </>
  );
};

export default ServicesPageClient;
