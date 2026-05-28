# Authoring guide — Beringia Marine Studio

A walkthrough of every part of the CMS. Read top to bottom the first time; bookmark sections for later.

---

## 1. Getting in

### Local development (writing on your own machine)

```bash
pnpm install     # one time, from the repo root
pnpm dev:studio  # starts the studio at http://localhost:3333
```

Open `http://localhost:3333` in a browser. The first time, you'll see Sanity's login screen — sign in with the email associated with your Sanity account (`jackmalzone@gmail.com`). Any teammate who needs access has to be invited at https://www.sanity.io/manage/project/l183gjut/members.

### Production studio

After deploy, the studio lives at `https://studio.beringia-marine.com`. Same Sanity login. The web site (`https://beringia-marine.com`) is a separate Vercel project — content edits in the studio show up on the site within a minute (Sanity revalidation interval is 60 seconds for cached reads).

> **The studio is read-only to anyone who isn't a project member.** Sanity's own auth is the gate — there is no separate password.

---

## 2. The lay of the land

When the studio opens, the left sidebar is the **Content desk**. Three pinned entries:

| Section          | What it is                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------- |
| **Site settings** | One-of-a-kind document. Business info, social links, default SEO. The site reads this everywhere a fallback is needed. |
| **Insights**     | Articles, white papers, case studies, field reports. Each maps to a `/insights/<slug>` page on the site. Drag to reorder. |
| **Partners**     | Solution partner pages (Anchorbot, Mission Robotics, etc.). Each maps to `/solutions/<slug>`. Drag to reorder. |
| **Team**         | People on the Beringia team. Used on the About page and as optional insight authors. Drag to reorder. |

Below the divider you'll see any other document types Sanity exposes — for phase 1 there shouldn't be anything else.

The top bar has **Vision** (the GROQ query playground) and a search icon — both useful when debugging, neither needed for everyday authoring.

---

## 3. Editing site-wide settings

There is exactly **one** `Site settings` document. You can't create another and you can't delete it.

Click **Site settings** in the sidebar. The form has four sections:

### Business info
- **Name** *(required)* — the org name. Used as the SEO `siteName` and as a fallback for OG titles.
- **Legal name** — full legal entity ("Beringia Marine, Inc."). Used in the footer copyright.
- **Tagline** — short positioning line. Currently used in default SEO descriptions.
- **Email / Phone** — surfaced on the contact page and in structured data.
- **Address** — multi-line. Used in structured data and footer.

### Social links
LinkedIn / GitHub / Twitter / YouTube. Leave any blank that you don't have — empty fields are skipped on the site.

### SEO defaults
The `seoSettings` object (same shape that appears on every Insight and Partner). Whatever you put here is the **fallback** when a specific Insight or Partner doesn't define its own SEO. Don't worry if it feels redundant — the per-document SEO almost always overrides.

### Analytics
- **Google Analytics ID** — `G-XXXXXXXXXX` format. Optional. If unset, the site reads `NEXT_PUBLIC_GA_ID` from env vars.
- **Google Tag Manager ID** — `GTM-XXXXXXX` format. Optional.

**Publish workflow** for Site settings: edit → click **Publish** (top right). Changes show up on the site within a minute. Don't worry about drafts here — there's only one published version that matters.

---

## 4. Publishing an insight

This is the most common authoring task. Walk through it once and the rest is pattern matching.

### 4.1 Create a new insight

1. In the sidebar, click **Insights** → **+ Create new** (top-right button).
2. You land on an empty form. Fill it top to bottom.

### 4.2 Required fields, top to bottom

