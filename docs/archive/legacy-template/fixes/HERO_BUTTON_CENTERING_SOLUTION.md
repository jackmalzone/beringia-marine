# Hero Button Text Centering Solution

## Problem

The hero button text "Stay In the Loop" was not centering correctly when hovering over the "COMING SOON" button. The text appeared to be aligned with the start of "COMING SOON" but the end of "Stay In the Loop" was closer to the right edge than the start was to the left edge.

## Root Cause

The original CSS used `text-align: center` with `display: inline-flex`, which doesn't provide true centering for absolutely positioned elements. The text-align property doesn't work reliably with flexbox containers.

## Solution

Implemented proper flexbox centering for both the default and hover text states:

### CSS Changes

```css
.hero__buttonText {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  letter-spacing: 0.02em;
  position: relative;
  width: 100%;
}

.hero__buttonTextHover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transform: translateY(10px);
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## Key Changes

1. **Flexbox Centering**: Changed from `display: inline-flex` to `display: flex` with `justify-content: center` and `align-items: center`
2. **Full Width**: Added `width: 100%` to ensure the container spans the full button width
3. **Hover Text Centering**: Applied the same flexbox centering to the hover text with `bottom: 0` to span full height
4. **Removed Text-Align**: Eliminated unreliable `text-align: center` approach

## Result

- Both "COMING SOON" and "Stay In the Loop" are now perfectly centered within the button
- Consistent alignment regardless of text length differences
- Clean, proper CSS solution without hacky translations
- Smooth hover transition maintained

## Files Modified

- `src/components/sections/Hero/Hero.module.css`

## Date

December 2024
