'use client';

import { FC } from 'react';
import ServiceTemplate from '@/components/shared/ServiceTemplate/ServiceTemplate';
import { servicesData } from '@/lib/data/services';

const PercussionMassagePageClient: FC = () => {
  return <ServiceTemplate data={servicesData['percussion-massage']} />;
};

export default PercussionMassagePageClient;
