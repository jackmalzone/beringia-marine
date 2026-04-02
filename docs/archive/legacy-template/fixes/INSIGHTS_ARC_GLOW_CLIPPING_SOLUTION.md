# Insights Arc Glow Clipping Solution

## Issue

The neon arc glow effect on the Insights page was being clipped at the top. The upward-diffusing glow from the SVG blur filters was not fully visible because the container didn't provide enough vertical space above the arc's path.

## Root Cause

Three factors were causing the clipping:

1. **Container positioned too low**: The `.insights__arcBackground` container started at `top: 45vh`, which didn't leave room above the arc for the glow to extend upward
2. **Mismatched mask coordinates**: The SVG mask rect was using old viewBox coordinates that didn't account for the expanded space needed for the glow
3. **Missing overflow handling**: No explicit `overflow: visible` was set to ensure the glow could extend beyond container bounds

## Solution

### 1. Raise and Expand the Container

**File**: `src/app/insights/page.module.css`

```css
/* Before */
.insights__arcBackground {
  position: absolute;
  top: 45vh;
  left: 0;
  right: 0;
  width: 100vw;
  height: 70vh;
  min-height: 600px;
  pointer-events: none;
  z-index: 0;
}

/* After */
.insights__arcBackground {
  position: absolute;
  top: 20vh; /* Raised 25vh higher */
  left: 0;
  right: 0;
  width: 100vw;
  height: 95vh; /* Increased from 70vh */
  min-height: 800px; /* Increased from 600px */
  pointer-events: none;
  z-index: 0;
  overflow: visible; /* Added to prevent clipping */
}
```

### 2. Adjust SVG ViewBox

**File**: `src/app/insights/InsightsPageClient.tsx`

```tsx
/* Before */
<svg
  className={styles.insights__arc}
  viewBox="-200 0 3400 1200"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  preserveAspectRatio="none"
>

/* After */
<svg
  className={styles.insights__arc}
  viewBox="-200 -300 3400 1500"  /* Shifted up 300 units, added 300 height */
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  preserveAspectRatio="none"
>
```

### 3. Update Mask Coordinates

**File**: `src/app/insights/InsightsPageClient.tsx`

```tsx
/* Before */
<mask id="arcFadeMask">
  <rect x="-200" y="0" width="3400" height="1200" fill="url(#fadeMask)" />
</mask>

/* After */
<mask id="arcFadeMask">
  <rect x="-200" y="-300" width="3400" height="1500" fill="url(#fadeMask)" />
</mask>
```

### 4. Add Overflow to SVG Element

**File**: `src/app/insights/page.module.css`

```css
/* Arc SVG */
.insights__arc {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible; /* Added to ensure glow isn't clipped */
}
```

## Technical Details

### Why This Works

- **Container expansion**: Moving from `top: 45vh` to `top: 20vh` provides 25vh of additional space above the arc for the glow to diffuse upward
- **ViewBox compensation**: Adjusting the viewBox from `y="0"` to `y="-300"` shifts the coordinate system upward, keeping the arc visually in the same position relative to page content while providing room for the glow
- **Mask synchronization**: The mask rect must match the viewBox coordinates to avoid clipping the filtered elements
- **Overflow visibility**: Explicitly setting `overflow: visible` ensures that blur filters extending beyond element bounds are rendered

### Glow Implementation

The arc uses multiple layered blur filters for a realistic neon glow:

- `glow1`: stdDeviation="8" (close glow)
- `glow2`: stdDeviation="20" (medium glow)
- `glow3`: stdDeviation="40" (wide diffusion)
- `glow4`: stdDeviation="70" (ultra-wide diffusion)

The largest blur filter (`glow4`) with a 70px standard deviation requires significant space to render fully, which is why the container needed to be expanded.

## Files Modified

- `src/app/insights/page.module.css`
- `src/app/insights/InsightsPageClient.tsx`

## Testing

Verify the fix by:

1. Navigate to `/insights` page
2. Check that the neon arc glow is fully visible at the top
3. Ensure the arc remains visually positioned below the hero title
4. Verify the glow diffuses smoothly upward without clipping

## Related Issues

- SVG filter clipping
- ViewBox coordinate system
- CSS overflow and positioning

## Date Fixed

November 21, 2025
