#!/usr/bin/env node
/**
 * Production budget orchestration:
 * 1) Build app
 * 2) Start production server
 * 3) Wait for server readiness
 * 4) Run performance budget check
 * 5) Cleanly stop server
 */

import { spawn } from 'child_process';
import http from 'http';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const DEFAULT_PORT = 3000;
const READY_TIMEOUT_MS = 120000;
const READY_POLL_MS = 1500;

function spawnWithOutput(command, args, cwd) {
  return spawn(command, args, { cwd, stdio: 'inherit', env: process.env });
}

function waitForExit(proc) {
  return new Promise((resolveExit, rejectExit) => {
    proc.on('error', rejectExit);
    proc.on('exit', (code) => resolveExit(code ?? 1));
  });
}

async function runCommand(command, args, cwd) {
  const proc = spawnWithOutput(command, args, cwd);
  const code = await waitForExit(proc);
  if (code !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${code}`);
  }
}

function wait(ms) {
  return new Promise((resolveWait) => setTimeout(resolveWait, ms));
}

async function waitForServer(url, timeoutMs = READY_TIMEOUT_MS) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    // eslint-disable-next-line no-await-in-loop
    const isUp = await new Promise((resolveUp) => {
      const req = http.get(url, (res) => {
        res.resume();
        resolveUp(res.statusCode >= 200 && res.statusCode < 500);
      });
      req.on('error', () => resolveUp(false));
      req.setTimeout(3000, () => {
        req.destroy();
        resolveUp(false);
      });
    });
    if (isUp) return;
    // eslint-disable-next-line no-await-in-loop
    await wait(READY_POLL_MS);
  }
  throw new Error(`Timed out waiting for server readiness at ${url}`);
}

async function stopProcess(proc) {
  if (!proc || proc.killed) return;
  proc.kill('SIGTERM');
  const code = await Promise.race([
    waitForExit(proc),
    wait(8000).then(() => null),
  ]);
  if (code === null && !proc.killed) {
    proc.kill('SIGKILL');
  }
}

async function main() {
  const passthroughArgs = process.argv.slice(2);
  const port = DEFAULT_PORT;
  const url = `http://localhost:${port}`;
  let serverProc = null;

  try {
    console.log('Building production app...');
    await runCommand('pnpm', ['build'], ROOT);

    console.log(`Starting production app on port ${port}...`);
    serverProc = spawnWithOutput('pnpm', ['start', '--port', String(port)], ROOT);

    console.log('Waiting for server readiness...');
    await waitForServer(url);

    console.log('Running performance budget check against production server...');
    const checkArgs = ['run-budget-check.mjs', '--url', url, ...passthroughArgs];
    await runCommand('node', checkArgs, __dirname);
  } finally {
    await stopProcess(serverProc);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

