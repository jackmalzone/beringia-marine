# Asset inventory — references only

**Policy:** No files were moved or copied into `migration/beringia/assets/` unless you request it. This list records **paths as referenced by the app**, local presence in the repo workspace, and usage.

**Legend — present:**

- **yes** — file exists at expected path under repo root
- **no** — not found in workspace (restore from production / backup / `components-migration/` where noted)
- **cdn** — hosted on Sanity (`cdn.sanity.io`), not in repo

| Path or pattern | Type | Where used | Present locally |
|-----------------|------|------------|-----------------|
| `/assets/beringia/logo-white-transparent.png` | image (PNG) | Header logo | no |
| `/assets/beringia/seascape-wallpaper.jpg` | image (JPEG) | Home hero background, Hero default | no |
| `/assets/beringia/penguin.jpeg` | image (JPEG) | About flip card | no |
| `/vendor/fonts/Domitian-Roman.otf` | font | `globals.css` @font-face | no |
| `/vendor/fonts/Domitian-Bold.otf` | font | `globals.css` | no |
| `/vendor/fonts/Domitian-Italic.otf` | font | `globals.css` | no |
| `/vendor/fonts/Domitian-BoldItalic.otf` | font | `globals.css` | no |
| `public/window.svg` | SVG | Next default | yes |
| `public/vercel.svg` | SVG | Next default | yes |
| `public/globe.svg` | SVG | Next default | yes |
| `public/next.svg` | SVG | Next default | yes |
| `public/file.svg` | SVG | Next default | yes |
| Sanity `client.logo` | image | `/clients`, client Overview | cdn |
| Sanity `overview.headerImage` | image | Client Overview header | cdn |
| Sanity selling point `icon` | image | SellingPoints cards | cdn |
| Sanity `gallery[].image` / `videoFile` | media | Intended gallery (stub UI) | cdn |
| Sanity `seo.ogImage` | image | Queried; not used in Next metadata | cdn |
| `components-migration/assets/beringia/logo-white.svg` | SVG | Legacy / backup brand | yes |
| `components-migration/assets/beringia/logo-solid.svg` | SVG | Legacy / backup brand | yes |
| `components-migration/assets/beringia/Logo_rev004wht/*` | SVG | Legacy / backup brand | yes |
| `components-migration/assets/sketchfab-logo.svg` | SVG | Legacy UI | yes |
| `components-migration/assets/sketchfab-logo-text.svg` | SVG | Legacy UI | yes |
| `components-migration/assets/linkedin-icon.svg` | SVG | Legacy UI | yes |
| App `favicon` / `icon.png` | icon | None found under `src/app` | no |

## Suggested future placement (when you copy binaries)

| Category | Target under staging |
|----------|----------------------|
| Logos / brand PNG-SVG | `migration/beringia/assets/brand/` |
| Photography / wallpapers | `migration/beringia/assets/imagery/` |
| Domitian OTF | `migration/beringia/assets/fonts/` |
| PDFs / downloadable specs (from Sanity or disk) | `migration/beringia/assets/documents/` |

## Remote patterns

- **next.config:** `images.remotePatterns` allows `cdn.sanity.io` for Next/Image.
