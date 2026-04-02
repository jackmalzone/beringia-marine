# Background Image Solutions

## Issue: Background Images Not Displaying in Historical Timeline

### Problem Description

Background images in the historical timeline page were not displaying, showing only a black background despite console logs indicating successful image loading.

### Root Cause

The global CSS in `src/app/globals.css` was setting a black background on the body element:

```css
html,
body {
  background: var(--color-background); /* #000000 - black */
}
```

This black background was covering all background images, making them invisible even when they loaded successfully.

### Solution

Temporarily remove or comment out the global background color when working with background images:

```css
html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text);
  /* background: var(--color-background); */ /* Comment out when using background images */
}
```

### Alternative Solutions

1. **Use higher z-index values** for background images to ensure they appear above the global background
2. **Set background images on the body element** instead of individual containers
3. **Use CSS custom properties** to conditionally apply backgrounds based on page context

### Debugging Steps Used

1. Added debug borders and backgrounds to image elements
2. Added test images with different positioning
3. Checked z-index layering
4. Verified image paths and loading
5. Identified global CSS interference

### Prevention

- Always check global CSS when background images aren't displaying
- Use browser dev tools to inspect element layering
- Test with simple, visible debugging elements first
- Consider the impact of global styles on page-specific elements

### Files Modified

- `src/app/globals.css` - Commented out global background
