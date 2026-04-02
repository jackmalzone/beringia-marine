#!/usr/bin/env node

const net = require('net');

function isPortAvailable(port, host = '0.0.0.0') {
  return new Promise(resolve => {
    const server = net.createServer();

    server.listen({ port, host }, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });

    server.on('error', () => {
      resolve(false);
    });
  });
}

async function findAvailablePort(startPort = 3000, host = '0.0.0.0') {
  let port = startPort;

  while (port < startPort + 100) {
    // Check up to 100 ports
    if (await isPortAvailable(port, host)) {
      return port;
    }
    port++;
  }

  throw new Error(`No available port found between ${startPort} and ${startPort + 99}`);
}

async function main() {
  try {
    const startPortArg = process.argv[2];
    const startPort = startPortArg ? Number(startPortArg) : 3000;
    const host = process.env.HOST || '0.0.0.0';

    if (!Number.isFinite(startPort) || startPort <= 0) {
      throw new Error(`Invalid start port: ${startPortArg}`);
    }

    const port = await findAvailablePort(startPort, host);
    console.log(port);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { findAvailablePort, isPortAvailable };
