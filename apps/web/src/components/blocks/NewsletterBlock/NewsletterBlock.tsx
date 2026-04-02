import { NewsletterBlock as NewsletterBlockType } from '@/lib/sanity/types';
import NewsletterBlockContent from './NewsletterBlockContent';

interface NewsletterBlockProps {
  data: NewsletterBlockType;
}

/**
 * NewsletterBlock - Server-rendered content block
 * Content is rendered on the server for SEO, wrapped with motion animations on client
 */
export default function NewsletterBlock({ data }: NewsletterBlockProps) {
  return <NewsletterBlockContent data={data} />;
}
