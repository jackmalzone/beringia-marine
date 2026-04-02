#!/bin/bash

# SEO Verification Script
# Quickly verify all SEO implementations.
# curl (HTTP response body) is the canonical validation for SEO content; View Source is secondary and can be misleading with streaming.

BASE_URL="https://www.vitalicesf.com"
ERRORS=0

echo "🔍 SEO Verification Script"
echo "=========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command succeeded
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        ((ERRORS++))
    fi
}

# 1. Check sitemap accessibility
echo "1. Checking sitemap..."
if curl -s -f "$BASE_URL/sitemap.xml" > /dev/null 2>&1; then
    echo -e "${GREEN}   ✅ Sitemap is accessible${NC}"
    SITEMAP_COUNT=$(curl -s "$BASE_URL/sitemap.xml" | grep -c "<url>" || echo "0")
    echo "   📊 Found $SITEMAP_COUNT URLs in sitemap"
    
    # Check for insights articles
    INSIGHTS_COUNT=$(curl -s "$BASE_URL/sitemap.xml" | grep -c "insights/" || echo "0")
    if [ "$INSIGHTS_COUNT" -gt 0 ]; then
        echo -e "${GREEN}   ✅ Found $INSIGHTS_COUNT insights articles in sitemap${NC}"
    else
        echo -e "${YELLOW}   ⚠️  No insights articles found in sitemap${NC}"
        ((ERRORS++))
    fi
else
    echo -e "${RED}   ❌ Sitemap is not accessible${NC}"
    ((ERRORS++))
fi
echo ""

# 2. Check canonical URLs (align with Playwright/ssr-audit: /services, /services/cold-plunge, /insights, /insights/$TEST_SLUG)
echo "2. Checking canonical URLs..."
TEST_SLUG="holiday-glow-red-light-therapy-christmas"
CANONICAL_URLS=(
    "/services"
    "/services/cold-plunge"
    "/insights"
    "/insights/$TEST_SLUG"
)
for path in "${CANONICAL_URLS[@]}"; do
    CANONICAL=$(curl -s -H "Cache-Control: no-cache" -H "Pragma: no-cache" "$BASE_URL$path" | \
        grep -oE '<link[^>]*rel="canonical"[^>]*>' | \
        grep -oE 'href="[^"]*"' | \
        cut -d'"' -f2 || echo "")
    EXPECTED="$BASE_URL$path"
    if [ -n "$CANONICAL" ] && [ "$CANONICAL" = "$EXPECTED" ]; then
        echo -e "${GREEN}   ✅ Canonical $path${NC}"
    elif [ -n "$CANONICAL" ]; then
        echo -e "${YELLOW}   ⚠️  $path: expected $EXPECTED, got $CANONICAL${NC}"
        ((ERRORS++))
    else
        echo -e "${RED}   ❌ Canonical not found for $path${NC}"
        ((ERRORS++))
    fi
done
echo ""

# 3. Check server-side rendered content and JSON-LD (curl = canonical)
echo "3. Checking server-side rendered content..."
if curl -s -H "Cache-Control: no-cache" "$BASE_URL/services" | grep -qi "Cold Plunge"; then
    echo -e "${GREEN}   ✅ Content in page source: /services${NC}"
else
    echo -e "${YELLOW}   ⚠️  Content not found in /services source${NC}"
    ((ERRORS++))
fi
if curl -s -H "Cache-Control: no-cache" "$BASE_URL/services" | grep -qi "<h1"; then
    echo -e "${GREEN}   ✅ H1 in /services source${NC}"
else
    echo -e "${YELLOW}   ⚠️  H1 not found in /services source${NC}"
fi
# JSON-LD presence (same URLs as spec)
if curl -s -H "Cache-Control: no-cache" "$BASE_URL/services/cold-plunge" | grep -qi '"@type"'; then
    echo -e "${GREEN}   ✅ JSON-LD (@type) in /services/cold-plunge${NC}"
else
    echo -e "${RED}   ❌ JSON-LD not found in /services/cold-plunge${NC}"
    ((ERRORS++))
fi
if curl -s -H "Cache-Control: no-cache" "$BASE_URL/insights/$TEST_SLUG" | grep -qi '"@type"'; then
    echo -e "${GREEN}   ✅ JSON-LD (@type) in /insights/$TEST_SLUG${NC}"
else
    echo -e "${RED}   ❌ JSON-LD not found in /insights/$TEST_SLUG${NC}"
    ((ERRORS++))
fi
echo ""

# 4. Check for navigation links
echo "4. Checking navigation links in HTML..."
NAV_LINKS=("/" "/services" "/book" "/about" "/contact" "/insights")
FOUND_LINKS=0

for link in "${NAV_LINKS[@]}"; do
    if curl -s "$BASE_URL/services" | grep -q "href=\"$link\""; then
        ((FOUND_LINKS++))
    fi
done

if [ $FOUND_LINKS -ge 4 ]; then
    echo -e "${GREEN}   ✅ Found $FOUND_LINKS/6 main navigation links in HTML${NC}"
else
    echo -e "${YELLOW}   ⚠️  Only found $FOUND_LINKS/6 navigation links${NC}"
    ((ERRORS++))
fi

# Check for service links
SERVICE_LINKS=("cold-plunge" "infrared-sauna" "red-light-therapy")
FOUND_SERVICE_LINKS=0

for service in "${SERVICE_LINKS[@]}"; do
    if curl -s "$BASE_URL/services" | grep -q "/services/$service"; then
        ((FOUND_SERVICE_LINKS++))
    fi
done

if [ $FOUND_SERVICE_LINKS -gt 0 ]; then
    echo -e "${GREEN}   ✅ Found $FOUND_SERVICE_LINKS/3 service links in HTML${NC}"
else
    echo -e "${YELLOW}   ⚠️  Service links not found in HTML${NC}"
fi
echo ""

# 5. Check robots.txt
echo "5. Checking robots.txt..."
if curl -s -f "$BASE_URL/robots.txt" > /dev/null 2>&1; then
    if curl -s "$BASE_URL/robots.txt" | grep -q "Sitemap:.*sitemap.xml"; then
        echo -e "${GREEN}   ✅ robots.txt references sitemap${NC}"
    else
        echo -e "${YELLOW}   ⚠️  robots.txt doesn't reference sitemap${NC}"
    fi
else
    echo -e "${YELLOW}   ⚠️  robots.txt not accessible${NC}"
fi
echo ""

# Summary
echo "=========================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS issue(s)${NC}"
    echo ""
    echo "Note: Some warnings may be expected if testing on localhost."
    echo "For production verification, test on the live site."
    exit 1
fi
