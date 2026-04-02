#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const { findAvailablePort } = require('./find-port');

function getArgValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function unlinkIfExists(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch {
    // ignore
  }
}

function probeUrl(url, timeoutMs = 350) {
  return new Promise(resolve => {
    const req = http.get(url, res => {
      const poweredBy = String(res.headers['x-powered-by'] || '');
      if (poweredBy.toLowerCase().includes('next')) {
        res.resume();
        resolve(true);
        return;
      }

      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => {
        body += chunk;
        if (body.includes('__NEXT_DATA__')) {
          resolve(true);
          req.destroy();
        }
      });
      res.on('end', () => resolve(body.includes('__NEXT_DATA__')));
    });

    req.on('error', () => resolve(false));
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function detectRunningNextDev(startPort, maxPortsToCheck = 20) {
  for (let port = startPort; port < startPort + maxPortsToCheck; port += 1) {
    // Probe localhost, regardless of dev hostname binding.
    // If a server is running, it should respond on localhost.
    // (This is a heuristic, but good enough to avoid the lock crash-loop.)
    const ok = await probeUrl(`http://127.0.0.1:${port}`);
    if (ok) return port;
  }
  return null;
}

async function main() {
  const cwd = process.cwd();
  const hostname = getArgValue('--hostname') || '0.0.0.0';
  const startPortRaw = getArgValue('--startPort') || process.env.PORT || '3000';
  const startPort = Number(startPortRaw);
  const turbo = hasFlag('--turbo');
  const isDebug = hasFlag('--debug');

  if (!Number.isFinite(startPort) || startPort <= 0) {
    console.error(`[next-dev] invalid startPort: ${startPortRaw}`);
    process.exit(1);
  }

  let nextCliPath;
  try {
    nextCliPath = require.resolve('next/dist/bin/next', { paths: [cwd] });
  } catch {
    console.error(
      `[next-dev] Could not resolve Next.js from ${cwd}. Run this from an app directory that depends on next (e.g. apps/web).`
    );
    process.exit(1);
  }

  const lockFilePath = path.join(cwd, '.next', 'dev', 'lock');

  // If a lock exists, it usually means a dev server is already running for this app.
  // Next cannot run two `next dev` instances against the same `.next` dir.
  if (fileExists(lockFilePath)) {
    const runningPort = await detectRunningNextDev(startPort);
    if (runningPort) {
      console.log(
        `[next-dev] Next dev already running. Visit http://localhost:${runningPort}`
      );
      process.exit(0);
    }

    // No server detected → likely stale lock (e.g. crash). Clear it.
    if (isDebug) console.log('[next-dev] clearing stale lock', lockFilePath);
    unlinkIfExists(lockFilePath);
  }

  const port = await findAvailablePort(startPort, hostname);
  if (isDebug) console.log('[next-dev] using port', port);

  const args = ['dev'];
  if (turbo) args.push('--turbo');
  args.push('--port', String(port), '--hostname', hostname);

  const child = spawn(process.execPath, [nextCliPath, ...args], {
    stdio: 'inherit',
    cwd,
    env: { ...process.env, PORT: String(port) },
  });

  child.on('error', err => {
    console.error('[next-dev] failed to start next dev', err);
    process.exit(1);
  });

  child.on('exit', async code => {
    // If we failed due to lock, surface a helpful message instead of a hard error.
    if (code === 1 && fileExists(lockFilePath)) {
      const runningPort = await detectRunningNextDev(startPort);
      if (runningPort) {
        console.log(
          `[next-dev] Next dev already running. Visit http://localhost:${runningPort}`
        );
        process.exit(0);
      }
    }

    process.exit(code ?? 1);
  });
}

main().catch(err => {
  console.error('[next-dev] failed', err);
  process.exit(1);
});

