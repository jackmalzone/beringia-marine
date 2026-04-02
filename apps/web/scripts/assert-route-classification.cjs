/**
 * Asserts that audited dynamic routes show as ƒ (Dynamic) in Next.js build output.
 * Run after build: pnpm --filter @vital-ice/web ssr:build-check
 * Or run build+check: pnpm --filter @vital-ice/web build && pnpm --filter @vital-ice/web ssr:build-check
 */

const path = require('path');
const { spawnSync } = require('child_process');

const APP_ROOT = path.join(__dirname, '..');
const requiredDynamicRoutes = ['/services/[slug]', '/insights/[slug]', '/[slug]'];
const dynamicMarker = 'ƒ';

const result = spawnSync('pnpm', ['run', 'build'], {
  cwd: APP_ROOT,
  encoding: 'utf-8',
  maxBuffer: 20 * 1024 * 1024,
  env: { ...process.env, CI: process.env.CI || '' },
});
const output = (result.stdout || '') + (result.stderr || '');

if (result.status !== 0) {
  console.error('Build failed; cannot assert route classification.');
  process.exit(result.status);
}

// Parse "Route (app)" section: lines between "Route (app)" and next blank or "○" legend
const routeSectionStart = output.indexOf('Route (app)');
if (routeSectionStart === -1) {
  console.error('FAIL: Could not find "Route (app)" in build output.');
  process.exit(1);
}

const afterRoute = output.slice(routeSectionStart);
const lines = afterRoute.split(/\r?\n/);
const routeLines = [];
for (const line of lines) {
  if (routeLines.length > 0 && /^[○ƒ●├└┌]/.test(line) === false && line.trim() !== '') {
    const legend = line.match(/^[○ƒ]\s+\(Static\)|^ƒ\s+\(Dynamic\)/);
    if (legend) break;
  }
  if (/├|└|┌/.test(line) || line.startsWith('ƒ') || line.startsWith('○') || line.startsWith('●')) {
    routeLines.push(line);
  }
}

let failed = 0;
for (const route of requiredDynamicRoutes) {
  const line = routeLines.find((l) => l.includes(route));
  if (!line) {
    console.error(`FAIL: Route ${route} not found in build output.`);
    failed++;
    continue;
  }
  if (!line.includes(dynamicMarker)) {
    console.error(`FAIL: ${route} must be ƒ (Dynamic). Build output: ${line.trim()}`);
    failed++;
  }
}

if (failed > 0) {
  process.exit(1);
}
console.log('Route classification: all audited routes are ƒ (Dynamic).');
