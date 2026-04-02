'use client';

import { motion } from '@/lib/motion';
import styles from './page.module.css';

interface Value {
  title: string;
  description: string;
  color: string;
}

export default function AboutValuesSection({
  values,
}: {
  values: readonly Value[];
}) {
  return (
    <motion.div
      className={styles.values}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className={styles.values__container}>
        <motion.h2
          className={styles.values__title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Values
        </motion.h2>
        <div className={styles.values__grid}>
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className={styles.value}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className={styles.value__accent} style={{ backgroundColor: value.color }} />
              <h3 className={styles.value__title}>{value.title}</h3>
              <p className={styles.value__description}>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
