#!/bin/bash
# filepath: scripts/resize_images.sh

# Create directory for resized images
mkdir -p assets/img/variants

# Original image path
ORIGINAL="assets/img/profile.jpg"

# Check if original image exists
if [ ! -f "$ORIGINAL" ]; then
    echo "Error: $ORIGINAL not found"
    exit 1
fi

# Create variants using ImageMagick (install with: sudo apt install imagemagick)
echo "Creating image variants..."

# Mobile variant (371x467)
convert "$ORIGINAL" -resize 371x467^ -gravity center -extent 371x467 "assets/img/variants/profile-mobile.jpg"

# Tablet variant (600x756)
convert "$ORIGINAL" -resize 600x756^ -gravity center -extent 600x756 "assets/img/variants/profile-tablet.jpg"

# Small variant (250x315)
convert "$ORIGINAL" -resize 250x315^ -gravity center -extent 250x315 "assets/img/variants/profile-small.jpg"

# Thumbnail (150x189)
convert "$ORIGINAL" -resize 150x189^ -gravity center -extent 150x189 "assets/img/variants/profile-thumb.jpg"

echo "Image variants created in assets/img/variants/"