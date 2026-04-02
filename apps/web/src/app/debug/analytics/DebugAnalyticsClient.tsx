'use client';

import { useEffect, useState } from 'react';
import { getAuditEvents, type AuditEvent } from '@/lib/analytics/audit';
import type { AnalyticsConfig } from '@/lib/analytics/config';

interface RuntimeSnapshot {
  hasFbq: boolean;
  hasDataLayer: boolean;
  dataLayerLength: number;
}

export default function DebugAnalyticsClient() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [runtime, setRuntime] = useState<RuntimeSnapshot>({
    hasFbq: false,
    hasDataLayer: false,
    dataLayerLength: 0,
  });
  const [config, setConfig] = useState<AnalyticsConfig | null>(null);

  useEffect(() => {
    const refresh = () => {
      setEvents(getAuditEvents());
      setRuntime({
        hasFbq: typeof window.fbq === 'function',
        hasDataLayer: Array.isArray(window.dataLayer),
        dataLayerLength: Array.isArray(window.dataLayer) ? window.dataLayer.length : 0,
      });
      const runtimeConfig = (window as Window & { __analyticsConfig?: AnalyticsConfig }).__analyticsConfig;
      setConfig(runtimeConfig ?? null);
    };

    refresh();
    const intervalId = window.setInterval(refresh, 500);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <h1>Analytics Debug</h1>
      <p>Non-production runtime snapshot for analytics wiring.</p>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>Effective Config</h2>
        <pre style={{ background: '#101010', color: '#f5f5f5', padding: '1rem', overflowX: 'auto' }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      </section>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>Runtime</h2>
        <pre style={{ background: '#101010', color: '#f5f5f5', padding: '1rem', overflowX: 'auto' }}>
          {JSON.stringify(runtime, null, 2)}
        </pre>
      </section>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>Recent Events (Last 50)</h2>
        <pre style={{ background: '#101010', color: '#f5f5f5', padding: '1rem', overflowX: 'auto' }}>
          {JSON.stringify(events, null, 2)}
        </pre>
      </section>
    </main>
  );
}
