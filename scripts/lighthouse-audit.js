#!/usr/bin/env node

/**
 * Lighthouse Performance Audit Script
 * Runs Lighthouse audits on insights pages and validates performance scores
 *
 * Usage:
 *   node scripts/lighthouse-audit.js
 *   node scripts/lighthouse-audit.js --url=http://localhost:3000/insights
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Configuration
const PERFORMANCE_THRESHOLD = 90;
const ACCESSIBILITY_THRESHOLD = 90;
const BEST_PRACTICES_THRESHOLD = 90;
const SEO_THRESHOLD = 90;

const PAGES_TO_TEST = [
  {
    name: 'Insights Listing',
    url: '/insights',
  },
  {
    name: 'Sample Article',
    url: '/insights/science-behind-cold-plunge-therapy',
  },
];

// Network throttling profiles
const NETWORK_PROFILES = {
  'Slow 3G': {
    rttMs: 300,
    throughputKbps: 400,
    cpuSlowdownMultiplier: 4,
  },
  'Fast 3G': {
    rttMs: 150,
    throughputKbps: 1600,
    cpuSlowdownMultiplier: 4,
  },
  '4G': {
    rttMs: 40,
    throughputKbps: 10000,
    cpuSlowdownMultiplier: 1,
  },
};

/**
 * Run Lighthouse audit
 */
async function runLighthouse(url, options = {}) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const opts = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    ...options,
  };

  try {
    const runnerResult = await lighthouse(url, opts);
    await chrome.kill();
    return runnerResult;
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

/**
 * Extract key metrics from Lighthouse results
 */
function extractMetrics(lhr) {
  const { categories, audits } = lhr;

  return {
    scores: {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100),
    },
    metrics: {
      fcp: audits['first-contentful-paint'].numericValue,
      lcp: audits['largest-contentful-paint'].numericValue,
      tti: audits['interactive'].numericValue,
      tbt: audits['total-blocking-time'].numericValue,
      cls: audits['cumulative-layout-shift'].numericValue,
      speedIndex: audits['speed-index'].numericValue,
    },
    diagnostics: {
      mainThreadWork: audits['mainthread-work-breakdown'].numericValue,
      bootupTime: audits['bootup-time'].numericValue,
      unusedJavaScript: audits['unused-javascript']?.details?.overallSavingsBytes || 0,
      unusedCSS: audits['unused-css-rules']?.details?.overallSavingsBytes || 0,
      imageOptimization: audits['uses-optimized-images']?.details?.overallSavingsBytes || 0,
      textCompression: audits['uses-text-compression']?.details?.overallSavingsBytes || 0,
    },
  };
}

/**
 * Format metrics for display
 */
function formatMetrics(metrics) {
  return {
    'First Contentful Paint': `${(metrics.fcp / 1000).toFixed(2)}s`,
    'Largest Contentful Paint': `${(metrics.lcp / 1000).toFixed(2)}s`,
    'Time to Interactive': `${(metrics.tti / 1000).toFixed(2)}s`,
    'Total Blocking Time': `${metrics.tbt.toFixed(0)}ms`,
    'Cumulative Layout Shift': metrics.cls.toFixed(3),
    'Speed Index': `${(metrics.speedIndex / 1000).toFixed(2)}s`,
  };
}

/**
 * Check if scores meet thresholds
 */
function checkThresholds(scores) {
  const failures = [];

  if (scores.performance < PERFORMANCE_THRESHOLD) {
    failures.push(
      `Performance score ${scores.performance} is below threshold ${PERFORMANCE_THRESHOLD}`
    );
  }
  if (scores.accessibility < ACCESSIBILITY_THRESHOLD) {
    failures.push(
      `Accessibility score ${scores.accessibility} is below threshold ${ACCESSIBILITY_THRESHOLD}`
    );
  }
  if (scores.bestPractices < BEST_PRACTICES_THRESHOLD) {
    failures.push(
      `Best Practices score ${scores.bestPractices} is below threshold ${BEST_PRACTICES_THRESHOLD}`
    );
  }
  if (scores.seo < SEO_THRESHOLD) {
    failures.push(`SEO score ${scores.seo} is below threshold ${SEO_THRESHOLD}`);
  }

  return failures;
}

/**
 * Main audit function
 */
async function runAudit() {
  const baseUrl =
    process.argv.find(arg => arg.startsWith('--url='))?.split('=')[1] || 'http://localhost:3000';
  const networkProfile =
    process.argv.find(arg => arg.startsWith('--network='))?.split('=')[1] || '4G';

  console.log('\n🔍 Starting Lighthouse Performance Audit\n');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Network Profile: ${networkProfile}\n`);

  const results = [];
  let allPassed = true;

  for (const page of PAGES_TO_TEST) {
    const url = `${baseUrl}${page.url}`;
    console.log(`\n📊 Auditing: ${page.name}`);
    console.log(`URL: ${url}\n`);

    try {
      const runnerResult = await runLighthouse(url, {
        throttling: NETWORK_PROFILES[networkProfile],
      });

      const metrics = extractMetrics(runnerResult.lhr);
      const failures = checkThresholds(metrics.scores);

      // Display scores
      console.log('Scores:');
      console.log(`  Performance:     ${metrics.scores.performance}/100`);
      console.log(`  Accessibility:   ${metrics.scores.accessibility}/100`);
      console.log(`  Best Practices:  ${metrics.scores.bestPractices}/100`);
      console.log(`  SEO:             ${metrics.scores.seo}/100`);

      // Display metrics
      console.log('\nCore Web Vitals:');
      const formattedMetrics = formatMetrics(metrics.metrics);
      Object.entries(formattedMetrics).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });

      // Display diagnostics
      console.log('\nDiagnostics:');
      console.log(`  Main Thread Work: ${(metrics.diagnostics.mainThreadWork / 1000).toFixed(2)}s`);
      console.log(`  Bootup Time: ${(metrics.diagnostics.bootupTime / 1000).toFixed(2)}s`);
      console.log(
        `  Unused JavaScript: ${(metrics.diagnostics.unusedJavaScript / 1024).toFixed(0)}KB`
      );
      console.log(`  Unused CSS: ${(metrics.diagnostics.unusedCSS / 1024).toFixed(0)}KB`);
      console.log(
        `  Image Optimization Savings: ${(metrics.diagnostics.imageOptimization / 1024).toFixed(0)}KB`
      );

      // Check failures
      if (failures.length > 0) {
        console.log('\n❌ Failed Thresholds:');
        failures.forEach(failure => console.log(`  - ${failure}`));
        allPassed = false;
      } else {
        console.log('\n✅ All thresholds passed!');
      }

      results.push({
        page: page.name,
        url,
        ...metrics,
        failures,
      });
    } catch (error) {
      console.error(`\n❌ Error auditing ${page.name}:`, error.message);
      allPassed = false;
    }
  }

  // Save results to file
  const reportPath = path.join(
    __dirname,
    '..',
    'docs',
    'reports',
    'lighthouse-insights-report.json'
  );
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        baseUrl,
        networkProfile,
        results,
      },
      null,
      2
    )
  );

  console.log(`\n📄 Full report saved to: ${reportPath}`);

  // Exit with appropriate code
  if (allPassed) {
    console.log('\n✅ All audits passed!\n');
    process.exit(0);
  } else {
    console.log('\n❌ Some audits failed. See details above.\n');
    process.exit(1);
  }
}

// Run audit
runAudit().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
