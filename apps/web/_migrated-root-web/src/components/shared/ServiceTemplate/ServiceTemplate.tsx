'use client';

import { FC, useEffect } from 'react';
import { motion, useScroll, useTransform } from '@/lib/motion';
import ServiceNavigation from '@/components/ui/ServiceNavigation/ServiceNavigation';
import { trackMetaPixelViewContent, trackMetaPixelInitiateCheckout } from '@/lib/utils/metaPixel';
import styles from './ServiceTemplate.module.css';

interface ServiceData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  heroImage: string;
  textureImage?: string;
  accentColor: string;
  tagline: string;
  benefits: Array<{
    title: string;
    description: string;
  }>;
  process: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  ctaTitle: string;
  ctaText: string;
}

interface ServiceTemplateProps {
  data: ServiceData;
}

const ServiceTemplate: FC<ServiceTemplateProps> = ({ data }) => {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Track ViewContent event when service page loads
  useEffect(() => {
    trackMetaPixelViewContent(data.title, data.id);
  }, [data.title, data.id]);

  return (
    <main className={styles.main}>
      <ServiceNavigation />
      {/* Hero Section with Enhanced Visuals */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div className={styles.hero__background} style={{ y: backgroundY }}>
          <div
            className={styles.hero__image}
            style={{ backgroundImage: `url(${data.heroImage})` }}
          />
          <div className={styles.hero__overlay} />
          {data.textureImage && (
            <div
              className={styles.hero__texture}
              style={{ backgroundImage: `url(${data.textureImage})` }}
            />
          )}
        </motion.div>
        <div className={styles.hero__content}>
          <motion.h1
            className={styles.hero__title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {data.title}
          </motion.h1>
          <motion.p
            className={styles.hero__subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {data.subtitle}
          </motion.p>
        </div>
      </motion.section>

      {/* Introduction Section with Visual Elements */}
      <motion.section
        className={styles.intro}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className={styles.intro__container}>
          <motion.div
            className={styles.intro__content}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className={styles.intro__visual}>
              <div
                className={styles.intro__image}
                style={{ backgroundImage: `url(${data.backgroundImage})` }}
              />
              <div className={styles.intro__accent} style={{ backgroundColor: data.accentColor }} />
            </div>
            <p className={styles.intro__text}>{data.description}</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Scientific Breakdown Section - Diagnostic Console Style */}
      <motion.section
        className={styles.science}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className={styles.science__container}>
          <motion.h2
            className={styles.science__title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Scientifically Supported Benefits
          </motion.h2>
          <div className={styles.science__grid}>
            {data.benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className={styles.science__item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2, scale: 1.01 }}
              >
                <h3 className={styles.science__itemTitle}>{benefit.title}</h3>
                <p className={styles.science__itemDescription}>{benefit.description}</p>
                <div
                  className={styles.science__accent}
                  style={{ backgroundColor: data.accentColor }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Callout Quote Section with Visual Enhancement */}
      <motion.section
        className={styles.callout}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className={styles.callout__container}>
          <div className={styles.callout__background}>
            <div
              className={styles.callout__image}
              style={{ backgroundImage: `url(${data.textureImage || data.backgroundImage})` }}
            />
            <div className={styles.callout__overlay} />
          </div>
          <motion.div
            className={styles.callout__content}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <blockquote className={styles.callout__quote}>&ldquo;{data.tagline}&rdquo;</blockquote>
            <div className={styles.callout__accent} style={{ backgroundColor: data.accentColor }} />
          </motion.div>
        </div>
      </motion.section>

      {/* Process Section with Visual Timeline */}
      <motion.section
        className={styles.process}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className={styles.process__container}>
          <motion.h2
            className={styles.process__title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Your Experience
          </motion.h2>
          <div className={styles.process__steps}>
            {data.process.map((step, index) => (
              <motion.div
                key={step.step}
                className={styles.process__step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className={styles.process__stepNumber}>
                  {step.step}
                  <div
                    className={styles.process__stepAccent}
                    style={{ backgroundColor: data.accentColor }}
                  />
                </div>
                <div className={styles.process__stepContent}>
                  <h3 className={styles.process__stepTitle}>{step.title}</h3>
                  <p className={styles.process__stepDescription}>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section with Enhanced Visuals */}
      <motion.section
        className={styles.cta}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className={styles.cta__container}>
          <div className={styles.cta__content}>
            <h2 className={styles.cta__title}>{data.ctaTitle}</h2>
            <p className={styles.cta__text}>{data.ctaText}</p>
            <motion.button
              className={styles.cta__button}
              style={{ backgroundColor: data.accentColor }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Track InitiateCheckout event
                trackMetaPixelInitiateCheckout(data.title);
                window.location.href = '/book';
              }}
            >
              Book Now
            </motion.button>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default ServiceTemplate;
