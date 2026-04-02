import { TextSectionBlock as TextSectionBlockType } from '@/lib/sanity/types';
import TextSectionBlockWrapper from './TextSectionBlockWrapper';
import styles from './TextSectionBlock.module.css';

interface TextSectionBlockContentProps {
  data: TextSectionBlockType;
}

/**
 * Server-rendered content for TextSectionBlock
 * All text and HTML content is rendered on the server for SEO
 */
export default function TextSectionBlockContent({ data }: TextSectionBlockContentProps) {
  const { title, content, alignment = 'center', backgroundColor } = data;

  const alignmentClass =
    {
      left: styles.textSection__contentLeft,
      center: styles.textSection__contentCenter,
      right: styles.textSection__contentRight,
    }[alignment] || styles.textSection__contentCenter;

  return (
    <TextSectionBlockWrapper backgroundColor={backgroundColor}>
      <div className={styles.textSection__container}>
        <div className={`${styles.textSection__content} ${alignmentClass}`}>
          {title && <h2 className={styles.textSection__title}>{title}</h2>}

          {content && (
            <div
              className={styles.textSection__text}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </TextSectionBlockWrapper>
  );
}
