/**
 * Canonical template identity and URL utilities.
 * This is the single source of truth for site/business defaults.
 *
 * Beringia production defaults are embedded as fallbacks when env vars are unset.
 * TODO(assets): Add production OG image, favicon set, and brand logo under public/ when assets land
 * (see migration/beringia/assets/ASSET_INVENTORY.md — template repo currently lacks final binaries).
 */

const DEFAULT_DEV_ORIGIN = 'http://localhost:3000';

/** Production site URL from staged metadata (NEXT_PUBLIC_SITE_URL overrides). */
const DEFAULT_PRODUCTION_SITE_URL = 'https://beringia-marine.com';

const DEFAULT_SITE_NAME = 'Beringia Marine';
const DEFAULT_SITE_DESCRIPTION =
  'Connecting innovative marine technology manufacturers with end users across research, defense, and ocean exploration sectors. Specializing in autonomous underwater vehicles, marine robotics, and underwater systems.';

const DEFAULT_SEO_TITLE =
  'Beringia Marine | Integrated Marine Technology Solutions';

const DEFAULT_OG_DESCRIPTION =
  'Bridging innovative marine technology manufacturers with end users across research, defense, and ocean exploration sectors.';

const DEFAULT_KEYWORDS =
  'marine technology, autonomous underwater vehicles, ocean exploration, marine robotics, underwater systems, marine research, defense technology, ocean monitoring';

const DEFAULT_GOOGLE_SITE_VERIFICATION_FALLBACK =
  'IOZN0I7imcnTotMPkXe2Nk4oDcBJb_ahImDGEQQMCcM';

function normalizeUrl(raw: string): string {
  return raw.trim().replace(/\/$/, '');
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim().length > 0) return normalizeUrl(envUrl);
  if (process.env.NODE_ENV === 'production') {
    return normalizeUrl(DEFAULT_PRODUCTION_SITE_URL);
  }
  return DEFAULT_DEV_ORIGIN;
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === '/') return base;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

export const SITE_CONFIG = {
  get name(): string {
    return process.env.NEXT_PUBLIC_SITE_NAME?.trim() || DEFAULT_SITE_NAME;
  },
  get legalName(): string {
    return process.env.NEXT_PUBLIC_LEGAL_NAME?.trim() || 'Beringia Marine Technologies';
  },
  get description(): string {
    return process.env.NEXT_PUBLIC_SITE_DESCRIPTION?.trim() || DEFAULT_SITE_DESCRIPTION;
  },
  /** Default `<title>` / OG title when pages do not override */
  get defaultSeoTitle(): string {
    return process.env.NEXT_PUBLIC_SEO_DEFAULT_TITLE?.trim() || DEFAULT_SEO_TITLE;
  },
  /** Open Graph / Twitter fallback description (can differ slightly from meta description) */
  get openGraphFallbackDescription(): string {
    return process.env.NEXT_PUBLIC_OG_FALLBACK_DESCRIPTION?.trim() || DEFAULT_OG_DESCRIPTION;
  },
  get url(): string {
    return getSiteUrl();
  },
  get contactEmail(): string {
    return process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || 'info@beringia-marine.com';
  },
  get contactPhone(): string {
    return process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || '+18053161417';
  },
  get contactTextPhone(): string {
    return process.env.NEXT_PUBLIC_CONTACT_TEXT_PHONE?.trim() || SITE_CONFIG.contactPhone;
  },
  /**
   * Default social share image under public/. Template ships without final Beringia OG art;
   * keep a safe local fallback until NEXT_PUBLIC_DEFAULT_OG_IMAGE_PATH is set.
   * TODO(assets): Replace with production OG image path when asset is added to public/.
   */
  get defaultOgImagePath(): string {
    return process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE_PATH?.trim() || '/globe.svg';
  },
  /**
   * TODO(assets): Replace with Beringia logo under public/ when available (see ASSET_INVENTORY).
   */
  get logoPath(): string {
    return process.env.NEXT_PUBLIC_LOGO_PATH?.trim() || '/logo-emblem-bw.svg';
  },
  get themeColor(): string {
    return process.env.NEXT_PUBLIC_THEME_COLOR?.trim() || '#052533';
  },
  get seoKeywords(): string {
    return process.env.NEXT_PUBLIC_SEO_KEYWORDS?.trim() || DEFAULT_KEYWORDS;
  },
  get social(): {
    instagram: string;
    facebook: string;
    linkedin: string;
  } {
    return {
      instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || '',
      facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() || '',
      linkedin:
        process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() ||
        'https://linkedin.com/company/beringia-marine',
    };
  },
} as const;

export function getTwitterCreator(): string | undefined {
  const handle = process.env.NEXT_PUBLIC_TWITTER_SITE?.trim();
  if (!handle) return undefined;
  return handle.startsWith('@') ? handle : `@${handle}`;
}

export interface SiteVerificationPayload {
  google?: string;
  yandex?: string;
  yahoo?: string;
}

/**
 * Verification values prefer env; Google falls back to staged Search Console token when unset.
 */
export function getSiteVerificationPayload(): SiteVerificationPayload | undefined {
  const google =
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || DEFAULT_GOOGLE_SITE_VERIFICATION_FALLBACK;
  const yandex = process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION?.trim();
  const yahoo = process.env.NEXT_PUBLIC_YAHOO_SITE_VERIFICATION?.trim();
  if (!google && !yandex && !yahoo) return undefined;
  return {
    ...(google ? { google } : {}),
    ...(yandex ? { yandex } : {}),
    ...(yahoo ? { yahoo } : {}),
  };
}
