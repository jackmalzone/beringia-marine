import { ServiceGridBlock as ServiceGridBlockType } from '@/lib/sanity/types';
import ServiceGridBlockContent from './ServiceGridBlockContent';

interface ServiceGridBlockProps {
  data: ServiceGridBlockType;
}

/**
 * ServiceGridBlock - Server-rendered content block
 * Content is rendered on the server for SEO, wrapped with motion animations on client
 */
export default function ServiceGridBlock({ data }: ServiceGridBlockProps) {
  return <ServiceGridBlockContent data={data} />;
}
