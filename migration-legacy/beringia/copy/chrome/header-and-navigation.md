# Header and navigation — extracted labels

**Source:** `src/components/Header/Header.tsx`

## Brand

- **Logo image path:** `/assets/beringia/logo-white-transparent.png`
- **Logo alt:** Beringia Marine Logo
- **Visible title (H1 in header):** Beringia Marine
- **Home link:** `/` (aria-label: Home)

## Primary navigation (desktop and mobile)

| Label     | Target | Notes |
|-----------|--------|--------|
| Home      | `/`    |       |
| Solutions | (dropdown) | Button label "Solutions" |
| About     | `/about` | |
| Contact   | `/contact` | |
| Terms     | `/terms` | |

## Solutions dropdown items

| Label               | Path |
|---------------------|------|
| Mission Robotics    | `/clients/mission-robotics` |
| Anchor Bot          | `/clients/anchor-bot` |
| Advanced Navigation | `/clients/advanced-navigation` |

## Utility CTA (header end, desktop)

- **Label:** Get in Touch
- **Href:** `/contact`

## Mobile

- Menu toggle aria-label: Toggle mobile menu
- Loading state text (if `isLoading`): Loading...

## Patterns worth preserving (reference only)

- Hide header on scroll down / show on scroll up after threshold
- Scrolled styling after ~50px
- Solutions: hover menu desktop; click-expand mobile
- Body scroll lock when mobile menu open
- Breakpoint: mobile menu when width ≤ 1024px
