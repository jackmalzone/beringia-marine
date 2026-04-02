import { ServiceGridBlock as ServiceGridBlockType } from '@/lib/sanity/types';
import ServiceGridBlockWrapper from './ServiceGridBlockWrapper';
import ServiceGridItem from './ServiceGridItem';
import ServiceGridHeader from './ServiceGridHeader';
import styles from './ServiceGridBlock.module.css';

interface ServiceGridBlockContentProps {
  data: ServiceGridBlockType;
}

/**
 * Server-rendered content for ServiceGridBlock
 * All text and HTML content is rendered on the server for SEO
 */
export default function ServiceGridBlockContent({ data }: ServiceGridBlockContentProps) {
  const { title, subtitle, services } = data;

  if (!services || services.length === 0) {
    return null;
  }

  // Sort services by order
  const sortedServices = [...services].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <ServiceGridBlockWrapper>
      <div className={styles.serviceGrid__container}>
        {title && <ServiceGridHeader title={title} subtitle={subtitle} />}

        <div className={styles.serviceGrid__grid}>
          {sortedServices.map((service, index) => (
            <ServiceGridItem key={service._id} service={service} index={index} />
          ))}
        </div>
      </div>
    </ServiceGridBlockWrapper>
  );
}
