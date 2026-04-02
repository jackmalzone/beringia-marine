# New Post Template

Use this template when sharing a new post to add to the insights blog. Fill in all the required fields and provide the content.

## Required Information

### Basic Details

- **Title:** (50-70 characters, include primary keyword)
- **Subtitle:** (70-100 characters, expands on title)
- **Abstract:** (2-3 sentences, 150-200 characters, compelling summary)
- **Category:** (Wellness Article | Recovery Guide | Research Summary | Community Story)
- **Author:** (Author name or "Vital Ice Team")
- **Publish Date:** (YYYY-MM-DD format, e.g., 2025-01-25)
- **Status:** (draft | published | scheduled)
- **Slug:** (URL-friendly, lowercase, hyphens, e.g., "my-article-title")

### Images

- **Cover Image URL:** (Minimum 1200x630px, hosted on CDN)
- **Hero Image URL (optional):** (For article hero section)
- **Hero Image Split (optional):** 
  - Left image URL:
  - Right image URL:
- **In-Content Images:** (List any images to include in content with alt text)

### Tags

- **Tags:** (3-6 relevant tags, e.g., ["Cold Therapy", "Recovery", "Wellness"])

### Content

- **Content:** (Full HTML content - see formatting guidelines below)

### Optional Fields

- **Reading Time:** (Estimated minutes, or leave blank for auto-calculation)
- **SEO Title:** (Custom SEO title if different from article title)
- **SEO Description:** (Custom meta description if different from abstract)
- **SEO OG Image:** (Custom Open Graph image if different from cover image)
- **PDF URL:** (Link to downloadable PDF version, if applicable)
- **Scheduled Publish Time:** (ISO 8601 format if status is "scheduled", e.g., "2025-01-25T08:00:00Z")

## Content Formatting Guidelines

### HTML Structure

Your content should be valid HTML with proper structure:

```html
<h2>Main Section Heading</h2>
<p>Paragraph text here. Keep paragraphs focused (3-5 sentences).</p>

<h3>Subsection Heading</h3>
<p>More detailed content.</p>

<ul>
  <li>List item one</li>
  <li>List item two</li>
</ul>

<figure>
  <img src="image-url.jpg" alt="Descriptive alt text" />
  <figcaption>Caption that adds context</figcaption>
</figure>

<h2>Another Main Section</h2>
<p>More content...</p>
```

### Important Rules

1. **Headings:** Start with `<h2>` (h1 is reserved for article title), then `<h3>`, then `<h4>`. Never skip levels.
2. **Images:** Always use `<figure>` with `<img>` and `<figcaption>`. Include descriptive `alt` text.
3. **Links:** Use descriptive link text. For external links, add `target="_blank" rel="noopener noreferrer"`.
4. **Lists:** Use `<ul>` for unordered lists, `<ol>` for ordered lists.
5. **Emphasis:** Use `<strong>` for important text, `<em>` for emphasis.

### Example Content Structure

```html
<h2>Introduction</h2>
<p>Opening paragraph that hooks the reader and introduces the topic.</p>

<h2>Main Section</h2>
<p>Content that explores the topic in depth.</p>

<h3>Subsection</h3>
<p>More detailed information about a specific aspect.</p>

<figure>
  <img src="https://media.vitalicesf.com/insights/example.jpg" alt="Person doing cold plunge therapy" />
  <figcaption>Cold plunge therapy activates multiple physiological systems</figcaption>
</figure>

<ul>
  <li>Key point one</li>
  <li>Key point two</li>
  <li>Key point three</li>
</ul>

<h2>Practical Application</h2>
<p>How readers can apply this information.</p>

<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>

<h2>Conclusion</h2>
<p>Summary and call to action. <a href="/experience">Visit Vital Ice</a> to try it yourself.</p>
```

## Quick Checklist

Before sharing your post, ensure:

- [ ] Title is 50-70 characters
- [ ] Subtitle is 70-100 characters
- [ ] Abstract is 150-200 characters
- [ ] Content starts with `<h2>` (not `<h1>`)
- [ ] All images have descriptive alt text
- [ ] All links have descriptive text (no "click here")
- [ ] Proper heading hierarchy (h2 → h3 → h4)
- [ ] 3-6 relevant tags selected
- [ ] Cover image is at least 1200x630px
- [ ] Slug is URL-friendly (lowercase, hyphens)
- [ ] Publish date is in YYYY-MM-DD format

## Example Post

Here's a complete example:

```markdown
Title: The Science Behind Cold Plunge Therapy
Subtitle: Understanding the physiological benefits of cold exposure
Abstract: Discover how cold plunge therapy triggers powerful physiological responses that enhance recovery, boost mental clarity, and build resilience. Learn about the science-backed benefits of controlled cold exposure.
Category: Research Summary
Author: Vital Ice Team
Publish Date: 2025-01-25
Status: published
Slug: science-behind-cold-plunge-therapy
Cover Image: https://media.vitalicesf.com/insights/cold-plunge-science.jpg
Tags: ["Cold Therapy", "Recovery", "Science", "Mental Health"]

Content:
<h2>Introduction to Cold Therapy</h2>
<p>Cold plunge therapy has been used for centuries across various cultures...</p>

<h2>The Physiological Response</h2>
<p>When you immerse yourself in cold water, your body initiates...</p>

<figure>
  <img src="https://media.vitalicesf.com/insights/cold-plunge-science.jpg" alt="Person practicing cold plunge therapy" />
  <figcaption>Cold plunge therapy activates multiple physiological systems</figcaption>
</figure>

<h2>Conclusion</h2>
<p>Cold plunge therapy represents a powerful intersection...</p>
```

## Ready to Share?

Once you've filled out this template, share it with me and I'll:
1. Format the content according to guidelines
2. Add it to the `mockArticles` array
3. Ensure proper HTML structure and accessibility
4. Verify SEO metadata and image requirements
5. Make it live on the site!

