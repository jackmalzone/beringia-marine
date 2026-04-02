## Studio Launch System — Section Blueprints (adapted from Vital Ice)

This is a practical “build sheet” for Shopify theme sections and their settings/blocks, derived from the Vital Ice site patterns.

Conventions:
- **Settings** = section-level controls visible in Theme Editor
- **Blocks** = repeatable sub-items (Shopify blocks)
- **Guardrails** = constraints to keep merchant edits on-brand (length limits, required fields)

---

## 1) `hero-media`

### Purpose
Above-the-fold identity + CTA. Supports image or video background with overlay for readability.

### Settings
- **heading** (text, required, 20–60 chars)
- **subheading** (textarea, optional, 40–180 chars)
- **media_type** (select: image | video)
- **image** (image_picker)
- **video_url** (url) + **poster_image** (image_picker)
- **overlay_enabled** (bool)
- **overlay_opacity** (range 0–0.8)
- **overlay_color** (color)
- **alignment** (select: left | center | right)
- **max_text_width** (select: sm | md | lg)
- **primary_cta_label** (text) + **primary_cta_link** (url/page/product)
- **secondary_cta_label/link** (optional)

### Guardrails
- If `media_type=video` require `poster_image`.
- If `overlay_enabled=false`, warn when using video (readability).

---

## 2) `services-grid`

### Purpose
Service “menu” as clickable cards; primary navigation and conversion driver.

### Settings
- **heading** (text)
- **subheading** (textarea)
- **columns_desktop** (2–4)
- **columns_mobile** (1–2)
- **card_style** (select: glass | outlined | gradient)
- **show_subtitle** (bool)
- **hover_effect** (select: lift | glow | none)

### Blocks: `service_card`
- **title** (text, required)
- **subtitle** (text)
- **image** (image_picker)
- **accent_color** (color)
- **link** (url/page/collection)

### Guardrails
- Max 8 cards per section (avoid clutter).

---

## 3) `feature-rows-protocol`

### Purpose
“Protocol + effect” storytelling for each modality (cold/sauna/red light), optimized for trust + conversion.

### Settings
- **heading**
- **intro_text**
- **layout_style** (alternating | stacked)
- **show_clinical_line** (bool)
- **show_protocol_id** (bool)

### Blocks: `protocol_feature`
- **title** (text)
- **tagline** (text)
- **metric_label** (text, e.g. Temp)
- **metric_value** (text, e.g. 40–50°F)
- **protocol_temp** (text)
- **protocol_time** (text)
- **protocol_type** (text)
- **protocol_focus** (text)
- **effect_summary** (richtext, allow emphasis)
- **effect_description** (text)
- **effect_clinical** (text, optional)
- **protocol_id** (text, optional)
- **image** (image_picker)
- **icon** (select: snowflake | flame | lightning | etc. OR image_picker)
- **accent_color** (color)
- **learn_more_link** (url/page)

### Guardrails
- Keep block count 3–6.
- Provide preset templates for common services (cold plunge, infrared sauna, traditional sauna, red light).

---

## 4) `membership-tiers`

### Purpose
Tiered pricing/membership offer with a clear purchase path.

### Settings
- **heading**
- **note_text** (e.g. “Founding memberships sold out; presales available”)
- **cta_mode** (select: product_checkout | external_link | embed_html)
- **embed_html** (html, optional; show only if mode=embed_html)

### Blocks: `tier`
- **name** (text)
- **badge** (text, optional, e.g. Presale)
- **price** (text, e.g. $179/mo)
- **compare_at** (text)
- **availability_note** (text)
- **features** (richtext or nested blocks)
- **cta_label** (text)
- **cta_link** (product/url) (if mode != embed_html)
- **accent_color** (color)

### Guardrails
- Limit tiers to 2–3.
- Keep CTA consistent (one primary action).

---

## 5) `faq`

### Purpose
Objection handling and clarity without clutter. SEO-friendly.

### Settings
- **heading**
- **intro_text**
- **output_jsonld** (bool)
- **accordion_style** (simple | bordered | glass)

### Blocks: `qa`
- **question** (text)
- **answer** (richtext)

### Guardrails
- Limit to 6–12 QAs.

---

## 6) `testimonials-grid` + `testimonials-slider` (optional)

### Purpose
Trust and social proof.

### Settings
- **heading**
- **layout** (grid | slider)
- **columns_desktop** (2–4)
- **autoplay** (bool) + **interval_ms** (if slider)

### Blocks: `testimonial`
- **quote** (textarea)
- **name** (text)
- **role** (text)
- **rating** (1–5)
- **photo** (image_picker)
- **accent_color** (color, optional)

---

## 7) `newsletter-waitlist`

### Purpose
Lead capture for launch stage.

### Settings
- **heading**
- **body**
- **placeholder**
- **button_label**
- **integration** (select: shopify_form | klaviyo_embed)
- **klaviyo_embed_html** (html, optional)

---

## 8) `logo-marquee`

### Purpose
Authority/partner proof.

### Settings
- **heading** (optional)
- **speed** (slow/medium/fast)
- **pause_on_hover** (bool)

### Blocks: `logo`
- **image**
- **link**

---

## 9) `location-hours`

### Purpose
Local conversion essentials (address, hours, contact).

### Settings
- **heading**
- **address** (textarea)
- **hours** (textarea)
- **phone**
- **email**
- **map_mode** (none | embed)
- **map_embed_html** (html, optional)

---

## 10) Theme-level presets (recommended)

### `Launch Mode` preset
- Primary CTA becomes waitlist
- Membership tiers show “presale” badge + note text
- Booking section hidden by default

### `Open & Booking` preset
- Primary CTA becomes booking
- Services grid links to service pages
- Membership section optional

