#!/usr/bin/env node
/**
 * Performance budget check: runs Lighthouse against a URL, extracts budget-relevant
 * metrics, compares to config/performance-budgets.json, writes JSON + Markdown summary.
 * Only flags budget violations and warnings (no full Lighthouse issue list).
 *
 * Usage: node run-budget-check.mjs [--url URL] [--budgets PATH] [--mode mobile|desktop]
 */

import { readFile, mkdir, writeFile } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const DEFAULT_BUDGETS_PATH = join(ROOT, 'config', 'performance-budgets.json');
const OUTPUT_DIR = join(__dirname, 'output');

// --- CLI ---------------------------------------------------------------------
const DEFAULTS = {
  url: 'http://localhost:3000',
  budgets: DEFAULT_BUDGETS_PATH,
  mode: 'mobile',
};

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node run-budget-check.mjs [options]

Options:
  --url URL         Target URL (default: ${DEFAULTS.url})
  --budgets PATH    Path to performance-budgets.json (default: config/performance-budgets.json)
  --mode MODE       mobile | desktop (default: mobile)
  --help, -h        Show this help
`);
    process.exit(0);
  }
  const opts = { ...DEFAULTS };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) opts.url = args[++i];
    else if (args[i] === '--budgets' && args[i + 1]) opts.budgets = args[++i];
    else if (args[i] === '--mode' && args[i + 1]) opts.mode = args[++i];
  }
  return opts;
}

// --- Budget loading ----------------------------------------------------------
async function loadBudgets(path) {
  const raw = await readFile(path, 'utf-8');
  const data = JSON.parse(raw);
  // Strip documentation/reason keys for programmatic use if desired; we use them for output.
  return data;
}

// --- Lighthouse run ---------------------------------------------------------
async function runLighthouse(url, mode) {
  const lighthouse = (await import('lighthouse')).default;
  const { launch: launchChrome } = await import('chrome-launcher');

  const chrome = await launchChrome({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  try {
    const flags = {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance'],
    };
    const config = {
      extends: 'lighthouse:default',
      settings: {
        formFactor: mode,
        screenEmulation: mode === 'mobile'
          ? { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false }
          : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
        throttling: mode === 'mobile'
          ? { rttMs: 150, throughputKbps: 1638.4, requestLatencyMs: 0, downloadThroughputKbps: 1474.56, uploadThroughputKbps: 675, cpuSlowdownMultiplier: 4 }
          : { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
      },
    };

    const runnerResult = await lighthouse(url, flags, config);
    const lhr = runnerResult.lhr;
    if (!lhr?.audits) {
      throw new Error('Lighthouse LHR missing audits; cannot evaluate budgets.');
    }
    return { lhr, artifacts: runnerResult.artifacts };
  } finally {
    await chrome.kill();
  }
}

// --- Extract metrics from LHR (explicit, version-safe) -----------------------
function getAudit(lhr, id) {
  return lhr?.audits?.[id] ?? null;
}

function getNumeric(audit) {
  if (!audit) return null;
  if (typeof audit.numericValue === 'number') return audit.numericValue;
  return null;
}

function getAuditNumeric(lhr, ids) {
  for (const id of ids) {
    const val = getNumeric(getAudit(lhr, id));
    if (val !== null) return val;
  }
  return null;
}

function getAuditNumericWithSource(lhr, ids) {
  for (const id of ids) {
    const val = getNumeric(getAudit(lhr, id));
    if (val !== null) return { value: val, auditId: id };
  }
  return { value: null, auditId: null };
}

function getResourceSummaryItems(lhr) {
  const audit = getAudit(lhr, 'resource-summary');
  const items = audit?.details?.items;
  return Array.isArray(items) ? items : [];
}

// resource-summary items may use resourceType or label (version-dependent)
function matchesResourceType(item, type) {
  const rt = (item?.resourceType ?? '').toLowerCase();
  const label = (item?.label ?? '').toLowerCase();
  if (type === 'script') return rt === 'script' || label.includes('script');
  if (type === 'stylesheet') return rt === 'stylesheet' || label.includes('stylesheet') || label.includes('css');
  if (type === 'font') return rt === 'font' || label.includes('font');
  return false;
}

function sumTransferByType(items, resourceType) {
  return items
    .filter((it) => matchesResourceType(it, resourceType))
    .reduce((acc, it) => acc + (it?.transferSize ?? it?.resourceSize ?? 0), 0);
}

function getNetworkRequests(lhr) {
  const audit = getAudit(lhr, 'network-requests');
  const items = audit?.details?.items;
  return Array.isArray(items) ? items : [];
}

function getFontLikeRequests(networkItems) {
  return networkItems.filter((it) => {
    const url = (it?.url ?? it?.link ?? '').toLowerCase();
    const mime = (it?.mimeType ?? '').toLowerCase();
    return (
      mime.includes('font') ||
      url.endsWith('.woff') ||
      url.endsWith('.woff2') ||
      url.endsWith('.ttf') ||
      url.endsWith('.otf')
    );
  });
}

function countFontRequests(networkItems) {
  const fontLike = getFontLikeRequests(networkItems);
  return new Set(fontLike.map((it) => it?.url ?? it?.link ?? '')).size;
}

function getThirdPartySummary(lhr) {
  const audit = getAudit(lhr, 'third-party-summary');
  const items = audit?.details?.items;
  return Array.isArray(items) ? items : [];
}

function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function isThirdParty(hostname, originHostname) {
  return (
    hostname &&
    hostname !== originHostname &&
    !originHostname.endsWith(hostname) &&
    !hostname.endsWith(`.${originHostname}`)
  );
}

function getLargestContentfulPaintElement(lhr) {
  const audit = getAudit(lhr, 'largest-contentful-paint-element');
  const items = audit?.details?.items;
  if (!Array.isArray(items) || items.length === 0) return null;
  const item = items[0];
  const node = item?.node ?? {};
  return {
    selector: node.selector ?? null,
    nodeLabel: node.nodeLabel ?? null,
    snippet: node.snippet ?? null,
  };
}

function getTopLongTasks(lhr, limit = 5) {
  const audit = getAudit(lhr, 'long-tasks');
  const items = audit?.details?.items;
  if (!Array.isArray(items)) return [];

  return items
    .map((it) => ({
      url: it?.url ?? null,
      durationMs:
        typeof it?.duration === 'number'
          ? Math.round(it.duration)
          : typeof it?.blockingDuration === 'number'
            ? Math.round(it.blockingDuration)
            : null,
      startTimeMs: typeof it?.startTime === 'number' ? Math.round(it.startTime) : null,
    }))
    .filter((it) => it.durationMs !== null)
    .sort((a, b) => b.durationMs - a.durationMs)
    .slice(0, limit);
}

function getTopScriptRequests(networkItems, limit = 5) {
  return networkItems
    .filter((it) => {
      const resourceType = (it?.resourceType ?? '').toLowerCase();
      const mime = (it?.mimeType ?? '').toLowerCase();
      const url = (it?.url ?? it?.link ?? '').toLowerCase();
      return resourceType === 'script' || mime.includes('javascript') || url.includes('.js');
    })
    .map((it) => {
      const transferBytes = it?.transferSize ?? it?.resourceSize ?? 0;
      return {
        url: it?.url ?? it?.link ?? null,
        transferKb: Math.round((transferBytes / 1024) * 100) / 100,
      };
    })
    .sort((a, b) => b.transferKb - a.transferKb)
    .slice(0, limit);
}

function getScriptUrls(networkItems) {
  return networkItems
    .filter((it) => {
      const resourceType = (it?.resourceType ?? '').toLowerCase();
      const mime = (it?.mimeType ?? '').toLowerCase();
      const url = (it?.url ?? it?.link ?? '').toLowerCase();
      return resourceType === 'script' || mime.includes('javascript') || url.includes('.js');
    })
    .map((it) => it?.url ?? it?.link ?? '')
    .filter(Boolean);
}

function detectDevArtifacts(scriptUrls) {
  const patterns = [
    /next-devtools/i,
    /react-refresh/i,
    /webpack-hmr/i,
    /turbopack/i,
    /\/_next\/static\/chunks\/.*dev/i,
  ];
  const matchedUrls = Array.from(
    new Set(scriptUrls.filter((url) => patterns.some((pattern) => pattern.test(url))))
  );

  return {
    detected: matchedUrls.length > 0,
    matchedUrls,
  };
}

function isAllowlistedHost(hostname, allowlistTokens) {
  if (!hostname) return false;
  return allowlistTokens.some(
    (token) =>
      hostname === token || hostname.endsWith(`.${token}`) || hostname.includes(token)
  );
}

function extractMetrics(lhr, budgets) {
  const lcpMs = getAuditNumeric(lhr, ['largest-contentful-paint']);
  const cls = getAuditNumeric(lhr, ['cumulative-layout-shift']);
  const inp = getAuditNumericWithSource(lhr, [
    'interaction-to-next-paint',
    'experimental-interaction-to-next-paint',
  ]);
  const inpFallback = getAuditNumericWithSource(lhr, ['total-blocking-time']);
  const inpMs = inp.value ?? inpFallback.value;
  const inpAuditId = inp.auditId ?? inpFallback.auditId;

  const resourceItems = getResourceSummaryItems(lhr);
  const jsBytes = sumTransferByType(resourceItems, 'script');
  const cssBytes = sumTransferByType(resourceItems, 'stylesheet');
  const fontBytes = sumTransferByType(resourceItems, 'font');

  const totalByteWeight = getAuditNumeric(lhr, ['total-byte-weight']);
  const totalTransferKb =
    totalByteWeight != null ? Math.round((totalByteWeight / 1024) * 100) / 100 : null;

  const networkItems = getNetworkRequests(lhr);
  const fontCount = networkItems.length > 0 ? countFontRequests(networkItems) : null;
  const fontUrls = Array.from(
    new Set(getFontLikeRequests(networkItems).map((it) => it?.url ?? it?.link ?? ''))
  ).sort();
  const topScripts = getTopScriptRequests(networkItems, 5);
  const scriptUrls = getScriptUrls(networkItems);
  const devArtifacts = detectDevArtifacts(scriptUrls);

  const finalUrl = lhr?.finalUrl ?? lhr?.requestedUrl ?? '';
  const originHostname = finalUrl ? getHostname(finalUrl) : '';
  const thirdPartyHosts = new Set(
    networkItems
      .map((it) => getHostname(it?.url ?? it?.link ?? ''))
      .filter((h) => isThirdParty(h, originHostname))
  );
  const thirdPartyHostList = Array.from(thirdPartyHosts).sort();

  const thirdPartyItems = getThirdPartySummary(lhr);
  let thirdPartyRequestCount = thirdPartyItems.reduce((acc, it) => {
    const n = it?.summary?.requestCount;
    return acc + (typeof n === 'number' ? n : 0);
  }, 0);
  const networkThirdPartyCount = networkItems.filter((it) =>
    isThirdParty(getHostname(it?.url ?? it?.link ?? ''), originHostname)
  ).length;
  if (thirdPartyRequestCount === 0 && thirdPartyHostList.length > 0) {
    thirdPartyRequestCount = networkThirdPartyCount;
  }

  const allowlistTokens = Array.isArray(budgets?.thirdParty?.allowlist)
    ? budgets.thirdParty.allowlist.map((entry) => String(entry).toLowerCase())
    : [];
  const nonAllowlistedThirdPartyHosts = thirdPartyHostList.filter(
    (host) => !isAllowlistedHost(host.toLowerCase(), allowlistTokens)
  );

  const diagnostics = {
    auditSources: {
      lcp: 'largest-contentful-paint',
      inp: inpAuditId,
      cls: 'cumulative-layout-shift',
    },
    lcpElement: getLargestContentfulPaintElement(lhr),
    longTasks: getTopLongTasks(lhr, 5),
    topScriptRequests: topScripts,
    fontRequests: {
      count: fontCount,
      totalTransferKb: fontBytes > 0 ? Math.round((fontBytes / 1024) * 100) / 100 : null,
      urls: fontUrls,
    },
    thirdParty: {
      hosts: thirdPartyHostList,
      nonAllowlistedHosts: nonAllowlistedThirdPartyHosts,
    },
    devArtifacts,
  };

  return {
    metrics: {
      coreWebVitals: {
        lcpMs: lcpMs != null ? Math.round(lcpMs) : null,
        inpMs: inpMs != null ? Math.round(inpMs) : null,
        cls: cls != null ? Math.round(cls * 1000) / 1000 : null,
      },
      assets: {
        totalJsKb: jsBytes > 0 ? Math.round((jsBytes / 1024) * 100) / 100 : null,
        totalCssKb: cssBytes > 0 ? Math.round((cssBytes / 1024) * 100) / 100 : null,
        fontRequests: fontCount,
        totalTransferKb,
      },
      thirdParty: {
        requestCount:
          thirdPartyRequestCount > 0 || thirdPartyHostList.length > 0
            ? thirdPartyRequestCount
            : null,
        hostList: thirdPartyHostList,
      },
      requestedUrl: lhr?.requestedUrl ?? null,
      finalUrl: finalUrl || null,
    },
    diagnostics,
  };
}

// --- Compare to budgets -----------------------------------------------------
function compare(budgets, metrics, warningThreshold) {
  const threshold = typeof budgets.warningThreshold === 'number' ? budgets.warningThreshold : (warningThreshold ?? 0.9);
  const violations = [];
  const warnings = [];

  const cwv = budgets.coreWebVitals || {};
  const m = metrics.coreWebVitals || {};
  if (cwv.lcp?.maxMs != null && m.lcpMs != null) {
    const budget = cwv.lcp.maxMs;
    const actual = m.lcpMs;
    if (actual > budget) violations.push({ metric: 'LCP', budget: `${budget} ms`, actual: `${actual} ms`, severity: 'violation', likelyCause: 'Slow LCP: image/font/JS blocking render or server response.' });
    else if (actual >= budget * threshold) warnings.push({ metric: 'LCP', budget: `${budget} ms`, actual: `${actual} ms`, severity: 'warning', likelyCause: 'Approaching LCP limit; monitor images and critical path.' });
  }
  if (cwv.inp?.maxMs != null && m.inpMs != null) {
    const budget = cwv.inp.maxMs;
    const actual = m.inpMs;
    if (actual > budget) violations.push({ metric: 'INP', budget: `${budget} ms`, actual: `${actual} ms`, severity: 'violation', likelyCause: 'Main thread busy; reduce JS or long tasks.' });
    else if (actual >= budget * threshold) warnings.push({ metric: 'INP', budget: `${budget} ms`, actual: `${actual} ms`, severity: 'warning', likelyCause: 'Approaching INP limit; check event handlers and TBT.' });
  }
  if (cwv.cls?.max != null && m.cls != null) {
    const budget = cwv.cls.max;
    const actual = m.cls;
    if (actual > budget) violations.push({ metric: 'CLS', budget: String(budget), actual: String(actual), severity: 'violation', likelyCause: 'Layout shift: reserve space for images/ads/fonts or avoid inserting content above existing.' });
    else if (actual >= budget * threshold) warnings.push({ metric: 'CLS', budget: String(budget), actual: String(actual), severity: 'warning', likelyCause: 'Approaching CLS limit; stabilize layout and dimensions.' });
  }

  const assets = budgets.assets || {};
  const a = metrics.assets || {};
  if (assets.totalJsKb?.max != null && a.totalJsKb != null) {
    const budget = assets.totalJsKb.max;
    const actual = a.totalJsKb;
    if (actual > budget) violations.push({ metric: 'Total JS', budget: `${budget} kb`, actual: `${actual} kb`, severity: 'violation', likelyCause: 'JS bundle or third-party scripts increased; consider code-splitting or deferring non-critical.' });
    else if (actual >= budget * threshold) warnings.push({ metric: 'Total JS', budget: `${budget} kb`, actual: `${actual} kb`, severity: 'warning', likelyCause: 'JS size approaching budget.' });
  }
  if (assets.totalCssKb?.max != null && a.totalCssKb != null) {
    const budget = assets.totalCssKb.max;
    const actual = a.totalCssKb;
    if (actual > budget) violations.push({ metric: 'Total CSS', budget: `${budget} kb`, actual: `${actual} kb`, severity: 'violation', likelyCause: 'CSS size increased; trim unused or split.' });
    else if (actual >= budget * threshold) warnings.push({ metric: 'Total CSS', budget: `${budget} kb`, actual: `${actual} kb`, severity: 'warning', likelyCause: 'CSS approaching budget.' });
  }
  if (assets.fontRequests?.max != null && a.fontRequests != null) {
    const budget = assets.fontRequests.max;
    const actual = a.fontRequests;
    if (actual > budget) violations.push({ metric: 'Font requests', budget: String(budget), actual: String(actual), severity: 'violation', likelyCause: 'More font requests than allowed; subset or reduce font families.' });
    else if (actual >= budget * threshold) warnings.push({ metric: 'Font requests', budget: String(budget), actual: String(actual), severity: 'warning', likelyCause: 'Font count approaching budget.' });
  }

  const third = budgets.thirdParty || {};
  if (third.maxRequests != null && metrics.thirdParty?.requestCount != null) {
    const budget = third.maxRequests;
    const actual = metrics.thirdParty.requestCount;
    if (actual > budget) violations.push({ metric: 'Third-party requests', budget: String(budget), actual: String(actual), severity: 'violation', likelyCause: 'New or increased third-party scripts; check allowlist and defer where possible.' });
    else if (actual >= budget * threshold) warnings.push({ metric: 'Third-party requests', budget: String(budget), actual: String(actual), severity: 'warning', likelyCause: 'Third-party count approaching budget.' });
  }

  return { violations, warnings };
}

// --- Output ------------------------------------------------------------------
function formatStatusRow(label, actual, budget, unit, threshold) {
  const budgetText = unit ? `${budget} ${unit}` : `${budget}`;
  if (actual === null || actual === undefined || budget === null || budget === undefined) {
    return `- ${label}: N/A (budget ${budgetText})`;
  }
  const actualText = unit ? `${actual} ${unit}` : `${actual}`;
  if (actual > budget) return `- ${label}: ${actualText} (budget ${budgetText}) ❌`;
  if (actual >= budget * threshold) return `- ${label}: ${actualText} (budget ${budgetText}) ⚠️`;
  return `- ${label}: ${actualText} (budget ${budgetText}) ✅`;
}

function buildSummary(opts, budgets, metrics, diagnostics, comparison, timestamp) {
  const { violations, warnings } = comparison;
  const threshold = typeof budgets.warningThreshold === 'number' ? budgets.warningThreshold : 0.9;
  const lines = [
    `# Performance budget summary`,
    ``,
    `**Run:** ${timestamp}`,
    `**URL:** ${opts.url}`,
    `**Mode:** ${opts.mode}`,
    ``,
  ];

  lines.push('## Metric scorecard');
  lines.push('');
  lines.push(
    formatStatusRow(
      'LCP',
      metrics.coreWebVitals?.lcpMs,
      budgets.coreWebVitals?.lcp?.maxMs,
      'ms',
      threshold
    )
  );
  lines.push(
    formatStatusRow(
      'INP',
      metrics.coreWebVitals?.inpMs,
      budgets.coreWebVitals?.inp?.maxMs,
      'ms',
      threshold
    )
  );
  lines.push(
    formatStatusRow(
      'CLS',
      metrics.coreWebVitals?.cls,
      budgets.coreWebVitals?.cls?.max,
      '',
      threshold
    )
  );
  lines.push(
    formatStatusRow(
      'Total JS',
      metrics.assets?.totalJsKb,
      budgets.assets?.totalJsKb?.max,
      'kb',
      threshold
    )
  );
  lines.push(
    formatStatusRow(
      'Total CSS',
      metrics.assets?.totalCssKb,
      budgets.assets?.totalCssKb?.max,
      'kb',
      threshold
    )
  );
  lines.push(
    formatStatusRow(
      'Font requests',
      metrics.assets?.fontRequests,
      budgets.assets?.fontRequests?.max,
      '',
      threshold
    )
  );
  lines.push(
    formatStatusRow(
      'Third-party requests',
      metrics.thirdParty?.requestCount,
      budgets.thirdParty?.maxRequests,
      '',
      threshold
    )
  );
  lines.push('');

  if (violations.length > 0) {
    lines.push('## Violations (exceeded budget)');
    lines.push('');
    for (const v of violations) {
      lines.push(`- **${v.metric}** — Budget: ${v.budget}, Actual: ${v.actual}`);
      lines.push(`  - Severity: Violation`);
      lines.push(`  - Likely cause: ${v.likelyCause}`);
      lines.push('');
    }
  }

  if (warnings.length > 0) {
    lines.push('## Warnings (approaching limit)');
    lines.push('');
    for (const w of warnings) {
      lines.push(`- **${w.metric}** — Budget: ${w.budget}, Actual: ${w.actual}`);
      lines.push(`  - Severity: Warning`);
      lines.push(`  - Likely cause: ${w.likelyCause}`);
      lines.push('');
    }
  }

  if (diagnostics) {
    lines.push('## Diagnostic highlights');
    lines.push('');
    if (diagnostics.lcpElement?.snippet) {
      lines.push(`- LCP element: ${diagnostics.lcpElement.snippet}`);
    } else if (diagnostics.lcpElement?.selector) {
      lines.push(`- LCP element selector: ${diagnostics.lcpElement.selector}`);
    }
    if (Array.isArray(diagnostics.topScriptRequests) && diagnostics.topScriptRequests.length > 0) {
      lines.push('- Top script requests:');
      for (const req of diagnostics.topScriptRequests.slice(0, 3)) {
        lines.push(`  - ${req.transferKb} kb — ${req.url}`);
      }
    }
    if (diagnostics.fontRequests?.count != null) {
      lines.push(`- Font requests detected: ${diagnostics.fontRequests.count}`);
    }
    if (
      Array.isArray(diagnostics.thirdParty?.nonAllowlistedHosts) &&
      diagnostics.thirdParty.nonAllowlistedHosts.length > 0
    ) {
      lines.push(
        `- Non-allowlisted third-party hosts: ${diagnostics.thirdParty.nonAllowlistedHosts.join(', ')}`
      );
    }
    lines.push('');
  }

  if (violations.length === 0 && warnings.length === 0) {
    lines.push('**All performance budgets satisfied.**');
    lines.push('');
    lines.push('No action required.');
    return lines.join('\n');
  }

  lines.push('---');
  if (violations.length > 0) {
    lines.push('**Status: Red** — Address violations or waive with rationale. See docs/predeploy/performance-budget-guide.md.');
  } else {
    lines.push('**Status: Yellow** — Note in release template; fix if trivial. See docs/predeploy/performance-budget-guide.md.');
  }
  return lines.join('\n');
}

