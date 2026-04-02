import { TestimonialsBlock as TestimonialsBlockType } from '@/lib/sanity/types';
import TestimonialsBlockWrapper from './TestimonialsBlockWrapper';
import TestimonialsHeader from './TestimonialsHeader';
import TestimonialItem from './TestimonialItem';
import styles from './TestimonialsBlock.module.css';

interface TestimonialsBlockContentProps {
  data: TestimonialsBlockType;
}

/**
 * Server-rendered content for TestimonialsBlock
 * All text and HTML content is rendered on the server for SEO
 */
export default function TestimonialsBlockContent({ data }: TestimonialsBlockContentProps) {
  const { title, testimonials } = data;

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <TestimonialsBlockWrapper>
      <div className={styles.testimonials__container}>
        {title && <TestimonialsHeader title={title} />}

        <div className={styles.testimonials__grid}>
          {testimonials.map((testimonial, index) => (
            <TestimonialItem key={`${testimonial.name}-${index}`} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </TestimonialsBlockWrapper>
  );
}
