'use client';

import { FC } from 'react';
import ServiceTemplate from '@/components/shared/ServiceTemplate/ServiceTemplate';
import { servicesData } from '@/lib/data/services';

const InfraredSaunaPageClient: FC = () => {
  return <ServiceTemplate data={servicesData['infrared-sauna']} />;
};

export default InfraredSaunaPageClient;
