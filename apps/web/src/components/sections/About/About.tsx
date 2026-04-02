'use client';

import { FC } from 'react';
import { motion } from '@/lib/motion';
import Image from 'next/image';
import { templateRaster } from '@/lib/config/template-assets';
import styles from './About.module.css';

const About: FC = () => {
  return (
    <section id="about" className={styles.about}>
      {/* Background Image */}
      <div className={styles.about__background}>
        <Image
          src={templateRaster(90)}
          alt="Calm abstract background representing premium service philosophy"
          fill
          className={styles.about__backgroundImage}
          loading="lazy"
          sizes="100vw"
        />
        <div className={styles.about__overlay} />
      </div>

      {/* Gradient Overlays */}
      <div className={styles.about__gradientTop} />
      <div className={styles.about__gradientBottom} />

      {/* Mist Effect */}
      <div className={styles.about__mist} />

      {/* Noise Overlay */}
      <div className={styles.about__noise} />

      {/* Content Container */}
      <div className={styles.about__container}>
        <motion.div
          className={styles.about__content}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h2
            className={styles.about__title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            OUR STORY
          </motion.h2>

          <motion.div
            className={styles.about__text}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.p
              className={styles.about__tagline}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Behind the name, we&apos;re three operators who wanted a studio that felt as polished
              as a flagship—without losing neighborhood warmth.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              We looked for a place that combined clear standards, thoughtful hospitality, and room
              for both focus and connection. When the market felt either too casual or too clinical,
              we sketched Premium Service Business: a template-friendly model for premium services with
              transparent pacing and a calm environment.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              What began as a working session among friends became a full build-out. We care about
              the details clients never have to think about—sound, lighting, wayfinding, and the
              language your team uses when things get busy.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              We built this for professionals who schedule carefully, neighbors who want consistency,
              and anyone who appreciates a quiet moment of competence in a loud world. Whether you
              are booking your first visit or your fiftieth, we are glad you are here.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              Excellence is not a single gesture—it is a habit we rehearse together.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              — The Editorial Team
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Hint */}
      <motion.div
        className={styles.about__scrollHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <motion.div
          className={styles.about__scrollIndicator}
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </section>
  );
};

export default About;
