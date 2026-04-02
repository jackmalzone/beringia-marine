#!/usr/bin/env node

/**
 * Script to configure CORS for Cloudflare R2 bucket
 * Run with: node scripts/setup-r2-cors.js
 */

const { execSync } = require('child_process');

const CORS_CONFIG = {
  rules: [
    {
      AllowedOrigins: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://vital-ice.vercel.app',
        'https://vital-ice.com',
        'https://www.vital-ice.com',
        'https://vitalicesf.com',
        'https://www.vitalicesf.com',
      ],
      AllowedMethods: ['GET', 'HEAD'],
      AllowedHeaders: ['*'],
      MaxAgeSeconds: 3600,
    },
  ],
};

async function setupCORS() {
  try {
    console.log('🚀 Setting up CORS for R2 bucket...');

    // Check if wrangler is installed
    try {
      execSync('wrangler --version', { stdio: 'pipe' });
    } catch (error) {
      console.error('❌ Wrangler CLI not found. Please install it first:');
      console.error('npm install -g wrangler');
      console.error('Then run: wrangler login');
      process.exit(1);
    }

    // Create temporary CORS config file
    const fs = require('fs');
    const corsFile = 'temp-cors.json';
    fs.writeFileSync(corsFile, JSON.stringify(CORS_CONFIG, null, 2));

    // Apply CORS configuration
    console.log('📝 Applying CORS configuration...');
    execSync(`wrangler r2 bucket cors set vital-ice-videos --file ${corsFile}`, {
      stdio: 'inherit',
    });

    // Clean up
    fs.unlinkSync(corsFile);

    console.log('✅ CORS configuration applied successfully!');
    console.log('🌐 Your videos should now work in browsers.');
  } catch (error) {
    console.error('❌ Error setting up CORS:', error.message);
    process.exit(1);
  }
}

setupCORS();
