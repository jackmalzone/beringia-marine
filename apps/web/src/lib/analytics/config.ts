import type { GlobalSettings } from '@/lib/sanity/types';

export interface AnalyticsConfig {
  metaPixelId?: string;
  gtmId?: string;
  enabled: boolean;
  mode: 'prod' | 'staging' | 'dev';
  debug: boolean;
  consentRequired: boolean;
}

const warnedKeys = new Set<string>();

function warnOnce(key: string, message: string): void {
  if (warnedKeys.has(key)) return;
  warnedKeys.add(key);
  // eslint-disable-next-line no-console
  console.warn(message);
}

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

function getMode(): AnalyticsConfig['mode'] {
  if (process.env.NODE_ENV !== 'production') return 'dev';
  return process.env.VERCEL_ENV === 'preview' ? 'staging' : 'prod';
}

function normalizeId(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function validateIds(config: AnalyticsConfig): void {
  if (!config.gtmId || !/^GTM-[A-Z0-9]+$/.test(config.gtmId)) {
    warnOnce(
      'analytics-invalid-gtm-id',
      `[Analytics] Invalid GTM container ID "${config.gtmId ?? 'undefined'}". Expected format GTM-XXXXXXX.`
    );
  }

  if (!config.metaPixelId || !/^\d+$/.test(config.metaPixelId)) {
    warnOnce(
      'analytics-invalid-meta-id',
      `[Analytics] Invalid Meta Pixel ID "${config.metaPixelId ?? 'undefined'}". Expected numeric ID.`
    );
  }
}

/** Resolves GTM / Meta IDs from Sanity or env only — no hardcoded production IDs in the template. */
export function getAnalyticsConfig(globalSettings: GlobalSettings | null): AnalyticsConfig {
  const mode = getMode();
  const enabledByDefault = mode === 'prod';

  const enabled = parseBoolean(process.env.NEXT_PUBLIC_ANALYTICS_ENABLED, enabledByDefault);
  const debug = parseBoolean(process.env.NEXT_PUBLIC_ANALYTICS_DEBUG, mode !== 'prod');
  const consentRequired = parseBoolean(process.env.NEXT_PUBLIC_ANALYTICS_CONSENT_REQUIRED, false);

  const metaPixelId = normalizeId(
    globalSettings?.analyticsSettings?.facebookPixelId ?? process.env.NEXT_PUBLIC_META_PIXEL_ID
  );
  const gtmId = normalizeId(
    globalSettings?.analyticsSettings?.googleTagManagerId ?? process.env.NEXT_PUBLIC_GTM_ID
  );

  const config: AnalyticsConfig = {
    metaPixelId,
    gtmId,
    enabled,
    mode,
    debug,
    consentRequired,
  };

  if (enabled && (!config.metaPixelId || !config.gtmId)) {
    warnOnce(
      'analytics-enabled-missing-ids',
      '[Analytics] Tracking is enabled but one or more IDs are missing. Check Sanity analytics settings or environment variables.'
    );
  }

  if (enabled) {
    validateIds(config);
  }

  return config;
}
