import { expect, test } from '@playwright/test';
import {
  expectAnalyticsRuntimeReady,
  expectAuditEventSent,
  expectAuditQueuedThenSent,
} from './helpers/audit';

test.describe('analytics smoke', () => {
  test('analytics boots and emits initial PageView through audit channel', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expectAnalyticsRuntimeReady(page);
    await expectAuditQueuedThenSent(page, 'PageView', 'meta');
  });

  test('tracks PageView on navigation to solutions intent', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expectAnalyticsRuntimeReady(page);
    await expectAuditEventSent(page, 'PageView', 'meta');

    await page.goto('/solutions', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/solutions/);
    await expectAuditQueuedThenSent(page, 'PageView', 'meta');
  });

  test('contact intent CTA navigates to /contact', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expectAnalyticsRuntimeReady(page);

    const contactCta = page.locator('[data-testid="cta-contact"]').first();
    await expect(contactCta).toBeVisible();
    await contactCta.click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('contact page emits PageView', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });
    await expectAnalyticsRuntimeReady(page);
    await expectAuditQueuedThenSent(page, 'PageView', 'meta');
  });
});
