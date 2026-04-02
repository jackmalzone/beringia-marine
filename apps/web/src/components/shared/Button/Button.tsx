'use client';

import { motion } from '@/lib/motion';
import { buttonVariants, springConfigs } from '@/lib/utils/animations';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  springConfig?: keyof typeof springConfigs;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  springConfig = 'responsive',
  fullWidth = false,
}) => {
  const buttonClass = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${fullWidth ? styles.fullWidth : ''}
    ${className}
  `.trim();

  const customVariants = {
    ...buttonVariants,
    visible: {
      ...buttonVariants.visible,
      transition: {
        ...springConfigs[springConfig],
        duration: 0.4,
      },
    },
    hover: {
      ...buttonVariants.hover,
      transition: {
        ...springConfigs.quick,
        duration: 0.2,
      },
    },
    tap: {
      ...buttonVariants.tap,
      transition: {
        ...springConfigs.quick,
        duration: 0.1,
      },
    },
  };

  return (
    <motion.button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      variants={customVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      whileTap="tap"
      viewport={{ once: true, margin: '-50px' }}
    >
      <motion.span
        className={styles.content}
        whileHover={{ scale: 1.02 }}
        transition={springConfigs.quick}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

export default Button;
