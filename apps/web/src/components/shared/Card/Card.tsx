'use client';

import { motion } from '@/lib/motion';
import { cardVariants, springConfigs } from '@/lib/utils/animations';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
  springConfig?: keyof typeof springConfigs;
  delay?: number;
  interactive?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  springConfig = 'responsive',
  delay = 0,
  interactive = false,
  onClick,
}) => {
  const cardClass = `
    ${styles.card}
    ${styles[variant]}
    ${interactive ? styles.interactive : ''}
    ${className}
  `.trim();

  const customVariants = {
    ...cardVariants,
    visible: {
      ...cardVariants.visible,
      transition: {
        ...springConfigs[springConfig],
        delay,
        duration: 0.5,
      },
    },
    ...(interactive && {
      hover: {
        ...cardVariants.hover,
        transition: {
          ...springConfigs.quick,
          duration: 0.3,
        },
      },
      tap: {
        ...cardVariants.tap,
        transition: {
          ...springConfigs.quick,
          duration: 0.1,
        },
      },
    }),
  };

  return (
    <motion.div
      className={cardClass}
      onClick={onClick}
      variants={customVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={interactive ? 'hover' : undefined}
      whileTap={interactive ? 'tap' : undefined}
      viewport={{ once: true, margin: '-50px' }}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          ...springConfigs.gentle,
          delay: delay + 0.1,
          duration: 0.4,
        }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Card;
