# SEO Agency Guide: Working with Sanity Studio

Complete guide for SEO professionals to edit SEO metadata and content in the Vital Ice Sanity Studio.

---

## 🔐 Access Information

### Studio URL

**Production Studio:**

```
https://studio.vitalicesf.com
```

### Login Credentials

You will receive login credentials separately. The Studio uses a custom login screen (not browser Basic Auth).

**Note:** If you see a login page, enter your credentials. If you're redirected to a login page after accessing a protected route, that's expected behavior.

---

## 📋 What You Can Edit

As an SEO agency, you have access to edit SEO metadata for the following content types:

### 1. **Pages** (`/pages`)

- SEO title, meta description, keywords
- Open Graph (OG) tags for social media
- Twitter Card metadata
- Canonical URLs
- No-index settings

### 2. **Articles** (`/articles`)

- All SEO fields (same as Pages)
- Article-specific metadata
- Publication status and dates

### 3. **Services** (`/services`)

- SEO metadata for service pages
- Service descriptions and content

### 4. **Global Settings** (`/globalSettings`)

- Default SEO settings (fallback values)
- Site-wide SEO configuration

---

## 🎯 Step-by-Step: Editing SEO Fields

### Editing a Page's SEO Settings

1. **Navigate to the Studio:**
   - Go to `https://studio.vitalicesf.com`
   - Log in with your credentials

2. **Find the Page:**
   - Click **"Pages"** in the left sidebar
   - Search for the page by title or slug
   - Click on the page to open it

3. **Locate SEO Settings:**
   - Scroll down to the **"SEO Settings"** section
   - Click to expand it

