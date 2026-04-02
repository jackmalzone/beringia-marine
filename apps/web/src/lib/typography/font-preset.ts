/** localStorage + <html data-font-preset="legacy"> for A/B font testing */

export const FONT_PRESET_STORAGE_KEY = 'beringia-font-preset';

export type FontPreset = 'modern' | 'legacy';

export function getFontPresetFromDocument(): FontPreset {
  if (typeof document === 'undefined') return 'modern';
  return document.documentElement.getAttribute('data-font-preset') === 'legacy'
    ? 'legacy'
    : 'modern';
}

export function applyFontPreset(preset: FontPreset): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (preset === 'legacy') {
    root.setAttribute('data-font-preset', 'legacy');
  } else {
    root.removeAttribute('data-font-preset');
  }
  try {
    localStorage.setItem(FONT_PRESET_STORAGE_KEY, preset);
  } catch {
    /* ignore quota / private mode */
  }
}

export function readStoredFontPreset(): FontPreset | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(FONT_PRESET_STORAGE_KEY);
    if (v === 'legacy' || v === 'modern') return v;
  } catch {
    /* ignore */
  }
  return null;
}
