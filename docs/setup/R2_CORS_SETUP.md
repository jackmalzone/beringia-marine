# R2 CORS Setup Guide

This guide explains how to configure CORS (Cross-Origin Resource Sharing) for your Cloudflare R2 bucket to enable video playback in browsers.

## Problem

Without CORS configuration, browsers block requests to your R2 bucket from your website, causing video loading errors like:

- `MEDIA_ELEMENT_ERROR: Empty src attribute`
- CORS policy violations
- Video elements failing to load

## Solution

Configure CORS headers on your R2 bucket to allow requests from your domains.

## Method 1: Using Wrangler CLI (Recommended)

### Prerequisites

1. **Install Wrangler CLI**:

   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

### Setup

1. **Run the CORS setup script**:
   ```bash
   npm run r2:cors
   ```

This script will:

- Check if Wrangler is installed
- Create a CORS configuration file
- Apply the configuration to your R2 bucket
- Clean up temporary files

### Manual Setup

If the script doesn't work, you can set up CORS manually:

1. **Create CORS configuration file** (`cors.json`):

   ```json
   {
     "AllowedOrigins": [
       "http://localhost:3000",
       "http://localhost:3001",
       "https://vital-ice.vercel.app",
       "https://vital-ice.com",
       "https://www.vital-ice.com"
     ],
     "AllowedMethods": ["GET", "HEAD"],
     "AllowedHeaders": ["*"],
     "MaxAgeSeconds": 3600
   }
   ```

2. **Apply CORS configuration**:
   ```bash
   wrangler r2 bucket cors put vital-ice-videos --file cors.json
   ```

## Method 2: Using Cloudflare Dashboard

1. **Go to Cloudflare Dashboard**
2. **Navigate to R2** → Your bucket (`vital-ice-videos`)
3. **Go to Settings** → **CORS**
4. **Add CORS rule** with these settings:
   ```json
   {
     "AllowedOrigins": ["*"],
     "AllowedMethods": ["GET", "HEAD"],
     "AllowedHeaders": ["*"],
     "MaxAgeSeconds": 3600
   }
   ```

## CORS Configuration Explained

### AllowedOrigins

- `http://localhost:3000` - Development server
- `http://localhost:3001` - Alternative dev port
- `https://vital-ice.vercel.app` - Vercel deployment
- `https://vital-ice.com` - Production domain
- `https://www.vital-ice.com` - WWW subdomain

### AllowedMethods

- `GET` - For video file downloads
- `HEAD` - For checking file existence and metadata

### AllowedHeaders

- `*` - Allow all headers (needed for video requests)

### MaxAgeSeconds

- `3600` - Cache CORS preflight for 1 hour

## Testing

After setting up CORS:

1. **Check browser console** for CORS errors
2. **Test video playback** on your website
3. **Verify headers** with curl:
   ```bash
   curl -H "Origin: http://localhost:3000" -I "https://pub-3fd38cef83ec4139b038b229662d7717.r2.dev/cold-ambient-1.mp4"
   ```

You should see `Access-Control-Allow-Origin: http://localhost:3000` in the response.

## Troubleshooting

### Common Issues

1. **"Wrangler not found"**

   - Install Wrangler: `npm install -g wrangler`
   - Login: `wrangler login`

2. **"Bucket not found"**

   - Verify bucket name in `wrangler.toml`
   - Check Cloudflare dashboard for correct bucket name

3. **CORS still not working**
   - Clear browser cache
   - Check if domain is in AllowedOrigins
   - Verify CORS configuration was applied

### Debug Commands

```bash
# Check CORS configuration
wrangler r2 bucket cors list vital-ice-videos

# Test CORS headers
curl -H "Origin: http://localhost:3000" -I "https://pub-3fd38cef83ec4139b038b229662d7717.r2.dev/cold-ambient-1.mp4"
```

## Security Considerations

- **Production**: Use specific domains instead of `*` for AllowedOrigins
- **Development**: `*` is acceptable for local development
- **Headers**: Only allow necessary headers for your use case

## Files

- `scripts/setup-r2-cors.js` - Automated CORS setup script
- `wrangler.toml` - Wrangler configuration
- `docs/R2_CORS_SETUP.md` - This documentation
