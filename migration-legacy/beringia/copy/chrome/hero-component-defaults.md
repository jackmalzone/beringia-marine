# Hero component — default props vs home usage

**Source:** `src/components/Hero/Hero.tsx`

When props are omitted, defaults are:

| Prop | Default value |
|------|----------------|
| title | Marine Technology Solutions |
| subtitle | Advancing ocean exploration and research through innovative technology |
| backgroundImage | /assets/beringia/seascape-wallpaper.jpg |

**Home page** overrides title/subtitle to match site identity (see `copy/pages/home.json`).

**CTAs inside Hero (when enabled):** Explore Solutions → `/clients`, Learn More → `/about`
