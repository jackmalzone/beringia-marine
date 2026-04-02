import { TextSectionBlock as TextSectionBlockType } from '@/lib/sanity/types';
import TextSectionBlockContent from './TextSectionBlockContent';

interface TextSectionBlockProps {
  data: TextSectionBlockType;
}

/**
 * TextSectionBlock - Server-rendered content block
 * Content is rendered on the server for SEO, wrapped with motion animations on client
 */
export default function TextSectionBlock({ data }: TextSectionBlockProps) {
  return <TextSectionBlockContent data={data} />;
}
