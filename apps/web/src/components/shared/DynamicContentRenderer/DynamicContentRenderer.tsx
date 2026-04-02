import { ContentBlock } from '@/lib/sanity/types';
import styles from './DynamicContentRenderer.module.css';

// All blocks are now server-rendered components
import HeroBlock from '@/components/blocks/HeroBlock/HeroBlock';
import TextSectionBlock from '@/components/blocks/TextSectionBlock/TextSectionBlock';
import ServiceGridBlock from '@/components/blocks/ServiceGridBlock/ServiceGridBlock';
import TestimonialsBlock from '@/components/blocks/TestimonialsBlock/TestimonialsBlock';
import NewsletterBlock from '@/components/blocks/NewsletterBlock/NewsletterBlock';

interface DynamicContentRendererProps {
  content: ContentBlock[];
}

/**
 * DynamicContentRenderer - Server-rendered content renderer
 * Renders all content blocks on the server for SEO
 */
export default function DynamicContentRenderer({ content }: DynamicContentRendererProps) {
  if (!content || content.length === 0) {
    return (
      <div className={styles.noContent}>
        <p>No content blocks available.</p>
      </div>
    );
  }

  return (
    <>
      {content.map(block => {
        const key = block._key || `${block._type}-${Math.random()}`;

        switch (block._type) {
          case 'hero':
            return <HeroBlock key={key} data={block} />;

          case 'textSection':
            return <TextSectionBlock key={key} data={block} />;

          case 'serviceGrid':
            return <ServiceGridBlock key={key} data={block} />;

          case 'testimonials':
            return <TestimonialsBlock key={key} data={block} />;

          case 'newsletter':
            return <NewsletterBlock key={key} data={block} />;

          default:
            console.warn(`Unknown content block type: ${(block as any)._type}`);
            return (
              <div key={key} className={styles.unknownBlock}>
                <p>Unknown content block type: {(block as any)._type}</p>
              </div>
            );
        }
      })}
    </>
  );
}
