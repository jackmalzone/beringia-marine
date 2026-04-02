/**
 * Critical CSS utilities - Server-side only
 * Generates critical CSS for inlining in HTML head
 */

import fs from 'fs';
import path from 'path';

/**
 * Get critical CSS content for inlining (server-side only)
 */
export function getCriticalCSS(): string {
  try {
    const criticalCSSPath = path.join(process.cwd(), 'src/styles/critical.css');
    return fs.readFileSync(criticalCSSPath, 'utf8');
  } catch {
    // Critical CSS file not found, return empty string
    return '';
  }
}

/**
 * Minify CSS for production
 */
export function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}:;,>+~])\s*/g, '$1') // Remove whitespace around operators
    .replace(/;}/g, '}') // Remove trailing semicolons
    .trim();
}

/**
 * Generate critical CSS content for inlining (server-side only)
 */
export function getCriticalCSSContent(): string {
  const criticalCSS = getCriticalCSS();

  if (!criticalCSS) {
    return '';
  }

  return process.env.NODE_ENV === 'production' ? minifyCSS(criticalCSS) : criticalCSS;
}

/**
 * Generate critical CSS style tag for HTML head (server-side only)
 * @deprecated Use getCriticalCSSContent() with <style> tag instead
 */
export function generateCriticalCSSTag(): string {
  const content = getCriticalCSSContent();
  return content ? `<style id="critical-css">${content}</style>` : '';
}
