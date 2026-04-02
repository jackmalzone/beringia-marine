'use client';

import { FC } from 'react';
import ServiceTemplate from '@/components/shared/ServiceTemplate/ServiceTemplate';
import PageSchema from '@/components/seo/PageSchema';
import { servicesData } from '@/lib/data/services';

const ColdPlungePageClient: FC = () => {
  return (
    <>
      <PageSchema pageKey="cold-plunge" />
      <ServiceTemplate data={servicesData['cold-plunge']} />
    </>
  );
};

export default ColdPlungePageClient;
