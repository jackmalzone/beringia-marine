/**
 * Server-rendered About page content
 * All text content is in initial HTML for SEO
 */

import { ABOUT_VALUES, ABOUT_TEAM } from '@/lib/data/about-data';
import AboutHeroSection from './AboutHeroSection';
import AboutStorySection from './AboutStorySection';
import AboutValuesSection from './AboutValuesSection';
import AboutTeamSection from './AboutTeamSection';
import AboutMissionSection from './AboutMissionSection';
import styles from './page.module.css';

export default function AboutPageContent() {
  return (
    <main className={styles.main}>
      <AboutHeroSection />

      <div className={styles.contentContainer}>
        <AboutStorySection />

        <AboutValuesSection values={ABOUT_VALUES} />

        <AboutTeamSection team={ABOUT_TEAM} />

        <AboutMissionSection />
      </div>
    </main>
  );
}
