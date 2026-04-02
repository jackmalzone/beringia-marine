'use client';

import { FC, ReactNode } from 'react';
import { motion } from '@/lib/motion';
import styles from './PanelZone.module.css';

interface PanelZoneProps {
  children: ReactNode;
  isVisible: boolean;
  position: 'left' | 'right' | 'stacked';
}

const PanelZone: FC<PanelZoneProps> = ({ children, isVisible, position }) => {
  return (
    <motion.div
      className={`${styles.panelZone} ${styles[`panelZone--${position}`]}`}
      initial={{
        opacity: 0,
        x: position === 'left' ? -50 : position === 'right' ? 50 : 0,
        y: position === 'stacked' ? 50 : 0,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        x: isVisible ? 0 : position === 'left' ? -50 : position === 'right' ? 50 : 0,
        y: isVisible ? 0 : position === 'stacked' ? 50 : 0,
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default PanelZone;
