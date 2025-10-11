#!/bin/bash
# filepath: scripts/create_favicon.sh

# Source image (use a square image ideally)
SOURCE="assets/img/head-rembg-thumb.png"  # or any other square image you prefer

# Create favicon directory
mkdir -p assets/favicon

echo "Creating favicon variants..."

# Create different sizes for favicon
convert "$SOURCE" -resize 16x16 "assets/favicon/favicon-16x16.png"
convert "$SOURCE" -resize 32x32 "assets/favicon/favicon-32x32.png"
convert "$SOURCE" -resize 48x48 "assets/favicon/favicon-48x48.png"
convert "$SOURCE" -resize 96x96 "assets/favicon/favicon-96x96.png"
# convert "$SOURCE" -resize 144x144 "assets/favicon/favicon-144x144.png"
# convert "$SOURCE" -resize 192x192 "assets/favicon/favicon-192x192.png"
# convert "$SOURCE" -resize 512x512 "assets/favicon/favicon-512x512.png"

# Create Apple Touch icons
convert "$SOURCE" -resize 180x180 "assets/favicon/apple-touch-icon.png"
convert "$SOURCE" -resize 120x120 "assets/favicon/apple-touch-icon-120x120.png"

# Create .ico file (multi-size)
convert "$SOURCE" -resize 16x16 -resize 32x32 -resize 48x48 "assets/favicon/favicon.ico"

echo "Favicon files created in assets/favicon/"