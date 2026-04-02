# Header and Hero Updates - Client Request

_UPDATE COMPLETED_

**Date:** December 2024  
**Requested by:** Client  
**Status:** Implemented

## Changes Made

### 1. Header Logo Update

- **Before:** "Vital Ice" text logo in top-left corner + VI emblem in center
- **After:** VI emblem (with line over it) moved to top-left corner as primary logo
- **Files Modified:**
  - `src/components/layout/Header/Header.tsx`
  - `src/components/layout/Header/Header.module.css`

### 2. Hero Text Restructure

- **Before:**
  - Main title: "VITAL ICE SAN FRANCISCO"
  - Subtitle: "Cold Plunges. Saunas. Community Recovery."
- **After:**
  - Location: "SAN FRANCISCO" (smaller text above main title)
  - Main title: "VITAL ICE"
  - Subtitle: "Live Better — Together"
- **Files Modified:**
  - `src/components/sections/Hero/Hero.tsx`
  - `src/components/sections/Hero/Hero.module.css`

## Technical Details

### Header Changes

- Replaced `Logo` component with `VILogo` component in top-left corner
- Removed center VI logo that was previously positioned in the middle of the header
- Cleaned up unused CSS classes: `.centerLogo`, `.centerLogoMobile`
- Maintained clickable functionality - VI logo still links to home page

### Hero Changes

- Added new `.hero__location` CSS class for "SAN FRANCISCO" text
- Updated text hierarchy to show location above main title
- Changed subtitle from service list to new tagline
- Maintained all existing animations and responsive design

## Revert Instructions

If client wants to revert these changes:

### Header Revert

1. In `src/components/layout/Header/Header.tsx`:

   - Replace `<VILogo className={styles.logo} color={getLogoColor()} />` with `<Logo className={styles.logo} />`
   - Add back the center logo div:

   ```jsx
   {
     /* Center VI Logo - Hidden on Mobile */
   }
   <div className={`${styles.centerLogo} ${styles.centerLogoMobile}`}>
     <VILogo className={styles.viLogo} color={getLogoColor()} />
   </div>;
   ```

2. In `src/components/layout/Header/Header.module.css`:

   - Add back the center logo styles:

   ```css
   .centerLogo {
     position: absolute;
     left: 50%;
     top: 50%;
     transform: translate(-50%, -50%);
     display: flex;
     align-items: center;
     justify-content: center;
   }

   .centerLogoMobile {
     display: none;
   }
   ```

   - Add back to media queries:

   ```css
   @media (min-width: 768px) {
     .centerLogoMobile {
       display: none;
     }
   }

   @media (min-width: 1024px) {
     .centerLogoMobile {
       display: flex;
     }
   }
   ```

### Hero Revert

1. In `src/components/sections/Hero/Hero.tsx`:

   - Remove the location div
   - Change main title back to "VITAL ICE SAN FRANCISCO"
   - Change subtitle back to "Cold Plunges. Saunas. Community Recovery."

2. In `src/components/sections/Hero/Hero.module.css`:
   - Remove the `.hero__location` CSS class

## Notes

- Client specifically requested moving VI emblem to top-left corner
- Client wanted "San Francisco" moved above "Vital Ice" as smaller text
- Client requested replacing service list with "Live Better — Together"
- All changes maintain existing functionality and responsive design
