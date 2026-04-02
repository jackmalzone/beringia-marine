import { notFound } from 'next/navigation';
import DebugAnalyticsClient from './DebugAnalyticsClient';

export default function DebugAnalyticsPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <DebugAnalyticsClient />;
}
