import { TestimonialsBlock as TestimonialsBlockType } from '@/lib/sanity/types';
import TestimonialsBlockContent from './TestimonialsBlockContent';

interface TestimonialsBlockProps {
  data: TestimonialsBlockType;
}

/**
 * TestimonialsBlock - Server-rendered content block
 * Content is rendered on the server for SEO, wrapped with motion animations on client
 */
export default function TestimonialsBlock({ data }: TestimonialsBlockProps) {
  return <TestimonialsBlockContent data={data} />;
}
