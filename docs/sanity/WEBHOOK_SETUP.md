# Sanity Webhook Setup Guide

## Webhook Configuration for Instant Article Updates

This guide provides the exact values to use when setting up the revalidation webhook in Sanity Studio.

---

## Webhook Form Fields

### **Name** \*

```
Vital Ice - Article Revalidation
```

### **Description**

```
Revalidates Next.js pages when articles are published, updated, or deleted in Sanity.
Ensures articles appear immediately on the website without waiting for ISR revalidation period.
Triggers on: article creation, updates, and deletions.
```

### **URL** \*

```
https://your-domain.com/api/revalidate?secret=YOUR_REVALIDATION_SECRET
```

**For local development/testing:**

```
http://localhost:3000/api/revalidate?secret=YOUR_REVALIDATION_SECRET
```

**Important:** Replace:

- `your-domain.com` with your actual production domain
- `YOUR_REVALIDATION_SECRET` with the secret from your `.env.local` file

### **Dataset**

Select: `production` (or your dataset name)

### **Trigger on**

Check all three:

- ✅ **Create** - New articles appear immediately
- ✅ **Update** - Article edits appear immediately
- ✅ **Delete** - Removed articles disappear immediately

### **Filter**

```
_type == "article"
```

This ensures the webhook only triggers for article documents, not other content types.

### **Projection**

(Leave empty - default payload is sufficient)

### **Status**

✅ **Enable webhook** (checked)

### **Advanced Settings**

#### **HTTP method**

```
POST
```

#### **HTTP headers**

(Leave empty - no additional headers needed)

#### **API version**

```
v2024-01-01
```

**Note:** This should match your `NEXT_PUBLIC_SANITY_API_VERSION` environment variable.

#### **Drafts**

❌ **Unchecked** (Trigger webhook when drafts are modified)

**Why:** Drafts shouldn't trigger revalidation since they're not published yet. Only published articles should update the live site.

#### **Versions**

❌ **Unchecked** (Trigger webhook when versions are modified)

**Why:** Versions are for scheduled releases, not immediate updates.

#### **Secret**

```
(Leave empty - secret is in URL query parameter)
```

**Note:** The secret is passed as a URL query parameter (`?secret=...`), not in this field. This field is for webhook signature verification (optional).

---

## Environment Variable Setup

Before configuring the webhook, add this to your `.env.local`:

```env
REVALIDATION_SECRET=your-secure-random-string-here
```

**Generate a secure secret:**

Option 1 (Recommended - no padding characters):

```bash
openssl rand -hex 32
```

Option 2 (Base64 - remove `=` if present):

```bash
openssl rand -base64 32 | tr -d '='
```

Option 3 (Node.js):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Note:** The `=` characters in base64 output can cause issues with `.env` files. Use hex encoding (Option 1) or strip the `=` characters (Option 2).

---

## Complete Example

Here's what your webhook configuration should look like:

**Name:** `Vital Ice - Article Revalidation`

**Description:** `Revalidates Next.js pages when articles are published, updated, or deleted in Sanity. Ensures articles appear immediately on the website without waiting for ISR revalidation period.`

**URL:** `https://vitalicesf.com/api/revalidate?secret=abc123xyz789...` (your actual secret)

**Dataset:** `production`

**Trigger on:**

- ✅ Create
- ✅ Update
- ✅ Delete

**Filter:** `_type == "article"`

**HTTP method:** `POST`

**API version:** `v2024-01-01`

**Drafts:** ❌ Unchecked

**Versions:** ❌ Unchecked

---

## Testing the Webhook

### 1. Test Locally (Development)

1. Add `REVALIDATION_SECRET` to `.env.local` (use hex encoding to avoid `=` characters)
2. Start your dev server: `pnpm dev`
3. Use localhost URL in webhook: `http://localhost:3000/api/revalidate?secret=YOUR_SECRET`
4. Publish an article in Sanity Studio
5. Check your terminal for revalidation logs

### 2. Test in Production

1. Deploy your site with the webhook API route
2. Configure webhook with production URL
3. Publish a test article
4. Verify it appears immediately on the website

### 3. Manual Test (GET endpoint)

You can test the endpoint directly:

```bash
# Test revalidation
curl "http://localhost:3000/api/revalidate?secret=YOUR_SECRET&path=/insights"

# Should return:
# {"revalidated":true,"path":"/insights","now":1234567890}
```

---

## Troubleshooting

### Webhook not triggering?

1. **Check secret matches:** Ensure the secret in the URL matches `REVALIDATION_SECRET` in `.env.local`
2. **Verify URL is accessible:** Test the endpoint manually with curl
3. **Check Sanity webhook logs:** Go to Project Settings → API → Webhooks → View logs
4. **Verify filter:** Make sure `_type == "article"` matches your document type
5. **Check dataset:** Ensure webhook is configured for the correct dataset

### Articles not updating?

1. **Check server logs:** Look for revalidation confirmation messages
2. **Verify ISR:** Even with webhooks, ensure `revalidate = 3600` is set as fallback
3. **Test manually:** Use the GET endpoint to manually trigger revalidation
4. **Check article status:** Ensure articles are "published" not "draft"

### Getting 401 errors?

- Secret mismatch between URL and environment variable
- Check `REVALIDATION_SECRET` is set correctly
- Verify the secret in the webhook URL matches exactly

---

## Security Notes

- ✅ Secret is in URL query parameter (protected by HTTPS in production)
- ✅ Secret is validated server-side before revalidation
- ✅ Invalid secrets return 401 Unauthorized
- ⚠️ Don't commit `REVALIDATION_SECRET` to git (should be in `.env.local`)
- ⚠️ Use different secrets for development and production

---

## Next Steps

1. ✅ Add `REVALIDATION_SECRET` to `.env.local`
2. ✅ Configure webhook in Sanity Studio using values above
3. ✅ Test by publishing an article
4. ✅ Verify article appears immediately on website
5. ✅ Monitor server logs for revalidation confirmations

---

**Last Updated:** After webhook API route creation
**Status:** Ready for configuration