| Field            | What to do                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------- |
| **Title**        | The article headline. Sentence case unless it's a formal report title. Max 160 chars.        |
| **Slug**         | Click **Generate** — Sanity slugifies the title automatically. Edit only if needed. The slug becomes the URL: `/insights/<slug>`. **Don't change the slug after publishing** — it breaks any inbound links. |
| **Category**     | Pick one: Article / White Paper / Case Study / Field Report / Research Summary. Shown on the article hero and on the /insights index. |
| **Content type** | Article / White Paper / Hybrid. Controls how the article page renders (article = prose-first; white-paper = formal report layout; hybrid = prose + downloadable PDF emphasis). |
| **Excerpt**      | 1–4 sentence summary. Used in listings, the article hero, and meta descriptions. Max 600 chars. |
| **Cover image**  | See [§6 Working with images](#6-working-with-images). Required. Appears on the hero and in listing cards. |
| **Body**         | The article itself. See [§4.3 Writing the body](#43-writing-the-body). |
| **Published date** | Required. Use the actual publish date (not today's date, unless they're the same). |

### 4.3 Writing the body

The body is a **Portable Text** editor — like Google Docs but structured.

**Block styles** (paragraph-level): Normal / H2 / H3 / H4 / Quote
- H1 is reserved for the article title (set above). Start sections with H2.
- H3 nests inside an H2; H4 inside an H3.

**Marks** (inline formatting): Strong / Emphasis / Underline / Code
- Highlight text → click the formatter → it wraps the selection.

**Links**: highlight → click the link icon → paste URL → toggle "Open in new tab" if external.

**Lists**: bullet or numbered, via the toolbar.

**Inserting a figure** (image + caption): click the **+** button in the body → **Figure**. Then:
- Upload the image
- Add **Alt text** (required — describe the image for screen readers, e.g. "Bay-site torque vs penetration curve")
- Optional **Caption** — e.g. "Figure 1: Pull-test results at Sequim Bay site"

The site renders figures with the image at full width and the caption below in muted text — matches the existing `/insights/*` pages.

### 4.4 Optional but useful

| Field              | Why you'd use it                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **Deck**           | Subhead/dek shown beneath the title on the hero. One sentence elaborating the title.      |
| **Author**         | Free-text byline, e.g. "Chris Malzone, Principal Consultant / Beringia Marine, Inc".      |
| **Author (team member)** | Optional. Link a [Team member](#52-team-members) instead of typing the byline. When set, their name + role become the byline (and the site can show their photo/bio). Takes precedence over the free-text Author. |
| **Tags**           | Free-form taxonomy. Type and press Enter. Surfaced as pills under the article hero.       |
| **Reading time**   | Number, in minutes. If you leave this blank, set it later — there's no auto-calc yet.     |
| **Last updated**   | Date. Set this when you republish an existing article with edits.                         |
| **PDF download URL** | Link to a PDF version. Can be a relative path (`/assets/insights/foo.pdf`) for files in `apps/web/public/`, or an external URL (R2, S3, Drive). Adds a "Download full report" button on the article. |
| **Featured**       | Toggle on to surface this insight prominently on the `/insights` landing page.            |
| **SEO**            | Per-article overrides for the social/search preview. See [§7 SEO fields](#7-seo-fields).  |

### 4.5 Publishing

When the form looks right, click **Publish** (top right). The first publish creates the live document; subsequent edits create a draft, and **Publish** promotes it.

**Drafts vs published**:
- The yellow dot next to a document title means there's an unpublished draft.
- The site only shows published content. Drafts are invisible to visitors.
- Click **Publish** to promote a draft → live.
- Click **Discard changes** (in the action menu) to throw away a draft without publishing.

---

## 5. Setting up a partner

Almost identical workflow to Insights, but the shape is a partner profile (sales/marketing page), not an article.

1. **Partners** → **+ Create new**.
2. Fill the fields:

| Field                | Notes                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------- |
| **Name** *(required)* | The partner company name. e.g. "Anchorbot Marine".                                          |
| **Slug** *(required)* | URL slug: `/solutions/<slug>`. Generated from the name; edit if needed.                     |
| **Tagline**          | One-sentence elevator pitch shown on `/solutions` cards.                                    |
| **Header image**     | Hero image for the partner detail page. Drop a 16:9 or 3:2 photograph; add alt text.        |
| **Logo**             | Partner wordmark/logo, shown in the overview header next to the hero. Transparent PNG/SVG works best. |
| **Overview**         | `title` (usually the partner name) + `description` (2–4 sentences explaining who they are). |
| **Selling points**   | The "Core Technology" cards. Each point has `title`, `description`, `features[]`, optional `icon`, optional `link` (the title becomes clickable), and optional `documentation` (Specs / Manual / Evaluation buttons — paste a URL or `/assets/...` path for each). Drag to reorder. |
| **Use cases**        | A list of applications. Each `case` has `title`, `description`, `keyPoints[]`. These are the industry/scenario cards. |
| **Value proposition** | `title` (e.g. "Why choose X"), `description`, and `highlights[]` — short pithy bullets ("Cost-effective", "Reduced env. impact", …). |
| **Media links**      | The "Connect with us" buttons: website, email, LinkedIn, YouTube, Sketchfab. Fill what exists; blanks are skipped. |
| **Sketchfab model ID** | The bare model ID (e.g. `11c4619c…`) for the interactive 3D section. Only the partners with a public 3D model need this. |
| **Interactive 3D copy** | `title` + `description` shown above the 3D embed. Only relevant when a Sketchfab model ID is set. |
| **Demo video**       | `title`, `description`, and `videoUrl` (external URL or `/assets/...` path). Renders a `<video>` player section. |
| **Gallery**          | A reorderable list of **Image** items (upload + alt text) and/or **Sketchfab model** items (model ID + label). Renders as a lightbox grid. |
| **Documents**        | Datasheets / PDFs shown in the partner sidebar. Each has a `label` and `href` (URL or `/assets/...` path). |
| **External links**   | Generic outbound links: `label` + `href`.                                                  |
| **Status**           | Active / Draft / Archived. Only `Active` partners show on `/solutions`.                     |
| **Featured**         | Toggle to surface prominently. (UI surfacing of "featured partners" can come in phase 2.)   |
| **SEO**              | Per-partner overrides for the page's social/search preview.                                 |

Publish when done. Same workflow as insights.

### 5.2 Team members

People on the Beringia team. Used on the About page and available as insight authors.

1. **Team** → **+ Create new**.
2. Fill the fields:

| Field        | Notes                                                                          |
| ------------ | ------------------------------------------------------------------------------ |
| **Name** *(required)* | Full name.                                                            |
| **Role / title** | e.g. "Principal Consultant".                                              |
| **Slug**     | Generated from the name. Reserved for future individual profile pages.         |
| **Photo**    | Headshot. Add alt text (e.g. "Chris Malzone, Principal Consultant").           |
| **Short bio** | One or two sentences for cards and bylines.                                   |
| **Full bio** | Longer biography (supports paragraphs, bold/italic, and links).                |
| **Email / LinkedIn / Website** | Optional contact + social links.                             |

To use a team member as an article byline: open the insight → **Author (team member)** → select the person. Their name + role replace the free-text Author line.

Publish when done.

---

## 6. Working with images

### Uploading

Click any image field → **Upload** → drop or select a file. Sanity dedupes by content hash, so re-uploading the same image is free.

Supported formats: JPG / PNG / WebP / SVG. Sanity converts to optimized formats on the fly when the site requests them.

### Alt text (critical)

Every image asks for **Alt text**. Required for:
- Accessibility (screen readers)
- SEO (Google reads it as image context)

Write what the image **shows**, not "an image of …". Examples:
- ✅ "AnchorBot ROV pulling a helical anchor at Sequim Bay"
- ❌ "Image of underwater robot"

### Hotspot and crop

Click into an uploaded image → you'll see a **Hotspot** tool with a draggable circle. This tells the site where the **important part** of the image is, so that when it's cropped to different aspect ratios (square card, 16:9 hero, etc.) it stays composed.

Drag the dot to the focal point (a face, a key feature, the ROV) and Sanity remembers. You rarely need to touch this — Sanity defaults are usually fine.

### Where to upload files vs. paste a URL

- **Cover images, hero images, figures, partner headers, selling-point icons** — upload directly into Sanity. They live on Sanity's CDN and the web site reads them from `cdn.sanity.io`.
- **PDFs and external media** — for PDFs hosted on R2/S3, just paste the URL into the `pdfUrl` field. For PDFs under `apps/web/public/assets/`, use the relative path (`/assets/insights/foo.pdf`).

### File size

There's no hard cap, but for performance:
- Cover/hero images: ~1600px wide, ~500 KB
- Inline figures: ~1200px wide
- Icons: ~400px or smaller

Sanity will resize on the fly; you can upload originals freely.

---

## 7. SEO fields

The `seo` block appears on every Insight and Partner, and as `seoDefaults` on Site settings. Same fields everywhere:

| Field             | What it does                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------- |
| **Meta title**    | The `<title>` tag in search results. Falls back to the document title.                      |
| **Meta description** | The blurb under the title in Google. Falls back to the excerpt.                          |
| **Keywords**      | Tags array. Mostly cosmetic now — Google ignores keyword meta tags — but Bing still uses it. |
| **Social share image** | The 1200×630 image that shows when the URL is pasted into LinkedIn/Twitter/Slack. Falls back to the cover image. |
| **Hide from search engines** | Toggle to add `noindex` — keep off unless you genuinely want this page invisible. |
| **Canonical URL** | Only set this if the page is a duplicate of another page (e.g. mirrored content). Almost always leave blank. |

Rule of thumb: **only fill in what's different from the defaults**. Empty fields cascade to sensible fallbacks.

---

## 8. Reordering insights and partners

The Insights and Partners lists support **drag-to-reorder**.

1. Click the section in the sidebar.
2. Hover over any document — a grip handle appears on the left.
3. Drag to reorder. Sanity saves the order automatically.

This controls how items show up in the studio AND on the site's listings.

If you don't see the grip handles, refresh the page once — the orderable plugin sometimes needs a second to attach.

---

## 9. Drafts, publishing, and undo

| Action                     | How                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------- |
| **Save a draft**           | Edits autosave continuously. The yellow dot indicates an unpublished draft exists. |
| **Publish**                | Top-right **Publish** button. Promotes the draft to live.                          |
| **Discard a draft**        | Top-right action menu (⋯) → **Discard changes**. The published version stays.      |
| **Unpublish**              | Action menu → **Unpublish**. Hides from the site but keeps the document.           |
| **Delete**                 | Action menu → **Delete**. Permanent. Use carefully.                                |
| **Restore a previous version** | Action menu → **Review changes** → roll back to any prior published state.    |
| **Schedule a publish**     | Action menu → **Schedule** → pick a future date/time. Useful for embargoed reports. |

The site reads the **published** version. Drafts are studio-only.

---

## 10. When something looks wrong

| Symptom                                              | Likely cause                                                                  | Fix                                                                              |
| ---------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Studio won't load — "CORS error" in browser console   | The studio domain isn't in Sanity's CORS allowlist                             | manage.sanity.io → project → API → add `https://studio.beringia-marine.com` with credentials |
| Studio loads but shows "Insufficient permissions"    | Your account isn't a project member                                            | Invite yourself at https://www.sanity.io/manage/project/l183gjut/members         |
| Image preview is broken on the site                  | Missing alt text or asset is still uploading                                   | Open the image field; ensure alt text is set; save and republish                 |
| Published an insight but it's not on the site        | The site's revalidation interval is 60s — wait a minute and refresh            | If still missing after 5 min, check the slug matches what the URL expects        |
| Slug changed after publish; old URL 404s             | Slug is part of the URL — changing it breaks inbound links                     | Either revert the slug, or add a redirect in `apps/web` (talk to dev)            |
| Validation error blocks publish                      | A required field is empty (red asterisk in the form)                            | Scroll through, fill in the highlighted fields, try again                        |
| Body editor feels laggy on huge articles             | Articles with 100+ blocks (long white papers) can slow the editor              | Save often, refresh occasionally; doesn't affect the live site                   |
| Need to bulk-import several insights                 | Studio is one-at-a-time                                                        | Re-run `pnpm seed` if importing from `apps/web/src/lib/content/`; otherwise drop new entries into the static registry first and seed |

---

## 11. Cheat sheet

- **Slug = URL**. Don't change it after publishing.
- **Alt text on every image.** Always.
- **Excerpt drives previews** — write it for the article hero AND the Google snippet.
- **Status field on partners** — `Active` only is what shows on the site.
- **Featured toggle** — use sparingly; means "surface prominently."
- **Drafts are invisible to the public.** Publish to go live.
- **Cover image = 1600px wide, alt text required** is the recipe for every insight.
- **Vision tool** (top toolbar) is the GROQ query playground — useful for inspecting what the site is actually reading.

If something doesn't make sense or seems missing, ping the developer — phase 2 will add author profiles, listing-page Sanity wiring, and richer figure layouts.
