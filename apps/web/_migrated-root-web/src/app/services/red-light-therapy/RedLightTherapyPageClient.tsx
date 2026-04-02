'use client';

import { FC } from 'react';
import ServiceTemplate from '@/components/shared/ServiceTemplate/ServiceTemplate';
import { servicesData } from '@/lib/data/services';

const RedLightTherapyPageClient: FC = () => {
  return <ServiceTemplate data={servicesData['red-light-therapy']} />;
};

export default RedLightTherapyPageClient;
