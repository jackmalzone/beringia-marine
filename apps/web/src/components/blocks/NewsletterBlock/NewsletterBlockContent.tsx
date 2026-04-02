import { NewsletterBlock as NewsletterBlockType } from '@/lib/sanity/types';
import NewsletterBlockWrapper from './NewsletterBlockWrapper';
import NewsletterForm from './NewsletterForm';
import styles from './NewsletterBlock.module.css';

interface NewsletterBlockContentProps {
  data: NewsletterBlockType;
}

/**
 * Server-rendered content for NewsletterBlock
 * All text content is rendered on the server for SEO
 */
export default function NewsletterBlockContent({ data }: NewsletterBlockContentProps) {
  const {
    title = 'Stay In The Loop',
    subtitle = 'Get updates on our opening and exclusive member benefits',
    placeholder = 'Enter your email address',
    buttonText = 'Join Waitlist',
    backgroundColor,
  } = data;

  return (
    <NewsletterBlockWrapper backgroundColor={backgroundColor}>
      <div className={styles.newsletter__container}>
        <div className={styles.newsletter__content}>
          <h2 className={styles.newsletter__title}>{title}</h2>

          {subtitle && <p className={styles.newsletter__subtitle}>{subtitle}</p>}

          <NewsletterForm placeholder={placeholder} buttonText={buttonText} />
        </div>
      </div>
    </NewsletterBlockWrapper>
  );
}
