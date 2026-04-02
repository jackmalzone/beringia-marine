'use client';

import { FC } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero/Hero';
import styles from './HomePage.module.css';

// Dynamic imports for non-critical sections to reduce initial bundle size
const MissionStatement = dynamic(
  () => import('@/components/sections/MissionStatement/MissionStatement'),
  {
    loading: () => <div className={styles.sectionLoading}>Loading...</div>,
  }
);

const Services = dynamic(() => import('@/components/sections/Benefits/Benefits'), {
  loading: () => <div className={styles.sectionLoading}>Loading services...</div>,
});

const Testimonials = dynamic(() => import('@/components/sections/Testimonials/Testimonials'), {
  loading: () => <div className={styles.sectionLoading}>Loading testimonials...</div>,
});

const NewsletterWrapper = dynamic(
  () => import('@/components/sections/Newsletter/NewsletterWrapper'),
  {
    loading: () => <div className={styles.sectionLoading}>Loading newsletter...</div>,
  }
);

const HomePage: FC = () => {
  return (
    <main className={styles.mainContainer}>
      <Hero />
      <MissionStatement />
      <Services />
      <Testimonials />
      <NewsletterWrapper />
    </main>
  );
};

export default HomePage;
