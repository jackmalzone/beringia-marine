#!/bin/bash

# Font Download Script for Vital Ice
# Downloads Bebas Neue, Montserrat, and Inter fonts from Google Fonts

echo "🎨 Downloading fonts for Vital Ice..."

# Create fonts directory if it doesn't exist
mkdir -p public/fonts

# Download Bebas Neue
echo "📥 Downloading Bebas Neue..."
curl -L "https://fonts.gstatic.com/s/bebasneue/v9/JTUSjIg69CK48gW7PXoo9WlhI.ttf" -o "public/fonts/BebasNeue-Regular.ttf"
curl -L "https://fonts.gstatic.com/s/bebasneue/v9/JTUTjIg69CK48gW7PXoo9WlhJTUg.ttf" -o "public/fonts/BebasNeue-Bold.ttf"

# Download Montserrat
echo "📥 Downloading Montserrat..."
curl -L "https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.ttf" -o "public/fonts/Montserrat-Light.ttf"
curl -L "https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.ttf" -o "public/fonts/Montserrat-Regular.ttf"
curl -L "https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.ttf" -o "public/fonts/Montserrat-Medium.ttf"
curl -L "https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.ttf" -o "public/fonts/Montserrat-SemiBold.ttf"
curl -L "https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.ttf" -o "public/fonts/Montserrat-Bold.ttf"

# Download Inter
echo "📥 Downloading Inter..."
curl -L "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" -o "public/fonts/Inter-Regular.woff2"
curl -L "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff" -o "public/fonts/Inter-Regular.woff"
curl -L "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" -o "public/fonts/Inter-Medium.woff2"
curl -L "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff" -o "public/fonts/Inter-Medium.woff"
curl -L "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" -o "public/fonts/Inter-SemiBold.woff2"
curl -L "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff" -o "public/fonts/Inter-SemiBold.woff"

echo "✅ Fonts downloaded successfully!"
echo "📁 Fonts are now in: public/fonts/"
echo ""
echo "🔧 Next steps:"
echo "1. Convert TTF files to WOFF2/WOFF for better performance"
echo "2. Update font-face declarations if needed"
echo "3. Test font loading in your browser" 