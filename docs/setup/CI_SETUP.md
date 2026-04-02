# CI/CD Setup with Sentry Integration

## Overview

This project is configured with comprehensive CI/CD pipelines that include Sentry integration for error tracking, performance monitoring, and source map management.

## GitHub Secrets Required

### Sentry Secrets

- `SENTRY_AUTH_TOKEN`: Your Sentry authentication token
- `NEXT_PUBLIC_SENTRY_DSN`: Your Sentry DSN for client-side error tracking

### Vercel Secrets (if using Vercel)

- `VERCEL_TOKEN`: Your Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## Workflows

### 1. Main CI/CD Pipeline (`ci.yml`)

- **Triggers**: Push to main/master/develop, PR to main/master
- **Jobs**:
  - **Test**: Linting, type checking, tests
  - **Build**: Application build with Sentry integration
  - **Deploy Staging**: Deploy to staging environment
  - **Deploy Production**: Deploy to production environment

### 2. Sentry Release (`sentry.yml`)

- **Purpose**: Dedicated Sentry release management
- **Features**: Source map upload, release creation/finalization

### 3. Vercel Deployment (`vercel-deploy.yml`)

- **Purpose**: Vercel-specific deployment with Sentry
- **Features**: Automatic deployment to Vercel with Sentry integration

## Sentry Integration Features

### Release Management

- Automatic release creation on each deployment
- Source map upload for better error tracking
- Environment-specific releases (staging/production)

### Error Tracking

- Client-side error capture
- Server-side error tracking
- Performance monitoring
- Custom spans and transactions

### Source Maps

- Automatic upload during build process
- URL prefix configuration for Next.js
- Stripped common prefixes for cleaner stack traces

## Local Development

### Sentry CLI Commands

```bash
# Create a new release
npm run sentry:release

# Upload source maps manually
npm run sentry:sourcemaps

# Check Sentry connectivity
npx @sentry/cli info
```

### Environment Variables

```bash
# Required for Sentry
SENTRY_AUTH_TOKEN=your_auth_token
NEXT_PUBLIC_SENTRY_DSN=your_dsn

# Optional for local development
SENTRY_ENVIRONMENT=development
```

## Configuration Files

### Sentry CLI Config (`.sentryclirc`)

- Organization: seventh-foundry
- Project: sentry-rose-window
- Authentication token configuration

### Next.js Config (`next.config.ts`)

- Sentry webpack plugin integration
- Source map configuration
- Logger tree-shaking

## Deployment Process

### 1. Code Push

When code is pushed to main/master:

1. GitHub Actions triggers CI pipeline
2. Tests run (linting, type checking)
3. Sentry release is created
4. Application is built with Sentry integration
5. Source maps are uploaded to Sentry
6. Application is deployed
7. Sentry release is finalized

### 2. Error Tracking

- Errors are automatically captured and sent to Sentry
- Performance data is collected
- Custom spans track specific operations
- Browser-specific issues are tagged

### 3. Monitoring

- Real-time error alerts
- Performance dashboards
- Release tracking
- User experience monitoring

## Troubleshooting

### Common Issues

#### 1. Sentry Auth Token Issues

```bash
# Verify token is valid
npx @sentry/cli info

# Check token permissions
npx @sentry/cli projects list
```

#### 2. Source Map Upload Failures

```bash
# Check source map generation
npm run build
ls -la .next/static/chunks/

# Manual upload test
npm run sentry:sourcemaps
```

#### 3. CI Pipeline Failures

- Check GitHub secrets are properly configured
- Verify Sentry organization and project names
- Ensure environment variables are set correctly

### Debug Commands

```bash
# Test Sentry connectivity
npx @sentry/cli diagnose

# Check release status
npx @sentry/cli releases list

# View project info
npx @sentry/cli projects info
```

## Best Practices

### 1. Release Management

- Always create releases for production deployments
- Use semantic versioning when possible
- Tag releases with meaningful names

### 2. Error Handling

- Use custom error boundaries for React components
- Implement proper error logging
- Add context to error reports

### 3. Performance Monitoring

- Create custom spans for important operations
- Monitor key user interactions
- Track page load performance

### 4. Security

- Never commit Sentry auth tokens
- Use environment variables for sensitive data
- Regularly rotate authentication tokens

## Monitoring Dashboard

Access your Sentry dashboard at:
https://seventh-foundry.sentry.io/projects/sentry-rose-window/

Key metrics to monitor:

- Error rates by release
- Performance metrics
- User experience data
- Browser-specific issues
- Page reload frequency (for the specific issue you're tracking)
