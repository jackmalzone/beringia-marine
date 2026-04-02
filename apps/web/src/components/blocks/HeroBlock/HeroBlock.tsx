import { HeroBlock as HeroBlockType } from '@/lib/sanity/types';
import HeroBlockContent from './HeroBlockContent';

interface HeroBlockProps {
  data: HeroBlockType;
}

/**
 * HeroBlock - Server-rendered content block
 * Content is rendered on the server for SEO, wrapped with motion animations on client
 */
export default function HeroBlock({ data }: HeroBlockProps) {
  return <HeroBlockContent data={data} />;
}
