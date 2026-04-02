'use client';

import { motion } from '@/lib/motion';
import { buildImageUrl } from '@/lib/sanity/image';
import { TestimonialsBlockType } from '@/lib/sanity/types';
import styles from './TestimonialsBlock.module.css';

interface TestimonialItemProps {
  testimonial: TestimonialsBlockType['testimonials'][0];
  index: number;
}

/**
 * Client component for individual testimonial item with animations
 * Content is server-rendered, this adds motion
 */
export default function TestimonialItem({ testimonial, index }: TestimonialItemProps) {
  return (
    <motion.div
      className={styles.testimonials__item}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className={styles.testimonials__content}>
        <blockquote className={styles.testimonials__text}>"{testimonial.text}"</blockquote>

        <div className={styles.testimonials__author}>
          {testimonial.image && (
            <div
              className={styles.testimonials__avatar}
              style={{
                backgroundImage: `url(${buildImageUrl(testimonial.image, {
                  width: 60,
                  height: 60,
                  quality: 85,
                })})`,
              }}
            />
          )}
          <div className={styles.testimonials__authorInfo}>
            <cite className={styles.testimonials__name}>{testimonial.name}</cite>
            {testimonial.rating && (
              <div className={styles.testimonials__rating}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`${styles.testimonials__star} ${
                      i < testimonial.rating! ? styles.testimonials__starFilled : ''
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
