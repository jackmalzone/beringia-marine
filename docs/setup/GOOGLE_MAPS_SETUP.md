# Google Maps API Setup Guide

## Current Status

The contact page now gracefully handles missing Google Maps API keys with a fallback interface.

## Quick Setup (Optional)

### 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Maps Embed API**
4. Create credentials → API Key
5. Restrict the API key to your domain for security

### 2. Add to Environment Variables

Add to your `.env.local` file:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 3. API Restrictions (Recommended)

In Google Cloud Console, restrict your API key:

- **Application restrictions**: HTTP referrers
- **Website restrictions**: Add your domains:
  - `localhost:3000/*` (for development)
  - `yourdomain.com/*` (for production)
- **API restrictions**: Maps Embed API only

## Current Fallback Behavior

### Without API Key

- Shows elegant fallback interface with location icon
- Displays full address information
- "Get Directions" and "View on Google Maps" buttons still work
- No broken iframe or error messages

### With Valid API Key

- Shows interactive embedded Google Map
- Full map functionality with zoom, pan, etc.
- Same action buttons for consistency

## Cost Considerations

### Free Tier

- Google Maps provides $200/month free credit
- Maps Embed API: ~28,000 free map loads per month
- Sufficient for most small business websites

### Alternative Solutions

If you prefer not to use Google Maps API:

1. **Keep Current Fallback** - Clean, professional appearance
2. **Static Map Image** - Create custom location graphic
3. **OpenStreetMap** - Free alternative (requires more setup)

## Testing

### Test Without API Key

1. Remove or comment out `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`
2. Restart development server
3. Visit contact page - should show fallback interface

### Test With API Key

1. Add valid API key to `.env.local`
2. Restart development server
3. Visit contact page - should show embedded map

## Security Notes

- Never commit API keys to version control
- Always restrict API keys to specific domains
- Monitor usage in Google Cloud Console
- Consider setting usage quotas to prevent unexpected charges

## Support

The current implementation is production-ready with or without the API key. The fallback provides excellent user experience while you decide whether to add the API integration.
