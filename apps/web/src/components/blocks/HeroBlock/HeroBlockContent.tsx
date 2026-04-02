import { HeroBlock as HeroBlockType } from '@/lib/sanity/types';
import HeroBlockWrapper from './HeroBlockWrapper';
import HeroTextContent from './HeroTextContent';
import HeroCTA from './HeroCTA';
import styles from './HeroBlock.module.css';

interface HeroBlockContentProps {
  data: HeroBlockType;
}

/**
 * Server-rendered content for HeroBlock
 * All text content is rendered on the server for SEO
 */
export default function HeroBlockContent({ data }: HeroBlockContentProps) {
  const { headline, subheadline, ctaButton } = data;

  return (
    <HeroBlockWrapper data={data}>
      <div className={styles.hero__content}>
        <div className={styles.hero__textContainer}>
          <HeroTextContent headline={headline} subheadline={subheadline} />
          {ctaButton && <HeroCTA ctaButton={ctaButton} />}
        </div>
      </div>
    </HeroBlockWrapper>
  );
}
