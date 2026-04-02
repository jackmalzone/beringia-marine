/**
 * Vercel post-build step expects .next/lock to exist after next build.
 * With webpack build it may not be created. Ensure it exists so lstat does not fail.
 */
const fs = require('fs');
const path = require('path');

const lockPath = path.join(__dirname, '..', '.next', 'lock');
const nextDir = path.dirname(lockPath);

if (fs.existsSync(nextDir) && !fs.existsSync(lockPath)) {
  fs.writeFileSync(lockPath, '', 'utf8');
  console.log('[ensure-next-lock] Created', path.relative(process.cwd(), lockPath));
}
