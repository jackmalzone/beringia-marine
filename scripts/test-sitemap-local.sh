#!/bin/bash

# Quick script to test sitemap locally
# Usage: ./scripts/test-sitemap-local.sh [prod|local]

URL="http://localhost:3000"
if [ "$1" == "prod" ]; then
  URL="https://www.vitalicesf.com"
  echo "Testing PRODUCTION sitemap..."
else
  echo "Testing LOCAL sitemap..."
  echo "Make sure dev server is running: pnpm dev"
fi

echo ""
echo "Fetching sitemap from: $URL/sitemap.xml"
echo ""

# Fetch sitemap
SITEMAP=$(curl -s "$URL/sitemap.xml" 2>&1)

if [ $? -ne 0 ] || [ -z "$SITEMAP" ]; then
  echo "❌ Error: Could not fetch sitemap"
  echo "   Make sure the server is running"
  exit 1
fi

# Count total URLs
TOTAL=$(echo "$SITEMAP" | grep -c "<url>" || echo "0")
echo "📊 Total URLs: $TOTAL"

# Count insights URLs
INSIGHTS=$(echo "$SITEMAP" | grep -c "insights/" || echo "0")
echo "📝 Insights URLs: $INSIGHTS"

# Show insights URLs
if [ "$INSIGHTS" -gt 0 ]; then
  echo ""
  echo "✅ Insights articles found:"
  echo "$SITEMAP" | grep "insights/" | sed 's/.*<loc>\(.*\)<\/loc>.*/\1/' | head -10
else
  echo ""
  echo "⚠️  No insights articles found in sitemap"
  echo ""
  echo "Possible reasons:"
  echo "  1. Changes not deployed yet (if testing prod)"
  echo "  2. No articles published in Sanity"
  echo "  3. Sanity connection failing (checking mock data fallback)"
  echo "  4. Server not running (if testing local)"
fi

echo ""
