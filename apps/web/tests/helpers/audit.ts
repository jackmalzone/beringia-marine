import { expect, Page } from '@playwright/test';

export interface AuditEvent {
  ts: number;
  provider: 'meta' | 'gtm' | 'config';
  name: string;
  status: 'queued' | 'sent' | 'skipped';
  params?: Record<string, unknown>;
  note?: string;
}

export async function getAudit(page: Page): Promise<AuditEvent[]> {
  return page.evaluate(() => {
    const value = (window as Window & { __analyticsAudit?: AuditEvent[] }).__analyticsAudit;
    return Array.isArray(value) ? value : [];
  });
}

export async function waitForAudit(
  page: Page,
  predicate: (events: AuditEvent[]) => boolean,
  timeoutMs: number = 4000
): Promise<AuditEvent[]> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const events = await getAudit(page);
    if (predicate(events)) return events;
    await page.waitForTimeout(100);
  }

  const events = await getAudit(page);
  throw new Error(
    `Timed out waiting for audit condition after ${timeoutMs}ms.\nCurrent events:\n${JSON.stringify(events, null, 2)}`
  );
}

export async function expectAuditEventSent(
  page: Page,
  name: string,
  provider: AuditEvent['provider'] = 'meta'
): Promise<void> {
  await waitForAudit(page, events =>
    events.some(event => event.provider === provider && event.name === name && event.status === 'sent')
  );
}

export async function expectAuditQueuedThenSent(
  page: Page,
  name: string,
  provider: AuditEvent['provider'] = 'meta'
): Promise<void> {
  await waitForAudit(page, events =>
    events.some(event => event.provider === provider && event.name === name && event.status === 'queued')
  );
  await expectAuditEventSent(page, name, provider);
}

export async function expectAnalyticsRuntimeReady(page: Page): Promise<void> {
  await expect
    .poll(
      () =>
        page.evaluate(() => ({
          hasFbq: typeof window.fbq === 'function',
          hasDataLayer: Array.isArray(window.dataLayer),
        })),
      { timeout: 6000 }
    )
    .toEqual({
      hasFbq: true,
      hasDataLayer: true,
    });
}
