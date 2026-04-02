# ArticleContent Component

## Overview

The `ArticleContent` component renders the main body content of an article with rich HTML formatting, proper typography, and responsive design. It supports all standard HTML elements with custom styling that matches the Vital Ice brand identity.

## Features

- **Rich HTML Content**: Renders article content with `dangerouslySetInnerHTML`
- **Comprehensive Element Styling**: Supports h2-h4, paragraphs, lists, links, images, tables, blockquotes, code blocks, and more
- **Responsive Typography**: Fluid font sizes and spacing that adapt to screen size
- **Table Responsiveness**: Horizontal scrolling on mobile with custom scrollbar styling
- **Figure Support**: Styled figure elements with images and captions
- **PDF Download**: Optional bottom PDF download button
- **Accessibility**: WCAG 2.1 AA compliant with proper focus indicators and reduced motion support
- **Print Styles**: Optimized for printing

## Usage

```tsx
import ArticleContent from '@/components/insights/ArticleContent/ArticleContent';
import { ArticleData } from '@/types/insights';

export default function ArticlePage({ article }: { article: ArticleData }) {
  return <ArticleContent article={article} />;
}
```

## Props

| Prop      | Type          | Required | Description                                    |
| --------- | ------------- | -------- | ---------------------------------------------- |
| `article` | `ArticleData` | Yes      | Article data object containing content and PDF |

## Styled HTML Elements

### Headings

- `<h2>`: Main section headings (Bebas Neue, uppercase)
- `<h3>`: Subsection headings (Bebas Neue, uppercase)
- `<h4>`: Minor headings (Montserrat, sentence case)

### Text Elements

- `<p>`: Paragraphs with proper line height (1.8)
- `<strong>`: Bold text with increased weight
- `<em>`: Italic text
- `<a>`: Links with Vital Ice primary color and external link indicator

### Lists

- `<ul>`: Unordered lists with disc bullets
- `<ol>`: Ordered lists with decimal numbering
- `<li>`: List items with proper spacing
- Nested lists with different bullet styles

### Media

- `<figure>`: Container for images with captions
- `<img>`: Images with rounded corners and shadows
- `<figcaption>`: Image captions with italic styling

### Tables

- `<table>`: Full-width tables with glassmorphism effect
- `<thead>`: Table headers with Vital Ice accent color
- `<tbody>`: Table body with hover effects
- `<th>`: Header cells with uppercase text
- `<td>`: Data cells with proper padding
- Horizontal scrolling on mobile devices

### Other Elements

- `<blockquote>`: Quoted text with left border accent
- `<pre>`: Code blocks with dark background
- `<code>`: Inline code with Vital Ice accent background
- `<hr>`: Horizontal rules with gradient effect

## Styling

The component uses CSS modules with the following key features:

- **Typography**: Montserrat for body text, Bebas Neue for headings
- **Color Scheme**: White text on dark background with Vital Ice accents
- **Spacing**: Generous margins and padding for readability
- **Responsive**: Breakpoints at 768px and 480px
- **Accessibility**: Reduced motion support, focus indicators, print styles

## Responsive Behavior

### Desktop (> 768px)

- Font size: 1.0625rem (17px)
- Line height: 1.8
- Full-width tables
- Standard spacing

### Tablet (≤ 768px)

- Font size: 1rem (16px)
- Line height: 1.75
- Reduced margins and padding
- Full-width PDF button

### Mobile (≤ 480px)

- Font size: 0.9375rem (15px)
- Compact spacing
- Smaller table text
- Horizontal scrolling for tables

## Accessibility Features

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Indicators**: Visible focus outlines on links and buttons
- **ARIA Labels**: Descriptive labels for PDF download button
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **Color Contrast**: WCAG 2.1 AA compliant contrast ratios
- **Semantic HTML**: Proper heading hierarchy for screen readers

## PDF Download

If the article has a `pdfUrl`, a download button appears at the bottom of the content:

```tsx
{
  article.pdfUrl && (
    <button onClick={handlePdfDownload} className={styles.content__pdfButton}>
      Download PDF
    </button>
  );
}
```

The button opens the PDF in a new tab with `noopener,noreferrer` for security.

## Content Guidelines

When creating article content, follow these guidelines:

1. **Heading Hierarchy**: Use h2 for main sections, h3 for subsections, h4 for minor headings
2. **Paragraphs**: Keep paragraphs concise (3-5 sentences)
3. **Lists**: Use lists for enumerated items or steps
4. **Images**: Always include alt text and use figure/figcaption for context
5. **Tables**: Keep tables simple; they scroll horizontally on mobile
6. **Links**: Use descriptive link text; external links get an arrow indicator
7. **Code**: Use `<code>` for inline code, `<pre><code>` for code blocks

## Example HTML Content

```html
<h2>Introduction to Cold Therapy</h2>
<p>
  Cold plunge therapy has been used for centuries to enhance recovery and boost mental clarity.
  Recent research has validated many of these traditional practices.
</p>

<h3>Key Benefits</h3>
<ul>
  <li>Reduced inflammation and muscle soreness</li>
  <li>Improved circulation and cardiovascular health</li>
  <li>Enhanced mental resilience and mood</li>
</ul>

<figure>
  <img src="/images/cold-plunge.jpg" alt="Person in cold plunge pool" />
  <figcaption>Cold plunge therapy at Vital Ice</figcaption>
</figure>

<h3>Scientific Evidence</h3>
<p>
  Studies have shown that cold exposure triggers the release of
  <strong>norepinephrine</strong>, which can improve focus and attention.
</p>

<table>
  <thead>
    <tr>
      <th>Temperature</th>
      <th>Duration</th>
      <th>Benefits</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>50-59°F</td>
      <td>2-5 min</td>
      <td>Beginner-friendly recovery</td>
    </tr>
    <tr>
      <td>39-49°F</td>
      <td>1-3 min</td>
      <td>Advanced cold adaptation</td>
    </tr>
  </tbody>
</table>
```

## Related Components

- `ArticleHero`: Displays article metadata and hero section
- `ArticleCard`: Card component for article listings
- `InsightsPageClient`: Main insights listing page

## Requirements Satisfied

- **3.2**: Render HTML content with proper styling
- **3.5**: Style all HTML elements (headings, paragraphs, lists, etc.)
- **4.7**: Ensure proper heading hierarchy for SEO
- **5.4**: Responsive design for mobile devices
- **5.6**: Table horizontal scrolling on mobile
- **9.2**: Implement proper typography with Vital Ice fonts
- **9.3**: Add responsive spacing and line heights
