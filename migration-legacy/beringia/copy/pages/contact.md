# Contact page — extracted copy

**Source:** `src/app/contact/page.tsx`  
**Staging only** — form behavior was simulated in source (no backend).

## Headings and intro

- **H2:** Contact Us

**Intro paragraph 1:**  
Whether you have a project in mind, need expert insights, or just want to learn more about what we do, we'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.

**Intro paragraph 2:**  
If you prefer, you can also reach us directly via info@beringia-marine.com or +1 805 316 1417. Let's build something great together.

> **Data quality note (from source):** The `tel:` link uses `+18057040462` while the visible phone text is `+1 805 316 1417`. Resolve before Phase 2. See `config/contact.json`.

## Form fields (labels via placeholders)

| Field   | Placeholder |
|---------|-------------|
| Name    | Name        |
| Email   | Email       |
| Subject | Subject     |
| Message | Message     |

## Validation messages (user-facing)

- Name must be at least 2 characters
- Please enter a valid email address
- Subject must be at least 3 characters
- Message must be at least 10 characters

## Submit button states

- Default: Submit
- Loading: Sending...

## Post-submit messages

- Success: Thank you! Your message has been sent successfully.
- Error: Sorry, there was an error sending your message. Please try again.
