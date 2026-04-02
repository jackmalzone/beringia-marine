'use client';

import { FC } from 'react';
import Script from 'next/script';
import { generateStructuredData } from '@/lib/seo/structured-data';

interface StructuredDataProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  type?: 'application/ld+json' | 'application/json';
}

const StructuredData: FC<StructuredDataProps> = ({ data, type = 'application/ld+json' }) => {
  const jsonLd = generateStructuredData(data);

  return <Script id="structured-data" type={type} dangerouslySetInnerHTML={{ __html: jsonLd }} />;
};

export default StructuredData;
