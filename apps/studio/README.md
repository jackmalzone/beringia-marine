# Beringia Marine Studio

This is the **content editor** for the Beringia Marine website. Sign in here to write insights, manage partner pages, edit the team, and update site-wide settings — no code required. Changes you publish appear on beringia-marine.com within about a minute.

> **New here? Start with the 10-minute tutorial below.** For a field-by-field reference, see **[AUTHORING.md](./AUTHORING.md)**.

---

## Tutorial — your first 10 minutes

### 1. Open the studio and sign in
- **Live:** go to `https://studio.beringia-marine.com`
- **On your computer (for developers):** see [Running it locally](#running-it-locally) below

Sign in with the email that was invited to the project. If you see “insufficient permissions,” you need to be added as a member — ask whoever set up the project, or add yourself at [manage.sanity.io](https://www.sanity.io/manage/project/l183gjut/members).

### 2. Get your bearings
The left sidebar is your content. There are four things:

| Sidebar item | What it is |
| --- | --- |
| **Site settings** | One-of-a-kind: business info, social links, default SEO. Edit it, never recreate it. |
| **Insights** | Articles, white papers, case studies, field reports → pages at `/insights/…` |
| **Partners** | Solution partner profiles (Anchorbot, Mission Robotics, …) → pages at `/solutions/…` |
| **Team** | People on the team → used on the About page and as article authors |

Click any item to see the list; click a document to open its editor.

### 3. Publish your first insight
1. Click **Insights** → **+ Create new** (top right).
2. The form is split into tabs: **Content**, **Details & metadata**, **SEO & sharing**. Start in **Content** and work top to bottom.
3. Every field has a grey description under it explaining exactly what it does and where it shows up — read those as you go. The essentials:
   - **Title** — the headline.
   - **Slug** — click **Generate** to make the URL from the title.
   - **Category** + **Content type** — pick from the options (descriptions explain each).
   - **Excerpt** — a one-paragraph summary (this is the card blurb *and* the Google description).
   - **Cover image** — upload a landscape image and **always fill in the alt text**.
   - **Body** — write the article. Use the style dropdown for **H2/H3** headings; highlight text to **bold**/link it; click **+** to insert a **Figure** (image + caption).
4. Fill **Published date** under the **Details & metadata** tab.
5. Click **Publish** (top right). Done — it’s live in ~1 minute.

> **Tip:** Anything you type is auto-saved as a *draft* (a yellow dot marks unpublished changes). Drafts are invisible to the public until you hit **Publish**.

### 4. Make an edit and re-publish
Open any document, change something, and the **Publish** button lights up. Click it to push the change live. To throw away unpublished edits, use the **⋯** menu → **Discard changes**.

### 5. Reorder a list
In **Insights**, **Partners**, or **Team**, hover a row to get a drag handle on the left and drag to reorder. The order saves automatically and controls how items appear on the site.

That’s the whole workflow. Everything else is detail — and every field tells you what it does.

---

## The three content types at a glance

- **Insight** — a single published piece. Tabs: *Content* (title, excerpt, cover, body…), *Details & metadata* (tags, reading time, dates, PDF link, feature toggle), *SEO & sharing*.
- **Partner** — a solution profile. Tabs: *Overview* (name, tagline, header, logo, intro), *Features* (selling points, use cases, value proposition), *Media & links* (gallery, demo video, 3D model, connect links, documents), *Settings & SEO* (status, featured, SEO).
- **Team member** — name, role, photo, short + full bio, contact links. Selectable as an article author from an Insight’s **Author (link a team member)** field.

Full field-by-field walkthrough: **[AUTHORING.md](./AUTHORING.md)**.

---

## A few rules worth remembering

- **Alt text on every image.** It’s how screen readers and Google understand the picture.
- **Don’t change a slug after publishing** — it’s the URL, and old links will break.
- **The excerpt does double duty** — it’s both the listing blurb and the search-result description, so write it for someone who hasn’t opened the page.
- **Drafts are private; Publish makes things live.**
- **Partner “Status” = Active** is what shows on the site (Draft/Archived stay hidden).

---

## Running it locally (developers)

```bash
pnpm install
cp .env.example .env.local              # fill in the Sanity token
pnpm --filter @beringia/studio dev      # serves at http://localhost:3333
```

### Importing the existing static content (one-time)

```bash
pnpm seed:dry   # preview — no writes
pnpm seed       # import insights + partners into the dataset
```

Idempotent (safe to re-run). Needs `SANITY_API_AGENT_TOKEN` (Editor scope) in `.env.local`. See [DEPLOY.md](./DEPLOY.md) for hosting + CORS setup.

## Content model (for developers)

- `insight` — articles, white papers, case studies, field reports (Portable Text body)
- `partner` — solution partner pages incl. logo, media links, gallery, demo video, Sketchfab 3D model
- `teamMember` — team (About page + optional insight authors)
- `siteSettings` (singleton) — business info, social links, SEO defaults, analytics
