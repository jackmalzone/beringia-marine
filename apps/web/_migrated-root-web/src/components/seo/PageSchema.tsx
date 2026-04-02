'use client';

import { FC } from 'react';
import { getPageSchema } from '@/lib/seo/structured-data';
import StructuredData from './StructuredData';

interface PageSchemaProps {
  pageKey: string;
}

const PageSchema: FC<PageSchemaProps> = ({ pageKey }) => {
  const schemaData = getPageSchema(pageKey);

  return <StructuredData data={schemaData} />;
};

export default PageSchema;
