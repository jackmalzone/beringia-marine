'use client';

import Link from 'next/link';
import { motion } from '@/lib/motion';
import { buildImageUrl } from '@/lib/sanity/image';
import { ServiceGridBlockType } from '@/lib/sanity/types';
import { springConfigs } from '@/lib/utils/animations';
import { SOLUTIONS } from '@/lib/content/solutions';
import styles from './ServiceGridBlock.module.css';

interface ServiceGridItemProps {
  service: ServiceGridBlockType['services'][0];
  index?: number;
}

/**
 * Client component for individual service grid item with animations
 * Content is server-rendered, this adds motion and interactivity
 */
export default function ServiceGridItem({ service, index = 0 }: ServiceGridItemProps) {
  const slug = service.slug?.current ?? '';
  const detailHref = SOLUTIONS.some((s) => s.slug === slug)
    ? `/solutions/${slug}`
    : '/solutions';

  return (
    <motion.div
      className={styles.serviceGrid__item}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ...springConfigs.gentle,
      }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Link href={detailHref} className={styles.serviceGrid__link}>
        <div className={styles.serviceGrid__imageContainer}>
          {service.heroImage && (
            <div
              className={styles.serviceGrid__image}
              style={{
                backgroundImage: `url(${buildImageUrl(service.heroImage, {
                  width: 400,
                  height: 300,
                  quality: 85,
                })})`,
              }}
            />
          )}
          <div
            className={styles.serviceGrid__overlay}
            style={{
              background: `linear-gradient(135deg, ${service.themeColor?.hex || '#0040FF'}20, ${service.themeColor?.hex || '#0040FF'}40)`,
            }}
          />
        </div>

        <div className={styles.serviceGrid__content}>
          <h3 className={styles.serviceGrid__itemTitle}>{service.title}</h3>
          {service.subtitle && (
            <p className={styles.serviceGrid__itemSubtitle}>{service.subtitle}</p>
          )}
          <div
            className={styles.serviceGrid__accent}
            style={{
              backgroundColor: service.themeColor?.hex || '#0040FF',
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
