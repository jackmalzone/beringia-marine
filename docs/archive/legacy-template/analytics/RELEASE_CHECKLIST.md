# Analytics Release Checklist

Use this checklist before shipping analytics-sensitive changes.

## Configuration

- [ ] `globalSettings.analyticsSettings.facebookPixelId` is populated in Sanity (or env fallback set).
- [ ] `globalSettings.analyticsSettings.googleTagManagerId` is populated in Sanity (or env fallback set).
- [ ] Analytics mode/enable flags are correct for the target environment.

## Runtime Validation (Non-Production)

- [ ] Open `/debug/analytics` and confirm effective config values.
- [ ] Confirm `fbq` is available and audit events show `sent` for key actions.
- [ ] Confirm `dataLayer` exists and grows after interactions.

## Automated Smoke Tests

- [ ] Playwright analytics smoke tests pass for preview/local target.
- [ ] Meta script and GTM script load assertions pass.
- [ ] SPA PageView and booking CTA assertions pass.

## Manual Validation

- [ ] Meta Test Events receives `PageView` on initial load and route change.
- [ ] `InitiateCheckout` fires when booking CTA is clicked.
- [ ] If Mindbody redirect/webhook seam exists, `Purchase`/`Schedule` appear in Test Events.

## Conversion Seam Declaration

- [ ] If Mindbody redirect/webhook is not configured, document `Purchase`/`Schedule` as intentionally not observable to avoid false outage assumptions.
