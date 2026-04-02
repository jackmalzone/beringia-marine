# Mindbody Healcode Widget Reference

This document contains the exact widget code snippets for all Mindbody widgets used in the Vital Ice website.

## Founding Membership Inquiry Widget

```html
<script
  src="https://widgets.mindbodyonline.com/javascripts/healcode.js"
  type="text/javascript"
></script>

<healcode-widget
  data-type="prospects"
  data-widget-partner="object"
  data-widget-id="ec61906b5f7"
  data-widget-version="0"
></healcode-widget>
```

**Issues:**

- Default browser-styled checkboxes
- Incorrect margins and padding
- Submits do nothing on desktop or mobile

---

## Get In Contact Widget

```html
<script
  src="https://widgets.mindbodyonline.com/javascripts/healcode.js"
  type="text/javascript"
></script>

<healcode-widget
  data-type="prospects"
  data-widget-partner="object"
  data-widget-id="ec59329b5f7"
  data-widget-version="0"
></healcode-widget>
```

**Context:** Used on contact page

---

## Vital Ice Registration Widget

```html
<script
  src="https://widgets.mindbodyonline.com/javascripts/healcode.js"
  type="text/javascript"
></script>

<healcode-widget
  data-type="registrations"
  data-widget-partner="object"
  data-widget-id="ec161013b5f7"
  data-widget-version="0"
></healcode-widget>
```

**Issues:**

- Displays "temporarily unavailable" on load

---

## Waitlist Widget

```html
<script
  src="https://widgets.mindbodyonline.com/javascripts/healcode.js"
  type="text/javascript"
></script>

<healcode-widget
  data-type="prospects"
  data-widget-partner="object"
  data-widget-id="ec59331b5f7"
  data-widget-version="0"
></healcode-widget>
```

**Issues:**

- Same styling issues (checkboxes, spacing)
- No confirmation or validation appears

---

## Technical Notes

- **Script URL:** `https://widgets.mindbodyonline.com/javascripts/healcode.js`
- **Script must be loaded once** before the first widget renders
- Widgets use custom elements (`<healcode-widget>`)
- Widgets require client-side rendering (do not work with SSR)
- All widgets use `data-widget-partner="object"` and `data-widget-version="0"`
- Three widgets use `data-type="prospects"`, one uses `data-type="registrations"`

## Related Documentation

- [Main Documentation Index](./README.md)
- [Troubleshooting Guide](../troubleshooting/MINDBODY_WIDGET_TROUBLESHOOTING.md)
- [Support Diagnostic Report](../troubleshooting/MINDBODY_SUPPORT_DIAGNOSTIC_REPORT.md)
- [Widget Navigation Issue Fix](../fixes/MINDBODY_WIDGET_NAVIGATION_ISSUE.md)
