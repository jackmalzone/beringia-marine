# Font Setup Guide for Vital Ice

## 🎯 **Recommended Approach: Self-Host Fonts**

For optimal performance and brand consistency, we recommend **downloading and self-hosting** the fonts rather than embedding from Google Fonts.

## 📥 **Quick Setup**

### Option 1: Automated Download (Recommended)

```bash
# Run the automated download script
./scripts/download-fonts.sh
```

### Option 2: Manual Download

1. Visit [Google Fonts](https://fonts.google.com/)
2. Download these fonts:
   - **Bebas Neue** (Regular, Bold)
   - **Montserrat** (Light, Regular, Medium, SemiBold, Bold)
   - **Inter** (Regular, Medium, SemiBold)

## 🗂️ **File Structure**

```
public/
└── fonts/
    ├── BebasNeue-Regular.woff2
    ├── BebasNeue-Regular.woff
    ├── BebasNeue-Bold.woff2
    ├── BebasNeue-Bold.woff
    ├── Montserrat-Light.woff2
    ├── Montserrat-Light.woff
    ├── Montserrat-Regular.woff2
    ├── Montserrat-Regular.woff
    ├── Montserrat-Medium.woff2
    ├── Montserrat-Medium.woff
    ├── Montserrat-SemiBold.woff2
    ├── Montserrat-SemiBold.woff
    ├── Montserrat-Bold.woff2
    ├── Montserrat-Bold.woff
    ├── Inter-Regular.woff2
    ├── Inter-Regular.woff
    ├── Inter-Medium.woff2
    ├── Inter-Medium.woff
    ├── Inter-SemiBold.woff2
    └── Inter-SemiBold.woff
```

## 🔧 **Font Conversion (Optional but Recommended)**

For optimal performance, convert TTF files to WOFF2/WOFF:

### Using Online Tools:

1. [FontSquirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator)
2. [Transfonter](https://transfonter.org/)
3. [CloudConvert](https://cloudconvert.com/ttf-to-woff2)

### Using Command Line (if you have tools installed):

```bash
# Install ttf2woff2 (macOS)
brew install woff2

# Convert TTF to WOFF2
ttf2woff2 BebasNeue-Regular.ttf
ttf2woff2 Montserrat-Regular.ttf
# ... repeat for all fonts
```

## 🎨 **Typography System**

### Font Usage:

- **Bebas Neue**: Headers, titles, brand elements
- **Montserrat**: Body text, paragraphs, general content
- **Inter**: UI elements, buttons, forms

### CSS Variables:

```css
:root {
  --font-heading: 'Bebas Neue', sans-serif;
  --font-body: 'Montserrat', sans-serif;
  --font-ui: 'Inter', sans-serif;
}
```

### Usage Examples:

```css
/* Headers */
h1,
h2,
h3 {
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Body text */
p,
div {
  font-family: var(--font-body);
  font-weight: 300;
}

/* UI elements */
button,
input {
  font-family: var(--font-ui);
  font-weight: 500;
}
```

## ⚡ **Performance Optimization**

### Font Display Strategy:

```css
@font-face {
  font-family: 'Bebas Neue';
  src: url('/fonts/BebasNeue-Regular.woff2') format('woff2');
  font-display: swap; /* Prevents FOIT */
}
```

### Preload Critical Fonts:

Add to your HTML head:

```html
<link rel="preload" href="/fonts/BebasNeue-Regular.woff2" as="font" type="font/woff2" crossorigin />
<link
  rel="preload"
  href="/fonts/Montserrat-Regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

## 🧪 **Testing**

### Check Font Loading:

1. Open browser dev tools
2. Go to Network tab
3. Filter by "Font"
4. Reload page
5. Verify fonts load from your domain

### Font Fallbacks:

```css
font-family: 'Bebas Neue', 'Arial Black', sans-serif;
font-family: 'Montserrat', 'Arial', sans-serif;
font-family: 'Inter', 'Helvetica', sans-serif;
```

## 📊 **File Size Comparison**

| Format | Size | Browser Support |
| ------ | ---- | --------------- |
| TTF    | 100% | All browsers    |
| WOFF   | 75%  | All browsers    |
| WOFF2  | 50%  | Modern browsers |

## 🔍 **Troubleshooting**

### Common Issues:

1. **Fonts not loading**: Check file paths and CORS headers
2. **FOIT (Flash of Invisible Text)**: Use `font-display: swap`
3. **Large file sizes**: Convert to WOFF2 format
4. **Missing characters**: Ensure font files include all needed glyphs

### Debug Commands:

```bash
# Check if fonts exist
ls -la public/fonts/

# Check file sizes
du -h public/fonts/*

# Verify file types
file public/fonts/*
```

## 🎯 **Best Practices**

1. **Use WOFF2** as primary format with WOFF fallback
2. **Preload critical fonts** (hero text, navigation)
3. **Use `font-display: swap`** to prevent FOIT
4. **Subset fonts** to include only needed characters
5. **Compress font files** for faster loading
6. **Test on multiple devices** and browsers

## 📱 **Mobile Considerations**

- Fonts load slower on mobile networks
- Consider using system fonts as fallbacks
- Test font rendering on various screen densities
- Ensure adequate contrast ratios

## 🔄 **Alternative: Google Fonts Embedding**

If you prefer to embed from Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

**Pros**: Easy setup, automatic optimization
**Cons**: External dependency, potential privacy concerns, slower loading

## ✅ **Final Checklist**

- [ ] Fonts downloaded and placed in `public/fonts/`
- [ ] Font files converted to WOFF2/WOFF
- [ ] CSS variables updated in `globals.css`
- [ ] Font preloading added to HTML
- [ ] Font loading tested in browser
- [ ] Performance tested on mobile
- [ ] Fallback fonts configured
- [ ] Typography system documented

---

**Note**: The automated script will download the fonts, but you may want to convert them to WOFF2 format for optimal performance. The current setup uses TTF files as fallbacks for maximum compatibility.