4. **Edit SEO Fields:**

   **SEO Title** (Required for best results):
   - Maximum 60 characters (you'll see a warning if over)
   - Appears in search results and browser tabs
   - Should be unique and descriptive
   - Include primary keyword near the beginning

   **Meta Description**:
   - Maximum 160 characters (you'll see a warning if over)
   - Appears in search results below the title
   - Write compelling copy that encourages clicks
   - Include a call-to-action when appropriate

   **Keywords** (Optional):
   - Click **"Add item"** to add keywords
   - Type keyword and press Enter
   - Modern SEO focuses more on content quality than keywords
   - Use sparingly (5-10 relevant keywords max)

5. **Social Media Settings (Open Graph):**

   **OG Title:**
   - Title for social media sharing
   - Falls back to SEO Title if empty
   - Can be different from SEO title (more engaging for social)

   **OG Description:**
   - Description for social media sharing
   - Falls back to Meta Description if empty
   - Can be more conversational than SEO description

   **OG Image:**
   - Click **"Select"** or **"Upload"** to add an image
   - **Recommended size:** 1200x630 pixels
   - This is what appears when the page is shared on Facebook, LinkedIn, etc.
   - Use high-quality, relevant images

6. **Twitter Card Settings:**

   **Twitter Title:**
   - Falls back to OG Title if empty
   - Can be optimized for Twitter's character limits

   **Twitter Description:**
   - Falls back to OG Description if empty

   **Twitter Image:**
   - **Recommended size:** 1200x600 pixels
   - Falls back to OG Image if empty
   - Can be different from OG image if needed

7. **Advanced Settings:**

   **Hide from Search Engines (noIndex):**
   - ✅ Check this box to prevent search engines from indexing the page
   - Use for staging pages, private content, or duplicate content
   - ⚠️ **Warning:** This will remove the page from search results

   **Canonical URL:**
   - Use if this page has duplicate content elsewhere
   - Enter the preferred URL (e.g., `https://vitalicesf.com/about`)
   - Helps prevent duplicate content penalties

8. **Save Your Changes:**
   - Click **"Publish"** in the top-right corner
   - Changes go live immediately (see "Publishing Changes" below)

### Editing Article SEO

Articles follow the same process as Pages:

1. Click **"Articles"** in the sidebar
2. Find and open the article
3. Scroll to **"SEO Settings"** section
4. Edit all SEO fields as described above
5. **Important:** Check the article's **"Status"** field:
   - **Draft:** Not visible on website
   - **Published:** Visible on website
   - **Scheduled:** Will publish at a specific date/time
   - **Archived:** Hidden from website

6. Click **"Publish"** to save

### Editing Service SEO

1. Click **"Services"** in the sidebar
2. Find and open the service
3. Scroll to **"SEO Settings"** section
4. Edit SEO fields (same as Pages)
5. Click **"Publish"** to save

### Editing Global SEO Defaults

1. Click **"Global Settings"** in the sidebar
2. Open the settings document
3. Scroll to **"Default SEO Settings"**
4. These are fallback values used when a page doesn't have its own SEO settings
5. Click **"Publish"** to save

---

## ✅ SEO Best Practices

### SEO Title Guidelines

- ✅ **Keep it under 60 characters** (Google typically shows 50-60)
- ✅ **Include primary keyword** near the beginning
- ✅ **Make it unique** for each page
- ✅ **Write for humans** (not just keywords)
- ✅ **Include brand name** when appropriate (e.g., "Cold Plunge Therapy | Vital Ice SF")
- ❌ Avoid keyword stuffing
- ❌ Don't use all caps
- ❌ Don't duplicate titles across pages

**Example Good Titles:**

- "Cold Plunge Therapy in San Francisco | Vital Ice SF"
- "About Us - San Francisco's Premier Recovery Center"
- "Infrared Sauna Benefits: Complete Guide 2025"

### Meta Description Guidelines

- ✅ **Keep it under 160 characters** (Google typically shows 120-160)
- ✅ **Include primary keyword** naturally
- ✅ **Write compelling copy** that encourages clicks
- ✅ **Include a call-to-action** when appropriate
- ✅ **Make it unique** for each page
- ❌ Don't duplicate descriptions
- ❌ Don't use quotes (they can break display)
- ❌ Don't keyword stuff

**Example Good Descriptions:**

- "Experience the benefits of cold plunge therapy at Vital Ice SF. Professional recovery services in San Francisco. Book your session today."
- "Learn about Vital Ice SF, San Francisco's premier recovery and wellness center. Expert cold therapy, sauna, and compression services."

### Open Graph Image Guidelines

- ✅ **Size:** 1200x630 pixels (1.91:1 aspect ratio)
- ✅ **File size:** Under 1MB (optimize images)
- ✅ **Format:** JPG or PNG
- ✅ **High quality:** Clear, professional images
- ✅ **Include text overlay** if it helps convey the message
- ✅ **Brand consistent:** Use images that match your brand
- ❌ Don't use tiny images (they'll look pixelated)
- ❌ Don't use images with important text in the corners (may be cropped)

### Keywords Guidelines

- ✅ **Use 5-10 relevant keywords** maximum
- ✅ **Focus on user intent** (what are people searching for?)
- ✅ **Include location** when relevant (e.g., "cold plunge san francisco")
- ✅ **Use long-tail keywords** when appropriate
- ❌ Don't keyword stuff (20+ keywords)
- ❌ Don't use irrelevant keywords
- ❌ Don't duplicate keyword lists across pages

**Example Good Keyword Sets:**

- `["cold plunge", "cold therapy", "recovery", "san francisco", "wellness"]`
- `["infrared sauna", "sauna benefits", "detox", "relaxation", "sf"]`

### Canonical URL Guidelines

- ✅ **Use when you have duplicate content** on multiple URLs
- ✅ **Point to the preferred version** (usually the main domain)
- ✅ **Use absolute URLs** (include `https://`)
- ❌ Don't set canonical URLs unnecessarily
- ❌ Don't point to a different domain unless it's intentional

**Example:**

- If you have `vitalicesf.com/about` and `vitalicesf.com/about-us` with the same content
- Set canonical on both to: `https://vitalicesf.com/about` (the preferred version)

---

## 🚀 Publishing Changes

### How Publishing Works

1. **Make your edits** in the Studio
2. **Click "Publish"** button (top-right corner)
3. **Changes go live immediately** via webhook
4. **Website updates within seconds** (no manual deployment needed)

### Publishing Status

- **Published:** Content is live on the website
- **Draft:** Content exists but is not visible on the website
- **Scheduled:** Content will automatically publish at a specific date/time

### Important Notes

- ✅ **No need to "deploy"** - changes are instant
- ✅ **Webhook automatically updates** the website
- ✅ **You can preview drafts** before publishing
- ⚠️ **Double-check before publishing** - changes are immediate
- ⚠️ **Unpublishing** requires changing status back to "Draft"

### Unpublishing Content

To remove content from the website:

1. Open the document
2. Change **"Status"** to **"Draft"** (or **"Archived"**)
3. Click **"Publish"**
4. Content is immediately removed from the website

---

## 🔍 Verifying Changes

### After Publishing

1. **Wait 5-10 seconds** for the webhook to process
2. **Visit the page** on the live website
3. **View page source** (Right-click → "View Page Source")
4. **Search for your SEO title** (Ctrl+F / Cmd+F)
5. **Check meta tags** in the `<head>` section

### Using SEO Tools

You can verify SEO changes using:

- **Google Search Console:** Check how the page appears in search results
- **Facebook Sharing Debugger:** Test Open Graph tags
  - URL: `https://developers.facebook.com/tools/debug/`
- **Twitter Card Validator:** Test Twitter cards
  - URL: `https://cards-dev.twitter.com/validator`
- **Browser Extensions:** Use SEO extensions like "SEO META in 1 CLICK"

### Common Issues

**Changes not appearing?**

- Wait 10-30 seconds (webhook processing time)
- Hard refresh the page (Ctrl+Shift+R / Cmd+Shift+R)
- Clear browser cache
- Check that you clicked "Publish" (not just saved as draft)

**SEO title/description not showing in search results?**

- Google may take days/weeks to re-crawl and update
- Use Google Search Console to request re-indexing
- Check that the page is not set to "noIndex"

---

## 📝 Content Types Reference

### Pages

- **Location:** `/pages` in Studio sidebar
- **URL Format:** `https://vitalicesf.com/{slug}`
- **SEO Fields:** Full SEO settings available
- **Use For:** Static pages (About, Contact, etc.)

### Articles

- **Location:** `/articles` in Studio sidebar
- **URL Format:** `https://vitalicesf.com/insights/{slug}`
- **SEO Fields:** Full SEO settings + article-specific metadata
- **Use For:** Blog posts, news, insights

### Services

- **Location:** `/services` in Studio sidebar
- **URL Format:** `https://vitalicesf.com/services/{slug}`
- **SEO Fields:** Full SEO settings
- **Use For:** Service pages (Cold Plunge, Sauna, etc.)

### Global Settings

- **Location:** `/globalSettings` in Studio sidebar
- **SEO Fields:** Default SEO settings (fallback values)
- **Use For:** Site-wide defaults when pages don't have their own SEO

---

## 🆘 Troubleshooting

### Can't Log In

- **Check credentials:** Verify username/password are correct
- **Clear browser cache:** Sometimes login cookies get corrupted
- **Try incognito/private window:** Rules out browser extension issues
- **Contact support:** If issues persist

### Changes Not Saving

- **Check internet connection:** Studio requires active connection
- **Refresh the page:** Sometimes the Studio needs a refresh
- **Check for errors:** Look for red error messages in the Studio
- **Try again:** Sometimes Sanity API has temporary issues

### Can't Find a Page/Article

- **Use search:** Type the page title or slug in the search bar
- **Check filters:** Make sure you're not filtering by status
- **Check all content types:** Page might be in Articles instead of Pages
- **Ask for help:** Content might be in a different location

### SEO Fields Not Showing

- **Scroll down:** SEO Settings section might be below the fold
- **Expand the section:** Click on "SEO Settings" to expand it
- **Check document type:** Some content types might not have SEO fields
- **Verify permissions:** Contact admin if fields are missing

### Images Not Uploading

- **Check file size:** Keep images under 10MB
- **Check file format:** Use JPG, PNG, or WebP
- **Check internet:** Large uploads require stable connection
- **Try smaller image:** Resize if file is too large

---

## 📞 Support & Questions

### Getting Help

If you encounter issues or have questions:

1. **Check this guide first** - Most common issues are covered
2. **Check Sanity documentation** - `https://www.sanity.io/docs`
3. **Contact the development team** - For technical issues
4. **Contact the client** - For content approval or business questions

### Common Questions

**Q: How long do changes take to appear?**
A: Changes appear on the website within 5-30 seconds after publishing. Search engines may take days/weeks to update.

**Q: Can I undo changes?**
A: Yes, you can edit and republish. Sanity also keeps a version history (ask admin about accessing it).

**Q: Can I schedule content to publish later?**
A: Yes, for Articles you can set status to "Scheduled" and choose a publish date/time.

**Q: Do I need to edit every page individually?**
A: Yes, each page has its own SEO settings. Global Settings provide defaults, but individual pages override them.

**Q: What if I make a mistake?**
A: Simply edit the content again and republish. Changes are immediate and reversible.

---

## 🎓 Quick Reference Checklist

### Before Publishing SEO Changes

- [ ] SEO Title is under 60 characters
- [ ] Meta Description is under 160 characters
- [ ] Title and description are unique (not duplicated)
- [ ] Primary keyword is included naturally
- [ ] OG Image is 1200x630px (if using)
- [ ] Twitter Image is 1200x600px (if different from OG)
- [ ] No-index is unchecked (unless intentionally hiding page)
- [ ] Canonical URL is set (only if needed)
- [ ] Content is proofread
- [ ] Status is set to "Published" (not "Draft")

### After Publishing

- [ ] Wait 10-30 seconds
- [ ] Visit the live page
- [ ] View page source to verify meta tags
- [ ] Test with Facebook Sharing Debugger (if OG tags were changed)
- [ ] Test with Twitter Card Validator (if Twitter tags were changed)
- [ ] Request re-indexing in Google Search Console (optional)

---

## 📚 Additional Resources

- **Sanity Studio Documentation:** `https://www.sanity.io/docs/studio`
- **SEO Best Practices:** Google's SEO Starter Guide
- **Open Graph Protocol:** `https://ogp.me/`
- **Twitter Cards:** `https://developer.twitter.com/en/docs/twitter-for-websites/cards`

---

**Last Updated:** January 2025  
**Studio Version:** Sanity Studio v3  
**Website:** `https://vitalicesf.com`
