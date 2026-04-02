# Studio Security Configuration

## Basic Auth Implementation

The Studio application is protected with Basic Auth middleware that runs on all routes except development mode.

### Security Features

1. **Authentication Required**: All routes require valid credentials
2. **Fallback Protection**: Service becomes unavailable if credentials aren't configured
3. **Security Headers**: Adds protective headers to authenticated requests
4. **Error Handling**: Graceful handling of malformed auth headers

### Environment Variables

Required environment variables for production:

```bash
STUDIO_USERNAME=your_username
STUDIO_PASSWORD=your_secure_password
```

**Password Requirements:**

- Minimum 12 characters
- Include numbers and symbols
- Avoid common passwords
- Use a password manager

### Security Headers

The middleware adds these security headers to authenticated requests:

- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information

### Testing Authentication

Use the included test script to verify authentication:

```bash
# Set test credentials
export STUDIO_USERNAME=admin
export STUDIO_PASSWORD=your_password

# Run tests (requires studio server running)
node test-auth.js http://localhost:3001
```

### Production Deployment

1. **Vercel Environment Variables**: Set `STUDIO_USERNAME` and `STUDIO_PASSWORD` in Vercel dashboard
2. **Strong Credentials**: Use generated passwords, not dictionary words
3. **HTTPS Only**: Ensure studio is only accessible via HTTPS in production
4. **Monitor Access**: Review Vercel logs for unauthorized access attempts

### Fallback Security Measures

1. **Missing Credentials**: Returns 503 Service Unavailable if auth vars not set
2. **Malformed Headers**: Gracefully handles invalid Basic Auth headers
3. **Development Mode**: Bypasses auth in development for easier testing
4. **Error Logging**: Logs authentication errors for monitoring

### Future Enhancements

Consider upgrading to more robust authentication:

1. **Vercel Team SSO**: Use Vercel's built-in team authentication
2. **OAuth Integration**: Integrate with Google/GitHub OAuth
3. **2FA Support**: Add two-factor authentication
4. **Session Management**: Implement session-based auth with timeouts

### Security Checklist

- [ ] Strong username and password configured
- [ ] Environment variables set in Vercel
- [ ] HTTPS enforced in production
- [ ] Test authentication flow works
- [ ] Monitor access logs regularly
- [ ] Review and rotate credentials periodically
