'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  applyFontPreset,
  FONT_PRESET_STORAGE_KEY,
  getFontPresetFromDocument,
  readStoredFontPreset,
  type FontPreset,
} from '@/lib/typography/font-preset';
import styles from './FontPresetToggle.module.css';

function isToggleEnabled(): boolean {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_FONT_PRESET_TOGGLE === '1'
  );
}

export default function FontPresetToggle() {
  const [preset, setPreset] = useState<FontPreset>('modern');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isToggleEnabled()) return;
    setShow(true);
    const stored = readStoredFontPreset();
    const initial: FontPreset =
      stored === 'legacy'
        ? 'legacy'
        : stored === 'modern'
          ? 'modern'
          : getFontPresetFromDocument() === 'legacy'
            ? 'legacy'
            : 'modern';
    setPreset(initial);
    applyFontPreset(initial);
  }, []);

  const cycle = useCallback(() => {
    const next: FontPreset = preset === 'modern' ? 'legacy' : 'modern';
    setPreset(next);
    applyFontPreset(next);
  }, [preset]);

  if (!show) return null;

  return (
    <div className={styles.wrap} role="region" aria-label="Font preset preview">
      <button type="button" className={styles.button} onClick={cycle}>
        <span className={styles.label}>Fonts</span>
        <span className={styles.value}>
          {preset === 'modern' ? 'Domitian + Inter' : 'Bebas + Montserrat'}
        </span>
      </button>
      <span className={styles.hint} title={FONT_PRESET_STORAGE_KEY}>
        Tap to switch · saved locally
      </span>
    </div>
  );
}