// --- Main --------------------------------------------------------------------
async function main() {
  const opts = parseArgs();

  let budgets;
  try {
    budgets = await loadBudgets(opts.budgets);
  } catch (e) {
    console.error('Failed to load budgets from', opts.budgets, e.message);
    process.exit(1);
  }

  console.log('Running Lighthouse at', opts.url, `(${opts.mode})...`);
  let lhr;
  try {
    const result = await runLighthouse(opts.url, opts.mode);
    lhr = result.lhr;
  } catch (e) {
    console.error('Lighthouse run failed:', e.message);
    process.exit(1);
  }

  const { metrics, diagnostics } = extractMetrics(lhr, budgets);
  if (diagnostics?.devArtifacts?.detected) {
    console.error(
      'Detected development-only artifacts in Lighthouse script requests. ' +
        'Performance budgets must run against production (pnpm build && pnpm start).'
    );
    console.error('Matched artifacts:');
    for (const matchedUrl of diagnostics.devArtifacts.matchedUrls.slice(0, 10)) {
      console.error(` - ${matchedUrl}`);
    }
    process.exit(1);
  }

  const warningThreshold = budgets.warningThreshold ?? 0.9;
  const comparison = compare(budgets, metrics, warningThreshold);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const jsonPath = join(OUTPUT_DIR, `performance-${timestamp}.json`);
  const summaryPath = join(OUTPUT_DIR, `performance-summary-${timestamp}.md`);

  await mkdir(OUTPUT_DIR, { recursive: true });

  const jsonPayload = {
    timestamp: new Date().toISOString(),
    url: opts.url,
    mode: opts.mode,
    metrics,
    diagnostics,
    comparison: {
      violations: comparison.violations,
      warnings: comparison.warnings,
      allSatisfied: comparison.violations.length === 0 && comparison.warnings.length === 0,
    },
  };
  await writeFile(jsonPath, JSON.stringify(jsonPayload, null, 2), 'utf-8');
  console.log('Wrote', jsonPath);

  const summary = buildSummary(opts, budgets, metrics, diagnostics, comparison, timestamp);
  await writeFile(summaryPath, summary, 'utf-8');
  console.log('Wrote', summaryPath);

  if (comparison.violations.length > 0) {
    console.log('\nOne or more budget violations. See summary and docs/predeploy/performance-budget-guide.md.');
    process.exit(2);
  }
  if (comparison.warnings.length > 0) {
    console.log('\nWarnings (approaching limit). Note in release template if needed.');
  } else {
    console.log('\nAll performance budgets satisfied.');
  }
  process.exit(0);
}

main();
