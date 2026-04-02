# Portable Text Spacing Guide for Sanity Studio

## How Spacing Works in Portable Text

In Sanity Studio's Portable Text editor, **each paragraph is a separate block**. Here's how spacing translates:

### ✅ Correct: One Enter = One Paragraph Break

**In Sanity Studio:**

```
Paragraph one.

Paragraph two.
```

**How it works:**

- Press **Enter once** → Creates a new paragraph block
- This creates proper spacing between paragraphs (typically 1em/16px margin)
- This is the **standard and recommended** approach

**Renders as:**

```html
<p>Paragraph one.</p>
<p>Paragraph two.</p>
```

### ❌ Avoid: Multiple Empty Lines

**In Sanity Studio:**

```
Paragraph one.


Paragraph two.
```

**What happens:**

- Pressing Enter multiple times creates empty blocks
- Empty blocks may or may not render (depends on frontend implementation)
- Can create inconsistent spacing
- **Not recommended** - stick to one Enter between paragraphs

### 📝 Best Practice

**For normal paragraph spacing:**

1. Type your paragraph
2. Press **Enter once** to create a new paragraph
3. Type the next paragraph
4. Repeat

**Example:**

```
This is the first paragraph.

This is the second paragraph.

This is the third paragraph.
```

Each Enter creates a new `<p>` tag, which will have proper spacing in the rendered output.

## Spacing Between Sections

### Headings

**In Sanity Studio:**

```
Paragraph before heading.

## Heading

Paragraph after heading.
```

**How it works:**

- Headings are separate blocks
- One Enter before and after headings is sufficient
- The frontend CSS handles heading spacing (typically more space above/below headings)

### Lists

**In Sanity Studio:**

```
Paragraph before list.

- List item one
- List item two

Paragraph after list.
```

**How it works:**

- Lists are separate blocks
- One Enter before and after lists is sufficient
- Lists have their own spacing rules

## Visual Guide

### ✅ Good Spacing Pattern

```
Paragraph one text here.

Paragraph two text here.

## Section Heading

Paragraph three text here.

- List item
- Another item

Paragraph four text here.
```

**Result:** Clean, consistent spacing throughout

### ❌ Avoid This Pattern

```
Paragraph one text here.


Paragraph two text here.


## Section Heading


Paragraph three text here.
```

**Result:** Inconsistent spacing, potential empty blocks

## Technical Details

### How Blocks Work

- Each **Enter** creates a new block with `_type: 'block'`
- Empty blocks (just whitespace) may be filtered out by the frontend
- The frontend CSS controls the actual visual spacing between blocks

### Frontend Rendering

Your frontend likely uses `@portabletext/react` or similar, which:

- Converts each block to a `<p>` tag (for normal paragraphs)
- Converts headings to `<h2>`, `<h3>`, etc.
- Applies CSS spacing rules (typically `margin-bottom: 1em` for paragraphs)

## Quick Reference

| Action            | Result                      | Spacing                                  |
| ----------------- | --------------------------- | ---------------------------------------- |
| Press Enter once  | New paragraph               | Standard paragraph spacing (1em)         |
| Press Enter twice | New paragraph + empty block | May create extra space (not recommended) |
| Type normally     | Text in same block          | No spacing (same paragraph)              |

## Recommendation

**Use one Enter between paragraphs.** This is the standard approach and will render correctly with proper spacing. The frontend CSS handles the visual spacing between blocks, so you don't need to add extra empty lines.

If you need more spacing in specific places, that should be handled by:

1. Frontend CSS adjustments
2. Using headings to create visual breaks
3. Adding images or other block types for visual separation

## Example: Proper Article Formatting

```
## Introduction

This is the opening paragraph that introduces the topic.

This is the second paragraph that continues the introduction.

## Main Section

This paragraph starts the main section.

This paragraph continues the main section.

### Subsection

This is a subsection paragraph.

- First bullet point
- Second bullet point
- Third bullet point

This paragraph comes after the list.
```

**Key points:**

- One Enter between each paragraph
- One Enter before/after headings
- One Enter before/after lists
- No extra empty lines needed
