'use client';

import { FC } from 'react';
import ServiceTemplate from '@/components/shared/ServiceTemplate/ServiceTemplate';
import { servicesData } from '@/lib/data/services';

const TraditionalSaunaPageClient: FC = () => {
  return <ServiceTemplate data={servicesData['traditional-sauna']} />;
};

export default TraditionalSaunaPageClient;
